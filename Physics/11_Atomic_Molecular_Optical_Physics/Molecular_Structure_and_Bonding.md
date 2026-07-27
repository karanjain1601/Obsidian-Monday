---
title: "Molecular Structure and Bonding"
aliases: ["Born-Oppenheimer", "MO Theory", "LCAO", "Molecular Orbital Theory", "Chemical Bonding"]
tags: [physics, amo-physics, molecular-physics, undergraduate, graduate]
domain: Physics
difficulty: secondary|undergraduate|graduate
created: 2026-07-27
related: ["[[Multi_Electron_Atoms]]", "[[Molecular_Spectroscopy]]", "[[_MOC_AMO_Physics]]"]
status: complete
---

# 🔗 Molecular Structure and Bonding

> [!abstract] TL;DR
> Molecules form when atoms share electrons in bonds. The Born-Oppenheimer approximation (nuclei move $\sim 1800\times$ slower than electrons) separates the problem into an electronic Schrödinger equation at fixed nuclear geometry plus a nuclear motion equation on the resulting potential energy surface. The simplest molecule, H₂⁺, is solved exactly by LCAO-MO theory — a bonding orbital lowers energy while an antibonding orbital raises it. Molecular symmetry (group theory) classifies states and predicts selection rules. At PhD level, van der Waals dispersion ($-C_6/R^6$), density functional theory, conical intersections, and non-adiabatic dynamics govern modern computational chemistry and photochemistry.

## Intuition — analogy FIRST

Two atoms approaching each other are like two ripples on a pond merging together. Where crests reinforce (wave functions add constructively), the electron density *between* the nuclei increases — this is the covalent bond. The electron cloud pulled between the nuclei lowers the electrostatic energy of the system (electrons near two nuclei simultaneously). Where crests cancel (destructive interference), electron density is *depleted* between the nuclei — this is the antibonding orbital; both nuclei feel only each other's repulsion and push apart.

---

## How It Works

```mermaid
graph TD
    A["Full molecular Hamiltonian\nH = Te + TN + Vee + VeN + VNN"] --> B["Born-Oppenheimer:\nsolve electronic problem at fixed R"]
    B --> C["Potential energy surface E_el(R)"]
    C --> D["Nuclear motion on PES:\nvibrational + rotational levels"]
    B --> E["LCAO-MO: ψ = c₁φA + c₂φB"]
    E --> F["Secular determinant → E±\nbonding / antibonding MOs"]
    F --> G["MO diagrams: H₂, N₂, O₂\n(fill MOs by Aufbau + Pauli)"]
    G --> H["Molecular symmetry groups\nCharacter tables → selection rules"]

    style A fill:#4a9eff,color:#fff
    style C fill:#ff6b6b,color:#fff
    style H fill:#51cf66,color:#fff
```

---

## Key Concepts / Details

### Secondary Level

**Covalent bonds** form when atoms share electrons — each contributes one electron to a shared pair occupying the space between the nuclei. Ionic bonds form by electron transfer (Na⁺Cl⁻), creating ions held together by electrostatic attraction.

**Lewis structures** represent bonds as shared electron pairs (lines) and lone pairs as dots. VSEPR (Valence Shell Electron Pair Repulsion) theory predicts molecular geometry: electron pairs (bonding + lone pairs) arrange to minimize mutual repulsion — giving linear (2 pairs), trigonal planar (3), tetrahedral (4), etc.

**Electronegativity** (Pauling scale) quantifies how strongly an atom attracts bonding electrons. Large electronegativity differences → ionic character; similar electronegativities → covalent.

### Undergraduate Level

**Born-Oppenheimer (BO) approximation:** Because nuclei are $\sim 1836 A$ times heavier than electrons (where $A$ is the mass number), they move much more slowly. For any instantaneous nuclear configuration $\mathbf{R}$, electrons relax quasi-statically to their ground state. The total wavefunction factorizes:

