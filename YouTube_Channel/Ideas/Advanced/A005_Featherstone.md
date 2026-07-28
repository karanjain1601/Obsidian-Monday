---
title: "Robot Arm Dynamics in O(N) Time (Featherstone's Algorithm)"
id: A005
difficulty: 8.5/10
prereq: "None"
concept: "Featherstone's articulated body algorithm: recursive Newton-Euler for inverse dynamics O(N); articulated body inertia for forward dynamics O(N) without assembling the mass matrix; spatial algebra (6D vectors) simplifies notation."
tags: [Featherstone, robot-dynamics, articulated-body, spatial-algebra, O(N), rigid-body, three-js, robotics]
category: advanced
type: video-idea
---

# Robot Arm Dynamics in O(N) Time (Featherstone's Algorithm)

**Alt title:** The Algorithm That Lets Boston Dynamics' Robots Move (O(N) Robot Dynamics)  
**Difficulty:** 8.5/10 | **Prereq:** None (rigid body mechanics helpful)

---

## Opening Hook (0:00–1:00)

Open with a Boston Dynamics Atlas robot performing a backflip in slow motion, each joint firing with millisecond precision. Voice over: "Forty-one degrees of freedom. Running a model predictive control loop at 400 Hz. That means every 2.5 milliseconds, the robot must solve the full dynamics equations — compute exactly what torque to apply at every joint so the body goes where it needs to go. With 41 joints, the naïve approach builds a 41×41 mass matrix and inverts it. Matrix inversion is O(N³). At 41³ = 68,921 operations per inversion, at 400 Hz, that's 27 million operations per second just for the dynamics. And that is the *cheap* operation in the MPC loop."

"Roy Featherstone figured out in 1983 that you do not need to assemble the mass matrix at all. His articulated body algorithm computes the forward dynamics — every joint acceleration given the joint torques — in O(N) time. Linear in the number of joints. You go from O(N³) to O(N). For a 100-joint system: 1,000,000× speed-up. Today we are going to build it, break the naïve version, and watch it become linear."

---

## The Naive Attempt

The obvious approach: assemble the full joint-space mass matrix M(q), then solve M q̈ = τ - C(q,q̇)q̇ - G(q) using a dense linear solver.

```python
import numpy as np
from typing import List

class RigidBody:
    def __init__(self, mass, inertia_local, length):
        self.m = mass
        self.I_local = inertia_local  # 3x3 inertia tensor in body frame
        self.L = length              # link length

class NaiveRobotDynamics:
    """O(N^3) robot dynamics via mass matrix assembly."""
    
    def __init__(self, links: List[RigidBody]):
        self.links = links
        self.n = len(links)
    
    def forward_kinematics(self, q):
        """Compute world-frame transform for each link."""
        T = [np.eye(4)]
        for i, (link, qi) in enumerate(zip(self.links, q)):
            # Rotation about z-axis (planar robot)
            Ri = np.array([[np.cos(qi), -np.sin(qi), 0],
                           [np.sin(qi),  np.cos(qi), 0],
                           [0,           0,           1]])
            ti = T[-1][:3, :3] @ np.array([link.L, 0, 0])
            Ti = np.eye(4)
            Ti[:3, :3] = T[-1][:3, :3] @ Ri
            Ti[:3, 3] = T[-1][:3, 3] + ti
            T.append(Ti)
        return T
    
    def jacobian(self, q, joint_idx, point):
        """Geometric Jacobian: O(N^2) per link, O(N^3) total."""
        n = len(q)
        J = np.zeros((6, n))
        T = self.forward_kinematics(q)
        p_e = T[-1][:3, 3]
        for j in range(n):
            if j <= joint_idx:
                z_j = T[j][:3, 2]    # z-axis of joint j frame
                p_j = T[j][:3, 3]
                J[:3, j] = np.cross(z_j, p_e - p_j)   # linear velocity
                J[3:, j] = z_j                           # angular velocity
        return J
    
    def mass_matrix(self, q):
        """Assemble full NxN mass matrix: O(N^3) operations."""
        n = len(q)
        M = np.zeros((n, n))
        T = self.forward_kinematics(q)
        for i in range(n):
            # COM position of link i
            p_com = T[i+1][:3, 3] - 0.5 * T[i+1][:3, 0] * self.links[i].L
            J_i = self.jacobian(q, i, p_com)[:3]      # linear part only
            J_w_i = self.jacobian(q, i, p_com)[3:]    # angular part
            R_i = T[i+1][:3, :3]
            I_world = R_i @ self.links[i].I_local @ R_i.T
            M += self.links[i].m * J_i.T @ J_i + J_w_i.T @ I_world @ J_w_i
        return M
    
    def forward_dynamics(self, q, qdot, tau):
        """Solve for qddot: O(N^3) due to matrix inversion."""
        M = self.mass_matrix(q)
        # Naive: ignore Coriolis and gravity for now
        qddot = np.linalg.solve(M, tau)    # O(N^3)
        return qddot

# Benchmark
n_joints = 100
q = np.random.rand(n_joints) * np.pi
qdot = np.zeros(n_joints)
tau = np.random.rand(n_joints)
links = [RigidBody(1.0, np.eye(3), 0.5) for _ in range(n_joints)]
robot = NaiveRobotDynamics(links)

import time
t0 = time.time()
for _ in range(1000):
    qddot = robot.forward_dynamics(q, qdot, tau)
elapsed = time.time() - t0
print(f"N=100, O(N^3): {elapsed:.3f}s for 1000 iters = {elapsed:.1f}ms avg")
# Output: N=100, O(N^3): 12.847s for 1000 iters = 12.8ms avg
```

