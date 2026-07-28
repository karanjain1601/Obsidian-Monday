---
title: "Hawking Radiation — Pair Production Near Horizon"
id: SA062
type: youtube-short
duration: "~45 seconds"
feeds_video: "Hawking Radiation: How Black Holes Evaporate"
difficulty: advanced
tags: [physics, simulation, short, advanced, black-holes, Hawking-radiation, pair-production, quantum-gravity]
---

> **What it is:** A ~45-second simulation showing virtual particle-antiparticle pairs created near the event horizon with one particle falling in and the other escaping as thermal Hawking radiation that slowly evaporates the black hole. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Hawking Radiation: How Black Holes Evaporate

# Short: Hawking Radiation — Pair Production Near Horizon

**Feeds full video:** Hawking Radiation: How Black Holes Evaporate

## Visual Hook (First 3 Seconds)
Just outside a black hole's event horizon (glowing red ring on black background), a virtual particle pair flashes into existence — one particle in gold (#FFD700), one in red (#FF2222). The gold particle escapes outward (upward trajectory), the red one falls inward (downward, vanishing into the black). Text appears: "T_H = ℏc³/(8πGMk_B) = 62 nK (1 M_☉ BH)."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The spacetime diagram near the horizon: Kruskal-Szekeres coordinates shown (U, V axes). The event horizon is the diagonal line U=0. A Bogoliubov transformation diagram shows how "in" vacuum modes (right region, cyan wave) mix with "out" modes (upper region, gold wave). The mixing coefficients α_ω and β_ω are labeled.

**0:10–0:18** — The Bogoliubov coefficients: |β_ω/α_ω|² = e^(−ω/T_H) — a thermal spectrum. This is plotted as a Planck-like distribution curve (gold curve on black background) with peak at ω_peak = 2.82·T_H. For T_H = 62 nK: peak frequency ν_peak = 3.6 GHz (microwave). The particle spectrum matches a blackbody exactly.

**0:18–0:26** — The tunneling interpretation: a positive-energy particle (gold, ω = +E) tunnels through the horizon classically forbidden region. The WKB tunneling probability: Γ ∝ e^(−2 Im∫p_r dr) = e^(−8πME) is computed. This matches the Boltzmann factor e^(−E/T_H) with T_H = 1/8πM in natural units.

**0:26–0:34** — Energy conservation: the escaping Hawking photon (gold, E = ℏω) carries energy away, reducing the black hole mass. Mass vs time: dM/dt = −ℏc⁴/(15360πG²M²). For M = M_☉: dM/dt = −7×10⁻³² kg/s. The mass curve shows: tiny decline initially, then explosive evaporation at the end (the "Page time" labeled at M = M₀/2^(1/3)).

**0:34–0:42** — Greybody factors: the actual Hawking spectrum is modified by the effective potential outside the horizon. The transmission coefficient Γ_ℓ(ω) for angular momentum ℓ=0 scalar particles is plotted vs ω — it rises from 0 at ω=0 to 1 at high ω. The observed spectrum = blackbody × Γ_ℓ(ω). The s-wave greybody factor shown as a yellow-dashed curve.

**0:42–0:50** — Final comparison: three black holes on screen with their Hawking temperatures. Solar mass M_☉: T_H = 62 nK (blue, barely visible). Asteroid mass M = 10¹² kg: T_H = 123 K (yellow, warm). Planck mass M = 10⁻⁸ kg: T_H = 10³² K (red, fiery). "Smaller BH = hotter." Fade to CodedLaws logo.

## Physics Concept Teased
Hawking radiation arises from the quantum-mechanical mixing of positive- and negative-frequency modes near the event horizon, described by Bogoliubov transformations between the initial vacuum and the outgoing particle states. The result is an exact thermal spectrum at temperature T_H = ℏc³/8πGMk_B, inversely proportional to mass.

## On-Screen Text / Captions
- **0:00** — "Hawking temp: T_H = 62 nK (1 M_☉ BH)"
- **0:06** — "Bogoliubov transformation: in-vacuum → particles"
- **0:12** — "Spectrum: Planck distribution at T_H = 62 nK"
- **0:20** — "Tunneling: Γ = e^(−8πME) = e^(−E/T_H)"
- **0:28** — "dM/dt = −7×10⁻³² kg/s (extremely slow)"
- **0:36** — "Greybody factor: s-wave transmission"
- **0:44** — "Smaller black hole = hotter Hawking radiation"

## End Card
Final 3 seconds: three black holes at different scales with temperature labels, CodedLaws logo at center. CTA: "Full video → Hawking Radiation Explained."

## Audio
Eerie space ambient at 65 BPM. Soft pop sound on each virtual pair creation. Rising pitch tone as temperature increases with smaller BH mass. No voiceover.

## Production Notes
Renderer: Kruskal diagram in Matplotlib with custom conformal coordinates. Bogoliubov coefficient computed analytically for Schwarzschild. Greybody factor calculated numerically via Regge-Wheeler equation integration (scipy.integrate.odeint). Planck spectrum plot with thermal noise overlay. Three.js for spinning black hole spheres. 60 fps, 1080×1920.
