---
title: "From Atoms to Proteins (Coarse-Grained Molecular Dynamics)"
id: A028
difficulty: 8.5/10
prereq: "None"
concept: "CG-MD: group multiple atoms into a single bead; parameterize bead-bead interactions from all-atom simulations (force matching or structural inversion); MARTINI force field for lipids/proteins; enables µs-ms timescales."
tags: [coarse-grained-MD, MARTINI, force-field, protein, lipid, bead-model, Python, molecular-dynamics]
category: advanced
type: video-idea
---

# From Atoms to Proteins (Coarse-Grained Molecular Dynamics)

**Alt title:** "How to Simulate a Protein Folding in Real Time"
**Difficulty:** 8.5/10 | **Prereq:** Basic molecular dynamics, Python/NumPy

---

## Opening Hook (0:00–1:00)

"Protein folding. One of biology's greatest mysteries. A chain of amino acids — a sequence of letters — spontaneously folds into a precise 3D structure in microseconds. That structure determines function. Misfolding causes Alzheimer's, Parkinson's, Huntington's. Solving the folding problem from first principles is worth a Nobel Prize."

"An all-atom MD simulation of a 100-residue protein in water — 30,000 atoms — can simulate about 100 nanoseconds per day on a GPU cluster. The folding time is 1–100 microseconds. At that rate, folding takes 10 to 1000 days of continuous computation. For a single protein. With a single set of initial conditions."

"Coarse-grained molecular dynamics maps every 4 heavy atoms to one bead. Instead of 30,000 atoms: 2,000 beads. Instead of 100 ns/day: 1 millisecond/day. The folding time is now accessible. And remarkably — it still gets the folded structure right."

A protein chain appears, first as a tangle of atoms, then morphing into a simplified bead model. The bead model folds on screen in seconds. "Let's build the MARTINI force field from scratch."

---

## The Naive Attempt

The naive approach: just reduce the number of atoms by randomly deleting 75% of them and rescaling the interaction parameters.

```python
import numpy as np

# Naive coarse-graining: delete 3 out of 4 atoms, scale parameters
# This is NOT the right approach — you lose all structural information

# Simulate a short peptide: Gly-Ala-Gly-Ala (4 residues, ~28 atoms)
# All-atom: 28 atoms
# Naive CG: keep only Cα atoms (1 per residue = 4 beads)

# All-atom positions for Gly-Ala-Gly-Ala (schematic, in Angstroms)
# Each residue: N, Cα, C, O, (side chain)
gly_heavy = np.array([[0.0, 0.0, 0.0],   # N
                       [1.5, 0.0, 0.0],   # Cα
                       [2.5, 1.0, 0.0],   # C
                       [2.5, 2.2, 0.0]])  # O
ala_heavy = np.array([[3.5, 0.5, 0.0],   # N
                       [4.5, 0.5, 0.0],   # Cα
                       [5.5, 1.5, 0.0],   # C
                       [5.5, 2.7, 0.0],   # O
                       [4.5, -0.8, 0.0]]) # Cβ (side chain)

# Naive CG: just keep Cα atoms
ca_positions = np.array([
    gly_heavy[1], ala_heavy[1],
    gly_heavy[1] + np.array([7.0, 0.0, 0.0]),
    ala_heavy[1] + np.array([7.0, 0.0, 0.0])
])

print("Naive CG: keeping only Cα atoms.")
print("Number of CG beads:", len(ca_positions))
print("Problem 1: What is the effective mass of each bead?")
print("  - Gly residue: N + Cα + C + O = 14+12+12+16 = 54 amu")
print("  - Ala residue: + Cβ = 54+12 = 66 amu")
print("  - Using same mass for both: WRONG")
print()
print("Problem 2: What is the effective bead-bead potential?")
print("  - Naive: use LJ with same epsilon and sigma as atoms")
print("  - But beads represent GROUPS of atoms with complex free energy landscapes")
print("  - Simply rescaling LJ is thermodynamically wrong")
print()
print("Problem 3: What happened to electrostatics?")
print("  - Backbone N-H and C=O form hydrogen bonds: critical for secondary structure")
print("  - Naive CG: all charges vanish when you drop atoms")
print("  - Result: no alpha-helices, no beta-sheets. Protein doesn't fold.")

# Run naive CG MD
N_cg = 4
masses = np.array([54, 66, 54, 66], dtype=float)  # residue masses in amu
pos = ca_positions.copy()
vel = np.zeros((N_cg, 3))

# Naive LJ between Cα beads
sigma = 3.8  # Angstroms (Cα-Cα distance)
eps = 0.1    # kcal/mol

for step in range(1000):
    F = np.zeros((N_cg, 3))
    for i in range(N_cg):
        for j in range(i+1, N_cg):
            dr = pos[j] - pos[i]
            r = np.linalg.norm(dr)
            if r > 0.1:
                sr6 = (sigma/r)**6
                f_mag = 24*eps/r**2 * (2*sr6**2 - sr6)
                F[i] += f_mag * dr
                F[j] -= f_mag * dr
    # Verlet
    pos += 0.001 * vel + 0.5 * 0.001**2 * F / masses[:, None]
    vel += 0.001 * F / masses[:, None]

print("\nNaive CG simulation ran, but the protein structure is garbage.")
print("Secondary structure: NONE (no hydrogen bond model)")
print("Folded to correct structure: NO")
```

