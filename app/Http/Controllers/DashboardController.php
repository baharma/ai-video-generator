<?php

namespace App\Http\Controllers;

use App\Models\VideoGeneration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $query = VideoGeneration::query()
            ->where('user_id', $request->user()->id);

        $latestGenerations = (clone $query)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (VideoGeneration $generation): array => [
                'id' => $generation->id,
                'title' => $generation->title ?: $generation->topic,
                'topic' => $generation->topic,
                'video_type' => $generation->video_type ?: 'Video',
                'tone' => $generation->tone ?: '-',
                'duration' => $this->formatDuration($generation->duration),
                'status' => $generation->status,
                'created_at' => $generation->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => (clone $query)->count(),
                'completed' => (clone $query)->where('status', 'completed')->count(),
                'processing' => (clone $query)->whereIn('status', [
                    'generating_script',
                    'video_submitted',
                    'video_processing',
                ])->count(),
            ],
            'latestGenerations' => $latestGenerations,
        ]);
    }

    private function formatDuration(?string $duration): string
    {
        if (!$duration) {
            return '-';
        }

        return is_numeric($duration) ? "{$duration} seconds" : $duration;
    }
}
