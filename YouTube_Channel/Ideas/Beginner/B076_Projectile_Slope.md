---
title: "Firing Up and Down a Hill Changes Everything"
id: B076
difficulty: 2.5/10
prereq: "None"
concept: "For projectile fired at angle α on a slope at angle β: optimal launch angle = (90°+β)/2 (not 45°); range formula modified by slope geometry; downhill shots have longer range"
tags: [kinematics, projectile-motion, inclined-plane, range, optimal-angle, trajectory, canvas, beginner]
category: beginner
type: video-idea
---

# Firing Up and Down a Hill Changes Everything

**Alt title:** "Why 45° Is Wrong When You're on a Slope"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The video opens on a mountain artillery cannon from World War I, aimed up a steep Alpine slope. A historical photograph fills the screen. The host says: "The engineers who operated this gun knew something that most physics students get wrong. Firing uphill with a 45-degree angle — the textbook 'optimal' angle — would have landed the shell far short of the enemy. To hit a target on a slope, you must aim at a completely different angle. The formula changes. The physics gets more interesting." Cut immediately to a canvas simulation: a cannon sits at the base of a hill tilted 30° upward. The host drags the launch angle slider, and the trajectory arc updates in real time. At 45°, the projectile hits the hillside well before reaching the top. The host drags to 60° — it goes much farther up the slope. "Why? Today you're going to derive the actual optimal angle, code the simulation, and discover that going downhill gives you an absurd range advantage." The hook ends on a side-by-side of uphill vs. downhill trajectories at the same speed — the downhill shot arcs vastly farther.

## The Naive Attempt

The viewer sets up a standard flat-ground projectile simulation. A ball launches with speed v₀ = 30 m/s at angle α. The standard equations are:

```javascript
let x = 0, y = 0;
let vx = v0 * Math.cos(alpha);
let vy = v0 * Math.sin(alpha);

function update() {
  vx += 0;       // no horizontal acceleration
  vy -= g * dt;  // gravity
  x += vx * dt;
  y += vy * dt;
  if (y <= 0) { /* landed! */ }
}
```

The viewer confirms the flat-ground case: at α = 45°, range is maximized. The range formula is R = v₀²sin(2α)/g and peaks at exactly 45°. The viewer adds a slope to the canvas — just a diagonal line at angle β = 30° — but keeps the landing detection as `y <= 0`. Running the simulation: the ball sails over the slope and hits the imaginary flat ground below the slope. The trajectory looks wrong visually — the ball flies through the hillside and lands underground.

## The Moment of Failure

The host changes the landing condition to detect when the ball hits the slope surface instead of y = 0. Now the ball lands much earlier than the simulation predicts using the flat-ground range formula. The host fires at α = 45° and measures the range along the slope — far shorter than expected. He tries α = 50°, then 55° — the range keeps increasing. He reaches 60°, and the range is now longer than at 45°. "The optimal angle is NOT 45° anymore. Where did that formula come from, and why does it break?" The on-screen range label clearly shows R(45°) < R(60°) for a 30° uphill slope — visually obvious and immediately counterintuitive.

## Why It Broke — The Physics

On flat ground, the projectile must travel horizontally until y returns to its starting height. But on a slope at angle β, the landing point is not at y = 0 — it is further along the slope, which is elevated above flat ground. The landing condition changes. The effective "range" is now the distance along the slope surface from launch to landing, and the problem geometry becomes a triangle with the slope as one side.

Setting up the inclined coordinates: let the slope make angle β with the horizontal. The ball lands when y = x·tan(β) (on the slope surface). Substituting the parametric equations x = v₀cosα·t and y = v₀sinα·t − ½gt² into the slope condition and solving for t gives:

**t_land = 2v₀sin(α − β) / (g·cosβ)**

The range along the slope is R = x/cosβ, which after substitution gives:

**R = (2v₀²cosα·sin(α − β)) / (g·cos²β)**

To maximize R with respect to α, differentiate and set to zero. The calculus yields the optimal angle:

**α_optimal = (π/2 + β) / 2 = 45° + β/2**

For β = 0 (flat ground): α_opt = 45°. For β = 30° (uphill): α_opt = 60°. For β = −30° (downhill): α_opt = 30°. The formula shifts the optimal angle by half the slope angle — always toward the vertical for uphill, toward the horizontal for downhill.

## The One Concept

The classic "45° is optimal" result applies only on flat, horizontal ground. This is because on flat ground, by symmetry, the time of flight and the horizontal range are optimized at exactly 45° — where the equal split between horizontal and vertical velocity components maximizes the product vₓ × t_flight. On an inclined surface, this symmetry is broken. The slope changes where the projectile must land, which changes both the time of flight and the effective horizontal distance simultaneously.

