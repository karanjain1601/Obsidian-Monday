---
title: "Direct Numerical Simulation: All Scales Resolved"
id: SA010
type: youtube-short
duration: "~45 seconds"
feeds_video: "Turbulence Modelling: DNS, LES, and RANS Compared"
difficulty: advanced
tags: [physics, simulation, short, advanced, dns, turbulence, kolmogorov, cfd, navier-stokes]
---

> **What it is:** A ~45-second simulation of isotropic turbulence using direct numerical simulation, resolving every Kolmogorov-scale eddy from energy injection down to viscous dissipation without any turbulence model. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Turbulence Modelling: DNS, LES, and RANS Compared

# Short: Direct Numerical Simulation — All Scales Resolved

**Feeds full video:** Turbulence Modelling: DNS, LES, and RANS Compared

## Visual Hook (First 3 Seconds)
An isotropic turbulence volume (512³ grid, 0.1 m box) erupts in swirling colour: enormous blood-red structures (Λ ~ 0.02 m) wrap around emerald green mid-scales, which in turn fragment into electric blue threads at the Kolmogorov scale η = 0.0004 m. Text: "Every eddy. Every scale. No shortcuts."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Kolmogorov microscale derivation: η = (ν³/ε)^(1/4). Numbers fill in: ν = 1.5×10⁻⁵ m²/s, ε = 0.5 m²/s³ → η = 0.00039 m. Text glows gold. "Grid must resolve η."
- **0:10** — Grid requirement: N ∝ Re^(9/4). Bar chart: Re = 1,000 → N = 177³; Re = 10,000 → N = 3,162³; Re = 100,000 → N = 56,234³. Red bars grow exponentially. "Exascale needed for Re > 10⁴" in white.
- **0:18** — 3D vorticity magnitude volume render (log scale): outer shell shows large integral-scale structures; peeling the shell reveals smaller and smaller nested tubes down to Kolmogorov size. Each layer a different colour (red → orange → yellow → green → blue).
- **0:27** — Energy spectrum E(k): log-log plot. Measured DNS spectrum (white dots) perfectly matches Kolmogorov's -5/3 law (purple dashed line) from k=2 to k=200 m⁻¹. Inertial range annotation: "E(k) = C_K ε^(2/3) k^(-5/3)".
- **0:35** — Time to run: timeline bar. DNS at Re=3,000 on 4,096 CPU cores: 6 days. LES equivalent: 4 hours. RANS equivalent: 8 minutes. Red/gold/blue bars, logarithmic time axis.
- **0:43** — Closeup of a single vortex tube (gold iso-surface, Q = 10,000 s⁻²) stretching over 0.4 s: length doubles, radius halves — textbook vortex stretching.

## Physics Concept Teased
Direct Numerical Simulation resolves every turbulent eddy from the energy-containing integral scale Λ down to the dissipative Kolmogorov scale η, requiring a computational grid that scales as Re^(9/4) — making DNS affordable only at low Reynolds numbers but providing ground-truth data for all other models.

## On-Screen Text / Captions
- **0:00** — "Every eddy. Every scale. No shortcuts." (white, top)
- **0:03** — "η = (ν³/ε)^(1/4) = 0.00039 m" (gold, center)
- **0:10** — "N ∝ Re^(9/4) — exponential cost" (red, bar chart title)
- **0:27** — "E(k) ∝ k^(−5/3) — Kolmogorov's law" (purple, graph label)
- **0:35** — "DNS: 6 days. RANS: 8 minutes." (white, bottom bar)
- **0:43** — "Vortex stretching transfers energy downscale" (white, bottom)

## End Card
Final 3 seconds: the turbulence volume freezes as a glowing fractal lattice. "CODED LAWS" in electric blue. Subscribe button. "Next: Pseudo-Spectral Methods →" teaser.

## Audio
Immersive roaring wind building from silence to full turbulence over 3 s; deep sub-bass resonance throughout; single sharp crack on each scale-peel reveal. 70 BPM slow drone. No voiceover.

## Production Notes
DNS solver: Spectral code (pseudo-spectral, dealiased 3/2 rule) on 512³ grid. Domain: (2π)³ periodic box. Forced isotropic turbulence Re_λ = 180. Volume render: NVIDIA IndeX plugin in ParaView. Total compute: 1,024 CPU cores × 72 hours (academic cluster). Post-processing in Python/h5py.
