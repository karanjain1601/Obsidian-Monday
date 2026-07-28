---
title: "Heated Fluid Organizes Into Hexagonal Cells (Rayleigh-Bénard Convection)"
id: M007
difficulty: 5.5/10
prereq: "None"
concept: "Heated from below: Rayleigh number Ra = gαΔTL³/(νκ); convection onset at Ra > Ra_c ≈ 1708; hexagonal cells form at onset; convection pattern depends on Ra and Prandtl number Pr = ν/κ."
tags: [convection, rayleigh-benard, heat-transfer, pattern-formation, hexagons, prandtl-number, fluid-simulation, navier-stokes]
category: medium
type: video-idea
---

# Heated Fluid Organizes Into Hexagonal Cells (Rayleigh-Bénard Convection)

**Alt title:** "Heat a Fluid from Below Precisely Enough and It Draws Hexagons"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A lab dish of silicon oil, viewed from above. A heating plate warms the bottom uniformly. For the first 30 seconds: the oil is perfectly still, heat conducting passively. Then — simultaneously across the entire surface — a hexagonal lattice appears. Each hexagon is a convection cell: hot fluid rises at the center, cools at the top, sinks at the edges. The hexagons are perfectly regular, spanning the entire dish. Increase the temperature difference — the hexagons give way to rolls. Increase it more — the rolls oscillate. More still — turbulent convection, the cells merging and splitting chaotically.

"This is exactly what happens inside the Sun. Granules on the solar surface are convection cells exactly like these — 1,000 km wide, rising at 7 km/s. We're going to code this. Our first try will produce a fluid that just sits there conducting heat. No convection."

Rayleigh explained the onset mathematically in 1916. Henri Bénard had photographed the hexagons in 1900. The full turbulent regime is still an active research frontier.

---

## The Naive Attempt

Simulate a 2D box of fluid. Bottom boundary: T = T_hot. Top boundary: T = T_cold. Apply gravity. Track temperature via the heat equation, density via the ideal gas approximation (ρ decreases with T), and velocity via advection.

```javascript
const N = 256;
const T_hot = 100, T_cold = 0;  // °C
const alpha = 3e-3;   // thermal expansion coefficient (1/°C) for air
const g = 9.81;
const nu = 1.5e-5;    // kinematic viscosity (air)
const kappa = 2e-5;   // thermal diffusivity (air)

// Initialize temperature: linear profile (conductive state)
const T = new Float32Array(N * N);
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    T[i + j*N] = T_hot + (T_cold - T_hot) * j / (N - 1);
  }
}
const vx = new Float32Array(N * N);
const vy = new Float32Array(N * N);

function step(dt) {
  // Naive: heat equation (no convection)
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      const lap_T = (T[(i+1)+j*N] + T[(i-1)+j*N] +
                     T[i+(j+1)*N] + T[i+(j-1)*N] - 4*T[idx]) / (dx*dx);
      T[idx] += kappa * dt * lap_T;
    }
  }
  // Buoyancy: hot fluid should rise, but we never update velocity based on temperature!
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      const rho_local = 1 - alpha * (T[idx] - T_cold);
      // vy[idx] += -g * (rho_local - 1) * dt;  // FORGOT THIS LINE
    }
  }
  // Boundary conditions
  for (let i = 0; i < N; i++) {
    T[i + 0*N] = T_hot;
    T[i + (N-1)*N] = T_cold;
  }
}
```

The buoyancy term is commented out — the "bug" the developer introduces deliberately. Result: the fluid sits in the conductive steady state forever. Temperature shows a linear gradient from bottom to top. Velocity is zero everywhere. Nothing happens. It's actually a perfectly correct solution to the Boussinesq equations below Ra_c — the conductive state IS stable at low ΔT.

---

## The Moment of Failure

On screen: a grayscale temperature field, perfectly smooth gradient from white (bottom, hot) to black (top, cold). The velocity field: zero arrows everywhere. Even after 10,000 time steps. The temperature profile T(y) is a perfectly straight line.

