---
title: "Elastic Waves — P-Wave and S-Wave Propagation"
id: SM091
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, seismology, elastic-waves, P-wave, S-wave, wave-propagation]
---

> **What it is:** A ~45-second simulation short where a seismic point source in a 2D elastic medium launches a faster blue compressional P-wave ring and a slower red shear S-wave ring, with seismogram arrival times demonstrating the natural early-warning window between the two wave types for earthquake alerts. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Elastic Waves — P-Wave and S-Wave Propagation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A grey elastic medium — a 2D cross-section of Earth's crust. A point source of seismic energy explodes at the centre. In 3 seconds two rings expand outward — the outer ring (the P-wave) is faster, shown in blue-white. The inner ring (the S-wave) trails behind, shown in red-orange.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Elastic wave equations: P-wave speed Vp = √((λ+2μ)/ρ); S-wave speed Vs = √(μ/ρ). P-waves: compressional (longitudinal) — particle motion parallel to wave propagation. S-waves: shear (transverse) — particle motion perpendicular. Caption: "P: compression; S: shear. Vp > Vs always."

**0:10–0:18** — Particle motion visualised: zoom into the P-wave front — particles oscillate forward and backward along the wave direction. Zoom into the S-wave front — particles oscillate up and down perpendicular to the wave direction. Caption: "P: longitudinal. S: transverse."

**0:18–0:27** — Seismogram: a seismograph station at distance r from the source. The seismogram (displacement vs time) shows: first arrival = P-wave (sharp spike), then quiet (S-wave shadow zone gap), then S-wave arrival (larger amplitude). Caption: "S-P time = r/Vp - r/Vs → source distance." The Δt = r(1/Vs - 1/Vp) formula shown.

**0:27–0:36** — Layer boundary: the medium has a fast lower layer. Waves hit the boundary — some reflect, some refract. A head wave (refracted P-wave) runs along the boundary at the lower Vp and arrives at the surface before the direct wave for distances beyond a critical offset. Caption: "Head wave: fastest path via fast layer."

**0:36–0:45** — Application: earthquake early warning. When sensors detect a P-wave, they have Δt seconds before the destructive S-wave arrives. Δt = r(1/Vs - 1/Vp) ≈ r/10 seconds for r in km. Caption: "P-wave warning: r/10 seconds before shaking." Bold text: "Elastic waves — seismology's two messengers." Fade to black.

## Physics Concept Teased
Elastic wave propagation in a solid: P-waves (compressional, Vp = √((λ+2μ)/ρ)) and S-waves (shear, Vs = √(μ/ρ)) propagate at different speeds. Vp > Vs always, giving a natural early-warning window. S-waves carry more energy and cause most earthquake damage. The S-P time interval at a seismograph gives the source distance.

## On-Screen Text / Captions
- **0:00** — "Two elastic waves — one faster, one deadlier."
- **0:05** — "Vp = √((λ+2μ)/ρ); Vs = √(μ/ρ) — Vp > Vs"
- **0:12** — "P: longitudinal (compression). S: transverse (shear)."
- **0:20** — "Seismogram: P arrives first, S later (larger)"
- **0:28** — "Δt = r(1/Vs - 1/Vp) → source distance"
- **0:35** — "P-wave warning: Δt = r/10 s before shaking"
- **0:43** — "Elastic waves — seismology's messengers."

## End Card
Final 3 seconds: the P and S wave rings expanding in the elastic medium. Text: "Japan's earthquake early warning system gives 10–30 seconds of alert using this principle." CodedLaws logo.

## Audio
Rumbling deep bass (earthquake) at the source. Two distinct sounds: a sharp click (P-wave) followed by a lower, more sustained thud (S-wave). Voiceover at 0:00: "An earthquake sends out two types of waves — a fast compressional P-wave and a slower, more destructive S-wave shear wave." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D or WebGL. Key algorithm: 2D elastic wave equation solved with a staggered-grid finite-difference scheme (Virieux 1986). Stresses σ_xx, σ_yy, σ_xy on staggered grids; velocities vx, vy on primal grid. Update velocity from stress divergence; update stress from velocity gradients. P-wave: divergence component (colour-coded blue). S-wave: curl component (colour-coded red). Boundary conditions: absorbing boundaries (perfectly matched layer — PML). Source: Ricker wavelet at centre cell. Seismogram: record vx(t) at a fixed station. Runtime: real-time for 256×256 grid with Canvas 2D; GPU for larger.
