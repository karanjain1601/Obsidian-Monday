---
title: C/C++ Interop and FFI
aliases: [C++ extern C, C FFI, shared libraries, dlopen, C from Python, C from Rust]
tags: [C, Cpp, interop, FFI, shared-library, extern-C, POSIX, dlopen]
domain: C_Cpp
difficulty: Advanced
created: 2026-07-29
related:
  - "[[C_Overview]]"
  - "[[Cpp_Overview]]"
  - "[[CMake_Build_System]]"
  - "[[C_Cpp_Testing_and_Debug]]"
status: complete
---

# C/C++ Interop and FFI

> [!abstract] TL;DR
> C is the lingua franca of system interoperability — virtually every language provides a Foreign Function Interface (FFI) that calls C-ABI functions. C++ code exported with `extern "C"` disables name mangling and becomes callable from C, Rust, Python, Go, and anything else that understands the C ABI. Shared libraries (`.so`/`.dll`) provide runtime-loadable code; `dlopen`/`dlsym` enable dynamic plugin architectures.

---

## `extern "C"` — C++ Calling C and Vice Versa

```cpp
// mylib.h — usable from both C and C++
#ifdef __cplusplus
extern "C" {   // C++ compiler: disable name mangling for these declarations
#endif

int  add(int a, int b);
void print_message(const char *msg);

typedef struct {
    float x, y, z;
} Vec3;

Vec3 vec3_normalize(Vec3 v);

#ifdef __cplusplus
}   // end extern "C"
#endif
```

```cpp
// mylib.cpp — C++ implementation exposed as C API
#include "mylib.h"
#include <cmath>
#include <cstdio>

extern "C" {

int add(int a, int b) { return a + b; }

void print_message(const char *msg) { printf("%s\n", msg); }

Vec3 vec3_normalize(Vec3 v) {
    float len = std::sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
    return {v.x/len, v.y/len, v.z/len};
}

}   // extern "C"
```

```c
// main.c — pure C file calling C++ code
#include "mylib.h"

int main(void) {
    printf("%d\n", add(3, 4));     // calls C++ add()
    Vec3 n = vec3_normalize((Vec3){1.0f, 1.0f, 1.0f});
    printf("%.3f %.3f %.3f\n", n.x, n.y, n.z);
    return 0;
}
```

---

## Shared Libraries (`.so` / `.dll`)

```bash
# Compile a shared library
g++ -std=c++20 -O2 -fPIC -shared -o libmylib.so mylib.cpp
# -fPIC: Position Independent Code — required for shared libs
# -shared: produce a shared library, not executable

# Link against it
gcc main.c -o myapp -L. -lmylib -Wl,-rpath,'$ORIGIN'
# -L.: search current directory for libs
# -lmylib: link against libmylib.so
# -rpath: embed runtime search path (avoids LD_LIBRARY_PATH hacks)

# On macOS: .dylib extension, use -install_name instead of -rpath
# On Windows: .dll + .lib import library, MSVC uses __declspec(dllexport)
```

```cmake
# CMakeLists.txt — build and link shared library
add_library(mylib SHARED mylib.cpp)
set_target_properties(mylib PROPERTIES
    VERSION   1.0.0
    SOVERSION 1                         # libmylib.so.1
    PUBLIC_HEADER mylib.h
)
target_compile_options(mylib PRIVATE -fvisibility=hidden)  # hide symbols by default

# Control which symbols are exported
# Use __attribute__((visibility("default"))) on public API functions
```

---

## `dlopen` / `dlsym` — Dynamic Plugin Loading

```cpp
#include <dlfcn.h>    // POSIX — Linux/macOS
#include <iostream>

int main() {
    // Load a shared library at runtime
    void *handle = dlopen("./myplugin.so", RTLD_LAZY | RTLD_LOCAL);
    if (!handle) {
        std::cerr << "dlopen error: " << dlerror() << "\n";
        return 1;
    }

    // Look up a function symbol by name
    using AddFunc = int(*)(int, int);
    AddFunc add = (AddFunc)dlsym(handle, "add");   // extern "C" name — no mangling!

    const char *err = dlerror();
    if (err) { std::cerr << "dlsym error: " << err << "\n"; dlclose(handle); return 1; }

    std::cout << "add(3,4) = " << add(3, 4) << "\n";   // 7

    dlclose(handle);   // decrement reference count; unloads when count hits 0
    return 0;
}
```

