---
title: Laravel Blade and Views
aliases:
  - Blade Templates
  - Laravel Views
  - Blade Components
  - Laravel Livewire
  - Inertia.js Laravel
tags: [PHP, Laravel, blade, views, frontend]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - Laravel_Overview
  - Laravel_Routing_and_Controllers
  - Laravel_Auth_and_Middleware
status: complete
---

# Laravel Blade and Views

> [!abstract] TL;DR
> Blade is Laravel's templating engine — it compiles `.blade.php` files to optimized PHP and caches them. It provides `{{ }}` for escaped output, `{!! !!}` for raw HTML, `@if`/`@foreach`/`@each` directives, layout inheritance with `@extends`/`@section`/`@yield`, and reusable components. For reactive UIs, Livewire adds server-side reactivity; Inertia.js bridges Vue/React SPAs with a Laravel backend.

---

## Output Syntax

```blade
{{-- Blade comment (not sent to browser) --}}

{{-- Escaped output (prevents XSS — htmlspecialchars applied) --}}
{{ $user->name }}
{{ $post->title ?? 'Untitled' }}

{{-- Raw HTML output (ONLY for trusted content) --}}
{!! $article->rendered_html !!}

{{-- PHP code block (rare, avoid in views) --}}
@php
    $greeting = now()->hour < 12 ? 'Good morning' : 'Good evening';
@endphp
{{ $greeting }}, {{ $user->name }}!
```

---

## Directives

### Conditionals

```blade
@if ($user->isAdmin())
    <a href="/admin">Admin Panel</a>
@elseif ($user->isModerator())
    <a href="/mod">Mod Tools</a>
@else
    <p>Welcome, {{ $user->name }}</p>
@endif

{{-- unless = if NOT --}}
@unless ($user->isVerified())
    <div class="alert">Please verify your email.</div>
@endunless

{{-- isset / empty / auth --}}
@isset($profile)
    {{ $profile->bio }}
@endisset

@empty($posts)
    <p>No posts yet.</p>
@endempty

@auth
    Logged in as {{ auth()->user()->name }}
@endauth

@guest
    <a href="/login">Login</a>
@endguest
```

### Loops

```blade
@foreach ($posts as $post)
    <article>
        <h2>{{ $post->title }}</h2>
        {{-- $loop variable — available inside foreach --}}
        <small>{{ $loop->iteration }} of {{ $loop->count }}</small>
        @if ($loop->first) <span class="badge">New</span> @endif
        @if ($loop->last)  <hr> @endif
    </article>
@endforeach

@forelse ($posts as $post)
    <li>{{ $post->title }}</li>
@empty
    <p>No posts found.</p>
@endforelse

@for ($i = 0; $i < 3; $i++)
    <div>{{ $i }}</div>
@endfor

@while ($queue->isNotEmpty())
    {{ $queue->shift() }}
@endwhile

{{-- break / continue inside loops --}}
@foreach ($items as $item)
    @continue($item->isHidden())
    @break($loop->iteration > 10)
    {{ $item->name }}
@endforeach
```

---

## Layouts with @extends / @section / @yield

### Layout File (`resources/views/layouts/app.blade.php`)

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'My App')</title>
    @stack('styles')
</head>
<body>
    @include('partials.navbar')

    <main class="container">
        @yield('content')
    </main>

    @include('partials.footer')
    @stack('scripts')
</body>
</html>
```

### Child View (`resources/views/posts/index.blade.php`)

```blade
@extends('layouts.app')

@section('title', 'Posts')

@section('content')
    <h1>All Posts</h1>
    @foreach ($posts as $post)
        @include('posts.partials.card', ['post' => $post])
    @endforeach
    {{ $posts->links() }}  {{-- Pagination links --}}
@endsection

@push('scripts')
    <script src="/js/posts.js"></script>
@endpush
```

---

## Blade Components

Components are reusable, encapsulated UI elements (Laravel 7+):

### Class-Based Component

```php
// app/View/Components/Alert.php
namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component {
    public function __construct(
        public string $type = 'info',  // props → public properties
        public string $message = '',
    ) {}

    public function iconClass(): string {
        return match($this->type) {
            'error'   => 'icon-error text-red-500',
            'success' => 'icon-check text-green-500',
            default   => 'icon-info text-blue-500',
        };
    }

    public function render() {
        return view('components.alert');
    }
}
```

```blade
{{-- resources/views/components/alert.blade.php --}}
<div class="alert alert-{{ $type }}">
    <i class="{{ $iconClass() }}"></i>
    {{ $message }}
    {{ $slot }}  {{-- default slot for additional content --}}
</div>
```

```blade
{{-- Using the component --}}
<x-alert type="error" message="Something went wrong." />

