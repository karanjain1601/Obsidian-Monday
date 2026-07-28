---
title: "Jeans Instability — Molecular Cloud Collapse"
id: SM106
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Star_Formation_Full]]"
difficulty: medium
tags: [physics, simulation, short, astrophysics, gravity, star-formation, instability]
---

> **What it is:** A ~45-second simulation short where a density ripple in a glowing molecular gas cloud grows past the Jeans length, triggering gravitational collapse and fragmentation into a cluster of proto-stellar cores. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Star_Formation_Full]]

# Short: Jeans Instability — Molecular Cloud Collapse
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A vast, softly glowing molecular cloud — emerald green and dusty, with faint wisps of gas — fills the screen. Then a single density ripple appears. The cloud holds for a moment, then collapses inward like a slow-motion implosion, drawing everything into a blazing point of light.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** A 2D gas cloud rendered as a density field (dark green background, brighter patches for denser regions). Random thermal fluctuations shown as faint rippling density perturbations. Temperature T and sound speed c_s labels shown. Jeans length formula: λ_J = c_s√(π/Gρ) appears.
- **0:10–0:18:** A perturbation with wavelength λ > λ_J is highlighted with a yellow ellipse. Gravity (inward arrows, magenta) wins over pressure (outward arrows, cyan). The highlighted region begins contracting. A perturbation with λ < λ_J highlighted in blue — pressure wins — oscillates but doesn't collapse (sound wave).
- **0:18–0:28:** The unstable region collapses. Density at center spikes on a color scale (dark green → yellow → white). Free-fall timescale t_ff = 1/√(Gρ) label appears. Surrounding gas streams inward along filaments — structure emerges from smooth initial conditions.
- **0:28–0:38:** Fragmentation: as the collapsing region grows denser, new Jeans instabilities are triggered within it. Secondary collapses branch off — a cluster of proto-collapse cores appears, each glowing white at center. This is stellar cluster formation.
- **0:38–0:45:** Final state: a star-forming region with multiple bright proto-stellar cores embedded in a filamentary gas structure. All cores glow with increasing brightness. Comparison: Orion Nebula image briefly flashes for 1 second.

## Physics Concept Teased
The Jeans instability criterion determines when a gas cloud becomes gravitationally unstable: if a perturbation's wavelength exceeds the Jeans length λ_J = c_s√(π/Gρ), self-gravity overwhelms thermal pressure and collapse ensues on the free-fall timescale. This is the fundamental process by which stars and galaxies form from initially nearly uniform gas.

## On-Screen Text / Captions
- **0:00:** "A gas cloud, holding itself up. Then it isn't."
- **0:08:** "Jeans length: λ_J = c_s√(π/Gρ)"
- **0:15:** "λ > λ_J → gravity wins → collapse"
- **0:22:** "Free-fall time: t_ff = 1/√(Gρ)"
- **0:30:** "Cloud fragments into many stars"
- **0:38:** "This is how star clusters are born."
- **0:44:** "James Jeans worked this out in 1902."

## End Card
Final 3 seconds: the multi-core star-forming region glows, cores brightening to stellar luminosities. Text: "Every star began as a Jeans instability." Channel logo.

## Audio
Deep space ambient hum — low, resonant, almost geological. Subtle gravitational rumble begins at collapse onset (0:18). Voiceover (hushed, reverent): "Gravity never forgets. The cloud held for a million years. Then it didn't." Brief bright chime at each proto-stellar core ignition.

## Production Notes
Code complexity: moderate. Renderer: WebGL. Key algorithm: 2D self-gravitating isothermal gas — solve Poisson equation for gravitational potential (∇²Φ = 4πGρ) via FFT method; update velocity with pressure gradient + gravity; advect density with upwind scheme. Grid: 256×256. Initial condition: uniform ρ₀ with 5% white-noise perturbation. Jeans mass M_J = (4π/3)ρ(λ_J/2)³ computed each frame. Gotcha: isothermal assumption breaks at high density — add a stiffening equation of state above ρ_crit to prevent infinite collapse and preserve numerical stability. Color map: density → perceptually uniform green-white palette (viridis-green variant).
