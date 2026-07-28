---
title: "Earthquakes Make Solid Ground Behave Like Water (Soil Liquefaction)"
id: M036
difficulty: 6/10
prereq: "None"
concept: "Soil liquefaction: cyclic shear stress from earthquake reduces effective stress in saturated cohesionless soils; when pore water pressure equals overburden pressure, soil behaves as a viscous liquid; Seed-Idriss simplified procedure."
tags: [soil-liquefaction, earthquake, pore-pressure, geotechnics, SPH, granular-flow, effective-stress, disaster]
category: medium
type: video-idea
---

# Earthquakes Make Solid Ground Behave Like Water (Soil Liquefaction)

**Alt title:** "When the Ground Turns to Quicksand: The Physics of Soil Liquefaction"
**Difficulty:** 6/10 | **Prereq:** None (basic pressure concepts helpful)

---

## Opening Hook (0:00–1:00)

Archival footage of the 1964 Niigata earthquake in Japan: apartment buildings slowly tipping over, not crumbling — tilting like leaning towers and coming to rest at 30–45 degree angles, intact. People inside survived. The buildings didn't fall — they *floated* because the ground beneath them had become a liquid.

Voiceover: *"The soil beneath those buildings was sand saturated with water. Before the earthquake, it behaved as solid ground. During the earthquake — about 90 seconds of shaking — the internal pressure of the trapped water built up until it equaled the weight of the buildings above it. At that moment, the friction between sand grains vanished. The solid ground became a fluid. The buildings floated, tipped, and settled into their new positions. This is soil liquefaction. Let's code it."*

Show a simulation preview: a particle-based soil model under cyclic shaking. The particles initially form a solid heap. As shaking increases, a building (rigid block) starts to sink. Then tilts. The "soil" flows around it. When shaking stops, the soil re-solidifies with the building permanently tilted.

---

## The Naive Attempt

**What we code first:** A 2D SPH (Smoothed Particle Hydrodynamics) simulation where particles are either sand (high viscosity, friction) or water (low viscosity). A rigid block sits on top. Apply horizontal sinusoidal forcing to model the earthquake.

```javascript
// Naive: two-phase SPH without pore pressure coupling
// Soil particles modeled as high-viscosity fluid — wrong!

class Particle {
  constructor(x, y, type) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.type = type; // 'soil' or 'water'
    this.mass = type === 'soil' ? 2.0 : 1.0;
    this.rho = 0; this.pressure = 0;
  }
}

const SPH_H = 20; // smoothing radius (pixels)
const RHO0_SOIL = 2.0; // reference density for soil
const RHO0_WATER = 1.0;
const K_STIFFNESS = 1000; // pressure stiffness
const MU_SOIL = 50;   // viscosity of soil (naive: very high)
const MU_WATER = 1;

function poly6Kernel(r, h) {
  if (r > h) return 0;
  const x = (h*h - r*r);
  return (315 / (64 * Math.PI * Math.pow(h, 9))) * x * x * x;
}

function spikyKernelGrad(dx, dy, r, h) {
  if (r > h || r < 1e-6) return {x: 0, y: 0};
  const c = -45 / (Math.PI * Math.pow(h, 6)) * (h - r) * (h - r) / r;
  return {x: c * dx, y: c * dy};
}

function computeDensity(particles) {
  for (const pi of particles) {
    pi.rho = 0;
    for (const pj of particles) {
      const dx = pi.x - pj.x, dy = pi.y - pj.y;
      const r = Math.sqrt(dx*dx + dy*dy);
      pi.rho += pj.mass * poly6Kernel(r, SPH_H);
    }
    const rho0 = pi.type === 'soil' ? RHO0_SOIL : RHO0_WATER;
    pi.pressure = K_STIFFNESS * (pi.rho / rho0 - 1);
  }
}

// Problem: treating soil as a high-viscosity fluid ignores grain friction
// and pore pressure coupling. Soil particles just flow slowly — no
// sudden liquefaction transition.
```