$$\psi_{mol}(\mathbf{r}, \mathbf{R}) \approx \psi_{el}(\mathbf{r}; \mathbf{R})\,\chi_{nuc}(\mathbf{R})$$

The electronic Schrödinger equation $H_{el}\psi_{el} = E_{el}(\mathbf{R})\psi_{el}$ is solved at each $\mathbf{R}$, producing the **potential energy surface (PES)** $E_{el}(\mathbf{R})$ on which nuclei move.

**H₂⁺ molecular ion — LCAO-MO:** The simplest molecule: one electron, two protons. The molecular orbital is a linear combination of atomic orbitals:

$$\psi_\pm = \frac{1}{\sqrt{2(1 \pm S)}}(\phi_A \pm \phi_B)$$

where $S = \langle\phi_A|\phi_B\rangle$ is the overlap integral. The secular determinant gives energies:

$$E_\pm = \frac{H_{AA} \pm H_{AB}}{1 \pm S}$$

- $\psi_+$ (bonding, $\sigma_{1s}$): constructive interference between nuclei → electron density *increases* in the internuclear region → bonding ($E_+ < E_{atom}$)
- $\psi_-$ (antibonding, $\sigma_{1s}^*$): nodal plane between nuclei → electron density depleted → antibonding ($E_- > E_{atom}$)

**Valence bond (Heitler-London) vs MO theory:**
- *Valence bond*: start from atomic states; bond forms when electrons on different atoms with opposite spins exchange
- *MO theory*: start from delocalized molecular orbitals spanning the whole molecule; fill by Aufbau + Pauli. MO theory is generally more tractable computationally.

