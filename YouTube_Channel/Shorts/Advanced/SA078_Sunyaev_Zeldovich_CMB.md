---
title: "Sunyaev-Zel'dovich Effect — CMB Distortion by Hot Gas"
id: SA078
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Sunyaev-Zel'dovich Effect: Clusters in the CMB"
difficulty: advanced
tags: [physics, simulation, short, advanced, CMB, Sunyaev-Zeldovich, galaxy-cluster, cosmic-microwave-background]
---

> **What it is:** A ~45-second simulation showing galaxy cluster hot gas inverse-Compton scattering CMB photons and producing a Sunyaev-Zeldovich decrement below and increment above 217 GHz imprinted on the CMB temperature map. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Sunyaev-Zeldovich Effect: Clusters in the CMB

# Short: Sunyaev-Zel'dovich Effect — CMB Distortion by Hot Gas

**Feeds full video:** The Sunyaev-Zel'dovich Effect: Clusters in the CMB

## Visual Hook (First 3 Seconds)
A CMB temperature map (blue-red colormap, ΔT range ±500 μK) shows a large galaxy cluster as a cold dark patch (−300 μK) against the warm CMB. An X-ray overlay (bright gold) shows the hot gas (T_e = 10⁸ K) filling the same region. Text: "tSZ effect: 217 GHz null, 545 GHz excess." A frequency spectrum shows the CMB distortion: decrement below 217 GHz, increment above.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The thermal SZ (tSZ) mechanism: CMB photons (red arrows) travel through the hot intracluster plasma (blue cloud, T_e = 5×10⁷ K, n_e = 10³ m⁻³). Inverse Compton scattering boosts photon energies by ΔE/E = 4kT_e/m_e c² = 4×(5×10⁷/5×10⁹) = 0.04. The Compton y parameter: y = ∫(kT_e/m_e c²)·n_e σ_T dl = 10⁻⁴. Shown as a path integral along the line of sight.

**0:10–0:18** — The tSZ spectral distortion: the modified CMB spectrum ΔI_ν/I_ν = y·f(x) where x = hν/kT_CMB and f(x) = x^4 e^x/(e^x−1)^2·(x coth(x/2) − 4). The function f(x) changes sign at x = 3.83 (ν = 217 GHz, the null frequency). Below 217 GHz: deficit (cold patch, ΔI < 0). Above 217 GHz: excess (hot patch, ΔI > 0). The spectral function is plotted in gold.

**0:18–0:26** — SPT/Planck observations: a real tSZ map from the South Pole Telescope (greyscale, showing ~50 clusters as dark spots) is shown. The cluster mass is estimated from the tSZ signal: M_500 = A·(Y_SZ·D_A²)^(α) where Y_SZ = ∫y dΩ is the integrated Compton parameter. For Y = 10⁻³ arcmin², M_500 = 3×10¹⁴ M_☉. This is a "tSZ mass scaling relation."

**0:26–0:34** — The kinetic SZ (kSZ) effect: clusters moving toward or away from us create an additional temperature shift ΔT/T = −(v_r/c)·τ_e where v_r = peculiar velocity, τ_e = Thomson optical depth. For v_r = 1000 km/s, τ = 10⁻², ΔT = −34 μK. This is smaller than the tSZ but encodes the cluster velocity. A kSZ map inset shows a positive/negative pattern for a merging cluster pair.

**0:34–0:42** — The tSZ power spectrum: C_ℓ^{tSZ} vs multipole ℓ (angular scale). It peaks at ℓ ~ 3000 (arcminute scales, matching typical cluster size). The SPT/ACT measured power spectrum (gold data points) is shown against the theoretical prediction (red curve). "Secondary anisotropy: dominates CMB at ℓ > 2000." The non-Gaussianity (NG) due to cluster profiles visible as excess kurtosis.

**0:42–0:50** — Hubble constant: by measuring the angular diameter distance D_A(z) from the cluster's tSZ signal + X-ray profile (ne²), the absolute size and hence distance to the cluster is determined: H_0 = v/D_A = 72 ± 8 km/s/Mpc. "SZ + X-ray: independent H_0 measurement." Fade to CodedLaws logo.

## Physics Concept Teased
The thermal Sunyaev-Zel'dovich effect is the inverse Compton scattering of CMB photons off hot electrons in galaxy cluster gas, producing a characteristic frequency-dependent spectral distortion — decrement below 217 GHz, increment above. The effect is redshift-independent, making clusters detectable across the entire observable universe.

## On-Screen Text / Captions
- **0:00** — "tSZ: cold patch at 90 GHz, hot at 350 GHz"
- **0:06** — "Compton y = 10⁻⁴: ΔE/E = 4%"
- **0:12** — "Null at 217 GHz: ΔI changes sign"
- **0:20** — "M_500 = 3×10¹⁴ M_☉ from Y_SZ"
- **0:28** — "kSZ: ΔT = −34 μK from v_r = 1000 km/s"
- **0:36** — "tSZ power spectrum peaks at ℓ~3000"
- **0:44** — "SZ + X-ray → H_0 = 72 ± 8 km/s/Mpc"

## End Card
Final 3 seconds: the CMB temperature map with cluster dark spots highlighted, CodedLaws logo centered. CTA: "Full video → The SZ Effect and Galaxy Clusters."

## Audio
Calm cosmic ambient at 65 BPM. Gentle hiss of microwave photons as background. Ping on null frequency identification. No voiceover.

## Production Notes
Renderer: tSZ spectral distortion: NumPy computation of f(x) function. CMB temperature map: healpy (HEALPix) with simulated tSZ decrement. SPT cluster map: real public SPT-SZ data overlaid. Power spectrum: Matplotlib semilogy. kSZ animation: velocity field from N-body simulation. Three.js for cluster X-ray + tSZ overlay visualization. 60 fps, 1080×1920.
