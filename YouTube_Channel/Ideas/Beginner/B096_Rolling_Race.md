---
title: "Which Shape Rolls Fastest Down a Hill? (Moment of Inertia Zoo)"
id: B096
difficulty: 2/10
prereq: "B029"
concept: "a = g·sinθ/(1+I/mr²); lower I/mr² means more energy goes to translation; solid sphere always beats disk which always beats ring, regardless of mass or radius"
tags: [mechanics, moment-of-inertia, rolling, rotational-energy, angular-momentum, inclined-plane, canvas, beginner]
category: beginner
type: video-idea
---

# Which Shape Rolls Fastest Down a Hill? (Moment of Inertia Zoo)

**Alt title:** "Mass and Size Don't Matter — Only Shape Decides the Winner"
**Difficulty:** 2/10 | **Prereq:** B029

---

## Opening Hook (0:00–1:00)

Four objects sit at the top of an inclined plane: a solid steel ball, a solid wooden disk, a thin metal ring, and a hollow spherical shell. They are all the same mass. They are all the same outer radius. The host holds up a hand: "Ready… go." All four are released simultaneously. The solid ball surges ahead immediately. The disk is second. The hollow shell is third. The ring comes in dead last — more than two seconds behind the ball. The host catches the ball at the bottom and turns to camera: "It does not matter what these objects are made of. It does not matter that they are the same mass. The only thing that determined the order of arrival is a number called the moment of inertia — specifically, how that moment of inertia compares to mass times radius squared. And once you know that one ratio, you can predict the outcome of any rolling race, for any objects, on any hill, without knowing mass, radius, or material at all."

## The Naive Attempt

The viewer creates a canvas with an inclined rectangle (the ramp) and four colored circles of equal size representing the four objects, stacked at the top. Step one: give each object a downhill acceleration using the component of gravity along the slope: `a = g * Math.sin(theta)`. All four objects accelerate identically. Step two: let the simulation run — all four balls roll down and hit the bottom at exactly the same time, like Galileo's falling objects, ignoring rotation. The host lets this run for five seconds and notes: "This is the frictionless sliding model. It's right for ice on ice with no friction — but the moment any object rolls without slipping, it has to spend some energy spinning itself up. And different shapes spin up at different costs." The viewer watches all four objects arrive simultaneously and sees immediately that the simulation is missing something fundamental.

## The Moment of Failure

All four objects hit the bottom line at exactly the same frame. The race is a dead heat. The host displays the equation used: `a = g·sinθ = 4.9 m/s²` for a 30° ramp. "But the real solid sphere hits the bottom in 1.4 seconds, and the ring hits in 1.7 seconds. Our simulation says 1.2 seconds for both — fast and equal. We've ignored rotational kinetic energy entirely." The failure is visually unambiguous: in real life, you can place a can of soup and a can of juice on any ramp and see them arrive at different times, purely because one is solid and one is liquid (and thus cannot rotate with the can). The simulation's flaw is not a coding error — it is a physics omission. Without including the rotational kinetic energy in the energy budget, the rolling race is just a sliding race, and all shapes behave identically.

## Why It Broke — The Physics

For a rolling-without-slipping object, total kinetic energy has two contributions:

**KE = ½mv² + ½Iω²**

With the rolling constraint ω = v/r, this becomes:

**KE = ½mv²(1 + I/mr²)**

By conservation of energy (potential energy converts to total kinetic energy):

**mgh = ½mv²(1 + I/mr²)**

Solving for v at the bottom and differentiating for acceleration:

**a = g·sinθ / (1 + I/mr²)**

The shape factor I/mr² determines everything. For a solid sphere: I = 2mr²/5, so I/mr² = 2/5 = 0.4, giving a = g·sinθ/1.4. For a solid disk: I = mr²/2, ratio = 0.5, a = g·sinθ/1.5. For a hollow sphere: I = 2mr²/3, ratio = 2/3 ≈ 0.667, a = g·sinθ/1.667. For a thin ring: I = mr², ratio = 1, a = g·sinθ/2. The solid sphere always wins because it has the lowest shape factor — its mass is concentrated near the center.

## The One Concept

