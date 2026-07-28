---
title: "Wigner Function — Negative Probability in Phase Space"
id: SA047
type: youtube-short
duration: "~45 seconds"
feeds_video: "Phase Space Quantum Mechanics: Wigner Functions and Negativity"
difficulty: advanced
tags: [physics, simulation, short, advanced, quantum-mechanics, wigner-function, phase-space]
---

> **What it is:** A ~45-second simulation of the Wigner quasi-probability function of a Schrodinger cat state plotted over (x,p) phase space, displaying the characteristic negative-valued interference fringes between two coherent components. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Phase Space Quantum Mechanics: Wigner Functions and Negativity

# Short: Wigner Function — Negative Probability in Phase Space

**Feeds full video:** Phase Space Quantum Mechanics: Wigner Functions and Negativity

## Visual Hook (First 3 Seconds)
A vivid 3D surface plot fills the screen: the Wigner function of a cat state, rendered in a diverging colormap — deep violet (#4B0082) for negative regions, bright yellow (#FFD700) for positive peaks, white at zero. Two golden peaks flank a deep purple trough that dips to W = −0.32. The x-axis label reads "x (position)" and p-axis reads "p (momentum)."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The plot rotates 360° around its vertical axis, revealing the full 3D topology: two sharp Gaussian peaks at (x=±2, p=0) and the negative central lobe. Numerical color bar on the right shows range [−0.32, +0.32]. Grid lines at 0.5-unit intervals in both x and p.

**0:10–0:18** — The state morphs from a cat state to a Fock state |n=3⟩. The surface ripples outward: the ring structure of W(x,p) for Fock states appears — alternating positive/negative rings, with 3 positive bands and 2 negative troughs. Negativity counter displayed: "Min W = −0.18."

**0:18–0:26** — Side-by-side comparison: left panel shows |ψ⟩ = |0⟩ (Gaussian, always positive W, yellow dome), right panel shows |ψ⟩ = |1⟩ (single negative ring, purple annulus at center). Arrow labels: "Classical state" vs "Quantum state."

**0:26–0:34** — A decoherence slider activates. As γt sweeps from 0 → 1, the negative purple regions fill in and disappear; the Wigner function becomes a featureless positive Gaussian. The stat "Negativity volume" drops from 0.18 → 0.00 in real time.

**0:34–0:42** — The Hudson theorem statement appears as text overlay: "W < 0 ↔ non-classical state." The plot returns to the cat state. A dashed contour line traces the W = 0 boundary — shown in white, separating violet from yellow.

**0:42–0:50** — Final shot: the cat state Wigner function seen from directly above (top-down 2D colormap). Interference fringes in the central region show rapid oscillations. Resolution: 512×512 grid. Fade to CodedLaws logo.

## Physics Concept Teased
The Wigner function is a quasi-probability distribution over phase space whose negativity is a signature of non-classical states. Classical probability distributions cannot go negative; quantum superpositions generate interference fringes in (x, p) space that necessarily dip below zero.

## On-Screen Text / Captions
- **0:00** — "Wigner function of a Schrödinger cat state"
- **0:06** — "Min value: W = −0.32 (impossible classically)"
- **0:12** — "Fock state |n=3⟩ — three positive rings"
- **0:20** — "Classical vs Quantum: the negativity test"
- **0:28** — "Decoherence erases quantum interference"
- **0:36** — "Hudson's theorem: W ≥ 0 ↔ classical"
- **0:44** — "512² grid, real-time Fourier transform"

## End Card
Final 3 seconds: top-down colormap of the cat-state Wigner function with interference fringes frozen, CodedLaws logo overlaid center. CTA: "Full video → Phase Space Quantum Mechanics."

## Audio
Dreamy ambient pad at 70 BPM, reverb-heavy. Subtle low-frequency hum beneath the negative probability regions. Sound effect: glassy shimmer as negative lobes appear; low drone as decoherence erases them. No voiceover.

## Production Notes
Renderer: NumPy-based Wigner function computed via Fourier transform of the characteristic function. Cat state |α=2⟩ + |α=−2⟩ (normalized). Decoherence via Lindblad with jump operator â. Surface plotted with Matplotlib 3D using custom diverging colormap (PuOr). Frame export at 1080×1920 as PNG sequence, assembled with FFmpeg.
