---
title: "AGN Disk — Shakura-Sunyaev Accretion"
id: SA075
type: youtube-short
duration: "~45 seconds"
feeds_video: "Accretion Disks: The Shakura-Sunyaev Model and AGN Physics"
difficulty: advanced
tags: [physics, simulation, short, advanced, AGN, accretion-disk, Shakura-Sunyaev, black-hole]
---

> **What it is:** A ~45-second simulation showing a Shakura-Sunyaev alpha-disk accretion model around a black hole with surface density and temperature color-mapped from the innermost stable circular orbit outward. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Accretion Disks: The Shakura-Sunyaev Model and AGN Physics

# Short: AGN Disk — Shakura-Sunyaev Accretion

**Feeds full video:** Accretion Disks: The Shakura-Sunyaev Model and AGN Physics

## Visual Hook (First 3 Seconds)
A face-on view of an AGN accretion disk: a blazing spiral of material, colored from bright white (#FFFFFF) at the innermost edge (ISCO, r = 6GM/c² = 8.9×10¹⁰ m for M = 10⁸ M_☉) through orange to deep red at large radii. Temperature label at inner edge: "T = 10⁵ K." Accretion rate: "Ṁ = 1 M_☉/yr = 0.1 Ṁ_Edd." Luminosity: "L = 4×10³⁸ W."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The α-disk model: viscous dissipation drives accretion. The viscosity ν = α·c_s·H where α = 0.1 (dimensionless viscosity parameter), c_s = sound speed, H = scale height. For a radiation-pressure-dominated inner disk: c_s ≈ c/√3 and H/r ≈ 0.1. The resulting accretion rate Ṁ = 3πνΣ is shown as a radial profile (surface density Σ vs radius).

**0:10–0:18** — Temperature profile: T(r) = T_∗·(r/r_∗)^(−3/4)·(1−√(r_in/r))^(1/4) where T_∗ = (3GMṀ/8πσr_∗³)^(1/4) = 10⁵ K at r = r_in. A colormap of temperature on the disk surface (face-on view): inner white/yellow (T > 10⁵ K), middle orange (T = 10⁴ K), outer red (T = 3×10³ K). The multicolor temperature gradient is the dominant visual.

**0:18–0:26** — The emergent spectrum: each annulus of the disk emits as a blackbody at its local temperature. The total spectrum is the superposition: L_ν ∝ ∫T(r)^(1/3) dr → S_ν ∝ ν^(1/3) in the "big blue bump" (UV peak). A log-log spectrum plot shows: radio flat → optical bump → UV peak (10⁵ K, shown as a gold peak) → X-ray Comptonized corona.

**0:26–0:34** — The Eddington limit: L_Edd = 4πGMm_p c/σ_T = 1.26×10⁴⁶ W for M = 10⁸ M_☉. The disk luminosity L = 4×10³⁸ W is L/L_Edd = 0.1 (sub-Eddington, stable). A bar chart shows L/L_Edd from 0 (no accretion) to 1 (Eddington limit, shown as a red warning line). Eddington-limited sources: shown as NLS1 galaxies at L/L_Edd = 1 (disk puffs up, jet suppressed).

**0:34–0:42** — The ISCO and efficiency: material accreting down to ISCO (r_ISCO = 6M for Schwarzschild, 1.24M for maximal Kerr) releases gravitational binding energy. Efficiency η = 1 − E_ISCO = 1 − 2√2/3 = 5.7% (Schwarzschild). For maximal Kerr: η = 42%. Bar chart: nuclear burning 0.7% vs Schwarzschild accretion 5.7% vs Kerr accretion 42%. "Kerr accretion is the most efficient energy source in the universe."

**0:42–0:50** — Disk instabilities: in the radiation-pressure-dominated zone (r < 10r_ISCO), the disk is thermally and viscously unstable — slight density increase → increased opacity → increased radiation pressure → disk puffs up → instability. The "limit cycle" is shown: disk oscillates between a thin cold state and a thick hot state every few thousand years. Fade to CodedLaws logo.

## Physics Concept Teased
The Shakura-Sunyaev α-disk model provides a self-consistent description of viscous accretion disks where turbulent viscosity is parameterized as ν = αc_sH. The resulting temperature profile T ∝ r^(−3/4) predicts a multi-color blackbody spectrum with a UV peak, explaining the "big blue bump" seen in quasar spectra.

## On-Screen Text / Captions
- **0:00** — "AGN disk: T_in = 10⁵ K, L = 4×10³⁸ W"
- **0:06** — "α-disk: ν = α·c_s·H, α = 0.1"
- **0:12** — "T(r) ∝ r^(−3/4): inner white, outer red"
- **0:20** — "Spectrum: S_ν ∝ ν^(1/3) → UV big blue bump"
- **0:28** — "L/L_Edd = 0.1 (sub-Eddington, stable)"
- **0:36** — "Kerr η = 42% — most efficient process in universe"
- **0:44** — "Radiation-pressure instability: limit-cycle oscillations"

## End Card
Final 3 seconds: face-on AGN disk glowing from white center to red edge, CodedLaws logo centered. CTA: "Full video → Shakura-Sunyaev Accretion Disks."

## Audio
Smooth ambient at 78 BPM with deep cosmic drone. Crackling sound as disk instability triggers. Steady electronic hum at accretion equilibrium. No voiceover.

## Production Notes
Renderer: Three.js ring geometry with temperature-mapped texture (custom GLSL gradient). Temperature profile computed analytically. Spectrum: Matplotlib log-log with multi-blackbody superposition. Disk instability: 1D time-dependent diffusion equation (scipy PDE solver). ISCO efficiency: computed analytically for Kerr metric. 60 fps, 1080×1920.
