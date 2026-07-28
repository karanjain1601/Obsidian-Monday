---
title: "The Physics of See-Saws: Torque and Rotational Equilibrium"
id: B007
difficulty: 1.5/10
prereq: "None"
concept: "Torque τ = r × F (magnitude: τ = r·F·sinθ). Rotational equilibrium requires Στ = 0. A force far from the pivot creates more torque than the same force close in."
tags: [physics, torque, rotational-equilibrium, levers, mechanics, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# The Physics of See-Saws: Torque and Rotational Equilibrium

**Alt title:** "Why a Child Can Lift an Adult (Archimedes' Lever in Code)"
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a playground see-saw. A small child — visibly lighter than the adult on the other end — is somehow holding the adult off the ground. They are sitting at the far end of the plank. The adult, clearly much heavier, is sitting just 40 cm from the pivot. They are perfectly balanced.

Ask the audience: "How is this possible? The child weighs half what the adult weighs. By any intuitive account, the adult should win." Then show the answer without words: draw a ruler on screen. The child is 2 meters from the pivot. The adult is 0.9 meters from the pivot. The product (force × distance) is the same for both. Balance is about torque, not weight alone.

Then cut to an ancient context: Archimedes of Syracuse, 250 BCE, reportedly said "Give me a lever long enough and a fulcrum on which to place it, and I shall move the world." This is not hyperbole — it is a precise physical statement. With a sufficiently long lever arm, even the weight of a human can lift anything, including a planet, given a long enough plank and a stable enough pivot. The math is exact: τ = F × d. No approximations. No conditions. Just the force and how far from the pivot you apply it.

And then reveal the coding mistake that breaks every see-saw simulation: ignoring the distance. Simulations that balance based on mass alone will always get the equilibrium position wrong — and the simulation will reveal the bug immediately when you put a light child at the far end and a heavy adult at the center.

---

## The Naive Attempt

Start with the wrong model: compare masses to determine which side falls, ignoring position entirely.

```javascript
// B007 — Naive: balance based on mass, ignoring position
const pivotX = canvas.width / 2;
const beamLength = 400;  // pixels total

let leftMass  = 0;  // total mass on left side of pivot
let rightMass = 0;  // total mass on right side of pivot
let beamAngle = 0;  // degrees, 0 = horizontal

// Objects: { x: position along beam (-200 to 200), mass: kg }
const objects = [
  { x: -180, mass: 30, label: "Child" },   // child at far left end
  { x:  -40, mass: 80, label: "Adult" },   // adult close to center
];

function update(dt) {
  leftMass  = objects.filter(o => o.x < 0).reduce((s, o) => s + o.mass, 0);
  rightMass = objects.filter(o => o.x > 0).reduce((s, o) => s + o.mass, 0);

  // WRONG: rotational direction based only on mass difference
  const massImbalance = rightMass - leftMass;  // positive = right side heavier
  const angularAccel = massImbalance * 0.01;   // arbitrary constant — no physics

  beamAngle += angularAccel * dt;
}
```

Walk through this explicitly. The child is at x = -180 (far left), mass 30 kg. The adult is at x = -40 (close to center on the left too — adjust to right side for the imbalance scenario). Now set it up: child at far left, adult at right side close to pivot (x = +40, 80 kg). The naive model computes leftMass = 30, rightMass = 80. The right side is heavier, so the right side falls. The adult wins.

But the torques: child's torque = 30 × 9.81 × 180 px = 52,974 N·px. Adult's torque = 80 × 9.81 × 40 px = 31,392 N·px. The child wins — the left side should fall. The naive mass-only model gives the completely wrong answer.

This failure is total: it would give the wrong balanced position for every see-saw configuration where masses are not equal. Since masses are almost never equal in practice, the naive model is wrong almost always.

---

## The Moment of Failure

Set up the definitive failure demonstration: a see-saw with a child (30 kg) at the far left end (d = 2 m from pivot) and an adult (80 kg) at x = 0.75 m from the pivot on the right side. Real torques:
- Child: 30 × 9.81 × 2.0 = 588.6 N·m (counterclockwise)
- Adult: 80 × 9.81 × 0.75 = 588.6 N·m (clockwise)

This is perfect balance. The adult and child are sitting at exactly the positions where the system is in equilibrium.

**In the naive simulation:** leftMass = 30, rightMass = 80. Right is heavier. The right side crashes down. The adult "wins" even though the system is balanced. The simulation is completely wrong — it can't represent the fundamental fact that Archimedes' principle exists.

Show the simulation crashing: the right side slams to the ground, the child flies up. Then draw the correct torque calculation on screen: highlight the 2-meter arm for the child in red, the 0.75-meter arm for the adult in blue. Calculate both products. They are equal. Zoom in on this equality — it is the entire physics of the problem.

Now adjust the adult's position. Slide them to 1.0 m from center: torque = 80 × 9.81 × 1.0 = 784.8 N·m. This exceeds the child's 588.6 N·m. The adult now wins — correctly. Move the adult to 0.5 m: torque = 392.4 N·m. Now the child wins — correctly. The balance point is at exactly 0.75 m for these masses. The naive simulation cannot find this. The correct simulation finds it automatically.

---

## Why It Broke — The Physics

Torque is the rotational analogue of force. Just as force causes linear acceleration (F = ma), torque causes angular acceleration (τ = Iα). The key property of torque is that it depends not only on the magnitude of the force but on where and in what direction the force is applied relative to the rotation axis.

**Torque definition:**
$$\vec{\tau} = \vec{r} \times \vec{F}$$

The magnitude:
$$\tau = r \cdot F \cdot \sin\theta$$

Where:
- r = distance from the pivot (the moment arm)
- F = magnitude of the force
- θ = angle between the force vector and the position vector

For a vertical force (gravity) on a horizontal beam, θ = 90°, so sin(θ) = 1 and τ = r·F simply. This simplification applies throughout this episode.

**Rotational equilibrium** requires the net torque about any pivot to be zero:
$$\sum \tau = 0 \quad \Leftrightarrow \quad \sum F_i d_i = 0 \quad \text{(signed)}$$

Where the sign of each torque reflects whether it tends to rotate clockwise (-) or counterclockwise (+). This gives us the lever law:

$$F_1 d_1 = F_2 d_2$$

Archimedes' insight was that d can be arbitrarily large. There is no physical limit on the lever arm. So for any F₁ (weight of a person), you can always find d₁ such that a small applied force F₂ at distance d₂ balances it. The price: you must apply the force over a proportionally larger distance.

**Angular dynamics (for non-equilibrium):**
$$\tau_{net} = I \alpha$$

Where I is the moment of inertia of the beam (plus objects on it) and α is the angular acceleration. This gives the beam's motion when torques don't balance.

---

## The One Concept

**Torque** is the measure of a force's ability to cause rotation about a pivot. The key insight: the same force creates different torques depending on where it is applied.

**The lever law (Archimedes, ~250 BCE):**
$$F_1 \cdot d_1 = F_2 \cdot d_2$$

In balance, the products of force times distance are equal on both sides.

**Moment arm:** The perpendicular distance from the pivot to the line of action of the force. For a force applied perpendicular to the beam, the moment arm equals the distance along the beam. For a force applied at an angle, the moment arm is r·sinθ — shorter than r.

**Practical torque intuition:**
- A wrench is longer for a reason — more moment arm = more torque = easier to tighten the bolt
- A door handle is at the far edge, not the center — same principle
- Rotating a bolt with your fingers (r ≈ 0) requires enormous force; with a wrench (r = 0.3m), moderate force suffices

**Signed torques and the right-hand rule:** In 2D (flat screen), define counterclockwise as positive. A force to the left of the pivot acting downward creates positive (counterclockwise) torque. A force to the right of the pivot acting downward creates negative (clockwise) torque.

**Real-world examples:**
1. **Wrenches and bolts:** A standard bolt spec gives torque in N·m (or ft·lb). Applying 20 N·m requires either 200 N at 0.1 m or 40 N at 0.5 m — same torque, different force.
2. **Trebuchet:** The counterweight (heavy, short arm) drops and the sling arm (long) accelerates the projectile — mechanical advantage through torque.
3. **Car steering:** The steering wheel's radius determines how much torque the driver's hands can apply. Power steering reduces the required force, but the torque equation still governs the geometry.
4. **Hydraulic lift:** A small piston force over a large area creates pressure; that pressure acts over a large piston area at a different radius, creating a large force — torque magnification through fluid mechanics.

---

## The Fix

```javascript
// B007 — Correct torque-based simulation
const g = 9.81;
const pivotX = 0;  // pivot at origin; positions are signed distances

// Beam properties
const beamMass   = 5.0;   // kg
const beamLength = 4.0;   // m
const beamI      = (1/12) * beamMass * beamLength * beamLength;  // I for uniform rod

let beamAngle    = 0;     // radians, 0 = horizontal
let beamOmega    = 0;     // rad/s angular velocity

// Objects on beam: { d: signed distance from pivot (m), mass: kg }
const objects = [
  { d: -2.0, mass: 30, label: "Child" },
  { d:  0.75, mass: 80, label: "Adult" },
];

function update(dt) {
  // Compute torques from each mass (gravity acts downward = perpendicular to horizontal beam)
  let torqueNet = 0;
  let beamI_total = beamI;

  for (const obj of objects) {
    const force  = obj.mass * g;                  // downward force
    const torque = -force * obj.d;                // clockwise for positive d (right side)
    // Convention: negative torque = clockwise rotation
    torqueNet   += torque;
    beamI_total += obj.mass * (obj.d ** 2);      // parallel axis theorem
  }

  // Angular acceleration: τ = Iα → α = τ/I
  const alpha = torqueNet / beamI_total;

  // Update angular velocity and angle
  beamOmega += alpha * dt;
  beamOmega *= 0.99;  // small damping to settle on equilibrium
  beamAngle += beamOmega * dt;

  // Clamp to physical limits
  beamAngle = Math.max(-Math.PI/2, Math.min(Math.PI/2, beamAngle));
}

// At equilibrium: beamAngle → 0, beamOmega → 0, torqueNet → 0
// Verify: child torque = 30*9.81*2.0 = 588.6 N·m
//         adult torque = 80*9.81*0.75 = 588.6 N·m → balanced ✓
```

The key changes: each object contributes a torque `τ = -F × d` (signed). The net torque drives angular acceleration via `τ_net = I_total × alpha`. The moment of inertia includes both the beam and all objects (using the parallel axis theorem for point masses on the beam). With small damping, the system oscillates and settles at the equilibrium angle.

Show the equilibrium finding: drag the adult's position slider. The beam tips right as adult moves outward, tips left as adult moves inward. Find the balance point interactively — it's at exactly d = 0.75 m for these masses. The torque readout for both sides hits equality at the same moment the beam settles horizontal.

---

## The Wow Moment — Push It

Build a multi-level mobile sculpture — a tree of cascading balanced beams. The root beam is supported at its center. From each end of the root beam hangs another beam on a string. From each end of those beams hangs another beam, and so on — 4 levels deep, supporting 16 final hanging masses.

Each beam finds its own rotational equilibrium independently. The sculpture is beautiful: it sways gently when disturbed (with angular momentum and damping), then returns to equilibrium like a real Alexander Calder mobile.

Now add interactivity: click any weight on the mobile and drag it to a new position. The entire mobile redistributes — the parent beam tilts due to the changed load, which changes the effective hanging point, which affects the grandparent beam's torque balance. Watch the cascade of adjustments ripple up through the tree. This is real-time hierarchical torque equilibrium solving.

Add a "chaos mode": randomly change all weights simultaneously. The mobile goes into dramatic oscillation, with different levels oscillating at different frequencies (higher levels have more moment of inertia and oscillate slower). Over a few seconds, each level independently damps to equilibrium. The final resting state is a new, different configuration — but still in balance.

Then show the practical application: a crane counterweight calculation. A crane with a 20-ton load at 15 meters from the pivot — what counterweight, and where, keeps it in balance? Solve it with the torque equation live on screen. Move the counterweight slider until the torque bar graph shows balance.

---

## The Interactive Demo

**Canvas layout:** A horizontal beam, pivoting at a moveable fulcrum point. Masses shown as colored blocks hanging from the beam. The beam is labeled with a distance scale (-2m to +2m from pivot).

**Direct interaction:**
- Click and drag any mass along the beam — the beam tips and responds in real time.
- Click empty space on the beam to place a new mass at that position.
- The pivot point itself is draggable — move it left or right along the beam.

**Sliders:**
- Mass selector (1–200 kg) — set mass for the next mass to be placed
- Beam mass (0–20 kg) — a massive beam itself contributes to the torque balance
- Damping coefficient — 0 (frictionless, oscillates forever) to 1.0 (overdamped, settles immediately)
- Gravity (0.1× to 2.5× Earth) — just for fun; doesn't change equilibrium position since g cancels in the balance condition

**Live display:**
- Torque arrows on each mass: downward force arrow (length ∝ mass) and a curved torque arrow (arc from pivot, length ∝ torque magnitude, color: blue = CCW, red = CW)
- Net torque bar: a horizontal bar that is green when balanced (|τ_net| < threshold) and red otherwise
- Torque table (right panel): lists each mass, its position, its torque contribution, and the running net torque total
- Balance indicator: glowing green "BALANCED" when in equilibrium

**Preset configurations:**
- [Child and Adult] — the opening scenario
- [Archimedes' Lever] — 1 kg at 10m vs 100 kg at 0.1m — equal torques, impossible force advantage
- [Mobile] — multi-level hanging mobile
- [Crane] — crane geometry with counterweight problem to solve

---

## Production Notes

**Runtime target:** 13–16 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook: playground see-saw, child lifts adult, Archimedes quote — 1 min
- 1:00–3:30 — Naive code: mass-only comparison, the wrong winner — 2.5 min
- 3:30–5:30 — Failure: definitive wrong answer (child should win; naive says adult wins) — 2 min
- 5:30–8:00 — Physics: torque definition, moment arm, τ = r·F·sinθ, equilibrium — 2.5 min
- 8:00–10:00 — The concept: signed torques, real-world examples (wrenches, trebuchet) — 2 min
- 10:00–12:00 — The fix: correct code, angular acceleration, equilibrium demonstration — 2 min
- 12:00–14:00 — Wow: multi-level mobile, cascade equilibrium, crane problem — 2 min
- 14:00–15:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** See-saw canvas is very visual — make it the dominant element. Code editor for code sections but always keep the see-saw visible in a smaller panel showing the effect of each code change.

**Zoom moments:**
- ZOOM on the torque calculation: 30×9.81×2.0 = 588.6, 80×9.81×0.75 = 588.6 — the equality
- ZOOM on the naive simulation: the adult crashes down despite balance conditions
- ZOOM on the mobile in cascade equilibrium — beautiful physics

**Pre-render animations:**
- Archimedes lever diagram with labeled force and distance vectors
- Wrench torque illustration: same bolt, short wrench vs long wrench, force required comparison
- Right-hand rule diagram for torque direction convention

**Key on-screen graphics:**
- The torque equation τ = r·F·sinθ displayed with each variable labeled on a diagram
- Table showing: mass, position, torque for each object — the sum being zero at balance
- Archimedes quote as opening text overlay

---

## Tags

`physics` `torque` `rotational-equilibrium` `levers` `mechanics` `javascript` `canvas` `beginner`

---

## Thumbnail

A playground see-saw, slightly exaggerated perspective. On the left end: a small child silhouette, far from the pivot. On the right: a large adult silhouette, close to the pivot. The beam is perfectly horizontal — balanced. Two glowing arrows point downward from each figure: the child's arrow is labeled "30 kg × 2m" and the adult's is labeled "80 kg × 0.75m." Both calculations show "= 588 N·m." A large equals sign floats in the center. Text overlay at the top: "HOW A KID LIFTS AN ADULT" in bold white. The visual immediately communicates the paradox and its resolution. Emotion: delighted surprise — your intuition (the adult should win) is wrong, and the math shows why in the frame itself. The playground setting is instantly relatable.
