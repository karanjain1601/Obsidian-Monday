---
title: "Adiabatic Theorem: Quantum State Tracking"
id: SA040
type: youtube-short
duration: "~45 seconds"
feeds_video: "Adiabatic Quantum Computation: Slow Changes and Ground State Tracking"
difficulty: advanced
tags: [physics, simulation, short, advanced, adiabatic-theorem, quantum, ground-state, energy-gap, quantum-computation]
---

> **What it is:** A ~45-second simulation of a two-level quantum system tracking the ground state through an avoided crossing as the Hamiltonian is swept slowly, confirming the adiabatic theorem with no diabatic transitions. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Adiabatic Quantum Computation: Slow Changes and Ground State Tracking

# Short: Adiabatic Theorem — Quantum State Tracking

**Feeds full video:** Adiabatic Quantum Computation: Slow Changes and Ground State Tracking

## Visual Hook (First 3 Seconds)
A two-level quantum system (energy levels shown as two horizontal lines: E₀ = 0 eV in gold, E₁ = 0.5 eV in blue) evolves as the Hamiltonian changes slowly. The ground state vector (cyan arrow on Bloch sphere) follows the changing energy eigenstate perfectly. When the change is too fast (red sweep line), the state fails to track and transitions — shown as the cyan arrow flipping. Text: "Slow enough? Never leave the ground state."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Adiabatic theorem statement: if H(t) changes slowly enough (|〈1|dH/dt|0〉| << Δ²/ℏ), the system remains in the instantaneous ground state |E₀(t)〉. Δ = E₁ − E₀ = 0.5 eV gap shown as gold double-arrow between levels.
- **0:10** — Gap closing: the dangerous moment. As H(t) interpolates from H_initial to H_final, the gap Δ(t) has a minimum Δ_min = 0.08 eV at t = T/2. Plot: energy levels (E₀ gold, E₁ blue) vs time, crossing avoided. "Avoided crossing — gap never closes."
- **0:18** — Landau-Zener formula: P_excitation = exp(−πΔ²/(2ℏ|dε/dt|)). At sweep speed |dε/dt| = 0.01 eV/ns: P = 0.003 (0.3% excitation, safe). At 1 eV/ns: P = 0.34 (34% excitation, fails). Numbers fill in gold.
- **0:27** — Adiabatic quantum computation: initial Hamiltonian H_i = −Σ σ_x^i (all spins in +x eigenstate, easy ground state). Final H_f = Ising Hamiltonian (NP-hard problem ground state). T chosen so LZ formula gives P < 0.01. "Runtime: T ~ Δ_min^(−2) — gap is everything."
- **0:35** — 6-qubit AQC demo: a small Ising problem on 6 qubits. Energy gap Δ(t) tracked over time (blue curve dipping to Δ_min = 0.12 eV at t = 0.6T). Fidelity with ground state F(t) shown (gold curve, stays > 0.99 throughout). "Slow sweep: F = 0.993 at T."
- **0:43** — Gap scaling: for random Ising on N qubits, expected Δ_min ~ exp(−N). Plot: Δ_min vs N (log scale, red exponential decay from N=4 to N=20). "Exponentially small gap — the adiabatic bottleneck."

## Physics Concept Teased
The quantum adiabatic theorem guarantees that a system stays in its instantaneous ground state provided the Hamiltonian changes slowly compared to the energy gap Δ squared — but when the gap closes exponentially with system size (as in NP-hard problems), the required evolution time grows exponentially, making adiabatic quantum computation potentially intractable for large instances.

## On-Screen Text / Captions
- **0:00** — "Slow enough? You never leave the ground state." (white, top)
- **0:03** — "Gap Δ = 0.5 eV — the safety margin" (gold, level annotation)
- **0:10** — "Avoided crossing: gap never fully closes" (white, lower)
- **0:18** — "LZ: slow sweep → P = 0.3% excitation" (gold, annotation)
- **0:27** — "AQC runtime ~ 1/Δ_min² — gap rules everything" (white, bottom bar)
- **0:43** — "Δ_min ~ exp(−N): the exponential bottleneck" (red, bottom)

## End Card
Final 3 seconds: the avoided crossing glows gold as the gap minimum narrows. "CODED LAWS" in quantum blue. Subscribe. "Next: Quantum Error Correction →" teaser.

## Audio
Smooth tone sweep matching energy gap (pitch proportional to Δ); tension drone as gap closes; resolved harmony when adiabatic tracking succeeds. 65 BPM ambient. No voiceover.

## Production Notes
Simulation: QuTiP (Python). 2-level system: H(t) = (1−s)σ_x + s σ_z, s ∈ [0,1] over time T. Landau-Zener formula: exact analytic. 6-qubit AQC: H_i = −Σ σ_x^i, H_f = random Ising J_{ij} ∈ [−1,1]. Gap computation: exact diagonalisation. Fidelity: |〈ψ(T)|GS_f〉|². Visualization: matplotlib time-series + Bloch sphere (custom 3D axes).
