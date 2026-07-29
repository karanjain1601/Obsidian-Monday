---
title: Rust Modules and Crates
aliases: [Rust Modules, Rust Crates, Cargo Workspaces, Rust Visibility, crates.io]
tags: [Rust, modules, crates, cargo, workspace, visibility]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Rust_Overview]]"
  - "[[Cargo_and_Toolchain]]"
  - "[[Rust_Error_Handling]]"
status: complete
---

# Rust Modules and Crates

> [!abstract] TL;DR
> Rust's module system controls code organization and visibility. A **crate** is the compilation unit (binary or library). **Modules** organize code within a crate. Visibility defaults to private — `pub` opts into public access with fine-grained control (`pub(crate)`, `pub(super)`). Cargo manages dependencies via `Cargo.toml`, and Cargo workspaces let multiple crates share a build cache and common dependencies.

---

## Intuition

Rust's module system is deliberately conservative: everything is private by default. This forces you to design a clear public API surface — users of your library only see what you explicitly expose. The path system (`::`) is how you navigate this hierarchy: `std::collections::HashMap` means "in the `std` crate, in the `collections` module, the `HashMap` type."

---

## Crates — The Compilation Unit

A crate is either a **binary** (has a `main` function, compiled to an executable) or a **library** (compiled to a `.rlib` / `.so` for use by other crates). One package can have multiple binaries but typically one library.

```
my-project/
├── Cargo.toml
├── src/
│   ├── main.rs        ← binary crate root (for binaries)
│   ├── lib.rs         ← library crate root (if also a library)
│   └── bin/
│       ├── tool1.rs   ← additional binary
│       └── tool2.rs   ← another binary
```

---

## Modules — Organizing Code

```rust
// src/lib.rs

// Inline module
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("added to waitlist");
        }

        fn seat_at_table() {}  // private — not pub
    }

    mod serving {
        fn take_order() {}
        fn serve_order() {}
    }
}

// Using pub use to re-export — creates a clean public API
pub use front_of_house::hosting;

pub fn eat_at_restaurant() {
    // Absolute path — starts from crate root
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path — from current module
    front_of_house::hosting::add_to_waitlist();

    // With use import (brought into scope)
    use front_of_house::hosting;
    hosting::add_to_waitlist();
}
```

### Visibility Modifiers

| Modifier | Meaning |
|----------|---------|
| (none) | Private to current module and its descendants |
| `pub` | Public — visible everywhere |
| `pub(crate)` | Visible anywhere within the same crate |
| `pub(super)` | Visible to parent module |
| `pub(in path)` | Visible to specific ancestor module |

```rust
mod parent {
    pub(crate) fn crate_visible() {}   // visible anywhere in this crate
    pub(super) fn parent_visible() {}  // visible only in parent module

    mod child {
        fn internal() {}
        pub fn public_child() {
            super::parent_visible();   // OK — child can see parent's pub(super)
        }
    }
}
```

---

## Modules in Files

For larger projects, move modules into separate files:

```
src/
├── main.rs
├── lib.rs
├── front_of_house.rs       ← module in its own file
└── front_of_house/
    ├── hosting.rs           ← submodule
    └── serving.rs           ← submodule
```

```rust
// src/lib.rs — declares the module (loads src/front_of_house.rs)
pub mod front_of_house;

// src/front_of_house.rs — declares submodules
pub mod hosting;  // loads src/front_of_house/hosting.rs
mod serving;

// src/front_of_house/hosting.rs
pub fn add_to_waitlist() { println!("added"); }
```

---

## use — Importing Paths

```rust
use std::collections::HashMap;
use std::collections::{HashMap, HashSet, BTreeMap};  // group imports
use std::collections::*;   // glob import (discouraged — pollutes namespace)
use std::fmt::{self, Display};  // self = std::fmt itself

// Alias conflicting names
use std::fmt::Result as FmtResult;
use std::io::Result as IoResult;

// pub use — re-export (make something available from your crate's public API)
pub use crate::front_of_house::hosting::add_to_waitlist;

fn main() {
    let mut map = HashMap::new();  // no need to write std::collections::HashMap
    map.insert("key", 42);
}
```

---

## Cargo.toml — Dependency Management

