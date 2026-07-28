---
title: "Why Some Paper Airplanes Glide and Some Dive (Aerodynamics)"
id: B036
difficulty: 2.5/10
prereq: "B009 — Aerodynamic Lift"
concept: "Longitudinal stability requires center of pressure to be behind center of mass; displacement from this equilibrium creates restoring pitch torque — the prerequisite for stable gliding flight"
tags: [physics, paper-airplane, aerodynamics, lift-drag, stability, center-of-mass, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Some Paper Airplanes Glide and Some Dive (Aerodynamics)

**Alt title:** "One Sheet of Paper, Two Folds, Completely Different Physics"
**Difficulty:** 2.5/10 | **Prereq:** B009 — Aerodynamic Lift

---

## Opening Hook (0:00–1:00)

Hold up two paper airplanes — both made from standard A4 paper. Fold them on camera, taking exactly 30 seconds for each. The first is the classic "Dart" — heavy nose from multiple leading folds, narrow delta wing, long fuselage. The second is a "Wide Wing" — almost no fuselage, wing running nearly the full paper width, almost no nose weight. Hold both at the same launch position. Apply the same gentle push with the same force. Release.

The Dart glides for 5 seconds, covering 4 meters in a gentle arc. The Wide Wing immediately pitches up, stalls violently, flips over, and falls straight down. Same paper, same hand, same force, same air — radically different outcomes. Ask the question: "Which physical quantity is different between these two designs?" The answer is not lift. It is not drag. It is not even wing area. It is the relative position of two invisible points: the center of pressure and the center of mass. Understanding this one relationship allows you to predict any paper airplane's flight behavior before throwing it.

Paper airplanes are the most accessible aerodynamics laboratory ever invented. A sheet of paper, a fold, and physics immediately gives you feedback. We are going to build a simulator that lets you drag wing panels onto a fuselage, computes CoM and CoP in real time, and tells you whether the design will fly — before you throw it.

---

## The Naive Attempt

Build a 2D side-view flight simulator. Represent the paper airplane as a rectangle. Apply lift as a constant upward force proportional to wing area and speed squared. Apply drag as a constant backward force. Apply gravity. The plane glides along a fixed equilibrium angle.

```javascript
const plane = {
  pos: { x: 0, y: 100 },
  vel: { x: 5, y: 0 },
  angle: 0,             // pitch angle (rad)
  omega: 0,             // pitch angular velocity
  mass: 0.005,          // kg (one sheet of paper ~5 grams)
  wingArea: 0.04,       // m²
  CL: 0.8,
  CD: 0.05
};

function update(dt) {
  const speed = Math.hypot(plane.vel.x, plane.vel.y);
  const rho = 1.225;

  // Fixed lift and drag (no CoM/CoP)
  const F_lift = 0.5 * rho * plane.wingArea * plane.CL * speed**2;
  const F_drag = 0.5 * rho * plane.wingArea * plane.CD * speed**2;

  plane.vel.x -= (plane.vel.x/speed) * F_drag / plane.mass * dt;
  plane.vel.y += (F_lift - plane.mass * 9.81) / plane.mass * dt;
  plane.pos.x += plane.vel.x * dt;
  plane.pos.y += plane.vel.y * dt;
  // Pitch: not computed (no CoM/CoP model)
}
```

Run this for both the Dart and the Wide Wing. Both glide identically — same trajectory, same glide ratio, same flight time. The model cannot distinguish them because CoM and CoP locations are not computed.

---

## The Moment of Failure

The two aircraft (Dart and Wide Wing) produce identical flight paths on screen. Both smoothly glide forward at an equilibrium angle. This is obviously wrong for the Wide Wing — you just watched it immediately stall and fall. The simulation's failure is not a crash or a numerical explosion: it's a boring sameness. Every airplane you design flies perfectly, regardless of how badly it's designed.

Place the wings at the very nose of the fuselage and run the simulation — still a perfect glide. Place them at the very tail — perfect glide. Place only one tiny wing on one side — still glides (the model doesn't even compute left-right asymmetry). The simulation cannot fail. That's the failure. A model that cannot fail cannot teach you anything about what makes a design work. It has no discriminating power.

This is a lesson about modeling: when your model lacks a mechanism for failure, it cannot guide engineering decisions. The CoM/CoP relationship is not a detail — it is the fundamental mechanism of pitch stability. Without computing it, the model is not a physics simulator, it is a glorified projectile trajectory calculator that happens to have a wing-shaped picture.

---

## Why It Broke — The Physics

Pitch stability requires that any small perturbation in pitch angle generates a restoring torque that brings the aircraft back to equilibrium. This depends entirely on where the center of mass (CoM) and center of pressure (CoP) are relative to each other.

**Center of Mass:** The average position of all mass elements, weighted by mass. For a paper airplane, the nose folds concentrate mass at the front. `x_CoM = Σ(m_i * x_i) / Σm_i`.

**Center of Pressure:** The point where the net aerodynamic force (lift + drag) effectively acts on the wing. For a simple flat-plate wing, the CoP is located at approximately the 25% chord point (quarter-chord rule from thin airfoil theory). For more complex multi-surface designs, it's the aerodynamic-force-weighted average of all surface contributions.

**Pitch Torque:** If the nose pitches up by angle Δα, lift increases (more angle of attack), and the resulting pitch torque is:
```
τ_pitch = (x_CoP - x_CoM) * F_lift * cos(Δα)
```
- If x_CoP > x_CoM (CoP behind CoM): positive pitch-up increases torque that pushes nose down — **restoring, stable.**
- If x_CoP < x_CoM (CoP ahead of CoM): positive pitch-up increases torque that pushes nose further up — **destabilizing, unstable.** The stall is progressive and divergent.

The Wide Wing has CoP way ahead of CoM (wide wing far forward, no nose ballast). Any pitch-up perturbation leads to progressive stall. The Dart has CoP slightly behind CoM (heavy nose pulls CoM forward of the quarter-chord location). Any perturbation is damped.

---

## The One Concept

**Pitch Stability and the CoM/CoP Relationship** is the determining factor for whether a winged vehicle glides or diverges. It is one instance of the general principle of static stability: any equilibrium where perturbations generate restoring forces is stable; perturbations that generate amplifying forces are unstable.

**Formal Criterion:**
- Stability condition: `x_CoP > x_CoM` (measured positive toward the tail)
- Equivalently: the static margin `SM = (x_CoP - x_CoM) / MAC > 0` where MAC is the mean aerodynamic chord.
- SM too large: plane is "pitch heavy" — glides but dives steeply.
- SM slightly positive (~5-15%): stable glide, good handling.
- SM = 0: neutrally stable — glides but any perturbation creates a permanent angle change.
- SM < 0: unstable — diverges in pitch.

**Physical Intuition:** Think of a badminton shuttlecock: the heavy rubber tip is far ahead of the feathers (aerodynamic surface). This gives enormous positive static margin — the shuttlecock always flies cork-first, self-correcting instantly. A paper airplane with too much static margin is like a shuttlecock — it's stable, but it dives (too nose-heavy). Too little margin and it behaves like a shuttlecock held backward — the aerodynamic end is forward, and it immediately flips.

**Real-World Examples:**
1. **Real aircraft:** Airliners maintain SM around 5-10% of MAC. Fighter jets are intentionally designed with negative SM (statically unstable) and use fly-by-wire computers to artificially maintain control — instability makes them more maneuverable but impossible for human pilots to fly unaided.
2. **Canard designs:** On a canard aircraft (small wing at the front, large wing at the back — like the Wright Flyer), CoP is pushed rearward by the large rear wing, allowing nose-heavy designs to fly stably. Many supersonic aircraft use canards to balance the rearward CoP shift at supersonic speeds.
3. **Arrows and darts:** An arrow's fletching (feathers) creates drag behind the center of mass, providing directional stability. Without fletching, arrows tumble after leaving the bow — same CoM/CoP stability principle, applied to drag rather than lift.

---

## The Fix

Compute CoM and CoP from the airplane geometry at every timestep. Model the airplane as a collection of rectangular panels (fuselage sections and wing sections), each with a specified area, position, and material (nose fold = 4× paper density, body = 1× paper density, tail = 1× paper density).

```javascript
function computeCoM(panels) {
  let totalMass = 0;
  let weightedX = 0;
  for (const panel of panels) {
    const m = panel.area * panel.density;  // surface area × paper density
    weightedX += m * panel.centerX;
    totalMass += m;
  }
  return { x: weightedX / totalMass, totalMass };
}

function computeCoP(panels) {
  // Each wing panel contributes lift at its quarter-chord point
  let totalLift = 0;
  let weightedX = 0;
  for (const panel of panels) {
    if (panel.isLiftingSurface) {
      const lift_local = panel.area * panel.CL;    // proportional lift
      const cop_local = panel.leadingEdgeX + 0.25 * panel.chord;
      weightedX += lift_local * cop_local;
      totalLift += lift_local;
    }
  }
  return totalLift > 0 ? weightedX / totalLift : 0;
}

// In physics update:
const { x: xCoM, totalMass } = computeCoM(panels);
const xCoP = computeCoP(panels);
const staticMargin = (xCoP - xCoM) / meanAerodynamicChord;

// Pitch restoring torque
const tau_pitch = (xCoP - xCoM) * F_lift_total;
const I_pitch = totalMass * (span / 2)**2 * 0.08;   // approx pitch inertia
plane.omega += (tau_pitch / I_pitch) * dt;
plane.angle += plane.omega * dt;
```

Add pitch damping (angular drag). Run the simulation with the Dart geometry — stable, small static margin, gentle glide. Run with Wide Wing geometry — CoP ahead of CoM, immediate pitch-up divergence, stall, fall. The simulation now correctly distinguishes them.

---

## The Wow Moment — Push It

Implement a genetic evolution mode. Generate 100 random paper airplane designs: random number of panels (1-4 wing panels), random positions, random areas, random nose-fold masses. Simulate each for 3 seconds. Measure glide distance. Discard the bottom 90%, mutate the top 10% (add random noise to panel positions and sizes), repeat for 30 generations.

Show the evolutionary fitness curve rising — generation 1 average glide: 1.2 m. Generation 10: 3.8 m. Generation 30: 7.4 m. Show the best individual from each generation as a panel layout — the simulator discovers wing configurations that approximate real glider design principles: wings set slightly behind the CoM, moderate nose ballast, low-drag narrow-chord wings.

Side-by-side comparison at generation 30: the optimized evolved design vs. a crumpled paper ball (pure drag, near-zero lift). The evolved glider covers 7.4 meters; the crumpled ball drops 2.3 meters forward. A flat sheet of paper — just configured correctly — is 3× more capable than the same paper wadded up. The design is the physics.

---

## The Interactive Demo

Full-featured paper airplane designer with side-view flight simulation canvas (1200×600 px, school gymnasium background):

**Design Interface (top panel):**
- Drag-and-drop rectangular panels onto a fuselage outline.
- Each panel has: position along fuselage, chord length, span width, fold count (affects local density/mass).
- **CoM indicator** (blue dot) and **CoP indicator** (red dot) update live as panels are moved.
- **Static Margin display**: a horizontal bar showing CoP vs. CoM position. Green zone = stable glide. Red zone = unstable.
- **Design Name** field and save button (stores designs in localStorage).

**Flight Simulation (bottom panel):**
- Click "Throw" to launch the current design with a gentle push (v = 4 m/s, slight upward angle).
- Real-time flight with pitch dynamics — see the nose tracking up and down as the plane finds its equilibrium glide angle.
- Glide distance counter.
- Stall indicator: flashes red when angle of attack exceeds 15°.
- Pitch angle vs. time graph (mini chart).

**Preset Designs:**
- Classic Dart (stable, good glider).
- Wide Wing Stunt (near-neutral SM, loops on command).
- Canard design (small front wing, large rear wing).
- Crumpled ball (drag-only mode).
- Optimal glider (GA result from evolution mode).

**Special Modes:**
- **Wind tunnel:** apply a steady horizontal wind, see how each design responds.
- **Genetic evolution:** click "Evolve" and watch 100 generations of paper airplanes automatically optimizing.
- **Build guide:** step-by-step folding instructions shown alongside the model for the selected preset.

---

## Production Notes

**Structure and timing:**
- Hook: 0:00–1:00 (60 s). Film the two real paper airplane throws on camera — must be a clean, unbroken shot. A wide camera angle captures the full flight path of the dart. Use a gimbal-stabilized iPhone at 240 fps for the Wide Wing stall — it's brief but the physics is vivid. The contrast in outcomes is the entire hook.
- Naive attempt: 1:00–2:30 (90 s). The naive code is compact. Deliberately show both planes "gliding" identically in the naive simulation — point at the screen and say "this is wrong, and here's exactly why."
- Physics explanation: 2:30–5:30 (180 s). The CoM/CoP section is the intellectual heart of this video. Use a printed diagram of the Dart showing CoM (heavy blue dot at nose) and CoP (red dot at quarter-chord of wing). Show the torque arrow for both stable and unstable configurations. The shuttlecock analogy is visually compelling — have one on desk as prop.
- The fix: 5:30–7:30 (120 s). The panel-based geometry computation is the key addition. Show it computing CoM and CoP numbers, then see the static margin display go from red to green as you move the nose-fold panel.
- Wow moment: 7:30–10:00 (150 s). The evolutionary optimization is the technical showpiece. Pre-render or cache the fitness curve to ensure it runs smoothly. The moment where the evolved design looks like a real glider is the payoff.
- Interactive demo: 10:00–11:30 (90 s). The design interface is complex enough to need a fuller walkthrough.

**Key filming decisions:** Use a 45° wide-angle lens for the real paper airplane throws to capture both the near and far ends of the flight. Have colored paper (not white) for better camera contrast. The simulation IDE should show the CoM and CoP dot positions update in real time as you edit panel positions — this live feedback is what makes the concept click.

**Approximate runtime:** 11–12 minutes.

---

## Tags
`physics` `paper-airplane` `aerodynamics` `lift-drag` `stability` `center-of-mass` `javascript` `canvas`

---

## Thumbnail

Two paper airplanes side by side in mid-flight: on the left, the Dart gliding smoothly with a green trajectory arc; on the right, the Wide Wing frozen at the top of a stall, nose pointed vertically upward, on the verge of falling backward. Overlaid on each: a small blue dot (CoM) and red dot (CoP) with an arrow between them — the arrow points backward on the Dart (stable), forward on the Wide Wing (unstable). Large text: "SAME PAPER." Sub-text: "Completely different physics." The thumbnail answers its own question — anyone who's ever had a paper airplane disaster immediately recognizes the scenario. The CoM/CoP dots are unexplained and intriguing, teasing the "invisible physics" explanation that's only available in the video.
