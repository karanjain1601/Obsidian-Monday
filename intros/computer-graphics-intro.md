# Computer Graphics: Introduction to All Topics

This document is a guided tour of the 6 sections in the Computer Graphics knowledge base — a production-focused reference for engineers building real-time renderers, writing shaders, and implementing lighting, animation, and simulation systems. The content targets staff-level engineers and covers 2D rasterization, 3D math, the modern graphics APIs, GPU shader programming, physically based lighting, and animation & physics simulation.

**Suggested learning path:** 01 2D Graphics → 02 3D Fundamentals → 03 Rendering Pipeline → 04 Shaders → 05 Lighting & Materials → 06 Animation & Simulation. Each module's prerequisites reference the earlier ones, and Module 02 supplies the linear algebra used everywhere downstream.

---

## 01. 2D Graphics

Before 3D pipelines and shaders, all graphics begins with 2D: turning continuous geometry into discrete pixels, eliminating aliasing, and representing curves and vector paths mathematically. Everything here runs on a scalar CPU or the browser's 2D context — the foundations that GPU triangle-setup units still implement in silicon.

**What's covered:**
- **Rasterization Algorithms** — Bresenham's line algorithm as an exact integer *error term* (`D₀ = 2Δy − Δx`, updated by addition only — no float multiply or round in the inner loop) mirrored across all 8 octants with `sx`/`sy` steps; midpoint circle via the implicit `F(x,y) = x² + y² − r²` and 8-way symmetry; scanline polygon fill with the Active Edge Table (Edge Table bucketed by `y_min`, AET re-sorted by intersection `x` each line, incremental `x += 1/m`, half-open `[y_min, y_max)` vertices, horizontal edges dropped); even-odd (parity) vs nonzero-winding fill rules; flood fill 4- vs 8-connected.
- **Anti-aliasing** — the Nyquist–Shannon sampling theorem as the root cause; SSAA (supersample + downsample), MSAA (coverage sampling, shade once per pixel), FXAA (post-process edge detection), TAA (temporal accumulation + reprojection), SMAA (morphological).
- **Bézier & B-Splines** — Bernstein polynomial basis, de Casteljau subdivision (n linear interpolations for degree n — a cubic Bézier has 4 control points, degree 3), B-spline Cox–de Boor recursion, NURBS rational weights + knot vectors, continuity classes C⁰/C¹/G¹/G².
- **SVG & Vector Graphics** — viewport/viewBox, path commands (M/L/C/Q/A/Z), the `transform` attribute (translate/rotate/scale/skewX), clip paths & masks, `stroke-dasharray` animation, SVGO optimization; set `viewBox` + CSS size to stay crisp on HiDPI.
- **Canvas 2D API** — 2D-context path API (`beginPath`/`moveTo`/`lineTo`/`arc`), `globalCompositeOperation` compositing, `ImageData` pixel manipulation, OffscreenCanvas + Web Workers, the `requestAnimationFrame` loop; bracket transforms with `save()`/`restore()` so state doesn't leak.

**Key mental models:** Bresenham replaces a float multiply-and-round with an exact, drift-free integer error term; choose even-odd for simple rings and nonzero winding for glyphs (what TrueType requires); pair a 4-connected region with an 8-connected boundary or fills leak through diagonal pinholes; anti-aliasing is fundamentally a Nyquist sampling problem, not a blur.

---

## 02. 3D Fundamentals

The bridge from 2D to 3D is coordinate transformation: every vertex travels a chain of `4x4` matrix multiplies — model → world → view → clip → NDC → screen — before it becomes a pixel. This module is the mathematical spine used by every rendering topic that follows.

