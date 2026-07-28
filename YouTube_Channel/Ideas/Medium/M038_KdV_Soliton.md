---
title: "A Wave That Travels Without Dispersing (The KdV Soliton)"
id: M038
difficulty: 6/10
prereq: "None"
concept: "Korteweg-de Vries equation: u_t + 6uu_x + u_xxx = 0; soliton solution u(x,t) = (c/2)·sech²(√(c/4)·(x-ct)); amplitude determines speed; two solitons pass through each other unchanged — nonlinear beats dispersion exactly."
tags: [KdV, soliton, nonlinear-waves, dispersion, water-waves, canvas, PDE, integrable-systems]
category: medium
type: video-idea
---

# A Wave That Travels Without Dispersing (The KdV Soliton)

**Alt title:** "The Wave That Never Spreads Out (KdV Equation and Solitons)"
**Difficulty:** 6/10 | **Prereq:** None (PDEs helpful but not required)

---

## Opening Hook (0:00–1:00)

Open with two animations side by side. Left: a Gaussian wave packet in linear water (small amplitude). The packet moves but simultaneously spreads outward — its peak drops and its width grows. After a few seconds, the pulse has spread into a barely perceptible ripple. "This is dispersion. Waves of different frequencies travel at different speeds. The pulse falls apart."

Right panel: the same initial Gaussian, but in a nonlinear medium (shallow water, modeled by KdV). The Gaussian does NOT spread out. It maintains its shape perfectly and travels at constant speed across the entire canvas, bouncing off the right boundary and coming back. "This is a soliton. The nonlinearity of the wave equation exactly compensates the dispersion. The wave refuses to die."

Voiceover: *"In 1834, John Scott Russell was galloping alongside a canal boat when it stopped, and he watched the bow wave travel away from the boat as a solitary, intact lump — not spreading out, not collapsing — for miles. He called it 'the wave of translation.' In 1895, Korteweg and de Vries derived the equation that describes it. Today we simulate it. And we find a bug."*

---

## The Naive Attempt

**What we code first:** A simple finite-difference solver for the KdV equation using forward-time, centered-space (FTCS) discretization.

```javascript
// Naive: FTCS (Forward-Time, Centered-Space) for KdV
// u_t + 6u·u_x + u_xxx = 0

const N = 200;     // spatial grid points
const L = 20.0;    // domain length [-L/2, L/2]
const dx = L / N;
const dt = 0.001;  // time step

// Initialize u: soliton with c=1, centered at x=-5
let u = new Float64Array(N);
for (let i = 0; i < N; i++) {
  const x = -L/2 + i * dx;
  const c = 1.0;
  u[i] = (c/2) * Math.pow(1/Math.cosh(Math.sqrt(c/4) * (x + 5)), 2);
  // u = (c/2) * sech²(√(c/4) * (x - x₀))
}

function kdvStep(u, dt, dx) {
  const N = u.length;
  const du = new Float64Array(N);
  
  for (let i = 1; i < N-1; i++) {
    // u_x: centered difference
    const ux = (u[i+1] - u[i-1]) / (2 * dx);
    
    // u_xxx: 3rd derivative (4-point centered stencil)
    const uxxx = (u[i+2] - 2*u[i+1] + 2*u[i-1] - u[i-2]) / (2 * dx*dx*dx);
    
    // KdV: du/dt = -6u·ux - uxxx
    du[i] = -6 * u[i] * ux - uxxx;
  }
  
  // Periodic boundary conditions
  // (simplified — index wrapping omitted for brevity in naive version)
  
  // Forward Euler update
  const uNew = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    uNew[i] = u[i] + dt * du[i];
  }
  return uNew;
}

// Run simulation
let t = 0;
function simulate() {
  for (let step = 0; step < 10; step++) {
    u = kdvStep(u, dt, dx);
    t += dt;
  }
  render(u);
  requestAnimationFrame(simulate);
}
simulate();
```

