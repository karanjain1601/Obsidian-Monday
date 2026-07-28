---
title: "Collision Detection for a Thousand Moving Objects (Dynamic BVH)"
id: M047
difficulty: 6/10
prereq: "None"
concept: "Bounding Volume Hierarchy: tree of AABBs; broad-phase collision by traversing two BVH trees; re-fit AABBs each frame (refit is O(N)); refitting faster than full rebuild; incremental insertion/deletion for dynamic scenes."
tags: [BVH, collision-detection, AABB, broad-phase, spatial-acceleration, tree, canvas, physics-engine]
category: medium
type: video-idea
---

# Collision Detection for a Thousand Moving Objects (Dynamic BVH)

**Alt title:** "Why O(N²) Collision Detection Is a Death Sentence for Your Physics Engine"
**Difficulty:** 6/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

On screen: a simple Canvas simulation. 10 balls bouncing around. Smooth, 60fps. Add 10 more. Still smooth. The camera on the dev's face: "Looks great. Ship it." Fast forward: 100 balls. 30fps. 200 balls. 10fps. 500 balls. 2fps. 1,000 balls: the tab freezes. Browser's unresponsive-page dialog appears.

Voice: *"The most common performance mistake in a physics engine is naive O(N²) collision detection — checking every object against every other object. With 1,000 objects, that's 500,000 collision checks per frame. With 10,000 objects, it's 50 million. But the real number of actually colliding pairs is almost always tiny — maybe 10 or 20. The art is finding those 10 pairs without checking all 50 million. A Bounding Volume Hierarchy does exactly this, and today we're going to build one that dynamically updates as objects move, so it's always ready for the broad-phase query."*

Counter on screen: "1,000 objects. 499,500 unnecessary checks per frame."

---

## The Naive Attempt

The classic O(N²) check — every object versus every other:

```javascript
function checkCollisionsNaive(objects) {
  const pairs = [];
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      if (overlaps(objects[i], objects[j])) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}

function overlaps(a, b) {
  // AABB overlap test — very fast (6 comparisons)
  return a.minX < b.maxX && a.maxX > b.minX &&
         a.minY < b.maxY && a.maxY > b.minY;
}
```

Profile it: at N=200, the collision check takes 3.2ms/frame (within budget). At N=1000, it takes 62ms/frame (totally unacceptable). The profiler shows 100% of time in the nested loop.

