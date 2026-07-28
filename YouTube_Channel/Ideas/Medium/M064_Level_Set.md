---
title: "Moving Boundaries Without Re-Meshing (Level Set Method)"
id: M064
difficulty: 6.5/10
prereq: "None"
concept: "Level set: φ(x,t) = signed distance to interface; interface is the zero level set {x: φ=0}; evolve ∂φ/∂t + v·∇φ = 0; curvature κ = ∇·(∇φ/|∇φ|); re-distance (reinitialize) φ to keep it a signed distance function."
tags: [level-set, interface-tracking, signed-distance, curvature, reinitalization, free-surface, canvas, implicit-surface]
category: medium
type: video-idea
---

# Moving Boundaries Without Re-Meshing (Level Set Method)

**Alt title:** "Simulating Shape Changes Without Tracking a Surface (Level Set Method)"
**Difficulty:** 6.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Canvas: two soap bubbles moving toward each other. On contact, they merge into one large bubble — topology changes. Now watch a water droplet falling and splitting into two droplets — another topology change. Now a growing crystal solidifying — its surface advancing into the melt and developing complex branching (dendritic) arms.

Narrator: "All three of these involve interfaces that change topology: two surfaces become one, one surface splits in two, a surface develops holes and branches. If you represent the interface as a mesh of triangles — the explicit approach — every topology change requires you to detect it, cut the mesh, re-stitch it, and re-mesh. It is a software nightmare."

"The level set method represents the interface implicitly: not as the surface itself, but as the zero contour of a scalar function $\phi(x,y,t)$. You move $\phi$ by solving one simple PDE. Topology changes happen for free — when a bubble merges, the zero contour of $\phi$ simply changes its connectivity. No re-meshing. No special cases. The mathematics handles it."

Show: a scalar field $\phi$ on a canvas, coloured by sign — blue where $\phi < 0$ (inside), yellow where $\phi > 0$ (outside). A white contour traces $\phi = 0$ — the interface. As $\phi$ evolves, the white contour moves. Where two $\phi < 0$ regions merge, the white contour disappears. No special code needed.

---

## The Naive Attempt

The naive approach: represent the interface explicitly as a set of marker points (Lagrangian tracking).

```javascript
// Lagrangian marker-point interface tracking
class MarkerInterface {
  constructor(centerX, centerY, radius, nMarkers = 64) {
    this.markers = Array.from({length: nMarkers}, (_, i) => ({
      x: centerX + radius * Math.cos(2 * Math.PI * i / nMarkers),
      y: centerY + radius * Math.sin(2 * Math.PI * i / nMarkers)
    }));
  }

  advect(velocityAt, dt) {
    // Move each marker by the local velocity
    this.markers = this.markers.map(m => {
      const {u, v} = velocityAt(m.x, m.y);
      return {x: m.x + u * dt, y: m.y + v * dt};
    });
  }

  render(ctx) {
    ctx.beginPath();
    this.markers.forEach((m, i) => {
      if (i === 0) ctx.moveTo(m.x, m.y);
      else ctx.lineTo(m.x, m.y);
    });
    ctx.closePath();
    ctx.stroke();
  }
}
```

Problems appear immediately:
1. **Marker bunching:** In a straining flow, markers on one part of the curve get pushed together and overlap (bunching), while markers on another part get stretched apart (rarefaction). The bunched region has redundant resolution; the rarefied region has no markers — the interface is undefined there.
2. **Tangling:** In a complex flow, the marker curve can develop self-intersections — the Lagrangian interface crosses itself, which is unphysical. No automatic detection or handling.
3. **Topology changes:** If the circle is being squeezed into a thin filament that eventually pinches off, the marker list has no mechanism to detect the pinch-off and split into two separate loops. You'd need custom detection and list manipulation code.

You try adding "reparameterization" to fix bunching: every N steps, redistribute markers evenly along the current curve. It helps, but for a complex flow with many topology changes, the algorithm fails catastrophically — markers tangle, the curve self-intersects, the simulation crashes.

---

## The Moment of Failure

Exact visual: run the Zalesak's disk test — a disk with a notch being rotated and sheared by a vortex field, then reversed back to the original position. The exact answer is the original disk shape.

