---
title: "L-System Plant Branching Animation"
id: SM019
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, l-system, fractal, plant-growth, procedural-generation]
---

> **What it is:** A ~45-second simulation showing a single rewriting rule applied repeatedly to grow a branching tree that morphs into a bush, poplar, or fern simply by adjusting the branching angle — demonstrating L-system algorithmic plant generation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: L-System Plant Branching Animation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black screen. A single vertical green stem grows up from the bottom. At 2 seconds it forks — both branches fork — those fork again — in 3 seconds a full tree silhouette fills the top half of the screen, grown entirely from one rewriting rule.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The L-system grammar displayed: "Axiom: F. Rule: F → FF+[+F-F-F]-[-F+F+F]." Each symbol decoded: F = draw forward, + = turn 25° right, - = turn 25° left, [ = save position, ] = restore position. The tree at generation 4 shown in warm green.

**0:10–0:18** — Generation counter increments: Gen 1 (single stem) → Gen 2 (simple branch) → Gen 3 (more complex) → Gen 4 (full tree). Each generation shows the string length doubling. Tree grows from the ground upward with a growing animation, branches appearing in order of draw depth.

**0:18–0:27** — Rule variation 1: change the branching angle from 25° to 40°. The tree becomes stubby, wide, cactus-like. Change to 15°: tall, slender like a poplar. Annotation: "One parameter — completely different plant."

**0:27–0:36** — Rule variation 2: Stochastic L-system — the rule has a 33% chance of being applied as F → F[+F]F[-F]F instead of the main rule. Multiple trees generated simultaneously look like a grove of varied trees — each unique but recognisably the same species.

**0:36–0:45** — Showcase: five different L-systems rendered side by side: a bush, a fern, a tree, a seaweed, a snowflake. Text: "Five different rule sets." Bold final text: "L-systems — algorithmic botany." Fade to black.

## Physics Concept Teased
L-systems (Lindenmayer systems): a formal grammar that rewrites strings using production rules. When each symbol is interpreted as a turtle-graphics drawing command, the resulting structures are self-similar fractals resembling plants. They capture the recursive branching of real plant architecture.

## On-Screen Text / Captions
- **0:00** — "One rule. Applied repeatedly."
- **0:05** — "F → FF+[+F-F-F]-[-F+F+F]"
- **0:12** — "Generation 1 → 2 → 3 → 4"
- **0:20** — "Branch angle = 40° → bush; 15° → poplar"
- **0:28** — "Stochastic rules → grove of unique trees"
- **0:38** — "Fern, tree, seaweed, snowflake — all L-systems"
- **0:44** — "Algorithmic botany."

## End Card
Final 3 seconds: the five L-system variants side by side on black background. Text: "Prusinkiewicz & Lindenmayer, 1990." CodedLaws logo. CTA: "Which plant is your favourite? Drop the rule in the comments."

## Audio
Gentle acoustic guitar (80 BPM, finger-picked). Soft whoosh each time a new branch generation appears. Voiceover at 0:00: "One rewriting rule, applied over and over, grows a plant." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D turtle graphics. Key algorithm: string rewriting (iterate rule N times on axiom string), then turtle-graphics interpretation with a push/pop stack for branching. For animation: reveal the tree stroke by stroke, drawing one F-segment per frame. Parameterize: δ (branching angle), d (segment length), r (length ratio per generation). Stochastic L-system: choose from multiple rules with given probabilities at each application. Runtime: real-time Canvas 2D.
