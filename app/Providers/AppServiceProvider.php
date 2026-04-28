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
        $this->app->singleton(VideoApiServiceApi::class, function () {
            return new VideoApiServiceApiImplement(
                (string) config('services.magic_hour.key'),
                (string) config('services.magic_hour.url'),
            );
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
