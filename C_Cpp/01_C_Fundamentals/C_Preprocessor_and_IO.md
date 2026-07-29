---
title: C Preprocessor and IO
aliases: [C Preprocessor, C Macros, C stdio, C File IO, C include guards]
tags: [C, Cpp, preprocessor, macros, stdio, file-io]
domain: C_Cpp
difficulty: Beginner
created: 2026-07-29
related:
  - "[[C_Overview]]"
  - "[[C_Strings_and_Arrays]]"
  - "[[CMake_Build_System]]"
status: complete
---

# C Preprocessor and IO

> [!abstract] TL;DR
> The C preprocessor performs textual substitution before compilation — expanding macros, processing includes, and conditionally compiling code. It is powerful but operates on text rather than syntax, making complex macros brittle. `stdio.h` provides formatted I/O through `printf`/`scanf` and file operations through the `FILE*` abstraction. Knowing format specifiers and the difference between buffered and unbuffered I/O prevents subtle runtime bugs.

---

## Macros — Object-Like and Function-Like

```c
// object-like macro — simple text replacement
#define PI 3.14159265358979
#define MAX_BUFFER_SIZE 4096
#define ARRAY_LEN(arr) (sizeof(arr) / sizeof((arr)[0]))

// function-like macro — ALWAYS parenthesize arguments and result
// WRONG:
#define BAD_SQUARE(x)  x * x          // BAD_SQUARE(1+2) = 1+2*1+2 = 5, not 9!
// CORRECT:
#define SQUARE(x)     ((x) * (x))     // SQUARE(1+2) = ((1+2)*(1+2)) = 9

// Multi-statement macro — use do { } while (0) to make it a single statement
#define SWAP(a, b) do {      \
    typeof(a) _tmp = (a);    \
    (a) = (b);               \
    (b) = _tmp;              \
} while (0)

// Stringify and concatenate
#define STRINGIFY(x)  #x
#define CONCAT(a, b)  a##b

// Variadic macro (C99)
#define LOG(fmt, ...) fprintf(stderr, "[LOG] " fmt "\n", ##__VA_ARGS__)
```

---

## Include Guards and `#pragma once`

```c
// Traditional include guard — works with ALL compilers
#ifndef MY_HEADER_H
#define MY_HEADER_H

// header content here
void my_function(int x);
int  my_var;    // declaration only — define in .c file

#endif /* MY_HEADER_H */

// Modern alternative — single line, but non-standard (yet universally supported)
#pragma once
// header content here
```

---

## Conditional Compilation

```c
#include <stdio.h>

// Platform detection
#if defined(_WIN32) || defined(_WIN64)
    #define PLATFORM "Windows"
#elif defined(__linux__)
    #define PLATFORM "Linux"
#elif defined(__APPLE__)
    #define PLATFORM "macOS"
#else
    #define PLATFORM "Unknown"
#endif

// Feature flags — controlled by build system (gcc -DDEBUG)
#ifdef DEBUG
    #define DBG(fmt, ...) fprintf(stderr, "DEBUG %s:%d: " fmt "\n", \
                                  __FILE__, __LINE__, ##__VA_ARGS__)
#else
    #define DBG(fmt, ...) ((void)0)   // compiles to nothing in release builds
#endif

// Compile-time assertion (C11 _Static_assert, or macro for older standards)
_Static_assert(sizeof(int) == 4, "Assumes 32-bit int");

int main(void) {
    DBG("Running on %s", PLATFORM);
    printf("Platform: %s\n", PLATFORM);
    return 0;
}
```

---

## `stdio.h` — Formatted I/O

