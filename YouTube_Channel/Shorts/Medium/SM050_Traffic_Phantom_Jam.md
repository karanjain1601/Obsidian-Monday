---
title: "Traffic Cellular Automaton — Phantom Jam"
id: SM050
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, traffic-flow, cellular-automaton, emergence, phantom-jam]
---

> **What it is:** A ~45-second simulation short where one small brake tap on a circular road cascades backward through 50 cars, spawning a stop-and-go phantom jam that travels opposite to traffic flow — an emergent density wave arising from just four Nagel-Schreckenberg cellular automaton rules. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Traffic Cellular Automaton — Phantom Jam

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A circular road with 50 cars — top-down view. Cars flow smoothly. One car brakes slightly. The brake ripple propagates BACKWARD through traffic, amplifying — within 3 seconds a stop-and-go phantom traffic jam has formed that travels backwards against the direction of traffic flow.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Nagel-Schreckenberg cellular automaton (CA) model: road divided into cells; each cell is either empty or occupied by a car with speed v ∈ {0,1,2,...,v_max}. Rules per step: (1) accelerate: v → min(v+1, v_max); (2) brake: v → min(v, gap); (3) randomise: v → max(v-1, 0) with prob p; (4) move: advance v cells. Caption: "4 rules. Emergent traffic."

**0:10–0:18** — Space-time diagram: horizontal axis = position on road (0 to L), vertical axis = time. Cars shown as blue dots. Jam shown as a dense backward-propagating diagonal stripe (slope = jam propagation speed ~ -15 km/h). Caption: "Jam moves BACKWARD at -15 km/h."

**0:18–0:27** — Density phase diagram: car density ρ on x-axis, flow rate q on y-axis. Fundamental diagram: q = ρ·v_avg. At low density: free flow (linear). At high density: jammed (linear decrease). The maximum flow (capacity) at ρ ≈ 0.25. Caption: "Fundamental diagram of traffic flow."

**0:27–0:36** — Self-healing: after the jam passes each car and they accelerate, the jam dissolves naturally — only to reform elsewhere. Circular road: jam cycles around the ring indefinitely. Caption: "The jam is a stable wave — no crash needed."

**0:36–0:45** — Connection: these backward-propagating "jamitons" are mathematically identical to detonation waves in combustion. Caption: "Jamiton = traffic detonation wave." Bold text: "Phantom traffic jams — no accident required." Fade to black.

## Physics Concept Teased
Nagel-Schreckenberg traffic CA: four simple rules on a 1D lattice reproduce real traffic behaviour — free flow, phase transitions to jamming, backward-propagating stop-and-go waves. The jams are emergent density waves that travel against traffic at ~15 km/h, identical in mathematics to detonation shock waves (Jamitons).

## On-Screen Text / Captions
- **0:00** — "No accident. A jam forms anyway."
- **0:05** — "Nagel-Schreckenberg CA: 4 rules"
- **0:12** — "Jam propagates backward at -15 km/h"
- **0:20** — "Fundamental diagram: q vs ρ"
- **0:28** — "Jam cycles around the ring — stable wave"
- **0:35** — "Jamiton = traffic detonation wave"
- **0:43** — "Phantom jams — pure emergence."

## End Card
Final 3 seconds: circular road with the phantom jam visible as a slow backward-moving cluster. Text: "MIT 2008 ring-road experiment proved phantom jams are real — no accident." CodedLaws logo.

## Audio
Rhythmic, driving electronic (90 BPM). Car engine sounds (accelerating, braking). Brake sound effect when the first jam event occurs. Voiceover at 0:00: "Traffic jams can form without any accident — one random braking event cascades backward through the whole stream." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (circular road or linear road). Key algorithm: Nagel-Schreckenberg model on a ring of L=200 cells, N=50 cars (density ρ=0.25). Each step: apply 4 NS rules. Space-time diagram: draw a 2D array, one row per time step, one column per cell. Color: empty = black, car coloured by speed (slow=red, fast=blue). Space-time diagram reveals the backward-propagating jam stripe. Fundamental diagram: run many simulations at different densities, measure average flow, plot. Runtime: real-time, trivially fast.
