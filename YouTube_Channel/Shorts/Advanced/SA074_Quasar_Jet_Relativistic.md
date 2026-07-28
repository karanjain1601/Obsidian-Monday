---
title: "Quasar Jet — Relativistic Plasma Beam"
id: SA074
type: youtube-short
duration: "~45 seconds"
feeds_video: "Relativistic Jets: From Quasars to Blazars"
difficulty: advanced
tags: [physics, simulation, short, advanced, quasar, relativistic-jet, AGN, plasma]
---

> **What it is:** A ~45-second simulation showing a relativistic RMHD quasar jet propagating through the IGM with Kelvin-Helmholtz instabilities along the sheath and bright knots moving at apparent superluminal velocities. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Relativistic Jets: From Quasars to Blazars

# Short: Quasar Jet — Relativistic Plasma Beam

**Feeds full video:** Relativistic Jets: From Quasars to Blazars

## Visual Hook (First 3 Seconds)
A supermassive black hole (black sphere, M = 10⁹ M_☉) at center, surrounded by a swirling accretion disk (orange-gold gradient). From the black hole poles: two brilliant blue-white jets (30 kpc long shown at scale) shooting outward at v = 0.995c. Lorentz factor: "γ = 10" glows in cyan. The jets are narrowly collimated — opening angle θ < 1°.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Blandford-Znajek mechanism: a rotating Kerr black hole (spin a = 0.95M) has magnetic field lines (gold spirals) threading its ergosphere. Frame dragging winds the field lines, launching a Poynting flux jet: P_jet = (κ/4π c)·Φ_BH²·Ω_H² where Ω_H = a/(2Mr_+). For M = 10⁹ M_☉, a = 0.95M, B = 10⁴ T: P_jet = 10³⁸ W.

**0:10–0:18** — The jet structure: from inside out — magnetically dominated spine (white, B² > ρc²), a sheath of entrained material (blue), and a cocoon of shocked gas (red). The jet Lorentz factor Γ(r): starts at 100 near the BH, decelerates to Γ = 10 at kpc scales (shown as a Γ vs r plot). Magnetic field decays as B ∝ r⁻¹.

**0:18–0:26** — Superluminal motion: a component within the jet moves at v = 0.995c at angle θ_obs = 3° to the line of sight. The apparent transverse velocity: v_app = v sin θ/(1 − v cos θ/c). For these values: v_app = 0.995c × sin 3°/(1 − 0.995 × cos 3°) = 0.052/(0.005) = 10.4c. The text "Superluminal motion: 10.4c — faster than light!?" pops up. Diagram shows the geometric projection that causes this illusion.

**0:26–0:34** — Synchrotron radiation: relativistic electrons (E = 10 GeV) spiral around the jet's magnetic field (B = 10⁻⁸ T at kpc scale). Synchrotron power: P = (4/3)σ_T c γ² U_B. Peak frequency: ν_c = (3/2)γ²eB/(2πm_e c) = 3 GHz (radio band) for γ = 10⁴. The resulting spectral energy distribution (power-law S_ν ∝ ν^(−0.7)) is plotted, showing radio → X-ray emission.

**0:34–0:42** — Jet termination: at 100 kpc, the jet rams into the intergalactic medium. A bright hotspot (gold) forms where the jet decelerates (Mach disk). The backflowing material creates radio lobes (two symmetric oval structures, shown in red). Total jet kinetic power: L_jet = 10³⁸ W, lobe age: 10⁸ years. This is a classical FR II radio galaxy morphology.

**0:42–0:50** — The blazar alignment: when the jet points directly toward us (θ = 0°), relativistic beaming enhances the flux by δ^4 where δ = 1/(Γ(1−β cos θ)) = 2Γ. For Γ = 10: δ = 20, enhancement = 20⁴ = 160,000×. The blazar (3C 454.3) appears as a point source dominating all wavelengths. "Doppler boosting: 160,000× flux enhancement." Fade to CodedLaws logo.

## Physics Concept Teased
Relativistic jets from quasars are powered by the Blandford-Znajek mechanism — the rotational energy of a Kerr black hole extracted by magnetic fields threading the ergosphere. Lorentz factors of 10–100 cause superluminal apparent motion and extreme Doppler boosting, making blazars (face-on jets) among the brightest objects in the sky.

## On-Screen Text / Captions
- **0:00** — "Jet: γ = 10, v = 0.995c, P = 10³⁸ W"
- **0:06** — "Blandford-Znajek: spin energy → Poynting flux"
- **0:12** — "Γ decays from 100 to 10 over kpc"
- **0:20** — "Superluminal: v_app = 10.4c (geometric illusion)"
- **0:28** — "Synchrotron: S_ν ∝ ν^(−0.7), radio to X-ray"
- **0:36** — "Hotspot + lobes: 100 kpc, 10⁸ year old"
- **0:44** — "Blazar: 160,000× Doppler boosted"

## End Card
Final 3 seconds: the twin jets shooting from the central black hole, CodedLaws logo centered. CTA: "Full video → Relativistic Jets from Quasars."

## Audio
Powerful electronic orchestral at 90 BPM. Jet whoosh sound growing from deep bass to high-pitched shriek. Beaming effect: instantaneous volume boost on blazar view. No voiceover.

## Production Notes
Renderer: Three.js for jet geometry (cone + torus accretion disk). Jet emission: particle system with synchrotron color mapping. Superluminal motion: animated tracer dot with projected coordinate computation. SED: Matplotlib log-log plot. BZ mechanism magnetic spiral: custom GLSL field-line shader. 60 fps, 1080×1920.
