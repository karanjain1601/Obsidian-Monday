---
title: "How to Simulate a Galaxy Without Waiting a Million Years"
season: 2
episode: 13
difficulty: 6/10
concept: "Barnes-Hut quadtree O(N log N) approximation"
prereq: "E12 (why you need it — all-pairs is too slow)"
tags: [Barnes-Hut, quadtree, N-body-optimization, O(n-log-n), galaxy-simulation, javascript, spatial-data-structures, computational-physics]
type: playlist-video
---

## S2·E13 — "How to Simulate a Galaxy Without Waiting a Million Years"

- **Alt title:** "The Clever Tree That Makes N-Body Simulations 1000× Faster"
- **Difficulty:** 6/10 · **Prereq:** E12 (why you need it — all-pairs is too slow)
- **Hook:** 10,000 particles crawling at 0.5 FPS with naive all-pairs gravity. Flip a switch — Barnes–Hut tree — and it runs at 60 FPS with nearly identical visual output.
- **The break (bug):** All-pairs N-body requires N² force evaluations per frame. At N=10,000, that's 100 million evaluations per frame — intractable in real-time. Every new particle *doubles* the compute time relative to the previous one. The simulation simply cannot scale to anything resembling a real galaxy (10¹¹ stars) with this approach.
- **Concept introduced:** Barnes–Hut quadtree (2D) / octree (3D) approximation. The insight: for a distant cluster of stars, you don't need the force from every individual star — you can approximate the entire cluster as a single "super-particle" at its center of mass. The opening angle θ (typically 0.5–1.0) controls the trade-off: small θ means more accurate (more particles treated individually), large θ means faster (more clusters treated as super-particles). Complexity drops from O(N²) to O(N log N).
- **Push it / wow moment:** 100,000 particles in real-time. Overlay the live quadtree decomposition as glowing grid lines on top of the galaxy — cells visible being subdivided around dense regions and merged in empty space. The viewer sees the algorithm's spatial reasoning as it works.
- **Demo:** Particle count slider up to 100,000. Opening angle θ slider — see quality degrade and FPS rise as θ increases. Toggle quadtree vs. brute force. Live cell count display.
- **Tags:** `Barnes-Hut` `quadtree` `N-body-optimization` `O(n-log-n)` `galaxy-simulation` `javascript` `spatial-data-structures` `computational-physics`
- **Thumbnail:** Quadtree grid cells visible over a glowing galaxy. "1000× FASTER" in bold white text.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
