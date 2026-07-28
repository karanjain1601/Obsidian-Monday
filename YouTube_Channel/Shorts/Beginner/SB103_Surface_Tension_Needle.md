---
title: "Why a Metal Needle Floats on Water"
id: SB103
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, surface-tension, capillarity]
---

> **What it is:** A ~45-second simulation short where a silver steel needle rests in a visible V-shaped dip on a teal water surface, held up by angled surface tension force arrows equal to its weight — until a finger pushes it through and it sinks, demonstrating how water's elastic molecular skin can support dense objects. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Why a Metal Needle Floats on Water
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A photorealistic silver steel needle (200px long, 4px wide) rests horizontally on a flat water surface rendered in deep teal-blue. The water surface beneath the needle is visibly depressed — a shallow V-shaped dent stretching 80px on each side. The needle glows with a faint metallic sheen. Below the surface the water is still; above it, air is white. The paradox is instant: metal should sink.

## Main Visual Sequence (0:03–0:50)
**0:03** — The camera (viewport) slowly zooms in 2× on the needle–surface contact point over 3 seconds, revealing the curved meniscus depression in high detail. Water molecules are represented as small cyan circles at the surface.

**0:08** — Small white force arrows appear at the two contact edges of the needle, angled upward and inward at ~45°. Label: "Surface tension force." The arrows' vertical components combine to a net upward resultant arrow (larger, yellow) directly under the needle center.

**0:14** — A "Weight" arrow (red, downward, labeled "0.28 N") appears at the needle's center of mass. A "Net surface force" arrow (yellow, upward, labeled "0.28 N") appears below it. Both arrows are equal length. Text: "Forces balance → needle floats."

**0:20** — The scene zooms back out. A small inset diagram appears in the bottom-left: a 2D molecular lattice showing interior water molecules pulled equally in all directions (net force = 0) vs. surface molecules pulled only sideways and downward (net inward pull). The difference is labeled "Surface tension γ."

**0:28** — A finger icon appears above the needle and gently presses it 10px downward into the water. The meniscus distorts further. A red "Downward push" arrow appears.

**0:34** — The needle breaks through the surface — a dramatic ripple ring expands outward in blue-white. The needle sinks and tumbles to the bottom of the frame. Text flashes: "Surface broken → needle sinks."

**0:40** — Cut back to the intact floating needle. Text overlay: "Steel density = 7,874 kg/m³ — yet it floats." A second needle is placed next to the first; both float.

**0:46** — Freeze. White text: "Surface tension holds up to 7× a needle's weight."

## Physics Concept Teased
Water's surface tension arises because surface molecules are pulled inward by their neighbors but have no molecules above them, creating a net inward force that forms an elastic-like "skin." This skin can support small, dense objects like a steel needle if the object's weight does not exceed the upward component of the tension force along the perimeter of contact.

## On-Screen Text / Captions
- **0:08** — "Surface tension force" (white, on force arrows, both sides)
- **0:14** — "0.28 N ↓ Weight" (red, center needle)
- **0:14** — "0.28 N ↑ Surface force" (yellow, center needle)
- **0:14** — "Forces balance → needle floats" (white, top-right)
- **0:20** — "Surface tension γ" (white label, inset diagram)
- **0:34** — "Surface broken → needle sinks" (red flash, center)
- **0:40** — "Steel: 7,874 kg/m³ — yet it floats" (white, lower-center)
- **0:46** — "Surface tension holds up to 7× a needle's weight." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo centered. Tagline: "Physics is weirder than you think. Follow."

## Audio
Music: Soft ambient water-droplet sounds layered with a light electronic melody, 70 BPM. Sound effect: a gentle surface-break "sploosh" at 0:34 when the needle sinks. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D with bezier curves for meniscus. Key visual trick: draw the water surface as a bezier path whose control points dip downward under the needle's X position; update control point Y based on needle weight vs. surface tension constant. Animate the ripple ring at 0:34 as an expanding ellipse with decreasing alpha. Runtime: real-time. Gotcha: the meniscus shape must be symmetric; use two cubic beziers meeting at the needle center-bottom.
