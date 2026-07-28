---
title: "Diffusion-Limited Aggregation"
id: SM015
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fractal, diffusion, aggregation, pattern-formation]
---

> **What it is:** A ~45-second simulation showing random-walking particles released from the boundary wandering until they contact a central seed and stick, gradually building a delicate branching dendritic tree with fractal dimension 1.71 — demonstrating diffusion-limited aggregation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Diffusion-Limited Aggregation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black screen. A single white seed particle at the centre. In 3 seconds a spectacular branching dendritic tree of white particles grows outward — thin branching arms, delicate tips, with no two branches alike — like a lightning bolt frozen in crystal.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — DLA growth shown in real time. Random-walking particles (shown as faint blue dots) wander in from the edges. The moment one touches the growing cluster it sticks (turns white). The cluster's outer tips grow fastest, starving the inner regions. Annotation: "Tip instability — tips attract more walkers."

**0:10–0:18** — Cluster grows to ~500 particles. A branching tree fills a quarter of the canvas. Branches subdivide into thinner sub-branches at all scales. Annotation: "Fractal — self-similar at all scales."

**0:18–0:27** — Box-counting shown: a grid overlay shrinks in resolution. At each resolution the number of boxes containing the cluster is counted. Log-log plot: N(r) ∝ r^(-1.71). Caption: "Fractal dimension D_f = 1.71."

**0:27–0:36** — Colour-code particles by the time they were added (early = red, late = blue). The tip particles (blue) form a blue corona; inner skeleton is red, showing that early stickers are buried deep. Visual creates a beautiful rainbow dendrite.

**0:36–0:45** — Full-grown cluster (~5000 particles) fills the canvas. Text: "DLA — fractal growth from randomness." Slow zoom out to reveal the full symmetry. Fade to black.

## Physics Concept Teased
Diffusion-limited aggregation: particles diffusing randomly (Brownian motion) stick upon first contact with a growing cluster. The resulting structure is a fractal with dimension D_f ≈ 1.71 in 2D. DLA models snowflake growth, mineral dendrites, and electrodeposition.

## On-Screen Text / Captions
- **0:00** — "One seed. Random walkers."
- **0:05** — "Stick on contact — the cluster grows"
- **0:12** — "Tip instability: tips grow fastest"
- **0:20** — "Fractal dimension D_f = 1.71"
- **0:28** — "Rainbow: early (red) → late (blue) particles"
- **0:38** — "Fractal growth from Brownian motion."
- **0:44** — "DLA — diffusion-limited aggregation."

## End Card
Final 3 seconds: full DLA cluster on black background, slowly rotating (3D perspective tilt). Text: "Snowflakes, dendrites, lightning channels — all DLA." CodedLaws logo.

## Audio
Sparse, crystalline ambient (50 BPM, piano and soft synth). Each particle addition = faint crystalline chime. Voiceover at 0:00: "Release particles to wander randomly — each one that touches the cluster sticks forever, building a fractal tree." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: classic DLA — launch walkers from a circle of radius R_max + 10 (R_max = cluster radius). Walker does random walk (N,S,E,W) until it's adjacent to a cluster cell or escapes beyond 2×R_max (relaunch). Use a 2D boolean grid for cluster cells. Optimise: use kill radius (relaunch if walker wanders too far). For speed: 5–10 walkers simultaneously (but must wait for each to stick before the next matters). WebGL parallelism allows 1000 simultaneous walkers for fast growth. Runtime: real-time Canvas 2D (slow ~1000 particles) or WebGL (fast ~50,000 particles).
