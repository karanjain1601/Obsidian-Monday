---
title: RISC-V ISA Fundamentals
aliases: [RISC-V ISA, RV32I, RV64I, RISC-V Instructions, RISC-V Formats]
tags: [Computer_Architecture, Assembly_RISCV, RISC_V, ISA]
domain: Computer_Architecture
difficulty: Intermediate
created: 2026-07-26
related: [ISA_Design_RISC_vs_CISC, Assembly_Programming, RISCV_Extensions]
status: complete
---

# 📟 RISC-V ISA Fundamentals

> [!abstract] TL;DR
> RISC-V RV32I is the minimal base integer ISA: 32 registers (x0–x31, x0 hardwired to 0), six 32-bit instruction formats (R/I/S/B/U/J), 37 instructions covering arithmetic, logical, shifts, loads/stores, branches, jumps, and system operations. RV64I extends with 64-bit registers and adds 32-bit word operations (ADDW, LW). Instructions are naturally 4-byte aligned (or 2-byte with C extension). `FENCE` orders memory accesses; `ECALL` traps to supervisor/OS. RISC-V is a modular ISA: mandatory base (I) + optional extensions selected at compile time.

## Intuition — analogy FIRST

RISC-V's ISA is like LEGO's basic brick set: a small number of standard shapes (instruction formats) that snap together in consistent ways. Every instruction knows exactly where to find the source registers (rs1, rs2) and destination register (rd) — always at the same bit positions across all formats. The ISA is "clean slate" — designed to fit on a whiteboard, easy to implement in hardware, and carefully designed to avoid x86's historical warts.

---

## How It Works

### Instruction Format Bit Layout

```
R-type: [31:25 funct7][24:20 rs2][19:15 rs1][14:12 funct3][11:7 rd][6:0 opcode]
I-type: [31:20 imm[11:0]         ][19:15 rs1][14:12 funct3][11:7 rd][6:0 opcode]
S-type: [31:25 imm[11:5]][24:20 rs2][19:15 rs1][14:12 funct3][11:7 imm[4:0]][6:0 opcode]
B-type: [31 imm[12]][30:25 imm[10:5]][24:20 rs2][19:15 rs1][14:12 funct3][11:8 imm[4:1]][7 imm[11]][6:0 opcode]
U-type: [31:12 imm[31:12]                                              ][11:7 rd][6:0 opcode]
J-type: [31 imm[20]][30:21 imm[10:1]][20 imm[11]][19:12 imm[19:12]    ][11:7 rd][6:0 opcode]
```

Key design: rs1, rs2, rd are ALWAYS at the same bit positions (25-21, 19-15, 11-7) across all format types. This allows register file read to begin before full decode.

### RV32I Instruction Reference

**Arithmetic / Logical (R-type)**:

| Instruction | Operation | Notes |
|-------------|-----------|-------|
| `add rd, rs1, rs2` | rd = rs1 + rs2 | Wraps on overflow |
| `sub rd, rs1, rs2` | rd = rs1 − rs2 | |
| `and rd, rs1, rs2` | rd = rs1 & rs2 | Bitwise AND |
| `or  rd, rs1, rs2` | rd = rs1 \| rs2 | Bitwise OR |
| `xor rd, rs1, rs2` | rd = rs1 ^ rs2 | Bitwise XOR |
| `sll rd, rs1, rs2` | rd = rs1 << rs2[4:0] | Shift left logical |
| `srl rd, rs1, rs2` | rd = rs1 >> rs2[4:0] | Shift right logical (zero-fill) |
| `sra rd, rs1, rs2` | rd = rs1 >>> rs2[4:0] | Shift right arithmetic (sign-fill) |
| `slt rd, rs1, rs2` | rd = (rs1 < rs2) ? 1 : 0 | Signed comparison |
| `sltu rd, rs1, rs2` | rd = ((u)rs1 < (u)rs2) ? 1 : 0 | Unsigned comparison |

**Immediate Arithmetic (I-type)**:

