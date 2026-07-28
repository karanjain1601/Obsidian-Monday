---
title: "Schrödinger's Cat: Superposition Visualized"
id: SB172
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, superposition, wave-function]
---

> **What it is:** A ~45-second simulation short where two ghostlike cat images — one green and alive, one red and dead — flicker simultaneously inside a sealed black box until the lid opens and the wave function collapses instantly to one solid outcome, visualizing quantum superposition and the measurement problem. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Schrödinger's Cat: Superposition Visualized
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A sealed black box sits in the center of the screen. Inside the box, two overlapping semi-transparent images flicker simultaneously: a cat curled up and alive (green glow) and the same cat lying still and dead (red glow). The two images coexist, ghostlike. A radioactive atom (shown as a nucleus with decay probability 50%) drives the outcome. This is quantum superposition.

## Main Visual Sequence (0:03–0:50)
**0:03** — Box (black, sealed, 400px square) labeled "SEALED — NO OBSERVATION." Inside (viewed through translucent walls): radioactive atom (glowing nucleus, yellow). Geiger counter (dark, unclicked). Poison vial (blue). Cat silhouette (white). Superposition state shown: ψ = (1/√2)|alive⟩ + (1/√2)|dead⟩. Both alive (green) and dead (red) overlapping.

**0:10** — Wave function visualization: two bars on the right — |⟨alive|ψ⟩|² = 50% (green) and |⟨dead|ψ⟩|² = 50% (red). The bars flicker slightly (showing quantum amplitude), both at exactly 50%. The cat is genuinely in BOTH states until observed. Label: "Superposition: not 'we don't know' — the cat IS both."

**0:18** — Atom decay timeline shown. At each moment, the atom has probability P(decay, t) = 1 − e^(−λt). If it decays → Geiger clicks → vial breaks → cat dies. If not → cat lives. Until the box is opened, the atom is in superposition (decayed and undecayed simultaneously). Atom shown as quantum superposition: |not decayed⟩ + |decayed⟩ oscillating.

**0:27** — Box opened (lid flips open, bright light floods in). Wave function collapses: probabilities instantly resolve. Random coin-flip moment: for this animation, the cat is ALIVE (green bursts). Red bar drops to 0%, green bar shoots to 100%. Cat image becomes solid (no longer flickering). "Measurement causes collapse."

**0:35** — Alternate universe shown (grey, parallel): in some interpretations (Many Worlds), BOTH outcomes occur in different branches. Branch A: alive cat (green). Branch B: dead cat (red). Universe splits at measurement. Both exist.

**0:43** — Schrödinger invented this thought experiment in 1935 to criticize quantum mechanics — he thought it was absurd. Modern experiments confirm superposition is real (just not for macroscopic cats). CodedLaws logo.

## Physics Concept Teased
Quantum superposition means a quantum system genuinely exists in multiple states simultaneously until measured. In Schrödinger's thought experiment, a cat's fate is entangled with a quantum event, making the cat itself theoretically superposed — alive and dead — until the box is opened and the wave function collapses to one definite outcome.

## On-Screen Text / Captions
- 0:03 → "ψ = (1/√2)|alive⟩ + (1/√2)|dead⟩"
- 0:10 → "P(alive) = 50%, P(dead) = 50% — simultaneously"
- 0:18 → "Atom in superposition → cat in superposition"
- 0:27 → "Box opened — wave function collapses!"
- 0:35 → "Many Worlds: both outcomes happen, in parallel"
- 0:43 → "Schrödinger meant to mock QM — it backfired"

## End Card
Final 3 seconds: Two universes side by side (alive cat in green glow, dead cat in faded grey). Text: "The universe branches. Every time." CodedLaws subscribe.

## Audio
Eerie, mysterious ambient pad, 50 BPM. When box opens (0:27): dramatic musical sting + bright chord. Cat alive outcome: gentle purring sound. Many-worlds moment (0:35): reverb-heavy whoosh of splitting universes. Voiceover: "Until you look, the cat is alive and dead. Looking itself decides the outcome."

## Production Notes
Code complexity: simple-moderate. Renderer: Canvas 2D. Key visual trick: render two cat images (alive and dead) with opposing alpha values that flicker randomly (alpha_alive = 0.5 + 0.1·sin(t), alpha_dead = 0.5 − 0.1·sin(t)); on collapse event, smoothly tween one to alpha=1 and other to alpha=0 over 0.5 seconds; animate atom as pulsing circle switching between decayed/undecayed states. Runtime: real-time. Gotcha: avoid showing the cat as classically uncertain (dice roll) — emphasize it is genuinely in both states, not just "one or the other with unknown probability."
