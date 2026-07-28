---
title: "How a Telescope Works: Light's Journey"
id: SB139
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, telescope, lenses]
---

> **What it is:** A ~45-second simulation short where three parallel cyan rays from a distant star converge at the objective lens's glowing focal point, then the eyepiece recollimates them into a wider bundle entering the eye — a magnification panel shows M = f₁/f₂ = 20×, and an aperture comparison reveals the objective gathers 200× more light than an unaided pupil. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: How a Telescope Works: Light's Journey
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black screen. A distant star (tiny white point, 2 px, top-left) emits three parallel light rays (white lines). The rays travel across the canvas, hit a large green lens (80 px diameter), and converge to a brilliant white point. Then they expand to a large, bright star image in an eyepiece. Bold text: **"A telescope isn't magic — it's two lenses."**

## Main Visual Sequence (0:03–0:50)
**0:03** — Full telescope ray diagram builds from left to right on a black background. Horizontal optical axis (dashed white line) runs across the full canvas width. At x=80 px: objective lens (tall green biconvex shape, 80 px tall, 15 px wide, bright green #00CC44, semi-transparent, label **"Objective lens"** above, **"f₁ = 400 mm"** below). At x=480 px: eyepiece lens (smaller green biconvex, 30 px tall, label **"Eyepiece"**, **"f₂ = 20 mm"** below). Eye icon (white, 25×15 px, pupil centered) at x=560 px.

**0:08** — Three parallel cyan rays arrive from the left (all horizontal, spaced 20 px apart, representing light from a star at infinity). They hit the objective lens. At the lens, each ray bends (refraction shown at the lens surface with a small angle change). All three converge to a single bright white focal point at **x = 480 px** (the first focal point, labeled **"F₁ = focal point"** with a gold dot and white text).

**0:13** — Label: **"Objective lens converges parallel rays to focal point."** Focal length dimension line: **"f₁ = 400 mm"** (white double-headed arrow from lens center to focal point). The focal point glows with a radial gradient (white center, cyan edge, radius 8 px).

**0:18** — From the focal point, rays diverge. They hit the eyepiece (placed so the focal point is at its front focal plane). The eyepiece recollimates them — rays exit the eyepiece parallel (horizontal) again. But now the ray bundle is wider (magnified exit pupil). Exiting rays: bright cyan, spacing 30 px apart (wider than input). Label: **"Eyepiece collimates rays — eye sees parallel light."**

**0:23** — Magnification calculation panel (white card, 200×100 px, dark background): **"M = f₁ / f₂ = 400 / 20 = 20×"** (large gold "20×" text). Below: **"Angular size of star appears 20× larger."** Two side-by-side circles: left small (unaided eye view, white dot on black), right large (telescope view, larger white dot). Label: **"Unaided  |  Telescope: 20×"**.

**0:28** — Aperture advantage: top-down view of a large objective lens (green circle, 60 px radius) vs. a human pupil (black circle, 4 px radius). Text: **"Objective diameter: 100 mm. Pupil: 7 mm."** Light-gathering ratio: **"(100/7)² ≈ 200× more light!"** (bold yellow). The large lens glows brighter (more cyan rays hitting it).

**0:33** — Real telescope schematic (side view): Draw a simplified telescope tube (grey rectangle, 400×40 px) enclosing the two lenses. A second star (slightly off-axis, yellow dot, 3°) added to the sky. Its rays enter at a slight downward angle, converge at the focal plane (slightly offset from the axis), exit the eyepiece at a slightly downward angle — forming an off-axis image. Label: **"Off-axis star forms image at focal plane — that's how you observe star fields."**

**0:38** — Hubble Space Telescope and James Webb comparison: pop-up icons (white sketch silhouettes). Hubble: **"Primary mirror: 2.4 m diameter. Wavelength: visible light."** JWST: **"Primary mirror: 6.5 m diameter. Wavelength: infrared."** Text: **"Bigger mirror = more light = deeper universe."**

**0:43** — Final diagram: Clean, labeled ray diagram (star → objective → focal point → eyepiece → eye) with all labels visible simultaneously. Text center: **"Two lenses. One principle: convergence then collimation. The whole universe, accessible."**

## Physics Concept Teased
A refracting telescope uses a large objective lens to converge parallel light from distant objects to a focal point, then an eyepiece lens to recollimate the diverging rays into a parallel beam; the angular magnification equals the ratio of focal lengths (M = f₁/f₂), and the large aperture gathers vastly more light than the unaided eye.

## On-Screen Text / Captions
- **0:00** — "A telescope isn't magic — it's two lenses." (bold white)
- **0:03** — "Objective: f₁ = 400 mm | Eyepiece: f₂ = 20 mm" (labels)
- **0:08** — "Parallel rays from a star at infinity" (top-left, white italic)
- **0:13** — "Focal length f₁ = 400 mm" (dimension label)
- **0:18** — "Eyepiece collimates: rays exit parallel" (caption)
- **0:23** — "M = f₁ / f₂ = 400 / 20 = 20×" (gold text, bold)
- **0:28** — "200× more light than your eye alone" (bold yellow)
- **0:38** — "Hubble: 2.4 m | JWST: 6.5 m — bigger = deeper" (card)
- **0:43** — "Two lenses. The whole universe accessible." (center bold white)

## End Card
Final 3 seconds: Ray diagram (star → lenses → eye) glows on black with all labels. White text: **"Follow CodedLaws — optics made crystal clear."** Logo pulse bottom-right.

## Audio
Music: Calm, expansive orchestral pad from 0:00; gentle ascending arpeggio when rays converge at focal point (0:08); triumphant soft chord at "20×" reveal (0:23); wondrous sustained strings at JWST comparison (0:38). No voiceover. Sound effects: soft lens-refraction "tick" at each ray bend; radiant shimmer tone at focal point (0:13); warm "whoosh" as exit rays collimate.

## Production Notes
Code complexity: Low-Medium. Renderer: Canvas 2D. Key visual trick: draw the biconvex lens shape using two ctx.arc() calls (one for each curved surface, arcs overlapping to form lens shape, filled with rgba(0,200,68,0.4)). Ray refraction at lens: use the thin lens formula — for a ray at height h above the optical axis hitting the objective, the ray bends to pass through the focal point (use: slope after lens = (focal_point_y - ray_y) / (focal_x - lens_x)). Three rays at h = −20, 0, +20 from optical axis. After eyepiece, rays exit parallel: compute output slope to make all three parallel again. Magnification circle: draw two canvas circles (radius 5 and 30 px) side by side. Aperture comparison: draw a large and small circle both filled with radial gradient (center white, edge dark). Runtime: ~46 seconds. Gotcha: the "star at infinity" means truly parallel horizontal rays — do not give them any downward slope; even 0.1° will cause the convergence point to miss the eyepiece.
