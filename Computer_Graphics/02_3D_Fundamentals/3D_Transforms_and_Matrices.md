---
title: 3D Transforms and Matrices
aliases: [MVP Matrix, TRS Transform, Quaternion, Gimbal Lock]
tags: [Computer_Graphics, 3D_Fundamentals, Transforms, Matrices]
domain: Computer_Graphics
difficulty: Intermediate
created: 2026-07-26
related: [Projection_and_Viewing, GLSL_Vertex_Shaders, Coordinate_Systems_and_Handedness]
status: complete
---

# 🔢 3D Transforms and Matrices

> [!abstract] TL;DR
> 3D graphics uses 4×4 homogeneous matrices where w=1 encodes points and w=0 encodes directions (w=0 vectors ignore translation). The TRS (Translation · Rotation · Scale) decomposition builds a model matrix: M = T · R · S. The full transform chain is MVP = Projection · View · Model, applied column-vector right-to-left (gl_Position = MVP · vec4(pos, 1.0)). The lookAt view matrix is built from an eye-at-up triple. Euler angles suffer gimbal lock when two axes align; quaternions avoid this via slerp (spherical linear interpolation). OpenGL uses column-major storage; HLSL uses row-major — mismatching causes transposed results.

---

## Intuition — Analogy First

Think of placing a chess piece on a board. First you decide how big it should be (scale), then which direction it faces (rotate), then where it sits on the board (translate). The key insight is that ORDER MATTERS: scaling then rotating is completely different from rotating then scaling. Matrices encode all three operations into one 4×4 grid, and the chain M = T · R · S means "apply S first, then R to the result, then T" — because matrix-vector multiplication is evaluated right to left.

The "w" column is the magic that lets us encode both position changes (translation, which needs 4D) and direction vectors (which should NOT translate). A direction like "the wind blows north" is the same regardless of where you stand — so its w=0 zeroes out the translation column.

---

## How It Works

```mermaid
graph LR
    LOCAL["Object Space\nw=1 points"]:::space
    MODEL["× Model Matrix M\nTRS order"]:::mx
    WORLD["World Space"]:::space
    VIEW["× View Matrix V\nlookAt()"]:::mx
    CAMERA["Camera/Eye Space"]:::space
    PROJ["× Projection Matrix P\nPerspective"]:::mx
    CLIP["Clip Space\nhomogeneous"]:::space
    DIVIDE["÷ w\nPerspective divide"]:::op
    NDC["NDC\n[-1,1]³"]:::space
    VIEWPORT["Viewport Transform"]:::op
    SCREEN["Screen Space\npixels"]:::space

    LOCAL --> MODEL --> WORLD --> VIEW --> CAMERA --> PROJ --> CLIP --> DIVIDE --> NDC --> VIEWPORT --> SCREEN

    classDef space fill:#0f3460,stroke:#e94560,color:#fff
    classDef mx fill:#16213e,stroke:#57a773,color:#a8d8ea
    classDef op fill:#1a1a2e,stroke:#f5a623,color:#ffe0a3
```

---

## Key Concepts / Details

### Homogeneous Coordinates

| Type | Representation | Translation Effect |
|------|---------------|-------------------|
| Point | `(x, y, z, 1)` | Translated |
| Direction/vector | `(x, y, z, 0)` | NOT translated |

Translation matrix T for (tx, ty, tz):
```
T = [1  0  0  tx]
    [0  1  0  ty]
    [0  0  1  tz]
    [0  0  0   1]
```

For a direction `v = (dx, dy, dz, 0)`:
```
T · v = (dx + 0·tx, dy + 0·ty, dz + 0·tz, 0) = (dx, dy, dz, 0)
```
Translation has no effect — correct behavior for vectors.

### Scale Matrix

```
S(sx,sy,sz) = [sx  0   0   0]
              [0   sy  0   0]
              [0   0   sz  0]
              [0   0   0   1]
```

Non-uniform scaling (sx≠sy≠sz) distorts normals. To transform normals correctly, use the **inverse-transpose of the model matrix**: `N_matrix = (M⁻¹)ᵀ`

### Rotation Matrices

Rotation about the Z-axis by angle θ:
```
Rz(θ) = [cosθ  -sinθ  0  0]
         [sinθ   cosθ  0  0]
         [0      0     1  0]
         [0      0     0  1]
```

Euler angles (pitch/yaw/roll) compose as `R = Ry · Rx · Rz` (order is convention-dependent). **Gimbal lock** occurs when two rotation axes align (e.g., pitch 90° aligns roll axis with yaw axis), losing one degree of freedom.

### Quaternion Representation

A quaternion `q = (w, x, y, z)` encodes rotation as:
```
q = cos(θ/2) + sin(θ/2) · (ax·i + ay·j + az·k)
```

Where `(ax, ay, az)` is the unit rotation axis and θ is the angle.

