---
title: Inline Assembly in C
aliases: [Inline Assembly, GCC asm volatile, Constraints, Clobbers, Extended ASM]
tags: [Computer_Architecture, Assembly_RISCV, Inline_Assembly, GCC]
domain: Computer_Architecture
difficulty: Advanced
created: 2026-07-26
related: [Assembly_Programming, ABI_and_Calling_Conventions, RISCV_Extensions]
status: complete
---

# ⚙️ Inline Assembly in C

> [!abstract] TL;DR
> GCC inline assembly (`asm volatile`) embeds assembly instructions directly in C code with bidirectional data flow via output (=r) and input (r) operand constraints. The constraint language specifies how operands are stored: `r` = any register, `m` = memory operand, `i` = immediate constant, `=` = write-only output, `+` = read-write output. The clobber list tells GCC which registers are destroyed (`"cc"` for condition codes, `"memory"` for all memory accesses). `volatile` prevents the compiler from removing or reordering the asm. RISC-V has specific constraints: `r` (general register), `f` (FP register), `A` (address operand).

## Intuition — analogy FIRST

Inline assembly is like a bilingual passport officer (GCC) who speaks both C and assembly. The operand constraints are the officer's forms: "Output: put result in any register you choose (=r)". "Input: this variable must be in a register (r)." The clobber list is the officer's hazard warning: "After this section of code, these registers are dirty — don't trust them anymore." Without proper constraints, the officer may file the forms wrong and give you someone else's passport.

---

## How It Works

### Basic Inline Assembly Syntax

```c
asm [volatile] (
    "assembly template"          /* instructions with %0, %1... substitutions */
    : outputs                    /* [=|+][r|m|i] constraint(variable) */
    : inputs                     /* [r|m|i] constraint(expression) */
    : clobbers                   /* "cc", "memory", "reg_name", ... */
);
```

**Simple example — no operands**:
```c
// Force a full memory barrier
asm volatile ("fence rw, rw");

// NOP
asm volatile ("nop");
```

**With operands**:
```c
int a = 5, b = 10, sum;

asm volatile (
    "add %0, %1, %2"     /* %0 = output, %1 = input1, %2 = input2 */
    : "=r" (sum)          /* output: sum → any register */
    : "r" (a), "r" (b)   /* inputs: a, b → any registers */
    :                     /* no clobbers */
);
// Equivalent to: sum = a + b;
```

### Constraint Codes

**Output/Input constraint modifiers**:
| Modifier | Meaning |
|----------|---------|
| `=` | Write-only output (value before asm is discarded) |
| `+` | Read-write operand (read before asm, written by asm) |
| `&` | Early clobber: written before inputs are consumed (prevents sharing with inputs) |

**Register/Memory constraints**:
| Constraint | Meaning | Example |
|------------|---------|---------|
| `r` | Any general-purpose register | `int x; asm("mv %0, x0" : "=r"(x))` |
| `f` | Any floating-point register (F/D ext) | `float f; asm("..." : "=f"(f))` |
| `m` | Any memory operand (base+offset) | `asm("lw %0, %1" : "=r"(x) : "m"(*ptr))` |
| `i` | Immediate integer constant | `asm("addi %0, %1, %2" : "=r"(y) : "r"(x), "i"(5))` |
| `n` | Immediate integer (known at compile time) | similar to `i` |
| `0`-`9` | Match a previous operand (tied constraint) | `"=r"(x)` tied to `"0"(x)` for read-write |

**Clobbers**:
| Clobber | Meaning |
|---------|---------|
| `"cc"` | Assembly modifies condition codes / flags |
| `"memory"` | Assembly reads/writes memory beyond declared operands (compiler memory barrier) |
| `"t0"`, `"a0"` | Specific register names (RISC-V: use ABI names) |

### Operand Substitution in Template

```c
int rdtsc_result;  // for illustration

asm volatile (
    "csrr %0, cycle"          /* %0 = first output operand */
    : "=r" (rdtsc_result)     /* output: %0 → rdtsc_result */
    :                          /* no inputs */
    :                          /* no clobbers */
);
// rdtsc_result now contains RISC-V cycle counter
```

**Multiple operands and %N naming**:
```c
unsigned long cas_result, old_val;
int *mem_ptr;

// Atomic compare-and-swap: if *mem_ptr == old_val, replace with new_val
asm volatile (
    "1:                        \n"   /* local label 1 */
    "   lr.w    %0, (%2)       \n"   /* %0=output, %2=input */
    "   bne     %0, %3, 2f    \n"   /* %3=input (old_val) */
    "   sc.w    %1, %4, (%2)  \n"   /* %1=output (success), %4=input (new_val) */
    "   bnez    %1, 1b         \n"   /* retry if sc failed */
    "2:                        \n"
    : "=&r" (cas_result), "=&r" (old_val)  /* &=early clobber */
    : "r" (mem_ptr), "r" (expected), "r" (new_val)
    : "memory"               /* tells compiler mem may have changed */
);
```

### Read-Write Operands (Tied Constraint)

```c
int counter = 0;

// Increment counter using asm (read-write)
asm volatile (
    "addi %0, %0, 1"       /* %0 is both read and written */
    : "+r" (counter)        /* "+r" = read-write */
);
// counter == 1

// Alternative using tied constraint (older style):
asm volatile (
    "addi %0, %1, 1"       /* %0 = output, %1 = input tied to %0 */
    : "=r" (counter)        /* %0 = output */
    : "0" (counter)         /* %1 = same register as %0 (tied) */
);
```