---

## The Moment of Failure

Run the naive CG simulation. Compute the end-to-end distance vs. time — it fluctuates randomly, never settling into a folded conformation. Compute the Ramachandran φ/ψ angles — they're uniformly distributed (random coil), not clustered in the alpha-helix or beta-sheet regions. "The naive CG protein has no secondary structure. It's a random coil in a tube. All the structure — the hydrogen bonds, the side-chain packing, the solvation energy — was thrown away when we deleted 75% of the atoms."

The failure is fundamental: coarse-graining is not just subsampling atoms. It requires computing the **potential of mean force** — the free energy surface of the CG beads, averaged over all the deleted degrees of freedom. This is a thermodynamic quantity, not a geometric one.

---

## Why It Broke — The Physics

The correct CG potential is the potential of mean force (PMF):
$$U_{CG}(R) = -k_B T \ln P_{AA}(R)$$

where P_{AA}(R) is the probability distribution of the CG bead positions in the all-atom ensemble, integrated over all atom positions consistent with bead positions R. The PMF includes the entropic contributions from the deleted degrees of freedom — the internal vibrations of each bead group — which can be large (several k_BT).

The Boltzmann inversion method (simplest parameterization): run an all-atom simulation, measure the distribution of CG bead distances P(r), and extract the effective pair potential: U(r) = -k_BT ln P(r). This is correct only in the dilute limit (no many-body effects). More sophisticated: iterative Boltzmann inversion (IBI) or force matching (FM). In force matching, find the CG forces that best match the instantaneous forces on the CG beads in the all-atom simulation: minimize Σ_t |F_{CG}(R_t) - F_{AA→CG}(R_t)|².

The resolution of information loss problem is addressed by the MARTINI force field (Marrink 2004/2007): a systematic CG mapping where 4 heavy atoms → 1 bead, with a fixed set of bead types (polar, nonpolar, charged, apolar) and pre-parameterized LJ parameters between all bead type pairs. The parameters were tuned to reproduce experimental partition coefficients (octanol/water) and thermodynamic properties.

---

## The One Concept

**Coarse-Grained Molecular Dynamics (CG-MD)** reduces the degrees of freedom of a molecular system by grouping atoms into "beads" and replacing the detailed atomic potential with an effective bead-bead interaction — the potential of mean force. The MARTINI force field (the most widely used CG-MD framework for biomolecules) maps 4 heavy atoms to 1 bead with approximately 4× the mass, 4× the LJ diameter, and a 4× larger timestep than all-atom MD — giving a speedup of ~100–1000× in accessible simulation time.

