---
title: Rust Performance
aliases: [Rust profiling, Rust benchmarks, Rust unsafe, Rust SIMD, Rust zero-copy, Rust optimization]
tags: [Rust, performance, profiling, benchmarks, unsafe, SIMD, optimization]
domain: Rust
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Rust_Overview]]"
  - "[[Iterators_and_Functional_Patterns]]"
  - "[[Rust_Threads]]"
  - "[[Cargo_and_Toolchain]]"
status: complete
---

# Rust Performance

> [!abstract] TL;DR
> Rust's zero-cost abstractions give you C-level performance by default, but real-world optimization requires profiling first (flamegraphs, criterion benchmarks), then targeted improvements: cache-friendly data layouts (SoA over AoS), avoiding allocations (Cow, stack arrays), SIMD for data parallelism, and `unsafe` for the rare cases where the borrow checker is too conservative. Measure before optimizing — premature optimization in Rust is still wrong.

---

## Intuition

Rust's performance advantages:
1. **No GC pauses** — deterministic memory management means no stop-the-world pauses
2. **Zero-cost abstractions** — iterators, generics, and closures compile to the same code as hand-written C
3. **Cache-friendly by default** — `Vec<T>` is contiguous memory; no heap fragmentation from object graphs
4. **Inlining** — the compiler aggressively inlines small functions, especially with `#[inline]`

But Rust won't be fast automatically. You can write slow Rust by: cloning excessively, boxing everything, using `dyn Trait` for hot paths, or ignoring memory access patterns. Profile first, optimize second.

---

## Profiling with Flamegraphs

```bash
# Install cargo-flamegraph
cargo install flamegraph

# Generate a flamegraph (Linux: uses perf, macOS: uses DTrace)
cargo flamegraph --bin my-app

# Or for a specific benchmark
cargo flamegraph --bench my_benchmark
```

```rust
// Add sampling annotations for better flamegraph labels
#[inline(never)]  // prevents inlining — makes this visible in the flamegraph
fn expensive_function(data: &[u64]) -> u64 {
    data.iter().sum()
}
```

---

## Criterion Benchmarks

Criterion is the standard micro-benchmarking library for Rust — statistically rigorous, with warm-up, outlier detection, and HTML reports.

```toml
[dev-dependencies]
criterion = { version = "0.5", features = ["html_reports"] }

[[bench]]
name = "my_benchmark"
harness = false
```

```rust
// benches/my_benchmark.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion, BenchmarkId};

fn sum_vec(data: &[u64]) -> u64 {
    data.iter().sum()
}

fn sum_vec_unsafe(data: &[u64]) -> u64 {
    let mut total = 0u64;
    for &x in data {
        total = total.wrapping_add(x);
    }
    total
}

fn benchmark_sum(c: &mut Criterion) {
    let data: Vec<u64> = (0..10_000).collect();

    c.bench_function("sum_iter", |b| {
        b.iter(|| sum_vec(black_box(&data)))
        // black_box prevents the optimizer from eliminating the call
    });

    c.bench_function("sum_loop", |b| {
        b.iter(|| sum_vec_unsafe(black_box(&data)))
    });

    // Parameterized benchmarks — test multiple input sizes
    let mut group = c.benchmark_group("sum_sizes");
    for size in [100, 1_000, 10_000, 100_000].iter() {
        let data: Vec<u64> = (0..*size).collect();
        group.bench_with_input(BenchmarkId::from_parameter(size), &data, |b, d| {
            b.iter(|| sum_vec(black_box(d)))
        });
    }
    group.finish();
}

criterion_group!(benches, benchmark_sum);
criterion_main!(benches);
```

```bash
cargo bench                              # run all benchmarks
cargo bench -- sum_iter                  # run a specific benchmark
# HTML reports at: target/criterion/
```

---

## Cache-Friendly Data Layouts

### AoS vs SoA

```rust
// AoS (Array of Structs) — poor cache performance for partial field access
struct Particle {
    x: f64, y: f64, z: f64,   // position
    vx: f64, vy: f64, vz: f64, // velocity
    mass: f64,
}
let particles: Vec<Particle> = vec![...];

// To update only velocities, you must load entire Particle structs
// into cache, wasting 3/7 of each cache line on position and mass

// SoA (Struct of Arrays) — excellent cache performance for per-field operations
struct Particles {
    x: Vec<f64>, y: Vec<f64>, z: Vec<f64>,
    vx: Vec<f64>, vy: Vec<f64>, vz: Vec<f64>,
    mass: Vec<f64>,
}

// To update velocities: only vx/vy/vz arrays are loaded — 3x better cache utilization
impl Particles {
    fn update_velocities(&mut self, dt: f64) {
        for vx in &mut self.vx { *vx += dt; }
        // tight loop over contiguous f64s — SIMD-vectorized by the compiler
    }
}
```

---

## Avoiding Allocations

```rust
// Use stack arrays for known-small collections (no heap allocation)
use arrayvec::ArrayVec;  // or std::array / smallvec crate

fn small_collection() {
    // Heap allocation (Vec):
    let v: Vec<i32> = vec![1, 2, 3];  // allocates on heap

    // Stack allocation (array):
    let a: [i32; 3] = [1, 2, 3];  // on the stack — no allocation

    // SmallVec — stack-first, spills to heap only if it exceeds capacity
    use smallvec::SmallVec;
    let mut sv: SmallVec<[i32; 8]> = SmallVec::new();
    sv.push(1);  // no allocation (capacity 8 on stack)
    // pushing > 8 elements triggers heap allocation
}

// Cow<str> — avoid cloning strings unless modification is needed
use std::borrow::Cow;

fn process(input: &str) -> Cow<str> {
    if input.contains("bad") {
        Cow::Owned(input.replace("bad", "good"))  // allocated only when needed
    } else {
        Cow::Borrowed(input)  // zero allocation — returns a borrow
    }
}

// String formatting without allocation
use std::fmt::Write;
fn format_without_alloc(v: &[i32]) -> String {
    let mut s = String::with_capacity(v.len() * 4);  // pre-allocate
    for (i, n) in v.iter().enumerate() {
        if i > 0 { s.push_str(", "); }
        write!(s, "{n}").unwrap();  // writes into pre-allocated string
    }
    s
}
```

