---
title: PHP Error Handling
aliases:
  - PHP Exceptions
  - PHP Throwable
  - PHP try catch
  - PHP Error Types
tags: [PHP, Laravel, error-handling, exceptions]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - PHP_OOP
  - PHP_Types_and_Variables
  - Laravel_Jobs_Testing_Deployment
status: complete
---

# PHP Error Handling

> [!abstract] TL;DR
> PHP 7+ unified exceptions and fatal errors under the `Throwable` interface, making it possible to catch `Error` objects (like `TypeError`, `ArithmeticError`, `ParseError`) alongside `Exception` objects. PHP 8.x adds multi-catch with `|`, `throw` as an expression, and `never` return type for functions that always throw — bringing PHP error handling close to parity with Java/Python.

---

## The Throwable Hierarchy

```
Throwable (interface — catches everything)
├── Error (engine-level errors — PHP 7+)
│   ├── TypeError          (type mismatch with strict_types)
│   ├── ValueError         (valid type, bad value — e.g. enum::from())
│   ├── ArithmeticError
│   │   └── DivisionByZeroError
│   ├── ParseError         (eval() syntax errors)
│   └── UnhandledMatchError (PHP 8.0 — match with no default)
└── Exception (application-level)
    ├── RuntimeException
    │   ├── OverflowException
    │   ├── UnderflowException
    │   └── OutOfRangeException
    ├── LogicException
    │   ├── InvalidArgumentException
    │   ├── OutOfBoundsException
    │   └── BadMethodCallException
    └── (your custom exceptions)
```

> [!warning] Pre-PHP 7 Note
> Before PHP 7, `Error` instances were fatal errors that could not be caught. Code like `catch (Throwable $e)` was impossible. PHP 7 unified the hierarchy — but catching `Throwable` should still be rare (global handlers only); catch specific types in normal code.

---

## Basic try / catch / finally

```php
<?php declare(strict_types=1);

function divide(float $a, float $b): float {
    if ($b === 0.0) {
        throw new \DivisionByZeroError("Cannot divide by zero");
    }
    return $a / $b;
}

try {
    $result = divide(10.0, 0.0);
} catch (\DivisionByZeroError $e) {
    echo "Math error: " . $e->getMessage();
    echo "\nIn: " . $e->getFile() . ":" . $e->getLine();
} catch (\TypeError $e) {
    echo "Type error: " . $e->getMessage();
} finally {
    // Always executes — even if exception re-thrown, even with return
    echo "\nCleanup complete";
}
```

### Multi-catch (PHP 8.0 refinement of PHP 7.1)

```php
try {
    $this->processPayment($order);
} catch (\RuntimeException | \InvalidArgumentException $e) {
    // Handle both exception types the same way
    $this->logger->warning('Payment failed', ['error' => $e->getMessage()]);
    throw new PaymentException('Could not process payment', previous: $e);
} catch (\Throwable $e) {
    // Catch-all — engine errors, unexpected exceptions
    $this->logger->critical('Unexpected error', ['exception' => $e]);
    throw $e;  // re-throw — don't swallow unknown errors
}
```

---

## Custom Exception Classes

```php
// Base domain exception
class DomainException extends \RuntimeException {}

// Specific exceptions with context
class InsufficientFundsException extends DomainException {
    public function __construct(
        private readonly float $requested,
        private readonly float $available,
        string $message = '',
        int $code = 0,
        ?\Throwable $previous = null,
    ) {
        parent::__construct(
            $message ?: "Insufficient funds: requested {$requested}, available {$available}",
            $code,
            $previous,
        );
    }

    public function getRequested(): float { return $this->requested; }
    public function getAvailable(): float { return $this->available; }
}

// Usage
function withdraw(float $amount): void {
    if ($amount > $this->balance) {
        throw new InsufficientFundsException(
            requested: $amount,
            available: $this->balance,
        );
    }
    $this->balance -= $amount;
}

try {
    $account->withdraw(500.0);
} catch (InsufficientFundsException $e) {
    // Access structured context, not just a message string
    echo "Need {$e->getRequested()}, only {$e->getAvailable()} available";
}
```

---

## Exception Chaining (Previous)

When catching an exception and throwing a new one, always pass the original as `$previous`. This preserves the full stack trace:

