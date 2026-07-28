---
title: "Flocking Boids — Alignment, Cohesion, Separation"
id: SM074
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, boids, flocking, emergence, swarm-intelligence, agent-based]
---

> **What it is:** A ~45-second simulation short where 200 randomly oriented agents instantly cohere into a sweeping flock using only three local rules — separation, alignment, and cohesion — demonstrating how the Reynolds Boids model produces emergent murmuration-like behaviour and a Vicsek order-disorder phase transition as alignment weight varies. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Flocking Boids — Alignment, Cohesion, Separation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black background. 200 white arrows (boids) scattered randomly, pointing in all directions. Within 3 seconds they organise into a coherent flock — all moving together, turning as one, like a murmuration of starlings.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The three rules: (1) Separation: steer away from nearby boids (avoid crowding). (2) Alignment: steer toward the average heading of neighbours. (3) Cohesion: steer toward the average position of neighbours. Each rule shown independently on a small example with arrows indicating the steering force.

**0:10–0:18** — Combined: all three rules at once — a coherent flock forms and maintains itself. Boids shown as triangular arrows. They sweep left, right, split around an obstacle, and merge again. Each boid's field of view shown as a faint arc (blind angle at the rear). Caption: "Local rules → global order."

**0:18–0:27** — Isolation of each rule: toggle alignment ON/OFF, cohesion ON/OFF, separation ON/OFF and show the effect. Alignment only: boids orient the same way but drift apart. Cohesion only: boids cluster but orient randomly. Separation only: boids repel and fill space. Together: structured flock.

**0:27–0:36** — Obstacle avoidance: three circular obstacles placed in the flock path. Boids dynamically split and flow around the obstacles, reforming the flock behind them. Caption: "Obstacle avoidance: emergent steering." The flow looks like fluid past cylinders.

**0:36–0:45** — Phase transition: as the alignment weight increases from 0 to 1, the flock transitions from disordered (random directions) to ordered (all moving together). The order parameter Φ = |⟨e_i⟩| (mean heading magnitude) shown rising from 0 to ~0.95. Caption: "Order parameter Φ → 1: Vicsek transition." Bold text: "Boids — three rules, emergent intelligence." Fade to black.

## Physics Concept Teased
Boids (Reynolds 1987): three local rules (separation, alignment, cohesion) produce emergent flocking behaviour indistinguishable from real bird flocks. The transition from disorder to order as alignment weight increases is an example of the Vicsek phase transition — a non-equilibrium order-disorder transition.

## On-Screen Text / Captions
- **0:00** — "200 agents. 3 rules."
- **0:05** — "Separation: avoid. Alignment: match. Cohesion: flock."
- **0:12** — "Local rules → global flock"
- **0:20** — "Toggle rules: each one alone fails"
- **0:28** — "Obstacles: flock splits and reforms"
- **0:35** — "Φ → 1: Vicsek transition to order"
- **0:43** — "3 rules — the algorithm behind murmuration."

## End Card
Final 3 seconds: the flock sweeping left and right in a smooth arc. Text: "Craig Reynolds invented Boids in 1987 — used in Batman Returns (1992) for bat flocks." CodedLaws logo.

## Audio
Light, airy electronic (95 BPM). Whoosh sounds as the flock turns. Voiceover at 0:00: "No bird knows the whole pattern — but three local rules are enough to create the breathtaking murmuration." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D or WebGL. Key algorithm: Boids (Reynolds 1987). Each boid has position p and velocity v. Each step: for boid i, find neighbours within radius r. Compute: separation force = -Σ(p_j - p_i)/|p_j - p_i|² (inverse distance); alignment force = ⟨v_j⟩ - v_i; cohesion force = ⟨p_j⟩ - p_i. Weighted sum → acceleration. Clamp speed to v_max. N=200 boids, r=50px, v_max=4px/frame. Spatial hash for O(N) neighbour queries. Wrap-around or reflective boundaries. Order parameter: |Σv_i/|v_i||/N. Runtime: real-time, trivially fast.
