---
title: "Quantum Statistics Without Wavefunctions (Path Integral Monte Carlo)"
id: A019
difficulty: 9.5/10
prereq: "None"
concept: "PIMC: Feynman's path integral formulation at finite temperature; imaginary time τ=iℏβ makes partition function a classical polymer in (d+1) dimensions; Metropolis sampling of paths; directly gives thermodynamic properties."
tags: [PIMC, path-integral, Monte-Carlo, quantum-statistics, Feynman, partition-function, thermal, Python]
category: advanced
type: video-idea
---

# Quantum Statistics Without Wavefunctions (Path Integral Monte Carlo)

**Alt title:** "Why Quantum Particles Look Like Necklaces at Finite Temperature"
**Difficulty:** 9.5/10 | **Prereq:** Statistical mechanics, basic Monte Carlo, Python/NumPy

---

## Opening Hook (0:00–1:00)

Open on a cryostat schematic: liquid helium at 2 K, a silvery Dewar flask. Narrator: "Below 2.17 Kelvin, helium stops behaving like a liquid and starts flowing without friction — superfluid. No viscosity. Climbs up the walls of its container. This is not chemistry. This is quantum mechanics at macroscopic scale."

Cut to a terminal: a Python script is running. On the right monitor, rings of colored dots appear — each ring is a closed polymer loop, coiling through 2D space, occasionally intersecting with neighboring rings. The loops writhe and pulsate with each Monte Carlo step.

"These loops are not molecules. They are individual helium atoms — rendered not as points, but as closed chains of 'imaginary-time' configurations called a world-line. Every bead on each ring is the same atom, at a different moment of imaginary time. When the rings link together — when they swap — that is the computational signature of Bose-Einstein statistics. That is superfluid helium. And we're going to build it from scratch."

Zoom in on two overlapping rings. A frame-by-frame animation shows a permutation move: the tail of ring A connects to the head of ring B. "This is a path integral Monte Carlo simulation. No wavefunction. No Hilbert space. Just classical statistics in an extra dimension — and all of quantum thermal physics falls out."

---

## The Naive Attempt

The naive attempt is classical statistical mechanics: model helium atoms as classical hard spheres with a Lennard-Jones pair potential, run a Metropolis Monte Carlo simulation, and try to reproduce the superfluid transition.

```python
import numpy as np

# Classical Monte Carlo for helium — naive approach
N = 64          # number of He atoms
T = 2.0         # temperature in Kelvin
kB = 1.380649e-23
beta = 1.0 / (kB * T)
L = 15.0        # box length in Angstroms
eps = 10.22 * kB  # LJ well depth for He (Kelvin units)
sigma = 2.556   # LJ diameter in Angstroms

# Initialize positions randomly
positions = np.random.uniform(0, L, size=(N, 3))

def lj_energy(r):
    """Lennard-Jones pair energy."""
    s_over_r = sigma / r
    return 4 * eps * (s_over_r**12 - s_over_r**6)

def total_energy(pos):
    E = 0.0
    for i in range(N):
        for j in range(i+1, N):
            dr = pos[i] - pos[j]
            dr -= L * np.round(dr / L)   # minimum image convention
            r = np.linalg.norm(dr)
            if r < 0.5 * L:
                E += lj_energy(r)
    return E

# Metropolis loop
E = total_energy(positions)
step_size = 0.5  # Angstroms
n_steps = 100_000
accepted = 0

for step in range(n_steps):
    i = np.random.randint(N)
    trial = positions.copy()
    trial[i] += np.random.uniform(-step_size, step_size, 3)
    trial[i] %= L
    dE = total_energy(trial) - E
    if dE < 0 or np.random.rand() < np.exp(-beta * dE):
        positions = trial
        E = total_energy(trial)
        accepted += 1

print(f"Acceptance rate: {accepted/n_steps:.2%}")
print(f"Final energy per particle: {E / N / kB:.3f} K")
```

Run this. Measure specific heat as a function of temperature by finite differencing the average energy. Plot it.

---

## The Moment of Failure

The specific heat curve from the classical simulation is a smooth, featureless decline. There is no lambda peak — no divergence of Cv at 2.17 K. The simulated system never superfluids. The radial distribution function g(r) looks reasonable, but the energy at 2 K is wrong by 30–40% compared to experiment. The vapor pressure, the zero-point energy, the quantum pressure — all absent.

The screen shows: a measured plot of helium specific heat (Wikipedia / NIST data) with a sharp λ-shaped spike at T_λ = 2.17 K. Next to it: the classical simulation's Cv curve. Completely flat. No lambda. No transition. "Classical Monte Carlo cannot see a phase transition that is caused by quantum statistics and zero-point motion. We are missing the entire physics of the problem."

