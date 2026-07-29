---
title: Rust Types and Variables
aliases: [Rust Variables, Rust Scalar Types, Rust Compound Types, Rust Type System]
tags: [Rust, fundamentals, types, variables, shadowing]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Rust_Overview]]"
  - "[[Rust_Control_Flow]]"
  - "[[Ownership_and_Borrowing]]"
  - "[[Traits_and_Generics]]"
status: complete
---

# Rust Types and Variables

> [!abstract] TL;DR
> Rust is statically typed with powerful type inference — you rarely annotate types, but every value has a fixed type at compile time. Variables are immutable by default (`let`), mutation requires explicit `let mut`. Shadowing is a distinct concept from mutation: it creates a new binding and can even change the type. Overflow in debug mode panics; in release mode it wraps silently.

---

## Intuition

Rust's type system is built around two goals: eliminating entire classes of bugs at compile time, and expressing intent clearly in code. Making variables immutable by default is not pedantry — it makes code easier to reason about, because you know a value hasn't changed unless `mut` is visible. The distinction between shadowing and mutation is subtle but powerful: shadowing lets you reuse a name for a transformed value without keeping the old one alive.

---

## Variables and Mutability

```rust
fn main() {
    // Immutable binding — cannot be reassigned
    let x = 5;
    // x = 6;  // ERROR: cannot assign twice to immutable variable `x`

    // Mutable binding — explicit opt-in
    let mut y = 5;
    y = 6;  // OK
    println!("y = {y}");

    // Constants — must be type-annotated, always immutable, evaluated at compile time
    const MAX_POINTS: u32 = 100_000;  // underscores improve readability in numbers
    println!("max = {MAX_POINTS}");

    // Static — lives for the entire program lifetime
    static GREETING: &str = "Hello, world!";
    println!("{GREETING}");
}
```

### Shadowing — Not Mutation

Shadowing creates a **new binding** with the same name. The old binding is dropped (or goes out of scope). Crucially, shadowing can change the type.

```rust
fn main() {
    let spaces = "   ";           // &str
    let spaces = spaces.len();    // usize — completely different type!
    println!("spaces: {spaces}"); // 3

    // This is NOT possible with mut — you can't change type via mutation:
    // let mut spaces = "   ";
    // spaces = spaces.len(); // ERROR: expected &str, found usize

    // Shadowing in an inner scope — outer binding resumes after the block
    let x = 5;
    let x = x + 1;  // x = 6
    {
        let x = x * 2;   // x = 12 inside this block
        println!("inner x: {x}");  // 12
    }
    println!("outer x: {x}");  // 6 — outer shadow resumes
}
```

---

## Scalar Types

Rust has four primary scalar types: integers, floating-point numbers, booleans, and characters.

### Integer Types

| Signed | Unsigned | Size |
|--------|----------|------|
| `i8` | `u8` | 8-bit |
| `i16` | `u16` | 16-bit |
| `i32` | `u32` | 32-bit (default for integer literals) |
| `i64` | `u64` | 64-bit |
| `i128` | `u128` | 128-bit |
| `isize` | `usize` | platform-width (pointer size) |

```rust
fn integers() {
    let decimal     = 98_222;       // decimal with visual separator
    let hex         = 0xff;         // hexadecimal
    let octal       = 0o77;         // octal
    let binary      = 0b1111_0000;  // binary
    let byte: u8    = b'A';         // byte literal — ASCII value of 'A' = 65

    // Type annotation on the variable
    let big: i128 = 340_282_366_920_938_463_463_374_607_431_768_211_455i128;

    // usize is used for indexing and lengths — tied to pointer size
    let v = vec![1, 2, 3];
    let idx: usize = 0;
    println!("{}", v[idx]);
}
```

### Integer Overflow Handling

```rust
fn overflow_behavior() {
    // Debug mode: overflow panics at runtime
    // Release mode: wraps (two's complement wrapping)

    // Explicit wrapping (use when you want wrapping semantics):
    let a: u8 = 255_u8.wrapping_add(1); // 0

    // Checked (returns None on overflow):
    let b: Option<u8> = 255_u8.checked_add(1); // None

    // Saturating (clamps at max/min):
    let c: u8 = 255_u8.saturating_add(1); // 255

    // Overflowing (returns (result, overflowed_bool)):
    let (d, overflowed) = 255_u8.overflowing_add(1); // (0, true)
}
```

### Floating-Point Types

```rust
fn floats() {
    let f1 = 2.0;        // f64 — default, double precision
    let f2: f32 = 3.0;   // single precision — only when memory/SIMD matters

    // IEEE 754 special values
    let inf = f64::INFINITY;
    let neg_inf = f64::NEG_INFINITY;
    let nan = f64::NAN;

    // NaN != NaN (IEEE 754 rule)
    assert!(nan.is_nan());
    assert!(!nan.is_nan()); // would panic — this is how you check

    // Useful constants
    let pi = std::f64::consts::PI;   // 3.141592653589793
    let e  = std::f64::consts::E;    // 2.718281828459045
}
```

