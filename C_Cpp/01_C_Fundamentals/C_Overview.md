---
title: C Overview
aliases: [C Language, C Programming, C Fundamentals, C History]
tags: [C, Cpp, overview, compilation, standards]
domain: C_Cpp
difficulty: Beginner
created: 2026-07-29
related:
  - "[[C_Types_and_Operators]]"
  - "[[C_Pointers_and_Memory]]"
  - "[[CMake_Build_System]]"
  - "[[C_Cpp_Interop_and_FFI]]"
status: complete
---

# C Overview

> [!abstract] TL;DR
> C is a general-purpose, procedural, statically typed language created in 1972 at Bell Labs. It compiles directly to native machine code through a four-stage pipeline: preprocessor → compiler → assembler → linker. With minimal runtime and direct memory access, C remains the dominant language for OS kernels, embedded firmware, and any domain where hardware proximity and zero-overhead abstractions matter.

---

## History and Philosophy

Dennis Ritchie developed C at Bell Labs between 1969 and 1973 to rewrite the Unix operating system in a portable high-level language. Before C, system software was written in assembly — architecture-specific and non-portable. C's design philosophy is elegant and deliberately minimal: give programmers direct access to hardware while remaining portable across architectures. The language trusts the programmer completely, enforcing almost nothing at runtime.

**Key milestones:**

| Standard | Year | Notable additions |
|----------|------|-------------------|
| K&R C | 1978 | First informal spec (Kernighan & Ritchie book) |
| C89/C90 | 1989/1990 | First ANSI/ISO standard; function prototypes |
| C99 | 1999 | `//` comments, VLAs, `<stdbool.h>`, designated initializers, `restrict` |
| C11 | 2011 | `_Atomic`, `_Generic`, threads (`<threads.h>`), anonymous structs/unions |
| C17 | 2018 | Bug-fix release; no new features |
| C23 | 2023 | `#embed`, `nullptr`, `bool` as keyword, improved attributes |

---

## Compilation Pipeline

C source text passes through four distinct stages before becoming an executable:

```
source.c  ─→  Preprocessor  ─→  source.i (expanded C)
          ─→  Compiler       ─→  source.s (assembly)
          ─→  Assembler      ─→  source.o (object file)
          ─→  Linker         ─→  a.out / program (executable)
```

**Stage 1 — Preprocessor (`cpp`):** Textual substitution. Expands `#include`, `#define` macros, processes `#ifdef`/`#endif` directives. Produces a single translation unit of pure C with all includes pasted in.

**Stage 2 — Compiler (`cc1`):** Parses C, performs type checking and semantic analysis, and generates platform-specific assembly code. This is where most optimizations happen.

**Stage 3 — Assembler (`as`):** Converts assembly mnemonics to binary machine instructions and produces an ELF/Mach-O/COFF object file (`.o`). Contains unresolved symbol references.

**Stage 4 — Linker (`ld`):** Combines object files and static libraries (`.a`), resolves all symbol references, sets up the final memory layout, and writes the executable or shared library.

```c
// hello.c
#include <stdio.h>

int main(void) {
    printf("Hello, C!\n");
    return 0;
}
```

```bash
# Compile with gcc — observe each stage
gcc -E hello.c -o hello.i        # preprocessor output only
gcc -S hello.c -o hello.s        # compile to assembly
gcc -c hello.c -o hello.o        # compile to object file
gcc hello.o -o hello             # link to executable

# Common production flags
gcc -std=c17 -O2 -Wall -Wextra -Wpedantic -o hello hello.c

# Clang equivalents
clang -std=c17 -O2 -fsanitize=address,undefined -o hello hello.c
```

---

## Use Cases

C dominates wherever the runtime cost of abstraction is unacceptable or where the programmer must directly control hardware:

- **Operating system kernels** — Linux, FreeBSD, Windows NT kernel, macOS XNU
- **Embedded systems** — microcontrollers (AVR, ARM Cortex-M), firmware, device drivers
- **Language runtimes** — CPython interpreter, Ruby MRI, V8 JavaScript engine foundations, JVM
- **Databases** — SQLite, PostgreSQL storage engine, parts of Redis
- **Network infrastructure** — nginx, OpenSSL, network stack implementations
- **Scientific computing** — NumPy's C extensions, LAPACK, BLAS

---

## Key GCC/Clang Flags

| Flag | Meaning |
|------|---------|
| `-std=c17` | Use C17 standard (or `c99`, `c11`, `gnu17` for GNU extensions) |
| `-O0` / `-O2` / `-O3` / `-Os` | Optimization: none / moderate / aggressive / size |
| `-Wall -Wextra` | Enable standard + extended warnings |
| `-Wpedantic` | Strict ISO conformance warnings |
| `-g` | Embed debug symbols (for GDB/LLDB) |
| `-fsanitize=address` | Enable AddressSanitizer at runtime |
| `-fsanitize=undefined` | Enable UndefinedBehaviorSanitizer |
| `-fno-strict-aliasing` | Disable strict aliasing (required for some legacy code) |
| `-march=native` | Optimize for the current CPU's instruction set |

---

## Common Pitfalls

- **Implicit `int` (pre-C99):** Old code omits return types, defaulting to `int`. Always declare types explicitly.
- **Undefined behavior is not "just a bug":** The compiler assumes UB never happens and optimizes accordingly. A null pointer dereference can be optimized away entirely, making bugs invisible until deployment.
- **Missing `#include` guards:** Forgetting include guards causes duplicate definition errors when a header is included from multiple translation units.
- **`main` return value:** `return 0` signals success to the OS; non-zero signals failure. Omitting `return` in `main` is undefined behavior in C89 but returns 0 implicitly in C99+.

---

## Review Questions

1. What are the four stages of the C compilation pipeline? What artifact does each stage produce?
2. Why was C99's addition of `//` comments significant given that C89 only allowed `/* ... */` comments?
3. A colleague compiles a C file with `-O3` and finds a null pointer check disappears from the generated assembly. Explain why this can happen and how to diagnose it.
4. What is the difference between compiling with `-std=c17` and `-std=gnu17`?

---

#C #Cpp
