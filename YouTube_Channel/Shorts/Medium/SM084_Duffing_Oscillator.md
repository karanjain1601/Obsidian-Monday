---
title: "Duffing Oscillator — Chaotic Driven Pendulum"
id: SM084
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chaos, duffing-oscillator, driven-pendulum, strange-attractor, bifurcation]
---

> **What it is:** A ~45-second simulation short where a periodically driven pendulum on a double-well potential hops unpredictably between two stable wells, with its Poincaré section revealing a fractal strange attractor through a period-doubling route to chaos governed by the Duffing equation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Duffing Oscillator — Chaotic Driven Pendulum

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A pendulum swings on a two-well potential — a "W" shaped energy landscape with two valleys (two stable positions). The pendulum is being driven by a periodic force. In 3 seconds it switches unpredictably from one well to the other — not settling, never repeating — deterministic chaos.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Duffing equation: ẍ + δẋ - αx + βx³ = γcos(ωt). The x³ term creates the double-well potential V(x) = -αx²/2 + βx⁴/4. Shown as a W-shaped curve. Equilibria: x=0 (unstable), x=±√(α/β) (stable). Caption: "Double-well potential — two stable states."

**0:10–0:18** — Phase portrait: without driving (γ=0), the orbit is a closed curve around one potential well. With weak driving (γ=0.1): the orbit wiggles around one well. With strong driving (γ=0.5): the orbit crosses the potential barrier and visits both wells chaotically. Caption: "Strong driving → chaos — cross the barrier."

**0:18–0:27** — Poincaré section: sample the phase space (x, ẋ) once per driving period (stroboscopic). For periodic orbit: a finite set of points. For chaos: a fractal cloud of points (the strange attractor's intersection). The fractal fine structure revealed by zooming. Caption: "Poincaré section: fractal structure of chaos."

**0:27–0:36** — Bifurcation diagram (ẋ_stroboscopic vs γ): at γ=0.1 — period-1 orbit (one point). γ=0.24 — period-2. γ=0.30 — period-4. γ=0.35 — chaos (dense band). Period-doubling route to chaos, identical to SM025. Caption: "Period doubling: Feigenbaum's route to chaos."

**0:36–0:45** — Real systems: a compass needle in a periodically flipped magnet field, an elastic buckled beam under vibration, a ship rolling in waves. All modelled by the Duffing equation. Caption: "Compass, beam, ship rolling — all Duffing." Bold text: "Duffing oscillator — double well, double chaos." Fade to black.

## Physics Concept Teased
Duffing oscillator: a nonlinear oscillator with a cubic restoring force and periodic driving. The double-well potential creates two stable equilibria separated by a potential barrier. Strong periodic driving causes chaotic hopping between wells — the Duffing strange attractor. Identical bifurcation sequence (period doubling) to the logistic map.

## On-Screen Text / Captions
- **0:00** — "Two potential wells. Periodic driving. Chaos."
- **0:05** — "ẍ + δẋ - αx + βx³ = γcos(ωt)"
- **0:12** — "Strong driving: orbit crosses the barrier"
- **0:20** — "Poincaré section: fractal strange attractor"
- **0:28** — "Period doubling: 1 → 2 → 4 → chaos"
- **0:35** — "Compass, buckled beam, ship rolling — Duffing"
- **0:43** — "Duffing oscillator — classic nonlinear chaos."

## End Card
Final 3 seconds: the Duffing strange attractor — a rich, layered fractal in the Poincaré section. Text: "Georg Duffing derived this equation studying vibrating beams — 1918." CodedLaws logo.

## Audio
Driving mechanical rhythm (frequency = ω/2π = 1 Hz in simulation time). Becomes chaotic-sounding (arrhythmic) when chaos onset occurs. Voiceover at 0:00: "Drive a double-well pendulum hard enough and it never settles — hopping between wells in deterministic chaos." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D. Key algorithm: integrate Duffing ODE with RK4. Parameters: α=1, β=1, δ=0.3, ω=1.2, γ sweep for bifurcation. Phase portrait: plot (x, ẋ) as a scatter. Poincaré section: record (x, ẋ) at t = 2πn/ω (once per cycle). Potential: V(x) = -x²/2 + x⁴/4, draw as a curve. Bifurcation diagram: for each γ, run 1000 cycles, collect last 200 ẋ_stroboscopic values, plot. Runtime: real-time Canvas 2D, fast.
