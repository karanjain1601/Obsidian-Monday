---
title: "Elastic vs Inelastic vs Perfectly Inelastic: The Collision Zoo"
id: B074
difficulty: 2/10
prereq: "None"
concept: "Elastic: KE conserved, objects separate; inelastic: KE partially lost to deformation/heat; perfectly inelastic: objects stick together, maximum KE loss consistent with momentum conservation"
tags: [mechanics, collisions, elastic, inelastic, kinetic-energy, momentum-conservation, canvas, beginner]
category: beginner
type: video-idea
---

# Elastic vs Inelastic vs Perfectly Inelastic: The Collision Zoo

**Alt title:** "Why Billiard Balls Bounce But Clay Lumps Don't — Collision Physics Explained"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The video opens with three side-by-side slow-motion collision clips, each running simultaneously. Left: two steel ball bearings collide — the incoming ball stops dead, the stationary one flies off at the same speed. Middle: a metal ball hits a lump of clay — the ball embeds in the clay and they slide off together, slower. Right: a car crash test where two vehicles crumple together on impact. The host pauses all three clips and asks: "All three of these obey the same conservation law — momentum is conserved in every single one. But something very different is happening to energy. In the first, not a single joule was lost. In the last, thousands of joules vanished into heat and noise and bent metal." The hook ends on a live canvas simulation showing three boxes labeled ELASTIC, INELASTIC, and PERFECTLY INELASTIC, each running simultaneously with the same initial conditions — and three different outcomes playing out at once. The viewer can immediately see that the elastic case has fast bouncing, the perfectly inelastic case has slow combined sliding, and the inelastic case is somewhere in between.

## The Naive Attempt

The viewer starts with a simple one-dimensional collision: two boxes, mass m₁ = m₂ = 1 kg, Box 1 moving at 4 m/s, Box 2 stationary. The naive first attempt makes Box 1 simply stop on contact and sets Box 2 velocity to Box 1's initial velocity:

```javascript
// "Transfer" model — beginner guess
if (collision detected) {
  v2 = v1; // box 2 gets all the speed
  v1 = 0;  // box 1 stops
}
```

This works perfectly for equal-mass elastic collisions — it's actually correct in that specific case. The host runs it and says "this looks right!" Then the host changes m₁ = 2 kg, m₂ = 1 kg and runs again. Box 1 stops, Box 2 gets 4 m/s. But momentum was 2×4 = 8 kg·m/s before and 1×4 = 4 kg·m/s after — momentum is not conserved. The naive model only works by coincidence for equal masses.

## The Moment of Failure

The host changes masses to m₁ = 3 kg, m₂ = 1 kg, v₁ = 4 m/s, v₂ = 0. Running the naive model: Box 1 stops, Box 2 flies off at 4 m/s. Momentum before: 12 kg·m/s. Momentum after: 4 kg·m/s. An 8 kg·m/s deficit — momentum was created from nothing in reverse, then vanished. The host displays a momentum meter bar on screen that starts at 12, then drops to 4 at the moment of collision. The visual glitch is a sudden drop in the momentum readout — a discontinuous jump in a quantity that should be continuous. This makes the error unmistakable. The host also points out that Box 1 stops and Box 2 moves slower than Box 1 was going — which means Box 2 would never escape Box 1, violating causality. The simulation is obviously wrong.

## Why It Broke — The Physics

Conservation of momentum must hold in all collisions (assuming no external forces): **m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'**. This gives one equation with two unknowns (v₁' and v₂'). A second equation is needed, and this is where collision type determines the outcome:

- **Elastic collision**: kinetic energy is also conserved: ½m₁v₁² + ½m₂v₂² = ½m₁v₁'² + ½m₂v₂'². Solving both equations simultaneously gives the exact post-collision velocities.
- **Perfectly inelastic collision**: objects stick together, so v₁' = v₂' = V (common final velocity). Then momentum conservation gives V = (m₁v₁ + m₂v₂)/(m₁ + m₂). Only one equation needed.
- **Inelastic collision**: KE is partially lost; a coefficient of restitution e (0 < e < 1) relates relative velocities: v₂' − v₁' = e(v₁ − v₂). For elastic, e = 1; for perfectly inelastic, e = 0.

## The One Concept

Collisions are classified by what happens to kinetic energy, not momentum. Momentum is always conserved in isolated collisions — it is a fundamental consequence of Newton's Third Law and is non-negotiable. Kinetic energy, however, is only one form of energy, and it can be converted to other forms during a collision.

In an **elastic collision**, kinetic energy is perfectly conserved. No energy is lost to heat, sound, or deformation. This is an idealization: true elastic collisions occur only at the atomic/subatomic level (billiard balls are approximately elastic at low speeds). The elastic collision formulas for a 1D, two-body case are:

v₁' = ((m₁ − m₂)v₁ + 2m₂v₂) / (m₁ + m₂)  
v₂' = ((m₂ − m₁)v₂ + 2m₁v₁) / (m₁ + m₂)