Marker method: after 200 steps of forward vortex, markers have bunched near the notch and stretched near the rim. The notch edges have no markers — the interface there is undefined. After another 200 steps of reversed flow: the markers are in completely wrong positions — they accumulated errors from re-parameterization and bunching. The final shape looks like a deflated potato. Error: 40%.

Level set method (teaser): same test, perfect result — the disk returns to its original shape with the notch intact. Error: 2%.

Text on screen: "Marker methods are Lagrangian — they move with the fluid and accumulate errors. The level set method is Eulerian — the $\phi$ field is fixed to the grid, and the interface passes through it."

---

## Why It Broke — The Physics

**The fundamental difficulty of explicit interface tracking:** An explicit representation (marker points, triangle mesh) stores the surface directly. Advecting it in a complex flow creates two problems:
1. **Numerical diffusion and bunching:** Markers do not remain evenly distributed. In a straining flow, the arc length between markers changes at the rate $d(\delta s)/dt = \delta s \cdot (\mathbf{t} \cdot \nabla\mathbf{v} \cdot \mathbf{t})$ (tension times strain in the tangential direction). Exponential stretching in some regions, exponential compression in others — markers bunch and spread exponentially fast.
2. **Topology changes require combinatorial algorithms:** Detecting when a curve self-intersects or when two curves merge requires O(N²) intersection tests in the worst case, plus explicit re-topology operations (splitting loops, merging curves). This is complex code that fails on edge cases.

**Why the Eikonal equation and signed distance functions matter:** The level set method's power comes from $\phi$ being a *signed distance function*:
$$|\nabla \phi| = 1 \quad \text{everywhere}$$
$$\phi(\mathbf{x}) = \text{dist}(\mathbf{x}, \Gamma) \cdot \text{sgn}(\mathbf{x} - \Gamma)$$

where $\Gamma$ is the interface. Properties of signed distance functions that make computation easy:
- The **interface normal** $\mathbf{n} = \nabla\phi$ (always unit length since $|\nabla\phi|=1$)
- The **curvature** $\kappa = \nabla \cdot (\nabla\phi/|\nabla\phi|) = \nabla^2\phi$ (only valid when $|\nabla\phi|=1$)
- The **velocity extension** off the interface: $v(\mathbf{x}) = v(\mathbf{x}_{nearest})$ — extend the velocity from the interface to the whole domain in the normal direction

**The reinitialization problem:** Advecting $\phi$ with the level-set equation $\partial\phi/\partial t + \mathbf{v}\cdot\nabla\phi = 0$ does not preserve $|\nabla\phi|=1$. Over time, $\phi$ becomes distorted — neither a signed distance function nor anything simple. All the nice properties above break down. Solution: periodically "reinitialize" $\phi$ by solving the **Eikonal equation** $|\nabla\phi|=1$ with $\phi=0$ on the zero level set.

---

## The One Concept

**The Level Set Method** (Osher & Sethian, 1988) represents a moving interface $\Gamma(t)$ as the zero level set of a scalar function $\phi: \mathbb{R}^d \times \mathbb{R} \to \mathbb{R}$:
$$\Gamma(t) = \{\mathbf{x} : \phi(\mathbf{x}, t) = 0\}$$

**Evolution equation:** The interface moves with the flow velocity $\mathbf{v}$ — each point $\mathbf{x}$ on the interface moves in the normal direction with speed $v_n$. Equivalently, $\phi$ satisfies:
$$\frac{\partial \phi}{\partial t} + \mathbf{v} \cdot \nabla \phi = 0$$

or in terms of normal velocity: $\frac{\partial\phi}{\partial t} + v_n|\nabla\phi| = 0$ (the Osher-Sethian equation).

**Curvature computation:**
$$\kappa = \nabla \cdot \left(\frac{\nabla\phi}{|\nabla\phi|}\right) = \frac{\phi_{xx}\phi_y^2 - 2\phi_x\phi_y\phi_{xy} + \phi_{yy}\phi_x^2}{(\phi_x^2+\phi_y^2)^{3/2}}$$

This is computed purely from derivatives of $\phi$ — no need to reconstruct the surface. This makes surface-tension-driven flow (where the forcing depends on curvature) easy to implement: $f_{surf} = \sigma\kappa\delta(\phi)\mathbf{n}$, where $\delta(\phi)$ is a smoothed delta function localizing the force to the interface.

