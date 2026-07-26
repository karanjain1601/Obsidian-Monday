---
title: Assembly Programming
aliases: [RISC-V Assembly, GAS, GNU Assembler, Stack Frames, Pseudoinstructions, GDB Assembly]
tags: [Computer_Architecture, Assembly_RISCV, Assembly_Programming, GAS]
domain: Computer_Architecture
difficulty: Intermediate
created: 2026-07-26
related: [RISCV_ISA_Fundamentals, ABI_and_Calling_Conventions, Inline_Assembly_in_C]
status: complete
---

# 💻 Assembly Programming

> [!abstract] TL;DR
> Assembly programming translates algorithm logic directly to machine instructions. GNU Assembler (GAS/as) uses AT&T syntax conventions adapted for RISC-V: directives define data and sections (`.section .text`, `.word`, `.string`), labels mark addresses, and pseudoinstructions (`li`, `la`, `mv`, `ret`) expand to 1–2 real instructions. Stack frames reserve space for local variables and saved registers — aligned to 16 bytes on RISC-V UNIX ABI. GDB is the primary debug tool: `break`, `stepi`, `info registers`, `x/4xw $sp`.

## Intuition — analogy FIRST

Writing assembly is like composing a recipe with atomic steps (no shortcuts) — instead of "make a roux," you write "melt 2 tbsp butter, whisk in 2 tbsp flour, stir for 2 minutes." Every high-level operation (loop, function call, array access) becomes a precise sequence of register operations. The pseudoinstructions (`li`, `la`) are the assembler's "shorthand" — they expand to real instructions but let you write `li a0, 12345` instead of `lui`/`addi` pairs.

---

## How It Works

### GNU Assembler (GAS) Structure

```asm
# File: hello.s
# RISC-V RV64 Linux assembly (riscv64-linux-gnu-as)

    .section .data
msg:
    .string "Hello, World!\n"   # null-terminated string
    .align 4                    # align next symbol to 4-byte boundary
count:
    .word   42                  # 32-bit integer = 42
arr:
    .word   1, 2, 3, 4, 5      # array of 5 ints

    .section .text
    .globl  main                # export symbol (linker sees it)
    .type   main, @function     # symbol type (optional, for debuggers)
main:
    # Function prologue
    addi    sp, sp, -16         # allocate 16 bytes on stack
    sd      ra, 8(sp)           # save return address
    sd      s0, 0(sp)           # save frame pointer

    # Load address of msg
    la      a0, msg             # a0 = address of msg (pseudoinstruction)
    
    # Call puts
    call    puts                # pseudoinstruction: auipc+jalr or jal

    # Function epilogue  
    ld      ra, 8(sp)           # restore return address
    ld      s0, 0(sp)           # restore frame pointer
    addi    sp, sp, 16          # deallocate stack frame
    li      a0, 0               # return 0
    ret                         # pseudoinstruction: jalr x0, ra, 0
    .size   main, .-main        # symbol size (for debuggers)
```

### Common GAS Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `.section .text` | Switch to code section | `.section .text` |
| `.section .data` | Switch to data section | `.section .data` |
| `.section .bss` | Uninitialized data | `.section .bss` |
| `.globl sym` | Export symbol (linker) | `.globl main` |
| `.type sym, @function` | Symbol is a function | `.type foo, @function` |
| `.word val` | 32-bit integer | `.word 0xDEAD` |
| `.dword val` | 64-bit integer | `.dword 0xDEADBEEF` |
| `.string "s"` | Null-terminated string | `.string "hi\n"` |
| `.ascii "s"` | String without null | `.ascii "AB"` |
| `.byte val` | 8-bit integer | `.byte 0xFF` |
| `.align n` | Align to 2^n bytes | `.align 3` (8-byte) |
| `.balign n` | Align to n bytes | `.balign 4` |
| `.equ sym, val` | Define constant | `.equ N, 256` |
| `.space n` | Reserve n zero bytes | `.space 1024` |

### Pseudoinstructions

