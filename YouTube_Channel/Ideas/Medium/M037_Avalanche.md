---
title: "A Snow Slab Lets Go: Avalanche Physics"
id: M037
difficulty: 6/10
prereq: "None"
concept: "Slab avalanche: a weak layer beneath a cohesive slab fails; propagating crack in the weak layer; crack reaches critical length → unstable runaway fracture; granular flow dynamics on the slope below."
tags: [avalanche, slab-avalanche, fracture, granular-flow, snow, weak-layer, SPH, disaster]
category: medium
type: video-idea
---

# A Snow Slab Lets Go: Avalanche Physics

**Alt title:** "The Invisible Crack That Causes Avalanches (Slab Fracture Physics)"
**Difficulty:** 6/10 | **Prereq:** None (basic fracture concepts help)

---

## Opening Hook (0:00–1:00)

Aerial footage of an avalanche crown — the clean fracture line at the top of a slope where a slab avalanche has released. The fracture line is horizontal, razor-sharp, and runs across hundreds of meters of slope. Below it, a vast white slab has disappeared, leaving bare, dark ground.

Voiceover: *"Most people think of avalanches as snow sliding on a slippery slope. But the deadliest avalanches — slab avalanches — are fundamentally a fracture problem. A thin, fragile layer of snow buried beneath a strong cohesive slab propagates a crack hundreds of meters in milliseconds. The trigger can be a single skier. The result: a 30,000-ton slab accelerating to 100 km/h in under 10 seconds. Today we model this from first principles — and discover why the fracture criterion is the same as in glass, concrete, and bone."*

Show the simulation: a cross-section of a snowy slope. A thin weak layer is highlighted in red. A skier appears. A hairline crack appears at the skier's position. It races outward. The slab releases. Chaos.

---

## The Naive Attempt

**What we code first:** A slope of particles (2D SPH) with two layers — a strong cohesive top slab and a weak basal layer. Apply gravity. Let it flow. Add a threshold: when the basal layer's stress exceeds a shear strength, switch all particles to "failed" and let the slab flow as a granular material.

```javascript
// Naive: uniform failure threshold, no crack propagation
class SnowParticle {
  constructor(x, y, layer) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.mass = 1.0;
    this.layer = layer; // 'slab', 'weak', 'substrate'
    this.failed = false;
  }
}

const SLOPE_ANGLE = 35 * Math.PI / 180; // 35 degrees
const g = 9.81;
const gx = g * Math.sin(SLOPE_ANGLE);   // gravity along slope
const gy = g * Math.cos(SLOPE_ANGLE);   // gravity perpendicular to slope

// Weak layer failure threshold
const TAU_WEAK = 500; // Pa, uniform threshold

function checkWeakLayerFailure(particles) {
  for (const p of particles) {
    if (p.layer !== 'weak') continue;
    // Estimate shear stress from weight of overlying slab
    const sigma_n = 2000; // Pa, approximate normal stress (slab weight)
    const tau = sigma_n * Math.tan(SLOPE_ANGLE); // driving shear stress
    if (tau > TAU_WEAK) {
      p.failed = true; // NAIVE: all weak layer fails simultaneously
    }
  }
}
```

The failure is all-or-nothing: either the entire weak layer fails simultaneously (if shear stress > threshold) or nothing happens. There is no propagating crack. There is no critical size. A skier-trigger scenario — where a localized load causes a crack that propagates outward — is impossible to simulate because the threshold is uniform across the entire slope.

Additionally, the "granular flow" after failure is not modeled at all. The slab simply disappears. No dynamics, no entrainment, no runout.

---

## The Moment of Failure

Two specific failures:

**Failure 1 — No crack propagation:** Add a localized skier load (extra downward force on 5 particles). Check failure threshold. Only the 5 particles under the skier fail — the crack doesn't spread. The slab doesn't release. "In reality, one skier can trigger a slab that releases over an entire slope. How?"

