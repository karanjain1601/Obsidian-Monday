---
title: "A Shaken Fluid Organizes Into Hexagons (Faraday Waves)"
id: M003
difficulty: 5.5/10
prereq: "None"
concept: "Faraday waves: parametrically driven standing waves on a fluid surface; subharmonic response at half the drive frequency; pattern selection (hexagons, stripes, squares) depends on fluid properties and drive amplitude."
tags: [faraday-waves, pattern-formation, parametric-oscillation, standing-waves, hexagons, fluid-surface, cellular-automata, vibration]
category: medium
type: video-idea
---

# A Shaken Fluid Organizes Into Hexagons (Faraday Waves)

**Alt title:** "Shake Any Fluid Hard Enough and It Draws Its Own Geometry"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A shallow tray of corn starch slurry sits on a speaker. The speaker plays a pure 40 Hz sine wave. For the first second: nothing. Then the amplitude crosses a threshold and the surface erupts — not into chaos, but into a perfect hexagonal lattice of peaks and troughs, vibrating in place, synchronized to the sound. Change the frequency to 60 Hz: the lattice dissolves and rebuilds at a finer scale. To 20 Hz: coarser hexagons. For a brief window between two frequencies: square grid. It is impossible to believe this is happening in a pan of cornstarch.

"Michael Faraday first described this in 1831. In 1831 he shook a wine glass and found hexagons. Today we're going to reproduce this phenomenon in a web browser — and our first attempt is going to produce a perfectly flat surface that does absolutely nothing."

---

## The Naive Attempt

The surface wave equation without forcing is the linear wave equation: ∂²h/∂t² = c² ∇²h, where h is surface height and c = √(g/k + γk/ρ) for surface gravity-capillary waves. Discretize this on a 2D grid and add a forcing term A·cos(ωt) uniformly to all cells — the obvious way to represent "shaking the tray."

```javascript
const N = 256;
const c = 1.0;      // wave speed
const A = 0.1;      // drive amplitude
const omega = 2.0;  // drive frequency (rad/s)
let t = 0;

// Initialize height and velocity to rest
const h = new Float32Array(N * N).fill(0);
const dh = new Float32Array(N * N).fill(0); // dh/dt

// Add tiny random perturbation
for (let idx = 0; idx < N * N; idx++) {
  h[idx] = (Math.random() - 0.5) * 0.001;
}

function step(dt) {
  t += dt;
  const forcing = A * Math.cos(omega * t);

  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      const idx = i + j * N;
      // Laplacian of h
      const lap = (h[(i+1)+j*N] + h[(i-1)+j*N] +
                   h[i+(j+1)*N] + h[i+(j-1)*N] - 4*h[idx]) / (dx*dx);
      // Naive: add forcing uniformly — this just raises all cells together
      const d2h = c * c * lap + forcing;
      dh[idx] += d2h * dt;
    }
  }
  for (let idx = 0; idx < N*N; idx++) {
    h[idx] += dh[idx] * dt;
  }
}
```

Result: the entire surface oscillates up and down uniformly, like a piston. No spatial pattern. No hexagons. No interesting structure at all — the surface just sloshes as a flat sheet.

---

## The Moment of Failure

On screen: the height field rendered as a grayscale texture. Every pixel oscillates between black and white synchronously — no spatial variation. If you plot h(x,0,t) (a horizontal cross-section), it's a flat horizontal line that moves up and down uniformly.

The failure is philosophically revealing: adding a spatially uniform forcing term to a spatially uniform wave equation can only produce a spatially uniform response. There is no mechanism to break translation symmetry. The simulation has no concept of "mode coupling" — the forcing energy has nowhere to go except into the uniform (k=0) mode.

Additionally, the naive forcing A·cos(ωt) is additive, not parametric. Real Faraday waves arise from **parametric forcing** — the forcing modulates a parameter (effective gravity) rather than adding a direct displacement. This is the crucial difference that makes the physics work: parametric resonance excites subharmonic modes at ω/2.

---

## Why It Broke — The Physics

**Parametric vs additive forcing.** In a shaken tray, the frame accelerates: the effective gravity in the tray's reference frame is g_eff(t) = g + A·ω²·cos(ωt) (the tray's acceleration). This modifies the wave dispersion relation — every spatial mode sees a time-varying restoring force. This is parametric forcing, and it excites modes through a completely different mechanism than additive forcing.

The equation for a single Fourier mode h_k with wavenumber k in a parametrically driven system is the **Mathieu equation**:

$$\ddot{h}_k + \left[\omega_k^2 + A\omega^2 \cos(\omega t)\right] h_k = 0$$

where ω_k² = gk + γk³/ρ is the natural frequency of mode k. The Mathieu equation has a family of instability tongues in (A, ω/ω_k) parameter space. The primary instability (first tongue) occurs when ω = 2ω_k — i.e., when the drive frequency is **twice** the natural frequency of the mode. The response is **subharmonic**: the surface wave oscillates at ω/2, half the drive frequency.

