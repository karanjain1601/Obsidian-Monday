---
title: "One Framework for Everything: Unified Particle Physics"
id: M045
difficulty: 7/10
prereq: "M043"
concept: "Position Constraints framework (Müller et al.): cloth, fluid, rigid bodies, and soft bodies all as particles with different constraint types (distance, volume, density, shape-matching); unified solver iterates all constraints together."
tags: [PBD, unified-physics, constraints, cloth, fluid, rigid-body, soft-body, WebGL]
category: medium
type: video-idea
---

# One Framework for Everything: Unified Particle Physics

**Alt title:** "How Game Engines Simulate Cloth, Water, and Rigid Bodies With the Same 20 Lines"
**Difficulty:** 7/10 | **Prereq:** M043

---

## Opening Hook (0:00–1:00)

Show a complex scene: a cloth cape billowing in wind, a water balloon hitting a stone floor and splashing, a stack of rigid wooden boxes toppling, and a rubber ball bouncing. Four completely different physical materials behaving correctly. Then zoom in to the code: there are no separate cloth solvers, fluid solvers, rigid body solvers. There is one loop, one solver, and a list of constraints. Each material is just a different constraint type applied to the same particle representation.

Voice: *"One of the most elegant ideas in computer physics is this: everything is particles, and physics is just constraints on those particles. Cloth? Distance constraints between particles. Fluid? Density constraints. Rigid body? Shape-matching constraints. And because they're all the same kind of object, they can interact with each other for free — the cloth can grab the water balloon, the water can splash against the rigid boxes, and it all just works with the same solver. This is Position-Based Dynamics, and it's what powers the physics in most modern games."*

---

## The Naive Attempt

Build cloth, fluid, and rigid bodies as separate systems with separate solvers, then try to make them interact. The cloth uses a spring-mass model, the fluid uses PBF, the rigid bodies use impulse-based collision response. When a cloth particle hits water: which system resolves it? The cloth system doesn't know about fluid density. The fluid system doesn't know the cloth particle has a constraint keeping it attached to its mesh.

```javascript
// WRONG approach: separate solvers
class ClothSolver {
  update(dt) {
    for (const spring of this.springs) {
      // Apply spring forces...
      spring.p1.force.add(springForce(spring));
      spring.p2.force.add(springForce(spring).negate());
    }
    for (const p of this.particles) {
      p.velocity.add(p.force.scale(dt));
      p.position.add(p.velocity.scale(dt));
    }
  }
}

class FluidSolver {
  update(dt) { /* PBF, separate particle list */ }
}

class RigidBodySolver {
  update(dt) { /* impulse-based, separate objects */ }
}

// Try to couple them — immediately broken:
function coupleClothAndFluid(cloth, fluid) {
  for (const cp of cloth.particles) {
    for (const fp of fluid.particles) {
      if (dist(cp, fp) < THRESHOLD) {
        // What force do we apply? How do we conserve momentum?
        // The cloth particle moves under constraints, the fluid under density...
        // There's no unified framework. This is a mess.
        cp.force.add( /* ??? */ );
        fp.force.add( /* ??? */ );
      }
    }
  }
}
```

The coupling is fundamentally broken: the cloth's spring forces are computed before the fluid interaction, so the interaction forces are applied after the cloth is already at its spring equilibrium — the coupling is one step delayed, causing instability at the interface.

---

## The Moment of Failure

Run the simulation with cloth touching water. The cloth drapes onto the water surface. Initially looks fine. As the cloth sinks into the water: the cloth constraint system pushes cloth particles toward their rest positions; the fluid density constraint pushes fluid particles away from the cloth. They fight each other. The cloth trembles with a high-frequency oscillation (cloth spring vs fluid pressure in a feedback loop). Increase coupling strength: the cloth explodes. Decrease coupling strength: cloth sinks straight through the water as if it doesn't exist. There is no stable coupling coefficient.

