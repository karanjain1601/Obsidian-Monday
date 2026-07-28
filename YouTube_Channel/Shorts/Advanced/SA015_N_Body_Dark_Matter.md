---
title: "Cosmological N-Body: Dark Matter Web"
id: SA015
type: youtube-short
duration: "~45 seconds"
feeds_video: "Cosmological Simulation: From Big Bang to Large-Scale Structure"
difficulty: advanced
tags: [physics, simulation, short, advanced, n-body, dark-matter, cosmic-web, cosmology, nbody]
---

> **What it is:** A ~45-second simulation of a cosmological N-body run growing dark matter halos and a cosmic web of filaments from near-uniform initial perturbations via gravitational collapse. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Cosmological Simulation: From Big Bang to Large-Scale Structure

# Short: Cosmological N-Body — Dark Matter Web

**Feeds full video:** Cosmological Simulation: From Big Bang to Large-Scale Structure

## Visual Hook (First 3 Seconds)
A 100 Mpc³ cosmic box starts nearly uniform — white noise with tiny density fluctuations (δρ/ρ ≈ 10⁻⁴). Time fast-forwards: 13.8 billion years in 3 seconds. The box collapses into the cosmic web — blazing gold filaments (density 100× mean) connecting bright white galaxy clusters (1000× mean) around vast dark voids.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Redshift z = 50: near-uniform particle field (white dots, 10⁶ particles). Power spectrum P(k) shown as a nearly flat line (Harrison-Zel'dovich, n_s = 0.96).
- **0:10** — z = 10: first halos form (bright gold clumps, Mvir ~ 10⁸ M☉). Filaments just beginning to connect. Halo mass function N(M) starts rising at low mass end.
- **0:18** — z = 2: cosmic noon. Most star formation. Filaments thick and bright (density 50× mean). A Milky Way-mass halo (10¹² M☉) shown as bright cluster with 100 satellite halos.
- **0:27** — z = 0: present day. Cosmic web fully formed. Volume rendered density field (blue voids → gold filaments → white clusters). Void diameters ~30 Mpc annotated.
- **0:35** — TreePM algorithm panel: a spatial tree (grey octree lines) subdivides the box; nearby particles (distance < θ·l, θ = 0.5 opening angle) calculated directly (red); distant cells (blue) approximated as multipoles. "O(N log N)" counter.
- **0:43** — Power spectrum P(k) evolution: five curves (z = 50, 10, 5, 2, 0) in blue→gold gradient, each lifting above the previous. "Gravity amplifies small fluctuations" text.

## Physics Concept Teased
Cosmological N-body simulations track millions of dark matter particles under Newtonian gravity (in comoving coordinates), using Tree-PM algorithms to balance short-range particle pairs with long-range FFT-based force — revealing how quantum-scale primordial fluctuations grow into the billion-light-year cosmic web.

## On-Screen Text / Captions
- **0:00** — "13.8 billion years. 10⁶ particles. 3 seconds." (white, top)
- **0:10** — "z = 50 → first halos at z = 10" (white, timeline label)
- **0:18** — "Milky Way halo: 10¹² M☉" (gold, cluster label)
- **0:27** — "Voids: ~30 Mpc across" (white, annotation)
- **0:35** — "Tree-PM: O(N log N) gravity" (white, bottom bar)
- **0:43** — "Gravity turns δρ/ρ = 10⁻⁴ into the web" (white, bottom)

## End Card
Final 3 seconds: zoom into a bright gold cluster node, then pull back to show the full web. "CODED LAWS" in cosmic white. Subscribe. "Next: CMB Power Spectrum →" teaser.

## Audio
Low-frequency cosmic expansion drone; time-lapse "tick" every 1 billion years; rising climax chord when web forms at z=0. 50 BPM epic ambient. No voiceover.

## Production Notes
N-body code: GADGET-4. Cosmology: Planck 2018 (Ωm = 0.31, Ωλ = 0.69, H₀ = 67.4 km/s/Mpc). Particles: 512³ = 1.34×10⁸. Box: 100 Mpc/h comoving. Softening: 10 kpc/h. Volume rendering: yt-project with transfer function. Initial conditions: N-GenIC with EH power spectrum. Run time: 2,048 CPU cores × 12 hours.
