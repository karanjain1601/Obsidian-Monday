---
title: "Electroweak Phase Transition — Bubble Nucleation"
id: SA082
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Electroweak Phase Transition: Higgs Field and Baryogenesis"
difficulty: advanced
tags: [physics, simulation, short, advanced, electroweak, phase-transition, bubble-nucleation, Higgs, baryogenesis]
---

> **What it is:** A ~45-second simulation showing electroweak symmetry breaking at ~100 GeV simulated as nucleating Higgs-phase bubbles expanding through the symmetric plasma with bubble wall collisions producing gravitational waves. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Electroweak Phase Transition: Higgs Field and Baryogenesis

# Short: Electroweak Phase Transition — Bubble Nucleation

**Feeds full video:** The Electroweak Phase Transition: Higgs Field and Baryogenesis

## Visual Hook (First 3 Seconds)
A uniform hot plasma (red background, T = 200 GeV = 2.3×10¹⁵ K). The Higgs field ⟨φ⟩ = 0 (symmetric phase). Then: a bubble of broken symmetry nucleates (cyan expanding sphere). Inside the bubble: ⟨φ⟩ = 246 GeV (Higgs vev, blue region). Outside: ⟨φ⟩ = 0 (red). The bubble wall expands at v_w = 0.1c. Text: "Electroweak transition at T_c = 159 GeV."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The finite-temperature Higgs potential: V(φ, T) = m²(T)φ²/2 + λφ⁴/4 + ... where m²(T) = m₀² + aT² − bT. At T > T_c: one minimum at φ=0. At T = T_c: two degenerate minima at φ=0 and φ=v(T). At T < T_c: global minimum at φ=v. The 3D potential surface animates as T cools from 200 GeV to 100 GeV — a new minimum appears and deepens.

**0:10–0:18** — The bubble nucleation rate: Γ = A·e^(−S₃/T) where S₃ is the 3D Euclidean action of the critical bubble. The critical bubble is shown as a spherical configuration — inside: ⟨φ⟩ = v(T_c), outside: ⟨φ⟩ = 0. The bubble wall profile φ(r) is shown as a kink solution (tanh function, gold curve). Wall thickness δ = 1/m_H ≈ 0.8×10⁻¹⁸ m.

**0:18–0:26** — Bubble expansion: once nucleated, the bubble expands because the true vacuum (inside) has lower free energy density. The pressure difference ΔP = −ΔV = ρ_vacuum − ρ_plasma drives expansion. The terminal velocity is reached when friction (plasma particles scattering off the bubble wall) balances the pressure: v_w = 0.1c for Standard Model. The released energy (latent heat) reheats the plasma.

**0:26–0:34** — Baryon asymmetry generation (hypothetical): CP-violating processes at the bubble wall (anomalous baryon number violation via sphalerons). A quark and antiquark (shown as gold and red dots) approach the wall from outside. The CP asymmetry means slightly more quarks than antiquarks diffuse into the unbroken phase and are converted to baryons by sphalerons inside. The baryon density n_B vs distance from wall is plotted.

**0:34–0:42** — The gravitational wave signal: first-order phase transitions (bubble collisions, sound waves, magnetohydrodynamic turbulence) produce a stochastic GW background. The GW spectrum Ω_GW h² vs frequency is shown: peak at f = 10⁻³ Hz (LISA band), amplitude 10⁻¹⁰ for a strong first-order transition. "LISA may detect the EW transition echo."

**0:42–0:50** — Standard Model limitation: the SM electroweak transition at the physical Higgs mass (125 GeV) is actually a crossover, not first-order — no bubbles, no GWs, no efficient baryogenesis. Text: "SM: crossover at m_H = 125 GeV. BSM needed for baryogenesis." Diagrams of BSM candidates: singlet extension, MSSM, appear briefly. Fade to CodedLaws logo.

## Physics Concept Teased
A first-order electroweak phase transition proceeds by nucleation of bubbles of the broken Higgs phase in a cosmological plasma at T ~ 159 GeV. As bubbles expand and collide, CP-violating interactions at bubble walls can generate the baryon asymmetry of the universe, while bubble collision sounds and turbulence generate detectable gravitational waves.

## On-Screen Text / Captions
- **0:00** — "EW transition: T_c = 159 GeV, bubble v_w = 0.1c"
- **0:06** — "V(φ,T): two minima at T = T_c"
- **0:12** — "Nucleation rate: Γ = A·e^(−S₃/T)"
- **0:20** — "Bubble wall: tanh kink, δ = 0.8×10⁻¹⁸ m"
- **0:28** — "CP violation at wall: baryon asymmetry"
- **0:36** — "GW peak at 10⁻³ Hz: LISA sensitivity band"
- **0:44** — "SM: crossover, not first-order — BSM needed"

## End Card
Final 3 seconds: the expanding bubble with cyan interior and red exterior, CodedLaws logo centered. CTA: "Full video → Electroweak Phase Transition."

## Audio
Tense electronic at 80 BPM, building from silence to tension. Bubble nucleation: crystalline "pop" sound. Bubble expansion: growing pressure hiss. Bubble collision: sharp crack. No voiceover.

## Production Notes
Renderer: Finite-temperature Higgs potential: Matplotlib 3D surface with temperature parameter animation. Bubble nucleation: 3D scalar field simulation (lattice Higgs model, Python SciPy). Bubble wall profile: kink solution plotted analytically. GW spectrum: semi-analytic computation from Espinosa et al. (2010). 60 fps, 1080×1920.
