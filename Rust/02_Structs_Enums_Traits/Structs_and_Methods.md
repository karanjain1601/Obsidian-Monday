---
title: Structs and Methods
aliases: [Rust Structs, Rust impl, Rust Methods, Rust Derive Macros]
tags: [Rust, structs, methods, OOP, derive]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Enums_and_Pattern_Matching]]"
  - "[[Traits_and_Generics]]"
  - "[[Ownership_and_Borrowing]]"
  - "[[Rust_Serde]]"
status: complete
---

# Structs and Methods

> [!abstract] TL;DR
> Structs are Rust's primary way to bundle related data. `impl` blocks attach methods to structs — `&self` for read access, `&mut self` for mutation, `self` to consume, and associated functions (no `self`) for constructors. `#[derive]` macros auto-generate common trait implementations (Debug, Clone, PartialEq, Serialize) without boilerplate. Structs with methods are Rust's equivalent of classes — without inheritance.

---

## Intuition

Rust doesn't have classes or inheritance. Instead, you compose behavior by attaching methods to structs via `impl` blocks, and you share behavior across types via traits (see [[Traits_and_Generics]]). This composition-over-inheritance model avoids the diamond inheritance problem and makes dependencies explicit. A struct is pure data; an `impl` block is behavior — they are deliberately separated.

---

## Struct Declaration

```rust
// Named-field struct (most common)
struct User {
    username: String,
    email: String,
    age: u32,
    active: bool,
}

// Tuple struct — fields accessed by index
struct Point(f64, f64);
struct Color(u8, u8, u8);  // RGB

// Unit struct — no fields, used as marker types
struct Marker;
struct AlwaysEqual;
```

### Creating and Accessing Instances

```rust
fn main() {
    // Create an instance — ALL fields must be provided
    let user1 = User {
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        age: 30,
        active: true,
    };

    // Dot notation to access fields
    println!("{}", user1.username);  // alice
    println!("{}", user1.age);       // 30

    // Mutable struct — entire struct must be mut (no partial mutability)
    let mut user2 = User {
        username: String::from("bob"),
        email: String::from("bob@example.com"),
        age: 25,
        active: false,
    };
    user2.email = String::from("newemail@example.com");

    // Struct update syntax — copy fields not explicitly set from another instance
    let user3 = User {
        username: String::from("charlie"),
        email: String::from("charlie@example.com"),
        ..user1  // use remaining fields from user1 (age, active)
        // NOTE: this moves user1 if any moved field (String) is used!
        // user1.email and user1.username were NOT moved (we provided them above)
        // but user1.age and user1.active were copied (u32, bool are Copy)
    };

    // Shorthand when variable name matches field name
    let username = String::from("dave");
    let email = String::from("dave@example.com");
    let user4 = User { username, email, age: 22, active: true };
    // equivalent to: User { username: username, email: email, ... }

    // Tuple struct
    let origin = Point(0.0, 0.0);
    let red = Color(255, 0, 0);
    println!("{} {}", origin.0, origin.1);  // index access
}
```

---

## impl Blocks — Methods

Methods are functions defined inside `impl` blocks. The first parameter determines the receiver:

| Receiver | Meaning | Use case |
|----------|---------|----------|
| `&self` | Shared reference to self | Read-only access |
| `&mut self` | Mutable reference to self | Modify the struct |
| `self` | Takes ownership of self | Builder pattern, consuming transforms |
| No self | Associated function | Constructors, static helpers |

```rust
#[derive(Debug)]
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    // Associated function (no self) — called as Rectangle::new(...)
    pub fn new(width: f64, height: f64) -> Self {
        // `Self` is an alias for the implementing type (Rectangle here)
        Self { width, height }
    }

    pub fn square(size: f64) -> Self {
        Self { width: size, height: size }
    }

    // Method — &self: read-only borrow
    pub fn area(&self) -> f64 {
        self.width * self.height
    }

    pub fn perimeter(&self) -> f64 {
        2.0 * (self.width + self.height)
    }

    pub fn is_square(&self) -> bool {
        (self.width - self.height).abs() < f64::EPSILON
    }

    pub fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    // &mut self — mutates the struct
    pub fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }

    // self (consuming) — builder pattern
    pub fn with_scale(mut self, factor: f64) -> Self {
        self.width *= factor;
        self.height *= factor;
        self  // return modified self — enables method chaining
    }
}

fn main() {
    let mut r = Rectangle::new(10.0, 5.0);
    println!("area: {}", r.area());             // 50.0
    println!("perimeter: {}", r.perimeter());   // 30.0
    println!("is square: {}", r.is_square());   // false

    r.scale(2.0);
    println!("{:?}", r);  // Rectangle { width: 20.0, height: 10.0 }

    // Builder pattern with method chaining
    let big = Rectangle::square(5.0).with_scale(3.0);
    println!("{:?}", big);  // Rectangle { width: 15.0, height: 15.0 }

    // Multiple impl blocks for the same type — allowed and sometimes useful
    // (common when splitting concerns or using cfg attributes)
}

// Multiple impl blocks are valid
impl Rectangle {
    pub fn describe(&self) -> String {
        format!("{}x{} rectangle", self.width, self.height)
    }
}
```

