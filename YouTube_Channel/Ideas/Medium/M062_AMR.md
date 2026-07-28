---
title: "Focusing Simulation Power Where It Matters (Adaptive Mesh Refinement)"
id: M062
difficulty: 7/10
prereq: "None"
concept: "AMR: refine grid cells where the solution has large gradients (estimated by Richardson extrapolation or gradient indicators); coarsen where the solution is smooth; nested grid hierarchy; conservative flux matching at refinement boundaries."
tags: [AMR, adaptive-mesh, refinement, grid-hierarchy, conservation, computational-fluid-dynamics, canvas, numerical-methods]
category: medium
type: video-idea
---

# Focusing Simulation Power Where It Matters (Adaptive Mesh Refinement)

**Alt title:** "Why Simulations Waste 90% of Their Time (And How AMR Fixes It)"
**Difficulty:** 7/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Canvas: a large square domain, a supersonic flow around a blunt body. A shock wave — a razor-thin layer only a few cells wide — stands in front of the body. Behind it: smooth, almost featureless flow.

Narrator: "This shock wave is 1 millimeter thick in a simulation domain 1 meter wide. That's a factor of 1,000. If you want to resolve the shock with 10 cells — barely adequate — you need 10,000 cells across the entire domain. 10,000 × 10,000 = 100 million cells. A one-day simulation becomes a three-month simulation."

"But look at the solution away from the shock: it is perfectly smooth. Flat. Featureless. Every cell in that smooth region is wasted computation — it's computing a zero gradient to 15 significant figures. What if we could concentrate our cells at the shock and thin them out elsewhere?"

An animation plays: cells start uniformly tiny everywhere. Then they merge in the smooth region (coarsening) and split in the shock region (refinement). The mesh becomes a hierarchy — tiny cells at the shock, huge cells far away. Total cell count drops from 100 million to 200,000. The shock is still resolved with 10 cells. The smooth region: one cell.

"That's Adaptive Mesh Refinement. Let's build it."

---

## The Naive Attempt

The naive approach: uniform grid. Simulate an advection-diffusion problem (a sharp concentration front moving across a domain) on a uniform 256×256 grid.

```javascript
// Uniform grid advection-diffusion
// dc/dt + u * dc/dx = D * d²c/dx²
// c[i,j] = concentration, u = advection velocity, D = diffusion coefficient

function advectDiffuseUniform(c, u, D, dx, dt, N) {
  const c_new = c.slice();
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = j * N + i;
      // Upwind advection (first order)
      const adv_x = u > 0
        ? u * (c[idx] - c[idx-1]) / dx
        : u * (c[idx+1] - c[idx]) / dx;
      // Central difference diffusion
      const diff = D * (c[idx-1] + c[idx+1] - 2*c[idx]) / (dx*dx);
      c_new[idx] = c[idx] + dt * (-adv_x + diff);
    }
  }
  return c_new;
}

// Initialize: sharp front at x = 0.5
const N = 256;
const dx = 1.0 / N;
let c = new Float64Array(N * N);
for (let i = 0; i < N; i++)
  for (let j = 0; j < N; j++)
    c[j*N+i] = (i < N/2) ? 1.0 : 0.0;  // sharp step function
```

The problem: the front is 1 cell wide but the domain has 256 cells. 255 cells are doing essentially nothing — computing tiny numerical corrections to a nearly flat field. The front moves at speed $u$ — at each timestep, 255/256 = 99.6% of the compute is wasted.

Worse: to resolve the front better, you need finer resolution there. But refining everywhere from 256 to 512 quadruples the cost (2D). To get 2× better front resolution: 4× slower simulation. To get 10× better front resolution: 100× slower. This is unsustainable.

---

## The Moment of Failure

Exact visual: show the concentration field on canvas — a smooth step function moving left to right. The majority of the canvas is completely uniform (either 0 or 1). Only a vertical strip 3 cells wide is doing interesting physics (the front).

Overlay the cell activity: color each cell by how much its solution changes per timestep. Red = large change (active), blue = zero change (wasted). 99.6% of cells are dark blue. "You are paying for 256×256=65,536 cells to get 3 useful cells of resolution."

Then show the compute time scaling: as front sharpness increases (lower diffusivity), the front gets thinner. To maintain resolution: uniform grid must be made finer. Cost scales as $O(N^3)$ in 2D (N cells × N cells × N timesteps from CFL condition). Plot: for 10× sharper front, compute time grows 1000×. AMR: grows only 10× (because only the front gets 10× more cells; the rest stay coarse).

---

## Why It Broke — The Physics

