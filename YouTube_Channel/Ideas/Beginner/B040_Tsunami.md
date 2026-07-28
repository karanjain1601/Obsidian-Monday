---
title: "How a Tsunami Forms (From Seafloor to Wave)"
id: B040
difficulty: 2.5/10
prereq: "B024 — Wave Types and Propagation"
concept: "Shallow-water wave speed c = √(gd) decreases with depth; energy conservation forces wavelength compression and height amplification (shoaling) as the tsunami approaches shore"
tags: [physics, tsunami, shallow-water-waves, shoaling, seismology, fluid-dynamics, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# How a Tsunami Forms (From Seafloor to Wave)

**Alt title:** "The Wave That Crossed 5,000 km at 700 km/h (And Was Invisible)"
**Difficulty:** 2.5/10 | **Prereq:** B024 — Wave Types and Propagation

---

## Opening Hook (0:00–1:00)

Show a satellite altimetry map of the Indian Ocean on December 26, 2004, at approximately 01:00 UTC — about 15 minutes after the Sumatra-Andaman earthquake (M9.1) ruptured. The sea surface height anomaly is barely 0.5 meters over a region 400 km wide. From space, it is nearly invisible. Ships in the area reported nothing unusual — the wave was 200 km long and 0.5 m tall. That's a height-to-wavelength ratio of 1 in 400,000. Completely imperceptible.

Now show the coastline of Banda Aceh, Indonesia, 15 minutes later. Wall-to-wall destruction. A wave that has been measured at up to 30 meters tall stripped the city in under 10 minutes. The same physical water. The same amount of energy. The only thing that changed: the depth of the ocean beneath the wave. At 4,000 meters depth: wave speed 200 m/s, height 0.5 m. At 10 meters depth: wave speed 10 m/s, height... do the math with us.

This is shoaling — the most dramatic and lethal physical process in oceanography. The equation is simple: `c = √(g·d)`. The consequence is staggering: compress the wave speed by a factor of 20 (from deep ocean to shore) and the wave height must amplify to conserve energy. The numbers kill. We are going to code this, watch it fail to amplify, then fix it and see a 0.5-meter open ocean wave become a 20-meter coastal surge.

---

## The Naive Attempt

Model the tsunami as a wave of fixed shape (Gaussian profile) moving at constant speed from the earthquake source to the shore. The wave speed is fixed at the deep-ocean value regardless of the water depth beneath it.

```javascript
const wave = {
  position: 0,          // km from earthquake source
  speed: 200,           // m/s = 720 km/h (deep ocean, d=4000m)
  height: 0.5,          // meters — initial wave height
  wavelength: 200000,   // meters = 200 km
};

const bathymetry = generateBathymetry();  // constant depth = 4000 m everywhere

function update(dt) {
  // Fixed speed, fixed shape — just translate the wave
  wave.position += wave.speed * dt;

  // When wave reaches shore (depth -> 0):
  if (wave.position >= SHORE_DISTANCE) {
    displayHeight(wave.height);  // shows 0.5 m — unchanged from source
  }
}

function displayWave(x) {
  const distFromCenter = x - wave.position;
  return wave.height * Math.exp(-(distFromCenter/wave.wavelength)**2);
}
```

The wave maintains its 0.5-meter height as it travels across the entire ocean and arrives at the shore at 0.5 meters. There is no amplification, no speed change, no shoaling.

---

## The Moment of Failure

The simulation shows a gentle half-meter ripple moving across the ocean at 720 km/h, arriving at the coastline as... a half-meter ripple. A person standing on the beach would barely notice it — the tide routinely varies by more than 0.5 meters in many coastal areas. The "tsunami" is utterly unimpressive.

This completely contradicts observed reality. The 2004 Sumatra tsunami, which had exactly these open-ocean characteristics (sub-meter height, 200 km wavelength), killed approximately 227,000 people across 14 countries. The naive model would predict survivable coastal flooding at most.

The bug is the assumption of constant wave speed. In reality, `c = √(g*d)` means the wave must slow down as depth decreases approaching shore. But the simulation moves at the constant deep-ocean speed regardless. When you enforce constant speed, you automatically decouple the wave from the physical relationship between its energy and its geometry. Energy flux (power per unit crest length) = E * c_group = const. If c decreases but E·c = const, then E must increase. If E = ½ρgA² (energy per unit area), then A ∝ 1/√c ∝ 1/d^(1/4). A factor of 400 in depth decrease (4000 m → 10 m) gives A amplification of 400^(1/4) = 4.5× minimum. But additional effects (wave-crest focusing by coastal geometry) can multiply this further to give the observed 30+ m surge.

---

## Why It Broke — The Physics

A tsunami is a shallow-water wave — a wave whose wavelength is much larger than the water depth (λ >> d). For shallow-water waves, the phase velocity and group velocity are equal:
```
c_phase = c_group = √(g * d)
```
This is fundamentally different from deep-water waves (λ << d), where `c = √(g*λ/(2π))` and group velocity = half phase velocity. The shallow-water limit applies when `d < λ/20`, which for a tsunami with λ = 200 km means d < 10 km — effectively the entire ocean.

**Shoaling — Amplitude Amplification:**
Energy flux conservation in one dimension:
```
E * c_group = const
E = ½ * ρ * g * A²   (energy per unit crest length)
½ * ρ * g * A² * c = const
A ∝ 1/√c ∝ d^(-1/4)
```
As d → 0: A → ∞ (the wave breaks before this singularity, but not before reaching very large amplitudes).

**Wavelength Compression:**
`λ ∝ c * T`, and T (period) is conserved (the wave's period is set by the source and doesn't change during propagation). So as c decreases, λ decreases proportionally: from 200 km in the open ocean to perhaps 10 km near shore. This "piles up" the water.

**Numerical Example:**
- Open ocean: d = 4000 m → c = √(9.81 × 4000) = 198 m/s. A = 0.5 m.
- Continental shelf: d = 100 m → c = √(9.81 × 100) = 31.3 m/s. A = 0.5 × (198/31.3)^(1/2) = 1.26 m.
- Near-shore: d = 10 m → c = √(9.81 × 10) = 9.9 m/s. A = 0.5 × (198/9.9)^(1/2) = 2.24 m. Plus runup amplification factor of ~3-10×: 6.7–22.4 m.

---

## The One Concept

**Shoaling** is the process by which water waves increase in height as they enter shallower water, due to the decrease in wave propagation speed and the conservation of energy flux. For shallow-water waves specifically, `c = √(gd)`, and the shoaling coefficient — the factor by which wave height increases — is:
```
K_shoaling = (c_0 / c)^(1/2) = (d_0 / d)^(1/4)
```
where subscript 0 denotes deep-water values.

**Why Shallow-Water Waves Are Special:** In deep water, waves are oscillatory — water molecules trace circular paths, and only the wave pattern (not the water) moves. In shallow water, the circular orbits are flattened into ellipses by the seafloor, and the wave becomes more of a translational surge (the water actually moves forward as a mass, not just oscillating in place). This transition from oscillatory to translational is what makes the shallow-water formula c = √(gd) apply and what makes tsunamis so destructive at shore — they are not a crashing breaking wave like a wind-generated swell, they are a sustained wall of water advancing inland.

**The Non-Linear Regime:** The shoaling formula is linear (assumes wave height << water depth). As the tsunami approaches shore and height becomes comparable to depth (h/d > 0.1), non-linear effects cause the wave to steepen — the leading face becomes nearly vertical (a bore) while the trailing face is gradual. This is the iconic "wall of water" appearance. Non-linear shallow water equations (Saint-Venant equations) are required for accurate near-shore modeling.

**Real-World Examples:**
1. **Warning systems:** The DART (Deep-ocean Assessment and Reporting of Tsunamis) buoy network places seafloor pressure sensors in the deep Pacific. These detect the sub-centimeter sea level rise of an open-ocean tsunami. When detected, the shoaling formula predicts coastal heights given the coastal bathymetry — giving coastal communities 15-30 minutes of warning.
2. **Lituya Bay, 1958:** A 30.6 million cubic meter rockfall into a narrow fjord in Alaska generated a 524-meter megatsunami at one end of the bay. The extraordinary height was due to the bay's geometry: the impulse wave was funneled by the bay walls (focusing) and amplified by the shallow water at the bay head (shoaling). Same physics, extreme geometric factors.
3. **The "sloshing" effect on lakes:** Lake seiches (pronounced "saysh") are resonant standing waves on enclosed water bodies. When the wind or an earthquake rocks the water, shoaling-like amplification can occur at the shallow end of an asymmetric lake. The 1755 Lisbon earthquake created seiches in lakes across Northern Europe, observed as far away as Scotland and Scandinavia.

---

## The Fix

Replace the constant wave speed with depth-dependent speed computed from local bathymetry. Propagate the wave using the shallow-water wave equations, updating the wave height at each point from energy flux conservation.

```javascript
// Bathymetry profile (depth vs. horizontal position, in meters)
function depth(x) {
  // Simple model: flat deep ocean, continental shelf slope, near-shore
  if (x < 4000000) return 4000;                    // deep ocean (km range)
  if (x < 4200000) return 4000 - (x - 4e6) * 0.13; // continental slope
  if (x < 4350000) return 200 - (x - 4.2e6) * 0.01; // shelf
  return Math.max(1, 50 - (x - 4.35e6) * 0.02);   // near-shore
}

function waveSpeed(x) {
  return Math.sqrt(9.81 * depth(x));   // c = sqrt(g*d)
}

// Discretize the ocean into grid cells, apply 1D shallow-water equations
const NX = 1000;
const dx = 5e6 / NX;    // 5000 km domain, 5 km resolution
const eta = new Float64Array(NX).fill(0);   // sea surface height perturbation
const u   = new Float64Array(NX).fill(0);   // depth-averaged horizontal velocity

// Initialize: earthquake creates a seafloor uplift that displaces the water
for (let i = 200; i < 250; i++) {
  eta[i] = 0.5 * Math.exp(-((i - 225) / 20)**2);   // Gaussian source
}

function updateSWE(dt) {
  const eta_new = new Float64Array(NX);
  const u_new   = new Float64Array(NX);
  for (let i = 1; i < NX - 1; i++) {
    const d = depth(i * dx);
    const c = Math.sqrt(9.81 * d);
    // Conservation of mass: ∂η/∂t = -∂(d·u)/∂x
    eta_new[i] = eta[i] - d * (u[i+1] - u[i-1]) / (2 * dx) * dt;
    // Conservation of momentum: ∂u/∂t = -g·∂η/∂x
    u_new[i]   = u[i] - 9.81 * (eta[i+1] - eta[i-1]) / (2 * dx) * dt;
  }
  eta.set(eta_new);
  u.set(u_new);
}
```

Run the simulation. As the wave approaches the continental shelf, watch the height increase automatically — the physics of the wave equation produces shoaling without any special-case code. The height goes from 0.5 m in the deep ocean to 2-3 m on the shelf to 8-15 m near shore (depending on the bathymetry slope). The wave also slows dramatically — what was 200 m/s in the deep ocean is now 30 m/s on the shelf and 9 m/s near shore. The wavelength visibly compresses.

---

## The Wow Moment — Push It

Simulate the 2004 Indian Ocean tsunami with a realistic Indian Ocean bathymetry profile. The earthquake (M9.1, Sumatra-Andaman subduction zone) generates a seafloor displacement of approximately 10-15 meters over an area 1,200 km long × 200 km wide. Initialize the sea surface with this displacement profile.

Propagate the waves across the Indian Ocean in all directions simultaneously (2D simulation using the full shallow-water equations on a grid). Show:

1. **The directional pattern:** The wave is strongest perpendicular to the fault (east-west) and weakest along the fault strike (north-south) — the elliptical fault shape creates a directional radiation pattern. Sri Lanka (perpendicular to fault, ~1,500 km away) was hit far harder than Bangladesh (along-strike, ~1,500 km away).

2. **Seafloor focusing:** Underwater ridges and seamount chains act like optical lenses for tsunami waves — ridges focus energy, creating "hot spots" of amplification at specific coastal locations. The Carlsberg Ridge in the western Indian Ocean focused energy toward the Maldives and Somalia.

3. **Arrival times:** Animate the wave propagation and show the clock — Sumatra 15 min, Thailand 30 min, Sri Lanka 2 hours, India 3 hours, East Africa 7 hours, South Africa 11 hours. The wave circled the entire Indian Ocean.

Then simulate the Lituya Bay 1958 megatsunami: a simple 2D basin geometry with a point-source impact wave. Watch the wave amplify to 524 meters at the head of the bay — and then strip the trees from the hillside up to exactly that height, a geological record that persisted for decades. The geometry of the bay is the amplifier: same energy, extreme focusing.

---

## The Interactive Demo

Side-view simulation with editable bathymetry (1200×600 px, ocean-blue background):

**Bathymetry Editor:**
- **Draw tool:** click-drag to reshape the ocean floor profile (smooth spline through control points).
- **Depth scale:** color-coded depth profile (dark blue = deep, turquoise = shallow, tan = near-shore).
- **Preset Profiles:** "Pacific open ocean," "Continental shelf," "V-shaped bay (Lituya)," "Coral reef front," "Custom."
- **Underwater ridge:** toggle to add a submarine ridge and observe focusing.

**Earthquake Source:**
- **Epicenter position slider:** place the earthquake at any point along the basin.
- **Magnitude slider** (M6–M9.5): sets the initial seafloor displacement magnitude.
- **Fault orientation:** tilts the directional radiation pattern.

**Wave Propagation Displays:**
- Animated wave height profile (yellow-orange line above the bathymetry).
- **Shoaling coefficient panel:** live display of K_shoaling = (d_0/d)^(1/4) at the current wave front position.
- **Wave speed vs. position:** mini-graph below main canvas showing c(x) = √(gd(x)).
- **Height amplification factor:** shows the ratio of current height to source height in real time as the wave approaches shore.
- **Wave period display:** confirms T is constant throughout propagation.

**Historical Presets:**
- "2004 Sumatra" — realistic Indian Ocean profile, M9.1 source. Shows 30 m coastal amplification.
- "1960 Chile" — Pacific profile, M9.5, shows trans-Pacific propagation to Hawaii (arrival time 15 hours, 10 m height).
- "1958 Lituya Bay" — narrow bay geometry, shows 524 m amplification factor.
- Arrival time calculator for major coastal cities (user selects earthquake, cities labeled on map).

---

## Production Notes

**Structure and timing:**
- Hook: 0:00–1:00 (60 s). The satellite altimetry data from 2004 is publicly available (TOPEX/Poseidon satellite data from the NOAA archive). Show the nearly invisible 0.5 m wave in the open ocean against the actual footage or photographs of the Banda Aceh coastline. The contrast is the hook.
- Naive attempt: 1:00–2:30 (90 s). The constant-speed wave model is simple and deliberately flat — its failure is immediately visible when the coastal height remains 0.5 m. The "barely a ripple" failure is more visceral when shown against the actual casualty count from the 2004 tsunami.
- Physics explanation: 2:30–5:30 (180 s). The c = √(gd) derivation can be shown intuitively: deeper water → more inertia per unit column → wave moves slower. Then derive the shoaling coefficient. The numerical example (0.5 m → 22 m) should be shown step by step with intermediate values at each depth level.
- The fix: 5:30–7:30 (120 s). The shallow-water equations are the mathematical core. Show just the two conservation laws (mass and momentum) without full derivation. The key visualization: the wave height profile animating and growing as it enters shallow water. This is the video's "it works" moment.
- Wow moment: 7:30–10:00 (150 s). The 2D Indian Ocean simulation should be pre-computed (it takes seconds to minutes depending on resolution). Animate the propagation as a time-lapse. The Lituya Bay simulation is quick and its 524 m height display is the number that makes viewers' jaws drop.
- Interactive demo: 10:00–11:00 (60 s).

**Key filming decisions:** The bathymetry editor is the interactive demo's centerpiece — users should immediately understand how changing the depth profile changes the amplification. Use bright contrasting colors: ocean blue for water, dark for depth, warm colors for the wave height. The "shoaling coefficient" display updating in real time as the wave crosses the shelf-break is the most educational single visual in the demo.

**Data sources:** ETOPO1 global bathymetry (NOAA), GEBCO global ocean topography, DART buoy data from NOAA, USGS earthquake rupture data. All public domain.

**Approximate runtime:** 11 minutes.

---

## Tags
`physics` `tsunami` `shallow-water-waves` `shoaling` `seismology` `fluid-dynamics` `javascript` `canvas`

---

## Thumbnail

Split-frame: left half shows a satellite image of the open Indian Ocean with the nearly-invisible tsunami wave annotated with a height label "0.5 m" in tiny text, with a tiny arrow pointing to the wave trace. Right half shows a photograph (or stylized simulation) of a 20-meter wall of brown water surging inland over a coastal city, with "20 m" in massive white letters. Connecting the two frames: the formula "c = √(gd)" centered in the dividing strip. Top text: "SAME WAVE." The single equation in the center is the explanation for the entire contrast. Stops the scroll because the 0.5 m vs. 20 m juxtaposition is emotionally and visually striking — viewers immediately grasp that a 40× amplification in a familiar and tragic context demands an explanation.
