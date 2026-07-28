---
title: "Quantum Annealing: Ising Problem"
id: SA043
type: youtube-short
duration: "~45 seconds"
feeds_video: "Quantum Annealing: D-Wave and the Ising Optimisation Problem"
difficulty: advanced
tags: [physics, simulation, short, advanced, quantum-annealing, ising, optimization, d-wave, qubo]
---

> **What it is:** A ~45-second simulation of quantum annealing on a spin-glass Ising problem, showing the transverse field slowly switched off as quantum tunneling steers the system toward the ground-state configuration. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Quantum Annealing: D-Wave and the Ising Optimisation Problem

# Short: Quantum Annealing — Ising Problem

**Feeds full video:** Quantum Annealing: D-Wave and the Ising Optimisation Problem

## Visual Hook (First 3 Seconds)
A frustrated Ising graph (20 nodes, shown as gold and black spheres connected by red/blue edges for ferromagnetic/antiferromagnetic couplings) is displayed. Classical simulated annealing gets stuck in a local minimum (red glow, energy −12.3 J). Quantum annealing tunnels through (blue glow, global minimum −15.7 J). "Tunnelling beats hills."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Ising Hamiltonian: H_Ising = −Σ J_ij σ_i σ_j − Σ h_i σ_i. Spins σ_i ∈ {−1, +1} shown as up/down arrows (gold/blue). J_ij matrix shown as heatmap (red = ferromagnetic, blue = antiferromagnetic). "Find the spin configuration that minimises energy."
- **0:10** — Quantum annealing protocol: H(t) = (1−s)H_transverse + s H_Ising, s: 0 → 1 over time T = 20 μs. At s=0: H_transverse = −Γ Σ σ_x^i (all spins in superposition, cyan). At s=1: H_Ising (classical Ising). "Quantum fluctuations replaced by classical randomness."
- **0:18** — Tunnelling advantage: energy landscape shown as 1D cartoon (many hills/valleys). Classical simulated annealing: random walk over barriers (red ball on hills). Quantum annealing: tunnels through barriers (blue wavefunction spreading through barriers). "Quantum tunnelling avoids tall, thin barriers."
- **0:27** — D-Wave Pegasus topology: 5,627-qubit chip shown as a graph (grey nodes, coloured edges by coupling strength). A QUBO problem mapped onto the chip: blue = target couplings, red = chain constraints (ancilla qubits that force logical qubit chains). "Embedding overhead: 1 logical qubit → 5 physical qubits."
- **0:35** — Benchmark: Max-Cut problem on random 3-regular graph (100 nodes). D-Wave (gold bar, 100 μs): solution quality ratio 0.97. Gurobi classical (blue bar, 1 s): ratio 1.00. "Gurobi wins on small instances — but at 1,000× longer runtime for large N."
- **0:43** — Quantum advantage regime: plot of time-to-solution vs N (log-log). Simulated annealing (red, exponential slope). D-Wave (gold, flatter slope). Lines cross at N ~ 400 (projected quantum advantage). "Still searching for the crossover."

## Physics Concept Teased
Quantum annealing encodes an optimisation problem into an Ising Hamiltonian and exploits quantum tunnelling (via a transverse field that slowly decreases to zero) to navigate energy landscapes — in principle allowing the system to tunnel through high-but-narrow barriers that trap classical simulated annealing, though demonstrated advantage remains problem-dependent.

## On-Screen Text / Captions
- **0:00** — "Tunnelling beats hills. Sometimes." (white, top)
- **0:10** — "s: 0 → 1 over 20 μs — the anneal" (white, lower)
- **0:18** — "Quantum tunnels through. Classical climbs over." (blue/red, landscape labels)
- **0:27** — "1 logical qubit → 5 physical qubits (embedding)" (white, bottom bar)
- **0:35** — "D-Wave: 100 μs. Gurobi: 1 second. Trade-offs." (white, benchmark labels)
- **0:43** — "Quantum advantage crossover at N ~ 400 — not yet proven" (gold, bottom)

## End Card
Final 3 seconds: the Ising graph spins flip to their ground state configuration (all gold). "CODED LAWS" in blue and gold. Subscribe. "Next: Tensor Network Contraction →" teaser.

## Audio
Eerie quantum coherence hum at 0:00; "snap" sound as spins flip during annealing; triumphant chord when ground state found. 80 BPM ambient with electronic pulse. No voiceover.

## Production Notes
Quantum annealing simulation: simulated quantum annealing (SQA) in Python/NumPy (path-integral Monte Carlo approximation). D-Wave results: D-Wave Advantage 4.1 (5,627 qubits, Pegasus P16) via Leap cloud service. Problem: random J_ij ∈ [−1,+1] frustrated Ising on complete graph K_20 (190 couplings). Embedding: D-Wave's minorminer. Classical comparison: SA (scipy simulated_annealing) + Gurobi 10.0. Visualization: NetworkX graph drawing + matplotlib landscape cartoon.
