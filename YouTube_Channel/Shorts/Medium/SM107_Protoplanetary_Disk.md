---
title: "Protoplanetary Disk — Keplerian Shear"
id: SM107
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Planet_Formation_Full]]"
difficulty: medium
tags: [physics, simulation, short, astrophysics, orbital-mechanics, disk-dynamics, planet-formation]
---

> **What it is:** A ~45-second simulation short of a glowing orange-gold protoplanetary disk in Keplerian differential rotation, where a painted radial stripe is sheared into tight spiral arms, revealing the angular velocity gradient that drives angular momentum transport and planet formation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Planet_Formation_Full]]

# Short: Protoplanetary Disk — Keplerian Shear
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A glowing orange-gold disk of gas and dust swirls around a blazing young star. The inner edge spins in a blur while the outer edge barely crawls. A single radial stripe — like a painted mark on the disk — smears into a spiral arm in seconds, revealing the differential rotation tearing the disk apart.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Top-down view of a protoplanetary disk. Central star blazes white-yellow. Disk rendered with radial temperature gradient: inner edge orange-white (~1500 K), outer edge deep red-brown (~50 K). Keplerian velocity profile shown as arrow field — arrows longest near the star.
- **0:10–0:18:** A radial stripe of tracer particles (white dots) placed from r=0.1 to r=5 AU. Simulation runs. Inner particles race ahead; outer particles lag. The stripe curves into a spiral within 3 orbital periods. Angular velocity Ω(r) = √(GM/r³) shown for two radii side by side.
- **0:18–0:28:** Spiral arm formed by the sheared stripe evolves into a tightly wound Archimedean spiral. A zoom-out shows multiple spiral arms arising from multiple initial stripes — resembling actual disk spiral structures seen in ALMA observations.
- **0:28–0:38:** Differential rotation generates turbulent mixing — shown as the spiral arms becoming fuzzy, diffuse blobs. The Kelvin-Helmholtz instability triggers at the interface between fast and slow layers — rippling vortices form at 3–4 AU.
- **0:38–0:45:** Overlay with a real ALMA disk image (e.g., HL Tau style — concentric rings and gaps). Annotation: "Real disk rings may be cleared by forming planets." The star in the center brightens to a T Tauri flare.

## Physics Concept Teased
A protoplanetary disk orbits in Keplerian differential rotation: inner annuli orbit faster than outer annuli (Ω ∝ r^{-3/2}). Any initially radial structure shears into a trailing spiral. This Keplerian shear drives angular momentum transport, enables dust migration toward pressure maxima, and creates the velocity gradients that seed turbulence and planetesimal formation.

## On-Screen Text / Captions
- **0:00:** "The disk that built every planet in our solar system."
- **0:08:** "Inner orbit: fast. Outer orbit: slow."
- **0:15:** "Ω(r) = √(GM★ / r³)"
- **0:22:** "Keplerian shear winds everything into spirals"
- **0:30:** "Turbulence mixes dust and gas"
- **0:38:** "These gaps are where planets form."
- **0:44:** "Our solar system began exactly like this."

## End Card
Final 3 seconds: side-by-side of the simulation spiral and an ALMA disk image (public domain). Text: "Simulation matches reality." Channel logo.

## Audio
Warm, slow orbital ambient — low cello drone, distant chimes. Voiceover (calm, wonder-filled): "Inside this disk, every grain of dust is also a planet, waiting to be assembled." Subtle whooshing sound for disk rotation. Brief chime when the spiral first forms at 0:15.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D particle simulation. Key algorithm: N-body test-particle integration under central gravitational potential — each particle orbits at its Keplerian period T = 2π√(r³/GM★). Use 5000 particles on circular Keplerian orbits, initialized uniformly in r ∈ [0.5, 5] AU and θ ∈ [-10°, +10°] (the stripe). Integrate with simple Euler or Verlet in polar coordinates. Color particles by radius (orange inner, red outer). For ALMA comparison: download public-domain HL Tau ALMA image, overlay with alpha transparency. Gotcha: inner orbits will wrap many times — use modulo arithmetic on angle. Render at 60 fps, 1 simulation-second = 10 real-years for visual pacing.
