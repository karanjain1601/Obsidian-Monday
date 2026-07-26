---
title: HLSL for DirectX
aliases: [HLSL, High Level Shading Language, SM6, Wave Intrinsics, Mesh Shaders]
tags: [Computer_Graphics, Shaders, HLSL, DirectX]
domain: Computer_Graphics
difficulty: Advanced
created: 2026-07-26
related: [DirectX12_and_Metal, GLSL_Vertex_Shaders, Shader_Optimization_and_Profiling]
status: complete
---

# 📐 HLSL for DirectX

> [!abstract] TL;DR
> HLSL (High Level Shading Language) is the shader language for DirectX. Inputs/outputs use semantic strings (POSITION, TEXCOORD0, SV_Target) instead of GLSL's `layout(location=N)`. Resources bind to `register(tN)` (textures), `register(bN)` (constant buffers), `register(uN)` (UAVs), `register(sN)` (samplers). Shader Model 6 (SM6) adds wave intrinsics (`WaveActiveSum`, `WavePrefixSum`, `WaveGetLaneCount`), enabling warp-level parallel reductions without shared memory. SM6.5 introduces mesh shaders (task+mesh replacing VS/GS) and amplification shaders for GPU-culled geometry. SPIRV-Cross and DXC compile HLSL to SPIR-V for Vulkan. PIX is the native DX12 GPU debugger.

---

## Intuition — Analogy First

HLSL is to DirectX what GLSL is to OpenGL — the GPU programming language — but with key differences in philosophy. GLSL binds resources by location numbers (anonymous slots); HLSL uses semantic strings that name what a variable represents (POSITION, NORMAL, SV_Target — "system-value target"). This makes HLSL shaders more self-documenting but less portable. Wave intrinsics are HLSL's secret weapon: they expose the hardware warp/wave as a programming primitive, allowing algorithms like prefix sum in a single instruction with no shared memory.

---

## How It Works

```mermaid
graph LR
    HLSL["HLSL Source\n.hlsl file"]:::in
    DXC["DXC Compiler\nDirectX Shader Compiler"]:::tool
    DXIL["DXIL Bytecode\nor SPIR-V via DXC"]:::ir
    DRIVER["GPU Driver\nOptimize + codegen"]:::stage
    GPU["GPU Execution"]:::out

    HLSL --> DXC --> DXIL --> DRIVER --> GPU

    classDef in fill:#0f3460,stroke:#0078d4,color:#a8d8ff
    classDef tool fill:#16213e,stroke:#57a773,color:#a8d8ea
    classDef ir fill:#1a1a2e,stroke:#f5a623,color:#ffe0a3
    classDef stage fill:#16213e,stroke:#9b59b6,color:#d7bde2
    classDef out fill:#0f3460,stroke:#57a773,color:#a8e6cf
```

---

## Key Concepts / Details

### HLSL Shader Structure vs GLSL

| Feature | GLSL | HLSL |
|---------|------|------|
| Resource binding | `layout(location=N)` | `register(tN/bN/sN/uN)` |
| Entry point | `void main()` | Any name, specified at compile |
| Semantics | Implicit in stage | Explicit strings (POSITION, SV_Target) |
| Matrix type | `mat4` | `float4x4` |
| Texture sampling | `texture(sampler, uv)` | `tex.Sample(sampler, uv)` |
| Version | `#version 450` | `#define SHADER_MODEL_6_0` or target flag |

### Basic HLSL Vertex Shader