| Pseudo | Expands To | Notes |
|--------|-----------|-------|
| `nop` | `addi x0, x0, 0` | No operation |
| `li rd, imm` | `lui+addi` or just `addi` if small | Load immediate any value |
| `la rd, sym` | `auipc+addi` | Load address (PC-relative) |
| `mv rd, rs` | `addi rd, rs, 0` | Copy register |
| `not rd, rs` | `xori rd, rs, -1` | Bitwise NOT |
| `neg rd, rs` | `sub rd, x0, rs` | Negate (two's complement) |
| `seqz rd, rs` | `sltiu rd, rs, 1` | Set if == 0 |
| `snez rd, rs` | `sltu rd, x0, rs` | Set if != 0 |
| `sltz rd, rs` | `slt rd, rs, x0` | Set if < 0 |
| `sgtz rd, rs` | `slt rd, x0, rs` | Set if > 0 |
| `beqz rs, lbl` | `beq rs, x0, lbl` | Branch if == 0 |
| `bnez rs, lbl` | `bne rs, x0, lbl` | Branch if != 0 |
| `blez rs, lbl` | `bge x0, rs, lbl` | Branch if <= 0 |
| `bgez rs, lbl` | `bge rs, x0, lbl` | Branch if >= 0 |
| `bltz rs, lbl` | `blt rs, x0, lbl` | Branch if < 0 |
| `bgtz rs, lbl` | `blt x0, rs, lbl` | Branch if > 0 |
| `j label` | `jal x0, label` | Unconditional jump |
| `jal label` | `jal ra, label` | Call (save return addr in ra) |
| `jr rs` | `jalr x0, rs, 0` | Jump to register |
| `ret` | `jalr x0, ra, 0` | Return from function |
| `call sym` | `auipc ra, off_hi; jalr ra, ra, off_lo` | Long-range call |
| `tail sym` | `auipc t1, off_hi; jalr x0, t1, off_lo` | Tail call |

### Stack Frame Layout

RISC-V ABI stack frame (grows downward):

```
High address (caller's frame)
┌─────────────────────────┐ ← old SP (caller's)
│ Caller's local vars      │
│ Caller's saved regs      │
├─────────────────────────┤ ← new SP after prologue
│ Saved ra (return addr)   │ sp + 8  (if leaf: omit)
│ Saved s0 (frame pointer) │ sp + 0
├─────────────────────────┤
│ Local variables          │ sp - N  (N bytes, 16-byte aligned)
│ Spilled registers        │
└─────────────────────────┘ ← SP (current function's frame bottom)
Low address
```

**Prologue / Epilogue pattern**:
```asm
# Prologue (non-leaf function saving ra and s0)
func:
    addi  sp, sp, -32      # frame size = 32 (16-byte aligned)
    sd    ra, 24(sp)       # save return address
    sd    s0, 16(sp)       # save frame pointer
    addi  s0, sp, 32       # s0 = frame pointer (points to top of frame)
    # now: sp = bottom of frame, s0 = top (old sp)

    # ... function body ...

# Epilogue
    ld    ra, 24(sp)       # restore return address
    ld    s0, 16(sp)       # restore frame pointer
    addi  sp, sp, 32       # deallocate frame
    ret                    # return to caller
```

### Complete Example — Fibonacci

```asm
# fib(n) in RISC-V assembly
# a0 = n (argument), returns result in a0
    .text
    .globl fib
fib:
    addi  sp, sp, -24      # allocate frame
    sd    ra, 16(sp)        # save ra
    sd    s0, 8(sp)         # save s0 (will hold n)
    sd    s1, 0(sp)         # save s1 (will hold fib(n-1))
    
    mv    s0, a0            # s0 = n
    li    t0, 1
    ble   a0, t0, .base     # if n <= 1, return n

    # Recursive case: fib(n-1)
    addi  a0, s0, -1
    call  fib
    mv    s1, a0            # s1 = fib(n-1)
    
    # Recursive case: fib(n-2)
    addi  a0, s0, -2
    call  fib
    add   a0, a0, s1        # a0 = fib(n-2) + fib(n-1)
    j     .done

.base:
    mv    a0, s0            # return n

.done:
    ld    ra, 16(sp)
    ld    s0, 8(sp)
    ld    s1, 0(sp)
    addi  sp, sp, 24
    ret
```

### GDB Workflow for Assembly Debugging

```bash
# Compile with debug info
riscv64-linux-gnu-gcc -g -o prog prog.s

# Run in QEMU user-mode emulation + GDB
qemu-riscv64 -g 1234 ./prog &          # -g: listen on port 1234
riscv64-linux-gnu-gdb ./prog

(gdb) target remote :1234              # connect to QEMU
(gdb) break main                       # breakpoint at main
(gdb) continue                         # run to breakpoint
(gdb) info registers                   # show all registers
(gdb) p/x $a0                          # print a0 in hex
(gdb) stepi                            # step one instruction
(gdb) x/4xw $sp                        # examine 4 words at stack pointer
(gdb) x/10i $pc                        # disassemble 10 instructions from PC
(gdb) display/i $pc                    # auto-display next instruction
(gdb) set $a0 = 42                     # modify register
```

### Linux Syscalls in RISC-V Assembly

```asm
# RISC-V Linux syscall convention:
# a7 = syscall number
# a0-a5 = arguments
# a0 = return value

# write(1, msg, len)
    la    a1, msg           # a1 = buf
    li    a2, 13            # a2 = len
    li    a0, 1             # a0 = fd (stdout)
    li    a7, 64            # a7 = syscall: write (NR_write=64)
    ecall

# exit(0)
    li    a0, 0             # exit code
    li    a7, 93            # NR_exit=93
    ecall
```

---

## Real-World Notes

- `objdump -d prog` disassembles object file; `objdump -S prog` interleaves source (if compiled with -g)
- `nm prog` lists symbols; `readelf -h prog` shows ELF header (ISA, architecture, entry point)
- RISC-V assembler relaxation: linker relaxes `auipc+addi` pairs to shorter sequences when target is within range; `.option norelax` disables this
- `riscv64-linux-gnu-as -o prog.o prog.s && riscv64-linux-gnu-ld -o prog prog.o` compiles and links

---

## Common Pitfalls

1. **Stack alignment** — RISC-V ABI requires 16-byte aligned stack before any `call`. Allocating odd-size frames breaks alignment. Always allocate in multiples of 16
2. **Saving ra in leaf functions** — Leaf functions (no `call` inside) don't need to save `ra`. Non-leaf functions MUST save `ra` before any `call` or it gets overwritten
3. **la vs li** — `la` loads an address (symbol address); `li` loads an immediate integer. Using `li` for a symbol gives the numeric value of the symbol (usually wrong)
4. **Signed vs unsigned branches** — `blt` is signed; `bltu` is unsigned. Comparing a pointer to 0 for null check needs `beq`; checking array bounds with signed branch can give wrong results for large indices
5. **ecall argument registers** — RISC-V Linux syscall uses a7 for syscall number; x86 uses rax. The argument mapping (a0-a5) is also different from x86's rdi/rsi/rdx/rcx/r8/r9

---

## Related Concepts

- [[_MOC_Assembly_RISCV|↑ Assembly & RISC-V MOC]]
- [[RISCV_ISA_Fundamentals]] — The instruction set being programmed
- [[ABI_and_Calling_Conventions]] — Rules governing how assembly functions interoperate
- [[Inline_Assembly_in_C]] — Embedding assembly in C using GCC asm volatile

---

## Review Questions

1. Write RISC-V assembly for a `strlen` function that counts bytes until null. Optimize it to not use any branches (using arithmetic tricks for the condition).
2. Draw the stack frame for a function that calls two other functions and has 3 local 64-bit variables. Show exact offsets from SP for each saved item.
3. The Linux syscall `mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0)` has syscall number 222 on RISC-V. Write the complete assembly sequence.

---

## Sources

- Patterson & Hennessy, *Computer Organization and Design RISC-V Edition*, Appendix A
- RISC-V ABI Specification v1.0, riscv-abi.github.io
- GNU as Manual, sourceware.org/binutils/docs

#Computer_Architecture #Assembly_RISCV #Assembly_Programming #GAS
