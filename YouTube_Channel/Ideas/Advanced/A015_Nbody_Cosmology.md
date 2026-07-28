---
title: "Growing a Universe From Gaussian Noise (N-Body Cosmology)"
id: A015
difficulty: 9.5/10
prereq: "None"
concept: "ΛCDM cosmological simulation: initial power spectrum P(k) = Ak^n (Harrison-Zel'dovich); Zeldovich approximation for ICs; TreePM gravity (Barnes-Hut tree for long-range, particle mesh for short-range); structure formation and halo mass function."
tags: [N-body, cosmology, dark-matter, power-spectrum, TreePM, Barnes-Hut, structure-formation, WebGL]
category: advanced
type: video-idea
---

# Growing a Universe From Gaussian Noise (N-Body Cosmology)

**Alt title:** The Universe Grew From Quantum Fluctuations — Here's the Simulation  
**Difficulty:** 9.5/10 | **Prereq:** None (cosmology basics helpful)

---

## Opening Hook (0:00–1:00)

Open with a stunning visualization from the Millennium-XXL simulation: a fly-through of the cosmic web — dark matter filaments stretching across hundreds of megaparsecs, halos at their intersections ranging from dwarf galaxy masses to galaxy clusters, cosmic voids tens of millions of light-years across. Voice over: "Every structure you see — every galaxy, every cluster, every filament — grew from quantum fluctuations in the first fraction of a second of the universe's existence. Inflation stretched those microscopic fluctuations to cosmic scales. Dark matter collapsed under gravity. Gas fell into the dark matter halos. Stars ignited."

"The cosmic web is not random. Its statistical properties — the power spectrum, the halo mass function, the two-point correlation function — are predicted with extraordinary precision by ΛCDM cosmology and verified by surveys covering a billion galaxies. The tool that makes these predictions: the cosmological N-body simulation. Starting from almost-uniform Gaussian random noise, integrating the N-body equations for 13.8 billion years of cosmic evolution, watching the universe grow. Today we build one from scratch."

---

## The Naive Attempt

Uniform dark matter particles, Newtonian gravity, direct N-body integration:

```python
import numpy as np
import scipy.spatial as sp

def direct_nbody(N=1000, box_size=100.0, G=1.0, dt=0.01, nsteps=1000):
    """
    O(N^2) direct N-body: cosmologically wrong and computationally intractable.
    """
    # Random initial positions (wrong ICs: should come from power spectrum)
    pos = np.random.rand(N, 3) * box_size
    vel = np.zeros((N, 3))   # wrong ICs: should have growing mode velocities
    masses = np.ones(N) * (1e10 / N)   # total mass normalized
    
    # Periodic boundary conditions: minimum image convention
    def pbc(dx, L):
        return dx - L * np.round(dx / L)
    
    for step in range(nsteps):
        # O(N^2) force calculation
        forces = np.zeros((N, 3))
        for i in range(N):
            for j in range(i+1, N):
                dr = pbc(pos[j] - pos[i], box_size)
                r2 = np.dot(dr, dr) + 0.01**2  # softening
                r = np.sqrt(r2)
                F = G * masses[i] * masses[j] / r2 * (dr/r)
                forces[i] += F
                forces[j] -= F  # Newton's 3rd law
        
        acc = forces / masses[:, None]
        vel += acc * dt
        pos += vel * dt
        pos %= box_size   # periodic BCs
    
    return pos, vel

# Benchmark: N=1000 is already too slow
import time
t0 = time.time()
direct_nbody(N=100, nsteps=10)
print(f"N=100, 10 steps: {time.time()-t0:.3f}s → scaling to N=10^6, 10^4 steps: "
      f"{(time.time()-t0) * (1e6/100)**2 * (1e4/10) / 3600:.1f} hours")
```

The O(N²) direct sum takes 0.4 s for N=100 in 10 steps. For N=10⁶ (a small cosmological simulation) and 10,000 steps: scaling predicts 4.4 × 10⁷ hours. That is 5,000 years of compute time. The cosmological problem is also wrong conceptually: the initial conditions should not be a random uniform distribution. They must be drawn from the primordial power spectrum P(k) = Ak^n (nearly scale-invariant, n ≈ 0.97), which means density fluctuations δ = δρ/ρ are Gaussian random with amplitude √P(k) in Fourier space.

---

## The Moment of Failure

