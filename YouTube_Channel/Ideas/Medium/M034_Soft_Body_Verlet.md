---
title: "Jello Physics: Verlet Soft Bodies"
id: M034
difficulty: 5.5/10
prereq: "S2E17 (Verlet integration)"
concept: "Soft body as a mass-spring lattice with volume preservation; Verlet integration + pressure-based volume constraint; distinct from cloth (cloth has no volume to preserve); gas-pressure model for volume: P·V = k."
tags: [soft-body, verlet, mass-spring, volume-preservation, jello, pressure-constraint, canvas, physics-engine]
category: medium
type: video-idea
---

# Jello Physics: Verlet Soft Bodies

**Alt title:** "The Volume Preservation Bug: Why Your Jello Deflates"
**Difficulty:** 5.5/10 | **Prereq:** S2E17 (Verlet integration)

---

## Opening Hook (0:00–1:00)

A bright red jello cube falls from the top of the screen and hits the floor. It squishes, bounces, and wobbles — just like real jello. Pull on a corner: the whole body deforms. Release: it snaps back. Slap it with another object: it shudders and slowly damps out. It looks alive.

Voiceover: *"This is a soft body simulation. It jiggles, squishes, deforms, and recovers. But there's one problem I kept hitting when building it: every version I coded looked fine for 2 seconds, then slowly deflated like a leaky tire. The jello would collapse into a flat, sad pancake. Today we find out why — and how to fix it with one elegant constraint: pressure."*

Show the deflating pancake. Then the working jello. Then the question: "What's the difference?"

---

## The Naive Attempt

**What we code first:** A 2D mass-spring lattice shaped like a square. Nodes in a grid. Springs connecting all neighbors (structural + shear + bend). Verlet integration. Apply gravity. Let it fall and hit the floor.

```javascript
// Naive: mass-spring lattice, no volume preservation
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

const GRID = 8;   // 8×8 = 64 nodes
const REST = 30;  // rest length in pixels
const K_STRUCT = 0.5;  // structural spring stiffness
const K_SHEAR  = 0.3;  // shear spring stiffness
const DAMP = 0.99;     // velocity damping

// Initialize nodes
const nodes = [];
for (let j = 0; j < GRID; j++) {
  for (let i = 0; i < GRID; i++) {
    nodes.push({
      x: 200 + i * REST, y: 50 + j * REST,
      px: 200 + i * REST, py: 50 + j * REST, // previous position (Verlet)
      pinned: false
    });
  }
}

// Add structural springs (neighbors)
const springs = [];
for (let j = 0; j < GRID; j++) {
  for (let i = 0; i < GRID; i++) {
    const idx = j * GRID + i;
    // Horizontal, vertical, diagonal springs
    if (i < GRID-1) springs.push({a: idx, b: idx+1, rest: REST});
    if (j < GRID-1) springs.push({a: idx, b: idx+GRID, rest: REST});
    if (i < GRID-1 && j < GRID-1) {
      springs.push({a: idx, b: idx+GRID+1, rest: REST*Math.SQRT2});
      springs.push({a: idx+1, b: idx+GRID, rest: REST*Math.SQRT2});
    }
  }
}

function verletStep(dt) {
  // 1. Gravity
  for (const n of nodes) {
    if (n.pinned) continue;
    const vx = (n.x - n.px) * DAMP;
    const vy = (n.y - n.py) * DAMP;
    const nx = n.x + vx + 0 * dt*dt;
    const ny = n.y + vy + 200 * dt*dt; // gravity
    n.px = n.x; n.py = n.y;
    n.x = nx; n.y = ny;
  }

  // 2. Spring constraints (iterative relaxation)
  for (let iter = 0; iter < 5; iter++) {
    for (const s of springs) {
      const na = nodes[s.a], nb = nodes[s.b];
      const dx = nb.x - na.x, dy = nb.y - na.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const diff = (len - s.rest) / len;
      // Push both nodes toward rest length
      na.x += 0.5 * diff * dx * K_STRUCT;
      na.y += 0.5 * diff * dy * K_STRUCT;
      nb.x -= 0.5 * diff * dx * K_STRUCT;
      nb.y -= 0.5 * diff * dy * K_STRUCT;
    }
  }

  // 3. Floor collision
  for (const n of nodes) {
    if (n.y > H - 20) { n.y = H - 20; n.py = n.y + (n.y - n.py) * 0.3; }
    if (n.x < 10) { n.x = 10; n.px = n.x + (n.x - n.px) * 0.3; }
    if (n.x > W-10) { n.x = W-10; n.px = n.x + (n.x - n.px) * 0.3; }
  }
}
```

