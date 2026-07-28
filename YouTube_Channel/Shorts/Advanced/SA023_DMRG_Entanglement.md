---
title: "DMRG: Entanglement Entropy in Spin Chain"
id: SA023
type: youtube-short
duration: "~45 seconds"
feeds_video: "Tensor Networks: DMRG and the Art of Taming Entanglement"
difficulty: advanced
tags: [physics, simulation, short, advanced, dmrg, entanglement, spin-chain, tensor-network, quantum]
---

> **What it is:** A ~45-second simulation of a DMRG sweep on a 1D Heisenberg spin chain iteratively diagonalizing the effective Hamiltonian, with bond entanglement entropy growing as the critical point is approached. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Tensor Networks: DMRG and the Art of Taming Entanglement

# Short: DMRG — Entanglement Entropy in Spin Chain

**Feeds full video:** Tensor Networks: DMRG and the Art of Taming Entanglement

## Visual Hook (First 3 Seconds)
A 1D chain of 100 quantum spins (gold spheres, each with Bloch-sphere arrow) glows on a dark background. A bipartition line slices it at site 50. Between the halves, coloured entanglement bonds appear (thin cyan lines, thicknesses proportional to Schmidt values). "Entanglement entropy S = 2.14 — the price of quantum." Text pulses.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Hilbert space scaling: brute-force exact diagonalisation requires storing 2^100 ≈ 10³⁰ complex numbers (red bar, off-screen tall). DMRG: only m = 512 states retained per block (blue bar, tiny). "Exponential → polynomial" caption.
- **0:10** — MPS (Matrix Product State) representation: 100 tensors shown as a chain of squares (gold). Each tensor has physical index (spin up/down) and virtual bond indices (dimension m). Contraction shown as matrix multiplication chain.
- **0:18** — DMRG sweep: a "superblock" of 2 sites (highlighted in white) surrounded by left/right environment blocks (cyan/gold). Lanczos diagonalisation of a 4m²×4m² matrix (green glow). Ground state energy update: E = −49.312 J after sweep 3 of 10.
- **0:27** — Schmidt decomposition: singular values σ₁ ≥ σ₂ ≥ … ≥ σ_m for the bipartition. Bar chart shown (logarithmic y-axis). First 10 large (gold), then rapid decay. "Keep m = 512 — discard the rest" label. Truncation error ε = 10⁻⁸.
- **0:35** — Entanglement entropy profile: S(l) = −Σσᵢ² ln σᵢ² plotted vs bipartition position l = 1–100. Critical Heisenberg chain: S(l) = (c/3) ln[sin(πl/100)] (gold curve, central charge c = 1). Gapped chain: S saturates at 0.8 (flat blue line). "Area law vs log law" caption.
- **0:43** — Ground state energy vs m convergence: E(m) vs m = 16, 32, 64, 128, 256, 512. Exponential convergence curve (blue) reaches exact Bethe ansatz (red dashed line) at m ≈ 256. "512 states: error 10⁻¹⁰ J".

## Physics Concept Teased
DMRG (Density Matrix Renormalisation Group) exploits the area law of entanglement in 1D systems to represent the ground state as a Matrix Product State with bond dimension m, performing iterative two-site optimisations (sweeps) that converge exponentially fast in m — taming the exponential Hilbert space via controlled entanglement truncation.

## On-Screen Text / Captions
- **0:00** — "10³⁰ states → 512. Same answer." (white, top)
- **0:10** — "MPS: compress entanglement into bond dimension m" (gold, lower)
- **0:18** — "Sweep 3: E = −49.312 J" (green, energy readout)
- **0:27** — "Truncation error ε = 10⁻⁸" (white, bar chart label)
- **0:35** — "S(l) = (c/3) ln sin(πl/L) — CFT prediction" (gold, curve label)
- **0:43** — "Error 10⁻¹⁰ at m = 512" (blue, bottom)

## End Card
Final 3 seconds: the entanglement bonds glow and pulse rhythmically. "CODED LAWS" in quantum blue. Subscribe. "Next: TDDFT Excited Electrons →" teaser.

## Audio
Quantum-tone synthesis: each spin site plays a slightly different frequency (pentatonic scale); chord resolves as DMRG converges. 70 BPM meditative. No voiceover.

## Production Notes
DMRG code: ITensor library (Julia). Model: spin-1/2 Heisenberg chain H = J Σ Sᵢ·Sᵢ₊₁, L=100, J=1, open BC. Bond dimension m = 512, 10 sweeps. Noise term ε_noise = 10⁻⁷ for first 5 sweeps. Entanglement entropy: computed from Schmidt values at each bipartition. Exact reference: Bethe ansatz E₀/L = −0.4431.
