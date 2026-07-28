---
title: "Internal Waves in a Stratified Ocean"
id: SM100
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Density_Stratification_Full]]"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, waves, ocean, stratification]
---

> **What it is:** A ~45-second simulation short where a single ripple at the pycnocline of a two-layer stratified tank launches internal gravity waves that reflect off the wall into a St. Andrew's cross interference pattern, demonstrating the anisotropic dispersion relation ω = N·sin(θ) where energy travels perpendicular to the wave crests. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Density_Stratification_Full]]

# Short: Internal Waves in a Stratified Ocean
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A dark tank of water split horizontally into two glowing bands — deep cobalt blue on the bottom, pale cyan on top — sits perfectly still. Then a single ripple disturbs the interface and the entire boundary between the layers erupts into a sinuous, slow-rolling wave that travels silently across the screen.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** The two-layer density profile is revealed with a smooth color gradient (blue → cyan) representing increasing buoyancy. A white arrow marks the pycnocline — the sharp density interface at mid-depth. Brunt-Väisälä frequency N displayed in corner.
- **0:10–0:18:** A small oscillating paddle on the left wall generates an internal wave packet. The interface undulates in sinusoidal arcs of 20 px amplitude. Color-coded vertical displacement field appears as a rainbow heatmap overlaid on the fluid.
- **0:18–0:28:** The wave packet propagates rightward at roughly 0.3× surface wave speed. Phase velocity vectors (small white arrows) point diagonally — energy travels at an angle to the interface, shown with a group velocity vector in bright yellow tilted ~40° from horizontal.
- **0:28–0:38:** Wave reflects off the right wall; incident and reflected beams cross, forming a characteristic St. Andrew's cross interference pattern in the displacement field — four bright lobes radiating from the reflection point.
- **0:38–0:45:** Zoom out. The full tank glows with the criss-cross pattern. Text overlay fades in. Final freeze-frame with N² profile shown on the right side.

## Physics Concept Teased
Internal gravity waves exist inside stratified fluids — not at the surface but within the bulk. Restoring force is buoyancy (gravity acts on density differences). Dispersion relation: ω = N·sin(θ), where θ is the angle of the wave vector to horizontal. Energy propagates perpendicular to phase velocity — opposite to surface waves.

## On-Screen Text / Captions
- **0:00:** "Two fluids. One interface. Hidden waves."
- **0:08:** "Pycnocline — where density jumps"
- **0:18:** "Internal waves travel inside the fluid"
- **0:27:** "Phase ↑ Energy →" (arrows on screen)
- **0:35:** "St. Andrew's Cross — energy beams"
- **0:42:** "ω = N · sin(θ)"
- **0:45:** "This happens in every ocean on Earth."

## End Card
Last 3 seconds: the St. Andrew's cross pattern pulses slowly in teal and gold on a black background. Text reads "Follow for more hidden physics." Channel logo appears bottom-right.

## Audio
Ambient low-frequency drone with slow pad swells — oceanic, slightly eerie. No voiceover. Subtle underwater bubble sound effect when the paddle activates at 0:03. A soft "ping" chime when the cross pattern forms at 0:35.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D with WebGL fragment shader for the color-mapped displacement field. Key algorithm: 2D Boussinesq equations solved on a 512×256 grid with pseudo-spectral method (FFT x-direction, finite difference z). Buoyancy term: b = -g·ρ'/ρ₀. Runtime: pre-rendered at 60 fps. Gotcha: group velocity is perpendicular to phase velocity — visualize both explicitly or viewers miss the key insight. Use HSL color mapping on vertical displacement for the heatmap.
