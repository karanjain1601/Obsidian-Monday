---
title: "Fusion: Stars' Energy Secret"
id: SB122
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, nuclear-physics, fusion, plasma]
---

> **What it is:** A ~45-second simulation short where deuterium and tritium dots collide inside a glowing tokamak cross-section, fuse into a helium nucleus and a fast neutron, then a bar chart reveals fusion releases 11 million times more energy than burning coal — the same reaction powering every star. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Fusion: Stars' Energy Secret
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black screen showing a red-and-blue yin-yang–like pair of glowing dots. They orbit each other rapidly, getting closer each revolution. At 2.5 s they collide — blinding white flash fills the frame. Freeze for 0.5 s on afterglow.

## Main Visual Sequence (0:03–0:50)
**0:03** — Camera pulls back to reveal the interior of a tokamak cross-section (D-shaped grey chamber outline, thin white lines, on black). Temperature readout appears top-right: **"150,000,000 °C"** in crimson monospace. Inside the chamber, ~20 deuterium nuclei (solid blue dots, radius 10 px, labeled "D") and ~20 tritium nuclei (solid red dots, radius 10 px, labeled "T") bounce chaotically, trailing faint colored tails.

**0:10** — Two specific particles — one blue D, one red T — are highlighted with pulsing white halos. Arrows curve them toward each other. Their velocity vectors (white arrows) point inward.

**0:16** — The two highlighted particles close the gap. A bright yellow "+" symbol flashes between them as they overcome the Coulomb barrier. Text overlay: **"Coulomb barrier overcome at 150 million °C"**. Particles merge into a single white flash.

**0:22** — Flash resolves into two product particles: a green dot (helium-4 nucleus, radius 14 px, labeled "⁴He") shooting right, and a pale-white dot (neutron, radius 5 px, labeled "n") shooting left at much higher speed. Energy release annotation appears: **"17.6 MeV released"** in bright yellow.

**0:28** — Panel splits (left: reaction just shown, right: energy comparison bar chart). Left bar: **"Burning 1 kg coal → 8 kWh"** (grey bar, short). Right bar: **"Fusing 1 kg D+T → 90,000,000 kWh"** (gold bar, massively taller, extends off screen). Text: **"11 million× more energy"**.

**0:35** — Simulation resumes fullscreen: all ~20 D and T pairs begin fusing in sequence, each releasing green He + white neutron. The chamber fills with expanding green and white dots. Background transitions from black to deep magenta plasma glow.

**0:40** — Zoom out to reveal a star schematic (yellow circle on black). Text: **"Stars do this 10³⁸ times per second."** A white radiance pulse emanates from the star.

**0:44** — Final scene: ITER tokamak silhouette (grey isometric sketch) with the label **"ITER: 2039 target"** and a blue progress bar at 60%.

## Physics Concept Teased
Nuclear fusion combines light nuclei (deuterium + tritium) at extreme temperatures to form helium, releasing 17.6 MeV per reaction — the process powering every star and the target of Earth's fusion energy programs.

## On-Screen Text / Captions
- **0:03** — "Inside a tokamak…" (top-left, white italic)
- **0:10** — "Deuterium (D) + Tritium (T)" (bottom-center, white)
- **0:16** — "Coulomb barrier overcome at 150,000,000 °C" (center-screen, yellow)
- **0:22** — "→ Helium-4 + Neutron + 17.6 MeV" (center, bright green/white)
- **0:28** — "Fusion gives 11 million× more energy than coal" (banner top, bold white)
- **0:40** — "Stars do this 10³⁸ times per second" (center, white)
- **0:44** — "ITER tokamak — first net-energy fusion by 2039?" (bottom, white small)

## End Card
Final 3 seconds: Deep magenta background with the green helium dot slowly expanding. White text center: **"Follow CodedLaws for more nuclear physics."** Logo pulse bottom-right.

## Audio
Music: Ambient sci-fi synth pad (slow, warm) from 0:00–0:15; builds with rising arpeggiated synth from 0:16 (the fusion flash) through 0:40; resolves to a sustained chord at 0:44. Voiceover (single sentence at 0:22, calm male voice): "Seventeen-point-six mega-electron-volts released in one reaction." Sound effects: soft electric hum during tokamak scene, sharp resonant "ping" at fusion flash, low bass thud when neutron exits.

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D with glow via ctx.shadowBlur = 20. Key visual trick: for the chaotic plasma phase, update each particle with Verlet integration bouncing off chamber walls (D-shaped boundary approximated as a clipped ellipse). Highlight the fusion pair by drawing a second pass with shadowColor = white and shadowBlur = 40. Bar chart is static SVG injected into the canvas overlay div. Color-code all He products green from spawn. Runtime: ~48 seconds. Gotcha: D-shaped boundary check — use a parametric ellipse clip (rx=240, ry=300, center offset upward) and reflect velocity on boundary hit; don't use a rectangle or particles escape corners.
