---
title: "Three-Body Figure-Eight Orbit"
id: SM110
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Chaos_And_Orbits_Full]]"
difficulty: medium
tags: [physics, simulation, short, orbital-mechanics, chaos, three-body, mathematics]
---

> **What it is:** A ~45-second simulation short of three equal-mass bodies tracing the Chenciner-Montgomery figure-eight periodic orbit in perfect synchronized choreography, then diverging into chaos after a 0.001% velocity nudge that reveals the orbit's extreme sensitivity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Chaos_And_Orbits_Full]]

# Short: Three-Body Figure-Eight Orbit
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Three identical glowing bodies — red, green, blue — chase each other in perfect synchronized choreography along a single figure-eight path. They are evenly spaced, always separated by exactly 120°, moving in a configuration that seems impossibly orderly for a notoriously chaotic problem.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Three equal-mass bodies (each mass m=1) start from specific initial conditions (Chenciner-Montgomery 2000 solution). Their trails drawn in their respective colors — red, green, blue — all tracing the same figure-eight curve but offset by T/3 in phase. Background: black. Faint grey grid.
- **0:10–0:18:** The figure-eight trace fills in completely. A thin white figure-eight outline shows the periodic orbit curve. Text annotation: "period T ≈ 6.3259 (in normalized units)." Energy E and angular momentum L = 0 shown numerically in corner, both conserved.
- **0:18–0:28:** Now perturb one body by a tiny nudge — 0.001% of its velocity. The three bodies continue normally for about 2 periods. Then the first divergence appears: the blue body's trail begins to deviate from the figure-eight path, then separates entirely by 0:25. By 0:28 the orbit is chaotic — all three bodies scatter in different directions.
- **0:28–0:38:** Lyapunov exponent visualization: a small inset chart shows log(δ) growing linearly — the separation of nearby trajectories growing exponentially. The slope gives the Lyapunov exponent λ ≈ 1.7. "Chaos horizon: ~3–5 periods" label. Main view: the three bodies in a scrambled mess of crossing trails.
- **0:38–0:45:** Return to the perfect figure-eight. Slow-motion freeze at the triple conjunction point — all three bodies at the same point simultaneously (actually they never coincide — show near-miss at minimum separation). Text: "This orbit was found numerically in 2000."

## Physics Concept Teased
The three-body problem has no closed-form general solution. But a special periodic solution — the figure-eight — was discovered by Chenciner and Montgomery in 2000: three equal masses chase each other along a single figure-eight curve with zero total angular momentum. This orbit is unstable — any tiny perturbation sends the system into chaos on a timescale of only a few periods (quantified by the Lyapunov exponent).

## On-Screen Text / Captions
- **0:00:** "Three bodies. One path. Impossible — but it's real."
- **0:08:** "Chenciner-Montgomery solution (2000)"
- **0:15:** "Perfect figure-eight. Period: 6.3259"
- **0:22:** "0.001% nudge introduced..."
- **0:28:** "Chaos begins in 2 periods"
- **0:35:** "Lyapunov exponent: λ ≈ 1.7"
- **0:42:** "Beautiful. Unstable. Real."

## End Card
Final 3 seconds: the three perfect colored trails glide along the figure-eight in slow motion. Text: "The three-body problem has no solution — except when it does." Channel logo.

## Audio
Minimalist three-voice counterpoint melody — three instruments (piano, violin, cello) each following one body's phase, their lines interweaving. At the perturbation (0:22): a subtle wrong note. By 0:28: dissonance. By 0:35: each instrument playing independently in chaos. No voiceover — let the music tell the story.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: N-body with 4th-order Runge-Kutta, fixed timestep dt=1e-4 in normalized units. Initial conditions (Chenciner-Montgomery): x₁=0.97000436, y₁=-0.24308753; x₂=-0.97000436, y₂=0.24308753; x₃=0; y₃=0; v₃=(-0.93240737, -0.86473146); v₁=v₂=(-v₃/2). These are the canonical figure-eight initial conditions. For the perturbed run, multiply v₁_x by (1+1e-5). Lyapunov: run two identical simulations with tiny offset, log |δr| each timestep. Gotcha: floating point drift will destroy the orbit after ~50 periods even without intentional perturbation — this is a feature, not a bug. Render trails with alpha fade for visual clarity.
