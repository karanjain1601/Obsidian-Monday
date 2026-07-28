---
title: "I Let Evolution Design a Walking Robot. The Results Were Alien."
season: 5
episode: 47
difficulty: 8/10
concept: "Genetic algorithms, fitness landscape, and premature convergence"
prereq: "E45 (RL as adjacent optimization) + E29 (rigid body engine)"
tags: [evolutionary-simulation, genetic-algorithm, Karl-Sims, virtual-creatures, rigid-body, javascript, physics-evolution, artificial-life, morphological-evolution]
type: playlist-video
---

## S5·E47 — "I Let Evolution Design a Walking Robot. The Results Were Alien."

- **Alt title:** "Karl Sims Revisited: Evolving Creatures in Your Own Physics Engine"
- **Difficulty:** 8/10 · **Prereq:** E45 (RL as adjacent optimization) + E29 (rigid body engine)
- **Hook:** A population of randomly morphed rigid-body creatures evaluated purely on walking speed. Over 500 generations, the winning designs look like nothing in nature — multi-limbed alien forms that exploit physics loopholes no human designer would try.
- **The break (bug):** Without maintaining genetic diversity (a diverse initial population + mutation that preserves morphological variety), the genetic algorithm converges prematurely. All individuals become slight variants of whatever first-generation lucky individual happened to fall forward effectively — a local optimum of "plank that falls forward." Never discovers the good local optima (oscillating limbs, rotating appendages) that are objectively better.
- **Concept introduced:** Genetic algorithms — a population of candidate solutions, evaluated by a fitness function, with selection, crossover (recombination), and mutation. Fitness landscape — the function that maps genotype (genome) to phenotype (fitness). Premature convergence — the GA getting stuck in local optima due to insufficient genetic diversity.
- **Push it / wow moment:** Evolve separately for three environments: walking on flat ground, swimming in SPH fluid, jumping on a trampoline. Watch the winning morphologies change completely — flat bodies for swimming, springy legs for jumping, rolling masses for walking. The same evolutionary loop produces completely different solutions.
- **Demo:** Watch evolution live (all creatures simulated simultaneously in small panels). Click any creature to inspect its genome (joint angles, limb lengths, masses). Adjust mutation rate. Export the best creature as a GIF or a standalone simulation.
- **Tags:** `evolutionary-simulation` `genetic-algorithm` `Karl-Sims` `virtual-creatures` `rigid-body` `javascript` `physics-evolution` `artificial-life` `morphological-evolution`
- **Thumbnail:** An alien-looking multi-limbed creature mid-gallop. "EVOLUTION FOUND THIS IN 500 GENERATIONS."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