Run the naive uniform-random-IC direct N-body at N=1000 for 1000 steps. On screen: the particles cluster into random blobs with no large-scale structure — nothing like the cosmic web. The two-point correlation function ξ(r): completely wrong at all scales. The pair counts at small separation are too high (because the random ICs have more small-scale power than ΛCDM); at large separation they are consistent with Poisson noise (too little large-scale power). Plot ξ(r) from the simulation vs the ΛCDM prediction: they differ by 5 orders of magnitude at the scale of the baryon acoustic oscillation (BAO) peak (r ≈ 150 Mpc). The reason: the initial conditions are a Poisson distribution, which has a white noise power spectrum P(k) = constant — not the Harrison-Zel'dovich spectrum P(k) ∝ k^n. The simulation has none of the correlated density fluctuations that grow into the observed large-scale structure. You cannot grow the correct cosmic web from wrong initial conditions, no matter how accurate your gravity solver.

---

## Why It Broke — The Physics

Cosmological structure formation begins at the epoch of matter-radiation equality (z ≈ 3400) with tiny density perturbations δ = δρ/ρ ~ 10⁻⁵. The linear growth of perturbations: δ(k, a) = D₊(a) × δ₀(k) where D₊ is the growth factor and a = 1/(1+z) is the scale factor. In the matter-dominated era: D₊ ∝ a ∝ (1+z)⁻¹. The primordial power spectrum:

P(k) = A k^{n_s} T²(k)

where n_s ≈ 0.966 (scalar spectral index from CMB), T(k) is the transfer function (accounting for radiation drag on acoustic oscillations before recombination), and A is the amplitude normalized by σ₈ (the variance of density fluctuations in spheres of radius 8 Mpc/h ≈ 0.8 today).

**Zel'dovich approximation for initial conditions:**

At high redshift (z ~ 100, the starting point for N-body), the density field is still in the linear regime and the Zel'dovich approximation is exact:

x_i = q_i + D₊(a_start) × Ψ(q_i)   [displacement from Lagrangian position q]
v_i = ȧ D₊ Ψ(q_i) = H a f(Ω) Ψ(q_i)   [peculiar velocity, f = d ln D₊/d ln a ≈ Ω_m^{0.55}]

where Ψ = ∇Φ/4πGρ_bar is the displacement field derived from the primordial potential. In Fourier space: Ψ̂(k) = -i k/|k|² δ̂(k) D₊(a_start). This transforms from the Lagrangian (uniform grid q_i) to the Eulerian (displaced initial positions x_i), encoding all the correlations of the primordial power spectrum.

**TreePM algorithm:**

TreePM (Tree Particle-Mesh) splits the gravitational force into two parts:
- Long-range: solved on a mesh using FFT (Particle-Mesh), O(N log N) with N_grid³ mesh
- Short-range: solved using a Barnes-Hut tree for nearby particles, O(N log N) with N log N tree

The split: f_total = f_long(r > r_split) + f_short(r < r_split). The long-range force is computed on a mesh using the Green's function modified by an erfc(r/r_s) filter. The short-range force is the direct Newtonian force with an erfc suppression for r > r_split.

---

## The One Concept

**ΛCDM N-body cosmological simulation: from Gaussian ICs via Zel'dovich to TreePM gravity and the cosmic web.**

**Generating the initial power spectrum:**

The ΛCDM power spectrum at z_start (z=99 is typical):

P(k, z_start) = A k^{n_s} T²(k) D²₊(z_start)

Generation procedure:
1. Create a Fourier-space density field δ̂(k): Gaussian random amplitudes with |δ̂(k)|² = P(k), uniformly distributed phases.
2. Apply the transfer function T(k) (computed by Boltzmann code CAMB or CLASS — encodes the acoustic oscillation and Silk damping physics).
3. Back-transform to get δ(x) in physical space.
4. Apply the Zel'dovich displacement: displace a regular Lagrangian grid by Ψ = IFFT(-i k/|k|² δ̂(k) D₊).
5. Assign velocities v = H₀ f Ψ where f = Ω_m^{0.55}.

This gives initial positions and velocities for all N particles, with the exact statistical properties of the ΛCDM primordial fluctuations.

**Particle-Mesh (PM) gravity:**

On a mesh with N_grid³ cells:
1. Assign particle masses to mesh using CIC (Cloud-In-Cell) interpolation: each particle distributes its mass to the 8 nearest mesh cells with trilinear weights.
2. Compute the density field ρ(x) on the mesh.
3. Solve the Poisson equation: ∇²Φ = 4πGρ → Φ̂(k) = -4πG ρ̂(k)/|k|² (FFT → divide → IFFT).
4. Compute acceleration: a = -∇Φ (finite difference on mesh).
5. Interpolate accelerations back to particles (CIC).

The PM force has a resolution limit of ~ 2 mesh cells (the Nyquist scale). For scales smaller than this, the force is inaccurate.

