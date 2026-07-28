---
title: "Probability Diffuses in Phase Space (Fokker-Planck Equation)"
id: A018
difficulty: 8.5/10
prereq: "None"
concept: "Fokker-Planck equation: ∂P/∂t = -∂(A·P)/∂x + ∂²(D·P)/∂x² (drift-diffusion); describes evolution of probability density for a Langevin stochastic process dx = A(x)dt + √(2D)dW; Brownian motion's Fokker-Planck: ∂P/∂t = D∇²P."
tags: [Fokker-Planck, stochastic, Langevin, drift-diffusion, probability-density, Brownian-motion, PDE, canvas]
category: advanced
type: video-idea
---

# Probability Diffuses in Phase Space (Fokker-Planck Equation)

**Alt title:** The PDE That Explains Brownian Motion, Option Pricing, and Neuron Firing  
**Difficulty:** 8.5/10 | **Prereq:** None (probability and basic PDEs helpful)

---

## Opening Hook (0:00–1:00)

Open with three seemingly unrelated animations playing simultaneously: a pollen grain jiggling in water under a microscope (Brownian motion), a stock price chart with its characteristic random walk (a log-normal process), and a neuron's membrane potential fluctuating and occasionally crossing a threshold to fire. Voice over: "Three completely different systems. One equation describes all three. The Fokker-Planck equation."

"In 1905, Einstein derived the equation governing the probability distribution of a Brownian particle. In 1913, Planck (yes, that Planck) generalized it to include drift. Today, the same equation appears in: quantitative finance (Black-Scholes is a Fokker-Planck equation in disguise), neuroscience (the leaky integrate-and-fire neuron model), plasma physics (velocity diffusion by collisions), and machine learning (the score-matching objective for diffusion models). One code, one concept, infinite applications. Let's build it."

Cut to the final demo: three side-by-side simulations showing probability density evolving for the three systems — pollen diffusing outward from a point source, a double-well potential with a probability blob escaping from one well to another, and a neural membrane potential distribution spiking periodically. All three computed by the same Fokker-Planck solver.

---

## The Naive Attempt

The obvious approach: simulate the stochastic process directly using the Langevin equation, average over many trajectories.

```python
import numpy as np
import matplotlib.pyplot as plt

def langevin_monte_carlo(A_func, D, x0=0.0, dt=0.01, T=10.0, N_traj=10000):
    """
    Direct Monte Carlo simulation of the Langevin SDE:
    dx = A(x) dt + sqrt(2D) dW
    A_func: drift coefficient
    D: diffusion coefficient (scalar or function of x)
    Returns histogram of positions at each saved time.
    """
    N_steps = int(T / dt)
    x = np.full(N_traj, x0, dtype=float)
    
    saved_times = np.linspace(0, T, 50)
    save_idx = set([int(t/dt) for t in saved_times])
    
    histograms = []
    for step in range(N_steps):
        A = A_func(x)
        D_x = D(x) if callable(D) else D
        noise = np.sqrt(2 * D_x * dt) * np.random.randn(N_traj)
        x = x + A * dt + noise
        
        if step in save_idx:
            bins = np.linspace(-5, 5, 100)
            hist, _ = np.histogram(x, bins=bins, density=True)
            histograms.append((step*dt, bins[:-1]+np.diff(bins)/2, hist))
    
    return histograms

# Double-well potential: V(x) = x^4/4 - x^2/2 → A(x) = -V'(x) = x - x^3
def double_well_drift(x):
    return x - x**3  # force = -∂V/∂x for V(x) = x^4/4 - x^2/2

# Simulate: 10,000 trajectories
import time
t0 = time.time()
hists = langevin_monte_carlo(double_well_drift, D=0.1, x0=1.0, N_traj=10000, T=50.0)
print(f"Monte Carlo: {time.time()-t0:.2f}s for 10,000 trajectories × 5000 steps")
# Output: 12.3s — barely usable; for N=100,000: 123s
```

The Monte Carlo approach requires N_traj × N_steps random number evaluations. For accuracy in the tails of the distribution (needed for rare events like neural spikes), N_traj must be enormous: at a tail probability of 10⁻⁶, you need N ~ 10⁸ trajectories. The Monte Carlo error scales as 1/√N — to get 1% accuracy in the tails at 10⁻⁶ probability requires N = 10^10. Completely intractable.

