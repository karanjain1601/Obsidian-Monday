---
title: "Surface Tension Gradients Drive Counterintuitive Flows (Marangoni Effect)"
id: M009
difficulty: 5/10
prereq: "None"
concept: "Marangoni effect: surface tension varies with temperature or concentration; flow driven from low-γ to high-γ regions; tears of wine (alcohol evaporates at edges → higher γ → wine flows up the glass)."
tags: [marangoni, surface-tension, heat-transfer, tears-of-wine, thermocapillary, fluid-simulation, concentration-gradient, canvas]
category: medium
type: video-idea
---

# Surface Tension Gradients Drive Counterintuitive Flows (Marangoni Effect)

**Alt title:** "Why Wine Climbs Its Own Glass: The Physics of Tears of Wine"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A wine glass held up to the light. Someone swirls the glass, then holds it still. After a few seconds, tiny rivulets of wine appear near the top of the wetted glass and slowly slide DOWN the inside of the glass — not from the rim but from mid-glass, flowing backward against the direction they initially rose. These are the "tears of wine" or "legs of wine." They form a regular curtain of droplets around the glass, slide down slowly, collect at the bottom, and then the process repeats.

"James Thomson (brother of Lord Kelvin) described this in 1855. The explanation involves surface tension responding to concentration. Your first simulation will produce a film that just sits on the glass and evaporates uniformly. No tears, no rivulets, no anything."

Close-up: a drop of dish soap falling into a bowl of water. The soap spreads in a perfectly circular wavefront across the entire water surface in a fraction of a second — the Marangoni effect driving fluid away from the high-soap (low surface tension) region at supercritical speed. Then a pepper flake floating at the impact point shoots to the edge of the bowl. "This is the same physics at different scales."

---

## The Naive Attempt

Simulate a 2D film of wine on a glass surface. Track the ethanol concentration c(x,y). Ethanol evaporates from the surface — model evaporation as a constant sink term. The film flows due to gravity.

```javascript
const N = 256;
const c0 = 0.15;           // initial ethanol concentration (15% wine)
const evap_rate = 0.001;   // evaporation rate (s⁻¹)
const D_ethanol = 1.2e-9;  // diffusivity of ethanol in water (m²/s)
const nu = 1.5e-6;         // kinematic viscosity
const g = 9.81;
const theta = 30 * Math.PI / 180; // glass tilt angle

const c = new Float32Array(N * N).fill(c0);
const h = new Float32Array(N * N).fill(1e-3); // film thickness (m)

function step(dt) {
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      // Evaporation: uniform across surface
      c[idx] -= evap_rate * dt;
      c[idx] = Math.max(0, c[idx]);
      // Diffusion of ethanol
      const lap_c = (c[(i+1)+j*N] + c[(i-1)+j*N] +
                     c[i+(j+1)*N] + c[i+(j-1)*N] - 4*c[idx]) / (dx*dx);
      c[idx] += D_ethanol * dt * lap_c;
      // Gravity-driven film flow: no Marangoni force included
      const dh_dx = (h[(i+1)+j*N] - h[(i-1)+j*N]) / (2*dx);
      // Thin film equation: h_t = div(h³ * g*sin(theta)/3nu * grad(h))
      // -- but no surface tension gradient term!
    }
  }
}
```

Result: the ethanol concentration decreases uniformly across the entire film. The film thins uniformly. No concentration gradients develop because the evaporation rate is the same everywhere. No flow is driven by concentration differences. The film just disappears.

---

## The Moment of Failure

The canvas shows a uniform pale blue rectangle (wine film on glass). Every frame it gets slightly lighter (less ethanol). No variation in concentration develops. No film thickness variation. No tears. The simulation correctly models uniform evaporation to a uniform equilibrium — it's the wrong equilibrium because the initial condition is too symmetric.

But even with a small concentration seed, the simulation doesn't produce tears, because the Marangoni term — the force driven by surface tension gradients — is completely absent from the momentum equation. Without the Marangoni stress boundary condition at the free surface, there is simply no mechanism to drive flow from high-concentration to low-concentration regions, which is the heart of the tears-of-wine phenomenon.

---

## Why It Broke — The Physics

