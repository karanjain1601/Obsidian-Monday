---
title: "Kuramoto Model — Global Synchronisation"
id: SM081
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, synchronisation, kuramoto-model, coupled-oscillators, phase-transition]
---

> **What it is:** A ~45-second simulation short where 100 oscillators spinning at random speeds on a phase circle spontaneously lock together into a single rotating cluster when coupling exceeds the critical threshold, demonstrating the Kuramoto model's mean-field phase transition from incoherence to global synchrony. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Kuramoto Model — Global Synchronisation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
100 oscillators shown as coloured dots on a circle (their phases), spinning at different speeds. Total chaos. Then a coupling K slider advances — and at a critical value the dots suddenly cluster together and spin as one. A sharp phase transition from incoherence to synchrony.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Kuramoto model: dφ_i/dt = ω_i + (K/N)Σ_j sin(φ_j - φ_i). ω_i drawn from a Lorentzian distribution g(ω) = (γ/π)/(ω² + γ²). The mean field: r·e^{iψ} = (1/N)Σe^{iφ_j}. r = order parameter (r=0: incoherent, r=1: perfect sync). Caption: "r = order parameter: 0 (chaos) → 1 (sync)."

**0:10–0:18** — The critical coupling K_c = 2γ (for Lorentzian distribution): below K_c, r=0. Above K_c, r > 0. The mean-field result: r = √(1 - K_c/K) for K > K_c — a square root critical scaling. Plot of r vs K showing this sharp transition. Caption: "K_c = 2γ. Transition: r ∝ √(K-K_c)."

**0:18–0:27** — Phase animation: all oscillators shown on the phase circle. At K < K_c: dots spread uniformly (r=0). Slowly increase K. At K = K_c: a density wave forms — most oscillators still incoherent, but a small cluster has locked. For K >> K_c: almost all oscillators locked in one cluster. Caption: "Entrainment: fast/slow oscillators lock to the mean field."

**0:27–0:36** — Order parameter r(t) shown as it evolves toward equilibrium. For K slightly above K_c: slow convergence (critical slowing down). For large K: fast convergence. The fluctuation of r around the mean → N^{-1/2} for finite N. Caption: "Finite-N fluctuations: σ_r ∝ 1/√N."

**0:36–0:45** — Applications: power grid frequency synchronisation (generators = Kuramoto oscillators), neural synchrony (gamma oscillations), pacemaker cells, laser arrays. Bold text: "Kuramoto model — the theory of synchronisation." Fade to black.

## Physics Concept Teased
Kuramoto model: N phase oscillators with different natural frequencies, coupled via the mean field sin(φ_j - φ_i). Above a critical coupling K_c = 2γ, the oscillators spontaneously synchronise — a mean-field phase transition. The order parameter r grows as √(K - K_c) — universal critical scaling independent of system details.

## On-Screen Text / Captions
- **0:00** — "100 oscillators — different speeds. Then: sync."
- **0:05** — "dφ/dt = ω_i + (K/N)Σsin(φ_j - φ_i)"
- **0:12** — "K_c = 2γ — critical coupling for sync"
- **0:20** — "r ∝ √(K - K_c) — critical scaling"
- **0:28** — "Finite-N fluctuations: σ_r ∝ 1/√N"
- **0:35** — "Power grids, neurons, pacemakers, lasers"
- **0:43** — "Kuramoto — the theory of synchronisation."

## End Card
Final 3 seconds: 100 oscillators in perfect sync, all one colour, spinning as one on the phase circle. Text: "Yoshiki Kuramoto, 1975 — solved on a napkin at a conference." CodedLaws logo.

## Audio
Arrhythmic clicking (different rates for different oscillators). At synchrony: clicks merge into one steady tick. Sharp musical resolution chord at the synchrony transition. Voiceover at 0:00: "Oscillators with different natural frequencies — couple them strongly enough and they spontaneously synchronise." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: Kuramoto model on N=100 oscillators. ω_i drawn from Lorentzian (or Gaussian for approximation) distribution. Each step: compute mean field r·e^{iψ} = (1/N)Σe^{iφ_j}. Update: φ_i += (ω_i + K·r·sin(ψ - φ_i))·dt. Draw oscillators as dots on the unit circle at angle φ_i, coloured by ω_i (slow=blue, fast=red). Order parameter r shown as the magnitude of the mean field vector. K slider for interactive exploration. Runtime: real-time Canvas 2D.
