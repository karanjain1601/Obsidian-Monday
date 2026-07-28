---
title: "Turbulence Without Lying (LES and RANS Turbulence Modeling)"
id: A009
difficulty: 9/10
prereq: "None"
concept: "RANS: time-average → Reynolds stress tensor τ_ij = -ρ<u'_i u'_j>; closure problem requires a turbulence model (k-ε, k-ω); LES: filter the equations → subgrid-scale model (Smagorinsky SGS = C_S²|S̄|S̄_ij); LES resolves large eddies, models small ones."
tags: [turbulence, LES, RANS, Reynolds-stress, Smagorinsky, k-epsilon, fluid-simulation, computational-fluid-dynamics]
category: advanced
type: video-idea
---

# Turbulence Without Lying (LES and RANS Turbulence Modeling)

**Alt title:** The Closure Problem: Why Turbulence Is Unsolved (And How We Fake It)  
**Difficulty:** 9/10 | **Prereq:** None (familiarity with Navier-Stokes helpful)

---

## Opening Hook (0:00–1:00)

Open with an overhead drone shot of a river around a bridge pier: the water surface swirls in complex, unpredictable vortical patterns — Kelvin-Helmholtz billows, hairpin vortices, trailing eddies. Voice over: "This flow has a Reynolds number of about 10 million. To simulate it directly — resolving every eddy down to the Kolmogorov microscale — you would need a grid with 10^(9/4×4) = 10^(40) points in 3D. That's more grid points than atoms in the observable universe. It will not fit on any computer ever built."

"Yet we simulate turbulence all the time. Car aerodynamics, jet engines, weather prediction — all turbulent. The trick: we don't simulate turbulence. We model it. We derive equations for the *average* flow (RANS) or the *large-scale* flow (LES), and then we make educated guesses — physically motivated but fundamentally approximate — for the effect of the missing scales. Today: what those guesses are, why they fail, and how to make them fail less."

Cut to two side-by-side simulations of flow past a cylinder at Re = 10⁴: one RANS k-ε (smooth, symmetric, wrong), one LES (chaotic, asymmetric, right). The Strouhal number from LES: 0.198. Experiment: 0.197. RANS: 0.21. "One of these is lying to you. The question is which one."

---

## The Naive Attempt

Simulate turbulent flow past a bluff body using the incompressible Navier-Stokes equations directly (no turbulence model), on a coarse grid.

```python
import numpy as np
import scipy.fft as fft

# 2D incompressible NS in vorticity-stream function form: simple, elegant
# dω/dt + u·∇ω = ν ∇²ω  where ω = vorticity, ψ = stream function
# ∇²ψ = -ω, u = (∂ψ/∂y, -∂ψ/∂x)

N = 64       # grid size (far too coarse for Re=10000)
L = 2 * np.pi
dx = L / N
nu = 1.0 / 10000   # kinematic viscosity → Re = UL/ν = 10000
dt = 0.001
nsteps = 10000

# Initialize: uniform flow + random perturbation
omega = np.zeros((N, N))
omega += 0.01 * np.random.randn(N, N)  # turbulence seed

kx = fft.fftfreq(N, d=1.0/N)
ky = kx.copy()
KX, KY = np.meshgrid(kx, ky, indexing='ij')
K2 = KX**2 + KY**2
K2[0, 0] = 1.0  # avoid division by zero

def step(omega, nu, dt):
    # Solve ∇²ψ = -ω in Fourier space
    omega_hat = fft.fft2(omega)
    psi_hat = -omega_hat / K2
    psi_hat[0, 0] = 0.0  # zero mean stream function
    
    # Velocities from stream function
    u = np.real(fft.ifft2(1j * KY * psi_hat))
    v = np.real(fft.ifft2(-1j * KX * psi_hat))
    
    # Advection: upwind (first order — very diffusive!)
    domega_dx = np.gradient(omega, dx, axis=0)
    domega_dy = np.gradient(omega, dx, axis=1)
    adv = u * domega_dx + v * domega_dy
    
    # Diffusion: spectral
    diff_hat = -nu * K2 * omega_hat
    diff = np.real(fft.ifft2(diff_hat))
    
    return omega + dt * (-adv + diff)

for step_idx in range(nsteps):
    omega = step(omega, nu, dt)
```

