---
title: "Lagrangian Neural Network: Symmetry Preservation"
id: SA130
type: youtube-short
duration: "~45 seconds"
feeds_video: "Lagrangian Neural Networks: From Noether's Theorem to AI"
difficulty: advanced
tags: [physics, simulation, short, advanced, lagrangian, neural-network, symmetry, noether, scientific-ml]
---

> **What it is:** A ~45-second simulation showing a Lagrangian neural network learning the L = T - V functional from trajectory data and enforcing Noether symmetry constraints to preserve momentum and energy in rollout predictions. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Lagrangian Neural Networks: From Noether's Theorem to AI

# Short: Lagrangian Neural Network — Symmetry Preservation

**Feeds full video:** Lagrangian Neural Networks: From Noether's Theorem to AI

## Visual Hook (First 3 Seconds)
A spring-mass system: mass (orange ball) oscillating on a spring (cyan coil). Kinetic energy (orange bar) and potential energy (cyan bar) trade off perfectly — total stays constant (white bar, flat). Text: **"Lagrangian: T − V. Noether's theorem encoded in AI."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Lagrangian formalism: L(q,q̇) = T(q̇) − V(q). For spring: L = ½mq̇² − ½kq². Euler-Lagrange equation: d/dt(∂L/∂q̇) − ∂L/∂q = 0 → mq̈ = −kq. Animation shows q(t), q̇(t) trajectories and the Lagrangian value: **"L = 0.23 J"** shown as live meter.
- **0:10** — LNN architecture: network L_θ(q,q̇) → scalar L. Equations of motion derived: q̈ = (∂²L_θ/∂q̇²)⁻¹·(∂L_θ/∂q − ∂²L_θ/∂q̇∂q · q̇). Mass matrix M(q) = ∂²L/∂q̇² shown as a 2×2 matrix (for 2-DOF system). Inversion shown symbolically: **"M⁻¹ exists if M is positive definite."**
- **0:18** — Noether correspondence: rotation symmetry (shown as rotating 2D arm) → conservation of angular momentum. Translation symmetry → linear momentum. Time symmetry → energy. Each symmetry shown as a glowing circle; conserved quantity appears as a flat line on a gauge below.
- **0:27** — Training: 2-link planar robot arm (4D state: θ₁,θ₂,θ̇₁,θ̇₂). True dynamics known (Runge-Kutta reference). LNN trained on 500 trajectory segments: **"loss = Σ||q̈_pred − q̈_true||²."** Convergence at 30,000 steps: **"RMSE = 0.004 rad/s²."**
- **0:36** — Symmetry test: rotate the robot arm by 90° — LNN predictions transform covariantly (arm motion rotates 90° as expected). Baseline MLP: fails the symmetry test (arm motion distorts when rotated). Label: **"LNN: equivariant to rotation. MLP: not."**
- **0:44** — Long-horizon prediction: true trajectory (orange) vs. LNN (cyan) vs. MLP (red dashed) over 50-second rollout of double pendulum. LNN stays close to truth for **"12 seconds"** before chaos divergence; MLP diverges at **"3 seconds."** Label: **"4× longer valid prediction from physics structure."**

## Physics Concept Teased
Lagrangian neural networks learn a scalar L_θ(q,q̇) and derive equations of motion via the Euler-Lagrange equation — this architecture automatically inherits Noether's theorem: any continuous symmetry of the learned Lagrangian produces an exactly conserved quantity, giving physics-consistent long-horizon rollouts.

## On-Screen Text / Captions
- **0:00** — "Physics has symmetries. Lagrangian AI inherits them."
- **0:10** — "Learn L(q, q-dot): equations of motion come for free"
- **0:20** — "Rotation symmetry → conserved angular momentum"
- **0:30** — "Robot arm: equivariant predictions under rotation"
- **0:38** — "4× longer valid rollout — structure beats fitting"
- **0:45** — "Lagrangian NN full theory → bio link"

## End Card
Final 3 seconds: Noether symmetry-conservation diagram (3 pairs) glowing. **"CodedLaws — Geometric ML"** text.

## Audio
Precise, mechanical electronic beat at 72 BPM. Spring-resonance tone (pure sine, matched to oscillation frequency). No voiceover.

## Production Notes
Renderer: LNN (Python/PyTorch). L_θ: 3-hidden-layer MLP (200 units, tanh). Second derivatives via torch.autograd.functional.hessian. Robot arm: 2-DOF, m₁=m₂=1 kg, l₁=l₂=0.5 m. Integrator: RK4, dt=0.01 s. Training: 500 segments × 4 steps, Adam lr=10⁻³. Symmetry test: SO(2) rotation group. Output 1080×1920, 60 fps.
