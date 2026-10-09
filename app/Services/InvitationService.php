<?php

namespace App\Services;

use App\Models\Invitee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class InvitationService
{
    public function token(): string
    {
        do {
            $token = Str::random(48);
        } while (Invitee::where('token', $token)->exists());

        return $token;
    }

    public function create(array $data): Invitee
    {
        $invitee = new Invitee($data);
        $invitee->token = $this->token();
        $invitee->save();

        return $invitee;
    }

    public function trackVisit(Invitee $invitee, Request $request): void
    {
        // Short-lived session hash; no IP addresses retained. Atomic cache add prevents races.
        $key = 'invitation-visit:'.hash_hmac('sha256', $invitee->token.$request->session()->getId(), config('app.key'));
        if (Cache::add($key, true, now()->addMinutes(30))) {
            $invitee->increment('visit_count', 1, ['visited_at' => now()]);
        }
    }

    public function present(Invitee $invitee): array
    {
        $data = $invitee->only(['name', 'email', 'phone', 'token', 'is_active', 'visit_count']);
        $data += ['status' => $invitee->status, 'visited_at' => $invitee->visited_at?->toIso8601String(), 'created_at' => $invitee->created_at->toIso8601String(), 'url' => route('invitation.show', $invitee->token)];
        foreach (['edit', 'show', 'update', 'toggle', 'regenerate'] as $action) {
            $data[$action.'_url'] = route('admin.invitees.'.$action, $invitee);
        }

        return $data;
    }
}
