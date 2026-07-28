---
title: "Getting a Free Speed Boost from a Planet (Gravity Assist)"
id: B079
difficulty: 3/10
prereq: "B018"
concept: "In the solar system frame, spacecraft can gain kinetic energy by swinging around a planet; in the planet's frame it's elastic: same speed in, same speed out; the planet (moving) transfers momentum"
tags: [orbital-mechanics, gravity-assist, reference-frames, momentum-transfer, spacecraft, energy, canvas, beginner]
category: beginner
type: video-idea
---

# Getting a Free Speed Boost from a Planet (Gravity Assist)

**Alt title:** "How Voyager Stole Speed From Jupiter (And Why It's Not Cheating)"
**Difficulty:** 3/10 | **Prereq:** B018

---

## Opening Hook (0:00–1:00)

The video opens with actual NASA footage of the Voyager 1 trajectory graphic — a complex web of arcs bending around Jupiter, then Saturn, then slingshotting into interstellar space. The host narrates: "Voyager 1 was launched in 1977 with a rocket that could not, by itself, reach the edge of the solar system in a human lifetime. But today, Voyager 1 is more than 23 billion kilometers from Earth — in interstellar space — and it got there in 35 years. How?" A speed readout appears on screen: Voyager's launch speed vs. its current speed. Launch: ~15 km/s relative to Earth. Current: ~17 km/s relative to the Sun. "It is moving faster now than when it left Earth, and its rocket engines have been off for decades." The host holds up a small marble and a large ball — "I'm going to show you right now with these that you can gain speed from something that doesn't touch you and doesn't burn fuel. And then we'll code the simulation from scratch." The marble bounces off the moving large ball and shoots away much faster. The hook is set.

## The Naive Attempt

The viewer sets up a two-body gravity simulation: a spacecraft dot (mass m = 1 kg) and a planet dot (mass M = 10^25 kg, effectively stationary for now). The spacecraft approaches the planet, gravity bends its trajectory, and it flies away. The viewer measures the spacecraft's speed before and after the flyby using `speed = sqrt(vx^2 + vy^2)`:

```javascript
const planet = { x: 400, y: 300, mass: 1e25, vx: 0, vy: 0 }; // stationary planet
const spacecraft = { x: 50, y: 200, mass: 1, vx: 8, vy: 1 };

// Measure speed before closest approach and after
const speed_before = Math.sqrt(spacecraft.vx**2 + spacecraft.vy**2);
// ... run simulation ...
const speed_after = Math.sqrt(spacecraft.vx**2 + spacecraft.vy**2);
```

With the planet stationary, the speed before and speed after are identical — the flyby is perfectly elastic (gravity is a conservative force). The trajectory bends dramatically, the direction changes, but the speed magnitude is exactly preserved. The host says: "With a stationary planet, gravity assists do nothing for speed. So why does Voyager go faster? Because Jupiter is not stationary."

## The Moment of Failure

The viewer adds Jupiter's orbital velocity: `planet.vx = -13000` m/s (Jupiter moves at ~13 km/s in its orbit). They rerun the simulation. Speed before flyby: 8,000 m/s. Speed after flyby: measuring... the host zooms in on the speed readout. It shows 21,000 m/s — nearly triple the initial speed. "We just extracted 13,000 m/s from thin air! Where did it come from?" The naive model has no conservation tracking, so the viewer cannot immediately explain why the speed tripled. The failure here is conceptual: the student's model has no energy accounting. The simulation appears to violate conservation of energy — which it does not, but without tracking the planet's energy change, it looks like a free lunch. The host marks this as the key mystery to resolve.

## Why It Broke — The Physics

A gravity assist works by exploiting the relative motion between the planet and the Sun. In the planet's rest frame, the encounter is elastic: the spacecraft approaches with speed v_rel, gravity bends the trajectory, and it departs with the same speed v_rel in the planet's frame. No energy gain in the planet's frame. But the planet is moving relative to the Sun. To convert from the planet's frame to the Sun's frame, you add the planet's velocity vector. Depending on the geometry of the flyby, the sun-frame departure velocity can be significantly higher or lower than the approach velocity.

The mathematical picture: let V_p = planet velocity in Sun frame; v_in = spacecraft velocity in Sun frame before flyby. In the planet's frame, the spacecraft approaches with v_rel = v_in − V_p, bends through gravity, and departs with the same speed |v_rel| but in a different direction. Converting back to the Sun frame: v_out = v_rel_out + V_p. If the flyby geometry is chosen so that v_rel_out points in the same direction as V_p, the two velocities add constructively and v_out > v_in.

Energy conservation in the Sun frame: the spacecraft gains kinetic energy, and Jupiter loses exactly that much kinetic energy. But Jupiter's mass is so enormous (~1.9 × 10^27 kg) that losing a tiny kinetic energy causes an immeasurably small change in its speed — on the order of 10^-23 m/s. From Jupiter's perspective, nothing happened. From the spacecraft's perspective, enormous energy gain. This is not a free lunch — it is a very favorable energy loan that Jupiter will never notice being repaid.

Momentum is also transferred: the spacecraft's momentum increases; Jupiter's decreases by the same vector amount. Again, the effect on Jupiter is negligible due to its mass.

## The One Concept