```hlsl
// Constant buffer (b0)
cbuffer CameraConstants : register(b0) {
    float4x4 ViewProjection;
    float4x4 Model;
    float4   CameraPos;
};

// Input structure with semantics
struct VSInput {
    float3 Position : POSITION;    // vertex attribute 0
    float3 Normal   : NORMAL;      // vertex attribute 1
    float2 TexCoord : TEXCOORD0;   // vertex attribute 2
};

// Output structure
struct VSOutput {
    float4 Position : SV_Position;  // SV = system value; clip-space output
    float3 WorldPos : TEXCOORD0;    // interpolated to fragment
    float3 Normal   : TEXCOORD1;
    float2 TexCoord : TEXCOORD2;
};

VSOutput VSMain(VSInput input) {
    VSOutput output;
    float4 worldPos = mul(float4(input.Position, 1.0f), Model);
    output.Position = mul(worldPos, ViewProjection);
    output.WorldPos = worldPos.xyz;
    // Normal transform: inverse-transpose (simplified)
    output.Normal   = normalize(mul(input.Normal, (float3x3)Model));
    output.TexCoord = input.TexCoord;
    return output;
}
```

### HLSL Fragment Shader (Pixel Shader)

```hlsl
// Texture and sampler registers
Texture2D    AlbedoMap : register(t0);
SamplerState LinearSampler : register(s0);

// Output to render target
struct PSInput {
    float4 Position : SV_Position;  // read-only in PS
    float3 WorldPos : TEXCOORD0;
    float3 Normal   : TEXCOORD1;
    float2 TexCoord : TEXCOORD2;
};

float4 PSMain(PSInput input) : SV_Target {
    float4 albedo = AlbedoMap.Sample(LinearSampler, input.TexCoord);
    float3 N = normalize(input.Normal);
    // ... lighting computation ...
    return float4(albedo.rgb, 1.0f);
}

// MRT output:
struct PSOutputMRT {
    float4 Albedo   : SV_Target0;
    float4 Normal   : SV_Target1;
    float4 Material : SV_Target2;
};
```

### Register Spaces

```hlsl
// Global resources (no explicit register space = space0)
Texture2D SceneTexture : register(t0, space0);

// Per-material resources (space1)
Texture2D AlbedoMap    : register(t0, space1);
Texture2D NormalMap    : register(t1, space1);

// Per-object resources (space2)
StructuredBuffer<ObjectData> Objects : register(t0, space2);
```

Register spaces allow bindless patterns: each material/object occupies space1/space2 with identical register indices, reducing root signature complexity.

### SM6 Wave Intrinsics

Wave intrinsics expose the GPU warp (NVIDIA: 32, AMD: 32 or 64 threads) as a programming unit:

```hlsl
// Get current wave size and lane index
uint waveSize = WaveGetLaneCount();  // 32 or 64
uint laneIdx  = WaveGetLaneIndex();  // 0..waveSize-1

// Reductions across all active lanes in the wave
float waveSum = WaveActiveSum(value);   // sum all active lane values
float waveMax = WaveActiveMax(value);   // max across wave
bool  allTrue = WaveActiveAllTrue(cond);
uint  ballot  = WaveActiveBallot(cond).x;  // bitmask of true lanes

// Prefix operations (exclusive scan within wave)
float prefixSum  = WavePrefixSum(value);   // sum of lanes [0, laneid-1]
float prefixProd = WavePrefixProduct(value);

// Count active lanes with a condition
uint activeCount = WaveActiveCountBits(cond);
uint prefixCount = WavePrefixCountBits(cond);  // count true lanes before me
```

**Use case: stream compaction without shared memory**
```hlsl
// Compact particles where alive == true into output buffer
bool alive = (particles[gid].life > 0.0f);
uint outputIndex = WavePrefixCountBits(alive) + baseOutputIndex;
if (alive) {
    outputBuffer[outputIndex] = particles[gid];
}
```

No `groupshared` needed — the wave hardware does the counting atomically.

### SM6.5 Mesh Shaders

Mesh shaders replace the VS + optional GS + HS + DS stages with two new stages:

```hlsl
// Amplification shader (optional): GPU-side LOD/culling
[numthreads(32, 1, 1)]
void ASMain(uint gtid : SV_GroupThreadID) {
    bool visible = CheckVisibility(gtid);
    if (WaveIsFirstLane() && WaveActiveAnyTrue(visible)) {
        DispatchMesh(1, 1, 1, payload);  // launch mesh shader group
    }
}

// Mesh shader: outputs mesh primitives (up to 256 vertices, 512 primitives)
[numthreads(32, 1, 1)]
[outputtopology("triangle")]
void MSMain(
    uint gtid  : SV_GroupThreadID,
    out vertices VSOutput verts[MAX_VERTS],
    out indices  uint3    tris[MAX_TRIS])
{
    SetMeshOutputCounts(vertCount, triCount);
    // Write vertices and indices
    verts[gtid].Position = ...;
    if (gtid < triCount) tris[gtid] = uint3(gtid*3, gtid*3+1, gtid*3+2);
}
```

Advantages: GPU-culled geometry amplification (grass, procedural meshes), no vertex buffer required, full flexibility in vertex count per thread group.

### HLSL Compile Commands

```batch
rem DXC compile to DXIL (DX12)
dxc -T vs_6_5 -E VSMain shader.hlsl -Fo shader_vs.dxil

rem DXC compile to SPIR-V (Vulkan via DXC)
dxc -T vs_6_5 -E VSMain shader.hlsl -spirv -Fo shader_vs.spv

rem FXC (older, SM 5.1 max)
fxc /T vs_5_1 /E VSMain /Fo shader_vs.cso shader.hlsl
```

---

## Real-World Notes

- **SPIRV-Cross**: converts SPIR-V to GLSL/MSL — the standard cross-compilation pipeline for HLSL→Vulkan→Metal.
- **RenderDoc** captures DX12 frames and disassembles DXIL shaders; **PIX** provides GPU timing, resource inspection, and shader debugging on Xbox/Windows.
- **Shader reflection** (DXC/D3D12 reflection API): query resource bindings, input semantics, and CBV sizes at runtime — eliminates hardcoded binding indices.
- **Root constants** (`b0` inline): 32-bit values stored in root signature itself — no buffer creation, ideal for material IDs or draw call indices in bindless scenes.

---

## Common Pitfalls

1. **Row-major vs column-major `mul` order** — HLSL's `mul(vector, matrix)` multiplies row-vector by matrix; `mul(matrix, vector)` multiplies column-vector. GLM matrices uploaded without transpose need `mul(vec, mat)` form.
2. **Wave intrinsics and non-uniform flow control** — calling `WaveActiveSum()` from inside a divergent branch produces undefined results; ensure all active lanes reach the intrinsic.
3. **`cbuffer` packing rules** — similar to GLSL std140: members don't cross 16-byte boundaries. A `float3` followed by a `float` is packed correctly; `float3` followed by another `float3` may leave a 4-byte gap.
4. **`SV_Position` in the pixel shader** — `SV_Position.xy` gives the pixel center (0.5 offset), not integer pixel coordinates. Use `floor(SV_Position.xy)` for texel-exact addressing.

---

## Related Concepts

- [[_MOC_Shaders|↑ Shaders MOC]]
- [[DirectX12_and_Metal|DirectX 12 & Metal]] — root signatures, PSO pipeline
- [[GLSL_Vertex_Shaders|GLSL Vertex Shaders]] — GLSL comparison
- [[Compute_Shaders_GPGPU|Compute Shaders]] — HLSL compute stage (`[numthreads]`)
- [[Shader_Optimization_and_Profiling|Shader Optimization]] — PIX, wave occupancy

---

## Review Questions

1. An HLSL shader uses `mul(viewProj, worldPos)`. The matrix comes from GLM (column-major). Will the result be correct? What change would fix it if not?
2. Explain how `WavePrefixCountBits(alive)` enables stream compaction without shared memory or atomics. Walk through the computation for a 4-thread wave where lanes 0, 2, 3 are alive.
3. A mesh shader group outputs 64 vertices and 128 triangles. How does this compare to a traditional vertex+geometry shader pipeline for the same data?

---

## Sources

#Computer_Graphics #Shaders #HLSL #DirectX
