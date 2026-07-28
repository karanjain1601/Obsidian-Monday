---
title: "Hamiltonian Neural Network: Energy Conservation"
id: SA129
type: youtube-short
duration: "~45 seconds"
feeds_video: "Hamiltonian Neural Networks: Teaching AI the Laws of Physics"
difficulty: advanced
tags: [physics, simulation, short, advanced, hamiltonian, neural-network, energy-conservation, symplectic, scientific-ml]
---

> **What it is:** A ~45-second simulation showing a Hamiltonian neural network learning a conserved energy function from trajectory data and integrating with a symplectic solver to achieve long-horizon energy conservation on a double pendulum. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Hamiltonian Neural Networks: Teaching AI the Laws of Physics

# Short: Hamiltonian Neural Network — Energy Conservation

**Feeds full video:** Hamiltonian Neural Networks: Teaching AI the Laws of Physics

## Visual Hook (First 3 Seconds)
A double pendulum (two rods, grey, connected). Standard neural network prediction: the pendulum's energy (yellow line) drifts upward — it gains energy from nothing. HNN prediction: energy line (cyan) flat as an arrow. Text: **"Standard NN breaks physics. HNN doesn't."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Double pendulum phase space: (θ₁, θ₂, p₁, p₂) — 4D system. Projected onto (θ₁, p₁) plane: closed orbit ellipses shown in cyan (true Hamiltonian dynamics). True energy: H = ½m(p₁² + p₂² + 2p₁p₂cos(θ₁−θ₂)) + mg(−2cosθ₁ − cosθ₂). Value: **"H = −3.21 J."**
- **0:10** — Baseline MLP: network f_θ(q,p) → (q̇,ṗ) trained on trajectory data. After integrating 200 steps: energy drift visible (yellow line climbing from −3.21 → −2.8 J, +13% error). Phase portrait: orbit spirals outward instead of closing. Label: **"MLP: energy error +13% in 10 seconds."**
- **0:18** — HNN architecture: network H_θ(q,p) → scalar H. Time derivatives from anti-symmetric Poisson bracket: q̇ = ∂H_θ/∂p, ṗ = −∂H_θ/∂q. Both computed via autograd. This structure guarantees energy conservation by construction — the learned H_θ is conserved along any trajectory.
- **0:27** — Training: loss = ||dq/dt − ∂H_θ/∂p||² + ||dp/dt − (−∂H_θ/∂q)||² over 1000 training trajectory points. Convergence: **"MSE = 0.0023"** after 20,000 steps. HNN energy: flat line at **"H = −3.21 ± 0.002 J"** — essentially machine precision.
- **0:36** — Phase portrait comparison: MLP orbit (yellow dashed, spiraling out) vs. HNN orbit (cyan solid, perfectly closed). After 500 integration steps: HNN orbit closing error **"< 0.1%"** vs MLP **"18%."** HNN preserves symplectic structure.
- **0:44** — Generalization: HNN trained on small-angle oscillations (|θ| < 30°). Tested at large angle (|θ| = 90°, chaotic regime). HNN still conserves energy (**"drift = 0.4 J over 100s"**), but orbit topology diverges from truth — indicates extrapolation limit, not physics violation.

## Physics Concept Teased
Hamiltonian neural networks learn a scalar energy function H_θ(q,p) rather than directly predicting derivatives — Hamilton's equations then provide the dynamics structure-preserving guarantee: since the system evolves along H = const surfaces by construction, energy conservation is exact regardless of training accuracy.

## On-Screen Text / Captions
- **0:00** — "Standard AI creates energy from nothing — HNN can't"
- **0:10** — "MLP predicts derivatives directly: energy drifts away"
- **0:20** — "HNN learns H(q,p): Hamilton's equations give the rest"
- **0:30** — "Energy conserved to machine precision — by construction"
- **0:38** — "Symplectic orbits close perfectly — 500 steps later"
- **0:45** — "Hamiltonian NN deep dive → bio"

## End Card
Final 3 seconds: closed cyan orbit (HNN) vs. spiraling yellow orbit (MLP) in phase portrait. **"CodedLaws — Structure-Preserving ML"** text.

## Audio
Clean, precise electronic piano at 68 BPM. Energy conservation confirmed by flat sustained note. No voiceover.

## Production Notes
Renderer: HNN (Python/PyTorch). Network: 4-input (q,p) → 3 hidden layers (200 units, tanh) → 1 scalar H_θ. Derivatives: torch.autograd.grad. Integration: leapfrog symplectic integrator, dt=0.05s. Training data: 1000 points from 10 true trajectories. Loss: L2 on time derivatives. Baseline: identical MLP architecture but predicts (q̇,ṗ) directly. Output 1080×1920, 60 fps.
