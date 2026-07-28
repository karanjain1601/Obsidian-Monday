---
title: "Latent Heat: Ice Melts Without Getting Warmer"
id: SB155
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, latent-heat, phase-transitions]
---

> **What it is:** A ~45-second simulation short where a real-time temperature graph climbs steadily as ice warms then goes completely flat at 0°C while the ice visibly melts — revealing that latent heat of fusion absorbs 167,000 joules entirely into breaking molecular bonds without any rise in temperature. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Latent Heat: Ice Melts Without Getting Warmer
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A temperature-vs-time graph begins plotting in real time. The line climbs steadily upward (ice warming), then suddenly goes FLAT at exactly 0°C — while a simulation on the left shows an ice cube visibly melting into water. The temperature refuses to budge for a long time despite constant heating. The flatness is jarring and counterintuitive.

## Main Visual Sequence (0:03–0:50)
**0:03** — Left panel: glass beaker with ice cubes (white, crystalline) sitting in water. Bunsen burner flame (orange/blue) heats from below — constant power 500W shown. Right panel: temperature-vs-time graph, axes labeled (Y: −20°C to 120°C, X: 0 to 15 minutes).

**0:10** — Phase 1 (0:00–3:00 sim-time): ice warms from −20°C to 0°C. Graph line slopes upward (blue). Slope = P/(m·c_ice) = 500/(0.5×2090) = 0.48°C/s. Ice crystals still visible in beaker. Caption: "Heating ice — temperature rises at 0.48°C/s."

**0:18** — At 0°C: graph line becomes perfectly horizontal (green plateau). Ice begins melting (water appears at base of ice, liquid-solid interface visible). Caption: "Energy goes into breaking bonds — NOT into heating!" Small bond-breaking animation: ice lattice structure shown, bonds snapping one by one.

**0:27** — Plateau duration: 6 minutes at constant heating. All 500W goes to latent heat: Q = m·L_f = 0.5 kg × 334,000 J/kg = 167,000 J. Label showing latent heat of fusion: L_f = 334 kJ/kg. Ice fully melts → beaker now full of water only.

**0:35** — Phase 3: water heats from 0°C to 100°C. Graph slopes up again (steeper, cyan) — water's specific heat is lower than ice's. Rate = 500/(0.5×4186) = 0.24°C/s. Another shorter plateau at 100°C: vaporization. L_v = 2,257 kJ/kg.

**0:43** — Comparison: L_f (ice→water, 334 kJ/kg) vs L_v (water→steam, 2,257 kJ/kg). Steam takes 6.75× more energy. Final message: "That's why steam burns are worse than hot water burns." CodedLaws logo.

## Physics Concept Teased
Latent heat is the energy absorbed during a phase change without any temperature increase. The energy goes into rearranging molecular bonds — breaking the rigid ice lattice into mobile water — rather than speeding up molecules. Water's latent heat of fusion (334 kJ/kg) makes ice an extraordinarily effective coolant.

## On-Screen Text / Captions
- 0:03 → "Constant 500W heating applied"
- 0:10 → "Temperature rises 0.48°C/s"
- 0:18 → "0°C — temperature STOPS rising!"
- 0:27 → "L_f = 334 kJ/kg — all energy breaks bonds"
- 0:35 → "Water heats, then boils at 100°C"
- 0:43 → "Steam burn = 6.75× more energy than hot water"

## End Card
Final 3 seconds: Temperature-vs-time graph showing two plateaus (0°C and 100°C) glowing green. Text: "Latent heat — hidden energy in phase changes." CodedLaws subscribe.

## Audio
Gentle crackling fire sound in background. At 0:18 when temperature flatlines: a subtle "freeze" sound effect (musical chime). Graph plotting sound: soft beep each data point. Voiceover: "The thermometer doesn't move — but the ice is melting. The energy is hiding."

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: drive both the graph and the beaker visual from a single time variable; compute temperature from energy input using phase-specific formulas; switch regimes at phase boundaries; draw ice crystals diminishing in count as latent heat accumulates. Runtime: real-time (time-accelerated simulation). Gotcha: scale simulation time so the full 15-minute process completes in 40 seconds of video.
