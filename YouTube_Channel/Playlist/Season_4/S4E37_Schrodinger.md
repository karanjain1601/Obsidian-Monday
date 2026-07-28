---
title: "I Simulated a Quantum Particle. It Was Everywhere at Once."
season: 4
episode: 37
difficulty: 7.5/10
concept: "Schrödinger equation, wavefunction, and unitary evolution"
prereq: "E21, E22 (PDE + implicit methods)"
tags: [Schrödinger-equation, wavepacket-simulation, quantum-mechanics, Crank-Nicolson, javascript, probability-density, quantum-simulation, Born-rule]
type: playlist-video
---

## S4·E37 — "I Simulated a Quantum Particle. It Was Everywhere at Once."

- **Alt title:** "The Schrödinger Equation in Code: Probability Clouds, Not Billiard Balls"
- **Difficulty:** 7.5/10 · **Prereq:** E21, E22 (PDE + implicit methods)
- **Hook:** A Gaussian wavepacket bouncing around a potential well — spreading, reflecting, interfering with itself. You are watching the probability *density* evolve in time, not the position of a particle.
- **The break (bug):** Explicit (FTCS — Forward Time, Centered Space) integration of the Schrödinger equation is unconditionally unstable: the norm of ψ grows without bound because the explicit scheme is not unitary. Total probability increases past 1.0 and eventually overflows. Fix: Crank-Nicolson implicit scheme, which is guaranteed unitary (norm-preserving) for all timesteps because it is time-reversal symmetric.
- **Concept introduced:** Schrödinger equation `iℏ∂ψ/∂t = Ĥψ = [-ℏ²/2m · ∂²/∂x² + V(x)]ψ`, complex wavefunction ψ(x,t), probability density |ψ|² (Born rule), wavepacket as a superposition of energy eigenstates, and why quantum evolution must be unitary (probability must be conserved).
- **Push it / wow moment:** Double potential well — two wells separated by a barrier. Watch the wavepacket tunnel between wells and beat between the symmetric and antisymmetric eigenstates. The "collapse" at measurement: sample a random position from |ψ|² and show the wavefunction instantly concentrating there.
- **Demo:** Click to place a wavepacket with adjustable position and initial momentum. Draw potential barriers and wells. Watch the norm display stay at 1.0. Toggle explicit vs. Crank-Nicolson to see the norm explode.
- **Tags:** `Schrödinger-equation` `wavepacket-simulation` `quantum-mechanics` `Crank-Nicolson` `javascript` `probability-density` `quantum-simulation` `Born-rule`
- **Thumbnail:** A glowing Gaussian wavepacket splitting at a barrier — transmitted fraction on the right, reflected fraction on the left.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
