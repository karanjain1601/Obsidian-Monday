---
title: "Voronoi Diagram from Random Seeds"
id: SM018
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, computational-geometry, voronoi, pattern-formation]
---

> **What it is:** A ~45-second simulation showing randomly placed seed points expanding like bubbles and halting where they meet, partitioning the canvas into a stained-glass mosaic of Voronoi cells — demonstrating nearest-neighbour spatial partitioning and its dual Delaunay triangulation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Voronoi Diagram from Random Seeds

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas. 50 coloured dots appear randomly placed. In 2 seconds each dot expands like a growing bubble — but where two bubbles meet they stop dead, creating sharp boundary lines. By 3 seconds the canvas is a perfectly partitioned stained-glass mosaic of coloured cells.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The expanding-bubbles visual shows each Voronoi cell — the region closer to that seed than any other seed. Labels: "Each point owns the nearest region." One cell highlighted; arrows from it to each boundary showing equal distance to the two nearest seeds.

**0:10–0:18** — Delaunay triangulation dual shown: connecting all seeds whose Voronoi cells share a boundary. Gold lines form a triangulation that fills the canvas. Caption: "Delaunay triangulation — the dual graph." Circumcircle of one Delaunay triangle shown: it passes through exactly 3 seeds and contains no others.

**0:18–0:27** — Interactive demo: a new seed dropped in. The Voronoi diagram updates in real time — some cells shrink, one large cell splits. Annotation: "Incremental insertion — O(log N) per point."

**0:27–0:36** — Applications montage: same Voronoi diagram overlaid with (1) a satellite map — watershed basins, (2) a city map — service area of nearest hospital, (3) a crystal grain boundary photo — polycrystalline material microstructure. Caption: "Same math. Different context."

**0:36–0:45** — Fortune's algorithm sweep-line animation: a vertical red line sweeps left to right. Parabolic arcs appear in front of the sweep line (parabolas centred on each seed). Where two parabolas meet, a Voronoi edge is traced. Caption: "Fortune's algorithm — O(N log N)." Fade to black.

## Physics Concept Teased
Voronoi diagram: partition a plane into cells where each cell contains all points nearest to one seed. The dual graph is the Delaunay triangulation. Voronoi diagrams appear in crystal grain structures, cell territories in biology, drainage basins, and nearest-neighbour queries in spatial data.

## On-Screen Text / Captions
- **0:00** — "50 random points."
- **0:03** — "Each point owns the region nearest to it."
- **0:12** — "Delaunay triangulation — the dual"
- **0:20** — "Add a point → diagram updates instantly"
- **0:28** — "Watersheds, hospitals, crystal grains — Voronoi everywhere"
- **0:38** — "Fortune's sweep-line: O(N log N)"
- **0:44** — "Voronoi diagram."

## End Card
Final 3 seconds: Voronoi diagram with pastel colours, gently animated (seeds slowly drifting). Text: "Dragging seeds creates a Lloyd's algorithm relaxation — seeds move to centroids." CodedLaws logo.

## Audio
Minimalist glass-harmonic ambient (70 BPM). Soft chime when each boundary appears. Voiceover at 0:00: "Drop points on a plane — each one claims the territory closest to it." Pop sound for each new seed insertion (~0:20).

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Fortune's sweep-line algorithm for O(N log N) Voronoi construction, or use a jump-flooding algorithm on GPU (O(log N) passes on GPU). For real-time draggable seeds use a WebGL jump-flood approach: each pixel races to find the nearest seed, colours assigned by seed ID. Gotcha: Fortune's algorithm is notoriously tricky to implement — use a robust library (d3-delaunay) and focus on the beautiful visualisation. Runtime: real-time with d3-delaunay or WebGL jump-flood.
