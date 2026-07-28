---
title: "Cross-Diffusion — Unexpected Pattern Formation"
id: SM155
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, reaction-diffusion, cross-diffusion, pattern-formation, turing-extension]
---

> **What it is:** A ~45-second simulation short where a uniform mixture of two mutually repelling species spontaneously segregates into alternating stripes with no chemical reactions present, demonstrating that off-diagonal cross-diffusion terms in the generalised Fick's law are alone sufficient to drive Turing-like spatial pattern formation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Cross-Diffusion — Unexpected Pattern Formation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A mixed solution of two chemicals — no reaction, just two species that repel each other spatially (cross-diffusion). Starting from a uniform mix, the two species spontaneously segregate into alternating stripes — Turing-like patterns, but without any chemical reaction. Pure diffusion creates order from chaos.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Cross-diffusion: the diffusion flux of species u depends not only on ∇u (self-diffusion) but also on ∇v (cross-diffusion). Fick's law extended: J_u = -D_uu·∇u - D_uv·∇v; J_v = -D_vu·∇u - D_vv·∇v. If D_uv < 0: species u moves up the gradient of v (repulsion). Caption: "Cross-diffusion: J_u = -D_uu∇u - D_uv∇v — u flees v."

**0:10–0:18** — Cross-diffusion instability: even without reactions (f=g=0), cross-diffusion can cause Turing-like patterns. The dispersion relation from the cross-diffusion matrix: instability at wavenumber k* when det(D·k²-J) < 0 for some k. Caption: "No reactions needed — cross-diffusion alone creates patterns." This is more surprising than the standard Turing instability.

**0:18–0:27** — Ecological example: two species competing for territory. Each species avoids high densities of the other (cross-diffusion). Shigesada-Kawasaki-Teramoto (SKT) model (1979): ∂u/∂t = ∇·[(d₁ + 2α₁₁u + α₁₂v)∇u + α₁₂u∇v] + f(u,v). Caption: "SKT model: two species avoid each other → striped territories." Spatial segregation in competing species.

**0:27–0:36** — Laboratory example: two polymers in a shared solvent. The cross-diffusion coefficients D_uv and D_vu can be measured by Taylor dispersion. When they are sufficiently large and negative: spontaneous phase separation (even without thermodynamic driving). Caption: "Polymer blends: large D_uv → unexpected phase separation." Compares to Cahn-Hilliard (SM010) but different mechanism.

**0:36–0:45** — Mathematics: the cross-diffusion Turing space is larger than standard Turing space — patterns can form even when the reaction Jacobian has no Turing instability by itself. Cross-diffusion is a "pattern enhancer." Caption: "Cross-diffusion: expands Turing space — more robust patterns." Bold text: "Cross-diffusion — patterns without chemistry." Fade to black.

## Physics Concept Teased
Cross-diffusion: the generalisation of Fick's law where the flux of species u depends on gradients of both u and v via an off-diagonal diffusion matrix. Negative cross-diffusion (mutual repulsion) can drive Turing-like spatial instabilities even without chemical reactions. The SKT ecological model shows spatial segregation of competing species from cross-diffusion alone.

## On-Screen Text / Captions
- **0:00** — "Two chemicals repel each other — patterns without reactions."
- **0:05** — "J_u = -D_uu∇u - D_uv∇v — cross-diffusion"
- **0:12** — "No reactions: cross-diffusion alone creates Turing patterns"
- **0:20** — "SKT (1979): competing species → striped territories"
- **0:28** — "Polymer blends: D_uv drives unexpected phase separation"
- **0:35** — "Cross-diffusion expands Turing pattern space"
- **0:43** — "Cross-diffusion — patterns from repulsion alone."

## End Card
Final 3 seconds: two-species spatial distribution — clear alternating stripes of u (red) and v (blue) with no mixing at the interfaces. Text: "Cross-diffusion patterns have been proposed as a mechanism for animal territory formation and ecosystem spatial structure." CodedLaws logo.

## Audio
Gentle separation sound as two species drift apart. Voiceover at 0:00: "Two species that simply avoid each other — no reactions, no competition — spontaneously organise into striped territories through cross-diffusion alone." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL. Key algorithm: cross-diffusion PDE with the SKT diffusion tensor. ∂u/∂t = ∇·[D(u,v)·∇u + E(u,v)·∇v] + f(u,v). For pure cross-diffusion instability: f=g=0 (no reactions). D matrix = [[D_uu, D_uv], [D_vu, D_vv]] with D_uv, D_vu < 0. Solve with semi-implicit or spectral method (Fourier in space, Crank-Nicolson in time). For SKT: use full SKT Jacobian, check Turing conditions numerically (compute eigenvalues of diffusion matrix × k² - Jacobian for each k). Colour: u=red, v=blue. Runtime: WebGL fragment shader for 256×256, real-time.
