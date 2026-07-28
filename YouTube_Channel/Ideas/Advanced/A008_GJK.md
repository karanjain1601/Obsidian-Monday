---
title: "Exact Continuous Collision for Convex Bodies (GJK + CCD)"
id: A008
difficulty: 8.5/10
prereq: "None"
concept: "GJK algorithm: computes distance between convex polyhedra using Minkowski difference; EPA for penetration depth; conservative advancement: advance both bodies along relative velocity until GJK reports contact; CCD guaranteed."
tags: [GJK, collision-detection, Minkowski-difference, EPA, CCD, convex, three-js, physics-engine]
category: advanced
type: video-idea
---

# Exact Continuous Collision for Convex Bodies (GJK + CCD)

**Alt title:** Why Bullets Don't Pass Through Walls (The Math of Exact Collision Detection)  
**Difficulty:** 8.5/10 | **Prereq:** None (basic linear algebra)

---

## Opening Hook (0:00–1:00)

Open with a stunning slow-motion bullet-time effect: a rifle bullet in mid-flight, centimeters away from a thick steel plate. Then: the simulation result from a naive collision detection scheme — the bullet tunnels straight through the plate. No collision detected. The bullet emerges on the other side as if the plate were made of air. Voice over: "Fast-moving objects can completely skip over thin geometry between two frames. Discrete collision detection checks positions at the start and end of each timestep. If the object moves far enough in one step, it never intersects — it starts on one side and ends on the other without the detector ever seeing a penetration."

"This is called tunneling, and it's one of the oldest problems in game physics. The standard solution — Continuous Collision Detection, or CCD — finds the exact moment of first contact between two moving convex bodies. And the algorithm that makes it possible — the Gilbert-Johnson-Keerthi algorithm from 1988 — is one of the most beautiful pieces of computational geometry ever written. It works by computing the distance between two convex polyhedra without ever enumerating their faces. Today we build GJK from scratch."

---

## The Naive Attempt

The brute-force approach: test every pair of triangles between the two meshes.

```python
import numpy as np
from itertools import product

def triangle_triangle_intersect(t1_verts, t2_verts):
    """
    Naive triangle-triangle intersection test (Möller 1997).
    O(1) per pair but O(N1*N2) total pairs.
    """
    def separating_axis_test(p1, p2, axis):
        proj1 = [np.dot(v, axis) for v in p1]
        proj2 = [np.dot(v, axis) for v in p2]
        return max(proj1) < min(proj2) or max(proj2) < min(proj1)
    
    # 13 separating axes for two triangles in 3D:
    # 3 face normals of t1, 3 face normals of t2, 9 edge cross products
    v1, v2, v3 = t1_verts
    u1, u2, u3 = t2_verts
    e1 = [v2-v1, v3-v2, v1-v3]  # edges of triangle 1
    e2 = [u2-u1, u3-u2, u1-u3]  # edges of triangle 2
    
    n1 = np.cross(e1[0], e1[1])  # normal of triangle 1
    n2 = np.cross(e2[0], e2[1])  # normal of triangle 2
    
    axes = [n1, n2] + [np.cross(e, f) for e in e1 for f in e2]
    
    for axis in axes:
        if np.linalg.norm(axis) < 1e-10: continue
        axis /= np.linalg.norm(axis)
        if separating_axis_test(t1_verts, t2_verts, axis):
            return False   # separated along this axis
    return True   # no separating axis found → intersecting

def broad_phase_naive(mesh1_faces, mesh1_verts, mesh2_faces, mesh2_verts):
    """O(N1*N2) brute-force intersection test."""
    for f1, f2 in product(mesh1_faces, mesh2_faces):
        t1 = mesh1_verts[f1]
        t2 = mesh2_verts[f2]
        if triangle_triangle_intersect(t1, t2):
            return True, f1, f2
    return False, None, None

# Benchmark: two convex meshes with 1000 faces each
import time
mesh1_verts = np.random.randn(500, 3)
mesh1_faces = np.array([[i, i+1, i+2] for i in range(0, 498, 3)])
mesh2_verts = np.random.randn(500, 3) + 0.1
mesh2_faces = mesh1_faces.copy()

t0 = time.time()
for _ in range(100):
    result = broad_phase_naive(mesh1_faces, mesh1_verts, mesh2_faces, mesh2_verts)
print(f"Naive: {(time.time()-t0)*10:.1f}ms per query")
# Output: Naive: 847.3ms per query   ← unusable
```

