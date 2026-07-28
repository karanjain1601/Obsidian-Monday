---
title: "What Does 99% Light Speed Actually Look Like? I Coded It."
season: 4
episode: 32
difficulty: 6/10
concept: "Relativistic aberration, Doppler shift, and Penrose-Terrell rotation"
prereq: "E31 (SR basics)"
tags: [relativistic-aberration, Doppler-effect, Penrose-Terrell, javascript, special-relativity, starfield, headlight-effect, relativistic-ray-tracing]
type: playlist-video
---

## S4·E32 — "What Does 99% Light Speed Actually Look Like? I Coded It."

- **Alt title:** "Relativistic Aberration: Why Stars Bunch Up in Front of a Fast-Moving Ship"
- **Difficulty:** 6/10 · **Prereq:** E31 (SR basics)
- **Hook:** A starfield that, as the ship accelerates toward 0.99c, compresses all stars into a blazing point ahead — while everything behind redshifts to darkness — a physically accurate rendering that looks completely alien.
- **The break (bug):** Applying only relativistic Doppler shift (color change) without aberration (position change) gives a wrong image — stars appear redshifted/blueshifted but at their original positions. In reality, the star positions themselves shift forward due to relativistic aberration. Both effects must be applied to each star's angle θ using: `cos(θ') = (cos(θ) + β)/(1 + β·cos(θ))`.
- **Concept introduced:** Relativistic aberration (stars appear to bunch forward — the "headlight effect" — as velocity increases), relativistic Doppler shift (approaching stars blueshift; receding redshift beyond visible into infrared), Penrose-Terrell rotation (a moving sphere appears rotated, not squished, due to light-travel time differences across its face).
- **Push it / wow moment:** A relativistic ray-tracer for a city street moving at 0.99c. The buildings in front are compressed and blueshifted; the ones behind are stretched and dark. Add Terrell rotation to a cube — it appears rotated by an angle instead of Lorentz-contracted.
- **Demo:** Velocity slider 0 → 0.9999c. Toggle each effect (aberration, Doppler, Terrell) independently to understand the contribution of each. Starfield with constellation lines visible.
- **Tags:** `relativistic-aberration` `Doppler-effect` `Penrose-Terrell` `javascript` `special-relativity` `starfield` `headlight-effect` `relativistic-ray-tracing`
- **Thumbnail:** All stars smeared into a blazing point at the center front of the view. A spaceship silhouette visible. "THIS IS WHAT 0.99c LOOKS LIKE."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