These equations reveal rich behavior: equal masses completely exchange velocities; a very heavy object hitting a light stationary one barely slows down while the light one gets launched at nearly double the heavy one's speed; a light object bouncing off a stationary heavy one reverses direction at nearly the same speed.

In an **inelastic collision**, kinetic energy is partially lost. Most real-world collisions are inelastic. The lost kinetic energy goes into deformation of materials, heat generated by friction at contact surfaces, sound waves, and internal vibrations. The coefficient of restitution e captures how much of the relative approach velocity is recovered as relative separation velocity: e = (v₂' − v₁') / (v₁ − v₂). For a tennis ball bouncing on concrete, e ≈ 0.85; for a rubber ball, e ≈ 0.90; for a beanbag, e ≈ 0.05.

In a **perfectly inelastic collision**, the objects stick together and move as one after the collision. This maximizes kinetic energy loss while still conserving momentum. The lost kinetic energy is ΔKE = ½·(m₁m₂/(m₁+m₂))·(v₁−v₂)², which is always positive — you can prove that a perfectly inelastic collision always loses more energy than any other collision type between the same objects. Real-world examples: a bullet embedding in a wooden block, two railcars coupling on a track, colliding clay lumps, football tackles, and many vehicle crashes.

## The Fix

Implement all three collision types with proper formulas:

```javascript
function resolveCollision(type, m1, m2, v1, v2, e = 1.0) {
  if (type === 'perfectly_inelastic') {
    const V = (m1 * v1 + m2 * v2) / (m1 + m2);
    return { v1: V, v2: V };
  }
  if (type === 'elastic') {
    const v1_new = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    const v2_new = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
    return { v1: v1_new, v2: v2_new };
  }
  if (type === 'inelastic') {
    // Coefficient of restitution e (0 < e < 1)
    const v1_new = (m1*v1 + m2*v2 - m2*e*(v1-v2)) / (m1+m2);
    const v2_new = (m1*v1 + m2*v2 + m1*e*(v1-v2)) / (m1+m2);
    return { v1: v1_new, v2: v2_new };
  }
}
```

The momentum meter now stays perfectly flat through all collision events, and the KE meter shows the appropriate drop for inelastic and perfectly inelastic types.

## The Wow Moment — Push It

The host builds a Newton's cradle simulation with five balls: elastic collisions only. Drag the leftmost ball back and release — one ball pops out the other side. Pull two back — two pop out the other side. Pull three — three pop out. The simulation respects both conservation laws exactly, producing the famous Newton's cradle behavior. Then the host changes the coefficient of restitution from 1.0 to 0.7: the cradle begins to lose energy and the oscillations decay in amplitude over time, eventually all five balls hanging still. Then to e = 0.0 (perfectly inelastic): all five slam together and stay as a clump. The progression from perfect bouncing to dead stop by sliding e from 1.0 to 0.0 is the wow visual.

## The Interactive Demo

- **Mass 1 slider** — 0.1 to 10 kg (default 1 kg)
- **Mass 2 slider** — 0.1 to 10 kg (default 1 kg)
- **Initial velocity 1 slider** — −10 to 10 m/s (default 4 m/s)
- **Initial velocity 2 slider** — −10 to 10 m/s (default 0 m/s)
- **Collision type dropdown** — Elastic / Inelastic / Perfectly Inelastic
- **Coefficient of restitution slider** — 0.0 to 1.0 (only active in Inelastic mode)
- **Show KE readout** — live display of KE_before, KE_after, and ΔKE (energy lost)
- **Show momentum readout** — live p_total before and after collision to confirm conservation
- **Newton's Cradle mode button** — switches to 5-ball cradle with adjustable e

## Production Notes

Open with the three simultaneous collision clips side by side, synced to the same music beat. Switch to the code editor at 1:00. Build the three collision type buttons prominently in the UI — use green for elastic, yellow for inelastic, red for perfectly inelastic. When showing the momentum meter, animate the bar in real time. For the elastic formula zoom: write the formula on screen as the host says each term aloud. For the Newton's cradle wow moment, make the balls metallic-looking with a reflection highlight; add a subtle "click" sound on each elastic collision. Use a slow-motion effect on the five-ball elastic exchange to let the viewer see the momentary gap between balls 4 and 5.

## Tags
`mechanics` `collisions` `elastic` `inelastic` `kinetic-energy` `momentum-conservation` `canvas` `beginner`

## Thumbnail

Side-by-side collision panels: LEFT — two shiny metal balls labeled "ELASTIC" with an arrow showing clean separation and equal speeds; RIGHT — two clay lumps labeled "PERFECTLY INELASTIC" stuck together with cracks. Bold text across the top: **"THE COLLISION ZOO."** A KE meter bar at the bottom showing FULL (green) for elastic and EMPTY (red) for inelastic. The contrasting visual of bouncing vs. sticking is the stop-scroll element.
