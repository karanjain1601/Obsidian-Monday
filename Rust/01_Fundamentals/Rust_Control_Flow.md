---
title: Rust Control Flow
aliases: [Rust if else, Rust match, Rust loops, Rust for, Rust while let]
tags: [Rust, fundamentals, control-flow, match, pattern-matching]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Rust_Types_and_Variables]]"
  - "[[Rust_Functions_and_Closures]]"
  - "[[Enums_and_Pattern_Matching]]"
  - "[[Ownership_and_Borrowing]]"
status: complete
---

# Rust Control Flow

> [!abstract] TL;DR
> Rust's control flow is expression-oriented — `if`, `loop`, and `match` all produce values that can be assigned. `match` is exhaustive (the compiler forces you to handle every case), making it the safest pattern-matching tool in any systems language. `loop` with `break value` enables clean retry loops that return a result. `if let` and `while let` are ergonomic sugar for single-arm matches.

---

## Intuition

In most languages, `if` is a statement — it runs code but produces no value. In Rust, `if` is an **expression**: it evaluates to a value, eliminating many temporary variables. This composability extends to `match`, `loop`, and `block`s. If the last expression in a block doesn't have a semicolon, that block evaluates to it — the same rule applies from the smallest scope to a whole function body.

---

## if / else as Expressions

```rust
fn main() {
    let temperature = 28;

    // Standard conditional
    if temperature > 30 {
        println!("Hot!");
    } else if temperature > 20 {
        println!("Warm.");
    } else {
        println!("Cool.");
    }

    // if as an expression — assign the result directly
    let description = if temperature > 30 { "hot" } else { "not hot" };
    // Both arms MUST produce the same type — this is a compile-time check
    println!("It is {description}");

    // Inline conditional (replaces ternary operator — Rust has no ?:)
    let abs_val = if temperature < 0 { -temperature } else { temperature };
}
```

---

## loop — Infinite Loop with Return Value

`loop` is Rust's explicit infinite loop. Use `break` to exit, and `break value` to return a value from the loop.

```rust
fn main() {
    // Simple loop with break
    let mut count = 0;
    loop {
        count += 1;
        if count == 5 { break; }
    }

    // loop returning a value — clean for retry logic
    let result = loop {
        let attempt = try_connect();
        if attempt.is_ok() {
            break attempt.unwrap();  // the loop evaluates to this value
        }
        std::thread::sleep(std::time::Duration::from_millis(100));
    };

    // Loop labels — break/continue a specific outer loop
    'outer: for i in 0..5 {
        for j in 0..5 {
            if i == 2 && j == 2 {
                break 'outer;  // breaks the outer loop, not just the inner one
            }
        }
    }
}

fn try_connect() -> Result<String, String> {
    // simulation
    Ok("connected".to_string())
}
```

---

## while and while let

```rust
fn main() {
    // Standard while loop
    let mut n = 0;
    while n < 5 {
        println!("{n}");
        n += 1;
    }

    // while let — loop as long as a pattern matches
    let mut stack = vec![1, 2, 3];
    while let Some(top) = stack.pop() {
        // pop() returns Option<T>: Some(value) if non-empty, None if empty
        // when pop() returns None, the while let stops
        println!("popped: {top}");
    }

    // Equivalent to:
    loop {
        match stack.pop() {
            Some(top) => println!("{top}"),
            None => break,
        }
    }
}
```

---

## for — Iterating over Ranges and Collections

```rust
fn main() {
    // Range — 0..5 is exclusive of 5, 0..=5 includes 5
    for i in 0..5 {
        println!("{i}");  // 0, 1, 2, 3, 4
    }

    for i in 0..=5 {
        println!("{i}");  // 0, 1, 2, 3, 4, 5
    }

    // Iterating a collection — for takes ownership of the iterator
    let names = vec!["Alice", "Bob", "Charlie"];
    for name in &names {       // &names borrows, names is still usable after
        println!("{name}");
    }

    // With index — enumerate() wraps each item in (index, value)
    for (i, name) in names.iter().enumerate() {
        println!("{i}: {name}");
    }

    // Consuming the collection (moves each element out)
    for name in names {        // names is moved — cannot use names afterward
        println!("{name}");
    }

    // Mutable iteration
    let mut numbers = vec![1, 2, 3, 4, 5];
    for n in &mut numbers {
        *n *= 2;  // dereference to modify
    }
    println!("{:?}", numbers);  // [2, 4, 6, 8, 10]

    // Reverse range
    for i in (0..5).rev() {
        println!("{i}");  // 4, 3, 2, 1, 0
    }
}
```

