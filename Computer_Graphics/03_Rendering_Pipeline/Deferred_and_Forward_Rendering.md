---
title: Deferred and Forward Rendering
aliases: [Deferred Shading, Forward Rendering, Forward+, G-buffer, Tiled Shading]
tags: [Computer_Graphics, Rendering_Pipeline, Deferred, Forward]
domain: Computer_Graphics
difficulty: Advanced
created: 2026-07-26
related: [Framebuffers_and_Render_Targets, Physically_Based_Rendering, Global_Illumination]
status: complete
---

# 💡 Deferred and Forward Rendering

> [!abstract] TL;DR
> Forward rendering shades each fragment during geometry rasterization — simple, MSAA-compatible, but O(geometry × lights) cost. Deferred rendering splits into two passes: geometry pass writes position/normal/albedo/material to a G-buffer (MRT); lighting pass reads the G-buffer and evaluates all lights in screen space — O(geometry + lights). Deferred is ideal for many (100–1000) lights but breaks MSAA, increases bandwidth, and requires fallback for transparencies. Forward+ (Tiled Forward) culls lights per screen tile in a compute shader, then standard forward shading only evaluates per-tile lights — combines MSAA support with many-light scalability. Light-culled tiles are 8×8 or 16×16 pixels; a typical scene uses 512 lights with <20 per tile.

---

## Intuition — Analogy First

Forward rendering is like a chef who seasons every ingredient before it reaches the guest — even if the guest never sees that ingredient (hidden surface). Deferred rendering is like a buffet: you first prepare every dish and set it out (G-buffer pass), then let each guest (light) pick only what's in front of them from the buffet table (screen-space lighting). Forward+ is a hybrid: the restaurant sections the room into zones and each server only carries dishes relevant to their zone's guests.

---

## How It Works

```mermaid
graph TD
    subgraph Forward
        GEO_F["Geometry Rasterization\n+ Shading per light"]:::fwd
        FB_F["Framebuffer\nFinal color"]:::fb
        GEO_F -->|O(geo × lights)| FB_F
    end
    subgraph Deferred
        GEO_D["Geometry Pass\nG-buffer: pos/normal/albedo/material"]:::def
        GBUF["G-buffer\n3-4 MRT textures"]:::gbuf
        LIGHT["Lighting Pass\nScreen-space, all lights"]:::def
        FB_D["Framebuffer\nFinal color"]:::fb
        GEO_D --> GBUF --> LIGHT --> FB_D
    end
    subgraph ForwardPlus
        CULL["Compute: Light Culling\nPer tile 16×16px"]:::fplus
        GEO_FP["Geometry Pass\nForward shading\nOnly tile lights"]:::fplus
        FB_FP["Framebuffer\nFinal color"]:::fb
        CULL --> GEO_FP --> FB_FP
    end

    classDef fwd fill:#0f3460,stroke:#57a773,color:#a8d8ea
    classDef def fill:#16213e,stroke:#f5a623,color:#ffe0a3
    classDef gbuf fill:#1a1a2e,stroke:#9b59b6,color:#d7bde2
    classDef fplus fill:#0f3460,stroke:#c23b22,color:#ffcccb
    classDef fb fill:#1a1a2e,stroke:#e94560,color:#fff
```

---

## Key Concepts / Details

### Forward Rendering

```glsl
// Classic forward — shade with all lights per fragment
void main() {
    vec3 color = vec3(0.0);
    for (int i = 0; i < NUM_LIGHTS; i++) {
        color += calculateLight(lights[i], fragPos, normal, albedo);
    }
    outColor = vec4(color, 1.0);
}
```

Cost: `O(vertices + fragments × lights)`. At 1080p with 30% overdraw and 100 lights: `~1920×1080 × 1.3 × 100 ≈ 270M` light evaluations/frame.

**Advantages**: MSAA natively, transparency works, simple implementation, great for few lights.  
**Disadvantages**: linear scaling with light count, expensive overdraw (shading hidden fragments).

### G-Buffer Layout (Deferred)

| Attachment | Format | Contents |
|------------|--------|---------|
| `gAlbedo` | RGBA8 | RGB: albedo, A: flags |
| `gNormal` | RGBA16F | XYZ: world normal (encoded), W: unused |
| `gMaterial` | RGBA8 | R: roughness, G: metallic, B: AO, A: emissive scale |
| `gDepth` | D32F | Hardware depth (reconstructs position via inverse projection) |

**Position from depth** (avoid storing position = saves 16 bytes/pixel = ~33MB at 1080p):

```glsl
// Reconstruct world position from depth in lighting pass
vec2 uv = gl_FragCoord.xy / screenSize;
float depth = texture(gDepth, uv).r;
vec4 clipPos = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);  // NDC
vec4 viewPos = inverseProjection * clipPos;
viewPos /= viewPos.w;
vec3 worldPos = (inverseView * viewPos).xyz;
```

### Lighting Pass (Deferred)

```glsl
// Deferred lighting pass — reads G-buffer, evaluates all lights
uniform sampler2D gAlbedo, gNormal, gMaterial, gDepth;

void main() {
    vec2 uv = gl_FragCoord.xy / screenSize;
    
    vec3 albedo   = texture(gAlbedo, uv).rgb;
    vec3 normal   = normalize(texture(gNormal, uv).rgb * 2.0 - 1.0);
    vec4 material = texture(gMaterial, uv);
    float roughness = material.r;
    float metallic  = material.g;
    
    vec3 worldPos = reconstructPosition(uv);  // from depth
    vec3 V = normalize(cameraPos - worldPos);
    
    vec3 Lo = vec3(0.0);
    for (int i = 0; i < numLights; i++) {
        Lo += PBR_CookTorrance(lights[i], albedo, normal, roughness, metallic, worldPos, V);
    }
    outColor = vec4(Lo, 1.0);
}
```

