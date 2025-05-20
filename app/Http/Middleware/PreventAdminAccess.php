<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PreventAdminAccess
{
    /**
     * Handle an incoming request.
     *
     * Prevent authenticated admin users from accessing non-admin routes.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated and is an admin
        if (Auth::check() && Auth::user()->is_admin) {
            // Admins should not access regular user routes.
            // Redirect them to the admin dashboard.
            // We can add a flash message optionally.
            return redirect()->route("admin.dashboard")->with("warning", "Admins cannot access customer pages.");
        }

        // If the user is not an admin or not authenticated, allow access.
        return $next($request);
    }
}

