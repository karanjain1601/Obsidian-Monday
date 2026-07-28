---
title: "Reduced Coordinate Lagrangian Mechanics"
id: SA005
type: youtube-short
duration: "~45 seconds"
feeds_video: "Lagrangian Mechanics: Generalized Coordinates and Constraints"
difficulty: advanced
tags: [physics, simulation, short, advanced, lagrangian, mechanics, generalized-coordinates, constraints]
---

> **What it is:** A ~45-second simulation of a double pendulum evolving in minimal generalized coordinates under the Euler-Lagrange equations, with constraint forces absent by construction. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Lagrangian Mechanics: Generalized Coordinates and Constraints

# Short: Reduced Coordinate Lagrangian Mechanics

**Feeds full video:** Lagrangian Mechanics: Generalized Coordinates and Constraints

## Visual Hook (First 3 Seconds)
A double pendulum (gold links, white bobs, #0a0a1e background) traces its chaotic path in vivid magenta. Suddenly the 6 Cartesian coordinates (x₁,y₁,z₁,x₂,y₂,z₂) collapse to just 2 glowing labels: θ₁, θ₂. The trajectory explodes into chaos.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Split: left shows 3D Cartesian space with constraint forces shown as white arrows fighting to hold joints. Right shows 2D generalized coordinate space (θ₁ vs θ₂ plane) — no constraint forces visible.
- **0:10** — Configuration space (q-space) visualization: a 2D plane with axes θ₁ (0–360°) and θ₂ (0–360°). The system's trajectory draws a tangled magenta curve across the torus topology.
- **0:18** — Lagrangian derivation panel: T (kinetic energy, shown as golden scalar field on q-space) and V (potential energy, shown as purple depth field). L = T − V in white. Euler-Lagrange equations animate below: d/dt(∂L/∂q̇ᵢ) − ∂L/∂qᵢ = 0.
- **0:27** — Mass matrix M(q) visualized as a 2×2 heatmap (values updating as pendulum swings): entries range 0.2–1.8 kg·m². Off-diagonal coupling terms highlighted in red.
- **0:35** — Constraint elimination demo: a slider-crank mechanism — 4 links, 4 Cartesian constraints → 1 DOF (slider position s). Show the constraint Jacobian J (4×8 matrix) collapsing to a 1D system.
- **0:43** — Energy plot: T (gold) + V (purple) = H (white dashed). Hamiltonian conserved to 1×10⁻⁸ J over 10 s integration with symplectic Euler.

## Physics Concept Teased
Reduced coordinate Lagrangian mechanics eliminates constraint forces entirely by working in the minimal generalized coordinate space q, so the equations of motion shrink to exactly as many ODEs as the system has true degrees of freedom.

## On-Screen Text / Captions
- **0:00** — "6 coordinates → 2. No constraints." (white, top)
- **0:10** — "Generalized coordinates live on a torus" (magenta, lower)
- **0:18** — "L = T − V — the Lagrangian" (gold, center)
- **0:27** — "M(q) couples the degrees of freedom" (white, bottom bar)
- **0:35** — "1 DOF. All constraints gone." (white, bottom)
- **0:43** — "Energy conserved to 10⁻⁸ J" (cyan, upper-right)

## End Card
Final 3 seconds: double pendulum freezes mid-chaos. "CODED LAWS" in gold. Subscribe button. "Next: LCP Contact →" teaser.

## Audio
Soft piano arpeggios at 75 BPM reflecting the elegance of the math; brief whoosh when coordinates collapse at 0:00; gentle chime on each equation reveal. No voiceover.

## Production Notes
Simulator: custom Python ODE integrator (scipy.solve_ivp RK45). Double pendulum with m₁ = m₂ = 1 kg, L₁ = L₂ = 1 m, g = 9.81 m/s². Trajectory rendered via matplotlib with alpha-blended trail. Slider-crank rendered in Blender 3.6.
