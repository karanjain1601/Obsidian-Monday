---
title: "Holography: Recording Light Itself"
id: SB184
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, holography, interference]
---

> **What it is:** A ~45-second simulation short where a laser beam splits into a reference path and an object-scattered path, creating microscopic interference fringes on a photographic plate that reconstruct a floating, parallax-correct 3D apple when illuminated again — revealing how a hologram records the complete light wavefront. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Holography: Recording Light Itself

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A flat grey photographic plate sits on a table. Light hits it — and instead of a flat image, a full 3D red apple floats above the plate in mid-air, rotating 15 degrees as the viewing angle shifts. The plate looks blank when viewed straight-on.

## Main Visual Sequence (0:03–0:50)
**0:03** — Top-down schematic of a holographic recording setup. A red laser (λ = 633 nm, HeNe) at top-left fires a beam (thin red line). A beam splitter (half-silvered grey square) divides it into two paths, labeled in white.

**0:08** — Path 1: "Reference Beam" — red line travels straight to the photographic plate (silver-grey rectangle, bottom-right). Circular wavefronts (concentric red arcs, spaced 633 nm apart) label the beam as a plane wave.

**0:10** — Path 2: "Object Beam" — red line reflects off a small 3D apple object (red, shiny, centered on screen). Scattered wavefronts (irregular curved red arcs, encoding the apple's 3D shape) travel toward the same photographic plate.

**0:16** — At the plate, the two wavefronts overlap. The interference pattern renders as a dense grid of alternating dark and light fringes — microscopic spacing (~1 µm). Label: "Interference Fringes Recorded in Emulsion". Zoom-in inset (lower-right) shows the fringe pattern at 500× magnification.

**0:24** — Scene cuts to: "RECONSTRUCTION" title card (white text, black background, 1 s hold).

**0:25** — Same plate, now illuminated only by the reference beam (red line hitting plate from same angle). The plate acts as a diffraction grating — a 3D reconstruction of the apple materializes in mid-air (right of plate, semi-transparent red). Viewing arrows show parallax: shift camera left → apple shows left side; shift camera right → apple shows right side.

**0:35** — Side-by-side comparison: Left panel = photograph of apple (flat, 2D, no parallax). Right panel = hologram (3D, parallax visible, depth cues change with angle). Depth difference annotated: photo shows 0 depth cues; hologram shows 12 cm of depth information.

**0:43** — Final: the hologram glows and the apple rotates 30 degrees autonomously. Label: "Light itself was the recording medium."

## Physics Concept Teased
A hologram records not just the intensity of light (like a photograph) but the complete wavefront — amplitude and phase — by capturing the interference pattern between a reference beam and object-scattered light; illuminating the hologram with the reference beam reconstructs the original 3D wavefront.

## On-Screen Text / Captions
- **0:00** — "A photo records brightness. A hologram records the light wave itself."
- **0:03** — "HeNe Laser: λ = 633 nm"
- **0:08** — "Reference Beam: perfect plane wave"
- **0:10** — "Object Beam: scattered by 3D apple → carries shape info"
- **0:16** — "Interference fringes: ~1 µm spacing"
- **0:24** — "RECONSTRUCTION"
- **0:25** — "Same reference beam → 3D image reconstructed"
- **0:35** — "Photo = 2D | Hologram = 3D + parallax"
- **0:43** — "Light itself was the recording medium"

## End Card
**0:47–0:50** — Black background. Semi-transparent 3D apple rotates. Bold text: "HOLOGRAPHY — Physics Series". "@CodedLaws". Subscribe button pulses with a rainbow iridescent shimmer.

## Audio
- **Music:** Mysterious, ethereal ambient — slow pad chords, glass-like high notes, 60 BPM. Feels like light bending through space.
- **Voiceover:** "By recording the interference between two laser beams, we capture not just an image — but a complete 3D light field." (0:08–0:24, soft, slightly awed female voice).
- **SFX:** Gentle laser "hum" throughout recording phase; crystalline "chime" at moment of reconstruction (0:25); gentle whoosh as the 3D apple materializes.

## Production Notes
- **Renderer:** Python + Matplotlib for wavefront diagrams; Blender for the 3D apple reconstruction sequence (cycles renderer, subsurface scattering on apple material).
- **Code complexity:** High. Interference fringe pattern must be computed as the superposition of two wave fields on the plate plane — use numpy meshgrid, evaluate cos(k·r) for each beam, subtract and threshold to simulate developed emulsion.
- **Key visual trick:** In the reconstruction segment, render the apple with a ghostly transparency (alpha 0.6) and slight chromatic aberration to signal it is a light-field reconstruction, not a solid object.
- **Runtime:** 50 s total. The 500× zoom inset at 0:16 needs at least 5 s for viewers to register the fringe structure.
- **Gotchas:** Interference fringes at 633 nm spacing are far too fine to see at full scale — the zoom inset is mandatory. Also show the optical path length from laser to plate being equal for both beams (coherence length requirement).
