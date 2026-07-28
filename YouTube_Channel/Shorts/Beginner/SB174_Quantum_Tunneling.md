---
title: "Quantum Tunneling: Particles Walk Through Walls"
id: SB174
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, quantum-tunneling, wave-function]
---

> **What it is:** A ~45-second simulation short where a glowing green electron wave packet hits a solid grey potential barrier and partially emerges as a dimmer packet on the far side while part reflects back, revealing that quantum wave functions decay exponentially through classically forbidden regions rather than stopping completely. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Quantum Tunneling: Particles Walk Through Walls
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A glowing green wave packet (electron) approaches a solid grey rectangular barrier that should be physically impenetrable. The wave hits — and part of it PASSES THROUGH, emerging as a dimmer green packet on the other side, while the rest reflects back. A classical particle would bounce off. The quantum one goes through. Impossible — yet real.

## Main Visual Sequence (0:03–0:50)
**0:03** — 1D potential energy diagram (horizontal axis = position, vertical axis = energy). Green wave packet moving right (kinetic energy KE = 2 eV, shown as packet height). Grey rectangular barrier (height V₀ = 5 eV, width d = 0.3 nm) in the center. KE < V₀ — classically forbidden.

**0:10** — Wave packet reaches barrier. Inside the barrier, the wave function doesn't stop — it decays exponentially: ψ(x) ∝ e^(−κx) where κ = √(2m(V₀−KE))/ħ. Green color fades to dim green inside the grey barrier. "Wave function decays but doesn't vanish."

**0:18** — On the other side: the decayed wave function emerges with reduced but nonzero amplitude. Transmission probability T ≈ e^(−2κd). Numbers: κ = √(2 × 9.11×10⁻³¹ × (5−2)×1.6×10⁻¹⁹)/ħ = 8.87×10⁹ m⁻¹. d = 0.3nm. T = e^(−2 × 8.87×10⁹ × 3×10⁻¹⁰) = e^(−5.32) = 0.48%. Label: "0.48% probability of tunneling through."

**0:27** — Sliders: barrier width d increases from 0.1→1.0 nm. T drops exponentially: 40% → 0.003%. Barrier height V₀ increases: T drops faster still. "Thin barriers and small energy deficits allow significant tunneling."

**0:35** — Real-world examples: scanning tunneling microscope (STM) — tunneling current between tip and surface maps individual atoms. Alpha decay — alpha particle tunnels out of nucleus. Tunnel diode — fast electronics. Flash memory — electrons tunnel to store data. Grid of examples shown.

**0:43** — Mind-bending: "The Sun fuses hydrogen partly via quantum tunneling — without it, the Sun would be 100× colder and Earth uninhabitable." Solar fusion diagram with tunneling label. CodedLaws logo.

## Physics Concept Teased
Quantum tunneling occurs because quantum wave functions don't abruptly stop at potential energy barriers — they decay exponentially inside and emerge with nonzero amplitude on the far side. The tunneling probability T ∝ e^(−2κd) depends sensitively on barrier width and height, making tunneling significant only at the quantum scale but enabling technologies from flash memory to scanning tunneling microscopes.

## On-Screen Text / Captions
- 0:03 → "KE = 2 eV, barrier = 5 eV — classically impossible"
- 0:10 → "Wave decays inside barrier: ψ ∝ e^(−κx)"
- 0:18 → "T = e^(−2κd) = 0.48% — quantum leakage!"
- 0:27 → "Thinner barrier → exponentially more tunneling"
- 0:35 → "STM, alpha decay, flash memory, tunnel diodes"
- 0:43 → "The Sun shines because of quantum tunneling"

## End Card
Final 3 seconds: Green wave packet passing through grey barrier, partial reflection behind. Text: "The universe leaks. Quantum mechanics says so." CodedLaws subscribe.

## Audio
Mysterious, slightly eerie ambient electronic music. "Whoosh" sound as wave packet impacts barrier; softer echo of that whoosh as the transmitted packet emerges on far side. Voiceover: "A classical ball bounces off a wall every time. A quantum particle can walk right through it." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: simulate 1D Gaussian wave packet using split-operator method (FFT-based quantum propagation): apply kinetic energy propagator in k-space, then potential energy propagator in x-space, alternate. This gives exact quantum tunneling dynamics. Display probability density |ψ|² colored by momentum sign. Runtime: pre-rendered for computational smoothness. Gotcha: split-operator requires complex arrays — use typed arrays; normalize ψ each step to prevent drift.
