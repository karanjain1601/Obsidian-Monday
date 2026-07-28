---
title: "The Best of Both Worlds: FLIP Fluid Simulation"
id: M042
difficulty: 7/10
prereq: "None"
concept: "FLIP (Fluid Implicit Particles): particles carry velocity; transfer to grid for pressure solve (Eulerian, removes numerical diffusion issue of pure-grid methods); update particles from grid delta velocities; particle-to-grid and grid-to-particle interpolation."
tags: [FLIP, fluid-simulation, particles, pressure-solve, Eulerian-Lagrangian, hybrid, WebGL, numerical-diffusion]
category: medium
type: video-idea
---

# The Best of Both Worlds: FLIP Fluid Simulation

**Alt title:** "Why AAA Games Use Particles AND a Grid for Water"
**Difficulty:** 7/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Show a slow-motion clip of water splashing — the kind you see in an AAA game or film: thin sheets, droplets detaching, a jet arcing and breaking into individual droplets. Then show a side-by-side: a pure grid fluid (PIC method — looks like motor oil, unnaturally damped, barely moves after the initial splash). Next to it, the same scenario using FLIP: thin sheets persist, droplets fly realistically, the surface looks alive.

Voice: *"In the 1980s, a plasma physicist named Harlow invented a method for simulating hot plasma that turned out to be the best fluid simulation technique ever discovered for visual effects. It's called FLIP — Fluid-Implicit-Particles — and it's the secret behind the water in most of the fluid simulations you see in games and film. It combines a particle system with a pressure-solving grid in a way that gets the best of both worlds. And when you first try to build it, you'll make a mistake that turns your water into peanut butter. Let's find out why."*

---

## The Naive Attempt

Start with PIC (Particle-In-Cell) — FLIP's predecessor. Particles carry velocity; on each step, transfer velocity to grid (P→G), do pressure solve on grid to enforce incompressibility, transfer corrected velocity back to particles (G→P):

```javascript
// PIC: transfer grid velocity DIRECTLY back to particles
// Particle-to-Grid (P2G): splat particle velocities onto grid
function particleToGrid(particles, grid) {
  grid.u.fill(0); grid.uWeight.fill(0);
  grid.v.fill(0); grid.vWeight.fill(0);
  for (const p of particles) {
    // Bilinear splat onto staggered grid
    const ix = Math.floor(p.x), iy = Math.floor(p.y - 0.5);
    for (let di = 0; di <= 1; di++) for (let dj = 0; dj <= 1; dj++) {
      const wx = (di === 0) ? (ix+1 - p.x) : (p.x - ix);
      const wy = (dj === 0) ? (iy+1 - (p.y-0.5)) : ((p.y-0.5) - iy);
      const w = wx * wy;
      grid.u[idx(ix+di, iy+dj)] += w * p.u;
      grid.uWeight[idx(ix+di, iy+dj)] += w;
    }
    // ... similar for v component
  }
  // Normalize
  for (let i=0; i<grid.u.length; i++)
    if (grid.uWeight[i] > 0) grid.u[i] /= grid.uWeight[i];
}

// Grid-to-Particle (G2P): WRONG for FLIP — this is PIC
function gridToParticle_PIC(particles, grid) {
  for (const p of particles) {
    p.u = interpolateU(grid, p.x, p.y);  // Replace velocity entirely
    p.v = interpolateV(grid, p.x, p.y);
  }
}
```

The PIC G2P step replaces particle velocity entirely with the interpolated grid velocity. Run it: initial splash looks okay. But wait 5 seconds — the water is noticeably damping. Wait 15 seconds: the fluid moves with the viscosity of honey, then stops almost completely. The kinetic energy has been sucked out of the system by numerical dissipation.

---

## The Moment of Failure

At 10 seconds in: show a graph of total kinetic energy vs. time. It should be flat (energy conservation). Instead it plummets — losing 50% within the first 200 steps. The visual: a water droplet that should be bouncing and sloshing forever just... stops. The surface becomes glassy and still, like concrete setting. The motion is dead.

Zoom into the G2P interpolation step with an animated diagram: the bilinear interpolation smears the velocity field, and every interpolation slightly smooths out velocity differences between neighboring particles. Applied thousands of times, this smoothing is **numerical diffusion** — an artificial viscosity introduced by the interpolation itself, not by any physical viscosity in the equations.

---

## Why It Broke — The Physics

The fundamental problem is that interpolation is a diffusive operation. When you replace particle velocity with bilinear-interpolated grid velocity, you are averaging nearby values together — smoothing out any fine-scale velocity structure. For a fluid with physical viscosity ν, this is a problem because the simulation introduces a *numerical* viscosity ν_numerical ≈ (Δx²/Δt) that can dwarf the physical viscosity. At typical game resolutions, the numerical viscosity is orders of magnitude larger than water's actual viscosity (10⁻⁶ m²/s).

