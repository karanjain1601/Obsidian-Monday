---
title: "My Bouncing Ball Gains Energy. That's Very Bad Physics."
season: 1
episode: 2
difficulty: 1.5/10
concept: "Coefficient of restitution"
prereq: "E01 (Euler + dt)"
tags: [bouncing-ball, coefficient-of-restitution, elastic-collision, inelastic-collision, javascript, canvas, energy-conservation, physics-code]
type: playlist-video
---

## S1·E02 — "My Bouncing Ball Gains Energy. That's Very Bad Physics."

- **Alt title:** "Why Your Ball Bounces Higher Every Time (And the Three-Character Fix)"
- **Difficulty:** 1.5/10 · **Prereq:** E01 (Euler + dt)
- **Hook:** A ball dropped from 100 px that bounces higher every frame. By second 5, it has escaped the screen. The code has no energy source — so where is the energy coming from?
- **The break (bug):** Applying the restitution coefficient to the speed magnitude but forgetting to negate `vy` means the ball bounces upward with the same speed it arrived — then the *next* Euler step adds another gravity impulse on top. The ball enters the floor with speed v, exits with speed e*v (smaller), but the direction flip is missing, so the floor effectively pushes it *faster* each frame. The fix is `vy = -e * vy`.
- **Concept introduced:** Coefficient of restitution `e` — the ratio of post-collision to pre-collision relative speed. `e=1` is perfectly elastic (energy conserved), `e=0` is perfectly inelastic (dead clay). Every real bounce is between 0 and 1. The code must negate the velocity component *perpendicular* to the surface, not just scale its magnitude.
- **Push it / wow moment:** Stack 5 balls with halving masses on top of each other (a "Superball tower"). Drop them together. The top ball launches at ~9× the drop height — an exact physics result derivable in 10 lines. The crowd goes wild every time.
- **Demo:** A ball you can drag to any height and angle. Restitution slider from 0 (thuds and stops) to 1 (bounces forever). Live kinetic energy chart. The 5-ball tower as a bonus scene. Toggle "broken" vs "fixed" code.
- **Tags:** `bouncing-ball` `coefficient-of-restitution` `elastic-collision` `inelastic-collision` `javascript` `canvas` `energy-conservation` `physics-code`
- **Thumbnail:** An energy bar graph showing the bar going UP with each bounce — bright red arrow pointing upward. "THAT'S WRONG" stamped in large text over it.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
