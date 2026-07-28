---
title: "Coral Bleaching: Thermal Stress Simulation"
id: SA104
type: youtube-short
duration: "~45 seconds"
feeds_video: "Coral Bleaching: The Physics of a Reef Dying"
difficulty: advanced
tags: [physics, simulation, short, advanced, coral-bleaching, thermal-stress, reef, marine-biology, climate]
---

> **What it is:** A ~45-second simulation showing a coral reef under a marine heat wave thermal stress event with zooxanthellae expelled, the reef turning white, and recovery or mortality depending on the magnitude and duration of temperature anomaly. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Coral Bleaching: The Physics of a Reef Dying

# Short: Coral Bleaching — Thermal Stress Simulation

**Feeds full video:** Coral Bleaching: The Physics of a Reef Dying

## Visual Hook (First 3 Seconds)
A vivid Great Barrier Reef scene (coral polyps in neon orange, purple, green) rendered in 3D. The SST thermometer climbs: **"+1°C above seasonal max."** Over 3 seconds, the coral shifts from vibrant to stark white. The reef is ghost-silent.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Cellular-scale view (microscope aesthetic, dark blue background): coral polyp cell (translucent pink membrane) containing golden-brown zooxanthellae algae (10 per cell). Photosynthesis light reactions shown: green photons in, glucose + O₂ out.
- **0:10** — Thermal stress: SST anomaly = **"+1.5°C"** overlay. Chloroplast in zooxanthellae generates reactive oxygen species (ROS, red sparks). ROS bursts shown per zooxanthellae. Label: **"Photosystem II disrupted."**
- **0:18** — Expulsion: coral polyp cytoplasm ejects zooxanthellae through pore opening (white flash). Expelled algae drift away (fading brown dots). Coral cell now clear — white calcium carbonate skeleton visible. Zooxanthellae density drops: **"10 → 1 per cell"** counter.
- **0:27** — Degree Heating Week (DHW) metric: time plot of weekly SST anomaly accumulated. DHW dial (0–12 DHW). Labels: **"4 DHW = bleaching threshold"**, **"8 DHW = mortality risk"**. Dial sweeps from 0 to 6 DHW during the simulation.
- **0:36** — Reef-wide view: patch map (500 m × 500 m grid). Each patch colored: healthy = orange, 0–4 DHW; bleached = white, 4–8 DHW; dead = grey, >8 DHW. Time-lapse: bleaching spreads as SST plume (red false-color) moves across reef.
- **0:44** — Recovery vs. mortality panel: if SST returns to normal within 2 weeks (green arrow), zooxanthellae recolonize in 8 weeks (animation shows polyps regaining color). Beyond 3 weeks bleached: skeletal algae (green-brown) colonizes — **"dead reef, algae takeover."**

## Physics Concept Teased
Coral bleaching is driven by reactive oxygen species generated in zooxanthellae chloroplasts during thermal stress; when SST exceeds the seasonal maximum by as little as 1°C for 4 weeks (4 DHW), the coral expels its photosynthetic partner — a survival response that becomes fatal if the heat persists.

## On-Screen Text / Captions
- **0:00** — "1°C above normal for 4 weeks: the reef goes white"
- **0:10** — "Coral hosts algae for food — they're partners"
- **0:20** — "Heat damage sparks ROS — polyp ejects the algae"
- **0:30** — "4 Degree Heating Weeks = bleaching starts"
- **0:38** — "Beyond 8 DHW: the coral dies permanently"
- **0:45** — "Full bleaching simulation → link in bio"

## End Card
Final 3 seconds: before/after coral split — vivid orange left, white right. **"CodedLaws — Marine Physics"** text.

## Audio
Warm tropical ambient (gentle waves) → silence as bleaching progresses. Soft sonar ping each degree heating week tick. No voiceover.

## Production Notes
Renderer: agent-based coral reef model (Python). Zooxanthellae density ODE: dZ/dt = growth − expulsion·f(ROS). ROS production: proportional to (T − T_max)·PAR. DHW: accumulated weekly SST anomalies above +1°C. Reef patch model: 500×500 m, each cell = 1 coral colony. Recolonization rate: 0.1 cells/week under normal conditions. Output 1080×1920, 60 fps.
