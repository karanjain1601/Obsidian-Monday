---
title: Ownership and Borrowing
aliases: [Rust Ownership, Rust Borrow Checker, Rust References, Rust Slices, Move Semantics]
tags: [Rust, fundamentals, ownership, borrowing, memory-safety, borrow-checker]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Lifetimes]]"
  - "[[Rust_Types_and_Variables]]"
  - "[[Smart_Pointers]]"
  - "[[Rust_Threads]]"
  - "[[Structs_and_Methods]]"
status: complete
---

# Ownership and Borrowing

> [!abstract] TL;DR
> Ownership is Rust's core memory management system: every value has exactly one owner, and the value is dropped (freed) when the owner goes out of scope. Borrowing lets you use a value without taking ownership via references (`&T` for shared, `&mut T` for exclusive). The borrow checker enforces one invariant at compile time: you can have **either** any number of shared references **or** exactly one mutable reference — never both at the same time.

---

## Intuition

Imagine a book in a library. **Ownership** is like buying the book — you own it, you decide when to throw it away (drop). **Borrowing** is like lending it: you can lend it to many people to read simultaneously (`&T` — shared immutable borrow), or you can lend it to one person to annotate (`&mut T` — exclusive mutable borrow), but you can't do both at once. Once the borrow is over, the lender gets the book back.

This model eliminates:
- **Use after free** — the owner always drops the value at scope end; no pointer can outlive it
- **Double free** — only one owner; drop runs exactly once
- **Data races** — exclusive access for mutation means no two threads can modify the same data simultaneously

---

## The Three Ownership Rules

1. Each value in Rust has exactly one **owner** (variable)
2. There can only be one owner at a time
3. When the owner goes out of scope, the value is **dropped** (memory freed)

```rust
fn main() {
    {
        let s = String::from("hello");  // s owns the String — heap allocated
        // ... use s
    }   // s goes out of scope here: drop(s) is called automatically
    // Memory for "hello" is freed — no GC, no manual free()
}
```

---

## Move Semantics

When you assign a non-`Copy` value to another variable, ownership is **moved** — the original variable is invalidated.

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;   // ownership MOVES from s1 to s2
    // s1 is now invalid — Rust prevents use-after-move
    // println!("{s1}"); // ERROR: use of moved value: `s1`

    println!("{s2}");  // works — s2 owns the string

    // Passing to a function also moves ownership
    let s3 = String::from("world");
    takes_ownership(s3);   // s3 moves into the function
    // println!("{s3}");   // ERROR: s3 was moved

    // Returning from a function gives ownership back
    let s4 = gives_ownership();
    println!("{s4}");  // s4 owns the returned String
}

fn takes_ownership(s: String) {
    println!("{s}");
    // s is dropped here — memory freed
}

fn gives_ownership() -> String {
    String::from("mine")  // caller gets ownership
}
```

### Clone — Explicit Deep Copy

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();   // explicit deep copy — both s1 and s2 are valid
    println!("{s1} {s2}"); // works

    // Clone is potentially expensive — it allocates new heap memory.
    // Use references instead whenever possible.
}
```

### Copy Types — Stack Duplication

Types that implement `Copy` are duplicated automatically on assignment (no move):

```rust
fn main() {
    let x = 5;
    let y = x;   // x is COPIED — both x and y are valid
    println!("{x} {y}");  // 5 5

    // Copy types: i32, u32, f64, bool, char, tuples of Copy types
    // Non-Copy: String, Vec<T>, Box<T>, any type containing heap data
}
```

---

## Borrowing — References

Borrowing lets you use a value without taking ownership. A reference is like a pointer that is guaranteed to point to valid data.

