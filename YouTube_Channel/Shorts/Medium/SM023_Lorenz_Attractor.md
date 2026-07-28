---
title: "Lorenz Attractor — Butterfly"
id: SM023
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chaos, lorenz-attractor, dynamical-systems, butterfly-effect]
---

> **What it is:** A ~45-second simulation short where a glowing point traces the iconic butterfly-shaped Lorenz attractor in 3D, demonstrating how two nearly identical starting conditions diverge exponentially — the butterfly effect of deterministic chaos. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Lorenz Attractor — Butterfly

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black 3D space. A single bright cyan dot begins tracing a path. In 3 seconds it spirals outward from one wing of a butterfly shape, crosses to the other wing, and by 3 seconds a ghostly double-lobed butterfly outline of glowing cyan is forming on screen — never repeating, never settling.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Lorenz equations shown: ẋ = σ(y-x), ẏ = x(ρ-z)-y, ż = xy-βz. Parameters: σ=10, ρ=28, β=8/3. The trajectory traced with a colour gradient: early = purple, late = white. The butterfly attractor takes shape.

**0:10–0:18** — Two trajectories started at nearly identical initial conditions (separation: 10^-10). Shown in cyan and red. Both trace the butterfly for several orbits identically. Then — at ~12 seconds — they diverge: cyan goes left lobe, red goes right lobe. Caption: "Butterfly effect — initial condition sensitivity."

**0:18–0:27** — Separation |Δr(t)| plotted on a log-log scale below the attractor: grows exponentially at rate λ ≈ 0.9 (the maximal Lyapunov exponent). Annotation: "Lyapunov exponent λ = 0.906." The two trajectories are now on completely different lobes.

**0:27–0:36** — Camera slowly rotates around the attractor in 3D (three.js). The fractal structure becomes apparent: sheets, but they never cross. Annotation: "Fractal dimension D ≈ 2.06."

**0:36–0:45** — Time-lapse: 1000 particles from slightly different ICs, all started at origin. They smear out over the entire butterfly attractor within 50 time units. The density of the attractor visualised as a heat-map. Bold text: "Deterministic chaos." Fade to black.

## Physics Concept Teased
Lorenz attractor: deterministic chaos in three coupled ODEs modelling convection. The attractor is a strange attractor — fractal structure, sensitive to initial conditions (positive Lyapunov exponent). It demonstrates that deterministic systems can be unpredictable.

## On-Screen Text / Captions
- **0:00** — "Three equations. Deterministic chaos."
- **0:05** — "σ=10, ρ=28, β=8/3"
- **0:12** — "Two starts, 10^(-10) apart — they diverge"
- **0:20** — "Lyapunov exponent λ = 0.906"
- **0:28** — "Fractal dimension D ≈ 2.06"
- **0:35** — "1000 particles → fill the attractor"
- **0:43** — "Deterministic chaos — the butterfly effect."

## End Card
Final 3 seconds: slowly rotating Lorenz butterfly in 3D, deep purple glow. Text: "Edward Lorenz, 1963 — discovered chaos by accident." CodedLaws logo.

## Audio
Deep, atmospheric electronic (60 BPM, minor key). Subtle wind sound throughout. Voiceover at 0:00: "Three simple equations. No randomness. Yet the future is unknowable." Sharp diverging sound effect when the two trajectories split (~0:14).

## Production Notes
Code complexity: moderate. Renderer: three.js (WebGL) for 3D rotation. Key algorithm: RK4 integration of Lorenz ODEs, dt = 0.01. Accumulate trajectory as a list of 3D points, render as a line with colour gradient (three.js Line with vertex colours). Lyapunov exponent: integrate two nearby trajectories, renormalise separation periodically, average log(|Δr|)/dt. Fractal dimension: box-counting on 2D projection. Gotcha: line rendering in WebGL — use a custom shader or THREE.Line with opacity blending for the glowing trail effect. Runtime: real-time three.js at 60 fps.
