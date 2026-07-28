---
title: "A Neural Net Drew the Soul of a Pendulum Without Being Told It Was a Pendulum"
season: 5
episode: 49
difficulty: 9/10
concept: "Hamiltonian Neural Networks with energy conservation as an inductive bias"
prereq: "E43 (neural ODEs) + E04 (pendulum phase space)"
tags: [Hamiltonian-neural-network, phase-space, symplectic, energy-conservation, JAX, machine-learning-physics, pendulum, scientific-ML, inductive-bias]
type: playlist-video
---

## S5·E49 — "A Neural Net Drew the Soul of a Pendulum Without Being Told It Was a Pendulum"

- **Alt title:** "Hamiltonian Neural Networks: Teaching a Machine That Energy Is Conserved"
- **Difficulty:** 9/10 · **Prereq:** E43 (neural ODEs) + E04 (pendulum phase space)
- **Hook:** A network trained on random pendulum trajectories that — when probed — outputs a perfect phase portrait: closed ellipses inside the separatrix, open curves outside, the separatrix itself visible as a boundary. The network found the soul of the pendulum.
- **The break (bug):** A standard neural ODE trained on pendulum data learns only short-term dynamics. When extrapolated to 10× the training duration, trajectories slowly spiral inward or outward rather than closing. The network doesn't know energy is conserved — it just doesn't violate it much over short windows. Hamiltonian NN imposes energy conservation structurally: the network predicts the Hamiltonian H(q,p) directly, then derives dynamics via Hamilton's equations `q̇ = ∂H/∂p, ṗ = -∂H/∂q`. This guarantees conserved energy forever.
- **Concept introduced:** Hamiltonian Neural Networks (HNNs) — parameterize the Hamiltonian H(q, p) rather than the dynamics directly, then derive q̇ and ṗ from Hamilton's equations. The HNN is a physics-constrained architecture with energy conservation as an inductive bias. Compare to the standard neural ODE which uses no such structure.
- **Push it / wow moment:** HNN vs. standard neural ODE on long-time pendulum extrapolation. HNN's trajectories close perfectly (or nearly so) over thousands of cycles; ODE trajectories drift visibly within hundreds. Show the learned energy contours H(q,p) = const as a landscape — it looks exactly like the true pendulum Hamiltonian.
- **Demo:** Draw any starting point on the phase plane. Watch HNN-predicted trajectory. Visualize learned energy contours. Toggle HNN vs. neural ODE for the long-time extrapolation comparison.
- **Tags:** `Hamiltonian-neural-network` `phase-space` `symplectic` `energy-conservation` `JAX` `machine-learning-physics` `pendulum` `scientific-ML` `inductive-bias`
- **Thumbnail:** A perfect pendulum phase portrait with ellipses and separatrix. Caption: "LEARNED BY A NEURAL NET."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