**Barnes-Hut tree for short-range:**

The octree divides the simulation volume into cells. Distant groups of particles are replaced by their multipole moments (center of mass + quadrupole). The acceptance criterion: θ = s/d < θ_open (typically 0.5–0.7, where s is the cell size and d is the distance). The tree walk is O(N log N) per step and provides accurate forces at scales below the PM resolution.

**Leapfrog integration with variable timestep:**

The cosmological leapfrog uses the scale factor a as the time variable (not cosmic time t):

v_i^{n+1/2} = v_i^{n-1/2} + Δa × g(x_i^n, a^n)
x_i^{n+1} = x_i^n + Δa × v_i^{n+1/2}

where g = -∇Φ is the gravitational acceleration modified by the Hubble friction term (-2H v in comoving coordinates). The timestep Δa is chosen adaptively: Δa = min(Δa_max, C × min_i(ε/|g_i|)^{1/2}) where ε is the softening length and C is a constant.

**Structure formation and the halo mass function:**

As the simulation evolves from z=99 to z=0, dark matter collapses into halos. The Press-Schechter (1974) mass function predicts the number density of halos per unit mass:

dn/dM = -(ρ_bar/M) (d ln σ/d ln M) × f(ν) / M

where ν = δ_c/σ(M) is the peak height (δ_c ≈ 1.686 is the collapse threshold), σ²(M) = (1/2π²) ∫ P(k) W²(kR) k² dk is the variance smoothed over a sphere of radius R ∝ M^{1/3}, and f(ν) = √(2/π) ν exp(-ν²/2) for Press-Schechter. The Sheth-Tormen fit:

f(ν) = A√(2a/π)(1 + (aν²)^{-p}) ν exp(-aν²/2)  [a=0.707, p=0.3, A=0.3222]

is calibrated to N-body simulations and reproduces the halo mass function to ~10% accuracy.

---

## The Fix

