---
title: Rust Macros
aliases: [Rust macro_rules, Rust procedural macros, Rust derive macros, Rust metaprogramming]
tags: [Rust, macros, metaprogramming, macro_rules, derive, procedural-macros]
domain: Rust
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Traits_and_Generics]]"
  - "[[Structs_and_Methods]]"
  - "[[Rust_Serde]]"
  - "[[Rust_Testing]]"
status: complete
---

# Rust Macros

> [!abstract] TL;DR
> Rust has two macro systems: declarative macros (`macro_rules!`) expand pattern-matched syntax at compile time; procedural macros manipulate the AST as Rust code. `#[derive]` macros auto-generate trait implementations from struct definitions. Common macros (`vec!`, `println!`, `assert!`, `dbg!`) are built-in. Procedural macros live in their own crate — Rust enforces this to control compilation order.

---

## Intuition

Macros operate on Rust **syntax** before the compiler processes it fully — they are a form of code generation. Unlike C preprocessor macros (text substitution), Rust macros are **hygienic**: variables introduced inside a macro don't accidentally clash with variables in the calling code. `macro_rules!` is pattern matching over token trees; procedural macros are Rust programs that receive a token stream and produce one.

The key use cases:
- **Code generation** — write once, generate for many types (`#[derive(Debug)]`)
- **DSLs** — `vec![1,2,3]`, SQL query validation, HTML templates
- **Variadic behavior** — `println!` accepts any number of format arguments

---

## Declarative Macros — macro_rules!

`macro_rules!` matches patterns of tokens and expands to replacement code. Each rule is `(pattern) => { expansion }`.

```rust
// Simple macro — replaces say_hello!() with println!
macro_rules! say_hello {
    () => {
        println!("Hello, world!");
    };
}

// Macro with arguments
macro_rules! create_function {
    ($name:ident) => {
        fn $name() {
            println!("You called {:?}", stringify!($name));
        }
    };
}

create_function!(foo);   // generates: fn foo() { println!("You called \"foo\""); }
create_function!(bar);   // generates: fn bar() { ... }

// Multiple patterns (like match arms)
macro_rules! print_item {
    ($val:expr) => {
        println!("{:?}", $val);
    };
    ($label:literal, $val:expr) => {
        println!("{}: {:?}", $label, $val);
    };
}

fn main() {
    say_hello!();
    foo();
    bar();
    print_item!(42);                  // 42
    print_item!("answer", 42);       // answer: 42
}
```

### Fragment Specifiers

| Specifier | Matches |
|-----------|---------|
| `expr` | Any Rust expression |
| `stmt` | A statement |
| `ident` | An identifier |
| `ty` | A type |
| `pat` | A pattern |
| `literal` | A literal value |
| `tt` | A single token tree |
| `block` | A block `{ ... }` |
| `item` | An item (fn, struct, impl, etc.) |
| `meta` | Attribute content |
| `lifetime` | A lifetime like `'a` |

---

## Variadic Macros — Repetition Patterns

```rust
// Recreate vec! macro
macro_rules! my_vec {
    // Base case: empty
    () => {
        Vec::new()
    };
    // Variadic: one or more elements
    ($($element:expr),+ $(,)?) => {{
        let mut v = Vec::new();
        $(v.push($element);)+   // repeat for each element
        v
    }};
}

// Map literal macro
macro_rules! hashmap {
    ($($key:expr => $value:expr),* $(,)?) => {{
        let mut map = std::collections::HashMap::new();
        $(map.insert($key, $value);)*
        map
    }};
}

fn main() {
    let v = my_vec![1, 2, 3, 4];
    let m = hashmap! {
        "one"   => 1,
        "two"   => 2,
        "three" => 3,
    };
    println!("{:?}", v);  // [1, 2, 3, 4]
    println!("{:?}", m);  // {"one": 1, "two": 2, "three": 3}
}
```

---

## Procedural Macros

Procedural macros are more powerful — they receive a `TokenStream` (the input code) and return a `TokenStream` (the generated code). They must live in a separate crate with `proc-macro = true` in `Cargo.toml`.

Three types:
1. **Custom derive** — `#[derive(MyTrait)]`
2. **Attribute macros** — `#[my_attribute]` on any item
3. **Function-like macros** — `my_macro!(...)` with full token manipulation

### Example: Custom Derive Macro

```toml
# proc_macros/Cargo.toml
[lib]
proc-macro = true

[dependencies]
syn = { version = "2", features = ["full"] }
quote = "1"
proc-macro2 = "1"
```

