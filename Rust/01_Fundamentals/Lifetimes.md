---
title: Lifetimes
aliases: [Rust Lifetimes, Lifetime Annotations, Lifetime Elision, Static Lifetime]
tags: [Rust, fundamentals, lifetimes, borrow-checker, memory-safety]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Ownership_and_Borrowing]]"
  - "[[Structs_and_Methods]]"
  - "[[Traits_and_Generics]]"
  - "[[Rust_Functions_and_Closures]]"
status: complete
---

# Lifetimes

> [!abstract] TL;DR
> Lifetimes are the borrow checker's way of tracking how long a reference is valid relative to the data it points to. They are **not** about runtime duration — they are compile-time labels that let the compiler verify no reference outlives its referent. Most lifetimes are inferred (elided); you only annotate them when the compiler can't figure it out, typically when a function returns a reference and the compiler can't determine which input it came from.

---

## Intuition

Lifetimes are not a runtime concept. No lifetime information exists at runtime — it is entirely erased after compilation. Lifetimes are annotations that let you communicate your intent to the borrow checker: "this returned reference is valid for as long as this input reference is valid."

Think of lifetime annotations as **constraints** on scopes, not as timers. `'a` doesn't mean "lives for 'a milliseconds" — it means "this reference must be valid for at least as long as scope 'a".

The classic case: a function that returns one of two input references. The compiler needs to know: if I return this reference, does it come from the first parameter, the second, or either? Without that information, it cannot verify that the caller doesn't use the return value after one of the inputs is dropped.

---

## What Problem Lifetimes Solve

```rust
// This fails: the compiler cannot determine the lifetime of the return value
fn longest_broken(s1: &str, s2: &str) -> &str {
    if s1.len() > s2.len() { s1 } else { s2 }
    // Is the return tied to s1, s2, or either? The compiler cannot tell.
    // ERROR: missing lifetime specifier
}

// The fix: tell the compiler "return lives as long as the shorter of s1 and s2"
fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s1.len() > s2.len() { s1 } else { s2 }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("longest: {result}");  // OK — result used within s2's scope
    }
    // println!("{result}");  // ERROR — s2 is dropped, result might point to it
}
```

---

## Lifetime Annotation Syntax

Lifetime names start with an apostrophe: `'a`, `'b`, `'c`. By convention, single lowercase letters are used. The annotation goes **after** the `&`:

```rust
&i32          // a reference (no annotation, usually elided)
&'a i32       // a reference with explicit lifetime 'a
&'a mut i32   // a mutable reference with explicit lifetime 'a

fn example<'a>(x: &'a str) -> &'a str { x }
//          ^^ declare the lifetime parameter
//                  ^^ the input uses lifetime 'a
//                              ^^ the output uses the same lifetime 'a
```

The annotation says: "the returned reference will be valid for at least as long as the input reference `x`."

Lifetime annotations **do not change** how long a reference lives — they just document the relationship so the borrow checker can verify it.

---

## Lifetime Elision Rules

In practice, you rarely write lifetimes because the compiler infers them using **elision rules** — patterns so common they are built into the language:

**Rule 1 (Input lifetimes):** Each reference parameter gets its own distinct lifetime.
```rust
fn foo(x: &str) -> &str           // becomes: fn foo<'a>(x: &'a str) -> &'a str
fn bar(x: &str, y: &str) -> &str  // becomes: fn bar<'a, 'b>(x: &'a str, y: &'b str) -> ???
                                   // cannot elide — compiler doesn't know which input
```

**Rule 2 (Method input):** If there is exactly one input reference, the output gets that lifetime.
```rust
fn first_word(s: &str) -> &str  // single input → output gets same lifetime — elision works
```

**Rule 3 (Method output):** If one of the inputs is `&self` or `&mut self`, the output gets the self lifetime.
```rust
impl Struct {
    fn method(&self) -> &str  // output gets lifetime of &self — elision works
}
```

```rust
// These are equivalent due to elision:
fn first_word(s: &str) -> &str { /* ... */ }
fn first_word<'a>(s: &'a str) -> &'a str { /* ... */ }

// But this requires explicit annotation (two inputs, not just self):
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str { /* ... */ }
```

