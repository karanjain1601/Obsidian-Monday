---
title: "I Simulated Water With 10,000 Particles. It Leaked Out of Its Container."
season: 3
episode: 25
difficulty: 7/10
concept: "Smoothed Particle Hydrodynamics (SPH)"
prereq: "E13 (spatial hashing for neighbor search) + E23 (fluid concepts)"
tags: [SPH, smoothed-particle-hydrodynamics, water-simulation, dam-break, javascript, particle-fluid, WebGL, Lagrangian-fluid]
type: playlist-video
---

## S3·E25 — "I Simulated Water With 10,000 Particles. It Leaked Out of Its Container."

- **Alt title:** "Smoothed Particle Hydrodynamics: The Particle-Based Way to Be a Fluid"
- **Difficulty:** 7/10 · **Prereq:** E13 (spatial hashing for neighbor search) + E23 (fluid concepts)
- **Hook:** A dam-break simulation — a wall of water rushing forward, splashing with beautiful surface detail — that slowly leaks particles through the container floor until the simulation is empty.
- **The break (bug):** SPH particles near the boundary walls have fewer neighbors than bulk particles. Fewer neighbors → underestimated density from the kernel sum → underestimated pressure → net outward force pushing particles through walls. Fix: "mirror" ghost particles reflected across each boundary face, giving boundary particles a full neighborhood that prevents escape.
- **Concept introduced:** Smoothed Particle Hydrodynamics (SPH). Each particle carries mass, velocity, and density. Density is estimated from neighbors within radius h using a kernel function W(r, h) that weights nearby particles more. Pressure is computed from density via the Tait equation of state. Forces come from the pressure gradient and viscosity terms in the Navier-Stokes equation, both approximated via weighted neighbor sums.
- **Push it / wow moment:** Water sloshing in a tilting container (gyroscope-style rotation). Floating rigid body coupling — a boat bobbing on SPH water. 3D SPH with marching-cubes surface extraction for specular water rendering.
- **Demo:** Break the dam. Tilt the container with a slider. Add floating rigid objects. Adjust particle count vs. quality. Toggle ghost particles off to reproduce the leak.
- **Tags:** `SPH` `smoothed-particle-hydrodynamics` `water-simulation` `dam-break` `javascript` `particle-fluid` `WebGL` `Lagrangian-fluid`
- **Thumbnail:** Dramatic dam-break wave crashing against a wall, water spray visible against black. "10,000 PARTICLES. NO MESH."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
