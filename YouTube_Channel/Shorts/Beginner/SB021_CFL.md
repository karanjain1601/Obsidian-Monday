---
title: "CFL Violation In One Frame"
id: SB021
type: youtube-short
duration: "~45 seconds"
feeds_video: "I Made Ripples on a Virtual Drum"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a 3D virtual drum membrane glows with perfect ripples until a wave speed slider crosses one threshold and the entire surface explodes into an alternating red-blue checkerboard in a single frame, revealing the Courant-Friedrichs-Lewy stability limit of numerical wave simulations. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** I Made Ripples on a Virtual Drum

# Short: CFL Violation In One Frame

**Feeds full video:** I Made Ripples on a Virtual Drum
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A 3D membrane stretched taut — a virtual drum. A central strike. Ripples radiate outward in perfect concentric circles, glowing and beautiful. Stable, physical, mesmerizing.

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** Stable drum vibration. "WAVE SPEED: 5 m/s | dt: 0.01s." Ripples expanding cleanly, reflecting off boundaries, interfering constructively and destructively. "STABLE."
**Beat 2 (0:10–0:18):** Wave speed climbs: 10 m/s — still stable. 15 m/s — still stable. "STILL STABLE."
**Beat 3 (0:18–0:24):** Wave speed hits CFL boundary: 20 m/s. "CFL CONDITION VIOLATED." One frame later — the entire membrane explodes into alternating hot/cold pixels: a perfect checkerboard of chaos. No gradual transition.
**Beat 4 (0:24–0:30):** Freeze on the checkerboard. "IN ONE FRAME." Before: beautiful ripples. After: maximum chaos. Not gradual — instant catastrophic failure.
**Beat 5 (0:30–0:38):** Wave speed reduced below CFL. Checkerboard disappears instantly. Ripples return, perfect. "CFL CONDITION MET: STABLE." Formula: "v × dt ≤ Δx."
**Beat 6 (0:38–0:45):** "One slider. One equation. Two completely different universes."

## Physics Concept Teased
What is the Courant-Friedrichs-Lewy condition, and why does exceeding it by any amount cause a wave simulation to explode into maximum chaos in a single computational step?

## On-Screen Text / Captions
- "WAVE SPEED: 5 → 10 → 15 → 20 m/s" (live slider)
- "dt: 0.01s" (HUD)
- "STABLE." (green, Beats 1–2)
- "CFL CONDITION VIOLATED." (red flash, Beat 3)
- "IN ONE FRAME." (Beat 4)
- "v × dt ≤ Δx" (formula, Beat 5)

## End Card
Full video: "I Made Ripples on a Virtual Drum" — link in bio. CFL condition fully explained.

## Audio
Resonant drum-like ambience during stable phases. Rising tone as speed increases. At CFL violation: horrible digital screech — like a machine breaking. Silence. When stability returns: clean resonant ambience.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. 3D drum membrane in isometric perspective. Stable ripples: smooth height field with iridescent color mapping. CFL violation: instant switch to red-blue checkerboard — visually jarring. Wave speed slider prominent on screen. Checkerboard should look genuinely alarming. Grid lines subtly visible on membrane surface.
