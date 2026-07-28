---
title: "Physics-Informed Neural Network: PDE Residual Loss"
id: SA127
type: youtube-short
duration: "~45 seconds"
feeds_video: "PINNs: Solving Differential Equations with Neural Networks"
difficulty: advanced
tags: [physics, simulation, short, advanced, pinn, physics-informed, neural-network, pde, scientific-ml]
---

> **What it is:** A ~45-second simulation showing a PINN solving the 2D Navier-Stokes equations by minimizing the PDE residual at interior collocation points and boundary-condition loss simultaneously without any mesh or training data. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** PINNs: Solving Differential Equations with Neural Networks

# Short: Physics-Informed Neural Network — PDE Residual Loss

**Feeds full video:** PINNs: Solving Differential Equations with Neural Networks

## Visual Hook (First 3 Seconds)
A 2D heat diffusion field (black background, red-to-cyan temperature gradient). A small neural network (5 nodes, glowing) takes position (x,y,t) as input and outputs temperature T. Comparison: FEM reference (orange) vs. PINN prediction (cyan) — they match exactly. Text: **"No grid. No mesh. Just physics."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — PINN architecture: 4-layer MLP (sin activation). Input: (x, y, t) — 3 scalars. Hidden: 64, 64, 64 neurons. Output: T(x,y,t) — 1 scalar. Total parameters: **"12,481."** Shown as clean network diagram with layer sizes.
- **0:10** — Loss function construction: L = L_PDE + L_BC + L_IC. L_PDE = ||∂T/∂t − α∇²T||² evaluated at 2000 collocation points (blue dots scattered in domain). L_BC = ||T_boundary − T_exact||² at 200 boundary points (orange dots on edges). L_IC = ||T(x,y,0) − T₀(x,y)||² at 500 initial points.
- **0:18** — Automatic differentiation: neural network forward pass shown. Then ∂T/∂x computed via autograd (chain rule through network). Then ∂²T/∂x² computed. PDE residual: r = ∂T/∂t − α(∂²T/∂x² + ∂²T/∂y²) visualized as color map. Initially: **"residual RMS = 1.23"** (red, inaccurate).
- **0:27** — Training: Adam optimizer, 50,000 iterations. Loss curves (log scale): L_PDE (red), L_BC (orange), L_IC (green), total L (white). All curves converge. At 50k steps: **"L_total = 3.2×10⁻⁵"**. PDE residual map: now nearly uniform dark blue (residual ≈ 0).
- **0:36** — Solution visualization: T(x,y,t) at t=0.1s, t=0.5s, t=1.0s. Three frames show diffusion spreading from hot corner (red = 100°C) across domain. PINN solution (cyan overlay) matches FEM ground truth to **"MAE = 0.04°C"** across 10,000 test points.
- **0:44** — Advantage: sparse data case. FEM needs 10,000 grid cells to solve. PINN solves same problem from **"50 boundary measurements"** + physics equations. Error: **"0.8%"** vs FEM's **"0.05%"** — but PINN required no grid generation (30 minutes saved).

## Physics Concept Teased
Physics-informed neural networks encode PDE residuals directly into the training loss: automatic differentiation computes spatial and temporal derivatives of the neural network output, allowing gradient-based optimization to enforce the governing equations at arbitrary collocation points — solving PDEs without mesh generation.

## On-Screen Text / Captions
- **0:00** — "A neural network that solves differential equations"
- **0:10** — "Loss = how much the output violates the physics"
- **0:20** — "Autograd: exact derivatives from a neural network"
- **0:30** — "50,000 training steps: residual drops to 3×10⁻⁵"
- **0:38** — "50 measurements + physics = full solution field"
- **0:45** — "PINN full tutorial → link in bio"

## End Card
Final 3 seconds: PDE residual color map (all dark blue, near zero) with PINN solution overlay. **"CodedLaws — Scientific ML"** text.

## Audio
Clean electronic progression at 72 BPM. Brief sine-wave tone (physics frequency) on each loss log. No voiceover.

## Production Notes
Renderer: PINN (Python/PyTorch). Network: 4×64 MLP, sine activation (SIREN-inspired). Optimizer: Adam lr=10⁻³, cosine annealing. Collocation: 2000 random interior, 200 boundary, 500 IC points. PDE: 2D heat equation ∂T/∂t = α·∇²T, α = 0.01 m²/s. Domain: [0,1]² × [0,1s]. FEM reference: FEniCS, 5000 elements. Output 1080×1920, 60 fps.
