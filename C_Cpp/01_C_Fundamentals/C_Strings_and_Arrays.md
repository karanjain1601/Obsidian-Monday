---
title: C Strings and Arrays
aliases: [C Strings, C Arrays, string.h, C char arrays, C array decay]
tags: [C, Cpp, strings, arrays, string.h, buffer-overflow]
domain: C_Cpp
difficulty: Beginner
created: 2026-07-29
related:
  - "[[C_Pointers_and_Memory]]"
  - "[[C_Preprocessor_and_IO]]"
  - "[[Cpp_STL_Containers]]"
status: complete
---

# C Strings and Arrays

> [!abstract] TL;DR
> C strings are null-terminated `char` arrays — a design that makes them fast but treacherous. Every string function in `string.h` must be used with explicit length limits to prevent buffer overflows. Arrays decay to pointers when passed to functions, losing their size information and forcing programmers to pass length as a separate argument.

---

## Char Arrays vs String Literals

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    // String literal — stored in read-only memory (text/data segment)
    const char *literal = "hello";   // pointer to read-only string
    // literal[0] = 'H';             // UNDEFINED BEHAVIOR — may segfault

    // Char array — mutable copy on the stack, null-terminated
    char buf[6] = "hello";   // {'h','e','l','l','o','\0'} — needs 6 bytes!
    buf[0] = 'H';            // safe — this is a mutable copy

    // Equivalent explicit initialization
    char buf2[] = {'h', 'e', 'l', 'l', 'o', '\0'};

    // sizeof vs strlen
    printf("sizeof(buf)=%zu\n",  sizeof(buf));           // 6 (includes '\0')
    printf("strlen(buf)=%zu\n",  strlen(buf));           // 5 (excludes '\0')
    printf("sizeof(literal)=%zu\n", sizeof(literal));    // 8 (pointer size!)
    printf("strlen(literal)=%zu\n", strlen(literal));    // 5

    return 0;
}
```

---

## `string.h` — Safe vs Unsafe Functions

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char dst[32];
    const char *src = "Hello, world!";

    // ── Unsafe (no length limit) — AVOID in new code ──────────────────────────
    strcpy(dst, src);                   // copies until '\0' — overflows if src > dst
    strcat(dst, "!");                   // appends until '\0' — same risk

    // ── Safe alternatives (always prefer these) ───────────────────────────────
    strncpy(dst, src, sizeof(dst) - 1); // copies at most n bytes
    dst[sizeof(dst) - 1] = '\0';        // strncpy may not null-terminate!

    // snprintf as the safest string builder
    int n = snprintf(dst, sizeof(dst), "Value: %d", 42);
    // n is the number of chars that WOULD have been written (truncation check)
    if (n >= (int)sizeof(dst)) {
        fprintf(stderr, "Output truncated\n");
    }

    // ── Comparison ────────────────────────────────────────────────────────────
    int cmp = strcmp("abc", "abd");     // < 0 (compares lexicographically)
    int ncmp = strncmp("abcXXX", "abcYYY", 3);  // 0 (first 3 chars equal)

    // ── Search ────────────────────────────────────────────────────────────────
    char haystack[] = "Hello, world!";
    char *found = strstr(haystack, "world");   // pointer to "world..." or NULL
    char *ch    = strchr(haystack, 'o');       // pointer to first 'o' or NULL
    char *last  = strrchr(haystack, 'o');      // pointer to last 'o' or NULL

    if (found) printf("Found at index %td\n", found - haystack);  // 7

    return 0;
}
```

---

## Arrays and Array Decay

```c
#include <stdio.h>
#include <string.h>

// Arrays DECAY to a pointer to their first element when passed to functions.
// The function loses size information — you MUST pass the length separately.
void print_array(int *arr, size_t len) {
    for (size_t i = 0; i < len; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    // sizeof(arr) here is sizeof(int*) = 8, NOT the array size!
}

// Fixed-size arrays can be passed using array notation (still decays to pointer)
void fill(int arr[], size_t len, int val) {
    for (size_t i = 0; i < len; i++) arr[i] = val;
}

int main(void) {
    int nums[5] = {1, 2, 3, 4, 5};
    printf("sizeof in main: %zu\n", sizeof(nums));   // 20 (correct — 5*4)
    print_array(nums, 5);                            // sizeof inside = 8!

    // Array initialization patterns
    int zeros[10] = {0};          // all zeros
    int partial[5] = {1, 2};      // {1, 2, 0, 0, 0} — rest zero-initialized
    int sized[] = {10, 20, 30};   // compiler infers size = 3

    // Length idiom (only works in the same scope as declaration)
    size_t len = sizeof(nums) / sizeof(nums[0]);   // 5
    printf("len=%zu\n", len);

    return 0;
}
```

---

## Multidimensional Arrays

```c
#include <stdio.h>

// 2D array — stored in ROW-MAJOR order in memory
// matrix[r][c] = matrix[r * COLS + c] in flat form
#define ROWS 3
#define COLS 4

void print_matrix(int mat[ROWS][COLS]) {
    for (int r = 0; r < ROWS; r++) {
        for (int c = 0; c < COLS; c++) {
            printf("%3d ", mat[r][c]);
        }
        printf("\n");
    }
}

// Variable-length arrays (VLA) — C99, avoid for large sizes
void sum_vla(int n, int m, int mat[n][m]) {
    int total = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            total += mat[i][j];
    printf("total=%d\n", total);
}

// Dynamic 2D array (heap allocated)
int **alloc_matrix(int rows, int cols) {
    int **mat = malloc(rows * sizeof(int *));
    for (int i = 0; i < rows; i++) {
        mat[i] = malloc(cols * sizeof(int));
    }
    return mat;   // caller must free each row, then the outer array
}

int main(void) {
    int matrix[ROWS][COLS] = {
        {1,  2,  3,  4},
        {5,  6,  7,  8},
        {9, 10, 11, 12}
    };
    print_matrix(matrix);

    return 0;
}
```

---

## Common Pitfalls

- **Off-by-one in buffer sizing:** `char buf[strlen(s)]` is wrong — you need `strlen(s) + 1` for the null terminator. This is the most common C string bug.
- **`strncpy` does not guarantee null termination:** If the source is longer than `n`, `strncpy` writes `n` bytes without appending `'\0'`. Always manually set `buf[n-1] = '\0'` after `strncpy`.
- **Comparing strings with `==`:** `str1 == str2` compares pointer addresses, not string content. Always use `strcmp`.
- **Array decay in sizeof:** A function receiving `int arr[]` has no way to compute `sizeof(arr)` correctly — it is just a pointer. Pass length separately or use a struct that bundles pointer + length.
- **String literal modification:** `char *s = "hello"; s[0] = 'H';` is undefined behavior (segfault on most systems). Use `char s[] = "hello"` for a mutable copy.

---

## Review Questions

1. Why does `char buf[5] = "hello"` work in C without error, even though "hello" needs 6 bytes? What actually happens to the null terminator?
2. A function receives `char *arr` pointing to a buffer and a `size_t len`. Explain why `sizeof(arr)` inside the function does not give the buffer size and how to correctly limit operations.
3. `strncpy(dst, src, n)` — when is it possible that `dst` is not null-terminated after this call? How do you write a safe wrapper that guarantees null termination?
4. Explain the memory layout difference between `int matrix[3][4]` (stack) and the pointer-of-pointers pattern `int **matrix = alloc_matrix(3, 4)`. Which is faster for sequential access and why?

---

#C #Cpp