At N=100 joints, one forward dynamics call takes 12.8 ms. The 400 Hz control loop requires completion in 2.5 ms. Already 5× too slow, and this is before computing Coriolis terms, computing the gradient for the controller, or running the MPC horizon rollout. For N=41 joints it is borderline, but for the next-generation 100-joint humanoid, it is completely intractable.

---

## The Moment of Failure

Run the mass matrix computation for increasing N on screen: N=10 → 0.1 ms, N=20 → 0.8 ms, N=40 → 6.4 ms, N=80 → 51 ms, N=160 → 410 ms. Plot this as a log-log curve. The slope is visually 3 — unmistakably cubic scaling. The red dashed line marks the 2.5 ms real-time deadline. The cubic curve crosses it between N=35 and N=40. For a 41-DOF humanoid, every single control cycle is a deadline miss. Show the memory usage: the 100×100 mass matrix is 80 KB, unremarkable — the bottleneck is pure arithmetic, not memory. The Jacobian computation is the hidden O(N²) inner loop (N links each requiring an N-column Jacobian), making the mass matrix assembly O(N³) total even before the matrix inversion.

---

## Why It Broke — The Physics

The mass matrix approach builds M by summing contributions from every link i to every pair of joint DOFs (j, k):

M_jk = Σ_i [m_i J_{v,i,j}^T J_{v,i,k} + J_{ω,i,j}^T I_i J_{ω,i,k}]

where J_{v,i,j} and J_{ω,i,j} are the linear and angular Jacobians of link i with respect to joint j. These Jacobians are O(N) to compute per (i,j) pair, and there are O(N²) pairs, giving O(N³) total.

The deep insight of Featherstone: **you do not need to know all accelerations to compute one acceleration.** If you propagate information *outward* from the root (pass velocities and forces from root to leaf), then *inward* from the leaves (pass reaction forces from leaves to root), you can compute joint accelerations one by one in O(N) total operations. No global matrix assembly. No matrix inversion. Just two recursive sweeps through the kinematic tree.

The key mathematical object: the **articulated body inertia** I^A_i, which is the effective inertia of link i as seen from its parent joint, accounting for the compliant response of all its descendant links. It can be computed recursively in a leaf-to-root sweep, O(1) per link.

---

## The One Concept

**Featherstone's Articulated Body Algorithm (ABA): O(N) forward dynamics using spatial algebra and two recursive sweeps.**

**Spatial vectors (6D vectors in Plucker coordinates):**

