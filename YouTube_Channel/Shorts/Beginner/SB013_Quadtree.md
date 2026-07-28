---
title: "The Quadtree in Motion"
id: SB013
type: youtube-short
duration: "~45 seconds"
feeds_video: "How to Simulate a Galaxy Without Waiting a Million Years"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short showing a galaxy simulation at 60 FPS with a dynamic grid overlaid — tiny cells subdividing in the dense core, enormous cells covering empty space — then toggling the quadtree off drops to 3 FPS instantly, revealing how grouping distant stars as single mass points achieves a 20x speedup with nearly correct physics. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** How to Simulate a Galaxy Without Waiting a Million Years

# Short: The Quadtree in Motion

**Feeds full video:** How to Simulate a Galaxy Without Waiting a Million Years
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A galaxy simulation running at 60 FPS. Overlaid on the stars: a dynamic grid of squares — some tiny, some enormous — subdividing and merging in real time with the particle motion.

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** Camera zooms to the dense galactic core. Quadtree cells here: extremely tiny, subdividing rapidly. Each cell contains 1–3 stars. "DENSE REGION: FINE GRID."
**Beat 2 (0:10–0:18):** Camera pulls to the galactic arm. Cells here: larger, fewer subdivisions. Each cell groups many distant stars into one effective gravitational source.
**Beat 3 (0:18–0:26):** Camera pulls to empty intergalactic space. Cells here: enormous — one cell covers a quarter of the screen. "EMPTY SPACE: GIANT CELLS."
**Beat 4 (0:26–0:33):** Two stars pass near each other — their cells subdivide instantly, shrink to minimum size for the encounter, then expand again as they separate. Real-time adaptive precision.
**Beat 5 (0:33–0:38):** FPS counter: 60. "WITHOUT THIS: 3 FPS." Toggle quadtree OFF: simulation crawls. Back ON: 60 FPS returns instantly.
**Beat 6 (0:38–0:45):** Quadtree overlay removed. Galaxy runs, beautiful. "IT CHEATS. BUT THE PHYSICS STILL WORKS. HOW?"

## Physics Concept Teased
How can a tree structure that groups distant stars and approximates them as single mass points produce nearly-correct physics at 1000× the speed of brute-force pair-wise interaction?

## On-Screen Text / Captions
- "DENSE REGION: FINE GRID." / "EMPTY SPACE: GIANT CELLS." (zone labels)
- Cell star-count shown in each cell
- FPS counter: "60 FPS" (persistent)
- "WITHOUT THIS: 3 FPS" (Beat 5, dramatic)
- "IT CHEATS. BUT THE PHYSICS STILL WORKS. HOW?" (final)

## End Card
Full video: "How to Simulate a Galaxy Without Waiting a Million Years" — link in bio. The Barnes-Hut algorithm explained.

## Audio
Calm, technically precise ambient synth — almost mechanical. Subtle rhythmic click as quadtree cells subdivide. FPS toggle: grinding crawl when OFF, smooth hum when back ON.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. Quadtree overlay: thin white lines, slight transparency. Cell colors shift with density — denser cells slightly warmer tint. Stars: white-blue dots with subtle glow. Contrast between tiny dense cells and enormous sparse cells should be visually dramatic — at least 100× size difference visible on screen. FPS counter always visible.