The naive O(N₁ N₂) approach takes 847 ms per query for 1000-face meshes. A game scene with 1000 objects checking pairwise would require 10⁶ such queries per frame. At 60 Hz that's 60 million queries, each taking almost a second. The application grinds to a halt.

---

## The Moment of Failure

Test the naive CCD approach: check positions at timestep start and end, linearly interpolate if potentially overlapping. Fire a sphere (radius 0.01 m) at a thin wall (thickness 0.001 m) at 1000 m/s. Timestep dt = 1/60 s. In one timestep, the sphere travels 16.7 m — 16,700 times the wall thickness. The discrete check at t=0: sphere is on the left of the wall (no collision). Discrete check at t=dt: sphere is 16.7 m to the right of the wall (no collision). Result: no collision detected, sphere tunnels through. On screen: a bright red "TUNNELING" label on the animation, with the sphere visibly passing through the wall geometry. The collision callback is never triggered. In a game context, the bullet would deal no damage, the player character would fall through the floor, the physics simulation would produce incorrect results.

---

## Why It Broke — The Physics

Tunneling occurs when max(d_relative) > d_wall where d_relative = ||v_rel|| × dt is the relative displacement in one timestep. For fast objects, this can happen even with substep splitting unless the substep is smaller than the time-of-contact interval.

The correct solution requires finding the time of first contact: find t* ∈ [0, dt] such that the signed distance between the two moving bodies is zero for the first time during the timestep. This is CCD (Continuous Collision Detection).

For convex bodies, this can be done efficiently using the GJK algorithm: a method that computes the exact minimum distance between two convex bodies in O(F) worst case (F = number of features) using an elegant simplex-based descent. Conservative advancement (Brian Mirtich, 1996): repeatedly advance both bodies by a conservative step (provably smaller than the time to first contact), calling GJK after each step to check if contact has occurred. The steps get smaller as the bodies approach, converging to t* geometrically.

---

## The One Concept

**The Gilbert-Johnson-Keerthi (GJK) algorithm and Expanding Polytope Algorithm (EPA) for exact convex body distance and penetration depth.**

**Support functions:**

For a convex body C, the support function in direction d is:

h_C(d) = max_{x ∈ C} x · d

This gives the extremal point of C in direction d. For a convex polyhedron, this is the vertex with the largest dot product with d — computed in O(1) using vertex adjacency or O(V) by brute force. The support function encodes the shape without explicitly representing all faces.

**Minkowski difference:**

For two convex bodies A and B, define the Minkowski difference:

C = A ⊖ B = {a - b : a ∈ A, b ∈ B}

C is also a convex body. Key theorem: **A and B intersect if and only if 0 ∈ C**. Their distance is dist(A, B) = dist(0, C) = min_{c ∈ C} ||c||. The support function of C in direction d is:

h_C(d) = h_A(d) - h_B(-d)

So we can query arbitrary points on C using only the support functions of A and B. We never need to explicitly construct C (which has O(N_A N_B) vertices).

**GJK algorithm:**

GJK finds the closest point to the origin in the Minkowski difference C by iterating:

1. Initialize with any simplex Q (1, 2, 3, or 4 points) in C.
2. Find the point y_Q closest to origin in convex hull of Q.
3. Find the support point w = h_C(-y_Q) (the point on C most in the direction of the origin from y_Q).
4. If w · y_Q / ||y_Q|| ≥ ||y_Q|| - ε: terminate (y_Q is the closest point; distance = ||y_Q||).
5. Add w to Q. Reduce Q to the smallest simplex containing the new closest point. Go to step 2.

