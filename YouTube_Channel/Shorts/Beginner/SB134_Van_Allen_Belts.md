---
title: "Earth's Invisible Radiation Shield"
id: SB134
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, van-allen-belts, magnetosphere]
---

> **What it is:** A ~45-second simulation short where a cross-section of Earth shows glowing red and orange belt ovals around dipole field lines, a highlighted solar particle spirals down a field line and ping-pongs between magnetic mirror points, and a coronal mass ejection makes the belts flare bright and triggers polar auroras — revealing the physics trapping radiation away from Earth's surface. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Earth's Invisible Radiation Shield
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Black space background. Earth (blue/green marble, 50 px radius) floats at center. Two glowing donut rings appear around it — inner ring burning red (#FF3300), outer ring deep orange (#FF8800). They pulse once. A solar wind particle (yellow dot) streaks in from the left, hits the outer belt, and spirals along field lines instead of penetrating. Bold: **"Earth's invisible armor."**

## Main Visual Sequence (0:03–0:50)
**0:03** — Cross-section view (vertical slice through Earth-belt system, as if cut down the magnetic axis). Earth: blue/green filled circle (radius 40 px) at center. Magnetic field lines: white arcs curving from south pole to north pole (8 field lines, symmetric, drawn as parametric curves). Inner belt: red semi-transparent torus cross-section (two red ovals, ~1.5 Earth radii from center). Outer belt: orange semi-transparent torus cross-section (two orange ovals, ~4 Earth radii from center). Labels with white arrows: **"Inner belt: 600–6,000 km"** and **"Outer belt: 13,000–60,000 km"**.

**0:08** — A stream of yellow charged particles (solar wind, dots radius 3 px, moving left to right) approaches from the left. Particle count label: **"Solar wind: 1–10 million particles/cm³/s"** (small white, top-left). The magnetosphere boundary (faint blue curve, bow shock) deflects most particles around Earth.

**0:13** — One particle (highlighted yellow, radius 5 px, glowing white halo) enters the outer belt region. It does not travel straight — it immediately begins spiraling around a field line (helix animation: forward motion + circular rotation perpendicular to field). White helix path drawn in real-time. Label: **"Gyration around field line"** with rotation arrows.

**0:19** — The spiral tightens near the magnetic poles (field lines converge). Particle slows, stops, reverses (magnetic mirror effect). Bounce animation: particle oscillates back and forth between two mirror points (north and south). Label: **"Magnetic mirror: particle trapped!"** (cyan, with bidirectional arrow between mirror points).

**0:25** — Particle count visualization: inner belt fills with red dots (protons, high energy), outer belt fills with orange dots (electrons, high energy). A large counter bottom-right: **"Inner belt: ~10⁷ protons/cm³"** (red) and **"Outer belt: ~10⁵ electrons/cm³"** (orange).

**0:30** — The South Atlantic Anomaly (SAA) highlighted: irregular yellow-green patch over South America and South Atlantic ocean (2D map overlay). Label: **"South Atlantic Anomaly — inner belt dips lowest here. Satellites get extra radiation."** ISS orbit trace (white dashed line) passes through SAA; ISS icon flashes briefly as it crosses.

**0:36** — Why it matters: pop-up cards (white on dark): **"Without the belts: solar wind strips the atmosphere (like Mars did over billions of years)."** Mars icon (red circle) appears beside Earth comparison. Mars label: **"Mars: no strong field → no belt → thin atmosphere."**

**0:41** — Animation finale: solar storm event. Sun (yellow, left edge) erupts a bright orange CME plume. It hits Earth's magnetosphere. Belts glow intensely (red/orange brighten). Northern lights (green, at poles) flash briefly. Text: **"Coronal mass ejections supercharge the belts — triggering auroras."**

**0:45** — Final text center: **"Van Allen belts: Earth's magnetic shield. Without them, life as we know it couldn't exist."**

## Physics Concept Teased
The Van Allen radiation belts are two concentric torus-shaped regions of energetic charged particles (protons in the inner belt, electrons in the outer) trapped by Earth's dipole magnetic field; particles spiral along field lines and bounce between magnetic mirror points, shielding Earth's surface from harmful solar radiation.

## On-Screen Text / Captions
- **0:00** — "Earth's invisible armor" (bold white)
- **0:03** — "Inner belt: 600–6,000 km" / "Outer belt: 13,000–60,000 km" (labels)
- **0:08** — "Solar wind: 1–10 million particles/cm³/s" (white, top-left)
- **0:13** — "Gyration around field line" (label)
- **0:19** — "Magnetic mirror: particle trapped!" (cyan)
- **0:25** — "Inner: ~10⁷ protons/cm³  |  Outer: ~10⁵ electrons/cm³" (counters)
- **0:30** — "South Atlantic Anomaly — inner belt is weakest here" (map label)
- **0:36** — "Without belts: Mars lost its atmosphere. Earth didn't." (card)
- **0:41** — "CME hits → belts glow → auroras!" (white, top)
- **0:45** — "Van Allen belts: Earth's magnetic shield." (center, bold white)

## End Card
Final 3 seconds: Earth with glowing red/orange belts pulsing slowly on black. White text: **"Follow CodedLaws — Earth's hidden physics."** Logo bottom-right.

## Audio
Music: Deep space ambient drone at 0:00; builds to a dramatic orchestral swell at 0:41 (CME impact); resolves to quiet, awe-inspiring pad at 0:45. No voiceover. Sound effects: solar wind hiss (white noise, soft) from 0:08; magnetic spiral "whirr" as particle gyrates (0:13); deep bass thud at CME impact (0:41); aurora shimmer (high-frequency soft shimmer sound) at 0:41.

## Production Notes
Code complexity: Medium-High. Renderer: Canvas 2D. Key visual trick: magnetic field lines drawn as parametric curves — use the equation for a dipole field in polar coords: r = r₀ * sin²(θ), where r₀ is the foot-point radius. For each of 8 field lines (r₀ values from 1.2R_E to 6R_E), compute 100 points along the curve, draw with ctx.beginPath / ctx.quadraticCurveTo. Belt cross-sections: draw ellipses using ctx.ellipse() in two symmetric positions (above and below equator, offset from center). Particle helix: compute x = x₀ + vx*t, y = y₀ + A*sin(ω*t) where the sine provides the helical component in 2D; rotate by field line angle. CME event at 0:41: briefly increase all particle velocities by 3× and brighten belt colors (interpolate toward white over 0.5 s then back). Runtime: ~48 seconds. Gotcha: belt colors must be semi-transparent (alpha ~0.4) so field lines are visible through them; if belts are fully opaque the diagram reads as solid rings.
