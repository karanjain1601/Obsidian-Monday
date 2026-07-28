---
title: "Gravitational Wave Polarization — h+ and h×"
id: SA067
type: youtube-short
duration: "~45 seconds"
feeds_video: "Gravitational Waves: Polarization, Detection, and Sources"
difficulty: advanced
tags: [physics, simulation, short, advanced, gravitational-waves, polarization, GR, LIGO]
---

> **What it is:** A ~45-second simulation showing a ring of test masses animated under h+ and hx gravitational wave polarizations showing the orthogonal stretch-squeeze patterns offset by 45 degrees from each other. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Gravitational Waves: Polarization, Detection, and Sources

# Short: Gravitational Wave Polarization — h+ and h×

**Feeds full video:** Gravitational Waves: Polarization, Detection, and Sources

## Visual Hook (First 3 Seconds)
A ring of 12 test masses (white dots arranged in a circle, radius 1.0) is shown. A gravitational wave arrives: the ring stretches horizontally to 1.3 and squeezes vertically to 0.77, then reverses — vertical to 1.3, horizontal to 0.77 — oscillating at 150 Hz. Text: "h+ polarization: strain h = 1×10⁻²¹, source: GW150914."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The metric perturbation: g_μν = η_μν + h_μν shown as a tensor with off-diagonal elements oscillating. For h+ polarization: h_xx = −h_yy = h·cos(ωt), h_xy = 0 (shown in white). For h× polarization: h_xx = h_yy = 0, h_xy = h·cos(ωt) (shown in gold). The two polarizations are π/4 rotations of each other.

**0:10–0:18** — Side-by-side animation of both polarizations. Left (h+, cyan): the test mass ring stretches along x then y — "plus" pattern. Right (h×, gold): the ring stretches along the 45° and 135° diagonals — "cross" pattern. Both oscillate at 150 Hz. Underneath, the strain waveform h(t) = A·cos(ωt) plotted for each, labeled with amplitude h = 10⁻²¹.

**0:18–0:26** — General GW: a binary system inspiraling (two gold dots orbiting each other, period decreasing). The emitted GW is a superposition: h = h+·(1+cos²ι)/2·cos(2Φ) + h×·cosι·sin(2Φ) where ι is inclination angle (shown as a slider). At ι=0° (face-on): circular polarization (ring traces a circle over one period). At ι=90° (edge-on): pure h+ (ring oscillates linearly).

**0:26–0:34** — The 3D visualization: the GW propagates in the z-direction (out of the screen). The transverse-traceless (TT) gauge conditions are labeled: h_iz = 0 (transverse), h_ii = 0 (traceless). The two degrees of freedom are shown as the two independent spin-2 tensor modes rotating on the screen.

**0:34–0:42** — Real data inset: GW150914 strain signal h(t) displayed for LIGO Hanford (red) and Livingston (blue). The peak strain h_peak = 10⁻²¹ at t = merger time. The frequency sweeps from 35 Hz to 250 Hz over 0.2 seconds — the classic "chirp." Reconstruction of h+ and h× from the two detector signals shown as dashed curves.

**0:42–0:50** — Final: a sky map of the GW antenna pattern F+ (left, cyan) and F× (right, gold) for an L-shaped interferometer. The patterns show four lobes each, rotated by 45°. Optimal sensitivity at θ=90°, ψ=45°. Text: "LIGO arm length: 4 km, Δl_peak = 4×10⁻¹⁸ m (1/1000 proton width)." Fade to CodedLaws logo.

## Physics Concept Teased
Gravitational waves are transverse, traceless perturbations of the spacetime metric propagating at c. They have two independent polarization modes — plus and cross — each stretching and squeezing space at the wave frequency. The relative amplitude and phase of these modes encodes the inclination and orientation of the binary source.

## On-Screen Text / Captions
- **0:00** — "h+ polarization: strain 10⁻²¹, 150 Hz"
- **0:06** — "h+: ±x/y stretch | h×: ±45° diagonal stretch"
- **0:12** — "Face-on binary: circular polarization"
- **0:20** — "TT gauge: transverse + traceless = 2 DoF"
- **0:28** — "GW150914: 35→250 Hz chirp in 0.2 s"
- **0:36** — "Reconstructed h+ and h× from two detectors"
- **0:44** — "LIGO: Δl = 4×10⁻¹⁸ m = 0.001 proton diameter"

## End Card
Final 3 seconds: the test mass ring in full h+ oscillation (cyan), CodedLaws logo centered. CTA: "Full video → Gravitational Wave Polarization."

## Audio
Clean electronic at 150 BPM matching the GW frequency. Chirp sound effect sweeping from low to high frequency. Rhythmic pulse on each strain peak. No voiceover.

## Production Notes
Renderer: Three.js for test mass ring animation. Strain applied as metric perturbation: vertex positions updated as x → x(1+h+/2), y → y(1−h+/2) per frame. Real GW150914 data loaded from GWOSC (Gravitational Wave Open Science Center). GW antenna pattern: Matplotlib polar plot. Chirp waveform: PyCBC/pycbc.waveform module. 60 fps, 1080×1920.
