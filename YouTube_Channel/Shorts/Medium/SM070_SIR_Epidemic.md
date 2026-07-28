---
title: "SIR Epidemic Model — Infection Wave"
id: SM070
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, epidemiology, SIR-model, infection-wave, network, population-dynamics]
---

> **What it is:** A ~45-second simulation short where a single infected dot ignites a disease wave that sweeps across 10,000 susceptible agents — turning them red then immune blue — demonstrating the SIR model's R₀ threshold, peak infection dynamics, herd immunity threshold, and spatial Fisher-KPP wave propagation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: SIR Epidemic Model — Infection Wave

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D grid of 10,000 dots — all grey (susceptible). One turns red (infected). In 3 seconds the red spreads like fire across the grid — a disease wave radiating outward, turning grey dots red, then the red dots becoming dark blue (recovered/immune) in its wake.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — SIR equations: dS/dt = -βSI/N; dI/dt = βSI/N - γI; dR/dt = γI. S = susceptible, I = infected, R = recovered. Parameters: β = infection rate, γ = recovery rate. Basic reproduction number R₀ = β/γ. Caption: "R₀ = β/γ — the key number." Three compartments shown as coloured boxes.

**0:10–0:18** — Phase portrait: S-I plane. The trajectory spirals inward. At peak infection: dI/dt = 0 → S = γ/β = N/R₀. Caption: "Peak infection when S = N/R₀." S vs time: decreasing curve. I vs time: peaked curve (the "epidemic curve"). R vs time: rising S-curve.

**0:18–0:27** — R₀ sweep: R₀ = 0.5 (no epidemic — infection dies out), R₀ = 1.0 (critical — barely spreads), R₀ = 2.0 (seasonal flu — infects ~80%), R₀ = 5.0 (measles-like — infects ~99%). Final size formula: R_∞ satisfies R_∞/N = 1 - exp(-R₀·R_∞/N). Caption: "R₀ = 5: final size = 99% of population."

**0:27–0:36** — Spatial SIR on a 2D grid: the infection wave propagates as a Fisher-KPP wave at speed v = 2√(Dβ). The wave front has a characteristic width. Shown in the 2D simulation: grey→red→blue wave sweeping across the grid. Caption: "Spatial spread: wave speed = 2√(Dβ)."

**0:36–0:45** — Vaccination threshold: adding vaccination (V = fraction vaccinated). The epidemic is prevented if V > 1 - 1/R₀. For R₀=5: need 80% vaccinated. "Herd immunity threshold = 1 - 1/R₀." Caption shows the critical vaccination fraction. Bold text: "SIR model — predicts epidemics, guides vaccination." Fade to black.

## Physics Concept Teased
SIR model: a system of coupled ODEs for the fractions of susceptible, infected, and recovered individuals. R₀ = β/γ determines whether an epidemic occurs (R₀ > 1). The herd immunity threshold is 1 - 1/R₀. Spatial SIR produces travelling Fisher-KPP infection waves at speed 2√(Dβ).

## On-Screen Text / Captions
- **0:00** — "One infected individual. 10,000 susceptible."
- **0:05** — "R₀ = β/γ — basic reproduction number"
- **0:12** — "Peak infection: when S = N/R₀"
- **0:20** — "R₀ = 5 → 99% infected without vaccination"
- **0:28** — "Spatial wave speed: v = 2√(Dβ)"
- **0:35** — "Herd immunity threshold: V > 1 - 1/R₀"
- **0:43** — "SIR model — the foundation of epidemiology."

## End Card
Final 3 seconds: the epidemic curve (I vs time) — a clear bell-shaped peak. Text: "COVID-19 R₀ ≈ 2-3 (original strain), ~10 (Omicron)." CodedLaws logo.

## Audio
Tense, building ambient (90 BPM). Each infection event = soft "whomp." Building intensity as epidemic grows, then fading as it dies down. Voiceover at 0:00: "One number — R₀ — determines whether a disease becomes an epidemic or fades out on its own." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D. Key algorithm: spatial SIR on a 2D grid. Each cell is S, I, or R. At each step: each I cell infects each neighbouring S cell with probability β·dt; each I cell recovers with probability γ·dt. Spatial spread naturally produces the wave. For the mean-field model: integrate ODEs with RK4. For the epidemic curve: plot I(t) vs t. R₀ sweep: precompute final sizes for different R₀ values and animate the curves. Runtime: real-time Canvas 2D, fast.
