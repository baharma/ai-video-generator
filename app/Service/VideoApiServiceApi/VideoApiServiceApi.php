<?php

namespace App\Service\VideoApiServiceApi;

use App\Service\BaseServiceApi\BaseServiceApi;

interface VideoApiServiceApi extends BaseServiceApi
{
    public function generateVideoFromText(string $text, array $options = []);
}
