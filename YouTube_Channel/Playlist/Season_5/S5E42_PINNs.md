---
title: "I Trained a Neural Net to Solve the Heat Equation. It Cheated."
season: 5
episode: 42
difficulty: 8/10
concept: "Physics-Informed Neural Networks (PINNs)"
prereq: "E41 (differentiable sim) + E22 (heat equation to understand what's being solved)"
tags: [PINNs, physics-informed-neural-networks, heat-equation, deep-learning, JAX, PyTorch, scientific-ML, meshless-PDE, neural-PDE]
type: playlist-video
---

## S5·E42 — "I Trained a Neural Net to Solve the Heat Equation. It Cheated."

- **Alt title:** "PINNs: When Your Neural Net Knows Physics Before It Sees Any Data"
- **Difficulty:** 8/10 · **Prereq:** E41 (differentiable sim) + E22 (heat equation to understand what's being solved)
- **Hook:** A neural net that solves the heat equation without any mesh, any grid, any timestep — just sampled points in space-time — and its solution generalizes to boundary conditions the training data never contained.
- **The break (bug):** Without the physics residual loss term (enforcing `∂u/∂t - α∇²u = 0` at collocation points), the network fits only the sampled training points and completely fails at interpolation, producing non-physical temperature distributions that don't satisfy the heat equation anywhere except at the training data.
- **Concept introduced:** Physics-Informed Neural Networks (PINNs). A PINN approximates the solution `u(x,t)` as a neural network. Total loss = data loss (match boundary and initial conditions at sampled points) + physics loss (residual of the PDE at collocation points). The network is simultaneously trained to fit data and satisfy the physics equation everywhere.
- **Push it / wow moment:** PINN solving 2D steady Navier-Stokes around a cylinder. Compare to finite-difference ground truth — nearly identical for laminar flow. Drag the cylinder to a new position — the PINN re-solves in milliseconds. Show where it fails at high Reynolds number.
- **Demo:** Draw arbitrary Dirichlet boundary conditions. Watch PINN solve in real time (gradient steps visible). Toggle the physics loss term on/off to see the non-physical collapse without it.
- **Tags:** `PINNs` `physics-informed-neural-networks` `heat-equation` `deep-learning` `JAX` `PyTorch` `scientific-ML` `meshless-PDE` `neural-PDE`
- **Thumbnail:** Two solution fields side by side — neural net output vs. FEM reference — nearly identical color maps. "NO MESH. NO TIMESTEP. JUST MATH."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
