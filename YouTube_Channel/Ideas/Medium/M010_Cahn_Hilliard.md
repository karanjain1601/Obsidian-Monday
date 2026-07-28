---
title: "Oil and Water Unmix in Code (Cahn-Hilliard Phase Separation)"
id: M010
difficulty: 5.5/10
prereq: "None"
concept: "Cahn-Hilliard equation: ∂φ/∂t = M∇²(∂F/∂φ - κ∇²φ) where F is the free energy density (double-well); conserved order parameter φ separates into two phases via spinodal decomposition."
tags: [cahn-hilliard, phase-separation, spinodal-decomposition, free-energy, order-parameter, fluid-simulation, PDE, pattern-formation]
category: medium
type: video-idea
---

# Oil and Water Unmix in Code (Cahn-Hilliard Phase Separation)

**Alt title:** "Why Shake Oil and Water All You Want — They'll Always Unmix"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A salad dressing bottle: someone shakes it vigorously. The oil and vinegar blend into a cloudy emulsion. Set it down. Within 30 seconds, the emulsion separates — not randomly, but in a characteristic way. First: tiny droplets appear everywhere simultaneously. Then the droplets grow, slowly. Then they start to merge. Five minutes later: two perfectly separated layers.

"This is not just about salad dressing. The same mathematics controls: how alloy metals separate when they cool, how polymer blends demix, how biological cells organize their membranes, how metallic glasses solidify, and how the early universe itself separated into matter and antimatter domains. Today we code it. The first attempt will give you phase separation that goes in the completely wrong direction."

Cut to the code editor. "Three equations. One mathematical structure. All of thermodynamics."

---

## The Naive Attempt

The most naive approach: model oil and water as a scalar field φ (φ = +1 means oil, φ = -1 means water). Apply a diffusion equation — assume oil and water mix over time, just like any diffusion problem.

```javascript
const N = 256;
const D = 0.01; // diffusion coefficient

// Initialize: random mixed state near φ = 0 (half oil, half water)
const phi = new Float32Array(N * N);
for (let idx = 0; idx < N * N; idx++) {
  phi[idx] = (Math.random() - 0.5) * 0.1; // small fluctuations around 0
}

function step(dt) {
  const phiNew = new Float32Array(N * N);
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      // Standard diffusion: ∂φ/∂t = D ∇²φ
      const lap = (phi[(i+1)+j*N] + phi[(i-1)+j*N] +
                   phi[i+(j+1)*N] + phi[i+(j-1)*N] - 4*phi[idx]) / (dx*dx);
      phiNew[idx] = phi[idx] + D * dt * lap;
    }
  }
  phi.set(phiNew);
}
```

Run it. The random fluctuations smooth out. φ converges toward 0 everywhere — uniform mixing. The oil and water become MORE mixed over time, not less. The code is modeling the wrong direction of thermodynamics.

---

## The Moment of Failure

On screen: a black-and-white noisy image (random φ values at t=0). Every frame, the image gets smoother and more uniform. By frame 100, it's a flat medium-grey. The simulation shows MIXING, not UNMIXING.

This is a profound failure. The simulation is thermodynamically inverted: ordinary diffusion models the spontaneous mixing of miscible substances. But oil and water are IMMISCIBLE — they do NOT want to mix. The naive code has the wrong driving force. It should be driving separation, not mixing.