The naive simulation shows the block slowly sinking into the high-viscosity "soil" from the very start — even without any earthquake shaking. Because the model treats soil as a viscous fluid, it has no solid phase at all. There's no phase transition, no critical pore pressure, no sudden change from solid to liquid behavior. The simulation is qualitatively wrong: soil before liquefaction should be solid (the block should sit stably on it), and only after the earthquake should it transition to fluid behavior.

---

## The Moment of Failure

Run the simulation with earthquake forcing (horizontal sin wave, amplitude A = 20px, frequency f = 2Hz). The block starts sinking immediately, even at t=0 before any shaking. This is wrong: real soil (before liquefaction) supports buildings for decades.

Add a "soil stability indicator" — a readout of the friction angle φ at the contact between the block and the soil layer. Real dry sand has φ ≈ 35°. Below that angle, sand is stable; above, it fails. In the naive SPH model, there is no friction angle — soil just flows with viscosity μ_soil. 

Reduce μ_soil to 5 to see what "partial liquefaction" looks like: the block sinks faster. Increase to 500: the block barely sinks but the soil "flows" unrealistically (it should be rigid). There is no parameter combination that reproduces the correct behavior: stable before shaking, suddenly fluid during shaking.

The diagnostic: plot block descent rate vs. time. Real behavior: flat (stable) for first few earthquake cycles, then rapid sinking as pore pressure builds. Naive model: monotonically increasing descent rate from t=0.

---

## Why It Broke — The Physics

The key concept missing from the naive model is **effective stress** and **pore water pressure coupling**.

In saturated soil, the total stress σ at any point equals the effective stress σ' plus the pore water pressure u:

```
σ = σ' + u   →   σ' = σ - u
```

**Effective stress** σ' is the stress carried by the grain-to-grain contacts. It determines friction: the Mohr-Coulomb shear strength is τ = c + σ'·tan(φ), where c is cohesion (zero for sand) and φ is the friction angle. When σ' > 0, grains push on each other → friction → solid behavior. When σ' = 0, grains don't touch → no friction → soil flows like a fluid.

Under the weight of a building (overburden pressure σᵥ) and normal hydrostatic water pressure u₀ = ρ_w · g · z:
```
σ'₀ = σᵥ - u₀ > 0   →   soil is solid, building is stable
```

During an earthquake, cyclic shear stresses Δτ are applied to the soil. Each shear cycle tends to compact loose sand (reduce void ratio). Because the water is trapped (undrained conditions during rapid loading), this compaction cannot expel water — instead, water pressure increases by Δu. After N cycles:
```
u = u₀ + N · Δu
σ' = σᵥ - u = σ'₀ - N · Δu
```

When N · Δu = σ'₀ → σ' = 0 → liquefaction. The building floats because σ' = 0 means the buoyant pressure of the water now equals the total overburden, so the building sinks.

The **Seed-Idriss simplified procedure** (1971) estimates the number of cycles to liquefaction:
```
CSR = τ_cyc / σ'₀ = 0.65 · (a_max/g) · (σᵥ/σ'₀) · rₐ
CRR = cyclic resistance ratio (from SPT blow count or lab tests)
Liquefaction when CSR ≥ CRR
```
where a_max is peak ground acceleration and rₐ is a depth-dependent stress reduction factor.

---

## The One Concept

**Effective Stress, Pore Pressure Buildup, and the Liquefaction Transition**

Karl Terzaghi introduced effective stress in 1925: the mechanical behavior of a saturated porous medium is controlled entirely by the effective stress σ' = σ - u, not the total stress σ. This is one of the most powerful principles in geotechnics. It explains why buildings sink in clay (pore pressure slowly dissipates as water is expelled), why slope failure occurs during heavy rain (water pressure reduces effective stress, reducing friction), and why liquefaction occurs during earthquakes.

