---
title: "Simulating the Strong Nuclear Force on a Grid (Lattice QCD Primer)"
id: A021
difficulty: 10/10
prereq: "None"
concept: "Lattice QCD: discretize spacetime on a 4D lattice; SU(3) gauge links U_μ(x); Wilson action S_W = β Σ Re Tr(1 - U_plaquette); quark fields on sites as Grassmann variables; HMC algorithm samples gauge configurations."
tags: [lattice-QCD, gauge-theory, SU3, Wilson-action, HMC, quark, strong-force, Python]
category: advanced
type: video-idea
---

# Simulating the Strong Nuclear Force on a Grid (Lattice QCD Primer)

**Alt title:** "Why Protons Weigh 100x Their Quarks (And How We Simulate It)"
**Difficulty:** 10/10 | **Prereq:** Quantum field theory basics, group theory, Python/NumPy

---

## Opening Hook (0:00–1:00)

Black screen. A single fact appears in white text: "A proton weighs 938 MeV. The quarks inside it together weigh about 9 MeV. Where does the other 99% come from?" Pause. "It comes from the strong nuclear force — specifically, from the energy stored in the gluon field binding the quarks. That binding is so strong that you can never pull the quarks apart. The field confines them forever. This is called color confinement, and it is one of the most important unsolved problems of the 20th century — except it was solved. By putting spacetime on a grid."

Cut to a spinning 4D hypercube lattice visualization. Each site glows; the links between sites pulse with color representing SU(3) gauge field values. "This is Lattice QCD — Quantum Chromodynamics on a discrete spacetime grid. We are going to simulate the strong nuclear force from first principles. The math is brutal. The code is real. And if we do it right, proton confinement falls out of a Monte Carlo simulation."

---

## The Naive Attempt

The naive attempt is to model the strong force using a simple scalar field: assign a real number to each lattice site and use a nearest-neighbor coupling.

```python
import numpy as np

# Naive attempt: scalar field theory on a 2D lattice
# This misses the entire gauge symmetry structure of QCD

Lx, Lt = 16, 16  # spatial, temporal extent
N = Lx * Lt       # total sites

# Scalar field phi at each site
phi = np.random.normal(0, 1, (Lx, Lt))

# Simple scalar action: S = sum_x [0.5*(d_mu phi)^2 + m^2/2 * phi^2 + lambda/4 * phi^4]
m_sq = 0.1
lam = 0.5

def scalar_action(phi):
    S = 0.0
    for x in range(Lx):
        for t in range(Lt):
            # Kinetic terms (finite difference derivatives)
            dphi_x = phi[(x+1)%Lx, t] - phi[x, t]
            dphi_t = phi[x, (t+1)%Lt] - phi[x, t]
            S += 0.5 * (dphi_x**2 + dphi_t**2)
            # Mass and interaction
            S += 0.5 * m_sq * phi[x, t]**2
            S += (lam / 4) * phi[x, t]**4
    return S

# Metropolis sampling
n_steps = 50_000
S = scalar_action(phi)
accepted = 0

for step in range(n_steps):
    x = np.random.randint(Lx)
    t = np.random.randint(Lt)
    phi_old = phi[x, t]
    phi[x, t] += np.random.uniform(-0.5, 0.5)
    S_new = scalar_action(phi)
    dS = S_new - S
    if dS < 0 or np.random.rand() < np.exp(-dS):
        S = S_new
        accepted += 1
    else:
        phi[x, t] = phi_old

# Try to measure "confinement" via string tension
# Measure Wilson loop W(R,T) = <Tr[path-ordered product around rectangle]>
# For scalar field: just multiply phi values — meaningless for confinement!
R, T_loop = 4, 4
W = np.mean([phi[0, 0] * phi[R, 0] * phi[R, T_loop] * phi[0, T_loop]
             for _ in range(1000)])

print(f"'Wilson loop' (scalar): {W:.6f}")
print(f"This tells us NOTHING about confinement. The physics is wrong.")
```

