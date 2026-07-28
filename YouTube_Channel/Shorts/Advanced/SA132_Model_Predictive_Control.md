---
title: "Model Predictive Control: Trajectory Optimization"
id: SA132
type: youtube-short
duration: "~45 seconds"
feeds_video: "Model Predictive Control: Optimal Control in Real Time"
difficulty: advanced
tags: [physics, simulation, short, advanced, mpc, trajectory-optimization, optimal-control, robotics, simulation]
---

> **What it is:** A ~45-second simulation showing a model predictive controller solving a constrained quadratic program over a receding horizon at 200 Hz to steer a robot arm along a trajectory while avoiding obstacles in real time. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Model Predictive Control: Optimal Control in Real Time

# Short: Model Predictive Control — Trajectory Optimization

**Feeds full video:** Model Predictive Control: Optimal Control in Real Time

## Visual Hook (First 3 Seconds)
An inverted pendulum (grey rod, orange ball at top) balanced on a cart. Random disturbances (white arrows) push it. The cart moves left and right — the pendulum never falls. Cyan predicted trajectory arcs ahead in real-time. Text: **"Optimal. Every 20 milliseconds."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — System: cart-pole, 4 states: x (cart position, 0 m), ẋ (cart velocity), θ (angle, 0.05 rad off-vertical), θ̇ (angular velocity). Control input u = force on cart (−10 to +10 N). Cyan circle = feasible control region.
- **0:10** — Prediction horizon: MPC solves an optimization at each timestep. Horizon N=20 steps (0.4 seconds ahead). Orange "ghost" trajectories shown: 10 candidate control sequences rendered as faint orange arcs. One optimal trajectory (bright cyan) selected. Cost function: J = Σ(q·θ² + r·u²).
- **0:18** — Optimization (IPOPT interior-point): solving QP subproblem. Constraint: x ∈ [−2, 2] m (cart limits, dashed red lines). |u| ≤ 10 N. Solver convergence: **"22 iterations, 18 ms"**. Optimal control sequence u* = [2.3, 1.8, 0.7, ...] shown as bar chart.
- **0:27** — Receding horizon: only u*(0) = 2.3 N applied. Next timestep: horizon shifts forward, new measurement taken, QP re-solved. Label: **"Solve → Apply 1 step → Measure → Repeat."** This feedback loop makes MPC robust to model error.
- **0:36** — Disturbance rejection: impulse disturbance of 5 N (white arrow) at t=1.2s. Without MPC (grey trajectory): pendulum falls in 0.8s. With MPC (cyan trajectory): pendulum recovered to vertical in **"1.2 seconds."** Cart position: returns to 0 within **"3 seconds."**
- **0:44** — Nonlinear MPC: replace linear model with full nonlinear pendulum dynamics (sin(θ) terms). iLQR (iterative LQR) solver used. Swing-up task: pendulum starts hanging down (θ=π), must swing up to θ=0. iLQR finds swing-up trajectory in **"45 ms"** and executes in **"3.2 seconds."**

## Physics Concept Teased
Model Predictive Control optimizes a finite-horizon cost function at each control timestep using the system's dynamic model as a constraint — solving the constrained QP in real time and applying only the first control action before re-solving creates a feedback controller that robustly handles disturbances and constraints simultaneously.

## On-Screen Text / Captions
- **0:00** — "Balancing an inverted pendulum: optimal every 20 ms"
- **0:10** — "MPC: predict 20 steps ahead, pick the best path"
- **0:20** — "Solve a constrained optimization in 18 milliseconds"
- **0:30** — "Apply step 1. Measure. Re-solve. Every timestep."
- **0:38** — "5N disturbance: recovered in 1.2 seconds"
- **0:45** — "Full MPC theory → link in bio"

## End Card
Final 3 seconds: pendulum balanced with cyan predicted arc visible, cart at center. **"CodedLaws — Control Theory"** text.

## Audio
Precise metronome-like electronic beat at 50 Hz (MPC rate). Mechanical motor hum when cart moves. No voiceover.

## Production Notes
Renderer: MPC on cart-pole (Python/CasADi + IPOPT). Linear model for standard MPC: A,B matrices from linearization at θ=0. QP formulation: condensed form with 80 variables, 160 constraints. Solver: IPOPT with HSL MA27 linear algebra. Timing: average 18 ms/solve on i7 CPU. Nonlinear MPC: full sin/cos dynamics, iLQR (20 iterations, 45 ms). Output 1080×1920, 60 fps.