The Marangoni effect (named for Carlo Marangoni who studied it in his 1865 doctoral thesis, though James Thomson described it independently in 1855) is the flow of fluid driven by surface tension gradients. Surface tension γ depends on temperature T and concentration c:

$$\gamma = \gamma_0 + \frac{\partial \gamma}{\partial T}(T - T_0) + \frac{\partial \gamma}{\partial c}(c - c_0)$$

For water/ethanol mixtures: ∂γ/∂c < 0 (adding ethanol reduces surface tension). So where ethanol concentration is high, surface tension is low; where ethanol is depleted, surface tension is high. The Marangoni force per unit area on the surface is:

$$\tau_{Marangoni} = \frac{\partial \gamma}{\partial x} = \frac{\partial \gamma}{\partial c} \frac{\partial c}{\partial x}$$

This tangential stress at the free surface drives fluid from low-γ regions (high ethanol) toward high-γ regions (low ethanol). It is a surface-only force — it acts only at the liquid-air interface, not in the bulk.

For tears of wine: ethanol evaporates faster at the thinner film near the top of the wet glass surface (higher surface-area to volume ratio, and slightly more air flow). The depleted region has higher γ. This pulls wine upward from the bulk (which has lower γ because it still has more ethanol). The wine piles up in a rim near the top of the wet zone. When the rim gets heavy enough, gravity wins and the rim breaks into rivulets (tears) that flow back down. The process is cyclic.

The governing thin-film equation with Marangoni stress:

$$\frac{\partial h}{\partial t} = \frac{1}{3\mu} \nabla \cdot \left[ h^3 \nabla p \right] + \frac{1}{2\mu} \nabla \cdot \left[ h^2 \nabla \gamma \right]$$

where the first term is pressure-driven flow (gravity + capillary pressure) and the second term is the Marangoni term (flow driven by surface tension gradient). The Marangoni number Ma = (∂γ/∂c · Δc · L)/(μ · D_c) characterizes its relative strength.

---

## The One Concept

The **Marangoni effect** is the mass transfer along a fluid-fluid interface driven by a gradient in surface tension. Surface tension, which acts to minimize the area of the interface, is not uniform in real systems — it varies with temperature, chemical composition, and even electric field strength. Wherever surface tension is lower, the interface is more "relaxed" and fluid from that region flows toward the tighter (higher γ) region. This motion of fluid at the surface entrains the bulk fluid below it, creating large-scale circulation.

The Marangoni effect is remarkable because it can drive flows AGAINST gravity (as in the wine glass case), can exceed gravitational and viscous forces for steep enough γ gradients, and operates in the absence of any pressure gradient or body force — it is a purely interfacial phenomenon.

Temperature-driven Marangoni flows (**thermocapillary flows**) are of immense practical importance in materials processing. For most fluids, ∂γ/∂T < 0 (surface tension decreases with temperature). In crystal growth from a melt (e.g., growing silicon wafers), a laser or resistive heater creates a temperature gradient at the melt surface. Marangoni flow carries hot melt radially outward from the hot center and cold melt inward along the bottom — this convection affects the temperature uniformity and ultimately the crystal quality. In microgravity (the ISS), Marangoni flow dominates over buoyancy convection (which vanishes without gravity) and determines the entire flow field in molten metal experiments.

Concentration-driven Marangoni flows (**solutocapillary flows**) include: the wine tears phenomenon, the spreading of surfactant drops on water surfaces (dish soap on a water surface covered with pepper flakes — the soap spreads in a circular wave, sweeping the pepper aside faster than surface waves could propagate), and the "Marangoni propulsion" of camphor boats (a tiny camphor sliver placed on water dissolves unevenly, creating a concentration gradient that propels the sliver forward — speeds of up to 10 cm/s).

An important industrial application: **welding pool dynamics.** In arc welding, the weld pool has a temperature gradient from the arc center (very hot, low γ) to the periphery (cooler, higher γ). Marangoni flow can drive either inward or outward circulation depending on the sign of ∂γ/∂T (which changes sign for iron at ~1500°C and depends on sulfur content). Outward Marangoni flow gives a wide, shallow weld bead; inward flow gives a narrow, deep bead. Small changes in sulfur content can change the weld geometry dramatically — this caused catastrophic welding failures in the aerospace industry when specifications changed from high-sulfur to low-sulfur steel.

