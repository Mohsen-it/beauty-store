<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\App;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'currencySymbol' => config('app.currency_symbol'),
        ]);
        
        // Force HTTPS in production 
        if (App::environment('production')) {
            URL::forceScheme('http');

            // Disable query events in production for performance
            Model::preventLazyLoading(!app()->isProduction());
            Model::preventSilentlyDiscardingAttributes(!app()->isProduction());
            
            // Disable syntheic event dispatching in production
            Model::handleLazyLoadingViolationUsing(function ($model, $relation) {
                $class = get_class($model);
                info("Attempted to lazy load [{$relation}] on model [{$class}].");
            });
        }
    }
}
