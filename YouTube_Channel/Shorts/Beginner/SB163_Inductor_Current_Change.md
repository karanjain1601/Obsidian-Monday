---
title: "Inductors Fight Against Change"
id: SB163
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, electromagnetism, inductor, inductance, RL-circuit]
---

> **What it is:** A ~45-second simulation short where current ramps up slowly through a glowing copper coil as expanding blue magnetic field rings push back, then a brilliant arc sparks across the switch gap when the circuit is broken, revealing back-EMF and inductive energy storage. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Inductors Fight Against Change
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A coil of wire (copper-colored, glowing) sits in a circuit. A switch closes — but instead of current jumping to its final value instantly, it ramps up SLOWLY over 2 seconds, while a growing magnetic field (blue field lines expanding outward from the coil) opposes the change. Then the switch opens — and a spark arcs across the gap with a brilliant white flash.

## Main Visual Sequence (0:03–0:50)
**0:03** — RL circuit: 12V battery (gold), switch (open), R = 10Ω resistor, L = 100mH inductor (copper coil, 5 turns visible). Time constant: τ = L/R = 0.01s. Current meter reads 0A. Magnetic field lines around coil: absent.

**0:10** — Switch closes. Current begins to ramp up. Coil generates growing magnetic flux (blue field lines expanding outward in rings around coil). Back-EMF arrow shown (orange, opposing battery EMF): ε_L = −L·dI/dt. Current: I(t) = (V/R)·(1 − e^(−Rt/L)).

**0:18** — At t = τ = 10ms: current = 63% of I_final = 0.63 × (12/10) = 0.756A. At t = 5τ = 50ms: I = 1.2A (final). Magnetic field fully developed — glowing blue field lines dense around coil. Label: "Energy stored in field: E = ½LI² = 72 mJ."

**0:27** — Switch opens suddenly. Current cannot stop instantly — inductor fights: "I won't let current change!" But the circuit path is broken. Result: HUGE back-EMF spike (L·dI/dt with very large dI/dt). Voltage spike shown: 1000V+ spike (orange flash). Arc shown across switch gap.

**0:35** — Why the spark? The inductor dumps its stored energy (72 mJ) into the arc in microseconds: huge instantaneous power P = E/Δt. This is why flyback diodes protect circuits. Diode shown clamping the spike.

**0:43** — Application: ignition coils in cars — 12V battery → 30,000V spark via inductive kick. CodedLaws logo.

## Physics Concept Teased
An inductor resists changes in current by generating a back-EMF proportional to the rate of current change (ε = −L·dI/dt). When current is abruptly interrupted, this back-EMF can reach thousands of volts as the inductor tries to maintain its magnetic field energy (E = ½LI²) — causing the arc across switch contacts seen in car ignition systems.

## On-Screen Text / Captions
- 0:03 → "τ = L/R = 100mH ÷ 10Ω = 10 ms"
- 0:10 → "Back-EMF = −L·dI/dt opposes change"
- 0:18 → "Energy stored: E = ½LI² = 72 mJ"
- 0:27 → "Switch opens → SPIKE to 1000V+"
- 0:35 → "Flyback diode prevents the spike"
- 0:43 → "Car ignition: 12V → 30,000V spark"

## End Card
Final 3 seconds: Arc across switch gap glowing white/blue. Text: "Inductors: the memory of magnetic fields." CodedLaws subscribe.

## Audio
Electronic circuit ambient sound (low hum). Sharp CRACK + white flash sound at 0:27 (switch opening arc). Voiceover: "The inductor remembers current was flowing — and it fights to keep it that way." Subtle electrical buzz during coil energization.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw coil as series of arcs (solenoid cross-section); animate field lines as expanding concentric ellipses with opacity proportional to current; at switch-open event, trigger a voltage spike animation (red bar shooting up to 1000V) and draw arc as jagged white lightning stroke. Runtime: real-time. Gotcha: L/R time constant of 10ms is very short for video — slow down simulation 100× for visual clarity.
