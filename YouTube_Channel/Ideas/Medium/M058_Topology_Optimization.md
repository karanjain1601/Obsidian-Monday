---
title: "Growing the Optimal Structure (Topology Optimization)"
id: M058
difficulty: 6.5/10
prereq: "M057"
concept: "SIMP (Solid Isotropic Material with Penalization): each element has density ρ ∈ [0,1]; stiffness E(ρ) = ρ^p·E₀; minimize compliance C = u^T·K·u subject to volume fraction constraint; sensitivity-based update."
tags: [topology-optimization, SIMP, FEM, structural-optimization, compliance, sensitivity, canvas, structural-mechanics]
category: medium
type: video-idea
---

# Growing the Optimal Structure (Topology Optimization)

**Alt title:** "How Algorithms Design Better Structures Than Engineers (Topology Optimization)"
**Difficulty:** 6.5/10 | **Prereq:** M057 (FEM Introduction)

---

## Opening Hook (0:00–1:00)

Canvas: a large rectangular design domain, fixed on the left, loaded at the bottom-right corner. Question: where should you put the material?

Narrator: "You need a bracket to hold a load. You have a maximum amount of material — say, 40% of the design space. Where do you put it? Intuition says: a diagonal strut. An engineer says: maybe add a rib here. What does mathematics say?"

Start with 100% material: solid block. Compute the stiffness — it's maximum, but wasteful. Start with 40% material: random noise — terrible stiffness, the structure falls apart.

"What if we let an algorithm decide where to put the material? Not using machine learning, not using random search — using calculus. The gradient of stiffness with respect to material placement, at every single element simultaneously."

Hit a button. The display starts evolving. Grey squares appear and disappear across the mesh. After 50 iterations, a skeletal structure has grown: two graceful diagonals and a horizontal strut, like a two-dimensional bridge truss. "The algorithm found the answer. And it's different from what any engineer would have drawn by hand. Stiffer. Less material. Mathematically optimal."

---

## The Naive Attempt

The naive approach: gradient-free optimization — just try random configurations and keep the best.

```javascript
// Random material placement with volume constraint
function randomTopology(numElements, volumeFraction) {
  const rho = new Float64Array(numElements).fill(0);
  // Randomly fill 40% of elements
  const nSolid = Math.round(numElements * volumeFraction);
  const indices = Array.from({length: numElements}, (_, i) => i);
  shuffle(indices);
  indices.slice(0, nSolid).forEach(i => rho[i] = 1);
  return rho;
}

function compliance(rho, nodes, elements, loads, fixedDOFs, E0, nu) {
  // Compute stiffness with current density
  const K = assembleFEM_withDensity(nodes, elements, rho, E0, nu);
  const u = solveFEM(K, loads, fixedDOFs);
  return dotProduct(loads, u); // C = f^T * u = u^T * K * u
}

// Monte Carlo: evaluate 1000 random topologies, keep best
let bestRho = null, bestC = Infinity;
for (let trial = 0; trial < 1000; trial++) {
  const rho = randomTopology(elements.length, 0.4);
  const C = compliance(rho, nodes, elements, loads, fixedDOFs, 200e9, 0.3);
  if (C < bestC) { bestC = C; bestRho = rho.slice(); }
}
```

The result: a jagged, disconnected mess. The best random topology out of 1000 tries has stiffness about 30× worse than the optimal. With 500 elements and a binary (solid/void) assignment, there are $2^{500}$ possible topologies — more than the number of atoms in the observable universe. Random search is hopeless.

"We need the gradient. We need to know, for each element, whether adding material there increases or decreases compliance. With N=500 elements, we'd need 500 FEM solves for finite differences. That's too slow. But the adjoint method (M060) gives us all N sensitivities in *one* solve. Let's use it."

---

## The Moment of Failure

Exact visual: the Monte Carlo result after 1000 iterations is shown as a density map (dark = solid, white = void). It looks like a random chessboard — disconnected fragments everywhere, no load path from the applied force to the fixed support. Compliance number: "C = 847 N·m". Then show the SIMP-optimized result: a clean, arch-truss structure. "C = 28 N·m". A 30× difference.

Zoom into the random result: there are islands of solid material in the upper-left corner that are completely surrounded by void. They carry zero stress. They are wasted material. The algorithm has no mechanism to move them to a useful location.

"The fundamental problem: a zero-order method cannot find the gradient, and without the gradient, you are blind in a 500-dimensional space. The SIMP method uses calculus to navigate that space with perfect directional information."

---

## Why It Broke — The Physics

