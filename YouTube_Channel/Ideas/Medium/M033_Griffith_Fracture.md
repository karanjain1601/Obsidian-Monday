---
title: "Coding Crack Propagation (Griffith Fracture Criterion)"
id: M033
difficulty: 6/10
prereq: "M032"
concept: "Griffith's criterion: a crack grows when strain energy release rate G = K²/E ≥ 2γ (surface energy); cohesive zone model as a simulation approach; crack path follows maximum tensile stress or maximum energy release direction."
tags: [griffith-criterion, fracture-mechanics, cohesive-zone, crack-path, energy-release, FEM, canvas, structural-mechanics]
category: medium
type: video-idea
---

# Coding Crack Propagation (Griffith Fracture Criterion)

**Alt title:** "The Equation That Predicts Where Cracks Go (Griffith Criterion)"
**Difficulty:** 6/10 | **Prereq:** M032 (stress intensity factor)

---

## Opening Hook (0:00–1:00)

Show a slow-motion video of a crack propagating through a transparent block of PMMA (acrylic). The crack tip is visible, and ahead of it you can see a bright caustic — a region of light concentration caused by the stress field refracting light. The crack tip advances with a distinctive "wobbly" path that's not quite straight.

Voiceover: *"In 1921, Alan Griffith asked: what determines whether a crack will grow? Not just 'does it grow or not' — but how fast, in which direction, and when does it stop? He derived a criterion from first principles using only energy conservation. Today we code his criterion directly, and use it to simulate a crack that finds its own path through a material. It will surprise you."*

Cut to the simulation canvas: a rectangular plate with a small initial crack on the left edge. Apply tension at the top and bottom. The crack sits dormant. Increase the load. At a critical value, the crack jumps forward. "The Griffith criterion just triggered. Let's see why."

---

## The Naive Attempt

**What we code first:** A simple 2D finite-difference elastic solver with a "delete element" approach to crack propagation — when stress at an element exceeds a threshold, delete the element (zero out its stiffness). Apply tension. Watch the crack "grow" by element deletion.

```javascript
// Naive: element deletion when stress exceeds threshold
// Represent the plate as a 2D grid of nodes, spring network
const Nx = 40, Ny = 30; // grid size
const dx = 10; // pixel spacing
const nodes = [];
const springs = [];
const THRESHOLD_STRESS = 1.5; // arbitrary units

// Initialize nodes
for (let j = 0; j < Ny; j++) {
  for (let i = 0; i < Nx; i++) {
    nodes.push({
      x: i * dx + 100, y: j * dx + 50,
      vx: 0, vy: 0, fx: 0, fy: 0,
      fixed: false, alive: true
    });
  }
}

// Add springs between adjacent nodes (horizontal, vertical, diagonal)
for (let j = 0; j < Ny; j++) {
  for (let i = 0; i < Nx; i++) {
    const idx = j * Nx + i;
    if (i < Nx-1) springs.push({i: idx, j: idx+1, restLen: dx, alive: true});
    if (j < Ny-1) springs.push({i: idx, j: idx+Nx, restLen: dx, alive: true});
    if (i < Nx-1 && j < Ny-1) springs.push({i: idx, j: idx+Nx+1, restLen: dx*Math.SQRT2, alive: true});
    if (i > 0 && j < Ny-1) springs.push({i: idx, j: idx+Nx-1, restLen: dx*Math.SQRT2, alive: true});
  }
}

// Initial crack: kill springs along left half of center row
const crackY = Math.floor(Ny/2);
for (const s of springs) {
  const ni = nodes[s.i], nj = nodes[s.j];
  if (Math.abs(ni.y - crackY*dx - 50) < 2 && ni.x < (Nx/2)*dx + 100) {
    s.alive = false;
  }
}

// Apply tension: fix bottom row, displace top row upward
// Spring forces, verlet integration, check for failure
function updateSprings() {
  for (const s of springs) {
    if (!s.alive) continue;
    const ni = nodes[s.i], nj = nodes[s.j];
    const dx = nj.x - ni.x, dy = nj.y - ni.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    const strain = (len - s.restLen) / s.restLen;
    if (Math.abs(strain) > THRESHOLD_STRESS) {
      s.alive = false; // DELETE — naive failure mode
      return;
    }
    const force = 1.0 * (len - s.restLen); // Hooke's law, k=1
    ni.fx += force * dx/len;
    ni.fy += force * dy/len;
    nj.fx -= force * dx/len;
    nj.fy -= force * dy/len;
  }
}
```

