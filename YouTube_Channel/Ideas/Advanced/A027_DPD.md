---
title: "Polymer and Membrane Simulation at Mesoscale (DPD)"
id: A027
difficulty: 8.5/10
prereq: "None"
concept: "Dissipative Particle Dynamics: each DPD particle represents a fluid blob; soft conservative force + dissipative force + random force (FDT); correct hydrodynamics at diffusive time scales; models polymer solutions, amphiphiles, membranes."
tags: [DPD, dissipative-particle-dynamics, mesoscale, polymer, membrane, fluctuation-dissipation, Python, soft-matter]
category: advanced
type: video-idea
---

# Polymer and Membrane Simulation at Mesoscale (DPD)

**Alt title:** "Simulating a Cell Membrane: Why DPD Beats MD by a Million Timesteps"
**Difficulty:** 8.5/10 | **Prereq:** Statistical mechanics basics, Python/NumPy

---

## Opening Hook (0:00–1:00)

"A cell membrane is 7 nanometers thick and 10 micrometers wide. That's a 1000:1 aspect ratio. At atomistic resolution, simulating 1 microsecond of this membrane requires ~10^9 atoms and ~10^12 force evaluations. This would take years on the world's largest supercomputer."

A DPD simulation appears: soft, bead-like particles self-assembling into a bilayer membrane in real time. The membrane forms within seconds of simulation time. Lipid headgroups (blue) are hydrophilic, tails (red) are hydrophobic. They spontaneously organize into a double layer. "This simulation took 20 minutes on a laptop. The secret is that each bead represents not one atom — but 3 to 5 water molecules, or half a lipid tail. The physics of atomic vibrations doesn't matter for membrane dynamics. Only the mesoscale structure does."

"Dissipative Particle Dynamics: soft particles, soft forces, correct hydrodynamics, thermal fluctuations. The mesoscale method of choice for soft matter."

---

## The Naive Attempt

Naive approach: model each bead as a hard sphere (Lennard-Jones), which is the natural atomistic intuition.

```python
import numpy as np

# Naive attempt: use Lennard-Jones (LJ) for mesoscale beads
# Problem: LJ requires dt ~ 10^-15 s (femtoseconds) even for beads
# DPD soft potential allows dt ~ 10^-12 s (picoseconds) -- 1000x speedup

N = 200
L = 10.0
rho = N / L**2
T = 1.0
kB = 1.0

# LJ parameters for "bead" — they seem physical but force tiny timestep
eps_LJ = 1.0   # energy scale
sigma_LJ = 1.0  # size scale
r_cut = 2.5 * sigma_LJ

# Initialize
pos = np.random.uniform(0, L, (N, 2))
vel = np.sqrt(kB * T) * np.random.randn(N, 2)
m = 1.0

def lj_force_energy(pos):
    """Lennard-Jones forces."""
    F = np.zeros((N, 2))
    E = 0.0
    for i in range(N):
        for j in range(i+1, N):
            dr = pos[i] - pos[j]
            dr -= L * np.round(dr / L)
            r = np.linalg.norm(dr)
            if r < r_cut and r > 0.01:
                sr6 = (sigma_LJ / r)**6
                f_mag = 24 * eps_LJ / r**2 * (2*sr6**2 - sr6)
                f = f_mag * dr
                F[i] += f
                F[j] -= f
                E += 4*eps_LJ*(sr6**2 - sr6)
    return F, E

# What timestep is safe for LJ?
# r_min ~ 2^(1/6) * sigma ~ 1.12 sigma
# Max force at r_min: F_max = 24*eps/sigma^2 * 13 ~ 312 eps/sigma^2
# Stability: dt < sqrt(m*sigma^2/(F_max*sigma)) ~ sqrt(m/F_max/sigma)
dt_stable_LJ = np.sqrt(m * sigma_LJ / (312 * eps_LJ / sigma_LJ))
print(f"LJ stable timestep: {dt_stable_LJ:.4f} (in reduced units)")
print(f"For polymer with m=10 amu, sigma=4 Ang, eps=0.1 kcal/mol:")
print(f"  dt_max ~ {dt_stable_LJ * 0.021:.4f} ps -- forced to use sub-ps timestep")
print(f"\nTo simulate 1 microsecond: {int(1e6 / (dt_stable_LJ * 0.021)):,} steps")
print(f"With 200 beads: {200**2 // 2 * int(1e6 / (dt_stable_LJ * 0.021)):,} force evaluations")
print(f"\nDPD soft potential allows dt ~ 100x larger. 100x fewer steps.")
```

The hard sphere / LJ approach imposes a tiny timestep constraint because the steep repulsive wall creates enormous forces at close range. The maximum force diverges as r→0, meaning any overlap of particles requires an infinitesimally small timestep to resolve.

---

## The Moment of Failure