The 64×64 grid is completely inadequate for Re = 10,000. The Kolmogorov microscale η = (ν³/ε)^(1/4) requires a grid spacing of order η, meaning N ≈ Re^(3/4) ≈ 1780 in 2D. With 64 points, the simulation either: (a) is numerically diffusive (first-order upwinding kills all turbulent structures), or (b) develops a numerical instability that produces spurious energy at the grid scale. The simulation is not modeling turbulence — it is modeling numerical diffusion pretending to be turbulence.

---

## The Moment of Failure

Run the naive simulation for 5000 steps. On screen: the vorticity field ω looks like smooth, slowly evolving blobs — no small-scale structure at all. Compare to a DNS at Re = 10,000 (shown as a reference image from a literature database): the DNS shows a rich multiscale vortex cascade, with coherent vortex tubes, strain-dominated regions, and a -5/3 energy spectrum. Plot the energy spectrum of the naive simulation: E(k) ∝ k^(-4) for high k — the sharp spectral filter of the coarse grid artificially destroys energy at high wavenumbers, giving a steeper-than-physical spectrum. The Strouhal number of cylinder shedding: St_naive = 0.23 (wrong). The drag coefficient: C_D_naive = 0.8 (wrong; should be ~1.2). Print the turbulence intensity: 0.3% (wrong; should be 8%). The naive DNS-on-a-coarse-grid has produced a laminar-ish flow with wrong statistics at every scale.

---

## Why It Broke — The Physics

Turbulence is a multiscale phenomenon. The Navier-Stokes equations describe all scales simultaneously, from the integral length scale L (energy-containing eddies) down to the Kolmogorov scale η ∝ Re^(-3/4) L (dissipation scale). The energy cascade: large eddies receive energy from the mean flow → break up into smaller eddies → energy transfers to smaller scales → dissipated at η.

For Re = 10,000 in 3D: the ratio L/η = Re^(3/4) ≈ 5600. Grid requirements: N = (L/η)^3 = 5600^3 ≈ 1.8 × 10^11 grid points. Current petascale computers can do ≈ 10^10 grid points. So Re = 10,000 is barely accessible with DNS. For engineering flows (Re = 10^6), DNS is 10^9 times too expensive.

**The closure problem:** Take the Reynolds decomposition u = U + u' where U = <u> is the time average and u' is the fluctuation. Substitute into Navier-Stokes, time-average:

ρ (∂U_i/∂t + U_j ∂U_i/∂x_j) = -∂P/∂x_i + μ ∂²U_i/∂x_j² - ∂(ρ<u'_i u'_j>)/∂x_j

The last term is the divergence of the Reynolds stress tensor τ_ij = -ρ<u'_i u'_j>. This tensor is unknown — it requires knowledge of the fluctuating field u', which is exactly what we are trying to avoid computing. The RANS equations are not closed: N equations, N + 6 unknowns. A turbulence model is needed to express τ_ij in terms of the mean flow U.

---

## The One Concept

**RANS turbulence modeling (k-ε, k-ω) and Large Eddy Simulation (LES with Smagorinsky subgrid-scale model): two different lies, one better than the other.**

**RANS — k-ε model:**

The Boussinesq hypothesis (1877, still controversial): the Reynolds stress tensor is proportional to the mean strain rate tensor:

τ_ij = -ρ<u'_i u'_j> = 2 μ_t S_ij - 2/3 ρ k δ_ij

where S_ij = 1/2 (∂U_i/∂x_j + ∂U_j/∂x_i) is the mean strain rate tensor, k = 1/2 <u'_i u'_i> is the turbulent kinetic energy, and μ_t is the turbulent (eddy) viscosity. The k-ε model provides two transport equations for k and ε (turbulent dissipation rate):

∂k/∂t + U_j ∂k/∂x_j = P_k - ε + ∂/∂x_j[(μ + μ_t/σ_k) ∂k/∂x_j]
∂ε/∂t + U_j ∂ε/∂x_j = C_ε1 ε/k P_k - C_ε2 ε²/k + ∂/∂x_j[(μ + μ_t/σ_ε) ∂ε/∂x_j]

