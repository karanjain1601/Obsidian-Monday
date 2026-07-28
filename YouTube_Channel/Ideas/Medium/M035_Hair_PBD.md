---
title: "Hair That Moves Naturally (Position-Based Dynamics for Strands)"
id: M035
difficulty: 6/10
prereq: "S2E18 (PBD basics)"
concept: "PBD for hair strands: each hair is a sequence of particles; length constraints (inextensibility), bending constraints (curvature), and collision constraints; twist constraints for curly hair; self-collision hashing."
tags: [PBD, hair-simulation, strand, constraints, inextensibility, bending, self-collision, canvas]
category: medium
type: video-idea
---

# Hair That Moves Naturally (Position-Based Dynamics for Strands)

**Alt title:** "Coding Hair That Doesn't Look Like Spaghetti"
**Difficulty:** 6/10 | **Prereq:** S2E18 (PBD basics)

---

## Opening Hook (0:00–1:00)

A cartoon head rotates slowly. Its hair flows and settles with the motion. Each strand bends naturally, maintains length, and doesn't clip through the head. Flip the head upside down: the hair hangs downward, sways, and comes to rest with a realistic bounce. Spin it fast: the hair fans outward under centrifugal force.

Voiceover: *"This is Position-Based Dynamics applied to hair strands. Each hair is modeled as a chain of point masses connected by constraints. The constraints do all the work: they enforce length, curvature, and collision. When I first coded this, I made a hair simulator that looked like a bowl of wet spaghetti — totally inextensible but completely wrong. Here's the specific bug, and here's how I fixed it."*

Show the spaghetti hair. Then the good hair. The contrast is immediately obvious: the spaghetti version stretches wildly under gravity, strands interpenetrate each other, and the motion is oscillatory and jittery. The good version is smooth, coherent, and physically plausible.

---

## The Naive Attempt

**What we code first:** A simple chain of particles for each hair strand, connected by distance constraints (PBD-style). Apply gravity. Solve constraints. No bending. No twist. No self-collision.

```javascript
// Naive: PBD chain with only distance constraints, no bending
const NUM_STRANDS = 20;
const PARTICLES_PER_STRAND = 10;
const REST_LENGTH = 12; // pixels between particles

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.px = x; this.py = y; // predicted position (PBD)
    this.ox = x; this.oy = y; // original position (for pinned root)
    this.pinned = false;
  }
}

// Build strands
const strands = [];
for (let s = 0; s < NUM_STRANDS; s++) {
  const strand = [];
  const rootX = 300 + (s - NUM_STRANDS/2) * 15;
  const rootY = 100;
  for (let p = 0; p < PARTICLES_PER_STRAND; p++) {
    const particle = new Particle(rootX, rootY + p * REST_LENGTH);
    if (p === 0) particle.pinned = true; // root is fixed to scalp
    strand.push(particle);
  }
  strands.push(strand);
}

function pbdStep(dt, iterations = 3) {
  // 1. Apply gravity (predict positions)
  for (const strand of strands) {
    for (const p of strand) {
      if (p.pinned) continue;
      const vx = (p.x - p.px);
      const vy = (p.y - p.py);
      p.px = p.x; p.py = p.y;
      p.x += vx + 0 * dt;
      p.y += vy + 300 * dt * dt; // gravity
    }
  }

  // 2. Solve distance constraints only (NAIVE: no bending)
  for (let iter = 0; iter < iterations; iter++) {
    for (const strand of strands) {
      for (let i = 0; i < strand.length - 1; i++) {
        const a = strand[i], b = strand[i+1];
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const diff = (len - REST_LENGTH) / len;
        if (!a.pinned) { a.x += 0.5 * diff * dx; a.y += 0.5 * diff * dy; }
        if (!b.pinned) { b.x -= 0.5 * diff * dx; b.y -= 0.5 * diff * dy; }
      }
    }
  }
}
```

The result: hair hangs down correctly under gravity. Length constraints keep segments at REST_LENGTH. But all strands hang perfectly straight (no natural curvature), and they interpenetrate each other freely. When the head moves, the hair whips around and segments snap to extreme angles — individual segments can fold backwards 180°, which real hair cannot do due to bending stiffness. The motion is oscillatory and unrealistic.

---

## The Moment of Failure

Two specific failures are visible simultaneously:

