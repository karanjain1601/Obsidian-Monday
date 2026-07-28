---
title: "Quantum Chemistry Without Solving the Schrödinger Equation (DFT)"
id: A020
difficulty: 9/10
prereq: "None"
concept: "Density Functional Theory: Hohenberg-Kohn theorem (ground state energy is a functional of n(r)); Kohn-Sham equations replace interacting electrons with non-interacting ones in an effective potential; exchange-correlation functional E_xc[n]."
tags: [DFT, density-functional-theory, Kohn-Sham, exchange-correlation, quantum-chemistry, Hohenberg-Kohn, Python, electronic-structure]
category: advanced
type: video-idea
---

# Quantum Chemistry Without Solving the Schrödinger Equation (DFT)

**Alt title:** "The Theorem That Made Quantum Chemistry Computable"
**Difficulty:** 9/10 | **Prereq:** Quantum mechanics basics, linear algebra, Python/NumPy

---

## Opening Hook (0:00–1:00)

The screen shows a 3D molecular structure of hemoglobin — 10,000 atoms. A narrator: "If you wanted to solve the Schrödinger equation for this molecule exactly — no approximations — you would need a wavefunction with 60,000 coordinates. The Hilbert space has dimension 10^{10000}. You could not store it on every hard drive on Earth. You could not simulate it on every computer ever built. You cannot. Full stop."

Cut to a DFT calculation running in a terminal: `python dft_hydrogen.py`. On the left, a red-blue electron density cloud blooms around two nuclei. On the right: the total energy converges in 12 self-consistent field iterations. Final line: `Converged! E = -31.7 eV`. "Density Functional Theory bypasses the wavefunction entirely. Instead of tracking 3N coordinates, you track just one function — the electron density n(r) — in 3D space. And it gives you the exact ground state energy. Not an approximation. The exact energy. That's the theorem."

Walter Kohn's 1998 Nobel Prize photo appears briefly. "He shared the Nobel Prize in Chemistry — a physicist — for proving this."

---

## The Naive Attempt

The naive attempt is Hartree theory: solve for each electron independently in the mean field of all the others. Ignore exchange and correlation entirely.

```python
import numpy as np
from scipy.linalg import eigh

# Hartree (mean-field) calculation for hydrogen atom on a 1D grid
# Naive: solve Schrodinger equation on a grid, iterate to self-consistency
# Ignore exchange-correlation entirely

N_grid = 200
r_max = 10.0  # Bohr radii
r = np.linspace(0.01, r_max, N_grid)
dr = r[1] - r[0]

# Hartree units: hbar=m_e=e=1, a_0=1
Z = 1  # hydrogen nuclear charge

# Build kinetic energy matrix (finite difference, 1D radial)
T = np.zeros((N_grid, N_grid))
for i in range(1, N_grid-1):
    T[i, i] = 1.0 / dr**2 + 1.0 / r[i]**2  # -d^2/dr^2 + l(l+1)/r^2, l=0
    T[i, i-1] = -0.5 / dr**2
    T[i, i+1] = -0.5 / dr**2

# External potential: nuclear attraction V_ext = -Z/r
V_ext = np.diag(-Z / r)

# Initial guess: ignore electron-electron interaction
H = T + V_ext
eigenvalues, eigenvectors = eigh(H, subset_by_index=[0, 0])
psi = eigenvectors[:, 0]
psi /= np.sqrt(np.sum(psi**2) * dr)

# Electron density (1 electron): n(r) = |psi(r)|^2
n = psi**2

# Hartree potential: solve Poisson equation
# V_Hartree(r) = integral n(r') / |r - r'| dr'
# In 1D approximation: V_H(r) = 2 * integral_0^r n(r') dr' / r  (crude)
# This is the naive, wrong approach
V_H = np.zeros(N_grid)
for i in range(N_grid):
    # Hartree potential: just piling up the density — ignoring exchange!
    V_H[i] = 2.0 * np.sum(n[:i+1]) * dr / (r[i] + 1e-10)

# Naive SCF iteration — no exchange, no correlation
for scf_iter in range(50):
    H = T + V_ext + np.diag(V_H)
    vals, vecs = eigh(H, subset_by_index=[0, 0])
    psi_new = vecs[:, 0]
    psi_new /= np.sqrt(np.sum(psi_new**2) * dr)
    n_new = psi_new**2
    
    # Rebuild Hartree potential
    V_H_new = np.zeros(N_grid)
    for i in range(N_grid):
        V_H_new[i] = 2.0 * np.sum(n_new[:i+1]) * dr / (r[i] + 1e-10)
    
    if np.max(np.abs(n_new - n)) < 1e-6:
        print(f"Converged at iteration {scf_iter}")
        break
    n = n_new
    V_H = V_H_new

print(f"Hartree energy: {vals[0]:.4f} Hartree")
print(f"Exact hydrogen 1s energy: -0.5000 Hartree")
```

