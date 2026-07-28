---
title: "Snow, Lava, and Mud in One Simulation (Material Point Method)"
id: A001
difficulty: 8/10
prereq: "None"
concept: "MPM: hybrid Lagrangian-Eulerian; particles carry mass, velocity, deformation gradient; transfer quantities to/from background grid (P2G and G2P); grid computes forces and integrates velocity; constitutive models determine material behavior (elastic, plastic, granular)."
tags: [MPM, material-point-method, Lagrangian-Eulerian, deformation-gradient, constitutive-model, snow-simulation, WebGL, computational-mechanics]
category: advanced
type: video-idea
---

# Snow, Lava, and Mud in One Simulation (Material Point Method)

**Alt title:** One Simulation Framework to Rule All Materials  
**Difficulty:** 8/10 | **Prereq:** None (familiarity with basic Lagrangian and Eulerian fluid concepts helpful)

---

## Opening Hook (0:00–1:00)

Open on three side-by-side slow-motion clips: Disney's Frozen avalanche, a lava flow oozing down Kilauea, and a mudslide burying a hillside road. Freeze all three. Voice over: "Snow, lava, and mud — three completely different materials. Yet all three were simulated with the exact same algorithm. One data structure. One physics loop. And it was first published in 1994 by Sulsky, Chen, and Schreyer — almost nobody noticed. Until it started showing up in every VFX blockbuster on the planet. Today we're going to build it from scratch, break it, fix it, and by the end of this video you will simulate all three of those materials in your browser."

Cut to the final demo: a snowball shatters against a wall, its fragments pile up in a heap with realistic compaction and glittering WebGL shading. Then the same simulation, same code, swap four lines — now it's a viscoplastic lava flow coiling on itself. Swap four more lines — cohesive mud slumps and craters. Three materials. One simulator. Bugs are the curriculum.

---

## The Naive Attempt

The instinct is to treat this like smoothed particle hydrodynamics (SPH). Every piece of material is a particle that carries mass, velocity, and internal stress. You compute pairwise forces between particles, integrate Newton's second law, move the particles. Here is the naive Python approach:

```python
import numpy as np

N = 1000
pos = np.random.rand(N, 2) * 0.5 + 0.25   # particles in unit box
vel = np.zeros((N, 2))
mass = np.ones(N) * 0.001
dt = 1e-3
h = 0.05  # smoothing radius

def cubic_kernel(r, h):
    q = r / h
    if q < 1: return (2/3 - q**2 + 0.5*q**3) * 6 / (np.pi * h**2)
    elif q < 2: return (2 - q)**3 / (6 * np.pi * h**2)
    return 0.0

for step in range(500):
    forces = np.zeros((N, 2))
    # O(N^2) pairwise stress computation
    for i in range(N):
        for j in range(N):
            if i == j: continue
            r_vec = pos[i] - pos[j]
            r = np.linalg.norm(r_vec)
            if r < 2 * h and r > 1e-10:
                # naive repulsion: stand-in for pressure
                pressure = 1.0 / (r + 1e-5)
                forces[i] += pressure * r_vec / r * mass[j]
    vel += forces / mass[:, None] * dt
    pos += vel * dt
```

This is O(N²) per step, which is disqualifying for N > 5000. But more fatally: there is no way to encode a deformation gradient here. SPH tracks density changes but has no notion of how the material has *deformed* from its reference configuration. A snowflake's crystal bonds break at a specific strain threshold. Without a deformation gradient F = ∂x/∂X, you cannot define elasticity, plasticity yield surfaces, or fracture. You are flying blind.

---

## The Moment of Failure

Run the naive SPH code with 2000 particles meant to be a snowball hitting a wall. What appears on screen: the "snowball" splashes like water. It forms a thin spreading film on the floor. There is no elastic rebound — because there is no elasticity. There is no pile-up — because there is no yield stress. There is no crust forming on impact — because there is no deformation history. The particles just scatter like ideal gas molecules and gently drift to the bottom corner. Meanwhile, the simulation is already at 0.2 FPS, barely crawling, even in Numba JIT. The wall does not even properly stop the particles: some tunnel through at the first timestep because there is no collision geometry on the grid. You have simulated grey mist, not snow.

