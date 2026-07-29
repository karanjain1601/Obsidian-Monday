---
title: Traits and Generics
aliases: [Rust Traits, Rust Generics, Rust trait bounds, Rust impl Trait, Rust dyn Trait]
tags: [Rust, traits, generics, polymorphism, monomorphization]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Structs_and_Methods]]"
  - "[[Enums_and_Pattern_Matching]]"
  - "[[Trait_Objects_and_Dynamic_Dispatch]]"
  - "[[Lifetimes]]"
status: complete
---

# Traits and Generics

> [!abstract] TL;DR
> Traits define shared behavior (like interfaces). Generics write code that works over many types. Trait bounds constrain generics: `fn foo<T: Display>(x: T)` means "T must implement Display." Rust uses **monomorphization** for generic functions — the compiler generates a concrete copy of the function for each type used, giving zero-cost abstractions. `impl Trait` and `dyn Trait` are two ways to use trait polymorphism with different performance characteristics.

---

## Intuition

Traits are Rust's answer to interfaces, type classes (Haskell), and abstract base classes. The crucial difference from OOP: traits define behavior, structs define data. You can implement a trait for any type — including types defined in other crates — as long as either the trait or the type is local to your crate (the **orphan rule**).

Generics without trait bounds are nearly useless — you can't call any methods on an unconstrained generic `T`. Trait bounds are what makes generics powerful: they let you write algorithms over abstract interfaces, and the compiler generates hyper-optimized concrete code for each type (monomorphization).

---

## Trait Definition and Implementation

```rust
// Define a trait — a collection of method signatures (and optional default implementations)
pub trait Summary {
    // Required method — implementing types MUST provide this
    fn summarize_author(&self) -> String;

    // Default method — implementing types CAN override this
    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

// Implement the trait for a concrete type
pub struct NewsArticle {
    pub headline: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize_author(&self) -> String {
        self.author.clone()
    }

    fn summarize(&self) -> String {
        format!("{} by {} — {}", self.headline, self.author, &self.content[..50])
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
}

impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
    // Uses the default summarize() — no override needed
}

fn main() {
    let article = NewsArticle {
        headline: String::from("Breaking news"),
        author: String::from("Alice"),
        content: String::from("Lorem ipsum dolor sit amet consectetur adipiscing elit"),
    };
    let tweet = Tweet { username: String::from("bob"), content: String::from("hot take") };

    println!("{}", article.summarize());  // overridden
    println!("{}", tweet.summarize());    // default: "(Read more from @bob...)"
}
```

---

## Trait Bounds on Functions

```rust
use std::fmt::{Display, Debug};

// Syntax 1: inline bound
fn notify(item: &impl Summary) {
    println!("Breaking: {}", item.summarize());
}

// Syntax 2: generic with bound (equivalent, more explicit)
fn notify_generic<T: Summary>(item: &T) {
    println!("Breaking: {}", item.summarize());
}

// Multiple bounds with +
fn notify_display<T: Summary + Display>(item: &T) {
    println!("{item}");     // uses Display
    println!("{}", item.summarize());  // uses Summary
}

// where clause — cleaner for complex bounds
fn complex_function<T, U>(t: &T, u: &U) -> String
where
    T: Display + Clone,
    U: Debug + Summary,
{
    format!("{t:?} {}", u.summarize())
}
```

---

## Generics — Writing Code Over Multiple Types

```rust
// Generic function — works for any T that implements PartialOrd
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// Generic struct
#[derive(Debug)]
struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Self { first, second }
    }
}

// Conditional implementation — only for T: Display + PartialOrd
impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.first >= self.second {
            println!("The largest member is first = {}", self.first);
        } else {
            println!("The largest member is second = {}", self.second);
        }
    }
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("largest: {}", largest(&numbers));  // 100

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("largest: {}", largest(&chars));    // y

    let pair = Pair::new(5, 10);
    pair.cmp_display();  // available because i32: Display + PartialOrd
}
```

---

## Monomorphization — Zero-Cost Generics

When you call `largest(&numbers)` and `largest(&chars)`, the compiler generates two separate concrete functions:

```rust
// What the compiler generates internally (conceptually):
fn largest_i32(list: &[i32]) -> &i32 { /* ... */ }
fn largest_char(list: &[char]) -> &char { /* ... */ }
```

