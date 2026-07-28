---
title: "CMB Power Spectrum: Acoustic Peaks"
id: SA016
type: youtube-short
duration: "~45 seconds"
feeds_video: "Cosmic Microwave Background: Reading the Universe's Baby Photo"
difficulty: advanced
tags: [physics, simulation, short, advanced, cmb, power-spectrum, acoustic-peaks, cosmology, boltzmann]
---

> **What it is:** A ~45-second simulation of a Boltzmann hierarchy code computing the CMB temperature-anisotropy power spectrum C_l, with the first three acoustic peaks labeled by angular multipole scale. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Cosmic Microwave Background: Reading the Universe's Baby Photo

# Short: CMB Power Spectrum — Acoustic Peaks

**Feeds full video:** Cosmic Microwave Background: Reading the Universe's Baby Photo

## Visual Hook (First 3 Seconds)
The full-sky Planck CMB temperature map fills the screen (hot spots red +300 μK, cold spots blue −300 μK, on a black background). Then a Mollweide projection splits: the map morphs into a 2D power spectrum C_l vs l plot with three distinct peaks glowing gold at l = 220, 540, 800.

## Main Visual Sequence (0:03–0:50)
- **0:03** — CMB map zoom: a typical hot spot (2° angular scale) shown. Angular power C_l = 6,000 μK² at l = 220. "First acoustic peak" gold label.
- **0:10** — Physical model: at recombination (z = 1100, t = 380,000 years), photon-baryon fluid oscillates as sound waves. Animation shows compression (red) and rarefaction (blue) cycles in the photon-baryon plasma.
- **0:18** — Sound horizon: a ring of radius r_s = 147 Mpc expands from every density peak. At decoupling, the ring freezes — imprinted as the first peak at θ = r_s/D_A = 1.0°. Shown on sky as a glowing gold circle.
- **0:27** — Peak structure: C_l vs l plot (log-linear). First peak (l=220, compression): gold. Second peak (l=540, rarefaction, baryon drag): lower, silver. Third peak (l=800): yet lower, bronze. Text: "Odd peaks: compression. Even: rarefaction."
- **0:35** — Baryon density measurement: shift the Ωb slider (0.02 → 0.05 → 0.10 baryon fraction). Second peak amplitude changes relative to first (increases with Ωb). Text: "Ωb = 0.049 — Planck best fit" in gold.
- **0:43** — Polarisation panel: E-mode polarisation map (red/blue pattern) shown. TE cross-correlation (green curve) oscillates opposite to TT. Text: "CMB polarisation confirms the same peaks".

## Physics Concept Teased
The CMB acoustic peaks encode the harmonic modes of photon-baryon plasma oscillation before recombination: each peak corresponds to a mode that completed an integer number of half-oscillations in the sound horizon, with peak ratios measuring baryon density, dark matter density, and spatial curvature to sub-percent precision.

## On-Screen Text / Captions
- **0:00** — "380,000 years after the Big Bang, frozen in light." (white, top)
- **0:10** — "Photon-baryon acoustic oscillations" (white, bottom bar)
- **0:18** — "Sound horizon r_s = 147 Mpc — the ruler of the universe" (gold, annotation)
- **0:27** — "Odd peaks: compression. Even peaks: rarefaction." (white, lower)
- **0:35** — "Ωb = 0.049 — baryons are 4.9% of the universe" (gold, bottom)
- **0:43** — "CMB: the universe's baby photo" (white, bottom)

## End Card
Final 3 seconds: the full CMB sky map rotates slowly. "CODED LAWS" in cosmic gold. Subscribe. "Next: Boltzmann BGK Solver →" teaser.

## Audio
Sparse ambient drone with a sub-bass resonance at the recombination era; soft "ping" on each acoustic peak label; silence broken by a single pure tone (the CMB acoustic frequency mapped to audible range). 60 BPM. No voiceover.

## Production Notes
CMB power spectrum computed with CLASS (Cosmic Linear Anisotropy Solving System). Cosmology: Planck 2018 best-fit ΛCDM. Full-sky map: Planck 2018 PR3 SMICA temperature map (HEALPIX Nside=2048). Visualization: healpy + matplotlib. Peak labels from CLASS lensed C_l output. Slider animation: custom matplotlib widget rendered to video.
