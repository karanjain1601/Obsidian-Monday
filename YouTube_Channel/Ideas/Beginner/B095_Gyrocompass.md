---
title: "Why a Spinning Gyroscope Always Points North (Gyrocompass)"
id: B095
difficulty: 3/10
prereq: "None"
concept: "A gyroscope tilted from the meridian experiences gravity torque → precesses into the meridian plane and stays there; unlike magnetic compass, unaffected by metal or magnetic anomalies"
tags: [mechanics, gyroscope, precession, gyrocompass, navigation, angular-momentum, canvas, beginner]
category: beginner
type: video-idea
---

# Why a Spinning Gyroscope Always Points North (Gyrocompass)

**Alt title:** "The Compass That Uses the Earth Itself to Find North"
**Difficulty:** 3/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The screen shows a glowing spinning top — a gyroscope — mounted inside a gimbal frame floating in the center of a schematic Earth. The Earth slowly rotates beneath it, continents drifting left across the background. The gyroscope's spin axis is tilted slightly to the east. For a few seconds, nothing seems to happen. Then, slowly, inexorably, the spin axis begins to precess — rotating in a lazy circle, but simultaneously sinking, converging. A time-lapse view condenses five minutes of physics into ten seconds: the axis traces a decaying spiral and settles into perfect alignment with the Earth's north-south meridian plane, pointing toward the north celestial pole. It stays there, locked, as the Earth continues to rotate beneath it. "No magnets. No GPS. No electronics. Just a spinning wheel and the geometry of Earth's rotation — and this gyroscope knows exactly where north is. This is the gyrocompass, patented by Hermann Anschütz-Kämpfe in 1908, and it still guides aircraft carriers and submarines today because no magnet works reliably inside a steel hull."

## The Naive Attempt

The viewer builds a 2D canvas showing a gyroscope spin-axis vector as an arrow in the horizontal plane, with north marked at the top of the canvas and a rotating Earth schematic behind it. Step one: represent the gyroscope's angular momentum vector as a 2D arrow initialized pointing slightly east of north. Step two: every frame, add a small rotation to the arrow — a constant precession rate — so that the tip circles around the north pole direction. This "precession in a cone" looks like the gyroscope is wobbling in circles around north but never settling. Step three: the host notes that this circular precession exists but that a real gyrocompass must also damp — it must actually converge to north rather than circle forever. The naive model precesses forever in a fixed cone, never settling. Step four: the host asks: "Where does the settling torque come from? The Earth is not actively pushing on this thing — so what breaks the symmetry?"

## The Moment of Failure

The simulation runs beautifully. The arrow tip traces a perfect circle around the north direction. After a simulated hour, the arrow is right back where it started. Absolutely no convergence. The host highlights the issue: "We coded a gyroscope as if it were floating in free space with no gravity — just pure precession. But a gyrocompass is not mounted in free space. It is mounted on a spinning Earth. The Earth's rotation itself provides an effective torque through the interaction of the gyroscope's angular momentum with the Earth's angular velocity vector. And on top of that, a real gyrocompass has a pendulous bob or pendulous vane that provides a gravity torque that breaks the left-right symmetry and causes the precession itself to process — gradually walking the axis toward the meridian." The failure is not just a bug; it is a missing physical element that the naive model entirely omits.

## Why It Broke — The Physics

A gyroscope on the rotating Earth is subject to two coupled effects. First, Earth itself rotates at Ω_E = 7.27 × 10⁻⁵ rad/s. At latitude φ, the effective vertical component of Earth's rotation is Ω_E · sin(φ), and the horizontal north-south component is Ω_E · cos(φ). Second, if the gyroscope spin axis is tilted away from horizontal, a gravity restoring torque acts on the pendulous element: **τ = m · g · L · sin(α)**, where α is the tilt angle and L is the pendulum arm. The interplay between these effects causes the spin axis to trace a damped spiral. The settling direction is the one where these two torques exactly cancel in the rotating frame: the meridian plane, pointing north. The key equation for the gyrocompass precession rate in azimuth is:

**ψ̇ = (τ_gravity) / L_spin = (m g L sin α) / (I_spin · ω_spin)**

When ψ̇ matches the component of Earth's rotation, the system locks. Without the pendulous element (or some equivalent gravity sensing), precession is undamped and the axis circles north forever without converging.

## The One Concept

