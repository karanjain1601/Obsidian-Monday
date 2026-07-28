---
title: "Rotating Cylinders Create Stunning Flow Patterns (Taylor-Couette)"
id: M008
difficulty: 6/10
prereq: "None"
concept: "Flow between concentric rotating cylinders; Taylor number Ta measures rotation vs viscous forces; Taylor vortex flow (toroidal rolls) at Ta > Ta_c; further: wavy vortex flow, turbulent Taylor vortices."
tags: [taylor-couette, rotating-flow, vortex, instability, fluid-simulation, viscosity, toroidal-rolls, bifurcation]
category: medium
type: video-idea
---

# Rotating Cylinders Create Stunning Flow Patterns (Taylor-Couette)

**Alt title:** "Two Spinning Cylinders Produce Every Route to Chaos Known to Physics"
**Difficulty:** 6/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Two clear acrylic cylinders, one inside the other, filled with water and food coloring. The inner cylinder starts spinning. At low RPM: the fluid spins uniformly — Couette flow, smooth and featureless. Slowly increase the RPM. At a precise rotation speed, a stunning transformation: the fluid spontaneously organizes into a stack of donut-shaped rings, alternating red and blue. The rings are perfectly periodic. They can be counted: 8, 10, 12 cells depending on the gap width.

Increase the speed further: the rings start to undulate — a sine wave traveling around each ring. More speed: the undulations become irregular. More still: the rings dissolve into turbulence. But even in turbulence, a ghost of the rings remains.

"G.I. Taylor used this experiment in 1923 to quantitatively verify viscous fluid mechanics for the first time. Today we'll code it. Our naive approach will give you smooth Couette flow that never transitions — ever."

---

## The Naive Attempt

Model the flow in a 2D annular domain (cross-section of the two cylinders). The inner cylinder rotates at angular velocity Ω₁, outer cylinder is fixed. Use a simple azimuthal velocity profile.

```javascript
// 2D polar grid: r from R1 (inner) to R2 (outer)
// N_r radial cells, N_theta azimuthal cells
const R1 = 0.5, R2 = 1.0;   // inner/outer radii
const Omega1 = 2.0;           // inner cylinder angular velocity (rad/s)
const nu = 0.01;              // kinematic viscosity

const Nr = 64, Nt = 128;
const dr = (R2 - R1) / Nr;
const dtheta = 2 * Math.PI / Nt;

// Azimuthal velocity array v_theta[r][theta]
const v_theta = new Float32Array(Nr * Nt);

// Initialize with analytic Couette profile: v = A*r + B/r
// A = -Omega1*R1²/(R2²-R1²), B = Omega1*R1²*R2²/(R2²-R1²)
const A = -Omega1 * R1*R1 / (R2*R2 - R1*R1);
const B =  Omega1 * R1*R1 * R2*R2 / (R2*R2 - R1*R1);
for (let ri = 0; ri < Nr; ri++) {
  const r = R1 + (ri + 0.5) * dr;
  for (let ti = 0; ti < Nt; ti++) {
    v_theta[ri * Nt + ti] = A * r + B / r;
  }
}

// Naive step: just diffuse the azimuthal velocity (no pressure, no axial component)
function step(dt) {
  for (let ri = 1; ri < Nr-1; ri++) {
    const r = R1 + (ri + 0.5) * dr;
    for (let ti = 0; ti < Nt; ti++) {
      const idx = ri * Nt + ti;
      const v_r = v_theta[(ri+1)*Nt+ti] - 2*v_theta[idx] + v_theta[(ri-1)*Nt+ti];
      // Missing: v_theta/r terms from cylindrical Laplacian, no axial flow
      v_theta[idx] += nu * dt * v_r / (dr * dr);
    }
  }
}
```

The simulation reaches a steady azimuthal velocity profile that matches the analytic Couette solution and stays there forever. No toroidal rolls. No axial flow. No wavy instability.

---

## The Moment of Failure

On screen: the annular domain rendered as a 2D ring. Color represents azimuthal speed — a smooth gradient from bright (inner, fast) to dark (outer, slow), perfectly axisymmetric. The velocity profile T(r) plotted radially is the classic hyperbolic Couette curve A·r + B/r. It never changes. No matter how high Ω₁ is set.

