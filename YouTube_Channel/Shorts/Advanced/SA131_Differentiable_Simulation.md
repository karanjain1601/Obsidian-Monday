---
title: "Differentiable Simulation: Gradient Through Physics"
id: SA131
type: youtube-short
duration: "~45 seconds"
feeds_video: "Differentiable Physics: Backpropagating Through Simulation"
difficulty: advanced
tags: [physics, simulation, short, advanced, differentiable-simulation, gradient, autodiff, scientific-ml, inverse-problem]
---

> **What it is:** A ~45-second simulation showing gradients backpropagated through a differentiable MPM physics engine to optimize initial particle positions and velocities for a desired splash target using adjoint-mode automatic differentiation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Differentiable Physics: Backpropagating Through Simulation

# Short: Differentiable Simulation — Gradient Through Physics

**Feeds full video:** Differentiable Physics: Backpropagating Through Simulation"

## Visual Hook (First 3 Seconds)
An elastic ball launched from a cannon (grey). It hits a target (red X). But the first throw misses — by 2 meters. A glowing orange gradient arrow tells the cannon to adjust angle and velocity. Second throw: lands on the target. Text: **"Gradient through physics: 1 shot = 1 lesson."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Rigid body simulation: ball (orange, mass = 1 kg, radius = 0.1 m) launched at angle θ = 35° and v₀ = 12 m/s. Parabolic trajectory shown (white arc). Target at (x=8.0 m, y=0). Miss distance: **"Δx = 1.8 m"** shown as red gap.
- **0:10** — Computational graph: simulation as a directed acyclic graph. Each physics step (boxes in white) connected by arrows. Inputs: θ, v₀ (orange nodes). Output: landing position x_land (blue node). Backpropagation: ∂x_land/∂θ and ∂x_land/∂v₀ computed via chain rule through all 200 simulation steps.
- **0:18** — Gradient values: ∂x_land/∂θ = **"+0.34 m/deg"** (rotating cannon 1° increases range 0.34 m). ∂x_land/∂v₀ = **"+0.52 m/(m/s)"**. Gradient arrows shown at each node of the computation graph, colored orange (positive) or blue (negative).
- **0:27** — Optimization loop: gradient descent with learning rate α = 0.1. Iteration 0: θ=35°, v₀=12 → Δx=1.8m. Iteration 1: θ=36.8°, v₀=11.7 → Δx=0.9m. Iteration 5: θ=38.2°, v₀=11.2 → Δx=0.02m (hit!). Plot shows convergence curve: Δx vs. iteration, exponential decay.
- **0:36** — Rigid body contact: ball bounces on floor (elastic collision). During bounce: impulse applied (spike in force). Differentiating through contact: smooth approximation of contact force (sigmoid penalty, ε=0.01 m). Contact Jacobian: **"∂F_contact/∂x = 1000 N/m (stiff spring)."**
- **0:44** — Fluid control: inverse problem — given target vortex pattern (orange swirl), optimize inlet boundary velocity (unknown). Differentiable NS solver: gradient ∂J/∂u_inlet computed. After 100 gradient steps: inlet velocity optimized to produce target pattern. Label: **"Inverse CFD in 8 minutes vs. 3 days traditional."**

## Physics Concept Teased
Differentiable simulation treats physics engines as differentiable programs: automatic differentiation computes gradients of simulation outputs (positions, forces, flows) with respect to inputs (initial conditions, parameters, controls) — enabling gradient-based optimization of any physical system without analytical Jacobian derivation.

## On-Screen Text / Captions
- **0:00** — "What if your physics simulator could learn from mistakes?"
- **0:10** — "Each simulation step is a node in the computation graph"
- **0:20** — "Backprop: ∂landing/∂angle = 0.34 m/deg"
- **0:30** — "5 gradient steps: miss by 1.8 m → hit the target"
- **0:38** — "Inverse CFD: 8 minutes instead of 3 days"
- **0:45** — "Differentiable physics tutorial → bio"

## End Card
Final 3 seconds: convergence curve (Δx vs. iteration) with green star at iteration 5. **"CodedLaws — Differentiable Science"** text.

## Audio
Mechanical spring-loaded SFX at each launch. Electronic gradient descent tones descending in pitch. 80 BPM ambient. Impact chime at target hit.

## Production Notes
Renderer: differentiable rigid-body sim (Python/JAX + Brax). Autodiff: JAX forward/reverse mode. Projectile: RK4 integration, 200 steps dt=0.01s. Contact: signed distance function + penalty force. Fluid inverse: 2D NS (JAX-CFD), ∂J/∂u via vjp. Optimization: Adam on θ,v₀ and u_inlet respectively. Output 1080×1920, 60 fps.
