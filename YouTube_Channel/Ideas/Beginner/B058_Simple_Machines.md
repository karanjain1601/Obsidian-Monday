---
title: "Lever, Pulley, Inclined Plane: All Simple Machines in One Demo"
id: B058
difficulty: 2/10
prereq: "B007"
concept: "Mechanical advantage MA = output force / input force; lever MA = d_effort/d_load, pulley MA = rope segments, inclined plane MA = L/h"
tags: [mechanics, simple-machines, mechanical-advantage, lever, pulley, inclined-plane, canvas, beginner]
category: beginner
type: video-idea
---

# Lever, Pulley, Inclined Plane: All Simple Machines in One Demo

**Alt title:** "Six Simple Machines, One Universal Law"
**Difficulty:** 2/10 | **Prereq:** B007

---

## Opening Hook (0:00–1:00)

The screen opens on an ancient Egyptian pyramid construction scene — animated in a clean, minimal canvas style — showing workers dragging an enormous stone block. Three machines appear labeled on screen: a lever lifting the block, a pulley redirecting ropes, and an inclined plane (ramp) along which the stone slides. The host pauses the animation and zooms into each machine's force arrow. In every case, the output force is far greater than the input force. The host then says: "Every single simple machine — lever, pulley, inclined plane, wheel and axle, wedge, and screw — obeys the exact same universal law. Work in equals work out. The mechanical advantage is always just trading force for distance." Six machines. One principle. The viewer is promised a live Canvas simulation where all six simple machines are built and compared side by side.

## The Naive Attempt

The viewer starts with the lever — the simplest machine. Step one: draw a horizontal beam pivoting on a triangular fulcrum at the center. Step two: place a heavy load on the left end and an effort force arrow on the right end. Step three: naively compute the output force as simply `F_out = F_in + MA_bonus` where `MA_bonus` is a constant the viewer picks — incorrectly thinking mechanical advantage adds extra force from nowhere. Step four: display the work done on each side as `W = F × d`. Step five: set `F_in = 10 N`, load mass = 100 kg, and expect the simulation to show equilibrium. Instead, the arbitrary MA_bonus formula gives inconsistent results that do not respect the torque balance condition, and the lever visually rotates when it should be still.

## The Moment of Failure

With the additive MA formula, the simulation shows the lever in static equilibrium at an angle of 5 degrees — visually tilted — when it should be perfectly horizontal. The torque on the left side (τ_left = F_load × d_load) does not equal the torque on the right (τ_right = F_effort × d_effort) because the MA_bonus was applied to the force but not derived from the geometry. The work display shows `W_in = 10 J` and `W_out = 18 J` — an 80% energy bonus that violates conservation of energy. The beam sits at the wrong angle with both force arrows displayed incorrectly. The fundamental mistake was not using torque balance to derive the mechanical advantage from geometry.

## Why It Broke — The Physics

Every simple machine embodies the same principle: conservation of energy (ignoring friction) means that work input equals work output: W_in = F_in × d_in = F_out × d_out = W_out. Mechanical advantage MA = F_out / F_in = d_in / d_out — you gain force at the cost of distance. For each simple machine:

**Lever:** Torque balance at fulcrum: F_in × d_effort = F_out × d_load. Therefore MA = d_effort / d_load. Moving the fulcrum closer to the load gives higher MA.

**Pulley (block and tackle):** Each rope segment supporting the load shares the weight equally. If n rope segments support the load, each bears F_load/n, so the input force is F_in = F_load/n and **MA = n** (number of supporting rope segments).

**Inclined plane:** A load of weight mg raised through height h by pulling it along a ramp of length L. Work: F_in × L = mg × h. Therefore **MA = L/h = 1/sinθ** where θ is the ramp angle. A 10° ramp gives MA ≈ 5.8.

**Wheel and axle:** MA = R_wheel / R_axle (steering wheels exploit this). **Wedge:** MA = length / width. **Screw:** MA = 2πr / pitch.

