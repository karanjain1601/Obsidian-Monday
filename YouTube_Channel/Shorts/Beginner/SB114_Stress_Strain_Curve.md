---
title: "How Materials Break: Stress vs Strain"
id: SB114
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, elasticity, material-science]
---

> **What it is:** A ~45-second simulation short where a rubber bar is pulled until it necks at the center, snaps with a red particle burst, while a live graph traces the full stress-strain curve through elastic zone, yield point, ultimate tensile strength, and fracture point, revealing the mechanical story of how materials fail. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: How Materials Break: Stress vs Strain
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A thick gray rubber bar (300px × 60px) is anchored at its left end to a dark wall. A red clamp grips the right end. The clamp is being pulled right by a bold orange arrow — "F = 0 N" in white text beside it. The bar looks calm, unstretched. A blank graph in the bottom half of the screen has axes labeled "Strain (ε)" (x-axis, 0–1.0) and "Stress (σ, MPa)" (y-axis, 0–500). The graph is empty. This is the before — something is about to be destroyed.

## Main Visual Sequence (0:03–0:50)
**0:03** — The force arrow begins growing (force increases). The rubber bar stretches horizontally. Its width (height) narrows proportionally (Poisson contraction). The graph begins drawing a rising line from the origin, steep and linear.

**0:10** — Graph zone 1: Elastic Region (green). The line is straight — slope = Young's modulus E. Label: "Elastic Zone: σ = E·ε." The bar stretches to 360px. If released here, it would snap back. A small "springs back" bounce animation plays on a ghost copy of the bar.

**0:16** — Yield point reached (graph dot, yellow): "σ = 250 MPa | Yield Point" label appears. The bar color shifts from gray to light yellow. The line on the graph bends and becomes curved, less steep. Label: "Plastic Zone begins — permanent deformation."

**0:22** — Graph zone 2: Plastic Region (yellow). The bar continues stretching but internal damage is visible — thin dark stress lines (hair cracks) appear along its length. The bar is now 450px long and noticeably thinner (necking begins at center, a 10px width reduction).

**0:28** — Necking: the bar's center thins dramatically to 30px while ends remain 60px. Graph curve peaks — "Ultimate Tensile Strength: σ_UTS = 450 MPa." Label: "UTS — maximum load the material can bear." The bar is 520px long, waist-thin at the center.

**0:34** — Fracture: the bar snaps at the necked zone with a dramatic red flash and particle burst (20 white-gray debris particles). The two halves fly apart — left half stays attached to wall, right half shoots rightward. Graph marks the final point with a red X: "Fracture Point." The graph's last segment (from UTS to fracture) is colored red.

**0:38** — The complete stress-strain curve is shown cleanly, color-coded:
  Green line: Elastic Zone (σ = E·ε, linear)
  Yellow curve: Plastic Zone (curved, post-yield)
  Red end: Fracture (red X)
  Key points labeled: "Yield Point (250 MPa)", "UTS (450 MPa)", "Fracture (ε = 0.8)."

**0:42** — A side-by-side of two materials: rubber (wide flat curve, large strain before fracture) and glass (short steep line, fractures immediately at yield with no plastic zone). Both curves overlaid on the same axes for comparison.

**0:46** — Freeze on the two curves. Bold white text: "Every material has a unique stress-strain story."

## Physics Concept Teased
The stress-strain curve maps a material's mechanical response to loading: the elastic zone (stress proportional to strain, fully reversible) followed by the plastic zone (permanent deformation) and finally fracture. The slope of the elastic region is Young's modulus E; the yield point marks when permanent deformation begins; and the ultimate tensile strength (UTS) is the peak stress before catastrophic failure.

## On-Screen Text / Captions
- **0:03** — "F = 0 N" (orange, force arrow label; updates live)
- **0:10** — "Elastic Zone: σ = E·ε" (green, on graph), "Springs back if released." (white italic, bar ghost)
- **0:16** — "Yield Point: σ = 250 MPa" (yellow dot label, graph)
- **0:16** — "Plastic Zone begins — permanent deformation." (yellow italic, graph annotation)
- **0:28** — "UTS = 450 MPa — max load." (white label, graph peak)
- **0:28** — "Necking" (white arrow pointing to thinned center of bar)
- **0:34** — "FRACTURE" (red flash, large, center screen)
- **0:38** — "Yield Point (250 MPa)", "UTS (450 MPa)", "Fracture (ε = 0.8)" (white graph labels)
- **0:42** — "Rubber" (blue curve label), "Glass" (gray curve label)
- **0:46** — "Every material has a unique stress-strain story." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — we break things for science."

## Audio
Music: Tense, rising ambient electronic, 85 BPM. Crescendos toward the fracture point. Sound effects: a creaking, groaning sound as the bar stretches in the plastic zone; a sharp CRACK and brief silence at fracture. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: represent bar stretching by scaling the canvas horizontally for the bar rectangle (scaleX = current_length / original_length, scaleY = 1/scaleX for Poisson effect, clamped). Necking: once stress exceeds UTS, reduce bar width in the center 20% zone by (sigma - UTS) / UTS * 30px. Live graph: push (strain, stress) data points each frame and draw as a polyline. Runtime: real-time. Gotcha: after fracture, freeze the right half's last position and launch it with a rightward velocity; use a separate particle emitter at the fracture point to spawn debris.
