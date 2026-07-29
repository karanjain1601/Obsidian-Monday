---
title: PHP and Laravel Master MOC
aliases:
  - PHP MOC
  - Laravel MOC
  - PHP Map of Content
tags: [PHP, Laravel, MOC]
domain: PHP
created: 2026-07-29
status: complete
---

# PHP and Laravel — Master MOC

> [!abstract] About
> 22 notes across 3 sections covering the full PHP 8.x language, the Laravel framework, and the broader PHP ecosystem. Emphasis on PHP 8.x modern features (match, named args, enums, readonly, first-class callables) versus old PHP patterns, and Laravel's architecture (service container, Eloquent, Blade, Sanctum, queues).

---

## Knowledge Map

```mermaid
graph TD
    Master["PHP & Laravel Master MOC"]

    subgraph Foundations["01 PHP Fundamentals"]
        Overview["PHP Overview\n(history, PHP-FPM, Composer)"]
        Types["PHP Types & Variables\n(strict_types, union types, readonly)"]
        Control["Control Flow & Functions\n(match, arrow fn, named args)"]
        OOP["PHP OOP\n(traits, enums, constructor promotion)"]
        Errors["Error Handling\n(Throwable, exceptions, set_exception_handler)"]
        Arrays["Arrays & Strings\n(array_map/filter/reduce, str_contains)"]
    end

    subgraph LaravelSec["02 Laravel Framework"]
        LOverview["Laravel Overview\n(Service Container, Facades, Artisan)"]
        Routing["Routing & Controllers\n(resource routes, model binding)"]
        Eloquent["Eloquent ORM\n(relationships, scopes, N+1)"]
        Blade["Blade & Views\n(components, Livewire, Inertia)"]
        Auth["Auth & Middleware\n(Sanctum, Spatie, CSRF)"]
        Jobs["Jobs, Testing & Deployment\n(queues, Pest, Forge)"]
    end

    subgraph Ecosystem["03 PHP Ecosystem"]
        Composer["Composer & Packages\n(PSR-4, semver, Packagist)"]
        DB["Database Access\n(PDO, migrations, Doctrine vs Eloquent)"]
        API["API Development\n(Resources, rate limiting, pagination)"]
        Testing["PHP Testing\n(PHPUnit, Pest, Faker, Xdebug)"]
    end

    Master --> Foundations
    Master --> LaravelSec
    Master --> Ecosystem

    Overview --> LOverview
    OOP --> Eloquent
    OOP --> LOverview
    Types --> Control
    Errors --> Jobs
    Control --> Arrays
    LOverview --> Routing
    LOverview --> Auth
    Routing --> Eloquent
    Eloquent --> API
    Auth --> API
    Blade --> Auth
    Composer --> LOverview
    DB --> Eloquent
    DB --> API
    Testing --> Jobs
    Testing --> API
```

---

## Sections

### 01 — PHP Fundamentals

| Note | Difficulty | Key Concepts |
|------|-----------|-------------|
| [[PHP_Overview]] | Beginner | PHP 8.x features, PHP-FPM, Composer, JIT, match, nullsafe `?->` |
| [[PHP_Types_and_Variables]] | Beginner | strict_types, union types, nullable, readonly, mixed, never |
| [[PHP_Control_Flow_and_Functions]] | Beginner | match expression, named args, arrow fn, first-class callables, spread |
| [[PHP_OOP]] | Intermediate | constructor promotion, traits, enums, late static binding, magic methods |
| [[PHP_Error_Handling]] | Intermediate | Throwable hierarchy, multi-catch, exception chaining, throw as expression |
| [[PHP_Arrays_and_String]] | Beginner | array_map/filter/reduce, usort, str_contains/starts_with/ends_with, heredoc |

### 02 — Laravel Framework

| Note | Difficulty | Key Concepts |
|------|-----------|-------------|
| [[Laravel_Overview]] | Intermediate | MVC + Service Container, Artisan, .env, Service Providers, Facades |
| [[Laravel_Routing_and_Controllers]] | Intermediate | Route groups, resource controllers, model binding, FormRequest |
| [[Laravel_Eloquent_ORM]] | Intermediate | Relationships, scopes, eager loading, N+1, soft deletes, accessors |
| [[Laravel_Blade_and_Views]] | Intermediate | Blade directives, components, layouts, Livewire, Inertia.js |
| [[Laravel_Auth_and_Middleware]] | Intermediate | Auth facade, Sanctum, middleware, CSRF, Spatie Permission |
| [[Laravel_Jobs_Testing_Deployment]] | Advanced | Queues, scheduled tasks, Pest, facades fake, Forge/Vapor |

### 03 — PHP Ecosystem

