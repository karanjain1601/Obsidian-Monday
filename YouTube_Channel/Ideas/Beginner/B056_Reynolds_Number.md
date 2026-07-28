---
title: "The Line Between Smooth and Chaotic Flow (Reynolds Number)"
id: B056
difficulty: 2.5/10
prereq: "B055_Viscosity"
concept: "Reynolds number Re = ρvL/μ; below ~2300 → laminar; above → turbulent; inertial vs viscous forces"
tags: [fluids, reynolds-number, laminar, turbulent, viscosity, dimensionless, canvas, beginner]
category: beginner
type: video-idea
---

# The Line Between Smooth and Chaotic Flow (Reynolds Number)

**Alt title:** "One Number Predicts Whether Flow Goes Chaotic"
**Difficulty:** 2.5/10 | **Prereq:** B055_Viscosity

---

## Opening Hook (0:00–1:00)

The screen shows a pipe with smoke or dye injected at the center. At low velocity, the dye streams perfectly straight down the centerline — a single, unbroken, vivid line through the pipe. The host cranks up the flow speed. For a while, nothing changes. Then, at a critical moment, the dye thread suddenly disintegrates into wild, swirling eddies that mix instantly with the surrounding fluid. The entire pipe cross-section fills with color within one second. The transition is abrupt and dramatic — smooth one moment, completely chaotic the next. The host announces that this transition was predicted in 1883 by Osborne Reynolds using a single dimensionless number. Every pipe, every aircraft wing, every swimming fish, every blood vessel can be characterized by this one number, and knowing it predicts whether the flow will be calm or turbulent.

## The Naive Attempt

The viewer codes a dye-streak simulation using Canvas. Step one: create a pipe drawn as two horizontal rectangles. Step two: release a line of 50 small particles from the center of the pipe at x = 0, colored bright red. Step three: give each particle a horizontal velocity `vx = flowSpeed` and a tiny random vertical perturbation `vy = random(-epsilon, epsilon)` to represent small disturbances. Step four: at each animation frame, update particle positions and render them as small dots. Step five: the viewer adds a flow speed slider and expects to see the dye stay straight at low speeds and become turbulent at high speeds. However, since each particle moves independently without any fluid interaction, the dye streak disperses randomly at all speeds equally — there is no laminar-to-turbulent transition, just random scatter from the start.

## The Moment of Failure

At low flow speeds in the naive simulation, the dye particles still disperse due to the random vy perturbation — the simulation shows turbulence even when the physics says it should be completely laminar. Conversely, at high flow speeds it looks the same — just faster random scatter. The simulation fails to show the critical transition that makes Reynolds number meaningful. The problem is that purely Lagrangian particles with random perturbations have no mechanism for the viscous forces to damp those perturbations at low speeds or for inertial forces to amplify them at high speeds. A simple particle system cannot capture the transition; a fluid field simulation is needed.

## Why It Broke — The Physics

The Reynolds number is defined as:

**Re = ρvL / μ**

where ρ is fluid density (kg/m³), v is characteristic flow velocity (m/s), L is characteristic length scale (m, typically pipe diameter D for pipe flow), and μ is dynamic viscosity (Pa·s). Re is dimensionless. It represents the ratio of inertial forces (which tend to amplify disturbances and cause turbulence) to viscous forces (which damp disturbances and restore laminar flow). At Re < 2300 in a pipe, viscous forces dominate; any small perturbation is damped out and the flow remains laminar. At Re > 4000, inertial forces dominate; perturbations grow exponentially and the flow becomes turbulent. The range 2300–4000 is the transitional regime. Reynolds demonstrated this experimentally in 1883 by injecting dye into carefully controlled pipe flows and measuring the critical velocity at which the transition occurred — finding that Re at transition was always approximately 2300, independent of the pipe material, fluid type, or absolute scale.

## The One Concept

