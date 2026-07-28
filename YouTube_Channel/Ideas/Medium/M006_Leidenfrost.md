---
title: "A Droplet Dances on a Hot Pan (Leidenfrost Effect)"
id: M006
difficulty: 5/10
prereq: "None"
concept: "At T > Leidenfrost temperature, a vapor layer forms under the droplet, insulating it from the surface; droplet floats on its own vapor cushion; lifetime dramatically increases; self-propulsion from asymmetric vapor flow."
tags: [leidenfrost, heat-transfer, phase-change, vapor, droplet, self-propulsion, thermodynamics, canvas]
category: medium
type: video-idea
---

# A Droplet Dances on a Hot Pan (Leidenfrost Effect)

**Alt title:** "Why a Water Drop Lives Longer on a 300°C Pan Than on a 150°C Pan"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A cast-iron skillet at 150°C: a water drop hits the surface and instantly sizzles into steam in under 3 seconds, violent and spattery. Same skillet heated to 300°C: a water drop hits, and instead of exploding — it forms a perfect silver sphere and glides across the pan in silence. It wobbles gently like a mercury ball. It bounces. It spins. It splits into smaller spheres that chase each other around the pan. 90 seconds later, it finally evaporates.

"The hotter pan makes the water drop LAST LONGER. That is deeply wrong intuitively. Let's code it and figure out why it happens — and why your first simulation will give you a drop that just sits there and does nothing."

Leidenfrost described this in 1756. The full quantitative theory was only worked out in the 1960s. The self-propulsion mechanism was explained in 2011.

---

## The Naive Attempt

The naive approach: simulate a 2D circular droplet sitting on a hot surface. Model heat conduction from the surface into the droplet. When temperature at the bottom of the droplet exceeds the boiling point (100°C), mark that region as "evaporating" and remove mass from it.

```javascript
// 2D grid: temperature field
const N = 128;
const T_surface = 300;  // surface temperature (°C)
const T_boil = 100;     // boiling point of water
const T_initial = 20;   // initial droplet temperature
const k_water = 0.6;    // thermal conductivity (W/m·K)
const rho_water = 1000;
const cp_water = 4182;
const alpha = k_water / (rho_water * cp_water); // thermal diffusivity

// Mark droplet cells
const inDroplet = new Uint8Array(N * N);
const T = new Float32Array(N * N).fill(T_surface);

const centerX = N/2, centerY = N*0.6, radius = 20;
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    const r = Math.sqrt((i-centerX)**2 + (j-centerY)**2);
    if (r < radius) {
      inDroplet[i + j*N] = 1;
      T[i + j*N] = T_initial;
    }
  }
}

function step(dt) {
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      if (!inDroplet[idx]) continue;
      // Heat equation: dT/dt = alpha * laplacian(T)
      const lap = (T[(i+1)+j*N] + T[(i-1)+j*N] +
                   T[i+(j+1)*N] + T[i+(j-1)*N] - 4*T[idx]) / (dx*dx);
      T[idx] += alpha * dt * lap;
      // Naive evaporation: if T > 100, just remove the cell
      if (T[idx] > T_boil) {
        inDroplet[idx] = 0;
        T[idx] = T_surface; // instantly replaced by hot surface
      }
    }
  }
}
```

Result: the drop heats up uniformly from its bottom. Within a second of simulation time, the entire bottom row of cells exceeds 100°C and is "evaporated." The drop shrinks from the bottom up, uniformly and rapidly, in about 3 seconds of simulation time. There is no floating, no silver sphere, no slow graceful evaporation. And there is definitely no self-propulsion.

---

## The Moment of Failure

On screen: a white circular blob (the droplet) on a black (hot) background. Every frame, the bottom of the blob turns black as cells are "evaporated." The blob shrinks linearly from the bottom, maintaining its semi-circular shape. After 30 frames it's gone. Total evaporation time: about 3 seconds simulated. No motion, no levitation, no Leidenfrost effect.

The simulation has correctly modeled the sub-Leidenfrost regime (a pan at ~150°C, where droplets evaporate quickly by direct contact). It has failed to model what happens when evaporation is fast enough to create a continuous vapor layer. The critical missing element: the vapor pressure under the droplet must be computed and must actually support the droplet's weight. The simulation has no fluid pressure at all.

---

