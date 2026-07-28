---
title: "I Added ONE More Pendulum Rod and It Became Impossible to Predict"
season: 1
episode: 8
difficulty: 4.5/10
concept: "Deterministic chaos and the Lyapunov exponent"
prereq: "E07 (RK4 — needed because you need a good integrator to trust the result)"
tags: [double-pendulum, chaos-theory, Lyapunov-exponent, deterministic-chaos, javascript, physics-art, sensitive-dependence, nonlinear-dynamics]
type: playlist-video
---

## S1·E08 — "I Added ONE More Pendulum Rod and It Became Impossible to Predict"

- **Alt title:** "The Double Pendulum: A Tutorial in Losing Control of Your Own Simulation"
- **Difficulty:** 4.5/10 · **Prereq:** E07 (RK4 — needed because you need a good integrator to trust the result)
- **Hook:** Two double pendulums initialized 0.0001 degrees apart — literally indistinguishable for 8 seconds — then suddenly forking into completely different trajectories with no shared pattern.
- **The break (bug):** This time there is no bug to fix. Any integration error, however tiny, gets amplified exponentially (Lyapunov exponent λ > 0). You cannot usefully predict the trajectory past the Lyapunov horizon regardless of integrator accuracy. Switching from RK4 with dt=0.01 to dt=0.001 doubles your prediction window — it doesn't save you. This is the lesson: sometimes physics itself limits predictability, not your code.
- **Concept introduced:** Deterministic chaos — a system with perfectly deterministic equations that is practically unpredictable due to exponential sensitivity to initial conditions. The Lyapunov exponent λ measures the rate of divergence. The Lyapunov time 1/λ is how long you can trust any simulation.
- **Push it / wow moment:** Fire 500 double pendulums simultaneously, each displaced from the last by 0.0001°. Color each trajectory by its divergence time from the first. The screen fills with chaotic art — hundreds of glowing colored trails weaving into abstract patterns. The viewer can save this as generative art.
- **Demo:** Click to spawn double pendulums with tiny angle offsets. Color mode: trace trajectories. Slow-motion button. Export the art as a PNG.
- **Tags:** `double-pendulum` `chaos-theory` `Lyapunov-exponent` `deterministic-chaos` `javascript` `physics-art` `sensitive-dependence` `nonlinear-dynamics`
- **Thumbnail:** Hundreds of glowing pendulum trails, different colors, weaving into fractal-like art against pure black. No text needed.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