The Reynolds number is the most important dimensionless group in fluid mechanics. Its power is that it allows similarity: a 1:100 scale model of an aircraft in a water tunnel, if it has the same Re as the full-scale aircraft in air, will exhibit identical flow patterns scaled geometrically. This is how wind tunnel testing works — engineers deliberately match Re between model and full-scale prototype. Re = ρvL/μ encapsulates the physics beautifully: large ρ (dense fluid) at high v (fast flow) over large L (big object) gives high Re and likely turbulence; high μ (viscous fluid) suppresses turbulence. A bacterium swimming through water (L ≈ 2 µm, v ≈ 30 µm/s) has Re ≈ 6 × 10⁻⁵ — it lives in a world of perfectly laminar flow where inertia is meaningless and stopping is instantaneous. An aircraft wing (L ≈ 2 m, v ≈ 250 m/s) has Re ≈ 3 × 10⁷ — deeply turbulent, and that turbulence actually delays flow separation and reduces drag. Blood in the aorta (v ≈ 0.3 m/s, D ≈ 2.5 cm) gives Re ≈ 2000 — near-laminar in most conditions, but turbulent during peak systole, which produces the sounds a doctor hears through a stethoscope as heart murmurs.

## The Fix

Replace the particle system with a simplified field model: represent the transverse velocity perturbation magnitude as a field variable that grows or decays based on Re. Use an exponential model: if Re < 2300, multiply perturbation amplitude by (1 - damping) each frame (damping proportional to how far below 2300 Re is); if Re > 4000, multiply by (1 + growth). Render the dye as a vertical band whose width represents perturbation amplitude:

```javascript
const Re = (rho * velocity * diameter) / mu;
const critical = 2300;
let perturbation = initialPerturbation;

if (Re < critical) {
    const dampingRate = 0.02 * (1 - Re / critical);
    perturbation *= (1 - dampingRate);      // exponential decay → laminar
} else if (Re > 4000) {
    const growthRate = 0.01 * ((Re - 4000) / 4000);
    perturbation *= (1 + growthRate);       // exponential growth → turbulent
}
dyeStreamWidth = baseWidth + perturbation * amplitudeScale;
```

Now the dye streak is thin and straight at low Re and blooms into a wide turbulent band at high Re, with the transition happening sharply near Re = 2300.

## The Wow Moment — Push It

Build a Reynolds number gallery: five side-by-side flow visualizations at Re = 100, 500, 1000, 2300, 5000, and 10000. Show the dye streak for each simultaneously. Then animate a single simulation sweeping Re from 100 to 10000 continuously — the viewer watches the orderly laminar streak slowly destabilize, then suddenly erupt into turbulence at the critical point. Add Kármán vortex street visualization behind a cylinder at Re > 40: alternating vortices shed from each side, forming a beautiful periodic wake pattern.

## The Interactive Demo

- **Flow velocity slider** (0.001–2 m/s): primary Re control; Re display updates live.
- **Pipe diameter slider** (1–50 mm): scales L in Re calculation.
- **Fluid selector** dropdown: Water (ρ=1000, μ=0.001), Air (ρ=1.2, μ=1.8e-5), Honey (ρ=1400, μ=5).
- **Re display**: large numerical readout, color-coded green (laminar), yellow (transitional), red (turbulent).
- **Dye injection toggle**: turns dye visualization on/off.
- **Cylinder wake mode toggle**: switches from pipe to flow-past-cylinder with Kármán vortex shedding.

## Production Notes

The opening hook dye experiment must be the most visually compelling moment of the video. Pre-render or carefully animate the transition from laminar to turbulent: first a perfectly straight single-pixel red line, then a gentle oscillation, then explosive mixing. Keep the Re number display in the top-right corner visible throughout the entire video so viewers can always see the number as it changes. Use color-coding: blue background for laminar sections of the video, red background for turbulent sections.

## Tags
`fluids` `reynolds-number` `laminar` `turbulent` `viscosity` `dimensionless` `canvas` `beginner`

## Thumbnail

A dramatic split down the center of a pipe: the left half shows a clean straight dye line (laminar), the right half shows wild swirling chaos (turbulent). A bold vertical line separates them. Giant text: "Re = 2300" at the dividing line. The visual chaos vs calm contrast is immediately arresting. Dark pipe background makes the bright colored dye pop. This is one of the most visually dramatic phenomena in fluid mechanics — the thumbnail practically makes itself.
