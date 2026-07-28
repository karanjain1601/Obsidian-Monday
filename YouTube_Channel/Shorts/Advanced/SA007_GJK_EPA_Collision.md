---
title: "GJK + EPA Exact Collision Detection"
id: SA007
type: youtube-short
duration: "~45 seconds"
feeds_video: "Collision Detection Deep Dive: GJK, EPA, and Minkowski Sums"
difficulty: advanced
tags: [physics, simulation, short, advanced, gjk, epa, collision-detection, minkowski, convex]
---

> **What it is:** A ~45-second simulation of two convex polyhedra colliding -- GJK iteratively shrinks a simplex to test separability, then EPA expands it to extract penetration depth and contact normal. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Collision Detection Deep Dive: GJK, EPA, and Minkowski Sums

# Short: GJK + EPA Exact Collision Detection

**Feeds full video:** Collision Detection Deep Dive: GJK, EPA, and Minkowski Sums

## Visual Hook (First 3 Seconds)
Two irregular convex polyhedra (cyan and magenta, ~30 faces each) drift toward each other on a black background. The moment they touch, a white flash envelops them and "GJK: 0.003 ms" appears. A green contact normal arrow shoots out perfectly perpendicular to the touching surfaces.

## Main Visual Sequence (0:03–0:50)
- **0:03** — "Step 1: Minkowski Difference" caption. Cyan shape and magenta shape both visible. A third shape (yellow) grows between them — the Minkowski difference A⊖B. Text: "A⊖B contains origin ⟺ A∩B ≠ ∅".
- **0:10** — GJK simplex building: a point (iteration 1, blue dot) inside A⊖B; then a line segment (iteration 2); then triangle (iteration 3); then tetrahedron (iteration 4, gold). Each iteration adds a new support point with a white flash.
- **0:18** — Tetrahedron contains origin → collision confirmed. Origin highlighted as a bright white sphere inside the gold tetrahedron. Counter: "4 iterations".
- **0:25** — "Step 2: EPA for penetration depth". The yellow Minkowski difference polytope expands outward (cyan glow) face by face. Closest face to origin highlighted in magenta. Penetration depth = 0.043 m shown in red label.
- **0:35** — Contact manifold: 4 contact points appear (gold spheres) on the surfaces of the original shapes. Normal vector (green) points from magenta to cyan. Depth bars beside each point.
- **0:43** — Speed test: 10,000 shape pairs per frame, all tests running simultaneously. Tiny pairs flash green (no collision) or red (collision). FPS counter: 144 fps maintained.

## Physics Concept Teased
GJK (Gilbert-Johnson-Keerthi) proves two convex shapes overlap if and only if their Minkowski difference contains the origin, finding this iteratively via simplex construction; EPA (Expanding Polytope Algorithm) then extracts the exact penetration depth and contact normal from the boundary of that difference.

## On-Screen Text / Captions
- **0:00** — "Is there overlap? GJK knows in 4 steps." (white, top)
- **0:03** — "A ⊖ B — Minkowski Difference" (yellow, lower)
- **0:18** — "Origin inside simplex = COLLISION" (white, center flash)
- **0:25** — "EPA: expand polytope to find depth" (cyan, upper)
- **0:35** — "Penetration depth: 0.043 m" (red, label)
- **0:43** — "10,000 pairs/frame — still 144 fps" (white, bottom)

## End Card
Final 3 seconds: all 10,000 shape pairs glow green (no collisions). "CODED LAWS" in white. Subscribe button. "Next: LES Turbulence →" teaser.

## Audio
Subtle "ping" for each GJK iteration; electronic click on EPA expansion steps; triumphant single-note chord when contact manifold appears. 100 BPM minimal techno backing. No voiceover.

## Production Notes
GJK and EPA implemented in C++ with SIMD intrinsics (AVX2). Support function computed per convex hull face list. EPA heap-priority polytope expansion. Renderer: custom OpenGL 4.6 with instanced rendering for 10,000-pair benchmark. Contact manifold: Sutherland-Hodgman clipping.
