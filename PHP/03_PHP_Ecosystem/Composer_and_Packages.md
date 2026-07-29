---
title: Composer and Packages
aliases:
  - PHP Composer
  - Packagist
  - PHP Package Manager
  - PSR-4 Autoloading
tags: [PHP, Laravel, composer, packages, autoloading]
domain: PHP
difficulty: Beginner
created: 2026-07-29
related:
  - PHP_Overview
  - Laravel_Overview
  - PHP_Testing
status: complete
---

# Composer and Packages

> [!abstract] TL;DR
> Composer is PHP's dependency manager — it resolves package dependencies, generates PSR-4 autoloading maps, and manages semantic versioning constraints. `composer.lock` pins exact versions for reproducible installs. Packagist is the default package repository. Key packages for the PHP ecosystem include Carbon (dates), Guzzle (HTTP), PHPUnit/Pest (testing), and Faker (test data).

---

## Composer Basics

```bash
# Installation (on fresh machine)
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Project initialization
composer init                         # interactive wizard
composer create-project laravel/laravel myapp  # new Laravel project

# Managing dependencies
composer require guzzlehttp/guzzle          # install + add to require
composer require --dev phpunit/phpunit      # dev-only dependency
composer remove guzzlehttp/guzzle          # uninstall

# Installing / updating
composer install              # install from composer.lock (CI, production)
composer update               # update to newest versions within constraints
composer update guzzlehttp/guzzle  # update single package

# Autoloading
composer dump-autoload         # regenerate autoload files
composer dump-autoload -o      # optimized (classmap, fastest for production)
```

---

## composer.json Structure

```json
{
    "name": "myorg/myapp",
    "description": "A sample PHP application",
    "type": "project",
    "license": "MIT",
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "guzzlehttp/guzzle": "^7.8",
        "nesbot/carbon": "^3.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.5",
        "pestphp/pest": "^2.6",
        "fakerphp/faker": "^1.23",
        "laravel/pint": "^1.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/"
        },
        "classmap": ["database/"],
        "files": ["app/helpers.php"]
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    },
    "scripts": {
        "post-install-cmd": [
            "@php artisan key:generate --ansi"
        ],
        "post-update-cmd": [
            "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
        ],
        "test": "vendor/bin/pest",
        "lint": "vendor/bin/pint"
    },
    "config": {
        "optimize-autoloader": true,
        "preferred-install": "dist",
        "sort-packages": true
    },
    "minimum-stability": "stable",
    "prefer-stable": true
}
```

---

## Semantic Versioning Constraints

Composer uses semver: `MAJOR.MINOR.PATCH`

| Constraint | Meaning | Example |
|-----------|---------|---------|
| `1.2.3` | Exact version | Exactly 1.2.3 |
| `^1.2.3` | Compatible (allows minor/patch) | >=1.2.3, <2.0.0 |
| `~1.2.3` | Approximately (allows patch only) | >=1.2.3, <1.3.0 |
| `>=1.2` | At least | 1.2, 1.3, 2.0 |
| `1.2.*` | Wildcard patch | 1.2.0, 1.2.9 |
| `^8.1` | PHP compat (allows 8.2, 8.3) | >=8.1, <9.0 |

```json
"require": {
    "php": "^8.2",          // PHP 8.2.x, 8.3.x, ... (NOT 9.0)
    "laravel/framework": "^11.0",  // 11.x compatible updates
    "nesbot/carbon": "~3.0.0"     // only 3.0.x patch updates
}
```

---

## PSR-4 Autoloading

PSR-4 maps namespace prefixes to directory paths. Composer generates the classmap:

```json
"autoload": {
    "psr-4": {
        "App\\": "app/",
        "MyLib\\": "src/"
    }
}
```

```
App\Http\Controllers\UserController → app/Http/Controllers/UserController.php
App\Models\User                     → app/Models/User.php
MyLib\Parsers\JsonParser             → src/Parsers/JsonParser.php
```

