---
title: "Polymer Coil-to-Globule Transition — Theta Point"
id: SM165
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, polymer-physics, coil-globule, theta-point, Flory, phase-transition, soft-matter]
---

> **What it is:** A ~45-second simulation short where a 100-monomer polymer chain swells into an open coil with R ∝ N^(3/5) in good solvent and collapses into a compact globule with R ∝ N^(1/3) in poor solvent, passing through the theta point where Gaussian statistics hold, demonstrating Flory theory's coil-to-globule transition as the physical basis for protein folding. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Polymer Coil-to-Globule Transition — Theta Point

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A single polymer chain of 100 monomers — in a good solvent (high temperature): the chain is an expanded, open coil, end-to-end distance R ∝ N^(3/5). Lower the temperature: the chain collapses — the monomers attract each other and the chain shrinks into a compact globule, R ∝ N^(1/3). At the exact theta temperature: R ∝ N^(1/2) — random walk statistics.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Flory theory: end-to-end distance R as a function of chain length N and solvent quality. Flory exponent ν: R ∝ N^ν. Good solvent (χ < 0.5): ν = 3/5 = 0.6 (excluded volume). Theta solvent (χ = 0.5): ν = 1/2 (ideal, Gaussian chain). Poor solvent (χ > 0.5): ν = 1/3 (compact globule). Caption: "ν = 3/5 (good), 1/2 (theta), 1/3 (poor) — Flory exponents."

**0:10–0:18** — Flory-Huggins parameter χ: monomer-solvent interaction. χ < 0.5: solvent-monomer interactions energetically preferred (good solvent). χ > 0.5: monomer-monomer interactions preferred (poor solvent, collapse). Theta temperature T_θ: where χ = 0.5 exactly. Caption: "χ = 1/2 at T_θ: second virial coefficient B₂ = 0 — theta point." At T_θ, excluded volume is exactly cancelled by attractive interactions.

**0:18–0:27** — Coil-globule transition: as χ increases past 0.5, the chain collapses. The collapse is a continuous transition (in mean field) or first-order-like for finite N. The radius of gyration Rg = √(⟨r²⟩/6N) drops from Rg ∝ N^0.6 to Rg ∝ N^0.33. Caption: "Rg: continuous collapse — N^0.6 → N^0.33 as χ crosses 0.5." Show Rg vs χ for several N.

**0:27–0:36** — Monte Carlo simulation: bead-spring chain on a lattice (self-avoiding walk for good solvent, attractive beads for poor solvent). At each step: attempt to move a monomer; accept/reject with Metropolis criterion (energy change ΔE includes χ-dependent monomer-monomer interactions). Measure Rg vs χ at different T. Caption: "Monte Carlo: self-avoiding walk with Metropolis → Rg(χ)." Show chain conformations at ν=3/5, 1/2, 1/3.

**0:36–0:45** — Protein folding analogy: a protein is a specific polymer sequence. In physiological conditions, most proteins are at their equivalent of poor-solvent conditions for the hydrophobic core — they collapse (fold). The coil-globule transition is the unfolded-to-folded transition. Denaturation = good-solvent conditions (high temperature or denaturing agents). Caption: "Protein folding = coil-to-globule transition of a specific sequence." Bold text: "Coil-globule — the simplest model of protein folding." Fade to black.

## Physics Concept Teased
Polymer coil-to-globule transition: a polymer chain transitions from an expanded coil (end-to-end distance R∝N^(3/5)) in good solvent to a compact globule (R∝N^(1/3)) in poor solvent, passing through the theta point (R∝N^(1/2)) where excluded volume is cancelled by attractions (χ=1/2). Flory theory gives the critical exponents. Protein folding is the sequence-specific version of this transition.

## On-Screen Text / Captions
- **0:00** — "Hot: open coil. Cold: compact globule. The theta point."
- **0:05** — "ν = 3/5 (good), 1/2 (theta), 1/3 (globule) — Flory"
- **0:12** — "χ = 1/2 = theta point: B₂ = 0 — excluded volume cancels"
- **0:20** — "Rg: N^0.6 → N^0.33 as χ crosses 0.5"
- **0:28** — "Monte Carlo: Metropolis chain collapse — Rg(χ)"
- **0:35** — "Protein folding = coil-to-globule of a specific sequence"
- **0:43** — "Coil-globule — the physics of protein folding."

## End Card
Final 3 seconds: three chain conformations side by side — expanded coil (left, ν=3/5), theta chain (middle, ν=1/2), compact globule (right, ν=1/3). Text: "The exact Flory exponent ν=0.588 (good solvent) matches field-theory calculations and simulations — Flory's 3/5 estimate is remarkably close." CodedLaws logo.

## Audio
Temperature decreasing sound (falling tone). Voiceover at 0:00: "A long polymer chain expands in a good solvent, but cool it down — or change the solvent — and it collapses into a tight ball. This is the coil-to-globule transition, and it's the physics underlying protein folding." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (3D chain projected) or three.js. Key algorithm: Monte Carlo simulation of a bead-spring chain. Lattice: N=100 monomers on a cubic lattice. Moves: single monomer pivot (pivot algorithm — most efficient for polymers). Energy: E = Σ_contacts (ε_mm × χ) where ε_mm < 0 for attractive. Accept/reject: Metropolis criterion. For good solvent: self-avoiding walk (no contacts allowed). For poor solvent: contacts allowed, attractive. Measure: Rg² = (1/N)Σ(rᵢ-r_cm)². Sweep χ from 0 to 1; plot Rg vs χ for N=50, 100, 200. Scaling: on a log-log plot, Rg vs N for each χ should have slope ν. Runtime: CPU, fast for N=100; Canvas 2D visualisation.