---

## Why It Broke — The Physics

Snow is a *continuum* with internal state. The failure has three root causes.

**1. No deformation gradient:** Elasticity requires knowing how much the material has stretched from its rest shape. This is the deformation gradient tensor F:

F = ∂x/∂X

where X is the reference (Lagrangian) coordinate and x is the current (Eulerian) position. F ∈ ℝ^(3×3) and its determinant J = det(F) gives the volume ratio. SPH can approximate volume (via density) but not the full anisotropic stretch of the continuum.

**2. No grid to resolve contact:** Two snowball halves cannot know they occupy the same cell without a background grid. SPH's pairwise neighbor search misses thin-shell geometry.

**3. No constitutive model:** The relationship between strain and stress — the constitutive law — determines whether material behaves elastically (snow before yield), plastically (snow after yield — permanent deformation), or as a viscoplastic flow (lava). SPH implementations use pressure-density laws that only work for nearly incompressible fluids. Snow is not a fluid; it is a rate-independent elasto-plastic solid with a specific yield criterion (Drucker-Prager or a modified cam-clay model).

The governing equation for a continuum is:
ρ a = ∇ · σ + ρ g

where ρ is density, a is acceleration, σ is the Cauchy stress tensor, and g is gravity. To evaluate ∇ · σ on moving particles without a mesh is the fundamental difficulty. MPM's answer: borrow a grid momentarily, do the differentiation there, then throw the grid away.

---

## The One Concept

**The Material Point Method (MPM): Hybrid Lagrangian-Eulerian simulation.**

MPM lives at the intersection of two classical approaches. Lagrangian methods (like FEM with moving mesh) track material particles and are excellent for history-dependent quantities — deformation gradient, plastic strain, internal damage — but struggle when material deforms so much that the mesh tangles. Eulerian methods (like finite-difference fluid solvers) use a fixed grid and are excellent at computing spatial derivatives, but advecting sharp material interfaces smears them out. MPM takes the best of both.

**The four MPM substeps in one timestep:**

*Step 1 — Particle to Grid (P2G):* Each particle p carries mass m_p, velocity v_p, deformation gradient F_p, and affine velocity field matrix C_p (in the APIC variant). The particle scatters these quantities to nearby grid nodes i via a weight function w_{ip} derived from cubic B-spline basis functions:

m_i = Σ_p w_{ip} m_p  
(m v)_i = Σ_p w_{ip} m_p (v_p + C_p (x_i - x_p))

The weight function w_{ip} = N(x_i - x_p) where N is the tensor product of 1D B-spline basis functions. On a grid of spacing Δx, the B-spline support is 2Δx, touching at most 4^d = 64 nodes in 3D — sparse and local.

*Step 2 — Grid force computation and velocity update:* On the grid, compute elastic forces from the deformation gradient via the Cauchy stress:

f_i = -Σ_p V_p^0 (∂Ψ/∂F_p) F_p^T ∇w_{ip}

where V_p^0 is the particle's reference-configuration volume and Ψ is the strain energy density. For a Neo-Hookean elastic solid:

Ψ(F) = μ/2 (tr(F^T F) - d) - μ ln(J) + λ/2 (ln J)²

The grid velocity is then integrated explicitly:

v_i^{n+1} = v_i^n + dt (f_i + m_i g) / m_i

Boundary conditions (sticky, slip, separate) are enforced on the grid at this step — trivially, because the grid is fixed.