Text: "The problem is that these are two separate systems trying to talk to each other through forces that were designed to work alone."

---

## Why It Broke — The Physics

The fundamental issue is constraint coupling. When two constraints compete for the same particle (cloth distance constraint AND fluid density constraint both want to move particle i), applying them sequentially means each constraint ignores the others' corrections. This is the **Gauss-Seidel vs. Jacobi iteration** problem applied to constraints.

In Position-Based Dynamics (Müller, Heidelberger, Hennix, Ratcliff 2007), ALL constraints — regardless of their type — operate on the same unified set of particles and are solved together in a single Gauss-Seidel iteration:

For constraint C_k(x) = 0, the position correction is:
> **Δx_i = -w_i · ∇_{x_i} C_k · C_k(x) / Σ_j w_j |∇_{x_j} C_k|²**

where w_i = 1/m_i is the inverse mass (heavier particles move less). This is applied for every constraint k in sequence, with corrections immediately applied (Gauss-Seidel order). After several sweeps, all constraints are approximately simultaneously satisfied.

The power: if particle i participates in BOTH a cloth distance constraint and a fluid density constraint, BOTH corrections are applied to it in the same solver sweep. They automatically negotiate the correct compromise position — no special coupling code needed.

This is why the framework is "unified": the constraint solver is completely ignorant of constraint types. It only needs to evaluate C_k(x) and ∇C_k(x) for any constraint. Everything else is automatic.

---

## The One Concept

**Position-Based Dynamics: A Universal Constraint Framework**

PBD represents every physical object as particles with mass and position, and every physical law as a constraint on particle positions. The constraint C_k: R^(3N) → R maps the full set of particle positions to a scalar (zero when the constraint is satisfied, nonzero otherwise). The constraint solver corrects particle positions to drive all C_k toward zero.

**Constraint types by material:**

**Cloth / Rope (Distance constraint):**
> C(x_i, x_j) = |x_i - x_j| - L₀

Particles i and j must be at rest length L₀ apart. The gradient:
> ∇_{x_i} C = (x_i - x_j) / |x_i - x_j|

Correction: push i and j apart (or together) by δ where δ = (C · n) / (w_i + w_j), n = (x_i - x_j)/|x_i - x_j|. This is exactly the Hooke's law spring at 100% stiffness.

**Bending (Isometric bending constraint):**
> C(x_i, x_j, x_k, x_l) = cos(dihedral angle) - cos(rest angle)

Involves 4 particles sharing two triangles. Resists bending deformation for thin shells (cloth, paper).

**Volume (Rigid body / Soft body):**
Shape-matching constraint: for a cluster of particles {x_1,...,x_n} that should maintain a rigid shape, compute the best-fit rotation R that maps rest positions {x_i⁰} to current positions, then constrain:
> C_i: x_i must equal R·x_i⁰ + centroid

The best-fit rotation R is found by computing the polar decomposition of the deformation gradient matrix A = Σ(x_i - c)(x_i⁰ - c⁰)ᵀ. Soft bodies use a blend: x_i → lerp(x_i, R·x_i⁰ + c, α) where α ∈ [0,1] is stiffness.

**Fluid (Density constraint) — from PBF:**
> C_i = ρ_i/ρ₀ - 1

As covered in M043.

**Unified solver loop:**
```
for iter in range(n_iterations):
  for each constraint C_k:
    evaluate C_k and ∇C_k at current positions
    compute corrections Δx_i for all particles in constraint
    apply corrections: x_i += Δx_i
```

The order of constraint evaluation matters (Gauss-Seidel: corrections applied immediately) vs. simultaneous Jacobi (corrections accumulated, applied at end of sweep). Gauss-Seidel converges in fewer iterations.

**Stiffness control:** In PBD, stiffness is not a force magnitude but an **iteration count**: run the solver loop more times → higher effective stiffness. This is counterintuitive but elegant: a rubber band has stiffness achieved with 1 iteration/step; steel wire uses 10+ iterations/step. Stiffness never causes instability, only incompleteness.

