---
title: PHP Arrays and Strings
aliases:
  - PHP Arrays
  - PHP String Functions
  - PHP array_map
  - PHP Heredoc
tags: [PHP, Laravel, arrays, strings]
domain: PHP
difficulty: Beginner
created: 2026-07-29
related:
  - PHP_Types_and_Variables
  - PHP_Control_Flow_and_Functions
  - PHP_OOP
status: complete
---

# PHP Arrays and Strings

> [!abstract] TL;DR
> PHP arrays are ordered hash maps that serve as both indexed arrays and dictionaries. PHP 8.0 added `str_contains()`, `str_starts_with()`, and `str_ends_with()` replacing verbose `strpos()` checks. Modern PHP favors `array_map`, `array_filter`, `array_reduce` with arrow functions over imperative loops, and `sprintf`/`printf` over string concatenation for formatted output.

---

## Arrays

PHP arrays are ordered maps — they preserve insertion order and can use any scalar as a key:

```php
<?php declare(strict_types=1);

// Indexed array
$colors = ['red', 'green', 'blue'];
$colors[] = 'yellow';          // append
echo $colors[0];               // 'red'
echo count($colors);           // 4

// Associative array (hash map)
$user = [
    'name'  => 'Alice',
    'age'   => 30,
    'email' => 'alice@example.com',
];
echo $user['name'];            // 'Alice'
$user['role'] = 'admin';       // add/overwrite

// Checking existence
isset($user['email']);         // true (also false for null values)
array_key_exists('email', $user);  // true (works for null values)
in_array('Alice', $user);     // true (value search, O(n))
in_array('Alice', $user, strict: true); // strict type check

// Nested / multidimensional
$matrix = [[1, 2], [3, 4], [5, 6]];
echo $matrix[1][0];            // 3
```

---

## Array Functions — Functional Style

### Transformation

```php
$numbers = [1, 2, 3, 4, 5];

// array_map — transform each element, returns new array
$squared = array_map(fn($n) => $n ** 2, $numbers);
// → [1, 4, 9, 16, 25]

// array_map with multiple arrays
$sums = array_map(fn($a, $b) => $a + $b, [1, 2, 3], [10, 20, 30]);
// → [11, 22, 33]

// array_filter — keep elements where callback returns true
$even = array_filter($numbers, fn($n) => $n % 2 === 0);
// → [1 => 2, 3 => 4]  NOTE: preserves original keys!
$even = array_values(array_filter($numbers, fn($n) => $n % 2 === 0));
// → [0 => 2, 1 => 4]  — re-index with array_values

// array_reduce — fold array to a single value
$product = array_reduce($numbers, fn($carry, $item) => $carry * $item, initial: 1);
// → 120
```

### Sorting

```php
$items = ['banana', 'apple', 'cherry'];

sort($items);           // sort in place, re-index — ['apple', 'banana', 'cherry']
rsort($items);          // reverse sort in place
asort($items);          // sort values, preserve keys
arsort($items);         // reverse sort values, preserve keys
ksort($items);          // sort by keys
krsort($items);         // reverse sort by keys

// Custom sort with usort
$users = [
    ['name' => 'Charlie', 'age' => 25],
    ['name' => 'Alice',   'age' => 30],
    ['name' => 'Bob',     'age' => 25],
];

usort($users, fn($a, $b) => $a['age'] <=> $b['age'] ?: strcmp($a['name'], $b['name']));
// Sort by age ASC, then name ASC (spaceship operator <=>)
```

### Manipulation

```php
// Merge and combine
$merged = array_merge([1, 2], [3, 4]);          // [1, 2, 3, 4]
$spread = [...[1, 2], ...[3, 4]];               // [1, 2, 3, 4] — spread syntax
$combined = array_combine(['a', 'b'], [1, 2]);  // ['a' => 1, 'b' => 2]

// Slicing
$slice = array_slice([10, 20, 30, 40, 50], offset: 1, length: 3);
// → [20, 30, 40]

// Uniqueness
$unique = array_unique([1, 2, 2, 3, 3, 3]);  // [0 => 1, 1 => 2, 3 => 3]

// Keys / values
$keys   = array_keys($user);      // ['name', 'age', 'email']
$values = array_values($user);    // ['Alice', 30, 'alice@example.com']

// Flip keys ↔ values
$flipped = array_flip(['a' => 1, 'b' => 2]);  // [1 => 'a', 2 => 'b']

// Column extraction (great for collections of rows)
$names = array_column($users, 'name');          // ['Alice', 'Bob', ...]
$byId  = array_column($users, null, 'id');      // re-key by 'id' field

// Searching
$pos = array_search('Alice', $names);           // key of first match (or false)
```

---

## String Functions

### PHP 8.0 Containment Functions

```php
$email = 'alice@example.com';

// Old way (pre-8.0) — confusing !== false
if (strpos($email, '@') !== false) { ... }

// PHP 8.0 — clear, readable
str_contains($email, '@');           // true
str_starts_with($email, 'alice');    // true
str_ends_with($email, '.com');       // true
```

