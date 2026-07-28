---
title: "Quantum Walk — Diffusive vs Ballistic Spreading"
id: SA050
type: youtube-short
duration: "~45 seconds"
feeds_video: "Quantum Walks: Algorithms, Spreading, and Quantum Advantage"
difficulty: advanced
tags: [physics, simulation, short, advanced, quantum-computing, quantum-walk, spreading]
---

> **What it is:** A ~45-second simulation of a quantum particle walking on a 1D lattice spreading ballistically (sigma ~ t) via Hadamard coin flips, compared to the diffusive (sigma ~ sqrt(t)) spread of a classical random walk. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Quantum Walks: Algorithms, Spreading, and Quantum Advantage

# Short: Quantum Walk — Diffusive vs Ballistic Spreading

**Feeds full video:** Quantum Walks: Algorithms, Spreading, and Quantum Advantage

## Visual Hook (First 3 Seconds)
Split-screen: left side shows a classical random walk (orange dot hopping randomly on a 1D lattice). Right side shows a quantum walk (cyan probability cloud spreading). After 50 steps: classical standard deviation σ_c = 7.1 (shown in orange text), quantum σ_q = 35.3 (shown in cyan). The quantum cloud covers 5× more ground.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — 1D lattice with 201 sites shown as a horizontal array of dots. Classical walk: single orange dot, starts at site 0. Each step it hops left or right with 50% probability (animated coin flip shown as a spinning orange disc). After 10 steps the dot is wandering near site −3.

**0:10–0:18** — Quantum walk begins. A cyan probability bar chart across all 201 sites, starting as a delta function at site 0. The coin operator is the Hadamard: H = (1/√2)[[1,1],[1,−1]] shown in white. Each step propagates the wave. The probability distribution spreads visibly outward at step 10, 20, 30.

**0:18–0:26** — At step 50: the quantum distribution shows the characteristic double-peak structure — two sharp peaks near sites ±35, with lower probability in between. Classical distribution shown as orange Gaussian bell curve peaked at site 0 with σ ≈ 7. The contrast is stark: two sharp cyan spikes vs broad orange bell.

**0:26–0:34** — Log-log plot appears: horizontal axis = step number t (1 to 100), vertical axis = σ(t). Classical walk (orange): σ ∝ t^0.5 line. Quantum walk (cyan): σ ∝ t^1.0 line (ballistic). The exponent difference is highlighted: "0.5 vs 1.0 — quadratic speedup."

**0:34–0:42** — 2D quantum walk visualization: starting from center of a 101×101 grid. At t=50 the probability spreads in a diamond pattern (because the lattice is 2D), with four bright peaks at the corners of the diamond. Classical 2D walk shown inset: smooth circular Gaussian. The 2D quantum interference pattern is visually striking — concentric interference rings with enhanced corner peaks.

**0:42–0:50** — Application label: "Grover's algorithm = quantum walk on hypercube." A 4D hypercube graph lights up as the quantum walk searches for a marked node — it finds it in t ≈ N^0.5 = 4 steps vs classical N/2 = 8 steps. Fade to CodedLaws logo.

## Physics Concept Teased
A quantum walk uses superposition and the coin-flip unitary to spread probability ballistically — σ(t) ∝ t rather than the classical σ(t) ∝ √t. This quadratic enhancement in spreading underlies the quantum speedups in Grover search and element distinctness algorithms.

## On-Screen Text / Captions
- **0:00** — "Classical vs quantum walk — 50 steps"
- **0:05** — "Classical σ = 7.1 | Quantum σ = 35.3"
- **0:12** — "Coin: Hadamard gate"
- **0:20** — "Quantum double-peak structure at ±35"
- **0:28** — "Classical: σ ∝ t^0.5 | Quantum: σ ∝ t^1.0"
- **0:36** — "2D quantum walk: diamond interference pattern"
- **0:44** — "Grover search = quantum walk speedup"

## End Card
Final 3 seconds: the 2D diamond interference pattern frozen, glowing cyan, with CodedLaws logo centered. CTA: "Full video → Quantum Walk Algorithms."

## Audio
Upbeat electronic at 100 BPM, arpeggiated synth. Clicking sound on each classical hop; continuous ethereal tone for quantum spreading. Chime when double-peak structure crystallizes at step 50. No voiceover.

## Production Notes
Renderer: NumPy sparse matrix for shift operator, Hadamard coin. 201-site 1D walk, 101×101 2D walk. Probability bar chart rendered with Matplotlib FuncAnimation. 2D interference pattern via imshow with hot colormap. Log-log plot real-time with Matplotlib. 60 fps, 1080×1920.
