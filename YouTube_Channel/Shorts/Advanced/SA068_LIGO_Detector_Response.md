---
title: "LIGO Detector Response — Arm Cavity Interference"
id: SA068
type: youtube-short
duration: "~45 seconds"
feeds_video: "How LIGO Detects Gravitational Waves: Interferometry at the Quantum Limit"
difficulty: advanced
tags: [physics, simulation, short, advanced, LIGO, interferometry, gravitational-waves, quantum-optics]
---

> **What it is:** A ~45-second simulation showing a Fabry-Perot interferometer arm stretching and shrinking by 10^(-18) m under a passing gravitational wave with the differential arm length change converted to a fringe-shift readout. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** How LIGO Detects Gravitational Waves: Interferometry at the Quantum Limit

# Short: LIGO Detector Response — Arm Cavity Interference

**Feeds full video:** How LIGO Detects Gravitational Waves: Interferometry at the Quantum Limit

## Visual Hook (First 3 Seconds)
A top-down aerial schematic of LIGO Hanford: two 4-km arms forming an L-shape, shown in bright white on a dark background. A beam splitter at the vertex (gold circle). Laser light (red beam) travels down both arms. When a gravitational wave hits: one arm glows brighter red (stretched, 4.000000004 km) and the other dims (squeezed, 3.999999996 km). The difference: "ΔL = 4×10⁻¹⁸ m."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Fabry-Pérot cavity: each 4-km arm is a Fabry-Pérot resonator (input test mass + end test mass, shown as reflective gold mirrors). The 1064 nm infrared laser beam (shown as a dense red beam) bounces back and forth ~280 times, building up ~100 kW of stored power. Cavity finesse F = 443 labeled. Effective optical path length: 4 km × 280 = 1,120 km.

**0:10–0:18** — The Michelson interference: normally the two arms are locked so that light returns to the beam splitter and is directed back to the laser (dark fringe at output). When a GW causes differential arm length change ΔL: the fringe condition shifts. Output power: P_out = P_in·sin²(2πΔL/λ) ≈ P_in·(2πΔL/λ)² for small ΔL. For ΔL = 10⁻¹⁸ m, λ = 1064 nm: P_out = 10⁻¹² W — shown as a dim but measurable signal.

**0:18–0:26** — Noise budget displayed as a log-scale plot: frequency (10–10,000 Hz) vs displacement noise (10⁻²⁰ – 10⁻¹⁷ m/√Hz). Three noise sources color-coded: quantum shot noise (blue, dominates >100 Hz), radiation pressure (green, dominates <30 Hz), seismic noise (red, dominates <10 Hz). The design sensitivity curve (black) shows the standard quantum limit at ~100 Hz.

**0:26–0:34** — Quantum squeezing: the standard quantum limit arises from shot noise (amplitude fluctuations) and radiation pressure (phase fluctuations). A squeezed light state is injected into the dark port — elliptical Wigner function (shown in false color on a phase space plot). This squeezes amplitude fluctuations at the cost of phase noise, improving sensitivity at >100 Hz by a factor of √10 = 3.16.

**0:34–0:42** — Signal recycling cavity: a signal recycling mirror (purple) is shown at the output port of the beam splitter. It reflects GW-induced sidebands back into the detector, resonantly enhancing the signal around a chosen frequency f_SR = 350 Hz (tunable). The signal-to-noise ratio at 350 Hz increases by a factor of G_SR = 12 (shown as a peak in the sensitivity curve).

**0:42–0:50** — Real GW150914 detection: the strain h(t) signal at Hanford (red) and Livingston (blue) is shown, offset by 6.9 ms (light travel time between sites). The matched filter SNR = 23.6 (displayed). The template waveform (green) overlaid on the noisy data — they match perfectly. Text: "First detection: September 14, 2015, 09:50:45 UTC." Fade to CodedLaws logo.

## Physics Concept Teased
LIGO measures gravitational-wave-induced differential arm length changes of ~10⁻¹⁸ m using Fabry-Pérot enhanced Michelson interferometry. The sensitivity is limited by quantum noise (shot noise and radiation pressure), which can be reduced below the standard quantum limit by injecting squeezed light states.

## On-Screen Text / Captions
- **0:00** — "ΔL = 4×10⁻¹⁸ m detected over 4 km arms"
- **0:06** — "Fabry-Pérot: 280 bounces, 100 kW stored power"
- **0:12** — "Dark fringe: P_out ~ (2πΔL/λ)² × P_in"
- **0:20** — "Noise floor: shot noise, radiation pressure, seismic"
- **0:28** — "Squeezing: beat quantum limit by √10"
- **0:36** — "Signal recycling: SNR boost at f_SR = 350 Hz"
- **0:44** — "GW150914: SNR = 23.6, Sept 14, 2015"

## End Card
Final 3 seconds: the GW150914 strain signal with matched filter overlay, CodedLaws logo centered. CTA: "Full video → How LIGO Works."

## Audio
Clean, precise electronic ambient at 90 BPM. Laser hum as background sound effect. Ping on each mirror reflection in the cavity animation. The actual GW150914 audio chirp plays at the detection moment. No voiceover.

## Production Notes
Renderer: Three.js top-down LIGO schematic with laser beam as Line geometry with glow shader. Fabry-Pérot simulation: round-trip phase accumulation computed analytically. Noise budget: Matplotlib semilogy plot using LIGO design sensitivity data. GW150914 data: GWOSC H1 strain data. Squeezing visualization: Wigner function via NumPy FFT. 60 fps, 1080×1920.