**The resolution mismatch:** Most PDEs of physical interest have solutions with **multiple scales**: sharp layers (shocks, boundary layers, chemical reaction fronts) embedded in smooth background fields. The uniform grid must resolve the finest scale *everywhere*, even where only the coarse scale matters.

**Courant-Friedrichs-Lewy (CFL) condition:** Explicit time-stepping methods require $\Delta t \leq C \cdot \Delta x / v_{max}$ for stability (CFL number $C \leq 1$). Refining the entire grid by 2× reduces $\Delta x$ by 2× and thus $\Delta t$ must also halve. In 2D: 2× finer grid = $2^2$ = 4× more cells × $2×$ more timesteps = $8×$ more compute. Cost scales as $O(N^3)$ in 2D.

**Conservative flux balance:** Numerical methods for hyperbolic PDEs (advection, Euler equations) discretize the conservation law in integral form:
$$\frac{d}{dt}\int_\Omega u \, d\Omega + \oint_{\partial\Omega} \mathbf{F}(u) \cdot \hat{n} \, dS = 0$$

Choosing $\Omega$ as a single cell: the cell average $\bar{u}$ evolves via flux in/out through cell faces. For AMR, **fluxes must match exactly** at refinement boundaries: the flux computed by a fine-grid face must equal the sum of fluxes computed by the corresponding coarse-grid face. If they don't match, mass/momentum/energy is created/destroyed at refinement boundaries — a conservation error that grows with time.

**Error estimation:** To decide *where* to refine, we need to estimate the local truncation error. The most reliable approach: **Richardson extrapolation** — run the same simulation on a fine grid and a coarse grid, compare their solutions. The difference at each cell estimates the error. Cheaper (and often adequate): use gradient-based indicators — cells where $|\nabla u| \cdot \Delta x$ exceeds a threshold get refined. Sharp gradients = large variation within one cell = poor resolution.

---

## The One Concept

**Adaptive Mesh Refinement (AMR)** dynamically adjusts cell sizes to concentrate computational effort where the solution has significant structure (large gradients, sharp features), and coarsens the mesh where the solution is smooth.

**Grid hierarchy:** An AMR grid is a tree of nested grids (quadtree in 2D, octree in 3D). Level 0 is the coarsest base grid. Level 1 refines each base cell into 2×2 (in 2D) fine cells. Level $l$ cells are $2^l$ times finer than the base cell. The hierarchy can be:
- **Cell-based (Berger-Colella):** Each refinement level consists of rectangular "patches" of uniform fine cells. Patches can overlap and be arranged freely. Used in the Chombo and BoxLib frameworks.
- **Tree-based (quadtree/octree):** Each cell is subdivided individually. Simple data structure, arbitrary refinement patterns. Used in p4est, AMReX.

**Refinement criteria:** Cells are flagged for refinement when a local indicator exceeds a threshold. Common indicators:
- **Gradient indicator:** $\eta_i = |\nabla u_i| \cdot h_i / u_{ref}$ (normalized gradient times cell size). Physical interpretation: how much does the solution vary across one cell?
- **Richardson extrapolation error:** Compare fine- and coarse-grid solutions: $\epsilon_i = |u_h - u_{2h}|$. More accurate but requires two solves.
- **Feature-based:** Detect shocks via $\nabla \cdot v < -\epsilon$ (negative divergence = compression = shock). Detect interfaces via $|\nabla c|$ (concentration gradient).

**Conservative flux matching at interfaces:** At a coarse-fine interface, the fine-grid cells border a single coarse-grid cell. The rule:
1. Fine cells compute their fluxes normally
2. Coarse cell flux at the interface face is **replaced** by the average of the fine fluxes: $F_{coarse} = \frac{1}{r^{d-1}} \sum_{fine} F_{fine}$ where $r$ is the refinement ratio (typically 2) and $d$ is dimension. This ensures conservation exactly.

```javascript
// Flux matching at a coarse-fine interface (1D refinement ratio 2)
function refluxCorrection(coarseFlux, fineFluxes) {
  // fineFluxes: two fine-grid fluxes at the same coarse face
  const avgFineFlux = (fineFluxes[0] + fineFluxes[1]) / 2;
  // Replace the coarse flux with the average fine flux
  return avgFineFlux;
}
```

**Time subcycling:** Fine-grid cells take smaller timesteps (CFL requires $\Delta t_{fine} = \Delta t_{coarse} / r$). The fine grid takes $r$ timesteps for every coarse timestep. This maintains CFL stability on all levels simultaneously. After the fine grid completes its sub-cycle, the reflux correction updates the coarse grid cells at the boundary.

