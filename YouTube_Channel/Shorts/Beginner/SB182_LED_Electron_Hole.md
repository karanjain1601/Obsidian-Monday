---
title: "LED: Light From Electricity"
id: SB182
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, condensed-matter, LED, semiconductors]
---

> **What it is:** A ~45-second simulation short where blue electron dots and orange hole circles race toward a forward-biased p-n junction, collide to emit colored photons, and three LED chips combine red, green, and blue light into white — demonstrating how bandgap energy determines emitted color. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: LED: Light From Electricity

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Pure black screen. A single bright yellow burst explodes from the center — a photon emitted from a tiny glowing junction. The burst ripples outward in concentric white rings. Cut hard to: a blue electron dot and an orange hole dot racing toward each other on a collision course.

## Main Visual Sequence (0:03–0:50)
**0:03** — Cross-section of an LED chip appears. Left half: N-type region (blue tint, labeled "N"). Right half: P-type region (orange tint, labeled "P"). Junction at center is a thin dark vertical line. Battery symbol at bottom: + terminal connects to P side, − terminal to N side.

**0:08** — Blue electron dots (5 of them) pour in from the N-side contact (left). Orange hole circles (5 of them) pour in from the P-side contact (right). Arrows show both species drifting toward the junction under forward bias (0.3 V label fades in, then steps up to 2.0 V — the electrons accelerate).

**0:15** — At the junction, one blue dot and one orange circle collide. White flash. A yellow photon zigzag shoots out perpendicular to the junction and flies upward off the top of the chip. The word "PHOTON" appears beside it with a wavelength label: "λ = 620 nm".

**0:20** — Band diagram inset (lower right). Conduction band (blue bar) on N side steps down; valence band (orange bar) on P side steps up under forward bias. The electron drops from conduction band to fill the hole in the valence band — energy difference ΔE = 2.0 eV emitted as red photon.

**0:28** — Split-screen comparison of three LED chips side by side:
  - Left: GaAs chip (Eg = 1.4 eV) — emits RED photon (630 nm wavelength bar shown)
  - Center: GaP chip (Eg = 2.26 eV) — emits GREEN photon (550 nm)
  - Right: GaN chip (Eg = 3.4 eV) — emits BLUE photon (460 nm)
  Each chip pulses with its respective color. Bandgap values labeled below each chip.

**0:38** — Zoom out to show all three chips assembled into an RGB LED pixel. The three colors combine (additive color mixing arrows) to produce a white spot in the center. Label: "RGB LED = White Light".

**0:44** — Final wide shot: grid of 1000 RGB pixels forming a full-color display. The display shows the CodedLaws logo.

## Physics Concept Teased
In a forward-biased LED, electrons and holes injected into the junction recombine and release their energy difference as photons; the semiconductor's bandgap determines the photon energy and therefore the emitted color.

## On-Screen Text / Captions
- **0:00** — "Electricity in. Light out. Here's how."
- **0:03** — "N-type | P-type — Forward Bias"
- **0:08** — "Electrons flow in from N side; Holes from P side"
- **0:15** — "Electron + Hole → PHOTON (λ = 620 nm)"
- **0:20** — "ΔE = Eg determines wavelength"
- **0:28** — "GaAs: 1.4 eV → RED"
- **0:28** — "GaP: 2.26 eV → GREEN"
- **0:28** — "GaN: 3.4 eV → BLUE"
- **0:38** — "R + G + B = White"
- **0:44** — "Your phone screen: 10 million LEDs doing this right now"

## End Card
**0:47–0:50** — Black background. Three glowing dots (red, green, blue) merge into a white circle. Bold text: "LED — Physics Series". "@CodedLaws" below. Pulse animation on subscribe button.

## Audio
- **Music:** Crisp, bright electronic pop — arpeggio synth, 110 BPM. Color changes in the split-screen timed to musical notes.
- **Voiceover:** "Every time an electron fills a hole, a photon is born — and the bandgap decides what color you see." (0:15–0:30, clear female voice).
- **SFX:** Soft "bloop" on each electron-hole recombination event; rising three-note chime when RGB merge to white.

## Production Notes
- **Renderer:** Manim or Three.js. Electron/hole as colored circles with velocity vectors; photon as zigzag SVG path animating upward.
- **Code complexity:** Medium-low. Main challenge is synchronizing the band diagram inset with the spatial cross-section so recombination events appear simultaneously in both panels.
- **Key visual trick:** Each photon emitted gets a colored trail that fades matching its wavelength — reinforces wavelength-color link visually without extra text.
- **Runtime:** ~50 s total. Split-screen segment at 0:28 needs 10 s hold time so viewers can read all three bandgap values.
- **Gotchas:** Holes should move from right to left (toward junction) — many beginner animations mistakenly show holes moving in the wrong direction. Hole velocity should be lower than electron velocity (higher effective mass).
