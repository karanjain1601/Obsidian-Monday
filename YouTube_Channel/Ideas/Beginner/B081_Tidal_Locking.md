---
title: "Why We Only Ever See One Face of the Moon (Tidal Locking)"
id: B081
difficulty: 2.5/10
prereq: "B017_Orbital_Mechanics"
concept: "Tidal torque from Earth on the Moon's slight non-spherical shape dissipates energy, slowing the Moon's rotation until it matches its orbital period; then the torque vanishes — stable tidal lock."
tags: [orbital-mechanics, tidal-locking, moon, rotation, torque, tidal-forces, canvas, beginner]
category: beginner
type: video-idea
---

# Why We Only Ever See One Face of the Moon (Tidal Locking)

**Alt title:** "The Moon Is Falling — And That's Why You Never See Its Back"
**Difficulty:** 2.5/10 | **Prereq:** B017_Orbital_Mechanics

---

## Opening Hook (0:00–1:00)

The video opens on a slow pan of the near-side of the Moon: the familiar seas, craters, and the unmistakable Man in the Moon. A bold caption reads "You have been looking at the exact same face your entire life." Then the camera cuts to a simulation: a small gray Moon orbiting a blue Earth on a dark Canvas. A bright red arrow marks one feature on the Moon's surface. As the Moon orbits, the arrow always points at Earth — the Moon rotates exactly once per orbit, and you can see that the same hemisphere is perpetually presented to the viewer. This looks almost too tidy to be coincidence. The host asks: "If we never pushed the Moon into this configuration, and never programmed it, why on earth — literally — does this happen on its own? The answer is something called tidal locking, and billions of years of very patient physics."

## The Naive Attempt

The viewer builds a simple two-body orbital sim in JavaScript Canvas. They place Earth at the canvas center, compute gravitational acceleration `F = GM/r²` toward Earth, and update the Moon's position with a simple Euler integrator. For rotation, they let the Moon spin freely with an initial angular velocity `omega = 0.5 rad/s` — deliberately different from its orbital angular velocity. They draw the Moon as a slightly elongated ellipse (not a circle) to represent the bulge. They run the sim and mark one end of the ellipse with a red dot. The code is roughly:

```js
// Moon state
let theta = 0; // orbital angle
let moonSpin = 0.5; // spin angular velocity (rad/s), decoupled from orbit
// Each frame:
theta += orbitalOmega * dt;
moonSpin += 0; // no torque yet — spin never changes
moonAngle += moonSpin * dt;
```

The Moon orbits beautifully, but its red dot spins independently. The viewer can already sense the problem.

## The Moment of Failure

When the viewer runs this sim, the red marker on the Moon's surface spins freely and shows every face to Earth equally — the near side, far side, poles, all visible. This is simply wrong: in reality only one face is ever visible. More subtly, the simulation shows that if you start with the wrong spin rate, the system just stays wrong forever. There is no restoring force, no dissipation, no tendency to fall into the locked state. Physics clearly wants to do something the code is missing.

## Why It Broke — The Physics

The key is that the Moon is not a perfect sphere. Earth's gravity pulls harder on the nearer side of the Moon than the farther side, creating a differential force called the **tidal force**. This stretches the Moon into a prolate shape — a bulge pointing toward Earth. If the Moon's spin and orbit are not synchronized, this tidal bulge is always trying to realign with Earth, but the Moon's spin drags it ahead or behind. The misaligned bulge experiences a gravitational torque from Earth that either speeds up or slows down the Moon's spin. The key equation is the tidal torque magnitude:

**τ = −(3GM²R⁵k₂)/(2a⁶) · sin(2ε)**

where `a` is the Earth-Moon distance, `R` is Moon's radius, `k₂` is the Love number (deformability), and `ε` is the angle between the tidal bulge axis and the Earth-Moon line. When the Moon rotates faster than its orbit, `ε > 0`, `τ < 0`, and the spin slows. When they match, `ε = 0`, `τ = 0` — equilibrium.

## The One Concept

