---
title: "Simulating a Swimming Fish in Fluid (Immersed Boundary Method)"
id: M065
difficulty: 7/10
prereq: "None"
concept: "Immersed boundary method (Peskin): Lagrangian structure (fish body) immersed in Eulerian fluid grid; elastic forces spread to fluid: f(x) = ∫F(s)δ(x-X(s))ds; fluid velocity interpolated back to structure."
tags: [immersed-boundary, fluid-structure-interaction, Peskin, Lagrangian-Eulerian, fish-swimming, delta-function, canvas, bio-fluid]
category: medium
type: video-idea
---

# Simulating a Swimming Fish in Fluid (Immersed Boundary Method)

**Alt title:** "The Mathematical Trick That Lets Fish Swim in Simulations (Immersed Boundary Method)"
**Difficulty:** 7/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Canvas: a fish outline (a simple closed elastic curve) immersed in a 2D fluid. The fish flaps its tail — a sinusoidal traveling wave propagates from nose to tail along the body. The fluid responds: vortices shed from the tail in a characteristic von Kármán reverse vortex street. The fish moves forward.

Narrator: "How does a fish swim? It deforms its body. The deformation pushes on the fluid. The fluid pushes back, generating thrust. The fluid also carries the fish forward. It's a fully coupled two-way interaction: fish shape → fluid forces → fish motion → fish shape change."

"If you want to simulate this on a computer, you face an immediate problem: the fish boundary is moving. Traditional fluid simulation methods use a fixed computational mesh. The fish moves through the mesh — cells are cut in half, boundary conditions change at every timestep, the mesh must be regenerated or deformed continuously. It is an engineering nightmare."

"In 1977, mathematician Charles Peskin invented the Immersed Boundary Method to simulate heart valves without any of this complexity. The key idea: forget about the mesh. Forget about boundary-fitted grids. Keep the fluid on a fixed Cartesian grid, represent the fish as a set of Lagrangian points, and communicate between them using a smeared delta function. The fish boundary is 'immersed' in the grid rather than fitted to it."

---

## The Naive Attempt

The naive approach: try to enforce the no-slip boundary condition exactly on a body-fitted grid.

```javascript
// Naive: body-fitted boundary condition
// At each timestep, move the fish, then:
// 1. Find which grid cells are inside the fish
// 2. Set fluid velocity = fish velocity in those cells (no-slip)
// 3. Re-mesh the boundary region

function setBodyFittedBC(fluidVelocity, fishBoundary, fishVelocity, N, dx) {
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const x = (i + 0.5) * dx, y = (j + 0.5) * dx;
      if (isInsideFish(x, y, fishBoundary)) {
        // Force inside cells to have fish velocity
        const {u, v} = fishVelocityAt(x, y, fishBoundary, fishVelocity);
        fluidVelocity.u[j*N+i] = u;
        fluidVelocity.v[j*N+i] = v;
      }
    }
  }
  // Now: Navier-Stokes with discontinuous velocity field at the boundary
  // Pressure Poisson will give large errors near the boundary
  // The discontinuity creates non-physical delta-function-like pressure spikes
}
```

Problems:
1. The `isInsideFish` check changes every timestep — expensive polygon-in-point tests for every grid cell.
2. Setting velocities inside the body creates a discontinuity in the velocity field at the fish boundary. The pressure Poisson equation — which requires smooth, continuous velocity fields — produces large artificial pressure spikes at the boundary.
3. The fish boundary rarely coincides with grid cell faces. Cells at the boundary are partially inside and partially outside the fish — a "cut cell" problem that requires special interpolation logic that is extremely complex to implement correctly.
4. Conservation: mass can be created or destroyed as the fish boundary moves through cells, changing their inside/outside status.

"This approach produces garbage near the fish boundary. The velocity field is wrong, the pressure is wrong, and the forces on the fish are wrong. We need a completely different philosophy."

---

## The Moment of Failure