This means generic code in Rust is **exactly as fast** as hand-written type-specific code. The generics are a compile-time convenience with zero runtime cost. The tradeoff: larger binary size (each instantiation is a separate function) and longer compile times.

---

## `impl Trait` — Return Position

```rust
// Return an impl Trait: caller knows the concrete type exists, but not what it is
// Useful for returning closures, iterators without naming their complex types
fn make_adder(x: i32) -> impl Fn(i32) -> i32 {
    move |y| x + y
}

fn doubles(v: &[i32]) -> impl Iterator<Item = i32> + '_ {
    v.iter().map(|&x| x * 2)  // complex iterator type — just say "impl Iterator"
}

fn main() {
    let add5 = make_adder(5);
    println!("{}", add5(3));  // 8

    for n in doubles(&[1, 2, 3]) {
        println!("{n}");  // 2, 4, 6
    }
}
```

`impl Trait` in return position is **static dispatch** — the concrete type is known at compile time and monomorphized. You cannot return different types from different code paths with `impl Trait`.

---

## The Orphan Rule

You can implement a trait for a type only if **either the trait or the type is defined in your crate**. This prevents conflicting implementations:

```rust
// OK: Display is foreign, Vec is foreign, but you cannot impl Display for Vec<T>
// because neither Display nor Vec is local to your crate.

// OK: local trait, foreign type
trait Printable { fn print(&self); }
impl Printable for i32 { fn print(&self) { println!("{self}"); } }  // OK

// OK: foreign trait, local type
struct MyStruct;
impl std::fmt::Display for MyStruct {  // OK
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "MyStruct")
    }
}

// NOT OK: both foreign (in a different crate)
// impl std::fmt::Display for Vec<i32> { ... }  // ERROR: orphan rule
```

---

## Blanket Implementations

A blanket implementation implements a trait for all types satisfying a bound. The standard library uses this extensively:

```rust
// std library implements ToString for ALL types that implement Display:
impl<T: Display> ToString for T {
    fn to_string(&self) -> String {
        format!("{self}")
    }
}
// This means any Display type automatically gets .to_string() for free.
```

---

## Common Standard Traits to Know

| Trait | Purpose |
|-------|---------|
| `Display` | `{}` formatting — human-readable |
| `Debug` | `{:?}` formatting — developer-readable |
| `Clone` | `.clone()` — explicit deep copy |
| `Copy` | Implicit copy on assignment (stack types) |
| `PartialEq` / `Eq` | `==` and `!=` operators |
| `PartialOrd` / `Ord` | `<`, `>`, comparison, sorting |
| `Hash` | HashMap/HashSet key |
| `Default` | `T::default()` constructor |
| `From` / `Into` | Type conversions |
| `Iterator` | Lazy sequence |
| `Drop` | Custom destructor |
| `Deref` / `DerefMut` | Smart pointer dereference |
| `Send` / `Sync` | Thread safety markers |

---

## Common Pitfalls

- **Trait coherence / orphan rule** — you can't implement `Display` for `Vec<i32>`. The workaround is the newtype pattern: wrap in a local struct `struct MyVec(Vec<i32>)` and implement Display for that.
- **`impl Trait` vs `dyn Trait`** — `impl Trait` is static dispatch (monomorphized), `dyn Trait` is dynamic dispatch (vtable). You can't store heterogeneous `impl Trait` in a `Vec` — use `Vec<Box<dyn Trait>>` for that.
- **Trait objects and object safety** — not every trait can be used as `dyn Trait`. Traits with methods that return `Self` or have generic methods are not object-safe.
- **Forgetting `where` clause readability** — deeply nested bounds inline are hard to read. Move to `where` clause when you have more than one bound per parameter.

---

## Review Questions

1. What is monomorphization? What is the performance benefit, and what is the tradeoff?
2. Explain the orphan rule. Why does it exist, and what is the workaround when you need to implement a foreign trait for a foreign type?
3. What is the difference between `fn foo(item: &impl Summary)` and `fn foo<T: Summary>(item: &T)`? Are they exactly equivalent?
4. A function signature `fn returns_adder() -> impl Fn(i32) -> i32` returns a closure. Could it alternatively return two different closures from an `if/else`? Why or why not? What would you use instead?

---

#Rust #traits #generics #polymorphism #monomorphization
