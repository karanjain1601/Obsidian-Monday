---
title: "Nuclear Chain Reaction in 45 Seconds"
id: SB121
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, nuclear-physics, fission, chain-reaction]
---

> **What it is:** A ~45-second simulation short where a single neutron strikes a U-235 nucleus and triggers an exponential cascade — a fission counter races from 1 to over a billion as the screen erupts in orange fire, revealing how chain reactions grow as 2ⁿ per generation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Nuclear Chain Reaction in 45 Seconds
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black screen. A single pale-blue neutron dot (radius 8 px) drifts slowly right. It silently collides with a large amber U-235 nucleus (radius 30 px, labeled "U-235" in white). Screen-wide yellow-white flash, then freeze on the split fragments for a half-second before the chain begins.

## Main Visual Sequence (0:03–0:50)
**0:03** — Two daughter neutrons (pale blue, radius 6 px) shoot outward at 45° angles from the fission flash. Two smaller nuclei (barium-141 cyan, krypton-92 magenta) recoil in opposite directions. Yellow star-burst radiation symbol pulses once at impact point.

**0:08** — Each daughter neutron reaches a fresh U-235 nucleus (amber, radius 30 px). Two simultaneous flashes. Counter in top-right corner: **"Fissions: 2"** in bright orange monospace font.

**0:13** — Four neutrons now fan outward. Screen splits into a 2×2 branching tree structure drawn in dim white lines connecting each fission event. Counter: **"Fissions: 4"**.

**0:18** — Eight neutrons, eight collisions happening simultaneously across the black canvas. Orange and yellow flash clusters light up the frame. Counter: **"Fissions: 8"**. A faint red tint begins bleeding into the black background.

**0:24** — Generation 5: 16 simultaneous fissions. The screen is now dense with overlapping amber nuclei and blue neutron trails. Background glows deep red. Counter: **"Fissions: 16"**.

**0:30** — Generation 6: 32 events. Screen nearly saturated with yellow-orange flashes; individual nuclei indistinguishable. Counter: **"Fissions: 32"**. Graph inset (bottom-left, 120×80 px, white axes) shows exponential curve climbing steeply — x-axis "Generation", y-axis "Fissions".

**0:36** — Graph inset zooms to fullscreen. Curve labeled **"2ⁿ"** in orange. A vertical red dashed line at generation 10 shows **"1024 fissions"**. Title text fades in: **"1 neutron → 1 billion in < 1 second"**.

**0:42** — Cut back to full simulation: entire canvas is a solid wall of white-orange fire. Counter flips to **"1,073,741,824"** in bold red. Screen shakes briefly (CSS transform oscillate).

## Physics Concept Teased
Nuclear fission is a chain reaction: each split U-235 nucleus releases 2–3 fast neutrons that trigger further splits, causing exponential growth (2ⁿ per generation) and catastrophic energy release if uncontrolled.

## On-Screen Text / Captions
- **0:00** — "1 neutron." (bottom-center, white, small)
- **0:03** — "U-235 splits → 2 new neutrons" (top-center, yellow)
- **0:08** — "Each neutron causes another split" (bottom-center, white)
- **0:18** — "Generation 4 — already 16 fissions" (top-center, orange)
- **0:30** — "Growth is EXPONENTIAL" (center-screen, bold white, 2-second hold)
- **0:36** — "Formula: 2ⁿ" (graph overlay, orange)
- **0:42** — "This is why nuclear bombs work." (bottom-center, red, bold)
- **0:46** — "Reactors use control rods to slow this down." (bottom-center, white, small italic)

## End Card
Final 3 seconds: Static frame of the fully saturated orange-fire canvas fades to black. White text center-screen: **"Follow for more physics simulations."** CodedLaws logo (bottom-right) pulses once.

## Audio
Music: Low, slow bass drone at 0:00 that rises in pitch and tempo with each generation — reaches rapid-fire electronic percussion by 0:36. No voiceover. Sound effects: each fission event plays a short high-pitched "tick"; by generation 6 the ticks merge into a continuous roar. Music cuts to silence at 0:42 for impact, then soft sustained chord for end card.

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: recursive BFS tree — store each neutron as a node with position and velocity; on collision, spawn two children offset by ±35°; cap at generation 10 to prevent browser crash. Track fission counter as a simple integer incremented on each collision event. Exponential curve drawn using ctx.bezierCurveTo on a 2ⁿ lookup table. Background red tint: overlay a semi-transparent red rect (opacity += 0.03 per generation). Runtime: ~48 seconds at 60 fps. Gotcha: neutron speeds must scale down each generation or they exit canvas before hitting targets — multiply velocity by 0.85 per generation.
