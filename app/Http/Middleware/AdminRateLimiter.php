<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminRateLimiter
{
    protected $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    public function handle(Request $request, Closure $next): Response
    {
        // Get IP and user ID if authenticated
        $key = sprintf('admin:%s:%s', $request->ip(), Auth::id() ?? 'guest');

        // Allow 30 requests per minute for admin routes
        if ($this->limiter->tooManyAttempts($key, 30)) {
            return response()->json([
                'message' => 'Too many attempts. Please try again later.',
            ], 429);
        }

        $this->limiter->hit($key, 60); // Keep in cache for 60 seconds

        return $next($request);
    }
}
