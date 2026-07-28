---
title: "Cracks Without Criteria: Peridynamics"
id: A035
difficulty: 9/10
prereq: "None"
concept: "Peridynamic theory: non-local formulation of elasticity; each material point interacts with all points within a horizon δ; equation of motion ρü = ∫∫ f(u'-u, x'-x) dV' + b; damage by breaking bonds when strain exceeds threshold; crack path emerges naturally."
tags: [peridynamics, non-local, fracture, crack-propagation, horizon, bond-breaking, Python, computational-mechanics]
category: advanced
type: video-idea
---

# Cracks Without Criteria: Peridynamics

**Alt title:** "Why Classical Fracture Mechanics Needs a Hack (And How Peridynamics Eliminates It)"
**Difficulty:** 9/10 | **Prereq:** Continuum mechanics basics, Python/NumPy

---

## Opening Hook (0:00–1:00)

"Classical fracture mechanics needs a crack to exist before it can predict how that crack grows. You must specify the crack tip location, the crack orientation, the stress intensity factor, and a material-dependent fracture criterion — and then the theory tells you if the crack advances, and in which direction. But where does the crack start? Anywhere there's a defect. And in real materials, defects are everywhere — at grain boundaries, inclusions, voids. Predicting which defect grows into a crack, when, and how: classical fracture mechanics cannot answer this."

"In 2000, Stewart Silling at Sandia National Laboratories published peridynamic theory. It replaces the differential equation of continuum mechanics — which requires spatial derivatives and therefore breaks down at a crack — with an integral equation that is valid everywhere, including at cracks. Damage is modeled by breaking pairwise bonds between material points. The crack path, crack branching, crack arrest — all emerge naturally from the simulation without any additional criteria."

A peridynamic simulation appears: a pre-notched rectangular plate under tension. A crack initiates at the notch tip, propagates across the plate, then branches into two cracks. No crack tip tracking. No remeshing. "Just break bonds when they're stretched too far. Physics does the rest."

---

## The Naive Attempt

The naive approach: use classical FEM for a fracture problem. The problem is not that FEM gives wrong answers — it's that FEM requires explicit crack tracking and remeshing.

```python
import numpy as np

# Naive: try to simulate crack propagation with classical FEM
# The problem: FEM's spatial derivatives require smooth displacements
# A crack is a displacement discontinuity: u is multi-valued at the crack face
# Standard FEM cannot represent this without special techniques

# Classical linear elasticity: sigma = C : epsilon, div(sigma) = 0
# In terms of displacement: mu*nabla^2(u) + (lambda+mu)*grad(div(u)) = 0

# For a cracked body, the STRESS INTENSITY FACTOR K_I characterizes the crack
# K_I = sigma_inf * sqrt(pi * a) for a central crack of length 2a
# FEM near crack tip requires:
# 1. Very fine mesh at crack tip (mesh size h << K_I / sigma_yield)
# 2. Quarter-point (singular) elements to capture r^{-1/2} stress singularity
# 3. Re-meshing every time the crack advances

# Let's show why the stress field diverges at the crack tip

def stress_near_crack(K_I, r, theta):
    """
    Williams stress expansion near mode-I crack tip.
    sigma_xx, sigma_yy, sigma_xy as function of (r, theta).
    """
    k1_factor = K_I / np.sqrt(2 * np.pi * np.maximum(r, 1e-10))
    cos_h = np.cos(theta / 2)
    sin_h = np.sin(theta / 2)
    
    sigma_xx = k1_factor * cos_h * (1 - sin_h * np.sin(3*theta/2))
    sigma_yy = k1_factor * cos_h * (1 + sin_h * np.sin(3*theta/2))
    sigma_xy = k1_factor * cos_h * sin_h * np.cos(3*theta/2)
    return sigma_xx, sigma_yy, sigma_xy

K_I = 1.0  # stress intensity factor in MPa*sqrt(m)

# Mesh: 10x10 grid of nodes around crack tip at origin
r_values = np.logspace(-3, 0, 20)  # 0.001 to 1.0 meters from crack tip

theta = 0.0  # directly ahead of crack
sigma_ahead = [stress_near_crack(K_I, r, theta)[1] for r in r_values]

print("Stress ahead of crack tip (theta=0):")
for r, s in zip(r_values, sigma_ahead):
    print(f"  r = {r:.4f} m: sigma_yy = {s:.2f} MPa")

print(f"\nAt r=1e-6 m (1 micron): sigma_yy = {stress_near_crack(K_I,1e-6,0)[1]:.0f} MPa")
print(f"At r=1e-9 m (1 nm):    sigma_yy = {stress_near_crack(K_I,1e-9,0)[1]:.0f} MPa")
print(f"\nStress diverges as r → 0. FEM mesh MUST resolve this singularity.")
print(f"Required mesh size for 1% accuracy: h < K_I^2 / (100 * sigma_yield^2)")

sigma_yield = 500  # MPa
h_required = K_I**2 / (100 * sigma_yield**2)
print(f"With K_I=1 MPa*m^0.5, sigma_yield=500 MPa:")
print(f"  h_required = {h_required:.2e} m = {h_required*1e6:.2f} microns!")
print(f"\nThis tiny mesh must follow the crack as it propagates.")
print(f"Every crack advance step → remesh → interpolate solution → compute again.")
print(f"Branching: impossible without multiple crack trackers.")
print(f"Peridynamics: no mesh, no singularity, no crack tracking needed.")
```

