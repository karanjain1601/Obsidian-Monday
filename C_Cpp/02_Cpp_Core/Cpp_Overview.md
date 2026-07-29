---
title: C++ Overview
aliases: [C++ Introduction, C++ vs C, C++ Standards, RAII, C++ Build Systems]
tags: [C, Cpp, overview, RAII, namespaces, CMake, standards]
domain: C_Cpp
difficulty: Beginner
created: 2026-07-29
related:
  - "[[C_Overview]]"
  - "[[Cpp_OOP]]"
  - "[[Cpp_Smart_Pointers]]"
  - "[[CMake_Build_System]]"
  - "[[Memory_Management_Cpp]]"
status: complete
---

# C++ Overview

> [!abstract] TL;DR
> C++ started as "C with Classes" in 1983 and evolved into a multi-paradigm language (procedural, OOP, generic, functional) while maintaining near-complete backwards compatibility with C. The modern C++ philosophy — C++11 onward — centers on RAII (Resource Acquisition Is Initialization): tie every resource lifetime to an object's lifetime so destructors guarantee cleanup without manual intervention. This single principle eliminates most C memory bugs at the language level.

---

## C++ as a Superset of C

C++ is almost (but not entirely) backwards compatible with C. Most C code compiles as C++ with minor changes:

```cpp
// This valid C code is also valid C++ (with one caveat)
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *arr = (int *)malloc(10 * sizeof(int));  // C++ requires explicit cast
    for (int i = 0; i < 10; i++) arr[i] = i;
    free(arr);
    return 0;
}
```

Key differences between C and C++:
- **`void*` assignment:** In C, `void*` implicitly converts to any pointer type. In C++, an explicit cast is required.
- **Boolean type:** C++ has a built-in `bool` (not via `<stdbool.h>`).
- **`//` comments:** Standard in C++ from the beginning; added to C in C99.
- **`const`:** In C, `const int N = 10; int arr[N];` is invalid (VLA territory). In C++, `const` variables have compile-time values and this is valid.
- **Stricter type checking:** C++ rejects many implicit conversions that C allows.

---

## C++ Standards Evolution

| Standard | Year | Key additions |
|----------|------|---------------|
| C++98 | 1998 | First standard; STL, templates, exceptions, RTTI |
| C++03 | 2003 | Bug-fix release |
| C++11 | 2011 | Move semantics, lambdas, `auto`, range-for, smart pointers, `<thread>`, `nullptr`, `constexpr`, initializer lists |
| C++14 | 2014 | Generic lambdas, `make_unique`, relaxed `constexpr` |
| C++17 | 2017 | Structured bindings, `std::optional/variant/any`, `if constexpr`, parallel algorithms, `string_view` |
| C++20 | 2020 | Concepts, Ranges, Coroutines, Modules, `std::span`, `jthread`, `<format>` |
| C++23 | 2023 | `std::expected`, `std::print`, stackful coroutines, `std::flat_map` |

Compile with: `g++ -std=c++20 -O2 -Wall -Wextra -o program main.cpp`

---

## Namespaces

Namespaces prevent name collisions across large codebases and libraries:

```cpp
#include <iostream>

namespace math {
    double pi = 3.14159265358979;

    namespace geometry {
        double circle_area(double r) { return pi * r * r; }
    }
}

int main() {
    // Full qualification — always unambiguous
    std::cout << math::geometry::circle_area(5.0) << "\n";

    // using declaration — imports one name
    using math::pi;
    std::cout << pi << "\n";

    // using directive — imports all names (AVOID in headers — pollutes caller's namespace)
    // using namespace math;  // OK in .cpp files, NEVER in headers

    // Namespace alias — shorten long names
    namespace geo = math::geometry;
    std::cout << geo::circle_area(3.0) << "\n";

    return 0;
}
```

---

## RAII — The Core C++ Principle

RAII (Resource Acquisition Is Initialization) means: acquire a resource in a constructor, release it in a destructor. Because destructors run automatically when objects go out of scope (even during exception unwinding), RAII makes resource leaks structurally impossible.

```cpp
#include <iostream>
#include <fstream>   // std::ifstream — RAII file handle
#include <memory>    // std::unique_ptr — RAII heap memory

// Custom RAII wrapper example
class FileHandle {
    FILE *fp_;
public:
    explicit FileHandle(const char *path, const char *mode) {
        fp_ = fopen(path, mode);
        if (!fp_) throw std::runtime_error("Cannot open file");
    }
    ~FileHandle() {
        if (fp_) fclose(fp_);  // guaranteed to run — even if exception thrown
    }
    // Prevent copying (two owners of one FILE* is a double-close bug)
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;

    FILE* get() { return fp_; }
};

void process_file(const char *path) {
    FileHandle f(path, "r");              // constructor opens file
    // ... use f.get() ...
    // Destructor closes file automatically — no fclose() needed
}   // even if an exception is thrown above, ~FileHandle() runs

int main() {
    // Standard RAII — std::ifstream closes itself
    {
        std::ifstream in("data.txt");     // opens in constructor
        if (!in) throw std::runtime_error("Cannot open data.txt");
        std::string line;
        while (std::getline(in, line)) {
            std::cout << line << "\n";
        }
    }   // destructor closes file here

    // RAII for heap memory — std::unique_ptr
    {
        auto ptr = std::make_unique<int[]>(1000);   // allocates 1000 ints
        ptr[0] = 42;
        // free() is called automatically here — no delete needed
    }

    return 0;
}
```

---

## Build Systems

C++ projects use build systems to manage compilation, linking, and dependencies:

```cmake
# CMakeLists.txt — minimal modern C++ project
cmake_minimum_required(VERSION 3.20)
project(MyProject VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(myapp main.cpp utils.cpp)
target_compile_options(myapp PRIVATE -Wall -Wextra)
```

```bash
# Out-of-source build workflow
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --parallel 8
./myapp
```

---

## Common Pitfalls

- **`using namespace std` in headers:** Including a `using namespace std;` in a header file forces every translation unit that includes the header to pull all `std` names into scope, causing name collisions that are difficult to diagnose.
- **Ignoring RAII:** Mixing `new`/`delete` manually in C++ code is a code smell. Use `std::unique_ptr`, `std::shared_ptr`, and standard containers — they apply RAII automatically.
- **Slicing:** Assigning a derived class object to a base class object (not pointer/reference) silently discards the derived portion. Always use pointers or references for polymorphism.

---

## Review Questions

1. What does RAII stand for, and why does it eliminate resource leaks even when exceptions are thrown?
2. Why should `using namespace std;` never appear in a header file, but is acceptable in a `.cpp` file?
3. List three features added in C++11 that fundamentally changed how modern C++ code is written.
4. In what specific case does C code fail to compile as C++ without modification? Give a minimal example involving `malloc`.

---

#C #Cpp
