---
title: "Adaptive SPH — Ocean Wave with Foam"
id: SM044
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, SPH, fluid-simulation, ocean, foam, adaptive]
---

> **What it is:** A ~45-second simulation short where a 500,000-particle SPH ocean wave curls, breaks, and erupts into lingering white foam, with adaptive resolution clustering fine particles near the breaking crest where detail matters most. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Adaptive SPH — Ocean Wave with Foam

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
An ocean wave — deep blue-green — curls over and breaks. As it collapses, a burst of white foam erupts at the base and the foam lingers on the water surface, slowly dissipating. The entire simulation runs in real time with 500,000 SPH particles.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — SPH (Smoothed Particle Hydrodynamics) basics: each particle i represents a volume of fluid. Density estimated by kernel summation: ρ_i = Σ_j m_j W(r_ij, h). Pressure from density: p_i = k(ρ_i - ρ₀). Forces from pressure gradient and viscosity. Caption: "SPH: kernel-averaged fluid properties."

**0:10–0:18** — Adaptive resolution: large-particle region far from the wave (coarse, green tint), small-particle region near the breaking wave crest (fine, blue). Resolution transitions shown with a gradient colour-map of particle size. Caption: "Adaptive resolution — detail where needed."

**0:18–0:27** — Wave breaking and foam: when the wave crest overtops (Weber number We > We_crit), foam particles are generated at the air-water interface. Foam particles are lighter (air-entraining) and drift with the surface. Caption: "Foam generation: We > We_crit." Foam shown as white dots floating on the surface.

**0:27–0:36** — Foam lifetime: foam particles age (colour shifts from white to grey) and disappear over 5 seconds. The foam line on the beach advances and recedes with each wave. Caption: "Foam persistence time: ~5 s." Realistic beach wash and backwash motion.

**0:36–0:45** — Full ocean view: multiple breaking waves at different stages — some cresting, some foamy, some calm. Bold text: "500,000 SPH particles — real-time GPU." The foam gives the ocean a natural, familiar look. Fade to black.

## Physics Concept Teased
Smoothed Particle Hydrodynamics (SPH): a meshless Lagrangian method where each fluid parcel is a particle carrying mass, velocity, and thermodynamic state. Adaptive resolution places more (smaller) particles near breaking waves for detail. Foam is generated where surface curvature and speed indicate air entrainment.

## On-Screen Text / Captions
- **0:00** — "500,000 particles. Real-time ocean."
- **0:05** — "SPH: ρ_i = Σ m_j W(r_ij, h)"
- **0:12** — "Adaptive resolution — fine near the crest"
- **0:20** — "Foam: We > We_crit — air entrainment"
- **0:28** — "Foam lifetime: ~5 seconds"
- **0:35** — "Multiple waves — different foam stages"
- **0:43** — "Adaptive SPH — the ocean simulation standard."

## End Card
Final 3 seconds: crashing wave with white foam cloud, cinematic render. Text: "SPH is used in real-time game engines and VFX pipelines alike." CodedLaws logo.

## Audio
Ocean ambience — crashing waves, seagulls, wind. Relaxing ambient music. Voiceover at 0:00: "Every whitecap you've ever seen is captured by the Weber number — when waves break, air entangles into foam." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or three.js. Key algorithm: DFSPH or WCSPH with adaptive resolution (multi-resolution SPH). Adaptive: split large particles near the surface into smaller ones; merge small particles in calm regions. Foam: track particles near free surface; when speed > threshold and curvature > threshold, generate foam tracer particles. Foam rendering: additive blending for white foam effect. Wave generation: boundary condition wave paddle at domain inlet. Neighbour search: GPU spatial hash. Gotcha: adaptive merging/splitting must conserve mass, momentum, and angular momentum. Runtime: GPU CUDA or WebGPU compute shaders required for 500k particles at 30fps.