```php
function loadConfig(string $path): array {
    try {
        $content = file_get_contents($path);
        if ($content === false) {
            throw new \RuntimeException("Cannot read file: $path");
        }
        return json_decode($content, associative: true, flags: JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
        // Wrap with context, preserve original
        throw new ConfigurationException(
            "Invalid JSON in config file: $path",
            previous: $e,   // named argument (PHP 8.0)
        );
    }
}

// Inspecting the chain
try {
    $config = loadConfig('config.json');
} catch (ConfigurationException $e) {
    echo $e->getMessage();           // "Invalid JSON in config file: config.json"
    echo $e->getPrevious()?->getMessage();  // "Syntax error" (JsonException)
}
```

---

## `throw` as an Expression (PHP 8.0)

Before PHP 8.0, `throw` was a statement. Now it is an expression, enabling inline throws:

```php
// In ternary / null coalescing
$id = $request->get('id') ?? throw new \InvalidArgumentException('id required');

// In arrow functions
$getUser = fn(int $id) => User::find($id) ?? throw new NotFoundException("User $id not found");

// In match arms
$level = match($priority) {
    'high'   => 3,
    'medium' => 2,
    'low'    => 1,
    default  => throw new \ValueError("Unknown priority: $priority"),
};

// In short closures
$validated = array_map(
    fn($v) => is_int($v) ? $v : throw new \TypeError("Expected int"),
    $values
);
```

---

## Error Reporting and Logging

```php
// Error reporting levels (use in development)
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Production: log, don't display
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', '/var/log/php/error.log');

// Custom global exception handler
set_exception_handler(function(\Throwable $e): void {
    // Last resort — catches uncaught exceptions
    http_response_code(500);
    error_log(sprintf(
        "[UNCAUGHT] %s: %s in %s:%d\n%s",
        get_class($e),
        $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
        $e->getTraceAsString(),
    ));

    if (getenv('APP_DEBUG') === 'true') {
        echo "<pre>{$e}</pre>";  // __toString includes trace
    } else {
        echo json_encode(['error' => 'Internal Server Error']);
    }
});

// Custom error handler (converts PHP errors to ErrorException)
set_error_handler(function(int $errno, string $errstr, string $errfile, int $errline): bool {
    if (!(error_reporting() & $errno)) return false;  // respect @-suppression
    throw new \ErrorException($errstr, $errno, $errno, $errfile, $errline);
});
```

---

## Error Handling in Laravel

Laravel centralizes exception handling in `app/Exceptions/Handler.php`:

```php
// app/Exceptions/Handler.php
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Throwable;

class Handler extends ExceptionHandler {
    // Don't report these (e.g., 404s, validation errors)
    protected $dontReport = [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
    ];

    // Render custom JSON for API errors
    public function render($request, Throwable $e): \Symfony\Component\HttpFoundation\Response {
        if ($request->expectsJson()) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'Resource not found'], 404);
            }
        }
        return parent::render($request, $e);
    }
}
```

---

## Common Pitfalls

- **Catching `\Exception` misses `Error`** — `catch (\Exception $e)` will NOT catch `TypeError`, `ArithmeticError`, etc. since `Error` and `Exception` are separate hierarchies under `Throwable`. Use `catch (\Throwable $e)` only as a last resort.
- **Empty catch blocks** — silently swallowing exceptions is the most dangerous pattern in PHP. Always log, re-throw, or return a meaningful value. At minimum: `catch (\Throwable $e) { error_log($e); throw $e; }`.
- **`finally` runs before the exception propagates** — even when an exception is re-thrown, `finally` executes first. If `finally` itself throws, it replaces the original exception (losing the original context).
- **Not setting `$previous` when wrapping** — failing to pass the original exception to the new exception's constructor means the root cause is lost in logs. Always chain with `new WrapperException('msg', previous: $original)`.

---

## Review Questions

1. What is the `Throwable` interface and why does catching `\Exception` not catch everything in PHP 7+?
2. What are the benefits of passing `$previous` when constructing a new exception to wrap another? Where does this information appear in stack traces?
3. How does `throw` as an expression (PHP 8.0) improve code ergonomics? Give two concrete examples where it replaces a full `if` block.
4. What is the difference between `set_error_handler` and `set_exception_handler`? When is each called?

---

## Sources

- [PHP Manual: Exceptions](https://www.php.net/manual/en/language.exceptions.php)
- [PHP 7.0 Throwable RFC](https://wiki.php.net/rfc/throwable-interface)
- [PHP 8.0 throw as expression RFC](https://wiki.php.net/rfc/throw_expression)
- [PHP Manual: Error Handling Functions](https://www.php.net/manual/en/ref.errorfunc.php)

---

#PHP #Laravel
