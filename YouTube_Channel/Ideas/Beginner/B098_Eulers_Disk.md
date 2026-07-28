---
title: "The Coin That Wobbles Faster and Faster Until Silence (Euler's Disk)"
id: B098
difficulty: 3/10
prereq: "B004"
concept: "Euler's disk: wobble rate Ω ∝ θ^(−1/2) as tilt θ → 0; finite-time termination despite Ω → ∞; exact mechanism (air viscosity + rolling friction) remains debated"
tags: [mechanics, eulers-disk, precession, rolling, dissipation, finite-time, canvas, beginner]
category: beginner
type: video-idea
---

# The Coin That Wobbles Faster and Faster Until Silence (Euler's Disk)

**Alt title:** "The Physics Puzzle That Ends in Infinite Speed — Then Stops"
**Difficulty:** 3/10 | **Prereq:** B004

---

## Opening Hook (0:00–1:00)

The screen shows a coin — rendered as a shiny silver disk — spinning on a flat black surface. At first it spins proudly upright, a lazy wobble every second or so. Slowly, it leans. The wobble rate picks up. A counter in the corner tracks precession rate in Hz: 1… 2… 4… 8…. The coin leans further. The wobble sound — simulated as a rising pitch — climbs into a buzz. 16 Hz… 32 Hz…. The disk is nearly flat now, the buzzing almost a whine. Then, in a fraction of a second, it stops completely. Silence. The coin lies flat and still. The counter reads 0. "What you just saw," the host begins, "is one of the most debated problems in classical mechanics. The precession rate theoretically goes to infinity in finite time. But it stops. It always stops. And exactly why it stops — not just that it stops, but the precise mechanism — was an open question in physics journals as recently as 2000. Today you are going to simulate it, and you will discover the same paradox Euler first grappled with in the eighteenth century."

## The Naive Attempt

The viewer creates a 2D canvas showing the coin in side-view as an ellipse whose aspect ratio represents the tilt angle θ (a flat ellipse = nearly horizontal disk, a circle = fully upright). Step one: initialize θ = π/2 (upright) and a precession rate Ω starting at 1 rad/s. Step two: apply a constant energy dissipation each frame: `energy -= dissipation_rate * dt`. Step three: link the tilt angle to the remaining energy so the coin "leans" over as energy is lost. Step four: compute Ω from the current tilt angle using the Euler relationship. The host runs the simulation. The coin leans over and the precession counter climbs. But when the energy reaches zero, the simulation does something embarrassing: the angle θ reaches zero, Ω is computed as `1/Math.sqrt(0)` — division by zero — and the simulation crashes or returns `Infinity`. The canvas freezes.

## The Moment of Failure

The precession counter hits `Infinity` at frame 847. The ellipse representing the coin freezes at θ = 0.0001 radians, nearly flat. The JavaScript console shows `NaN` propagating through the position and rotation calculations. The canvas stops updating. The host highlights the issue in red: "We have a mathematical singularity. The equation says Ω approaches infinity as θ approaches zero. But in real life, the disk stops in finite time, not at infinite precession rate. Our simulation produces the right divergence — correctly — but has no mechanism to terminate it. We need to understand what actually kills the motion before we can model the endpoint." The failure is not merely a coding problem; it represents the genuine unresolved physical question at the heart of Euler's disk.

## Why It Broke — The Physics

The governing equation for the precession rate of a disk rolling on a flat surface, derived from Euler's equations for rigid body rotation, is:

**Ω = sqrt(g / (R · sin(θ))) · C**

where R is the disk radius, θ is the tilt angle from horizontal, g is gravitational acceleration, and C is a constant of order 1 that depends on the mass distribution. As θ → 0 (disk nearly flat), Ω → ∞. The total energy of the system is:

**E = ½Iω_spin² + ½MR²Ω² + MgR·sin(θ) ≈ MgR·sin(θ)**

as θ → 0, so the potential energy drives the process. The energy dissipation mechanisms proposed include: rolling friction at the contact point (scales as θ^(5/2)), viscous air friction at the disk edge (scales differently), and acoustic radiation. The 2000 paper by Moffatt (Nature) proposed air viscosity; subsequent experimental work by Easwar et al. showed rolling friction dominates for heavy disks. The termination occurs because, even though Ω → ∞, the energy still drains to zero in finite time — the integral ∫E dt converges even though Ω diverges, analogously to how ∫(1/t^0.5) dt converges near t=0.

## The One Concept

