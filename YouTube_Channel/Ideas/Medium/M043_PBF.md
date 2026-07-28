---
title: "Water That Never Explodes (Position-Based Fluids)"
id: M043
difficulty: 6.5/10
prereq: "None"
concept: "PBF (Macklin & Müller 2013): apply positional density constraints to SPH particles; incompressibility enforced by direct position correction rather than pressure forces; stable at any timestep; correction per particle: Δx_i = (1/ρ₀)Σ(λ_i+λ_j)∇W."
tags: [PBF, SPH, fluid-simulation, position-based, incompressibility, density-constraint, stable, WebGL]
category: medium
type: video-idea
---

# Water That Never Explodes (Position-Based Fluids)

**Alt title:** "Unconditionally Stable Water Simulation in 60 Lines"
**Difficulty:** 6.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Screen is black. A single line of text appears: `dt = 0.001`. A water simulation starts — calm, stable, beautiful. Text changes to `dt = 0.01`. Still fine. `dt = 0.05`. Particles swirl, looking slightly less smooth but still stable. `dt = 0.1`. Running at one-tenth the framerate. Still stable.

Then cut: "Let me show you what happens with traditional SPH."

Same scene, traditional SPH pressure forces. `dt = 0.001`: stable. `dt = 0.003`: particles start jittering. `dt = 0.005`: particles fly apart in a catastrophic explosion, shooting off-screen in all directions. Simulation crashes. "PARTICLE EXPLOSION" in red block text.

Voice: *"This is the dirty secret of SPH fluid simulation: there's a maximum timestep beyond which your particles become grenades. Every popular tutorial, every demo you've seen, they're all running a careful knife-edge timestep. But in 2013, Miles Macklin and Matthias Müller published a paper that removed this limit entirely. Position-Based Fluids is unconditionally stable. Let's understand why — and build it."*

---

## The Naive Attempt

Standard SPH (Smoothed Particle Hydrodynamics) with explicit pressure forces. Each particle i computes density by summing kernel contributions from neighbors:

```javascript
// SPH density estimation
function computeDensity(i, particles, h) {
  let rho = 0;
  for (const j of neighbors(i, particles, h)) {
    const r = dist(particles[i], particles[j]);
    rho += particles[j].mass * W_poly6(r, h);
  }
  return rho;
}

// SPH pressure force (Desbrun's formulation)
function pressureForce(i, particles, h) {
  let fx = 0, fy = 0;
  const pi = particles[i];
  const rho_i = pi.rho;
  const p_i = k_gas * (rho_i - rho_0);  // equation of state

  for (const j of neighbors(i, particles, h)) {
    const pj = particles[j];
    const p_j = k_gas * (pj.rho - rho_0);
    const r = dist(pi, pj);
    const [gradx, grady] = gradW_spiky(pi, pj, r, h);
    // Pressure force: symmetric
    const factor = pj.mass * (p_i / (rho_i*rho_i) + p_j / (pj.rho*pj.rho));
    fx -= factor * gradx;
    fy -= factor * grady;
  }
  return [fx, fy];
}

// Integration: explicit Euler
function integrate(particles, dt) {
  for (const p of particles) {
    const [fx, fy] = pressureForce(p.id, particles, h);
    p.vx += (fx + 0 ) * dt;  // no gravity for now
    p.vy += (fy - 9.81) * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
}
```

Set `k_gas = 50`. Timestep `dt = 0.016` (60fps). Particles cluster normally. Now raise `k_gas = 200` to get stiffer (more incompressible) fluid: particles explode immediately because the pressure force magnitude is proportional to k_gas, and at dt=0.016, the explicit Euler integration massively overshoots the equilibrium.

---

## The Moment of Failure

Set k_gas high enough to suppress density variation below 1%. Run at dt = 0.016. What appears on screen: several particles shoot off in a direction, impacting their neighbors, cascading. Within 4 frames: a chain-reaction explosion where particles radiate outward from a dense cluster at thousands of pixels per second, disappearing off-screen. The canvas is empty within 10 frames. The browser console shows: `NaN NaN NaN NaN` — not-a-number positions everywhere.