**Tidal locking** is the end state of a process called despinning by tidal dissipation. Here is the full picture. Gravity is not uniform — it falls off as `1/r²`, so the near side of any extended body feels a stronger pull than the far side. The differential pull across the body is the tidal force. For a deformable body like the early Moon (which was partially molten), this differential force physically deforms the body into a prolate spheroid — an American-football shape — with the long axis pointing toward the source of gravity. If the Moon's spin rate differs from its orbital rate, its long axis is not perfectly aligned with Earth. Earth's gravity then pulls on the misaligned near-bulge harder than it pulls on the far-bulge, creating a net torque about the Moon's spin axis. This torque acts to align the bulge with the Earth-Moon line. The energy dissipated during the realignment (internal friction in rock, historically in a molten interior) is converted to heat, and the rotational kinetic energy of the Moon decreases. Over roughly one billion years, this torque slowed the Moon's original spin (probably 10–20 hours/day) all the way down to the 27.3-day period that matches its orbit. Once locked, ε = 0, torque = 0, and no further despinning occurs. The same process is happening to Earth — in the far future, Earth will tidally lock to the Moon (though the Sun will expand before that). Pluto and Charon are mutually tidally locked: each shows one face to the other. Many exoplanets in tight orbits around red dwarf stars are expected to be tidally locked — one side in permanent day, one in permanent night.

## The Fix

The fix is to add the tidal torque to the Moon's angular momentum each time step. In code:

```js
// angle between tidal bulge and Earth-Moon line
let epsilon = moonAngle - theta; // bulge lag/lead angle
let tidalTorque = -tidalK * Math.sin(2 * epsilon);
moonOmega += (tidalTorque / momentOfInertia) * dt;
moonAngle += moonOmega * dt;
```

The constant `tidalK` encodes `3GM²R⁵k₂/(2a⁶)` and is tuned for visual effect. With this single addition, the Moon's spin rate evolves. Starting from `moonOmega = 0.5`, it exponentially decays toward the orbital angular velocity. The red dot on the Moon's surface drifts, oscillates, and finally locks — always facing Earth.

## The Wow Moment — Push It

After demonstrating tidal lock, the viewer can click to "perturb" the Moon, giving it a sudden kick in spin. The Moon rocks back and forth around the locked state — these are real **librations**, the slight wobble we observe from Earth. The sim shows that after a perturbation, the Moon oscillates but is pulled back, exactly like a torsional pendulum. Add in true orbital eccentricity and the viewer sees the Moon rock by ±7° in longitude even in the locked state, which is why we can actually see about 59% of the Moon's surface over a full month despite tidal locking.

## The Interactive Demo

- **Moon initial spin rate** — slider from 0 to 5 × orbital rate (start at 2×)
- **Tidal coupling strength (k₂)** — slider from 0 (rigid) to 1 (very soft), scales how fast locking occurs
- **Orbital eccentricity** — slider from 0 to 0.3, reveals libration once locked
- **Perturb Moon spin** — button that delivers an impulse to the Moon's spin, showing recovery
- **Show tidal bulge arrow** — toggle that draws the elongated shape and the misalignment angle ε
- **Speed multiplier** — 1×, 10×, 100× time

## Production Notes

Open on a real NASA photo of the lunar near side, then cut to the Canvas sim. Always display: (1) the tidal bulge as a stretched ellipse on the Moon, (2) a green arc showing orbital angle θ, (3) a red arc showing spin angle φ, and (4) a small angle-difference readout labeled "ε (bulge lag)." When the Moon locks, both arcs should visibly merge and a bold "LOCKED" badge should appear. Animate the torque as a curved blue arrow on the Moon that shrinks to zero as ε → 0. Include a zoomed inset showing Earth's near-tidal-bulge and far-tidal-bulge in different force colors.

## Tags
`orbital-mechanics` `tidal-locking` `moon` `rotation` `torque` `tidal-forces` `canvas` `beginner`

## Thumbnail

Close-up split image: left half shows the familiar near side of the Moon, right half shows a blank gray hemisphere labeled "NEVER SEEN." A bold red arc bisects the two halves. Text overlay at bottom: "Why Only ONE Face?" Background is deep black. The split-face design is immediately intriguing and visually clean at small thumbnail sizes — the stark asymmetry is the stop-scroll moment.