---

## The Moment of Failure

The scalar field simulation runs, the Wilson loop gives some number, but it has no relation to confinement. The potential between two "color charges" extracted from this model is flat — zero — not linearly rising. There is no string tension. No confinement.

The screen shows: V(R) vs. R from the scalar model — a flat line at zero. Then the QCD confinement potential from experiment — linearly rising V(R) ≈ σ·R with σ ≈ 1 GeV/fm (string tension). The caption: "A scalar field has no color. The strong force is mediated by color-charged gluons, transforming under SU(3). The mathematical object living on the lattice links is not a number. It is a 3×3 complex unitary matrix. And the action is not just a sum of squared differences — it's a trace over products of matrices around plaquettes."

The key failure written in red: "We forgot gauge symmetry. QCD has a local SU(3) gauge symmetry at every spacetime point. The gluon field is a connection — a Lie-algebra-valued 1-form. Replacing it with a scalar throws out the entire structure of the theory."

---

## Why It Broke — The Physics

Quantum Chromodynamics is a non-Abelian gauge theory with gauge group SU(3) — the group of 3×3 complex unitary matrices with determinant 1. Each quark carries one of three "colors" (r, g, b). Gluons carry two color indices and are the gauge bosons of the theory.

In the continuum, the gluon field is A_μ(x) ∈ su(3) — a Lie-algebra-valued 4-vector field. Under a local gauge transformation g(x) ∈ SU(3):
$$A_\mu(x) \to g(x) A_\mu(x) g^{-1}(x) - \frac{i}{g_s} \partial_\mu g(x) g^{-1}(x)$$

The field strength tensor is:
$$F_{\mu\nu} = \partial_\mu A_\nu - \partial_\nu A_\mu - ig_s [A_\mu, A_\nu]$$

The non-Abelian commutator [A_μ, A_ν] — absent in QED — means gluons interact with each other. This self-coupling causes asymptotic freedom (force weakens at short distances) and infrared slavery (force grows at long distances — confinement).

The Euclidean action:
$$S_{QCD} = \int d^4x \left[\frac{1}{2g_s^2}\text{Tr}(F_{\mu\nu}F^{\mu\nu}) + \bar{\psi}(\gamma_\mu D_\mu + m)\psi\right]$$

On the lattice, the continuum field A_μ is replaced by a **gauge link** — a group element U_μ(x) ∈ SU(3):
$$U_\mu(x) = \mathcal{P}\exp\left(ig_s \int_x^{x+\hat{\mu}} A_\mu \, dl\right) \approx e^{ig_s a A_\mu(x)}$$

Gauge transformations act as: U_μ(x) → g(x) U_μ(x) g†(x+μ̂). The plaquette — smallest gauge-invariant loop — is:
$$U_{\mu\nu}(x) = U_\mu(x) U_\nu(x+\hat{\mu}) U_\mu^\dagger(x+\hat{\nu}) U_\nu^\dagger(x)$$

Wilson's lattice action:
$$S_W = \frac{\beta}{3} \sum_{x,\mu<\nu} \text{Re Tr}[1 - U_{\mu\nu}(x)]$$

where β = 6/g_s². This action is gauge-invariant, reduces to the continuum action as a→0, and is the unique simplest choice.

---

## The One Concept

**Lattice QCD** is a non-perturbative formulation of QCD that discretizes spacetime on a 4D hypercubic lattice and samples the path integral over gauge field configurations using Markov Chain Monte Carlo. It is the only known method for computing the low-energy properties of QCD from first principles — confinement, hadron masses, the proton's quark content, nuclear forces.

**The path integral.** In Euclidean spacetime, the QCD partition function is:
$$Z = \int \mathcal{D}U \, \mathcal{D}\bar{\psi}\mathcal{D}\psi \; e^{-S_W[U] - S_F[\bar{\psi},\psi,U]}$$

