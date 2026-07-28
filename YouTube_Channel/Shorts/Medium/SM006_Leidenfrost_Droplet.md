---
title: "Leidenfrost Droplet Dancing"
id: SM006
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, thermodynamics, surface-tension, leidenfrost, droplet]
---

> **What it is:** A ~45-second simulation showing a water droplet levitating on a vapour cushion above a superheated surface and self-propelling along asymmetric ridges — demonstrating the Leidenfrost effect and near-frictionless droplet locomotion. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Leidenfrost Droplet Dancing

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Extreme close-up: a single silver-white water droplet sits on a glowing orange-red hot surface. The droplet levitates just above the surface on a cushion of vapour, wobbling like a mercury blob. In 2 seconds it skitters sideways across the frame entirely on its own.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Cross-section diagram cuts in: droplet (blue) hovering above the hot surface (orange). A thin vapour film (white) is shown between them labeled "vapour layer ~100 µm." Arrows show vapour being squeezed out from the sides, generating a levitation force.

**0:10–0:18** — Return to live sim view: the droplet self-propels along a textured ratchet surface (saw-tooth ridges etched in the hot plate). The asymmetric ridges direct vapour flow in one direction, pushing the droplet like a jet. Annotation: "Ratchet → directed locomotion."

**0:18–0:27** — Multiple droplets on a flat surface: they bounce off each other, merge into a larger droplet, which then splits when it grows too large. The larger the droplet, the more internal oscillation modes are excited. Eigenmodes shown as glowing rings.

**0:27–0:36** — Temperature slider: surface cools from 400°C to 100°C. At the Leidenfrost point (~220°C) the droplet suddenly collapses onto the surface and sizzles. Sharp audio cue. Text: "Leidenfrost point: 220°C."

**0:36–0:45** — Droplet back at 400°C: stable levitation restored. Annotation shows the vapour pressure gradient equation. Text: "A cushion of steam — no contact with the surface." Fade to black.

## Physics Concept Teased
Leidenfrost effect: when a liquid droplet contacts a surface far above its boiling point, the immediate vapourisation of the bottom layer forms an insulating vapour cushion. The droplet levitates, experiences near-zero friction, and can self-propel on asymmetric surfaces.

## On-Screen Text / Captions
- **0:00** — "Water droplet. 400°C surface."
- **0:05** — "Vapour layer: ~100 µm thick"
- **0:13** — "Asymmetric ridges → self-propulsion"
- **0:22** — "Merge… split… oscillate."
- **0:30** — "Leidenfrost point: 220°C"
- **0:38** — "No contact. Pure steam cushion."
- **0:44** — "Leidenfrost effect."

## End Card
Final 3 seconds: split-screen — simulation vs. real high-speed footage of a water droplet on a pan. Text: "Same physics. Different scale." CodedLaws logo. CTA: "See the full thermal sim breakdown."

## Audio
Warm, slightly eerie electronic ambient (75 BPM). Voiceover at 0:00: "Drop water onto a surface hot enough and it levitates — and can even steer itself." Loud sizzle + steam sound effect at the Leidenfrost point collapse (~0:30). Soft hissing vapour sound throughout.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D (cross-section diagram) + WebGL (top-down surface simulation). Key algorithm: lubrication theory model for the vapour film thickness h(r,t); Young-Laplace equation for droplet shape; axisymmetric finite-difference solve. For ratchet propulsion: asymmetric boundary condition on vapour flow. Gotcha: vapour film rupture (at Leidenfrost point) requires robust thin-film stability handling. Runtime: pre-rendered. Cross-section diagram is Canvas 2D animation, not a full NS solve.
