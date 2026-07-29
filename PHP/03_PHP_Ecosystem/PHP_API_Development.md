---
title: PHP API Development
aliases:
  - Laravel API
  - Laravel API Resources
  - PHP REST API
  - Laravel JSON API
  - Laravel Rate Limiting
  - Laravel Pagination
tags: [PHP, Laravel, API, REST, JSON]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - Laravel_Routing_and_Controllers
  - Laravel_Auth_and_Middleware
  - PHP_Database_Access
  - Laravel_Eloquent_ORM
status: complete
---

# PHP API Development

> [!abstract] TL;DR
> Laravel is a first-class REST API framework — `routes/api.php` is CSRF-free and rate-limited by default. API Resources transform Eloquent models into JSON with full control over structure. Pagination via `LengthAwarePaginator` adds next/prev links automatically. Sanctum handles token auth. L5-Swagger generates OpenAPI docs from annotations. Lighthouse provides a GraphQL layer over Eloquent.

---

## JSON APIs with Pure PHP

Before frameworks, building a PHP API required manual header manipulation:

```php
<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$pdo = new PDO('mysql:host=localhost;dbname=app', 'root', 'secret');

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$body   = json_decode(file_get_contents('php://input'), associative: true);

if ($method === 'GET' && $path === '/api/users') {
    $users = $pdo->query("SELECT id, name, email FROM users")->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode(['data' => $users]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
```

This is purely educational — in production, always use a framework (Laravel, Slim, Symfony) for security, validation, and maintainability.

---

## Laravel API Structure

```php
// routes/api.php — automatically prefixed /api, stateless (no sessions/CSRF)
use App\Http\Controllers\Api\V1\UserController;

Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public routes
    Route::post('/auth/login',    [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::apiResource('users',   UserController::class);
        Route::apiResource('posts',   PostController::class);
        Route::apiResource('comments', CommentController::class)->only(['store', 'destroy']);
    });
});
```

---

## API Resources — Transforming Models to JSON

API Resources decouple your database schema from your API contract:

```php
php artisan make:resource UserResource
php artisan make:resource UserCollection   # or: UserResource --collection

// app/Http/Resources/UserResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource {
    public function toArray(\Illuminate\Http\Request $request): array {
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'email'    => $this->email,
            'role'     => $this->role,
            'avatar'   => $this->avatar_url,  // computed/renamed
            'joinedAt' => $this->created_at->toISOString(),
            // Conditionally include (only if loaded / permission check)
            'posts'    => PostResource::collection($this->whenLoaded('posts')),
            'token'    => $this->when($request->user()?->isAdmin(), $this->api_token),
            // Merge conditionally
            $this->mergeWhen($this->isAdmin(), [
                'adminSince' => $this->admin_since,
            ]),
        ];
    }

    // Custom metadata
    public function with(\Illuminate\Http\Request $request): array {
        return ['meta' => ['version' => 'v1']];
    }
}

// Controller usage
return new UserResource($user);
return UserResource::collection($users);   // collection wrapper
return UserResource::collection(User::paginate(15));  // pagination auto-detected
```

### Resource Collections with Meta

```php
// app/Http/Resources/UserCollection.php
class UserCollection extends ResourceCollection {
    public function toArray(\Illuminate\Http\Request $request): array {
        return [
            'data'  => $this->collection,
            'stats' => [
                'total'   => $this->collection->count(),
                'admins'  => $this->collection->where('role', 'admin')->count(),
            ],
        ];
    }
}
```

---

## API Versioning

```php
// routes/api.php
Route::prefix('v1')->namespace('App\Http\Controllers\Api\V1')->group(base_path('routes/api_v1.php'));
Route::prefix('v2')->namespace('App\Http\Controllers\Api\V2')->group(base_path('routes/api_v2.php'));

// Or using route name prefixes + resource versioning
Route::prefix('v1')->name('v1.')->group(function () {
    Route::apiResource('posts', V1\PostController::class);
});

Route::prefix('v2')->name('v2.')->group(function () {
    Route::apiResource('posts', V2\PostController::class);  // different resource shape
});
```

---

## Rate Limiting

```php
// bootstrap/app.php (Laravel 11+) — or RouteServiceProvider
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(120)->by($request->user()->id)   // logged in: 120/min
        : Limit::perMinute(20)->by($request->ip());          // guest: 20/min
});

RateLimiter::for('login', function (Request $request) {
    return [
        Limit::perMinute(5)->by($request->input('email')),  // 5 attempts per email
        Limit::perMinute(10)->by($request->ip()),            // 10 attempts per IP
    ];
});

// Apply to routes
Route::middleware('throttle:api')->group(function () { ... });
Route::post('/login', LoginController::class)->middleware('throttle:login');
```

