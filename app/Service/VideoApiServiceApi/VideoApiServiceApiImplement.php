<?php

namespace App\Service\VideoApiServiceApi;

use App\Service\BaseServiceApi\BaseServiceApiImplement;
use Illuminate\Support\Facades\Log;
use Throwable;

class VideoApiServiceApiImplement extends BaseServiceApiImplement implements VideoApiServiceApi
{
    public function generateVideoFromText(string $text, array $options = [])
    {
        try {
            $endpoint = '/text-to-video';
            $payload = [
                'name' => $options['name'] ?? 'Generated Video',
                'end_seconds' => $options['end_seconds'] ?? 30,
                'orientation' => $options['orientation'] ?? 'landscape',
                'resolution' => $options['resolution'] ?? '720p',
                'model' => 'ltx-2',
                'style' => [
                    'prompt' => $text,
                ],
            ];

            return $this->post($endpoint, $payload);
        } catch (Throwable $e) {
            Log::error('Failed to generate video from text: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getVideo(string $videoId)
    {
        try {
            $endpoint = "/video-projects/{$videoId}";

            return $this->get($endpoint);
        } catch (Throwable $e) {
            Log::error("Failed to get video {$videoId}: " . $e->getMessage());
            throw $e;
        }
    }
}
