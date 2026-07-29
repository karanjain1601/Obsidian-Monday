---
title: Rust Functions and Closures
aliases: [Rust fn, Rust closures, Rust Fn FnMut FnOnce, Rust higher-order functions]
tags: [Rust, fundamentals, functions, closures, functional-programming]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Rust_Control_Flow]]"
  - "[[Ownership_and_Borrowing]]"
  - "[[Traits_and_Generics]]"
  - "[[Iterators_and_Functional_Patterns]]"
status: complete
---

# Rust Functions and Closures

> [!abstract] TL;DR
> Rust functions use `fn`, have explicit parameter types and return types, and treat the last expression without a semicolon as the return value. Closures are anonymous functions that capture their environment — the compiler infers whether they implement `Fn` (immutable borrow), `FnMut` (mutable borrow), or `FnOnce` (take ownership). `move` closures force ownership capture, essential for threads and async.

---

## Intuition

The distinction between expressions and statements is central to Rust's function model. A statement performs an action and returns nothing; an expression evaluates to a value. The semicolon is the difference: `x + 1` is an expression (produces a value), `x + 1;` is a statement (produces nothing / unit `()`). Functions return the value of their final expression — no explicit `return` needed.

Closures are first-class values that capture from the surrounding scope. The three `Fn` traits model the three ways a closure can interact with its environment, mirroring Rust's ownership rules exactly.

---

## Function Declaration

```rust
// fn name(param: Type, param: Type) -> ReturnType { body }
fn add(x: i32, y: i32) -> i32 {
    x + y   // no semicolon — this is the return expression
}

// Explicit return — useful for early exit
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        return None;  // early return with explicit `return`
    }
    Some(a / b)  // implicit return
}

// Unit return type — () is implicit when no -> annotation
fn print_greeting(name: &str) {
    println!("Hello, {name}!");
    // implicitly returns ()
}

// Explicitly returning unit
fn explicit_unit() -> () {
    println!("done");
}

// Never type — functions that never return (panic, infinite loop, process::exit)
fn diverging() -> ! {
    panic!("This function never returns normally");
}
```

### Expressions vs Statements

```rust
fn demonstrate() {
    // Statement — no value produced
    let x = 5;   // the `let` binding is a statement

    // Expression — produces a value
    let y = {
        let inner = 3;
        inner * 2   // no semicolon — this block evaluates to 6
    };
    // y == 6

    // Common mistake: accidental unit return
    fn add_wrong(a: i32, b: i32) -> i32 {
        a + b;  // semicolon turns this into a statement, returning ()
        // ERROR: mismatched types: expected i32, found ()
    }
}
```

---

## Closures

Closures are anonymous functions that can capture variables from the enclosing scope.

```rust
fn main() {
    let x = 4;

    // Closure syntax: |params| body
    let add_x = |n| n + x;        // captures x by reference (borrows)
    let square = |n: i32| n * n;  // with explicit type annotation
    let greet = |name: &str| {    // multi-line body with braces
        let msg = format!("Hello, {name}!");
        println!("{msg}");
    };

    println!("{}", add_x(3));   // 7
    println!("{}", square(5));  // 25
    greet("Alice");

    // Closures can be stored in variables (type is inferred)
    let double = |x: i32| x * 2;
    let triple = |x: i32| x * 3;

    // Higher-order functions — pass closures to functions
    let numbers = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = numbers.iter().map(|&n| n * 2).collect();
    let evens: Vec<&i32> = numbers.iter().filter(|&&n| n % 2 == 0).collect();

    println!("{:?}", doubled);  // [2, 4, 6, 8, 10]
    println!("{:?}", evens);    // [2, 4]
}
```

---

## The Fn Trait Family

Every closure implements one or more of three traits, based on how it uses captured variables:

| Trait | Capture mode | Can be called | Use case |
|-------|-------------|---------------|----------|
| `FnOnce` | Moves captured value out | Once only | Closures that consume a captured value |
| `FnMut` | Mutably borrows | Multiple times | Closures that modify captured state |
| `Fn` | Immutably borrows | Multiple times | Pure closures — most common |

```rust
fn apply_once<F: FnOnce() -> String>(f: F) -> String {
    f()  // can only call f() once
}

fn apply_mut<F: FnMut() -> i32>(mut f: F) -> Vec<i32> {
    vec![f(), f(), f()]  // calls f three times; f can mutate its captures
}

fn apply<F: Fn(i32) -> i32>(f: F, v: &[i32]) -> Vec<i32> {
    v.iter().map(|&x| f(x)).collect()  // f called many times, immutably
}

fn demonstrate_fn_traits() {
    // FnOnce — consumes a captured String
    let s = String::from("hello");
    let consume = || {
        println!("{s}");  // s is moved OUT of the closure here
        drop(s);          // explicit move — s is consumed
    };
    apply_once(consume);
    // consume();  // ERROR: closure already moved s, cannot call again

    // FnMut — mutates a captured counter
    let mut count = 0;
    let mut increment = || {
        count += 1;
        count
    };
    let results = apply_mut(&mut increment);  // [1, 2, 3]

    // Fn — immutable borrow
    let factor = 3;
    let triple = |x| x * factor;  // borrows factor immutably
    let tripled = apply(triple, &[1, 2, 3, 4]);  // [3, 6, 9, 12]
}
```

