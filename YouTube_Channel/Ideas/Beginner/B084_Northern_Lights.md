---
title: "The Northern Lights: Charged Particles Spiraling to the Poles"
id: B084
difficulty: 2.5/10
prereq: "B082_Radiation_Belts, B083_Earths_Magnetic_Field"
concept: "Charged particles from solar wind enter the loss cone near the poles where field lines converge; they collide with atmospheric atoms at 100-200 km altitude; different atoms emit different colors."
tags: [electromagnetism, aurora, solar-wind, atmospheric-physics, emission-spectra, loss-cone, canvas, beginner]
category: beginner
type: video-idea
---

# The Northern Lights: Charged Particles Spiraling to the Poles

**Alt title:** "Why the Sky Catches Fire Near the Poles (And Why It's Green)"
**Difficulty:** 2.5/10 | **Prereq:** B082_Radiation_Belts, B083_Earths_Magnetic_Field

---

## Opening Hook (0:00–1:00)

The video opens on a real time-lapse of the aurora borealis — curtains of green and violet light rippling across a Norwegian sky in silence. Then the host cuts in: "This is not magic, not mythology, not a glitch in the atmosphere. This is charged particles from the Sun — electrons and protons — crashing into air molecules after traveling 150 million kilometers across the solar system. And the most remarkable part is how precisely they are guided to exactly the right spot. They don't fall randomly out of the sky — they spiral down along magnetic field lines, funneled to the polar regions by the same force that keeps the Van Allen belts full. Today we build the aurora from first principles, particle by particle."

## The Naive Attempt

Building on the B082 dipole simulation, the viewer adds a stream of incoming electrons from the Sun (the solar wind). They try the simplest model: let the electrons enter the simulation from the left and travel in straight lines toward Earth. Some will hit Earth, some will miss. They draw green dots where electrons strike the Earth circle. The result is a ring of dots spread uniformly across the entire hemisphere facing the Sun — not at the poles at all. The viewer tries adding the magnetic field but forgets to compute the correct loss cone condition, so all particles are treated as trapped.

```js
// Naive: straight-line solar wind
for (let e of electrons) {
  e.x += e.vx * dt;
  e.y += e.vy * dt;
  if (hitEarth(e)) drawAurora(e.x, e.y); // wrong: hits everywhere
}
```

## The Moment of Failure

The simulation shows a bright arc around the entire sunward hemisphere of Earth — a complete illuminated ring on the equator and tropics. In reality, auroras appear in two narrow oval rings centered on the magnetic poles, roughly at 65–72° magnetic latitude, and are almost never seen at the equator. The simulation has failed to account for the magnetic field's role in routing particles.

## Why It Broke — The Physics

Most incoming solar wind particles cannot penetrate the magnetosphere at all — they are deflected by the Lorentz force as they encounter Earth's dipole field. However, near the cusps of the magnetosphere (the funnel-shaped regions near the poles where the field lines open toward the solar wind), a subset of particles can enter. Once inside, they undergo the same bounce motion as Van Allen belt particles. But near the poles, the field lines converge and B increases sharply. If a particle's pitch angle is less than the **loss cone angle**:

**sin²(α_LC) = B_equator / B_mirror**

where B_mirror is the field strength at the top of the atmosphere (~100 km altitude), then the particle's mirror point lies inside the atmosphere rather than above it. The particle spirals down to atmospheric altitudes, collides with O, O₂, and N₂ molecules, excites them electronically, and the molecules emit photons as they relax. The altitude and the species determine the color: atomic oxygen at 200-300 km emits 630 nm red light; atomic oxygen at 100-150 km emits 557.7 nm green light; nitrogen at 100 km emits blue and violet.

## The One Concept

