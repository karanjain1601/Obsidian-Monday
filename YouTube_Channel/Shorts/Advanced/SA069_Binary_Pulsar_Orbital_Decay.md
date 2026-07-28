---
title: "Binary Pulsar — Orbital Decay from GW Radiation"
id: SA069
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Hulse-Taylor Binary Pulsar: Indirect Proof of Gravitational Waves"
difficulty: advanced
tags: [physics, simulation, short, advanced, gravitational-waves, pulsar, binary-system, orbital-decay]
---

> **What it is:** A ~45-second simulation showing the Hulse-Taylor binary pulsar orbital period decaying over decades plotted against the general relativistic prediction from gravitational wave energy loss. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Hulse-Taylor Binary Pulsar: Indirect Proof of Gravitational Waves

# Short: Binary Pulsar — Orbital Decay from GW Radiation

**Feeds full video:** The Hulse-Taylor Binary Pulsar: Indirect Proof of Gravitational Waves

## Visual Hook (First 3 Seconds)
Two neutron stars (bright white spheres, each 10 km radius) orbit each other in a tight ellipse. The orbital period: "P = 7.75 hours" shown in cyan. Radio pulses (bright white flash every 59 ms) beam from PSR B1913+16. The orbit visibly shrinks over the animation — the period decreases by "76.5 μs/year." Nobel Prize 1993 logo appears.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The PSR B1913+16 system parameters displayed: M₁ = 1.438 M_☉ (pulsar), M₂ = 1.390 M_☉ (companion), orbital period P = 7.75165 hr, eccentricity e = 0.617, semi-major axis a = 1.95 R_☉. The highly elliptical orbit is drawn (elongated ellipse with eccentricity visualized). At periastron (closest approach), the separation is 1.1 R_☉ — the two stars pass each other at 0.3% of light speed.

**0:10–0:18** — The Peters formula for orbital decay: dP/dt = −(192π/5)·(G M_chirp)^(5/3)·(2π/P)^(8/3)·f(e)/c⁵ where M_chirp = (M₁M₂)^(3/5)/(M₁+M₂)^(1/5) = 1.228 M_☉. The eccentricity enhancement factor f(e) = (1 + 73/24·e² + 37/96·e⁴)·(1-e²)^(-7/2) = 11.85 for e=0.617. Computed result: dP/dt = −2.402×10⁻¹² (dimensionless). Observed: −2.423×10⁻¹² — agreement to within 0.87%.

**0:18–0:26** — The cumulative orbital decay plot: x-axis = year (1974–2020), y-axis = cumulative orbital period shift in seconds. The GR prediction (gold dashed curve, parabolic: ΔP_total ∝ −t²) overlaid on the actual measured data points (white dots with error bars). Every data point falls exactly on the gold parabola — confirming GW emission over 46 years.

**0:26–0:34** — The gravitational wave power emitted: P_GW = (32G⁴/5c⁵)·(M₁M₂)²(M₁+M₂)/r⁴ for a circular orbit. At periastron of B1913+16: P_GW_peak = 7.35×10³³ W = 1.9×10⁷ L_☉ (7 billion Suns' worth of power). Shown as a bar chart comparing to the Sun (1 L_☉), the entire Milky Way (10¹⁰ L_☉), and the peak GW power (10⁷ L_☉). The visual illuminates scale.

**0:34–0:42** — Pulsar timing: PSR B1913+16 emits a pulse every 59.0 ms. Arrival times are measured to microsecond precision. The Shapiro delay (light bending by companion's gravity) is shown as a sinusoidal delay of ~2 μs varying with orbital phase. The post-Newtonian parameters (γ = 0.4307 ± 0.0004) measured from the timing data — checking GR with precision tests.

**0:42–0:50** — Final countdown: at the current decay rate, the system will merge in 300 million years. The orbit shrinks dramatically in a final animation: the period drops from 7.75 hr to 0. The merger event: two neutron stars collide in a kilonovae explosion (gold flash). Text: "Merger in 300 million years — GW + kilonova." Fade to CodedLaws logo.

## Physics Concept Teased
The Hulse-Taylor binary pulsar decays due to energy loss from gravitational wave emission. The measured orbital period decrease matches the Peters formula prediction to 0.2%, providing the first indirect observational evidence for gravitational waves and winning the 1993 Nobel Prize in Physics.

## On-Screen Text / Captions
- **0:00** — "PSR B1913+16: P = 7.75165 hr, e = 0.617"
- **0:06** — "Chirp mass M_chirp = 1.228 M_☉"
- **0:12** — "Peters formula: dP/dt = −2.402×10⁻¹² (GR prediction)"
- **0:20** — "46-year data: GR prediction confirmed to 0.87%"
- **0:28** — "Peak GW power: 7.35×10³³ W = 10⁷ L_☉"
- **0:36** — "Shapiro delay: 2 μs → post-Newtonian test"
- **0:44** — "Merger in 300 Myr → GW + kilonova"

## End Card
Final 3 seconds: the two neutron stars spiraling together with the orbital decay parabola inset, CodedLaws logo centered. CTA: "Full video → Binary Pulsar and Gravitational Waves."

## Audio
Rhythmic electronic at 100 BPM, with pulsar ticking at 16.9 Hz (59 ms period) as a metronome. Soft orbital whoosh sounds. Building crescendo as merger approaches. No voiceover.

## Production Notes
Renderer: Three.js for two-body orbital dynamics (Kepler orbit, ellipse integrated with scipy). Peters formula computed analytically with eccentricity corrections. Timing residual plot and cumulative shift: Matplotlib with real Hulse-Taylor data (from published ATNF data). GW power bar chart: D3.js logarithmic scale. 60 fps, 1080×1920.
