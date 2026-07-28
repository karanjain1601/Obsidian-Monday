---
title: "Shear Makes Clouds Roll Into Spirals (Kelvin-Helmholtz Instability)"
id: M002
difficulty: 5/10
prereq: "None"
concept: "KH instability at a velocity shear interface; growth rate σ = k·(U₁-U₂)/2·√(ρ₁ρ₂)/(ρ₁+ρ₂); viscosity and surface tension suppress short-wavelength modes."
tags: [fluid-simulation, instability, kelvin-helmholtz, shear-flow, vortex, clouds, navier-stokes, canvas]
category: medium
type: video-idea
---

# Shear Makes Clouds Roll Into Spirals (Kelvin-Helmholtz Instability)

**Alt title:** "The Exact Same Physics That Makes Clouds Roll Makes Jupiter's Bands Swirl"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Aerial time-lapse: a cloud bank over the Pacific. At first, perfectly flat and featureless. Then — in the span of 90 seconds — the top edge begins to roll. A dozen evenly-spaced spirals materialize simultaneously, each one curling like a breaking ocean wave frozen in the sky. They grow, merge, and within 10 minutes the whole cloud top has been devoured into chaotic swirls.

Cut to: the Great Red Spot of Jupiter. Zoom in on the jet streams flanking it — same regular rolling pattern, same spacing, same spiral curl. Cut to: an ocean wave about to break — the lip curls forward in exactly the same geometry.

"This pattern appears at every scale in the universe, from your morning coffee to a neutron star's magnetic sheath. In 10 minutes, you're going to code it. And your first attempt will give you absolutely nothing."

---

## The Naive Attempt

The obvious approach: two horizontal layers of fluid moving in opposite directions. Top layer moves right at speed +U, bottom layer moves left at -U. Represent this as a velocity field on a 2D grid. Add a small random perturbation to the interface. Let the advection equation run.

```javascript
const N = 256;
const U = 1.0; // shear velocity

// Initialize velocity: top half moves right, bottom half moves left
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    vx[i + j * N] = (j > N / 2) ? U : -U;
    vy[i + j * N] = 0;
  }
}

// Add random interface perturbation
for (let i = 0; i < N; i++) {
  const jInterface = Math.floor(N / 2 + (Math.random() - 0.5) * 4);
  density[i + jInterface * N] = 0.5; // mark interface
}

// Step: just advect velocity with itself
function step() {
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const idx = i + j * N;
      // Upwind advection of vx
      const dvx_dx = vx[idx] > 0
        ? vx[idx] - vx[(i-1) + j*N]
        : vx[(i+1) + j*N] - vx[idx];
      vxNew[idx] = vx[idx] - dt * vx[idx] * dvx_dx / dx;
    }
  }
  [vx, vxNew] = [vxNew, vx];
}
```

Run it. The interface marker diffuses away after about 20 steps. The velocity field smears into a gradient. No spirals. Nothing.

---

## The Moment of Failure

The canvas shows two grey rectangles (lighter top, darker bottom) separated by a blurry band that widens every frame. After 50 frames, everything is a uniform mid-grey. The velocity field arrows, if drawn, all point slightly sideways but with no rotation anywhere. The failure is not dramatic — it is a quiet, gradual erasure of any structure.

The reason it looks like nothing is happening is precisely that nothing is happening: numerical diffusion from the upwind scheme smears any perturbation before the instability has a chance to amplify it. And even if perturbations weren't diffused away, the simulation is missing the crucial ingredient that makes KH work: **vorticity roll-up**. For a shear layer to roll up, the velocity field must develop a rotating component — ∂vx/∂y ≠ 0 must couple back to ∂vy/∂x — and this coupling requires pressure. Without a pressure solve, the two velocity components are decoupled and the feedback loop never forms.

---

## Why It Broke — The Physics

The Kelvin-Helmholtz instability lives in the vorticity field. A velocity discontinuity (top fluid moving right at U₁, bottom moving left at U₂) is, in the language of vorticity, an infinite sheet of concentrated vorticity along the interface — a vortex sheet. The total vorticity per unit length is ω = U₁ - U₂.

Now perturb the sheet with a sinusoidal displacement. The sheet buckles. Where the sheet curves toward the upper stream, the upper-stream fluid squeezes through a narrower gap, speeds up (Bernoulli: faster → lower pressure), and the pressure drop sucks the sheet upward more. Where the sheet curves toward the lower stream, same logic in reverse. The perturbation grows.

The linear growth rate for a perturbation with wavenumber k is:

$$\sigma = \frac{k|U_1 - U_2|}{2} \cdot \sqrt{\frac{\rho_1 \rho_2}{(\rho_1 + \rho_2)^2}} \quad \text{(for density-stratified case)}$$