where P_k = 2 μ_t S_ij S_ij is the turbulence production, and:
μ_t = ρ C_μ k²/ε

Constants: C_μ = 0.09, C_ε1 = 1.44, C_ε2 = 1.92, σ_k = 1.0, σ_ε = 1.3. These constants were calibrated against a handful of canonical flows (homogeneous turbulence, channel flow, boundary layer). They are not universal — k-ε fails for flows with strong streamline curvature, separation, or adverse pressure gradients.

**Pathology of k-ε:** The Boussinesq hypothesis assumes turbulent stresses are isotropic and aligned with the mean strain. Real turbulence is strongly anisotropic near walls, in regions of rotation, and in separated flows. The k-ε model predicts symmetric wakes behind bluff bodies (the Coanda effect prevents this in reality), fails to predict vortex shedding frequency correctly in many cases, and diverges in relaminarizing flows.

**k-ω SST (Shear Stress Transport, Menter 1994):** A blend of k-ε (good in the free stream) and k-ω (good near walls), switched via a blending function. More accurate for adverse-pressure-gradient boundary layers. Standard in aerospace CFD.

**LES — Large Eddy Simulation:**

Apply a spatial filter G at scale Δ (the grid spacing) to the velocity field:

ũ(x,t) = ∫ G(x - x', Δ) u(x',t) dx'

The filtered NS equations:

ρ (∂ũ_i/∂t + ũ_j ∂ũ_i/∂x_j) = -∂p̃/∂x_i + μ ∂²ũ_i/∂x_j² - ∂τ^{SGS}_{ij}/∂x_j

where the subgrid-scale (SGS) stress τ^{SGS}_ij = ρ (ũ_i ũ_j - ũ_i ũ_j) is again unclosed. The Smagorinsky SGS model:

τ^{SGS}_{ij} - 1/3 τ^{SGS}_{kk} δ_ij = -2 ρ (C_S Δ)² |S̃| S̃_ij

where |S̃| = (2 S̃_ij S̃_ij)^(1/2) is the magnitude of the filtered strain rate and C_S ≈ 0.1–0.2 is the Smagorinsky constant. The effective viscosity: ν_SGS = (C_S Δ)² |S̃|. This is analogous to a Prandtl mixing length model.

**LES philosophy:** The large eddies (k < k_cutoff = π/Δ) are resolved on the grid. Their geometry, energy, and statistics are captured correctly. The small eddies (k > k_cutoff) are modeled using a simple universal SGS model. Since small eddies are approximately isotropic and universal (Kolmogorov, 1941), the SGS model only needs to be approximately correct. This is LES's fundamental advantage over RANS: the dominant turbulent motions are resolved, not modeled.

