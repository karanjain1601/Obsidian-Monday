---
title: "Hall Thruster — ExB Drift Propulsion"
id: SM102
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Electric_Propulsion_Full]]"
difficulty: medium
tags: [physics, simulation, short, plasma, propulsion, spacecraft, electromagnetism]
---

> **What it is:** A ~45-second simulation short showing electrons trapped in azimuthal ExB drift inside an annular thruster channel while xenon ions accelerate axially and exit as a high-speed ion beam, demonstrating electrostatic propulsion without combustion. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Electric_Propulsion_Full]]

# Short: Hall Thruster — ExB Drift Propulsion
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A glowing annular ring — the cross-section of a Hall thruster channel — blazes blue-violet on screen. Electrons spiral in tight helical circles, trapped by crossed electric and magnetic fields. Then xenon ions accelerate straight through the channel and shoot off the right edge as a brilliant white ion beam.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Cutaway schematic of Hall thruster: annular ceramic channel (grey), anode (left, gold), external cathode (right, silver). Radial B-field lines shown in teal curves arching across the channel. Axial E-field arrows in red pointing left (toward anode).
- **0:10–0:18:** Electron drift visualization — a single electron enters, hits the crossed E×B fields, and gyrates in tight circles while drifting azimuthally (into/out of screen) — the Hall drift. Drift velocity v = E×B/B² label appears. Trace path shown in electric blue helix.
- **0:18–0:28:** Xenon atoms (grey spheres) injected from the anode side. Electron impact ionization event shown as a brief flash: electron hits neutral, produces ion (orange) and secondary electron. Ion count builds up rapidly.
- **0:28–0:38:** Xenon ions, much heavier than electrons, are barely affected by B; they shoot straight through the axial E-field and accelerate out of the thruster. Exhaust plume expands as a brilliant white/blue cone. Specific impulse Isp ~ 1500–3000 s label appears.
- **0:38–0:45:** Side view of the full thruster firing. Ions exit at ~20 km/s. Thrust force vector arrow appears. Efficiency label: η ~ 60%. Scale comparison: the ring is about the size of a coffee cup.

## Physics Concept Teased
In a Hall thruster, a radial magnetic field traps electrons in azimuthal ExB drift, making them orbit the channel instead of reaching the anode. This creates a dense plasma that ionizes propellant. Ions, too heavy to be magnetized, accelerate through the axial electric field — efficient, electrostatic propulsion without a physical nozzle.

## On-Screen Text / Captions
- **0:00:** "The engine that powers satellites — no fuel combustion."
- **0:08:** "B radial. E axial. Electrons trapped."
- **0:15:** "ExB drift → electrons orbit forever"
- **0:22:** "Xenon ionized by trapped electrons"
- **0:30:** "Ions escape at 20 km/s"
- **0:38:** "Isp ~ 2000 s | η ~ 60%"
- **0:44:** "Your GPS satellite is powered this way."

## End Card
Final 3 seconds: slow pan across the exhaust plume glowing blue-white on black. Text: "Electric propulsion changed spaceflight." Channel logo bottom-right.

## Audio
Clean, spacey ambient synth pad — quiet, futuristic. Voiceover (calm, precise): "No combustion. Just crossed fields, trapped electrons, and ions flung into space." High-frequency electric hum sound effect during thruster operation. Soft whoosh as ion beam exits at 0:30.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D particle simulation + static schematic overlay. Key algorithm: Boris particle pusher for electron trajectories in static E and B fields (E = E_z ẑ, B = B_r r̂). Particle count: ~500 electrons (full gyration visible), ~200 ion tracers. Ion motion: simple axial acceleration under E-field, ignore magnetic force (heavy ion approximation). Gotcha: electron gyroradius is tiny (~mm scale) — must scale simulation for visibility or use schematic arrows instead of actual-scale orbits. Use additive blending for plasma glow effect.