Euler's disk exhibits finite-time singularity — a mathematical phenomenon where a physical quantity diverges (goes to infinity) in a finite amount of time. The precession rate Ω ∝ θ^(−1/2) grows without bound as the disk flattens, but the disk reaches θ=0 in a finite time T_stop because energy dissipation acts faster than the precession can diverge. This is analogous to the finite-time blowup in certain nonlinear differential equations in fluid dynamics. The paradox highlighted by Euler's disk is that classical mechanics allows this singularity — the equations are perfectly valid, and they genuinely predict infinite precession — yet the physical system terminates in finite time at a finite state (the disk lying flat). The resolution lies in the dissipation mechanism: rolling friction is not constant but grows as θ decreases (because the contact patch geometry changes), accelerating the energy drain even as Ω accelerates upward. The two divergences — Ω → ∞ upward and dissipation → ∞ upward — race against each other, and dissipation wins. The result is a finite stopping time despite an unbounded precession rate. This behavior is fascinating to physicists because it represents a transition from the frictionless theoretical world (where the disk would precess forever at infinite Ω) to reality (where it stops). The phenomenon also appears in tops, spinning eggs, the rattleback, and any gyroscopic system with dissipation near a degenerate configuration.

## The Fix

Add a physically-motivated dissipation model that removes energy faster as θ decreases, and add a stopping condition when θ falls below a threshold.

```javascript
const STOP_ANGLE = 0.01; // radians — below this, declare stopped

function updateDisk(dt) {
  const sinTheta = Math.sin(theta);
  if (sinTheta < STOP_ANGLE) {
    // Disk has terminated
    isRunning = false;
    return;
  }

  // Precession rate: Ω ~ sqrt(g / (R * sin(theta)))
  const Omega = Math.sqrt(9.81 / (diskRadius * sinTheta)) * 0.6;

  // Rolling friction dissipation: dE/dt ~ -mu * M*g * R * Omega * theta^(3/2)
  const dE_dt = -frictionCoeff * diskMass * 9.81 * diskRadius * Omega
                * Math.pow(sinTheta, 1.5);

  // Current energy ~ M*g*R*sin(theta)
  const E = diskMass * 9.81 * diskRadius * sinTheta;
  const E_new = E + dE_dt * dt;

  // Update theta from new energy
  theta = Math.asin(Math.max(E_new / (diskMass * 9.81 * diskRadius), 0));
  precessionRate = Omega;
}
```

Now the simulation shows Ω climbing rapidly, θ collapsing, and a clean termination at the stopping threshold. The precession counter peaks at 60+ Hz before the disk stops.

## The Wow Moment — Push It

The host renders a full 3D-perspective simulation of the disk — using a canvas 3D projection of an ellipse with shading — so the viewer sees the disk from slightly above, wobbling in a realistic-looking spiral path. A rising-pitch audio tone (generated via Web Audio API) tracks the precession rate, climbing from a low rumble to a high whir and then cutting to silence at termination. The host then varies the friction coefficient from near-frictionless (the disk takes 30 seconds to stop, precession rate climbs extremely high) to high friction (stops in 2 seconds at a relatively low peak precession). Finally, the host simulates a coin on a tilted surface — showing that the precession axis shifts as the contact point traces an arc rather than a fixed point, breaking the symmetry.

## The Interactive Demo

- **Initial tilt angle slider** (10° to 80°): sets starting conditions; steeper initial tilt means longer termination time
- **Friction coefficient slider** (0.001 to 0.05): controls how quickly energy dissipates; very low friction shows the runaway precession most dramatically
- **Disk radius slider** (2 to 20 cm): changes R and thus the absolute precession rate scale
- **Audio pitch toggle**: enables the Web Audio API tone that tracks Ω in real time — the most viscerally satisfying mode
- **Phase plot view**: shows θ vs. Ω on a separate plot, revealing the characteristic curve that shoots to Ω=∞ on the horizontal axis as θ→0

## Production Notes

Use a 3D isometric rendering of the disk — an ellipse with a metallic gradient fill whose width-to-height ratio tracks cos(θ) and whose position traces a small circle on the surface plane. Add a contact-point highlight (a small white glow) where the disk edge touches the surface. Show a real-time energy bar chart split between rotational kinetic energy and potential energy (MgR·sinθ), watching both drain to zero at termination. Slow-motion replay of the last 500 ms before termination, playing at 1/20 speed, is the most compelling shot in the video.

## Tags

`mechanics` `eulers-disk` `precession` `rolling` `dissipation` `finite-time` `canvas` `beginner`

## Thumbnail

A silver coin rendered from a low angle on a black surface, tilted at about 10° from horizontal, clearly in the last moments of its spin — nearly flat. The precession counter in the top-right reads "47 Hz" in bright green. Below the coin, a glowing spiral trace shows the contact-point path spiraling inward. Bold white text: "IT GOES INFINITELY FAST — THEN STOPS." The low camera angle makes the coin look enormous and dramatic, and the paradox in the text demands an explanation.
