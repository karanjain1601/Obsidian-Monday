---
title: "Measuring a Bullet's Speed With a Pendulum"
id: B075
difficulty: 2.5/10
prereq: "B074_Collision_Types"
concept: "Ballistic pendulum: bullet embeds (perfectly inelastic, momentum conserved: mv = (M+m)V), then pendulum swings (energy conserved: ½(M+m)V² = (M+m)gh); chain gives bullet speed v"
tags: [mechanics, ballistics, pendulum, momentum, energy-conservation, measurement, canvas, beginner]
category: beginner
type: video-idea
---

# Measuring a Bullet's Speed With a Pendulum

**Alt title:** "18th-Century Scientists Measured Bullet Speed With a Pendulum — Here's How"
**Difficulty:** 2.5/10 | **Prereq:** B074_Collision_Types

---

## Opening Hook (0:00–1:00)

The video opens on a close-up of a suspended wooden block hanging from two long ropes. A hand enters the frame and fires a pistol at the block. In slow motion: the bullet embeds in the wood, and the block swings upward in a smooth arc — then swings back, then forward again, a classic pendulum. The host pauses the video at the top of the swing, where a ruler is clearly visible measuring the height h the block rose. The opening line: "Benjamin Robins invented this device in 1742. There were no high-speed cameras, no radar guns, no laser chronographs. Just a pendulum, a ruler, and two conservation laws applied in sequence. With this, he measured bullet speeds to within a few percent accuracy — before electricity was even harnessed." Cut to a digital reconstruction of the same device. The host shows that the only measurements needed are the initial masses and the height h. Everything else — the bullet's speed before impact — can be derived. The twist that sets up the episode: "We will see that you cannot apply just one conservation law here. You need two, in the right order, or you get a completely wrong answer."

## The Naive Attempt

The viewer simulates the pendulum. First they set up the geometry: a block of mass M = 2 kg hanging from a string of length L = 1 m. A bullet of mass m = 0.01 kg fires horizontally at speed v₀. The first naive attempt applies energy conservation to the entire event — treating the bullet+block system as if kinetic energy is conserved from the moment of impact straight through to the top of the swing:

```javascript
// WRONG: Naive energy-only approach
const m = 0.01;  // bullet kg
const M = 2.0;   // block kg
const v0 = 400;  // bullet speed m/s
const g = 9.81;

// Wrongly assume KE before = PE at top
const KE_bullet = 0.5 * m * v0 * v0;
const h_wrong = KE_bullet / ((m + M) * g);

console.log(`Wrong height: ${h_wrong.toFixed(3)} m`);
// Produces ~0.408 m — spectacularly wrong
```

The viewer computes a height of about 40 cm. This seems plausible at first.

## The Moment of Failure

The host now runs a full simulation that tracks both momentum and energy throughout the event. During the bullet embedding phase, momentum is measured before and after — it is conserved: total momentum is 0.01 × 400 = 4 kg·m/s before, and (0.01 + 2) × V = 4 kg·m/s after, giving V ≈ 1.99 m/s. But kinetic energy before is ½ × 0.01 × 400² = 800 J, and kinetic energy after the embedding is ½ × 2.01 × 1.99² ≈ 3.98 J. The energy display on screen shows a horrifying loss: **799 joules vanished in one millisecond** — 99.5% of the kinetic energy converted to heat, sound, and deformation of wood. The naive energy-conservation approach used 800 J when it should have used only 3.98 J. The predicted height from the naive approach (0.408 m) is about 200× larger than reality (about 0.002 m for these numbers when correctly computed using V = 1.99 m/s → h = V²/2g ≈ 0.20 m — though for a massive block the discrepancy with the naive approach is dramatic). The on-screen energy meter slamming from 800 J to 4 J at the moment of impact is the visual shock.

## Why It Broke — The Physics

The ballistic pendulum involves two separate physical events governed by different conservation laws:

**Phase 1 — The Collision (duration ~1 ms):** The bullet embeds in the block. This is a perfectly inelastic collision. The impact happens so fast that the block barely moves during the collision, meaning no net work is done by the string tension (it acts perpendicular to motion). Therefore, external forces do no net impulse during the collision, and **momentum is conserved**. Energy is not conserved — most KE converts to heat and deformation.

**mv = (M + m)V**  →  **V = mv / (M + m)**

**Phase 2 — The Swing (duration ~1 s):** The block+bullet system swings upward as a pendulum. During this phase there is no collision, no impulsive force, and no energy loss (assuming negligible air resistance and a massless string). **Energy is conserved** — kinetic energy at the bottom converts to gravitational potential energy at the top:

**½(M + m)V² = (M + m)gh**  →  **V = √(2gh)**

Combining both equations to eliminate V (which is never directly measured):

**v = ((M + m) / m) × √(2gh)**

This is the famous ballistic pendulum formula. The bullet speed v is computed from measurable quantities M, m, h, and g alone.

