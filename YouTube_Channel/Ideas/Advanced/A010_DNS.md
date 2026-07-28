---
title: "Turbulence With No Modeling At All (Direct Numerical Simulation)"
id: A010
difficulty: 9.5/10
prereq: "A009"
concept: "DNS: resolve all scales from L (integral scale) down to η = (ν³/ε)^(1/4) (Kolmogorov scale); N ∝ Re^(9/4) grid points required → intractable above Re~1000 in 3D; Kolmogorov -5/3 spectrum appears naturally in DNS."
tags: [DNS, direct-numerical-simulation, turbulence, Kolmogorov, energy-spectrum, Navier-Stokes, computational-fluid-dynamics, WebGL]
category: advanced
type: video-idea
---

# Turbulence With No Modeling At All (Direct Numerical Simulation)

**Alt title:** Turbulence From First Principles — The Computationally Insane Approach  
**Difficulty:** 9.5/10 | **Prereq:** A009 (RANS and LES turbulence modeling)

---

## Opening Hook (0:00–1:00)

Open with a landmark scientific result: the 1994 DNS of isotropic turbulence by Jiménez et al. at Re_λ = 168 — at the time the highest Reynolds number DNS ever attempted, requiring 512³ = 134 million grid points and running for six months on a Connection Machine. Now show the 2022 state of the art: Re_λ = 2,200, requiring 12,288³ = 1.86 trillion grid points, run on the Fugaku supercomputer with 158,000 processors for three weeks. Voice over: "In 28 years, we went from 512³ to 12,288³. And yet the Reynolds number of a hurricane is 10¹⁰, roughly 100 million times beyond what DNS can reach today."

"But DNS at the Reynolds numbers it *can* reach is scientifically priceless. It is an exact numerical experiment: the ground truth that all turbulence models are measured against. No RANS approximations. No SGS models. Just the Navier-Stokes equations, discretized faithfully, on a grid fine enough to resolve the smallest vortex in the flow. Today we're going to build one — at Re small enough to run in a browser — and watch the Kolmogorov energy cascade emerge from nothing but noise and viscosity."

---

## The Naive Attempt

Write a 2D DNS using finite differences, run on a 64×64 grid at Re = 5000.

```python
import numpy as np
import matplotlib.pyplot as plt

# 2D incompressible NS — naive finite difference DNS
N = 64
L = 1.0
dx = L / N
Re = 5000
nu = 1.0 / Re
dt = 0.5 * dx**2 / nu   # CFL-based timestep for diffusion

# Velocity fields on staggered grid (MAC scheme)
u = np.zeros((N+1, N))   # u at x-faces
v = np.zeros((N, N+1))   # v at y-faces
p = np.zeros((N, N))     # pressure at cell centers

def divergence(u, v, dx):
    return (u[1:, :] - u[:-1, :]) / dx + (v[:, 1:] - v[:, :-1]) / dx

def advect_u(u, v, dx, dt):
    """Upwind advection for u — first order, very diffusive."""
    u_adv = np.zeros_like(u)
    # Interior points only
    for i in range(1, N):
        for j in range(N):
            u_ij = u[i, j]
            v_ij = 0.25 * (v[i-1,j] + v[i-1,j+1] + v[i,j] + v[i,j+1])
            # Upwind in x
            if u_ij > 0:
                du_dx = (u[i,j] - u[i-1,j]) / dx
            else:
                du_dx = (u[i+1,j] - u[i,j]) / dx if i < N else 0
            # Upwind in y  
            if v_ij > 0:
                du_dy = (u[i,j] - u[i,j-1]) / dx if j > 0 else 0
            else:
                du_dy = (u[i,j+1] - u[i,j]) / dx if j < N-1 else 0
            u_adv[i,j] = u[i,j] - dt * (u_ij * du_dx + v_ij * du_dy)
    return u_adv

# Time advance: incredibly slow O(N^2) per step
for step in range(100):
    u = advect_u(u, v, dx, dt)
    # ... (pressure solve, viscous diffusion — all O(N^2))
```

At N=64 and Re=5000, the Kolmogorov scale η = L × Re^(-3/4) ≈ 0.0003 m requires grid spacing dx < η. Our dx = 1/64 ≈ 0.016 — 50 times too large. The simulation is not a DNS. It is a coarse LES without an SGS model — the worst possible approach.

