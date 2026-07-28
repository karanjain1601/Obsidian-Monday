---
title: "Why Heat Spreads in Code Exactly Like Ink in Water"
season: 3
episode: 22
difficulty: 5.5/10
concept: "Diffusion stability condition and Crank-Nicolson implicit scheme"
prereq: "E21 (finite difference grids + CFL concept)"
tags: [heat-equation, diffusion, finite-differences, Crank-Nicolson, implicit-methods, javascript, thermal-simulation, PDE, Fouriers-law]
type: playlist-video
---

## S3·E22 — "Why Heat Spreads in Code Exactly Like Ink in Water"

- **Alt title:** "The Heat Equation: The Simplest PDE That Still Wants to Ruin Your Timestep"
- **Difficulty:** 5.5/10 · **Prereq:** E21 (finite difference grids + CFL concept)
- **Hook:** A hot spot spreading perfectly across a cold plate — until you double the simulation speed and it explodes into alternating hot/cold pixels. The artifact has a specific name, a specific cause, and a specific cure.
- **The break (bug):** The explicit heat equation requires `dt ≤ dx²/(2α)` — the *diffusion stability condition*, which scales as dx² rather than dx (much more restrictive than CFL). Double the timestep past this threshold and the solution oscillates between neighboring cells, creating the checkerboard artifact. The cure: Crank-Nicolson implicit scheme, which is unconditionally stable for any timestep.
- **Concept introduced:** Heat equation `∂u/∂t = α∇²u`, Fourier's law of heat conduction, the diffusion stability condition (stricter than wave CFL because diffusion has no wave speed), and the key insight that *implicit* integration (solving a linear system at each step) trades compute cost for unconditional stability.
- **Push it / wow moment:** Multiple materials with different thermal conductivities drawn by the user. Realistic thermal camera colormap (purple-blue-green-yellow-red). CPU heat sink geometry showing heat flowing through fins. Thermal equilibrium found automatically.
- **Demo:** Draw heat sources (click and drag). Paint material regions with different conductivity values. Toggle explicit (fast, unstable) vs Crank-Nicolson (slightly slower, always stable). Watch thermal equilibration in real time.
- **Tags:** `heat-equation` `diffusion` `finite-differences` `Crank-Nicolson` `implicit-methods` `javascript` `thermal-simulation` `PDE` `Fouriers-law`
- **Thumbnail:** Thermal camera colormap — left half showing correct heat spreading; right half showing checkerboard explosion. "dt TOO LARGE" label.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