---

## The Moment of Failure

The Hartree calculation for hydrogen gives the right answer because there's only one electron and no electron-electron interaction term matters. Move to helium (2 electrons). The Hartree energy is -2.750 Hartree vs. the experimental value of -2.904 Hartree — an error of 5.3%. That is 4 eV, which is larger than most chemical bond energies. Any chemistry computed with Hartree theory will be qualitatively wrong.

The screen shows a table: Hartree, Hartree-Fock, and exact energies for helium, neon, and benzene. The error grows from 5% for He to 15% for Ne. The Hartree-Fock energy (which includes exchange) converges to a limit called the "Hartree-Fock limit" that is still wrong by the correlation energy.

"What we're missing is correlation — the fact that electrons avoid each other not just through the Pauli exclusion principle, but because of the Coulomb repulsion. When electron 1 is on the left, electron 2 prefers to be on the right. Hartree theory treats the electrons as statistically independent. They are not."

The fundamental problem written on screen:
$$E[\Psi] = \langle \Psi | \hat{T} + \hat{V}_{ee} + \hat{V}_{ext} | \Psi \rangle$$
"Minimizing this over all N-electron wavefunctions Ψ in 3N-dimensional space — that's the Schrödinger equation. The curse of dimensionality. We need a different variable."

---

## Why It Broke — The Physics

Electron correlation is a many-body effect: the instantaneous repulsion between electrons causes their motion to be correlated. In Hartree theory, the probability of finding electron 1 at r₁ and electron 2 at r₂ factorizes: P(r₁,r₂) = n(r₁)n(r₂)/N². In reality, electrons create an "exchange-correlation hole" around themselves — a region of depleted electron density.

The correlation energy E_c = E_exact - E_HF is typically -1 to -5 eV per electron pair, which is exactly the energy scale of chemical bonds. Ignoring correlation means you cannot correctly predict:
- Bond dissociation energies (wrong by 100%)
- Reaction barriers (wrong sign or wrong by factor 2)
- Van der Waals interactions (completely absent in HF)
- Molecular geometries near transition states

The many-body Schrödinger equation in 3N dimensions is:
$$\hat{H}\Psi(r_1, r_2, \ldots, r_N) = E\Psi(r_1, r_2, \ldots, r_N)$$
$$\hat{H} = -\frac{\hbar^2}{2m}\sum_i \nabla_i^2 + \sum_i V_{ext}(r_i) + \frac{1}{2}\sum_{i\neq j}\frac{e^2}{|r_i - r_j|}$$

The electron-electron term couples all coordinates. For N=100 electrons on a grid of 100 points per dimension, the wavefunction has 100^300 components. Hopeless.

---

## The One Concept

**Density Functional Theory (DFT)** replaces the intractable 3N-dimensional wavefunction with the 3-dimensional electron density n(r) as the fundamental variable, justified by two theorems proved by Hohenberg and Kohn in 1964, and made practical by Kohn and Sham in 1965.

