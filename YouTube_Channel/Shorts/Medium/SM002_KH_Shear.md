---
title: "Kelvin-Helmholtz Shear Vortices"
id: SM002
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, instability, kelvin-helmholtz]
---

> **What it is:** A ~45-second simulation showing two fluid layers sliding past each other in opposite directions, growing sinusoidal waves that roll up into spiraling cat's-eye vortices — demonstrating the Kelvin-Helmholtz shear instability. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Kelvin-Helmholtz Shear Vortices

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Two fluid layers slide past each other horizontally — dark teal on top moving right, warm orange on the bottom moving left. The velocity difference is labeled with opposing arrows. At exactly 2 seconds the flat interface buckles into a wave and the screen cuts to full-screen rolling vortices.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — A sinusoidal wave grows at the shear interface. The amplitude of the most unstable mode (wavenumber k = 2π/λ) doubles every ~1.5 simulation seconds. A small inset graph shows amplitude vs time on a log scale — straight line.

**0:10–0:18** — Waves roll over into coherent cat's-eye vortices. The teal and orange fluids wrap around each other in tight spirals. Particle tracer dots (white) show closed elliptical orbits inside each vortex core.

**0:18–0:27** — Vortex pairing event: two neighboring vortices merge into one larger vortex — an inverse cascade of energy to larger scales. Timestamp annotation: "vortex pairing = energy inverse cascade."

**0:27–0:36** — Camera (viewport) pans across five merged vortices, showing the periodic row. Velocity magnitude colour-map (blue=slow, red=fast) reveals high-speed strains between vortex cores.

**0:36–0:45** — Simulation slows to 0.1× speed. One vortex highlighted with a dashed ellipse. Text box: "Richardson number Ri < 0.25 → unstable." Fade to black.

## Physics Concept Teased
Kelvin-Helmholtz instability: when two fluid layers shear past each other (e.g., wind over water), any small perturbation at the interface grows, rolling up into beautiful spiral vortices. The Richardson number Ri = N²/S² determines whether stratification can suppress the roll-up.

## On-Screen Text / Captions
- **0:00** — "Two fluids. Different velocities."
- **0:03** — "The interface is unstable."
- **0:12** — "Cat's-eye vortices form"
- **0:20** — "Vortex pairing — energy climbs to larger scales"
- **0:30** — "Richardson number Ri < 0.25"
- **0:38** — "This is Kelvin-Helmholtz instability"
- **0:44** — "You've seen it in clouds."

## End Card
Final 3 seconds: split-screen — simulation on left, real photo of Kelvin-Helmholtz clouds on right. CodedLaws logo bottom-centre. Caption: "Nature runs the same code."

## Audio
Mid-tempo electronic ambient (90 BPM), soft arpeggiated synth. Voiceover at 0:00: "Two fluids, one moving faster than the other — the interface between them can't stay flat." Wind-rush sound effect as vortices roll over (~0:10). No other SFX.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or p5.js. Key algorithm: 2D incompressible Navier-Stokes with a shear-layer initial condition (tanh velocity profile), pseudo-spectral solver, periodic boundary conditions. Resolution: 256×256 adequate. Gotcha: if viscosity is too high the instability is damped before rolling up — use Re > 10,000 (near-inviscid). Vortex pairing timing depends on domain width; use domain Lx = 2λ_max to guarantee one pairing event in the clip. Runtime: real-time at 60 fps with WebGL, or pre-rendered.
