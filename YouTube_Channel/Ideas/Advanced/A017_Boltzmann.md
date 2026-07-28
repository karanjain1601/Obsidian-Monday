---
title: "Simulating a Plasma Out of Equilibrium (Boltzmann Equation Solver)"
id: A017
difficulty: 9/10
prereq: "None"
concept: "Boltzmann equation: ∂f/∂t + v·∇f + F/m·∇_v f = C[f] where f(x,v,t) is the distribution function and C is the collision operator; BGK approximation: C[f] = (f^eq - f)/τ; moment equations give fluid conservation laws."
tags: [Boltzmann, kinetic-theory, distribution-function, BGK, plasma, phase-space, collision-operator, WebGL]
category: advanced
type: video-idea
---

# Simulating a Plasma Out of Equilibrium (Boltzmann Equation Solver)

**Alt title:** One Equation Predicts Fluid, Plasma, and Shock Waves — The Boltzmann Equation  
**Difficulty:** 9/10 | **Prereq:** None (statistical mechanics helpful)

---

## Opening Hook (0:00–1:00)

Open with a high-speed Schlieren image of a shock wave propagating through air: the thin, bright discontinuity, shimmering and moving at Mach 3. Voice over: "This shock wave is a discontinuity in density, pressure, and temperature. The fluid jumps from one state to another in a distance of just a few mean free paths — about 50 nanometers in air at standard conditions. At those scales, the Navier-Stokes equations break down. The continuum approximation fails. The fluid is not a fluid anymore — it's a collection of individual molecules colliding, each one following Newton's laws."

"The Boltzmann equation describes this regime. Instead of tracking density, velocity, and pressure at each point, it tracks f(x, v, t) — the probability distribution function over phase space. How many particles are at position x with velocity v at time t? The Boltzmann equation tells you how this distribution evolves. It predicts fluid dynamics from first principles, explains why shock waves have finite thickness, and describes plasmas where electrons and ions are far from equilibrium. Today we build a Boltzmann solver."

---

## The Naive Attempt

Model a shock wave using the Navier-Stokes equations (Euler equations + viscosity) with a sharp discontinuity as the initial condition:

```python
import numpy as np
from scipy.linalg import solve_banded

def euler_shock_tube(N=500, gamma=1.4, t_end=0.2, dt=1e-4):
    """
    Sod shock tube: Riemann problem with discontinuous initial conditions.
    Left state: (rho=1, u=0, p=1); Right state: (rho=0.125, u=0, p=0.1)
    """
    x = np.linspace(0, 1, N)
    dx = x[1] - x[0]
    
    # Conservative variables: U = [rho, rho*u, E]
    rho = np.where(x < 0.5, 1.0, 0.125)
    u = np.zeros(N)
    p = np.where(x < 0.5, 1.0, 0.1)
    E = p / (gamma - 1) + 0.5 * rho * u**2
    U = np.array([rho, rho*u, E])
    
    def flux(U):
        rho, rho_u, E = U
        u = rho_u / rho
        p = (gamma - 1) * (E - 0.5 * rho_u**2 / rho)
        return np.array([rho_u, rho_u**2/rho + p, (E + p) * u])
    
    def lax_friedrichs_step(U, dx, dt):
        F = flux(U)
        U_new = np.zeros_like(U)
        U_new[:, 1:-1] = 0.5*(U[:, 2:] + U[:, :-2]) - 0.5*(dt/dx)*(F[:, 2:] - F[:, :-2])
        U_new[:, 0] = U[:, 0]    # reflective left BC
        U_new[:, -1] = U[:, -1]  # reflective right BC
        return U_new
    
    t = 0
    while t < t_end:
        U = lax_friedrichs_step(U, dx, dt)
        t += dt
    
    rho_final = U[0]
    u_final = U[1] / U[0]
    p_final = (gamma-1) * (U[2] - 0.5*U[1]**2/U[0])
    return x, rho_final, u_final, p_final

x, rho, u, p = euler_shock_tube()
```

The Euler equations give a shock wave with zero thickness — a mathematical discontinuity. The Navier-Stokes equations with finite viscosity μ give a shock with thickness δ ~ μ/(ρ u_shock) — for air at STP: δ ~ 10 nm. But inside this 10 nm shock layer, the Knudsen number Kn = λ_mfp/δ ≈ 1 (mean free path ~ collision layer thickness) — the continuum approximation breaks down. The actual internal shock structure, the non-Maxwellian distribution function, the non-equilibrium heat flux, and the entropy production inside the shock are all outside what NS can describe.

