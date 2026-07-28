---
title: "Atmospheric Gravity Wave: Ducted Propagation"
id: SA094
type: youtube-short
duration: "~45 seconds"
feeds_video: "Atmospheric Gravity Waves and Ducting Explained"
difficulty: advanced
tags: [physics, simulation, short, advanced, atmospheric-gravity-wave, ducting, atmospheric-dynamics, mesosphere]
---

> **What it is:** A ~45-second simulation showing mountain-wave atmospheric gravity waves propagating upward from an orographic source and ducting in a stratospheric temperature inversion before breaking and depositing westward momentum. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Atmospheric Gravity Waves and Ducting Explained

# Short: Atmospheric Gravity Wave — Ducted Propagation

**Feeds full video:** Atmospheric Gravity Waves and Ducting Explained

## Visual Hook (First 3 Seconds)
A side-profile atmosphere slice: dark navy at top (mesosphere), vivid sky-blue at bottom (troposphere). A glowing white ripple — like a stone dropped in water but perfectly horizontal — expands outward from a mountain peak (grey triangle, 4 km tall). The ripple bounces between two invisible walls. White text: **"Trapped."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Full atmosphere cross-section: 0–100 km altitude on y-axis, 2000 km horizontal span. Temperature profile plotted on right panel: cold tropopause (−56°C, blue), warm stratopause (0°C, orange), cold mesopause (−90°C, dark blue).
- **0:10** — Orographic source: gravity wave packet launched from 4 km mountain (grey). Wave crests colored by vertical velocity: upward = white (+0.5 m/s), downward = purple (−0.5 m/s). Horizontal wavelength λₓ = 40 km visible.
- **0:18** — Wave encounters stratospheric jet stream duct (orange band at 30–50 km). Duct criterion overlay: N²(z) > k²c²ₓ shown as green zone. Wave energy confined — amplitude holds instead of decaying. Label: **"Duct width: 20 km"**.
- **0:27** — Without duct (left half): wave amplitude decays exponentially (white envelope shrinks, label **"Amplitude → 0"**). With duct (right half): amplitude stays constant at ±0.4 m/s over 1000 km of propagation.
- **0:36** — Wave reaches duct terminus; partial transmission into mesosphere (40% energy leaks up, shown by dim white crests above), 60% reflects back. Standing wave pattern visible in duct — constructive interference at nodes.
- **0:44** — Time-lapse: wave packet travels 2000 km in 6 hours. Airglow camera view overlay (false-color green at 87 km) shows characteristic band pattern: 7 parallel bright stripes, spacing 40 km.

## Physics Concept Teased
Atmospheric gravity waves are trapped in thermal ducts where the Scorer parameter l² = N²/c² − kₓ² is positive, allowing horizontal propagation over thousands of kilometers without amplitude loss.

## On-Screen Text / Captions
- **0:00** — "Waves from a mountain can reach the mesosphere"
- **0:10** — "Gravity wave: buoyancy restores displaced air parcels"
- **0:20** — "A thermal duct traps the wave like a fiber optic cable"
- **0:30** — "Without duct: dies in 100 km. With duct: 2000 km+"
- **0:38** — "Airglow cameras see the bands from the ground"
- **0:45** — "Full derivation → link in bio"

## End Card
Final 3 seconds: airglow false-color green image with 7 wave bands. **"CodedLaws — Atmospheric Waves"** bottom-left; subscribe pulse top-right.

## Audio
Soft low synth hum resonating like a standing wave; 65 BPM. Subtle "whoosh" for each wave crest passing. No voiceover.

## Production Notes
Renderer: 2D linear wave propagation (Python/NumPy). Scorer parameter l²(z) computed from MSIS atmosphere model. Ducting criterion checked every 100 m altitude. WKB turning points identified for partial reflection. Airglow layer modeled as OH emission at 87 km ± 4 km width. Grid: 2000×100 km, Δx = 1 km, Δz = 100 m. Output 1080×1920, 60 fps.
