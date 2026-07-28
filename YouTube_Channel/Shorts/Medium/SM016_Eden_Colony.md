---
title: "Eden Model — Bacterial Colony Growth"
id: SM016
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, growth-model, fractal, biology, statistical-mechanics]
---

> **What it is:** A ~45-second simulation showing a single bacterium growing into a rough-edged circular colony by randomly spawning neighbours at its perimeter, with the interface roughness obeying KPZ universality class scaling — demonstrating the Eden growth model. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Eden Model — Bacterial Colony Growth

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black petri dish view. A single bright green bacterial cell at the centre. In 3 seconds a circular colony explodes outward — but not smoothly: the edge is rough, ragged, with random bumps and peninsulas, like a real bacterial colony photographed from above.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Eden model rules appear: "Any cell on the boundary of the colony randomly spawns a neighbour." New cells light up bright green, slightly random at the perimeter. Colony radius R(t) grows as R ∝ t^(1/2). Graph inset shows R vs t — square-root law.

**0:10–0:18** — Interface roughness shown: the boundary is not a smooth circle. A thin red outline traces the colony perimeter. The width of the perimeter fluctuations w(t) is measured. Log-log plot: w ∝ t^β, β = 1/3 (KPZ universality class).

**0:18–0:27** — Compare: left = Eden model (rough, KPZ), right = circular growth (smooth). The KPZ interface has "fingers" and bays; the smooth model has a perfect circle. Caption: "KPZ universality — same exponents as fire fronts and paper wetting."

**0:27–0:36** — Colour-code by growth generation: early generations dark green (centre), later bright green (edge), newest fluorescent lime. The colony interior appears as concentric growth rings — like tree rings for bacteria.

**0:36–0:45** — Zoom in on the colony edge: individual cells visible, the random addition of boundary cells. Slow-motion: one new cell added, then another, at random perimeter sites. Text: "Random local growth → universal scaling." Fade to black.

## Physics Concept Teased
Eden model: bacteria grow by randomly adding cells to the colony perimeter. The resulting interface is rough and belongs to the KPZ (Kardar-Parisi-Zhang) universality class. The roughness exponent β = 1/3 and growth exponent α = 1/2 appear in fire-front spreading, paper wetting, and tumour growth.

## On-Screen Text / Captions
- **0:00** — "One bacterium."
- **0:05** — "Random boundary growth"
- **0:12** — "Interface roughness w ∝ t^(1/3) — KPZ universality"
- **0:20** — "Compare: Eden (rough) vs. smooth growth"
- **0:30** — "Growth rings — like trees"
- **0:38** — "Random local growth → universal scaling."
- **0:44** — "Eden model — KPZ class."

## End Card
Final 3 seconds: the colony with coloured growth rings on black background. Text: "KPZ universality: the same exponents appear in 50+ different systems." CodedLaws logo.

## Audio
Organic, pulsing ambient (75 BPM), synthesised heartbeat-like bass. Each cell addition = faint pop sound (slightly randomised pitch). Voiceover at 0:00: "Grow a colony one random cell at a time and the rough boundary obeys a universal law." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D. Key algorithm: Eden model on a 2D grid. Maintain a list of perimeter cells (cells adjacent to the colony but not part of it). Each step: pick a random perimeter cell, add it to the colony, update the perimeter list. Colour by step number for the growth-ring effect. Measure interface width: w² = ⟨h²⟩ - ⟨h⟩² over angular sections. Runtime: real-time, very fast in JavaScript.
