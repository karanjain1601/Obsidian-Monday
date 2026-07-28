---
title: "Mass vs. Weight: Why the Astronaut Scale Shows Zero"
id: B071
difficulty: 1.5/10
prereq: "None"
concept: "Mass m = inertia (intrinsic, location-independent); weight W = mg (gravitational force, location-dependent); in free fall, apparent weight = 0 because everything falls together"
tags: [mechanics, mass, weight, gravity, free-fall, inertia, canvas, beginner]
category: beginner
type: video-idea
---

# Mass vs. Weight: Why the Astronaut Scale Shows Zero

**Alt title:** "Your Scale Lies to You — Here's the Physics Proof"
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The video opens on a split screen: on the left, a bathroom scale with a person standing on it reading 70 kg on Earth; on the right, an astronaut floating inside the International Space Station stepping onto an identical scale — it reads zero. The viewer's instant reaction is "of course, there's no gravity up there" — but that assumption is immediately challenged. A bold text overlay reads: "The ISS orbits at 400 km altitude. Earth's gravity there is still 88% as strong as on the surface." The host voice-over asks: "If gravity barely changed, why does the scale read zero?" Then a third panel appears: the same person from the left panel, now inside a falling elevator, still standing on the scale — it reads zero too. The hook closes with the question that drives the whole video: "Mass and weight are not the same thing. One of them is always with you. The other one can vanish entirely — and understanding why changes how you think about gravity forever."

## The Naive Attempt

The viewer opens a blank HTML canvas file. The host walks through setting up a simple simulation: draw a circle (the person), draw a rectangle (the scale), and display a number labeled "Weight." The first version simply hardcodes `weight = mass * 9.8` and prints it to the canvas. The code reads:

```javascript
const mass = 70; // kg
const g = 9.8;   // m/s²
const weight = mass * g; // 686 N

ctx.fillText(`Weight: ${weight.toFixed(1)} N`, 200, 100);
ctx.fillText(`Mass: ${mass} kg`, 200, 130);
```

The viewer runs this and sees 686 N on screen. The host then says: "Now let's move our person to the Moon. I'll just change g to 1.62." The viewer changes one line and reruns — weight drops to 113 N, mass stays 70 kg. This immediately shows mass is fixed while weight varies. The host adds a slider for altitude and computes `g(h) = 9.8 * (6371/(6371+h))^2` so the viewer can drag altitude from 0 to 1000 km and watch weight change continuously while mass stays locked.

## The Moment of Failure

The host says: "Now let's simulate the ISS. Set altitude to 400 km." The viewer drags the slider — weight drops to about 600 N, not zero. The simulation shows the astronaut standing on a scale reading approximately 600 N. The viewer is confused. The scale on the real ISS reads zero, but the simulation says gravity is still very much present. The visual glitch isn't a code bug — it's a conceptual bug. The simulation is computing the true gravitational force correctly, but it has no concept of the scale reading versus the actual gravitational pull. The number on screen is real; the disconnect is that the number is not what a scale measures.

## Why It Broke — The Physics

A scale does not measure gravitational force directly. A scale measures the **normal force** it must exert upward to keep you stationary relative to itself. On Earth's surface, your feet push down on the scale with force W = mg, the scale pushes back up with N = mg, and since you're not accelerating, N = W. The scale reading equals your gravitational weight. But inside a freely falling system — an orbiting station, a plummeting elevator — both you and the scale are accelerating downward at the same rate g. The scale never needs to push up on you because you're not pressing into it. The normal force is zero. This is the definition of **apparent weight**: `W_apparent = m(g - a)`, where a is the acceleration of your reference frame. In free fall, `a = g`, so `W_apparent = 0`. Key equation:

**W_apparent = m(g − a_frame)**

The ISS is in free fall — it just has enough horizontal velocity that it keeps missing Earth. The astronaut is weightless because both she and the scale fall together, not because gravity disappeared.

## The One Concept

**Mass** is the measure of an object's inertia — its resistance to changes in velocity. It is an intrinsic property of matter, encoded in the amount of matter present. Mass does not depend on location, gravitational field strength, or state of motion. A 70 kg person has 70 kg of mass on Earth, on the Moon, in deep space, and inside a falling elevator. The SI unit is the kilogram. Mass is what makes it hard to push a shopping cart. A more massive cart requires more force to achieve the same acceleration — this is Newton's second law: F = ma.

