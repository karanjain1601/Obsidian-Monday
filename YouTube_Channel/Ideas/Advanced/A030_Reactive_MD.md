---
title: "Breaking Bonds in a Simulation (Reactive Molecular Dynamics)"
id: A030
difficulty: 9/10
prereq: "A029"
concept: "Reactive MD: force fields that allow bond formation/breaking; ReaxFF: bond order calculated from inter-atomic distances; charge equilibration (EEM); combustion, oxidation, catalysis simulations; AIREBO for hydrocarbons."
tags: [reactive-MD, ReaxFF, bond-order, charge-equilibration, combustion, catalysis, Python, molecular-dynamics]
category: advanced
type: video-idea
---

# Breaking Bonds in a Simulation (Reactive Molecular Dynamics)

**Alt title:** "Simulating Fire: Chemistry Without Quantum Mechanics"
**Difficulty:** 9/10 | **Prereq:** A029 (Force Fields), Python/NumPy

---

## Opening Hook (0:00–1:00)

"Watch this simulation." A cluster of methane molecules and oxygen atoms fills the screen. Temperature is set to 2500 K. The simulation starts. Within picoseconds: an O atom attacks a C-H bond. The hydrogen transfers to the oxygen. A hydroxyl radical is born. It attacks another methane. A chain reaction begins. Carbon dioxide and water molecules form spontaneously. "This is methane combustion. Simulated atom by atom, bond by bond, reaction by reaction — without any chemical reaction pathways programmed in advance."

"Standard molecular dynamics cannot do this. Its topology is fixed at the start: a bond that exists at t=0 exists forever. You cannot form new bonds. You cannot break old ones. But combustion, catalysis, corrosion, polymer degradation — all require bond breaking and forming. The solution? A force field that doesn't use a fixed bond list — it computes bond orders dynamically from interatomic distances at every timestep. This is ReaxFF."

---

## The Naive Attempt

Naive: use a standard MD force field (AMBER/CHARMM-like) and try to simulate a chemical reaction.

```python
import numpy as np

# Naive attempt: try to simulate H2 + O -> H2O with standard MD
# Standard MD: bonds are permanent, topology is fixed

# Define H2O molecule (pre-formed) and free O atom
# H2: 2 H atoms bonded, O: separate
N_atoms = 3
masses = np.array([1.008, 1.008, 16.0])  # H, H, O in amu
pos = np.array([
    [0.0, 0.0, 0.0],   # H1
    [0.74, 0.0, 0.0],  # H2 (H-H bond = 0.74 Angstroms)
    [0.37, 2.0, 0.0],  # O (approaching H2 from above)
])
vel = np.array([
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, -0.01, 0.0],  # O approaching H2 along y
])

# Standard AMBER-like force field
# PROBLEM: topology is fixed — the bond H1-H2 can NEVER break!
# The bond H1-O and H2-O can NEVER form!
# We pre-define only the H-H bond, because that's what exists at t=0.

# Fixed topology: only H-H bond exists
bonds = [(0, 1)]   # H1-H2
# No H-O bonds — so even if H and O come close, NOTHING happens
k_HH = 700.0    # kcal/mol/Ang^2 (H-H bond)
r0_HH = 0.74    # Ang

def standard_md_forces(pos, bonds):
    """Standard MD forces: fixed topology, no bond breaking/forming."""
    F = np.zeros_like(pos)
    
    for (i, j) in bonds:
        dr = pos[j] - pos[i]
        r = np.linalg.norm(dr)
        # Harmonic bond force (CANNOT break)
        F_bond = k_HH * (r - r0_HH) * dr / r
        F[i] += F_bond
        F[j] -= F_bond
    
    # LJ between non-bonded pairs (H-O interaction)
    for i in range(N_atoms):
        for j in range(i+1, N_atoms):
            if (i,j) in bonds or (j,i) in bonds:
                continue
            dr = pos[j] - pos[i]
            r = np.linalg.norm(dr)
            if r < 6.0 and r > 0.1:
                sigma = 2.5; eps = 0.1
                sr6 = (sigma/r)**6
                f_lj = 24*eps/r**2*(2*sr6**2 - sr6)
                F[i] += f_lj * dr
                F[j] -= f_lj * dr
    
    return F

# Run MD
dt = 0.001
n_steps = 5000
min_HO_dist = []

for step in range(n_steps):
    F = standard_md_forces(pos, bonds)
    vel += 0.5 * dt * F / masses[:, None]
    pos += dt * vel
    vel += 0.5 * dt * F / masses[:, None]
    
    r_HO = min(np.linalg.norm(pos[2] - pos[0]), np.linalg.norm(pos[2] - pos[1]))
    min_HO_dist.append(r_HO)

print("Standard MD with fixed topology complete.")
print(f"Minimum H-O distance reached: {min(min_HO_dist):.2f} Ang")
print(f"Did H2O form? {'NO' if min(min_HO_dist) > 1.0 else 'YES'}")
print(f"The O atom bounced off. No bond formed. No reaction possible.")
print(f"\nThe H-H bond is immortal in standard MD.")
print(f"Even at 10,000 K, H2 will NEVER react with O in standard MD.")
print(f"The topology is frozen. Chemistry is dead.")
```

