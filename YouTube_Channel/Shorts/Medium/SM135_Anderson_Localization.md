---
title: "Anderson Localization — Disorder Trapping a Wave"
id: SM135
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, condensed-matter, anderson-localization, disorder, quantum, wave-transport]
---

> **What it is:** A ~45-second simulation short where a quantum wave that spreads freely through a clean lattice is suddenly frozen in place when random on-site disorder is added, as constructive interference of all backscattered paths exponentially localizes the wavefunction — contrasted with a 3D Anderson metal-insulator transition. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Anderson Localization — Disorder Trapping a Wave

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A wave (quantum particle) propagates through a perfectly ordered lattice — spreading freely to the right. Then the lattice gains random disorder (scattering sites). The wave tries to propagate — but instead freezes in place. The interference of all possible scattering paths traps the wave completely. Localization.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The model: tight-binding Hamiltonian on a 1D lattice: H = -t Σᵢ (|i⟩⟨i+1| + h.c.) + Σᵢ εᵢ|i⟩⟨i|. Hopping t: kinetic energy. On-site energy εᵢ: disorder, drawn uniformly from [-W/2, W/2]. Caption: "Disorder W traps electrons — Anderson 1958, Nobel 1977." Without disorder: Bloch waves extend through the entire lattice.

**0:10–0:18** — 1D localization: in 1D, all states are localized for any disorder W > 0. Localization length ξ ≈ 100a·(t/W)² for W << t. Wavefunction: |ψ(x)|² ∝ exp(-2|x-x₀|/ξ). Caption: "In 1D: all states localize for any disorder W > 0." Show |ψ|² decaying exponentially from the peak.

**0:18–0:27** — 2D: all states localized for any disorder (but ξ can be very large). 3D: Anderson transition at a critical disorder W_c. For W < W_c: extended (metallic). For W > W_c: localized (insulating). The transition is a quantum phase transition. Caption: "3D: metal-insulator transition at W = W_c (Anderson transition)." Show the transition.

**0:27–0:36** — Physical mechanism: multiple scattering paths interfere. Without disorder: forward paths dominate. With disorder: back-scattered paths acquire random phases — but the time-reversed pair always interferes constructively (weak localization → strong localization). Caption: "Constructive interference of time-reversed paths — weak → strong localization." Show interference diagram.

**0:36–0:45** — Experiments: (1) Microwaves in a 3D disordered waveguide — transmission drops exponentially with length. (2) Cold atoms in a speckle potential — matter-wave Anderson localization (Aspect group 2008). Caption: "Cold atoms: first direct observation of Anderson localization (2008)." Bold text: "Anderson localization — disorder traps a quantum wave." Fade to black.

## Physics Concept Teased
Anderson localization: in a disordered potential, quantum interference traps propagating waves. All eigenstates are localized in 1D and 2D for any disorder; in 3D there is a quantum phase transition (the Anderson transition) between extended (metal) and localized (insulator) regimes. The localized wavefunction decays exponentially from its centre.

## On-Screen Text / Captions
- **0:00** — "Disorder traps a quantum wave — forever."
- **0:05** — "H = -t Σ hop + Σ random site energy"
- **0:12** — "1D: all states localize; |ψ|² ∝ exp(-2|x-x₀|/ξ)"
- **0:20** — "3D: metal-insulator Anderson transition at W_c"
- **0:28** — "Mechanism: constructive interference of back-scattered pairs"
- **0:35** — "Cold atoms (2008): direct Anderson localization"
- **0:43** — "Disorder traps the wave — quantum interference."

## End Card
Final 3 seconds: the |ψ|² profile — a sharp exponential peak in the centre of a disordered lattice. Text: "Anderson localization also applies to light, sound, and seismic waves — not just electrons." CodedLaws logo.

## Audio
A propagating wave sound, then sudden silence when localization sets in. Voiceover at 0:00: "In a perfectly ordered crystal, electrons travel freely. Add disorder — random scattering — and quantum interference can trap the electron completely in place." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: exact diagonalization of the 1D (or 2D) tight-binding Hamiltonian with Anderson disorder. Matrix size N×N (N=200 sites). Use scipy.linalg.eigh (or equivalent JS library). Plot all eigenstates as |ψ|². Localization length: fit exponential to the tails of each eigenstate. For time evolution: compute ψ(t) = Σₙ cₙ exp(-iEₙt/ℏ)|ψₙ⟩. Show spreading (W=0) vs localisation (W/t=2). IPR (inverse participation ratio): I = Σᵢ |ψᵢ|⁴ — large I = localized. Runtime: eigendecomposition is fast; animation is Canvas 2D real-time.
