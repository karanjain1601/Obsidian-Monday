---
title: "A Cylinder in Flow Creates an Alternating Wake (Kármán Vortex Street)"
id: M004
difficulty: 5/10
prereq: "None"
concept: "At Re ~40-1000, the wake behind a bluff body becomes unstable; vortices shed alternately, creating a regular street; Strouhal number St = fD/U ≈ 0.21 (universal for cylinders in this regime)."
tags: [fluid-simulation, vortex-shedding, karman-vortex, reynolds-number, strouhal-number, bluff-body, wake, navier-stokes]
category: medium
type: video-idea
---

# A Cylinder in Flow Creates an Alternating Wake (Kármán Vortex Street)

**Alt title:** "Why Chimneys Vibrate and Bridges Collapse: Simulating Kármán Vortex Streets"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Aerial satellite imagery over the Canary Islands: the islands are circular obstructions in the Atlantic trade winds. Downwind of each island, stretching for hundreds of kilometers into the open ocean, are two long rows of cloud-marked vortices — one row spinning clockwise, the other counterclockwise — perfectly alternating, perfectly regular, like a chain of gears. The islands create this exact pattern in clouds at a scale of 20 kilometers.

Cut to: a wind tunnel visualization with smoke, a cylinder in flow. At low speed: symmetric wake, smooth. Increase speed — at a precise moment the wake begins to wobble, then releases alternating vortices, one from top, one from bottom, tick-tock like a pendulum.

Cut to: archival footage of the Tacoma Narrows Bridge, 1940, oscillating catastrophically in a 40 mph wind before collapsing. "The bridge was resonating with its own Kármán vortex shedding frequency. Today we'll code the mechanism. Our first attempt will give you a perfectly symmetric wake — which is wrong."

---

## The Naive Attempt

Place a circular obstacle in the center of a grid. Set inflow boundary condition on the left (uniform velocity U to the right). Use a simple finite-difference Navier-Stokes solver without any intentional symmetry breaking.

```javascript
const N = 256;
const M = 512;           // wider than tall
const U_inflow = 1.0;
const viscosity = 0.01;
const cylinderR = 20;    // radius in cells
const cylinderX = 100, cylinderY = N / 2;

// Mark solid cells (cylinder)
const solid = new Uint8Array(N * M);
for (let j = 0; j < N; j++) {
  for (let i = 0; i < M; i++) {
    const dx = i - cylinderX, dy = j - cylinderY;
    solid[i + j * M] = (dx*dx + dy*dy < cylinderR*cylinderR) ? 1 : 0;
  }
}

// Inflow boundary: set left edge velocity
function applyBoundary() {
  for (let j = 0; j < N; j++) {
    vx[0 + j * M] = U_inflow;
    vy[0 + j * M] = 0;
  }
}

// Simple Navier-Stokes step (no pressure solve, just diffusion)
function step(dt) {
  applyBoundary();
  // Diffuse velocity (viscosity) only — no pressure
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < M-1; i++) {
      if (solid[i + j*M]) continue;
      const idx = i + j*M;
      const lap_vx = vx[(i+1)+j*M] + vx[(i-1)+j*M] +
                     vx[i+(j+1)*M] + vx[i+(j-1)*M] - 4*vx[idx];
      vxNew[idx] = vx[idx] + viscosity * dt * lap_vx;
    }
  }
  // Zero solid cells (no-slip)
  for (let idx = 0; idx < N*M; idx++) {
    if (solid[idx]) { vxNew[idx] = 0; vyNew[idx] = 0; }
  }
}
```

Result: the flow goes around the cylinder symmetrically. The wake is a perfect symmetric pattern — two fixed recirculation zones behind the cylinder, not shedding, not alternating. It stays this way forever.

---

## The Moment of Failure

On screen: the velocity field drawn as arrows over the domain. The flow splits above and below the cylinder in perfect mirror symmetry. Behind the cylinder, two recirculation zones form and stabilize — a fixed dipole in the wake. If you color by vorticity, you see two static blobs of opposite sign glued to the back of the cylinder. They never detach. Nothing alternates.