---

## The Moment of Failure

Show a classical FEM simulation of a pre-notched plate. The mesh is fine near the notch tip. As the simulation progresses: the crack begins to advance. The FEM code must: (1) detect when K_I > K_Ic (the fracture criterion), (2) advance the crack by one element, (3) remesh the region around the new crack tip, (4) interpolate all state variables to the new mesh, (5) restart. At each crack advance: 5 steps, each introducing error.

"When the crack tries to branch: FEM has no way to track two crack tips simultaneously without special programming. The cohesive zone elements (if used) must be pre-placed on the suspected crack path. If the crack goes somewhere unexpected: the simulation fails. Every crack path must be anticipated."

The Griffith energy release rate G = K²_I/E appears on screen. "This is the fracture criterion. You put it in by hand. Peridynamics doesn't need it — damage emerges from the bond breaking rule."

---

## Why It Broke — The Physics

Classical continuum mechanics is based on partial differential equations involving spatial derivatives of the displacement field u:
$$\rho \ddot{u}_i = \partial_j \sigma_{ij} + b_i, \quad \sigma_{ij} = C_{ijkl} \varepsilon_{kl}, \quad \varepsilon_{ij} = \frac{1}{2}(\partial_j u_i + \partial_i u_j)$$

At a crack: u is discontinuous across the crack faces. Therefore ∂u/∂x does not exist (in the classical sense) at the crack. The PDE breaks down. Classical fracture mechanics handles this by: (1) accepting the singularity in σ ∝ r^{-1/2}, (2) characterizing the singularity via K_I, (3) using a separate criterion (K_I = K_Ic or G = G_c) to decide when the crack advances. This works for simple cases but requires a-priori knowledge of the crack path.

