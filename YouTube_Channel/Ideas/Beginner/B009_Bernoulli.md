---
title: "Bernoulli's Principle: The Counterintuitive Reason Planes Fly"
id: B009
difficulty: 2/10
prereq: "None"
concept: "Bernoulli equation P + ½ρv² + ρgh = const along a streamline. Faster flow means lower pressure. Wings are shaped to make air move faster over the top surface, creating lower pressure above than below — net upward lift."
tags: [physics, bernoulli, lift, fluid-dynamics, aerodynamics, pressure, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Bernoulli's Principle: The Counterintuitive Reason Planes Fly

**Alt title:** "The Lie Your Physics Textbook Told You About Airplane Wings"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Hold a piece of paper at your lower lip and blow horizontally across the top surface. The paper rises — it bends upward toward the airflow. Ask the audience: "Why did the paper go up? The air is flowing above it. You'd expect the air pressure to push it down. Instead it lifts. Why?"

Most people encounter their first answer in elementary school or basic physics: the textbook "equal transit time" explanation. It goes like this: "The top of the wing is curved, so air traveling over the top has farther to go than air going under the flat bottom. For the two streams to rejoin at the trailing edge simultaneously, the top air must travel faster. Faster air = lower pressure (Bernoulli). Lower pressure above + higher pressure below = lift."

This explanation is in countless textbooks. It appears on Wikipedia. Teachers repeat it. And it is wrong.

The "equal transit time" hypothesis — that air particles that split at the leading edge must arrive simultaneously at the trailing edge — has zero physical basis. Real measurements on airfoils in wind tunnels show the top air arrives at the trailing edge EARLIER than the bottom air, not at the same time. The top air really does go faster — but not because of equal transit. The reason is different, more subtle, and more interesting.

Bust the myth explicitly: show a computer simulation where particles are released simultaneously at the leading edge, split over and under the wing, and arrive at the trailing edge. The top-path particles arrive 30% earlier. The "equal transit" story is a fabrication. Yet the paper still rises. Let that sit for 2 seconds of silence. Then: "The paper rises because of Bernoulli's principle — but the mechanism producing the velocity difference is not equal transit time. Let's find the real reason."

---

## The Naive Attempt

Build the "equal transit time" model and code it up. Create particles that travel over and under a symmetric airfoil, with path lengths computed from the airfoil geometry, and assign velocities such that particles arrive at the trailing edge simultaneously:

```javascript
// B009 — Naive: equal transit time model
// Airfoil defined by top path length L_top and bottom path L_bottom
// Symmetric NACA 0012 at 5° angle of attack

const L_bottom = 1.0;    // normalized chord length
const L_top    = 1.08;   // top path is 8% longer (curved upper surface)
const v_inf    = 30;     // m/s free-stream velocity

// Equal transit time assumption: both paths take same time t = L/v
// time for bottom: t = L_bottom / v_inf = 1.0/30
// For top to match: v_top = L_top / t = 1.08 * v_inf
const t_transit = L_bottom / v_inf;  // 0.0333 s
const v_top  = L_top / t_transit;    // = 1.08 * 30 = 32.4 m/s
const v_bottom = v_inf;              // = 30 m/s

// Bernoulli: P + 0.5*rho*v² = const
// ΔP = 0.5 * rho * (v_bottom² - v_top²)
const rho = 1.225;
const deltaP = 0.5 * rho * (v_bottom**2 - v_top**2);
// = 0.5 * 1.225 * (900 - 1049.76) = -91.8 Pa  (negative = lower pressure above)

// Lift per unit span: L = ΔP * chord_length = 91.8 * 1.0 = 91.8 N/m
// Compare to actual: real lift for NACA0012 at 5° AoA at 30 m/s:
// Cl ≈ 0.55, L = 0.5 * rho * v² * Cl * chord ≈ 0.5*1.225*900*0.55*1.0 ≈ 303 N/m
// Model predicts 91.8 N/m. Reality is 303 N/m. Off by 3.3×.
```

Walk through this calculation explicitly. The equal transit model gives a velocity ratio of 1.08 (top air goes 8% faster). Bernoulli gives a pressure difference of 91.8 Pa. Actual lift for this airfoil and conditions is 303 N/m — the model underpredicts by a factor of 3.3.

Also note: a symmetric airfoil (like the NACA 0012) at 0° angle of attack has equal top and bottom path lengths — equal transit would predict zero lift. But a symmetric airfoil at 5° angle of attack generates substantial lift. The equal transit model can't explain this either, because the geometry of the paths depends on angle of attack in a way the simple path-length argument doesn't capture.

---

## The Moment of Failure

Set up a particle simulation. At the leading edge, release 20 particles simultaneously — 10 going over the top surface, 10 going under. The top particles are given v_top = 32.4 m/s (from equal transit prediction), the bottom are given v_bottom = 30 m/s. Draw lines from each particle to show their trajectories.

Show the trailing edge: the top particles arrive at time t = 1.08/32.4 = 0.0333 s. The bottom particles arrive at t = 1.0/30 = 0.0333 s. They arrive simultaneously — the equal transit model is self-consistent by construction. But this is circular: we chose the velocities to make them arrive simultaneously, so of course they do.

Now overlay what actually happens in a real wind tunnel (or show a computational fluid dynamics result): the top particles arrive at t = 0.026 s (early), the bottom at t = 0.033 s (on time). The top particles are going faster — about 38.5 m/s, not 32.4 m/s. The velocity ratio is 1.28, not 1.08. And the pressure difference from the real velocities: 0.5 × 1.225 × (38.5² - 30²) = 322 Pa — matching real lift within a few percent.

The real top-surface velocity is 28% higher than freestream, not 8% higher. Equal transit time underpredicts by a factor of 3.5 in velocity ratio and a factor of 12 in lift force. And critically: the equal transit explanation gets the physics backwards — it assumes equal transit causes the velocity difference. In reality, the velocity difference causes equal transit to fail.

Text overlay: "The myth is not wrong about the direction of lift — it correctly predicts air goes faster over the top. But it's wrong about why, and wrong by a factor of 3 on the magnitude. In aerospace engineering, a factor of 3 error means your plane doesn't fly."

---

## Why It Broke — The Physics

The Bernoulli equation is not the problem — it is correct. The problem is the naive explanation of why air speeds up over the top of the wing.

**The Bernoulli Equation (along a streamline, inviscid, incompressible flow):**
$$P + \frac{1}{2}\rho v^2 + \rho g h = \text{const}$$

For horizontal flow (ignore the ρgh term):
$$P + \frac{1}{2}\rho v^2 = \text{const}$$

If v increases, P decreases. This is correct and the foundation of lift. The question is: why does v increase over the top surface?

**The real reason — Circulation and the Kutta condition:**

Air flowing around a wing must satisfy two conditions:
1. Flow must not penetrate the solid wing surface (boundary condition)
2. The flow must leave smoothly at the trailing edge, not wrap around it (the Kutta condition — a consequence of viscosity and the sharp trailing edge)

These two conditions, taken together, uniquely determine the flow field around the wing. Mathematically, the solution is equivalent to adding a circulatory component Γ (circulation) to the uniform flow. The Kutta-Joukowski theorem gives lift directly:

$$L = \rho \cdot v_\infty \cdot \Gamma \quad \text{per unit span}$$

The circulation Γ makes the airspeed higher over the top surface and lower under the bottom — not because of path lengths, but because the circulation component adds to the freestream velocity above and subtracts below. The wing "grabs" the air and induces rotation in the flow around it.

**Angle of attack is the primary lift variable:** Increasing angle of attack increases Γ, which increases lift. A symmetric airfoil at 0° AoA has Γ = 0 (by symmetry), zero lift. At 5° AoA, Γ is large, lift is substantial. Equal transit time cannot explain this because the path-length difference for a symmetric airfoil at any angle of attack is determined by geometry, not the actual speed ratio.

**Stall:** At high angles of attack, the flow over the upper surface can no longer stay attached to the wing surface. It separates — the streamlines detach, turbulence fills the separated region, and the pressure difference collapses. This is stall: sudden loss of lift at high angle of attack.

---

## The One Concept

**Bernoulli's Principle** (for steady, inviscid, incompressible flow along a streamline):

$$\boxed{P + \frac{1}{2}\rho v^2 = \text{constant}}$$

Energy is conserved along a streamline. Where the flow speeds up (v increases), pressure must decrease (P decreases) to keep the sum constant. This is not magic — it's the statement that kinetic energy density and pressure energy density trade off while total mechanical energy is conserved.

**Physical intuition — the "garden hose" analogy:** Hold your thumb partially over a garden hose nozzle. The water speeds up through the constriction. You can feel the pressure drop — the hose is easier to bend at the constricted point. Same total energy per unit volume, traded between pressure and kinetic.

**The Venturi tube:** A pipe that narrows in the middle. As fluid passes through the constriction (smaller area), it must speed up (conservation of mass: A₁v₁ = A₂v₂). Faster flow = lower pressure. The pressure drop at the constriction is precisely predicted by Bernoulli. Venturi tubes measure flow rates in plumbing, and they power carburetors (low pressure at the throat sucks fuel in from the fuel bowl).

**Streamline compression:** In a flow field, where streamlines are closer together, the flow speed is higher. Over the top of a wing, the streamlines are compressed (the wing pushes air upward, crowding the streamlines). Compressed streamlines → higher v → lower P. This is the correct physical picture: the wing deflects streamlines, and Bernoulli determines the pressure from the resulting velocity field.

**Real-world applications beyond wings:**
1. **Chimneys:** Faster wind over the top of a chimney (the external air is moving, the inside air is still) creates lower pressure at the top, helping draw smoke upward.
2. **Atomizer (perfume bottle):** Air is blown across a tube's top opening. Faster air creates lower pressure, sucking liquid up the tube — Bernoulli-powered perfume sprayer.
3. **Magnus effect:** A spinning ball (baseball, soccer ball) drags air with it on one side, speeding up the flow on that side and slowing it on the other. Pressure difference → curved trajectory. Why curveballs curve.

---

## The Fix

Use a simplified potential flow model based on circulation (the Kutta-Joukowski approach). Represent the airfoil as a combination of uniform flow plus circulation:

```javascript
// B009 — Correct: potential flow + circulation model
// Simplified: track stream function ψ to get velocity field

const rho   = 1.225;   // kg/m³ air density
const v_inf = 30;      // m/s freestream velocity
const chord = 1.0;     // m wing chord

// Lift coefficient from thin airfoil theory:
// Cl = 2π * sin(alpha) ≈ 2π * alpha (for small alpha in radians)
// This is the correct physics, not the path-length argument

function liftCoefficient(alpha_deg) {
  const alpha_rad = alpha_deg * Math.PI / 180;
  return 2 * Math.PI * Math.sin(alpha_rad);  // thin airfoil theory
}

function circulation(alpha_deg) {
  // Kutta-Joukowski: L = rho * v_inf * Gamma
  // L = 0.5 * rho * v_inf^2 * Cl * chord
  // → Gamma = 0.5 * v_inf * Cl * chord
  const Cl = liftCoefficient(alpha_deg);
  return 0.5 * v_inf * Cl * chord;
}

function velocityAtPoint(x, y, alpha, Gamma) {
  // Combine uniform flow (v_inf at angle alpha) + circulation (Gamma)
  // For points near the wing surface, the circulation component dominates
  const vx_uniform  =  v_inf * Math.cos(alpha * Math.PI / 180);
  const vy_uniform  = -v_inf * Math.sin(alpha * Math.PI / 180);

  // Simplified circular circulation field around the wing centerpoint
  const dx = x - wingCenter.x;
  const dy = y - wingCenter.y;
  const r2 = dx*dx + dy*dy;
  if (r2 < 0.001) return { vx: vx_uniform, vy: vy_uniform };

  const vx_circ = Gamma / (2 * Math.PI) * dy / r2;
  const vy_circ = -Gamma / (2 * Math.PI) * dx / r2;

  return { vx: vx_uniform + vx_circ, vy: vy_uniform + vy_circ };
}

// Pressure from Bernoulli:
function pressure(vx, vy) {
  const v2 = vx*vx + vy*vy;
  const p_inf = 101325;  // Pa ambient
  return p_inf + 0.5 * rho * (v_inf*v_inf - v2);  // relative to freestream
}
```

Trace particle paths using this velocity field. Show the top-surface particles now arriving earlier — the simulation matches the real wind tunnel behavior. Compute the pressure at the top and bottom surfaces: the difference gives lift. Compare to the Kutta-Joukowski formula — they agree.

Show: the "equal transit" fallacy is invisible in the correct model because the velocity field is derived from first principles (Kutta condition + potential flow theory), not from a path-length argument. The particles simply travel through the field and arrive when they arrive.

---

## The Wow Moment — Push It

Build a full 2D particle flow visualization around an airfoil. Release 200 particles continuously from the left edge of the canvas, flowing rightward. Each particle's velocity is computed from the correct potential flow solution around a NACA airfoil shape. Color-code particles by their current speed: blue = slow, white = medium, red = fast.

At 0° angle of attack: perfectly symmetric flow, particles pass over and under the wing at equal speeds. Lift = 0.

Increase angle of attack to 5°: the flow is no longer symmetric. Top particles accelerate (red), bottom particles decelerate (blue). The stagnation point (particle that divides top-going from bottom-going flow) moves below the leading edge. Clear pressure difference and upward lift.

Increase to 15°: the flow begins to struggle on the upper surface — you can see the particles near the trailing edge starting to reverse direction. The boundary layer is about to separate.

At 18° (stall): flow separation occurs dramatically. The attached streamlines over the upper surface break away from the wing. A turbulent wake forms behind and above the wing. The speed coloring shows the fast-flow region disappearing. Lift drops by 30% in one second of simulation. The visual is stark: the smooth, organized flow pattern collapses into chaotic turbulence.

Then show the venturi tube: a pipe that narrows and then widens. Particles speed up through the constriction (blue → red). Draw pressure gauges at three points along the tube: the pressure at the constriction is visibly lower (the gauge deflects inward). Connecting a side tube at the constriction: fluid is sucked in from the side (the carburetor principle). This is Bernoulli made tangible and mechanical.

---

## The Interactive Demo

**Canvas:** A large wind tunnel view. An airfoil (NACA 4-digit series) is shown in the center. Particles stream continuously from the left. Color encodes speed (or pressure, switchable).

**Airfoil controls:**
- `Angle of Attack` — slider -5° to 25°. Stall indicator shows at ~17°. Stall is animated (sudden flow separation visible).
- `Airfoil Shape` — presets: NACA 0012 (symmetric), NACA 2412 (slightly cambered), NACA 4412 (high camber), flat plate, circular arc.
- `Camber` — slider that morphes the airfoil shape in real time.

**Flow controls:**
- `Freestream Speed` — slider 10–100 m/s
- `Air Density` — slider (sea level to high altitude)
- `Particle count` — 50 to 500 particles

**Visualization toggles:**
- [Particle Paths] — show particle traces with fading tails
- [Pressure Field] — color the background by pressure (blue = low, red = high)
- [Streamlines] — show continuous streamline curves
- [Velocity Vectors] — show arrows at grid points
- [Equal Transit / Real Transit] — toggle between myth model and correct model for particle timing

**Readout panel:**
- Freestream velocity (m/s)
- Top surface speed at midchord (m/s)
- Bottom surface speed at midchord (m/s)
- Speed ratio (top/bottom) — myth predicts ~1.08, reality shows ~1.28
- ΔP (Pa) from Bernoulli applied to those velocities
- Lift coefficient Cl (dimensionless)
- Lift force (N/m span)
- Stall warning indicator (turns red with blinking at high AoA)

**Venturi mode button:** Switches canvas to a pipe with variable constriction. Drag the constriction width. See the speed and pressure update in real time. Observe the side-tube suction effect.

---

## Production Notes

**Runtime target:** 16–20 minutes (this is the most conceptually dense episode)

**Segment breakdown:**
- 0:00–1:00 — Hook: paper demo, equal transit myth introduced — 1 min
- 1:00–2:00 — Myth busting: wind tunnel particle timing, arrives early — 1 min
- 2:00–5:00 — Naive attempt: equal transit code, factor of 3.3 error derived — 3 min
- 5:00–7:00 — Failure: particle simulation shows early arrival, pressure underprediction — 2 min
- 7:00–10:30 — Physics: Bernoulli equation, Kutta condition, circulation — 3.5 min
- 10:30–12:30 — The concept: streamline compression, Venturi, Magnus effect — 2 min
- 12:30–14:30 — The fix: potential flow code, particle trace matching reality — 2 min
- 14:30–17:00 — Wow: full particle simulation, stall at 18°, Venturi tube — 2.5 min
- 17:00–18:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** This episode is very visual — the particle flow is the star. Use full canvas for most sections. Overlay equations as clean text on a semi-transparent dark panel when doing derivations.

**Zoom moments:**
- ZOOM on the particle timing: top arrives at t=0.026s, bottom at t=0.033s — the myth disproven
- ZOOM on the factor-of-3 calculation: 91.8 N/m predicted, 303 N/m actual
- ZOOM on the stall event: the moment streamlines detach at 18° AoA
- ZOOM on the venturi pressure gauges deflecting at the constriction

**Pre-render animations:**
- The Kutta condition diagram: air wrapping around the trailing edge vs. departing smoothly — render as a clean illustration
- Equal transit myth debunking: side-by-side particle arrival times with clear timestamps
- The paper blowing experiment on camera (do this in the studio — simple prop)

**Critical on-screen text:**
- During myth bust: "EQUAL TRANSIT TIME: A BEAUTIFUL LIE" in red
- After showing real arrival times: "TOP AIR ARRIVES 30% EARLIER — NOT AT THE SAME TIME"
- When showing the 3.3× error: "A FACTOR OF 3 ERROR. PLANES DON'T FLY WITH MYTH PHYSICS."

---

## Tags

`physics` `bernoulli` `lift` `fluid-dynamics` `aerodynamics` `pressure` `javascript` `canvas` `beginner`

---

## Thumbnail

A commercial airplane wing cross-section (airfoil shape) viewed from the side. Above the wing: red-orange streamlines compressed close together, labeled "FAST AIR = LOW PRESSURE." Below the wing: blue streamlines spread wide, labeled "SLOW AIR = HIGH PRESSURE." A large upward arrow labeled "LIFT" emerges from below the wing, pointing up. In the top-left corner, a red circle with an X and the text "NOT EQUAL TRANSIT TIME." The title text overlay: "THE LIE ABOUT HOW PLANES FLY" in bold white. The image has the aesthetic of a clean physics textbook diagram but with the emotional punch of a myth-bust. The scroll-stopper is the provocative claim ("LIE") combined with the familiar airplane wing — everyone has flown, and everyone has been told the wrong explanation. The curiosity gap is irresistible.
