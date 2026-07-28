---
title: "How Voyager Used Planets as a Slingshot"
id: SB131
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, gravity-assist, orbital-mechanics]
---

> **What it is:** A ~45-second simulation short where a tiny spacecraft curves around a striped Jupiter in a hyperbolic arc and shoots out at double its entry speed — a momentum table shows the craft gaining +10 km/s while Jupiter barely slows, and a Voyager timeline card shows real flybys boosting it from 16 to 61 km/s using only gravity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: How Voyager Used Planets as a Slingshot
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black star field. A tiny white spacecraft moves left to right at moderate speed. A giant Jupiter (striped tan/orange sphere, 80 px radius) appears ahead. Spacecraft curves around it in a tight hyperbolic arc and shoots out the other side MUCH faster — white speed trail doubles in length. Bold text: **"Free speed from a planet?"**

## Main Visual Sequence (0:03–0:50)
**0:03** — Top-down solar system view (black background, faint white grid). Jupiter shown as large tan/orange circle (radius 60 px) moving rightward along its orbit (white dashed arc). Gravity well visualization: concentric white circles around Jupiter, fading with distance (like topographic lines). Speed indicator top-left: **"Spacecraft: 10 km/s"** (white).

**0:08** — Spacecraft (white triangle, 12 px) enters frame from the left. Its trajectory appears as a dotted white line (approach path). Velocity vector drawn as a white arrow (length 40 px) pointing right. Jupiter's own velocity vector drawn in orange (length 25 px, pointing same direction — Jupiter orbiting Sun at ~13 km/s). Label: **"Jupiter v = 13 km/s"** (orange).

**0:13** — Spacecraft enters Jupiter's gravitational influence sphere (dashed blue circle, radius 140 px — Hill sphere approximation). Trajectory curves sharply. Hyperbolic path traces in cyan as the spacecraft follows it. The spacecraft speeds up visibly — velocity arrow stretches longer (from 40 px to 60 px) as it approaches periapsis.

**0:19** — Spacecraft reaches closest approach (periapsis, labeled with a gold dot and text **"Periapsis"**). Speed readout peaks: **"Spacecraft: 24 km/s"** (green). Then spacecraft swings around Jupiter's trailing side and begins exiting on the other side of the hyperbola.

**0:25** — Spacecraft exits Hill sphere on the right-right side, now heading more rightward and outward. Speed readout: **"Spacecraft: 20 km/s"** (green). Text annotation: **"+10 km/s gained!"** (bold yellow). Jupiter's speed: **"Jupiter: 12.9999... km/s"** (orange) — negligibly slower. Text: **"Jupiter lost a tiny fraction of its momentum."**

**0:31** — Momentum conservation diagram (white on dark overlay). Two-column table: Spacecraft before vs after: **"10 → 20 km/s"** (green arrow up). Jupiter before vs after: **"13.000 → 12.9999 km/s"** (barely changes — shown as flat line). Total momentum: **"Conserved ✓"** (green checkmark). Mass ratio label: **"m_Jupiter / m_spacecraft ≈ 10²⁵"** — explains negligible Jupiter slowdown.

**0:36** — Voyager 1 timeline panel (white card): **"1977: Voyager 1 launched at 16.26 km/s. Jupiter flyby 1979: boosted to 35.7 km/s. Saturn flyby 1980: boosted to 61.5 km/s. Now: fastest man-made object — 17 km/s beyond the Sun."** A miniature solar system with Voyager's path annotated in cyan.

**0:42** — Full-view simulation: spacecraft arcs around Jupiter and shoots off toward top-right of screen at high speed, leaving a long bright trail. Text: **"Gravity assists: the most elegant free fuel in the universe."**

## Physics Concept Teased
A gravitational slingshot (gravity assist) uses a planet's gravitational field and orbital velocity to transfer momentum from the planet to the spacecraft; in the planet's rest frame the spacecraft enters and exits at the same speed (elastic scattering), but in the Sun's frame the spacecraft has gained the planet's orbital velocity component, achieving a net speed increase.

## On-Screen Text / Captions
- **0:00** — "Free speed from a planet?" (bold white)
- **0:03** — "Spacecraft: 10 km/s | Jupiter: 13 km/s" (speed indicators)
- **0:13** — "Entering Jupiter's gravity well" (top-center, white italic)
- **0:19** — "Periapsis: 24 km/s" (gold dot label, green readout)
- **0:25** — "+10 km/s gained!" (bold yellow, large)
- **0:25** — "Jupiter barely slows down — mass ratio 10²⁵" (small white)
- **0:31** — "Momentum conserved — Jupiter donated speed" (table header)
- **0:36** — "Voyager 1: 16 → 35 → 61 km/s across flybys" (white card)
- **0:42** — "Gravity assist: free momentum, no fuel." (center, bold white)

## End Card
Final 3 seconds: Spacecraft trail fades into star field. White text: **"Follow CodedLaws — space physics explored."** Logo pulse bottom-right.

## Audio
Music: Majestic, slow space synth from 0:00–0:12; excitement crescendo from 0:13 (gravity capture) through 0:25 (speed gained); triumphant orchestral hit at "+10 km/s" reveal; calm, wondrous pad from 0:36 to end. No voiceover. Sound effects: low gravitational rumble as spacecraft approaches Jupiter; whoosh of periapsis pass; ascending tone at speed gain.

## Production Notes
Code complexity: Medium-High. Renderer: Canvas 2D. Key visual trick: simulate the gravity assist analytically — precompute the hyperbolic trajectory using the vis-viva equation (v² = GM(2/r − 1/a)) with a hyperbolic semi-major axis chosen so eccentricity e > 1. Draw the trajectory path as a set of precomputed points rather than running live N-body physics (avoids numerical instability). Spacecraft position: interpolate along the precomputed hyperbola parametrically using hyperbolic anomaly F. Planet moves at constant orbital velocity; spacecraft coordinates are in Sun's reference frame. Speed readout: compute |v| at each point on the precomputed path. Trail: store last 200 positions of spacecraft, draw as fading line. Runtime: ~46 seconds. Gotcha: in the planet's frame the entry and exit speeds are equal (elastic); in the Sun's frame they differ — make sure the simulation uses Sun's frame throughout, or the speed gain won't appear.
