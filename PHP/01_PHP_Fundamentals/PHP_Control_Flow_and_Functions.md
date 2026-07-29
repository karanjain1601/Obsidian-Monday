---
title: PHP Control Flow and Functions
aliases:
  - PHP Functions
  - PHP Arrow Functions
  - PHP Named Arguments
  - PHP Match Expression
tags: [PHP, Laravel, control-flow, functions]
domain: PHP
difficulty: Beginner
created: 2026-07-29
related:
  - PHP_Types_and_Variables
  - PHP_OOP
  - PHP_Arrays_and_String
status: complete
---

# PHP Control Flow and Functions

> [!abstract] TL;DR
> PHP 8.x modernized control flow with a strict `match` expression (no fallthrough, returns a value), null coalescing `??` and nullsafe `?->` operators for safe navigation, first-class callable syntax `strlen(...)`, and concise arrow functions `fn($x) => $x * 2` — replacing verbose closures for single-expression callbacks.

---

## Conditionals

### if / elseif / else

```php
<?php declare(strict_types=1);

$age = 20;

if ($age >= 18) {
    echo "Adult";
} elseif ($age >= 13) {
    echo "Teen";
} else {
    echo "Child";
}

// Ternary
$label = $age >= 18 ? "Adult" : "Minor";

// Null coalescing (??) — returns left if not null, right otherwise
$username = $_GET['user'] ?? 'Guest';
$config   = $settings['timeout'] ?? $defaults['timeout'] ?? 30;

// Null coalescing assignment (??=)
$data['hits'] ??= 0;    // assign only if null/missing
$data['hits']++;
```

### match Expression (PHP 8.0)

`match` is stricter, cleaner, and more powerful than `switch`:

```php
// match: strict comparison (===), no fallthrough, returns a value
$statusCode = 404;
$message = match($statusCode) {
    200, 201 => 'Success',
    301, 302 => 'Redirect',
    404      => 'Not Found',
    500      => 'Server Error',
    default  => "Unknown: $statusCode",
};

// match with no-match throws UnhandledMatchError (unlike switch's silent fall)
$role = 'guest';
$permissions = match($role) {
    'admin'  => ['read', 'write', 'delete'],
    'editor' => ['read', 'write'],
    'viewer' => ['read'],
    // No default: throws UnhandledMatchError if $role is unrecognized
};

// match on true — acts as if/elseif chain but as expression
$bmi = 22.5;
$category = match(true) {
    $bmi < 18.5 => 'Underweight',
    $bmi < 25.0 => 'Normal',
    $bmi < 30.0 => 'Overweight',
    default     => 'Obese',
};
```

---

## Loops

```php
// for
for ($i = 0; $i < 10; $i++) {
    echo $i;
}

// foreach — the most common PHP loop
$users = ['Alice', 'Bob', 'Charlie'];
foreach ($users as $index => $name) {
    echo "$index: $name\n";
}

// foreach with reference (modify in place)
foreach ($prices as &$price) {
    $price *= 1.1;  // 10% increase
}
unset($price);  // IMPORTANT: unset reference after loop

// while / do-while
$count = 0;
while ($count < 5) { $count++; }

do {
    $input = readline("Enter > ");
} while ($input !== 'quit');
```

---

## Functions

### Basic Declaration

```php
// Type declarations (strict_types=1 enforces them)
function divide(float $a, float $b): float {
    if ($b === 0.0) {
        throw new DivisionByZeroError("Cannot divide by zero");
    }
    return $a / $b;
}

// Default parameters (must come after required params)
function createSlug(string $title, string $separator = '-'): string {
    return strtolower(str_replace(' ', $separator, $title));
}
```

### Named Arguments (PHP 8.0)

```php
function makeTag(string $tag, string $content, string $class = ''): string {
    $classAttr = $class ? " class=\"$class\"" : '';
    return "<$tag$classAttr>$content</$tag>";
}

// Call with named args — order-independent, skip optionals
makeTag(content: 'Hello', tag: 'h1');
makeTag(tag: 'p', content: 'Body', class: 'lead');

// Named args with built-in functions
$result = array_slice(array: [1,2,3,4,5], offset: 1, length: 3);
// → [2, 3, 4]
```

### Variadic Functions

```php
// ...$args collects remaining arguments into an array
function sum(int ...$numbers): int {
    return array_sum($numbers);
}
sum(1, 2, 3, 4);    // 10

// Mixed required + variadic
function log(string $level, string ...$messages): void {
    foreach ($messages as $msg) {
        error_log("[$level] $msg");
    }
}
log('ERROR', 'DB connection failed', 'Retry 1/3');

// Spread operator — unpack array into function arguments
$args = [3, 4];
sum(...$args);      // same as sum(3, 4)

// Named spread (PHP 8.1)
$options = ['separator' => '_'];
createSlug('Hello World', ...$options);
```

---

