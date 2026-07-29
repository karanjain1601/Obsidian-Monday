---
title: Rust Error Handling
aliases: [Rust Result, Rust question mark operator, thiserror, anyhow, Custom Errors]
tags: [Rust, error-handling, Result, thiserror, anyhow, question-mark]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Enums_and_Pattern_Matching]]"
  - "[[Traits_and_Generics]]"
  - "[[Smart_Pointers]]"
  - "[[Rust_Web_Ecosystem]]"
status: complete
---

# Rust Error Handling

> [!abstract] TL;DR
> Rust has no exceptions. Errors are values — functions that can fail return `Result<T, E>`. The `?` operator propagates errors automatically (early return on `Err`). `thiserror` derives clean error types for libraries; `anyhow` provides ergonomic boxed errors for applications. `panic!` is for unrecoverable bugs, not for expected failures. The type system makes it impossible to ignore errors silently.

---

## Intuition

In languages with exceptions, an error can "fly" invisibly through the call stack and crash anywhere. In Rust, errors are explicit values in the return type — if a function can fail, the signature says so with `Result<T, E>`. The caller **must** handle both `Ok(value)` and `Err(error)`. There is no way to accidentally ignore an error — the compiler will warn you if you do.

The `?` operator is syntactic sugar that makes this ergonomic: `let data = file.read_to_string()?` reads data if successful, or returns the error immediately if it failed. No pyramid of `match` arms.

---

## Result<T, E> — Exhaustive Error Handling

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file_contents(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;  // ? returns Err early if file doesn't exist
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;  // ? returns Err early if read fails
    Ok(contents)
}

fn main() {
    match read_file_contents("config.txt") {
        Ok(contents) => println!("{contents}"),
        Err(e)       => eprintln!("Error: {e}"),
    }
}
```

### The ? Operator — Explicit Desugaring

```rust
// ? is sugar for this match:
let file = match File::open(path) {
    Ok(f)  => f,
    Err(e) => return Err(e.into()),  // .into() converts error type if needed
};

// Equivalent with ?:
let file = File::open(path)?;
```

`?` also works with `Option<T>` — returns `None` early from functions that return `Option`:
```rust
fn first_even(v: &[i32]) -> Option<i32> {
    let first = v.first()?;  // returns None if vec is empty
    if first % 2 == 0 { Some(*first) } else { None }
}
```

---

## From Trait — Automatic Error Conversion

`?` uses `From::from(err)` to convert between error types. If your function returns `Result<T, MyError>` and calls something that returns `io::Error`, define `impl From<io::Error> for MyError`:

```rust
#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Parse(std::num::ParseIntError),
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self {
        AppError::Io(e)
    }
}

impl From<std::num::ParseIntError> for AppError {
    fn from(e: std::num::ParseIntError) -> Self {
        AppError::Parse(e)
    }
}

fn read_and_parse(path: &str) -> Result<i32, AppError> {
    let contents = std::fs::read_to_string(path)?;  // io::Error → AppError via From
    let n: i32 = contents.trim().parse()?;           // ParseIntError → AppError via From
    Ok(n * 2)
}
```

---

## thiserror — Library Error Types

`thiserror` is the standard choice for defining error types in libraries. It derives the boilerplate `Display`, `Error`, and `From` implementations.

```toml
# Cargo.toml
[dependencies]
thiserror = "1.0"
```

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DatabaseError {
    #[error("connection failed: {0}")]
    Connection(String),

    #[error("query failed: {query} — {source}")]
    Query {
        query: String,
        #[source]  // marks this as the underlying cause — enables .source()
        source: sqlx::Error,
    },

    #[error("record not found: id={0}")]
    NotFound(u64),

    #[error(transparent)]  // delegates Display and source to the wrapped error
    Io(#[from] std::io::Error),
}

// Usage — From is auto-derived for Io variant:
fn read_config(path: &str) -> Result<Config, DatabaseError> {
    let content = std::fs::read_to_string(path)?;  // io::Error auto-converts to DatabaseError::Io
    // ...
    Ok(Config::default())
}
```

---

## anyhow — Application Error Handling

`anyhow` is for application code (not libraries) where you want easy error propagation without defining your own error types. It provides a type-erased `anyhow::Error` that can hold any error.

```toml
[dependencies]
anyhow = "1.0"
```

