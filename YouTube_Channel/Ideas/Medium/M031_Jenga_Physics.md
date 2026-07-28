---
title: "Tower of Blocks Collapses: Rigid Body Stacking Physics (Jenga)"
id: M031
difficulty: 5.5/10
prereq: "None"
concept: "Stacked rigid bodies with contact constraints; center of mass projection determines stability; sequential constraint solving (LCP or impulse-based) for simultaneous contacts in a stack; toppling cascade dynamics."
tags: [rigid-body, contact-solver, LCP, jenga, stability, impulse, three-js, physics-engine]
category: medium
type: video-idea
---

# Tower of Blocks Collapses: Rigid Body Stacking Physics (Jenga)

**Alt title:** "Why Your Jenga Tower Falls — and How to Code It"
**Difficulty:** 5.5/10 | **Prereq:** None (basic Newton's laws sufficient)

---

## Opening Hook (0:00–1:00)

A Jenga tower, 18 levels high, rendered in warm wood-grain 3D. A block is slowly pulled from the middle. The tower wobbles. Another block. Another. The tower is grotesquely misshapen — blocks hanging halfway off — yet somehow still standing. One more block is nudged... and the whole thing tilts, tilts, then collapses in a spectacular cascade: blocks flying, bouncing, spinning, settling. Real-time, in the browser.

Voiceover: *"This is a rigid body physics simulation. Every block has mass, a moment of inertia, a position, and a velocity. Every contact between blocks is a constraint — a mathematical rule that must be satisfied simultaneously with all the others. Getting this right without a physics engine like Bullet or PhysX is genuinely hard. Today we try to code it from scratch — and watch what happens when we cut corners."*

---

## The Naive Attempt

**What we code first:** Each block is a box with mass, position, velocity, angular velocity. Gravity pulls down. We detect collisions by checking bounding box overlap and resolve them with a naive spring force: push overlapping blocks apart proportional to overlap depth.

```javascript
// Naive: penalty spring collision response
class Block {
  constructor(x, y, z, w, h, d) {
    this.pos = { x, y, z };
    this.vel = { x: 0, y: 0, z: 0 };
    this.angVel = { x: 0, y: 0, z: 0 };
    this.quat = new Quaternion(); // identity
    this.mass = 1.0;
    // Inertia tensor for box (diagonal in body frame)
    this.I = {
      xx: this.mass*(h*h + d*d)/12,
      yy: this.mass*(w*w + d*d)/12,
      zz: this.mass*(w*w + h*h)/12
    };
    this.size = { w, h, d };
  }
}

function applyGravity(block, dt) {
  block.vel.y -= 9.81 * dt;
}

// Naive collision: AABB overlap → penalty spring force
function resolveAABB(b1, b2, dt) {
  const dx = Math.abs(b1.pos.x - b2.pos.x) - (b1.size.w + b2.size.w)/2;
  const dy = Math.abs(b1.pos.y - b2.pos.y) - (b1.size.h + b2.size.h)/2;
  const dz = Math.abs(b1.pos.z - b2.pos.z) - (b1.size.d + b2.size.d)/2;

  if (dx < 0 && dy < 0 && dz < 0) {
    // Penetrating! Push apart proportional to overlap depth
    const stiffness = 500.0;
    // Find shallowest penetration axis
    const penetrations = [{val: dx, axis: 'x'}, {val: dy, axis: 'y'}, {val: dz, axis: 'z'}];
    const minPen = penetrations.reduce((a, b) => a.val > b.val ? a : b);
    const sign = b1.pos[minPen.axis] > b2.pos[minPen.axis] ? 1 : -1;
    const force = -minPen.val * stiffness * sign;
    b1.vel[minPen.axis] += (force / b1.mass) * dt;
    b2.vel[minPen.axis] -= (force / b2.mass) * dt;
  }
}
```

The tower is assembled by placing blocks in the Jenga pattern (alternating layers of 3 blocks, rotated 90° each level). When simulated, the tower immediately starts jiggling due to numerical noise from the spring forces. Within 2 seconds, even a perfectly assembled, untouched tower collapses spontaneously — blocks vibrating apart, the spring forces amplifying tiny errors into catastrophic instability.

---

## The Moment of Failure

The tower is initialized. Simulation starts. Blocks vibrate noticeably. Within ~1 second (at dt=0.016), the bottom two layers have spread apart, blocks are tilting, and 3 seconds in the whole tower falls over with no external perturbation. The console logs show block velocities growing without bound — the spring stiffness is feeding energy into the system.

A **energy monitor** in the corner plots total kinetic + potential energy over time. It should be flat (energy conserved minus small damping losses). The naive spring method shows energy growing — the system is generating energy from numerical artifacts. This is the signature of an explicit spring solver with too large a stiffness-to-timestep ratio.

Damping helps: reduce oscillation but the tower still falls for a different reason — the damping removes angular velocity too aggressively, and blocks slide sideways instead of being properly constrained at contact points.

The diagnostic: add a **center-of-mass projection line** for each block — a vertical line from the block's center of mass to the ground. For a stable block, this line must hit the support polygon (the contact area below). Show these lines. On the naive simulation, blocks that are geometrically supported show their CM projections well within the support polygon but they fall anyway — the contact resolution is violating the no-penetration constraint.

---

## Why It Broke — The Physics

Penalty springs have a fundamental problem with stiff contacts: to prevent deep penetration, the spring constant K must be large. But explicit integration requires dt < √(m/K) for stability. A spring stiff enough to prevent 1mm penetration at 30fps requires K > 10,000 N/m, giving a stability requirement dt < 0.01s — barely achievable. Any numerical noise creates growing oscillations.

The correct approach: **rigid body contact constraints solved as a Linear Complementarity Problem (LCP)**. 

For each contact between bodies i and j at contact point p with normal n:
- **Non-penetration constraint**: separation sₙ ≥ 0
- **Non-tensile force**: λₙ ≥ 0 (contacts can only push, not pull)
- **Complementarity**: sₙ · λₙ = 0 (if in contact, force can be nonzero; if separated, force must be zero)

For friction, the Coulomb condition: |λₜ| ≤ μ · λₙ (tangential impulse limited by friction coefficient times normal impulse).

For a tower with N contacts (typically 6N for a block with 6 contact faces), this gives a coupled LCP of size 3N×3N (one normal + two tangential per contact). Solving this exactly is NP-hard in general, but for the well-structured geometry of a Jenga tower, **sequential impulse resolution** (Erin Catto's method, used in Box2D/Bullet) converges in 10–20 iterations.

Key equation: the constraint impulse λ for a single contact:

```
λ = -(1 + e) · v_rel · n / (1/m₁ + 1/m₂ + (r₁ × n)·I₁⁻¹·(r₁ × n) + (r₂ × n)·I₂⁻¹·(r₂ × n))
```

where e is the coefficient of restitution (0 = perfectly inelastic), r₁, r₂ are vectors from body centers to contact point, I₁, I₂ are inertia tensors, v_rel is relative velocity at contact point projected onto normal n.

**Stability condition:** Center of mass must project within the support polygon. For a Jenga block cantilevered over the edge, the maximum overhang before toppling is when the CM is directly above the support edge. For a single block of length L on a table, max overhang = L/2. For a stack of n blocks, the maximum cumulative overhang is L/2 · Σ(1/k) for k=1 to n — a harmonic series, growing logarithmically with n.

---

## The One Concept

**Rigid Body Contact Constraints and the Sequential Impulse Method**

A rigid body contact constraint enforces that two bodies cannot interpenetrate. Unlike a spring (which allows penetration and responds with force proportional to depth), a constraint is a hard rule: separation ≥ 0 at all contact points. Enforcing this is a fundamentally different mathematical problem.

The contact impulse approach treats each collision as instantaneous. At the moment of contact (or at the beginning of a timestep when two bodies are detected to be in contact), we compute an impulse — a sudden change in momentum — that satisfies all constraints simultaneously. The impulse λₙ at each contact is normal to the contact surface and must be non-negative (pushing only). Friction produces a tangential impulse limited by Coulomb's law.

In a Jenga tower with 18 layers of 3 blocks each, there can be up to 54 × 4 = 216 contact points (each block face potentially contacting 4 neighbors). All 216 constraints are coupled — the impulse at one contact changes the velocities of both bodies, which may violate constraints at other contacts. The LCP formulation captures this coupling exactly but is O(N³) to solve.

The **sequential impulse method** (SI) solves each constraint one at a time in sequence, iterating until convergence. Each iteration is O(N), and 10–20 iterations typically suffice for stable stacking. The update for each constraint: compute the impulse that would satisfy this constraint alone, clamp it to valid range (non-negative for normal, Coulomb-bounded for tangential), apply it to both bodies, then move to the next constraint. After a full pass, the constraints that were satisfied early may have been violated by later updates — so we iterate.

This is essentially a **Gauss-Seidel method** on the LCP. Convergence is guaranteed for positive-definite constraint matrices (which the Jenga tower's contact matrix generally is, due to the non-degenerate geometry).

**The stability criterion** is the center-of-mass projection test: a stack of blocks is statically stable if and only if the center of mass of every sub-stack projects (vertically) into the convex hull of the support contacts below it. For a Jenga tower, after pulling several blocks, you can visualize this by drawing the CM projection line for the top portion of the tower. If it falls outside the remaining support contacts, the tower topples.

The **toppling cascade** is a contact event propagation: when a block begins to topple, it exerts impulses on neighboring blocks, which may exceed their stability thresholds and begin to topple as well. This cascade is intrinsically sequential — it propagates at the speed of contact wave transmission through the structure, which is much slower than sound in real wood (because the blocks are not rigidly connected) but fast in simulation time. Visually it produces the characteristic "falling domino" cascade that makes Jenga collapses so satisfying to watch.

**Real-world engineering:** The same contact constraint math is used in structural engineering to analyze building foundations under dynamic loading (earthquakes), in robotics to plan stable grasps, and in animation for cloth-body contact in film VFX. The key challenge is always the same: many simultaneous contacts, hard non-penetration constraints, and Coulomb friction.

---

## The Fix

```javascript
// Fix: Sequential Impulse Rigid Body Solver

class Contact {
  constructor(body1, body2, point, normal, depth) {
    this.body1 = body1;
    this.body2 = body2;
    this.point = point;  // world-space contact point
    this.normal = normal; // from body2 toward body1
    this.depth = depth;   // penetration depth (>0 means overlap)
    this.lambda = 0;      // accumulated normal impulse (clamped ≥ 0)
    this.lambdaT1 = 0;    // accumulated tangential impulse 1
    this.lambdaT2 = 0;    // accumulated tangential impulse 2
    this.restitution = 0.2;
    this.friction = 0.5;
  }
}

function computeEffectiveMass(body1, body2, r1, r2, axis) {
  // 1/m_eff = 1/m1 + 1/m2 + (r1×axis)·I1⁻¹·(r1×axis) + (r2×axis)·I2⁻¹·(r2×axis)
  const c1 = cross(r1, axis);
  const c2 = cross(r2, axis);
  return 1.0 / (1/body1.mass + 1/body2.mass
               + dot(c1, mat3MulVec(body1.Iinv, c1))
               + dot(c2, mat3MulVec(body2.Iinv, c2)));
}

function resolveContact(contact, dt) {
  const { body1, body2, point, normal, restitution, friction } = contact;
  const r1 = sub(point, body1.pos);
  const r2 = sub(point, body2.pos);

  // Relative velocity at contact point
  const v1 = add(body1.vel, cross(body1.angVel, r1));
  const v2 = add(body2.vel, cross(body2.angVel, r2));
  const vRel = sub(v1, v2);
  const vRelN = dot(vRel, normal);

  // Only resolve if bodies approaching
  if (vRelN > 0) return;

  // Position correction (Baumgarte stabilization)
  const beta = 0.2, slop = 0.001;
  const bias = -(beta / dt) * Math.max(contact.depth - slop, 0);

  // Normal impulse
  const mEff = computeEffectiveMass(body1, body2, r1, r2, normal);
  let dLambda = mEff * (-(1 + restitution) * vRelN + bias);

  // Clamp accumulated impulse (no pulling)
  const lambda0 = contact.lambda;
  contact.lambda = Math.max(lambda0 + dLambda, 0);
  dLambda = contact.lambda - lambda0;

  // Apply normal impulse
  const J = scale(normal, dLambda);
  body1.vel = add(body1.vel, scale(J, 1/body1.mass));
  body2.vel = sub(body2.vel, scale(J, 1/body2.mass));
  body1.angVel = add(body1.angVel, mat3MulVec(body1.Iinv, cross(r1, J)));
  body2.angVel = sub(body2.angVel, mat3MulVec(body2.Iinv, cross(r2, J)));

  // Tangential (friction) impulses — similar logic with Coulomb clamp
  const tangent1 = normalize(sub(vRel, scale(normal, dot(vRel, normal))));
  const vRelT1 = dot(vRel, tangent1);
  const mEffT1 = computeEffectiveMass(body1, body2, r1, r2, tangent1);
  let dLT1 = -mEffT1 * vRelT1;
  const limit = friction * contact.lambda;
  const lt0 = contact.lambdaT1;
  contact.lambdaT1 = Math.max(-limit, Math.min(limit, lt0 + dLT1));
  dLT1 = contact.lambdaT1 - lt0;
  const JT1 = scale(tangent1, dLT1);
  body1.vel = add(body1.vel, scale(JT1, 1/body1.mass));
  body2.vel = sub(body2.vel, scale(JT1, 1/body2.mass));
  // (repeat for tangent2 perpendicular to both normal and tangent1)
}

// Main loop:
function physicsStep(bodies, dt, iterations = 15) {
  // 1. Apply gravity
  for (const b of bodies) b.vel.y -= 9.81 * dt;

  // 2. Detect contacts (OBB-OBB test using SAT)
  const contacts = detectAllContacts(bodies);

  // 3. Sequential impulse solve
  for (let iter = 0; iter < iterations; iter++) {
    for (const c of contacts) resolveContact(c, dt);
  }

  // 4. Integrate positions
  for (const b of bodies) {
    b.pos = add(b.pos, scale(b.vel, dt));
    b.quat = integrateQuat(b.quat, b.angVel, dt);
  }
}
```

The **Baumgarte stabilization** term (`bias`) adds a velocity-level correction proportional to existing penetration depth, preventing slow drift while avoiding the energy injection of a pure spring.

---

## The Wow Moment — Push It

**Physics-accurate Jenga game:** Fully playable Jenga simulation. Mouse-click and drag to pull blocks. The tower responds realistically: blocks that are tightly constrained resist; loosely constrained blocks slide easily. The "telltale wobble" of the real game is reproduced. Add a level counter and a "game over" detection (when any block falls below the base level).

**Fracture extension:** When a block is hit with enough impulse (force × time > threshold), it shatters into 4–8 fragments using a Voronoi fragmentation (pre-computed on the block geometry). Each fragment becomes an independent rigid body. The tower can both topple and shatter. Visually: a block snapping in half when hit too hard, the pieces raining down.

**Extreme tower:** 100 levels (300 blocks) instead of 18. Watch the tower naturally sway under gravity before any blocks are pulled (the contact solver must handle the resonance modes of the tall stack). Demonstrate the natural resonant frequency of the tower — the sway period grows as √height. Add wind: a horizontal force oscillating at the tower's resonant frequency causes it to catastrophically amplify (structural resonance), collapse without pulling any blocks.

**Slow-motion collapse:** Render the final collapse at 1/60th speed. Every block interaction is visible: the cascade of toppling, blocks caroming off each other, the graceful fall of the center of mass. Add motion blur to the Three.js renderer for cinematic quality.

---

## The Interactive Demo

- **Block count control** (18 / 36 / 54 layers = 54 / 108 / 162 blocks): choose tower height; higher towers = more impressive collapse but more simulation work
- **Friction coefficient** (0.0 to 1.0): at μ=0 blocks are ice-slippery and the tower collapses immediately; at μ=1.0 blocks are very sticky; the interesting range is μ=0.3–0.6 (realistic wood)
- **Restitution coefficient** (0.0 to 0.5): bounciness; at e=0.5 blocks bounce dramatically on impact; at e=0 they thud
- **Pull mode selector** (Slide / Tap / Flick): three distinct input modes mimicking different Jenga strategies
- **Gravity scale** (0.1× to 5×): slow motion (gravity 0.1×) reveals contact dynamics; high gravity (5×) collapses the tower faster and more dramatically
- **Solver iterations** (1 to 50): live control of sequential impulse iterations; at 1 iteration the stack drifts; at 50 iterations it's perfectly stable
- **CM projection overlay**: toggle center-of-mass projection lines for each block; lines turn red when the CM projects outside the support polygon
- **Energy monitor**: live plot of kinetic energy, potential energy, total energy; should be nearly conserved minus friction losses
- **Debug contacts**: toggle spheres at each active contact point; color by contact force magnitude (blue=light, red=heavy)
- **Slow motion toggle**: pause/0.25×/0.5×/1×/2× time scale
- **Reset tower**: instantly reset to initial configuration; or "Random remove N" to auto-pull N random blocks
- **Wind force** (direction arrows, magnitude slider 0–20 N): applies a constant wind force to all blocks; can induce resonant sway if oscillated

---

## Production Notes

**Code structure:**
- `index.html`: Three.js canvas (full screen) + floating control panel (top-right)
- `rigidbody.js`: RigidBody class, quaternion integration, inertia tensor
- `narrowphase.js`: OBB-OBB contact detection using Separating Axis Theorem (SAT); returns contact points, normals, depths
- `broadphase.js`: AABB spatial hashing for contact candidate detection (faster than O(N²) for many blocks)
- `solver.js`: Contact class, sequential impulse resolve, Baumgarte stabilization
- `jenga.js`: tower assembly, game state (current level, blocks removed), win/lose detection
- `three-renderer.js`: Three.js scene setup, block mesh generation (Box geometry + MeshStandardMaterial), shadow maps
- `input.js`: mouse/touch raycasting to identify clicked block; drag interaction

**Key cinematic moments:**
1. *The naive failure* (1:30): pristine tower, no touching, simulation starts — tower collapses in 2 seconds. "That's not good."
2. *Energy graph* (2:00): show total energy rising on the naive simulation. "The simulation is creating energy from nothing."
3. *Contact constraint explanation* (3:00): diagram showing two blocks in contact, the normal vector, the impulse arrow. One equation on screen.
4. *The fix working* (7:00): tower stands perfectly still under gravity. Nudge one block. It adjusts. The system is stable.
5. *First Jenga pull* (8:00): mouse-click on a middle block, drag slowly. Camera tracks the block. Tower wobbles. Block slides free.
6. *CM projection lines* (10:00): enable overlay. Show the tower with some blocks pulled — several CM lines close to the boundary. Pull one more — a line crosses the boundary — tower tips.
7. *The collapse* (11:00): tower collapses in real-time, slow-motion replay. All blocks interacting, bouncing, settling. 30 seconds of beautiful chaos.

**Three.js rendering tips:** Use `MeshStandardMaterial` with `roughness=0.8` and a warm wood color (#8B6914) for the blocks. Add a `DirectionalLight` slightly off-axis for dramatic shadows. Enable `renderer.shadowMap.enabled = true`. The floor plane uses a `ShadowMaterial` to show block shadows without texture. Add a subtle `FogExp2` for atmosphere on tall towers.

---

## Tags
`rigid-body` `contact-solver` `LCP` `jenga` `stability` `impulse` `three-js` `physics-engine`

---

## Thumbnail

A Jenga tower mid-collapse: the bottom third is exploding outward, blocks flying in all directions. The upper two-thirds of the tower is still intact, tilting at a 30-degree angle. All blocks rendered in warm oak wood-grain against a dark gray background. Large neon-white text in the upper left: "WHY IT FALLS." A small inset diagram in the lower-right shows a block with its center-of-mass projection line in red, extending beyond the support edge — the "failure condition" clearly visualized. The overall aesthetic is physics-textbook-meets-video-game.