The **auroral oval** is the ring-shaped region on Earth's surface that maps to the open/closed field line boundary of the magnetosphere. Particles enter this zone via two mechanisms. The first is **loss cone precipitation**: trapped particles whose pitch angles are small enough that their mirror point falls below ~100 km altitude, where atmospheric density is high enough to guarantee a collision. The second is **direct entry at the magnetospheric cusps**: solar wind particles that flow directly down open field lines at the polar cusp without ever being trapped. Once in the upper atmosphere, the collision chain is straightforward — an incoming electron with ~1–10 keV of energy collides with an oxygen atom, transferring energy and raising the oxygen electron to an excited state. The excited atom emits a photon: the 557.7 nm green line is the most famous, arising from a metastable transition in atomic oxygen that takes about 1 second to emit (it is a forbidden transition). This is why aurora flickers and ripples — the emission is slow. The red line at 630 nm comes from an even higher-altitude oxygen transition, slower still. Nitrogen produces the blue and pink fringing. The shapes of auroral curtains — parallel rays, arcs, coronas — trace the structure of the magnetic field lines directly above.

## The Fix

Add loss cone checking to each particle's state. Compute the local field strength B at the current position and compare pitch angle to the loss cone angle:

```js
function isInLossCone(pitchAngle, B_current, B_atmosphere) {
  let sinLC = Math.sqrt(B_current / B_atmosphere);
  let alphaLC = Math.asin(sinLC);
  return pitchAngle < alphaLC;
}
// In the integration loop:
let alpha = Math.atan2(vPerp, vParallel);
if (isInLossCone(alpha, B(pos), B_atm)) {
  drawAurora(pos); // particle hits atmosphere
  emitPhoton(pos, getColor(altitude(pos)));
}
```

Now particles only hit Earth near the poles, and the simulation produces two glowing ovals — the auroral rings. Color the emission by altitude: green between 100–150 km, red above 200 km, violet and blue below 100 km.

## The Wow Moment — Push It

Simulate a **geomagnetic storm**: rapidly increase the solar wind pressure, which compresses the magnetosphere and pushes the auroral oval to lower latitudes. Watch the green aurora ovals expand southward, eventually reaching simulated mid-latitudes — recreating the famous "Halloween Storm" of 2003 when auroras were visible in Florida and Texas. Add a dynamic reconnection event at the magnetotail that injects a burst of electrons, causing a sudden brightening (auroral substorm) — the light pulses and sweeps across the oval.

## The Interactive Demo

- **Solar wind electron flux** — slider 0 to 10× normal, brightens the aurora
- **Solar wind pressure** — slider 0.5 to 5 nPa, compresses magnetosphere and shifts oval latitude
- **IMF Bz (southward field)** — slider +10 to −10 nT, southward IMF opens the magnetosphere and intensifies aurora
- **Show loss cone angle** — toggle that draws the cone boundary on each particle's position
- **Altitude color map** — toggle between monochrome and altitude-based ROYGBIV emission coloring
- **Particle pitch angle** — slider for individual test particle, shows whether it is trapped or precipitating

## Production Notes

Render Earth from the top-down polar perspective. Magnetic field lines are drawn as curved arcs from pole to pole. Incoming solar wind is a stream of blue dots from the left edge of the canvas. Trapped particles spiral in tight helices (shown as small spring-like curves along field lines). When a particle precipitates, it leaves a colored glow at the altitude-correct position on the polar oval. Add a real-time altitude gauge on the right side of the canvas from 0 to 400 km with color bands labeled by emission color. Show a live Kp-index readout that increases during the storm simulation, and draw the auroral oval boundary as a dashed circle that expands southward as Kp increases.

## Tags
`electromagnetism` `aurora` `solar-wind` `atmospheric-physics` `emission-spectra` `loss-cone` `canvas` `beginner`

## Thumbnail

A photographer's-eye view of brilliant green and red aurora curtains over a snow-covered mountain. Bottom-left corner overlay: a diagram of a particle spiraling down a field line. Bold text: "Why It's Green (The Physics)" in white on a dark band. The real aurora photo provides instant visual drama while the diagram hint signals this is an educational breakdown, not just nature photography.
