---
title: "Connectome Simulation: C. elegans 302 Neurons"
id: SA117
type: youtube-short
duration: "~45 seconds"
feeds_video: "Simulating C. elegans: The World's First Complete Connectome"
difficulty: advanced
tags: [physics, simulation, short, advanced, connectome, c-elegans, neuroscience, network, neural-simulation]
---

> **What it is:** A ~45-second simulation showing all 302 C. elegans neurons simulated with biophysical synaptic dynamics from the complete connectome map, reproducing the locomotor central pattern generator's undulatory wave. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Simulating C. elegans: The World's First Complete Connectome

# Short: Connectome Simulation — C. elegans 302 Neurons

**Feeds full video:** Simulating C. elegans: The World's First Complete Connectome

## Visual Hook (First 3 Seconds)
A transparent 1 mm worm (C. elegans) on black. Inside, 302 glowing nodes (cyan) connected by 7,000 white synaptic lines. One node flashes (touch receptor). A cascade propagates through the network. The worm body curves — it's swimming away. Text: **"302 neurons. Complete. Simulated."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Worm anatomy overlay: 302 neurons color-coded by type: sensory (yellow, 60 neurons), interneurons (cyan, 118 neurons), motor neurons (orange, 96 neurons), pharyngeal (green, 20 neurons), polymodal (white, 8 neurons). Synaptic wiring: 6393 chemical synapses (white) + 890 gap junctions (pink).
- **0:10** — Touch stimulus: ASH sensory neuron pair (yellow, nose tip) activated. Membrane potential depolarizes from **"−60 mV → +20 mV"** in 5 ms. Signal propagates via AVA/AVD command interneurons (cyan, mid-body). Backward motor neurons (orange) fire.
- **0:18** — Motor neuron activation: VA/VB ventral motor neurons (orange) fire in sequence, head-to-tail. Body wall muscle cells contract in traveling wave — worm performs backward locomotion at 250 µm/s. Muscle activation shown as contracting segments (red flashes along body).
- **0:27** — Network graph layout (force-directed, right panel): 302 nodes, 6393 edges. Hub nodes identified: AVA (interneuron, 189 connections, largest cyan node), AVB (188), PVC (174). Clustering coefficient: **"C = 0.32"** displayed. Small-world index: **"σ = 4.1"**.
- **0:36** — Rhythm generation: AVB-B motor neuron circuit forms a central pattern generator for forward locomotion. Oscillation shown: AVB fires at 1 Hz, motor neurons follow in peristaltic sequence. Forward locomotion at 300 µm/s generated without sensory input.
- **0:44** — Comparison: random network (same N=302, same edges) shown in grey — no locomotion, no coherent firing. Real connectome (cyan) — coordinated behavior emerges. Label: **"Structure determines function — exactly."**

## Physics Concept Teased
The C. elegans connectome, fully mapped in 1986, enables biophysical simulation: 302 neurons with individual LIF dynamics and the actual 7283-synapse wiring diagram produce authentic motor behaviors including forward/backward locomotion and escape responses — the first complete brain simulation of any organism.

## On-Screen Text / Captions
- **0:00** — "302 neurons. Every connection mapped. Simulated."
- **0:10** — "Touch the nose: ASH fires, AVA forwards the signal"
- **0:20** — "Motor neurons fire in sequence: the worm swims backward"
- **0:30** — "Hub interneurons: one node, 189 connections"
- **0:38** — "Central pattern generator: locomotion without sensors"
- **0:45** — "Full connectome simulation → link in bio"

## End Card
Final 3 seconds: worm body with neural activity overlay (glowing nodes + edges). **"CodedLaws — Connectomics"** text.

## Audio
Sparse electronic neural pulse sounds (clicks at 1 Hz for CPG rhythm). 72 BPM ambient. Swimming "whoosh" when locomotion begins.

## Production Notes
Renderer: LIF network on actual WormBase connectome (Python/Brian2). Connectome data: OpenWorm project (c302 framework). Synapse model: α-function conductance, τ_rise = 0.1 ms, τ_decay = 2 ms. Electrical synapses: resistive coupling g_gap = 0.05 µS. Muscle activation: linear transform of VD/DD motor neuron activity. Body kinematics: Cosserat rod model. Output 1080×1920, 60 fps.
