<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [...parent::share($request),
            'flash' => ['success' => fn () => $request->session()->get('success')],
            'links' => ['index' => route('admin.invitees.index'), 'create' => route('admin.invitees.create'), 'store' => route('admin.invitees.store'), 'login' => route('login'), 'logout' => route('logout'), 'home' => route('home')],
        ];
    }
}
