---
title: "Rogue Wave — Constructive Interference"
id: SM039
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, waves, rogue-wave, nonlinear-optics, ocean, interference]
---

> **What it is:** A ~45-second simulation short conjuring a towering rogue wave from a chaotic ocean by aligning 20 wave trains in phase and via nonlinear modulational instability, recreating the Draupner wave that was first instrumentally measured in 1995. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Rogue Wave — Constructive Interference

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
An ocean surface — chaotic waves of varying heights. Suddenly a single towering wall of water three times taller than the surrounding waves erupts from the sea — a rogue wave. In 3 seconds it has appeared, peaked, and begun to collapse.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Linear mechanism: many wave trains of different frequencies and directions are superimposed. Their phases happen to align at one point in space-time — all crests arrive simultaneously. The sum of 20 small waves creates one giant crest. Caption: "Constructive interference of 20 wave trains."

**0:10–0:18** — Nonlinear mechanism (modulational instability): a uniform sinewave shown, then perturbed. The Peregrine soliton solution of the nonlinear Schrödinger equation (NLS): localised in both space and time, amplitude 3× the background. Caption: "Peregrine soliton — NLS rogue wave." The profile: u = background × (1 - 4(1+2it)/(1+4x²+4t²)).

**0:18–0:27** — Ocean simulation: a JONSWAP wave spectrum (realistic ocean waves) evolved forward in time with linear wave theory. Rogue wave probability highlighted: regions where the maximum crest height exceeds 2× the significant wave height. Caption: "Significant wave height H_s; rogue: H > 2H_s."

**0:27–0:36** — Historical event: the Draupner wave, 1 January 1995, North Sea. Measured wave height: 25.6 m against H_s = 12 m. Simulation recreates the Draupner wave time series. Annotation: "Draupner wave — the first instrumentally measured rogue wave."

**0:36–0:45** — Slow-motion of the rogue wave crest — a vertical wall of dark water. Then it breaks and collapses. Bold text: "Rogue waves — 1-in-10,000 sea states, but real." Fade to black.

## Physics Concept Teased
Rogue waves: anomalously large ocean waves that arise from linear constructive interference or nonlinear modulational instability (Peregrine soliton). The nonlinear Schrödinger equation predicts localised wave packets that focus energy in space and time, creating brief extreme amplifications of the background wave field.

## On-Screen Text / Captions
- **0:00** — "A wave three times taller than the rest."
- **0:05** — "Linear: 20 wave trains align in phase"
- **0:12** — "Peregrine soliton: amplitude = 3 × background"
- **0:20** — "Rogue criterion: H > 2H_s"
- **0:28** — "Draupner wave, 1995: 25.6 m rogue wave"
- **0:35** — "Modulational instability — NLS equation"
- **0:43** — "Rogue waves — rare but real."

## End Card
Final 3 seconds: freeze-frame of towering rogue wave crest. Text: "Over 200 large ships sank from 1969–1994 — many suspected rogue waves." CodedLaws logo.

## Audio
Ominous ocean ambient — building wave sounds, low rumble. At the rogue wave peak: a deep, massive impact boom. Voiceover at 0:00: "A rogue wave appears from seemingly nowhere — three times larger than the surrounding sea." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: WebGL (ocean surface). Key algorithm: Linear mechanism: superpose plane waves with random phases and JONSWAP amplitude spectrum. Height field: h(x,t) = Σ a_k cos(k·x - ω_k t + φ_k). For focused wave: choose phases so φ_k = k·x₀ - ω_k t₀ (all crests arrive at x₀, t₀). Nonlinear NLS Peregrine soliton: analytic formula visualised. Ocean rendering: WebGL height-field with normal mapping and Fresnel reflections. Draupner wave: use published time-series data and replicate in 1D simulation. Runtime: real-time WebGL for linear model; pre-rendered for NLS Peregrine.
