<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and is an admin
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        // Check if is_admin field exists before checking its value
        if (!Auth::user()->is_admin) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