**Failure 2 — No granular dynamics:** Even when the entire weak layer fails (by setting tau > threshold), the particles just freeze in place. Adding SPH forces to the slab makes it flow as a viscous fluid — but real avalanche snow is a granular material: it flows differently from water. It has a yield stress (Mohr-Coulomb), a velocity-dependent flow resistance, and an internal friction angle. The naive SPH fluid underestimates runout distance by 50% and overestimates flow speed by 2×.

Show the runout comparison: a real avalanche photograph shows the debris spread (called the "avalanche cone") extending to a run-out ratio H/L ≈ 0.5 (vertical drop over horizontal run). The naive fluid SPH gives H/L ≈ 0.2 (fluid runs out too far). A granular model gives H/L ≈ 0.5.

---

## Why It Broke — The Physics

**Crack propagation in the weak layer** requires a fracture mechanics model. The weak layer has a fracture toughness K_IC that determines whether a crack of length 2a will propagate:

```
K_I = τ · √(πa) ≥ K_IC   →   Crack propagates
```

For the weak layer, τ is the shear stress at the crack tip (from slab weight + skier load), and K_IC is the weak layer's fracture toughness in shear (mode II). For typical snow: K_IC ≈ 100–300 Pa·√m.

The critical crack length a_c below which cracks do not propagate:

```
a_c = (1/π) · (K_IC / τ)²
```

For a natural slope with τ = 1000 Pa (shear stress from slab weight): a_c = (1/π) · (200/1000)² ≈ 0.013 m = 1.3 cm. But this seems too small — in practice, natural snowpack cracks require triggering zones of ~1 m to propagate. The discrepancy comes from the **anticrack** model: in the weak layer, collapse of the porous weak layer under the slab's weight creates a negative-volume "anticrack" that propagates faster than a conventional mode-II crack. The anticrack model (Heierli, Gumbsch, Zaiser 2008) gives larger critical crack sizes consistent with field observations.

**Granular flow physics:** After the slab releases, the flowing snow obeys the **Pouliquen flow model** for dense granular flows:
```
μ = μ₁ + (μ₂ - μ₁)/(1 + I₀/I)
```
where I = d·γ̇/√(P/ρ) is the inertial number (d = grain diameter, γ̇ = shear rate, P = pressure, ρ = density), μ₁ ≈ tan(20°) is the static friction (minimum slope for flow), and μ₂ ≈ tan(40°) is the dynamic friction. This gives a velocity-dependent effective friction that makes avalanche flow much more realistic than constant-viscosity SPH.

---

## The One Concept

**Slab Avalanche Mechanics: Anticrack Propagation and the Critical Crack Size**

A slab avalanche involves three distinct physical stages: (1) initiation — failure of the weak layer at a point, (2) crack propagation — the failure propagates as a fracture across the entire slope, and (3) granular flow — the released slab breaks into fragments and flows downslope. Each stage involves different physics.

**Stage 1: Weak layer failure.** The snowpack is a layered structure. A cohesive wind-slab (strong, dense snow) rests on a weak layer of depth hoar (faceted snow crystals) or surface hoar (like frost crystals). The weak layer has very low shear strength (~100–1000 Pa) compared to the shear stress from the slab weight (ρ·g·H·sin θ, where H is slab thickness). Normally, the weak layer is just strong enough to hold the slab. A skier adds an impulse load equivalent to 2–3× their body weight: the peak dynamic stress easily exceeds the weak layer's strength locally, creating a small initial crack.

**Stage 2: Anticrack propagation.** This is the key insight: the weak layer doesn't just shear — it also collapses vertically. The slab falls slightly into the weak layer crack, creating a "mixed-mode" anticrack (partly mode-II shear, partly mode-I closing). The collapsing weak layer creates stress concentrations at the crack tips that drive further propagation. The anticrack propagates at velocities of 50–100 m/s — the same order as Rayleigh waves in snow. The critical crack size a_c (below which a crack heals, above which it propagates to slope-scale) is:

```
a_c = π·E_eff·(δ_c)² / (8·τ²)
```

