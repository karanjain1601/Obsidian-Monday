---
title: "Desert Mirages: Light Bends Near Hot Ground"
id: SB137
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, mirage, total-internal-reflection]
---

> **What it is:** A ~45-second simulation short where a light ray from the sky bends progressively downward through temperature-graded air layers above a scorching desert road, hits the critical angle and totally reflects back upward, and enters an eye that traces the ray backward to a shimmering blue pool below the pavement — showing that mirages are real optics, not imagination. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Desert Mirages: Light Bends Near Hot Ground
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Desert road receding into the distance (flat tan sand, dark grey road, heat shimmer). Ahead: the road appears to show a shimmering pool of blue water. A car icon drives toward it — the pool retreats. Bold text: **"Is that water? No. It's physics."**

## Main Visual Sequence (0:03–0:50)
**0:03** — Side-view diagram of atmosphere above hot desert road (black background). Road surface: bright tan horizontal line at the bottom. Five horizontal gradient layers of air above it (each 30 px tall): bottom layer bright orange-red (#FF6600) labeled **"Layer 1: T = 65 °C (near road)"**; layers above progressively cooler, fading to blue — top layer labeled **"Layer 5: T = 30 °C (ambient)"**. Temperature scale (right side): color-coded thermometer from 30°C (blue) to 65°C (red).

**0:08** — A ray of light from the sky (cyan arrow, 3 px line) enters from the upper-left at 15° to the horizontal. As it crosses each temperature boundary, it bends slightly downward — refraction angle shown at each interface with a small white arc. Labels: **"n decreases with heat → ray bends away from normal."** Snell's law panel appears (white card): **"n₁ sin(θ₁) = n₂ sin(θ₂)"** with values substituted: **"1.0003 × sin(15°) = 1.0000 × sin(θ₂)"**.

**0:14** — Ray reaches the hottest layer (near road) and its angle to the horizontal becomes nearly 0°. The ray grazes the surface. One more layer down and — critical angle exceeded — the ray bends back upward. Text: **"Total internal reflection — in AIR!"** (bold yellow, with exclamation). Arrow shows the ray now heading upward-right, away from the surface.

**0:20** — The reflected ray travels upward-right and enters an eye icon (human eye profile, white, 30×20 px, at upper-right). The eye's brain perceives the light as coming from directly below the road — exactly where sky light comes from. A dotted white line extends from the eye back downward to the apparent source position (below road surface). Text: **"Eye traces ray backward → sees 'water' below road."** Blue-tinted shimmery patch appears below the road line at the apparent source position.

**0:26** — Animation replay: four complete light rays from slightly different angles (all from sky/objects above the road) — each bends and reflects, creating the complete mirage image. The mirage image (inverted, shimmery version of the sky above) appears at road level. Text: **"Mirage = inverted sky reflection from below."**

**0:31** — Comparison panel (two columns, dark background): Left: **"Normal reflection (mirror)"** — flat reflective surface, angle in = angle out, image upright; Right: **"Mirage (gradient refraction)"** — curved ray, image inverted, apparent source below surface. Both show light paths. The mirage image is clearly upside-down relative to the original.

**0:35** — Why it looks like water: a person sees the mirage image. The sky above is blue — so the inverted sky image appears as a blue shimmer on the road. Text: **"Sky is blue → mirage is blue → brain says: water!"** Brain icon with blue arrow.

**0:39** — Critical angle calculation sidebar (white card): **"Critical angle θ_c = arcsin(n₂/n₁)"**. Values for air layers: **"n_hot = 1.000293 (65°C), n_cool = 1.000301 (30°C)"**. Result: **"θ_c ≈ 88.5° from normal — extremely shallow!"** Text: **"Even 1° beyond θ_c → full reflection."**

**0:43** — Final scene: the desert road from the visual hook, but now with light ray overlay drawn on top. Five rays shown bending and reflecting. The mirage pool labeled: **"Mirage."** Text center: **"Mirages are real light — bent by temperature, not magic."**

## Physics Concept Teased
Desert mirages occur because a temperature gradient near the hot ground creates a refractive-index gradient in air; light rays from the sky bend progressively as they enter hotter (less dense, lower n) air layers until the angle of incidence exceeds the critical angle and total internal reflection occurs, sending the rays back upward to appear as if they came from below the road surface.

## On-Screen Text / Captions
- **0:00** — "Is that water? No. It's physics." (bold white)
- **0:03** — Layer labels: T from 65°C (bottom) to 30°C (top) (thermometer)
- **0:08** — "n₁ sin θ₁ = n₂ sin θ₂ — Snell's Law" (white card)
- **0:08** — "n decreases with heat → ray bends away from normal" (white italic)
- **0:14** — "TOTAL INTERNAL REFLECTION — in air!" (bold yellow)
- **0:20** — "Eye traces ray backward → sees 'water'" (white, eye label)
- **0:26** — "Mirage = inverted sky reflection from below" (center bold)
- **0:35** — "Sky is blue → mirage is blue → brain says: water!" (white/blue)
- **0:43** — "Mirages are real light — bent by temperature." (center white bold)

## End Card
Final 3 seconds: Shimmering blue mirage pool on tan desert floor. White text: **"Follow CodedLaws — light bends to physics."** Logo pulse.

## Audio
Music: Dry, ambient desert-wind drone at 0:00; subtle tension builds as light bends (0:08); satisfying "aha" music sting at total internal reflection reveal (0:14); warm, curious resolution from 0:26. No voiceover. Sound effects: heat shimmer ambient (soft, high-frequency flutter); light "ping" at each refraction step; whoosh at total internal reflection reveal.

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: draw the air-layer temperature gradient as a vertical linearGradient behind the scene (from hot orange at y=bottom to cool blue at y=top). Ray path: simulate with small steps (Δy = 2 px per step); at each step compute the local n(y) = 1.0003 − 0.000008*(T(y)−30) (linear approximation), apply Snell's law to update the ray angle; once angle from horizontal exceeds ~88°, reverse the y-velocity component (reflection). Draw accumulated ray as a ctx.lineTo polyline in cyan. For multiple rays (0:26), repeat with 4 starting angles (13°, 14°, 15°, 16°). Mirage image: at the reflection point, draw a vertically-flipped version of the sky gradient (blue radial gradient, semi-transparent) as the "apparent image." Critical angle panel: static text overlay timed to appear at 0:39. Runtime: ~46 seconds. Gotcha: Snell's law in continuous media must use very small Δy steps or the ray will overshoot and miss the reflection zone; use Δy = 0.5 px for smooth bending.
