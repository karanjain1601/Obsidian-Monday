---
title: "Epidemic on a Network — SIR with Heterogeneous Degree"
id: SM140
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, network-science, epidemic, SIR, heterogeneous-degree, herd-immunity, scale-free]
---

> **What it is:** A ~45-second simulation short where an SIR epidemic seeded at a single node blazes through a scale-free network via its highly-connected hubs while the identical infection dies out on a random Erdos-Renyi network with the same mean degree, showing how degree heterogeneity vanishes the epidemic threshold and how hub vaccination is exponentially more efficient. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Epidemic on a Network — SIR with Heterogeneous Degree

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A scale-free network, with large hubs visible. One node turns red (infected). The infection spreads — first along the highly-connected hubs, then quickly to the whole network. On an Erdos-Renyi network with the same mean degree, the same seed infects far fewer nodes. Network structure determines epidemic fate.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Network SIR model: S→I with rate β per SI edge; I→R with rate γ. Basic reproduction number R₀ = β·⟨k²⟩/(γ·⟨k⟩). For a homogeneous network: R₀ = β⟨k⟩/γ. But for a heterogeneous (scale-free) network, ⟨k²⟩ >> ⟨k⟩ — so R₀ is much larger. Caption: "R₀ = β⟨k²⟩/(γ⟨k⟩) — heterogeneity amplifies spread."

**0:10–0:18** — Scale-free epidemic threshold: for a power-law network with γ≤3 (like many real networks): ⟨k²⟩ → ∞ as N → ∞ → R₀ → ∞ regardless of β. The epidemic threshold vanishes — any infection spreads on a large scale-free network. Caption: "Scale-free (γ≤3): epidemic threshold → 0 — always spreads."

**0:18–0:27** — Herd immunity: on a homogeneous network, herd immunity requires fraction 1-1/R₀ immune. On a scale-free network, targeting the high-degree hubs for vaccination is far more efficient. Random vaccination vs hub vaccination compared. Caption: "Hub vaccination: far fewer doses needed — exploit network structure."

**0:27–0:36** — Simulation: SIR spreading on (1) ER graph and (2) BA scale-free graph, same N=1000 and same mean degree ⟨k⟩=4. Starting from one infected node. On ER: epidemic dies out. On BA: epidemic spreads to 60% of the network. Show side-by-side. Caption: "Same ⟨k⟩, different network — BA epidemic; ER none."

**0:36–0:45** — COVID-19 superspreaders: 80% of transmission in COVID-19 was driven by 10–20% of cases (SARS-CoV-1: 80/20 rule). Superspreaders are the hubs of the human social contact network. Caption: "Superspreaders: hubs of the social contact network." Bold text: "Epidemic on a network — the hub decides the outcome." Fade to black.

## Physics Concept Teased
SIR epidemic on a heterogeneous network: the basic reproduction number R₀ = β⟨k²⟩/(γ⟨k⟩) depends critically on the second moment of the degree distribution. For scale-free networks with γ≤3, ⟨k²⟩ diverges — the epidemic threshold vanishes and any epidemic spreads. Hubs act as superspreaders; targeted hub vaccination is exponentially more efficient than random vaccination.

## On-Screen Text / Captions
- **0:00** — "Network structure decides whether an epidemic spreads."
- **0:05** — "R₀ = β⟨k²⟩/(γ⟨k⟩) — heterogeneity amplifies"
- **0:12** — "Scale-free γ≤3: epidemic threshold = 0 — always spreads"
- **0:20** — "Hub vaccination: far fewer doses for herd immunity"
- **0:28** — "BA vs ER (same ⟨k⟩): BA spreads, ER dies out"
- **0:35** — "COVID superspreaders: hubs of social contact network"
- **0:43** — "Epidemic on a network — the hub decides."

## End Card
Final 3 seconds: side-by-side ER vs BA final states (ER: 5% infected, BA: 60% infected). Text: "On a scale-free network, vaccinating the top 5% highest-degree nodes can cut an epidemic's reach by 90%." CodedLaws logo.

## Audio
Spreading "buzz" sound as infection propagates. Voiceover at 0:00: "The same epidemic spreads very differently on a scale-free network versus a random one — because the hubs act as turbochargers for transmission." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (force-directed graph). Key algorithm: network SIR on pre-generated ER and BA graphs. At each time step: for each SI edge, infect S with probability β·dt. For each I node, recover with probability γ·dt. Track S(t), I(t), R(t). Compute R₀ = β·(⟨k²⟩/⟨k⟩)/γ analytically from degree sequence. For hub vaccination: sort nodes by degree descending, mark top f% as immune (R state). Compare final epidemic size with random vaccination (f% random nodes). Layout: spring-embedder, hub nodes larger radius. Colour: S=grey, I=red, R=blue. Runtime: real-time Canvas 2D for N=500.
