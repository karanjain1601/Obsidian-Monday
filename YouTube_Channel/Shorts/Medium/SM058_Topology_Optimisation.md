---
title: "Topology Optimisation — Material Removal for Stiffness"
id: SM058
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, topology-optimisation, FEM, structural-design, SIMP, engineering]
---

> **What it is:** A ~45-second simulation short where a solid grey block iteratively hollows out — material removed at low-sensitivity locations by the SIMP method — until a bone-like lattice emerges that retains 1.8× greater stiffness per gram using only half the original material. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Topology Optimisation — Material Removal for Stiffness

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A solid grey rectangle — a block of material, fixed at the bottom. A downward load is applied at the top centre. At 2 seconds the grey block begins to hollow out: material is eaten away, leaving a beautiful lattice structure — organic-looking, like a bone cross-section. The result is a structure that uses 50% of the material but retains 85% of the stiffness.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — SIMP method (Solid Isotropic Material with Penalisation): each element has a design variable ρ_e ∈ [0,1] (material density). Stiffness: K_e = ρ_e^p · K_e^solid (p=3 penalises intermediate densities). The optimiser minimises compliance C = uᵀKu (maximises stiffness) subject to a volume constraint. Caption: "SIMP: each element gets a density ρ."

**0:10–0:18** — Iteration animation: the topology evolves iteration by iteration. Early: uniform grey. After 10 iterations: vague diagonal struts appear. After 50: a clear truss-like topology. After 100: fully converged, black-and-white pattern (elements either fully solid or fully void). Graph: compliance vs. iteration — rapidly decreasing.

**0:18–0:27** — Sensitivity analysis: the sensitivity of compliance to each element's density shown as a colour-map (red = removing this element increases compliance most, blue = removing doesn't hurt much). The optimiser removes blue elements. Caption: "Remove low-sensitivity elements first."

**0:27–0:36** — Compare: optimised vs. solid block. Optimised: 50% volume, strut-and-tie pattern. Solid block: 100% volume. Compliance: optimised is 1.8× stiffer per unit mass. Caption: "50% material, 1.8× stiffer per gram." The optimised shape looks like a natural bone or tree branch.

**0:36–0:45** — Real-world: 3D printer produces the optimised bracket in titanium — used in aircraft and biomedical implants. Caption: "3D-printed topology-optimised bracket: aerospace." Bold text: "Topology optimisation — nature's design algorithm." Fade to black.

## Physics Concept Teased
Topology optimisation (SIMP method): the material distribution within a design domain is the optimisation variable. An FEM analysis at each iteration computes sensitivity of structural compliance to each element's density. Material is iteratively removed from low-sensitivity locations, converging to an optimal load-bearing skeleton that is stiff per unit mass.

## On-Screen Text / Captions
- **0:00** — "Solid block. Can we remove material and keep stiffness?"
- **0:05** — "SIMP: E_e = ρ_e^3 · E_solid"
- **0:12** — "Iteration 100: fully converged topology"
- **0:20** — "Sensitivity: remove low-impact elements"
- **0:28** — "50% material → 1.8× stiffer per gram"
- **0:35** — "3D-printed titanium: aerospace bracket"
- **0:43** — "Topology optimisation — nature's own design."

## End Card
Final 3 seconds: side-by-side: solid block (grey) vs. optimised structure (white lattice). Text: "Airbus uses topology optimisation in every new aircraft — saving tonnes of weight." CodedLaws logo.

## Audio
Clean, progressive electronic (85 BPM). Satisfying scraping/carving sound as elements are removed. Voiceover at 0:00: "Start with a solid block, remove material iteratively where it contributes least to stiffness — you get nature's own load-bearing shapes." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D. Key algorithm: 88-line topology optimisation (Sigmund 2001) — the classic reference. 2D plane-stress FEM (quadrilateral elements), bi-linear shape functions. Sensitivity: dC/dρ_e = -p·ρ_e^(p-1)·u_e^T·K_e·u_e. Update: optimality criteria (OC): ρ_new = ρ_old · (-(dC/dρ)/(λ·(dV/dρ)))^0.5, clamped to [0,1]. Lagrange multiplier λ found by bisection. Mesh: 100×60 = 6000 elements. Visualise: grayscale image from ρ matrix. Gotcha: checkerboard patterns — use sensitivity filtering. Runtime: ~2 min in JavaScript for 100 iterations; fast in WebAssembly.
