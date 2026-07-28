---
title: "I Coded a Cannon and Shot My Ball Into Infinity"
season: 1
episode: 1
difficulty: 1/10
concept: "Euler's method and the critical role of dt"
prereq: "None"
tags: [projectile-motion, euler-method, timestep, physics-simulation, javascript, canvas, game-physics, beginner]
type: playlist-video
---

## S1·E01 — "I Coded a Cannon and Shot My Ball Into Infinity"

- **Alt title:** "The One Line of Code That Breaks Every Physics Beginner's First Simulation"
- **Difficulty:** 1/10 · **Prereq:** None
- **Hook:** A beautiful cannonball arc drawn at 30 FPS. Drop to 10 FPS with no other change — the ball overshoots by 3× the distance and flies off-screen.
- **The break (bug):** Writing `x += velocity` without multiplying by `dt` makes the simulation frame-rate dependent. At lower FPS, each update applies a giant velocity impulse and the ball accelerates toward infinity. The "fix" is a single multiplication: `x += velocity * dt`.
- **Concept introduced:** Euler's method — the simplest forward-integration scheme — and the critical role of `dt` (elapsed time per frame). Every physics update must be scaled by elapsed time, otherwise the simulation is not measuring real-world seconds.
- **Push it / wow moment:** Build a real-time ballistic trajectory predictor that computes and draws the full arc *before* firing. It is perfectly accurate — you can see the landing point before release. Then toggle the `dt` bug back on and watch the prediction shatter.
- **Demo (what viewer plays with):** Sliders for launch angle (0–90°) and muzzle velocity. A toggle labeled "correct dt / broken dt" that makes the ball instantly fly to infinity. Live FPS throttle slider so viewers feel the bug themselves. A second cannon for head-to-head comparison.
- **Tags:** `projectile-motion` `euler-method` `timestep` `physics-simulation` `javascript` `canvas` `game-physics` `beginner`
- **Thumbnail:** A cannon on the left. Two arcs diverge from the barrel — one curves perfectly to a target, the other shoots horizontally off the right edge of the frame. Caption: "SAME CODE. DIFFERENT FPS."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
