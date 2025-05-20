<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheStaticAssets
{
    /**
     * Static asset file extensions that should be cached.
     *
     * @var array
     */
    protected $fileTypes = [
        'css', 'js', 'svg', 'jpg', 'jpeg', 'png', 'gif', 'webp',
        'woff', 'woff2', 'ttf', 'eot', 'ico', 'pdf'
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $response = $next($request);

            // Only apply caching to GET requests
            if (!$request->isMethod('GET')) {
                return $response;
            }

            // Check if the request is for a static asset
            $path = $request->path();
            $extension = pathinfo($path, PATHINFO_EXTENSION);

            if (in_array(strtolower($extension), $this->fileTypes)) {
                // Set cache headers for static assets
                $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
                $response->headers->set('Pragma', 'public');
                $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
            } elseif ($this->isHtmlResponse($response)) {
                // For HTML responses, use a shorter cache time or no-cache
                try {
                    $isAuthenticated = auth()->check();

                    if ($isAuthenticated) {
                        // For authenticated users, don't cache HTML
                        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                        $response->headers->set('Pragma', 'no-cache');
                        $response->headers->set('Expires', '0');
                    } else {
                        // For public pages, allow short-term caching
                        $response->headers->set('Cache-Control', 'public, max-age=60, s-maxage=300');
                    }
                } catch (\Exception $e) {
                    // If auth check fails (e.g., database connection issue), use safe defaults
                    $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                    $response->headers->set('Pragma', 'no-cache');
                    $response->headers->set('Expires', '0');
                }
            }

            return $response;
        } catch (\Exception $e) {
            // If there's an error, just continue without adding cache headers
            return $next($request);
        }
    }

    /**
     * Determine if the response is an HTML response.
     *
     * @param  \Symfony\Component\HttpFoundation\Response  $response
     * @return bool
     */
    protected function isHtmlResponse(Response $response): bool
    {
        return $response->headers->has('Content-Type') &&
               str_contains($response->headers->get('Content-Type'), 'text/html');
    }
}
