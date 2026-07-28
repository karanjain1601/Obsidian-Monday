---
title: "Hall Effect: Magnetic Fields Deflect Current"
id: SB167
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, electromagnetism, hall-effect, magnetic-field]
---

> **What it is:** A ~45-second simulation short where electrons flowing through a gold strip visibly pile up at one edge the instant a magnetic field switches on, creating a measurable transverse voltage on a live voltmeter, revealing the Lorentz force that underpins Hall-effect sensors. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Hall Effect: Magnetic Fields Deflect Current
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A flat copper strip (gold rectangle) has electrons flowing left-to-right. A magnetic field is switched on pointing upward out of the screen (blue dots). Instantly, the electron stream bends downward — electrons pile up at the bottom edge, leaving the top edge positive. A voltmeter across the strip's width jumps to 0.3 mV. Something invisible just created a measurable voltage.

## Main Visual Sequence (0:03–0:50)
**0:03** — Copper strip (gold, 400px wide × 100px tall) shown with current I flowing left to right (conventional). Electron flow (blue arrows) moves right to left (opposite convention). Magnetic field B applied perpendicular to screen (blue dots = coming out). No deflection yet. Hall voltage = 0.

**0:10** — B field switched on. Lorentz force on electrons: F = q·v×B. Electrons moving in −x direction (−v_x), B in +z direction: F = qv×B → force in −y direction (downward). Electrons accumulate at bottom edge (blue crowding). Top edge becomes positively charged (red, depleted of electrons).

**0:18** — Charge separation creates an electric field E_H pointing downward (from + top to − bottom). This Hall field exerts force on electrons opposite to Lorentz force. Equilibrium when qE_H = qv_xB → E_H = v_x·B. Hall voltage: V_H = E_H·w = v_x·B·w.

**0:27** — Numbers: I = 1A, B = 0.5T, strip width w = 1mm, n = 8.5×10²⁸ electrons/m³, thickness t = 0.1mm. V_H = IB/(nqt) = (1)(0.5) / (8.5×10²⁸ × 1.6×10⁻¹⁹ × 0.0001) = 0.37 μV (copper is tiny due to high n). Label shown. For semiconductor (n = 10²¹): V_H = 3.1 mV — much larger!

**0:35** — Application: Hall effect sensors measure magnetic field strength (motors, ABS sensors in cars). Another application: Hall effect determines whether charge carriers are electrons or holes (n-type vs p-type semiconductor). Sensor chip shown.

**0:43** — Fun fact: Quantum Hall Effect at low T shows quantized conductance plateaus — a physics Nobel Prize (1985, 1998). CodedLaws logo.

## Physics Concept Teased
The Hall effect occurs when a magnetic field deflects current-carrying charge carriers sideways within a conductor, creating a voltage across the width of the material (the Hall voltage V_H = IB/nqt). This voltage's sign identifies the carrier type (electrons or holes) and its magnitude measures the carrier density — making it essential for semiconductor characterization and magnetic field sensors.

## On-Screen Text / Captions
- 0:03 → "Current + magnetic field → transverse voltage?"
- 0:10 → "F = qv×B — electrons deflect downward"
- 0:18 → "Charge separation → Hall voltage V_H = v_x·B·w"
- 0:27 → "V_H = IB/(nqt) — larger in semiconductors"
- 0:35 → "ABS brake sensor uses Hall effect"
- 0:43 → "Quantum Hall Effect: Nobel Prize 1985"

## End Card
Final 3 seconds: Hall sensor chip with magnetic field lines and voltmeter. Text: "A magnetic field that creates voltage." CodedLaws subscribe.

## Audio
Precise, technical ambient music (clean electronic, 85 BPM). Magnetic field activation: "whomp" sound. Voltmeter needle deflection: soft click. Voiceover: "Bend the current sideways with a magnet — and a new voltage appears." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: animate electron dots flowing left; when B field activates, apply downward drift to all electron velocities proportional to B; show accumulation by increasing electron dot density at bottom; draw Hall voltage as color gradient (blue at bottom, red at top) that builds up to equilibrium. Runtime: real-time. Gotcha: equilibrium is reached quickly (nanoseconds) — animate the buildup slowly for visual clarity; don't simulate actual dynamics.