---

## unsafe Rust — When and How

`unsafe` blocks tell the compiler "I have verified this is safe, but you can't check it." Use sparingly and only when:
- Calling C/C++ FFI functions
- Dereferencing raw pointers (e.g., implementing data structures)
- Using `std::simd` or architecture-specific intrinsics
- Implementing `Send`/`Sync` for a type that you've verified is thread-safe

```rust
// Raw pointer dereferencing
fn dangerous(p: *const i32) -> i32 {
    unsafe {
        *p  // only safe if p is non-null and points to valid i32
    }
}

// FFI — calling C code
extern "C" {
    fn abs(x: i32) -> i32;
}

fn call_c_abs(n: i32) -> i32 {
    unsafe { abs(n) }
}

// Implementing a safe interface with unsafe internals
// (the "unsafe sandwich" pattern)
fn split_at_middle(s: &str) -> (&str, &str) {
    let mid = s.len() / 2;
    // SAFETY: mid is always <= s.len() and aligned to a char boundary
    // (this example assumes ASCII — in real code, use s.char_indices())
    unsafe {
        (
            s.get_unchecked(..mid),
            s.get_unchecked(mid..),
        )
    }
}
```

---

## repr(C) — FFI-Compatible Layouts

```rust
// Rust struct layout is not guaranteed without repr(C)
#[repr(C)]
struct Point {
    x: f64,
    y: f64,
}
// Now guaranteed to have the same layout as C's `struct Point { double x; double y; }`
// Enables passing to C functions directly

// repr(packed) — no padding between fields (use carefully — unaligned access is slow)
#[repr(C, packed)]
struct PackedHeader {
    magic: u32,
    version: u16,
    flags: u8,
}
```

---

## Zero-Copy Parsing

```rust
// Parsing without copying the input buffer
// &str and &[u8] slices point into the original buffer — no allocation

fn parse_key_value(line: &str) -> Option<(&str, &str)> {
    let eq = line.find('=')?;
    let key = line[..eq].trim();
    let val = line[eq + 1..].trim();
    Some((key, val))  // both &str reference into `line` — zero copies
}

// nom — parser combinator library for zero-copy binary/text parsing
// winnow — modern fork of nom with better ergonomics
```

---

## SIMD — Data Parallelism

```rust
// std::simd is stable in Rust (nightly for now, stabilizing)
// For stable Rust, use platform-specific intrinsics or auto-vectorization hints

// Auto-vectorization — write clean loops; the optimizer vectorizes them
fn sum_f32(data: &[f32]) -> f32 {
    data.iter().sum()  // auto-vectorized to SSE/AVX by the optimizer
}

// Hint with slices aligned to 32 bytes (enables AVX2)
use std::simd::prelude::*;

fn simd_sum(data: &[f32]) -> f32 {
    let (prefix, chunks, suffix) = data.as_simd::<8>();  // 8-wide f32 SIMD
    let mut acc = f32x8::splat(0.0);
    for chunk in chunks {
        acc += chunk;
    }
    let chunk_sum: f32 = acc.reduce_sum();
    let prefix_sum: f32 = prefix.iter().sum();
    let suffix_sum: f32 = suffix.iter().sum();
    chunk_sum + prefix_sum + suffix_sum
}
```

---

## Release Profile Tuning

```toml
[profile.release]
opt-level = 3        # maximum optimization
lto = "fat"          # link-time optimization across all crates
codegen-units = 1    # single codegen unit — slower compile, better optimization
panic = "abort"      # smaller binary — no unwinding machinery
strip = "symbols"    # strip debug symbols

[profile.release-with-debug]  # custom profile for profiling
inherits = "release"
debug = 1            # line numbers for flamegraphs
```

---

## Common Pitfalls

- **Optimizing before profiling** — Rust makes it easy to write fast code, but you still need a flamegraph to know where time is actually spent. Intuition is often wrong.
- **`black_box` in benchmarks** — without `criterion::black_box()`, the optimizer may eliminate your benchmark entirely, giving misleadingly small times.
- **`unsafe` without invariant documentation** — every `unsafe` block must document exactly what invariants the programmer is upholding and why the code is safe. No documentation = maintenance landmine.
- **`repr(C, packed)` with references** — taking a reference to an unaligned field of a packed struct is undefined behavior. Only use values (no `&field`) from packed structs.
- **Measuring allocations** — use `heaptrack`, `DHAT` (part of Valgrind), or the `dhat` Rust crate to find unexpected heap allocations in hot paths.

---

## Review Questions

1. What is the difference between AoS (Array of Structs) and SoA (Struct of Arrays)? Give a concrete scenario where SoA is 3x faster.
2. When is `unsafe` Rust appropriate? Write a bullet list of the three invariants you must document whenever you write `unsafe { *ptr }`.
3. What does `criterion::black_box()` do, and why is it necessary in micro-benchmarks?
4. You're parsing binary network packets with `&[u8]` slices. How do you ensure zero-copy parsing, and what does `nom` or `winnow` provide over hand-written parsing?

---

#Rust #performance #profiling #benchmarks #unsafe #SIMD #optimization
