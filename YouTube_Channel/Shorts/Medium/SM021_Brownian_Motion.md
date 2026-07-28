---
title: "Brownian Motion — Pollen Grain Random Walk"
id: SM021
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, statistical-mechanics, brownian-motion, diffusion, random-walk]
---

> **What it is:** A ~45-second simulation short where a pollen grain's chaotic random walk through water — driven by invisible molecular collisions — demonstrates Brownian motion and the Einstein diffusion relation that proved atoms exist. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Brownian Motion — Pollen Grain Random Walk

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A pale yellow pollen grain floats against a dark blue background. Invisible water molecules buffet it — shown as rapid tiny white sparks colliding from all sides. The pollen grain jitters in a chaotic, jerky path and leaves a bright yellow trace behind it.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The pollen's trajectory traced in yellow over the first 100 steps. The path looks completely random — no direction preference. Mean displacement shown as a dashed circle growing outward. Caption: "MSD = ⟨r²⟩ = 2dDt (d=2 dimensions)."

**0:10–0:18** — 10 pollen grains released simultaneously. Each traces a different coloured path. After 200 steps, a circle of radius √(4Dt) is overlaid. Caption: "Average over many particles → deterministic diffusion." The ensemble spreads as a Gaussian blob.

**0:18–0:27** — Temperature effect: temperature slider from 20°C to 100°C. As temperature rises the steps get larger (D ∝ T). Pollen grain becomes more agitated. Caption: "Einstein relation: D = k_B T / (6πηr)." Einstein's 1905 paper referenced.

**0:27–0:36** — Zoom out: 1000 pollen grains released from the same point. Their density profile at t = 500 steps shown as a 2D Gaussian heat-map (white centre = highest density). This is the solution to the diffusion equation ∂n/∂t = D∇²n.

**0:36–0:45** — Historical note: "Robert Brown, 1827 — pollen in water, jittery motion." "Albert Einstein, 1905 — explained it using atoms." "Jean Perrin, 1908 — confirmed atoms are real." Bold text: "Brownian motion proved atoms exist." Fade to black.

## Physics Concept Teased
Brownian motion: a particle suspended in a fluid is continuously bombarded by thermal fluctuations of the surrounding molecules. The mean-squared displacement grows linearly with time: ⟨r²⟩ = 2dDt, where D = k_BT/(6πηr) is the diffusion coefficient. Einstein's 1905 analysis of this phenomenon confirmed the reality of atoms.

## On-Screen Text / Captions
- **0:00** — "A pollen grain in water — bombarded by molecules."
- **0:05** — "MSD = ⟨r²⟩ = 2dDt"
- **0:12** — "Ensemble → Gaussian diffusion"
- **0:20** — "D = k_B T / (6πηr) — Einstein 1905"
- **0:28** — "1000 particles → diffusion equation solution"
- **0:35** — "Brown (1827) → Einstein (1905) → Perrin (1908)"
- **0:43** — "Brownian motion proved atoms exist."

## End Card
Final 3 seconds: Gaussian density cloud on dark background. Text: "Jean Perrin won the 1926 Nobel Prize for verifying this." CodedLaws logo.

## Audio
Soft, warm ambient (65 BPM). Rapid high-frequency crackling sound (molecular collisions) in background at low volume. Voiceover at 0:00: "A pollen grain in water jitters randomly — and that jitter proved atoms exist." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D or p5.js. Key algorithm: 2D random walk — each step: dx = gaussianRandom(0, sqrt(2*D*dt)); dy = same. Draw trajectory as polyline. For ensemble: update N particles simultaneously. Plot MSD by averaging ⟨r²⟩ across particles. Einstein-Smoluchowski relation for D: needs η (viscosity), r (particle radius), T (temperature). Runtime: real-time, trivially fast.