Run the LJ simulation for 1000 steps with dt=0.02. Plot the energy conservation. The simulation explodes: two particles overlap, the force becomes enormous, and velocities diverge in a single step. Energy spikes to +∞. "Even with a small timestep, occasional close encounters destabilize the simulation. For mesoscale beads representing fluid blobs, hard-core repulsion is physically wrong — beads overlap in coarse-grained models! The LJ potential is simply the wrong functional form for mesoscale simulations."

The physical argument: in a coarse-grained model, the "bead" represents a volume of fluid. Two such volumes can interpenetrate (the constituent molecules interleave). The interaction should be soft — a finite energy at zero separation, not infinite. The DPD conservative potential is:
$$F_{ij}^C = a_{ij}(1 - r_{ij}/r_c)\hat{r}_{ij} \quad \text{for } r_{ij} < r_c, \text{ else } 0$$
"This is a linearly decreasing repulsion that goes to zero at r=r_c. Finite at r=0. Particles can overlap. Timestep can be 10–100× larger."

---

## Why It Broke — The Physics

DPD (Hoogerbrugge & Koelman 1992, Español & Warren 1995) is a mesoscale method where each particle represents a fluid blob. The forces are pairwise and consist of three components, all acting along the line joining particle centers:

1. **Conservative force**: F_{ij}^C = a_{ij} w^C(r_{ij}) ê_{ij}, where w^C(r) = (1-r/r_c) for r < r_c, else 0. The amplitude a_{ij} encodes the free energy of mixing between species i and j (related to Flory-Huggins χ parameter).

2. **Dissipative (drag) force**: F_{ij}^D = -γ [w^D(r_{ij})]² (ê_{ij}·v_{ij}) ê_{ij}. Drag between approaching/receding particles. Represents momentum transfer from unresolved (sub-bead) degrees of freedom.

3. **Random force**: F_{ij}^R = σ w^R(r_{ij}) ξ_{ij}(t) ê_{ij}. Thermal noise. Español-Warren FDT condition:
$$[w^D(r)]^2 = [w^R(r)]^2, \quad \sigma^2 = 2\gamma k_B T$$

Standard choice: w^D(r) = w^R(r) = (1-r/r_c). This weight function ensures forces vanish at r_c (smooth cutoff) and are strongest at close range.

The DPD equations of motion conserve momentum (forces are pairwise, equal and opposite) → correct hydrodynamics emerges. The Navier-Stokes equations are recovered in the continuum limit. The equation of state for a monodisperse DPD fluid:
$$p = \rho k_B T + \alpha a \rho^2 r_c, \quad \alpha \approx 0.101$$

This determines how the DPD amplitude a relates to physical compressibility.

---

## The One Concept

**Dissipative Particle Dynamics (DPD)** is a coarse-grained particle simulation method designed for mesoscale soft matter, where each particle represents a fluid blob interacting via soft, short-ranged forces that satisfy the fluctuation-dissipation theorem. Unlike MD (where forces are derived from an atomistic potential), DPD forces are phenomenological constructions that guarantee correct hydrodynamics and thermodynamics at the mesoscale.

**Parameterization: connecting DPD to physics.** The amplitude a_{ij} controls the mixing free energy between species. For hydrophobic interactions: a_{oil-water} >> a_{oil-oil} ≈ a_{water-water}. From Flory-Huggins theory: a_{ij} - a_{ii} = χ_{ij} k_BT / (ρ r_c³), where χ is the Flory parameter. For water-oil at room temperature: χ ≈ 2–3, giving a_{ij} ≈ 78 k_BT/r_c. For DPD at ρ=3: a_{ii} ≈ 25 k_BT/r_c (from compressibility matching to water).

**Lipid bilayer self-assembly.** Model lipids as A₁B₄ molecules: one hydrophilic head bead (A) bonded to four hydrophobic tail beads (B). Solvent: W (water) beads. Parameters: a_{WW} = a_{AA} = a_{BB} = 25, a_{WB} = 80 (hydrophobic), a_{WA} = 15 (hydrophilic), a_{AB} = 80. Harmonic spring between bonded beads: V_bond = k(r - r₀)²/2. Starting from a random mixture of lipids and water: within 1000 DPD timesteps, the lipids spontaneously assemble into a bilayer. The bilayer is stable, fluctuates thermally, and can be bent or stretched. The bending modulus κ ≈ 20 k_BT — close to the experimental value for DPPC.

**DPD polymer dynamics.** Connect beads with springs: V = k(r-r₀)². A chain of N=20 beads is a model polymer. In DPD solvent: the polymer diffuses with D ~ N^{-0.6} (Zimm dynamics — hydrodynamic interactions from the fluid) rather than D ~ N^{-1} (Rouse). The DPD fluid acts as an explicit hydrodynamic medium — one of the key advantages over implicit solvent Langevin dynamics. The radius of gyration Rg ~ N^{0.6} (good solvent, ν=0.6 for 3D self-avoiding walk) emerges from choosing a_{polymer-solvent} slightly above a_{polymer-polymer}.

