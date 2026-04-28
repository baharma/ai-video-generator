<?php

namespace App\Service\BaseServiceApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class BaseServiceApiImplement implements BaseServiceApi
{
    protected string $baseUrl = '';
    protected string $keyApi = '';
    protected array $defaultHeaders = [
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
    ];

    public function __construct(string $keyApi, string $baseUrl)
    {
        $this->keyApi = $keyApi;
        $this->baseUrl = rtrim($baseUrl, '/');

        if ($this->keyApi !== '') {
            $this->defaultHeaders['Authorization'] = "Bearer {$this->keyApi}";
        }
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
        $result = $this->requestWithMeta($method, $endpoint, $data, $headers);

        if (!$result['successful']) {
            throw new \Exception($result['error_message'] ?? 'HTTP request failed.');
        }

        return $result['data'];
    }

    protected function requestWithMeta(string $method, string $endpoint, array $data = [], array $headers = []): array
    {
        if (!$this->baseUrl) {
            return [
                'successful' => false,
                'status' => null,
                'data' => null,
                'error_message' => 'Base URL is not set.',
                'duration_ms' => 0,
                'endpoint' => $endpoint,
                'http_method' => strtoupper($method),
                'request_payload' => $data,
            ];
        }

        $fullUrl = $this->baseUrl . '/' . ltrim($endpoint, '/');
        $startedAt = microtime(true);

        Log::info("Sending {$method} request to URL: {$fullUrl}");

        try {
            $response = Http::timeout(120)
                ->acceptJson()
                ->asJson()
                ->withHeaders(array_merge($this->defaultHeaders, $headers))
                ->{$method}($fullUrl, $data);

            $body = $response->json();
            $durationMs = (int) round((microtime(true) - $startedAt) * 1000);
            $errorMessage = null;

            if (!$response->successful()) {
                $errorMessage = is_array($body)
                    ? ($body['message'] ?? $body['error'] ?? json_encode($body))
                    : $response->body();
            }

            Log::info("Received {$method} response from URL: {$fullUrl} with status {$response->status()}");

            return [
                'successful' => $response->successful(),
                'status' => $response->status(),
                'data' => $body,
                'error_message' => $errorMessage,
                'duration_ms' => $durationMs,
                'endpoint' => $endpoint,
                'http_method' => strtoupper($method),
                'request_payload' => $data,
            ];
        } catch (Throwable $e) {
            $durationMs = (int) round((microtime(true) - $startedAt) * 1000);

            Log::error("HTTP request error: " . $e->getMessage());

            return [
                'successful' => false,
                'status' => null,
                'data' => null,
                'error_message' => $e->getMessage(),
                'duration_ms' => $durationMs,
                'endpoint' => $endpoint,
                'http_method' => strtoupper($method),
                'request_payload' => $data,
            ];
        }
    }
}
