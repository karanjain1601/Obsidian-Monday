---
title: Computer Graphics — Master Map of Content
aliases: [CG MOC, Graphics MOC]
tags: [Computer_Graphics, MOC, Master]
domain: Computer_Graphics
created: 2026-07-26
status: complete
---

# 🖥️ Computer Graphics — Master Map of Content

> [!abstract] Vault Overview
> A 37-note deep-dive into Computer Graphics spanning 6 sections: 2D rasterization to 3D transforms, GPU pipeline APIs (OpenGL/Vulkan/DX12/Metal), shaders (GLSL/HLSL/Compute), physically-based lighting, and animation/simulation. Each note carries formulas, Mermaid diagrams, code, and review questions for active recall.

---

## Vault Architecture

```mermaid
graph TD
    MASTER["🖥️ Computer Graphics\nMaster MOC"]:::master

    S1["📐 01 — 2D Graphics"]:::s1
    S2["🧊 02 — 3D Fundamentals"]:::s2
    S3["⚙️ 03 — Rendering Pipeline"]:::s3
    S4["✨ 04 — Shaders"]:::s4
    S5["💡 05 — Lighting & Materials"]:::s5
    S6["🎬 06 — Animation & Simulation"]:::s6

    MASTER --> S1 & S2 & S3 & S4 & S5 & S6
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> S6
    S3 --> S5
    S4 --> S5

    classDef master fill:#1a1a2e,stroke:#e94560,color:#fff,font-weight:bold
    classDef s1 fill:#16213e,stroke:#0f3460,color:#a8d8ea
    classDef s2 fill:#16213e,stroke:#e94560,color:#f5a623
    classDef s3 fill:#1a1a2e,stroke:#57a773,color:#a8e6cf
    classDef s4 fill:#16213e,stroke:#c23b22,color:#ffcccb
    classDef s5 fill:#1a1a2e,stroke:#f5a623,color:#ffe0a3
    classDef s6 fill:#16213e,stroke:#9b59b6,color:#d7bde2
```

---

## Sections Overview

| # | Section | Notes | Key Concepts | Difficulty |
|---|---------|-------|--------------|------------|
| 01 | [[_MOC_2D_Graphics\|📐 2D Graphics]] | 5 | Bresenham, Anti-aliasing, Bézier, SVG, Canvas | Beginner → Intermediate |
| 02 | [[_MOC_3D_Fundamentals\|🧊 3D Fundamentals]] | 5 | MVP Matrix, Projection, Frustum, Z-buffer | Intermediate |
| 03 | [[_MOC_Rendering_Pipeline\|⚙️ Rendering Pipeline]] | 5 | OpenGL, Vulkan, DX12, Framebuffers, Deferred | Intermediate → Advanced |
| 04 | [[_MOC_Shaders\|✨ Shaders]] | 5 | GLSL, Fragment, Compute, HLSL, Optimization | Intermediate → Advanced |
| 05 | [[_MOC_Lighting_and_Materials\|💡 Lighting & Materials]] | 5 | Phong, PBR, Ray Tracing, GI, Textures | Advanced |
| 06 | [[_MOC_Animation_and_Simulation\|🎬 Animation & Simulation]] | 5 | Skinning, Morph Targets, Physics, Cloth, Proc Gen | Advanced |

---

## Learning Paths

### Path A — Absolute Beginner
1. [[Rasterization_Algorithms|Rasterization Algorithms]] → [[Anti_Aliasing|Anti-Aliasing]] → [[Bezier_and_Bsplines|Bézier Curves]] → [[SVG_and_Vector_Graphics|SVG]] → [[Canvas_2D_API|Canvas 2D API]]

### Path B — 3D Graphics Foundation
1. [[Coordinate_Systems_and_Handedness|Coordinate Systems]] → [[3D_Transforms_and_Matrices|3D Transforms]] → [[Projection_and_Viewing|Projection & Viewing]] → [[Frustum_Culling_and_Clipping|Frustum Culling]] → [[Depth_Buffering_and_Precision|Depth Buffering]]

### Path C — GPU Programming
1. [[OpenGL_Core_Profile|OpenGL Core]] → [[GLSL_Vertex_Shaders|GLSL Vertex]] → [[Fragment_Shaders_and_Effects|Fragment Shaders]] → [[Vulkan_Architecture|Vulkan]] → [[Compute_Shaders_GPGPU|Compute Shaders]]

### Path D — Visual Realism
1. [[Phong_and_Blinn_Phong|Phong Lighting]] → [[Physically_Based_Rendering|PBR]] → [[Texture_Mapping_and_UV|Texture Mapping]] → [[Global_Illumination|Global Illumination]] → [[Ray_Tracing_and_Path_Tracing|Ray Tracing]]

### Path E — Real-Time Animation
1. [[Skeletal_Animation_and_Skinning|Skeletal Animation]] → [[Morph_Targets_and_Blend_Shapes|Morph Targets]] → [[Rigid_Body_Physics|Rigid Body Physics]] → [[Cloth_and_Fluid_Simulation|Cloth & Fluid]] → [[Procedural_Generation|Procedural Generation]]

---

## Cross-Vault Links

| Related Domain | Connection Point |
|---|---|
| [[../AI-ML/_MOC_AI_ML_Master\|AI/ML]] | Neural rendering, NeRF, DLSS denoising, AI upscaling |
| [[../System_Design/_MOC_SystemDesign_Master\|System Design]] | GPU resource management, streaming pipelines |
| [[../Database/_MOC_Database_Master\|Database]] | Spatial indexing (R-tree, k-d tree) used in BVH |

---

## Section MOC Index

- [[_MOC_2D_Graphics|↗ 2D Graphics MOC]] — Rasterization, anti-aliasing, curves, web graphics
- [[_MOC_3D_Fundamentals|↗ 3D Fundamentals MOC]] — Math, matrices, projection, depth
- [[_MOC_Rendering_Pipeline|↗ Rendering Pipeline MOC]] — OpenGL, Vulkan, DX12, Metal, framebuffers
- [[_MOC_Shaders|↗ Shaders MOC]] — GLSL, HLSL, compute, optimization
- [[_MOC_Lighting_and_Materials|↗ Lighting & Materials MOC]] — Phong, PBR, ray tracing, GI, textures
- [[_MOC_Animation_and_Simulation|↗ Animation & Simulation MOC]] — Skinning, physics, cloth, procedural

---

## Key Formulas at a Glance

| Formula | Domain |
|---------|--------|
| `D₀ = 2Δy − Δx` | Bresenham decision variable |
| `MVP = Projection · View · Model` | Vertex transform chain |
| `Lo(ωo) = ∫ fr(ωi,ωo) Li(ωi) (ωi·n) dωi` | Rendering equation |
| `F(θ) = F₀ + (1−F₀)(1−cosθ)⁵` | Fresnel-Schlick |
| `Sj = Mj · Bj⁻¹` | Skinning matrix (inverse-bind) |
| `fBm = Σ 0.5ⁱ · noise(2ⁱ·x)` | Fractional Brownian Motion |

---

#Computer_Graphics #MOC