---

## The Moment of Failure

The oxygen atom bounces off the hydrogen molecule — the LJ potential deflects it. No bond ever forms. Even if you push the O atom directly into an H atom with enormous velocity, the harmonic H-H spring pulls the H back. No chemical reaction can occur.

Show the energy vs. time: the H-H bond energy oscillates wildly (the H is stretched and compressed), but the bond never breaks. "In standard MD, bonds are modeled as springs. You can stretch a spring forever — it never snaps. Real bonds break at a finite energy (the dissociation energy). A harmonic spring has no dissociation."

The screen shows the Morse potential vs. harmonic approximation: V_Morse = D_e(1 - e^{-α(r-r0)})² → breaks at r→∞. V_harmonic = k(r-r0)² → grows to infinity, never breaking. "To simulate chemistry, we need a potential that breaks. ReaxFF does this by abandoning the bond list entirely."

---

## Why It Broke — The Physics

Standard force fields suffer from two coupled failures for reactive systems: (1) **Fixed topology**: the list of bonds is specified at initialization and never updated. Reactions require topology changes. (2) **Inappropriate bonding potential**: harmonic springs cannot break. Even Morse potentials fix the bond list.

ReaxFF (van Duin et al., 2001) solves this by replacing the bond list with a continuously varying **bond order** BO_{ij}, computed from the interatomic distance at every timestep:
$$BO_{ij}(r_{ij}) = \exp\left[p_{bo,1}\left(\frac{r_{ij}}{r_0^{\sigma}}\right)^{p_{bo,2}}\right] + \exp\left[p_{bo,3}\left(\frac{r_{ij}}{r_0^{\pi}}\right)^{p_{bo,4}}\right] + \exp\left[p_{bo,5}\left(\frac{r_{ij}}{r_0^{\pi\pi}}\right)^{p_{bo,6}}\right]$$

Here r₀^σ, r₀^π, r₀^{ππ} are reference distances for sigma, pi, and double-pi bond orders. As r→0: BO→1 (bond); as r→∞: BO→0 (no bond). The force is the derivative of the energy with respect to r, so if BO→0 smoothly, the force smoothly goes to zero — no bond discontinuity.

The ReaxFF energy:
$$E_{system} = E_{bond} + E_{over/under} + E_{val} + E_{pen} + E_{tors} + E_{conj} + E_{VdW} + E_{Coulomb}$$

Every term depends on bond orders. Critically: E_{VdW} and E_{Coulomb} are included between all pairs (including bonded), with a shielding that prevents double-counting. The charges q_i are determined dynamically by the **Electronegativity Equalization Method (EEM)**: at each timestep, solve a linear system to find charges that minimize the electrostatic energy subject to charge conservation. Charge transfer between atoms is continuous and chemical-environment-dependent.

---

## The One Concept

**Reactive Molecular Dynamics (Reactive MD)** uses force fields with bond-order-dependent potentials that continuously transition from bonded to non-bonded interactions as atomic distances change, allowing bonds to form and break dynamically without pre-specifying any reaction mechanism. ReaxFF is the most widely used example; AIREBO (Adaptive Intermolecular REBO) is used for carbon and hydrocarbon systems.

