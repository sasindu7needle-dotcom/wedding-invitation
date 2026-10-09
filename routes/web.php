<?php

use App\Http\Controllers\Admin\InviteeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InvitationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Invitation/Show', ['guest' => ['name' => 'Our dearest friends & family'], 'wedding' => config('wedding'), 'preview' => true]))->name('home');
Route::get('/invite/{token}', InvitationController::class)->middleware('throttle:120,1')->name('invitation.show');
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->middleware('throttle:20,1');
});
Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');
Route::prefix('admin')->name('admin.')->middleware(['auth', 'can:admin'])->group(function () {
    Route::redirect('/', '/admin/invitees');
    Route::resource('invitees', InviteeController::class)->except('destroy');
    Route::patch('/invitees/{invitee}/toggle', [InviteeController::class, 'toggle'])->name('invitees.toggle');
    Route::post('/invitees/{invitee}/regenerate', [InviteeController::class, 'regenerate'])->name('invitees.regenerate');
});
