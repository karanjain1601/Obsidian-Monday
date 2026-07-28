---
title: "Equipartition: Energy Split Equally Per Degree of Freedom"
id: SB157
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, equipartition, statistical-mechanics]
---

> **What it is:** A ~45-second simulation short where a tumbling dumbbell molecule is surrounded by five equal energy bars for its translational and rotational modes, all doubling together as temperature rises — demonstrating the equipartition theorem's rule that each active degree of freedom holds exactly ½k_BT of thermal energy. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Equipartition: Energy Split Equally Per Degree of Freedom
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A glowing dumbbell-shaped molecule (two blue spheres connected by a green rod) tumbles in 3D against a dark background. Five colored energy bars surround it — three for translational motion (x, y, z) and two for rotation (pitch, yaw). All five bars are exactly equal height. The symmetry is elegant and immediately striking.

## Main Visual Sequence (0:03–0:50)
**0:03** — Central molecule (diatomic: N₂, dumbell, 40px each sphere) rotating and translating. Five surrounding energy bars:
- Bar 1 (red): x-translation
- Bar 2 (green): y-translation
- Bar 3 (blue): z-translation
- Bar 4 (orange): pitch rotation
- Bar 5 (yellow): yaw rotation
All bars equal at ½k_BT each. Label: "T = 300K → ½k_BT = 2.07 × 10⁻²¹ J each."

**0:10** — Temperature slider moves from 300K → 600K. All five bars double in height simultaneously, staying equal. Total energy = 5 × ½k_BT = 5/2 k_BT. Molar heat capacity C_V = 5/2 R = 20.8 J/(mol·K) labeled.

**0:18** — Compare monatomic gas (argon, single sphere, no rotation): only 3 translational degrees of freedom. Only 3 bars shown. C_V = 3/2 R = 12.5 J/(mol·K). Bar chart shows monatomic (3 bars) vs diatomic (5 bars) side by side.

**0:27** — At very high temperature (T > 1000K for N₂): vibrational mode activates (6th and 7th bars appear, pale cyan — vibrational KE and PE). Now C_V → 7/2 R = 29.1 J/(mol·K). Bars appear gradually. Text: "Vibration activates at high temperature."

**0:35** — Real measurement panel: C_V of N₂ at different temperatures plotted (step function: 3/2R → 5/2R → 7/2R). Quantum mechanics explanation: "Quantum effects freeze out low-energy modes at room temperature."

**0:43** — Summary: "Every active degree of freedom gets ½k_BT. Equipartition is why specific heats differ between gases." CodedLaws logo.

## Physics Concept Teased
The equipartition theorem states that thermal energy distributes equally among all active degrees of freedom, with each receiving ½k_BT of energy. A monatomic gas has 3 translational degrees (C_V = 3/2 R); a diatomic gas adds 2 rotational degrees at room temperature (C_V = 5/2 R); vibration adds 2 more at high temperatures.

## On-Screen Text / Captions
- 0:03 → "Each mode gets ½k_BT = 2.07×10⁻²¹ J"
- 0:10 → "Double T → all 5 bars double"
- 0:18 → "Monatomic: 3 modes (C_V = 3/2 R)"
- 0:27 → "High T: vibration activates (7 modes)"
- 0:35 → "Quantum effects freeze vibrational modes at room T"
- 0:43 → "Equipartition: energy shared equally"

## End Card
Final 3 seconds: Five equal energy bars with molecule in center. Text: "Nature shares energy fairly." CodedLaws subscribe.

## Audio
Calm, rhythmic ambient music, 75 BPM. Each degree of freedom activation (0:27 vibration appearing) accompanied by a soft rising tone. Voiceover: "Temperature doesn't care which motion — translation, rotation, or vibration — it shares equally among all."

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: draw dumbbell molecule rotating in 3D (use 2D projection: two circles with connecting rod, update projection angles over time); animate bar chart heights driven by ½k_BT × mode_count; make mode activation a threshold function of temperature. Runtime: real-time. Gotcha: the 2D animation cannot fully show 3D tumbling — show three rotation axes separately with fade-in animation.
