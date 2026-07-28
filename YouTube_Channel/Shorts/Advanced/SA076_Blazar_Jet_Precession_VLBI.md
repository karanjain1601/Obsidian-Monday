---
title: "Blazar Jet Precession — VLBI Image"
id: SA076
type: youtube-short
duration: "~45 seconds"
feeds_video: "VLBI Imaging of Blazar Jets: Precession and Milliarcsecond Resolution"
difficulty: advanced
tags: [physics, simulation, short, advanced, blazar, VLBI, jet-precession, AGN]
---

> **What it is:** A ~45-second simulation showing synthetic VLBI aperture-synthesis images of a blazar jet at multiple epochs showing the inner jet precessing around the black hole spin axis. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** VLBI Imaging of Blazar Jets: Precession and Milliarcsecond Resolution

# Short: Blazar Jet Precession — VLBI Image

**Feeds full video:** VLBI Imaging of Blazar Jets: Precession and Milliarcsecond Resolution

## Visual Hook (First 3 Seconds)
A VLBI radio image of blazar OJ 287 shown: a bright compact core (white, 0.1 mas) with a curved jet extending 5 mas to the lower left. The jet bends by 30° over its length. Beside it: a timeline showing the jet position angle shifting 5°/year — the jet precesses. Text: "VLBI resolution: 0.1 milliarcsecond = 0.08 pc at z = 0.306."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The VLBI technique explained: a network of radio telescopes (MOJAVE array shown as dots on a world map — 25 stations, baselines up to 8000 km). Effective aperture = Earth diameter = 12,800 km. Angular resolution θ = λ/D = 1.3 cm/12,800 km = 0.2 mas. Earth-baseline interferometry shown as wave interference from multiple stations.

**0:10–0:18** — The CLEAN imaging algorithm: the raw interferometric data (visibilities in u-v plane, shown as an elliptical pattern of complex numbers) is inverse-Fourier-transformed. The dirty beam (a complicated sidelobe pattern, shown in false color) is iteratively subtracted. The result: a clean VLBI image of the blazar jet (high-resolution false-color map) with 0.1 mas pixel scale.

**0:18–0:26** — Jet precession in OJ 287: a binary SMBH system (M₁ = 1.83×10¹⁰ M_☉, M₂ = 1.5×10⁸ M_☉). The secondary perturbs the accretion disk of the primary, causing the disk plane — and hence the jet — to precess with period P_prec = 11.86 years. A sequence of VLBI images from different epochs (2003, 2006, 2009, 2012) shows the jet position angle sweeping counterclockwise by ~5°/epoch.

**0:26–0:34** — The precession mechanism: the Bardeen-Petterson effect — the Lense-Thirring frame dragging by the spinning primary SMBH causes differential precession of the disk. Inner disk aligns with BH spin axis; outer disk retains its original orientation. The misalignment angle Δi = 5° is shown as the warp in the disk cross-section (edge-on view showing disk bending).

**0:34–0:42** — Optical outbursts correlated with jet precession: OJ 287 optical light curve (magnitude vs year, 1888–2020) shows periodic flares (gold peaks) every 12 years. The 2007 and 2015 flares were predicted using GR periastron precession of the secondary orbit, including Yukawa modification tests. Prediction accuracy: ±1 day. "Testing GR with a binary SMBH system."

**0:42–0:50** — Space-VLBI: the RadioAstron satellite extends baselines to 340,000 km (Earth-Moon distance), achieving resolution of 8 microarcseconds at 22 GHz. The M87 jet is resolved to sub-parsec scales — smaller than the Schwarzschild radius of the black hole! "Imaging the jet launch region at 0.1 r_s resolution." Fade to CodedLaws logo.

## Physics Concept Teased
VLBI observations of blazar jets reveal jet precession caused by binary supermassive black hole systems or Lense-Thirring frame dragging of the accretion disk. By modeling the precession period and optical outburst timing, the orbital parameters of binary SMBHs can be constrained with GR corrections including periastron advance.

## On-Screen Text / Captions
- **0:00** — "VLBI: 0.1 mas resolution at z=0.306"
- **0:06** — "25-station array, 8000 km baseline"
- **0:12** — "CLEAN imaging: deconvolving the dirty beam"
- **0:20** — "OJ 287: jet precesses 5°/yr, P=11.86 yr"
- **0:28** — "Bardeen-Petterson: disk warp by Lense-Thirring"
- **0:36** — "OJ 287 flares predicted to ±1 day: GR confirmed"
- **0:44** — "Space-VLBI: 8 microarcsecond, sub-r_s resolution"

## End Card
Final 3 seconds: the VLBI image sequence (four epochs) showing the precessing jet, CodedLaws logo centered. CTA: "Full video → VLBI Imaging and Blazar Jets."

## Audio
Deep electronic at 75 BPM. Radio static sound on u-v plane data. Clear ping when CLEAN image appears. Mechanical sweep sound on jet precession rotation. No voiceover.

## Production Notes
Renderer: VLBI image simulation using astropy/numpy FFT-based visibility simulation. CLEAN algorithm implemented in Python. Jet precession animation: VLBI image sequence (real MOJAVE data, OJ 287 epochs). Optical light curve: archival data from Valtonen et al. Three.js for telescope array world map. 60 fps, 1080×1920.