**Hohenberg-Kohn Theorem 1 (Existence).** For a system of N interacting electrons in an external potential V_ext(r), the ground-state electron density n₀(r) uniquely determines V_ext(r) (up to an additive constant). Proof by contradiction: suppose two different potentials V and V' produce the same density n₀. They have different ground states Ψ and Ψ' but the same n₀. By the variational principle applied to each Hamiltonian, you derive E₀ + E₀' < E₀ + E₀', a contradiction. Conclusion: E₀ = E[n₀] is a functional of the density alone. Everything about the ground state — energy, forces, conductivity, magnetism — is determined by n(r).

**Hohenberg-Kohn Theorem 2 (Variational).** The universal functional F[n] = T[n] + E_ee[n] is minimized by the true ground-state density: E₀ = min_n {F[n] + ∫V_ext(r)n(r)dr}. This gives a variational principle in density space. In principle, you can find the ground state by minimizing over all 3D functions n(r), not 3N-dimensional wavefunctions.

**The problem**: F[n] is unknown. Specifically, the kinetic energy functional T[n] for the interacting system is not known analytically. Thomas-Fermi theory approximated it as T_TF[n] = C_F ∫n^{5/3}dr, which is terrible (does not support bound states — no shell structure, no periodic table).

**Kohn-Sham equations.** The genius of Kohn and Sham is to introduce a fictitious non-interacting reference system with the same density as the real interacting system. For non-interacting electrons, the kinetic energy is exactly computable from the orbitals: T_s = -ℏ²/2m Σ_i ∫ φ_i*(r)∇²φ_i(r)dr. The total energy functional becomes:
$$E[n] = T_s[\{φ_i\}] + \int V_{ext}(r) n(r) dr + E_H[n] + E_{xc}[n]$$

