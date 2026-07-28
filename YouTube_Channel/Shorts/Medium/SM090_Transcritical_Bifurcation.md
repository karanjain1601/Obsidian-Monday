---
title: "Transcritical Bifurcation — Stability Exchange"
id: SM090
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, transcritical-bifurcation, dynamical-systems, stability-exchange, bifurcation-theory]
---

> **What it is:** A ~45-second simulation short where two fixed points on a 1D phase line pass through each other and exchange stability as a parameter sweeps through zero, demonstrating the transcritical bifurcation governing the epidemic threshold at R₀ = 1 and population collapse in logistic growth models. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Transcritical Bifurcation — Stability Exchange

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Two fixed points on a 1D phase line — one stable (filled circle), one unstable (open circle) — approaching each other as a parameter increases. At a critical value they pass through each other. After crossing: the formerly stable is now unstable, and the formerly unstable is now stable. They exchange identities.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Normal form: ẋ = μx - x². Fixed points: x=0 (always exists) and x=μ (exists for all μ). Stability at x=0: λ = μ (unstable for μ>0, stable for μ<0). Stability at x=μ: λ = -μ (unstable for μ<0, stable for μ>0). Caption: "Exchange of stability at μ=0."

**0:10–0:18** — Bifurcation diagram: both fixed points x=0 (horizontal line) and x=μ (diagonal line) cross at the origin. Below the crossing: x=0 solid (stable), x=μ dashed (unstable). After crossing: x=0 dashed, x=μ solid. Caption: "Both branches always exist — stability swaps."

**0:18–0:27** — Contrast with pitchfork: in pitchfork, x=0 remains and two new branches are born. In transcritical: no new branches — stability just exchanges between the two existing fixed points. Caption: "Unlike pitchfork: no symmetry required. Unlike saddle-node: no annihilation."

**0:27–0:36** — Real example: logistic growth model. dN/dt = rN(1 - N/K). Fixed points: N=0 (extinction — unstable for r>0) and N=K (carrying capacity — stable for r>0). As r changes sign (negative growth → positive), stability exchanges: extinction becomes stable (population collapses), carrying capacity becomes unstable. Caption: "Logistic model: N=0 vs N=K exchange stability at r=0."

**0:36–0:45** — SIR model: dI/dt = (βS/N - γ)I. Fixed points: I=0 (no infection) and I=I* (endemic). When βS/N = γ (R₀=1): transcritical bifurcation. Caption: "SIR epidemic threshold: transcritical bifurcation at R₀=1." Bold text: "Transcritical bifurcation — epidemics, populations, and stability exchange." Fade to black.

## Physics Concept Teased
Transcritical bifurcation: two fixed points exchange stability as a parameter passes through a critical value. Unlike the saddle-node (fixed points annihilate) or pitchfork (new branches born), both fixed points exist for all parameter values — only their stability swaps. This is the mathematical model for the epidemic threshold (R₀=1) and population dynamics.

## On-Screen Text / Captions
- **0:00** — "Two equilibria — they exchange stability."
- **0:05** — "ẋ = μx - x²: x=0 and x=μ swap at μ=0"
- **0:12** — "No annihilation. No new branches. Just exchange."
- **0:20** — "Contrast: SN (annihilate) | Pitchfork (new branches)"
- **0:28** — "Logistic: N=0 vs N=K — stability exchange at r=0"
- **0:35** — "SIR: epidemic threshold R₀=1 — transcritical bifurcation"
- **0:43** — "Transcritical: epidemics, populations, stability."

## End Card
Final 3 seconds: bifurcation diagram with stability exchange highlighted at the crossing point. Text: "COVID-19 epidemic threshold: when R₀ fell below 1, the 'no-epidemic' fixed point became stable." CodedLaws logo.

## Audio
Two alternating tones (representing two fixed points) swapping dominance as μ crosses zero. Voiceover at 0:00: "The epidemic threshold — when R₀ equals 1 — is a transcritical bifurcation: the disease-free state and endemic state exchange stability." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: phase line plots for ẋ = μx - x². For each μ: draw ẋ vs x as a parabola; mark fixed points; draw flow arrows (right where ẋ>0, left where ẋ<0). Stability: at x* stable if f'(x*) < 0. Bifurcation diagram: plot x*(μ) for both branches with solid/dashed style. Logistic model: dN/dt = rN(1-N/K); plot N* vs r. SIR threshold: dI/dt vs I; mark threshold at R₀=1. Animate μ sweeping to show stability exchange in real time. Runtime: real-time Canvas 2D, trivially fast.
