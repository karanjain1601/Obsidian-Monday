---
title: "The Five Points Where Nothing Moves (Lagrange Points)"
id: B080
difficulty: 3/10
prereq: "B018"
concept: "In the restricted three-body problem, five equilibrium points exist where the combined gravity of two massive bodies plus the centrifugal force in the rotating frame cancel exactly; L4/L5 are stable"
tags: [orbital-mechanics, lagrange-points, three-body, equilibrium, centrifugal-force, stability, canvas, beginner]
category: beginner
type: video-idea
---

# The Five Points Where Nothing Moves (Lagrange Points)

**Alt title:** "Five Parking Spots in Space That Gravity Built"
**Difficulty:** 3/10 | **Prereq:** B018

---

## Opening Hook (0:00–1:00)

The video opens on a striking NASA image: the James Webb Space Telescope against a background of distant galaxies. The host says: "The James Webb Space Telescope never fires its thrusters to maintain its position. It sits in a single point in space that is, mechanically speaking, impossible to reach by accident — and yet completely stable once you arrive. It is called the second Lagrange point, and it was predicted 300 years ago using only pencil and calculus." A diagram appears showing the Sun, Earth, and a small dot 1.5 million kilometers behind Earth in the anti-sunward direction. "At this one precise location, the gravitational pulls of the Sun and Earth, combined with the centrifugal effect of orbiting together as a system, cancel perfectly. A telescope placed here orbits the Sun with the same period as Earth — always in Earth's shadow, never in sunlight, always pointing at the cold dark universe." Then a second image: the Trojan asteroids, two dense clusters of rocks sharing Jupiter's orbit — one 60° ahead, one 60° behind. "These rocks have been in those positions for billions of years. They are held there by the same mathematics. Today we code every single one of these five special points from scratch."

## The Naive Attempt

The viewer sets up the Sun-Earth two-body system as a rotating reference frame. They place the Sun at the origin and Earth 1 AU away. They want to find where a small third body can sit stationary in the rotating frame — meaning all net forces on it in the rotating frame sum to zero. The naive first attempt: just check where gravitational forces from the Sun and Earth cancel each other out.

```javascript
function netGravForce(x, y) {
  const r_sun = Math.sqrt(x*x + y*y);
  const r_earth = Math.sqrt((x - earthX)**2 + y*y);
  
  const F_sun = G * M_sun / (r_sun * r_sun);
  const F_earth = G * M_earth / (r_earth * r_earth);
  
  // Force vectors
  const fx_sun = -F_sun * x / r_sun;
  const fy_sun = -F_sun * y / r_sun;
  const fx_earth = -F_earth * (x - earthX) / r_earth;
  const fy_earth = -F_earth * y / r_earth;
  
  return { fx: fx_sun + fx_earth, fy: fy_sun + fy_earth };
}

// Find where net force = 0
```

The viewer computes this across a grid and color-maps the result. They look for where the net force magnitude is zero. They find exactly one point — somewhere between the Sun and Earth on the x-axis. "That found L1 approximately. But where are the other four points? The simulation finds only one. Something is missing."

## The Moment of Failure

The viewer plots the force field across the full Sun-Earth plane. Every single point outside the Sun-Earth line shows a non-zero net gravitational force — the force field visualization shows arrows everywhere, some pointing toward the Sun, some toward Earth, but none clearly canceling. The search finds L1 between Sun and Earth, but misses L2 (behind Earth), L3 (opposite the Sun), and completely fails to find L4 and L5 (the triangular points). The simulation produces a map with one equilibrium instead of five. More importantly, there is no physical reason in this model why L4 and L5 should exist at the triangular positions — the two gravitational forces there clearly don't cancel each other. The failure: the rotating-frame centrifugal force has been omitted entirely.

## Why It Broke — The Physics

In the rotating frame (co-rotating with the Earth-Sun system at angular velocity ω), a particle at rest experiences three effective forces:

