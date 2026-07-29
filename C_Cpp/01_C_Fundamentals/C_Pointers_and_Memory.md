---
title: C Pointers and Memory
aliases: [C Pointers, C Memory Management, malloc free, C Dynamic Memory, Buffer Overflow C]
tags: [C, Cpp, pointers, memory, malloc, heap, stack, valgrind]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[C_Overview]]"
  - "[[C_Types_and_Operators]]"
  - "[[C_Strings_and_Arrays]]"
  - "[[Memory_Management_Cpp]]"
  - "[[Cpp_Smart_Pointers]]"
status: complete
---

# C Pointers and Memory

> [!abstract] TL;DR
> Pointers are C's defining feature and its most dangerous tool: a variable that stores a memory address. Pointer arithmetic, dynamic allocation with `malloc`/`free`, and manual memory lifetime management give C unmatched performance and hardware control — but also open the door to buffer overflows, use-after-free bugs, and memory leaks that cause real-world exploits. C++ smart pointers were invented specifically to automate what C requires manually.

---

## Pointer Fundamentals

```c
#include <stdio.h>
#include <stdlib.h>   // malloc, free, NULL

int main(void) {
    int x = 42;

    int *p = &x;          // p holds the address of x
    printf("%d\n", *p);   // dereference: read value at address → 42
    *p = 100;             // dereference: write → x is now 100

    // Pointer to pointer (double pointer — common for out-parameters and 2D arrays)
    int **pp = &p;
    printf("%d\n", **pp); // 100

    // NULL pointer — guaranteed to compare unequal to any valid address
    int *null_p = NULL;
    if (null_p != NULL) {
        *null_p = 5;  // would crash — never dereference NULL
    }

    // void pointer — generic pointer, no arithmetic allowed directly
    void *generic = &x;
    int *typed = (int *)generic;   // must cast to dereference
    printf("%d\n", *typed);        // 100

    return 0;
}
```

---

## Pointer Arithmetic

Pointer arithmetic is defined only within arrays (including one past the end). Moving a pointer by `n` advances it by `n * sizeof(*pointer)` bytes.

```c
#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    int *p = arr;         // arr decays to pointer to first element

    printf("%d\n", *p);       // 10
    printf("%d\n", *(p + 2)); // 30 — p + 2 moves 2*sizeof(int) = 8 bytes
    printf("%d\n", p[3]);     // 40 — p[3] is exactly *(p + 3)

    // Iterating with pointer arithmetic
    int *end = arr + 5;   // one past the end — valid to hold, NOT to dereference
    for (int *it = arr; it != end; ++it) {
        printf("%d ", *it);
    }
    printf("\n");

    // Pointer difference — ptrdiff_t (signed)
    int *a = &arr[1];
    int *b = &arr[4];
    ptrdiff_t diff = b - a;   // 3 — number of elements between them
    printf("diff=%td\n", diff);

    return 0;
}
```

---

## Dynamic Memory Allocation

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    // malloc: allocate n bytes — UNINITIALIZED, check for NULL
    int *arr = malloc(10 * sizeof(int));
    if (arr == NULL) {
        perror("malloc failed");
        return 1;
    }

    // calloc: allocate and ZERO-INITIALIZE
    double *zeros = calloc(100, sizeof(double));  // 100 doubles, all 0.0
    if (zeros == NULL) { free(arr); return 1; }

    // realloc: resize an existing allocation
    arr = realloc(arr, 20 * sizeof(int));  // grow to 20 ints
    // DANGER: if realloc returns NULL, the original block is NOT freed
    // Correct pattern:
    int *tmp = realloc(arr, 20 * sizeof(int));
    if (tmp == NULL) {
        free(arr);    // free original before returning
        return 1;
    }
    arr = tmp;        // only update arr after confirming success

    // Use the memory
    for (int i = 0; i < 20; i++) arr[i] = i * 2;

    // free: must call exactly once per malloc/calloc/realloc
    free(arr);
    free(zeros);

    // Best practice: set pointer to NULL after free to catch use-after-free early
    arr = NULL;
    zeros = NULL;

    return 0;
}
```

---

## Stack vs Heap

```
Memory Layout (High → Low addresses):
┌─────────────────────┐ ← Stack grows DOWN
│ Stack               │   local variables, function args, return address
│ (auto-managed)      │   fast allocation (just move stack pointer)
│   ↓                 │   limited size (~8MB default on Linux)
│                     │
│   ↑                 │
│ Heap                │   malloc/free
│ (manual)            │   slow allocation (OS + allocator overhead)
│                     │   limited by virtual address space (~TBs on 64-bit)
│─────────────────────│
│ BSS  (zero data)    │   global/static variables, zero-initialized
│ Data (init data)    │   global/static variables, explicitly initialized
│ Text (code)         │   executable instructions (read-only)
└─────────────────────┘
```

---

## Memory Safety Pitfalls

**Memory leak:**
```c
// WRONG: allocate then lose the pointer
void leak(void) {
    int *p = malloc(1024);
    if (some_condition) return;   // forgot to free — leak!
    free(p);
}
// FIX: use goto cleanup or restructure to always free
```

**Use-after-free (exploitable vulnerability):**
```c
// WRONG: use memory after freeing it
int *p = malloc(sizeof(int));
*p = 42;
free(p);
printf("%d\n", *p);  // UNDEFINED BEHAVIOR — heap is reused
// The allocator may have given this memory to another part of the program.
// An attacker can control what is at *p after the free.
```

**Buffer overflow (most exploited C vulnerability):**
```c
// WRONG: no bounds check
void dangerous(const char *input) {
    char buf[64];
    strcpy(buf, input);   // copies until '\0' — no length check!
    // If input is 100 chars, we overflow buf by 36 bytes,
    // corrupting the stack frame (return address, saved registers).
    // This is the basis of stack smashing / ROP attacks.
}
// FIX: use strncpy or snprintf with explicit size limit
void safe(const char *input) {
    char buf[64];
    strncpy(buf, input, sizeof(buf) - 1);
    buf[sizeof(buf) - 1] = '\0';   // ensure null termination
}
```

---

## Detecting Memory Errors with Valgrind

```bash
gcc -g -o prog prog.c        # compile with debug symbols
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         ./prog

# Valgrind reports:
# "Invalid read/write" — buffer overflow or use-after-free
# "definitely lost" — memory leak (never freed)
# "still reachable" — pointer exists at exit but free() was never called
```

---

## Common Pitfalls

- **Returning pointer to local variable:** A local variable lives on the stack — returning its address produces a dangling pointer. The stack frame is destroyed when the function returns.
- **Double free:** Calling `free(p)` twice corrupts the heap allocator's metadata and can be exploited to write arbitrary memory. Setting `p = NULL` after `free` makes the second `free(NULL)` a safe no-op.
- **Off-by-one:** Allocating `n` bytes but writing `n+1` is valid code that compiles cleanly and crashes non-deterministically.
- **`sizeof` pointer vs array:** `sizeof(ptr)` is always 8 bytes (on 64-bit). `sizeof(array)` is total array size. When an array decays to a pointer (passed to a function), `sizeof` gives pointer size, not array size.

---

## Review Questions

1. What is the difference between `malloc(n)` and `calloc(1, n)`? When does the difference matter?
2. Explain why `free(p); *p = 5;` is not just "a bad idea" but an exploitable vulnerability.
3. Why does `int arr[10]; int *p = arr + 11;` constitute undefined behavior even if you never dereference `p`?
4. A function allocates memory and the caller is responsible for freeing it. What convention (naming, documentation) does the C standard library use for this pattern, and what alternative design avoids the problem?

---

#C #Cpp