where E_eff is the effective stiffness of the slab, δ_c is the weak layer collapse distance, and τ is the shear stress. For typical alpine snowpack, a_c ≈ 0.5–5 m. A skier's ski produces a disturbance area of about 0.05 m² — if the natural crack size is < this, the skier can trigger propagation.

**Stage 3: Granular flow.** The released slab breaks up and flows as a dense granular medium. The flow is characterized by the **depth-averaged** Saint-Venant equations for a granular fluid on an inclined plane, with the Pouliquen friction law providing the effective friction coefficient μ(I). The key prediction: avalanche flow is self-similar — the frontal shape and velocity profile are determined entirely by the friction law and the initial slab volume. The runout distance scales as L ∝ V^(1/3) · tan(θ - θ_stop)^(-1), where V is slab volume and θ_stop is the angle below which flow ceases.

**The engineering implication:** Explosive avalanche control (shooting howitzer shells into the slope to artificially trigger small avalanches before they grow large) works by creating a controlled initial crack while the slab is still small. If a_c > 0.5 m (natural crack does not propagate), explosive control can create a 0.5 m crack that just barely propagates — releasing a small, controlled avalanche rather than a catastrophic large one. The timing window: between snowstorms when the slab is still thin and τ is low (a_c is large → only artificial triggers work) vs. after prolonged loading when a_c → 0 (spontaneous release likely).

---

## The Fix

```javascript
// Fix: Anticrack propagation model + Pouliquen granular flow

class WeakLayerElement {
  constructor(x, y, length) {
    this.x = x; this.y = y;
    this.length = length;       // length of this element
    this.crackOpen = false;     // has this element failed?
    this.damage = 0;            // 0=intact, 1=fully failed
    this.K_IC = 180 + Math.random() * 40; // Pa·√m, spatial variability
    this.tau = 0;               // current shear stress at this element
  }
}

// Weak layer as array of elements along slope base
const N_ELEMENTS = 200;
const SLOPE_LENGTH = 600; // px
const weakLayer = Array.from({length: N_ELEMENTS}, (_, i) => 
  new WeakLayerElement(i * SLOPE_LENGTH/N_ELEMENTS, SLOPE_HEIGHT, SLOPE_LENGTH/N_ELEMENTS)
);

function computeStressIntensity(weakLayer, crackedElements) {
  // For each intact element at the crack tip, compute K_I from the crack length
  // K_I = tau * sqrt(π * a) where a is the half-length of the crack
  
  // Find crack tips (boundaries between cracked and intact regions)
  const crackTips = [];
  for (let i = 1; i < weakLayer.length - 1; i++) {
    if (weakLayer[i-1].crackOpen && !weakLayer[i].crackOpen) {
      // Right tip
      const a = weakLayer.filter((e, j) => j < i && e.crackOpen).length 
                * SLOPE_LENGTH/N_ELEMENTS;
      crackTips.push({index: i, a: a, side: 'right'});
    }
    if (!weakLayer[i].crackOpen && weakLayer[i+1].crackOpen) {
      // Left tip
      const a = weakLayer.filter((e, j) => j > i && e.crackOpen).length 
                * SLOPE_LENGTH/N_ELEMENTS;
      crackTips.push({index: i, a: a, side: 'left'});
    }
  }
  return crackTips;
}

function propagateCrack(weakLayer, skierLoadX, dt) {
  // 1. Apply skier load: elevated shear stress at skier position
  const skierIdx = Math.floor(skierLoadX / (SLOPE_LENGTH/N_ELEMENTS));
  for (let i = skierIdx - 2; i <= skierIdx + 2; i++) {
    if (i >= 0 && i < N_ELEMENTS) {
      weakLayer[i].tau = BASE_SHEAR_STRESS * 2.5; // 2.5× skier amplification
    }
  }

  // 2. For each crack tip, compute K_I and check against K_IC
  const crackTips = computeStressIntensity(weakLayer);
  for (const tip of crackTips) {
    const el = weakLayer[tip.index];
    const K_I = el.tau * Math.sqrt(Math.PI * tip.a);
    if (K_I >= el.K_IC) {
      el.crackOpen = true; // Propagate!
      el.damage = 1;
    }
  }

  // 3. Recover: if crack not propagating and no adjacent failed elements,
  //    slowly heal (damage recovery — not physical but prevents artifacts)
}

// After weak layer failure: SPH with Pouliquen friction
function pouliquenFriction(I, mu1=0.38, mu2=0.64, I0=0.27) {
  // I = d * gamma_dot / sqrt(P / rho)
  return mu1 + (mu2 - mu1) / (1 + I0/Math.max(I, 1e-6));
}

function granularSPHForce(pi, pj, h) {
  const dx = pi.x - pj.x, dy = pi.y - pj.y;
  const r = Math.sqrt(dx*dx + dy*dy);
  if (r > h || r < 1e-6) return {fx: 0, fy: 0};
  
  // Pressure force (standard SPH)
  const dW = spikyKernelGrad(dx, dy, r, h);
  const pressureF = -(pi.pressure + pj.pressure) / (2 * pj.rho);
  
  // Viscous force (Pouliquen model via dynamic viscosity)
  const gamma_dot = Math.sqrt((pi.vx-pj.vx)**2 + (pi.vy-pj.vy)**2) / r;
  const P_avg = (pi.pressure + pj.pressure) / 2;
  const I = GRAIN_DIAM * gamma_dot / Math.sqrt(P_avg / SNOW_DENSITY + 1e-6);
  const mu = pouliquenFriction(I);
  const eta_eff = mu * P_avg / (gamma_dot + 1e-6);
  
  return {
    fx: (pressureF + eta_eff * (pi.vx-pj.vx)/pj.rho) * dW.x * pj.mass,
    fy: (pressureF + eta_eff * (pi.vy-pj.vy)/pj.rho) * dW.y * pj.mass
  };
}
```

