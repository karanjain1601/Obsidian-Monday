---
title: PHP Types and Variables
aliases:
  - PHP Type System
  - PHP Strict Types
  - PHP Union Types
  - PHP Type Declarations
tags: [PHP, Laravel, types, variables]
domain: PHP
difficulty: Beginner
created: 2026-07-29
related:
  - PHP_Overview
  - PHP_Control_Flow_and_Functions
  - PHP_OOP
status: complete
---

# PHP Types and Variables

> [!abstract] TL;DR
> PHP's type system evolved from a completely dynamic language into a gradual typing system in PHP 7-8. Variables are declared with `$` prefix, types are enforced with `declare(strict_types=1)`, and PHP 8.x adds union types (`string|int`), intersection types, `mixed`, `never`, `readonly` properties, and enums — closing the gap with statically typed languages while preserving backward compatibility.

---

## Variable Declaration

PHP variables begin with `$`. They are dynamically scoped (no block scope outside functions):

```php
<?php
$name = "Alice";        // string
$age  = 30;             // int
$pi   = 3.14;           // float
$active = true;         // bool
$nothing = null;        // null

// Variable variables (avoid in production)
$varName = 'greeting';
$$varName = 'Hello';    // creates $greeting = 'Hello'

// Constants (no $ prefix, immutable)
define('MAX_RETRIES', 3);           // runtime constant
const DB_HOST = 'localhost';        // compile-time constant (preferred in classes)
```

---

## Scalar Types

| Type | Values | Example |
|------|--------|---------|
| `int` | Integers, any size | `42`, `-7`, `0xFF`, `0b1010`, `1_000_000` |
| `float` | IEEE 754 double | `3.14`, `1.5e3`, `INF`, `NAN` |
| `string` | UTF-8 byte sequence | `"hello"`, `'world'` |
| `bool` | `true` / `false` | `true`, `false` |
| `null` | Absence of value | `null` |

**Integer literals in PHP 8.x:**
```php
$dec  = 1_000_000;    // underscore separators (8.1+)
$hex  = 0xFF;
$oct  = 0o777;        // 0o prefix for octal (PHP 8.1)
$bin  = 0b11110000;
```

---

## Type Juggling and Comparison

PHP historically performs automatic type coercion — one of its most error-prone features:

```php
// Loose comparison (==) — type coercion happens
var_dump(0 == "foo");    // true in PHP 7, FALSE in PHP 8 (breaking change!)
var_dump(0 == "");       // false in PHP 8 (was true in PHP 7)
var_dump("1" == "01");   // true (both coerce to int 1)
var_dump(100 == "1e2");  // true (scientific notation coercion)
var_dump(null == false); // true
var_dump(null == 0);     // true

// Strict comparison (===) — type AND value must match
var_dump(0 === "0");     // false — int vs string
var_dump(1 === true);    // false — int vs bool
var_dump(null === false); // false
```

> [!warning] PHP 8.0 Comparison Breaking Change
> In PHP 7, `0 == "foo"` was `true` because `"foo"` coerced to `0`. PHP 8.0 changed non-numeric strings to not equal `0` under loose comparison. This broke many legacy codebases using loose equality for empty/missing checks.

---

## Strict Types Mode

```php
<?php
declare(strict_types=1);  // MUST be first statement in file

function add(int $a, int $b): int {
    return $a + $b;
}

add(1, 2);       // OK
add(1.5, 2);     // TypeError — float not accepted, no coercion
add("1", 2);     // TypeError — string not accepted
```

Without `declare(strict_types=1)`, PHP coerces `"1"` → `1` and `1.5` → `1` silently. **Always use strict types in new code.**

---

## Type Declarations in Functions

### Return Types and Nullable Types

```php
<?php declare(strict_types=1);

// Return type declaration
function getAge(): int { return 30; }

// Nullable type — allows null OR the type
function findUser(int $id): ?User {
    return User::find($id) ?: null;
}

// void return (PHP 7.1+)
function logMessage(string $msg): void {
    error_log($msg);
    // cannot return a value
}

// never return (PHP 8.1) — function always throws or exits
function abort(int $code): never {
    http_response_code($code);
    exit();
}
```

