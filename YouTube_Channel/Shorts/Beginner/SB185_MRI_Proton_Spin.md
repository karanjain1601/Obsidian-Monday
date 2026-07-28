---
title: "MRI: Your Body's Protons As Compass Needles"
id: SB185
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, medical-physics, MRI, NMR]
---

> **What it is:** A ~45-second simulation short where randomly tumbling proton spin arrows snap to alignment inside an MRI bore, are tipped 90° by an RF pulse, then relax at tissue-specific T1 and T2 rates that assemble into a greyscale brain slice — demonstrating how nuclear magnetic resonance reveals internal anatomy. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: MRI: Your Body's Protons As Compass Needles

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Extreme close-up: dozens of tiny red arrow-tipped spinning tops (proton spins) tumbling randomly in all directions on a black background. A massive white magnetic field arrow slams down from above — instantly every tiny spin snaps to attention, pointing up or down in two orderly groups. The effect looks like a crowd standing to attention.

## Main Visual Sequence (0:03–0:50)
**0:03** — A white cylindrical MRI bore (cross-section view) with a human brain outline (grey) inside. Large vertical white arrows fill the bore labeled "B₀ = 3 Tesla". Proton spin arrows (red, small) inside the brain all align: slightly more pointing up (parallel) than down (anti-parallel). Label: "Net Magnetization M₀ (upward, tiny cyan arrow)".

**0:10** — An RF pulse (orange sinusoidal wave, labeled "RF Pulse: 127.7 MHz") enters from the left and sweeps through the brain tissue. All the tiny red spin arrows tilt 90 degrees — they now point horizontally, precessing around the B₀ axis like wobbling gyroscopes. Larmor precession shown as circular arrow: ω₀ = γ·B₀.

**0:18** — RF pulse stops. Label appears: "Relaxation begins." Two split panels appear:
  - Left panel "T1 Relaxation": the horizontal spins slowly rotate back to vertical (upward) alignment over ~1 second (time axis shown, white matter T1 ≈ 800 ms labeled in yellow).
  - Right panel "T2 Relaxation": spins fan out (dephase) in the transverse plane over ~80 ms — signal decays because spins lose coherence.

**0:28** — A pickup coil (copper-colored ring) around the bore detects the rotating magnetization — a FID (Free Induction Decay) signal trace draws on screen: oscillating curve that decays exponentially. Label: "MRI Signal = Rotating Magnetization".

**0:33** — Fourier Transform animation: the FID signal (time domain, white) transforms via FFT arrow into a frequency spectrum (orange peaks). Label: "Frequency → Spatial Position (using gradient coils)".

**0:38** — Slice-by-slice brain image assembles from left to right: axial brain slice in greyscale (white matter bright, grey matter intermediate, CSF dark). Tissue labels appear: "White Matter: T1=800ms", "Grey Matter: T1=1200ms", "CSF: T1=4000ms". The contrast difference is what makes MRI tissue-discriminating.

**0:44** — Final: the completed MRI brain image with "3 Tesla MRI" label. Inset shows the tiny proton arrow — the microscopic source of the whole image.

## Physics Concept Teased
MRI exploits nuclear magnetic resonance: hydrogen protons in tissue align with a strong magnetic field, then an RF pulse at the Larmor frequency tips them; as they relax back, they emit detectable radio signals whose T1 and T2 relaxation times reveal tissue type.

## On-Screen Text / Captions
- **0:00** — "Every proton in your body is a tiny compass needle. MRI uses that."
- **0:03** — "B₀ = 3 Tesla (60,000× Earth's field)"
- **0:10** — "RF Pulse at Larmor Frequency: 127.7 MHz"
- **0:10** — "Spins tip 90° — then precess"
- **0:18** — "T1: spins realign with B₀ | T2: spins dephase"
- **0:28** — "Pickup coil detects rotating magnetization"
- **0:33** — "FFT converts signal → spatial image"
- **0:38** — "Different T1/T2 = different tissues on screen"
- **0:44** — "One proton → one pixel → one brain scan"

## End Card
**0:47–0:50** — Grey-black background. Greyscale brain MRI slice glows softly. Bold text: "MRI — Physics Series". "@CodedLaws". Subscribe button pulses.

## Audio
- **Music:** Slow, ambient electronic — deep bass drone, soft high shimmer, 55 BPM. Feels clinical and calm.
- **Voiceover:** "The Larmor frequency for hydrogen at 3 Tesla is 127.7 megahertz — that's the exact radio frequency the scanner broadcasts to tip your protons over." (0:10–0:25, measured, clear female voice).
- **SFX:** Low magnetic "thrum" as B₀ field activates (0:03); warm RF sine-wave tone during RF pulse (0:10–0:18); FID signal converted to audible descending tone during decay (0:28–0:33).

## Production Notes
- **Renderer:** Manim for spin vector animations; Python + Matplotlib for FID and FFT plots; brain slice image from publicly available MRI dataset (e.g., BrainWeb phantom).
- **Code complexity:** High. Bloch equation simulation (dM/dt = γM×B − relaxation terms) needed for physically accurate spin trajectory. Simplify by using analytic solution for on-resonance RF pulse + T1/T2 decay.
- **Key visual trick:** Color-code the spin arrows by their phase angle during T2 decay (rainbow coloring) so dephasing is visually obvious — grey/uniform before RF, rainbow after, then fading grey as coherence is lost.
- **Runtime:** T1/T2 split panel (0:18–0:28) needs 10 s minimum; consider compressing T1 timeline to 3× real speed for visual engagement.
- **Gotchas:** Distinguish T1 (longitudinal, recovery of Mz) and T2 (transverse, decay of Mxy) carefully — confusing them is the most common error. CSF must appear dark on T1-weighted image (long T1 = less signal recovered when TR is short).
