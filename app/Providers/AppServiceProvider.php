<?php

namespace App\Providers;

use App\Service\VideoApiServiceApi\VideoApiServiceApi;
use App\Service\VideoApiServiceApi\VideoApiServiceApiImplement;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $myKeyApi = env('MAGIC_HOUR_API_KEY');
        $apiUrl = env('MAGIC_HOUR_API_URL');

        $this->app->singleton(VideoApiServiceApi::class, function ($app) use ($myKeyApi, $apiUrl) {
            $service = new VideoApiServiceApiImplement($myKeyApi, $apiUrl);
            return $service;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