---

## match — Exhaustive Pattern Matching

`match` is Rust's most powerful control flow construct. The compiler verifies that every possible variant is handled — no forgotten cases.

```rust
fn describe_number(n: i32) -> &'static str {
    match n {
        0         => "zero",
        1 | 2 | 3 => "small",         // OR patterns
        4..=9     => "medium",         // inclusive range pattern
        10..=99   => "two digits",
        _         => "large",          // _ is the catch-all wildcard
    }
}

// Matching on enum variants (the primary use case)
#[derive(Debug)]
enum Direction { North, South, East, West }

fn step(dir: &Direction) -> (i32, i32) {
    match dir {
        Direction::North => (0, 1),
        Direction::South => (0, -1),
        Direction::East  => (1, 0),
        Direction::West  => (-1, 0),
    }
    // No _ needed — all 4 variants are covered. If you add Direction::Up,
    // the compiler will ERROR here, forcing you to handle it.
}

// Match with binding — extract values from complex enum variants
#[derive(Debug)]
enum Shape {
    Circle(f64),           // radius
    Rectangle(f64, f64),   // width, height
    Triangle { base: f64, height: f64 }, // named fields
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r)               => std::f64::consts::PI * r * r,
        Shape::Rectangle(w, h)         => w * h,
        Shape::Triangle { base, height } => 0.5 * base * height,
    }
}
```

### Match Guards

Match guards add an extra condition to a pattern arm:

```rust
fn classify_number(n: i32) -> &'static str {
    match n {
        x if x < 0  => "negative",
        0            => "zero",
        x if x % 2 == 0 => "positive even",
        _            => "positive odd",
    }
}
```

### @ Bindings — Bind and Test Simultaneously

```rust
fn describe(n: u32) -> String {
    match n {
        // n @ pattern: bind n to the value AND test it matches the pattern
        n @ 1..=12  => format!("month number {n}"),
        n @ 13..=19 => format!("teen year {n}"),
        n           => format!("other: {n}"),
    }
}
```

---

## if let — Single-Arm Match Sugar

`if let` is syntactic sugar for a `match` with one arm. Use it when you only care about one variant and want to ignore the rest.

```rust
fn main() {
    let config_max = Some(3u8);

    // Verbose match:
    match config_max {
        Some(max) => println!("max is {max}"),
        None      => (),  // awkward — do nothing arm
    }

    // Clean if let:
    if let Some(max) = config_max {
        println!("max is {max}");
    }

    // if let with else
    let coin = Some(42u32);
    if let Some(amount) = coin {
        println!("Found: {amount}");
    } else {
        println!("Empty");
    }
}
```

---

## continue — Skip to Next Iteration

```rust
fn main() {
    for i in 0..10 {
        if i % 2 == 0 {
            continue;  // skip even numbers
        }
        println!("{i}");  // 1, 3, 5, 7, 9
    }
}
```

---

## Common Pitfalls

- **Non-exhaustive match** — forgetting a variant causes a compile error. This is intentional. When you add a new enum variant later, `match` arms without `_` will force you to handle it everywhere — a safety net against silent regressions.
- **`if let` discards exhaustiveness** — using `if let` means you are explicitly opting out of exhaustiveness checking. If you have multiple arms to handle, prefer `match`.
- **Loop labels are rarely needed** — if you find yourself reaching for `'outer:`, consider refactoring to a function with an early `return` instead.
- **Type mismatch in if/else arms** — both arms must return the same type. `if condition { 1 } else { "text" }` will not compile.
- **`for i in 0..n` vs `for i in 0..=n`** — off-by-one errors are common. `0..5` gives 0,1,2,3,4. `0..=5` gives 0,1,2,3,4,5.

---

## Review Questions

1. How does Rust's `if` expression differ from Python's ternary operator `x if cond else y`? What constraint does Rust impose on the two branches?
2. You have `match direction { North => ..., South => ... }`. Your team adds a new `Direction::Up` variant. What happens when you compile? Compare this safety guarantee to a `switch` statement in C.
3. Write a `while let` loop that drains a `VecDeque<String>` and prints each element. When does the loop stop?
4. What is the purpose of the `@` binding in a match arm? Give a concrete example where it is more expressive than a plain pattern.

---

#Rust #fundamentals #control-flow #match #pattern-matching
