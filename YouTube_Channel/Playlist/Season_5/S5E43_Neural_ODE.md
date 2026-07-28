---
title: "This Neural Net Watched a Pendulum and Learned Newton's Second Law"
season: 5
episode: 43
difficulty: 8.5/10
concept: "Neural ODEs and the adjoint sensitivity method"
prereq: "E41 (differentiable sim) + E08 (double pendulum / chaos)"
tags: [neural-ODE, ODE-Net, machine-learning-physics, adjoint-method, pendulum, JAX, trajectory-learning, scientific-ML]
type: playlist-video
---

## S5·E43 — "This Neural Net Watched a Pendulum and Learned Newton's Second Law"

- **Alt title:** "Neural ODEs: What If the Differential Equation's Right-Hand Side Is a Network?"
- **Difficulty:** 8.5/10 · **Prereq:** E41 (differentiable sim) + E08 (double pendulum / chaos)
- **Hook:** A neural network trained only on recorded pendulum position-velocity trajectories — no labels, no physics equations given. When its learned vector field is plotted, it matches `F = ma` exactly. The machine discovered Newton's law.
- **The break (bug):** Without the adjoint method for backpropagating through the ODE solver, gradients of the loss with respect to network parameters must be computed by storing the entire integration history — memory grows linearly with number of ODE steps. For a long simulation, this crashes. The adjoint method solves a backward ODE to compute gradients, using O(1) memory regardless of integration length.
- **Concept introduced:** Neural ODEs — replace the right-hand side `f(x, t)` of an ODE `dx/dt = f(x,t)` with a neural network `f_θ(x,t)`. Train by running the ODE forward, computing a loss, and backpropagating through the solver using the adjoint sensitivity method. The resulting model is a *continuous-depth* network where depth corresponds to integration time.
- **Push it / wow moment:** Neural ODE trained on chaotic double-pendulum trajectories. Visualize the learned vector field in phase space — it matches the true dynamics perfectly. Show which initial conditions it predicts correctly vs. where it fails and why (Lyapunov horizon from E08).
- **Demo:** Train live on incoming pendulum data. Draw initial conditions on the phase plane and watch the neural ODE extrapolate them forward. Compare neural ODE prediction vs. ground truth.
- **Tags:** `neural-ODE` `ODE-Net` `machine-learning-physics` `adjoint-method` `pendulum` `JAX` `trajectory-learning` `scientific-ML`
- **Thumbnail:** A perfect pendulum phase portrait — closed ellipses and the separatrix — labeled "LEARNED FROM DATA."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