**DPD vs. related methods.** DPD has soft, short-ranged forces and correct hydrodynamics, but a heuristic equation of state and parameterization. SDPD (A026) derives the dissipative and random forces consistently from SPH — a thermodynamically more rigorous but slightly more expensive approach. Multiparticle Collision Dynamics (MPCD / SRD) uses a grid-based collision rule for momentum redistribution — exact hydrodynamics, simpler to implement. Lattice Boltzmann Method uses a mesoscopic kinetic equation on a grid — correct hydrodynamics, easily parallelized, no thermal fluctuations in simplest form. DPD is the most widely used for polymers and membranes because parameterization is intuitive and implementation is simple.

**Modified DPD with angle potentials: membranes.** Real cell membranes are fluid (lipids can diffuse laterally) but resist bending (κ ≈ 10–30 k_BT). Model: add an angle potential V_angle = k_θ(θ - θ₀)² to penalize chain bending. With lipids A₁B₄ and k_θ = 10, the membrane self-assembles and develops the correct bending rigidity. Shape fluctuations of a membrane patch in DPD show the Helfrich spectrum: ⟨|h_k|²⟩ = k_BT/(κk⁴A) — Fourier modes of the membrane height fluctuation. Fitting this spectrum gives κ directly.

---

## The Fix

Implement DPD from scratch with correct FDT.

```python
import numpy as np

# DPD simulation: 3D fluid with amphiphile (A1B4 lipid) self-assembly
N_water = 400      # W beads
N_lipid = 40       # A1B4 lipids = 40 * 5 = 200 beads
N_total = N_water + N_lipid * 5
L = 8.0
rho_target = N_total / L**3   # DPD density ~ 3
T = 1.0
kB = 1.0
gamma = 4.5        # DPD friction
sigma_dpd = np.sqrt(2 * gamma * kB * T)  # FDT: sigma^2 = 2*gamma*kB*T
r_c = 1.0          # cutoff radius
m = 1.0
dt = 0.04          # DPD allows large timestep!

# DPD amplitudes a_ij (in kB*T / r_c)
a = {
    ('W', 'W'): 25.0, ('A', 'A'): 25.0, ('B', 'B'): 25.0,
    ('W', 'A'): 15.0, ('W', 'B'): 80.0, ('A', 'B'): 80.0,
}
def get_a(type_i, type_j):
    key = (min(type_i, type_j), max(type_i, type_j))
    return a.get(key, a.get((type_j, type_i), 25.0))

# Initialize positions and types
types = ['W'] * N_water
for _ in range(N_lipid):
    types += ['A'] + ['B', 'B', 'B', 'B']

pos = np.random.uniform(0, L, (N_total, 3))
vel = np.sqrt(kB * T / m) * np.random.randn(N_total, 3)
# Remove CM velocity
vel -= vel.mean(axis=0)

# Bonds: each lipid A-B-B-B-B
bonds = []
start = N_water
for _ in range(N_lipid):
    for b in range(4):
        bonds.append((start + b, start + b + 1))
    start += 5
k_bond = 100.0
r0 = 0.5  # equilibrium bond length

def dpd_forces(pos, vel, types, bonds):
    """Compute all DPD forces (conservative + dissipative + random)."""
    F = np.zeros_like(pos)
    
    for i in range(N_total):
        for j in range(i+1, N_total):
            dr = pos[i] - pos[j]
            dr -= L * np.round(dr / L)
            r = np.linalg.norm(dr)
            if r >= r_c or r < 1e-10:
                continue
            
            e_ij = dr / r
            w = 1 - r / r_c
            
            # Conservative force
            a_ij = get_a(types[i], types[j])
            F_C = a_ij * w * e_ij
            
            # Dissipative force
            v_ij = vel[i] - vel[j]
            v_r = np.dot(v_ij, e_ij)
            F_D = -gamma * w**2 * v_r * e_ij
            
            # Random force (FDT-correct)
            xi = np.random.randn()
            F_R = sigma_dpd * w * xi / np.sqrt(dt) * e_ij
            
            F_total = F_C + F_D + F_R
            F[i] += F_total
            F[j] -= F_total
    
    # Bond forces (harmonic springs between bonded beads)
    for (bi, bj) in bonds:
        dr = pos[bi] - pos[bj]
        dr -= L * np.round(dr / L)
        r = np.linalg.norm(dr)
        F_bond = -k_bond * (r - r0) * dr / r
        F[bi] += F_bond
        F[bj] -= F_bond
    
    return F

# Velocity Verlet (modified for DPD — Peters' scheme for stability)
print("Running DPD lipid self-assembly simulation...")
for step in range(500):
    F = dpd_forces(pos, vel, types, bonds)
    vel += 0.5 * dt * F / m
    pos += dt * vel
    pos %= L
    F_new = dpd_forces(pos, vel, types, bonds)
    vel += 0.5 * dt * F_new / m
    
    if step % 100 == 0:
        # Check bilayer formation: compute orientational order
        lipid_pos = pos[N_water:].reshape(N_lipid, 5, 3)
        head_pos = lipid_pos[:, 0, :]  # A bead positions
        tail_end = lipid_pos[:, 4, :]  # last B bead
        # Simple order parameter: z-component of A->B vector
        z_orient = np.mean(np.abs(tail_end[:, 2] - head_pos[:, 2]))
        KE = 0.5 * m * np.sum(vel**2)
        T_meas = KE / (N_total * 3 * kB / 2)
        print(f"  Step {step}: T = {T_meas:.3f}, lipid z-stretch = {z_orient:.3f}")

print("\nDPD self-assembly complete! Inspect visualization for bilayer.")
```

