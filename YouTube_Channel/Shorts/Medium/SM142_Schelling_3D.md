---
title: "Schelling Model in 3D — Emergent Neighborhoods"
id: SM142
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, agent-based-model, schelling, segregation, social-physics, phase-transition]
---

> **What it is:** A ~45-second simulation short where a 3D cube of randomly mixed half-red, half-blue agents with only mild tolerance preferences (30%) spontaneously stratifies into large solid-coloured neighbourhoods, demonstrating how the Schelling segregation model amplifies microscopic preference into macroscopic segregation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Schelling Model in 3D — Emergent Neighborhoods

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 3D cube of agents — half red, half blue — randomly mixed. Each agent only moves if fewer than 30% of its neighbours share its colour. Within seconds, the random mixing stratifies into large, solid-coloured neighbourhoods: near-perfect segregation from mild tolerance preferences.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Schelling (1969) model: agents on a lattice. Each agent has a preference threshold T (e.g., T=30%). If the fraction of same-type neighbours < T, the agent is "unhappy" and moves to a random vacancy. Repeat until all agents happy. Caption: "T=30%: agents want ≥30% same-type neighbours — mild preference." Original model: 2D, checkerboard grid.

**0:10–0:18** — 3D extension: on a 3D cubic lattice (L×L×L), agents have 26 nearest neighbours. Even lower threshold (T=20%) can trigger segregation. Caption: "3D: 26 neighbours — lower threshold needed for segregation." Show the 3D cube rotating, revealing interior structure. Interior shows large connected regions of same colour.

**0:18–0:27** — Phase transition: the degree of segregation (measured by average fraction of same-type neighbours) shows a sharp transition as T increases from 0 to 1. Low T: integrated. T ≈ 0.3: transition to segregated. High T: strong segregation. Caption: "Phase transition at T ≈ 0.3 — mild preference → strong segregation." Show segregation vs T curve.

**0:27–0:36** — The paradox: final segregation far exceeds individual preference. Agents who only wanted 30% same-type neighbours end up in neighbourhoods that are 85% same-type. The emergent macroscopic segregation is much stronger than the microscopic preference — a key insight of Schelling (Nobel Prize 2005). Caption: "T=30% → 85% same-type neighbours — preference amplified." Schelling Nobel Prize 2005.

**0:36–0:45** — Generalisation: continuous opinions, multi-type agents, heterogeneous thresholds. With 3 types (red, green, blue): complex mosaic patterns. With heterogeneous T: the most intolerant agents drive the segregation. Caption: "Heterogeneous T: intolerant minority drives segregation." Bold text: "Schelling 3D — mild preference, extreme segregation." Fade to black.

## Physics Concept Teased
Schelling segregation in 3D: agents with weak preference for same-type neighbours (threshold T≈30%) spontaneously segregate into macroscopic same-type regions. The emergent segregation far exceeds individual preference — a classic example of micro-macro amplification. The model has a phase transition as T increases, and is related to the ferromagnetic Ising model.

## On-Screen Text / Captions
- **0:00** — "30% preference → 85% segregation — amplified."
- **0:05** — "Schelling model: move if < T same-type neighbours"
- **0:12** — "3D: 26 neighbours, lower threshold triggers transition"
- **0:20** — "Phase transition: T ≈ 0.3 — mild → strong segregation"
- **0:28** — "Schelling Nobel 2005: preference amplified by dynamics"
- **0:35** — "Intolerant minority drives macroscopic segregation"
- **0:43** — "Schelling 3D — mild preference, extreme outcome."

## End Card
Final 3 seconds: the 3D cube rendered in solid colour blocks — large red and blue regions. Translucent so interior structure is visible. Text: "The Schelling model was originally demonstrated with coins on a checkerboard — the first agent-based social model." CodedLaws logo.

## Audio
Gentle crowd noise. Voiceover at 0:00: "Agents who only want 30% same-type neighbours end up in 85% same-type neighborhoods — mild preference is amplified into strong segregation by the dynamics." No other voiceover.

## Production Notes
Code complexity: low-moderate. Renderer: three.js (3D WebGL). Key algorithm: Schelling model on L=20 cubic lattice. Initialize: 40% red, 40% blue, 20% vacant. Each step: pick random unhappy agent; move to random vacancy. Unhappy = fraction same-type neighbours < T. 26-neighbour Moore neighbourhood. Measure segregation: mean same-type fraction across all agents. Run for 10,000 sweeps. Visualisation: 3D cube of coloured spheres. Use three.js instanced mesh for performance. Rotate camera. Runtime: three.js WebGL, real-time for L=20.
