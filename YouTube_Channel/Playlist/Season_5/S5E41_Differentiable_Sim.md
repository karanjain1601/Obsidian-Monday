---
title: "I Aimed a Cannon With Gradient Descent. The Math Is Insane."
season: 5
episode: 41
difficulty: 7/10
concept: "Differentiable programming and reverse-mode automatic differentiation"
prereq: "E01–E10 (sim fundamentals) + basic ML familiarity"
tags: [differentiable-simulation, automatic-differentiation, gradient-descent, physics-optimization, javascript, JAX, inverse-problems, trajectory-optimization]
type: playlist-video
---

## S5·E41 — "I Aimed a Cannon With Gradient Descent. The Math Is Insane."

- **Alt title:** "What If Your Physics Engine Could Calculate Its Own Derivatives?"
- **Difficulty:** 7/10 · **Prereq:** E01–E10 (sim fundamentals) + basic ML familiarity
- **Hook:** A cannon that, given an arbitrary target position, automatically finds the exact launch angle and velocity to hit it — by flowing gradients *backward* through every timestep of the simulation.
- **The break (bug):** Non-differentiable operations in the simulation cause gradient flow to break. If-else collision branches produce zero gradients (no signal) or NaN (undefined). `floor()` for grid indices has zero derivative everywhere. Fix: smooth approximations — sigmoid for collision onset, bilinear interpolation for grid sampling. Every non-differentiable operation is a place where the gradient optimizer is flying blind.
- **Concept introduced:** Differentiable programming — treating a simulation as a computation graph and computing `∂Loss/∂parameters` via reverse-mode automatic differentiation (autograd / JAX's `jax.grad`). The simulation is just a function: `output = simulate(params)`. Loss = distance from target. `dLoss/dparams` tells you how to adjust the launch parameters to reduce the loss.
- **Push it / wow moment:** Trajectory optimization with 3 obstacles — gradient descent finds the arc that grazes past all obstacles to reach the target, a solution no human would intuit. Show the gradient flow: arrows on the trajectory showing which direction to perturb each point to reduce the loss.
- **Demo:** Place target and obstacles with clicks. Watch gradient descent tune launch angle and speed in real time. Overlay gradient magnitude as a heat map on the trajectory. Compare gradient descent vs. random search to show why gradients are magic.
- **Tags:** `differentiable-simulation` `automatic-differentiation` `gradient-descent` `physics-optimization` `javascript` `JAX` `inverse-problems` `trajectory-optimization`
- **Thumbnail:** A glowing ballistic arc threading around three obstacles to hit a target. "GRADIENT DESCENT FOUND THIS."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
