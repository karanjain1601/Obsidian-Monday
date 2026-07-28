---
title: "How Materials Respond to Light (Time-Dependent DFT)"
id: A024
difficulty: 9.5/10
prereq: "A020"
concept: "TDDFT: time-dependent generalization of DFT; time-dependent Kohn-Sham equations; linear response TDDFT (Casida equations) gives optical absorption spectrum; adiabatic approximation for XC kernel; accurate for molecular excitations."
tags: [TDDFT, time-dependent-DFT, optical-absorption, Casida, Kohn-Sham, XC-kernel, Python, quantum-chemistry]
category: advanced
type: video-idea
---

# How Materials Respond to Light (Time-Dependent DFT)

**Alt title:** "Why Chlorophyll is Green: Quantum Chemistry of Light Absorption"
**Difficulty:** 9.5/10 | **Prereq:** A020 (DFT), quantum mechanics, Python/NumPy

---

## Opening Hook (0:00–1:00)

"Chlorophyll absorbs red and blue light and reflects green. That's why plants are green. But why does it absorb at those specific wavelengths and not others? The answer lies in the quantum mechanics of electron excitations in the molecule. And computing those excitations requires solving a time-dependent many-electron quantum problem — one of the most important calculations in computational chemistry."

A simulation starts. On screen: the benzene molecule, a hexagonal ring of carbon atoms. A simulated laser pulse — a Gaussian electric field — fires at the molecule. The electron density begins to oscillate. A Fourier transform of the oscillation appears: sharp peaks at specific frequencies. These are the UV absorption lines. "These peaks? They are the colors benzene absorbs. And we computed them from first principles — no experimental fitting, no adjustable parameters. Just the positions of the atoms and the laws of quantum mechanics."

"This is Time-Dependent DFT — the most widely used method for computing optical spectra of molecules."

---

## The Naive Attempt

The naive approach: solve the time-independent Kohn-Sham equations (standard DFT from A020) and try to read off excitation energies from the KS orbital energy differences.

```python
import numpy as np
from scipy.linalg import eigh

# Naive: use KS orbital energy differences as excitation energies
# This is the "independent particle" approximation — ignores Coulomb + XC kernel

# From a previous DFT calculation on H2 (simplified 1D model):
# KS eigenvalues: eps_1 (HOMO), eps_2 (LUMO), ...
# In atomic units

# Simulate KS eigenvalues for a 2-electron system (hydrogen molecule)
N_grid = 200
r_max = 10.0
r = np.linspace(0.01, r_max, N_grid)
dr = r[1] - r[0]

# Simple model: particle in a box KS eigenvalues
# (stand-in for actual DFT KS eigenvalues)
eps = np.array([-0.5, -0.1, 0.12, 0.31, 0.55])  # Hartree (schematic)
print("KS orbital energies (Hartree):")
for i, e in enumerate(eps):
    occ = "occupied" if i < 1 else "virtual"
    print(f"  eps_{i+1} = {e:.3f} Ha ({occ})")

# Naive excitation energies: just KS energy differences
print("\nNaive (KS-orbital-difference) excitation energies:")
for i in range(1, len(eps)):
    dE = eps[i] - eps[0]
    dE_eV = dE * 27.211  # convert Hartree to eV
    print(f"  1->{}%d: ΔE = {dE:.3f} Ha = {dE_eV:.2f} eV" .format(i+1, dE_eV))

# For H2: KS gap ≈ 0.6 Ha = 16.3 eV
# Experimental first excitation energy: 11.4 eV (B^1Σu+ state)
# Error: 43% — far too high!
# KS eigenvalue differences are NOT excitation energies.
print("\nKS gap for H2: ~16.3 eV. Experimental: 11.4 eV.")
print("Error: 43%. The KS orbital energies are NOT excitation energies.")
print("They are Lagrange multipliers in the DFT minimization.")
```

---

## The Moment of Failure

The KS orbital energy differences overestimate excitation energies by 30–50%. For organic dye molecules, the error is systematic: the computed absorption peak is 1–2 eV too blue-shifted (too high frequency). A simulated absorption spectrum appears on screen: the computed spectrum (blue) is shifted entirely to the left of the experimental spectrum (red). The colors match, but at the wrong wavelengths.

"The Kohn-Sham eigenvalues are NOT electron removal energies or excitation energies. Koopmans' theorem applies to Hartree-Fock, not DFT. The KS eigenvalues are mathematical artifacts — Lagrange multipliers in the variational problem. Using them directly as excitation energies is simply wrong."