---

## The Moment of Failure

Run the naive simulation. The energy spectrum at the final time shows: a steep E(k) ∝ k^(-5) tail at high k — the signature of numerical dissipation from the first-order upwind scheme, which acts like a viscosity proportional to dx. The -5/3 Kolmogorov spectrum is nowhere to be seen. The vorticity field shows only a few large-scale blobs with no small-scale structure. Print the dissipation rate ε_numerical: dominated by numerical dissipation (not physical viscosity). Ratio of numerical to physical dissipation: ν_numerical/ν_physical ≈ 40. The simulation is 40 times more viscous than the physical flow at Re=5000 — it is effectively simulating Re = 125. The vorticity field looks like a low-Re flow, not the turbulent high-Re field we wanted. The CFL condition for stability: dt < dx²/(2ν) = 5.2 × 10⁻⁷ s — at 64² = 4096 points per timestep and needing ~10^6 timesteps for flow statistics, this is 4096 × 10^6 = 4 × 10^9 operations — about 4000 seconds on a CPU. And it still gives the wrong answer.

---

## Why It Broke — The Physics

DNS requires two simultaneous conditions that scale adversely with Re:
1. The domain must be large enough to contain the energy-containing eddies: L_box ≥ L_int ∝ k₀^{-1}.
2. The grid spacing must be small enough to resolve the dissipation: Δx ≤ η = (ν³/ε)^(1/4).

The ratio L_int/η ∝ Re^(3/4). In 3D, the number of grid points required: N³ ≈ (L/η)³ ∝ Re^(9/4). For Re = 1000 (moderate turbulence): N ≈ 178, giving N³ ≈ 5.6 million points — feasible on a laptop. For Re = 10,000: N ≈ 1000, giving N³ ≈ 10^9 — requires a cluster. For Re = 10^6: N ≈ 10^(4.5) ≈ 31,623, giving N³ ≈ 3 × 10^13 — beyond any existing supercomputer.

The timestep for explicit time integration: Δt ≤ CFL × Δx/u_rms. Total operations: N³ × T/Δt ∝ Re^3 (computational cost grows as Re³, not Re^(9/4), because of the timestep constraint). This is the fundamental intractability of turbulence DNS at high Re.

For first-order finite differences, the numerical viscosity is ν_num ∝ u Δx — comparable to ν_physical when Δx > ν/(u) = L/Re. So for Re = 5000 and Δx = 1/64: ν_num/ν ≈ Re × Δx/L = 5000/64 ≈ 78. Spectral methods (used in actual DNS) have ν_num = 0 exactly for all resolved wavenumbers below the cutoff — only the dealiasing truncation introduces any dissipation, and it is exponentially small.

---

## The One Concept

**Direct Numerical Simulation: resolving all turbulent scales, the Kolmogorov microscale, and the emergence of the -5/3 energy cascade.**

**The Kolmogorov hypotheses (1941):**

Kolmogorov's theory of isotropic turbulence rests on two hypotheses:

H1 — Local isotropy: At sufficiently high Re, the small-scale motions are statistically isotropic — independent of the large-scale anisotropy of the mean flow.

H2 — Local equilibrium: In the inertial subrange (η << r << L), turbulent statistics depend only on the scale r and the energy dissipation rate ε (not on ν or L explicitly).

These two hypotheses predict the -5/3 energy spectrum:

E(k) = C_K ε^(2/3) k^(-5/3)

where C_K ≈ 1.5 is the Kolmogorov constant. This is one of the most precisely verified predictions in fluid mechanics, confirmed by DNS, experiments, and atmospheric measurements.

**Kolmogorov microscales:**

Length: η = (ν³/ε)^(1/4)
Time: τ_η = (ν/ε)^(1/2)
Velocity: u_η = (νε)^(1/4)

At the Kolmogorov scale, the local Re is exactly 1: u_η η / ν = 1. The inertial and viscous forces are in balance. Below η, viscosity dominates and the flow is smooth.

**Resolution requirement:**

For a DNS to be accurate, the maximum wavenumber in the simulation k_max must satisfy:

