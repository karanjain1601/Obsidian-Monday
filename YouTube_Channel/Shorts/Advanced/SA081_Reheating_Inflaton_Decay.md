---
title: "Reheating — Inflaton Decay to Standard Model"
id: SA081
type: youtube-short
duration: "~45 seconds"
feeds_video: "Reheating After Inflation: From Cold Universe to Hot Big Bang"
difficulty: advanced
tags: [physics, simulation, short, advanced, inflation, reheating, inflaton, particle-physics, cosmology]
---

> **What it is:** A ~45-second simulation showing the inflaton field coherently oscillating at the bottom of its potential after inflation and resonantly decaying into Standard Model particles to reheat the universe to a radiation-dominated plasma. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Reheating After Inflation: From Cold Universe to Hot Big Bang

# Short: Reheating — Inflaton Decay to Standard Model

**Feeds full video:** Reheating After Inflation: From Cold Universe to Hot Big Bang

## Visual Hook (First 3 Seconds)
A cold, dark universe (near-zero temperature, black background with only the inflaton field φ oscillating — a gold sine wave). Then: the inflaton starts decaying. Bursts of colored particles (red quarks, cyan leptons, green gauge bosons) spray outward from each oscillation. Temperature counter: T = 0 K → T = 10¹⁵ K in 1 second of animation. Text: "Reheating: inflation → hot Big Bang."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The inflaton oscillation: after slow roll ends at φ_end, the inflaton oscillates at the bottom of its potential V(φ) = ½m_φ²φ². Oscillation frequency ω = m_φ ~ 10¹³ GeV/ℏ ~ 10³⁷ Hz. The energy density: ρ_φ = ½φ̇² + ½m_φ²φ² shown as a decaying envelope (scale factor dilution: ρ ∝ a⁻³ for matter-like oscillations).

**0:10–0:18** — Perturbative decay: the inflaton couples to Standard Model particles via g·φ·χ² interaction (shown as a Feynman vertex: gold inflaton line → two cyan χ lines). Decay rate: Γ_φ = g²m_φ/8π. For g = 10⁻³, m_φ = 10¹³ GeV: Γ = 10⁶ GeV. Decay completes when H = Γ: reheating time t_RH = 1/Γ = 10⁻⁶ GeV⁻¹ ≈ 6.5×10⁻²⁸ s.

**0:18–0:26** — Parametric resonance (preheating): before perturbative decay, non-perturbative effects dominate. The equation of motion for χ modes: χ̈_k + (k² + g²φ²(t))χ_k = 0 — a Mathieu equation with time-varying mass. In resonance bands (shown as colored bands in the k-q plane), modes grow exponentially: n_k ~ e^(μ_k·m_φ·t). For q = g²Φ²/4m_φ² = 100: μ = 0.28, growth rate = 10^(0.28×m_φ t).

**0:26–0:34** — Thermalization: the exponentially produced χ particles scatter off each other and reach thermal equilibrium. The distribution function f(p) evolves from a peaked non-thermal distribution (shown as spiky red curve) to a Bose-Einstein distribution (smooth gold curve). The thermalization time: t_th ~ 1/(α T_RH) where α is the coupling. T_RH = (Γ M_P²/π)^(1/4) = 10¹⁵ K.

**0:34–0:42** — The reheat temperature: T_RH = (90/π²g_*)^(1/4) × (Γ M_Pl)^(1/2) × (ℏ/k_B). For Γ = 10⁶ GeV, g_* = 106.75 (Standard Model): T_RH = 3×10¹⁵ K. This is the maximum temperature of the hot Big Bang. The formula is shown in white text. A Hubble diagram (log H vs log a) shows the transition from inflation (dashed cyan) to radiation-dominated era (solid gold) at a = a_RH.

**0:42–0:50** — Baryogenesis connection: at T ≈ T_EW = 10¹² K, electroweak sphalerons convert baryon number to lepton number and vice versa. The baryon asymmetry η_B = (n_B − n_B̄)/s ≈ 10⁻¹⁰ (measured from CMB) must be generated at or after reheating. Sphalerons shown as a network of Higgs field connections. "1 quark survives per 10¹⁰ pairs." Fade to CodedLaws logo.

## Physics Concept Teased
Reheating is the process by which the inflaton field transfers its energy to Standard Model particles after inflation, converting the cold inflationary vacuum into the hot thermal Big Bang. The dominant mechanism is parametric resonance (preheating) followed by perturbative decay and thermalization to reach the reheat temperature T_RH.

## On-Screen Text / Captions
- **0:00** — "Inflaton decay: 0 K → 10¹⁵ K in 10⁻²⁸ s"
- **0:06** — "ρ_φ ∝ a⁻³: inflaton behaves like matter"
- **0:12** — "Perturbative: Γ = g²m_φ/8π, t_RH = 6.5×10⁻²⁸ s"
- **0:20** — "Preheating: Mathieu resonance, exponential growth"
- **0:28** — "Thermalization: non-thermal → Bose-Einstein"
- **0:36** — "T_RH = 3×10¹⁵ K (Standard Model, g_* = 106.75)"
- **0:44** — "Baryogenesis at T_EW: 1 baryon per 10¹⁰ pairs"

## End Card
Final 3 seconds: the particle spray from the inflaton decay with temperature counter frozen at 10¹⁵ K, CodedLaws logo centered. CTA: "Full video → Reheating After Inflation."

## Audio
From cold silence (near-zero ambient) to an explosive thermal roar. Particle collision sounds building as thermalization completes. Final chord: warm, stable equilibrium tone. No voiceover.

## Production Notes
Renderer: Mathieu equation solutions: SciPy odeint over k-q parameter grid. Floquet stability chart: Matplotlib filled contour. Particle distribution function: Matplotlib animated histogram. Feynman vertex: custom SVG diagram. Hot particle system: Three.js instanced mesh with temperature-color mapping. 60 fps, 1080×1920.
