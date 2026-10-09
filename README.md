# With Love — personalized wedding invitations

A Laravel 13 + Inertia 2 + React application with Tailwind CSS 4, Framer Motion, Lucide icons, and MySQL. This repository was created from an empty workspace. There is no separate API or React server to deploy.

## Local setup

Requires PHP 8.3+ (PHP 8.4 recommended for the locked development dependencies), Composer, Node 22.12+ or a supported newer Node release, and MySQL 8.

```sh
composer install
npm ci
cp .env.example .env
php artisan key:generate
```

Create a MySQL database and set `DB_*` and `APP_URL` in `.env`:

```sql
CREATE DATABASE wedding_invitation_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```dotenv
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wedding_invitation_system
DB_USERNAME=root
DB_PASSWORD=
```

```sh
php artisan migrate
php artisan wedding:admin
npm run build
php artisan serve --host=127.0.0.1 --port=8000
```

`wedding:admin` asks for a name, email, and hidden password (12+ characters, mixed case, and numbers). There are no default admin credentials and no public registration. Run `npm run dev` in another terminal while editing frontend files.

On this Windows/Laragon machine PHP and Composer are not on the default PATH. In PowerShell:

```powershell
$env:Path = 'F:\laragon\laragon\bin\php\php-8.4.4-Win32-vs17-x64;' + $env:Path
php 'F:\laragon\laragon\bin\composer\composer.phar' install
Copy-Item .env.example .env # fresh installations only; preserve an existing .env
```

The workspace already has dependencies installed, an application key, compiled assets, and migrated local MySQL tables. Do not overwrite its `.env` when continuing development. Create your administrator with the command above.

## Experience and routes

- `/`: labeled sample invitation; no guest data or visit tracking.
- `/login`: administrator sign-in.
- `/admin/invitees`: paginated, searchable guest list with visits and status.
- `/admin/invitees/create`: create a personalized invitation.
- `/admin/invitees/{token}` and `/edit`: details, copying, editing, activation, and link regeneration.
- `/invite/{token}`: private invitation; only the name and wedding configuration reach the guest client.

Admin creates invitee → service generates a cryptographic 48-character token → MySQL stores it behind a unique index → named Laravel route produces a URL → guest opens URL → controller checks availability → service records a visit → Inertia renders React with the guest's name.

The invitation opens from a framed stationery cover into a message, photographic story, editorial date, ceremony, reception, and closing. Motion uses reveal observers, entrance choreography, scroll-driven image translation/scaling, and animated dividers. Reduced-motion preferences suppress spatial effects. Images and fonts are locally served; opening a private URL makes no third-party font or image requests.

## Content and architecture

Change sample names, date, ceremony, reception, and message in `config/wedding.php`. The example date and London venues are demonstration content. Keep the date's ISO value, weekday, day, month, and year consistent. After changing production configuration, run `php artisan config:cache`.

Replace the garden and couple images in `public/images/` with your own compressed images, maintaining the 800px and 1400px versions and updating alt text in `InvitationCover.jsx` and `CoupleStory.jsx` as needed. Initial demonstration images come from Unsplash image IDs `photo-1523438885200-e635ba2c371e` and `photo-1519741497674-611481863552`.

Core files:

```text
app/Console/Commands/CreateAdmin.php
app/Models/Invitee.php
app/Models/User.php
app/Services/InvitationService.php
app/Http/Requests/InviteeRequest.php
app/Http/Controllers/Admin/InviteeController.php
app/Http/Controllers/AuthController.php
app/Http/Controllers/InvitationController.php
app/Http/Middleware/HandleInertiaRequests.php
app/Http/Middleware/PrivateResponse.php
app/Providers/AppServiceProvider.php
bootstrap/app.php
config/wedding.php
routes/web.php
database/migrations/2026_09_18_000001_create_invitees_table.php
resources/views/app.blade.php
resources/views/errors/wedding.blade.php
resources/js/app.jsx
resources/js/Components/AdminLayout.jsx
resources/js/Components/CopyLink.jsx
resources/js/Components/Invitation/{InvitationCover,GuestGreeting,InvitationMessage,CoupleStory,WeddingDate,EventSection,InvitationFooter,FloralDecoration,AnimatedDivider,Reveal}.jsx
resources/js/Pages/Invitation/{Show,Unavailable}.jsx
resources/js/Pages/Admin/{Index,Form,Show}.jsx
resources/js/Pages/Auth/Login.jsx
resources/css/app.css
vite.config.js
tests/Feature/InvitationTest.php
tests/Browser/{invitation.spec.js,admin.spec.js,fixture.php}
playwright.config.js
```

`InviteeRequest` validates explicitly allowed fields. `InvitationService` owns token generation, creation, visit counting, and admin presentation. Controllers orchestrate requests. The `admin` gate protects every management route; users default to non-admin. Standard session authentication, CSRF middleware, password hashing, session rotation, and login throttling remain in Laravel.

`invitees` contains `id`, `name`, `token` (unique), nullable `email` and `phone`, `is_active`, nullable `visited_at`, `visit_count`, and timestamps. Status is derived as Inactive, Viewed, or Unopened to avoid contradictory stored states. `users` gains `is_admin`. No relationship is needed for this single-wedding foundation. Laravel's session and cache tables support authentication and visit throttling. Multi-wedding ownership and tenant scoping can be introduced together when needed.

Public and admin URLs use tokens rather than numeric IDs. Tokens act as bearer invitations: anyone given a link can read that invitation. Regeneration invalidates the previous link immediately. React escapes guest names. Responses are private/no-store and noindex, with a no-referrer policy.

Visits use an atomic cache add keyed by an HMAC of the token and session ID, expiring after 30 minutes, followed by an atomic database increment. Repeated opens in one session count once per window. HEAD and prefetch requests do not count. No IP addresses are retained for analytics. Clearing cookies or using another browser can count another visit; this is simple visit tracking, not a distinct-person analytics system. For multiple application servers, keep the database or another shared atomic cache backend.

RSVP, maps, countdowns, music, galleries, meal choices, and guest messaging are intentionally deferred.

## Verification

```sh
php artisan test
php vendor/bin/pint --test
npm run build
npx playwright install chromium
# Start php artisan serve first, with APP_ENV=local and your local MySQL database.
npm run test:browser
```

If PHP is not on PATH, set `PHP_BINARY` to the full path to php.exe before the browser tests. Backend tests use isolated in-memory SQLite and never reset the MySQL database. Browser tests create a random temporary admin and invitee in the local database, exercise the UI, then remove those fixtures. Do not run them against production. Interrupted browser runs may leave `browser-...@example.test` fixtures that can be removed manually.

Coverage includes admin authorization and validation, secure unique tokens, distinct guest personalization, data minimization, activation, old-link invalidation, login/logout/rate limiting, session visit suppression and expiry, prefetch handling, browser clipboard copying, and the complete admin workflow. Browser viewports cover 375, 390, 430, and 1440px plus reduced motion. Screenshots are written under `test-results/` (ignored by Git).

Browser checks detect JavaScript errors and horizontal overflow. Transform/opacity animation and compressed responsive images limit rendering work; real-device frame-rate and mobile-data performance should be profiled with the final photographs before launch. No claim of guaranteed 60fps on all devices is made.

## Deployment

Point the web server at `public/`. Set the real HTTPS `APP_URL`, `APP_ENV=production`, `APP_DEBUG=false`, strong database credentials, and `SESSION_SECURE_COOKIE=true`. Retain the existing application key. The production error page is self-contained so it can render even when JavaScript assets are unavailable.

```sh
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan optimize
```

Give the web process write access to `storage/` and `bootstrap/cache/`. Use HTTPS for invitations and browser clipboard access (localhost also supports the Clipboard API). If clipboard access is unavailable, the UI offers a selectable URL. Back up MySQL and the application key. Configure trusted proxies to match your hosting environment if TLS terminates upstream.
