---
title: "Mean Field Theory: Ising in High Dimension"
id: SA022
type: youtube-short
duration: "~45 seconds"
feeds_video: "Statistical Mechanics: Phase Transitions and Mean Field Theory"
difficulty: advanced
tags: [physics, simulation, short, advanced, mean-field, ising, phase-transition, statistical-mechanics, critical-phenomena]
---

> **What it is:** A ~45-second simulation of a mean-field Ising model sweeping temperature through T_c, with the magnetization order parameter bifurcating from zero as the system enters the ferromagnetic phase. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Statistical Mechanics: Phase Transitions and Mean Field Theory

# Short: Mean Field Theory — Ising in High Dimension

**Feeds full video:** Statistical Mechanics: Phase Transitions and Mean Field Theory

## Visual Hook (First 3 Seconds)
A 2D Ising lattice (100×100, black = spin down, white = spin up) at T = T_c shows critical fluctuations — enormous correlated domains of all sizes (fractal appearance, teal patches). Then the lattice flattens to a uniform grey: "d → ∞ — mean field". Text: "Critical exponent β: exact vs mean field".

## Main Visual Sequence (0:03–0:50)
- **0:03** — Mean field derivation: a single spin s₀ (gold) surrounded by z = 6 neighbours (grey). Replace each neighbour by its average 〈s〉 = m. Hamiltonian H = −Js₀(zm) − hs₀ shown. Self-consistency equation: m = tanh(βJzm + βh) in white.
- **0:10** — Self-consistency diagram: tanh(βzJm) (gold curve) intersects y = m line (white diagonal). At T > T_c: one solution m = 0. At T < T_c: three solutions, two stable (gold dots at ±m₀), one unstable (red dot at m=0). "Spontaneous symmetry breaking".
- **0:18** — Order parameter m vs T: m (gold) drops from 1.0 at T = 0 to 0 at T_c = 6 K (for z = 6, J = 1). Mean field: m ∝ (T_c−T)^(1/2). Exact 2D Ising (Onsager): m ∝ (T_c−T)^(1/8). Both curves shown; they diverge visibly near T_c.
- **0:27** — Critical exponent comparison table: β (MF = 1/2, 2D = 1/8, 3D = 0.326); γ (MF = 1, 2D = 7/4, 3D = 1.237); ν (MF = 1/2, 2D = 1, 3D = 0.630). Table glows in coloured cells.
- **0:35** — Dimension dependence: mean field becomes exact above upper critical dimension d_c = 4. Plot of β vs d (d = 1, 2, 3, 4, 5): β decreases from 1 (d=5, MF) toward Onsager (d=2). "Mean field is exact for d ≥ 4".
- **0:43** — Correlation length ξ diverges: ξ ∝ |T − T_c|^(−ν). Plot shows ξ → ∞ as T → T_c. Log-log axes; MF slope (cyan, ν = 1/2) and exact 2D slope (gold, ν = 1). "Universality class sets the exponent".

## Physics Concept Teased
Mean field theory replaces the fluctuating environment of each spin with the average magnetisation m of its neighbours, producing a self-consistent equation whose bifurcation structure predicts a phase transition — but with wrong critical exponents in low dimensions where fluctuations (ignored by mean field) become dominant.

## On-Screen Text / Captions
- **0:00** — "Mean field is wrong. Beautifully wrong." (white, top)
- **0:10** — "m = tanh(βzJm) — self-consistency" (gold, equation)
- **0:18** — "β: MF = 1/2. Exact 2D = 1/8." (white, bottom bar)
- **0:27** — "Critical exponents — the fingerprint of a transition" (white, table title)
- **0:35** — "d ≥ 4: mean field becomes exact" (cyan, annotation)
- **0:43** — "Universality class: same exponents, different physics" (white, bottom)

## End Card
Final 3 seconds: the 2D Ising lattice at T_c shows its fractal correlations. "CODED LAWS" in white. Subscribe. "Next: DMRG Entanglement →" teaser.

## Audio
Static-like "spin flip" clicks at the Ising transition; clear chime on each critical exponent reveal; rising tension near T_c. 85 BPM electronic. No voiceover.

## Production Notes
2D Ising MC: Wolff cluster algorithm (Python). Lattice 256×256, periodic BC. MF curve: analytic tanh solution. Onsager: exact analytic formula. Critical exponents: tabulated from literature (2D exact, 3D from Monte Carlo RG). Visualization: matplotlib imshow with bwr colormap.