**Topology optimization problem statement:**
$$\min_{\rho \in [0,1]^N} C(\rho) = \mathbf{u}^T \mathbf{K}(\rho) \mathbf{u}$$
$$\text{subject to: } \mathbf{K}(\rho)\mathbf{u} = \mathbf{f}, \quad \sum_{e=1}^{N} \rho_e v_e \leq V^*$$

where $C$ is **compliance** (inverse stiffness — high compliance = floppy structure), $\rho_e \in [0,1]$ is the material density of element $e$, and $V^*$ is the maximum allowed total volume.

**Why compliance and not strength?** Compliance $C = \mathbf{f}^T \mathbf{u}$ is a scalar function of the entire displacement field. Its derivative with respect to $\rho_e$ can be computed with a single adjoint solve (and for compliance specifically, the adjoint is identical to the forward solve). Minimizing compliance maximizes stiffness — the structure deforms as little as possible.

**The 0/1 problem:** If $\rho_e \in \{0,1\}$, this is a combinatorial (NP-hard) problem. The SIMP relaxation allows $\rho_e \in [0,1]$ — a continuous variable. The penalization discourages intermediate densities.

**SIMP interpolation:**
$$E(\rho_e) = \rho_e^p \cdot E_0$$

For $p = 1$: linear — intermediate densities are realistic. For $p = 3$ (standard): intermediate densities have stiffness $\rho_e^3 E_0$ — much lower than the fraction $\rho_e$ of their mass would justify. This *penalizes* the grey intermediate densities: the algorithm prefers to go to 0 or 1 to avoid this stiffness penalty.

**Compliance sensitivity:**
$$\frac{\partial C}{\partial \rho_e} = -p \rho_e^{p-1} E_0 \, \mathbf{u}_e^T \mathbf{k}_0 \mathbf{u}_e$$

where $\mathbf{u}_e$ is the element displacement vector and $\mathbf{k}_0$ is the element stiffness matrix at unit density. Interpretation: elements with high strain energy density ($\mathbf{u}_e^T \mathbf{k}_0 \mathbf{u}_e$ large) should gain material; elements with low strain energy should lose material.

---

## The One Concept

**The SIMP Topology Optimization Algorithm** iteratively redistributes material to maximize structural stiffness for a given volume budget.

**Algorithm (99-line classic of Sigmund, 2001):**
```
Initialize: ρ_e = V* / |Ω| (uniform density = volume fraction)
Repeat until convergence:
  1. FEM solve: K(ρ) u = f
  2. Compute sensitivities: dc_e = -p * ρ_e^{p-1} * E0 * u_e^T k0 u_e
  3. Filter sensitivities (avoid checkerboard instability)
  4. Update densities via optimality criteria (OC) update
  5. Check convergence: max |ρ_new - ρ_old| < 0.01
```

**Optimality criteria (OC) update rule:** A heuristic but effective gradient-based update:
$$\rho_e^{new} = \begin{cases} \max(\rho_{min}, \rho_e - m) & \text{if } \rho_e B_e^{\eta} \leq \max(\rho_{min}, \rho_e - m) \\ \min(1, \rho_e + m) & \text{if } \rho_e B_e^{\eta} \geq \min(1, \rho_e + m) \\ \rho_e B_e^{\eta} & \text{otherwise} \end{cases}$$

where $B_e = -\partial C/\partial \rho_e / (\lambda \partial V/\partial \rho_e)$ is the ratio of compliance sensitivity to volume sensitivity. $\lambda$ is a Lagrange multiplier for the volume constraint, found by bisection. $\eta = 0.5$ is a numerical damping factor. $m = 0.2$ is a move limit.

**Sensitivity filtering (checkerboard suppression):** Without filtering, the optimizer finds a "checkerboard" pattern — alternating solid and void elements — as a numerical artifact of the bilinear quad elements. Fix: replace each element's sensitivity with a weighted average of nearby elements:
$$\hat{dc}_e = \frac{\sum_{f \in B_e(r)} w_{ef} \rho_f dc_f}{\rho_e \sum_{f \in B_e(r)} w_{ef}}$$

where $w_{ef} = r - \text{dist}(e, f)$ is a linear weight over a filter radius $r$. This is a spatial low-pass filter on the sensitivity field. Alternatively, apply density filtering (Bruns & Tortorelli, 2001) which is more principled.

**Topology vs. size/shape optimization:**
- **Size optimization:** Fix the shape, optimize dimensions (thickness, cross-section). Convex, easy.
- **Shape optimization:** Fix the connectivity, optimize the boundary shape. Smooth, gradient-based.
- **Topology optimization:** The connectivity itself is the design variable. Most general, most powerful. Can discover arches, trusses, and cantilevers automatically.

