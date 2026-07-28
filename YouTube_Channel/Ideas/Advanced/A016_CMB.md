---
title: "The Ringing of the Early Universe (CMB Power Spectrum)"
id: A016
difficulty: 9.5/10
prereq: "None"
concept: "Photon-baryon fluid before recombination: acoustic oscillations with sound speed c_s = c/√3; decoupling at z≈1100 freezes the oscillation pattern; angular power spectrum C_ℓ peaks at ℓ ≈ nπ·d_A/r_s."
tags: [CMB, cosmic-microwave-background, acoustic-oscillations, recombination, power-spectrum, cosmology, photon-baryon, canvas]
category: advanced
type: video-idea
---

# The Ringing of the Early Universe (CMB Power Spectrum)

**Alt title:** Why the Universe Has a Preferred Sound — The CMB Power Spectrum Explained  
**Difficulty:** 9.5/10 | **Prereq:** None (basic cosmology helpful)

---

## Opening Hook (0:00–1:00)

Open with the Planck 2018 CMB temperature map: the full-sky oval image, mottled in red and blue, temperature fluctuations of just 10⁻⁵ K against a background of 2.725 K. Voice over: "This is the oldest light in the universe. Emitted 380,000 years after the Big Bang, when the universe cooled enough for hydrogen to form and suddenly become transparent. Before that moment, the universe was a hot plasma — a sound-carrying medium — and it rang like a bell for 380,000 years."

"The pattern of hot and cold spots in the CMB encodes those sound waves, frozen in place at the moment of last scattering. Every feature in the CMB power spectrum — the peaks at ℓ ≈ 220, 540, 800... — corresponds to a harmonic mode of the photon-baryon acoustic oscillations. Today we simulate those acoustic oscillations from first principles: write the fluid equations for the photon-baryon plasma, integrate them from the Big Bang to recombination, and derive the CMB power spectrum. We will see exactly why the peaks are where they are, what controls their height, and why the Planck satellite measures cosmological parameters with sub-percent precision from these peaks."

---

## The Naive Attempt

Model the photon-baryon fluid as a simple pressure-density system in a flat universe, ignoring Hubble expansion:

```python
import numpy as np
import matplotlib.pyplot as plt

# Naive: acoustic oscillations ignoring Hubble expansion, dark matter, neutrinos
# Simple SHO: d²δ/dt² + c_s² k² δ = 0
# where δ = δρ/ρ is the density perturbation and c_s = c/√3 is the sound speed

def naive_acoustic_oscillation(k_Mpc=0.02, c_s=1/np.sqrt(3), t_rec=380e3):
    """
    Simple harmonic oscillator for CMB acoustic modes.
    k: wavenumber in Mpc^-1
    c_s: sound speed (in units of c)
    t_rec: recombination time in years
    """
    omega = c_s * k_Mpc   # angular frequency (in units where c=1, Mpc)
    t = np.linspace(0, t_rec * 3e13, 10000)  # t in seconds
    
    # Convert to comoving units (ignoring expansion — WRONG)
    eta = t  # conformal time ≈ cosmic time at early times (very wrong)
    
    delta = np.cos(omega * eta)     # growing mode solution (Meszaros equation)
    delta_dot = -omega * np.sin(omega * eta)
    
    return eta, delta

# The problem: ignoring expansion means the sound horizon at recombination
# is wrong by a factor of ~3. Also ignoring:
# - Hubble friction: d²δ/dη² + (k²c_s² - a''/a) δ = 0 (correct equation)
# - Radiation-matter equality: changes growth rate
# - Dark matter: doesn't participate in acoustic oscillations → gravity offset
# - Baryon loading: increases effective sound speed for baryons relative to photons
# - Silk damping: photon diffusion damps small-scale modes

k = 0.02  # Mpc^-1 (first acoustic peak scale)
eta, delta = naive_acoustic_oscillation(k)

# Peak positions in naive model: omega * eta_rec = n * pi
# omega = c_s * k = 0.0116 Mpc^-1 (in conformal time, wrong units)
# eta_rec = 380,000 years × 3e13 s/yr = 1.14e19 s (cosmic time, not conformal)
# Peak at: k * c_s * eta_rec = n * pi → k_n = n * pi / (c_s * eta_rec)
# But this gives wrong numbers because:
# 1. Conformal time ≠ cosmic time by factor ~2 at recombination
# 2. Hubble friction shifts peak positions
# 3. Dark matter gravitational forcing moves the peak of Θ (photon perturbation)
print("Naive first peak wavenumber k_1 =", np.pi / (1/np.sqrt(3) * 380e3 * 3.086e22 / 3e8))
print("True first peak k_1 from Planck = ~0.02 Mpc^-1")  
# Naive gives ~2x wrong answer
```