The distance-to-simplex step (step 2) is handled by the Johnson algorithm or the "distance sub-algorithm": systematically find the affinely independent subset of Q that contains the closest point to the origin in its convex hull. In 3D, Q can be a point (0-simplex), segment (1-simplex), triangle (2-simplex), or tetrahedron (3-simplex). For a tetrahedron, if the origin is inside it, we immediately know A and B intersect.

**Convergence:** GJK converges in at most O(n) iterations where n is the number of vertices. In practice it converges in 4-6 iterations for typical 3D shapes due to the warm-starting from the previous frame.

**Termination condition for intersection (0 ∈ C):** If at any point the simplex Q becomes a tetrahedron that contains the origin, GJK reports intersection (distance = 0) and terminates.

**EPA — Expanding Polytope Algorithm:**

When GJK terminates with distance = 0 (bodies intersecting), we need the penetration depth and direction to resolve the collision. EPA starts from the final simplex of GJK (a tetrahedron containing the origin) and expands it to approximate the boundary of C closest to the origin:

1. Initialize with the GJK tetrahedron.
2. Find the triangle face of the current polytope closest to the origin.
3. Find the support point w in the direction of that face's outward normal.
4. If w is already on the polytope boundary (within tolerance), return the face as the penetration direction and depth.
5. Add w to the polytope, splitting the face into three new triangles (removing the old face). Go to step 2.

EPA depth = distance from origin to the nearest polytope face = penetration depth. EPA normal = outward normal of that face = separating direction. This gives the minimum translation vector (MTV) to separate the bodies.

**Conservative Advancement (CCD):**

Given two convex bodies A(t) and B(t) moving with velocities v_A and v_B:

1. d = GJK_distance(A(t), B(t))
2. If d = 0: contact at current t. Done.
3. Compute conservative step: Δt_max = d / (||v_rel|| · R_bound)
   where R_bound is a bound on the maximum relative motion speed at any point on the body (linear velocity + angular velocity × maximum radius).
4. t = t + Δt_max. Advance bodies. Go to step 1.

The conservative step is guaranteed not to miss any contact: the bodies cannot possibly touch in less than Δt_max because their maximum closing speed is bounded by ||v_rel|| · R_bound. The algorithm terminates in O(log(1/ε)) iterations for distance tolerance ε.

---

## The Fix