Rate limit headers in response:
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
Retry-After: 60       (on 429 Too Many Requests)
```

---

## Pagination

```php
// LengthAwarePaginator — includes total, last_page, links
$posts = Post::published()->paginate(
    perPage: 15,
    columns: ['id', 'title', 'published_at'],
    pageName: 'page',
    page: $request->get('page', 1),
);
return PostResource::collection($posts);
```

Response shape:
```json
{
    "data": [...],
    "links": {
        "first": "https://api.example.com/posts?page=1",
        "last":  "https://api.example.com/posts?page=12",
        "prev":  null,
        "next":  "https://api.example.com/posts?page=2"
    },
    "meta": {
        "current_page": 1,
        "last_page": 12,
        "per_page": 15,
        "total": 178,
        "from": 1,
        "to": 15
    }
}
```

```php
// Cursor pagination — better for large datasets (uses cursor, not offset)
$posts = Post::orderBy('id')->cursorPaginate(15);
// Uses: ?cursor=eyJpZCI6MTUsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0

// Simple paginator — no total count (faster)
$posts = Post::simplePaginate(15);
```

---

## OpenAPI with L5-Swagger

```bash
composer require "darkaonline/l5-swagger"
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

```php
/**
 * @OA\Info(title="My API", version="1.0")
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class Controller {}

/**
 * @OA\Get(
 *     path="/api/v1/users",
 *     summary="List users",
 *     tags={"Users"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="User list",
 *         @OA\JsonContent(ref="#/components/schemas/UserCollection")
 *     )
 * )
 */
public function index(): UserCollection { ... }
```

```bash
php artisan l5-swagger:generate  # → visit /api/documentation
```

---

## GraphQL with Lighthouse

```bash
composer require nuwave/lighthouse
php artisan vendor:publish --tag=lighthouse-schema
```

```graphql
# graphql/schema.graphql
type Query {
    users(first: Int, page: Int): UserPaginator @paginate(defaultCount: 10)
    user(id: ID! @eq): User @find
    posts(published: Boolean @eq): [Post!]! @all
}

type Mutation {
    createPost(input: CreatePostInput! @spread): Post @create
    updatePost(id: ID!, input: UpdatePostInput! @spread): Post @update
    deletePost(id: ID! @whereKey): Post @delete
}

type User {
    id:    ID!
    name:  String!
    email: String!
    posts: [Post!]! @hasMany
}
```

```bash
# Access at: POST /graphql
# Playground at: GET /graphql-playground
```

---

## Common Pitfalls

- **Exposing internal model structure in API responses** — returning `$model->toArray()` directly leaks database column names, timestamps, and sensitive fields. Always use API Resources to control the response shape.
- **Missing `whenLoaded()` causing N+1** — `$this->posts` in a Resource forces lazy loading. Use `$this->whenLoaded('posts')` — it only includes the relationship if it was eager-loaded via `with('posts')`. Without this, each resource instance fires an extra query.
- **Offset pagination on large tables** — `LIMIT 15 OFFSET 10000` scans 10,015 rows. For tables > 100k rows, use cursor pagination (`cursorPaginate()`) which uses an indexed cursor column instead.
- **Rate limiter not returning headers on success** — if you don't see `X-RateLimit-*` headers, check that the `ThrottleRequests` middleware is applied. It only sets headers when the request succeeds (not on 429s without retry-after).

---

## Review Questions

1. Why should you use API Resources instead of returning `$model->toJson()` directly from a controller?
2. What does `$this->whenLoaded('posts')` do in an API Resource? What query problem does it prevent?
3. What is the difference between `paginate()`, `simplePaginate()`, and `cursorPaginate()`? When is cursor pagination preferable?
4. You have a public `/api/login` endpoint. Describe how you would apply per-email and per-IP rate limiting to it.

---

## Sources

- [Laravel Documentation: API Resources](https://laravel.com/docs/11.x/eloquent-resources)
- [Laravel Documentation: Rate Limiting](https://laravel.com/docs/11.x/rate-limiting)
- [Lighthouse GraphQL for Laravel](https://lighthouse-php.com/)
- [L5-Swagger](https://github.com/DarkaOnLine/L5-Swagger)

---

#PHP #Laravel
