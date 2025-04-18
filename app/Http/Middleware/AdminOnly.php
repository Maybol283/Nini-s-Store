<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminOnly
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->email !== 'admin@example.com') {
            return Inertia::render('Error/Unauthorized', [
                'status' => 403,
                'message' => 'You do not have permission to access this area.'
            ])->toResponse($request)->setStatusCode(403);
        }

        return $next($request);
    }
}
