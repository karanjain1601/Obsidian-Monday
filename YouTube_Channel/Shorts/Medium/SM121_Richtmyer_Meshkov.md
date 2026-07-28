---
title: "Richtmyer-Meshkov Instability — Shock-Accelerated Interface"
id: SM121
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Hydrodynamic_Instabilities_Full]]"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, instability, shockwaves, mixing]
---

> **What it is:** A ~45-second simulation short where a Mach 1.5 shockwave smashes a flat air/SF₆ density interface, triggering the Richtmyer-Meshkov instability and erupting the smooth boundary into a field of mushroom-capped spikes and turbulent mixing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Hydrodynamic_Instabilities_Full]]

# Short: Richtmyer-Meshkov Instability — Shock-Accelerated Interface
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A flat interface between a light gas (air, blue) and a heavy gas (SF₆, amber) sits perfectly still. Then a shockwave hits it. In less than a millisecond, the smooth interface erupts into a field of mushroom-shaped spikes — heavy gas plunging into light, light gas bubbling into heavy — the ordered boundary dissolving into turbulent mixing.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D simulation — side view. Left: light gas (ρ_L = 1.2 kg/m³, blue). Right: heavy gas (ρ_H = 6.3 kg/m³, SF₆, amber). Interface perfectly flat at x=0. A rightward-traveling shock (Mach 1.5, white line) approaches from the left. Atwood number A = (ρ_H - ρ_L)/(ρ_H + ρ_L) ≈ 0.68 shown.
- **0:10–0:18:** Shock hits the interface. Transmitted shock (weaker, continuing right) and reflected shock (rarefaction, going left) appear. The interface acquires an impulsive velocity kick Δu ≈ 2A/(1+A)·u_shock·η. Single-mode initial perturbation (η ∝ sin(kx), amplitude 1 mm) amplified — the RMI growth rate: dη/dt = k·Δu·A·η₀ (Richtmyer's formula).
- **0:18–0:28:** Interface grows from 1 mm amplitude to 5 cm in 2 ms. Heavy gas "spikes" plunge into the light gas — long, thin, accelerating downward. Light gas "bubbles" rise into the heavy gas — round-topped, decelerating. Spike-and-bubble asymmetry visible: spikes are narrow and fast, bubbles are broad and slow.
- **0:28–0:38:** Late-time nonlinear evolution: spikes develop Kelvin-Helmholtz roll-up mushroom caps at their tips. Vortex sheet rolled into mushroom structures. Color tracer particles (blue vs. amber) show mixing — the interface thickness grows as h ∝ t^{2/3} in the turbulent regime.
- **0:38–0:45:** Application: inertial confinement fusion (ICF). RMI destroys the implosion symmetry in NIF targets. A schematic of a fuel capsule (spherical shell) shows RMI growing on the inner surface during implosion — bright red spikes penetrating inward to the hot spot. Text: "RMI is the main barrier to ignition in fusion."

## Physics Concept Teased
The Richtmyer-Meshkov instability (RMI) occurs when a shock impulsively accelerates a density interface. Unlike Rayleigh-Taylor (sustained acceleration), RMI receives a single impulsive kick (Δu) and grows linearly as η ∝ k·Δu·A·t. At late times, nonlinear dynamics creates characteristic spike-and-bubble asymmetry and turbulent mixing. It is crucial for ICF implosion uniformity and supersonic mixing in scramjets.

## On-Screen Text / Captions
- **0:00:** "A shockwave hits a density interface. The result is never flat again."
- **0:08:** "Mach 1.5 shock. Atwood number A = 0.68."
- **0:15:** "RMI growth: dη/dt = k · Δu · A · η₀"
- **0:23:** "Spikes: narrow, fast. Bubbles: broad, slow."
- **0:30:** "Mushroom caps: Kelvin-Helmholtz roll-up"
- **0:38:** "RMI destroys fusion implosion symmetry at NIF."
- **0:44:** "The hardest problem between us and fusion power."

## End Card
Final 3 seconds: the fully developed mushroom field — dark amber spikes on blue background, perfectly symmetric. Text: "One shock. One interface. Infinite complexity." Channel logo.

## Audio
Sharp crack of the shockwave at 0:03. Then silence, then a slow building of chaotic white noise as the interface breaks up. Voiceover (controlled urgency): "The shock only hits once — but the damage lasts forever." Boiling/bubbling sound effects for the bubble rise phase at 0:28.

## Production Notes
Code complexity: complex. Renderer: WebGL. Key algorithm: 2D compressible Euler with multi-fluid tracking — use a level-set or volume-of-fluid method to track the interface. Godunov scheme (HLLC Riemann solver) on 512×512 grid. Initial perturbation: η(y) = η₀·cos(2πy/λ), η₀=1mm, λ=L_y. Shock Mach number M=1.5, Atwood number A=0.68 (air/SF₆). Interface tracked by coloring fluid (color field advected as passive scalar). Spike velocity: v_spike ∝ Δu·A, bubble velocity: v_bubble ∝ Δu·(1-A). Gotcha: numerical diffusion smears the interface — use high-order WENO reconstruction near the interface. For ICF animation: use a separate spherical shell simulation in 2D spherical coordinates.