Text overlay: "k_gas controls stiffness. Higher k_gas = more incompressible = stiffer spring forces = smaller dt required. The stability condition is: dt < √(m/k) — like a spring system. For incompressible water, k must be enormous, so dt must be tiny. There is no way to win."

---

## Why It Broke — The Physics

The explicit integration of pressure forces has a stability condition analogous to spring-mass systems. The SPH "pressure spring" between particles has an effective spring constant proportional to k_gas·ρ. The explicit Euler stability limit for a harmonic oscillator is dt < 2/ω = 2√(m/k). For incompressible water (density error < 1%), k must be large, pushing dt to the order of 10⁻⁴ seconds — meaning 10,000 simulation steps per second while rendering at 60 fps. That's 167× more work than the renderer needs.

The root cause: pressure forces are derived from a **penalty function** — deviations from target density are penalized by forces. Forces integrate into velocities, velocities into positions. Two integrations from the error. If the penalty stiffness is high enough to be realistic, the two integrations amplify any error exponentially.

Position-Based Dynamics (Müller 2007) had the key insight: skip forces entirely for positional constraints. Don't compute a force and integrate it twice. Instead, directly compute the **correction to position** that satisfies the constraint. One integration from error to correction. Much more stable.

For PBF, the constraint for particle i is:
> **C_i(x_1,...,x_n) = ρ_i / ρ₀ - 1 = 0**

The density ρ_i is computed from neighbor positions via the SPH kernel W. The constraint gradient with respect to position x_k is:
> **∇_k C_i = (1/ρ₀) Σ_j ∇_k W(|x_i - x_j|, h)**

The position correction (Newton step on the constraint):
> **Δx_i = (1/ρ₀) Σ_j (λ_i + λ_j) ∇_i W(|x_i - x_j|, h)**

where the Lagrange multipliers λ_i are:
> **λ_i = -C_i / (Σ_k |∇_k C_i|² + ε)**

The ε term (relaxation parameter, typically 0.001) prevents division by zero when particles are isolated, and crucially, limits the maximum correction magnitude — an implicit stabilization.

---

## The One Concept

**Position-Based Fluids: Constraints Instead of Forces**

PBF's philosophy is a complete inversion of the traditional physics simulation mindset. Classical simulation: compute forces from potential energy (or equations of state), integrate forces to get velocity changes, integrate velocities to get position changes. Errors grow with each integration. PBF: skip to the end. Ask directly, "what position correction would satisfy my physical constraint?" and apply it.

The PBF algorithm per timestep:

1. **Predict positions:** Apply external forces (gravity) and integrate positions without pressure:
   ```
   v_i += g * dt
   x_i* = x_i + v_i * dt
   ```

2. **Find neighbors:** Spatial hash / grid to find all particles j within radius 2h of each particle i.

3. **Constraint iterations (inner loop, 2–5 times):**
   a. For each particle i, compute density ρ_i = Σ_j m_j · W(|x_i* - x_j*|, h)
   b. Compute constraint violation: C_i = ρ_i/ρ₀ - 1
   c. Compute Lagrange multiplier: λ_i = -C_i / (Σ_k |∇_k C_i|² + ε)
   d. Compute position delta: Δx_i = (1/ρ₀) Σ_j (λ_i + λ_j) ∇_i W(x_i* - x_j*, h)
   e. Apply: x_i* += Δx_i (also handle collision boundaries here)

4. **Update velocity from corrected positions:**
   ```
   v_i = (x_i* - x_i) / dt
   x_i = x_i*
   ```

5. **Apply viscosity:** XSPH variant — slightly blend velocity toward neighbor average:
   ```
   v_i += c * Σ_j (v_j - v_i) * W(|x_i - x_j|, h)
   ```