The grid solve is great for enforcing incompressibility (pressure projection):
> **∇·u = 0 (enforced by: u ← u - ∇p where ∇²p = ∇·u/Δt)**

But advection on the grid introduces diffusion. Particles advect themselves (semi-Lagrange: x_i ← x_i + v(x_i)·Δt) with no diffusion, since each particle carries its own value without averaging.

**FLIP's insight** (Brackbill, Kothe, Zemach 1988, adapted for graphics by Zhu & Bridson 2005): Don't give particles the grid velocity directly. Give them only the **change** in grid velocity:

> **Δu_grid = u_grid_after_pressure_solve - u_grid_before_pressure_solve**

Then update each particle:
> **u_particle ← u_particle + Δu_grid(x_particle)**

The particle retains its own history; it only receives the incompressibility correction from the grid. This means the grid's role is purely to enforce ∇·u = 0 — it doesn't impose any of its damping on the particles.

The cost: FLIP can be slightly noisy (particle velocities aren't coupled to each other except through the shared grid). The fix for noise is to blend FLIP and PIC: use (1-α)·PIC + α·FLIP where α ≈ 0.95–0.99. This gives 95% FLIP (low dissipation, slightly noisy) and 5% PIC (damping, smoothness) — a practical compromise.

---

## The One Concept

**FLIP: Fluid Implicit Particles**

FLIP is a hybrid Lagrangian-Eulerian method. "Lagrangian" means we track fluid parcels (particles) that move with the flow — they carry mass and momentum with them, they advect without numerical diffusion because we're just integrating ODEs (dx/dt = u). "Eulerian" means we use a fixed grid to compute pressure forces — the grid's regular structure makes the pressure Poisson equation fast to solve.

The standard pipeline per timestep:

1. **Particle-to-Grid (P→G):** Splat particle velocities onto the staggered MAC (Marker-And-Cell) grid using bilinear interpolation. Save this as u_old.

2. **Grid operations:** Apply body forces (gravity: u_y += g·Δt). Mark grid cells as fluid, air, or solid based on particle presence. Apply boundary conditions.

3. **Pressure projection:** Solve the pressure Poisson equation to make the velocity field divergence-free:
   > ∇²p = ρ/Δt · ∇·u
   > u ← u - Δt/ρ · ∇p
   
   This is the expensive step — typically solved with a conjugate gradient method. The result is u_new.

4. **FLIP Grid-to-Particle (G→P):** Compute the velocity delta and update particles:
   ```
   Δu = u_new - u_old
   for each particle: v_particle += interpolate(Δu, x_particle)
   ```
   This is the key step. Particles keep their own velocity accumulated over all past timesteps; they only receive the *change* from this step's grid operations.

5. **Advect particles:** x_particle += v_particle · Δt (simple Euler, or RK2 for better accuracy).

6. **Enforce particle density:** Ensure roughly 4–8 particles per cell. Add particles in sparse regions, remove duplicates in dense regions (with velocity interpolation to maintain continuity).

The pressure solver requires building a sparse linear system (N_fluid_cells × N_fluid_cells matrix) and solving it. In JavaScript, a simple CG solver without preconditioner works for ~10,000 cells at 30 fps. For larger grids, WebGL compute or Web Workers are needed.

The staggered MAC grid is important: u-velocities live on vertical cell faces, v-velocities on horizontal faces. This makes the discrete divergence and gradient operators naturally adjoint, which is essential for the pressure solve to be well-posed and symmetric positive definite.

Real-world usage: Zhu & Bridson's FLIP paper was incorporated into commercial VFX software almost immediately. Disney's Naiad fluid solver (used in Frozen's ocean scenes), SideFX Houdini's FLIP Fluids node, and many game middleware solutions all use FLIP or FLIP-inspired methods. The key advantage over SPH (Smoothed Particle Hydrodynamics) for large-scale VFX is that the grid pressure solve can be parallelized efficiently and the incompressibility is enforced exactly (to solver tolerance).

---

## The Fix

The complete FLIP G→P step replacing the broken PIC step:

```javascript
// Save pre-projection velocities
function saveGrid(grid) {
  grid.u_old = grid.u.slice();  // copy
  grid.v_old = grid.v.slice();
}

// Called AFTER pressure projection
function gridToParticle_FLIP(particles, grid, alpha = 0.95) {
  for (const p of particles) {
    // FLIP: particle gets velocity delta
    const du_flip = interpolateU(grid.u, p.x, p.y) 
                  - interpolateU(grid.u_old, p.x, p.y);
    const dv_flip = interpolateV(grid.v, p.x, p.y) 
                  - interpolateV(grid.v_old, p.x, p.y);

    // PIC: particle gets full grid velocity
    const u_pic = interpolateU(grid.u, p.x, p.y);
    const v_pic = interpolateV(grid.v, p.x, p.y);

    // Blend: FLIP preserves history, PIC adds slight damping
    p.u = alpha * (p.u + du_flip) + (1 - alpha) * u_pic;
    p.v = alpha * (p.v + dv_flip) + (1 - alpha) * v_pic;
  }
}

// Advect particles
function advectParticles(particles, grid, dt) {
  for (const p of particles) {
    p.x += p.u * dt;
    p.y += p.v * dt;
    // Resolve wall collisions
    p.x = Math.max(0.5, Math.min(grid.W - 0.5, p.x));
    p.y = Math.max(0.5, Math.min(grid.H - 0.5, p.y));
  }
}
```

Run this version: the water now sloshes freely, droplets retain their velocity for many seconds, thin sheets stretch and detach correctly. Energy graph: flat, as expected. Drag the FLIP/PIC blend slider from 0 (pure PIC, damped) to 1 (pure FLIP, noisy) and show the sweet spot at 0.95.

---

## The Wow Moment — Push It

**Dam break scenario:** Fill the left half of the domain with particles; release. The FLIP water rushes rightward, hits the wall, climbs it, forms a sloshing standing wave that takes minutes to damp out — realistic water behavior. Compare side-by-side with PIC: the PIC version damps to stillness within 5 seconds.

**Free surface rendering:** Use marching squares to extract the fluid surface from the particle density field; render with a fresnel-shaded blue gradient. The surface has all the fine detail that FLIP's low diffusion preserves — thin sheets, droplet-scale features.

**Viscosity dial:** Adjust the FLIP/PIC blend from 95% to 50% to model more viscous fluids (honey, lava). Show honey pouring — thick, sticky, the surface barely ripples. Then switch to 99% FLIP for mercury-like behavior: very fast, low viscosity, dramatic sloshing.

**3D particle rendering:** Upgrade from 2D to 3D. Each particle rendered as a metaball. The implicit surface is extracted using marching cubes and rendered with screen-space ambient occlusion. At this point the simulation rivals indie game water quality.

---

## The Interactive Demo

**FLIP/PIC blend (alpha) slider:** 0.0–1.0, watch energy preservation vs. noise.
**Particle count:** 1,000–50,000.
**Grid resolution:** 32×32 to 128×128 (trades speed for accuracy).
**Gravity slider:** 0.1–20 m/s² (try low-gravity water on the moon).
**Obstacle toggle:** circle, box, or draw custom obstacles with mouse.
**"Pour mode":** click-drag to pour particles from the mouse position.
**CG iterations limit slider:** 1–100 (see the effect of an under-solved pressure system — velocity divergence appears as visible compressibility artifacts).
**Visualization overlay:** particle positions, grid velocity vectors, pressure field, divergence field, solid/fluid cell markers.
**Energy graph panel:** live plot of total kinetic + potential energy over time.

---

## Production Notes

**Code to show on screen:** The before/after G→P code blocks side by side. The key diff highlighted in green: `p.u += du_flip` (FLIP) vs `p.u = u_grid` (PIC). Use syntax highlighting with red for the broken line, green for the fix.

**Visual layout:** Main panel (60% width): simulation canvas. Right panel: energy graph (top), algorithm state diagram (bottom) showing which step is currently executing with colored highlight.

**Key cinematic moment at 2:30:** The PIC energy graph collapsing — animate the loss of kinetic energy as the color of the water darkening from vibrant blue to a dead grey. The metaphor: PIC "freezes" the fluid.

**Key moment at 6:00:** Animated walkthrough of one timestep — 5 stages shown as a flowchart, each stage triggering as the voiceover covers it. Particles glow red during P→G, grid glows blue during pressure solve, arrows appear during G→P, particles move during advection.

**Key moment at 9:00:** Side-by-side comparison at 60fps. The same dam break. Left: PIC. Right: FLIP. Run for 20 seconds real time. The difference is unmistakable. Freeze frame — overlay measurements of kinetic energy remaining. FLIP: 85%. PIC: 2%.

**Performance note:** For the JS version, warn that the pressure solve (CG) is the bottleneck. Use a sparse CSR-format matrix, not a dense 2D array. Show a profiler screenshot identifying it.

---

## Tags

`FLIP` `fluid-simulation` `particles` `pressure-solve` `Eulerian-Lagrangian` `hybrid` `WebGL` `numerical-diffusion`

---

## Thumbnail

**Center panel:** Water pouring dramatically — particles rendered as glowing cyan spheres on a dark background, a clear free surface line, some droplets mid-air. Bold white text at top: "THE BEST OF BOTH WORLDS". Bottom half: split — left labeled "GRID ONLY" showing a grey blob (PIC water after 10 seconds of damping), right labeled "PARTICLES ONLY" showing noisy scattered dots, center labeled "FLIP" showing the perfect result. Red arrows pointing inward from both failure modes to the center FLIP result. Gold channel badge. The emotional hook: both extremes are wrong, only the hybrid is right.