The naive deletion approach produces a "crack" that looks like a ragged checkerboard hole rather than a smooth crack. The path is dominated by the grid geometry — cracks always prefer to propagate along the spring directions (horizontal, vertical, ±45°). Even with diagonal springs, there are only 4 possible crack directions. Real cracks propagate in arbitrary directions.

Furthermore, the energy balance is wrong: deleting springs removes stored elastic energy abruptly, causing a shockwave that can trigger more deletions nearby — producing avalanching (too many elements deleted at once) or no propagation (if the threshold is too high). The crack may jump across several elements at once or get stuck entirely.

---

## The Moment of Failure

Run the naive simulation with a horizontal crack initiator and vertical tension. Expected result: crack propagates horizontally (perpendicular to the maximum tension, as LEFM predicts). Actual result: crack zigzags along the diagonal spring directions, producing a staircase pattern instead of a straight horizontal crack.

Show a comparison with the correct LEFM prediction overlaid as a red line: the actual crack path should be perfectly horizontal, but the simulated crack deviates by up to ±45° from the true path.

Second failure mode: on a diagonal crack initiator (tilted 30° from horizontal), LEFM predicts the crack will curve back toward horizontal. The naive simulation has the crack continue in the direction of the nearest spring — no curvature at all.

Display the **stress map** computed from the spring forces. Near the crack tip, the stress should show the characteristic 1/√r singularity — intensely concentrated at the tip. The naive spring network shows the stress smeared over a 3-node-radius region, unable to represent the singularity. This failure to represent the stress singularity means the spring's failure criterion is triggered at the wrong location (often behind or beside the true crack tip, not ahead of it).

---

## Why It Broke — The Physics

The naive approach fails on two fronts: geometry (grid-constrained crack paths) and physics (energy balance violated at each deletion step).

**Griffith's energy criterion** provides the correct framework. Consider a crack of length a in an infinite elastic plate under uniform tension σ. The total energy is:

```
E_total = E_elastic - U_stored + U_surface
E_elastic = (plate strain energy without crack) = σ²·V/(2E)
U_stored  = (additional strain energy released by crack) = πa²σ²/E  (per unit thickness)
U_surface = (surface energy to create crack faces) = 4aγ  (factor 4: 2 faces × 2 half-lengths)

Griffith criterion: ∂E_total/∂a = 0 at critical condition
→ 2πaσ²/E = 4γ
→ σ_c = √(2Eγ/πa)
```

A crack grows when σ > σ_c. This is equivalent to K_I > K_IC = √(2Eγ).

**Crack direction:** A crack propagates in the direction that maximizes the energy release rate G per unit crack extension. For a crack at angle θ to the applied stress, the energy release rate is:

```
G(θ) = (K_I² + K_II²) / E'
```

where K_I and K_II are the mode-I and mode-II stress intensity factors (mode-II is in-plane shear). The crack turns to the angle θ* where K_II = 0 — i.e., where there is no shear at the crack tip. This is the **maximum hoop stress criterion** (MHC): the crack kinks to the angle of maximum circumferential stress around the tip.

For a crack inclined at angle β to the tensile axis, the kink angle θ* satisfies:

```
K_I sin(θ*) + K_II(3cos(θ*) - 1) = 0
```

which for pure mode-I gives θ* = 0 (straight ahead), and for mixed mode gives a kink toward the principal stress direction.

The spring network fails because it cannot represent K_I and K_II accurately — the 1/√r stress singularity requires asymptotic element refinement (h-refinement in FEM) near the tip, or special enrichment functions (X-FEM).

---

## The One Concept

**The Griffith Criterion and Cohesive Zone Modeling**

