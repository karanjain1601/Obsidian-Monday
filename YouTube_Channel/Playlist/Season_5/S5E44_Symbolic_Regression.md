---
title: "I Fed a Neural Net Raw Planet Data. It Derived Newton's Law of Gravity."
season: 5
episode: 44
difficulty: 8.5/10
concept: "Symbolic regression, genetic programming, and dimensional analysis"
prereq: "E43 (neural physics learning as motivation for interpretability)"
tags: [symbolic-regression, AI-Feynman, Newtons-law, machine-learning-physics, genetic-programming, interpretable-ML, physics-discovery, dimensional-analysis]
type: playlist-video
---

## S5·E44 — "I Fed a Neural Net Raw Planet Data. It Derived Newton's Law of Gravity."

- **Alt title:** "AI-Feynman: Can a Machine Rediscover Physics From Scratch?"
- **Difficulty:** 8.5/10 · **Prereq:** E43 (neural physics learning as motivation for interpretability)
- **Hook:** A system shown nothing but planet position and velocity data over time. Its symbolic regression output: `F = G·m₁·m₂/r²`. Newton's exact formula, in human-readable form, discovered without being told it existed.
- **The break (bug):** A pure neural network learns a non-interpretable black-box function. Symbolic regression with genetic programming explores expression trees (math formulas as trees: `sin(+(*,x),y)`) but gets stuck in local optima for complex formulas. Dimensional analysis as a physics-guided prior — requiring every candidate formula to be dimensionally consistent — shrinks the search space by orders of magnitude and avoids physically impossible formulas.
- **Concept introduced:** Symbolic regression — finding the mathematical formula that fits data — using genetic programming (evolving expression trees under selection pressure). Dimensional analysis: physical equations must be dimensionally consistent, so we can use units as a filter. The AI-Feynman approach (Tegmark et al.) uses neural networks to identify functional dependencies before applying symbolic regression.
- **Push it / wow moment:** Try to rediscover the Lagrangian of a coupled oscillator. Show which laws are easy for SR (inverse-square laws — short, clean) and which are hard (coupled angular momentum with constraints — require many operations). The process of watching evolution find `1/r²` is mesmerizing.
- **Demo:** Input any dataset (planet data, pendulum, spring). Select allowed mathematical operators. Watch expression trees evolve and simplify. Fitness vs. generation plot.
- **Tags:** `symbolic-regression` `AI-Feynman` `Newtons-law` `machine-learning-physics` `genetic-programming` `interpretable-ML` `physics-discovery` `dimensional-analysis`
- **Thumbnail:** A terminal output window showing `F = G * m1 * m2 / r^2` emerging from raw data columns. "THE AI WROTE THIS."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
