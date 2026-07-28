---
title: "Water Jets Break Into Perfect Droplets (Plateau-Rayleigh Instability)"
id: M005
difficulty: 5.5/10
prereq: "None"
concept: "A cylindrical fluid column is unstable to perturbations with wavelength λ > 2πr (circumference); surface tension drives the instability to minimize surface area; Rayleigh growth rate σ = (γ/ρr³)^½ · F(kr)."
tags: [surface-tension, instability, droplet-formation, plateau-rayleigh, jets, capillary, fluid-simulation, SPH]
category: medium
type: video-idea
---

# Water Jets Break Into Perfect Droplets (Plateau-Rayleigh Instability)

**Alt title:** "Why Every Water Jet Breaks Into the Same Size Droplets (And Your Naive Code Won't)"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Extreme slow-motion footage (10,000 fps): a tap dripping. The water forms a thin jet, and in the span of 5 milliseconds the jet pinches off into perfectly spherical droplets of almost identical size. Frame by frame: the cylindrical column develops a regular undulation, like a string of pearls. The undulations grow. The thin necks pinch. Droplets separate. Each primary droplet is flanked by a tiny satellite droplet — an artifact of the pinch singularity.

Cut to: a 3D-printed microfluidic chip, viewed under a microscope. Channels the width of a hair merge, and a stream of water is being cut by oil — producing identical droplets every 50 milliseconds on a precision schedule. "Microfluidic devices generate exactly 1 million identical droplets per second using this exact physics. And our first code won't pinch at all."

"This was explained by Plateau in 1849 and Rayleigh in 1879. It took another 150 years to get the math right for the satellite droplets. We'll get the main instability today."

---

## The Naive Attempt

Simulate a cylindrical column in 2D axisymmetric coordinates (r, z). The column has radius r₀. Apply surface tension by computing curvature at the surface and adding a pressure contribution. Start with a small sinusoidal perturbation.

```javascript
// 1D model: track surface radius R(z) along a cylindrical column
// Naive: just apply surface-tension pressure without proper dynamics

const NZ = 256;
const r0 = 0.1;       // unperturbed radius
const gamma = 0.072;  // surface tension
const rho = 1000;

// Initialize: sinusoidal perturbation
const R = new Float32Array(NZ);
const Rt = new Float32Array(NZ); // dR/dt
for (let i = 0; i < NZ; i++) {
  R[i] = r0 * (1 + 0.01 * Math.sin(2 * Math.PI * i / 40));
}

function step(dt) {
  for (let i = 1; i < NZ-1; i++) {
    // Curvature in azimuthal direction: 1/R(z)
    const kappa_phi = 1 / R[i];
    // Curvature in axial direction: -R''/(1+R'^2)^(3/2) ≈ -R'' for small slopes
    const Rzz = (R[i+1] - 2*R[i] + R[i-1]) / (dz * dz);
    const kappa_z = -Rzz;
    // Total curvature driving pressure: gamma * (kappa_phi + kappa_z)
    const pressure_gradient = gamma * (kappa_phi + kappa_z);
    // Naive: just move R in direction of pressure gradient (wrong!)
    R[i] += dt * pressure_gradient * 0.001;
  }
}
```

Run it. The column doesn't pinch — instead, it blows up. After a few steps, the larger-radius sections grow larger (higher pressure pushing outward? — but that's wrong), and the thinner sections get thinner but slowly and uniformly. After 100 steps, the column is grossly non-physical: amplitudes growing everywhere, no pinch, no droplet.

---

## The Moment of Failure

On screen: a plot of R(z) over time. The sinusoidal undulation with amplitude 0.01 should grow for long wavelengths and decay for short wavelengths. Instead, every wavelength grows — the simulation is unconditionally unstable, blowing up at all scales. Within 200 steps, R[i] becomes negative somewhere (unphysical), and the simulation crashes with NaN propagating through the entire array.

The second failure mode: even if the amplitudes are stabilized with a clamp, the perturbation grows but never pinches — it just makes deeper undulations forever. There's no singularity formation, no droplet separation. The model has no concept of what happens when the radius approaches zero.