## Why It Broke — The Physics

Below the Leidenfrost temperature T_L (about 230°C for water on clean steel): the droplet contacts the surface directly. The contact area nucleates boiling vigorously, the droplet spreads and splatters. Heat flux is high. Life is short.

At T > T_L: the surface is so hot that the bottom of the droplet evaporates almost instantly when it gets close. The vapor cannot escape fast enough sideways, so it builds up pressure under the droplet. This vapor pressure supports the droplet's weight — the droplet levitates on its own vapor cushion. The vapor layer is typically 0.1–0.3 mm thick.

The vapor layer insulates the droplet from the hot surface (vapor has much lower thermal conductivity than liquid water: κ_vapor ≈ 0.025 W/m·K vs κ_water ≈ 0.6 W/m·K — a factor of 24 difference). Heat transfer to the droplet is now controlled by conduction through this thin vapor layer — much slower than direct contact. The droplet evaporates slowly and gracefully.

The vapor pressure balance that determines layer thickness h:

$$\Delta p_{vapor} = \rho_l g H \approx \frac{\kappa_v (T_s - T_{boil})}{\rho_v L h} \cdot h_{layer} = \frac{R_{droplet}^2 \kappa_v (T_s - T_{boil})}{\rho_v L h_{layer}}$$

where ρ_l is liquid density, g is gravity, H is droplet height, κ_v is vapor thermal conductivity, T_s is surface temperature, ρ_v is vapor density, and L is latent heat of vaporization. Solving for h gives the vapor layer thickness, which is ~100–300 μm. This is the key missing element in the naive code.

**Self-propulsion:** A textured or asymmetric surface creates an asymmetric vapor flow out from under the droplet. Like a hovercraft with an asymmetric skirt, the escaping vapor applies a net horizontal force. On a surface with a ratchet-like microstructure, droplets can be directed at controlled speeds. This was demonstrated experimentally in 2011 and explained as rectified vapor flow.

---

## The One Concept

The **Leidenfrost effect** is the phenomenon where a liquid drop placed on a surface significantly hotter than the liquid's boiling point is enveloped by a vapor film that prevents direct contact and dramatically slows evaporation. Johann Gottlob Leidenfrost described it in 1756: he noted that water drops on a very hot spoon formed "spherules" that glided around slowly, whereas drops on a merely hot spoon evaporated instantly.

The vapor film that forms beneath the droplet is the key physical feature. It acts as an **insulating cushion** — thermally (low thermal conductivity slows heat transfer) and mechanically (pressure supports the droplet against gravity). The droplet has no friction with the surface and can glide freely.

The Leidenfrost temperature T_L is the minimum surface temperature at which this vapor film is stable. Below T_L, the film can collapse locally — the liquid touches the hot surface, nucleates boiling explosively, and the resulting bubble pressure ejects the droplet. Above T_L, the vapor production rate is fast enough to maintain the film against this collapse. T_L depends on liquid properties, surface roughness, and surface material. For water: T_L ≈ 230°C on smooth steel, but can vary from 150°C to 300°C depending on conditions.

The droplet lifetime shows a dramatic minimum near the film-boiling transition. Below 200°C, a droplet evaporates in 1–3 seconds (direct contact, fast). From 200°C to T_L ≈ 230°C, the film is unstable and lifetime is shorter still — violent nucleate boiling. Above T_L, lifetime increases sharply: a 2mm droplet at 300°C lasts ~90 seconds. This non-monotonic behavior — the **Leidenfrost paradox** — was counter-intuitive to Leidenfrost and remains surprising to new observers.

The spherical shape of Leidenfrost droplets is enforced by surface tension. A drop suspended by vapor pressure without friction tends toward the minimum-energy shape: a sphere (or oblate spheroid for large drops where gravity matters). The Bond number Bo = ρ g r²/γ determines the shape — for Bo < 1 (small drops), nearly perfect spheres; for Bo > 1 (large drops), flat pancakes.

The droplet also oscillates. The vapor cushion acts as a spring — the droplet can bounce on it. Star-shaped oscillation modes (the droplet lobes in and out at its perimeter) are driven by the instability of the vapor-liquid interface — a Rayleigh-Taylor-like instability since the liquid is denser and is accelerating toward the vapor. Modes with 2, 3, 4, and 5 lobes have been experimentally observed.

