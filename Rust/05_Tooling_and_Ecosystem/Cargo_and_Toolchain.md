---
title: Cargo and Toolchain
aliases: [cargo fmt, cargo clippy, cargo test, cargo build, rustfmt, Clippy, cross-compilation]
tags: [Rust, cargo, toolchain, testing, linting, formatting, build-scripts]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Rust_Overview]]"
  - "[[Rust_Modules_and_Crates]]"
  - "[[Rust_Testing]]"
  - "[[Rust_Performance]]"
status: complete
---

# Cargo and Toolchain

> [!abstract] TL;DR
> Cargo is Rust's unified build system, package manager, test runner, doc generator, and formatter launcher. `rustfmt` enforces consistent code style; `clippy` catches hundreds of common mistakes and anti-patterns. Build scripts (`build.rs`) run before compilation for C library linking or code generation. Feature flags enable conditional compilation for optional dependencies. Cross-compilation targets any architecture.

---

## Intuition

Cargo eliminates the "ecosystem fragmentation" problem of C/C++ build systems. Every Rust project uses the same structure and commands. This uniformity means: CI configurations are copy-paste, dependency resolution is automatic, documentation is always one command away, and the entire ecosystem of tools (coverage, fuzzing, auditing) integrates seamlessly.

---

## Core Cargo Commands Reference

```bash
# Project creation
cargo new my-app           # binary crate (src/main.rs)
cargo new my-lib --lib     # library crate (src/lib.rs)
cargo init                 # initialize current directory as a crate

# Building
cargo build                # debug build (fast, no optimization)
cargo build --release      # release build (optimized, slow compile)
cargo check                # type-check without producing a binary (fastest)
cargo clean                # remove target/ directory

# Running
cargo run                  # build + run
cargo run --release
cargo run -- arg1 arg2     # pass arguments to the binary
cargo run --example hello  # run src/examples/hello.rs

# Testing
cargo test                 # run all tests
cargo test my_function     # run tests whose name contains "my_function"
cargo test -- --nocapture  # show stdout from tests
cargo test -- --ignored    # run tests marked #[ignore]
cargo test -- --test-threads=1  # run tests serially (not parallel)

# Documentation
cargo doc                  # generate docs for your crate
cargo doc --open           # generate + open in browser
cargo doc --no-deps        # only your crate's docs (not dependencies)

# Dependency management
cargo add serde            # add latest serde to [dependencies]
cargo add serde --features derive
cargo remove serde         # remove a dependency
cargo update               # update Cargo.lock to latest compatible versions
cargo tree                 # show dependency tree
cargo tree --duplicates    # find duplicate transitive dependencies

# Publishing
cargo login                # authenticate with crates.io
cargo package              # create .crate file (preview what gets published)
cargo publish --dry-run    # verify without actually publishing
cargo publish

# Workspace
cargo build --workspace    # build all workspace members
cargo test --workspace
cargo run -p server        # run specific workspace member
```

---

## cargo fmt — Code Formatting

`rustfmt` is the official Rust formatter. It produces a canonical style — no arguments about brace placement or indentation.

```bash
cargo fmt              # format all files in place
cargo fmt -- --check   # check without modifying (for CI — exits non-zero if formatting needed)
cargo fmt -- --edition 2021
```

```toml
# rustfmt.toml — customize formatting (rarely needed)
edition = "2021"
max_width = 100
use_field_init_shorthand = true
imports_granularity = "Module"
```

---

## cargo clippy — Linting

Clippy is a collection of 700+ lints. Always run it. Always fix or suppress with justification.

```bash
cargo clippy                          # run all default lints
cargo clippy -- -D warnings           # treat lints as errors (for CI)
cargo clippy --all-targets            # include tests, examples, benches
cargo clippy --fix                    # auto-fix lint suggestions
```

Common Clippy categories:
- **correctness** — code that's almost certainly wrong (panic in loop condition, integer overflow in comparison)
- **performance** — unnecessary allocations, inefficient patterns
- **style** — idiomatic Rust (use `if let` instead of `match` with one arm)
- **complexity** — overly complex code that can be simplified

```rust
// Suppressing a specific lint with justification (always document why!)
#[allow(clippy::ptr_arg)]
fn takes_vec(v: &Vec<String>) {  // clippy prefers &[String], but this is intentional
    // ...
}

// Deny specific lints in your crate
#![deny(clippy::all, clippy::pedantic)]
#![allow(clippy::must_use_candidate)]  // allow this specific pedantic lint
```

---

## Build Scripts — build.rs

`build.rs` is a special file that runs before compilation. Used for: linking C libraries, generating code from .proto or schema files, setting `cfg` flags based on the environment.

