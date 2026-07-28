---
title: "Resolving All Contacts at Once (LCP Contact Solver)"
id: A007
difficulty: 9/10
prereq: "A005"
concept: "Multi-body contact as a Linear Complementarity Problem (LCP): 0 ≤ v_n ⊥ f_n ≥ 0 (complementarity: normal velocity and normal force cannot both be nonzero); Lemke's algorithm or iterative PSOR solve the LCP; handles friction via the friction cone."
tags: [LCP, contact-solver, complementarity, friction-cone, rigid-body, Lemke, PSOR, physics-engine]
category: advanced
type: video-idea
---

# Resolving All Contacts at Once (LCP Contact Solver)

**Alt title:** Why Physics Engines Are Really Solving Optimization Problems  
**Difficulty:** 9/10 | **Prereq:** A005 (Featherstone, spatial dynamics)

---

## Opening Hook (0:00–1:00)

Open with a 100-ball Newton's cradle — not 5 balls, 100 — rendered in Three.js. The balls are fired simultaneously from one end. With a naive sequential contact resolution (resolve one contact at a time, round-robin), the wave pattern is completely wrong: energy splashes back incorrectly, balls on the far end fly away before the wave even reaches them, some balls interpenetrate. Voice over: "Each contact resolution changes the velocity of both bodies involved. Which means resolving contact A first and then contact B gives a different answer than resolving B first and then A. Sequential resolution is order-dependent and therefore physically wrong."

"The correct answer: resolve all contacts simultaneously. For 100 balls in a line, that's up to 99 simultaneous contacts. The mathematical structure of this problem is the Linear Complementarity Problem — LCP. Every major physics engine uses some variant of it: Bullet, PhysX, ODE, MuJoCo. Today we build an LCP solver from scratch, and I'm going to show you why it's an optimization problem in disguise."

Cut to the corrected demo: 100-ball Newton's cradle with LCP contact. The wave propagates exactly as in the classic 5-ball version — the ball at the far end flies off alone, all others remain stationary. Physics was right all along; the solver was wrong.

---

## The Naive Attempt

The sequential impulse (SI) method: process contacts one at a time, applying impulse to satisfy each contact constraint, then move to the next. Repeat for several iterations.

```python
import numpy as np

class RigidBody2D:
    def __init__(self, mass, inertia, pos, vel, omega):
        self.inv_mass = 1.0 / mass if mass > 0 else 0.0
        self.inv_I = 1.0 / inertia if inertia > 0 else 0.0
        self.pos = np.array(pos, dtype=float)
        self.vel = np.array(vel, dtype=float)
        self.omega = float(omega)

class Contact:
    def __init__(self, bodyA, bodyB, point, normal, penetration):
        self.A = bodyA
        self.B = bodyB
        self.p = np.array(point, dtype=float)   # contact point in world
        self.n = np.array(normal, dtype=float)  # normal pointing A→B
        self.d = penetration
        self.lambda_n = 0.0   # accumulated normal impulse (for warm starting)

def resolve_contact_sequential(contact, dt, restitution=0.5):
    """Apply a single contact impulse to resolve this contact."""
    A, B = contact.A, contact.B
    ra = contact.p - A.pos   # contact point relative to A COM
    rb = contact.p - B.pos   # contact point relative to B COM
    n = contact.n
    
    # Relative velocity at contact point
    vA = A.vel + np.array([-A.omega * ra[1], A.omega * ra[0]])
    vB = B.vel + np.array([-B.omega * rb[1], B.omega * rb[0]])
    v_rel = vB - vA
    v_n = np.dot(v_rel, n)   # normal component
    
    if v_n > 0:   # bodies separating; no impulse needed
        return
    
    # Effective mass along normal
    rA_cross_n = ra[0]*n[1] - ra[1]*n[0]
    rB_cross_n = rb[0]*n[1] - rb[1]*n[0]
    K = (A.inv_mass + B.inv_mass + 
         rA_cross_n**2 * A.inv_I + rB_cross_n**2 * B.inv_I)
    
    # Impulse magnitude
    j = -(1 + restitution) * v_n / K
    j = max(j, 0)   # only push apart
    
    impulse = j * n
    A.vel -= A.inv_mass * impulse
    B.vel += B.inv_mass * impulse
    A.omega -= A.inv_I * rA_cross_n * j
    B.omega += B.inv_I * rB_cross_n * j

def simulate_sequential(bodies, contacts, dt, iterations=10):
    """Sequential impulse: O(iterations * N_contacts), order-dependent."""
    for _ in range(iterations):
        for c in contacts:
            resolve_contact_sequential(c, dt)
    for b in bodies:
        b.pos += b.vel * dt
```

