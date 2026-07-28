---
title: "Seismic Wave Reflection and Refraction"
id: SM092
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, seismology, reflection, refraction, snells-law, geophysics]
---

> **What it is:** A ~45-second simulation short where a surface P-wave source strikes a subsurface velocity interface and splits into reflected and critically refracted head-wave branches obeying Snell's law, with travel-time curves showing how geophysicists use impedance contrasts to X-ray the Earth for oil and gas exploration. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Seismic Wave Reflection and Refraction

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A cross-section of the Earth — top layer grey (low velocity), bottom layer darker (high velocity). A point source at the surface fires a P-wave downward. In 3 seconds: some of the wave reflects straight back up (reflected wave), some bends at the interface and continues downward at a different angle (refracted wave).

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Snell's law for elastic waves: sin(θ₁)/V₁ = sin(θ₂)/V₂. Incident angle θ₁ in the upper layer (V₁); refracted angle θ₂ in the lower layer (V₂ > V₁). Shown geometrically. Caption: "Snell's law: sin θ₁/V₁ = sin θ₂/V₂."

**0:10–0:18** — Reflection coefficient: R = (ρ₂V₂ - ρ₁V₁)/(ρ₂V₂ + ρ₁V₁). This is the acoustic impedance contrast. High impedance contrast → strong reflection. The transmitted amplitude: T = 2ρ₁V₁/(ρ₂V₂ + ρ₁V₁). Caption: "Reflection coefficient R: impedance contrast."

**0:18–0:27** — Critical refraction: at the critical angle θ_c = arcsin(V₁/V₂), the refracted wave travels along the interface (head wave). This head wave runs at V₂ and re-radiates upward at angle θ_c. On the surface: it arrives first at distances x > x_cross (cross-over distance). Caption: "Critical angle θ_c = arcsin(V₁/V₂) → head wave."

**0:27–0:36** — Multiple layers: the simulation adds a third layer (even faster). Multiple reflections from the two boundaries criss-cross the domain. Multiple head waves visible. Shown: the simulated travel-time curves (time vs distance from source) for each wave. Caption: "Multiple layers → multiple travel-time branches."

**0:36–0:45** — Application: reflection seismic profiling (oil and gas exploration). A ship fires an airgun at the ocean surface, receives reflections at hydrophones. The reflection pattern reveals subsurface layer geometry. Caption: "Seismic profiling: oil and gas exploration." Bold text: "Seismic reflection — X-raying the Earth." Fade to black.

## Physics Concept Teased
Seismic reflection and refraction: at an impedance contrast, seismic waves split into reflected and refracted components obeying Snell's law. At the critical angle, a head wave runs along the interface at the faster velocity. By measuring arrival times at different distances, geophysicists can reconstruct subsurface velocity structure — the basis of seismic exploration.

## On-Screen Text / Captions
- **0:00** — "An elastic wave hits a boundary — what happens?"
- **0:05** — "Snell's law: sin θ₁/V₁ = sin θ₂/V₂"
- **0:12** — "R = (Z₂-Z₁)/(Z₂+Z₁) — impedance contrast"
- **0:20** — "Critical angle: head wave runs along interface"
- **0:28** — "Multiple layers: multiple travel-time branches"
- **0:35** — "Seismic profiling: map underground structure"
- **0:43** — "Seismic reflection — X-raying the Earth."

## End Card
Final 3 seconds: travel-time plot with direct, reflected, and head wave branches clearly labeled. Text: "The oil and gas industry uses this to find reservoirs 5 km underground." CodedLaws logo.

## Audio
Deep rumbling with clear echoes (each reflected wave = echo). Voiceover at 0:00: "Seismic waves obey the same Snell's law as light — reflection and refraction at every subsurface boundary." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D with the elastic wave finite-difference simulation from SM091. Key addition: a horizontal velocity interface at depth h. Implement by having different Vp in the two layers. For clean travel-time plots: use analytical ray tracing alongside the FD simulation. Ray tracing: parametric equations for direct ray, reflected ray, and head wave. Travel times: t_direct = x/V₁; t_reflected = √(x²+4h²)/V₁; t_head = 2h cos(θ_c)/V₁ + x/V₂. Plot t vs x for all three. Highlight each in different colour. Runtime: FD simulation pre-rendered; ray-tracing travel-time plot real-time.