| Instruction | Operation | Immediate |
|-------------|-----------|-----------|
| `addi rd, rs1, imm` | rd = rs1 + sext(imm) | 12-bit signed |
| `andi rd, rs1, imm` | rd = rs1 & sext(imm) | 12-bit |
| `ori  rd, rs1, imm` | rd = rs1 \| sext(imm) | 12-bit |
| `xori rd, rs1, imm` | rd = rs1 ^ sext(imm) | 12-bit |
| `slti rd, rs1, imm` | rd = (rs1 < sext(imm)) signed | 12-bit |
| `sltiu rd, rs1, imm` | rd = ((u)rs1 < (u)imm) unsigned | 12-bit |
| `slli rd, rs1, shamt` | rd = rs1 << shamt | 5-bit (I-type variant) |
| `srli rd, rs1, shamt` | rd = rs1 >> shamt | 5-bit |
| `srai rd, rs1, shamt` | rd = rs1 >>> shamt | 5-bit |

**Load / Store**:

| Instruction | Operation | Width |
|-------------|-----------|-------|
| `lb  rd, offset(rs1)` | rd = sext(mem[rs1+offset][7:0]) | Byte, sign-extend |
| `lbu rd, offset(rs1)` | rd = zext(mem[rs1+offset][7:0]) | Byte, zero-extend |
| `lh  rd, offset(rs1)` | rd = sext(mem[rs1+offset][15:0]) | Halfword |
| `lhu rd, offset(rs1)` | rd = zext(mem[rs1+offset][15:0]) | Halfword |
| `lw  rd, offset(rs1)` | rd = mem[rs1+offset][31:0] | Word (32-bit) |
| `sb  rs2, offset(rs1)` | mem[rs1+offset] = rs2[7:0] | Store byte |
| `sh  rs2, offset(rs1)` | mem[rs1+offset] = rs2[15:0] | Store halfword |
| `sw  rs2, offset(rs1)` | mem[rs1+offset] = rs2[31:0] | Store word |

**Branch (B-type, PC-relative ±4KB)**:

| Instruction | Condition |
|-------------|-----------|
| `beq  rs1, rs2, label` | Branch if rs1 == rs2 |
| `bne  rs1, rs2, label` | Branch if rs1 != rs2 |
| `blt  rs1, rs2, label` | Branch if rs1 < rs2 (signed) |
| `bge  rs1, rs2, label` | Branch if rs1 >= rs2 (signed) |
| `bltu rs1, rs2, label` | Branch if rs1 < rs2 (unsigned) |
| `bgeu rs1, rs2, label` | Branch if rs1 >= rs2 (unsigned) |

**Upper Immediate (U-type)**:

```asm
lui   rd, imm    # rd = imm << 12  (load 20-bit upper immediate)
auipc rd, imm    # rd = PC + (imm << 12)  (add upper imm to PC)

# Load 32-bit constant 0xDEAD_BEEF into a0:
lui   a0, 0xDEADB      # a0 = 0xDEADB000 (upper 20 bits)
addi  a0, a0, 0xEEF    # WAIT — 0xEEF = -273 (sign-extended)!
# Correct: if lower 12 bits have bit 11 set, add 1 to upper:
lui   a0, 0xDEADC      # a0 = 0xDEADC000
addi  a0, a0, -0x111   # (actually: 0xEEF as 12-bit = -0x111 two's complement)
```

**Jump (J-type, PC-relative ±1MB)**:

```asm
jal   rd, label   # rd = PC+4; PC = PC + sext(offset)
                  # Used for function calls: jal ra, func
                  # Unconditional jump: jal x0, label  (discard return addr)

jalr  rd, rs1, imm  # rd = PC+4; PC = (rs1 + sext(imm)) & ~1
                     # Used for: ret = jalr x0, ra, 0
                     # Function pointer call: jalr ra, t0, 0
```