Grassmann (fermionic) integrals ∫Dψ̄Dψ e^{-S_F} can be done analytically: det[M(U)] where M(U) is the Dirac matrix in the background gauge field U. The full measure becomes:
$$Z = \int \mathcal{D}U \; e^{-S_W[U]} \det[M(U)]$$

For pure gauge (quenched approximation, ignoring sea quarks): Z = ∫DU e^{-S_W[U]}.

**SU(3) group theory.** The gauge links U ∈ SU(3) are 3×3 unitary matrices with det=1. They have 8 real parameters (generators T^a = λ^a/2, Gell-Mann matrices). Haar measure — the unique left-and-right invariant measure on SU(3) — allows integration over the group manifold. For pure gauge MC, we generate SU(3) matrices distributed according to e^{-S_W}.

**The Wilson loop and confinement.** The static quark-antiquark potential is extracted from the expectation value of a rectangular Wilson loop W(R,T):
$$W(R,T) = \langle \text{Re Tr}[U_1 U_2 \cdots U_{2R+2T}] \rangle$$
At large T: W(R,T) ~ e^{-V(R)·T}. In the confined phase, V(R) = σ·R + C/R + const (string tension + Coulomb + constant). The string tension σ ≈ 0.18 GeV² is the defining observable of confinement.

**Hybrid Monte Carlo (HMC) algorithm.** Pure Metropolis for SU(3) is slow (large matrix changes needed). HMC introduces conjugate momenta π_μ(x) ∈ su(3) and samples the extended phase space with a fictitious Hamiltonian H = Σ ½Tr(π²) + S_W. A "molecular dynamics" trajectory with step size δτ evolves the system, and the end-point is accepted/rejected with Metropolis. The molecular dynamics is:
$$\dot{U}_\mu = i\pi_\mu U_\mu, \quad \dot{\pi}_\mu = -\frac{\partial S_W}{\partial U_\mu}$$

HMC is exact (no step-size error in the equilibrium distribution, only in efficiency) and handles the fermion determinant via pseudo-fermion fields.

**Hadron masses from the lattice.** To compute the proton mass: construct an interpolating operator O(x) = ε_{abc} u^a(x) u^b(x) d^c(x) (two up quarks, one down quark). Compute the two-point correlation function C(t) = ⟨O†(t)O(0)⟩ averaged over gauge configurations. At large t, C(t) ~ e^{-M_proton · t}. The proton mass falls out from an exponential fit. Lattice QCD now predicts M_proton to sub-percent accuracy, in agreement with experiment — a triumph of the method.

---

## The Fix

Implement SU(2) lattice gauge theory (simpler than SU(3): 2×2 matrices) in 2D to demonstrate confinement.

