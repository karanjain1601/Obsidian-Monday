---
title: "How to Simulate Smoke in Real Time (The Paper That Changed Game Dev)"
season: 3
episode: 23
difficulty: 7/10
concept: "Stam's stable fluids and the incompressible fluid simulation pipeline"
prereq: "E21, E22 (finite difference grids + PDE methods)"
tags: [stable-fluids, Stam, Navier-Stokes, javascript, real-time-fluid-simulation, smoke-simulation, vorticity-confinement, game-physics, incompressible-flow]
type: playlist-video
---

## S3·E23 — "How to Simulate Smoke in Real Time (The Paper That Changed Game Dev)"

- **Alt title:** "Stam's Stable Fluids: The Brilliant Cheat That Runs at 60 FPS"
- **Difficulty:** 7/10 · **Prereq:** E21, E22 (finite difference grids + PDE methods)
- **Hook:** Incompressible smoke that curls, twists, never explodes, and runs at 60 FPS in a browser. The "correct" explicit Navier-Stokes would blow up in milliseconds. What is this, and is it cheating?
- **The break (bug):** Explicit Navier-Stokes advection is unstable for any practical timestep. Stam's method (Jos Stam, SIGGRAPH 1999) is unconditionally stable because its semi-Lagrangian back-trace step implicitly dissipates kinetic energy. The stability comes at a physical cost: artificial viscosity smooths out fine-scale vortices. This is a deliberate trade of physical accuracy for numerical stability — and understanding this trade-off is the lesson.
- **Concept introduced:** Incompressible fluid simulation pipeline: (1) Add forces to velocity field. (2) Advect velocity field using semi-Lagrangian (trace particle backward along velocity, interpolate). (3) Project velocity field to be divergence-free (enforce incompressibility) via Helmholtz decomposition + Poisson pressure solve. Each step is physically motivated.
- **Push it / wow moment:** Inject multiple colored dye streams. Add vorticity confinement (an additional force that re-sharpens the vortices that semi-Lagrangian smooths out). The result looks like high-resolution CFD on consumer hardware — swirling, tendriling smoke plumes that feel physically real.
- **Demo:** Draw velocity sources with the mouse. Toggle vorticity confinement on/off (see the detail loss and recovery). Inject colored dye streams. FPS counter always visible. Resolution slider.
- **Tags:** `stable-fluids` `Stam` `Navier-Stokes` `javascript` `real-time-fluid-simulation` `smoke-simulation` `vorticity-confinement` `game-physics` `incompressible-flow`
- **Thumbnail:** Gorgeous swirling blue-orange colored smoke on pure black. "60 FPS. STABLE. FROM SCRATCH."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
