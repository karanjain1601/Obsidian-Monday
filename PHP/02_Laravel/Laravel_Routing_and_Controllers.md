---
title: Laravel Routing and Controllers
aliases:
  - Laravel Routes
  - Laravel Controllers
  - Laravel Resource Routes
  - Laravel Route Groups
tags: [PHP, Laravel, routing, controllers]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - Laravel_Overview
  - Laravel_Auth_and_Middleware
  - Laravel_Eloquent_ORM
  - Laravel_Blade_and_Views
status: complete
---

# Laravel Routing and Controllers

> [!abstract] TL;DR
> Laravel routes map HTTP verbs + URI patterns to controllers or closures. `routes/web.php` handles browser requests (with CSRF, sessions), while `routes/api.php` handles stateless API requests (prefixed `/api`, rate-limited). Route model binding auto-resolves Eloquent models from URL parameters. Resource controllers generate all 7 RESTful routes with one line.

---

## Route Files

```php
// routes/web.php — browser routes (CSRF protection, sessions)
Route::get('/', fn() => view('welcome'));
Route::get('/about', [PageController::class, 'about']);

// routes/api.php — API routes (stateless, /api prefix, rate limiting)
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
```

---

## Route Definitions

```php
// Basic routes — HTTP verb → URI → action
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::patch('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::any('/webhook', [WebhookController::class, 'handle']); // any method

// Closure routes (simple, no controller needed)
Route::get('/ping', fn() => response()->json(['status' => 'ok']));

// Route parameters
Route::get('/users/{id}', function(int $id) {
    return User::findOrFail($id);
});

// Optional parameter
Route::get('/posts/{slug?}', function(?string $slug = null) {
    return $slug ? Post::whereSlug($slug)->first() : Post::latest()->get();
});

// Constraint (regex)
Route::get('/orders/{id}', fn($id) => Order::find($id))
    ->where('id', '[0-9]+');
Route::get('/users/{name}', fn($name) => User::where('name', $name)->first())
    ->whereAlpha('name');  // shorthand for [a-zA-Z]+
```

---

## Named Routes

```php
// Name a route
Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');

// Generate URL from name
$url = route('profile.show');                   // '/profile'
$url = route('profile.show', ['id' => 5]);      // '/profile?id=5' or '/profile/5'

// Redirect by name
return redirect()->route('profile.show');

// Check current route name (in middleware / views)
if (request()->routeIs('admin.*')) { /* ... */ }
```

---

## Route Groups

```php
// Prefix + middleware + name prefix
Route::prefix('admin')
    ->middleware(['auth', 'role:admin'])
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::resource('users', AdminUserController::class);
    });
// Creates: GET /admin/dashboard  (named 'admin.dashboard')
//           GET /admin/users      (named 'admin.users.index')
//           POST /admin/users     (named 'admin.users.store')
//           etc.

// API versioning
Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
});
Route::prefix('v2')->group(function () {
    Route::apiResource('products', V2\ProductController::class);
});
```

---

## Resource Controllers

One `Route::resource()` generates 7 RESTful routes:

```php
Route::resource('photos', PhotoController::class);
// Generates:
// GET    /photos           → index()   (list)
// GET    /photos/create    → create()  (show create form)
// POST   /photos           → store()   (create)
// GET    /photos/{id}      → show()    (detail)
// GET    /photos/{id}/edit → edit()    (show edit form)
// PUT    /photos/{id}      → update()  (full update)
// DELETE /photos/{id}      → destroy() (delete)

// API resource (no create/edit routes — no HTML forms needed)
Route::apiResource('posts', PostController::class);

// Partial resource
Route::resource('posts', PostController::class)->only(['index', 'show']);
Route::resource('posts', PostController::class)->except(['destroy']);
```

---

## Controllers