| Note | Difficulty | Key Concepts |
|------|-----------|-------------|
| [[Composer_and_Packages]] | Beginner | composer.json, PSR-4, semver constraints, composer.lock, Packagist |
| [[PHP_Database_Access]] | Intermediate | PDO, prepared statements, migrations, Doctrine vs Eloquent, SQLite tests |
| [[PHP_API_Development]] | Intermediate | API Resources, versioning, rate limiting, pagination, Swagger, GraphQL |
| [[PHP_Testing]] | Intermediate | PHPUnit, Pest, datasets, mocks, Faker, Xdebug coverage |

---

## Learning Paths

### Path A — PHP Backend Developer

Sequential path for developers learning PHP for backend web development:

1. **Language Foundation** (Week 1)
   - [[PHP_Overview]] — understand the ecosystem and PHP-FPM execution model
   - [[PHP_Types_and_Variables]] — master PHP's type system and strict_types
   - [[PHP_Control_Flow_and_Functions]] — match, named args, arrow functions
   - [[PHP_Arrays_and_String]] — array functions and string manipulation

2. **Object-Oriented PHP** (Week 2)
   - [[PHP_OOP]] — classes, traits, enums, constructor promotion
   - [[PHP_Error_Handling]] — exception hierarchy, try/catch, Throwable

3. **Database and Packages** (Week 3)
   - [[Composer_and_Packages]] — project setup, dependencies, PSR-4
   - [[PHP_Database_Access]] — PDO, prepared statements, migrations

4. **Testing** (Week 4)
   - [[PHP_Testing]] — PHPUnit, Pest, Faker, mocks

**Milestone:** Build a pure PHP REST API with PDO, Composer autoloading, and PHPUnit tests.

---

### Path B — Laravel Full-Stack Developer

Path for developers targeting the full Laravel stack:

1. **PHP Basics** (Days 1–3)
   - [[PHP_Overview]], [[PHP_Types_and_Variables]], [[PHP_Control_Flow_and_Functions]]

2. **Laravel Core** (Week 1–2)
   - [[Laravel_Overview]] — architecture, container, service providers
   - [[Laravel_Routing_and_Controllers]] — routes, controllers, model binding
   - [[Laravel_Eloquent_ORM]] — models, relationships, eager loading
   - [[Composer_and_Packages]] — managing the project

3. **Frontend & Auth** (Week 3)
   - [[Laravel_Blade_and_Views]] — Blade templates, components, Livewire
   - [[Laravel_Auth_and_Middleware]] — auth, middleware, Sanctum

4. **Production Skills** (Week 4)
   - [[Laravel_Jobs_Testing_Deployment]] — queues, tests, deployment
   - [[PHP_Testing]] — Pest, fakes, coverage
   - [[PHP_Database_Access]] — advanced migrations, Doctrine comparison

**Milestone:** Ship a full-stack Laravel app with authentication, Eloquent relationships, queue-based email, and 80%+ test coverage.

---

### Path C — API Developer

Path for developers building Laravel REST APIs:

1. **Foundation** (Days 1–4)
   - [[PHP_Overview]], [[PHP_Types_and_Variables]], [[PHP_OOP]]
   - [[Composer_and_Packages]]

2. **Laravel API** (Week 1–2)
   - [[Laravel_Overview]] — service container, providers
   - [[Laravel_Routing_and_Controllers]] — `apiResource`, invokable controllers
   - [[Laravel_Eloquent_ORM]] — query builder, eager loading
   - [[Laravel_Auth_and_Middleware]] — Sanctum token auth, rate limiting

3. **API Design** (Week 3)
   - [[PHP_API_Development]] — API Resources, versioning, pagination, OpenAPI
   - [[PHP_Database_Access]] — migrations, seeds, testing with SQLite

4. **Quality & Scale** (Week 4)
   - [[Laravel_Jobs_Testing_Deployment]] — async processing, deployment
   - [[PHP_Testing]] — feature tests, HTTP fakes, Pest datasets

**Milestone:** Build a versioned, documented, rate-limited API with Sanctum authentication, API Resources, cursor pagination, and full Pest test suite.

---

## Cross-Vault Links

- [[Python/Backend/FastAPI_Deep_Dive]] — compare PHP-FPM + Laravel vs Python ASGI + FastAPI for API development
- [[Java/16_Spring_Core/Spring_IoC_Container]] — Spring's dependency injection is similar to Laravel's service container
- [[System Design/_MOC_SystemDesign_Master]] — architectural patterns applicable to Laravel microservices
- [[Database/_MOC_Database_Master]] — database fundamentals that complement [[PHP_Database_Access]] and [[Laravel_Eloquent_ORM]]
- [[DevOps/_MOC_DevOps_Master]] — containerization and CI/CD workflows that support [[Laravel_Jobs_Testing_Deployment]]

---

#PHP #Laravel
