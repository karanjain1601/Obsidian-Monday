---
title: "Motility-Induced Phase Separation — Active Particles"
id: SM157
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, active-matter, MIPS, phase-separation, self-propelled, statistical-mechanics]
---

> **What it is:** A ~45-second simulation short where 2000 self-propelled active Brownian particles with no attractive interactions spontaneously separate into a dense slow cluster coexisting with a dilute fast gas, demonstrating motility-induced phase separation driven entirely by the positive feedback between local density and particle speed. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Motility-Induced Phase Separation — Active Particles

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A sea of self-propelled particles — each moving in a random direction, constantly reorienting. They collide, slow down (dense regions slow them more). Spontaneously, a dense cluster forms: the dense phase (slow, crowded particles) coexists with a dilute phase (fast, uncrowded). Phase separation — without any attractive interactions, purely from self-propulsion.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — MIPS mechanism: self-propelled particles slow down in dense regions (they pile up behind slower particles). Denser regions → slower → even denser (positive feedback). Sparser regions → faster → particles leave → even sparser. This spinodal-like instability drives phase separation. Caption: "Dense → slow → denser: MIPS — positive feedback spinodal." Cates-Tailleur 2015.

**0:10–0:18** — Run-and-tumble phase diagram: control parameters (ρ, Pe) where Pe = v₀τ_r/σ is the Peclet number (v₀ = speed, τ_r = rotational diffusion time, σ = particle size). MIPS occurs for Pe > Pe_c(ρ) and ρ above ρ_c. Caption: "Phase diagram: MIPS for Pe > Pe_c — activity drives phase separation." Show (ρ, Pe) phase diagram with MIPS region.

**0:18–0:27** — Effective equilibrium: Tailleur-Cates (2008) showed that a self-propelled particle with spatially varying speed v(x) behaves like an equilibrium particle in an effective potential -ln(v(x)). MIPS maps to an equilibrium liquid-gas phase separation with an effective free energy. Caption: "Effective free energy: F_eff ∝ ∫[ρ ln(ρ/v(ρ)) + ρ] dx." Maxwell construction gives coexisting densities.

**0:27–0:36** — Simulation: N=2000 Active Brownian Particles (ABPs). Each: ẋ = v₀·e(θ) + √(2D_t)·ξ_x; ẏ = v₀·e(θ) + √(2D_t)·ξ_y; θ̇ = √(2D_r)·ξ_θ. Steric repulsion (Weeks-Chandler-Andersen potential). At Pe=50: MIPS phase separation visible. Caption: "2000 ABPs at Pe=50: MIPS cluster forms within seconds."

**0:36–0:45** — Real systems: (1) E. coli at high density: MIPS-like dense phase seen experimentally. (2) Light-activated Janus particles (SiO₂ with Pt cap): activity controlled by light intensity. (3) Vibrated granular rods: MIPS in dry active matter. Caption: "Janus particles: MIPS controlled by light — active switches." Bold text: "MIPS — phase separation with no attraction, only activity." Fade to black.

## Physics Concept Teased
Motility-Induced Phase Separation (MIPS): self-propelled particles with density-dependent speed undergo spontaneous phase separation into a dense (slow) and dilute (fast) phase, even without attractive interactions. The mechanism is a positive feedback: dense regions slow particles, which makes them denser. Tailleur-Cates theory maps MIPS to equilibrium phase separation with an effective free energy.

## On-Screen Text / Captions
- **0:00** — "Self-propelled particles separate — MIPS."
- **0:05** — "Dense → slow → denser: MIPS positive feedback"
- **0:12** — "Pe > Pe_c: Peclet number drives phase separation"
- **0:20** — "Effective free energy: MIPS = active equilibrium phase separation"
- **0:28** — "2000 ABPs, Pe=50: MIPS cluster forms"
- **0:35** — "Janus particles: MIPS controlled by light"
- **0:43** — "MIPS — activity alone drives phase separation."

## End Card
Final 3 seconds: the steady-state MIPS configuration — one large dense cluster (bright particles, tightly packed) against a sparse background. Text: "MIPS was predicted theoretically by Cates and Tailleur in 2015 and observed in experiments in 2016 using synthetic Janus colloids." CodedLaws logo.

## Audio
Particle collision sounds (soft clinks). Voiceover at 0:00: "Self-propelled particles spontaneously separate into a dense cluster and a dilute gas — with no attraction, no glue. Just the self-reinforcing slowdown from crowding." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (particle positions). Key algorithm: Active Brownian Particles (ABP) simulation. N=2000 particles in a box with periodic BCs. Update: x_i += v₀·cos(θᵢ)·dt + √(2D_t·dt)·N(0,1); similarly for y; θᵢ += √(2D_r·dt)·N(0,1). WCA potential: U(r) = 4ε[(σ/r)^12 - (σ/r)^6] + ε for r < 2^(1/6)σ. Use cell-list for O(N) neighbor search. For MIPS: set v₀ high, D_r moderate, ρ=0.5. Track density field (coarse-grain to 20×20 grid): should show one large high-density region. Runtime: Canvas 2D, ~30 fps for N=2000 with cell lists.
