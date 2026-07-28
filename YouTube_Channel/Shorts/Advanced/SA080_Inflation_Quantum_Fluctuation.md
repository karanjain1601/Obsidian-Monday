---
title: "Inflation — Quantum Fluctuation to Density Perturbation"
id: SA080
type: youtube-short
duration: "~45 seconds"
feeds_video: "Cosmic Inflation: How Quantum Fluctuations Seeded the Large-Scale Structure"
difficulty: advanced
tags: [physics, simulation, short, advanced, inflation, cosmology, quantum-fluctuations, density-perturbations]
---

> **What it is:** A ~45-second simulation showing de Sitter inflation exponentially stretching quantum vacuum fluctuations to superhorizon scales where they freeze and seed the primordial density perturbations that grow into large-scale structure. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Cosmic Inflation: How Quantum Fluctuations Seeded the Large-Scale Structure

# Short: Inflation — Quantum Fluctuation to Density Perturbation

**Feeds full video:** Cosmic Inflation: How Quantum Fluctuations Seeded the Large-Scale Structure

## Visual Hook (First 3 Seconds)
An incredibly smooth de Sitter space (uniform green background) with a single quantum fluctuation: a tiny gold ripple appearing at the Planck scale (10⁻³⁵ m). Then: rapid expansion — a zoom-out over 60 e-folds (each e-fold = ×e ≈ 2.718 in size). The ripple, now stretched to cosmic scales (100 Mpc), becomes a slight density contrast δρ/ρ = 10⁻⁵. Text: "From h_Planck to megaparsecs in 10⁻³² s."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The inflaton potential: V(φ) displayed as a 1D curve — a flat plateau region (labeled "slow roll") at φ < φ_end, then a steep drop into a minimum. The inflaton field φ(t) rolls slowly from φ = 16 M_P to φ = φ_end ≈ 1 M_P. Slow-roll parameters: ε = (V'/V)²/2 ≪ 1 (shown as ε = 0.01), η = V''/V ≪ 1 (η = −0.01). "Inflation lasts ε < 1."

**0:10–0:18** — Mode evolution: a quantum mode δφ_k in de Sitter space. The mode equation: ü_k + (k² − a''/a)u_k = 0 where u = aδφ_k. This is a harmonic oscillator with time-varying mass. Early time (k >> aH): oscillating plane wave (gold sine wave). Late time (k << aH, superhorizon): frozen amplitude. The spectrum P(k) = H²/4π²ε·(k/k_*)^(n_s-1) shown.

**0:18–0:26** — The Harrison-Zel'dovich spectrum: n_s = 1 − 6ε + 2η = 0.965 (scalar spectral index, shown in gold). Tensor-to-scalar ratio r = 16ε = 0.16 (gravitational wave power, shown in red). A P(k) vs k plot (log-log) shows a nearly flat (scale-invariant) spectrum with a slight red tilt — the Planck 2018 constraint n_s = 0.9649 ± 0.0042 overlaid as a blue band.

**0:26–0:34** — The super-horizon modes: modes with λ >> H⁻¹ are frozen (they cannot evolve because the universe expands faster than they can communicate). As each mode re-enters the horizon after inflation ends, it provides an initial condition for the CMB fluctuations. A series of scales is shown: ℓ = 2 mode re-enters at t = 14 Gyr (today), ℓ = 1000 mode re-enters at t = 380,000 yr (recombination).

**0:34–0:42** — Connecting to CMB: the inflation power spectrum P(k) maps to CMB C_ℓ via transfer function T(k, ℓ). The result is the CMB angular power spectrum — acoustic peaks at ℓ = 220, 540, 810... shown as a red oscillating curve. The primordial spectrum (flat, gold line) is the input; the acoustic peaks are the output after photon-baryon oscillations process it.

**0:42–0:50** — Eternal inflation: regions of the inflaton field where δφ > H (quantum fluctuations exceed classical rolling) inflate eternally. A fractal landscape of inflationary bubbles (different colors for different vacua) forms — the multiverse. One bubble labeled "our universe" with n_s = 0.965 highlighted in gold. "10^(10^7) inflationary e-folds in the full multiverse." Fade to CodedLaws logo.

## Physics Concept Teased
During inflation, quantum fluctuations of the inflaton field are stretched to superhorizon scales, where they freeze as classical density perturbations with a nearly scale-invariant spectrum. After inflation ends, these perturbations re-enter the Hubble horizon and seed all the structure we observe in the CMB and large-scale universe.

## On-Screen Text / Captions
- **0:00** — "Quantum ripple → 100 Mpc structure in 10⁻³² s"
- **0:06** — "Slow roll: ε = 0.01, η = −0.01"
- **0:12** — "Mode freezes at k = aH (Hubble crossing)"
- **0:20** — "Planck: n_s = 0.9649, r < 0.036"
- **0:28** — "ℓ=2 mode re-enters today; ℓ=1000 at recombination"
- **0:36** — "Inflation → CMB peaks via transfer function"
- **0:44** — "Eternal inflation: fractal multiverse of bubbles"

## End Card
Final 3 seconds: the fractal multiverse bubble visualization with one gold "our universe" bubble highlighted, CodedLaws logo centered. CTA: "Full video → Cosmic Inflation Explained."

## Audio
Vast, expansive ambient at 60 BPM — a sense of enormous scale. Gentle ticking sound as e-fold counter increments. Crystalline tone when the mode freezes. Building swell at eternal inflation reveal. No voiceover.

## Production Notes
Renderer: Inflaton potential: Matplotlib 1D curve (Starobinsky R² model). Mode evolution: scipy.integrate.odeint for Mukhanov-Sasaki equation. CMB power spectrum: CAMB Python interface. Eternal inflation fractal: custom 2D cellular automaton (Python, PIL). e-fold zoom: Three.js camera scale animation. 60 fps, 1080×1920.
