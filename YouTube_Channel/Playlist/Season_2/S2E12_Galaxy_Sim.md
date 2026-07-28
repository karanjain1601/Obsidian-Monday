---
title: "10,000 Stars, One Force: How Galaxies Grow From Code"
season: 2
episode: 12
difficulty: 5/10
concept: "Gravitational softening for N-body singularity regularization"
prereq: "E11 (all-pairs N-body)"
tags: [galaxy-simulation, N-body-problem, star-cluster, gravitational-softening, javascript, WebGL, self-organization, emergent-structure, computational-astrophysics]
type: playlist-video
---

## S2·E12 — "10,000 Stars, One Force: How Galaxies Grow From Code"

- **Alt title:** "I Simulated 10,000 Stars and Got a Galaxy I Didn't Expect"
- **Difficulty:** 5/10 · **Prereq:** E11 (all-pairs N-body)
- **Hook:** 10,000 random stars with random velocities and a small initial spin. Over 2 minutes of simulated time, they collapse, merge, and self-organize into a rotating, arm-bearing galaxy-like structure. Nothing was programmed to make this happen.
- **The break (bug):** Without a gravitational softening parameter ε in the denominator (`F = Gm₁m₂/(r²+ε²)`), two stars at close approach produce an enormous force spike that launches them at escape velocity — shattering the forming galaxy. Every N-body galaxy code in history has this parameter. Setting it too small destroys the simulation; setting it too large prevents real gravitational binding. Finding the right ε is part of the physics.
- **Concept introduced:** Gravitational softening — a regularization technique to handle the 1/r² singularity at small separations. Physically, it approximates treating each particle as an extended mass (Plummer sphere) rather than a point mass. The softening length ε sets the scale below which two bodies interact smoothly rather than singularly.
- **Push it / wow moment:** Simulate two galaxy clusters merging (inspired by the Bullet Cluster). Watch tidal streams stretch between them, the cores pass through each other, and a merged elliptical galaxy settle out. The tidal arms were never programmed — they emerge from 10,000 pairwise gravitational pulls.
- **Demo:** Set initial spin rate and density profile (Plummer, uniform, exponential disk). Control softening ε live. Toggle a second cluster to trigger a merger.
- **Tags:** `galaxy-simulation` `N-body-problem` `star-cluster` `gravitational-softening` `javascript` `WebGL` `self-organization` `emergent-structure` `computational-astrophysics`
- **Thumbnail:** Two glowing spiral galaxy clusters spiraling together, tidal streams forming between them, against pure black.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
