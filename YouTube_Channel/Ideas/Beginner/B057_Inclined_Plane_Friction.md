---
title: "Box on a Ramp: The Complete Friction Story"
id: B057
difficulty: 2/10
prereq: "B006"
concept: "On an inclined plane: N = mg·cosθ; friction f = μN; net acceleration a = g(sinθ - μcosθ)"
tags: [mechanics, friction, inclined-plane, normal-force, statics, dynamics, canvas, beginner]
category: beginner
type: video-idea
---

# Box on a Ramp: The Complete Friction Story

**Alt title:** "Why Your Box Doesn't Slide — Until It Does"
**Difficulty:** 2/10 | **Prereq:** B006

---

## Opening Hook (0:00–1:00)

A canvas animation shows a wooden box sitting on a ramp tilted at 15 degrees. The host announces: "This box is not sliding. It seems obvious — the ramp is not steep enough." They slowly increase the tilt angle — 20°, 25°, 30° — and the box still sits there. Then at exactly 34 degrees, the box begins to slide. The host freezes the animation and points out that there are two distinct friction forces at play: static friction, which held the box stationary through a range of angles, and kinetic friction, which now decelerates (or not) the sliding box. The viewer is invited to think about what determines that critical angle, what controls the speed of sliding, and why the mass of the box does not appear in either answer.

## The Naive Attempt

The viewer builds the inclined plane simulation step by step. Step one: draw the ramp as a tilted rectangle using a canvas rotation transform (`ctx.rotate(theta)`). Step two: place a box as a filled square on the ramp surface. Step three: compute gravity components naively: `F_down_ramp = mass * g * sin(theta)`, `F_normal = mass * g` — forgetting that the normal force is perpendicular to the ramp, not equal to the full weight. Step four: compute friction force as `f = mu * F_normal = mu * mass * g` (again using the full weight instead of the ramp-perpendicular component). Step five: compute net force along the ramp and animate the box. When the viewer runs the simulation, the critical angle for sliding is too small — the box starts sliding at lower angles than the physics predicts.

## The Moment of Failure

With `F_normal = mass * g` instead of `mass * g * cosθ`, the friction force is too large at low angles and the box appears more resistant to sliding than it should be, but at higher angles the gravity component overcomes the oversized friction and the box slides at a slightly wrong angle. The more visible failure is that when the ramp is tilted to exactly 45 degrees, the simulation shows the box hovering — the friction force exactly equals the gravity component — which would require μ = 1 (a perfect coefficient), but the μ slider is set to 0.6 and the simulation is still wrong. The critical angle should be `arctan(μ)` = arctan(0.6) = 31°, but the naive code predicts a different angle because F_normal was calculated incorrectly.

## Why It Broke — The Physics

On an inclined plane tilted at angle θ from horizontal, gravity acts vertically downward with magnitude mg. This force must be decomposed into two components: one parallel to the ramp surface (driving sliding) and one perpendicular to the ramp (compressed into the surface). Using basic trigonometry:

- Component parallel to ramp (down the slope): F_parallel = mg sinθ
- Component perpendicular to ramp (into the surface): F_perp = mg cosθ

The normal force N equals F_perp (since the surface is rigid and the box does not sink into it): **N = mg cosθ**. The maximum static friction force is **f_s,max = μ_s N = μ_s mg cosθ**. The box remains stationary when mg sinθ ≤ μ_s mg cosθ, which simplifies to tanθ ≤ μ_s. The critical (angle of repose) is **θ_c = arctan(μ_s)**. If sliding occurs, kinetic friction is f_k = μ_k N = μ_k mg cosθ, and net acceleration is:

**a = g(sinθ - μ_k cosθ)**

Notice that mass cancels entirely — all boxes of all masses slide at the same acceleration on the same ramp with the same friction coefficient.

## The One Concept

