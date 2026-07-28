---
title: "Why Objects Suddenly Start Sliding (Static vs. Kinetic Friction)"
id: B006
difficulty: 1.5/10
prereq: "None"
concept: "Coulomb friction model: static friction fs ≤ μs·N holds until applied force exceeds the static threshold. Then kinetic friction fk = μk·N takes over — and since μk < μs, the object suddenly accelerates."
tags: [physics, friction, static-friction, kinetic-friction, coulomb, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Objects Suddenly Start Sliding (Static vs. Kinetic Friction)

**Alt title:** "The Stick-Slip Bug: Why Game Physics Feels Wrong"
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Start with a relatable scenario: a heavy box sitting on the floor. Someone pushes on it steadily, increasing force. Nothing happens. Nothing happens. LURCH — it suddenly shoots forward, almost stumbling the pusher. Then it slides smoothly. Why did it move all at once? Why didn't it creep forward gradually?

Cut to a force sensor measurement. Attach a spring scale to the box and slowly pull. The scale reading climbs: 50 N, 80 N, 110 N — box stays still. Then at 120 N: the scale reading instantly drops back to 90 N and the box starts moving. The maximum static friction was 120 N. The kinetic friction once sliding is 90 N. The drop from 120 to 90 — that 30 N sudden reduction — is exactly why the box lurches.

Now show what this means for simulation: a physics engine that uses a single friction constant will model the box as if it starts moving gradually at a lower force threshold, and will miss the lurch entirely. Every game that uses `friction_force = mu * normal_force` without distinguishing static from kinetic gets this wrong — and it's why "pushing boxes" in games often feels unrealistically smooth.

Show two side-by-side simulations: the single-friction-constant version (smooth, gradual, unrealistic) and the two-constant Coulomb model (stick, stick, stick, LURCH, smooth slide). The lurch is immediately recognizable as physically correct. That lurch is the bug that teaches us the physics.

---

## The Naive Attempt

Open code editor. Build the single-friction-constant model that most tutorials teach:

```javascript
// B006 — Naive: single friction coefficient
const mass    = 10.0;   // kg
const g       = 9.81;   // m/s²
const mu      = 0.4;    // single friction coefficient (no static/kinetic distinction)
const N       = mass * g;  // normal force (horizontal surface, no vertical acceleration)

let velocity = 0;
let appliedForce = 0;  // ramping up over time

function update(dt) {
  const frictionForce = mu * N;  // always the same, regardless of velocity

  // Net force: applied minus friction (friction opposes motion direction)
  let netForce;
  if (velocity === 0) {
    // Object is stationary
    if (Math.abs(appliedForce) <= frictionForce) {
      netForce = 0;  // friction exactly cancels applied force
    } else {
      netForce = appliedForce - Math.sign(appliedForce) * frictionForce;
    }
  } else {
    netForce = appliedForce - Math.sign(velocity) * frictionForce;
  }

  const acceleration = netForce / mass;
  velocity += acceleration * dt;

  // Ramp up applied force slowly
  appliedForce += 2.0 * dt;  // N/s ramp rate
}
```

Walk through this: when the applied force is below mu*N (= 0.4 * 10 * 9.81 = 39.2 N), the object stays still. When applied force exceeds 39.2 N, the object starts moving and experiences `F_net = F_applied - 39.2`. This is mathematically well-defined and the code is internally consistent.

But notice: there is only one threshold. The friction constant that determines when the object starts moving is the same constant that governs how it slides once moving. This is the flaw — in reality, these are two different physical phenomena with different magnitudes.

Run the simulation. As the applied force ramps up, the object starts moving exactly at the threshold — smoothly and gradually. No lurch. As the applied force continues increasing past the threshold, the object accelerates smoothly. This looks fine on screen. That's the insidious part: the bug doesn't look wrong, it just lacks the lurch that real friction always produces.

---

## The Moment of Failure

Set up a comparison: on the left, the single-constant simulation. On the right, the correct two-constant model (shown as preview). Both boxes have the same applied force ramp. Both start with F_applied = 0 and increase at 5 N/s.

**Left (single constant, mu = 0.4):** Object starts moving exactly at F = 39.2 N. Motion is smooth — no jerk, no lurch. Velocity builds gradually from zero.

**Right (two constants, μs = 0.5, μk = 0.35):** Object stays completely still until F = 49.1 N (μs threshold). Then, at the moment of sliding, the resisting force instantly drops from 49.1 N to 34.4 N (μk = 0.35). The net force spikes: F_net = 49.1 - 34.4 = 14.7 N. The object lurches — a sudden jolt. It then slides at constant kinetic friction.

Show the force vs displacement graph for both: the left shows a smooth line crossing into motion. The right shows the characteristic sawtooth — force builds, drops at slip, the box accelerates, then if F_applied stays constant, the box reaches equilibrium at kinetic friction.

Zoom in on the velocity-time graph: left shows a smooth ramp from zero. Right shows a sudden step — the velocity jumps discontinuously from zero to a finite value in one frame. This is the lurch, encoded in the math. Text overlay: "The missing lurch is not a rendering issue. It's a physics issue. The two-constant model is the minimum physics required to simulate it."

---

## Why It Broke — The Physics

The Coulomb friction model distinguishes between two regimes, each governed by a different coefficient:

**Static friction (surfaces at rest relative to each other):**
$$f_s \leq \mu_s N$$

Static friction is not a fixed value — it's a maximum. The static friction force adjusts to exactly cancel the applied force, up to its maximum value. If you push with 10 N, static friction provides 10 N. If you push with 30 N, static friction provides 30 N — as long as 30 N ≤ μs·N. This is why the object stays still even as you increase the force, up to the threshold.

**Kinetic friction (surfaces sliding against each other):**
$$f_k = \mu_k N$$

Once sliding occurs, kinetic friction is a fixed value — it doesn't adjust. It's always μk·N in the direction opposing motion. And critically:

$$\mu_k < \mu_s \quad \text{always}$$

The kinetic friction coefficient is always smaller than the static friction coefficient. Typical values:
- Rubber on dry concrete: μs ≈ 0.8, μk ≈ 0.6
- Steel on steel (dry): μs ≈ 0.74, μk ≈ 0.57
- Ice on ice: μs ≈ 0.1, μk ≈ 0.03
- Teflon on steel: μs ≈ 0.04, μk ≈ 0.04 (unusual — barely any difference)

**The physical reason for the lurch:** Static friction involves surface asperities (microscopic bumps) interlocking — genuine atomic/molecular bonds across the contact area. These bonds must all rupture simultaneously to allow slip. The energy stored in those bonds is released when slip begins — hence the sudden reduction in friction. Kinetic friction, by contrast, involves surfaces continually making and breaking bonds as they slide, resulting in a lower average force.

**Why μk < μs:** The instantaneous maximum static bond strength exceeds the average kinetic bond strength. Think of it like teeth meshing: engaging them requires overcoming the full tooth height (static), but once sliding, you're only overcoming the average resistance (kinetic). The lurch corresponds exactly to the energy released when all those teeth snap at once.

---

## The One Concept

**Coulomb Friction** (named after Charles-Augustin de Coulomb, 1781) is the two-regime model for friction between dry solid surfaces:

**Regime 1 — Stuck:**
$$\vec{f}_s = -\vec{F}_{applied} \quad \text{if } |\vec{F}_{applied}| \leq \mu_s N$$

Static friction is a reactive force — it provides exactly what's needed, up to its limit.

**Regime 2 — Sliding:**
$$\vec{f}_k = -\mu_k N \hat{v} \quad \text{where } \mu_k < \mu_s$$

Kinetic friction is a fixed magnitude force opposing the velocity direction.

**The transition:** the moment when F_applied > μs·N, the system transitions from stuck to sliding. At this instant, the friction force drops from its maximum static value (μs·N) to the kinetic value (μk·N). The net force instantaneously becomes:
$$F_{net} = F_{applied} - \mu_k N > 0$$

This is the lurch — a sudden nonzero net force that was zero a moment ago.

**State machine interpretation (useful for code):** The friction model is a two-state system:
- State: STATIC. Transition condition: |F_applied| > μs·N. Action on transition: velocity gets an impulse.
- State: SLIDING. Transition condition: v → 0 AND |F_applied| ≤ μs·N. Action: return to STATIC.

This is exactly how game physics engines implement friction — as a state machine with hysteresis.

**Real-world examples:**
1. Geological fault slippage: rock layers under tectonic stress build enormous static friction. When it breaks, kinetic friction is lower — the fault slips violently before resticking. This is an earthquake. The magnitude distribution follows patterns related to the μs - μk gap.
2. Stick-slip in violin bowing: the bow hair sticks to the string (static friction), deforms it, then releases (kinetic friction). The string snaps back and the cycle repeats at the resonant frequency. This is the sound of a violin — friction oscillations at 440 Hz.
3. Squealing brakes: at the onset of wheel lockup, the tire transitions from rolling (near-static friction) to sliding (kinetic), dramatically reducing braking force and eliminating steering. ABS systems prevent this by never fully locking the wheels.

---

## The Fix

```javascript
// B006 — Correct two-regime Coulomb friction
const mass = 10.0;
const g    = 9.81;
const mu_s = 0.50;   // static friction coefficient
const mu_k = 0.35;   // kinetic friction coefficient — MUST be < mu_s
const N    = mass * g;

const f_static_max  = mu_s * N;  // maximum static friction force
const f_kinetic     = mu_k * N;  // kinetic friction force (constant magnitude)

let velocity     = 0;
let appliedForce = 0;
let isSliding    = false;  // friction state machine

function update(dt) {
  appliedForce += 2.0 * dt;  // ramp up force

  let frictionForce;

  if (!isSliding) {
    // STATIC regime: friction adapts to cancel applied force
    if (Math.abs(appliedForce) <= f_static_max) {
      // Object stays still — friction exactly cancels
      frictionForce = -appliedForce;
      velocity = 0;  // enforce stillness
    } else {
      // TRANSITION: static threshold exceeded — begin sliding
      isSliding = true;
      frictionForce = -Math.sign(appliedForce) * f_kinetic;
    }
  } else {
    // SLIDING regime: fixed kinetic friction opposing motion
    frictionForce = -Math.sign(velocity || appliedForce) * f_kinetic;

    // Check if object has stopped (can re-enter static regime)
    if (Math.abs(velocity) < 0.001 && Math.abs(appliedForce) <= f_static_max) {
      isSliding = false;
    }
  }

  const netForce    = appliedForce + frictionForce;
  const acceleration = netForce / mass;
  velocity += acceleration * dt;
}
```

The key improvement: the boolean `isSliding` implements the state machine. In the STATIC state, friction is reactive — it exactly cancels applied force. In the SLIDING state, friction is a fixed magnitude (f_kinetic). The transition from static to sliding is one-way per event — it only re-enters static if the object actually stops and the applied force is back below the static threshold.

Show the two critical on-screen verifications: (1) the velocity-time graph shows a step at the moment of first slip, (2) the force graph shows the kinetic friction is always less than the maximum static friction — the lines never cross.

---

## The Wow Moment — Push It

Build the earthquake fault slip simulation. Create 30 blocks in a horizontal chain, each connected to its neighbors by springs (stiffness k_spring), all sitting on a surface with random static friction thresholds (μs distributed between 0.3 and 0.7, μk consistently 75% of each block's μs). The entire chain is being slowly dragged from one end — like tectonic plates moving at 2 cm/year.

As the driving continues, each spring stores elastic energy. The leftmost block eventually exceeds its static threshold and slips — releasing that spring energy into kinetic motion. This briefly raises the force on the neighboring blocks, potentially triggering their slip too. The cascade runs through the chain. The released slip in each block is proportional to the stored spring energy before slip.

Show the "event magnitude" distribution: small slips happen frequently, large slips rarely. The distribution follows a power law — larger earthquakes are rarer in a specific mathematical ratio that matches real seismological data (Gutenberg-Richter law). The simulation didn't have this programmed in — it emerges naturally from the stick-slip physics and the random threshold distribution.

Visualize with color coding: blocks are green (static), yellow (near threshold), red (currently sliding). During a cascade, the red wave moves through the chain like a shockwave. After each event, blocks resettle at new positions with new stored spring energy. The system never reaches static equilibrium — it perpetually cycles through stress buildup and slip events. This is exactly the behavior of real fault systems.

---

## The Interactive Demo

**Canvas layout:** A large block sitting on a surface. A spring attaches the block to an anchor on the left. The anchor moves slowly to the right (simulating the tectonic plate). Force arrows visible on the block.

**Direct interaction:**
- Click and drag the block: pull it manually with the mouse. Feel the stick-slip as you drag. The block resists, then suddenly lunges when you exceed μs·N. The position snaps forward.
- Alternatively: use the "Apply Force" slider to slowly ramp up force and watch the lurch.

**Sliders:**
- `μ_s (static)` — 0.1 to 1.0. Must stay above μ_k.
- `μ_k (kinetic)` — 0.05 to μ_s. Gap between μs and μk controls the lurch magnitude.
- `Mass` — 1 to 100 kg
- `Normal Force (N)` — can add extra weight; affects both friction forces proportionally
- `Applied Force Ramp Rate` — slow (see the approach) or fast (feel the full lurch)
- `Surface Material Presets` — [Ice] (μs=0.1, μk=0.03), [Rubber/Concrete] (μs=0.8, μk=0.6), [Steel/Steel] (μs=0.74, μk=0.57), [Teflon] (μs=0.04, μk=0.04)

**Force visualization (on canvas):**
- Green arrow: applied force (length proportional to magnitude)
- Red arrow: friction force (reactive in static regime, fixed in kinetic)
- Net force arrow: sum, shown in white
- The transition from static to kinetic is marked with a flash effect on the block

**Graph pane:**
- Force vs time: shows F_applied (green), F_friction (red), F_net (white)
- Velocity vs time: the step at slip onset is clear
- Toggle: Force vs Displacement (the hysteresis loop of stick-slip is visible)

**Earthquake mode button:** Opens the 30-block fault simulation as a separate panel.

---

## Production Notes

**Runtime target:** 14–17 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook: heavy box lurch demo, force sensor graph revealing the friction drop — 1 min
- 1:00–4:00 — Naive code: single coefficient, smooth motion, deceptively reasonable — 3 min
- 4:00–6:00 — Failure: side-by-side comparison, velocity step vs smooth ramp, the missing lurch — 2 min
- 6:00–9:00 — Physics: Coulomb model, μs vs μk, surface asperities, energy release — 3 min
- 9:00–11:00 — The concept: state machine framing, real-world examples (earthquakes, violin, ABS brakes) — 2 min
- 11:00–13:00 — The fix: two-state code, state transition logic, force graph verification — 2 min
- 13:00–15:00 — Wow: earthquake chain, cascade demo, power-law magnitude distribution — 2 min
- 15:00–16:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** Split code/canvas. During the wow demo, full canvas. During the physics section, consider an overhead-projector style diagram overlay on the code.

**Zoom moments:**
- ZOOM on the force sensor graph at the lurch moment — the drop from μs·N to μk·N
- ZOOM on the velocity step in the correct simulation at the slip onset
- ZOOM on the red cascade wave in the earthquake simulation
- ZOOM on the power-law distribution plot emerging from the random threshold setup

**Pre-render animations:**
- Force vs displacement diagram with labeled static and kinetic regions — clean illustration
- Surface asperity model (microscopic bumps) for the physics explanation
- Violin bow stick-slip animation (slow-motion illustration)

**Key on-screen text moments:**
- At failure reveal: "μs > μk IS THE PHYSICS. μs = μk IS THE BUG."
- At state machine explanation: draw the state diagram (STATIC ↔ SLIDING) with transition conditions labeled

---

## Tags

`physics` `friction` `static-friction` `kinetic-friction` `coulomb` `javascript` `canvas` `beginner`

---

## Thumbnail

A heavy wooden box on a concrete floor. A large arrow labeled "PUSH" points at it from the left. The box has two states illustrated: on the left half of the box, a "STUCK" label with a red padlock icon — static friction. On the right half, after a dramatic crack-line through the middle, a "SLIDING" label with velocity streak lines. A spring scale is visible attached to the box, showing "FORCE: 120N → 90N" — the drop at the moment of slip. Bold text overlay: "WHY IT LURCHES" in bright yellow. The background is gritty concrete texture to reinforce the physical environment. Emotion: the satisfying "aha" of understanding a familiar everyday phenomenon — everyone has pushed a heavy box and felt the lurch, but few know why. The two-state box illustration captures the discontinuity at a glance.
