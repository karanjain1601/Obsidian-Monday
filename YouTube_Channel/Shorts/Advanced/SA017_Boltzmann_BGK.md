---
title: "Boltzmann Equation: BGK Kinetic Solver"
id: SA017
type: youtube-short
duration: "~45 seconds"
feeds_video: "Kinetic Theory: From the Boltzmann Equation to Fluid Dynamics"
difficulty: advanced
tags: [physics, simulation, short, advanced, boltzmann, bgk, kinetic-theory, lattice-boltzmann, rarefied-gas]
---

> **What it is:** A ~45-second simulation of the Boltzmann equation with the BGK collision operator relaxing a perturbed distribution function back toward local Maxwell-Boltzmann equilibrium in a rarefied gas channel. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Kinetic Theory: From the Boltzmann Equation to Fluid Dynamics

# Short: Boltzmann Equation — BGK Kinetic Solver

**Feeds full video:** Kinetic Theory: From the Boltzmann Equation to Fluid Dynamics

## Visual Hook (First 3 Seconds)
10 million gas molecules (bright white dots) race through a box at Kn = 1.0 (rarefied regime). Each dot trails a velocity vector. A flat plate appears — molecules scatter in non-equilibrium patterns impossible with Navier-Stokes. Text: "Knudsen number 1.0 — fluid mechanics fails here".

## Main Visual Sequence (0:03–0:50)
- **0:03** — Phase space: 2D position (x,y) vs velocity (vx,vy) for the gas. At equilibrium: a Maxwellian distribution (gold Gaussian bell surface) fills velocity space. Text: "f(x,v,t) — the distribution function".
- **0:10** — BGK collision operator: ∂f/∂t + v·∇f = −(f − f_eq)/τ. Equation in white; τ = relaxation time = 4×10⁻⁹ s labelled in gold. "f relaxes to Maxwellian at rate 1/τ".
- **0:18** — Rarefied flow over a flat plate: Navier-Stokes prediction (red streamlines, sharp boundary layer) vs BGK solution (blue streamlines, diffuse velocity slip at the wall). "Velocity slip = Kn × L × ∂u/∂y" shown.
- **0:27** — Knudsen layer visualisation: density profiles across the plate gap. Kn = 0.01 (blue, parabolic): matches NS. Kn = 0.1 (green): slight slip. Kn = 1.0 (red): strongly non-equilibrium, nearly flat profile.
- **0:35** — Discrete velocity model (DVM): instead of continuous v-space, 100 discrete velocity points (white dots on a 10×10 grid in vx-vy plane). BGK equation solved at each discrete v point. "100 velocities → 100 coupled PDEs".
- **0:43** — MEMS microflow demo: gas flow through a 1 μm channel (Kn = 0.5). Mass flow rate: BGK predicts 2.1× higher than NS due to Knudsen pump effect. Measurement bar comparison shown.

## Physics Concept Teased
The BGK (Bhatnagar-Gross-Krook) model simplifies the Boltzmann collision integral by replacing the full binary collision operator with a single relaxation term that drives the distribution function toward the local Maxwellian at rate 1/τ — enabling tractable simulation of rarefied gas flows where the Navier-Stokes equations break down.

## On-Screen Text / Captions
- **0:00** — "Kn = 1.0. Navier-Stokes is blind here." (white, top)
- **0:10** — "BGK: f relaxes to Maxwell at rate 1/τ" (gold, equation label)
- **0:18** — "Velocity slip — fluid mechanics can't see this" (blue, annotation)
- **0:27** — "Kn = 1.0: totally non-equilibrium" (red, profile label)
- **0:35** — "100 discrete velocities — 100 PDEs" (white, bottom bar)
- **0:43** — "Knudsen pump: 2.1× more flow than NS predicts" (white, bottom)

## End Card
Final 3 seconds: the phase-space Maxwellian glows gold. "CODED LAWS" in white. Subscribe. "Next: Fokker-Planck Diffusion →" teaser.

## Audio
Fast molecular-collision static noise; calming resolution tone when BGK relaxes to equilibrium; data chimes on each Kn label. 100 BPM glitchy electronic. No voiceover.

## Production Notes
BGK solver: discrete velocity method in Python/NumPy. Velocity grid: 32×32 Gauss-Hermite quadrature points. Spatial grid: 200×100 Cartesian. Time integration: explicit Euler with CFL = 0.5. Gas: air at 300 K, 1 Pa. Visualization: matplotlib pcolormesh with seismic colormap.
