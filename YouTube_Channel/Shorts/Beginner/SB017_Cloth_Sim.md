---
title: "The Cloth That Became a Jellyfish"
id: SB017
type: youtube-short
duration: "~45 seconds"
feeds_video: "I Simulated a Flag in the Wind"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a cloth simulation waves perfectly at 5 m/s wind but balloons into a pulsating jellyfish shape at 60 m/s before exploding — then the same cloth with half the timestep waves stably at the same wind speed — revealing how spring-mass systems go numerically unstable when forces outpace the integration step. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** I Simulated a Flag in the Wind

# Short: The Cloth That Became a Jellyfish

**Feeds full video:** I Simulated a Flag in the Wind
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A beautiful cloth simulation waving like a flag in a gentle breeze. Colors shift across its surface showing strain. It looks perfect. Wind speed shown: "WIND: 5 m/s."

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** Cloth waving naturally at 5 m/s. Realistic, satisfying ripples. "PERFECT CLOTH SIMULATION."
**Beat 2 (0:10–0:18):** Wind: "15 m/s." More vigorous. Some vertices oscillating faster. Amplitude growing but still coherent.
**Beat 3 (0:18–0:26):** Wind: "30 m/s." Chaotic whipping. Individual vertices visible as the spring system destabilizes. Mesh distorting in ways cloth cannot.
**Beat 4 (0:26–0:32):** Wind: "60 m/s." Cloth pulsing outward like a jellyfish, vertices flying. Growing without bound. "WAIT. WHAT IS HAPPENING."
**Beat 5 (0:32–0:38):** EXPLOSION. The cloth vertex network tears apart, springs snapping, mesh flying off in all directions in slow motion.
**Beat 6 (0:38–0:45):** Cut to the correctly-implemented cloth at high wind — stable, still waving. "SAME CLOTH. HALF THE TIMESTEP. STILL WAVING." Final: "THE JELLYFISH WAS A TIMESTEP PROBLEM."

## Physics Concept Teased
Why does increasing wind speed cause a spring-mass cloth simulation to go unstable and explode — and what does halving the timestep have to do with fixing it?

## On-Screen Text / Captions
- Wind speed slider: "WIND: 5 → 15 → 30 → 60 m/s"
- "PERFECT CLOTH SIMULATION." (Beat 1)
- "WAIT. WHAT IS HAPPENING." (Beat 4)
- "SAME CLOTH. HALF THE TIMESTEP. STILL WAVING." (Beat 6)
- "THE JELLYFISH WAS A TIMESTEP PROBLEM." (final)

## End Card
Full video: "I Simulated a Flag in the Wind" — link in bio. Building a stable cloth simulation is harder than it looks.

## Audio
Gentle wind at 5 m/s. Builds in intensity with each increase. At explosion: snapping, whooshing, glitching sounds. Cut to stable cloth: just gentle wind again. The audio contrast is as dramatic as the visual.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps; 20% speed slow-motion on explosion. Cloth: 20×20 spring-mass grid, strain-colored shading (green = relaxed, red = high strain). Wind slider visible on right. Background: sky gradient. The jellyfish phase should look genuinely bizarre — let mesh distortion be as weird as possible before the final snap.