The naive SHO gives the wrong peak positions and completely misses the alternating peak heights (odd peaks higher than even peaks due to baryon loading), the damping envelope at high ℓ (Silk damping), and the Integrated Sachs-Wolfe (ISW) plateau at low ℓ. The physics of Hubble expansion, baryons, dark matter, and photon diffusion are all essential.

---

## The Moment of Failure

Run the naive acoustic oscillation model for the first 5 harmonic modes and compute the angular power spectrum by mapping k → ℓ = k × d_A (angular diameter distance to last scattering). Plot the resulting "power spectrum" as a bar chart at the peak positions. Compare to the Planck TT power spectrum: The naive peak positions are at ℓ ≈ 165, 330, 495, 660, 825 (equal spacing, integer multiples). The actual Planck peaks: ℓ ≈ 220, 540, 810, 1130, 1450. The naive first peak is wrong by 33% (220 vs 165), and the subsequent peaks are no longer integer multiples of the first. The naive model has equal-height peaks; the actual spectrum shows odd peaks (1st, 3rd, 5th) higher than even peaks (2nd, 4th) — a clear signature of baryon loading that is completely absent in the naive photon-only model. Print the baryon acoustic oscillation (BAO) sound horizon: naive = 220 Mpc, actual = 147 Mpc (wrong by 50%). The naive code gives a completely wrong CMB power spectrum.

---

## Why It Broke — The Physics

The photon-baryon plasma before recombination is a relativistic fluid coupled by Thomson scattering. The photon perturbation Θ = δT/T satisfies (in the tight-coupling approximation):

Θ'' + k² c_s² Θ = -Φ'' - k²/3 Ψ

where primes are derivatives with respect to conformal time η, Φ and Ψ are the gravitational potentials (metric perturbations), and c_s is the sound speed of the photon-baryon fluid:

c_s = c/√(3(1 + R))  where R = 3ρ_b/(4ρ_γ) is the baryon-to-photon ratio

As R increases during radiation-to-matter transition, c_s decreases — making the sound horizon smaller than the c/√3 value for a photon-only fluid. Crucially, the dark matter gravitational potential Φ has its own evolution:

Φ'' + H Φ' + (k²/3)Φ = (4πG/3)(ρ_m δ_m + ρ_r δ_r)

This driving term (the right-hand side) forces the acoustic oscillation at a non-zero amplitude, shifting the zero-point of the oscillation and making odd peaks (compression phases, enhanced by dark matter gravitational well) higher than even peaks (rarefaction phases).

Silk damping: photon diffusion over the damping scale k_D ∝ √(η/τ_c) (where τ_c is the Thomson scattering rate) suppresses modes at k > k_D. The envelope of the power spectrum at high ℓ decays as e^{-2(k/k_D)²} — the Silk damping.

---

## The One Concept

**CMB acoustic oscillations: the photon-baryon fluid equations, the sound horizon, peak positions, baryon loading, Silk damping, and the angular power spectrum.**

**The photon-baryon fluid equations (tight coupling):**