The problem with sequential resolution: each contact is resolved independently, ignoring the coupling between contacts through shared bodies. A body involved in two contacts gets double-counted. The final impulse distribution depends on the order contacts are processed.

---

## The Moment of Failure

Simulate a stack of 10 boxes falling under gravity, each box in contact with the one below. With sequential resolution (100 iterations): the stack is stable, but watch carefully — the bottom box vibrates with a high-frequency oscillation (each iteration alternately pushes it down and up). With 10 iterations (production game engine setting): the stack slowly sinks into the floor at 2 cm/s — "ghost penetration" driven by the Baumgarte stabilization term. Try the Newton's cradle: fire the left ball. With SI, the wrong number of balls fly off the right end (2 balls fly instead of 1), and the remaining balls are slightly disturbed. Print the complementarity check: the contact with the highest penetration has v_n = -0.03 m/s (ball still approaching) AND f_n = 15 N (normal force active). Both should not be nonzero simultaneously — the complementarity condition 0 ≤ v_n ⊥ f_n ≥ 0 is violated. The solver has produced a physically inconsistent answer.

---

## Why It Broke — The Physics

Contact mechanics is not a local problem — it is a global one. When body A is in contact with bodies B and C simultaneously, the impulse from the A-B contact changes A's velocity, which affects whether A satisfies the A-C contact constraint, which requires a new impulse from A-C, which changes A's velocity again, affecting A-B. The contacts are coupled through the shared bodies.

The correct formulation: let f = (f₁, f₂, ..., f_Nc) ∈ ℝᴺᶜ be the vector of contact normal forces. The post-collision velocity of all contact points along their normals is:

v_n = A f + b

where A = J M⁻¹ J^T (the Delassus matrix or "contact Jacobian mass matrix"), J is the stacked contact Jacobian (mapping joint velocities to contact-point velocities), and b = J (q̇ + M⁻¹ f_ext dt). The physical constraints are:
1. f_n ≥ 0 (contact forces can only push, not pull)
2. v_n ≥ 0 (contact points cannot interpenetrate)
3. f_n · v_n = 0 (no force at separating contacts; no penetration with active contacts)

Conditions 1–3 together form the Linear Complementarity Problem (LCP):

0 ≤ v_n ⊥ f_n ≥ 0,   v_n = A f_n + b

This is written compactly as w = M z + q, w ≥ 0, z ≥ 0, w^T z = 0 where w = v_n, z = f_n, M = A, q = b.

The LCP is equivalent to a Quadratic Program: minimize 1/2 f^T A f + b^T f subject to f ≥ 0. This is a non-negative quadratic program — a proper optimization problem. For A symmetric positive semi-definite (which A always is for rigid body contact), it has a unique solution.

---

## The One Concept

**The Linear Complementarity Problem (LCP): a mathematical framework for rigid body contact that simultaneously resolves all contacts.**

**LCP definition:**

Given M ∈ ℝᴺˣᴺ symmetric PSD and q ∈ ℝᴺ, find w, z ∈ ℝᴺ such that:

w = Mz + q,   w ≥ 0,   z ≥ 0,   w^T z = 0

The condition w^T z = 0 combined with w ≥ 0, z ≥ 0 means: for each index i, either wᵢ = 0 (contact force zero, body separating or sliding) or zᵢ = 0 (contact velocity zero, contact active with nonzero force) or both. This is the complementarity condition.

**Building the Delassus matrix A:**

