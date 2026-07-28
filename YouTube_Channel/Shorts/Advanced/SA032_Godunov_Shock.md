---
title: "Godunov Scheme: Shock-Capturing Riemann Solver"
id: SA032
type: youtube-short
duration: "~45 seconds"
feeds_video: "Computational Gas Dynamics: Shock Capturing with Godunov Methods"
difficulty: advanced
tags: [physics, simulation, short, advanced, godunov, shock-capturing, riemann-solver, hyperbolic, cfd]
---

> **What it is:** A ~45-second simulation of a Godunov finite-volume scheme applying an exact Riemann solver at each cell interface to propagate a shock wave through a 1D Euler gas with sharp, non-oscillatory resolution. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Computational Gas Dynamics: Shock Capturing with Godunov Methods

# Short: Godunov Scheme — Shock-Capturing Riemann Solver

**Feeds full video:** Computational Gas Dynamics: Shock Capturing with Godunov Methods

## Visual Hook (First 3 Seconds)
A Mach 3 shock wave (vertical white line) slams into a 100-cell 1D domain. Left state: ρ_L = 1.0 kg/m³, u_L = 0, p_L = 1 Pa (blue). Right state: ρ_R = 0.125, u_R = 0, p_R = 0.1 Pa (dark). The shock wave, contact discontinuity, and rarefaction fan appear instantly in sharp primary colours. "Sod's problem. Exact Riemann solver. Zero smearing."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Godunov cell structure: 1D grid with N = 100 cells. Each cell shown as a coloured bar with uniform state (density ρ, pressure p, velocity u). At each face: a Riemann problem (left/right states, cyan/gold arrows) solved exactly.
- **0:10** — Riemann problem solution: x-t diagram shown (x horizontal, t vertical). Three waves emerge from initial discontinuity: rarefaction fan (cyan spreading lines), contact discontinuity (white vertical), shock wave (red line). Star states ρ* = 0.426, u* = 0.927, p* = 0.303 labelled in gold.
- **0:18** — Godunov update: interface flux F_{i+1/2} computed from star state. Cell averages updated: ρ_i^{n+1} = ρ_i^n − Δt/Δx (F_{i+1/2} − F_{i−1/2}). CFL = 0.9, Δt = 0.0009 s shown. "Conservative update preserves mass."
- **0:27** — Comparison: Godunov 1st order (gold, 2-cell shock smearing), MUSCL 2nd order (cyan, 1-cell), WENO5 5th order (white, <1-cell, essentially exact). All three density profiles overlaid at t = 0.2 s.
- **0:35** — 2D shock tube: rectangular domain 1×0.5 m. Mach 3 shock hits a cylinder (radius 0.1 m). Density schlieren image (colour map: viridis, density 0–4 kg/m³). Bow shock, Mach stem, and reflected shock all resolved sharply.
- **0:43** — Positivity preservation: behind a strong shock (Mach 10), first-order scheme maintains ρ > 0 (green check). High-order scheme without limiter: ρ goes negative at t = 0.05 (red X). "Limiters keep the scheme physical."

## Physics Concept Teased
Godunov's method solves an exact Riemann problem at every cell interface each time step, using the wave structure of hyperbolic conservation laws to compute physically correct intercell fluxes — naturally capturing shocks, contact discontinuities, and rarefaction fans without artificial viscosity or oscillatory Gibbs ringing.

## On-Screen Text / Captions
- **0:00** — "Mach 3. Riemann solver at every face." (white, top)
- **0:10** — "Star state: ρ* = 0.426, p* = 0.303" (gold, x-t diagram label)
- **0:18** — "CFL = 0.9 — stable and accurate" (white, lower)
- **0:27** — "WENO5: essentially exact on 100 cells" (white, profile label)
- **0:35** — "Bow shock, Mach stem, reflection — all sharp" (white, bottom bar)
- **0:43** — "Limiters: positivity is not optional" (red, bottom)

## End Card
Final 3 seconds: the 2D shock/cylinder schlieren image glows. "CODED LAWS" in white. Subscribe. "Next: Discontinuous Galerkin →" teaser.

## Audio
Sharp "crack" at initial shock; low-frequency roar of the shock wave propagating; high-pitch tone for rarefaction fan. 95 BPM tense electronic. No voiceover.

## Production Notes
Godunov solver: custom Python. Exact Riemann solver: iterative Newton-Raphson on pressure star (ε = 10⁻⁶). MUSCL: van Leer limiter. WENO5: Jiang-Shu. Gas: ideal gas γ = 1.4. Sod initial data per Sod (1978). 2D: AMReX framework, 400×200 grid, AMR level 2. Visualization: matplotlib + custom schlieren shader.
