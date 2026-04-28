<?php

namespace App\Service\VideoApiServiceApi;

use App\Service\BaseServiceApi\BaseServiceApi;

interface VideoApiServiceApi extends BaseServiceApi
{
    public function generateVideoFromText(string $text, array $options = []);

    public function submitTextToVideo(string $text, array $options = []): array;

    public function getVideo(string $videoId);

    public function getVideoProject(string $videoId): array;
}