Lighting pass draws full-screen quad or light volume geometry (sphere for point lights, cone for spotlights) — only lights covering a screen region are evaluated for that region.

### Deferred vs Forward Comparison

| Aspect | Forward | Deferred | Forward+ |
|--------|---------|---------|---------|
| Many lights (>100) | Slow | Fast | Fast |
| MSAA support | Yes | No (or complex) | Yes |
| Transparency | Yes | No (forward pass needed) | Yes |
| G-buffer bandwidth | None | High (3–4 × 4–8 bytes/px) | None |
| Memory (1080p) | ~8MB | ~50–100MB G-buffer | ~8MB + light list |
| Custom material shaders | Easy | Requires deferred variants | Easy |
| Implementation complexity | Simple | Moderate | High |

### Forward+ (Tiled Forward Shading)

1. **Depth prepass**: render scene depth-only to depth buffer
2. **Light culling (compute shader)**: for each 16×16 tile, find which lights intersect the tile's view frustum using the depth range from step 1
3. **Forward shading**: render geometry; fragment shader only iterates lights in its tile

```glsl
// Compute shader: light culling per tile
layout(local_size_x = 16, local_size_y = 16) in;

shared uint minDepth, maxDepth;
shared uint visibleLightCount;
shared uint visibleLights[MAX_LIGHTS_PER_TILE];

void main() {
    // Step 1: find tile depth range
    // Step 2: construct tile frustum from depth range
    // Step 3: for each light, sphere vs frustum AABB test
    // Step 4: write light indices to per-tile light list buffer
}
```

```glsl
// Forward shading with per-tile light list
flat in uint tileIndex;  // computed from gl_FragCoord

void main() {
    uint lightStart = tileIndex * MAX_LIGHTS_PER_TILE;
    uint lightCount = lightList[lightStart];  // count stored at index 0
    vec3 Lo = vec3(0.0);
    for (uint i = 1; i <= lightCount; i++) {
        uint lightIdx = lightList[lightStart + i];
        Lo += evaluateLight(lights[lightIdx], ...);
    }
    outColor = vec4(Lo, 1.0);
}
```

### Clustered Shading (3D Forward+)

Extend tiles into depth clusters (3D bins). Instead of 2D tile × depth range, use a 3D grid of frusta cells. Handles large depth ranges (outdoor scenes) better than 2D tiled.

Typical config: 16×9×24 clusters = 3456 cells at 1080p. Each cell stores a 16-bit count + index into a global light index list.

### Transparency in Deferred Rendering

Deferred cannot handle transparency directly (G-buffer only stores one layer per pixel). Solutions:
1. **Forward pass after deferred lighting**: collect transparent objects, sort back-to-front, render in a forward pass on top of the shaded scene.
2. **OIT (Order-Independent Transparency)**: A-buffer, weighted blended OIT (`gl_FragDepth`, `EXT_shader_framebuffer_fetch`), or per-pixel linked lists.
3. **Alpha-to-coverage**: converts alpha to MSAA coverage mask — works in deferred for vegetation (limited to 4–8 discrete alpha levels).

---

## Real-World Notes

- **Unreal Engine 5** uses deferred rendering by default; Lumen GI is built on top of deferred G-buffers.
- **Unity HDRP** uses deferred with tile/cluster culling; URP uses forward+ by default in Unity 2022+.
- **Mobile GPUs** (tile-based deferred — TBDR): the G-buffer lives in on-chip tile memory, making deferred effectively free on bandwidth — the GPU was already doing it internally.
- **Volumetric lights/fog**: typically a separate low-resolution 3D texture pass in both forward and deferred, using the depth buffer and light volumes.

---

## Common Pitfalls

1. **Deferred + MSAA**: storing multisampled G-buffer at 4× quadruples bandwidth — use SMAA/TAA post-process instead.
2. **Forgetting skybox in deferred**: the lighting pass renders a full-screen quad; skybox must be rendered separately (forward) after the lighting pass using `gl_FragDepth = 1.0` trick to fill depth.
3. **Light volumes overdraw in deferred**: drawing sphere geometry for each point light causes fragment shader to run multiple times for overlapping lights — use stencil masking or tiled approach.
4. **Forward+ with very large lights**: a single massive light that covers many tiles forces every tile to include it — limit maximum light radius or use clustered shading.

---

## Related Concepts

- [[_MOC_Rendering_Pipeline|↑ Rendering Pipeline MOC]]
- [[Framebuffers_and_Render_Targets|Framebuffers & MRT]] — G-buffer implementation
- [[../05_Lighting_and_Materials/Physically_Based_Rendering|PBR]] — lighting equation used in both passes
- [[../05_Lighting_and_Materials/Global_Illumination|Global Illumination]] — probe-based GI extends deferred pipeline
- [[../04_Shaders/Compute_Shaders_GPGPU|Compute Shaders]] — light culling compute dispatch

---

## Review Questions

1. Why does deferred rendering break MSAA, and what are the two standard workarounds?
2. Reconstruct world-space position from a depth buffer value and the camera's inverse view-projection matrix. Derive the formula step-by-step.
3. A scene has 1000 point lights and 2M visible fragments. Estimate the fragment shader invocations for forward, deferred, and Forward+ (16×16 tiles, 20 lights/tile average).

---

## Sources

#Computer_Graphics #Rendering_Pipeline #Deferred #Forward
