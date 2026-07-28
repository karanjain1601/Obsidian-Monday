---
title: "Photoelectric Effect: Einstein's Nobel Prize"
id: SB168
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, photoelectric-effect, photons]
---

> **What it is:** A ~45-second simulation short where intense red light blasts a metal plate with zero effect but dim UV instantly launches blue electron sparks, revealing that light energy comes in discrete photon packets whose frequency — not intensity — determines whether electrons escape. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Photoelectric Effect: Einstein's Nobel Prize
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A metal surface (dark grey) is blasted with red light — nothing happens, no matter how bright. Then the light switches to ultraviolet (purple) — and electrons (bright blue sparks) immediately shoot off the metal in all directions. The contrast is shocking: MORE red light does nothing, but even dim UV liberates electrons instantly.

## Main Visual Sequence (0:03–0:50)
**0:03** — Metal plate (dark grey rectangle) with vacuum above it. Light source at left. Current meter at right reading 0A. Frequency meter shows: f = 4.5×10¹⁴ Hz (red light). Bright red beam hits plate. Electrons jiggle slightly inside metal but none escape. Current meter: still 0. "Brightness ×10 — still 0 current."

**0:10** — Classical prediction panel: "Wave theory predicts: bright enough light should always eject electrons — eventually." But experiment shows: intensity doesn't matter below threshold frequency. Wave theory FAILS. Red X over wave diagram.

**0:18** — Einstein's explanation (1905): light comes in discrete packets (photons), each with energy E = hf. Photon energy: red (4.5×10¹⁴ Hz) = 1.86 eV. Work function of sodium metal: φ = 2.36 eV. Since 1.86 < 2.36 eV, photon can't liberate electron. Even 1000 red photons can't combine their energies.

**0:27** — UV light switched on: f = 8×10¹⁴ Hz. Photon energy = hf = 3.31 eV > φ = 2.36 eV. Electrons ejected immediately (blue sparks). Kinetic energy of ejected electrons: KE = hf − φ = 0.95 eV. Label shown. Current meter: 2.4 μA.

**0:35** — Frequency slider sweeps: below threshold (f < φ/h = 5.7×10¹⁴ Hz) → 0 current always. Above threshold → current appears immediately. Kinetic energy vs frequency graph: linear relationship, slope = h (Planck's constant). "Slope = h = 6.626×10⁻³⁴ J·s."

**0:43** — Application: solar cells, digital cameras (CCD sensors), photodetectors. "Einstein won the 1921 Nobel Prize for this — not relativity!" CodedLaws logo.

## Physics Concept Teased
The photoelectric effect proves that light is quantized into photons, each carrying energy E = hf. No matter how intense, light below the threshold frequency cannot eject electrons because no individual photon has enough energy to overcome the work function. Above threshold, even a single photon can immediately eject an electron — and its kinetic energy scales linearly with frequency.

## On-Screen Text / Captions
- 0:03 → "Red light × 1000 intensity — 0 electrons"
- 0:10 → "Wave theory fails here"
- 0:18 → "Photon energy E = hf = 1.86 eV < φ = 2.36 eV"
- 0:27 → "UV: E = 3.31 eV > φ — electrons fly!"
- 0:35 → "KE vs f slope = h = 6.626×10⁻³⁴ J·s"
- 0:43 → "Nobel Prize 1921 — not relativity!"

## End Card
Final 3 seconds: UV photon hitting metal, blue electron trajectory arching upward. Text: "One photon. One electron. That's it." CodedLaws subscribe.

## Audio
Dramatic pause at 0:10 (wave theory failure — record scratch sound). UV activation: bright "zing" sound + electron sparks. Linear graph drawing: soft sequential tones. Voiceover: "More light didn't help. Only higher frequency did. That's how Einstein discovered the photon."

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: animate photons as traveling sine-wave packets with frequency-coded colors (red at low, violet at high); when photon hits metal, check if E=hf > work function; if yes, emit electron with KE-appropriate velocity; draw current meter needle proportional to emission rate. Runtime: real-time. Gotcha: make the threshold effect sharp and clear — no electrons at all below threshold, immediate emission above; don't blur the boundary.
