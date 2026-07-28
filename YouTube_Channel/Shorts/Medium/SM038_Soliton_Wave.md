---
title: "Soliton — Wave Maintaining Shape Through Collision"
id: SM038
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, waves, soliton, nonlinear-dynamics, KdV]
---

> **What it is:** A ~45-second simulation short sending two KdV solitons through each other in a shallow canal, demonstrating that these self-reinforcing wave pulses pass through one another completely unchanged except for a tiny position phase shift. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Soliton — Wave Maintaining Shape Through Collision

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A shallow canal cross-section. A tall, sharp solitary wave pulse (glowing blue) races from left to right, maintaining its shape perfectly. A second, taller soliton comes from the right. They approach each other — and in a stunning display, they pass right through each other and emerge unchanged on the other side.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The KdV equation: u_t + 6uu_x + u_xxx = 0. Two competing terms: nonlinearity (6uu_x: tall waves travel faster, would steepen) vs. dispersion (u_xxx: shorter wavelengths travel slower, would spread). The soliton is the exact balance. Caption: "Nonlinearity vs. dispersion — balanced."

**0:10–0:18** — Soliton solution shown: u(x,t) = (c/2) sech²(√(c/2)(x - ct)). The sech² profile shown graphically — bell-shaped, symmetric, amplitude proportional to speed. Taller soliton travels faster. Two solitons approaching from opposite sides.

**0:18–0:27** — Collision event at slow-motion: the two solitons merge into a single peak (temporarily), then separate — each soliton emerges with exactly its original shape and speed, but shifted slightly in position (the "phase shift" from the collision). Caption: "Phase shift after collision — the only effect."

**0:27–0:36** — Phase shift measurement: dashed vertical lines show expected positions without collision vs. actual positions after. The taller soliton is shifted forward; the shorter soliton is shifted backward. Graph: phase shift vs. amplitude ratio — exact analytic formula shown.

**0:36–0:45** — Real-world connection: John Scott Russell, 1834 — observed a wave in the Union Canal that maintained its shape for miles. "The great solitary wave." Simulation shows a wave packet vs. a soliton: the wave packet disperses; the soliton doesn't. Bold text: "Solitons — waves that never spread." Fade to black.

## Physics Concept Teased
Solitons: exact nonlinear wave solutions of the KdV equation that maintain shape, speed, and amplitude indefinitely. When two solitons collide they pass through each other intact, with only a phase shift. This integrability is due to an infinite set of conserved quantities — the KdV equation is exactly solvable via the inverse scattering transform.

## On-Screen Text / Captions
- **0:00** — "A wave that never spreads."
- **0:05** — "KdV: u_t + 6uu_x + u_xxx = 0"
- **0:12** — "u = (c/2)sech²(√(c/2)(x-ct))"
- **0:20** — "Collision: merge, separate — shapes intact"
- **0:28** — "Phase shift: the only effect of collision"
- **0:35** — "J.S. Russell, 1834: observed soliton in a canal"
- **0:43** — "Solitons — perfectly elastic wave collisions."

## End Card
Final 3 seconds: the two solitons post-collision, moving apart on a calm water surface. Text: "Optical fibre solitons carry internet data across oceans." CodedLaws logo.

## Audio
Flowing, hypnotic electronic (80 BPM). Soft "whoosh" as each soliton passes. During the collision: a brief musical chime (merging). After separation: the whooshes resume unchanged. Voiceover at 0:00: "In 1834, a Scottish engineer watched a wave travel 8 miles down a canal without spreading — he'd found a soliton." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (1D wave profile). Key algorithm: KdV equation solved with a pseudo-spectral method (FFT) or finite-difference with operator splitting: advection step + dispersion step. Initial conditions: two sech² solitons with different amplitudes/speeds. Phase shift computed by tracking peak positions before and after collision. Alternatively: use exact 2-soliton solution from inverse scattering theory for a clean analytic simulation. Runtime: real-time, 1D simulation is very cheap.
