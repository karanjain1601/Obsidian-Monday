---
title: "Self-Organised Criticality — Sandpile Avalanches"
id: SM012
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, complex-systems, self-organised-criticality, sandpile, avalanche]
---

> **What it is:** A ~45-second simulation showing grains dropped one by one onto a growing pile triggering occasional small flickers and rare massive cascading avalanches whose sizes follow a power law — demonstrating Bak-Tang-Wiesenfeld self-organised criticality. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Self-Organised Criticality — Sandpile Avalanches

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Aerial view of a sand pile growing grain by grain in the centre of a dark canvas. At 2.5 seconds a single grain tips the balance — an avalanche cascades outward in a branching flash of orange-yellow pixels, reaching the edge of the screen.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Abelian sandpile model (Bak-Tang-Wiesenfeld). A 200×200 grid. Grains added one per frame to the centre cell. Colour-map shows slope height: 0 = black, 1 = navy, 2 = teal, 3 = gold (threshold). When a cell reaches 4 grains it "topples," distributing 1 grain to each of 4 neighbours.

**0:10–0:18** — Small avalanches happen frequently (flicker of orange). Large avalanches happen rarely but when they do they span the whole grid. A running tally at the top-right: "Avalanche size." The counter jumps by small amounts constantly, then suddenly jumps by thousands.

**0:18–0:27** — Log-log plot of avalanche size distribution appears: P(s) ∝ s^(-1.5), a perfect power law. Annotation: "Power law — no characteristic size." The line is straight from size-1 events to size-10000 events.

**0:27–0:36** — The sandpile has settled into a beautifully symmetric fractal pattern — the identity element of the sandpile group. Concentric geometric rings of different colours extending from the centre. Annotation: "The sandpile self-organises to a critical state."

**0:36–0:45** — One more grain added. A moderate avalanche cascades. The system returns exactly to a critical slope — always poised on the edge. Text: "Critical slope maintained automatically." Fade to black.

## Physics Concept Teased
Self-organised criticality: the BTK sandpile drives itself to a critical state without tuning any parameter. At the critical state, avalanche sizes follow a power law — no characteristic scale. This appears in earthquakes (Gutenberg-Richter law), extinctions, neural avalanches, and stock market crashes.

## On-Screen Text / Captions
- **0:00** — "One grain at a time…"
- **0:05** — "Threshold = 4 → topple → cascade"
- **0:13** — "Large avalanches are rare but span everything"
- **0:20** — "P(s) ∝ s^(-1.5) — power law"
- **0:28** — "No characteristic avalanche size"
- **0:35** — "System self-organises to criticality"
- **0:43** — "Self-organised criticality — everywhere."

## End Card
Final 3 seconds: the fractal sandpile identity element — perfectly symmetric geometric rings. Text: "Same statistics: earthquakes, extinctions, neural activity." CodedLaws logo.

## Audio
Slow, meditative piano (50 BPM). Each grain addition = faint sand-grain click. Large avalanches = cascading whoosh sound proportional to avalanche size. Voiceover at 0:00: "Add grains one at a time and the pile tunes itself to a critical state — forever on the edge of collapse."

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Abelian sandpile (BTK model). Grid: 200×200, threshold = 4. Update rule: if h[i,j] ≥ 4: h[i,j] -= 4; h[i±1,j] += 1; h[i,j±1] += 1 (absorbing boundary). Run topple queue (BFS/DFS) until no more topplings. Track avalanche size = total topplings per grain addition. Log-log plot of avalanche distribution. Identity element of the sandpile group is computed by adding the all-3 configuration n times — yields beautiful fractal. Runtime: real-time Canvas 2D.
