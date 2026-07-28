---
title: "Hopf Bifurcation — Steady State to Oscillation"
id: SM087
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, hopf-bifurcation, dynamical-systems, limit-cycle, bifurcation-theory]
---

> **What it is:** A ~45-second simulation short where a phase portrait's inward spiral abruptly reverses and grows outward onto a limit cycle as a single parameter crosses zero, demonstrating the supercritical and subcritical Hopf bifurcation as the canonical birth of oscillation in dynamical systems. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Hopf Bifurcation — Steady State to Oscillation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Phase portrait: a single fixed point (a stable spiral). The trajectory spirals inward — decay to equilibrium. A parameter slider moves — and at a critical value, the spiral changes direction. Instead of spiralling in, the trajectory spirals OUT to a growing limit cycle. A system that was sleeping suddenly oscillates.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Supercritical Hopf bifurcation: system ṙ = μr - r³; θ̇ = ω (in polar coordinates). For μ < 0: r=0 is a stable fixed point (spiral in). For μ = 0: center (marginal). For μ > 0: r=√μ is a stable limit cycle. Caption: "Supercritical: born stable limit cycle at μ=0." Amplitude A = √μ → small near bifurcation.

**0:10–0:18** — Subcritical Hopf bifurcation: ṙ = μr + r³ - r⁵. Two limit cycles: an unstable small one and a stable large one. As μ decreases: the unstable and stable cycles approach, collide and annihilate at μ_c < 0. Below μ_c: jumps to the fixed point. Caption: "Subcritical: hysteresis — sudden jump to large oscillation."

**0:18–0:27** — Hysteresis loop: in the subcritical case, the system exhibits bistability between the fixed point and the large limit cycle for μ_c < μ < 0. Increasing μ from below: system stays at rest until μ=0, then jumps to large limit cycle. Decreasing μ from above: stays on large limit cycle until μ=μ_c, then falls to fixed point. Caption: "Hysteresis: path matters."

**0:27–0:36** — Real examples: (1) Hopf in fluid dynamics — the von Kármán vortex street (supercritical Hopf bifurcation in Re). (2) Cardiac rhythm disorder — pacemaker failure as subcritical Hopf. (3) Electrical circuits — oscillator startup. Caption: "Hopf is universal: same math in all oscillation onset."

**0:36–0:45** — Parameter sweep animation: μ sweeps from -1 to +1. Phase portrait shows: stable spiral (μ<0) → center (μ=0) → limit cycle grows (μ>0). Simultaneously, time series shows: decaying oscillation → neutral → growing oscillation → steady oscillation. Bold text: "Hopf bifurcation — the birth of oscillation." Fade to black.

## Physics Concept Teased
Hopf bifurcation: a fixed point loses stability and gives birth to a limit cycle (supercritical Hopf), or a pre-existing large limit cycle jumps in suddenly (subcritical Hopf). The supercritical bifurcation produces oscillations whose amplitude grows as √(μ - μ_c) — the canonical "soft" onset of oscillation in physics and biology.

## On-Screen Text / Captions
- **0:00** — "A system at rest. Then — it starts oscillating."
- **0:05** — "Supercritical Hopf: ṙ = μr - r³; limit cycle A = √μ"
- **0:12** — "Subcritical: unstable + stable cycles → sudden jump"
- **0:20** — "Hysteresis: path-dependent transition"
- **0:28** — "Vortex shedding, cardiac rhythms, circuit oscillators"
- **0:35** — "μ sweep: spiral → center → limit cycle"
- **0:43** — "Hopf bifurcation — the birth of oscillation."

## End Card
Final 3 seconds: the limit cycle born at the Hopf bifurcation — a small cyan oval growing as μ increases. Text: "Eberhard Hopf proved the general theorem in 1942." CodedLaws logo.

## Audio
A slow oscillation tone that grows from silence to a steady hum as μ passes through the bifurcation. Voiceover at 0:00: "At a Hopf bifurcation, a fixed point loses stability and a limit cycle is born — this is how oscillations start in nature." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: supercritical normal form: ṙ = μr - r³; θ̇ = 1. Convert to Cartesian: ẋ = μx - y - x(x²+y²); ẏ = x + μy - y(x²+y²). Integrate with RK4. Multiple trajectories from different initial conditions shown converging to limit cycle (for μ>0) or fixed point (for μ<0). Subcritical: ẋ = μx - y + x(x²+y²) - x(x²+y²)². Hysteresis loop: plot final amplitude vs μ for increasing and decreasing sweeps — shows hysteresis. Runtime: real-time Canvas 2D.