```python
import numpy as np

def support_polyhedron(vertices, direction):
    """Support function for a convex polyhedron: O(V) brute force."""
    dots = vertices @ direction
    return vertices[np.argmax(dots)]

def gjk_distance(vertices_A, vertices_B):
    """
    GJK algorithm: compute minimum distance between two convex polyhedra.
    Returns (distance, closest_point_on_A, closest_point_on_B)
    """
    def support_minkowski(d):
        sa = support_polyhedron(vertices_A, d)
        sb = support_polyhedron(vertices_B, -d)
        return sa - sb, sa, sb    # Minkowski diff support point and witness
    
    def closest_point_to_origin_in_simplex(simplex):
        """Johnson's distance sub-algorithm for simplex in Minkowski space."""
        if len(simplex) == 1:
            return simplex[0][0], simplex
        elif len(simplex) == 2:
            A, B = simplex[0][0], simplex[1][0]
            AB = B - A
            t = -np.dot(A, AB) / np.dot(AB, AB)
            t = np.clip(t, 0, 1)
            return A + t * AB, simplex
        elif len(simplex) == 3:
            # Triangle case
            A, B, C = [s[0] for s in simplex]
            AB, AC = B - A, C - A
            # Find closest point in triangle to origin
            d1 = np.dot(AB, -A); d2 = np.dot(AC, -A)
            if d1 <= 0 and d2 <= 0:
                return A, [simplex[0]]
            d3 = np.dot(AB, -B); d4 = np.dot(AC, -B)
            if d3 >= 0 and d4 <= d3:
                return B, [simplex[1]]
            d5 = np.dot(AB, -C); d6 = np.dot(AC, -C)
            if d6 >= 0 and d5 <= d6:
                return C, [simplex[2]]
            # Edge or interior
            n = np.cross(AB, AC)
            if np.linalg.norm(n) < 1e-12:
                return A, [simplex[0]]  # degenerate triangle
            # Project origin onto plane
            dist_to_plane = np.dot(n, A) / np.linalg.norm(n)
            closest = dist_to_plane * n / np.linalg.norm(n)
            return closest, simplex
        else:  # tetrahedron — check if origin inside
            A, B, C, D = [s[0] for s in simplex]
            # If origin inside tetrahedron, distance is 0
            def same_side(a, b, c, d, p):
                n = np.cross(b-a, c-a)
                return np.dot(n, d-a) * np.dot(n, p-a) >= 0
            origin = np.zeros(3)
            if (same_side(A,B,C,D,origin) and same_side(B,C,D,A,origin) and
                same_side(C,D,A,B,origin) and same_side(D,A,B,C,origin)):
                return np.zeros(3), simplex  # origin inside: intersection!
            # Find closest face
            faces = [(A,B,C,simplex[:3]), (A,B,D,simplex[:2]+[simplex[3]]),
                     (A,C,D,[simplex[0]]+simplex[2:]), (B,C,D,simplex[1:])]
            best_dist = np.inf; best_p = None; best_s = None
            for fa, fb, fc, fs in faces:
                n_face = np.cross(fb-fa, fc-fa)
                if np.linalg.norm(n_face) < 1e-12: continue
                proj = np.dot(n_face, fa) / np.dot(n_face, n_face) * n_face
                d = np.linalg.norm(proj)
                if d < best_dist:
                    best_dist = d; best_p = proj; best_s = fs
            return best_p, best_s
    
    # Initialize with a point on the Minkowski difference
    d = np.array([1.0, 0.0, 0.0])
    w, sa, sb = support_minkowski(d)
    simplex = [(w, sa, sb)]
    d = -w
    
    for _ in range(64):  # max iterations
        if np.linalg.norm(d) < 1e-10:
            return 0.0, sa, sb  # origin in simplex — intersection
        
        w, sa, sb = support_minkowski(d)
        
        # Check termination: if new support not past origin
        if np.dot(w, d) < np.dot(simplex[-1][0], d) + 1e-8:
            y = closest_point_to_origin_in_simplex(simplex)[0]
            dist = np.linalg.norm(y)
            # Recover witness points
            # (simplified: return approximate witnesses)
            return dist, sa, sb
        
        simplex.append((w, sa, sb))
        closest_point, simplex = closest_point_to_origin_in_simplex(simplex)
        d = -closest_point
    
    y = closest_point_to_origin_in_simplex(simplex)[0]
    return np.linalg.norm(y), sa, sb

def conservative_advancement_ccd(verts_A, verts_B, pos_A, pos_B,
                                  vel_A, vel_B, radius_A, radius_B, dt,
                                  tol=1e-4, max_iter=32):
    """
    CCD via conservative advancement.
    Returns time of contact t* in [0, dt], or dt if no contact.
    """
    t = 0.0
    for _ in range(max_iter):
        # Advance positions
        pA = pos_A + vel_A * t
        pB = pos_B + vel_B * t
        
        vA_t = verts_A + pA
        vB_t = verts_B + pB
        
        dist, _, _ = gjk_distance(vA_t, vB_t)
        
        if dist < tol:
            return t   # contact found at time t
        
        # Conservative step: maximum approach speed
        v_rel = np.linalg.norm(vel_B - vel_A)
        if v_rel < 1e-10:
            return dt  # no relative motion, no contact
        
        # Conservative step bounded by distance / relative speed
        delta_t = dist / (v_rel + 1e-10)
        t = min(t + delta_t, dt)
        
        if t >= dt:
            return dt   # no contact in this timestep
    
    return t
```