The failure is physical: the 2D cross-section (r, θ) simulation completely misses the axial direction z. Taylor vortices are toroidal — they have motion in the r-z plane (fluid spins in vertical rings), which is invisible in a purely azimuthal 2D simulation. Additionally, the analytic Couette profile is a valid steady solution of the Navier-Stokes equations at all Reynolds numbers — the simulation correctly finds it but never checks whether it's stable. The instability to Taylor vortices is an instability in the AXIAL direction, invisible in a 2D (r, θ) domain.

---

## Why It Broke — The Physics

The Taylor-Couette instability is fundamentally a **centrifugal instability**. In the Couette flow profile, the angular momentum L = r·v_θ increases outward (for an inner-rotating, outer-stationary system). By Rayleigh's circulation criterion: a flow is centrifugally stable if d(L)/dr > 0 everywhere. In Couette flow, L = r(Ar + B/r) = Ar² + B — the gradient dL/dr = 2Ar. Since A < 0 (for inner-rotating case), dL/dr < 0 — the flow is centrifugally unstable.

Physical picture: consider a fluid parcel at radius r displaced outward to r + dr. The parcel carries its angular momentum L = rv_θ. At the new location r + dr, the background angular momentum of the flow is L_flow(r+dr) < L_flow(r) (since dL/dr < 0). The parcel has more angular momentum than its new neighbors — it experiences a stronger centrifugal push outward than the restoring pressure, so it keeps moving out. This is unstable.

The **Taylor number** quantifies rotation vs. viscous forces:

$$Ta = \frac{\Omega_1^2 R_1 (R_2-R_1)^3}{\nu^2}$$

(various slightly different definitions exist; the criterion is Ta > Ta_c ≈ 1712 for narrow gap). At Ta > Ta_c, pairs of counter-rotating toroidal vortices appear in the axial direction — **Taylor vortex flow** (TVF). The vortex wavelength is approximately 2d (two gap widths) axially.

As Ta increases further: **wavy vortex flow** (WVF) — the vortex boundaries develop azimuthal waves, rotating around the annulus. Then **modulated wavy vortex flow** — the waves themselves oscillate. Then **chaotic wavy vortex flow**. Finally: **turbulent Taylor vortex flow** — still showing the ghost of periodic vortex structure even in fully turbulent conditions. This sequence — steady → periodic → quasiperiodic → chaos — is a textbook example of the **Ruelle-Takens route to chaos** through a sequence of Hopf bifurcations.

The full simulation requires a 3D or (r, z) 2D axisymmetric domain (using azimuthal symmetry to reduce 3D to 2D). The key variable is the axial velocity component v_z, which is zero in Couette flow and nonzero in Taylor vortex flow.

---

## The One Concept

**Taylor-Couette flow** is the flow between two concentric rotating cylinders. The simple case — inner cylinder rotating, outer cylinder stationary — was analyzed by G.I. Taylor in 1923 in a landmark paper that represented the first quantitative agreement between theory and experiment for a hydrodynamic instability. Taylor varied the rotation speed of the inner cylinder and measured the onset of vortices using both theoretical prediction and direct observation — the agreement was within 1%. This was one of the most precise validations of the Navier-Stokes equations ever done.

The system is celebrated because it displays an extraordinarily rich sequence of dynamical states as the rotation speed is increased, making it the canonical model system for studying routes to turbulence. The sequence (TVF → WVF → MWVF → Chaotic WVF → Turbulent TVF) corresponds to a succession of Hopf bifurcations — each adds a new frequency to the dynamics, and the route to chaos is the classic Ruelle-Takens scenario: chaos arises from the superposition of incommensurate frequencies.

The Taylor vortex pairs are toroidal rolls (donuts) stacked vertically. Adjacent vortices in a pair rotate in opposite directions (one clockwise in the r-z plane, the next counterclockwise). The alternating sense of rotation is enforced by the boundary conditions at the top and bottom end caps, which determine whether the vortex at each end is a clockwise or counterclockwise one — a global constraint on the whole stack. Changing the end cap boundary conditions (from stationary to rotating) can change the number of vortices by one — a global bifurcation. Jumps between states with N and N+2 vortices are observed and are hysteretic.

The wavy instability — where each toroidal ring develops an azimuthal wave — is analogous to the Kelvin-Helmholtz instability of the vortex boundaries. The wave travels azimuthally at a phase speed that is approximately the mean of the inner and outer cylinder speeds. The number of azimuthal waves m depends on the rotation speed ratio — m can be measured experimentally and has been predicted from linear stability theory of the Taylor vortex state.