The failure reveals two bugs. First: without a pressure solve, the flow does not correctly route around the obstacle — the incompressibility constraint is not satisfied. Second and subtler: the simulation has perfect up-down symmetry. A symmetric solver with a symmetric obstacle in a symmetric flow will produce a symmetric solution forever, even though that solution is unstable. The physical instability requires a symmetry-breaking perturbation, which in the real flow comes from infinitesimal manufacturing imperfections in the cylinder or thermal noise in the fluid. In code, numerical noise from floating-point operations is often enough, but only if the pressure solve is correct.

---

## Why It Broke — The Physics

The Kármán vortex street is a consequence of the **instability of symmetric wakes at intermediate Reynolds numbers.** The Reynolds number Re = UD/ν (U = inflow speed, D = cylinder diameter, ν = kinematic viscosity) is the key dimensionless parameter:

- Re < 1: Stokes flow — perfectly symmetric, no wake
- Re ~ 5-40: symmetric wake with two attached recirculation zones (steady)
- Re ~ 40-190: periodic vortex shedding — the **Kármán vortex street**
- Re ~ 190-300: wake becomes 3D, irregular
- Re > 300: turbulent wake

The mechanism for the onset of shedding (Re ≈ 40–50) is a **Hopf bifurcation** in the dynamical system describing the wake. Below the critical Re, the symmetric solution is a stable fixed point. Above it, the fixed point becomes unstable and a stable limit cycle (periodic vortex shedding) emerges from it.

Physically: the flow separates from the cylinder surface at the boundary layer separation point. The separated shear layers on the top and bottom carry opposite-sign vorticity. When one shear layer grows large enough, it draws the other shear layer across the wake centerline, causing the opposite-sign vorticity to cut the connection and allow a vortex to shed. This process then repeats on the other side.

The shedding frequency is remarkably universal, captured by the **Strouhal number**:

$$St = \frac{fD}{U} \approx 0.21 \quad \text{for } 100 < Re < 1000$$

where f is the shedding frequency, D is the cylinder diameter, and U is the free-stream velocity. This means if you double the flow speed, the shedding frequency also doubles — the vortex street simply advects faster. If you double the cylinder diameter, the frequency halves. The Tacoma Narrows bridge had a fundamental torsional mode at 0.2 Hz; at 40 mph winds, the Kármán frequency for its cross-sectional dimension was also near 0.2 Hz — resonance disaster.

---

## The One Concept

The **Kármán vortex street** is a repeating pattern of swirling vortices caused by vortex shedding, alternating on opposite sides of a bluff body in a flowing fluid. Theodore von Kármán explained the pattern's stability in 1911 using potential flow theory — he showed that a specific geometric ratio between vortex spacing and row separation (h/a ≈ 0.281) makes the double row stable to perturbations.

The key physics is **vortex shedding**: a bluff body forces flow to separate from its surface, creating free shear layers on both sides. These shear layers are Kelvin-Helmholtz unstable (see M002) and roll up into discrete vortices. The top and bottom shear layers interact — as a vortex grows on one side, it entrains fluid from the other side and eventually cuts off the vortex on the other side, causing it to shed downstream. Then the process repeats on the other side.

The resulting street of vortices has a precise geometry. Vortices in the same row are spaced a distance a apart. The two rows are offset by a/2. The row separation is h ≈ 0.281a. This geometry makes the street "almost stable" — perturbations neither grow nor decay exponentially, but rotate, so the street drifts without breaking up. Downstream, viscosity diffuses and weakens the vortices, and they eventually merge and dissipate.

The engineering consequences are enormous. Vortex shedding exerts a periodic force on the body — the lift force oscillates at the shedding frequency, and the drag force oscillates at twice the shedding frequency. If the body's structural resonance frequency matches either of these, **vortex-induced vibration (VIV)** occurs. VIV has caused failures in: bridges (Tacoma Narrows, 1940), offshore oil risers (current active engineering problem), chimney stacks (add helical strakes to break up the shedding), suspension cables, power lines (galloping), and aircraft control surfaces.

A counterintuitive aspect: the shedding frequency locks onto the body's natural frequency over a range of flow speeds — called **lock-in**. Within the lock-in band, the body's oscillation modifies the shedding, which drives the oscillation further — a feedback loop. This is why VIV can persist over a range of wind speeds rather than occurring only at one precise resonance point.

