---
title: "WRT Invariant — Knot Invariant Computation"
id: SA053
type: youtube-short
duration: "~45 seconds"
feeds_video: "Witten-Reshetikhin-Turaev Invariants: Quantum Groups and 3-Manifolds"
difficulty: advanced
tags: [physics, simulation, short, advanced, topological, WRT-invariant, knot-theory, quantum-groups]
---

> **What it is:** A ~45-second simulation showing the Witten-Reshetikhin-Turaev invariant of a trefoil knot computed by evaluating a quantum group trace to reproduce the Jones polynomial from a 3D TQFT amplitude. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Witten-Reshetikhin-Turaev Invariants: Quantum Groups and 3-Manifolds

# Short: WRT Invariant — Knot Invariant Computation

**Feeds full video:** Witten-Reshetikhin-Turaev Invariants: Quantum Groups and 3-Manifolds

## Visual Hook (First 3 Seconds)
A figure-eight knot (bright magenta, #FF69B4) rotates on a black background. Beneath it, a quantum group symbol "U_q(sl₂)" glows in gold with q = e^(2πi/5). A matrix of colored squares — the R-matrix — appears beside the knot, with complex entries highlighted. An integer pops up: "WRT₅(figure-8) = −1.618."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The computation pipeline displayed as a flowchart: Knot diagram → Reidemeister moves (three diagrammatic moves shown in white) → R-matrix assignment at each crossing → trace over representation. Each step animates in sequence with colored connectors.

**0:10–0:18** — The figure-eight knot is drawn as a planar projection with 4 crossings labeled. At each crossing, the U_q(sl₂) R-matrix is applied: a 4×4 matrix of complex q-numbers appears at each crossing site, color-coded by magnitude (warm = large, cool = small). The matrices multiply left to right.

**0:18–0:26** — The quantum trace operation: after multiplying all R-matrices and twist factors, the trace is taken with a "quantum dimension" weighting. The formula: WRT_k(L) = (1/D) Σ_λ dim_q(λ)·⟨L⟩_λ appears in white. D = quantum dimension of the total space, shown as D = 2cos(π/5) = 1.902.

**0:26–0:34** — Three different knots shown in a row: unknot (gray, WRT = 1.000), trefoil (teal, WRT = e^(iπ/3) = 0.5+0.866i), figure-eight (magenta, WRT = −1.618). A bar chart of |WRT| values shows the magnitudes: 1.0, 1.0, 1.618. Relation to golden ratio φ labeled for the figure-eight.

**0:34–0:42** — Skein relation visualization: a colored diagram showing the HOMFLY skein relation l·L₊ + l⁻¹·L₋ + m·L₀ = 0. The three knot diagrams (positive crossing, negative crossing, no crossing) animate as the skein coefficients l and m are shown. This is the algebraic backbone.

**0:42–0:50** — Final frame: the computation completes. A 3-manifold M³ is shown (Dehn surgery on the figure-eight complement), and its WRT invariant τ_k(M³) is displayed as a function of k: a plot of |τ_k| vs k from k=2 to k=20, showing an oscillating function. Fade to CodedLaws logo.

## Physics Concept Teased
The Witten-Reshetikhin-Turaev invariant is a topological invariant of 3-manifolds and links, computed from the representation theory of quantum groups U_q(g) at roots of unity. It categorifies the Jones polynomial and connects to Chern-Simons quantum field theory via path-integral localization.

## On-Screen Text / Captions
- **0:00** — "Figure-eight knot: WRT₅ = −1.618"
- **0:06** — "Quantum group U_q(sl₂), q = e^(2πi/5)"
- **0:12** — "R-matrix at each crossing"
- **0:20** — "Quantum trace: WRT_k = (1/D)Σ dim_q·⟨L⟩"
- **0:28** — "Figure-eight links to golden ratio φ"
- **0:36** — "Skein relation: the algebraic engine"
- **0:44** — "τ_k(M³) as function of level k"

## End Card
Final 3 seconds: the figure-eight knot spinning, WRT value −1.618 glowing in gold, CodedLaws logo fading in. CTA: "Full video → WRT Invariants and 3-Manifolds."

## Audio
Chamber-music-inspired ambient at 72 BPM, cello and synth hybrid. Mathematical click sounds at each R-matrix multiplication. Golden-ratio chime at the φ reveal. No voiceover.

## Production Notes
Renderer: Python symbolic computation with SymPy for quantum group algebra. R-matrix elements computed from Clebsch-Gordan coefficients for U_q(sl₂). Knot drawn with custom SVG path parser. WRT trace computed as matrix polynomial evaluation at q = root of unity. Matplotlib for k-plot. Three.js for rotating 3D knots. 60 fps, 1080×1920.
