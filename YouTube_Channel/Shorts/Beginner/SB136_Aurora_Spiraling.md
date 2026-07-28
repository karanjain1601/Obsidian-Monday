---
title: "Auroras: When Space Weather Paints the Sky"
id: SB136
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, aurora, magnetosphere]
---

> **What it is:** A ~45-second simulation short where a solar wind particle spirals down a converging field line to the polar atmosphere, collides with an oxygen atom at 120 km altitude, and releases a 557.7 nm green photon — the sequence plays in green, red, and purple for different atoms and altitudes, building into a shimmering curtain of aurora. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Auroras: When Space Weather Paints the Sky
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Dark night sky. Green and purple curtains of light ripple across the upper frame — aurora borealis at full intensity. Timestamp label: **"Northern Norway, 11 PM"**. Camera-style shutter click sound. Text overlays: **"Beautiful. But WHY?"** Freeze frame.

## Main Visual Sequence (0:03–0:50)
**0:03** — Zoom out from aurora to a space-scale view. Sun (yellow, left edge) emits a stream of tiny yellow dots (solar wind particles). Earth (blue/green, center-right, radius 30 px) with its magnetic field lines (white arcs, symmetric dipole). The particle stream hits the magnetosphere boundary (faint blue bow shock line).

**0:08** — One particle (glowing yellow dot, radius 5 px, white halo) is highlighted. It does not penetrate the equatorial region — instead, the field funnels it toward the magnetic pole. Its path curves (white curved arrow) following the converging field lines toward the polar region. Label: **"Field lines guide particles to poles."**

**0:13** — Zoom to the polar region (above North Pole view, Earth surface shown as blue/white cap). The single highlighted particle begins its helical descent: it spirals tightly around the downward field line. Helix animation: the particle traces a white corkscrew path (pitch angle ~15°, radius 10 px, 4 complete turns visible). Label: **"Gyroradius ≈ 1 km for protons at 1 MeV"** (small white text).

**0:18** — The particle hits an oxygen atom (red dot, radius 6 px, labeled "O") in the thermosphere at ~120 km altitude. Collision: bright white flash. The oxygen atom's electron is excited (small electron orbit rings expand outward from the O dot). Label: **"120 km altitude — thermosphere."** Altitude ruler on right: labeled 80 km, 100 km, 120 km, 150 km.

**0:23** — Excited oxygen relaxes — electron drops back to ground state. A photon (green wavy arrow, wavelength annotation: **"557.7 nm"**) emits from the atom. Text: **"Green aurora: oxygen at 120 km emits 557.7 nm light."** The single photon multiplies — hundreds of green photons emit from a column of excited atoms.

**0:28** — Second scenario: particle hits oxygen at higher altitude (~200–300 km). Red photon emits (wavy red arrow, **"630 nm"**). Text: **"Red aurora: oxygen at 200+ km emits 630 nm."** Third scenario: nitrogen molecule (blue dot, labeled "N₂") at low altitude emits purple/blue light (**"391 nm"**). Text: **"Purple/blue: nitrogen at 80 km."** Three color swatches shown side-by-side: green, red, purple with altitude labels.

**0:34** — Ground view from below: simulated aurora curtain (vertical green sinusoidal ripples on black sky, 400 px wide, animated shimmer) with purple wisps at the base. Stars visible in the gaps. Altitude scale on left: "80 km" at bottom of curtain, "300 km" at top. Text: **"Aurora extends 80–300 km above the surface."**

**0:39** — Oval map overlay: top-down view of North Pole. White oval ring (the auroral oval, ~65–75° latitude). Oval pulses brighter when a yellow CME wave hits Earth. Text: **"Auroral oval — active every night, visible worldwide during solar storms."**

**0:43** — Final text center: **"Aurora = solar particles + magnetic field + atmospheric atoms = nature's light show."** Below in small white: **"557.7 nm oxygen green. 630 nm oxygen red. 391 nm nitrogen blue."**

## Physics Concept Teased
Aurora forms when charged solar wind particles are guided by Earth's magnetic field to the polar regions, where they collide with atmospheric gases; the resulting atomic excitation releases photons at characteristic wavelengths — green (557.7 nm from oxygen at ~120 km), red (630 nm from oxygen at ~200 km), and blue-purple (391 nm from nitrogen).

## On-Screen Text / Captions
- **0:00** — "Beautiful. But WHY?" (bold white on aurora background)
- **0:08** — "Field lines guide particles to poles" (white arrow label)
- **0:13** — "Helical descent: spiraling toward atmosphere" (white, top)
- **0:18** — "120 km altitude — thermosphere — oxygen collision" (label)
- **0:23** — "Green: O at 120 km → 557.7 nm" (green text)
- **0:28** — "Red: O at 200+ km → 630 nm | Purple: N₂ → 391 nm" (color panel)
- **0:34** — "Aurora extends 80–300 km high" (altitude scale label)
- **0:39** — "Auroral oval — active every night near the poles" (map label)
- **0:43** — "Solar particles + magnetic field + atmosphere = aurora." (bold white)

## End Card
Final 3 seconds: Aurora ripple animation (green curtain on black sky) plays slowly. White text: **"Follow CodedLaws — the physics of beauty."** Logo pulse bottom-right.

## Audio
Music: Delicate, ethereal ambient piano and string pad from 0:00 (matched to aurora beauty); gentle build from 0:13 (helix animation); warm crescendo at 0:23 (photon emission); full resolution at 0:43. No voiceover. Sound effects: soft solar-wind hiss from 0:03; gentle "ping" chime at each photon emission (green, red, blue — three distinct notes in a rising triad); soft shimmer ambient during aurora curtain view (0:34).

## Production Notes
Code complexity: Medium-High. Renderer: Canvas 2D. Key visual trick: aurora curtain — draw 20 vertical sinusoidal columns, each with x = column_x + A*sin(ω*y + phase_i), color = rgba(0,255,120,0.3) for green with slight variation per column, phase_i updated each frame (+=0.02) to create shimmer. Stagger column heights using Perlin noise for organic-looking curtain boundary. Particle helix: same technique as SB134 — forward motion + sinusoidal transverse component rotated to align with field line direction. Photon emission: when particle reaches target altitude, spawn 5 expanding circles (radius 0→30, alpha 1→0 over 0.5 s) in the emission color. Auroral oval map: draw an ellipse offset from the North Pole on a flat-Earth disc projection centered on pole. Runtime: ~47 seconds. Gotcha: the auroral curtain must ripple — if it's static it looks fake; ensure phase_i differs enough between columns (spread 0 to 2π across 20 columns) so motion is clearly visible.
