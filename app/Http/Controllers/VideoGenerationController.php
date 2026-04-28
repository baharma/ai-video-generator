<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVideoGenerationRequest;
use App\Models\AiUsageLog;
use App\Models\VideoGeneration;
use App\Service\VideoApiServiceApi\VideoApiServiceApi;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Throwable;

class VideoGenerationController extends Controller
{
    public function __construct(private readonly VideoApiServiceApi $videoApi)
    {
    }

    public function index(Request $request): Response
    {
        $search = (string) $request->query('search', '');
        $videoType = (string) $request->query('video_type', '');

        $generations = VideoGeneration::query()
            ->where('user_id', $request->user()->id)
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('topic', 'like', "%{$search}%")
                        ->orWhere('keywords', 'like', "%{$search}%");
                });
            })
            ->when($videoType !== '', fn ($query) => $query->where('video_type', $videoType))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (VideoGeneration $generation): array => $this->summaryPayload($generation));

        return Inertia::render('Generations/Index', [
            'generations' => $generations,
            'filters' => [
                'search' => $search,
                'video_type' => $videoType,
            ],
            'videoTypes' => $this->videoTypes(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Generations/Create', [
            'options' => [
                'videoTypes' => $this->videoTypes(),
                'tones' => $this->tones(),
                'durations' => [
                    ['label' => '5 seconds', 'value' => '5'],
                    ['label' => '10 seconds', 'value' => '10'],
                    ['label' => '15 seconds', 'value' => '15'],
                    ['label' => '30 seconds', 'value' => '30'],
                ],
                'models' => [
                    ['label' => 'LTX-2', 'value' => 'ltx-2'],
                    ['label' => 'Default recommended', 'value' => 'default'],
                    ['label' => 'WAN 2.2', 'value' => 'wan-2.2'],
                    ['label' => 'Kling 3.0', 'value' => 'kling-3.0'],
                ],
                'resolutions' => ['480p', '720p', '1080p'],
                'aspectRatios' => [
                    ['label' => 'Landscape 16:9', 'value' => '16:9'],
                    ['label' => 'Portrait 9:16', 'value' => '9:16'],
                    ['label' => 'Square 1:1', 'value' => '1:1'],
                ],
            ],
            'defaults' => [
                'video_type' => 'Marketing Video',
                'tone' => 'Persuasive',
                'duration' => '30',
                'model' => 'ltx-2',
                'resolution' => '720p',
                'aspect_ratio' => '16:9',
                'submit_video' => true,
                'audio' => false,
            ],
        ]);
    }

    public function store(StoreVideoGenerationRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $story = $this->buildStoryPlan($validated);
        $prompt = ($validated['prompt'] ?? null) ?: $this->buildVideoPrompt($validated, $story);
        $generation = null;

        try {
            $generation = DB::transaction(function () use ($request, $validated, $story, $prompt): VideoGeneration {
                $generation = VideoGeneration::create([
                    'user_id' => $request->user()->id,
                    'video_type' => $validated['video_type'] ?? null,
                    'topic' => $validated['topic'],
                    'keywords' => $validated['keywords'] ?? null,
                    'target_audience' => $validated['target_audience'] ?? null,
                    'tone' => $validated['tone'] ?? null,
                    'duration' => $validated['duration'] ?? null,
                    'prompt' => $prompt,
                    'title' => $story['title'],
                    'summary' => $story['summary'],
                    'script' => $story['script'],
                    'cta' => $story['cta'],
                    'scenes' => $story['scenes'],
                    'raw_ai_response' => json_encode([
                        'provider' => 'local_template',
                        'generated_at' => now()->toIso8601String(),
                        'result' => $story,
                    ]),
                    'script_provider' => 'local_template',
                    'video_provider' => ($validated['submit_video'] ?? true) ? 'magic_hour' : null,
                    'status' => 'generating_script',
                ]);

                $this->recordEvent($generation, $request->user()->id, 'generation_created', null, 'generating_script');

                foreach ($story['scenes'] as $scene) {
                    $generation->scenes()->create($scene);
                }

                $generation->update(['status' => 'script_generated']);
                $this->recordEvent($generation, $request->user()->id, 'script_generation_completed', 'generating_script', 'script_generated');

                return $generation;
            });

            if (!($validated['submit_video'] ?? true)) {
                return redirect()
                    ->route('generations.show', $generation)
                    ->with('success', 'Script and storyboard saved.');
            }

            $this->recordEvent($generation, $request->user()->id, 'video_submission_started', 'script_generated', 'video_submitted');

            $submitResult = $this->videoApi->submitTextToVideo($prompt, [
                'name' => $validated['name'] ?? $story['title'],
                'end_seconds' => $this->durationSeconds($validated['duration'] ?? null),
                'model' => $validated['model'] ?? 'ltx-2',
                'resolution' => $validated['resolution'] ?? '720p',
                'aspect_ratio' => $validated['aspect_ratio'] ?? '16:9',
                'audio' => $validated['audio'] ?? false,
            ]);

            $this->recordUsageLog($request, $generation, 'submit_video', $submitResult, $validated['model'] ?? 'ltx-2');

            if (!$submitResult['successful'] || !is_array($submitResult['data']) || empty($submitResult['data']['id'])) {
                $message = $submitResult['error_message'] ?? 'Magic Hour did not return a video project id.';

                $generation->update([
                    'status' => 'failed',
                    'error_message' => $message,
                    'raw_video_submit_response' => $submitResult['data'],
                ]);
                $this->recordEvent($generation, $request->user()->id, 'video_failed', 'video_submitted', 'failed', $message, $submitResult['data']);

                return redirect()
                    ->route('generations.show', $generation)
                    ->with('error', $message);
            }

            $generation->update([
                'provider_project_id' => $submitResult['data']['id'],
                'provider_status' => 'queued',
                'estimated_frame_cost' => $this->nullableUnsigned($submitResult['data']['estimated_frame_cost'] ?? null),
                'credits_charged' => $this->nullableUnsigned($submitResult['data']['credits_charged'] ?? null),
                'raw_video_submit_response' => $submitResult['data'],
                'status' => 'video_processing',
            ]);
            $this->recordEvent($generation, $request->user()->id, 'video_submitted', 'video_submitted', 'video_processing', null, $submitResult['data']);

            $projectResult = $this->videoApi->getVideoProject($submitResult['data']['id']);
            $this->recordUsageLog($request, $generation, 'fetch_video_project', $projectResult, $validated['model'] ?? null);

            if ($projectResult['successful'] && is_array($projectResult['data'])) {
                $this->applyVideoProjectResponse($generation, $projectResult['data'], $request->user()->id);
            }

            return redirect()
                ->route('generations.show', $generation)
                ->with('success', 'Video request submitted to Magic Hour.');
        } catch (Throwable $e) {
            if ($generation) {
                $previousStatus = $generation->status;
                $generation->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
                $this->recordEvent($generation, $request->user()->id, 'video_failed', $previousStatus, 'failed', $e->getMessage());
            }

            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    public function show(Request $request, VideoGeneration $generation): Response
    {
        $this->authorizeOwner($request, $generation);

        return Inertia::render('Generations/Show', [
            'generation' => $this->detailPayload($generation),
            'usageLogs' => $generation->usageLogs()
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn (AiUsageLog $log): array => [
                    'id' => $log->id,
                    'provider' => $log->provider,
                    'action' => $log->action,
                    'http_status' => $log->http_status,
                    'success' => $log->success,
                    'duration_ms' => $log->duration_ms,
                    'credits_charged' => $log->credits_charged,
                    'error_message' => $log->error_message,
                    'created_at' => $log->created_at?->format('Y-m-d H:i:s'),
                ]),
            'events' => $generation->events()
                ->latest()
                ->limit(20)
                ->get()
                ->map(fn ($event): array => [
                    'id' => $event->id,
                    'event_type' => $event->event_type,
                    'from_status' => $event->from_status,
                    'to_status' => $event->to_status,
                    'message' => $event->message,
                    'created_at' => $event->created_at?->format('Y-m-d H:i:s'),
                ]),
        ]);
    }

    public function refresh(Request $request, VideoGeneration $generation): RedirectResponse
    {
        $this->authorizeOwner($request, $generation);

        if (!$generation->provider_project_id) {
            return back()->with('error', 'This generation does not have a Magic Hour project id.');
        }

        $result = $this->videoApi->getVideoProject($generation->provider_project_id);
        $this->recordUsageLog($request, $generation, 'fetch_video_project', $result);

        if (!$result['successful'] || !is_array($result['data'])) {
            $message = $result['error_message'] ?? 'Unable to fetch Magic Hour project.';
            $generation->update(['error_message' => $message]);

            return back()->with('error', $message);
        }

        $this->applyVideoProjectResponse($generation, $result['data'], $request->user()->id);

        return back()->with('success', 'Magic Hour project status refreshed.');
    }

    public function export(Request $request, VideoGeneration $generation): HttpResponse
    {
        $this->authorizeOwner($request, $generation);

        $content = implode(PHP_EOL . PHP_EOL, array_filter([
            $generation->title,
            $generation->summary,
            "SCRIPT:\n{$generation->script}",
            "CALL TO ACTION:\n{$generation->cta}",
            "VIDEO URL:\n{$generation->video_url}",
        ]));

        return response($content, 200, [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => 'attachment; filename="generation-' . $generation->id . '.txt"',
        ]);
    }

    public function destroy(Request $request, VideoGeneration $generation): RedirectResponse
    {
        $this->authorizeOwner($request, $generation);
        $this->recordEvent($generation, $request->user()->id, 'generation_deleted', $generation->status, null);
        $generation->delete();

        return redirect()
            ->route('generations.index')
            ->with('success', 'Generation deleted.');
    }

    private function applyVideoProjectResponse(VideoGeneration $generation, array $data, int $userId): void
    {
        $previousStatus = $generation->status;
        $providerStatus = $data['status'] ?? null;
        $status = $this->applicationStatus($providerStatus);
        $downloads = $data['downloads'] ?? null;
        $download = $data['download'] ?? Arr::first($downloads ?? []);
        $errorMessage = $this->stringifyError($data['error'] ?? null);

        $generation->update([
            'provider_project_name' => $data['name'] ?? $generation->provider_project_name,
            'provider_project_type' => $data['type'] ?? $generation->provider_project_type,
            'provider_status' => $providerStatus,
            'provider_created_at' => $this->parseTimestamp($data['created_at'] ?? null),
            'width' => $this->nullableUnsigned($data['width'] ?? null),
            'height' => $this->nullableUnsigned($data['height'] ?? null),
            'enabled' => $data['enabled'] ?? $generation->enabled,
            'start_seconds' => $data['start_seconds'] ?? $generation->start_seconds,
            'end_seconds' => $data['end_seconds'] ?? $generation->end_seconds,
            'fps' => $this->nullableUnsigned($data['fps'] ?? null),
            'total_frame_cost' => $this->nullableUnsigned($data['total_frame_cost'] ?? null),
            'credits_charged' => $this->nullableUnsigned($data['credits_charged'] ?? $generation->credits_charged),
            'downloads' => $downloads,
            'download' => $download,
            'video_url' => $download['url'] ?? $generation->video_url,
            'video_url_expires_at' => $this->parseTimestamp($download['expires_at'] ?? null),
            'raw_video_project_response' => $data,
            'error_message' => $errorMessage,
            'status' => $status,
        ]);

        $eventType = match ($status) {
            'completed' => 'video_completed',
            'failed' => 'video_failed',
            default => 'video_processing',
        };

        if ($previousStatus !== $status) {
            $this->recordEvent($generation, $userId, $eventType, $previousStatus, $status, $errorMessage, $data);
        }

        if (!empty($download['url'])) {
            $this->recordEvent($generation, $userId, 'download_url_saved', $status, $status, null, $download);
        }
    }

    private function recordUsageLog(Request $request, VideoGeneration $generation, string $action, array $result, ?string $model = null): void
    {
        AiUsageLog::create([
            'user_id' => $request->user()->id,
            'video_generation_id' => $generation->id,
            'provider' => 'magic_hour',
            'action' => $action,
            'model' => $model,
            'endpoint' => $result['endpoint'] ?? null,
            'http_method' => $result['http_method'] ?? null,
            'http_status' => $result['status'] ?? null,
            'success' => $result['successful'] ?? false,
            'request_payload' => $result['request_payload'] ?? null,
            'response_payload' => $result['data'] ?? null,
            'error_message' => $result['error_message'] ?? null,
            'estimated_frame_cost' => $this->nullableUnsigned($result['data']['estimated_frame_cost'] ?? null),
            'total_frame_cost' => $this->nullableUnsigned($result['data']['total_frame_cost'] ?? null),
            'credits_charged' => $this->nullableUnsigned($result['data']['credits_charged'] ?? null),
            'duration_ms' => $result['duration_ms'] ?? null,
        ]);
    }

    private function recordEvent(
        VideoGeneration $generation,
        ?int $userId,
        string $eventType,
        ?string $fromStatus = null,
        ?string $toStatus = null,
        ?string $message = null,
        mixed $rawPayload = null,
    ): void {
        $generation->events()->create([
            'user_id' => $userId,
            'event_type' => $eventType,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'message' => $message,
            'raw_payload' => $rawPayload,
        ]);
    }

    private function buildStoryPlan(array $data): array
    {
        $topic = trim($data['topic']);
        $videoType = ($data['video_type'] ?? null) ?: 'AI Video';
        $tone = ($data['tone'] ?? null) ?: 'Clear';
        $audience = ($data['target_audience'] ?? null) ?: 'general viewers';
        $keywords = ($data['keywords'] ?? null) ?: 'main idea, benefit, action';
        $seconds = $this->durationSeconds($data['duration'] ?? null);
        $step = max(1, (int) floor($seconds / 3));
        $title = Str::limit("{$topic} - {$videoType}", 250, '');

        $scenes = [
            [
                'scene_number' => 1,
                'duration' => "0-{$step}s",
                'start_seconds' => 0,
                'end_seconds' => $step,
                'visual' => "Open with a strong visual hook about {$topic}.",
                'voice_over' => "What if {$audience} could understand {$topic} in seconds?",
                'text_overlay' => Str::limit($topic, 80, ''),
                'image_prompt' => "Cinematic opening scene about {$topic}, {$tone} tone, high detail.",
            ],
            [
                'scene_number' => 2,
                'duration' => "{$step}-" . ($step * 2) . 's',
                'start_seconds' => $step,
                'end_seconds' => $step * 2,
                'visual' => "Show the key benefits and context using the keywords: {$keywords}.",
                'voice_over' => "The message is simple: focus on the right value, the right audience, and the right moment.",
                'text_overlay' => 'Key benefits',
                'image_prompt' => "Detailed middle scene showing {$keywords} for {$audience}, {$tone} style.",
            ],
            [
                'scene_number' => 3,
                'duration' => ($step * 2) . "-{$seconds}s",
                'start_seconds' => $step * 2,
                'end_seconds' => $seconds,
                'visual' => 'Close with a clear result, action, or transformation.',
                'voice_over' => "Turn this idea into action and make {$topic} easier to remember.",
                'text_overlay' => 'Take action today',
                'image_prompt' => "Memorable closing scene for {$topic}, polished video ad style.",
            ],
        ];

        return [
            'title' => $title,
            'summary' => "A {$tone} {$videoType} about {$topic} for {$audience}.",
            'script' => "Open by introducing {$topic} with a visual hook. Build interest with {$keywords}. Show why it matters for {$audience}. Close with a direct, memorable action.",
            'cta' => "Start exploring {$topic} today.",
            'scenes' => $scenes,
        ];
    }

    private function buildVideoPrompt(array $data, array $story): string
    {
        return implode("\n", [
            $story['summary'],
            "Tone: " . (($data['tone'] ?? null) ?: 'Clear'),
            "Audience: " . (($data['target_audience'] ?? null) ?: 'general viewers'),
            "Keywords: " . (($data['keywords'] ?? null) ?: '-'),
            "Script: {$story['script']}",
            'Scene breakdown:',
            collect($story['scenes'])
                ->map(fn (array $scene): string => "Scene {$scene['scene_number']}: {$scene['visual']} Voice over: {$scene['voice_over']}")
                ->implode("\n"),
        ]);
    }

    private function summaryPayload(VideoGeneration $generation): array
    {
        return [
            'id' => $generation->id,
            'title' => $generation->title ?: $generation->topic,
            'topic' => $generation->topic,
            'video_type' => $generation->video_type ?: 'Video',
            'tone' => $generation->tone ?: '-',
            'duration' => $this->formatDuration($generation->duration),
            'status' => $generation->status,
            'provider_status' => $generation->provider_status,
            'video_url' => $generation->video_url,
            'created_at' => $generation->created_at?->format('Y-m-d H:i'),
        ];
    }

    private function detailPayload(VideoGeneration $generation): array
    {
        $sceneRecords = $generation->scenes()
            ->orderBy('scene_number')
            ->get()
            ->map(fn ($scene): array => [
                'scene_number' => $scene->scene_number,
                'duration' => $scene->duration,
                'start_seconds' => $scene->start_seconds,
                'end_seconds' => $scene->end_seconds,
                'visual' => $scene->visual,
                'voice_over' => $scene->voice_over,
                'text_overlay' => $scene->text_overlay,
                'image_prompt' => $scene->image_prompt,
                'image_url' => $scene->image_url,
                'video_clip_url' => $scene->video_clip_url,
                'metadata' => $scene->metadata,
            ]);

        return [
            ...$this->summaryPayload($generation),
            'keywords' => $generation->keywords,
            'target_audience' => $generation->target_audience,
            'prompt' => $generation->prompt,
            'summary' => $generation->summary,
            'script' => $generation->script,
            'cta' => $generation->cta,
            'scenes' => $sceneRecords->isNotEmpty()
                ? $sceneRecords->values()
                : collect($generation->getAttribute('scenes') ?? [])->values(),
            'provider_project_id' => $generation->provider_project_id,
            'provider_project_name' => $generation->provider_project_name,
            'provider_project_type' => $generation->provider_project_type,
            'provider_created_at' => $generation->provider_created_at?->format('Y-m-d H:i:s'),
            'video_url_expires_at' => $generation->video_url_expires_at?->format('Y-m-d H:i:s'),
            'has_video' => $generation->hasVideo(),
            'has_provider_project' => $generation->hasProviderProject(),
            'is_video_url_expired' => $generation->isVideoUrlExpired(),
            'width' => $generation->width,
            'height' => $generation->height,
            'fps' => $generation->fps,
            'credits_charged' => $generation->credits_charged,
            'estimated_frame_cost' => $generation->estimated_frame_cost,
            'total_frame_cost' => $generation->total_frame_cost,
            'error_message' => $generation->error_message,
        ];
    }

    private function authorizeOwner(Request $request, VideoGeneration $generation): void
    {
        abort_unless($generation->user_id === $request->user()->id, 403);
    }

    private function applicationStatus(?string $providerStatus): string
    {
        return match ($providerStatus) {
            'complete' => 'completed',
            'error', 'failed', 'canceled' => 'failed',
            default => 'video_processing',
        };
    }

    private function durationSeconds(?string $duration): int
    {
        preg_match('/\d+/', (string) $duration, $matches);
        $seconds = (int) ($matches[0] ?? 30);

        return in_array($seconds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30], true)
            ? $seconds
            : 30;
    }

    private function formatDuration(?string $duration): string
    {
        if (!$duration) {
            return '-';
        }

        return is_numeric($duration) ? "{$duration} seconds" : $duration;
    }

    private function nullableUnsigned(mixed $value): ?int
    {
        if (!is_numeric($value) || (int) $value < 0) {
            return null;
        }

        return (int) $value;
    }

    private function parseTimestamp(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (Throwable) {
            return null;
        }
    }

    private function stringifyError(mixed $error): ?string
    {
        if ($error === null || $error === '') {
            return null;
        }

        return is_string($error) ? $error : json_encode($error);
    }

    /**
     * @return array<int, string>
     */
    private function videoTypes(): array
    {
        return [
            'Marketing Video',
            'Educational Clip',
            'Social Media Reel',
            'Product Demo',
            'Explainer Video',
        ];
    }

    /**
     * @return array<int, string>
     */
    private function tones(): array
    {
        return [
            'Formal',
            'Casual',
            'Persuasive',
            'Friendly',
            'Professional',
            'Inspirational',
        ];
    }
}