The subtlety: this is NOT the same failure as M001. Here, the conductive state is a perfectly valid, physically correct solution. The failure is that the code never generates the perturbations and the buoyancy coupling that would allow the system to notice it's above the convective onset threshold. There are two bugs: (1) the buoyancy force coupling temperature to velocity is missing (commented out), and (2) there is no perturbation seed to break the translational symmetry.

This is philosophically the key lesson: stable equilibria require no perturbation seed. Unstable equilibria ABOVE the bifurcation point require both the coupling AND a seed. The simulation sits in the unstable equilibrium (conductive state with ΔT > ΔT_c) without ever discovering the instability.

---

## Why It Broke — The Physics

**The Boussinesq Approximation** is the key: density variations in the fluid are only important in the buoyancy force, and everywhere else the fluid is treated as incompressible. This gives two coupled equations:

$$\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} = -\frac{\nabla p}{\rho_0} + \nu \nabla^2 \mathbf{u} + \alpha (T - T_0) g \hat{z}$$

$$\frac{\partial T}{\partial t} + (\mathbf{u} \cdot \nabla)T = \kappa \nabla^2 T$$

The coupling is the buoyancy term α(T - T_0)g in the momentum equation. Without this term, the equations decouple: temperature evolves independently of velocity. The conductive state (T linear, u = 0) is always a solution, but it's only stable when the Rayleigh number Ra < Ra_c ≈ 1708.

The **Rayleigh number** Ra = gαΔTL³/(νκ) is the fundamental control parameter:
- gαΔT: buoyancy force per unit mass per temperature difference
- L³: cube of the layer height (the length scale cubed enters because both diffusion and viscosity slow convection, and each contributes L² to the denominator)
- ν: kinematic viscosity (viscous dissipation suppresses convection)
- κ: thermal diffusivity (thermal diffusion erases temperature gradients, suppressing driving)

When Ra > Ra_c = 1708 (a precise value derivable from linear stability analysis of the Boussinesq equations), the conductive state is unstable. An infinitesimal temperature perturbation grows: a warm parcel of fluid is more buoyant, rises, carries its heat upward, and creates a convection cell. The critical value 1708 corresponds to a critical horizontal wavelength of λ_c = 2√2 × L — cells are roughly as wide as they are tall.

The Prandtl number Pr = ν/κ determines whether convection rolls form first (low Pr, e.g., liquid metals Pr < 0.1) or hexagons form first (high Pr, e.g., silicone oil Pr > 1). For most common fluids (water Pr ≈ 7, air Pr ≈ 0.7), rolls are the first pattern.

---

## The One Concept

**Rayleigh-Bénard convection** is the buoyancy-driven convective motion of a fluid heated from below and cooled from above. Henri Bénard discovered the hexagonal cell patterns experimentally in 1900 using spermaceti (whale oil) — he saw that the cells had hot centers and cold hexagonal boundaries, with fluid rising in the center and sinking at the edges. Lord Rayleigh provided the linear stability theory in 1916. The agreement between theory (Ra_c = 1708) and experiment (Ra_c ≈ 1700 ± 50) was a landmark validation of continuum fluid mechanics.

The convection cells — **Bénard cells** — appear as hexagons near onset for fluids where the viscosity depends on temperature (the non-Boussinesq effect). For perfectly Boussinesq fluids (constant material properties), the first pattern at onset is actually parallel rolls, not hexagons. The hexagons seen by Bénard came from the fact that his whale oil had a strong temperature dependence of viscosity — a physical subtlety that wasn't resolved until the 1960s.

As Ra increases beyond onset, the system undergoes a rich sequence of bifurcations: steady rolls → oscillating rolls (wavy instability) → bimodal convection → quasi-periodic → chaotic (soft turbulence). At very high Ra (10⁷ to 10¹²), the system enters the **hard turbulence** regime where the heat flux scales as Nu ~ Ra^(1/3) (Nu is the Nusselt number, the ratio of actual heat flux to conductive heat flux). At Ra > 10¹², the scaling may steepen toward Ra^(3/7) or Ra^(1/2) — this is one of the most active debates in fluid dynamics.

