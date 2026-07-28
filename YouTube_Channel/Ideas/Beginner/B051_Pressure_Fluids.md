---
title: "Why Pressure Increases With Depth (But Not Width)"
id: B051
difficulty: 2/10
prereq: "None"
concept: "Hydrostatic pressure p = ρgh depends only on depth, not on total volume or container shape"
tags: [fluids, hydrostatics, pressure, density, gravity, simulation, canvas, beginner]
category: beginner
type: video-idea
---

# Why Pressure Increases With Depth (But Not Width)

**Alt title:** "The Hydrostatic Paradox: Same Pressure, Any Container Shape"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The screen opens on a split view: on the left, a towering column of water the width of a drinking straw, 10 meters tall; on the right, a vast lake, also 10 meters deep but spanning the entire screen. A pressure gauge sits at the bottom of each. Both gauges read exactly the same value — 98,000 pascals. The viewer's first instinct is that the lake must press down harder; it contains vastly more water and more weight. The host zooms into the gauge needles to show they are identical. The question hangs in the air: how can a straw-sized column of water press down with the same force as an entire lake? This is the hydrostatic paradox, and it is one of the most counterintuitive results in all of classical physics.

## The Naive Attempt

The viewer opens a blank HTML Canvas file and begins building a simple pressure simulator. Step one: draw a rectangular container using `ctx.fillRect()` filled with a blue gradient to represent water. Step two: represent a small imaginary test square (1 cm × 1 cm face) sitting somewhere inside the fluid — draw it as a highlighted red tile. Step three: write a function `naivePressure(mass, area)` that takes the total mass of water above the test square and divides by area to get pressure. Step four: connect a slider that changes the container width while keeping depth constant. The viewer runs the code and watches the displayed pressure change as the width changes — which seems physically reasonable but is actually wrong. They add a second container on the right side with a different width but the same depth, expecting different pressures.

## The Moment of Failure

When the width slider is dragged from 50 pixels to 500 pixels — simulating a wide lake versus a narrow tube — the pressure reading in the naive simulation climbs proportionally because the code multiplied ρ × (volume above) / area and forgot to cancel correctly. The displayed pressure for the wide lake is ten times higher than the narrow tube at identical depths. Meanwhile, the real physical intuition says the results should be equal. The simulation has produced a pressure that depends on container width, which violates the hydrostatic principle entirely. The viewer can see the gauge on the wide-lake side pegged at ten times the narrow-column value — an obvious, embarrassing divergence from reality.

## Why It Broke — The Physics

The mistake was computing the weight of the entire water volume above the test point and dividing by the test area. But that is only correct for a flat-bottomed column directly above the measurement point. The key insight is that pressure at a depth h is determined entirely by the vertical column of fluid directly above the measurement point, not by surrounding fluid. The correct derivation comes from hydrostatic equilibrium: consider a thin horizontal slab of fluid at depth h with thickness dh. The weight of that slab per unit area is ρg dh. Integrating from the surface (h = 0) down to depth h gives the fundamental equation:

**p = ρgh**

where ρ is fluid density (kg/m³), g is gravitational acceleration (9.81 m/s²), and h is depth below the free surface (m). Notice that container width, total volume, and shape do not appear anywhere in this equation. The pressure depends only on density, gravity, and depth.

## The One Concept

Hydrostatic pressure is the pressure exerted by a fluid at rest at a given depth below the surface. It arises because every layer of fluid must support the weight of all fluid directly above it. The formal derivation imagines a tiny cubic element of fluid at depth h. For it to remain stationary, the upward pressure from below must exceed the downward pressure from above by exactly the weight of the cube: dP = ρg dh. Integrating yields p = ρgh + p₀ where p₀ is surface pressure (typically atmospheric). The remarkable consequence is the hydrostatic paradox: a tall, thin tube connected to a large reservoir will always have the same pressure at the bottom as the reservoir itself at the same depth. This is why dams are built thick at the bottom — not because of the water's total weight, but because depth alone drives pressure. Deep-sea submersibles at 10,000 m experience pressure of roughly 1,000 atmospheres (ρgh ≈ 1025 × 9.81 × 10000 ≈ 100 MPa) regardless of the volume of the surrounding ocean. In medical contexts, blood pressure is measured in mmHg — millimeters of mercury height — because pressure depends only on the column height of the fluid.

## The Fix

Replace the naive computation with a direct depth lookup. In the canvas simulation, store the y-coordinate of the water surface as `surfaceY`. For any test point at canvas y-coordinate `pointY`, depth is `depth = (pointY - surfaceY) / pixelsPerMeter`. Then compute:

```javascript
const rho = 1000;       // kg/m³ water
const g = 9.81;         // m/s²
const pressure = rho * g * depth;  // Pa
displayPressure(pressure);
```

Remove all references to container width from the pressure calculation. Now drag the width slider — the pressure display stays perfectly constant. The two containers on screen show identical gauge readings regardless of their horizontal dimensions.

## The Wow Moment — Push It

Extend the demo to show the U-tube manometer paradox live. Draw two vertical tubes connected at the bottom with a horizontal segment — one tube is wide, one is a hairline. Pour virtual fluid into the wide tube by clicking; watch the fluid level rise in both tubes simultaneously and equalize at the same height. Then add a density slider: switch from water (ρ = 1000) to mercury (ρ = 13,600) and watch the pressure gauge jump 13.6× at the same depth. Finally, show a curved container — a spherical vessel — and prove that pressure at the bottom is still just ρgh, ignoring the slanted walls entirely.

## The Interactive Demo

- **Depth slider** (0–20 m): moves the test point up and down, watching pressure scale linearly.
- **Density selector** dropdown: Water (1000), Seawater (1025), Oil (850), Mercury (13,600) kg/m³.
- **Container width slider** (10–500 px): changes the visual width; pressure display stays constant — the "gotcha" slider.
- **Add fluid button**: pours 1 L increments into the container, raising the surface and increasing depth-from-top calculations for any fixed test point.
- **Show force vectors toggle**: overlays arrows showing pressure magnitude at five depth levels simultaneously.

## Production Notes

Open with a dual-container split-screen animation built in Canvas. Keep both containers always visible side by side for the entire video so comparisons are instant. When introducing p = ρgh, zoom into the equation written in large white text on a dark background and animate each variable appearing one at a time as the host names them. The "moment of failure" scene should use a dramatic red color for the wrong pressure bars. When fixing the code, use a diff-style highlight to strike out the width-dependent line and replace it with the correct two-liner. Record in 1080p so the pressure gauge numbers are legible on mobile.

## Tags
`fluids` `hydrostatics` `pressure` `density` `gravity` `simulation` `canvas` `beginner`

## Thumbnail

Full-width split image: left side shows a straw-thin tower of water with a red pressure gauge at the bottom; right side shows a vast ocean-wide lake with an identical gauge. Both gauges have their needles pointing to the exact same position. Giant bold text across the center reads "SAME PRESSURE?" in yellow. The background is a deep oceanic blue gradient. The visual contradiction — tiny straw vs. giant lake — is the stop-scroll moment.