### Union Types (PHP 8.0)

```php
// Accept string OR int
function setId(string|int $id): void {
    $this->id = (string) $id;
}

// Return int OR false (common legacy pattern now typed)
function findIndex(array $arr, mixed $value): int|false {
    return array_search($value, $arr);
}

// PHP 8.2: true/false/null as standalone types
function isFeatureEnabled(string $flag): true|false { ... }
```

### Intersection Types (PHP 8.1)

```php
// Parameter must implement BOTH interfaces
function process(Countable&Iterator $collection): void {
    foreach ($collection as $item) { ... }
}
```

---

## Special Types

```php
// mixed — accepts any type (opt-out of type checking for that param)
function debug(mixed $value): void {
    var_dump($value);
}

// PHP 8.2: standalone null, true, false
function alwaysFails(): false {
    return false;
}

// Typed properties (PHP 7.4+)
class User {
    public string $name;
    public int $age = 0;         // default value
    public ?string $email = null; // nullable with null default
    public readonly string $id;  // readonly: set once, then immutable (8.1)
}
```

---

## Readonly Properties (PHP 8.1)

```php
class Product {
    public function __construct(
        public readonly string $sku,    // set at construction, immutable after
        public readonly float $price,
    ) {}
}

$p = new Product(sku: 'ABC-123', price: 29.99);
echo $p->sku;     // 'ABC-123'
$p->sku = 'XYZ';  // Error: Cannot modify readonly property
```

**Readonly classes (PHP 8.2)** — all properties are implicitly readonly:
```php
readonly class Money {
    public function __construct(
        public int $amount,
        public string $currency,
    ) {}
}
```

---

## Type Casting

```php
$val = "42abc";
(int) $val;      // 42 (stops at first non-numeric char)
(float) $val;    // 42.0
(string) 42;     // "42"
(bool) "";       // false
(bool) "0";      // false (special case!)
(bool) "false";  // true (non-empty non-"0" string)
(array) $val;    // ["42abc"]
(object) ['a'=>1]; // stdClass {a: 1}

// Safe integer parsing
$parsed = filter_var($val, FILTER_VALIDATE_INT);
// $parsed === false if not a pure integer
```

---

## Common Pitfalls

- **`(bool) "false"` is `true`** — PHP treats any non-empty string except `"0"` as truthy. Use `$val === 'false'` or `filter_var($val, FILTER_VALIDATE_BOOLEAN)` for string→bool conversions.
- **Forgetting `declare(strict_types=1)` is per-file** — it only affects the file it's declared in, not files it includes. Each file must declare it independently.
- **Typed property without default throws on read** — accessing a typed property before initialization throws `Error: Typed property must not be accessed before initialization`. Always initialize in `__construct()`.
- **Union type with `null` vs nullable shorthand** — `string|null` and `?string` are equivalent, but `?string|int` is a syntax error. Use `string|int|null` for nullable unions.

---

## Review Questions

1. What does `declare(strict_types=1)` change about how PHP handles function call type mismatches? Does it affect comparisons?
2. Explain why `(bool) "false"` returns `true` and how you would correctly convert the string `"false"` to a boolean `false`.
3. What is the difference between `?string` (nullable type) and `mixed`? When would you use each?
4. A PHP 7 codebase has `if ($result == 0)` where `$result` could be `false` or `0`. What happens when migrated to PHP 8.0 and why?

---

## Sources

- [PHP Manual: Types](https://www.php.net/manual/en/language.types.php)
- [PHP 8.0 Union Types RFC](https://wiki.php.net/rfc/union_types_v2)
- [PHP 8.1 Readonly Properties RFC](https://wiki.php.net/rfc/readonly_properties_v2)
- [PHP 8.2 Readonly Classes RFC](https://wiki.php.net/rfc/readonly_classes)

---

#PHP #Laravel