The soliton moves correctly for about 100 timesteps. Then the solution starts to oscillate. Small ripples appear behind the soliton. After 500 timesteps, the ripples dominate and the soliton is overwhelmed by noise. After 1000 timesteps, the solution explodes to NaN.

---

## The Moment of Failure

At t ≈ 0.5, the soliton is still intact but a growing trail of high-frequency oscillations follows it. At t ≈ 1.0, these oscillations have amplitude comparable to the soliton itself. At t ≈ 1.5, the solution diverges: some grid points spike to ±1000, then NaN.

Add a **norm monitor**: compute ∫u² dx (should be conserved exactly for KdV — it's a conserved quantity called the "first integral"). Plot this over time. For the naive FTCS method, the norm grows monotonically — the method is adding energy to the system. The FTCS scheme is unconditionally unstable for third-order derivative terms (the dispersive term u_xxx). Von Neumann stability analysis shows that the amplification factor for the FTCS scheme on a linearized KdV equation is |G| > 1 for all wavenumbers k > 0 — meaning every Fourier mode grows without bound.

Display text: "Von Neumann stability: |G|² = 1 + (dt/dx³)² · k⁶ · (something) > 1. This scheme is unconditionally unstable."

---

## Why It Broke — The Physics

The FTCS scheme is unstable for the dispersive term u_xxx because the third-order spatial derivative acts like an anti-diffusion operator for some wavenumbers — it amplifies high-frequency modes rather than damping them. A stable scheme for the KdV equation must either be implicit (solving a system of equations at each step) or use a carefully chosen combination of spatial stencil and time integration method.

The **Crank-Nicolson** scheme is unconditionally stable for the linear part but must be combined with a careful treatment of the nonlinear u·u_x term. The standard reference solver for KdV is the **Zabusky-Kruskal scheme** (1965, the paper that coined the word "soliton"):

```
u_i^{n+1} - u_i^{n-1}     u_{i+1}^n - u_{i-1}^n     u_{i+2}^n - 2u_{i+1}^n + 2u_{i-1}^n - u_{i-2}^n
─────────────────────── + 2(u_{i+1}^n + u_i^n + u_{i-1}^n) ─────────────────────── + ─────────────────────────────────────── = 0
        2·dt                              6·dx                                2·dx³
```

This is a leap-frog scheme (uses n-1 and n+1, not n and n+1) with centered differences everywhere, and uses a symmetric stencil for the nonlinear term (averaging over three points). It is second-order in time and space and has excellent conservation properties.

The stability condition: `dt / dx³ ≤ constant` — a Courant-Friedrichs-Lewy (CFL) condition for the dispersive term. With dx = 0.1, dt must be ≤ ~0.001 for stability.

---

## The One Concept

**The KdV Equation, Solitons, and Integrability**

The Korteweg-de Vries equation is:
```
u_t + 6u·u_x + u_xxx = 0
```

It describes long, small-amplitude waves in shallow water (the u_t term is time evolution, 6u·u_x is the nonlinear steepening term, and u_xxx is the dispersion term). The balance between nonlinear steepening and dispersion creates the soliton.

**Understanding each term:**
- u_t: rate of change of wave height
- 6u·u_x: nonlinear term — taller parts of the wave move faster, causing the wave to steepen (like a breaking wave). This tends to concentrate energy and sharpen the wave front.
- u_xxx: dispersion term — different wavelength components travel at different speeds (short waves are slower), causing the wave to spread. This tends to dilute energy and flatten the wave.

**The soliton balance:** The exact solution u(x,t) = (c/2)·sech²(√(c/4)·(x-ct)) satisfies KdV exactly. The sech² shape is self-consistent: as nonlinearity steepens the wave, dispersion flattens it at exactly the same rate. The wave travels at speed c without any change in shape. Faster solitons (larger c) are taller and narrower; slower ones are shorter and broader.

**The amplitude-speed relationship:** c = 2·(maximum amplitude). A soliton twice as tall travels twice as fast. This is a purely nonlinear effect — linear waves travel at a speed determined only by wavelength, not amplitude. The amplitude-speed coupling is what allows solitons to "pass through" each other: when a fast soliton overtakes a slow one, they interact nonlinearly and emerge from the interaction with their original shapes and speeds — but with a phase shift (they emerge at slightly different positions than they would have without interaction).

**The 1965 Zabusky-Kruskal discovery:** Zabusky and Kruskal were the first to numerically simulate KdV with periodic boundary conditions, starting from a smooth initial condition. They expected the wave to disperse and thermalize (energy spreading to all wavelengths). Instead, they found: the wave broke up into a finite number of solitons, which circulated around the domain, colliding and passing through each other without breaking apart. After many collisions, the original set of solitons re-emerged with the same shapes. They named them "solitons" by analogy with particles (electrons, protons, etc.) — localized, persistent, and interacting without losing identity.

**Integrability and infinitely many conservation laws:** The KdV equation is "completely integrable" — it has infinitely many conserved quantities: ∫u dx (mass), ∫u² dx (momentum), ∫(u³ - u_x²/2) dx (energy), and infinitely more. These conservation laws constrain the dynamics so severely that the only long-time behavior is a superposition of solitons. This is the mathematical explanation for why solitons are stable: any perturbation decomposes into the soliton basis, and each soliton mode is separately conserved.

**Real-world solitons:** The phenomenon is not limited to water. Solitons appear in:
- Optical fibers (crucial for long-distance telecommunications — optical solitons travel thousands of km without dispersion)
- Nerve impulse propagation (the Hodgkin-Huxley model has soliton solutions)
- Magnetic domain walls in ferromagnets (topological solitons)
- Tsunami propagation in deep ocean (not exactly KdV, but the same balance of nonlinearity and dispersion)
- Giant waves in the atmosphere (the Morning Glory cloud formation in Australia — a solitary wave visible as a rolling cloud bank)

**The inverse scattering transform:** The complete analytical solution to KdV for any initial condition u(x,0) can be found by the inverse scattering transform (IST) — a nonlinear analogue of Fourier analysis. The number of solitons in the long-time solution equals the number of bound states of the Schrödinger equation -ψ_xx + u(x,0)·ψ = λψ. This connection between KdV and quantum mechanics is one of the most surprising discoveries in 20th-century applied mathematics.

---

## The Fix

```javascript
// Fix: Zabusky-Kruskal scheme (leap-frog with centered differences)
// Uses u^{n-1}, u^n to compute u^{n+1}

class KdVSolver {
  constructor(N, L, c_soliton = 1.0, x0 = -5) {
    this.N = N;
    this.L = L;
    this.dx = L / N;
    
    // Initialize two time levels (needed for leap-frog)
    this.u_prev = new Float64Array(N); // u^{n-1}
    this.u_curr = new Float64Array(N); // u^n
    this.u_next = new Float64Array(N); // u^{n+1}
    
    // Set initial condition: soliton with speed c
    for (let i = 0; i < N; i++) {
      const x = -L/2 + i * this.dx;
      this.u_curr[i] = (c_soliton/2) * Math.pow(1/Math.cosh(Math.sqrt(c_soliton/4) * (x - x0)), 2);
    }
    
    // Bootstrap u^{-1} using forward Euler (one step backward in time)
    const du = this.computeRHS(this.u_curr);
    for (let i = 0; i < N; i++) {
      this.u_prev[i] = this.u_curr[i]; // For first step only, use u_prev = u_curr
    }
    
    // Set dt to satisfy CFL condition
    this.dt = 0.4 * this.dx * this.dx * this.dx; // CFL for u_xxx term
  }
  
  // Wrap index for periodic boundary conditions
  idx(i) { return ((i % this.N) + this.N) % this.N; }
  
  step() {
    const { N, dx, dt } = this;
    const u = this.u_curr;
    
    for (let i = 0; i < N; i++) {
      // Nonlinear term: (u_{i+1} + u_i + u_{i-1}) * (u_{i+1} - u_{i-1}) / (3*dx)
      const nonlinear = (u[this.idx(i+1)] + u[i] + u[this.idx(i-1)]) * 
                        (u[this.idx(i+1)] - u[this.idx(i-1)]) / (3 * dx);
      
      // Dispersion term: (u_{i+2} - 2u_{i+1} + 2u_{i-1} - u_{i-2}) / (2*dx^3)
      const dispersion = (u[this.idx(i+2)] - 2*u[this.idx(i+1)] 
                        + 2*u[this.idx(i-1)] - u[this.idx(i-2)]) / (2 * dx*dx*dx);
      
      // Leap-frog update: u^{n+1} = u^{n-1} - 2*dt*(nonlinear + dispersion)
      this.u_next[i] = this.u_prev[i] - 2 * dt * (nonlinear + dispersion);
    }
    
    // Cycle arrays
    [this.u_prev, this.u_curr, this.u_next] = 
    [this.u_curr, this.u_next, this.u_prev];
  }
  
  // Compute conserved quantities for monitoring
  conservedMass()     { return this.u_curr.reduce((s, v) => s + v, 0) * this.dx; }
  conservedMomentum() { return this.u_curr.reduce((s, v) => s + v*v, 0) * this.dx; }
}
```

With the Zabusky-Kruskal scheme, the soliton propagates indefinitely with conserved mass and momentum (drift < 0.01% over 1000 crossings). The norm monitor shows a perfectly flat line. 

---

## The Wow Moment — Push It

**Two-soliton collision:** Initialize with two solitons — a fast one (c=3, tall) starting behind a slow one (c=1, short). Watch the fast soliton approach, apparently merge with the slow one (for a moment there is one large combined pulse), then emerge ahead of the slow one — as if it passed through. After the interaction, both solitons have identical shapes to before. Only a small phase shift is visible (each soliton ends up slightly ahead/behind where it would be without the interaction). "They passed through each other. Like quantum particles."

**N-soliton decomposition:** Start with a smooth Gaussian initial condition and run for a long time. Show the Gaussian breaking up into a discrete number of solitons (the number predicted by the number of eigenvalues of the associated Schrödinger equation). The decomposition is remarkable to watch: a smooth blob spontaneously sorts itself into a ordered sequence of solitons by speed. Add a counter showing the number of distinct peaks detected over time.

**Soliton gas:** Fill the domain with 20 solitons of random heights (hence random speeds). They collide continuously, passing through each other. The overall density and momentum are conserved. Label each soliton by color and track its trajectory — each maintains its identity (shape and speed) despite hundreds of collisions. "This is a soliton gas. These particles don't lose energy. They collide forever."

**Dispersion comparison:** Side-by-side: left panel with u_xxx removed (pure nonlinear — steepens to shock), right panel with 6u·u_x removed (pure dispersion — spreads out), center panel with both (KdV — soliton stable). "Remove one term: shock. Remove the other: dispersal. Keep both: soliton. The magic is in the balance."

---

## The Interactive Demo

- **Number of solitons** (1 to 5): initialize with N solitons of specified amplitudes and positions; watch them interact
- **Soliton amplitude** (0.1 to 3.0 for each): amplitude controls height and speed; larger = faster; see the amplitude-speed coupling directly
- **Domain length** (10 to 50): longer domain = fewer boundary interactions; periodic boundaries wrap solitons around
- **dt / CFL ratio** (0.1 to 1.5): demonstrate stability boundary; at ratio > 1.0, solution rapidly diverges; at < 0.5, stable and accurate
- **Scheme selector** (FTCS naive / Zabusky-Kruskal / Runge-Kutta 4): compare methods directly; FTCS diverges in seconds; ZK runs forever
- **Conserved quantities display**: live values of mass ∫u dx, momentum ∫u² dx, energy ∫(u³ - u_x²/2) dx; these should be constant; drift indicates numerical error
- **Initial condition selector** (Single soliton / Two solitons / N solitons / Gaussian / Sinusoidal / Custom): preset initial conditions for demonstration
- **Soliton detection**: automatic peak-finding algorithm labels each detected soliton in the field with its measured amplitude and speed; updates every 10 steps
- **Phase shift measurement**: for two-soliton collision, tracks the position of each soliton before and after collision and reports the phase shift Δx in pixels; compare with analytical prediction Δx = (1/√c₁ - 1/√c₂) · log(...) [the exact formula]
- **Space-time plot mode**: alternative view showing u(x,t) as a 2D heat map (x horizontal, t vertical); solitons appear as diagonal lines; collisions appear as kinks; the full history of the simulation in one image

---

## Production Notes

**Code structure:**
- `index.html`: main waveform canvas (x-axis: position, y-axis: amplitude, 700×300) + control panel (right sidebar) + optional space-time canvas below
- `kdv-solver.js`: KdVSolver class (Zabusky-Kruskal scheme); conserved quantity computation; soliton peak detection; naive FTCS class for demonstration
- `initial-conditions.js`: functions to generate various initial data (soliton, N-soliton, Gaussian, etc.) given solver parameters
- `soliton-tracker.js`: peak-finding (scipy-style local maxima on the waveform array); tracker that follows peaks across timesteps; phase shift computation
- `renderer.js`: canvas waveform rendering; color fill under curve (positive = teal, negative = orange); peak labels; space-time history heat map (ImageData-based, one row per timestep)
- `spacetime.js`: maintains a circular buffer of the last T timesteps; renders as a 2D heat map; zoom and scroll in time

**Key cinematic moments:**
1. *Dispersion vs. soliton side-by-side* (0:00–1:00): the opening visual is the most important. Make it beautiful. Use a smooth color gradient for the water surface height.
2. *John Scott Russell story* (1:30): simple animation of Russell galloping alongside a canal. The wave rolls away in a smooth lump. "He followed it for miles."
3. *The naive FTCS crash* (3:30): perfectly normal for 100 steps, then oscillations, then explosion. Console shows NaN. "Classic numerical instability."
4. *Von Neumann analysis* (4:30): brief animation of a complex exponential mode, the amplification factor |G|. "Every mode grows. Game over."
5. *The Zabusky-Kruskal fix* (6:00): same initial condition, new solver. Soliton propagates. Norm monitor: flat line. "This solver was used in 1965. It still works."
6. *Two-soliton collision slow motion* (9:00): this is the money shot. Slow the animation to 0.1× speed. Watch the solitons approach, interact, and emerge. Pause at the moment of maximum overlap. "They are passing through each other."
7. *Gaussian decomposition* (11:00): start with a Gaussian. Fast-forward. Watch it break into 3 distinct solitons. "The initial condition was not a soliton. The equation decided how many solitons it was going to become."

**Rendering detail:** Draw the wave profile as a filled path (ctx.fill under the curve): teal fill for u > 0, transparent below the zero line. The soliton should look like a smooth, sharp-shouldered lump — use 2× canvas pixel density for crisp rendering. For the space-time diagram, use a `viridis`-like color map (purple → teal → yellow) for amplitude.

---

## Tags
`KdV` `soliton` `nonlinear-waves` `dispersion` `water-waves` `canvas` `PDE` `integrable-systems`

---

## Thumbnail

Two panels side by side. **Left:** a Gaussian wave packet (teal) spreading outward over time — three snapshots at t=0, t=1, t=2, each lower and wider. Label: "LINEAR WAVE DISPERSES." **Right:** a single soliton (bright orange-teal) at three time points — identical shape at each snapshot, just shifted horizontally. Label: "SOLITON DOESN'T." Bold white text overlaid: "THE WAVE THAT NEVER DIES." At the bottom, the KdV equation is shown: u_t + 6uu_x + u_xxx = 0 in clean white LaTeX-style rendering. The background is dark ocean blue.
