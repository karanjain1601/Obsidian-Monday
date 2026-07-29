---
title: Python Exception Handling
aliases: [Python Exceptions, Python Error Handling, Python Try Except, Custom Exceptions, Exception Hierarchy]
tags: [Python, Exceptions, ErrorHandling, TryExcept]
domain: Python
difficulty: Beginner
created: 2026-07-29
related: [Python_OOP, Context_Managers, Python_Internals, Python_Logging_and_Observability]
status: complete
---

# Python Exception Handling

> [!abstract] TL;DR
> Python exceptions are objects in a class hierarchy rooted at `BaseException`. The `try/except/else/finally` block handles them; `raise` propagates them; `with` uses the context manager protocol to guarantee cleanup. Custom exceptions extend `Exception` and carry structured diagnostic data.

---

## The Exception Hierarchy

```
BaseException
├── SystemExit              ← sys.exit() — don't catch unless re-raising
├── KeyboardInterrupt       ← Ctrl+C — don't catch unless re-raising
├── GeneratorExit           ← generator.close() — don't catch
└── Exception               ← catch everything else here
    ├── ArithmeticError
    │   ├── ZeroDivisionError
    │   └── OverflowError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── ValueError
    ├── TypeError
    ├── AttributeError
    ├── OSError (IOError, FileNotFoundError, PermissionError, …)
    ├── RuntimeError
    │   └── RecursionError
    ├── StopIteration
    └── ImportError
        └── ModuleNotFoundError
```

**Rule**: always catch `Exception` or a specific subclass — never catch `BaseException` unless you're writing a top-level framework.

---

## Full try/except/else/finally Syntax

```python
try:
    result = risky_operation()          # code that might fail
except ValueError as e:                 # specific exception first
    print(f"Bad value: {e}")
except (TypeError, KeyError) as e:      # catch multiple in a tuple
    print(f"Type or key error: {e}")
except Exception as e:                  # broad catch-all last
    log.error("Unexpected: %s", e)
    raise                               # always re-raise if you don't handle
else:
    process(result)                     # runs only if NO exception was raised
finally:
    cleanup()                           # ALWAYS runs — exception or not
```

**`else` clause** is the overlooked gem: code that should run on success, but not in the `except` handler. Keeps the "happy path" visually distinct.

---

## raise, raise from, and Chaining

```python
# Re-raise the current exception unchanged
try:
    load_config()
except FileNotFoundError:
    log.error("Config missing")
    raise   # preserves original traceback

# Raise a different exception — chains implicitly
try:
    rows = db.query(sql)
except Exception as e:
    raise RuntimeError("DB query failed") from e  # __cause__ set

# Suppress the original (use sparingly)
raise RuntimeError("failed") from None  # __cause__ = None
```

---

## Custom Exceptions

```python
class AppError(Exception):
    """Base class for all application errors."""

class ValidationError(AppError):
    def __init__(self, field: str, message: str) -> None:
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class NotFoundError(AppError):
    def __init__(self, resource: str, id: int) -> None:
        self.resource = resource
        self.id = id
        super().__init__(f"{resource} with id={id} not found")

# Usage
try:
    raise ValidationError("email", "invalid format")
except ValidationError as e:
    print(e.field, e.message)   # structured access
```

**Design rules for custom exceptions:**
1. Inherit from `Exception` (or a project-level base).
2. Store structured data as attributes — don't just stringify everything.
3. Call `super().__init__(message)` so `str(exc)` works.
4. Create a hierarchy mirroring your domain (one base per subsystem).

---

## Context Managers for Guaranteed Cleanup

```python
# Built-in — handles close() automatically
with open("data.txt") as f:
    data = f.read()
# file is closed here even if an exception occurred

# Custom context manager using __enter__/__exit__
class Timer:
    def __enter__(self):
        import time
        self._start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.perf_counter() - self._start
        return False  # False = don't suppress exceptions

with Timer() as t:
    expensive_computation()
print(f"Took {t.elapsed:.3f}s")

# Using contextlib.contextmanager decorator
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
```

---

## Exception Groups (Python 3.11+)

```python
# Raise multiple independent exceptions at once
raise ExceptionGroup("multiple failures", [
    ValueError("bad input"),
    TypeError("wrong type"),
])

# Handle with except*
try:
    risky()
except* ValueError as eg:
    for e in eg.exceptions:
        handle_value_error(e)
except* TypeError as eg:
    for e in eg.exceptions:
        handle_type_error(e)
```

---

## Common Pitfalls

1. **Catching `Exception` and ignoring** — `except Exception: pass` silently swallows bugs. At minimum, log the exception.
2. **Catching `BaseException`** — catches `KeyboardInterrupt` and `SystemExit`, preventing the user from stopping the program.
3. **Re-raising with `raise e`** — this resets the traceback to the current line. Use bare `raise` to preserve the original traceback.
4. **Using exceptions for flow control** — EAFP ("easier to ask forgiveness") is Pythonic, but don't use exceptions as a substitute for normal `if` checks in tight loops (exceptions are slow).
5. **Not chaining with `from`** — `raise NewError() from e` preserves the original cause; omitting `from e` gives an implicit chain (less clear), and `from None` hides it entirely.

---

## Best Practices

| Pattern | Example |
|---------|---------|
| Specific before broad | `except ValueError` before `except Exception` |
| Structured custom exceptions | Store data as attributes, not just in message |
| Always log before swallowing | `log.exception("Failed")` then `pass` |
| Use `else` for happy-path code | Runs only if `try` succeeded |
| `finally` for resources | Or better: use `with` statement |
| `raise ... from e` | Preserve exception chain for debugging |

---

## Related Concepts

- [[Context_Managers]] — `__enter__`/`__exit__` protocol in depth
- [[Python_OOP]] — How custom exception classes are defined
- [[Python_Logging_and_Observability]] — Logging exceptions properly
- [[Python_Internals]] — CPython exception implementation

---

## Review Questions

1. **What is the difference between the `else` and `finally` clauses in a `try` block?**
   *Answer: `else` runs only when no exception was raised in `try`; `finally` runs unconditionally (exception or not, return or not). Use `else` for success-path code, `finally` for guaranteed cleanup.*

2. **Why should custom exceptions call `super().__init__(message)`?**
   *Answer: It stores the message string in `args[0]`, so `str(exc)`, `repr(exc)`, and logging all display the message. Without it, `str(exc)` returns an empty string.*

3. **What is exception chaining and when does `raise X from None` make sense?**
   *Answer: Chaining (`raise X from Y`) sets `__cause__` so the traceback shows both exceptions. `from None` suppresses the chain, appropriate only when the original exception leaks internal details you want to hide from callers (e.g., at an API boundary).*

#Python #Exceptions #ErrorHandling #TryExcept
