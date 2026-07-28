---
title: "My Chain Phased Through the Floor (And Taught Me About Constraints)"
season: 2
episode: 18
difficulty: 6/10
concept: "Extended Position-Based Dynamics (XPBD)"
prereq: "E17 (cloth + PBD concept)"
tags: [rope-simulation, chain-physics, Verlet-constraints, XPBD, javascript, position-based-dynamics, inextensibility, game-physics]
type: playlist-video
---

## S2·E18 — "My Chain Phased Through the Floor (And Taught Me About Constraints)"

- **Alt title:** "The Physics of Rope: Why Strings Are Surprisingly Hard to Get Right"
- **Difficulty:** 6/10 · **Prereq:** E17 (cloth + PBD concept)
- **Hook:** A chain dropped onto the floor that clips through it, coils wrong, and then springs into the air — three separate physics violations in five seconds.
- **The break (bug):** Modeling rope as a series of spring-connected point masses fails because: (1) springs need a very high stiffness constant to resist stretching, making the system numerically stiff; (2) with any practical stiffness, the rope stretches non-physically; (3) the collision with the floor happens between timesteps (tunneling from E14). The fix is Extended Position-Based Dynamics (XPBD): positional constraints applied directly to enforce inextensibility, with a separate collision constraint for the floor.
- **Concept introduced:** XPBD (Extended Position-Based Dynamics) — a generalization of PBD where each constraint has its own compliance (inverse stiffness), allowing stiff constraints (rope inextensibility) and soft constraints (spring) to coexist in the same system with the same timestep. The compliance parameter decouples physical stiffness from numerical timestep.
- **Push it / wow moment:** A grappling hook that swings the camera around procedurally-generated obstacles. A suspension bridge made of chain links that sags correctly under its own weight and bounces when you jump on it. A whip that, if swung correctly, cracks (tip exceeds speed of sound).
- **Demo:** Drag the rope endpoints. Fix one or both ends. Drop heavy objects onto the rope. A "whip mode" where you swing one end.
- **Tags:** `rope-simulation` `chain-physics` `Verlet-constraints` `XPBD` `javascript` `position-based-dynamics` `inextensibility` `game-physics`
- **Thumbnail:** A golden chain falling in a perfect S-curve, beautifully lit against black. Pure visual, no text needed.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
