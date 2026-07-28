---
title: "Solar Cell: From Photon to Electron"
id: SB181
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, condensed-matter, solar-cell, photovoltaics]
---

> **What it is:** A ~45-second simulation short where a yellow photon crashes into a silicon p-n junction cross-section, knocks a blue electron across the bandgap diagram, and drives it through an external circuit to light a bulb — revealing the photovoltaic effect. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Solar Cell: From Photon to Electron

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black screen. A single yellow zigzag photon icon slams into a grey silicon crystal lattice at full speed — sparks fly, the lattice glows white on impact. Cut to: a blue electron dot rockets upward through the band structure diagram.

## Main Visual Sequence (0:03–0:50)
**0:03** — Side-view cross-section of a silicon solar cell appears. Top half labeled "N-type" (light blue tint), bottom half "P-type" (light orange tint). A thin yellow depletion zone line separates them. Electric field arrows (white, pointing upward from P to N) fill the junction.

**0:08** — A stream of six yellow zigzag photons rains down from the top of the frame. Five bounce off the surface (white flash, ricochet arrows). One penetrates into the silicon bulk.

**0:13** — Zoom in on the band structure panel (right side of screen). Valence band shown as a filled green bar; conduction band as an empty blue bar; 1.1 eV bandgap label in white. The incoming photon (yellow, labeled "hν = 1.5 eV") strikes and the green bar flashes — a blue electron dot pops upward across the gap. An orange hole (open circle) stays in the valence band.

**0:20** — Back to cross-section. Blue electron dot drifts left (upward in device) driven by the built-in electric field arrows. Orange hole drifts right (downward). They separate cleanly — no recombination spark.

**0:28** — The electron exits the N-type contact (silver wire, left side). It flows through an external circuit: a glowing light bulb (warm yellow) and a red current meter needle that swings from 0 to 0.6 A. Label: "0.6 A".

**0:35** — The electron re-enters the P-type contact (right side, silver wire). It fills the orange hole — a small white flash. The cycle resets: new photon arrives.

**0:42** — Pull back to show a full solar panel (6×10 cell grid, each cell glowing faintly blue). Current meter now reads "30 W". Label appears: "Photovoltaic Effect".

## Physics Concept Teased
When a photon with energy greater than the semiconductor bandgap (1.1 eV for silicon) is absorbed, it promotes an electron from the valence band to the conduction band; the built-in electric field of the p-n junction sweeps the electron and hole apart, generating a photocurrent.

## On-Screen Text / Captions
- **0:00** — "One photon. One electron. That's all it takes."
- **0:03** — "Silicon P-N Junction"
- **0:08** — "Most photons bounce or pass through"
- **0:13** — "Bandgap = 1.1 eV"
- **0:13** — "hν = 1.5 eV — enough to promote the electron!"
- **0:20** — "Built-in electric field separates charges"
- **0:28** — "Electron flows through external circuit → current"
- **0:35** — "Hole filled → cycle repeats"
- **0:42** — "Photovoltaic Effect"
- **0:44** — "Every solar panel is just this — billions of times per second"

## End Card
**0:47–0:50** — White background. Solar panel icon (black outline) with sun rays. Bold text: "SOLAR CELLS — Physics Series". Smaller: "@CodedLaws". Subscribe button pulse animation.

## Audio
- **Music:** Warm, optimistic lo-fi electronic — soft synth pad, 90 BPM, no lyrics.
- **Voiceover:** "A single photon excites one electron — and that tiny event, happening billions of times per second, powers your home." (spoken 0:08–0:22, calm male voice).
- **SFX:** High-pitched "ping" on photon impact (0:08); soft electrical hum rising as current flows (0:28–0:42).

## Production Notes
- **Renderer:** Python + Matplotlib animation or Manim; band structure inset rendered separately and composited.
- **Code complexity:** Medium. Two panels (cross-section + band diagram) synchronized via shared time axis. Electron/hole as animated scatter points with drift velocity proportional to field strength.
- **Key visual trick:** Depletion zone glow pulses brighter each time a photon is absorbed, giving visible feedback on photon counting.
- **Runtime:** 50 frames at 24 fps for main sequence; total ~50 s with 3 s hold on end card.
- **Gotchas:** Band structure gap must be drawn to scale (1.1 eV gap vs 1.5 eV photon arrow height). Avoid showing electron and hole recombining inside the junction — that would imply no current.
