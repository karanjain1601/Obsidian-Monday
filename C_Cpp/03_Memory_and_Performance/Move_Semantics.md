---
title: Move Semantics
aliases: [C++ Move Semantics, rvalue references, std::move, perfect forwarding, RVO, NRVO]
tags: [C, Cpp, move-semantics, rvalue, perfect-forwarding, RVO, performance]
domain: C_Cpp
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Cpp_OOP]]"
  - "[[Cpp_Smart_Pointers]]"
  - "[[Memory_Management_Cpp]]"
  - "[[Cpp_Modern_Features]]"
status: complete
---

# Move Semantics

> [!abstract] TL;DR
> Move semantics (C++11) eliminate unnecessary deep copies when transferring ownership of resources. An rvalue reference (`T&&`) binds to temporaries and objects being moved. `std::move` is a cast that enables move operations — it does not move anything itself. RVO/NRVO allow the compiler to construct return values directly in the caller's memory, skipping the move entirely. Together, these make returning large objects from functions as cheap as returning an `int`.

---

## lvalue vs rvalue

```cpp
// lvalue: has a name and an address — can appear on the left of assignment
int x = 42;       // x is an lvalue
int *p = &x;      // OK — can take address of lvalue

// rvalue: a temporary — no persistent address, expires at the end of the expression
int y = x + 1;    // (x + 1) is an rvalue — temporary int
// int *q = &(x + 1);  // ERROR: cannot take address of rvalue

// lvalue reference: T& — binds only to lvalues
int& ref = x;     // OK
// int& bad = 42; // ERROR: cannot bind lvalue reference to rvalue (unless const)
const int& cref = 42;   // OK: const lvalue reference extends temporary lifetime

// rvalue reference: T&& — binds only to rvalues (temporaries and moved-from objects)
int&& rref = 42;         // OK: binds to temporary 42
int&& rref2 = x + 1;    // OK: binds to temporary (x+1)
// int&& bad = x;        // ERROR: x is an lvalue
```

---

## `std::move` and Move Constructor

```cpp
#include <iostream>
#include <utility>   // std::move

class Buffer {
    size_t size_;
    int   *data_;
public:
    // Constructor
    explicit Buffer(size_t n) : size_(n), data_(new int[n]()) {
        std::cout << "alloc " << n << "\n";
    }
    // Destructor
    ~Buffer() { delete[] data_; std::cout << "free " << size_ << "\n"; }

    // Copy constructor — expensive deep copy
    Buffer(const Buffer& other) : size_(other.size_), data_(new int[other.size_]) {
        std::copy(other.data_, other.data_ + size_, data_);
        std::cout << "copy " << size_ << "\n";
    }

    // Move constructor — cheap O(1) steal
    Buffer(Buffer&& other) noexcept
        : size_(other.size_), data_(other.data_) {
        other.data_ = nullptr;   // prevent double-delete
        other.size_ = 0;
        std::cout << "move\n";
    }

    // Move assignment
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;  size_ = other.size_;
            other.data_ = nullptr; other.size_ = 0;
        }
        return *this;
    }

    size_t size() const { return size_; }
};

int main() {
    Buffer a(1000);          // alloc 1000
    Buffer b = std::move(a); // move — NOT a copy!  a.data_ is now nullptr
    std::cout << "a.size=" << a.size() << "\n";  // 0 — moved from
    std::cout << "b.size=" << b.size() << "\n";  // 1000

    // std::move is just a cast to T&& — it does NOT move anything by itself
    // The actual moving happens in the move constructor/assignment
    Buffer c(500);           // alloc 500
    Buffer d(100);           // alloc 100
    d = std::move(c);        // move assignment — d.data_ freed, then steals c.data_
}
```

---

## Perfect Forwarding

