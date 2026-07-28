---
title: "The Spinning Ice Skater: Angular Momentum Conservation in Code"
id: B099
difficulty: 2/10
prereq: "B004"
concept: "L = Iω is conserved when net external torque is zero; pulling arms in reduces I → ω increases proportionally; fully quantitative"
tags: [mechanics, angular-momentum, moment-of-inertia, conservation, rotation, ice-skater, canvas, beginner]
category: beginner
type: video-idea
---

# The Spinning Ice Skater: Angular Momentum Conservation in Code

**Alt title:** "The Physics That Makes Skaters Spin Three Times Faster in One Second"
**Difficulty:** 2/10 | **Prereq:** B004

---

## Opening Hook (0:00–1:00)

A figure skater stands center-ice, arms outstretched, spinning slowly — one full rotation every two seconds. In a single fluid motion, the arms pull in close to the body. Instantly — within the span of one breath — the rotation rate doubles, then trebles. The skater is now spinning at three revolutions per second, an almost blurring rotation, without any external push. No engine. No force from outside. Just a change in body configuration. The host freezes the simulation mid-spin: "The law of conservation of angular momentum says L = Iω must remain constant whenever no external torque acts. The ice is nearly frictionless. No torque acts. So when I pull my arms in and reduce the moment of inertia I, the angular velocity ω must increase to compensate. The angular momentum does not change — only how it is distributed between I and ω. And if I can model a human body as a simple set of cylinders and point masses, I can predict the exact spin-up factor before a single skater sets foot on the ice."

## The Naive Attempt

The viewer creates a canvas with a simple stick figure shown from above: a central circle (torso) and two extended rectangles (arms), rotating around the center. Step one: track the rotation angle θ and increment it each frame by a constant angular velocity `omega = 1 rad/s`. Step two: add a keypress that "retracts" the arms — animates the arm rectangles moving from full extension to close to the body. Step three: when the user presses the spacebar, the host retract the arms and expects the skater to spin faster automatically. But the host coded `omega` as a constant — it never changes. The arms come in, and the skater continues at exactly the same 1 rad/s as before. The host says: "I made the classic mistake of treating angular velocity as a controlled input rather than a conserved-quantity output. Angular momentum conservation is a constraint — it is not something the simulation enforces automatically unless we code it in."

## The Moment of Failure

The spacebar is pressed. The arms retract smoothly from full extension to the body. The rotation rate: 1 rad/s. Before: 1 rad/s. The simulation is completely unresponsive to the arm position change. The angular velocity display in the corner shows "1.00 rad/s" throughout. The host points to the code: "We computed omega as a constant. There is no line anywhere that says: when I changes, update omega to keep L constant. The simulation has perfect arm animation but no physics. It is a cartoon — convincing visually, but physically dishonest." A red box appears around the `omega = 1` line in the code. "This constant has to go. Omega is not the input — it is the output of conserving L."

## Why It Broke — The Physics

Angular momentum is the rotational equivalent of linear momentum. For a rotating body:

**L = I · ω**

When no external torque acts (τ_net = 0), angular momentum is conserved:

**L_initial = L_final → I₁ · ω₁ = I₂ · ω₂**

For the ice skater, the body can be modeled as a central cylinder (torso + legs, moment of inertia I_body ≈ ½mr²) plus two point masses at arm radius R: **I_total = I_body + 2·m_arm·R²**. When arms pull from R=0.7m to R=0.1m, the arm contribution drops by a factor of (0.7/0.1)² = 49. A typical skater with I_arms(extended) = 1.0 kg·m² and I_body = 0.8 kg·m² has I_total(extended) = 1.8 kg·m². With arms in: I_total(in) = 0.8 + 2·(2 kg)·(0.1m)² = 0.84 kg·m². Spin-up factor: 1.8/0.84 ≈ 2.14. At 1 rev/s extended, the skater spins at 2.14 rev/s with arms in — matching what elite figure skaters actually achieve (typical measurements: 1.2 → 3.0 rev/s for elite skaters with optimized technique).

## The One Concept

