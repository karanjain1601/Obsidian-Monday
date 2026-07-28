---
title: "Optimizing a Medieval Trebuchet With Code"
id: B032
difficulty: 2.5/10
prereq: "B007 — Rotational Kinematics"
concept: "Gravitational potential energy of counterweight transfers to projectile KE through rotational mechanics; sling extends effective arm and enables near-optimal launch angle"
tags: [physics, trebuchet, rotational-kinematics, energy, lever, projectile, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Optimizing a Medieval Trebuchet With Code

**Alt title:** "Medieval Engineers Solved a Physics Optimization Problem in 1300 AD"
**Difficulty:** 2.5/10 | **Prereq:** B007 — Rotational Kinematics

---

## Opening Hook (0:00–1:00)

Open on a side-view simulation of a trebuchet at full scale — 15 meters tall, 10-meter throwing arm, a 10,000 kg counterweight. A click. The counterweight drops. The arm swings. The sling whips around. A 100 kg stone is released at roughly 60° above horizontal — and the range display ticks up: 50 m, 100 m, 200 m, 300 m... it lands at 312 meters. No explosives. No fuel. Pure gravity and the geometry of a lever and sling system designed in the 12th century.

Now pose the engineering question directly: given that you're building a trebuchet, what sling length maximizes range? What counterweight-to-projectile mass ratio is optimal? Medieval siege engineers figured this out empirically over decades of catastrophic failures and expensive redesigns. We have JavaScript and a physics engine. We'll solve it in 20 minutes of coding and then run a full parameter sweep that would have taken those engineers a lifetime.

Hold up a desk-model trebuchet (available cheaply, easy to 3D print). Show it in slow motion. Point out the key mechanical components: the pivot, the short arm side (counterweight), the long arm side (sling attachment), and the finger ring that holds the sling until release. The magic is in those four components and how their proportions interact.

---

## The Naive Attempt

Code the simplest possible trebuchet: a rigid lever rotating about a pivot. Counterweight mass M_c on one side, projectile mass m_p on the other. No sling — the projectile is attached directly to the tip of the long arm.

```javascript
const trebuchet = {
  pivotX: 400, pivotY: 300,
  armLength: 200,          // pixels (long side)
  shortArmLength: 50,      // pixels (short/counterweight side)
  counterweightMass: 100,
  projectileMass: 1,
  theta: -Math.PI * 0.8,   // arm angle (start: counterweight high)
  omega: 0                  // angular velocity
};

function update(dt) {
  // Torque from counterweight (on short side)
  const tauCounter = trebuchet.counterweightMass * 9.81
                     * trebuchet.shortArmLength * Math.cos(trebuchet.theta);
  // Torque from projectile (on long side) — opposing
  const tauProjectile = trebuchet.projectileMass * 9.81
                        * trebuchet.armLength * Math.cos(trebuchet.theta + Math.PI);
  const I = trebuchet.counterweightMass * trebuchet.shortArmLength**2
            + trebuchet.projectileMass * trebuchet.armLength**2;
  const alpha = (tauCounter - tauProjectile) / I;
  trebuchet.omega += alpha * dt;
  trebuchet.theta += trebuchet.omega * dt;
  // Release when arm is past vertical
  if (trebuchet.theta > 0.1) launchProjectile();
}
```

Run it. The arm swings from counterweight-up to counterweight-down. The projectile is released roughly when the arm passes vertical. Watch where it goes.

---

## The Moment of Failure

When the arm passes vertical and the projectile is released, the launch angle is essentially straight up — nearly 90° from horizontal. The "projectile" (just a dot at the arm tip) shoots upward, reaches a peak height of perhaps 40 meters, and comes back down roughly 3-5 meters from the trebuchet. Terrible range. The projectile was going nearly straight up at release.

This is physically inevitable with no sling. At the moment of arm-tip maximum velocity (when the arm is near vertical), the tip velocity vector is directed nearly horizontally, but the projectile, being at the very end of the rigid arm, has its velocity vector perpendicular to the arm — which at that moment points nearly straight up. The arm's geometry forces a near-vertical launch regardless of how heavy the counterweight is. You could double or triple the counterweight and it would still launch nearly straight up. The rigid arm without a sling cannot produce the ~45° launch angle needed for maximum horizontal range. This is not a code bug — it is a fundamental geometric constraint of the rigid-lever design.

---

## Why It Broke — The Physics

The kinematic constraint is the problem. At the moment of release on a rigid arm, the projectile velocity is always perpendicular to the arm. When the arm is at angle θ from horizontal, the projectile launches at angle (θ + 90°) from horizontal. For the projectile to launch at 45° (optimal range), the arm must be at -45° from horizontal when the projectile releases — counterweight side still rising, long side angled up-and-forward. But at that arm position, the arm tip is not yet at maximum speed; the arm is still accelerating. Releasing early means less energy was transferred to the projectile.

Energy analysis: total available PE from counterweight drop is M_c · g · Δh_counterweight. This converts to KE of the rotating system: ½·I_total·ω². At best, some fraction of this reaches the projectile. The sling extends the effective radius at release: the projectile's speed equals ω × (arm_length + sling_length). More importantly, the sling allows the projectile to continue its arc after the arm has stopped accelerating — the sling "times" the release by unwrapping, letting the projectile leave at a favorable angle.

Key equations:
```
v_tip = ω * L_arm
v_projectile = ω * (L_arm + L_sling)   [with sling, at release]
KE_projectile = ½ * m_p * v_projectile²
Range = v² * sin(2θ_launch) / g        [projectile range formula]
```

---

## The One Concept

**Rotational-to-Translational Energy Transfer** via a slung lever mechanism is the trebuchet's core physics innovation. The counterweight falls a distance h, losing potential energy M_c·g·h. This drives rotation of the arm (a lever with mechanical advantage L_arm/L_short). The rotating arm tip accelerates the sling. The sling unwraps and effectively extends the moment arm at the last instant, boosting the projectile's speed and — critically — determining the release angle through geometry.

**Formal Framework:**
- Gravitational PE available: `E = M_c * g * h_drop`
- Efficiency factor η ≈ 0.5–0.8 (accounts for system mass, bearings, air resistance)
- Projectile KE at release: `½ * m_p * v² = η * M_c * g * h`
- Optimal launch angle for level ground: 45° (maximizes `sin(2θ)`)
- Maximum range: `R_max = v² / g = (2η * M_c * g * h) / (m_p * g) = 2η * (M_c/m_p) * h`

**Real-World Examples:**
1. **The Warwolf (1304):** Edward I's famous trebuchet reportedly had a 4,500 kg counterweight, 13-meter arm, and threw 150 kg stones 300+ meters. The sling length was carefully tuned — historical records suggest the operators adjusted the sling to change range, not the counterweight.
2. **Modern trebuchet competitions:** Engineering teams at universities run trebuchet optimization contests annually (the "World Trebuchet Championship" in Ludlow, UK). The optimal counterweight/projectile ratio found empirically is consistently around 100:1 to 200:1 — matching physics predictions.
3. **Atlatl (spear thrower):** The same sling-extension principle appears in the Atlatl — a short handle with a notch that extends the effective arm length for spear throwing. Humans have independently discovered this energy-transfer optimization at least twice in history.

---

## The Fix

Implement a two-body kinematic system: the rigid arm at angle θ and the sling at angle φ (measured from the arm extension). The sling hangs from the arm tip and is free to swing. The projectile mass m_p sits at the end of the sling.

```javascript
// State: [theta, dtheta/dt, phi, dphi/dt]
// theta: arm angle from horizontal (negative = CW side up)
// phi: sling angle from arm extension

function equations_of_motion(state, t) {
  const [theta, dtheta, phi, dphi] = state;
  const L_arm = 2.0;      // meters
  const L_sling = 1.5;    // meters
  const M_c = 100;        // counterweight mass, kg
  const m_p = 1;          // projectile mass, kg
  const M_arm = 10;       // arm mass, kg

  // Coupled Lagrangian equations (derived from L = T - V)
  // Simplified: treat arm + counterweight as one inertia
  const I_arm = M_arm * (L_arm**2 + (L_arm/4)**2) / 12;  // rod moment
  const I_cw = M_c * (L_arm/4)**2;                        // counterweight

  // Net torque on arm from gravity (simplified)
  const tau_cw = M_c * 9.81 * (L_arm/4) * Math.cos(theta);
  const tau_proj_arm = m_p * 9.81 * L_arm * Math.cos(theta + Math.PI);
  const alpha_arm = (tau_cw + tau_proj_arm) / (I_arm + I_cw);

  // Sling follows pendulum attached to moving pivot
  const alpha_sling = -(9.81 / L_sling) * Math.sin(phi)
                      - alpha_arm * Math.cos(theta - phi);

  return [dtheta, alpha_arm, dphi, alpha_sling];
}

// Release condition: sling tension = 0 (sling fully extended, ring detaches)
function checkRelease(phi, dphi) {
  return phi > RELEASE_ANGLE;   // finger ring releases at specific angle
}
```

Integrate with RK4. The sling now causes the projectile to release at a much more favorable angle (~40-55°) and at higher velocity because the sling adds effective arm length.

---

## The Wow Moment — Push It

With the physics model working, run a full 2D optimization sweep over the parameter space. Counterweight-to-projectile mass ratio (x-axis: 1× to 500×) vs. sling length as fraction of arm length (y-axis: 0 to 2.0). For each of 200×200 = 40,000 parameter combinations, simulate the complete throw and record the projectile range. Render as a 2D heatmap with color encoding range (blue → yellow → red for short → medium → far). The optimal region appears immediately as a hot red zone — counterweight ratio around 80–150, sling length around 0.8–1.2× arm length. The physics is doing the optimization for you.

Add a tooltip: hover over any point on the heatmap to see the simulation play back for that exact parameter set. Click to mark it as a "design" and it appears in the main simulation.

Historically flavor it: overlay labeled pins for real trebuchets — Warwolf (1304), the trebuchet at Château des Baux (France), White Castle (Wales) reconstruction, and a modern competition trebuchet. How close to optimal were the medieval engineers? Remarkably close — within 10% of the theoretically optimal region in every case. They solved this optimization problem through observation and trial without calculus.

---

## The Interactive Demo

Build a full trebuchet simulator with side-view canvas (1000×600 px, parchment-colored background with stone walls as target):

**Trebuchet Design Controls:**
- **Arm Length** (1–5 m): sets scale of entire machine.
- **Short Arm Ratio** (0.1–0.5): fraction of total arm on counterweight side.
- **Counterweight Mass** (10–10,000 kg): shown as a hanging block with mass label.
- **Projectile Mass** (0.1–200 kg): shown as a stone at the sling end.
- **Sling Length** (0–2× arm length): the critical tuning parameter.
- **Release Angle** (finger ring trigger): when the sling passes this angle relative to arm, projectile releases.

**Simulation Displays:**
- Animated trebuchet arm swinging in real time (smoothly rendered with wood texture SVG or canvas path).
- Projectile trajectory arc with peak height and range labels.
- Energy bar chart updating in real time: PE counterweight → KE arm → KE projectile (shows energy transfer efficiency η).
- Release angle indicator: shows the exact angle at release and the resulting launch angle.
- Range display in meters.

**Special Modes:**
- **Range Optimization Mode:** automated sweep over sling length only (holding other params constant), shows range vs. sling length curve, highlights maximum.
- **Historical Presets:** "Warwolf," "Table-top model," "Competition trebuchet" buttons load realistic parameter sets.
- **Side-by-side Comparison:** two trebuchets fire simultaneously with different sling lengths; see which throws farther.

---

## Production Notes

**Structure and timing:**
- Hook: 0:00–1:00 (60 s). Pre-render a high-quality trebuchet animation in the demo. Show the 312-meter range clearly. The number needs to be legible — large text overlay.
- Naive attempt + failure: 1:00–3:30 (150 s). Live code the rigid-lever model. Let it fire. The near-vertical launch is the punchline — cut to a slow-motion replay of the "projectile" going straight up and landing next to the trebuchet. Comedic timing helps here.
- Physics explanation: 3:30–5:30 (120 s). Use a prepared diagram of the arm at various angles, showing the velocity vector direction vs. time. The key insight (arm angle at release determines launch angle) is geometric and clear with a diagram.
- The fix: 5:30–8:00 (150 s). Show the Lagrangian setup briefly — don't derive in full, just show the coupled ODE structure. Focus on the RK4 integration. Show the sling animation and the dramatic improvement in range.
- Optimization sweep: 8:00–10:30 (150 s). The heatmap generation should be pre-computed (it takes a few seconds); play it as a build animation (pixels filling in left to right) for drama. Hover over Warwolf pin and show "87% optimal."
- Interactive demo walkthrough: 10:30–11:30 (60 s).

**Key filming decisions:** Use a split-screen during coding segments — code on left, trebuchet animation on right. The trebuchet arm swing animation must be smooth (60 fps canvas, not choppy). Zoom into the range display at maximum range for emphasis. Keep the parchment/medieval visual theme for the demo to contrast with the modern code.

**Approximate runtime:** 11–12 minutes.

---

## Tags
`physics` `trebuchet` `rotational-kinematics` `energy` `lever` `projectile` `javascript` `canvas`

---

## Thumbnail

Wide canvas of the trebuchet animation at the moment of release: the arm is fully swung, the sling is whipping the projectile forward at a perfect ~45° angle, and a bright yellow dotted arc traces the optimal trajectory curving off to the right. The trebuchet is rendered in detailed wood-plank style against a gray stone castle wall background. Large text overlay: "300 METERS" in bold gold. Subtext: "no explosives, just physics." Bottom corner: CodedLaws logo. Emotion: Medieval meets modern — the ancient machine analyzed with modern tools. Stops the scroll because people know what a trebuchet looks like and the combination of "code" in the channel name and "medieval siege weapon" in the frame creates irresistible cognitive contrast.
