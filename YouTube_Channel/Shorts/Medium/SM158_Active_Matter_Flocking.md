---
title: "Active Matter — Flocking with Alignment Noise"
id: SM158
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, active-matter, flocking, Vicsek, polar-order, noise-driven-transition]
---

> **What it is:** A ~45-second simulation short where 1000 self-propelled particles aligning with their neighbours snap from disordered random motion into a coherent polar flock when noise is reduced, then melt back into disorder when noise is raised, demonstrating the Vicsek first-order phase transition and the giant density fluctuations that distinguish active flocking from equilibrium ferromagnetism. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Active Matter — Flocking with Alignment Noise

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
1000 self-propelled particles move in random directions (high noise). They turn to align with nearby neighbours. Suddenly the noise is reduced — and the particles collectively order into a coherent flock, streaming together. Then noise is increased again — the flock melts back into disorder. A reversible phase transition driven by noise.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Vicsek model: N particles, each moving at constant speed v₀. At each step: new direction = average of neighbours' directions + noise η. θᵢ(t+dt) = arg(Σⱼ e^{iθⱼ}) + ηᵢ where ηᵢ ~ U[-η/2, η/2]. Caption: "Vicsek 1995: align with neighbours + noise → flocking transition." Order parameter: φ = |Σᵢ e^{iθᵢ}|/N.

**0:10–0:18** — Phase transition: at high noise η > η_c: disordered (φ≈0). At low noise η < η_c: ordered flock (φ≈1). The transition is first-order (discontinuous φ jump) in 2D — Vicsek originally thought it was second-order (Chaté 2004 showed first-order). Caption: "Vicsek transition: first-order in 2D — discontinuous jump in φ." Show φ(η) plot with hysteresis.

**0:18–0:27** — Giant density fluctuations: in the ordered flock, density fluctuations are anomalously large — ΔN ∝ N^α with α ≈ 0.8 > 0.5 (larger than equilibrium). Dense "bands" of particles form and propagate through the disordered background. Caption: "Giant density fluctuations: ΔN ∝ N^0.8 — not equilibrium statistics." Show propagating density bands.

**0:27–0:36** — Hydrodynamics of active matter: Toner-Tu equations (1995/1998): ∂ₜρ + ∇·(ρv) = 0; ∂ₜv + λ(v·∇)v = -∇P + Γ(a-|v|²)v + D∇²v + noise. These are Navier-Stokes with a self-propulsion term. They predict anomalous long-range order (true long-range order in 2D active matter — unlike passive matter). Caption: "Toner-Tu: 2D flocks have true long-range order — unlike equilibrium 2D."

**0:36–0:45** — Biology: murmuration of starlings (SM078), fish schools (SM079), bacterial colonies — all show Vicsek-like physics. Key property: the flock is robust (turns collectively to avoid predators). Caption: "Murmuration: Vicsek physics — 500,000 birds, one order parameter." Bold text: "Active matter — the physics of living flocks." Fade to black.

## Physics Concept Teased
Vicsek model: N self-propelled particles align with neighbours, competing with noise η. The model shows a first-order phase transition at η_c from disorder to polar order (flocking). Unlike equilibrium ferromagnets, 2D active matter can have true long-range order (Mermin-Wagner theorem does not apply). Giant density fluctuations (ΔN∝N^0.8) and propagating density bands are hallmarks.

## On-Screen Text / Captions
- **0:00** — "Noise controls the flock — Vicsek transition."
- **0:05** — "Vicsek 1995: θᵢ = avg(neighbours) + η → flock"
- **0:12** — "First-order transition: φ jumps at η_c — hysteresis"
- **0:20** — "Giant density fluctuations: ΔN ∝ N^0.8"
- **0:28** — "Toner-Tu: 2D active matter has true long-range order"
- **0:35** — "Murmuration: 500,000 birds, one Vicsek order parameter"
- **0:43** — "Active matter — noise drives the flock transition."

## End Card
Final 3 seconds: the ordered flock — all arrows pointing right, a few stragglers quickly aligning. Text: "Unlike a 2D magnet (no long-range order by Mermin-Wagner), 2D active flocks have true long-range order — a new universality class." CodedLaws logo.

## Audio
Wind rushing sound that intensifies as the flock orders. Voiceover at 0:00: "Lower the noise, and a thousand random walkers snap into a coherent flock — a phase transition in active matter, first discovered by Vicsek in 1995." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: Vicsek model, N=1000 particles, speed v₀=0.03 (in units of domain size L=1), interaction radius r=0.1, noise η. At each step: for each i, find all j with |r_i - r_j| < r_int. Compute average angle θ_avg = arg(Σⱼ e^{iθⱼ}). New angle: θᵢ = θ_avg + η·(U-0.5) where U ~ Uniform[0,1]. Update: x_i += v₀·cos(θᵢ)·dt. Periodic BCs. Order parameter φ = |Σᵢ e^{iθᵢ}|/N. Sweep η from 2 to 0.1 and back: show hysteresis. Density field: coarse-grain on grid → show propagating bands. Runtime: O(N²) naive; O(N) with cell list. Real-time Canvas 2D.
