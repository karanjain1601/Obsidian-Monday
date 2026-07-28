---
title: "Gravitational Lensing: Einstein Rings"
id: SB197
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, gravitational-lensing, general-relativity]
---

> **What it is:** A ~45-second simulation short where a massive galaxy cluster warps background blue galaxy light into four separate images arranged in an Einstein Cross, then as alignment becomes perfect the four blobs merge into a complete glowing Einstein Ring — whose angular radius directly measures the cluster's total dark matter mass. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Gravitational Lensing: Einstein Rings

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black space. A faint blue smear (distant galaxy) sits at center. A massive gold galaxy cluster drifts in front — and the blue smear WARPS. It stretches, arcs, splits into four blue blobs arranged in a cross, then forms a perfect glowing blue ring around the gold cluster. Text: "Einstein Ring. Predicted 1936. First seen 1987."

## Main Visual Sequence (0:03–0:50)
**0:03** — Side-view cross-section: Observer (white eye icon, left), Lens (gold galaxy cluster, center, labeled "Mass M = 10¹⁵ solar masses, D_L = 5 Gly"), Source (blue galaxy, right, labeled "D_S = 10 Gly"). A straight white dashed line connects all three. "Perfect alignment" label when all three are collinear.

**0:08** — Light ray paths drawn. From the blue source galaxy: four light rays emitted in slightly different directions (upward-left, downward-left, upward-right, downward-right). Each ray curves around the gold cluster mass — NOT around the cluster itself, but following the curved spacetime geometry. Label: "Spacetime curvature bends light paths." Curved spacetime grid (faint gold mesh) appears around the cluster.

**0:14** — All four bent rays converge at the observer's eye. From the observer's perspective: the source appears as four images at the bending positions — labeled "1", "2", "3", "4" forming a cross pattern (Einstein Cross, like Huchra's Lens). Label: "4 images — Einstein Cross (slightly offset alignment)."

**0:20** — Now: perfect alignment adjustment. All four images merge as the alignment becomes exact. A perfect circular arc of blue light forms around the gold cluster. It is labeled: "Einstein Ring: θ_E = √(4GM·D_LS / c²·D_L·D_S)." The ring radius is measured: "θ_E = 1.6 arcseconds." Scale bar underneath.

**0:27** — Einstein ring radius equation displayed: θ_E = √(4GM D_LS / c² D_L D_S). Values substituted: M = 10¹⁵ M☉, D_L = 5 Gly, D_S = 10 Gly, D_LS = 5 Gly. Result: θ_E = 35 arcseconds for a cluster. Label: "Ring radius → mass of the lens!"

**0:33** — Mass measurement animation. The ring radius is measured by caliper (0:33, θ_E = 35"). Mass calculated from θ_E — equation animated: M_lens = c² D_L D_S θ_E² / (4G D_LS) = 10¹⁵ M☉. Label: "Gravitational lensing → dark matter mapped!" Dark matter halo (transparent purple shell) appears around the cluster.

**0:38** — Hubble Space Telescope image analog. A real-looking deep field image (simulated) shows a gold cluster with multiple blue arcs and point images. Labels: "Abell 2218", "Strong lensing arcs." Weak lensing shear shown: background galaxy shapes slightly distorted, showing coherent tangential alignment around the cluster.

**0:44** — Final: the Einstein ring pulses blue. Label: "Every massive object in the universe is a lens. Light always curves around mass."

## Physics Concept Teased
Gravitational lensing occurs because mass curves spacetime (general relativity), bending the paths of photons; when a massive object lies exactly between a distant source and observer, light is bent around all sides equally, forming an Einstein ring whose angular radius directly measures the lensing mass — including invisible dark matter.

## On-Screen Text / Captions
- **0:00** — "A galaxy-cluster lens. A perfect ring of light. Einstein's prediction confirmed."
- **0:03** — "Lens mass: 10¹⁵ M☉ | D_L = 5 billion light-years"
- **0:08** — "Mass curves spacetime → light follows curved paths"
- **0:14** — "Slight misalignment → Einstein Cross (4 images)"
- **0:20** — "Perfect alignment → Einstein Ring"
- **0:20** — "θ_E = √(4GM D_LS / c² D_L D_S)"
- **0:27** — "θ_E = 35 arcseconds for galaxy cluster"
- **0:33** — "Ring radius → measure the lens mass"
- **0:33** — "Dark matter mapped by lensing!"
- **0:44** — "Every massive object bends light"

## End Card
**0:47–0:50** — Black background. Perfect blue Einstein ring around a gold cluster. Bold text: "GRAVITATIONAL LENSING — Physics Series". "@CodedLaws". Subscribe button pulses in ring shape.

## Audio
- **Music:** Slow, grand ambient-orchestral — deep cello note, ethereal synth shimmer, 50 BPM. Feels like the fabric of space bending.
- **Voiceover:** "The Einstein ring radius is a direct measurement of the total mass — including invisible dark matter — acting as the gravitational lens." (0:27–0:40, quiet, precise female voice).
- **SFX:** Soft "swoosh" as light paths curve (0:08); resonant "ring" tone when Einstein ring forms (0:20 — sustained for 2 s); deep "thump" when dark matter halo appears (0:33).

## Production Notes
- **Renderer:** Python + Matplotlib for ray tracing diagram (compute deflection angle α = 4GM/c²b for each impact parameter b); Blender or GLSL shader for the Einstein ring visual effect on the source galaxy image.
- **Code complexity:** High. To generate a realistic Einstein ring: set up a 2D source image (blue galaxy); apply gravitational lensing shear and convergence at each image pixel (κ = Σ/Σ_cr, γ from the NFW profile); map source to image plane. Simpler approach: use the analytic point-mass lens formula to warp a Gaussian source.
- **Key visual trick:** Show the transition from Einstein Cross (4 images) to Einstein Ring (ring) by continuously animating the lens-source alignment — as misalignment approaches zero, the four blobs elongate and merge into the ring. This transition is the most visually striking moment.
- **Runtime:** Einstein ring formation transition (0:14–0:20) — animate over 6 s slowly so viewers can register the 4-blob → ring topology change.
- **Gotchas:** Show that the Einstein ring is observed at the LENS PLANE position, not at the source position — the source galaxy image is magnified and distorted, not simply displaced. Also distinguish strong lensing (arcs, rings) from weak lensing (subtle shape distortions) — show both at 0:38.