**What's covered:**
- **3D Transforms & Matrices** — homogeneous coordinates (`w = 1` for a point so translation applies, `w = 0` for a direction so it doesn't); model matrix TRS decomposition (`M = T · R · S` — scale, then rotate, then translate; column-vector convention composes right-to-left); view matrix via `lookAt`; the MVP chain `M_clip = M_proj · M_view · M_model · v`; viewport transform; gimbal lock and quaternion slerp.
- **Projection** — the perspective divide (÷w), FOV/aspect-ratio derivation, near/far mapping into NDC, orthographic projection for HUDs, oblique and fisheye/wide-angle distortion correction.
- **Frustum Culling & Clipping** — 6-plane frustum representation; AABB vs sphere vs OBB frustum tests; Cohen–Sutherland line clipping; Sutherland–Hodgman polygon clipping; near-plane clipping to prevent negative-`w` artifacts; hierarchical culling with a BVH.
- **Depth Buffering & Precision** — the Z-buffer algorithm, non-linear depth distribution and precision loss, z-fighting on co-planar surfaces, the reverse-Z technique, logarithmic depth for huge scenes; keep the near/far ratio below 1:10,000 and use 32-bit float depth for terrain/space scale.
- **Coordinate Systems & Handedness** — right-hand (OpenGL) vs left-hand (DirectX/Vulkan/Metal); per-API NDC conventions (Y-flip, Z range [0,1] vs [−1,1]); winding order (CCW/CW) and backface culling; tangent space for normal mapping.

**Key mental models:** Compose transforms as `T · R · S` and read them right-to-left; the perspective ÷w is mandatory (`gl_Position` handles it automatically); interpolate rotations with quaternion slerp, never Euler lerp (gimbal lock); keep the near plane off zero and reach for reverse-Z on large scenes; know your API's handedness and NDC range or geometry renders flipped.

---

## 03. Rendering Pipeline & APIs

Modern graphics APIs differ dramatically in philosophy — OpenGL's implicit state machine, Vulkan's explicit multi-threaded design, Metal's unified-memory model — yet all map onto the same logical pipeline. This module covers each API's object model and the resources (buffers, textures, render passes) that drive deferred and post-processing effects.

**What's covered:**
- **OpenGL Core Profile** — VAO/VBO/EBO setup (bind the VBO *before* `glVertexAttribPointer` — the VAO records that binding), shader compile & link, texture objects & samplers, uniform buffer objects, draw-call variants (`glDrawArrays`/`glDrawElements`/`glDrawInstancedBaseVertex`), blend/depth/stencil state.
- **Vulkan Architecture & Render Passes** — the explicit creation chain `VkInstance → VkPhysicalDevice → VkDevice → VkQueue → VkCommandPool → VkCommandBuffer`; render passes & subpasses; image-layout transitions via pipeline barriers; pipeline state objects; descriptor sets & layouts; synchronization primitives (semaphores for GPU→GPU, fences for GPU→CPU, barriers).
- **Direct3D 12 & DirectX** — command list/allocator/queue model, root signatures & descriptor tables, heap types (upload/default/readback), DXGI swap chain, before/after resource barriers, bindless + shader model 6; ring-buffer N allocators for N frames-in-flight and fence-gate before reuse.
- **Metal (Apple)** — `MTLDevice`/`MTLCommandQueue`/`MTLCommandBuffer`, render pipeline descriptors, `MTLBuffer`/`MTLTexture`, vertex descriptors, MetalKit view integration, argument buffers for bindless; compile pipeline states at load time and cache by descriptor hash to avoid frame hitching.
- **Framebuffers & Render Targets** — FBOs with color/depth/stencil attachments, multiple render targets (MRT) for deferred shading, ping-pong buffers for post-processing, render-to-texture, MSAA resolve via `glBlitFramebuffer` before sampling, HDR framebuffers (RGBA16F).

**Key mental models:** OpenGL hides state in an implicit machine; Vulkan and D3D12 hand you ownership of memory, layout transitions, and synchronization — every Vulkan layout transition needs a correctly-staged barrier; fence-gate command allocators across frames-in-flight or corrupt/lose the device; you must resolve an MSAA target before you can sample it.

---

## 04. Shaders

Shaders are the GPU programs that transform geometry and color pixels — from the vertex shader positioning every triangle to the compute shader running arbitrary parallel workloads. This module covers GLSL/HLSL authorship, the GPU execution model, and the profiling that separates working code from performant code.

**What's covered:**
- **GLSL Vertex Shaders** — built-ins (`gl_Position`, `gl_VertexID`, `gl_InstanceID`), layout qualifiers & attribute binding, interpolation qualifiers (`flat`/`smooth`/`noperspective`), uniform buffer objects, instanced rendering, the linear-blend-skinning matrix palette.
- **Fragment Shaders & Effects** — built-ins (`gl_FragCoord`, `gl_FrontFacing`, `gl_FragDepth`), texture sampling (`texture`/`textureLod`/`textureGather`), `discard` for alpha cutout (hoisted before expensive samples), screen-space effects (threshold bloom, edge detection), analytic derivatives `dFdx`/`dFdy` for mip LOD.
- **Compute Shaders (GPGPU)** — the workgroup/invocation model (`local_size_x/y/z`, `gl_GlobalInvocationID`, `gl_LocalInvocationID`, `gl_NumWorkGroups`), groupshared memory, `barrier`/`memoryBarrier`/`groupMemoryBarrier`, SSBO vs `image2D`, parallel prefix sum, particle simulation; bounds-check the trailing workgroup.
- **HLSL for DirectX** — the semantic system (`POSITION`, `TEXCOORD`, `SV_Target`, `SV_VertexID`), register spaces & descriptor tables, wave intrinsics (`WaveActiveSum`/`WavePrefixSum`/`WaveGetLaneCount`), mesh & amplification shader stages, shader model 6.x, the PIX GPU-capture workflow.
- **Shader Optimization & Profiling** — latency hiding via warp scheduling, texture cache vs register pressure (occupancy), avoiding dynamic branching (warp divergence executes *both* sides — prefer `mix(a,b,step(t,x))`), half-precision math (`mediump`/fp16), SPIRV-Cross and RenderDoc/NSight profiling.

**Key mental models:** Warp divergence runs both branches, so favor branch-free arithmetic (`mix`/`step`) over per-pixel `if`/`else`; writing `gl_FragDepth` disables early-Z/Hi-Z — only do it for parallax/impostors; default to `mediump` on mobile and promote to `highp` only where needed; always bounds-check compute invocations and insert `glMemoryBarrier(GL_SHADER_STORAGE_BARRIER_BIT)` between an SSBO write and a dependent read.

---

## 05. Lighting & Materials

Lighting is where physics and art converge — from the empirical Phong model to the physically based Cook–Torrance BRDF, from local illumination to full global light transport, and from flat UV lookups to parallax occlusion mapping. This module assembles the complete real-time and offline material toolkit.

**What's covered:**
- **Phong & Blinn-Phong** — ambient + diffuse + specular components, the Lambert cosine law (`N·L`), Phong's reflect vector (`reflect(-L, N)`, the classic sign bug), the Blinn-Phong half-vector `H = normalize(L + V)`, the shininess exponent, and point/directional/spot lights.
- **PBR** — microfacet theory and the reflectance equation `L_o = ∫ f_r · L_i · (ω_i·n) dω_i`; Cook–Torrance specular `= D·F·G / (4(ω_o·n)(ω_i·n))`; the GGX/Trowbridge-Reitz NDF with `α = roughness²`; Fresnel–Schlick `F₀ + (1−F₀)(1−h·v)⁵` (dielectrics `F₀ ≈ 0.04`, metals a colored `F₀`); Smith masking-shadowing `G = G₁ · G₁` with `k_direct = (roughness+1)²/8` vs `k_IBL = α/2`; energy conservation `k_d = (1−F)(1−metallic)`; metallic-roughness vs specular-glossiness workflows.
- **Ray Tracing & Path Tracing** — the Kajiya rendering equation, Monte Carlo integration, cosine-weighted importance sampling, Russian-roulette termination, multiple importance sampling (MIS) to kill specular fireflies, bidirectional path tracing, BVH acceleration structures, denoising (OIDN/DLSS/OptiX).
- **Global Illumination** — ambient occlusion theory, SSAO (hemisphere samples kept in view space), HBAO+, screen-space GI, Lumen (software ray tracing + radiance cache), irradiance probes (DDGI), lightmap baking (target ≥ 2 texels/unit).
- **Texture Mapping & UV** — UV unwrapping (seams, islands, packing), filtering (nearest/bilinear/trilinear/anisotropic), mipmap LOD selection, normal mapping through a re-orthogonalized TBN matrix (`B = cross(N,T) · tangent.w`), parallax offset mapping, texture atlases.

**Key mental models:** Feed the NDF `roughness²`, not raw roughness (the #1 "my PBR looks chalky" bug); clamp every cosine with `max(dot, 0)` and multiply the whole BRDF by `N·L`; don't double-count Fresnel — multiply the diffuse term by `(1−F)` instead of re-adding `F` to specular; metals have zero diffuse; prefer metallic-roughness because the fixed `F₀ = 0.04` makes energy violation nearly impossible.

---

## 06. Animation & Simulation

Bringing static geometry to life requires skeletal rigs driven by keyframe curves, morph targets for facial blends, physics engines resolving rigid collisions, and procedural noise generating organic variation. This module covers both the character-animation pipeline and the simulation techniques that make worlds feel physical.

**What's covered:**
- **Skeletal Animation & Skinning** — the bone tree world matrix `M_j = M_parent(j) · L_j` (forward kinematics), the bind pose and inverse-bind matrix combining into the skinning matrix `S_j = M_j · B_j⁻¹` (`B_j⁻¹` baked once at load, `M_j` recomputed per frame), linear blend skinning (up to 4 weighted joints), dual quaternion skinning to fix the candy-wrapper artifact past ~90°, quaternion slerp for joint interpolation, and the flat parent-before-child joint array for a single-pass update.
- **Morph Targets & Blend Shapes** — delta position/normal targets, blend-weight interpolation, sparse morph targets for GPU efficiency, the FACS facial basis, corrective blend shapes, and morph-data compression.
- **Rigid Body Physics** — rigid-body state (position/orientation/linear + angular velocity), impulse-based collision response, the inertia tensor, broad phase (AABB BVH / sweep-and-prune) + narrow phase (GJK/EPA), the sequential-impulse constraint solver, and Bullet/PhysX.
- **Cloth & Fluid Simulation** — the mass-spring model (stretch/shear/bend springs), position-based dynamics (PBD), XPBD with constraint compliance, SPH fluids, grid-based Eulerian Navier–Stokes, smoke, and two-way coupling; integrate with semi-implicit (symplectic) Euler or Verlet plus damping so springs don't explode.
- **Procedural Generation** — value vs Perlin vs simplex noise; fractal Brownian motion (`fBm = Σ 0.5ⁱ · noise(2ⁱ·x)`, 6–8 octaves, with lacunarity/gain); Worley/cellular noise; L-system grammars (axiom + production rules) with turtle graphics; domain warping for organic terrain.

**Key mental models:** Skinning always needs the inverse-bind term (`S_j = M_j · B_j⁻¹`) or the mesh double-transforms and flies apart; slerp quaternions but lerp position/scale; switch LBS → DQS past ~90° of joint rotation; always gate narrow-phase GJK behind a broad phase (O(n²) → near-O(n)); use symplectic/Verlet integration with damping instead of explicit Euler; spatial-hash the SPH neighbor search on the GPU.

---

## Cross-Cutting Mental Models

These principles recur across every module and separate graphics code that merely runs from code that is correct and fast.

1. **Everything is a transform between spaces** — Vertices flow model → world → view → clip → NDC → screen, and lighting is evaluated in a deliberately chosen space (view or tangent). The largest bug class is mixing spaces or ordering transforms wrong: compose as `T · R · S`, read right-to-left, and never skip the perspective ÷w or the inverse-bind matrix.

2. **Sampling and aliasing are everywhere** — Rasterization, texturing, shadow maps, and reflections are all point-sampling of continuous signals bounded by the Nyquist limit. MSAA, mipmaps + anisotropic filtering, and TAA are the same anti-aliasing fix applied at different pipeline stages.

3. **Energy conservation and physical plausibility** — Modern lighting refuses to create light: a valid BRDF is non-negative, reciprocal, and energy-conserving, and the diffuse budget is exactly whatever the specular Fresnel term didn't reflect (`k_d = (1−F)(1−metallic)`). Break this and surfaces glow.

4. **The GPU is a wide SIMD machine** — Throughput comes from feeding thousands of lanes without stalls: avoid warp divergence, hide latency with high occupancy, minimize CPU↔GPU synchronization (`getImageData`, MSAA reads, allocator reuse), and batch aggressively. Branch-free arithmetic frequently beats a "cheaper" conditional.

5. **Precompute the constant, increment the variable** — The recurring optimization across the whole stack: Bresenham's integer error term, the AET's `x += 1/m`, baked inverse-bind matrices, cached pipeline state objects, and BVH acceleration structures all do the expensive work once and then update cheaply per step.
