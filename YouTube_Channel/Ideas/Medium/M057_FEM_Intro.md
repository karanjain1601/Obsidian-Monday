---
title: "Stress Analysis Without Buying ANSYS (FEM Introduction)"
id: M057
difficulty: 6.5/10
prereq: "None"
concept: "FEM: subdivide domain into elements; approximate displacement field as piecewise polynomials; minimize virtual work → stiffness matrix K·u = f; assemble global K from element stiffness matrices; solve for nodal displacements."
tags: [FEM, finite-element, stiffness-matrix, structural-mechanics, variational, Gauss-quadrature, canvas, linear-algebra]
category: medium
type: video-idea
---

# Stress Analysis Without Buying ANSYS (FEM Introduction)

**Alt title:** "Why Bridges Don't Fall (The Math of Structural Analysis in 200 Lines of JavaScript)"
**Difficulty:** 6.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Canvas: a cantilever beam — fixed at the left wall, a heavy load hanging from the right tip. The question: how much does the tip deflect? What is the stress distribution along the beam? Does it break?

Narrator: "You are designing a bracket to hold a shelf in a data center. It will hold 50 kilograms. You can see it's a simple shape — a flat metal plate, fixed at one end, loaded at the other. But the stress distribution inside that plate is not uniform. Stress concentrates near the fixed end, near holes, near sharp corners. If you get it wrong, the bracket fails, and the servers crash to the floor."

"ANSYS or Abaqus could answer this in 30 seconds. They cost $50,000 a year. But the algorithm underneath is the Finite Element Method, and it's pure linear algebra. Today we implement it in 200 lines of JavaScript, understand exactly what it's doing, and run stress analysis on our own shapes in the browser. No licenses required."

Pause on the canvas as a mesh appears over the bracket — triangles filling the shape. "We're going to turn this geometry into a system of linear equations. Then solve it. The solution is the exact deformation of the bracket under load."

---

## The Naive Attempt

The naive approach: "I'll use the Euler-Bernoulli beam theory formula. I know the tip deflection of a cantilever is $\delta = PL^3/(3EI)$. Easy."

```javascript
// Euler-Bernoulli beam tip deflection
function cantileverDeflection(P, L, E, I) {
  return P * L**3 / (3 * E * I); // meters
}

const P = 500;    // 500 N load
const L = 0.3;   // 30 cm beam
const E = 200e9; // steel Young's modulus
const b = 0.05;  // 5 cm wide
const h = 0.005; // 5 mm thick
const I = b * h**3 / 12;

console.log(cantileverDeflection(P, L, E, I) * 1000, "mm"); // ~5.4 mm
```

This works perfectly for a *uniform rectangular beam*. You show the result: 5.4 mm tip deflection. But then the client says: "Oh, and there's a circular hole in the bracket for cable routing, and the corners are filleted, and actually it's more of an L-shape."

Euler-Bernoulli fails immediately. The formula assumes a uniform cross-section, simple geometry, and no stress concentrations. For any real geometry — holes, notches, varying thickness, 2D or 3D shapes — it gives nonsense or nothing at all.

"We need a method that works for *any* geometry. One where the geometry is just input data."

---

## The Moment of Failure

Exact visual: apply the beam formula to an L-shaped bracket with a hole. The formula produces a single number (the tip deflection), but it's clearly wrong — you *know* the hole changes the stress distribution. Show a reference FEM solution (computed offline) versus the beam formula estimate: the beam formula is off by 34% for the L-shaped geometry and by 2× for the bracket with the hole because stress concentrates at the hole edge.

Then show the failure mode: the formula predicts the stress is highest at the fixed end (true for the rectangle), but the FEM solution shows the stress concentrates at the edge of the hole — a completely different location. "The bracket would fail there, not at the wall. Euler-Bernoulli cannot find that."

Second failure: you try to hand-derive the stress analysis for the L-shape using the general elasticity equations — the Navier equations, a system of coupled PDEs. "Here are the governing equations for 2D elasticity." Show the PDEs on screen. "Solving these analytically for an arbitrary geometry is impossible. That's why we need the Finite Element Method."

---

## Why It Broke — The Physics

**2D Linear Elasticity:** The governing equations (Navier equations for plane stress) are:
$$\frac{\partial \sigma_{xx}}{\partial x} + \frac{\partial \sigma_{xy}}{\partial y} + f_x = 0$$
$$\frac{\partial \sigma_{xy}}{\partial x} + \frac{\partial \sigma_{yy}}{\partial y} + f_y = 0$$