---

## The Wow Moment — Push It

Run for 5000 steps and show the bilayer formation movie: starting from a random mixture of lipid and water beads, watch the bilayers assemble spontaneously. The hydrophobic tails (red) cluster together, shielded from water by the hydrophilic heads (blue). Time-lapse: 0→100→500→2000→5000 steps.

Then: poke the membrane. Apply a localized force to a small patch of the membrane — watch a perturbation propagate as a capillary wave across the membrane surface. Measure the dispersion relation ω vs. k: it follows ω ~ k² (bending waves) at long wavelengths — the Helfrich elastic wave. Extract the bending modulus κ. "This is membrane mechanics — the physics of how cell membranes respond to mechanical deformation — simulated from first principles."

---

## The Interactive Demo

- **Lipid architecture**: A₁B₄ (standard), A₁B₈ (long tail), A₂B₄ (two heads — detergent), A₁B₂A₁ (ABA block copolymer vesicle former)
- **Water-oil amplitude a_{WB}**: slider 25–100 (below ~40: no bilayer; above ~80: gel phase)
- **Temperature**: slider 0.5–3.0 (membrane melting transition visible)
- **Number of lipids**: slider 20–200
- **Spring constant k_bond**: slider 10–500 (floppy vs. rigid chains)
- **External force**: click to apply force at a point — watch membrane deform
- **Visualization**: bead type coloring, membrane cross-section, density profile n(z)
- **Timescale**: slider for animation speed
- **Order parameter S**: display lipid tail orientational order S = ½⟨3cos²θ-1⟩

---

## Production Notes

**Code structure**: `dpd_core.py` — force computation, velocity Verlet. `dpd_molecules.py` — lipid topology (bonds, angles), water initialization. `dpd_analysis.py` — density profiles, bilayer thickness, bending modulus from fluctuation spectrum. `dpd_viz.py` — three.js 3D bead visualization.

**Visual layout**: Primary: 3D visualization (three.js) of beads as colored spheres: water transparent/blue, head beads as solid blue spheres, tail beads as red. Camera orbiting slowly. Secondary (inset): density profile n_head(z) and n_tail(z) vs. z — showing the bilayer sandwich structure.

**Key cinematic moments**: (1) Self-assembly timelapse: start with a homogeneous random mixture. Watch it spontaneously organize into a bilayer. Freeze at t=100, t=500, t=2000 steps. Add timestamps. (2) The bending wave: apply a sinusoidal displacement to the membrane. Show the wave propagating in slow motion. Overlay the dispersion curve ω(k). (3) FDT comparison: show what happens if σ is wrong — the membrane either explodes (too much noise) or crystallizes (too little). (4) Lipid architecture comparison: side-by-side A₁B₄ (bilayer) vs. A₁B₂A₁ (vesicle). Show both self-assembling into completely different structures from the same simulation.

**Equations on screen**: DPD force sum (F^C + F^D + F^R), FDT (σ² = 2γkBT), Helfrich bending energy (κ/2 ∫(∇²h)² dA), Zimm diffusion D ~ N^{-0.6}.

---

## Tags
`DPD` `dissipative-particle-dynamics` `mesoscale` `polymer` `membrane` `fluctuation-dissipation` `Python` `soft-matter`

---

## Thumbnail

A stunning 3D render of a lipid bilayer self-assembling in DPD: on the left, a random scatter of blue (head) and red (tail) beads on a dark background; on the right, the same beads organized into a flat bilayer sandwich — blue-red-red-blue layers. An animated arrow connects left to right labeled "5 MINUTES CPU TIME." Bold text: "A CELL MEMBRANE: SELF-ASSEMBLED." Bottom: "DPD — Mesoscale Soft Matter."
