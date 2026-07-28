---
title: "Simulating Fluid as Interacting Vortex Filaments"
id: A012
difficulty: 8.5/10
prereq: "None"
concept: "Vortex filament method: discretize vortex sheet/tube into line segments; Biot-Savart law gives induced velocity; filaments advect and stretch; core regularization prevents singularity; vortex reconnection triggers when filaments cross."
tags: [vortex-filament, Biot-Savart, vortex-reconnection, regularization, fluid-simulation, three-js, Lagrangian, computational-fluid-dynamics]
category: advanced
type: video-idea
---

# Simulating Fluid as Interacting Vortex Filaments

**Alt title:** Fluid Dynamics as Interacting Wires of Spinning Air  
**Difficulty:** 8.5/10 | **Prereq:** None (basic vector calculus helpful)

---

## Opening Hook (0:00–1:00)

Open with an ultra-slow-motion video of a plane's wing in a fog tunnel: the wingtip vortex trailing behind, a tight spiral of condensed moisture unwinding for hundreds of meters. Then cut to high-speed camera footage of smoke rings colliding: they leap-frog, then their core filaments touch, and in one chaotic moment they reconnect — the two rings becoming four linked rings, which then scatter. Voice over: "The physics of these vortex rings is exact. Helmholtz proved in 1858 that in an inviscid fluid, vortex lines cannot begin or end — they must form closed loops or extend to the boundary. They advect with the flow, they stretch and tilt, but they never disappear. And the velocity of every fluid particle is completely determined by the vorticity distribution via the Biot-Savart law — the same law that governs magnetic fields from electric currents."

"This gives us a completely different way to simulate fluid. Instead of a grid, track the vortex lines themselves. The fluid is the vorticity. Everything else — pressure, velocity, density — is derived from it. Today we simulate fluid as a collection of interacting vortex rings, and we watch them leap-frog, reconnect, and cascade into turbulence."

---

## The Naive Attempt

The most direct approach: represent a vortex ring as a single circular filament discretized into N points. The Biot-Savart law gives the velocity induced by each segment at every other point:

```python
import numpy as np

def biot_savart_naive(X, Gamma, core_radius=0.01):
    """
    Compute velocity induced at each filament point by all other segments.
    X: (N, 3) point positions
    Gamma: circulation (scalar)
    Returns: (N, 3) velocities — O(N^2) per call
    """
    N = len(X)
    velocities = np.zeros((N, 3))
    
    for i in range(N):   # at each point i
        for j in range(N):   # contribution from each segment j→j+1
            if j == i or j == (i-1) % N:
                continue   # skip adjacent segments (would diverge)
            
            # Segment j to j+1
            r1 = X[i] - X[j]
            r2 = X[i] - X[(j+1)%N]
            dl = X[(j+1)%N] - X[j]
            
            r1_mag = np.linalg.norm(r1)
            r2_mag = np.linalg.norm(r2)
            
            # Biot-Savart integrand: dv = (Gamma/4π) (dl × r) / |r|^3
            # Integrated along segment: exact formula
            cross_r1 = np.cross(dl, r1)
            cross_r2 = np.cross(dl, r2)
            
            factor = (1.0 / r1_mag + 1.0 / r2_mag) / (r1_mag * r2_mag + np.dot(r1, r2))
            velocities[i] += Gamma / (4 * np.pi) * cross_r1 * factor
        
    return velocities

def simulate_vortex_ring_naive(N=64, R=1.0, Gamma=1.0, dt=0.01, T=10.0):
    """Single vortex ring: should translate at constant velocity."""
    # Initialize circular ring in xy-plane
    theta = np.linspace(0, 2*np.pi, N, endpoint=False)
    X = np.column_stack([R*np.cos(theta), R*np.sin(theta), np.zeros(N)])
    
    t = 0.0
    positions = [X.copy()]
    while t < T:
        vel = biot_savart_naive(X, Gamma)
        X += dt * vel   # Euler integration
        t += dt
        positions.append(X.copy())
    
    return np.array(positions)

import time
t0 = time.time()
traj = simulate_vortex_ring_naive(N=64, T=1.0)
print(f"N=64, 100 steps: {time.time()-t0:.2f}s")
# Output: N=64, 100 steps: 4.73s  ← O(N^2) too slow
# And: vortex ring position drift = 0.8m at T=1s (wrong! should be 0.5m)
```