A gyrocompass finds north using the coupling between a gyroscope's angular momentum and Earth's rotation — not magnetism. The operating principle has three parts. First, a gyroscope resists changes to its spin axis (gyroscopic rigidity); angular momentum L = Iω is large and conserved. Second, Earth's rotation provides a constant "twist" to the local reference frame. If the spin axis is not aligned north-south, the local horizontal plane (defined by gravity) rotates beneath the spin axis as the Earth turns, creating a relative tilt. Third, a pendulous element senses this tilt and applies a gravity torque that drives precession. The interaction is a feedback loop: misalignment from north → Earth's rotation creates a tilt → gravity torque creates a precession → precession corrects the misalignment. At the settling point, all torques balance and the axis locks onto the meridian. The settling time for a real gyrocompass is typically 1–4 hours, depending on damping. The advantage over magnetic compasses is enormous in practice: steel ships massively distort magnetic fields, making magnetic compasses unreliable without complex correction. Gyrocompasses are immune to iron, steel, and electrical interference. Elmer Sperry (in the U.S.) and Hermann Anschütz-Kämpfe (in Germany) both commercialized gyrocompasses around 1908, just in time for World War I naval applications. Modern ships carry both gyrocompasses and GPS receivers — the gyrocompass provides heading (which GPS alone does not give from a stationary vessel).

## The Fix

Add a pendulous damping term to the precession model. Model the tilt angle α as a state variable that evolves when the horizontal component of Earth's rotation effectively "tilts" the local vertical reference frame relative to the spin axis.

```javascript
const omega_E = 7.27e-5; // rad/s, Earth's rotation
const phi = latitude * Math.PI / 180; // latitude in radians
const L_spin = I_spin * omega_spin; // angular momentum magnitude

// Effective Earth rotation in local frame
const omega_horiz = omega_E * Math.cos(phi); // north-pointing component

// Gravity torque on pendulous element (per unit tilt angle)
const K_gravity = mass * g * pendulumLength; // N·m/rad

// Damped precession: azimuth error ψ, tilt error α
// coupled first-order ODEs (Euler integration each frame)
const dPsi_dt = (K_gravity * alpha) / L_spin;
const dAlpha_dt = omega_horiz * Math.sin(psi) - damping * alpha;

psi += dPsi_dt * dt;
alpha += dAlpha_dt * dt;
```

Now the axis traces a decaying spiral on the canvas, tightening with each loop until it snaps to north. The convergence is visually satisfying and physically correct.

## The Wow Moment — Push It

The host demonstrates the gyrocompass operating at three different latitudes simultaneously on a globe schematic — equator (φ=0°, slowest convergence because Ω_E·cos(φ) is maximum but the sin(φ) coupling term is zero, which the host discusses), mid-latitude (φ=45°, fastest practical convergence), and near the pole (φ=85°, spin axis oscillates wildly because the north direction becomes ambiguous at high latitudes). The host then shows what happens if the gyrocompass is mounted on a ship that is accelerating — the apparent vertical shifts, and the gyrocompass drifts from true north (a known error called "velocity error" or "speed and course error"), demonstrating why gyrocompasses need correction tables based on ship speed and heading.

## The Interactive Demo

- **Latitude slider** (0° to 85°): changes the Earth rotation components; shows how convergence speed and oscillation period depend on latitude
- **Damping coefficient slider** (0 to 1.0): controls how quickly the spiral converges; at zero damping, the axis oscillates indefinitely around north in a fixed ellipse
- **Spin speed slider** (100 to 10000 RPM): shows how higher angular momentum (larger L_spin) slows down precession and thus slows convergence
- **Initial azimuth error slider** (1° to 180°): sets the starting misalignment; demonstrates that convergence is independent of initial error for small angles
- **Ship velocity input** (knots): introduces velocity error and shows the gyrocompass settling east or west of true north depending on course and speed

## Production Notes

Use a 3D-looking globe as the background that slowly rotates (CSS or canvas transform). Draw the gyroscope spin axis as a thick white arrow on a flat 2D "top-down Earth view" insert that occupies the lower-right quarter of the screen. Trace the tip of the arrow over time as a fading trail, showing the spiral convergence. Explicitly label the Earth's rotation axis in the 3D globe view and draw the connection to the horizontal component at the viewer's latitude. Display real-time values of ψ (azimuth error) and α (tilt) numerically.

## Tags

`mechanics` `gyroscope` `precession` `gyrocompass` `navigation` `angular-momentum` `canvas` `beginner`

## Thumbnail

A silver gyroscope mounted in a golden gimbal ring, floating above a dark blue Earth schematic with visible latitude lines. A bright white arrow from the gyroscope points precisely at a glowing "N" (north). Text overlay at top: "WHY SUBMARINES DON'T USE MAGNETS" in bold white. Subtitle below: "The Gyrocompass Explained." The overall aesthetic is precision and elegance — the kind of thumbnail that signals deep engineering knowledge without being intimidating.
