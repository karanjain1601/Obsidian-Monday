---
title: "Moving Electrons and Nuclei Together (Ab Initio Molecular Dynamics)"
id: A025
difficulty: 9.5/10
prereq: "A020"
concept: "Born-Oppenheimer MD: at each MD step, solve the electronic Schrödinger equation (via DFT) to get forces on nuclei; Car-Parrinello MD: treat electronic degrees of freedom as classical (fictitious mass μ) — one unified Lagrangian."
tags: [AIMD, ab-initio-MD, Born-Oppenheimer, Car-Parrinello, DFT, molecular-dynamics, Python, electronic-structure]
category: advanced
type: video-idea
---

# Moving Electrons and Nuclei Together (Ab Initio Molecular Dynamics)

**Alt title:** "The $2,000 DFT Force Calculation That Makes MD Worth It"
**Difficulty:** 9.5/10 | **Prereq:** A020 (DFT), Newton's laws, Python/NumPy

---

## Opening Hook (0:00–1:00)

"Water dissolves table salt. You've seen it a thousand times. But do you know what happens at the atomic level? The sodium and chloride ions separate, and water molecules rearrange around each one — specifically, the oxygen atoms (negative end of the dipole) face the Na+ ions, and the hydrogen atoms face the Cl- ions. This happens in femtoseconds. And until 1985, nobody could simulate it."

A molecular dynamics video plays: 64 water molecules surrounding a Na+ ion. The oxygen atoms visibly orient toward the cation. The hydrogen-bond network restructures. "Classical force fields cannot capture the polarization of water by the ion — the force field parameters are fixed. What you really need is to re-solve the electronic structure at each timestep. That's Ab Initio Molecular Dynamics: DFT for the electrons, Newtonian mechanics for the nuclei, unified into a single propagation."

"In 1985, Roberto Car and Michele Parrinello published a Lagrangian that made this computationally feasible. They shared the 2009 Dirac Medal for it. We're going to implement both approaches and show why one is brilliant and the other is merely correct."

---

## The Naive Attempt

The naive approach: pre-compute force field parameters from DFT single-point energies, then run classical MD. The problem is that force field parameters are fixed — they cannot adapt to changing chemical environment.

```python
import numpy as np

# Naive: classical MD with a fixed point-charge model for NaCl in water
# Force field parameters from a DFT fit (done offline, frozen)
# Problem: fixed charges cannot capture polarization

N_water = 32
N_Na = 1
N_Cl = 1
N_atoms = N_water * 3 + N_Na + N_Cl

# Fixed charges (TIP3P model for water, point charges for ions)
q_O = -0.834    # oxygen charge in elementary charges
q_H = +0.417    # hydrogen charge
q_Na = +1.0
q_Cl = -1.0

# Fixed Lennard-Jones parameters (Angstroms, kcal/mol)
eps_OO = 0.152   # kcal/mol
sig_OO = 3.15    # Angstroms

# Initialize positions (simplified)
positions = np.random.uniform(0, 15, (N_atoms, 3))
velocities = np.zeros((N_atoms, 3))
masses = np.ones(N_atoms)  # all ~1 amu for simplicity

def force_fixed_charges(positions):
    """Classical force from fixed point charges and LJ."""
    forces = np.zeros_like(positions)
    # Coulomb + LJ between all pairs
    for i in range(N_atoms):
        for j in range(i+1, N_atoms):
            dr = positions[j] - positions[i]
            r = np.linalg.norm(dr)
            if r < 0.5 or r > 7.5:
                continue
            # Coulomb (k_e = 332 kcal/mol/Angstrom/e^2)
            F_coul = 332 * q_Na * q_Cl / r**3 * dr  # just Na-Cl for demo
            forces[i] -= F_coul
            forces[j] += F_coul
    return forces

# Run a few MD steps
dt = 0.001  # ps
for step in range(100):
    F = force_fixed_charges(positions)
    velocities += 0.5 * dt * F / masses[:, None]
    positions += dt * velocities
    velocities += 0.5 * dt * F / masses[:, None]

print("Classical MD ran. But the water polarization is wrong.")
print("Fixed charge q_O = -0.834e is independent of environment.")
print("In reality: near Na+, the oxygen lone pairs donate electron density.")
print("The effective charge changes. A fixed force field cannot capture this.")
print("\nWe need to re-solve the electronic structure at every step.")
```

---

## The Moment of Failure

Run the classical simulation and compute the oxygen-sodium radial distribution function g(r). Compare with the experimental neutron diffraction data. The first solvation shell peak appears at the right distance, but is too sharp (overstructured) and the coordination number is wrong (classical: 6.3, experimental: 5.2). More critically: the dielectric constant of the simulated water is wrong by 30%, because polarization is missing.

