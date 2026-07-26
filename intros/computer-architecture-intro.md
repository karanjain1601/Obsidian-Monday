# Computer Architecture & Digital Design: Introduction to All Topics

This document is a guided tour of the 6 sections in the Computer Architecture & Digital Design knowledge base — a production-focused reference for engineers who reason about the machine from transistors to parallel systems: designing digital logic, writing performance-critical low-level code, and understanding how the hardware actually executes it. The content targets staff-level engineers and covers digital logic, CPU microarchitecture, memory hierarchies, I/O and buses, RISC-V assembly, and parallel/GPU computing.

**Suggested learning path:** 01 Digital Logic → 02 Computer Architecture → 03 Memory Systems → 04 I/O Systems → 05 Assembly & RISC-V → 06 Parallel Computing — each module lists the earlier ones as prerequisites, so the order is the intended one.

---

## 01. Digital Logic

The bottom of the stack, where mathematical Boolean algebra becomes physical gates and gates become circuits that compute, store, and sequence. Everything above it — CPUs, memory, GPUs — is ultimately assembled from these primitives, so a precise mental model here pays off at every higher layer.

**What's covered:**
- **Boolean Algebra & Logic Gates** — Boolean axioms (identity, complement, idempotent, absorption, De Morgan's), sum-of-products / product-of-sums canonical forms, Karnaugh-map minimization (2/3/4-variable, don't-cares, prime implicants), NAND/NOR as universal gates, fan-in/fan-out limits, propagation delay, and static vs dynamic hazards.
- **Combinational Circuits** — the mux as a universal logic element (a 2ⁿ:1 mux implements any n-input function; the 2:1 atom is Y = S'·D₀ + S·D₁), decoders/demuxes/priority encoders (decoder outputs are the minterms), half/full adders (sum = A⊕B⊕Cin, Cout = MAJ(A,B,Cin)), ripple-carry O(N) delay vs carry-lookahead (generate/propagate), the 4-bit ALU, comparators, and barrel shifters; big muxes are 2:1 trees with O(log N) delay.
- **Sequential Circuits & FSMs** — SR/D/JK/T flip-flops and setup/hold/propagation timing, registers and shift registers, synchronous vs asynchronous reset, Moore (registered, stable) vs Mealy (combinational, responds one cycle earlier) machines, state encoding (binary vs one-hot vs Gray), state-equivalence minimization, and metastability with 2-FF synchronizers.
- **Arithmetic Circuits** — carry-save adders and Wallace-tree multiplication, Booth radix-2/radix-4 recoding, array-multiplier vs Wallace-tree delay, and IEEE 754 floating point (sign/exponent/mantissa, biased exponent, normalization, rounding modes, NaN/Inf/denormals) with the align → add → normalize → round FP-adder pipeline.
- **Hardware Description Languages** — Verilog vs VHDL, structural/behavioral/dataflow modeling, `always @(posedge clk)` synchronous blocks, the blocking (=) vs non-blocking (<=) rule, testbenches (`$monitor`/`$dumpvars`/VCD waveforms), synthesis directives, SDC timing constraints, and the Verilator/ModelSim/Icarus toolchain.

**Key mental models:** NAND and NOR are universal, so any function reduces to them; use non-blocking (<=) for every flip-flop and blocking (=) only in combinational blocks; ripple-carry is O(N) delay — reach for carry-lookahead beyond ~8 bits; always meet setup/hold and synchronize asynchronous inputs or metastability will bite.

---

## 02. Computer Architecture

The contract between software and silicon: the ISA the programmer sees and the microarchitecture that implements it efficiently. This module builds the classic 5-stage RISC pipeline first, then extends it into the modern superscalar out-of-order core.

**What's covered:**
- **ISA Design (RISC vs CISC)** — RISC principles (load-store, fixed-length encoding, register operands, many registers) vs CISC trade-offs (variable-length instructions, memory operands, fewer registers), RISC-V as a clean-slate RISC ISA, x86-64 decode complexity, the R/I/S/B/U/J instruction formats, and ISA orthogonality.
- **CPU Datapath** — the single-cycle datapath (ALU, register file with 2 read / 1 write port, data memory, PC logic), the control-unit truth table, R/I/J-type control signals, branch-target vs PC+4 selection, multi-cycle FSM control, and ALU design (add/sub/AND/OR/SLT with overflow detection).
- **Pipelining & Hazards** — the IF/ID/EX/MEM/WB pipeline with its four pipeline registers, throughput vs latency (CPI = 1 + stall-rate; ideal speedup ≈ N-stages / (1 + stalls)), RAW/WAW/WAR data hazards, forwarding paths (EX/MEM→EX and MEM/WB→EX), the one unavoidable load-use bubble, control hazards and branch penalty, and structural hazards (split I-cache/D-cache).
- **Branch Prediction** — static schemes (backward-taken/forward-not-taken), 1-bit and 2-bit bimodal predictors, correlating (m,n) predictors, tournament predictors (local + global + choice, as in the Alpha 21264), TAGE (tagged geometric history), the branch-target buffer and return-address stack, and misprediction cost (penalty ≈ pipeline depth — e.g. 1% miss × 20 stages ≈ 0.2 CPI overhead).
- **Superscalar & Out-of-Order** — multi-issue fetch/decode, Tomasulo's algorithm (reservation stations, common data bus, register renaming that eliminates WAR/WAW), the reorder buffer for in-order commit and precise exceptions, and the load-store queue (memory disambiguation, store-to-load forwarding).

**Key mental models:** pipelining raises throughput, not single-instruction latency; only RAW is a true dependency (renaming erases the WAW/WAR name-dependencies); execute out of order but commit in order through the ROB so exceptions stay precise; a misprediction flushes the whole front-end, so on deep pipelines predictor accuracy dominates performance.

---

## 03. Memory Systems

Memory — not the ALU — is the single biggest performance bottleneck in a modern processor. This module walks every level of the hierarchy: L1 timing, DRAM row mechanics, the virtual-memory/TLB abstraction, the consistency models that govern multicore behavior, and NUMA effects at system scale.

**What's covered:**
- **Cache Hierarchy** — direct-mapped vs set-associative vs fully-associative and the three C's (compulsory/capacity/conflict misses), AMAT = hit-time + miss-rate × miss-penalty (computed recursively through L1 → L2 → L3 → DRAM), LRU/PLRU/FIFO/Random replacement, write-back + dirty-bit vs write-through, write-allocate policy, the inclusion property (L1 ⊂ L2), thrashing, and stride/stream prefetching.
- **DRAM Architecture** — the 1-transistor-1-capacitor cell, row/column address multiplexing, timing parameters (tRCD, tCL, tRP, tRAS), open-row vs closed-row policy, the SDRAM → DDR → DDR4 → DDR5 evolution, rank/bank/row/column mapping, refresh (tREFI, tRFC), SECDED ECC, and the rowhammer bit-flip attack.
- **Virtual Memory & TLB** — virtual-to-physical translation through a multi-level page table (4 levels in x86-64), PTE bits (PPN, valid, dirty, accessed, R/W/X, U/S), the TLB (fully associative, ASID-tagged), hardware vs software page-walk, huge pages (2 MB / 1 GB), PCID, and the Meltdown/Spectre → KPTI story.
- **Memory Consistency** — sequential consistency vs x86 Total Store Order (the store buffer permits store→load reordering), acquire-release semantics, ARM/POWER relaxed ordering, fences (`mfence`/`sfence`/`lfence`, `dmb`/`dsb`), the C++11 model (`std::atomic`, `memory_order` seq_cst/acquire/release/relaxed), and lock-free correctness.
- **NUMA & Bandwidth** — UMA vs NUMA topology, local vs remote latency (2–4×), first-touch allocation, `numactl`/`taskset` binding, Linux AutoNUMA, the STREAM benchmark (Copy/Scale/Add/Triad), memory interleaving, and HBM.

**Key mental models:** always compute AMAT recursively through every cache level — L1-only is optimistic; TSO ≠ SC, so you still need a fence to stop store→load reordering; a NUMA-unaware `malloc` can silently double latency, so bind with first-touch or `numactl`; huge pages cut TLB misses but waste memory on sparse working sets.

---

## 04. I/O Systems

I/O connects the processor to the outside world across six orders of magnitude of bandwidth — from a multi-GB/s PCIe fabric down to a kHz I2C sensor wire. This module covers bus architectures, interrupts and DMA, storage stacks, I/O scheduling, and memory-mapped device programming.

**What's covered:**
- **Bus Architectures** — PCIe as a switched packet fabric (a lane is 4 wires, full-duplex; usable BW = lanes × rate × η with η = 0.8 for 8b/10b vs ≈0.985 for 128b/130b, so Gen3 ≈ 1 GB/s/lane and x16 Gen5 ≈ 63 GB/s per direction; LTSSM, TLP/DLLP packets, BAR config, bifurcation), USB host/hub topology and 2.0/3.x/4.0 speeds, I2C (open-drain, 7-bit addressing, START/STOP, ACK/NACK, clock stretching), and SPI (CPOL/CPHA modes, full-duplex).
- **Interrupts & DMA** — the interrupt lifecycle (device → controller → IDT lookup → ISR → EOI), PIC vs APIC vs MSI/MSI-X, interrupt coalescing (Linux NAPI), top-half vs bottom-half work (softirqs/tasklets/workqueues), DMA (bus mastering, descriptor rings, scatter-gather), and the IOMMU (VT-d) for DMA remapping and isolation.
- **Storage Interfaces** — NVMe (PCIe-attached submission/completion queue pairs, up to 65535 queues, ~100 µs latency, namespaces), SATA/AHCI with NCQ (32 queued commands), eMMC (HS400, RPMB partition), SSD internals (SLC/MLC/TLC/QLC NAND, the Flash Translation Layer, wear leveling, garbage collection), and ZNS zoned SSDs.
- **I/O Scheduling** — the Linux block layer (BIO, request queue), schedulers (deprecated CFQ, Deadline, BFQ, mq-deadline, none), elevator algorithms (SCAN/C-SCAN/LOOK/C-LOOK), `ionice` priorities, queue depth and parallelism, and io_uring (submission/completion rings, zero-copy, fixed buffers).
- **Memory-Mapped I/O** — MMIO vs port-mapped IN/OUT, BAR mapping, the mandatory `volatile` qualifier, MMIO ordering barriers, device tree (ARM) vs ACPI discovery (x86), `ioremap`/`iounmap` and `/dev/mem`, and coherent vs streaming DMA buffers (`dma_alloc_coherent`).

**Key mental models:** MMIO registers must be `volatile` (use `readl`/`writel`) or the compiler optimizes the device away; put a barrier before reading a DMA buffer or you will see stale data; match the scheduler to the media — mq-deadline/none for NVMe, never rotational-era CFQ; devices on one PCIe root complex share bandwidth, so read the topology (`lspci -tv`) before trusting a x16 slot.

---

## 05. Assembly & RISC-V

RISC-V is an open, clean-slate ISA that makes assembly and microarchitecture approachable without x86's legacy complexity. This module covers the RV32I/RV64I base, assembly idioms, the ABI that glues C and assembly together, the standard extensions, and inline assembly for hot paths.

**What's covered:**
- **RISC-V ISA (RV32I/RV64I)** — the 32 integer registers x0–x31 (x0 hardwired to zero, which synthesizes mv/nop/neg), the six 32-bit formats (R/I/S/B/U/J, with B and J scattering immediate bits so the sign bit always lands in bit 31), arithmetic/logical/shift ops, SLT/SLTU, LW/LH/LB/SW/SH/SB memory ops, BEQ/BNE/BLT/BGE branches, JAL/JALR, LUI/AUIPC, the RV64I word ops (ADDW/LD/SD), and the FENCE instruction.
- **Assembly Programming** — GAS directives (.text/.data/.globl/.align/.word/.string), register ABI names (zero/ra/sp/gp/tp/t0–t6/s0–s11/a0–a7), pseudoinstructions (li/la/mv/nop/ret/call/tail), loops and conditionals, stack-frame layout, GDB workflow (disassemble/stepi/info registers), and ELF sections (.text/.data/.bss/.rodata).
- **ABI & Calling Conventions** — the LP64 ABI, caller-saved (t0–t6, a0–a7) vs callee-saved (s0–s11) registers, argument passing (a0–a7 then the stack), return values in a0/a1, 16-byte stack alignment at a call, the prologue/epilogue pattern (save/restore ra and used s-registers), variadic `va_list` handling, and struct-by-value layout rules.
- **RISC-V Extensions** — M (MUL/MULH/DIV/REM hardware multiply-divide), F/D (IEEE 754 single/double, fcsr rounding, FADD.S/FMUL.S), A (atomics: LR/SC load-reserved/store-conditional plus AMOSWAP/AMOADD/…), V (scalable vectors: v0–v31, vtype's LMUL/SEW, vsetvli, vadd.vv), and C (16-bit compressed instructions for code density).
- **Inline Assembly in C** — GCC extended asm (`asm volatile("…" : outputs : inputs : clobbers)`), constraint codes (r/m/i, `=` write-only, `+` read-write), fences from C (`asm volatile("fence rw,rw")`), x86 examples (CPUID, RDTSC), intrinsics vs hand-written asm, and why every modified register plus a `"memory"` clobber must be declared.

**Key mental models:** x0 = 0 is the ISA's Swiss-army knife (mv is `addi rd, rs, 0`; nop is `addi x0, x0, 0`); save and restore any callee-saved s-register you touch; DIV truncates toward zero (−7/2 = −3, not −4); loads/stores must be naturally aligned; in inline asm an unlisted clobber is silent data corruption.

---

## 06. Parallel Computing

Performance now comes from doing many things at once — within a core (SIMD), across cores (threads), and across thousands of GPU lanes. This module covers vector ISAs, shared-memory multithreading, GPU/CUDA, the coherence protocols that keep caches consistent, and the barriers that order memory across threads.

**What's covered:**
- **SIMD & Vector ISA** — the SSE → AVX → AVX2 → AVX-512 width ladder (128 → 256 → 512 bit), intrinsics (e.g. `_mm256_add_epi32`), data-alignment requirements, shuffle/permute, AVX-512 k-mask predication, auto-vectorization requirements (no aliasing, countable trip count, simple control flow), and vectorization diagnostics (`-fopt-info-vec`, `-march=native`).
- **Multi-Core Programming** — Amdahl's law S = 1 / ((1−p) + p/N) vs Gustafson's scaled speedup, pthreads (create/join/mutex/cond), OpenMP (`#pragma omp parallel for`, reductions, schedule types), C++11 threads/futures (`std::thread`/`std::async`/`std::promise`), false sharing on the 64-byte cache line (fix with `alignas(64)` padding), lock-free structures (Michael-Scott queue, hazard pointers), and ThreadSanitizer.
- **GPU Architecture & CUDA** — throughput lanes vs latency cores, the SIMT model (thread → warp of 32 → block → grid; global index `i = blockIdx.x*blockDim.x + threadIdx.x`; warps/block = ⌈threads/32⌉), 128-byte coalesced global-memory transactions (a large stride can waste 32× of bandwidth — prefer structure-of-arrays over array-of-structures), shared memory (48 KB/SM, 32 banks × 4 B, bank conflicts), warp divergence, occupancy (registers × threads/SM ≤ 65536), CUDA streams, and Tensor Cores.
- **Cache Coherence (MESI)** — the Modified/Exclusive/Shared/Invalid states and their processor-read/write plus bus-snoop transitions, coherence traffic (Read-For-Ownership, invalidation storms), MOESI's Owned state to avoid writebacks, directory-based coherence for large NUMA systems, and cache ping-pong / false sharing.
- **Memory Barriers & Ordering** — the four reordering types (store-load, load-load, store-store, load-store), x86 TSO (only store→load reorders) vs ARM/POWER relaxed (all four), barrier instructions (`mfence`/`sfence`/`lfence`; `dmb`/`dsb`/`isb`), C++ `std::atomic` memory orders (seq_cst/acquire/release/relaxed/acq_rel), Peterson's algorithm needing sequential consistency, and `volatile` (compiler-only) vs `atomic` (real ordering plus atomicity).

**Key mental models:** Amdahl caps speedup at 1/(1−p), so profile against the roofline (compute-bound vs bandwidth-bound) before optimizing; pad shared data to 64 bytes to kill false sharing; keep warp-adjacent threads on address-adjacent data so accesses coalesce; coherence ≠ consistency — MESI makes cores agree eventually, but you still need barriers for ordering; use `std::atomic`, not `volatile`, for cross-thread state.

---

## Cross-Cutting Mental Models

A handful of principles recur at every layer of this stack, from a single gate to a GPU grid, and they are the ideas most worth internalizing:

1. **Abstraction layers, leaky at the edges** — transistors → gates → circuits → microarchitecture → ISA → OS → application. Each layer hides the one below it, but performance and correctness bugs leak upward (cache misses, memory reordering, NUMA placement), so you must be able to drop a level whenever the abstraction lies.

2. **Latency vs throughput** — nearly every technique here (pipelining, DMA, GPUs, interrupt coalescing, deep queues) buys throughput at the cost of per-operation latency. Decide which one your workload is actually bound by before you optimize, because improving the wrong one is free effort wasted.

3. **The memory wall dominates** — compute is cheap and data movement is expensive. Caches, prefetching, coalescing, NUMA-awareness, and structure-of-arrays layouts all exist to keep the arithmetic units fed; the roofline model tells you whether you are compute-bound or bandwidth-bound.

4. **Names vs values, coherence vs consistency** — false dependencies (WAR/WAW hazards, false sharing) come from names, not data, and vanish with renaming or padding. Separately, coherence (every core eventually sees the same value) is not consistency (a guaranteed ordering) — relaxed hardware needs explicit barriers to give you the latter.

5. **Parallelism has a hard ceiling** — Amdahl's law bounds speedup by the serial fraction (1/(1−p)), and synchronization overhead, load imbalance, and bandwidth saturation pull the real ceiling lower still. Scaling out only pays when the parallel fraction is large and the coordination cost is small.
