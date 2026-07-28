---
title: "What Makes Honey Flow Slowly (Viscosity in Code)"
id: B055
difficulty: 2.5/10
prereq: "B051_Pressure_Fluids"
concept: "Newtonian viscosity: shear stress τ = μ(du/dy); Poiseuille flow Q = πr⁴ΔP/8μL"
tags: [fluids, viscosity, poiseuille, shear-stress, newtonian, flow, canvas, beginner]
category: beginner
type: video-idea
---

# What Makes Honey Flow Slowly (Viscosity in Code)

**Alt title:** "Why Honey Is Slow and Water Is Fast — Inside the Fluid"
**Difficulty:** 2.5/10 | **Prereq:** B051_Pressure_Fluids

---

## Opening Hook (0:00–1:00)

Side by side on screen: a thin straw through which water flows freely in a fraction of a second, and the same straw filled with honey, which oozes out over several seconds in a slow golden drip. Both are pushed by the same pressure — the same column of fluid above. The host then reveals a more shocking comparison: if you halve the pipe radius, the flow rate does not halve — it drops to one-sixteenth. The host repeats that: same pressure, half the pipe, sixteen times less flow. That r⁴ dependence is the most counterintuitive result in fluid statics for beginners, and it governs everything from the diameter of arteries to the design of oil pipelines. The viewer is promised a code simulation that shows this scaling dramatically, starting from the simplest model of fluid layers sliding past each other.

## The Naive Attempt

The viewer codes a simple pipe flow simulator. Step one: draw a horizontal pipe as two parallel lines using `ctx.moveTo()` / `ctx.lineTo()`. Step two: place 20 horizontal velocity arrows inside the pipe, all the same length, representing a uniform plug flow profile. Step three: add a "flow rate" display that computes Q = velocity × pipe area = v × πr². Step four: add a pressure difference slider labeled ΔP and connect it so that Q = ΔP × πr² / (8 × μ × L), where μ is hardcoded to water viscosity (0.001 Pa·s). Step five: add a viscosity slider and watch Q change. The viewer expects Q to halve when μ doubles — which is correct. But when they add a radius slider, they make the mistake of computing Q = ΔP × πr² / (8μL), forgetting the r⁴ dependence, treating it as r² instead because "area scales as r²."

## The Moment of Failure

With the erroneous r² formula, when the viewer halves the pipe radius from 10 mm to 5 mm, the displayed flow rate drops to one-quarter of its original value. The viewer might think "OK, area halved by four, so flow halved by four — that makes sense." But the correct Poiseuille formula gives one-sixteenth, not one-quarter. The animated velocity profile inside the pipe is all arrows the same length — showing plug flow — rather than the correct parabolic profile where the center flows fastest and the walls have zero velocity. The physical mistake is ignoring the viscous friction from the walls: fluid near the wall is slowed down by wall adhesion, and this drag is transmitted inward through viscosity, creating a parabolic gradient.

## Why It Broke — The Physics

Viscosity μ (dynamic viscosity, units: Pa·s) is a fluid's resistance to shear deformation. Newton's law of viscosity defines shear stress τ as the force per unit area required to maintain a velocity gradient between fluid layers:

**τ = μ (du/dy)**

where u is the fluid velocity in the flow direction and y is the direction perpendicular to flow. In a pipe, the boundary condition is no-slip: fluid velocity at the wall is exactly zero. Solving the Navier-Stokes equations for steady, fully developed flow in a circular pipe (assuming laminar, Newtonian flow) gives a parabolic velocity profile:

**u(r) = (ΔP / 4μL)(R² - r²)**

where R is pipe radius, r is radial distance from center, ΔP is pressure difference, L is pipe length. Integrating this parabola over the cross-section gives the Hagen-Poiseuille equation:

**Q = πR⁴ΔP / (8μL)**

The R⁴ factor is the central result: doubling the radius increases flow by 16×; halving the radius decreases flow by 16×. This is why arterial plaque narrowing a coronary artery by only 30% in radius reduces blood flow by (0.7)⁴ ≈ 24% — nearly a quarter reduction from a seemingly small blockage.