The O(N²) Biot-Savart loop is already slow at N=64. For N=256 (needed for a smooth ring), it's 16× slower — 75 seconds per simulation unit. For two interacting rings (2N points), it's (2N)² = 4N² — and the ring moves to the wrong position because the singularity at the self-induction of each segment causes a divergence that the skip-2-neighbors hack does not correctly regularize.

---

## The Moment of Failure

Run two vortex rings initialized for the leap-frog configuration: ring 1 at z=0 with radius R=1, ring 2 at z=0.5 with radius R=1.05 (slightly larger). In the classic leap-frog, ring 1 should pass through ring 2, shrink, speed up, pass through again — a perpetual dance. The naive simulation does something different: the rings approach each other correctly, but as their closest points come within one segment length, the Biot-Savart sum diverges (the 1/r singularity) — velocities reaching 10⁶ m/s — and the rings catastrophically explode outward, with points flying off to infinity. Print the maximum velocity magnitude at each step: 0.3, 0.4, 0.6, 1.2, 8.5, 4300, overflow (NaN). The simulation crashes at step 17. The naive singularity handling (just skipping adjacent segments) does not prevent the catastrophic blow-up when two distinct filaments approach each other.

---

## Why It Broke — The Physics

The Biot-Savart law in its classical form has a 1/r singularity: the velocity induced by a vortex line element dl at position r is:

dv = (Γ/4π) (dl × r̂) / r²

As r → 0, dv → ∞. For a curved vortex filament, the self-induced velocity (the Biot-Savart integral over the entire filament, approaching the filament from outside) converges to a finite value only because the integral has an integrable singularity at the filament itself (the cross product dl × r goes to zero faster than r² goes to zero for a smooth curve). But for two distinct filaments approaching each other, the cross-point distance r → 0 and the velocity diverges without cancellation.

Physical reality: in a real fluid with finite viscosity, the vortex core has finite thickness δ (viscosity smooths the vorticity distribution over a core of radius δ ∝ √(νt)). The velocity inside the core is finite: v_max ∝ Γ/(2πδ). The inviscid point-vortex approximation is valid only at distances r >> δ from the filament. A regularized Biot-Savart law replaces r with √(r² + δ²) — the Rosenhead regularization:

dv = (Γ/4π) (dl × r) / (r² + δ²)^(3/2)

This makes the Biot-Savart kernel finite everywhere, with a maximum velocity of order Γ/δ near the core. The filament behaves like a vortex tube of finite core size δ.

Vortex reconnection: when two filament segments approach within a distance of order δ, the inviscid equations no longer apply — viscosity becomes important locally, the vortex lines reconnect (topology changes), and the filaments swap their connectivity. In a simulation, this requires explicit detection (when two filaments come within δ of each other) and a reconnection surgery: cut both filaments and rejoin the ends in the alternative configuration.

---

## The One Concept

**Vortex filament method: Biot-Savart law with core regularization, filament advection, stretching, and vortex reconnection.**

**Helmholtz vortex laws:**

