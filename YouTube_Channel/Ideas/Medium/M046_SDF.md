---
title: "The Elegant Shape Representation (Signed Distance Fields)"
id: M046
difficulty: 5.5/10
prereq: "None"
concept: "SDF: for each point in space, stores the signed distance to the nearest surface (positive outside, negative inside); smooth boolean operations via min/max; collision detection: if SDF(x) < 0, x is inside; gradient gives normal."
tags: [SDF, signed-distance-field, collision-detection, boolean-operations, ray-marching, WebGL, geometry, implicit-surface]
category: medium
type: video-idea
---

# The Elegant Shape Representation (Signed Distance Fields)

**Alt title:** "One Function to Rule All Shapes"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A lone sphere rotates on screen. Smooth. Perfect. The voiceover: "I can describe this sphere with one function: f(x,y,z) = √(x²+y²+z²) - 1. If f < 0, you're inside it. If f > 0, you're outside. If f = 0, you're on the surface." Click. A box appears. "Same thing. A different function." Click. A torus. Click. A complex organic creature character from a game. "Also just a function. A complicated one, but still just one function."

Then: "Now watch this." Drag the sphere and box together — they smoothly blend into each other, no hard edge, a perfect organic union. "That cost me one line of code. `min(sphere(x), box(x))`." Drag them apart. Subtract the box from the sphere — a perfect hole punched through it, smooth edges. "One more line: `max(sphere(x), -box(x))`."

Voice: *"Signed Distance Fields are the most mathematically elegant shape representation ever invented. They make impossible operations trivial. Let's understand why — and watch what breaks when you use them naively."*

---

## The Naive Attempt

Try to store a SDF as a 2D grid of floats. Initialize a circle SDF analytically, then try to take the union of two SDFs by element-wise min:

```javascript
const N = 256;
const grid = new Float32Array(N * N);

// Initialize SDF for a circle centered at (cx, cy) with radius r
function makeSDF_circle(cx, cy, r) {
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const dx = x - cx, dy = y - cy;
      grid[y * N + x] = Math.sqrt(dx*dx + dy*dy) - r;
    }
  }
}

// Try to "move" the circle by translating the SDF grid
// WRONG approach: just shift the array
function translateSDF_naive(grid, dx, dy) {
  const newGrid = new Float32Array(N * N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const srcX = x - dx, srcY = y - dy;
      if (srcX < 0 || srcX >= N || srcY < 0 || srcY >= N) {
        newGrid[y*N+x] = 999; // "outside"
      } else {
        newGrid[y*N+x] = grid[Math.floor(srcY)*N + Math.floor(srcX)];
      }
    }
  }
  return newGrid;
}

// Union of two SDFs — this part is actually correct
function unionSDF(sdfA, sdfB) {
  const result = new Float32Array(N * N);
  for (let i = 0; i < N*N; i++) result[i] = Math.min(sdfA[i], sdfB[i]);
  return result;
}
```

The union is mathematically correct. But `translateSDF_naive` is wrong: bilinear interpolation of a grid SDF introduces error every frame. After 100 frames of a moving circle, the SDF has been repeatedly interpolated — the values are corrupted. The |∇SDF| should equal 1 everywhere (the "eikonal condition"), but repeated interpolation makes it ≠ 1, which means the stored values no longer accurately represent distances.

---

## The Moment of Failure

Move a circle SDF for 200 frames using the grid-shift approach. On each frame, render the zero-levelset (the apparent surface). After 50 frames: the circle appears slightly blobby, larger than it should be. After 100 frames: clearly too large, edges rough. After 200 frames: what was a circle is now a lumpy, eroded cloud shape with fringed edges. Overlaid: `|∇SDF| = 2.7` (should be 1.0). The distance values are no longer true distances — they've diffused.

The collision detection code `if (grid[pos] < 0) { collide(); }` is now completely unreliable — the zero-crossing is in the wrong place.

---

## Why It Broke — The Physics

A true SDF must satisfy the **eikonal equation**:
> **|∇d(x)| = 1 everywhere**