**MARTINI bead types.** MARTINI uses four main classes with subcategories:
- **Q beads** (charged): Qa (acceptor), Qd (donor), Q0 (no H-bond), etc. Mass ~72 amu.
- **P beads** (polar): P5 (strongly polar, like glycerol) to P1 (weakly polar). 
- **N beads** (nonpolar intermediate).
- **C beads** (apolar): C5 (slightly apolar) to C1 (strongly apolar, like aliphatic chain).

LJ parameters ε and σ are tabulated between all bead type pairs. σ = 0.47 nm for all regular beads (ring beads have σ = 0.43 nm). ε varies from 5.6 kJ/mol (strongly interacting) to 2.0 kJ/mol (weakly repulsive). Electrostatics: charged beads carry ±e or ±1.5e, screened with a relative dielectric constant of εr = 15.

**Protein CG mapping.** Each amino acid maps to a backbone bead (BB) representing the N-Cα-CO group, and 0–4 side chain beads (SC1-SC4) representing the side chain. Glycine: 1 bead total. Alanine: 2 beads. Tryptophan: 5 beads. The backbone bead type reflects the local secondary structure: BB beads in alpha-helices have enhanced H-bond donors/acceptors to maintain helix stability (MARTINI v2.2 uses an elastic network or Go-like model to maintain secondary structure).

**The elastic network model (ENM).** A major practical issue: MARTINI CG proteins denature during simulation because the secondary structure is not maintained by CG forces alone (H-bonds are implicit and weak). Solution: add harmonic restraints between all pairs of CG beads within a cutoff distance (r < 9 Å): V_ENM = k_ENM/2 (r - r₀)², where r₀ is the native-structure distance. These "rubber band" restraints maintain the tertiary fold while allowing local thermal fluctuations. For flexible proteins or proteins where folding is of interest, a Go-like model is used instead.

**Validation against all-atom simulations.** Correctly parameterized CG-MD should reproduce: (1) protein radius of gyration Rg vs. AA-MD (within 5%), (2) time-averaged backbone RMSD from native structure, (3) hydration free energies of side-chain analogs, (4) lipid area per lipid and membrane thickness (if lipids present), (5) diffusion coefficients (MARTINI CG-MD diffuses ~4× faster than real protein due to smoother CG potential — must be corrected by dividing time by 4).

**Bottom-up parameterization: iterative Boltzmann inversion.** (1) Run short all-atom simulation. (2) Measure radial distribution function g_{AA}(r) for each CG bead pair. (3) Compute initial CG potential: U^{(0)}(r) = -k_BT ln g_{AA}(r). (4) Run CG-MD with U^{(0)}, measure g_{CG}^{(0)}(r). (5) Update: U^{(n+1)}(r) = U^{(n)}(r) + k_BT ln [g_{CG}^{(n)}(r)/g_{AA}(r)]. (6) Iterate to convergence. Result: a numerical CG potential that exactly reproduces the all-atom structure. Transferability to other state points or chemistries is limited — the main tradeoff between IBI and MARTINI.

---

## The Fix

Implement a minimal MARTINI-inspired CG model for a DPPC lipid bilayer.

