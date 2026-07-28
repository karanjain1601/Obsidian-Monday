---
title: "I Coded Fireworks Physics. My First Attempt Was Confetti."
season: 2
episode: 16
difficulty: 4/10
concept: "Particle systems with typed arrays and additive blending"
prereq: "E01 (particle updates) + E09 (drag forces)"
tags: [particle-system, fireworks-simulation, javascript, canvas, particle-effects, additive-blending, typed-arrays, game-dev]
type: playlist-video
---

## S2·E16 — "I Coded Fireworks Physics. My First Attempt Was Confetti."

- **Alt title:** "Why Real Fireworks Are Surprisingly Hard to Simulate"
- **Difficulty:** 4/10 · **Prereq:** E01 (particle updates) + E09 (drag forces)
- **Hook:** A burst of particles that looks like flat, symmetric confetti. One drag coefficient change and one blending mode change later — it looks exactly like a real firework.
- **The break (bug):** Without quadratic drag, firework "star" trails follow symmetric parabolas — they travel just as far downward as upward after the burst. Real fireworks droop dramatically because drag dominates at the high initial velocity, killing horizontal momentum quickly. Also: without additive alpha blending (which makes overlapping particles brighter), the trails look flat instead of glowing.
- **Concept introduced:** Particle systems: emitter objects that spawn particles with randomized initial conditions, per-particle lifetime counters, velocity inheritance, color-over-lifetime gradients, and additive vs. normal canvas blending. The key data structure is a flat typed array (not an array of objects) for GPU-cache-friendly iteration.
- **Push it / wow moment:** 50,000 simultaneous particles. Multicolor cascading bursts (chrysanthemum, peony, willow), glitter effects (slow-falling bright particles), crackle (many tiny short-lived particles). All running at 60 FPS using a single flat Float32Array and canvas2D with careful culling.
- **Demo:** Click to fire a burst at the clicked location. Burst type selector (sphere, star, comet, ring). Color gradient picker. Particle count slider with live FPS display. Export as a GIF or video.
- **Tags:** `particle-system` `fireworks-simulation` `javascript` `canvas` `particle-effects` `additive-blending` `typed-arrays` `game-dev`
- **Thumbnail:** A gorgeous multi-color firework burst against a night sky. "50,000 PARTICLES" counter overlaid in the corner.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
