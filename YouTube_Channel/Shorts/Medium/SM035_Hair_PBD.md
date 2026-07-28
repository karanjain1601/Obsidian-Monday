---
title: "Hair Simulation — PBD Strand Dynamics"
id: SM035
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, hair-simulation, PBD, strand-dynamics, computer-graphics]
---

> **What it is:** A ~45-second simulation short simulating 5,000 hair strands swinging and responding to wind in real time, with each strand modelled as an inextensible PBD chain and collisions resolved against the head's signed distance field. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Hair Simulation — PBD Strand Dynamics

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A rendered head with flowing dark hair. The head tilts rapidly — the hair swings in a beautiful arc, individual strands catching the light and separating, then settling back with a gentle bounce. The motion is lush and physically convincing.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Single strand isolated: a chain of 20 particles connected by distance constraints (inextensibility) and angular/bending constraints (resist kinking). The strand hangs under gravity, sways. Particle positions and constraint arrows shown. Caption: "Hair strand = inextensible PBD chain."

**0:10–0:18** — Bending constraint: two adjacent strand segments resist angular deflection. Stiffness values: low bending stiffness → wavy, curly hair; high → straight hair. Slider shows four hair types (straight → wavy → curly → afro coil). Each type rendered with different bending stiffness.

**0:18–0:27** — Full head: 5,000 hair strands simulated simultaneously. Wind blast from the side: all strands blow in the same direction, form a fluid-looking wave across the scalp. The collective motion reveals fluid-like behaviour. Caption: "5,000 strands at 60fps — PBD parallelism."

**0:27–0:36** — Collision with the head: strands cannot penetrate the head mesh. SDF (signed distance field) of the head used for fast collision detection. Each particle checked against SDF, projected outward if inside. Caption: "SDF head collision — fast and smooth."

**0:36–0:45** — Artistic finale: long hair in slow motion, backlit. Each strand a different luminance (subsurface scattering approximation). Bold text: "PBD hair — from game studios to blockbusters." Fade to black.

## Physics Concept Teased
PBD hair simulation: each strand is an inextensible chain of particles. Distance constraints enforce length; bending constraints resist kinking. Parallelism across strands enables 5,000+ simultaneously at real-time. Collision with the scalp uses a Signed Distance Field. This approach is used in Unreal, Maya, and DCC tools.

## On-Screen Text / Captions
- **0:00** — "5,000 hair strands. Real time."
- **0:05** — "Each strand: inextensible PBD chain"
- **0:12** — "Bending stiffness → hair type"
- **0:20** — "Wind: 5,000 strands respond together"
- **0:28** — "SDF head collision — no penetration"
- **0:35** — "PBD hair: Unreal, Maya, blockbuster films"
- **0:43** — "Hair simulation — physics + artistry."

## End Card
Final 3 seconds: slow-motion hair in backlit cinematic render. Text: "Disney Research and Weta Digital — billions of hairs in film production." CodedLaws logo.

## Audio
Smooth, cinematic ambient (70 BPM, orchestral pads). Soft rushing wind sound at 0:20 (wind blast). Voiceover at 0:00: "Hair is one of the hardest things to simulate — thousands of colliding, tangled strands." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: three.js with custom PBD solver + hair shader (anisotropic Kajiya-Kay shading). Key algorithm: PBD strand solver: for each strand, project distance constraints (Gauss-Seidel), then project bending constraints (angular stiffness). Parallelise across strands (embarrassingly parallel). SDF collision: precompute head SDF on a 3D grid; each particle queries SDF at its position, projects outward by gradient × penetration depth. Gotcha: hair-hair collision extremely expensive for full-resolution — use simplified collision (attraction/repulsion per strand cluster). Runtime: real-time with WebGL compute shaders, or CPU with WebAssembly for ~1000 strands at 30fps.