Applications: cooking (the Leidenfrost effect is why wok cooking at high temperatures produces characteristic "dry" stir-fry rather than steamed textures), fire-walking (feet on hot coals get a momentary Leidenfrost protection from sweat evaporation), industrial quenching (steel hardening involves passing through the Leidenfrost regime), cryogenic tank insulation, and self-propelled microdevices using Leidenfrost ratchets.

---

## The Fix

Model the vapor gap explicitly. Represent the droplet as a 2D blob with vapor pressure underneath, computed from the evaporative heat flux.

```javascript
// 2D simulation: droplet position, shape, vapor layer thickness
// Simplified model: axisymmetric pancake droplet of radius R and height H
// Vapor layer of thickness h(r) under the droplet

const R_drop = 2e-3;     // droplet radius (m)
const rho_l = 1000;      // liquid density
const rho_v = 0.6;       // vapor density at 100°C
const L_vap = 2.26e6;    // latent heat of vaporization (J/kg)
const kappa_v = 0.025;   // vapor thermal conductivity
const mu_v = 1.2e-5;     // vapor dynamic viscosity
const g = 9.81;
const T_surface = 300;   // °C
const T_boil = 100;

// Local evaporation rate from surface: q = kappa_v * (T_s - T_boil) / h
// Vapor layer profile h(r) from lubrication theory
// Pressure balance: vapor pressure supports droplet weight

function computeVaporLayerThickness(R, H_drop) {
  // Lubrication theory (Reynolds equation) for vapor gap under a flat droplet:
  // q(r) = kappa_v * deltaT / (rho_v * L * h(r))
  // Pressure balance gives h_center
  const deltaT = T_surface - T_boil;
  const Q_total = kappa_v * deltaT / (rho_v * L_vap); // m²/s evap rate
  // Weight per unit area = rho_l * g * H_drop
  const P_weight = rho_l * g * H_drop;
  // From lubrication: h_center ~ (12 * mu_v * Q_total * R^2 / P_weight)^(1/3)
  const h_center = Math.pow(12 * mu_v * Q_total * R * R / P_weight, 1/3);
  return h_center; // ~ 100-300 μm
}

// Simplified droplet dynamics:
// - Track center-of-mass (x, y) and velocity (vx, vy)
// - Vapor layer provides normal force = droplet weight (no direct contact)
// - If surface is textured (asymmetric), add small horizontal force
// - Droplet evaporates slowly: dR/dt = -evaporation_rate

let dropX = 0, dropY = 0;
let dropVx = 0.01, dropVy = 0; // small initial nudge
let dropR = R_drop;
let dropH = dropR * 0.5; // oblate shape

function step(dt) {
  const h = computeVaporLayerThickness(dropR, dropH);
  const deltaT = T_surface - T_boil;

  // Evaporation: mass loss rate = kappa_v * deltaT * Area / (rho_v * L * h)
  const evapArea = Math.PI * dropR * dropR;
  const massLossRate = kappa_v * deltaT * evapArea / (rho_v * L_vap * h);
  const rhoVol = rho_l * (4/3) * Math.PI * dropR * dropR * dropH;
  const dVol_dt = -massLossRate / rho_l;
  dropR += dt * dVol_dt / (2 * Math.PI * dropR * dropH); // conserve volume shape

  // Horizontal motion: tiny vapor asymmetry from surface tilt or texture
  const friction = 0; // Leidenfrost: no friction!
  dropX += dropVx * dt;
  dropY += dropVy * dt;

  // Bounce off walls (frictionless)
  if (Math.abs(dropX) > panRadius - dropR) dropVx *= -1;
  if (Math.abs(dropY) > panRadius - dropR) dropVy *= -1;

  console.log(`h_vapor = ${(h*1000).toFixed(3)} mm, R_drop = ${(dropR*1000).toFixed(2)} mm`);
}
```

The key outputs: vapor layer thickness h ≈ 0.15 mm (physically correct), droplet gliding with no friction, slow evaporation taking ~90 seconds for a 2mm droplet. Render the droplet as a silver-gray sphere with a thin bright line at the bottom (vapor layer). Animate the droplet rolling around the pan.

---

## The Wow Moment — Push It

