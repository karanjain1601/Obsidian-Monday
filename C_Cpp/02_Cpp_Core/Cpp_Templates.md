---
title: C++ Templates
aliases: [C++ Generic Programming, C++ Template Metaprogramming, C++ Concepts, SFINAE]
tags: [C, Cpp, templates, generics, concepts, metaprogramming]
domain: C_Cpp
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Cpp_Overview]]"
  - "[[Cpp_STL_Containers]]"
  - "[[Cpp_Modern_Features]]"
status: complete
---

# C++ Templates

> [!abstract] TL;DR
> Templates are C++'s compile-time generics: the compiler generates code for each type they are instantiated with, producing zero-overhead abstractions. Function templates, class templates, and template specialization are the foundation of the STL. Modern C++ adds `auto` type deduction, `if constexpr` for compile-time branching, variadic templates for arbitrary argument lists, and C++20 Concepts for readable, error-friendly template constraints.

---

## Function Templates

```cpp
#include <iostream>
#include <algorithm>

// Function template — compiler generates a version for each type T used
template <typename T>
T max_of(T a, T b) {
    return (a > b) ? a : b;
}

// Usage: compiler deduces T from arguments
int    m1 = max_of(3, 7);          // T = int
double m2 = max_of(3.14, 2.71);    // T = double
// max_of(3, 3.14);                // ERROR: T is ambiguous (int vs double)
// max_of<double>(3, 3.14);        // OK: explicit instantiation

// Multiple template parameters
template <typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {   // trailing return type
    return a + b;
}

// Non-type template parameters
template <size_t N>
struct FixedArray {
    int data[N];
    size_t size() const { return N; }
};

FixedArray<10> arr;   // N is 10 at compile time
```

---

## Class Templates and Specialization

```cpp
#include <iostream>
#include <stdexcept>

// Primary template
template <typename T>
class Stack {
    T     data_[100];
    int   top_ = -1;
public:
    void push(const T& val) {
        if (top_ >= 99) throw std::overflow_error("Stack full");
        data_[++top_] = val;
    }
    T pop() {
        if (top_ < 0) throw std::underflow_error("Stack empty");
        return data_[top_--];
    }
    bool empty() const { return top_ < 0; }
};

// Full specialization for bool — store bits compactly
template <>
class Stack<bool> {
    unsigned data_ = 0;
    int top_ = -1;
public:
    void push(bool val) { data_ = (data_ << 1) | val; ++top_; }
    bool pop()          { bool v = data_ & 1; data_ >>= 1; --top_; return v; }
    bool empty() const  { return top_ < 0; }
};

// Partial specialization — for pointer types
template <typename T>
class Stack<T*> {
    // different implementation for pointer stacks...
};
```

---

## Variadic Templates

```cpp
#include <iostream>
#include <utility>   // std::forward

// Base case — empty parameter pack
void print() { std::cout << "\n"; }

// Recursive variadic template — process one arg at a time
template <typename T, typename... Args>
void print(T first, Args... rest) {
    std::cout << first << " ";
    print(rest...);   // recursive call with one fewer argument
}

// Perfect forwarding — preserves value category (lvalue/rvalue) of each argument
template <typename... Args>
void create_and_print(Args&&... args) {
    print(std::forward<Args>(args)...);
}

// Fold expressions (C++17) — cleaner than recursion
template <typename... Args>
auto sum(Args... args) {
    return (args + ...);       // (a + (b + (c + d))) — right fold
}

template <typename... Args>
auto product(Args... args) {
    return (... * args);       // ((a * b) * c) — left fold
}

int main() {
    print(1, 2.5, "hello", 'A');     // 1 2.5 hello A
    std::cout << sum(1, 2, 3, 4);    // 10
    std::cout << product(2, 3, 4);   // 24
}
```

---

## `if constexpr` and Type Deduction

```cpp
#include <iostream>
#include <type_traits>
#include <string>

// if constexpr — compile-time branching; dead branch is not instantiated
template <typename T>
void describe(T val) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "Integer: " << val << " (even=" << (val % 2 == 0) << ")\n";
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "Float: " << val << "\n";
    } else {
        std::cout << "Other: " << val << "\n";
    }
}

// auto and decltype
auto x = 42;             // deduced as int
auto y = 3.14;           // deduced as double
auto z = std::string{};  // deduced as std::string

template <typename T>
auto identity(T val) -> decltype(val) {   // decltype: query the type of an expression
    return val;
}

// std::enable_if — SFINAE-based constraint (pre-C++20)
template <typename T,
          typename = std::enable_if_t<std::is_arithmetic_v<T>>>
T squared(T val) { return val * val; }
```

---

## C++20 Concepts

Concepts replace verbose SFINAE with readable, compiler-diagnosed constraints:

```cpp
#include <concepts>
#include <iostream>

// Define a concept — a named compile-time predicate
template <typename T>
concept Numeric = std::is_arithmetic_v<T>;

template <typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};

// Use concept as constraint
template <Numeric T>
T add(T a, T b) { return a + b; }

// Short-hand syntax (C++20)
auto multiply(Numeric auto a, Numeric auto b) { return a * b; }

// requires clause for complex constraints
template <typename T>
    requires std::is_integral_v<T> && (sizeof(T) >= 4)
T safe_shift(T val, int bits) { return val << bits; }

int main() {
    std::cout << add(3, 4);          // 7
    std::cout << multiply(2.5, 4.0); // 10.0
    // add("a", "b");  // clear error: "a" is not Numeric — concept violation
}
```

---

## Common Pitfalls

- **Template errors are verbose:** Before C++20 Concepts, a template type mismatch produced pages of cryptic errors because the compiler showed all intermediate template instantiations. Concepts dramatically improve diagnostics.
- **Include template definitions in headers:** Templates are instantiated at compile time in each translation unit that uses them. The full template definition (not just the declaration) must be in the header. Putting it only in a `.cpp` file causes "undefined reference" linker errors.
- **Accidental copies with auto:** `auto x = container.begin()` deduces a copy if `begin()` returns by value. Use `auto&` or `const auto&` to avoid unintended copies.
- **SFINAE complexity:** `std::enable_if` leads to unreadable code. Prefer `if constexpr` for local branching and Concepts (C++20) for interface constraints.

---

## Review Questions

1. What is template instantiation? Explain why putting template definitions in `.cpp` files causes linker errors.
2. What is the difference between full template specialization and partial template specialization? Give an example of each.
3. How does `if constexpr` differ from a regular `if` statement? Why does the dead branch matter for template code?
4. Rewrite `std::enable_if_t<std::is_integral_v<T>>` as a C++20 concept constraint. What advantage does the concept version have for error messages?

---

#C #Cpp