**Real-world examples:**
- **Airbus A380 wing rib:** The cabin-floor-to-wing-box bracket on the A380 was topology-optimized. The result looks organic — like a bone cross-section. Saved 500 kg per aircraft.
- **Additive manufacturing:** Topology optimization + 3D printing is the perfect pairing. The organic lattice structures that topology optimization produces cannot be machined but can be printed. Used for satellite brackets, hip implants, car wheel hubs.
- **GE Aviation jet engine bracket:** 2014 GE challenge — topology-optimized jet engine bracket from titanium, 84% lighter than the original machined part, still passed all structural tests.
- **NASA asteroid redirect mission:** Truss structures for spacecraft are topology-optimized to minimize mass under launch vibration loads and in-space thermal loads simultaneously.

---

## The Fix

Full SIMP topology optimization in JavaScript (~150 lines):

```javascript
class TopologyOptimizer {
  constructor(mesh, E0, nu, penal = 3.0, volfrac = 0.4, rmin = 1.5) {
    this.mesh = mesh;      // {nodes, elements, loads, fixedDOFs}
    this.E0 = E0;          // full material stiffness
    this.Emin = E0 * 1e-9; // void stiffness (avoid singularity)
    this.nu = nu;
    this.penal = penal;    // SIMP penalty factor
    this.volfrac = volfrac; // volume fraction target
    this.rmin = rmin;       // filter radius (element units)
    this.nEl = mesh.elements.length;
    // Initialize density uniformly
    this.rho = new Float64Array(this.nEl).fill(volfrac);
    this.precomputeFilterWeights();
    this.precomputeElementK0(); // unit-stiffness element matrices
  }

  step() {
    // 1. FEM solve with current densities
    const E_rho = this.rho.map(r => this.Emin + Math.pow(r, this.penal) * (this.E0 - this.Emin));
    const K = assembleFEM(this.mesh.nodes, this.mesh.elements, E_rho, this.nu);
    const u = solveFEM(K, this.mesh.loads, this.mesh.fixedDOFs);

    // 2. Compute compliance and sensitivities
    let compliance = 0;
    const dc = new Float64Array(this.nEl);
    for (let e = 0; e < this.nEl; e++) {
      const ue = getElementDisplacements(u, this.mesh.elements[e]);
      const strain_energy = dot(ue, matVecMul(this.k0[e], ue));
      compliance += E_rho[e] * strain_energy;
      // dC/dρ_e = -p * ρ^{p-1} * (E0 - Emin) * u_e^T k0 u_e
      dc[e] = -this.penal * Math.pow(this.rho[e], this.penal - 1)
               * (this.E0 - this.Emin) * strain_energy;
    }

    // 3. Filter sensitivities
    const dc_filt = this.filterSensitivities(dc, this.rho);

    // 4. OC update with bisection for Lagrange multiplier
    const rho_new = this.ocUpdate(dc_filt);

    // 5. Check convergence
    const change = Math.max(...rho_new.map((r, i) => Math.abs(r - this.rho[i])));
    this.rho = rho_new;
    return { compliance, change };
  }

  ocUpdate(dc) {
    let l1 = 0, l2 = 1e9, move = 0.2;
    const rho_new = new Float64Array(this.nEl);
    while ((l2 - l1) / (l2 + l1) > 1e-3) {
      const lmid = 0.5 * (l1 + l2);
      for (let e = 0; e < this.nEl; e++) {
        const Be = Math.sqrt(-dc[e] / lmid);
        rho_new[e] = Math.min(
          Math.min(1.0, this.rho[e] + move),
          Math.max(Math.max(0.001, this.rho[e] - move), this.rho[e] * Be)
        );
      }
      const vol = rho_new.reduce((s, r) => s + r, 0) / this.nEl;
      (vol > this.volfrac) ? (l1 = lmid) : (l2 = lmid);
    }
    return rho_new;
  }
}
```

---

## The Wow Moment — Push It

**Demo: Multi-load-case optimization + manufacturing constraints.** Run topology optimization for three different load cases simultaneously (diagonal load, vertical load, horizontal load). The optimizer minimizes the sum of compliances — a structure that is stiff under all three loads at once.

Result: a more symmetric, robust structure that no single-load-case optimizer would have found.

