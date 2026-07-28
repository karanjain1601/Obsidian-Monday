---
title: "I Drew Electric Fields by Hand, Then in Code. One of Them Was Wrong."
season: 3
episode: 27
difficulty: 4.5/10
concept: "Coulomb's law, superposition, and Gauss's law for field lines"
prereq: "E06 (gravity as Coulomb analogue) + E07 (adaptive integration)"
tags: [electric-field-simulation, Coulombs-law, field-lines, Gausss-law, javascript, electrostatics, physics-visualization, superposition, Faraday-cage]
type: playlist-video
---

## S3·E27 — "I Drew Electric Fields by Hand, Then in Code. One of Them Was Wrong."

- **Alt title:** "Why Electric Field Lines Are Almost Impossible to Draw Correctly in Code"
- **Difficulty:** 4.5/10 · **Prereq:** E06 (gravity as Coulomb analogue) + E07 (adaptive integration)
- **Hook:** A textbook-perfect electric field line diagram with beautiful curved lines terminating at charges — except two field lines merge into each other instead of terminating, violating Gauss's law numerically.
- **The break (bug):** Naive field line integration (follow the normalized electric field at fixed step size) overshoots near charges because the field varies rapidly in magnitude. Lines that should pass on opposite sides of a small charge merge due to insufficient step resolution. Fix: adaptive step size (RK4 with error control), and angular flux-tube method for distributing starting angles proportional to charge magnitude.
- **Concept introduced:** Coulomb's law `E = kq/r²`, the superposition principle (total field = vector sum of individual contributions), Gauss's law (field lines begin and end on charges, conserving flux), and the angular-flux method for correctly spacing field lines to represent equal flux tubes.
- **Push it / wow moment:** Drag charges around in real time — all field lines update instantly. Add a grounded conductor (Faraday cage) using the image charge method: field inside is zero, field outside is distorted. Show both electric field lines and equipotential contours simultaneously (they are always perpendicular).
- **Demo:** Click to place positive and negative charges. Drag to move. Adjust charge magnitude. Toggle equipotentials on/off. The Faraday cage demo.
- **Tags:** `electric-field-simulation` `Coulombs-law` `field-lines` `Gausss-law` `javascript` `electrostatics` `physics-visualization` `superposition` `Faraday-cage`
- **Thumbnail:** A beautiful electric dipole field line diagram with a Faraday cage in the center, field lines curving around it, zero lines penetrating the interior.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