```python
import numpy as np

# Minimal MARTINI-inspired CG model for DPPC lipid
# DPPC = 1,2-dipalmitoyl-sn-glycero-3-phosphocholine
# MARTINI mapping: 12 CG beads per DPPC
# Head: NC3(Q+), PO4(Qa), GL1(Na), GL2(Na)
# Tail1: C1A, C2A, C3A, C4A (C1 beads)
# Tail2: C1B, C2B, C3B, C4B (C1 beads)

# Bead types and MARTINI LJ parameters (simplified)
# sigma for regular beads: 0.47 nm = 4.7 Angstroms
# epsilon: varies 2.0 - 5.6 kJ/mol; use kJ/mol units
sigma_mart = 4.7   # Angstroms
kB = 8.314e-3      # kJ/(mol K)
T = 323.0          # K (50°C, DPPC fluid phase)
beta = 1.0 / (kB * T)

# LJ epsilon matrix (simplified: just two types — charged/polar and apolar)
eps_PP = 5.0  # kJ/mol (polar-polar)
eps_PC = 2.5  # kJ/mol (polar-apolar: hydrophobic)
eps_CC = 3.5  # kJ/mol (apolar-apolar)

def eps_pair(type_i, type_j):
    """Get LJ epsilon for pair of bead types."""
    if type_i == 'C' and type_j == 'C':
        return eps_CC
    elif type_i == 'P' and type_j == 'P':
        return eps_PP
    else:
        return eps_PC

# DPPC bead types in MARTINI
dppc_types = ['P', 'P', 'P', 'P',    # head: NC3, PO4, GL1, GL2
               'C', 'C', 'C', 'C',   # tail 1: C1A-C4A
               'C', 'C', 'C', 'C']   # tail 2: C1B-C4B

N_lipid = 32
N_beads_per_lipid = 12
N_water = 200
N_total = N_lipid * N_beads_per_lipid + N_water

# Water bead type
water_types = ['P'] * N_water
all_types = []
for _ in range(N_lipid):
    all_types += dppc_types
all_types += water_types

# Initialize bilayer geometry (2 leaflets of 16 lipids each)
L = 20.0   # box in Angstroms
pos = np.zeros((N_total, 3))

for lipid_idx in range(N_lipid):
    bead_start = lipid_idx * N_beads_per_lipid
    # Upper leaflet: lipids 0-15 point down (+z head, -z tails)
    # Lower leaflet: lipids 16-31 point up (-z head, +z tails)
    xi = (lipid_idx % 4) * 5.0 + 2.5
    yi = (lipid_idx // 4) % 4 * 5.0 + 2.5
    
    if lipid_idx < N_lipid // 2:  # upper leaflet
        z_head = 16.0
        dz = -1.5  # beads stacked downward
    else:   # lower leaflet
        z_head = 4.0
        dz = +1.5  # beads stacked upward
    
    for bead in range(N_beads_per_lipid):
        pos[bead_start + bead] = [xi, yi, z_head + bead * dz]

# Water beads in the center (between the leaflets at z~10)
for wi in range(N_water):
    pos[N_lipid * N_beads_per_lipid + wi] = [
        np.random.uniform(0, L), np.random.uniform(0, L),
        np.random.uniform(8, 12)]

# MARTINI bonds within lipid (simplified harmonic)
bonds = []
for lipid_idx in range(N_lipid):
    start = lipid_idx * N_beads_per_lipid
    # Head chain: 0-1-2-3
    for b in range(3):
        bonds.append((start+b, start+b+1, 4.7, 1250))  # (i, j, r0 Ang, k kJ/mol/nm^2)
    # GL1 branches to both tails: 3-4, 3-8
    bonds.append((start+3, start+4, 4.7, 1250))
    bonds.append((start+3, start+8, 4.7, 1250))
    # Tails: 4-5-6-7 and 8-9-10-11
    for b in range(3):
        bonds.append((start+4+b, start+5+b, 4.7, 3800))
        bonds.append((start+8+b, start+9+b, 4.7, 3800))

print(f"MARTINI CG system initialized:")
print(f"  Lipids: {N_lipid} DPPC = {N_lipid * N_beads_per_lipid} CG beads")
print(f"  Water: {N_water} CG beads (each = 4 water molecules)")
print(f"  Total bonds: {len(bonds)}")
print(f"\nSpeedup vs. all-atom:")
N_AA = N_lipid * 130 + N_water * 4 * 3  # DPPC has ~130 atoms; each W bead = 4 waters
print(f"  All-atom atoms: ~{N_AA:,}")
print(f"  CG beads: {N_total}")
print(f"  CG factor: {N_AA/N_total:.0f}x fewer particles")
print(f"  Timestep factor: ~25x larger (20 fs vs. 0.8 fs)")
print(f"  Total speedup: ~{int(N_AA/N_total)**2 * 25:,}x faster!")
```

