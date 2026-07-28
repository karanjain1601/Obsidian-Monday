---
title: "I Coded Gravity and My Planet Crashed Into the Sun"
season: 1
episode: 6
difficulty: 3.5/10
concept: "Symplectic integrators and orbital energy conservation"
prereq: "E01 (Euler), E05 (why energy conservation matters)"
tags: [orbital-mechanics, euler-method, Verlet-integration, gravity-simulation, javascript, energy-conservation, symplectic-integrator, orbit-simulation]
type: playlist-video
---

## S1·E06 — "I Coded Gravity and My Planet Crashed Into the Sun" *(Flagship Thesis Video)*

- **Alt title:** "Why Every Beginner's Orbit Slowly Dies (Euler's Fatal Flaw)"
- **Difficulty:** 3.5/10 · **Prereq:** E01 (Euler), E05 (why energy conservation matters)
- **Hook:** A perfectly circular orbit that, over simulated months, slowly tightens into a spiral and smashes into the star. The code has no friction. No air resistance. No external forces. The planet is losing energy from nothing.
- **The break (bug):** Euler integration applied to orbital mechanics is *not energy-conserving*. Each Euler step slightly overshoots the true trajectory, injecting or removing a tiny amount of energy. Over many orbits these errors accumulate; the orbit either spirals inward (if energy is lost) or outward (if energy is gained), depending on the direction of the error. This is not a coding mistake — it is a fundamental property of non-symplectic integrators.
- **Concept introduced:** Numerical energy conservation. Symplectic integrators (leapfrog / Störmer-Verlet) operate differently: they advance position and velocity at *offset half-steps* so the errors cancel. While not perfectly energy-conserving, they conserve a *modified Hamiltonian* that stays bounded forever, giving orbits that never spiral. This is why all professional orbital mechanics codes use symplectic integrators.
- **Push it / wow moment:** Stable two-body orbit → add a third body (three-body problem) and watch deterministic chaos begin. Then swap to a mini solar system — Earth, Mars, Jupiter. The Verlet orbits are rock-stable; the Euler orbits slowly corrupt.
- **Demo:** Drag planet to set initial velocity; side-by-side Euler (red, decaying) vs Verlet (green, stable) orbits. Live energy plot — Euler drifts linearly downward; Verlet stays flat.
- **Tags:** `orbital-mechanics` `euler-method` `Verlet-integration` `gravity-simulation` `javascript` `energy-conservation` `symplectic-integrator` `orbit-simulation`
- **Thumbnail:** A glowing orbit spiraling into a star. Giant red "WHY?" overlaid. This is the thumbnail that defines the channel.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
