---
title: "Termite Mound Construction Algorithm"
id: SM077
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, swarm-intelligence, termites, stigmergy, emergence, construction]
---

> **What it is:** A ~45-second simulation short where termites following simple pick-up-and-deposit rules spontaneously build distinct pillars and arched chambers from scattered dirt pellets, demonstrating stigmergy — the use of pheromone-marked environment as shared memory — and how small random fluctuations are amplified into large-scale organised architecture. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Termite Mound Construction Algorithm

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas with scattered white dirt particles and dozens of small green termite icons moving randomly. At 2 seconds the particles begin to cluster — not because termites coordinate, but because of stigmergy. By 3 seconds distinct pillars are forming, growing upward.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Termite Mound model (Bruinsma 1979 / Deneubourg 1977): each termite picks up a dirt pellet if it finds one while not already carrying one. It drops the pellet preferentially where it smells existing pellets (high pheromone = existing structure). Caption: "Pick up → carry → deposit where pheromone is high. Repeat."

**0:10–0:18** — Stigmergy: the environment itself carries information. Existing structures attract more building. Small random clusters of 2-3 pellets release enough pheromone to attract a 4th → a 5th → a column grows. Caption: "Stigmergy: environment = shared memory."

**0:18–0:27** — Column formation: 4–5 distinct columns emerge from initially random pellet positions. Each column grows vertically until it reaches neighbouring columns and arches form. Caption: "Arches: when columns nearly touch, material bridges the gap." The mound's internal ventilation architecture emerges.

**0:27–0:36** — Temperature regulation: African termite mounds maintain 30°C inside while external temperature swings 20–40°C. Shown: a cross-section of the mound with airflow channels. Hot internal air rises, cools in the surface channels, falls in the central shaft. Caption: "Termite mound: a passive HVAC system."

**0:36–0:45** — Comparison: termite mound cross-section vs. human-designed building ventilation — nearly identical airflow principle. Caption: "Eastgate Centre, Harare — architected on termite mound airflow." Bold text: "Termite mound — emergent architecture without architects." Fade to black.

## Physics Concept Teased
Termite mound construction via stigmergy: termites don't communicate directly. Instead, building decisions are made by sensing and responding to the environment (pheromone field on existing structures). Small random fluctuations (first pellets) are amplified by positive feedback into large-scale organised structures — pillars, arches, chambers.

## On-Screen Text / Captions
- **0:00** — "No architect. No blueprint. Complex structure."
- **0:05** — "Pick up → carry → deposit at high-pheromone sites"
- **0:12** — "Stigmergy: environment carries the plan"
- **0:20** — "Columns → arches → chambers"
- **0:28** — "Termite mound: passive HVAC — 30°C all day"
- **0:35** — "Eastgate Centre: built on termite physics"
- **0:43** — "Stigmergy — swarm intelligence without intelligence."

## End Card
Final 3 seconds: the fully formed termite mound structure — columns and arches — on black background. Text: "African termite mounds reach 9 metres — taller than a giraffe — with no architect." CodedLaws logo.

## Audio
Tropical ambient (insect sounds, heat). Soft construction sounds — pattering of pellets being placed. Voiceover at 0:00: "Termites build metre-tall climate-controlled mounds — without a plan, just by following the smell of what's already been built." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: termite mound model. 2D grid: cells are empty or contain a pellet pile. Pheromone field: each pellet-pile cell evaporates pheromone. Each termite: state = {searching, carrying}. Searching: random walk, if on cell with pellet and probability P_pick = k_{-}/(k_{-} + F), pick up pellet (F = local pellet density). Carrying: random walk, if on cell probability P_drop = (k_{+}·F/(k_{+} + F))², drop pellet. Pheromone diffusion: Gaussian blur. N=100 termites, 100×100 grid. Pillar formation visible after 1000 steps. Runtime: real-time Canvas 2D.