The intuitive way to understand the shift: firing uphill, gravity is working against you harder in the direction along the slope. To maximize range along the slope, you need more vertical launch component to fight gravity and extend time aloft. Hence the optimal angle shifts upward beyond 45°. Firing downhill, gravity assists you along the slope direction — you need less vertical component and can afford more horizontal throw. Hence the optimal angle drops below 45°.

This has profound practical consequences. Artillery crews on slopes must adjust their elevation tables. Ski jumpers launching off a ramp (effectively a positive slope β) must aim steeper than 45° relative to horizontal to maximize distance. Golf courses on hillsides require different club selection and swing angle. Long-range mountain warfare in WWI and WWII required specially computed firing tables for every specific slope angle, which consumed enormous engineering effort before ballistic computers existed.

The downhill range advantage is also quantified by the formula: since cos²β appears in the denominator and it decreases as |β| increases, the range is always larger on a slope than on flat ground for the same launch speed — uphill or downhill — because you can exploit either extended flight time (downhill) or reach a target that flat ground cannot. For β = −30° (downhill), a cannon achieves roughly 15% more range than on flat ground at the same muzzle speed.

## The Fix

Replace the flat landing condition with a slope landing condition and add the optimal angle calculator:

```javascript
const beta = slopeAngle * Math.PI / 180; // slope in radians
const alpha_optimal = (Math.PI / 2 + beta) / 2; // in radians

// Landing detection on slope surface
function onSlope(x, y) {
  // Slope line: y = tan(beta) * x
  return y <= Math.tan(beta) * x;
}

// Range formula for display
function rangeOnSlope(alpha) {
  const num = 2 * v0 * v0 * Math.cos(alpha) * Math.sin(alpha - beta);
  const den = g * Math.cos(beta) * Math.cos(beta);
  return num / den;
}

// Display optimal angle
ctx.fillText(`Optimal angle: ${(alpha_optimal * 180/Math.PI).toFixed(1)}°`, 10, 30);
ctx.fillText(`Current range: ${rangeOnSlope(currentAlpha).toFixed(1)} m`, 10, 60);
```

The simulation now highlights the optimal angle with a gold dashed line. The range-vs-angle curve is plotted below, showing the peak shifting from 45° to the correct α_opt.

## The Wow Moment — Push It

The host builds a full interactive range-vs-angle polar plot for different slope angles. The plot shows five curves simultaneously: β = −45°, −30°, 0°, +30°, +45°. Each curve is a lobe of the range function plotted in polar coordinates, showing how the optimal direction and maximum range change with slope. The downhill lobes are much larger and tilted toward the horizontal; the uphill lobes are smaller and tilted toward the vertical. Then the host adds wind as a third variable — a horizontal wind speed from −10 to +10 m/s — and the optimal angle shifts again, now in 3D parameter space. The final demo allows the viewer to pick a target on the slope (click to set) and watch the simulation automatically compute and display the optimal launch angle to hit it precisely.

## The Interactive Demo

- **Launch speed slider** — 10 to 100 m/s (default 30 m/s)
- **Launch angle slider** — 0° to 90° (default 45°); arc updates in real time
- **Slope angle slider** — −60° to +60° (default 0°, flat); positive = uphill
- **Show optimal angle button** — draws a gold dashed trajectory at α_opt and displays the formula result
- **Show range vs. angle plot** — below the main canvas, plots R(α) for the current slope, with peak highlighted
- **Wind speed slider** — −10 to +10 m/s; shifts the optimal angle
- **Click-to-target mode** — click anywhere on the slope to set a target; simulation computes the required α

## Production Notes

Open with the historical artillery photograph, then fade to the canvas. The slope slider is the key interactive element — when the slope is changed, immediately animate both the terrain redrawing and the optimal angle marker moving to its new position. Use color coding: launch trajectories in blue, optimal trajectory in gold. When explaining the formula α_opt = (90° + β)/2, write it on screen incrementally — first show the flat-ground case (β=0, α=45°), then introduce β, then show the formula emerging. For the polar plot wow segment, use five distinct colors for the five curves and add a legend. Zoom in on the crossover point where downhill curves overtake flat-ground range.

## Tags
`kinematics` `projectile-motion` `inclined-plane` `range` `optimal-angle` `trajectory` `canvas` `beginner`

## Thumbnail

A cannon on a hillside (30° slope) with two trajectory arcs: a short red arc labeled "45° (WRONG)" that hits the hillside partway up, and a longer gold arc labeled "60° (CORRECT)" that clears the hill. Text overlay: **"45° IS WRONG HERE."** Below in white: "The real optimal angle formula." Dramatic mountain backdrop. The red X on the short arc and gold checkmark on the long arc provide instant visual understanding.