The convection pattern and the Nusselt number depend on both Ra and Pr. The **Prandtl number** Pr = ν/κ sets the relative importance of momentum diffusion (viscosity) and thermal diffusion. For Pr >> 1 (honey, silicone oil), viscosity strongly damps velocity while temperature can vary sharply — thermal boundary layers are thin and interior is nearly isothermal. For Pr << 1 (liquid metals: Pr ≈ 0.003 for mercury), heat diffuses rapidly and the temperature field is nearly uniform while velocity patterns are complex.

Solar convection is the most spectacular real-world example. The solar convection zone extends from 0.7 solar radii to the surface. At the surface, granulation (convection cells ~1,000 km wide, ~10 min lifetime) and supergranulation (~30,000 km wide, ~1 day lifetime) are visible. The effective Ra in the Sun is approximately 10²⁰ — extreme turbulence. Understanding solar convection is critical for predicting the solar dynamo (generation of magnetic field), sunspot cycles, and ultimately space weather.

Earth's mantle is also a convecting fluid — but with Ra ≈ 10⁶–10⁷ and Pr → ∞ (viscosity dominates completely). Mantle convection at geological timescales (millions of years) drives plate tectonics. The hexagonal cell geometry is visible in the organization of tectonic plates — each "cell" is a convection roll bringing material up at mid-ocean ridges and down at subduction zones.

---

## The Fix

Uncomment the buoyancy term and add a small random temperature perturbation to seed the instability.

```javascript
// Temperature perturbation: small noise at the bottom boundary
for (let i = 0; i < N; i++) {
  T[i + 0*N] = T_hot + 0.1 * (Math.random() - 0.5); // break symmetry
}

function step(dt) {
  // 1. Heat equation WITH convection
  const Tnew = new Float32Array(N * N);
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      const lap_T = (T[(i+1)+j*N] + T[(i-1)+j*N] +
                     T[i+(j+1)*N] + T[i+(j-1)*N] - 4*T[idx]) / (dx*dx);
      // Upwind advection of temperature
      const adv_x = vx[idx] > 0
        ? vx[idx] * (T[idx] - T[(i-1)+j*N]) / dx
        : vx[idx] * (T[(i+1)+j*N] - T[idx]) / dx;
      const adv_y = vy[idx] > 0
        ? vy[idx] * (T[idx] - T[i+(j-1)*N]) / dx
        : vy[idx] * (T[i+(j+1)*N] - T[idx]) / dx;
      Tnew[idx] = T[idx] + dt * (kappa * lap_T - adv_x - adv_y);
    }
  }
  T.set(Tnew);
  T_boundaries(); // enforce T_hot bottom, T_cold top

  // 2. Momentum equation: buoyancy + viscosity + pressure projection
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      const T_local = T[idx];
      const T_mean = (T_hot + T_cold) / 2;
      // Boussinesq buoyancy: hotter than mean = lighter = rises
      const buoyancy = -alpha * (T_local - T_mean) * g;
      const lap_vy = (vy[(i+1)+j*N] + vy[(i-1)+j*N] +
                      vy[i+(j+1)*N] + vy[i+(j-1)*N] - 4*vy[idx]) / (dx*dx);
      vyNew[idx] = vy[idx] + dt * (nu * lap_vy + buoyancy);
      const lap_vx = (vx[(i+1)+j*N] + vx[(i-1)+j*N] +
                      vx[i+(j+1)*N] + vx[i+(j-1)*N] - 4*vx[idx]) / (dx*dx);
      vxNew[idx] = vx[idx] + dt * nu * lap_vx;
    }
  }
  pressureProject(); // enforce ∇·u = 0
  [vx, vxNew] = [vxNew, vx];
  [vy, vyNew] = [vyNew, vy];
}
```

With Ra ≈ 5000 (above Ra_c = 1708): after ~500 steps, small temperature blobs appear. By step 2000: well-defined convection rolls. Color T hot-to-cold: red-rising columns, blue-sinking columns, alternating.

---

## The Wow Moment — Push It

