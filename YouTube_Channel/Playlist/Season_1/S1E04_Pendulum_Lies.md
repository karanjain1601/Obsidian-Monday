---
title: "My Pendulum Lies to Me at Large Angles (And So Did My Textbook)"
season: 1
episode: 4
difficulty: 2.5/10
concept: "Nonlinear pendulum and small-angle approximation"
prereq: "E03 (SHM + symplectic Euler)"
tags: [pendulum-simulation, nonlinear-pendulum, small-angle-approximation, javascript, SHM, period-of-pendulum, physics-visualization, taylor-series]
type: playlist-video
---

## S1·E04 — "My Pendulum Lies to Me at Large Angles (And So Did My Textbook)"

- **Alt title:** "sin(θ) ≠ θ: The Physics Approximation Hidden in Every Intro Course"
- **Difficulty:** 2.5/10 · **Prereq:** E03 (SHM + symplectic Euler)
- **Hook:** Two pendulums — one coded with the exact nonlinear equation, one with the standard textbook small-angle formula — swinging together from 5°. They match perfectly. Release them from 60°. They diverge more with every swing until they are completely out of phase.
- **The break (bug):** The textbook equation `θ'' = -(g/L)·θ` uses the linear approximation `sin(θ) ≈ θ`, valid only below ~15°. At 60°, `sin(60°) ≈ 0.866` while `60° in radians ≈ 1.047` — a 21% error per cycle that accumulates. The period of the exact pendulum is *longer* than the approximate one at large angles, so they slowly drift apart.
- **Concept introduced:** The exact nonlinear pendulum equation `θ'' = -(g/L)·sin(θ)` and the domain of validity of linearization. When you drop `sin`, you are assuming the restoring force is proportional to angle — this is only true for small displacements. The nonlinear term makes the period angle-dependent, which the linear approximation cannot capture.
- **Push it / wow moment:** Overlay 20 pendulums released from 5° increments (5°, 10°, ..., 100°). Watch them fan out into a beautiful diverging spread. The ones released from small angles cluster together tightly; the large-angle ones lag behind by seconds. This makes the angle-dependent period *viscerally visible*.
- **Demo:** Drag pendulum to any angle. Exact (blue) vs approximate (red) traces overlaid live. A period timer measuring both in real time. Zoom into the divergence when they're 180° out of phase.
- **Tags:** `pendulum-simulation` `nonlinear-pendulum` `small-angle-approximation` `javascript` `SHM` `period-of-pendulum` `physics-visualization` `taylor-series`
- **Thumbnail:** Two pendulums — one exact, one approximate — clearly pointing in opposite directions after several swings. Caption: "WHICH IS RIGHT?"

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
