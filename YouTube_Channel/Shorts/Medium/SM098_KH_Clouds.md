---
title: "Kelvin-Helmholtz Clouds — Atmosphere Simulation"
id: SM098
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, kelvin-helmholtz, atmosphere, cloud, instability]
---

> **What it is:** A ~45-second simulation short where a fast wind layer shearing over a slow stratified layer rolls up into the iconic breaking-wave billow cloud pattern when the Richardson number drops below 0.25, matching a real Kelvin-Helmholtz cloud photograph side-by-side with the simulation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Kelvin-Helmholtz Clouds — Atmosphere Simulation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A beautiful photograph of Kelvin-Helmholtz clouds — a row of breaking waves in the sky, each perfectly formed. Then the simulation begins — the same wave pattern emerging from a shear layer between fast and slow wind layers, in exactly 3 seconds.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Setup: a stratified atmosphere — a warm, fast upper layer (wind 30 m/s, temperature 20°C) over a cool, slow lower layer (wind 5 m/s, temperature 5°C). The Richardson number Ri = N²/(dU/dz)² controls stability. Caption: "Ri < 0.25 → KH instability in stratified flow."

**0:10–0:18** — The KH instability grows: density shown as colour (blue=cool, red=warm). The interface buckles into sinusoidal waves that roll over into vortex billows. Each billow entrains cool air into the warm layer — mixing. Caption: "Billows: warm air spirals down, cool spirals up."

**0:18–0:27** — Cloud formation: humidity field coupled to the simulation. Where upward displacement cools air below dew point: cloud forms (white). Where downward: cloud evaporates. The characteristic "crashing wave" cloud pattern forms at the billow crests. Caption: "Cloud marks the billow crest — evaporates in the trough."

**0:27–0:36** — Time evolution: the billows merge (inverse cascade) — two billow width → one billow width. Each merger event doubles the amplitude of the remaining waves. Caption: "Billow merging: inverse cascade doubles amplitude." The atmosphere mixes irreversibly.

**0:36–0:45** — From clouds to ocean to labs: KH instability shows up in (1) ocean thermocline mixing, (2) jet streams, (3) the Sun's magnetosphere, (4) lab experiments with two-layer tanks. All shown with small thumbnails. Caption: "KH: atmosphere, ocean, magnetosphere — universal." Bold text: "Kelvin-Helmholtz clouds — the atmosphere's breaking waves." Fade to black.

## Physics Concept Teased
Kelvin-Helmholtz instability in a stratified atmosphere: when the Richardson number Ri = N²/(dU/dz)² < 0.25, the stabilising effect of buoyancy is overcome by the destabilising shear. Vortex billows form, entrain both fluid layers, and produce the characteristic breaking-wave cloud pattern. The instability drives vertical mixing in the atmosphere and ocean.

## On-Screen Text / Captions
- **0:00** — "Breaking waves — in the sky."
- **0:05** — "Ri = N²/(dU/dz)² < 0.25 → KH unstable"
- **0:12** — "Billows: warm spirals down, cool spirals up"
- **0:20** — "Cloud at billow crest: dew point exceeded"
- **0:28** — "Billow merging — inverse cascade"
- **0:35** — "Atmosphere, ocean, magnetosphere — KH everywhere"
- **0:43** — "KH clouds — breaking waves in the sky."

## End Card
Final 3 seconds: real KH cloud photograph side-by-side with the simulation at matching stage. Text: "Kelvin-Helmholtz clouds are so rare and brief — you need to be very lucky to see them." CodedLaws logo.

## Audio
Wind ambient (atmospheric). Voiceover at 0:00: "When a fast wind layer slides over a slow one, the boundary between them rolls up into breaking waves — and if clouds are present, they trace the pattern." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or Canvas 2D. Key algorithm: 2D Boussinesq Navier-Stokes with buoyancy. Temperature as active scalar. Initial condition: tanh velocity profile (U = U_0·tanh(z/δ)) and tanh density profile (ρ = ρ₀·(1 + tanh(z/δ)·Δρ/(2ρ₀))). Perturbation: add white noise at the interface. Richardson number Ri = (g/ρ)·(dρ/dz)/(dU/dz)². Cloud: track regions where virtual temperature (T - LCL_T) < 0. Pseudo-spectral solver (as SM061). Periodic in x, rigid-lid in z. Runtime: real-time WebGL for 512×256 grid.