**ReaxFF: the engine.** The bond energy E_bond = Σ_{i<j} De·BO_{ij}·exp[p_be,1(1 - BO_{ij}^{p_be,2})]. This is a Morse-like function but parameterized by BO rather than r — as BO→0, E_bond→0 continuously. The over-coordination penalty E_over prevents an atom from forming too many bonds (e.g., carbon with 5 bonds): atoms have a "valency" and over-coordination is energetically penalized. Similarly, under-coordination is penalized.

**Angle and torsion terms.** In ReaxFF, angle E_val and torsion E_tors depend on BO: if any bond in the angle/torsion has BO→0, the angular penalty vanishes. This allows smooth bond-breaking without artificial angle forces on a nearly-broken bond.

**Charge equilibration (EEM/QEq).** At each MD step, solve for charges by minimizing: E_elec = Σ_i (χ_i q_i + η_i q_i²) + Σ_{i<j} q_i q_j J_{ij}(r_{ij}), subject to Σ_i q_i = Q_total. Here χ_i is the electronegativity, η_i the hardness, and J_{ij} a shielded Coulomb interaction. The solution is a linear system Aq = b, solved at every timestep. This makes charges responsive to the chemical environment: an H atom next to F (in HF) has a very different charge than next to C (in methane).

**AIREBO (Stuart et al. 2000).** For hydrocarbons, AIREBO (Adaptive Intermolecular REBO) uses the REBO potential (Brenner 1990) for covalent bonds — a many-body bond-order function based on Abell-Tersoff theory — plus a Lennard-Jones term for long-range interactions and a torsional correction. Unlike ReaxFF, AIREBO does not have charge equilibration (all C and H atoms are neutral). It is faster than ReaxFF and highly accurate for graphene, carbon nanotubes, fullerenes, diamond, and hydrocarbon combustion. The bond-order in REBO:
$$b_{ij} = \frac{1}{\sqrt{1 + \sum_{k\neq j} f_c(r_{ik}) g(\theta_{ijk}) e^{\lambda_{ijk}}}}$$

where g(θ) is an angular function penalizing non-ideal angles (promotes sp3 vs. sp2 geometries), and f_c is a smooth cutoff function. The total energy: E = Σ_{i<j} f_c(r_{ij})[V_R(r_{ij}) - b_{ij}·V_A(r_{ij})], where V_R is repulsive and V_A is attractive.

**Applications of Reactive MD.** (1) **Methane combustion**: ReaxFF correctly simulates the sequence CH₄ + O → CH₃ + OH → CH₂O → CHO → CO → CO₂, reproducing rate constants to within 2× of experiment. (2) **Graphene oxidation**: AIREBO shows how oxygen adsorbs onto graphene and etches holes at high temperature. (3) **Catalytic dehydrogenation**: ReaxFF simulates H₂ dissociation on platinum surfaces — the activation barrier emerges naturally from the force field without being programmed. (4) **Fracture mechanics**: breaking C-C bonds in carbon fiber under tension — the crack propagation follows the crystal lattice orientation. (5) **Polymer degradation**: thermal decomposition of PEEK, PTFE, polyethylene under extreme conditions.

**Cost vs. accuracy.** ReaxFF is ~100× slower than standard AMBER per step (due to EEM solve + BO computation for all pairs). But it enables processes that standard MD cannot touch at all. For systems requiring reactive chemistry at >10 ns timescales: ReaxFF is the tool. For shorter timescales with well-defined reaction pathways: ab initio MD (A025) gives more accuracy.

---

## The Fix

Implement a minimal bond-order-dependent potential (simplified AIREBO-like for 1D):