Applications of Taylor-Couette physics: ball bearing lubrication (the gap between inner and outer races undergoes Taylor vortex flow under some conditions, affecting wear), centrifuge design (Taylor vortices in centrifuges redistribute separated material), blood flow in curved arteries (Dean vortices, the curvilinear analog), industrial mixing (Taylor-Couette bioreactors use the highly efficient vortex mixing for cell culture), and geophysical flows (the Earth's outer core is in some sense a Taylor-Couette apparatus — liquid iron between solid inner and outer boundaries, rotating).

---

## The Fix

Simulate in the (r, z) meridional plane using azimuthal symmetry. Track the velocity components (v_r, v_z, v_θ) as functions of (r, z). The azimuthal momentum equation decouples from the meridional flow in the linearized regime but couples back nonlinearly.

```javascript
// 2D axisymmetric (r, z) simulation of Taylor-Couette flow
// Variables at each (r, z) point: vr, vz, vphi (azimuthal), and pressure p

const NR = 64, NZ = 256;  // radial and axial resolution
const R1 = 0.5, R2 = 1.0;
const HEIGHT = 4.0;        // axial domain height
const dr = (R2 - R1) / NR;
const dz = HEIGHT / NZ;
const Omega1 = 3.0;        // inner rotation (set above critical)
const nu = 0.01;

// Initialize: Couette profile + small axial perturbation to seed instability
for (let zi = 0; zi < NZ; zi++) {
  for (let ri = 0; ri < NR; ri++) {
    const r = R1 + (ri + 0.5) * dr;
    const A = -Omega1*R1*R1/(R2*R2-R1*R1);
    const B =  Omega1*R1*R1*R2*R2/(R2*R2-R1*R1);
    vphi[ri + zi*NR] = A*r + B/r;
    vr[ri + zi*NR] = 0.01 * Math.sin(Math.PI * zi / NZ); // axial seed
    vz[ri + zi*NR] = 0;
  }
}

// Cylindrical Laplacian in r: (1/r)d/dr(r dv/dr) = v_rr + v_r/r
function cylindricalLap_r(field, ri, zi) {
  const r = R1 + (ri + 0.5) * dr;
  const f = field[ri + zi*NR];
  const fp = ri < NR-1 ? field[(ri+1) + zi*NR] : f;
  const fm = ri > 0    ? field[(ri-1) + zi*NR] : f;
  const fz_pp = zi < NZ-1 ? field[ri + (zi+1)*NR] : f;
  const fz_mm = zi > 0    ? field[ri + (zi-1)*NR] : f;
  const drr = (fp - 2*f + fm) / (dr*dr);
  const dr1 = (fp - fm) / (2*dr*r);  // 1/r * df/dr term
  const dzz = (fz_pp - 2*f + fz_mm) / (dz*dz);
  return drr + dr1 + dzz;
}

function step(dt) {
  for (let zi = 1; zi < NZ-1; zi++) {
    for (let ri = 1; ri < NR-1; ri++) {
      const idx = ri + zi*NR;
      const r = R1 + (ri + 0.5) * dr;
      // Azimuthal momentum: dv_phi/dt = nu*(lap(v_phi) - v_phi/r²) + Coriolis-like term
      const lap_vphi = cylindricalLap_r(vphi, ri, zi) - vphi[idx]/(r*r);
      const centripetal_correction = -vr[idx] * vphi[idx] / r;
      vphiNew[idx] = vphi[idx] + dt*(nu*lap_vphi + centripetal_correction);
      // Meridional equations (simplified): centrifugal forcing + viscosity
      const centrifugal = vphi[idx]*vphi[idx]/r; // centrifugal force drives outward vr
      vrNew[idx] = vr[idx] + dt*(nu*cylindricalLap_r(vr,ri,zi) + centrifugal);
    }
  }
  pressureProject_cylindrical(); // ∇·(r*v) = 0 in cylindrical coords
}
```

After ~1000 steps: Taylor vortex pairs appear as alternating outward/inward jets in v_r. The vortex boundaries are visible as rings of concentrated v_z. Render as a 2D image: the r-z plane, with color showing v_phi (fast = red, slow = blue) — the familiar horizontal banding of the physical experiment.

---

## The Wow Moment — Push It

**Route to chaos in real time:** Set up a long axial domain. Slowly sweep Ω₁ upward while the simulation runs. Mark each transition: TVF onset, first azimuthal waviness, second frequency (quasiperiodic), chaos onset. Overlay a real experimental bifurcation diagram from the literature — match the transition sequence point by point.

**Counter-rotating case:** Set both cylinders rotating in opposite directions (Ω₁ > 0, Ω₂ < 0). This produces **interpenetrating spirals** — helical bands of counter-rotating fluid that wind around the annulus. At high enough speeds, the spirals break into turbulence but retain a helical structure. The colors (from different initial tracers) produce a striped barber-pole pattern.

**End-cap effects:** Simulate a finite height domain with no-slip end caps. The end caps drive Ekman pumping — a secondary circulation driven by the boundary layer at the top and bottom walls. The Ekman pumping can change the number of Taylor vortex pairs (between 8 and 10 pairs for a given geometry) by one, depending on the history — this is the famous **Taylor vortex multiplicity**. Show both 8-cell and 10-cell states at the same Ω₁.

---

## The Interactive Demo

- **Inner cylinder speed** slider: Ω₁ = 0 to 20 rad/s (spans Couette → TVF → WVF → chaos)
- **Outer cylinder speed** slider: Ω₂ = -10 to +10 rad/s (counter-rotation enables spirals)
- **Gap width** slider: η = R₁/R₂ = 0.2 to 0.9 (narrow vs. wide gap; changes TVF onset)
- **Aspect ratio** slider: Γ = Height/(R₂-R₁) = 2 to 20 (number of cells that fit)
- **Viscosity** slider: ν = 0.001 to 0.5 (controls Taylor number at fixed Ω)
- **Color mode**: Azimuthal velocity | Radial velocity | Vorticity | Axial velocity
- **Tracer injection**: click to inject a colored tracer fluid at any point — watch it wrap around the vortex cores
- **Taylor number readout**: live Ta display with threshold Ta_c marked
- **State identification**: auto-label "Couette" / "TVF" / "WVF" / "Chaotic" based on flow statistics
- **Pause/Reset** and speed controls

---

## Production Notes

**Code to show:**
- The broken 2D azimuthal model — explain why z-direction is essential
- The cylindrical Laplacian formula — distinguish from Cartesian; emphasize the extra 1/r term
- The centrifugal term in the azimuthal momentum equation — this is the coupling that drives v_r
- The pressure projection in cylindrical coordinates — stress the cylindrical ∇·u form

**Visual layout:**
- Left panel (tall, thin): the r-z cross-section showing Taylor vortex rings — the standard visualization
- Right panel (circular): a 3D cutaway rendering of the annulus with the Taylor vortex cells visible as colored bands — use a revolve transform around the z-axis
- Bottom panel: plot of v_r(t) at a fixed point (shows Hopf bifurcations as the signal goes from 0 → periodic → quasiperiodic → chaotic as Ω₁ increases)

**Key cinematic moments:**
- 00:30 — Real physical experiment (food-coloring visualization) — the rings appear
- 02:00 — Broken 2D simulation: eternal smooth Couette flow
- 03:30 — Fix: axial perturbation seed + r-z simulation: first Taylor vortex pair appears
- 05:00 — Slow Ω₁ sweep: all four flow regimes in sequence — the route to chaos
- 06:30 — 3D cutaway rendering: beautiful rotating barber-pole pattern for counter-rotation case
- 07:30 — Tracer injection: colored fluid wraps around vortex cores in a helical ribbon
- 08:30 — "G.I. Taylor used this experiment to prove the Navier-Stokes equations describe reality. His theory agreed with experiment to within 1%. That had never been done before for turbulent-ish flow."

---

## Tags
`taylor-couette` `rotating-flow` `vortex` `instability` `fluid-simulation` `viscosity` `toroidal-rolls` `bifurcation`

---

## Thumbnail

A 3D rendered cutaway of the Taylor-Couette apparatus — two transparent cylinders, the inner one glowing orange, with vivid horizontal bands of alternating red and blue fluid visible in the gap (the Taylor vortex cells). The bands have a slight wave to them (wavy vortex flow regime). Bold white text: "SPINNING CREATES DONUTS". Sub-label: "Then donuts become chaos." Bottom: Ta > 1712 in yellow. Real experimental photo inset in top-left corner showing identical banding pattern in food coloring.
