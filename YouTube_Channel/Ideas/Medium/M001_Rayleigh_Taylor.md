---
title: "Heavy Fluid Falls Through Light Fluid and Mushrooms (Rayleigh-Taylor)"
id: M001
difficulty: 5/10
prereq: "None"
concept: "Rayleigh-Taylor instability: a heavy fluid (ρ₂) overlying a light fluid (ρ₁) is gravitationally unstable; growth rate σ = √(A·g·k) where A=(ρ₂-ρ₁)/(ρ₂+ρ₁) is Atwood number, k is wavenumber."
tags: [fluid-simulation, instability, rayleigh-taylor, SPH, grid-fluid, gravity, mushroom-clouds, density]
category: medium
type: video-idea
---

# Heavy Fluid Falls Through Light Fluid and Mushrooms (Rayleigh-Taylor)

**Alt title:** "Why Thick Smoke Mushrooms Downward: Simulating Rayleigh-Taylor Instability"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a slow-motion clip of an inverted glass of honey being lowered face-down into a tank of water. The honey does not pour out cleanly — instead, it forms a flat pancake at the interface, trembles for a moment, then erupts into a forest of downward-pointing fingers, each tipped with a characteristic mushroom cap. The cap inverts, curls, and the two fluids spiral around each other in vortex rings. The whole thing looks like it's alive.

Cut to: a black-and-white schlieren photograph from a 1950s paper — same finger pattern, same mushroom, same curl — "Scientists have been photographing this for 70 years. Today we're going to code it and watch our code break first."

Pull up a blank code editor. "Three lines of physics separate the code that gives you a flat, boring interface from the code that gives you this." Timestamp flashes: we'll be there at 4:30.

---

## The Naive Attempt

The most natural first stab: simulate a 2D grid of density values. Heavy fluid (ρ = 2) fills the top half. Light fluid (ρ = 1) fills the bottom half. Each cell has a velocity. Apply gravity by adding `vy += g * dt` to every cell. Advect the density field by moving fluid along the velocity field with a simple upwind scheme.

```javascript
const N = 256;
const dt = 0.01;
const g = 9.8;

// Initialize density grid: top half heavy (2.0), bottom half light (1.0)
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    density[i + j * N] = (j < N / 2) ? 2.0 : 1.0;
  }
}

function step() {
  // Apply gravity to velocity field — naive: same force everywhere
  for (let idx = 0; idx < N * N; idx++) {
    vy[idx] += g * dt;
  }
  // Advect density using upwind scheme
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const idx = i + j * N;
      const advX = vx[idx] > 0
        ? density[idx] - density[(i - 1) + j * N]
        : density[(i + 1) + j * N] - density[idx];
      const advY = vy[idx] > 0
        ? density[idx] - density[i + (j - 1) * N]
        : density[i + (j + 1) * N] - density[idx];
      densityNew[idx] = density[idx]
        - dt * vx[idx] * advX / dx
        - dt * vy[idx] * advY / dx;
    }
  }
  [density, densityNew] = [densityNew, density];
}
```

Press play. The density field… smears. Both fluids blur together into a uniform grey soup. No fingers, no mushrooms. Just diffusion without physics.

---

## The Moment of Failure

What you see on screen: a grid that starts as a sharp horizontal stripe (white top, black bottom). Over about 10 frames it blurs to a gradient. By frame 50 it's a uniform mid-grey rectangle. The velocity field (if you draw arrows) shows every arrow pointing straight down with identical magnitude. The interface never develops any horizontal variation. It is perfectly, catastrophically boring.

The failure mode is vivid: the simulation is not wrong in a noisy way — it is wrong in a perfectly symmetric way. Nothing breaks the left-right symmetry, so the instability has no seed. Additionally, the naive gravity application doesn't account for the pressure field — the heavy fluid experiences more buoyancy force than the light fluid, but the pressure never adjusts to create the differential that drives fingers. Without a pressure solve and without a perturbation seed, the physics is simply absent.

---

## Why It Broke — The Physics

Two problems killed the naive approach:

**Problem 1: No pressure solve.** In an incompressible fluid, you cannot simply add gravity to velocity and call it done. The velocity field must remain divergence-free (∇·u = 0). When you add gravity uniformly, you create a velocity field that compresses the fluid — cells try to all move into the same space. The fix is a pressure projection step: solve for a pressure field p such that `u_new = u_gravity - (1/ρ)∇p` satisfies ∇·u_new = 0. This is the Poisson equation: `∇²p = ρ ∇·u_gravity`. Without this, the simulation has no concept of fluid incompressibility, and all the interesting dynamics come from incompressibility-driven pressure differentials.

**Problem 2: No perturbation seed.** The Rayleigh-Taylor instability grows from infinitesimal perturbations. A perfectly flat interface in a perfectly symmetric code stays flat forever — it is an unstable equilibrium, but numerical noise alone is often not enough to seed it, and the upwind advection scheme adds heavy numerical diffusion that damps any seed that might form. You must intentionally perturb the interface.