```toml
[package]
name = "my-web-app"
version = "0.1.0"
edition = "2021"
authors = ["Alice <alice@example.com>"]
description = "A web application"
license = "MIT"

[dependencies]
# Version requirements
serde = "1.0"              # compatible with 1.0.x (^1.0)
tokio = "1"                # any 1.x version
reqwest = "=0.12.0"        # exactly this version
rand = ">=0.8, <0.9"       # range

# With features
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }

# Optional dependency (enabled by a feature flag)
sqlx = { version = "0.8", features = ["runtime-tokio", "postgres"], optional = true }

# Git dependency (use sparingly)
# my_lib = { git = "https://github.com/user/repo", branch = "main" }

# Path dependency (local development)
# my_local = { path = "../my-local-crate" }

[dev-dependencies]
# Only available for tests and examples — not in production binary
mockall = "0.13"
proptest = "1.0"
criterion = "0.5"

[features]
default = []
postgres = ["sqlx"]          # enables sqlx when postgres feature is requested
full = ["postgres"]

[profile.release]
opt-level = 3
lto = true                   # link-time optimization — smaller, faster binary
codegen-units = 1            # single unit — slower compile, better optimization
strip = true                 # strip debug symbols from release binary
```

---

## Cargo Workspaces

A workspace lets multiple crates share a build cache, lock file, and common dependencies. Typical for large projects with multiple binaries and a shared library.

```
my-workspace/
├── Cargo.toml          ← workspace root
├── Cargo.lock          ← single lock file for the whole workspace
├── core/               ← shared library crate
│   ├── Cargo.toml
│   └── src/lib.rs
├── server/             ← binary crate
│   ├── Cargo.toml
│   └── src/main.rs
└── cli/                ← another binary crate
    ├── Cargo.toml
    └── src/main.rs
```

```toml
# my-workspace/Cargo.toml
[workspace]
members = ["core", "server", "cli"]

# Share a dependency version across all workspace members
[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
```

```toml
# server/Cargo.toml
[package]
name = "server"
version = "0.1.0"
edition = "2021"

[dependencies]
core = { path = "../core" }
serde = { workspace = true }   # inherit from workspace
```

```bash
# Build all workspace crates
cargo build

# Run a specific workspace binary
cargo run -p server

# Test all workspace crates
cargo test --workspace
```

---

## Publishing to crates.io

```bash
# Login with your API token from crates.io
cargo login <token>

# Check what will be published (dry run)
cargo publish --dry-run

# Publish the crate
cargo publish
```

```toml
# Required fields for publishing:
[package]
name = "my-unique-crate-name"
version = "0.1.0"
edition = "2021"
description = "A brief description (required)"
license = "MIT OR Apache-2.0"   # SPDX identifier
repository = "https://github.com/user/repo"
readme = "README.md"
keywords = ["networking", "async"]   # up to 5
categories = ["network-programming"] # from crates.io list
```

---

## Common Pitfalls

- **Private by default surprises** — a struct field not marked `pub` is inaccessible from other modules even if the struct itself is `pub`. You need `pub` on both the struct and each field you want visible.
- **Circular dependencies** — Rust crates cannot have circular dependencies. If two modules in the same crate need each other, they can (modules within a crate don't have this restriction), but two separate crates cannot.
- **`use` is local to the current scope** — a `use` statement in a function doesn't leak to the module level. Use it at the top of the file for module-wide imports.
- **Workspace vs package confusion** — a "workspace" is a group of packages. A "package" contains one or more "crates." These terms are often conflated.
- **`pub use` for API design** — library authors use `pub use` to flatten the internal module hierarchy for users. Internal restructuring doesn't break the public API.

---

## Review Questions

1. What is the difference between a crate and a module? Can a package have multiple crates?
2. You have `pub struct Config { host: String, port: u16 }` in `src/config.rs`. From another module, you call `let c = Config { host: ..., port: ... }`. This fails. Why, and how do you fix it?
3. What does `pub use crate::module::Type` achieve? Give a concrete example of when this improves a library's API ergonomics.
4. What is a Cargo workspace? What is shared between workspace members, and what is separate per crate?

---

#Rust #modules #crates #cargo #workspace #visibility
