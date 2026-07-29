---
title: Enums and Pattern Matching
aliases: [Rust Enums, Rust Option, Rust Result, Rust Match Patterns]
tags: [Rust, enums, pattern-matching, Option, Result, ADT]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Structs_and_Methods]]"
  - "[[Rust_Control_Flow]]"
  - "[[Rust_Error_Handling]]"
  - "[[Traits_and_Generics]]"
status: complete
---

# Enums and Pattern Matching

> [!abstract] TL;DR
> Rust enums are algebraic data types (ADTs) — each variant can carry different data. `Option<T>` replaces null (no null pointer exceptions), and `Result<T, E>` replaces exception handling. Pattern matching with `match` is exhaustive — the compiler forces you to handle every variant, making impossible states unrepresentable in the type system.

---

## Intuition

In most OOP languages, you model "a thing that can be one of several shapes" with inheritance — a base class `Shape` and subclasses `Circle`, `Rectangle`. In Rust, you use enums. An enum variant can hold data (like a struct), making it a proper sum type (also called a tagged union). The key difference from C unions: Rust always knows which variant is active, and the borrow checker enforces safe access.

The power becomes clear with `Option<T>`: there is no `null` in Rust. A function that might not return a value returns `Option<T>`, and the caller is forced by the type system to handle both `Some(value)` and `None`. Null pointer exceptions are impossible.

---

## Enum Declaration

```rust
// Simple enum — like C enums
#[derive(Debug, PartialEq)]
enum Direction {
    North,
    South,
    East,
    West,
}

// Enum with data — each variant can have different associated types
#[derive(Debug)]
enum Message {
    Quit,                       // no data
    Move { x: i32, y: i32 },   // named fields (like a struct)
    Write(String),              // single String
    ChangeColor(u8, u8, u8),    // three u8 values (RGB)
}

// Enum with impl block — methods work the same as on structs
impl Message {
    fn call(&self) {
        match self {
            Message::Quit             => println!("Quit"),
            Message::Move { x, y }   => println!("Move to ({x}, {y})"),
            Message::Write(text)      => println!("Write: {text}"),
            Message::ChangeColor(r,g,b) => println!("Color: rgb({r},{g},{b})"),
        }
    }
}

fn main() {
    let msgs = vec![
        Message::Move { x: 10, y: 20 },
        Message::Write(String::from("hello")),
        Message::ChangeColor(255, 0, 128),
        Message::Quit,
    ];
    for msg in &msgs {
        msg.call();
    }
}
```

---

## Option<T> — Replacing Null

`Option<T>` is defined in the standard library as:
```rust
enum Option<T> {
    Some(T),   // contains a value of type T
    None,      // no value
}
```

```rust
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

fn main() {
    // Must handle both cases — compiler enforces exhaustiveness
    match divide(10.0, 2.0) {
        Some(result) => println!("result: {result}"),
        None         => println!("cannot divide by zero"),
    }

    // Convenience methods on Option
    let x: Option<i32> = Some(42);
    let y: Option<i32> = None;

    // unwrap() — panics if None (use only when you're certain it's Some)
    println!("{}", x.unwrap());         // 42

    // unwrap_or — provide a default
    println!("{}", y.unwrap_or(0));     // 0

    // unwrap_or_else — compute default lazily
    println!("{}", y.unwrap_or_else(|| expensive_default()));

    // map — transform the inner value if Some, propagate None
    let doubled = x.map(|v| v * 2);    // Some(84)
    let nothing = y.map(|v| v * 2);    // None

    // and_then — chain Option-returning operations (flatMap)
    let result = Some("42")
        .and_then(|s| s.parse::<i32>().ok())
        .and_then(|n| if n > 0 { Some(n) } else { None });

    // is_some / is_none
    assert!(x.is_some());
    assert!(y.is_none());

    // if let — concise single-arm match
    if let Some(value) = x {
        println!("Got: {value}");
    }

    // ? operator in Option-returning functions
    fn double_first(v: &[i32]) -> Option<i32> {
        let first = v.first()?;  // returns None if empty, otherwise unwraps
        Some(first * 2)
    }
}

fn expensive_default() -> i32 { 0 }
```

---

## Result<T, E> — Explicit Error Handling

```rust
// std library definition:
// enum Result<T, E> { Ok(T), Err(E) }

use std::num::ParseIntError;

fn parse_and_double(s: &str) -> Result<i32, ParseIntError> {
    let n: i32 = s.parse()?;  // ? returns Err early if parsing fails
    Ok(n * 2)
}

fn main() {
    match parse_and_double("21") {
        Ok(n)  => println!("doubled: {n}"),   // 42
        Err(e) => println!("error: {e}"),
    }

    // Result convenience methods
    let ok: Result<i32, &str> = Ok(42);
    let err: Result<i32, &str> = Err("bad input");

    println!("{}", ok.unwrap());             // 42
    println!("{}", err.unwrap_or(0));        // 0
    println!("{}", ok.is_ok());              // true
    println!("{:?}", ok.map(|n| n * 2));    // Ok(84)
    println!("{:?}", err.map(|n| n * 2));   // Err("bad input")

    // Chaining Results
    let result: Result<i32, _> = "  42  "
        .trim()
        .parse::<i32>()
        .map(|n| n * 2);  // Ok(84)

    // Convert Result to Option (discard the error)
    let opt: Option<i32> = ok.ok();   // Some(42)
    let opt2: Option<i32> = err.ok(); // None
}
```