Ocean currents produce Kármán streets behind islands. The Von Kármán streets in the wake of the Canary Islands are visible from space — each vortex is 20-30 km in diameter, contains a closed circulation of air, and persists for days. The same pattern at 10,000 km scale appears in the wake of islands in the Southern Ocean.

---

## The Fix

Use the Lattice Boltzmann Method (LBM) — much simpler to implement than finite-difference Navier-Stokes with pressure solve, and naturally handles incompressibility and the no-slip boundary condition.

```javascript
// D2Q9 Lattice Boltzmann Method for Kármán vortex street
const NX = 512, NY = 256;
const tau = 0.6;          // relaxation time; Re = (2*tau-1)/6 * NX/D * U
const U_lid = 0.1;        // inlet velocity (LBM units; keep < 0.3 for stability)

// D2Q9 weights and directions
const w = [4/9, 1/9, 1/9, 1/9, 1/9, 1/36, 1/36, 1/36, 1/36];
const cx = [0, 1, 0, -1, 0, 1, -1, -1, 1];
const cy = [0, 0, 1, 0, -1, 1, 1, -1, -1];

// f[x][y][q]: distribution function
const f = new Float32Array(NX * NY * 9);
const fNew = new Float32Array(NX * NY * 9);

function feq(rho, ux, uy, q) {
  const udotc = ux * cx[q] + uy * cy[q];
  const u2 = ux * ux + uy * uy;
  return w[q] * rho * (1 + 3*udotc + 4.5*udotc*udotc - 1.5*u2);
}

// Initialize: equilibrium at rest + small vertical perturbation to break symmetry
for (let y = 0; y < NY; y++) {
  for (let x = 0; x < NX; x++) {
    const perturbVy = 0.001 * Math.sin(2 * Math.PI * y / NY); // symmetry-breaker
    for (let q = 0; q < 9; q++) {
      f[(x + y*NX)*9 + q] = feq(1.0, U_lid, perturbVy, q);
    }
  }
}

function lbmStep() {
  // Collision
  for (let y = 0; y < NY; y++) {
    for (let x = 0; x < NX; x++) {
      const base = (x + y*NX)*9;
      // Compute macroscopic quantities
      let rho = 0, ux = 0, uy = 0;
      for (let q = 0; q < 9; q++) {
        rho += f[base+q];
        ux  += f[base+q] * cx[q];
        uy  += f[base+q] * cy[q];
      }
      ux /= rho; uy /= rho;
      // BGK collision
      for (let q = 0; q < 9; q++) {
        fNew[base+q] = f[base+q] - (f[base+q] - feq(rho,ux,uy,q)) / tau;
      }
    }
  }
  // Streaming
  for (let y = 0; y < NY; y++) {
    for (let x = 0; x < NX; x++) {
      for (let q = 0; q < 9; q++) {
        const xn = (x + cx[q] + NX) % NX;
        const yn = (y + cy[q] + NY) % NY;
        f[(xn + yn*NX)*9 + q] = fNew[(x + y*NX)*9 + q];
      }
    }
  }
  // Cylinder bounce-back boundary
  for (let y = 0; y < NY; y++) {
    for (let x = 0; x < NX; x++) {
      if (isSolid(x, y)) {
        const base = (x + y*NX)*9;
        const opposite = [0, 3, 4, 1, 2, 7, 8, 5, 6];
        for (let q = 0; q < 9; q++) {
          f[base + opposite[q]] = fNew[base + q];
        }
      }
    }
  }
}
```

With τ = 0.6 and U = 0.1, Re ≈ 100. After ~2000 steps: the wake becomes asymmetric, a vortex sheds from the top, then one from the bottom. After ~5000 steps: a full Kármán street extends 3 diameters downstream.

---

## The Wow Moment — Push It

**Reynolds number sweep (live):** Add a slider for τ (viscosity). At Re = 20: symmetric attached recirculation zones. Drag τ up slowly — at exactly Re ≈ 47, the wake goes unstable. The transition is a Hopf bifurcation: it's abrupt. Then Re = 200: the shedding becomes irregular. Re = 500: turbulent wake. All in one continuous sweep. Timestamp the Hopf bifurcation.

