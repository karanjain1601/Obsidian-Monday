---
title: Laravel Jobs, Testing, and Deployment
aliases:
  - Laravel Queues
  - Laravel Jobs
  - Laravel PHPUnit
  - Laravel Pest Testing
  - Laravel Deployment
  - Laravel Sail
tags: [PHP, Laravel, queues, testing, deployment]
domain: PHP
difficulty: Advanced
created: 2026-07-29
related:
  - Laravel_Overview
  - Laravel_Auth_and_Middleware
  - PHP_Testing
  - Composer_and_Packages
status: complete
---

# Laravel Jobs, Testing, and Deployment

> [!abstract] TL;DR
> Laravel queues decouple time-consuming tasks (emails, PDF generation, API calls) from the HTTP request cycle using job classes dispatched to database/Redis queues. The scheduler replaces cron with expressive PHP. Testing uses PHPUnit with Laravel-specific test helpers (`RefreshDatabase`, `actingAs`, fake facades), or the more expressive Pest framework. Production deployment uses Forge, Vapor (serverless), or Docker + Laravel Sail.

---

## Queues and Jobs

### Creating and Dispatching Jobs

```php
// Create job class
php artisan make:job SendWelcomeEmail

// app/Jobs/SendWelcomeEmail.php
namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWelcomeEmail implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries      = 3;            // retry up to 3 times on failure
    public int $timeout    = 30;           // seconds before considered failed
    public int $backoff    = 60;           // seconds between retries

    public function __construct(
        private User $user,                // Eloquent models are serialized by ID
    ) {}

    public function handle(MailService $mailService): void {
        // $mailService auto-injected from container
        $mailService->sendWelcome($this->user);
    }

    public function failed(\Throwable $exception): void {
        // Called after all retries exhausted
        \Log::error("Welcome email failed for user {$this->user->id}", [
            'error' => $exception->getMessage(),
        ]);
    }
}

// Dispatch to queue
SendWelcomeEmail::dispatch($user);

// Dispatch with delay
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));

// Dispatch to specific queue
SendWelcomeEmail::dispatch($user)->onQueue('emails');

// Synchronous dispatch (bypasses queue, runs immediately — for testing)
SendWelcomeEmail::dispatchSync($user);
```

### Queue Configuration

```bash
# .env
QUEUE_CONNECTION=redis   # sync | database | redis | sqs

# Start queue worker
php artisan queue:work                          # process jobs
php artisan queue:work redis --queue=emails     # specific connection + queue
php artisan queue:work --tries=3 --timeout=60
php artisan queue:listen                        # re-reads code on each job (dev only)

# Failed jobs
php artisan queue:failed                        # list failed jobs
php artisan queue:retry all                     # retry all failed jobs
php artisan queue:flush                         # delete all failed jobs
```

---

## Scheduled Tasks

```php
// routes/console.php (Laravel 11+)
use Illuminate\Support\Facades\Schedule;

Schedule::command('reports:generate')
    ->dailyAt('02:00')
    ->emailOutputOnFailure('admin@example.com');

Schedule::command('cache:prune-stale-tags')->hourly();

Schedule::job(new CleanupTempFiles)->daily();

Schedule::call(fn() => DB::table('activity_log')->where('created_at', '<', now()->subYear())->delete())
    ->monthly()
    ->withoutOverlapping();  // skip if previous run still running

// Cron expression
Schedule::command('my:command')->cron('0 */6 * * *');

// The single cron entry (add to server crontab)
// * * * * * cd /path/to/app && php artisan schedule:run >> /dev/null 2>&1
```

---

## Testing in Laravel

### Test Structure

```bash
# Create test classes
php artisan make:test UserTest                  # Feature test (HTTP layer)
php artisan make:test UserUnitTest --unit       # Unit test (pure PHP)

# With Pest
php artisan make:test UserTest --pest
```

### Feature Tests (HTTP Layer)

```php
// tests/Feature/UserTest.php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase {
    use RefreshDatabase;  // wraps each test in transaction, rolls back after

    public function test_authenticated_user_can_view_profile(): void {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
                         ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => $user->name])
                 ->assertJsonStructure(['id', 'name', 'email']);
    }

    public function test_unauthenticated_request_returns_401(): void {
        $response = $this->getJson('/api/users/1');
        $response->assertUnauthorized();
    }

    public function test_user_can_create_post(): void {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
                         ->postJson('/api/posts', [
                             'title' => 'My Post',
                             'body'  => 'This is the body content of my post.',
                         ]);

        $response->assertCreated()
                 ->assertJsonFragment(['title' => 'My Post']);

        $this->assertDatabaseHas('posts', [
            'title'   => 'My Post',
            'user_id' => $user->id,
        ]);
    }
}
```

### Faking Facades