The screen shows Janak's theorem: ∂E/∂f_i = ε_i^KS (where f_i is orbital occupation). This means ε_i is the derivative of the total energy with respect to orbital occupation — not the energy of a vertical excitation. You need the full time-dependent response of the electron density.

---

## Why It Broke — The Physics

A true vertical excitation energy is:
$$\Omega_I = E_I^{N-electron} - E_0^{N-electron}$$
This requires comparing two total energies: the excited state and ground state. DFT only computes the ground state. The many-body excited state involves a different arrangement of all electrons, not just one electron moving from one KS orbital to another. Exchange-correlation effects on excitation are significant: the excited electron polarizes all the other electrons (excitonic effects), and the Hartree-Fock exchange in the XC functional mixes in single-particle exchange between the excited electron and all occupied orbitals.

The Runge-Gross theorem (1984): for a given initial state, there is a one-to-one correspondence between the time-dependent density n(r,t) and the time-dependent external potential V_ext(r,t). This is the time-dependent analog of the Hohenberg-Kohn theorem. It justifies defining a time-dependent exchange-correlation potential V_xc[n](r,t) — a functional of the entire history of the density.

The time-dependent Kohn-Sham equations:
$$i\hbar\frac{\partial}{\partial t}\phi_i(r,t) = \hat{H}_{KS}(t)\phi_i(r,t)$$
$$\hat{H}_{KS}(t) = -\frac{\hbar^2}{2m}\nabla^2 + V_{ext}(r,t) + V_H[n](r,t) + V_{xc}[n](r,t)$$

This is a time-dependent Schrödinger equation for non-interacting electrons in an evolving effective potential. The density n(r,t) = Σ_i |φ_i(r,t)|² self-consistently determines V_H and V_xc.

---

## The One Concept

**Time-Dependent DFT (TDDFT)** is the time-dependent generalization of Kohn-Sham DFT that allows computation of electronic excitation energies and optical absorption spectra. It comes in two flavors: real-time TDDFT (propagate KS equations under a laser field, Fourier transform density response) and linear-response TDDFT (Casida equations — an eigenvalue problem for excitation energies).

**Real-time TDDFT.** Apply a delta-function kick: V_ext(r,t) = κ·r·δ(t) — a spatially uniform infinitesimal electric field impulse. Propagate the KS equations forward in time with a short timestep δt using the Crank-Nicolson scheme:
$$\phi_i(t+\delta t) \approx e^{-iH_{KS}(t)\delta t/\hbar}\phi_i(t) \approx \frac{1 - iH_{KS}\delta t/2\hbar}{1 + iH_{KS}\delta t/2\hbar}\phi_i(t)$$

At each step: (1) compute n(r,t), (2) update V_H and V_xc, (3) advance φ_i. Record the dipole moment μ(t) = ∫r·n(r,t)dr. The optical absorption spectrum is:
$$\alpha(\omega) \propto \omega \cdot \text{Im}\left[\tilde{\mu}(\omega)/\tilde{\kappa}(\omega)\right]$$

where μ̃(ω) is the Fourier transform of the time-domain dipole signal. Peaks in α(ω) are the electronic excitations.

**Linear-response TDDFT (Casida equations).** Rather than propagating in time, derive the excitation energies from a generalized eigenvalue problem. The response density δn(r,ω) = ∫χ(r,r',ω) δV_ext(r',ω)dr', where χ is the full interacting response function related to the non-interacting KS response function χ_s by the Dyson equation:
$$\chi = \chi_s + \chi_s (f_H + f_{xc}) \chi$$

