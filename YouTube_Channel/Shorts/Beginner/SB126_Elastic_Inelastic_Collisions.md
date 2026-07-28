---
title: "Elastic vs Inelastic: The Collision Zoo"
id: SB126
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, collision, momentum]
---

> **What it is:** A ~45-second simulation short with three stacked tracks where billiard balls bounce with full kinetic energy intact, clay blobs partially merge and lose 50%, and putty balls fuse into one — side-by-side energy bars reveal that momentum is conserved in every collision but kinetic energy survives only the perfectly elastic one. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Elastic vs Inelastic: The Collision Zoo
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Three horizontal tracks stacked vertically on a black background. On each track, two colored balls roll toward each other. All three collide simultaneously with very different results — top balls bounce perfectly, middle balls stick halfway, bottom balls merge completely. Labels flash: **"Elastic" / "Partially Inelastic" / "Perfectly Inelastic"**. Bold and dramatic.

## Main Visual Sequence (0:03–0:50)
**0:03** — Screen divided into three horizontal lanes (thin white dividers). Top lane: label **"1. Elastic"** (cyan). Middle lane: label **"2. Partially Inelastic"** (orange). Bottom lane: label **"3. Perfectly Inelastic"** (magenta). Each lane has two balls approaching from opposite ends.

- Top: two white billiard balls (radius 18 px, labeled "m=1 kg" each)
- Middle: two clay-colored blobs (radius 18 px, tan, labeled "m=1 kg" each)
- Bottom: two grey putty balls (radius 18 px, labeled "m=1 kg" each)

Speed arrows: left ball moving right at v=+3 m/s (green arrow), right ball stationary (label "v=0").

**0:08** — All three pairs collide simultaneously at lane center. Sound effect plays. Three different outcomes:
- Top: white balls bounce — left ball stops, right ball launches at +3 m/s (velocity perfectly exchanged). KE box top-right: **"KE before: 4.5 J → KE after: 4.5 J ✓"** (cyan).
- Middle: clay blobs partially merge — left slows to +1.5 m/s, right moves at +1.5 m/s (blobs partially stuck but separate). KE box: **"KE after: 2.25 J (−50%)"** (orange, arrow down).
- Bottom: putty balls fully merge into one larger ball (radius 26 px) moving at +1.5 m/s. KE box: **"KE after: 2.25 J (−50%)"** (magenta, but note: same number as partial for equal mass).

**0:16** — Pause on collision results. Three KE comparison bars appear beside each lane (white axes, bars fill from left): cyan bar full height (elastic), orange bar half height (partial), magenta bar half height (perfect). Annotation: **"Momentum conserved in ALL three. KE only conserved in elastic."**

**0:22** — Rewind symbol appears (white circular arrow). Each lane resets to starting positions. Now scenario 2: right ball moving left at −2 m/s (instead of stationary). New velocity arrows drawn.

**0:26** — New collisions. Elastic: balls exchange velocities exactly (+3 becomes −2, −2 becomes +3 — perfect swap). KE check: **"KE before = KE after: 6.5 J ✓"** (cyan). Perfectly inelastic: merged ball moves at +0.5 m/s (center of mass velocity). KE after: **"0.25 J (−96%!)"** in red.

**0:32** — Equation panel (dark overlay): Two equations stacked: **"p_total = m₁v₁ + m₂v₂ = const."** (white, bold) and **"KE = ½mv² (elastic only)"** (yellow, bold). Small icon next to each: tick for momentum (all cases), tick for KE (elastic only), cross for KE (inelastic).

**0:38** — Real-world examples appear as pop-up cards (white cards, black text): Elastic → **"Billiard balls, Newton's cradle"**; Partial → **"Car crash with crumple zones"**; Perfect → **"Coupling train cars"**. Each card appears with a small icon sketch.

**0:43** — Zoom back to full three-lane view. All balls set in motion again simultaneously, looping. Bold text: **"Momentum: always conserved. Kinetic energy: not always."**

## Physics Concept Teased
In all collisions momentum is conserved; kinetic energy is additionally conserved only in perfectly elastic collisions, while inelastic collisions convert some KE to heat, sound, or deformation — a spectrum from billiard balls to coalescing putty.

## On-Screen Text / Captions
- **0:03** — "1. Elastic  2. Partly Inelastic  3. Perfectly Inelastic" (lane labels)
- **0:08** — "KE before: 4.5 J → KE after: 4.5 J ✓" (top lane, cyan)
- **0:08** — "KE lost: 50%" (middle + bottom lanes, orange/magenta)
- **0:16** — "Momentum conserved in ALL. KE only in elastic." (center banner, white bold)
- **0:32** — "p = m₁v₁ + m₂v₂ = constant" (equation panel, white)
- **0:38** — "Elastic: billiard balls | Partial: car crash | Perfect: train coupling" (card labels)
- **0:43** — "Momentum: always. Kinetic energy: not always." (bold white, center)

## End Card
Final 3 seconds: Three lanes loop silently. White text: **"Follow CodedLaws — physics made visible."** Logo pulse bottom-right.

## Audio
Music: Upbeat, bouncy synth melody (matching the collision energy) at 80 BPM throughout. Slight volume dip during equation panel (0:32). No voiceover. Sound effects: elastic — crisp billiard-ball click; partially inelastic — muffled thud; perfectly inelastic — dull wet splat. All three sound effects play simultaneously at 0:08 and 0:26.

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: draw all three lanes as independent 1D physics simulations running in parallel. Each simulation has its own coefficient of restitution (e=1 elastic, e=0.5 partial, e=0 perfect). On collision detection (circles overlap), apply impulse: Δv = (1+e) * (v_rel) / 2 for equal masses. KE readout: compute ½mv² for each ball, sum, display. Bar charts: drawn as simple filled rectangles, height proportional to KE ratio. Partial inelastic visual merge: when e=0.5, also visually deform balls into overlapping ovals for 0.3 s then separate. Perfect merge: on collision, destroy both balls and create one new ball with combined mass at contact point. Runtime: ~46 seconds. Gotcha: for the partial inelastic case, e=0.5 does not literally stick — visually offset the overlap to suggest partial adhesion before separation.
