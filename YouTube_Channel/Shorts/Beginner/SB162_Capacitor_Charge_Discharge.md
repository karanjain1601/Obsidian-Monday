---
title: "Capacitor: Charging and Discharging"
id: SB162
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, electromagnetism, capacitor, RC-circuit]
---

> **What it is:** A ~45-second simulation short where a live voltage-vs-time graph traces a smooth exponential curve climbing toward 9V then falling back to zero as an RC circuit charges and discharges, revealing the time constant τ = RC. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Capacitor: Charging and Discharging
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An RC circuit glows on a dark background: a 9V battery (gold), a resistor (grey zigzag), and a capacitor (two parallel green plates). A switch closes — and a live voltage-vs-time graph immediately starts plotting an exponential curve climbing toward 9V. The curve's smooth rise is hypnotic. Then the battery is disconnected and the curve falls exponentially back to zero.

## Main Visual Sequence (0:03–0:50)
**0:03** — Circuit diagram shown (dark background): 9V battery (gold), switch (open, red), 1kΩ resistor (grey zigzag labeled R=1kΩ), capacitor (green plates labeled C=1000μF). Voltage gauge above capacitor reads 0V. Time constant label: "τ = RC = 1s."

**0:10** — Switch closes (click sound). Current begins flowing (orange arrows moving through circuit). Capacitor plates accumulate charge: positive plate glows more red, negative plate more blue, with + and − symbols appearing. Voltage across capacitor rises: V_C(t) = 9·(1 − e^(−t/τ)).

**0:18** — At t = τ = 1s: voltage reaches 9×(1−1/e) = 5.67V (63.2%). Label: "At t = τ: V = 63% of V_final." At t = 5τ = 5s: voltage ≈ 9.0V (99.3%). Label: "At t = 5τ: essentially fully charged."

**0:27** — Battery disconnected (switch opens to disconnect battery, new path through discharge resistor). Current reverses direction (blue arrows). Capacitor discharges: V_C(t) = 9·e^(−t/τ). Exponential decay plotted in red. "Discharge: same τ, same shape — reversed."

**0:35** — Energy stored in capacitor at full charge: E = ½CV² = ½(0.001)(81) = 0.0405 J = 40.5 mJ. Label: "40.5 mJ stored between plates." Electric field between plates shown as parallel arrows.

**0:43** — Applications flash: camera flash capacitor, power factor correction, memory in DRAM. CodedLaws logo.

## Physics Concept Teased
A capacitor charges and discharges exponentially with time constant τ = RC. During charging, current decreases as the capacitor voltage approaches the source voltage; during discharging, the stored electric field energy drives current through the resistor. The time constant τ determines how quickly the process occurs.

## On-Screen Text / Captions
- 0:03 → "τ = RC = 1kΩ × 1000μF = 1 second"
- 0:10 → "Charging: V_C = 9(1 − e^(−t/τ))"
- 0:18 → "t = τ: 63% charged | t = 5τ: 99% charged"
- 0:27 → "Discharging: V_C = 9·e^(−t/τ)"
- 0:35 → "Energy stored: E = ½CV² = 40.5 mJ"
- 0:43 → "Camera flash uses this every shot"

## End Card
Final 3 seconds: Both charging and discharging curves overlaid on the graph (green rise, red fall). Text: "τ = RC — the heartbeat of electronics." CodedLaws subscribe.

## Audio
Clean, digital-sounding ambient music. Switch click sound at 0:10. Soft electrical hum during charging. Gentle "discharge" swoosh at 0:27. Voiceover: "Charge up in one time constant — discharge in another. The capacitor remembers energy."

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: compute V_C each frame as analytical exponential (not numerical integration — avoids drift); animate current arrows at speed proportional to dV/dt; animate plate charge accumulation as color intensity proportional to V_C/V_max; plot real-time graph. Runtime: real-time. Gotcha: make sure current direction arrows reverse correctly on discharge; handle the switch transition smoothly.