**Leidenfrost ratchet simulation:** Model a surface with asymmetric sawtooth texture (micro-ratchets). Vapor escaping under the droplet is deflected preferentially toward the steep face of each tooth. Net horizontal force → droplet self-propels in one direction. Show droplets spontaneously moving across the pan, colliding, merging (when two droplets touch their vapor cushions merge — they coalesce into one larger droplet), and self-sorting by size.

**Lifetime curve:** Plot droplet lifetime vs surface temperature from 100°C to 400°C. Show the characteristic minimum near the Leidenfrost temperature, then the rapid increase. Overlay experimental data from published papers — the simulation curve should match.

**Bouncing droplet:** Apply a tiny oscillation to the surface (a speaker under the pan). The droplet bounces at the oscillation frequency if it's above a threshold amplitude. Below threshold: stationary levitation. Above threshold: regular bouncing up to 5mm height. At very high amplitude: chaotic bouncing. This is a mechanical Faraday-wave analog.

**Star-shaped oscillation modes:** For a large droplet (Bond number > 1, ~5mm radius), impose a small radial perturbation. The droplet oscillates in star-shaped modes — 3-lobed, 4-lobed, 5-lobed — visible as the outer edge pulses in and out rhythmically.

---

## The Interactive Demo

- **Surface temperature** slider: 80°C to 400°C (shows transition through T_L at ~230°C — below: sizzle mode; above: Leidenfrost mode)
- **Droplet radius** slider: 0.5 to 5 mm (small: sphere; large: flat pancake; controls Bond number)
- **Surface type** selector: Smooth | Ratcheted (specify ratchet period) | Bumpy random | Tilted
- **Gravity** slider: 0 to 20 m/s² (0 = space: perfect sphere; high g = very flat pancake)
- **Lifetime timer**: real-time countdown of remaining droplet mass
- **Temperature plot**: live T(r) profile through the droplet showing insulating vapor layer
- **Vapor layer thickness readout**: live h in micrometers
- **Number of droplets**: 1 to 20 simultaneously (watch collision and merging)
- **Oscillate surface** toggle: sets surface vibration amplitude and frequency

---

## Production Notes

**Code to show:**
- The naive code — fast uniform evaporation, no floating
- The key equation: vapor layer thickness h from lubrication theory — highlight that h depends on T_surface and the droplet's own weight
- The evaporation rate formula — show the 1/h dependence: thicker vapor layer → slower evaporation → longer lifetime (the paradox explained)
- The zero-friction condition: `const friction = 0` — one line explains the dancing

**Visual layout:**
- Main view: top-down view of a pan (circular, gray cast-iron texture) with a silver droplet
- Animated vapor "shimmer" under the droplet using a displacement shader
- Right panel: cross-section view showing droplet (blue), vapor layer (thin white gap), hot surface (orange-red)
- Bottom panel: lifetime timer and temperature slider

**Key cinematic moments:**
- 00:30 — Real sizzling droplet on hot pan (150°C) — 3 seconds, gone
- 00:55 — Same pan hotter (300°C) — droplet glides silently, lives 90 seconds
- 02:30 — Naive code: fast evaporation, no physics of vapor pressure
- 04:00 — Fix: vapor layer thickness computed — h ~ 0.15 mm appears on screen
- 05:00 — "The vapor is 24× worse at conducting heat than water. The droplet is insulated."
- 06:00 — Ratcheted surface: droplet self-propels — looks like a remote-controlled marble
- 07:00 — Lifetime vs temperature curve — the counterintuitive minimum plotted live
- 08:00 — Bond number demo: large droplet at low gravity is a perfect sphere; high gravity flattens it
- 09:00 — "This is how fire-walkers don't burn their feet — briefly"

---

## Tags
`leidenfrost` `heat-transfer` `phase-change` `vapor` `droplet` `self-propulsion` `thermodynamics` `canvas`

---

## Thumbnail

Split: LEFT — a real photograph of a perfectly spherical water droplet levitating on a red-glowing cast-iron skillet, the droplet catching reflections. RIGHT — the simulation, droplet rendered as a silver sphere hovering above an orange surface, a visible thin white vapor gap beneath it. Bold text across the top: "HOTTER = LONGER". Subtitle: "The Leidenfrost Paradox". At the bottom: "230°C threshold" with an arrow pointing to a graph of lifetime vs temperature showing the minimum and recovery.