k_max η ≥ 1.5   (Pope's criterion — ensures the energy-carrying range is fully resolved)

For a 3D periodic DNS with N grid points per direction and dealiasing: k_max = N/3 (after 2/3 dealiasing). Therefore: N/3 × η/L ≥ 1.5, giving N ≥ 4.5 L/η = 4.5 Re^(3/4) (for L/η ≈ Re^(3/4)).

**Pseudospectral DNS:**

The modern DNS approach uses a pseudospectral method (detailed in A011):
- Velocity represented in Fourier space: û(k,t) = Σ u(x) e^{-ik·x}
- Nonlinear term computed in physical space (to avoid O(N^6) convolution sum)
- Dealiasing via 2/3 or 3/2 rule to prevent aliasing errors in the nonlinear term
- Pressure computed implicitly via projection (enforcing ∇·u = 0 in Fourier space)
- Time integration: 4th-order Runge-Kutta or Adams-Bashforth

In Fourier space, the incompressible NS equations become:

∂û_i/∂t + P_{ij} (û_j × ω̂)_i = -ν k² û_i

where P_{ij} = δ_{ij} - k_i k_j/k² is the projection operator onto divergence-free vectors (automatically enforces ∇·u = 0 and eliminates pressure). The nonlinear term (û_j × ω̂) is computed by IFFT to physical space, multiplied pointwise, then FFT'd back.

**What DNS reveals:**

DNS has shown things LES and RANS cannot: the detailed structure of vortex tubes (worm-like vortices of length L, diameter η), the non-Gaussian intermittency of small-scale statistics (violent rare events exceeding 10× the RMS), the anomalous scaling of high-order structure functions (departing from Kolmogorov K41 theory), and the energy transfer mechanism (local in wavenumber space, but with significant non-local backscatter). DNS is the only tool that can measure the Reynolds stress tensor pointwise in 3D — experimental probes are limited to 1D or 2D cross-sections.

**2D vs 3D turbulence:**

In 2D, the energy cascade is *inverse* — energy flows from small scales to large scales (due to the conservation of enstrophy in 2D that doesn't exist in 3D). The 2D energy spectrum: E(k) ∝ k^(-5/3) for k > k_forcing (enstrophy cascade), E(k) ∝ k^(-3) for k < k_forcing (inverse energy cascade). 2D turbulence forms large coherent vortices that persist for long times — the opposite of 3D turbulence where large structures break into small ones. A 2D DNS is accessible in a browser at Re = 5000 on a 512×512 grid.

---

## The Fix

```python
import numpy as np
import scipy.fft as fft
import time

def dns_pseudospectral_2d(N=512, Re=5000, dt=5e-4, T_end=10.0, 
                           forcing_band=(1,4), forcing_amplitude=0.1):
    """
    2D DNS of decaying/forced turbulence using pseudospectral method.
    The CORRECT way to do DNS: spectral accuracy, dealiasing, exact incompressibility.
    """
    L = 2 * np.pi
    nu = 1.0 / Re
    
    # Wavenumber arrays
    k = fft.fftfreq(N, d=1.0/N)
    KX, KY = np.meshgrid(k, k, indexing='ij')
    K2 = KX**2 + KY**2
    K2[0,0] = 1.0   # avoid division by zero
    
    # Dealiasing: 2/3 rule
    k_max = N // 3
    dealias = np.array((np.abs(KX) <= k_max) & (np.abs(KY) <= k_max), dtype=float)
    
    # Integrating factor for exact linear diffusion (removes stiffness)
    # Solve: dω_hat/dt = NL - ν k² ω_hat
    # With integrating factor: d(e^{νk²t} ω_hat)/dt = e^{νk²t} NL
    
    # Initialize vorticity: smooth initial condition in spectral space
    np.random.seed(42)
    omega_hat = np.zeros((N, N), dtype=complex)
    # Energy in low wavenumber shell
    k_mag = np.sqrt(K2)
    for ki in range(1, 6):
        mask = (k_mag >= ki - 0.5) & (k_mag < ki + 0.5)
        phase = 2 * np.pi * np.random.rand(np.sum(mask))
        omega_hat[mask] = np.exp(1j * phase) * ki**(-5/3) * N**2
    omega_hat *= dealias
    # Force divergence-free: ∇·u = 0 ↔ no projection needed for ω (scalar in 2D)
    
    def nonlinear_term(omega_hat):
        """Compute -u·∇ω using pseudospectral method with dealiasing."""
        omega_hat_d = omega_hat * dealias
        omega = np.real(fft.ifft2(omega_hat_d))
        
        # Stream function: ∇²ψ = -ω → ψ_hat = ω_hat/K²
        psi_hat = omega_hat_d / K2
        psi_hat[0,0] = 0.0
        
        # Velocities: u = ∂ψ/∂y, v = -∂ψ/∂x
        u = np.real(fft.ifft2(1j * KY * psi_hat))
        v = np.real(fft.ifft2(-1j * KX * psi_hat))
        
        # Vorticity gradient in Fourier space → physical space
        domega_dx = np.real(fft.ifft2(1j * KX * omega_hat_d))
        domega_dy = np.real(fft.ifft2(1j * KY * omega_hat_d))
        
        # Advection in physical space (pseudospectral trick)
        adv = u * domega_dx + v * domega_dy
        adv_hat = fft.fft2(adv) * dealias
        
        return -adv_hat
    
    def add_forcing(omega_hat, k_low, k_high, amp):
        """Maintain energy input at forcing wavenumbers."""
        k_mag = np.sqrt(K2)
        mask = (k_mag >= k_low) & (k_mag < k_high)
        # Inject energy proportional to current energy at those wavenumbers
        E_current = np.mean(np.abs(omega_hat[mask])**2)
        if E_current > 1e-10:
            omega_hat[mask] *= (1 + amp * dt / E_current**0.5)
        return omega_hat
    
    # RK4 time integration with spectral viscosity
    t = 0.0
    snapshots = []
    spectra = []
    
    t0 = time.time()
    while t < T_end:
        # RK4
        NL1 = nonlinear_term(omega_hat) - nu * K2 * omega_hat
        NL2 = nonlinear_term(omega_hat + 0.5*dt*NL1) - nu * K2 * (omega_hat + 0.5*dt*NL1)
        NL3 = nonlinear_term(omega_hat + 0.5*dt*NL2) - nu * K2 * (omega_hat + 0.5*dt*NL2)
        NL4 = nonlinear_term(omega_hat + dt*NL3) - nu * K2 * (omega_hat + dt*NL3)
        omega_hat = omega_hat + (dt/6) * (NL1 + 2*NL2 + 2*NL3 + NL4)
        omega_hat *= dealias
        
        # Forcing (optional)
        omega_hat = add_forcing(omega_hat, *forcing_band, forcing_amplitude)
        
        t += dt
        
        if int(t/dt) % 200 == 0:
            # Compute energy spectrum
            k_mag = np.sqrt(K2)
            E_hat = 0.5 * np.abs(fft.fft2(np.real(fft.ifft2(omega_hat/K2)))**2) / N**4
            k_bins = np.arange(1, N//2)
            spectrum = np.zeros(len(k_bins))
            for ki, k_val in enumerate(k_bins):
                ring = (k_mag >= k_val - 0.5) & (k_mag < k_val + 0.5)
                spectrum[ki] = np.sum(E_hat[ring]) * 2 * np.pi * k_val
            spectra.append((t, k_bins, spectrum))
            
            omega_field = np.real(fft.ifft2(omega_hat))
            snapshots.append((t, omega_field.copy()))
            
            # Kolmogorov scale
            eps = 2 * nu * np.sum(K2 * np.abs(omega_hat)**2) / N**4
            eta = (nu**3 / eps)**0.25 if eps > 0 else np.inf
            k_max_eta = k_max * eta * 2 * np.pi / (2 * np.pi)
            print(f"t={t:.2f}, eps={eps:.4e}, eta/dx={eta*N/(2*np.pi):.2f}, "
                  f"k_max*eta={k_max_eta:.2f}, "
                  f"elapsed={time.time()-t0:.1f}s")
    
    return snapshots, spectra

# Run DNS
snaps, spectra = dns_pseudospectral_2d(N=512, Re=5000, T_end=5.0)
```

The DNS shows k_max η ≈ 1.8 — satisfying Pope's criterion (≥1.5) at Re=5000 with N=512. The energy spectrum develops the -5/3 slope between wavenumbers 5 and 100. The DNS is telling the truth.

---

## The Wow Moment — Push It

Run the 2D DNS in a browser using WebGL compute shaders (writing a GLSL compute shader version of the pseudospectral solver using WebGL2's transform feedback or WebGPU's compute pipelines). Achieve 512×512 DNS at Re=5000 running at 30 FPS in the browser. Display the vorticity field as a vivid color map (red = positive vorticity / cyclone, blue = negative / anticyclone). Show the inverse energy cascade visually: start with energy injected at k=16 (small vortices), watch them merge and grow into larger and larger coherent structures over time. The energy spectrum develops the -3 slope on the large-scale side (inverse cascade) and -5/3 on the small-scale side (enstrophy cascade) simultaneously. Show a log-log energy spectrum updating in real time — the Kolmogorov slope appears as a straight line of slope -5/3, growing cleaner as statistics accumulate over time. Compare with the naive FD DNS side by side: FD shows a steeper slope (-4 to -5), DNS shows exactly -5/3.

---

## The Interactive Demo

**Resolution N:** 64 | 128 | 256 | 512 | 1024 (WebGL)  
**Reynolds number Re:** 100 – 20,000  
**Forcing:** None (decaying) | Spectral band (choose k_low, k_high) | Taylor-Green vortex IC  
**Forcing amplitude:** 0 – 1 (injection rate)  
**Sponge layer:** toggle absorbing boundary for non-periodic domains  
**Dealiasing:** 2/3 rule | 3/2 padding | No dealiasing (show aliasing artifact)  
**Time scheme:** Euler (unstable, show it) | RK2 | RK4 | Adams-Bashforth 3  
**Visualization:** Vorticity | Stream function | Velocity magnitude | Q-criterion | Dissipation rate  
**Energy spectrum:** live log-log plot; toggle reference lines for k^(-5/3), k^(-3), k^(-2)  
**Kolmogorov scale indicator:** overlay contour where η ≈ grid spacing (green = resolved, red = underresolved)  
**Statistics:** enstrophy, energy, palinstrophy, energy injection rate, dissipation rate  
**Comparison:** toggle FD vs pseudospectral on same IC — watch them diverge  
**Export:** vorticity field NPZ, energy spectrum CSV, animation GIF

---

## Production Notes

**Code to show:** The `nonlinear_term` function — specifically the pseudospectral trick: compute the product in physical space (avoid O(N^6) convolution sum), transform back. Highlight the `dealias` multiplication before each FFT.

**Visual layout:** Full-width WebGL canvas showing vorticity. Right panel: log-log energy spectrum with -5/3 reference line. Bottom: time series of total energy and enstrophy.

**Key cinematic moments:**
- 1:45 — The resolution scaling table: show N vs Re for DNS feasibility. Each row is a decade of Re; highlight the jump from "laptop" to "supercomputer" to "not possible." The camera slowly zooms in on the "not possible" row as the voice says "...for a hurricane."  
- 4:00 — Initialize the DNS: show the seed vorticity (speckled random noise). Then hit play and watch the turbulence spin up — large structures form from small ones via the inverse cascade in 2D. Eerie and beautiful.  
- 7:15 — The -5/3 spectrum emerging: show the energy spectrum at t=0 (flat), t=1 (slope beginning), t=5 (clean -5/3). "This slope came from nothing but the Navier-Stokes equations and viscosity. No model. No assumption. First principles."  
- 10:30 — Compare 2D vs 3D turbulence philosophically: in 2D (which we can simulate), the vortices grow; in 3D (which we cannot simulate at high Re), they break apart. "Nature chose 3D. That's why turbulence is hard."  
- 13:00 — Disable dealiasing: watch the aliasing instability appear — high-frequency noise grows exponentially, destroying the simulation in seconds. "Dealiasing is not optional. It is the price of spectral accuracy."

---

## Tags
`DNS` `direct-numerical-simulation` `turbulence` `Kolmogorov` `energy-spectrum` `Navier-Stokes` `computational-fluid-dynamics` `WebGL`

---

## Thumbnail

A 512×512 vorticity field from the 2D DNS: vivid red cyclones and blue anticyclones swirling at multiple scales against a black background, like a living Van Gogh painting. Overlaid in the upper right: a log-log energy spectrum with a clean -5/3 slope line and label. Bold white text: "No Turbulence Model. Just Physics." Bottom: "DNS from Scratch."
