---
title: "Isogeometric Analysis: NURBS-Based FEM"
id: SA034
type: youtube-short
duration: "~45 seconds"
feeds_video: "Isogeometric Analysis: Exact Geometry in Finite Element Simulation"
difficulty: advanced
tags: [physics, simulation, short, advanced, iga, nurbs, fem, isogeometric, structural]
---

> **What it is:** A ~45-second simulation of isogeometric analysis using NURBS basis functions to represent a shell geometry exactly and solve structural stresses, compared to standard polynomial FEM on the same shape. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Isogeometric Analysis: Exact Geometry in Finite Element Simulation

# Short: Isogeometric Analysis — NURBS-Based FEM

**Feeds full video:** Isogeometric Analysis: Exact Geometry in Finite Element Simulation

## Visual Hook (First 3 Seconds)
A smooth circular pressure vessel (torus cross-section, silver metallic shader) deforms under 15 MPa internal pressure. Displacement shown as a rainbow heatmap (blue = 0 mm, red = 3.8 mm). Then the same geometry rendered in standard FEM faceted approximation — visible polygonal edges at the circular cross-section. "NURBS: exact geometry. No approximation error."

## Main Visual Sequence (0:03–0:50)
- **0:03** — CAD-to-FEM gap: traditional workflow: (1) CAD (NURBS, exact); (2) mesh generator facets the geometry (error introduced); (3) FEM on faceted mesh. IGA: CAD → FEM directly using NURBS basis. "IGA closes the CAD-FEM gap" caption.
- **0:10** — NURBS basis functions: B-spline basis N_i,p(ξ) of degree p=3 shown (4 overlapping hat-like curves in cyan). Rational weight w_i controls shape (a quadratic NURBS circle: w_corner = 1/√2, shown on plot). "NURBS represent circles exactly" annotation.
- **0:18** — k-refinement: in standard FEM, mesh refinement (h-refinement) adds nodes. In IGA, k-refinement increases both polynomial order and continuity simultaneously (knot insertion + degree elevation). Basis function continuity C^(p-1) across elements shown as increasingly smooth curves.
- **0:27** — Thin shell NURBS benchmark: pinched cylinder (radius 0.3 m, thickness 3 mm, length 0.6 m, two point loads ±1 N). IGA solution: tip displacement 1.875×10⁻⁵ m (gold). Exact: 1.8248×10⁻⁵ m. Error 2.7%. FEM (linear tri): error 18% on same DOF count.
- **0:35** — Stiffness matrix bandwidth: NURBS basis functions are non-local (each spans p+1 elements). Matrix structure shown as sparsity plot (cyan dots): NURBS wider band (p+1 times broader) than standard linear elements. "Higher bandwidth — but higher accuracy per DOF."
- **0:43** — Industrial demo: turbine blade (CAD NURBS surface) directly analysed under thermal load. Temperature field (blue=900°C → red=1,200°C) mapped on exact geometry. "No remeshing. No approximation."

## Physics Concept Teased
Isogeometric Analysis uses the same NURBS (Non-Uniform Rational B-Spline) basis functions for both geometry description and solution field approximation, eliminating the geometric discretisation error inherent in standard FEM and enabling exact representation of CAD geometries (circles, conics, free-form surfaces) with higher-continuity basis functions.

## On-Screen Text / Captions
- **0:00** — "NURBS geometry. Same basis for physics." (white, top)
- **0:10** — "NURBS corners: w = 1/√2 for exact circle" (cyan, annotation)
- **0:18** — "k-refinement: more smooth, not just more nodes" (white, lower)
- **0:27** — "IGA error: 2.7%. FEM error: 18%. Same DOFs." (gold, table)
- **0:35** — "Higher bandwidth — but worth every byte" (white, bottom bar)
- **0:43** — "No remeshing — direct CAD analysis" (gold, bottom)

## End Card
Final 3 seconds: the turbine blade deformation field glows. "CODED LAWS" in silver. Subscribe. "Next: Peridynamics Crack →" teaser.

## Audio
Precision mechanical hum; "ding" when IGA error label appears; sharp contrast tone on the FEM vs IGA accuracy comparison. 80 BPM minimal ambient. No voiceover.

## Production Notes
IGA code: PetIGA (PETSc-based) + custom NURBS basis evaluator. Geometry: torus NURBS patch degree (3,3). Pinched cylinder: NURBS patch 16×16 control points, degree p=3, k-refinement to 64×64 DOF. Structural mechanics: linear elastic, E = 210 GPa, ν = 0.3. Turbine: CAD from IGES file, converted to NURBS via openNURBS. Visualization: ParaView.
