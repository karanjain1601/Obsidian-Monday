---
title: "Ionospheric Plasma: E-Region Irregularity"
id: SA093
type: youtube-short
duration: "~45 seconds"
feeds_video: "Ionospheric Plasma Irregularities and Radio Scintillation"
difficulty: advanced
tags: [physics, simulation, short, advanced, ionosphere, plasma, irregularity, e-region, radio-scintillation]
---

> **What it is:** A ~45-second simulation showing Farley-Buneman plasma drift instability growing in the ionospheric E-region and producing density striations that coherently scatter radar signals causing GPS radio scintillation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Ionospheric Plasma Irregularities and Radio Scintillation

# Short: Ionospheric Plasma — E-Region Irregularity

**Feeds full video:** Ionospheric Plasma Irregularities and Radio Scintillation

## Visual Hook (First 3 Seconds)
A radio signal beam (white, 5 px wide) enters the top of a false-color ionospheric layer (100–130 km altitude, teal background). Midway through the layer, the beam shatters into a dozen flickering ghost beams of varying green intensities. White text flashes: **"GPS just broke."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Vertical atmosphere cross-section (black sky top, blue Earth curvature bottom). E-region layer at 90–130 km altitude: smooth teal initially. Electron density color bar on right: 10⁹–10¹² m⁻³, teal to white.
- **0:10** — Sporadic-E irregularity seeds: small islands of high electron density (bright white patches, 5–20 km wide) appear at 100 km. Patch count: **"N = 8 patches"** in overlay. Gradient-drift instability initiates — dark "holes" form on trailing edges.
- **0:18** — Patches elongate along geomagnetic field lines (yellow, ±60° to vertical). Density ratio crest-to-trough reaches **"10:1"**. Kilometer-scale structures emerge as the irregularity spectrum develops (power spectral density plot appears, −5/3 slope red line).
- **0:27** — Radio ray tracing overlay: 10 parallel 400 MHz rays (white lines) entering from top; they scatter at patch boundaries. Emergence angles span ±15°. Simulated GPS signal strength bar graph shows fades from −85 dBm to −115 dBm.
- **0:36** — Phase screen scintillation index S4 counter climbs from **"S4 = 0.1"** to **"S4 = 0.78"** (red zone). GPS lock count drops: **"Sats tracked: 8 → 3"** blinking red.
- **0:44** — Irregularities drift eastward at 80 m/s, driven by E×B drift. Patches dissolve as recombination wins after sunset. Label: **"Irregularities: meters wide, 1000 km long."**

## Physics Concept Teased
Gradient-drift and Kelvin-Helmholtz instabilities in the E-region ionosphere spawn plasma density irregularities that scatter radio waves, causing GPS signal scintillation with S4 indices exceeding 0.7.

## On-Screen Text / Captions
- **0:00** — "Invisible turbulence 100 km up disrupts your GPS"
- **0:10** — "Sporadic-E: electron density islands form"
- **0:20** — "Gradient-drift instability stretches them along field lines"
- **0:30** — "Radio waves scatter — GPS signal fades"
- **0:38** — "S4 > 0.6 = GPS outage territory"
- **0:45** — "Full physics → video link in bio"

## End Card
Final 3 seconds: globe with ionospheric layer glowing teal, GPS satellite icons flickering red then green. **"CodedLaws — Ionosphere Series"** bottom text.

## Audio
High-frequency static crackle synchronized to beam scatter events. Ambient lo-fi electronic beat 70 BPM. Warning beep when S4 crosses 0.6.

## Production Notes
Renderer: 2D electrostatic PIC (C++/CUDA). Gradient-drift growth rate: γ = (E×B/B² − V_n)·∇N/N. Ray tracing via Haselgrove equations, 10 rays. S4 index computed from intensity variance: S4² = (⟨I²⟩ − ⟨I⟩²)/⟨I⟩². Grid: 500×200 km, Δx = 100 m. Output 1080×1920, 60 fps.
