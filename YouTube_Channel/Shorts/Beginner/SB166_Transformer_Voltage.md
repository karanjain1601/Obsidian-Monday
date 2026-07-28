---
title: "Transformers: Changing Voltage With Coils"
id: SB166
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, electromagnetism, transformer, AC-circuits]
---

> **What it is:** A ~45-second simulation short where two sine waves appear on an oscilloscope — a tall 120V primary and a shorter 60V secondary — as animated flux sweeps back and forth through an iron core linking two coils, revealing the turns-ratio law of electromagnetic induction. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Transformers: Changing Voltage With Coils
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Two coils wound on a shared iron core — a small 12-turn primary (left, gold) connected to 120V AC and a 6-turn secondary (right, silver). On an oscilloscope at right, two sine waves appear: a tall blue one (120V, primary) and a shorter red one (60V, secondary). The voltage halved — no battery, just coils and changing flux.

## Main Visual Sequence (0:03–0:50)
**0:03** — Transformer diagram (dark background): left coil (N₁ = 12 turns, gold), iron core (orange rectangle between coils), right coil (N₂ = 6 turns, silver). AC source on left (120V, 60Hz sine wave). Labels: "Step-down transformer."

**0:10** — AC current flows in primary coil: oscillating orange arrows. In the iron core, magnetic flux Φ sweeps back and forth in phase with primary current (orange flux lines animated, alternating direction). Core concentrates and guides the flux to secondary coil.

**0:18** — Secondary coil "sees" changing flux → Faraday's law induces EMF. Output V₂ = V₁ × (N₂/N₁) = 120 × (6/12) = 60V. Secondary voltage waveform (red sine) appears on oscilloscope — half the amplitude, same frequency. Label: "V₁/V₂ = N₁/N₂."

**0:27** — Power conservation: if efficiency = 100%, P_in = P_out. V₁·I₁ = V₂·I₂. Since V₂ = V₁/2, then I₂ = 2·I₁. Current arrows on secondary side are twice as fat. Label: "Lower voltage → higher current."

**0:35** — Step-up version: swap N₁ = 6, N₂ = 12. Output = 240V. "Power lines use step-up transformers (hundreds of kV) to minimize transmission losses." Power line graphic with voltage labels.

**0:43** — Efficiency note: real transformers 95–99% efficient (eddy current losses, hysteresis). Laminated core shown (thin layers to reduce eddy currents). CodedLaws logo.

## Physics Concept Teased
A transformer uses electromagnetic induction to change AC voltage: the ratio of output to input voltage equals the ratio of secondary to primary turns (V₂/V₁ = N₂/N₁). By conservation of energy, a step-down transformer that halves voltage must double current, while a step-up transformer doubles voltage and halves current.

## On-Screen Text / Captions
- 0:03 → "120V in, 60V out — no battery needed"
- 0:10 → "Changing flux links both coils"
- 0:18 → "V₁/V₂ = N₁/N₂ = 12/6 = 2"
- 0:27 → "Half voltage → double current (P conserved)"
- 0:35 → "Power lines: step UP to 500,000V"
- 0:43 → "Real transformers: 97% efficient"

## End Card
Final 3 seconds: Power line tower with voltage label "345 kV" and a house with "120V" label. Text: "Transformers keep the lights on." CodedLaws subscribe.

## Audio
60Hz hum (subtle transformer buzz) throughout. AC sine wave visualization accompanied by a soft 60Hz tone. Voiceover: "Wind wire one way to step voltage up. Wind it back to step it down. That's it." Music: industrial ambient, 80 BPM.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw oscillating flux lines in the iron core as animated chevrons reversing direction at 60Hz (slowed for visibility); draw primary and secondary voltage waveforms on dual-channel oscilloscope in real time; update all labels when turn-ratio slider changes. Runtime: real-time. Gotcha: ensure flux animation direction and sign are consistent with Lenz's law — when primary current increases, flux increases, secondary EMF opposes increase in secondary load current.
