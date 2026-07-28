---
title: "Quantum Error Correction: Toric Code Syndrome"
id: SA041
type: youtube-short
duration: "~45 seconds"
feeds_video: "Quantum Error Correction: Stabiliser Codes and the Toric Code"
difficulty: advanced
tags: [physics, simulation, short, advanced, quantum-error-correction, toric-code, stabiliser, syndrome, topological-qec]
---

> **What it is:** A ~45-second simulation of a toric code lattice with randomly placed Pauli errors, showing syndrome measurement chains that identify error positions without collapsing the encoded logical qubit. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Quantum Error Correction: Stabiliser Codes and the Toric Code

# Short: Quantum Error Correction — Toric Code Syndrome

**Feeds full video:** Quantum Error Correction: Stabiliser Codes and the Toric Code

## Visual Hook (First 3 Seconds)
A 5×5 toric code lattice (dark background, qubits shown as white dots on edges, stabiliser plaquettes as gold squares, vertex stars as cyan X-shapes) sits undisturbed. Then a bit-flip error (red X) strikes one edge qubit. Two adjacent plaquette stabilisers flash red (syndrome = −1). "1 error. 2 syndromes. Location found."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Toric code structure: L×L lattice on a torus (shown as flat square with periodic boundary). Qubits: on edges (shown as white dots). Plaquette operators B_p = ⊗ Z (gold squares, eigenvalue ±1). Vertex operators A_v = ⊗ X (cyan stars, eigenvalue ±1). "4 Pauli operators per stabiliser."
- **0:10** — Logical qubits: toric code encodes k = 2 logical qubits in L² × 2 physical qubits. Logical operators X̄₁, X̄₂ shown as horizontal/vertical chains of X operators (cyan lines crossing the torus). "2 loops = 2 logical qubits."
- **0:18** — Error model: bit-flip (X) errors on each qubit with probability p = 0.01 per cycle. On a 5×5 lattice: typically 0–3 errors per cycle. Errors shown as red stars appearing randomly. Syndrome readout: measure all B_p stabilisers → flipped syndromes highlight error locations.
- **0:27** — Minimum-weight matching decoder: syndrome graph built (red syndrome nodes, black edges = possible error paths). Blossom algorithm finds minimum-weight perfect matching in O(n³). Green pairing lines shown. "Blossom: match syndromes to minimise error weight."
- **0:35** — Threshold theorem: plot of logical error rate p_L vs physical error rate p. Below threshold p_th ≈ 10.3%: p_L decreases as L increases (gold curves for L=5,9,13 spreading apart downward). Above threshold: p_L increases with L. "Threshold: p = 10.3% — go below and scale."
- **0:43** — Logical error rate at p = 0.01 (1% physical): L=5 → p_L = 0.08%; L=9 → p_L = 0.02%; L=13 → p_L = 0.005%. "Code distance d = L: each doubling → quartic suppression." Error bars shown (100,000 MC samples each).

## Physics Concept Teased
The toric code is a topological quantum error correcting code where logical information is encoded in non-local loop operators on a torus — errors create pairs of anyonic excitations (syndrome defects) that can be detected by measuring stabiliser operators and corrected via minimum-weight matching, with a fault-tolerance threshold of ~10.3% physical error rate.

## On-Screen Text / Captions
- **0:00** — "1 error. 2 syndromes. Location found." (white, top)
- **0:10** — "2 logical qubits in L² physical qubits" (white, lower)
- **0:18** — "p = 1% physical errors per cycle" (red, error rate label)
- **0:27** — "Blossom algorithm: O(n³) matching" (green, decoder label)
- **0:35** — "Threshold: p_th = 10.3% — the magic number" (gold, annotation)
- **0:43** — "L=13 → p_L = 0.005% at p = 1%" (gold, bottom)

## End Card
Final 3 seconds: the toric code lattice glows green (error-free after correction). "CODED LAWS" in quantum gold. Subscribe. "Next: VQE Energy Minimisation →" teaser.

## Audio
Clean digital "click" for each stabiliser measurement; satisfying "beep" when syndrome detected; triumphant chord when correction succeeds. 100 BPM electronic. No voiceover.

## Production Notes
Toric code simulation: custom Python (Stim quantum error simulation library). Code: L×L toric code, L = 5, 9, 13, 17. Error model: independent depolarising noise p per qubit. Syndrome extraction: perfect (noiseless) measurements for simplicity. Decoder: PyMatching (blossom-based MWPM). MC samples: 100,000 per (p, L) point. Threshold: interpolated from logical error rate crossing curves. Visualisation: NetworkX + matplotlib lattice drawing.