The root cause: ordinary diffusion is driven by the gradient of concentration (Fick's law: J = -D ∇φ). This drives particles from high to low concentration — mixing. Phase separation is driven by the gradient of CHEMICAL POTENTIAL — specifically by a free energy that has TWO minima (at φ = +1 and φ = -1), so the system spontaneously evolves toward one of them, not toward the middle. Standard diffusion has a single free energy minimum at uniform φ. Wrong free energy → wrong direction of motion.

---

## Why It Broke — The Physics

The Cahn-Hilliard equation is a conservation law for a chemical potential gradient:

$$\frac{\partial \phi}{\partial t} = M \nabla^2 \mu, \quad \mu = \frac{\partial f}{\partial \phi} - \kappa \nabla^2 \phi$$

where:
- φ is the **order parameter** (here, local composition; φ = +1 is pure phase A, φ = -1 is pure phase B)
- f(φ) is the **bulk free energy density** — for phase separation, this is a double-well potential: f(φ) = (1/4)(1-φ²)²
- κ is the **gradient energy coefficient** (penalizes sharp interfaces — surface tension emerges from this term)
- M is the **mobility** (how easily the system reorganizes)
- μ = ∂f/∂φ - κ∇²φ is the **chemical potential**

The double-well free energy f(φ) = (1/4)(1-φ²)² has minima at φ = ±1 and a local maximum at φ = 0. Its derivative is f'(φ) = φ³ - φ. Near φ = 0: f'(φ) ≈ -φ — the chemical potential points in the OPPOSITE direction to φ, meaning the system is driven from mixed states (φ ≈ 0) toward the wells (φ = ±1). This is thermodynamic instability — the mixed state is unstable.

The ∇²φ term in the chemical potential creates the **interface energy**: where φ changes rapidly (interface between oil and water), the ∇²φ contribution to μ is large and acts to smooth the interface — exactly like surface tension. The energy cost of an interface is proportional to √κ — by tuning κ you control the interfacial width and surface tension.

The spinodal decomposition dynamics in the linear regime: a perturbation of wavenumber k grows at rate σ(k) = -Mk²(f''(φ₀) + κk²). For f''(φ₀) < 0 (inside the spinodal region), modes with k < k_c = √(-f''/κ) grow. Short-wavelength modes are suppressed by the gradient energy (the κk² term). The fastest-growing mode is at k* = √(-f''/(2κ)), giving a characteristic length scale λ* = 2π/k*.

After the linear regime: coarsening. The characteristic scale grows in time as L(t) ~ t^(1/3) for diffusive coarsening (Lifshitz-Slyozov law) or t^(1/2) for coarsening with fluid flow (hydrodynamic coarsening). This slow coarsening is why emulsions don't instantaneously separate — the logarithmic timescale means they can last minutes to days before separating.

---

## The One Concept

The **Cahn-Hilliard equation** (developed by John Cahn and John Hilliard at the National Bureau of Standards in 1958) is the fundamental equation governing conserved phase separation. It describes how a homogeneous mixture spontaneously unmixes when cooled below the spinodal decomposition temperature — without nucleation, without a seed, from the bulk.

The equation is a **fourth-order PDE** — it involves ∇²(∇²φ), making it numerically much harder than a second-order equation like the heat equation. This high-order derivative arises because the chemical potential μ includes the Laplacian of φ (for gradient energy), and then the flux is the gradient of μ. The time evolution is therefore M∇²(f'(φ) - κ∇²φ). The biharmonic operator ∇⁴φ = ∇²(∇²φ) appears naturally.

The key distinction from the Allen-Cahn equation (which governs non-conserved order parameters like liquid-crystal alignment): Cahn-Hilliard conserves the total integral of φ (total amount of each phase is fixed), while Allen-Cahn does not. This conservation law is the physical content of the mass conservation of the two species. In Cahn-Hilliard, oil can redistribute but total oil volume is fixed. This conservation makes it a gradient flow of the free energy with a constraint.

The **spinodal decomposition** that Cahn-Hilliard describes is qualitatively different from classical nucleation-and-growth (which describes what happens when a supercooled liquid forms ice crystals). In spinodal decomposition: the entire bulk simultaneously becomes unstable. Every region of the sample begins to phase-separate simultaneously. The early pattern has a characteristic wavelength set by k*. Droplets do not nucleate from rare fluctuations — they all appear at the same time, everywhere. This simultaneous, large-scale rearrangement is why freshly shaken emulsions look cloudy throughout rather than having a few large drops forming from specific nucleation sites.

The coarsening dynamics after the initial separation are governed by the Lifshitz-Slyozov-Wagner (LSW) law. Small droplets have higher chemical potential than large ones (the Gibbs-Thomson effect: curvature raises the equilibrium chemical potential). Molecules diffuse from small to large droplets — an effect called **Ostwald ripening**. The average droplet radius grows as R(t) ~ t^(1/3). This law is quantitatively verified in metallic alloy coarsening, polymer blends, and soap froths.

Applications: metallurgy (alloy design — controlling phase separation to produce desired microstructures); food science (stabilizing emulsions in ice cream, margarine, mayo using surfactants that get adsorbed at the interface and slow Ostwald ripening); pharmaceutical emulsions (drug delivery droplets must be stable); polymer solar cells (the morphology of the donor-acceptor blend is controlled by Cahn-Hilliard spinodal decomposition — the length scale λ* determines exciton diffusion and cell efficiency); biological membranes (lipid rafts in cell membranes are thought to be Cahn-Hilliard phase-separated domains of lipid species).

---

## The Fix

Replace the standard diffusion operator with the full Cahn-Hilliard operator: ∂φ/∂t = M ∇²(φ³ - φ - κ∇²φ).

```javascript
// Cahn-Hilliard equation: ∂φ/∂t = M ∇²(f'(φ) - κ ∇²φ)
// f(φ) = (1/4)(1-φ²)² → f'(φ) = φ³ - φ

const M = 1.0;       // mobility
const kappa = 0.5;   // gradient energy coefficient (controls interface width)
const dt = 0.25;     // careful: stability requires dt < dx⁴/(8 * M * kappa)

// Initialize: small random fluctuations
for (let idx = 0; idx < N * N; idx++) {
  phi[idx] = (Math.random() - 0.5) * 0.05; // very small, near φ=0
}

function laplacian(field, i, j) {
  return (field[(i+1)+j*N] + field[(i-1)+j*N] +
          field[i+(j+1)*N] + field[i+(j-1)*N] - 4*field[i+j*N]) / (dx*dx);
}

function step(dt) {
  // Step 1: compute chemical potential μ = f'(φ) - κ∇²φ
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      const phi_val = phi[idx];
      const f_prime = phi_val * phi_val * phi_val - phi_val; // cubic → drives away from 0
      const lap_phi = laplacian(phi, i, j);
      mu[idx] = f_prime - kappa * lap_phi;
    }
  }
  // Step 2: ∂φ/∂t = M ∇²μ
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      const lap_mu = laplacian(mu, i, j);
      phiNew[idx] = phi[idx] + M * dt * lap_mu;
      // Clamp to physical range
      phiNew[idx] = Math.max(-1, Math.min(1, phiNew[idx]));
    }
  }
  [phi, phiNew] = [phiNew, phi];
}
```

Now: within ~50 steps, the uniform grey image develops a fine-grained salt-and-pepper pattern at the characteristic wavelength λ*. Over ~500 steps, the domains coarsen — small blobs merge into larger ones. By step 5000, only a few large regions remain. Color φ = +1 as red (oil), φ = -1 as blue (water), interface = white.

The coarsening obeys the power law L ~ t^(1/3): plot average domain size vs time on a log-log graph — a straight line with slope 1/3 appears.

---

## The Wow Moment — Push It

**Asymmetric quench — volume fraction sweep:** Instead of initializing at φ = 0 (50/50 mixture), initialize at φ = 0.3 (30/70 mixture). Now oil forms isolated spherical droplets in a water matrix (nucleation-and-growth regime within CH) rather than the bicontinuous sponge structure of spinodal decomposition. Show the striking difference: sponge vs. droplets.

**Coarsening law verification:** Plot average domain size L(t) computed as L = 2π/k_peak (where k_peak is the peak of the structure factor, computed via FFT). On a log-log plot, L ~ t^(1/3) should be a perfect straight line from ~t=100 to ~t=10,000. Overlay the theoretical prediction.

**Coupled fluid Cahn-Hilliard (Model H):** Add a velocity field coupled to the composition field — the composition gradient creates a body force (osmotic pressure) that drives flow, and the flow advects composition. This is the Cahn-Hilliard-Navier-Stokes system. The coarsening accelerates to L ~ t^(1/2) (hydrodynamic coarsening). Show the speedup.

**3D rendering:** Use a marching-cubes algorithm to extract the φ = 0 isosurface (the oil-water interface). Render it in 3D with ray-marching — the evolving sponge structure is stunning, like a 3D sea sponge growing and coarsening in real time.

---

## The Interactive Demo

- **Interface width κ** slider: 0.1 to 2.0 (thin interfaces → fine structure; thick → blurry domains)
- **Mobility M** slider: 0.1 to 5.0 (slow to fast coarsening)
- **Initial composition φ₀** slider: -0.9 to +0.9 (symmetric 50/50 vs. one-phase-dominant)
- **Free energy well depth** slider: modifies the coefficient in f(φ) = A(1-φ²)² — deeper wells = more separated phases
- **Quench depth** slider: analogous to temperature — shallow quench (near spinodal) → long wavelength; deep quench → short wavelength
- **Color mode**: Composition | Chemical potential | Interface (|∇φ|) | Free energy density
- **Structure factor** panel: real-time 2D FFT of φ — shows the ring of the dominant wavenumber, then ring radius decreasing as coarsening proceeds
- **Coarsening plot**: live log-log plot of L(t) — watch the 1/3 slope appear
- **Pause/Reset** and speed controls (10×/100× for fast coarsening demonstration)

---

## Production Notes

**Code to show:**
- The broken naive diffusion (going the wrong direction) — emphasize the disaster
- The double-well free energy f(φ) = (1/4)(1-φ²)² — draw it on screen, show the two wells at ±1 and the hill at 0
- f'(φ) = φ³ - φ — the cubic that drives the system away from φ=0
- The two-step split: first compute μ, then apply M∇²μ — explain why two steps (fourth-order → two second-order operations)
- The stability criterion dt < dx⁴/(8Mκ) — show what happens when violated (instability)

**Visual layout:**
- Main canvas: 512×512, φ colored as oil (warm amber/orange) to water (cool blue)
- Interface (|∇φ|) overlay in white — shows where the interface is
- Side panel: 2D structure factor (FFT magnitude) showing the ring pattern and its evolution
- Bottom panel: log-log coarsening plot L(t) vs t — with a 1/3 slope reference line

**Key cinematic moments:**
- 00:30 — Salad dressing phase separation — real footage
- 02:00 — Naive code: φ → 0, wrong direction — "we just made an integrating fluid"
- 03:00 — Show f(φ) on screen — the double-well with two minima — "the system wants to be at ±1, not 0"
- 04:00 — First run with Cahn-Hilliard: bicontinuous sponge appears at t=50 — gasp moment
- 05:00 — Coarsening animation: 10,000 steps in 10 seconds (speed up)
- 06:00 — Structure factor ring collapsing inward as domains grow
- 07:00 — Log-log plot showing perfect 1/3 slope: "Lifshitz, Slyozov, and Wagner predicted this in 1961"
- 07:45 — Switch to asymmetric composition: droplets instead of sponge
- 08:30 — 3D isosurface: the evolving sponge in 3D — rover-footage aesthetics
- 09:00 — "Every polymer solar cell that's ever been made has a Cahn-Hilliard microstructure determining its efficiency"

---

## Tags
`cahn-hilliard` `phase-separation` `spinodal-decomposition` `free-energy` `order-parameter` `fluid-simulation` `PDE` `pattern-formation`

---

## Thumbnail

Split: LEFT — real transmission electron microscopy (TEM) image of a demixed polymer blend, showing bicontinuous sponge structure in black and white. RIGHT — the simulation at the same stage of coarsening, in vivid amber (oil) and blue (water) with white interfaces. The two images have identical morphology — matching connected sponge domains. Bold text: "OIL AND WATER IN CODE". Sub-text: "They always unmix. Here's why." Bottom strip equation: ∂φ/∂t = M∇²(φ³ - φ - κ∇²φ) in yellow.