The crack propagation now proceeds from the skier's location outward, reaching each weak layer element only when K_I at that element's crack tip exceeds its local K_IC. The spatial variability in K_IC (±20%) creates a realistic, slightly irregular fracture front rather than a perfectly straight crack.

---

## The Wow Moment — Push It

**The skier trigger sweep:** Show 10 different skier positions on a slope. Click to place a skier. Most positions trigger nothing. A few positions (on thin parts of the slab, or near a pre-existing crack) trigger runaway fracture. This demonstrates "slope hazard heterogeneity" — the same slope can be safe at one entry point and deadly at another 10 meters away.

**Wind slab thickness gradient:** Make the slab thickness H vary along the slope (thicker in the middle, thinner at edges — mimicking wind loading patterns). The fracture front propagates fastest where the slab is thick (higher shear stress). The fracture pattern is non-uniform and interesting.

**Multiple synchronized avalanches:** A large earthquake triggers simultaneous slab releases on 5 parallel slopes visible in cross-section. Each releases independently but at nearly the same time. The granular flows merge in the valley below, creating a spectacular debris pile that grows from multiple directions.

**Time-lapse of snow season:** Animate the snowpack building up over a winter: thin fresh snow (stable) → wind slab forms on top of weak layer → slab thickens → a_c shrinks → spontaneous release at night. Show the critical crack size decreasing as the slab thickens until a_c is reached and the slope releases spontaneously.

---

## The Interactive Demo

