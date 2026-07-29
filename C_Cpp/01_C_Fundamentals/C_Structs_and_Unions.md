---
title: C Structs and Unions
aliases: [C Struct, C Union, C Typedef, C Bitfields, C struct padding]
tags: [C, Cpp, structs, unions, typedef, bitfields, memory-layout]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[C_Types_and_Operators]]"
  - "[[C_Pointers_and_Memory]]"
  - "[[Cpp_OOP]]"
status: complete
---

# C Structs and Unions

> [!abstract] TL;DR
> Structs aggregate heterogeneous data into a named type; unions overlay the same memory with multiple interpretations. Both are C's foundation for compound data types and the precursor to C++ classes. Struct padding rules align members to their natural boundaries, often wasting bytes — field ordering matters for memory-sensitive code. `typedef` reduces verbosity; bitfields enable precise hardware register layout.

---

## Struct Declaration and Access

```c
#include <stdio.h>
#include <string.h>

// Struct declaration — does NOT allocate memory
struct Point {
    double x;
    double y;
};

// Nested struct
struct Rectangle {
    struct Point top_left;
    struct Point bottom_right;
};

// Use typedef to avoid writing "struct" every time
typedef struct {
    char name[64];
    int  age;
    double salary;
} Employee;

int main(void) {
    // Stack allocation — member access with dot operator
    struct Point p = {3.0, 4.0};
    printf("x=%.1f y=%.1f\n", p.x, p.y);

    // Designated initializers (C99) — order-independent, rest zero-initialized
    Employee emp = { .name = "Alice", .age = 30, .salary = 95000.0 };

    // Pointer to struct — use arrow operator (->)
    Employee *ptr = &emp;
    printf("%s age=%d salary=%.0f\n", ptr->name, ptr->age, ptr->salary);
    // ptr->age is exactly (*ptr).age — arrow is syntactic sugar

    // Heap-allocated struct
    Employee *heap_emp = malloc(sizeof(Employee));
    if (!heap_emp) return 1;
    strncpy(heap_emp->name, "Bob", sizeof(heap_emp->name) - 1);
    heap_emp->age = 25;
    heap_emp->salary = 70000.0;
    free(heap_emp);

    return 0;
}
```

---

## Struct Padding and Alignment

The compiler inserts padding bytes between fields so each field starts at an address that is a multiple of its size. This can cause surprising size bloat:

```c
#include <stdio.h>
#include <stddef.h>   // offsetof

// BAD layout — wastes 5 bytes of padding
struct Padded {
    char   a;      // 1 byte at offset 0
    // 3 bytes padding (int needs 4-byte alignment)
    int    b;      // 4 bytes at offset 4
    char   c;      // 1 byte at offset 8
    // 7 bytes padding (double needs 8-byte alignment)
    double d;      // 8 bytes at offset 16
};                 // total: 24 bytes

// GOOD layout — fields ordered large → small: 0 padding
struct Compact {
    double d;      // 8 bytes at offset 0
    int    b;      // 4 bytes at offset 8
    char   a;      // 1 byte at offset 12
    char   c;      // 1 byte at offset 13
    // 2 bytes padding to align struct to 8-byte boundary
};                 // total: 16 bytes

int main(void) {
    printf("Padded:  %zu bytes\n", sizeof(struct Padded));   // 24
    printf("Compact: %zu bytes\n", sizeof(struct Compact));  // 16
    printf("offset of b in Padded: %zu\n", offsetof(struct Padded, b));  // 4

    return 0;
}
```

---

## Unions — Memory Overlapping

A `union` allocates only enough memory for its largest member. All members share the same starting address:

```c
#include <stdio.h>
#include <stdint.h>

// Classic use: inspect float bit representation
union FloatBits {
    float    f;
    uint32_t bits;
};

// Tagged union — discriminated union pattern (safe union)
typedef enum { TYPE_INT, TYPE_FLOAT, TYPE_STRING } ValueType;

typedef struct {
    ValueType type;
    union {
        int    i;
        float  f;
        char  *s;
    } data;   // C11: anonymous union would allow direct data.i access
} Value;

int main(void) {
    union FloatBits fb;
    fb.f = 1.0f;
    printf("1.0f as hex: 0x%08X\n", fb.bits);   // 0x3F800000

    Value v = { .type = TYPE_INT, .data.i = 42 };
    if (v.type == TYPE_INT) printf("int: %d\n", v.data.i);

    // DANGER: reading the wrong union member is undefined behavior
    // (except for type-punning via char* or specific compiler extensions)
    union { int i; float f; } bad;
    bad.i = 42;
    // printf("%f\n", bad.f);  // UB in strict C — implementation-defined in practice

    return 0;
}
```

---

## Typedef and Bitfields

```c
#include <stdio.h>
#include <stdint.h>

// typedef for opaque pointer pattern (information hiding)
typedef struct Node Node;   // forward declaration
struct Node {
    int   value;
    Node *next;   // self-referential via typedef
};

// Bitfields — precise layout for hardware registers, protocol headers
typedef struct {
    uint8_t  present  : 1;   // 1 bit
    uint8_t  writable : 1;   // 1 bit
    uint8_t  user     : 1;   // 1 bit
    uint8_t  reserved : 5;   // 5 bits — fills the byte
} PageTableFlags;

// Flexible array member (C99) — dynamically sized struct
typedef struct {
    size_t count;
    int    data[];   // zero-length array at end; must be last member
} IntArray;

int main(void) {
    PageTableFlags flags = { .present = 1, .writable = 1, .user = 0 };
    printf("flags size: %zu\n", sizeof(flags));  // 1 byte

    // Flexible array member — allocate with extra space
    size_t n = 5;
    IntArray *arr = malloc(sizeof(IntArray) + n * sizeof(int));
    arr->count = n;
    for (size_t i = 0; i < n; i++) arr->data[i] = (int)i * 10;
    free(arr);

    return 0;
}
```

---

## Common Pitfalls

- **Struct comparison with `==`:** C has no built-in struct equality. `memcmp(&s1, &s2, sizeof(s1))` works only if padding bytes are guaranteed zero (they usually are not). Write a field-by-field comparison function.
- **Padding assumptions across compilers:** `__attribute__((packed))` (GCC) removes padding for network/file protocols, but packed structs cause unaligned access — a crash on ARM, a performance penalty on x86.
- **Union type-punning:** Reading a union member different from the last-written one is UB in standard C. Use `memcpy` between types for safe type punning: `memcpy(&f, &i, sizeof(f))`.
- **VLA structs:** Putting a flexible array member anywhere but the last position is a compile error. Forgetting to allocate the extra space corrupts memory silently.

---

## Review Questions

1. Given `struct { char a; int b; char c; double d; }`, calculate the size of this struct on a 64-bit x86 system. Show where the padding bytes are inserted.
2. What is the purpose of `offsetof(struct T, member)`? Give a use case where a function needs to know the byte offset of a struct field.
3. Why is reading `union.float_field` after writing `union.int_field` undefined behavior in standard C, even though they share the same memory?
4. Explain the opaque pointer pattern: how does `typedef struct Node Node;` combined with putting the full definition in a `.c` file achieve information hiding in C?

---

#C #Cpp
