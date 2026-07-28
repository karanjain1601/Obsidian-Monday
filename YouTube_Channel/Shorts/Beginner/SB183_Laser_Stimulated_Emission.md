---
title: "Laser: Stimulated Emission Chain Reaction"
id: SB183
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, laser, stimulated-emission]
---

> **What it is:** A ~45-second simulation short where a single photon triggers a doubling chain reaction (1→2→4→8→16→32) inside a mirror-bounded gain medium, building into a razor-thin coherent green beam — demonstrating stimulated emission amplification as the physics behind laser light. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Laser: Stimulated Emission Chain Reaction

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Pitch black. A single green photon (bright lime zigzag) zips across the screen left to right. It grazes a glowing green atom — and instantly two identical green photons shoot out together, perfectly parallel. The screen floods lime green.

## Main Visual Sequence (0:03–0:50)
**0:03** — A horizontal laser cavity appears: two grey rectangles (mirrors) at left and right ends. Between them: a rectangular gain medium (bright emerald green, labeled "Gain Medium"). Pump arrows (purple, vertical) rain down on the gain medium from above — labeled "Pump Energy (e.g., flash lamp)".

**0:08** — Excited atoms in the gain medium shown as glowing green dots. Three-level energy diagram (inset, lower left): ground state (grey bar), metastable state (green bar), pump level (purple bar). Atoms accumulate in metastable state — label: "Population Inversion Achieved".

**0:15** — A single spontaneously emitted photon (yellow-green zigzag) shoots horizontally through the medium. It encounters one excited atom — "STIMULATED EMISSION" label flashes. Two identical photons (same phase, same direction, lime green) now travel together.

**0:20** — The two photons each strike another excited atom. Four photons emerge. Four become eight. Chain reaction counter in top-right corner: 1 → 2 → 4 → 8 → 16 → 32. Gain medium glows brighter with each doubling.

**0:28** — The photon pulse hits the right mirror (fully reflective, silver). It bounces back perfectly. Left mirror is labeled "HR Mirror (100%)". Right mirror labeled "OC Mirror (95%)". 5% of light transmits through the right mirror — a thin green beam exits to the right.

**0:35** — The exiting beam (brilliant green, razor-thin, 1 mm wide) hits a white screen. The spot is a perfect circle, 2 mm diameter. Beam divergence angle shown: 0.5 mrad. Coherence annotation: "All photons: same phase, same direction, same wavelength (532 nm)".

**0:42** — Compare panel: flashlight (cone of white diffuse light, wide spread) vs laser (single thin green line, no spread). Label: "Coherence = Power Concentrated".

## Physics Concept Teased
In a laser, population inversion in the gain medium allows a single photon to trigger stimulated emission of an identical photon — same phase, frequency, and direction — creating an exponential chain reaction amplified by mirror feedback.

## On-Screen Text / Captions
- **0:00** — "One photon becomes two. Two become four. Here's the avalanche."
- **0:03** — "Laser Cavity: Gain Medium + Two Mirrors"
- **0:08** — "Pump creates Population Inversion"
- **0:15** — "STIMULATED EMISSION: photon clones itself"
- **0:20** — "Chain reaction: 1→2→4→8→16…"
- **0:28** — "HR Mirror = 100% | OC Mirror = 95% reflective"
- **0:35** — "Output: λ = 532 nm | Coherent | Collimated"
- **0:42** — "Laser ≠ bright flashlight — it's a quantum chain reaction"

## End Card
**0:47–0:50** — Black background. Thin green laser line slices across the screen. Bold text: "LASER — Physics Series". "@CodedLaws" in white. Subscribe button glows green.

## Audio
- **Music:** Tense, building electronic score — starts sparse at 0:03, adds layers with each photon doubling step, peaks at 0:28 when beam exits.
- **Voiceover:** "Each stimulated photon is a perfect clone — same wavelength, same phase, same direction. That's what makes laser light extraordinary." (0:15–0:35, low confident male voice).
- **SFX:** Rapid "tick-tick-tick" sound accelerating with each photon doubling; deep resonant hum as cavity builds; sharp "pshhh" when output beam exits mirror.

## Production Notes
- **Renderer:** Manim or custom Python + Pygame. Photons as animated zigzag paths; exponential counter uses easing function so it doesn't slow the animation.
- **Code complexity:** Medium. The chain reaction segment requires spawning child photon objects from parent collisions — use recursive particle system with depth limit of 5 generations.
- **Key visual trick:** Each generation of photons is plotted slightly brighter and thicker than the previous, so the cascade visually "fills" the gain medium with light.
- **Runtime:** Chain reaction segment (0:15–0:28) is the visual centerpiece — allow 13 s for the 5-generation doubling to read clearly.
- **Gotchas:** Show photons bouncing between mirrors multiple times (not just once) before output — the round-trip gain must visibly exceed the 5% output coupling loss or the physics narrative breaks.
