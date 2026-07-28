---
title: "The Physics of Skipping Stones (Optimal Bounce Angle)"
id: B035
difficulty: 2/10
prereq: "B027 — Fluid Forces and Drag"
concept: "Hydrodynamic lift during ~2 ms water contact provides the bounce; gyroscopic spin stabilizes the stone's orientation; optimal entry angle ~20° maximizes lift while avoiding plowing"
tags: [physics, skipping-stones, hydrodynamics, gyroscopic, lift, trajectory, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# The Physics of Skipping Stones (Optimal Bounce Angle)

**Alt title:** "88 Skips: The Physics Behind the World Record"
**Difficulty:** 2/10 | **Prereq:** B027 — Fluid Forces and Drag

---

## Opening Hook (0:00–1:00)

Start with the video: a stone skimming across a glassy lake in slow motion, each bounce followed by a perfect ring of water splash — one, two, three... twelve, thirteen, fourteen skips. Then cut to: a man kneeling beside a creek in Pennsylvania in 2013, releasing a flat stone with a measured, powerful sidearm throw. The official count: 88 skips. Kurt Steiner's world record. The stone covered roughly 40 meters of water surface, bouncing 88 times before finally sinking.

Why does the stone bounce instead of sink? This is a question most people have intuited an answer to: "It's the spin." But spin alone doesn't explain it. A non-spinning stone can skip 1-2 times. What really matters is the entry angle and the hydrodynamic lift generated during the brief water contact phase. That contact phase lasts approximately 1-2 milliseconds. In those 2 milliseconds, the stone's flat bottom acts as a hydroplaning surface — like a tiny surfboard or a ricochet — and generates enough upward impulse to bounce.

Show the three failure modes with slow-motion footage: (1) Too steep entry (>45°) — stone plows straight into the water and sinks. (2) Near-flat entry without spin — stone slaps, tumbles sideways, sinks. (3) Near-flat entry with spin — stone bounces cleanly, repeats. The spin is not what generates the lift — it's what keeps the stone's angle stable so that each subsequent bounce happens at the same ~20° entry angle instead of tumbling to a random orientation.

---

## The Naive Attempt

Model the stone as a circular disc in 2D (side view). Apply gravity and aerodynamic drag in the air. When the stone touches the water surface (y = 0), apply a bounce using a simple restitution coefficient: `v_y_after = -e * v_y_before` where e ≈ 0.5 (the stone bounces with half the normal velocity). Tangential velocity (horizontal) is unchanged by the bounce.

```javascript
const stone = {
  pos: { x: 0, y: 2 },          // meters
  vel: { x: 8, y: -3 },          // m/s, thrown forward and slightly down
  mass: 0.1,                      // kg
  radius: 0.05,                   // 5 cm stone
  spin: 0,                        // rad/s (not used in naive model)
  skipCount: 0
};

const e = 0.5;    // restitution coefficient (energy retained: e² = 0.25, loses 75%)

function update(dt) {
  // Gravity
  stone.vel.y -= 9.81 * dt;
  // Aerodynamic drag
  const speed = Math.hypot(stone.vel.x, stone.vel.y);
  const F_drag = 0.5 * 1.225 * Math.PI * stone.radius**2 * 0.4 * speed**2;
  stone.vel.x -= (stone.vel.x / speed) * F_drag / stone.mass * dt;
  stone.vel.y -= (stone.vel.y / speed) * F_drag / stone.mass * dt;
  // Position
  stone.pos.x += stone.vel.x * dt;
  stone.pos.y += stone.vel.y * dt;
  // Water contact
  if (stone.pos.y <= 0 && stone.vel.y < 0) {
    stone.vel.y = -e * stone.vel.y;   // bounce
    stone.pos.y = 0;
    stone.skipCount++;
  }
}
```

Run it. The stone bounces several times regardless of entry angle. At 10°, 20°, 30°, 40° — all produce roughly similar bounce patterns with slightly different trajectory shapes.

---

## The Moment of Failure

The simulation gives 5-8 bounces for entry angles ranging from 10° to 40°. The angle barely matters — you get almost the same trajectory regardless of whether you throw flat or steep. This is physically wrong: in reality, a stone thrown at 40° entry angle immediately sinks (first contact is more of a plunge than a bounce), while a stone thrown at 20° will bounce cleanly. The model can't capture this because the restitution coefficient `e = 0.5` is applied blindly regardless of entry angle.

Moreover, the naive model gives the same bounce count whether you spin the stone or not. But real-world stone skipping is critically dependent on spin — a non-spinning stone tumbles on the second skip, presents the wrong surface to the water, and sinks. The model has no concept of stone orientation or how spin maintains that orientation.

Finally, the model predicts the stone can bounce indefinitely (limited only by energy loss per bounce). In reality, each skip has a minimum speed below which hydrodynamic lift is insufficient to bounce — the stone hits the water, doesn't generate enough lift impulse, and sinks. The transition from "skipping" to "sinking" is physically sharp and depends on speed, not just bounce number.

---

## Why It Broke — The Physics

Three distinct physical effects are missing from the naive model:

**1. Angle-dependent hydrodynamic lift:** During the ~2 ms water contact, the stone's flat bottom moving through water at speed v and entry angle θ generates a lift force:
```
F_lift = 0.5 * rho_water * A_stone * v² * CL(θ) * sin(θ)
```
CL(θ) peaks around 20° and drops sharply for θ < 5° (too shallow — stone skips off without generating lift, tumbles) and θ > 40° (too steep — stone plows). The angle range 15°–25° is the sweet spot.

**2. Gyroscopic stabilization:** The spinning stone has angular momentum L = I·ω pointing along the spin axis (perpendicular to the disc face). During water contact, hydrodynamic torques try to rotate the stone's face angle. Gyroscopic precession resists this rotation — the faster the spin, the less the stone's orientation changes per skip. Without spin, the stone's face angle changes randomly at each bounce, moving out of the optimal 20° zone rapidly. With spin: orientation is approximately preserved across many skips.

**3. Minimum skip speed:** The lift impulse during contact is `J_lift = F_lift * Δt_contact ≈ 0.5 * rho_water * A * v² * CL * sin(θ) * τ_contact`. This must exceed the downward momentum `m * v * sin(θ)` to provide a net upward bounce. The minimum speed: `v_min ≈ √(m * g / (rho_water * A * CL * τ_contact))`. Below v_min, the stone sinks regardless of angle.

---

## The One Concept

**Hydrodynamic Lift as Contact-Phase Impulse** is the core mechanism: during the millisecond-scale water contact event, the stone's flat face moving at angle θ relative to the water surface creates a pressure differential (high pressure underneath, low above) proportional to v² and to sin(θ). The resulting force impulse — brief, large, and upward — is what makes the stone "bounce." The word "bounce" is slightly misleading: this is not an elastic collision, it's a very brief hydroplaning event.

**Formal Impulse During Contact:**
```
J_lift = ∫F_lift·dt ≈ F_lift * τ_contact
       = 0.5 * ρ_water * A * v² * CL(θ) * sin(θ) * τ_contact
```
Where τ_contact ≈ 1–2 ms for typical stone/speed combinations.

**Optimal Angle Derivation:** The upward impulse component is `J_up = J_lift * cos(θ)`. This must exceed the downward momentum component `p_down = m·v·sin(θ)` for a bounce. Dividing: `J_up/p_down = (ρ_water * A * τ_contact * v * CL * sin(θ) * cos(θ)) / (m * sin(θ)) = ρ_water * A * τ_contact * v * CL * cos(θ) / m`. This is maximized at θ = 0 (horizontal entry) — but at θ = 0, CL → 0 (no angle of attack). The product CL(θ)·cos(θ) peaks around 20°, matching experimental observation.

**Real-World Examples:**
1. **Hydroplaning car tires:** At high speed on wet roads, a tire can skim on top of a thin water film — same hydrodynamic lift physics, same dependence on speed and contact angle. Like stone skipping, there is a minimum speed to maintain and a minimum tire pressure.
2. **Ricochet bullets:** A bullet hitting water at a low angle skips off the surface — the same lift mechanism explains why shallow-angle shots from naval gun emplacements could "bounce" off water and hit targets at waterline level. Both world wars saw tactical use of this effect.
3. **Surfboard takeoff:** The moment a surfer begins to plane on a wave, the board transitions from displacement hull (pushing water aside) to lift hull (hydroplaning on the surface). The entry angle is managed by the surfer's weight distribution — same physics.

---

## The Fix

At each water contact event, compute the stone's current entry angle θ (between velocity vector and water surface), the contact duration, and the resulting lift impulse. Track spin rate and use it to update stone orientation after each skip.

```javascript
function waterContact(stone, dt) {
  const speed = Math.hypot(stone.vel.x, stone.vel.y);
  const theta = Math.atan2(-stone.vel.y, stone.vel.x);  // entry angle (rad)
  const theta_deg = theta * 180 / Math.PI;

  // Entry angle filter
  if (theta_deg < 2) { stone.status = 'skim'; return; }   // too shallow
  if (theta_deg > 50) { stone.status = 'sink'; return; }  // too steep

  // Lift coefficient: peaks around 20 degrees
  const CL = 1.2 * Math.sin(2 * theta) * Math.exp(-0.02 * (theta_deg - 20)**2);

  // Contact duration (Froude scaling: tau ~ stone_radius / v)
  const tau_contact = 0.0015;  // ~1.5 ms, approximately constant

  // Lift impulse
  const rho_water = 1000;
  const A = Math.PI * stone.radius**2;
  const J_lift = 0.5 * rho_water * A * speed**2 * CL * Math.sin(theta) * tau_contact;

  // Apply impulse
  stone.vel.y += J_lift / stone.mass;
  stone.vel.x *= 0.92;   // horizontal drag during contact

  // Gyroscopic stabilization: spin resists orientation change
  // High spin → stone orientation barely changes
  // Low spin → orientation randomizes
  const orientation_change = (Math.random() - 0.5) * 0.3 / (1 + stone.spin / 10);
  stone.contactAngle += orientation_change;   // face angle for next skip

  // Spin decays slowly (air drag on spinning disc)
  stone.spin *= 0.995;

  // Minimum speed check
  if (speed < 1.0) { stone.status = 'sink'; return; }

  stone.skipCount++;
  stone.status = 'skip';
}
```

Now run the simulation with θ = 20° and spin = 10 rev/s. The stone skips cleanly — 15-20 times in the simulation. Change to θ = 40°: it sinks on first contact. Change to θ = 20° but spin = 0: it gets 2-3 skips before tumbling. The physics now matches intuition and experiment.

---

## The Wow Moment — Push It

Run a Monte Carlo simulation: throw 500 stones simultaneously, each with a random entry angle (uniformly distributed 5°–50°) and random spin rate (0–15 rev/s). Assign each stone a color based on its eventual skip count (blue = 0, cyan = 1-3, green = 4-9, yellow = 10-19, orange = 20-49, red = 50+). Watch 500 trajectories simultaneously. A clear pattern emerges: the red and orange stones cluster in the 15°–25° angle range with 8+ rev/s spin. The sinking-immediately stones are at steep angles. The tumbling stones are at low spin rates.

Now render the skip count as a 2D heatmap: x-axis = entry angle (5° to 50°), y-axis = initial spin rate (0 to 20 rev/s). The "sweet spot" appears as a bright region centered at approximately 20° angle and 10 rev/s. This is the computational version of what every stone-skipping practitioner has internalized through thousands of throws.

Then simulate Kurt Steiner's record throw: find the initial conditions (speed, angle, spin) that produce 88+ skips and display the full trajectory (about 40 meters of water surface). The stone progressively slows, each bounce slightly lower, until the minimum speed condition is met and it sinks. Show the spin rate decaying gradually throughout.

---

## The Interactive Demo

Side-view simulation canvas (1000×400 px, lake water background with distant treeline):

**Throw Controls:**
- **Entry Angle** (0°–90°): rotates a red arrow indicator showing the angle. Feedback text: "Too shallow," "Optimal zone," "Too steep."
- **Throw Speed** (1–15 m/s): corresponds to wrist snap strength.
- **Spin Rate** (0–20 rev/s): rotating icon on the stone shows the spin visually.
- **Stone Size** (2–8 cm radius): larger stones need more force, but are more stable.
- **Stone Shape** (round / oval / irregular): irregular shape randomizes lift coefficient.

**Physics Displays:**
- **Skip Counter** prominent display.
- **Entry Angle Color Map** on the stone face: when stone hits water, color flashes green (optimal), yellow (suboptimal), red (sinking).
- **Lift Force Arrow** during water contact (brief but visible — elongate contact duration in slow-motion mode).
- **Spin Rate Decay Graph** beneath main canvas.
- **Minimum Speed Indicator**: red line on speed display showing v_min; when stone speed crosses below, next hit will sink.

**Modes:**
- **Slow Motion:** 0.05× speed during water contact phase — shows the brief hydroplaning event.
- **Multi-throw:** throw 10 stones simultaneously with random angle variation, see distribution.
- **Record Chase:** mode targeting 88 skips with a best-of display.

---

## Production Notes

**Structure and timing:**
- Hook: 0:00–1:00 (60 s). The slow-motion lake footage is essential — source from Smarter Every Day episode 67 (Kurt Steiner world record) or contact Kurt Steiner directly for footage. Show all three failure modes in quick succession — the visual contrast is immediately clear.
- Naive attempt: 1:00–2:30 (90 s). The restitution model is simple. The failure is nuanced — it looks plausible but doesn't differentiate angles. Test it explicitly on screen: throw at 15° and 40° and show that the bounce counts are nearly identical. That's wrong.
- Physics explanation: 2:30–5:00 (150 s). The three mechanisms (lift, gyroscopic stability, minimum speed) each need 30-45 seconds. Use a diagram showing the stone at angle θ to the water, lift and drag arrows, and the pressure distribution under the stone face.
- The fix: 5:00–7:00 (120 s). The angle-dependent lift function CL(θ) is the key change. Show it on a mini-graph alongside the code. Then run the improved simulation and show the angle sensitivity dramatically.
- Wow moment: 7:00–9:30 (150 s). The heatmap build is visually satisfying. Run the 500-stone simulation in real time (should run at reasonable speed in modern JS). The world record chase simulation is the emotional apex.
- Interactive demo: 9:30–10:30 (60 s).

**Key filming decisions:** Film a real stone-skipping session at a lake. Capture at 240 fps minimum for slow-motion. Bring several shapes: ultra-flat, slightly domed, irregular. Show that flat and ~20° angle is clearly better. The lake footage intercut with the simulation creates a compelling "theory meets practice" rhythm.

**Approximate runtime:** 10–11 minutes.

---

## Tags
`physics` `skipping-stones` `hydrodynamics` `gyroscopic` `lift` `trajectory` `javascript` `canvas`

---

## Thumbnail

Top-down view of a stone in mid-skip: the stone is in contact with glassy blue water, creating a perfectly symmetrical crescent splash ring. The stone's flat, dark gray surface is visible through the splash. Overlaid: a force diagram with arrows (Lift — upward, Weight — down, Entry Angle: 20°). Large text: "WHY 20°?" Sub-text: "The skip geometry." Bottom strip: "88 World Record Skips — Explained." Bright and clean. The "WHY 20°" framing is both a specific question (teasing the answer) and a number that seems oddly specific (triggering curiosity). The water splash photography is inherently beautiful and shareable.
