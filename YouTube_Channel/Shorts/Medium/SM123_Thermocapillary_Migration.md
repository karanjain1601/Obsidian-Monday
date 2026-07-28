---
title: "Thermocapillary Migration — Drop Climbing a Temperature Gradient"
id: SM123
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Microfluidics_Full]]"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, surface-tension, thermocapillary, microfluidics]
---

> **What it is:** A ~45-second simulation short where an oil droplet defies intuition by crawling toward the hotter end of a glass slide — driven by Marangoni flow as surface tension weakens on its warm side — demonstrating the Young-Goldstein-Block thermocapillary migration mechanism. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Microfluidics_Full]]

# Short: Thermocapillary Migration — Drop Climbing a Temperature Gradient
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A single oil droplet sits at the cold end of a glass slide. A temperature gradient runs across the slide — cold at the left (blue), hot at the right (red). The droplet, defying intuition, begins crawling toward the hotter end. No pump. No slope. No external pressure. Just surface tension doing something unexpected.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D side view of a drop (orange, hemispherical, 1mm radius) on a glass substrate. Background temperature field: blue-white gradient left to right (10°C to 70°C). Surface tension formula: σ(T) = σ₀ - β(T - T₀), where β = dσ/dT > 0 for most oils. Cold side of drop: high σ (strong surface tension). Hot side: low σ (weak).
- **0:10–0:18:** Marangoni flow inside the drop: because the cold side pulls harder than the hot side, fluid inside the drop circulates — streaming from hot side to cold side along the contact line, and then upward through the interior (a toroidal roll pattern). Internal streamlines shown as white swirling arrows. This internal circulation drives the drop center-of-mass toward the hot side.
- **0:18–0:28:** External flow in the surrounding gas/liquid: fluid is dragged along the drop surface by the Marangoni stress — a thin external boundary layer shown in yellow streamlines. The drop visibly begins to migrate right (toward hot side). Migration velocity: U_drop ≈ (β·∇T·R) / (2η + 3η_drop) — Young-Goldstein-Block formula. Label appears.
- **0:28–0:38:** Parameter exploration: stronger temperature gradient ∇T → faster migration (linear dependence shown with speed bar). Larger drop radius R → faster migration. Higher viscosity η_drop → slower. Toggle between oil-in-water and water-in-oil systems — migration direction reverses when β changes sign (surfactant effect).
- **0:38–0:45:** Application: droplet manipulation in microfluidics chips. A chip schematic shows temperature gradient lanes guiding colored droplets through a sorting junction. Laser-driven thermocapillary trap: a focused laser beam creates a hot spot; droplets are repelled from the laser spot.

## Physics Concept Teased
Thermocapillary (Marangoni) migration occurs because surface tension is temperature-dependent (σ decreases with T for most fluids). A temperature gradient along a drop's surface creates a surface tension gradient, driving Marangoni flow from hot (low-σ) to cold (high-σ) along the surface. This internal circulation propels the drop toward the hot region. The Young-Goldstein-Block formula gives the migration velocity in the creeping flow limit.

## On-Screen Text / Captions
- **0:00:** "The drop climbs uphill — toward the heat. Physics says it has to."
- **0:08:** "σ(T) = σ₀ − β·ΔT — surface tension weakens at hot end"
- **0:15:** "Marangoni flow: hot side pulls, cold side grips"
- **0:23:** "Migration velocity ~ β · ∇T · R / viscosity"
- **0:30:** "Gradient doubled → speed doubled"
- **0:38:** "Used in microfluidic chips to sort droplets with light."
- **0:44:** "Young, Goldstein, Block — 1959."

## End Card
Final 3 seconds: beautiful overhead view of multiple drops on the gradient, all migrating rightward in formation. Text: "Surface tension: the smallest force with the biggest agenda." Channel logo.

## Audio
Delicate, crystalline ambient — light glass harmonic tones. Voiceover (quietly astonished): "No pump. No slope. Just a temperature difference — and physics does the rest." Gentle ticking as the drop migrates, each tick = 1 second elapsed.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D with p5.js. Key algorithm: Creeping flow (Stokes flow, Re<<1) solver inside and outside the drop. Internal toroidal streamfunction: ψ_in = A·r²·(1-r/R)·sin²(θ). External: ψ_out = Young-Goldstein-Block streamfunction (exact analytical solution in bipolar coordinates). Temperature field: steady linear gradient T(x) = T_cold + (T_hot - T_cold)·x/L. Drop migration: integrate dX/dt = U_YGB = -2β∇T R / (2η + 3η_drop) · μ_external / (μ_external + μ_drop). Render: drop as filled circle moving along substrate. Internal flow shown as rotating streamlines (parameterized curves). Marangoni stress shown as surface arrows with magnitude ∝ -dσ/dx = β·∂T/∂x. Gotcha: the YGB formula assumes quasi-steady Stokes flow — valid only for Re << 1 and Ca << 1.