```c
#include <stdio.h>

int main(void) {
    // printf format specifiers
    int   i = -42;
    unsigned u = 255;
    long  l = 1234567890L;
    float f = 3.14f;
    double d = 2.71828182845;
    char  c = 'A';
    char *s = "hello";
    void *p = &i;

    printf("int:     %d\n",   i);          // -42
    printf("uint:    %u\n",   u);          // 255
    printf("hex:     %x %X\n", u, u);      // ff FF
    printf("octal:   %o\n",   u);          // 377
    printf("long:    %ld\n",  l);          // 1234567890
    printf("float:   %.2f\n", f);          // 3.14
    printf("double:  %e\n",   d);          // 2.718282e+00
    printf("double:  %.4g\n", d);          // 2.718 (shorter of %e/%f)
    printf("char:    %c\n",   c);          // A
    printf("string:  %s\n",   s);          // hello
    printf("pointer: %p\n",   p);          // 0x7fff... (address)
    printf("size_t:  %zu\n",  sizeof(i));  // 4

    // scanf — DANGEROUS: always specify width for strings
    int n;
    scanf("%d", &n);          // reads an integer
    char buf[32];
    scanf("%31s", buf);        // reads up to 31 chars (leaves room for '\0')
    // scanf("%s", buf);       // NO width limit — buffer overflow waiting to happen

    // fgets — safe line reading
    char line[256];
    if (fgets(line, sizeof(line), stdin) != NULL) {
        // line includes the '\n' — strip it if needed
        line[strcspn(line, "\n")] = '\0';
    }

    return 0;
}
```

---

## File I/O

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // Open a file — modes: "r" read, "w" write/create, "a" append,
    //                       "rb"/"wb" binary, "r+" read+write
    FILE *fp = fopen("data.txt", "w");
    if (fp == NULL) {
        perror("fopen");   // prints "fopen: No such file or directory"
        return EXIT_FAILURE;
    }

    // Write to file
    fprintf(fp, "Line %d: value = %.2f\n", 1, 3.14);
    fputs("Another line\n", fp);

    fclose(fp);

    // Read from file
    fp = fopen("data.txt", "r");
    if (!fp) { perror("fopen"); return EXIT_FAILURE; }

    char line[256];
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("Read: %s", line);
    }

    // Check for read error vs end-of-file
    if (ferror(fp)) perror("read error");
    // if (feof(fp)) — reached end normally

    fclose(fp);

    // Random access — fseek/ftell
    fp = fopen("data.txt", "r");
    fseek(fp, 0, SEEK_END);        // seek to end
    long file_size = ftell(fp);    // position = file size
    fseek(fp, 0, SEEK_SET);        // seek back to start
    printf("File size: %ld bytes\n", file_size);
    fclose(fp);

    return EXIT_SUCCESS;
}
```

---

## Common Pitfalls

- **Macro side effects:** `SQUARE(i++)` expands to `((i++) * (i++))` — i is incremented twice, the result is undefined. Never use expressions with side effects as macro arguments.
- **Missing `%` specifier match:** `printf("%d", some_double)` is undefined behavior. The format string and arguments must match exactly in type and count.
- **Not checking `fopen` return value:** `fopen` returns `NULL` on failure. Operating on a NULL FILE* crashes with a segfault.
- **Mixing `scanf` and `fgets`:** `scanf` leaves a `\n` in the input buffer; a subsequent `fgets` reads only the newline. Flush with `while(getchar() != '\n');` or use only one input method.
- **`#define` without parentheses:** `#define TWO_PI PI * 2` gives `3.0 / TWO_PI * 4` → `3.0 / 3.14159 * 2 * 4` instead of `3.0 / (3.14159*2) * 4`. Always parenthesize macro expressions.

---

## Review Questions

1. Why is `#define SQUARE(x) x*x` wrong? Give a specific input that produces an incorrect result and show the expanded form.
2. What is the difference between `#include <header.h>` and `#include "header.h"`? In which directories does each form search?
3. Why does `scanf("%s", buf)` constitute a security vulnerability? What is the correct way to read a word into `char buf[64]`?
4. Explain the difference between `feof(fp)` returning true and `ferror(fp)` returning true. Why is `while (!feof(fp))` considered an anti-pattern for reading files?

---

#C #Cpp
