---
title: "Electroosmosis — Fluid Driven by Electric Field"
id: SM124
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Microfluidics_Full]]"
difficulty: medium
tags: [physics, simulation, short, electrokinetics, microfluidics, fluid-dynamics, electrostatics]
---

> **What it is:** A ~45-second simulation short where an applied voltage moves an entire column of saline in a glass microchannel as a perfectly flat plug flow — driven by electric-field forces on counterions in the nanometre-thin Debye layer — contrasted with the dispersion-prone parabolic profile of pressure-driven flow. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Microfluidics_Full]]

# Short: Electroosmosis — Fluid Driven by Electric Field
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A glass microchannel — a hair-thin tube — carries saline. Electrodes touch each end. No pump. No pressure. Then the electric field switches on, and the entire column of fluid begins to move, plug-like, with a perfectly flat velocity profile — completely unlike pressure-driven flow. The liquid is being dragged by ions at the wall.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Zoomed-in cross-section of a glass microchannel (width 50 μm). Channel walls carry a negative surface charge (anionic silanol groups, shown as small red minus signs lining the walls). Counterions (positive, blue dots) accumulate at the wall — forming the Electric Double Layer (EDL). EDL thickness: Debye length λ_D = √(ε₀εkT/2n_∞e²z²) ~ 1–100 nm shown as a thin glowing blue layer.
- **0:10–0:18:** Electric field E applied horizontal (left to right). Positive counterions in the EDL experience F = qE force rightward. They drag the fluid (viscous coupling) within the EDL. Since the EDL is thin relative to the channel, the entire bulk fluid appears to slip at the wall and move as a plug flow: u_EOF = -ε₀εζE/μ (Helmholtz-Smoluchowski equation). Zeta potential ζ labeled.
- **0:18–0:28:** Velocity profile comparison side-by-side: pressure-driven flow (Poiseuille — parabolic, fast center, zero walls) in red, vs. electroosmotic flow (perfectly flat plug profile, uniform u_EOF across the width) in blue. The two profiles are dramatically different. In a microfluidic chip, plug flow avoids Taylor dispersion that degrades separations.
- **0:28–0:38:** Stacking zone: a fluorescent dye band injected at the inlet. Under pressure drive (red): the dye band stretches into a broad parabolic slug — severe dispersion. Under EOF (blue): the dye band travels as a compact, sharp plug, essentially undeformed. For capillary electrophoresis applications, this makes separation 10× sharper.
- **0:38–0:45:** Lab-on-chip animation: a microfluidic chip with branching channels. EOF pumps fluid through one branch; electrophoresis separates DNA fragments in another. All without moving parts. Text: "Your gene sequencer uses electroosmosis."

## Physics Concept Teased
Electroosmosis arises from the interaction between an applied electric field and the diffuse counterion cloud (the Electric Double Layer, EDL) at a charged channel wall. The electric body force on the excess charge in the EDL drags the bulk fluid as a viscous plug flow, described by the Helmholtz-Smoluchowski equation: u_EOF = -ε₀εζE/μ. The plug velocity profile eliminates hydrodynamic dispersion, making it ideal for analytic separations in microfluidics.

## On-Screen Text / Captions
- **0:00:** "No pump. Just voltage — and the entire fluid column moves as one."
- **0:08:** "Debye layer: the charged skin on the wall"
- **0:15:** "u_EOF = −ε₀εζE / μ  (Helmholtz-Smoluchowski)"
- **0:22:** "Plug flow: flat profile — no dispersion"
- **0:30:** "vs. pressure drive: parabolic → smeared sample"
- **0:38:** "EOF keeps DNA bands sharp in gene sequencers."
- **0:44:** "Your lab-on-a-chip runs on electroosmosis."

## End Card
Final 3 seconds: the sharp fluorescent dye plug moving through a microchannel — a glowing cyan stripe against dark background. Text: "The smallest pump is no pump at all." Channel logo.

## Audio
High-pitched electronic hum when the voltage switches on (0:03). Clean, clinical ambient music — minimal, slightly cold. Voiceover (precise, focused): "At the microscale, surfaces dominate volume. A charged wall can move a river — silently." Soft electrical click at each voltage toggle.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D + p5.js. Key algorithm: 2D Poisson-Boltzmann for EDL structure: ∇²φ_EDL = -(ze/ε₀ε)·(n⁺ - n⁻), with n± = n_∞·exp(∓zeφ/kT). Debye-Hückel linearization (valid for ζ < 25 mV): φ(y) = ζ·cosh(y/λ_D)/cosh(h/λ_D). EOF velocity from Stokes equation: μ·d²u/dy² = ε₀ε·d²φ/dy²·E_x → u(y) = -(ε₀εE_x/μ)·(φ(y) - ζ). Visualize EDL as glowing layer within 1–10 nm of wall (zoom ×10,000 for rendering). Tracer dye: passive scalar advected by velocity field. Comparison: add pressure-driven Poiseuille flow to same scalar advection. Gotcha: the EDL is typically 1-100 nm thick in a 50μm channel — must zoom in dramatically to show the EDL physics, then zoom out to show the bulk plug flow separately.
