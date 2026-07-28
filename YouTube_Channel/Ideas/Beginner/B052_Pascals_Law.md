---
title: "The Hydraulic Press: How a Small Force Lifts a Car (Pascal's Law)"
id: B052
difficulty: 2/10
prereq: "B051_Pressure_Fluids"
concept: "Pascal's law: pressure applied to an enclosed fluid transmits equally in all directions; F1/A1 = F2/A2"
tags: [fluids, pascals-law, hydraulics, pressure, mechanical-advantage, force, canvas, beginner]
category: beginner
type: video-idea
---

# The Hydraulic Press: How a Small Force Lifts a Car (Pascal's Law)

**Alt title:** "One Finger Lifts a Car — Pascal's Law Explained"
**Difficulty:** 2/10 | **Prereq:** B051_Pressure_Fluids

---

## Opening Hook (0:00–1:00)

The screen shows a cartoon person pressing down with one finger on a small piston — maybe the size of a coin. On the other side of a fluid-filled U-shaped chamber, a massive piston the size of a dinner table slowly rises, lifting a fully rendered car with ease. The input force label reads "10 N" (about the weight of a bag of apples). The output force label reads "10,000 N" — roughly the weight of a small car. The host pauses and asks: where does that extra energy come from? Is this a free lunch? The viewer is hooked because it seems to violate common sense. The host promises they will code this live, break it, fix it, and then scale it up until the simulation is lifting a jumbo jet.

## The Naive Attempt

The viewer builds a two-piston hydraulic system on a Canvas. Step one: draw a U-shaped tube using `ctx.strokeRect` and fill it with a blue fluid. Step two: place a small piston (circle of radius 10 px) on the left arm and a large piston (circle of radius 50 px) on the right arm. Step three: write an event listener that detects how far the small piston is pushed down (delta y in pixels) and converts it to a volume displaced: `vol = area_small * displacement`. Step four: compute how far the large piston moves up: `rise = vol / area_large`. Step five: write a force display that naively shows `F_out = F_in * (area_large / area_small)` but also shows "energy gained = F_out * rise - F_in * displacement" as a separate label. The viewer runs it and immediately sees the "energy gained" display showing a large positive number — which is wrong.

## The Moment of Failure

With the naive setup, the force-multiplication display is correct but the energy label shows a net gain of energy — it reads something like "+450 Joules for free." This is physically impossible. The simulation has failed to track conservation of energy. On screen, the large piston visually rises much less than the small piston descends, but the code did not multiply force by the respective displacements correctly, or it forgot to subtract the work done by the input side. The energy display is now glowing in red because it is positive, suggesting a perpetual motion machine — the most embarrassing result possible in a physics simulation.

## Why It Broke — The Physics

Pascal's Law states that a pressure change applied anywhere to an enclosed, incompressible fluid is transmitted undiminished to every part of the fluid and to the walls of the container. Mathematically: if you apply force F₁ to a piston of area A₁, the pressure increase is ΔP = F₁/A₁. This pressure acts on every square centimeter of fluid, including the large piston of area A₂, producing output force F₂ = ΔP × A₂ = F₁ × (A₂/A₁). So the mechanical advantage is:

**MA = F₂/F₁ = A₂/A₁**

But energy is conserved. The work done on each side must be equal (ignoring friction): W = F₁ × d₁ = F₂ × d₂. Since F₂ > F₁, we must have d₂ < d₁. The large piston moves a shorter distance. The mistake was not accounting for this correctly in the energy label.

## The One Concept

Pascal's Law, formulated by Blaise Pascal in 1653, is the foundation of all hydraulic machinery. It rests on the incompressibility of liquids: when you push on one end of a sealed liquid container, the pressure pulse travels through the fluid at the speed of sound in water (about 1,480 m/s) and acts equally in all directions simultaneously. This omnidirectional pressure transmission is what makes force multiplication possible. A hydraulic jack in a car workshop typically has a small hand pump piston of area 1 cm² and a large lift cylinder of area 100 cm², giving a mechanical advantage of 100. A mechanic pumping with 200 N of force generates 20,000 N of lifting force — enough to raise a 2-tonne car. Hydraulic brakes in vehicles work identically: a small master cylinder piston driven by the brake pedal transmits pressure to large caliper pistons at each wheel. Aircraft landing gear, excavator arms, and industrial stamping presses are all Pascal's Law in action at scales from watts to megawatts. The critical insight is that you are not getting energy for free; you are trading force for distance, the same tradeoff as any other simple machine.

## The Fix

Correct the energy accounting by computing work on both sides:

```javascript
const d1 = sliderDisplacement;          // small piston travel (m)
const A1 = Math.PI * r1 * r1;           // small piston area (m²)
const A2 = Math.PI * r2 * r2;           // large piston area (m²)
const F1 = inputForce;                  // N
const P  = F1 / A1;                     // pressure rise (Pa)
const F2 = P * A2;                      // output force (N)
const d2 = (A1 / A2) * d1;             // large piston travel (m) — SMALLER
const W_in  = F1 * d1;                  // work in (J)
const W_out = F2 * d2;                  // work out (J) — must equal W_in
const energyError = Math.abs(W_out - W_in);  // should be ~0
```

Display `energyError` and confirm it rounds to zero. Now the simulation correctly shows that F₂ is large but d₂ is proportionally small, energy is conserved, and there is no free lunch.

## The Wow Moment — Push It

Build a multi-stage hydraulic amplifier: three pistons in sequence, each with area ratio 5:1. Input 1 N on the first piston; watch it cascade through three stages and output 125 N on the final piston. Then animate a hydraulic excavator arm with three independent hydraulic cylinders (boom, stick, bucket), each adjustable by on-screen sliders. Toggle a "show pressure field" overlay that colors the fluid with a heat map — uniform bright orange everywhere, demonstrating Pascal's omnidirectional transmission visually.

## The Interactive Demo

- **Small piston radius slider** (0.5–5 cm): adjusts A₁ and updates mechanical advantage live.
- **Large piston radius slider** (5–30 cm): adjusts A₂.
- **Input force slider** (1–500 N): drives the calculation.
- **Fluid viscosity toggle** (Ideal / Real): adds a 5% friction loss to W_out in real mode.
- **Show work labels toggle**: overlays W_in and W_out as animated arrows.
- **Energy conservation meter**: a horizontal bar showing W_in vs W_out, always equal.

## Production Notes

Film the two-piston animation in portrait mode for the first half so both pistons are visible top and bottom. When introducing the mechanical advantage equation, render it in large LaTeX-style text: MA = A₂/A₁ with the two piston cross-sections drawn beside each variable. Cut to a real-life stock clip of a car being lifted on a hydraulic jack for 3 seconds at the "Wow Moment" transition. The energy conservation meter should animate its bar in real time as the slider moves — this is the most important pedagogical visualization.

## Tags
`fluids` `pascals-law` `hydraulics` `pressure` `mechanical-advantage` `force` `canvas` `beginner`

## Thumbnail

Left half: a tiny cartoon hand pressing a small coin-sized piston. Right half: a massive piston holding up a cartoon car. An equals sign in the center connects them. Bold yellow text at the top: "1 FINGER LIFTS A CAR." Deep red background for the hydraulic fluid area, giving industrial drama. The size contrast between the tiny input and the huge car is the stop-scroll element.
