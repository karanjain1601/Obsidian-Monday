---
title: "Scroll Wave — 3D Spiral"
id: SM152
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, excitable-medium, scroll-wave, 3D-spiral, cardiac-arrhythmia, topology]
---

> **What it is:** A ~45-second simulation short where a rotating scroll wave fills a 3D block of excitable cardiac tissue, with each cross-section showing a 2D spiral connected around a central writhing filament that can knot or break apart, demonstrating how 3D topology governs the transition from organised ventricular tachycardia to chaotic fibrillation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Scroll Wave — 3D Spiral

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 3D block of excitable medium — cardiac tissue in 3D. A rotating scroll wave fills the volume: each 2D cross-section shows a spiral, but in 3D these spirals are connected into a scroll, rotating around a central filament (a 1D curve). The filament writhes and drifts. Far more complex than the 2D spiral (SM151).

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Scroll wave = 3D extension of spiral wave. Each horizontal cross-section is a 2D spiral; the spirals are stacked and connected, rotating around a filament (the 3D generalisation of the spiral tip). Caption: "Scroll wave: 2D spiral × depth = 3D scroll rotating around a filament." Filament = phase singularity line.

**0:10–0:18** — Filament dynamics: the filament obeys a simplified equation: its curvature drives drift, and twist drives instabilities. Negative filament tension → filament extends and may break up (scroll wave instability). Caption: "Negative filament tension → scroll breaks up → fibrillation." This is a key mechanism for transition from tachycardia to fibrillation.

**0:18–0:27** — Scroll ring: a closed-loop filament (a "ring" rather than a line). The scroll ring shrinks over time (positive tension) and eventually annihilates. Caption: "Scroll ring: closed filament — shrinks and disappears (positive tension)." Show the scroll ring collapsing.

**0:27–0:36** — Knot and link filaments: a filament can be knotted (trefoil knot) or two filaments can be linked (Hopf link). These topologically non-trivial configurations are stable or metastable. Caption: "Knotted filament: topologically protected scroll wave." Show trefoil knot filament rotating.

**0:36–0:45** — Clinical relevance: in 3D cardiac muscle (wall 1 cm thick), scroll waves are the true arrhythmia substrate. 3D optical mapping reveals scroll waves directly in animal hearts. Caption: "3D optical mapping: scroll waves observed in real hearts." Bold text: "Scroll wave — a rotating 3D topological object in the heart." Fade to black.

## Physics Concept Teased
Scroll wave: the 3D generalisation of a 2D spiral wave. In 3D excitable media, spiral waves are organised around a filament (1D phase singularity curve). The filament dynamics depend on its curvature and twist. Negative filament tension causes scroll wave breakup — a transition from ventricular tachycardia (organised scroll) to fibrillation (multiple broken scrolls). Knot/link filament topologies are possible.

## On-Screen Text / Captions
- **0:00** — "3D spiral — a scroll wave with a filament."
- **0:05** — "Scroll = 2D spiral stacked — filament = 3D tip"
- **0:12** — "Negative filament tension → scroll breaks → fibrillation"
- **0:20** — "Scroll ring: closed filament — shrinks, annihilates"
- **0:28** — "Knotted filament: topologically protected scroll"
- **0:35** — "3D optical mapping: scroll waves in real hearts"
- **0:43** — "Scroll wave — 3D arrhythmia topology."

## End Card
Final 3 seconds: the scroll wave in 3D — isosurface of the activated region rotating around the filament. Text: "Scroll wave filaments can form Hopf links and trefoil knots — stable topological structures in living tissue." CodedLaws logo.

## Audio
Ominous deep bass hum, rotating. Voiceover at 0:00: "The 2D spiral wave becomes a 3D scroll in real cardiac tissue — its central filament can knot, link, and break apart, dictating whether the heart fibrillates." No other voiceover.

## Production Notes
Code complexity: very complex. Renderer: three.js (3D WebGL). Key algorithm: FitzHugh-Nagumo on a 3D grid (64×64×64) — GPU compute required. ∂u/∂t = D_u∇²u + f(u,v); ∂v/∂t = g(u,v) (same as SM151). 3D Laplacian: six nearest neighbours. Scroll initiation: S1-S2 protocol in 3D — S2 applied to a half-cube after partial recovery. Filament extraction: find voxels where u=u_th and ∂v/∂t=0 simultaneously (phase singularity). Visualise: isosurface of u at threshold using marching cubes; filament as a tube. Scroll ring: create closed filament by special initial condition (cylindrical S1+S2 in annular geometry). Runtime: WebGL compute, ~10 fps for 64³.
