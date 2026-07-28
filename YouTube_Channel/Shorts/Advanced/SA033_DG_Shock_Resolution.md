---
title: "Discontinuous Galerkin: High-Order Shock Resolution"
id: SA033
type: youtube-short
duration: "~45 seconds"
feeds_video: "Discontinuous Galerkin Methods: High-Order Accuracy for Hyperbolic PDEs"
difficulty: advanced
tags: [physics, simulation, short, advanced, discontinuous-galerkin, dg, high-order, shock, fem, hyperbolic]
---

> **What it is:** A ~45-second simulation of supersonic flow over a wedge using discontinuous Galerkin methods, with high-order polynomial reconstruction inside each element and a slope limiter enforcing sharp shock resolution. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Discontinuous Galerkin Methods: High-Order Accuracy for Hyperbolic PDEs

# Short: Discontinuous Galerkin — High-Order Shock Resolution

**Feeds full video:** Discontinuous Galerkin Methods: High-Order Accuracy for Hyperbolic PDEs

## Visual Hook (First 3 Seconds)
Two density profiles fill the screen side by side. Left: finite volume (red staircase, 100 cells, visible numerical diffusion smearing the shock over 5 cells). Right: DG p=4 (gold sharp profile, same 20 elements, shock crisp in <1 element). "20 elements. Order 4. Better than 100 cells."

## Main Visual Sequence (0:03–0:50)
- **0:03** — DG element interior: one element [x_L, x_R] shown in white box. The solution u_h(x) inside the element is a polynomial of degree p=4 (gold curve with 5 basis functions). Values are discontinuous across element boundaries — two red/blue values shown at each face.
- **0:10** — Basis functions: 5 Legendre polynomials P_0–P_4 on [−1,1] shown (each a different colour: white, cyan, gold, magenta, green). DG solution = Σ û_k P_k. Orthogonality integral: ∫P_m P_n dξ = 2/(2n+1) δ_mn labelled.
- **0:18** — Numerical flux: at each element boundary, Riemann problem solved for the numerical flux F̂. Upwind flux F̂ = F(u⁻) for u_wave > 0 (shown as blue arrow). "Information propagates in the correct direction only."
- **0:27** — Convergence rate: log-log error vs element size h plot. FV 1st order (red slope -1), DG p=1 (blue, slope -2), DG p=3 (gold, slope -4). "Order p gives (p+1) convergence — exponential accuracy gain per element."
- **0:35** — Limiter for shocks: troubled-cell indicator (orange flag) marks the shock element. WENO limiter applied within flagged cell — reduces to 1st order locally (gold bar drops to red bar width) while preserving high order elsewhere (surrounding cyan).
- **0:43** — 2D vortex benchmark: isentropic vortex on 8×8 element grid (64 elements, p=4 → 400 DOF). Density contours perfectly circular (gold circles, error 10⁻⁵). Equivalent FV requires 100×100 = 10,000 cells for the same error.

## Physics Concept Teased
Discontinuous Galerkin methods represent the solution within each element as a high-degree polynomial and connect elements through a numerical flux from a Riemann solver at boundaries, achieving (p+1)-order spatial convergence in smooth regions while remaining robust near shocks through slope limiting — combining the high accuracy of spectral methods with the geometric flexibility of finite elements.

## On-Screen Text / Captions
- **0:00** — "20 elements. Order 4. Better than 100 cells." (white, top)
- **0:10** — "5 Legendre modes per element — orthogonal, local" (gold, lower)
- **0:18** — "Riemann flux: information flows one way" (blue, annotation)
- **0:27** — "p = 3 → slope −4: exponential refinement" (gold, convergence label)
- **0:35** — "Troubled cells: limit locally, stay high-order globally" (white, bottom bar)
- **0:43** — "64 elements = 10,000 FV cells in accuracy" (white, bottom)

## End Card
Final 3 seconds: the 2D vortex benchmark glows with perfect circular contours. "CODED LAWS" in gold. Subscribe. "Next: Isogeometric Analysis →" teaser.

## Audio
Clean synthesizer tone for each Legendre mode; "whomp" when limiter activates at shock; bright resolution chord on vortex reveal. 90 BPM precise electronic. No voiceover.

## Production Notes
DG code: Trixi.jl (Julia, GPU-accelerated). 1D problem: Sod shock tube, N=20 elements, p=4. Limiter: Krivodonova indicator + WENO reconstruction. Convergence study: manufactured solution (sin wave), h = 1/N for N=5,10,20,40. 2D benchmark: isentropic Euler vortex, 8×8 elements p=4, structured quad mesh. GPU: A100, 200 ms per simulation.