*Step 3 — Return mapping (plasticity):* Before the next grid-to-particle step, apply the plastic return mapping to each particle's trial elastic deformation gradient. For snow, Stomakhin et al. (2013) use a modified Drucker-Prager yield criterion with two thresholds: critical compression θ_c (snow compacts) and critical stretch θ_s (snow fractures). The singular value decomposition F = U Σ V^T is taken, the singular values Σ are clamped to [1 - θ_c, 1 + θ_s], and the elastic part is set to F_E = U clamp(Σ) V^T with the remaining deformation stored in the plastic part F_P.

*Step 4 — Grid to Particle (G2P):* Each particle gathers velocity from the grid:

v_p^{n+1} = Σ_i w_{ip} v_i^{n+1}  (PIC component)

and updates its affine velocity matrix (APIC):

C_p = (4/Δx²) Σ_i w_{ip} v_i^{n+1} (x_i - x_p)^T

Particles then advect: x_p += dt v_p. The deformation gradient is updated:

F_p^{n+1} = (I + dt Σ_i v_i ∇w_{ip}^T) F_p^n

**Why the three materials are different only in constitutive law:**

- **Snow:** Neo-Hookean elasticity (Young's modulus E ≈ 1.4 MPa, Poisson ν ≈ 0.2) with Drucker-Prager yield and hardening exponent h ≈ 10.
- **Lava (viscoplastic):** Herschel-Bulkley fluid — yield stress τ_y plus a power-law flow; implemented by modifying the return mapping to relax the stress to the yield surface at a rate proportional to the viscosity.
- **Mud:** Drucker-Prager with a very low friction angle and cohesion; the pressure-dependent yield surface means it squeezes out sideways under its own weight.

Four lines of code — the constitutive model function — change the material completely. The rest of the MPM loop is identical.

**APIC vs PIC vs FLIP:** The naive Particle-In-Cell (PIC) transfers are heavily dissipative; FLIP is nearly energy-conserving but noisy. Affine Particle-In-Cell (APIC) by Jiang et al. (2015) adds an affine component to the velocity field carried by each particle, eliminating numerical dissipation without adding noise. APIC is the de facto standard for MPM simulations.

---

## The Fix

Replace the SPH loop with a full MPM loop in Python/NumPy, vectorized:

```python
import numpy as np
import taichi as ti   # Taichi for GPU-parallel MPM

ti.init(arch=ti.gpu)

# Grid parameters
grid_res = 128
dx = 1.0 / grid_res
inv_dx = grid_res
dt = 2e-4
p_vol = (dx * 0.5) ** 2
p_rho = 1.0
p_mass = p_vol * p_rho
E, nu = 5e3, 0.2                          # Young's modulus, Poisson
mu_0 = E / (2 * (1 + nu))
lambda_0 = E * nu / ((1 + nu) * (1 - 2 * nu))

# Particle fields
n_particles = 9000
x = ti.Vector.field(2, dtype=float, shape=n_particles)   # position
v = ti.Vector.field(2, dtype=float, shape=n_particles)   # velocity
C = ti.Matrix.field(2, 2, dtype=float, shape=n_particles) # affine vel matrix
F = ti.Matrix.field(2, 2, dtype=float, shape=n_particles) # deformation gradient
Jp = ti.field(dtype=float, shape=n_particles)             # plastic deformation

# Grid fields
grid_v = ti.Vector.field(2, dtype=float, shape=(grid_res, grid_res))
grid_m = ti.field(dtype=float, shape=(grid_res, grid_res))

@ti.func
def clamp_singular_values(F_in, theta_c=2.5e-2, theta_s=7.5e-3):
    """Snow constitutive model: return mapping via SVD clamping."""
    U, sig, V = ti.svd(F_in)
    sig_clamped = ti.Matrix([[0.0, 0.0], [0.0, 0.0]])
    for d in ti.static(range(2)):
        sig_clamped[d, d] = ti.max(1 - theta_c, ti.min(1 + theta_s, sig[d, d]))
    return U, sig_clamped, V

@ti.kernel
def substep():
    # --- P2G ---
    for p in x:
        Xp = x[p] * inv_dx
        base = int(Xp - 0.5)
        fx = Xp - base
        # Quadratic B-spline weights
        w = [0.5 * (1.5 - fx) ** 2,
             0.75 - (fx - 1) ** 2,
             0.5 * (fx - 0.5) ** 2]
        # Kirchhoff stress (Neo-Hookean)
        mu = mu_0 * ti.exp(10 * (1 - Jp[p]))   # hardening
        lam = lambda_0 * ti.exp(10 * (1 - Jp[p]))
        J_det = F[p].determinant()
        F_T = F[p].transpose()
        stress = 2 * mu * (F[p] - (F_T.inverse()).transpose()) + lam * (J_det - 1) * J_det * (F_T.inverse()).transpose()
        stress = (-dt * p_vol * 4 * inv_dx * inv_dx) * stress
        affine = stress + p_mass * C[p]
        for i, j in ti.static(ti.ndrange(3, 3)):
            offset = ti.Vector([i, j])
            dpos = (offset.cast(float) - fx) * dx
            weight = w[i][0] * w[j][1]
            grid_v[base + offset] += weight * (p_mass * v[p] + affine @ dpos)
            grid_m[base + offset] += weight * p_mass

    # --- Grid update ---
    for i, j in grid_m:
        if grid_m[i, j] > 0:
            grid_v[i, j] /= grid_m[i, j]
            grid_v[i, j][1] -= dt * 9.8   # gravity
            # Boundary conditions: sticky bottom wall
            if i < 3 and grid_v[i, j][0] < 0: grid_v[i, j][0] = 0
            if i > grid_res - 3 and grid_v[i, j][0] > 0: grid_v[i, j][0] = 0
            if j < 3 and grid_v[i, j][1] < 0: grid_v[i, j][1] = 0
            if j > grid_res - 3 and grid_v[i, j][1] > 0: grid_v[i, j][1] = 0

    # --- G2P ---
    for p in x:
        Xp = x[p] * inv_dx
        base = int(Xp - 0.5)
        fx = Xp - base
        w = [0.5 * (1.5 - fx) ** 2,
             0.75 - (fx - 1) ** 2,
             0.5 * (fx - 0.5) ** 2]
        new_v = ti.Vector.zero(float, 2)
        new_C = ti.Matrix.zero(float, 2, 2)
        for i, j in ti.static(ti.ndrange(3, 3)):
            offset = ti.Vector([i, j])
            dpos = (offset.cast(float) - fx) * dx
            weight = w[i][0] * w[j][1]
            g_v = grid_v[base + offset]
            new_v += weight * g_v
            new_C += 4 * inv_dx * weight * g_v.outer_product(dpos)
        v[p] = new_v
        x[p] += dt * v[p]
        C[p] = new_C
        # Update deformation gradient + snow return mapping
        F_new = (ti.Matrix.identity(float, 2) + dt * new_C) @ F[p]
        U, sig, V = clamp_singular_values(F_new)
        # Plastic part tracked in Jp (determinant of plastic F)
        Jp[p] = (sig[0, 0] * sig[1, 1]) * Jp[p] / F_new.determinant()
        F[p] = U @ sig @ V.transpose()
```

To switch to lava: replace the `stress` computation with a viscoplastic stress that uses a Herschel-Bulkley yield criterion — two lines. To switch to mud: replace the clamp thresholds in `clamp_singular_values` with pressure-dependent Drucker-Prager values. The MPM loop does not change.

---

## The Wow Moment — Push It

After the basic snowball demo, increase particles to 40,000. Drop three snowballs of different temperatures (hardening exponent controls effective stiffness): one cold and brittle (fractures on impact), one warm and ductile (mushrooms), one wet and cohesive (sticks to wall). Watch all three simultaneously in the same simulation window — one MPM grid, three constitutive behaviors. Then, live on camera, hot-swap the constitutive model for one snowball mid-simulation by modifying the Jp threshold — watch a solid snowball start liquefying in real time as the yield surface drops. Then trigger a slope failure: stack wet mud on a 45-degree incline, nudge it with a rigid projectile, and watch a full debris flow avalanche cascade down, spreading across the floor with a realistic run-out distance. The WebGL visualization renders each particle as a Gaussian splat with density-mapped coloring — dense = white (snow), hot = orange-red (lava), saturated = dark brown (mud).

---

## The Interactive Demo

The live demo runs in the browser via WebAssembly + Three.js, compiled from Taichi WASM or a JavaScript port.

**Material selector (radio):** Snow | Lava | Mud | Custom  
**Young's modulus E:** slider 1e2 – 1e6 Pa (log scale); default 5000 Pa for snow  
**Poisson ratio ν:** slider 0.01 – 0.49; default 0.2  
**Yield compression θ_c:** slider 0 – 0.1; default 0.025  
**Yield stretch θ_s:** slider 0 – 0.1; default 0.0075  
**Hardening coefficient h:** slider 0 – 20; default 10  
**Viscosity (lava only):** slider 0.001 – 10 Pa·s  
**Gravity g:** slider 0 – 20 m/s²; default 9.8  
**Particle count:** 1000 | 5000 | 20000 | 40000  
**Spawn shape:** Ball | Column | Layer | Custom brush (draw with mouse)  
**Wall angle:** slider 0° – 90° (incline for slope failure)  
**Rigid body:** toggle box / cylinder that can be dragged with mouse into the simulation  
**Grid resolution:** 64 | 128 | 256  
**Visualization mode:** particles (color = speed) | density field | deformation magnitude | stress magnitude | plastic strain  
**Play / Pause / Reset / Export .gif**  
**Slow-motion:** 1x | 0.5x | 0.1x

---

## Production Notes

**Code structure:** Three Python files — `mpm_core.py` (Taichi kernels), `constitutive.py` (material models), `visualizer.py` (Three.js WebSocket bridge). Show `constitutive.py` side by side for snow vs lava to emphasize the 4-line change.

**Visual layout:** Split screen: left = Taichi code in VS Code with syntax highlighting; right = Three.js canvas at 1440×900. Timeline scrubber underneath shows step count.

**Key cinematic moments:**
- 0:45 — Overlay the deformation gradient F as a small ellipse on each particle, showing how it stretches and rotates in real time.  
- 3:20 — Freeze-frame the P2G step: draw arrows from each particle to nearby grid nodes, magnitude proportional to weight. Show grid velocity field as vector field overlay.  
- 5:10 — Zoom in on a single particle during the SVD return mapping. Display the 2×2 matrix F, then the clamped singular values, then F_E. Animate the matrix entries numerically.  
- 8:30 — Show a side-by-side of the same timestep in PIC vs APIC vs FLIP — PIC's diffusion, FLIP's noise, APIC's clean result.  
- 11:00 — The lava coil: slow-motion of a viscoplastic strand folding on itself, like a Newtonian fluid but with yield stress keeping the edges sharp.

**Music:** Ambient electronic, 90 BPM, drone-heavy — builds tension during "the failure" section, resolves to a warm chord when the snowball simulation finally works.

**Code to show on screen:**
1. The naive SPH loop in full, color-coded for the three failure points.  
2. The Taichi kernel for P2G — highlight the B-spline weight computation.  
3. The `clamp_singular_values` function for snow — highlight the mathematical equivalence to the return mapping.  
4. The two-line difference between snow and lava constitutive models.

---

## Tags
`MPM` `material-point-method` `Lagrangian-Eulerian` `deformation-gradient` `constitutive-model` `snow-simulation` `WebGL` `computational-mechanics`

---

## Thumbnail

Split image: left half shows a photorealistic CGI snowball mid-shatter, particles glowing white against black background; right half shows the same frame as the Taichi code on a dark terminal. Red diagonal text across the center: "ONE SIMULATION". Bottom bar in white: "Snow. Lava. Mud." No borders.