**Ra sweep documentary:** Start at Ra = 500 (below onset — flat, conducting). Slowly increase ΔT in real time. At exactly Ra = 1708, the first roll appears. Continue increasing: rolls oscillate. At Ra = 10⁵: time-dependent chaotic convection. At Ra = 10⁶: turbulent mixing layer fills the domain. All of this in a single continuous slider drag — it is a documentary of the entire sequence of bifurcations from order to chaos.

**Pr effects:** For Pr = 0.025 (liquid metal): the temperature field is nearly uniform but velocity is highly structured — large laminar convection rolls. For Pr = 7 (water): sharp temperature boundary layers at top and bottom, chaotic interior plumes. For Pr = 1000 (silicone oil): creeping viscous flow, perfectly stable hexagonal cells that barely move.

**Solar granulation render:** Set L = 1000 km, ΔT = 1500 K, ν and κ for the solar photosphere. Ra ≈ 10¹⁰. Run at maximum resolution. Render temperature in a solar palette (black body radiation: dark = 5200K, bright = 5800K). The result looks indistinguishable from genuine solar granulation imagery from SDO.

---

## The Interactive Demo

- **Rayleigh number** slider: Ra = 100 to 10⁷ (adjusts ΔT, keeping L, ν, κ fixed)
- **Prandtl number** selector: 0.003 (liquid mercury) / 0.025 (liquid sodium) / 0.7 (air) / 7 (water) / 100 (silicone oil) / 1000 (glycerol)
- **Aspect ratio** slider: width/height = 1 to 8 (more cells fit in wider domains)
- **Color mode**: Temperature | Vertical velocity | Vorticity | Pressure
- **Nusselt number readout**: live computation Nu = total heat flux / conductive flux
- **Heat flux plot**: right-panel plot of Nu vs Ra (adds data points as slider is moved)
- **Cell counting**: live count of convection cells visible
- **Initial condition**: Pure conductive | Single-mode perturbation | Random noise
- **Pause/Reset** and speed controls

---

## Production Notes

**Code to show:**
- Broken code with missing buoyancy term — the commented-out line
- The Boussinesq buoyancy term — one line: `buoyancy = -alpha * (T - T_mean) * g`
- The temperature advection term — explain how heat is CARRIED by the flow (not just diffused)
- The pressure projection (reference to M001) — show it's the same solver appearing again

**Visual layout:**
- Main canvas: 512×512 (or wider for high aspect ratio) temperature colormap (blue-white-red)
- Overlay: velocity field arrows, scaled to show flow direction within cells
- Right panel: time-series plot of Nu(t) — starts at 1 (pure conduction), jumps to ~2–5 at onset
- Bottom strip: live Ra and Pr display, cell count

**Key cinematic moments:**
- 00:30 — Real Bénard cell experiment video — hexagons materializing
- 01:30 — Broken simulation — perfect linear gradient, zero velocity, "the system is in an unstable equilibrium"
- 03:00 — Add buoyancy + noise: first convection roll appears (exactly like crystallization — sudden)
- 04:30 — Ra slider from 2000 to 10,000 — rolls oscillate and multiply
- 05:30 — Show Nu jumping with Ra — each bifurcation is visible as a step
- 06:30 — Pr = 0.025 vs Pr = 100 side by side — dramatic difference in flow structure
- 07:30 — Solar granulation render comparison
- 08:30 — "Earth's plates are Bénard cells with a 100-million-year timescale"
- 09:00 — Show Ra_c = 1708 computed from simulation by finding exact onset threshold

---

## Tags
`convection` `rayleigh-benard` `heat-transfer` `pattern-formation` `hexagons` `prandtl-number` `fluid-simulation` `navier-stokes`

---

## Thumbnail

Left half: an actual photograph of Bénard convection cells in silicone oil — perfectly regular polygonal (roughly hexagonal) cells with dark centers and bright edges, taken from above. Right half: the simulation in red-white-blue temperature colormap, same polygonal structure visible. Centered text: "THE SUN DOES THIS". Sub-text: "And so does your coffee, Jupiter, and Earth's mantle." Bottom equation strip in yellow: Ra = gαΔTL³/νκ > 1708. The two images mirror each other's geometry with annotating red arrows between matching cells.
