<?php

namespace App\Service\VideoApiServiceApi;

use App\Service\BaseServiceApi\BaseServiceApiImplement;
use Illuminate\Support\Facades\Log;
use Throwable;

class VideoApiServiceApiImplement extends BaseServiceApiImplement implements VideoApiServiceApi
{
    public function generateVideoFromText(string $text, array $options = [])
    {
        $result = $this->submitTextToVideo($text, $options);

        if (!$result['successful']) {
            throw new \Exception($result['error_message'] ?? 'Failed to generate video from text.');
        }

        return $result['data'];
    }

    public function submitTextToVideo(string $text, array $options = []): array
    {
        try {
            $endpoint = '/text-to-video';
            $payload = [
                'name' => $options['name'] ?? 'Generated Video',
                'end_seconds' => (float) ($options['end_seconds'] ?? 30),
                'resolution' => $options['resolution'] ?? '720p',
                'model' => $options['model'] ?? 'ltx-2',
                'style' => [
                    'prompt' => $text,
                ],
            ];

            if (!empty($options['aspect_ratio'])) {
                $payload['aspect_ratio'] = $options['aspect_ratio'];
            }

            if (array_key_exists('audio', $options)) {
                $payload['audio'] = (bool) $options['audio'];
            }

            return $this->requestWithMeta('post', $endpoint, $payload);
        } catch (Throwable $e) {
            Log::error('Failed to generate video from text: ' . $e->getMessage());

            return [
                'successful' => false,
                'status' => null,
                'data' => null,
                'error_message' => $e->getMessage(),
                'duration_ms' => 0,
                'endpoint' => '/text-to-video',
                'http_method' => 'POST',
                'request_payload' => [],
            ];
        }
    }

    public function getVideo(string $videoId)
    {
        $result = $this->getVideoProject($videoId);

        if (!$result['successful']) {
            throw new \Exception($result['error_message'] ?? "Failed to get video {$videoId}.");
        }

        return $result['data'];
    }

    public function getVideoProject(string $videoId): array
    {
        try {
            $endpoint = "/video-projects/{$videoId}";

            return $this->requestWithMeta('get', $endpoint);
        } catch (Throwable $e) {
            Log::error("Failed to get video {$videoId}: " . $e->getMessage());

            return [
                'successful' => false,
                'status' => null,
                'data' => null,
                'error_message' => $e->getMessage(),
                'duration_ms' => 0,
                'endpoint' => "/video-projects/{$videoId}",
                'http_method' => 'GET',
                'request_payload' => [],
            ];
        }
    }
}
