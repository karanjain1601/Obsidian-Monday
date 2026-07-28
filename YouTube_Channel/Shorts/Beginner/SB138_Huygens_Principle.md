---
title: "Huygens' Principle: Every Wave Point Is a Source"
id: SB138
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, waves, huygens, wavefronts]
---

> **What it is:** A ~45-second simulation short where twenty circular wavelets bloom from a plane wavefront and their common envelope traces the next straight front — the sequence repeats at a narrow slit showing diffraction fan out as a semicircle, then at a diagonal boundary where slower-expanding circles in the denser medium bend the wavefront, deriving Snell's law from geometry alone. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Huygens' Principle: Every Wave Point Is a Source
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Dark navy background. A straight horizontal wavefront (bright cyan line) moves downward. Suddenly, dozens of tiny circular waves bloom from every point on it — like a field of expanding soap bubbles. The new wavefront (the envelope of all circles) clearly forms below. Text: **"Every point on a wave is its own wave source."**

## Main Visual Sequence (0:03–0:50)
**0:03** — Scene establishes: dark navy (#0A0E2A) background. A perfectly straight, bright cyan horizontal line (the incoming plane wavefront, 2 px, spanning 500 px) appears near the top of the canvas. Below it: empty dark space. Wavelength indicator (white): **"λ = 40 px"**. Label: **"Plane wave (wavefront)"** with small white arrow pointing downward (direction of propagation).

**0:08** — The wavefront advances downward by λ/2. Now, 20 equally spaced white dots (radius 3 px) appear along the original wavefront position. Each dot is labeled in small white text: **"Point source"** (with a leader line to one representative dot). From each dot, a small white circle begins expanding (radius grows from 0 at 2 px/frame).

**0:13** — All 20 circles have grown to radius 20 px (= λ/2). They overlap slightly in the middle of the canvas — constructive interference region shows cyan glow where circles overlap. The outer edges of the full set of circles define a new straight cyan line below — the next wavefront. Text: **"Circles' envelope = next wavefront."** A bright cyan line traces the common tangent of all 20 circles.

**0:18** — Animation repeats 3 more times (sped up). Each cycle: wavefront advances, 20 new circles sprout, circles expand, new wavefront forms. The plane wave appears to propagate smoothly downward. Caption: **"Repeat → plane wave propagation."** Speed indicator: **"Wave speed c = λ/T"** (white).

**0:23** — Scene change: now the plane wave hits a boundary (white horizontal line). The boundary has a single narrow gap (slit, 60 px wide, labeled **"Slit width a = 1.5λ"**). Waves to the left and right of the slit are blocked. Only the waves that pass through the slit continue.

**0:27** — From the slit opening: instead of a plane wave, a semicircular wave fans out on the other side (diffraction!). Huygens circles sprout from every point within the slit, fan out in all directions. The resulting wavefront is an arc, not a straight line. Text: **"Slit → circular wave. This is DIFFRACTION."** (bold yellow).

**0:32** — Narrow the slit further: **"a = 0.5λ"** (slit narrows to 20 px). Now diffraction is extreme — nearly a perfect semicircle fans out. Text: **"Narrower slit = more spreading."** Wide slit (a = 4λ) comparison: minimal spreading, mostly straight. Both shown side by side: left = narrow (strong diffraction), right = wide (weak diffraction).

**0:37** — Refraction demonstration: wave hits a diagonal boundary (white line at 45°). Above boundary: wave moves at speed c₁ (fast). Below: speed c₂ < c₁ (slower medium, shown as tinted orange region). Huygens circles below the boundary are smaller (slower expansion). Envelope of circles forms a wavefront at a different angle — the refracted wave bends toward the normal. Text: **"Slower medium → wavefront bends → refraction."**

**0:42** — Snell's law derived: side panel (dark background): **"sin(θ₁)/sin(θ₂) = v₁/v₂ = n₂/n₁."** Line drawn from the geometry: the ratio of wavefront speeds directly gives Snell's law. Text: **"Huygens derived Snell's law in 1678 — using only circles."**

**0:45** — Final text: **"Huygens' Principle: every wavefront point is a source. From it: all of wave optics."**

## Physics Concept Teased
Huygens' principle states that every point on a propagating wavefront acts as a secondary point source of spherical wavelets; the new wavefront is the common tangent (envelope) of all these wavelets — this simple idea explains reflection, refraction, and diffraction without any additional assumptions.

## On-Screen Text / Captions
- **0:00** — "Every point on a wave is its own wave source." (bold white)
- **0:03** — "Plane wave (wavefront) | λ = 40 px" (labels)
- **0:08** — "Point source" (leader line to dot)
- **0:13** — "Circles' envelope = next wavefront" (label, cyan)
- **0:23** — "Slit width a = 1.5λ" (slit label, white)
- **0:27** — "DIFFRACTION — wave fans out after slit" (bold yellow)
- **0:32** — "Narrower slit = more spreading" (caption, white)
- **0:37** — "Slower medium → wavefront bends → refraction" (white italic)
- **0:42** — "sin θ₁ / sin θ₂ = v₁ / v₂ — Snell's Law from Huygens" (panel, white)
- **0:45** — "From circles: all of wave optics." (bold center white)

## End Card
Final 3 seconds: Animated plane wave propagating downward with Huygens circles visible. White text: **"Follow CodedLaws — waves made visible."** Logo pulse bottom-right.

## Audio
Music: Minimalist, rhythmic synth pulse (beat every 0.5 s matching wavefront advance) from 0:00–0:22; transitions to warmer, broader pad at diffraction reveal (0:27); full resolution chord at 0:45. No voiceover. Sound effects: soft "whomp" for each wavefront advance cycle; brighter chime at slit passage (diffraction); low tone shift when entering slower medium (0:37).

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: for each Huygens point source, draw an arc (not a full circle) only within the forward half-space (forward hemisphere) to avoid backward-going wavelets that would confuse the viewer. Use ctx.arc(x, y, r, startAngle, endAngle) where startAngle and endAngle define the forward-facing semicircle. Point sources: place them at equal spacing (every 25 px) along the current wavefront x-positions. Each source is born at the same frame and expands at the wave speed (2 px/frame). After radius = λ/2, destroy the circle and draw the new wavefront tangent. Envelope calculation: the common tangent of 20 expanding circles at the same radius is simply a horizontal line offset by the radius — compute analytically, not geometrically. Diffraction: change point source positions to cluster only within the slit width. Refraction: in the slower medium, reduce expansion rate from 2 px/frame to 1 px/frame; the asymmetric radii automatically produce the correct wavefront bending angle. Runtime: ~48 seconds. Gotcha: avoid drawing the backward wavelets (the part of each circle going "up" against propagation) — they are not physical in the forward-scattering limit and confuse beginners.