**Real-world examples:**
- **FLASH code (cosmological simulations):** AMR is used to simulate the formation of galaxy clusters. Regions of high density (forming galaxies) are refined to sub-parsec scales while the void regions between them are represented by parsec-scale cells. 12 levels of refinement = 2¹² = 4,096× resolution difference.
- **Hurricane simulation:** NOAA's Hurricane WRF model uses AMR to focus high resolution on the hurricane eye wall (1 km resolution) while representing the surrounding environment at 9 km. Enables real-time operational forecasting.
- **Combustion in engines:** Flame fronts (thin reactive layers) are tracked with fine cells; unburned/burned regions are coarse. Used by Convergent Science (CONVERGE software) for automotive engine design.
- **Gravitational wave simulation:** Binary black hole mergers are simulated with AMR to resolve the near-field spacetime curvature (fine cells near each black hole) while the far-field gravitational wave propagation uses coarse cells.

---

## The Fix

Complete 2D AMR with quadtree refinement:

```javascript
class AMRCell {
  constructor(x, y, dx, dy, level, maxLevel) {
    this.x = x; this.y = y;
    this.dx = dx; this.dy = dy;
    this.level = level;
    this.maxLevel = maxLevel;
    this.value = 0;        // solution value (cell average)
    this.children = null;  // null if leaf, array of 4 if refined
    this.fluxN = 0; this.fluxS = 0; // accumulated fluxes (reflux)
    this.fluxE = 0; this.fluxW = 0;
  }

  isLeaf() { return this.children === null; }

  refine() {
    if (this.level >= this.maxLevel) return;
    const hdx = this.dx / 2, hdy = this.dy / 2;
    this.children = [
      new AMRCell(this.x,       this.y,       hdx, hdy, this.level+1, this.maxLevel),
      new AMRCell(this.x+hdx,   this.y,       hdx, hdy, this.level+1, this.maxLevel),
      new AMRCell(this.x,       this.y+hdy,   hdx, hdy, this.level+1, this.maxLevel),
      new AMRCell(this.x+hdx,   this.y+hdy,   hdx, hdy, this.level+1, this.maxLevel),
    ];
    // Initialize children from parent (piecewise constant projection)
    this.children.forEach(c => c.value = this.value);
  }

  coarsen() {
    if (!this.children) return;
    // Average children back to parent (volume-weighted for conservation)
    this.value = this.children.reduce((s, c) => s + c.value, 0) / 4;
    this.children = null;
  }

  gradientIndicator() {
    // Normalized gradient using neighboring cells (simplified: use variance of children)
    if (!this.children) return 0;
    const vals = this.children.map(c => c.value);
    const mean = vals.reduce((s,v)=>s+v,0)/4;
    return Math.sqrt(vals.reduce((s,v)=>s+(v-mean)**2,0)/4) / (Math.abs(mean)+1e-10);
  }
}

class AMRGrid {
  constructor(N_base, maxLevel, refineTol = 0.1, coarsenTol = 0.01) {
    this.maxLevel = maxLevel;
    this.refineTol = refineTol;
    this.coarsenTol = coarsenTol;
    const dx = 1.0 / N_base;
    this.roots = [];
    for (let j = 0; j < N_base; j++)
      for (let i = 0; i < N_base; i++)
        this.roots.push(new AMRCell(i*dx, j*dx, dx, dx, 0, maxLevel));
  }

  adapt(criterion) {
    // Refine flagged cells, coarsen cells with small indicators
    this.forEachLeaf(cell => {
      const indicator = criterion(cell);
      if (indicator > this.refineTol) cell.refine();
    });
    this.forEachLeaf(cell => {
      const indicator = criterion(cell);
      if (indicator < this.coarsenTol && cell.level > 0) {
        // Coarsen by finding parent and averaging siblings (simplified)
      }
    });
  }

  forEachLeaf(fn) {
    const traverse = (cell) => {
      if (cell.isLeaf()) fn(cell);
      else cell.children.forEach(traverse);
    };
    this.roots.forEach(traverse);
  }
}
```

---

## The Wow Moment — Push It

**Demo: Shock tube (Sod problem) with AMR tracking the shock and contact discontinuity.** The Sod shock tube has three distinct features: a shock (very sharp), a contact discontinuity (sharp), and a rarefaction fan (smooth). AMR automatically assigns fine cells to the shock (5 levels of refinement = 32× finer), medium cells to the contact (3 levels), and coarse cells to the rarefaction and uniform regions.

Show the grid hierarchy as an overlay: the cell boundaries visible at different sizes. The shock region looks like a city (tiny cells), the smooth region like farmland (huge cells). As the shock moves, the fine-cell patch tracks it — refinement moving with the flow feature.