**System**:
```asm
ecall           # Trap to supervisor (syscall on Linux)
ebreak          # Trap to debugger
fence iorw, iorw   # Order memory accesses (I=input,O=output,R=read,W=write)
fence.i            # Instruction fence (synchronize instruction fetch with data writes)
```

### FENCE Instruction

```
fence pred, succ

pred/succ are 4-bit fields: I (input/load), O (output/store), R (device read), W (device write)

fence rw, rw  → full memory fence (like x86 mfence)
fence r, rw   → acquire (loads before fence are ordered before loads/stores after)
fence rw, w   → release
fence.i       → ensures instructions written to memory are visible to the instruction fetch unit
```

### RV64I Extensions to RV32I

RV64I adds 64-bit registers and 32-bit word arithmetic:

```asm
# 64-bit versions of loads/stores:
ld  rd, offset(rs1)    # load doubleword (64-bit)
sd  rs2, offset(rs1)   # store doubleword

# 32-bit word operations (results sign-extended to 64 bits):
addw  rd, rs1, rs2     # 32-bit add, sign-extend to 64 bits
subw  rd, rs1, rs2
sllw  rd, rs1, rs2
srlw  rd, rs1, rs2
sraw  rd, rs1, rs2
addiw rd, rs1, imm
```

---

## Real-World Notes

- RISC-V ISA simulator: `spike` (official), `riscv-emu` (educational), QEMU (full system)
- Cross-compilation: `riscv64-unknown-linux-gnu-gcc -march=rv64imafdc -mabi=lp64d`
- RISC-V ISA is ratified in modules: RV32I (mandatory), then M, A, F, D, C, V, B (bit manipulation), etc.
- x86-64 has ~1000 instruction encodings; RISC-V RV32I has 37 — simplicity enables formal verification

---

## Common Pitfalls

1. **Sign extension of 12-bit immediate** — Immediates in RISC-V are always sign-extended. A value with bit 11 set (e.g., 0x800) sign-extends to −2048, not +2048. The `lui`/`addi` pair must account for this
2. **Branch range** — B-type branches have ±4KB range. Branches to distant labels require `jal` + `jalr` or the assembler auto-generates a trampoline
3. **JAL vs JALR** — `jal` is PC-relative (for static jumps within 1MB); `jalr` is register+offset (for function pointers and returns). `ret` is `jalr x0, ra, 0`
4. **FENCE.I for self-modifying code** — Writing instructions to memory then executing them requires `fence.i` to flush the instruction cache. Omitting it may execute stale I-cache contents
5. **Word vs doubleword on RV64** — `lw` on RV64 loads 32 bits and sign-extends to 64. `lwu` zero-extends. Using wrong load width on pointer-sized data is a common bug

---

## Related Concepts

- [[_MOC_Assembly_RISCV|↑ Assembly & RISC-V MOC]]
- [[ISA_Design_RISC_vs_CISC|ISA Design]] — RISC-V is the canonical RISC example
- [[Assembly_Programming]] — Writing RISC-V assembly using these instructions
- [[RISCV_Extensions]] — M/F/D/A/V/C extensions add more instructions
- [[../02_CPU_Architecture/CPU_Datapath_and_Control|CPU Datapath]] — Hardware implementing RV32I

---

## Review Questions

1. Encode the instruction `addi a0, s0, -5` in binary. Identify each field (opcode, funct3, rs1, rd, imm). What is the hex machine code?
2. RISC-V has no dedicated NEG or NOT instructions. Show how to implement `neg a0, a1` and `not a0, a1` using available RV32I instructions.
3. Write the instruction sequence to atomically swap the values of two registers a0 and a1 using only R-type and I-type instructions (no memory operations, no temporary registers available).

---

## Sources

- RISC-V International, *RISC-V ISA Specification*, Vol 1 (Unprivileged ISA), v20191213
- Patterson, D. & Waterman, A. *The RISC-V Reader: An Open Architecture Atlas* (2017)
- UC Berkeley CS61C course materials

#Computer_Architecture #Assembly_RISCV #RISC_V #ISA
