<?php

use App\Models\Invitee;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;

// CLI-only ephemeral browser fixtures; never exposed by the web server.
require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
if (! $app->environment('local') || PHP_SAPI !== 'cli') {
    exit(1);
}
if (($argv[1] ?? '') === 'cleanup') {
    $email = $argv[2] ?? '';
    if (! preg_match('/^browser-[a-f0-9]{16}@example\.test$/', $email)) {
        exit(1);
    }
    User::where('email', $email)->delete();
    Invitee::where('email', $email)->delete();
    exit;
}
$email = 'browser-'.bin2hex(random_bytes(8)).'@example.test';
$password = bin2hex(random_bytes(24));
$user = new User(['name' => 'Browser test admin', 'email' => $email, 'password' => $password]);
$user->is_admin = true;
$user->save();
echo json_encode(compact('email', 'password'));