The fundamental issue flashes on screen as a single equation:
$$Z_{\text{classical}} = \int \prod_i d^3 r_i \; e^{-\beta V(\{r_i\})}$$
versus
$$Z_{\text{quantum}} = \text{Tr}\left[e^{-\beta \hat{H}}\right]$$
"The quantum partition function is a trace over an infinite-dimensional Hilbert space. We need a way to compute it without ever diagonalizing the Hamiltonian."

---

## Why It Broke — The Physics

The failure is fundamental: helium at low temperature is a quantum liquid. The thermal de Broglie wavelength λ_th = h/√(2πmk_BT) becomes comparable to the inter-particle spacing. For helium at 2 K, λ_th ≈ 4 Å while the mean spacing is ≈ 3.6 Å. Quantum effects dominate.

Two distinct quantum effects are missing: (1) **Zero-point motion** — the Heisenberg uncertainty principle forces helium atoms to delocalize even at T=0, contributing ≈30% of the binding energy as quantum kinetic energy. Classical particles can sit still; quantum ones cannot. (2) **Bose-Einstein statistics** — helium-4 is a boson. The many-body wavefunction must be symmetric under particle exchange. At low temperature, multiple particles can occupy the same quantum state, leading to Bose-Einstein condensation and superfluidity. Classical particles have no exchange statistics.

The key equation governing this is the imaginary-time Schrödinger equation. Wick-rotate time t → -iτ with τ ∈ [0, ℏβ]:
$$e^{-\beta \hat{H}} = e^{-\frac{1}{\hbar}\int_0^{\hbar\beta} \hat{H} \, d\tau}$$

This is a "heat kernel" — the operator that propagates the system in imaginary time from 0 to ℏβ. The partition function becomes:
$$Z = \text{Tr}\left[e^{-\beta \hat{H}}\right] = \int \mathcal{D}[r(\tau)] \; e^{-S_E[r(\tau)]/\hbar}$$

where S_E is the Euclidean action — a classical action in imaginary time. The path integral runs over all closed paths r(0) = r(ℏβ). This is mathematically identical to a classical partition function for elastic polymers, living in d+1 spacetime dimensions.

---

## The One Concept

**Path Integral Monte Carlo (PIMC)** is the numerical realization of Feynman's path integral formulation at finite temperature. It turns the quantum statistical mechanics problem — computing Tr[e^{-βH}] — into a classical sampling problem in a higher-dimensional space, without ever constructing a wavefunction.

**The Trotter decomposition.** We cannot directly compute e^{-βH} because the kinetic T and potential V operators do not commute. But we can split β into M small imaginary-time slices, each of size ε = β/M:
$$e^{-\beta H} = \left(e^{-\epsilon H}\right)^M \approx \left(e^{-\epsilon T} e^{-\epsilon V}\right)^M + O(\epsilon^2)$$

For a single particle in a potential, inserting M-1 resolutions of identity ∫|r_k⟩⟨r_k|dr_k between each factor gives:
$$Z = \int dr_1 \cdots dr_M \prod_{k=1}^{M} \rho_0(r_k, r_{k+1}, \epsilon) \cdot e^{-\epsilon V(r_k)}$$

where ρ₀(r, r', ε) = (4πλε)^{-d/2} exp[-(r-r')²/(4λε)] is the free-particle density matrix, with λ = ℏ²/2m. This is the Gaussian spring linking adjacent beads. Closing the path requires r_{M+1} = r_1.

**The polymer picture.** Each quantum particle becomes a necklace of M beads, connected by harmonic springs with spring constant k_spring = m/(2ℏ²ε²) (inverse of the Gaussian variance). Adjacent beads interact via the potential. The spring constant grows as T decreases (more beads spread over the same imaginary-time interval ℏβ, but total "polymer length" ℏβ stays fixed). At high temperature M=1 suffices (classical limit). At low temperature you need M~100 or more to resolve quantum fluctuations.

**Bose statistics and permutations.** For bosons, the trace in Z must be taken over symmetrized states: Z = Σ_{permutations P} Tr[P e^{-βH}]. In the path integral, this means closing each path not necessarily on itself, but on any permutation of the other particles. A "world-line" of particle i can connect to world-line of particle j at imaginary time ℏβ. The system spontaneously develops long exchange cycles at temperatures below T_BEC. The superfluid fraction is directly proportional to the mean-square winding number of these cycles (Pollock-Ceperley formula):
$$\rho_s/\rho = \frac{m}{3\hbar^2 \beta} \langle W^2 \rangle \cdot L^2/N$$

where W is the winding number vector — how many times the aggregate world-line wraps around the periodic box.

