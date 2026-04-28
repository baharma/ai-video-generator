<?php

namespace App\Service\BaseServiceApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BaseServiceApiImplement implements BaseServiceApi
{
    protected string $baseUrl = '';
    protected string $keyApi = '';
    protected array $defaultHeaders = [
        'Content-Type' => 'application/json',
    ];

    public function __construct(string $keyApi, string $baseUrl)
    {
        $this->keyApi = $keyApi;
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    public function setBaseUrl(string $baseUrl): void
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        Log::info("Base URL set to: {$this->baseUrl}");
    }

    public function get($endpoint, $params = [], $headers = [])
    {
        return $this->request('get', $endpoint, $params, $headers);
    }

    public function post($endpoint, $data = [], $headers = [])
    {
        return $this->request('post', $endpoint, $data, $headers);
    }

    protected function request(string $method, string $endpoint, array $data = [], array $headers = [])
    {
        if (!$this->baseUrl) {
            throw new \Exception('Base URL is not set.');
        }

        $fullUrl = $this->baseUrl . $endpoint;
        Log::info("Sending {$method} request to URL: {$fullUrl} with data: " . json_encode($data) . " and headers: " . json_encode($headers));

        try {
            $response = Http::withHeaders(array_merge($this->defaultHeaders, $headers))
                ->{$method}($fullUrl, $data);

            Log::info("Received response: " . json_encode($response->json()));

            return $response->json();
        } catch (\Exception $e) {
            Log::error("HTTP request error: " . $e->getMessage());
            throw $e;
        }
    }
}
