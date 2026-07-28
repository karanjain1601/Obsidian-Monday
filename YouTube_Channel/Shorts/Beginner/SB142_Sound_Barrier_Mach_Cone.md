---
title: "Breaking the Sound Barrier: The Mach Cone"
id: SB142
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, waves, sound, mach-number, shock-wave]
---

> **What it is:** A ~45-second simulation short where a jet accelerates from subsonic to Mach 1.5 as expanding cyan sound rings compress and stack into a blazing V-shaped shockwave — revealing how supersonic flight forms a Mach cone whose half-angle shrinks as arcsin(1/M) with increasing speed. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Breaking the Sound Barrier: The Mach Cone
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A sleek white jet silhouette moves left-to-right across a dark blue sky. At the exact moment it reaches Mach 1, a brilliant white conical shock wave erupts outward from its nose — a razor-sharp V-shape that dwarfs the aircraft. A vapor condensation cloud (white puff) appears at the cone's apex simultaneously.

## Main Visual Sequence (0:03–0:50)
**0:03** — The scene resets. Jet at left edge, moving slowly (Mach 0.3). Circular sound waves (cyan rings, expanding at 343 m/s) radiate equally in all directions from the jet. Label top-left: "Mach 0.3 — subsonic."

**0:10** — Jet speed increases to Mach 0.8. Sound rings in front of the jet are visibly compressed (narrower spacing, brighter cyan). Rings behind are stretched (wider, dimmer). Doppler effect annotation: "Compressed ahead = higher pitch."

**0:18** — Jet reaches Mach 1.0. All forward sound waves pile up on the aircraft nose — rings merge into a single flat wavefront. Label flashes: "MACH 1 — Sound Barrier!" Brief shockwave pulse icon.

**0:27** — Jet accelerates to Mach 1.5. Conical Mach cone forms clearly. Angle annotation: θ = arcsin(1/M) = 41.8°. The cone is solid red-orange with a slight glow. Text inside cone: "Sonic Boom Zone."

**0:35** — Slider appears at bottom: Mach number sweeps 1.0 → 3.0. Cone angle narrows accordingly from 90° to 19.5°. The jet icon stays fixed and the cone morphs in real time.

**0:43** — Final frame: Mach 2 cone with fighter jet. Labels: "M=2, θ=30°." Equation displayed: "sin θ = 1/M." CodedLaws logo fades in bottom-right.

## Physics Concept Teased
When an object travels faster than sound, the spherical sound waves it emits cannot outrun it and stack into a conical shockwave called a Mach cone. The half-angle of the cone equals arcsin(1/M), shrinking as speed increases.

## On-Screen Text / Captions
- 0:03 → "Mach 0.3 — subsonic"
- 0:10 → "Sound compresses ahead"
- 0:18 → "MACH 1 — Sound Barrier!"
- 0:27 → "θ = arcsin(1/M) = 41.8°"
- 0:35 → "Faster → narrower cone"
- 0:43 → "sin θ = 1/M"

## End Card
Final 3 seconds: Mach cone graphic frozen with M=2.0 label. White text: "Tap to see more physics in action." CodedLaws wordmark bottom-center.

## Audio
High-energy cinematic build, 120 BPM. No voiceover. Key sound effects: jet engine rumble growing louder, then a thunderous BOOM at the Mach 1 moment (0:18), followed by a long rumbling decay. Whoosh sounds as the cone morphs.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: draw expanding circles from historical jet positions each frame; at Mach >1 the envelope of these circles forms the Mach cone — use this parametric method rather than drawing a triangle. Runtime: real-time. Gotcha: at exactly Mach 1 the forward wavefronts overlap perfectly at the jet position — handle the degenerate case by showing a flat disk rather than a cone.