## The One Concept

The ballistic pendulum is a masterclass in knowing which conservation law to apply at which stage. The collision and the swing are not the same physical process — they have different time scales, different dominant forces, and different conservation properties. Applying energy conservation to the collision gives the wrong answer because energy is genuinely lost. Applying momentum conservation to the swing gives the wrong answer because the pendulum string exerts external forces that change the momentum of the block+bullet system during the swing.

The elegance of the ballistic pendulum lies in the fact that the intermediate velocity V (the combined speed right after impact) appears in both equations as the linking variable — and can be eliminated algebraically, giving a clean formula that requires only the height h of the swing. This makes it an ingenious experimental device: by measuring only h (using a ratchet that records the maximum angle, for example), you recover v, a quantity that is far too fast to measure directly with 18th-century instruments.

Modern applications of this principle extend beyond ballistics. Any "two-stage" measurement problem — where an energetic event drives a mechanical indicator — uses the same logic. Nuclear physicists use similar techniques to infer particle energies from recoil measurements. Geologists infer meteor impact energies from crater depths using analogous chain-conservation arguments.

## The Fix

Implement the two-phase simulation correctly:

```javascript
let phase = 'collision'; // starts in collision phase

function update() {
  if (phase === 'collision') {
    // Apply momentum conservation
    const V = (m * bullet.vx) / (m + M);
    block.vx = V;
    bullet.vx = V; // bullet now moves with block
    bullet.embedded = true;
    phase = 'swing';
    console.log(`Post-collision V: ${V.toFixed(3)} m/s`);
  }
  
  if (phase === 'swing') {
    // Energy conserved: convert KE to PE
    const v_current = block.vx; // simplified 1D
    const h = (v_current * v_current) / (2 * g);
    display(`Height reached: ${h.toFixed(4)} m`);
    display(`Bullet speed: ${((m + M) / m * Math.sqrt(2 * g * h)).toFixed(1)} m/s`);
  }
}
```

The simulation now correctly shows 99%+ energy loss at the collision, then smooth energy-conserving pendulum motion, and a final accurate reconstruction of bullet speed.

## The Wow Moment — Push It

The host builds a live ballistic pendulum laboratory. The viewer can fire different "bullets" (mass 1 g, 5 g, 10 g, 50 g) at different block masses (1 kg, 5 kg, 20 kg) at various speeds (100, 400, 800 m/s). For each combination, the simulation shows the pendulum swinging in real time, the height recorded by an animated ratchet mechanism, and the recovered bullet speed. A side panel shows the energy loss percentage for each case — it is always above 95% when the bullet is much lighter than the block, and approaches 0% when masses are equal (transitioning to a near-elastic collision). The host uses the tool to demonstrate that larger blocks give more accurate measurements for light bullets because the pendulum swings to measurable heights, while a very heavy block barely moves and gives very small h — limited by measurement precision of the ruler.

## The Interactive Demo

- **Bullet mass slider** — 1 g to 100 g; affects how much momentum is transferred
- **Block mass slider** — 0.5 kg to 20 kg; changes how high the pendulum swings
- **Bullet speed slider** — 50 to 1000 m/s; sets the initial bullet velocity to be "measured"
- **String length slider** — 0.5 to 3 m; changes pendulum geometry and swing arc
- **Show energy breakdown** — live bar chart showing KE_before, KE_after_collision, and PE_at_top
- **Show momentum check** — momentum before and after embedding, confirmed equal
- **Reveal actual speed button** — hides the set bullet speed initially; viewer measures from h, then clicks to compare their computed answer to the true value
- **Ratchet angle display** — shows the maximum swing angle θ and height h = L(1 − cosθ)

## Production Notes

Open with the slow-motion clip of the physical ballistic pendulum — this is a real device and the footage is dramatic. Use an animated diagram (not just code) to label Phase 1 and Phase 2 when explaining the two-conservation-law logic. Draw a timeline bar showing "collision (1 ms)" and "swing (1 second)" to make the time scale difference visceral. Zoom in on the energy display during the impact phase so the viewer clearly sees the drop from 800 J to 4 J — use a bold red "−796 J" label. For the wow moment, add a gentle rope-swing animation with a wooden-block texture. Include the formula v = ((M+m)/m)√(2gh) typeset cleanly on screen when the host solves for bullet speed.

## Tags
`mechanics` `ballistics` `pendulum` `momentum` `energy-conservation` `measurement` `canvas` `beginner`

## Thumbnail

A vintage-style illustration of a ballistic pendulum: a gun on the left, a bullet trajectory line hitting a wooden block, and the block swinging up on ropes to a measured height h. Bold text overlay: **"800 J → 4 J"** in red, with a subtext in white: "How 18th-century scientists measured bullet speed." The contrast between the crude wooden apparatus and the precise number gives the thumbnail its visual tension.
