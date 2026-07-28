---
title: "Soap Bubbles: Nature's Interference Show"
id: SB119
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, interference, thin-film]
---

> **What it is:** A ~45-second simulation short where a thin vertical soap film shimmers with drifting horizontal rainbow bands — violet at the thin top, red toward the thicker bottom — while an inset diagram shows two reflected light rays interfering based on path difference 2t, revealing how film thickness alone determines which colors survive. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Soap Bubbles: Nature's Interference Show
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A soap film fills the center of the screen — a thin vertical rectangle (300px wide, 500px tall) of shimmering, iridescent color. Bands of violet, blue, green, yellow, orange, red sweep horizontally across the film from top to bottom, each band 30–60px tall. The film has a gentle watery shimmer animation — the bands slowly drift downward. Black background around it. The colors are rich, saturated, and immediately beautiful. No text.

## Main Visual Sequence (0:03–0:50)
**0:03** — A small arrow points to the top of the film where it is extremely thin (nearly black). Label: "Near-zero thickness → destructive interference (black)." A second arrow points to the first colored band below: "λ/4 thickness → first color appears." The viewer understands top = thin, bottom = thick.

**0:08** — An inset path-difference diagram appears in the bottom-right (180×160px). It shows:
  An incoming white light ray hitting the film at normal incidence.
  Ray 1 (reflected from top surface of film) drawn in red.
  Ray 2 (reflected from bottom surface, traveling through film thickness t) drawn in blue.
  Path difference = 2t (the extra distance Ray 2 travels).
  Label: "Path difference = 2t."

**0:14** — The formula "2t = mλ → constructive" appears in gold at the top-center. Below: "2t = (m + ½)λ → destructive." m = order number label (m = 0, 1, 2…) appears beside each colored band.

**0:20** — The film thickness label appears on the left edge, a vertical gradient bar: "t = 0 nm (top) → 800 nm (bottom)." Arrows mark key thickness values:
  t = 100 nm → violet band (λ ≈ 400 nm, 2t = 200 nm → m=0 constructive for violet)
  t = 250 nm → green band (λ ≈ 500 nm, 2t = 500 nm → constructive)
  t = 350 nm → red band (λ ≈ 700 nm, 2t = 700 nm → constructive)

**0:26** — Live animation: the film's thickness gradient is slowly increased (the bottom thickens). The color bands shift upward as new colors emerge at the bottom and the top cycles back to black. The drift is steady, mesmerizing.

**0:32** — A white-light breakdown bar appears beside the film: a horizontal rainbow stripe (violet → red) labeled "White light: 400–700 nm." Arrows connect each wavelength to the film band where it constructively interferes.

**0:36** — Real soap bubble close-up rendering: a hemispherical bubble (300px radius) with the same iridescent color pattern mapped onto its curved surface. As the bubble slowly rotates (5° per second), the color bands shift. Label: "Soap bubble = spherical thin film."

**0:42** — The bubble "pops" — a bright white flash, then the bubble vanishes instantly. The sound of a pop. Black screen for half a second — then the flat soap film reappears.

**0:44** — Clean summary diagram: flat soap film cross-section showing "Incoming light → split at surfaces → path difference → interference." Color result indicated beside each thickness zone.

**0:47** — Freeze on the shimmering film. Bold white text: "Thin films turn light into color with no dye — just physics."

## Physics Concept Teased
Thin film interference occurs when light reflects from both the top and bottom surfaces of a thin transparent film (like a soap bubble). The two reflected rays have a path difference of 2t (twice the film thickness). When this path difference equals a whole number of wavelengths (2t = mλ), constructive interference brightens that color; when it equals a half-integer multiple, destructive interference eliminates it. Different film thicknesses constructively interfere with different visible wavelengths, producing the vivid rainbow pattern.

## On-Screen Text / Captions
- **0:03** — "Near-zero thickness → destructive (black)" (white, top of film), "λ/4 → first color" (white, first band)
- **0:08** — "Path difference = 2t" (white, inset diagram)
- **0:14** — "2t = mλ → constructive" (gold, top-center), "2t = (m+½)λ → destructive" (white, below)
- **0:20** — "t = 0 nm (top) → 800 nm (bottom)" (white gradient bar label)
- **0:20** — Band labels: "t=100nm → violet", "t=250nm → green", "t=350nm → red" (white arrows)
- **0:32** — "White light: 400–700 nm" (white, rainbow bar label)
- **0:36** — "Soap bubble = spherical thin film." (white italic, beside bubble)
- **0:42** — (Pop sound, no text — visual only)
- **0:47** — "Thin films turn light into color with no dye — just physics." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — colors hide everywhere in physics."

## Audio
Music: Ambient, glassy, shimmering electronic tones — like a glass harp — 65 BPM. Very gentle. Sound effects: a soft liquid shimmer when the color bands drift; a crisp bubble-pop at 0:42. No voiceover.

## Production Notes
Code complexity: moderate to complex. Renderer: Canvas 2D (or WebGL for the rotating bubble). Key visual trick: for the flat film, compute each pixel's color based on its Y-position (which maps to film thickness t). For each visible wavelength λ (380–700 nm in steps of 5 nm), compute intensity I = cos²(π·2t/λ). Sum weighted RGB contributions for all wavelengths to get the pixel color at each thickness. Normalize. This produces physically accurate iridescent banding. Runtime: pre-render the flat film color buffer once on load, then animate by scrolling the buffer. Gotcha: the phase shift on reflection from a denser medium (air-to-film boundary, n_film > n_air) adds a λ/2 extra path difference, shifting the interference conditions — account for this or the colors will be wrong (top of film will be bright instead of dark).
