---
title: "Fokker-Planck: Diffusion in Probability Space"
id: SA018
type: youtube-short
duration: "~45 seconds"
feeds_video: "Stochastic Dynamics: Langevin Equations and the Fokker-Planck Equation"
difficulty: advanced
tags: [physics, simulation, short, advanced, fokker-planck, diffusion, stochastic, probability, langevin]
---

> **What it is:** A ~45-second simulation of a probability density evolving under the Fokker-Planck equation in a double-well potential, showing thermally activated escape over the barrier. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Stochastic Dynamics: Langevin Equations and the Fokker-Planck Equation

# Short: Fokker-Planck — Diffusion in Probability Space

**Feeds full video:** Stochastic Dynamics: Langevin Equations and the Fokker-Planck Equation

## Visual Hook (First 3 Seconds)
A single gold dot (a Brownian particle at x = 0) splits into a probability cloud — cyan Gaussian PDF that grows and smears across a dark double-well potential (two purple basins at x = ±1.5). Text: "One particle → one probability density". The cloud spills from one well to the other.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Langevin equation: dx = −V'(x)dt + √(2D) dW. Terms labelled: drift (gold arrow pointing toward well bottom), diffusion (white noise squiggle, D = 0.15 m²/s). Trajectory: 10 stochastic paths (grey) surround the Fokker-Planck PDF (cyan).
- **0:10** — Fokker-Planck equation: ∂P/∂t = −∂/∂x[A(x)P] + (1/2)∂²/∂x²[B(x)P]. A (drift, gold) and B (diffusion, white) terms colour-coded. "Probability is conserved: ∫P dx = 1" in white.
- **0:18** — Double-well potential V(x) = x⁴ − 2x² (purple curve). Barrier height ΔV = 1.0 kT. PDF at t = 0: narrow Gaussian at x = −1.5 (left well, gold). At t = 5 τ: bimodal (split between both wells). At t = 20 τ: flat Boltzmann equilibrium P_eq ∝ e^(−V/kT).
- **0:27** — Kramers escape rate: Γ = (ω₀ ω_b)/(2π γ) × e^(−ΔV/kT). Numbers filled in: ω₀ = 2.0, ω_b = 1.4, γ = 0.5, ΔV = 1.0 kT → Γ = 0.12 s⁻¹. Gold number glows. "Mean escape time: 8.3 s".
- **0:35** — 2D Fokker-Planck: probability surface P(x,y,t) shown as a 3D landscape (cyan surface) flowing down a 2D potential valley. Contours at P = 0.1, 0.5, 0.9. Surface smoothly evolves.
- **0:43** — Monte Carlo validation: 10,000 Langevin trajectories (grey swarm) overlaid on FP PDF (cyan). Agreement to within 0.3%. "Fokker-Planck = ensemble of Langevin particles" caption.

## Physics Concept Teased
The Fokker-Planck equation governs the deterministic evolution of the probability density of a stochastic system, converting noisy individual particle trajectories (Langevin dynamics) into a smooth, exact PDE for the ensemble — revealing steady-state distributions, escape rates, and entropy production directly.

## On-Screen Text / Captions
- **0:00** — "One particle → one probability density." (white, top)
- **0:10** — "∂P/∂t = drift + diffusion" (white, equation label)
- **0:18** — "Barrier ΔV = 1 kT — thermal fluctuations cross it" (gold, annotation)
- **0:27** — "Kramers rate Γ = 0.12 s⁻¹ — mean escape 8.3 s" (gold, center)
- **0:35** — "2D FP: probability flows down the gradient" (white, bottom bar)
- **0:43** — "10,000 Langevin paths → one Fokker-Planck" (white, bottom)

## End Card
Final 3 seconds: the probability cloud settles into a stationary bimodal Boltzmann distribution. "CODED LAWS" in cyan. Subscribe. "Next: Path Integral Monte Carlo →" teaser.

## Audio
Soft white noise (Brownian motion ambience); gentle piano note when PDF reaches equilibrium; rising-pitch tone during escape event. 70 BPM meditative ambient. No voiceover.

## Production Notes
Fokker-Planck solver: finite difference (Crank-Nicolson scheme, dx = 0.01, dt = 0.001 s). Domain x ∈ [−3, 3]. Boundary: absorbing. Langevin integrator: Euler-Maruyama dt = 0.001 s. Potential V(x) = x⁴ − 2x², D = kT/γ = 0.15 m²/s. Visualization: matplotlib animation. 2D extension uses ADI splitting scheme.
