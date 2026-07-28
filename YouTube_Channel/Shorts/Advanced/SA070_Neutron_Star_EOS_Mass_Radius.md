---
title: "Neutron Star Equation of State — Mass-Radius Relation"
id: SA070
type: youtube-short
duration: "~45 seconds"
feeds_video: "Neutron Star Equations of State: Dense Matter at the Extremes"
difficulty: advanced
tags: [physics, simulation, short, advanced, neutron-stars, equation-of-state, TOV, dense-matter]
---

> **What it is:** A ~45-second simulation showing mass-radius curves for neutron stars computed under several nuclear equations of state -- from soft to stiff -- bounding the maximum mass and minimum radius for each EOS. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Neutron Star Equations of State: Dense Matter at the Extremes

# Short: Neutron Star Equation of State — Mass-Radius Relation

**Feeds full video:** Neutron Star Equations of State: Dense Matter at the Extremes

## Visual Hook (First 3 Seconds)
A mass-radius diagram fills the screen: x-axis = Radius (8–16 km, white), y-axis = Mass (0.5–3.0 M_☉, white). Six different EOS curves glow in different colors: APR4 (cyan), SLy (gold), MPA1 (green), MS1 (magenta), WFF1 (orange), and a quark star (dashed red). Observational constraints in light blue shading. Text: "PSR J0952: M = 2.35 M_☉ — heaviest known pulsar."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Tolman-Oppenheimer-Volkoff equation displayed: dP/dr = −(ρ+P)(M+4πr³P)/(r(r−2M)). This is the GR generalization of hydrostatic equilibrium. The integration procedure shown: start at r=0 with central density ρ_c, integrate outward until P=0 (surface). Each initial ρ_c gives one mass-radius point.

**0:10–0:18** — The nuclear EOS: pressure P vs density ρ for different models. At ρ = ρ_0 = 2.3×10¹⁷ kg/m³ (nuclear saturation density), all models converge. Below ρ_0: neutron drip regime (yellow), above: dense nuclear matter (various models diverge — harder vs softer). Quark matter phase transition at ρ = 2ρ_0 shown as a vertical dashed line (phase jump in pressure).

**0:18–0:26** — Real observational constraints: three panels shown simultaneously. (1) NICER X-ray measurement: PSR J0030+0451, M = 1.34 M_☉, R = 12.71 km (constraint shown as an ellipse in cyan). (2) GW170817 tidal deformability: Λ₁₋₂ constraint (green band slashing across MR diagram). (3) Mass measurement: PSR J0952 M = 2.35 M_☉ lower boundary (horizontal cyan line).

**0:26–0:34** — Tidal deformability Λ: shown as how a star deforms in a tidal field. The star elongates (ellipse in gold) in response to the companion's gravity. Λ = (2/3)k₂(R/M)⁵, where k₂ is the tidal Love number. For a 1.4 M_☉ star: Λ₁.₄ = 400 ± 200 from GW170817. This rules out the stiffest EOS models (Λ too large) and quark stars (Λ too small).

**0:34–0:42** — Neutron star interior layers animation: a cross-section from outside in — outer crust (normal nuclei, gray), inner crust (neutron-rich nuclei + drip neutrons, light blue), outer core (n+p+e+μ fluid, cyan), inner core (possibilities: hyperon matter shown in green, quark-gluon plasma in red, color superconductor in magenta). The layers are labeled with their density ranges.

**0:42–0:50** — Final: the mass-radius diagram with all constraints applied. The allowed EOS region is a narrow band (yellow shading). The maximum mass M_max = 2.3 M_☉ sets a lower bound on the maximum. Text: "EOS determines fate of neutron stars." The Buchdahl limit (R ≥ 9M/4, corresponding to the minimum radius) shown as a diagonal line — stars to its left are black holes. Fade to CodedLaws logo.

## Physics Concept Teased
The neutron star mass-radius relation is determined by the equation of state of ultra-dense nuclear matter, integrated via the Tolman-Oppenheimer-Volkoff equation. Combining X-ray timing, gravitational wave tidal deformability measurements, and radio pulsar mass measurements pins the EOS to an increasingly narrow region.

## On-Screen Text / Captions
- **0:00** — "Mass-radius: 6 EOS models compared"
- **0:06** — "TOV equation: dP/dr = GR hydrostatics"
- **0:12** — "Phase transition at ρ = 2ρ_0 (quark matter?)"
- **0:20** — "NICER: R = 12.71 km at M = 1.34 M_☉"
- **0:28** — "GW170817: Λ₁.₄ = 400 ± 200"
- **0:36** — "Interior: crust → n+p fluid → quark matter?"
- **0:44** — "M_max ≥ 2.35 M_☉ (PSR J0952)"

## End Card
Final 3 seconds: the mass-radius diagram with the allowed EOS band highlighted in gold, CodedLaws logo overlaid. CTA: "Full video → Neutron Star Equations of State."

## Audio
Deep, pulsing ambient at 72 BPM. Low bass hum suggesting extreme density. Sharp ping on each observational constraint appearing. No voiceover.

## Production Notes
Renderer: TOV integration via scipy.integrate.odeint with piecewise polytropic EOS (APR4, SLy, MPA1, MS1). NICER constraint: Gaussian ellipse in Matplotlib. GW170817 tidal constraint from published posteriors. Mass-radius diagram with all constraints: Matplotlib with patch shading. Interior cross-section: Three.js sphere with concentric layer materials. 60 fps, 1080×1920.
