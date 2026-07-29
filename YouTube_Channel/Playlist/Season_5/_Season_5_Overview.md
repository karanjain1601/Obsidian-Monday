---
title: "Season 5 — Teaching Machines Physics"
season: 5
episodes: 10
theme: "Make physics differentiable; machines learn the laws"
tags: [youtube, physics-simulation, season-overview, physics-ML, neural-networks, differentiable-simulation]
type: season-overview
---

# Season 5 — Teaching Machines Physics (E41–E50)

> **Season Thesis:** When you make physics differentiable, machines can learn the laws from data — and outperform hand-crafted simulations.

## Episode List

| # | Episode | Core Concept |
|---|---------|-------------|
| E41 | [[S5E41_Differentiable_Sim\|Differentiable Simulation]] | Autodiff through physics; backprop through a sim |
| E42 | [[S5E42_PINNs\|Physics-Informed Neural Nets]] | PINNs; PDE loss as a regularizer |
| E43 | [[S5E43_Neural_ODE\|Neural ODE]] | Neural ODEs; adjoint sensitivity method |
| E44 | [[S5E44_Symbolic_Regression\|Symbolic Regression]] | Discovering physical laws from data |
| E45 | [[S5E45_RL_Robot\|RL Locomotion]] | Reinforcement learning for robot locomotion |
| E46 | [[S5E46_Neural_Surrogate\|Neural Surrogate Models]] | Graph neural networks for fast physics |
| E47 | [[S5E47_Evolution_Robot\|Evolutionary Robotics]] | Evolutionary algorithm for morphology + control |
| E48 | [[S5E48_Self_Driving\|Self-Driving Vehicle Sim]] | Inverse design; topology optimization |
| E49 | [[S5E49_Hamiltonian_NN\|Hamiltonian Neural Network]] | Hamiltonian NNs; energy-conserving learned dynamics |
| E50 | [[S5E50_Full_Stack_Physics\|Full Stack Physics Engine]] | Sim-to-real transfer; domain randomization |

## Key Concepts Introduced This Season

- **Differentiable simulation** — autodiff through physics loops (E41)
- **PINNs** — neural networks that respect PDEs (E42)
- **Neural ODEs** — continuous-depth networks and adjoint method (E43)
- **Symbolic regression** — Pareto-optimal equation discovery (E44)
- **RL for physics** — policy gradient, PPO for locomotion (E45)
- **Graph Neural Networks** — mesh-based learned simulators (E46)
- **Evolutionary algorithms** — co-evolve body and brain (E47)
- **Hamiltonian NNs** — architecture that conserves energy by construction (E49)
- **Sim-to-real transfer** — domain randomization to bridge simulation gap (E50)

## Tooling Shift

Seasons 1–4 used **JavaScript + Canvas/WebGL**. Season 5 switches to **Python + JAX** for autodiff support — the first time the channel requires a different runtime environment.

---

*Part of [[_MOC_YouTube_Channel|CodedLaws]]*
