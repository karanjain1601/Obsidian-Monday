---
title: "Kite Physics: Balancing Lift, Drag, and String Tension"
id: B037
difficulty: 2/10
prereq: "B009 — Aerodynamic Lift"
concept: "A kite's equilibrium altitude is determined by the vector balance of lift, drag, weight, and string tension; the string angle equals arctan(L/D) = arctan(CL/CD), set by the kite's aspect ratio"
tags: [physics, kite, aerodynamics, lift, drag, force-balance, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Kite Physics: Balancing Lift, Drag, and String Tension

**Alt title:** "Why High-Aspect Kites Fly Near Overhead (And Box Kites Don't)"
**Difficulty:** 2/10 | **Prereq:** B009 — Aerodynamic Lift

---

## Opening Hook (0:00–1:00)

Show three kites flying simultaneously in a steady 10 m/s wind: a classic diamond kite (low aspect ratio), a long narrow delta kite (high aspect ratio), and a large box kite. Same wind. Same string length (50 m). Yet their positions in the sky are dramatically different: the box kite hangs at about 30° above the horizon, the diamond kite at about 50°, and the narrow delta kite at nearly 75° — nearly overhead. 

Why? It's not about size — the box kite is largest. It's not about weight — the delta is lightest but flies highest. The answer is in the lift-to-drag ratio (L/D) of each kite's shape. Lift acts perpendicular to wind flow, drag acts parallel. The string tension must balance both. The angle the string makes with the horizontal directly equals arctan(L/D). Higher L/D → shallower string angle → higher kite position. And L/D is determined almost entirely by the kite's wing aspect ratio (span² / area).

Draw the four force vectors on the overhead kite in the simulation: Lift (up-perpendicular to wind), Drag (downwind-parallel), Weight (straight down), and String Tension (along the string toward anchor). Show them closing into a parallelogram of forces — they must sum to exactly zero for equilibrium. This is static force balance made visually beautiful.

---

## The Naive Attempt

Model the kite as a point mass at a fixed position in the sky. Apply gravity downward. Apply "wind force" upward-and-forward (a single combined force). Adjust the wind force until the kite is in equilibrium. The kite floats at whatever position you manually set, with "string tension" simply being the difference between the net force and gravity.

```javascript
const kite = {
  pos: { x: 0, y: 50 },     // meters from anchor (x=horizontal, y=vertical)
  mass: 0.3,                  // kg
  area: 0.5,                  // m²
  CL: 0.8,                    // fixed lift coefficient
  CD: 0.3                     // fixed drag coefficient — no aspect ratio!
};

const wind = { speed: 10, direction: { x: 1, y: 0 } };  // horizontal wind

function computeForces() {
  const rho = 1.225;
  const q = 0.5 * rho * wind.speed**2;
  // Single "wind force" — not separated into lift and drag
  const windForce = q * kite.area * 1.0;  // magic constant upward component
  // String tension: whatever is needed to keep kite stationary
  const gravity = kite.mass * 9.81;
  const T = Math.sqrt(windForce**2 + gravity**2);
  return { lift: windForce, drag: 0, tension: T };
}
```

This model puts the kite at whatever height you specify and computes a corresponding tension. Wind speed can be changed — nothing happens to the kite's position. String angle is fixed by the initial position, not computed from physics.

---

## The Moment of Failure

Change the wind speed from 10 m/s to 20 m/s in the naive simulation. The kite doesn't move — it stays at the same height because the position is manually fixed. The tension number changes, but the kite's location in the sky doesn't. Real kites climb when wind speed increases (briefly, until a new equilibrium is found) — and they definitely don't stay at a fixed position.

Now change the kite from a diamond to a delta kite (different CL/CD ratio). Again, no change in the simulation. Both kite types sit at the same altitude. This is clearly wrong: a delta kite's high aspect ratio gives it L/D ≈ 6 while a box kite might have L/D ≈ 2, and this directly determines the string angle.

Most fundamentally: the string constraint is not modeled at all. The string is not just a visual attachment — it is a critical force element. The string's direction changes as the kite rises or falls, which changes the tension direction, which changes the force balance, which determines where the kite settles. The string direction, the kite equilibrium position, and the tension magnitude are all mutually dependent through a self-consistent set of equations. The naive model has completely decoupled these.

---

## Why It Broke — The Physics

A kite in steady flight is in static equilibrium. The four forces — Lift **L**, Drag **D**, Weight **W**, and String Tension **T** — must sum to zero: `L + D + W + T = 0`.

Decompose into x (horizontal, along wind) and y (vertical):
```
x: D - T*cos(θ_string) = 0   →   T*cos(θ_string) = D
y: L - W - T*sin(θ_string) = 0   →   T*sin(θ_string) = L - W
```
Dividing y by x:
```
tan(θ_string) = (L - W) / D
```
For a large kite where W << L:
```
θ_string ≈ arctan(L/D) = arctan(CL/CD)
```
The string angle is directly the arctan of the lift-to-drag ratio! This is the key result. And CL/CD = L/D is the kite's aerodynamic efficiency — set by its geometry, particularly its aspect ratio:
```
L/D ≈ AR / (π * e)   [for slender wings at moderate angle of attack]
```
where AR = span²/area is the aspect ratio and e ≈ 0.85 is the Oswald efficiency factor. Higher aspect ratio → higher L/D → higher string angle → kite flies higher.

The aerodynamic forces themselves:
```
L = 0.5 * rho * v_wind² * A * CL
D = 0.5 * rho * v_wind² * A * CD
```
Both scale with v² — so the equilibrium angle is independent of wind speed (as long as the kite doesn't stall). This explains why kites find the same angle regardless of whether the wind is 8 or 14 m/s, once equilibrium is reached.

---

## The One Concept

**Static Force Equilibrium for a Kite** is the principle that at any stable flying position, the vector sum of all forces acting on the kite is exactly zero. The string tension adjusts automatically (it is a constraint force) to satisfy this equilibrium at whatever position the kite naturally finds. The string angle encodes the kite's lift-to-drag ratio.

**The Four Force Diagram:**
```
Vector sum: L + D + W + T = 0
Equilibrium: L = (T*sin θ + W),   D = T*cos θ
String angle: θ = arctan((L-W)/D)
```

**Physical Intuition:** Imagine the wind as a ramp tilted at angle arctan(D/L) — a shallow ramp for high L/D kites, a steep ramp for low L/D kites. The kite sits on this wind ramp, and the string goes perpendicular to the ramp surface (approximately). High-performance gliders have L/D ~ 40; a high-aspect delta kite can achieve L/D ~ 8; a diamond kite is ~3; a box kite ~1.5.

**Tension and String Design:** At equilibrium, `T = √(D² + (L-W)²)`. For a 10 m² power kite in 15 m/s wind: L ≈ 700 N, D ≈ 100 N, W = 15 N. T ≈ 708 N — about the weight of 70 kg (a full adult) hanging from the string. This is why kite-surfing harnesses are critical safety equipment.

**Real-World Examples:**
1. **Kite surfing (kiteboarding):** A modern leading-edge inflatable (LEI) kite with AR ≈ 5-6 achieves L/D ≈ 5-7. The rider is pulled through the water by the horizontal component of string tension. By moving the kite in a figure-8 pattern through the wind window, riders can increase the effective wind speed seen by the kite by 2× and thus increase traction by 4×.
2. **High-altitude wind energy (HAWE):** Companies like Makani (Google X) and SkySails build "flying electric generators" — kites or gliders at 300-600 m altitude where winds are stronger and steadier. The tethered craft flies in loops or figure-8s, and the tension on the tether is converted to electricity at the ground station. The kite's L/D determines how much of the wind power is extractable.
3. **Kite-assisted ship propulsion:** SkySails' 320 m² parafoil kite flies at 100-300 m altitude (stronger winds) and provides 1,000-5,000 kN of pull on cargo vessels, reducing fuel consumption by 10-35%. The string angle must be carefully managed to ensure the pull vector is approximately horizontal (forward) rather than upward. The same force balance applies.

---

## The Fix

Model the kite as a point mass constrained to a string of fixed length, with string angle θ as the dynamic variable. Compute aerodynamic forces from kite geometry. Integrate the equation of motion in (θ, θ_dot) space until equilibrium.

```javascript
function findEquilibrium(kite, wind) {
  const rho = 1.225;
  const q = 0.5 * rho * wind.speed**2;

  // Aerodynamic forces (at zero angle of attack — simplified)
  const L = q * kite.area * kite.CL;
  const D = q * kite.area * kite.CD;
  const W = kite.mass * 9.81;

  // Equilibrium string angle
  if (L <= W) return null;   // kite can't fly — lift insufficient to overcome weight
  const theta_eq = Math.atan2(L - W, D);   // equilibrium string angle (rad)
  return { theta: theta_eq, tension: Math.sqrt(D**2 + (L-W)**2) };
}

// Dynamic model: kite can oscillate around equilibrium
function updateDynamic(state, kite, wind, dt) {
  const { theta, dtheta } = state;
  const L_string = kite.stringLength;
  const rho = 1.225;
  const q = 0.5 * rho * wind.speed**2;

  const L = q * kite.area * kite.CL;
  const D = q * kite.area * kite.CD;
  const W = kite.mass * 9.81;

  // Net tangential force on kite (perpendicular to string)
  const F_tangential = (L - W) * Math.cos(theta) - D * Math.sin(theta);
  const alpha = F_tangential / (kite.mass * L_string);  // angular acceleration

  // Damping (air resistance to kite oscillation)
  const alpha_damped = alpha - 0.3 * dtheta;

  return {
    theta: theta + dtheta * dt,
    dtheta: dtheta + alpha_damped * dt
  };
}
```

Show the kite converging to equilibrium from different starting positions. Show the equilibrium angle changing when CL/CD changes. Show the four force vectors updating in real time.

---

## The Wow Moment — Push It

Simulate kite surfing with full physics. A 12 m² power kite (AR = 5, CL = 1.2, CD = 0.25, L/D = 4.8) in 15 m/s wind. Compute the traction force pulling the rider (80 kg + board): horizontal string tension component = T·cos(θ_string). With T ≈ 1,200 N and θ ≈ 78° (nearly overhead): horizontal pull ≈ 250 N. Simulate the rider accelerating across water: a = 250/80 ≈ 3.1 m/s². Show the speed building from 0 to 30 km/h over 3 seconds of wind power.

Then show the "power stroke" — the kite pilot moves the kite from one side of the wind window to the other in a sweeping arc. As the kite moves, its velocity relative to the ground increases (it's sweeping across the wind), increasing the effective wind speed seen by the kite. Show the traction force spiking to 3,000+ N during the power stroke — enough to launch the rider 5 meters into the air. This is the physics behind kite jumping.

Finally, scale up: simulate the SkySails 320 m² cargo kite in 12 m/s wind. Traction force: ~20,000 N = 20 kN. On a 20,000-tonne cargo ship: acceleration is tiny, but power savings are enormous — 20 kN × 6 m/s ship speed = 120 kW of free propulsion from wind.

---

## The Interactive Demo

Outdoor sky simulation canvas (900×600 px, realistic sky background with cloud layers and visible horizon):

**Kite Design:**
- **Kite Shape Selector:** Diamond / Delta / Box / Parafoil / Custom. Each pre-populates CL and CD.
- **Wing Span** and **Chord Length** sliders → computes area and aspect ratio → auto-computes L/D.
- **CL / CD Manual Override:** for custom designs.
- **Kite Mass** (grams): affects whether the kite can fly at current wind speed.
- **String Length** (1–200 m): sets the kite's maximum altitude.

**Wind and Environment:**
- **Wind Speed** (0–30 m/s): adjust and watch kite climb or descend to new equilibrium angle.
- **Wind Direction** (fixed horizontal for this demo — lateral wind is an extension).
- **Wind Gust Simulation:** toggle turbulence mode (random wind speed variations ±20%), watch kite oscillate.

**Physics Displays:**
- **Four Force Diagram** always shown on the kite: animated arrows for Lift (perpendicular to wind, green), Drag (along wind, orange), Weight (down, blue), Tension (along string, white). Arrow lengths scale with magnitude.
- **String Angle Display:** current angle in degrees.
- **Theoretical Equilibrium Angle:** arctan(L/D) shown as a dotted arc.
- **Tension Display** in Newtons.
- **L/D Ratio** display.

**Special Modes:**
- **Kite-Surf Mode:** add a rider mass and surface drag, show traction vs. speed curve.
- **Kite Ship:** scale to 320 m², show fuel savings calculator.
- **Force Loop Diagram:** animate the four force vectors joining tip-to-tail to form a closed quadrilateral (classic force polygon visualization).

---

## Production Notes

**Structure and timing:**
- Hook: 0:00–1:00 (60 s). Shoot three kites flying at different heights at a park on a steady wind day. Pre-mark the string angles with a protractor overlay in post. The visual contrast between the near-overhead delta and the low-hanging box kite is immediately striking.
- Naive attempt: 1:00–2:30 (90 s). The fixed-position model is intentionally trivial — maybe 10 lines of code. The failure is shown by changing wind speed and watching the kite not move. Brief but clear.
- Physics explanation: 2:30–5:00 (150 s). The four-force diagram is the visual core of this episode. Prepare an interactive animated version (pre-render or build as an embedded widget). The derivation of θ = arctan(L/D) should take no more than 60 seconds — it's a simple two-equation system. Spend remaining time on L/D vs. aspect ratio.
- The fix: 5:00–7:00 (120 s). Show the equilibrium solver and the dynamic oscillation model. The "kite settling into equilibrium from a wrong starting position" animation is satisfying and physically informative.
- Wow moment: 7:00–9:30 (150 s). The kite-surfing power stroke physics is exciting. Pre-compute the trajectory and show it as an animation of the kite sweeping through the wind window. The cargo ship fuel savings calculator is impressive at scale.
- Interactive demo: 9:30–10:30 (60 s).

**Key filming decisions:** Shoot kites against a bright blue sky for maximum contrast. Use a zoom lens to capture the kite details while showing the string angle. For the four-force diagram, animate it in the simulation with distinct bright colors for each force — this is the most important single visual in the video.

**Approximate runtime:** 10–11 minutes.

---

## Tags
`physics` `kite` `aerodynamics` `lift` `drag` `force-balance` `javascript` `canvas`

---

## Thumbnail

Three kites shown at different heights against a sunny sky: a box kite low-left, a diamond kite middle-center, a delta kite high-right near the top of frame. String lines visible from all three going down to a single anchor point at bottom-center. Overlaid on the delta kite: a small force diagram showing L, D, W, T arrows. Large bold text: "WHY DOES THIS ONE FLY HIGHER?" Arrow pointing to the delta kite. Sub-text: "Lift-to-Drag Ratio Explained." The visual immediately communicates the puzzle (same wind, same string, different positions) and the force diagram teases the physics explanation. Anyone who's flown different kites will immediately relate to the height difference.
