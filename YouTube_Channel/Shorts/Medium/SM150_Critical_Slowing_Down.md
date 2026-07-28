---
title: "Critical Slowing Down — Bifurcation Warning Sign"
id: SM150
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, dynamical-systems, critical-slowing-down, bifurcation, early-warning, tipping-point]
---

> **What it is:** A ~45-second simulation short where a ball rolling in a tilting potential well returns more and more slowly from perturbations as the well shallows, with autocorrelation and variance both rising monotonically before the system tips catastrophically, demonstrating critical slowing down as a statistical early-warning signal for tipping points like AMOC collapse. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Critical Slowing Down — Bifurcation Warning Sign

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A ball rolling in a tilting potential well. The well is deep — the ball returns quickly when perturbed. As the tilt increases, the well becomes shallower. The ball returns more and more slowly. At the tipping point, the well disappears and the ball rolls off catastrophically. The slowing return rate is a warning sign.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The saddle-node bifurcation (SM088): ẋ = μ + x², stable fixed point x* = -√(-μ) for μ < 0. Near the fixed point: linearise — deviation δx = x - x* satisfies δ̇x ≈ -2√(-μ)·δx. Relaxation rate λ = 2√(-μ) → 0 as μ → 0 (the bifurcation). Caption: "Relaxation rate λ → 0 as μ → 0 — critical slowing down." Return time T = 1/λ → ∞.

**0:10–0:18** — Observables: in a stochastic system near the bifurcation, critical slowing down produces (1) increasing autocorrelation (AR(1) coefficient → 1); (2) increasing variance (σ² ∝ 1/λ → ∞); (3) increasing recovery time after perturbations. Caption: "Warning signs: ↑ autocorrelation, ↑ variance, ↑ recovery time." All three increase before the tipping point.

**0:18–0:27** — Simulation: 1D stochastic system ẋ = μ + x² + ξ (ξ = white noise). Sweep μ from -2 to 0. At each μ: run 500 steps, compute AR(1) coefficient and variance of x(t). Show both increasing monotonically as μ → 0. Caption: "AR(1) and variance both increase — early warning indicators."

**0:27–0:36** — Real tipping points: (1) AMOC (Atlantic meridional overturning circulation) — fingerprints of critical slowing down observed in ocean temperature data (Boers 2021). (2) Epileptic seizure — seizure prediction from increasing EEG autocorrelation. (3) Ecological collapse — lake eutrophication warnings. Caption: "AMOC: critical slowing down detected in real ocean data (2021)." This is urgent: AMOC collapse could alter European climate.

**0:36–0:45** — Limitations: false positives (slow trends masquerade as CSD); fast bifurcations (insufficient data before tipping). But CSD remains the best generic early-warning system for tipping points. Caption: "CSD: best generic early-warning for tipping points." Bold text: "Critical slowing down — the system's early warning cry." Fade to black.

## Physics Concept Teased
Critical slowing down (CSD): near a saddle-node bifurcation (tipping point), the linearised relaxation rate λ → 0. In a noisy system, this produces increasing variance (σ² ∝ 1/λ) and increasing autocorrelation (AR(1) coefficient → 1) as statistical early-warning signals before the catastrophic transition. Detected in AMOC, ecological collapse, and epileptic seizures.

## On-Screen Text / Captions
- **0:00** — "System slows down before it tips — a warning sign."
- **0:05** — "Relaxation rate λ = 2√(-μ) → 0 as μ → 0"
- **0:12** — "Warning signs: ↑ autocorrelation, ↑ variance, ↑ recovery"
- **0:20** — "Stochastic model: AR(1) and σ² both increase near μ=0"
- **0:28** — "AMOC: CSD detected in ocean data — Boers 2021"
- **0:35** — "CSD: best generic early-warning for tipping points"
- **0:43** — "Critical slowing down — listen before the tip."

## End Card
Final 3 seconds: the AR(1) and variance time series rising monotonically, then the system tips. Text: "Scientists detected critical slowing down in the Atlantic Overturning Circulation — it may be close to a tipping point." CodedLaws logo.

## Audio
Slow, ominous pulse that gets slower and slower until it stops, then a crash. Voiceover at 0:00: "Before a system tips catastrophically, it gives a warning — it starts returning from disturbances more and more slowly. This is critical slowing down." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (potential well animation + time series). Key algorithm: 1D SDE: dx = (μ + x² + rx)dt + σ_noise·dW. For each μ (sweep from -2 to 0): run Euler-Maruyama 500 steps. Compute AR(1) = autocorrelation at lag 1 of x(t). Compute variance = Var(x). Plot AR(1)(μ) and Var(μ). Also show recovery time: perturb from equilibrium, measure time to return to within 1% of x*. Potential well: V(x) = -μx - x³/3 (potential for ẋ = μ+x²). Animate well shape as μ changes. Runtime: fast, Canvas 2D.