This means: the magnitude of the gradient of a signed distance field is always 1. It's the mathematical statement that d(x) really is the distance to the nearest surface — distances increase at rate 1 per unit of spatial displacement.

When we bilinearly interpolate a grid SDF and resample it into a new grid (even at the correct shifted location), the interpolation is a low-pass filtering operation. It rounds off the sharp gradient at the zero-crossing. The resultant field no longer satisfies |∇d| = 1: near the surface the gradient may be 0.5 (distances are too smooth), and the zero-crossing appears to have moved. The shape gets "fat."

The fix for grid-based SDFs is **reinitialization** — periodically re-solving the eikonal equation from the zero-levelset to restore |∇d| = 1 everywhere. This is done with the Fast Marching Method (FMM) or a PDE-based reinitialization. But it's O(N²) every frame and complex to implement correctly.

The much better approach: **functional SDFs** — define the SDF as a mathematical function evaluated at query time, not stored in a grid. No interpolation errors. No reinitialization needed. Zero memory for the SDF itself (just code).

For simple primitives, functional SDFs are exact:
- Sphere: `d = length(p) - r`
- Box: `d = length(max(abs(p) - b, 0)) + min(max(p.x-b.x, max(p.y-b.y, p.z-b.z)), 0)`
- Torus: `d = length(vec2(length(p.xz) - R, p.y)) - r`

Boolean operations:
- Union: `d = min(d1, d2)` (choose whichever shape is closer)
- Intersection: `d = max(d1, d2)` (inside both shapes simultaneously)
- Subtraction: `d = max(d1, -d2)` (inside A, outside B)

Smooth versions using smoothstep/softmin:
> **smooth_union(d1, d2, k) = -log(e^(-k·d1) + e^(-k·d2)) / k**

or the polynomial variant: h = clamp(0.5 + 0.5(d2-d1)/k, 0, 1); return mix(d2, d1, h) - k·h·(1-h).

The gradient of an SDF gives the surface normal: n = ∇d(x). For functional SDFs, this can be computed by finite differences or analytically. This is why SDF-based collision detection is elegant:

```javascript
// If the SDF at a point is negative, the point is inside the shape
// The gradient gives the outward normal for the collision response
if (sdf(px, py) < 0) {
  const normal = gradSDF(px, py);  // numerically differentiate sdf
  const penetration_depth = -sdf(px, py);
  // Push object out along normal by penetration_depth
  px += normal.x * penetration_depth;
  py += normal.y * penetration_depth;
  // Reflect velocity along normal
  const vDotN = vx*normal.x + vy*normal.y;
  vx -= 2 * vDotN * normal.x;
  vy -= 2 * vDotN * normal.y;
}
```

---

## The One Concept

**Signed Distance Fields: Geometry as a Distance Function**

A Signed Distance Field (SDF) for a surface S is a scalar function f: ℝⁿ → ℝ where f(x) = signed distance from x to S. The sign convention (positive outside, negative inside) is standard in physics and rendering. The key properties are:

**1. Eikonal property:** |∇f(x)| = 1 everywhere except on S itself. This guarantees that f(x) truly measures Euclidean distance, not some warped approximation.

**2. Collision detection:** f(x) < 0 ⟺ x is inside the object. f(x) = 0 ⟺ x is on the surface. The penetration depth (how far inside) is exactly |f(x)|.

**3. Surface normal:** ∇f(x) points outward (away from surface interior) and has unit magnitude. This gives the collision response direction directly.

**4. Boolean composability:** Union, intersection, and subtraction of shapes correspond to min, max, and negation of SDFs. This is exact for convex shapes and approximate (but usually good) for concave shapes.

**5. Smooth blending:** By using a softmin instead of a hard min, we get smooth organic blending between shapes — "metaballs" generalized to arbitrary shapes. This is how modern procedural character modeling works.

