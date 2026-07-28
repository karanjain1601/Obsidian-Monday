---
title: "Position-Based Fluid — Dam Break"
id: SM043
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-simulation, PBF, SPH, dam-break, position-based]
---

> **What it is:** A ~45-second simulation short where 10,000 water particles burst from a collapsing dam and race across the floor in a churning wave, powered by Position-Based Fluids that enforce incompressibility through iterative position corrections matching the analytical Ritter solution. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Position-Based Fluid — Dam Break

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A rectangular column of 10,000 water particles — deep blue — held against an invisible barrier. At 2 seconds the barrier drops and the water explodes outward: a churning, foamy wave races across the floor, hits a far wall, and splashes upward in a spray of individual droplets.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — PBF algorithm: each particle has a density estimator ρ_i = Σ m W(|x_i - x_j|, h). A position correction Δx_i is computed to drive ρ_i toward ρ₀ (rest density). Caption: "PBF: density constraint → position correction." Particles shown as circles with their influence kernels (Gaussian blobs).

**0:10–0:18** — Dam-break front progression: wave height vs. time measured and shown on a graph. Ritter's solution: front position x_front = 2t√(gh₀) — shown as a dashed line matching the simulation perfectly. Caption: "Ritter solution: x = 2t√(gh₀)."

**0:18–0:27** — Particle colouring by speed: slow (dark blue) → fast (cyan → white). The wave front particles are white (fastest). Turbulent regions show eddies as swirling particle clusters. A vorticity proxy (particle rotation rate) colour-coded on a secondary overlay.

**0:27–0:36** — PBF strengths shown: (1) no pressure oscillations (unlike SPH); (2) handles large density ratios; (3) runs in real-time on GPU. Comparison bar: PBF vs. weakly compressible SPH — PBF smoother density, fewer artifacts. Caption: "PBF: incompressible by construction."

**0:36–0:45** — Multi-fluid: a second lighter fluid (amber/oil) added. The two fluids mix slightly at the interface. Caption: "PBF extended to multi-fluid systems." Bold text: "Position-Based Fluids — real-time incompressible liquids." Fade to black.

## Physics Concept Teased
Position-Based Fluids (PBF): each particle satisfies an incompressibility constraint by iteratively correcting its position until its local density matches the rest density. This constraint-based approach avoids pressure artifacts and runs stably at large time steps, enabling real-time fluid simulation on GPUs.

## On-Screen Text / Captions
- **0:00** — "10,000 water particles. Dam breaks."
- **0:05** — "PBF: density constraint → position correction"
- **0:12** — "Ritter solution: x_front = 2t√(gh₀)"
- **0:20** — "Speed: slow (dark) → fast (white)"
- **0:28** — "PBF: no pressure oscillations, real-time on GPU"
- **0:35** — "Multi-fluid: oil + water — immiscible"
- **0:43** — "PBF — incompressible liquids in real time."

## End Card
Final 3 seconds: the splashback from the wall — droplets frozen mid-air. Text: "NVIDIA FleX game engine uses PBF for real-time fluid in games." CodedLaws logo.

## Audio
Water sounds — rush of dam break, splash against wall. Clean, modern electronic music (90 BPM). Voiceover at 0:00: "Position-Based Fluids constrain every particle to the right density — no differential equations, just geometry." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or Canvas 2D. Key algorithm: PBF (Müller et al. 2013) — (1) predict positions (gravity + velocity); (2) find neighbours (spatial hash); (3) compute λ_i = -C_i / (Σ|∇C|² + ε); (4) compute Δp_i; (5) apply position corrections; (6) update velocities; (7) apply vorticity confinement + viscosity. Kernel: Poly6 for density, Spiky for gradient. h = 0.1 m. Rest density ρ₀ = 1000 kg/m³. Neighbour search: cell list with cell size h. Gotcha: tensile instability — add artificial pressure s_corr term. Runtime: real-time with WebGL compute or Web Worker parallel execution.