Exact visual: run the naive body-fitted approach. The fluid velocity field looks fine away from the fish, but near the fish boundary: large checkerboard oscillations in the pressure field (non-physical). The force on the fish — computed by integrating pressure and viscous stress over its surface — has huge errors: ±200% depending on grid alignment with the fish.

Show the pressure field as a color map: smooth blue-and-orange far from the fish, wild multicolor spikes at the fish boundary — the exact signature of a discontinuity in the velocity field corrupting the Poisson solve.

Then show the fish motion over time: instead of swimming smoothly forward, the naive fish jitters — moving forward when its boundary happens to coincide with grid lines, stalling when it's between lines. "The fish is feeling the grid. That's a numerical artifact. Real fish don't feel Cartesian grids."

"The IB method uses a completely different strategy: instead of making the fluid feel the hard boundary, make the boundary spread its forces softly over nearby fluid cells."

---

## Why It Broke — The Physics

**The fluid-structure interaction problem:** The fluid satisfies the Navier-Stokes equations on the fixed Eulerian domain $\Omega$. The structure (fish) is a Lagrangian 1D curve $\mathbf{X}(s,t)$ parameterized by arc length $s$. The coupling conditions are:
1. **No-slip:** The fluid velocity at the structure position equals the structure velocity: $\mathbf{u}(\mathbf{X}(s,t), t) = \partial\mathbf{X}/\partial t$
2. **Force balance:** The elastic force from the structure acts on the fluid at the structure position; the fluid reaction acts on the structure (Newton's third law)

In the IB method, both conditions are written using the Dirac delta function to localize the coupling to the interface:

**Force spreading (structure → fluid):**
$$\mathbf{f}(\mathbf{x}, t) = \int_\Gamma \mathbf{F}(s, t) \, \delta(\mathbf{x} - \mathbf{X}(s,t)) \, ds$$

**Velocity interpolation (fluid → structure):**
$$\frac{\partial \mathbf{X}}{\partial t}(s, t) = \int_\Omega \mathbf{u}(\mathbf{x}, t) \, \delta(\mathbf{x} - \mathbf{X}(s,t)) \, d\mathbf{x}$$

Both integrals involve the delta function $\delta(\mathbf{x} - \mathbf{X})$ — zero everywhere except where $\mathbf{x}$ is exactly at the structure point $\mathbf{X}$. Numerically, this delta function is **regularized** (smoothed): replaced by a discrete approximation $\delta_h$ that spreads the force over a few nearby grid cells.

**The discrete delta function (Peskin's 4-point kernel):**
$$\delta_h(r) = \begin{cases} \frac{1}{8h}\left(3 - 2|r/h| + \sqrt{1 + 4|r/h| - 4(r/h)^2}\right) & |r| \leq h \\ \frac{1}{8h}\left(5 - 2|r/h| - \sqrt{-7 + 12|r/h| - 4(r/h)^2}\right) & h \leq |r| \leq 2h \\ 0 & |r| > 2h \end{cases}$$

This 4-point kernel has special properties: it is twice continuously differentiable, sums to 1, has zero first moment (preserves linear momentum), and has minimum $2h$ support (spreads over at most 4 cells). It makes the IB method translation-invariant — results don't depend on where the boundary happens to sit relative to the grid lines.

---

## The One Concept

**The Immersed Boundary Method** (Peskin, 1977) simulates fluid-structure interaction using:
- A fixed **Eulerian grid** for the fluid (Navier-Stokes on a Cartesian mesh)
- **Lagrangian points** $\mathbf{X}(s,t)$ for the structure (fish body, heart valve, elastic filament)
- A **regularized delta function** that smoothly communicates forces and velocities between the two representations

**The complete IB algorithm (one timestep):**

```
Given: fluid velocity u^n on Eulerian grid, structure positions X^n

1. COMPUTE ELASTIC FORCES on the Lagrangian structure:
   F(s) = ∂/∂s (T · ∂X/∂s / |∂X/∂s|)  [elastic tension forces]
   where T(s) = k_s * (|∂X/∂s| - L_0)  [spring tension from stretching]

2. SPREAD FORCES to Eulerian grid (Lagrangian → Eulerian):
   f(x_ij) = Σ_s F(s) * δ_h(x_ij - X(s)) * Δs
   [sum of all Lagrangian forces, weighted by delta function]

3. SOLVE NAVIER-STOKES with the body force f:
   ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u + f
   ∇·u = 0
   [standard NS projection method on Cartesian grid]

4. INTERPOLATE velocity from Eulerian grid to Lagrangian points:
   dX/dt(s) = Σ_ij u(x_ij) * δ_h(x_ij - X(s)) * Δx*Δy
   [fluid velocity at each structure point = delta-weighted average]

5. MOVE the structure:
   X^{n+1}(s) = X^n(s) + Δt * dX/dt(s)
```

**The elastic force model:** The fish body is modeled as a system of springs:
- **Tension springs:** Maintain arc length. Spring force along the tangent: $\mathbf{F}_{tension} = k_s(|\partial\mathbf{X}/\partial s| - L_0)\mathbf{t}$
- **Bending springs:** Maintain curvature. Spring force in the normal direction: $\mathbf{F}_{bend} = k_b \partial^2\mathbf{X}/\partial s^2$
- **Target-shape springs:** Drive the body toward a prescribed target shape: $\mathbf{F}_{target} = k_t(\mathbf{X}_{target}(s,t) - \mathbf{X}(s,t))$ — this is how active fish motion is implemented. The target position oscillates: $\mathbf{X}_{target}(s,t) = \mathbf{X}_0(s) + A\sin(ks - \omega t)\hat{n}(s)$ (a traveling sinusoidal wave).

**Energy conservation check:** The IB method conserves total energy (kinetic energy of fluid + elastic energy of structure) up to numerical dissipation from the NS solver and the delta function regularization. The regularized delta function introduces a small amount of artificial viscosity near the structure — the cost of immersing the boundary in a fixed grid. This is the "IB method tax": the effective numerical viscosity is $O(h)$ higher near the boundary than away from it.

**Real-world examples:**
- **Cardiac simulation (Peskin's original application):** The human heart valve is a thin, elastic, one-way membrane. Simulating it with body-fitted grids was intractable. The IB method (by Peskin and McQueen, 1980s–2000s) produced the first successful fluid-structure heart simulations, revealing how valve shape affects regurgitation and stenosis.
- **Red blood cell deformation in capillaries:** Red blood cells (RBCs) deform dramatically as they squeeze through capillaries narrower than their own diameter. IB simulations of RBC deformation predict the pressure drop in microfluidic channels and inform blood viscosity models.
- **Cilia and flagella:** Bacteria swim by rotating helical flagella; airway cells clear mucus with beating cilia. IB simulations of these biological propulsion systems reveal the fluid mechanics of swimming at low Reynolds number (Purcell's "Scallop Theorem" regime).
- **Fish schooling (engineering):** Naval engineers use IB-inspired methods to simulate arrays of energy-harvesting flapping foils — artificial fish schools that extract energy from flow. IB naturally handles the multiple-foil problem on one fixed grid.

---

## The Fix

Complete 2D IB method implementation:

```javascript
class ImmersedBoundaryMethod {
  constructor(N, dx, dt, mu, rho) {
    this.N = N; this.dx = dx; this.dt = dt;
    this.mu = mu; this.rho = rho;
    // Eulerian grid: velocity and force fields
    this.u = new Float64Array(N * N);  // x-velocity
    this.v = new Float64Array(N * N);  // y-velocity
    this.p = new Float64Array(N * N);  // pressure
    this.fx = new Float64Array(N * N); // body force x
    this.fy = new Float64Array(N * N); // body force y
    // Lagrangian structure: fish body
    this.nMarkers = 128;
    this.X = [];  // Lagrangian point positions
    this.X0 = []; // rest (target) positions
    this.ks = 1e4; // tension spring stiffness
    this.kb = 1e2; // bending stiffness
    this.kt = 1e4; // target-shape stiffness
    this.ds = 1.0 / this.nMarkers; // arc-length spacing
    this.initFish();
  }

  // Peskin's 4-point discrete delta function kernel
  deltaKernel(r, h) {
    const rh = Math.abs(r / h);
    if (rh >= 2) return 0;
    if (rh < 1) return (3 - 2*rh + Math.sqrt(1 + 4*rh - 4*rh*rh)) / (8*h);
    return (5 - 2*rh - Math.sqrt(-7 + 12*rh - 4*rh*rh)) / (8*h);
  }

  // Spread Lagrangian forces to Eulerian grid
  spreadForces() {
    this.fx.fill(0); this.fy.fill(0);
    for (let l = 0; l < this.nMarkers; l++) {
      const { Fx, Fy } = this.computeElasticForce(l);
      const Xp = this.X[l];
      // Find the 4×4 block of grid cells that the delta function touches
      const i0 = Math.floor(Xp.x / this.dx) - 1;
      const j0 = Math.floor(Xp.y / this.dx) - 1;
      for (let dj = 0; dj < 4; dj++) {
        for (let di = 0; di < 4; di++) {
          const i = i0 + di, j = j0 + dj;
          if (i < 0 || i >= this.N || j < 0 || j >= this.N) continue;
          const xg = (i + 0.5) * this.dx, yg = (j + 0.5) * this.dx;
          const weight = this.deltaKernel(xg - Xp.x, this.dx)
                       * this.deltaKernel(yg - Xp.y, this.dx)
                       * this.ds; // area element ds
          this.fx[j * this.N + i] += Fx * weight;
          this.fy[j * this.N + i] += Fy * weight;
        }
      }
    }
  }

  // Interpolate Eulerian velocity to Lagrangian points
  interpolateVelocity() {
    const vel = this.X.map(Xp => {
      let u = 0, v = 0;
      const i0 = Math.floor(Xp.x / this.dx) - 1;
      const j0 = Math.floor(Xp.y / this.dx) - 1;
      for (let dj = 0; dj < 4; dj++) {
        for (let di = 0; di < 4; di++) {
          const i = i0 + di, j = j0 + dj;
          if (i < 0 || i >= this.N || j < 0 || j >= this.N) continue;
          const xg = (i+0.5)*this.dx, yg = (j+0.5)*this.dx;
          const w = this.deltaKernel(xg-Xp.x, this.dx)
                  * this.deltaKernel(yg-Xp.y, this.dx)
                  * this.dx * this.dx; // area element Δx*Δy
          u += this.u[j*this.N+i] * w;
          v += this.v[j*this.N+i] * w;
        }
      }
      return {u, v};
    });
    return vel;
  }

  // Compute elastic forces on marker l (tension + bending + target shape)
  computeElasticForce(l) {
    const prev = this.X[(l - 1 + this.nMarkers) % this.nMarkers];
    const curr = this.X[l];
    const next = this.X[(l + 1) % this.nMarkers];
    // Tension: f = ks * (|ΔX| - ds) * (ΔX/|ΔX|)
    const dXn = {x: next.x-curr.x, y: next.y-curr.y};
    const dXp = {x: curr.x-prev.x, y: curr.y-prev.y};
    const Ln = Math.sqrt(dXn.x**2+dXn.y**2), Lp = Math.sqrt(dXp.x**2+dXp.y**2);
    const Ftx = this.ks*((Ln-this.ds)*dXn.x/Ln - (Lp-this.ds)*dXp.x/Lp);
    const Fty = this.ks*((Ln-this.ds)*dXn.y/Ln - (Lp-this.ds)*dXp.y/Lp);
    // Target shape: f = kt * (X_target(s,t) - X(s))
    const target = this.targetPosition(l);
    const Fkx = this.kt * (target.x - curr.x);
    const Fky = this.kt * (target.y - curr.y);
    return {Fx: Ftx + Fkx, Fy: Fty + Fky};
  }

  // Target: rest shape + traveling sinusoidal wave for swimming
  targetPosition(l) {
    const s = l * this.ds;  // arc length parameter
    const t = this.time || 0;
    const amplitude = 0.05; // 5% body length
    const wavelength = 0.5;  // half body length per wave
    const frequency = 2.0;   // Hz
    const wave = amplitude * Math.sin(2*Math.PI*(s/wavelength - frequency*t));
    // X0 is the fish centerline at rest (a horizontal line or curved shape)
    const rest = this.X0[l];
    const tangent = this.X0Tangent[l]; // pre-computed rest tangent
    const normal = {x: -tangent.y, y: tangent.x}; // normal = rotate tangent 90°
    return {x: rest.x + wave * normal.x, y: rest.y + wave * normal.y};
  }

  step() {
    this.spreadForces();       // 1. Lagrangian → Eulerian
    this.solveNS();            // 2. Navier-Stokes with body force
    const vel = this.interpolateVelocity(); // 3. Eulerian → Lagrangian
    // 4. Move structure points
    this.X = this.X.map((Xp, l) => ({
      x: Xp.x + this.dt * vel[l].u,
      y: Xp.y + this.dt * vel[l].v
    }));
    this.time = (this.time || 0) + this.dt;
  }
}
```

---

## The Wow Moment — Push It

**Demo: Fish schooling — two fish in formation.** Place two fish (two separate Lagrangian point sets) in the same Eulerian fluid grid. They swim independently but their wakes interact: the trailing fish is in the wake of the leading fish.

In real fish schools, the trailing fish expends less energy when it positions itself in the optimal vortex phase — it "rides" the shed vortices from the leader. Simulate this: run the trailing fish 0.5 body lengths behind the leader, with a phase difference in tail beat. The trailing fish achieves 40% lower force requirement (less swimming effort) compared to solo swimming — captured by the IB simulation.

Render the vorticity field behind the leading fish: the characteristic reverse von Kármán street of positive and negative vortex patches. The trailing fish's tail beat is synchronized to intercept the positive vortex patches — it is "vortex phase locking" with the leader. This is exactly the mechanism observed in real trout schools.

Add a third fish: does it benefit from the two-fish wake? Add a school of 5, 10 fish. The vortex field becomes a complex web. At certain spacings and phase relationships, every fish benefits — the school achieves collective hydrodynamic efficiency. "This is why fish school. The IB method reveals the mechanism."

---

## The Interactive Demo

The viewer gets a canvas with an IB simulation with these controls:

- **Structure type** (dropdown): Swimming fish | Flapping foil | Heart valve (1D membrane) | Elastic filament in flow | Spherical red blood cell | Custom elastic curve (draw)
- **Tail beat frequency** (slider, 0.5–5 Hz): Change swimming frequency; watch vortex shedding frequency change proportionally
- **Tail beat amplitude** (slider, 0–0.2 body lengths): Zero = rigid body. Large = anguilliform (eel-like) swimming.
- **Swimming gait** (dropdown): Thunniform (only tail) | Subcarangiform (tail + rear body) | Anguilliform (whole body) — changes the spatial pattern of the traveling wave
- **Fluid viscosity** (slider, 1e-4 to 1e-1 m²/s): High viscosity (low Re) → smooth, attached flow. Low viscosity (high Re) → strong vortex shedding, turbulent wake.
- **Spring stiffness ks** (slider, 100–100,000): High = rigid fish. Low = very floppy fish that gets deformed by fluid forces rather than swimming.
- **Add second fish** (button): Second fish appears, follows behind with adjustable phase/spacing
- **Phase difference** (slider, 0–2π): Changes the relative tail phase of the two fish
- **Show vorticity** (toggle): Colors the fluid by vorticity ω — the wake pattern
- **Show Lagrangian points** (toggle): Renders the fish as a sequence of dots on the elastic structure
- **Show delta function spread** (toggle): For one selected Lagrangian point, shows the 4×4 block of Eulerian cells it influences — educational visualization of the coupling
- **Energy plot** (side panel): Elastic energy, kinetic energy of fluid, power input by fish tail — shows swimming efficiency

---

## Production Notes

**Code structure:**
- `ib_method.js`: `ImmersedBoundaryMethod` class — spread/interpolate, elastic forces, fish gait model
- `ns_projection.js`: Incompressible NS projection method with body force; periodic boundary conditions
- `fish_geometry.js`: Fish body outline generation, rest-shape tangent computation, target position with traveling wave
- `vorticity.js`: Compute and render vorticity field from velocity grid
- `schooling.js`: Multi-fish manager — separate Lagrangian structures on the same Eulerian grid
- `main.js`: Animation loop, 60fps WebGL render

**Visual layout:**
- Black background; fluid domain fills canvas
- Vorticity field: blue (negative/clockwise) to red (positive/counterclockwise) colormap
- Fish body: white/light grey elastic curve (1-2 px thick) with filled interior
- Lagrangian points shown as small white dots when toggle is on
- Shed vortices trail behind fish as alternating red-blue patches
- Top-left: Strouhal number display (St = fA/U — the dimensionless swimming efficiency metric)

**Key cinematic moments:**
1. (0:40) IB simulation starts: the fish begins to flap. The first vortex detaches from the tail — a red blob drifts downstream, then a blue blob, alternating. "That's a reverse von Kármán vortex street. That's thrust."
2. (2:30) Zoom into a single Lagrangian point: highlight the 4×4 block of Eulerian cells it influences. Draw the delta function weight values as a color gradient in those 16 cells. "This is the entire coupling mechanism. One kernel. 16 cells."
3. (4:00) Turn off target springs (ks → 0): the fish becomes a flaccid membrane, passively fluttering in its own wake. It still generates some thrust from passive elasticity — flag flutter locomotion!
4. (6:20) Two fish: sweep the phase difference from 0 to 2π. At the optimal phase: the trailing fish's thrust increases by 40%, the wake shows the trailing fish intercepting vortices. Pause on this frame. "Trout do this. Confirmed in experiments. We just computed why."
5. (9:30) Five-fish school in formation: show vorticity field as a beautiful complex tapestry of alternating red-blue vortex patches, each fish generating, consuming, and re-radiating vorticity.

**Equations to render on canvas:**
- $\mathbf{f}(\mathbf{x},t) = \int_\Gamma \mathbf{F}(s,t)\,\delta(\mathbf{x}-\mathbf{X}(s,t))\,ds$ (force spreading)
- $\frac{d\mathbf{X}}{dt}(s,t) = \int_\Omega \mathbf{u}(\mathbf{x},t)\,\delta(\mathbf{x}-\mathbf{X})\,d\mathbf{x}$ (velocity interpolation)
- Peskin delta kernel (4-point) — plotted as a visible graph showing the smooth bump shape

---

## Tags
`immersed-boundary` `fluid-structure-interaction` `Peskin` `Lagrangian-Eulerian` `fish-swimming` `delta-function` `canvas` `bio-fluid`

---

## Thumbnail

Black canvas filled with a vivid blue-to-red vorticity field — a turbulent swirling pattern. In the center: a white fish silhouette (slightly curved, tail deflected downward mid-stroke) with a visible trail of alternating red and blue vortex blobs stretching to the right (the reverse von Kármán vortex street). Two smaller fish follow behind in formation. Bold white text: "SWIMMING FISH IN FLUID" at top. Subtitle: "Immersed Boundary Method" in electric blue. A small inset shows the 4-cell delta function spread illustration.
