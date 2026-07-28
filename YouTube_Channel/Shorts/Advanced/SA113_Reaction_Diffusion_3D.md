---
title: "Reaction-Diffusion Body Plan: Turing in 3D"
id: SA113
type: youtube-short
duration: "~45 seconds"
feeds_video: "Turing Patterns in 3D: Reaction-Diffusion and Animal Body Plans"
difficulty: advanced
tags: [physics, simulation, short, advanced, turing-pattern, reaction-diffusion, morphogenesis, 3d, body-plan]
---

> **What it is:** A ~45-second simulation showing a 3D Gray-Scott reaction-diffusion system evolving from a random perturbation to form coral-like branching, sponge, and labyrinthine Turing patterns driven by differential diffusivities. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Turing Patterns in 3D: Reaction-Diffusion and Animal Body Plans

# Short: Reaction-Diffusion Body Plan — Turing in 3D

**Feeds full video:** Turing Patterns in 3D: Reaction-Diffusion and Animal Body Plans

## Visual Hook (First 3 Seconds)
A 3D sphere (embryo-like, grey). Reaction-diffusion equations activate: bright orange spots emerge on its surface, then stripes, then irregular labyrinthine mazes — cycling through pattern types in 3 seconds. Text: **"Same math. Zebra. Leopard. Coral."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — 3D sphere surface (radius = 50 µm, 256×128 UV-mapped texture grid). Random initial noise (white noise, amplitude = 0.01) seeded. Activator u concentration shown: uniform pale blue initially.
- **0:10** — Pattern emergence: Gierer-Meinhardt equations integrate. Activator u (orange) begins forming spots separated by ~20 µm. Inhibitor v (blue) clouds surround each orange spot, suppressing neighbors. By t=200, **"N = 47 spots"** visible.
- **0:18** — Parameter sweep live: slider control changes D_v/D_u ratio. At D_v/D_u = 10: spots (leopard). At D_v/D_u = 6: stripes (zebra). At D_v/D_u = 4: labyrinthine (coral). Each transition shown as morphing surface texture.
- **0:27** — 3D volumetric extension: patterns inside a 64³ voxel cube. Cross-sections shown (XY, XZ, YZ planes). 3D activator field forms interconnected lamellae (thin sheets). False-color: orange = high activator, dark = low. Label: **"3D Turing: sheets not spots."**
- **0:36** — Biological comparison split screen: (left) simulation spot pattern on sphere surface with 47 orange spots; (right) cheetah fur photograph showing 52 spots per flank. Scale bars both at 5 cm. Wavelength match: **"λ_sim = 1.8 cm, λ_bio = 1.9 cm."**
- **0:44** — Reaction speed comparison: standard RD (left) takes 500 time steps; wave-pinning variant (right) reaches steady pattern in 80 time steps. Label: **"Speed 6× faster with wave-pinning mechanism."**

## Physics Concept Teased
Turing patterns arise when an activator diffuses slowly and stimulates its own production, while a fast-diffusing inhibitor suppresses it at distance — this short-range activation/long-range inhibition creates a characteristic wavelength determined by the ratio D_v/D_u, producing spots, stripes, or labyrinths.

## On-Screen Text / Captions
- **0:00** — "Turing predicted animal stripes in 1952 — using math"
- **0:10** — "Activator grows; inhibitor suppresses at a distance"
- **0:20** — "Spots, stripes, or labyrinths — one parameter changes all"
- **0:30** — "In 3D: the patterns form sheets inside the tissue"
- **0:38** — "Wavelength matches real animal fur — 1.9 cm"
- **0:45** — "Full 3D Turing simulation → bio"

## End Card
Final 3 seconds: sphere with cheetah-spot pattern and bio photo side by side. **"CodedLaws — Mathematical Biology"** text.

## Audio
Organic, pulsing synth at 60 BPM. Soft bubble pop SFX at each new spot formation. No voiceover.

## Production Notes
Renderer: Gierer-Meinhardt RD on sphere UV grid (Python/NumPy). Equations: ∂u/∂t = D_u∇²u + ρu²/v − μu + ρ₀; ∂v/∂t = D_v∇²v + ρu² − νv. D_u = 0.005, D_v = 0.2, ρ = 0.01, μ = 0.02, ν = 0.03. Sphere Laplacian via cotangent weights on triangular mesh. 3D: same equations on 64³ voxel grid. Output 1080×1920, 60 fps.