**Metropolis sampling.** We sample the polymer configurations using the Metropolis algorithm with specialized moves:
1. **Single-bead displacement**: move one bead of one particle.
2. **Bisection move (Levy construction)**: regrow an entire segment of a path by sampling the free-particle bridge distribution, then accept/reject with the potential ratio. Dramatically more efficient than single-bead moves.
3. **Permutation sampling (worm algorithm or staging)**: propose closing the path of particle i onto particle j rather than itself. Crucial for Bose statistics.

**What you can measure.** PIMC gives exact (up to statistical error and Trotter error) results for: energy, pressure, specific heat, superfluid density, the pair distribution function, the momentum distribution (from the off-diagonal density matrix), and the one-body density matrix (condensate fraction). For helium-4 in particular, PIMC by Ceperley and Pollock (1987) gave the first first-principles confirmation of the λ transition — a landmark result.

Real-world domains: liquid helium, hydrogen under extreme pressure (metallic hydrogen), ultracold atomic gases (BEC), nuclear matter, and even quantum chemistry (proton quantum effects in water). PIMC is the gold standard for strongly-correlated quantum fluids where perturbation theory fails.

---

## The Fix

Implement PIMC for a 1D quantum harmonic oscillator first (exact solution known), then extend to 2D hard-disk bosons.

```python
import numpy as np
from numba import njit

# PIMC for 1D quantum harmonic oscillator
# Exact ground state energy = 0.5 * hbar * omega
# At finite T, E = 0.5 * hbar * omega / tanh(beta * hbar * omega / 2)

hbar = 1.0
m = 1.0
omega = 1.0
T = 0.5           # temperature in natural units (kB=1)
beta = 1.0 / T
M = 100           # Trotter slices (imaginary-time steps)
epsilon = beta / M  # imaginary-time step
lam = hbar**2 / (2 * m)  # kinetic prefactor

# Spring constant between adjacent beads
# From free-particle propagator: Gaussian with variance 2*lam*epsilon
k_spring = m / (2 * hbar**2 * epsilon**2)  # = 1/(2*lam*epsilon^2) in reduced units

# Initialize path: bead positions along imaginary time
# Shape: (M,) — closed path, beads[M] = beads[0]
path = np.random.normal(0, np.sqrt(lam * epsilon), M)

def potential(x):
    """Harmonic oscillator potential."""
    return 0.5 * m * omega**2 * x**2

def path_action(path):
    """Total Euclidean action."""
    S = 0.0
    for k in range(M):
        k_next = (k + 1) % M
        dx = path[k_next] - path[k]
        S += (m / (2 * hbar**2 * epsilon)) * dx**2  # kinetic spring
        S += epsilon * potential(path[k])              # potential
    return S

def energy_virial_estimator(path):
    """
    Virial energy estimator (lower variance than thermodynamic estimator).
    E_virial = (1/(2*beta)) + <x * dV/dx / 2>
    For HO: dV/dx = m*omega^2 * x
    """
    centroid = np.mean(path)
    kinetic_term = 1.0 / (2 * beta)  # classical-like term
    virial_term = np.mean(0.5 * m * omega**2 * path * path)
    return kinetic_term + virial_term

# Lévy bridge sampling for bisection moves
def levy_bridge_sample(r_left, r_right, n_steps):
    """Sample the midpoint of a free-particle bridge of length n_steps*epsilon."""
    t_left = n_steps * epsilon / 2
    t_right = n_steps * epsilon / 2
    sigma_bridge = np.sqrt(lam * t_left * t_right / (t_left + t_right))
    midpoint = (r_left * t_right + r_right * t_left) / (t_left + t_right)
    return midpoint + sigma_bridge * np.random.randn()

# PIMC Metropolis with bisection moves
n_warm = 10_000
n_samples = 100_000
energies = []
delta = 0.5  # single-bead step size

for step in range(n_warm + n_samples):
    # Single-bead move
    k = np.random.randint(M)
    k_prev = (k - 1) % M
    k_next = (k + 1) % M
    x_old = path[k]
    x_new = x_old + delta * np.random.randn()
    
    # Action change (only adjacent springs + local potential)
    dS = (m / (2 * hbar**2 * epsilon)) * (
        (path[k_next] - x_new)**2 + (x_new - path[k_prev])**2
        - (path[k_next] - x_old)**2 - (x_old - path[k_prev])**2
    ) + epsilon * (potential(x_new) - potential(x_old))
    
    if dS < 0 or np.random.rand() < np.exp(-dS):
        path[k] = x_new
    
    if step >= n_warm:
        energies.append(energy_virial_estimator(path))

E_mean = np.mean(energies)
E_err = np.std(energies) / np.sqrt(len(energies))
E_exact = 0.5 * hbar * omega / np.tanh(beta * hbar * omega / 2)

print(f"PIMC energy:  {E_mean:.4f} ± {E_err:.4f}")
print(f"Exact energy: {E_exact:.4f}")
print(f"Error: {abs(E_mean - E_exact)/E_exact * 100:.2f}%")
```

