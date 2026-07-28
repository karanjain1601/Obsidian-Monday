---
title: "Neural Evolution: NEAT Topology Growth"
id: SA111
type: youtube-short
duration: "~45 seconds"
feeds_video: "NEAT: Evolving Neural Networks from Scratch"
difficulty: advanced
tags: [physics, simulation, short, advanced, neat, neuroevolution, topology, evolution, neural-network]
---

> **What it is:** A ~45-second simulation showing NEAT neuroevolution growing a neural network from a minimal topology by adding nodes and connections through speciation and historical markings to solve a locomotion control task. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** NEAT: Evolving Neural Networks from Scratch

# Short: Neural Evolution — NEAT Topology Growth

**Feeds full video:** NEAT: Evolving Neural Networks from Scratch

## Visual Hook (First 3 Seconds)
Black background. A tiny neural network: just 2 input nodes (cyan) and 1 output node (orange), one connection (white line). Text: **"Gen 0: 2 neurons, 1 synapse."** Over 3 seconds the network grows, bifurcates, sprouts hidden layers — organically, like a plant. **"Gen 200: 47 neurons."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — XOR problem setup: 2 inputs (x₁, x₂) displayed as binary values (0/1), 1 output (y). Truth table shown (4 rows: 0,0→0; 0,1→1; 1,0→1; 1,1→0). Initial genome: minimal network with direct input-output connections only. Fitness = 4 − Σerror².
- **0:10** — Mutation types demonstrated: (1) add node: split existing connection, insert hidden node (yellow flash at midpoint); (2) add connection: new edge between non-adjacent nodes (green flash); (3) weight mutation: connection weight shifts ±0.5 (white pulse on connection).
- **0:18** — Speciation: population of 150 genomes clustered into 5 species (colored circles). Compatible genomes (δ < 3.0 by genome distance) stay in same species. Stagnant species (no fitness improvement for 15 gens) shown in grey, queued for elimination.
- **0:27** — Generation counter: 0 → 100 → 200. Network topology of best individual grows: Gen 0 = 3 nodes, 2 edges; Gen 50 = 8 nodes, 11 edges; Gen 100 = 14 nodes, 22 edges; Gen 200 = **"26 nodes, 38 edges"** shown. XOR fitness: **"0.21 → 0.98"**.
- **0:36** — Innovation numbers: historical markings visualized as color-coded genome string (each gene = colored rectangle). Crossover between two individuals shown: matching genes inherit randomly, disjoint/excess genes from fitter parent.
- **0:44** — Final solution network: drawn with force-directed layout. 4 hidden nodes, 12 connections. Input-output mapping shown: 4 XOR cases all produce correct output (checkmarks). Label: **"Evolved in 180 generations from nothing."**

## Physics Concept Teased
NEAT evolves both neural network weights and topology simultaneously by tracking innovation numbers — unique historical gene IDs — allowing meaningful crossover between differently structured networks and protecting new structural mutations via speciation until they have time to optimize.

## On-Screen Text / Captions
- **0:00** — "Evolution can grow a neural network from 2 nodes"
- **0:10** — "NEAT: mutate structure AND weights simultaneously"
- **0:20** — "Species protect new mutations from immediate competition"
- **0:30** — "26 nodes, 38 connections — all evolved by fitness"
- **0:38** — "XOR solved in 180 generations starting from nothing"
- **0:45** — "NEAT full walkthrough → link in bio"

## End Card
Final 3 seconds: network diagram of final 26-node solution, glowing connections. **"CodedLaws — Neuroevolution"** text.

## Audio
Evolving generative music that adds instruments each generation. 72 BPM base. Chime at each topology mutation.

## Production Notes
Renderer: NEAT-Python library with custom visualizer (NetworkX + matplotlib). Population: 150 genomes. Fitness function: 4 − Σ(target − output)². Speciation threshold: δ_t = 3.0. Excess/disjoint coefficient: c₁=c₂=1.0, weight coefficient c₃=0.4. XOR: 4 training cases, 300 epochs per evaluation. Output 1080×1920, 60 fps.
