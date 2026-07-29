---
title: Laravel Eloquent ORM
aliases:
  - Eloquent ORM
  - Laravel Models
  - Laravel Relationships
  - Laravel Query Builder
  - Eloquent N+1
tags: [PHP, Laravel, eloquent, ORM, database]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - Laravel_Overview
  - Laravel_Routing_and_Controllers
  - PHP_Database_Access
  - Laravel_Jobs_Testing_Deployment
status: complete
---

# Laravel Eloquent ORM

> [!abstract] TL;DR
> Eloquent is Laravel's Active Record ORM where each model class maps to a database table and each model instance maps to a row. It provides expressive query building, six relationship types, local/global scopes, accessors/mutators, mass assignment protection, and soft deletes — with the critical N+1 problem solved by eager loading with `with()`.

---

## Model Definition

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model {
    use HasFactory, SoftDeletes;

    // Override defaults (Eloquent guesses from class name)
    protected $table      = 'posts';         // default: 'posts' (plural snake_case)
    protected $primaryKey = 'id';            // default: 'id'
    public    $timestamps = true;            // created_at, updated_at

    // Mass assignment protection
    protected $fillable = ['title', 'body', 'user_id', 'published_at'];
    // OR use $guarded (opposite approach):
    // protected $guarded = ['id'];  // allow all except 'id'

    // Type casts
    protected $casts = [
        'published_at' => 'datetime',
        'metadata'     => 'array',      // JSON column ↔ PHP array
        'is_featured'  => 'boolean',
        'price'        => 'decimal:2',
    ];

    // Hidden from JSON serialization (never expose these in APIs)
    protected $hidden = ['deleted_at'];

    // Always loaded in JSON (appended from accessors)
    protected $appends = ['excerpt'];
}
```

---

## CRUD Operations

```php
// Create
$post = Post::create(['title' => 'Hello', 'body' => '...', 'user_id' => 1]);
$post = new Post(['title' => 'Hello']);
$post->body = 'World';
$post->save();

// First or Create (upsert pattern)
$tag = Tag::firstOrCreate(['name' => 'php'], ['color' => 'blue']);
$tag = Tag::updateOrCreate(['slug' => 'php'], ['name' => 'PHP', 'color' => 'indigo']);

// Read
$post    = Post::find(1);                  // null if not found
$post    = Post::findOrFail(1);            // throws ModelNotFoundException
$posts   = Post::all();                    // all rows (careful on large tables)
$first   = Post::where('published', true)->first();

// Update
$post->update(['title' => 'Updated Title']);
Post::where('active', false)->update(['published' => false]);  // mass update

// Delete
$post->delete();            // soft delete if SoftDeletes trait is used
$post->forceDelete();       // hard delete bypassing soft delete
Post::destroy([1, 2, 3]);   // delete by IDs

// Restore soft-deleted
Post::withTrashed()->where('id', 1)->restore();
```

---

## Query Builder

```php
// Chaining — builds SQL lazily, executes on terminal call
$posts = Post::query()
    ->select('id', 'title', 'published_at')
    ->where('published', true)
    ->where('user_id', $userId)
    ->orWhere('is_featured', true)
    ->whereBetween('published_at', [now()->subMonth(), now()])
    ->whereNotNull('thumbnail_url')
    ->orderBy('published_at', 'desc')
    ->limit(10)
    ->offset(20)
    ->get();  // returns Eloquent Collection

// when() — conditional clauses (avoids if/else in query chains)
$posts = Post::query()
    ->when($request->get('search'), fn($q, $search) =>
        $q->where('title', 'like', "%$search%")
    )
    ->when($request->get('tag'), fn($q, $tag) =>
        $q->whereHas('tags', fn($q) => $q->where('name', $tag))
    )
    ->paginate(15);

// Aggregates
Post::count();
Post::where('published', true)->count();
Post::max('views');
Post::avg('rating');

// Raw expressions (when builder is insufficient)
Post::selectRaw('DATE(published_at) as date, COUNT(*) as count')
    ->groupByRaw('DATE(published_at)')
    ->get();
```

---

## Relationships

```php
class User extends Model {
    // One-to-One: user has one profile
    public function profile(): \Illuminate\Database\Eloquent\Relations\HasOne {
        return $this->hasOne(Profile::class);
    }

    // One-to-Many: user has many posts
    public function posts(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(Post::class);
    }

    // Many-to-Many: user has many roles (via role_user pivot)
    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany {
        return $this->belongsToMany(Role::class)
                    ->withTimestamps()
                    ->withPivot('granted_at');
    }
}

class Post extends Model {
    // Inverse of hasMany
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(User::class);
    }

    // Polymorphic: post has many comments (along with videos, etc.)
    public function comments(): \Illuminate\Database\Eloquent\Relations\MorphMany {
        return $this->morphMany(Comment::class, 'commentable');
    }

    // Has-Many-Through: post has many country (through user)
    public function tags(): \Illuminate\Database\Eloquent\Relations\BelongsToMany {
        return $this->belongsToMany(Tag::class);
    }
}