"Fixed charges cannot polarize. When an ion is nearby, the electron cloud of water molecules actually distorts — the dipole increases from 1.85 D (gas phase) to ~2.7 D (liquid phase). Our force field uses 1.85 D everywhere. This isn't a numerical bug. It's a conceptual limitation of the entire classical force field paradigm. We need the electrons."

---

## Why It Broke — The Physics

The Born-Oppenheimer approximation (BOA): the nuclei move so slowly compared to electrons (mass ratio M_nucleus/m_electron ~ 1836–100,000) that the electrons instantaneously relax to their ground state for any given nuclear configuration. The total wavefunction factorizes:
$$\Psi(r_{el}, R_{nuc}) \approx \psi_0(r_{el}; R_{nuc}) \cdot \chi(R_{nuc})$$

The electronic ground state energy E₀(R) is a function of nuclear positions R — the **Born-Oppenheimer potential energy surface (PES)**. The nuclei move on this PES according to Newton's law:
$$M_I \ddot{R}_I = -\nabla_{R_I} E_0(R)$$

The force on nucleus I is the Hellmann-Feynman theorem gradient:
$$F_I = -\frac{\partial E_0}{\partial R_I} = -\left\langle \psi_0 \left| \frac{\partial \hat{H}_{el}}{\partial R_I} \right| \psi_0 \right\rangle$$

For DFT: F_I = -∂E_DFT[n;R]/∂R_I. This can be computed efficiently via the Pulay forces (Hellmann-Feynman force + Pulay correction for basis set incompleteness). Each MD step requires a full DFT SCF convergence — expensive, but exact (within DFT).

---

## The One Concept

**Ab Initio Molecular Dynamics (AIMD)** combines DFT electronic structure with classical nuclear dynamics to propagate molecules through time without any pre-fitted force field parameters. The electronic structure adapts continuously to the nuclear geometry, capturing bond breaking, bond forming, polarization, and chemical reactions.

**Born-Oppenheimer MD (BOMD).** The simplest AIMD: at each timestep τ, (1) given nuclear positions R(τ), (2) solve DFT to convergence → get n₀(r;R) and E_DFT(R), (3) compute forces F_I(R) via Hellmann-Feynman, (4) integrate Newton's equations: R(τ+dt) = R(τ) + V(τ)dt, V(τ+dt/2) = V(τ-dt/2) + F(R(τ))/M · dt (velocity Verlet). Cost: one complete SCF per MD step. For N=64 water molecules with plane-wave DFT: ~100 SCF iterations × O(N³) matrix operations per step. Expensive but systematically improvable.

**Car-Parrinello MD (CPMD).** The genius insight of Car and Parrinello (1985): instead of solving the SCF to convergence at each step, treat the electronic degrees of freedom — the KS orbital coefficients {c_i} — as classical dynamical variables with a fictitious mass μ. Define the extended Lagrangian:
$$\mathcal{L}_{CP} = \sum_I \frac{M_I}{2}\dot{R}_I^2 + \mu\sum_i \int |\dot{\phi}_i(r)|^2 dr - E_{KS}[\{\phi_i\}, R]$$

subject to the orthonormality constraint ⟨φ_i|φ_j⟩ = δ_{ij} (enforced via Lagrange multipliers). The equations of motion are:
$$M_I \ddot{R}_I = -\nabla_{R_I} E_{KS}$$
$$\mu \ddot{\phi}_i(r) = -\frac{\delta E_{KS}}{\delta \phi_i^*(r)} + \sum_j \Lambda_{ij} \phi_j(r)$$

The electronic "fictitious dynamics" propagates the orbitals on the same timestep as the nuclei — no SCF needed! The key requirement: the fictitious kinetic energy μΣ⟨φ̇_i|φ̇_i⟩ must remain small (electrons stay near the ground state). This requires μ to be small and a short timestep (dt ~ 0.1–0.2 fs, vs. BOMD 0.5–1.0 fs). The electronic gap ΔE must be non-zero (insulating/semiconducting systems); for metals, CPMD fails due to adiabaticity breaking.

**Choosing between BOMD and CPMD.** BOMD: more robust (always on BO surface), better for metals, can use larger timestep. CPMD: no SCF convergence needed per step → 10–100x faster per step, but requires adiabaticity. For insulators and semiconductors (water, organic molecules, oxides): CPMD is the workhorse. For metallic systems: BOMD necessary.

**What AIMD can do that classical MD cannot.** (1) **Proton transfer**: the Grotthuss mechanism — proton hops along the hydrogen-bond network of water. A classical MD cannot break/form O-H bonds (fixed topology). AIMD captures this spontaneously. (2) **Chemical reactions**: bond breaking in combustion, catalysis, oxidation. (3) **Polarization**: the instantaneous electronic response to environment changes (polarizable force fields approximate this, AIMD does it exactly). (4) **Electronic properties**: compute IR/Raman spectra from the time correlation function of the dipole moment, obtained by computing the dipole from the electron density at each step. The IR spectrum of liquid water computed from 20 ps AIMD matches experiment to 10%.

