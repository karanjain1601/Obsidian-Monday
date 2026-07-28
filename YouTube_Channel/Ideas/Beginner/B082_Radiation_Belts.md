---
title: "Earth's Radiation Belt: Charged Particles Trapped in Space"
id: B082
difficulty: 2.5/10
prereq: "None"
concept: "Charged particles spiral along dipole field lines (Lorentz force qv×B); bounce between mirror points (magnetic mirror); drift around Earth; trapped in two toroidal regions."
tags: [electromagnetism, radiation-belts, lorentz-force, magnetic-mirror, van-allen, particle-physics, canvas, beginner]
category: beginner
type: video-idea
---

# Earth's Radiation Belt: Charged Particles Trapped in Space

**Alt title:** "The Invisible Force Field Around Earth — Built From Charged Particles"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The video opens on a 3D-ish Canvas scene showing Earth as a blue-green disk at the center. Surrounding it in a glowing orange donut shape are thousands of tiny white dots — charged particles trapped in Earth's magnetic field. They spiral, bounce, and drift in hypnotic loops. The host narrates: "Earth has a natural force field. Not a science fiction shield, but two enormous rings of high-energy charged particles floating in space, held there by nothing more than the Lorentz force. They were discovered in 1958 by James Van Allen, and they're so dangerous that every spacecraft going to the Moon had to race through them as fast as possible. Today, we're going to simulate how a single proton gets trapped — and understand why it can never escape."

## The Naive Attempt

The viewer first places a proton (charge q, mass m) in a uniform magnetic field pointing in the z-direction: `B = (0, 0, B₀)`. They integrate the Lorentz force:

```js
// F = q * v × B
let Fx = q * (vy * Bz - vz * By);
let Fy = q * (vz * Bx - vx * Bz);
let Fz = q * (vx * By - vy * Bx);
vx += Fx/m * dt; vy += Fy/m * dt; vz += Fz/m * dt;
x += vx*dt; y += vy*dt; z += vz*dt;
```

They give the proton an initial velocity with components both perpendicular and parallel to B. The viewer watches it spiral: a helix around the field line. This part is correct and beautiful — the circular gyration in the perpendicular plane, the steady drift along the field line.

## The Moment of Failure

When the viewer tries to trap the particle by replacing the uniform field with Earth's dipole field, the particle immediately escapes off the edge of the canvas or the helix unwinds into nothing. The problem: the dipole field converges near the poles (field lines get closer together), but with a uniform-field integrator the particle just flies off as if no convergence is happening. The viewer also notices that the particle drifts straight through the magnetic poles and out the other side — there's no bounce, no mirror effect. The simulation is missing the key physical mechanism that creates the Van Allen belts.

## Why It Broke — The Physics

In a non-uniform magnetic field — specifically one where the field strength increases along the direction of travel — a charged particle experiences an effective repulsive force called the **magnetic mirror force**:

**F_mirror = −μ · ∇B**

where `μ = mv⊥²/(2B)` is the magnetic moment of the gyrating particle (an adiabatic invariant). As the particle spirals toward a stronger field region near the poles, B increases, μ is conserved, so v⊥ must increase. Since total kinetic energy is conserved (magnetic force does no work), v‖ must decrease. Eventually v‖ → 0 and the particle bounces back. This is the magnetic mirror. The ratio `B_mirror / B_equator = 1/sin²(α₀)` determines the mirror point, where α₀ is the pitch angle at the equator.

## The One Concept

The **Van Allen radiation belts** are two concentric toroidal shells of energetic particles — primarily electrons and protons — trapped by Earth's magnetic field. Their existence relies on three simultaneous motions of each trapped particle. First, **gyration**: the particle spirals around a field line with gyroradius `r = mv⊥/(qB)` — for a proton in Earth's field at the equator this is roughly 100–1000 km. Second, **bounce**: the magnetic mirror at each pole reflects the particle back toward the equator, so it bounces north-to-south along the field line with a period of seconds to minutes. Third, **drift**: electrons drift eastward and protons drift westward around Earth due to gradient and curvature drifts, completing a drift orbit in minutes to hours. Together, these three periodic motions keep particles trapped for years. The **inner belt** (1.2–3 Earth radii) contains mainly high-energy protons from cosmic ray albedo neutron decay; the **outer belt** (3–9 Earth radii) contains mainly electrons from the solar wind. Between them lies the **slot region** where wave-particle interactions deplete particles. The loss cone at each end of the trap — the range of pitch angles so shallow that the mirror point descends into the dense atmosphere — is the only escape route. A particle in the loss cone hits the atmosphere and produces an aurora.

## The Fix

Replace the uniform field with a dipole field computed at each particle position:

```js
function dipoleField(x, y, z) {
  let r = Math.sqrt(x*x + y*y + z*z);
  let r5 = Math.pow(r, 5);
  let dot = mz * z; // magnetic moment along z-axis
  let Bx = 3 * x * dot / r5;
  let By = 3 * y * dot / r5;
  let Bz = (3 * z * dot - mz * r*r) / r5;
  return { Bx, By, Bz };
}
```

With this field, spiral the particle from the equator toward the poles. The gyroradius visibly shrinks as B increases. The particle bounces. Add multiple particles with different initial pitch angles and watch those with shallow angles escape into the atmosphere (loss cone) while the rest bounce indefinitely. Color the particles by pitch angle — loss-cone particles in red, trapped particles in white.

## The Wow Moment — Push It

Release 500 protons with random pitch angles from the equatorial plane and let them all evolve simultaneously. The trapped ones fill the inner torus shape — the Van Allen belt renders itself. Add a slow drift animation so particles visibly circulate around Earth in opposing directions (electrons eastward, protons westward), creating a net ring current. Show how a simulated solar storm (sudden increase in B at the outer boundary) can inject new particles deep into the belts or accelerate existing ones.

## The Interactive Demo

- **Initial pitch angle α₀** — slider from 0° (field-aligned, lost immediately) to 90° (equatorial, deepest trap)
- **Particle energy** — slider from 1 keV to 10 MeV, changes gyroradius visually
- **Number of particles** — slider 1 to 500
- **Dipole tilt** — slider 0° to 23°, tilts the dipole relative to Earth's spin axis
- **Solar storm burst** — button that injects a burst of high-energy electrons from outside
- **Show loss cone** — toggle that highlights particles destined to hit the atmosphere

## Production Notes

Render Earth as a filled blue circle with a thin white outline. Draw magnetic field lines as smooth curves from pole to pole computed analytically for a dipole. Particles are small colored dots trailing faint motion-blur lines showing their helical path. Use a color map from blue (low energy) to red (high energy). Show a live readout of pitch angle and current field strength B at the particle's position. A small inset in the corner shows the bounce bounce timeline — a simple sine wave of the north-south position vs. time, which flips at each mirror point. Zoom in to show one particle's gyration circle during the explanation of gyroradius.

## Tags
`electromagnetism` `radiation-belts` `lorentz-force` `magnetic-mirror` `van-allen` `particle-physics` `canvas` `beginner`

## Thumbnail

Side-on view of Earth with two glowing orange-red torus rings surrounding it against a black starfield. A single bright white particle trail spirals inside the inner ring. Text overlay: "Earth's Hidden Force Field" in white with a subtle glow. The concentric ring structure is visually distinct and alien-looking — enough to make a viewer pause mid-scroll and wonder what they're seeing.
