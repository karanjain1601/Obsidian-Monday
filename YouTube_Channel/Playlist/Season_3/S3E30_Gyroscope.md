---
title: "A Spinning Top Defies Gravity. Here's the Code That Proves It."
season: 3
episode: 30
difficulty: 8/10
concept: "Gyroscopic precession and angular momentum dynamics"
prereq: "E29 (full 3D rigid body + quaternions — this is the natural next challenge)"
tags: [gyroscope-simulation, precession, angular-momentum, rigid-body, three.js, javascript, physics-counterintuition, nutation, Foucault-pendulum]
type: playlist-video
---

## S3·E30 — "A Spinning Top Defies Gravity. Here's the Code That Proves It." *(Season 3 Finale)*

- **Alt title:** "Gyroscopic Precession: The Physics That Looks Exactly Like a Magic Trick"
- **Difficulty:** 8/10 · **Prereq:** E29 (full 3D rigid body + quaternions — this is the natural next challenge)
- **Hook:** A gyroscope whose spin axis should fall under gravity — but instead the axis orbits slowly around vertical, apparently defying gravity entirely. Then the spin winds down and it falls exactly like a non-spinning top. The code running both behaviors is identical.
- **The break (bug):** Without the gyroscopic torque term `τ = dL/dt = ω_precession × L` in the angular momentum update, the simulated gyroscope just topples under gravity. Adding this term (which comes naturally from the correct angular momentum equation `dL/dt = τ_external`) produces precession without any special-casing. The entire counterintuitive behavior is in a single cross-product.
- **Concept introduced:** Angular momentum `L = I·ω`, Euler's equations of motion `dL/dt = τ`, and why a torque applied to a large angular momentum vector causes the *direction* of L to change (precession) rather than its magnitude. Precession rate `Ω = τ/L = Mgr/(Iω)` — faster spin means slower precession.
- **Push it / wow moment:** Add nutation (the wobble on top of precession — the gyroscope traces a cycloid path rather than a perfect circle). Show a Foucault pendulum — the oscillation plane rotates due to Earth's angular momentum being a gyroscope. Show a satellite with reaction wheels — applying torque to the wheels transfers momentum to orient the satellite.
- **Demo:** Set spin rate with a slider. Watch precession rate decrease as spin decays from friction. "Stop spin" button immediately causes it to fall, making the gyroscopic effect viscerally clear.
- **Tags:** `gyroscope-simulation` `precession` `angular-momentum` `rigid-body` `three.js` `javascript` `physics-counterintuition` `nutation` `Foucault-pendulum`
- **Thumbnail:** A glowing gyroscope precessing in a slow circle while a plain non-spinning top falls over beside it. The contrast is the entire story.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