Total cells: 200 (AMR) vs. 6,400 (uniform for same shock resolution). "32× fewer cells. Same shock resolution. Same accuracy. Welcome to adaptive computation."

Then: inject a second discontinuity (a reflected shock). AMR immediately detects it, refines around it, and tracks two independently moving fine-cell patches. The coarse background carries almost no cost.

---

## The Interactive Demo

The viewer gets a canvas with a 2D scalar field simulation using AMR:

- **Problem** (dropdown): Advecting front | Shock tube (1D) | 2D Kelvin-Helmholtz instability | Concentration front | Blast wave
- **Max refinement level** (slider, 0–6): Level 0 = uniform. Level 6 = 64× finer cells at features.
- **Refinement threshold** (slider, 0.01–1.0): Lower = more aggressive refinement. Higher = sparser grid.
- **Coarsening threshold** (slider, 0.001–0.5): Controls how quickly smooth regions coarsen.
- **Show grid** (toggle): Renders cell boundaries — see the quadtree structure
- **Show refinement indicator** (toggle): Color cells by gradient indicator value — shows why cells are refined
- **Show level colors** (toggle): Color each cell by its refinement level (0=blue, max=red) — makes the hierarchy visually obvious
- **Show fluxes** (toggle): Arrows on cell faces proportional to flux magnitude — coarse-fine flux matching visible
- **Uniform comparison** (split screen toggle): Left = AMR, right = uniform grid at coarsest level — watch quality difference
- **Cell count display**: Live count of total cells vs. equivalent uniform grid cells — the savings visible in real time
- **Animate flow** (button): Adds a background advection velocity — watch fine-cell patches track the moving features

---

## Production Notes

**Code structure:**
- `amr_cell.js`: `AMRCell` class (quadtree node) with refine/coarsen/value storage
- `amr_grid.js`: `AMRGrid` class with global adapt, time-stepping, conservative flux accumulation
- `advection_solver.js`: First-order upwind and second-order (MUSCL) advection within each cell; reflux correction at interfaces
- `render_amr.js`: Render function that walks the quadtree and draws cells with level-based color or solution colormap
- `main.js`: Animation loop, UI, cell count tracker

**Visual layout:**
- Black background, warm grid lines
- Main panel: AMR grid rendered as filled rectangles — each cell a colored square, small cells visible at features, large cells elsewhere
- Top right: cell count vs. equivalent uniform count (e.g., "AMR: 1,240 cells | Uniform equiv: 65,536 cells — 53× savings")
- Bottom: Time slider, play/pause
- Side panel (when comparison mode on): Uniform grid at coarsest resolution — noticeably diffuse/smeared compared to AMR

**Key cinematic moments:**
1. (0:55) Show the activity map of the uniform grid: 99.6% dark blue (idle), 0.4% red (active). "You are paying for 65,000 cells to do the work of 3."
2. (2:40) First AMR adaptation step: the grid "breathes" — cells at the front split into four smaller cells, cells far from the front merge. The hierarchy forms in real time.
3. (4:15) Side-by-side: AMR with 1200 cells vs. uniform at same fine-cell resolution (65,536 cells). AMR is 54× cheaper. "Same answer. 54× fewer operations."
4. (6:00) Shock tube: the fine-cell patch moves with the shock. Slow-motion zoom into the refinement boundary — show how individual fluxes match across the coarse-fine interface.
5. (8:30) Blast wave AMR: an explosion expands outward. The fine-cell ring tracks the shock front perfectly — a donut-shaped ring of tiny cells in a sea of large cells. The donut grows outward as the shock expands. Visually striking.

**Equations to render on canvas:**
- Refinement indicator: $\eta_i = |\nabla u| \cdot h_i$ (gradient times cell size)
- CFL condition: $\Delta t_{fine} = \Delta t_{coarse} / r$ (time subcycling)
- Conservative reflux: $F_{coarse} = r^{-(d-1)} \sum F_{fine}$ (flux matching)

---

## Tags
`AMR` `adaptive-mesh` `refinement` `grid-hierarchy` `conservation` `computational-fluid-dynamics` `canvas` `numerical-methods`

---

## Thumbnail

Black background. A 2D AMR grid visualized — large grey cells in the corners and edges (smooth regions), tiny colorful cells along a diagonal feature (a shock or front). The small cells glow in a viridis heat map (yellow/green at the front). Large white text: "ADAPTIVE MESH REFINEMENT" at top. Below: "53× fewer cells. Same accuracy." in yellow. A tiny cell-size comparison inset: "Fine cells" (tiny square) vs "Coarse cells" (big square). Bottom: "CodedLaws" branding.