The stability: no stiffness constant anywhere in the loop. The ε in the denominator bounds λ. The position corrections are bounded by geometry (particles can't push each other further than one kernel radius per iteration). At any timestep, the worst that happens is the constraint isn't fully satisfied (density is off by some percent) — the simulation doesn't explode because there's no runaway force amplification.

A crucial stabilization from the Macklin-Müller paper: **tensile instability correction**. In standard SPH/PBF, particles near the free surface experience fewer neighbors and thus feel an artificial attractive force (negative pressure). This creates "particle clumping" — ugly clusters on the surface. The fix: add an artificial pressure term s_corr = -k · (W(|x_i - x_j|)/W(Δq))^n where Δq ≈ 0.2h. This adds a small repulsion that prevents clumping without noticeably affecting incompressibility.

The SPH kernels used: Poly6 for density (spherically symmetric, cheaper to compute): W_poly6(r,h) = (315/64πh⁹)(h²-r²)³. Spiky gradient for pressure (has nonzero gradient everywhere, essential): ∇W_spiky(r,h) = -(45/πh⁶)(h-r)².

Real-world use: Unity's VFX Graph fluid option, NVIDIA PhysX position-based fluid, Unreal Engine's Chaos fluid. PBF's unconditional stability makes it ideal for interactive applications where the timestep is unpredictable (frame spikes, background loading).

---

## The Fix

Complete PBF solver loop:

```javascript
const RHO_0 = 1000;   // rest density kg/m³ (normalized to 1.0 in practice)
const H = 0.1;        // kernel radius (meters)
const EPS = 100.0;    // relaxation parameter (tuned to particle count)
const ITERS = 3;      // constraint iterations per step
const K_CORR = 0.001; // tensile correction coefficient
const N_CORR = 4;     // tensile correction exponent
const W_DQ = poly6(0.2 * H, H);  // precomputed denominator for s_corr

function poly6(r, h) {
  if (r > h) return 0;
  const x = h*h - r*r;
  return (315 / (64 * Math.PI * Math.pow(h, 9))) * x * x * x;
}

function gradSpiky(xi, yi, xj, yj, h) {
  const dx = xi - xj, dy = yi - yj;
  const r = Math.sqrt(dx*dx + dy*dy);
  if (r === 0 || r > h) return [0, 0];
  const coeff = -(45 / (Math.PI * Math.pow(h, 6))) * (h - r) * (h - r) / r;
  return [coeff * dx, coeff * dy];
}

function pbfStep(particles, dt) {
  // 1. Predict
  for (const p of particles) {
    p.vx += 0; p.vy += -9.81 * dt;
    p.px = p.x + p.vx * dt;
    p.py = p.y + p.vy * dt;
  }

  // 2. Find neighbors (spatial hash, omitted for brevity)
  findNeighbors(particles, H);

  // 3. Constraint iterations
  for (let iter = 0; iter < ITERS; iter++) {
    // a. Compute lambda for each particle
    for (const pi of particles) {
      let rho = 0;
      let gradSum = 0;
      let gradxi = 0, gradyi = 0;
      for (const j of pi.neighbors) {
        const pj = particles[j];
        const r = Math.hypot(pi.px - pj.px, pi.py - pj.py);
        rho += poly6(r, H);
        const [gx, gy] = gradSpiky(pi.px, pi.py, pj.px, pj.py, H);
        gradxi += gx; gradyi += gy;
        gradSum += gx*gx + gy*gy;  // neighbor's gradient norm² contribution
      }
      pi.rho = rho;
      const Ci = rho / RHO_0 - 1.0;
      pi.lambda = -Ci / (gradSum + gradxi*gradxi + gradyi*gradyi + EPS);
    }

    // b. Compute and apply position corrections
    for (const pi of particles) {
      let dpx = 0, dpy = 0;
      for (const j of pi.neighbors) {
        const pj = particles[j];
        const r = Math.hypot(pi.px - pj.px, pi.py - pj.py);
        const s_corr = -K_CORR * Math.pow(poly6(r,H) / W_DQ, N_CORR);
        const [gx, gy] = gradSpiky(pi.px, pi.py, pj.px, pj.py, H);
        const factor = pi.lambda + pj.lambda + s_corr;
        dpx += factor * gx;
        dpy += factor * gy;
      }
      pi.dpx = dpx / RHO_0;
      pi.dpy = dpy / RHO_0;
    }
    for (const p of particles) {
      p.px += p.dpx;
      p.py += p.dpy;
      // Boundary collision clamp
      p.px = Math.max(H, Math.min(domainW - H, p.px));
      p.py = Math.max(H, Math.min(domainH - H, p.py));
    }
  }

  // 4. Update velocity
  for (const p of particles) {
    p.vx = (p.px - p.x) / dt;
    p.vy = (p.py - p.y) / dt;
    p.x = p.px; p.y = p.py;
  }

  // 5. XSPH viscosity
  const C_VISC = 0.01;
  for (const pi of particles) {
    let dvx = 0, dvy = 0;
    for (const j of pi.neighbors) {
      const pj = particles[j];
      const r = Math.hypot(pi.x - pj.x, pi.y - pj.y);
      const w = poly6(r, H);
      dvx += (pj.vx - pi.vx) * w;
      dvy += (pj.vy - pi.vy) * w;
    }
    pi.vx += C_VISC * dvx;
    pi.vy += C_VISC * dvy;
  }
}
```

---

## The Wow Moment — Push It

**Timestep stress test:** Live slider letting the viewer push dt from 1/60 to 1/3 of a second. The simulation degrades gracefully — density constraint isn't fully satisfied (water becomes slightly compressible) but it never explodes. At dt = 1/3s, particles visibly compress and expand but stay together. Traditional SPH explodes at dt > 1/200 with the same setup.

**Solid coupling:** Add a rigid body (a box) modeled as a set of static particles. The fluid interacts with it naturally through the same density constraints. Push the box in and watch fluid jet out from the sides. Remove the box — fluid fills the gap. All using the same constraint framework.

**Surface tension:** Add a curvature-based surface tension constraint: particles with fewer than average neighbors feel a restoring force toward neighbors. Droplets become spherical; thin sheets spontaneously retract. Adjust the surface tension coefficient with a slider — from "water" to "mercury" to "soap film."

**Particle emission:** Click to continuously emit a stream of particles from a nozzle. Watch the fluid pool accumulate in the basin, splash, and finally settle into a stable pool. No tuning needed — it just works at the same timestep.

---

## The Interactive Demo

**Timestep slider:** 1/240 to 1/5 second — compare stability with traditional SPH at large dt.
**Particle count:** 500–10,000.
**Constraint iterations:** 1–10 (see how density violation decreases with more iterations).
**Relaxation ε slider:** 1–1000 (controls correction aggressiveness).
**XSPH viscosity coefficient:** 0 (no viscosity) to 0.5 (very viscous).
**Tensile correction toggle:** see clumping artifacts with it off.
**Surface tension slider:** 0–0.1.
**Obstacle shapes:** circle, box, triangle — drag with mouse.
**Visualization overlay:** particle color by density (blue = sparse, red = dense, green = at rest density).
**"Drop boulder":** spawn a heavy rigid-particle aggregate that falls into the fluid pool.

---

## Production Notes

**Code to show on screen:** The critical 4-line lambda computation highlighted. Annotate λ_i = -C_i / (Σ|∇C|² + ε) with each piece labeled: "constraint violation" for C_i, "gradient magnitude" for the denominator, "regularization" for ε.

**Key visual split:** left panel: PBF simulation. Right panel: traditional SPH with identical parameters. Synchronize timestep slider — as you push it right, SPH explodes while PBF keeps running. The moment of SPH explosion should be dramatic: particles fly to the corners of the screen at high speed, then freeze (NaN).

**Animation at 5:00:** Visualize the constraint iteration loop. Show density error per particle as a colored glow (red = overly dense, blue = underly dense). Watch it converge toward green (correct density) over 3 iterations. This makes the algorithm's iterative nature physically intuitive.

**Key cinematic moment at 7:30:** Pull back camera. 10,000 particles. The simulation runs at 30fps in the browser. "This is running in your browser. Right now. With no stability limit." Let it run for 30 seconds of beautiful water.

**Music:** Build from tense (during the explosion failure) to triumphant as the stable simulation takes over.

---

## Tags

`PBF` `SPH` `fluid-simulation` `position-based` `incompressibility` `density-constraint` `stable` `WebGL`

---

## Thumbnail

**Split frame comparison:** Left side — chaotic particle explosion, particles flying off-screen, "EXPLODES" in red bold text, red ❌ over it. Right side — beautiful PBF fluid, particles forming a smooth spherical drop mid-air, deep blue, "NEVER EXPLODES" in white bold text, green checkmark. Center dividing line. Bold large title: "WATER THAT NEVER EXPLODES". The contrast is the entire emotional argument of the video. Background: dark near-black to make the particle colors pop. Channel watermark bottom right.
