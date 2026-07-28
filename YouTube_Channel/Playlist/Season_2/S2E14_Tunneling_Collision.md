---
title: "Why My Physics Engine Lets Fast Balls Phase Through Walls"
season: 2
episode: 14
difficulty: 5.5/10
concept: "Continuous collision detection (CCD) and tunneling"
prereq: "E02 (bouncing ball — collision response basics)"
tags: [collision-detection, tunneling, continuous-collision, AABB, GJK, javascript, physics-engine, broad-phase, narrow-phase, game-physics]
type: playlist-video
---

## S2·E14 — "Why My Physics Engine Lets Fast Balls Phase Through Walls"

- **Alt title:** "Tunneling Isn't Just Quantum: How Speed Breaks Collision Detection"
- **Difficulty:** 5.5/10 · **Prereq:** E02 (bouncing ball — collision response basics)
- **Hook:** A small, fast ball fired at a wall. It passes straight through. Slow the same ball down and it bounces perfectly. Same wall, same code. The collision detection works — but only for slow objects.
- **The break (bug):** Discrete collision detection checks whether two shapes *overlap* at each timestep. A fast ball moves more than its own diameter in a single timestep — it teleports from one side of the wall to the other between checks, and overlap is never detected. This is called "tunneling" and it is a fundamental limitation of discrete detection.
- **Concept introduced:** Broad-phase vs. narrow-phase collision detection, and continuous collision detection (CCD). CCD "sweeps" shapes along their velocity vectors and checks for intersection of the swept volume, catching tunneling. The broad phase (AABB grid or bounding volume hierarchy) quickly culls distant pairs; the narrow phase checks exact geometry. Without CCD, any game's fast-moving objects tunnel through walls.
- **Push it / wow moment:** A 500-ball billiard simulation with zero tunneling at any ball speed. Every ball can be fired as fast as desired. Toggle broad phase off to watch FPS crater as every pair is checked. Toggle CCD off and fire a ball at supersonic speed to watch it clip through the table.
- **Demo:** Click to fire a ball at a wall with adjustable speed. See exactly at which speed tunneling begins (threshold = diameter / dt). Toggle CCD on/off. The 500-ball billiard table as the showcase.
- **Tags:** `collision-detection` `tunneling` `continuous-collision` `AABB` `GJK` `javascript` `physics-engine` `broad-phase` `narrow-phase` `game-physics`
- **Thumbnail:** A ball mid-phase-through a concrete wall, clearly inside the solid material. "HOW?" in enormous text.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