For equal densities (ρ₁ = ρ₂), this simplifies to σ = k(U₁ - U₂)/2. Unlike Rayleigh-Taylor, the growth rate increases indefinitely with k — every shorter wavelength grows faster. This means an inviscid, unresolved simulation would have an ultraviolet catastrophe: the instability would be dominated by the grid-scale mode, producing garbage. Two physical mechanisms regularize this:

- **Viscosity**: adds a term -νk² to the growth rate, killing modes with k > k_max ~ (ΔU/ν)^(1/3)
- **Surface tension γ**: adds a term -γk³/(ρ₁+ρ₂), killing all modes above k_max ~ ΔU²(ρ₁+ρ₂)/(4γ)
- **Density stratification with gravity**: a stable density gradient (light fluid on top) suppresses KH; the Richardson number Ri = (N/S)² (where N is the Brunt-Väisälä frequency and S is the shear rate) must exceed 1/4 for stability.

This is why Jupiter's cloud bands have a preferred roll-up wavelength: viscosity and stratification select a single dominant mode.

---

## The One Concept

**Kelvin-Helmholtz instability** (named for Lord Kelvin and Hermann von Helmholtz, 1868) is the instability of a velocity shear interface. Wherever two fluids move past each other at different speeds, this instability can operate. It is perhaps the most ubiquitous hydrodynamic instability in nature.

The mathematical essence is the behavior of a vortex sheet. A velocity discontinuity is nothing more than a singular layer of vorticity. The vorticity field ω = ∇ × u has the property that isolated vortices induce velocity fields (via the Biot-Savart law, identical in form to the magnetic field from a current). A straight vortex sheet has each element of vorticity inducing equal and opposite flows on either side — the net result is exactly the discontinuous velocity field we started with. Now if the sheet is perturbed, the vorticity elements are no longer collinear. Elements on either side of a crest induce velocity that pushes the crest further out. This is the KH roll-up.

The nonlinear evolution is a gorgeous topological catastrophe. The vortex sheet rolls up into a series of tightly wound spirals — **cats'-eye vortices** in 2D. Each spiral contains a core of concentrated vorticity surrounded by spiral arms that continue to wind up. The spirals then interact, merge pairwise in what's called an **inverse energy cascade** — small spirals merge into larger ones, and those merge further. This is how turbulence transfers energy from small scales to large scales in 2D flows (opposite to 3D turbulence).

In 3D, KH vortices are tubes oriented along the flow direction. These tubes become unstable themselves (elliptic instability), develop sinusoidal kinks along their length, and break down into turbulence — this is one of the primary routes to turbulent transition in shear flows.

Real-world scale range: the KH instability operates in your morning coffee when you pour cream (the interface between cream and coffee rolling into spirals), in atmospheric clouds (roll clouds, "Kelvin-Helmholtz clouds" visible from the ground), in the ocean thermocline (mixing of warm surface water with cold deep water), in Jupiter's Great Red Spot flanking jet streams, in the Earth's magnetopause (solar wind shearing against the magnetosphere), and in galaxy-cluster collisions (hot intergalactic plasma shearing past itself).

A crucial application: KH instability in the ocean thermocline controls vertical mixing of heat and nutrients. Getting this right in climate models is an active area of research — the instability happens at scales smaller than a single climate model grid cell, so it must be parameterized rather than resolved.

---

## The Fix

Three changes: (1) use a smooth hyperbolic tangent shear profile instead of a discontinuity, (2) add proper incompressibility enforcement (pressure solve), and (3) add a focused sinusoidal perturbation seed at the preferred wavelength.

```javascript
// Smooth shear profile: tanh avoids the vortex sheet singularity
const shearWidth = 0.05 * N; // interface thickness in cells
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    const y = (j - N / 2) / shearWidth;
    vx[i + j * N] = U * Math.tanh(y);
    vy[i + j * N] = 0;
  }
}

// Perturbation: sum of sinusoidal modes near the unstable band
const perturbAmp = 0.01;
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    // Perturb the y-velocity at the interface
    const y = (j - N / 2) / shearWidth;
    const envelope = 1 / Math.cosh(y); // Gaussian-like envelope at interface
    vy[i + j * N] = perturbAmp * Math.sin(4 * Math.PI * i / N) * envelope;
  }
}

// Pressure projection (same Gauss-Seidel as M001, but with uniform density here)
function pressureProject() {
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j * N;
      div[idx] = -0.5 * (
        vx[(i+1)+j*N] - vx[(i-1)+j*N] +
        vy[i+(j+1)*N] - vy[i+(j-1)*N]
      );
    }
  }
  for (let iter = 0; iter < 40; iter++) {
    for (let j = 1; j < N-1; j++) {
      for (let i = 1; i < N-1; i++) {
        const idx = i + j * N;
        p[idx] = (div[idx]
          + p[(i-1)+j*N] + p[(i+1)+j*N]
          + p[i+(j-1)*N] + p[i+(j+1)*N]) / 4;
      }
    }
  }
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j * N;
      vx[idx] -= 0.5 * (p[(i+1)+j*N] - p[(i-1)+j*N]);
      vy[idx] -= 0.5 * (p[i+(j+1)*N] - p[i+(j-1)*N]);
    }
  }
}

// Visualize vorticity: ω = ∂vy/∂x - ∂vx/∂y
function computeVorticity() {
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j * N;
      vorticity[idx] = 0.5 * (
        (vy[(i+1)+j*N] - vy[(i-1)+j*N]) -
        (vx[i+(j+1)*N] - vx[i+(j-1)*N])
      );
    }
  }
}
```

