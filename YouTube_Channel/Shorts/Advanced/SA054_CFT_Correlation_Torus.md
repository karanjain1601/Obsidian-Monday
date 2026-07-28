---
title: "Conformal Field Theory — Correlation Functions on Torus"
id: SA054
type: youtube-short
duration: "~45 seconds"
feeds_video: "Conformal Field Theory: From Correlators to Modular Forms"
difficulty: advanced
tags: [physics, simulation, short, advanced, CFT, conformal-field-theory, torus, correlation-functions]
---

> **What it is:** A ~45-second simulation showing CFT two- and four-point correlation functions on a torus verified to be invariant under modular transformations tau -> tau+1 and tau -> -1/tau. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Conformal Field Theory: From Correlators to Modular Forms

# Short: Conformal Field Theory — Correlation Functions on Torus

**Feeds full video:** Conformal Field Theory: From Correlators to Modular Forms

## Visual Hook (First 3 Seconds)
A glowing torus surface (deep blue, semi-transparent) rotates on a black background. On its surface, two operator insertion points flash gold and magenta. Between them, a white curve traces the two-point correlation function ⟨O(z₁)O(z₂)⟩. A modular parameter τ = 0.5 + 0.866i is labeled in cyan.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The complex upper half-plane (Im τ > 0) is displayed as a flat colored plane. The fundamental domain of SL(2,Z) is highlighted in gold: the region |τ| ≥ 1, |Re τ| ≤ ½. A dot at τ = i (self-dual point) glows white. The modular group generators S: τ→−1/τ and T: τ→τ+1 are shown as colored arrows.

**0:10–0:18** — The partition function Z(τ,τ̄) = Tr[q^(L₀-c/24)q̄^(L̄₀-c̄/24)] is displayed with q = e^(2πiτ). For the free boson CFT (c=1), the partition function is computed: Z = |η(τ)|^(−2) where η is the Dedekind eta function. A surface plot of |Z(τ)| over the fundamental domain is shown — a smooth surface with a cusp at τ = i∞.

**0:18–0:26** — Two-point function on the torus: ⟨φ(z,z̄)φ(0)⟩_torus. The result involves the Weierstrass ℘-function and the prime form. A 2D color plot on the torus surface shows the correlation function as a function of (z,z̄) — it diverges (bright white) near z=0 and has periodicity matching the torus lattice.

**0:26–0:34** — Modular covariance demonstrated: as τ shifts by T: τ → τ+1, the partition function is multiplied by e^(2πic/24). The phase is shown on an Argand diagram — a dot rotating on the unit circle by angle 2πc/24 ≈ 0.26 rad (for c=1). The torus "stretches" and the surface deforms accordingly.

**0:34–0:42** — Operator product expansion (OPE) visualization: two operator insertions move toward each other on the torus surface. As |z₁−z₂| → 0, the OPE sum kicks in: O(z₁)O(z₂) → Σ_k C_k |z₁−z₂|^(Δ_k-2Δ_O) O_k(z₂). The leading term (identity operator) dominates — its coefficient is the two-point function normalization.

**0:42–0:50** — Final: the Verlinde formula displayed: N_ij^k = Σ_ℓ (S_iℓ S_jℓ S*_kℓ)/S₀ℓ, giving fusion coefficients from the modular S-matrix. The S-matrix for the Ising CFT (3×3) is shown with values (1/√2)[[1,1,√2],[1,1,-√2],[√2,-√2,0]]. Fade to CodedLaws logo.

## Physics Concept Teased
Conformal field theory on a torus encodes modular invariance — the partition function must transform predictably under SL(2,Z) modular transformations. This constraint, combined with the operator algebra, completely determines all correlation functions and the spectrum of primary operators.

## On-Screen Text / Captions
- **0:00** — "CFT on T²: τ = 0.5 + 0.866i"
- **0:06** — "Fundamental domain of SL(2,Z)"
- **0:12** — "Z(τ) = |η(τ)|⁻² for free boson"
- **0:20** — "Two-point function: Weierstrass ℘-function"
- **0:28** — "T-transform: Z → e^(2πic/24)·Z"
- **0:36** — "OPE: operator algebra in the short-distance limit"
- **0:44** — "Verlinde formula: fusion from S-matrix"

## End Card
Final 3 seconds: the glowing torus with correlation-function heat map on its surface, CodedLaws logo at center. CTA: "Full video → Conformal Field Theory."

## Audio
Ethereal ambient at 68 BPM, soft piano and synthesizer. Resonant tone as modular parameter shifts. Harmonic overtone series on OPE visualization. No voiceover.

## Production Notes
Renderer: Python/SciPy for Dedekind eta and Weierstrass ℘ functions. Torus surface rendered with Three.js TorusGeometry mapped with UV-coordinates. Correlation function heat map via custom texture with WebGL. Fundamental domain plot in Matplotlib. Modular S-matrix computed symbolically for Ising CFT. 60 fps, 1080×1920.
