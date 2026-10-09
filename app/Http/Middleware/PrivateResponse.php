<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PrivateResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        foreach (['Cache-Control' => 'private, no-store', 'Referrer-Policy' => 'no-referrer', 'X-Robots-Tag' => 'noindex, nofollow', 'X-Content-Type-Options' => 'nosniff', 'X-Frame-Options' => 'SAMEORIGIN'] as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