Peridynamics (Silling, 2000) reformulates the equation of motion using spatial integrals instead of derivatives:
$$\rho(x)\ddot{u}(x,t) = \int_{\mathcal{H}_x} f(u(x',t) - u(x,t),\, x'-x) \, dV_{x'} + b(x,t)$$

where ℋ_x = {x' : |x' - x| ≤ δ} is the "horizon" — a ball of radius δ around x. The pairwise force function f is the force per unit volume² that bond (x,x') exerts. This equation is valid everywhere — even at cracks — because it requires no spatial derivatives of u. A crack is simply a set of broken bonds.

---

## The One Concept

**Peridynamic theory** is a non-local reformulation of continuum mechanics where the equation of motion involves pairwise interactions between material points over a finite range δ (the horizon), rather than differential operators. By replacing spatial derivatives with integral operators, peridynamics removes the mathematical singularity at crack tips and allows crack initiation, propagation, branching, and arrest to emerge naturally from the model without any external criteria.

**Bond-based peridynamics: the simplest model.** Each pair of material points (x, x') within horizon δ interacts via a pairwise bond. The bond is characterized by:
- **Reference separation**: ξ = x' - x
- **Current extension**: η = u(x') - u(x)
- **Bond stretch**: s = (|ξ + η| - |ξ|) / |ξ|
- **Bond force**: f = c·s·(ξ+η)/|ξ+η| (micromodulus c for linear elastic material)

The micromodulus c is related to the Young's modulus E and horizon δ by:
$$c = \frac{18E}{\pi \delta^4}$$
in 3D (bond-based, with fixed Poisson ratio ν = 1/3 — a limitation of bond-based PD).

**Damage model.** Bond (x,x') breaks irreversibly when its stretch exceeds the critical value s₀:
$$s_0 = \sqrt{\frac{5G_c}{9\mu\delta}}$$
where G_c is the fracture energy (critical energy release rate) and μ is the shear modulus. A local damage measure:
$$\phi(x,t) = 1 - \frac{\int_{\mathcal{H}_x} \mu(x,x',t) \, dV_{x'}}{\int_{\mathcal{H}_x} dV_{x'}}$$
where μ(x,x',t) = 1 if bond (x,x') is intact, 0 if broken. When φ = 0: fully intact. When φ = 1: fully damaged. The local damage field gives a continuous representation of the crack — no crack tracking needed.

**State-based peridynamics.** Bond-based PD is limited to ν = 1/3 (3D) or ν = 1/4 (2D). Ordinary state-based peridynamics (OSB-PD) generalizes to arbitrary ν by using "force states" T[x]⟨ξ⟩ — a functional of all bonds in the horizon — rather than pairwise forces. The force on particle x from all neighbors:
$$\rho\ddot{u}(x,t) = \int_{\mathcal{H}_x} \{T[x,t]\langle x'-x\rangle - T[x',t]\langle x-x'\rangle\} \, dV_{x'}$$

The constitutive model is defined via the strain energy density W[x] — a functional of the deformation states. This gives the full generality of classical continuum mechanics with any material model (linear, nonlinear, anisotropic, viscous) and arbitrary Poisson ratio.

**Discretization: meshfree particle approach.** Discretize the body as a set of particles (nodes) at positions {x_k} with volumes {V_k}. Replace the integral with a sum:
$$\rho_k \ddot{u}_k = \sum_{x_j \in \mathcal{H}_{x_k}} f(u_j - u_k, x_j - x_k) \cdot V_j + b_k$$

This is an explicit, particle-based ODE system — integrate with velocity Verlet or explicit Runge-Kutta. Each particle k interacts only with neighbors within radius δ (typically δ = 3·Δx, where Δx is the particle spacing). Time step constraint: dt ≤ 0.8 · Δx / c_s (CFL-like condition). No mesh, no connectivity, no remeshing — add or remove particles freely.

**Convergence and horizon effects.** Two convergence limits: (1) δ-convergence: fix the ratio m = δ/Δx, let Δx→0 → approaches the classical continuum solution (no damage). (2) m-convergence: fix Δx, vary m → as m→∞ (more neighbors), also approaches continuum. For fracture: m = 3 (i.e., δ = 3Δx) balances accuracy and efficiency. The horizon δ is a material length scale — it controls the width of the damage zone. For metals, δ ~ 1-10 μm (grain scale). For ceramics: δ ~ 0.1-1 mm.

**Surface correction.** Particles near the free surface have truncated horizons (fewer neighbors). Their effective stiffness is lower, leading to surface softening errors. The standard correction: multiply the micromodulus c by a surface correction factor g_k = (∫_ℋ dV) / (∫_{ℋ∩Ω} dV) — the ratio of full-sphere to actual intersection volume. This compensates the missing neighbors.

---

## The Fix

Implement 2D bond-based peridynamics for a pre-notched plate under tension.

```python
import numpy as np

# 2D Bond-based Peridynamics: pre-notched plate under tension
# Plate: 1.0 x 1.0 m, pre-notch from left edge to center
# Loading: displacement boundary condition (tension in y-direction)

# Material properties
E = 200e9     # Pa (steel)
nu = 1.0/3.0  # bond-based PD is restricted to nu=1/3
rho = 7800.0  # kg/m^3
G_c = 1000.0  # J/m^2 (fracture energy)

# Discretization
Nx, Ny = 50, 50
Lx, Ly = 1.0, 1.0
dx = Lx / Nx
dy = Ly / Ny
delta = 3.01 * dx  # horizon radius (3 particle spacings)

# Micromodulus c (2D plane stress)
# c = 9*E / (pi * delta^3 * h) for unit thickness h=dx
c_micro = 9 * E / (np.pi * delta**3 * dx)

# Critical stretch s0 from fracture energy
mu = E / (2 * (1 + nu))
s0 = np.sqrt(5 * G_c / (9 * mu * delta))  # 2D formula
print(f"Peridynamic parameters:")
print(f"  Horizon delta = {delta:.4f} m = {delta/dx:.1f} dx")
print(f"  Micromodulus c = {c_micro:.3e} Pa/m^3")
print(f"  Critical stretch s0 = {s0:.4f}")

# Initialize particle positions
x_pts, y_pts = np.meshgrid(np.linspace(dx/2, Lx-dx/2, Nx),
                             np.linspace(dy/2, Ly-dy/2, Ny))
x_pts = x_pts.ravel(); y_pts = y_pts.ravel()
N_pts = len(x_pts)
V_pts = np.ones(N_pts) * dx * dy  # particle volume

# Pre-notch: remove bonds crossing x=0.5, y<0.5 (horizontal notch on left)
notch_x_end = 0.5   # notch goes from x=0 to x=0.5
notch_y_pos = 0.5   # notch at mid-height

# Displacement fields
u = np.zeros((N_pts, 2))  # displacement [ux, uy]
v = np.zeros((N_pts, 2))  # velocity
a = np.zeros((N_pts, 2))  # acceleration

# Find neighbor pairs within horizon (precompute for efficiency)
print("Building neighbor list...")
neighbors = [[] for _ in range(N_pts)]
bond_intact = {}

for i in range(N_pts):
    for j in range(i+1, N_pts):
        xi_x = x_pts[j] - x_pts[i]
        xi_y = y_pts[j] - y_pts[i]
        xi_mag = np.sqrt(xi_x**2 + xi_y**2)
        
        if xi_mag <= delta + 1e-10:
            # Check if this bond crosses the pre-notch
            crosses_notch = False
            # Notch: horizontal line from x=0 to x=notch_x_end at y=notch_y_pos
            if abs(y_pts[i] - notch_y_pos) < dy/2 or abs(y_pts[j] - notch_y_pos) < dy/2:
                xi_mid = (x_pts[i] + x_pts[j]) / 2
                yi_min = min(y_pts[i], y_pts[j])
                yi_max = max(y_pts[i], y_pts[j])
                if (xi_mid < notch_x_end and
                    yi_min < notch_y_pos < yi_max):
                    crosses_notch = True
            
            neighbors[i].append(j)
            neighbors[j].append(i)
            bond_intact[(min(i,j), max(i,j))] = not crosses_notch

print(f"Total particles: {N_pts}, pre-notch bonds broken: "
      f"{sum(1 for v in bond_intact.values() if not v)}")

def peridynamic_force(u, x_pts, y_pts, neighbors, bond_intact, c_micro, s0, V_pts):
    """Compute peridynamic body force on all particles."""
    force = np.zeros((N_pts, 2))
    
    for i in range(N_pts):
        for j in neighbors[i]:
            bond_key = (min(i,j), max(i,j))
            if not bond_intact.get(bond_key, True):
                continue  # pre-broken bond
            
            # Reference bond vector
            xi_x = x_pts[j] - x_pts[i]
            xi_y = y_pts[j] - y_pts[i]
            xi_mag = np.sqrt(xi_x**2 + xi_y**2)
            
            # Deformed bond vector
            eta_x = (u[j,0] - u[i,0]) + xi_x
            eta_y = (u[j,1] - u[i,1]) + xi_y
            eta_mag = np.sqrt(eta_x**2 + eta_y**2)
            
            # Bond stretch
            s = (eta_mag - xi_mag) / xi_mag
            
            # Check for bond failure
            if abs(s) > s0:
                bond_intact[bond_key] = False
                continue
            
            # Force magnitude: f = c * s * V_j
            f_mag = c_micro * s * V_pts[j]
            e_x = eta_x / eta_mag; e_y = eta_y / eta_mag
            
            force[i, 0] += f_mag * e_x
            force[i, 1] += f_mag * e_y
    
    return force

# Time integration
dt = 0.5 * dx / np.sqrt(E / rho)  # stability estimate
n_steps = 500
v_load = 0.001  # loading velocity (m/s)

# Boundary condition: top/bottom rows loaded in y-direction
top_mask = y_pts > Ly - 1.5 * dy
bottom_mask = y_pts < 1.5 * dy

print(f"\nRunning PD simulation for {n_steps} steps (dt = {dt:.2e} s)...")
for step in range(n_steps):
    # Compute peridynamic forces
    F = peridynamic_force(u, x_pts, y_pts, neighbors, bond_intact, c_micro, s0, V_pts)
    
    # Velocity Verlet
    v += 0.5 * dt * F / rho
    u += dt * v
    
    # Apply displacement BCs: move top up, bottom down
    u[top_mask, 1] = v_load * (step + 1) * dt
    u[bottom_mask, 1] = -v_load * (step + 1) * dt
    v[top_mask, :] = 0; v[bottom_mask, :] = 0
    
    F_new = peridynamic_force(u, x_pts, y_pts, neighbors, bond_intact, c_micro, s0, V_pts)
    v += 0.5 * dt * F_new / rho
    v[top_mask, :] = 0; v[bottom_mask, :] = 0
    
    if step % 100 == 0:
        n_broken = sum(1 for val in bond_intact.values() if not val)
        phi_max = max(
            1 - sum(bond_intact.get((min(i,j),max(i,j)), True)
                    for j in neighbors[i]) / max(len(neighbors[i]),1)
            for i in range(N_pts)
        )
        print(f"  Step {step}: bonds broken = {n_broken}, max damage phi = {phi_max:.3f}")
```

---

## The Wow Moment — Push It

Run the pre-notched plate simulation to failure. Show three distinct phases: (1) elastic loading — the plate stretches uniformly, bonds intact, stress builds at notch tip, (2) crack initiation — bonds at the notch tip start breaking; a damage zone appears (φ > 0), (3) crack propagation — damage zone advances across the plate; the crack follows the path of highest stretch energy. At a certain velocity, the crack branches into two symmetric cracks — a spontaneous branching event. "No branching criterion was programmed. The bonds broke where the stress field dictated. Physics self-organized."

Show the damage field φ(x) as a color map evolving over time. The crack appears as a white band (φ=1) growing through the red-orange domain (partially damaged, φ=0.3–0.8) into the blue domain (intact, φ=0).

Then: comparison with the classical LEFM prediction for the crack tip position vs. time. Show that peridynamics correctly predicts the Rayleigh wave speed limit for crack velocity — a result derived from continuum mechanics that PD reproduces automatically.

---

## The Interactive Demo

- **Pre-notch geometry**: horizontal center notch, vertical side notch, angled notch (45°)
- **Loading type**: tension (y-direction), shear, biaxial
- **Material**: brittle (low G_c, fast crack) vs. ductile (high G_c, slow crack)
- **Horizon ratio m = δ/dx**: slider 2–5 (show surface effect at small m)
- **Particle spacing dx**: slider (resolution study)
- **Damage visualization**: color map φ(x), bond visualization (color by stretch), vector field
- **Crack path tracing**: automatically extract crack path from damage field
- **Energy tracking**: stored elastic energy + fracture energy + kinetic energy (should sum to work done by BCs)
- **Comparison mode**: show classical FEM (pre-placed crack elements) vs. PD (crack emerges naturally)

---

## Production Notes

**Code structure**: `peridynamics_core.py` — particle initialization, neighbor list, force computation, bond breaking. `pd_bc.py` — displacement and velocity boundary conditions. `pd_damage.py` — damage field computation, crack path extraction. `pd_viz.py` — Matplotlib animation of displacement field, damage map, bond visualization.

**Visual layout**: Primary: 2D color map of local damage φ(x) — blue (intact) through red (partially damaged) to white (broken). Bonds drawn as thin lines colored by stretch (green=compressed, yellow=moderate, red=near critical). Secondary: time series plot of: (1) peak damage φ_max vs. time, (2) applied force vs. displacement (loading curve showing elastic, softening, fracture).

**Key cinematic moments**: (1) The crack nucleation: zoom in on the notch tip as the first bonds break. Show them one by one — each bond going from green to red to disappearing. "Bond order-of-magnitude 10,000, and the first few to break are right here at the tip." (2) Crack branching: slow-motion frames of the single crack becoming two. The damage field visibly splits. No algorithm made this choice — it fell out of the physics. (3) The constitutive simplicity: show the entire force law in 5 lines of code. "This is the heart of peridynamics: if stretch > s0, break. That's it. Everything else is physics." (4) Comparison with LEFM: overlay the peridynamic crack tip position vs. time with the classical prediction r(t) = v_crack · t. They match — proving the theory is consistent with classical mechanics.

**Equations on screen**: PD equation of motion ρü = ∫f(η,ξ)dV'+b, bond stretch s=(|ξ+η|-|ξ|)/|ξ|, micromodulus c, critical stretch s₀, damage φ.

---

## Tags
`peridynamics` `non-local` `fracture` `crack-propagation` `horizon` `bond-breaking` `Python` `computational-mechanics`

---

## Thumbnail

Dark background. A rectangular plate with a visible crack propagating from a notch on the left — the crack is rendered as a color gradient (blue→red→white) showing the damage field. At the crack tip: individual bond connections shown as colored lines, some red (near critical), some white (just broken). The crack is branching into two paths. Bold white text: "NO CRACK CRITERION. NO REMESHING. JUST BONDS." Bottom: "Peridynamics — Fracture Without Classical Mechanics."