A **gravity assist** (also called a slingshot maneuver or gravitational slingshot) is a trajectory technique in which a spacecraft uses the gravity and motion of a planet to alter its speed and direction without consuming propellant. The physics is entirely Newtonian — there is no exotic science involved.

In the planet's reference frame, the encounter is equivalent to an elastic collision: the spacecraft arrives with some relative speed, curves around the planet under gravity, and departs with the same relative speed (magnitude) in a new direction. Gravity does no net work in a closed orbit because the force is conservative — the spacecraft falls toward the planet, gaining speed, then climbs away, losing exactly that speed. Speed in = speed out (in the planet's frame).

In the Sun's frame, the planet is moving. The coordinate transformation between the planet's frame and the Sun's frame (adding the planet's velocity vector) changes the magnitude of the spacecraft's velocity. The direction of the departure velocity in the planet's frame, combined with the planet's motion direction, determines whether the spacecraft gains or loses speed in the Sun's frame. A prograde flyby (where the spacecraft swings behind the planet in the direction of the planet's motion) adds speed. A retrograde flyby (swinging in front of the planet, against its motion) removes speed — this is used for deceleration, as done by the Cassini mission to slow down enough to enter Saturn's orbit.

Historical use: Pioneer 10 and 11, Voyager 1 and 2 (Jupiter, Saturn, Uranus, Neptune), Galileo (Venus and Earth twice before Jupiter), Cassini (Venus twice, Earth, Jupiter before Saturn), New Horizons (Jupiter before Pluto). Without gravity assists, most outer solar system missions would require impractically large rockets or decades more of flight time.

Maximum speed gain formula (for an idealized prograde flyby, head-on approach): Δv ≈ 2·V_p · (v_rel / (v_rel + V_esc)) — where V_esc is the escape velocity from the planet's surface. The higher the planet's orbital speed and the lower the spacecraft's approach speed relative to the planet, the larger the potential speed gain.

## The Fix

Add planet velocity and track energy in the Sun frame:

```javascript
const planet = { x: 400, y: 300, mass: 1e25, vx: -13000, vy: 0 };

// Energy accounting
function kineticEnergy(obj) {
  return 0.5 * obj.mass * (obj.vx**2 + obj.vy**2);
}

function gravPotentialEnergy(sc, pl) {
  const G = 6.674e-11;
  const r = Math.sqrt((sc.x-pl.x)**2 + (sc.y-pl.y)**2);
  return -G * sc.mass * pl.mass / r;
}

// Display total system energy at each frame
const E_total = kineticEnergy(spacecraft) + kineticEnergy(planet) + gravPotentialEnergy(spacecraft, planet);
ctx.fillText(`Total system energy: ${E_total.toExponential(3)} J`, 10, 30);
// This stays constant throughout — energy IS conserved
```

The host shows that E_total is constant throughout the flyby even though the spacecraft's KE changed dramatically. Jupiter's KE changed by the exact negative amount.

## The Wow Moment — Push It

The host builds a multi-flyby trajectory planner. The simulation shows the inner solar system to Saturn. The viewer places a spacecraft at Earth's position and fires it with a rocket (limited budget in Δv). They then select Jupiter as the first flyby, tweak the approach angle, and watch the speed readout after the flyby. Then they select Saturn for a second flyby. The total trajectory from Earth to Saturn unfolds in real time, with speed at each point color-coded on the trail (blue = slow, red = fast). A "fuel cost" meter shows the total Δv spent on rocket burns — with the gravity assists, the viewer achieves Saturn orbit on 1/3 the fuel that a direct flight would require. Adding an optional Uranus approach after Saturn produces the Voyager 2 "grand tour" — all four outer planets visited on a single trajectory.

## The Interactive Demo

- **Planet velocity slider** — −20 km/s to +20 km/s; controls the planet's motion in the Sun frame
- **Approach direction slider** — 0° to 360°; controls the flyby geometry (prograde vs. retrograde approach)
- **Closest approach distance slider** — 1 to 20 planet radii; changes the bend angle of the flyby
- **Spacecraft initial speed slider** — 1 to 20 km/s relative to Sun
- **Show planet-frame view toggle** — switches to the planet's frame, showing constant speed before and after
- **Show energy tracking** — live KE readout for spacecraft, planet, and total system
- **Multi-planet mode** — unlock Jupiter and Saturn sequentially for multi-flyby trajectory design

## Production Notes

Open with the real NASA Voyager trajectory visualization. Animate the trajectory slowly, pausing at each planet flyby with a speed annotation. Cut to the marble-and-ball demonstration — this physical analogy is compelling before any code. At the reference-frame explanation, use a split-screen: left panel is the Sun frame showing speed gain; right panel is the planet frame showing constant speed. Both update simultaneously. For the energy tracking, use a bar chart that stays level throughout — visually proving conservation. For the wow moment, use a dark space background with the planets as glowing dots and the trajectory as a bright white line with a speed colormap applied.

## Tags
`orbital-mechanics` `gravity-assist` `reference-frames` `momentum-transfer` `spacecraft` `energy` `canvas` `beginner`

## Thumbnail

Voyager-style spacecraft trajectory curving around a large orange Jupiter-like planet, with a sharp speed increase arrow before and after. The "before" label shows "8 km/s" in blue; the "after" label shows "21 km/s" in gold. Bold text: **"FREE SPEED."** Subtext in white: "How Voyager cheated physics (and didn't)." The dramatic speed numbers create the stop-scroll tension.
