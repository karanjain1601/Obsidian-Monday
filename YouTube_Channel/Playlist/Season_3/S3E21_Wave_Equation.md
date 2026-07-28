---
title: "I Made Ripples on a Virtual Drum. My First Attempt Was Pure Glitch."
season: 3
episode: 21
difficulty: 5/10
concept: "CFL stability condition and the 2D wave equation on a grid"
prereq: "E10 (wave/mode concepts) + E07 (integrators)"
tags: [wave-equation, finite-differences, CFL-condition, WebGL, javascript, 2D-wave-simulation, interference, drum-simulation, PDE]
type: playlist-video
---

## S3·E21 — "I Made Ripples on a Virtual Drum. My First Attempt Was Pure Glitch."

- **Alt title:** "The Wave Equation: Why Your First Grid Simulation Explodes Into Checkerboard Noise"
- **Difficulty:** 5/10 · **Prereq:** E10 (wave/mode concepts) + E07 (integrators)
- **Hook:** A tap on a 2D membrane sends circular ripples out, reflects at the edges, and creates beautiful interference patterns. Then increase the wave speed by 50% — the entire grid explodes into high-frequency checkerboard noise. The physics is correct. The numerics are not.
- **The break (bug):** Violating the Courant-Friedrichs-Lewy (CFL) condition: `c · dt / dx ≤ 1`. When wave speed c is too fast relative to grid spacing dx and timestep dt, information propagates faster than the grid can carry it. The explicit finite-difference update `u(t+dt) = 2u(t) - u(t-dt) + c²dt²/dx² * ∇²u` becomes unconditionally unstable.
- **Concept introduced:** The 2D wave equation `∂²u/∂t² = c²∇²u`, finite differences on a grid (replacing continuous derivatives with discrete differences on a regular mesh), and the CFL stability condition as a universal speed-limit law for explicit grid simulations.
- **Push it / wow moment:** Rendered as a 3D WebGL height field with dynamic lighting — ripples become visually spectacular. Add damping to simulate a realistic drum membrane. Find the eigenfrequencies of the rectangular membrane and play a "melody" by tapping at specific points that excite individual modes.
- **Demo:** Click anywhere to create ripples. Multiple simultaneous sources create live interference patterns. Wave speed slider that lets you hit and violate the CFL condition. Damping slider.
- **Tags:** `wave-equation` `finite-differences` `CFL-condition` `WebGL` `javascript` `2D-wave-simulation` `interference` `drum-simulation` `PDE`
- **Thumbnail:** Beautiful circular ripples interfering on a glowing 3D grid — one half perfect, one half checkerboard noise from CFL violation. "CFL VIOLATION" label.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
