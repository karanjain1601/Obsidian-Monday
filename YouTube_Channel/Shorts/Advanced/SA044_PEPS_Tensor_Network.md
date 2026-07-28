---
title: "Tensor Network Contraction: PEPS Boundary MPS"
id: SA044
type: youtube-short
duration: "~45 seconds"
feeds_video: "Tensor Networks: PEPS and 2D Quantum Systems"
difficulty: advanced
tags: [physics, simulation, short, advanced, peps, tensor-network, mps, contraction, quantum-many-body]
---

> **What it is:** A ~45-second simulation of a 2D PEPS tensor network contracted via boundary MPS sweeps to compute the ground-state energy of a frustrated quantum magnet on a 6x6 lattice. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Tensor Networks: PEPS and 2D Quantum Systems

# Short: Tensor Network Contraction — PEPS Boundary MPS

**Feeds full video:** Tensor Networks: PEPS and 2D Quantum Systems

## Visual Hook (First 3 Seconds)
A 6×6 grid of tensors (each shown as a gold cube with 5 legs — 4 virtual bonds in cyan, 1 physical index in white) fills the screen. This is a PEPS (Projected Entangled Pair State) for a 2D quantum system. Contracting it directly: "D^72 operations — impossible." The boundary MPS method sweeps row by row — "D³ per step — tractable." Text lights up.

## Main Visual Sequence (0:03–0:50)
- **0:03** — PEPS structure: L×L grid of tensors T^{σ}_{udlr} (up/down/left/right virtual bonds, dimension D = 4; physical index σ = 2 for spin-1/2). Total parameters: L² × D⁴ × 2 = 6² × 256 × 2 = 18,432 numbers. "Exponentially less than full Hilbert space (2^36 = 68 billion)."
- **0:10** — Contraction challenge: exact contraction of an L×L PEPS requires O(D^(2L)) operations — exponential in L. For L=6, D=4: 4^12 = 16.7 million operations. For L=20, D=10: 10^40 — impossible. "Contraction is #P-hard in general."
- **0:18** — Boundary MPS approach: contract PEPS row by row. Top row: exact MPS representation (bond dimension D). Contract row 2: new MPS bond dimension D² (too large). Truncate back to D using SVD (truncation error ε_trunc). "SVD tames the bond growth." Bond dimension grows as D^2 → compressed back to D.
- **0:27** — SVD truncation: bond matrix M (D²×D²) decomposed: M = U Σ V†. Keep only top D singular values (gold bars in spectrum). Truncation error ε = 1 − Σ_{i=1}^{D} σᵢ²/Σ_all σᵢ². For D=20, ε < 10⁻⁶ for smooth states. "Truncate and lose—but lose little."
- **0:35** — Ground state energy benchmark: 2D Heisenberg model on 10×10 lattice. PEPS D=8 (gold): E₀ = −0.6696 J per site. Quantum Monte Carlo (white circles): −0.6694 ± 0.0003. "Agreement within 0.03%."
- **0:43** — Frustrated magnet: 2D J₁-J₂ model at J₂/J₁ = 0.5 (hardest frustrated point). QMC fails (sign problem). PEPS D=12 (gold) predicts E₀ = −0.495 J, staggered dimer order parameter = 0.02. "PEPS works where QMC can't."

## Physics Concept Teased
PEPS (Projected Entangled Pair States) generalise MPS to 2D by placing a tensor at each lattice site connected by virtual bonds — but exact PEPS contraction is exponentially hard, so the boundary MPS method contracts row by row, compressing the growing bond dimension at each step via SVD truncation to maintain tractability at the cost of controlled approximation.

## On-Screen Text / Captions
- **0:00** — "D^72 → D³ per step. PEPS unlocks 2D." (white, top)
- **0:10** — "Exact contraction: #P-hard. Approximation: tractable." (white, lower)
- **0:18** — "SVD compresses D² bonds back to D" (gold, bond diagram label)
- **0:27** — "ε < 10⁻⁶ at D=20 for smooth states" (white, spectrum label)
- **0:35** — "PEPS D=8 vs QMC: 0.03% error" (gold, benchmark label)
- **0:43** — "Frustrated magnets: PEPS works, QMC fails" (gold, bottom)

## End Card
Final 3 seconds: the 6×6 PEPS grid glows as boundary MPS sweeps across it. "CODED LAWS" in deep gold. Subscribe. "Next: MPS Compression →" teaser.

## Audio
Ascending pitch for each row contracted; SVD truncation "snap"; satisfied resolution chord on ground state benchmark. 80 BPM meditative electronic. No voiceover.

## Production Notes
PEPS code: custom Julia (TensorKit.jl + ITensors.jl). Geometry: 6×6 (demo) and 10×10 (benchmark). Physical: spin-1/2 Heisenberg J=1. Virtual bond: D = 4 (demo), 8–12 (benchmark). Boundary MPS: environment tensors from top/bottom, contraction via TEBD-style updates. Benchmark: 10×10 Heisenberg and J₁-J₂ (J₂=0.5J₁). Reference: Sandvik QMC (1997) for Heisenberg. Visualization: custom Python tensor diagram renderer.