```python
import numpy as np
from scipy.linalg import solve

# Simplified reactive potential: bond-order based forces
# 1D test: H2 molecule being stretched by an approaching O radical
# Bond order model: BO(r) = exp(-alpha * (r - r0))

alpha_HH = 2.0   # Ang^{-1} (controls bond breaking sharpness)
r0_HH = 0.74     # Ang (H-H equilibrium)
D_e_HH = 4.52    # eV = 104 kcal/mol (H-H bond dissociation energy)

def bond_order_HH(r):
    """Smooth bond order: 1 at r0, 0 at r >> r0."""
    return np.exp(-alpha_HH * (r - r0_HH))

def bond_energy(r):
    """ReaxFF-like bond energy: De * BO * exp(p*(1-BO^q))."""
    BO = bond_order_HH(r)
    p_be1 = 1.5; p_be2 = 2.0
    return -D_e_HH * BO * np.exp(p_be1 * (1 - BO**p_be2))

def bond_force(r, dr_vec):
    """Force from bond energy gradient."""
    dr = 1e-5
    dE = (bond_energy(r + dr) - bond_energy(r - dr)) / (2 * dr)
    return -dE * dr_vec / r  # force vector on atom j (atom i gets -this)

# EEM charge equilibration (2-atom system)
def charge_equil(pos_H1, pos_H2, pos_O):
    """
    Solve for charges that minimize electrostatic energy.
    χ_H = 7.17 eV, η_H = 6.93 eV (Rappe-Goddard)
    χ_O = 8.74 eV, η_O = 8.00 eV
    Constraint: q_H1 + q_H2 + q_O = 0 (neutral system)
    """
    chi = np.array([7.17, 7.17, 8.74])   # electronegativities (eV)
    eta = np.array([6.93, 6.93, 8.00])   # hardnesses (eV)
    
    atoms = [pos_H1, pos_H2, pos_O]
    J = np.zeros((3, 3))
    for i in range(3):
        J[i, i] = 2 * eta[i]  # on-site: 2*hardness
        for j in range(i+1, 3):
            r_ij = np.linalg.norm(atoms[i] - atoms[j]) + 0.001  # shield at r=0
            # Shielded Coulomb (in a.u.: J_ij = 1/r_ij for unshielded)
            # In eV: multiply by 14.4 eV*Ang / e^2
            J[i, j] = J[j, i] = 14.4 / np.sqrt(r_ij**2 + 1.0)  # shielded
    
    # EEM system: J*q = -chi + lambda (Lagrange multiplier for charge constraint)
    # Extended system with constraint q_total = 0
    A = np.zeros((4, 4))
    A[:3, :3] = J
    A[:3, 3] = 1.0  # constraint row
    A[3, :3] = 1.0  # Lagrange multiplier column
    b = np.zeros(4)
    b[:3] = -chi
    b[3] = 0.0  # Q_total = 0
    
    result = solve(A, b)
    charges = result[:3]
    return charges

# 3-body simulation: H1, H2, O
N = 3
masses = np.array([1.008, 1.008, 16.0])  # amu; convert: 1 amu = 1.66e-27 kg

pos = np.array([[0.0, 0.0, 0.0],   # H1
                [0.74, 0.0, 0.0],  # H2
                [0.37, 2.0, 0.0]]) # O (approaching H2)
vel = np.array([[0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0],
                [0.0, -0.05, 0.0]])  # O approaching H2

dt = 0.001  # fs equivalent
bond_orders = []
charges_over_time = []

print("Reactive MD: O radical attacking H2 molecule")
print("Bond order evolves dynamically...")

for step in range(2000):
    r_HH = np.linalg.norm(pos[1] - pos[0])
    BO = bond_order_HH(r_HH)
    bond_orders.append(BO)
    
    # Compute charges
    charges = charge_equil(pos[0], pos[1], pos[2])
    charges_over_time.append(charges.copy())
    
    # Forces
    F = np.zeros((N, 3))
    
    # H-H reactive bond force
    dr_HH = pos[1] - pos[0]
    F_HH = bond_force(r_HH, dr_HH)
    F[0] -= F_HH
    F[1] += F_HH
    
    # O-H LJ (short range, will be replaced by bond as O approaches)
    for hi in range(2):
        dr_OH = pos[2] - pos[hi]
        r_OH = np.linalg.norm(dr_OH)
        BO_OH = np.exp(-alpha_HH * (r_OH - 1.0))  # O-H BO at r0=1.0 Ang
        if BO_OH > 0.01:  # bond forming
            F_OH = bond_force(r_OH, dr_OH) * BO_OH * 0.5
            F[hi] -= F_OH
            F[2] += F_OH
    
    # Velocity Verlet
    vel += 0.5 * dt * F / masses[:, None]
    pos += dt * vel
    vel += 0.5 * dt * F / masses[:, None]
    
    if step % 200 == 0:
        r_HH = np.linalg.norm(pos[1] - pos[0])
        r_OH1 = np.linalg.norm(pos[2] - pos[0])
        r_OH2 = np.linalg.norm(pos[2] - pos[1])
        print(f"  Step {step:4d}: H-H BO = {bond_orders[-1]:.3f}, "
              f"r(HH) = {r_HH:.2f} Ang, r(O-H) = {min(r_OH1,r_OH2):.2f} Ang, "
              f"q(O) = {charges[-1]:.3f}")

if bond_orders[-1] < 0.5:
    print("\nH-H BOND BROKEN! Reactive event occurred.")
else:
    print("\nH-H bond survived. Try higher O velocity or lower impact parameter.")
```

