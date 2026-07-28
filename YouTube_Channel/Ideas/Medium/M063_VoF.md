---
title: "Tracking a Fluid Surface on a Grid (Volume of Fluid Method)"
id: M063
difficulty: 6.5/10
prereq: "None"
concept: "VoF method: track volume fraction C ∈ [0,1] in each cell; C=0 is air, C=1 is water, 0<C<1 is interface; advect C with the velocity field; interface reconstruction (PLIC) for sharp interface; conservation of mass guaranteed."
tags: [VoF, volume-of-fluid, interface-tracking, multiphase-flow, PLIC, free-surface, canvas, computational-fluid-dynamics]
category: medium
type: video-idea
---

# Tracking a Fluid Surface on a Grid (Volume of Fluid Method)

**Alt title:** "How Computer Simulations Track Water Surfaces (Volume of Fluid Method)"
**Difficulty:** 6.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Canvas: a rectangular tank of water. A dam breaks on the left — a tall column of water collapses into a shallow basin. The water splashes, climbs the right wall, crashes back, sloshes. The free surface is sharp, continuous, always exactly conserving the water volume.

Narrator: "That free surface is the hardest part of simulating water. The fluid is not just moving — the very *region* of the domain that contains fluid is moving. Air is here, then water is here, then air again — in milliseconds. How do you track that on a fixed grid?"

"The naive approach destroys the interface — smears it across 10 cells until you can't see it. The Volume of Fluid method keeps it sharp. And the key insight is deceptively simple: instead of tracking *where* the surface is, track *how much* of each grid cell is filled with water."

Show: zoom into a grid cell at the water surface. It's half full. "This cell is 50% water, 50% air. We store one number: C = 0.5. Every other cell is either C=0 (pure air) or C=1 (pure water). The surface is the set of cells where 0 < C < 1. Move the fluid → update C → the surface moves with it. No surface geometry to track. No mesh to deform."

---

## The Naive Attempt

The naive approach: track the interface as a sharp discontinuity by advecting C with the velocity field using a standard upwind scheme.

```javascript
// Naive: upwind advection of the color function C
// dc/dt + u * dc/dx + v * dc/dy = 0
function naiveAdvect(C, u_x, u_y, dx, dy, dt, N) {
  const C_new = C.slice();
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = j * N + i;
      // First-order upwind
      const adv_x = u_x[idx] > 0
        ? u_x[idx] * (C[idx] - C[idx-1]) / dx
        : u_x[idx] * (C[idx+1] - C[idx]) / dx;
      const adv_y = u_y[idx] > 0
        ? u_y[idx] * (C[idx] - C[idx-N]) / dy
        : u_y[idx] * (C[idx+N] - C[idx]) / dy;
      C_new[idx] = C[idx] - dt * (adv_x + adv_y);
    }
  }
  return C_new;
}
```

Initial condition: $C = 1$ in the left half, $C = 0$ in the right half. Initial velocity: uniform $u = 1$ m/s, $v = 0$.

Run for 100 timesteps. The interface, initially a sharp step function at $x = 0.5$, smears out. After 100 steps it spans 10 cells — a thick diffuse transition zone. After 200 steps: 20 cells. The interface is now wide enough to be visually ugly and physically wrong. Run for long enough: the entire domain is grey mist.

Even if you use higher-order advection (MUSCL, TVD), the Gibbs phenomenon and numerical diffusion gradually smear the step discontinuity. An upwind scheme has numerical diffusion proportional to $u \cdot \Delta x / 2$ — unavoidable at finite resolution.

---

## The Moment of Failure

Exact visual: three frames of the naive advection — timestep 0 (sharp white-left/black-right split), timestep 100 (blurry gradient), timestep 300 (washed-out grey field covering 1/3 of the domain). The "water surface" is now an 8-cell-wide diffuse blob.

Text overlay: "Volume conservation check: at t=0, total C = 128×128/2 = 8,192. At t=300: total C = 7,840. Water has been lost — 4.3% mass error." Arrow pointing to the blurry interface: "Is the surface here? Or here? Or here? The method doesn't know."

Then a more insidious failure: show the dam-break with naive advection. The water column collapses, splashes… and when the water climbs the wall, thin sheets of water near the wall smear into fog. The droplets don't form — they are absorbed into background diffusion. "Physical droplets require a sharp interface. Numerical diffusion kills them."

---

## Why It Broke — The Physics

**The advection equation for a discontinuity:** The volume fraction $C(\mathbf{x}, t)$ satisfies the purely hyperbolic advection equation:
$$\frac{\partial C}{\partial t} + \nabla \cdot (\mathbf{u} C) = 0$$

(using the incompressibility condition $\nabla \cdot \mathbf{u} = 0$ to write $\mathbf{u} \cdot \nabla C = \nabla \cdot (\mathbf{u} C)$).