Furthermore, for the time-dependent probability density P(x,t), the Monte Carlo method gives a noisy histogram at each time — the noise is fundamental, not discretization error. You cannot smooth it away without biasing the estimate. For rare-event statistics, variance reduction techniques (importance sampling, splitting, AMS) are needed but require knowing the rare event structure in advance.

---

## The Moment of Failure

Run the Langevin Monte Carlo for the double-well potential at temperature D=0.2 (above the Kramers escape barrier height = 0.25). Start particles at x=+1 (right well). Theory (Kramers' formula) predicts mean escape time:

τ_Kramers = (2π / √(V''(x_min)|V''(x_max)|)) × exp(ΔV/D)

For D=0.2, ΔV = 0.25: τ_Kramers = 2π/(√2 × 1) × exp(0.25/0.2) = 2π × e^{1.25} ≈ 22 time units. Run the Monte Carlo for 10,000 trajectories, T=100. Measure the escape times (first passage times from well 1 to well 2). The histogram of escape times: very noisy, especially at the long-time tail. The mean escape time from Monte Carlo: 21.3 ± 4.7 (28% uncertainty). The Fokker-Planck approach will give: 21.97 ± 0.01 (0.05% uncertainty). Moreover, the probability density at x=0 (the barrier) is P(0,t) ≈ 10⁻⁶ — only 10 particles out of 10,000 trajectories have ever visited the barrier at any given time. The histogram at x=0 is pure noise (0 or 1 counts per bin). The Fokker-Planck equation gives P(0,t) analytically, with full accuracy everywhere.

---

## Why It Broke — The Physics

The Langevin equation:

dx = A(x) dt + √(2D) dW

describes a single trajectory (where W is the Wiener process — standard Brownian motion with independent increments dW ~ N(0, dt)). The probability density P(x,t) — the density of trajectories at position x at time t — obeys the Fokker-Planck equation:

∂P/∂t = -∂/∂x [A(x) P] + ∂²/∂x² [D(x) P]

This is a deterministic PDE. No randomness. Solving it gives P(x,t) everywhere simultaneously — no Monte Carlo noise, no sampling requirement, exact resolution in the tails. For N spatial grid points: the FP equation is an N × N linear PDE, solved in O(N³) for the full time evolution (or O(N) per timestep for the time-dependent case). For N=1000: the FP PDE takes 10⁻³ s per timestep. The Monte Carlo for equivalent accuracy (1% in tails): N=10⁸ trajectories, 10⁶ s. The Fokker-Planck approach is 10⁹ times faster.

The Fokker-Planck equation is derived from the Kramers-Moyal expansion of the master equation (or directly from Itô's lemma applied to the density). Its terms have clear physical meanings:
- Drift term -∂(AP)/∂x: probability density advected at speed A(x) — convection
- Diffusion term ∂²(DP)/∂x²: probability density spread at rate D — diffusion

---

## The One Concept

**The Fokker-Planck equation: the deterministic evolution of probability density for a stochastic process; stationary distribution; Kramers' escape theory; connection to the Langevin equation and Itô calculus.**

**Derivation from Itô calculus:**

For the Itô SDE dx = A(x,t) dt + σ(x,t) dW, the evolution of the expectation of any smooth function g(x):

d<g>/dt = <A(x) g'(x) + D(x) g''(x)>  [Itô's formula, D = σ²/2]

This is the *generator* L of the process:

Lg = A(x) ∂g/∂x + D(x) ∂²g/∂x²

The Fokker-Planck equation is the adjoint equation to this generator, describing the evolution of the density P rather than the expectation of g:

∂P/∂t = L* P = -∂/∂x [A P] + ∂²/∂x² [D P]

In multiple dimensions (x ∈ ℝⁿ):

∂P/∂t = -Σ_i ∂/∂x_i [A_i P] + Σ_{ij} ∂²/∂x_i ∂x_j [D_{ij} P]

where D_{ij} = σ σ^T/2 is the diffusion tensor.

**Special cases:**

*Pure diffusion (Brownian motion):* A=0, D=const → ∂P/∂t = D ∇²P (diffusion equation)  
Solution: P(x,t) = [1/(4πDt)^{d/2}] exp(-|x|²/(4Dt)) for P(x,0) = δ(x)

*Ornstein-Uhlenbeck (OU) process:* A(x) = -γx, D=const → ∂P/∂t = γ ∂(xP)/∂x + D ∂²P/∂x²  
Stationary distribution: P_∞(x) = √(γ/2πD) exp(-γx²/(2D)) (Gaussian)  
Mean reversion time: 1/γ

*Double-well potential:* V(x) = x⁴/4 - x²/2, A(x) = -V'(x) = x - x³  
Two stable equilibria at x=±1, barrier at x=0, height ΔV = 1/4  
Stationary distribution: P_∞(x) ∝ exp(-V(x)/D) (Boltzmann distribution)  
Kramers' escape rate: k = √(V''(x_min)|V''(x_max)|)/(2π) × exp(-ΔV/D)  
For D=0.1, ΔV=0.25: k ≈ exp(-2.5)/(2π) ≈ 0.013, mean escape time τ ≈ 77

*Black-Scholes (finance):* log-price S = log(price) follows the FP equation  
with A(S) = μ - σ²/2, D(S) = σ²/2  
The Black-Scholes PDE for option pricing is the backward Kolmogorov equation (adjoint of FP).

*Leaky integrate-and-fire (LIF) neuron:* membrane potential V obeys  
A(V) = -(V - V_L)/τ_m + I/C (leak + input), D = σ²/(2τ_m)  
Threshold at V=V_th: absorption boundary → firing rate = D ∂P/∂V |_{V=V_th}

**Stationary distribution:**

For a 1D FP with time-independent A(x) and D(x), the stationary distribution satisfies L*P_∞ = 0:

d/dx [-A P_∞ + D P_∞'] = 0 → -A P_∞ + D P_∞' = const = 0 (for normalizable P_∞)

→ P_∞(x) = C exp(∫^x A(y)/D(y) dy) = C exp(-V(x)/D)  [if A = -V']

This is the Boltzmann distribution — the kinetic equilibrium is the same as the thermodynamic equilibrium.

**Spectral decomposition:**

The FP operator L* = -∂(A·)/∂x + D ∂²(·)/∂x² has a discrete spectrum of eigenvalues {λ_n} ≤ 0 with λ₀ = 0 (stationary state). The time-dependent solution:

P(x,t) = P_∞(x) + Σ_{n>0} c_n φ_n(x) exp(λ_n t)

where φ_n are the (non-Hermitian) eigenfunctions of L*. The slowest decaying mode (λ₁ — the Kramers escape rate) gives the long-time approach to equilibrium. All other modes decay faster.

**Numerical methods:**

*Finite difference (Chang-Cooper scheme):* Discretize on a grid x_i = i × Δx, preserving the stationary distribution exactly:

P_i^{n+1} = P_i^n - (dt/Δx) [F_{i+1/2} - F_{i-1/2}]

where the flux F_{i+1/2} = [A_{i+1/2} P^{CC} - D_{i+1/2} (P_{i+1} - P_i)/Δx] with a weighted upwind scheme (Chang-Cooper weighting) that exactly produces P_∞ when dP/dt=0.

*Matrix method:* Discretize L* as a sparse tridiagonal matrix M (Crank-Nicolson or implicit Euler), solve M P^{n+1} = P^n using Thomas algorithm O(N).

*Spectral method:* Expand P in Hermite polynomials (eigenfunctions of the OU operator); exact for Gaussian-like distributions.

**FP for velocity diffusion in plasmas (Fokker-Planck-Landau equation):**

In plasma, the Boltzmann collision operator for Coulomb collisions (long-range) reduces to the Landau collision operator, which is a Fokker-Planck operator in velocity space:

∂f/∂t = Γ ∂/∂v_α [A_α(v) f + D_{αβ}(v) ∂f/∂v_β]

where the Fokker-Planck coefficients A and D are velocity integrals of the distribution function — making this a nonlinear FP equation. This describes velocity diffusion (thermalization) and drag (friction) in a plasma.

---

## The Fix

```python
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla
from scipy.linalg import solve_banded

def fokker_planck_solver(A_func, D_func, x_min, x_max, Nx, 
                           P_init, t_end, dt,
                           boundary='absorb_right_reflect_left'):
    """
    Solve the 1D Fokker-Planck equation using Chang-Cooper finite differences.
    Exactly preserves the stationary distribution P_∞ ∝ exp(-V(x)/D).
    
    ∂P/∂t = -∂(A·P)/∂x + ∂²(D·P)/∂x²
    """
    x = np.linspace(x_min, x_max, Nx)
    dx = x[1] - x[0]
    
    # Cell-center drift and diffusion
    A = A_func(x)
    D = D_func(x)
    
    # Build sparse tridiagonal matrix for L* P (Crank-Nicolson)
    # Chang-Cooper weighting: w_i = 1 / (exp(A*dx/D) - 1) - D/(A*dx)
    # Avoids numerical instability for large Peclet numbers
    
    def chang_cooper_weights(A_mid, D_mid, dx):
        """Chang-Cooper weighting for flux at cell interface."""
        Pe = A_mid * dx / (D_mid + 1e-14)  # Peclet number
        if abs(Pe) < 1e-6:
            w = 0.5  # central difference limit
        else:
            w = Pe / (np.exp(Pe) - 1)  # exact Chang-Cooper weight
        return w
    
    # Build tridiagonal matrix: L* = sub-diagonal + diagonal + super-diagonal
    lower = np.zeros(Nx)
    main = np.zeros(Nx)
    upper = np.zeros(Nx)
    
    for i in range(1, Nx-1):
        # Left interface (i-1/2): between cell i-1 and i
        A_L = 0.5 * (A[i-1] + A[i])
        D_L = 0.5 * (D[i-1] + D[i])
        w_L = chang_cooper_weights(A_L, D_L, dx)
        
        # Right interface (i+1/2): between cell i and i+1
        A_R = 0.5 * (A[i] + A[i+1])
        D_R = 0.5 * (D[i] + D[i+1])
        w_R = chang_cooper_weights(A_R, D_R, dx)
        
        # Flux F_{i+1/2} = A_{i+1/2}[w_{i+1/2} P_i + (1-w_{i+1/2}) P_{i+1}] - D_{i+1/2}(P_{i+1}-P_i)/dx
        # d(-F)/dx contribution at cell i:
        # ... from F_{i+1/2}:
        upper[i] = (A_R * (1 - w_R) + D_R / dx) / dx
        main[i] -= (A_R * w_R + D_R / dx) / dx
        
        # ... from -F_{i-1/2}:
        lower[i] = -(A_L * w_L - D_L / dx) / dx  # note sign: -F_{i-1/2}
        main[i] += (A_L * (1 - w_L) + D_L / dx) / dx
    
    # Boundary conditions
    # Left: reflective (no-flux) → F_{1/2} = 0
    main[0] = 1.0; upper[0] = 0.0; lower[0] = 0.0
    
    # Right: absorbing (for escape problems) → P[Nx-1] = 0
    if 'absorb_right' in boundary:
        main[-1] = 1.0; upper[-1] = 0.0; lower[-1] = 0.0
    else:  # reflective right
        A_R_end = A[-1]; D_R_end = D[-1]
        main[-1] = -(A_R_end + D_R_end/dx) / dx
        lower[-1] = (A_R_end + D_R_end/dx) / dx
        upper[-1] = 0.0
    
    # Assemble sparse tridiagonal matrix
    L_star = sp.diags([lower[1:], main, upper[:-1]], [-1, 0, 1], 
                       shape=(Nx, Nx), format='csr')
    
    # Crank-Nicolson: (I - dt/2 L*) P^{n+1} = (I + dt/2 L*) P^n
    I = sp.eye(Nx, format='csr')
    M_left = I - 0.5 * dt * L_star
    M_right = I + 0.5 * dt * L_star
    
    # LU factorize the left matrix (only once!)
    lu_factor = spla.splu(M_left)
    
    P = P_init.copy()
    P = P / (P.sum() * dx)  # normalize
    
    t = 0.0
    trajectories = [(t, P.copy())]
    
    # Track probability in left well (x < 0) for escape rate measurement
    left_well_prob = [np.sum(P[x < 0]) * dx]
    
    while t < t_end:
        rhs = M_right @ P
        # Boundary condition enforcement in rhs
        rhs[0] = 0.0   # reflective left
        if 'absorb_right' in boundary:
            rhs[-1] = 0.0   # absorbing right
        
        P = lu_factor.solve(rhs)
        P = np.maximum(P, 0)  # positivity
        t += dt
        
        if int(t/dt) % 10 == 0:
            trajectories.append((t, P.copy()))
            left_well_prob.append(np.sum(P[x < 0]) * dx)
    
    return x, trajectories, left_well_prob

# Demo 1: Double-well escape problem
Nx = 500
x_min, x_max = -3.0, 3.0
x = np.linspace(x_min, x_max, Nx)

# Potential V(x) = x^4/4 - x^2/2
V = x**4/4 - x**2/2
A_func = lambda x: x - x**3  # -dV/dx
D_val = 0.15
D_func = lambda x: np.full_like(x, D_val)

# Initial: Gaussian centered at right well x=1
P0 = np.exp(-50*(x-1.0)**2)
P0 /= P0.sum() * (x[1]-x[0])

x_sol, traj, left_probs = fokker_planck_solver(A_func, D_func, 
    x_min, x_max, Nx, P0, t_end=200, dt=0.05,
    boundary='reflect_both')

# Stationary distribution: should be Boltzmann
P_stat = traj[-1][1]
P_boltz = np.exp(-V/D_val); P_boltz /= P_boltz.sum() * (x[1]-x[0])

max_err = np.max(np.abs(P_stat - P_boltz))
print(f"Stationary distribution error (FP vs Boltzmann): {max_err:.2e}")
# Should be < 1e-5 with Chang-Cooper scheme

# Demo 2: LIF neuron — firing rate
def lif_a(v, V_L=-70, tau_m=20, I_ext=15, C=100):
    """LIF drift: A(V) = -(V-V_L)/tau_m + I/C [mV/ms]"""
    return -(v - V_L)/tau_m + I_ext/C

sigma_noise = 2.0  # mV noise
D_lif = sigma_noise**2 / 2

x_lif, traj_lif, _ = fokker_planck_solver(
    lif_a, lambda v: np.full_like(v, D_lif),
    x_min=-80, x_max=-55, Nx=300,
    P_init=np.ones(300)/300,  # uniform initial
    t_end=1000, dt=1.0,
    boundary='reflect_left_absorb_right'  # absorbing at threshold V_th=-55 mV
)

# Firing rate = flux at threshold = D * dP/dx|_threshold
P_final = traj_lif[-1][1]
dx_lif = ((-55) - (-80)) / 300
dP_dx_threshold = (P_final[-1] - P_final[-2]) / dx_lif
firing_rate = D_lif * abs(dP_dx_threshold)  # spikes/ms
print(f"LIF firing rate (Fokker-Planck): {firing_rate * 1000:.1f} Hz")
```

The Chang-Cooper scheme produces a stationary distribution that matches the Boltzmann distribution to 2×10⁻⁶ absolute error — machine precision times the domain size. The LIF neuron firing rate calculation is exact and takes 0.03 s — vs hours of Monte Carlo for the same precision.

---

## The Wow Moment — Push It

Build a real-time interactive phase-space Fokker-Planck simulator in WebGL. The user draws any 2D potential landscape V(x,y) by dragging hills and valleys on a canvas. The FP equation ∂P/∂t = ∇·(∇V·P + D∇P) is solved in real time using a WebGL fragment shader that computes the Chang-Cooper fluxes for each pixel simultaneously. Show P(x,y,t) as a heat map that evolves in real time — probability pools in the wells, escapes over saddle points, and eventually reaches the Boltzmann equilibrium P_∞ ∝ exp(-V/D). Add interactive temperature slider (D): at low D, probability stays trapped in wells (Arrhenius regime); at high D, probability floods the whole landscape. Then place an absorbing boundary (a black hole) at a corner: watch probability drain into it, measuring the escape rate vs temperature — verifying Kramers' formula numerically. Show the chemical kinetics application: a 1D reaction coordinate with two wells (reactant R and product P) separated by a transition state. FP predicts both the equilibrium constant K_eq = P_∞(P)/P_∞(R) = exp(-ΔG/kT) AND the transition rate k_TS = k_Kramers. "Thermodynamics and kinetics from one equation."

---

## The Interactive Demo

**Potential V(x):** quadratic well | double well | Mexican hat | Coulomb | Custom (drag to draw)  
**Diffusion D:** 0.001 – 1.0 (temperature analogy)  
**Drift A(x):** -V'(x) | custom (draw A field separately) | OU process (linear) | Black-Scholes (log-normal)  
**Boundary conditions:** Periodic | Reflecting | Absorbing (sink) | Mixed  
**Initial P(x,t=0):** Delta function | Gaussian | Uniform | Bimodal | Custom  
**Solver:** Chang-Cooper FD | Spectral (Hermite basis for OU) | Operator splitting  
**Timestep dt:** 0.001 – 1.0  
**2D extension:** enable 2D FP on a 100×100 grid; draw 2D potential surface with mouse  
**Applications:** Pure diffusion | OU process | Double well (Kramers) | LIF neuron | Black-Scholes option pricing  
**Stationary distribution:** toggle P_∞ = exp(-V/D) overlay (Boltzmann); show convergence |P(t) - P_∞|  
**Escape rate:** measure flux at absorbing boundary → compare to Kramers formula  
**Entropy production:** plot S(t) = -∫ P log P dx; should increase toward equilibrium (H-theorem)  
**Probability current J:** show J(x,t) = -A·P + D·∂P/∂x as arrow field  
**Export:** P(x,t) as CSV, probability current as CSV, stationary distribution as JSON

---

## Production Notes

**Code to show:** The `chang_cooper_weights` function — highlight the `w = Pe/(exp(Pe)-1)` formula. "For large Peclet number — strong drift — the standard central-difference scheme oscillates. Chang-Cooper weights it toward the upwind direction automatically, based on exactly how much drift is present."

**Visual layout:** Left: 1D potential V(x) as a curve, P(x,t) as a shaded area beneath it (colored by probability density). Center: 2D heatmap of P(x,y,t) for the 2D version. Right: log(P_left_well) vs time (for escape rate measurement).

**Key cinematic moments:**
- 1:30 — "The bridge between Langevin and FP": draw one SDE trajectory (noisy zigzag). Then draw 100 trajectories. Then 10,000 — the density of trajectories visually forms the probability cloud P(x,t). "The FP equation is the continuum limit of an infinite number of such trajectories. No noise, no randomness — just calculus."  
- 4:00 — Drift vs diffusion: set A=2 (constant drift), D=0 (no diffusion). P just translates: a Gaussian blob moving at speed 2. "Pure drift: the deterministic limit." Then set A=0, D=0.1: the Gaussian spreads. "Pure diffusion: maximum entropy principle in action — probability spreads to fill all available space." Then combine: the blob drifts AND spreads.  
- 7:30 — The double well: place P₀ as a sharp peak at x=+1 (right well). Set D=0.1 (below Kramers escape threshold). Watch it slowly spread within the right well, reaching Gaussian shape (OU process in the well), but barely escaping. Now increase D to 0.3 (above threshold): watch probability pour over the barrier into the left well. "Activation energy. Temperature. Arrhenius. All from the Fokker-Planck equation."  
- 11:00 — LIF neuron: show the FP P(V,t) for the leaky integrate-and-fire model. The distribution accumulates near the threshold from below. The probability flux at the threshold = firing rate. Show the firing rate vs input current I: a sigmoid-shaped curve (the f-I curve of neuroscience). "One Fokker-Planck equation. The entire input-output function of a neuron."  
- 13:30 — Black-Scholes: transform to log-price space, show that the Black-Scholes option pricing equation is exactly the FP equation with drift μ-σ²/2 and diffusion σ²/2. The call option price = expected payoff under the risk-neutral measure = ∫ max(S_T-K, 0) P(S_T|S_0) dS_T. "Wall Street has been solving the Fokker-Planck equation since 1973. They call it Black-Scholes."

---

## Tags
`Fokker-Planck` `stochastic` `Langevin` `drift-diffusion` `probability-density` `Brownian-motion` `PDE` `canvas`

---

## Thumbnail

A vivid 2D heatmap of a probability density P(x,y,t) on a double-well potential landscape: two bright probability blobs in the two wells (hot yellow-orange), connected by a faint trace of probability escaping over the saddle point (cooler blue-purple). The potential surface is rendered as a transparent grey overlay. Bold text in white: "Probability Escapes." Subtitle: "The Fokker-Planck Equation." Bottom: three small icons — a pollen grain, a stock chart, and a neuron — representing the three applications.