```rust
fn main() {
    let s = String::from("hello");

    // Shared (immutable) reference — borrows s, s is still the owner
    let len = calculate_length(&s);  // pass reference
    println!("{s} has {len} chars");  // s is still usable

    // Mutable reference — exclusive access
    let mut s2 = String::from("hello");
    change(&mut s2);
    println!("{s2}");  // hello, world
}

fn calculate_length(s: &String) -> usize {
    s.len()
    // s is a reference — it is NOT dropped here, because it doesn't own the data
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

---

## The Borrow Rules (Enforced at Compile Time)

**Rule 1:** You can have any number of shared (`&T`) references, OR exactly one mutable (`&mut T`) reference — **never both simultaneously**.

**Rule 2:** References must always be valid (no dangling references).

```rust
fn main() {
    let mut s = String::from("hello");

    // Multiple shared references — OK
    let r1 = &s;
    let r2 = &s;
    println!("{r1} {r2}");  // both used here — both valid

    // After last use of r1 and r2, they are "released" (NLL: Non-Lexical Lifetimes)
    let r3 = &mut s;  // OK — r1 and r2 are no longer in use
    println!("{r3}");

    // Mixing shared and mutable — COMPILE ERROR
    let r4 = &s;
    let r5 = &mut s;  // ERROR: cannot borrow as mutable because it is also borrowed as immutable
    // println!("{r4} {r5}");
}
```

### Non-Lexical Lifetimes (NLL)

Since Rust 2018, the borrow checker uses **Non-Lexical Lifetimes** — a reference's lifetime ends at its last use, not at the end of the enclosing scope. This removes many false positives:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;          // borrow starts
    println!("{r1}");     // last use of r1 — borrow ENDS here (NLL)

    let r2 = &mut s;      // OK — r1 is no longer active
    println!("{r2}");
}
```

---

## Dangling References — Prevented at Compile Time

```rust
fn dangle() -> &String {   // ERROR: missing lifetime specifier
    let s = String::from("hello");
    &s   // s is dropped when this function returns — &s would dangle
    // Rust's borrow checker prevents this from compiling
}

// Correct: return the String itself (transfer ownership)
fn no_dangle() -> String {
    let s = String::from("hello");
    s   // ownership is moved to the caller
}
```

---

## Slices — Reference to a Contiguous Sequence

A slice is a reference to a portion of a collection. It does not own data.

```rust
fn main() {
    let s = String::from("hello world");

    // String slices — &str
    let hello: &str = &s[0..5];   // "hello"
    let world: &str = &s[6..11];  // "world"
    let all:   &str = &s[..];     // entire string

    println!("{hello} {world}");

    // Function taking a string slice (preferred over &String — more general)
    let word = first_word(&s);
    // s.clear();  // ERROR: can't mutate s while word borrows it
    println!("{word}");

    // Array slices
    let a = [1, 2, 3, 4, 5];
    let slice: &[i32] = &a[1..3];   // [2, 3]
    println!("{:?}", slice);
}

// &str works for both String slices and string literals — prefer &str over &String
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[..i];
        }
    }
    &s[..]
}
```

---

## Stack vs Heap — Why It Matters

```
Stack                   Heap
─────────────────────   ─────────────────────────
Fixed-size at compile   Dynamic size at runtime
Fast allocation (SP)    Slower (malloc/free equivalent)
Automatic cleanup       Explicit management (Rust: ownership)
Local variables         String, Vec, Box, Rc, etc.

let x: i32 = 5          → stored on stack (4 bytes, value directly there)
let s = String::from    → stack stores (ptr, len, capacity)
    ("hello")             heap stores the actual bytes "hello"
```

When ownership of `s` ends, Rust calls the `Drop` trait implementation for `String`, which frees the heap allocation — equivalent to `free(ptr)` in C, but automatically inserted at exactly the right place.

---

## Common Pitfalls

- **Mutating through a shared reference** — you cannot modify data through `&T`. The borrow checker enforces this. Use `&mut T` explicitly.
- **Holding a mutable borrow too long** — if you hold `&mut s` and try to read `s`, you get a compile error. In Rust 2018+ (NLL), borrows end at last use, not scope end — restructure to use the borrow earlier.
- **Returning references to local variables** — this always fails. Either return an owned type, or use lifetimes to prove the reference is valid.
- **Clone addiction** — beginners often `.clone()` everything to appease the borrow checker. This works but is often unnecessary. Think about whether a reference would suffice.
- **`&String` vs `&str`** — function parameters should take `&str`, not `&String`. `&String` coerces to `&str` automatically (Deref coercion), but `&str` also accepts string literals and slices directly.

---

## Review Questions

1. Draw the stack/heap layout when `let s = String::from("hello")` is executed. What happens when `s` goes out of scope?
2. Explain why this code fails: `let r1 = &mut s; let r2 = &mut s; println!("{r1} {r2}");`. What specific rule does it violate?
3. Why does Rust prevent dangling references at compile time? Describe the mechanism without mentioning "the compiler won't allow it" — explain the ownership rule that makes it impossible.
4. You have a function `fn longest(s1: &str, s2: &str) -> &str`. Why won't this compile without lifetime annotations? What would the correct signature look like?

---

#Rust #fundamentals #ownership #borrowing #memory-safety #borrow-checker