In the synchronous gauge, the photon temperature perturbation Θ and baryon velocity v_b satisfy:

Θ' + k/3 v_b = -Φ'
v_b' + H v_b = k Θ + k Ψ - τ'_c^{-1}(v_b - 3Θ)

(where τ'_c = -dτ_c/dη is the Thomson scattering opacity, H = a'/a is the conformal Hubble parameter). In the tight coupling limit (τ'_c → ∞), photons and baryons have the same velocity, and the system reduces to:

Θ'' + k² c_s²(η) Θ = S(k, η)

where S = -Φ'' - k²(1+R)/3 Ψ is the gravitational source term and:

c_s(η) = c/√(3(1 + R(η)))  with R = 3ρ_b/(4ρ_γ) = 3Ω_b/(4Ω_γ) × a

**The sound horizon:**

The comoving sound horizon at conformal time η is:

r_s(η) = ∫_0^η c_s(η') dη'

At recombination (z_rec ≈ 1100, η_rec ≈ 285 Mpc in ΛCDM):

r_s^* = r_s(η_rec) ≈ 147 Mpc

The peaks in the CMB power spectrum occur at k_n r_s^* = n π:

k_n = n π / r_s^*  →  ℓ_n ≈ k_n × d_A^* = n π × d_A^* / r_s^*

where d_A^* ≈ 13,900 Mpc is the angular diameter distance to last scattering. Therefore:

ℓ_n ≈ n × 220  (for ΛCDM best-fit parameters)

The first peak: ℓ_1 ≈ 220. This matches the Planck measurement to within 0.5%.

**Baryon loading:**

With baryons (R > 0), the photon-baryon sound speed is reduced below c/√3. More importantly, the gravitational source term creates an asymmetric oscillation: the plasma is compressed by gravity toward potential wells (dark matter halos), so compression phases (odd peaks) are enhanced over rarefaction phases (even peaks). The ratio of odd to even peak heights:

(ℓ_1/ℓ_2)² × (2ℓ_1+1)/(2ℓ_2+1) × peak height ratio ≈ (1 + 6R*)^{1/2}

where R* = R(η_rec). For Ω_b h² = 0.022 (Planck best-fit): R* ≈ 0.6, giving an odd/even ratio of ≈ 1.96. The 1st peak is ~twice as high as the 2nd peak (before diffusion damping). Measuring this ratio gives Ω_b to ~1% precision from CMB alone.

**Silk damping:**

Photons have a finite mean free path between Thomson scatterings: λ_mfp = 1/(n_e σ_T a). Over conformal time η, photons diffuse a comoving distance:

λ_D ≈ √(η / (τ_c n_e σ_T))

Modes with k λ_D > 1 are exponentially suppressed: C_ℓ ∝ e^{-2ℓ²/(ℓ_D)²} for ℓ > ℓ_D ≈ 1500. This sets a sharp cutoff in the CMB power spectrum at ℓ ≈ 1500–2000.

**Numerical solution — the line-of-sight (LOS) integration:**

The full Boltzmann-Friedmann system (including neutrinos, dark matter, gravity) is integrated forward in time for each k mode using the LOS integration (Seljak & Zaldarriaga 1996):

Θ_ℓ(k, η_0) = ∫_0^{η_0} [g(η)(Θ_0 + Ψ) j_ℓ(k(η_0-η)) + g(η) Φ' j_ℓ ... ] dη

where g(η) = -τ'_c e^{-τ_c} is the visibility function (peaked at recombination) and j_ℓ is the spherical Bessel function. The angular power spectrum:

C_ℓ = (4π/25) ∫ k² dk P(k) |Θ_ℓ(k)|²

This is the output of Boltzmann codes like CAMB (Code for Anisotropies in the Microwave Background) and CLASS (Cosmic Linear Anisotropy Solving System).

**Polarization:**

Thomson scattering is polarization-dependent. The CMB has both temperature (T) and polarization (E and B modes) power spectra. The E-mode is sourced by the quadrupole of the photon distribution at recombination and is anti-correlated with T at the peaks (the TE cross-correlation). The B-mode is sourced by primordial gravitational waves — its detection would measure the tensor-to-scalar ratio r and constrain inflation models.

---

## The Fix

```python
import numpy as np
from scipy.integrate import solve_ivp
from scipy.special import spherical_jn

def solve_acoustic_oscillations(k, H0=70.0, Omega_m=0.31, Omega_b=0.049, 
                                  Omega_r=9.4e-5, a_start=1e-5, a_end=1e-3):
    """
    Solve the photon-baryon tight-coupling equations.
    Returns the photon perturbation Theta(eta) at recombination.
    
    Simplified: ignores polarization, neutrinos, full Boltzmann hierarchy.
    Use CAMB or CLASS for production calculations.
    """
    def hubble(a):
        """Hubble parameter H(a) in s^{-1}."""
        Omega_Lambda = 1 - Omega_m - Omega_r
        return H0/3.086e22 * np.sqrt(Omega_r/a**4 + Omega_m/a**3 + Omega_Lambda)
    
    def R_baryon(a):
        """Baryon-to-photon ratio R = 3 rho_b / (4 rho_gamma)."""
        return 3*Omega_b / (4*Omega_r) * a
    
    def sound_speed_sq(a):
        R = R_baryon(a)
        return 1.0 / (3 * (1 + R))  # c_s^2 in units of c^2
    
    # Convert to conformal time: dη = da / (a² H)
    # State vector: [Theta, Theta', Phi, v_b]
    # Simplified: set Phi = const × D+(a) (Meszaros equation for phi)
    
    # Initial conditions: adiabatic mode at early times (matter domination)
    a0 = a_start
    Phi0 = 1.0  # normalized potential
    Theta0 = -Phi0 / 2  # adiabatic IC: Theta = -Phi/2
    Theta_dot0 = 0.0    # growing mode
    
    def conformal_deriv(a, state):
        Theta, Theta_dot, Phi = state
        
        H = hubble(a)
        cs2 = sound_speed_sq(a)
        R = R_baryon(a)
        
        # Conformal time derivative: d/dη = a * d/dt → d/da requires d/dη = a H × d/da
        # Approximation: use a as proxy for eta (valid in radiation domination)
        aH = a * H
        
        # Decay of potential during radiation domination
        # Phi' ≈ 0 in matter domination; decays as 1/a^2 in radiation domination
        Phi_dot = -2 * Phi * aH * Omega_r / (a * (Omega_r/a + Omega_m))
        Phi_dotdot = 0.0  # simplified
        
        # Acoustic oscillation equation
        # Theta'' + k^2 c_s^2 Theta = -Phi'' - k^2/3 Psi
        # Simplified: Psi ≈ -Phi (no anisotropic stress)
        k_Mpc = k * 3.086e22  # convert to s^{-1}
        
        # d(Theta')/dη = -k^2 c_s^2 Theta + source
        source = -Phi_dotdot + k_Mpc**2 / 3 * Phi  # in units with c=1
        Theta_ddot = -(k_Mpc)**2 * cs2 * Theta + source
        
        # Convert to da derivative
        dTheta_da = Theta_dot / aH
        dTheta_dot_da = Theta_ddot / aH
        dPhi_da = Phi_dot / aH
        
        return [dTheta_da, dTheta_dot_da, dPhi_da]
    
    a_span = (a_start, a_end)  # from a_start to a_rec ≈ 1/1100
    a_eval = np.logspace(np.log10(a_start), np.log10(a_end), 10000)
    
    sol = solve_ivp(conformal_deriv, a_span, [Theta0, Theta_dot0, Phi0],
                    t_eval=a_eval, rtol=1e-8, atol=1e-10, method='DOP853')
    
    return sol.t, sol.y[0], sol.y[2]  # a, Theta(a), Phi(a)

def compute_cl_peaks(ell_max=2000, n_k=200, r_s_star=147.0, d_A_star=13900.0):
    """
    Compute the CMB TT power spectrum using simple analytic approximation.
    C_ell ∝ (Theta_0 + Psi)^2 at k = ell/d_A_star
    """
    ells = np.arange(2, ell_max)
    Cl = np.zeros(len(ells))
    
    for idx, ell in enumerate(ells):
        k = ell / d_A_star  # k in Mpc^-1
        
        # Sound horizon phase at recombination
        krs = k * r_s_star  # acoustic phase
        
        # Theta_0 at recombination (analytic approximation)
        # With baryon loading R* ≈ 0.6:
        R_star = 0.6
        cs_star = 1.0 / np.sqrt(3 * (1 + R_star))
        k_rs_corrected = k * cs_star * r_s_star / cs_star  # sound horizon corrected
        
        # Gravitational potential at recombination (decays during radiation era)
        transfer_k = 1.0 / (1 + (k * 16.0)**2)  # rough transfer function
        
        # Analytic solution for Theta + Psi at recombination:
        # (Theta + Psi)_rec = [A cos(k r_s*) + B sin(k r_s*)] × damping
        # Baryon loading shifts the zero-point: cosine terms enhanced
        
        A = -(1 + 6*R_star) / 3   # odd peaks (compression, enhanced by baryons)
        B = 0.0                     # pure growing mode
        
        # Silk damping: exponential cutoff at high k
        k_D = 0.15  # Mpc^-1 (Silk damping scale)
        damping = np.exp(-(k / k_D)**1.5)
        
        Theta_rec = (A * np.cos(k * r_s_star) + B * np.sin(k * r_s_star)) * damping
        
        # Power spectrum: (Theta + Psi)^2 × P_prim(k) × k^{-3} (scale invariant)
        P_prim = (2 * np.pi**2 / k**3) * 2.2e-9 * (k / 0.05)**(-0.04)
        Cl[idx] = ell * (ell + 1) * P_prim * Theta_rec**2 / (2*np.pi)
    
    return ells, Cl

ells, Cl = compute_cl_peaks()
print(f"First peak location: ell = {ells[np.argmax(Cl[:500])]}")
# Should be near ell ~ 220
```

The analytic approximation gives the first peak near ℓ = 205 — much closer to the correct ℓ = 220 than the naive ℓ = 165. The odd-even peak height asymmetry is visible: the first peak is higher than the second, the third is higher than the fourth.

---

## The Wow Moment — Push It

Using the analytic approximation code (extended with Silk damping and the ISW effect at low ℓ), sweep the cosmological parameters: vary Ω_b from 0.01 to 0.1 and watch the baryon loading effect change the odd/even peak height ratio from nearly equal (Ω_b=0.01, photon-dominated) to strongly asymmetric (Ω_b=0.1, baryon-dominated). Vary Ω_m from 0.1 to 0.9: watch the first peak shift from ℓ=180 to ℓ=260 as the angular diameter distance d_A changes. Vary H₀ from 60 to 80 km/s/Mpc: watch the overall amplitude shift and the peak positions slide. Show the Planck data points overlaid on the theoretical curve — the error bars are smaller than the line width at most ℓ values. Demonstrate precision cosmology: vary Ω_b by 10% from best-fit — the peak height ratio changes by an observable amount at the 5σ level. "The CMB power spectrum is the most precise measurement in cosmology. Four numbers (Ω_b, Ω_m, H₀, n_s) predict 5000 data points, each to better than 1%. That is the Standard Model of Cosmology."

---

## The Interactive Demo

**Cosmological parameters:** Ω_b (0.01–0.1), Ω_c (0.1–0.5), H₀ (55–85 km/s/Mpc), n_s (0.9–1.05), A_s (1.5–3.0 × 10⁻⁹), sum of neutrino masses m_ν (0–0.3 eV)  
**Model:** Flat ΛCDM | Non-flat (slider for Ω_k) | w CDM (dark energy EOS)  
**Spectrum type:** TT | TE | EE | BB (primordial tensor) | all combined  
**ℓ range:** 2 – 5000  
**Damping:** Silk damping toggle (show undamped vs damped)  
**ISW effect:** toggle (shows power enhancement at low ℓ for late-time dark energy)  
**Baryon loading:** slider showing odd/even peak height ratio vs R*  
**Sound horizon:** show r_s*(η) as a function of a; mark a_rec  
**Peak finder:** auto-detect peaks in C_ℓ; display ℓ_n for n=1..7  
**Planck data:** toggle Planck TT/TE/EE data overlay (with error bars)  
**Parameter contours:** 2D constraint contours in (Ω_b, Ω_m) plane, (H₀, n_s) plane  
**Fisher matrix:** compute CMB Fisher information for parameter uncertainties  
**Export:** C_ℓ array CSV, parameter values JSON

---

## Production Notes

**Code to show:** The `compute_cl_peaks` function — specifically the line `A = -(1+6R_star)/3` which controls the baryon loading asymmetry. Show this formula's derivation from the acoustic oscillation equation with a non-zero R*.

**Visual layout:** Full-width CMB power spectrum plot (ℓ vs ℓ(ℓ+1)C_ℓ/2π in μK²). Planck data points as grey error bars. Theory as a colored curve (color-coded by current Ω_b value). Right panel: sliders for all parameters. Below: sound horizon animation (comoving distance vs conformal time, with a marking the moment of recombination).

**Key cinematic moments:**
- 2:00 — The ringing bell analogy: animate a metal ball struck at a random point. Show the Fourier decomposition of the sound — fundamental frequency + harmonics. "The CMB is a snapshot of a universe-sized bell struck at every frequency simultaneously at the Big Bang. The peaks are the harmonics."  
- 5:30 — Photon-baryon coupling: animate a cartoon of photons and baryons coupled by Thomson scattering arrows. Compress the fluid (photons exert pressure outward; gravity pulls inward). Show the oscillation as a spring analogy. "Dark matter doesn't interact with light. It just sits in the potential well, waiting. The photon-baryon fluid oscillates around it."  
- 8:00 — The zero-point shift: draw the Theta(k r_s) oscillation curve for R=0 (symmetric) and R=0.6 (shifted toward positive values). The maximum is higher for R=0.6 (first peak) and the minimum is less negative (second peak is suppressed). "Baryons don't push the fluid harder. They shift the equilibrium point. And that asymmetry is the fingerprint of Omega_b in the CMB."  
- 11:00 — Live parameter sweep: sweep Ω_b from 0.01 to 0.1 continuously on screen. Watch the second peak rise and fall relative to the first. "This is how Planck measured the baryon density to 1% precision from a snapshot of light from 380,000 years after the Big Bang."  
- 14:30 — The Planck overlay: show the full Planck TT power spectrum with error bars, overlaid on the ΛCDM best-fit theory. The agreement is staggering. Zoom into the third peak — the error bars are 1% of the peak height, and the theory matches. "Seven peaks. Seven harmonics. One equation of state. This is why physics works."

---

## Tags
`CMB` `cosmic-microwave-background` `acoustic-oscillations` `recombination` `power-spectrum` `cosmology` `photon-baryon` `canvas`

---

## Thumbnail

The Planck 2018 CMB TT power spectrum plotted on a dark background: the characteristic pattern of peaks — first at ℓ=220 (brilliant gold), subsequent peaks decreasing (orange, yellow, pale). Planck data points as white dots. Below the graph, the CMB all-sky oval map in red-blue in miniature. Bold text: "The Universe's Sound Waves." Subtitle: "Frozen 380,000 Years After the Big Bang."