```php
// After composer dump-autoload, any PSR-4 class is auto-loaded on use:
use App\Models\User;
use App\Http\Controllers\UserController;
// No require/include needed — Composer handles it via vendor/autoload.php

// Entry point: include once at app bootstrap
require __DIR__ . '/vendor/autoload.php';
```

---

## composer.lock

`composer.lock` records the **exact** version of every package (including transitive dependencies):

```bash
# Install uses lock file — guarantees same versions everywhere
composer install     # reads composer.lock, installs exact versions

# Update ignores lock file — resolves fresh and writes new lock
composer update      # reads composer.json constraints, updates packages

# Always commit composer.lock to version control
git add composer.lock
git commit -m "lock dependencies"

# CI/production: always use install (never update)
composer install --no-dev --optimize-autoloader --no-interaction
```

---

## Private Repositories

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/myorg/private-package"
        },
        {
            "type": "path",
            "url": "../my-local-package"
        },
        {
            "type": "composer",
            "url": "https://satis.mycompany.com"
        }
    ]
}
```

---

## Popular Packages

| Package | Purpose | Install |
|---------|---------|---------|
| **nesbot/carbon** | DateTime manipulation | `composer require nesbot/carbon` |
| **guzzlehttp/guzzle** | HTTP client | `composer require guzzlehttp/guzzle` |
| **symfony/console** | CLI apps | `composer require symfony/console` |
| **phpunit/phpunit** | Testing framework | `composer require --dev phpunit/phpunit` |
| **pestphp/pest** | Expressive testing | `composer require --dev pestphp/pest` |
| **fakerphp/faker** | Fake data for tests | `composer require --dev fakerphp/faker` |
| **spatie/laravel-permission** | Roles & permissions | `composer require spatie/laravel-permission` |
| **laravel/pint** | Code style fixer | `composer require --dev laravel/pint` |
| **phpstan/phpstan** | Static analysis | `composer require --dev phpstan/phpstan` |
| **predis/predis** | Redis client | `composer require predis/predis` |

---

## Composer Scripts

```json
"scripts": {
    "test":  ["@clearconfig", "vendor/bin/pest --parallel"],
    "lint":  "vendor/bin/pint",
    "stan":  "vendor/bin/phpstan analyse --level=8 src/",
    "ci":    ["@lint", "@stan", "@test"],
    "clearconfig": "@php artisan config:clear"
}
```

```bash
composer run test      # run tests
composer run ci        # full CI pipeline: lint + static analysis + tests
```

---

## Common Pitfalls

- **Committing `vendor/` to git** — the `vendor/` directory should be in `.gitignore`. It is regenerated by `composer install`. Committing it bloats the repo and causes merge conflicts.
- **Running `composer update` in production** — `composer update` fetches the latest compatible versions, potentially introducing breaking changes. Always use `composer install` (which uses `composer.lock`) in CI/CD and production.
- **`^` version constraint on a `0.x` package** — `^0.3.4` only allows `>=0.3.4 <0.4.0` (NOT `<1.0.0`) because semver treats `0.x` as pre-stable where minor versions can break.
- **Missing `dump-autoload` after adding files** — adding a new class file manually (not via `make:` artisan) requires `composer dump-autoload` before the class can be found. If you use `files:` in autoload for helper functions, this is especially important.

---

## Review Questions

1. What is the difference between `composer install` and `composer update`? Which should you run in a CI pipeline and why?
2. Explain PSR-4 autoloading. How does `"App\\": "app/"` in composer.json relate to `use App\Models\User` in PHP code?
3. What does `^1.2.3` mean in a version constraint? How is it different from `~1.2.3`?
4. A team member adds a new package by manually editing composer.json but doesn't run any composer command. What will happen when other developers run `composer install`?

---

## Sources

- [Composer Documentation](https://getcomposer.org/doc/)
- [Packagist](https://packagist.org/)
- [PSR-4: Autoloader Standard](https://www.php-fig.org/psr/psr-4/)
- [Semantic Versioning](https://semver.org/)

---

#PHP #Laravel
