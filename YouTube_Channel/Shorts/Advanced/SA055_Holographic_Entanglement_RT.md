---
title: "Holographic Entanglement — Ryu-Takayanagi Surface"
id: SA055
type: youtube-short
duration: "~45 seconds"
feeds_video: "Holographic Entanglement Entropy and the RT Formula"
difficulty: advanced
tags: [physics, simulation, short, advanced, holography, AdS-CFT, entanglement-entropy, Ryu-Takayanagi]
---

> **What it is:** A ~45-second simulation showing a minimal Ryu-Takayanagi surface in AdS3 bulk geometry whose area divided by 4G exactly equals the entanglement entropy of the boundary CFT interval. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Holographic Entanglement Entropy and the RT Formula

# Short: Holographic Entanglement — Ryu-Takayanagi Surface

**Feeds full video:** Holographic Entanglement Entropy and the RT Formula

## Visual Hook (First 3 Seconds)
A hyperbolic disk (Poincaré disk model of AdS₂) shown with the boundary as a bright white circle. On the boundary, a region A (arc spanning 60°) is colored in cyan. A geodesic curve plunges into the bulk of the disk, connecting the endpoints of A — glowing bright orange. Text: "S_A = Area(γ_A)/4G_N = 2.31."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The full AdS₃/CFT₂ setup: a 3D anti-de Sitter cylinder (gray semi-transparent bulk) with its 2D boundary (bright white surface at the edge). The bulk geodesic γ_A is shown as an orange surface (minimal area surface) anchored at the boundary endpoints of interval A. The RT formula S_A = Area(γ_A)/4G_N is displayed.

**0:10–0:18** — The boundary interval A grows from 10° to 180° (half the circle). As it grows, the RT geodesic arc descends deeper into the bulk. The entanglement entropy S_A is tracked in real time on a red curve plot: S_A = (c/3)·log(ℓ/ε) where c=1, ℓ = interval length, ε = UV cutoff. At ℓ = L/2: S = 0.693·log(L/ε).

**0:18–0:26** — The phase transition: when A exceeds 180° (more than half the boundary), the minimal surface switches from a single connected arc to two separate arcs (one shallow, one deep). This is the holographic phase transition. A jump in S_A is shown with a dashed red line — the "entanglement phase transition."

**0:26–0:34** — Mutual information I(A:B) = S_A + S_B − S_{AB} is computed. A and B are shown as two complementary arcs. As their separation d grows from 0 to L, I(A:B) decreases from a finite value (at d=0: I = 2S_A) to zero when the RT surfaces decouple (d > critical value). The saturation at zero is color-coded green.

**0:34–0:42** — The bulk reconstruction is shown: a bulk operator φ(x, z) in the interior is expressed as a smeared boundary CFT operator via the HKLL kernel: φ(x,z) = ∫dy K(x,z|y) O(y). The kernel K (shown as a colored smearing function on the boundary) has support only on the causal wedge of the subregion A that "sees" the bulk point.

**0:42–0:50** — Final visual: the entanglement wedge of a boundary region A (shown as the bulk region bounded by A ∪ γ_A). The deeper the RT surface, the larger the entanglement wedge — the bulk region accessible to A. Fade to CodedLaws logo.

## Physics Concept Teased
The Ryu-Takayanagi formula equates the entanglement entropy of a boundary region A in a CFT with the area of the minimal bulk geodesic surface anchored at ∂A, expressed as S_A = Area(γ_A)/4G_N. This geometric formula encodes quantum information in spacetime geometry.

## On-Screen Text / Captions
- **0:00** — "RT surface: S_A = Area/4G_N = 2.31"
- **0:06** — "AdS₃ bulk + CFT₂ boundary"
- **0:12** — "S_A = (c/3)log(ℓ/ε) as A grows"
- **0:20** — "Phase transition at A = half-circle"
- **0:28** — "Mutual information I(A:B) → 0 at large separation"
- **0:36** — "Bulk operator = smeared boundary operator"
- **0:44** — "Entanglement wedge: what A can reconstruct"

## End Card
Final 3 seconds: the Poincaré disk with glowing RT geodesic and entanglement wedge highlighted in blue, CodedLaws logo centered. CTA: "Full video → Holographic Entanglement Entropy."

## Audio
Deep ambient drone at 60 BPM, cosmic reverb. Low harmonic tone as RT surface descends into bulk. Phase transition: sharp click followed by silence. No voiceover.

## Production Notes
Renderer: Python with mpmath for hyperbolic geodesic computations. Poincaré disk and geodesics via Matplotlib with custom hyperbolic metric. 3D AdS cylinder with Three.js CylinderGeometry and custom shader for bulk-boundary visualization. RT surface area computed analytically. 60 fps, 1080×1920.
