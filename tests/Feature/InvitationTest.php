<?php

namespace Tests\Feature;

use App\Models\Invitee;
use App\Models\User;
use App\Services\InvitationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InvitationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Cache::flush();
    }

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->is_admin = true;
        $user->save();

        return $user;
    }

    private function invite(string $name = 'Mr. & Mrs. Fernando'): Invitee
    {
        return app(InvitationService::class)->create(['name' => $name, 'email' => 'private@example.com', 'phone' => '12345']);
    }

    public function test_management_requires_an_authenticated_admin(): void
    {
        $invitee = $this->invite();
        $this->get(route('admin.invitees.index'))->assertRedirect(route('login'));
        $this->post(route('admin.invitees.store'), ['name' => 'Guest'])->assertRedirect(route('login'));
        $this->actingAs(User::factory()->create())->get(route('admin.invitees.index'))->assertForbidden();
        $this->patch(route('admin.invitees.toggle', $invitee))->assertForbidden();
        $this->post(route('admin.invitees.regenerate', $invitee))->assertForbidden();
        $this->put(route('admin.invitees.update', $invitee), ['name' => 'Changed'])->assertForbidden();
    }

    public function test_admin_creates_validated_unique_secure_links(): void
    {
        $this->actingAs($this->admin())->post(route('admin.invitees.store'), ['name' => 'First guest', 'is_active' => false, 'token' => 'predictable'])->assertRedirect();
        $this->post(route('admin.invitees.store'), ['name' => 'Second guest'])->assertRedirect();
        $guests = Invitee::all();
        $this->assertCount(2, $guests);
        $this->assertNotEquals($guests[0]->token, $guests[1]->token);
        $this->assertMatchesRegularExpression('/^[A-Za-z0-9]{48}$/', $guests[0]->token);
        $this->assertTrue($guests[0]->is_active);
        $this->post(route('admin.invitees.store'), ['name' => '', 'email' => 'invalid'])->assertSessionHasErrors(['name', 'email']);
    }

    public function test_each_link_shows_only_its_guests_public_information(): void
    {
        foreach (['Fernando Family', 'Perera Family'] as $name) {
            $invitee = $this->invite($name);
            $this->get(route('invitation.show', $invitee->token))->assertOk()->assertHeader('Referrer-Policy', 'no-referrer')
                ->assertInertia(fn (Assert $page) => $page->component('Invitation/Show')->where('guest.name', $name)->missing('guest.email')->missing('guest.phone')->missing('guest.id')->missing('guest.token'));
        }
    }

    public function test_invalid_and_inactive_invitations_have_styled_errors_and_no_visits(): void
    {
        $this->get('/invite/not-a-token')->assertNotFound()->assertInertia(fn (Assert $page) => $page->component('Invitation/Unavailable')->where('inactive', false));
        $invitee = $this->invite();
        $invitee->is_active = false;
        $invitee->save();
        $this->get(route('invitation.show', $invitee->token))->assertNotFound()->assertInertia(fn (Assert $page) => $page->where('inactive', true)->missing('guest'));
        $this->assertEquals(0, $invitee->fresh()->visit_count);
    }

    public function test_visits_are_throttled_for_thirty_minutes(): void
    {
        $invitee = $this->invite();
        $url = route('invitation.show', $invitee->token);
        $this->get($url)->assertOk();
        $this->withCookie(config('session.cookie'), session()->getId())->get($url)->assertOk();
        $this->assertEquals(1, $invitee->fresh()->visit_count);
        $this->assertNotNull($invitee->fresh()->visited_at);
        $this->travel(31)->minutes();
        $this->get($url)->assertOk();
        $this->assertEquals(2, $invitee->fresh()->visit_count);
    }

    public function test_prefetch_and_head_do_not_count_as_visits(): void
    {
        $invitee = $this->invite();
        $url = route('invitation.show', $invitee->token);
        $this->get($url, ['Purpose' => 'prefetch'])->assertOk();
        $this->head($url)->assertOk();
        $this->assertEquals(0, $invitee->fresh()->visit_count);
    }

    public function test_admin_can_edit_toggle_and_rotate_a_link(): void
    {
        $invitee = $this->invite();
        $old = $invitee->token;
        $this->actingAs($this->admin())->put(route('admin.invitees.update', $invitee), ['name' => 'Updated name'])->assertRedirect();
        $this->assertEquals('Updated name', $invitee->fresh()->name);
        $this->patch(route('admin.invitees.toggle', $invitee))->assertRedirect();
        $this->assertFalse($invitee->fresh()->is_active);
        $this->patch(route('admin.invitees.toggle', $invitee))->assertRedirect();
        $this->post(route('admin.invitees.regenerate', $invitee))->assertRedirect();
        $this->assertNotEquals($old, $invitee->fresh()->token);
        $this->get(route('invitation.show', $old))->assertNotFound();
        $this->get(route('invitation.show', $invitee->fresh()->token))->assertOk();
    }

    public function test_admin_login_logout_and_non_admin_rejection(): void
    {
        $admin = $this->admin();
        $this->post(route('login'), ['email' => $admin->email, 'password' => 'password'])->assertRedirect(route('admin.invitees.index'));
        $this->assertAuthenticatedAs($admin);
        $this->post(route('logout'))->assertRedirect(route('login'));
        $this->assertGuest();
        $ordinary = User::factory()->create();
        $this->post(route('login'), ['email' => $ordinary->email, 'password' => 'password'])->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_login_attempts_are_rate_limited(): void
    {
        $admin = $this->admin();
        for ($i = 0; $i < 5; $i++) {
            $this->post(route('login'), ['email' => $admin->email, 'password' => 'wrong']);
        }
        $this->post(route('login'), ['email' => $admin->email, 'password' => 'password'])->assertSessionHasErrors('email');
        $this->assertGuest();
    }
}