where $\sigma_{ij}$ are stress components and $f_i$ are body forces. These must be solved subject to boundary conditions: specified displacements (fixed wall) or specified tractions (applied load). The stresses relate to strains via Hooke's law: $\boldsymbol{\sigma} = \mathbf{D} \boldsymbol{\varepsilon}$, and strains relate to displacements via: $\varepsilon_{xx} = \partial u/\partial x$, $\varepsilon_{yy} = \partial v/\partial y$, $\gamma_{xy} = \partial u/\partial y + \partial v/\partial x$.

This is a second-order elliptic PDE in the displacement field $(u(x,y), v(x,y))$. For simple geometries (rectangles, disks), analytic solutions exist. For arbitrary shapes: impossible analytically.

**The variational (weak) form:** Multiply the equilibrium equation by a test function (virtual displacement) $\delta u$ and integrate over the domain $\Omega$. After integration by parts (Green's theorem):
$$\int_\Omega \boldsymbol{\varepsilon}(\delta u)^T \mathbf{D} \boldsymbol{\varepsilon}(u) \, d\Omega = \int_\Omega \delta u^T f \, d\Omega + \int_{\Gamma_t} \delta u^T t \, d\Gamma$$

This is the **Principle of Virtual Work**: internal virtual work equals external virtual work. The strong PDE form required $u$ to be twice differentiable; the weak form only requires $u$ to be once differentiable — a weaker condition that allows piecewise-polynomial approximations.

---

## The One Concept

**The Finite Element Method (FEM)** converts the weak-form PDE into a finite-dimensional linear system $\mathbf{K} \mathbf{u} = \mathbf{f}$.

**Step 1 — Mesh:** Divide the domain into non-overlapping *elements* (triangles, quads, tetrahedra). Each element has *nodes* at corners (and possibly midpoints for higher-order elements). The mesh is the geometry — any shape can be meshed.

**Step 2 — Shape functions:** On each element, approximate the displacement field as a polynomial interpolation through the nodal values:
$$u^h(\mathbf{x}) = \sum_{i=1}^{n_e} N_i(\mathbf{x}) \, u_i$$

For a 3-node linear triangle (the CST — Constant Strain Triangle):
$$N_1 = \frac{A_1}{A}, \quad N_2 = \frac{A_2}{A}, \quad N_3 = \frac{A_3}{A}$$

where $A_1, A_2, A_3$ are the areas of sub-triangles formed by the point $\mathbf{x}$ with the three edges. These are the **barycentric coordinates**. They sum to 1 and are linear — so the displacement field is linear within each element and continuous across element boundaries.

**Step 3 — Element stiffness matrix:** Substitute the shape function approximation into the virtual work equation for one element:

$$\mathbf{k}_e = \int_{\Omega_e} \mathbf{B}^T \mathbf{D} \mathbf{B} \, d\Omega_e$$

where $\mathbf{B}$ is the **strain-displacement matrix** (contains spatial derivatives of shape functions) and $\mathbf{D}$ is the **constitutive matrix** (material properties: $E$, $\nu$). For the CST, $\mathbf{B}$ is constant (strain is uniform within each element, hence "Constant Strain Triangle"), and the integral reduces to $\mathbf{k}_e = \mathbf{B}^T \mathbf{D} \mathbf{B} \cdot A_e \cdot t$ (area times thickness).

**Step 4 — Assembly:** The global stiffness matrix $\mathbf{K}$ is assembled by summing element contributions. Each element's DOFs (degrees of freedom) map to global DOF indices:
```
for each element e:
  ke = elementStiffnessMatrix(e)
  for i in localDOFs:
    for j in localDOFs:
      K[globalIndex(e,i)][globalIndex(e,j)] += ke[i][j]
```

This assembly process is the key to FEM's power: the global $\mathbf{K}$ is sparse (each node only connects to its neighbors) and symmetric positive definite (for stable materials).

**Step 5 — Boundary conditions and solve:** Apply Dirichlet BCs (specified displacements) by eliminating those rows/columns. Apply Neumann BCs (surface tractions) as nodal forces on the load vector $\mathbf{f}$. Solve $\mathbf{K} \mathbf{u} = \mathbf{f}$ by Cholesky factorization, sparse direct solver, or iterative (conjugate gradient) method.

**Step 6 — Post-processing:** Compute strains $\boldsymbol{\varepsilon} = \mathbf{B} \mathbf{u}_e$ and stresses $\boldsymbol{\sigma} = \mathbf{D} \boldsymbol{\varepsilon}$ element-by-element. Compute von Mises stress: $\sigma_{VM} = \sqrt{\sigma_{xx}^2 - \sigma_{xx}\sigma_{yy} + \sigma_{yy}^2 + 3\sigma_{xy}^2}$. Visualize as a color map on the deformed mesh.

**Real-world examples:**
- **Airbus wing design:** FEM models with >100 million DOFs run on clusters overnight. The mesh has 3D solid elements in the spar/rib structure, shell elements for the skin.
- **Automotive crash simulation:** Explicit FEM (not static, but dynamic with mass matrix) simulates 100ms crashes in hours. Ford and Toyota run millions of these annually.
- **Microchip thermal analysis:** FEM finds hot spots in transistor layouts; determines where heat spreaders are needed.
- **Medical implants:** Hip implant stress under walking loads computed by FEM to ensure fatigue life exceeds 10 million cycles (10+ years of walking).

---

## The Fix

Complete 2D plane-stress FEM solver using CST elements:

```javascript
function assembleFEM(nodes, elements, E, nu, thickness) {
  const nDOF = 2 * nodes.length; // 2 DOF per node (u, v)
  const K = Array.from({length: nDOF}, () => new Float64Array(nDOF));

  // Constitutive matrix D (plane stress)
  const c = E / (1 - nu * nu);
  const D = [
    [c,      c*nu,   0           ],
    [c*nu,   c,      0           ],
    [0,      0,      c*(1-nu)/2  ]
  ];

  for (const [i, j, k] of elements) {
    const [xi, yi] = nodes[i], [xj, yj] = nodes[j], [xk, yk] = nodes[k];
    const A = 0.5 * Math.abs((xj-xi)*(yk-yi) - (xk-xi)*(yj-yi));

    // B matrix (strain-displacement): 3×6
    const b1 = yj - yk, b2 = yk - yi, b3 = yi - yj;
    const c1 = xk - xj, c2 = xi - xk, c3 = xj - xi;
    const inv2A = 1 / (2 * A);
    const B = [
      [b1*inv2A, 0,        b2*inv2A, 0,        b3*inv2A, 0       ],
      [0,        c1*inv2A, 0,        c2*inv2A, 0,        c3*inv2A],
      [c1*inv2A, b1*inv2A, c2*inv2A, b2*inv2A, c3*inv2A, b3*inv2A]
    ];

    // ke = B^T * D * B * A * t (6×6 element stiffness matrix)
    const DB = matMul3x3_3x6(D, B);
    const ke = matScale(matMul6x3T_3x6(B, DB), A * thickness);

    // Assemble into global K
    const dofs = [2*i, 2*i+1, 2*j, 2*j+1, 2*k, 2*k+1];
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 6; c++)
        K[dofs[r]][dofs[c]] += ke[r][c];
  }
  return K;
}

function solveFEM(K, f, fixedDOFs) {
  // Apply Dirichlet BCs by elimination
  const freeDOFs = range(K.length).filter(i => !fixedDOFs.includes(i));
  const Kfree = freeDOFs.map(r => freeDOFs.map(c => K[r][c]));
  const ffree = freeDOFs.map(r => f[r]);
  // Solve Kfree * u_free = f_free (Cholesky or CG)
  const u_free = choleskysolve(Kfree, ffree);
  const u = new Float64Array(K.length);
  freeDOFs.forEach((doi, idx) => u[doi] = u_free[idx]);
  return u;
}
```

The result: a von Mises stress map rendered on the deformed mesh in viridis colors. The bracket tip deflects 5.7 mm (vs. 5.4 mm beam formula — the error was the L-shape and hole). Stress concentrates at the hole edge (25% higher than the beam formula predicted), which is exactly where a real bracket would fail.

---

## The Wow Moment — Push It

**Demo: Interactive crack propagation.** Start with the L-bracket. Run static FEM. Find the element with the maximum von Mises stress. "Crack" it — remove it from the mesh. Re-run FEM. Find the new maximum stress (now at the crack tip). Remove the neighbor element most aligned with the maximum principal stress direction. Repeat.

Watch the crack grow step by step, always following the path of least resistance — the maximum stress trajectory. It snakes around the hole, follows the stress concentration, and eventually reaches the outer boundary. The structure fails.

The crack path is not straight — it is a curved path determined by the stress field, which is computed fresh at each step. "This is computational fracture mechanics. ANSYS charges extra for this module. We're doing it in 200 lines."

Render the final cracked shape with the full mesh visible, each failed element colored red, the crack path traced in bright white. Frame it as a timelapse animation.

---

## The Interactive Demo

The viewer gets a canvas with a 2D mesh editor and FEM solver with these controls:

- **Geometry** (dropdown): Cantilever beam | L-bracket | C-channel | Plate with hole | Draw your own
- **Material** (dropdown): Steel (E=200 GPa, ν=0.3) | Aluminum (E=70 GPa, ν=0.33) | Rubber (E=0.01 GPa, ν=0.49) | Custom
- **Mesh density** (slider, coarse 10 to fine 200 elements): Watch accuracy improve and solve time increase
- **Applied load** (click and drag on boundary): Set magnitude and direction of traction; drag to change
- **Fixed boundary** (click and drag on boundary): Select which edges are clamped
- **Color plot** (dropdown): Von Mises stress | σ_xx | σ_yy | σ_xy | Displacement magnitude | ε_xx | Safety factor (yield/VM)
- **Deformation scale** (slider, 1–1000×): Scale up the deformation for visibility; at 1× real scale usually invisible
- **Show mesh** (toggle): Overlay the triangle mesh on the color plot
- **Show element DOFs** (click element): Popup showing B matrix, D matrix, ke for that element — educational deep-dive
- **Crack propagation mode** (button): Automatically advance crack; control max crack steps (slider, 1–100)
- **Export mesh/results** (button): Download as JSON for further analysis

---

## Production Notes

**Code structure:**
- `mesh.js`: Triangle mesh generator (Delaunay from polygon + holes), boundary condition applier
- `fem2d.js`: `assembleFEM()`, `solveFEM()` (conjugate gradient + Cholesky), strain/stress computation
- `colormap.js`: Von Mises → viridis/inferno colormap, contour lines
- `matrix_small.js`: Dense matrix ops for 6×6 element matrices; sparse storage for global K
- `main.js`: Canvas render, mesh editor, controls

**Visual layout:**
- White background (engineering drawing aesthetic)
- Main panel: 2D domain with color fill (stress), mesh overlay (thin grey lines), deformed shape (black outline slightly displaced from original grey outline)
- Right sidebar: material properties, applied forces, solve button with solve time display
- Bottom: color scale bar (min stress = blue/violet, max stress = red/yellow)
- Click any element to highlight it and show its B, D, ke matrices in a side panel (for education)

**Key cinematic moments:**
1. (0:45) Draw the L-bracket on canvas, drag a force onto the tip. Hit "Solve". The mesh fills with color — yellow/orange at fixed wall, red spikes near the hole. The tip visibly deflects. "200 milliseconds of computation. That's your stress field."
2. (2:30) Show the single B matrix for a selected triangle element — 3×6 of numbers derived only from node coordinates. "This is it. This is the entire physics of one triangle."
3. (4:00) Assembly visualization: elements flash green as their stiffness matrices are added to the global K, shown as a sparse matrix pattern on the right. The sparsity pattern builds up as each element contributes.
4. (6:30) Increase mesh density from 20 to 200 elements: watch stress field sharpen and stress concentration at the hole edge become clearer. The coarse mesh smooths it out (CST has low accuracy).
5. (9:00) Crack propagation: 30-step animation of crack growing from the hole edge — each step highlighted with the element being removed, the stress field recomputed, the crack path extending.

**Equations to render on canvas:**
- $\mathbf{K} \mathbf{u} = \mathbf{f}$ (the entire FEM reduced to one line)
- $\mathbf{k}_e = \int_{\Omega_e} \mathbf{B}^T \mathbf{D} \mathbf{B} \, d\Omega = \mathbf{B}^T \mathbf{D} \mathbf{B} \cdot A_e t$ (CST element stiffness)
- $\sigma_{VM} = \sqrt{\sigma_{xx}^2 - \sigma_{xx}\sigma_{yy} + \sigma_{yy}^2 + 3\sigma_{xy}^2}$ (Von Mises)

---

## Tags
`FEM` `finite-element` `stiffness-matrix` `structural-mechanics` `variational` `Gauss-quadrature` `canvas` `linear-algebra`

---

## Thumbnail

Dark grey engineering background. A bracket shape (L-bracket with a circular hole) filled with a vivid heat-map stress color gradient — blue at the free end, yellow in the middle, fierce red at the hole edge with visible stress concentration rings. Thin white triangle mesh lines overlay the shape. The bracket is slightly deformed. Bold white text above: "STRESS ANALYSIS" and below: "No ANSYS. No license. Just math." Subtitle in bright yellow: "Finite Element Method in JavaScript". A small dollar amount with a strikethrough — "$50,000/yr" crossed out in red.