Alan Griffith in 1921 was investigating why glass fibers were much stronger than bulk glass (up to 1000× stronger in thin fibers). He realized that strength is controlled not by the theoretical bond strength but by the largest existing defect (crack). From thermodynamic energy balance, he derived that a crack in an elastic solid will extend when the rate of strain energy release equals the rate of surface energy creation. This is fundamentally an energy conservation statement.

The **strain energy release rate** G has units of J/m²: energy released per unit area of crack extension. The material's **fracture energy** Γ = 2γ (also J/m²) is twice the surface energy because two new surfaces are created. Griffith's criterion: G ≥ Γ. In terms of stress intensity: G = K²/E (plane stress) or G = K²(1-ν²)/E (plane strain). So K_IC = √(EΓ) = √(2Eγ).

**The cohesive zone model (CZM)** is the modern computational approach to simulate crack propagation without the stress singularity problem. Instead of a sharp crack tip, a small "process zone" ahead of the crack tip is modeled with a traction-separation law: the cohesive elements can sustain stress up to a peak value σ_c (cohesive strength), after which the traction decreases as the separation increases, reaching zero at a critical displacement δ_c. The area under the traction-separation curve equals the fracture energy: Γ = ∫₀^δc σ(δ) dδ.

The most common law is the bilinear model:
```
σ(δ) = σ_c · (δ / δ₀)          for δ ≤ δ₀ (linear loading)
σ(δ) = σ_c · (δ_c - δ)/(δ_c - δ₀)  for δ₀ < δ ≤ δ_c (softening)
σ(δ) = 0                        for δ > δ_c (fully separated)
```

This elegantly captures: (1) the linear elastic response before damage, (2) damage initiation at σ_c, (3) progressive softening as crack opens, (4) complete fracture at δ_c. The fracture energy Γ = σ_c · δ_c / 2 (triangle area).

In simulation, cohesive elements are placed at every potential crack path (between all mesh elements). Most cohesive elements stay in their linear regime (no damage). Only those near the crack tip enter softening. The crack propagates wherever cohesive elements reach δ_c — without needing to know the crack path in advance. This is far more general than LEFM: it handles crack initiation (not just propagation of pre-existing cracks), crack branching, and complex non-planar crack paths naturally.

**The crack path follows the path of maximum cohesive opening.** In a symmetric loading configuration, this is the symmetry plane. Under asymmetric loading (mixed mode), the crack kinks to the angle of maximum principal stress — consistent with the maximum hoop stress criterion.

**Why this matters for engineering:** The Challenger Space Shuttle disaster (1986) involved crack propagation in O-rings at low temperature. The crack propagated because the fracture toughness of cold rubber was exceeded by the tensile stress from combustion gas pressure. Griffith's criterion applied: K_I > K_IC. The solution — ensuring K_I < K_IC by keeping O-rings above their glass transition temperature — directly follows from the same energy balance Griffith derived in 1921.

---

## The Fix

The fix has two parts: (1) a proper 2D elastic solver (mass-spring with meshless gradient correction, or a very simple FEM), and (2) cohesive zone elements along the potential crack path.