---

## Comprehensive Pattern Matching

```rust
fn demonstrate_patterns() {
    // Destructuring tuple variants
    let point = (3, 7);
    match point {
        (0, 0) => println!("origin"),
        (x, 0) => println!("on x-axis at {x}"),
        (0, y) => println!("on y-axis at {y}"),
        (x, y) => println!("at ({x}, {y})"),
    }

    // Nested enum patterns
    #[derive(Debug)]
    enum Status {
        Active,
        Inactive,
    }
    #[derive(Debug)]
    enum UserState {
        LoggedIn { name: String, status: Status },
        Guest,
    }

    let state = UserState::LoggedIn {
        name: String::from("Alice"),
        status: Status::Active,
    };

    match state {
        UserState::LoggedIn { name, status: Status::Active } =>
            println!("{name} is active"),
        UserState::LoggedIn { name, status: Status::Inactive } =>
            println!("{name} is inactive"),
        UserState::Guest =>
            println!("anonymous guest"),
    }

    // .. to ignore fields
    struct Point3D { x: i32, y: i32, z: i32 }
    let p = Point3D { x: 1, y: 2, z: 3 };
    let Point3D { x, .. } = p;  // only bind x, ignore y and z
    println!("{x}");

    // Ranges in patterns
    let c = 'g';
    match c {
        'a'..='f' => println!("early letter"),
        'g'..='z' => println!("later letter"),
        _         => println!("other"),
    }

    // OR patterns
    let n = 4;
    match n {
        1 | 2 | 3 => println!("one two or three"),
        4 | 5 | 6 => println!("four five or six"),
        _          => println!("other"),
    }
}
```

### Destructuring in Function Parameters

```rust
// Destructure tuple directly in function signature
fn print_coords(&(x, y): &(i32, i32)) {
    println!("({x}, {y})");
}

// Destructure struct
struct Point { x: i32, y: i32 }
fn distance_from_origin(&Point { x, y }: &Point) -> f64 {
    ((x * x + y * y) as f64).sqrt()
}
```

---

## Modeling State with Enums

Enums excel at making invalid states unrepresentable — a key Rust design pattern:

```rust
// Instead of booleans + optional fields:
struct BadConnection {
    connected: bool,
    address: Option<String>,  // only meaningful when connected
}

// Use an enum — invalid combinations are impossible:
enum Connection {
    Disconnected,
    Connected { address: String, port: u16 },
    Error(String),
}

impl Connection {
    fn send(&self, data: &[u8]) -> Result<usize, String> {
        match self {
            Connection::Connected { address, port } => {
                println!("Sending {} bytes to {address}:{port}", data.len());
                Ok(data.len())
            }
            Connection::Disconnected => Err("not connected".to_string()),
            Connection::Error(e)     => Err(format!("connection error: {e}")),
        }
    }
}
```

---

## Common Pitfalls

- **Calling `.unwrap()` in production** — `unwrap()` on `None` or `Err` panics. Use `?`, `unwrap_or`, or a proper `match` in production code.
- **Forgetting exhaustiveness** — if you add a new enum variant, every `match` on that enum will fail to compile until you add a new arm. This is a feature, not a bug — you will never forget to handle new cases.
- **`if let` vs `match` for multiple arms** — `if let` skips exhaustiveness. If you have three variants and care about two, use `match` with a `_` arm rather than chaining `if let / else if let`.
- **`Option<Option<T>>`** — `None` and `Some(None)` are different values. Use `.flatten()` to collapse them.
- **Mixing up `map` and `and_then`** — `map` applies a non-Option function to the inner value; `and_then` (flatMap) chains Option-returning operations. Using `map` with an Option-returning closure gives `Option<Option<T>>`.

---

## Review Questions

1. Why does Rust not have `null`? How does `Option<T>` provide the same expressiveness while being safer?
2. You have `enum Shape { Circle(f64), Rectangle(f64, f64) }` and add a new `Triangle(f64, f64, f64)` variant. What happens to existing `match` expressions that don't have a `_` arm? Why is this behavior considered a feature?
3. Explain the difference between `unwrap()`, `unwrap_or(default)`, `unwrap_or_else(|| ...)`, and `expect("message")`. When is each appropriate?
4. What is the type returned by `Some("hello").map(|s| s.parse::<i32>())`? How would you collapse it into a flat `Option<i32>`?

---

#Rust #enums #pattern-matching #Option #Result #ADT
