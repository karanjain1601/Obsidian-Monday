---
title: "Reynolds Flocking with Obstacles"
id: SM075
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, boids, flocking, path-planning, obstacle-avoidance, steering-behaviours]
---

> **What it is:** A ~45-second simulation short where 500 cyan boids flow through a dense maze of cylindrical pillars like liquid — splitting at each obstacle and reforming behind it — demonstrating Reynolds' predictive probe-based steering behaviours and how collective navigation through complex environments emerges without any path planning. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Reynolds Flocking with Obstacles

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A flock of 500 bright cyan boids racing toward a maze of dark cylindrical pillars. In 3 seconds the flock flows through the maze like a liquid — splitting at each pillar, reconnecting behind it, maintaining its cohesion — as if the entire flock has one mind navigating the obstacle field.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Steering behaviours (Reynolds 1999 extension): added to the basic boids rules. Obstacle avoidance: for each boid, cast a probe ahead in the direction of velocity; if an obstacle is detected within probe length, add an avoidance force perpendicular to the obstacle surface and away from it. Caption: "Obstacle avoidance: predictive probe steering."

**0:10–0:18** — Five classic Reynolds steering behaviours shown in sequence (each for 2 seconds): Seek (chase target), Flee (run from threat), Arrive (slow near target), Pursue (predict and intercept), Evade (predict and escape). Caption shows the behaviour name and the formula for each steering force.

**0:18–0:27** — Full maze navigation: the flock enters the maze (a 5×5 grid of columns). Density heat-map overlay shows where boids concentrate — preferentially in the channels between columns. The flock reconstructs from the channels behind the maze. Caption: "Flow through a maze — emergent path finding."

**0:27–0:36** — Leader following: one boid (shown in gold) is designated as the leader. All other boids follow the leader using pursue behaviour. The leader navigates around obstacles; followers trail behind in a natural streamtail. Caption: "Leader following — biological equivalent of a V-formation."

**0:36–0:45** — Speed-up with 5,000 boids: canvas fills with cyan particles flowing past obstacles like water. The obstacle wakes are clearly visible (low-density regions). Caption: "5,000 boids: emergent fluid-like flow." Bold text: "Reynolds steering — AI movement since 1987." Fade to black.

## Physics Concept Teased
Reynolds steering behaviours: extensions of the basic Boids rules with goal-directed behaviours (seek, flee, pursue, evade, arrive). Predictive obstacle avoidance steers around obstacles before collision. Combined with flocking, these behaviours produce collective navigation through complex environments — used in game AI, robotics, and crowd simulation.

## On-Screen Text / Captions
- **0:00** — "500 boids. A maze. No path planning."
- **0:05** — "Obstacle avoidance: probe ahead, steer away"
- **0:12** — "Seek, flee, arrive, pursue, evade — 5 behaviours"
- **0:20** — "Flow through maze: density concentrates in channels"
- **0:28** — "Leader following: pursue the gold boid"
- **0:35** — "5,000 boids: fluid-like flow past obstacles"
- **0:43** — "Reynolds steering — AI movement since 1987."

## End Card
Final 3 seconds: the 5,000-boid fluid flow past obstacles, vivid cyan on black. Text: "Reynolds steering powers: The Lord of the Rings battle scenes, GTA crowds, RTS games." CodedLaws logo.

## Audio
Driving, energetic electronic (110 BPM). Whooshing air sounds as the flock flows through the maze. Voiceover at 0:00: "No boid has a map of the maze — they navigate it purely through steering rules and avoid each other." No other voiceover.

## Production Notes
Code complexity: moderate (extension of SM074). Renderer: Canvas 2D or WebGL. Key algorithm: extend SM074 with obstacle avoidance. Obstacle avoidance: for each boid, compute probe endpoint (p + v·probe_length). For each circular obstacle (centre c, radius r): if |probe_endpoint - c| < r + buffer, add steering force = (probe_endpoint - c).normalise() × strength. Spatial hash for boid neighbours; bounding sphere tree for obstacle queries. Leader following: leader moves with seek towards a target; followers use pursue (predict leader's future position = p_leader + v_leader·T). Runtime: real-time Canvas 2D for N<1000; WebGL instancing for N=5000.
