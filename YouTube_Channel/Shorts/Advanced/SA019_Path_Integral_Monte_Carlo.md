---
title: "Path Integral Monte Carlo: Quantum Particle Rings"
id: SA019
type: youtube-short
duration: "~45 seconds"
feeds_video: "Quantum Monte Carlo: Path Integrals and Thermal Quantum Systems"
difficulty: advanced
tags: [physics, simulation, short, advanced, pimc, path-integral, monte-carlo, quantum, bosons]
---

> **What it is:** A ~45-second simulation of quantum particle worldlines forming closed imaginary-time polymer rings sampled by path integral Monte Carlo exchange moves to reveal Bose-Einstein thermal statistics. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Quantum Monte Carlo: Path Integrals and Thermal Quantum Systems

# Short: Path Integral Monte Carlo — Quantum Particle Rings

**Feeds full video:** Quantum Monte Carlo: Path Integrals and Thermal Quantum Systems

## Visual Hook (First 3 Seconds)
Instead of a single particle, a glowing cyan ring of 32 beads (each a world-line "bead" in imaginary time) writhes in 2D space on a black background. Two rings overlap and their beads exchange — a "permutation ring" of 64 beads forms (gold). Text: "⁴He at T = 1 K. Quantum rings."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Single particle world-line: a closed ring of P = 32 beads (τ₀ = ℏβ/P per bead, shown as cyan dots connected by springs). Imaginary time axis β = 1/kT shown as the ring circumference. "P = 32 time slices, T = 2 K" label.
- **0:10** — Partition function: Z = ∫Dx exp(−S_E/ℏ). Euclidean action S_E shown; each spring between beads represents the kinetic term ½m(x_{i+1}−x_i)²/Δτ in gold. "Quantum = classical polymer in imaginary time".
- **0:18** — Bose-Einstein statistics: two ⁴He atoms (cyan and magenta rings) approach each other. A "worm" Monte Carlo move proposes an exchange — the two rings join into one large ring of 64 beads (gold). Exchange accepted with weight exp(−ΔS). Permutation cycle counter: "cycle length 2".
- **0:27** — Superfluid density: at T = 2.5 K (above λ-point): ring permutation cycles stay short (length 1–2, blue histogram). At T = 1.5 K (below λ-point): macroscopic permutation cycle of length N = 512 forms (gold spike in histogram). "Superfluidity = macroscopic permutation".
- **0:35** — Energy vs temperature curve: E(T) in cyan. λ-transition at T_λ = 2.17 K shows a cusp (sharp kink, annotated in red). Specific heat C_v peaks to 80 J/mol/K at T_λ (gold spike).
- **0:43** — Radial distribution function g(r): PIMC result (white dots) vs experiment (magenta line) for liquid ⁴He at 2 K. "First peak at r = 3.5 Å, agreement within 2%".

## Physics Concept Teased
Path Integral Monte Carlo represents each quantum particle as a closed imaginary-time polymer ring; Bose-Einstein statistics emerge from worm-algorithm permutation moves that join rings into cycles — macroscopic permutation cycles signal the superfluid transition with no wavefunction ansatz required.

## On-Screen Text / Captions
- **0:00** — "⁴He at 1 K. Rings, not points." (white, top)
- **0:10** — "Z = ∫Dx exp(−S_E/ℏ) — Feynman's path integral" (gold, center)
- **0:18** — "Exchange = rings join — bosonic statistics" (white, bottom bar)
- **0:27** — "Macroscopic permutation = superfluidity" (gold, histogram label)
- **0:35** — "T_λ = 2.17 K — specific heat diverges" (red, graph annotation)
- **0:43** — "PIMC matches experiment to 2%" (white, bottom)

## End Card
Final 3 seconds: a large golden permutation ring pulses and glows. "CODED LAWS" in icy blue. Subscribe. "Next: Density Functional Theory →" teaser.

## Audio
Crystalline glass harmonic at 440 Hz; soft "ring" sound each time a permutation cycle forms; deep bass note at superfluid transition. 60 BPM ethereal ambient. No voiceover.

## Production Notes
PIMC code: custom Python implementation with Metropolis sampling and worm algorithm (Prokof'ev & Svistunov). Particles: N = 64 ⁴He atoms in 2D periodic box L = 20 Å. Time slices: P = 64. Potential: Aziz LJ pair potential. Temperature range: T = 1–4 K. Superfluid estimator: winding number W² = 〈W²〉/2λβ. MC steps: 10⁷ per temperature.