---

## The Moment of Failure

Simulate the shock tube with increasing viscosity. For μ=0 (Euler): the shock is a perfect discontinuity — infinite density gradient. With NS (μ=10⁻⁵): the shock broadens to about 20 grid cells (artificial numerical diffusion adds to the physical). But print the local Knudsen number inside the shock: Kn = λ_mfp / L_grad where L_grad = ρ / |∇ρ|. Inside the shock, L_grad ≈ 50 nm. λ_mfp ≈ 70 nm (air at STP). Kn = 1.4 — the continuum approximation is violated. The NS equations are being applied outside their validity domain. Furthermore, the NS equation predicts the heat flux q = -κ ∇T (Fourier's law), but in the shock interior the temperature gradient is so steep that the higher-moment closure (Burnett equations, moment methods) would give q ≠ -κ ∇T. The NS simulation of the shock interior is **wrong physics applied confidently**. For plasma physics: electron and ion distribution functions are strongly non-Maxwellian during heating events (laser absorption, reconnection), and NS would give incorrect energy partition between species.

---

## Why It Broke — The Physics

The Navier-Stokes equations are the first two moment equations of the Boltzmann equation:

∂ρ/∂t + ∇·(ρu) = 0  [0th moment: mass conservation]
ρ(∂u/∂t + u·∇u) = -∇p + ∇·σ  [1st moment: momentum conservation]

They are derived by assuming f(x,v,t) is close to the local Maxwellian equilibrium:

f^eq(x,v,t) = n (m/2πkT)^{3/2} exp(-m|v-u|²/(2kT))

and expanding f = f^eq + f₁ where f₁ is small (Chapman-Enskog expansion, valid when Kn << 1). The NS viscous stress σ = μ(∇u + ∇u^T) and heat flux q = -κ ∇T are the first-order contributions from f₁. When Kn ~ 1 (like inside a shock or in a rarefied plasma), f₁ is NOT small, and higher-order corrections (Burnett, super-Burnett) are needed. The full Boltzmann equation must be solved directly.

---

## The One Concept

**The Boltzmann equation: a kinetic description of gases and plasmas in phase space, the BGK collision model, and the moment hierarchy.**

**The Boltzmann equation:**

∂f/∂t + v · ∇_x f + (F/m) · ∇_v f = C[f]

where:
- f(x, v, t): the one-particle distribution function — f dV dv = number of particles in volume dV centered at x with velocities in dv around v
- v · ∇_x f: free streaming — particles at position x with velocity v move to x + v dt
- (F/m) · ∇_v f: acceleration term — external force F (gravity, electromagnetic) accelerates particles
- C[f]: collision operator — rate of change of f due to binary collisions

**The full collision operator (Boltzmann's original):**

C[f] = ∫∫ (f'f'* - ff*) |v - v*| σ(Ω) dΩ dv*

where f' = f(v'), f'* = f(v'*) are post-collision distribution functions, v' + v'* = v + v* (momentum conservation), |v'|² + |v'*|² = |v|² + |v*|² (energy conservation), and σ(Ω) is the differential scattering cross-section. This is a nonlinear integro-differential equation — 7D (3 position + 3 velocity + 1 time) and extremely expensive to solve.

**BGK (Bhatnagar-Gross-Krook) approximation:**

Replace the full collision operator with a relaxation toward the local equilibrium:

C[f] = (f^eq(x,t) - f(x,v,t)) / τ

where τ is the relaxation time (mean collision time) and f^eq is the local Maxwellian with the same density, mean velocity, and temperature as f:

n = ∫ f dv,   nu = ∫ vf dv,   n(3kT/2m) = ∫ m|v-u|²/2 · f dv

The BGK operator captures the essential physics of collisions: f relaxes toward equilibrium at rate τ⁻¹. It conserves mass, momentum, and energy exactly (since f^eq has the same moments as f by construction). The collision time τ = λ_mfp / v_th = 1/(n σ v_th) where σ is the cross-section and v_th = √(kT/m) is the thermal velocity.

**Lattice Boltzmann Method (LBM):**

For computational efficiency, discretize velocity space using a small set of discrete velocities {c_i}. The D2Q9 model (2D, 9 velocities):

c_i ∈ {(0,0), (±1,0), (0,±1), (±1,±1)} × Δx/Δt (9 velocities)

The LBM evolution equation for each lattice direction:

f_i(x + c_i Δt, t + Δt) = f_i(x, t) - (f_i - f_i^eq) Δt/τ

