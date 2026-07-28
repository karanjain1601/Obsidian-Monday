---
title: "Percolation on Bethe Lattice — Exact Threshold"
id: SM136
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, statistical-mechanics, percolation, bethe-lattice, phase-transition, network]
---

> **What it is:** A ~45-second simulation short where bonds on a z=3 Cayley tree open randomly and a giant connected cluster suddenly spans the tree at exactly the analytically predicted threshold p_c = 0.5, demonstrating how the absence of loops makes Bethe lattice percolation exactly solvable via a self-consistency equation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Percolation on Bethe Lattice — Exact Threshold

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A Cayley tree (Bethe lattice) unfolds from a central node — each node branches to z=3 children, to z=3 grandchildren, and so on (an infinite tree with no loops). Each bond is open with probability p (blue). The lattice fills frame. At p=0.5 = 1/(z-1) = 1/2, a giant connected cluster suddenly spans the tree.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Bethe lattice: a regular tree with coordination number z. No closed loops — every path between two nodes is unique. The exact percolation threshold p_c = 1/(z-1). For z=3: p_c=0.5. For z=4: p_c=1/3. Caption: "Exact threshold: p_c = 1/(z-1) — no loops means exact solution."

**0:10–0:18** — Why exactly solvable: without loops, the probability that a site belongs to the giant cluster satisfies a self-consistency equation. Let Q = probability a bond does NOT lead to the giant cluster. Then Q = (1-p) + p·Q^(z-1). Giant cluster fraction P∞ = 1 - Q^z. Caption: "Self-consistency: Q = (1-p) + p·Q^(z-1) — bifurcation at p_c."

**0:18–0:27** — Order parameter: P∞ ∝ (p - p_c)^β with β=1 (mean-field exponent — exact on Bethe lattice). Correlation length ξ ∝ |p - p_c|^(-ν) with ν=1/2. These are the mean-field exponents. Caption: "P∞ ∝ (p-p_c)^β with β=1 — mean-field percolation." Show P∞ vs p curve with smooth onset at p_c.

**0:27–0:36** — Connection to mean-field theory: the Bethe lattice is the "infinite-dimensional" limit (no spatial correlations). Real 2D percolation (sq lattice): p_c=0.5927..., β=5/36 — very different from mean field. Why does Bethe lattice give mean field? — because there are no loops, so clusters grow independently. Caption: "Bethe lattice = infinite dimensions; 2D lattice has loops → β=5/36."

**0:36–0:45** — Application: Erdos-Renyi random graph (next short). The Bethe lattice is the local structure of sparse random graphs (tree-like for large N). Caption: "Erdos-Renyi graph: locally tree-like → Bethe lattice solvable." Bold text: "Bethe lattice — the exactly solvable percolation model." Fade to black.

## Physics Concept Teased
Site/bond percolation on a Bethe lattice (Cayley tree): a tree graph where each node has coordination z. The absence of loops enables an exact solution via a self-consistency equation. The percolation threshold p_c = 1/(z-1) and the critical exponents are those of mean-field theory (β=1, ν=1/2), valid also for real lattices above d=6.

## On-Screen Text / Captions
- **0:00** — "A tree with no loops — exactly solvable percolation."
- **0:05** — "p_c = 1/(z-1) — exact threshold on Bethe lattice"
- **0:12** — "Q = (1-p) + p·Q^(z-1) — self-consistency equation"
- **0:20** — "P∞ ∝ (p-p_c)^β with β=1 — mean field"
- **0:28** — "2D loops break mean-field: β=5/36 instead of 1"
- **0:35** — "Sparse random graphs: locally tree-like → Bethe result"
- **0:43** — "Bethe lattice — exact percolation solution."

## End Card
Final 3 seconds: the Bethe lattice (z=3) with open bonds highlighted, the giant cluster in bold blue. Text: "The Bethe lattice approximation is used in belief propagation, factor graphs, and compressed sensing." CodedLaws logo.

## Audio
Digital chime at each bond opening. Voiceover at 0:00: "On a tree with no loops, you can solve percolation exactly — and the answer is elegant: p_c equals one over the branching number." No other voiceover.

## Production Notes
Code complexity: low-moderate. Renderer: Canvas 2D (tree layout). Key algorithm: generate a Bethe lattice to depth 6 (from a root node, branch to z=3 children at each level). Assign bonds open/closed with probability p. Compute P∞ numerically by counting which fraction of nodes belongs to the root's connected component. Also solve the self-consistency equation Q = (1-p) + p·Q^(z-1) numerically (Newton's method or iteration). Animate P∞ vs p as p increases from 0 to 1. Layout: radial tree layout (each level on a ring). Runtime: fast, Canvas 2D.
