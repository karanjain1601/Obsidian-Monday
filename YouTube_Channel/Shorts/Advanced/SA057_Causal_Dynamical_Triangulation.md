---
title: "Causal Dynamical Triangulation — Quantum Gravity Foam"
id: SA057
type: youtube-short
duration: "~45 seconds"
feeds_video: "Quantum Gravity from Causal Dynamical Triangulations"
difficulty: advanced
tags: [physics, simulation, short, advanced, quantum-gravity, CDT, spacetime-foam, triangulation]
---

> **What it is:** A ~45-second simulation showing causal dynamical triangulation Monte Carlo evolving a 2D simplicial spacetime by random local moves and measuring the Hausdorff and spectral dimensions of emergent quantum geometry. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Quantum Gravity from Causal Dynamical Triangulations

# Short: Causal Dynamical Triangulation — Quantum Gravity Foam

**Feeds full video:** Quantum Gravity from Causal Dynamical Triangulations

## Visual Hook (First 3 Seconds)
A fractal-looking spacetime foam: thousands of tiny 4-simplices (colored purple, teal, gold) tessellate a 4D region. The foam shimmers and fluctuates — triangles appear and disappear in a quantum-statistical Monte Carlo sweep. A scale bar shows "l_Planck = 1.6×10⁻³⁵ m." Hausdorff dimension readout: "d_H = 3.8 ± 0.1."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The CDT partition function displayed: Z = Σ_T e^(−S_EH[T])/C(T), summing over all causal triangulations T of spacetime. S_EH is the Regge action for piecewise-flat geometries. A diagram of a single 4-simplex (5 vertices, 10 edges, 10 triangles, 5 tetrahedra) is shown in wireframe cyan.

**0:10–0:18** — A 2D slice (constant-time cross-section) of the CDT universe is shown as a triangulated disk. The spatial volume V₂(t) (number of triangles at each time step) is plotted as a bar chart versus time step t. The profile shows a Gaussian-like shape — a "quantum universe" with a preferred blob shape.

**0:18–0:26** — Monte Carlo sweep animation: the Metropolis algorithm proposes local moves (2→2 Pachner move, 3→1 move shown as colored diagrams). Each accepted move changes one simplex to another — the triangulation visibly reshuffles. The acceptance rate displayed: "α = 0.52." Spectral dimension shown dropping: d_S(σ) vs σ plot from d=4 at large scales to d=2 at small scales.

**0:26–0:34** — The spectral dimension measurement: a random walk is placed on the triangulation. The return probability P(σ) = Tr[e^(−σ·Δ)] is computed. At large diffusion time σ: d_S → 4 (macroscopic spacetime). At small σ: d_S → 2 (quantum gravity regime). The crossover is shown at σ_c ≈ 100 (Planck-scale physics).

**0:34–0:42** — Phase diagram of CDT: three axes κ₀ (inverse Newton constant), Δ (asymmetry parameter), κ₄ (cosmological constant). Three phases labeled: Phase A (collapsed, crumpled), Phase B (stretched, elongated), Phase C (de Sitter-like, physical). The physical phase C is highlighted in gold, and a dot traces the critical point at the phase boundary.

**0:42–0:50** — Final visualization: the volume-volume correlator ⟨V(t₁)V(t₂)⟩ is plotted, showing a positive correlation at t₁ ≈ t₂ and decay at large separation. This matches the mini-superspace de Sitter prediction. Text: "CDT reproduces classical GR at large scales." Fade to CodedLaws logo.

## Physics Concept Teased
Causal dynamical triangulations is a non-perturbative approach to quantum gravity that builds spacetime as a Lorentzian path integral over piecewise-flat simplicial manifolds with a causality constraint. Monte Carlo sampling of the partition function reveals a dynamically generated de Sitter universe with anomalous spectral dimension at Planck scales.

## On-Screen Text / Captions
- **0:00** — "Spacetime foam: d_H = 3.8 at Planck scale"
- **0:06** — "Z = Σ_T e^(−S_Regge[T]) / C(T)"
- **0:12** — "2D slice: Gaussian volume profile"
- **0:20** — "Monte Carlo: Pachner moves, α = 0.52"
- **0:28** — "Spectral dimension: d=4 → d=2 at Planck scale"
- **0:36** — "Phase C: de Sitter-like physical universe"
- **0:44** — "V-V correlator matches mini-superspace GR"

## End Card
Final 3 seconds: the shimmering 4-simplex foam with a glowing gold phase-C region, CodedLaws logo fading in. CTA: "Full video → CDT and Quantum Gravity."

## Audio
Ambient textured noise at 70 BPM, lo-fi crackle suggesting quantum fluctuations. Sound effect: each Pachner move acceptance is a soft pop; refusals are silence. Sustained low drone builds to phase diagram reveal. No voiceover.

## Production Notes
Renderer: Custom C++ CDT simulator (sparse adjacency list for simplicial complex). Python/Matplotlib for data visualization of spectral dimension and volume profiles. 3D simplex visualization via Three.js wireframe geometry. Monte Carlo: Metropolis-Hastings with Regge action. Triangulation size: ~10,000 simplices. 60 fps, 1080×1920.
