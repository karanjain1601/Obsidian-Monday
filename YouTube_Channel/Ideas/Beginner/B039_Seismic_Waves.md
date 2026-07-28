---
title: "How Seismographs Detect Earthquakes (P and S Waves)"
id: B039
difficulty: 2.5/10
prereq: "B024 — Wave Types and Propagation"
concept: "P-waves (longitudinal, faster) and S-waves (transverse, slower) travel at different speeds; S-P arrival time difference at a seismograph gives distance to epicenter; three stations triangulate location"
tags: [physics, seismology, seismic-waves, earthquake, p-wave, s-wave, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# How Seismographs Detect Earthquakes (P and S Waves)

**Alt title:** "Detecting Earthquakes With Nothing But a Vibrating Needle"
**Difficulty:** 2.5/10 | **Prereq:** B024 — Wave Types and Propagation

---

## Opening Hook (0:00–1:00)

Bring up a real seismogram — the jagged line from a seismograph recording a magnitude 6.8 earthquake. The record is flat... flat... flat... then at exactly 14:23:07 UTC, a series of small, rapid oscillations begins (the P-wave arrival). Then, 3 minutes and 22 seconds later, a dramatically larger, slower oscillation starts (the S-wave arrival). And 90 seconds after that, the ground shakes most violently of all (the surface wave arrival, not covered today).

Three geophysicists in three different cities each look at their seismogram. Each measures the S-P time difference (the gap between P and S arrivals). Each computes a distance to the earthquake source. Each draws a circle on a map centered at their station, with radius equal to their computed distance. Three circles. They intersect at exactly one point — a point in northern California, 30 km underground. That is the earthquake's epicenter and hypocenter. No GPS. No satellite. No communication with the other stations. Just physics, a stopwatch, and a vibrating needle.

This is how seismologists have located thousands of earthquakes since the first seismographs in the 1880s. The physics is elegant: two wave types travel at different speeds set by the elastic properties of rock. The time difference between them at any receiver is proportional to the distance traveled. It is the same principle as counting seconds between a lightning flash and thunder to estimate storm distance — but applied to the Earth's interior.

---

## The Naive Attempt

Model all seismic waves as a single expanding circle radiating from the earthquake source at one fixed speed. Place three "seismograph stations" at fixed positions. When the wave circle reaches a station, record the arrival time.

```javascript
const earthquake = { x: 300, y: 250, time: 0 };   // epicenter position and origin time
const stations = [
  { x: 100, y: 100, name: "Station A" },
  { x: 500, y: 150, name: "Station B" },
  { x: 300, y: 480, name: "Station C" }
];

const WAVE_SPEED = 6000;   // m/s — single speed for all waves

function updateWave(t) {
  const radius = WAVE_SPEED * t;   // expanding circle
  for (const station of stations) {
    const dist = Math.hypot(station.x - earthquake.x, station.y - earthquake.y);
    const arrivalTime = dist / WAVE_SPEED;
    if (t >= arrivalTime && !station.arrived) {
      station.arrived = true;
      station.arrivalTime = arrivalTime;
      station.seismogram.push(Infinity);   // single spike at arrival
    }
  }
}
```

All stations see a single seismic wave arrive. Each seismogram shows one spike. You can measure the arrival time at each station and compute the distance (since the wave speed is known). But there is only one arrival per station — no S-P time difference, no way to determine distance without knowing the origin time.

---

## The Moment of Failure

Run the single-speed simulation. Each station gets one spike. To locate the earthquake using three stations, you'd need to solve: `t_arrival_i = t_origin + d_i / v` for three unknowns (x_eq, y_eq, t_origin) and three equations. This is solvable in principle, but requires knowing the origin time — which you don't know at the time of measurement.

In practice, if you only have single-speed waves and you don't know the earthquake's origin time, you can't determine distance from a single station. You need at least three stations and you must solve for origin time simultaneously. This requires careful time synchronization between all three stations — historically impossible before GPS-based atomic clocks.

But there's a far simpler approach that doesn't require known origin time or inter-station synchronization: measure the S-P time gap at a single station. Since both P and S waves leave the earthquake at the same moment (origin time), their arrival time difference at any station:
```
Δt = t_S - t_P = d/v_S - d/v_P = d * (1/v_S - 1/v_P)
```
This requires only that you can distinguish P from S arrivals on the same seismogram — not that you know when the earthquake happened. The single-wave model cannot produce a distinguishable P vs. S arrival because it models only one wave type.

---

## Why It Broke — The Physics

Seismic body waves come in two fundamentally different types, determined by the elastic constants of the rock through which they travel:

**P-waves (Primary / Pressure / Compressional):**
- Particle motion is parallel to the direction of wave propagation (like sound in air — push-pull).
- Can travel through solid rock, liquid rock (magma), and even liquid (the Earth's liquid outer core).
- Speed: `v_P = √((K + 4μ/3) / ρ)` where K is bulk modulus, μ is shear modulus, ρ is density.
- Typical values in continental crust: v_P ≈ 6,000 m/s = 6 km/s.

**S-waves (Secondary / Shear / Transverse):**
- Particle motion is perpendicular to the direction of propagation (like a transverse wave on a string).
- Can ONLY travel through materials with a shear modulus μ > 0 — i.e., only through solids. Liquids and gases have μ = 0, so S-waves cannot propagate through them. This is the seismological proof that the Earth's outer core is liquid.
- Speed: `v_S = √(μ / ρ)` — only the shear modulus, not the bulk modulus, because S-waves are pure shear.
- Typical values in continental crust: v_S ≈ 3,500 m/s = 3.5 km/s.

**S-P Time Method:**
```
Δt = d * (1/v_S - 1/v_P)
d = Δt / (1/v_S - 1/v_P) = Δt * v_S * v_P / (v_P - v_S)
```
For typical crustal values: `d = Δt * 3500 * 6000 / (6000 - 3500) = Δt * 8400`. So for Δt = 10 s: d = 84 km. Quick mental math: every 8 seconds of S-P delay ≈ 67 km distance. Field seismologists memorize this.

---

## The One Concept

**The S-P Time Method for Earthquake Location** exploits the fact that P-waves and S-waves travel at different speeds through rock. Because both are emitted simultaneously from the earthquake source, the time gap between their arrivals at any station is directly proportional to the source distance. This allows a single station to estimate distance — and three stations to triangulate the epicenter — without knowing the earthquake's origin time.

**Why Two Wave Types Exist:** The elastic wave equation in a homogeneous isotropic solid has two solutions — one longitudinal (P) and one transverse (S). Their speeds depend on different combinations of the elastic constants (K, μ, ρ). In any medium with both bulk and shear stiffness, both types exist. In a fluid (μ = 0), only P-waves survive.

**Triangulation Procedure:**
1. Each station measures: t_P (P arrival time), t_S (S arrival time).
2. Compute: Δt = t_S - t_P at each station.
3. Compute distance: d = Δt * v_S * v_P / (v_P - v_S).
4. Draw a circle of radius d centered at each station.
5. The three circles intersect at the epicenter (adjusting for depth effects).

**Refinement — depth:** The earthquake is not at the surface. If depth z is nonzero, the slant distance from station to hypocenter is `D = √(d_surface² + z²)`. Three stations give three equations in three unknowns (x_eq, y_eq, z_eq). Modern seismology networks use dozens of stations and least-squares fitting to locate earthquakes to within 1-2 km accuracy.

**Real-World Examples:**
1. **S-wave shadow zone:** Between 105° and 140° of arc from any earthquake epicenter, no S-waves are detected at the surface. This is because S-waves cannot pass through the liquid outer core — they are blocked. This shadow zone is direct physical evidence that the Earth has a liquid outer core, discovered by Richard Oldham in 1906.
2. **P-wave shadow zone:** Between 105° and 140°, P-waves are also partly absent — they are refracted around the outer core rather than passing through it (Snell's law applied to the core-mantle boundary). This creates the P-wave shadow zone, which is a different arc from the S-wave shadow zone and provides information about the core's radius.
3. **Nuclear test detection:** The Comprehensive Nuclear-Test-Ban Treaty Organization (CTBTO) operates 170 seismic monitoring stations globally. Underground nuclear detonations generate P-waves but very weak S-waves (explosions are spherically symmetric — they shear the ground less than shear faulting does). The ratio of P to S wave amplitude is a seismological diagnostic for distinguishing nuclear tests from natural earthquakes.

---

## The Fix

Implement two separate expanding wave circles from the earthquake source, propagating at different speeds. Each station records two arrivals independently.

```javascript
const V_P = 6000;   // m/s, P-wave speed
const V_S = 3500;   // m/s, S-wave speed

function updateWaves(t) {
  const pRadius = V_P * t;   // P-wave front
  const sRadius = V_S * t;   // S-wave front

  for (const station of stations) {
    const dist = Math.hypot(station.x - earthquake.x, station.y - earthquake.y);

    // P arrival
    if (!station.pArrived && pRadius >= dist) {
      station.pArrived = true;
      station.tP = t;
      station.seismogram.push({ time: t, amplitude: 0.3, type: 'P' });
    }
    // S arrival (always after P)
    if (!station.sArrived && sRadius >= dist) {
      station.sArrived = true;
      station.tS = t;
      station.seismogram.push({ time: t, amplitude: 1.0, type: 'S' });

      // Compute distance from S-P time
      const deltaT = station.tS - station.tP;
      station.estimatedDist = deltaT * V_S * V_P / (V_P - V_S);
    }
  }
}

function triangulateEpicenter() {
  // Each station has an estimated distance (radius of circle)
  // Find intersection of three circles (least squares if overdetermined)
  // Simple 3-station case: solve algebraically
  const [A, B, C] = stations;
  // ... circle intersection algorithm ...
  return { x: xEpicenter, y: yEpicenter };
}
```

Render: the P-wave circle (blue, faster expanding) and S-wave circle (red, slower). When each wave reaches a station, the seismogram shows the corresponding spike. After both arrive at all three stations, draw the three distance circles and show their intersection.

---

## The Wow Moment — Push It

Scale up to the full Earth. Render an Earth cross-section: crust (thin, brown), mantle (dark gray, rocky), outer core (orange, liquid), inner core (bright yellow, solid). Place an earthquake on the surface (subduction zone — Cascadia). Show P and S waves expanding simultaneously as circular wavefronts.

The P-wave circle expands into the mantle, gradually increasing speed as rock density increases with depth (Snell's law in a continuous medium causes the ray path to curve — seismic rays bend, not travel straight). Show ray paths bending toward the surface as they pass through the deep mantle. Show the P-wave entering the liquid outer core — and the S-wave dying completely at the core-mantle boundary. Show the refracted P-wave (PKIKP — through inner core) and the diffracted P-wave around the outer core edge.

Highlight the shadow zones in red on the Earth's surface: the S-wave shadow zone (all of 103°-180° arc from epicenter), the P-wave shadow zone (103°-140°). These are blank on the seismic map — no stations detect waves there. This is how Beno Gutenberg in 1914 computed the radius of the Earth's liquid outer core to within 1% — by measuring the geometry of the P-wave shadow zone.

Finally, show the Sumatra 2004 M9.1 earthquake: place it on the correct map location, animate the wave propagation across the globe (it takes approximately 25 minutes for the P-wave to travel antipodally). Show seismograph traces updating at 170 cities simultaneously.

---

## The Interactive Demo

Full Earth cross-section simulation (900×900 px circular canvas representing a 2D cross-section through Earth's center):

**Earthquake Setup:**
- **Click anywhere** on the Earth cross-section to place an earthquake.
- **Magnitude slider** (M5–M9.5): scales the wave amplitude (not speed) and the seismogram amplitude.
- **Depth slider** (0–700 km): places the earthquake at correct depth in the crust, upper mantle, or deep mantle.

**Wave Propagation:**
- **P-wave** shown as expanding blue circle.
- **S-wave** shown as expanding red circle — visually stops at the liquid outer core boundary.
- **Ray path mode:** toggle to show curved ray paths (computed using Snell's law for the PREM Earth model velocity gradient) instead of circular wavefronts.
- **Wave speed display:** color-coded cross-section showing P-wave speed vs. depth (blue = slow near surface, red = fast in lower mantle, blue again in outer core, red in inner core).

**Seismograph Stations (up to 10 placeable):**
- Each shows a live seismogram updating as waves arrive.
- P and S arrivals labeled. S-P time displayed.
- Auto-computed distance from S-P time.
- After 3+ stations have both P and S: distance circles draw on Earth map, intersection computed and marked.

**Special Modes:**
- **Shadow zone display:** highlight the surface arcs receiving no P or S waves.
- **Historical presets:** Sumatra 2004, Tohoku 2011, San Francisco 1906 (modeled from historical seismograms).
- **CTBTO nuclear test detector:** mode showing an "underground explosion" with only P-wave and very weak S-wave — demonstrates how the distinction works.

---

## Production Notes

**Structure and timing:**
- Hook: 0:00–1:00 (60 s). Show a real seismogram (IRIS earthquake browser has public data). The P-arrival and S-arrival labels should be clearly visible. The "detective" framing — how do you know where an earthquake happened from a wiggling line in a distant building? — is compelling.
- Naive attempt: 1:00–2:30 (90 s). Single-speed wave code is minimal. Show that the seismogram gives only one spike and explain why you need the origin time — which you don't know.
- Physics explanation: 2:30–5:30 (180 s). The P-wave vs. S-wave comparison is the core — show particle motion animations (push-pull for P, side-to-side for S) using simple canvas animations. The S-wave cannot pass through liquid — connect this to the outer core liquid discovery immediately. Then derive the S-P time formula.
- The fix: 5:30–7:00 (90 s). Two circles at different speeds. The seismogram now shows two arrivals. The distance computation. The three-circle triangulation reveal.
- Wow moment: 7:00–10:00 (180 s). The full Earth cross-section with shadow zones is the visual masterpiece. Prepare the Earth model carefully with realistic velocity gradients and labeled internal boundaries. The 2004 Sumatra global wave propagation animation is visually stunning.
- Interactive demo: 10:00–11:00 (60 s).

**Key filming decisions:** Source the opening seismogram from IRIS (Incorporated Research Institutions for Seismology) — they have public waveform data with labeled arrivals. The particle motion animations for P vs. S waves are key — use large, exaggerated arrows. The Earth cross-section must be beautiful — use a reference like the Preliminary Reference Earth Model (PREM) for velocity data.

**Approximate runtime:** 11 minutes.

---

## Tags
`physics` `seismology` `seismic-waves` `earthquake` `p-wave` `s-wave` `javascript` `canvas`

---

## Thumbnail

Earth cross-section diagram with a P-wave (blue) and S-wave (red) expanding from a single earthquake point, clearly showing the S-wave stopping at the liquid outer core boundary (the red circle has a gap where the outer core is). Surface seismogram traces shown at three points on the surface, each with two labeled peaks (P and S). Three thin dashed circles radiating from the seismograph positions intersect at the earthquake source point. Large text: "HOW WE KNOW WHERE IT STRUCK." Sub-text: "P-Wave and S-Wave Physics." The three intersecting circles are the visual hook — most viewers have never seen seismic triangulation illustrated this clearly. The Earth cross-section gives instant planetary scale.
