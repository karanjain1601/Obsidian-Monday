---
title: "I Simulated Traveling Near Light Speed. My Clock Actually Slowed Down."
season: 4
episode: 31
difficulty: 5/10
concept: "Lorentz factor, time dilation, and relativistic velocity addition"
prereq: "E01 (basic kinematics baseline)"
tags: [special-relativity, time-dilation, Lorentz-factor, Minkowski-diagram, javascript, relativistic-simulation, spacetime-visualization, length-contraction]
type: playlist-video
---

## S4·E31 — "I Simulated Traveling Near Light Speed. My Clock Actually Slowed Down."

- **Alt title:** "Special Relativity Is Not Abstract: Here's What It Looks Like in Running Code"
- **Difficulty:** 5/10 · **Prereq:** E01 (basic kinematics baseline)
- **Hook:** Two clocks on screen — one stationary, one moving at 0.99c — and you watch them tick at measurably different rates in real time. The math is shown numerically. This isn't a textbook — it's running physics.
- **The break (bug):** Using Newtonian velocity addition `v_total = v1 + v2` gives superluminal results for two objects each moving at 0.6c relative to each other: v_total = 1.2c. The simulation crashes with an undefined Lorentz factor. Fix: relativistic velocity addition `v_total = (v1 + v2)/(1 + v1·v2/c²)`.
- **Concept introduced:** Lorentz factor `γ = 1/√(1-v²/c²)`, time dilation `Δt' = γΔt` (moving clock ticks slower by factor γ), length contraction `L' = L/γ` (moving objects are shorter), relativistic velocity addition (velocities never add to exceed c), and why c is the simulation's hard ceiling.
- **Push it / wow moment:** A Minkowski spacetime diagram — the user draws worldlines (position vs. time curves) and the simulation shows the light cones automatically. Two observers with worldlines shown simultaneously — their simultaneity slices are visibly different (relativity of simultaneity). Set up the twin paradox: two worldlines, one stationary, one going and returning.
- **Demo:** Drag a spaceship's velocity slider from 0 to 0.9999c. Watch the clock tick rate change in real time. Draw worldlines on the Minkowski diagram. Compare proper times between any two events.
- **Tags:** `special-relativity` `time-dilation` `Lorentz-factor` `Minkowski-diagram` `javascript` `relativistic-simulation` `spacetime-visualization` `length-contraction`
- **Thumbnail:** Two clocks — one ticking fast, one barely moving — with Minkowski diagram in background. "TIME IS NOT CONSTANT."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