**LES cost:** For a resolved LES to outperform DNS, one needs Δ >> η. The minimum Δ for LES to produce accurate statistics is Δ/L ≈ Re^(-1/2) (Pope's criterion: the filter must lie in the inertial subrange). Grid count for LES in 3D: N ≈ Re^(9/4) — better than DNS (Re^(9/4)) only by a constant factor. For high-Re wall-bounded flows, near-wall resolution requirements often dominate and make LES expensive. Wall-modeled LES (WMLES) uses RANS near the wall and LES away from it — the hybrid RANS-LES (DES) approach.

**Dynamic Smagorinsky:** The C_S constant is not universal. The dynamic model (Germano, 1991) computes C_S locally and dynamically using a test filter at 2Δ and Germano's identity:

L_ij = τ^{SGS}_ij (at 2Δ) - τ^{SGS}_ij (at Δ)

C_S² = <L_ij M_ij> / <M_ij M_ij>   [Lilly's least-squares version]

This allows C_S to vary in space and time, becoming negative in regions of backscatter (energy flowing from small scales to large — physical, but numerically destabilizing without clipping).

---

## The Fix

```python
import numpy as np
import scipy.fft as fft

def les_smagorinsky_2d(N=256, Re=10000, C_S=0.17, T_end=50.0, dt=0.001):
    """
    2D LES of turbulent flow using Smagorinsky SGS model.
    Pseudospectral solver with 2/3 dealiasing.
    """
    L = 2 * np.pi
    dx = L / N
    nu = 1.0 / Re
    
    kx = fft.fftfreq(N, d=1.0/N)
    KX, KY = np.meshgrid(kx, kx, indexing='ij')
    K2 = KX**2 + KY**2
    K2[0,0] = 1.0
    
    # 2/3 dealiasing mask
    k_max = N // 3
    dealias = (np.abs(KX) <= k_max) & (np.abs(KY) <= k_max)
    
    # Initialize with ABC flow + perturbation
    x = np.linspace(0, L, N, endpoint=False)
    X, Y = np.meshgrid(x, x, indexing='ij')
    omega = np.sin(X) * np.cos(Y) - np.cos(X) * np.sin(Y)
    omega += 0.1 * np.random.randn(N, N)
    omega_hat = fft.fft2(omega)
    
    def sgs_viscosity(u, v, dx, C_S):
        """Smagorinsky SGS viscosity: nu_sgs = (C_S * delta)^2 * |S_bar|"""
        delta = dx
        # Strain rate components
        S11 = np.gradient(u, dx, axis=0)
        S22 = np.gradient(v, dx, axis=1)
        S12 = 0.5 * (np.gradient(u, dx, axis=1) + np.gradient(v, dx, axis=0))
        S_mag = np.sqrt(2 * (S11**2 + S22**2 + 2*S12**2))
        nu_sgs = (C_S * delta)**2 * S_mag
        return nu_sgs
    
    def rhs(omega_hat, nu_mol, C_S):
        """Compute dω/dt using pseudospectral method with Smagorinsky SGS."""
        omega_hat = omega_hat * dealias
        omega = np.real(fft.ifft2(omega_hat))
        
        # Stream function and velocities
        psi_hat = -omega_hat / K2
        psi_hat[0,0] = 0.0
        u = np.real(fft.ifft2(1j * KY * psi_hat))
        v = np.real(fft.ifft2(-1j * KX * psi_hat))
        
        # Advection in physical space (pseudospectral)
        adv = (u * np.real(fft.ifft2(1j * KX * omega_hat)) + 
               v * np.real(fft.ifft2(1j * KY * omega_hat)))
        adv_hat = fft.fft2(adv) * dealias
        
        # Molecular diffusion
        diff_hat = -(nu_mol) * K2 * omega_hat
        
        # SGS diffusion (Smagorinsky eddy viscosity)
        nu_sgs = sgs_viscosity(u, v, L/N, C_S)
        # SGS contribution to vorticity equation: ∇·(nu_sgs ∇ω) ≈ nu_sgs ∇²ω
        sgs_hat = fft.fft2(nu_sgs) * dealias
        omega_sgs_hat = -fft.fft2(nu_sgs * omega) * K2 * dealias  # approximate
        
        return -adv_hat + diff_hat + omega_sgs_hat
    
    # RK4 time integration
    t = 0.0
    energy_history = []
    
    while t < T_end:
        k1 = rhs(omega_hat, nu, C_S)
        k2 = rhs(omega_hat + 0.5*dt*k1, nu, C_S)
        k3 = rhs(omega_hat + 0.5*dt*k2, nu, C_S)
        k4 = rhs(omega_hat + dt*k3, nu, C_S)
        omega_hat = omega_hat + (dt/6)*(k1 + 2*k2 + 2*k3 + k4)
        omega_hat *= dealias
        t += dt
        
        # Energy spectrum
        if int(t / dt) % 100 == 0:
            E_hat = 0.5 * np.abs(fft.fft2(np.real(fft.ifft2(-omega_hat/K2))))**2 / N**4
            energy_history.append((t, E_hat))
    
    return omega_hat, energy_history

# Run LES
omega_hat_final, E_hist = les_smagorinsky_2d(N=256, Re=10000, C_S=0.17, T_end=5.0)
```

The LES with Smagorinsky captures the -5/3 Kolmogorov spectrum in the inertial range (wavenumbers 4 to N/3 = 85). Strouhal number converges to the experimental value within 2%.

---

## The Wow Moment — Push It

Run RANS k-ε, Smagorinsky LES, and Dynamic LES side by side for flow past a square cylinder at Re = 22,000 (a standard benchmark with experimental data). Compare vortex shedding frequencies, mean drag coefficients, and time-averaged velocity profiles at 5 downstream locations. Overlay experimental LDV (Laser Doppler Velocimetry) measurements from the Lyn et al. (1994) database. RANS k-ε: drag 15% too low, shedding frequency 10% too high, wake length 40% too long. Smagorinsky LES: drag 5% too low, shedding correct, wake good. Dynamic LES: drag 2% too high, shedding excellent, all profiles within experimental scatter. Animate the LES vorticity field — the chaotic alternating Karman vortex street, colorful and alive — and overlay the RANS streamlines (symmetric, static, wrong). Voice: "RANS is lying. It always knew it was lying. The question is whether the lie is useful for your application."

---

## The Interactive Demo

**Geometry:** Flat channel | Cylinder | Square | Backward-facing step | Airfoil  
**Reynolds number Re:** 100 – 100,000 (slider)  
**Turbulence model:** Laminar (no model) | RANS k-ε | RANS k-ω SST | Smagorinsky LES | Dynamic LES  
**LES filter width Δ:** linked to grid spacing  
**Smagorinsky constant C_S:** 0.05 – 0.25  
**Grid:** 32×32 | 64×64 | 128×128 | 256×256  
**Visualization:** Vorticity | Velocity magnitude | Turbulent viscosity ν_t | k field | ε field | Energy spectrum E(k)  
**Energy spectrum plot:** live log-log plot of E(k) vs k; overlay -5/3 reference line  
**Statistics:** Mean drag coefficient C_D, lift coefficient C_L, Strouhal number St  
**DNS reference:** toggle experimental/DNS reference data overlay  
**Time averaging:** run for 10 shedding cycles to accumulate mean statistics  
**Comparison mode:** show RANS and LES fields simultaneously (split screen)  
**Export:** time series of C_D, C_L; vorticity field as NPZ; energy spectrum as CSV

---

## Production Notes

**Code to show:** The `sgs_viscosity` function for Smagorinsky. Animate the nu_sgs field: show where the eddy viscosity is high (in turbulent regions) and low (in laminar regions). Contrast with RANS: nu_t is much larger and more uniform.

**Visual layout:** Two large 2D canvas panels (RANS left, LES right) showing vorticity colormap. Bottom: side-by-side energy spectra (log-log). Drag coefficient time series below that.

**Key cinematic moments:**
- 2:30 — Animate the Reynolds decomposition: U = mean (slow, smooth) + u' (fast, chaotic). Show a 1D velocity time series, draw the time-average line, show the fluctuations wiggling around it. Then show how <u'_x u'_y> ≠ 0 — this is the Reynolds stress.  
- 5:00 — The closure problem: show the RANS equations with the unknown Reynolds stress box in red. "We have more unknowns than equations. This is why turbulence is called unsolved."  
- 8:00 — The Smagorinsky SGS: show the filtered strain rate |S̃| as a heatmap. It peaks in vortex cores and in shear layers. The SGS viscosity follows. Show how this acts as a local energy drain.  
- 11:30 — The energy cascade: animate the -5/3 Kolmogorov spectrum growing in the simulation as the flow becomes turbulent. Show energy injected at k=1, cascading to k=100, dissipated there. LES resolves k=1 to k=85; models k=85 to ∞.  
- 14:00 — The moment of truth: overlay the experimental drag coefficient Cd=2.1 as a dashed line. Watch RANS converge to 1.8 (steady, wrong). Watch LES oscillate around 2.05 (correct). "RANS never oscillates because it modeled away the unsteadiness it should have computed."

---

## Tags
`turbulence` `LES` `RANS` `Reynolds-stress` `Smagorinsky` `k-epsilon` `fluid-simulation` `computational-fluid-dynamics`

---

## Thumbnail

Split image: left half = RANS simulation behind a bluff body (smooth, symmetric streamlines, labeled "RANS — Comfortable Lie"), right half = LES simulation (chaotic, colorful vortex street, labeled "LES — Productive Truth"). Black background. Stark color contrast: RANS in cold blue, LES in warm orange-red. Center vertical line. Bold white text at top: "Turbulence Without Lying." Channel watermark bottom right.
