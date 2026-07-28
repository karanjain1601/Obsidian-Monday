---
title: "Van der Pol Oscillator — Limit Cycle"
id: SM085
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, van-der-pol, limit-cycle, nonlinear-oscillator, relaxation-oscillator]
---

> **What it is:** A ~45-second simulation short where phase portrait trajectories starting inside and outside a glowing cyan oval both spiral onto the same limit cycle, demonstrating how amplitude-dependent damping in the Van der Pol oscillator creates a self-sustained oscillation that shifts from near-sinusoidal to sawtooth relaxation as the nonlinearity parameter increases. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Van der Pol Oscillator — Limit Cycle

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A phase portrait: a single trajectory spirals outward from the origin — then another spirals inward from far outside. Both converge on the same closed oval limit cycle, glowing cyan on black. Regardless of starting point, the system always finds the same oscillation.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Van der Pol equation: ẍ - μ(1-x²)ẋ + x = 0. The damping term -μ(1-x²)ẋ: for |x| < 1, damping is negative (energy is added). For |x| > 1, damping is positive (energy is removed). Caption: "Negative damping inside → energy pumped in; positive outside → energy removed."

**0:10–0:18** — Small μ (μ=0.1): the limit cycle is nearly circular (close to the harmonic oscillator). ω ≈ 1. Time series: nearly sinusoidal. Caption: "Small μ: sinusoidal oscillation."

**0:18–0:27** — Large μ (μ=5): the limit cycle is strongly distorted — a relaxation oscillator. Two slow drifts along the cubic nullcline connected by fast vertical jumps. Time series: a "sawtooth" of slow charging and rapid discharge. Caption: "Large μ: relaxation oscillator — slow charge, fast discharge."

**0:27–0:36** — Multiple phase portraits: μ = 0.1, 1, 5, 10. Each limit cycle shown overlaid. As μ increases, the cycle becomes more rectangular. Period also increases with μ: T ≈ (3-2ln2)μ for large μ. Caption: "μ determines both shape and period."

**0:36–0:45** — Historical context: Balthasar van der Pol, 1926 — studied oscillations in vacuum-tube circuits. The heartbeat's pacemaker cells model as van der Pol oscillators. Seismological events can trigger VdP behaviour in fault systems. Caption: "Van der Pol: vacuum tubes → heart pacemakers." Bold text: "Van der Pol — self-sustained oscillation from nonlinearity." Fade to black.

## Physics Concept Teased
Van der Pol oscillator: a nonlinear damped oscillator where the damping coefficient changes sign depending on amplitude. For small amplitudes, energy is added; for large, energy is removed. This creates a stable limit cycle — a self-sustained oscillation that is robust to perturbations. The canonical example of a relaxation oscillator.

## On-Screen Text / Captions
- **0:00** — "Start inside or outside — always the same limit cycle."
- **0:05** — "Damping: negative for |x|<1; positive for |x|>1"
- **0:12** — "Small μ: sinusoidal. Large μ: relaxation."
- **0:20** — "Relaxation: slow charge, fast jump — sawtooth"
- **0:28** — "μ controls both shape and period"
- **0:35** — "Van der Pol: vacuum tubes → heart pacemakers"
- **0:43** — "Self-sustained oscillation from amplitude-dependent damping."

## End Card
Final 3 seconds: four limit cycles (different μ) overlaid on the phase portrait. Text: "Every heartbeat is a van der Pol oscillator — pacemaker cells add energy at small amplitude, remove it at large." CodedLaws logo.

## Audio
Electronic oscillator sounds — pure sine (small μ) transitioning to sawtooth buzz (large μ). Voiceover at 0:00: "A circuit that pumps energy in at small amplitudes but damps at large ones — always settles to the same limit cycle." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: VdP ODE: ẋ = y; ẏ = μ(1-x²)y - x. Integrate with RK4, dt=0.01. Multiple initial conditions: (0.1,0), (5,0), etc. — all converge to limit cycle. Phase portrait: plot (x,y) trajectory. Time series: plot x(t). Relaxation oscillator for large μ: use stiff ODE solver (implicit) or simply reduce dt significantly (dt < 0.001/μ). Nullcline: y=0 (horizontal), x=0 (vertical), and the S-shaped cubic nullcline 0 = μ(1-x²)y-x → y = x/(μ(1-x²)). Runtime: real-time Canvas 2D.
