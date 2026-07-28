---
title: "Fiber Optics: Light Trapped in Glass"
id: SB141
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, fiber-optics, total-internal-reflection]
---

> **What it is:** A ~45-second simulation short where a bright white ray zig-zags through a curved glass fiber without escaping, with a protractor overlay comparing angles above and below the critical angle to show total internal reflection. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Fiber Optics: Light Trapped in Glass
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A single bright-white light ray enters the left end of a thin curved glass fiber (pale blue, 20px wide) against a black background. The ray instantly bounces in a zig-zag pattern from wall to wall along the full length of the fiber, emerging from the right end as a sharp white dot — all within one second of animation.

## Main Visual Sequence (0:03–0:50)
**0:03** — Camera pulls back to show the full fiber in a gentle S-curve shape, 600px long. The glass walls are rendered with a slight refractive-index gradient (brighter core, dim cladding). The white ray bounces at each wall with a crisp reflection spark.

**0:10** — Freeze-frame at one bounce point. A protractor overlay appears: the angle of incidence (θ_i = 48°, red arc) and the critical angle marker (θ_c = 42°, yellow dashed line). Text below: "θ_i > θ_c = Total Internal Reflection." The ray does NOT escape the fiber.

**0:18** — A second scenario appears side-by-side: same fiber but the ray hits at θ = 30° (below critical angle). The ray partially refracts OUT of the fiber (dim grey arrow leaks into cladding) and the intensity inside drops visibly. Label: "θ < θ_c — Light Leaks Out."

**0:27** — Back to the correctly guided ray. The fiber bends into a 90° curve. The ray continues bouncing and successfully navigates the bend, emerging at the new direction. Annotation: "Light follows ANY shape."

**0:35** — Split screen: left side shows 1 fiber carrying a white pulse; right side shows a bundle of 100 fibers each carrying differently colored pulses (red, green, blue alternating). Label: "Fiber bundles = massive data bandwidth."

**0:43** — Zoom out to show the fiber connecting two cities on a globe. Speed label: "Data travels at ~200,000 km/s inside glass." Globe fades to CodedLaws logo.

## Physics Concept Teased
When light travels from a denser medium (glass) to a less dense medium (air/cladding) at an angle exceeding the critical angle, it undergoes total internal reflection — bouncing indefinitely with zero energy loss. This is how fiber-optic cables carry data for thousands of kilometers.

## On-Screen Text / Captions
- 0:03 → "Total Internal Reflection"
- 0:10 → "θᵢ > θ_c → light stays inside"
- 0:18 → "θᵢ < θ_c → light escapes"
- 0:27 → "Bend the fiber — light follows"
- 0:35 → "Bandwidth: terabits per second"
- 0:43 → "Your internet travels in glass"

## End Card
Final 3 seconds: The white dot exits the fiber and expands into the CodedLaws logo (cyan outline). Bold white text: "Follow for more physics simulations." Subscribe button pulses on the right.

## Audio
Upbeat electronic/lo-fi instrumental at 90 BPM. Voiceover: "When light can't escape glass, it carries your data around the world." Crisp "ping" sound effect at each reflection bounce along the fiber.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw the fiber as two parallel Bezier curves; trace ray using iterative angle-of-incidence calculation at each tangent wall segment. Render TIR sparks as brief white radial gradient flashes. Runtime: real-time at 60fps. Gotcha: curvature of fiber must stay gradual enough that angle never drops below critical angle, or add mode-leakage visual explicitly.
