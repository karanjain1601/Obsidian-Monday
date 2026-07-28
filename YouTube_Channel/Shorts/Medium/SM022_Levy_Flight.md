---
title: "Lévy Flight — Superdiffusion"
id: SM022
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, statistical-mechanics, levy-flight, superdiffusion, random-walk]
---

> **What it is:** A ~45-second simulation short contrasting a normal Brownian walk with a Lévy flight's heavy-tailed random walk, where rare enormous jumps create a sparse fractal path and superdiffusive spread. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Lévy Flight — Superdiffusion vs Normal Diffusion

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Two paths side by side on a black canvas. Left: a tangled Brownian walk in blue — tight, clustered, local. Right: a Lévy flight in orange — mostly small steps, then a sudden enormous jump across the entire canvas, then small steps again. The contrast is shocking.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Lévy flight definition: step lengths drawn from a power-law distribution P(l) ∝ l^(-1-α), 0 < α < 2. Most steps are tiny; rare steps are enormous. The "heavy-tailed" nature visualised as a log-log probability histogram: Brownian (Gaussian, rapid decay) vs Lévy (straight line = power law).

**0:10–0:18** — Spatial comparison: after 500 steps, the Brownian walk covers a small circle (radius ∝ √t). The Lévy flight has visited the same total area but with a very different topology — a sparse fractal of long excursions with local clusters. Both cover area shown with a convex hull.

**0:18–0:27** — MSD comparison: ⟨r²⟩ vs t on a log-log plot. Brownian: slope = 1 (normal diffusion). Lévy (α < 2): slope = 2/α > 1 — superdiffusion. Annotation: "Lévy: ⟨r²⟩ ∝ t^(2/α) — superdiffusion."

**0:27–0:36** — Natural examples: albatross flight paths (Lévy) vs. cow grazing paths (Brownian). Simplified silhouette overlays matching the path shapes. Caption: "Albatrosses use Lévy flights to find food." Also: photon transport in cloudy atmosphere, human mobility, stock prices.

**0:36–0:45** — α slider from 0.5 to 2.0. As α → 2, the Lévy flight converges to Brownian motion (CLT kicks in). As α → 0, flights become more extreme. Caption: "α = 2 → Brownian; α < 2 → Lévy." Fade to black.

## Physics Concept Teased
Lévy flight: a random walk where step lengths are drawn from a heavy-tailed power-law distribution. For α < 2, the variance diverges — the Central Limit Theorem fails and the walk is superdiffusive (⟨r²⟩ ∝ t^(2/α)). Lévy flights optimize search strategies in sparse environments.

## On-Screen Text / Captions
- **0:00** — "Two random walks. Very different."
- **0:05** — "Lévy: P(l) ∝ l^(-1-α) — heavy tail"
- **0:12** — "Brownian: compact. Lévy: sparse fractal."
- **0:20** — "Lévy: ⟨r²⟩ ∝ t^(2/α) — superdiffusion"
- **0:28** — "Albatrosses use Lévy flights to find food"
- **0:35** — "α → 2 → Brownian motion"
- **0:43** — "Lévy flight — optimal search strategy."

## End Card
Final 3 seconds: both paths superimposed on dark background, Brownian (blue) vs Lévy (orange). Text: "Lévy flights appear in: albatross foraging, human mobility, stock markets." CodedLaws logo.

## Audio
Ambient electronic with occasional stabs of piano (long gap → sudden note = a Lévy jump). Voiceover at 0:00: "Normal diffusion is local. Lévy flight is different — mostly local steps with rare enormous jumps." Whoosh sound for each large Lévy jump.

## Production Notes
Code complexity: low. Renderer: Canvas 2D or p5.js. Key algorithm: Lévy step generation via inverse CDF method: l = l_min * u^(-1/α) where u = uniform(0,1). Direction: uniform random angle. Brownian: l = gaussianRandom(0, σ). Run simultaneously for comparison. Plot MSD by storing all positions and computing ⟨r²(t)⟩ = mean of |r(t) - r(0)|² over multiple runs. Runtime: real-time.
