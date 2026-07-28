---
title: "AdS/CFT — Bulk Reconstruction from Boundary"
id: SA056
type: youtube-short
duration: "~45 seconds"
feeds_video: "AdS/CFT Correspondence: Gravity from Quantum Information"
difficulty: advanced
tags: [physics, simulation, short, advanced, holography, AdS-CFT, bulk-reconstruction, string-theory]
---

> **What it is:** A ~45-second simulation showing a bulk scalar field in AdS3 reconstructed from boundary CFT operator data using the HKLL smearing kernel to demonstrate holographic local bulk reconstruction. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** AdS/CFT Correspondence: Gravity from Quantum Information

# Short: AdS/CFT — Bulk Reconstruction from Boundary

**Feeds full video:** AdS/CFT Correspondence: Gravity from Quantum Information

## Visual Hook (First 3 Seconds)
A gleaming 5-dimensional AdS space (visualized as a funnel geometry, deep blue gradient from center to edge) surrounds a bright white sphere representing the 4D boundary. An arrow points from the complex boundary (covered in gold CFT operator symbols) inward toward the bulk, labeled "holographic dictionary." A graviton wavefunction (oscillating ripple pattern) pulses in the bulk.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Poincaré patch of AdS₅ shown: ds² = (R²/z²)(dx² + dz²), with z being the radial direction. A scalar field Φ(z, x) is initialized near the boundary z → 0. The near-boundary behavior: Φ ~ z^Δ ψ(x) + z^(4-Δ) ⟨O(x)⟩ shown in white text. Δ = conformal dimension, labeled as Δ = 2 (shown in cyan).

**0:10–0:18** — The bulk-to-boundary propagator K(z, x; x') = (z/(z²+|x-x'|²))^Δ is plotted as a 2D heatmap in the (z, x) plane — bright yellow at the source point x', spreading and decaying away. The CFT operator O(x') at the boundary sources the bulk field: Φ(z,x) = ∫dx' K(z,x;x') O(x').

**0:18–0:26** — Two-point function computation: ⟨O(x)O(x')⟩ = 1/|x−x'|^(2Δ) derived from the bulk-to-bulk propagator at the boundary. The CFT 2-point function is shown as a red curve decaying as 1/r⁴ (for Δ=2). The bulk integral that generates it is animated as a sum of paths (orange lines) through the AdS bulk from x to x'.

**0:26–0:34** — The dilaton/axion system: a stack of N D3-branes (shown as gold horizontal sheets) sources an AdS₅×S⁵ geometry. The N label slides from N=1 (no AdS) to N=1000 (full AdS throat), and the geometry deforms accordingly. Text: "N=1000: λ = g_YM²·N = 100 (strong coupling)."

**0:34–0:42** — A black hole in AdS is shown: a Schwarzschild-AdS geometry with a horizon at z = z_h. The temperature T = 1/(πz_h) = 0.318/fm is labeled. On the boundary, the dual CFT is in a thermal state at the same temperature — shown as a thermal density matrix ρ = e^(−H/T)/Z. "Hawking temperature = CFT temperature."

**0:42–0:50** — The GKPW dictionary entry: Z_gravity[Φ₀] = Z_CFT[source = Φ₀]. This is shown as two equal boxes — left: path integral over bulk metrics (gray), right: CFT partition function (gold). An equals sign glows between them. Fade to CodedLaws logo.

## Physics Concept Teased
The AdS/CFT correspondence equates a quantum gravity theory in an (n+1)-dimensional anti-de Sitter bulk with a conformal field theory on its n-dimensional boundary. Bulk fields are dual to CFT operators, and the classical limit of gravity (large N) corresponds to strong coupling in the CFT.

## On-Screen Text / Captions
- **0:00** — "AdS₅ bulk ↔ CFT₄ boundary"
- **0:06** — "Bulk field: Φ~z^Δ·ψ + z^(4-Δ)·⟨O⟩"
- **0:12** — "Bulk-to-boundary propagator K(z,x;x')"
- **0:20** — "⟨O(x)O(x')⟩ = 1/|x-x'|^(2Δ) from bulk"
- **0:28** — "N D3-branes: λ = g²N = strong coupling"
- **0:36** — "AdS black hole = CFT thermal state, T = 0.318"
- **0:44** — "Z_gravity = Z_CFT: the holographic dictionary"

## End Card
Final 3 seconds: the funnel AdS geometry with the bright boundary sphere and gold CFT symbols, CodedLaws logo at center. CTA: "Full video → AdS/CFT Correspondence."

## Audio
Grand ambient orchestral-electronic hybrid at 75 BPM. Deep bass pulse on black hole formation. Harmonic tones for bulk-to-boundary propagator paths. No voiceover.

## Production Notes
Renderer: Three.js for AdS funnel geometry (parametric surface). Bulk-to-boundary propagator heatmap via NumPy/Matplotlib. AdS black hole: custom Schwarzschild-AdS metric integration. D3-brane stack: animated displacement geometry. Two-point function computed analytically. 60 fps, 1080×1920.