The **soap film engine** is an elegant demonstration: a soap film stretched across a wire frame. Touching a warmer wire to one edge creates a temperature gradient. The thermocapillary Marangoni flow drives the film from the hot end (low γ) to the cold end (high γ) — the film flows like a conveyor belt and can lift small objects against gravity.

---

## The Fix

Add the Marangoni stress term to the thin-film equation and introduce edge evaporation that's faster than interior evaporation (to seed the concentration gradient).

```javascript
// Full thin-film simulation with Marangoni effect
// h(x,y) = film thickness; c(x,y) = ethanol concentration

const gamma0 = 0.072;     // surface tension of pure water (N/m)
const dgamma_dc = -0.04;  // dγ/dc for water-ethanol (N/m per unit concentration)
const mu = 1.5e-3;        // dynamic viscosity (Pa·s)
const D_eth = 1.2e-9;     // ethanol diffusivity
const g = 9.81;
const sin_theta = Math.sin(30 * Math.PI / 180);
const evap_uniform = 5e-7;  // bulk evaporation rate (m/s)
const evap_edge = 5e-6;     // enhanced evaporation near upper edge (m/s)

function computeGamma(c_val) {
  return gamma0 + dgamma_dc * c_val;
}

function step(dt) {
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j*N;
      const h_val = h[idx];
      const c_val = c[idx];
      const gamma_val = computeGamma(c_val);

      // Surface tension gradient (Marangoni force)
      const dgamma_dx = dgamma_dc * (c[(i+1)+j*N] - c[(i-1)+j*N]) / (2*dx);
      const dgamma_dy = dgamma_dc * (c[i+(j+1)*N] - c[i+(j-1)*N]) / (2*dx);

      // Pressure gradient from gravity (down the glass)
      const dh_dx = (h[(i+1)+j*N] - h[(i-1)+j*N]) / (2*dx);
      const dh_dy = (h[i+(j+1)*N] - h[i+(j-1)*N]) / (2*dx);

      // Film flux Q = h³/(3μ) * ∇p_gravity  +  h²/(2μ) * ∇γ
      const Qx = h_val*h_val*h_val/(3*mu) * (-rho*g*sin_theta) + h_val*h_val/(2*mu) * dgamma_dx;
      const Qy = h_val*h_val*h_val/(3*mu) * (-rho*g*sin_theta*dh_dy/dx) + h_val*h_val/(2*mu) * dgamma_dy;

      // Divergence of flux = film thickness change
      const dQx_dx = ... // upwind divergence of Qx
      const dQy_dy = ... // upwind divergence of Qy

      // Evaporation: enhanced at top edge (j near N-1)
      const edge_factor = Math.exp(-5 * (1 - j/(N-1)));
      const evap = evap_uniform + evap_edge * edge_factor;

      hNew[idx] = h_val - dt * (dQx_dx + dQy_dy + evap);
      hNew[idx] = Math.max(1e-8, hNew[idx]);

      // Update ethanol: evaporation depletes ethanol faster than water (ethanol more volatile)
      const evap_ratio_eth = 2.0; // ethanol evaporates 2x faster
      cNew[idx] = (c_val * h_val - evap_ratio_eth * evap * c_val * dt) / hNew[idx];
      cNew[idx] = Math.max(0, Math.min(1, cNew[idx]));

      // Diffusion of ethanol in film
      const lap_c = (c[(i+1)+j*N] + c[(i-1)+j*N] +
                     c[i+(j+1)*N] + c[i+(j-1)*N] - 4*c_val) / (dx*dx);
      cNew[idx] += D_eth * dt * lap_c / h_val;
    }
  }
}
```

With the Marangoni term, a rim of wine forms near the top where evaporation is fastest. The rim thickens over ~10 seconds until the gravity term dominates the Marangoni term. The rim breaks into rivulets (tears) under Rayleigh-Taylor instability along the horizontal rim — the tears are regularly spaced, spacing set by capillary length and film thickness. They slide down and repeat. The simulation reproduces the tears-of-wine phenomenon qualitatively.

---

## The Wow Moment — Push It

