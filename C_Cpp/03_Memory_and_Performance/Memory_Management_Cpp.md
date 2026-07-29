---
title: Memory Management in C++
aliases: [C++ new delete, C++ memory layout, placement new, C++ allocators, RAII]
tags: [C, Cpp, memory, RAII, heap, stack, allocators, alignas]
domain: C_Cpp
difficulty: Advanced
created: 2026-07-29
related:
  - "[[C_Pointers_and_Memory]]"
  - "[[Cpp_Smart_Pointers]]"
  - "[[Move_Semantics]]"
  - "[[Cpp_Exception_Handling]]"
status: complete
---

# Memory Management in C++

> [!abstract] TL;DR
> C++ extends C's `malloc`/`free` with `new`/`delete` which also invoke constructors and destructors. Placement new constructs objects at specific addresses without allocation. RAII (Resource Acquisition Is Initialization) ties resource lifetimes to object lifetimes — destructors run automatically during stack unwinding even when exceptions are thrown, making leaks structurally impossible when applied consistently.

---

## `new`/`delete` vs `malloc`/`free`

```cpp
#include <iostream>
#include <cstdlib>   // malloc, free

class Foo {
    int x_;
public:
    Foo(int x) : x_(x) { std::cout << "Foo(" << x_ << ") ctor\n"; }
    ~Foo()              { std::cout << "Foo(" << x_ << ") dtor\n"; }
};

int main() {
    // malloc/free — allocates raw memory, NO constructor/destructor called
    Foo *raw = (Foo *)malloc(sizeof(Foo));   // WARNING: Foo NOT constructed!
    free(raw);                               // Foo NOT destroyed!

    // new/delete — allocates memory AND calls constructor/destructor
    Foo *obj = new Foo(42);   // allocates sizeof(Foo) bytes, calls Foo(42)
    delete obj;               // calls ~Foo(), then frees memory

    // Array forms — use matching delete[]
    Foo *arr = new Foo[3]{1, 2, 3};   // 3 constructors called
    delete[] arr;                      // 3 destructors called, then freed
    // NEVER: delete arr; for array allocation — undefined behavior

    // Prefer make_unique over new in all new code
    auto safe = std::make_unique<Foo>(99);   // RAII: no explicit delete needed

    return 0;
}
```

---

## Memory Layout

```
High address ──────────────────────────────────────────
   Stack (grows DOWN)
     - local variables, function call frames
     - return addresses, saved registers
     - fast O(1): just move stack pointer
     - limited (~8MB default on Linux)
   ──────────────────────────────────────────────────
   Memory-mapped files, anonymous mmap (shared libs, ...)
   ──────────────────────────────────────────────────
   Heap (grows UP)
     - new/malloc allocations
     - managed by allocator (jemalloc, tcmalloc, glibc)
     - fragmentation possible
   ──────────────────────────────────────────────────
   BSS  — zero-initialized global/static variables
   Data — explicitly initialized global/static variables
   Text — read-only executable code, string literals
Low address ──────────────────────────────────────────
```

---

## Placement New

Placement new constructs an object at a specific pre-allocated address. Used in custom allocators, memory pools, and embedded systems where the heap is unavailable:

```cpp
#include <new>       // std::byte, placement new
#include <iostream>

class Widget {
    int id_;
public:
    Widget(int id) : id_(id) { std::cout << "Widget(" << id_ << ")\n"; }
    ~Widget() { std::cout << "~Widget(" << id_ << ")\n"; }
    int id() const { return id_; }
};

int main() {
    // Allocate raw memory aligned for Widget (does NOT call constructor)
    alignas(Widget) std::byte buffer[sizeof(Widget)];

    // Placement new — construct Widget IN the buffer (no heap allocation)
    Widget *w = new (buffer) Widget(42);
    std::cout << w->id() << "\n";

    // Must MANUALLY call destructor — do NOT use delete (buffer is not heap-allocated)
    w->~Widget();   // explicitly call destructor
    // delete w;    // WRONG — this would try to free 'buffer' which is on the stack

    // Memory pool pattern
    constexpr size_t POOL_SIZE = 1024;
    alignas(std::max_align_t) char pool[POOL_SIZE];
    char *bump = pool;

    auto pool_alloc = [&]<typename T>(auto&&... args) -> T* {
        size_t space = POOL_SIZE - (bump - pool);
        void *ptr = bump;
        if (!std::align(alignof(T), sizeof(T), ptr, space)) return nullptr;
        bump = static_cast<char*>(ptr) + sizeof(T);
        return new (ptr) T(std::forward<decltype(args)>(args)...);
    };
}
```