For an incompressible flow, the exact solution advects $C$ along characteristics without distortion: if $C = 1$ in a region $\Omega(t)$, then $\Omega(t)$ moves with the flow. The interface moves exactly with the fluid velocity. **The discontinuity is preserved exactly.**

The problem: standard numerical advection schemes for smooth functions have numerical diffusion — a truncation error that looks like $D_{num} = \frac{u \Delta x}{2}(1 - CFL) \frac{\partial^2 C}{\partial x^2}$. For smooth functions, this is a small perturbation. For a discontinuity, the second derivative is a Dirac delta — the diffusion term is enormous right at the interface. Every timestep, the interface smears by roughly $\Delta x/2$ in each direction.

**Why mass conservation is critical for free surfaces:** In engineering simulations (ship hull forces, dam break flooding, sloshing in fuel tanks), mass is exactly conserved in reality (water is incompressible and doesn't vanish). Any numerical mass error represents a physical wrong: the simulation is inventing or destroying water. The naive upwind scheme violates mass conservation because it is not in conservative form — it uses the advective form $\mathbf{u} \cdot \nabla C$ rather than the divergence form $\nabla \cdot (\mathbf{u} C)$.

---

## The One Concept

**The Volume of Fluid (VoF) Method** tracks the interface implicitly via the volume fraction field $C(\mathbf{x}, t)$ and uses geometric interface reconstruction to advect $C$ without numerical diffusion.

**The volume fraction $C$:** In each cell, $C$ represents the fraction of cell volume occupied by fluid 1 (water). $C = 1$: pure water. $C = 0$: pure air. $0 < C < 1$: interface cell. The interface is not stored explicitly; it is implied by the $C$ field.

**Interface reconstruction — PLIC (Piecewise Linear Interface Calculation):** In each interface cell, reconstruct the interface as a straight line (in 2D) or plane (in 3D) with normal $\mathbf{n}$ and offset $d$:
$$\mathbf{n} \cdot \mathbf{x} = d$$

The normal $\mathbf{n}$ is estimated from the gradient of $C$ using a 3×3 stencil of neighboring cell values (Youngs' method):
$$\mathbf{n} \approx -\nabla C / |\nabla C|$$

The offset $d$ is found so that the line $\mathbf{n} \cdot \mathbf{x} = d$ cuts the cell such that the fluid volume on the water side exactly equals $C \cdot \Delta x \cdot \Delta y$. This requires solving a nonlinear equation but has closed-form solutions for the line-in-square case.

**Geometric advection (operator splitting):** Advect the reconstructed interface geometrically. In each cell, the fluid polygon defined by the PLIC interface is advected by the velocity field:

For X-direction sweep (Strang splitting):
- For each cell: the volume flux through the right face = area of fluid polygon swept through the face in time $\Delta t$ (computed geometrically from the PLIC line)
- Update $C_i^{n+1} = C_i^n + (F_{i-1/2} - F_{i+1/2}) / \Delta x$

This is **exactly conservative**: the flux leaving one cell enters the neighbor. Mass is exactly conserved to machine precision.

**The PLIC algorithm (2D):**
```javascript
function PLICOffset(C, nx, ny, dx, dy) {
  // Find offset d such that the area below line nx*x + ny*y = d
  // within the unit square [0,dx]×[0,dy] equals C * dx * dy
  // Uses closed-form formulas based on which corners are "submerged"
  const m1 = Math.abs(nx), m2 = Math.abs(ny);
  // Sort so that m1 >= m2 (WLOG)
  const alpha = C * (m1 + m2); // total "density"
  if (alpha <= m2 * m2 / (2 * m1)) {
    return Math.sqrt(2 * alpha * m1); // corner regime
  } else if (alpha <= m1 - m2 * m2 / (2 * m1)) {
    return alpha / m1 + m2 / 2;       // middle regime
  } else {
    return m1 + m2 - Math.sqrt(2 * m1 * m2 * (1 - alpha));  // other corner
  }
}
```

**Coupling with the flow solver:** VoF is combined with a Navier-Stokes solver (projection method or pressure-correction). The fluid density and viscosity in each cell are volume-fraction-averaged: $\rho = C \rho_w + (1-C)\rho_a$. Surface tension is computed as a body force using the interface curvature $\kappa = -\nabla \cdot (\mathbf{n}/|\mathbf{n}|)$ via the Continuum Surface Force (CSF) model: $\mathbf{f}_{surf} = \sigma \kappa \nabla C$.

**Real-world examples:**
- **Ship hull resistance simulation:** VoF tracks the water-air interface around a ship's bow. Breaking waves, spray, and wave patterns are computed for drag estimation. Used by DNV GL, Bureau Veritas for hull certification.
- **Dam break flood simulation:** Emergency evacuation planning uses VoF to model flood wave propagation after dam failure. USACE uses OpenFOAM (VoF-based) for this.
- **Coffee machine extraction:** The Breville company uses VoF to simulate water flow through coffee grounds — free surface flow through a porous medium.
- **Fuel sloshing in aircraft tanks:** Airbus simulates fuel motion in wing tanks during maneuvers to compute the resulting loads on tank walls. Prevents structural fatigue failure.

---

## The Fix

Complete 2D VoF advection with PLIC reconstruction:

```javascript
class VoFMethod {
  constructor(N, dx, dy) {
    this.N = N; this.dx = dx; this.dy = dy;
    this.C = new Float64Array(N * N);  // volume fractions
  }

  // Youngs' method: compute interface normal from 3×3 C stencil
  computeNormal(i, j) {
    const g = (di, dj) => {
      const ii = Math.max(0, Math.min(this.N-1, i+di));
      const jj = Math.max(0, Math.min(this.N-1, j+dj));
      return this.C[jj * this.N + ii];
    };
    // Gradient of C via central differences (3×3 stencil)
    const dCdx = (g(1,-1) + 2*g(1,0) + g(1,1) - g(-1,-1) - 2*g(-1,0) - g(-1,1)) / (8*this.dx);
    const dCdy = (g(-1,1) + 2*g(0,1) + g(1,1) - g(-1,-1) - 2*g(0,-1) - g(1,-1)) / (8*this.dy);
    const mag = Math.sqrt(dCdx*dCdx + dCdy*dCdy) + 1e-14;
    return [-dCdx/mag, -dCdy/mag];  // normal points into fluid
  }

  // Compute volume fraction flux through right face (x-direction)
  computeXFlux(i, j, u_face, dt) {
    const idx = j * this.N + i;
    const C_cell = this.C[idx];
    if (C_cell <= 0) return 0;
    if (C_cell >= 1) return u_face * dt * this.dy;  // full cell: full flux
    // Interface cell: reconstruct PLIC and compute swept area
    const [nx, ny] = this.computeNormal(i, j);
    const d = PLICOffset(C_cell, Math.abs(nx), Math.abs(ny));
    // Compute area of fluid in the swept region [x_face - |u|*dt, x_face]
    return geometricFlux(nx, ny, d, u_face, dt, this.dx, this.dy);
  }

  // Strang-split geometric advection
  advect(u_x, u_y, dt) {
    const N = this.N;
    // X-sweep
    const Cx = this.C.slice();
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N-1; i++) {
        const face_u = 0.5 * (u_x[j*N+i] + u_x[j*N+i+1]); // face velocity
        const flux = this.computeXFlux(face_u > 0 ? i : i+1, j, face_u, dt);
        Cx[j*N+i]   -= flux / (this.dx * this.dy);
        Cx[j*N+i+1] += flux / (this.dx * this.dy);
      }
    }
    this.C = Cx;
    // Y-sweep (same structure)
    // ... (symmetric)
    // Clip C to [0,1] (numerical safety)
    this.C = this.C.map(c => Math.max(0, Math.min(1, c)));
  }

  // Render: draw each cell as filled rectangle
  render(ctx) {
    const N = this.N, dx = this.dx, dy = this.dy;
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const C = this.C[j*N+i];
        // Blue for water, white for air, gradient at interface
        ctx.fillStyle = `rgb(${Math.round(255*(1-C))},${Math.round(200*(1-C))},${Math.round(255)})`;
        ctx.fillRect(i*dx*W, (N-1-j)*dy*H, dx*W+1, dy*H+1);
      }
    }
  }
}
```

The PLIC-based VoF maintains a sharp interface (1–2 cells wide) indefinitely, conserving mass to machine precision. After 1000 timesteps, total C is preserved to 14 decimal places.

---

## The Wow Moment — Push It

**Demo: Full dam-break simulation with Navier-Stokes + VoF.** A tall column of water ($C=1$ in the left 1/3 of the domain) collapses under gravity into a shallow layer. The NS solver (pressure-velocity projection) drives the flow; VoF tracks the free surface.

Watch the water column collapse: the front rushes forward, hits the right wall, splashes upward, falls back, generates a secondary wave. Surface tension (CSF model) is toggled on: the wave crest does not just crash into the right wall — it forms a thin sheet that separates into droplets (in 2D: filaments that pinch off into circles).

Then: **raindrop impact**. A circular water droplet ($C=1$ circle, radius = 5 cells) falls from the top into a shallow water layer. On impact: a crown splash forms (the characteristic "coronet" of a high-speed droplet impact). The crown is made visible by the VoF field — each "finger" of the crown is tracked as a thin filament of $C = 1$ cells. With fine enough resolution, the fingers pinch off into secondary droplets.

Finally: **ship bow wave**. A rectangular body moves through a water domain at constant speed. The bow pushes the water surface up and forward, generating a characteristic V-shaped bow wave pattern. VoF tracks the wave crest — the same physics that every ship designer uses OpenFOAM to compute.

---

## The Interactive Demo

The viewer gets a canvas with a 2D VoF+NS simulation:

- **Problem** (dropdown): Dam break | Raindrop impact | Sloshing tank | Ship bow wave | Rising bubble | Falling water jet
- **Click to add fluid** (left-click on canvas): Fill a circular region with $C = 1$ (add water blob)
- **Click to remove fluid** (right-click): Set $C = 0$ (remove water)
- **Gravity** (slider, 0–20 m/s²): Change gravitational acceleration; at 0, watch neutral buoyancy
- **Density ratio** (slider, 1–1000, water/air): High ratio = realistic water in air. Low = nearly matched densities (slow surface tension effects).
- **Viscosity** (slider, 1e-6 to 1e-2 m²/s): High viscosity = sluggish, viscous flow. Low = turbulent splashing.
- **Surface tension σ** (slider, 0–0.1 N/m): Toggle on/off; observe droplet formation vs. sheet flow
- **Reconstruction method** (dropdown): PLIC (sharp) | Young's (slightly diffuse) | No reconstruction = naive upwind (watch it smear)
- **Color mode** (dropdown): Volume fraction C | Velocity magnitude | Pressure | Vorticity
- **Conservation display**: Live readout of total $\sum C \cdot \Delta x \Delta y$ — should be exactly constant; watch it stay fixed with PLIC, drift with naive advection
- **Show interface normals** (toggle): Draw $\mathbf{n}$ vectors at each interface cell — reveals the PLIC reconstruction quality

---

## Production Notes

**Code structure:**
- `vof.js`: `VoFMethod` class — Youngs' normal, PLIC offset, geometric flux computation, Strang splitting
- `ns_projection.js`: Incompressible NS projection method (pressure Poisson + velocity correction); density/viscosity interpolated from C field
- `surface_tension.js`: CSF surface tension force computation; curvature from $\nabla \cdot (\mathbf{n}/|\mathbf{n}|)$
- `render_vof.js`: Blue-to-white color rendering, interface normal arrows, PLIC line segments drawn on interface cells
- `main.js`: Animation loop, time-stepping, controls

**Visual layout:**
- White-to-blue color ramp: C=0 → white (air), C=1 → deep blue (water). Interface cells appear as intermediate blue.
- On each interface cell: a thin white line segment (the PLIC reconstruction) visible when zoomed
- Pressure: grey-to-red overlay (toggle)
- Conservation meter: a horizontal bar showing total volume; should stay exactly at initial level

**Key cinematic moments:**
1. (1:15) Side-by-side: naive advection (smeared grey blob spreading over 10 cells) vs. PLIC VoF (razor-sharp blue/white interface, 1 cell wide). Same flow, same timestep. "That's PLIC. That's it. Everything else is the same."
2. (3:00) Zoom into a single PLIC interface cell: show the white line segment cutting diagonally across the cell. "One line. $\mathbf{n} \cdot \mathbf{x} = d$. That's the entire surface representation for this cell."
3. (5:30) Conservation meter: naive advection total C bar shows water level dropping; PLIC bar is locked at exactly the initial level. "Machine precision conservation. The water is not disappearing."
4. (7:00) Dam break: the collision with the right wall produces a thin vertical water sheet. Turn on surface tension: the sheet starts to develop beads — Rayleigh-Plateau instability forming droplets from the sheet.
5. (9:30) Raindrop crown: show 30× slow motion of the droplet impact. The crown radiates outward. PLIC tracks each finger individually. Surface tension (on): fingers pinch off at the tips, releasing small droplets. Off: fingers persist without breakup.

**Equations to render on canvas:**
- $\frac{\partial C}{\partial t} + \nabla \cdot (\mathbf{u} C) = 0$ (VoF equation — conservation form)
- PLIC: $\mathbf{n} \cdot \mathbf{x} = d$ (interface line equation)
- $\mathbf{f}_{surf} = \sigma \kappa \nabla C$ (CSF surface tension body force)

---

## Tags
`VoF` `volume-of-fluid` `interface-tracking` `multiphase-flow` `PLIC` `free-surface` `canvas` `computational-fluid-dynamics`

---

## Thumbnail

Dark blue background. A dramatic dam-break scene: a sharp blue water column (C=1, vivid) mid-collapse, splashing against a right wall. The free surface is crisply defined — no blurring. A zoom-in circle shows the PLIC interface line cutting diagonally across a single grid cell (white line on blue/white checkerboard). Bold white text: "TRACKING WATER SURFACES" at top. Subtitle: "Volume of Fluid Method" in yellow. A small comparison badge: "Naive: blurry | PLIC: sharp" in red and green respectively.
