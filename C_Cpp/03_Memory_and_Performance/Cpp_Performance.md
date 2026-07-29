---
title: C++ Performance
aliases: [C++ Optimization, C++ profiling, cache-friendly code, SoA AoS, constexpr, LTO, PGO]
tags: [C, Cpp, performance, optimization, profiling, cache, constexpr, sanitizers]
domain: C_Cpp
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Memory_Management_Cpp]]"
  - "[[Move_Semantics]]"
  - "[[Cpp_Concurrency]]"
  - "[[CMake_Build_System]]"
status: complete
---

# C++ Performance

> [!abstract] TL;DR
> C++ performance engineering follows a strict workflow: measure first with a profiler, then optimize the bottleneck. Cache-friendly memory layout (SoA over AoS for hot loops) often yields 5-10x speedups. Compile-time evaluation (`constexpr`/`consteval`) moves computation from runtime to compile time. Link-time and profile-guided optimization let the compiler see the whole program and real-world behavior. Sanitizers catch bugs that only manifest under load.

---

## Profiling First

```bash
# perf (Linux) — CPU-level profiling, sees cache misses, branch mispredictions
gcc -O2 -g -fno-omit-frame-pointer -o myapp myapp.cpp
perf stat ./myapp                  # summary: cycles, cache-misses, branches
perf record -g ./myapp             # record call graph
perf report                        # interactive flamegraph navigation

# gprof — function-level call graph profiling
gcc -pg -O2 -o myapp myapp.cpp
./myapp
gprof myapp gmon.out > analysis.txt

# Valgrind Cachegrind — cache miss simulation
valgrind --tool=cachegrind ./myapp
cg_annotate cachegrind.out.<pid>

# Built-in C++ high-resolution timer
#include <chrono>
auto t0 = std::chrono::high_resolution_clock::now();
// ... code to measure ...
auto t1 = std::chrono::high_resolution_clock::now();
auto us = std::chrono::duration_cast<std::chrono::microseconds>(t1 - t0).count();
```

---

## Cache-Friendly Code: SoA vs AoS

The CPU loads data in 64-byte cache lines. Accessing sparse fields from large objects causes cache thrashing. Struct of Arrays (SoA) keeps the hot data contiguous:

```cpp
#include <vector>
#include <cmath>

// AoS (Array of Structures) — bad for vectorization, cold fields pollute cache
struct ParticleAoS {
    float x, y, z;          // position — hot (read every frame)
    float vx, vy, vz;       // velocity — warm (updated every frame)
    float mass;              // warm
    char  name[64];          // COLD — never used in hot path
};
std::vector<ParticleAoS> particles_aos(1'000'000);

void update_aos(std::vector<ParticleAoS>& ps, float dt) {
    for (auto& p : ps) {
        p.x += p.vx * dt;   // loads 128 bytes per struct, uses only 32
        p.y += p.vy * dt;   // cache line is 64 bytes — 2x cache pollution
        p.z += p.vz * dt;   // 'name' field loaded but never used
    }
}

// SoA (Structure of Arrays) — hot fields packed together, SIMD-friendly
struct ParticlesSoA {
    std::vector<float> x, y, z;     // all positions contiguous in memory
    std::vector<float> vx, vy, vz;  // all velocities contiguous
    std::vector<float> mass;
    std::vector<char[64]> name;     // cold data isolated — never loaded in hot path
};

void update_soa(ParticlesSoA& ps, float dt, size_t n) {
    for (size_t i = 0; i < n; i++) {
        ps.x[i] += ps.vx[i] * dt;  // accesses contiguous floats
        ps.y[i] += ps.vy[i] * dt;  // compiler can auto-vectorize (SIMD)
        ps.z[i] += ps.vz[i] * dt;  // cache utilization ~100%
    }
}
// SoA version is typically 3-8x faster for particle simulation hot loops
```

---

## Compile-Time Evaluation

