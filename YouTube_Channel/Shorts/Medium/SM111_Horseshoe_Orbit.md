---
title: "Horseshoe Orbit — Co-Orbital Dynamics"
id: SM111
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Orbital_Mechanics_Full]]"
difficulty: medium
tags: [physics, simulation, short, orbital-mechanics, solar-system, asteroids, Trojan]
---

> **What it is:** A ~45-second simulation short where an asteroid co-orbital with Earth reveals a giant horseshoe-shaped path in the co-rotating frame, making a 770-year gravitational U-turn at each approach — the same dynamics seen in Saturn's swapping moons Janus and Epimetheus. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Orbital_Mechanics_Full]]

# Short: Horseshoe Orbit — Co-Orbital Dynamics
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A small asteroid seems to orbit the Sun normally — but then, as the camera shifts to a frame co-rotating with Earth, the asteroid's path reveals itself as a giant horseshoe shape, looping ahead of Earth, switching sides, and looping behind, never quite catching up and never falling away.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Inertial frame: the Sun at center, Earth (blue dot) on a circular orbit, asteroid (orange dot) on a nearly identical orbit slightly inside or outside. Both appear to orbit normally. The year marker ticks: 1 year, 2 years, 3 years.
- **0:10–0:18:** Frame transformation: the view rotates to co-rotate with Earth. Earth becomes stationary (blue dot on right side of screen). The Sun (center). The asteroid now traces a curved path — it drifts toward Earth from behind (from the right), and as it approaches, Earth's gravity gives it a small kick.
- **0:18–0:28:** The kick: the asteroid is approaching from behind Earth in the co-rotating frame. Earth's gravity accelerates it slightly → it gains orbital energy → moves to a slightly larger orbit → becomes slower than Earth → falls behind instead of catching up. Its path curves away into a huge arc — the horseshoe. Complete U-turn at left side of screen.
- **0:28–0:38:** The asteroid completes the horseshoe — it has drifted all the way around to approach Earth from the front. Gravity slows it → drops to inner orbit → faster than Earth → drifts back. The complete horseshoe shape is traced in orange. Period of one full horseshoe cycle: ~770 years (for Earth co-orbitals).
- **0:38–0:45:** Zoom out: Janus and Epimetheus (Saturn's co-orbital moons) shown — they swap orbits every 4 years. Brief side-by-side with the simulation. Real photo of Epimetheus from Cassini flashed for 1 second.

## Physics Concept Teased
A horseshoe orbit arises in the co-rotating frame of a planet when a small body shares nearly the same orbital radius. The Coriolis force and tidal acceleration (from the Hill sphere) create a potential well that deflects close-approaching bodies into long horseshoe-shaped paths in the rotating frame. The body oscillates around the L3, L4, L5 Lagrange points without ever getting close enough to be captured.

## On-Screen Text / Captions
- **0:00:** "This asteroid isn't orbiting Earth. It's playing leapfrog with it — forever."
- **0:08:** "In the co-rotating frame..."
- **0:15:** "Approaching from behind: gravity kicks it outward"
- **0:23:** "Now it drifts all the way around"
- **0:30:** "One full horseshoe: ~770 years"
- **0:38:** "Janus and Epimetheus swap orbits every 4 years."
- **0:44:** "Saturn's moons figured this out without knowing physics."

## End Card
Final 3 seconds: the elegant orange horseshoe curve on black, Earth as a blue dot. Text: "The solar system is full of hidden choreography." Channel logo.

## Audio
Playful, curious acoustic guitar arpeggios. Voiceover (light, amused): "It never touches Earth. It never escapes. It just ... dances." Soft whoosh when the asteroid makes its U-turn at each end of the horseshoe. Tick sound for each year elapsed in the inertial-frame intro.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: integrate test particle under Sun + Earth gravity using RK4. Then transform to Earth co-rotating frame: x_rot = x·cos(Ωt) + y·sin(Ωt), y_rot = -x·sin(Ωt) + y·cos(Ωt). Initial conditions: semi-major axis a = 1.0 AU ± 0.005 AU, eccentricity ε=0, small inclination 0. Run for 100 years (100× speed). Janus/Epimetheus: look up actual orbital elements (both at ~151,500 km from Saturn, swap every 4 years). Gotcha: in the co-rotating frame, the Coriolis and centrifugal pseudo-forces must be added explicitly — don't forget the factor of 2 on Coriolis. Draw the full trail with alpha persistence to show the horseshoe shape.
