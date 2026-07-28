---
title: "Alfvén Wave — Magnetic Tension Oscillation"
id: SM105
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[MHD_Waves_Full]]"
difficulty: medium
tags: [physics, simulation, short, plasma, MHD, waves, magnetism]
---

> **What it is:** A ~45-second simulation short where a magnetic field line is plucked like a guitar string, launching a transverse Alfvén wave that propagates along the field at the Alfvén speed through a magnetized plasma, with applications to solar coronal heating. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[MHD_Waves_Full]]

# Short: Alfvén Wave — Magnetic Tension Oscillation
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A single straight magnetic field line — glowing electric blue, taut as a guitar string — stretches horizontally across the screen. A hand-like perturbation plucks it sideways. The field line wobbles, and a transverse wave ripples along it at enormous speed, carrying plasma with it.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Uniform background plasma (grey, semi-transparent) threaded by parallel blue magnetic field lines running left-to-right. Field strength B₀ and plasma density ρ labels appear. Alfvén speed formula: v_A = B₀/√(μ₀ρ) shown in the corner.
- **0:10–0:18:** Localized transverse perturbation applied at the left boundary — a sinusoidal displacement in the y-direction (perpendicular to B). The perturbation launches a shear Alfvén wave packet traveling rightward. Plasma displacement shown as white arrows on each field line element.
- **0:18–0:28:** The wave packet propagates. Color-coded magnetic tension force (restoring, in cyan) and plasma inertia (in orange) shown as force arrows. The field lines bow and snap back. A real guitar string animation ghosted underneath for analogy — same restoring mechanism, different medium.
- **0:28–0:38:** Parameter sweep: B doubles → v_A doubles → wave moves at double speed. Then ρ quadruples → v_A halves → wave slows. Visual side-by-side: fast wave (bright blue) vs. slow wave (dim blue) on split screen.
- **0:38–0:45:** Application: the solar wind. A visualization of the Sun with Alfvén waves propagating outward along coronal magnetic field lines — rippling the solar corona in observed EUV wavelengths. "Alfvén waves heat the corona" text appears.

## Physics Concept Teased
An Alfvén wave is a transverse MHD wave that travels along magnetic field lines, driven by magnetic tension as the restoring force. The Alfvén speed v_A = B/√(μ₀ρ) plays the same role as string tension/linear density in a vibrating string. These waves are fundamental to space plasmas — they carry energy from the solar photosphere into the corona and may explain coronal heating.

## On-Screen Text / Captions
- **0:00:** "A magnetic field line, plucked like a guitar string."
- **0:08:** "v_A = B / √(μ₀ρ)"
- **0:15:** "Transverse wave — field bends, plasma follows"
- **0:22:** "Magnetic tension is the restoring force"
- **0:30:** "Double B → double wave speed"
- **0:38:** "Alfvén waves heat the Sun's corona"
- **0:44:** "Discovered by Hannes Alfvén — Nobel Prize 1970."

## End Card
Final 3 seconds: a corona image (EUV 171 Å style — teal plasma loops) with sinusoidal Alfvén wave overlaid pulsing along the loops. Text: "The Sun plays these strings every second." Channel logo.

## Audio
Single plucked guitar string sound at 0:03 (the perturbation). Low-frequency sustained hum (magnetic field ambience). Voiceover (warm, curious): "The same physics that vibrates a guitar string vibrates the Sun's magnetic field — just at a million times the speed." Gentle ethereal pad throughout.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: 1D shear Alfvén wave solver — linearized MHD: ∂²ξ/∂t² = v_A²·∂²ξ/∂x². Discretize with leapfrog scheme on a 512-point 1D grid. Multiple parallel field lines (20–30) with y-displacement driven by wave solution. B₀ displayed as background arrow field. For the parameter sweep, run three simulations at different v_A values simultaneously. For the corona visualization: use a static curved coronal loop image with superimposed oscillation modeled as sinusoidal displacement of the loop path. Gotcha: the wave is non-compressive — density doesn't change. Explicitly show ∇·B = 0 constraint satisfied to educate viewers.
