---
title: "Adaptive Wavelet Collocation: Multiscale Shock"
id: SA037
type: youtube-short
duration: "~45 seconds"
feeds_video: "Adaptive Wavelet Methods: Resolving Multiple Scales in PDEs"
difficulty: advanced
tags: [physics, simulation, short, advanced, wavelet, adaptive, multiscale, shock, collocation]
---

> **What it is:** A ~45-second simulation of an adaptive wavelet collocation solver automatically refining the grid at a 2D blast-wave shock front and coarsening in smooth regions to achieve high accuracy at low cost. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Adaptive Wavelet Methods: Resolving Multiple Scales in PDEs

# Short: Adaptive Wavelet Collocation — Multiscale Shock

**Feeds full video:** Adaptive Wavelet Methods: Resolving Multiple Scales in PDEs

## Visual Hook (First 3 Seconds)
A 1D shock wave (Mach 2, sharp white vertical line) on a black background. Beneath it, the computational grid appears: dense tightly-packed nodes (red, 512 points) clustered around the shock, coarse widely-spaced nodes (blue, 16 points) in the smooth regions. "512 where it matters. 16 where it doesn't."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Wavelet decomposition: a smooth+shock signal (gold) decomposed into scale levels j = 0 (coarse, white) through j = 8 (fine, red). Each level shows wavelet detail coefficients d^j (small oscillations added back). "Signal = scaling + Σ detail coefficients."
- **0:10** — Threshold criterion: |d^j_k| < ε = 10⁻⁴ → coefficient discarded (grey, ×). |d^j_k| ≥ ε → coefficient kept (gold, ✓). 94% of coefficients discarded. "Sparse representation: 6% of wavelet coefficients carry 99.999% of the signal."
- **0:18** — Adaptive grid evolution: as shock moves right at 680 m/s, active nodes (gold) chase it. Grid coarsens behind the shock (blue, level j=3) and refines ahead (red, level j=8 added). Grid update every 10 time steps shown as animation.
- **0:27** — Interpolating wavelet: a value at a new node is predicted from surrounding coarse-level values (gold arrows pointing inward). Residual (detail coefficient) = actual − predicted. If residual < ε, new node not needed. "Adaptivity is wavelet residuals."
- **0:35** — 2D problem: a Kelvin-Helmholtz instability (shear layer) simulated. Adaptive grid shown: dense nodes (red) along the vortex sheet, coarse (blue) in the bulk. Total nodes: 12,400 (adaptive) vs 262,144 (uniform 512²). "21× fewer nodes. Same accuracy."
- **0:43** — Convergence: error vs CPU time. Adaptive wavelet (gold, steep drop) outperforms uniform grid (blue, slow drop) by 10× at ε = 10⁻⁵ error. "Adaptivity wins for multiscale problems."

## Physics Concept Teased
Adaptive Wavelet Collocation represents the solution in a wavelet basis spanning multiple resolution levels and keeps only wavelet coefficients above a threshold ε — concentrating computational nodes automatically wherever the solution has large gradients (shocks, vortex sheets) while using very few nodes in smooth regions.

## On-Screen Text / Captions
- **0:00** — "512 nodes where it matters. 16 where it doesn't." (white, top)
- **0:10** — "6% of wavelets. 99.999% of the signal." (gold, annotation)
- **0:18** — "Adaptive grid chases the shock at 680 m/s" (white, lower)
- **0:27** — "Residual = actual − interpolated" (white, bottom bar)
- **0:35** — "21× fewer nodes — same accuracy as 512²" (gold, bottom)
- **0:43** — "Adaptivity is 10× faster at ε = 10⁻⁵" (white, bottom)

## End Card
Final 3 seconds: the adaptive grid pulses gold around the shock, blue in the smooth regions. "CODED LAWS" in gold. Subscribe. "Next: Symplectic Integrators →" teaser.

## Audio
Rising-pitch sweep tracking wavelet level detail; sharp click when threshold accepts/rejects coefficients; crystalline chord on convergence plot reveal. 85 BPM minimal. No voiceover.

## Production Notes
Wavelet code: AWCM (Adaptive Wavelet Collocation Method, Vasilyev & Bowman). Wavelets: Deslauriers-Dubuc interpolating wavelets, order 4. Threshold ε = 10⁻⁴. 1D: Burgers equation, Mach 2 initial data. 2D: Euler equations KH instability, random perturbation amplitude 10⁻³. Time integration: 4th-order Runge-Kutta. Visualization: custom matplotlib with adaptive grid overlay.
