---
title: "Why Ships Float: Archimedes' Principle in Code"
id: B008
difficulty: 1.5/10
prereq: "None"
concept: "Buoyancy force F_b = ρ_fluid · V_submerged · g — equal to the weight of displaced fluid. An object floats when F_b equals its weight. Steel ships float because their hollow shape displaces enormous volumes of water."
tags: [physics, buoyancy, archimedes, fluid, density, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Ships Float: Archimedes' Principle in Code

**Alt title:** "Why Steel Floats and Styrofoam Sinks (It's Not What You Think)"
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open with two objects dropped into a tank of water: a solid steel ball (sinks instantly) and an empty steel can with a sealed lid (floats). The material is identical — both are steel. The steel ball sinks to the bottom. The steel can bobs at the surface. What is different?

Then show a cargo ship. The USS Gerald R. Ford, the world's largest aircraft carrier, weighs over 100,000 tons. It is made overwhelmingly of steel — yet it floats. Then show a beach ball, made of thin plastic with a wall thickness of 1mm. If you push it deep underwater, it pops back up violently. The ship and the beach ball float for the exact same physical reason, and it has nothing to do with the material — it has to do with the volume of water displaced.

Archimedes discovered this in a bathtub around 250 BCE. The legend (probably apocryphal but illustrative) says he stepped into a full bathtub and watched the water overflow. He realized the volume of overflow equaled the volume of his body — and the weight of that water equaled the buoyancy force pushing him up. He supposedly ran through Syracuse naked shouting "Eureka!" — a reaction appropriate for discovering one of the most elegant physical laws ever stated.

Then show the simulation failure: a naive model that can only represent "float" or "sink" based on density — a binary check that can't simulate a ship taking on water, can't find the floating depth, and can't model partial submersion. The fix will make partial submersion physics automatic, emergent, and beautiful.

---

## The Naive Attempt

Build the binary density-based model:

```javascript
// B008 — Naive: float or sink based on average density
const rho_water = 1000;  // kg/m³

function willFloat(object) {
  const avgDensity = object.mass / object.volume;
  return avgDensity < rho_water;  // Float if less dense than water
}

// Works for solid homogeneous objects:
const steelBall = { mass: 4.15, volume: 0.000531 };  // ρ = 7800 kg/m³ → sinks
const woodBlock  = { mass: 2.0, volume: 0.004 };     // ρ = 500 kg/m³ → floats

// But what about a hollow steel can?
const steelCan = { mass: 0.1, volume: 0.001 };  // volume includes air inside
// ρ_avg = 0.1/0.001 = 100 kg/m³ → floats (barely correct by coincidence)

// FAILURE CASE: What depth does the block float at?
// Binary model: either fully submerged or at the surface
// Can't compute draft depth (how deep it rides in the water)

function update(obj, dt) {
  if (willFloat(obj)) {
    obj.y = waterSurface;   // snap to surface — no partial submersion physics
  } else {
    obj.y += 9.81 * dt;    // fall under gravity
  }
}
```

Walk through the failures systematically:
1. The model correctly identifies that a wood block floats — but immediately snaps it to the surface rather than finding the correct draft depth. A 500 kg/m³ wood block should float at 50% submersion. The naive model shows it at the surface (0% submersion) — wrong.
2. The model cannot simulate a log bobbing — it's either snapped to the surface or falling. No oscillation.
3. Most critically, it cannot simulate a ship taking on water. As water floods in, the average density increases. But the model doesn't track how much of the object is actually submerged — it just checks if the object should float at all.
4. It cannot simulate cargo loading: adding weight to a ship should cause it to ride lower in the water (increase draft). The naive model can only say "still floating" or "sinking."

---

## The Moment of Failure

Show three scenarios where the naive model catastrophically fails:

**Failure 1 — Wrong draft depth.** A rectangular wood block (30 cm × 30 cm × 10 cm, density 600 kg/m³) is dropped in water. Naive model: density < 1000, it floats — snaps to surface, 0 cm of draft. Correct answer: 60% density means 60% submerged = 6 cm draft. Show the two blocks side by side in cross-section: left (naive) floats on the surface like a ghost. Right (correct) rides 6 cm deep. The visible freeboard is 4 cm. The difference is visually obvious and completely wrong in the naive case.

**Failure 2 — Cargo loading.** Place 5 kg of cargo on the wood block. Naive model: new average density = (mass of block + 5) / volume. Still < 1000, still "floating" — snapped to surface, no change in depth. Correct model: the block rides 2 cm lower. Add another 5 kg: 2 cm lower again. Eventually you can load enough cargo that the block sinks below the waterline — and the correct model shows the moment it tips from floating to sinking as a gradual deepening followed by a sudden capsize, not a binary flip.

**Failure 3 — Flooding.** Punch a hole in a ship hull. Water enters. Average density increases. Naive model: as soon as average density exceeds 1000 kg/m³, the ship instantly teleports to the bottom. Correct model: the ship gradually sinks lower as flooding progresses — buoyancy decreases (less volume above water to contribute), flooding accelerates, and there is a tipping point where flooding overtakes buoyancy and the ship sinks in a continuous, physically realistic progression.

Display: "The binary model fails for everything interesting. Real buoyancy is about the intersection of geometry with the water surface — and that intersection changes continuously."

---

## Why It Broke — The Physics

**Archimedes' Principle:** The buoyancy force on an object equals the weight of the fluid displaced by the object:

$$F_b = \rho_{fluid} \cdot V_{submerged} \cdot g$$

Where V_submerged is the volume of the object that is actually below the water surface. This is not the total volume of the object — only the part that is underwater.

**Physical derivation:** Consider an object submerged to depth h. The water pressure increases with depth: P = ρgh. The net upward pressure force on the object's bottom face exceeds the downward pressure force on its top face (because the bottom is deeper). The difference in pressure forces, integrated over the entire submerged surface, gives exactly F_b = ρ·V_sub·g. This works for any shape — the integration always gives the same result: weight of displaced fluid.

**Floating equilibrium:** An object floats when F_b = F_gravity:
$$\rho_{fluid} \cdot V_{submerged} \cdot g = m \cdot g$$
$$V_{submerged} = \frac{m}{\rho_{fluid}}$$

For an object with total volume V_total:
$$\frac{V_{submerged}}{V_{total}} = \frac{m}{\rho_{fluid} \cdot V_{total}} = \frac{\rho_{object}}{\rho_{fluid}}$$

This is the fraction submerged: a 600 kg/m³ wood block is 60% submerged (ρ_object/ρ_fluid = 0.6). A 900 kg/m³ wax block is 90% submerged. A steel ball (ρ = 7800 kg/m³) would need to be 7.8× submerged — impossible, so it sinks.

**Why hollow ships float:** The "average density" of a ship hull (steel walls + hollow interior filled with air) is far less than 1000 kg/m³ because the interior air contributes to the volume with negligible mass. A ship with a hollow volume of 100,000 m³ and a steel mass of 80,000 tonnes has an average density of 800 kg/m³ — it floats, riding 80% submerged. This is the Plimsoll line.

---

## The One Concept

**Archimedes' Principle** (Buoyancy): An object partially or fully immersed in a fluid experiences an upward force equal to the weight of the fluid it displaces:

$$\boxed{F_b = \rho_{fluid} \cdot V_{submerged} \cdot g}$$

**Key quantities:**
- ρ_fluid: water = 1000 kg/m³ (fresh), 1025 kg/m³ (sea), 1230 kg/m³ (Dead Sea), 13,600 kg/m³ (mercury)
- V_submerged: the volume of the object BELOW the fluid surface — this changes as the object bobs up and down
- The restoring force: if the object sinks deeper than equilibrium, V_sub increases, F_b increases, pushing it back up. This creates oscillatory behavior — the bobbing you see in a bathtub toy.

**The oscillation frequency:** For a floating rectangular block, the restoring force is F = -ρ_water · A · g · Δy (where A is cross-sectional area and Δy is displacement from equilibrium). This is a linear spring! So the block oscillates at:
$$\omega = \sqrt{\frac{\rho_{water} \cdot A \cdot g}{m}}$$

This is the natural rocking frequency of a floating object — same math as a spring-mass system.

**Real-world examples:**
1. **Submarine dive control:** Submarines control buoyancy by flooding ballast tanks (increasing mass while volume stays fixed → average density increases → submarine descends). To surface: blow compressed air into ballast tanks → expel water → average density decreases → submarine ascends. Pure Archimedes.
2. **Plimsoll line:** A load mark on every ship's hull indicating maximum safe submersion depth. Loaded beyond this, the buoyancy margin is too small and the ship is in danger of sinking in heavy seas.
3. **Floating in the Dead Sea:** Dead Sea brine has density ≈ 1230 kg/m³. Human body density ≈ 985 kg/m³. The ratio: humans float at 985/1230 = 80% submerged — meaning 20% of body volume is above the surface. You float effortlessly and cannot sink without deliberate effort.
4. **Hot air balloon:** The balloon's envelope displaces air (ρ_air ≈ 1.225 kg/m³). Hot air inside (ρ_hot ≈ 0.9 kg/m³) is less dense than surrounding air. The buoyancy force equals the weight of the displaced cool air — if this exceeds the total weight of balloon, basket, and payload, the balloon rises. Identical to ship floating, but in air instead of water.

---

## The Fix

```javascript
// B008 — Correct buoyancy: compute V_submerged from geometry
const g         = 9.81;
const rho_water = 1000;  // kg/m³

// Rectangular hull: width w, height h, depth into page d
// Position y = center of the hull; waterSurface = 0 (y increases downward)
class FloatingBox {
  constructor(w, h, d, mass) {
    this.w = w;             // width (m)
    this.h = h;             // height (m)
    this.d = d;             // depth (m, into screen)
    this.mass = mass;       // total mass (kg) — can change (cargo, flooding)
    this.y = -h / 2;        // center y position (starts at surface)
    this.vy = 0;            // vertical velocity
  }

  computeVSubmerged() {
    // Top of box is at y - h/2, bottom at y + h/2
    // Water surface at y_surface = 0
    const top    = this.y - this.h / 2;
    const bottom = this.y + this.h / 2;

    // Submerged depth: portion of box below y_surface = 0
    const submergedDepth = Math.max(0, Math.min(this.h, -top));
    // = max(0, min(h, amount below surface))

    return submergedDepth * this.w * this.d;  // V = depth × width × d
  }

  update(dt) {
    const V_sub = this.computeVSubmerged();
    const F_b   = rho_water * V_sub * g;       // buoyancy force (up)
    const F_g   = this.mass * g;               // gravity (down)
    const F_net = F_b - F_g;                   // positive = upward

    const acceleration = F_net / this.mass;
    this.vy += acceleration * dt;
    this.vy  *= 0.98;                          // water damping
    this.y   += this.vy * dt;
  }
}

// At equilibrium: F_b = F_g
// rho_water * V_sub * g = mass * g
// V_sub = mass / rho_water
// For box: submergedDepth * w * d = mass / rho_water
// submergedDepth = mass / (rho_water * w * d)
// Draft = mass / (rho_water * waterplane_area) — the ship design formula
```

The critical change: `computeVSubmerged()` computes the actual intersection of the box geometry with the water surface. As the box descends, V_sub increases. As it rises, V_sub decreases. The net force automatically drives the box toward the equilibrium depth. The oscillation around equilibrium (bobbing) is an automatic consequence — no extra code required. The code is minimal, the physics is rich.

Show the formula derivation on screen: set F_b = F_g, solve for equilibrium depth. It matches what the simulation converges to. Verify with numbers: mass = 60 kg, box 0.3×0.3 m in cross-section, water density 1000 kg/m³. Draft = 60/(1000×0.3×0.3) = 0.667 m. Show simulation settling at exactly 66.7 cm submersion.

---

## The Wow Moment — Push It

Build an interactive cargo-ship simulation. The ship hull is an L-shaped cross-section (flat bottom, raised sides) with a volume of 500 m³. Initial mass: 100,000 kg (100 tonnes of steel). Draft: 0.2 m. Load the ship with cargo interactively:

Click "Add 10-tonne cargo block" — drag cargo containers onto the ship deck. Watch the ship ride progressively lower in the water. The draft readout increases. The Plimsoll line (a horizontal mark on the ship's hull) approaches the waterline.

Change fluid density: slide from freshwater (1000 kg/m³) to seawater (1025 kg/m³). Watch the ship rise 2.5% in the water — fewer cubic meters of seawater need to be displaced to support the same mass. This is why the Plimsoll line has different marks for different waters (fresh river water, tropical seawater, North Atlantic in winter — all slightly different densities).

Then punch a hole in the hull: click a "FLOOD" button, which starts adding mass (water inflow) and simultaneously reduces the interior air volume. Watch the flooding progression — the ship rides lower, flooding accelerates (more hull below waterline = more water pressure = faster inflow), and eventually there is a tipping point. The ship's stern or bow dips below the waterline, flooding catastrophically accelerates, and the ship sinks with realistic physics — not a snap to the bottom, but a horrifying slow-then-fast descent with the hull partially above water the whole time.

Then do the positive version: show a submarine. Flood the ballast tanks gradually → submarine descends. Blow the tanks → ascends. Pure buoyancy control, no propellers involved in the depth change.

---

## The Interactive Demo

**Canvas:** Side view of a body of water. Objects can be placed and dropped. The water surface is a sharp horizontal line with a slight wave animation. Below the surface, a blue-gradient tint shows depth.

**Object library (click to place, then drag in water):**
- Solid steel ball (ρ = 7800 kg/m³) — sinks
- Wood block (ρ = 600 kg/m³) — floats at 60% submersion
- Ice cube (ρ = 917 kg/m³) — floats at 91.7% submersion (iceberg mode!)
- Cork (ρ = 120 kg/m³) — mostly above water
- Ship hull (hollow steel, avg ρ = 200 kg/m³) — floats high
- Beach ball (ρ = 30 kg/m³) — mostly above water
- Human body (ρ = 985 kg/m³) — just barely floats (realistic — barely above water)

**Sliders:**
- `Fluid Density` — 800 (cooking oil) to 13,600 kg/m³ (mercury). At mercury, even steel floats.
- `Gravity` — affects both weight and buoyancy equally; changing g doesn't change which objects float (ratio is density-only) — an interesting physics lesson
- `Damping` — how "viscous" the fluid is (affects oscillation settling time)

**Ship panel (separate tab):**
- Cargo mass slider (0–500 tonnes)
- Cargo position (fore/aft) — affects trim angle
- Flooding rate slider
- Fluid density selector (Fresh / Baltic / Ocean / Dead Sea / Mercury)

**Live readouts:**
- Object density vs fluid density (bar chart comparison)
- Current draft depth (m)
- Submerged volume (m³)
- Buoyancy force (N)
- Weight (N)
- Net force (N, + or -)

---

## Production Notes

**Runtime target:** 14–17 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook: steel ball sinks, steel can floats, aircraft carrier story, Archimedes bathtub — 1 min
- 1:00–4:00 — Naive code: binary density check, three failure scenarios enumerated — 3 min
- 4:00–6:00 — Failure: draft depth wrong, cargo loading wrong, flooding binary snap — 2 min
- 6:00–9:00 — Physics: Archimedes principle derivation, pressure explanation, hollow ships — 3 min
- 9:00–11:00 — The concept: buoyancy formula, oscillation frequency, real-world applications — 2 min
- 11:00–13:00 — The fix: computeVSubmerged, draft formula, oscillation demonstration — 2 min
- 13:00–15:00 — Wow: ship loading, Plimsoll line, flooding scenario, submarine — 2 min
- 15:00–16:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** The water tank canvas is extremely visual — make it full screen with the code overlay as a semi-transparent panel. The floating/sinking physics is so immediately satisfying that the visual should dominate.

**Zoom moments:**
- ZOOM on the draft depth formula: draft = mass / (ρ × waterplane_area)
- ZOOM on the ship riding visibly lower as cargo is added
- ZOOM on the flooding tipping point — the moment the ship goes from slow descent to rapid sinking
- ZOOM on the Dead Sea slider — human silhouette floating effortlessly with 20% above water

**Pre-render animations:**
- Archimedes bathtub illustration — water overflowing as he submerges, equal weight displayed
- Pressure distribution diagram — showing higher pressure at bottom than top, net upward force
- Plimsoll line graphic — the different load marks for different water types

---

## Tags

`physics` `buoyancy` `archimedes` `fluid` `density` `javascript` `canvas` `beginner`

---

## Thumbnail

Split frame, bright water-blue background. Left half: a solid steel ball sinking, downward arrow labeled "SINKS" and its density "7,800 kg/m³." Right half: a steel ship floating at the waterline, upward arrow labeled "FLOATS" and its average density "200 kg/m³." A large equals sign sits between them with the caption "SAME MATERIAL." Big bold text at the top: "WHY DOES THIS FLOAT?" The ship is shown partially submerged with a visible Plimsoll line. The water surface is rendered as a sharp crisp line dividing the submerged blue from the air above. Emotion: genuine confusion-to-insight — the paradox of steel floating is intriguing to everyone who has ever thought about it. The "SAME MATERIAL" label is the scroll-stopper because it forces the viewer to confront the paradox directly.
