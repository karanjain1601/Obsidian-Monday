---
title: "Capillary Action: Water Defies Gravity"
id: SB104
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, capillarity, adhesion]
---

> **What it is:** A ~45-second simulation short where blue water climbs upward inside three glass tubes of different widths simultaneously, with the narrowest tube shooting to three times the height of the widest, revealing how adhesion between water and glass overpowers gravity in proportion to 1/radius. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Capillary Action: Water Defies Gravity
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Three glass tubes stand upright in a shallow tray of bright blue water against a white background. The tubes are visibly different widths: left tube is 60px wide, center is 30px, right is 10px. The water level inside all three tubes is currently at the tray level — no rise yet. A bold red "GRAVITY →" label points downward in the corner. The viewer expects the water to stay flat.

## Main Visual Sequence (0:03–0:50)
**0:03** — Animation starts. Blue water begins climbing inside all three tubes simultaneously. The left (widest) tube rises slowly; the center tube rises faster; the right (narrowest) tube shoots upward rapidly. The rise is animated over 4 seconds.

**0:08** — Motion stops. Water heights are frozen. Height dimension arrows appear next to each tube:
  Left (60px wide): "h = 0.5 cm" label in white
  Center (30px wide): "h = 1.0 cm" label in white
  Right (10px wide): "h = 3.0 cm" label in white

**0:14** — A curved meniscus (concave, blue-white) is drawn at the top of each water column, exaggerated for visibility. Small green adhesion arrows appear at the glass–water contact line on each tube wall, pointing upward and outward along the glass.

**0:20** — The formula "h = 2γ·cosθ / (ρgr)" fades in at the top-center in gold text. Below it: "h ∝ 1/r — narrower tube = higher rise." The letter "r" in the formula pulses to highlight the radius relationship.

**0:26** — An inset microscopic view (bottom-right, 150×150px) shows two glass walls close together with water molecules between them. Cyan adhesion arrows pull the water molecules toward the glass; purple cohesion arrows link water molecules to each other. Both forces labeled.

**0:32** — A slow upward camera pan reveals the top of the right (narrow) tube — the water has risen so far that it is almost at the tube's rim. A "3 cm" ruler icon confirms the height.

**0:38** — The tubes are shown side-by-side with a summary: three tubes, three heights — 0.5, 1.0, 3.0 cm. A curve is drawn connecting the three tops: it forms a hyperbolic h ∝ 1/r curve. Label: "Wider → lower, Narrower → higher."

**0:44** — Real-world icon appears: a plant stem cross-section with water rising through xylem tubes. Label: "Plants use capillary action to pull water from roots to leaves."

**0:47** — Freeze. Bold white text: "Narrower tube = taller rise. Every time."

## Physics Concept Teased
Capillary action occurs when adhesion between water molecules and a tube's walls is stronger than the cohesion between water molecules themselves. The narrower the tube, the greater the ratio of wall contact to fluid volume, so the adhesive pull lifts water higher — described by the Jurin's Law formula h = 2γ·cosθ/(ρgr).

## On-Screen Text / Captions
- **0:08** — "h = 0.5 cm" (white, left tube), "h = 1.0 cm" (white, center), "h = 3.0 cm" (white, right tube)
- **0:14** — "Adhesion: glass pulls water up" (green, beside arrows)
- **0:20** — "h = 2γ·cosθ / (ρgr)" (gold, top-center)
- **0:20** — "Narrower tube = higher rise" (white, below formula)
- **0:26** — "Adhesion" (cyan label, inset), "Cohesion" (purple label, inset)
- **0:38** — "Wider → lower | Narrower → higher" (white, below hyperbolic curve)
- **0:44** — "Plants use capillary action to lift water from roots to leaves" (white italic, beside plant icon)
- **0:47** — "Narrower tube = taller rise. Every time." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — physics every week."

## Audio
Music: Calm, curious electronic ambient, 75 BPM, gentle rising melodic motif that mirrors the water rising. No voiceover. Sound effect: a soft bubbling gurgle as water rises in each tube (staggered: left first, then center, then right).

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: animate water column height using an easing function (ease-out) so the rise looks physically natural — water slows as it approaches equilibrium. Draw the concave meniscus as a quadratic bezier curve at the top of each column. Heights are set by formula h = k/r where k is a display constant chosen to fill the tube appropriately. Runtime: real-time. Gotcha: tube walls must be drawn as two separate rectangles (left wall, right wall) with a gap in the middle for water — do not use a single hollow rectangle or the fill will not work correctly.
