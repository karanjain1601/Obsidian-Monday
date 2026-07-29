---
title: C++ Exception Handling
aliases: [C++ Exceptions, try catch throw, noexcept, exception safety, RAII exceptions]
tags: [C, Cpp, exceptions, RAII, noexcept, error-handling, safety-guarantees]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Cpp_OOP]]"
  - "[[Memory_Management_Cpp]]"
  - "[[Cpp_Smart_Pointers]]"
status: complete
---

# C++ Exception Handling

> [!abstract] TL;DR
> C++ exceptions separate error signaling from error handling: `throw` propagates an error object up the call stack, unwinding stack frames and calling destructors along the way, until a matching `catch` handles it. RAII makes this safe — resources held at the throw site are released by their destructors during unwinding. `noexcept` declares that a function never throws, enabling optimizations and preventing double-exceptions during stack unwinding.

---

## try / catch / throw

```cpp
#include <stdexcept>
#include <iostream>
#include <string>

// C++ standard exception hierarchy:
// std::exception (base)
//   ├── std::logic_error    — programming errors (wrong arguments, bad_alloc)
//   │     ├── std::invalid_argument
//   │     ├── std::out_of_range
//   │     └── std::length_error
//   └── std::runtime_error  — runtime failures (IO, overflow)
//         ├── std::overflow_error
//         ├── std::underflow_error
//         └── std::system_error

double safe_divide(double a, double b) {
    if (b == 0.0) {
        throw std::invalid_argument("division by zero");
    }
    return a / b;
}

int main() {
    try {
        double r = safe_divide(10.0, 0.0);
    }
    catch (const std::invalid_argument& e) {    // catch specific exception type
        std::cerr << "Invalid arg: " << e.what() << "\n";
    }
    catch (const std::exception& e) {           // catch any std exception
        std::cerr << "Error: " << e.what() << "\n";
    }
    catch (...) {                               // catch anything else (last resort)
        std::cerr << "Unknown exception\n";
    }

    // Re-throw — preserve original exception
    try {
        try { safe_divide(1, 0); }
        catch (const std::invalid_argument&) {
            std::cerr << "Caught inner, rethrowing\n";
            throw;    // re-throws the SAME exception object (not a copy)
        }
    }
    catch (const std::exception& e) {
        std::cerr << "Caught outer: " << e.what() << "\n";
    }

    // Custom exception
    struct NetworkError : std::runtime_error {
        int error_code;
        NetworkError(int code, const std::string& msg)
            : std::runtime_error(msg), error_code(code) {}
    };

    try { throw NetworkError(404, "Not found"); }
    catch (const NetworkError& e) {
        std::cout << "HTTP " << e.error_code << ": " << e.what() << "\n";
    }

    return 0;
}
```

---

## `noexcept`

```cpp
#include <stdexcept>
#include <vector>

// noexcept: declares the function never throws
// If it does throw, std::terminate() is called immediately
void swap_ints(int& a, int& b) noexcept {
    int tmp = a; a = b; b = tmp;
}

// noexcept(expr): conditional noexcept
template <typename T>
void my_swap(T& a, T& b) noexcept(noexcept(T(std::move(a)))) {
    T tmp(std::move(a));
    a = std::move(b);
    b = std::move(tmp);
}

// WHY noexcept matters for performance:
// std::vector reallocation uses MOVE if move constructor is noexcept,
// otherwise falls back to COPY (for strong exception safety guarantee).
class Expensive {
public:
    Expensive(Expensive&&) noexcept = default;      // enables move during vector realloc
    Expensive& operator=(Expensive&&) noexcept = default;
};

// noexcept on destructors: default in C++11+
// If a destructor throws, it terminates during stack unwinding — almost always fatal
class SafeResource {
public:
    ~SafeResource() noexcept {      // explicitly noexcept (redundant but documentary)
        // ... cleanup that won't throw ...
    }
};
```

---

## Exception Safety Guarantees

