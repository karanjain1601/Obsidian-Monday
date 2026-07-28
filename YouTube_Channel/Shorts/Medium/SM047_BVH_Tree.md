---
title: "BVH Tree — How Collision Queries Scale with N"
id: SM047
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, collision-detection, BVH, spatial-acceleration, algorithms]
---

> **What it is:** A ~45-second simulation short where 1,000 bouncing circles demonstrate the collision-query gap between brute-force O(N²) and a Bounding Volume Hierarchy's O(N log N) — slashing nearly 500,000 tests down to 3,200 per frame with an identical result. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: BVH Tree — Collision Queries Scale with N

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D canvas with 1,000 bouncing coloured circles. Each circle is tested for collision with every other — a counter shows "499,500 collision tests/frame." Then a BVH tree structure appears — the same 1,000 circles now tested with only 3,200 tests. The simulation is identical but 150× fewer tests.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Brute-force O(N²) shown: with N=1000 circles, each must be tested against 999 others. Visual: lines drawn from one circle to all others (999 lines). Counter: "N² = 1,000,000 tests." FPS drops to 5.

**0:10–0:18** — BVH construction: circles are grouped by proximity into a binary tree of axis-aligned bounding boxes (AABBs). Level 0: one AABB containing all circles. Level 1: two AABBs (left half, right half of scene). Levels 2, 3... — recursively halved. Caption: "BVH: binary tree of bounding boxes."

**0:18–0:27** — BVH traversal: to find all circles intersecting circle A, descend the tree. If circle A doesn't intersect a node's AABB, skip the entire subtree. On average O(log N) tests per circle. Caption: "Skip entire subtrees — O(log N) per query."

**0:27–0:36** — Scaling comparison: N on x-axis (100 to 100,000). Two curves: O(N²) brute force (steep parabola) and O(N log N) BVH (nearly linear). At N=10,000 the gap is 10,000× — the BVH is simply non-negotiable for large simulations. Caption: "N=10,000: BVH is 10,000× fewer tests."

**0:36–0:45** — Real-time demo: 10,000 circles bouncing with BVH collision at 60fps. Without BVH: would need a 100-core CPU to do the same at 60fps. Bold text: "BVH — why physics engines scale." Fade to black.

## Physics Concept Teased
Bounding Volume Hierarchy (BVH): a tree structure of increasingly tight bounding volumes around groups of objects. A collision query (does object A hit anything?) traverses the tree, skipping entire subtrees when the bounding volume doesn't overlap. Average complexity O(N log N) vs. brute force O(N²) — enabling real-time simulation of thousands of objects.

## On-Screen Text / Captions
- **0:00** — "1,000 circles. How many collision tests?"
- **0:03** — "Brute force: N² = 1,000,000 tests"
- **0:10** — "BVH: axis-aligned bounding boxes"
- **0:18** — "Skip subtree if no AABB overlap — O(log N)"
- **0:25** — "N=10,000: BVH is 10,000× fewer tests"
- **0:35** — "10,000 circles at 60fps — only with BVH"
- **0:43** — "BVH — the spine of every physics engine."

## End Card
Final 3 seconds: 10,000 bouncing circles at 60fps with BVH tree overlay (tree structure shown in gold). Text: "Every game engine — Unity, Unreal, Bullet, PhysX — uses a BVH." CodedLaws logo.

## Audio
Fast, energetic electronic (120 BPM). Each collision test = rapid click (very fast, becomes white noise for O(N²); sparse clicks for BVH). Voiceover at 0:00: "N objects means N-squared collision checks — unless you use a BVH, which cuts it to N-log-N." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: BVH construction — top-down recursive spatial median split. AABB: min/max (x, y) of all circles in a node. Leaf node: single circle. Query: for circle A, traverse tree; if A.AABB doesn't overlap node.AABB, prune; else recurse into children. Actual collision: only for leaf-leaf pairs. Re-balance tree every 10 frames (circles move). Gotcha: BVH must be rebuilt as objects move — for many moving objects, use a SAP (Sweep and Prune) instead. Runtime: real-time Canvas 2D with JavaScript BVH.