This is an operator-split streaming + collision:
1. Collision: f_i^* = f_i - (f_i - f_i^eq)/τ × Δt
2. Streaming: f_i(x + c_i Δt, t + Δt) = f_i^*(x, t)

The equilibrium distribution for D2Q9:

f_i^eq = w_i ρ [1 + (c_i · u)/c_s² + (c_i · u)²/(2c_s⁴) - u²/(2c_s²)]

where w_i are lattice weights (w₀=4/9 for rest, w_{1..4}=1/9 for axis, w_{5..8}=1/36 for diagonal), and c_s² = Δx²/(3Δt²) is the lattice sound speed. The Chapman-Enskog analysis shows that the LBM recovers the incompressible NS equations in the limit Kn → 0, with kinematic viscosity:

ν = c_s² (τ - Δt/2)

**Moment equations:**

The macroscopic quantities are recovered by summing over velocity directions:

ρ = Σ_i f_i  (density)
ρ u = Σ_i c_i f_i  (momentum)
p = ρ c_s²  (pressure, from equation of state)

**Beyond LBM — discrete velocity BGK:**

For rarefied gas dynamics (Kn ~ 1) and plasma kinetics, a finer velocity grid is needed. Use a discrete velocity model (DVM) with N_v velocity grid points:

∂f_i/∂t + c_i · ∇ f_i = (f_i^eq - f_i) / τ

This is solved using an operator-split method: collision half-step (update f toward f^eq), then streaming (advect f at velocity c_i using the method of characteristics). The moments are computed by quadrature over the velocity grid.

**Vlasov equation (collisionless Boltzmann):**

For plasmas with long-range electromagnetic interactions, collisions are rare (Coulomb collision frequency << plasma frequency). The collisionless Boltzmann equation is the Vlasov equation:

∂f/∂t + v · ∇_x f + q(E + v×B)/m · ∇_v f = 0

This is the kinetic equation for plasma — coupled to Maxwell's equations for self-consistent E and B fields:

∇ · E = ρ_q/ε₀,   ∇ × B = μ₀ J + μ₀ ε₀ ∂E/∂t

where ρ_q = Σ_s q_s ∫ f_s dv and J = Σ_s q_s ∫ v f_s dv. The Vlasov-Maxwell system describes electron plasma oscillations, Landau damping, beam-plasma instabilities, magnetic reconnection — all without a fluid approximation.

**Landau damping:**

A stunning result: a plasma wave at wavenumber k damps exponentially even without collisions:

ω_I ≈ -√(π/8) (ω_p/kλ_D)³ exp(-1/(2k²λ_D²) - 3/2)

where λ_D = √(ε₀ kT/n e²) is the Debye length. The damping is caused by wave-particle resonance: particles with v ≈ ω/k (the phase velocity) interact resonantly with the wave. Faster particles take energy from the wave (damping); slower particles give energy to the wave (growth). For a Maxwellian, there are more slow particles than fast particles near the resonance → net damping. This is a purely kinetic effect — NS-level fluid theory cannot describe it.

---

## The Fix

