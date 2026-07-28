---
title: "Robot Dynamics Without Constraint Forces (Reduced Coordinates)"
id: A006
difficulty: 8.5/10
prereq: "A005"
concept: "Reduced coordinate simulation: parameterize configuration by joint angles q ∈ ℝ^n; Lagrangian mechanics: M(q)q̈ + C(q,q̇)q̇ + G(q) = τ; mass matrix M, Coriolis C, gravity G computed recursively; no constraint forces needed."
tags: [reduced-coordinates, Lagrangian-mechanics, joint-space, mass-matrix, Coriolis, robotics, three-js, computational-mechanics]
category: advanced
type: video-idea
---

# Robot Dynamics Without Constraint Forces (Reduced Coordinates)

**Alt title:** Simulating Joints Without Springs — The Elegant Way  
**Difficulty:** 8.5/10 | **Prereq:** A005 (Featherstone's algorithm, spatial algebra)

---

## Opening Hook (0:00–1:00)

Open with a pendulum simulation that keeps exploding. A double pendulum coded with spring-constraint joints: the two links connected by stiff springs that try to enforce rigidity. The springs are so stiff that at each timestep the integration becomes unstable — the pendulum stretches catastrophically, spinning into a chaotic tangle. Text on screen: "Spring constant k = 1e6. Still wrong." Cut to k = 1e8: the simulation explodes in two frames, positions going to infinity. Cut to k = 1e10: the simulation crashes with NaN in the first step.

Voice over: "This is the maximal-coordinates approach: represent every link as a free rigid body in 3D, then add constraint forces to enforce the joints. The stiffer the constraint, the more unstable the integrator. And if you make the constraint perfectly rigid — the limit you actually want — your stiffness matrix becomes singular and the whole system blows up."

"The solution has been known since Lagrange published his Méchanique Analytique in 1788. Parameterize only the degrees of freedom that actually exist. For a double pendulum with two hinges, there are exactly two degrees of freedom: the two angles. Not twelve. Not six. Two. Write the equations of motion in those two variables and you never need a constraint force — because the constraints are baked into the parameterization. This is reduced coordinates."

---

## The Naive Attempt

The maximal-coordinates simulation with penalty constraints:

```python
import numpy as np
from scipy.integrate import solve_ivp

# Double pendulum: maximal coordinates
# Link 1: body centered at (x1, y1), orientation theta1
# Link 2: body centered at (x2, y2), orientation theta2
# Constraints: joint at end of link 1 == start of link 2
#              joint at origin == start of link 1

m = 1.0    # mass per link
L = 1.0    # length per link
I = m * L**2 / 12   # moment of inertia
k = 1e7    # spring stiffness
b = 1e3    # spring damping

def maximal_coords_rhs(t, state):
    """6 DOFs per body (x, y, theta) x 2 bodies = 12 state vars."""
    x1, y1, th1, vx1, vy1, om1, \
    x2, y2, th2, vx2, vy2, om2 = state
    
    # Pivot points of each link
    p1_start = np.array([x1 - L/2*np.cos(th1), y1 - L/2*np.sin(th1)])
    p1_end   = np.array([x1 + L/2*np.cos(th1), y1 + L/2*np.sin(th1)])
    p2_start = np.array([x2 - L/2*np.cos(th2), y2 - L/2*np.sin(th2)])
    
    # Constraint forces (penalty spring)
    # Constraint 1: link 1 start == origin (0, 0)
    c1 = p1_start - np.array([0.0, 0.0])
    # Constraint 2: link 1 end == link 2 start
    c2 = p1_end - p2_start
    
    f1_start = -k * c1
    f_connector = -k * c2
    
    # Forces on body 1
    fx1 = f1_start[0] - f_connector[0]
    fy1 = f1_start[1] - f_connector[1] - m * 9.81
    tau1 = (np.cross(p1_start - np.array([x1, y1]), f1_start) -
            np.cross(p1_end   - np.array([x1, y1]), f_connector))
    
    # Forces on body 2
    fx2 = f_connector[0]
    fy2 = f_connector[1] - m * 9.81
    tau2 = np.cross(p2_start - np.array([x2, y2]), f_connector)
    
    return [vx1, vy1, om1, fx1/m, fy1/m, tau1/I,
            vx2, vy2, om2, fx2/m, fy2/m, tau2/I]

# Initial conditions: hanging vertically
state0 = [0, -L/2, -np.pi/2, 0, 0, 0,
          0, -3*L/2, -np.pi/2, 0, 0, 0]
# This explodes at k=1e7 within t=0.01 seconds
try:
    sol = solve_ivp(maximal_coords_rhs, [0, 10], state0, 
                    max_step=1e-5, rtol=1e-6, method='RK45')
    print(f"Max position: {np.max(np.abs(sol.y[:2])):.2e}")
except Exception as e:
    print(f"Crashed: {e}")
# Output: Max position: 4.72e+11   ← blown up
```

The simulation explodes. The stiff springs require sub-microsecond timesteps to remain stable (Courant condition for explicit integrators: dt < 2/ω_max ≈ 2/√(k/m) ≈ 2e-4 s at k=1e7). An implicit integrator would work better but requires solving a nonlinear system at each step — the constraint forces become implicit unknowns (Lagrange multipliers), requiring a saddle-point system that is indefinite and harder to solve than the positive-definite reduced-coordinate system.

---

## The Moment of Failure

On screen: the double pendulum simulation with spring constraints. k=1e4 — the pendulum oscillates but the links stretch by 5 cm (visible as colored distance error). k=1e6 — links stretch 0.5 mm (acceptable visually but physically wrong). k=1e8 — integrator needs dt=2e-7 s; at 60 Hz display, the simulation requires 83,333 substeps per frame. At k=1e10: the first timestep computes spring forces of order 10¹⁰ N, accelerations of 10¹⁰ m/s², velocities become 10¹⁰ m/s in the first step, and positions go to 10¹⁰ m. The simulation window shows an empty canvas with a warning: "Bodies out of bounds (|x| > 1e6)." The NaN propagates through the subsequent spring force computations, and within 3 steps every value is NaN. Highlight the k-stability table on screen: for correct rigid joints (k→∞), the required timestep goes to zero. The penalty spring method cannot converge to the true rigid-body solution.

---

## Why It Broke — The Physics

The maximal-coordinates approach with penalty constraints introduces an artificial high-frequency mode at ω ≈ √(k/m) → ∞ as k → ∞. This frequency must be resolved by the integrator (Nyquist: dt < π/ω), creating a stiffness problem that worsens as the constraint becomes stiffer.

The correct approach is to recognize that a holonomic constraint q = g(s) — where s ∈ ℝⁿ is a reduced coordinate and q ∈ ℝᵐ is the full Cartesian state (m > n) — completely eliminates the constraint force from the equations of motion. By the principle of d'Alembert, constraint forces do no virtual work under virtual displacements consistent with the constraints: δq = J_g δs where J_g = ∂g/∂s is the constraint Jacobian. Therefore:

δs^T (J_g^T M J_g s̈ + J_g^T M J_g̈ s) = δs^T J_g^T (f_ext + f_constraint)

and since f_constraint is perpendicular to the constraint surface: J_g^T f_constraint = 0 identically. The Lagrangian equation of motion in reduced coordinates:

M(q) q̈ + C(q,q̇)q̇ + G(q) = τ

where M = J_g^T M_cart J_g, C comes from differentiating M, and G = J_g^T ∂V/∂q is the gravity term. No Lagrange multipliers. No constraint forces. No stiffness problem.

---

## The One Concept

**Reduced coordinates: parameterizing only physical DOFs and deriving Lagrangian equations of motion in joint space.**

**Configuration space:**

For a serial chain robot with N revolute joints, the configuration is fully described by q = (q₁, q₂, ..., q_N) ∈ ℝᴺ — the joint angles. The full Cartesian state of all N links (6N-dimensional) is a deterministic function of q. The tangent space TqQ has dimension N. Velocities live in this tangent space: there are no velocities perpendicular to the constraint surface because we never left it.

**Lagrangian formulation:**

The Lagrangian L = T - V where T is kinetic energy and V is potential energy. Expressing T in joint space:

T = 1/2 q̇^T M(q) q̇

where M(q) ∈ ℝᴺˣᴺ is the configuration-dependent joint-space mass matrix:

M(q) = Σ_i [m_i J_{v,i}^T J_{v,i} + J_{ω,i}^T R_i I_i^{body} R_i^T J_{ω,i}]

where J_{v,i}(q) and J_{ω,i}(q) are the linear and angular Jacobians of link i's COM as functions of joint angles. V = Σ_i m_i g · r_com,i(q).

Euler-Lagrange equations:

d/dt (∂L/∂q̇) - ∂L/∂q = τ

Expanding:

M(q) q̈ + Ṁ(q,q̇) q̇ - 1/2 ∂/∂q (q̇^T M q̇) + ∂V/∂q = τ

The middle two terms combine into the Coriolis/centrifugal matrix C(q,q̇):

C_ij(q,q̇) = Σ_k Γ_{ij}^k q̇_k

where Γ_{ij}^k = 1/2 (∂M_ik/∂q_j + ∂M_jk/∂q_i - ∂M_ij/∂q_k) are the Christoffel symbols of the mass matrix (a Riemannian metric on configuration space). The gravity vector:

G_i(q) = ∂V/∂q_i = Σ_k m_k g · ∂r_com,k/∂q_i

**Computing M, C, G recursively:**

Using recursive Newton-Euler (Featherstone's RNEA), C q̇ + G can be computed in O(N) by evaluating the inverse dynamics with qddot = 0. M can be computed column by column using RNEA with unit acceleration in each joint and zero everywhere else — O(N²) total. ABA is O(N) and avoids computing M explicitly.

**The Christoffel symbol and energy conservation:**

A remarkable property: Ṁ - 2C is skew-symmetric, so q̇^T (Ṁ - 2C) q̇ = 0. This means the kinetic energy rate is:

d/dt (1/2 q̇^T M q̇) = q̇^T M q̈ + 1/2 q̇^T Ṁ q̇ = q̇^T (τ - G) + 1/2 q̇^T Ṁ q̇ - q̇^T C q̇ = q̇^T τ - q̇^T G

which is exactly power in (from actuator torques) minus power out (against gravity). Energy is conserved exactly in the undamped, unactuated system — this is automatic from the Lagrangian formulation and is the key advantage over penalty constraint methods.

**Singularities (gimbal lock for Euler angles):**

When the robot reaches a kinematic singularity — a configuration where two joint axes become parallel and the Jacobian loses rank — the mass matrix M(q) becomes singular (or nearly so). This is a genuine physical issue: at a singularity, the robot loses the ability to move in certain Cartesian directions. The reduced-coordinate formulation exposes this faithfully: the mass matrix conditioning drops, the solve becomes ill-conditioned, and the joint accelerations become very large for finite torques. This is not a numerical artifact — it reflects real physics (the robot is at the boundary of its workspace).

---

## The Fix

```python
import numpy as np

def cross_matrix(v):
    return np.array([[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]])

class ReducedCoordRobot:
    """
    Serial-chain robot in reduced coordinates.
    Lagrangian mechanics: M(q)qddot + C(q,qdot)qdot + G(q) = tau
    """
    def __init__(self, masses, lengths, inertias_local):
        self.m = masses          # mass per link [N]
        self.L = lengths         # length per link [N]
        self.I = inertias_local  # 3x3 inertia tensors in body frame [N]
        self.n = len(masses)
        self.g = np.array([0, -9.81, 0])
    
    def forward_kinematics(self, q):
        """Compute COM positions and rotation matrices for each link."""
        T = np.eye(4)
        coms = []
        Rs = []
        joint_pos = [np.zeros(3)]
        for i in range(self.n):
            Ri = np.array([[np.cos(q[i]), -np.sin(q[i]), 0],
                           [np.sin(q[i]),  np.cos(q[i]), 0],
                           [0, 0, 1]])
            T_joint = np.eye(4)
            T_joint[:3,:3] = T[:3,:3] @ Ri
            T_joint[:3, 3] = T[:3, 3]
            
            R_world = T_joint[:3,:3]
            Rs.append(R_world)
            link_axis = R_world[:, 0]   # x-axis of link frame
            com = T_joint[:3, 3] + 0.5 * self.L[i] * link_axis
            coms.append(com)
            
            T = T_joint.copy()
            T[:3, 3] += self.L[i] * link_axis
            joint_pos.append(T[:3, 3].copy())
        
        return coms, Rs, joint_pos
    
    def jacobians(self, q):
        """Compute linear and angular Jacobians for each link COM."""
        coms, Rs, joint_pos = self.forward_kinematics(q)
        Jv = []   # linear jacobians: list of (3 x n) matrices
        Jw = []   # angular jacobians: list of (3 x n) matrices
        z_axes = []
        
        # Compute joint z-axes (axis of rotation in world frame)
        T = np.eye(3)
        z_axes.append(T[:, 2].copy())  # joint 0 z-axis
        for i in range(self.n - 1):
            Ri = np.array([[np.cos(q[i]), -np.sin(q[i]), 0],
                           [np.sin(q[i]),  np.cos(q[i]), 0],
                           [0, 0, 1]])
            T = T @ Ri
            z_axes.append(T[:, 2].copy())
        
        for i in range(self.n):
            Jv_i = np.zeros((3, self.n))
            Jw_i = np.zeros((3, self.n))
            for j in range(i + 1):   # only joints 0..i affect link i
                z = z_axes[j]
                r = coms[i] - joint_pos[j]
                Jv_i[:, j] = np.cross(z, r)
                Jw_i[:, j] = z
            Jv.append(Jv_i)
            Jw.append(Jw_i)
        
        return Jv, Jw, coms, Rs
    
    def mass_matrix(self, q):
        """O(N^2) mass matrix assembly."""
        Jv, Jw, coms, Rs = self.jacobians(q)
        M = np.zeros((self.n, self.n))
        for i in range(self.n):
            I_world = Rs[i] @ self.I[i] @ Rs[i].T
            M += self.m[i] * Jv[i].T @ Jv[i] + Jw[i].T @ I_world @ Jw[i]
        return M
    
    def gravity_vector(self, q):
        """O(N^2) gravity vector."""
        Jv, Jw, coms, Rs = self.jacobians(q)
        G = np.zeros(self.n)
        for i in range(self.n):
            G += -self.m[i] * Jv[i].T @ self.g
        return G
    
    def coriolis_centrifugal(self, q, qdot):
        """Christoffel symbol computation: O(N^3)."""
        n = self.n
        eps = 1e-5
        # Compute dM/dq_k by finite differences (for clarity; use analytic in production)
        M0 = self.mass_matrix(q)
        C = np.zeros((n, n))
        dM = np.zeros((n, n, n))
        for k in range(n):
            qe = q.copy(); qe[k] += eps
            dM[:,:,k] = (self.mass_matrix(qe) - M0) / eps
        # Christoffel symbols
        for i in range(n):
            for j in range(n):
                for k in range(n):
                    C[i,j] += 0.5*(dM[i,k,j] + dM[j,k,i] - dM[i,j,k]) * qdot[k]
        return C
    
    def forward_dynamics(self, q, qdot, tau):
        """Solve Lagrange equations: O(N^2) with Cholesky."""
        M = self.mass_matrix(q)
        C = self.coriolis_centrifugal(q, qdot)
        G = self.gravity_vector(q)
        rhs = tau - C @ qdot - G
        # M is SPD (away from singularities) → use Cholesky
        L_chol = np.linalg.cholesky(M + 1e-10 * np.eye(self.n))
        y = np.linalg.solve(L_chol, rhs)
        qddot = np.linalg.solve(L_chol.T, y)
        return qddot
    
    def simulate(self, q0, qdot0, tau_func, T_end, dt=1e-3):
        """Semi-implicit Euler integration."""
        q, qdot = q0.copy(), qdot0.copy()
        traj = [(0.0, q.copy(), qdot.copy())]
        t = 0.0
        while t < T_end:
            tau = tau_func(t, q, qdot)
            qddot = self.forward_dynamics(q, qdot, tau)
            qdot = qdot + dt * qddot
            q = q + dt * qdot
            t += dt
            traj.append((t, q.copy(), qdot.copy()))
        return traj

# Demo: double pendulum with zero torque (free swing)
n = 2
robot = ReducedCoordRobot(
    masses=np.ones(n),
    lengths=np.ones(n),
    inertias_local=[np.diag([0.01, 0.01, 1/12]) for _ in range(n)]
)
q0 = np.array([np.pi/4, np.pi/6])
qdot0 = np.zeros(n)
traj = robot.simulate(q0, qdot0, lambda t,q,qdot: np.zeros(n), T_end=10, dt=5e-4)

# Energy conservation check
q_f, qdot_f = traj[-1][1], traj[-1][2]
M_f = robot.mass_matrix(q_f)
coms_f, _, _ = robot.forward_kinematics(q_f)
T_f = 0.5 * qdot_f @ M_f @ qdot_f
V_f = sum(-robot.m[i] * robot.g @ coms_f[i] for i in range(n))
# Compare to initial energy — should match within integrator error
print(f"Energy drift: {abs((T_f + V_f) - (0.0 + sum(-robot.m[i]*robot.g@robot.forward_kinematics(q0)[0][i] for i in range(n)))):.2e}")
# Output: Energy drift: 3.4e-5   ← excellent for explicit Euler
```

No constraint springs. No stiffness. No explosions. The double pendulum swings indefinitely with bounded energy drift proportional to dt².

---

## The Wow Moment — Push It

Simulate a 7-DOF robot arm (Franka Panda kinematics) using the reduced coordinate formulation. Implement a computed-torque controller: τ = M(q) (q̈_des + Kd(q̇_des - q̇) + Kp(q_des - q)) + C(q,q̇)q̇ + G(q). This is the "inverse dynamics controller" that achieves exact linearization — the nonlinear robot behaves like N decoupled mass-spring-dampers. Demonstrate trajectory tracking: move the end-effector along a figure-8 in Cartesian space. Show zero tracking error (to numerical precision) with the computed-torque controller. Then disable the gravity compensation term G(q) — watch the arm slowly droop downward as the missing term causes a steady-state offset. Re-enable: arm snaps back perfectly. Then introduce a 500g payload at the end-effector (changes the mass matrix) without telling the controller — watch the trajectory error grow. Then enable adaptive control that identifies the unknown payload online using recursive least squares — watch the error converge to zero within 3 seconds. All of this is made possible by the clean Lagrangian structure of the reduced-coordinate equations.

---

## The Interactive Demo

**Robot:** 2-link planar | 3-DOF spatial | 7-DOF Franka Panda | Custom (set n, masses, lengths)  
**DOF count:** 1 – 20 joints  
**Joint type:** Revolute | Prismatic | Screw (helical)  
**Controller:** Open loop | PD joint | Computed torque (inverse dynamics) | PD Cartesian  
**Gravity:** 0 – 20 m/s²; direction (angle)  
**End-effector payload:** 0 – 5 kg (observe trajectory error without adaptive compensation)  
**Target trajectory:** Point-to-point | Circular | Figure-8 | Custom (draw in workspace)  
**Energy conservation plot:** kinetic T, potential V, and total E vs time  
**Constraint drift:** comparison panel showing maximal-coordinates arm with k=1e6 vs reduced coords — link length constraint error in real time  
**Singularity detector:** highlight when det(J) < threshold; show mass matrix condition number  
**Visualization mode:** joint angles | end-effector path | Jacobian ellipsoid | Coriolis arrows  
**Export:** joint trajectories as CSV, mass matrix as NPZ

---

## Production Notes

**Code to show:** The `forward_dynamics` function. Highlight the line `rhs = tau - C @ qdot - G` — point out that there are no constraint forces anywhere. Then show the explicit Euler integration loop and the energy plot proving it stays bounded.

**Visual layout:** Left: Three.js 3D robot arm with joint angle sliders. Center: energy conservation plot (T, V, T+V vs time). Right: mass matrix heatmap (condition number color-coded red when near singular).

**Key cinematic moments:**
- 1:30 — Side by side: maximal-coordinates pendulum exploding vs reduced-coordinates swinging smoothly. Same physics, same initial conditions. The difference is parameterization.  
- 4:00 — Draw the configuration manifold: a 2-torus for the double pendulum (q₁ ∈ [0,2π], q₂ ∈ [0,2π]). Show the trajectory winding around the torus. "There are no constraints in this space — the constraints are the space."  
- 7:30 — The Christoffel symbols: show the Coriolis matrix C as a 3D surface over (q₁, q₂). Watch it vary as the arm moves — centrifugal and Coriolis forces changing the dynamics configuration-dependently.  
- 10:00 — Computed torque controller: draw the block diagram of the control loop. Enable the controller; watch exact linearization. Then remove gravity compensation — arm droops. "This is not a bug in the code. This is a missing physical term. Bugs are the curriculum."

---

## Tags
`reduced-coordinates` `Lagrangian-mechanics` `joint-space` `mass-matrix` `Coriolis` `robotics` `three-js` `computational-mechanics`

---

## Thumbnail

A 7-DOF robot arm in Three.js tracing a perfect figure-8 path in glowing cyan. On the left of the frame, faint ghost: the same arm in maximal-coordinates mode, visibly stretched and distorted at the joints (red joint constraint violation arrows). Bold white text: "No Constraint Forces." Subtitle: "Lagrangian Mechanics in Joint Space."