Friction is a contact force that opposes relative motion (or the tendency toward motion) between surfaces. There are two regimes: static friction (f_s ≤ μ_s N) prevents motion up to a maximum value; kinetic friction (f_k = μ_k N) acts during sliding and is typically slightly smaller than the maximum static value. The coefficient of friction μ is a dimensionless material property depending on both surfaces in contact. Typical values: rubber on dry concrete μ_s ≈ 0.6–0.8; wood on wood μ_s ≈ 0.3–0.5; ice on steel μ_s ≈ 0.03; Teflon on Teflon μ_s ≈ 0.04. The remarkable mass-independence of sliding acceleration (a = g(sinθ - μ_k cosθ)) means a feather and a bowling ball on the same ramp with the same surface properties slide at identical accelerations — Galileo's ramp experiments demonstrating the universality of gravity were actually measuring exactly this. The angle of repose θ_c = arctan(μ_s) is used in civil engineering to determine how steep a soil pile can be before it avalanches, in granular material design, and in determining whether a parked car is safe on a slope.

## The Fix

Correct the normal force calculation:

```javascript
const theta = rampAngle * Math.PI / 180;  // convert to radians
const N = mass * g * Math.cos(theta);     // correct normal force
const F_gravity_along_ramp = mass * g * Math.sin(theta);
const F_friction_max = mu_s * N;

const isSliding = F_gravity_along_ramp > F_friction_max;

let acceleration = 0;
if (isSliding) {
    const F_kinetic = mu_k * N;
    const F_net = F_gravity_along_ramp - F_kinetic;
    acceleration = F_net / mass;   // mass cancels but kept for clarity
}
```

Add a visual display showing N, F_parallel, F_friction as three labeled arrows on the box, all updating in real time as θ changes. The critical angle display should read `θ_c = arctan(μ_s) = ${(Math.atan(mu_s) * 180 / Math.PI).toFixed(1)}°`.

## The Wow Moment — Push It

Build a two-surface comparison: place two identical boxes side by side on the same ramp — one on a wooden surface (μ_k = 0.4) and one on an icy surface (μ_k = 0.05). Slowly increase the ramp angle. Both boxes begin sliding at different critical angles. Then race them: once sliding, the icy-surface box accelerates rapidly while the wooden-surface box barely moves. Add a "drop from rest at the top" mode where the viewer can drop 10 boxes of different masses simultaneously and verify they all arrive at the bottom at exactly the same time (mass independence).

## The Interactive Demo

- **Ramp angle slider** (0°–60°): live animation of the box, all force vectors update.
- **Static friction coefficient slider** (μ_s: 0.01–1.0): changes the critical angle display.
- **Kinetic friction coefficient slider** (μ_k: 0.01–0.9, always ≤ μ_s).
- **Box mass slider** (0.1–50 kg): show that acceleration and critical angle do not change.
- **Surface material selector**: Ice (0.03), Wood (0.4), Rubber on concrete (0.7).
- **Show force vectors toggle**: overlays N, F_parallel, and f with labels and magnitudes.

## Production Notes

Always keep the force vector diagram visible alongside the ramp animation. Use a color scheme: green for normal force, red for friction, orange for the gravity-along-ramp component. When demonstrating mass independence, animate five boxes of very different sizes sliding in perfect synchrony — this is the visual equivalent of the Galileo cannonball drop and is extremely satisfying to watch. Mark the critical angle on the ramp with a red dashed line that appears when the angle approaches θ_c.

## Tags
`mechanics` `friction` `inclined-plane` `normal-force` `statics` `dynamics` `canvas` `beginner`

## Thumbnail

A cartoon box on a ramp, on the verge of sliding. Three bold labeled arrows: blue "N" perpendicular to the ramp, red "mg sinθ" down the slope, green "friction" up the slope. The ramp angle is labeled "34°" in large numerals. Bold text overlay: "WHY DOES IT SUDDENLY SLIDE?" Orange and dark background for drama. The "about to slide" tipping point moment is the emotional hook of the thumbnail.
