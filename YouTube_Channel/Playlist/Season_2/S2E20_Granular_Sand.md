---
title: "Sand Is Not a Liquid and Not a Solid. Simulating It Is a Nightmare."
season: 2
episode: 20
difficulty: 7/10
concept: "Granular matter, Coulomb friction, and angle of repose"
prereq: "E14, E15, E17, E18 (combines collision, impulse, constraints from all Season 2)"
tags: [granular-simulation, sand-physics, angle-of-repose, Coulomb-friction, DEM, discrete-element-method, javascript, soft-matter-physics]
type: playlist-video
---

## S2·E20 — "Sand Is Not a Liquid and Not a Solid. Simulating It Is a Nightmare." *(Season 2 Finale)*

- **Alt title:** "The Physics of a Sandpile: Why Granular Matter Breaks Every Model You Have"
- **Difficulty:** 7/10 · **Prereq:** E14, E15, E17, E18 (combines collision, impulse, constraints from all Season 2)
- **Hook:** A pile of sand that flows like a liquid on a steep slope, compacts like a solid at the base, and maintains an angle of repose — a stable slope angle — that no fluid can hold. What phase of matter is this?
- **The break (bug):** Treating sand grains as elastic spheres (as in E14's collision system) gives fluid-like behavior with no angle of repose. The grains keep rolling. Real sand grains are rough, angularly irregular objects that lock via Coulomb friction — they resist tangential sliding forces up to μ × normal force. Adding inter-grain friction (tangential impulse limited by friction cone) creates the angle of repose.
- **Concept introduced:** Granular matter — a state of matter distinct from solid, liquid, and gas. Coulomb friction between grains (tangential force ≤ μ × normal force), the angle of repose (arctan(μ) ≈ 30–45° for most sands), and why granular flows exhibit both solid-like (stable piles) and fluid-like (avalanching) behavior depending on shear rate.
- **Push it / wow moment:** An hourglass with realistic granular flow — you can hear the physics in how the grains pack at the bottom, how the flow rate depends on aperture size, how the top pile collapses inward as the grains drain. Dig a tunnel and watch it collapse. Build a sandcastle. Rotate the hourglass.
- **Demo:** Pour or scoop sand with the cursor. Rotate the container. Change grain size and friction coefficient. Watch avalanche statistics — plot avalanche size vs. frequency (should follow a power law — self-organized criticality!).
- **Tags:** `granular-simulation` `sand-physics` `angle-of-repose` `Coulomb-friction` `DEM` `discrete-element-method` `javascript` `soft-matter-physics`
- **Thumbnail:** An hourglass with realistic granular sand flowing through the aperture, individual grains visible.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