Conservation of angular momentum is one of the most powerful and universal conservation laws in physics. It states that the total angular momentum of a system remains constant unless acted upon by an external torque. In mechanics, it arises from the rotational symmetry of physical laws (Noether's theorem: every symmetry corresponds to a conservation law). The ice skating example is the most visceral demonstration because the effect is large, fast, and visible to the naked eye. The same law governs: the formation of solar systems (a slowly rotating nebula collapses under gravity and the resulting planets orbit much faster than the original cloud rotated — conservation of angular momentum at a stellar scale); the gymnastics twisting somersault (a gymnast tucks to spin faster, then opens to slow down before landing); the faster spin of a neutron star compared to its progenitor giant star (collapsing from radius ~10⁸ km to ~10 km increases ω by a factor of 10¹⁰, creating pulsars that spin 700 times per second); and the speed increase of a stream of water entering a drain (the water is not spinning faster — it is the angular momentum of the initial slow rotation of the water in the bath, conserved as the radius decreases). Conservation of angular momentum is also why cats always land on their feet: they have zero initial angular momentum, and they use internal angular momentum redistribution (tucking one half of the body while rotating the other) to orient themselves without violating conservation.

## The Fix

Replace the constant `omega` with a dynamic value computed from angular momentum conservation. On each frame, recompute `I_total` from the current arm position, then compute `omega = L / I_total`.

```javascript
// Initialize
const I_body = 0.8;    // kg·m² (torso + legs, stays constant)
const m_arm = 2.0;     // kg per arm
let armRadius = 0.7;   // meters, starts extended
let omega = 1.0;       // rad/s, starting angular velocity

// Compute initial angular momentum and lock it
let I_total = I_body + 2 * m_arm * armRadius * armRadius;
const L = I_total * omega; // this is CONSERVED — never changes

function update(dt) {
  // Arm radius changes based on user input (slider or keypress)
  armRadius = currentArmRadiusFromSlider();

  // Recompute moment of inertia from current arm position
  I_total = I_body + 2 * m_arm * armRadius * armRadius;

  // Angular velocity follows from conservation: L = I * omega => omega = L / I
  omega = L / I_total;

  // Update angle
  angle += omega * dt;
}
```

Now moving the arm slider in real time causes omega to update instantly. The viewer can slide the arms from 0.7 m to 0.05 m and watch the skater's spin rate jump from 1 rev/s to over 2 rev/s, displayed numerically.

## The Wow Moment — Push It

The host builds a "multiple skater" simulation where three skaters of different body compositions (child, adult, elite athlete) spin simultaneously. Each has different I_body and m_arm values, and thus different spin-up ratios when the arms come in. The elite athlete achieves the highest ratio because her arm contribution relative to body I is largest. The host then demonstrates a "transfer of angular momentum" scenario: two counter-rotating skaters grab hands and spin together — the total L = 0, so when they let go, they both stop instantly. Finally, the host models a gymnast performing a twisting somersault by decoupling the tuck axis from the somersault axis, showing how internal angular momentum redistribution allows reorientation with L_total = 0.

## The Interactive Demo

- **Arm radius slider** (0.05 m to 0.9 m): the primary interaction; drag left to pull arms in and watch omega climb; drag right to extend arms and watch it fall; all changes are instantaneous and smooth
- **Body moment of inertia slider** (0.4 to 2.0 kg·m²): changes the I_body baseline; demonstrates that a skater with heavy legs (high I_body) benefits less from arm retraction
- **Arm mass slider** (0.5 to 5 kg each): changes the arm contribution; heavier arms = more dramatic spin-up
- **Initial spin rate slider** (0.5 to 3 rev/s): sets starting ω with arms extended
- **Energy display toggle**: shows how rotational kinetic energy KE = L²/(2I) actually increases when arms are pulled in (the skater's muscles do work against the centrifugal tendency)

## Production Notes

Show the skater from above as a simple geometric figure — a central circle and two line segments for arms — rendered cleanly with white on black. Add an arc indicator around the skater showing the current rotation rate (a longer arc = faster). Display L = Iω numerically in the corner, with I and ω shown separately so the viewer sees them change inversely while L stays constant. The energy readout showing KE increasing when arms come in is the second key insight — the skater has to do work — and should be highlighted in yellow as the arms retract.

## Tags

`mechanics` `angular-momentum` `moment-of-inertia` `conservation` `rotation` `ice-skater` `canvas` `beginner`

## Thumbnail

Top-down view of a stylized ice skater shown as a white figure on blue ice. Left panel: arms outstretched, one slow rotation arc visible. Right panel: arms tucked, three rapid rotation arcs visible, figure blurring slightly. A bold yellow equation "L = Iω = CONST" bridges the two panels. Text above: "PULL ARMS IN → SPIN 3× FASTER: WHY?" The split-screen format makes the contrast undeniable at thumbnail scale.
