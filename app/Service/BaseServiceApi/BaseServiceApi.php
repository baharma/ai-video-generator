<?php

namespace App\Service\BaseServiceApi;

interface BaseServiceApi
{
    public function setBaseUrl(string $baseUrl): void;

    public function get($endpoint, $params = [], $headers = []);

    public function post($endpoint, $data = [], $headers = []);
}
