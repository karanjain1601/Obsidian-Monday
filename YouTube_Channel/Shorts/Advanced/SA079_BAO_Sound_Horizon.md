---
title: "Baryon Acoustic Oscillation — Sound Horizon Feature"
id: SA079
type: youtube-short
duration: "~45 seconds"
feeds_video: "Baryon Acoustic Oscillations: The Cosmic Ruler"
difficulty: advanced
tags: [physics, simulation, short, advanced, BAO, baryon-acoustic-oscillation, sound-horizon, cosmology]
---

> **What it is:** A ~45-second simulation showing the baryon acoustic oscillation feature appearing as a 150 Mpc bump in the galaxy two-point correlation function marking the sound horizon from the epoch of recombination. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Baryon Acoustic Oscillations: The Cosmic Ruler

# Short: Baryon Acoustic Oscillation — Sound Horizon Feature

**Feeds full video:** Baryon Acoustic Oscillations: The Cosmic Ruler

## Visual Hook (First 3 Seconds)
A galaxy correlation function plot: ξ(r) vs separation r (Mpc). A sharp peak at r = 147 Mpc (the BAO peak) glows in gold against the background. The y-axis shows ξ = 0.04 at the peak — a 4σ detection. Overlaid: a 3D slice of the SDSS galaxy distribution showing a ring-like enhancement at 147 Mpc separation. Text: "r_s = 147 Mpc: the cosmic standard ruler."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The physics: at z = 1100 (recombination), acoustic waves had traveled a comoving distance r_s = ∫₀^t_rec c_s dt/(1+z) = 147 Mpc. Sound speed c_s = c/√(3(1+R)) where R = 3ρ_b/(4ρ_γ). Before recombination: photon-baryon fluid (orange, shown as a dense plasma). At recombination: the sound freezes. The acoustic horizon is a preferred scale — a ring of enhanced baryon density at 147 Mpc.

**0:10–0:18** — Simulation of BAO: starting from a single overdense point (gold dot at center), acoustic waves propagate outward (expanding cyan ring). At z = 1000, the ring radius = 0.15 Mpc (physical). By today, this ring has expanded to 147 Mpc comoving. The matter power spectrum P(k) is shown with the BAO wiggles (oscillations at k = 2π/147 Mpc ≈ 0.043 h/Mpc) highlighted in gold.

**0:18–0:26** — SDSS detection: the angular correlation function w(θ) from SDSS DR12 (600,000 galaxies) is plotted. The BAO bump at θ = 4.5° (corresponding to z = 0.57, D_A = 1.86 Gpc) is shown with green data points and error bars. The best-fit ΛCDM model (red curve) matches. The detection significance: "5.4σ BAO peak detected."

**0:26–0:34** — Standard ruler cosmology: at each redshift, the angular size θ_BAO = r_s/D_A(z) and the radial size Δz = r_s/D_H(z) = r_s·H(z)/c are measured. A plot of D_A(z) vs z (0–2.5) shows SDSS, 6dFGS, BOSS, eBOSS, and DESI data points (different colors) compared to the ΛCDM prediction (dashed white). The constraint: H_0·r_s = constant → H_0 pin.

**0:34–0:42** — The CMB power spectrum comparison: the BAO oscillations appear as peaks in the CMB angular power spectrum C_ℓ at ℓ = nπ/θ_s (n = 1, 2, 3...). The first CMB peak at ℓ = 220 corresponds to the same sound horizon. A split-screen: top = CMB C_ℓ (oscillating red curve), bottom = galaxy P(k) (oscillating gold curve). Same physics, different epoch.

**0:42–0:50** — DESI 2024 results: 6 million galaxy spectra, BAO measured across 11 redshift bins from z = 0.1 to z = 4.2. Distance-redshift relation D(z) plotted with DESI data points (gold) vs Planck ΛCDM (blue). A slight 2.6σ deviation at z = 0.7 labeled: "Possible dark energy evolution w(z) ≠ −1?" Fade to CodedLaws logo.

## Physics Concept Teased
Baryon acoustic oscillations are the frozen imprint of acoustic waves in the primordial photon-baryon plasma, which propagated until recombination and left a characteristic bump in the galaxy correlation function at the comoving sound horizon r_s = 147 Mpc. This preferred scale serves as a standard ruler for measuring the cosmic expansion history.

## On-Screen Text / Captions
- **0:00** — "BAO peak at r_s = 147 Mpc — 4σ detection"
- **0:06** — "Sound horizon: r_s = ∫c_s dt/(1+z)"
- **0:12** — "Acoustic ring: expands 0.15 Mpc → 147 Mpc"
- **0:20** — "SDSS DR12: 5.4σ BAO at θ = 4.5° (z=0.57)"
- **0:28** — "D_A(z) measured across 5 surveys"
- **0:36** — "CMB peaks = galaxy BAO: same physics, z=1100 vs z=0.5"
- **0:44** — "DESI 2024: 2.6σ deviation — dark energy evolving?"

## End Card
Final 3 seconds: the correlation function plot with the gold BAO peak labeled 147 Mpc, CodedLaws logo centered. CTA: "Full video → BAO: The Cosmic Standard Ruler."

## Audio
Grand cosmic ambient at 72 BPM. Low bass pulse on acoustic wave propagation. Crystalline tone on BAO peak detection. Slightly ominous chord on DESI deviation. No voiceover.

## Production Notes
Renderer: BAO acoustic ring: particle simulation initialized with Gaussian overdensity, propagated with linear perturbation theory (Python NumPy). Power spectrum with BAO wiggles: CAMB Python interface. Galaxy correlation function: real SDSS DR12 data from public catalog. DESI distance plot: published DESI 2024 paper data. 60 fps, 1080×1920.
