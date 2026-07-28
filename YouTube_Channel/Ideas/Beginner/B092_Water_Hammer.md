---
title: "The Pressure Wave That Can Burst Pipes (Water Hammer)"
id: B092
difficulty: 2.5/10
prereq: "B051_Pressure_Fluids"
concept: "Joukowsky equation ΔP = ρcΔv; sudden valve closure launches a pressure wave that can reach 10× operating pressure"
tags: [fluids, water-hammer, pressure-wave, joukowsky, pipe-flow, hydraulics, canvas, beginner]
category: beginner
type: video-idea
---

# The Pressure Wave That Can Burst Pipes (Water Hammer)

**Alt title:** "Why Closing a Tap Too Fast Can Shatter Your Pipes"
**Difficulty:** 2.5/10 | **Prereq:** B051_Pressure_Fluids

---

## Opening Hook (0:00–1:00)

The screen shows a cross-section of a pipe rendered in cool blue — water flowing steadily from left to right, animated as a stream of small circular particles moving at a constant pace. In the right half of the pipe, a valve icon sits open. The host narrates: "Water is flowing through this pipe at 3 meters per second. Operating pressure: 5 bar. Everything is calm." Then, with a single mouse click, the valve snaps shut. In the next instant, a violent red shockwave explodes backward through the pipe from the valve, slamming into the water behind it. A pressure gauge in the corner spikes instantly from 5 bar to 52 bar — more than ten times the operating pressure. The pipe outline flashes red, and the word "FAILURE" appears in large letters. "This," the host says, "is called water hammer. It has collapsed industrial pipes, ruptured hospital plumbing, and famously contributed to the 1965 Texas Eastern natural gas explosion. And once you understand the physics, you will never slam a tap shut the same way again."

## The Naive Attempt

The viewer starts with a horizontal canvas pipe. Step one: draw a row of circular blue particles spaced evenly, all assigned a rightward velocity `vx = 3` pixels per frame. Step two: draw a rectangular valve block that can be toggled open or closed with a keypress. Step three: when the valve closes, set all particle velocities to zero in one frame — instantaneous stop. Step four: draw a pressure bar chart in the corner that reads the average particle compression as a proxy for pressure, defined as the inverse of the average inter-particle spacing. The host lets the simulation run: particles flow right, hit the closed valve, and stop. The pressure bar barely moves — it just shows a little pile-up at the valve end. The host says: "This is wrong. This model treats water as compressible in a trivially slow way. Watch what the real math predicts."

## The Moment of Failure

When the naive model's valve closes, the pile-up of particles at the valve end looks exactly like traffic backing up on a freeway — a slow, gradual compression that drifts backward at maybe two particles per frame. The pressure gauge climbs lazily from 5 to 7 bar and stops. A participant in the simulated comment section types: "But I measured 50 bar in my lab — why does your sim show 7?" The host circles the pressure gauge with a red marker: this is the wrong number by almost an order of magnitude. The naive model is treating water as if it were a crowd of people who all slow down gradually, rather than treating it as a nearly incompressible medium that transmits force at the speed of sound — 1480 meters per second in water. At that speed, the pressure signal traverses a 10-meter pipe in 6.7 milliseconds. The simulation is showing the wrong physics entirely.

## Why It Broke — The Physics

The Joukowsky equation, derived in 1898 by Nikolai Joukowsky (the same fluid dynamicist behind airfoil theory), gives the pressure rise from a sudden velocity change in a pipe:

**ΔP = ρ · c · Δv**

Where ρ is the fluid density (1000 kg/m³ for water), c is the wave speed in the pipe (≈1200–1480 m/s depending on pipe elasticity), and Δv is the change in fluid velocity. For a pipe flow at v = 3 m/s stopped instantaneously: ΔP = 1000 × 1200 × 3 = 3,600,000 Pa = 36 bar. Add to operating pressure of 5 bar: peak pressure = 41 bar. That is 8× operating pressure — enough to burst most residential copper pipe rated at 10–15 bar. The key insight is that the information about the valve closing travels at the acoustic wave speed, not at the flow velocity. Water barely compresses, so disturbances propagate almost instantaneously relative to the flow.

## The One Concept