For Nc contacts with contact normals nᵢ, contact Jacobians Jᵢ (mapping body velocities to contact-point normal velocity), and body inverse mass matrix M⁻¹ (block diagonal):

A_ij = Jᵢ M⁻¹ Jⱼ^T

This is a Nc × Nc symmetric PSD matrix. For a single isolated contact (Nc = 1), A is a scalar: A = n^T (m_A⁻¹ + m_B⁻¹ + (r_A × n)^T I_A⁻¹ (r_A × n) + (r_B × n)^T I_B⁻¹ (r_B × n)) — exactly the effective mass from the sequential impulse formula. The LCP formulation makes the coupling between contacts explicit: A_ij ≠ 0 when contacts i and j share a body.

**Friction via the friction cone:**

With Coulomb friction, the 2D friction force at a contact satisfies |f_t| ≤ μ f_n (friction cone). The exact friction cone LCP is:

w_n = A_nn f_n + A_nt f_t + b_n,  0 ≤ w_n ⊥ f_n ≥ 0
w_t = A_tn f_n + A_tt f_t + b_t
|f_t| ≤ μ f_n,  f_t w_t ≤ 0 (friction opposes motion)

This is a nonlinear complementarity problem (NCP) for the exact cone. Common approximation: linearize the friction cone with a pyramid (4 or 8 faces in 3D). Each friction direction becomes a separate LCP variable. For a single contact in 3D with the 4-face pyramid: the LCP grows from 1 to 5 variables. The Delassus matrix grows accordingly but remains sparse.

**Algorithms:**

*Lemke's algorithm:* A pivoting method (like the simplex method for LP) that traces a piecewise-linear path through the LCP. Guaranteed to find a solution for LCPs with symmetric PSD M. O(Nc³) worst case but O(Nc) in practice for well-conditioned contact configurations. Exact.

*Projected Successive Over-Relaxation (PSOR):* Iterative solver:
for each contact i (in random order):
  z_i = max(0, z_i - ω (A_ii)⁻¹ (Σ_j A_ij z_j + q_i - A_ii z_i))

where ω ∈ (1, 2) is the relaxation factor. This is the Gauss-Seidel update projected onto z_i ≥ 0. O(Nc²) per iteration, converges for symmetric PSD M. Used by ODE and Bullet. It *does not converge to the exact LCP solution in finite iterations* but gives a useful approximate solution per physics step.

*Block PSOR (for friction):* Simultaneously solve for f_n and f_t at each contact, projecting onto the friction cone at each step. Converges to the friction NCP solution.

*Dantzig's algorithm:* Direct LCP solver for symmetric PSD M, O(Nc³). Used by MuJoCo.

**Elastic restitution:**

With restitution coefficient e, the right-hand side b becomes:

b_i = J_i q̇_pre + e · max(0, -J_i q̇_pre)

The second term adds back the pre-collision velocity (scaled by e) for contacts that are closing. This gives Newton's coefficient of restitution without a separate collision detection phase.

---

## The Fix