Now the simulation works. Within ~5 simulation seconds: the interface develops 4 evenly-spaced spirals (set by the seed wavenumber 4). The spirals tighten. Over ~20 seconds: two pairs of spirals merge (inverse cascade). Over ~50 seconds: two dominant spirals remain. Color by vorticity: each spiral is a bright red-blue yin-yang blob.

---

## The Wow Moment — Push It

**Mode competition race:** Initialize with two perturbation seeds at different wavenumbers — e.g., mode 2 and mode 8. Show live vorticity plot: mode 8 grows first (faster linear rate), but mode 2 wins the nonlinear competition as merging events cascade up. The viewer sees the simulation "change its mind" about dominant scale.

**Richardson number sweep:** Add a stable density gradient (light fluid on top) and a slider for the gradient strength. Show that spirals form and strengthen as Ri decreases through 0.25. At exactly Ri = 0.25, the oscillation between growing and decaying modes in real time. At Ri < 0.25, spirals burst into life.

**Kelvin-Helmholtz clouds generator:** Map a satellite temperature field (or a procedural cloud texture) onto the density field, then drive a horizontal shear across it. The output looks indistinguishable from real satellite imagery of KH clouds — a perfect YouTube thumbnail generator.

---

## The Interactive Demo

- **Shear velocity** slider: ΔU = 0.1 to 5.0 (controls the velocity jump across the interface)
- **Interface thickness** slider: δ = 0.01 to 0.2 (thicker → more stable; maps to tanh profile width)
- **Perturbation mode** slider: m = 1 to 16 (which sinusoidal mode seeds the instability)
- **Perturbation amplitude** slider: 0.001 to 0.05
- **Density ratio** slider: ρ₁/ρ₂ = 0.1 to 1.0 (lighter top layer stabilizes; simulate clouds)
- **Viscosity** slider: ν = 0 to 0.05 (dampens short wavelengths, selects dominant mode)
- **Gravity / stratification** slider: N² = 0 to 10 (Brunt-Väisälä frequency squared; stabilizes)
- **Color mode** toggle: Vorticity | Speed | Density | Pressure
- **Trail mode** toggle: leave velocity streamline traces (produces gorgeous long-exposure spirals)
- **Pause/Reset** and **1×/4×/16×** speed buttons

---

## Production Notes

**Code to show on screen:**
- The broken naive code running — emphasize the boring smear
- The tanh initialization — contrast with the discontinuity and explain why smooth is better numerically
- The vorticity computation — this is the "aha" moment where the math and visual connect
- The Gauss-Seidel loop — keep it on screen for 5 seconds while narrating the intuition

**Visual layout:**
- Main canvas: 512×512 vorticity colormap (blue–white–red diverging scale)
- Inset (top right): velocity field arrows showing the curl developing
- Inset (bottom right): frequency spectrum of the vorticity field (shows dominant mode shifting as spirals merge)

**Key cinematic moments:**
- 00:45 — Cloud time-lapse of actual KH clouds
- 02:00 — Naive code fails — the smear — deadpan reaction
- 03:30 — First spirals appear with the tanh profile — audience reaction expected here
- 05:00 — Merging event: two spirals combine in slow motion (drop playback to 0.1×)
- 06:30 — Side-by-side: real satellite KH cloud image vs simulation — near-identical
- 07:30 — Richardson number slider: spirals blink in and out at the critical Ri = 0.25
- 08:30 — "Now imagine this running inside a neutron star magnetosphere" — NASA animation overlay
- 09:00 — Interactive demo teaser

**Audio note:** The merging events make great sound design opportunities — a low "whomp" each time two spirals fuse.

---

## Tags
`fluid-simulation` `instability` `kelvin-helmholtz` `shear-flow` `vortex` `clouds` `navier-stokes` `canvas`

---

## Thumbnail

Background: dark blue-black sky. Two vivid curling spiral vortices rendered in the simulation's red-blue vorticity colormap — each one clearly a cats'-eye shape. Split-screen comparison to a real cloud photograph of KH instability clouds (the wave-like rolling at a cloud top). Bold white text: "WHY CLOUDS ROLL". Yellow equation strip at bottom: σ = k·ΔU/2. The two spirals in the simulation match the two cloud rolls exactly in framing.