Water hammer is a hydraulic transient — a pressure wave caused by a sudden change in fluid velocity in a confined pipe. When a valve closes in time Δt much less than the pipe's acoustic travel time L/c (called the "critical closure time"), the entire column of moving water cannot slow down gradually — it slams into the stopped water near the valve and the momentum is converted to pressure in accordance with Newton's second law applied to the fluid column. The Joukowsky equation ΔP = ρcΔv is the impulse-momentum theorem for fluid flow: the pressure impulse equals the rate of change of momentum per unit area. The wave then reflects off the far end of the pipe (either as a rarefaction wave if the far end is open, or another compression if it is a dead end) and bounces back and forth with decreasing amplitude due to friction and pipe elasticity, creating the characteristic "hammering" sound. Real engineering mitigation strategies include: slow-closing valves (extending Δt beyond L/c so the pressure rise is spread over time), surge tanks (open reservoirs connected to the pipe that absorb the pressure wave), air chambers (compressible air cushions that act as shock absorbers), and pressure relief valves. The 1965 Texas Eastern explosion was caused by water hammer-induced fatigue cracks in a gas pipeline. Water hammer also affects blood vessels — the "pulse pressure" felt in arteries is a mild hydraulic transient created by the heart valve closing.

## The Fix

Replace the instantaneous velocity zeroing with a pressure-wave propagation model. Maintain a 1D array of "cells," each storing pressure and velocity. Use the method of characteristics: when the valve closes, set a boundary condition `v[N] = 0` at the valve end. Each time step, propagate the pressure disturbance leftward at wave speed `c_wave = 1200` pixels-per-second scaled to simulation units. The pressure at each cell updates as `P[i] = P[i] + rho * c * (v[i] - v[i+1])`.

```javascript
const rho = 1000; // kg/m³
const c = 1200;   // wave speed m/s (scaled to px/frame in sim)
const dt = 0.016; // seconds per frame

for (let i = N - 1; i >= 0; i--) {
  if (valveClosed && i === N - 1) {
    // Joukowsky: velocity goes to zero, pressure spikes
    dP[i] = rho * c_scaled * velocity[i];
    velocity[i] = 0;
  } else {
    dP[i] = rho * c_scaled * (velocity[i] - velocity[i + 1]);
  }
}
for (let i = 0; i < N; i++) pressure[i] += dP[i];
```

Now the pressure gauge rockets to 41 bar instantly at the valve, and the red wavefront visibly races leftward through the pipe at high speed. The correct physics — and the correct terrifying number — appear on screen.

## The Wow Moment — Push It

The host enables a full reflection model where the wave bounces between the closed valve end and an open reservoir end (where the pressure boundary condition is P = P_atmospheric). The viewer watches the wave reflect as a rarefaction (negative pressure) that can pull the water column apart — a phenomenon called "column separation" that can cause cavitation and secondary hammer events. The host overlays a real oscilloscope-style plot of pressure vs. time at the valve, showing the characteristic staircase of decaying hammer spikes. Finally, the host scales up to a 500-meter industrial water main and lets the viewer observe the 0.4-second travel time (500/1200 s) before the first reflection arrives — a genuine engineering time constant.

## The Interactive Demo

- **Valve closure time slider** (range 0.001 to 2.0 seconds): shows the transition from full Joukowsky hammer at fast closure to near-zero hammer at slow closure, with the critical closure time L/c highlighted as a vertical marker
- **Flow velocity slider** (range 0.5 to 6 m/s): linearly scales the ΔP result, demonstrating the direct proportionality in the Joukowsky equation
- **Pipe length slider** (range 5 to 500 m): changes L/c and shows how longer pipes have longer hammer cycles
- **Pipe material dropdown** (steel, copper, PVC, concrete): changes the wave speed c based on pipe wall elasticity, with realistic values embedded
- **Open/closed far-end toggle**: switches between reflective boundary (dead end → double amplitude) and open reservoir (rarefaction return wave)

## Production Notes

The pipe should be rendered as a long horizontal rectangle with a gradient fill — darker blue at the center, lighter at the edges — to suggest depth. Particles should be small, fast, and numerous enough to look like flowing water. When the hammer wave fires, use a bright red advancing rectangle that visually sweeps leftward through the pipe, turning the water red behind it. Show a real-time pressure color map on the pipe: green for normal pressure, yellow for elevated, red for dangerous. The pressure gauge in the corner should have a red danger zone marked above 15 bar. Split-screen during the coding phase: editor left, simulation right.

## Tags

`fluids` `water-hammer` `pressure-wave` `joukowsky` `pipe-flow` `hydraulics` `canvas` `beginner`

## Thumbnail

Close-up of a blue pipe cross-section with a bright red shockwave visible inside it as a vertical glowing band. The pipe outline is cracked and glowing orange at the crack point. Text overlay: "10× PIPE PRESSURE — FROM CLOSING A TAP" in bold white on dark background. Bottom-right corner shows the equation ΔP = ρcΔv in yellow. The overall feeling is urgent and destructive — a thumbnail that makes any homeowner or engineer immediately curious.