Which k gets excited? The k satisfying ω_k = ω/2. For pure gravity waves: ω_k = √(gk), so k = ω²/(4g). The selected wavelength is λ = 2π/k = 8πg/ω². For a 40 Hz drive: λ ≈ 2 cm. That matches cornstarch experiments.

**Pattern selection.** Why hexagons and not stripes? The answer involves nonlinear mode coupling. In 2D, modes with the same |k| but different directions all become unstable simultaneously. Stripe patterns (one direction) are solutions, but hexagonal patterns (three directions at 60°) are more energetically favorable for many fluid parameters because the three-wave resonance condition k₁ + k₂ + k₃ = 0 is satisfied. For different Prandtl numbers and fluid depths, squares, hexagons, and quasicrystalline patterns have all been observed.

---

## The One Concept

**Faraday waves** are parametrically excited standing waves on a fluid surface. Michael Faraday discovered them in 1831 while studying Chladni patterns in vibrating plates — he noticed that fluids in vibrating containers exhibited analogous spatial patterns. The key insight, developed mathematically much later, is that **parametric resonance** at subharmonic frequencies is the mechanism.

Parametric resonance is distinct from ordinary resonance. In ordinary resonance, you drive a system at its natural frequency and the amplitude grows. In parametric resonance, you modulate a parameter (here, effective gravity) at twice the natural frequency, and the system's own response feeds back to extract energy from the driving. The key signature: the Faraday wave pattern oscillates at ω/2 even though the tray is driven at ω. If you film the tray at 40 fps and the drive frequency is 40 Hz, the pattern doesn't move — it oscillates at 20 Hz, so each frame captures the same phase. If you film at 39 fps, you see a slow 1 Hz oscillation. This subharmonic response is the unmistakable fingerprint of parametric resonance.

The pattern selection problem — why do we see hexagons, squares, or stripes? — is solved by coupled amplitude equations. Near onset, the surface height is written as a superposition of critical modes: h(x,t) = Σ A_n(t) e^{ik_n·x} cos(ωt/2) + c.c. The amplitude equations ∂A_n/∂t = (μ - α|A_n|²)A_n - β Σ_{m≠n} |A_m|²A_n govern how each mode's amplitude evolves. The sign of β determines pattern type: β < 0 favors hexagons (amplitudes reinforce), β > 0 favors stripes (modes compete). β is controlled by fluid viscosity, surface tension, and depth.

The phase diagram of Faraday waves is extraordinarily rich. As drive amplitude increases above the onset threshold, the pattern undergoes a sequence of bifurcations: hexagons → defect-riddled hexagons → oscillating hexagons → chaotic patterns → hard turbulence. The transition sequence depends on fluid parameters. Viscous fluids (silicone oil) show cleaner patterns; low-viscosity fluids (water) show rapid turbulent transition.

Real-world Faraday analogs appear in granular materials (sand patterns on shaken plates — Chladni figures), Bose-Einstein condensates under parametric modulation, nonlinear optics (parametric down-conversion in crystals — the optical analog generates photon pairs at half the pump frequency), and ocean waves (wind-driven capillary wave onset on the sea surface has a parametric component from the wind pressure oscillation).

A practical application: **parametric amplifiers**. The mechanical analog of the optical parametric amplifier is a child's swing — pumping the swing by changing effective leg length at twice the natural period is parametric excitation. Early microwave receivers used parametric amplification of signals. The fundamental physics is the same Mathieu equation.

---

## The Fix

The fix requires two changes: (1) implement parametric forcing (modulate effective gravity, not add displacement), and (2) ensure mode coupling through a nonlinear surface tension term that allows subharmonic modes to compete.

```javascript
// Parametric wave equation with surface tension
// h_tt = (g_eff + gamma/rho * laplacian) * laplacian(h) - damping * h_t

const g = 9.8;
const gamma = 0.072; // surface tension water (N/m)
const rho = 1000;    // density (kg/m³)
const damping = 0.1;
const driveAmplitude = 0.5; // fraction of g
const driveOmega = 2 * Math.PI * 40; // 40 Hz

function step(dt) {
  t += dt;
  // Effective gravity: parametric modulation
  const g_eff = g * (1 + driveAmplitude * Math.cos(driveOmega * t));

  for (let j = 2; j < N-2; j++) {
    for (let i = 2; i < N-2; i++) {
      const idx = i + j * N;

      // Standard Laplacian
      const lap_h = (h[(i+1)+j*N] + h[(i-1)+j*N] +
                     h[i+(j+1)*N] + h[i+(j-1)*N] - 4*h[idx]) / (dx*dx);

      // Biharmonic (for surface tension): Δ²h
      const lap2_h = (
        h[(i+2)+j*N] + h[(i-2)+j*N] +
        h[i+(j+2)*N] + h[i+(j-2)*N] +
        2*h[(i+1)+(j+1)*N] + 2*h[(i+1)+(j-1)*N] +
        2*h[(i-1)+(j+1)*N] + 2*h[(i-1)+(j-1)*N] -
        8*h[(i+1)+j*N] - 8*h[(i-1)+j*N] -
        8*h[i+(j+1)*N] - 8*h[i+(j-1)*N] +
        20*h[idx]
      ) / (dx*dx*dx*dx);

      // Parametric wave equation
      const d2h = g_eff * lap_h - (gamma/rho) * lap2_h - damping * dh[idx];

      dhNew[idx] = dh[idx] + d2h * dt;
    }
  }
  [dh, dhNew] = [dhNew, dh];
  for (let idx = 0; idx < N*N; idx++) h[idx] += dh[idx] * dt;
}
```