1. **Gravitational force from the Sun**: F_sun = GM_sun·m/r_sun²  (toward Sun)
2. **Gravitational force from Earth**: F_earth = GM_earth·m/r_earth²  (toward Earth)
3. **Centrifugal force**: F_centrifugal = mω²·r  (away from rotation axis, i.e., away from the center of mass)

In this rotating frame, there is also the Coriolis force, but that only acts on moving objects — for equilibrium points where velocity in the rotating frame is zero, Coriolis vanishes. The equilibrium condition is that all three remaining forces sum to zero:

**F_gravity_sun + F_gravity_earth + F_centrifugal = 0**

The effective potential in the rotating frame — called the Roche potential or the effective potential Φ_eff — combines gravitational and centrifugal terms:

**Φ_eff(x,y) = −GM_sun/r_sun − GM_earth/r_earth − ½ω²(x² + y²)**

The five Lagrange points are the five critical points (gradient = 0) of this effective potential. L1, L2, L3 lie on the x-axis (the Sun-Earth line) and are saddle points — unstable equilibria. L4 and L5 form equilateral triangles with the Sun and Earth; they are local minima of the effective potential for mass ratios M_Earth/M_Sun < ~0.04 — which the Sun-Earth system satisfies, making L4 and L5 genuinely stable.

## The One Concept

**Lagrange points** (discovered by Joseph-Louis Lagrange in 1772) are the five equilibrium positions in the rotating reference frame of a two-body gravitational system. They are the five positions where a small third body can remain stationary relative to the two large bodies without any additional force applied to it.

Each point has a distinct character:

**L1** sits between the two massive bodies (about 1.5 million km from Earth on the Sun side). Gravity from the Sun pulls the test particle toward the Sun; gravity from Earth pulls it back toward Earth; centrifugal force pushes it away from the center of mass. These three balance exactly. L1 is an unstable saddle point — perturb the particle toward the Sun and it falls in; perturb it toward Earth and it falls toward Earth. Despite this instability, L1 is useful for solar observation satellites (SOHO, ACE) because a spacecraft can orbit L1 in a "halo orbit" with small, periodic station-keeping burns, enjoying a continuous unobstructed view of the Sun. The DSCOVR satellite monitors space weather from L1.

**L2** sits on the opposite side of Earth from the Sun, also about 1.5 million km from Earth. Here, the gravitational pull of both the Sun and Earth both pull the test particle toward the Sun (they are on the same side), but the centrifugal force pushes it outward more strongly at this distance, exactly balancing both. L2 is also an unstable saddle point but is used for deep space telescopes (James Webb Space Telescope, Gaia, Herschel, Planck) because it provides a stable thermal and pointing environment — the telescope always faces away from the Sun, Earth, and Moon, giving a cold, unobstructed field of view.

**L3** sits on the opposite side of the Sun from Earth — the "counter-Earth" point of science fiction. It is also unstable and is effectively hidden behind the Sun, making it nearly impossible to observe or reach efficiently. No missions have been sent there.

**L4 and L5** are the triangular Lagrange points, forming equilateral triangles with the two massive bodies. They are the only genuinely stable Lagrange points for most mass ratios. Objects can orbit around L4 and L5 indefinitely without station-keeping burns. Jupiter's Trojan asteroids (thousands of objects in two distinct clusters) have occupied L4 and L5 for billions of years. Earth's L4 and L5 also have a handful of known Trojan asteroids. Space agency proposals for future space stations and manufacturing facilities have targeted Earth-Moon L4 and L5 as ideal locations. The stability at L4 and L5 comes from the Coriolis force: when a particle drifts away from L4 or L5, the Coriolis force curves its motion into a closed orbit around the Lagrange point rather than pushing it further away — a subtle but powerful stabilizing mechanism.

## The Fix

Add the centrifugal term to the force calculation in the rotating frame:

```javascript
const omega = 2 * Math.PI / (365.25 * 24 * 3600); // Earth's angular velocity, rad/s

function effectiveForce(x, y) {
  // Convert to SI units internally
  const r_sun = Math.sqrt(x*x + y*y);
  const r_earth = Math.sqrt((x - earthX)**2 + y*y);
  
  const fx_sun  = -G * M_sun  * x / Math.pow(r_sun, 3);
  const fy_sun  = -G * M_sun  * y / Math.pow(r_sun, 3);
  const fx_earth = -G * M_earth * (x - earthX) / Math.pow(r_earth, 3);
  const fy_earth = -G * M_earth * y / Math.pow(r_earth, 3);
  
  // Centrifugal force (rotating frame)
  const fx_cf = omega * omega * x;
  const fy_cf = omega * omega * y;
  
  return {
    fx: fx_sun + fx_earth + fx_cf,
    fy: fy_sun + fy_earth + fy_cf
  };
}

// Plot the effective potential and find all 5 zero-force points
```

Now the force field map shows all five equilibrium locations. The effective potential Φ_eff, when plotted as a heat map, shows two deep valleys (at the two massive bodies), three saddle passes (L1, L2, L3 on the x-axis), and two shallow local minima (L4, L5 at the triangular positions).

## The Wow Moment — Push It

The host builds a full interactive effective potential landscape in 3D — a surface plot rendered on the canvas using simple projection. The five Lagrange points appear as distinct topological features: three mountain passes and two gentle bowls. The host places a test particle near each Lagrange point and releases it. Near L1/L2/L3, the particle slowly drifts away — instability confirmed. Near L4/L5, the particle orbits slowly in a kidney-shaped path (tadpole orbit) around the point — stability confirmed, with the Coriolis force visibly curving its motion. Then the host scales the mass ratio: as M_earth/M_sun decreases toward zero, L4 and L5 become more stable; as it increases past ~0.04, the L4/L5 minima disappear and become saddle points. The host finds the exact threshold and marks it on screen.

## The Interactive Demo

- **Mass ratio slider** — M₂/M₁ from 0.001 to 0.1; updates all five Lagrange point positions and stability in real time
- **Show effective potential heat map** — color-codes the full 2D plane by Φ_eff; Lagrange points appear as bright regions of zero gradient
- **Place particle button** — click anywhere on the canvas to place a test particle and watch its trajectory in the rotating frame
- **Label Lagrange points checkbox** — marks L1 through L5 with labels and shows their approximate distances
- **Stability indicator** — next to each labeled point: green (stable) or red (unstable) badge, updating with the mass ratio slider
- **Real mission overlay** — toggle showing JWST at L2, SOHO at L1, and the Trojan asteroid clusters at Jupiter's L4 and L5

## Production Notes

Open with the JWST image — it is visually stunning and immediately motivates the episode. Animate the rotating frame carefully: the Sun-Earth system should visibly rotate together as a unit, with the five points marked as dots that co-rotate with the system. The effective potential heat map is the key visualization — use a perceptually uniform colormap (viridis or similar) with dark = low potential, light = high potential. The five Lagrange points must be visible in the heat map: L1/L2/L3 as saddle passes in the potential landscape, L4/L5 as slight dips. For the particle release stability demo, use slow motion and trace the particle path over 10+ orbital periods so the stable tadpole orbit is visually complete. Narrate the Trojan asteroid connection explicitly with a zoomed view of the Jupiter-Sun system showing the Trojan clusters.

## Tags
`orbital-mechanics` `lagrange-points` `three-body` `equilibrium` `centrifugal-force` `stability` `canvas` `beginner`

## Thumbnail

A top-down view of the Sun-Earth system with five glowing dots marked L1 through L5. L4 and L5 are bright green (stable); L1, L2, L3 are red (unstable). The James Webb Space Telescope icon sits at L2. Bold white text: **"5 POINTS WHERE NOTHING MOVES."** Subtext in yellow: "Webb lives at one of them." The five glowing dots arranged around the Earth-Sun system create a striking geometric visual that is immediately intriguing at thumbnail size.