Here f_H(r,r') = 1/|r-r'| is the Hartree kernel and f_xc(r,r',ω) = δV_xc(r,t)/δn(r',t') is the XC kernel — frequency-dependent in general, but approximated as frequency-independent in the **adiabatic approximation** (ALDA): f_xc^{ALDA}(r,r') = δ(r-r') d²ε_xc/dn².

In the molecular orbital basis, the Casida matrix equation is:
$$\begin{pmatrix} A & B \\ B^* & A^* \end{pmatrix} \begin{pmatrix} X \\ Y \end{pmatrix} = \Omega \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix} \begin{pmatrix} X \\ Y \end{pmatrix}$$

where A_{ia,jb} = δ_{ij}δ_{ab}(ε_a - ε_i) + K_{ia,jb} and B_{ia,jb} = K_{ia,bj}, with the coupling matrix K_{ia,jb} = ⟨ij|1/r₁₂|ab⟩ + ⟨ij|f_xc|ab⟩. The excitation energies Ω_I are the eigenvalues. For the Tamm-Dancoff approximation (TDA): B=0, and A becomes Hermitian — easier to solve.

**Adiabatic approximation.** The exact XC kernel f_xc(r,r',ω) is frequency-dependent and non-local. The adiabatic approximation ignores both: f_xc^{ALDA}(r,r',ω) ≈ f_xc^{LDA}(r,r') = δ(r-r') d²ε_xc^{LDA}/dn². This is exact for a uniform electron gas at ω=0, but misses: (1) double excitations (two electrons excited simultaneously), (2) charge-transfer states (electron transferred between distant molecules), (3) Rydberg states (diffuse excited states). Hybrid XC kernels (range-separated) partially fix charge-transfer failures.

**Accuracy.** For local excitations in organic molecules (π→π* and n→π* transitions), TDDFT with B3LYP/6-31G* gives excitation energies within 0.2–0.3 eV of experiment — good enough for predicting absorption colors of dyes, photoactive molecules, fluorescent proteins, solar cell sensitizers. For chlorophyll: TDDFT predicts the Soret band at 430 nm and Q-band at 680 nm, within 20 nm of experiment.

---

## The Fix

Implement real-time TDDFT on a 1D model system (soft Coulomb electrons in a harmonic trap).

```python
import numpy as np
from scipy.linalg import solve

# Real-time TDDFT for 2 electrons in a 1D harmonic trap
# V_ext = 0.5 * x^2 (harmonic confinement)
# Soft Coulomb interaction: v(x) = 1/sqrt(x^2 + 1) (avoids 1D divergence)
# ALDA exchange-correlation: LDA approximation

N = 200
x_max = 8.0
x = np.linspace(-x_max, x_max, N)
dx = x[1] - x[0]
N_elec = 2  # 2 electrons, spin-restricted (both in same KS orbital)

# DFT ground state (computed separately, use result here)
# For 2 electrons: both occupy phi_1(x)
# Simple approximation: phi_1 ~ exp(-x^2/2) / normalization
phi = np.exp(-x**2 / 2.0)
phi /= np.sqrt(np.sum(phi**2) * dx)
n_gs = 2 * phi**2  # ground state density

# Ground state KS Hamiltonian (simplified)
T_diag = np.ones(N) / dx**2
T_off = -0.5 * np.ones(N-1) / dx**2
T = np.diag(T_diag) + np.diag(T_off, 1) + np.diag(T_off, -1)
V_ext_gs = 0.5 * x**2

def soft_coulomb(x1, x2):
    return 1.0 / np.sqrt((x1 - x2)**2 + 1.0)

# Hartree potential
V_H = np.array([np.sum(n_gs * soft_coulomb(xi, x)) * dx for xi in x])

# LDA XC potential (1D uniform gas approximation)
def vxc_lda_1d(n):
    """1D ALDA exchange potential (approximate)."""
    return -n**(1.0/3.0)  # simplified 1D exchange

V_xc_gs = vxc_lda_1d(n_gs)
V_eff_gs = V_ext_gs + V_H + V_xc_gs
H_KS = T + np.diag(V_eff_gs)

# Solve for ground state KS orbital
from scipy.linalg import eigh
vals, vecs = eigh(H_KS)
phi_gs = vecs[:, 0]
phi_gs *= np.sign(phi_gs[N//2])  # phase convention

# Real-time TDDFT: apply delta-kick at t=0
kappa = 0.01  # kick strength (small for linear response)
phi_t = phi_gs.astype(complex) * np.exp(1j * kappa * x)  # kick = multiply by e^{i kappa x}
n_t = 2 * np.abs(phi_t)**2

# Time propagation using Crank-Nicolson
dt = 0.01    # atomic units of time
T_total = 50.0
n_steps = int(T_total / dt)
dipole = np.zeros(n_steps)

for step in range(n_steps):
    # Current density
    n = 2 * np.abs(phi_t)**2
    
    # Hartree potential (updated)
    V_H_t = np.array([np.sum(n * soft_coulomb(xi, x)) * dx for xi in x])
    
    # ALDA XC potential
    V_xc_t = vxc_lda_1d(n)
    
    V_eff_t = V_ext_gs + V_H_t + V_xc_t  # (no additional external field after kick)
    H_t = T + np.diag(V_eff_t)
    
    # Crank-Nicolson propagator: phi(t+dt) = (1 - iH dt/2)^{-1} (1 + iH dt/2) phi(t)
    A = np.eye(N, dtype=complex) + 0.5j * dt * H_t
    B = np.eye(N, dtype=complex) - 0.5j * dt * H_t
    rhs = B @ phi_t
    phi_t = solve(A, rhs)
    
    # Normalize (should stay normalized, small correction for numerics)
    phi_t /= np.sqrt(np.sum(np.abs(phi_t)**2) * dx)
    
    # Record dipole moment
    n = 2 * np.abs(phi_t)**2
    dipole[step] = np.sum(x * n) * dx

# Compute absorption spectrum via FFT
freq = np.fft.rfftfreq(n_steps, d=dt)
dipole_fft = np.fft.rfft(dipole)
alpha = freq * np.imag(dipole_fft) / kappa  # absorption cross section

# Convert to eV: 1 a.u. of energy = 27.211 eV, 1 a.u. time = 24.2 as
freq_eV = freq * 27.211 / (2 * np.pi)  # angular frequency to eV

print("TDDFT absorption spectrum computed!")
print(f"Dominant peaks at (eV): {freq_eV[np.argsort(alpha)[-3:]]}")
```

---

## The Wow Moment — Push It

Show the full TDDFT spectrum for benzene: 6 carbon atoms in a ring, 30 electrons. The delta-kick excites all modes simultaneously. The Fourier spectrum shows peaks at 7.1 eV (π→π*, experimental 7.0 eV), and 6.9 eV. The B2u and E1u states appear. Color-map the oscillating electron density: the density sloshes back and forth at the resonance frequency.

Then: apply a continuous laser field resonant with the 7.1 eV transition. Watch the density oscillation build up — Rabi oscillations. Push the laser intensity to the non-linear regime: see harmonic generation — the electron generates radiation at 2ω, 3ω, 5ω. "This is high-harmonic generation — the basis of attosecond laser physics — computed entirely from TDDFT."

Final frame: scan the laser wavelength and plot the transmitted intensity — watch the absorption dip appear exactly at the TDDFT-predicted wavelength. "This is why chlorophyll is green. Computed. Not measured."

---

## The Interactive Demo

- **Molecule selector**: 1D harmonic oscillator (analytical check), He atom, H₂, benzene (precomputed KS orbitals)
- **Kick strength κ**: slider 0.001–0.1 (show linearity; at large κ: non-linear effects appear)
- **Time propagation length**: slider 10–200 a.u. (frequency resolution improves with longer propagation)
- **XC approximation**: ALDA-LDA, ALDA-PBE, adiabatic hybrid (show differences in peak positions)
- **Tamm-Dancoff**: toggle TDA vs. full Casida (show small differences for local excitations)
- **Laser mode**: delta kick (linear response spectrum) OR continuous wave (selective excitation, Rabi oscillations)
- **Laser frequency ω**: slider across absorption window (show resonance buildup)
- **Density animation**: real-time visualization of n(x,t) oscillating — shows the "breathing mode"
- **FFT window function**: rectangular, Hanning, Blackman — show effect on spectral resolution

---

## Production Notes

**Code structure**: `tddft_rt.py` — real-time propagator, Crank-Nicolson, dipole collection. `tddft_casida.py` — Casida matrix construction, eigenvalue solver, oscillator strengths. `tddft_viz.py` — density movie, absorption spectrum with labeled peaks.

**Visual layout**: Left: real-time density animation — a color map of n(x,t) as time evolves. Right top: dipole moment μ(t) oscillating signal. Right bottom: absorption spectrum α(ω) — a sharp Lorentzian peak at the excitation energy.

**Key cinematic moments**: (1) The kick: at t=0, the electron density suddenly tilts — a sloshing motion begins. Slow-motion first 10 time steps. (2) The FT reveal: stop the simulation, apply FFT, watch the peak appear in the spectrum like a radio tower signal. (3) The Casida eigenvalue problem: show the matrix A as a color map; each element represents a coupling between pairs of KS transitions. The eigenvector components tell you "which orbital transitions mix to form the excited state." (4) Chlorophyll spectrum: show the computed and experimental spectrum overlaid — peaks matching. Shade the visible range (400–700 nm). Highlight the green gap (550–580 nm) where chlorophyll does NOT absorb — explaining the green color.

**Equations on screen**: Runge-Gross theorem statement, TD-KS equation, dipole kick V = κr δ(t), Casida matrix A and B, absorption α(ω) formula.

---

## Tags
`TDDFT` `time-dependent-DFT` `optical-absorption` `Casida` `Kohn-Sham` `XC-kernel` `Python` `quantum-chemistry`

---

## Thumbnail

Dark background. Left: a glowing chlorophyll molecule with overlaid absorption spectrum (red bar at 430 nm, red bar at 680 nm, white gap in the green). Right: a running Python terminal with the word "CONVERGED" and an absorption peak appearing. Center top: "WHY PLANTS ARE GREEN." Bottom: "TDDFT — Optical Spectra from First Principles."