The key physics: a heavy fluid on top of a light fluid is gravitationally unstable. Any small downward bump in the interface has more heavy fluid pushing down on less light fluid pushing up, so the pressure difference accelerates the bump further down. The linear growth rate of a perturbation with wavenumber k = 2π/λ is:

$$\sigma = \sqrt{A \cdot g \cdot k}$$

where the **Atwood number** A = (ρ₂ - ρ₁)/(ρ₂ + ρ₁) ranges from 0 (identical fluids) to 1 (infinitely dense heavy fluid). Short wavelengths (large k) grow faster in the linear regime, but viscosity and surface tension suppress them, selecting a dominant wavelength. With no viscosity or surface tension in the simulation, all modes grow, but longer wavelengths eventually dominate nonlinearly.

---

## The One Concept

**Rayleigh-Taylor Instability** is what happens when a denser fluid sits above a less dense fluid in a gravitational field. Lord Rayleigh analyzed it in 1883 for an ideal fluid; G.I. Taylor extended it to accelerating reference frames in 1950. The core idea is elegantly simple: gravity is pointing the wrong way relative to the density gradient.

To see why it's unstable, imagine the flat interface perturbed by a small sinusoidal ripple — the heavy fluid dips down in a tongue and the light fluid bubbles up between tongues. Consider the pressure at the base of a downward tongue: the heavy fluid column above it is taller than in the un-perturbed state, so pressure at the tip is higher. This excess pressure pushes the tongue further down. Meanwhile the light fluid between tongues experiences reduced pressure from the shorter heavy column above, so it rises. The perturbation amplifies itself — that is the instability.

The growth rate σ = √(A·g·k) tells you several important things. First, it grows as √k: shorter wavelengths (higher k) grow faster in the linear regime. In a simulation with no physical viscosity or surface tension, this means the smallest resolved scale (one grid cell) would grow fastest — you'd get a numerical catastrophe of single-pixel fingers. In real fluids, viscosity provides a cutoff wavenumber k_max = (g·A·ρ²/μ²)^(1/3) beyond which viscous damping overwhelms growth. Second, growth rate scales as √g: stronger gravity, faster fingers. This is why this instability matters in supernova explosions, where effective accelerations are millions of g.

The nonlinear evolution has three stages. **Linear:** small-amplitude sinusoidal perturbations grow exponentially at rate σ. **Nonlinear spike-and-bubble:** downward spikes of heavy fluid and upward bubbles of light fluid become asymmetric — spikes narrow and accelerate, bubbles flatten and rise at a constant terminal velocity. **Turbulent mixing:** spikes develop Kelvin-Helmholtz rollups at their sides (because the fluid flowing past the spike creates a shear layer), creating the iconic mushroom cap. The caps detach, form vortex rings, and the interface becomes a fractal mixing layer.

