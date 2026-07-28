---
title: "Why We Always See the Same Side of the Moon"
id: SB133
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, tidal-locking, moon]
---

> **What it is:** A ~45-second simulation short where a Moon with a painted smiley face orbits Earth with its smile perpetually locked toward us, a tidal bulge oval stretches it toward Earth, and a fast-forward clock captures 100 million years of braking torque — revealing why the Moon's spin and orbital periods are permanently synchronized at 27.3 days. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Why We Always See the Same Side of the Moon
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Overhead view of Earth (blue/green circle, 50 px) with the Moon (grey circle, 20 px) orbiting it. The Moon is clearly labeled with a red dot on one face. As it orbits, the red dot ALWAYS faces Earth. Bold text: **"The Moon is tidally locked — but WHY?"**

## Main Visual Sequence (0:03–0:50)
**0:03** — Scene: deep space (black + stars). Earth (blue/green, radius 40 px, equatorial white line, continent outlines sketched in dark green) at canvas center. Moon (grey circle, radius 16 px) at 3 o'clock position. A bright yellow face painted on the Moon's left hemisphere (two dot-eyes, curved smile — always facing Earth). Orbital path: white dashed circle around Earth, radius 120 px.

**0:08** — Slow animation begins: Moon orbits Earth (period = 6 seconds of screen time). As it moves from 3 o'clock to 12 o'clock, the face continuously rotates to track Earth. Arrow labels: green **"Orbital period = T_orbit"**, blue **"Rotation period = T_spin"**. Both arrows pulse at the same frequency — synchronized.

**0:13** — Tidal bulge visualization activates. The Moon's grey circle deforms into a slight oval (stretch 5 px on Earth-facing axis, compress 2 px on perpendicular axis). Two pale blue lobes (radial gradient, cyan transparent) extend toward and away from Earth. Label: **"Tidal bulge — Earth's gravity stretches the Moon."**

**0:18** — Inset panel (top-right, 200×150 px, dark background): "Early Moon" scenario — Moon spinning faster than its orbit. The bulge is ahead of the sub-Earth point. A torque arrow (red, curved) pulls the bulge back toward alignment. Text: **"Misaligned bulge → gravitational torque → slows rotation."**

**0:24** — Timeline animation: fast-forward clock (white, spinning) appears. Moon's spin rate slows (shown as a reducing rotation indicator — dots spinning around Moon at decreasing angular speed). Over 1.5 seconds of screen time, the spin rate matches the orbital rate. Clock stops. Text: **"This took ~100 million years."**

**0:30** — Locked state confirmed: Moon rotates at exactly orbital speed. Face always toward Earth. Camera pulls back to see the whole system. Text: **"T_spin = T_orbit = 27.3 days."** Earth now also shows rotation (continent outline spins), contrasting with Moon's locked state. A green "LOCKED" badge (rounded rectangle) appears beside the Moon.

**0:34** — "Far side" reveal: camera rotates around the Earth-Moon system (orthographic orbit of camera, 180° sweep in 3 seconds). The Moon's far side comes into view — no face painted, terrain shown as dark grey with craters. Label: **"Far side — never seen from Earth. First photographed 1959 (Luna 3)."**

**0:38** — Other tidally locked examples: pop-up cards (white cards, dark background): **"Pluto ↔ Charon: mutually locked (both faces always facing each other)"**; **"Mercury: not fully locked — 3:2 resonance"**; **"Io, Europa, Ganymede (Jupiter moons): all tidally locked."**

**0:43** — Summary text: **"Tidal locking: gravity's way of synchronizing spin to orbit. Takes millions of years — but permanent."** Earth-Moon system shown once more, full and clean.

## Physics Concept Teased
Tidal locking occurs when the gravitational gradient across a body (tidal forces) raises a permanent bulge; if the body rotates faster than its orbit, the leading bulge experiences a braking torque that gradually slows rotation until the spin period exactly equals the orbital period, after which the torque vanishes.

## On-Screen Text / Captions
- **0:00** — "The Moon is tidally locked — but WHY?" (bold white)
- **0:08** — "T_orbit = T_spin — always synchronized" (label, white)
- **0:13** — "Earth's gravity stretches the Moon into an oval" (tidal bulge label)
- **0:18** — "Misaligned bulge → torque → slows rotation" (inset, white)
- **0:24** — "This took ~100 million years" (center, white italic)
- **0:30** — "T_spin = T_orbit = 27.3 days — LOCKED" (green badge)
- **0:34** — "Far side: never seen from Earth. First photo: 1959." (label, white)
- **0:43** — "Tidal locking: gravity's permanent sync." (center bold white)

## End Card
Final 3 seconds: Earth-Moon system orbiting slowly on black. White text: **"Follow CodedLaws — the Moon's secrets revealed."** Logo bottom-right.

## Audio
Music: Slow, ethereal synth pad throughout. Gentle melodic motif when tidal bulge appears (0:13). Fast-forward clock ticking sound during 100-million-year animation (0:24). Warm resolution chord at 0:43. No voiceover. Sound effects: soft "stretch" tone as tidal bulge forms; clock ticking (accelerated) during time-lapse; camera orbit whoosh at 0:34 (far-side reveal).

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: Moon deformed into an oval — use ctx.save(); ctx.scale(1.3, 0.85); ctx.arc(...); ctx.restore() to draw an ellipse; orient the major axis toward Earth using ctx.rotate(angle_to_Earth). Face on Moon: draw two 3 px dots and a small arc as the smile at the Earth-facing pole of the Moon; rotate the entire Moon sprite so this face tracks Earth. Camera rotation (far-side reveal): in 2D, simulate by translating all objects along a cosine sweep (x' = x * cos(angle)) to approximate a 3D orbital camera without actual WebGL. Tidal bulge misalignment (inset): precompute a static diagram rather than simulating; show Moon oval rotated 20° ahead of sub-Earth point, with a curved red torque arrow. Runtime: ~46 seconds. Gotcha: the Moon's face must track Earth continuously throughout the orbit — compute angle_to_Earth = atan2(earth.y - moon.y, earth.x - moon.x) each frame and rotate the Moon's texture by this angle before drawing.
