---
title: "How Rockets Work in the Vacuum of Space (The Rocket Equation)"
id: B005
difficulty: 2/10
prereq: "None"
concept: "Conservation of momentum: the rocket pushes exhaust backward, and by Newton's 3rd law, the exhaust pushes the rocket forward. Tsiolkovsky rocket equation: Δv = v_e · ln(m_0/m_f)"
tags: [physics, rockets, momentum, tsiolkovsky, space, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# How Rockets Work in the Vacuum of Space (The Rocket Equation)

**Alt title:** "The Most Depressing Equation in Aerospace Engineering"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on the question that baffles many first-year engineering students: "In space, there's nothing to push against. No air, no ground, no water. So how does a rocket move?" Play NASA footage of a rocket engine firing in a vacuum chamber — the exhaust plume expands silently in all directions. The rocket moves.

Then show the naive thinking: "You have to push against something." Show a cartoon of a rocket trying to push against imaginary air. It doesn't work. But rockets work just fine — the ISS is up there right now, maneuvering with rockets in a near-perfect vacuum.

Here is the twist that the naive view misses: you don't need to push against anything external. Every second the engine fires, the rocket is throwing a chunk of mass backward at high speed. That mass carries momentum. The rocket — which has now lost that mass — has to carry equal and opposite momentum. So it moves forward. No external surface required.

Now show the disturbing corollary: "The rocket gets lighter as it burns fuel. So the same thrust produces higher acceleration as the fuel burns. By the end, you're accelerating a nearly empty fuel tank, which is trivially light, with the full thrust of the engine." This means the velocity gain is not linear with fuel burned — it's logarithmic. And that logarithm is both the miracle and the tyranny of rocket science. It's the reason getting to orbit is so hard, and getting to the outer solar system is even harder.

Hook close: "We're going to code a rocket simulation, watch it give completely wrong results with constant mass, find the fix in Tsiolkovsky's 1903 equation, and then slam into the wall of why multi-stage rockets exist."

---

## The Naive Attempt

Start with the intuitive, wrong implementation: a constant-force rocket applied to a constant mass. This is how most beginners think about rocket propulsion:

```javascript
// B005 — Naive rocket: constant force, constant mass
const thrustForce  = 50000;  // N — engine thrust (constant)
const rocketMass   = 10000;  // kg — WRONG: mass never changes

let velocity = 0;
let position = 0;
let altitude = 0;

function update(dt) {
  // Constant acceleration — ignores mass change as fuel burns
  const acceleration = thrustForce / rocketMass;   // F = ma → a = F/m
  velocity += acceleration * dt;
  altitude += velocity * dt;
}

// This predicts: a = 50000/10000 = 5 m/s²
// After 100 seconds: v = 500 m/s
// Δv = a * t = 5 * 100 = 500 m/s ← WRONG
```

Walk through why this seems reasonable: the rocket has a thrust of 50,000 N and a mass of 10,000 kg, so Newton's 2nd law gives a = 5 m/s². After 100 seconds of burn, velocity is 500 m/s. This is the kind of calculation you'd do if you were analyzing a car or a plane — constant mass is usually fine.

But a rocket that burns for 100 seconds has consumed a lot of fuel. A realistic rocket might burn 90% of its initial mass as propellant. At launch: m = 10,000 kg. At burnout: m = 1,000 kg. The mass has changed by a factor of 10. And as it gets lighter, the same thrust produces increasingly large acceleration. The naive simulation drastically underestimates the final velocity.

Plot naive vs correct side by side on a velocity-time graph. The naive model is a straight line. The correct model curves upward — slowly at first, then increasingly steeply as the mass drops. The total area under the curve (= Δv) is dramatically larger for the correct model.

---

## The Moment of Failure

Run the naive simulation: 10,000 kg rocket, 50,000 N thrust, burns 9,000 kg of fuel over 100 seconds (90 kg/s exhaust rate). The naive model says final velocity: 500 m/s. Display this as the "naive prediction" in blue.

Now run the physically correct simulation (previewed): the correct final velocity is 1,520 m/s — more than triple the naive prediction. The naive model is off by a factor of 3 for a realistic mass ratio.

Show this divergence on the velocity-time graph: both simulations start at the same point. The naive is a straight line. The correct model curves upward. The gap between the curves widens throughout the burn. At burnout (t=100s), the correct curve is way above the naive line.

Then hit the practical consequence: Low Earth Orbit requires approximately 9,400 m/s of Δv (accounting for gravity and atmospheric drag). The naive model would tell you that a 50,000 N engine with 10,000 kg fuel gives 500 m/s — and you'd conclude you need 18.8× that amount of fuel. The Tsiolkovsky equation says you need mass ratio e^(9400/v_e) — for a typical rocket engine with v_e = 3,000 m/s, that's e^3.13 ≈ 23. So you need 23 kg of propellant for every 1 kg of payload and structure. The naive estimate would have you 4-5× off in your fuel planning, which in aerospace engineering means: your mission doesn't get off the ground.

Text overlay: "Off by a factor of 3 on velocity, off by a factor of 5 on fuel. In aerospace, that's the difference between orbit and a very expensive fireworks display."

---

## Why It Broke — The Physics

The correct physics of rocket propulsion comes from conservation of momentum, and it requires tracking the mass of the rocket as it changes.

At time t, the rocket has mass m and velocity v. In the next instant dt, the engine expels a small mass dm at velocity v_e relative to the rocket (in the backward direction). The exhaust mass (dm) moves at (v - v_e) in the inertial frame. The rocket loses mass dm and gains velocity dv.

Conservation of momentum:
$$m \cdot v = (m - dm)(v + dv) + dm(v - v_e)$$

Expanding and simplifying (dropping the small dm·dv product):
$$0 = m \cdot dv - v_e \cdot dm$$
$$m \cdot dv = v_e \cdot dm$$

But dm here represents the mass lost by the rocket (positive), so if we let m decrease: dv = -v_e · dm/m. Integrating from m₀ to m_f:

$$\boxed{\Delta v = v_e \ln\left(\frac{m_0}{m_f}\right)}$$

This is the Tsiolkovsky Rocket Equation, derived in 1903. It says:
- The velocity gain (Δv) depends on the exhaust velocity v_e (how fast you throw the gas backward) and the mass ratio m_0/m_f (how much of the initial mass is fuel)
- The dependence on mass ratio is logarithmic — to double Δv, you need to square the mass ratio
- There is no dependence on thrust magnitude or burn rate — only on how much mass you expel and at what speed

The logarithm is both the miracle and the tyranny. The miracle: even large Δv values are achievable with finite mass ratios. The tyranny: each additional Δv costs exponentially more fuel.

---

## The One Concept

**The Tsiolkovsky Rocket Equation** relates the velocity a rocket can achieve to the exhaust velocity of its propellant and its mass ratio:

$$\boxed{\Delta v = v_e \cdot \ln\left(\frac{m_0}{m_f}\right)}$$

Where:
- Δv — the change in velocity the rocket achieves (m/s)
- v_e — the effective exhaust velocity (m/s), related to specific impulse: v_e = I_sp × g₀
- m_0 — initial total mass (rocket + fuel)
- m_f — final mass (rocket dry mass, after all fuel is burned)
- ln — the natural logarithm — this is where "The Tyranny" comes from

**Specific Impulse (I_sp):** Rocket engineers prefer to use I_sp (in seconds) rather than v_e: I_sp = v_e / g₀. For chemical rockets: 250–450 s. For ion drives: 3,000–10,000 s (much more fuel-efficient but very low thrust).

**The Tyranny of the Rocket Equation:** To achieve Δv = v_e (one "exhaust velocity" of Δv), the mass ratio is e¹ ≈ 2.72 — so over 63% of your initial mass must be propellant. To achieve Δv = 2v_e, mass ratio is e² ≈ 7.4 — 86% is propellant. To achieve Δv = 3v_e: e³ ≈ 20 — 95% is propellant. Getting to LEO requires roughly Δv = 9,400 m/s, and with a hydrogen/oxygen engine (v_e ≈ 4,400 m/s), the mass ratio is e^(9400/4400) ≈ e^2.13 ≈ 8.4. So 88% of the rocket must be propellant.

**Why multi-stage rockets exist:** Once the fuel is burned, the empty tanks are deadweight. Dropping them improves the mass ratio of the remaining stages dramatically. Each stage effectively resets the denominator of the mass ratio.

**Real-world numbers:**
- Saturn V (Moon mission): v_e ≈ 4,000 m/s; mass ratio ≈ 20; Δv budget ≈ 12,000 m/s
- Falcon 9: v_e ≈ 3,500 m/s; two stages; LEO payload fraction ≈ 4% of launch mass
- Ion drive (Dawn mission): v_e ≈ 31,000 m/s; tiny thrust but enormous Δv over months

---

## The Fix

```javascript
// B005 — Correct rocket simulation with variable mass
const v_exhaust    = 3000;   // m/s — exhaust velocity (e.g., kerosene/oxygen)
const exhaustRate  = 90;     // kg/s — mass flow rate
let   rocketMass   = 10000;  // kg — total mass (structure + fuel)
const dryMass      = 1000;   // kg — mass without any fuel

let velocity = 0;
let altitude = 0;

function update(dt) {
  // Stop burning once fuel exhausted
  if (rocketMass <= dryMass) return;

  // Mass expelled this timestep
  const dm = Math.min(exhaustRate * dt, rocketMass - dryMass);

  // Thrust = exhaust rate × exhaust velocity (Newton's 3rd law)
  const thrust = exhaustRate * v_exhaust;  // N

  // Current acceleration: F/m (mass is decreasing!)
  const acceleration = thrust / rocketMass;

  // Tsiolkovsky's prediction for total Δv:
  const deltaV_theoretical = v_exhaust * Math.log(rocketMass / dryMass);

  velocity     += acceleration * dt;
  altitude     += velocity * dt;
  rocketMass   -= dm;
}

// At any point, verify: simulated Δv should match Tsiolkovsky
// Δv_sim = current_velocity - initial_velocity
// Δv_theory = v_exhaust * ln(m0 / current_mass)
// These should be equal at all times during the burn
```

The key difference is that rocketMass decreases every frame. The acceleration is thrust/rocketMass — as mass drops, acceleration rises. The simulation matches Tsiolkovsky's formula throughout the burn (verify this by showing both values in the readout — they track each other exactly).

Show the acceleration-time graph: starts at thrust/m_initial = 5 m/s², rises slowly, then more steeply, finally spikes as the last drops of fuel burn off and mass approaches dryMass. The velocity-time graph curves upward rather than being a straight line. Total Δv at burnout: v_e × ln(10,000/1,000) = 3,000 × ln(10) = 6,908 m/s — over 13× more than the naive model's prediction of 500 m/s for the same thrust and time.

---

## The Wow Moment — Push It

Simulate a three-stage rocket launch to orbit. Define three stages:
- Stage 1: 400,000 kg propellant, 40,000 kg structure, engines: 7 Merlin-class (v_e = 3,050 m/s). Burns for 162 seconds.
- Stage 2: 90,000 kg propellant, 4,000 kg structure, engines: 1 Merlin Vacuum (v_e = 3,430 m/s). Burns for 367 seconds.
- Stage 3: 2,500 kg propellant, 500 kg structure, 1 small engine. Burns for 250 seconds (for a trans-lunar injection).

Simulate the entire launch sequence. Show the staging events: at stage 1 MECO (Main Engine Cutoff), the stage 1 hardware is dropped. The remaining mass ratio for stage 2 immediately improves because the deadweight is gone. Show the velocity jump at each staging event — not from extra thrust, but from the improved mass ratio. The Δv contributions from each stage are shown as segments on the velocity graph.

Then demonstrate "The Tyranny" visually: show that to add another 1 km/s of Δv, you need to multiply the total mass by e^(1000/3000) ≈ 1.4. A small velocity gain requires a 40% mass increase. Show a slider: "Add 1 km/s Δv" — watch the rocket grow in size by 1.4× each time you add 1 km/s. After 5 clicks (5 km/s extra), the rocket is 4.2× bigger than the original. After 10 clicks (10 km/s extra): 28× bigger. This is why leaving Earth's gravity well is so hard.

---

## The Interactive Demo

**Canvas:** Side-on view of rocket launch. Earth surface at the bottom. Altitude scale on the left (0 to 400 km). Atmosphere shown as gradient (dense blue at bottom fading to black by 100 km). Rocket shown as a simplified silhouette with flame from the bottom.

**Controls panel (right side):**
- `Exhaust Velocity (v_e)` — slider 1500–35000 m/s. Labels at key points: Chemical (3000), Nuclear Thermal (8000), Ion Drive (30000). v_e directly affects Δv.
- `Fuel Mass` — slider 1,000–1,000,000 kg (log scale)
- `Dry Mass (structure)` — slider 100–100,000 kg
- `Mass Flow Rate` — slider affects burn duration and thrust (but not Δv — Tsiolkovsky is independent of thrust)
- `Gravity` — toggle on/off (show pure Δv vs gravity drag)
- `Number of Stages` — 1, 2, or 3 stages with individual fuel sliders per stage

**Live readouts:**
- Current velocity (m/s)
- Current altitude (km)
- Remaining propellant mass (kg and % of total)
- Current acceleration (m/s² and g)
- Tsiolkovsky Δv prediction vs actual Δv (they should match throughout burn)
- Stage indicator

**Graph pane:** Switch between: (1) Velocity vs Time — the curving line, (2) Acceleration vs Time — rising throughout burn, (3) Mass vs Time — linear decrease during burn, (4) Δv contributions from each stage (bar chart)

**Buttons:**
- [Launch] — start the simulation
- [Stage] — manually trigger stage separation (or auto when fuel depleted)
- [Reset]
- [Tyranny Slider] — shows: to add X km/s of Δv, your total mass multiplies by Y

---

## Production Notes

**Runtime target:** 16–20 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook: vacuum thrust, naive misunderstanding, preview of tyranny — 1 min
- 1:00–4:30 — Naive code: constant mass, constant acceleration, seemingly reasonable — 3.5 min
- 4:30–7:00 — Failure: velocity divergence, factor-of-3 miss, practical LEO consequence — 2.5 min
- 7:00–10:00 — Physics: momentum conservation derivation, variable mass equation — 3 min
- 10:00–12:00 — The concept: Tsiolkovsky equation, tyranny visualization, Isp explained — 2 min
- 12:00–14:00 — The fix: variable mass code, acceleration curve, formula verification — 2 min
- 14:00–17:00 — Wow: multi-stage launch, staging events, tyranny slider demo — 3 min
- 17:00–18:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** Full canvas for launch animation. Code editor split for code sections. Show the velocity vs time graph throughout — the key visual is the curve vs line comparison.

**Zoom moments:**
- ZOOM on the mass readout decreasing during burn (real-time mass counter)
- ZOOM on the velocity curve vs naive straight line — the divergence at burnout
- ZOOM on the Tyranny Slider: adding 1 km/s at a time and watching rocket size multiply

**Pre-render animations:**
- Real rocket launch footage (SpaceX, NASA public domain) with mass readout overlay
- Clean derivation of Tsiolkovsky equation — write it step by step on a blackboard-style overlay
- Multi-stage rocket diagram with stage masses labeled

---

## Tags

`physics` `rockets` `momentum` `tsiolkovsky` `space` `javascript` `canvas` `beginner`

---

## Thumbnail

A rocket ascending against a black space background. On the left: "Naive" label with a straight velocity line graph. On the right: "Physics" label with a curved velocity line. The two lines start together and diverge dramatically — the physics line ending 3× higher. Below the rocket, a shrinking fuel gauge goes from full to nearly empty. The text overlay reads "WHY 90% OF A ROCKET IS FUEL" in bold white on a black bar. The channel logo CodedLaws is in the lower right. The emotion: the satisfying revelation of a hidden truth — everyone knows rockets use a lot of fuel, but the graph shows WHY the proportion is so extreme. The contrasting lines (wrong vs right) are immediately intriguing. The rocket flame adds drama and instantly communicates the topic.
