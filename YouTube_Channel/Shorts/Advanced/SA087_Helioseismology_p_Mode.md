---
title: "Helioseismology — p-Mode Frequency Splitting"
id: SA087
type: youtube-short
duration: "~45 seconds"
feeds_video: "Helioseismology: Listening to the Sun's Heartbeat"
difficulty: advanced
tags: [physics, simulation, short, advanced, helioseismology, p-modes, solar-physics, asteroseismology]
---

> **What it is:** A ~45-second simulation showing helioseismic p-mode frequency splittings inverted to reveal the Sun's interior rotation profile from surface to core with the tachocline visible at the base of the convection zone. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Helioseismology: Listening to the Sun's Heartbeat

# Short: Helioseismology — p-Mode Frequency Splitting

**Feeds full video:** Helioseismology: Listening to the Sun's Heartbeat

## Visual Hook (First 3 Seconds)
A full-disk image of the Sun (golden sphere) ripples with oscillation patterns — standing waves visible as light/dark rings across the solar surface. A power spectrum in the lower corner: frequency axis 2–5 mHz (x), power (y). A series of sharp peaks glow — each peak a different mode. The label reads: "p-modes: ν_max = 3090 μHz, Δν = 135 μHz." A triplet of closely spaced peaks is highlighted in gold — the rotational splitting.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The mode structure: solar oscillations are classified by radial order n, angular degree ℓ, and azimuthal order m. The mode (n=20, ℓ=2, m=0) is shown as a spherical harmonic Y_2^0 pattern on the solar surface — two dark rings across the disk. The mode frequency ν_nl = 3000 μHz, period = 5.5 minutes. A 3D cross-section shows the mode penetrating to r = 0.3 R_☉.

**0:10–0:18** — The echelle diagram: a 2D power map with reduced frequency (ν mod Δν) on x-axis and frequency ν on y-axis. Curved ridges appear — each ridge corresponds to a fixed (ℓ, n), with ℓ=0 (green), ℓ=1 (gold), ℓ=2 (red), ℓ=3 (cyan). The large spacing Δν = 135 μHz and small spacing δν_02 = 9 μHz are labeled. These encode the mean density and the sound speed gradient in the core.

**0:18–0:26** — Rotational splitting: the Sun's rotation lifts the degeneracy in m. Mode (n, ℓ=2) splits into 2ℓ+1 = 5 components: m = −2, −1, 0, +1, +2. Frequencies: ν_m = ν_0 + m·δν_rot where δν_rot = Ω/2π = 430 nHz (14-day rotation). The splitting is shown as 5 separate peaks in the power spectrum, with spacing δν_rot = 0.43 μHz. Inset: 2D rotation profile Ω(r,θ) reconstructed from many mode splittings.

**0:26–0:34** — Inversions: by measuring ν_nlm for thousands of modes and solving the integral equation ν_nlm − ν_nlm^ref = ∫K_nlm(r)·δc_s²/c_s²dr, the internal sound speed profile c_s(r) is recovered (solar seismic inversion). The result: c_s(r) vs r from 0.1 R_☉ to 0.9 R_☉, shown as a gold curve with ±1σ uncertainty band. The reference Standard Solar Model (red dashed) matches to within 0.1%.

**0:34–0:42** — The solar neutrino connection: the p-mode inversion of c_s(r) revealed that the sound speed in the solar core matches the SSM using the measured nuclear fusion rates — confirming that pp-chain fusion operates at T_core = 1.57×10⁷ K with luminosity L_☉ = 3.83×10²⁶ W. Before neutrino mixing was understood, the solar neutrino problem seemed to conflict with this; helioseismology showed the solar model was correct.

**0:42–0:50** — Asteroseismology: the same technique applied to other stars. Kepler mission observed ~500,000 stars for 4 years with 1-minute cadence. A plot of Δν vs ν_max for 500 red giant stars (colored dots) shows the universal scaling: Δν ∝ ρ^(1/2) ∝ ν_max^(0.77). This allows mass and radius determination for every star: M/M_☉ = (ν_max/ν_max,☉)³·(Δν/Δν_☉)^(−4)·(T/T_☉)^(3/2). Fade to CodedLaws logo.

## Physics Concept Teased
Solar p-modes (pressure-wave oscillations) are global standing waves that probe the solar interior through their frequencies. Rotational splitting of modes with the same (n,ℓ) but different m encodes the differential rotation Ω(r,θ), and inversion of thousands of frequencies reconstructs the internal sound speed profile with 0.1% accuracy.

## On-Screen Text / Captions
- **0:00** — "p-modes: ν_max = 3090 μHz, Δν = 135 μHz"
- **0:06** — "Mode (n=20, ℓ=2): Y_2^0 pattern, 5.5-min period"
- **0:12** — "Echelle: Δν = 135 μHz, δν_02 = 9 μHz"
- **0:20** — "Rotational splitting: 5 peaks, δν = 0.43 μHz"
- **0:28** — "Inversion: c_s(r) matched SSM to 0.1%"
- **0:36** — "T_core = 1.57×10⁷ K confirmed by seismology"
- **0:44** — "Asteroseismology: mass/radius for 500k Kepler stars"

## End Card
Final 3 seconds: the echelle diagram with colored ridges, CodedLaws logo centered. CTA: "Full video → Helioseismology: The Sun's Interior."

## Audio
Resonant, bell-like ambient at 68 BPM — the actual 5-minute period rendered as a slow musical tone. Each mode peak: a different pitched chime. Harmonic building as multiple modes play simultaneously. No voiceover.

## Production Notes
Renderer: p-mode power spectrum from GOLF/BiSON/MDI data (public solar oscillation datasets). Spherical harmonic visualization: Python/matplotlib with scipy.special.sph_harm. Echelle diagram: 2D power map with Matplotlib pcolormesh. Rotational inversion: GONG data via OLA inversion method. Kepler asteroseismology: NASA Kepler public data. 60 fps, 1080×1920.
