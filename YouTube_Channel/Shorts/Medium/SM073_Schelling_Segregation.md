---
title: "Schelling Segregation — Emergent Clustering"
id: SM073
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, agent-based-model, schelling-segregation, emergence, social-dynamics]
---

> **What it is:** A ~45-second simulation short where a randomly mixed population of blue and orange agents with only a 30% same-colour neighbour tolerance spontaneously self-segregates into large monochromatic neighbourhoods, demonstrating Schelling's model that mild individual preferences produce strong emergent collective segregation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Schelling Segregation — Emergent Clustering

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A checkerboard of blue and orange dots — perfectly mixed, random arrangement. Text: "Tolerance threshold: 30% same-colour neighbours needed." At 2 seconds the dots start moving — slowly at first, then accelerating. By 3 seconds distinct blue and orange neighbourhoods have formed, large and clearly separated.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Schelling model rules: each agent (dot) is satisfied if at least fraction T of its neighbours share its colour. Dissatisfied agents move to a random empty cell. Rule applied simultaneously to all dissatisfied agents each step. Caption: "T = 30%: satisfied if 3 out of 8 neighbours agree."

**0:10–0:18** — The surprise: with T = 30%, agents are willing to live in a majority-other neighbourhood. Yet the emergent pattern is almost complete segregation — with T=30%, the final segregation index ≈ 0.7 (random mixing = 0.5, perfect segregation = 1.0). Caption: "T=30% → 70% segregation. Individual tolerance ≠ collective outcome."

**0:18–0:27** — Threshold sweep: T from 10% to 50%. At T=10%: very little segregation (almost random). At T=30%: moderate segregation. At T=50%: strong segregation — large monochromatic neighbourhoods. Caption: "Higher tolerance threshold → more segregation."

**0:27–0:36** — Cluster size evolution: the average neighbourhood size grows over time (coarsening). Smaller clusters merge into larger ones — similar to Ostwald ripening. Plot: average cluster size vs time — power law growth. Caption: "Coarsening: clusters grow by merging."

**0:36–0:45** — Policy implications: the model shows that small individual preferences can produce large collective patterns. Caption: "Micro-motive → macro-behaviour." Even colour-blind relocation rules (agents move if unhappy for any reason) can produce segregation. Bold text: "Schelling segregation — emergence from mild preferences." Fade to black.

## Physics Concept Teased
Schelling's model: agents with mild tolerance thresholds (willing to be a minority in their neighbourhood) produce strong segregation at the population level through a nonlinear cascade. The result — near-complete segregation — is an emergent property not intended by any agent. Thomas Schelling won the 2005 Nobel Prize in Economics partly for this work.

## On-Screen Text / Captions
- **0:00** — "Tolerance threshold: 30% same-colour neighbours."
- **0:05** — "Dissatisfied agents move to random empty cells"
- **0:12** — "T=30% → 70% segregation index"
- **0:20** — "Higher threshold → stronger segregation"
- **0:28** — "Cluster coarsening: small merges into large"
- **0:35** — "Micro-motive → Macro-behaviour"
- **0:43** — "Schelling (Nobel 2005) — mild preferences, strong patterns."

## End Card
Final 3 seconds: the fully segregated blue-orange neighbourhood map. Text: "Thomas Schelling, 1971 — described this with coins on a checkerboard before computers." CodedLaws logo.

## Audio
Neutral, sociological ambient (80 BPM). Soft "click" each time an agent moves. Voiceover at 0:00: "No agent wants segregation — but a 30% tolerance threshold is all it takes for complete neighbourhood separation to emerge." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: Schelling model on a 50×50 grid. Grid: 30% empty cells, 35% blue, 35% orange. Each step: for each blue/orange agent, count same-colour neighbours (out of 8 Moore neighbours); if fraction < T, mark as dissatisfied. Then: move all dissatisfied agents simultaneously to random empty cells. Segregation index: average fraction of same-colour neighbours across all satisfied agents. Visualise: draw grid as coloured pixels. Runtime: real-time, trivially fast.