Also: try Sort-and-Sweep (sweep-and-prune) as a first fix attempt. Sort objects by minX; sweep to find overlapping x-intervals; then check those for y-overlap. Works well for temporally coherent scenes (objects don't jump around), but for randomly moving objects the sort invalidates frequently and re-sorting is O(N log N). Better than O(N²) but not good enough at N=10,000.

---

## The Moment of Failure

FPS counter on screen: 1,000 objects, naive approach, 1fps. Each frame takes 620ms because the nested loop processes 499,500 pairs (N×(N-1)/2). The profiler flame graph shows a solid wall of `checkCollisionsNaive` calls. The Chrome task manager shows the JS thread pegged at 100% CPU. The physics simulation is completely unusable.

For Sort-and-Sweep: add 1,000 fast-moving objects. The insertion sort for each moved object degrades to O(N) swaps per object, O(N²) total. Same performance as naive in the worst case.

---

## Why It Broke — The Physics

The fundamental insight: **spatial locality**. Two objects 500 units apart in a 1000-unit world cannot possibly be colliding. Any algorithm that checks this pair is doing unnecessary work. We need a data structure that lets us ask: "given object A at position (x,y), which objects could possibly overlap it?" and answer this in O(log N) time.

An **Axis-Aligned Bounding Box (AABB)** for an object is its tightest-fitting rectangle aligned to the coordinate axes: `{minX, maxX, minY, maxY}`. Two objects can only collide if their AABBs overlap. The AABB overlap test is cheap: 4 comparisons.

A **Bounding Volume Hierarchy (BVH)** is a binary tree where:
- Each **leaf node** contains one object's AABB.
- Each **internal node** contains the AABB of all objects in its subtree.
- The root AABB contains all objects.

The invariant: parent AABB contains all children AABBs.

To query: "which objects overlap query AABB Q?":
```
function query(node, Q):
  if not overlaps(node.aabb, Q): return []  // prune entire subtree
  if node.isLeaf: return [node.object]
  return query(node.left, Q) + query(node.right, Q)
```

If Q is small (a single object), only O(log N) nodes need to be checked — the tree prunes entire subtrees when their parent AABB doesn't overlap Q. In the expected case for a sparse scene, each query is O(log N), making the full broad-phase O(N log N) instead of O(N²).

The challenge: objects move, so AABBs change. Two strategies:
1. **Full rebuild:** reconstruct the entire tree each frame. O(N log N) build time, always optimal tree structure. Too slow for large N.
2. **Refit:** propagate updated leaf AABBs up the tree (each internal node's AABB is the union of its children). O(N) refit. Tree structure stays fixed but may become suboptimal as objects drift.
3. **Incremental updates:** remove moved objects, re-insert them. O(log N) per moved object, maintains tree quality.

Dynamic BVH (Catto 2019 Box2D) uses a combination of incremental insertion and a fat AABB optimization: expand each leaf AABB by a "fat radius" (e.g., 10 units beyond the object). Reinsert only when the object's true AABB exits its fat AABB — this amortizes insertions over many frames since most objects don't move far in one step.

---

## The One Concept

**Bounding Volume Hierarchy: O(N log N) Broad-Phase Collision Detection**

A BVH organizes objects in a tree such that each internal node's bounding volume contains all objects in its subtree. The key operations are:

**Construction (top-down SAH):** To build a good tree, use the **Surface Area Heuristic (SAH)**. For a set S of objects, find the split axis and position that minimizes:
> **cost = SA(left)/SA(parent) × N_left + SA(right)/SA(parent) × N_right**

where SA is the surface area of the AABB and N is the object count. This minimizes the expected number of node-object tests for random queries. Build time: O(N log²N) for full SAH. A simple approximation: split at the median along the longest axis — O(N log N), often good enough.

**Refit (bottom-up):** After all leaves have updated AABBs (objects moved), recompute each internal node's AABB as the union of its children's AABBs, traversing bottom-up:
```javascript
function refit(node) {
  if (node.isLeaf) {
    node.aabb = node.object.computeAABB();
    return;
  }
  refit(node.left); refit(node.right);
  node.aabb = union(node.left.aabb, node.right.aabb);
}
```
Cost: O(N) since every node is visited once.

**Broad-phase query:** For each object i, query the BVH with i's (fattened) AABB to find candidate pairs:
```javascript
function broadPhase(bvh, objects) {
  const pairs = new Set();
  for (const obj of objects) {
    const candidates = bvh.query(obj.aabb);
    for (const other of candidates) {
      if (other.id <= obj.id) continue;  // avoid duplicates
      if (aabbOverlap(obj.aabb, other.aabb)) {
        pairs.add([obj.id, other.id]);
      }
    }
  }
  return pairs;
}
```

**Dynamic insertion (Box2D approach):** When an object is inserted, traverse the tree greedily choosing the branch that minimizes the increase in total tree cost (SAH-guided insertion). O(log N) per insertion. When an object moves outside its fat AABB, remove it and reinsert. The fat AABB radius is tuned so reinsertion happens once every ~20 frames on average.

**Tree quality metric:** Track the sum of all node AABB surface areas, normalized by the optimal tree's cost. Fresh tree: 1.0–1.2. After many dynamic updates without rebuild: may reach 2.0–3.0 (inefficient). Trigger a full rebuild (O(N log N)) when the metric exceeds a threshold.

**Two-tree traversal for self-collision (cloth / fluids):** To find ALL collision pairs in a scene (not just one object vs. all), traverse the BVH against itself:
```javascript
function selfQuery(nodeA, nodeB, pairs) {
  if (!aabbOverlap(nodeA.aabb, nodeB.aabb)) return;
  if (nodeA.isLeaf && nodeB.isLeaf) {
    if (nodeA !== nodeB) pairs.push([nodeA.object, nodeB.object]);
    return;
  }
  if (!nodeB.isLeaf || (nodeA.isLeaf)) {
    selfQuery(nodeA, nodeB.left, pairs);
    selfQuery(nodeA, nodeB.right, pairs);
  } else {
    selfQuery(nodeA.left, nodeB, pairs);
    selfQuery(nodeA.right, nodeB, pairs);
  }
}
selfQuery(bvh.root, bvh.root, pairs);
```
Cost: O(N log N + K) where K is the number of output pairs.

Real-world: Every AAA game physics engine (Bullet, Box2D, Havok, PhysX) uses a BVH or closely related structure (DBVT = Dynamic AABB BVH Tree) as the broad phase. Bullet's DBVT is publicly available and has been studied extensively. Box2D v3 uses an incremental BVH with fat AABBs, achieving excellent performance for game-scale scenes.

---

## The Fix

Complete dynamic BVH implementation:

```javascript
class BVHNode {
  constructor() {
    this.aabb = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    this.left = null; this.right = null;
    this.object = null;  // non-null for leaves
    this.parent = null;
    this.height = 0;
  }
  get isLeaf() { return this.object !== null; }
}

class DynamicBVH {
  constructor() { this.root = null; this.nodes = new Map(); }

  insert(obj) {
    const leaf = new BVHNode();
    leaf.aabb = fatAABB(obj.aabb, FAT_RADIUS);  // expand AABB
    leaf.object = obj;
    this.nodes.set(obj.id, leaf);
    if (!this.root) { this.root = leaf; return; }

    // Find best sibling using greedy SAH traversal
    let best = this.root;
    let bestCost = Infinity;
    const stack = [this.root];
    while (stack.length) {
      const node = stack.pop();
      const cost = saInsertionCost(leaf.aabb, node, this.root);
      if (cost < bestCost) { bestCost = cost; best = node; }
      if (!node.isLeaf) { stack.push(node.left, node.right); }
    }

    // Create new parent to hold old best sibling + new leaf
    const parent = new BVHNode();
    const oldParent = best.parent;
    parent.aabb = union(best.aabb, leaf.aabb);
    parent.parent = oldParent;
    parent.left = best; parent.right = leaf;
    best.parent = parent; leaf.parent = parent;
    if (oldParent) {
      if (oldParent.left === best) oldParent.left = parent;
      else oldParent.right = parent;
    } else {
      this.root = parent;
    }
    // Refit ancestors
    let cur = parent.parent;
    while (cur) {
      cur.aabb = union(cur.left.aabb, cur.right.aabb);
      cur.height = 1 + Math.max(cur.left.height, cur.right.height);
      cur = cur.parent;
    }
  }

  updateAll(objects) {
    for (const obj of objects) {
      const leaf = this.nodes.get(obj.id);
      if (!aabbContains(leaf.aabb, obj.aabb)) {
        // Object moved outside its fat AABB — reinsert
        this.remove(obj.id);
        this.insert(obj);
      }
    }
  }

  query(queryAABB) {
    const results = [];
    const stack = [this.root];
    while (stack.length) {
      const node = stack.pop();
      if (!node || !aabbOverlap(node.aabb, queryAABB)) continue;
      if (node.isLeaf) results.push(node.object);
      else { stack.push(node.left, node.right); }
    }
    return results;
  }
}
```

Performance with N=1,000: broad-phase takes 0.8ms instead of 62ms. N=10,000: 9ms instead of 6.2 seconds. The FPS counter climbs back to 60.

---

## The Wow Moment — Push It

**N=10,000 objects at 60fps:** A chaotic cloud of 10,000 bouncing circles. Every collision pair detected correctly. The BVH tree is visualized as an overlay: nested colored rectangles showing the hierarchy, with active query paths highlighted in bright yellow as each object queries its neighborhood. The tree reorganizes itself as objects move.

**BVH visualizer:** Toggle tree view — show the nested AABB rectangles colored by tree depth (shallow = large blue, deep = small red). Watch how the tree adapts as objects cluster and disperse. The logical elegance of the hierarchy becomes visually clear.

**Worst-case vs. BVH:** Show a sorted column of objects all aligned vertically (worst case for many spatial structures) — BVH handles it gracefully. Then show random distribution, then clustered clumps. Performance is consistent across all cases.

**Tree quality meter:** Live display of total tree cost / optimal cost. Watch it degrade as objects move (cost ratio climbs from 1.0 to 1.5 over 60 seconds), then trigger a manual rebuild (cost ratio snaps back to 1.0). Explain the rebuild heuristic.

---

## The Interactive Demo

**Object count slider:** 10–10,000 (watch frame time in the profiler overlay).
**Fat AABB radius slider:** 0–50 pixels (controls how often objects are reinserted).
**Show tree visualization toggle:** nested colored AABB rectangles.
**Show query path toggle:** yellow highlight for the BVH traversal during each query.
**Object velocity slider:** slow drift to rapid chaos (affects reinsertion frequency).
**Manual rebuild button:** force a full SAH rebuild; watch tree cost snap to optimal.
**Tree cost meter:** live ratio of current tree cost to optimal.
**Comparison mode:** half the screen runs BVH, half runs naive O(N²). FPS readout for each. The gap widens dramatically with N.
**Object shapes:** circles, rectangles, mixed (affects AABB tightness).

---

## Production Notes

**Code to show:** The `query()` method (10 lines) alongside the recursive structure of the tree. Animate the query traversal as a tree diagram — nodes turning yellow as they're visited, grey as they're pruned. The pruning is the key concept: show a subtree going grey (pruned) because its parent AABB didn't overlap the query.

**Key visual at 1:45:** The O(N²) curve vs O(N log N) curve on a graph. Mark N=1000, N=10000. The exponential vs logarithmic divergence is immediately alarming. This sets up the urgency of the problem.

**Key cinematic moment at 6:00:** 1,000 objects at 60fps with the BVH overlay visible. Each frame, the yellow query paths dance across the tree. It's visually mesmerizing — proof that the system is doing intelligent work rather than brute force.

**Key moment at 8:30:** Live comparison: BVH panel vs naive panel. Drag N slider up to 5,000. The naive side freezes. The BVH side keeps running. Let this moment breathe — don't cut away for 5 seconds. The freezing of the naive side is the emotional payoff.

---

## Tags

`BVH` `collision-detection` `AABB` `broad-phase` `spatial-acceleration` `tree` `canvas` `physics-engine`

---

## Thumbnail

**Dark background. Left half:** 1,000 bouncing circles in total chaos — some overlapping, some colliding, all moving. The collision-check counter reads "499,500 checks/frame" in red. FPS: "2". **Right half:** Same 1,000 circles, but overlaid with a beautiful nested AABB tree visualization — gold/teal rectangles nested fractally. FPS: "60". Counter: "847 checks/frame" in green. Bold white title: "O(N²) vs O(N log N)" at top. Subtitle: "1,000 OBJECTS — THE DIFFERENCE IS EVERYTHING". The visual split is dramatic: chaos-and-slowness on the left, structured-and-fast on the right.