---

## The Wow Moment — Push It

Set up methane combustion: 20 CH₄ molecules + 40 O₂ molecules in a periodic box at 3000 K. Use a simplified ReaxFF implementation (or call the open-source ReaxFF via LAMMPS Python interface). Run for 100 ps. Show the species count vs. time: CH₄ and O₂ decreasing, H₂O and CO₂ increasing. The S-shaped reaction curve follows Arrhenius kinetics — extract the activation energy. Show individual bond-breaking events in slow motion: one C-H bond stretching, the BO dropping from 1 to 0, the H transferring to an O, the OH forming. "Every chemical reaction in this combustion simulation happened spontaneously — no reaction mechanism programmed."

---

## The Interactive Demo

- **System**: H₂ + O (hydrogen combustion), CH₄ + O₂ (methane combustion), graphene defect formation
- **Temperature**: slider 300–5000 K — reaction rate follows Arrhenius
- **O radical count**: slider 1–20 — shows autocatalytic behavior
- **Bond breaking visualization**: color each bond by its current BO (green=intact, yellow=weakening, red=broken)
- **Charge display**: show q_i on each atom; update in real time as chemistry occurs
- **Species tracker**: live count of CH₄, O₂, CO₂, H₂O, OH, H, etc.
- **Energy breakdown**: bond, angle, torsion, electrostatic — live stacked area chart

---

## Production Notes

**Code structure**: `reaxff_lite.py` — simplified bond order computation, EEM charge solve, force calculation. `reactions_viz.py` — bond visualization with BO-colored cylinders, species counter. `combustion.py` — setup methane/oxygen box, run reactive MD, analyze species trajectories.

**Visual layout**: Main: 3D molecular visualization with bonds colored by bond order (green→yellow→red as BO decreases). When a bond breaks: a flash animation (red burst). Inset: species count vs. time plot updating live. Bottom bar: current temperature and reaction rate.

**Key cinematic moments**: (1) The bond-breaking event in slow motion: freeze the simulation when BO(H-H) drops below 0.1. Show the bond order curve in real time — the BO tracing down from 1.0 to 0.0. Overlay the energy barrier. "That curve dropping to zero — that IS the chemical reaction." (2) Charge redistribution: show q(H) changing from +0.05 in neutral H₂ to +0.35 in nascent H-O as the O approaches. The EEM system continuously redistributing charge. (3) Combustion movie: start at t=0 with a random mixture; show the first reaction at t~1ps; then the cascade — 5 reactions, 20 reactions, 100. Species counter spinning up like a slot machine. (4) Comparison: standard MD run at same conditions — nothing happens. 100 ps of no chemistry. Then reactive MD: combustion in 10 ps.

**Equations on screen**: BO(r) formula, ReaxFF bond energy, EEM system Aq=-χ, AIREBO b_{ij} expression.

---

## Tags
`reactive-MD` `ReaxFF` `bond-order` `charge-equilibration` `combustion` `catalysis` `Python` `molecular-dynamics`

---

## Thumbnail

Dark background. Center: a methane molecule (CH₄) with an oxygen radical (red sphere) approaching. The C-H bond is colored red (BO = 0.3, nearly broken), and a small animated arc shows the H transferring to the O. Left side: a bond-order vs. distance curve with a highlighted point at the current BO. Bold white text: "BOND ORDER = 0.03. IT'S BREAKING." Bottom: "Reactive MD — Chemistry Without Quantum Mechanics."