**Failure 1 — No bending resistance:** Each strand can fold into a Z-shape or accordion shape under perturbation. With no bending constraint, adjacent segments can be anti-parallel (folded 180° back). Real hair has bending stiffness that resists this. On screen: perturb a strand by clicking and dragging the tip upward. The strand bends into an S-curve with a sharp kink at the first particle. Release: it springs back to hanging, but the trajectory is wrong — too oscillatory.

**Failure 2 — Strand interpenetration:** Two neighboring strands can freely intersect each other. With no collision constraints, strands slide through each other. On screen with 20 strands: when the head tilts, strands cross and create visually wrong overlaps. This is visually apparent for any number of strands above ~5.

**Failure 3 — Overcounting when strand has 3 iteration steps with only 1 constraint per segment:** The distance constraints are over-counted at high iteration counts without stiffness scaling (XPBD-style), causing over-correction: the first segment is too stiff (correct), but segments far from the root are under-constrained. Add a counter showing how many constraint iterations it takes to propagate a positional correction from the root to the tip: 10 particles × 3 iterations = 30 updates, but only the first iteration fully reaches the tip.

---

## Why It Broke — The Physics

**Bending resistance:** Real hair has both stretching stiffness (Young's modulus of keratin ≈ 2 GPa — stiff) and bending stiffness (controlled by the second moment of area of the hair cross-section). For a cylindrical hair strand of radius r, the bending stiffness is EI = E·πr⁴/4. For human hair (r ≈ 35 μm, E ≈ 2 GPa): EI ≈ 1.7×10⁻¹³ N·m², which is very small but non-negligible for long hair. Without bending stiffness, the strand has no "backbone" and folds at arbitrary angles.

In PBD, bending is enforced by a **curvature constraint**: for three consecutive particles a, b, c, maintain the angle at b close to a rest angle θ₀. The rest angle for straight hair is 0° (straight), for naturally curly hair it's some nonzero value. The constraint:

```
C(a, b, c) = cos(angle_abc) - cos(θ₀) = 0
```

or equivalently, using the cross product for the angle:

```
C = (a-b) × (c-b) / (|a-b| · |c-b|) - sin(θ₀)
```

This is differentiated to get constraint gradients, then positions are projected.

**Self-collision:** With N strands of P particles each, naïve self-collision is O((N·P)²) — 20 strands × 10 particles = 200 particles → 20,000 pair checks per frame. Fast enough at this scale, but at 10,000 strands (AAA game quality) it's 10⁸ pairs — impossible in real time. Solution: **spatial hashing** — divide space into cells of size (REST_LENGTH), hash each particle to its cell, only check particles in the same or adjacent cells.

**XPBD vs. PBD scaling:** In standard PBD, constraint stiffness depends on iteration count (more iterations = stiffer). XPBD (Extended PBD, Macklin et al. 2016) adds a compliance parameter α to decouple stiffness from iteration count: the correction is divided by (1 + α/dt²) per constraint. For inextensible hair (α = 0): full correction. For soft bending (α = 0.01): softer bending that's iteration-count-independent.

---

## The One Concept

**Position-Based Dynamics for Hair Strands: Constraints, Solvers, and Cascade**

Position-Based Dynamics (PBD) is a simulation paradigm where constraints are enforced by directly correcting particle positions, rather than computing forces and integrating accelerations. For hair simulation, this is ideal: the constraint that a hair segment has length L is enforced by moving the two particles closer or farther apart by the minimum amount needed to restore L. This is numerically stable even for large timesteps and stiff constraints.

A hair strand in PBD is a sequence of N+1 particles: p₀ (root, pinned to scalp), p₁, p₂, ..., pₙ (tip). The simulation maintains three constraint types for realistic hair:

**1. Stretch constraints (inextensibility):** For each consecutive pair (pᵢ, pᵢ₊₁), maintain distance |pᵢ - pᵢ₊₁| = L (rest length). Correction:
```
Δp = 0.5 * (|pᵢ - pᵢ₊₁| - L) / |pᵢ - pᵢ₊₁| * (pᵢ₊₁ - pᵢ)
pᵢ   += Δp    (move pᵢ toward pᵢ₊₁)
pᵢ₊₁ -= Δp    (move pᵢ₊₁ toward pᵢ)
```

**2. Bending constraints:** For each triple (pᵢ₋₁, pᵢ, pᵢ₊₁), maintain the dihedral angle between successive segments. Use the "angular spring" formulation:
```
n = (pᵢ₋₁ - pᵢ) × (pᵢ₊₁ - pᵢ)  [normal to the bend plane]
θ = atan2(|n|, dot(pᵢ₋₁-pᵢ, pᵢ₊₁-pᵢ))  [bend angle]
C = θ - θ₀  [deviation from rest angle]
```
Correction moves pᵢ₋₁ and pᵢ₊₁ to reduce the angle deviation. For straight hair, θ₀ = π (straight). For curly hair, θ₀ < π (curved).

**3. Collision constraints:** When two particles pᵢ (strand A) and pⱼ (strand B) are within distance d_min (sum of hair radii), they should not overlap. Correction:
```
separation = pᵢ - pⱼ
if |separation| < d_min:
  correction = 0.5 * (d_min - |separation|) * normalize(separation)
  pᵢ += correction
  pⱼ -= correction
```

**The cascade problem:** In a 10-particle strand with pinned root, position corrections propagate from the most constrained particle (root) toward the free tip. With only one iteration, the tip barely moves. With 3 iterations, corrections reach the tip. With 10 iterations, the strand is nearly inextensible from root to tip. This cascade behavior is characteristic of chain-like PBD: the correction diffusion speed is one segment per iteration. To make N-particle strands inextensible in k iterations: k ≥ N/2.

**Twist constraints for curly hair:** Add a quaternion orientation to each particle (representing the local frame of the hair strand). Twist is the rotation around the strand's tangent direction. Curly hair has a resting twist rate (e.g., 2π/cm for tight curls). The twist constraint penalizes deviation from this rest twist — similar to a torsion spring. This requires storing and updating 4D quaternion state per particle, not just 3D positions.

**Real-world scale:** Modern AAA game hair (The Last of Us, Control, Horizon Zero Dawn) uses 5,000–15,000 strand-based hair physics particles running at 60fps. This requires both GPU-based PBD solvers and sophisticated spatial hashing for self-collision. The solver runs in HLSL/GLSL compute shaders, solving 5–10 iterations of constraints per frame on the GPU. Our JavaScript canvas demo at 20 strands × 10 particles is the same algorithm — just at 1/1000th the scale.

---

## The Fix

```javascript
// Fix: Add bending constraints and spatial hashing for self-collision

// XPBD compliance parameters
const ALPHA_STRETCH = 0.0;       // inextensible (hard constraint)
const ALPHA_BEND = 0.001;        // soft bending (compliant)
const HAIR_RADIUS = 3;           // px, for collision
const D_MIN = HAIR_RADIUS * 2;   // minimum particle separation

// Bending constraint: enforce angle at particle b between segments a-b and b-c
function applyBendConstraint(a, b, c, theta0, alpha, dt) {
  if (b.pinned) return;
  
  const e1 = { x: a.x - b.x, y: a.y - b.y };
  const e2 = { x: c.x - b.x, y: c.y - b.y };
  const len1 = Math.sqrt(e1.x*e1.x + e1.y*e1.y);
  const len2 = Math.sqrt(e2.x*e2.x + e2.y*e2.y);
  if (len1 < 1e-6 || len2 < 1e-6) return;
  
  // Cosine of current angle at b
  const cosTheta = (e1.x*e2.x + e1.y*e2.y) / (len1 * len2);
  const crossZ = e1.x*e2.y - e1.y*e2.x; // 2D cross product (z-component)
  const theta = Math.atan2(Math.abs(crossZ), cosTheta); // angle in [0, π]
  
  const C = theta - theta0; // constraint violation
  if (Math.abs(C) < 1e-6) return;
  
  // Constraint gradients (approximate: move perpendicular to segments)
  const compliance = alpha / (dt * dt);
  const lambda = -C / (1/len1 + 1/len2 + compliance); // XPBD lambda
  
  const correction = lambda * 0.4; // stiffness tuning
  // Move a and c to increase/decrease the angle
  const perp1 = { x: -e1.y/len1, y: e1.x/len1 }; // perp to e1
  const perp2 = { x: -e2.y/len2, y: e2.x/len2 }; // perp to e2
  const sign = crossZ > 0 ? 1 : -1;
  
  if (!a.pinned) { a.x -= sign * correction * perp1.x; a.y -= sign * correction * perp1.y; }
  if (!c.pinned) { c.x += sign * correction * perp2.x; c.y += sign * correction * perp2.y; }
}

// Spatial hashing for self-collision
class SpatialHash {
  constructor(cellSize) { this.cellSize = cellSize; this.table = new Map(); }
  
  hash(x, y) {
    const ix = Math.floor(x / this.cellSize);
    const iy = Math.floor(y / this.cellSize);
    return `${ix},${iy}`;
  }
  
  clear() { this.table.clear(); }
  
  insert(particle) {
    const key = this.hash(particle.x, particle.y);
    if (!this.table.has(key)) this.table.set(key, []);
    this.table.get(key).push(particle);
  }
  
  queryNeighbors(particle) {
    const results = [];
    const ix = Math.floor(particle.x / this.cellSize);
    const iy = Math.floor(particle.y / this.cellSize);
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const key = `${ix+di},${iy+dj}`;
        if (this.table.has(key)) results.push(...this.table.get(key));
      }
    }
    return results;
  }
}

const spatialHash = new SpatialHash(D_MIN);

function pbdStepFixed(dt, iterations = 8) {
  // 1. Predict positions with gravity
  for (const strand of strands) {
    for (const p of strand) {
      if (p.pinned) continue;
      const vx = (p.x - p.px) * 0.98; // damping
      const vy = (p.y - p.py) * 0.98;
      p.px = p.x; p.py = p.y;
      p.x += vx;
      p.y += vy + 200 * dt * dt;
    }
  }
  
  // 2. Solve constraints iteratively
  for (let iter = 0; iter < iterations; iter++) {
    // Stretch constraints (root to tip, then tip to root for better propagation)
    for (const strand of strands) {
      for (let i = 0; i < strand.length - 1; i++) {
        applyStretchConstraint(strand[i], strand[i+1], REST_LENGTH, ALPHA_STRETCH, dt);
      }
      for (let i = strand.length - 2; i >= 0; i--) {
        applyStretchConstraint(strand[i], strand[i+1], REST_LENGTH, ALPHA_STRETCH, dt);
      }
    }
    
    // Bending constraints
    for (const strand of strands) {
      for (let i = 0; i < strand.length - 2; i++) {
        applyBendConstraint(strand[i], strand[i+1], strand[i+2], Math.PI, ALPHA_BEND, dt);
      }
    }
    
    // Self-collision (every 2 iterations for performance)
    if (iter % 2 === 0) {
      spatialHash.clear();
      for (const strand of strands) for (const p of strand) spatialHash.insert(p);
      for (const strand of strands) {
        for (const p of strand) {
          const neighbors = spatialHash.queryNeighbors(p);
          for (const q of neighbors) {
            if (q === p) continue;
            const dx = p.x - q.x, dy = p.y - q.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < D_MIN && dist > 1e-6) {
              const correction = 0.5 * (D_MIN - dist) / dist;
              if (!p.pinned) { p.x += correction * dx; p.y += correction * dy; }
              if (!q.pinned) { q.x -= correction * dx; q.y -= correction * dy; }
            }
          }
        }
      }
    }
  }
}
```

The bending constraint prevents 180° folding. The spatial hash self-collision prevents strand interpenetration. Bidirectional stretch solving (root-to-tip then tip-to-root) propagates corrections to both ends, making the strand inextensible much faster per iteration count.

---

## The Wow Moment — Push It

**Head rotation:** Mount the hair roots on a circular head that can be rotated by dragging. Rotate the head slowly and watch the hair respond: it lags behind the head's rotation (inertia), then catches up. Fast rotation: hair fans outward under centrifugal force. Upside-down: hair hangs upward from what was the bottom of the head.

**Wind simulation:** Add a sinusoidal wind force (horizontal, with turbulence from Perlin noise). The hair responds to wind gusts, strands fluttering and separating. Adjust wind speed and direction in real time. At high wind, the hair lies flat; at low wind, it hangs naturally.

**Curly hair:** Set rest angle θ₀ to something less than π (e.g., 2.5 radians for gentle waves, 1.5 for tight curls). Watch the natural curl pattern emerge from the constraints. Add twist constraints (3D mode) for helical curls. Show the spectrum from pin-straight (θ₀ = π) through wavy (θ₀ = 2.5) to tight curls (θ₀ = 1.5) with a single slider.

**Wet hair:** Reduce the bending constraint stiffness (higher α) and increase the stretch constraint stiffness. Wet hair is heavier (add extra gravitational force per particle) and clumps together (reduce D_min to bring strands closer). The result visually resembles wet hair: hanging in clumps, less volume.

---

## The Interactive Demo

- **Strand count** (5 to 100): more strands → more impressive but slower self-collision; spatial hash scales well
- **Particles per strand** (5 to 20): longer, more articulated strands; requires more PBD iterations to remain inextensible
- **Bending stiffness α** (0.0 to 0.1): low α = stiff, resists bending; high α = compliant, hair folds easily; at α=0 hair is rigid; at α=0.1 hair folds like wet noodles
- **Hair curliness θ₀** (1.2 to π): rest angle of bending constraint; π = straight; 1.2 = tight curls; adjusts all strands simultaneously
- **Gravity magnitude** (-200 to 500 px/s²): negative gravity = hair floats upward (upside-down head, space environment)
- **Wind** (direction and magnitude): horizontal wind force with Perlin noise turbulence; amplitude 0–300 px/s²
- **Head rotation**: drag the head to rotate; or auto-rotate at adjustable RPM; click to stop
- **Self-collision toggle**: on/off comparison showing interpenetration vs. proper strand separation
- **Bending toggle**: on/off comparison showing Z-fold artifacts vs. natural bending
- **Wet hair mode**: toggle adds 3× gravity, reduces D_min, increases α — hair immediately clumps and droops
- **PBD iterations** (1 to 20): live control of solver quality; 1 = fast but stretchy; 20 = slow but inextensible; shows the cascade propagation effect
- **Constraint visualization**: toggle dots at each particle (sized by constraint violation magnitude), lines for springs, colored red where stretch constraint is being violated

---

## Production Notes

**Code structure:**
- `index.html`: canvas (left 2/3) + control panel (right 1/3); SVG head shape drawn over canvas
- `strand.js`: Strand class (array of Particles, root position, curliness, rest angles)
- `pbd-solver.js`: stretch constraint, bending constraint, collision constraint; XPBD lambda computation; bidirectional solve order
- `spatial-hash.js`: SpatialHash class; efficient neighbor queries
- `head.js`: circular head model (radius 100px); scalp seed points (generate strand root positions on a circle arc); head rotation with angular velocity and inertia
- `wind.js`: Perlin noise wind field; time-varying direction and magnitude
- `renderer.js`: canvas rendering; draw strands as bezier curves through particle positions (smoother than straight lines); hair color gradient (darker at roots, lighter at tips)

**Key cinematic moments:**
1. *Spaghetti hair reveal* (1:00): the no-bending simulation with 20 strands. Head tilts. Strands fold. Z-shapes visible. "That's wrong."
2. *Constraint violation visualization* (2:00): enable constraint dots. Show where stretch is being violated (red dots) with no bending — violations everywhere. "The constraints are screaming."
3. *Bending constraint diagram* (3:30): draw a triple of particles with angle θ at the middle. Show the bending constraint correction arrows. "We add a third type of spring: not between two particles, but at the hinge of three."
4. *Spatial hash visualization* (5:00): toggle the grid overlay. Show hash cells. Each cell displays how many particles it contains. Demonstrate that self-collision only checks neighboring cells: O(1) per particle.
5. *The fix — full demo* (8:00): 20 strands, correct bending, self-collision. Head rotates. Hair behaves naturally. "Now it looks like hair."
6. *Curly hair sweep* (11:00): drag the curliness slider from π to 1.2. Watch the hair go from straight to wavy to tight curls. Pause at each interesting setting. "The same algorithm, one parameter change."
7. *Wind finale* (13:00): max wind speed, turbulence. 50 strands blowing in the wind. Music. "This is 500 lines of code. Let me show you the GitHub link."

**Rendering note:** Draw each strand as a smooth bezier curve through the particle positions (using ctx.bezierCurveTo with control points as midpoints between consecutive particles). This produces much smoother, more hair-like strands than straight line segments between particles.

---

## Tags
`PBD` `hair-simulation` `strand` `constraints` `inextensibility` `bending` `self-collision` `canvas`

---

## Thumbnail

A stylized cartoon head in profile (white/light gray) with dark hair. The hair is in motion: strands swept by an unseen wind, curving naturally, with individual strand paths clearly visible. One strand highlighted in red to show a single hair strand's particle chain. In the lower-right corner: a small diagram showing three particles with the bending angle θ labeled. Bold text at the top: "CODING HAIR PHYSICS." Subtitle: "PBD strands, bending constraints, self-collision." The background is dark navy blue.