```rust
use anyhow::{anyhow, bail, Context, Result};

// anyhow::Result<T> is shorthand for Result<T, anyhow::Error>
fn process_file(path: &str) -> Result<String> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read {path}"))?;  // adds context to the error

    if content.is_empty() {
        bail!("file {path} is empty");  // bail! = return Err(anyhow!(...))
    }

    let n: i32 = content.trim().parse()
        .context("expected a number in the file")?;

    if n < 0 {
        return Err(anyhow!("number must be positive, got {n}"));
    }

    Ok(format!("result: {}", n * 2))
}

fn main() -> Result<()> {
    let result = process_file("input.txt")?;
    println!("{result}");
    Ok(())
}
```

### thiserror vs anyhow

| Aspect | `thiserror` | `anyhow` |
|--------|-------------|----------|
| Use case | **Libraries** — define typed errors | **Applications** — flexible error handling |
| Error type | Concrete enum with variants | Type-erased `anyhow::Error` |
| Downstream handling | Callers can match on specific variants | Callers typically log/display, can't match |
| Context | Manual | `.context()` / `.with_context()` |
| Backtrace | Manual | Automatic (Rust 1.65+ with `RUST_BACKTRACE=1`) |

---

## Box<dyn Error> — Manual Type Erasure

Before `anyhow`, the common pattern for type-erased errors was `Box<dyn Error>`:

```rust
use std::error::Error;

fn fallible() -> Result<String, Box<dyn Error>> {
    let n: i32 = "42".parse()?;   // ? converts to Box<dyn Error>
    Ok(format!("{n}"))
}

// Modern equivalent with anyhow:
fn fallible_modern() -> anyhow::Result<String> {
    let n: i32 = "42".parse()?;
    Ok(format!("{n}"))
}
```

---

## unwrap / expect — When Acceptable

`unwrap()` and `expect()` both panic on `None`/`Err`. They are appropriate in:

1. **Tests** — panicking in tests is fine; it shows test failure
2. **Prototyping** — when you haven't designed error handling yet
3. **Provably impossible errors** — when you can prove the code can never fail

```rust
// Acceptable: parsing a compile-time constant
let port: u16 = "8080".parse().expect("hardcoded port should always parse");

// Acceptable: vector guaranteed non-empty by construction
assert!(!v.is_empty());
let first = v.first().unwrap();

// Acceptable in tests
#[test]
fn test_something() {
    let result = process_data(input).unwrap();  // panic = test failure = good
    assert_eq!(result, expected);
}
```

---

## panic! — Unrecoverable Bugs

Use `panic!` for programming errors (bugs), not for expected failures:

```rust
fn get_element(v: &[i32], idx: usize) -> i32 {
    if idx >= v.len() {
        panic!("index {idx} out of bounds for slice of length {}", v.len());
    }
    v[idx]
}

// panic! on debug assertion
debug_assert!(idx < v.len(), "out of bounds access");  // only in debug builds
```

```rust
// Catching panics (advanced, rare — usually for FFI or test infrastructure)
use std::panic;
let result = panic::catch_unwind(|| {
    // code that might panic
    42
});
```

---

## Common Pitfalls

- **Using `unwrap()` in production library code** — library code panicking is extremely disruptive. Return `Result` and let the application decide how to handle errors.
- **Losing error context with `?`** — bare `?` gives you the error but no context about where it occurred. Use `.with_context(|| ...)` from `anyhow` or add error variants with context fields.
- **`Box<dyn Error>` in library APIs** — avoid it in library public APIs because callers can't match on specific error variants. Use a concrete enum with `thiserror`.
- **Ignoring `Result` without `let _ = ...`** — `result.map_err(|e| log::error!("{e}"))` still has a `Result` that needs to be used. Rust warns on unused `Result` values.
- **`?` outside a function returning `Result` or `Option`** — `?` can only be used in functions that return `Result` or `Option`. Using it in `main()` requires `fn main() -> Result<(), Box<dyn Error>>`.

---

## Review Questions

1. Desugar `let data = file.read()?.trim().to_string();` — what does the `?` expand to? What must the enclosing function's return type be?
2. When would you choose `thiserror` over `anyhow`? Give a concrete scenario for each.
3. You call a function returning `io::Error` from a function returning `AppError`. What trait must you implement for `?` to work? Write the implementation.
4. Explain why `unwrap()` is acceptable in a test function but not in a library function called by user code.

---

#Rust #error-handling #Result #thiserror #anyhow #question-mark
