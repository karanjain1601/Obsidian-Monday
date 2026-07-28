---
title: "Open Quantum Systems — Lindblad Master Equation"
id: SA049
type: youtube-short
duration: "~45 seconds"
feeds_video: "Open Quantum Systems: The Lindblad Equation and Quantum Channels"
difficulty: advanced
tags: [physics, simulation, short, advanced, quantum-mechanics, lindblad, open-systems, master-equation]
---

> **What it is:** A ~45-second simulation of a two-level quantum system coupled to a Markovian bath evolving under the Lindblad master equation, relaxing from a pure excited state to a thermal mixed state via quantum jump operators. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Open Quantum Systems: The Lindblad Equation and Quantum Channels

# Short: Open Quantum Systems — Lindblad Master Equation

**Feeds full video:** Open Quantum Systems: The Lindblad Equation and Quantum Channels

## Visual Hook (First 3 Seconds)
A glowing two-level atom (turquoise sphere, diameter 60 px) sits at center. Surrounding it: a thermal bath of 200 gray/brown oscillator modes drawn as sinusoidal waves at random frequencies. A white arrow labeled "γ = 0.1 MHz" points from the atom to the bath. The atom's population in |e⟩ reads "P_e = 1.00" in bright green, then starts visibly decaying.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Lindblad equation appears as white text on dark background: dρ/dt = −i[H,ρ] + Σ_k γ_k(L_k ρ L_k† − ½{L_k†L_k, ρ}). Each term is color-coded: Hamiltonian term in cyan, dissipator in orange. Arrow labels identify L_k = σ₋ (decay), L_k = σ_z (dephasing).

**0:10–0:18** — Left panel: Bloch sphere with a vector starting at north pole (|e⟩, P_e=1.0). The vector spirals inward toward the south pole (|g⟩) following the Bloch equation under amplitude damping. γ = 0.1 MHz, T = 10 μs. Right panel: P_e(t) curve showing exponential decay e^(−γt).

**0:18–0:26** — A second jump operator is added: L_2 = √(γ_φ/2)·σ_z for pure dephasing. The Bloch vector now spirals inward toward the center (fully mixed state) while staying near the equator — T₂ dephasing without T₁ relaxation. γ_φ = 0.5 MHz displayed in purple.

**0:26–0:34** — Quantum trajectory "unraveling" shown: instead of the smooth ρ(t) curve, 20 individual stochastic trajectories (thin cyan lines) are overlaid. Each trajectory shows the atom jumping between |e⟩ and |g⟩ at random times. The ensemble average (thick white line) matches the Lindblad result.

**0:34–0:42** — A quantum channel visualization: input state (Bloch sphere surface) transforms under the amplitude-damping channel. The entire Bloch sphere deforms — the top half collapses toward the south pole, the bottom half is unchanged. Final shape is a teardrop/prolate ellipsoid.

**0:42–0:50** — Final comparison: unitary evolution (sphere unchanged) vs Lindblad (sphere shrinks to a point at south pole). Displayed as two side-by-side Bloch spheres. Stat overlay: "Trace-preserving: Tr[ρ] = 1.000 (conserved)." Fade to CodedLaws logo.

## Physics Concept Teased
The Lindblad master equation is the most general Markovian, trace-preserving evolution for an open quantum system. Jump operators L_k encode individual decay and dephasing channels, and the dissipator ensures complete positivity — guaranteeing physically valid density matrices at all times.

## On-Screen Text / Captions
- **0:00** — "Two-level atom + thermal bath"
- **0:05** — "dρ/dt = −i[H,ρ] + dissipator"
- **0:12** — "Amplitude damping: T₁ = 10 μs"
- **0:20** — "Pure dephasing: T₂ = 2 μs"
- **0:28** — "Quantum trajectories: 20 stochastic unravelings"
- **0:36** — "Channel deforms Bloch sphere"
- **0:44** — "Trace preserved: Tr[ρ] = 1 always"

## End Card
Final 3 seconds: the two contrasting Bloch spheres — full vs collapsed — side by side, CodedLaws logo between them. CTA: "Full video → Quantum Channels Explained."

## Audio
Calm electronic ambient at 80 BPM. Soft ping sound on each quantum jump in the trajectory visualization. Low bass note when the Bloch sphere collapses. No voiceover.

## Production Notes
Renderer: QuTiP mesolve for Lindblad evolution, mcsolve for trajectory unraveling. Bloch sphere rendered with custom Matplotlib 3D sphere patch. Quantum channel ellipsoid computed analytically from Kraus operators. Animation: 60 fps, 1080×1920. 20 trajectories, 1000 time steps each at dt = 0.01 μs.