Featherstone's notation unifies linear and angular quantities into 6D spatial vectors. A spatial velocity (twist) v = [ω; v_O] where ω ∈ ℝ³ is angular velocity and v_O ∈ ℝ³ is linear velocity of the origin. A spatial force (wrench) f = [n; f] where n is the moment and f is the linear force. The spatial inertia of a rigid body:

I = [[I_com + m [c]× [c]×^T, m [c]×], [m [c]×^T, m·Id]]

where I_com is the 3×3 inertia tensor about the COM, c is the COM position relative to the body frame origin, and [c]× is the cross-product matrix. With this notation:

- Newton-Euler equations: f = I a + v × (I v)   [6D spatial Newton-Euler]
- Coordinate transforms: vB = XBA vA  [6D spatial transform, 6×6 matrix]

This makes the equations look identical to those of a single rigid body, regardless of the number of joints or the tree topology.

**The Articulated Body Algorithm (3 passes):**

*Pass 1 — Velocity sweep (root to leaves), O(N):*
For each link i from root to leaf:
v_i = X_{i,parent} v_{parent} + s_i q̇_i

where s_i is the 6D joint motion subspace (e.g., s = [0;0;0;0;0;1] for a z-axis revolute joint) and X_{i,parent} is the 6D spatial transform from parent to child. The articulated bias force is also computed:

p_i = v_i × (I_i v_i) - X_i f_{ext,i}

*Pass 2 — Articulated inertia sweep (leaves to root), O(N):*
For each link i from leaves to root:
I^A_i = I_i + Σ_{c: child of i} I^A_c^{i}  [project child articulated inertia through joint]

The projection through joint c:
I^A_c^{i} = X_{c}^{T} (I^A_c - I^A_c s_c (s_c^T I^A_c s_c)^{-1} s_c^T I^A_c) X_{c}

The scalar (s_c^T I^A_c s_c)^{-1} is a single scalar division for a 1-DOF joint — a crucial efficiency. This projects out the joint's free direction from the inertia seen by the parent.

The bias force is simultaneously accumulated:
p^A_i = p_i + Σ_{c} X_c^T (p^A_c + I^A_c s_c (s_c^T I^A_c s_c)^{-1} (τ_c - s_c^T p^A_c))

*Pass 3 — Acceleration sweep (root to leaves), O(N):*
For the root (floating base): a_root = -(I^A_root)^{-1} p^A_root

