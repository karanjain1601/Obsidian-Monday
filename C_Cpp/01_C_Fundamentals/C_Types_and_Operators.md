---
title: C Types and Operators
aliases: [C Data Types, C Operators, C Integer Promotion, C Type Casting]
tags: [C, Cpp, types, operators, casting, integer-promotion]
domain: C_Cpp
difficulty: Beginner
created: 2026-07-29
related:
  - "[[C_Overview]]"
  - "[[C_Pointers_and_Memory]]"
  - "[[C_Structs_and_Unions]]"
status: complete
---

# C Types and Operators

> [!abstract] TL;DR
> C's type system is built on primitive types whose sizes are platform-dependent (except in `<stdint.h>`), signed/unsigned variants that change arithmetic behavior dramatically, and a rich operator set that follows strict precedence rules. Integer promotion rules silently convert small types to `int` in expressions, causing subtle bugs when unsigned narrowing wraps around.

---

## Primitive Types and Sizes

C's built-in types do not have fixed sizes — only minimum guarantees. Use `<stdint.h>` (`int32_t`, `uint64_t`, etc.) when exact widths matter.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>   // C99: _Bool, bool, true, false

int main(void) {
    // Basic types — sizes vary by platform/ABI
    printf("char:      %zu\n", sizeof(char));        // always 1
    printf("short:     %zu\n", sizeof(short));       // >= 2
    printf("int:       %zu\n", sizeof(int));         // >= 2, usually 4
    printf("long:      %zu\n", sizeof(long));        // >= 4, 8 on LP64 Linux
    printf("long long: %zu\n", sizeof(long long));   // >= 8
    printf("float:     %zu\n", sizeof(float));       // usually 4 (IEEE 754)
    printf("double:    %zu\n", sizeof(double));      // usually 8 (IEEE 754)

    // Fixed-width types from <stdint.h> — portable across all platforms
    int8_t  a = -128;       uint8_t  b = 255;
    int16_t c = -32768;     uint16_t d = 65535;
    int32_t e = -2147483648; uint32_t f = 4294967295U;
    int64_t g = -9223372036854775807LL;

    // _Bool (C99) — only stores 0 or 1; any non-zero value becomes 1
    _Bool flag = 5;         // flag == 1
    bool  flag2 = (3 > 2);  // true (requires <stdbool.h>)

    return 0;
}
```

---

## Signed vs Unsigned

The distinction between signed and unsigned is one of C's most dangerous dark corners:

```c
#include <stdio.h>

int main(void) {
    // Signed overflow is UNDEFINED BEHAVIOR — the compiler may assume it never happens
    int max = 2147483647;
    // int overflow = max + 1;  // UB — compiler may "optimize" surrounding code away!

    // Unsigned overflow is well-defined: wraps modulo 2^N
    unsigned int u = 4294967295U;
    unsigned int wrap = u + 1;   // 0 — defined, wraps to zero

    // Dangerous: mixing signed and unsigned in comparisons
    int neg = -1;
    unsigned int pos = 1;
    if (neg < pos) {   // FALSE! -1 promoted to huge unsigned value
        printf("never reached\n");
    }
    // Fix: cast explicitly
    if (neg < (int)pos) {
        printf("correctly reached\n");
    }

    // Unsigned subtraction wrap-around (buffer length check anti-pattern)
    unsigned int len = 0;
    // if (len - 1 > 10) { ... }  // ALWAYS TRUE — wraps to UINT_MAX

    return 0;
}
```

---

## Type Casting

```c
#include <stdio.h>

