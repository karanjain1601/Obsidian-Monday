---
title: "RANS Turbulence: k-ε vs k-ω Comparison"
id: SA009
type: youtube-short
duration: "~45 seconds"
feeds_video: "Turbulence Modelling: DNS, LES, and RANS Compared"
difficulty: advanced
tags: [physics, simulation, short, advanced, rans, turbulence, k-epsilon, k-omega, cfd]
---

> **What it is:** A ~45-second simulation showing side-by-side CFD of k-epsilon and k-omega RANS models for flow past a bluff body, comparing eddy-viscosity fields and near-wall boundary-layer behavior. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Turbulence Modelling: DNS, LES, and RANS Compared

# Short: RANS Turbulence Model Comparison — k-ε vs k-ω

**Feeds full video:** Turbulence Modelling: DNS, LES, and RANS Compared

## Visual Hook (First 3 Seconds)
Flow over a backwards-facing step: a white streamline fan separates at the corner and forms a large recirculation bubble (shown in red). Left half labelled "k-ε" in blue; right half labelled "k-ω" in gold. Reattachment lengths visibly differ: 7.2H vs 6.1H. "Which is more accurate?" flashes in white.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Side-by-side velocity contours (u/U∞, blue=0 → red=1.2) for k-ε (left) and k-ω (right) over the backstep. Recirculation bubble boundary drawn as white iso-line (u=0).
- **0:10** — Turbulent kinetic energy k contour: k-ε shows broad diffuse peak (max 0.08 m²/s²) near reattachment; k-ω shows sharper, more intense peak (max 0.12 m²/s²) closer to step.
- **0:18** — Model equations panel: k-ε transport equation in blue (two PDEs for k and ε); k-ω transport in gold (two PDEs for k and ω). Key constants highlighted: C_μ = 0.09 (k-ε), α* = 1.0 (k-ω).
- **0:27** — Wall treatment zoom: y⁺ profile shown. k-ω handles low-Re near-wall correctly (y⁺ < 1) without wall functions; k-ε requires wall functions shown as a dotted extension.
- **0:35** — Experimental validation: DNS data points (white circles, Driver & Seegmiller) overlaid on both model predictions. k-ω line (gold) tracks the data better: error 4% vs 11% for k-ε.
- **0:43** — Free-shear vs wall-bounded bar chart: k-ε wins on free jets (blue trophy), k-ω wins on boundary layers and adverse pressure gradient (gold trophy). "No single model wins everywhere."

## Physics Concept Teased
RANS models close the Reynolds-averaged Navier-Stokes equations by modelling all turbulent fluctuations; k-ε works well in free shear flows while k-ω SST captures near-wall adverse pressure gradients more accurately — the choice of model materially changes predicted reattachment length.

## On-Screen Text / Captions
- **0:00** — "Same flow. Two models. Different answers." (white, top)
- **0:03** — "k-ε: reattachment at 7.2H" (blue, left side)
- **0:03** — "k-ω: reattachment at 6.1H" (gold, right side)
- **0:27** — "k-ω handles y⁺ < 1 natively" (gold, lower)
- **0:35** — "k-ω error: 4% — k-ε error: 11%" (white, bottom bar)
- **0:43** — "Model choice depends on flow type" (white, bottom)

## End Card
Final 3 seconds: both simulations merge into a single accurate DNS-matched view. "CODED LAWS" in white. Subscribe button. "Next: DNS — All Scales →" teaser.

## Audio
Steady white-noise wind ambience; data-point chime when DNS dots appear at 0:35; contrast stinger on trophy reveal. 80 BPM ambient. No voiceover.

## Production Notes
CFD solver: OpenFOAM 10. Geometry: backward-facing step H = 0.0127 m, expansion ratio 1.5. Inlet: U∞ = 18.2 m/s, Re_H = 37,400. k-ε: standard Launder-Sharma. k-ω: Menter SST. Mesh: structured quad 400×120, y⁺ = 0.8. Validation data: Driver & Seegmiller (1985).