### Basic Controller

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller {
    // Constructor DI — Laravel auto-resolves from container
    public function __construct(
        private UserService $userService,
    ) {}

    public function index(Request $request): JsonResponse {
        $users = User::query()
            ->when($request->get('search'), fn($q, $search) =>
                $q->where('name', 'like', "%$search%")
            )
            ->paginate(15);

        return response()->json($users);
    }

    public function show(User $user): JsonResponse {
        // Route model binding — $user auto-resolved from {user} URL param
        return response()->json($user->load('posts'));
    }

    public function store(StoreUserRequest $request): JsonResponse {
        // $request->validated() only contains fields that passed validation
        $user = User::create($request->validated());
        return response()->json($user, 201);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse {
        $user->update($request->validated());
        return response()->json($user);
    }

    public function destroy(User $user): JsonResponse {
        $user->delete();
        return response()->json(null, 204);
    }
}
```

### Invokable Controllers (Single Action)

```php
// For controllers that do exactly one thing
Route::post('/newsletter/subscribe', SubscribeToNewsletterController::class);

class SubscribeToNewsletterController extends Controller {
    public function __invoke(Request $request): JsonResponse {
        // Single action — no method routing needed
        $request->validate(['email' => 'required|email']);
        Newsletter::subscribe($request->email);
        return response()->json(['message' => 'Subscribed!']);
    }
}
```

---

## Route Model Binding

```php
// Implicit binding — resolves by primary key ({user} → User::find($user))
Route::get('/users/{user}', function (User $user) {
    return $user;  // Laravel auto-finds or throws 404
});

// Customize the key
Route::get('/posts/{post:slug}', function (Post $post) {
    // Resolves via $post->slug instead of $post->id
    return $post;
});

// Custom resolution in the model
class Post extends Model {
    public function resolveRouteBinding(mixed $value, ?string $field = null): ?self {
        return $this->where($field ?? $this->getRouteKeyName(), $value)
                    ->where('published', true)  // only published posts
                    ->firstOrFail();
    }

    public function getRouteKeyName(): string {
        return 'slug';  // use slug as default route key
    }
}
```

---

## Request Object

```php
use Illuminate\Http\Request;

public function store(Request $request): JsonResponse {
    // Input
    $name  = $request->input('name');
    $name  = $request->name;           // magic property access
    $all   = $request->all();          // all input
    $only  = $request->only(['name', 'email']);
    $except = $request->except(['_token']);

    // Query string
    $page  = $request->query('page', 1);

    // File upload
    if ($request->hasFile('avatar')) {
        $path = $request->file('avatar')->store('avatars', 'public');
    }

    // HTTP info
    $method  = $request->method();     // 'POST'
    $isAjax  = $request->ajax();       // X-Requested-With: XMLHttpRequest
    $isJson  = $request->expectsJson();
    $ip      = $request->ip();
    $bearerToken = $request->bearerToken();

    // Validation (inline)
    $validated = $request->validate([
        'name'  => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'age'   => 'integer|min:0|max:150',
    ]);
}
```

---

## Common Pitfalls

- **Route order matters** — Laravel matches routes in declaration order. A wildcard route like `Route::get('/{any}', ...)` at the top of `web.php` will catch every request. Define specific routes before wildcard/fallback routes.
- **CSRF token missing on POST from SPA** — `routes/web.php` has CSRF middleware by default. API clients must either use `routes/api.php` (CSRF-free) or send the CSRF token in the `X-CSRF-TOKEN` header.
- **Route model binding silent 404** — if `User::findOrFail()` fails (user doesn't exist), Laravel throws `ModelNotFoundException` which renders as 404. Handle this in `app/Exceptions/Handler.php` for custom API error responses.
- **Caching routes in production** — `php artisan route:cache` speeds up route matching but requires that all route closures are replaced by controller methods (closures cannot be cached). Run `php artisan route:clear` after route changes.

---

## Review Questions

1. What is the difference between `routes/web.php` and `routes/api.php` in terms of middleware, prefix, and session handling?
2. How does route model binding work? What HTTP response code does it return when the model is not found?
3. What routes does `Route::apiResource('posts', PostController::class)` generate compared to `Route::resource()`?
4. A `Route::get('/{slug}', ...)` route is catching requests intended for `/login`. How do you fix this?

---

## Sources

- [Laravel Documentation: Routing](https://laravel.com/docs/11.x/routing)
- [Laravel Documentation: Controllers](https://laravel.com/docs/11.x/controllers)
- [Laravel Documentation: Route Model Binding](https://laravel.com/docs/11.x/routing#route-model-binding)
- [Laravel Documentation: Requests](https://laravel.com/docs/11.x/requests)

---

#PHP #Laravel