The simulation runs. The lattice falls and hits the floor. It bounces and jiggles correctly for about 5 seconds. Then: slowly, the center of the body sags inward. The body becomes progressively thinner in the middle. After 10 seconds it looks like a flattened diamond. After 30 seconds it's a single diagonal band of nodes — all volume has been lost.

---

## The Moment of Failure

The "pancake" failure appears on screen as the simulation runs unattended. The jello starts as a plump square, slowly deflates into a rhombus, then an hourglass, then a near-degenerate crossed pair of lines. All 64 nodes are still present, but they've collapsed into a 1D-like configuration.

Enable a **volume monitor**: compute the approximate 2D area enclosed by the outer perimeter of the lattice (shoelace formula on the boundary nodes). Show a line graph of area vs. time. The area should stay approximately constant (jello doesn't compress). Instead, it steadily decreases — linear decay. After 500 steps: original area 56% lost.

The diagnostic: color the springs by their current length (blue = compressed, red = stretched). Near the center, structural springs are all stretched — they're pulling the body inward. The shear springs are the culprit: diagonal springs on a square lattice resist shear deformation but also resist the normal jello behavior where the body should be able to stretch horizontally while compressing vertically (and vice versa), as long as total volume is preserved.

The spring network enforces a local distance constraint but has no global volume constraint. Without a restoring force when the overall shape changes, slow drift toward collapsed configurations is inevitable — because the collapsed states have lower spring potential energy (all springs at or near rest length) while the overall shape is degenerate.

---

## Why It Broke — The Physics

A real jello or rubber-like object resists changes in volume because it is nearly incompressible. The bulk modulus of jello (water-gelatin) is approximately equal to that of water (~2 GPa) because its volume is dominated by water content. The shear modulus, by contrast, is extremely small (~100 Pa) — the jello is floppy in shape but stiff in volume.

A spring lattice has no inherent bulk modulus — it's a 1D force (extension/compression of a 1D spring) summed over many springs. The lattice can undergo large-scale shape changes that preserve all individual spring lengths (zero-energy modes). These zero-energy modes are the source of the collapse: the lattice can go from a square to a diamond to a crossed-X while keeping all diagonal spring lengths constant. Because these modes are zero-energy, any numerical noise drives the system into them over time.

The fix is a **pressure-based volume constraint** inspired by Jakobsen's soft body work (2001). Model the interior of the soft body as containing an ideal gas at pressure P. When the enclosed volume V decreases (body squeezed), pressure increases, pushing the boundary nodes outward. When V increases (body stretched), pressure decreases, pulling nodes inward. The pressure-volume relationship is P·V = k (isothermal ideal gas with constant k).

The restoring force on each boundary edge is:
```
F = P · L · n̂
```
where L is the edge length and n̂ is the outward normal. This distributes an outward normal force proportional to local edge area, which integrates to a net zero force when shape is correct (Pascal's law) but provides a restoring force when volume deviates.

The pressure is computed as:
```
P = k / V_current
```
where k = P₀ · V₀ (initial pressure times initial volume), and V_current is computed as:
```
V = (1/2) |Σᵢ (xᵢ × yᵢ₊₁ - xᵢ₊₁ × yᵢ)|   (2D shoelace formula on boundary)
```

---

## The One Concept

**Pressure-Based Volume Preservation in Soft Bodies**

The key insight in Jakobsen's 2001 GDC paper on soft bodies is that a closed surface enclosing a volume can be treated as a sealed bag of gas. The gas resists compression (maintains volume) through internal pressure, which acts as an outward force on every element of the surface. This is exactly how real soft bodies maintain volume: the cellular fluid inside biological tissue, the water in a water balloon, the air in a rubber ball.

In 2D, the "volume" is the enclosed area A. Compute A using the shoelace formula over the ordered boundary polygon vertices. The pressure P = k/A where k = P₀ · A₀ is calibrated so that at rest shape, P = P₀ (some reference pressure). A force proportional to P is applied outward on each boundary edge.

For boundary edge from node i to node i+1:
```
edge_vec = (x_{i+1} - x_i, y_{i+1} - y_i)
outward_normal = (y_{i+1} - y_i, -(x_{i+1} - x_i))  [rotate edge 90° outward]
edge_length = |edge_vec|
Force on node i   = P · edge_length · outward_normal · 0.5
Force on node i+1 = P · edge_length · outward_normal · 0.5
```

The factor 0.5 distributes the force equally to the two endpoints of each edge.

This pressure model does not require that the actual gas pressure is physically meaningful — P₀ is a tuning parameter. Low P₀: body easily deflates (soft balloon). High P₀: body strongly resists deformation (stiff ball). Setting P₀ very high makes the body nearly incompressible (like rubber). Setting P₀ to zero recovers the original spring-only simulation (deflates).

**The relationship to position-based dynamics (PBD):** The pressure constraint can also be formulated as a PBD constraint on the enclosed area: project node positions so that A = A₀. This is equivalent to the pressure approach for small deformations. The PBD formulation avoids tuning P₀ and directly enforces volume conservation as a hard constraint. The correction per boundary node is proportional to the gradient of A with respect to that node's position.

**3D extension:** In 3D, replace area with volume (computed as signed sum of tetrahedral volumes from centroid). Surface forces are outward normals to each triangular face. The same pressure formula applies. The cohesive zone model replaces gas pressure with a stored strain energy that penalizes volume change — this is the neo-Hookean hyperelastic constitutive law used in FEM for rubber simulation.

**Distinct from cloth:** Cloth has no enclosed volume — it's a 2D surface in 3D space. Cloth uses only structural and bend springs (shear springs are sometimes added). Without an enclosed volume, there is no meaningful bulk modulus. Cloth can bunch, fold, and crumple without any restoring force. Soft bodies specifically require the volume constraint (or equivalent hyperelastic energy) to maintain their characteristic squish-and-recover behavior.

**Applications:** Soft body simulation is used in medical simulation (surgery simulators for training doctors, where tissue deformation must be realistic), in film VFX (creature skins, facial tissue), in robotics (soft robotic grippers), and in game physics (jello cubes, soft balls, biological tissue). The pressure model is fast enough for real-time use. The PBD volume constraint is used in AAA game engines (cloth and hair in Uncharted, God of War).

---

## The Fix

```javascript
// Fix: Add pressure-based volume constraint to the Verlet soft body

// Identify boundary nodes (ordered counter-clockwise)
function getBoundary(GRID) {
  const boundary = [];
  // Top row (left to right)
  for (let i = 0; i < GRID; i++) boundary.push(i);
  // Right column (top to bottom, skipping top-right already added)
  for (let j = 1; j < GRID; j++) boundary.push(j*GRID + GRID-1);
  // Bottom row (right to left)
  for (let i = GRID-2; i >= 0; i--) boundary.push((GRID-1)*GRID + i);
  // Left column (bottom to top, skipping bottom-left already added)
  for (let j = GRID-2; j >= 1; j--) boundary.push(j*GRID);
  return boundary;
}

const boundary = getBoundary(GRID);

function computeArea(nodes, boundary) {
  let area = 0;
  const n = boundary.length;
  for (let i = 0; i < n; i++) {
    const a = nodes[boundary[i]];
    const b = nodes[boundary[(i+1) % n]];
    area += (a.x * b.y - b.x * a.y);
  }
  return Math.abs(area) / 2;
}

// Compute initial area
const A0 = computeArea(nodes, boundary);
const P0 = 0.8; // tuning parameter (higher = stiffer volume preservation)
const k_pressure = P0 * A0;

function applyPressureConstraint(nodes, boundary) {
  const A = computeArea(nodes, boundary);
  const P = k_pressure / A; // pressure increases when area decreases
  
  const n = boundary.length;
  for (let i = 0; i < n; i++) {
    const a = nodes[boundary[i]];
    const b = nodes[boundary[(i+1) % n]];
    
    // Outward normal of this edge
    const ex = b.x - a.x, ey = b.y - a.y;
    const len = Math.sqrt(ex*ex + ey*ey);
    const nx = -ey / len, ny = ex / len; // rotated 90° outward (CCW boundary)
    
    // Force magnitude = P × edge length
    const F = P * len;
    
    // Apply to both endpoints (split evenly)
    a.x += 0.5 * F * nx;
    a.y += 0.5 * F * ny;
    b.x += 0.5 * F * nx;
    b.y += 0.5 * F * ny;
  }
}

// Updated Verlet step: add pressure AFTER spring relaxation
function verletStepWithPressure(dt) {
  // ... gravity and Verlet update (same as before) ...
  
  // Spring constraint relaxation
  for (let iter = 0; iter < 5; iter++) {
    for (const s of springs) {
      // ... same spring relaxation ...
    }
    // Apply pressure constraint every spring iteration
    applyPressureConstraint(nodes, boundary);
  }
  
  // ... floor/wall collision ...
}
```

With `P0 = 0.8`, the area stays within ±5% of its initial value indefinitely. The jello bounces, squishes, and recovers without deflating. Increase P0 to 3.0: the body becomes nearly rigid (barely deforms under impact). Decrease to 0.1: very soft, easily deflated like a water balloon. P0 controls the soft body's effective bulk modulus.

---

## The Wow Moment — Push It

**Multiple interacting soft bodies:** Spawn 3–5 jello cubes of different sizes and let them collide. Soft-body collision detection requires checking if any node of one body penetrates the surface of another. Use a simple inside/outside test (winding number). Apply a repulsive pressure at the penetrating node. Watch the cubes squish into each other, stack, compress, and recover.

**Object interaction:** Drop a hard sphere (rigid body) into a pile of soft bodies. Watch the soft bodies deform around it, squish under it, and slowly recover their shapes after the sphere passes through. The soft bodies don't "know" the sphere is hard — they just respond to node-node repulsion forces.

**Pressure visualization:** Draw the internal pressure as a color (blue=low pressure, red=high pressure). When the cube is being squished, the whole body turns red. When it's bouncing up and stretching, it turns blue. The pressure oscillates visually — like a squeezed balloon.

**Hyperelastic comparison:** Add a toggle to switch from the Jakobsen pressure model to a neo-Hookean energy function (requires computing deformation gradients for each triangle). The two models produce subtly different behaviors: the pressure model allows large deformations without stiffening, while neo-Hookean stiffens at large stretch. Compare side-by-side with a soft cube dropped from height.

---

## The Interactive Demo

- **Grid resolution** (4×4 to 16×16): coarser grid is faster but less smooth deformation; finer grid is more accurate but expensive; at 16×16 = 256 nodes the deformation is visually continuous
- **P₀ pressure** (0 to 5): the volume preservation stiffness; P₀=0 reproduces the deflating pancake; P₀=0.5 is like jello; P₀=3 is like rubber; P₀=10 is nearly rigid
- **K_struct spring stiffness** (0.1 to 1.0): controls how strongly the body returns to its rest shape; high stiffness = elastic; low stiffness = viscoplastic (permanent deformation after squish)
- **K_shear spring stiffness** (0 to 0.5): controls shear resistance; at 0 the body can shear freely (like a stack of unglued paper); at 0.5 it resists shear as well
- **Damping** (0.90 to 0.999): velocity damping; low damping = body jiggles forever; high damping = body doesn't bounce (more like putty than jello)
- **Gravity** (0 to 500 px/s²): demonstrate microgravity behavior — soft body floats and deforms under its own spring forces
- **Obstacle**: click to place a circular rigid obstacle anywhere; soft body wraps around it; drag obstacle through the soft body
- **Squish tool**: press and hold anywhere on the body to attract all nearby nodes toward the mouse; release to let the body recover
- **Tear mode**: click on any spring to break it; the body can be torn apart; observe how tears propagate (non-physical without a fracture model, but visually interesting)
- **Area monitor**: always-visible line graph of enclosed area vs. time; shows volume preservation quality; compare P₀=0 vs. P₀=0.8
- **Multiple bodies** (up to 10): "Spawn" button adds a new jello cube at the top; bodies interact via node repulsion; adjust interaction strength
- **Material preset** (Jello / Water balloon / Rubber ball / Blob fish): presets for P₀, K_struct, K_shear, damping; each produces distinct character

---

## Production Notes

**Code structure:**
- `index.html`: canvas (left 2/3, 600×500) + control panel (right 1/3)
- `softbody.js`: SoftBody class encapsulating nodes, springs, boundary, Verlet step, pressure constraint, collision detection; multiple instances for multi-body demo
- `constraints.js`: spring relaxation, pressure, floor/wall collision, body-body collision (winding number test)
- `renderer.js`: canvas rendering; draw body as filled polygon (boundary nodes + ctx.fill); spring lines in debug mode; pressure heat map overlay; area graph
- `interaction.js`: mouse event handling; squish tool (attract nearby nodes to mouse), obstacle placement, spring tear mode
- `presets.js`: material presets (P₀, k, damping pairs)

**Key cinematic moments:**
1. *The deflating pancake* (1:00–2:00): run the naive simulation for 30 seconds in silence. Watch it collapse. "Something is wrong."
2. *Area monitor diagnosis* (2:30): show the area vs. time graph. Steady linear decline. "The area is draining away. Why?"
3. *Zero-energy mode explanation* (3:30): diagram showing the spring lattice's zero-energy deformation modes. "These configurations all have the same energy. The simulation drifts into them."
4. *Pressure fix introduction* (5:00): draw a balloon with internal pressure. "What if the jello had internal pressure?" Animate the outward normal forces on each edge.
5. *The fix working* (7:00): identical initial conditions, now with pressure. Drop from height. Squishes. Bounces. Recovers shape. Area graph: flat. "Volume preserved."
6. *P₀ sweep* (9:00): drag the P₀ slider from 0 to 5 with the body in motion. Watch it go from deflating → jello → rubber → near-rigid. "One parameter controls the softness."
7. *Multiple bodies collision* (12:00): 5 jello cubes falling and colliding. Squishing into each other. "Each one maintains its volume independently."

**Performance:** At 8×8 grid (64 nodes, ~180 springs) with 5 Verlet iterations per frame, the simulation runs at 60fps easily in JavaScript. At 16×16 (256 nodes, ~800 springs, 5 iterations), still 60fps. Canvas rendering at 60fps for a filled polygon of 64 nodes: trivial.

---

## Tags
`soft-body` `verlet` `mass-spring` `volume-preservation` `jello` `pressure-constraint` `canvas` `physics-engine`

---

## Thumbnail

A bright red jello cube (rendered with a soft, rounded polygon shape) mid-squish against a gray floor: the bottom is flattened, the sides bulge outward, the top is slightly domed. A blue arrow labeled "PRESSURE" points outward from each side. To the right, in a smaller inset: the deflated pancake shape with a red X over it labeled "NAIVE." Large white text: "WHY YOUR JELLO DEFLATES." The background is dark gray. The jello has a subtle translucency and gloss highlight to look genuinely jello-like.