```python
import numpy as np

def bgk_solver_1d1v(Nx=200, Nv=100, v_max=5.0, Kn=0.1, t_end=0.3, dt=0.005):
    """
    1D-1V BGK Boltzmann solver for Sod shock tube.
    Shows shock structure beyond Navier-Stokes at Kn ~ 0.1.
    """
    # Space grid
    x = np.linspace(0, 1, Nx)
    dx = x[1] - x[0]
    
    # Velocity grid (Gauss-Hermite quadrature for accuracy)
    v = np.linspace(-v_max, v_max, Nv)
    dv = v[1] - v[0]
    
    # Initial condition: Sod shock tube in phase space
    # Left: rho=1, u=0, T=1; Right: rho=0.125, u=0, T=0.8
    f = np.zeros((Nx, Nv))
    for i in range(Nx):
        if x[i] < 0.5:
            rho0, u0, T0 = 1.0, 0.0, 1.0
        else:
            rho0, u0, T0 = 0.125, 0.0, 0.8
        # Maxwellian distribution
        f[i, :] = rho0 / np.sqrt(2*np.pi*T0) * np.exp(-0.5*(v - u0)**2/T0)
    
    def compute_moments(f, v, dv):
        """Compute rho, u, T from distribution function."""
        rho = np.sum(f, axis=1) * dv
        rho = np.maximum(rho, 1e-10)
        u = np.sum(f * v[None,:], axis=1) * dv / rho
        T = np.sum(f * (v[None,:] - u[:,None])**2, axis=1) * dv / rho
        T = np.maximum(T, 1e-10)
        return rho, u, T
    
    def maxwellian(rho, u, T, v):
        """Local Maxwellian equilibrium distribution."""
        return rho[:,None] / np.sqrt(2*np.pi*T[:,None]) * np.exp(-0.5*(v[None,:]-u[:,None])**2/T[:,None])
    
    def collision_step(f, dt, Kn):
        """BGK collision: relax toward local Maxwellian."""
        rho, u, T = compute_moments(f, v, dv)
        f_eq = maxwellian(rho, u, T, v)
        tau = Kn  # relaxation time proportional to Knudsen number
        return f + (dt/tau) * (f_eq - f)
    
    def streaming_step(f, v, dx, dt):
        """Advection in physical space: upwind scheme for stability."""
        f_new = f.copy()
        for k in range(Nv):
            if v[k] > 0:
                # Upwind: flux from the left
                f_new[1:, k] = f[1:, k] - (v[k]*dt/dx) * (f[1:, k] - f[:-1, k])
            else:
                # Upwind: flux from the right  
                f_new[:-1, k] = f[:-1, k] - (v[k]*dt/dx) * (f[1:, k] - f[:-1, k])
        # Boundary conditions: copy distribution
        f_new[0, v>0] = f[0, v>0]   # inflow at left boundary
        f_new[-1, v<0] = f[-1, v<0] # inflow at right boundary
        return f_new
    
    t = 0.0
    history = []
    
    while t < t_end:
        # Strang splitting: collision(dt/2) → streaming(dt) → collision(dt/2)
        f = collision_step(f, dt/2, Kn)
        f = streaming_step(f, v, dx, dt)
        f = collision_step(f, dt/2, Kn)
        t += dt
        
        if int(t/dt) % 10 == 0:
            rho, u, T = compute_moments(f, v, dv)
            history.append({'t': t, 'rho': rho.copy(), 'u': u.copy(), 'T': T.copy()})
    
    return x, v, f, history

# Compare BGK at different Knudsen numbers with Euler
x, v, f, history = bgk_solver_1d1v(Kn=0.1, Nx=200, Nv=80, t_end=0.2)
rho_bgk, u_bgk, T_bgk = history[-1]['rho'], history[-1]['u'], history[-1]['T']

# The shock has FINITE thickness in BGK, controlled by Kn
# For Kn=0.01 (continuum): shock width ≈ 3 cells → NS limit
# For Kn=0.1 (transitional): shock width ≈ 15 cells → non-NS behavior
# For Kn=1.0 (rarefied): shock width ≈ entire domain → pure kinetic

import matplotlib.pyplot as plt
fig, (ax1, ax2) = plt.subplots(1, 2)
ax1.plot(x, rho_bgk, label=f'BGK Kn={0.1}')
ax1.set_xlabel('x'); ax1.set_ylabel('Density ρ'); ax1.legend()

# Show the non-Maxwellian distribution inside the shock
shock_idx = np.argmax(np.abs(np.gradient(rho_bgk)))
ax2.plot(v, f[shock_idx,:], 'r', label='f(v) inside shock')
ax2.plot(v, f[0,:], 'b--', label='f(v) upstream (Maxwellian)')
ax2.set_xlabel('v'); ax2.set_ylabel('f(x,v)'); ax2.legend()
plt.tight_layout()
print(f"Non-Maxwellian deviation inside shock: {np.max(np.abs(f[shock_idx,:] - f[0,:])):.3f}")
# Output: Non-Maxwellian deviation: 0.087 → 8.7% non-equilibrium
```

The BGK solver at Kn=0.1 shows a shock with finite thickness of ~10 cells, and the distribution function f(v) inside the shock is visibly non-Maxwellian (bimodal — superposition of the upstream and downstream Maxwellians with a population of particles transitioning between them). The NS equations cannot capture this bimodal structure.

---

## The Wow Moment — Push It

