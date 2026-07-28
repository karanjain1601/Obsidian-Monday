---
title: "Fire Is Just Hot Fluid. Building It Is Pure Programming Horror."
season: 3
episode: 24
difficulty: 7.5/10
concept: "Boussinesq buoyancy approximation for convection"
prereq: "E23 (stable fluids — extends it directly)"
tags: [fire-simulation, smoke-simulation, buoyancy, Navier-Stokes, WebGL, javascript, volumetric-rendering, Boussinesq, convection]
type: playlist-video
---

## S3·E24 — "Fire Is Just Hot Fluid. Building It Is Pure Programming Horror."

- **Alt title:** "Why Simulating Fire Requires Lying About Thermodynamics"
- **Difficulty:** 7.5/10 · **Prereq:** E23 (stable fluids — extends it directly)
- **Hook:** Add temperature to last week's fluid solver — and suddenly smoke rises, hot gas billows upward, and for the first time it looks exactly like fire. The only addition is 10 lines of code and one physical concept.
- **The break (bug):** Without temperature-buoyancy coupling (Boussinesq approximation: add an upward body force proportional to temperature deviation from ambient), "fire" spreads horizontally as colored dye, not upward. Real hot gas rises because it is less dense than cool air — this is convection, and it must be explicitly coded as a body force.
- **Concept introduced:** Buoyancy-driven convection via the Boussinesq approximation: `f_buoyancy = α(T - T_ambient) * ĝ` where α is the thermal expansion coefficient. Temperature is advected as a *passive scalar* (transported by the velocity field without affecting it except through the buoyancy coupling). This extends the fluid solver by two fields: temperature and fuel density.
- **Push it / wow moment:** 3D volumetric fire rendered in WebGL using ray-marching. Realistic blackbody emission color gradient: blue base → orange body → red/dark smoke crown. Multiple fire sources. Wind direction control. The result is photorealistic enough to be mistaken for real footage in a thumbnail.
- **Demo:** Click to place ignition sources. Wind direction slider. Fuel density slider (how hot / how large the flame). Toggle Boussinesq force off to watch fire become flat dye.
- **Tags:** `fire-simulation` `smoke-simulation` `buoyancy` `Navier-Stokes` `WebGL` `javascript` `volumetric-rendering` `Boussinesq` `convection`
- **Thumbnail:** Dramatic 3D volumetric fire — orange/white core, red fading to dark smoke — against pure black. "CODED FROM SCRATCH. NO TEXTURES."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