For loose, saturated cohesionless sand (the most susceptible material to liquefaction): the grains are not tightly packed. Under cyclic shear, they try to rearrange into a denser packing. In a drained condition (slow loading), they would do so, expelling water and becoming denser and stronger. But during an earthquake (rapid loading, undrained), the water cannot escape fast enough. As grains try to compact, the water pressure rises instead. This is a direct consequence of the coupling between solid skeleton and pore fluid — captured by the **Biot consolidation theory**.

The pore pressure ratio r_u = u/σ'₀ rises from 0 (initial state) to 1 (liquefaction). The liquefaction transition is sharp: between r_u = 0.9 and r_u = 1.0, shear strength drops by 90%. This is why liquefaction appears sudden: the ground can look completely solid until the moment it fails.

**The simulation model:** We model soil as SPH particles with an additional state variable: pore pressure ratio r_u ∈ [0, 1]. The effective viscosity and pressure are functions of r_u:
```
η_eff(r_u) = η_solid · (1 - r_u)³ + η_liquid · r_u³
```
This interpolates from solid (high η) to liquid (low η) behavior as r_u increases. The transition is cubic (sharp near r_u = 1). Additionally, the contact forces between particles are multiplied by (1 - r_u): at full liquefaction, grain-to-grain forces vanish and particles interact only through fluid pressure.

The pore pressure builds up with each shear cycle: Δr_u per half-cycle depends on the cyclic stress ratio CSR and the soil's cyclic resistance. A simplified model:
```
Δr_u = α · (|γ_shear| - γ_threshold)   if |γ_shear| > γ_threshold else 0
```
where γ_shear is the shear strain of the soil element (estimated from relative particle motion), γ_threshold is a threshold below which no pore pressure builds (~0.01%), and α is a calibration constant. Pore pressure also dissipates slowly (drainage) at a rate proportional to the permeability of the soil and the pressure gradient.

**Why buildings tip rather than sink straight down:** The initial trigger for tilting is random asymmetry — a slight weight eccentricity, a non-uniform liquefaction front, or a small initial tilt. Once a tilt begins, the overturning moment from the eccentric weight exceeds the restoring moment from the (now reduced) soil friction. The building accelerates in its tilt. In Niigata 1964, some buildings tipped to near-horizontal before stopping, with residents walking out through windows.