### Common Patterns

**Memory barrier**:
```c
#define mb()  asm volatile ("fence rw, rw" ::: "memory")
#define wmb() asm volatile ("fence w, w"   ::: "memory")
#define rmb() asm volatile ("fence r, r"   ::: "memory")
```

**Atomic fetch-and-add**:
```c
static inline int atomic_fetch_add(volatile int *ptr, int val) {
    int result;
    asm volatile (
        "amoadd.w.aqrl %0, %2, (%1)"  // full-fence atomic add
        : "=r" (result)
        : "r" (ptr), "r" (val)
        : "memory"
    );
    return result;
}
```

**RISC-V CSR access** (privileged):
```c
// Read a CSR (Control and Status Register)
#define csr_read(csr) ({                           \
    unsigned long __val;                           \
    asm volatile ("csrr %0, " #csr                 \
                  : "=r" (__val) :: "memory");     \
    __val;                                         \
})

// Write a CSR
#define csr_write(csr, val) ({                     \
    asm volatile ("csrw " #csr ", %0"              \
                  :: "rK" (val) : "memory");       \
})

// Usage:
unsigned long cycle = csr_read(cycle);      // read performance counter
csr_write(stvec, (unsigned long)trap_handler); // set trap vector
```

**Prefetch hint**:
```c
// Software prefetch (if V or Zicbop extension)
#define prefetch(addr) \
    asm volatile ("" : : "r"(addr) : "memory")  // compiler hint
    // or: asm volatile ("prefetch.i %0" :: "A"(*(addr)))  // with Zicbop
```

### "memory" Clobber — Compiler Barrier

Without `"memory"` clobber:
```c
int x = 0;
asm volatile ("fence rw, rw");  // WRONG: compiler may reorder C operations around this!
x = 1;                           // may be moved before fence

// With "memory" clobber: all reads/writes before asm complete before asm executes
asm volatile ("fence rw, rw" ::: "memory");  // CORRECT
x = 1;  // definitely after fence
```

The `"memory"` clobber says "treat this asm as if it reads and writes ALL memory" — preventing the compiler from reordering C memory operations across the asm boundary.

### Early Clobber (`&` modifier)

```c
int result, temp;

// WRONG without &: compiler might allocate result and an input to same register
asm volatile (
    "add %0, %1, %2  \n"
    "mul %0, %0, %3  \n"
    : "=r" (result)            // compiler might put result in same reg as a
    : "r" (a), "r" (b), "r" (c)
);
// If result and a share a register: add destroys a before mul can use it!

// CORRECT with & (early clobber):
asm volatile (
    "add %0, %1, %2  \n"
    "mul %0, %0, %3  \n"
    : "=&r" (result)           // & = must use different register from all inputs
    : "r" (a), "r" (b), "r" (c)
);
```

---

## Real-World Notes

- Linux kernel extensively uses inline asm: `arch/riscv/include/asm/atomic.h`, `barrier.h`, `csr.h`
- Clang (LLVM) supports GCC-compatible inline asm for RISC-V with same syntax
- `__attribute__((naked))` function: no prologue/epilogue generated — requires inline asm for everything (used for exception handlers)
- `asm goto` (GCC 4.5+) allows inline asm to jump to C labels — used for atomic fast-path implementations with fallback to slow path

---

## Common Pitfalls

1. **Missing "memory" clobber on memory-modifying asm** — Fence instructions, store-release, CAS operations all modify memory. Without `"memory"` clobber, compiler may reorder C loads/stores across them
2. **Wrong constraint (i vs r)** — Using `"i"` for a variable value (not compile-time constant) — assembler error or wrong value substituted. Use `"r"` for runtime values
3. **Forgetting & for early clobber** — Leads to subtle aliasing: output register = input register. The add then corrupts the input before it's used. Sporadic failures depending on register allocation
4. **Local labels in inline asm** — Using `1:` and `1b`/`1f` (backward/forward references) is correct. Using global labels causes multiple-definition errors when the asm is in a header
5. **asm not volatile — may be deleted** — GCC optimizes away asm blocks with no outputs or side effects if `volatile` is omitted. Fence-only asm MUST be `volatile`

---

## Related Concepts

- [[_MOC_Assembly_RISCV|↑ Assembly & RISC-V MOC]]
- [[Assembly_Programming]] — Pure assembly; inline asm bridges C and assembly
- [[ABI_and_Calling_Conventions]] — Inline asm must respect ABI (callee-saved regs must be preserved)
- [[RISCV_Extensions]] — A extension atomics are typically exposed through inline asm in C

---

## Review Questions

1. Write inline assembly for a RISC-V function that reads the `time` CSR (machine-mode timer) and returns it as a `uint64_t`. Use proper constraints and clobbers.
2. Explain why the following lock implementation is incorrect: `asm volatile("amoswap.w.aq %0, %2, (%1)" : "=r"(old) : "r"(&lock), "r"(1));`. What ordering is missing for a correct mutex unlock?
3. A performance-critical loop uses inline asm to compute a dot product using F extension `fmadd.s`. Write the complete inline asm including input/output constraints for float accumulators.

---

## Sources

- GCC Manual, Section "Extended Asm", gcc.gnu.org/onlinedocs/gcc
- Linux kernel source: arch/riscv/include/asm/ (atomic.h, csr.h, barrier.h)
- Lomont, C. "Introduction to x86-64 Assembly" (constraint documentation applicable to RISC-V)

#Computer_Architecture #Assembly_RISCV #Inline_Assembly #GCC
