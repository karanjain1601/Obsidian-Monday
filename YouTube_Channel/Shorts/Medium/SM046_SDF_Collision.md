---
title: "SDF Collision Detection — Smooth Object Merging"
id: SM046
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, SDF, collision-detection, signed-distance-field, merging]
---

> **What it is:** A ~45-second simulation short where glowing mercury spheres drift together and smoothly merge without seams — then split into three — using Signed Distance Fields and a smooth-minimum function to blend surfaces in real time. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: SDF Collision Detection — Smooth Object Merging

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Two glowing liquid mercury spheres drift toward each other in slow motion. As they touch — instead of bouncing — they smoothly merge, their surfaces flowing together in a perfect union. Then the merged blob splits into three. Each transition is perfectly smooth, no sharp seams.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — SDF (Signed Distance Field) shown for a sphere: a scalar field where every point in space stores its distance to the sphere surface. Inside: negative value. Outside: positive. On the surface: zero. The iso-surface (level set = 0) is the sphere. Caption: "SDF: every point stores distance to surface."

**0:10–0:18** — Two SDFs combined: SDF_union = min(SDF_A, SDF_B). The iso-surface of the union is the merged shape. Shown as a real-time 3D render: two spheres approaching, min-union computed each frame, surface extracted via Marching Cubes or ray-marching. Caption: "Union: min(SDF_A, SDF_B)."

**0:18–0:27** — Smooth union: smin(SDF_A, SDF_B, k) where smin is the smooth minimum (polynomial blend). The k parameter controls the blend radius. k=0: sharp union. k=0.5: smooth merge. k=1.0: very smooth merge. Caption: "smin with k=0.5 — smooth merging."

**0:27–0:36** — SDF operations gallery: union (merge), intersection (keep overlap only), difference (subtract one from another). Three blob operations shown with labels. Then smooth versions of each. Caption: "3 boolean operations → 6 smooth operations."

**0:36–0:45** — Complex scene: 20 SDF spheres of different sizes floating and merging in slow motion. The merged metaball shapes are organic and smooth. A fast ray-marcher renders the scene at 60fps. Bold text: "SDF — compact, smooth, GPU-friendly." Fade to black.

## Physics Concept Teased
Signed Distance Fields (SDF): every point in space stores its signed distance to the nearest surface. SDFs enable smooth boolean operations, efficient ray-marching for rendering, and fast collision queries (nearest-surface normal from gradient of SDF). Smooth minimum functions create organic merging transitions.

## On-Screen Text / Captions
- **0:00** — "Two spheres. They merge smoothly."
- **0:05** — "SDF: inside = negative; outside = positive"
- **0:12** — "Union: min(SDF_A, SDF_B)"
- **0:20** — "Smooth union: smin(SDF_A, SDF_B, k)"
- **0:28** — "3 boolean ops → 6 smooth variants"
- **0:35** — "20 SDF blobs — ray-marched at 60fps"
- **0:43** — "SDF — the geometry of smooth physics."

## End Card
Final 3 seconds: 20 merging SDF spheres, rendered with subsurface scattering, deep amber colour. Text: "SDFs power every modern GPU renderer — Unreal, Unity, Blender Cycles." CodedLaws logo.

## Audio
Smooth, fluid electronic ambient (75 BPM). Liquid merging sound effect — soft "blorp" when spheres merge. Splitting sound: gentle "pop." Voiceover at 0:00: "A signed distance field stores the distance to a surface at every point in space — enabling perfectly smooth collisions and merges." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: WebGL fragment shader (ray-marching). Key algorithm: ray-marching through SDF scene: for each pixel, cast a ray; step along it by the SDF value at current position (guaranteed safe step size); stop when SDF < 0.001 (hit surface). smin function: smin(a,b,k) = min(a,b) - k²/(4·|a-b|) (polynomial smooth min). Metaballs: classical approach uses 1/r² potential — equivalent to smooth SDF union. Scene: 20 spheres with sinusoidal positions. Normal: gradient of SDF via finite differences. Shading: Phong + Fresnel. Runtime: real-time WebGL fragment shader at 60fps for 20 SDFs.
