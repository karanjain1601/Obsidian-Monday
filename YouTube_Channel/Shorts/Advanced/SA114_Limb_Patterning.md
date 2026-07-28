---
title: "Limb Patterning: Digit Formation Simulation"
id: SA114
type: youtube-short
duration: "~45 seconds"
feeds_video: "How Fingers Form: The Math of Limb Patterning"
difficulty: advanced
tags: [physics, simulation, short, advanced, limb-patterning, digit-formation, morphogenesis, Shh, developmental-biology]
---

> **What it is:** A ~45-second simulation showing Sonic hedgehog and BMP signaling gradients simulated in a growing limb bud via reaction-diffusion to reproduce the five-digit pattern through lateral inhibition. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** How Fingers Form: The Math of Limb Patterning

# Short: Limb Patterning — Digit Formation Simulation

**Feeds full video:** How Fingers Form: The Math of Limb Patterning

## Visual Hook (First 3 Seconds)
A limb bud (pink oval, 0.5 mm wide) on black background. Time-lapse: it elongates. Five bright orange stripes condense along its flank — the pre-digit condensations. They solidify into distinct cartilage rods. White counter: **"72 hours, 5 digits — every time."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Limb bud geometry: 2D ellipse (1 mm × 0.5 mm). Three signaling zones labeled: ZPA (zone of polarizing activity, red dot, posterior pole), AER (apical ectodermal ridge, yellow line, distal tip), mesenchyme interior (pink). Axes: proximal-distal (PD) and anterior-posterior (AP).
- **0:10** — Shh gradient from ZPA: Sonic Hedgehog morphogen (orange, concentration plotted) decays from posterior to anterior. AP axis concentration: **"C_Shh = 80 nM"** at ZPA → **"2 nM"** at 500 µm distance**. Digit identity assigned by threshold: D1 < 5 nM, D2 5–15 nM, D3 15–30 nM, D4 30–60 nM, D5 > 60 nM.
- **0:18** — FGF8 from AER: growth signal (cyan, uniform at distal tip) drives PD outgrowth. Cells in high FGF8 zone remain undifferentiated (pink); cells leaving AER influence zone begin condensing. Outgrowth rate: **"100 µm per 12 hours"**.
- **0:27** — Digit condensation: Turing-like mechanism in mesenchyme. BMP (activator, orange) and WNT (inhibitor, blue) form RD stripes parallel to PD axis. 5 BMP stripes emerge at wavelength λ = 180 µm. Each stripe = one pre-digit condensation (cartilage precursor).
- **0:36** — Polydactyly simulation: ZPA strength increased 2×. Shh gradient flatter → extra thresholds crossed → **"6th condensation stripe"** forms (shown in red, extra digit). Label: **"Polydactyly: too much Shh." ** Conversely, ZPA ablated → 2 digits remain.
- **0:44** — 3D limb rendering: final patterned limb in 3D (volumetric, cartilage = white rods, muscle = pink, skin = transparent). 5 digit rods clearly visible, correct AP ordering D1 (thumb, anterior) to D5 (pinky, posterior). Label: **"72h developmental simulation complete."**

## Physics Concept Teased
Digit patterning combines two orthogonal systems: a Shh morphogen gradient along the AP axis specifies digit identity via concentration thresholds, while a Turing-type BMP/WNT reaction-diffusion mechanism in the mesenchyme selects the number of condensation stripes — the wavelength of the RD system determines finger count.

## On-Screen Text / Captions
- **0:00** — "Five fingers: the math behind a miracle"
- **0:10** — "Shh gradient tells each digit what finger to be"
- **0:20** — "FGF8 drives growth; cells leaving it start to specialize"
- **0:30** — "BMP-WNT Turing waves count the fingers: 1, 2, 3, 4, 5"
- **0:38** — "Too much Shh → 6 fingers — same math, different input"
- **0:45** — "Full limb patterning sim → bio"

## End Card
Final 3 seconds: 3D limb with 5 white cartilage rods in transparent skin. **"CodedLaws — Developmental Physics"** text.

## Audio
Warm, organic electronic melody at 62 BPM. Soft condensation click SFX at each digit stripe. No voiceover.

## Production Notes
Renderer: 2D PDE on adaptive mesh (FEniCS, Python). Shh: steady-state exponential gradient. FGF8: boundary condition at distal 10% of domain. BMP/WNT: Gierer-Meinhardt equations, D_activator = 0.01 µm²/s, D_inhibitor = 0.5 µm²/s. Cartilage condensation: BMP > threshold → mesenchymal condensation marker ON. 3D: same equations extruded on 3D mesh. Output 1080×1920, 60 fps.