---

## Lifetimes in Structs

When a struct holds a reference, it must carry a lifetime annotation to ensure the struct doesn't outlive the data it references:

```rust
// This struct holds a reference to a string slice
// 'a says: the struct cannot outlive the &str it holds
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 { 3 }

    // This method elides: output borrows from &self
    fn announce(&self, announcement: &str) -> &str {
        println!("Attention: {announcement}");
        self.part  // output lifetime = &self's lifetime (elision rule 3)
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence;
    {
        // ImportantExcerpt holds a reference into `novel`
        let excerpt = ImportantExcerpt {
            part: novel.split('.').next().unwrap(),
        };
        first_sentence = excerpt.part;
        // excerpt is dropped here, but the reference is into `novel`, not `excerpt`
    }
    println!("{first_sentence}");  // OK — `novel` is still alive
}
```

---

## The 'static Lifetime

`'static` means the reference is valid for the **entire program lifetime**. String literals have `'static` lifetime because they are compiled into the binary:

```rust
// String literals live in the binary's data segment — they're always valid
let s: &'static str = "hello";

// Functions returning &'static str are always safe to return — no dangling
fn greeting() -> &'static str {
    "Hello, World!"
}

// Common in error messages and constants
const ERROR_MSG: &str = "something went wrong";  // implicitly 'static
```

Be cautious with `'static` bounds on generic parameters — `T: 'static` means T contains no non-`'static` references, not that it lives forever. Owned types like `String` satisfy `T: 'static` because they don't borrow from anything.

---

## Lifetime Subtyping

`'long: 'short` means `'long` outlives `'short`. The longer lifetime is a subtype of the shorter one (can be used where the shorter is expected):

```rust
fn longest_with_announcement<'a, 'b>(
    x: &'a str,
    y: &'a str,
    ann: &'b str,  // 'b is independent — announcement can have any lifetime
) -> &'a str {
    println!("Today's announcement: {ann}");
    if x.len() > y.len() { x } else { y }
}
```

---

## Combining Lifetime and Generic Bounds

```rust
use std::fmt::Display;

// Generic T with both a trait bound AND a lifetime is common in libraries
fn longest_with_display<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where
    T: Display,
{
    println!("Announcement: {ann}");
    if x.len() > y.len() { x } else { y }
}
```

---

## Common Pitfalls

- **Lifetimes are NOT runtime** — never think "this reference lives for 5 milliseconds." Lifetimes are purely about which scope a reference is derived from.
- **Overly strict lifetime annotations** — annotating separate input lifetimes as the same `'a` when they don't need to be constrains the caller unnecessarily. Each input can often have its own lifetime.
- **`'static` as a cure-all** — reaching for `'static` bounds everywhere avoids lifetime problems but forces either string literals or `Arc`/owned types. It's a valid pattern for some cases (trait objects that must be sent across threads) but should be intentional.
- **Lifetime in struct fields** — a struct with a reference field is often a design smell. Consider whether the struct should own the data (use `String` instead of `&str`) or whether the struct is purely a temporary view.
- **NLL makes many old patterns work** — pre-2018 Rust had many false-positive borrow errors. If you see old code with complex lifetime annotations, try it with edition 2021 first — NLL may have already fixed it.

---

## Review Questions

1. `fn first_word(s: &str) -> &str` compiles without lifetime annotations. Explain which of the three elision rules applies and write out the explicit lifetime version.
2. Why does `fn longest(s1: &str, s2: &str) -> &str` fail to compile? What exactly does adding `<'a>` annotations tell the compiler that resolves the error?
3. You have `struct Config { path: &str }`. Why does this fail to compile? Rewrite it with the correct lifetime annotation and explain what `'a` means in that context.
4. What does `T: 'static` mean as a trait bound? Does it mean T must live for the entire program? Give an example of a type that satisfies `T: 'static` without being a `&'static str`.

---

#Rust #fundamentals #lifetimes #borrow-checker #memory-safety
