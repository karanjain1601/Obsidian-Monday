---
title: Trait Objects and Dynamic Dispatch
aliases: [Rust dyn Trait, Rust vtable, Rust dynamic dispatch, Object Safety, dyn Any]
tags: [Rust, trait-objects, dynamic-dispatch, dyn, vtable, polymorphism]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Traits_and_Generics]]"
  - "[[Smart_Pointers]]"
  - "[[Rust_Error_Handling]]"
  - "[[Iterators_and_Functional_Patterns]]"
status: complete
---

# Trait Objects and Dynamic Dispatch

> [!abstract] TL;DR
> `dyn Trait` enables runtime polymorphism — a pointer to any type that implements the trait, resolved via a vtable at runtime. `Box<dyn Trait>` is the idiom for heap-owned trait objects. Unlike generics (monomorphized at compile time), `dyn Trait` has a small runtime overhead per call but enables heterogeneous collections and runtime-determined behavior. Not all traits are "object safe" — traits with methods returning `Self` or with generic parameters cannot be used as `dyn Trait`.

---

## Intuition

Generics give you "compile-time polymorphism" — the compiler creates a separate version of the function for each concrete type. This is fast but creates larger binaries and requires knowing the type at compile time.

`dyn Trait` gives you "runtime polymorphism" — a fat pointer containing (1) a pointer to the data, (2) a pointer to a vtable (a table of function pointers for the trait methods). The method to call is looked up at runtime. This costs one extra pointer indirection per call, but it lets you store a `Vec<Box<dyn Animal>>` containing Dogs, Cats, and Snakes — types that don't share a common struct hierarchy.

---

## Static Dispatch vs Dynamic Dispatch

```rust
trait Drawable {
    fn draw(&self);
    fn area(&self) -> f64;
}

struct Circle { radius: f64 }
struct Square { side: f64 }

impl Drawable for Circle {
    fn draw(&self) { println!("drawing circle r={}", self.radius); }
    fn area(&self) -> f64 { std::f64::consts::PI * self.radius * self.radius }
}

impl Drawable for Square {
    fn draw(&self) { println!("drawing square s={}", self.side); }
    fn area(&self) -> f64 { self.side * self.side }
}

// STATIC DISPATCH — monomorphized, zero overhead
// T is resolved at compile time; generates separate machine code for each T
fn draw_static<T: Drawable>(shape: &T) {
    shape.draw();
}

// DYNAMIC DISPATCH — vtable lookup at runtime
// Works for any type implementing Drawable, resolved at runtime
fn draw_dynamic(shape: &dyn Drawable) {
    shape.draw();
}

fn main() {
    let c = Circle { radius: 5.0 };
    let s = Square { side: 3.0 };

    // Static dispatch — compiler generates draw_static::<Circle> and draw_static::<Square>
    draw_static(&c);
    draw_static(&s);

    // Dynamic dispatch — single function, runtime lookup
    draw_dynamic(&c);
    draw_dynamic(&s);

    // dyn Trait as a reference
    let shape: &dyn Drawable = &c;
    shape.draw();
}
```

---

## Box<dyn Trait> — Owned Trait Objects

`&dyn Trait` borrows the trait object. `Box<dyn Trait>` owns it (heap-allocated). Use `Box<dyn Trait>` when:
- The concrete type is not known at compile time (loaded from config, user input)
- You need to return different concrete types from a function
- You need to store heterogeneous types in a collection

```rust
// Returning different types from a function — impossible with `impl Trait`
fn make_shape(kind: &str) -> Box<dyn Drawable> {
    match kind {
        "circle" => Box::new(Circle { radius: 1.0 }),
        "square" => Box::new(Square { side: 2.0 }),
        _        => panic!("unknown shape"),
    }
}

// Heterogeneous collection — all shapes treated uniformly
fn main() {
    let shapes: Vec<Box<dyn Drawable>> = vec![
        Box::new(Circle { radius: 3.0 }),
        Box::new(Square { side: 4.0 }),
        Box::new(Circle { radius: 1.5 }),
    ];

    let total_area: f64 = shapes.iter().map(|s| s.area()).sum();
    println!("total area: {total_area:.2}");

    for shape in &shapes {
        shape.draw();
    }
}
```

---

## Fat Pointer Layout

A trait object `&dyn Trait` is a **fat pointer** — two machine words:

```
&dyn Drawable
┌──────────────────┬──────────────────┐
│  data ptr        │  vtable ptr      │
│  (→ Circle data) │  (→ vtable for   │
│                  │   Circle:Drawable)│
└──────────────────┴──────────────────┘

vtable for Circle:Drawable:
┌──────────────────────────────────────┐
│  size / align of Circle              │
│  drop_in_place (destructor)          │
│  draw          → Circle::draw        │
│  area          → Circle::area        │
└──────────────────────────────────────┘
```

Each method call on `&dyn Drawable` does: load vtable → load function pointer from vtable → call it. This is one extra indirection compared to a static dispatch call.