---

## The Wow Moment — Push It

Run the full MARTINI DPPC bilayer for 100 ns. Show: (1) the bilayer thinning and thickening in response to temperature changes — gel phase at 298K (DPPC Tm=314K), liquid-crystalline phase at 323K. (2) Insert a cholesterol molecule — show it inserting between the lipid tails and stiffening the bilayer. (3) Insert a transmembrane protein helix — show the protein tilting and rotating as the helix finds its preferred orientation within the membrane. (4) Measure the lateral diffusion coefficient of the lipids — D ~ 10^{-11} m²/s — and compare with fluorescence recovery experiments (FRAP). Match!

---

## The Interactive Demo

- **Lipid type**: DPPC, POPE (ether lipid), DPPS (charged), cholesterol
- **Membrane composition**: slider for DPPC/cholesterol ratio (0–40 mol%)
- **Temperature**: slider 280–340 K (gel↔fluid transition)
- **Embedded protein**: button to insert a TM alpha-helix
- **Water layer thickness**: control number of water beads
- **View mode**: all beads, just headgroups, just tails, cross-section slice
- **Analysis**: area per lipid, bilayer thickness, order parameter Scd
- **Animation speed**: real-time vs. time-lapse
- **IBI mode**: show potential-of-mean-force derivation (pre-computed comparison of all-atom g(r) vs. CG g(r))

---

## Production Notes

**Code structure**: `martini_types.py` — bead type definitions, LJ parameter table. `martini_lipid.py` — DPPC/POPE/cholesterol topology (bonds, angles). `cg_md.py` — force computation, velocity Verlet. `cg_analysis.py` — area per lipid, order parameter, diffusion. `cg_viz.py` — three.js 3D visualization with bead type coloring.

**Visual layout**: Primary: 3D bilayer visualization — headgroups as blue spheres, tail beads as orange chains, water as a subtle transparent cloud. Cross-section cut reveals the bilayer sandwich. Secondary: density profile n(z) showing head, tail, and water density layers — the classic MARTINI bilayer fingerprint.

**Key cinematic moments**: (1) CG mapping animation: zoom into a DPPC molecule; show all 130 atoms, then watch them collapse into 12 colored spheres (the MARTINI mapping). Show which atoms map to which bead type. (2) Gel-to-fluid transition: increase temperature from 295K to 330K. Watch the tightly packed lipids (gel: all tails vertical and ordered) melt into the fluid phase (disordered, wavy tails). The area per lipid jumps from 0.48 to 0.63 nm². (3) Cholesterol ordering effect: add cholesterol to one side of the bilayer. Watch that leaflet stiffen — cholesterol's rigid ring inserts between lipid tails. (4) Speedup visualization: show a stopwatch. "All-atom MD: 1 ns. 10 minutes." vs. "CG-MD: 100 ns. 10 minutes." Show the factor-of-100 speedup explicitly.

**Equations on screen**: PMF U_{CG} = -k_BT ln P(R), MARTINI LJ (σ=4.7 Å universal), IBI update formula, order parameter Scd = ½⟨3cos²θ-1⟩.

---

## Tags
`coarse-grained-MD` `MARTINI` `force-field` `protein` `lipid` `bead-model` `Python` `molecular-dynamics`

---

## Thumbnail

Split image. Left: a dense all-atom DPPC lipid (stick-and-ball model, ~130 atoms, rainbow colored by atom type). An arrow points right: "4 ATOMS → 1 BEAD." Right: the MARTINI CG version — 12 colored spheres (blue for head, orange for tail). Below: a full bilayer visualization from the CG simulation. Bold white text: "100,000x FASTER." Bottom: "MARTINI Force Field — Built from Scratch."