```javascript
// Fix: Cohesive Zone Model on a 2D triangular mesh

// Cohesive element between two mesh elements (3-node triangles)
class CohesiveElement {
  constructor(nodeTopLeft, nodeTopRight, nodeBotLeft, nodeBotRight) {
    // 4-node cohesive element (zero-thickness initially)
    this.nodes = [nodeTopLeft, nodeTopRight, nodeBotLeft, nodeBotRight];
    this.sigma_c = 50;  // MPa, cohesive strength
    this.delta_c = 0.5; // mm, critical separation
    this.delta_0 = 0.05; // mm, damage onset separation
    this.damage = 0;    // 0=intact, 1=fully fractured
    this.alive = true;
  }

  computeOpening() {
    // Normal opening (mode I) = average separation between top and bottom faces
    const top_mid_x = (this.nodes[0].x + this.nodes[1].x) / 2;
    const top_mid_y = (this.nodes[0].y + this.nodes[1].y) / 2;
    const bot_mid_x = (this.nodes[2].x + this.nodes[3].x) / 2;
    const bot_mid_y = (this.nodes[2].y + this.nodes[3].y) / 2;
    this.deltaN = top_mid_y - bot_mid_y; // positive = opening
    this.deltaT = top_mid_x - bot_mid_x; // shear
    this.deltaEff = Math.sqrt(this.deltaN**2 + this.deltaT**2);
    return this.deltaEff;
  }

  computeTraction() {
    const delta = this.computeOpening();
    if (delta <= 0) return { tn: 0, tt: 0 }; // compression: no cohesive traction
    
    let stiffness;
    if (delta < this.delta_0) {
      // Linear elastic
      stiffness = this.sigma_c / this.delta_0;
      this.damage = 0;
    } else if (delta < this.delta_c) {
      // Softening
      stiffness = this.sigma_c * (this.delta_c - delta) / 
                  (delta * (this.delta_c - this.delta_0));
      this.damage = (delta - this.delta_0) / (this.delta_c - this.delta_0);
    } else {
      // Fully fractured
      this.alive = false;
      return { tn: 0, tt: 0 };
    }
    
    const traction = stiffness * delta;
    const nx = -this.deltaN / delta, ny = this.deltaT / delta;
    return { tn: traction * nx, tt: traction * ny };
  }

  applyTractionToNodes() {
    const { tn, tt } = this.computeTraction();
    if (!this.alive) return;
    // Apply equal and opposite forces to top and bottom face nodes
    const force_top = { x: -tt/2, y: -tn/2 }; // force on top pair (pushes back down)
    const force_bot = { x:  tt/2, y:  tn/2 }; // force on bottom pair (pushes back up)
    this.nodes[0].fx += force_top.x; this.nodes[0].fy += force_top.y;
    this.nodes[1].fx += force_top.x; this.nodes[1].fy += force_top.y;
    this.nodes[2].fx += force_bot.x; this.nodes[2].fy += force_bot.y;
    this.nodes[3].fx += force_bot.x; this.nodes[3].fy += force_bot.y;
  }
}

// Main simulation: triangular FEM + cohesive elements along all shared edges
// The crack path emerges naturally: cohesive elements fracture wherever opening exceeds delta_c
// No pre-specified crack path needed!
```

The crack path is determined dynamically: each cohesive element independently tracks its damage state. The crack "finds" the path of maximum opening — which for horizontal tension is the horizontal symmetry line, for asymmetric loading is the principal stress direction.

---

## The Wow Moment — Push It

**Crack curving under mixed-mode loading:** Apply tension at an angle (not perpendicular to the crack). Watch the crack curve: it initially follows the initial crack direction, then bends back toward the principal stress direction. This kinking behavior is one of the most beautiful predictions of fracture mechanics — and the simulation reproduces it without any explicit kinking criterion (it emerges from the cohesive zones).

**Crack arrest by hole:** Drill a hole in the material ahead of the crack tip. The stress concentration at the hole actually captures the crack — the crack curves toward the hole, enters it, and arrests. This is a real engineering technique: "stop-holes" drilled at crack tips in airplane fuselages to arrest fatigue cracks. Demonstrate it live: draw a crack, draw a circle (hole), watch the crack curve into the hole and stop.

**Crack branching:** When two parallel cracks are placed at a critical spacing, they interact via their stress fields. The tensile stress between them amplifies, causing the material between them to fail along a complex path — sometimes straight through, sometimes spiraling. This is a stress shielding / amplification phenomenon.

**Thermal stress cracking:** Apply a hot spot (temperature gradient) to one corner. Thermal expansion creates tensile stress. A crack initiates at the hot-cool boundary and propagates along the isotherm. Demonstrates that cracks follow isotherms in ceramics heated non-uniformly (relevant to thermal barrier coatings in jet engines).

---

## The Interactive Demo