These failures have a common root: the naive code models the wrong physical quantity. The driving force isn't just the pressure difference — it's the pressure-driven flow inside the column, which has inertia and viscosity. The Rayleigh model is a fluid dynamics problem, not a geometric deformation problem.

---

## Why It Broke — The Physics

The Plateau-Rayleigh instability is a competition between two curvatures with opposite signs for the surface pressure (Young-Laplace equation):

$$\Delta p = \gamma \left(\frac{1}{R} + \frac{1}{R_s}\right) = \gamma \left(\frac{1}{R} - R_{zz}\right)$$

Here, R is the local radius (curvature 1/R in the azimuthal direction, contributing positive pressure) and R_s = -1/R_zz is the radius of curvature in the axial direction (negative for an undulation that makes a "belly," contributing negative pressure). The net pressure difference between a swollen region and a thin region drives flow.

For a mode with wavenumber k (perturbation λ = 2π/k), the azimuthal curvature contributes +1/r₀ and the axial curvature contributes -k²r₀ × (perturbation amplitude). The net driving force changes sign at k = 1/r₀, i.e., at λ = 2πr₀ — the **circumference of the cylinder.** Perturbations with λ > 2πr₀ (low k) are unstable; shorter ones are stable.

The Rayleigh growth rate for inviscid flow is:

$$\sigma = \sqrt{\frac{\gamma}{\rho r_0^3}} \cdot \frac{1}{\sqrt{2}} \cdot (kr_0) \sqrt{1 - (kr_0)^2} \cdot I_0(kr_0) / I_1(kr_0)$$

where I₀ and I₁ are modified Bessel functions of the first kind (accounting for the cylindrical geometry of the velocity field inside the jet). The maximum growth rate occurs at kr₀ ≈ 0.697, giving λ_max ≈ 4.51 × 2r₀ — so the preferred breakup wavelength is about 4.5 diameters. This is the "Rayleigh length."

For viscous jets (Rayleigh-Weber analysis), the growth rate is modified and a satellite droplet forms between primary droplets at the pinch-off moment — this is an unsolved analytical problem even today (the satellite droplet size depends on the full nonlinear dynamics of the singularity).

---

## The One Concept

The **Plateau-Rayleigh instability** is the fundamental reason that all liquid jets break into droplets. It was first analyzed experimentally by Joseph Plateau in 1849 (he worked with oil in water, removing gravity from the problem) and theoretically by Lord Rayleigh in 1879 using inviscid linear stability analysis.

The physical argument is thermodynamic and elegant. A long cylinder of fluid has a larger surface area than the equivalent volume formed into a sphere. Surface tension, which acts to minimize surface area, therefore drives the cylinder toward a spherical shape. But the cylinder cannot simply shrink uniformly — it must break up. The question is: what's the fastest way to reduce surface area by breaking up? The answer is the breakup into spheres of radius R_sphere = (3r₀²L/4)^(1/3) for a cylinder of radius r₀ and length L. The optimal wavelength (minimum surface area per droplet) turns out to be λ = 2π√2 × r₀ ≈ 8.9 r₀ — close to but not identical to the fastest-growing Rayleigh mode at 4.51 diameters.

