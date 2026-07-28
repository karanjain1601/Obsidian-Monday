---
title: "Fish Schooling — Polarisation Transition"
id: SM079
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fish-schooling, polarisation-transition, vicsek-model, collective-behaviour]
---

> **What it is:** A ~45-second simulation short where 500 silver fish transition sharply from disordered milling to a tight polarised school as a noise slider moves, demonstrating the first-order Vicsek phase transition in collective behaviour, the three distinct phases of milling, schooling, and swarming, and the radial flash expansion predator-evasion response. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Fish Schooling — Polarisation Transition

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A tank of 500 silver fish, each rendered with a metallic sheen. They mill in a disordered circle — each fish moving in a different direction. Then a slider moves and the fish suddenly align: all moving in the same direction in a tight, polarised school — like a switch was flipped.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The polarisation transition: controlled by noise level η and interaction radius r. Low η (low noise) → high polarisation (all fish aligned). High η (high noise) → low polarisation (random directions). The transition is discontinuous (first-order) in 2D for metric interactions. Caption: "Noise controls order: low η → polarised school."

**0:10–0:18** — Two phases: (1) Milling (rotating torus): fish mill in a circle with no net movement. (2) Schooling (polarised): all move in one direction. (3) Swarming: disordered, low density. The simulation shows each phase clearly. Caption: "Three phases: milling, schooling, swarming."

**0:18–0:27** — Flash expansion (predator response): a predator (shark) enters the simulation. Fish at the periphery flee — the school expands radially outward in a flash expansion, leaving a "vacuole" (empty space) around the predator. Caption: "Flash expansion: survival response — predator confusion."

**0:27–0:36** — Polarisation order parameter Φ = |⟨v_i/|v_i|⟩| plotted vs noise η. Shows a sharp (first-order) transition at η_c. For small schools (N<100) the transition is smooth; for large schools (N>1000) it's abrupt — finite-size scaling. Caption: "First-order phase transition: sharp at large N."

**0:36–0:45** — Real fish data: GOLDFISH school polarisation measured vs school size N. Polarisation increases with N — larger schools are better at aligning. "Safety in numbers: more fish → better collective sensing." Bold text: "Fish schooling — a living phase transition." Fade to black.

## Physics Concept Teased
Fish schooling polarisation transition: the fraction of aligned fish undergoes a sharp transition from disordered (milling/swarming) to ordered (polarised school) as noise decreases. This is a non-equilibrium phase transition (Vicsek-type) that is first-order in 2D, with a sharp transition only for large school sizes (finite-size effect).

## On-Screen Text / Captions
- **0:00** — "500 fish. No leader. Phase transition."
- **0:05** — "Low noise → polarised; high noise → disordered"
- **0:12** — "Three phases: milling, schooling, swarming"
- **0:20** — "Predator → flash expansion — vacuole"
- **0:28** — "Φ vs η: first-order transition at large N"
- **0:35** — "Larger school → better alignment"
- **0:43** — "Fish schooling — living phase transition."

## End Card
Final 3 seconds: a tight polarised school of 500 metallic fish, all moving in perfect alignment. Text: "Fish schools confuse predators — the probability of any one fish being caught drops with school size." CodedLaws logo.

## Audio
Fluid, underwater ambient (bubbling, whale-like tones). Sudden rush of water at the predator flash expansion. Voiceover at 0:00: "Fish don't have a leader — polarisation in a school is a phase transition, like water freezing." No other voiceover.

## Production Notes
Code complexity: moderate (same base as Boids). Renderer: Canvas 2D or WebGL. Key algorithm: Vicsek model. Each fish: position p, heading θ. Each step: find neighbours within radius r; compute mean angle ⟨θ⟩; new heading = ⟨θ⟩ + η·(random in [-π,π]); move at constant speed v₀. Phases: milling requires repulsion zone + attraction zone; Couzin 2002 model: repulsion (r < r_r), alignment (r_r < r < r_o), attraction (r_o < r < r_a). Flash expansion: each fish in the school adds a flee force from the predator proportional to 1/r². Polarisation Φ = |⟨e^{iθ}⟩|. Runtime: real-time Canvas 2D for N<1000.
