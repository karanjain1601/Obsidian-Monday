---
title: "I Rendered the Most Beautiful Thing in the Universe From Scratch"
season: 4
episode: 36
difficulty: 9/10
concept: "Accretion disk emission, Doppler beaming, and multiple lensed images"
prereq: "E34, E35 (full Schwarzschild ray-tracing pipeline)"
tags: [accretion-disk, black-hole-rendering, Interstellar, gravitational-lensing, ray-tracing, WebGL, Doppler-beaming, Kerr-metric, astrophysics]
type: playlist-video
---

## S4·E36 — "I Rendered the Most Beautiful Thing in the Universe From Scratch"

- **Alt title:** "Why the Interstellar Black Hole Looks the Way It Does"
- **Difficulty:** 9/10 · **Prereq:** E34, E35 (full Schwarzschild ray-tracing pipeline)
- **Hook:** The complete Interstellar image: a glowing accretion disk that appears to curve upward *over* the black hole — an apparent impossibility that is entirely a lensing artifact, emerging from the photon geodesics in E34.
- **The break (bug):** Rendering only the direct image of the disk (light that travels from the disk to the camera without going around the hole) gives a flat ring. The full image requires also tracing photons that travel *around* the black hole (secondary image) and even around twice (tertiary image) — these produce the top and bottom "reflections" of the disk. Miss these and the image looks flat and wrong.
- **Concept introduced:** Accretion disk emission spectrum (blackbody `T(r) ∝ r^(-3/4)` giving a color gradient from hot blue-white inner edge to cool red outer edge), Doppler beaming (approaching side of disk is dramatically brighter — `I ∝ γ⁴(1+β·cos φ)⁴`), and multiple lensed images of the same disk.
- **Push it / wow moment:** Add relativistic spin (Kerr metric in the equatorial plane approximation) so the approaching side of the disk blueshifts and the receding side redshifts — the Doppler brightness asymmetry matches the Interstellar/KGEO frame exactly.
- **Demo:** Control black hole mass, disk temperature, inclination angle, and spin parameter. Export as 8K image. Toggle secondary and tertiary images on/off to build up the full picture.
- **Tags:** `accretion-disk` `black-hole-rendering` `Interstellar` `gravitational-lensing` `ray-tracing` `WebGL` `Doppler-beaming` `Kerr-metric` `astrophysics`
- **Thumbnail:** Photorealistic Interstellar-style black hole with glowing asymmetric accretion disk. "I CODED THIS."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