**Ray marching with SDFs:** To find where a ray r(t) = origin + t·direction intersects an SDF surface, start at t=0 and step forward by f(r(t)) each iteration. Since f(x) = distance to nearest surface, stepping by f guarantees we never overshoot the surface. This is called **sphere tracing** or **ray marching** and is how the entire Shadertoy.com ecosystem works — complex 3D scenes rendered in a WebGL fragment shader, the entire scene described by a single GLSL function that returns an SDF value.

```glsl
// GLSL fragment shader: sphere tracing
float sceneSDF(vec3 p) {
  float sphere = length(p - vec3(0,0,2)) - 0.5;
  float box = sdBox(p - vec3(0,-1,2), vec3(2, 0.1, 2));
  return min(sphere, box);  // union
}

vec4 render(vec2 uv) {
  vec3 ro = vec3(0, 0, 0);  // ray origin
  vec3 rd = normalize(vec3(uv, 1.0));  // ray direction
  float t = 0.0;
  for (int i = 0; i < 100; i++) {
    float d = sceneSDF(ro + t * rd);
    if (d < 0.001) break;  // hit!
    t += d;  // sphere tracing step
    if (t > 100.0) break;  // miss
  }
  vec3 hit = ro + t * rd;
  // Compute normal by finite differences
  vec3 n = normalize(vec3(
    sceneSDF(hit + vec3(0.001,0,0)) - sceneSDF(hit - vec3(0.001,0,0)),
    sceneSDF(hit + vec3(0,0.001,0)) - sceneSDF(hit - vec3(0,0.001,0)),
    sceneSDF(hit + vec3(0,0,0.001)) - sceneSDF(hit - vec3(0,0,0.001))
  ));
  return vec4(n * 0.5 + 0.5, 1.0);  // normal as color
}
```