```python
import numpy as np

def build_lcp_system(bodies, contacts, dt, g=9.81):
    """
    Build the LCP system w = Mz + q for rigid body contact.
    Returns the Delassus matrix A and RHS vector b.
    """
    Nc = len(contacts)
    if Nc == 0:
        return np.zeros((0,0)), np.zeros(0)
    
    # Build Jacobian J: (Nc, total_DOFs) — each row maps body velocities to
    # normal velocity at one contact
    # For simplicity: 2D rigid bodies with DOFs [vx, vy, omega] per body
    Nb = len(bodies)
    Ndof = 3 * Nb
    J = np.zeros((Nc, Ndof))
    M_inv = np.zeros((Ndof, Ndof))
    
    # Mass matrix (block diagonal)
    for i, b in enumerate(bodies):
        M_inv[3*i,   3*i  ] = b.inv_mass
        M_inv[3*i+1, 3*i+1] = b.inv_mass
        M_inv[3*i+2, 3*i+2] = b.inv_I
    
    # Contact Jacobians
    body_idx = {id(b): i for i, b in enumerate(bodies)}
    for c_idx, c in enumerate(contacts):
        iA = body_idx[id(c.A)]
        iB = body_idx[id(c.B)]
        n = c.n
        ra = c.p - c.A.pos
        rb = c.p - c.B.pos
        rA_cross_n = ra[0]*n[1] - ra[1]*n[0]
        rB_cross_n = rb[0]*n[1] - rb[1]*n[0]
        # Body A contribution (negated: A feels -n)
        J[c_idx, 3*iA:3*iA+2] = -n
        J[c_idx, 3*iA+2] = -rA_cross_n
        # Body B contribution
        J[c_idx, 3*iB:3*iB+2] = n
        J[c_idx, 3*iB+2] = rB_cross_n
    
    # Delassus matrix: A = J M^-1 J^T
    A = J @ M_inv @ J.T
    
    # Current velocities + external force impulses
    v_current = np.zeros(Ndof)
    for i, b in enumerate(bodies):
        v_current[3*i  ] = b.vel[0]
        v_current[3*i+1] = b.vel[1]
        v_current[3*i+2] = b.omega
        # Apply gravity impulse
        v_current[3*i+1] -= g * dt * (b.inv_mass > 0)
    
    b_vec = J @ v_current
    
    # Restitution correction
    restitution = 0.3
    for c_idx, c in enumerate(contacts):
        v_n_pre = b_vec[c_idx]
        if v_n_pre < 0:   # contact closing
            b_vec[c_idx] += restitution * (-v_n_pre)
    
    return A, b_vec

def solve_lcp_psor(A, b, omega=1.3, max_iter=200, tol=1e-8):
    """
    Projected SOR solver for LCP: w = Az + b, w>=0, z>=0, w·z=0.
    Returns z (contact impulses).
    """
    n = len(b)
    z = np.zeros(n)
    
    for iteration in range(max_iter):
        z_old = z.copy()
        for i in range(n):
            # Gauss-Seidel step
            row_sum = A[i] @ z - A[i,i] * z[i] + b[i]
            z_new_i = z[i] - omega * row_sum / A[i,i]
            z[i] = max(0.0, z_new_i)  # project onto z >= 0
        
        # Check convergence
        if np.max(np.abs(z - z_old)) < tol:
            break
    
    return z

def apply_lcp_impulses(bodies, contacts, z):
    """Apply computed contact impulses to all bodies simultaneously."""
    body_idx = {id(b): i for i, b in enumerate(bodies)}
    impulses = {i: np.zeros(3) for i in range(len(bodies))}
    
    for c_idx, c in enumerate(contacts):
        iA = body_idx[id(c.A)]
        iB = body_idx[id(c.B)]
        n = c.n
        j = z[c_idx]
        ra = c.p - c.A.pos
        rb = c.p - c.B.pos
        rA_cross_n = ra[0]*n[1] - ra[1]*n[0]
        rB_cross_n = rb[0]*n[1] - rb[1]*n[0]
        
        impulses[iA][0] -= c.A.inv_mass * j * n[0]
        impulses[iA][1] -= c.A.inv_mass * j * n[1]
        impulses[iA][2] -= c.A.inv_I * rA_cross_n * j
        impulses[iB][0] += c.B.inv_mass * j * n[0]
        impulses[iB][1] += c.B.inv_mass * j * n[1]
        impulses[iB][2] += c.B.inv_I * rB_cross_n * j
    
    for i, b in enumerate(bodies):
        b.vel += impulses[i][:2]
        b.omega += impulses[i][2]

def simulate_lcp(bodies, contacts, dt, g=9.81):
    """One timestep with global LCP contact resolution."""
    A, b_vec = build_lcp_system(bodies, contacts, dt, g)
    if len(b_vec) > 0:
        z = solve_lcp_psor(A, b_vec)
        apply_lcp_impulses(bodies, contacts, z)
    for body in bodies:
        body.pos += body.vel * dt
        body.vel[1] -= g * dt * (body.inv_mass > 0)  # gravity
```