**SLERP** (spherical linear interpolation) between quaternions q₀ and q₁ at t:
```
slerp(q₀, q₁, t) = q₀ · (q₀⁻¹ · q₁)ᵗ
                  = sin((1−t)Ω)/sinΩ · q₀ + sin(tΩ)/sinΩ · q₁
```
Where Ω = arccos(q₀ · q₁). Slerp maintains unit quaternion constraint and constant angular velocity — smooth, gimbal-lock-free interpolation.

```glsl
// GLSL quaternion slerp
vec4 qslerp(vec4 q0, vec4 q1, float t) {
    float cosTheta = dot(q0, q1);
    if (cosTheta < 0.0) { q1 = -q1; cosTheta = -cosTheta; }  // shortest path
    if (cosTheta > 0.9995) return normalize(mix(q0, q1, t));  // fallback to lerp
    float angle = acos(cosTheta);
    return (sin((1.0-t)*angle)*q0 + sin(t*angle)*q1) / sin(angle);
}
```

### TRS Model Matrix

The model matrix composes Scale → Rotate → Translate:

```
M = T · R · S
```

In code (column-major OpenGL convention):
```cpp
glm::mat4 model = glm::mat4(1.0f);
model = glm::translate(model, position);   // T
model = glm::rotate(model, angle, axis);   // R  
model = glm::scale(model, scaleVec);       // S
// result: T·R·S — scale applied first
```

### lookAt View Matrix

Given eye position `E`, target `AT`, and up vector `UP`:

```
forward = normalize(E − AT)    // in OpenGL right-hand: camera looks down -Z
right   = normalize(UP × forward)
up      = forward × right

View = [right.x   right.y   right.z   −dot(right, E)  ]
       [up.x      up.y      up.z      −dot(up, E)     ]
       [forward.x forward.y forward.z −dot(forward, E)]
       [0         0         0          1              ]
```

### MVP Uniform in Shaders

```glsl
// Vertex shader
layout(location = 0) in vec3 aPos;
uniform mat4 uModel, uView, uProjection;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(aPos, 1.0);
}
```

```cpp
// CPU side
glUniformMatrix4fv(loc, 1, GL_FALSE, glm::value_ptr(mvpMatrix));
// GL_FALSE = do NOT transpose (glm stores column-major, matching GL)
```

**HLSL row-major trap**: HLSL defaults to row-major matrix storage. When uploading from GLM (column-major), either transpose on CPU or use `column_major` keyword in HLSL.

### Storage Convention Table

| API | Storage | Multiply Order | Comment |
|-----|---------|---------------|---------|
| OpenGL/GLSL | Column-major | `P*V*M*v` | Standard |
| DirectX/HLSL | Row-major default | `v*M*V*P` | Must transpose for D3D upload |
| Vulkan/SPIRV | Column-major | `P*V*M*v` | Same as OpenGL |
| GLM library | Column-major | `P*V*M*v` | Matches GL/Vulkan |

---

## Real-World Notes

- **Skinned mesh animations** compose 50–200 bone matrices per frame; SIMD (SSE/NEON) and GPU compute make this tractable.
- **Shadow maps** require a second MVP from the light's perspective — the same TRS math reused.
- **Quaternion-to-matrix**: convert once per frame when uploading to GPU; don't store matrices in animation data (too large).
- **Normal matrix bug**: many beginner shaders pass `mat3(model)` as the normal transform — wrong for non-uniform scale. Use `transpose(inverse(mat3(model)))`.

---

## Common Pitfalls

1. **Row vs column major confusion** — passing a GLM matrix (column-major) to HLSL without transposing produces a transposed/wrong transform.
2. **TRS order reversal** — placing `glm::scale` before `glm::translate` in code looks like T·S not T·R·S; the right-to-left application order means the LAST code call is the FIRST applied.
3. **Normal matrix omission** — using the model matrix directly for normal transformation gives wrong lighting with non-uniform scale.
4. **Quaternion double-cover** — q and −q represent the same rotation; slerp must flip q₁ if `dot(q₀,q₁) < 0` to ensure the short arc is taken.

---

## Related Concepts

- [[_MOC_3D_Fundamentals|↑ 3D Fundamentals MOC]]
- [[Coordinate_Systems_and_Handedness|Coordinate Systems]] — determines axis conventions for these matrices
- [[Projection_and_Viewing|Projection & Viewing]] — P matrix detail
- [[../04_Shaders/GLSL_Vertex_Shaders|GLSL Vertex Shaders]] — MVP in `gl_Position`
- [[../06_Animation_and_Simulation/Skeletal_Animation_and_Skinning|Skeletal Animation]] — bone matrix chain uses TRS

---

## Review Questions

1. Why does a w=0 direction vector ignore translation in homogeneous matrix multiplication? Show the math.
2. Explain gimbal lock geometrically, and describe why quaternion slerp is immune to it.
3. A model is non-uniformly scaled (2×, 1×, 1×). What is the correct matrix for transforming its normals, and why does using the model matrix directly produce incorrect lighting?

---

## Sources

#Computer_Graphics #3D_Fundamentals #Transforms #Matrices