```rust
// build.rs (in crate root, same level as Cargo.toml)
fn main() {
    // Tell Cargo to rerun this script if any .c file changes
    println!("cargo:rerun-if-changed=src/native/mylib.c");

    // Link a C library
    // cc = { version = "1.0" } in [build-dependencies]
    cc::Build::new()
        .file("src/native/mylib.c")
        .compile("mylib");

    println!("cargo:rustc-link-lib=mylib");

    // Set a cfg flag based on environment
    if std::env::var("ENABLE_FEATURE").is_ok() {
        println!("cargo:rustc-cfg=my_feature");
    }

    // Tell Cargo about a pkg-config library
    let lib = pkg_config::probe_library("openssl").unwrap();
    for path in lib.include_paths {
        println!("cargo:include={}", path.display());
    }
}
```

---

## Feature Flags — Conditional Compilation

```toml
[features]
default = ["serde_support"]      # features enabled by default
serde_support = ["serde/derive"] # enable serde's derive feature
postgres = ["sqlx/postgres"]     # opt-in postgres backend
full = ["postgres", "serde_support"]

[dependencies]
serde = { version = "1.0", optional = true }
sqlx = { version = "0.8", optional = true }
```

```rust
// In Rust code — conditional compilation based on features
#[cfg(feature = "serde_support")]
use serde::{Serialize, Deserialize};

#[cfg(feature = "serde_support")]
#[derive(Serialize, Deserialize)]
pub struct Config {
    pub host: String,
    pub port: u16,
}

#[cfg(not(feature = "serde_support"))]
pub struct Config {
    pub host: String,
    pub port: u16,
}
```

```bash
# Enable specific features
cargo build --features postgres
cargo build --features "postgres,serde_support"
cargo build --all-features
cargo build --no-default-features
```

---

## Cross-Compilation

```bash
# Add a target
rustup target add aarch64-unknown-linux-musl   # ARM64 Linux with musl libc
rustup target add wasm32-unknown-unknown        # WebAssembly

# Build for a different target
cargo build --target aarch64-unknown-linux-musl
cargo build --target wasm32-unknown-unknown

# cross tool — Docker-based cross compilation (handles C deps automatically)
# cargo install cross
cross build --target aarch64-unknown-linux-gnu
```

---

## #[cfg] Attributes — Conditional Code

```rust
// Platform-specific code
#[cfg(target_os = "linux")]
fn platform_specific() {
    println!("Linux!");
}

#[cfg(target_os = "windows")]
fn platform_specific() {
    println!("Windows!");
}

// Architecture-specific
#[cfg(target_arch = "x86_64")]
fn x86_only() {}

// Debug vs release
#[cfg(debug_assertions)]
fn debug_check(x: i32) {
    assert!(x > 0, "x must be positive in debug builds");
}

#[cfg(not(debug_assertions))]
fn debug_check(_x: i32) {}  // compiled away in release

// Test-only code
#[cfg(test)]
mod tests {
    // only compiled when running `cargo test`
}

// Multiple conditions
#[cfg(all(target_os = "linux", feature = "postgres"))]
fn linux_postgres() {}

#[cfg(any(target_os = "linux", target_os = "macos"))]
fn unix() {}
```

---

## Useful Cargo Extensions

```bash
# Install cargo subcommands
cargo install cargo-expand     # show macro expansion
cargo install cargo-audit      # audit for known security vulnerabilities
cargo install cargo-deny       # enforce license policies and ban crates
cargo install cargo-tarpaulin  # code coverage (Linux only)
cargo install cargo-fuzz       # fuzzing (requires nightly)
cargo install cargo-criterion  # enhanced criterion integration
cargo install cargo-outdated   # show outdated dependencies
cargo install cargo-nextest    # faster test runner with better output
```

```bash
# cargo expand — see what macros expand to
cargo expand main              # expand main.rs
cargo expand --bin myapp       # for specific binary

# cargo audit — check for CVEs
cargo audit

# cargo nextest — parallel, faster test runner
cargo nextest run
cargo nextest run --test-threads=auto
```

---

## Common Pitfalls

- **`cargo build` vs `cargo check`** — use `cargo check` during development for instant feedback. `cargo build` does code generation and linking which is much slower.
- **Committing Cargo.lock for binaries** — binaries should commit `Cargo.lock` for reproducible builds. Libraries should not (users lock their own trees).
- **Feature additive semantics** — features should be additive (opt-in, don't remove things). Never use features to switch between two implementations — it breaks downstream crates that enable multiple features.
- **`#[cfg]` is compile-time only** — you can't use runtime values to choose between `#[cfg]` variants. For runtime switching, use regular `if` statements or feature flags combined with environment variables at build time.
- **build.rs changes don't trigger rebuild by default** — print `cargo:rerun-if-changed=filename` to declare what the build script depends on. Without this, Cargo only reruns `build.rs` when it itself changes.

---

## Review Questions

1. What is the difference between `cargo build` and `cargo check`? When would you use each?
2. You want to add optional PostgreSQL support to your library — users who don't need it shouldn't pull in `sqlx`. How do you implement this with Cargo features?
3. What is `build.rs`? Give two concrete use cases where it's necessary.
4. How do you add a cross-compilation target and build for it? What does `rustup target add` do under the hood?

---

#Rust #cargo #toolchain #testing #linting #formatting #build-scripts