With this, the surface oscillates chaotically for about 2 seconds, then snaps into a hexagonal lattice. Changing the drive frequency rescales the lattice. Near onset, a Turing-like transient shows disordered domains that anneal into a global pattern — exactly like crystallization.

---

## The Wow Moment — Push It

**Quasicrystalline Faraday patterns:** Drive with two simultaneous frequencies ω₁ and ω₂ in ratio √2:1 (irrational). Modes at k₁ and k₂ are independently excited, and they cannot form a periodic lattice together — the result is a quasicrystalline pattern with 8-fold or 10-fold symmetry. This was experimentally realized in 2001. Show the Fourier transform (FFT) of the pattern: perfect 10 sharp peaks in a ring, proving quasicrystalline order.

**Sand on a speaker plate (Chladni simulation):** Replace the fluid wave equation with a simple elastic plate equation (Kirchhoff-Love plate). Same Mathieu instability mechanism. The result: sand-like particles accumulate on nodal lines (lines of zero amplitude), forming Chladni figures. Overlay real Chladni figure photos.

**Frequency chirp visualization:** Slowly sweep the drive frequency from 10 Hz to 100 Hz while the simulation runs. Watch the hexagonal lattice continuously shrink in wavelength — a hypnotic zoom-like effect as the simulation "zooms in" on smaller and smaller scales.

---

## The Interactive Demo

- **Drive frequency** slider: 5 to 200 Hz (selects wavelength of pattern)
- **Drive amplitude** slider: 0 to 3.0 (fraction of g; pattern appears above threshold ~0.3)
- **Viscosity / damping** slider: 0.01 to 1.0 (low damping → sharper patterns; high → hexagons need more amplitude)
- **Surface tension** slider: 0 (gravity waves) to 10× water value (capillary regime)
- **Fluid depth** slider: very shallow to deep (modifies dispersion, changes onset threshold)
- **Second frequency** toggle + frequency slider: enables two-frequency drive for quasicrystal mode
- **Color mode**: Height | Velocity | Laplacian (curvature) | FFT power spectrum
- **Show FFT** button: opens side panel with real-time 2D FFT of height field (shows rings for modes)
- **Grid resolution**: 128 / 256 / 512
- **Pause/Reset** and speed controls

---

## Production Notes

**Code to show:**
- The Mathieu equation written on a whiteboard/overlay before showing code
- The naive uniform forcing — flat surface boring result
- The parametric forcing modification — the one line that changes everything: `g_eff = g * (1 + A * cos(omega_drive * t))`
- The biharmonic term for surface tension — explain why 4th-order derivatives are needed

**Visual layout:**
- Main canvas: 512×512 height field, rendered with a 3D perspective projection at 30-degree tilt (looks like a real tray of fluid)
- Normal-mapped shading: compute surface normals from gradient of h, apply Blinn-Phong shading with a point light — the hexagonal lattice looks photorealistic
- Overlay frequency spectrum (1D cross-section FFT) in a small panel at the bottom

**Key cinematic moments:**
- 00:30 — Cornstarch hexagons real footage
- 02:00 — Naive attempt — flat piston-like oscillation — explain why parametric ≠ additive
- 03:45 — Add parametric forcing — chaotic transient, then SNAP to hexagons (this moment needs a sound effect: a crystalline "ching")
- 05:00 — Drag frequency slider: hexagons continuously rescale — show real cornstarch comparison
- 06:15 — Enable second frequency: squares appear, then quasicrystal 10-fold pattern
- 07:30 — Show FFT panel: the 10 sharp peaks of quasicrystalline order
- 08:30 — 3D perspective rendering of the pattern — it looks like a real fluid

**Shader note:** For the normal-mapped 3D view, use WebGL with a simple fragment shader that computes the normal vector from the gradient of the height field texture and applies a specular highlight. Cost: ~2ms per frame for 512×512.

---

## Tags
`faraday-waves` `pattern-formation` `parametric-oscillation` `standing-waves` `hexagons` `fluid-surface` `cellular-automata` `vibration`

---

## Thumbnail

A top-down view of a shallow tray with a perfect hexagonal lattice pattern, half real photograph (left: golden-colored fluid with real light reflections from a lab experiment), half simulation (right: blue-white normal-mapped rendering). The two halves match so well the boundary is hard to find. Red arrow pointing to both sides with text: "SAME HEXAGONS". Bold white text at top: "SHAKING MAKES ORDER". Bottom strip: the Mathieu equation ḧ + [ω²₀ + A cos(ωt)]h = 0 in yellow.