**Extended PBD (XPBD, 2016):** The iteration-count stiffness control had a problem: a constraint's effective stiffness depended on timestep and iteration count in a non-obvious way. XPBD adds compliance α_k (inverse stiffness, units m²/kg) to the constraint:
> **λ_k += (-C_k - (α_k/dt²)λ_k) / (Σ w_j |∇C_k|² + α_k/dt²)**
> **Δx_i = w_i ∇_{x_i} C_k · λ_k**

Now α_k = 0 means hard constraint (old PBD), α_k > 0 means compliant/soft. Physical units, timestep-independent behavior.

Real-world uses: NVIDIA's PhysX 5.0 engine uses XPBD for all material types. Epic's Chaos physics (Unreal Engine) is constraint-based. Unity's DOTS Physics uses it. The unified architecture makes adding new material types trivial — just define a new constraint type, drop particles in, and the solver handles everything.

---

## The Fix

The unified solver — handles cloth, fluid, and rigid bodies in one loop:

```javascript
class Particle {
  constructor(x, y, invMass = 1.0) {
    this.x = x; this.y = y;
    this.px = x; this.py = y;     // predicted position
    this.vx = 0; this.vy = 0;
    this.invMass = invMass;        // 0 = static/infinite mass
  }
}

// Constraint interface: { particles: [], compliance: float, eval: (positions)→{C, gradC} }

class DistanceConstraint {
  constructor(p0, p1, restLength, compliance = 0) {
    this.particles = [p0, p1];
    this.compliance = compliance;
    this.restLength = restLength || dist(p0, p1);
  }
  eval() {
    const {p0, p1} = {p0: this.particles[0], p1: this.particles[1]};
    const dx = p0.px - p1.px, dy = p0.py - p1.py;
    const len = Math.sqrt(dx*dx + dy*dy) || 1e-8;
    const C = len - this.restLength;
    const nx = dx/len, ny = dy/len;
    return { C, gradients: [[nx, ny], [-nx, -ny]] };
  }
}

class DensityConstraint {
  constructor(particles, rho0) { this.particles = particles; this.rho0 = rho0; }
  eval(particleIdx) {
    const pi = this.particles[particleIdx];
    // Same as PBF density constraint (see M043)
    const rho = computeDensity(pi, this.particles);
    const C = rho / this.rho0 - 1;
    const grad_i = computeGradDensity(pi, this.particles);
    return { C, grad_i };
  }
}

// Unified XPBD solver
function xpbdSolve(particles, constraints, dt, iterations = 5) {
  // Predict
  for (const p of particles) {
    if (p.invMass === 0) continue;
    p.vx += 0;         // external forces (gravity added separately)
    p.vy += -9.81 * dt;
    p.px = p.x + p.vx * dt;
    p.py = p.y + p.vy * dt;
  }

  // Solve constraints (Gauss-Seidel XPBD)
  const lambdas = new Map(constraints.map(c => [c, 0]));
  for (let iter = 0; iter < iterations; iter++) {
    for (const constraint of constraints) {
      const { C, gradients } = constraint.eval();
      const alpha_tilde = constraint.compliance / (dt * dt);
      const denom = gradients.reduce((sum, grad, k) => {
        const p = constraint.particles[k];
        return sum + p.invMass * (grad[0]**2 + grad[1]**2);
      }, 0) + alpha_tilde;

      const dlambda = (-C - alpha_tilde * lambdas.get(constraint)) / denom;
      lambdas.set(constraint, lambdas.get(constraint) + dlambda);

      gradients.forEach(([gx, gy], k) => {
        const p = constraint.particles[k];
        p.px += p.invMass * dlambda * gx;
        p.py += p.invMass * dlambda * gy;
      });
    }
  }

  // Update velocities
  for (const p of particles) {
    if (p.invMass === 0) continue;
    p.vx = (p.px - p.x) / dt;
    p.vy = (p.py - p.y) / dt;
    p.x = p.px; p.y = p.py;
  }
}
```