**Weight** is something entirely different. Weight is the gravitational force that a planet (or any massive body) exerts on an object. It is computed as W = mg, where g is the local gravitational field strength at that position. On Earth's surface g ≈ 9.8 m/s², on the Moon g ≈ 1.62 m/s², on Mars g ≈ 3.72 m/s². Weight has units of Newtons (force), not kilograms (mass). Saying someone "weighs 70 kg" is technically an abuse of language — they have a mass of 70 kg and a weight of 686 N on Earth's surface.

**Apparent weight** is what a scale actually reads. It is the contact force between you and whatever surface you stand on. In everyday life on Earth's surface, apparent weight equals true weight because you are in static equilibrium. But in any accelerating reference frame the two diverge. In an elevator accelerating upward at 2 m/s², your apparent weight is `m(g + a) = 70 × 11.8 = 826 N` — you feel heavier. In free fall, apparent weight is zero — you feel completely weightless even though gravity has not switched off. Real-world examples: astronauts on the ISS, skydivers in terminal velocity (not weightless because drag acts), passengers on a roller coaster at the top of a loop, and the famous "vomit comet" aircraft that flies parabolic arcs to produce 20–30 seconds of microgravity for training.

## The Fix

Add a boolean `inFreefall` and a computed `acceleration_of_frame` variable to the simulation. The scale display now uses `W_apparent = mass * (g - a_frame)`:

```javascript
const g = 9.8 * Math.pow(6371 / (6371 + altitude_km), 2);
const a_frame = inFreefall ? g : 0;
const W_apparent = mass * (g - a_frame);

ctx.fillText(`Gravitational Weight: ${(mass * g).toFixed(1)} N`, 200, 100);
ctx.fillText(`Scale Reads (Apparent): ${W_apparent.toFixed(1)} N`, 200, 130);
```

When `inFreefall` is toggled on, the scale display drops to 0 N while the gravitational weight line still shows the real force. Two separate numbers, clearly labeled, show the distinction on screen.

## The Wow Moment — Push It

The host extends the demo to show a full orbit simulation. The person-dot is placed in a circular orbit around an Earth graphic. As it orbits, the scale always reads zero. Then the host adds a thrust: the spacecraft fires a brief engine burn, giving the frame an acceleration upward. Instantly the scale reading jumps to a positive value during the burn — the astronaut briefly feels gravity again — then returns to zero as the engine cuts off. Finally, the host adds a retrograde burn that sends the spacecraft into a decaying orbit. As the spacecraft spirals inward and atmospheric drag starts to apply a force, the scale reading ticks up from zero, simulating the faint "weight" astronauts feel during reentry. The final visual is a plot of apparent weight vs. time throughout the full orbital maneuver.

## The Interactive Demo

- **Mass slider** — 10 kg to 200 kg (default 70 kg); updates both weight displays in real time
- **Altitude slider** — 0 to 1000 km; updates g(h) and shows how gravitational weight changes with altitude
- **Planet selector** — dropdown: Earth / Moon / Mars / Jupiter; sets appropriate g₀
- **Free-fall toggle** — ON/OFF button; sets a_frame = g, dropping scale reading to zero
- **Frame acceleration slider** — −20 to +20 m/s² (negative = free-fall-like, positive = elevator-up); continuously updates apparent weight
- **Show both values checkbox** — splits display to show true weight and apparent weight side by side

## Production Notes

Open with the split-screen hook using a pre-recorded video clip of a scale being weighed, edited together with NASA ISS footage. Cut to code editor at 1:00. Zoom in on the single line `weight = mass * g` when introducing it. When the altitude slider is introduced, animate a smooth drag of the slider while the weight number ticks down on screen — show this in real time, not as a fast cut. At the conceptual physics section, switch to an animation: a person standing on a scale inside a transparent elevator box, with force arrows. Show a red arrow down (gravity) and a green arrow up (normal force). In free fall, the green arrow disappears while the red stays — the red arrow is gravity; the scale reads the green arrow. Return to code for the fix. For the orbital demo, fullscreen the canvas and dim the code pane. Use a slow, smooth orbit animation. Add soft background music during the wow moment.

## Tags
`mechanics` `mass` `weight` `gravity` `free-fall` `inertia` `canvas` `beginner`

## Thumbnail

Astronaut in a spacesuit standing on a bathroom scale inside the ISS, scale display clearly showing "0 kg." On the left half of the thumbnail, a bold split: Earth side shows same person on same scale reading "70 kg." Text overlay in large bold white font: **"WHY ZERO?"** with a red arrow pointing at the scale. Subtext in yellow: "Gravity is still 88% here." Background: deep blue-black space with Earth's curvature visible. The contrast between the "70" and the "0" is the visual drama — both scales must be clearly readable at thumbnail size.
