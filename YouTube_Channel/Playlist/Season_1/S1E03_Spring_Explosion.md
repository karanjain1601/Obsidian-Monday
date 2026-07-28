---
title: "Why My Spring Exploded (Hooke's Law vs. Your Timestep)"
season: 1
episode: 3
difficulty: 2/10
concept: "Symplectic Euler integration"
prereq: "E01 (Euler + dt)"
tags: [spring-simulation, simple-harmonic-motion, hookes-law, symplectic-euler, javascript, energy-conservation, oscillation, numerical-stability]
type: playlist-video
---

## S1·E03 — "Why My Spring Exploded (Hooke's Law vs. Your Timestep)"

- **Alt title:** "Simple Harmonic Motion Is Not Simple to Code — Here's Why"
- **Difficulty:** 2/10 · **Prereq:** E01 (Euler + dt)
- **Hook:** A spring-mass system that oscillates beautifully for 3 cycles... then the amplitude grows every cycle until the mass flies off screen. No energy was added. The code is correct Hooke's law. So what is happening?
- **The break (bug):** Standard Euler integration of SHM is *unconditionally unstable* — it injects a tiny amount of energy every single timestep because it updates `x` using the *old* velocity and updates `v` using the *old* position. These quantities are coupled; using stale values causes both to overshoot their true values simultaneously, compounding each step. The amplitude grows as `(1 + ω²dt²/2)^n` — slowly at first, then exponentially.
- **Concept introduced:** Symplectic Euler (also called semi-implicit Euler): update velocity *first* using the old position, *then* update position using the *new* velocity. This costs zero extra work but preserves the energy surface of the system. It is the correct integrator for oscillatory systems and is used in most game engines.
- **Push it / wow moment:** Build a 2D spring network — a 6×6 grid of masses connected by springs forming a jiggly square lattice. With standard Euler it explodes immediately. With symplectic Euler it bounces and deforms indefinitely without blowing up. Looks like jello physics.
- **Demo:** Drag the mass to any displacement and release. Live energy plot. A big "EULER" vs "SYMPLECTIC EULER" toggle button that makes the explosion happen or not. The jello square as the finale.
- **Tags:** `spring-simulation` `simple-harmonic-motion` `hookes-law` `symplectic-euler` `javascript` `energy-conservation` `oscillation` `numerical-stability`
- **Thumbnail:** Split screen — left panel shows a spring with oscillation amplitude growing each frame (red arrows getting bigger); right panel shows perfectly constant amplitude. Single label: "ONE CHANGE."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