## The One Concept

Viscosity is the macroscopic manifestation of molecular momentum transfer between fluid layers. In a liquid, molecules move randomly; when one layer flows faster than an adjacent layer, faster molecules diffuse into the slower layer and drag it along, while slower molecules move into the faster layer and retard it. This momentum exchange costs energy and resists the velocity difference — that resistance is viscosity. Dynamic viscosity μ has units of Pa·s; water at 20°C has μ = 0.001 Pa·s; honey is roughly 2–10 Pa·s; motor oil is 0.1–0.3 Pa·s; air is 1.8 × 10⁻⁵ Pa·s. Kinematic viscosity ν = μ/ρ (m²/s) appears when inertia matters (see Reynolds number). The Hagen-Poiseuille law Q = πR⁴ΔP/(8μL) holds only for laminar, Newtonian, incompressible, fully developed flow in a straight circular pipe — but those conditions cover an enormous range of practical systems including blood flow in capillaries, oil flow in pipelines, and hydraulic fluid in machinery. The R⁴ scaling has profound engineering consequences: doubling a water main diameter increases its capacity by a factor of 16, making pipe sizing one of the highest-leverage decisions in civil engineering.

## The Fix

Replace the erroneous r² formula with the correct Poiseuille law:

```javascript
const mu = viscositySlider.value;   // Pa·s
const R  = radiusSlider.value;      // m
const dP = pressureSlider.value;    // Pa
const L  = pipeLength;              // m

const Q = (Math.PI * Math.pow(R, 4) * dP) / (8 * mu * L);

// Draw parabolic velocity profile
for (let r = -R; r <= R; r += R/10) {
    const u = (dP / (4 * mu * L)) * (R*R - r*r);
    const arrowLen = u * scale;
    drawArrow(centerX, centerY + r * pixelsPerMeter, arrowLen);
}
```

Now the velocity arrows form a clear parabolic shape — long in the center, tapering to zero at the walls. Halving R drops Q to exactly 1/16 of its original value.

## The Wow Moment — Push It

Animate an artery blockage progression: start with a clean circular pipe, then gradually grow a plaque deposit (gray semicircle) reducing the effective radius. Plot Q versus plaque thickness in real time — the viewer watches flow rate collapse steeply due to R⁴. At 50% radius reduction, Q drops to (0.5)⁴ = 6.25% of original — a 94% reduction from half the radius blocked. Display a heart-rate indicator that increases as the heart works harder to compensate.

## The Interactive Demo

- **Pipe radius slider** (1–20 mm): updates Q with R⁴ scaling and redraws the parabolic profile.
- **Viscosity dropdown**: Water (0.001), Blood (0.003), Oil (0.1), Honey (5.0) Pa·s.
- **Pressure drop slider** (1–1000 Pa): drives flow linearly.
- **Pipe length slider** (0.1–2 m): shows inverse linear scaling.
- **Show parabola toggle**: overlays the u(r) = (ΔP/4μL)(R²-r²) velocity profile.
- **Artery blockage slider** (0–80% radius): reduces effective R and plots Q drop-off.

## Production Notes

Draw the pipe horizontally in the center of the screen with plenty of vertical space. Use color-coded velocity arrows — red for fast, blue for slow — so the parabolic profile is immediately visually striking. When introducing τ = μ(du/dy), animate two fluid layers sliding past each other with arrows showing the velocity gradient, and label the slope du/dy explicitly. Include a real-world overlay card: "Your coronary artery: R ≈ 1.5 mm, μ_blood ≈ 0.003 Pa·s" when discussing the medical example.

## Tags
`fluids` `viscosity` `poiseuille` `shear-stress` `newtonian` `flow` `canvas` `beginner`

## Thumbnail

A split pipe cross-section: left half shows water with long, fast velocity arrows forming a sharp parabola; right half shows honey with barely-visible short arrows. Both pipes are the same size and pressure. Bold text across the top: "HALF THE PIPE = 16× LESS FLOW." Yellow accent color on the "16×" to make it pop. The dramatic number contrast is the stop-scroll element.
