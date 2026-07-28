---
title: "Coupled Pendulum Energy Transfer"
id: SM083
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, coupled-oscillators, pendulum, normal-modes, energy-transfer, resonance]
---

> **What it is:** A ~45-second simulation short where two spring-linked pendulums hypnotically trade all their kinetic energy back and forth as a superposition of symmetric and antisymmetric normal modes beats at the difference frequency, demonstrating resonant energy transfer between coupled oscillators. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Coupled Pendulum Energy Transfer

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Two pendulums hang side by side, connected by a light spring. The left pendulum is pulled and released — it swings. Within 3 seconds, the left pendulum has nearly stopped and all its motion has transferred to the right pendulum. Then the energy transfers back. Hypnotic exchange.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Normal mode 1 (symmetric): both pendulums swing in phase — both left, both right simultaneously. Frequency: ω₁ = √(g/L). No energy exchange. Caption: "Symmetric mode ω₁ = √(g/L) — no energy transfer."

**0:10–0:18** — Normal mode 2 (antisymmetric): pendulums swing out of phase — right when other is left. The spring is stretched and compressed. Frequency: ω₂ = √(g/L + 2k/m). Caption: "Antisymmetric mode ω₂ = √(g/L + 2k/m) — spring compressed."

**0:18–0:27** — Beat frequency: the general motion is a superposition of both modes. The beat frequency ω_beat = ω₂ - ω₁ = Δω. Energy oscillates between pendulums at frequency ω_beat/2. Caption: "Beat period: T_beat = 2π/Δω." Complete energy transfer takes T_beat/2 time. The slower the spring (smaller k), the longer the beat.

**0:27–0:36** — Generalisation: three coupled pendulums. Three normal modes shown. Energy hops between pendulums in more complex patterns — Fermi-Pasta-Ulam recurrence demonstrated: energy returns to the original mode after a long time. Caption: "FPU recurrence: energy returns to mode 1."

**0:36–0:45** — Application: coupled tuned mass dampers in skyscrapers (Taipei 101 pendulum). A large pendulum damper absorbs oscillation energy from the building. Caption: "Taipei 101: 660-tonne pendulum damper — coupled oscillator." Bold text: "Coupled pendulums — energy as a wave between modes." Fade to black.

## Physics Concept Teased
Coupled pendulums: two identical pendulums weakly linked by a spring decompose into two normal modes (symmetric and antisymmetric). The initial condition (one pendulum displaced) is a superposition of both modes, beating at frequency Δω = ω₂ - ω₁. Energy alternately concentrates in each pendulum — a classical analogue of quantum tunnelling.

## On-Screen Text / Captions
- **0:00** — "Energy transfers from one pendulum to the other."
- **0:05** — "Normal mode 1: ω₁ = √(g/L)"
- **0:12** — "Normal mode 2: ω₂ = √(g/L + 2k/m)"
- **0:20** — "Beat period T = 2π/(ω₂-ω₁): energy oscillates"
- **0:28** — "Three pendulums: FPU recurrence"
- **0:35** — "Taipei 101: 660-tonne pendulum damper"
- **0:43** — "Coupled pendulums — energy as a wave between modes."

## End Card
Final 3 seconds: the two pendulums mid-transfer — left nearly stationary, right at maximum swing. Text: "The same math governs atomic vibrations in crystals (phonons)." CodedLaws logo.

## Audio
Clean, harmonic tones — one tone per pendulum, frequency mapped to its instantaneous amplitude. As energy transfers, one tone fades and the other rises. Voiceover at 0:00: "Two pendulums linked by a spring don't share energy evenly — they take turns." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: two coupled ODEs — θ̈₁ = -(g/L)θ₁ - (k/m)(θ₁-θ₂); θ̈₂ = -(g/L)θ₂ - (k/m)(θ₂-θ₁). Integrate with RK4. Initial conditions: θ₁=A, θ₂=0, θ̇₁=θ̇₂=0. Normal modes: θ+ = θ₁+θ₂ (symmetric), θ- = θ₁-θ₂ (antisymmetric). Decompose: θ₁ = (θ+ + θ-)/2 = A/2(cos(ω₁t) + cos(ω₂t)) = A·cos(Δω·t/2)·cos(ω̄t). Visualise: draw two pendulums as lines with bobs; spring as a zigzag between them. Energy: E_i = (1/2)m|v_i|² + (1/2)mω₁²θᵢ². Runtime: real-time Canvas 2D.
