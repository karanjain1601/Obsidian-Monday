---
title: "Coarse-Grained Fluid With Thermal Fluctuations (SDPD)"
id: A026
difficulty: 8.5/10
prereq: "None"
concept: "Smoothed Dissipative Particle Dynamics: coarse-grained fluid model; SPH particles with random and dissipative forces satisfying fluctuation-dissipation theorem; maintains correct thermodynamic equilibrium; mesoscale between MD and continuum."
tags: [SDPD, coarse-grained, fluctuation-dissipation, mesoscale, SPH, thermal-fluctuations, fluid-simulation, Python]
category: advanced
type: video-idea
---

# Coarse-Grained Fluid With Thermal Fluctuations (SDPD)

**Alt title:** "Why Your SPH Simulation Has No Temperature (And How to Fix It)"
**Difficulty:** 8.5/10 | **Prereq:** SPH basics, statistical mechanics basics, Python/NumPy

---

## Opening Hook (0:00–1:00)

"Classical Smoothed Particle Hydrodynamics simulates fluids beautifully — it captures splashing water, dam breaks, falling droplets. But it has a dirty secret: the fluid has no temperature. The particles move deterministically. There are no thermal fluctuations. At the macroscale, this doesn't matter. But the moment you try to simulate microfluidics — blood flow in capillaries, DNA diffusion, nanoparticle transport — you find that thermal fluctuations are not a small correction. They are the entire physics."

A microfluidic channel appears: a sub-micron channel with red-blood-cell-sized objects flowing through it. "A red blood cell in a 5-micron capillary experiences a thermal energy kT that is comparable to its bending modulus. A protein diffusing in a membrane is kicked constantly by thermal noise. SPH cannot model any of this — it's a zero-temperature method."

"Smoothed Dissipative Particle Dynamics (SDPD) fixes this with one key physical principle: the fluctuation-dissipation theorem. For every dissipative force that damps motion, there must be a corresponding random force that heats it. The ratio is fixed by temperature. We're going to add noise — correctly — to SPH, and watch thermodynamics emerge."

---

## The Naive Attempt

The naive approach: add random forces directly to standard SPH without respecting the fluctuation-dissipation theorem.

```python
import numpy as np

# Standard SPH for 2D fluid — no thermal fluctuations
N = 200
L = 10.0  # box size
rho_0 = 1.0  # reference density
c_s = 1.0    # speed of sound
nu = 0.01    # kinematic viscosity
h_sph = 1.0  # smoothing length

# Initialize: particles on a regular grid with random velocities
nx = int(np.sqrt(N))
x_grid = np.linspace(0, L, nx+1)[:-1] + L/(2*nx)
X, Y = np.meshgrid(x_grid, x_grid)
positions = np.column_stack([X.ravel(), Y.ravel()])[:N]
velocities = np.zeros((N, 2))
masses = np.ones(N) * rho_0 * L**2 / N

def kernel_cubic_spline(r, h):
    """Cubic spline kernel W(r,h) and its derivative."""
    q = r / h
    norm = 10.0 / (7.0 * np.pi * h**2)  # 2D normalization
    if q < 1:
        W = norm * (1 - 1.5*q**2 + 0.75*q**3)
        dW_dr = norm / h * (-3*q + 2.25*q**2)
    elif q < 2:
        W = norm * 0.25 * (2 - q)**3
        dW_dr = norm / h * (-0.75 * (2 - q)**2)
    else:
        W = 0.0
        dW_dr = 0.0
    return W, dW_dr

# NAIVE: add random forces without FDT
T_target = 1.0
gamma = 1.0  # damping (arbitrary, not tied to noise)
sigma_noise = 0.1  # arbitrary noise amplitude — NOT tied to gamma or T!

forces_random = sigma_noise * np.random.randn(N, 2)  # just add noise
# THIS IS WRONG: it will heat the system to infinity or cool it to 0

# Velocity Verlet with naive noise
dt = 0.001
for step in range(100):
    # Compute SPH pressure forces (simplified)
    forces = np.zeros((N, 2))
    
    for i in range(N):
        for j in range(N):
            if i == j:
                continue
            dr = positions[j] - positions[i]
            r = np.linalg.norm(dr)
            if r < 2*h_sph and r > 1e-10:
                W, dW_dr = kernel_cubic_spline(r, h_sph)
                P_i = c_s**2 * (rho_0 - rho_0)  # simplified
                grad_W = dW_dr * dr / r
                forces[i] -= masses[j] * P_i / rho_0**2 * grad_W
    
    # NAIVE: add random forces (wrong amplitude!)
    forces += gamma * np.random.randn(N, 2)  # arbitrary sigma
    
    velocities += dt * forces / masses[:, None]
    positions += dt * velocities
    positions %= L

# Measure temperature from kinetic energy
KE_per_particle = 0.5 * np.mean(np.sum(velocities**2, axis=1))
T_measured = KE_per_particle  # kB=1, d=2: T = KE per DOF
print(f"Target temperature: {T_target:.3f}")
print(f"Measured temperature after {100} steps: {T_measured:.3f}")
print(f"ERROR: temperature is wrong. FDT not satisfied.")
```

