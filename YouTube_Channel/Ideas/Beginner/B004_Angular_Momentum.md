---
title: "Why a Spinning Figure Skater Speeds Up When They Pull In"
id: B004
difficulty: 2/10
prereq: "None"
concept: "Conservation of angular momentum L = Iω = constant. Moment of inertia I = Σmr². Reducing I by pulling arms in forces ω to increase proportionally."
tags: [physics, angular-momentum, moment-of-inertia, rotation, conservation, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why a Spinning Figure Skater Speeds Up When They Pull In

**Alt title:** "The Energy Trick Every Figure Skater Uses (Conservation of Angular Momentum)"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on real figure skating footage: a skater enters a spin with arms outstretched, rotating at about 1 revolution per second. Then — in one smooth motion — they pull their arms tight against their body. The rotation rate doubles almost instantly. Then they raise one hand above their head and tuck one leg in tighter — the spin accelerates again, to 4–5 revolutions per second, a blur of motion.

Pause the footage. Ask the audience: "No external force is applied. No motor. No extra energy from outside. The skater is not pushing against anything — they're just rearranging their own arms. So where does the extra speed come from?"

Most people have two wrong intuitions: (1) "It's like a ball on a shorter string — it naturally goes faster" — this is wrong because a skater on ice has no string; they're a free-rotating rigid body. (2) "They must be generating extra angular momentum somehow" — this is wrong because angular momentum is conserved; they can't create or destroy it.

The answer is genuinely counterintuitive: the rotational kinetic energy actually INCREASES when the skater pulls in. They are doing work against an internal force. Where does that work come from? The skater's muscles. And where does it go? Into faster rotation. The angular momentum is constant; the energy changes because work is done internally.

Then reveal: "Every simulation that keeps angular velocity constant during a body shape change is wrong. The right conserved quantity is angular momentum L = Iω, not ω alone. Let's see exactly what that means in code."

---

## The Naive Attempt

Start with a simple rotating body: a central mass (the skater's torso) with two point masses (the arms) attached at a fixed radius. The body rotates at constant angular velocity.

```javascript
// B004 — Naive: constant angular velocity, ignoring conservation
const torsoMass = 50;       // kg — central body
let armMass = 5;            // kg each arm
let armRadius = 0.8;        // meters from center
let omega = 2.0;            // rad/s — WRONG: keeping this constant

// Moment of inertia
function computeI() {
  // Torso: model as solid cylinder, I = 0.5 * M * R²
  const torsoI = 0.5 * torsoMass * 0.2 * 0.2;  // R_torso = 0.2m
  // Two arms as point masses: I = 2 * m * r²
  const armsI = 2 * armMass * armRadius * armRadius;
  return torsoI + armsI;
}

let angle = 0;

function update(dt) {
  // WRONG: Just keep omega constant as arms move in
  angle += omega * dt;

  // Animate arm radius changing inward
  armRadius = Math.max(0.1, armRadius - 0.005);  // arms pull in slowly

  // No update to omega — this is the bug
}
```

Run this simulation. The skater pulls their arms in, and the rotation continues at exactly the same speed. Visually, it looks like a reasonable animation — the skater's figure changes shape but the spin rate is constant. This is the exact mistake that game animators make all the time: they animate the shape change but forget to update the physics.

Walk through what the moment of inertia is doing. Compute I at arms-out: torsoI + 2×5×0.8² = 0.5×50×0.04 + 6.4 = 1 + 6.4 = 7.4 kg·m². Compute I at arms-in (r=0.1): 1 + 2×5×0.01 = 1.1 kg·m². The moment of inertia has dropped by a factor of 6.7. The angular momentum should be constant: L = I×ω. But in the naive simulation, L drops by a factor of 6.7 as arms come in — angular momentum is not conserved. This violates one of the most fundamental conservation laws in physics.

---

## The Moment of Failure

Display two panels side by side. Left: the naive (constant ω) simulation. Right: the physically correct simulation. Both start with arms out at ω = 2 rad/s.

In the left panel, the arms pull in and the spin rate stays at 2 rad/s. A large banner reads "L = 14.8 → 2.2 kg·m²/s" — angular momentum is dropping. This is only possible if an external torque is being applied, but no external torque exists. The simulation is violating conservation of angular momentum without any justification.

In the right panel, as arms pull in, ω jumps. At arms-out, ω = 2. At half-radius, ω = 4.1. At arms fully in, ω = 13.4 rad/s — over 2 revolutions per second. Angular momentum stays at 14.8 kg·m²/s throughout. The L readout is flat.

Show the rotational kinetic energy: KE = ½Iω². At arms-out: ½×7.4×4 = 14.8 J. At arms-in: ½×1.1×180 = 99 J. The kinetic energy has increased by a factor of 6.7! The extra energy came from the skater's muscles doing work as they pull in against the centrifugal tendency of their arms to stay outward. Real figure skaters tire quickly during fast spins — this is why.

Text overlay: "Left: the animation looks fine but violates conservation of angular momentum. Right: physically accurate — and you can feel the difference just by watching the spin rate change."

---

## Why It Broke — The Physics

Newton's laws have rotational analogues. For linear motion, we conserve linear momentum `p = mv` when there are no external forces. For rotational motion, we conserve angular momentum `L = Iω` when there are no external torques.

**Moment of Inertia (I)** is the rotational equivalent of mass — it measures how hard it is to change the rotation of a body. But unlike mass, I depends on how the mass is distributed relative to the rotation axis:

$$I = \sum_i m_i r_i^2$$

For a continuous body: I = ∫r² dm. The key insight: mass close to the axis (small r) contributes little. Mass far from the axis (large r²) contributes enormously. A figure skater's arms, when outstretched at 0.8m, contribute 2 × 5 × 0.64 = 6.4 kg·m². When pulled in to 0.1m: 2 × 5 × 0.01 = 0.1 kg·m². A 64-fold reduction in the arm contribution just from changing r by a factor of 8.

**Angular Momentum (L)** is:
$$L = I\omega$$

With no external torque (skating on frictionless ice), L is conserved:
$$L = I_1\omega_1 = I_2\omega_2 = \text{constant}$$

Therefore:
$$\omega_2 = \frac{I_1}{I_2}\omega_1$$

When I decreases (arms in), ω must increase proportionally. This is not a mechanism — it is a conservation law. The universe enforces it. Any simulation that doesn't obey it is wrong.

---

## The One Concept

**Conservation of Angular Momentum** states that in the absence of external torques, the total angular momentum of a system remains constant:

$$\boxed{L = I\omega = \text{constant}}$$

**The moment of inertia** I encodes "how far from the axis is the mass":
- Point mass at radius r: I = mr²
- Solid cylinder (radius R): I = ½MR²
- Hollow cylinder (thin shell): I = MR²
- Solid sphere: I = ⅖MR²
- Rod rotating about center: I = (1/12)ML²
- Rod rotating about end: I = (1/3)ML²

**Why r² matters so much:** If you move mass from r = 0.8m to r = 0.1m, the contribution drops by (0.1/0.8)² = 1/64. The r-squared scaling is brutal — a small change in arm position dramatically changes I.

**The energy puzzle:** When a skater pulls in arms, KE increases. The angular momentum L = Iω is constant. But KE = L²/(2I) — so as I decreases, KE = L²/(2I) increases. The extra energy comes from the skater's internal muscle forces doing work. The skater's arms want to stay out (centrifugal tendency in rotating frame) — the skater has to pull against that tendency, doing work. That work goes into rotation.

**Real-world examples:**
1. **Neutron star formation:** A star with radius ~700,000 km collapses to a neutron star of radius ~10 km. I drops by a factor of (10/700,000)² ≈ 2×10⁻¹⁰. ω increases by 5 billion times. Neutron stars rotate 700 times per second — the fastest spinning macroscopic objects in the universe.
2. **Diver entering water:** A high diver tucks in a pike position to spin faster during the rotation phase, then extends to slow the spin and enter the water cleanly. Conservation of angular momentum controls the entire timing.
3. **Gyroscopes and stabilization:** Ships use gyroscopes precisely because they conserve angular momentum — any external torque trying to tilt the gyroscope is resisted.

---

## The Fix

```javascript
// B004 — Correct: enforce L = I*omega = constant
const torsoMass = 50;
let armMass = 5;          // kg each arm
let armRadius = 0.8;      // m — starts extended
let angle = 0;

// Initial moment of inertia
function computeI(r) {
  const torsoI = 0.5 * torsoMass * (0.2 ** 2);  // solid cylinder approximation
  const armsI  = 2 * armMass * (r ** 2);         // two point masses
  return torsoI + armsI;
}

// Compute and fix angular momentum at start
const I0     = computeI(armRadius);  // I at arms fully extended
const omega0 = 2.0;                  // rad/s — initial spin rate
const L      = I0 * omega0;          // conserved quantity — NEVER changes

let omega = omega0;

function update(dt) {
  // Recompute I from current arm position
  const I = computeI(armRadius);

  // Enforce conservation: omega = L / I
  omega = L / I;

  angle += omega * dt;

  // Allow arm radius to change (driven by user input or animation)
  // (armRadius is updated by slider or keypress elsewhere)
}

// Kinetic energy at any moment (NOT conserved — it changes as arms move)
function kineticEnergy() {
  const I = computeI(armRadius);
  return 0.5 * I * omega * omega;
  // Equivalently: L*L / (2*I) — clearly increases as I decreases
}
```

The key change: compute I every frame from the current arm position, then derive ω = L/I. The conserved quantity is L, computed once at initialization. Everything else follows automatically. Run the simulation — as armRadius slides from 0.8 to 0.1, ω increases from 2 to 13.4 rad/s. The L readout is perfectly flat. The KE readout rises. Both are as they should be.

Show the formula on screen with specific numbers plugging in: ω₂ = (I₁/I₂) × ω₁ = (7.4/1.1) × 2 = 13.4 rad/s. Match to the simulation output. They agree to four significant figures — the code is implementing the physics correctly.

---

## The Wow Moment — Push It

Simulate a protostellar disk collapsing into a star. Start with 200 particles distributed in a large rotating disk, radius ~500 canvas units, slowly spinning at ω₀ = 0.1 rad/s. The total angular momentum L = Σmᵢrᵢ² × ω₀ is computed once and fixed.

Now trigger gravitational collapse: all particles fall inward toward the center (apply an inward gravitational acceleration). As they move inward, their rᵢ decreases, so the total I = Σmᵢrᵢ² decreases. To conserve L, ω must increase. The simulation computes ω = L / I each frame and applies it.

The visual is spectacular: a slow, lazy rotating disk compresses into a fast-spinning compact star. The rotation rate increases from 0.1 rad/s to 50+ rad/s over 10 seconds of simulated collapse. The particles blur into a solid-appearing disc, then a point. Show the angular velocity readout climbing exponentially as radius decreases.

Then reverse it: show a "red giant expansion" where the star swells outward. Particles move outward, I increases, ω drops dramatically. The fast-spinning star slows to a majestic slow rotation as it expands to red-giant size.

Add the comparative: show the same simulation with a "constant ω" (naive) implementation. The naive version doesn't spin up during collapse — the collapsing disk maintains the same lazy rotation. Compare side by side: "Conservation of angular momentum creates the fast-spinning neutron star. Ignoring it gives you a physically impossible slow-spinning lump."

---

## The Interactive Demo

**Main canvas:** A figure skater (simplified silhouette: torso ellipse + two arm rectangles) on ice. Arms extend/retract based on slider.

**Controls:**
- `Arm Radius` — slider draggable left (arms in) to right (arms out). OR: click and hold the arm tips to drag them in/out in real time. This is the key interaction — feel the spin rate change live.
- `Arm Mass` — slider 1–10 kg per arm
- `Torso Radius` — slider for body width (affects torso I)
- `Initial ω` — slider 0.5–5 rad/s (set before starting spin)

**Readout panel (right side, persistent):**
- L (angular momentum, kg·m²/s) — should stay flat. If it wobbles, show a "⚠ numerical error" warning
- I (moment of inertia, kg·m²) — changes as arms move
- ω (angular velocity, rad/s) — changes as arms move
- KE (kinetic energy, J) — increases as arms pull in; note "Work done by muscles = ΔKE"
- RPM conversion: ω in revolutions per minute for intuitive sense
- A conservation bar chart: L, I, ω, KE shown as bars, with L highlighted as "CONSERVED"

**Preset scenarios (buttons):**
- [Figure Skater] — default setup
- [Diver Tuck] — show pike vs tuck vs layout positions
- [Star Collapse] — the wow demo as an interactive simulation
- [Slow-Motion] — 0.1× speed to see the transition clearly

**Graph tab:** Switch to see L, I, ω, KE all plotted against arm radius r. The L curve is a horizontal line. ω is a hyperbola (L/I). KE is L²/(2I), also a hyperbola rising as r decreases.

---

## Production Notes

**Runtime target:** 15–18 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook: real skating footage, the two wrong intuitions, the energy puzzle — 1 min
- 1:00–4:00 — Naive code: constant ω, the moment of inertia calculation, the L violation — 3 min
- 4:00–6:30 — Failure: side-by-side panels, L readout dropping in naive, the KE argument — 2.5 min
- 6:30–9:30 — Physics: rotational analogues, I formula, r² dependence, the star collapse preview — 3 min
- 9:30–11:30 — The concept section: real-world examples (neutron stars, divers, gyroscopes) — 2 min
- 11:30–13:30 — The fix: code rewrite, L = const, formula verification — 2 min
- 13:30–16:00 — Wow: star collapse demo, red giant reverse, side-by-side comparison — 2.5 min
- 16:00–17:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** Canvas center-stage for spinning demos. Code editor right panel for code sections. Always show the L readout as a flat line during correct simulation — it's the visual confirmation that physics is right.

**Zoom moments:**
- ZOOM on the L readout dropping in the naive simulation — this is the "aha" failure moment
- ZOOM on ω jumping from 2 to 13.4 rad/s as arms pull in
- ZOOM on the KE rising while L stays flat — the energy puzzle resolved

**Pre-render animations needed:**
- Real figure skating footage with overlay of L, I, ω, KE readouts (composite in editing software)
- Clean diagram of moment of inertia: mass distribution illustration, r² contribution visualization
- The neutron star collapse animation (can reuse the wow demo canvas capture)

**On-screen formula moments:**
- Write L = I₁ω₁ = I₂ω₂ on screen while explaining conservation — leave it visible for 5+ seconds
- Show the numbers: I₁ = 7.4, ω₁ = 2, L = 14.8 → I₂ = 1.1 → ω₂ = 14.8/1.1 = 13.4 rad/s
- Table of moment of inertia formulas for common shapes — graphic overlay

---

## Tags

`physics` `angular-momentum` `moment-of-inertia` `rotation` `conservation` `javascript` `canvas` `beginner`

---

## Thumbnail

A figure skater, viewed from above (top-down), shown in two states side by side: left half — arms outstretched, slow rotation indicated by a gentle curved arrow with "2 RPM" label. Right half — same skater, arms tight in, rotation arrow is a dramatic swirl with "8 RPM" label. Large text in the middle: "SAME SPIN. MORE SPEED. HOW?" The background is ice-blue. The two states create visual tension — same person, dramatically different rotation — and the question in the text forces the viewer to want to know the answer. A small "L = CONSTANT" label floats above both states, teasing the conservation law punchline. The channel name CodedLaws appears in the lower-right corner in green monospace. Emotion: curiosity and confusion — the kind that only resolves by watching the video.