Then apply **manufacturing constraints**: minimum length scale filter (ensures no feature is smaller than the printer nozzle diameter), symmetry constraint (left-right mirror), and an overhang constraint (no overhanging features beyond 45° — required for SLA 3D printing without supports). Watch the structure change shape to satisfy these constraints while still trying to be stiff. It becomes slightly less optimal but manufacturable.

Finally: **animated growth**. Instead of showing the final result, render each iteration frame — density evolving from uniform grey, gradually forming clear structure. Speed it up: 50 iterations in 5 seconds. The structure appears to *grow* like a crystalline lattice, solidifying from grey mist into a clean, elegant truss. This 5-second animation is the most shareable clip of the entire channel.

---

## The Interactive Demo

The viewer gets a canvas with a design domain and full SIMP optimizer:

- **Domain shape** (dropdown): Rectangle | L-shape | Bridge span | Arch | Custom draw
- **Volume fraction** (slider, 0.1–0.9, default 0.4): Change target material use; watch structure thin/thicken
- **Load placement** (click and drag on boundary): Direction and magnitude of applied traction
- **Support placement** (click on boundary): Fix nodes; supports shown as triangular ground symbols
- **SIMP penalty p** (slider, 1–5, default 3): p=1 → greyscale result (all intermediate densities). p=5 → crisp black/white result but harder convergence.
- **Filter radius r_min** (slider, 0.5–5, default 1.5): Small r → checkerboard artifacts. Large r → over-smoothed, thick members.
- **Run/Pause/Step** buttons: Step one iteration at a time for education; run continuously for full optimization
- **Color mode** (dropdown): Density | Von Mises stress | Sensitivity | Displacement
- **Convergence plot** (side panel): Compliance vs. iteration number, volume fraction vs. iteration
- **Manufacturing constraint** (dropdown): None | Minimum length scale | Left-right symmetry | Overhang limit 45°
- **Export** (button): Download current density field as PNG or SVG outline for 3D printing

---

## Production Notes

**Code structure:**
- `fem2d.js`: FEM solver from M057, modified to accept per-element stiffness
- `topoopt.js`: `TopologyOptimizer` class with SIMP, OC update, sensitivity filter
- `mesh_rect.js`: Fast rectangular mesh generator (rows × cols quad elements, split into triangles or true quads)
- `render.js`: Density → grayscale/viridis color map; contour extraction for manufacturing constraint viz
- `main.js`: Animation loop, UI, convergence plot

**Visual layout:**
- Black background engineering aesthetic
- Main panel: design domain with density color (dark grey = solid, near-white = void, light grey = intermediate)
- Color bar on right: density 0–1 scale
- Top right: compliance value (decreasing = good) and volume fraction (should stay at target)
- Bottom: convergence graph — compliance curve descending rapidly then leveling off
- Iteration counter in top left

**Key cinematic moments:**
1. (1:30) Monte Carlo random result vs. SIMP result side by side — "30× stiffer. Same material. That's what calculus buys you."
2. (3:45) Slow down iteration 1–10: initial uniform grey field breaks into faint striations, then clearer members, then distinct topology. "The gradient is speaking. Listen."
3. (5:00) Show the sensitivity field as a color map — bright red elements are screaming to gain material, dark blue elements are wasting space. "This is the gradient. One FEM solve gives you the gradient for 500 variables simultaneously."
4. (7:20) Change volume fraction from 40% to 20%: watch material strip away, leaving only the highest-priority load path — a single diagonal strut. "This is the Pareto front of stiffness vs. mass."
5. (9:30) The 50-iteration animated growth at speed — the defining visual of the video.

**Equations to render on screen:**
- $E(\rho_e) = \rho_e^p E_0$ (SIMP — highlight the $p$ exponent)
- $\frac{\partial C}{\partial \rho_e} = -p \rho_e^{p-1} E_0 \, \mathbf{u}_e^T \mathbf{k}_0 \mathbf{u}_e$ (sensitivity formula)
- $\min C(\rho)$ subject to $\sum \rho_e v_e \leq V^*$ (optimization problem)

---

## Tags
`topology-optimization` `SIMP` `FEM` `structural-optimization` `compliance` `sensitivity` `canvas` `structural-mechanics`

---

## Thumbnail

Black background. Left half: a solid grey rectangle (brute force — labelled "ENGINEER'S GUESS"). Right half: an elegant bone-like optimized truss structure in white on black, with a neon orange glow — the topology-optimized result. An arrow points from left to right labelled "ALGORITHM". Bold text: "GROWING THE PERFECT STRUCTURE" in white. Subtitle: "Topology Optimization from scratch" in yellow. A small badge: "84% lighter" in green — referencing the GE jet bracket.