```python
import numpy as np
from numpy.linalg import det

# SU(2) lattice gauge theory in 2+1 dimensions
# Pure gauge, quenched approximation
# Wilson action: S = (beta/2) * sum_{plaquettes} Re Tr[1 - U_plaq]

Lx, Lt = 12, 12
beta_g = 2.0    # gauge coupling inverse (beta = 4/g^2 for SU(2))
DIM = 2         # 2+1D: links in x, t directions

# Initialize gauge links: U_mu(x) are 2x2 SU(2) matrices
# Parameterize as U = a0*I + i*(a1*s1 + a2*s2 + a3*s3), |a|=1
# Store as complex 2x2 arrays
def random_su2():
    """Generate a random SU(2) matrix from Haar measure."""
    a = np.random.randn(4)
    a /= np.linalg.norm(a)
    U = np.array([[a[0] + 1j*a[3], a[2] + 1j*a[1]],
                  [-a[2] + 1j*a[1], a[0] - 1j*a[3]]])
    return U

def identity_su2():
    return np.eye(2, dtype=complex)

# Links: shape (Lx, Lt, DIM, 2, 2)
# links[x, t, mu] = U_mu(x, t)
links = np.zeros((Lx, Lt, DIM, 2, 2), dtype=complex)
for x in range(Lx):
    for t in range(Lt):
        for mu in range(DIM):
            links[x, t, mu] = identity_su2()  # cold start

def get_plaquette(links, x, t):
    """Compute U_01(x,t) = U_x(x,t) U_t(x+1,t) U_x†(x,t+1) U_t†(x,t)"""
    xp = (x + 1) % Lx
    tp = (t + 1) % Lt
    Ux   = links[x,  t,  0]  # U_mu=0 at (x,t)
    Ut_r = links[xp, t,  1]  # U_mu=1 at (x+1,t)
    Ux_u = links[x,  tp, 0]  # U_mu=0 at (x,t+1)
    Ut   = links[x,  t,  1]  # U_mu=1 at (x,t)
    plaq = Ux @ Ut_r @ Ux_u.conj().T @ Ut.conj().T
    return plaq

def plaquette_action(plaq):
    """Wilson action for one plaquette."""
    return (beta_g / 2) * (1.0 - 0.5 * np.real(np.trace(plaq)))

def staple_sum(links, x, t, mu):
    """Sum of staples around link U_mu(x,t)."""
    staple = np.zeros((2,2), dtype=complex)
    # Upper staple (positive direction)
    xp = (x + 1) % Lx if mu == 0 else x
    tp = (t + 1) % Lt if mu == 1 else t
    nu = 1 - mu
    # Forward staple: U_nu(x+mu) * U_mu†(x+nu) * U_nu†(x)
    U_nu_fwd  = links[(x + (mu==0)) % Lx, (t + (mu==1)) % Lt, nu]
    U_mu_top  = links[(x + (nu==0)) % Lx, (t + (nu==1)) % Lt, mu]
    U_nu_back = links[x, t, nu]
    staple += U_nu_fwd @ U_mu_top.conj().T @ U_nu_back.conj().T
    # Backward staple
    xm = (x - (nu==0)) % Lx
    tm = (t - (nu==1)) % Lt
    U_nu_bwd  = links[xm, tm, nu]
    U_mu_bot  = links[xm, tm, mu]
    U_nu_fwd2 = links[(xm + (mu==0)) % Lx, (tm + (mu==1)) % Lt, nu]
    staple += U_nu_bwd.conj().T @ U_mu_bot.conj().T @ U_nu_fwd2
    return staple

def su2_project(M):
    """Project arbitrary 2x2 matrix to SU(2)."""
    a0 = 0.5 * np.real(np.trace(M))
    a = np.array([a0, 0.5*np.imag(M[0,1]+M[1,0]),
                      0.5*np.real(M[0,1]-M[1,0]),
                      0.5*np.imag(M[0,0]-M[1,1])])
    norm = np.linalg.norm(a)
    a /= norm
    return np.array([[a[0]+1j*a[3],  a[2]+1j*a[1]],
                     [-a[2]+1j*a[1], a[0]-1j*a[3]]])

# Cabibbo-Marinari (heatbath) update for one link
def update_link(links, x, t, mu):
    A = staple_sum(links, x, t, mu)
    # Old link
    U_old = links[x, t, mu]
    # Candidate: new SU(2) matrix
    U_new = random_su2()
    dS = (beta_g/2) * np.real(np.trace((U_old - U_new) @ A))
    if dS < 0 or np.random.rand() < np.exp(-dS):
        links[x, t, mu] = U_new

# Thermalization
n_therm = 500
for sweep in range(n_therm):
    for x in range(Lx):
        for t in range(Lt):
            for mu in range(DIM):
                update_link(links, x, t, mu)

# Measure average plaquette
plaq_vals = []
n_measure = 1000
for sweep in range(n_measure):
    for x in range(Lx):
        for t in range(Lt):
            for mu in range(DIM):
                update_link(links, x, t, mu)
    # Measure plaquette
    p = 0.0
    for x in range(Lx):
        for t in range(Lt):
            plaq = get_plaquette(links, x, t)
            p += 0.5 * np.real(np.trace(plaq))
    plaq_vals.append(p / (Lx * Lt))

print(f"Average plaquette <P> = {np.mean(plaq_vals):.4f} ± {np.std(plaq_vals):.4f}")
print(f"(Strong coupling limit: 0.0, weak coupling: 1.0)")
print(f"Confinement indicated by <P> << 1 at beta={beta_g}")
```