**Reinitialization (the most important detail):**
After $n$ advection steps, $|\nabla\phi|$ deviates from 1. Solve the reinitialization equation to restore the signed-distance property:
$$\frac{\partial\phi}{\partial\tau} + S(\phi^0)(|\nabla\phi| - 1) = 0$$

where $\tau$ is a pseudo-time, $\phi^0$ is the current $\phi$ before reinitialization, and $S(\phi^0) = \phi^0/\sqrt{(\phi^0)^2 + |\nabla\phi^0|^2 \epsilon^2}$ is a smeared sign function. Iterate to steady state (typically 5–10 pseudo-time steps). The zero level set position is preserved while $|\nabla\phi| \to 1$ everywhere.

Alternatively: the **fast marching method** (Sethian) computes the exact signed distance function in O(N² log N) for an N×N grid by propagating the distance from the zero level set outward, like Dijkstra's algorithm on the grid.

**Narrow-band level set:** The $\phi$ evolution only needs to be computed near the interface (say, within 5–10 cells). Far from the interface, $\phi$ is not needed for physics. Store and update only the "narrow band" of cells near $\Gamma$: reduces memory from O(N²) to O(N) in 2D.

**Real-world examples:**
- **Computer graphics — implicit surfaces:** Blobs, metaballs, and organic shapes in 3D CGI are represented as level sets of simple functions ($\phi = r - R$ for a sphere). Union/intersection/difference of shapes = min/max/negation of $\phi$ values. This is Constructive Solid Geometry (CSG) in level-set form.
- **Medical image segmentation:** MRI or CT scan segmentation isolates organs by evolving a level set $\phi$ to minimize a variational energy that attracts the interface to image edges. The Chan-Vese model is a classic level-set segmentation method.
- **Dendritic crystal growth:** Solidification fronts in casting simulations develop dendritic (snowflake-like) arms due to surface energy anisotropy. The phase-field method (a smoothed level set) simulates this. Used by Calcom, ESI Group for metal casting simulation.
- **Two-phase flow (OpenFOAM interFoam):** The `interFoam` solver in OpenFOAM uses a VoF-like method with level-set-inspired interface sharpening. Widely used in offshore engineering for wave-body interaction.

---

## The Fix

Complete 2D level set implementation:

