---
title: "Why Satellites Don't Fall: They're Actually Falling Sideways"
id: B018
difficulty: 2/10
prereq: "None"
concept: "Circular orbital velocity v = √(GM/r) — perpetual free fall"
tags: [physics, orbital-mechanics, satellites, gravity, circular-orbit, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Satellites Don't Fall: They're Actually Falling Sideways

**Alt title:** "The ISS Is Falling Right Now. That's Why Astronauts Float."
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Show a photo of an astronaut floating inside the International Space Station. Ask: "Why is she floating?" Most people say: "No gravity in space." Wrong. At 408 km altitude, Earth's gravitational field strength is 8.65 m/s² — that's 88% of what you feel on the ground. There is plenty of gravity. She's not floating because gravity is absent. She's floating because she — and the ISS — are in the same free fall. Both the astronaut and the station are falling toward Earth at exactly the same rate. They never land because the Earth's surface curves away as fast as they fall. This is the genius of a circular orbit: the sideways speed is high enough that the ground always curves away. Drop a wrench in the ISS cabin — it floats beside you. Not because there's no gravity, but because it's falling alongside you. Zero perceived weight; 88% of standard gravity acting. This video will build Newton's cannonball simulation from scratch, derive the orbital velocity formula from first principles, and then show what happens when the altitude-cutoff approximation breaks an entire simulated GPS satellite constellation.

## The Naive Attempt

Build a satellite simulation using the "gravity turns off at some altitude" model. It's a natural first mistake for a programmer who's implemented basic gravity in game development: create a physics body, apply constant downward force `F = mg` when below threshold altitude h_cutoff, and zero force above h_cutoff. Set h_cutoff = 100 km (the Karman line — the edge of space). Below 100 km: downward gravity at 9.81 m/s². Above 100 km: no gravity. The satellite launches with enough horizontal speed to reach 100 km altitude, then "in space" it coasts in a straight line. From the simulation's perspective this looks like a satellite maintaining altitude — it's above 100 km and moving horizontally. The code runs. The satellite "stays in space." It looks like orbit. But it's not orbit: the simulated satellite moves in a straight line at constant altitude because there's no force to curve its path. Add a ground track visualization — the satellite moves at constant speed in a perfectly straight line across the Earth. Real satellite orbits trace graceful curves dictated by Newton's gravity at every altitude.

To make the failure worse: set up a GPS constellation of 24 satellites at 20,200 km altitude in the naive model. They all freeze in place — no gravity at that altitude, no centripetal force needed, no orbital period. They just hang there. Drop one satellite to 100 km in the naive model — it suddenly starts getting pulled down (gravity turns back on) and crashes. The model has a catastrophic discontinuity at h_cutoff. A real GPS satellite at 20,200 km experiences g = GM/r² = 0.567 m/s² — weak but definitely non-zero. The gravity never turns off.

## The Moment of Failure

Reveal the failure in two quantitative ways. First: orbital period prediction. In the real model, ISS orbital period = 2π√(r³/GM) = 2π√((6371+408)³ × 10³/(6.674 × 10⁻¹¹ × 5.97 × 10²⁴)) ≈ 5,560 seconds = 92.7 minutes. The ISS completes 15.5 orbits per day. In the naive constant-cutoff model: above 100 km, the satellite coasts in a straight line — it never completes a circuit. Orbital period is undefined (infinite). Second: apply a slight perturbation. In the naive model, a satellite at 150 km altitude but with slightly insufficient horizontal speed immediately falls below 100 km and then gets pulled down to the surface by constant g = 9.81 m/s² — it crashes. A satellite at 150 km with slightly excess speed climbs above the cutoff and coasts away forever. There is no stable orbit in this model — it's binary crash-or-escape with no stable regime. Real orbital mechanics has a rich stability landscape: elliptical orbits at every eccentricity, decaying spiral orbits with atmospheric drag, etc. The naive model collapses all of this to a binary switch.

## Why It Broke — The Physics

Newton's argument, reformulated: on the surface, gravity provides 9.81 m/s² toward Earth's center. If you're moving horizontally fast enough, the Earth's surface curves away from you at 9.81 m/s² — matching the fall. The key: how much does Earth's surface drop for each meter of horizontal travel? Earth's radius R = 6,371 km. After traveling one meter horizontally, the surface drops approximately Δh = 1²/(2R) = 1/(2 × 6,371,000) ≈ 7.84 × 10⁻⁸ m = 78.4 nanometers. For this to equal the fall from gravity: Δh = ½g·t² where t = 1 m / v. So: 1/(2R) = g/(2v²) → v² = gR → v = √(gR). This gives v = √(9.81 × 6,371,000) ≈ 7,909 m/s. But this is the surface approximation. More precisely, for a circular orbit at radius r, centripetal acceleration must equal gravitational acceleration:

**v²/r = GM/r²**

**v_orb = √(GM/r)**

At ISS altitude (r = 6,371 + 408 = 6,779 km): v_orb = √(6.674 × 10⁻¹¹ × 5.97 × 10²⁴ / 6,779,000) = √(5.875 × 10⁷) = 7,665 m/s ≈ 7.66 km/s. The gravity at ISS altitude is not 9.81 but 8.65 m/s² — hence the speed is slightly lower than the surface approximation. The key insight: at any altitude, the orbital velocity is exactly the speed at which centripetal acceleration equals gravitational acceleration. Gravity provides the centripetal force; orbital speed provides the centripetal acceleration. The satellite is perpetually falling — it just keeps missing the Earth because of its sideways speed.

## The One Concept

**Circular orbital velocity: v = √(GM/r)**

**Formal definition:** A circular orbit exists when the gravitational force provides exactly the centripetal force needed for circular motion at radius r: F_gravity = F_centripetal → GMm/r² = mv²/r → v = √(GM/r). This speed is uniquely determined by the orbital radius r and the central mass M. The orbital period follows: T = 2πr/v = 2π√(r³/GM) — Kepler's Third Law in its derived form.

**The "falling sideways" intuition:** An orbit is perpetual free fall. The satellite falls toward Earth at the local gravitational acceleration (which changes with altitude). Simultaneously, its tangential velocity carries it horizontally. At exactly v_orb, the curvature of its trajectory matches the curvature of Earth's surface. The satellite "falls around" the planet. Weightlessness aboard the ISS is not the absence of gravity — it is the complete conversion of gravity into centripetal acceleration. The astronaut, the station, and every object in it all fall at the same rate. There is no surface to push back. Hence: apparent weightlessness.

**Key numbers:**
- ISS (408 km): v_orb = 7.66 km/s, T = 92.7 min
- GPS (20,200 km): v_orb = 3.87 km/s, T = 11.97 hr ≈ 12 hr
- GEO (35,786 km): v_orb = 3.07 km/s, T = 24.0 hr (geostationary)
- Moon (384,400 km): v_orb = 1.02 km/s, T = 27.3 days

**Real-world examples:**
1. **GPS satellites:** 24 satellites in medium Earth orbit at ~20,200 km, each completing two orbits per sidereal day. Their orbital speed (3.87 km/s) and altitude mean their clocks run faster than Earth's surface clocks by 45.9 microseconds per day from the weaker gravity, but slower by 7.2 microseconds per day from special relativistic time dilation from their speed. Net: GPS clocks gain 38.4 microseconds per day if uncorrected — enough to accumulate 11 km of position error per day. The GPS system corrects this using General and Special Relativity.
2. **Geostationary satellites:** At exactly 35,786 km altitude, the orbital period equals Earth's sidereal rotation period (23h 56m 4s). The satellite appears stationary above a fixed point on the equator. Used for TV broadcasting, weather observation, and communications. All geostationary satellites must be in the equatorial plane at this single altitude — hence the crowding of "slots" and international frequency coordination.
3. **Atmospheric drag and orbital decay:** In low Earth orbit, residual atmosphere (thin but non-zero even at 400 km) exerts a tiny drag force. This removes kinetic energy and lowers the orbit — the satellite spirals inward. Counterintuitively, this makes it go faster (lower orbit = higher orbital speed). The ISS requires periodic reboosts (about 2 km/s of delta-v per year) to compensate. Without reboosts, it would de-orbit in a few years.

## The Fix

Use Newton's 1/r² gravity at every altitude:

```javascript
class Satellite {
  constructor(x, y, vx, vy, mass) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.mass = mass;
  }
  
  update(planet, dt) {
    const dx = planet.x - this.x;
    const dy = planet.y - this.y;
    const r = Math.sqrt(dx**2 + dy**2);
    
    // Newton's gravity — no cutoff, works at any altitude
    const accel = planet.G_times_M / (r * r);
    const ax = accel * dx / r;
    const ay = accel * dy / r;
    
    // Symplectic Euler (better energy conservation than plain Euler)
    this.vx += ax * dt;
    this.vy += ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    return r; // return distance for orbit classification
  }
}

// Launch satellite: set initial position on the surface,
// initial velocity perpendicular to the radius vector
// For circular orbit: v = sqrt(GM / r)
const r_orbit = planet.radius + altitude;
const v_circular = Math.sqrt(planet.GM / r_orbit);
const sat = new Satellite(r_orbit, 0, 0, v_circular, 1);
// (x = r_orbit, y = 0) → velocity tangent to orbit = (0, v_circular) for CCW orbit
```

With this fix: the satellite orbits correctly. The period matches T = 2π√(r³/GM). Perturb the initial velocity slightly below v_circular — elliptical orbit with perigee below the launch altitude. Above v_circular — elliptical orbit with apogee above. At √2 × v_circular — escape. The full rich orbital mechanic landscape emerges from a single formula replacing the altitude cutoff.

## The Wow Moment — Push It

Build three progressively impressive demonstrations. First: **Hohmann transfer orbit**. Set up two circular orbits: LEO (400 km, v = 7.67 km/s) and GEO (35,786 km, v = 3.07 km/s). The most fuel-efficient way to move between them is the Hohmann transfer: one burn at LEO periapsis to raise apoapsis to GEO altitude (entering an elliptical transfer orbit), then one burn at apoapsis (now at GEO altitude) to circularize. Show the transfer orbit as an elongated ellipse. Compute delta-v for each burn: Δv₁ = v_transfer_periapsis − v_LEO, Δv₂ = v_GEO − v_transfer_apoapsis. Animate the two burns with engine glow effects. Display total Δv budget consumed.

Second: **debris avoidance maneuver**. Show the ISS on-screen with a piece of debris on an intersecting orbit. The ISS mission control fires thrusters 24 hours in advance — a tiny burn (just a few m/s). Show how this small delta-v, applied early, moves the orbit just enough that the close approach distance increases from 100 meters to 5 km. Illustrate the sensitivity: a 1 m/s burn now causes a 7 km position change after one full orbit (92.7 minutes). Early burns are exponentially more efficient than late corrections.

Third: **full GPS constellation simulation**. Place all 24 GPS satellites in six orbital planes (4 satellites per plane, planes inclined 55° to the equator). Run the constellation forward — watch the orbital choreography. At any moment on Earth's surface: 4–8 satellites are visible above the horizon. Place a user receiver on Earth's surface. Show the trilateration: compute time of flight from each visible satellite, compute position from the intersection of the spherical shells. Accuracy depends on satellite geometry (GDOP — geometric dilution of precision). Show how accuracy degrades when satellites cluster together in the sky.

## The Interactive Demo

Canvas simulation at 1100 × 700 px. Orthographic projection of Earth at center with glowing ring showing atmosphere. Stars in background. Satellite(s) in orbit with trailing path.

**Altitude slider** (200 km to 42,000 km, logarithmic): Sets initial circular orbit altitude. v_orb and T update in real time. Preset markers: LEO/ISS, MEO/GPS, GEO. Planet bulge visualization (oblateness) toggleable.

**Initial velocity vector:** Click on canvas to set custom launch point and velocity direction. Keyboard shortcut to set to exact v_circular. Speed can be adjusted up/down from circular — shows resulting orbit shape changing between crash-ellipse, circle, eccentric-ellipse, and escape.

**Orbital element readout:** Live display of semi-major axis a, eccentricity e, period T, apoapsis, periapsis, and energy (KE + PE). Color-coded: green = circular, orange = elliptical, red = suborbital (will crash), blue = escape trajectory.

**Multiple satellites:** Place up to 10 satellites by clicking. Each gets a unique color trail. Visualize orbital resonances when periods are commensurate.

**Burn mode:** Click "Add burn" to schedule a brief velocity impulse at a specific point on the orbit. Show the resulting new orbit. Chain multiple burns to simulate Hohmann transfer.

**Drag toggle:** Enable atmospheric drag (r-dependent drag coefficient). Watch satellite gradually spiral inward. Reboost button to restore altitude.

**Time warp slider** (1× to 1000×): Speed up or slow down the simulation clock. At 1000×, a 92-minute ISS orbit takes about 5.5 seconds.

**ISS view mode:** Camera locks to ISS reference frame. Earth rotates below. Sunrise/sunset visible. Ground track drawn on Earth surface. Current position latitude/longitude displayed.

## Production Notes

**Runtime estimate:** ~14–16 minutes. Hook/ISS misconception (1.5 min), Naive code build (2.5 min), Failure demonstration (2 min), Physics derivation (3 min), Fix (2 min), Wow — Hohmann + GPS (3 min), Interactive demo (2 min).

**Screen layout:** Very canvas-heavy episode. Use 75/25 canvas/code split. The orbit visualizations are the star of the show. Earth should be rendered with a high-quality texture or at minimum a beautiful procedurally-generated surface. Use a proper space aesthetic: dark background, star field, Earth glow (limb brightening).

**Animations to prepare:** Newton's cannonball thought experiment (historical woodcut style, animated). The ISS interior showing astronaut floating — with an overlay showing the gravity vector pointing downward at full 8.65 m/s² alongside the "apparent weight = 0" label. The Hohmann transfer diagram (pre-animated, labels burn Δv₁ and Δv₂ as the satellite reaches periapsis and apoapsis).

**Key zoom moments:** (1) The ISS photo with g = 8.65 m/s² gravity overlay — the graphic showing 88% gravity while astronaut floats. Hold for 4 seconds with no narration. (2) The exact moment the orbit closes into a perfect circle — zoom on the periapsis/apoapsis converging to the same altitude. (3) The GPS trilateration — zoom into the user position resolving as 4 circles intersect at a single point.

**B-roll:** Real ISS footage (NASA public domain). ISS reboost thruster fire footage. GPS receiver lock animation. Satellite launch footage. The International Space Station flying over a city in a long-exposure star-trail photograph.

**Misconception to emphasize:** Many viewers believe microgravity aboard the ISS means there is no gravity in space. This episode should thoroughly destroy that misconception with a memorable graphic: the g value at ISS altitude printed large on screen (8.65 m/s²) with an arrow pointing toward Earth's center, and the astronaut floating beside it. Repeat this image as a callback throughout the episode.

## Tags
`physics` `orbital-mechanics` `satellites` `gravity` `circular-orbit` `javascript` `canvas` `beginner`

## Thumbnail

Split image: LEFT shows an astronaut floating inside the ISS cabin in microgravity, arms outstretched, serene. RIGHT shows an overlay of the same image with a large red arrow pointing downward labeled "g = 8.65 m/s²" (88% of surface gravity). Bold text across the top: "SHE'S NOT FLOATING. SHE'S FALLING." Subtext: "At 17,000 mph sideways." The reveal that there IS gravity at ISS altitude — shown numerically and with a direction arrow — directly contradicts the viewer's prior belief and demands explanation. The 17,000 mph speed (in intuitive units, not km/s) reinforces the "falling sideways" concept with an immediately relatable extreme number. Emotion: "I've believed the wrong thing my whole life." Clean, high-contrast, slightly dramatic red/blue color tone.