```cpp
#include <array>
#include <cstdint>

// constexpr: evaluated at compile time if all inputs are constant
// Can also be called at runtime with non-constant inputs
constexpr uint64_t fibonacci(int n) {
    if (n <= 1) return n;
    uint64_t a = 0, b = 1;
    for (int i = 2; i <= n; i++) { uint64_t c = a + b; a = b; b = c; }
    return b;
}

constexpr uint64_t fib40 = fibonacci(40);   // computed at compile time, zero runtime cost
// static_assert verifies at compile time
static_assert(fib40 == 102334155, "wrong fibonacci");

// consteval (C++20): MUST be evaluated at compile time — runtime call is an error
consteval int sqr(int n) { return n * n; }
constexpr int s1 = sqr(5);   // OK: 25 at compile time
// int x = 5; int s2 = sqr(x);  // ERROR: x is not a constant expression

// constexpr lookup table — computed once at compile time, stored in read-only memory
constexpr auto make_sin_table() {
    std::array<float, 360> table{};
    for (int i = 0; i < 360; i++) {
        table[i] = std::sin(i * 3.14159265f / 180.f);
    }
    return table;
}
constexpr auto SIN_TABLE = make_sin_table();   // no runtime init cost
```

---

## Inlining and LTO

```cpp
// __attribute__((always_inline)) / [[gnu::always_inline]] — force inlining
[[gnu::always_inline]] inline int add(int a, int b) { return a + b; }

// [[gnu::noinline]] — prevent inlining (useful to keep profiler readable)
[[gnu::noinline]] void heavy_function() { /* ... */ }
```

```cmake
# CMakeLists.txt — enable LTO and PGO
# Link-Time Optimization: whole-program analysis, cross-TU inlining
target_compile_options(myapp PRIVATE -O2 -flto)
target_link_options(myapp PRIVATE -flto)

# Profile-Guided Optimization: instrument → run → optimize based on real data
# Step 1: compile with profiling instrumentation
target_compile_options(myapp PRIVATE -O2 -fprofile-generate)
# Step 2: run the instrumented binary with representative workload
# Step 3: recompile using the collected profile data
target_compile_options(myapp PRIVATE -O2 -fprofile-use -fprofile-correction)
```

---

## Branch Prediction Hints

```cpp
#include <cstdint>

// [[likely]] / [[unlikely]] (C++20) — hint to compiler about branch probability
// Affects code layout: taken-by-default branch placed in faster "fall-through" path
int process(int x) {
    if (x < 0) [[unlikely]] {
        // This branch is rare — compiler generates code assuming it's not taken
        return handle_error(x);
    }
    return x * 2;   // common path — "fall-through" in assembly
}

// GCC __builtin_expect (pre-C++20)
#define LIKELY(x)   __builtin_expect(!!(x), 1)
#define UNLIKELY(x) __builtin_expect(!!(x), 0)

if (UNLIKELY(ptr == nullptr)) { handle_null(); }
```

---

## Sanitizers for Correctness

```bash
# AddressSanitizer (ASan) — detects buffer overflows, use-after-free, double-free
g++ -fsanitize=address -g -O1 -o prog prog.cpp
./prog     # ASan prints exact line of violation with stack trace

# UndefinedBehaviorSanitizer (UBSan) — detects signed overflow, null deref, misaligned access
g++ -fsanitize=undefined -g -O1 -o prog prog.cpp

# ThreadSanitizer (TSan) — detects data races
g++ -fsanitize=thread -g -O1 -o prog prog.cpp

# Combine ASan + UBSan for comprehensive checking
g++ -fsanitize=address,undefined -g -O1 -fno-optimize-sibling-calls -o prog prog.cpp
```

---

## Common Pitfalls

- **Optimizing before measuring:** "The first rule of program optimization: don't do it. The second rule: don't do it yet." Profile first, optimize the bottleneck (usually < 5% of code causes > 95% of time).
- **Virtual function calls in hot loops:** Each virtual dispatch is an indirect memory read (vtable pointer) followed by a branch to a potentially uncached address. In tight loops, consider templates/CRTP to resolve dispatch at compile time.
- **`std::endl` vs `'\n'`:** `std::endl` flushes the stream buffer — it is 10-100x slower than `'\n'`. Use `'\n'` for line breaks in output loops.
- **False sharing:** Two threads writing to different variables that happen to share a cache line cause the CPU to bounce that line between cores. Pad hot variables to 64 bytes (`alignas(64)`) to separate them.

---

## Review Questions

1. Explain cache-line false sharing. Two threads each increment their own `int counter` in the same struct. Why is this slower than if they were in separate structs, and how do you fix it?
2. What is the difference between LTO (link-time optimization) and PGO (profile-guided optimization)? Which requires a representative workload to be effective?
3. `consteval` vs `constexpr` — what constraint does `consteval` add, and when would you choose it over `constexpr`?
4. Why does AoS layout cause cache thrashing in a physics simulation hot loop? Sketch the SoA layout that fixes it and explain why it is SIMD-friendly.

---

#C #Cpp
