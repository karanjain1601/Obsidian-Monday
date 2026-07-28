---
title: "Two Chemicals, No Intelligence, Infinite Complexity: Turing's Last Secret"
season: 3
episode: 26
difficulty: 5.5/10
concept: "Gray-Scott reaction-diffusion and the Turing instability"
prereq: "E22 (diffusion on a grid) + E21 (finite differences)"
tags: [reaction-diffusion, Gray-Scott, Turing-patterns, morphogenesis, javascript, WebGL, computational-biology, pattern-formation, Turing-instability]
type: playlist-video
---

## S3·E26 — "Two Chemicals, No Intelligence, Infinite Complexity: Turing's Last Secret"

- **Alt title:** "Alan Turing's Hidden Discovery: How Patterns Grow From Nothing"
- **Difficulty:** 5.5/10 · **Prereq:** E22 (diffusion on a grid) + E21 (finite differences)
- **Hook:** A uniform gray canvas. From a single pixel perturbation, spots appear, grow, split, and rearrange into coral-like patterns, stripes, labyrinths, and spirals — all from two coupled equations. Same equations, slightly different parameters, completely different pattern.
- **The break (bug):** Without the right ratio between the two diffusion rates (Du must be significantly greater than Dv), the activator-inhibitor spatial separation doesn't occur and you get uniform mixing. The Turing instability requires that the *inhibitor* diffuses faster than the *activator* — so the inhibitor "chases" the activator across space, creating the pattern. Most beginners set equal diffusion rates and wonder why nothing happens.
- **Concept introduced:** Reaction-diffusion systems, specifically the Gray-Scott model `∂u/∂t = Du∇²u - uv² + f(1-u)`, `∂v/∂t = Dv∇²v + uv² - (f+k)v`. Turing instability: a homogeneous steady state that is stable without diffusion becomes unstable when diffusion is added, because the inhibitor diffuses faster and creates long-range suppression around local activator peaks. This is Alan Turing's 1952 morphogenesis paper — his last major scientific contribution before his death.
- **Push it / wow moment:** A GPU-computed 512×512 parameter space map — the (F, k) plane. Every point shows which pattern type emerges: coral (top-left), labyrinths (center), spots (bottom-right), spirals, worms, "mitosis" (self-replicating spots). Sweeping the parameter sliders in real-time morphs patterns between these regimes. The visual output is wallpaper-quality.
- **Demo:** F (feed rate) and k (kill rate) sliders with real-time pattern evolution. Click to seed the reaction at a specific point. Freeze-frame for wallpaper export. "Explore" button that random-walks through (F, k) space.
- **Tags:** `reaction-diffusion` `Gray-Scott` `Turing-patterns` `morphogenesis` `javascript` `WebGL` `computational-biology` `pattern-formation` `Turing-instability`
- **Thumbnail:** A stunning coral-like Turing pattern in electric blue-yellow. Caption: "2 EQUATIONS. ∞ PATTERNS."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