In an inviscid barotropic fluid:
1. The circulation Γ = ∮ u · dl around a material loop is conserved (Kelvin's circulation theorem).
2. Vortex lines are material lines — they move with the fluid (Helmholtz's first theorem).
3. The strength Γ of a vortex tube is constant along the tube and constant in time (Helmholtz's second theorem).

These laws mean the vortex filaments can be advected passively: each point on a filament moves with the fluid velocity at that point, which is given by the Biot-Savart integral over all filaments.

**Biot-Savart law:**

The velocity field u(x) induced by a set of vortex filaments with circulations Γ_α:

u(x) = Σ_α (Γ_α / 4π) ∫_{C_α} (dl × (x - x')) / |x - x'|³

For a discretized filament with N_p points, the integral over segment j (from X_j to X_{j+1}) is evaluated analytically using the exact Biot-Savart formula for a finite straight vortex segment:

v_{ij} = (Γ/4π) [(1/r1 + 1/r2) / (r1 r2 + r1·r2)] (dl × r1)

where r1 = x_i - X_j, r2 = x_i - X_{j+1}, dl = X_{j+1} - X_j.

With the Rosenhead regularization, replace |r| → √(|r|² + δ²):

v_{ij}^{reg} = (Γ/4π) (dl × r1) / (|dl × r1|² / (r1_ε r2_ε) + ε)

where r1_ε = √(|r1|² + δ²). This is smooth everywhere and reproduces the exact Biot-Savart outside the core.

**Filament stretching:**

As the filament advects, adjacent points move at different velocities, stretching the segment between them. By Helmholtz's third law, Γ is constant along the filament — so as a segment stretches by factor λ, the vorticity magnitude increases by λ (vortex stretching). In the simulation, we track segment lengths and periodically insert new points (refinement) when a segment becomes too long.

**Numerical refinement and coarsening:**

Adaptive refinement: if |X_{j+1} - X_j| > L_max, insert midpoint. Adaptive coarsening: if |X_{j+1} - X_j| < L_min, merge with neighbor. These maintain the filament resolution proportional to local curvature.

**Vortex reconnection algorithm:**

For each pair of filaments (α, β), detect reconnection candidates: find the minimum distance between any segment from α and any segment from β. If d_min < δ_reconnect (a threshold, typically 2δ):
1. Find the two closest segment points (X_α_i on filament α, X_β_j on filament β).
2. Cut both filaments at these points.
3. Rejoin in the alternative topology: connect the beginning of α to the beginning of β, and the end of α to the end of β (one of two choices — choose the one that reduces total filament length, consistent with energy dissipation at reconnection).
4. The resulting filament pair has changed topology — two rings become one figure-eight ring, or vice versa.

This is the Barenghi-Hanninen reconnection algorithm used in quantum turbulence simulations of superfluid helium.

**Tree-code acceleration (Barnes-Hut):**

The O(N²) Biot-Savart sum is too slow for large simulations. The Barnes-Hut tree (octree) approximation: group distant filament segments together and represent their combined effect by multipole moments. The induced velocity from a distant cluster of segments at distance R is approximated to order p by:

v ≈ Σ_{n=0}^{p} (multipole moment n of cluster) / R^{n+1}

This reduces the cost to O(N log N) for p=0 (monopole), or O(N log N) per multipole order. The FMM (Fast Multipole Method) reduces it to O(N) by also expanding the target points. For vortex methods, the FMM reduces from O(N²) to O(N), enabling simulations with N = 10⁶ filament segments.

---

## The Fix

```python
import numpy as np
from scipy.spatial import KDTree

class VortexFilamentSimulator:
    """
    Vortex filament method with Rosenhead regularization and reconnection.
    """
    def __init__(self, delta=0.05, reconnect_threshold=None):
        self.delta = delta               # core radius (regularization)
        self.reconnect_eps = reconnect_threshold or 2*delta
        self.filaments = []             # list of (N_p, 3) position arrays
        self.circulations = []          # list of Γ scalars
    
    def add_ring(self, center, radius, normal, circulation, N_points=64):
        """Add a discretized vortex ring."""
        normal = normal / np.linalg.norm(normal)
        # Build orthonormal basis
        t1 = np.array([1,0,0]) if abs(normal[0]) < 0.9 else np.array([0,1,0])
        t1 = t1 - np.dot(t1, normal)*normal; t1 /= np.linalg.norm(t1)
        t2 = np.cross(normal, t1)
        
        theta = np.linspace(0, 2*np.pi, N_points, endpoint=False)
        points = (center + radius * (np.outer(np.cos(theta), t1) + 
                                      np.outer(np.sin(theta), t2)))
        self.filaments.append(points)
        self.circulations.append(circulation)
    
    def _biot_savart_segment(self, x, X_start, X_end, Gamma, delta):
        """Regularized Biot-Savart for one segment."""
        r1 = x - X_start
        r2 = x - X_end
        dl = X_end - X_start
        
        r1_sq = np.dot(r1, r1)
        r2_sq = np.dot(r2, r2)
        r1_eps = np.sqrt(r1_sq + delta**2)
        r2_eps = np.sqrt(r2_sq + delta**2)
        
        cross = np.cross(dl, r1)
        denom = np.dot(r1, r2) + r1_eps * r2_eps
        
        if abs(denom) < 1e-14 or np.dot(cross, cross) < 1e-14:
            return np.zeros(3)
        
        return (Gamma / (4*np.pi)) * cross * (1/r1_eps + 1/r2_eps) / denom
    
    def compute_velocity_at(self, x):
        """Compute total Biot-Savart velocity at position x."""
        v = np.zeros(3)
        for filament, Gamma in zip(self.filaments, self.circulations):
            N = len(filament)
            for j in range(N):
                v += self._biot_savart_segment(
                    x, filament[j], filament[(j+1)%N], Gamma, self.delta)
        return v
    
    def step(self, dt):
        """Advect all filament points by their Biot-Savart velocities."""
        new_filaments = []
        
        for fi, (filament, Gamma_i) in enumerate(zip(self.filaments, self.circulations)):
            N = len(filament)
            velocities = np.zeros((N, 3))
            
            for i in range(N):
                for fj, (other_fil, Gamma_j) in enumerate(zip(self.filaments, self.circulations)):
                    N2 = len(other_fil)
                    for j in range(N2):
                        if fi == fj and (j == i or j == (i-1)%N):
                            continue   # skip self adjacent (handled by regularization)
                        velocities[i] += self._biot_savart_segment(
                            filament[i], other_fil[j], other_fil[(j+1)%N2], 
                            Gamma_j, self.delta)
            
            new_filaments.append(filament + dt * velocities)
        
        self.filaments = new_filaments
        
        # Reconnection detection and surgery
        self._detect_and_reconnect()
        
        # Adaptive refinement
        self._refine()
    
    def _detect_and_reconnect(self):
        """Check all inter-filament pairs for reconnection events."""
        for i in range(len(self.filaments)):
            for j in range(i+1, len(self.filaments)):
                fi, fj = self.filaments[i], self.filaments[j]
                Ni, Nj = len(fi), len(fj)
                
                # Find closest pair of points
                tree_i = KDTree(fi)
                dists, idxs = tree_i.query(fj, k=1)
                min_j = np.argmin(dists)
                min_i = idxs[min_j]
                d_min = dists[min_j]
                
                if d_min < self.reconnect_eps:
                    # Reconnect: cut filament i at min_i and filament j at min_j
                    # Join i_start→min_i to j_start→min_j (one topology choice)
                    new_fil1 = np.concatenate([fi[:min_i+1], fj[min_j:], fj[:min_j+1]])
                    new_fil2 = np.concatenate([fi[min_i:], fi[:min_i+1]])
                    
                    # Replace filaments
                    self.filaments[i] = new_fil1
                    self.filaments[j] = new_fil2
                    print(f"  Reconnection: filaments {i} and {j} at distance {d_min:.4f}")
    
    def _refine(self, L_max=0.2, L_min=0.02):
        """Adaptive refinement: insert points where segments are too long."""
        new_filaments = []
        for filament in self.filaments:
            new_pts = []
            N = len(filament)
            for j in range(N):
                new_pts.append(filament[j])
                seg_len = np.linalg.norm(filament[(j+1)%N] - filament[j])
                if seg_len > L_max:
                    # Insert midpoint
                    mid = 0.5 * (filament[j] + filament[(j+1)%N])
                    new_pts.append(mid)
            new_filaments.append(np.array(new_pts))
        self.filaments = new_filaments

# Demo: two vortex rings (leap-frog)
sim = VortexFilamentSimulator(delta=0.04, reconnect_threshold=0.08)
sim.add_ring(center=np.array([0,0,0]), radius=1.0, 
             normal=np.array([0,0,1]), circulation=1.0, N_points=64)
sim.add_ring(center=np.array([0,0,0.5]), radius=1.02, 
             normal=np.array([0,0,1]), circulation=1.0, N_points=64)

for step in range(200):
    sim.step(dt=0.02)
    if step % 20 == 0:
        z_center_1 = np.mean(sim.filaments[0][:, 2])
        z_center_2 = np.mean(sim.filaments[1][:, 2])
        print(f"Step {step}: ring 1 z={z_center_1:.3f}, ring 2 z={z_center_2:.3f}")
```

The two rings leap-frog for multiple cycles without divergence. When their cores touch (distance < 0.08), the reconnection surgery fires, topology changes are logged, and the filaments continue as new configurations.

---

## The Wow Moment — Push It

Simulate the Crow instability: two parallel counter-rotating vortex rings (trailing wingtip vortices behind a large aircraft). The rings are initially straight lines (long filaments, not rings), separated by wingspan distance b = 10 m. The Crow instability grows sinusoidally along the vortex lines at a wavelength of about 8.6b, ultimately causing the two filaments to touch, reconnect in a series of vortex rings oriented at 45°, and then these rings collapse under their self-induction. This is the mechanism by which aircraft wake vortices dissipate. Show the full sequence: straight parallel filaments → growing symmetric waves → touchdown and reconnection → cascade of individual rings → turbulent breakup. Visualize in Three.js with glowing cyan filaments on a black sky background, tube mesh rendering with radius proportional to local circulation strength.

---

## The Interactive Demo

**Preset configurations:** Single ring | Leap-frog pair | Head-on collision | Trefoil knot | Linked rings | Crow instability | Custom  
**Ring parameters:** radius R (0.1 – 5.0), circulation Γ (−2 – 2), N_points (16 – 512)  
**Core radius δ:** 0.01 – 0.2 (regularization; smaller = more accurate, closer to singularity)  
**Reconnection threshold:** 0 (disabled) – 5δ; watch topology changes  
**Timestep dt:** 0.001 – 0.1  
**Time integrator:** Euler | RK2 | RK4  
**Biot-Savart acceleration:** O(N²) exact | Barnes-Hut tree (O(N log N))  
**Refinement:** none | adaptive (L_max slider)  
**Visualization:** filaments as lines | tube mesh (radius = Γ/Γ_max × R_tube) | velocity field slice | vorticity isosurface  
**Vorticity field:** compute induced velocity on a 32×32×32 grid; render with volume ray marching  
**Noise:** add Gaussian position noise to trigger Kelvin wave instabilities  
**Reconnection log:** show count, time, and location of all reconnection events  
**Export:** filament positions as JSON, velocity field as NPZ

---

## Production Notes

**Code to show:** The `_biot_savart_segment` function. Show the exact Biot-Savart formula for a finite segment. Highlight the Rosenhead regularization delta² term. Then show the `_detect_and_reconnect` function — specifically the KDTree query and the filament surgery.

**Visual layout:** Three.js 3D canvas (full screen) with rotating camera. Filaments rendered as glowing tube meshes. Side panel: total energy (kinetic energy of induced flow), enstrophy, number of filament points, and reconnection counter.

**Key cinematic moments:**
- 1:30 — "Biot-Savart made visceral": draw a single vortex line element dl with a spiral of arrows showing the induced velocity — righthand rule, decreasing as 1/r². "This is exactly the law for magnetic fields from a wire. Vorticity is the curl of velocity, just as B is the curl of A."  
- 4:00 — The singularity demo: run WITHOUT regularization (δ=0). Within 5 steps, the velocity blows up. Show the velocity magnitude time series: grows exponentially until overflow. Then add regularization (δ=0.04): smooth, stable, physically sensible.  
- 7:30 — Leap-frog slow motion: freeze-frame at the moment ring 1 passes through ring 2. Show the induced velocities: ring 2 (larger, slower) pulls ring 1 outward and speeds it up; ring 1 (inside ring 2) pulls ring 2 inward and slows it. "This is a perpetual motion machine for vortex rings — it never stops in inviscid flow."  
- 10:00 — Reconnection moment: slow the timestep to 0.001. As the two rings' cores touch, freeze the frame. Show the pre-reconnection topology (two separate rings). Perform the surgery in slow motion: cut, rejoin. Show the post-reconnection topology (one figure-eight ring). The change happens in one step — a discrete topology jump.  
- 13:30 — Crow instability: 45-second time-lapse of the full sequence, from straight parallel lines to reconnected ring cascade. "This is what happens behind every wide-body jet, 30,000 feet above your head."

---

## Tags
`vortex-filament` `Biot-Savart` `vortex-reconnection` `regularization` `fluid-simulation` `three-js` `Lagrangian` `computational-fluid-dynamics`

---

## Thumbnail

Two glowing cyan vortex rings in Three.js on a pure black background, caught at the moment of reconnection: their cores touching and the new topology forming (a figure-eight). Dramatic depth-of-field blur on distant parts of the rings. Bold white text: "When Vortex Rings Collide." Subtitle in smaller font: "Biot-Savart + Reconnection."