<x-alert type="success">
    <strong>Success!</strong> Your post has been saved.
</x-alert>
```

### Anonymous Components (no PHP class needed)

```blade
{{-- resources/views/components/button.blade.php --}}
@props(['variant' => 'primary', 'type' => 'button'])
<button type="{{ $type }}" class="btn btn-{{ $variant }}" {{ $attributes }}>
    {{ $slot }}
</button>

{{-- Usage --}}
<x-button variant="danger" type="submit" class="mt-4">Delete</x-button>
```

### Named Slots

```blade
{{-- resources/views/components/card.blade.php --}}
<div class="card">
    <div class="card-header">{{ $header }}</div>
    <div class="card-body">{{ $slot }}</div>
    @isset($footer)
        <div class="card-footer">{{ $footer }}</div>
    @endisset
</div>

{{-- Usage --}}
<x-card>
    <x-slot:header>My Card Title</x-slot:header>
    <p>Card body content here</p>
    <x-slot:footer>Footer text</x-slot:footer>
</x-card>
```

---

## Returning Views from Controllers

```php
// Return a view with data
return view('posts.index', [
    'posts' => Post::published()->paginate(15),
    'title' => 'Latest Posts',
]);

// Compact shorthand
$posts = Post::published()->paginate(15);
$title = 'Latest Posts';
return view('posts.index', compact('posts', 'title'));

// With method chaining
return view('posts.show')
    ->with('post', $post)
    ->with('related', $post->related()->take(3)->get());
```

---

## Livewire Overview (Reactive UIs)

Livewire allows reactive, real-time UI updates without writing JavaScript:

```php
// app/Livewire/SearchPosts.php
namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class SearchPosts extends Component {
    public string $search = '';  // $wire.search — two-way bound to input

    public function render() {
        return view('livewire.search-posts', [
            'posts' => Post::where('title', 'like', "%{$this->search}%")
                          ->limit(10)->get(),
        ]);
    }
}
```

```blade
{{-- resources/views/livewire/search-posts.blade.php --}}
<div>
    <input wire:model.live="search" placeholder="Search posts...">
    @foreach ($posts as $post)
        <div>{{ $post->title }}</div>
    @endforeach
</div>
```

```blade
{{-- Include in parent view --}}
<livewire:search-posts />
```

---

## Inertia.js Overview

Inertia.js builds SPAs using Vue/React/Svelte on the frontend with Laravel controllers as the "backend API":

```php
// Controller returns an Inertia response (not a JSON response, not a view)
use Inertia\Inertia;

class PostController extends Controller {
    public function index(): \Inertia\Response {
        return Inertia::render('Posts/Index', [
            'posts' => PostResource::collection(Post::paginate(15)),
            'filters' => request()->only(['search', 'tag']),
        ]);
    }
}
```

```jsx
// resources/js/Pages/Posts/Index.jsx (React)
import { usePage, Link } from '@inertiajs/react';

export default function PostsIndex({ posts, filters }) {
    return (
        <div>
            {posts.data.map(post => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                    {post.title}
                </Link>
            ))}
        </div>
    );
}
```

---

## Common Pitfalls

- **Using `{!! !!}` with user content** — raw output bypasses XSS escaping. Only use `{!! !!}` for pre-sanitized HTML from trusted sources (e.g., a Markdown parser that already escapes output). Use `{{ }}` for any user-generated content.
- **`@include` in loops creates N view compiles** — calling `@include` inside a `@foreach` recompiles the partial each time. Prefer Blade components with `@each('partial', $items, 'item')` which uses efficient array rendering.
- **Missing `@stack` / `@push` for assets** — if `@stack('scripts')` is not in the layout but a component uses `@push('scripts')`, the scripts are silently discarded.
- **Livewire re-rendering entire component** — Livewire re-renders the full component on every property change by default. Use `wire:model.blur` or `wire:model.lazy` instead of `wire:model.live` for inputs that don't need real-time updates, to reduce server round trips.

---

## Review Questions

1. What is the difference between `{{ $var }}` and `{!! $var !!}` in Blade? When is each appropriate?
2. What data does the `$loop` variable provide inside a `@foreach` loop? List four properties.
3. How does a Blade component differ from `@include`? What advantages do components offer?
4. How does Inertia.js differ from a traditional Laravel + Blade app and a traditional Laravel API + Vue SPA?

---

## Sources

- [Laravel Documentation: Blade Templates](https://laravel.com/docs/11.x/blade)
- [Laravel Documentation: Blade Components](https://laravel.com/docs/11.x/blade#components)
- [Livewire Documentation](https://livewire.laravel.com/)
- [Inertia.js Documentation](https://inertiajs.com/)

---

#PHP #Laravel