---

## Object Safety Rules

Not every trait can be used as `dyn Trait`. A trait is **object safe** if and only if:

1. All methods have `&self`, `&mut self`, or `self` as receiver (not generic dispatch or static)
2. No method returns `Self`
3. No method has generic type parameters

```rust
// Object SAFE — all methods have known dispatch
trait Printable {
    fn print(&self);
}

// NOT object safe — clone() returns Self
// dyn Clone is not allowed
trait MyClone {
    fn clone_self(&self) -> Self;  // returns Self — breaks object safety
}

// NOT object safe — generic method
trait Converter {
    fn convert<T>(&self) -> T;  // generic — breaks object safety
}

// Workaround: use associated types or box the return type
trait ObjectSafeClone {
    fn clone_boxed(&self) -> Box<dyn ObjectSafeClone>;  // box the return — object safe
}
```

---

## impl Trait vs dyn Trait

```rust
// impl Trait in parameter position — static dispatch sugar for generics
fn process1(item: &impl Drawable) { item.draw(); }
// equivalent to:
fn process2<T: Drawable>(item: &T) { item.draw(); }

// impl Trait in return position — static dispatch, concrete type unknown to caller
fn make_drawable_static() -> impl Drawable {
    Circle { radius: 1.0 }  // must return ONE concrete type
}

// dyn Trait in return position — dynamic dispatch, can return different types
fn make_drawable_dynamic(kind: &str) -> Box<dyn Drawable> {
    if kind == "circle" { Box::new(Circle { radius: 1.0 }) }
    else { Box::new(Square { side: 1.0 }) }
}

// Key rule: impl Trait = one concrete type at compile time
//           dyn Trait  = any type at runtime (heterogeneous, but costs vtable)
```

---

## dyn Any — Type Erasure and Downcasting

`std::any::Any` lets you erase a type and later downcast back:

```rust
use std::any::Any;

fn print_type_info(val: &dyn Any) {
    if let Some(s) = val.downcast_ref::<String>() {
        println!("It's a String: {s}");
    } else if let Some(n) = val.downcast_ref::<i32>() {
        println!("It's an i32: {n}");
    } else {
        println!("Unknown type");
    }
}

fn main() {
    let s: Box<dyn Any> = Box::new(String::from("hello"));
    let n: Box<dyn Any> = Box::new(42i32);

    print_type_info(s.as_ref());  // It's a String: hello
    print_type_info(n.as_ref());  // It's an i32: 42

    // Owned downcast
    let s: Box<dyn Any> = Box::new(String::from("world"));
    match s.downcast::<String>() {
        Ok(string) => println!("Got: {string}"),
        Err(_)     => println!("Downcast failed"),
    }
}
```

---

## Performance Comparison

| Aspect | `impl Trait` / Generics | `dyn Trait` |
|--------|------------------------|-------------|
| Method dispatch | Direct call (inlined by optimizer) | vtable lookup + indirect call |
| Inlining | Yes — optimizer can inline | No — indirect call prevents inlining |
| Binary size | Larger (separate copy per type) | Smaller (one implementation) |
| Heterogeneous collections | No (single type) | Yes (`Vec<Box<dyn Trait>>`) |
| Type known at compile time | Yes | No |
| Allocation | Stack possible | Heap (`Box`) usually required |

**Rule of thumb:** prefer `impl Trait` for performance-critical hot paths. Use `dyn Trait` for plugin systems, callbacks, heterogeneous collections, or when the type is determined at runtime.

---

## Common Pitfalls

- **`impl Trait` can't return different types** — `if cond { Circle } else { Square }` doesn't compile with `impl Drawable`. Use `Box<dyn Drawable>`.
- **Forgetting `Box` for owned trait objects** — `dyn Trait` is a fat pointer but it's unsized (the size isn't known). You need `Box<dyn Trait>` to own it or `&dyn Trait` to borrow it.
- **Object safety violations** — trying to use `Clone`, `Iterator::collect()`, or any trait with `Self` returns as `dyn` fails. Check object safety before building an architecture around `dyn`.
- **Downcasting fragility** — heavy use of `dyn Any` + downcasting is a code smell. It bypasses the type system. Consider whether a proper trait hierarchy solves the problem.

---

## Review Questions

1. What is a "fat pointer"? Draw the layout of `&dyn Drawable` and explain each field.
2. Why can `dyn Clone` not exist? What is the object safety rule it violates?
3. You have `fn returns_shape(big: bool) -> impl Drawable`. A colleague wants to return a `Circle` when big is true and a `Square` when false. Why doesn't this compile? Rewrite the signature to make it work.
4. When would you choose `Vec<Box<dyn Trait>>` over `Vec<ConcreteType>`? Describe a system design where `dyn Trait` is genuinely the right tool.

---

#Rust #trait-objects #dynamic-dispatch #dyn #vtable #polymorphism