**Computational cost.** N=64 water molecules, BOMD/BLYP, plane-wave basis: ~20 minutes per ps on 64 CPU cores. For 100 ps trajectory: ~30 CPU-days. Contrast with classical TIP4P/2005: 100 ps in seconds. AIMD is ~5000× slower. The price of accuracy.

---

## The Fix

Implement a minimal AIMD (BOMD) for a 1D two-electron diatomic molecule — the simplest possible case.

```python
import numpy as np
from scipy.linalg import eigh

# Born-Oppenheimer MD for H2 molecule (1D model)
# Electrons: 2 electrons in 1D soft Coulomb potential
# Nuclei: 2 protons at positions R1, R2, mass M_proton = 1836 a.u.

# Atomic units: hbar=m_e=e=a0=1
M_p = 1836.0    # proton mass in a.u.
N_grid = 150    # electronic grid points
x_max = 8.0
x = np.linspace(-x_max, x_max, N_grid)
dx = x[1] - x[0]

def soft_coulomb(x1, x2, alpha=0.5):
    """Soft-core Coulomb (avoids 1D singularity)."""
    return 1.0 / np.sqrt((x1 - x2)**2 + alpha**2)

def build_ks_hamiltonian(R1, R2, n):
    """Build 1D KS Hamiltonian for 2 electrons at nuclear positions R1, R2."""
    # Kinetic energy (finite difference)
    T_diag = np.ones(N_grid) / dx**2
    T_off = -0.5 * np.ones(N_grid-1) / dx**2
    T = np.diag(T_diag) + np.diag(T_off, 1) + np.diag(T_off, -1)
    
    # External (electron-nuclear) potential
    V_ext = -soft_coulomb(x, R1) - soft_coulomb(x, R2)
    
    # Hartree potential (convolution integral)
    V_H = np.array([np.sum(n * soft_coulomb(xi, x)) * dx for xi in x])
    
    # LDA exchange (1D)
    V_xc = -0.669 * np.cbrt(n / (2 * np.pi) + 1e-30)  # 1D LDA approx
    
    V_eff = V_ext + V_H + V_xc
    return T + np.diag(V_eff)

def dft_scf(R1, R2, n_init=None, max_iter=50, tol=1e-8):
    """Self-consistent DFT for two electrons at fixed nuclear positions."""
    if n_init is None:
        n = np.exp(-(x-R1)**2) + np.exp(-(x-R2)**2)
        n *= 2.0 / (np.sum(n) * dx)
    else:
        n = n_init.copy()
    
    E_prev = 0.0
    for iteration in range(max_iter):
        H_KS = build_ks_hamiltonian(R1, R2, n)
        eigenvalues, eigenvectors = eigh(H_KS, subset_by_index=[0, 0])
        phi = eigenvectors[:, 0]
        phi /= np.sqrt(np.sum(phi**2) * dx)
        n_new = 2 * phi**2  # 2 electrons
        
        # Linear mixing
        n = 0.4 * n_new + 0.6 * n
        
        # Compute total energy
        V_H = np.array([np.sum(n * soft_coulomb(xi, x)) * dx for xi in x])
        E_nn = soft_coulomb(R1, R2)  # nuclear repulsion
        E_total = 2 * eigenvalues[0] - 0.5 * np.sum(V_H * n) * dx + E_nn
        
        if abs(E_total - E_prev) < tol:
            break
        E_prev = E_total
    
    return E_total, n, phi

def compute_force(R1, R2, n, phi):
    """Hellmann-Feynman force on each nucleus."""
    # F_1 = -dE/dR1 = integral n(x) * d(-1/|x-R1|)/dR1 dx + dV_nn/dR1
    dV_ext_dR1 = -(x - R1) / ((x - R1)**2 + 0.5**2)**1.5  # d/dR1 of -1/|x-R1|
    dV_ext_dR2 = -(x - R2) / ((x - R2)**2 + 0.5**2)**1.5
    
    F1_elec = -np.sum(n * dV_ext_dR1) * dx  # electron contribution to F1
    F2_elec = -np.sum(n * dV_ext_dR2) * dx
    
    # Nuclear repulsion force
    dV_nn_dR1 = (R1 - R2) / ((R1 - R2)**2 + 0.5**2)**1.5
    dV_nn_dR2 = -dV_nn_dR1
    
    F1 = F1_elec + dV_nn_dR1
    F2 = F2_elec + dV_nn_dR2
    return F1, F2

# Initialize: H2 at equilibrium bond length, no velocity
R1, R2 = -0.7, 0.7  # Bohr
V1, V2 = 0.05, -0.05  # small initial velocities (in a.u.)
n = None

# BO-MD: velocity Verlet integrator
dt = 5.0  # a.u. of time (1 a.u. time ~ 24 attoseconds)
n_steps = 200
trajectory = []

print("Running Born-Oppenheimer MD for H2 dissociation...")
for step in range(n_steps):
    # DFT step
    E, n, phi = dft_scf(R1, R2, n_init=n)
    F1, F2 = compute_force(R1, R2, n, phi)
    
    # Velocity Verlet
    V1 += 0.5 * dt * F1 / M_p
    V2 += 0.5 * dt * F2 / M_p
    R1 += dt * V1
    R2 += dt * V2
    E, n, phi = dft_scf(R1, R2, n_init=n)
    F1_new, F2_new = compute_force(R1, R2, n, phi)
    V1 += 0.5 * dt * F1_new / M_p
    V2 += 0.5 * dt * F2_new / M_p
    
    bond_length = abs(R2 - R1)
    trajectory.append((step*dt, bond_length, E))
    
    if step % 20 == 0:
        print(f"  Step {step:3d}: R = {bond_length:.3f} a.u., E = {E:.4f} Ha")

print(f"\nFinal bond length: {abs(R2-R1):.3f} a.u. (equilibrium ~2.6 a.u.)")
```

