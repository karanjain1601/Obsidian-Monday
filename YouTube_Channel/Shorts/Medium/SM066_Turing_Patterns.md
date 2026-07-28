---
title: "Reaction-Diffusion — Turing Patterns"
id: SM066
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, reaction-diffusion, turing-patterns, activator-inhibitor, pattern-formation, biology]
---

> **What it is:** A ~45-second simulation short where evenly spaced cheetah-like spots spontaneously emerge from random noise as two chemical species react and diffuse at different rates, demonstrating Turing's diffusion-driven instability where a faster-diffusing inhibitor destabilises the uniform state and sets the pattern wavelength. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Reaction-Diffusion — Turing Patterns

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A uniform tan canvas — then spots appear from nowhere. Dark brown circles on a tan background, evenly spaced, regular — like a cheetah's spots or a giraffe's patches. They emerged spontaneously from pure random noise and two chemical species reacting and diffusing.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Turing system: activator u (promotes its own production) and inhibitor v (suppresses activator). Equations: ∂u/∂t = D_u∇²u + f(u,v); ∂v/∂t = D_v∇²v + g(u,v). Key condition for pattern formation: D_v >> D_u (inhibitor diffuses much faster than activator). Caption: "Fast inhibitor + slow activator → patterns."

**0:10–0:18** — Linear stability analysis visualised: the homogeneous steady state (u₀, v₀) is stable without diffusion. With diffusion — the dispersion relation shows certain wavenumbers k become unstable (σ(k) > 0). The most unstable mode k* sets the pattern wavelength. Caption: "Turing instability: diffusion destabilises."

**0:18–0:27** — Pattern evolution from random initial conditions: at t=0 random noise. At t=100: faint proto-spots. At t=500: clear spots fully formed. At t=2000: stable equilibrium pattern. The spots arrange into a near-hexagonal lattice. Caption: "Spots → stripe → labyrinth by changing parameters."

**0:27–0:36** — Parameter sweep: D_u/D_v ratio increased. Pattern transitions: spots (small D_u/D_v) → labyrinthine stripes (intermediate) → holes/anti-spots (large). Each change shown in rapid succession. Caption: "Morphospace: spots, stripes, labyrinths — one parameter."

**0:36–0:45** — Real biology: side-by-side — cheetah spots, zebra stripes, shell patterns, fish skin colour. Each matched to the corresponding Turing parameter regime. Caption: "Turing, 1952: animals' patterns emerge from chemistry." Bold text: "Alan Turing — computing AND biology." Fade to black.

## Physics Concept Teased
Turing instability: the homogeneous steady state of an activator-inhibitor system is stable in the absence of diffusion, but becomes unstable when diffusion is added — because the inhibitor diffuses faster than the activator. The unstable modes spontaneously grow from noise to produce patterns whose wavelength is set by the ratio of diffusion coefficients and reaction rates.

## On-Screen Text / Captions
- **0:00** — "Random noise → spots. No template."
- **0:05** — "D_v >> D_u: fast inhibitor, slow activator"
- **0:12** — "Turing instability: diffusion makes it unstable"
- **0:20** — "Pattern forms at the most unstable wavenumber k*"
- **0:28** — "One parameter sweep: spots → stripes → holes"
- **0:35** — "Cheetah, zebra, shell — Turing patterns in nature"
- **0:43** — "Alan Turing, 1952 — morphogenesis."

## End Card
Final 3 seconds: Turing spots next to a cheetah photograph — same pattern at different scales. Text: "Turing published this in 1952 — just 2 years before his death." CodedLaws logo.

## Audio
Quiet, natural ambient — distant bird calls, light breeze. Voiceover at 0:00: "A cheetah's spots, a zebra's stripes — these emerge spontaneously from two chemicals reacting and diffusing at different speeds." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL. Key algorithm: solve 2D reaction-diffusion PDEs using finite differences (forward Euler or semi-implicit for stability). Standard Gierer-Meinhardt model: f(u,v) = a - bu + u²/v; g(u,v) = u² - v. Alternatively: Schnakenberg model. Grid: 200×200. Parameters: D_u = 0.0002, D_v = 0.01, a = 0.028, b = 0.5 for spots. Initial conditions: uniform steady state + small random perturbations. Each display frame = 100 reaction-diffusion steps. Gotcha: Euler time step stability requires Δt < Δx²/(2D_v) — tight constraint for large D_v. Use semi-implicit scheme or Δx > 0.01. Runtime: real-time WebGL fragment shader.
