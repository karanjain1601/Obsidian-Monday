---
title: "I Built the Solar System in JavaScript. It Was Already Wrong."
season: 2
episode: 11
difficulty: 4/10
concept: "Multi-timescale dynamics and adaptive timesteps in N-body systems"
prereq: "E06 (two-body orbit + Verlet)"
tags: [N-body-simulation, solar-system, planetary-orbits, javascript, Verlet-integration, orbital-mechanics, adaptive-timestep, NASA-ephemeris]
type: playlist-video
---

## S2·E11 — "I Built the Solar System in JavaScript. It Was Already Wrong."

- **Alt title:** "The Solar System Has 8 Planets and 8 Integration Errors"
- **Difficulty:** 4/10 · **Prereq:** E06 (two-body orbit + Verlet)
- **Hook:** A solar system that looks perfect for months of simulated time — until Jupiter's orbit slowly drifts outward, and eventually one of the inner planets gets gravitationally ejected. The code uses Verlet integration and correct gravitational constants.
- **The break (bug):** A single global timestep is correct for outer planets (slow, wide orbits) but far too coarse for inner planets (fast, tight orbits — Mercury completes an orbit every 88 days). Mercury's orbit accumulates integration error ~40× faster than Neptune's. This error slowly contaminates the entire system. The fix is per-body adaptive timesteps, or a hierarchical integrator.
- **Concept introduced:** Multi-timescale dynamics in N-body systems. When bodies orbit at vastly different speeds, a single global timestep forces you to choose between wasting computation on slow bodies or accumulating errors on fast ones. Professional solar system codes (e.g., REBOUND) use individual adaptive timesteps for each body.
- **Push it / wow moment:** Load real planetary data from NASA Horizons (actual masses, positions, velocities). Simulate 100 years of solar system evolution. Check the final positions against the known ephemeris. With naive global timestep, the error grows visible. With per-body timesteps, the simulation matches NASA's data.
- **Demo:** Click to add custom planets with adjustable mass and orbital radius. Real-time orbital period display. Toggle each planet's gravitational influence. Fast-forward 10 simulated years in 5 seconds.
- **Tags:** `N-body-simulation` `solar-system` `planetary-orbits` `javascript` `Verlet-integration` `orbital-mechanics` `adaptive-timestep` `NASA-ephemeris`
- **Thumbnail:** A beautiful solar system with glowing trail orbits — one orbit clearly spiraling away from its lane. "IT'S WRONG" in red.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
