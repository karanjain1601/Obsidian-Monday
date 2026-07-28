---
title: "Adjoint Method — Sensitivity Gradient Visualisation"
id: SM060
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, adjoint-method, optimisation, sensitivity, computational-physics]
---

> **What it is:** A ~45-second simulation short where a sensitivity heatmap blazes over a 2D airfoil surface — computed from just two PDE solves instead of 1,000 finite-difference runs — then guides 50 gradient-descent steps that reshape the wing and cut drag by 30%. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Adjoint Method — Sensitivity Gradient Visualisation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D airfoil with a complex flow field around it. The drag force is displayed: D = 1.24 N. Then a sensitivity heatmap appears over the airfoil surface — where should we reshape the airfoil to reduce drag? Red = "moving this point increases drag." Blue = "moving outward here reduces drag." The optimal redesign becomes obvious.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The naive approach: perturb each surface point by ε, rerun the CFD simulation, measure ΔD. For N=1000 surface points, this requires 1000 CFD simulations. Time: 10,000 hours. Caption: "Finite difference: N simulations needed."

**0:10–0:18** — The adjoint approach: solve the flow equations once (forward solve). Then solve the adjoint equations once (backward solve — the linearised transposed equations). From these two solutions, compute dD/dx_i for ALL surface points simultaneously. Caption: "Adjoint: 2 solves → gradient for ALL parameters."

**0:18–0:27** — Adjoint field visualised: a complementary flow field that illuminates sensitivities. Where the adjoint field is large and aligned with the surface normal — that's where shape change matters most. The sensitivity colour-map over the airfoil surface. Caption: "Adjoint field: the hidden gradient map."

**0:27–0:36** — Gradient descent optimisation: the airfoil shape is deformed by moving each surface point in the direction of decreasing drag. 50 optimisation steps shown as a time-lapse. The airfoil morphs: leading edge becomes more rounded, trailing edge thinner. Drag drops from 1.24 N to 0.87 N. Caption: "30% drag reduction — 50 adjoint cycles."

**0:36–0:45** — Applications: aircraft wing optimisation, race car aerodynamics, wind turbine blade design, heat exchanger topology. All share the same adjoint method. Bold text: "Adjoint method — how modern aerodynamics is designed." Fade to black.

## Physics Concept Teased
Adjoint method: for a system with N design parameters and one objective function, the adjoint approach computes the gradient ∂J/∂x_i for all N parameters with just two PDE solves (forward + adjoint) instead of N+1. It enables efficient gradient-based optimisation of complex physics systems.

## On-Screen Text / Captions
- **0:00** — "Which surface change reduces drag the most?"
- **0:05** — "Finite difference: 1000 CFD runs needed"
- **0:12** — "Adjoint: 2 solves → all 1000 sensitivities"
- **0:20** — "Adjoint field: the hidden gradient map"
- **0:28** — "50 gradient steps → 30% drag reduction"
- **0:35** — "Wings, cars, turbines — designed by adjoint"
- **0:43** — "Adjoint method — gradient in one backward pass."

## End Card
Final 3 seconds: optimised airfoil (elegant, smooth) vs. original. Text: "Every commercial aircraft uses adjoint-optimised airfoils." CodedLaws logo.

## Audio
Technical, focused electronic (85 BPM). Quiet whoosh of air around the airfoil. Voiceover at 0:00: "Computing the sensitivity of drag to every surface point sounds expensive — the adjoint method does it in two simulations." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL (flow visualisation). Key algorithm: 2D potential flow adjoint (simpler than full NS): forward solve — panel method for flow around airfoil, compute lift/drag. Adjoint solve — transpose the Jacobian, solve for adjoint vector λ = (∂R/∂u)^{-T} ∂J/∂u. Sensitivity: dJ/dx = ∂J/∂x + λ^T ∂R/∂x. Visualise adjoint field as streamlines. For full CFD: use discrete adjoint of Euler/RANS equations — computationally identical structure. Optimisation: steepest descent with fixed step size on shape variables. Gotcha: adjoint boundary conditions are non-trivial — opposite flow direction, different far-field conditions. Runtime: pre-rendered for the full 50-step optimisation; real-time for panel method demo.