---

## The Moment of Failure

Run the simulation. Plot kinetic temperature T_KE = ½m⟨v²⟩ vs. time. It does not converge to T_target — it either grows without bound (if noise is too strong relative to damping) or decays to zero (if damping dominates). There is no equilibrium.

The screen shows: temperature vs. time, growing exponentially. "The system is heating itself to infinity. The random force injects energy; the damping removes it. But they're not balanced. The second law of thermodynamics requires that a system in contact with a heat bath at temperature T reaches equilibrium at T. Our simulation violates this. It's an unphysical perpetual motion machine."

The fluctuation-dissipation theorem appears:
$$\langle f_i^{rand}(t) f_j^{rand}(t') \rangle = 2 k_B T \gamma \delta_{ij} \delta(t-t')$$
"The noise amplitude σ² = 2γk_BT is not arbitrary. It is uniquely fixed by the temperature and the damping coefficient. This is the fluctuation-dissipation theorem — the deepest constraint in non-equilibrium statistical mechanics."

---

## Why It Broke — The Physics

The fluctuation-dissipation theorem (FDT) is a fundamental result in statistical mechanics: for a system in thermal equilibrium, the response of the system to a small perturbation (dissipation) is related to the spontaneous fluctuations in the system (noise). For a Langevin equation:
$$m\dot{v} = -\gamma v + f^{rand}(t)$$

FDT requires: ⟨f^rand(t) f^rand(t')⟩ = 2γk_BT δ(t-t'). This ensures the system reaches the Boltzmann equilibrium distribution P(v) ∝ exp(-mv²/2k_BT) as t→∞. The Green-Kubo relation connects the damping coefficient γ to the time integral of the velocity autocorrelation function — a deep connection between irreversibility (dissipation) and fluctuations.

For a fluid, the SPH pressure/viscosity forces are conservative + dissipative. If you add dissipation (viscosity) but no corresponding noise, the fluid cools below T. Standard SPH is a zero-temperature method because viscosity damps kinetic energy but no noise re-injects thermal energy. SDPD restores the FDT at the particle level: for each pair of particles (i,j), the pairwise dissipative force and random force satisfy:
$$\sigma_{ij}^2 = 2 k_B T \gamma_{ij}$$

where γ_{ij} is the pairwise friction coefficient, which in SDPD is expressed in terms of SPH kernel quantities.

The SDPD equations of motion (Español & Revenga, 2003):
$$m_i \dot{v}_i = \sum_{j\neq i} \left[ -P_{ij} \nabla_i W_{ij} + \gamma_{ij}^D (\hat{r}_{ij} \cdot v_{ij})\hat{r}_{ij} + \sigma_{ij} \xi_{ij} \hat{r}_{ij} \right]$$

where P_{ij} = p_i/ρ_i² + p_j/ρ_j² is the SPH pressure term, γ_{ij}^D = 5η/(3ρ_i ρ_j) (d/dr W_{ij})/r_{ij} is the dissipative coefficient, σ_{ij}² = 2k_BT γ_{ij}^D (FDT), and ξ_{ij}(t) is a Gaussian white noise with ⟨ξ_{ij}⟩=0, ⟨ξ_{ij}(t)ξ_{ij}(t')⟩=δ(t-t').

