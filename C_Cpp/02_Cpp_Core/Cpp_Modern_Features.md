---
title: C++ Modern Features
aliases: [C++11 Features, C++17 Features, C++ Lambdas, C++ optional, C++ structured bindings]
tags: [C, Cpp, modern-cpp, lambdas, auto, optional, variant, string_view]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Cpp_Overview]]"
  - "[[Cpp_Templates]]"
  - "[[Cpp_STL_Containers]]"
  - "[[Move_Semantics]]"
status: complete
---

# C++ Modern Features

> [!abstract] TL;DR
> C++11 through C++17 transformed C++ from a "better C" into an expressive modern language. Key additions: `auto` eliminates redundant type annotations, lambda expressions enable in-place function objects, `std::optional`/`variant`/`any` replace error-prone null sentinels and unions, structured bindings make destructuring readable, and `std::string_view` enables zero-copy string processing.

---

## `auto` and Type Deduction

```cpp
#include <vector>
#include <map>
#include <string>

int main() {
    // auto deduces the type at compile time — NOT dynamic typing
    auto i = 42;                      // int
    auto d = 3.14;                    // double
    auto s = std::string("hello");    // std::string (NOT const char*)

    // Avoids typing verbose iterator types
    std::map<std::string, std::vector<int>> m;
    // Old: std::map<std::string, std::vector<int>>::iterator it = m.begin();
    auto it = m.begin();              // much cleaner

    // auto& — deduce reference type (avoids copy)
    std::vector<std::string> words = {"alpha", "beta", "gamma"};
    for (auto& w : words) {           // w is std::string& — modifiable, no copy
        w += "!";
    }
    for (const auto& w : words) {     // const string& — read-only, no copy
        std::cout << w << " ";
    }

    // auto can be surprising
    const int ci = 10;
    auto x = ci;          // x is int (NOT const int) — const is stripped from values
    auto& y = ci;         // y is const int& — const preserved for references
}
```

---

## Lambda Expressions

```cpp
#include <algorithm>
#include <vector>
#include <functional>

int main() {
    std::vector<int> v = {5, 2, 8, 1, 9, 3};

    // Basic lambda: [capture](params) -> return_type { body }
    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; }); // descending

    // Capture by value [=] — copies values at the point of lambda creation
    int threshold = 5;
    auto above = [=](int x) { return x > threshold; };   // threshold copied = 5
    threshold = 100;   // does NOT affect 'above' — it captured the value 5

    // Capture by reference [&] — lambdas SEE changes to captured variables
    int count = 0;
    auto counter = [&]() { ++count; };    // count captured by reference
    counter(); counter();
    std::cout << count << "\n";            // 2

    // Mixed capture: [=, &count] — everything by value, count by reference
    // [this] — capture the current object (in member functions)
    // [self = *this] — capture a copy of *this (C++14)

    // Mutable lambda — allows modifying value captures
    auto gen = [x = 0]() mutable { return x++; };  // C++14 init-capture
    std::cout << gen() << gen() << gen();   // 0 1 2

    // Generic lambda (C++14) — effectively a template
    auto print_twice = [](auto val) { std::cout << val << " " << val << "\n"; };
    print_twice(42);
    print_twice("hello");

    // std::function — type-erased callable (heap overhead for lambdas)
    std::function<int(int)> sq = [](int x) { return x * x; };
    std::cout << sq(5);   // 25

    return 0;
}
```

---

## Structured Bindings (C++17)

```cpp
#include <map>
#include <tuple>
#include <string>
#include <utility>   // std::pair

int main() {
    // Bind map iteration
    std::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};
    for (const auto& [name, score] : scores) {
        std::cout << name << ": " << score << "\n";
    }

    // Bind pair
    std::pair<int, std::string> p = {42, "hello"};
    auto& [num, str] = p;
    num = 100;   // modifies p.first

    // Bind tuple
    std::tuple<int, double, std::string> t = {1, 3.14, "pi"};
    auto [i, d, s] = t;

    // Bind struct (all public members)
    struct Point { int x, y; };
    Point pt = {10, 20};
    auto [x, y] = pt;
    std::cout << x << " " << y << "\n";

    // Use with insert result to check if insertion occurred
    auto [it, inserted] = scores.emplace("Charlie", 92);
    if (inserted) std::cout << "New student: " << it->first << "\n";

    return 0;
}
```

---

## `std::optional`, `std::variant`, `std::any`

```cpp
#include <optional>
#include <variant>
#include <any>
#include <string>
#include <stdexcept>
#include <iostream>

// std::optional<T> — a value of T, or nothing. Replaces nullable pointers/sentinel values.
std::optional<int> parse_int(const std::string& s) {
    try { return std::stoi(s); }
    catch (...) { return std::nullopt; }   // no value
}

// std::variant<T1,T2,...> — type-safe union. Exactly ONE of the types is active.
using JsonValue = std::variant<int, double, std::string, bool>;

void print_json(const JsonValue& v) {
    std::visit([](const auto& val) {       // std::visit dispatches to correct type
        std::cout << val << "\n";
    }, v);
}

// std::any — holds any type; requires type-erased storage (heap for large types)
std::any value = 42;
value = std::string("now a string");
try {
    std::cout << std::any_cast<std::string>(value) << "\n";
    std::any_cast<int>(value);             // throws std::bad_any_cast
} catch (const std::bad_any_cast&) {
    std::cout << "Wrong type\n";
}

int main() {
    auto result = parse_int("123");
    if (result) std::cout << *result << "\n";                     // 123
    if (result.has_value()) std::cout << result.value() << "\n";  // 123
    int safe = result.value_or(-1);                               // -1 if nullopt

    auto bad = parse_int("abc");
    // bad.value();   // throws std::bad_optional_access — check has_value() first

    JsonValue jv = std::string("hello");
    print_json(jv);

    return 0;
}
```

---

## Fold Expressions (C++17)

```cpp
template <typename... Args>
bool all_positive(Args... args) {
    return (... && (args > 0));   // left fold: ((a > 0) && (b > 0)) && (c > 0)
}

template <typename... Args>
void print_all(Args&&... args) {
    (std::cout << ... << args) << "\n";   // left fold over << operator
}

template <typename T, typename... Args>
bool any_equal(T val, Args... rest) {
    return ((val == rest) || ...);        // right fold: val==a || (val==b || val==c)
}
```

---

## Common Pitfalls

- **`auto` strips references and const from values:** `const int& ref = v[0]; auto x = ref;` — `x` is `int`, not `const int&`. Use `auto&` or `const auto&` to preserve reference semantics.
- **Lambda capture by reference escaping scope:** A lambda capturing a local variable by reference outliving the variable's scope produces a dangling reference. This is a use-after-free bug.
- **`std::function` overhead:** `std::function` uses type erasure and may heap-allocate. For tight loops, prefer templates with callable parameters (avoids vtable dispatch).
- **`std::optional` value() throws:** Calling `.value()` on an empty `optional` throws `std::bad_optional_access`. Always check `.has_value()` or use `.value_or(default)`.

---

## Review Questions

1. What type does `auto x = {1, 2, 3};` deduce? How do you get a `std::vector<int>` instead?
2. A lambda captures `int counter` by value and is returned from a function. The caller increments `counter` — does the lambda see the new value? Why?
3. When is `std::variant` preferable to a base class with virtual functions? What overhead does each approach carry?
4. Why should `std::function<void()> f = []() { ... };` be avoided in a hot loop, and what is the zero-overhead alternative?

---

#C #Cpp