| Guarantee | What it means |
|-----------|---------------|
| **No-throw** | The operation never throws. Marked `noexcept`. |
| **Strong** | If the operation throws, the program state is unchanged (commit-or-rollback). |
| **Basic** | If the operation throws, the program is in a valid (not necessarily unchanged) state. No resource leaks. |
| **None** | No guarantee — may throw with partially modified state. Do not use. |

```cpp
// Strong exception safety with copy-and-swap idiom
class Config {
    std::vector<std::string> options_;
public:
    // Strong guarantee: options_ only updated if no exception thrown
    void add_options(std::vector<std::string> new_opts) {
        std::vector<std::string> merged = options_;  // copy
        for (auto& o : new_opts) merged.push_back(std::move(o));
        // If any push_back throws, options_ is unchanged — strong guarantee
        options_ = std::move(merged);  // only update if we get here (noexcept)
    }
};
```

---

## Exceptions in Constructors

```cpp
#include <stdexcept>
#include <memory>

class Connection {
    int fd_;
    std::unique_ptr<int[]> buffer_;
public:
    Connection(const char *host, int bufsize) {
        buffer_ = std::make_unique<int[]>(bufsize);   // RAII — safe
        fd_ = connect_to_host(host);   // may throw

        // If connect_to_host throws:
        // - buffer_ is destroyed by unique_ptr's destructor (RAII)
        // - fd_ was never set so no cleanup needed
        // - Connection object is NOT constructed (destructor NOT called)
        // Without RAII: buffer memory leaks since ~Connection() won't run
    }

    ~Connection() { close(fd_); }
};

// Function-try-block: catch exceptions from member initializer list
class BadBase {
public:
    BadBase(int x) { if (x < 0) throw std::invalid_argument("negative"); }
};

class Derived : public BadBase {
public:
    Derived(int x)
    try : BadBase(x) {     // function-try-block wraps the entire constructor
        // init body
    }
    catch (const std::invalid_argument& e) {
        std::cerr << "Caught in Derived ctor: " << e.what() << "\n";
        throw;    // must re-throw or throw something else — cannot suppress
    }
};
```

---

## When to Avoid Exceptions

Exceptions are NOT always the right error-handling mechanism:

```cpp
// Prefer return codes / std::expected (C++23) for:
// 1. Expected failures (file not found, parse error, invalid user input)
// 2. Performance-critical paths (exceptions have zero-cost for non-throwing paths
//    but may have high cost at the throw site and significant code size overhead)
// 3. Real-time / embedded systems where deterministic timing is required
// 4. Code paths in destructors (exceptions from destructors during stack unwinding
//    call std::terminate())

// C++23: std::expected<T, E> — zero-cost error return
#include <expected>
std::expected<int, std::string> parse(const std::string& s) {
    try { return std::stoi(s); }
    catch (...) { return std::unexpected("not an integer: " + s); }
}

auto result = parse("42");
if (result) std::cout << *result;      // 42
else        std::cerr << result.error();
```

---

## Common Pitfalls

- **Throwing from destructors:** If a destructor throws while stack unwinding is already in progress (due to another exception), `std::terminate()` is called. Keep destructors `noexcept`.
- **Catching by value instead of reference:** `catch (std::exception e)` copies the exception and slices derived types. Always `catch (const std::exception& e)`.
- **Empty catch blocks:** Silently swallowing exceptions hides bugs. At minimum, log `e.what()`.
- **Using exceptions for control flow:** Throwing and catching in performance-critical loops is expensive. Reserve exceptions for genuinely exceptional conditions.

---

## Review Questions

1. What is the difference between the basic, strong, and no-throw exception safety guarantees? Give a code example demonstrating the strong guarantee.
2. Why must destructors be `noexcept`? What happens if a destructor throws during stack unwinding?
3. Explain why `catch (std::exception e)` is wrong and `catch (const std::exception& e)` is correct. What is object slicing in this context?
4. A constructor allocates two resources: a heap buffer (line 3) and a file descriptor (line 4). If line 4 throws, is the heap buffer leaked? Explain why, depending on whether the buffer is a raw pointer or a `unique_ptr`.

---

#C #Cpp