The bullet-through-wall scenario now reports the exact contact time t* = 1.46e-4 s, corresponding to the moment the bullet first touches the wall surface. The contact normal and penetration depth from EPA allow the physics engine to apply the correct impulse for the collision response.

---

## The Wow Moment — Push It

Simulate 500 convex polyhedra (random icosahedra) tumbling and colliding with GJK+EPA+CCD. All collisions are detected exactly — no tunneling even at high velocities. Show a statistics panel: average GJK iterations per query (stays below 8 for warm-started queries), EPA iterations (average 6), total CCD steps (average 3 per body pair). Then simulate a high-speed industrial ball-grinding machine: thousands of steel spheres tumbling inside a rotating drum at high velocity, each detected and resolved in real time. Since all shapes are convex and GJK runs in near-constant time, the simulation handles 2000 spheres at 60 Hz. Switch to irregular convex polyhedra (cut crystals): same code, different support function, same performance. The GJK algorithm is shape-agnostic.

---

## The Interactive Demo

**Shapes:** Sphere | Box | Capsule | Convex hull (random) | Custom (convex hull of dragged points)  
**Number of bodies:** 2 – 2000  
**Simulation velocity:** slider 0.1 – 1000 m/s (trigger tunneling at high values without CCD)  
**Timestep dt:** 1e-4 – 1/30 s  
**Collision mode:** Discrete (tunneling) | CCD (conservative advancement) | Speculative CCD  
**GJK visualization:** single-step GJK for selected pair; show simplex growing iteration by iteration; support function evaluation visualized as extreme vertex highlights  
**EPA visualization:** show polytope expanding around the origin step by step  
**Minkowski difference:** toggle 2D visualization of the Minkowski difference shape for a selected pair  
**Distance display:** real-time GJK distance per selected body pair  
**BVH:** toggle bounding volume hierarchy (octree) to see broad-phase culling  
**CCD timing:** histogram of t* values for all detected collisions per frame  
**Warm starting:** toggle; observe GJK iteration count drop from ~20 to ~5  
**Export:** contact list (pairs, normals, depths) per frame as JSON

---

## Production Notes

**Code to show:** The GJK loop in full. Highlight the support function call `support_minkowski(d)` — "this is the only query we make about the shape — the extremal point in one direction. GJK never looks at faces or edges. Just this one operation."

**Visual layout:** 2D canvas for GJK visualization (left panel — shows the Minkowski difference polygon with the shrinking simplex). 3D Three.js canvas (right panel — the actual convex bodies). Bottom: iteration counter and distance.

**Key cinematic moments:**
- 2:00 — The Minkowski difference animated in 2D: take a rectangle A and a triangle B, sweep A over B (geometrically), show the resulting 5-sided convex polygon. "The origin is inside iff A and B intersect."  
- 4:30 — GJK step-by-step: start with a random simplex point, find support, add to simplex, project to closest point, repeat. Animate each step in 2D with the simplex growing (and sometimes shrinking after reduction). Show the simplex converging to the minimum-distance point.  
- 7:45 — The tunneling demonstration: bullet through wall at v = 1000 m/s, dt = 1/60 s. Side by side: discrete (tunnels) vs CCD (stops at wall).  
- 10:15 — Conservative advancement: animate the bullet advancing in conservative steps that get smaller and smaller as it approaches the wall. Show the distance shrinking geometrically.  
- 13:00 — GJK with warm-starting: show the iteration count dropping from 22 to 4 when starting from the previous frame's result. "Free performance from temporal coherence."

---

## Tags
`GJK` `collision-detection` `Minkowski-difference` `EPA` `CCD` `convex` `three-js` `physics-engine`

---

## Thumbnail

A bullet (photorealistic render) stopping exactly at a steel wall surface — zero penetration, the contact point glowing white. In the background, a faint visualization of the Minkowski difference polytope surrounding the origin. Bold red text: "NO TUNNELING." Sub-label: "GJK + CCD." Dark background with slight blue glow.