- **Slope angle** (20° to 50°): below 20°, insufficient shear stress — no avalanche. Above 50°, snow doesn't accumulate — no slab. The 30–45° range is the danger zone
- **Slab thickness H** (20 to 150 cm): thicker slab → higher shear stress → smaller a_c → easier to trigger
- **Weak layer strength K_IC** (50 to 500 Pa·√m): lower K_IC → smaller critical crack → easier propagation → more dangerous snowpack
- **K_IC variability** (0 to 30%): spatial noise in weak layer properties; higher variability = more irregular fracture fronts, more realistic
- **Skier weight** (50 to 120 kg): heavier skier = larger dynamic stress = more likely to trigger
- **Skier position**: click anywhere on slope to place skier; crack propagation immediately shown if triggered
- **Crack animation speed** (0.1× to 10×): slow-motion crack propagation is dramatic; real crack propagation is 50 m/s = nearly instantaneous
- **Granular flow toggle**: after slab release, toggle between naive SPH (wrong runout) and Pouliquen granular model (correct runout); compare runout distances
- **Snow density** (200 to 450 kg/m³): fresh snow is light; wind slab is heavy; affects both slab weight and granular flow dynamics
- **Anti-trigger zone**: click-drag to draw a "ski cut" zone — a manual crack that is added to the weak layer; see if adding a crack of length L causes propagation (if a_c < L, it will)
- **Explosive control**: place an "explosive" marker; creates a 0.3m initial crack at that point; see if it propagates (if yes, explosive control worked and triggered a controlled small avalanche before a dangerous large one)
- **a_c readout**: live display of current critical crack size a_c given current slab properties; updated in real time as you change parameters

---

## Production Notes

**Code structure:**
- `index.html`: canvas (slope cross-section view, 700×400) + top-down slope map (300×400); control panel (right side)
- `snowpack.js`: WeakLayerElement class, slab particle array, K_IC field (spatial variability using simplex noise), initial crack seeding
- `fracture.js`: crack propagation algorithm, stress intensity computation, skier load computation
- `granular-sph.js`: SPH with Pouliquen friction law, grain interaction, boundary conditions (slope base = solid floor)
- `renderer.js`: cross-section view (slab particles = blue-white gradient, weak layer = orange-red gradient, substrate = brown); crack visualization (opening gap drawn as black void); runout zone (debris accumulation zone drawn at slope base)
- `topdown.js`: top-down view of the slope showing the fracture front propagating laterally; damage map colored by failure time (crack arrival)

**Key cinematic moments:**
1. *Crown fracture footage* (0:00–0:30): the clean horizontal break. The whole slab gone. Silent.
2. *Snowpack cross-section diagram* (1:30): draw the layers. Slab (blue), weak layer (orange), substrate (brown). Label thicknesses.
3. *The naive uniform failure* (3:00): entire weak layer fails at once — no propagation dynamics. "This is too simple."
4. *Skier trigger — crack nucleation* (5:00): click to place skier. A hairline crack appears beneath the skier's position. "K_I has just exceeded K_IC at this point. What happens next?"
5. *Crack racing outward* (5:30): at 10× slow motion, the crack tip moves frame by frame across the slope. Color the crack-tip element red. "In reality this takes 0.2 seconds. We're watching at 10× slow motion."
6. *Slab release* (6:00): the entire slab simultaneously begins to move. Cut to granular SPH flow. The slab accelerates, fragments, flows.
7. *Runout comparison* (9:00): naive SPH fluid vs. Pouliquen granular model. Two canvases. "Granular media don't flow like water. Here's the difference."

**Art direction:** For the snowpack, use a white-to-pale-blue gradient for the slab, a warm orange for the weak layer (representing its fragility), and a cold gray-brown for the substrate. The crack should be visible as a growing black gap. The flowing granular debris should be rendered with a particle-level texture (each SPH particle as a small white circle).

---

## Tags
`avalanche` `slab-avalanche` `fracture` `granular-flow` `snow` `weak-layer` `SPH` `disaster`

---

## Thumbnail

Dramatic cross-section view of a snow slope. The slab (white-blue gradient) is releasing along a clean horizontal fracture line (black crack). The crack front is shown in bright red-orange. Below the fracture line, the slab is in motion: white particles flowing downslope. A single skier icon marks the trigger point. Bold text: "WHY ONE SKIER STARTS AN AVALANCHE." Subtitle: "anticrack propagation." The background is a dark mountain silhouette against a gray sky. The overall palette is cold: white, blue-gray, black, with the orange-red crack as the only warm color — drawing the eye to the fracture.
