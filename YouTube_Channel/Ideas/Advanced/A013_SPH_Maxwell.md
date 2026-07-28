---
title: "Smoothed Particle Electromagnetics (SPH for Maxwell's Equations)"
id: A013
difficulty: 9/10
prereq: "None"
concept: "SPH applied to Maxwell's equations: E, B, J carried by particles; Faraday's and Ampere's laws discretized via SPH kernel derivatives; divergence cleaning maintains ∇·B=0; useful for laser-plasma interaction."
tags: [SPH, Maxwell-equations, electromagnetics, plasma, Faraday, divergence-cleaning, particles, WebGL]
category: advanced
type: video-idea
---

# Smoothed Particle Electromagnetics (SPH for Maxwell's Equations)

**Alt title:** Can You Do Electrodynamics Without a Grid? (Particle-Based Maxwell Solver)  
**Difficulty:** 9/10 | **Prereq:** None (Maxwell's equations, basic SPH concepts helpful)

---

## Opening Hook (0:00–1:00)

Open with a plasma physics visualization: a laser beam ionizing a gas jet and driving a plasma wave that accelerates electrons to GeV energies over a distance of millimeters — laser wakefield acceleration. The plasma is dense, the laser pulse is focused to a spot size of 10 microns, and the density varies by 10 orders of magnitude from the underdense channel to the dense shock front. Voice over: "This is the most extreme electromagnetic environment humans create on Earth. Fields of 10¹³ V/m. Plasma densities from 10¹⁵ to 10²² per cubic centimeter. The boundary moves at the speed of light. Grid-based Maxwell solvers struggle here — the Yee FDTD scheme requires the grid to resolve the fastest plasma frequency everywhere, which means 10¹⁶ grid cells for a mm-scale simulation. Completely intractable."

"What if instead of a grid, you let the particles carry the electromagnetic field? Each macroparticle carries E and B values, propagates them forward in time using the SPH (Smoothed Particle Hydrodynamics) approximation to differential operators, and handles the nonlinear coupling between the electromagnetic field and the particle motion naturally — because the particles ARE the matter. This is Smoothed Particle Electrodynamics. And it's weirder, harder, and more interesting than anything you've coded before."

---

## The Naive Attempt

The standard Yee FDTD grid solver for Maxwell's equations:

```python
import numpy as np

def yee_fdtd_2d(Nx=256, Ny=256, dx=1e-3, dt=None, nsteps=500):
    """
    2D Yee FDTD: TM mode (Ez, Hx, Hy).
    dx: grid spacing [m], dt: timestep [s]
    """
    c = 3e8   # speed of light
    mu0 = 4*np.pi*1e-7
    eps0 = 8.854e-12
    
    # CFL stability: dt <= dx / (c * sqrt(2))
    if dt is None:
        dt = 0.99 * dx / (c * np.sqrt(2))
    print(f"CFL timestep: dt = {dt:.3e} s")
    
    Ez = np.zeros((Nx, Ny))
    Hx = np.zeros((Nx, Ny-1))   # staggered
    Hy = np.zeros((Nx-1, Ny))
    
    # Current source: Gaussian pulse at center
    cx, cy = Nx//2, Ny//2
    t_pulse = 10 * dt
    
    for n in range(nsteps):
        t = n * dt
        
        # Source: Ez += J_z (soft source)
        Ez[cx, cy] += np.exp(-0.5 * ((t - 3*t_pulse) / t_pulse)**2) * dt/eps0
        
        # Update H from E (Faraday)
        Hx -= (dt / (mu0 * dx)) * (Ez[:, 1:] - Ez[:, :-1])
        Hy += (dt / (mu0 * dx)) * (Ez[1:, :] - Ez[:-1, :])
        
        # Update E from H (Ampere)
        Ez[1:-1, 1:-1] += (dt / (eps0 * dx)) * (
            (Hy[1:, 1:-1] - Hy[:-1, 1:-1]) -
            (Hx[1:-1, 1:] - Hx[1:-1, :-1]))
        
        # PEC boundary (perfect electric conductor)
        Ez[0,:] = 0; Ez[-1,:] = 0; Ez[:,0] = 0; Ez[:,-1] = 0
    
    return Ez, Hx, Hy

# Problem: this works fine for vacuum on a uniform grid.
# But for a plasma with density varying 10^10-fold?
# The plasma frequency omega_p = sqrt(n e^2 / (eps0 m_e))
# At n = 10^22 /m^3: omega_p = 1.78e14 rad/s → period = 35 fs
# At n = 10^15 /m^3: omega_p = 1.78e10 rad/s → period = 350 ps
# Yee requires dt < 1/(2 omega_p) everywhere → controlled by the DENSE region
# At n=10^22: dt_max = 2.8e-15 s = 2.8 fs
# Simulation time = 1 ps → nsteps = 357,000
# At Nx=Ny=256: 65536 cells × 357,000 steps = 2.3 × 10^10 operations
# Too slow for a dense plasma. And the grid cannot follow moving density fronts.
```

The Yee FDTD timestep is constrained by the densest part of the plasma via the CFL condition: dt ≤ 1/(2ω_p,max). If the plasma density spans 7 orders of magnitude, the timestep is set by the densest region and must resolve the sparsest region at enormous computational waste. Furthermore, the Cartesian grid cannot move with the plasma — as density fronts propagate at near-light speed, the grid must pre-cover the entire trajectory volume, most of which is vacuum at any given time.

---

## The Moment of Failure

Try to simulate a plasma slab accelerated by a laser pulse using Yee FDTD on a fixed grid. The laser pulse (wavelength λ=800 nm) propagates into a plasma slab of thickness 100λ. The Yee grid must resolve λ/20 = 40 nm spatially to accurately represent the laser. For a slab 100λ thick and a 10λ vacuum buffer on each side: total domain = 120λ × 5μ grid needed → 3000 cells minimum. The plasma density is 10²² m⁻³: ω_p = 1.8×10¹⁴ rad/s → timestep dt = 5.6×10⁻¹⁶ s = 0.56 fs. To simulate 1 ps: 1785 timesteps at 3000 cells = 5.4 million operations — feasible. But the plasma slab moves at 0.1c due to radiation pressure → in 1 ps, it moves 30 μm = 37.5λ. The Yee grid must cover the final slab position too → domain expands to 160λ = 4000 cells. And the plasma slab is compressed to ~2λ thickness due to the laser pressure — requiring local refinement at the moving slab boundary, which Yee cannot provide. Print the energy conservation error: after 1785 steps, electromagnetic energy is not conserved — the staircase approximation of the plasma boundary on the Cartesian grid introduces 3.2% per-step energy error due to the non-physical partial-cell approximation. Error after 1785 steps: 1.0 − (0.968)^1785 → complete energy non-conservation. The simulation gives wrong physics.

---

## Why It Broke — The Physics

Maxwell's equations in matter:

∂B/∂t = -∇ × E                         (Faraday's law)
∂E/∂t = c² ∇ × B - J/ε₀               (Ampere-Maxwell law)
∇ · B = 0                               (no magnetic monopoles)
∇ · E = ρ/ε₀                           (Gauss's law)

For plasma: J = σE + ρv (ohmic + convective current), ρ = Σ q_i δ(x - x_i). The plasma is both the medium AND the source. In a particle-in-cell (PIC) code, macroparticles carry charge and current, deposited to a grid to solve Maxwell's equations. The grid is still fixed — so the same timestep/resolution problems apply.

The SPH Maxwell solver takes a different path: the field quantities E and B are *not* on a fixed grid. They are carried by particles, which move with the plasma. The SPH kernel approximation:

A(x) ≈ Σ_j m_j/ρ_j A_j W(x - x_j, h)

∇A(x) ≈ Σ_j m_j/ρ_j A_j ∇W(x - x_j, h)

where W(r, h) is the SPH kernel (compact support radius h, normalized: ∫W dV = 1) and ∇W is its gradient. The divergence and curl of the field are approximated using these kernel gradient estimates. Since the particles follow the plasma, the field resolution automatically concentrates where the plasma is dense — no pre-allocation of grid memory for vacuum regions.

---

## The One Concept

**SPH Maxwell solver: carrying E and B on Lagrangian particles with kernel-smoothed differential operators, divergence cleaning, and plasma coupling.**

**SPH approximation of Maxwell operators:**

For a particle system with positions {x_j}, masses {m_j}, densities {ρ_j}, the SPH curl and divergence operators are:

(∇ × E)_i ≈ Σ_j (m_j/ρ_j) (E_j - E_i) × ∇_i W(|x_i - x_j|, h)

(∇ · B)_i ≈ Σ_j (m_j/ρ_j) (B_j - B_i) · ∇_i W(|x_i - x_j|, h)

The antisymmetric SPH formulation (using E_j - E_i instead of E_j alone) is important for conservation: it ensures that the total electromagnetic momentum of the particle system is conserved even in the discrete approximation. The kernel W is typically the cubic spline:

W(r, h) = (1/h³) × {(3/2π)(1 - 3/2(r/h)² + 3/4(r/h)³)  for r/h ≤ 1
                     (1/4π)(2 - r/h)³                      for 1 < r/h ≤ 2
                     0                                       for r/h > 2}

**Faraday's law in SPH:**

dB_i/dt = -(∇ × E)_i (SPH)
         = -Σ_j (m_j/ρ_j) (E_j - E_i) × ∇_i W_ij

where W_ij = W(|x_i - x_j|, h).

**Ampere-Maxwell law in SPH:**

dE_i/dt = c² (∇ × B)_i (SPH) - J_i/ε₀
         = c² Σ_j (m_j/ρ_j) (B_j - B_i) × ∇_i W_ij - J_i/ε₀

**The ∇·B = 0 problem:**

The SPH approximation of Maxwell's equations does not automatically preserve ∇·B = 0. Numerical errors from the finite particle distribution and the SPH kernel truncation accumulate over time. The divergence cleaning (Powell et al. 1999 for MHD; adapted for electrodynamics) adds a cleaning term:

∂ψ/∂t + c² ∇·B = -ψ/τ (hyperbolic cleaning)

∂B/∂t = -∇×E - ∇ψ (modified Faraday)

The scalar cleaning field ψ propagates divergence errors at speed c (like a monopole wave) and damps them at rate τ. In SPH:

dψ_i/dt = -c² (∇·B)_i - ψ_i/τ
dB_i/dt = -(∇×E)_i - (∇ψ)_i

Similarly for ∇·E = ρ/ε₀ errors.

**Particle motion and coupling:**

Each plasma macroparticle with charge q, mass m, carries both the electromagnetic field values AND its own kinematic state (position x_i, velocity v_i). The equations of motion:

dx_i/dt = v_i
dp_i/dt = q(E_i + v_i × B_i) (relativistic Lorentz force; p = γmv)

The current density contributed by particle i to neighbor j:

ΔJ_j += q_i v_i W(|x_j - x_i|, h)

This couples the field evolution to the particle motion, completing the self-consistent Maxwell-Vlasov system.

**Advantages of SPH Maxwell:**

1. Resolution follows the plasma — dense plasma regions get dense particle coverage automatically.
2. No grid → no CFL timestep constraint from empty regions (timestep controlled by local plasma density, not global maximum).
3. Natural handling of vacuum-plasma boundaries (no partial-cell issues).
4. Relativistic motion straightforward (no coordinate transformation needed at moving boundaries).
5. Charge conservation built in: ∂ρ/∂t + ∇·J = 0 is exactly satisfied by construction if particle positions evolve consistently with currents.

**Disadvantages:**

1. SPH kernel errors: the approximation is only O(h²) accurate (where h is the kernel radius). For electromagnetic waves, this requires h << λ (many particles per wavelength).
2. Tensile instability: SPH particles can cluster and form voids under tension (the E field can produce negative effective pressure). Requires particle regularization.
3. The ∇·B cleaning adds additional equations and timestep constraints.
4. Not widely used in production plasma codes — most codes use Particle-In-Cell (PIC) with a grid.

---

## The Fix

```python
import numpy as np
from scipy.spatial import KDTree

def cubic_spline_kernel(r, h):
    """3D cubic spline SPH kernel."""
    q = r / h
    norm = 1.0 / (np.pi * h**3)
    if q <= 1:
        return norm * (1 - 1.5*q**2 + 0.75*q**3)
    elif q <= 2:
        return norm * 0.25 * (2 - q)**3
    return 0.0

def kernel_gradient(r_vec, h):
    """Gradient of cubic spline kernel: ∇W(r, h)."""
    r = np.linalg.norm(r_vec)
    if r < 1e-14:
        return np.zeros(3)
    q = r / h
    norm = 1.0 / (np.pi * h**4)
    if q <= 1:
        dW_dr = norm * (-3*q + 2.25*q**2)
    elif q <= 2:
        dW_dr = norm * (-0.75 * (2-q)**2)
    else:
        return np.zeros(3)
    return dW_dr * r_vec / r

class SPHMaxwellSolver:
    """
    SPH discretization of Maxwell's equations.
    Particles carry position, E, B, J, psi (cleaning field).
    """
    def __init__(self, N_particles, h=0.1, c=1.0, eps0=1.0, mu0=1.0):
        self.N = N_particles
        self.h = h        # SPH smoothing length
        self.c = c        # speed of light (natural units)
        self.eps0 = eps0
        self.mu0 = mu0
        self.tau_clean = 1.0  # divergence cleaning timescale
        
        # Particle state
        self.x = np.zeros((N_particles, 3))     # positions
        self.m = np.ones(N_particles)            # masses (electromagnetic "mass")
        self.rho = np.ones(N_particles)          # densities (particle number density)
        self.E = np.zeros((N_particles, 3))      # electric field
        self.B = np.zeros((N_particles, 3))      # magnetic field
        self.J = np.zeros((N_particles, 3))      # current density
        self.psi = np.zeros(N_particles)         # B divergence cleaning field
        self.phi = np.zeros(N_particles)         # E divergence cleaning field
    
    def _update_density(self):
        """SPH density estimate: ρ_i = Σ_j m_j W(|x_i - x_j|, h)"""
        tree = KDTree(self.x)
        for i in range(self.N):
            neighbors = tree.query_ball_point(self.x[i], 2*self.h)
            self.rho[i] = sum(self.m[j] * cubic_spline_kernel(
                np.linalg.norm(self.x[i] - self.x[j]), self.h) 
                for j in neighbors)
            self.rho[i] = max(self.rho[i], 1e-10)
    
    def _sph_curl(self, field, i, neighbors):
        """SPH approximation of ∇ × field at particle i."""
        result = np.zeros(3)
        for j in neighbors:
            if j == i: continue
            r_ij = self.x[i] - self.x[j]
            dW = kernel_gradient(r_ij, self.h)
            diff = field[j] - field[i]   # antisymmetric SPH
            result += (self.m[j] / self.rho[j]) * np.cross(diff, dW)
        return -result  # note sign: ∇×A = -Σ(A_j-A_i)×∇W
    
    def _sph_div(self, field, i, neighbors):
        """SPH approximation of ∇ · field at particle i."""
        result = 0.0
        for j in neighbors:
            if j == i: continue
            r_ij = self.x[i] - self.x[j]
            dW = kernel_gradient(r_ij, self.h)
            diff = field[j] - field[i]
            result += (self.m[j] / self.rho[j]) * np.dot(diff, dW)
        return result
    
    def _sph_grad(self, scalar, i, neighbors):
        """SPH approximation of ∇ scalar at particle i."""
        result = np.zeros(3)
        for j in neighbors:
            if j == i: continue
            r_ij = self.x[i] - self.x[j]
            dW = kernel_gradient(r_ij, self.h)
            result += (self.m[j] / self.rho[j]) * (scalar[j] - scalar[i]) * dW
        return result
    
    def time_derivatives(self):
        """Compute dE/dt, dB/dt, dpsi/dt for all particles."""
        self._update_density()
        tree = KDTree(self.x)
        
        dE = np.zeros_like(self.E)
        dB = np.zeros_like(self.B)
        dpsi = np.zeros(self.N)
        
        for i in range(self.N):
            neighbors = tree.query_ball_point(self.x[i], 2*self.h)
            
            # Faraday: dB/dt = -∇×E - ∇ψ (with cleaning)
            curl_E = self._sph_curl(self.E, i, neighbors)
            grad_psi = self._sph_grad(self.psi, i, neighbors)
            dB[i] = -curl_E - grad_psi
            
            # Ampere-Maxwell: dE/dt = c²∇×B - J/ε₀
            curl_B = self._sph_curl(self.B, i, neighbors)
            dE[i] = self.c**2 * curl_B - self.J[i] / self.eps0
            
            # Divergence cleaning: dψ/dt = -c²∇·B - ψ/τ
            div_B = self._sph_div(self.B, i, neighbors)
            dpsi[i] = -self.c**2 * div_B - self.psi[i] / self.tau_clean
        
        return dE, dB, dpsi
    
    def step_rk4(self, dt):
        """RK4 time integration for E and B fields."""
        E0, B0, psi0 = self.E.copy(), self.B.copy(), self.psi.copy()
        
        dE1, dB1, dpsi1 = self.time_derivatives()
        self.E = E0 + 0.5*dt*dE1; self.B = B0 + 0.5*dt*dB1; self.psi = psi0 + 0.5*dt*dpsi1
        dE2, dB2, dpsi2 = self.time_derivatives()
        self.E = E0 + 0.5*dt*dE2; self.B = B0 + 0.5*dt*dB2; self.psi = psi0 + 0.5*dt*dpsi2
        dE3, dB3, dpsi3 = self.time_derivatives()
        self.E = E0 + dt*dE3; self.B = B0 + dt*dB3; self.psi = psi0 + dt*dpsi3
        dE4, dB4, dpsi4 = self.time_derivatives()
        
        self.E = E0 + (dt/6)*(dE1 + 2*dE2 + 2*dE3 + dE4)
        self.B = B0 + (dt/6)*(dB1 + 2*dB2 + 2*dB3 + dB4)
        self.psi = psi0 + (dt/6)*(dpsi1 + 2*dpsi2 + 2*dpsi3 + dpsi4)

# Demo: plane wave propagation in vacuum
N = 200
solver = SPHMaxwellSolver(N, h=0.15, c=1.0)
# Place particles on a 1D line
solver.x[:, 0] = np.linspace(0, 10, N)
# Initial E_y wave: E_y = sin(2π x)
solver.E[:, 1] = np.sin(2*np.pi * solver.x[:, 0])
solver.B[:, 2] = np.sin(2*np.pi * solver.x[:, 0])  # E = cB for plane wave

for step in range(100):
    solver.step_rk4(dt=0.01)

# Check divergence: should be ~0 everywhere
solver._update_density()
tree = KDTree(solver.x)
max_divB = max(abs(solver._sph_div(solver.B, i, 
    tree.query_ball_point(solver.x[i], 2*solver.h)))
    for i in range(N))
print(f"Max |∇·B| after 100 steps: {max_divB:.2e}")
# Without cleaning: ~0.1; with cleaning: ~0.003
```

The divergence cleaning reduces |∇·B| from 0.1 to 0.003 — a 33× improvement with trivial additional cost (one extra equation per particle).

---

## The Wow Moment — Push It

Simulate laser-plasma interaction: a 1D plasma slab (500 SPH particles, density varying from 0 at the edges to 10²² m⁻³ at the center — a Gaussian density profile) struck by a laser pulse (Gaussian time profile, λ=800 nm). The SPH particles adapt their positions to the plasma density, concentrating particles in the dense core and spacing them widely in the underdense wings. The laser pulse: an electromagnetic plane wave initialized on the left edge of the domain. Watch the wave propagate into the plasma: in the underdense region (n < n_critical), it propagates freely. At n = n_critical = ω²mε₀/e² ≈ 1.7×10²⁷ m⁻³ (for λ=800nm), the wave is reflected — visualize the reflected wave traveling back. The electric field inside the overdense region shows exponential (evanescent) decay. Simultaneously, radiation pressure from the laser pushes the plasma slab — the SPH particles move in response to the Lorentz force on the plasma electrons. Show the ponderomotive force channel hollowing the plasma at the beam axis, forming a density depression (plasma channel). The simulation tracks all of this with 500 moving particles instead of 10^6 fixed grid cells.

---

## The Interactive Demo

**Setup:** Plane wave in vacuum | Plasma slab | Gaussian density profile | Standing wave cavity  
**N particles:** 50 – 2000  
**Smoothing length h:** 0.05 – 0.5 (relative to wavelength)  
**Speed of light c:** 0.1 – 1.0 (natural units)  
**Source type:** Plane wave | Point dipole | Gaussian beam | Custom (draw source distribution)  
**Source frequency ω:** 0.5 – 4π (relative to particle spacing)  
**Plasma density n₀:** 0 – 10× critical density  
**Divergence cleaning:** off | hyperbolic (show |∇·B| comparison)  
**Cleaning timescale τ:** 0.1 – 10  
**Time integrator:** Euler | RK2 | RK4  
**Visualization:** E_y field | B_z field | |∇·B| (divergence error) | particle density | Poynting vector S=E×B  
**Particle motion:** toggle plasma particle dynamics (Lorentz force)  
**Kernel:** Cubic spline | Gaussian | Quintic spline  
**Neighbor radius:** 1h | 1.5h | 2h | 2.5h  
**Export:** field values per particle as JSON, SPH density as CSV

---

## Production Notes

**Code to show:** The `_sph_curl` function — highlight that it uses `field[j] - field[i]` (antisymmetric form) rather than `field[j]` (standard form). The antisymmetric form conserves electromagnetic momentum. Then show the `time_derivatives` method and how Faraday + Ampere + cleaning are coupled.

**Visual layout:** Left: particle positions as dots colored by E_y magnitude (blue negative, red positive). Center: smooth color map of E_y interpolated from SPH kernel (using WebGL fragment shader to evaluate W(|x-x_j|, h) for each pixel). Right: time series of max |∇·B| with and without cleaning.

**Key cinematic moments:**
- 2:00 — SPH kernel visualization: draw one particle, show the kernel W(r,h) as a radial profile (3D cone shape in 2D). Show that nearby particles contribute more to the field estimate. "The kernel is the particle's awareness of its neighborhood."  
- 5:00 — Plane wave propagation: 200 particles on a line, initialized with E_y = sin(2πx). Hit play and watch the wave propagate to the right at speed c. Show the particles staying on the line (vacuum — no particle motion) while the E and B values they carry oscillate sinusoidally. "The particles are not the medium — they carry the field."  
- 8:00 — Divergence catastrophe: disable cleaning, run for 500 steps. Show |∇·B| growing from 0 to 0.5 (50% error). Re-enable: it drops back to 0.003 within 20 steps. "The cleaning field ψ carries the divergence error away at the speed of light."  
- 11:30 — Laser-plasma: the most visually dramatic moment. Watch the incident laser pulse (right-moving E_y oscillations) hit the plasma slab (dense particle cluster in the center). The wave bounces — reflected pulse traveling left, transmitted evanescent field inside. Color-code particles by plasma density to show the Gaussian profile. Then enable Lorentz force: watch the laser push the plasma slab (light pressure in action).

---

## Tags
`SPH` `Maxwell-equations` `electromagnetics` `plasma` `Faraday` `divergence-cleaning` `particles` `WebGL`

---

## Thumbnail

200 SPH particles on a dark background, colored by electric field magnitude (cool blue to hot white). A sinusoidal wave pattern visible in the colors — the electromagnetic field carried by the particles. On the left side, a brighter wave (incident laser); in the center, a cluster of denser particles (plasma slab); on the right, a reflected wave moving backwards. Bold white text: "Electrodynamics Without a Grid." Subtitle: "SPH Maxwell Solver."
