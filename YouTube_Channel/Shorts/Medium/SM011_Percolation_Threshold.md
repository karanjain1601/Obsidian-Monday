---
title: "Percolation Threshold"
id: SM011
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, statistical-mechanics, percolation, phase-transition, network]
---

> **What it is:** A ~45-second simulation showing random sites on a grid being progressively activated until — at a precise critical probability — a fractal spanning cluster suddenly bridges top to bottom for the first time — demonstrating percolation as a geometric phase transition. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Percolation Threshold

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black grid, 200×200 cells. Sites blink on (white) one by one randomly. At 2.5 seconds — the critical moment — a single blue path suddenly connects the top edge to the bottom edge, snaking through the white dots in a branching lightning bolt shape.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Slow sweep of occupation probability p from 0.3 to 0.59 (below threshold). Many isolated white clusters form but none spans top to bottom. Largest cluster highlighted in cyan but still isolated. Text: "p = 0.50 — no spanning cluster."

**0:10–0:18** — p crosses 0.593 (the 2D square lattice percolation threshold). At the exact threshold: a fractal spanning cluster appears, highlighted bright blue. The cluster is ragged, branching, with holes at all scales. Caption: "p_c = 0.5927 — spanning cluster appears."

**0:18–0:27** — Spanning cluster size (S) vs p plotted live: S ≈ 0 below p_c, then jumps discontinuously — actually a power-law: S ∝ (p - p_c)^β, β = 5/36. The graph materialises on screen. Annotation: "Order parameter critical exponent β = 5/36."

**0:27–0:36** — Heat-map of cluster sizes: large clusters (blue) vs small clusters (red/yellow). Right at threshold a power-law distribution of cluster sizes appears — self-similar at all length scales. Caption: "Power-law cluster size distribution."

**0:36–0:45** — Three side-by-side frames: p = 0.40 (fragmented), p = 0.59 (fractal), p = 0.75 (solid). Bold text: "Below / At / Above the threshold." Fade to black.

## Physics Concept Teased
Percolation is a geometric phase transition: at the critical probability p_c, a spanning connected cluster first appears. Right at p_c the system is scale-free (fractal) and exhibits power-law scaling in cluster sizes, susceptibility, and correlation length — a universal second-order transition.

## On-Screen Text / Captions
- **0:00** — "Random sites on a grid…"
- **0:05** — "p = 0.50 — isolated clusters only"
- **0:12** — "p_c = 0.5927 — spanning cluster!"
- **0:20** — "Order parameter: S ∝ (p - p_c)^(5/36)"
- **0:28** — "Power-law cluster sizes — fractal"
- **0:38** — "Below / At / Above the threshold"
- **0:44** — "Percolation — a geometric phase transition."

## End Card
Final 3 seconds: fractal spanning cluster on black background. Text: "Same math: forest fires, epidemics, conductivity of composites." CodedLaws logo.

## Audio
Minimalist electronic clicks (each site activation = soft click sound, accelerating near threshold). Low ambient drone intensifies at threshold. Voiceover at 0:00: "Fill a grid randomly — at a critical density something remarkable happens." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Hoshen-Kopelman cluster labelling algorithm (union-find / disjoint set) for O(N) cluster identification. Animate p sweeping from 0 to 1, recompute clusters each frame. Spanning check: does any cluster touch both top and bottom rows? Fractal dimension of spanning cluster at threshold: D_f ≈ 91/48. Gotcha: for visual clarity use a grid no larger than 300×300 on Canvas 2D (WebGL for larger). Runtime: real-time.
