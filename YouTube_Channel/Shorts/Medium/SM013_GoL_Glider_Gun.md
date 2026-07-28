---
title: "Conway's Game of Life — Glider Gun"
id: SM013
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, cellular-automaton, game-of-life, emergence, complexity]
---

> **What it is:** A ~45-second simulation showing a 36-cell Gosper Glider Gun firing an endless stream of 5-cell gliders that race across the canvas and annihilate upon collision — demonstrating how Conway's Game of Life's three simple rules produce Turing-complete complexity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Conway's Game of Life — Glider Gun

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas. A small cluster of white cells sits in the upper-left corner. At 2 seconds it fires — a compact 5-cell glider shoots diagonally across the screen, then another, then another. By 3 seconds the screen is filled with a stream of gliders racing toward the bottom-right.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Zoom in on the Gosper Glider Gun: 36-cell pattern. The gun itself oscillates with period 30. Each period it emits one glider (5 cells) that moves diagonally at c/4 (one cell per 4 generations). Counter in corner: "Glider #7… #8… #9…"

**0:10–0:18** — Zoom out: the expanding stream of gliders fills the canvas. When two gliders collide they annihilate into a still life. Annotation: "Collision → still life." Several collision products appear as grey 2×2 blocks.

**0:18–0:27** — Two glider guns facing each other: their streams collide head-on. The collision products build up into a growing wall of still-life blocks. Annotation: "Constructive interference of gliders."

**0:27–0:36** — Rule set shown: "B3/S23." Conway's rules written out: "Born if 3 neighbours live. Survive if 2 or 3 neighbours live. Otherwise die." Each rule flashes on screen as cells demonstrate it.

**0:36–0:45** — Camera zooms back to full view: a beautiful fractal-like spray of gliders, collisions, still lives, and oscillators — a complex ecosystem from 3 simple rules. Text: "Rule 110 is Turing-complete." (corrected: "B3/S23 is Turing-complete.") Fade to black.

## Physics Concept Teased
Conway's Game of Life: three simple rules on a 2D grid produce unbounded complexity — gliders, guns, logic gates, and even universal computation. The Gosper Glider Gun (discovered 1970) was the first infinite-growth pattern, proving GoL can compute anything.

## On-Screen Text / Captions
- **0:00** — "3 simple rules."
- **0:03** — "Gosper Glider Gun — period 30"
- **0:08** — "Each cycle fires one glider"
- **0:14** — "Collision → still life"
- **0:25** — "Head-on guns: growing wall of blocks"
- **0:30** — "B3/S23 — Born 3, Survive 2 or 3"
- **0:40** — "Turing-complete — from 3 rules."
- **0:44** — "Conway's Game of Life."

## End Card
Final 3 seconds: full-canvas ecosystem of gliders and collisions. Text: "John Conway, 1970 — proved emergence from simplicity." CodedLaws logo. "Can you build a logic gate? Drop it in the comments."

## Audio
Minimalist electronic (80 BPM). Each glider emission = soft metallic ping. Collision = short crunch sound. Voiceover at 0:00: "Three rules. No randomness. Infinite complexity." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: standard GoL update with typed arrays for speed; double-buffer (two Uint8Arrays). Gosper Gun cells hardcoded as starting state. Render each live cell as a 3×3 white pixel block on a black canvas (grid lines in dark grey). For large canvas (1000×1000) use WebGL or a chunk-based update with change tracking (Hashlife algorithm for very large boards). Runtime: real-time at 10–30 generations/second.