---

## Calling C from Python (ctypes)

```python
# Python ctypes — direct FFI to any C-ABI shared library (no compilation needed)
import ctypes

lib = ctypes.CDLL("./libmylib.so")  # Linux: .so, macOS: .dylib, Windows: .dll

# Declare argument and return types (default is c_int for all — wrong for floats)
lib.add.argtypes = [ctypes.c_int, ctypes.c_int]
lib.add.restype  = ctypes.c_int

result = lib.add(10, 20)   # 30

# Struct mapping
class Vec3(ctypes.Structure):
    _fields_ = [("x", ctypes.c_float), ("y", ctypes.c_float), ("z", ctypes.c_float)]

lib.vec3_normalize.argtypes = [Vec3]
lib.vec3_normalize.restype  = Vec3
v = lib.vec3_normalize(Vec3(1.0, 1.0, 1.0))
print(f"{v.x:.3f} {v.y:.3f} {v.z:.3f}")
```

---

## Calling C from Rust

```rust
// In Rust: declare external C functions
extern "C" {
    fn add(a: i32, b: i32) -> i32;
    fn print_message(msg: *const std::os::raw::c_char);
}

fn main() {
    let result = unsafe { add(3, 4) };   // unsafe: Rust cannot verify C safety
    println!("add(3,4) = {}", result);
}
```

```toml
# Cargo.toml — link against the C library
[build-dependencies]
cc = "1.0"
```

```rust
// build.rs — compile C code as part of the Rust build
fn main() {
    cc::Build::new()
        .file("src/mylib.c")
        .compile("mylib");
}
```

---

## Calling C from Go

```go
// CGO — embed C code in a Go file via special comment block
package main

/*
#include "mylib.h"
#cgo LDFLAGS: -L. -lmylib
*/
import "C"
import "fmt"

func main() {
    result := C.add(C.int(3), C.int(4))
    fmt.Println("add(3,4) =", int(result))
}
```

---

## POSIX APIs

C and C++ programs on Linux/macOS use POSIX APIs for system-level operations:

```c
#include <unistd.h>    // read, write, fork, exec, pipe, close
#include <sys/mman.h>  // mmap, munmap — memory-mapped files
#include <pthread.h>   // POSIX threads (lower level than std::thread)
#include <signal.h>    // signal handling
#include <sys/socket.h>// TCP/UDP sockets

// Memory-mapped file — zero-copy file I/O
int fd = open("data.bin", O_RDONLY);
size_t size = lseek(fd, 0, SEEK_END);
void *data = mmap(NULL, size, PROT_READ, MAP_PRIVATE, fd, 0);
// data now points directly to file contents — no read() call needed
munmap(data, size);
close(fd);
```

---

## Common Pitfalls

- **Name mangling with `extern "C"`:** A C++ function exported without `extern "C"` has a mangled name like `_Z3addi` — it cannot be found via `dlsym("add")`. Always wrap exported APIs in `extern "C"`.
- **C++ exceptions across language boundaries:** Never let a C++ exception propagate out of an `extern "C"` function into a non-C++ caller. The other language has no stack unwinding mechanism. Catch all exceptions and return an error code instead.
- **`void*` function pointer cast from `dlsym`:** On some platforms, converting `void*` to a function pointer is technically UB. The POSIX-compliant workaround is `*(void**)(&func) = dlsym(handle, name)`.
- **ABI stability:** If a shared library's struct layouts or vtable structures change across versions, all callers must be recompiled. Use opaque pointers and factory functions for stable ABI designs.

---

## Review Questions

1. Why does `extern "C"` disable name mangling? What is name mangling and why does C++ do it?
2. Explain the difference between `-rpath` and `LD_LIBRARY_PATH` for locating shared libraries at runtime. Which approach is preferred for distributed applications?
3. When calling C from Python via ctypes, what happens if you forget to set `.argtypes` and `.restype` on a function that returns a `float`? What does ctypes assume by default?
4. Why must C++ exceptions not be allowed to cross a C ABI boundary? What mechanism does C use for error propagation instead?

---

#C #Cpp
