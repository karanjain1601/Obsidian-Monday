---
title: "I Simulated a Flag in the Wind and It Turned Into a Jellyfish"
season: 2
episode: 17
difficulty: 6/10
concept: "Position-Based Dynamics (PBD) for cloth simulation"
prereq: "E03 (springs) + E07 (integrators) + E14 (collision)"
tags: [cloth-simulation, mass-spring, soft-body, position-based-dynamics, javascript, WebGL, game-physics, tear-simulation, numerical-stiffness]
type: playlist-video
---

## S2·E17 — "I Simulated a Flag in the Wind and It Turned Into a Jellyfish"

- **Alt title:** "Cloth Simulation: Why Stiff Springs Are the Enemy of Stable Physics"
- **Difficulty:** 6/10 · **Prereq:** E03 (springs) + E07 (integrators) + E14 (collision)
- **Hook:** A cloth square that waves beautifully in the wind for 3 seconds — then collapses into a vibrating, tangled mess that eventually explodes off-screen.
- **The break (bug):** The cloth is represented as a mass-spring grid. High structural spring constants (needed for cloth that doesn't stretch like rubber) make the system *numerically stiff* — the natural frequency of the springs is so high that any integrator with a practical timestep will overshoot and go unstable. Reducing the spring constant fixes the explosion but makes the cloth stretchy. The real fix: position-based dynamics (PBD), where instead of applying forces you directly project positions to satisfy length constraints.
- **Concept introduced:** Mass-spring cloth, numerical stiffness, and Verlet-based Position-Based Dynamics (PBD). PBD replaces spring forces with direct positional corrections: after each integration step, move particles to satisfy `|p_i - p_j| = rest_length`. This decouples stiffness from timestep and is far more stable. It is the method used in Unreal Engine, Unity, and every AAA game's cloth system.
- **Push it / wow moment:** A 3D flag waving in wind with realistic crease folds and billowing. Tear-able cloth — click to make a hole; it propagates with a satisfying rip. Drop a cloth onto a sphere and watch it drape realistically.
- **Demo:** Toggle wind direction and strength. Stiffness slider. Click to tear cloth. Pin/unpin any corner. Toggle PBD vs. spring force to see the stability difference.
- **Tags:** `cloth-simulation` `mass-spring` `soft-body` `position-based-dynamics` `javascript` `WebGL` `game-physics` `tear-simulation` `numerical-stiffness`
- **Thumbnail:** A beautiful cloth flag mid-tear, a jagged hole appearing through the fabric, trailing threads visible.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