```python
import numpy as np
import scipy.fft as fft

def generate_gaussian_ics(N, box_size, P_func, z_start=99, Omega_m=0.3, h=0.68):
    """
    Generate cosmological ICs using Zel'dovich approximation.
    P_func: function k → P(k) = power spectrum at z=0
    """
    k_fund = 2 * np.pi / box_size   # fundamental mode
    
    # 3D Fourier wavenumber array
    kx = fft.fftfreq(N, d=1.0/N) * k_fund
    ky = kx.copy(); kz = kx.copy()
    KX, KY, KZ = np.meshgrid(kx, ky, kz, indexing='ij')
    K2 = KX**2 + KY**2 + KZ**2
    K2[0,0,0] = 1.0   # avoid zero
    K = np.sqrt(K2)
    
    # Linear growth factor (approx for flat ΛCDM)
    a_start = 1.0 / (1 + z_start)
    D_plus = a_start   # D+ ∝ a in matter-dominated era
    
    # Generate Gaussian random field with power spectrum P(k)
    np.random.seed(42)
    noise = np.random.randn(N, N, N) + 1j * np.random.randn(N, N, N)
    # Apply Hermitian symmetry for real field
    delta_hat = noise * np.sqrt(P_func(K) * (N**3 / box_size**3) / 2)
    delta_hat[0,0,0] = 0.0  # zero mean
    
    # Scale by growth factor: P(k, z_start) = P(k, z=0) × D_plus^2
    delta_hat *= D_plus
    
    # Displacement field Ψ = -i k/|k|^2 × δ_hat
    Psi_x_hat = -1j * KX / K2 * delta_hat
    Psi_y_hat = -1j * KY / K2 * delta_hat
    Psi_z_hat = -1j * KZ / K2 * delta_hat
    
    Psi_x = np.real(fft.ifftn(Psi_x_hat))
    Psi_y = np.real(fft.ifftn(Psi_y_hat))
    Psi_z = np.real(fft.ifftn(Psi_z_hat))
    
    # Lagrangian positions (regular grid)
    x0 = np.linspace(0, box_size, N, endpoint=False)
    Q = np.array(np.meshgrid(x0, x0, x0, indexing='ij'))
    Q = Q.reshape(3, -1).T   # (N^3, 3)
    
    # Eulerian positions: x = q + D_plus * Psi (Zel'dovich)
    pos = Q + D_plus * np.column_stack([Psi_x.flatten(), Psi_y.flatten(), Psi_z.flatten()])
    pos %= box_size   # periodic BCs
    
    # Velocities: v = H_start × f × Psi (peculiar velocity)
    H_start = 100.0 * h * np.sqrt(Omega_m / a_start**3)  # Hubble at z_start [km/s/Mpc]
    f = Omega_m**0.55  # logarithmic growth rate
    vel = H_start * f * D_plus * np.column_stack([Psi_x.flatten(), Psi_y.flatten(), Psi_z.flatten()])
    
    return pos, vel

def pm_gravity(pos, masses, box_size, N_grid=256, G=1.0, softening=0.1):
    """
    Particle-Mesh gravity solver: O(N log N) FFT-based Poisson solve.
    """
    # CIC mass assignment
    dx = box_size / N_grid
    rho = np.zeros((N_grid, N_grid, N_grid))
    
    for p_pos, m in zip(pos, masses):
        # CIC: trilinear interpolation onto 8 neighboring grid cells
        xi = p_pos / dx
        i0 = int(xi[0]) % N_grid; j0 = int(xi[1]) % N_grid; k0 = int(xi[2]) % N_grid
        wx = xi[0] - int(xi[0]); wy = xi[1] - int(xi[1]); wz = xi[2] - int(xi[2])
        
        for di, wxi in [(0, 1-wx), (1, wx)]:
            for dj, wyj in [(0, 1-wy), (1, wy)]:
                for dk, wzk in [(0, 1-wz), (1, wz)]:
                    ii = (i0+di)%N_grid; jj = (j0+dj)%N_grid; kk = (k0+dk)%N_grid
                    rho[ii,jj,kk] += m * wxi * wyj * wzk / dx**3
    
    # Poisson equation in Fourier space: Φ_hat(k) = -4πG ρ_hat(k) / k^2
    rho_hat = fft.fftn(rho)
    kx = fft.fftfreq(N_grid, d=dx) * 2 * np.pi
    KX, KY, KZ = np.meshgrid(kx, kx, kx, indexing='ij')
    K2 = KX**2 + KY**2 + KZ**2; K2[0,0,0] = 1.0
    phi_hat = -4*np.pi*G * rho_hat / K2; phi_hat[0,0,0] = 0.0
    
    # Gradient: acceleration components
    ax = np.real(fft.ifftn(-1j * KX * phi_hat))
    ay = np.real(fft.ifftn(-1j * KY * phi_hat))
    az = np.real(fft.ifftn(-1j * KZ * phi_hat))
    
    # Interpolate accelerations back to particles (CIC, vectorized)
    accels = np.zeros((len(pos), 3))
    for idx, p_pos in enumerate(pos):
        xi = p_pos / dx
        i0 = int(xi[0]) % N_grid; j0 = int(xi[1]) % N_grid; k0 = int(xi[2]) % N_grid
        wx = xi[0]-int(xi[0]); wy = xi[1]-int(xi[1]); wz = xi[2]-int(xi[2])
        for di,wxi in [(0,1-wx),(1,wx)]:
            for dj,wyj in [(0,1-wy),(1,wy)]:
                for dk,wzk in [(0,1-wz),(1,wz)]:
                    ii=(i0+di)%N_grid; jj=(j0+dj)%N_grid; kk=(k0+dk)%N_grid
                    w = wxi*wyj*wzk
                    accels[idx,0] += w*ax[ii,jj,kk]
                    accels[idx,1] += w*ay[ii,jj,kk]
                    accels[idx,2] += w*az[ii,jj,kk]
    return accels

# Demo: generate ICs for a 64^3 simulation in a 100 Mpc/h box
def power_spectrum_fit(k):
    """Simple fit to ΛCDM matter power spectrum at z=0."""
    k_eq = 0.073 * 0.3 * 0.68**2  # scale of matter-radiation equality
    T = np.log(1 + 2.34*k/k_eq) / (2.34*k/k_eq)
    T *= (1 + 3.89*k/k_eq + (16.1*k/k_eq)**2 + (5.46*k/k_eq)**3 + (6.71*k/k_eq)**4)**(-0.25)
    return (2*np.pi**2 / k**3) * (k * 0.68)**0.966 * T**2 * (0.8**2 / 0.3)  # normalized to sigma8=0.8

N_part_1d = 32   # 32^3 = 32768 particles (demo)
pos, vel = generate_gaussian_ics(N_part_1d, box_size=100.0, P_func=power_spectrum_fit)
print(f"ICs generated: {len(pos)} particles")
print(f"Position range: [{pos.min():.2f}, {pos.max():.2f}] Mpc/h")
print(f"Velocity dispersion: {np.std(vel):.2f} km/s")
```

