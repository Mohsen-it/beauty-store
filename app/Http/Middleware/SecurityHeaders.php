<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
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

            // Only add security headers to HTML responses
            if (!$this->shouldApplySecurityHeaders($response)) {
                return $response;
            }

            // Content Security Policy
            $scriptSrc = "'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com";
            $connectSrc = "'self' https://api.stripe.com";

            // Add Vite dev server to allowed sources in development environment
            if (App::environment('local')) {
                $scriptSrc .= " http://127.0.0.1:5173";
                $connectSrc .= " http://127.0.0.1:5173 ws://127.0.0.1:5173";
            }

            $response->headers->set(
                'Content-Security-Policy',
                "default-src 'self'; " .
                "script-src {$scriptSrc}; " .
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net; " .
                "img-src 'self' data: https: blob:; " .
                "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net; " .
                "connect-src {$connectSrc}; " .
                "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; " .
                "object-src 'none'; " .
                "base-uri 'self';"
            );

            // HTTP Strict Transport Security (HSTS)
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

            // Prevent MIME type sniffing
            $response->headers->set('X-Content-Type-Options', 'nosniff');

            // Referrer Policy
            $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

            // Permissions Policy (formerly Feature Policy)
            $response->headers->set(
                'Permissions-Policy',
                'camera=(), microphone=(), geolocation=(self), payment=(self)'
            );

            // XSS Protection
            $response->headers->set('X-XSS-Protection', '1; mode=block');

            // Frame Options
            $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

            return $response;
        } catch (\Exception) {
            // If there's an error, just continue without adding headers
            return $next($request);
        }
    }

    /**
     * Determine if security headers should be applied to the response.
     *
     * @param  \Symfony\Component\HttpFoundation\Response  $response
     * @return bool
     */
    protected function shouldApplySecurityHeaders(Response $response): bool
    {
        // Only apply to HTML responses
        if (!$response->headers->has('Content-Type')) {
            return false;
        }

        $contentType = $response->headers->get('Content-Type');
        return str_contains($contentType, 'text/html');
    }
}
