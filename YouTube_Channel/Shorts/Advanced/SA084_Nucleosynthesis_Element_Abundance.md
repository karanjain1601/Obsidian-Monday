---
title: "Nucleosynthesis — Element Abundance Evolution"
id: SA084
type: youtube-short
duration: "~45 seconds"
feeds_video: "Big Bang Nucleosynthesis: Forging the Light Elements"
difficulty: advanced
tags: [physics, simulation, short, advanced, nucleosynthesis, BBN, element-abundances, cosmology]
---

> **What it is:** A ~45-second simulation showing Big Bang nucleosynthesis integrating reaction rates to predict H, D, He-3, He-4, and Li-7 abundances as a function of the baryon-to-photon ratio. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Big Bang Nucleosynthesis: Forging the Light Elements

# Short: Nucleosynthesis — Element Abundance Evolution

**Feeds full video:** Big Bang Nucleosynthesis: Forging the Light Elements

## Visual Hook (First 3 Seconds)
A nuclear chart (atomic number Z vs neutron number N, each square color-coded by stability) fills the screen. The first 20 elements are highlighted. The Big Bang clock starts: "t = 0.01 s, T = 10¹² K." Protons and neutrons (red and blue dots) appear abundant. A counter tracks "n/p = 1." The ratio begins changing — labeled in gold, decreasing.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The n/p ratio evolution: at T > 1 MeV (t < 1 s), weak interactions (n + ν_e ↔ p + e⁻, etc.) maintain n/p = 1. As temperature drops below 1 MeV, weak rates freeze out. The n/p ratio freezes at n/p = 1/7 (due to the neutron-proton mass difference Δm = 1.293 MeV). Plot: n/p vs T from 10 MeV (1.0) to 0.1 MeV (1/7) — an S-curve in gold.

**0:10–0:18** — Deuterium bottleneck: even though T < m_D − m_p − m_n = 2.22 MeV at t = 1 s, deuterium production is blocked by photodissociation (η_baryon = 6×10⁻¹⁰ — high photon-to-baryon ratio means a rare high-energy photon destroys each deuterium). The deuterium abundance tracks the photon destruction rate. "BBN only begins at T = 0.07 MeV (t = 3 min)."

**0:18–0:26** — The nucleosynthesis cascade: at t = 3 min, T = 0.07 MeV, the nuclear reaction network activates. Displayed as a flow chart with colored arrows: d+d → ³He+n → ⁴He+p, d+d → t+p → ⁴He+n, ⁴He+d → ⁶Li, ⁶Li+p → ⁷Be+n → ⁷Li+p. Each reaction shown as a colored edge connecting nuclei. The ⁴He abundance grows rapidly: Y_p = 4n_He/n_total = 0.247.

**0:26–0:34** — The final abundances: a bar chart (logarithmic y-axis) shows mass fractions after BBN completes (t = 20 min). Hydrogen (¹H): 0.752 (tall white bar). Helium-4 (⁴He): 0.247 (tall blue bar). Deuterium: 2.5×10⁻⁵ (small cyan bar). Helium-3: 10⁻⁵ (small bar). Lithium-7: 5×10⁻¹⁰ (tiny bar). These match observations: "Observed D/H = 2.5×10⁻⁵ — CMB constraint."

**0:34–0:42** — The lithium problem: measured Li-7 in metal-poor halo stars: Li/H = 1.2×10⁻¹⁰. BBN prediction: Li/H = 5×10⁻¹⁰ — a factor-of-4 discrepancy. A bar chart shows the contradiction: "Primordial Lithium Problem." Possible solutions labeled: stellar depletion, new light BSM particles at BBN, unknown nuclear rates. The problem is unsolved.

**0:42–0:50** — Stellar nucleosynthesis extension: the BBN chart stops at Li/Be. Stars produce C, N, O via the triple-alpha process (shown as three alphas → ¹²C via the Hoyle state at 7.65 MeV). The full periodic table is shown with color-coded origins: red = BBN (H, He), blue = stellar fusion (C through Fe), green = r-process (beyond Fe). Fade to CodedLaws logo.

## Physics Concept Teased
Big Bang nucleosynthesis forged the light elements (H, He, D, Li) in the first 20 minutes of the universe, with abundances determined by the baryon-to-photon ratio η and the neutron-proton mass difference. The ⁴He abundance Y_p = 24.7% is a precision probe of the number of neutrino species and the expansion rate during BBN.

## On-Screen Text / Captions
- **0:00** — "t = 0.01 s, T = 10¹² K: n/p = 1"
- **0:06** — "Weak freeze-out: n/p → 1/7 at T = 1 MeV"
- **0:12** — "Deuterium bottleneck: BBN starts at t = 3 min"
- **0:20** — "⁴He: Y_p = 0.247 (24.7% of all baryons)"
- **0:28** — "D/H = 2.5×10⁻⁵ — precision baryon density"
- **0:36** — "Lithium problem: predicted 4× too high"
- **0:44** — "Full table: BBN + stars + r-process"

## End Card
Final 3 seconds: the full periodic table color-coded by origin, CodedLaws logo centered. CTA: "Full video → Big Bang Nucleosynthesis."

## Audio
Warm, constructive ambient at 82 BPM — a sense of building and forging. Metallic ping on each nuclear reaction. Dramatic chord as ⁴He bar rises to 24.7%. Questioning, unresolved tone at lithium problem. No voiceover.

## Production Notes
Renderer: BBN network integration: Wagoner code (C) or AlterBBN (Python wrapper). n/p ratio: scipy ODE integration. Bar chart animation: D3.js with log-scale y-axis. Nuclear chart: NumPy array with AME2020 masses, Matplotlib imshow. Flow chart: NetworkX + Matplotlib. 60 fps, 1080×1920.