The distinction between the most-unstable wavelength and the minimum-surface-area wavelength is subtle and important: in a real jet, the fastest-growing mode wins the race to pinch-off (it's a competition in exponential growth), not the thermodynamically optimal mode. This is why you need linear stability analysis, not just thermodynamics, to predict the actual droplet size.

The satellite droplet problem illustrates the limits of linear theory. Near pinch-off, the neck radius r → 0 and the perturbation amplitude is no longer small — nonlinear effects dominate. The fluid in the neck is pinched from both sides, but the pinching is asymmetric (one side of the neck connects to a large droplet, the other to the jet body), so the neck doesn't pinch symmetrically. A tiny satellite droplet — about 1/10 the diameter of the primary droplet — is left between adjacent primary droplets. Its size is set by the self-similar singularity of the Navier-Stokes equations at pinch-off, a deeply studied problem in PDE analysis.

Applications span enormous scales. In inkjet printing, the print head creates controlled Plateau-Rayleigh breakup to generate droplets of precise volume at 20,000 drops/second. The viscosity and surface tension of the ink are carefully tuned to suppress satellite droplets (which would blur the print). In microfluidics, droplets serve as individual reaction vessels — thousands of PCR reactions or drug screening assays in a single microfluidic chip. In nuclear reactors, liquid metal jet breakup must be analyzed for safety. In spray coating and agricultural sprayers, droplet size distribution (controlled by jet breakup) determines penetration and drift. In space, water jets in zero gravity show pure Plateau-Rayleigh breakup without gravitational drip — used in ISS water recycling systems.

---

## The Fix

Model the interior velocity field. For an inviscid jet, use a 1D long-wave model (Eggers equations or the simplified Rayleigh model):

```javascript
// 1D long-wave model for an inviscid axisymmetric jet
// Variables: R(z) = surface radius, U(z) = axial velocity (cross-sectionally averaged)
// Continuity: d/dt(R²) + d/dz(R²·U) = 0
// Momentum:   dU/dt + U·dU/dz = -(1/ρ) · d/dz(gamma * kappa)
// where kappa = 1/R - R_zz / (1 + R_z²)^(3/2)

const NZ = 512;
const dz = 0.01;
const r0 = 1.0;
const gamma = 1.0; // non-dimensionalized
const rho = 1.0;

const R = new Float32Array(NZ);
const U = new Float32Array(NZ);

// Initialize: perturb with band of modes near k*r0 = 0.697
for (let i = 0; i < NZ; i++) {
  let pert = 0;
  for (let m = 1; m <= 10; m++) {
    pert += 0.01 * Math.cos(2 * Math.PI * m * i / NZ + Math.random() * 2 * Math.PI);
  }
  R[i] = r0 + pert;
  U[i] = 0;
}

function curvature(i) {
  // First and second derivatives of R using central differences
  const Rz  = (R[(i+1+NZ)%NZ] - R[(i-1+NZ)%NZ]) / (2*dz);
  const Rzz = (R[(i+1+NZ)%NZ] - 2*R[i] + R[(i-1+NZ)%NZ]) / (dz*dz);
  const denom = Math.pow(1 + Rz*Rz, 1.5);
  return 1/R[i] - Rzz / denom;
}

function step(dt) {
  const Rn = new Float32Array(NZ);
  const Un = new Float32Array(NZ);

  for (let i = 1; i < NZ-1; i++) {
    const im = (i-1+NZ)%NZ, ip = (i+1+NZ)%NZ;

    // Continuity: d(R²)/dt = -d(R²·U)/dz
    const flux_p = R[ip]*R[ip] * U[ip];
    const flux_m = R[im]*R[im] * U[im];
    Rn[i] = Math.sqrt(Math.max(1e-6,
      R[i]*R[i] - dt * (flux_p - flux_m) / (2*dz)
    ));

    // Momentum: dU/dt = -U·dU/dz - (gamma/rho)·d(kappa)/dz
    const dU_dz  = (U[ip] - U[im]) / (2*dz);
    const dkap_dz = (curvature(ip) - curvature(im)) / (2*dz);
    Un[i] = U[i] - dt * (U[i] * dU_dz + (gamma/rho) * dkap_dz);
  }
  R.set(Rn); U.set(Un);
}
```

Now the simulation works. The perturbation at k·r₀ ≈ 0.697 grows fastest. The column develops a pearl-string pattern. After several growth times, the thin necks reach r → 0 and the column "pinches" — in the code, R[i] approaches the `1e-6` clamp, and the droplet has separated. Render R(z) as a 3D axisymmetric surface (rotate R around the z-axis) using a WebGL cylinder with variable radius. The result looks exactly like a water jet photograph.

---

## The Wow Moment — Push It

**Satellite droplet hunt:** Let the simulation run past pinch-off. Between primary droplets (where R → 0), a tiny secondary peak in R remains — the satellite droplet. Its size (relative to primary) depends on viscosity. Compare Ohnesorge number Oh = μ/√(ρ γ r₀) at Oh = 0.01 (low viscosity, large satellite) vs Oh = 0.3 (high viscosity, smaller satellite). Show real inkjet images comparing satellite sizes.

**Multi-mode competition:** Initialize with two modes — one at k·r₀ = 0.5 and one at k·r₀ = 0.697. The 0.697 mode wins the exponential race, but if the 0.5 mode has 10× larger initial amplitude, it can win instead. Show this sensitive dependence — it's why inkjet printers actively control the initial perturbation.

**3D rendered column:** Use a WebGL shader to render R(z,t) as an axisymmetric surface. Add a transparent interior, refraction shader, caustics pattern on the background (the optical focusing effect of curved water). The result is photorealistic.

**Viscous modification:** Add a viscous stress term to the momentum equation. Watch the growth rate slow with increasing viscosity. Show the Rayleigh vs Weber growth rate curves side by side — viscosity shifts and suppresses the maximum growth rate.

---

## The Interactive Demo

- **Jet radius r₀** slider: 0.1 to 1.0 mm (rescales the entire simulation)
- **Perturbation wavenumber k·r₀** slider: 0.1 to 0.99 (shows stable vs unstable regime — animate transition through k=1)
- **Initial perturbation amplitude** slider: 0.1% to 10% of r₀
- **Surface tension γ** slider: 0.001 to 0.5 N/m (controls growth time scale)
- **Viscosity (Ohnesorge number)** slider: Oh = 0 to 1 (0 = inviscid, 1 = very viscous)
- **Number of modes** slider: 1 to 20 (multi-mode random initial perturbation)
- **View mode**: Side view (2D R(z) plot) | 3D axisymmetric render | Growth rate curve (theory vs simulation)
- **Show theory overlay**: toggle growth rate σ(k) curve from Rayleigh formula (should match simulation growth rates)
- **Pause/Reset** and speed controls

---

## Production Notes

**Code to show:**
- The naive geometry-only model failing dramatically (blowup)
- The correct 1D long-wave model — specifically the continuity equation (conservation of volume) as the "missing ingredient" alongside the momentum equation
- The curvature formula — emphasize the two terms with opposite signs, and that the competition between them produces the cutoff at λ = 2πr₀
- The clamp `Math.max(1e-6, ...)` as a pinch-off indicator — the moment this activates, a droplet has separated

**Visual layout:**
- Main view: 3D rendered water column, rotating slowly for a "product demo" look
- Below main: 2D plot R(z) with time evolution shown as color-coded curves (early = blue, late = red)
- Right panel: growth rate σ vs k plot (theoretical curve as a smooth line, simulation data as dots)

**Key cinematic moments:**
- 00:30 — 10,000 fps water jet footage — individual frames of pinch-off
- 02:00 — Naive code blowup — NaN propagation, crash screen
- 03:15 — First successful pinch-off in simulation — slow-motion replay, emphasize satellite droplet
- 04:30 — Show σ(k) curve: draw the zero crossing at k·r₀ = 1 and maximum at k·r₀ = 0.697
- 05:45 — 3D WebGL render — comparison to photo: identical
- 07:00 — Ohnesorge sweep: satellite droplet grows as viscosity drops
- 08:00 — Inkjet application: real inkjet waveform on oscilloscope vs simulation
- 09:00 — "Every drop of rain that falls was created by this instability"

---

## Tags
`surface-tension` `instability` `droplet-formation` `plateau-rayleigh` `jets` `capillary` `fluid-simulation` `SPH`

---

## Thumbnail

Extreme close-up, backlit: a falling water jet mid-breakup, perfectly captured at the moment of pinch-off — the classic "string of pearls" shape. Overlaid on the right half: the simulation's 3D rendered jet in the same state — identical geometry. The pinch-off point is circled in red with an arrow. Bold white text: "WHY JETS BECOME DROPS". Yellow bottom strip: "λ_max = 4.51 × diameter". A secondary label: "Inkjet printers exploit this."