```javascript
class LevelSetMethod {
  constructor(N, dx) {
    this.N = N; this.dx = dx;
    this.phi = new Float64Array(N * N);
    this.phi_old = new Float64Array(N * N);
  }

  // Initialize phi as signed distance to a circle
  initCircle(cx, cy, radius) {
    for (let j = 0; j < this.N; j++)
      for (let i = 0; i < this.N; i++) {
        const x = (i + 0.5) * this.dx, y = (j + 0.5) * this.dx;
        this.phi[j*this.N+i] = Math.sqrt((x-cx)**2 + (y-cy)**2) - radius;
      }
  }

  // Upwind gradient |∇φ|² for Hamilton-Jacobi schemes
  upwindGradSq(phi, i, j, vx, vy) {
    const N = this.N, dx = this.dx;
    const idx = j*N+i;
    const phix_m = (idx > 0)   ? (phi[idx]-phi[idx-1])/dx : 0;
    const phix_p = (idx < N*N-1) ? (phi[idx+1]-phi[idx])/dx : 0;
    const phiy_m = (j > 0)     ? (phi[idx]-phi[idx-N])/dx : 0;
    const phiy_p = (j < N-1)   ? (phi[idx+N]-phi[idx])/dx : 0;
    // Upwind: use backward diff if velocity > 0, forward if < 0
    const Dx = vx > 0 ? Math.max(phix_m, 0)**2 + Math.min(phix_p, 0)**2
                      : Math.min(phix_m, 0)**2 + Math.max(phix_p, 0)**2;
    const Dy = vy > 0 ? Math.max(phiy_m, 0)**2 + Math.min(phiy_p, 0)**2
                      : Math.min(phiy_m, 0)**2 + Math.max(phiy_p, 0)**2;
    return Dx + Dy;
  }

  // Advect phi with velocity field (u_x[idx], u_y[idx])
  advect(u_x, u_y, dt) {
    const N = this.N, dx = this.dx;
    const phi_new = this.phi.slice();
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const idx = j*N+i;
        const vx = u_x[idx], vy = u_y[idx];
        // Godunov upwind scheme for ∂φ/∂t + v·∇φ = 0
        const dphidx = vx > 0
          ? (i > 0 ? (this.phi[idx] - this.phi[idx-1])/dx : 0)
          : (i < N-1 ? (this.phi[idx+1] - this.phi[idx])/dx : 0);
        const dphidy = vy > 0
          ? (j > 0 ? (this.phi[idx] - this.phi[idx-N])/dx : 0)
          : (j < N-1 ? (this.phi[idx+N] - this.phi[idx])/dx : 0);
        phi_new[idx] = this.phi[idx] - dt * (vx*dphidx + vy*dphidy);
      }
    }
    this.phi = phi_new;
  }

  // Reinitialize: solve ∂φ/∂τ + S(φ⁰)(|∇φ|-1) = 0 to steady state
  reinitialize(nSteps = 5) {
    const phi0 = this.phi.slice();
    const dtau = 0.5 * this.dx;  // pseudo-timestep
    for (let step = 0; step < nSteps; step++) {
      const phi_new = this.phi.slice();
      for (let j = 0; j < this.N; j++) {
        for (let i = 0; i < this.N; i++) {
          const idx = j*this.N+i;
          const sign = phi0[idx] / Math.sqrt(phi0[idx]**2 + this.dx**2);
          // Godunov upwind |∇φ|
          const gradSq = this.upwindGradSq(this.phi, i, j, sign, sign);
          const gradMag = Math.sqrt(gradSq);
          phi_new[idx] = this.phi[idx] - dtau * sign * (gradMag - 1);
        }
      }
      this.phi = phi_new;
    }
  }

  // Interface curvature κ = ∇·(∇φ/|∇φ|)
  curvature(i, j) {
    const N = this.N, dx = this.dx, phi = this.phi;
    const g = (di, dj) => phi[Math.max(0,Math.min(N-1,j+dj))*N + Math.max(0,Math.min(N-1,i+di))];
    const px  = (g(1,0)-g(-1,0))/(2*dx), py  = (g(0,1)-g(0,-1))/(2*dx);
    const pxx = (g(1,0)-2*g(0,0)+g(-1,0))/(dx*dx);
    const pyy = (g(0,1)-2*g(0,0)+g(0,-1))/(dx*dx);
    const pxy = (g(1,1)-g(-1,1)-g(1,-1)+g(-1,-1))/(4*dx*dx);
    const denom = Math.pow(px*px+py*py, 1.5) + 1e-14;
    return (pxx*py*py - 2*px*py*pxy + pyy*px*px) / denom;
  }
}
```

---

## The Wow Moment — Push It

**Demo: Dendritic solidification.** Use the level set to track the solid-liquid interface of a crystal growing from a melt. The physics:
- Interface moves in the normal direction with speed $v_n = D(\partial T/\partial n)_{\text{liquid}} - D(\partial T/\partial n)_{\text{solid}}$ (heat flux jump at the interface — Stefan condition)
- Surface energy anisotropy: $\gamma(\theta) = \gamma_0(1 + \epsilon_4 \cos(4\theta))$ where $\theta$ is the interface normal angle — favors growth in four preferred crystal directions
- Gibbs-Thomson effect: the equilibrium temperature at the interface is $T_{eq} = T_m - \sigma\kappa$ (melting point is reduced by curvature, stabilizing flat interfaces, destabilizing bumps)

The result: a square seed crystal develops four primary arms, each arm growing along the [10], [01], [-10], [0-1] directions. Secondary arms branch from the primary arms (dendritic instability from Gibbs-Thomson). Tertiary arms branch from those.

The final structure looks exactly like a snowflake — 4-fold symmetry (for a cubic crystal) with multiple levels of branching. The level set handles all the topology (branching, arm tips growing independently) automatically. Show a comparison with the marker-particle method: it can track the main interface but fails at the branch points.

Render a sped-up growth animation: the crystal growing from a tiny seed to fill 80% of the domain, all branches perfectly tracked by the level set, in 20 seconds of video.

---

## The Interactive Demo

The viewer gets a canvas with a 2D level set method simulation:

- **Problem** (dropdown): Expanding circle | Vortex deformation (Zalesak) | Two merging bubbles | Rising bubble with surface tension | Dendritic growth | Front propagating with curvature-dependent speed
- **Velocity field** (dropdown): Zero (curvature-driven only) | Solid body rotation | Single vortex | Taylor-Green | Custom flow | Click to set point vortex
- **Normal speed function** (dropdown): Constant (bubble expansion) | Curvature-dependent (v_n = 1 - ε·κ) | Flow-driven | Crystal anisotropy
- **Anisotropy strength ε_4** (slider, 0–0.5, visible in crystal mode): 0 = circular growth; 0.5 = strong dendritic branching
- **Reinitialization frequency** (slider, every 1–20 steps): See |∇φ| deviation grow without reinitialization; watch the interface warp
- **Show φ field** (toggle): Color canvas by φ value (blue=negative, yellow=positive) with white zero contour
- **Show |∇φ|-1** (toggle): Color canvas by deviation from signed distance property — reveals where reinitialization is needed
- **Show curvature** (toggle): Color interface cells by curvature κ — positive (convex) = red, negative (concave) = blue
- **Show narrow band** (toggle): Highlight only the cells within the narrow band (where computation is done)
- **Two circles** (button): Drop two level set circles that then merge when they touch — watch topology change automatically
- **Zalesak's disk test** (button): Run the standard accuracy benchmark — compare final to initial

---

## Production Notes

**Code structure:**
- `levelset.js`: `LevelSetMethod` class with advection, reinitialization, curvature, narrow-band support
- `fast_marching.js`: Fast marching method for exact reinitialization (Dijkstra-like on grid)
- `heat_diffusion.js`: Heat equation solver for dendritic solidification (finite difference, Crank-Nicolson)
- `crystal_growth.js`: Couples level set to heat equation via Stefan condition and Gibbs-Thomson effect
- `main.js`: Canvas render, color coding, UI

**Visual layout:**
- Blue-to-yellow colormap for φ: negative (inside) = deep blue, zero = white contour line, positive (outside) = warm yellow
- Interface rendered as a 1px white line (iso-contour of φ = 0) drawn using marching squares
- Side panel: φ profile along a horizontal cross-section (shows signed distance function shape)
- Curvature colorbar when curvature mode is on

**Key cinematic moments:**
1. (1:00) Zalesak's disk rotating: marker method — markers bunch at the notch, interface breaks after 150 steps. Level set — disk makes a full rotation and returns to exact original shape. "Same flow. Completely different result."
2. (3:00) Two circles approach and merge: the marker method would require special code. The level set: the $\phi < 0$ regions simply overlap, the zero contour changes connectivity automatically. No code changes. "Topology change is free."
3. (5:00) Toggle reinitialization OFF: after 50 steps, |∇φ| deviates from 1 visibly — the $\phi$ field distorts, the zero contour drifts slightly. Toggle ON: the reinitialization equation runs, |∇φ| snaps back to 1, the contour returns to its exact position.
4. (7:00) Curvature coloring on a deformed interface: convex regions glow red (positive curvature → high surface tension → pulls inward), concave regions glow blue. "The level set knows the curvature of a surface without constructing the surface."
5. (9:00) Dendritic growth: 30-second time-lapse of crystal growing from a seed to a full snowflake-like dendritic structure. Each branch tracked perfectly by the level set. End frame: a beautiful crystal rendered in blue on white — the zero contour of φ, nothing more.

**Equations to render on canvas:**
- $\frac{\partial\phi}{\partial t} + \mathbf{v}\cdot\nabla\phi = 0$ (level set advection)
- $\kappa = \nabla\cdot\left(\frac{\nabla\phi}{|\nabla\phi|}\right)$ (curvature formula)
- Reinitialization: $\frac{\partial\phi}{\partial\tau} = S(\phi^0)(1 - |\nabla\phi|)$ until $|\nabla\phi|=1$

---

## Tags
`level-set` `interface-tracking` `signed-distance` `curvature` `reinitalization` `free-surface` `canvas` `implicit-surface`

---

## Thumbnail

Black canvas. The zero level set of a complex φ field rendered as a glowing white contour: a crystal with four primary dendritic arms, each with secondary branches — a snowflake-like shape. The φ field is visible in blue (negative, inside) and dark yellow (outside). Bold white text: "MOVING BOUNDARIES WITHOUT RE-MESHING" at top. Subtitle: "Level Set Method" in electric blue. Bottom corner: a tiny Zalesak's disk (notched circle) — the classic accuracy benchmark.