---

## RAII and Stack Unwinding

When an exception is thrown, C++ guarantees that all destructors for objects on the call stack are invoked (stack unwinding). RAII leverages this guarantee:

```cpp
#include <fstream>
#include <stdexcept>
#include <mutex>

std::mutex g_mutex;

void fragile_operation(const std::string& path) {
    std::ifstream file(path);                  // RAII: file closed in destructor
    std::lock_guard<std::mutex> lock(g_mutex); // RAII: mutex unlocked in destructor

    if (!file) throw std::runtime_error("cannot open " + path);

    int x;
    file >> x;
    if (x < 0) throw std::invalid_argument("negative value");

    // ... more work ...

}   // If any exception propagates: lock released, file closed — GUARANTEED
    // Without RAII: both would be leaked if exception thrown mid-function

// Manual (C-style) — error-prone
void fragile_manual(const char *path) {
    FILE *fp = fopen(path, "r");
    pthread_mutex_lock(&some_mutex);

    int x;
    fscanf(fp, "%d", &x);
    if (x < 0) {
        pthread_mutex_unlock(&some_mutex);
        fclose(fp);
        return;   // BOTH must be remembered — easy to forget one
    }

    pthread_mutex_unlock(&some_mutex);
    fclose(fp);
}
```

---

## Memory Alignment

```cpp
#include <iostream>
#include <memory>

// alignas — over-align a variable or type
alignas(64) int cache_line_data[16];   // aligned to 64-byte cache line boundary

// alignof — query alignment requirement of a type
std::cout << alignof(double) << "\n";  // 8 on most platforms
std::cout << alignof(long double) << "\n";  // 16 on x86-64

// Aligned dynamic allocation (C++17)
auto* p = static_cast<int*>(
    ::operator new(sizeof(int) * 16, std::align_val_t{64})
);
::operator delete(p, std::align_val_t{64});

// std::aligned_alloc (C11/C++17) — aligned malloc
void *aligned = std::aligned_alloc(64, 1024);   // 1024 bytes, 64-byte aligned
std::free(aligned);
```

---

## Custom Allocators (Brief)

```cpp
#include <memory_resource>   // C++17 polymorphic memory resources

// std::pmr::monotonic_buffer_resource — arena allocator
// Allocates from a fixed buffer; free() is a no-op; reset() frees everything
char buffer[4096];
std::pmr::monotonic_buffer_resource pool(buffer, sizeof(buffer));
std::pmr::vector<int> v(&pool);   // uses pool instead of heap
v.push_back(1); v.push_back(2);   // allocated from buffer[]
// All memory freed when pool goes out of scope
```

---

## Common Pitfalls

- **`delete` vs `delete[]`:** Using `delete` on an array (`new T[n]`) is undefined behavior — only the first destructor runs and the allocator's bookkeeping is corrupted.
- **Heap memory in constructors without RAII:** If a constructor allocates two resources and the second allocation throws, the first resource leaks because the destructor is never called for a partially-constructed object. Use RAII members (smart pointers) so each resource is managed independently.
- **Double delete:** `delete` then `delete` again on the same pointer corrupts the heap. Set pointers to `nullptr` after `delete` to make the second `delete nullptr` a safe no-op.
- **Stack overflow from large local arrays:** `int buf[10'000'000];` on the stack overflows the 8MB default stack silently. Put large buffers on the heap.

---

## Review Questions

1. What is the functional difference between `malloc(sizeof(T))` and `new T()`? What happens to the object's members in each case?
2. Explain why RAII solves the "exception-safety" problem that C-style error handling cannot. Walk through a concrete example with two resources.
3. When would you use placement new? What are the responsibilities the programmer takes on, and what must they NOT do with the resulting pointer?
4. What alignment does `new char[N]` guarantee? When is this insufficient, and how do you get a stronger alignment guarantee in C++17?

---

#C #Cpp