```php
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use App\Jobs\SendWelcomeEmail;
use App\Mail\WelcomeMail;

public function test_welcome_email_dispatched_on_registration(): void {
    // Fake queue — prevents actual job from running
    Queue::fake();

    $response = $this->postJson('/api/register', [
        'name'     => 'Alice',
        'email'    => 'alice@example.com',
        'password' => 'secret123',
    ]);

    $response->assertCreated();
    Queue::assertPushed(SendWelcomeEmail::class, function ($job) {
        return $job->user->email === 'alice@example.com';
    });
}

public function test_file_upload_stores_avatar(): void {
    Storage::fake('public');    // in-memory filesystem

    $user = User::factory()->create();
    $file = \Illuminate\Http\UploadedFile::fake()->image('avatar.jpg', 400, 400);

    $this->actingAs($user)
         ->postJson('/api/profile/avatar', ['avatar' => $file])
         ->assertOk();

    Storage::disk('public')->assertExists("avatars/{$user->id}.jpg");
}

public function test_external_api_call_is_faked(): void {
    // Fake HTTP client — no real network calls
    Http::fake([
        'api.stripe.com/*' => Http::response(['id' => 'ch_test'], 200),
        '*' => Http::response([], 500),  // fail unknown URLs
    ]);

    $response = $this->actingAs(User::factory()->create())
                     ->postJson('/api/payments', ['amount' => 100]);

    $response->assertOk();
    Http::assertSent(fn($r) => str_contains($r->url(), 'stripe.com'));
}
```

### Pest (Modern PHP Testing)

```php
// Pest syntax — more expressive, function-based
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can login', function () {
    $user = User::factory()->create(['password' => bcrypt('secret')]);

    $response = $this->postJson('/api/login', [
        'email'    => $user->email,
        'password' => 'secret',
    ]);

    $response->assertOk()->assertJsonStructure(['token']);
});

it('returns 401 for wrong password', function () {
    $user = User::factory()->create();

    $this->postJson('/api/login', [
        'email'    => $user->email,
        'password' => 'wrong',
    ])->assertUnauthorized();
});

// Dataset (data provider)
it('validates required fields', function (array $data, string $field) {
    $this->postJson('/api/register', $data)
         ->assertUnprocessable()
         ->assertJsonValidationErrors($field);
})->with([
    [['name' => '', 'email' => 'a@b.com', 'password' => 'secret123'], 'name'],
    [['name' => 'Alice', 'email' => 'invalid', 'password' => 'secret123'], 'email'],
]);
```

---

## Deployment

### Laravel Sail (Docker Development)

```bash
# Laravel Sail — Docker-based dev environment
composer require laravel/sail --dev
php artisan sail:install    # choose: mysql, redis, mailpit

./vendor/bin/sail up -d    # start all containers
./vendor/bin/sail artisan migrate
./vendor/bin/sail npm run dev
./vendor/bin/sail shell    # bash into container
```

### Production Deployment Checklist

```bash
# On production server / CI pipeline
composer install --no-dev --optimize-autoloader
php artisan config:cache      # cache config
php artisan route:cache       # cache routes (no closures in routes!)
php artisan view:cache        # precompile Blade templates
php artisan event:cache       # cache event-listener mappings
php artisan migrate --force   # run migrations (--force bypasses production prompt)

# Restart queue workers after deployment
php artisan queue:restart     # graceful restart of queue:work processes

# Environment
APP_ENV=production
APP_DEBUG=false               # NEVER true in production
```

### Forge and Vapor

- **Laravel Forge** — provisions VPS (DigitalOcean, AWS, Linode), configures Nginx + PHP-FPM, manages SSL, deploys via GitHub. Best for traditional server deployments.
- **Laravel Vapor** — serverless deployment on AWS Lambda. Zero-server management, auto-scaling, but cold starts and Lambda limits apply. Uses S3 for file storage and SQS for queues automatically.

---

## Common Pitfalls

- **Eloquent models in job `__construct` without `SerializesModels`** — without this trait, the entire model is serialized to the queue, which is large and stale. With `SerializesModels`, only the model ID is stored and the model is re-fetched when the job processes.
- **`RefreshDatabase` on every test** — wrapping tests that only read data with `RefreshDatabase` adds overhead. Only use it for tests that write to the database. For read-only tests, use mocks or factories in memory.
- **Deployment without `queue:restart`** — old queue workers continue running stale code after deployment. Always run `php artisan queue:restart` in your deploy script; workers gracefully finish current jobs then restart with new code.
- **`APP_DEBUG=true` in production** — this leaks stack traces, file paths, and environment variables in HTTP error responses. Always set `APP_DEBUG=false` and `APP_ENV=production` in production `.env`.

---

## Review Questions

1. What is the `SerializesModels` trait on Job classes? What problem does it solve compared to serializing the full Eloquent model?
2. Explain the difference between `Queue::fake()` and `dispatchSync()` for testing. When would you use each?
3. What does `php artisan queue:restart` do, and why is it part of every deployment script?
4. What is the difference between `RefreshDatabase` and `DatabaseTransactions` in Laravel tests? Which is faster and why?

---

## Sources

- [Laravel Documentation: Queues](https://laravel.com/docs/11.x/queues)
- [Laravel Documentation: Task Scheduling](https://laravel.com/docs/11.x/scheduling)
- [Laravel Documentation: Testing](https://laravel.com/docs/11.x/testing)
- [Pest PHP Documentation](https://pestphp.com/docs/installation)
- [Laravel Sail](https://laravel.com/docs/11.x/sail)

---

#PHP #Laravel
