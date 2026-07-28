---
title: "Black Hole Thermodynamics — Bekenstein Entropy"
id: SA061
type: youtube-short
duration: "~45 seconds"
feeds_video: "Black Hole Thermodynamics: The Four Laws and Bekenstein-Hawking Entropy"
difficulty: advanced
tags: [physics, simulation, short, advanced, black-holes, thermodynamics, Bekenstein, entropy]
---

> **What it is:** A ~45-second simulation showing the four laws of black hole thermodynamics illustrated with entropy S = A/4hG scaling with horizon area and Hawking temperature T_H = hk/2pi derived and labeled. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Black Hole Thermodynamics: The Four Laws and Bekenstein-Hawking Entropy

# Short: Black Hole Thermodynamics — Bekenstein Entropy

**Feeds full video:** Black Hole Thermodynamics: The Four Laws and Bekenstein-Hawking Entropy

## Visual Hook (First 3 Seconds)
A Schwarzschild black hole (perfect black sphere) on a cosmic background. Surrounding it: a glowing orange event horizon ring. A large formula appears in white: "S_BH = kA/4l_P² = 1.07×10⁷⁷ k_B." A small inset shows: "A = 4πr_s² = 4π(3 km)² = 113 km² (3 solar mass BH)."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The four laws of black hole thermodynamics scroll up, each in a different color: 0th (cyan): κ = constant on horizon; 1st (gold): dM = (κ/8π)dA + ΩdJ + ΦdQ; 2nd (red): dA ≥ 0 (area law); 3rd (white): κ → 0 unattainable. An analogy table beside each law: T↔κ, S↔A, U↔M.

**0:10–0:18** — The Bekenstein entropy: S = kA/4l_P². For a 1 solar-mass black hole: r_s = 2GM/c² = 2.95 km. Area A = 4π(2.95km)² = 110 km². S = 1.07×10⁷⁷ k_B. This is displayed as a growing bar (logarithmic scale) compared to the Sun's thermal entropy S_☉ = 10⁵⁷ k_B. The black hole wins by 10²⁰ — bar stretches off screen.

**0:18–0:26** — The area increase theorem: two black holes (blue sphere m₁ = 10 M_☉ and red sphere m₂ = 5 M_☉) merge. Before: A₁ + A₂ = 4π[(29.5)² + (14.8)²] = 11,600 km². After (m₃ = 15 M_☉): A₃ = 4π(44.3)² = 24,600 km². Green checkmark: "ΔA = +13,000 km² ≥ 0."

**0:26–0:34** — The Penrose process: a particle falling into a Kerr black hole (rotating, shown with swirling accretion lines). The ergosphere (shown as an oblate ellipsoid surrounding the horizon in translucent orange) allows energy extraction. The rotational energy decreases: ΔE_rot = −5×10⁴⁴ J, but the irreducible mass area stays constant.

**0:34–0:42** — Generalized second law (GSL): a box of thermal radiation (red photons, S_matter = 10³⁰ k_B) is dropped into the black hole. The BH area increases by ΔA. The GSL: ΔS_BH + ΔS_matter ≥ 0 is verified numerically: ΔS_BH = +3×10³⁰ k_B, ΔS_matter = −10³⁰ k_B. Net ΔS = +2×10³⁰ ≥ 0. Green checkmark.

**0:42–0:50** — Final: the formula S = A/4 in Planck units is shown against a Penrose diagram of the Schwarzschild black hole. Each Planck-area patch of the horizon is labeled as "1 bit of information." Total bits for a 3 M_☉ BH: 10⁷⁷. "Every horizon patch = one qubit." Fade to CodedLaws logo.

## Physics Concept Teased
The Bekenstein-Hawking entropy S = kA/4l_P² assigns thermodynamic entropy to a black hole proportional to its horizon area in Planck units, not its volume. This holographic scaling — entropy as an area rather than a volume — was the first hint that information in gravity might be encoded on surfaces rather than in bulk.

## On-Screen Text / Captions
- **0:00** — "S_BH = kA/4l_P² = 10⁷⁷ k_B (3 M_☉ BH)"
- **0:06** — "Four laws: κ↔T, A↔S, M↔U"
- **0:12** — "BH entropy 10²⁰× larger than the Sun's"
- **0:20** — "Merger: A₁+A₂=11,600 → A₃=24,600 km²"
- **0:28** — "Penrose process: extract rotational energy"
- **0:36** — "GSL: ΔS_BH + ΔS_matter = +2×10³⁰ ≥ 0"
- **0:44** — "Each Planck-area patch = 1 bit"

## End Card
Final 3 seconds: the Schwarzschild black hole with glowing horizon patches (each labeled "1 bit"), CodedLaws logo centered. CTA: "Full video → Black Hole Thermodynamics."

## Audio
Deep cosmic ambient at 70 BPM. Subtle gravitational wave chirp sound at merger. Satisfying "click" on each law reveal. No voiceover.

## Production Notes
Renderer: Three.js sphere for black hole with custom fresnel shader for horizon glow. Area law verification computed analytically. Bar chart for entropy comparison: D3.js with logarithmic scale. Penrose diagram: custom SVG overlay. Ergosphere shown as parametric oblate ellipsoid in Three.js. 60 fps, 1080×1920.