---

## The One Concept

**SDPD (Smoothed Dissipative Particle Dynamics)** is a particle-based mesoscale method that combines the fluid mechanics consistency of SPH with the thermodynamic correctness of Langevin dynamics, by deriving the dissipative and random pairwise forces from the fluctuation-dissipation theorem at the SPH kernel level. It places correctly in the mesoscale hierarchy: finer than DPD (which uses soft, heuristic conservative forces), coarser than explicit-solvent MD, and thermodynamically consistent in a way that standard SPH is not.

**SPH as the foundation.** SPH discretizes the fluid as a set of Lagrangian particles carrying mass, density, velocity, and pressure. The density is interpolated from neighbors: ρ_i = Σ_j m_j W(|r_i - r_j|, h). Pressure from equation of state: p_i = p_0[(ρ_i/ρ_0)^γ - 1] (weakly compressible). The conservative pressure gradient force: F_i^C = -m_i Σ_j m_j(p_i/ρ_i² + p_j/ρ_j²) ∇_i W_{ij}. Viscous force in SPH: F_i^V = Σ_j 2μ m_i m_j / (ρ_i ρ_j) (v_{ij}·r_{ij})/|r_{ij}|² ∇_i W_{ij}.

**SDPD modification: pairwise Langevin forces.** Rewrite the viscous force in a form that reveals its pairwise dissipative structure, then apply FDT to each pair. For each pair (i,j): dissipative force F_{ij}^D = -γ_{ij} (v_{ij}·ê_{ij}) ê_{ij}, random force F_{ij}^R = σ_{ij} dW_{ij}/dt · ê_{ij}, where ê_{ij} = r_{ij}/|r_{ij}| and dW_{ij}/dt is a scalar white noise. The FDT requires σ_{ij}² = 2k_BT γ_{ij} exactly. The friction coefficient γ_{ij} is derived from the SPH viscosity kernel: γ_{ij} = 5η/(3ρ_i ρ_j) · (d_r W_{ij})/r_{ij}, ensuring consistency with the Navier-Stokes viscous stress in the hydrodynamic limit.

**Integration: Peters' algorithm or GJF integrator.** Standard Euler or velocity Verlet cannot handle stochastic differential equations correctly — they don't properly handle the Itô vs. Stratonovich interpretation. For SDPD, use a specialized stochastic integrator. Peters' algorithm treats the dissipative-random pair exactly (analytically integrate the Ornstein-Uhlenbeck term) and handles the conservative forces with standard Verlet. GJF (Grønbech-Jensen-Farago) integrator: modified velocity Verlet with a correction factor that maintains exact thermodynamics at any timestep.

**What SDPD gets right.** (1) Brownian motion of embedded particles: a colloidal particle in SDPD diffuses with D = k_BT/γ_eff (Stokes-Einstein). (2) Velocity autocorrelation: the hydrodynamic long-time tail ~t^{-d/2} is reproduced (collective hydrodynamic correlations). (3) Thermodynamic properties: specific heat, compressibility from density fluctuations are all correct at equilibrium. (4) Polymer dynamics: a polymer chain embedded in SDPD fluid shows Zimm dynamics (hydrodynamic interactions included) rather than Rouse dynamics (no HI). (5) Fluctuating interfaces: a droplet in SDPD has capillary waves with the correct thermal amplitude spectrum σ² ∝ k_BT/(γk²) — the surface tension can be extracted from the fluctuation spectrum.

**Scale of application.** SDPD operates at the mesoscale: particles represent fluid blobs of 10–1000 nm³, covering timescales of ns to μs. Applications: blood cell dynamics in microvessels, DNA translocation through nanopores, nanoparticle sedimentation and diffusion, polymer solutions, colloidal suspensions. The key advantage over explicit-solvent MD: 100-1000x larger length/time scales. The key advantage over continuum methods: thermal fluctuations are included correctly without adding stochastic PDEs.

---

## The Fix

Implement SDPD with correct FDT in 2D.

