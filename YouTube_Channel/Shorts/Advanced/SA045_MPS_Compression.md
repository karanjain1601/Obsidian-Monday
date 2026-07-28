---
title: "Matrix Product State Compression: Entanglement Truncation"
id: SA045
type: youtube-short
duration: "~45 seconds"
feeds_video: "Tensor Networks: DMRG and the Art of Taming Entanglement"
difficulty: advanced
tags: [physics, simulation, short, advanced, mps, matrix-product-state, compression, entanglement, tensor-network]
---

> **What it is:** A ~45-second simulation of a many-body quantum state represented as a matrix product state, with Schmidt values truncated at each bipartition and entanglement entropy plotted versus bond dimension. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Tensor Networks: DMRG and the Art of Taming Entanglement

# Short: Matrix Product State Compression — Entanglement Truncation

**Feeds full video:** Tensor Networks: DMRG and the Art of Taming Entanglement

## Visual Hook (First 3 Seconds)
A chain of 50 quantum spins (gold spheres) has its state represented as a massive tensor (a glowing orange block labelled "2^50 = 10^15 numbers — 8 petabytes"). Then, frame by frame, SVDs sweep left to right and the block compresses into 50 small matrices (cyan squares, each 50×50). "Compressed to 125,000 numbers. Error: 10⁻¹⁰."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Full state vector: |ψ〉 has 2^50 complex amplitudes. At 16 bytes each: 16 petabytes. "Not storable. Not computable." For 100 spins: 2^100 = 10^30. "Never storable."
- **0:10** — SVD compression step 1: reshape |ψ〉 as matrix M[σ₁, σ₂…σ₅₀] → M[(σ₁), (σ₂…σ₅₀)]. SVD: M = U Σ V†. U columns = Schmidt states (left, cyan). Σ diagonal = Schmidt values σ_i (gold bars, decaying rapidly). "Keep top m = 50 → truncate the rest."
- **0:18** — Sweep: repeat SVD site by site (1→2, 2→3, … 49→50). Each produces a local tensor A^{σ_i}_{α_{i-1}, α_i} (a 50×2×50 tensor shown as a cyan box). Chain of these boxes = the MPS. "50 tensors × 50×2×50 = 250,000 numbers. Done."
- **0:27** — Schmidt spectrum: log-scale bar chart of σᵢ for site 25 (bipartition at the centre). Near-critical Ising chain: σ₁ = 0.72 (gold, dominant), σ₂ = 0.48, … exponential decay. "m = 50 captures 99.9999% of the weight."
- **0:35** — Compression accuracy: fidelity |〈ψ_exact|ψ_MPS〉|² vs bond dimension m. At m = 10: fidelity 0.94. m = 30: 0.9992. m = 50: 1 − 10⁻¹⁰. "Each doubling of m: exponential accuracy gain."
- **0:43** — Real application: time evolution under Ising Hamiltonian. Initial product state (m = 1) evolves: entanglement grows (m must grow too). At t = 5 J/ℏ: m = 200 needed to maintain error < 10⁻⁴. "Entanglement growth = bond growth = cost." Time-DMRG shown sweeping through the chain.

## Physics Concept Teased
MPS compression applies sequential SVDs across the spin chain — at each bond, retaining only the m largest Schmidt values — to reduce an exponentially large state vector to a linearly scaling tensor train; the truncation error is controlled entirely by the Schmidt spectrum decay rate, which is exponential for gapped 1D systems (area law) but only polynomial for critical or time-evolved states.

## On-Screen Text / Captions
- **0:00** — "10^15 numbers → 125,000. Error: 10⁻¹⁰." (white, top)
- **0:10** — "SVD: keep top m Schmidt values" (gold, spectrum annotation)
- **0:18** — "50 tensors. 250,000 numbers. Exact to 10⁻¹⁰." (white, lower)
- **0:27** — "Schmidt spectrum decays exponentially — the key" (gold, bar chart annotation)
- **0:35** — "m = 50: fidelity 1 − 10⁻¹⁰" (white, accuracy plot label)
- **0:43** — "Entanglement growth: the real cost of time evolution" (white, bottom)

## End Card
Final 3 seconds: the MPS chain of cyan tensors glows and pulses with quantum information. "CODED LAWS" in deep cyan and gold. Subscribe button pulses. "Series complete — watch the full playlist ↑" appears as final text.

## Audio
Sequential "compress" tone (descending pitch) for each SVD step; warm harmonic chord as accuracy bar fills to 1.0; triumphant final chord marking the series end. 75 BPM ambient electronic with uplifting resolution. No voiceover.

## Production Notes
MPS compression: custom Python (NumPy). Full state: random state vector on L=20 sites (2^20 = 1M numbers, tractable for demo). SVD: numpy.linalg.svd at each bond. Bond dimension m swept 1–200. Fidelity: |〈ψ_exact|ψ_MPS〉|² computed directly (L=20 feasible). Time evolution (L=50): ITensors.jl TDVP (time-dependent variational principle) with Δt = 0.05/J, Trotter error < 10⁻⁶. Visualization: matplotlib bar charts + chain diagram with bond dimension annotations.