The moment of inertia is a measure of how resistant a body is to rotational acceleration — its "rotational mass." The crucial quantity for rolling races is the dimensionless ratio I/mr², which measures what fraction of the object's kinetic energy must go into rotation when it rolls at a given speed. A solid sphere has I/mr² = 0.4 because most of its mass is near the center, where it has a short moment arm and thus a small rotational contribution. A thin ring has I/mr² = 1 because all its mass is at the maximum radius — every gram is spinning as fast as possible, consuming maximum rotational energy. The remarkable result is that mass and radius cancel completely from the acceleration formula — the race outcome depends only on the shape, not the size or material. You can race a bowling ball against a ball bearing of the same shape: same outcome, every time. This principle has profound engineering consequences. Flywheel energy storage maximizes I/mr² (use a ring) to store maximum rotational energy per unit mass. Bicycle wheels use thin rims (ring-like) to maximize spin energy storage and thus smooth pedaling cadence. Rolling element bearings use balls (solid sphere) to minimize rotational friction losses. High-performance engine crankshafts are lightened near the rim to reduce I and allow faster acceleration.

## The Fix

Replace the uniform acceleration with the shape-corrected formula for each object, using their known I/mr² ratios.

```javascript
const objects = [
  { name: "Solid Sphere",  color: "#4FC3F7", I_ratio: 2/5 },
  { name: "Solid Disk",    color: "#81C784", I_ratio: 1/2 },
  { name: "Hollow Sphere", color: "#FFB74D", I_ratio: 2/3 },
  { name: "Thin Ring",     color: "#E57373", I_ratio: 1   }
];

const g = 9.81;
const theta = Math.PI / 6; // 30 degrees

objects.forEach(obj => {
  const a = (g * Math.sin(theta)) / (1 + obj.I_ratio);
  obj.velocity += a * dt;
  obj.position += obj.velocity * dt;
});
```

Now the four circles cascade down the ramp in distinct lanes, separating visibly frame by frame. By the time the sphere arrives at the bottom, the ring is still halfway up. The race is immediately comprehensible and satisfying.

## The Wow Moment — Push It

The host reveals a fifth competitor: a filled cylinder of water — a liquid that cannot rotate with the container. Because the fluid slips inside the can, the effective I/mr² is zero, and the can slides down like a frictionless block: a = g·sinθ. The can of water beats the solid sphere. The host produces a real-world demonstration concept: two identical soup cans, one full of solid material (concrete), one full of liquid. The liquid can always wins. The host then builds a "custom shape" slider where the viewer designs an arbitrary annular disk (inner radius r₁, outer radius r₂) and the simulator computes I/mr² = (r₁² + r₂²)/(2r₂²) and places that shape in the race — showing the full continuum between solid disk (r₁=0) and ring (r₁=r₂).

## The Interactive Demo

- **Ramp angle slider** (5° to 70°): changes the angle; demonstrates that changing angle changes all accelerations but never changes the finish order — the ranking is invariant
- **Custom shape creator**: two sliders for inner radius and outer radius of an annular disk, updating I/mr² in real time and inserting the new shape into the race
- **Mass slider** (0.1 to 10 kg): demonstrates that changing mass has zero effect on the outcome — the mass cancels in the formula
- **Add friction toggle**: introduces rolling friction that slightly changes the effective acceleration; at high friction, lighter objects are slightly penalized
- **Finish line time display**: shows the exact elapsed time for each object to reach the bottom, sorted as a leaderboard that updates in real time

## Production Notes

Use distinct lane-separated tracks for each object so their positions are unambiguous at all times. Draw each object as a circle with a visible spoke or marker on the rim so the viewer can see it actually rotating as it rolls (ω = v/r from the rolling constraint, drawn as a rotating radius line). Display each object's I/mr² ratio prominently next to its name throughout the simulation. During the derivation, show the energy bar chart split into translational and rotational energy for each object, updating in real time as they roll.

## Tags

`mechanics` `moment-of-inertia` `rolling` `rotational-energy` `angular-momentum` `inclined-plane` `canvas` `beginner`

## Thumbnail

Four colored balls in a clear racing lane on a 30° inclined ramp. The solid blue ball is at the bottom, clearly winning. The red ring is still near the top. The other two are strung out in between. Bold white text overlay: "SAME MASS. SAME RADIUS. ONE ALWAYS WINS." A leaderboard panel on the right lists the shapes with their I/mr² values. The thumbnail poses an irresistible question: which shape wins and why?
