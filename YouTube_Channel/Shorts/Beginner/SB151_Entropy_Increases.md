---
title: "Entropy: Why Disorder Always Wins"
id: SB151
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, entropy, statistical-mechanics]
---

> **What it is:** A ~45-second simulation short where 100 glowing blue particles are released from one half of a box and scatter irreversibly into a chaotic uniform distribution — showing how the number of available microstates explodes from 1 to 10³⁰ and why the Second Law guarantees disorder always wins. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Entropy: Why Disorder Always Wins
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A rectangular box (dark background, white borders) has 100 glowing blue particles packed tightly into the left half. A thin white divider separates them from the empty right half. The divider disappears — and within seconds the particles spread chaotically to fill the entire box. The transformation from perfect order to complete chaos is immediate and irreversible.

## Main Visual Sequence (0:03–0:50)
**0:03** — Box shown full screen (600×300px). Left half: 100 bright blue particles bouncing in tight formation. Right half: completely empty (black). Divider visible as white vertical line. Label: "All particles in left half." Entropy counter: "W = 1 microstate" (top right).

**0:10** — Divider removed. Particles rush into the right half. After 2 seconds: roughly 50/50 distribution. Entropy counter updating rapidly: "W = 10²⁹ microstates." The counter can't be read — it's changing too fast. Shows scientific notation exploding upward.

**0:18** — Equilibrium reached: particles distributed uniformly (some fluctuation). Entropy counter displays: "W = 10³⁰." Label: "Maximum entropy = most disordered state." A tiny "+S" symbol glows continuously.

**0:27** — Thought experiment: can they go back? Arrow reversal shown — all 100 particles simultaneously moving back to left half. Text: "Probability of spontaneous re-ordering: 1 in 10³⁰." Effectively zero.

**0:35** — Boltzmann entropy equation appears: S = k_B · ln(W). k_B = 1.38 × 10⁻²³ J/K. W jumps from 1 → 10³⁰, so ΔS = k_B · ln(10³⁰) = 95.5 k_B. Equation terms highlighted one by one.

**0:43** — Final message: "This is the Second Law of Thermodynamics. The universe only goes one direction." Time arrow shown (left = past/ordered, right = future/disordered). CodedLaws logo.

## Physics Concept Teased
Entropy (S = k_B ln W) counts the number of microscopic arrangements (microstates) that produce the same macroscopic state. A disordered state has astronomically more microstates than an ordered one, so the universe naturally evolves toward disorder — entropy always increases in a closed system.

## On-Screen Text / Captions
- 0:03 → "100 particles — 1 microstate"
- 0:10 → "Divider gone — W explodes to 10²⁹"
- 0:18 → "Maximum entropy — W = 10³⁰"
- 0:27 → "Chance of going back: 1 in 10³⁰"
- 0:35 → "S = k_B · ln(W)"
- 0:43 → "Second Law: entropy only increases"

## End Card
Final 3 seconds: Split box showing ordered (left, glowing blue) vs disordered (right, random multicolor) states with a huge arrow pointing right. Text: "Time has a direction." CodedLaws subscribe.

## Audio
Tense, slightly unsettling ambient electronic music. Sound of rushing particles when divider is removed (white noise burst). Voiceover at 0:43: "Disorder always wins. It's not a rule — it's statistics." Slow heartbeat sound under the "thought experiment" reversal section.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: simulate 100 particles with elastic wall collisions (Newtonian billiards); count particles in left vs right half each frame; compute W = C(100, n_left) using Stirling's approximation; display log₁₀(W). Runtime: real-time. Gotcha: particle-particle collisions optional — hard-wall bouncing alone demonstrates entropy increase; keep it simple to maintain 60fps with 100 particles.