### Common String Operations

```php
$str = "  Hello, World!  ";

// Trimming
trim($str);               // "Hello, World!"
ltrim($str);              // "Hello, World!  "
rtrim($str);              // "  Hello, World!"

// Case
strtolower($str);         // "  hello, world!  "
strtoupper($str);         // "  HELLO, WORLD!  "
ucfirst('hello');         // "Hello"
ucwords('hello world');   // "Hello World"

// Length and position
strlen($str);             // 18 (byte length, not char count)
mb_strlen($str);          // multibyte-safe length
strpos($str, 'World');    // 9 (or false)
strrpos($str, 'l');       // 14 (last occurrence)

// Replacement
str_replace('World', 'PHP', $str);  // "  Hello, PHP!  "
str_ireplace('HELLO', 'Hi', $str);  // case-insensitive replace
preg_replace('/\s+/', ' ', $str);   // regex replace — "Hello, World!"

// Split / join
$parts = explode(',', 'a,b,c,d');   // ['a', 'b', 'c', 'd']
$joined = implode(' | ', $parts);   // "a | b | c | d"

// Padding / repetition
str_pad('42', 5, '0', STR_PAD_LEFT);  // "00042"
str_repeat('-', 10);                   // "----------"

// Substring
substr($str, 2, 5);       // "Hello"
```

### Formatting

```php
// sprintf — formatted string (like printf in C)
$formatted = sprintf("Name: %s, Age: %d, Score: %.2f", 'Alice', 30, 95.678);
// → "Name: Alice, Age: 30, Score: 95.68"

// printf — prints formatted string directly
printf("%-20s %5d\n", 'Alice', 100);

// number_format
number_format(1234567.891, 2, '.', ',');  // "1,234,567.89"

// date formatting
date('Y-m-d H:i:s');                    // "2026-07-29 14:30:00"
```

### Regex

```php
// preg_match — match first occurrence
if (preg_match('/^[a-z0-9.]+@[a-z0-9.]+\.[a-z]{2,}$/i', $email, $matches)) {
    echo "Valid email: " . $matches[0];
}

// preg_match_all — all occurrences
$count = preg_match_all('/\d+/', 'Phone: 123-456-7890', $matches);
// $matches[0] = ['123', '456', '7890'], $count = 3

// preg_replace
$slug = preg_replace('/[^a-z0-9-]/', '', strtolower(str_replace(' ', '-', $title)));

// Named capture groups
preg_match('/(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})/', '2026-07-29', $m);
echo $m['year'];   // '2026'
echo $m['month'];  // '07'
```

---

## Heredoc and Nowdoc

```php
$name = "Alice";

// Heredoc — variable interpolation (like double-quoted string)
$html = <<<HTML
    <div class="user">
        <h1>Hello, {$name}!</h1>
        <p>Welcome back.</p>
    </div>
    HTML;  // closing marker must have no indentation delta (PHP 7.3+ allows indented)

// Nowdoc — no interpolation (like single-quoted string)
$template = <<<'SQL'
    SELECT * FROM users WHERE name = '$name'
    SQL;
// → literal string: "SELECT * FROM users WHERE name = '$name'"
```

---

## Common Pitfalls

- **`array_filter` preserves keys** — `array_filter([0 => 1, 1 => false, 2 => 3])` returns `[0 => 1, 2 => 3]` (key 1 missing). If you need a re-indexed array, wrap with `array_values()`.
- **`strlen()` is byte-count, not character-count** — for UTF-8 strings with multi-byte characters (e.g., Chinese, emoji), `strlen("中")` returns `3` (bytes), not `1`. Use `mb_strlen()`, `mb_substr()`, `mb_strtolower()` for multibyte-safe operations.
- **`sort()` / `usort()` modify in place and return `bool`** — `$sorted = sort($arr)` assigns `true` to `$sorted`, not the sorted array. Sort is in-place; the sorted data is in `$arr`.
- **Loose `in_array` without `strict: true`** — `in_array(0, ['foo', 'bar'])` returns `true` because `"foo" == 0` in loose comparison. Always pass `strict: true` as the third argument.

---

## Review Questions

1. What is the difference between `array_map` and `array_walk`? When does `array_filter` require `array_values` afterward?
2. Why is `str_contains($str, 'needle')` preferred over `strpos($str, 'needle') !== false`?
3. A developer runs `$sorted = rsort($items)` expecting the sorted array. What value is actually in `$sorted`?
4. When processing a string with Japanese characters, why might `substr($str, 0, 3)` produce garbled output?

---

## Sources

- [PHP Manual: Arrays](https://www.php.net/manual/en/language.types.array.php)
- [PHP Manual: Array Functions](https://www.php.net/manual/en/ref.array.php)
- [PHP Manual: String Functions](https://www.php.net/manual/en/ref.strings.php)
- [PHP 8.0 str_contains RFC](https://wiki.php.net/rfc/str_contains)

---

#PHP #Laravel
