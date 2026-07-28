---
title: "Diffraction: Waves Bend Around Corners"
id: SB120
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, waves, diffraction, interference]
---

> **What it is:** A ~45-second simulation short where straight wavefronts hit a gap in a barrier and fan out as cyan semicircular arcs on the other side — with the spreading angle visibly ballooning as the gap narrows from 4λ to 0.5λ — revealing why waves bend around corners when the gap approaches the wavelength. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Diffraction: Waves Bend Around Corners
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Top-down view. A set of perfectly straight horizontal blue wavefronts (5 lines, spaced 30px apart) moves rightward across the left half of the screen. In the center: a solid gray barrier (20px thick, full canvas height) with a single rectangular gap (80px wide) at its midpoint. To the right of the barrier: pure black — no waves yet. The moment of truth: what happens when all those straight lines hit the gap?

## Main Visual Sequence (0:03–0:50)
**0:03** — The first wavefront reaches the gap and passes through. On the right side of the barrier, instead of continuing straight, the wave expands outward as a semicircular wavelet — the diffraction pattern fans out in a 180° arc. The arc is bright cyan against the black background. Label: "Gap width = 80px = 2λ. Waves spread."

**0:08** — More wavefronts pass through the gap. A growing pattern of concentric cyan semicircles fills the right half of the screen. The pattern is smooth and clear. The center of the pattern (directly behind the gap) is the brightest region. Label: "Maximum intensity: straight ahead (0°)."

**0:14** — Pause motion. The full diffraction pattern is frozen. Faint curved lines show the interference pattern: bright bands (constructive interference) and dark lines (destructive interference) radiate outward. Labels: "Bright bands" (gold arrows), "Dark bands" (gray arrows). The first dark minimum is marked.

**0:20** — The gap width changes: it WIDENS to 160px (4λ). The wavefronts pass through. Now the diffraction pattern is narrower — the waves spread less, more of the light goes straight forward. Label: "Wider gap → less spreading." A central bright beam dominates.

**0:26** — The gap NARROWS to 20px (0.5λ). The wavefronts pass through this tiny slit. Now the diffraction pattern spreads almost 270° — the wave bends dramatically around the barrier edges. Label: "Gap ≈ λ → maximum spreading → waves bend around corners."

**0:30** — Three-panel comparison appears stacked:
  Top: gap = 4λ (160px) — tight central beam, little spreading
  Middle: gap = 2λ (80px) — moderate spread
  Bottom: gap = 0.5λ (20px) — near-full hemisphere spread
  Label: "Gap / λ ratio determines spreading angle."

**0:34** — The formula "sin θ = mλ/a" appears in gold at the top-center (single-slit diffraction minima). Label: "θ = angle to first minimum, a = gap width, λ = wavelength."

**0:38** — Real-world examples: 
  Sound: "Doorway ≈ 1 m wide | λ_sound ≈ 0.3 m → significant diffraction. You hear sound from other rooms even around corners."
  Light: "Gap = 0.01 mm | λ_light = 500 nm → barely diffracts through doorways. That's why light casts sharp shadows."

**0:42** — Water wave tank simulation: overhead view of a ripple tank. Two barriers with a single gap. Circular wavelet pattern on the right clearly visible. The outgoing wavefront pattern matches the simulation exactly. Label: "Real ripple tank looks just like this."

**0:44** — Animation replay: gap starts wide (4λ), narrows smoothly to 0.5λ. The diffraction pattern dramatically fans out in real time as the gap closes. This is the full demonstration — visually beautiful.

**0:47** — Freeze at gap = 0.5λ with maximum spreading. Bold white text: "Smaller gap = more bending. When gap ≈ wavelength, waves go everywhere."

## Physics Concept Teased
Diffraction is the bending and spreading of waves when they pass through a gap or around an obstacle. The degree of spreading is determined by the ratio of gap width to wavelength: when the gap is much larger than λ, the wave passes through with little bending; when the gap approaches the wavelength, the wave spreads almost into a full hemisphere. Single-slit diffraction minima occur at angles given by sin θ = mλ/a.

## On-Screen Text / Captions
- **0:03** — "Gap width = 80px = 2λ. Waves spread." (white, beside gap label)
- **0:08** — "Maximum intensity: straight ahead (0°)." (white, top-right)
- **0:14** — "Bright bands" (gold arrows), "Dark bands" (gray arrows)
- **0:20** — "Wider gap → less spreading." (white italic, below wide-gap pattern)
- **0:26** — "Gap ≈ λ → maximum spreading." (white bold, below narrow-gap pattern)
- **0:26** — "Waves bend around corners." (white italic, below)
- **0:30** — "Gap/λ ratio determines spreading." (white, beside comparison)
- **0:34** — "sin θ = mλ/a" (gold, top-center)
- **0:38** — "Sound diffracts around doorways. Light does not — wavelength too short." (white, real-world panel)
- **0:47** — "Smaller gap = more bending. Gap ≈ λ → waves go everywhere." (bold white)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — waves are stranger than they look."

## Audio
Music: Deep, oceanic ambient electronic, 70 BPM, with a slow wave-like rhythm. Sound effects: a gentle water ripple sound each time a new wavefront passes through the gap; a whoosh/spread sound when the diffraction pattern fans out dramatically during the narrow-gap demonstration. No voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D (or WebGL for GPU-accelerated wave field). Key visual trick: use Huygens' principle — treat every point on the gap as a secondary wave source emitting circular wavelets. For N source points across the gap, compute the superposed wave amplitude at each pixel of the right-hand field as the sum of N cosine contributions (each with its own distance-based phase). Normalize and map amplitude to brightness. Gap width changes: re-initialize the N source positions across the new gap width and re-render. Runtime: pre-render to an offscreen buffer when gap width changes; display the buffer for the main animation. Gotcha: with too few Huygens sources (< 20), the interference pattern will have artifacts. Use at least 50 point sources across the gap for a clean diffraction pattern.
