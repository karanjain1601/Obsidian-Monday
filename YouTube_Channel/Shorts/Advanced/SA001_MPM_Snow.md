---
title: "MPM Snow: Drucker-Prager Yield Surface"
id: SA001
type: youtube-short
duration: "~45 seconds"
feeds_video: "Material Point Method: Snow, Sand, and Fracture"
difficulty: advanced
tags: [physics, simulation, short, advanced, mpm, snow, plasticity, continuum-mechanics]
---

> **What it is:** A ~45-second simulation showing 80,000 snow particles slamming into a wall, compressing, fracturing, and spraying under Drucker-Prager yield-surface plasticity -- the same algorithm used in Disney's Frozen. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Material Point Method: Snow, Sand, and Fracture

# Short: MPM Snow — Drucker-Prager Plasticity

**Feeds full video:** Material Point Method: Snow, Sand, and Fracture

## Visual Hook (First 3 Seconds)
A pristine white snowball (RGB 245, 248, 255) travelling at 12 m/s slams into a dark-grey rigid wall (#1a1a2e). On contact, it explodes into 80,000 glowing cyan material points that splatter and settle with realistic compaction. Frame freezes on the splatter pattern.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Split screen: left shows particle positions coloring from white (elastic, strain < 0.02) to red (plastic, strain > 0.15). Right shows the Drucker-Prager yield cone in principal-stress space, axes labeled σ₁, σ₂, σ₃.
- **0:10** — Zoom into yield cone. A stress path (bright yellow arrow) travels inside the cone (elastic), then hits the cone surface and projects back radially (return mapping flash, orange glow).
- **0:18** — Snowball compression demo: a flat grey plate descends at 2 m/s onto a cylindrical snow column. Particles bulge outward at the base; color heatmap shows equivalent plastic strain accumulating (blue → green → red over 0.3 s).
- **0:27** — Equation panel fades in: **σ_trial → σ_return = σ_trial − 2μ Δε^p** with each term labelled in white sans-serif on #0d1b2a background.
- **0:35** — Full avalanche scene: snow flows down a 30° slope, hits three rigid spheres (gold), and wraps around them. Particle color maps velocity magnitude 0–8 m/s (blue → red). Vortex-like swirling visible near sphere wakes.
- **0:43** — Slow-motion freeze at 0.05× speed. A single clump of ~500 particles pinches off. White outline highlights the cohesion zone.

## Physics Concept Teased
The Drucker-Prager yield surface defines the pressure-dependent boundary between elastic recovery and permanent plastic deformation, allowing MPM snow to compress, flow, and fracture just like real packed snow.

## On-Screen Text / Captions
- **0:00** — "80,000 snow particles. One yield surface." (white, top-center)
- **0:10** — "Inside the cone = elastic" (yellow, pointing to cone interior)
- **0:10** — "Outside = plastic flow" (red, pointing to cone exterior)
- **0:27** — "Return mapping keeps stress on the yield surface" (white, bottom bar)
- **0:35** — "Drucker-Prager plasticity" (cyan title, center-fade)
- **0:43** — "Full breakdown in the long video ↑" (white, bottom)

## End Card
Final 3 seconds: the avalanche settles into a glowing snowfield. Text "CODED LAWS" pulses in icy blue. Subscribe button animates in bottom-right. URL "codedlaws.com/mpm" appears in small white text.

## Audio
Ambient icy wind at 60 BPM with a low synth drone; crunching impact sfx at 0:00; subtle "ping" on each equation label at 0:27; wind fades to silence at 0:43. No voiceover — captions carry all information.

## Production Notes
Renderer: custom CUDA MPM (Taichi-lang backend). Grid resolution 256³. Time step Δt = 1×10⁻⁴ s, 20 substeps/frame. Drucker-Prager parameters: friction angle φ = 38°, cohesion c = 0 Pa. Particle visualisation via Houdini point cloud with Gaussian splatting shader. Render time ~4 min/frame on RTX 4090.