**Molecular orbital diagrams:** For diatomics, MOs are filled in order of increasing energy. O₂ has two degenerate $\pi^*$ antibonding orbitals each singly occupied (Hund's rule) → triplet ground state $^3\Sigma_g^-$ → O₂ is paramagnetic, a prediction of MO theory that valence bond theory failed to give.

**Molecular symmetry and group theory:** Molecules belong to point groups ($C_{2v}$: H₂O; $D_{6h}$: benzene; $T_d$: CH₄). Character tables classify electronic states and vibrational modes by symmetry species (irreducible representations). Electric dipole transitions are allowed only if $\Gamma_{upper} \otimes \Gamma_{dipole} \otimes \Gamma_{lower}$ contains the totally symmetric representation.

**Hybridization:** Atomic $s$ and $p$ orbitals mix to form:
- $sp$ hybrids: 2 hybrid orbitals, 180° apart (BeH₂, acetylene)
- $sp^2$: 3 hybrids, 120°, one unhybridized $p$ for $\pi$ bond (ethylene, benzene)
- $sp^3$: 4 hybrids, tetrahedral 109.5° (methane, water)

### Graduate Level

**Van der Waals interactions:** For neutral, non-polar atoms or molecules, instantaneous fluctuating dipoles induce correlated dipoles on neighbors. The resulting **London dispersion** energy is:

$$V_{disp}(R) = -\frac{C_6}{R^6} - \frac{C_8}{R^8} - \cdots$$

where $C_6 = \frac{3}{2}\frac{\alpha_A\alpha_B}{\alpha_A/I_A + \alpha_B/I_B}$ (London formula, $\alpha$ = polarizability, $I$ = ionization energy). At shorter range, exchange repulsion (Pauli exclusion, not electrostatics) creates the $+C_{12}/R^{12}$ term of the Lennard-Jones potential. The full **Casimir-Polder** formula accounts for retardation (finite speed of light), changing $R^{-6}$ to $R^{-7}$ at large separations.

**Hückel theory for aromatic molecules:** For $\pi$-electron systems (planar conjugated molecules), each carbon contributes one $p_z$ orbital. The Hückel secular determinant with resonance integral $\beta$ and overlap integral $S \approx 0$ gives $\pi$ MO energies. Benzene: 6 carbons → 6 MOs at energies $E = \alpha + 2\beta\cos(2\pi k/6)$, $k = 0,...,5$. The delocalization (resonance) energy stabilizes aromatic molecules.

**Density functional theory (DFT):** The Hohenberg-Kohn theorem (1964) proves that the ground-state energy is a unique functional of the electron density $n(\mathbf{r})$: $E[n]$. The Kohn-Sham equations replace the many-body problem with a set of effective single-particle equations with an exchange-correlation functional $E_{xc}[n]$. DFT scales as $O(N^3)$ vs $O(N^5)$ or worse for correlated methods, enabling calculation of molecules with thousands of atoms.

**Conical intersections and non-adiabatic dynamics:** Where two PES touch (conical intersection), the Born-Oppenheimer approximation breaks down — the non-adiabatic coupling $\langle\psi_1|\nabla_R H|\psi_2\rangle/\Delta E$ diverges. At a conical intersection, population can transfer non-radiatively between electronic states on a femtosecond timescale. This is central to photochemistry: retinal photoisomerization in vision, DNA photoprotection, photosynthetic energy transfer all involve conical intersections.

---

## Real-World Notes

- **Drug design:** DFT and force-field calculations predict how drug molecules bind to protein active sites via hydrogen bonds, van der Waals contacts, and electrostatic interactions.
- **Organic semiconductors (OLEDs):** Conjugated $\pi$ systems (Hückel description) with controlled HOMO-LUMO gaps emit light of tunable wavelength; delocalization determines charge transport.
- **Gecko adhesion:** Van der Waals forces between setae (nanoscale hairs) and surfaces generate macroscopic adhesion — purely dispersion forces, no chemical bond.
- **Photosynthesis:** Conical intersections in chlorophyll-like pigments enable near-unity quantum efficiency of energy transfer to the reaction center.

---

## Common Pitfalls

- **BO approximation can fail** wherever PES come close in energy (conical intersections, Jahn-Teller distortions) — these are not rare edge cases but common in photochemistry.
- **MO theory overcounts ionic configurations** (both electrons on one nucleus) in the dissociation limit, making its description of bond breaking qualitatively wrong without configuration interaction.
- **Hybridization is a computational device**, not a physical mechanism — orbitals hybridize because the Hamiltonian mixes $s$ and $p$ character, not because of a separate "hybridization step."
- **$C_6/R^6$ dispersion is always attractive** between like or unlike molecules — London dispersion is never repulsive at long range.

---

## Related Concepts

- [[Multi_Electron_Atoms]] — atomic orbitals are the building blocks of LCAO-MO theory
- [[Molecular_Spectroscopy]] — spectral transitions probe the PES and molecular energy levels
- [[_MOC_AMO_Physics|↑ Section MOC]]

---

## Review Questions

1. **(Secondary)** Draw the Lewis structure of NH₃. Use VSEPR to predict its geometry and bond angle. Why is the H-N-H angle slightly less than tetrahedral?
2. **(Undergraduate)** Using LCAO-MO theory for H₂⁺, explain why the bonding MO has lower energy than the isolated H atom. Write the secular determinant and express $E_\pm$ in terms of $H_{AA}$, $H_{AB}$, and $S$. What is the bond order of H₂?
3. **(Graduate)** State the Hohenberg-Kohn theorem. What is the significance of the exchange-correlation functional $E_{xc}[n]$ and why is it approximated in practice? Explain what a conical intersection is and why it makes the Born-Oppenheimer approximation break down.

---

## Sources

- Atkins & de Paula, *Physical Chemistry*, Part 2 (quantum chemistry, MO theory, symmetry)
- Szabo & Ostlund, *Modern Quantum Chemistry* (Hartree-Fock, DFT, correlation methods)
- Koch & Holthausen, *A Chemist's Guide to Density Functional Theory*
- Domcke, Yarkony & Köppel (eds.), *Conical Intersections* (non-adiabatic dynamics)
- London, F. (1930), Z. Physik. Chem. B 11, 222 (original dispersion force paper)

#physics #amo-physics #molecular-physics #Born-Oppenheimer #LCAO-MO #DFT #van-der-Waals #conical-intersections
