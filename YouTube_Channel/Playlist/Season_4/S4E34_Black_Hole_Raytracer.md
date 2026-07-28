---
title: "I Ray-Traced a Black Hole and Saw Why Interstellar Got It Right"
season: 4
episode: 34
difficulty: 8.5/10
concept: "Schwarzschild metric, null geodesics, and gravitational lensing"
prereq: "E07 (RK4 adaptive integration), E31–E33 (SR context for GR)"
tags: [black-hole-simulation, gravitational-lensing, Schwarzschild, photon-geodesic, ray-tracing, javascript, WebGL, general-relativity, Einstein-ring, photon-sphere]
type: playlist-video
---

## S4·E34 — "I Ray-Traced a Black Hole and Saw Why Interstellar Got It Right"

- **Alt title:** "How to Render a Black Hole Using General Relativity (No Shortcuts)"
- **Difficulty:** 8.5/10 · **Prereq:** E07 (RK4 adaptive integration), E31–E33 (SR context for GR)
- **Hook:** A photon sphere ring, an Einstein ring from a perfectly-aligned background star, and multiple ghost images of an accretion disk — all rendered pixel-by-pixel by integrating photon trajectories under the Schwarzschild metric.
- **The break (bug):** Integrating photon geodesics with a fixed step size causes photons near the photon sphere (r = 3GM/c²) to either incorrectly escape when they should orbit, or incorrectly fall in. An adaptive step size (shrink dt near the singularity) is mandatory — and even then, the photon sphere is numerically chaotic (an unstable equilibrium, analogous to a ball balanced on a hilltop).
- **Concept introduced:** Schwarzschild metric `ds² = -(1-rs/r)c²dt² + (1-rs/r)⁻¹dr² + r²dΩ²` (rs = 2GM/c² is the Schwarzschild radius), null geodesic equations for massless particles (photons follow paths where ds² = 0), gravitational lensing (light bends around mass), and the photon sphere (r = 3rs/2, where photons can orbit — unstably).
- **Push it / wow moment:** Full Einstein ring + multiple ghost images. The accretion disk appears *both above and below* the black hole simultaneously — the light from the underside is lensed around and becomes visible above. This is the visual that made Interstellar famous, and it emerges naturally from the geodesic integration.
- **Demo:** Adjust the impact parameter (closest approach distance of the photon) and watch the deflection angle update. Add a background starfield. Export the rendering as a 4K image.
- **Tags:** `black-hole-simulation` `gravitational-lensing` `Schwarzschild` `photon-geodesic` `ray-tracing` `javascript` `WebGL` `general-relativity` `Einstein-ring` `photon-sphere`
- **Thumbnail:** Stunning Interstellar-style black hole with accretion disk and Einstein ring. "CODED WITH GENERAL RELATIVITY."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
