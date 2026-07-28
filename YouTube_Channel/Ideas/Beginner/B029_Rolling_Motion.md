---
title: "Why a Ball Rolls Slower Than It Slides Down a Hill"
id: B029
difficulty: 2/10
prereq: "B004"
concept: "Rolling without slipping: v_cm = ωr; total KE = ½mv²(1+β) where β = I/mr²"
tags: [physics, rolling-motion, moment-of-inertia, rotational-kinematics, energy, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why a Ball Rolls Slower Than It Slides Down a Hill

**Alt title:** The Ramp Race That Proves Shape Matters More Than Mass
**Difficulty:** 2/10 | **Prereq:** B004

---

## Opening Hook (0:00–1:00)

Set up a physical race: a solid steel ball bearing, a hollow steel ball, and a steel cylinder, all the same diameter, lined up at the top of a ramp. Press pause. Ask the audience: "Which one reaches the bottom first?" Take audience guesses: "The heaviest one!" "The solid one!" "They all tie!" Answer: they all have identical mass. Now drop the answer — the solid ball wins. The hollow ball is last. The cylinder is in the middle. Every time. Mass is irrelevant. This seems to violate intuition — if they're the same size and weight, why does shape matter?

Now run the actual race. The solid ball pulls ahead almost immediately, accelerating faster. The cylinder is slightly behind. The hollow ball, despite looking identical, lags noticeably and arrives last by a clear margin. Stop at the bottom and say: "The winner was determined before the race started — determined by a single number: the moment of inertia. And the reason rolling is slower than sliding at all comes down to where the kinetic energy goes."

Show a frictionless slide version: remove friction entirely, make all three objects slide (not roll). Now they all accelerate at exactly the same rate (g·sin(θ)) regardless of shape or mass — they tie. Turn friction back on so they roll instead of slide. Now shape matters again. The difference between sliding and rolling is that rolling stores energy in rotation — and how much rotation energy is needed depends on the moment of inertia, which depends on shape. Say: "Let's code this."

## The Naive Attempt

Simulate an inclined plane race using only translational mechanics. Define the ramp with angle θ. Apply Newton's second law in the direction along the ramp: net force = M·g·sin(θ) − friction. Since friction for rolling without slipping is F_f = μ·M·g·cos(θ), the naive approach computes:

```javascript
function computeAcceleration(mass, angle, mu) {
  const g = 9.81;
  const F_gravity_along = mass * g * Math.sin(angle);
  const F_friction = mu * mass * g * Math.cos(angle);
  const netForce = F_gravity_along - F_friction;
  return netForce / mass; // same for all masses!
}
```

Note that `mass` cancels in `netForce / mass` — every object has the same acceleration, regardless of mass. This is correct for sliding without friction or for frictionless objects, but wrong for rolling. The code doesn't account for how friction actually works in rolling motion — static friction in rolling without slipping does not dissipate energy (it does no work on the contact point since the contact point has zero velocity) but it does provide the torque that drives rotation. By ignoring the rotational degree of freedom entirely, the model treats the ball as if it were sliding frictionlessly regardless of what the friction coefficient is.

Run the simulation with three objects (labeled "Solid Ball," "Hollow Ball," "Cylinder"). Set their masses all equal to 1 kg. All three reach the bottom at the same time with the same final velocity. The race is a perfect tie. Show this explicitly with a timer and a finish line display — three identical trajectories superimposed.

## The Moment of Failure

Three balls, identical trajectories, identical finish times. Display their final velocities: all three show v_final = √(2·g·h·sin(θ)) — the standard sliding-on-frictionless-ramp result. Now show what happens in a real experiment (use footage or pre-recorded simulation with correct physics): the three objects clearly do not arrive together. The solid sphere is measurably ahead. The failure of the naive model is not subtle — it predicts the wrong winner by predicting a three-way tie where there are actually clear differences.

Compute the energy budget in the naive model: 100% of potential energy goes to translational kinetic energy (½mv²). None goes to rotation. But a real rolling ball very obviously rotates — you can see it spinning. Where is the rotational kinetic energy coming from in the naive model? It isn't — because the naive model ignores rotation entirely. The ball is spinning at ω = v/r in reality, carrying kinetic energy ½Iω². The naive model discards this energy, which is why it predicts the incorrect (too-high) final velocity and (too-short) finish time. The simulation is conserving the wrong energy.

Show the energy tracking: in naive model, 100% of ΔPE → translational KE. In correct physics, some ΔPE → translational KE, some → rotational KE. The fraction going to rotation depends on I/mr². This is why shape matters — different shapes have different I, different energy splits, different final speeds.

## Why It Broke — The Physics

For rolling without slipping, the contact point between the rolling object and the surface is instantaneously at rest — no sliding occurs. The linear velocity of the center of mass and the angular velocity of rolling are related by the no-slip constraint:

**v_cm = ω · r**

where r is the radius and ω is the angular velocity. The total kinetic energy is the sum of translational and rotational:

**KE_total = ½mv² + ½Iω² = ½mv² + ½(βmr²)(v/r)² = ½mv²(1 + β)**

where β = I/(mr²) is the normalized moment of inertia. Values of β:
- Solid cylinder: I = ½mr², β = 1/2
- Solid sphere: I = 2/5·mr², β = 2/5
- Hollow sphere (thin shell): I = 2/3·mr², β = 2/3
- Hollow cylinder (thin-walled tube): I = mr², β = 1
- Point mass (all mass at rim, like a ring): I = mr², β = 1

Energy conservation for rolling down a ramp of height h:
**mgh = ½mv²(1 + β)**
**v_final = √(2gh / (1 + β))**

The object with the smallest β reaches the highest final speed. Solid sphere (β = 2/5 = 0.4) wins; hollow sphere (β = 2/3 ≈ 0.667) loses. Both beat a sliding object with extreme friction that doesn't roll — and both lose to a frictionless sliding object (β = 0, all energy translational).

The acceleration down the ramp:
**a = g·sin(θ) / (1 + β)**

Mass cancels completely — the race result is entirely determined by shape (through β), not mass. This is the heart of the video.

## The One Concept

Rolling without slipping divides gravitational potential energy into translational kinetic energy (½mv²) and rotational kinetic energy (½Iω²). Objects with more mass concentrated at the rim (higher moment of inertia, higher β) allocate a larger fraction of energy to rotation, leaving less for translation — they roll slower. The race result is purely a function of shape because mass cancels from the acceleration formula. The moment of inertia β = I/(mr²) is the only relevant property.

**Physical intuition:** Imagine the difference between a thin ring (all mass at the rim) and a solid disk (mass distributed throughout). To spin the ring at the same angular velocity as the disk, you need more torque — the ring's mass is far from the center, so it has a larger angular inertia. When the ring rolls, a larger fraction of its energy goes into fighting this rotational inertia, leaving less for forward motion. The solid disk spins easily (mass close to center), so less energy is "wasted" on rotation and more goes to translation.

**Key equations:** v_final = √(2gh/(1+β)); a = g·sin(θ)/(1+β); where β = I/(mr²). No-slip constraint: v_cm = ωr.

**Real-world examples:**
1. **Bowling ball vs. basketball:** Same size but different mass distributions. A filled bowling ball (β ≈ 2/5) rolls faster down a ramp than a hollow basketball (β ≈ 2/3) of the same radius.
2. **Tire rolling resistance:** The moment of inertia of a tire (hollow cylindrical shell plus tread) determines how much rotational kinetic energy must be supplied during acceleration. Lighter wheels with lower β improve fuel economy — hence the value of lightweight alloy rims vs. heavy steel rims.
3. **Gyroscope and precession:** Flywheel energy storage systems (flywheels in formula 1 KERS) store energy in rotational KE. High β, high speed flywheel → maximum energy storage per unit mass.
4. **Yo-yo physics:** A yo-yo is a rolling object where gravity does both translational and rotational work. It accelerates at a = g/(1+I/mr²) — always slower than free fall. The yo-yo's slow descent is because most PE goes to rotation.

## The Fix

Correct the acceleration formula to include the rotational contribution. For each rolling object, specify its moment of inertia factor β = I/(mr²):

```javascript
const objects = [
  { name: "Solid Sphere",   beta: 2/5,  color: "#ff4444", mass: 1, radius: 0.05 },
  { name: "Solid Cylinder", beta: 1/2,  color: "#44ff44", mass: 1, radius: 0.05 },
  { name: "Hollow Sphere",  beta: 2/3,  color: "#4444ff", mass: 1, radius: 0.05 },
  { name: "Hollow Cylinder",beta: 1,    color: "#ffff44", mass: 1, radius: 0.05 },
];

const g = 9.81;
const theta = 30 * Math.PI / 180; // 30° ramp

for (const obj of objects) {
  // Corrected rolling acceleration
  obj.acceleration = (g * Math.sin(theta)) / (1 + obj.beta);
  
  // Friction must be sufficient for rolling without slipping
  // Minimum mu_s required: mu_s >= (beta * tan(theta)) / (1 + beta)
  const muRequired = (obj.beta * Math.tan(theta)) / (1 + obj.beta);
  obj.isRolling = (mu >= muRequired);
}

// Update positions
for (const obj of objects) {
  if (obj.isRolling) {
    obj.velocity += obj.acceleration * dt;
  } else {
    // Skidding — separate translational and rotational equations
    obj.velocity += (g * Math.sin(theta) - mu_k * g * Math.cos(theta)) * dt;
    obj.omega += (mu_k * g * Math.cos(theta) * obj.radius) / (obj.beta * obj.mass * obj.radius**2) * dt;
  }
  obj.x += obj.velocity * dt;
  obj.angle += (obj.velocity / obj.radius) * dt; // visual rotation
}
```

Now the solid sphere accelerates at (5/7)g·sin(θ), the cylinder at (2/3)g·sin(θ), and the hollow sphere at (3/5)g·sin(θ). The solid sphere wins. Run the race — the ordering is immediately clear and matches real experiments.

Add energy tracking bars for each object: show translational KE (green bar) and rotational KE (blue bar) side by side. At the bottom of the ramp, the solid sphere has 29% rotational and 71% translational; the hollow sphere has 40% rotational and 60% translational. The energy budget makes the physics viscerally clear.

## The Wow Moment — Push It

Race 10 distinct objects simultaneously: a solid sphere, solid cylinder, hollow sphere, hollow cylinder, a coin (solid disk, β = 1/2), a thick-walled tube (β ≈ 0.6, intermediate), an ice-hockey puck (β ≈ 1/2), a wooden ball, a bowling ball, and a ping-pong ball. Each has its β calculated and displayed. The finish line shows them arriving in strict β-order — the first to finish is the one with the lowest β (solid sphere), the last is the one with the highest β (hollow cylinder). Mass plays no role — a 5 kg bowling ball and a 5 g ping-pong ball with the same shape (solid sphere) finish at exactly the same time.

Then break the rolling without slipping condition: set the ramp angle to 60° with low friction (μ = 0.1). Compute whether rolling is maintained: for a solid sphere, rolling requires μ ≥ (2/5)·tan(60°)·(1/(1+2/5)) = 0.27. But μ = 0.1 < 0.27, so the ball skids. Watch the ball both sliding forward and spinning, but faster than rolling would require — the spin is insufficient for the slip velocity at the contact point. Over time, friction torque acts to spin the ball up until ω·r = v_cm (the rolling condition is re-established). This transition from skidding to rolling is a fascinating sub-phenomenon. Show it explicitly: a bowling ball thrown with forward velocity but no spin — it slides on the lane, friction gradually adds spin until it grips and rolls cleanly. This is exactly what happens in bowling — the lane's friction coefficient determines how much "skid" before the ball rolls.

## The Interactive Demo

Interactive ramp-race browser simulation with full energy visualization and skidding physics.

**Controls:**
- **Object shape selector:** Check boxes for Solid Sphere, Solid Cylinder, Hollow Sphere, Hollow Cylinder, Ring, Custom. Up to 6 objects race simultaneously.
- **Custom β slider:** For "Custom" object, set β directly (0 to 1). Instantly shows where this shape would finish in the race.
- **Ramp angle slider** (0° to 60°): Changes slope. Steeper slopes do not change the finish order but change finish times. Show why.
- **Friction coefficient slider** (0 to 1): At low friction, objects skid instead of roll. The skidding physics changes the result — a frictionlessly sliding object (μ = 0) is faster than any rolling object.
- **Mass slider:** Show that changing mass from 0.1 kg to 10 kg has zero effect on finish order or finish time for rolling objects.
- **Energy bars:** Side-by-side KE bars for each object showing translational (green) and rotational (blue) kinetic energy in real time as the objects descend. Total KE bar (red) equals the PE decrease at all times.
- **Moment of inertia formula display:** For each selected object shape, show the formula I = βmr² with numbers plugged in.
- **Slow-motion toggle:** Run at 1/10 speed for careful observation.
- **Rolling vs. skidding indicator:** When friction is too low, mark each object as "ROLLING" or "SKIDDING" with different visual effects (skidding objects show a skid mark trail).
- **Bowling ball demo:** Pre-set scenario: ball launched with forward velocity but zero spin. Show the spin building up until rolling condition is met, then the lane marks disappear and the ball rolls cleanly.

## Production Notes

**Runtime target:** ~12 minutes. Hook: 1.5 min. Naive code: 2 min. Failure: 1 min. Physics: 2.5 min. Fix: 2 min. Wow moment: 2 min. Demo: 1 min.

**Screen layout:** Main canvas showing the ramp (angled ramp drawn in 2D, isometric style for visual appeal). Objects rolling with visible rotation (drawn as circles or spheres with a radial line to show rotation angle). Energy bars below each object update in real time. Code editor in side panel during coding segments.

**Animations to pre-render:** (1) Real ramp race footage (easy to set up — cardboard tube vs solid ball), (2) animated cross-sections of solid sphere, hollow sphere, and cylinder with mass distribution shading, (3) energy diagram showing PE → translational KE + rotational KE split for each shape, (4) mass cancellation proof animated step by step.

**Key moments to zoom:** The first frame where the solid sphere pulls ahead of the cylinder in the corrected simulation, the energy bar animation showing the different KE splits at the bottom, and the bowling ball skid-to-roll transition in the wow moment.

**B-roll:** Real ramp race footage (produce this practically — costs nothing), bowling alley slow-motion ball launch showing initial skid, formula 1 wheel spin under hard acceleration.

**Gotcha to address:** Real hollow spheres have finite wall thickness, making their β slightly less than 2/3. Real hollow cylinders similarly. The formulas I = 2/3·mr² and I = mr² are thin-shell limits. For this video, the thin-shell idealization is fine but worth a brief disclaimer.

## Tags

`physics` `rolling-motion` `moment-of-inertia` `rotational-kinematics` `energy` `javascript` `canvas` `beginner`

## Thumbnail

A 2D ramp simulation canvas: the inclined plane takes up the frame from bottom-left to top-right. Three distinct rolling objects are arranged in a spread formation descending the ramp — a solid red sphere clearly in the lead, a green cylinder in the middle, and a blue hollow ring noticeably behind. Colored trails show each object's path. Below each object, a small energy bar shows the different translational/rotational KE split — the solid sphere's bar is mostly green (translational), the ring's bar is mostly blue (rotational). At the bottom of the ramp, a finish-line graphic with a small checkered flag. Top text overlay: "MASS DOESN'T MATTER IN THIS RACE" in bold yellow. Bottom text: "Why shape wins." The thumbnail immediately challenges the intuition that heavier = faster, which is the universal wrong assumption every viewer brings to this problem. The clear racing spread between identical-size objects is the visual proof that defies expectation.
