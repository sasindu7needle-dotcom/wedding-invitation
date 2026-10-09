<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\InviteeRequest;
use App\Models\Invitee;
use App\Services\InvitationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InviteeController extends Controller
{
    public function __construct(private InvitationService $invitations) {}

    public function index(Request $request)
    {
        $search = mb_substr((string) $request->query('search', ''), 0, 100);

        return Inertia::render('Admin/Index', [
            'invitees' => Invitee::query()->when($search, fn ($q) => $q->where('name', 'like', '%'.$search.'%'))->latest('id')->paginate(12)->withQueryString()->through(fn ($invitee) => $this->invitations->present($invitee)),
            'search' => $search,
            'stats' => ['total' => Invitee::count(), 'viewed' => Invitee::whereNotNull('visited_at')->count(), 'active' => Invitee::where('is_active', true)->count()],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Form');
    }

    public function store(InviteeRequest $request)
    {
        return to_route('admin.invitees.show', $this->invitations->create($request->validated()))->with('success', 'Invitation created successfully');
    }

    public function show(Invitee $invitee)
    {
        return Inertia::render('Admin/Show', ['invitee' => $this->invitations->present($invitee)]);
    }

    public function edit(Invitee $invitee)
    {
        return Inertia::render('Admin/Form', ['invitee' => $this->invitations->present($invitee)]);
    }

    public function update(InviteeRequest $request, Invitee $invitee)
    {
        $invitee->update($request->validated());

        return to_route('admin.invitees.show', $invitee)->with('success', 'Invitation updated');
    }

    public function toggle(Invitee $invitee)
    {
        $invitee->is_active = ! $invitee->is_active;
        $invitee->save();

        return back()->with('success', $invitee->is_active ? 'Invitation activated' : 'Invitation deactivated');
    }

    public function regenerate(Invitee $invitee)
    {
        $invitee->token = $this->invitations->token();
        $invitee->save();

        return to_route('admin.invitees.show', $invitee)->with('success', 'New link created. The previous link no longer works.');
    }
}
