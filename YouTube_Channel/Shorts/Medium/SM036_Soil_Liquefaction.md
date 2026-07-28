---
title: "Soil Liquefaction — Earthquake Sand Becoming Liquid"
id: SM036
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, granular-media, liquefaction, earthquake, geotechnics]
---

> **What it is:** A ~45-second simulation short shaking a cross-section of saturated sand during an earthquake until rising pore pressure eliminates effective stress, turning solid ground into a fluid that swallows a building and floats buried pipes. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Soil Liquefaction — Earthquake Sand Becoming Liquid

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Side-view cross-section: a grid of dark sand particles packed under a building. At 2 seconds, seismic waves start shaking the ground — a sinusoidal vibration visible at the base. Almost immediately the sand begins to churn, the building sinks, and what was solid ground becomes a swirling slurry.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Mechanism explained: sand grains (grey circles) sit in contact under pressure. Pore water (blue) fills the gaps. During shaking, pore pressure u increases. When u equals the overburden stress σ: effective stress σ' = σ - u = 0. Sand grains lose contact — friction vanishes. Caption: "σ' = σ - u → 0: sand floats."

**0:10–0:18** — The DEM (discrete element method) simulation: 2,000 disc particles with Hertz contact + Coulomb friction. Seismic forcing applied at the base boundary. Pore pressure tracked via the fluid phase. Effective stress colour-map: blue = high effective stress (solid), red = near-zero (liquefied). The liquefied zone expands upward.

**0:18–0:27** — A structure on the surface: a heavy block (representing a building) sinks into the liquefied sand, tilting. Simultaneously, a lighter buried pipe floats upward (lower buoyancy force exceeds gravity). Caption: "Heavy sinks. Light floats — buoyancy in liquid sand."

**0:27–0:36** — After shaking stops: sand re-consolidates. Grains settle from suspension, pore pressure dissipates. The building is now 2 metres lower — permanent settlement. Annotation: "Permanent settlement — the building never rises."

**0:36–0:45** — Real-world footage reference: brief mention of 1964 Niigata earthquake liquefaction with apartment buildings tilted at 45°. Simulation shows the same tilt. Bold text: "Liquefaction destroyed whole cities." Fade to black.

## Physics Concept Teased
Soil liquefaction: saturated loose sand loses shear strength when seismic shaking raises pore water pressure to equal the overburden stress. Effective stress σ' = σ - u → 0, so grain-to-grain friction vanishes and the soil behaves as a dense fluid. Heavy structures sink, lighter buried objects rise.

## On-Screen Text / Captions
- **0:00** — "Solid ground — until the earthquake."
- **0:05** — "Pore pressure u → overburden σ: effective stress = 0"
- **0:12** — "Sand loses friction — behaves like liquid"
- **0:20** — "Heavy sinks. Light floats. Buoyancy."
- **0:28** — "Shaking stops → re-consolidation"
- **0:35** — "Permanent settlement — irreversible damage"
- **0:43** — "Liquefaction destroyed cities in 1964."

## End Card
Final 3 seconds: tilted building in liquefied sand. Text: "Niigata (1964), Mexico City (1985), Christchurch (2011) — all liquefaction." CodedLaws logo.

## Audio
Low rumbling earthquake sound at 0:02 (building for 5 seconds). Gurgling water-like sound as sand liquefies. Ominous drone throughout. Voiceover at 0:00: "During an earthquake, solid sand can turn to liquid in seconds — and swallow buildings whole." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D or WebGL. Key algorithm: 2D DEM (discrete element method) with circular grains. Hertzian contact: F_n = k_n δ^(3/2) (normal), Coulomb friction F_t ≤ μ F_n (tangential). Pore pressure coupled via a diffusion equation. Seismic forcing: sinusoidal base acceleration. Effective stress: overburden computed from grain weight above each level; pore pressure from fluid solver. ~2000 grains feasible in real-time Canvas 2D. Gotcha: contact detection is O(N²) without spatial hashing — use a cell-list (grid-based) for O(N). Runtime: real-time Canvas 2D or WebGL.
