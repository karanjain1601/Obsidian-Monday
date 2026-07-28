---
title: "I Made a Neural Net That Simulates Fluids 100× Faster Than Physics"
season: 5
episode: 46
difficulty: 9/10
concept: "Neural surrogate models and distribution shift"
prereq: "E23 (stable fluids baseline) + E42 (PINNs / neural physics)"
tags: [neural-surrogate, fluid-simulation, deep-learning, scientific-ML, JAX, Reynolds-number, distribution-shift, fast-fluid, uncertainty-quantification]
type: playlist-video
---

## S5·E46 — "I Made a Neural Net That Simulates Fluids 100× Faster Than Physics"

- **Alt title:** "Neural Surrogates: When the AI Runs Faster Than the Laws It Learned"
- **Difficulty:** 9/10 · **Prereq:** E23 (stable fluids baseline) + E42 (PINNs / neural physics)
- **Hook:** A fluid simulation that takes 10 seconds per frame in Stam's solver. A neural network trained on that solver's output runs at 60 FPS — looking nearly identical until you push it outside the training distribution.
- **The break (bug):** A surrogate trained on a narrow range of Reynolds numbers extrapolates poorly outside that regime. At Re=200, the flow around a cylinder shows a beautiful Karman vortex street. At Re=2000 (not in training data), the neural surrogate produces smooth — but completely wrong — laminar flow. The surrogate doesn't know it doesn't know. Distribution shift is silent failure.
- **Concept introduced:** Neural surrogate models — neural networks trained to emulate a slow simulator. Training distribution and distribution shift — why a model accurate within its training domain can fail spectacularly outside it, and why this failure is *silent* (no error is raised; the output looks plausible). Uncertainty quantification for surrogates.
- **Push it / wow moment:** Hybrid simulation — use the neural surrogate where prediction uncertainty is low (estimated via ensemble disagreement or dropout), and fall back to the physics solver where uncertainty is high. The uncertainty estimate is a live heatmap overlay. In practice, the surrogate handles 95% of the domain and the solver handles 5% — but that 5% is exactly where it matters.
- **Demo:** Toggle neural vs. physics fluid. Reynolds number slider from 10 to 10,000. Watch the surrogate fail past its training boundary. The uncertainty heatmap overlay.
- **Tags:** `neural-surrogate` `fluid-simulation` `deep-learning` `scientific-ML` `JAX` `Reynolds-number` `distribution-shift` `fast-fluid` `uncertainty-quantification`
- **Thumbnail:** Neural fluid at 60fps vs. physics fluid at 1fps side-by-side. "100× FASTER. UNTIL IT ISN'T."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