---

## #[derive] Macros

`#[derive]` auto-generates common trait implementations at compile time:

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 1, y: 2 };
    let p2 = p1.clone();     // Clone: creates a deep copy
    println!("{:?}", p1);    // Debug: {:?} and {:#?} (pretty-print)
    println!("{:#?}", p1);   // Pretty debug

    assert_eq!(p1, p2);      // PartialEq/Eq: == and != comparisons

    // Hash enables use as HashMap/HashSet key
    use std::collections::HashMap;
    let mut map = HashMap::new();
    map.insert(p1, "origin area");
}
```

### Common Derive Macros

| Derive | Provides | Requires |
|--------|---------|----------|
| `Debug` | `{:?}` and `{:#?}` formatting | All fields must implement Debug |
| `Clone` | `.clone()` method | All fields must implement Clone |
| `Copy` | Copy semantics (auto-duplicate on assign) | All fields must implement Copy; no heap data |
| `PartialEq` | `==` and `!=` operators | All fields must implement PartialEq |
| `Eq` | Total equality (PartialEq + reflexivity) | PartialEq first |
| `PartialOrd` | `<`, `>`, `<=`, `>=` | All fields PartialOrd; compares lexicographically |
| `Ord` | Total ordering (sort) | Eq + PartialOrd |
| `Hash` | Use as HashMap key | PartialEq + Eq |
| `Default` | `Default::default()` or `..Default::default()` | All fields must implement Default |
| `Serialize` / `Deserialize` | JSON/YAML/binary conversion | `serde` crate with `features = ["derive"]` |

```rust
#[derive(Debug, Clone, Default)]
struct Config {
    host: String,      // default: ""
    port: u16,         // default: 0
    max_connections: u32,  // default: 0
    verbose: bool,     // default: false
}

fn main() {
    // Default: every field gets its type's Default value
    let config = Config::default();

    // Partial override with struct update syntax
    let custom = Config {
        host: String::from("localhost"),
        port: 8080,
        ..Config::default()  // max_connections=0, verbose=false
    };
}
```

---

## Tuple Structs and Unit Structs

```rust
// Tuple struct — useful for newtype pattern (type-safe wrappers)
struct Meters(f64);
struct Kilograms(f64);

fn add_meters(a: Meters, b: Meters) -> Meters {
    Meters(a.0 + b.0)
}
// add_meters(Meters(3.0), Kilograms(5.0));  // COMPILE ERROR — type safety!

// Unit struct — used as ZST (zero-sized type), marker types, or in error types
struct Singleton;
impl Singleton {
    fn instance() -> &'static Singleton {
        &Singleton  // safe because Singleton has no data
    }
}
```

---

## Common Pitfalls

- **Partial mutability doesn't exist** — you can't declare `let mut user.email`. The entire struct must be `mut` to mutate any field.
- **Struct update syntax can move** — `..other_struct` moves non-`Copy` fields from `other_struct`. After `..user1`, you cannot use `user1.username` if it was moved.
- **`Self` vs `self`** — uppercase `Self` is the type (alias for the implementing type), lowercase `self` is the instance.
- **Forgetting `pub` on fields** — struct fields are private by default within their module. Fields accessed from outside the module need `pub`.
- **`#[derive(Copy)]` requires all fields to be `Copy`** — if you add a `String` field, the derived `Copy` breaks. Either remove `Copy` or use `&str` (which is `Copy`).

---

## Review Questions

1. What is the difference between `&self`, `&mut self`, and `self` as method receiver parameters? When would you use each?
2. Why are associated functions (no `self`) often used for constructors in Rust instead of a special `new` keyword?
3. You have `#[derive(Clone, Copy)]` on a struct with a `String` field. Why does this fail? What two options do you have to fix it?
4. Explain the "newtype pattern" with tuple structs. How does `struct Meters(f64)` differ from `type Meters = f64`, and when is the newtype approach safer?

---

#Rust #structs #methods #OOP #derive