---

## The Wow Moment — Push It

Show the string tension measurement. Compute Wilson loops W(R,T) for R=1..4, T=1..8. Plot ln W(R,T) vs. T for each R — straight lines whose slopes give -V(R). Plot V(R) vs. R: see the linear rise (string tension) plus Coulomb correction. Fit: V(R) = σ·R - e/R + c. Extract σ in lattice units.

Then: vary β from 1.0 to 3.0 (strong to weak coupling). Show the string tension decreasing. At β ≈ 2.0 in 2D SU(2), the theory is in the "physical" region. Dramatic moment: the "roughening transition" where the flux tube between the quarks goes from rigid to fluctuating — visualized as a color map of the field strength between two static charges.

Final frame: show that for N_c=3 (SU(3)) and 4D, the simulation gives the proton mass to within 1% of experiment. Show the famous Hadron Spectrum Collaboration plot. "This is what it looks like when mathematics and computation meet the universe — and win."

---

## The Interactive Demo

- **Lattice size**: slider Lx=Lt=4 to 24 (4D mode CPU warning shown)
- **Gauge group**: SU(2) (real matrices, fast) or SU(3) (full 3×3, slow)
- **β (inverse coupling)**: slider 0.5–5.0 (confinement/deconfinement transition visible)
- **Temperature (Nt)**: slider 2–16 for temporal extent — deconfinement at high T
- **Wilson loop visualization**: render flux tube between two static sources as field-strength heatmap
- **Observables**: average plaquette, Polyakov loop (deconfinement order parameter), string tension from Wilson loops
- **Algorithm**: toggle Metropolis / Heatbath / HMC
- **Hot start / Cold start**: toggle — show they give same equilibrium
- **Topological charge**: display integer Q = (1/16π²)∫F∧F — color sectors

---

## Production Notes

**Code structure**: `su2_lattice.py` — SU(2) link generation, staple computation, heatbath update. `wilson_loop.py` — measurement of W(R,T) via path-ordered products. `observables.py` — plaquette, Polyakov loop, topological charge. `visualize_links.py` — color links by Re Tr[U] on 2D slice.

**Visual layout**: Primary: 2D color visualization of lattice links — each link colored by its plaquette value (red=disordered/confined, blue=ordered/deconfined). Secondary: Wilson loop W(R,T) as a heat map (R x T matrix of values). Third panel: string tension V(R) plot with linear fit.

**Key cinematic moments**: (1) The cold-start lattice (all links = identity, all plaquettes = 1) vs. the hot-start lattice (random SU(2) matrices) — show both thermalizing to the same equilibrium over 500 sweeps. (2) The flux tube forming between two static quarks — animate the field energy density developing a string-like shape. Color it like a glowing electric discharge. (3) Deconfinement transition: increase temperature (reduce N_t). Show the Polyakov loop going from near-zero (confined) to non-zero (deconfined) — a phase transition visible in a single number.

**Equations on screen**: Wilson action, plaquette definition, gauge link transformation, Wilson loop formula, V(R) = σR - e/R + C.

---

## Tags
`lattice-QCD` `gauge-theory` `SU3` `Wilson-action` `HMC` `quark` `strong-force` `Python`

---

## Thumbnail

A 4D hypercube lattice rendered in 3D perspective, with glowing colored links (red/orange for strong coupling, blue for weak). In the center: two bright white spheres connected by an electric-discharge-style flux tube. Bold text: "99% OF PROTON MASS IS GLUONS." Bottom: "Lattice QCD — Simulated." Rating badge: "DIFFICULTY 10/10."