**Historical disasters:** The 1964 Niigata earthquake (Japan), the 1989 Loma Prieta earthquake (San Francisco's Marina District was reclaimed land — highly susceptible), the 2011 Tōhoku earthquake (extensive liquefaction in Tokyo Bay reclaimed lands), and the 2010 Christchurch earthquake (liquefaction ejected 400,000 tons of liquefied sand onto streets). Liquefaction is now a standard geotechnical assessment in earthquake-prone regions: the Seed-Idriss procedure and its successors are used by engineers worldwide.

---

## The Fix

```javascript
// Fix: SPH with pore pressure state variable and effective stress coupling

class SoilParticle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.mass = 1.5;
    this.rho = 0;
    this.pressure = 0;
    this.r_u = 0;            // pore pressure ratio [0=solid, 1=liquefied]
    this.shearStrain = 0;    // accumulated shear strain
  }
}

const ALPHA_PORE = 0.002;       // pore pressure buildup rate
const GAMMA_THRESHOLD = 0.005;  // shear strain threshold for pore buildup
const DRAINAGE_RATE = 0.00005;  // pore pressure dissipation per step
const ETA_SOLID = 200;          // viscosity when r_u = 0
const ETA_LIQUID = 0.5;         // viscosity when r_u = 1

function effectiveViscosity(r_u) {
  // Cubic interpolation from solid to liquid
  const t = r_u * r_u * r_u;
  return ETA_SOLID * (1 - t) + ETA_LIQUID * t;
}

function computeShearStrain(pi, particles) {
  // Estimate local shear strain from velocity gradient
  let dvy_dx = 0, count = 0;
  for (const pj of particles) {
    const dx = pi.x - pj.x, dy = pi.y - pj.y;
    const r2 = dx*dx + dy*dy;
    if (r2 < SPH_H * SPH_H && r2 > 1) {
      const r = Math.sqrt(r2);
      const W = poly6Kernel(r, SPH_H);
      dvy_dx += (pj.vx - pi.vx) * (-dy) / r2 * W;
      count++;
    }
  }
  return count > 0 ? Math.abs(dvy_dx / count) : 0;
}

function updatePorePressure(particles, earthquakeAccel) {
  for (const p of particles) {
    // Pore pressure builds from cyclic shear
    const gamma = computeShearStrain(p, particles);
    p.shearStrain = 0.95 * p.shearStrain + 0.05 * gamma; // low-pass filter
    
    if (p.shearStrain > GAMMA_THRESHOLD) {
      p.r_u += ALPHA_PORE * (p.shearStrain - GAMMA_THRESHOLD) * Math.abs(earthquakeAccel);
    }
    
    // Drainage: pore pressure slowly dissipates
    p.r_u -= DRAINAGE_RATE;
    p.r_u = Math.max(0, Math.min(1, p.r_u));
  }
}

// Color visualization: blue (solid) → yellow → red (liquefied)
function particleColor(r_u) {
  const r = Math.floor(r_u * 255);
  const g = Math.floor((1 - 2*Math.abs(r_u - 0.5)) * 200);
  const b = Math.floor((1 - r_u) * 255);
  return `rgb(${r},${g},${b})`;
}
```

The earthquake motion is applied as a horizontal body force: `p.vx += a_max * sin(2π·f·t) * dt` where `a_max` is peak ground acceleration and `f` is frequency. As the simulation runs, shear strain builds up in lower soil layers, r_u increases, and the building starts to sink once r_u > 0.7 in the contact zone. When r_u → 1, the building accelerates its sinking and tilts.

---

## The Wow Moment — Push It

**The Niigata scenario:** Place three buildings of different weights on the soil layer. Apply 90 seconds of earthquake shaking at 0.2g. The lightest building sinks and tips to 45°. The middle building sinks 2m and tilts 20°. The heaviest building (larger overburden) is most stable at first but its larger weight accelerates sinking once liquefaction occurs. Replay in slow motion with a time-lapse of r_u color map.

**Mitigation comparison:** Three panels: (1) unreinforced loose sand — complete liquefaction in 30 seconds. (2) Densified sand (lower ALPHA_PORE) — partial liquefaction, building tilts only 5°. (3) Stone columns/piles (model as vertical lines of rigid particles with drainage) — no liquefaction, drainage prevents pore pressure buildup. Show why ground improvement saves buildings.

**Lateral spreading:** Instead of a building, apply a gentle slope to the soil surface. During liquefaction, the surface soil flows laterally downslope like a very viscous river. The flow speed, run-out distance, and final slope angle all emerge from the simulation. This is "lateral spreading" — a major cause of damage to bridges and buried utilities in earthquakes.

---

## The Interactive Demo

- **Peak ground acceleration a_max** (0.0 to 0.5g): the earthquake intensity; below 0.05g no liquefaction; above 0.3g rapid liquefaction in loose sand
- **Earthquake frequency** (0.5 to 5 Hz): typical earthquakes are 0.5–2 Hz; higher frequency = more shear cycles per second = faster pore pressure buildup
- **Earthquake duration** (5 to 120 s): real earthquake main shocks last 20–90 seconds; longer = more cumulative shear cycling
- **Soil density** (loose / medium / dense): loose sand is most susceptible; dense sand rarely liquefies; changes ALPHA_PORE and GAMMA_THRESHOLD
- **Initial water table depth** (0 to 5m below surface): deeper water table → less saturated zone → less susceptible to liquefaction; particles above water table are drier (reduced r_u buildup)
- **Pore pressure ratio map toggle**: color soil particles by r_u value (blue=0, red=1); shows liquefaction front advancing upward from base
- **Building weight** (1 to 10× base): heavier buildings have higher overburden → initially more stable but sink faster once liquefied
- **Drainage coefficient** (0.0 to 0.001): models soil permeability; higher = pore pressure drains faster = less susceptible; gravel drains well (high), clay drains poorly (low), sand is intermediate
- **Ground improvement mode** (none / densification / stone columns): toggles mitigation measures; densification reduces ALPHA_PORE; stone columns add drainage pathways
- **Replay**: step back to any point in the simulation and replay; time-speed control 0.25× to 10×
- **r_u graph**: live plot of maximum r_u in soil column vs. time; shows the buildup and the critical threshold (r_u=1 marked with a red line); dramatic moment when the line is crossed

---

## Production Notes

**Code structure:**
- `index.html`: canvas (left 70%) + panel (right 30%); status bar showing current earthquake time, a_max, max r_u
- `sph.js`: SPH density/pressure computation, kernel functions, force computation with viscosity term using effectiveViscosity(r_u)
- `pore-pressure.js`: shear strain estimation, r_u update, drainage; the heart of the physics
- `earthquake.js`: seismic forcing: sinusoidal + Ricker wavelet + recorded ground motion playback (load real Niigata 1964 accelerogram as a pre-stored array)
- `building.js`: rigid block (4 particles + constraints, or just a drawn rectangle with rigid body physics); tip angle tracker
- `renderer.js`: particle rendering (circles, colored by r_u); building rendering (gray rectangle with rotation); r_u graph; arrows showing earthquake ground motion
- `spatial-hash.js`: for SPH neighbor search (same as in hair simulation)

**Key cinematic moments:**
1. *Niigata footage* (0:00–0:30): archival clips (check CC license), buildings tilting. Silent, slow. "The ground turned to liquid."
2. *Effective stress diagram* (2:00): simple diagram of a soil element. σ = σ' + u. "The building stands because of σ'. When σ'=0 it floats."
3. *r_u buildup animation* (4:00): show the soil in blue. Earthquake starts. Color slowly shifts from blue to red from bottom up. "The liquefaction front is rising."
4. *The critical moment* (6:00): r_u hits 1 at the foundation level. The building starts to sink. Accelerates. Tilts. Music stings. "It's happening."
5. *Final state* (7:00): earthquake stops. Pore pressure drains. r_u drops. Soil resolidifies — around the now-tilted building. It is permanently embedded in solid ground at a 35° angle. "Trapped."
6. *Mitigation comparison* (10:00): three scenarios side by side. Unreinforced: building tilts 40°. Densified: tilts 8°. Stone columns: no tilt. "This is why ground improvement costs $10M and saves buildings."

**Simulation note:** SPH with 500 soil particles + 1 building runs at ~60fps in JavaScript. The O(N²) naive SPH needs a spatial hash for N>300. Use a grid cell size = 2·h for the neighbor search. For the 3-panel comparison, run three independent simulations in three canvases, each in a Web Worker.

---

## Tags
`soil-liquefaction` `earthquake` `pore-pressure` `geotechnics` `SPH` `granular-flow` `effective-stress` `disaster`

---

## Thumbnail

Split image: left side shows the famous Kawagishi-cho apartment buildings of Niigata 1964 tilted at 60° angles (archival photo, public domain). Right side shows the simulation equivalent: a rectangular building block tilted at the same angle, surrounded by particles colored from blue (stable soil) to red (liquefied soil), with a clear red zone at foundation level. Bold white text overlaid: "THE GROUND TURNED TO LIQUID." A small inset diagram in the lower-left shows the formula σ' = σ - u with an arrow labeled "Liquefaction when u = σ."
