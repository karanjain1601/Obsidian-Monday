---
title: "Gray-Scott Pattern Zoo — Spots to Stripes"
id: SM067
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, reaction-diffusion, gray-scott, pattern-formation, spots, stripes]
---

> **What it is:** A ~45-second simulation short where two parameters — feed rate f and kill rate k — transform a Gray-Scott reaction-diffusion system from perfectly round self-replicating spots into stripes, labyrinths, moving worms, and anti-dots, demonstrating the extraordinarily rich pattern zoo contained in a single pair of equations. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Gray-Scott Pattern Zoo — Spots to Stripes

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas. White spots appear — perfectly round, evenly spaced. The title flashes: "Feed rate f = 0.035." Then the pattern transforms: spots merge into stripes, stripes branch into labyrinths, labyrinths dissolve into holes — all driven by two numbers.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Gray-Scott model: ∂u/∂t = D_u∇²u - uv² + f(1-u); ∂v/∂t = D_v∇²v + uv² - (f+k)v. Two parameters: feed rate f (how fast fresh u is added) and kill rate k (how fast v is removed). Caption: "Two parameters: f (feed) and k (kill)."

**0:10–0:18** — Phase diagram animation: a 2D plot of f vs k. Each (f,k) point colour-coded by its pattern type. Tour through the phase diagram: (f=0.037, k=0.060) → spots; (f=0.060, k=0.062) → stripes; (f=0.025, k=0.060) → labyrinthine; (f=0.039, k=0.058) → self-replicating spots. Caption: "Phase diagram of patterns."

**0:18–0:27** — Self-replicating spots demo: a single spot grows, elongates, and splits into two spots — each of which grows and splits again. Exponential growth of spot count. Caption: "Self-replicating spots — like cell division."

**0:27–0:36** — The "worm" pattern: a small worm-like structure that moves and avoids its own tail. Caption: "Moving worm: a self-propelled structure from reaction-diffusion." The worm traces a spiral path.

**0:36–0:45** — Gallery mode: 6 side-by-side panels, each a different (f,k) pair: dots, anti-dots, stripes, labyrinths, moving worms, solitons. Bold text: "One set of equations. Infinite pattern zoo." Fade to black.

## Physics Concept Teased
Gray-Scott model: a two-chemical reaction-diffusion system. Depending on the feed rate f and kill rate k, the system produces an extraordinarily rich variety of patterns — dots, stripes, labyrinths, moving structures, and self-replicating spots. The pattern selection is determined by the linear stability of the homogeneous state and nonlinear mode competition.

## On-Screen Text / Captions
- **0:00** — "Two chemicals. Two numbers."
- **0:05** — "Gray-Scott: ∂u/∂t = D_u∇²u - uv² + f(1-u)"
- **0:12** — "Phase diagram: f vs k → different patterns"
- **0:20** — "Self-replicating spots — like cell division"
- **0:28** — "Moving worm — self-propelled structure"
- **0:35** — "6 panels: dots, stripes, labyrinths, worms, solitons"
- **0:43** — "One equation — infinite pattern zoo."

## End Card
Final 3 seconds: the 6-panel gallery. Text: "Explore the full Gray-Scott phase diagram at mrob.com/pub/comp/xmorphia — link in bio." CodedLaws logo.

## Audio
Evolving ambient that shifts character with each pattern type. Voiceover at 0:00: "Change two numbers in the Gray-Scott equation and the entire world of patterns transforms — spots to stripes to worms to chaos." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: WebGL fragment shader. Key algorithm: same RD scheme as SM066 but with Gray-Scott kinetics. D_u = 0.2097, D_v = 0.105. Initial condition: uniform (1,0) with a small square perturbation of (0.5, 0.25) + noise. For pattern zoo: precompute 6 simulations with different (f,k) pairs, run for 5000 steps each, display side-by-side. Real-time slider for f and k to explore phase diagram interactively. Colour-map: dark = high v (chemical product), light = low v. Runtime: real-time WebGL fragment shader, 256×256 per panel.
