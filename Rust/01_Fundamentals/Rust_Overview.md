---
title: Rust Overview
aliases: [Rust Introduction, Why Rust, Rust Setup, Rust Cargo]
tags: [Rust, fundamentals, cargo, toolchain]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Rust_Types_and_Variables]]"
  - "[[Ownership_and_Borrowing]]"
  - "[[Cargo_and_Toolchain]]"
  - "[[Rust_Modules_and_Crates]]"
status: complete
---

# Rust Overview

> [!abstract] TL;DR
> Rust delivers C-level performance with compile-time memory safety guarantees, replacing garbage collection with an ownership system enforced by the borrow checker. It is the language for systems programming, WebAssembly, embedded, and high-performance networking where you need predictable latency and zero-overhead abstractions without sacrificing safety.

---

## Why Rust Exists

Most languages sit at one end of a spectrum: C/C++ give you full control over memory but trust you not to misuse it (segfaults, use-after-free, data races). Managed languages (Java, Go, Python) protect you from those errors but impose a garbage collector: periodic pauses, higher memory footprint, and unpredictable latency spikes.

Rust's thesis is that this tradeoff is not fundamental. By expressing ownership and borrowing rules in the type system, the compiler can prove at compile time that a program is free of:
- **Use-after-free** — a pointer used after the pointed-to memory is deallocated
- **Double-free** — freeing the same memory twice
- **Dangling references** — a reference that outlives the data it points to
- **Data races** — two threads simultaneously accessing mutable shared data

These guarantees are enforced at zero runtime cost. No GC, no reference counts (unless you explicitly opt in with `Rc`/`Arc`), no runtime checks.

### Core Value Propositions

| Property | Meaning |
|----------|---------|
| Memory safety without GC | Ownership + borrow checker proves safety at compile time |
| Zero-cost abstractions | Iterators, closures, generics compile to the same code as hand-written C loops |
| Fearless concurrency | The type system prevents data races at compile time |
| C interop | `extern "C"` and `#[no_mangle]` make calling C/C++ trivial |
| Predictable performance | No GC pauses; deterministic drop (destructor) semantics |

---

## Rust Use Cases

- **Systems programming** — OS kernels, device drivers, file systems (Linux kernel now accepts Rust drivers)
- **WebAssembly** — Rust + wasm-bindgen compiles to small, fast WASM modules for browser/edge
- **Embedded / bare metal** — `no_std` Rust runs without an OS on microcontrollers
- **High-performance networking** — async runtimes (Tokio), HTTP servers (Axum, Actix), low-latency proxies
- **CLI tools** — `ripgrep` (rg), `fd`, `bat`, `exa` — all written in Rust for speed
- **Game engines** — Bevy, fyrox leverage Rust's ECS and data-oriented patterns
- **Blockchain / cryptography** — memory safety is critical in consensus code

---

## Edition System

Rust evolves without breaking existing code via **editions**. An edition is a snapshot of the language that a crate opts into via `Cargo.toml`. Editions are backward compatible across crate boundaries.

| Edition | Key Changes |
|---------|------------|
| 2015 | Original stable release |
| 2018 | `async`/`await` foundation, non-lexical lifetimes (NLL), module system simplification |
| 2021 | Disjoint capture in closures, `IntoIterator` for arrays, `panic!` as expressions |

```toml
# Cargo.toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"   # always use 2021 for new projects
```

---

## Environment Setup

### Installing via rustup

`rustup` is the official Rust toolchain manager — it handles installation, updates, and multiple toolchain versions.

```bash
# Install rustup (Linux/macOS)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows: download and run rustup-init.exe from rustup.rs

# Verify installation
rustc --version    # rustc 1.79.0 (...)
cargo --version    # cargo 1.79.0 (...)
rustup --version

# Update all toolchains
rustup update

# Install nightly toolchain (for experimental features)
rustup toolchain install nightly
rustup default nightly   # switch default (not recommended for production)
```

### IDE Setup

- **VS Code** — install `rust-analyzer` extension (not the legacy "Rust" extension)
- **IntelliJ / CLion** — install the official JetBrains Rust plugin
- **Neovim** — use `rust-analyzer` via LSP (mason.nvim or manual)
- **Rust Playground** — [play.rust-lang.org](https://play.rust-lang.org) for quick experiments

---

## Cargo — Rust's Build System and Package Manager

Cargo is Rust's all-in-one build system, dependency manager, test runner, and documentation generator. It is roughly npm + maven + make combined.

### Core Commands

```bash
# Create a new binary project
cargo new my-app              # creates my-app/ with src/main.rs
cargo new my-app --lib        # creates a library crate (src/lib.rs)

# Build and run
cargo build                   # debug build → target/debug/my-app
cargo build --release         # optimized build → target/release/my-app
cargo run                     # build + run in one step
cargo run --release           # release mode run
cargo run -- arg1 arg2        # pass arguments to the binary

# Check for errors without producing a binary (much faster than build)
cargo check

# Run tests
cargo test
cargo test my_test_name       # run a specific test by name filter
cargo test -- --nocapture     # show println! output from tests

# Documentation
cargo doc --open              # generate and open docs in browser

# Linting and formatting
cargo fmt                     # format code with rustfmt
cargo clippy                  # run the Clippy linter
```

### Cargo.toml Structure

```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"
authors = ["Your Name <you@example.com>"]
description = "A brief description"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = "0.12"

[dev-dependencies]
mockall = "0.13"    # only for tests, not included in production binary

[features]
default = []
postgres = ["sqlx/postgres"]   # optional feature flag
```

### Cargo.lock

`Cargo.lock` records the exact version of every dependency (and transitive dependency). For **binaries**, commit `Cargo.lock` — it ensures reproducible builds. For **libraries**, do not commit it (consumers lock their own dependency trees).

---

## Rust vs Competitors at a Glance

| Aspect | C/C++ | Go | Java | Rust |
|--------|-------|----|------|------|
| Memory management | Manual | GC | GC | Ownership (compile-time) |
| Null safety | No | No | No | Yes (`Option<T>`) |
| Data race safety | No | Partial | No | Yes (compile-time) |
| Compile speed | Fast | Very fast | Medium | Slow |
| Runtime overhead | None | GC pauses | GC + JVM | None |
| Concurrency model | Threads (unsafe) | Goroutines | Threads | Threads + async (safe) |

---

## Common Pitfalls

- **Slow compile times** — Rust's type-checking and monomorphization are thorough. Use `cargo check` during development (skips codegen), enable incremental compilation, and use `sccache` for CI.
- **Fighting the borrow checker early** — the borrow checker enforces correct code, not convenient code. Clone data liberally while learning, then optimize later with references.
- **Trying to write Rust like C++** — Rust idioms (ownership transfer, `Result` for errors, iterators over raw loops) are different. Read idiomatic Rust guides.
- **Ignoring `cargo clippy`** — Clippy catches hundreds of common mistakes and anti-patterns. Run it on every PR.
- **Edition confusion** — always check which edition your dependencies use. Mixing is safe but some syntax differs.

---

## Review Questions

1. What is the difference between a GC-managed language and Rust's ownership model in terms of runtime behavior? When would you specifically choose Rust over Go for a new service?
2. What does `cargo check` do that `cargo build` does not, and why is it faster?
3. You have a crate that is a library (not a binary). Should you commit `Cargo.lock`? Explain the tradeoffs.
4. What are Rust editions and how do they maintain backward compatibility across crate boundaries?

---

#Rust #fundamentals #cargo #toolchain
