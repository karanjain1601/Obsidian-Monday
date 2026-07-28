---
title: "Conformal Mapping: Joukowski Airfoil from a Circle"
id: SA031
type: youtube-short
duration: "~45 seconds"
feeds_video: "Complex Analysis in Fluid Mechanics: Conformal Mapping and Potential Flow"
difficulty: advanced
tags: [physics, simulation, short, advanced, conformal-mapping, joukowski, airfoil, potential-flow, complex-analysis]
---

> **What it is:** A ~45-second simulation of a unit circle in the complex plane conformally mapped through the Joukowski transform into an airfoil, with potential flow streamlines wrapping around it and the Kutta condition enforced. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Complex Analysis in Fluid Mechanics: Conformal Mapping and Potential Flow

# Short: Conformal Mapping — Joukowski Airfoil from Circle

**Feeds full video:** Complex Analysis in Fluid Mechanics: Conformal Mapping and Potential Flow

## Visual Hook (First 3 Seconds)
A glowing cyan circle (radius 1.1, centre at −0.1+0.1i) in the complex z-plane sits on the left half of a split screen. A gold Joukowski airfoil (chord 2.2, max thickness 12%, camber 4%) occupies the right half. A morphing animation blurs between them as the transform ζ = z + 1/z executes. "One equation. Circle to wing."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Complex plane setup: axes Re(z) and Im(z). Circle shown in cyan with centre offset (−0.1, 0.1) from origin, radius a = 1.1. Flow around circle: streamlines shown as white curves (potential flow with circulation Γ = 2.8 m²/s). Stagnation points marked as gold dots.
- **0:10** — Joukowski transform: ζ = z + λ²/z (λ = 1.0). Every streamline from the circle plane (cyan) maps to the airfoil plane (gold). The transformation shown as a continuous morph over 2 seconds. Trailing edge appears as the mapped backward stagnation point.
- **0:18** — Airfoil streamlines: flow at α = 6° angle of attack. Streamlines accelerate over upper surface (compressed, blue → gold), decelerate beneath (red → blue). Pressure coefficient C_p distribution shown below: suction peak −1.8 at leading edge upper surface (blue).
- **0:27** — Kutta condition: stagnation point moved to sharp trailing edge via circulation Γ = 4πU∞ a sin(α + β) = 2.8 m²/s. Shown as smooth departure from trailing edge — no flow around the sharp tip. "Kutta condition fixes Γ uniquely."
- **0:35** — Lift from Kutta-Joukowski: L = ρU∞Γ = 1.225 × 10 × 2.8 = 34.3 N/m. Numbers fill in. C_L = 0.68 shown. "No Navier-Stokes needed for lift in potential flow."
- **0:43** — Limitations panel: real NACA 0012 airfoil at α = 15° shows flow separation (red turbulent blob at trailing edge). "Conformal mapping: no viscosity, no separation."

## Physics Concept Teased
The Joukowski transformation maps potential flow around a cylinder — where the solution is trivially known — conformally onto flow around an airfoil, preserving the Laplace equation and producing exact lift via the Kutta-Joukowski theorem L = ρU∞Γ, with circulation Γ fixed uniquely by the Kutta condition at the sharp trailing edge.

## On-Screen Text / Captions
- **0:00** — "ζ = z + 1/z. Circle becomes wing." (white, top)
- **0:10** — "Conformal map preserves flow topology" (white, lower)
- **0:18** — "C_p = −1.8 at leading edge suction peak" (blue, annotation)
- **0:27** — "Kutta condition: Γ = 2.8 m²/s, uniquely" (gold, annotation)
- **0:35** — "L = ρU∞Γ = 34.3 N/m" (gold, equation fill)
- **0:43** — "Real flow: viscosity breaks everything" (red, bottom)

## End Card
Final 3 seconds: the Joukowski airfoil streamlines glow and the wing fades back to a circle. "CODED LAWS" in blue and gold. Subscribe. "Next: Godunov Shock Solver →" teaser.

## Audio
Elegant piano chord as circle morphs to airfoil; wind sound building as angle of attack increases; sharp stall sfx at 0:43. 80 BPM classical-electronic hybrid. No voiceover.

## Production Notes
Implementation: Python/NumPy complex arithmetic. Joukowski map: ζ = z + 1/z (λ=1). Circle: a = 1.1, centre (−0.1, 0.1). Potential flow: stream function Ψ = U∞ r sin(θ) − U∞ a²/r sin(θ) + Γ/(2π) ln(r). Streamlines via matplotlib contour on 500×500 grid. C_p from |dw/dz|² via chain rule. Animation: morphing via intermediate circles α ∈ [0,1].
