---
title: "Marangoni Flow — Soap Film"
id: SM009
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, surface-tension, marangoni, soap-film]
---

> **What it is:** A ~45-second simulation showing an iridescent soap film erupting outward from a hot spot as surface tension gradients drive fluid from warm low-tension regions toward cool high-tension regions — demonstrating Marangoni flow and the tangential stress created by surface tension differences. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Marangoni Flow — Soap Film

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A shimmering iridescent soap film fills the screen — thin-film interference colours (magenta, gold, teal) swirl in slow arcs. At 2 seconds a tiny hot spot appears in the centre, and the coloured regions rush away from it in a radial burst like an explosion in slow motion.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Diagram cuts in: soap film cross-section. Surface tension γ shown as arrows on the film surface, strongest in the cold (blue) regions, weakest in the warm (red) region. Gradient arrow: "∇γ drives flow." The Marangoni number Ma = (dγ/dT)·ΔT·L/(μα) appears.

**0:10–0:18** — Back to full-film top-down view: warm centre has low surface tension (thin dashed lines) while cold periphery has high surface tension (thick solid lines). The gradient pulls fluid outward from the warm spot — soap film thins at the centre and thickens at the edges. Colours shift: thinner = more blue-green, thicker = red-gold.

**0:18–0:27** — A second hot spot is added off-centre. The two spots interact: their flow fields meet and create a stagnation zone between them. Annotation: "Stagnation line — flow balanced."

**0:27–0:36** — Surfactant gradient demo: a drop of alcohol (low surface tension) touches the film at one edge. The film races away from the alcohol drop, dragging a visible wave. Caption: "Tears of wine — same effect." (Marangoni in wine glasses.)

**0:36–0:45** — Text overlay: "Surface tension gradient = Marangoni stress = flow." Zoomed-out view of a self-organising soap film with multiple thermal gradients creating a complex iridescent vortex map. Fade to black.

## Physics Concept Teased
Marangoni effect: surface tension varies with temperature (or concentration). Gradients in surface tension create a tangential stress that drives fluid flow from low-γ to high-γ regions. This effect drives soap film dynamics, wine tears, welding pool behaviour, and micro-droplet manipulation.

## On-Screen Text / Captions
- **0:00** — "Surface tension isn't uniform."
- **0:05** — "Hot spot → low surface tension"
- **0:12** — "Ma = (dγ/dT)·ΔT·L / (μα)"
- **0:20** — "Fluid flows from warm → cold regions"
- **0:28** — "Stagnation zone between two hot spots"
- **0:35** — "Tears of wine: Marangoni in your glass"
- **0:43** — "Marangoni flow."

## End Card
Final 3 seconds: iridescent soap film with swirling Marangoni vortices. Text: "Why wine legs form — explained." CodedLaws logo bottom right.

## Audio
Dreamy, slow ambient (65 BPM), gentle shimmering synth arpeggios. Voiceover at 0:00: "Surface tension isn't uniform — and wherever it varies, it pulls fluid along the surface." Soft liquid ripple sound effect at each hot spot addition.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D with HSL colour encoding for film thickness. Key algorithm: 2D thin-film equation ∂h/∂t + ∇·(h³∇p/3μ) = Marangoni term. Surface tension as function of temperature γ(T) = γ₀ - γ_T·T. Solve temperature field with 2D diffusion equation simultaneously. Interference colours computed from film thickness h via thin-film optics formula. Gotcha: film thickness can reach zero (film rupture) — add disjoining pressure term to prevent. Runtime: real-time, Canvas 2D at 60 fps.
