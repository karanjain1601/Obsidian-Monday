---
title: "Rössler Attractor — Folding Chaos"
id: SM024
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chaos, rossler-attractor, dynamical-systems, strange-attractor]
---

> **What it is:** A ~45-second simulation short where a glowing orange trajectory spirals outward and folds back on itself to trace the Rössler attractor's ear-ring shape, revealing how a single stretch-and-fold mechanism generates deterministic chaos. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Rössler Attractor — Folding Chaos

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Dark 3D canvas. A bright orange point traces a nearly circular spiral. Then it stretches into an elongated coil — then folds back on itself like taffy. By 3 seconds the folding motion has created a flat, ribbon-like structure that spirals in a distinctive ear-ring shape.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Rössler equations shown: ẋ = -y-z, ẏ = x+ay, ż = b+z(x-c). Parameters: a=0.2, b=0.2, c=5.7. The trajectory shown in orange-to-red gradient. Annotations: "Stretching (spirals outward)" and "Folding (pulled back in)."

**0:10–0:18** — The folding mechanism isolated: a cross-section cut through the attractor shows a Poincaré section — the trajectory punctures this plane as a dense set of points arranged in a 1D curve. This is the "baker's map" mechanism. Caption: "Poincaré section — chaos as a 1D map."

**0:18–0:27** — c parameter slider from 4.0 to 6.0. At c=4: simple limit cycle (one loop). c=4.5: period-2. c=5.0: period-4. c=5.7: chaos. The period-doubling route to chaos in a strange attractor. Caption: "Period doubling → chaos."

**0:27–0:36** — Side-by-side: Lorenz attractor (butterfly shape, left) vs Rössler (earring / Möbius band, right). Both coloured similarly. Caption: "Two archetypes of chaos — different geometry, same sensitive dependence."

**0:36–0:45** — Time-lapse of 500 points evolving together: they densify the attractor, the ear-ring shape fills in. Fractal sub-structure revealed as zoom increases. Bold text: "Rössler attractor — stretch and fold." Fade to black.

## Physics Concept Teased
Rössler attractor: a 3D chaotic system with a simpler geometric mechanism than Lorenz — a continuous stretch-and-fold process (like kneading dough). Its Poincaré section is essentially a 1D map, making it analytically more tractable. It demonstrates chaos can arise from a single folding mechanism.

## On-Screen Text / Captions
- **0:00** — "Spiral out. Fold back. Repeat forever."
- **0:05** — "Rössler equations: a=0.2, b=0.2, c=5.7"
- **0:12** — "Poincaré section: chaos as a 1D map"
- **0:20** — "c = 4 (cycle) → 4.5 (period-2) → 5.7 (chaos)"
- **0:28** — "Lorenz (butterfly) vs Rössler (earring)"
- **0:35** — "Stretch and fold — kneading map geometry"
- **0:43** — "Rössler attractor."

## End Card
Final 3 seconds: Rössler attractor slowly rotating in 3D, orange-red palette. Text: "Otto Rössler, 1976 — designed to be simpler than Lorenz." CodedLaws logo.

## Audio
Electronic ambient with an oscillating tone that slowly rises and folds back (mirroring the stretch-fold dynamic, 75 BPM). Voiceover at 0:00: "Stretch a trajectory outward, fold it back — repeat forever. That's Rössler chaos." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: three.js. Key algorithm: RK4 integration of Rössler ODEs, dt=0.01. Render with 3D trail (vertex-coloured line geometry). Poincaré section: collect points where z = z_cross and dz/dt > 0, plot (x, y) as 2D scatter. Parameter sweep animation: precompute trajectories for each c value, interpolate visually. Gotcha: for c values near bifurcation points the transient is long — run 1000 time units before recording. Runtime: real-time three.js.