// Using relationships
$user = User::find(1);
$posts    = $user->posts;                  // lazy load (triggers query)
$profile  = $user->profile;
$roles    = $user->roles;

// Attach/detach many-to-many
$user->roles()->attach($roleId, ['granted_at' => now()]);
$user->roles()->detach($roleId);
$user->roles()->sync([1, 2, 3]);           // sync to exactly these IDs
```

---

## N+1 Problem and Eager Loading

The N+1 problem is the most common Eloquent performance issue:

```php
// BAD — N+1: 1 query to get posts + N queries for each user
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name;  // fires a query each iteration!
}
// → 1 + N queries (N = number of posts)

// GOOD — Eager loading: 2 queries total
$posts = Post::with('user')->get();
foreach ($posts as $post) {
    echo $post->user->name;  // no additional query — already loaded
}
// → 2 queries (posts + users WHERE id IN (...))

// Eager load multiple relationships
$posts = Post::with(['user', 'tags', 'comments.user'])->get();

// Nested eager loading
$users = User::with('posts.comments')->get();

// Constrained eager loading
$posts = Post::with(['comments' => function($q) {
    $q->where('approved', true)->latest()->limit(5);
}])->get();

// Lazy eager loading (after initial query)
$posts = Post::all();
$posts->load('user', 'tags');

// Detect N+1 in development (add to AppServiceProvider::boot())
\Illuminate\Database\Eloquent\Model::preventLazyLoading(
    ! app()->isProduction()
);
```

---

## Scopes

```php
class Post extends Model {
    // Local scope — reusable query constraint
    public function scopePublished(Builder $query): Builder {
        return $query->where('published', true)->whereNotNull('published_at');
    }

    public function scopeFeatured(Builder $query): Builder {
        return $query->where('is_featured', true);
    }

    // Scope with parameter
    public function scopeByAuthor(Builder $query, int $userId): Builder {
        return $query->where('user_id', $userId);
    }

    // Global scope — applies to ALL queries on this model
    protected static function booted(): void {
        static::addGlobalScope('active', fn(Builder $q) => $q->where('active', true));
    }
}

// Using local scopes
$posts = Post::published()->featured()->byAuthor(1)->get();

// Removing global scope
Post::withoutGlobalScope('active')->get();
```

---

## Accessors, Mutators, and Casts (PHP 8.x Syntax)

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model {
    // Accessor + Mutator in one (Laravel 9+ syntax)
    protected function name(): Attribute {
        return Attribute::make(
            get: fn(string $value) => ucwords($value),
            set: fn(string $value) => strtolower(trim($value)),
        );
    }

    // Computed attribute (no database column)
    protected function fullName(): Attribute {
        return Attribute::make(
            get: fn() => "{$this->first_name} {$this->last_name}",
        );
    }
}

// In $appends, it serializes to JSON
protected $appends = ['full_name'];
```

---

## Soft Deletes

```php
// Migration
$table->softDeletes();  // adds deleted_at column

// Model
use Illuminate\Database\Eloquent\SoftDeletes;
class Post extends Model { use SoftDeletes; }

// Usage
$post->delete();                          // sets deleted_at = now()
Post::all();                              // excludes soft-deleted
Post::withTrashed()->get();               // includes soft-deleted
Post::onlyTrashed()->get();               // only soft-deleted
Post::withTrashed()->where('id', 5)->restore(); // restore
Post::withTrashed()->where('id', 5)->forceDelete(); // permanent delete
```

---

## Common Pitfalls

- **Mass assignment without `$fillable`** — calling `User::create($request->all())` without `$fillable` throws `MassAssignmentException`. Use `$fillable` to whitelist, or `$guarded = []` to allow all (dangerous with unvalidated input).
- **N+1 problem silent in development** — use `Model::preventLazyLoading(!app()->isProduction())` in `AppServiceProvider` to throw exceptions on lazy loads in development. This forces you to add `with()` eagerly.
- **`get()` on a large table** — `Post::all()` or `Post::get()` loads ALL rows into memory. Use `->paginate()`, `->chunk()`, or `->cursor()` for large datasets.
- **Accessors not in `$appends` won't appear in JSON** — computed attributes (accessors) must be explicitly added to `$appends` to appear in `toArray()` / `toJson()` / API responses.

---

## Review Questions

1. What is the N+1 problem in Eloquent? Give an example of code that triggers it and show how to fix it with eager loading.
2. What is the difference between a local scope and a global scope? How do you remove a global scope for a specific query?
3. When would you use `firstOrCreate()` vs `updateOrCreate()`? Describe the SQL each executes.
4. What does `Model::preventLazyLoading(true)` do, and why is it useful only in development?

---

## Sources

- [Laravel Documentation: Eloquent ORM](https://laravel.com/docs/11.x/eloquent)
- [Laravel Documentation: Eloquent Relationships](https://laravel.com/docs/11.x/eloquent-relationships)
- [Laravel Documentation: Eloquent: Getting Started](https://laravel.com/docs/11.x/eloquent#mass-assignment)

---

#PHP #Laravel