---

## move Closures

`move` forces the closure to take **ownership** of all captured variables, even if it only needs a reference. Essential for threads (which may outlive the creating scope) and for async tasks.

```rust
use std::thread;

fn main() {
    let name = String::from("Alice");

    // Without move, the closure would borrow `name` — but the thread
    // may outlive the current stack frame where `name` lives.
    // The compiler rejects this without `move`.
    let handle = thread::spawn(move || {
        // `name` is moved INTO the closure — the closure owns it
        println!("Hello from thread, {name}!");
    });

    // `name` is no longer accessible here — it was moved
    handle.join().unwrap();

    // move with Copy types — they are copied, not moved
    let x = 5i32;  // i32 is Copy
    let print_x = move || println!("{x}");
    print_x();
    println!("{x}");  // x is still accessible — Copy types are duplicated
}
```

---

## Function Pointers

Function pointers (`fn` type, lowercase) point to a specific function, not a closure. They are useful for callbacks that don't need to capture environment.

```rust
fn double(x: i32) -> i32 { x * 2 }
fn triple(x: i32) -> i32 { x * 3 }

fn apply_fn(f: fn(i32) -> i32, value: i32) -> i32 {
    f(value)
}

fn main() {
    let result = apply_fn(double, 5);  // 10
    let result = apply_fn(triple, 5);  // 15

    // Store function pointers in a Vec
    let operations: Vec<fn(i32) -> i32> = vec![double, triple];
    for op in &operations {
        println!("{}", op(4));  // 8, 12
    }
}
```

### Function Pointers vs Closures

```rust
// fn(i32) -> i32 : function pointer — no environment, fixed-size, copiable
// impl Fn(i32) -> i32 : any closure or function with this signature
// Box<dyn Fn(i32) -> i32> : dynamically-dispatched closure (heap-allocated)

fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n  // n is captured — cannot be represented as fn pointer
}

fn make_adder_boxed(n: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x + n)  // same, but type-erased for heterogeneous collections
}
```

---

## Returning Closures from Functions

```rust
// `impl Fn` — return an anonymous closure (static dispatch, monomorphized)
fn make_multiplier(factor: i32) -> impl Fn(i32) -> i32 {
    move |x| x * factor
}

// `Box<dyn Fn>` — when you need to return different closures conditionally
fn make_operation(op: &str) -> Box<dyn Fn(i32, i32) -> i32> {
    match op {
        "add" => Box::new(|a, b| a + b),
        "mul" => Box::new(|a, b| a * b),
        _     => Box::new(|a, _| a),  // identity
    }
}

fn main() {
    let triple = make_multiplier(3);
    println!("{}", triple(5));  // 15

    let op = make_operation("add");
    println!("{}", op(3, 4));  // 7
}
```

---

## Common Pitfalls

- **Semicolon at the end of a return expression** — `fn f() -> i32 { 5; }` returns `()`, not `5`. Remove the semicolon.
- **Calling a `FnOnce` more than once** — the compiler prevents this, but the error message can be confusing. Look for the closure consuming a `String` or `Vec` internally.
- **Move closure in a loop** — each iteration creates a new closure that tries to move the same variable. Move into a clone for each iteration: `let item = item.clone(); thread::spawn(move || use(item))`.
- **`fn` pointer vs `Fn` trait** — closures that capture environment cannot be stored as `fn` pointers. Use `impl Fn` (static) or `Box<dyn Fn>` (dynamic).
- **Parameter type inference** — closures infer types from the first call. If you call the same closure with different types, you get a compile error.

---

## Review Questions

1. What is the difference between `fn add(a: i32, b: i32) -> i32 { a + b; }` and `fn add(a: i32, b: i32) -> i32 { a + b }`? Which compiles?
2. You want to run a closure on a new thread that uses a `String` from the current scope. Why does the compiler reject this without `move`? What does `move` do to resolve it?
3. Explain when a closure implements `FnOnce` but not `Fn`. Give a concrete example involving a `String`.
4. What is the difference between `fn(i32) -> i32` (function pointer) and `impl Fn(i32) -> i32`? When can you use one but not the other?

---

#Rust #fundamentals #functions #closures #functional-programming