int main(void) {
    double pi = 3.14159;

    // Implicit conversion (widening — safe)
    float f = pi;       // double → float, precision loss but no UB
    double d = 42;      // int → double, exact

    // Explicit cast (narrowing — programmer takes responsibility)
    int truncated = (int)pi;     // 3 — truncates, does not round
    char c = (char)300;          // implementation-defined for overflow

    // Cast for correct division
    int a = 7, b = 3;
    double ratio = (double)a / b;     // 2.333... — cast before division
    double wrong = (double)(a / b);   // 2.0 — division done in int, then cast

    printf("ratio=%.3f wrong=%.3f\n", ratio, wrong);

    return 0;
}
```

---

## Operators and Precedence

| Priority | Operators | Associativity |
|----------|-----------|---------------|
| 1 (high) | `()` `[]` `.` `->` `++` `--` (postfix) | Left-to-right |
| 2 | `!` `~` `-` `+` `++` `--` (prefix) `*` `&` `sizeof` `(type)` | Right-to-left |
| 3 | `*` `/` `%` | Left-to-right |
| 4 | `+` `-` | Left-to-right |
| 5 | `<<` `>>` | Left-to-right |
| 6 | `<` `<=` `>` `>=` | Left-to-right |
| 7 | `==` `!=` | Left-to-right |
| 8–10 | `&` `^` `\|` | Left-to-right |
| 11–12 | `&&` `\|\|` | Left-to-right |
| 13 | `?:` | Right-to-left |
| 14 (low) | `=` `+=` `-=` etc. | Right-to-left |

**Bitwise operators — common patterns:**

```c
#include <stdio.h>
#include <stdint.h>

int main(void) {
    uint8_t flags = 0b10110100;

    // Test bit N
    int N = 2;
    int bit_set = (flags >> N) & 1;   // 1 if bit 2 is set

    // Set bit N
    flags |= (1U << N);

    // Clear bit N
    flags &= ~(1U << N);

    // Toggle bit N
    flags ^= (1U << N);

    // Extract lower nibble
    uint8_t lo = flags & 0x0F;

    // Check power of two
    uint32_t n = 64;
    int is_pow2 = (n > 0) && ((n & (n - 1)) == 0);   // 1

    printf("bit=%d lo=0x%02X pow2=%d\n", bit_set, lo, is_pow2);
    return 0;
}
```

---

## Integer Promotion Rules

In any arithmetic expression, types smaller than `int` are automatically promoted to `int` (or `unsigned int` if the value cannot fit in `int`). This happens before the operation executes.

```c
#include <stdio.h>

int main(void) {
    // Integer promotion: char operands promoted to int before subtraction
    char a = 200, b = 100;
    // a and b are both promoted to int (200 and 100)
    // result is int, not char — no overflow here
    int diff = a - b;           // 100 (correct)

    // Usual arithmetic conversions: smaller type → larger type
    int i = 10;
    long l = 100L;
    long result = i + l;        // i promoted to long first

    // Dangerous promotion with unsigned
    unsigned char uc = 200;
    int promoted = uc - 300;    // uc → int(200), then 200-300 = -100 (int)
    printf("promoted=%d\n", promoted);   // -100

    return 0;
}
```

---

## Common Pitfalls

- **`sizeof` returns `size_t` (unsigned):** `sizeof(array) - sizeof(larger_type)` wraps to a huge value if the subtraction would be negative. Always cast to `ptrdiff_t` or `int` before subtracting sizes.
- **Floating-point equality:** `0.1 + 0.2 == 0.3` is `false` in IEEE 754. Compare with a tolerance: `fabs(a - b) < 1e-9`.
- **`%` with negative operands:** In C99+, `(-7) % 3 == -1` (result has sign of dividend). In C89 this was implementation-defined.
- **Operator `=` vs `==` in conditions:** `if (x = 5)` assigns 5 and tests it (always true). Enable `-Wall` which warns on this.

---

## Review Questions

1. On a 64-bit Linux system (LP64), what are the sizes of `int`, `long`, and `long long`? How does this differ from 64-bit Windows (LLP64)?
2. Why does `if (-1 < 1u)` evaluate to false in C? What conversion happens, and how do you write the comparison correctly?
3. What is integer promotion? Give an example where failing to account for it causes a subtle arithmetic bug.
4. A function computes `(end - start)` where both are `size_t`. Why might the result be wrong when `start > end`, and how do you fix it?

---

#C #Cpp
