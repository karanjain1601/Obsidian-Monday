---
title: "LC Oscillator: The Electromagnetic Pendulum"
id: SB164
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, electromagnetism, LC-circuit, oscillation]
---

> **What it is:** A ~45-second simulation short where energy visibly sloshes between a glowing blue capacitor and an orange inductor coil in perfect sync with a swinging pendulum beside it, revealing that electromagnetic resonance is mathematically identical to a mechanical oscillator. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: LC Oscillator: The Electromagnetic Pendulum
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Side by side: a mechanical pendulum swinging left-right, and an LC circuit with energy sloshing between a glowing blue capacitor and a glowing orange inductor coil. Both oscillate at the same rhythm — the analogy is perfect and immediately clear. The visual is elegant: two different systems, one principle.

## Main Visual Sequence (0:03–0:50)
**0:03** — LC circuit shown: capacitor (C = 100μF, two green plates) connected to inductor (L = 10mH, copper coil). Capacitor initially fully charged to 9V (electric field shown as bright blue lines between plates). Inductor current = 0. Energy label: "E_C = ½CV² = 4.05 mJ, E_L = 0."

**0:10** — Switch closes. Capacitor begins discharging through inductor. Current ramps up in inductor (orange arrows growing). Magnetic field (blue rings) grows around coil. Energy transfers from capacitor to inductor. At t = T/4: capacitor fully discharged (V=0), inductor current maximum (I_max = V·√(C/L) = 9·√(10⁻²/10⁻⁵) = 9√1000 ... simplified: I_max shown).

**0:18** — Current continues flowing (inductor won't stop). Charges capacitor in REVERSE polarity (plates swap + and −, field arrows reverse direction). At t = T/2: capacitor fully charged to −9V. Inductor current = 0 again. Labels: "E_C = 4.05 mJ again — all transferred back."

**0:27** — Full oscillation cycle completed at t = T = 2π√(LC) = 2π√(10⁻² × 10⁻⁴) = 0.00628s = 6.28 ms. Frequency f = 1/T = 159 Hz. The cycle repeats perfectly. Energy bar chart oscillates: E_C (blue bar) and E_L (orange bar) trade off while total stays constant.

**0:35** — Analogy panel: pendulum (position = capacitor voltage, velocity = inductor current). Pendulum PE → KE → PE mirrors E_C → E_L → E_C. "It's the same differential equation: d²x/dt² = −ω²x."

**0:43** — Application: radio tuner — LC circuit resonates at one specific frequency, filtering that station. Dial turns, L or C changes, frequency changes. CodedLaws logo.

## Physics Concept Teased
An LC oscillator is the electromagnetic analog of a mechanical pendulum: electrical energy oscillates between the electric field of the capacitor and the magnetic field of the inductor at the resonant frequency f = 1/(2π√LC). The math is identical — a second-order harmonic oscillator.

## On-Screen Text / Captions
- 0:03 → "Capacitor charged: E_C = 4.05 mJ, I = 0"
- 0:10 → "Energy flows to inductor: E_L grows"
- 0:18 → "Capacitor charges in reverse polarity"
- 0:27 → "f = 1/(2π√LC) = 159 Hz"
- 0:35 → "Same equation as a pendulum!"
- 0:43 → "Radio tuner: LC selects one frequency"

## End Card
Final 3 seconds: Energy bar chart oscillating perfectly between blue and orange bars. Text: "The universe loves to oscillate." CodedLaws subscribe.

## Audio
Gentle sinusoidal audio tone at 159 Hz (the oscillation frequency) played softly in background. Music: minimal electronic, 80 BPM. Voiceover at 0:35: "A capacitor and an inductor — that's a radio. That's a clock. That's an oscillator." No other voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: compute V_C(t) = V₀·cos(ωt) and I_L(t) = (V₀/√(L/C))·sin(ωt) analytically; drive all visuals from these; animate electric field lines between capacitor plates (density ∝ |V_C|) and magnetic field rings around coil (density ∝ |I_L|). Runtime: real-time. Gotcha: real LC circuits lose energy to resistance (damped oscillation) — add a small damping term for realism or explicitly note "ideal components, no resistance."