Now cloth particles and fluid particles can be neighbors with no special coupling: the solver loop naturally handles both DistanceConstraints and DensityConstraints on overlapping particle sets. A cloth particle that's also a fluid particle simply has both constraint types — the solver negotiates the correct compromise.

---

## The Wow Moment — Push It

**Full scene:** cloth cape, water balloon, stack of crates, rubber rope — all running simultaneously in one solver, all interacting correctly. The cloth falls into the water: the density constraints of the fluid push the cloth particles, which are restrained by the distance constraints of the cloth mesh — the cloth drapes and floats naturally. A rigid box falls on the cloth: the shape-matching constraint of the box transfers force to the cloth distance constraints — the cloth dents and springs back.

**"Material dial" demo:** Pick any particle. Set its constraints: 0 constraints → gas; distance constraints → cloth; density constraints → fluid; shape-matching constraints → soft body; infinite mass → static solid. Change the mix in real time and watch the particle's behavior change continuously from fluid to cloth to rigid.

**Wrecking ball:** A rigid ball (shape-matching constraint) on a rigid rope (distance constraints) swings and hits a tower of soft boxes (soft shape-matching) standing in a pool of water (density constraints). The whole scene interacts. No special coupling code. 150 lines of simulation total.

---

## The Interactive Demo

**Scene builder:** drag to add particles; click to assign constraint type (cloth, fluid, soft, rigid).
**Compliance slider per material type:** 0 (rigid) to 1e-3 (very soft).
**Solver iterations slider:** 1–20 iterations per step.
**Timestep slider:** 1/240 to 1/10 second (XPBD is stable at all values).
**Gravity:** normal, low-gravity (moon), zero-g.
**"Drop water balloon":** spawns a balloon (distance-constrained sphere with fluid inside).
**"Add rigid block":** spawns a shape-matched rigid body that falls.
**"Draw cloth":** click-drag to create a chain of distance-constrained particles (a rope or mesh).
**Color by constraint type:** blue = fluid, red = distance/cloth, green = rigid, yellow = soft.
**Show constraint forces:** overlay arrows indicating the correction direction at each solve step.

---

## Production Notes

**Code structure to show:** Three files: `Particle.js` (30 lines), `Constraints.js` (4 constraint classes, ~100 lines total), `Solver.js` (the XPBD loop, 30 lines). Emphasize that the solver doesn't know about any specific constraint type — it's fully polymorphic.

**Key visual at 3:30:** Show a split — left side: the "traditional" approach with separate solvers and coupling code (600+ lines, multiple class hierarchies). Right side: the PBD approach (150 lines, one solver, four constraint types). The simplicity argument is visual.

**Key cinematic moment at 7:00:** The cloth-water interaction running. Zoom in to show individual constraint corrections — cloth particle being pulled by distance constraint (blue arrow right) and pushed by fluid density constraint (red arrow left). They average to a correct physical outcome. This is the "moment of understanding" for the viewer.

**Key moment at 9:30:** The full scene — all four materials at once. Let it run for 20 seconds. No special-casing. No coupling hacks. Just particles and constraints. Pull back the camera. Let the viewer absorb the elegant unity of it.

---

## Tags

`PBD` `unified-physics` `constraints` `cloth` `fluid` `rigid-body` `soft-body` `WebGL`

---

## Thumbnail

**Full-scene screenshot:** cloth cape (teal-blue), water splashing (bright cyan), wooden boxes (warm brown) mid-topple, rubber rope (bright green). All interacting in one chaotic beautiful frame. Bright white title overlay: "ONE SOLVER" at top, "CLOTH + WATER + PHYSICS" in smaller text below. Bottom-left badge: "150 LINES". The chaos is the point — so much happening, so little code. High contrast against dark background. The key visual: particles visible at the seams between materials, showing they're all the same representation.