```rust
// proc_macros/src/lib.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Parse the input as a Rust data structure
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    // Generate new code using quote!
    let expanded = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };

    TokenStream::from(expanded)
}
```

```rust
// Usage in your crate:
use hello_macro::HelloMacro;
use proc_macros::HelloMacro;   // the derive macro

#[derive(HelloMacro)]
struct Pancakes;

fn main() {
    Pancakes::hello_macro();  // "Hello, Macro! My name is Pancakes!"
}
```

---

## Built-in Macros Reference

```rust
fn main() {
    // println! / eprintln! / print! / eprint! — formatted output
    println!("{name} is {age}", name = "Alice", age = 30);
    eprintln!("Error: {}", some_error);  // to stderr

    // format! — create a String without printing
    let s = format!("{:>10}", "right");  // right-align in 10 chars

    // vec! — create a Vec
    let v: Vec<i32> = vec![0; 10];  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    // assert! / assert_eq! / assert_ne! — panic in tests/production checks
    assert!(1 + 1 == 2);
    assert_eq!(2 + 2, 4, "math is broken");
    assert_ne!(1, 2);

    // dbg! — debug print with file/line info, returns value
    let a = dbg!(2 + 3);  // [src/main.rs:5] 2 + 3 = 5   (printed to stderr)
    // a == 5 — dbg! returns the value

    // todo! / unimplemented! / unreachable! — compile stubs
    fn not_done_yet() -> i32 { todo!("implement later") }
    fn dead_code_path(n: u32) -> &'static str {
        match n {
            0 => "zero",
            _ => unreachable!("n is always 0 here"),
        }
    }

    // panic! — immediately terminate with a message
    if false { panic!("this would crash: {}", "reason"); }

    // include_str! — embed a file as &str at compile time
    const TEMPLATE: &str = include_str!("../templates/index.html");

    // env! — read an environment variable at compile time
    let version = env!("CARGO_PKG_VERSION");  // "0.1.0"
    let profile = option_env!("CUSTOM_VAR").unwrap_or("default");

    // concat! — join string literals at compile time
    const GREETING: &str = concat!("Hello", ", ", "World!");

    // stringify! — convert tokens to a string at compile time
    let code_str = stringify!(1 + 2);  // "1 + 2"

    // matches! — pattern matching as a boolean expression
    let x = 42;
    let is_small = matches!(x, 1..=10);   // false

    // cfg! — compile-time conditional check (not the same as #[cfg] attribute)
    if cfg!(debug_assertions) {
        println!("debug build");
    }
}
```

---

## When to Use Macros

| Situation | Use macro? | Reason |
|-----------|-----------|--------|
| Generate trait implementations | Yes (`macro_rules!` or derive) | Avoids boilerplate per type |
| Variadic arguments | Yes | Functions have fixed parameter counts |
| Build a DSL (SQL, HTML) | Yes (proc macro) | Type-checked at compile time |
| Code generation from external data | Yes (proc macro with `include!`) | Config files → Rust types |
| Simple code reuse | No — use a function | Functions are simpler and debuggable |
| Runtime polymorphism | No — use traits | Traits are clearer and composable |

---

## Common Pitfalls

- **`macro_rules!` hygiene is imperfect** — macros declared with `macro_rules!` are hygienic for local variables but NOT for items (structs, functions, enums). Define items inside macros carefully.
- **Recursive macros need a base case** — like recursive functions. Without a terminating base pattern, the compiler panics with "recursion limit exceeded."
- **Procedural macros compile separately** — they run at compile time in their own process. Panicking in a proc macro gives a confusing "proc macro panicked" error — add good error messages with `syn::Error`.
- **`dbg!()` in production** — `dbg!` writes to stderr. Fine for debugging, but should be removed before production deployments.
- **Proc macro crates must only export macros** — a crate with `proc-macro = true` can only export procedural macros. Create a separate "helper" crate for shared logic.

---

## Review Questions

1. What is the difference between `macro_rules!` and procedural macros? When would you use each?
2. Write a `macro_rules!` macro `max!` that takes two expressions and returns the larger one. How do you handle the case where the first argument needs to be evaluated only once?
3. Why does `dbg!(expensive_fn())` evaluate `expensive_fn()` exactly once rather than twice? (Hint: think about what `dbg!` expands to.)
4. What makes a procedural derive macro different from a `macro_rules!` macro? What crates are typically used to write a custom derive?

---

#Rust #macros #metaprogramming #macro_rules #derive #procedural-macros