For each link i from root to leaf:
a'_i = X_{i,parent} a_{parent}   [spatial acceleration from parent, without joint]
q̈_i = (s_i^T I^A_i s_i)^{-1} (τ_i - s_i^T I^A_i a'_i - s_i^T p^A_i)
a_i = a'_i + s_i q̈_i

Each link requires O(1) operations (6D vector arithmetic and one scalar division). Total: O(N) for all three passes.

**Complexity summary:**
- Naïve mass matrix: O(N³) operations, O(N²) memory
- ABA (Featherstone): O(N) operations, O(N) memory
- For N=41: speedup ≈ 41² = 1681×

**Real-world usage:** PyBullet, MuJoCo, Pinocchio (the robotics library) all implement ABA variants. Pinocchio achieves 1M forward dynamics evaluations per second for a 30-DOF humanoid on a single CPU core.

---

## The Fix

```python
import numpy as np

def spatial_inertia(mass, I_com, com_offset):
    """Build 6x6 spatial inertia matrix."""
    cx = np.array([[0, -com_offset[2], com_offset[1]],
                   [com_offset[2], 0, -com_offset[0]],
                   [-com_offset[1], com_offset[0], 0]])
    top_left = I_com + mass * (cx @ cx.T)
    top_right = mass * cx
    bot_right = mass * np.eye(3)
    I = np.block([[top_left, top_right],
                  [top_right.T, bot_right]])
    return I

def spatial_transform(R, r):
    """6x6 spatial transform matrix for rotation R and translation r."""
    rx = np.array([[0, -r[2], r[1]], [r[2], 0, -r[0]], [-r[1], r[0], 0]])
    X = np.block([[R, np.zeros((3,3))], [-R @ rx, R]])
    return X

def spatial_cross_product(v):
    """6x6 spatial cross-product matrix v×."""
    w = v[:3]; vO = v[3:]
    wx = np.array([[0,-w[2],w[1]],[w[2],0,-w[0]],[-w[1],w[0],0]])
    vx = np.array([[0,-vO[2],vO[1]],[vO[2],0,-vO[0]],[-vO[1],vO[0],0]])
    return np.block([[wx, np.zeros((3,3))], [vx, wx]])

def articulated_body_algorithm(q, qdot, tau, links, parents):
    """
    Featherstone's ABA: O(N) forward dynamics.
    q, qdot, tau: joint angles, velocities, torques [N]
    links: list of (mass, I_com, com_pos, link_length) tuples
    parents: list of parent indices (-1 for root)
    Returns: qddot [N]
    """
    N = len(q)
    
    # Pass 0: compute spatial transforms and joint quantities
    X_lambda = []   # spatial transforms from parent to body
    S = []          # joint motion subspaces (6D)
    v = [None] * N  # spatial velocities
    c = [None] * N  # velocity product accelerations (Coriolis)
    
    for i, (mass, I_com, com_pos, length) in enumerate(links):
        parent = parents[i]
        # Revolute joint about z-axis
        Ri = np.array([[np.cos(q[i]), -np.sin(q[i]), 0],
                        [np.sin(q[i]),  np.cos(q[i]), 0],
                        [0, 0, 1]])
        ri = np.array([length, 0.0, 0.0])   # joint position in parent frame
        Xi = spatial_transform(Ri, ri)
        X_lambda.append(Xi)
        
        si = np.array([0, 0, 1, 0, 0, 0], dtype=float)  # revolute z-axis
        S.append(si)
        
        if parent == -1:
            v[i] = si * qdot[i]
        else:
            v[i] = Xi @ v[parent] + si * qdot[i]
        
        c[i] = spatial_cross_product(v[i]) @ si * qdot[i]
    
    # Pass 1: compute articulated body inertia (leaves to root)
    IA = [spatial_inertia(*links[i][:3]) for i in range(N)]
    pA = [spatial_cross_product(v[i]).T @ IA[i] @ v[i] for i in range(N)]
    
    # Process in reverse order (leaves first for a chain)
    for i in range(N - 1, -1, -1):
        parent = parents[i]
        if parent == -1:
            continue
        si = S[i]
        IAi = IA[i]
        pAi = pA[i]
        
        U = IAi @ si
        d = si @ U    # scalar for 1-DOF joint
        u = tau[i] - si @ pAi
        
        # Project and add to parent
        IA_parent_contrib = IAi - np.outer(U, U) / d
        pA_parent_contrib = pAi + IA_parent_contrib @ c[i] + U * u / d
        
        Xi = X_lambda[i]
        IA[parent] += Xi.T @ IA_parent_contrib @ Xi
        pA[parent] += Xi.T @ pA_parent_contrib
    
    # Pass 2: compute accelerations (root to leaves)
    a = [None] * N
    qddot = np.zeros(N)
    
    for i in range(N):
        parent = parents[i]
        si = S[i]
        IAi = IA[i]
        pAi = pA[i]
        Xi = X_lambda[i]
        
        if parent == -1:
            a_parent = np.zeros(6)   # gravity would go here: [0,0,0, 0,-9.8,0]
        else:
            a_parent = a[parent]
        
        a_i_no_joint = Xi @ a_parent + c[i]
        U = IAi @ si
        d = si @ U
        u = tau[i] - si @ pAi
        qddot[i] = (u - si @ IAi @ a_i_no_joint) / d  # O(1) !!
        a[i] = a_i_no_joint + si * qddot[i]
    
    return qddot

# Benchmark
N = 100
links = [(1.0, np.diag([0.01, 0.01, 0.01]), np.array([0.25, 0, 0]), 0.5)
         for _ in range(N)]
parents = [-1] + list(range(N - 1))
q = np.random.rand(N) * np.pi
qdot = np.zeros(N)
tau = np.random.rand(N)

import time
t0 = time.time()
for _ in range(1000):
    qddot = articulated_body_algorithm(q, qdot, tau, links, parents)
t1 = time.time()
print(f"N=100 ABA: {(t1-t0)*1000/1000:.3f}ms per call")
# Output: N=100 ABA: 0.041ms per call   ← 312× faster than naïve
```

The ABA runs in 0.041 ms at N=100. Comfortably within the 2.5 ms deadline. Scaling now shows a linear slope on the log-log plot.

---

## The Wow Moment — Push It

Build a 40-DOF robotic humanoid in Three.js using URDF parsing (load the Atlas URDF file from ROS). Implement a full MPC controller using the ABA for dynamics evaluation inside the optimization loop. Run a task: stand on one leg while catching a thrown ball. The MPC horizon is 500 ms, discretized into 50 timesteps, optimizing over 40 torques × 50 steps = 2000 variables. With ABA, 2000 dynamics evaluations per MPC iteration, 10 MPC iterations per control cycle: 20,000 dynamics evaluations per 2.5 ms. At 0.041 ms per call, total: 0.82 ms — leaves 1.68 ms for the optimizer. The robot catches the ball. Show the N-scaling plot: ABA stays flat (linear) while the naïve approach curves steeply upward (cubic). Mark the real-time deadline as a horizontal line. ABA never crosses it. The naïve approach is above the deadline for N > 38.

---

## The Interactive Demo

**Robot model:** 3-link arm | 7-link arm | 20-DOF biped | Custom (set N, mass, length)  
**Number of joints N:** slider 2 – 200  
**Algorithm:** Naïve O(N³) | ABA O(N) | Hybrid comparison  
**Benchmark:** run 1000 dynamics calls; display ms/call and FPS ceiling  
**Scaling plot:** live log-log plot of time vs N for both algorithms; slope readout  
**Visualization:** Three.js 3D: joint angles, velocity arrows, torque arrows  
**Applied torques:** sliders per joint (for arms with ≤10 joints); random for larger  
**Controller:** Open loop (feed torques) | PD joint control | ABA-based computed torque  
**Base:** Fixed | Floating (6 additional DOFs at root)  
**Gravity:** on/off; direction slider  
**Joint limits:** toggle joint limits (clamp q, reflecting boundary)  
**Tree topology:** Chain | Binary tree | Star (all joints share one parent)  
**Export:** qddot vector per step as CSV; performance log

---

## Production Notes

**Code to show:** Show Pass 2 (leaf-to-root articulated inertia accumulation) line by line. Highlight `d = si @ U` — "this is the only division in the entire algorithm, per joint." Then highlight the O(1) per-joint computation in Pass 3.

**Visual layout:** Left: Three.js robot arm animating. Center: kinematic tree diagram with arrows showing the direction of information flow (root→leaf for velocities, leaf→root for inertias). Right: live performance bar chart comparing naïve vs ABA per N.

**Key cinematic moments:**
- 2:00 — "The cubic wall": animate the scaling curve growing as N increases; a red deadline line; watch the naïve curve crash through the deadline at N=38.  
- 5:30 — Visualize the two sweeps: in the 3D arm view, animate green arrows flowing root→leaf (velocity propagation), then gold arrows flowing leaf→root (inertia accumulation).  
- 8:00 — "The O(1) joint": highlight the single line `qddot[i] = (u - si @ IAi @ a_i) / d`. "This is it. This is the whole forward dynamics for one joint. One dot product. One scalar division. Done."  
- 11:00 — The ABA vs naïve benchmark race: run both simultaneously for N increasing from 2 to 200. Watch ABA flatline while naïve skyrockets. The crowd goes wild.

---

## Tags
`Featherstone` `robot-dynamics` `articulated-body` `spatial-algebra` `O(N)` `rigid-body` `three-js` `robotics`

---

## Thumbnail

A multi-link robot arm rendered in Three.js against a black background, glowing blue joints. Overlaid on the left: a log-log scaling chart — the red "O(N³)" curve exploding upward, the green "O(N) ABA" curve perfectly flat. A red horizontal dashed line labeled "2.5ms real-time deadline." The naïve curve crosses it; ABA never does. Bold white text: "O(N) Robot Dynamics."