```cpp
#include <utility>
#include <vector>
#include <string>

// WITHOUT perfect forwarding: one overload for each value category
template <typename T>
void add_copy(std::vector<T>& v, const T& val) { v.push_back(val); }   // copies

template <typename T>
void add_move(std::vector<T>& v, T&& val) { v.push_back(std::move(val)); }  // moves

// WITH perfect forwarding: ONE function handles both lvalues and rvalues
// std::forward<T>(val) casts val to T& if T is lvalue ref, T&& if T is rvalue ref
template <typename T>
void add(std::vector<T>& v, T&& val) {
    v.push_back(std::forward<T>(val));
}

// Factory function using perfect forwarding — emplace pattern
template <typename T, typename... Args>
T* create(Args&&... args) {
    return new T(std::forward<Args>(args)...);
    // If args are lvalues → forwarded as lvalues (copy constructed)
    // If args are rvalues → forwarded as rvalues (move constructed)
}

int main() {
    std::vector<std::string> v;
    std::string s = "hello";
    add(v, s);                    // lvalue: copies s (s still valid after)
    add(v, std::string("world")); // rvalue: moves temporary (no copy)
    add(v, std::move(s));         // explicitly move s (s is now in valid-but-empty state)
}
```

---

## Return Value Optimization (RVO/NRVO)

The compiler is allowed (and often required in C++17) to construct a return value directly in the caller's memory, completely eliminating the move/copy:

```cpp
#include <vector>
#include <iostream>

// NRVO (Named RVO): compiler constructs 'result' directly in caller's v
std::vector<int> make_vector(int n) {
    std::vector<int> result;    // may be constructed directly in caller's storage
    result.reserve(n);
    for (int i = 0; i < n; i++) result.push_back(i);
    return result;              // no copy, no move — the object IS already there
}

std::vector<int> v = make_vector(1000);  // zero copies, zero moves (with NRVO)

// RVO: unnamed return — compiler ALWAYS eliminates the copy (C++17 mandatory)
std::vector<int> make_small() {
    return std::vector<int>{1, 2, 3};   // temporary constructed directly in caller
}

// Anti-pattern that PREVENTS RVO/NRVO — DON'T do this:
std::vector<int> bad_return(int n) {
    std::vector<int> result(n);
    return std::move(result);   // explicitly moving prevents NRVO!
    // The compiler cannot construct result in the caller's memory
    // because std::move explicitly produces an rvalue
    // Net effect: WORSE than just returning result
}
```

---

## Move-Only Types

```cpp
#include <memory>
#include <fstream>
#include <thread>

// std::unique_ptr is move-only — expresses sole ownership
std::unique_ptr<int> p = std::make_unique<int>(42);
// auto q = p;             // ERROR: deleted copy constructor
auto q = std::move(p);     // OK: p is now null

// std::ofstream, std::thread, std::mutex are also move-only
std::thread t([] { std::cout << "thread\n"; });
// std::thread t2 = t;     // ERROR: threads are not copyable
std::thread t2 = std::move(t);   // OK: transfer ownership
t2.join();
```

---

## Common Pitfalls

- **Using a moved-from object:** After `std::move(x)`, `x` is in a "valid but unspecified state." It is safe to destroy or reassign, but reading its value produces implementation-defined results. The convention is to treat moved-from objects as empty.
- **`return std::move(local)` prevents RVO:** Explicitly moving a named local variable in a return statement disables NRVO. The compiler cannot elide the move when `std::move` is present. Just write `return local_var;` — the compiler applies NRVO automatically.
- **Non-`noexcept` move constructors:** `std::vector` reallocation uses move only if the move constructor is `noexcept`. Without `noexcept`, it falls back to copying (to maintain strong exception safety). Always mark move constructors and move assignments `noexcept`.
- **`std::move` on a const object:** `const T&&` binds to a const rvalue reference, but the move constructor takes `T&&` (non-const). A `std::move` on a const object silently falls back to a copy. Mark move sources non-const.

---

## Review Questions

1. What is the difference between an lvalue and an rvalue? Give an example of each and explain why rvalue references were added to C++.
2. `std::move(x)` — does this move `x`? Explain precisely what it does and what code actually performs the move.
3. Why should move constructors be marked `noexcept`? What happens to `std::vector` reallocation performance if they are not?
4. Explain RVO and NRVO. Why does `return std::move(result)` actually make code slower rather than faster?

---

#C #Cpp