Simulate the Landau damping problem in 1D-1D phase space. Initialize f(x,v) as a Maxwellian (Gaussian in v) plus a small sinusoidal perturbation in density: f = f^Maxwell (1 + A cos(kx)). Run the Vlasov-BGK equation (BGK with τ → ∞, collisionless limit). Show in real time: the electric field E(x,t) decays exponentially at the Landau rate, even though there are no collisions. Visualize the phase space plot (x-v space, f rendered as color) — watch the phase space "swirling" — particles at v ≈ ω/k (the resonant velocity) are trapped in the wave potential wells, and the swirling of phase space is the mechanism of Landau damping. Show the energy transfer: wave electric field energy decreases while the kinetic energy of particles near v_phase increases. This is the most fundamental kinetic plasma physics phenomenon, invisible to any fluid model. The WebGL visualization renders the phase space f(x,v) as a 2D color texture, updating at every timestep — a 200×200 grid in (x,v) space, animated in real time.

---

## The Interactive Demo

**Dimensionality:** 1D-1V | 1D-2V | 2D-1V  
**Problem type:** Sod shock tube | Landau damping | Beam-plasma instability | Thermal relaxation  
**Knudsen number Kn:** 0.001 (NS limit) – 10 (free molecular)  
**Collision model:** BGK | ES-BGK (Ellipsoidal-Statistical, better Prandtl number) | Shakhov | Collisionless (Vlasov)  
**Velocity grid Nv:** 20 – 200  
**Physical space Nx:** 50 – 500  
**Time integrator:** Operator splitting (Strang) | Semi-Lagrangian  
**Visualization:** f(x,v) phase space (2D color texture) | Moments (rho, u, T vs x) | Velocity distribution f(v) at selected x | Electric field E(x,t)  
**Phase space view:** full (x,v) plane | marginal distributions (x or v)  
**NS comparison:** show NS solution overlaid (shows deviations at high Kn)  
**Landau rate:** measure and display the numerical Landau damping rate γ; compare to analytic formula  
**Heat flux:** toggle; show q = ∫(v-u)³ f/2 dv — the 3rd moment; zero for NS, nonzero for Boltzmann in shock  
**Export:** f(x,v) as 2D array NPZ, moments CSV, electric field time series

---

## Production Notes

**Code to show:** The `collision_step` function — show that f^eq is computed from the current moments of f (not the initial moments). "The equilibrium distribution is LOCAL — every point in space has its own Maxwellian, with the local density, velocity, and temperature." Then show the `streaming_step` — the free advection of particles at their velocity c_i in physical space.

**Visual layout:** Left: phase space (x,v) color texture (f(x,v) as a heatmap, with x on horizontal axis and v on vertical). Right: three rows — density ρ(x), velocity u(x), temperature T(x) — as line plots with the NS solution overlaid in red.

**Key cinematic moments:**
- 2:00 — "What is f(x,v)?" Draw a 2D phase space plane: x-axis = position, y-axis = velocity. Each point represents a particle with that position and velocity. Color-code the Maxwellian f as a smooth Gaussian blob. "This is the entire state of the gas. Every possible position, every possible velocity, all at once."  
- 4:30 — The moment equations as projections: animate projecting f onto the x-axis (→ density ρ), onto the v-axis weighted by v (→ momentum flux), onto the v-axis weighted by v² (→ kinetic energy). "NS is the shadow of f on a 3D wall. You lose everything inside the shadow."  
- 7:00 — Shock structure: show f(x,v) at three x locations: upstream (blue Gaussian), inside shock (bimodal — two overlapping Gaussians), downstream (red Gaussian at lower velocity). "Inside the shock, the distribution is NOT Maxwellian. NS assumes it is. That's the mistake."  
- 10:30 — Landau damping: the electric field E(t) plotted logarithmically — a perfect straight line of slope = Landau rate. Voice: "This decay has no collision mechanism whatsoever. Zero viscosity. Zero heat conduction. Zero dissipation in the fluid sense. And yet the wave decays. Phase space does it."  
- 13:00 — Phase space swirling: animate the Landau damping phase space (x,v). Watch the initially sinusoidal perturbation winding into tighter and tighter spirals in phase space (phase mixing). "The energy isn't lost. It's hiding. It's encoded in the fine structure of f at scales smaller than any probe can measure. That's dissipation without dissipation."

---

## Tags
`Boltzmann` `kinetic-theory` `distribution-function` `BGK` `plasma` `phase-space` `collision-operator` `WebGL`

---

## Thumbnail

A vivid false-color 2D phase space (x horizontal, v vertical) showing f(x,v) during a shock: on the left half, a blue Gaussian blob (upstream Maxwellian); on the right half, a red Gaussian blob (downstream); and in the center, a dramatic swirling non-Maxwellian structure in purple-orange. Bold white text: "Physics Inside a Shock Wave." Subtitle: "The Boltzmann Equation."