- **Load type selector** (Uniaxial tension / Biaxial tension / Point load / Thermal gradient / Shear): each creates a different stress field; crack path changes dramatically
- **Load magnitude slider** (0 to 200% of K_IC): below K_IC threshold, no crack growth; at threshold, steady propagation; above 1.5 K_IC, rapid propagation
- **Initial crack** (angle 0°–90°, length 5–50% of plate width): orientation of the starter crack relative to loading axis; demonstrates kinking for inclined cracks
- **Fracture toughness K_IC** (relative scale 0.5 to 2.0): easier vs. harder to crack material; correlates to glass vs. rubber vs. steel analogues
- **Cohesive law shape** (Linear / Bilinear / Exponential / Trapezoidal): different traction-separation curve shapes; affects ductile vs. brittle fracture behavior
- **Crack arrest hole**: click to place a circular hole (radius 5–30 px) anywhere ahead of the crack; simulation shows crack interacting with hole
- **Damage overlay**: toggle color map showing local damage value (0=green, 0.5=yellow, 1=red) across all cohesive elements; shows the process zone ahead of the crack tip
- **Energy release rate G display**: live computation of G at the current crack tip; shows G/G_c ratio; bar turns red when ratio ≥ 1 (crack growing)
- **Stress field heat map**: overlay of σ_yy (tension perpendicular to expected crack) showing the 1/√r singularity at crack tip (approximated)
- **Crack path tracer**: records the crack tip position at each step and draws the crack path as a colored line after simulation; export path as CSV
- **Reset with new crack**: click-drag on the canvas to draw the initial crack anywhere, at any angle; instantly starts a new simulation
- **Material library** (Glass / Concrete / Steel / PMMA / Rock / Ice): presets for K_IC, E, γ, fracture mode preference; show vastly different behaviors

---

## Production Notes

**Code structure:**
- `index.html`: canvas (left 2/3) + control panel (right 1/3)
- `mesh.js`: triangular mesh generator for rectangular plate (Delaunay triangulation via `d3-delaunay`); boundary condition assignment; cohesive element insertion along all shared edges
- `fem.js`: simple 2D linear elastic FEM solver for triangular elements (constant strain triangle — CST); stiffness matrix assembly; boundary condition application; sparse direct solver (Gaussian elimination for small meshes, or iterative CG for larger)
- `cohesive.js`: CohesiveElement class; traction-separation laws (bilinear, exponential); damage tracking; fracture detection
- `solver.js`: quasi-static loading loop: increment load, solve FEM, apply cohesive tractions, check for new fractures, update crack topology (remove fractured cohesive elements from mesh connectivity)
- `renderer.js`: canvas rendering; stress heat map (interpolate stress from element centers to pixels); damage color map; crack path trace; force arrow indicators

**Key cinematic moments:**
1. *The naive failure* (1:30): show the staircase crack path vs. expected straight line. "The crack doesn't know it's supposed to go straight."
2. *Griffith 1921 diagram* (3:00): draw the original Griffith energy diagram — strain energy curve going down, surface energy curve going up, their sum showing a minimum (stable) and a maximum (unstable). "This is the original argument. From 1921. Still used today."
3. *CZM traction-separation diagram* (5:00): animate the traction-separation law loading, peaking, and softening. "This is the cohesive element's biography."
4. *First correct crack* (8:00): straight crack propagating horizontally under vertical tension. No staircase, no spurious fractures. "Finally."
5. *Crack curving demo* (10:00): inclined crack under vertical tension. Watch it kink. "The crack doesn't know where it's going — it just follows energy."
6. *Stop-hole demo* (12:00): draw a stop-hole. Watch the crack curve toward it. "This is an actual engineering technique. In actual aircraft. Today."

**Performance note:** For a 40×30 mesh (1200 nodes, ~2300 triangles, ~2300 cohesive elements), the FEM solve takes ~50ms per load step (JavaScript, direct solver). Use WebAssembly (Emscripten-compiled) for the linear system solve if performance is needed. For the video, pre-render the complex scenarios and play back the recorded crack path.

---

## Tags
`griffith-criterion` `fracture-mechanics` `cohesive-zone` `crack-path` `energy-release` `FEM` `canvas` `structural-mechanics`

---

## Thumbnail

A rectangular plate (light gray) with a crack propagating from left to right, the crack path shown as a thick black jagged line that curves gracefully toward horizontal. The crack tip glows red with a surrounding heat-map stress field (orange-yellow gradient). To the left: a small inset showing the energy diagram — the classic Griffith U-shape with arrows showing the unstable and stable regions. Large bold white text: "WHERE DOES THE CRACK GO?" Subtitle: "Griffith fracture criterion." The overall aesthetic is technical and clean — a physics textbook illustration come to life.
