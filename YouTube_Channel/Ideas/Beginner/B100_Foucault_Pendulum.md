---
title: "Making Earth's Rotation Visible With a Pendulum (Foucault's Pendulum)"
id: B100
difficulty: 3/10
prereq: "B021"
concept: "Coriolis force deflects the pendulum in Earth's rotating frame; precession period T = 24h/|sin(latitude)|; poles: 24h cycle; equator: no precession"
tags: [mechanics, foucault-pendulum, coriolis-force, earth-rotation, rotating-frame, precession, canvas, beginner]
category: beginner
type: video-idea
---

# Making Earth's Rotation Visible With a Pendulum (Foucault's Pendulum)

**Alt title:** "Proof That the Earth Rotates — With a Pendulum and 200 Lines of Code"
**Difficulty:** 3/10 | **Prereq:** B021

---

## Opening Hook (0:00–1:00)

The screen shows a top-down view of a circular arena — the floor of a grand building — with a pendulum's bob trace drawn as a white line on the dark floor. The trace is a star: dozens of thin ellipses radiating from the center, each slightly rotated from the last, building a perfect rosette pattern. A clock in the corner advances rapidly (time-lapse). As the clock passes 12 hours, the pattern has completed half a turn. At 24 hours, a full star of traces covers the entire floor in a beautiful, symmetric flower. "In 1851," the host narrates, "Léon Foucault hung an iron ball on a 67-meter wire from the dome of the Panthéon in Paris. He did not program any rotation into the pendulum. He did not use magnets or motors. Yet within hours, the crowd watching could see the pendulum's swing slowly rotating relative to the building. Not because the pendulum was doing something — but because the building itself, and the Earth it sat on, was rotating beneath it. Today you will simulate the exact same experiment from your laptop, in any city on Earth."

## The Naive Attempt

The viewer creates a 2D canvas with a simple pendulum simulation. Step one: model the pendulum bob as a point mass with position (x, y) relative to the pivot, subject to the restoring gravity force: `ax = -(g/L) * x`, `ay = -(g/L) * y` (small angle approximation). Step two: apply Euler integration each frame, updating velocity and position. Step three: draw the bob's position trace as a persistent white dot on the canvas. The pendulum swings back and forth in a straight line, tracing a single fixed line through the origin — as expected for a simple pendulum. Step four: the host asks the viewer to set the initial conditions to a slight offset perpendicular to the swing direction, hoping to produce an ellipse. The pendulum traces a perfect stationary ellipse. "Beautiful," the host says, "but something is missing. This pendulum is in an inertial frame. Real Earth is not an inertial frame. The Earth rotates — and the pendulum, which has no rotational bias of its own, will appear to precess when watched from a rotating standpoint."

## The Moment of Failure

The pendulum swings for a simulated 24 hours of accelerated time. The trace at the end is a single ellipse, unchanged. The host draws a 24-hour time-lapse of the canvas: a single unmoving ellipse. "In Paris at latitude 48.87°, the pendulum should have rotated about 310 degrees by now — almost a full revolution. In our simulation it rotated exactly zero degrees. The Foucault effect is completely absent. The simulation is correct for a non-rotating Earth — which is a different planet from the one we live on." The missing element is the Coriolis acceleration, which arises entirely from the rotating reference frame of the Earth. Without it, the pendulum swings are eternally parallel, and the Earth's rotation is invisible.

## Why It Broke — The Physics

In Earth's rotating reference frame, every moving object experiences fictitious forces. For a pendulum swinging in the horizontal plane, the relevant force is the Coriolis force:

**F_Coriolis = −2m(Ω × v)**

where Ω is Earth's angular velocity vector (magnitude Ω_E = 7.27 × 10⁻⁵ rad/s, directed along Earth's rotation axis), v is the bob's velocity, and m is the bob's mass. At latitude φ, the vertical component of Earth's rotation is Ω_z = Ω_E · sin(φ). For a pendulum bob moving horizontally, the Coriolis force acts horizontally, perpendicular to the velocity, with magnitude 2mΩ_z · v. This force continuously deflects the pendulum's swing to the right (in the Northern Hemisphere), causing the plane of oscillation to precess clockwise when viewed from above. The precession rate is:

**ψ̇ = −Ω_E · sin(φ)**

The full precession period (for one complete rotation of the swing plane) is therefore:

**T_prec = 2π / |Ω_E · sin(φ)| = 24h / |sin(φ)|**

At the North Pole (φ=90°): T = 24 hours. At Paris (φ=48.87°): T = 24/sin(48.87°) ≈ 31.9 hours. At 30° latitude: T = 48 hours. At the equator (φ=0°): sin(0°)=0, T = ∞ — no precession at all. The pendulum at the equator swings in the same fixed plane forever.

## The One Concept

