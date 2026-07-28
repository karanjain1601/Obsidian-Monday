---
title: "Geometric Phase: Berry Phase Accumulation"
id: SA039
type: youtube-short
duration: "~45 seconds"
feeds_video: "Geometric Phases in Quantum Mechanics: Berry Phase and Topology"
difficulty: advanced
tags: [physics, simulation, short, advanced, berry-phase, geometric-phase, quantum, topology, adiabatic]
---

> **What it is:** A ~45-second simulation of a spin-1/2 state transported adiabatically around a closed loop in parameter space, accumulating a geometric Berry phase that shifts the interference pattern in a subsequent measurement. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Geometric Phases in Quantum Mechanics: Berry Phase and Topology

# Short: Geometric Phase — Berry Phase Accumulation

**Feeds full video:** Geometric Phases in Quantum Mechanics: Berry Phase and Topology

## Visual Hook (First 3 Seconds)
A quantum spin-1/2 (cyan arrow) traces a closed loop on the Bloch sphere (dark background, sphere shown with meridians in grey). The loop encloses a solid angle Ω = π steradians (shaded gold). When the loop completes, the state vector has rotated by γ = −Ω/2 = −π/2 — a phase invisible to the energy. Text: "Geometry. Not energy. A hidden phase."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Bloch sphere setup: |ψ〉 = cos(θ/2)|↑〉 + e^(iφ) sin(θ/2)|↓〉. Angles θ ∈ [0°,180°] and φ ∈ [0°,360°] shown as latitude/longitude. North pole = |↑〉 (gold), south = |↓〉 (blue). State traces a circular path at θ = 60° (latitude circle, cyan).
- **0:10** — Berry phase derivation: γ = −(1/2) × (solid angle subtended by loop) = −Ω/2. At θ = 60°: loop subtends Ω = 2π(1 − cos60°) = π steradians. γ = −π/2. "Geometric — depends only on the loop area, not speed."
- **0:18** — Interferometry demo: two-path interferometer. Path A: spin traverses the loop (acquires γ = −π/2 extra phase, shown as cyan phase arrow rotating −90°). Path B: straight (γ = 0). Interference fringes shift by Δφ = π/2 (half fringe shift shown on detector plot).
- **0:27** — Aharonov-Bohm analogy: magnetic flux Φ through a solenoid gives phase γ_AB = eΦ/ℏ. Berry phase γ_B = −Ω/2. Side by side: both are geometric, gauge-invariant phases. "Same mathematics — different physics."
- **0:35** — Chern number: integrating Berry curvature Ω_n(k) = −2 Im〈∂_k u_n|×|∂_k u_n〉 over the full Brillouin zone. Result: C = (1/2π) ∫∫ Ω_n dk = 1 (integer, shown as a winding number on torus). "Chern number: topological invariant."
- **0:43** — Quantum Hall edge states: 2D lattice of atoms. Berry curvature heatmap (red = positive, blue = negative). Total Chern number C = 1: one chiral edge mode shown propagating (cyan arrow circling the boundary). "Topology protects the edge mode."

## Physics Concept Teased
The Berry phase is a geometric quantum phase γ = −Ω/2 accumulated by a quantum state when its Hamiltonian parameters traverse a closed loop in parameter space — depending only on the solid angle subtended by the loop, not the path speed, making it a topological invariant with measurable consequences in interferometry and the quantum Hall effect.

## On-Screen Text / Captions
- **0:00** — "Loop on Bloch sphere. Hidden phase." (white, top)
- **0:10** — "γ = −Ω/2 — geometry, not energy" (gold, annotation)
- **0:18** — "Interferometer fringe shifts by π/2" (cyan, detector label)
- **0:27** — "Aharonov-Bohm: same math, magnetic flux" (white, lower)
- **0:35** — "Chern number C = 1 — topological" (white, bottom bar)
- **0:43** — "Topology protects the edge mode" (cyan, bottom)

## End Card
Final 3 seconds: the chiral edge state circles the boundary endlessly. "CODED LAWS" in topological purple. Subscribe. "Next: Adiabatic Theorem →" teaser.

## Audio
Smooth phase-shift tone cycling at loop frequency; "quantum click" when Berry phase completes; mysterious sustained pad on Chern number reveal. 70 BPM ethereal ambient. No voiceover.

## Production Notes
Berry phase simulation: custom Python (QuTiP + NumPy). Bloch sphere: 3D matplotlib with parametric path. Solid angle: numerical integration over spherical triangle. Interferometer: two-path matrix model. Chern number: lattice Haldane model (t₁=1, t₂=0.3, M=0, φ=π/2). Berry curvature: discretised k-space (100×100 grid), link variable method. Visualization: custom OpenGL Bloch sphere render.