Real-world uses: font rendering on GPUs (Valve's original GDC 2007 paper on SDF text rendered crisp at all scales), collision detection in game physics (Halo used SDF terrain collision), medical imaging (SDF-based organ segmentation), and the entire GPU ray-marching community on Shadertoy.

---

## The Fix

Functional SDF approach — no grid, no reinitialization, exact at any resolution:

```javascript
// Functional SDFs — called at query time, no memory
function sdfCircle(px, py, cx, cy, r) {
  return Math.sqrt((px-cx)**2 + (py-cy)**2) - r;
}

function sdfBox(px, py, cx, cy, hw, hh) {
  const dx = Math.abs(px - cx) - hw;
  const dy = Math.abs(py - cy) - hh;
  return Math.sqrt(Math.max(dx,0)**2 + Math.max(dy,0)**2)
       + Math.min(Math.max(dx, dy), 0);
}

function sdfUnion(d1, d2) { return Math.min(d1, d2); }
function sdfIntersect(d1, d2) { return Math.max(d1, d2); }
function sdfSubtract(d1, d2) { return Math.max(d1, -d2); }

function sdfSmoothUnion(d1, d2, k) {
  const h = Math.max(k - Math.abs(d1 - d2), 0) / k;
  return Math.min(d1, d2) - h*h*k*0.25;
}

// Scene SDF (union of all shapes)
function scene(px, py) {
  const c = sdfCircle(px, py, circleX, circleY, 50);
  const b = sdfBox(px, py, boxX, boxY, 80, 40);
  return sdfSmoothUnion(c, b, smoothK);
}

// Collision detection: exact, no grid errors
function collide(particle) {
  const d = scene(particle.x, particle.y);
  if (d < PARTICLE_RADIUS) {
    // Compute normal by finite differences
    const eps = 0.5;
    const nx = scene(particle.x + eps, particle.y) - scene(particle.x - eps, particle.y);
    const ny = scene(particle.x, particle.y + eps) - scene(particle.x, particle.y - eps);
    const len = Math.sqrt(nx*nx + ny*ny) || 1;
    // Push particle out of the surface
    const penetration = PARTICLE_RADIUS - d;
    particle.x += (nx/len) * penetration;
    particle.y += (ny/len) * penetration;
    // Reflect velocity
    const vDotN = particle.vx*(nx/len) + particle.vy*(ny/len);
    particle.vx -= 2 * vDotN * (nx/len);
    particle.vy -= 2 * vDotN * (ny/len);
  }
}
```

---

## The Wow Moment — Push It

**Live SDF sculpting:** Click-drag to move shape primitives (circles, boxes) while hundreds of particles interact with the scene SDF in real time. The union and intersection update live — particles respond to the morphing geometry instantly because there's no grid to update, just a function call.

**Smooth blending slider:** Adjust the smoothK parameter in sdfSmoothUnion from 0 (hard union) to 100 (extreme smooth blending). Watch shapes melt together like clay. At high smoothness, it's indistinguishable from organic sculpting.

**WebGL ray-marching upgrade:** Port the scene SDF to a GLSL fragment shader. Render the full 3D version: a procedural landscape (sdfBox stacked with sdfSphere subtractions for craters), fly-through in real time. The entire 3D scene is defined in 30 lines of math. No meshes, no triangles, no vertices.

**SDF fonts:** Type text on screen. Each letter is an SDF (precomputed from glyph outlines). Scale to 0.1× and then 100× — perfect sharpness at any size, because the underlying SDF is queried at the render resolution, not stored at one resolution.

---

## The Interactive Demo

**Shape type selector:** circle, box, capsule, torus (2D approximation), hexagon.
**Shape manipulation:** drag to move, scroll to resize, keyboard R to rotate.
**Boolean operation selector:** union (min), intersection (max), subtraction.
**Smooth blend k slider:** 0–200 for the smooth union blend width.
**Particle physics toggle:** spawn 1,000 particles that interact with the SDF scene via collision detection. Change shapes — particles re-collide instantly.
**Show SDF heatmap:** color the background by SDF value (red = inside, blue = outside, white = near surface). Reveals the true distance field.
**Show gradient arrows:** at each cell, draw an arrow proportional to ∇SDF — should always point outward and have unit length.
**Eikonal error meter:** display average |∇SDF| - 1 (should be 0 for exact SDFs, nonzero for grid SDFs).
**"Ray march" mode:** render the scene as a ray-marched image for a selected 3D primitive.

---

## Production Notes

**Code on screen:** Start with just `sdfCircle` (3 lines). Build up: add `sdfBox` (5 lines). Add `sdfUnion` (1 line). Add `sdfSmoothUnion` (3 lines). Show the entire scene SDF as a composition of these 4 functions — 12 lines of code that describes arbitrarily complex geometry.

**Key visual at 2:30:** Show the SDF heatmap — glowing red inside the shape, cooling to blue outside, bright white along the zero-levelset (surface). As you move the shape, the heatmap updates in real time. The distance interpretation is immediately visually clear — redder = deeper inside.

**Key cinematic moment at 6:00:** The smooth union slider animation. Start with two separate circles (k=0). Slowly drag k up to 100. The two circles grow tendrils toward each other, then smoothly merge into a peanut shape, then a blob, then a single large circle as k→∞. The biological / organic feel of smooth unions is immediately apparent. This is why metaballs are compelling for character art.

**Key moment at 9:00:** Ray marching demo — a procedural 3D landscape defined entirely as a 25-line GLSL function, no mesh data, running at 60fps. The viewer realizes: this entire 3D world is just one math function.

---

## Tags

`SDF` `signed-distance-field` `collision-detection` `boolean-operations` `ray-marching` `WebGL` `geometry` `implicit-surface`

---

## Thumbnail

**Dark background. Center: a glowing zero-levelset surface** — a complex organic shape (sphere smoothly blending into a box into a cylinder) rendered in bright white wireframe. The surrounding background is a smooth gradient heatmap from deep red (inside) through black to deep blue (outside). Bold white text: "ONE FUNCTION — ALL SHAPES". Bottom strip: the three key operations illustrated in small: Union (circle ∪ box = merged shape), Intersection (∩), Subtraction (hole punched through). Subtitle in gold: "min(d1, d2)". The minimalism of the math vs the complexity of the shape is the visual thesis.
