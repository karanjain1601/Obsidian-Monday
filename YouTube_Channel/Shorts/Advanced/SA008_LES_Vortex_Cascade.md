---
title: "Large-Eddy Simulation: Turbulent Vortex Cascade"
id: SA008
type: youtube-short
duration: "~45 seconds"
feeds_video: "Turbulence Modelling: DNS, LES, and RANS Compared"
difficulty: advanced
tags: [physics, simulation, short, advanced, les, turbulence, vortex, cfd, subgrid]
---

> **What it is:** A ~45-second simulation of turbulent channel flow resolved by LES with a Smagorinsky sub-grid model, visualizing large vortex hairpins cascading energy down to sub-filter scales. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Turbulence Modelling: DNS, LES, and RANS Compared

# Short: Large-Eddy Simulation — Turbulent Vortex Cascade

**Feeds full video:** Turbulence Modelling: DNS, LES, and RANS Compared

## Visual Hook (First 3 Seconds)
A turbulent jet explodes from a circular nozzle (diameter 0.05 m) at Re = 50,000. The flow field burns with colour: large orange-red vortices (size ~0.02 m) fragment into smaller green eddies (~0.002 m) which shatter into tiny blue threads. "Kolmogorov cascade" pulses in white text.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Q-criterion iso-surface (Q = 500 s⁻²) rendered in gold on black background. Vortex tubes coil and stretch, showing the turbulent structure at the resolved LES scale.
- **0:10** — Scale separation diagram: a horizontal energy spectrum (k vs E(k)) in blue. LES filter cutoff (vertical red dashed line at k_c = 200 m⁻¹) divides resolved (left, bright) from subgrid (right, grey).
- **0:18** — Smagorinsky model panel: subgrid stress τ_ij = −2(C_s Δ)² |S̄| S̄_ij. C_s = 0.1 shown. Eddy viscosity field ν_t visualised (blue = low, red = high, peak 8×10⁻⁴ m²/s).
- **0:27** — Grid refinement comparison: coarse 64³ grid (blurry vortices, left) vs fine 512³ grid (sharp crisp tubes, right). "LES accuracy scales with grid" caption.
- **0:35** — Turbulent kinetic energy k(t) time series plot: rises from 0 to 0.42 m²/s² over 2 s, then reaches quasi-steady turbulent state shown by fluctuating plateau (gold line, grey confidence band).
- **0:43** — Slow-motion vortex stretching: single red vortex tube caught at 0.05× speed, elongating from 0.01 m to 0.06 m while thinning, then breaking into two thinner tubes.

## Physics Concept Teased
Large-Eddy Simulation resolves the energy-carrying large eddies directly while modelling only the small, nearly isotropic subgrid scales with a simple Smagorinsky eddy-viscosity model, giving far better accuracy than RANS at a fraction of the cost of DNS.

## On-Screen Text / Captions
- **0:00** — "Re = 50,000. LES resolves the big ones." (white, top)
- **0:10** — "LES filter cutoff: k_c = 200 m⁻¹" (red, at dashed line)
- **0:18** — "Smagorinsky model: C_s = 0.10" (white, bottom bar)
- **0:27** — "64³ vs 512³ — resolution matters" (white, labels on each side)
- **0:35** — "TKE = 0.42 m²/s² at steady state" (gold, graph annotation)
- **0:43** — "Vortex stretching feeds the cascade" (white, bottom)

## End Card
Final 3 seconds: the vortex cascade glows then fades to still fluid. "CODED LAWS" in fiery orange. Subscribe button. "Next: RANS Comparison →" teaser.

## Audio
Deep rumbling bass drone matching the turbulent energy; high-frequency crackle synced to small-eddy breakup; 80 BPM ambient electronic. No voiceover.

## Production Notes
LES solver: OpenFOAM 10 with Smagorinsky SGS model. Domain: periodic box 1×1×1 m, forced turbulence at k=1–3. Grid: 256³ (primary), 512³ (comparison). Q-criterion iso-surface rendered in ParaView with Ambient Occlusion. Simulation run on 64-core cluster, 48 CPU hours.