**Multiple cylinders:** Add a grid of 3×3 cylinders. Each cylinder sheds, but the streets interact — locking in, interference, complex patterns. Add a "pipe gap" and watch the vortex street thread through the gap. This looks like a textile loom pattern at high Re.

**Non-circular shapes:** Replace the cylinder with a square, triangle, airfoil (NACA profile, low angle of attack), and a flat plate. Show how the Strouhal number and shedding pattern changes. Airfoil at 5° AoA shows trailing-edge shedding with St ≈ 0.18. Flat plate at 90° (normal to flow): chaotic irregular shedding.

**Measure St in real time:** Plot the lift force F_y(t) on the cylinder (sum of pressure on one side minus the other) as a real-time oscilloscope trace. Take the FFT in a second panel — the shedding frequency peak appears and moves as Re is changed. Show St = fD/U staying near 0.21 across Re = 80 to 200.

---

## The Interactive Demo

- **Reynolds number** slider: Re = 10 to 500 (controls τ in LBM, equivalently kinematic viscosity)
- **Cylinder diameter** slider: D = 10 to 50 cells (changes physical Re at fixed τ and U)
- **Cylinder shape** selector: Circle | Square | Triangle | Flat plate | Custom (draw your own)
- **Number of cylinders** input: 1 to 9 in a configurable grid pattern
- **Color mode**: Vorticity | Speed | Pressure | Density (LBM ρ)
- **Streamlines** toggle: draw particle traces for the last N steps
- **Force plot** panel: real-time F_x and F_y on primary cylinder, with running FFT showing shedding frequency
- **Strouhal meter**: live readout of St = f·D/U computed from the FFT peak
- **Grid resolution**: 256×128 / 512×256 / 1024×512
- **Pause/Reset** and speed multiplier

---

## Production Notes

**Why LBM for this video:** LBM is simpler to implement correctly than finite-difference Navier-Stokes. The bounce-back boundary condition for the cylinder is two lines of code. The pressure solve is implicit in the collision step. This lets the tutorial focus on the physics rather than numerical methods. Show the D2Q9 stencil diagram prominently.

**Code to show:**
- The broken naive code — symmetric wake that doesn't shed
- The LBM equilibrium function feq — explain each term (rest, linear drift, quadratic correction)
- The symmetry-breaking perturbation (one line) — emphasize this is essential
- The bounce-back boundary condition — elegantly simple

**Visual layout:**
- Main canvas: 1024×256 (wide domain to show long vortex street downstream)
- Vorticity rendered with a diverging colormap (blue CW, red CCW) — the alternating signs of the street look spectacular
- Overlaid: animated streamlines showing flow going around the cylinder and rolling up
- Right panel: real-time oscilloscope of lift force — viewers can see the sinusoidal shedding

**Key cinematic moments:**
- 00:45 — Canary Islands satellite image — zoom in on vortex street
- 02:00 — Symmetric wake — "this is wrong, and it's going to stay wrong"
- 03:30 — First LBM step with perturbation — symmetric at first, then at exactly step 1500, the first vortex detaches (slow-motion replay)
- 05:00 — Live Re slider: the Hopf bifurcation crossing — the moment the wake goes unstable
- 06:30 — Force oscilloscope: clean sinusoidal trace, FFT shows sharp peak, live readout "St = 0.212"
- 07:30 — Multiple cylinders: interference pattern
- 08:30 — Reference to Tacoma Narrows: overlay footage over the simulation running at matching Re
- 09:30 — Sign off: "Any object in a flow sheds vortices. Your chimneys, your car antenna, the International Space Station"

---

## Tags
`fluid-simulation` `vortex-shedding` `karman-vortex` `reynolds-number` `strouhal-number` `bluff-body` `wake` `navier-stokes`

---

## Thumbnail

Left half: real wind tunnel smoke visualization of the Kármán vortex street — a black-and-white photo showing two alternating rows of vortex spirals clearly visible in the smoke. Right half: the simulation in vivid red-blue vorticity colormap, same pattern. A cylinder clearly visible in both. Top text: "EVERY CYLINDER DOES THIS" in bold white. Bottom text: "St ≈ 0.21" in yellow, with an arrow showing the alternating pattern. Red outlines circle matching vortices in the two halves.
