---
title: "Preferential Attachment — Rich-Get-Richer"
id: SM149
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, network-science, preferential-attachment, power-law, polya-urn, cumulative-advantage]
---

> **What it is:** A ~45-second simulation short where a Polya urn starting with one red and one blue ball rapidly converges to near-total domination by whichever colour gains an early lead, with the fraction time series showing how small initial advantages compound into permanent dominance, demonstrating the preferential attachment mechanism that generates power-law distributions and the Matthew effect. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Preferential Attachment — Rich-Get-Richer

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A Polya urn: starts with 1 red ball and 1 blue ball. Draw a ball at random; put it back plus one more of the same colour. Red drawn → 2 red, 1 blue. Blue → 1 red, 2 blue. After 1000 draws, the composition is almost all one colour — which one is random, but the winner dominates completely.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Polya urn model: reinforcement learning at its simplest. After N balls total, the fraction of red balls is a beta-distributed random variable — it converges to a fixed value but that value is random (not always 1/2). Caption: "Polya urn: fraction converges — but to a random value." Polya (1923). Any initial advantage is self-reinforcing.

**0:10–0:18** — Power law from PA: if reinforcement is proportional to current count (Π(k) ∝ k), the distribution of final counts follows a power law P(k) ∝ k^(-2) for the two-choice case. With m new balls added to the winning urn at each step: P(k) ∝ k^(-1-1/m). Caption: "PA with m additions: P(k) ∝ k^(-1-1/m) — power law."

**0:18–0:27** — Real examples: (1) Citations — a paper already cited 100× is more likely to get the next citation than a paper cited once. Cumulative advantage. (2) App downloads — top apps get featured, get more downloads. (3) Song popularity — Billboard Hot 100 songs stay there longer if they're already there. Caption: "Cumulative advantage: citations, apps, songs — PA everywhere."

**0:27–0:36** — Matthew effect: Robert Merton (1968) — named after Matthew 25:29: "For to everyone who has, more will be given." Scientific careers: early publications attract more collaborators → more papers → more citations → more funding. Matthew effect reinforces the initial advantage. Caption: "Matthew effect: early advantage compounded forever — Merton 1968."

**0:36–0:45** — Breaking PA: random innovation (add a new urn occasionally) prevents total dominance. This explains why new technologies can sometimes displace incumbents. Caption: "Innovation: new entrants can break preferential attachment." Bold text: "Preferential attachment — the mathematics of advantage compounding." Fade to black.

## Physics Concept Teased
Preferential attachment (PA): a positive feedback mechanism where new resources are allocated proportional to existing resources (Π(k)∝k). The Polya urn is the simplest model. PA generates power-law distributions P(k)∝k^(-α). It explains cumulative advantage in citations, wealth, social networks, and app stores. The "Matthew effect" (rich get richer) is a special case of PA.

## On-Screen Text / Captions
- **0:00** — "Polya urn: the rich always get richer."
- **0:05** — "Π(k) ∝ k — reinforcement proportional to count"
- **0:12** — "P(k) ∝ k^(-1-1/m) — power law from PA"
- **0:20** — "Citations, apps, songs — cumulative advantage"
- **0:28** — "Matthew effect: early advantage → compounded forever"
- **0:35** — "Innovation breaks PA — how new tech wins"
- **0:43** — "PA — the mathematics of advantage compounding."

## End Card
Final 3 seconds: the Polya urn after 1000 draws — almost all red, one lonely blue ball. Text: "The Polya urn has a deep connection to Bayesian statistics: the Dirichlet process is a Polya urn in continuous space." CodedLaws logo.

## Audio
A rhythmic draw-and-place sound for each Polya urn step. Voiceover at 0:00: "Draw a ball, put it back with one more of the same colour — small initial advantage compounds into near-total dominance. This is the physics of rich-get-richer." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (animated urn + fraction time series). Key algorithm: Polya urn simulation. Start: 1 red, 1 blue. At each step: draw uniformly; add one of the drawn colour. Track fraction red f(t). Run multiple trials: each converges to a different f. Distribution of f over trials = Beta(1,1) = Uniform[0,1]. For power law: Hoppe urn (add a new colour with probability θ/(θ+n), add to existing colour proportional to k). Track colour counts: power law at large counts. Plot rank-frequency in log-log. Runtime: fast, Canvas 2D.