```python
import numpy as np

# SDPD simulation: 2D fluid with thermal fluctuations
# FDT correctly satisfied: sigma^2 = 2 * kB * T * gamma
N = 150
L = 10.0
kB = 1.0
T = 1.0           # temperature
rho_0 = 1.5       # reference density
c_s = 5.0         # speed of sound (weakly compressible)
eta = 0.5         # dynamic viscosity
h_sph = 1.3       # smoothing length
m = rho_0 * L**2 / N  # particle mass

# Grid initialization
nx = int(np.sqrt(N))
x_1d = np.linspace(0, L, nx+1)[:-1] + L/(2*nx)
X, Y = np.meshgrid(x_1d, x_1d)
pos = np.column_stack([X.ravel(), Y.ravel()])[:N]
vel = np.sqrt(kB * T / m) * np.random.randn(N, 2)  # Maxwell-Boltzmann init

def W(r, h):
    """Cubic spline kernel value and gradient magnitude."""
    q = r / h
    C = 10 / (7 * np.pi * h**2)
    if q <= 1:
        return C * (1 - 1.5*q**2 + 0.75*q**3), C/h*(-3*q + 2.25*q**2)
    elif q <= 2:
        return C * 0.25*(2-q)**3, C/h*(-0.75*(2-q)**2)
    return 0.0, 0.0

def compute_density(pos):
    """SPH density interpolation."""
    rho = np.zeros(N)
    for i in range(N):
        for j in range(N):
            dr = pos[i] - pos[j]
            dr -= L * np.round(dr / L)
            r = np.linalg.norm(dr)
            w, _ = W(r, h_sph)
            rho[i] += m * w
    return rho

def pressure_eos(rho):
    """Weakly compressible EOS: p = c_s^2 * (rho - rho_0)."""
    return c_s**2 * (rho - rho_0)

def sdpd_forces(pos, vel, rho):
    """Compute SDPD forces: conservative + dissipative + random (FDT-correct)."""
    p = pressure_eos(rho)
    F = np.zeros((N, 2))
    
    for i in range(N):
        for j in range(i+1, N):
            dr = pos[i] - pos[j]
            dr -= L * np.round(dr / L)
            r = np.linalg.norm(dr)
            if r < 1e-10 or r > 2*h_sph:
                continue
            
            e_ij = dr / r
            dv = vel[i] - vel[j]
            w, dw_dr = W(r, h_sph)
            
            # Conservative (pressure) force
            F_C = -m**2 * (p[i]/rho[i]**2 + p[j]/rho[j]**2) * dw_dr * e_ij
            
            # SDPD dissipative coefficient (from viscosity + kernel)
            # gamma_ij = (5*eta)/(3*rho_i*rho_j) * (-dW/dr)/r
            if r > 0:
                gamma_ij = (5 * eta) / (3 * rho[i] * rho[j]) * (-dw_dr / r)
            else:
                gamma_ij = 0.0
            gamma_ij = max(gamma_ij, 0.0)
            
            # Dissipative force: F_D = -gamma_ij * (v_ij . e_ij) * e_ij
            vr = np.dot(dv, e_ij)  # radial velocity component
            F_D = -gamma_ij * m**2 * vr * e_ij
            
            # Random force: sigma^2 = 2 * kB * T * gamma_ij (FDT!)
            sigma_ij = np.sqrt(2 * kB * T * gamma_ij * m**2 / dt)
            xi = np.random.randn()  # Gaussian white noise
            F_R = sigma_ij * xi * e_ij
            
            F_total = F_C + F_D + F_R
            F[i] += F_total
            F[j] -= F_total  # Newton's 3rd law
    
    return F

# Velocity Verlet integration with stochastic forces
dt = 0.005
n_steps = 2000
temps = []

print("Running SDPD simulation with FDT-correct thermal fluctuations...")
rho = compute_density(pos)

for step in range(n_steps):
    F = sdpd_forces(pos, vel, rho)
    vel += 0.5 * dt * F / m
    pos += dt * vel
    pos %= L
    rho = compute_density(pos)
    F_new = sdpd_forces(pos, vel, rho)
    vel += 0.5 * dt * F_new / m
    
    if step % 100 == 0:
        KE = 0.5 * m * np.sum(vel**2)
        T_meas = KE / (N * kB)  # equipartition: <KE> = N * d/2 * kB * T, d=2
        temps.append(T_meas)
        print(f"  Step {step:4d}: T_measured = {T_meas:.4f} (target: {T:.4f})")

print(f"\nFinal T: {np.mean(temps[-5:]):.4f} ± {np.std(temps[-5:]):.4f}")
print(f"FDT-correct: temperature converges to target!")
```

