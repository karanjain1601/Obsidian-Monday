---
title: "FLIP Particles — Liquid Pouring"
id: SM042
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-simulation, FLIP, particles, liquid, VFX]
---

> **What it is:** A ~45-second simulation short where photorealistic water pours into a glass — narrowing mid-stream, crown-splashing on impact, and rising steadily — powered by the FLIP hybrid particle-grid method that preserves sharp liquid interfaces without numerical diffusion. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: FLIP Particles — Liquid Pouring

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A clear glass sits on a dark surface. Water pours from above in a smooth arc — the stream narrows (Plateau-Rayleigh), hits the water surface already in the glass, creates a crown splash, and the water level rises. The simulation is indistinguishable from real footage.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — FLIP method explained: two representations simultaneously — a background Eulerian grid (shown as a faint blue grid) and Lagrangian marker particles (small cyan dots) that carry velocity. The grid solves pressure; particles carry momentum. Caption: "Grid + particles: FLIP hybrid."

**0:10–0:18** — P2G (particle to grid) step: particle velocities scattered to nearby grid nodes. G2P (grid to particle) step: grid velocity updates transferred back to particles. The FLIP blend: Δv from grid is applied to particle velocity (not absolute value) — avoids numerical diffusion. Caption: "FLIP blend: particle gets velocity change, not velocity."

**0:18–0:27** — Pouring simulation: the stream narrows as it falls (Plateau-Rayleigh). Hits the water surface in the glass — crown splash visible. Foam particles generated where air is entrained (buoyancy-driven foam model). Surface rendered with Marching Cubes from particle density. Caption: "Marching Cubes extracts the surface mesh."

**0:27–0:36** — Comparison: left panel = FLIP (sharp surface, thin splashes, correct surface tension waves). Right panel = pure grid-based (smeared interface, lost sharp splashes). Caption: "FLIP preserves sharp features — grid alone doesn't."

**0:36–0:45** — Slow-motion of the crown splash at 0.1× speed. Each droplet in the crown is resolved. The water level in the glass rises steadily. Bold text: "FLIP — the algorithm behind Hollywood water." Fade to black.

## Physics Concept Teased
FLIP (Fluid-Implicit Particle): a hybrid Lagrangian-Eulerian method. Particles carry mass and momentum; a background grid solves the pressure Poisson equation for divergence-free flow. The FLIP update applies the velocity change from the grid to the particle (not the absolute velocity), eliminating numerical diffusion and preserving sharp interfaces.

## On-Screen Text / Captions
- **0:00** — "Liquid pouring — simulated."
- **0:05** — "FLIP: Eulerian grid + Lagrangian particles"
- **0:12** — "P2G → solve pressure → G2P"
- **0:20** — "Marching Cubes: particles → surface mesh"
- **0:28** — "FLIP vs. grid: sharp vs. smeared interface"
- **0:35** — "Crown splash resolved to individual droplets"
- **0:43** — "FLIP — Hollywood water simulation."

## End Card
Final 3 seconds: slow-motion crown splash frozen mid-frame. Text: "FLIP is used in Houdini FX and DreamWorks/Industrial Light & Magic." CodedLaws logo.

## Audio
Realistic water sounds — pour, splash, drip. Soft ambient music behind. Voiceover at 0:00: "FLIP splits the fluid into particles and a grid — each handles what it does best." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: three.js + custom FLIP solver. Key algorithm: FLIP loop: (1) P2G (trilinear interpolation); (2) apply gravity; (3) enforce incompressibility (pressure solve via conjugate gradient on MAC grid); (4) G2P with FLIP transfer; (5) advect particles. Surface: extract iso-surface from particle density using Marching Cubes. Foam: generate foam particles where air-water interface has high curvature. Gotcha: pressure solve is the bottleneck — use a fast solver (Jacobi preconditioned CG). Grid resolution: 64³ for 3D, 256² for 2D. Runtime: 3D pre-rendered; 2D real-time Canvas.
