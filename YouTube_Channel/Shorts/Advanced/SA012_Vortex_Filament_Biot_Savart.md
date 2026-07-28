---
title: "Vortex Filament Method — Biot-Savart"
id: SA012
type: youtube-short
duration: "~45 seconds"
feeds_video: "Vortex Methods: Biot-Savart and Vortex Particle Simulation"
difficulty: advanced
tags: [physics, simulation, short, advanced, vortex-filament, biot-savart, vortex-method, fluid]
---

> **What it is:** A ~45-second simulation of vortex filament rings inducing velocity on each other via the Biot-Savart law -- two co-axial rings leap-frogging then undergoing a topological reconnection event. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Vortex Methods: Biot-Savart and Vortex Particle Simulation

# Short: Vortex Filament Method — Biot-Savart

**Feeds full video:** Vortex Methods: Biot-Savart and Vortex Particle Simulation

## Visual Hook (First 3 Seconds)
Two glowing cyan vortex rings (diameter 0.3 m, core radius 0.01 m) fly toward each other on a black background. They collide, stretch into a trefoil knot, then reconnect explosively in a shower of white sparks. "Biot-Savart at every point" in white text.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Single vortex ring visualised: N = 200 filament segments (cyan lines) connected head-to-tail forming the ring. Circulation Γ = 0.5 m²/s shown as label. Vorticity vector ω shown normal to each segment (gold arrows).
- **0:10** — Biot-Savart integral animated: a single evaluation point P (white dot, off-ring) lights up. From each of the 200 segments, a red arrow contributes dv = (Γ/4π) × (dl × r̂)/r². All arrows sum to give the velocity at P (large green arrow). Counter: "200 segments summed".
- **0:18** — Velocity field map: 2D slice through the ring plane. Induced velocity (blue streamlines) shown; ring interior pushes forward (red, v = +0.4 m/s), exterior pulls back (blue, v = −0.1 m/s). Classic vortex ring dipole pattern.
- **0:27** — Vortex reconnection sequence: two anti-parallel filaments approach (cyan and magenta). At distance < core radius, reconnection topology change happens — filaments swap partners (white flash). New topology shown in gold.
- **0:35** — Trefoil knot vortex: a pre-set trefoil (3-linked loop) propagates forward while writhing. Self-induced velocity from Biot-Savart drives its translation at 0.24 m/s. Knot slowly unravels over 2 s.
- **0:43** — Scaling panel: O(N²) direct Biot-Savart (red curve) vs O(N log N) fast multipole (blue curve). At N = 10,000 filaments: 2.1 s vs 0.04 s. "FMM makes it practical" caption.

## Physics Concept Teased
The vortex filament method represents the fluid's vorticity as a collection of Lagrangian curve segments, and integrates the Biot-Savart law to compute the velocity field induced by each filament on all others — giving a mesh-free, inherently divergence-free fluid simulation.

## On-Screen Text / Captions
- **0:00** — "Vortex rings. No grid. Biot-Savart." (white, top)
- **0:10** — "dv = (Γ/4π) dl × r̂ / r²" (gold, center panel)
- **0:18** — "Vortex ring induces its own translation" (white, bottom bar)
- **0:27** — "Reconnection changes topology" (white, center flash)
- **0:43** — "O(N²) → O(N log N) with FMM" (blue, bottom)

## End Card
Final 3 seconds: the trefoil ring glows and pulses. "CODED LAWS" in cyan. Subscribe. "Next: SPH Electromagnetics →" teaser.

## Audio
Ethereal sustained synth pad; sharp "snap" at reconnection event (0:27); Doppler whoosh as rings pass camera. 65 BPM slow ambient. No voiceover.

## Production Notes
Vortex filament simulator in Python. Ring discretisation: N=200 segments with Rosenhead-Moore regularised core (δ = 0.01 m). Time integration: 4th-order Runge-Kutta. FMM: FMM3D library (Flatiron Institute). Render: Blender 3D with emission shader on filament curves. Reconnection: distance-threshold swap algorithm.
