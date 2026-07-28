---
title: "Brusselator — Chemical Limit Cycle"
id: SM086
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chemical-oscillator, brusselator, limit-cycle, hopf-bifurcation, pattern-formation]
---

> **What it is:** A ~45-second simulation short where a two-variable reaction-diffusion field pulses rhythmically between blue and yellow in periodic chemical oscillations before breaking into spiral and target waves, demonstrating the Brusselator's Hopf bifurcation and Prigogine's dissipative pattern formation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Brusselator — Chemical Limit Cycle

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D colour-map: activator concentration u shown in blue-to-yellow. The field pulses rhythmically — the entire domain oscillating between blue and yellow in a regular tempo, then breaking into spatial oscillations with beautiful spiral and target waves.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Brusselator model: ∂u/∂t = D_u∇²u + a - (b+1)u + u²v; ∂v/∂t = D_v∇²v + bu - u²v. Parameters: a (feed), b (decay). Fixed point: (u₀, v₀) = (a, b/a). Stability: fixed point is stable for b < 1 + a² and unstable (limit cycle) for b > 1 + a². Caption: "Hopf bifurcation at b = 1 + a²."

**0:10–0:18** — Well-mixed system (no spatial diffusion): time series of u(t) and v(t). Below the Hopf bifurcation (b=1.5, a=1): spiralling into fixed point. Above (b=3): stable limit cycle oscillation — u and v oscillate periodically. Phase portrait shows the limit cycle clearly. Caption: "b < 1+a²: fixed point; b > 1+a²: limit cycle."

**0:18–0:27** — Spatial Brusselator: add diffusion. Two types of patterns possible: (1) Turing patterns (D_v >> D_u): stationary spots and stripes. (2) Hopf patterns (temporal oscillations): spatially uniform pulsing. (3) Both: travelling waves and spirals. Caption: "Spatial: Turing (static) + Hopf (oscillating) = travelling waves."

**0:27–0:36** — Spiral waves in the Brusselator: a spiral wave initiates from a broken wave front. The spiral rotates with period T equal to the local oscillation period. Multiple spirals shown interacting. Caption: "Spirals: Hopf + spatial coupling." Compare to BZ reaction (SM068).

**0:36–0:45** — Historical context: named "Brusselator" by Prigogine's group at the Free University of Brussels. First chemical model showing spontaneous oscillation in a thermodynamic framework. Ilya Prigogine won the 1977 Nobel Prize (Chemistry) for non-equilibrium thermodynamics. Caption: "Prigogine, Nobel 1977 — dissipative structures." Bold text: "Brusselator — oscillation and pattern from chemistry." Fade to black.

## Physics Concept Teased
Brusselator: a two-variable reaction-diffusion model with a Hopf bifurcation at b = 1 + a². Above the bifurcation, the well-mixed system oscillates as a chemical clock. With spatial diffusion, the system supports Turing patterns, wave patterns, and spiral waves — a prototypical example of Prigogine's "dissipative structures."

## On-Screen Text / Captions
- **0:00** — "A chemical model of a clock — and pattern formation."
- **0:05** — "Brusselator: Hopf bifurcation at b = 1 + a²"
- **0:12** — "b > 1+a²: stable limit cycle oscillation"
- **0:20** — "Spatial: Turing (static) + Hopf (oscillating)"
- **0:28** — "Spiral waves from broken wave fronts"
- **0:35** — "Prigogine, Nobel 1977 — dissipative structures"
- **0:43** — "Brusselator — chemical oscillation meets patterns."

## End Card
Final 3 seconds: the spatial Brusselator showing beautiful target and spiral waves in blue-gold. Text: "Dissipative structures: order from chaos — far from equilibrium." CodedLaws logo.

## Audio
Chemical laboratory ambient (soft bubbling). Rhythmic pulse sound matching the Brusselator oscillation period. Voiceover at 0:00: "The Brusselator is the simplest chemical system that oscillates — and with diffusion, it generates spiral waves." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: WebGL or Canvas 2D. Key algorithm: explicit Euler on 2D grid for the Brusselator PDEs. D_u = 0.5, D_v = 5 (for Turing); D_u = D_v = 1 (for uniform oscillation). Hopf bifurcation parameter: b = 3.5, a = 1 (above critical b_c = 2). Boundary conditions: periodic or Neumann. Initial conditions: fixed point + small noise. For spiral: break a planar wave front manually. Colour-map: u → blue (low) to yellow (high). Runtime: real-time WebGL fragment shader for 256×256 grid.