The 100-ball Newton's cradle now correctly propagates the wave: exactly one ball flies off the far end. The complementarity check shows wᵢ · zᵢ < 1e-10 for all contacts at every timestep.

---

## The Wow Moment — Push It

Simulate a pile of 500 rigid convex polygons falling under gravity (use GJK from A008 for collision detection). All contacts resolved simultaneously in one LCP solve per timestep using block PSOR with friction. The pile compacts into a stable heap with realistic friction angles — steeper than the Coulomb angle causes avalanches, shallower creates a stable stack. Demonstrate Jenga: a 60-block tower, each block individually meshed. Pull blocks one by one from the middle: the LCP solver automatically distributes the load change through all remaining contacts, maintaining stability until the critical block is removed and the tower collapses with a domino cascade. Each collapse triggers new contacts that are added to the LCP in real time. The simultaneous resolution prevents the inter-penetration artifacts that plague sequential solvers during the collapse.

---

## The Interactive Demo

**Scene:** Newton's cradle (N balls) | Block stack | Jenga tower | Custom (spawn bodies with mouse)  
**N bodies:** 2 – 500  
**Contact solver:** Sequential impulse (broken) | LCP-PSOR | LCP-Lemke | Penalty spring  
**LCP iterations:** 1 – 500 (show convergence stopping criterion)  
**Restitution coefficient e:** 0 – 1.0  
**Friction coefficient μ:** 0 – 2.0  
**Friction model:** Frictionless | Friction cone (linearized) | Full NCP (Newton method)  
**Gravity:** slider 0 – 20 m/s²  
**Visualization:** Contact forces (arrows) | Complementarity error (v_n · f_n per contact, colormapped) | Delassus matrix A (heatmap) | Contact graph  
**LCP residual plot:** live plot of ||w - Az - b||₂ vs PSOR iteration  
**Stability plot:** total energy vs time for all solver types  
**Warm starting:** toggle (reuse previous z as starting point for PSOR)  
**Export:** contact forces as CSV, Delassus matrix as NPZ

---

## Production Notes

**Code to show:** The `build_lcp_system` function, specifically the Delassus matrix construction A = J M⁻¹ J^T. Zoom in on a 3-body chain (A in contact with B, B in contact with C) and show visually that A[0,1] ≠ 0 because the A-B contact and B-C contact share body B — that is the coupling.

**Visual layout:** Left: 2D physics canvas (HTML Canvas or Three.js). Right: Delassus matrix A as a color-coded heatmap, with nonzero entries glowing orange (coupled contacts). Bottom: complementarity error bar chart per contact (should be near-zero for LCP solver, nonzero for sequential).

**Key cinematic moments:**
- 2:15 — Animate the sequential solver on the 5-ball Newton's cradle in slow motion: watch ball 1's impulse propagate to ball 2, which transmits to ball 3, which causes ball 5 to fly before ball 4 is properly resolved — the wrong two balls fly off.  
- 5:00 — Show the LCP as an optimization: draw the feasible region {f_n ≥ 0, v_n ≥ 0} as the first quadrant, and the LCP solution as the point where the constraint curve w = Af + b intersects the quadrant's boundary.  
- 8:30 — PSOR convergence animation: show the z vector (bar chart) converging iteration by iteration, each bar clamped to zero when it goes negative. Count the iterations.  
- 11:00 — The Jenga collapse in slow-motion: pause at each LCP solve during the collapse, show the contact graph with force magnitudes as edge widths. Watch the load redistribute after each block is removed.

---

## Tags
`LCP` `contact-solver` `complementarity` `friction-cone` `rigid-body` `Lemke` `PSOR` `physics-engine`

---

## Thumbnail

A 100-ball Newton's cradle: left half striking, right end with exactly one ball suspended mid-air in a perfect arc. Behind it, a mathematical diagram: the first quadrant of the (v_n, f_n) plane with the complementarity constraint shown as an L-shaped boundary. Bold text overlay: "ALL CONTACTS. ONE SOLVE." Bottom left corner: "LCP" in large red bold letters.
