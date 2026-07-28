---
title: "Variational Quantum Eigensolver: Energy Minimisation"
id: SA042
type: youtube-short
duration: "~45 seconds"
feeds_video: "Variational Quantum Algorithms: VQE and Quantum Chemistry"
difficulty: advanced
tags: [physics, simulation, short, advanced, vqe, variational, quantum-eigensolver, quantum-chemistry, noisy-quantum]
---

> **What it is:** A ~45-second simulation of a VQE circuit with parametrized Ry and CNOT gates optimized by gradient descent to find the ground-state energy of a molecular Hamiltonian. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Variational Quantum Algorithms: VQE and Quantum Chemistry

# Short: Variational Quantum Eigensolver — Energy Minimisation

**Feeds full video:** Variational Quantum Algorithms: VQE and Quantum Chemistry

## Visual Hook (First 3 Seconds)
A quantum circuit (5 qubits, shown as horizontal lines with gates — Ry rotations in cyan, CNOT gates in gold) executes on a noisy quantum chip (grey noise flecks). A classical optimiser (bright green curve) descends a 3D energy landscape from E = −0.8 Ha to E = −1.136 Ha (exact FCI energy of H₂). Text: "Quantum circuit + classical optimiser = chemistry."

## Main Visual Sequence (0:03–0:50)
- **0:03** — VQE structure: hybrid loop graphic. (1) Parameterised quantum circuit U(θ) prepares state |ψ(θ)〉 (shown as circuit diagram). (2) Measure 〈ψ(θ)|H|ψ(θ)〉 via Pauli decomposition. (3) Classical COBYLA/BFGS optimizer updates θ. (4) Loop until convergence. "Quantum hardware. Classical brain."
- **0:10** — Qubit Hamiltonian: H₂ molecule (bond length R = 0.74 Å) mapped via Jordan-Wigner: H = −1.05σ_z⊗I + 0.39I⊗σ_z − 0.40σ_x⊗σ_x − 0.01σ_z⊗σ_z + … (4 Pauli terms shown). "4 Pauli strings → 4 circuit measurements."
- **0:18** — Ansatz: UCCSD (Unitary Coupled Cluster Singles and Doubles). Circuit shown: CNOT ladder + Ry rotations (depth 12). Parameters: θ = (θ₁, θ₂, …, θ₈) shown as sliders. "8 parameters for H₂ — tiny but correct."
- **0:27** — Optimisation landscape: 2D energy surface E(θ₁, θ₂) shown as a coloured topographic map (purple ridges = high energy, gold valley = minimum). Starting point (red dot) at E = −0.82 Ha. Optimiser path (white line) descends to global minimum (gold star) at E = −1.136 Ha.
- **0:35** — Convergence plot: E(iteration) vs iteration count (0–80). Starting E = −0.83 Ha (top, red). Convergence at iteration 40: E = −1.1361 Ha. FCI exact = −1.1363 Ha (gold dashed). Error: 0.2 mHa = chemical accuracy (1.6 kJ/mol).
- **0:43** — Noise impact: ideal simulation (gold, error 0.2 mHa) vs noisy 27-qubit hardware (cyan, error 8.4 mHa). Error mitigation (zero-noise extrapolation): red, error reduced to 2.1 mHa. "Error mitigation: 4× better without better hardware."

## Physics Concept Teased
The Variational Quantum Eigensolver prepares a parameterised trial state on a quantum circuit, measures the Hamiltonian expectation value by decomposing H into Pauli strings, then uses a classical optimizer to update circuit parameters — exploiting the variational principle (E[ψ] ≥ E₀) to find the ground-state energy with quantum advantage in the measurement step.

## On-Screen Text / Captions
- **0:00** — "Quantum circuit. Classical brain. Ground state." (white, top)
- **0:10** — "H₂ → 4 Pauli strings → 4 measurements" (white, lower)
- **0:18** — "8 parameters. UCCSD ansatz." (gold, circuit label)
- **0:27** — "E = −1.136 Ha — hydrogen ground state" (gold, minimum label)
- **0:35** — "Chemical accuracy: 0.2 mHa = 1.6 kJ/mol" (gold, convergence annotation)
- **0:43** — "Error mitigation: 4× better, same hardware" (red, bottom)

## End Card
Final 3 seconds: the energy landscape glows gold at the minimum. "CODED LAWS" in quantum green. Subscribe. "Next: Quantum Annealing →" teaser.

## Audio
Quantum gate "chirp" for each circuit layer; classical optimiser "tick" per iteration; satisfied resolution chord at chemical accuracy convergence. 90 BPM electronic. No voiceover.

## Production Notes
VQE code: Qiskit (IBM) + PySCF for Hamiltonian. Molecule: H₂ at R = 0.74 Å, STO-3G basis. JW mapping: 4 qubits, 15 Pauli terms. Ansatz: UCCSD with 8 parameters. Optimizer: COBYLA (80 function evaluations). Ideal simulation: Qiskit statevector. Noisy: Qiskit fake_nairobi backend (27-qubit, ibm_nairobi noise model). Error mitigation: ZNE (noise scaling 1×, 2×, 3× + Richardson extrapolation). Visualization: matplotlib 3D surface + convergence line plot.