## Anonymous Functions and Closures

```php
// Anonymous function (closure) — captures variables with 'use'
$multiplier = 3;
$triple = function(int $n) use ($multiplier): int {
    return $n * $multiplier;
};
echo $triple(7);  // 21

// Capture by reference
$total = 0;
$addToTotal = function(int $n) use (&$total): void {
    $total += $n;
};
array_walk([1, 2, 3], $addToTotal);
echo $total;  // 6

// Closures as callbacks
$numbers = [3, 1, 4, 1, 5, 9];
usort($numbers, function($a, $b) { return $a <=> $b; });
```

### Arrow Functions (PHP 7.4)

Arrow functions (`fn`) are single-expression closures that **automatically capture** outer variables by value — no `use` keyword needed:

```php
$multiplier = 5;

// Arrow function — implicit capture, single expression
$multiply = fn(int $n): int => $n * $multiplier;
echo $multiply(4);  // 20

// Perfect for array callbacks
$prices = [10.0, 25.5, 7.99];
$withTax = array_map(fn($p) => $p * 1.1, $prices);

$expensive = array_filter($prices, fn($p) => $p > 10.0);

// Nested arrow functions chain captures correctly
$addN = fn($n) => fn($x) => $x + $n;
$addFive = $addN(5);
echo $addFive(3);  // 8
```

---

## First-Class Callable Syntax (PHP 8.1)

Before PHP 8.1, passing a named function as a callback required string names or `Closure::fromCallable()`. PHP 8.1 adds `...` syntax to get a `Closure` from any callable:

```php
// Old (PHP 8.0 and earlier)
$fn = Closure::fromCallable('strlen');
$fn = 'strlen';    // string callable — no type safety, no IDE support

// PHP 8.1: first-class callable — returns a typed Closure
$fn = strlen(...);
$fn('hello');     // 5

// Works on methods too
$arr = new ArrayObject([3, 1, 4]);
$count = $arr->count(...);   // Closure bound to $arr

// Practical: pass built-in functions as callbacks
$lengths = array_map(strlen(...), ['foo', 'hello', 'x']);
// → [3, 5, 1]

// With static methods
$users = array_filter($users, User::isActive(...));
```

---

## Null Coalescing and Nullsafe

```php
// ?? — null coalescing (returns left if not null, else right)
$port = $_ENV['PORT'] ?? 8080;

// ??= — null coalescing assignment
$cache['key'] ??= computeExpensive();

// ?-> — nullsafe method/property chain (PHP 8.0)
// Returns null if any link in the chain is null (no exception)
$countryCode = $order?->getCustomer()?->getAddress()?->getCountry()?->getCode();

// Combining ?? and ?->
$city = $user?->getAddress()?->city ?? 'Unknown';
```

---

## Spread Operator

```php
// Unpack array into function call
function add3(int $a, int $b, int $c): int { return $a + $b + $c; }
$nums = [1, 2, 3];
echo add3(...$nums);   // 6

// Merge arrays (PHP 8.1 supports string keys in spread)
$defaults = ['color' => 'red', 'size' => 'M'];
$custom   = ['size' => 'L', 'weight' => 100];
$merged   = [...$defaults, ...$custom];
// → ['color' => 'red', 'size' => 'L', 'weight' => 100]
```

---

## Common Pitfalls

- **Forgetting `unset()` after `foreach` by reference** — the reference variable `$price` from `foreach ($prices as &$price)` remains live after the loop. The next use of `$price` as a variable name will modify the last element of the array. Always `unset($price)` immediately after.
- **`match` throws on no match, `switch` silently falls through** — if you omit `default` from a `match`, an `UnhandledMatchError` is thrown for unmatched values. This is intentional but surprising if migrating from `switch`.
- **Arrow functions do not modify captured variables** — `fn` captures by value only. If you need to mutate an outer variable, use a regular closure with `use (&$var)`.
- **Variadic parameter must be last** — `function foo(int ...$nums, string $sep)` is a syntax error. Variadic must be the final parameter.

---

## Review Questions

1. How does `match` differ from `switch` in terms of comparison type, fallthrough behavior, and what happens when no arm matches?
2. What is the difference between an arrow function (`fn`) and a regular closure regarding outer variable capture?
3. Explain first-class callable syntax. What does `strlen(...)` return and why is it better than passing `'strlen'` as a string?
4. Why must you `unset($ref)` after a `foreach ($array as &$ref)` loop?

---

## Sources

- [PHP Manual: Functions](https://www.php.net/manual/en/language.functions.php)
- [PHP 8.0 match RFC](https://wiki.php.net/rfc/match_expression_v2)
- [PHP 8.1 First-class callable syntax RFC](https://wiki.php.net/rfc/first_class_callable_syntax)
- [PHP 7.4 Arrow Functions RFC](https://wiki.php.net/rfc/arrow_functions_v2)

---

#PHP #Laravel