### Boolean and Char

```rust
fn bool_and_char() {
    let t: bool = true;
    let f = false;

    // char is 4 bytes — a Unicode scalar value (not just ASCII)
    let c = 'z';
    let z: char = 'ℤ';        // Unicode math symbol
    let heart_eyed_cat = '😻'; // emoji is valid!
    println!("char size: {} bytes", std::mem::size_of::<char>()); // 4
}
```

---

## Compound Types

### Tuples

Tuples group values of different types. They have a fixed length — you cannot add or remove elements after declaration.

```rust
fn tuples() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);

    // Destructuring
    let (x, y, z) = tup;
    println!("y = {y}");

    // Index access using .0, .1, .2 ...
    let five_hundred = tup.0;
    let six_point_four = tup.1;

    // Unit type () — empty tuple, returned from functions with no return value
    let unit: () = ();
}
```

### Arrays

Arrays have a fixed length known at compile time, stored on the stack. Use `Vec<T>` for dynamic sizing.

```rust
fn arrays() {
    let a = [1, 2, 3, 4, 5];           // [i32; 5] — type inferred
    let b: [i32; 5] = [1, 2, 3, 4, 5]; // explicit type annotation

    // Initialize all elements to the same value
    let zeros = [0; 10];  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  — [i32; 10]

    // Indexing — out-of-bounds panics at runtime (debug) or is UB in unsafe (never)
    let first = a[0];
    let last  = a[a.len() - 1];

    // Slices of arrays (borrowed view)
    let slice: &[i32] = &a[1..3]; // [2, 3]

    // 2D array
    let matrix: [[i32; 3]; 2] = [[1, 2, 3], [4, 5, 6]];
}
```

---

## Type Inference and Type Aliases

```rust
fn type_inference() {
    // Rust infers the type from usage context
    let mut v = Vec::new();  // type not yet known
    v.push(1_i32);           // now inferred as Vec<i32>

    // When inference needs a hint, use turbofish ::<>
    let parsed = "42".parse::<i32>().unwrap();

    // Or annotate the binding
    let parsed: i32 = "42".parse().unwrap();
}

// Type aliases — new name for an existing type, NOT a new type
type Kilometers = i32;
type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;  // common pattern

fn add_km(a: Kilometers, b: Kilometers) -> Kilometers {
    a + b  // Kilometers IS i32 — no conversion needed
}
```

---

## The Copy Trait

Types that implement `Copy` are duplicated on assignment rather than moved. All scalar types are `Copy`.

```rust
fn copy_vs_move() {
    // Copy types — the value is duplicated
    let x: i32 = 5;
    let y = x;   // x is COPIED — both x and y are valid
    println!("{x} {y}"); // works fine

    // Non-Copy types (String, Vec, etc.) — ownership is MOVED
    let s1 = String::from("hello");
    let s2 = s1;   // s1 is MOVED into s2 — s1 is no longer valid
    // println!("{s1}"); // ERROR: use of moved value

    // Types that implement Copy:
    // - All integer types (i8 through i128, u8 through u128, isize, usize)
    // - bool
    // - f32, f64
    // - char
    // - Tuples where ALL elements are Copy: (i32, bool) is Copy; (i32, String) is not
    // - &T (shared references) are Copy; &mut T is NOT Copy
}
```

---

## Common Pitfalls

- **`as` casting can truncate silently** — `300_i32 as u8` gives `44`, not a panic. Use `try_from` for checked conversions.
- **Integer literals default to `i32`** — if you need `u64`, annotate explicitly or add a suffix: `100u64`.
- **`usize` on 32-bit platforms** — code that works on 64-bit may overflow if it stores large values in `usize` on a 32-bit embedded target.
- **Char is 4 bytes, not 1** — `String::len()` returns byte count, not character count. Use `s.chars().count()` for character count.
- **Shadowing is not mutation** — the original binding still exists in memory until its scope ends. Excessive shadowing can be confusing; use it deliberately for transformations.

---

## Review Questions

1. What is the difference between `let x = 5; let x = x + 1;` (shadowing) and `let mut x = 5; x = x + 1;` (mutation)? When would you choose shadowing?
2. A colleague writes `let result: u8 = some_value + 1;` and claims it is safe because the value will never exceed 200. What happens in debug mode if it exceeds 255? What is the idiomatic Rust way to handle this safely?
3. Why does `let v = Vec::new(); v.push("hello");` fail to compile without `mut`?
4. Explain why `(i32, bool)` implements `Copy` but `(i32, String)` does not.

---

#Rust #fundamentals #types #variables #shadowing
