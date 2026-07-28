---
title: "I Coded Free Fall. Then I Added Air. Everything Changed."
id: B001
difficulty: 1/10
prereq: "None"
concept: "Terminal velocity from drag equilibrium — when F_drag = mg the net force is zero and acceleration stops. v_terminal = √(2mg/(ρ·Cd·A))"
tags: [physics, simulation, drag, terminal-velocity, free-fall, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# I Coded Free Fall. Then I Added Air. Everything Changed.

**Alt title:** "Your Gravity Simulation Is Broken (Here's the Fix)"
**Difficulty:** 1/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a split-screen. Left side: a feather and a bowling ball at the top of the frame, inside a glass vacuum chamber. Right side: the same two objects in open air. Count down. Drop them both simultaneously.

In the vacuum (left), both objects hit the bottom at exactly the same frame — this is the famous experiment, famously reproduced on the Moon by Apollo 15 astronaut David Scott in 1971. The physics is irrefutable: without air, gravity accelerates everything at the same rate, period.

On the right side (in air), the bowling ball plummets hard and fast. The feather drifts, wobbles, rotates lazily. Pause the playback. Show a velocity readout for each object. The bowling ball: 12.4 m/s and climbing. The feather: 0.9 m/s and barely moving. Find the exact frame — around 0.7 seconds for the feather, much longer for the ball — where the feather's acceleration graph flatlines. Its velocity has stopped increasing. It has hit terminal velocity.

Then the kicker: zoom in on that frame. The feather is still moving — it's not stopped. It's moving at a constant velocity forever now. That constant velocity has a name, a formula, and a reason. And the reason is a battle between two forces that the naive simulation completely ignores. That's what this episode is about.

Voiceover: "In a vacuum, everything falls the same. Add air, and suddenly everything is different. Today we're going to code free fall — first wrong, then right. And the bugs are going to teach us exactly why air resistance is one of the most important forces in physics."

---

## The Naive Attempt

Open the code editor split with a blank canvas. Start with the simplest possible physics simulation — the kind every game dev writes their first week.

```javascript
// B001 — Naive free fall: no air resistance
const g = 9.81; // m/s² — gravitational acceleration
let velocity = 0;
let position = 0;

function update(dt) {
  velocity += g * dt;        // Euler integration: add gravity each frame
  position += velocity * dt; // Update position from velocity
}
```

Walk through this line by line. This is Euler integration — the simplest numerical integration method. Each frame, you add gravity to velocity, and velocity to position. It's elegant, it's simple, and in a vacuum it is 100% correct. Draw two balls on the canvas (a small feather-mass object and a heavy ball) and drop them. They hit the bottom at exactly the same time. Perfect vacuum physics.

Now say: "But wait, let me add air resistance." Show the tempting, wrong approach first — the "multiplier hack" that countless game tutorials use:

```javascript
// Naive "air resistance" — the wrong way
function update(dt) {
  velocity += g * dt;
  velocity *= 0.99;          // Just... multiply by something less than 1?
  position += velocity * dt;
}
```

Run it in vacuum mode (set the multiplier to 0.99 but show no air). Objects slow down. In a vacuum. The feather and the bowling ball both decelerate at the same rate because the damping is proportional to velocity, not tied to any physical property. This is wrong in every possible way — it violates Galileo, Newton, and basic physical intuition simultaneously.

Then show the opposite naive mistake: pure gravity, no damping at all, and run it for 10 simulated seconds. Open the velocity readout. The ball is now traveling at 98.1 m/s. After 30 seconds: 294.3 m/s. After 60 seconds: 588.6 m/s. That's faster than the speed of sound. A marble has just gone supersonic in your simulation. This is what happens when you forget air resistance entirely.

---

## The Moment of Failure

The canvas shows two objects falling under pure gravity (`velocity *= 1.0`, no damping) with a live velocity readout on the right side. Both objects — feather-mass (0.003 kg) and bowling ball (5 kg) — are labeled. Run the simulation for 30 simulated seconds compressed into a few screen-seconds.

The velocity counter spins up. 50 m/s. 100 m/s. 200 m/s. The objects have long since exited the bottom of the canvas — they're theoretically still falling off-screen into infinity. Display their current positions: the feather is now 44,000 meters below the drop point. That's 44 kilometers. That's higher than the cruising altitude of a commercial aircraft. Both objects have reached the same absurd depth in the same absurd time.

Zoom out the canvas view — show a tiny Earth icon at the top, and trace how far the objects have "fallen." It's past the stratosphere. It's in low Earth orbit territory. And they're still accelerating.

For the damping hack failure, show the separate disaster: in a vacuum (no air at all by definition), both objects are losing energy. The velocity readout decreases over time even though nothing is opposing the motion. Drop a feather and a bowling ball from a standstill in a perfect vacuum — the damping model shows them both reaching 85% of their expected velocity instead of 100%. If you ran this long enough, both objects would asymptote toward zero velocity — falling forever but never arriving — which is physically nonsensical.

Put the two failures side by side. Text overlay: "One simulation ignores physics entirely. The other invents physics that doesn't exist. Neither is air resistance."

---

## Why It Broke — The Physics

Air resistance — more precisely, aerodynamic drag — is a force. Not a multiplier. Not a constant subtraction. A force, just like gravity, that obeys Newton's Second Law. And crucially, it depends on velocity in a specific, non-linear way.

The drag force for objects moving through a fluid at moderate to high velocities follows the quadratic drag law:

$$F_{drag} = \frac{1}{2} \rho C_d A v^2$$

Where:
- **ρ** (rho) = density of the fluid (air: ~1.225 kg/m³ at sea level)
- **C_d** = drag coefficient (dimensionless: 0.47 for a sphere, 1.28 for a flat plate, ~1.0–1.3 for a human skydiver)
- **A** = cross-sectional area of the object (m²)
- **v** = velocity (m/s) — and this is squared, which is the key nonlinearity

The `v²` term is what makes this interesting. At low speeds, drag is negligible. But as velocity increases, drag grows as the square — double the speed, quadruple the drag. This creates an automatic speed-limiting mechanism.

The net downward force on a falling object is:

$$F_{net} = mg - \frac{1}{2} \rho C_d A v^2$$

When the object first starts falling (v = 0), F_net = mg, so acceleration = g. As the object speeds up, drag grows. At some velocity, F_drag = mg exactly. At that point, F_net = 0. Acceleration is zero. Velocity stops increasing. That velocity is terminal velocity.

This is not a cap applied from outside. It's not a hack. It's the natural equilibrium point that falls out of the physics equations automatically — and it's different for every object because it depends on mass, size, and shape.

---

## The One Concept

**Terminal Velocity** is the constant speed a freely falling object eventually reaches when the drag force exactly equals the gravitational force acting on it.

**Formal Definition:** Terminal velocity v_t is the speed at which the net force on a falling object is zero:
$$F_{drag} = F_{gravity}$$
$$\frac{1}{2} \rho C_d A v_t^2 = mg$$
$$\boxed{v_t = \sqrt{\frac{2mg}{\rho C_d A}}}$$

**Physical Intuition:** Think of drag as a spring. The harder you push against it (the faster you move), the harder it pushes back. Unlike a real spring (which is linear), drag pushes back quadratically — disproportionately harder at high speeds. There is always a speed where drag's pushback exactly cancels gravity's pull. Every falling object finds its own equilibrium speed based on its mass and geometry.

**Key numbers in real life:**
- Skydiver (belly-to-earth): ~55 m/s (~200 km/h)
- Skydiver (head-down): ~75 m/s (~270 km/h)
- Feather: ~0.5–1.5 m/s (barely faster than a gentle walk)
- Raindrop: ~9 m/s (~32 km/h) — if there were no terminal velocity, raindrops would hit like bullets
- Cannonball: ~100–150 m/s before air significantly deflects it
- Golf ball (dropped): ~32 m/s

**Why the formula makes physical sense:** Heavier objects (larger m) have higher terminal velocity — they need a bigger drag force to stop their acceleration. Objects with larger cross-sections (larger A) have lower terminal velocity — they hit more air per second. Objects with high drag coefficients (large Cd, like a parachute or a flat plate) slow down more. Air density matters: on Mars (ρ ≈ 0.020 kg/m³, compared to Earth's 1.225), terminal velocities are about 8× higher.

---

## The Fix

Replace the Euler integration with the physically correct force calculation:

```javascript
// B001 — Correct free fall with quadratic drag
const g = 9.81;       // m/s² — gravitational acceleration
const rho = 1.225;    // kg/m³ — air density at sea level

// Per-object properties
const objects = [
  { name: "Feather",      mass: 0.003, Cd: 1.0,  A: 0.01,   color: "#e8d5b7" },
  { name: "Golf Ball",    mass: 0.046, Cd: 0.25, A: 0.00143, color: "#ffffff" },
  { name: "Skydiver",     mass: 80,   Cd: 1.0,  A: 0.7,    color: "#ff6b35" },
  { name: "Bowling Ball", mass: 5.0,  Cd: 0.47, A: 0.0366, color: "#2d2d2d" },
  { name: "Cannonball",   mass: 4.0,  Cd: 0.47, A: 0.0095, color: "#8b7355" },
];

function update(obj, dt) {
  // Drag force magnitude: F_drag = 0.5 * rho * Cd * A * v²
  const dragForce = 0.5 * rho * obj.Cd * obj.A * obj.velocity * obj.velocity;

  // Net acceleration: gravity down, drag up (opposing motion)
  // When dragForce = obj.mass * g → acceleration = 0 → terminal velocity
  const acceleration = g - dragForce / obj.mass;

  obj.velocity += acceleration * dt;
  obj.position += obj.velocity * dt;
}

// Terminal velocity — the simulation will naturally converge to this
function terminalVelocity(obj) {
  return Math.sqrt((2 * obj.mass * g) / (rho * obj.Cd * obj.A));
}
```

The beauty of this formulation is that it self-regulates. You don't set a terminal velocity — you don't need to. The formula naturally reaches equilibrium because as `obj.velocity` increases, `dragForce` grows as `v²`, reducing `acceleration`. When `dragForce / obj.mass` exactly equals `g`, the acceleration term is zero and velocity stays constant. The terminal velocity emerges from the physics, not from a cap.

Compare the terminal velocity formula analytically with what the simulation converges to — they match perfectly. This is the verification step: theory and code agree.

---

## The Wow Moment — Push It

Drop 50 objects simultaneously from the top of the canvas. Each object has a unique mass, drag coefficient, and cross-sectional area corresponding to a real object: a hydrogen bubble, a raindrop, a dandelion seed, a ping-pong ball, a baseball, a soccer ball, a shot put, a skydiver in flat position, a skydiver in tuck, a parachutist, a feather, a crumpled piece of paper, a flat sheet of paper, a car (dropped from a plane), a bowling ball, a cannonball, a meteor (ignoring ablation), and so on.

All 50 objects are released at the same instant from the same height. Watch them fan out into a beautiful, ordered spread. The slowest (a dandelion seed) barely moves, reaching terminal velocity of about 0.3 m/s in under a second and then floating down. The fastest (a small dense metal sphere) accelerates past all others and slams the bottom.

On the right side of the canvas, display a velocity-time graph for each object — color-coded lines that flatten out at different heights on the y-axis. Each line's plateau is that object's terminal velocity. The graph looks like a waterfall of curves, each finding its own horizontal asymptote.

Add an annotation that dynamically marks the "terminal velocity achieved" moment for each object — a small star or marker appears on each trail the instant its acceleration drops below 0.01 m/s². Some objects hit terminal velocity in 1 second (feather). Others take 30+ seconds (cannonball). The canvas becomes a visual lesson in how physical properties determine terminal behavior.

Finally, enable "vacuum mode" — toggle off air resistance. All 50 objects immediately begin accelerating at exactly g = 9.81 m/s², all at the same rate, all arriving at the bottom simultaneously. The spread collapses to a single synchronized wave. Galileo wins.

---

## The Interactive Demo

**Live browser demo at the end of the video — controls layout:**

**Top row — Environment sliders:**
- `Gravity` — slider from 0.38 m/s² (Mercury) through 1.62 (Moon), 9.81 (Earth), 11.2 (Neptune), to 24.8 m/s² (Jupiter). Labels update in real time. The planet icon changes.
- `Air Density (ρ)` — slider from 0 (perfect vacuum) through 0.020 (Mars surface), 1.225 (Earth sea level), 1.450 (Earth -1000m/below sea level analogue), to 1000 kg/m³ (liquid water). Labels: "Vacuum" → "Mars" → "Earth" → "Venus" → "Water"
- `Temperature` (bonus) — affects air density via ideal gas law, shown as a secondary effect on the ρ value

**Middle row — Object panel:**
- `Mass` — slider 0.001 kg to 100 kg (log scale)
- `Cross-section Area (A)` — slider 0.0001 m² to 10 m² (log scale)
- `Drag Coefficient (Cd)` — slider 0.04 (streamlined bullet) to 2.0 (cup/concave shape), with labeled presets: sphere (0.47), cylinder (0.82), flat plate (1.28), parachute (1.75)
- Preset object buttons: Feather / Golf Ball / Skydiver / Parachutist / Cannonball / Raindrop / Car

**Bottom controls:**
- `Drop Object` button — releases the current object configuration
- `Drop All Presets` button — drops all 8 presets simultaneously for comparison
- `Vacuum Mode` toggle — disables drag; objects fall identically
- `Slow Motion` toggle (0.1× speed)
- `Reset` button — clears all objects and resets simulation

**Live readouts panel (right side):**
- Current velocity (m/s and km/h)
- Current acceleration (m/s²)
- Drag force (N)
- Gravity force (N)
- Predicted terminal velocity (from formula, shown even before reached)
- Actual current terminal velocity status: "Still accelerating" / "TERMINAL VELOCITY REACHED ✓"

**Canvas area:** Objects shown as colored circles, trails fading behind them. Force arrows drawn on the selected object: green arrow down (gravity, constant length), red arrow up (drag, grows as v increases). At terminal velocity, both arrows are equal length.

---

## Production Notes

**Runtime target:** 12–16 minutes total

**Segment breakdown:**
- 0:00–1:00 — Hook (vacuum vs. air drop, feather terminal velocity reveal) — 1 min
- 1:00–4:00 — Naive code walkthrough (Euler integration, multiplier hack, velocity readout disaster) — 3 min
- 4:00–6:30 — The physics breakdown (drag equation derivation, ρCdAv² explained term by term) — 2.5 min
- 6:30–9:00 — The concept (terminal velocity, formula, real-world numbers) — 2.5 min
- 9:00–11:00 — The fix (correct code, self-regulation demo, formula verification) — 2 min
- 11:00–13:30 — The wow moment (50-object drop, vacuum toggle, velocity graph) — 2.5 min
- 13:30–15:00 — Interactive demo walkthrough — 1.5 min

**Screen layout:** 60% canvas / 40% code editor split. Use VS Code with a dark theme (Tokyo Night or Dracula). Font size 20+ for readability. Code typing should be real — no jump cuts in the code sections, let the audience follow along.

**Zoom moments:**
- ZOOM at the feather's terminal velocity moment (velocity graph flatlines)
- ZOOM at the "velocity = 10,000 m/s" readout for the naive simulation
- ZOOM on the force arrow animation when drag exactly equals gravity
- ZOOM on the 50-object spread pattern at 10 seconds

**Animations to pre-render:**
- Apollo 15 feather/hammer drop (public domain NASA footage — use directly)
- Slow-motion split screen of vacuum vs. air (can be generated from the sim itself)
- The "force arrows growing" animation showing drag increasing with velocity
- The v-t curve for each object in the 50-object wow demo

**B-roll suggestions:** Real sky-diver footage (royalty-free), slow-motion rain footage (for the raindrop terminal velocity context), wind tunnel footage.

**Key on-screen text overlays:**
- When showing naive simulation: red banner "THIS IS WRONG"
- When showing correct simulation: green banner "PHYSICALLY ACCURATE"
- Terminal velocity formula displayed prominently for 3+ seconds

---

## Tags

`physics` `simulation` `drag` `terminal-velocity` `free-fall` `javascript` `canvas` `beginner`

---

## Thumbnail

Frame: Split down the middle with a bright dividing line. Left half (blue tint, "VACUUM"): a feather and a bowling ball side by side, midway through a fall, perfectly aligned, same height. Right half (orange tint, "AIR"): feather almost motionless near the top, bowling ball much lower and trailing a speed-blur streak. Large red velocity readout numbers float next to each: "0.9 m/s" next to the feather, "18.4 m/s" next to the bowling ball. Top-center: white bold text "SAME DROP. DIFFERENT PHYSICS." Bottom: channel name CodedLaws in green monospace font. Emotion: that satisfying "aha" feeling — the thumbnail explains the whole video in one glance. Scroll-stopper: the dramatic positional difference between the two objects in air, combined with the velocity numbers that make the abstract concrete.