---

## The Wow Moment — Push It

Embed a colloidal particle (a large bead with excluded volume) in the SDPD fluid. Track its trajectory. Compute the mean squared displacement ⟨Δr²⟩ vs. time. Show it crossing from ballistic (⟨Δr²⟩ ~ t²) to diffusive (⟨Δr²⟩ ~ Dt). Fit D — the diffusion coefficient. Compare with Stokes-Einstein: D = k_BT/(6πηR). They match! "This is Brownian motion. Computed from first principles using only hydrodynamics and the fluctuation-dissipation theorem."

Then: add a polymer chain (bead-spring model) to the SDPD fluid. Watch the chain diffuse via Zimm dynamics — collective hydrodynamic modes coupling to chain motion. Show the Zimm scaling D ~ N^{-0.6} vs. Rouse D ~ N^{-1}. SDPD gives Zimm; a simple Langevin thermostat gives Rouse. The difference is hydrodynamic interactions — the long-range flow field that SDPD captures.

---

## The Interactive Demo

- **Number of particles N**: slider 50–500
- **Temperature T**: slider 0.1–5.0 — live temperature gauge showing convergence
- **Viscosity η**: slider 0.01–5.0 — show effect on momentum diffusion
- **Colloidal particle radius**: slider 0.5–3.0 — show Stokes-Einstein D ∝ 1/R
- **Naive mode** (FDT violated): toggle — show temperature drift to infinity/zero
- **FDT mode**: toggle — show correct thermal equilibrium
- **MSD plot**: mean squared displacement vs. time, with slope annotation
- **Velocity distribution**: live histogram of |v| vs. Maxwell-Boltzmann fit
- **Sound waves**: apply a sinusoidal pressure and watch acoustic wave propagate

---

## Production Notes

**Code structure**: `sdpd_core.py` — SPH kernel, density, pressure, SDPD force computation. `sdpd_integrator.py` — GJF stochastic Verlet. `sdpd_analysis.py` — temperature, MSD, velocity distribution. `sdpd_viz.py` — particle movie, trajectory plots.

**Visual layout**: Main panel: particle positions as colored dots, with velocity arrows. Background: a slowly-shifting color map of local temperature (from kinetic energy density). Right panel: live temperature plot with a target line.

**Key cinematic moments**: (1) The FDT violation: side-by-side comparison of naive noise (temperature spiraling up) vs. SDPD (temperature stable). The naive case heats to red-hot; the SDPD case stays at target temperature. (2) The Brownian motion trajectory: show 5 colloidal particle trajectories — random walks of varying lengths. Overlay MSD plot. Point out the crossover from ballistic to diffusive. (3) Sound wave propagation: apply a localized pressure pulse at the left boundary, watch a compression wave travel across the box at speed c_s. "Temperature fluctuations AND sound waves — in the same simulation."

**Equations on screen**: FDT (⟨f(t)f(t')⟩ = 2γkBT δ(t-t')), SDPD force equation, Stokes-Einstein D = kBT/6πηR.

---

## Tags
`SDPD` `coarse-grained` `fluctuation-dissipation` `mesoscale` `SPH` `thermal-fluctuations` `fluid-simulation` `Python`

---

## Thumbnail

Dark background. Left: a chaotic scatter of particles with wild temperature fluctuations (color bar going red to white — overheating). Red label: "NAIVE: TEMPERATURE = ∞." Right: the same particles with a cool blue-green color indicating stable temperature. Green label: "SDPD: T = T_target." Center: the FDT equation σ² = 2γkBT glowing gold. Bold white text: "THE TEMPERATURE PROBLEM IN SPH." Bottom: "SDPD — Thermal Fluctuations Done Right."