---

## The Wow Moment — Push It

Run AIMD for 10 water molecules at 300 K. Show: (1) the hydrogen-bond network forming and breaking in real time, (2) a spontaneous proton transfer event (Grotthuss mechanism) — a proton jumps from one water to another, making H₃O+ and OH⁻ that immediately recombine. This cannot happen in classical MD. (3) Compute the IR spectrum from the dipole autocorrelation function C(t) = ⟨μ(0)·μ(t)⟩ → Fourier transform. Show the O-H stretch at 3400 cm⁻¹, HOH bending at 1640 cm⁻¹. Overlay with the experimental IR spectrum of water. Match is excellent.

---

## The Interactive Demo

- **System**: 1D H₂, 1D HF, 2D H₂O (simplified)
- **MD method**: BOMD (full SCF every step) vs. CPMD (fictitious electron dynamics)
- **Timestep dt**: slider 0.5–5.0 fs (show instability at large dt)
- **Temperature T**: slider 100–2000 K (Nosé-Hoover thermostat)
- **Fictitious mass μ** (CPMD): slider 100–2000 a.u. — show adiabaticity measure
- **Potential energy surface**: live plot of E(R) as the molecule oscillates
- **Electronic density**: movie n(x,t) at each MD step
- **Energy conservation**: plot total (nuclear KE + electronic + nuclear potential) vs. time
- **IR spectrum**: live computation from dipole correlation function

---

## Production Notes

**Code structure**: `dft_engine.py` — DFT SCF, Hellmann-Feynman forces. `bomd.py` — velocity Verlet integrator calling DFT engine. `cpmd.py` — CPMD Lagrangian propagation. `aimd_spectrum.py` — dipole autocorrelation and IR spectrum.

**Visual layout**: Left: the 1D electron density n(x,t) as a 2D heatmap (x vs. time, density as color). Overlaid: two vertical lines for the nuclear positions, moving over time. Right: potential energy E(R) plot with a moving dot showing current (R, E) position — the molecule bouncing in its potential well.

**Key cinematic moments**: (1) The SCF loop timing: for BOMD, pause the simulation at each SCF step. Show the density changing each iteration with a fade trail. "Every MD step costs 20 SCF iterations." (2) The CPMD comparison: run both methods side by side at the same cost. CPMD uses 10× more MD steps but each is 20× cheaper (no SCF). Show equal accuracy. (3) The dissociation: push the molecule with a kick. Watch it stretch, the bond break, the two atoms separate. The electron density splits into two lobes. "You just simulated bond breaking. No force field would have allowed this." (4) Energy conservation: a single energy conservation plot showing total energy flat over hundreds of steps — proof that the code is correct.

**Equations on screen**: Born-Oppenheimer factorization, Hellmann-Feynman theorem, Newton's law F = -∇E, Car-Parrinello Lagrangian.

---

## Tags
`AIMD` `ab-initio-MD` `Born-Oppenheimer` `Car-Parrinello` `DFT` `molecular-dynamics` `Python` `electronic-structure`

---

## Thumbnail

Split image. Left: a classical MD simulation with rigid water molecules and static charge clouds (labeled "FORCE FIELD — FROZEN CHARGES"). Right: an AIMD frame where the electron density visibly distorts around a sodium ion — the oxygen lone pair extends toward Na+. Bold white text: "THE ELECTRONS MOVE TOO." Bottom: "Ab Initio MD — DFT + Newton."