The key insight: the path forms a closed necklace. Each bead feels a harmonic spring from its neighbors (quantum kinetic energy) and the external potential (classical). The Metropolis sweep samples over all bead positions. The virial estimator gives much lower variance than the primitive (thermodynamic) estimator.

---

## The Wow Moment — Push It

Extend to N=16 helium-4 atoms in 2D with bosonic exchange. Show the world-line visualization: each atom is a colored ring, and at low temperature you see long exchange cycles form spontaneously — multiple rings link into a single giant polymer that winds around the periodic box. The winding number W becomes non-zero. Plot the superfluid fraction ρ_s/ρ vs. temperature — it drops sharply to zero at T_BEC, matching the theoretical BKT transition temperature.

Push further: vary the density. At low density, no superfluidity. At intermediate density, the lambda transition appears. At very high density, the system solidifies (bosonic solid). Show the three phases — normal fluid, superfluid, solid — as regions in a T vs. n phase diagram drawn live as the simulation sweeps parameters.

Final dramatic moment: run with fermion sign — change the permutation weight sign for odd permutations. The Monte Carlo variance explodes (the sign problem). The simulation becomes useless. "This is why quantum chemistry for electrons is still hard. Fermions are fundamentally harder than bosons. PIMC works beautifully for bosons. For fermions, we need a different weapon."

---

## The Interactive Demo

- **Number of particles N**: slider 1–32 (warning shown above N=16 for performance)
- **Temperature T**: slider 0.1–4.0 K (for He units) or 0.1–2.0 (natural units)
- **Trotter slices M**: slider 10–200 (convergence test mode shows energy vs M)
- **Statistics toggle**: Boltzmann / Bose / Fermi (sign problem warning for Fermi)
- **System toggle**: 1D harmonic oscillator (exact answer shown), 2D hard disks, 3D LJ helium
- **Visualization mode**: world-line diagram (bead rings), density histogram, pair correlation g(r)
- **Show permutation cycles**: toggle — color each exchange cycle differently; cycle length histogram shown
- **Winding number display**: live W_x, W_y shown; superfluid fraction plotted
- **Step-by-step mode**: one Monte Carlo move at a time, showing exactly which bead moved and whether the move was accepted
- **Energy estimator comparison**: toggle thermodynamic vs. virial estimator; show running variance of each

---

## Production Notes

**Code structure**: Three Python files. `pimc_core.py` — path data structure, action computation, Metropolis moves (single bead, bisection). `pimc_estimators.py` — energy (thermodynamic + virial), pair distribution, winding number, superfluid fraction. `pimc_viz.py` — Matplotlib animation of world-lines as colored rings.

**Visual layout**: Split screen. Left panel: 2D scatter of bead positions (all M slices for all N particles, each particle a different hue, imaginary-time axis adds z-depth with alpha). Right panel: live plots of energy and superfluid fraction vs. MC step.

**Key cinematic moments**: (1) The first bead necklace drawing itself, bead by bead, as the path initializes. (2) The first exchange permutation: two rings visibly swap — animate with a slow-motion frame, freeze frame, label "THIS is Bose-Einstein statistics." (3) The first winding number = 1 event: one polymer loop wraps around the entire box. Label: "Superfluidity: the quantum path wraps around the box." (4) Side-by-side T=4K (short rings, no permutations) vs. T=1K (long entangled rings, giant exchange cycles).

**Equations to show on-screen**: Z = Tr[e^{-βH}], Trotter factorization, Lévy bridge formula, Pollock-Ceperley winding number formula. Each equation appears as LaTeX overlay as the corresponding code is shown.

**Pacing**: First 10 min — build the single-particle path, prove it against exact answer. Next 10 min — add N particles and pair potential. Next 10 min — add Bose exchange permutations, show winding number. Final 5 min — the superfluid demo.

---

## Tags
`PIMC` `path-integral` `Monte-Carlo` `quantum-statistics` `Feynman` `partition-function` `thermal` `Python`

---

## Thumbnail

Split-panel image. Left half: a clean ring of 32 colored beads (a single quantum particle world-line) on a dark background, glowing magenta, looping back on itself. Right half: the same particles at low temperature — multiple rings linked into a single chain that spirals around the periodic box, colored in a rainbow gradient. Bold white text: "QUANTUM PARTICLES AS RINGS." Bottom: "Path Integral Monte Carlo — Full Build."