**Camphor boat simulation:** Place a small "camphor source" (high concentration source at one point) on a 2D water surface. Marangoni flow radiates outward — and propels the camphor source in a random walk direction (because the flow it creates pushes equally in all directions unless there's asymmetry). Add a notch at one edge of the camphor sliver: asymmetric dissolution creates asymmetric γ gradient, propelling the sliver at a constant speed. Show speed vs. camphor dissolution rate.

**Soap drop on pepper water:** Simulate a 2D surface with floating pepper particles (passive tracers). Drop a high-surfactant concentration at the center. The Marangoni wavefront propagates outward at the capillary-Marangoni speed V_M = √(Δγ/ρ). All particles are swept to the boundary in a fraction of a second. Time the wavefront: compare to V_M formula.

**Thermocapillary welding simulation:** 2D top-down view of a weld pool. Hot center (low γ), cool periphery (high γ). Depending on the sign of ∂γ/∂T, show inward-flowing (deep narrow weld) vs. outward-flowing (wide shallow weld) convection. This is the industrial application — show how a 10ppm change in sulfur concentration reverses the flow direction.

---

## The Interactive Demo

- **Alcohol concentration** slider: 5% to 40% (wine to whiskey; higher % = stronger Marangoni)
- **Evaporation rate** slider: slow to fast (controls how quickly concentration gradients form)
- **Glass tilt angle** slider: 0° to 90° (vertical = maximum gravity-driven flow)
- **Surface tension sensitivity** slider: ∂γ/∂c = 0 to -0.08 (0 = Marangoni off; full value = tears)
- **Viscosity** slider: μ = 0.5e-3 to 5e-3 Pa·s (viscous wine delays tear formation)
- **Mode selector**: Tears of wine | Camphor boat | Soap drop | Welding pool | Thin film leveling
- **Color mode**: Film thickness | Ethanol concentration | Surface tension γ | Velocity magnitude
- **Tracer particles**: toggle to add passive particles that visualize the Marangoni flow direction
- **Pause/Reset** and speed controls

---

## Production Notes

**Code to show:**
- The missing Marangoni term — show the thin-film equation with and without it
- The surface tension formula computeGamma(c) — one line, but it changes everything
- The edge evaporation enhancement — explain why evaporation is faster at the edges (thinner film, more air flow near the glass rim)
- The concentration-thickness coupling: `cNew = (c * h - evap * c * dt) / hNew` — concentration changes because both c and h change

**Visual layout:**
- Main view: 2D glass surface (trapezoidal, simulating the inside of a wine glass viewed from the front)
- Color: film thickness h mapped to wine color opacity (thicker = darker red wine)
- Overlaid: surface tension γ contours as thin lines — the gradient lines show where Marangoni force acts
- Right panel: 1D cross-section of film thickness profile showing the rim formation and tear draining

**Key cinematic moments:**
- 00:30 — Real wine glass legs forming — slow-motion macro video
- 01:30 — Soap drop on pepper water: the pepper sweeps to edges instantly
- 03:00 — Naive code: uniform evaporation, no tears ever
- 04:00 — Add Marangoni term: rim forms within 10 seconds of simulation time
- 05:00 — Rim breaks into tears — the regularly-spaced rivulets slide down
- 06:00 — Camphor boat: self-propulsion from asymmetric Marangoni force
- 07:30 — Welding simulation: flip ∂γ/∂T sign and watch the weld pool flow reverse
- 08:30 — "On the ISS, there's no gravity-driven convection. Only Marangoni convection. Understanding this matters for making electronics in space."
- 09:00 — "Try: can you make the tears flow UPWARD? Hint: what if you applied the Marangoni force more strongly at the bottom?"

---

## Tags
`marangoni` `surface-tension` `heat-transfer` `tears-of-wine` `thermocapillary` `fluid-simulation` `concentration-gradient` `canvas`

---

## Thumbnail

A macro close-up photograph of wine glass legs (tears) — vivid red wine, multiple rivulets visible on the glass, backlit against white. Overlaid on the right: the simulation in false-color, showing the thin film as red-orange, the tears as bright-white thicker rivulets, the dry glass as black. Bold text: "WINE CLIMBS ITS GLASS". Sub-text: "Surface tension does the work." Bottom strip: τ_Marangoni = ∂γ/∂x in yellow.