Real-world examples: nuclear weapons implosion (dense shell compressing lighter gas — RT instability destroys symmetry and limits yield), inertial confinement fusion (same problem, active research area), atmospheric instability (when warm humid air is capped by cold dry air), supernova remnants (the Crab Nebula's filamentary structure is frozen RT instability), and oceanic overturning (dense brine sinking in the Mediterranean). The Atwood number spans the full range across these applications: A ≈ 0.001 for atmospheric, A ≈ 0.99 for supernova.

---

## The Fix

Two changes fix everything: a pressure projection step and an interface perturbation seed.

```javascript
// --- INITIALIZATION: perturb interface with random sinusoidal seed ---
const modes = 8; // number of sinusoidal modes to superimpose
for (let i = 0; i < N; i++) {
  let perturbation = 0;
  for (let m = 1; m <= modes; m++) {
    perturbation += 0.02 * Math.sin(2 * Math.PI * m * i / N + Math.random() * 2 * Math.PI);
  }
  const interfaceJ = Math.floor(N / 2 + perturbation * N * 0.05);
  for (let j = 0; j < N; j++) {
    density[i + j * N] = (j < interfaceJ) ? 2.0 : 1.0;
  }
}

// --- STEP FUNCTION with pressure projection ---
function pressureProject() {
  // Build divergence of velocity field (right-hand side of Poisson equation)
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const idx = i + j * N;
      div[idx] = -0.5 * dx * (
        vx[(i + 1) + j * N] - vx[(i - 1) + j * N] +
        vy[i + (j + 1) * N] - vy[i + (j - 1) * N]
      );
      p[idx] = 0; // initial guess
    }
  }
  // Gauss-Seidel iteration to solve ∇²p = div
  for (let iter = 0; iter < 40; iter++) {
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        const idx = i + j * N;
        p[idx] = (div[idx]
          + p[(i - 1) + j * N] + p[(i + 1) + j * N]
          + p[i + (j - 1) * N] + p[i + (j + 1) * N]) / 4;
      }
    }
  }
  // Subtract pressure gradient from velocity
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const idx = i + j * N;
      vx[idx] -= 0.5 * (p[(i + 1) + j * N] - p[(i - 1) + j * N]) / dx;
      vy[idx] -= 0.5 * (p[i + (j + 1) * N] - p[i + (j - 1) * N]) / dx;
    }
  }
}

function step() {
  applyGravityByDensity();  // heavier cells get more downward force
  pressureProject();         // enforce incompressibility
  advectDensity();           // move density along divergence-free velocity
  advectVelocity();          // self-advect velocity (semi-Lagrangian)
}
```

The pressure projection enforces ∇·u = 0 after every gravity application. Now when the heavy fluid tries to fall, pressure builds up below it (and drops above), and this differential drives the light fluid up. The perturbation seed breaks the symmetry. Within 2 seconds of simulation time, fingers appear, grow, develop mushroom caps, and begin to roll up — exactly matching the schlieren photographs.

---

## The Wow Moment — Push It

Once the basic simulation works, three extensions turn it into something viewers will screenshot:

**1. Atwood number sweep.** Add a slider for ρ₂/ρ₁. At A = 0.05 (nearly equal densities), fingers grow slowly and symmetrically — up-bubbles and down-spikes are almost identical in speed. At A = 0.9, spikes race downward in narrow jets while bubbles rise slowly and flat. Real-time side-by-side comparison of A = 0.1 vs A = 0.9: the asymmetry is shocking.

**2. Color by vorticity.** Compute ω = ∂vy/∂x - ∂vx/∂y at each cell and color it with a diverging colormap (blue = clockwise, red = counterclockwise). The mushroom caps appear as bright paired vortex blobs — you can see exactly where the Kelvin-Helmholtz rollups are forming along the spike shafts.

**3. Multi-layer stacking.** Instead of two fluids, stack four layers: densities 4, 3, 2, 1 from top to bottom. Every interface is unstable. The resulting cascade of instabilities at different scales creates a spectacular turbulent mixing layer. Colors the four fluids red, orange, cyan, and blue — the final turbulent state is a swirling Jackson Pollock painting.

**4. Rotating frame.** Apply gravity rotating at 1 Hz. The instability fingers continuously track the gravity direction, creating a spinning pinwheel of mushroom clouds.

---

## The Interactive Demo

Controls available in the final web demo embedded in the video description:

- **Atwood number** slider: A = 0.01 to 0.99 (controls ρ₂/ρ₁ ratio, updates live)
- **Grid resolution** selector: 64×64 / 128×128 / 256×256 / 512×512
- **Perturbation amplitude** slider: 0% to 10% of domain height
- **Perturbation modes** slider: 1 to 32 (how many sinusoidal modes seed the interface)
- **Gravity** slider: 1 to 50 m/s² (accelerates or decelerates finger growth)
- **Viscosity** slider: 0 (inviscid) to 0.1 (very viscous — fingers disappear at high values)
- **Color mode** toggle: Density | Vorticity | Speed | Pressure
- **Number of layers** selector: 2 / 3 / 4 / 6 stacked fluids
- **Pause/Resume** and **Reset** buttons
- **Speed multiplier**: 0.25× / 1× / 4× / 16× simulation speed

---

## Production Notes

**Code to show on screen:**
- First: the broken naive code (density array, trivial gravity, upwind advect) — show it running and failing
- Then: reveal the perturbation seed line by line, show the fingers appear
- Then: add the pressure projection, show it improve dramatically
- Close-up on the Gauss-Seidel solver loop — explain it as "asking every cell: given my neighbors' pressures, what does MY pressure need to be?"

**Visual layout:**
- Left panel: simulation canvas (512×512, black background)
- Right panel: live plot of max downward spike velocity vs time (should show exponential growth in linear phase, then plateau)
- Bottom: equation overlay fading in as each concept is introduced (LaTeX-rendered MathJax)

**Key cinematic moments:**
- 00:30 — Real slow-motion honey footage
- 01:45 — Code runs and fails; emphasize the boring grey
- 03:00 — Add perturbation seed — first fingers appear (gasp moment)
- 04:30 — Add pressure projection — mushroom caps appear fully formed
- 06:00 — Vorticity colormap on — mushroom caps light up in vivid paired vortex blobs
- 07:30 — Four-layer cascade — the Jackson Pollock moment
- 08:45 — Atwood slider dragged from 0.01 to 0.99 — asymmetry builds in real time
- 09:30 — Call-to-action: "What happens if you flip gravity every 2 seconds?"

**Rendering tips:** Use `requestAnimationFrame` with a fixed dt. For the pressure solve, 40 Gauss-Seidel iterations is a good tradeoff for a 256×256 grid. For 512×512, switch to a multigrid solver or accept 80 iterations at slower speed. Color density to canvas using `ImageData` and `ctx.putImageData` — fastest path for per-pixel coloring.

---

## Tags
`fluid-simulation` `instability` `rayleigh-taylor` `SPH` `grid-fluid` `gravity` `mushroom-clouds` `density`

---

## Thumbnail

Split frame: LEFT HALF — a photo of a nuclear test fireball mushroom cloud at the moment of formation, orange and white, dramatic. RIGHT HALF — the code simulation showing identical mushroom structure in a vivid blue-red vorticity colormap, same shape mirrored. Bold white text across the split: "SAME PHYSICS" with an equals sign bridging the two halves. Bottom-left corner: the equation σ = √(Agk) in glowing yellow. Channel logo top-right.