## The One Concept

A simple machine is any device that changes the direction or magnitude of a force using only rigid structures and no internal energy source. The Golden Rule of simple machines is: you never get more work out than you put in. What simple machines provide is mechanical advantage — the ability to apply a larger force over a smaller distance by trading it against a smaller force over a larger distance. This trade-off is universal and exact for ideal (frictionless) machines. Real machines have an efficiency η < 1 due to friction, calculated as η = W_out / W_in = (F_out × d_out)/(F_in × d_in). The six classical simple machines (lever, inclined plane, wedge, screw, pulley, wheel and axle) can all be analyzed as variations on the lever or inclined plane. An Archimedes screw, a bicycle derailleur, a car's transmission, a door handle — all are compound applications of these six primitives. The historical importance is immense: these machines enabled pyramid construction, Roman aqueducts, medieval siege engines, and the entire Industrial Revolution before the steam engine.

## The Fix

Replace the additive formula with proper torque balance for the lever:

```javascript
// Lever: torque balance
const d_effort = effortArmSlider.value;   // m
const d_load   = loadArmSlider.value;     // m
const MA_lever = d_effort / d_load;
const F_effort = F_load / MA_lever;

// Verify energy conservation
const d_effort_travel = 0.1;             // input displacement (m)
const d_load_travel = d_effort_travel * (d_effort / d_load);  // output displacement
const W_in  = F_effort * d_effort_travel;
const W_out = F_load   * d_load_travel;
// W_in === W_out (within floating point)
```

For pulleys: `MA = numberOfSupportingSegments` (count the rope segments attached to the movable block, not the fixed one). Draw each rope segment as a separate line with the segment count displayed.

## The Wow Moment — Push It

Build a compound machine: a block-and-tackle pulley (MA = 4) attached to the effort arm of a lever (MA = 3), giving a combined MA = 12. Show that lifting a 1,200 N load requires only 100 N of input force. Then animate an Atwood machine variant: two hanging masses connected over a pulley, released from rest, accelerating at a = (m₁ - m₂)g / (m₁ + m₂). Overlay a "machine efficiency" slider (0–100%) that introduces friction losses and shows how real MA_actual = η × MA_ideal.

## The Interactive Demo

- **Machine selector** (tabs): Lever / Pulley / Inclined Plane / Wheel & Axle / Wedge / Screw.
- **Lever: effort arm slider** (0.1–2 m): changes MA_lever live.
- **Lever: load arm slider** (0.1–2 m): fulcrum position control.
- **Pulley: rope segments selector** (1–8): integer count; MA display updates.
- **Inclined plane: ramp angle slider** (5°–60°): shows MA = 1/sinθ.
- **Load weight slider** (10–1000 N): drive the load magnitude.
- **Efficiency slider** (50–100%): introduces friction losses to all machines.
- **Work conservation display**: always shows W_in vs W_out as two side-by-side bars.

## Production Notes

Show all six machines simultaneously on a single wide-canvas layout — one per row — so the viewer can see them all at once and compare their MA values. When the load weight slider changes, all six machines update simultaneously, letting the viewer appreciate how differently each machine achieves the same MA. Use animated rope animations for the pulley (ropes that move as the load rises). Label every force arrow with its numerical value at all times. Include a "load weight = 1000 N" demo with a tiny 100 N input force to maximize the "wow" factor.

## Tags
`mechanics` `simple-machines` `mechanical-advantage` `lever` `pulley` `inclined-plane` `canvas` `beginner`

## Thumbnail

Six machine diagrams arranged in a 2×3 grid, each with force-in and force-out labeled. A large bold equation in the center: "W_in = W_out." Below it: "THE ONE LAW THAT RUNS ALL MACHINES." Retro blueprint aesthetic (white lines on dark blue background). The promise of unifying six seemingly different things under one law is the intellectual hook.
