---
title: "Neural Fluid at 60fps"
id: SB046
type: youtube-short
duration: "~50 seconds"
feeds_video: "I Made a Neural Net That Simulates Fluids 100× Faster"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short showing two turbulent fluid simulations side by side — a physics solver crawling at 1 FPS and a neural surrogate running smoothly at 60 FPS — until the Reynolds number is pushed past the training boundary and the neural version produces beautiful, confident, physically wrong results — revealing the silent out-of-distribution failure mode of neural surrogates. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** I Made a Neural Net That Simulates Fluids 100× Faster

# Short: Neural Fluid at 60fps

**Feeds full video:** I Made a Neural Net That Simulates Fluids 100× Faster
**Duration:** ~50 seconds

---

## Visual Hook (First 3 Seconds)
Two fluid simulations side by side. Left: labeled "PHYSICS SOLVER." Right: labeled "NEURAL SURROGATE." Both show turbulent flow. Left FPS counter: "1 FPS." Right FPS counter: "60 FPS." They look nearly identical.

## Main Visual Sequence (0:03–0:50)
**Beat 1 (0:03–0:10):** Physics solver: detailed, beautiful, but painfully slow — each frame renders visibly, one at a time. Neural surrogate: smooth, real-time, fluid motion. "100× FASTER."
**Beat 2 (0:10–0:18):** The neural surrogate is tested at low Reynolds number (training range). Behavior matches the physics solver closely. Vortices form and evolve correctly. Overlay comparison shows minimal error.
**Beat 3 (0:18–0:26):** Reynolds number slider pushed higher — still within training distribution. Neural surrogate keeps up. 60 FPS maintained. Error stays small. "WITHIN TRAINING RANGE: PERFECT."
**Beat 4 (0:26–0:34):** Reynolds number pushed PAST the training boundary. The neural surrogate continues running at 60 FPS — smooth, confident. But the physics is wrong. Flow that should be turbulent is smooth. "OUT OF DISTRIBUTION."
**Beat 5 (0:34–0:42):** Physics solver shown for the same conditions: violently turbulent, chaotic, correct. Neural surrogate shown: smooth and wrong. "100× FASTER. UNTIL IT ISN'T."
**Beat 6 (0:42–0:50):** "A neural surrogate can replace a physics solver inside its training distribution. Outside it, it confidently produces beautiful nonsense." Final: "THE MODEL DOESN'T KNOW WHAT IT DOESN'T KNOW."

## Physics Concept Teased
Neural surrogates for physics simulations are extremely fast within their training distribution, but they have no intrinsic knowledge of when they've extrapolated beyond what they know — they can produce confident, smooth, wrong results without any warning.

## On-Screen Text / Captions
- "PHYSICS SOLVER: 1 FPS" / "NEURAL SURROGATE: 60 FPS" (split-screen labels)
- "100× FASTER." (Beat 1)
- Reynolds number slider with "TRAINING RANGE" marker
- "WITHIN TRAINING RANGE: PERFECT." (Beat 3)
- "OUT OF DISTRIBUTION." (Beat 4)
- "100× FASTER. UNTIL IT ISN'T." (Beat 5, the punchline)
- "THE MODEL DOESN'T KNOW WHAT IT DOESN'T KNOW." (final)

## End Card
Full video: "I Made a Neural Net That Simulates Fluids 100× Faster" — link in bio. Neural surrogates for physics.

## Audio
Physics solver: slow, deliberate sound — each frame update audible as a processing click. Neural surrogate: smooth, rapid fluid sound — 60fps of continuous audio. At OOD: the fluid sound becomes eerily wrong — smooth where it should be choppy. The audio wrongness is unsettling.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps (neural) vs 1 FPS (physics) — make the physics solver's slowness visually obvious. Split-screen 50/50. Reynolds number slider between or below panels. Training range boundary clearly marked on the slider with a red line. OOD difference must be obvious — the neural output should look genuinely wrong compared to the physics solver at those conditions.
