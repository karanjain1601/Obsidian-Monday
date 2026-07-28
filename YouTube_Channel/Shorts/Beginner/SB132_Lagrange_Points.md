---
title: "Space's Perfect Parking Spots: Lagrange Points"
id: SB132
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, lagrange-points, orbital-mechanics]
---

> **What it is:** A ~45-second simulation short where a color-coded gravitational potential heatmap of the Sun-Earth system lights up with five labeled dots — red L1 near Earth, blue L2 where JWST orbits, and twin stable Trojan points L4/L5 forming an equilateral triangle — showing exactly where gravity and centrifugal force balance in the rotating frame. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Space's Perfect Parking Spots: Lagrange Points
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black space. The Sun (yellow circle, 50 px) on the left, Earth (blue circle, 20 px) on the right, orbiting. Five colored dots pop onto the screen in rapid succession — red, blue, green, purple, orange — each labeled L1 through L5. Bold text: **"5 perfect parking spots in space — gravity holds them there."**

## Main Visual Sequence (0:03–0:50)
**0:03** — Top-down view of the Sun-Earth system (rotating reference frame — both Sun and Earth stationary in this frame). Sun: yellow filled circle, radius 40 px, center-left. Earth: blue filled circle, radius 16 px, center-right (to scale roughly 1:4 with Sun). Orbital radius labeled: **"1 AU = 150 million km"** (white dimension line). Faint grey grid fills the background.

**0:08** — Gravitational potential map overlays as a color field: deep blue (low potential, near both bodies), transitioning through purple → magenta → red → orange (high potential in the rotating frame). The effective potential (gravitational + centrifugal) is shown as a smooth heatmap. White contour lines (10 levels) trace iso-potential surfaces. Label: **"Effective potential (rotating frame)"** (top-left, white italic).

**0:13** — L1 appears: red dot (radius 8 px) between Sun and Earth, closer to Earth. Zoom callout box (white border): **"L1 — Between Sun & Earth. Gravity of both balanced. 1.5 million km from Earth."** The saddle-point shape of the potential is highlighted with a white oval around L1. SOHO spacecraft icon: small white satellite sketch labeled **"SOHO here"**.

**0:18** — L2 appears: blue dot on the far side of Earth from Sun. Callout: **"L2 — Behind Earth, 1.5 million km. Earth partially blocks Sun — great for astronomy."** JWST icon labeled **"James Webb Space Telescope"** shown orbiting L2 in a small white halo orbit (30 px radius, dotted circle). Animated slowly.

**0:23** — L3 appears: green dot on the opposite side of the Sun from Earth. Callout: **"L3 — Behind the Sun. Unstable — can't see it from Earth."** Small text: **"No spacecraft here — too far, too unstable."**

**0:27** — L4 and L5 appear together: purple dot (L4, 60° ahead of Earth on its orbit) and orange dot (L5, 60° behind). Equilateral triangle lines drawn from Sun to Earth to L4 and to L5 (white dashed, thin). Callout: **"L4 & L5 — Trojan points. Stable! Jupiter has 12,000+ asteroids here."** Small grey dots cluster near L4 and L5 to represent Trojan asteroids.

**0:33** — Animation: all 5 points visible simultaneously, color-coded, with labels L1–L5 (white text above each dot). The system gently rotates once (the simulation shows what the non-rotating frame looks like — Earth orbits Sun, all 5 points orbit with it). Duration: 4 seconds. Text: **"All 5 points orbit the Sun with Earth — always in the same relative positions."**

**0:38** — JWST spotlight: zoom to L2 region. JWST icon enlarged (40 px). White text: **"JWST launched Dec 25, 2021. Arrived L2: Jan 24, 2022. 100× more powerful than Hubble."** L2 halo orbit animation continues. Earth visible as small blue dot far left.

**0:43** — Summary table (white card): 5-row table — L1: Solar monitoring (SOHO); L2: Space telescopes (JWST); L3: Unused (unstable); L4/L5: Asteroid populations, future space stations. Text below: **"Lagrange points — where gravity does the parking for free."**

## Physics Concept Teased
Lagrange points are the five positions in a two-body gravitational system (e.g., Sun-Earth) where a small third body can remain stationary in the rotating reference frame, because the gravitational and centrifugal forces exactly balance — L4 and L5 are stable equilibria, while L1, L2, L3 are unstable saddle points.

## On-Screen Text / Captions
- **0:00** — "5 perfect parking spots — gravity holds them there" (bold white)
- **0:03** — "1 AU = 150 million km" (dimension label)
- **0:08** — "Effective potential (rotating frame)" (heatmap label)
- **0:13** — "L1: balanced gravity — SOHO here" (red callout)
- **0:18** — "L2: behind Earth — James Webb here" (blue callout)
- **0:23** — "L3: behind Sun — unstable, unused" (green callout)
- **0:27** — "L4 & L5: Trojan points — 12,000+ asteroids" (purple/orange callout)
- **0:38** — "JWST: 100× more powerful than Hubble" (white card)
- **0:43** — "Lagrange points: gravity does the parking." (bold white, center)

## End Card
Final 3 seconds: Full 5-point diagram orbiting slowly on black. White text: **"Follow CodedLaws — orbital mechanics made clear."** Logo pulse.

## Audio
Music: Expansive, slow space synth pad throughout, with gentle arpeggiated melody from 0:13 as each point appears. Slight crescendo at L4/L5 reveal (0:27). Quiet resolution at 0:43. No voiceover. Sound effects: soft "ping" chime for each Lagrange point appearing (5 distinct tones, rising pitch from L1 to L5); subtle orbital hum in background.

## Production Notes
Code complexity: Medium-High. Renderer: Canvas 2D. Key visual trick: gravitational potential heatmap — compute Ω_eff(x,y) = −GM_sun/r_sun − GM_earth/r_earth − ½ω²(x²+y²) on a 400×400 grid, normalize, map to a color ramp (blue→purple→magenta→red→orange), draw as an ImageData pixel array. Lagrange point positions: L1 is between bodies at exact balance (solve numerically with Newton's method in 1D); L2 is on the other side of Earth at same distance as L1 from Earth; L3 is on opposite side of Sun; L4, L5 at 60° ahead/behind Earth on its orbit. Equilateral triangle: draw three canvas lines from Sun center to Earth center to L4 center and back. Trojan asteroids: place 30 small dots randomly within ±15° of L4 and L5. Runtime: ~46 seconds. Gotcha: the heatmap computation is heavy — precompute once before animation starts, not every frame; store as a cached ImageData object drawn each frame.
