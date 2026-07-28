---
title: "Shockwave Reflection — Mach Stem Formation"
id: SM117
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Shockwave_Physics_Full]]"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, shockwaves, aerodynamics, compressible-flow]
---

> **What it is:** A ~45-second simulation short where an oblique shockwave reflecting off a flat wall transitions from clean regular reflection into a three-shock Mach reflection pattern, with a near-normal Mach stem and a triple point where all three shocks meet. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Shockwave_Physics_Full]]

# Short: Shockwave Reflection — Mach Stem Formation
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A bright white shockwave — a crisp, razor-sharp discontinuity — hits a flat surface at an angle. Instead of reflecting cleanly like a billiard ball, the reflection spawns a third, vertical shock perpendicular to the wall. Three shocks collide at a single point called the triple point. The pattern is hypnotically symmetric and completely non-intuitive.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D compressible flow simulation — density field shown as a grayscale schlieren image (∂ρ/∂x grayscale, like a real shadowgraph). An oblique shock hits the bottom wall at θ_i = 30° (incident angle). Mach number: M₁ = 2.5. Flow moves left to right, wall is bottom boundary.
- **0:10–0:18:** Regular reflection case (M₁ = 2.0, θ = 20°): the reflected shock angle θ_r ≈ 15° shown cleanly bouncing off the wall. The two-shock pattern: incident shock (IS) and reflected shock (RS) meeting at the wall. Deflection angles labeled. This is textbook oblique shock theory.
- **0:18–0:28:** Transition: increase M₁ to 3.5 or θ to 45°. The regular reflection solution ceases to exist — no θ_r satisfies the deflection matching condition. The simulation morphs: the regular reflection breaks down and a Mach reflection forms. Three features appear: incident shock (IS), reflected shock (RS), and Mach stem (MS) — a near-normal shock perpendicular to the wall.
- **0:28–0:38:** Triple point T marked where IS, RS, and MS meet. A contact surface (slipstream, shown as a thin orange line) extends from T downstream — separating fluid that passed through the Mach stem from fluid that crossed both oblique shocks. Mach stem height grows with downstream distance.
- **0:38–0:45:** Real-world application: nuclear blast wave over flat terrain — Mach stem produces the "double boom" effect and explains why blast damage is worse at certain distances. A stylized blast wave schematic shows the Mach stem slamming into a building.

## Physics Concept Teased
When an oblique shock reflects from a wall, the required reflected shock angle may exceed the detachment limit — no steady oblique shock can turn the flow enough. The flow then transitions to Mach reflection: a near-normal Mach stem forms at the wall, connected to the incident and reflected shocks at the triple point. The triple point emits a slip surface (contact discontinuity). Mach reflection produces higher pressures at the wall than regular reflection.

## On-Screen Text / Captions
- **0:00:** "The shock bounced — but created a third shock no one expected."
- **0:08:** "Regular reflection: M = 2.0, θ = 20°"
- **0:18:** "Regular reflection breaks down above θ_critical"
- **0:25:** "Mach stem: a new near-normal shock forms"
- **0:30:** "Triple point T: where three shocks meet"
- **0:37:** "Mach stem causes higher blast pressure at ground level."
- **0:44:** "Ernst Mach discovered this in 1875."

## End Card
Final 3 seconds: schlieren image frozen at the triple point configuration — three glowing white lines meeting at a single bright point. Text: "Three shocks. One point. Perfect physics." Channel logo.

## Audio
Sharp supersonic crack at the initial shock (0:03). Electronic drone that rises in pitch during the Mach reflection transition (0:18). Voiceover (crisp, precise): "At the critical angle, the physics breaks — and builds itself back up into something stranger." Low bass resonance after the Mach stem forms.

## Production Notes
Code complexity: complex. Renderer: WebGL. Key algorithm: 2D Euler equations (compressible, inviscid) solved with MUSCL-Hancock finite volume scheme on a 512×256 Cartesian grid. HLL or HLLC Riemann solver. Schlieren visualization: compute ∂ρ/∂x numerically, map to grayscale (Sobel filter on density field). Boundary conditions: solid wall (reflective) at bottom, supersonic inflow at left, outflow at right and top. Initial condition: oblique shock initialized analytically using Rankine-Hugoniot relations. Gotcha: must run at CFL ≈ 0.5 for stability near shocks. The transition from regular to Mach reflection occurs at the von Neumann criterion (not the detachment criterion) for strong shocks — plot both criteria on M-θ diagram.
