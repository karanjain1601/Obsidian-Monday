---
title: "Polymer Structure and Glass Transition"
aliases: ["Glass Transition Temperature", "Tg", "WLF Equation", "Polymer Chain Architecture", "Flory-Huggins Theory", "Polymer Crystallinity", "PDI Polydispersity", "Avrami Equation", "Free Volume Theory", "Tacticity"]
tags: [MaterialsScience, Polymers, GlassTransition, PolymerChemistry, secondary, undergraduate, graduate]
domain: MaterialsScience
difficulty: undergraduate|graduate
created: 2026-07-31
related: ["[[Pericyclic_Radical_and_Polymer_Chemistry]]", "[[Chemical_Thermodynamics]]", "[[Phase_Equilibria_and_Colligative_Properties]]", "[[_MOC_Chemistry_Master]]", "[[Nucleation_Growth_and_Solidification]]", "[[Diffusion_in_Solids_and_Ficks_Laws]]", "[[Stress_Strain_and_Elastic_Moduli]]", "[[Composite_Materials_and_Fiber_Reinforcement]]", "[[Thermal_Properties_and_Heat_Conduction]]", "[[Sustainable_Materials_and_Circular_Economy]]", "[[Polymer_Mechanics_and_Viscoelasticity]]", "[[Biomaterials_and_Biocompatibility]]", "[[Liquid_Crystals_and_Colloids]]", "[[_MOC_Polymers_Ceramics_and_Biomaterials]]"]
status: complete
---

# Polymer Structure and Glass Transition

> [!abstract] TL;DR
> Polymers are long-chain macromolecules whose bulk properties are dictated by chain architecture (linear/branched/crosslinked), molecular weight distribution (quantified by PDI = $M_w/M_n$), tacticity, and degree of crystallinity. The **glass transition temperature $T_g$** is the single most important thermal parameter: below it the material is glassy and brittle; above it the chains have enough mobility to be rubbery or viscous. The **WLF equation** $\log a_T = -C_1(T-T_\text{ref})/(C_2 + T - T_\text{ref})$ captures how relaxation times scale with temperature through the **free volume** mechanism, and it underlies everything from tire design to food packaging shelf life.

---

## Intuition

**Analogy:** Think of polymer chains as strands of cooked vs. uncooked spaghetti. Dry, uncooked spaghetti is rigid, brittle, and snaps cleanly — this is the **glassy state below $T_g$**. Cook it and the strands become limp, entangled, able to slide past one another with effort — this is the **rubbery state above $T_g$**. The transition isn't a sharp phase change like melting ice; it's a gradual unfreezing of molecular mobility, the temperature at which the chain segments acquire just enough thermal energy to shuffle their conformations on the timescale of an experiment.

Semi-crystalline polymers add another layer: the crystalline lamellae are like the rigid knots holding the spaghetti mass together. Even above $T_g$ the material retains mechanical integrity because the crystallites act as physical crosslinks, only melting at the sharper, higher $T_m$.

---

## How It Works

### Chain Architecture

Every polymer property begins with how chains are connected.

**Linear thermoplastics** are simple head-to-tail chains held together only by van der Waals forces and chain entanglements — they can be re-melted and reshaped. **Branched** chains disrupt chain packing, lowering crystallinity and density (LDPE vs. HDPE). **Crosslinked** networks introduce permanent covalent bridges between chains; light crosslinking gives elastomers, heavy crosslinking gives rigid thermosets (epoxies, vulcanized rubber, phenolic resins). Once cured, thermosets cannot be re-melted — the network topology is permanent.

| Architecture | Cross-link density | $T_g$ | Typical class |
|---|---|---|---|
| Linear | 0 | Low–moderate | Thermoplastic (PE, PVC) |
| Branched | 0 | Lower than linear equivalent | LDPE, glycogen |
| Lightly crosslinked | Low | Near linear $T_g$; broad rubbery plateau | Elastomers (SBR, NR) |
| Densely crosslinked | High | Elevated; depends on network density | Thermosets (epoxy, Bakelite) |

### Molecular Weight Distributions

Real polymers are polydisperse mixtures of chains with different lengths. Two averages matter most:

$$M_n = \frac{\sum_i N_i M_i}{\sum_i N_i} \qquad \text{(number-average, weights short chains equally)}$$

$$M_w = \frac{\sum_i N_i M_i^2}{\sum_i N_i M_i} \qquad \text{(weight-average, weighted toward long chains)}$$

The **polydispersity index** (PDI, sometimes called dispersity $\mathit{\DJ}$) is:

$$\text{PDI} = \frac{M_w}{M_n} \geq 1$$

Ideal living polymerization gives PDI → 1.0; radical chain-growth yields PDI ≈ 1.5–2.0; step-growth condensation yields PDI → 2.0 at high conversion (Flory's most-probable distribution); broad industrial grades reach PDI > 5. Mechanical toughness generally improves with moderate polydispersity because long chains carry load while short chains fill free volume.

The **degree of polymerization** $n$ is simply:

$$n = \frac{M_\text{polymer}}{M_\text{repeat unit}}$$

For a polyethylene chain of $M = 100{,}000$ g/mol with repeat unit $-\text{CH}_2\text{CH}_2-$ ($M_0 = 28$ g/mol), $n \approx 3{,}571$.

### Tacticity

When a vinyl polymer $[-\text{CHR}-\text{CH}_2-]_n$ is formed, each $\text{CHR}$ center is a new stereocenter. The spatial arrangement of the $\text{R}$ substituents along the backbone is **tacticity**:

- **Isotactic:** all R groups on the same side of the backbone → regular packing → **high crystallinity**, elevated $T_m$. Isotactic PP ($T_m = 165\,°C$) is crystalline; atactic PP is an amorphous wax.
- **Syndiotactic:** R groups alternate sides → still regular, somewhat crystalline.
- **Atactic:** random placement → **amorphous**; cannot crystallize; only has a $T_g$, no $T_m$.

PMMA is commercially atactic (amorphous, transparent), while isotactic PMMA can crystallize. PVC is mostly atactic but still develops some order due to the dipolar Cl groups.

### Chain Conformation and End-to-End Distance

A free chain in solution or the melt samples a random-walk ensemble of conformations. For a **freely jointed chain** of $n$ backbone bonds each of length $l$:

$$\langle r^2 \rangle_0^{1/2} = l\sqrt{n}$$

Real chains are stiffer than freely jointed because of fixed bond angles and hindered rotations. This is captured by the **characteristic ratio** $C_\infty$:

$$\langle r^2 \rangle_0^{1/2} = l\sqrt{n\, C_\infty}$$

$C_\infty = 6.7$ for polyethylene, $C_\infty = 9.5$ for polystyrene. The end-to-end distance distribution is Gaussian for $n \gg 1$:

$$P(r) = \left(\frac{3}{2\pi \langle r^2 \rangle_0}\right)^{3/2} \exp\!\left(-\frac{3r^2}{2\langle r^2 \rangle_0}\right)$$

The **radius of gyration** $R_g = \langle r^2 \rangle_0^{1/2}/\sqrt{6}$ is the experimentally accessible quantity from light or neutron scattering.

### Flory-Huggins Theory of Polymer Miscibility

Two polymers A and B mix spontaneously only if $\Delta G_\text{mix} < 0$. Flory-Huggins lattice theory gives:

$$\frac{\Delta G_\text{mix}}{n_\text{tot}\, kT} = \frac{\phi_A}{N_A}\ln\phi_A + \frac{\phi_B}{N_B}\ln\phi_B + \chi\,\phi_A\phi_B$$

where $\phi_A, \phi_B$ are volume fractions, $N_A, N_B$ are degrees of polymerization, and $\chi$ is the **Flory-Huggins interaction parameter** (measures monomer-pair enthalpic cost of contact):

$$\chi \approx \frac{v_\text{ref}}{kT}(\delta_A - \delta_B)^2$$

with $\delta$ being the solubility parameter. The entropic terms $\phi/N \cdot \ln\phi$ are much smaller than for small molecules (because $N$ is large), so **the enthalpic $\chi$ term dominates**. Miscibility requires $\chi < \chi_c$:

$$\chi_c = \frac{1}{2}\!\left(\frac{1}{\sqrt{N_A}} + \frac{1}{\sqrt{N_B}}\right)^{\!2}$$

For high molar mass ($N \to \infty$), $\chi_c \to 0$, meaning virtually any positive $\chi$ drives phase separation. This is why most polymer blends are immiscible — a miscible blend (e.g., PC/ABS, PS/PPO) requires specific favorable interactions (hydrogen bonds, dipole pairing) that make $\chi$ negative or very small.

### Crystallinity in Semi-Crystalline Polymers

Polymers never achieve 100% crystallinity — chain entanglement, chain ends, and defects always produce amorphous regions. The **semi-crystalline microstructure** at multiple length scales:

| Scale | Feature | Size |
|---|---|---|
| Atomic | Extended chain or folded-chain conformation in unit cell | 0.1–1 nm |
| Mesoscale | **Crystalline lamellae**: folded-chain plates | 10–20 nm thick |
| Micron | **Spherulites**: radiating stacks of lamellae from a nucleation centre | 1–100 µm |
| Macroscale | Interconnected amorphous matrix between spherulites | — |

The **degree of crystallinity** $X_c$ is measured by DSC (ratio of fusion enthalpy to that of 100% crystal), X-ray (crystalline peak area / total area), or density:

$$X_c = \frac{\rho_c(\rho - \rho_a)}{\rho(\rho_c - \rho_a)}$$

Crystallization kinetics follow the **Avrami equation**:

$$\boxed{1 - X_c(t) = \exp\!\left(-k\,t^n\right)}$$

where $k$ is a temperature-dependent rate constant and $n$ is the **Avrami exponent** (1–4, encoding nucleation mechanism and growth geometry: $n=3$ for sporadic nucleation of spheres; $n=1$ for instantaneous rod-like growth).

### Glass Transition Temperature $T_g$

The glass transition is a **second-order-like kinetic phenomenon**, not a true thermodynamic phase transition. Below $T_g$, chain segments are frozen: the polymer is glassy, with high modulus ($\sim$GPa range), low ductility, and brittle fracture. Above $T_g$, cooperative segmental motion unfreezes: the modulus drops by 3–4 orders of magnitude into the rubbery plateau or melt regime.

Key measurables: DSC shows a step change in heat capacity $\Delta C_p$ at $T_g$. DMA (dynamic mechanical analysis) shows a peak in loss modulus $E''$ and tan$\,\delta$. Dilatometry shows a kink in specific volume vs. temperature.

### The WLF Equation

Time-temperature superposition (TTS) works because changing temperature is equivalent to changing the timescale of an experiment — a fact embodied in the **Williams-Landel-Ferry (WLF) equation**:

$$\boxed{\log a_T = \frac{-C_1(T - T_\text{ref})}{C_2 + (T - T_\text{ref})}}$$

where $a_T = \tau(T)/\tau(T_\text{ref})$ is the shift factor (ratio of relaxation times). Taking $T_\text{ref} = T_g$, the **universal WLF constants** are $C_1 \approx 17.44$ and $C_2 \approx 51.6\,\text{K}$ for a wide range of amorphous polymers. The equation is empirically valid from $T_g$ to $T_g + 100\,\text{K}$; outside this range an Arrhenius form is more appropriate.

**Practical meaning:** at $T_g + 50\,\text{K}$ the relaxation time is roughly $10^{-6}$ of its value at $T_g$. Shifting temperature by 50 K can change viscosity by six orders of magnitude — critical for processing, tire performance in winter vs. summer, and food texture.

### Free Volume Theory

The most intuitive physical picture of $T_g$ is the **free volume theory** (Fox, Doolittle, Turnbull-Cohen). Free volume $v_f = v - v_0$ is the space not occupied by molecules themselves:

$$f = \frac{v_f}{v} \approx f_g + \alpha_f(T - T_g)$$

where $f_g \approx 0.025$ is the universal free volume fraction at $T_g$, and $\alpha_f \approx 4.8 \times 10^{-4}\,\text{K}^{-1}$ is the thermal expansion coefficient of free volume. $T_g$ is the temperature at which free volume collapses to $f_g$, freezing out segmental motion. The WLF constants derive directly from $f_g$ and $\alpha_f$: $C_1 = 1/(2.303\,f_g)$, $C_2 = f_g/\alpha_f$.

### Factors Affecting $T_g$

| Factor | Effect on $T_g$ | Mechanism |
|---|---|---|
| Molecular weight | Increases with $M_n$, plateaus at high $M$ | Chain ends contribute excess free volume: Fox-Flory $T_g = T_g^\infty - K/M_n$ |
| Crosslinking | Increases | Network topology reduces segmental freedom |
| Plasticizers | Decreases sharply | Small molecules increase free volume (PVC + DOP: $T_g$ drops from 87 °C to near room temp) |
| Bulky side groups | Increases | Steric restriction of backbone rotation (PS $T_g = 100\,°C$; PE $T_g = -120\,°C$) |
| Flexible side groups | Decreases | Acts as internal plasticizer (polyacrylate series: longer alkyl ester → lower $T_g$) |
| Polar/hydrogen-bonding groups | Increases | Intermolecular cohesion (nylon $T_g > $ HDPE $T_g$ at comparable backbone stiffness) |
| Copolymerization | Between homopolymer $T_g$'s | Fox equation: $1/T_g = w_1/T_{g1} + w_2/T_{g2}$ |

### Mermaid — Polymer Taxonomy and Thermal Transitions

```mermaid
graph TD
    POLY["POLYMER<br/>long-chain macromolecule<br/>repeat units connected covalently"]

    POLY --> THER["Thermoplastic<br/>linear or branched<br/>re-meltable"]
    POLY --> TSET["Thermoset<br/>densely crosslinked 3-D network<br/>irreversibly cured"]
    POLY --> ELAS["Elastomer<br/>lightly crosslinked<br/>large reversible strain"]

    THER --> AMORPH["Amorphous<br/>atactic or irregular chain<br/>only Tg; transparent"]
    THER --> SEMICRYS["Semi-crystalline<br/>isotactic or syndiotactic<br/>has Tg AND Tm"]

    SEMICRYS --> SPHER["Spherulites<br/>radiating lamellar stacks<br/>1-100 micron diameter"]
    SPHER --> LAM["Crystalline lamellae<br/>chain-folded plates<br/>10-20 nm thick"]

    AMORPH --> TG["Glass Transition Tg<br/>segmental motion unfreezes<br/>WLF kinetics; free volume"]
    SEMICRYS --> TG
    SEMICRYS --> TM["Crystal Melt Tm<br/>first-order; Tm always greater than Tg<br/>Avrami kinetics on cooling"]
    TSET --> TG
    ELAS --> TG

    style POLY fill:"#4a9eff",color:"#fff"
    style THER fill:"#51cf66",color:"#fff"
    style TSET fill:"#ff6b6b",color:"#fff"
    style ELAS fill:"#ffd43b",color:"#000"
    style AMORPH fill:"#a9e34b",color:"#000"
    style SEMICRYS fill:"#74c0fc",color:"#000"
    style TG fill:"#9c36b5",color:"#fff"
    style TM fill:"#e64980",color:"#fff"
    style SPHER fill:"#20c997",color:"#fff"
    style LAM fill:"#339af0",color:"#fff"
```

---

## Key Concepts

### Foundation (Secondary Level)

- A **polymer** is a giant molecule made by linking thousands of small identical units (monomers). Examples: polyethylene (plastic bags), nylon (clothing), rubber (tires).
- **$T_g$** is the temperature below which a polymer becomes hard and brittle — why HDPE is tough at room temperature but polystyrene foam cracks in the cold.
- **Thermoplastics** soften on heating and can be recycled; **thermosets** (epoxy, car bumpers) are permanently hard once set.
- **Crystallinity** makes polymers opaque (e.g., HDPE milk bottles); purely amorphous polymers are transparent (e.g., PMMA acrylic glass).

### Core Theory (Undergraduate Level)

**Degree of polymerization and averages.** $n = M/M_0$. Number-average $M_n$ is determined by colligative properties (osmometry); weight-average $M_w$ by light scattering. PDI = $M_w/M_n$ quantifies breadth.

**Tacticity and crystallinity.** Ziegler-Natta and metallocene catalysts produce stereoregular (isotactic/syndiotactic) polymers capable of crystallizing. Free-radical polymerization gives predominantly atactic chains. Crystallinity is measured by DSC: $X_c = \Delta H_f / \Delta H_f^0$ where $\Delta H_f^0$ is the enthalpy of fusion of a perfect crystal.

**$T_g$ measurement.** DSC at 10 K/min gives a midpoint $T_g$; dynamic mechanical analysis (DMA) at 1 Hz gives a slightly higher value (frequency dependence is a hallmark of a glass transition, not a true phase transition).

**WLF and TTS.** Master curves of viscoelastic modulus are constructed by shifting frequency-domain data horizontally by $\log a_T$. This underpins the Boltzmann superposition principle in polymer rheology.

**Common polymer properties table:**

| Polymer | $T_g$ (°C) | $T_m$ (°C) | $X_c$ (%) | Key use |
|---|---|---|---|---|
| HDPE | −120 | 137 | 60–80 | Bottles, pipes |
| LDPE | −110 | 115 | 30–50 | Films, bags |
| Isotactic PP | −10 | 165 | 50–70 | Automotive, textiles |
| PVC (rigid) | 87 | — (amorphous) | <10 | Pipes, window profiles |
| PMMA | 105 | — (amorphous) | 0 | Optical lenses, displays |
| PET | 73 | 265 | 0–50 | Bottles (clear = amorphous PET); fibers |
| Nylon-6,6 | 57 | 265 | 40–60 | Gears, fibers |
| PEEK | 143 | 343 | 30–35 | Aerospace structural parts |
| Polycarbonate | 150 | — (amorphous) | <5 | Safety glazing |
| Natural rubber (NR) | −73 | 36 | <5 (raw) | Tyres, gloves |

### Advanced Theory (Graduate Level)

**Flory-Huggins full treatment.** The free energy has entropic contributions $\propto (\phi_i/N_i)\ln\phi_i$ that are negligible for large $N$. The spinodal decomposition condition $\partial^2 \Delta G / \partial \phi^2 = 0$ gives the spinodal curve; the binodal (coexistence curve) requires equal chemical potentials. For symmetric blends ($N_A = N_B = N$), the critical point is at $\phi_c = 0.5$ and $\chi_c = 2/N$.

**LCST vs. UCST phase behavior.** Most polymer blends show **UCST** (upper critical solution temperature) — miscible when hot, phase-separated when cold — because $\chi$ decreases with $T$. Anomalously, some systems (PS/PVME, PEO/water) show **LCST** (lower CST) behavior driven by equation-of-state effects or specific interactions.

**Crystallization kinetics.** The Avrami exponent $n$ distinguishes mechanisms: $n = 1$ (instantaneous nuclei, 1-D growth), $n = 2$ (instantaneous, 2-D disc), $n = 3$ (instantaneous spheres or sporadic rods), $n = 4$ (sporadic spheres). Real polymers show $n \approx 2\text{–}4$ with the rate constant $k$ following a bell-shaped curve peaked between $T_g$ and $T_m$ (Turnbull-Fisher nucleation theory).

**Chain stiffness and persistence length.** The Kuhn segment length $b = C_\infty \cdot l$ (where $l$ is the backbone bond length) is the fundamental statistical unit. The persistence length $l_p = b/2$ (for worm-like chain) governs solution conformation. For DNA, $l_p \approx 50\,\text{nm}$; for PDMS, $l_p \approx 0.5\,\text{nm}$ — reflecting the enormous range of chain stiffness.

**Rubber elasticity.** Above $T_g$ in a crosslinked network, the retractive force is entirely entropic. The neo-Hookean constitutive model gives the shear modulus $G = \nu kT$ where $\nu$ is the crosslink density (chains per unit volume). This links chain-level statistics directly to macroscopic mechanical response.

---

## Python Demo

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gamma

# ── PART 1: Molecular Weight Distributions for different PDI ──────────────────

Mn = 50_000           # number-average molecular weight (g/mol)
M = np.linspace(500, 4e5, 4000)
PDI_values = [1.05, 1.5, 2.0, 3.5]
colors = ["#2196F3", "#4CAF50", "#FF9800", "#F44336"]

fig, axes = plt.subplots(1, 2, figsize=(13, 5))
fig.suptitle("Polymer Molecular Weight Distribution — Effect of PDI", fontsize=13, fontweight="bold")

for pdi, col in zip(PDI_values, colors):
    # Gamma(k, theta) parametrised so mean = Mn and PDI = 1 + 1/k
    k = 1.0 / (pdi - 1.0)
    theta = Mn / k             # scale: mean = k*theta = Mn
    
    f_n = gamma.pdf(M, a=k, scale=theta)        # number distribution f(M)
    f_w = M * f_n                                # weight distribution w(M) ∝ M·f(M)
    norm = np.trapz(f_w, M)
    f_w = f_w / norm if norm > 0 else f_w        # normalise to unit area
    
    Mw = pdi * Mn
    label = f"PDI={pdi:.2f}  Mw={Mw/1e3:.0f} kg/mol"
    axes[0].plot(M / 1e3, f_w * 1e3, color=col, lw=2, label=label)
    axes[1].semilogy(M / 1e3, np.clip(f_w * 1e3, 1e-8, None), color=col, lw=2, label=label)

for ax in axes:
    ax.axvline(Mn / 1e3, color="k", ls="--", lw=1.2, label=f"Mn = {Mn/1e3:.0f} kg/mol")
    ax.set_xlabel("Molecular Weight  M  (kg/mol)", fontsize=11)
    ax.legend(fontsize=8)
    ax.grid(True, alpha=0.25)

axes[0].set_ylabel("w(M)  (mol/g, normalised)", fontsize=11)
axes[0].set_title("Linear scale", fontsize=11)
axes[1].set_ylabel("log  w(M)", fontsize=11)
axes[1].set_title("Log scale — tail behaviour", fontsize=11)

# ── PART 2: WLF shift factor vs temperature ───────────────────────────────────

fig2, ax2 = plt.subplots(figsize=(7, 4))
C1, C2 = 17.44, 51.6          # universal WLF constants referenced to Tg
dT = np.linspace(0, 100, 300) # T - Tg (K)
log_aT = -C1 * dT / (C2 + dT)

ax2.plot(dT, log_aT, "navy", lw=2.5)
ax2.axhline(0, color="k", lw=0.8, ls="--")
ax2.set_xlabel("T − Tg  (K)", fontsize=12)
ax2.set_ylabel("log₁₀ aT  (decades)", fontsize=12)
ax2.set_title("WLF Shift Factor: relaxation time drops ~10 decades above Tg", fontsize=11)
ax2.annotate("−17.4 decades\nat Tg+100 K", xy=(100, log_aT[-1]),
             xytext=(70, -12), fontsize=9,
             arrowprops=dict(arrowstyle="->", color="gray"))
ax2.grid(True, alpha=0.25)

plt.tight_layout()
plt.savefig("polymer_mwd_wlf.png", dpi=130, bbox_inches="tight")
plt.show()

# Numerical check: Mw = PDI * Mn
print("Verification — Mw = PDI × Mn:")
for pdi in PDI_values:
    print(f"  PDI={pdi:.2f}  Mw = {pdi * Mn / 1e3:.1f} kg/mol")
```

Running this produces two figures: (1) the weight-fraction MWD for PDI = 1.05 to 3.5, showing how a narrow living-polymerization product (sharp blue peak) broadens progressively into the long-tailed distributions typical of industrial grades; (2) the WLF curve showing that relaxation time drops by ~10 decades between $T_g$ and $T_g + 100\,\text{K}$ — the physical basis for processing windows.

---

## Real-World Applications

> **PEEK in orthopedic implants.** PEEK ($T_g = 143\,°C$, $T_m = 343\,°C$, PDI typically 1.8–2.5 from ether-ether-ketone step-growth synthesis) is chosen for spinal fusion cages because its elastic modulus (~4 GPa) is close to cortical bone (~18 GPa) — far lower than Ti-alloy (110 GPa), reducing stress shielding. Its $T_g$ far above body temperature keeps it firmly in the glassy state in service; its $T_m$ well above autoclave sterilization (134 °C) allows steam sterilization. The semi-crystalline microstructure (30–35% crystallinity from spherulitic growth during slow cooling) provides creep resistance. ([[Biomaterials_and_Biocompatibility]])

> **PET bottles.** PET ($T_g = 73\,°C$) is injection-moulded from amorphous preforms, then stretch-blow-moulded at ~100 °C (just above $T_g$) to biaxially orient chains. Orientation-induced crystallization locks in ~20–30% crystallinity and dramatically increases barrier properties (CO₂ diffusivity drops $\sim 10\times$). The bottle is glassy at refrigerator temperature and remains so up to 70 °C (hot-fill requires special grade with $T_g + X_c$ modifications). See [[Diffusion_in_Solids_and_Ficks_Laws]] for the diffusion context.

> **Styrene-butadiene rubber (SBR) tires.** The $T_g$ of SBR is tuned between −50 °C and 0 °C by copolymer ratio. The WLF equation predicts that at 0 °C the relaxation time is $\sim 10^4\times$ longer than at 30 °C — the tire becomes stiffer and less damping, worsening wet grip. High-performance winter tire compounds are engineered with lower $T_g$ to maintain visco-elastic damping at sub-zero temperatures.

---

## Common Pitfalls

- **Confusing $T_g$ with $T_m$.** $T_g$ is a second-order kinetic transition; $T_m$ is a first-order thermodynamic melting. Amorphous polymers (PMMA, atactic PS, PC) have only $T_g$. Semi-crystalline polymers have both; they are not interchangeable as design limits.
- **Ignoring frequency/cooling-rate dependence of $T_g$.** DSC at 10 K/min gives a different $T_g$ than DMA at 1 Hz or dynamic loading at automotive frequencies. The WLF equation quantifies this — a 10× increase in frequency shifts the apparent $T_g$ upward by ~6–7 K.
- **Treating PDI as a single number.** PDI captures breadth but not shape. Two blends can have the same PDI with very different high-molecular-weight tail content — which controls melt strength and die swell.
- **Assuming crystallinity is equilibrium.** Polymer crystals are kinetically trapped. Slow cooling promotes higher $X_c$; quenching gives amorphous material. Annealing above $T_g$ but below $T_m$ (cold crystallization) can raise $X_c$ after the fact — critical for PET bottle opacity vs. clarity.
- **Flory-Huggins neglects local correlations.** The lattice model assumes random mixing. In block copolymers and highly polar systems, micro-phase separation and specific interactions are missed; self-consistent field theory (SCFT) or equation-of-state models are required.
- **Fox-Flory $T_g$ equation fails at low MW.** The relation $T_g = T_g^\infty - K/M_n$ is empirical and breaks down for oligomers where chain-end effects are non-trivial and free volume is discontinuously distributed.

---

## Related Concepts

**Same vault — Materials Science:**
- [[Nucleation_Growth_and_Solidification]] — the Avrami equation and spherulite growth kinetics are direct parallels of metal solidification nucleation theory
- [[Diffusion_in_Solids_and_Ficks_Laws]] — gas barrier properties of semi-crystalline polymers depend on tortuous diffusion through crystallites; Fickian diffusion applies above $T_g$
- [[Stress_Strain_and_Elastic_Moduli]] — the 3–4 decade drop in $E$ at $T_g$ (glassy to rubbery) is the defining mechanical signature; rubber elasticity is entropy-driven
- [[Composite_Materials_and_Fiber_Reinforcement]] — most polymer matrix composites (CFRP, GFRP) use thermoset epoxies; the matrix $T_g$ sets the hot/wet service limit
- [[Thermal_Properties_and_Heat_Conduction]] — thermal conductivity of amorphous polymers is low (~0.1–0.3 W/m·K); semi-crystalline polymers are slightly higher
- [[Sustainable_Materials_and_Circular_Economy]] — biopolymers PLA and PHA are discussed there; PLA $T_g \approx 58\,°C$, $T_m \approx 180\,°C$
- [[Polymer_Mechanics_and_Viscoelasticity]] — next note; the WLF master curve and rubber elasticity are treated in depth there
- [[Biomaterials_and_Biocompatibility]] — PEEK, UHMWPE, and PDMS applications depend critically on $T_g$ relative to body temperature (37 °C)
- [[Liquid_Crystals_and_Colloids]] — lyotropic and thermotropic LC polymers (Kevlar, LCPs) have ordered mesophases between $T_g$ and $T_m$
- [[_MOC_Polymers_Ceramics_and_Biomaterials]] — section map

**Chemistry vault:**
- [[Pericyclic_Radical_and_Polymer_Chemistry]] — chain-growth and step-growth mechanisms; Carothers equation for step-growth PDI → 2; tacticity from Ziegler-Natta vs. radical routes
- [[Chemical_Thermodynamics]] — Flory-Huggins $\Delta G_\text{mix}$ is applied polymer solution thermodynamics; LCST/UCST derive from excess entropy and volume effects
- [[Phase_Equilibria_and_Colligative_Properties]] — spinodal vs. binodal decomposition in polymer blends; osmotic pressure measurements give $M_n$
- [[_MOC_Chemistry_Master]] — cross-domain map

---

## Review Questions

**Foundation:**
1. A sample of polypropylene has $M_n = 80{,}000\,\text{g/mol}$ and $M_w = 200{,}000\,\text{g/mol}$. What is the PDI, and would you expect this sample to be suitable for fiber spinning? Why?

**Undergraduate (conceptual):**
2. Isotactic polypropylene ($T_g = -10\,°C$, $T_m = 165\,°C$) is used for injection-moulded automotive parts. Atactic polypropylene is a sticky amorphous wax. Both have identical chemical repeat units. Explain, using chain architecture and free volume concepts, why their thermal and mechanical properties differ so dramatically.

3. A polymer blend that is miscible at 200 °C phase-separates on cooling to 150 °C. A second blend is immiscible at 25 °C but becomes miscible on heating to 100 °C. Identify the phase-behavior type (UCST or LCST) for each system and state the sign of $\chi$ and its temperature dependence in each case.

**Graduate (quantitative/design):**
4. Using the WLF equation with universal constants ($C_1 = 17.44$, $C_2 = 51.6\,\text{K}$), calculate by how many orders of magnitude the relaxation time of an amorphous polymer changes when the temperature is raised from $T_g$ to $T_g + 40\,\text{K}$. A DMA experiment at 1 Hz locates $T_g = 100\,°C$. At what temperature would a 1 MHz ultrasonic measurement report the same glass transition?

5. DSC of a quenched PET sample shows a cold-crystallization exotherm at 130 °C followed by melting at 255 °C. Sketch and explain the heat-flow trace, and calculate the final degree of crystallinity if $\Delta H_\text{cold-cryst} = 25\,\text{J/g}$ and $\Delta H_\text{fusion} = 40\,\text{J/g}$, given $\Delta H_f^0(\text{PET}) = 140\,\text{J/g}$.

---

## Sources

- [W. D. Callister & D. G. Rethwisch — *Materials Science and Engineering: An Introduction*, 10th ed. (2018), Chapters 14–15](https://www.wiley.com/en-us/Materials+Science+and+Engineering%3A+An+Introduction%2C+10th+Edition-p-9781119405498)
- [G. R. Strobl — *The Physics of Polymers*, 3rd ed. Springer (2007)](https://link.springer.com/book/10.1007/978-3-540-68411-4)
- [P. J. Flory — *Principles of Polymer Chemistry*, Cornell University Press (1953)](https://www.cornellpress.cornell.edu/book/9780801401343/principles-of-polymer-chemistry/)
- [M. L. Williams, R. F. Landel, J. D. Ferry — "The Temperature Dependence of Relaxation Mechanisms in Amorphous Polymers", *J. Am. Chem. Soc.* 77, 3701 (1955)](https://pubs.acs.org/doi/10.1021/ja01619a008)
- [L. H. Sperling — *Introduction to Physical Polymer Science*, 4th ed. Wiley-Interscience (2006)](https://www.wiley.com/en-us/Introduction+to+Physical+Polymer+Science%2C+4th+Edition-p-9780471705536)

---

#MaterialsScience #Polymers #GlassTransition #PolymerChemistry #Tg #WLF #Crystallinity #FloryHuggins #PDI #Tacticity
