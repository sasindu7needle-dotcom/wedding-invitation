<?php

namespace App\Http\Controllers;

use App\Models\Invitee;
use App\Services\InvitationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function __invoke(Request $request, string $token, InvitationService $service)
    {
        $invitee = strlen($token) === 48 ? Invitee::where('token', $token)->first() : null;
        if (! $invitee || ! $invitee->is_active) {
            return Inertia::render('Invitation/Unavailable', ['inactive' => (bool) $invitee])->toResponse($request)->setStatusCode(404);
        }
        if (! $request->header('Purpose') && ! $request->header('X-Inertia-Prefetch') && ! $request->isMethod('HEAD')) {
            $service->trackVisit($invitee, $request);
        }

        return Inertia::render('Invitation/Show', ['guest' => ['name' => $invitee->name], 'wedding' => config('wedding')]);
    }
}
