---
title: "Why Water Climbs a Narrow Tube Against Gravity (Capillary Action)"
id: B054
difficulty: 2.5/10
prereq: "B053_Surface_Tension"
concept: "Capillary pressure ΔP = 2γcosθ/r; climbing height h = 2γcosθ/(ρgr) — water climbs higher in narrower tubes"
tags: [fluids, capillary-action, surface-tension, contact-angle, adhesion, wicking, canvas, beginner]
category: beginner
type: video-idea
---

# Why Water Climbs a Narrow Tube Against Gravity (Capillary Action)

**Alt title:** "Water Defies Gravity: The Narrow Tube Trick"
**Difficulty:** 2.5/10 | **Prereq:** B053_Surface_Tension

---

## Opening Hook (0:00–1:00)

The screen shows a series of glass tubes of decreasing diameter — starting at 1 cm wide, then 5 mm, 2 mm, 1 mm, and finally a hair-thin 0.1 mm tube — all dipped simultaneously into a tray of water colored with blue food dye. In real time, the water visibly climbs up each tube. The narrowest tube shows a column of water nearly 15 centimeters tall, standing above the surface of the reservoir against gravity, held up by nothing visible. The host asks: there is no pump, no suction, no electricity — what force is pulling the water upward? The viewer learns this is how plants move water from roots to leaves at heights of 100 meters, how ink wicks into paper, and how blood moves through capillaries in the body. It is one of the most important phenomena in all of biology and materials science.

## The Naive Attempt

The viewer builds a capillary tube simulator step by step. Step one: draw four vertical tubes of decreasing inner radii using `ctx.strokeRect()`, all dipped into a shared reservoir. Step two: write a function that sets the water fill height in each tube proportional to `1/r` — the narrower the tube, the higher the water climbs. Step three: add an animation loop that increments the water level each frame until it reaches the target height, simulating the rise. Step four: display the equilibrium height as a number beside each tube. Step five: try to compute the upward force from surface tension as `F = gamma * 2 * pi * r` (the full surface tension times circumference) without accounting for the contact angle. The viewer expects the force to balance gravity and set the equilibrium height correctly.

## The Moment of Failure

Running the naive code, all four tubes show water climbing to heights that are slightly too high. The reason becomes clear: the code used the full surface tension without projecting by the contact angle cosθ. For glass and water, the contact angle is about 20°, so cosθ ≈ 0.94 — a small but measurable error. More importantly, when the viewer adds a hydrophobic tube (like a waxed surface where θ = 110°), the code still shows water climbing because it did not account for the fact that cosθ is negative for hydrophobic surfaces. In a hydrophobic tube, water should be pushed DOWN below the reservoir level, not up. The simulation shows water climbing even in the hydrophobic tube — the exact opposite of reality — because the sign of the cosine was ignored entirely.

## Why It Broke — The Physics

Capillary action is the result of two competing forces: the surface tension at the meniscus (the curved liquid surface inside the tube) pulling the liquid upward along the tube wall, and gravity pulling the liquid column down. At equilibrium, these balance. The capillary pressure across the curved meniscus (from the Young-Laplace equation derived in B053) is:

**ΔP = 2γcosθ / r**

where γ is surface tension (N/m), θ is the contact angle between the liquid and the tube wall, and r is the tube inner radius (m). This pressure difference drives fluid upward until the hydrostatic pressure of the risen column (ρgh) equals the capillary pressure. Setting ρgh = 2γcosθ/r and solving for h gives the Jurin's Law:

**h = 2γcosθ / (ρgr)**

When θ < 90° (hydrophilic, like water on glass), cosθ > 0 and the liquid rises. When θ > 90° (hydrophobic, like water on wax), cosθ < 0 and the liquid is depressed below the reservoir.

## The One Concept

Capillary action results from the balance between adhesive forces (between the liquid molecules and the tube wall) and cohesive forces (between liquid molecules themselves), mediated through surface tension and contact angle. The contact angle θ is the angle the liquid surface makes with the solid wall at the three-phase contact line. A small contact angle means the liquid strongly wets the surface (adhesion dominates); a large contact angle means the liquid beads up (cohesion dominates). Jurin's Law, h = 2γcosθ/(ρgr), has a striking consequence: doubling the tube radius halves the climbing height. A 0.1 mm radius tube lifts water to about 15 cm; a 0.01 mm (10 µm) radius — comparable to a plant xylem vessel — lifts water to 1.5 meters. Trees use bundles of thousands of such xylem channels; a redwood tree 100 meters tall depends on capillary action combined with transpiration to move water from root to crown. Paper towels, wicks in oil lamps, and cotton fabrics all exploit capillary action through their porous fibrous networks. In the human body, blood plasma wicks into tissue through capillaries whose walls are specifically designed to be hydrophilic. Understanding capillary action is essential in microfluidics, where channels 10–100 µm wide allow lab-on-a-chip devices to manipulate tiny volumes of fluid passively, without any external pump.

## The Fix

Correct the height formula to include the contact angle:

```javascript
const gamma = 0.0728;       // N/m (water at 20°C)
const rho   = 1000;         // kg/m³
const g     = 9.81;         // m/s²
const theta = contactAngle * Math.PI / 180;  // convert degrees to radians

function capillaryHeight(r) {
    return (2 * gamma * Math.cos(theta)) / (rho * g * r);
}
```

Now set `contactAngle = 110` (hydrophobic) and watch all four tube columns drop below the reservoir line — water is depressed, not raised. The sign flip in `Math.cos(theta)` handles both cases automatically and correctly.

## The Wow Moment — Push It

Build a plant transpiration simulator: a root (wide reservoir) connected through 100 parallel capillary tubes of radius 10 µm (rendered as a dense bundle) to a leaf "evaporation zone" at the top. Animate water climbing up all 100 tubes simultaneously, driven by capillary pressure, and then evaporating from the top at a user-controlled rate. Show the reservoir level dropping as water is pulled through. Add a "drought" button that reduces reservoir water and shows the tubes emptying from the top down — which is exactly what happens when a plant wilts.

## The Interactive Demo

- **Tube radius slider** (0.05–5 mm): watches h change as 1/r in real time across four tubes.
- **Contact angle slider** (0°–150°): from fully hydrophilic (water climbs high) to hydrophobic (water depressed); color-codes the tube wall.
- **Liquid density selector**: Water (1000), Ethanol (789), Mercury (13,600 kg/m³ — mercury is depressed in glass).
- **Surface tension slider** (0.01–0.073 N/m): soapy water vs pure water effect on climb height.
- **Animate rise toggle**: plays the meniscus climbing animation at the physically correct speed.

## Production Notes

Use a white background for this video to make the blue dye in the tubes maximally visible. Always show all four tubes simultaneously so the viewer can see the 1/r relationship at a glance. When introducing Jurin's Law, animate the equation building up piece by piece: show h first, then the = sign, then 2γ, then ×cosθ, then /(ρgr), with each variable highlighted as it appears. The contact angle demonstration needs a close-up arc animation showing the meniscus curvature reversing as θ crosses 90°.

## Tags
`fluids` `capillary-action` `surface-tension` `contact-angle` `adhesion` `wicking` `canvas` `beginner`

## Thumbnail

Four vertical glass tubes of obviously different widths, each filled with blue-colored water climbing to dramatically different heights — the narrowest tube has water nearly at the top while the widest has barely any rise. White background for clarity. Bold red text: "WATER CLIMBS HIGHER IN NARROWER TUBES." A small arrow pointing upward against gravity on the narrowest tube reinforces the anti-gravity theme. The visual staircase of water levels is the stop-scroll moment.
