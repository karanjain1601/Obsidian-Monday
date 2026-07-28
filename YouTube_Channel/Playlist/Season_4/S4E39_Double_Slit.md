---
title: "Light Is a Wave and a Particle. I Simulated Both. They're the Same Thing."
season: 4
episode: 39
difficulty: 6.5/10
concept: "Wave-particle duality, probability amplitudes, and Born's rule"
prereq: "E37, E38 (QM framework + probability amplitude)"
tags: [double-slit, quantum-mechanics, wave-particle-duality, Borns-rule, javascript, interference, photon-simulation, which-path, measurement-problem]
type: playlist-video
---

## S4·E39 — "Light Is a Wave and a Particle. I Simulated Both. They're the Same Thing."

- **Alt title:** "The Double Slit: The Most Terrifying Experiment in Physics, Built in Code"
- **Difficulty:** 6.5/10 · **Prereq:** E37, E38 (QM framework + probability amplitude)
- **Hook:** A single photon fired at a double slit — no pattern visible. After 10,000 photons, an interference pattern emerges from apparently random individual dots. Nobody told the photons to make an interference pattern.
- **The break (bug):** Simulating photons as classical balls that land randomly in one slit or the other produces a two-lump distribution — one lump per slit — with no interference. Only computing the full wave amplitude ψ at the screen (summing contributions from both slits, respecting phase) and *then* sampling from |ψ|² produces the correct interference pattern.
- **Concept introduced:** Wave-particle duality, probability amplitudes (complex numbers whose squared magnitude gives probability), Young's double-slit experiment, Born's rule, and the measurement problem: why adding a detector at one slit (which-path information) destroys the interference pattern.
- **Push it / wow moment:** "Which-path" measurement — add a detector at one slit. The interference pattern immediately vanishes, leaving the two-lump classical distribution. Remove the detector — pattern returns. The simulation makes Feynman's "most mysterious experiment" *playable*.
- **Demo:** Toggle wave mode (see the full wave amplitude) vs. particle mode (individual dots accumulate). Click to add/remove the which-path detector. Adjust slit width and separation. Watch the fringe spacing change as predicted by `λL/d`.
- **Tags:** `double-slit` `quantum-mechanics` `wave-particle-duality` `Borns-rule` `javascript` `interference` `photon-simulation` `which-path` `measurement-problem`
- **Thumbnail:** A screen showing an interference pattern gradually emerging from individual random dots. "ONE PHOTON AT A TIME."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
