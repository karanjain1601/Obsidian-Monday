---
title: "Sound Travels 15× Faster in Steel Than Air"
id: SB116
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, waves, sound, propagation]
---

> **What it is:** A ~45-second simulation short where three glowing pulse dots race simultaneously across stacked Air, Water, and Steel tracks, with the steel pulse crossing the finish line and flashing orange while the air pulse is still only 30% across, showing how tightly packed atoms transmit sound vibrations up to 15× faster than gas molecules. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Sound Travels 15× Faster in Steel Than Air
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Three horizontal tracks fill the screen stacked vertically, each 600px wide and 80px tall:
  Top track: pale gray — "AIR" labeled left in white
  Middle track: deep teal — "WATER" labeled left in white
  Bottom track: dark orange-metallic — "STEEL" labeled left in white
A vertical white finish line stands at the right edge of all three tracks. At the far left of each track: a glowing pulse dot. All three dots glow and then —

## Main Visual Sequence (0:03–0:50)
**0:03** — All three pulses launch simultaneously from the left edge. Each is a bright glowing dot with a trailing wave ring (expanding circular ripple behind it, 3–4 rings).

The pulses move at proportional speeds:
  AIR pulse: slowest — pale blue dot, speed = 343 m/s (reference: 1 unit)
  WATER pulse: faster — cyan dot, speed = 1480 m/s (4.3× faster)
  STEEL pulse: fastest — orange dot, speed = 5100 m/s (14.9× faster)

**0:06** — STEEL pulse hits the finish line first with a bright orange flash and spark burst. The steel track vibrates briefly (shimmer effect on the bar). Label appears beside it: "Steel: 5,100 m/s."

**0:10** — WATER pulse arrives second. Cyan ripple flash at the finish line. Label: "Water: 1,480 m/s." The air pulse is still only 30% across the track.

**0:16** — AIR pulse finally arrives. Gray-blue ripple flash. Label: "Air: 343 m/s." A "FINISH" flag with each arrival time appears below each track:
  Steel: 0.20 s | Water: 0.88 s | Air: 3.06 s (times scaled for a 1000 m hypothetical distance).

**0:22** — Pause. A speed comparison bar chart appears (horizontal bars):
  Air: 343 m/s (short blue bar)
  Water: 1,480 m/s (medium cyan bar, 4.3× label)
  Steel: 5,100 m/s (long orange bar, 14.9× label)
A "14.9×" label with a bright flash highlights the ratio between air and steel.

**0:28** — Microscopic explanation: three inset squares (one per medium) appear showing particle spacing:
  Air: widely spaced gray circles (gas molecules)
  Water: medium-spaced cyan circles (liquid molecules)
  Steel: tightly packed orange circles in a lattice (solid atoms)
Label: "Closer atoms → faster vibration transmission."

**0:34** — The physics formula appears: "v = √(B/ρ)" for fluids, "v = √(E/ρ)" for solids. Gold text. Below: "Higher stiffness (B or E) → faster sound. Higher density (ρ) → slower sound."

**0:40** — Real-world examples annotated over each medium:
  Air: "Thunder delay — 3 s/km"
  Water: "Dolphins communicate 4.3× farther per second"
  Steel: "You hear a train through rails before you hear it through air"

**0:44** — All three pulses race again in a 2× speed replay. Steel wins by a landslide — the air pulse is still at 20% when steel has lapped the screen.

**0:47** — Freeze. Bold white text: "Solid > Liquid > Gas. Atoms closer = sound faster."

## Physics Concept Teased
Sound is a pressure wave that travels by vibrating adjacent particles. In a solid like steel, atoms are tightly packed and strongly bonded, so the vibration passes almost instantly from atom to atom. In air, widely spaced molecules must travel far before colliding, making sound propagation much slower. Speed depends on the medium's stiffness (bulk or Young's modulus) divided by its density: v = √(modulus / ρ).

## On-Screen Text / Captions
- **0:00** — "AIR" (white, left of top track), "WATER" (white, left of middle), "STEEL" (white, left of bottom)
- **0:06** — "Steel: 5,100 m/s" (orange, right of steel track)
- **0:10** — "Water: 1,480 m/s" (cyan, right of water track)
- **0:16** — "Air: 343 m/s" (pale blue, right of air track)
- **0:16** — Finish times: "Steel: 0.20 s | Water: 0.88 s | Air: 3.06 s" (white below tracks)
- **0:22** — "4.3×" (cyan), "14.9×" (orange flash) — on bar chart
- **0:28** — "Closer atoms → faster vibration transmission." (white italic, beside inset)
- **0:34** — "v = √(B/ρ)" (gold, fluids), "v = √(E/ρ)" (gold, solids)
- **0:34** — "Higher stiffness → faster sound | Higher density → slower sound" (white)
- **0:47** — "Solid > Liquid > Gas. Atoms closer = sound faster." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — the universe runs on waves."

## Audio
Music: Deep resonant bass note on steel arrival; a mid-tone on water arrival; a treble whoosh on air arrival — three distinct audio cues timed to each pulse crossing the finish line. Background music: tense ambient, 80 BPM. No voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: normalize pulse speeds to fit within the animation window — define air speed as 1 reference unit and scale water and steel accordingly (water = 4.32×, steel = 14.87×). Pulse travels at (speed_ratio × pixels_per_second). Trailing rings: draw 3 concentric circles behind the pulse dot with increasing radius and decreasing opacity each frame. Runtime: real-time. Gotcha: because steel is ~15× faster than air, it exits the screen while air has barely moved; loop the steel pulse back to start as "next soundwave" to keep the animation interesting during the air pulse's long journey.
