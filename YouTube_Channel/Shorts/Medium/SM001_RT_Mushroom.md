---
title: "Rayleigh-Taylor Mushroom Cloud"
id: SM001
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, instability, rayleigh-taylor]
---

> **What it is:** A ~45-second simulation showing a dense fluid layer falling into a lighter one, spontaneously sprouting the classic Rayleigh-Taylor mushroom caps — demonstrating density-driven gravitational instability. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Rayleigh-Taylor Mushroom Cloud

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black background. A dense violet fluid layer rests atop a lighter amber fluid layer, separated by a razor-thin horizontal interface. In the first 3 seconds tiny sinusoidal bumps appear along that interface — then a single mushroom-cap tendril suddenly plunges downward and the screen flashes white.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Three distinct mushroom caps bloom in violet against the amber background. They stretch vertically, each cap glowing brighter at its rounded tip. The thin stems connecting cap to the bulk fluid are visible and slightly transparent.

**0:10–0:18** — Secondary Kelvin-Helmholtz vortices spiral along the sides of each stem, rolling into clockwise and counter-clockwise curls. Annotation arrow points to one curl: "secondary KH rolls."

**0:18–0:27** — Caps begin to merge as neighboring mushrooms collide. Color hue shifts from violet to deep magenta where mixing occurs. A colour-bar on the right maps fluid concentration from 0 (amber) to 1 (violet).

**0:27–0:36** — Broad plumes reach the bottom boundary. Lighter amber spikes (called "bubbles") simultaneously rise into the upper violet layer. The simulation shows the symmetric counter-flow: spikes down, bubbles up.

**0:36–0:45** — Final turbulent mixed state: chaotic swirls of purple-amber fractal mixing. Frame freezes and a bold annotation reads "Atwood number A = 0.5." Fade to black.

## Physics Concept Teased
Rayleigh-Taylor instability: a dense fluid sitting above a lighter one is unstable to any infinitesimal perturbation. The interface buckles and spike-and-bubble structures grow exponentially at rate σ ∝ √(Akg) where A is the Atwood number, k is the wavenumber, and g is gravity.

## On-Screen Text / Captions
- **0:00** — "Dense fluid on top of lighter fluid…"
- **0:03** — "Unstable."
- **0:10** — "Secondary vortices form along the stems"
- **0:20** — "Growth rate σ ∝ √(A·k·g)"
- **0:28** — "Bubbles rise, spikes fall — simultaneously"
- **0:40** — "Atwood number A = 0.5"
- **0:44** — "This is Rayleigh-Taylor instability"

## End Card
Final 3 seconds: CodedLaws logo pulses on black background. Text: "Full fluid sim breakdown — link in bio." Looping thumbnail of the mushroom caps displayed in corner.

## Audio
Slow, deep ambient drone (60–70 BPM, minor key). Single voiceover line at 0:03: "When a heavy fluid sits above a lighter one, gravity makes it snap." Subtle liquid-drip sound effect each time a mushroom cap forms (~0:05, 0:07, 0:09).

## Production Notes
Code complexity: complex. Renderer: WebGL (fragment shader) or Canvas 2D with a pseudo-spectral incompressible Euler solver. Key algorithm: 2D Boussinesq approximation with a passive scalar for concentration; FFT-based pressure solver; 4th-order Runge-Kutta time stepping. Grid: 512×512 minimum for clean mushroom features. Gotcha: numerical diffusion can prematurely stabilize the interface — use high-order advection (WENO5) or a spectral scheme. Runtime: pre-rendered at 60 fps, exported as MP4.