The Foucault pendulum makes Earth's rotation directly and viscerally visible, requiring no instruments beyond careful observation over several hours. The Coriolis force is a fictitious force — it does not exist in an inertial frame — but in the rotating frame of Earth, it is perfectly real in the sense that it correctly predicts the motion of all objects moving across the Earth's surface. The Coriolis force acts perpendicular to velocity, so it does no work (it does not change the speed of the pendulum, only its direction). This is why the precession is so clean: the pendulum's amplitude barely changes; only its orientation rotates. The force is also responsible for the rotation of hurricanes (counterclockwise in the Northern Hemisphere, clockwise in the Southern) and ocean gyres, the deflection of artillery shells over long ranges (Coriolis was included in ballistic tables before GPS existed), and the direction that bathwater drains — though the last claim is largely a myth at household scale, as random initial conditions dominate at small scales. The historical significance of the Foucault pendulum (1851) cannot be overstated: it was the first direct, purely mechanical proof of Earth's rotation visible to human senses without astronomical observation. When Foucault unveiled it at the Panthéon, the crowd fell silent watching the pendulum's swing slowly, undeniably rotate, independent of any human action — proof that the building, the city, and the entire Earth were turning beneath the unmoving pendulum.

## The Fix

Add the Coriolis acceleration to the equations of motion, using the vertical component of Earth's rotation at the specified latitude.

```javascript
const omega_E = 7.27e-5;  // rad/s, Earth's rotation rate
const phi = latitude * Math.PI / 180; // latitude in radians
const Omega_z = omega_E * Math.sin(phi); // vertical component (local)

function update(dt) {
  // Gravity restoring force (pendulum)
  ax = -(g / L) * x;
  ay = -(g / L) * y;

  // Coriolis acceleration: -2 * (Omega_z × v)
  // In 2D horizontal plane: a_coriolis = 2*Omega_z * (vy, -vx)
  // Northern hemisphere: deflection to the right (clockwise precession)
  ax += 2 * Omega_z * vy;
  ay -= 2 * Omega_z * vx;

  vx += ax * dt;
  vy += ay * dt;
  x  += vx * dt;
  y  += vy * dt;

  drawTrace(x, y); // persistent dot
}
```

After this fix, the trace visibly rotates. At time-lapse speed (each real second = 1 minute of simulation), the viewer watches the swing plane precess over a simulated 24 hours, building the classic rosette star pattern.

## The Wow Moment — Push It

The host deploys the simulation at five latitudes simultaneously — 90° (North Pole), 60° (Helsinki), 45° (New York), 30° (Cairo), and 10° (Nairobi) — showing five pendulums swinging side by side. After 12 simulated hours, the polar pendulum has nearly completed its rotation, the Helsinki pendulum is 2/3 done, the New York pendulum is at 180°, the Cairo pendulum is at 90°, and the Nairobi pendulum has barely moved. The visual comparison is stunning — five different rates of precession from the same initial conditions, all caused purely by latitude. The host then switches the simulation to Southern Hemisphere latitudes and demonstrates the clockwise precession reversing to counterclockwise, confirming the sin(φ) sign dependence.

## The Interactive Demo

- **Latitude slider** (−90° to +90°): the central control; changes precession period continuously; at ±90° the trace quickly builds a star; near 0° the swing barely deviates from a line over many hours
- **Simulation speed multiplier** (1× to 1000×): compresses the 24-hour experiment into seconds; the rosette builds before the viewer's eyes
- **Pendulum length slider** (5 m to 100 m): changes oscillation period T = 2π√(L/g); does not change precession rate but changes the visual density of the rosette
- **Hemisphere toggle**: flips the sign of Ω_z, showing clockwise vs counterclockwise precession
- **Trace opacity slider**: controls how long the trace persists — low opacity shows only recent path; high opacity builds the complete rosette

## Production Notes

The top-down canvas view should show a circular boundary (representing the arena floor) with degree markings around the edge like a compass rose. The bob trace should fade over time (alpha decay) so old paths become transparent, showing only the last few oscillations clearly while the overall rosette builds up. A thin radial indicator should rotate in real time showing the current azimuth of the swing plane, making the precession rate directly readable. Display the current precession period numerically: "T = 31.9 hours at lat 48.87°N." Use time-lapse speed by default — normal speed would require the viewer to wait hours for any visible effect.

## Tags

`mechanics` `foucault-pendulum` `coriolis-force` `earth-rotation` `rotating-frame` `precession` `canvas` `beginner`

## Thumbnail

Top-down view of a dark circular floor with a beautiful white rosette trace pattern — 12 or more swing ellipses radiating from the center like flower petals. In the center, a glowing white bob hangs at the apex of the pattern. Text overlay at the top: "PROOF THE EARTH SPINS — A PENDULUM AND 200 LINES OF CODE." The rosette pattern is the entire visual hook: it is geometrically beautiful, clearly non-trivial, and immediately raises the question of how a pendulum produces a flower-shaped trace. The thumbnail rewards curiosity.