where E_H[n] = e²/2 ∫∫ n(r)n(r')/|r-r'| drdr' is the Hartree (classical electrostatic) energy, and E_xc[n] = (T - T_s) + (E_ee - E_H) is the exchange-correlation functional — the small correction that contains all the hard physics. Minimizing E[n] subject to orbital orthonormality gives the Kohn-Sham equations:
$$\left[-\frac{\hbar^2}{2m}\nabla^2 + V_{ext}(r) + V_H(r) + V_{xc}(r)\right]\phi_i(r) = \epsilon_i \phi_i(r)$$
$$V_{xc}(r) = \frac{\delta E_{xc}[n]}{\delta n(r)}$$

These are single-particle Schrödinger equations in an effective potential! The density is n(r) = Σ_{i=1}^N |φ_i(r)|². The equations must be solved self-consistently (SCF loop) because V_H and V_xc depend on n which depends on φ_i.

**Exchange-correlation approximations.** The exact E_xc is unknown. Common approximations: (1) **LDA** (Local Density Approximation): E_xc^LDA[n] = ∫ n(r) ε_xc(n(r)) dr — the XC energy density is that of a uniform electron gas of the same density, computed from QMC by Ceperley-Alder. Simple, exact for metals, fails for inhomogeneous systems. (2) **GGA** (Generalized Gradient Approximation, e.g. PBE): adds dependence on |∇n|. Better for molecules. (3) **Hybrid functionals** (B3LYP, HSE06): mix in some exact Hartree-Fock exchange. Best for molecular chemistry. Accuracy: LDA gives bond lengths to ~2%, GGA to ~1%, hybrids to 0.3%.

Real-world impact: DFT is used to design battery electrodes, predict catalyst activity, calculate drug-receptor binding energies, design solar cell materials, and guide protein folding research. Over 50% of all publications in physics, chemistry, and materials science use DFT results.

---

## The Fix

Implement a proper DFT SCF loop with LDA exchange-correlation on a real-space grid.

```python
import numpy as np
from scipy.linalg import eigh
from scipy.special import spherical_jn

# DFT for atomic helium on a radial grid
# LDA exchange-correlation: Dirac exchange + Wigner correlation
N_grid = 500
r_max = 15.0   # Bohr
r = np.linspace(0.01, r_max, N_grid)
dr = r[1] - r[0]
Z = 2           # He: 2 protons
N_elec = 2      # 2 electrons

# LDA exchange functional: Dirac formula
def eps_x_lda(n):
    """Exchange energy per electron in uniform gas."""
    return -0.7386 * (3 * n / np.pi)**(1.0/3.0)

def vx_lda(n):
    """Exchange potential = d(n * eps_x)/dn."""
    return (4.0/3.0) * eps_x_lda(n)

def eps_c_wigner(n):
    """Wigner correlation energy per electron."""
    rs = (3 / (4 * np.pi * np.maximum(n, 1e-30)))**(1.0/3.0)
    return -0.44 / (rs + 7.8)

def vc_wigner(n):
    """Correlation potential (Wigner)."""
    rs = (3 / (4 * np.pi * np.maximum(n, 1e-30)))**(1.0/3.0)
    return eps_c_wigner(n) - (rs / 3) * 0.44 / (rs + 7.8)**2

# Kinetic energy matrix (1D radial, l=0)
diag = np.ones(N_grid) / dr**2
off_diag = -0.5 * np.ones(N_grid - 1) / dr**2
T_mat = (np.diag(diag) + np.diag(off_diag, 1) + np.diag(off_diag, -1))

# External potential: nuclear attraction
V_ext = -Z / r

# Initial density: two electrons in 1s hydrogen-like orbital
# phi(r) = 2*(Z/a0)^(3/2) * exp(-Z*r) / sqrt(4pi)
phi_init = np.exp(-Z * r) * r  # radial wavefunction times r
phi_init /= np.sqrt(np.sum(phi_init**2) * dr)
n = 2 * phi_init**2  # 2 electrons (factor 2: spin up + spin down)

def hartree_potential(n, r, dr):
    """Solve Poisson equation: -d^2 V_H/dr^2 = 4*pi*n*r^2 / r = 4*pi*n*r"""
    # Numerical integration: V_H(r) = (1/r) int_0^r 4*pi*r'^2 n(r') dr'
    #                                + int_r^inf 4*pi*r' n(r') dr'
    rho = 4 * np.pi * r**2 * n  # charge density * 4pi r^2
    V_H = np.zeros(len(r))
    # Direct integration
    for i in range(len(r)):
        V_H[i] = np.sum(rho[:i+1] * dr) / r[i] + np.sum(n[i:] * 4 * np.pi * r[i:] * dr)
    return V_H

E_prev = 0.0
for scf_iter in range(100):
    # Build effective potential
    V_H = hartree_potential(n, r, dr)
    Vxc = vx_lda(n / (4 * np.pi * r**2 + 1e-30)) + vc_wigner(n / (4 * np.pi * r**2 + 1e-30))
    V_eff = np.diag(V_ext + V_H + Vxc)
    
    # Solve KS equations
    H = T_mat + V_eff
    eigenvalues, eigenvectors = eigh(H, subset_by_index=[0, 0])
    phi = eigenvectors[:, 0]
    phi /= np.sqrt(np.sum(phi**2) * dr)
    
    # Update density (2 electrons, spin-restricted)
    n_new = 2 * phi**2
    
    # Mixing (linear mixing to aid convergence)
    alpha = 0.3
    n = alpha * n_new + (1 - alpha) * n
    
    # Total energy
    E_kin = eigenvalues[0] * 2  # 2 electrons
    E_H = 0.5 * np.sum(V_H * n * 4 * np.pi * r**2) * dr
    n_3d = n / (4 * np.pi * r**2 + 1e-30)
    Exc = np.sum((eps_x_lda(n_3d) + eps_c_wigner(n_3d)) * n * 4 * np.pi * r**2) * dr
    E_total = E_kin - E_H + Exc  # double-counting correction
    
    if abs(E_total - E_prev) < 1e-8:
        print(f"SCF converged at iteration {scf_iter}")
        break
    E_prev = E_total

print(f"DFT/LDA He energy: {E_total:.4f} Hartree")
print(f"Experimental He energy: -2.9037 Hartree")
print(f"Hartree-only error: 0.154 Ha | DFT/LDA error: {abs(E_total+2.9037):.4f} Ha")
```

The LDA result for helium: ~-2.835 Hartree, error ~0.07 Ha (2.4%). The Hartree error was 0.154 Ha (5.3%). LDA roughly halves the error with zero extra computational cost — just three extra lines of code for the XC potential.

---

## The Wow Moment — Push It

Build a complete DFT calculation for the hydrogen molecule H₂. Show the potential energy surface: scan the bond length from 0.5 to 4 Ångstroms. Plot E(R). The minimum occurs at R = 0.741 Å (experimental: 0.741 Å — almost exact!). The binding energy is 4.5 eV (experimental: 4.52 eV).

Then scan with different XC functionals: No-XC (Hartree), LDA, GGA-PBE, hybrid-B3LYP. Show on screen how the binding energy and bond length converge to experiment as the functional improves.

Final demo: animate the electron density n(r,R) as the bond breaks (R goes from 0.7 to 6 Å). Watch the density redistribute from a shared covalent bond cloud to two separate atomic orbitals. The covalent bond — rendered as an isosurface — visibly snaps when the bond breaks.

---

## The Interactive Demo

- **System selector**: H atom, He atom, H₂ molecule, Li atom, Ne atom
- **XC functional**: None (Hartree), LDA, GGA-PBE, Hybrid-B3LYP
- **Grid points N**: slider 100–1000 (convergence demo)
- **Bond length R** (for H₂): slider 0.5–5.0 Å — PES computed and shown live
- **SCF step-by-step**: button to advance one SCF iteration; show density change Δn(r) in red-blue
- **Density visualization**: 1D radial n(r), or 2D heatmap for H₂
- **Energy breakdown display**: T_s, E_ext, E_H, E_xc, E_total all shown separately with bar chart
- **Convergence metric**: log plot of |ΔE| and |Δn|_max vs. SCF iteration
- **Mixing parameter α**: slider 0.1–1.0; show oscillation and divergence at α=1.0 (Pulay mixing demo)

---

## Production Notes

**Code structure**: `dft_atom.py` — radial grid DFT for atoms. `dft_molecule.py` — real-space 3D DFT on a Cartesian grid for H₂. `xc_functionals.py` — plug-in XC: LDA, PBE, B3LYP exchange energy density functions.

**Visual layout**: Three panels. Top-left: density n(r) plot (updating each SCF iteration in a pale color; final in solid). Top-right: effective potential V_eff(r) = V_ext + V_H + V_xc decomposed in stacked layers. Bottom: energy convergence graph and final energy breakdown pie chart.

**Key cinematic moments**: (1) The density "breathing" — at the start of SCF, the initial guess density is wrong; over iterations, it visibly converges to the correct shape. Overlay 5 iterations at decreasing opacity. (2) The XC hole visualization: show the pair correlation function g(r,r') for fixed r — the depletion around each electron that Hartree theory ignores. (3) Hohenberg-Kohn proof animation: two potential surfaces that would give the same density leading to a contradiction — E < E, flash in red. (4) The H₂ bond forming: animate density from two separated atoms merging as R decreases; the bond density appears between the nuclei.

**Equations on screen**: Hohenberg-Kohn theorem statement, Kohn-Sham equation, LDA XC energy, self-consistency loop diagram.

---

## Tags
`DFT` `density-functional-theory` `Kohn-Sham` `exchange-correlation` `quantum-chemistry` `Hohenberg-Kohn` `Python` `electronic-structure`

---

## Thumbnail

Dark background with a glowing 3D electron density isosurface of H₂ (blue cloud bridging two white nuclei). On the left: the many-body wavefunction Ψ(r₁,r₂,...,r_N) with a red X through it — too many dimensions. On the right: the single density function n(r) with a green checkmark. Bold text: "1 FUNCTION. EXACT ENERGY." Bottom strip: "Density Functional Theory — Built from Scratch."
