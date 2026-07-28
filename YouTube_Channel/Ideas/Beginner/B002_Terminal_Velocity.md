---
title: "Why Skydivers Stop Accelerating (Terminal Velocity in Code)"
id: B002
difficulty: 1.5/10
prereq: "B001_Free_Fall"
concept: "Quadratic drag force F_drag = ½ρCdAv² grows with v² until it equals gravity. The equilibrium gives v_terminal = √(2mg/(ρCdA))"
tags: [physics, drag, terminal-velocity, skydiving, quadratic-drag, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Skydivers Stop Accelerating (Terminal Velocity in Code)

**Alt title:** "The Code That Finds Its Own Speed Limit"
**Difficulty:** 1.5/10 | **Prereq:** [[B001_Free_Fall]]

---

## Opening Hook (0:00–1:00)

Open with real footage: a skydiver exits a plane at 4,000 meters, tumbles, stabilizes belly-to-earth, and spreads their arms and legs wide. The altimeter on their wrist is visible. Play the clip at 2× speed — for about 12 seconds of real time (24 seconds compressed), the skydiver is accelerating hard. Then something subtle happens: the altimeter numbers start ticking through at the same rate. Their body stops pitching and bucking against the airstream. They are in equilibrium. Terminal velocity: approximately 55 m/s, or 200 km/h, belly-to-earth.

Show a graph overlay on the footage: velocity on the y-axis, time on the x-axis. The curve climbs steeply from zero, then bends, then flattens into a perfectly horizontal line. That horizontal line is not something imposed on the skydiver from outside. It's not a speed limit painted in the sky. It is the exact speed at which the air pushing up equals the gravity pulling down — and it comes directly out of a physics equation.

Then say: "Most simulations get this wrong. They use linear drag — force proportional to velocity. It looks right-ish, but the terminal velocity it predicts is wrong, and the approach to terminal velocity looks nothing like reality. Today we're fixing both, and you're going to see exactly where the linear model breaks."

Cut to a side-by-side comparison: left panel shows linear drag model, right shows quadratic. Both are dropped from the same height. They both eventually plateau, but the plateau happens at different velocities, at different times, and the shapes of the velocity curves are fundamentally different. The quadratic model matches the real skydiver data. The linear model does not.

---

## The Naive Attempt

B001 built the gravity-only model. This episode starts one step further — with a linear drag model that students and game developers frequently implement first because it looks physically plausible and it's easy to code:

```javascript
// B002 — Naive linear drag: F_drag = k * v
const g = 9.81;      // m/s²
const k = 14.0;      // linear drag constant (units: kg/s)
const mass = 80.0;   // kg — skydiver mass

let velocity = 0;
let position = 0;

function update(dt) {
  const dragForce = k * velocity;           // Linear drag: proportional to v
  const netForce  = mass * g - dragForce;   // Gravity minus drag
  const acceleration = netForce / mass;     // F = ma → a = F/m

  velocity  += acceleration * dt;
  position  += velocity * dt;
}

// Analytical terminal velocity for linear drag:
// At equilibrium: k * v_t = m * g → v_t = m*g / k
const vTerminalLinear = (mass * g) / k;
// For mass=80, k=14: v_t = 80*9.81/14 ≈ 56 m/s
// Looks right! But the model is still wrong...
```

Walk through why this looks deceptively good at first. The terminal velocity formula `v_t = mg/k` can be tuned — by choosing k = 14 for an 80 kg skydiver, we get v_t ≈ 56 m/s, which is close to the real value of 55 m/s. So the steady-state answer seems acceptable.

But set mass to 40 kg (a child skydiver) with the same k. The new terminal velocity prediction: 40×9.81/14 ≈ 28 m/s. The real value for a 40 kg person with the same body position should scale differently — because the cross-sectional area barely changes with body weight at these masses. The linear model scales terminal velocity linearly with mass; the real quadratic model scales it as the square root of mass. These predictions diverge badly at the extremes.

---

## The Moment of Failure

Run two simulations side by side on canvas. Both drop an 80 kg skydiver from 4,000 meters with matching k values chosen to give the same terminal velocity. Below the canvas, display velocity-time graphs for both.

**Failure 1 — The velocity graph shape:** The linear drag model produces an exponential approach: `v(t) = v_t(1 - e^(-kt/m))`. This curve looks qualitatively correct but it approaches terminal velocity asymptotically — mathematically never arriving. After 60 seconds of simulated fall, the graph is still visibly rising (by 0.01 m/s per second). This means the model claims no skydiver ever truly reaches terminal velocity, which while technically true for exponential decay is so slow as to be unphysical.

The quadratic model approaches faster in the early phase and approaches its asymptote faster overall. Real measurements on skydivers match the quadratic approach curve, not the exponential.

**Failure 2 — Scaling with mass:** Now change the mass from 80 kg to 160 kg (a heavy skydiver with gear). Same k, same body position. Linear model predicts v_t = 2 × 56 = 112 m/s. That's wrong — real data shows about 78 m/s for this configuration. The linear model scales linearly (v_t ∝ m). The real physics scales as √m (v_t ∝ √m). Show the diverging predictions on a mass vs. terminal-velocity graph — the linear model shoots off to absurd values while the quadratic model stays grounded in reality.

Display in red: "Linear model terminal velocity prediction: 112 m/s. Real skydiver record: ~90 m/s in a wingsuit. Your model is already wrong for a heavy configuration." That's the failure moment.

---

## Why It Broke — The Physics

The linear drag law `F = kv` is actually the correct model for a different physical regime: Stokes drag, which applies to very small objects (dust, bacteria, tiny droplets) moving slowly through viscous fluids. In Stokes drag, the dominant effect is the fluid's viscosity — how "sticky" the air is. This regime is characterized by a low Reynolds number (Re << 1).

For large objects moving at the speeds we care about in everyday life — raindrops, skydivers, cars, aircraft — the dominant effect is not viscosity but inertia. The object has to push air out of its way. The faster it moves, the more air it hits per second, AND the harder each impact is. This double v-dependence gives the quadratic scaling:

$$F_{drag} = \frac{1}{2} \rho C_d A v^2$$

The Reynolds number for a skydiver at terminal velocity is roughly Re ≈ 10⁷ — solidly in the turbulent, quadratic drag regime. Stokes drag doesn't apply at all.

The terminal velocity from quadratic drag:
$$\frac{1}{2} \rho C_d A v_t^2 = mg$$
$$\boxed{v_t = \sqrt{\frac{2mg}{\rho C_d A}}}$$

This scales as √m, not linearly with m. It depends on Cd and A separately, not just their product with some tunable k. And critically, by knowing rho, Cd, A, and m individually (all measurable physical quantities), you can predict terminal velocity without any tuning — the formula is predictive, not just descriptive.

---

## The One Concept

**Quadratic Drag** (also called form drag or pressure drag) is the dominant air resistance mechanism for everyday-scale objects at everyday-scale speeds.

**The formula:** F_drag = ½ρCdAv²
- ½ is a historical convention from the derivation
- ρ (air density): 1.225 kg/m³ at sea level, 0.9 kg/m³ at 3000m altitude, 0.02 kg/m³ on Mars
- Cd (drag coefficient): dimensionless number encoding the object's shape efficiency
  - Golf ball with dimples: 0.25 (dimples promote turbulent boundary layer, reducing wake)
  - Smooth sphere: 0.47
  - Skydiver flat: ~1.0–1.3
  - Parachute: ~1.75
  - Flat plate (perpendicular): 1.28
- A: frontal cross-sectional area in m²
- v²: the quadratic dependence — this is the key

**The v² term explained physically:** Imagine driving into rain. If you drive faster, two things happen: (1) you hit more raindrops per second (more force), and (2) each raindrop hits harder because the relative velocity is higher (more force per impact). Both effects scale with v, so together they give v².

**Why the equilibrium self-regulates:** As v increases, F_drag grows as v². Gravity (mg) is constant. So F_net = mg - ½ρCdAv² starts positive (acceleration), decreases as v rises, and hits exactly zero at v_t. If somehow the object exceeded v_t (say, it was thrown downward), the drag would exceed gravity, decelerating it back toward v_t. Terminal velocity is a stable equilibrium.

**Real-world examples beyond skydiving:**
1. Raindrops: 2mm raindrop has v_t ≈ 9 m/s. Without drag, falling from 2km, it would hit at 200 m/s — like a bullet.
2. Cycling aerodynamics: quadratic drag explains why power to overcome wind resistance scales as v³ (force ∝ v², power = force × velocity ∝ v³). Doubling speed requires 8× the power — this is why Tour de France riders hide in each other's slipstreams.
3. Structural engineering: the quadratic law explains hurricane damage scaling — 120 mph winds exert 4× the force of 60 mph winds, not 2×.

---

## The Fix

```javascript
// B002 — Correct quadratic drag model
const g    = 9.81;    // m/s²
const rho  = 1.225;   // kg/m³ air density at sea level
const mass = 80.0;    // kg

// Skydiver body positions (Cd * A combined)
const bodyPositions = {
  bellyToEarth: { Cd: 1.0, A: 0.70 },   // → v_t ≈ 55 m/s
  headDown:     { Cd: 0.7, A: 0.30 },   // → v_t ≈ 76 m/s
  tuck:         { Cd: 0.6, A: 0.25 },   // → v_t ≈ 84 m/s
  parachute:    { Cd: 1.75, A: 28.0 },  // → v_t ≈ 6 m/s
};

let pos = bodyPositions.bellyToEarth;
let velocity = 0;

function update(dt) {
  const dragForce    = 0.5 * rho * pos.Cd * pos.A * velocity * velocity;
  const netForce     = mass * g - dragForce;
  const acceleration = netForce / mass;

  velocity += acceleration * dt;
}

// Predicted terminal velocity:
function vTerminal(mass, Cd, A) {
  return Math.sqrt((2 * mass * g) / (rho * Cd * A));
}

// bellyToEarth: v_t = sqrt(2*80*9.81 / (1.225*1.0*0.70)) = 54.9 m/s ✓
// headDown:     v_t = sqrt(2*80*9.81 / (1.225*0.7*0.30)) = 76.2 m/s ✓
// parachute:    v_t = sqrt(2*80*9.81 / (1.225*1.75*28.0)) = 5.9 m/s ✓
```

The fix is switching from `F = k*v` to `F = 0.5*rho*Cd*A*v*v`. Now there are no tunable constants — all parameters are physically measurable. The formula correctly predicts:
- Terminal velocity scales as √mass (not linearly)
- Terminal velocity scales as 1/√A (larger body = slower terminal velocity)
- Terminal velocity scales as 1/√Cd (streamlined shapes = faster terminal velocity)

Show the derivation: set F_drag = mg, solve for v. The simulation converges to exactly the formula's prediction — verify this live by showing the formula value as a horizontal dashed line on the velocity graph, and watching the simulation curve asymptote to it.

---

## The Wow Moment — Push It

Show the "skydiver changing body position" sequence. The skydiver starts at 4,000 meters in belly-to-earth position (v_t = 55 m/s). After reaching terminal velocity, they shift to head-down (v_t = 76 m/s). The simulation responds immediately: drag drops because A decreases, so F_net becomes positive again, and the skydiver accelerates toward the new terminal velocity. Watch the velocity graph tick up from 55 toward 76.

Then deploy a parachute at 1,000 meters. The cross-sectional area explodes from 0.30 m² to 28 m². Drag immediately becomes enormous — the net force is strongly upward (F_drag >> mg). Deceleration is sudden and dramatic. The velocity drops from 76 m/s to 6 m/s over about 8 seconds of simulated time. Show the deceleration: at peak, it's about 20 g — survivable because it's short.

Now add a second scenario: same skydiver, same altitude, but on Mars (ρ = 0.020 kg/m³). The terminal velocity formula gives v_t = (1.225/0.020)^0.5 × 55 ≈ 430 m/s. The parachute deployed on Mars still has v_t ≈ 50 m/s — barely safe. This is why the Mars rovers use retrorocket systems in addition to parachutes. Show both simulations side by side: the Earth skydiver floats gently to landing; the Mars skydiver hits the ground at 50 m/s even with a parachute. Context: the Curiosity rover used a parachute, rockets, and a sky crane.

---

## The Interactive Demo

**Canvas split:** Left 70% is the fall simulation (scrolling downward view with altitude markers). Right 30% is a live velocity-time graph.

**Body Position buttons (top of canvas):**
- [Belly to Earth] — Cd=1.0, A=0.70, predicted v_t = 55 m/s
- [Head Down] — Cd=0.7, A=0.30, predicted v_t = 76 m/s
- [Tuck] — Cd=0.6, A=0.25, predicted v_t = 84 m/s
- [Spread Eagle Max] — Cd=1.3, A=0.90, predicted v_t = 47 m/s
- [Deploy Parachute] — Cd=1.75, A=28.0, predicted v_t = 6 m/s

Clicking a body position button mid-simulation immediately updates Cd and A — the velocity graph shows the new trajectory.

**Sliders:**
- Mass (40–200 kg) — changes the predicted terminal velocity in real time
- Air Density (0 = vacuum to 1.225 = Earth sea level to 1.450 = dense atmosphere)
- Altitude start (500m to 10,000m)
- Drag Model: toggle between [Linear (wrong)] and [Quadratic (correct)] — overlays both curves on the graph simultaneously for comparison

**Live readouts:**
- Current velocity (m/s and km/h)
- Current acceleration (m/s² and g-force)
- Predicted terminal velocity (formula)
- Time to terminal velocity (90% of v_t threshold)
- Altitude remaining

**Graph panel:** Velocity vs. time, with the theoretical terminal velocity shown as a dashed horizontal line. Both linear and quadratic models can be overlaid. Clicking any point on the graph scrubs the simulation to that time.

---

## Production Notes

**Runtime target:** 14–18 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook with real skydiving footage + velocity graph overlay — 1 min
- 1:00–4:30 — Linear drag naive attempt: code walkthrough, why it looks right, the k parameter — 3.5 min
- 4:30–7:00 — Failure: scaling failure with mass, velocity curve shape wrong — 2.5 min
- 7:00–9:30 — Physics: Reynolds number, Stokes vs quadratic regimes, v² derivation — 2.5 min
- 9:30–11:30 — The concept section: Cd values, real-world examples, stable equilibrium argument — 2 min
- 11:30–13:30 — The fix: code rewrite, formula verification, predicted vs simulated comparison — 2 min
- 13:30–16:00 — Wow: body position transitions, parachute deploy, Mars comparison — 2.5 min
- 16:00–17:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** Same as B001 — 60/40 code/canvas split for code sections. Full canvas for the wow/demo sections.

**Zoom moments:**
- ZOOM on the mass-scaling graph where linear diverges from quadratic predictions
- ZOOM on the parachute deploy moment — velocity drop from 76 to 6 m/s
- ZOOM on the Mars vs Earth comparison at landing — velocity readouts

**Pre-render animations:**
- Real skydiver footage with graph overlay (can composite in DaVinci Resolve)
- The Reynolds number regime diagram (laminar/turbulent) — render as clean illustration
- The v² derivation animation — rain analogy with velocity vector scaling

**Key on-screen graphics:**
- Side-by-side formula comparison: linear (mg/k) vs quadratic (√(2mg/ρCdA))
- Body position silhouettes with labeled Cd and A values
- Mars mission graphic showing why parachutes alone aren't enough

---

## Tags

`physics` `drag` `terminal-velocity` `skydiving` `quadratic-drag` `javascript` `canvas` `beginner`

---

## Thumbnail

Frame: A skydiver silhouette with two velocity readouts — one from the "linear drag model" (wrong, showing 112 m/s) and one from the "quadratic model" (correct, showing 55 m/s). Large red X over the linear model number. Green checkmark over the quadratic. The skydiver is shown mid-freefall against a crisp blue sky with clouds below. Text overlay in bold white: "WHY THE MATH STOPS HERE" with an arrow pointing to the 55 m/s readout. The dashed horizontal line of the velocity graph plateauing is visible in the lower third of the thumbnail as a visual motif. The divergence between wrong model and right model is the scroll-stopper — two numbers, one obviously wrong, the satisfaction of knowing which is correct.