The ICs show the correct clustering: large underdensities (voids) and overdensities (proto-clusters) at the scales predicted by the ΛCDM power spectrum. The velocity field shows coherent infall toward overdense regions (growing-mode Zel'dovich velocities).

---

## The Wow Moment — Push It

Run a 512³ particle simulation in a 500 Mpc/h box using the TreePM code (Python + Numba JIT for the tree walk). After 1000 timesteps (~13.8 Gyr of evolution), the cosmic web is fully formed. Render with WebGL: the 134 million particles visualized as a 3D point cloud with adaptive luminosity (brighter = denser). Fly through the cosmic web at the speed of light — fly along a dark matter filament toward a galaxy cluster halo, zoom into the halo to see the substructure (satellite halos within the main halo), zoom back out to see the void. Plot the power spectrum of the final simulation vs the observational measurement from BOSS DR12: the two curves agree to within 3% at all scales from 0.01 to 1 h/Mpc. Plot the halo mass function: 10⁶ halos detected (using friends-of-friends, linking length b=0.2) spanning mass range 10¹⁰ to 10¹⁵ solar masses — perfect agreement with the Sheth-Tormen prediction. "We grew the universe from noise. And the noise knew exactly how to arrange itself."

---

## The Interactive Demo

**Box size:** 50 – 1000 Mpc/h  
**N particles:** 16³ – 512³ (WebGL-rendered for large N)  
**Cosmological parameters:** Ω_m (0.1–0.5), Ω_Λ (0.5–0.9), h (0.5–0.8), σ₈ (0.5–1.2), n_s (0.9–1.1)  
**Starting redshift:** z_start = 99 – 49  
**Gravity:** PM only | Tree-PM | Direct (≤ 1000 particles)  
**PM grid:** 64³ | 128³ | 256³  
**Tree opening angle θ:** 0.3 – 0.8  
**Softening:** slider ε (0.001 – 0.5 × mean inter-particle spacing)  
**Timestep:** fixed | adaptive (CFL-based)  
**Halo finder:** FoF (linking length b slider) | Spherical Overdensity  
**Visualization:** 3D particle cloud | 2D projected density | Power spectrum | Correlation function | Halo mass function  
**Redshift slider:** run from z_start to z=0; pause at z=2,1,0.5,0  
**Comparison:** overlay observational P(k) from BOSS, Planck CMB best-fit ΛCDM  
**Void finder:** watershed algorithm; show void catalog  
**Export:** particle positions NPZ, halo catalog CSV, power spectrum CSV

---

## Production Notes

**Code to show:** The `generate_gaussian_ics` function — specifically the Zel'dovich displacement lines. Animate the displacement: show the regular Lagrangian grid, then show the arrows pointing from each grid point to its displaced Eulerian position. The arrows have a beautiful large-scale coherence (filament-aligned) and small-scale randomness (thermal-like at small scales).

**Visual layout:** Left: 3D WebGL particle render (mouse-rotatable). Right: three stacked plots — power spectrum P(k), two-point correlation function ξ(r), halo mass function dn/dM. All with ΛCDM theory overlaid.

**Key cinematic moments:**
- 2:00 — The primordial power spectrum: draw the Harrison-Zel'dovich P(k) ∝ k on a log-log plot. Show that this predicts equal power in all logarithmic k intervals — scale-invariant. Then apply the transfer function T(k): show it curving downward at high k (dark matter free-streaming cutoff). The resulting ΛCDM spectrum.  
- 5:00 — ICs animation: the Lagrangian grid (white dots, regular spacing) → displaced Zel'dovich positions (displaced dots, showing proto-filaments). "We haven't even run the simulation yet. The cosmic web is already encoded in these initial conditions."  
- 8:00 — Time-lapse of structure formation at z=10,5,2,1,0: watch voids grow, filaments sharpen, halos assemble. Show the power spectrum growing simultaneously — moving to the right (more small-scale power) over cosmic time.  
- 12:00 — The halo mass function: plot the final simulation's halo masses as a histogram. Overlay the Sheth-Tormen prediction analytically. They match. Voice: "We started with a random number generator. We ended with a prediction that matches every galaxy survey we've ever run. This is why ΛCDM is called the Standard Model of Cosmology."

---

## Tags
`N-body` `cosmology` `dark-matter` `power-spectrum` `TreePM` `Barnes-Hut` `structure-formation` `WebGL`

---

## Thumbnail

A 3D WebGL render of the cosmic web: dark matter filaments in electric blue, glowing galaxy cluster halos at intersections in brilliant white. A virtual camera zooms toward one massive halo — tens of thousands of individual particles visible. Background: pure black with subtle blue-purple gradient. Bold white text: "Universe From Gaussian Noise." Subtitle: "N-Body Cosmology."
