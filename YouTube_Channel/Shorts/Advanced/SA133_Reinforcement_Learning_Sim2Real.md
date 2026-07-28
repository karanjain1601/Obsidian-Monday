---
title: "Reinforcement Learning: Sim-to-Real Transfer"
id: SA133
type: youtube-short
duration: "~45 seconds"
feeds_video: "Sim-to-Real Transfer: Training Robots in Simulation"
difficulty: advanced
tags: [physics, simulation, short, advanced, reinforcement-learning, sim-to-real, robotics, domain-randomization, policy]
---

> **What it is:** A ~45-second simulation showing a locomotion policy trained with domain-randomized physics simulation then directly deployed on a physical quadruped robot with no fine-tuning, demonstrating sim-to-real policy robustness. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Sim-to-Real Transfer: Training Robots in Simulation

# Short: Reinforcement Learning — Sim-to-Real Transfer

**Feeds full video:** Sim-to-Real Transfer: Training Robots in Simulation"

## Visual Hook (First 3 Seconds)
Split screen: left = bright rendered simulation (MuJoCo humanoid running fluidly, orange and grey). Right = real robot (identical grey metal humanoid) — running equally fluidly. Text: **"Trained 100% in simulation. Zero real-robot data."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Simulation environment: MuJoCo humanoid (17 joints, 54 state dimensions). Agent receives proprioceptive state s ∈ R⁵⁴ (joint angles + velocities + body pose). Action: joint torques a ∈ R¹⁷ (−150 to +150 Nm). Reward: r = 1.5·v_x − 0.05·|u|² − 0.5·z_fall.
- **0:10** — PPO training: policy π_θ(a|s) is a 3-layer MLP (512 units, ELU). Value function V_θ(s) = 3-layer MLP. 8192 environment instances run in parallel (GPU, shown as 8192 tiny humanoids running). Sampling rate: **"10 million timesteps per minute."**
- **0:18** — Domain randomization: each episode, physics parameters randomized. Mass per link: ±30% nominal. Joint damping: ×0.5–×2. Ground friction: 0.4–1.2. External disturbances: ±50 N force applied randomly. Policy must succeed across **"128 parameter combinations."** Shown as parameter distribution histogram.
- **0:27** — Sim-to-real gap: without randomization — real robot falls in 0.8s (red X). With domain randomization — real robot runs for **"8+ seconds"** (green checkmark). Policy robust because it was never over-fit to exact simulator parameters. Success rate: **"87% on real robot."**
- **0:36** — Reward curve: training steps (x-axis: 0–500M), episodic reward (y-axis: 0–12). Curve rises from **"r=0"** → **"r=8.3"** at 200M steps → plateaus at **"r=10.8"**. Video of agent behavior at 50M (awkward shuffle) vs. 500M (smooth, 3.2 m/s gait) shown.
- **0:44** — Real robot deployment: same policy weights loaded directly (zero-shot transfer). Real robot runs on varied terrain: flat → gravel → 10° slope → stairs. Success on all terrains labeled (checkmarks). Walking speed on real robot: **"2.9 m/s"** vs. 3.2 m/s simulation (9% gap).

## Physics Concept Teased
Sim-to-real transfer succeeds through domain randomization: training over a broad distribution of simulated physics parameters forces the learned policy to be robust across parameter uncertainty — when deployed on the real robot (which falls within the randomization range), the policy generalizes without any real-world training data.

## On-Screen Text / Captions
- **0:00** — "Robot learned to walk in simulation. Transfers to reality."
- **0:10** — "8192 simulated robots train in parallel — 10M steps/min"
- **0:20** — "Domain randomization: randomize everything, every episode"
- **0:30** — "No randomization: falls in 0.8s. With: runs 8+ seconds."
- **0:38** — "87% success rate. Zero real-robot training."
- **0:45** — "Full sim-to-real tutorial → bio"

## End Card
Final 3 seconds: real robot running at 2.9 m/s, gait overlay. **"CodedLaws — Robot Learning"** text.

## Audio
Energetic electronic beat at 100 BPM. Mechanical servo whine SFX layered with running steps. No voiceover.

## Production Notes
Renderer: MuJoCo + Isaac Gym (NVIDIA) for parallel training. Policy: PPO (Schulman 2017), clip ε=0.2. Network: 512-512-17 MLP (ELU). 8192 parallel environments, RTX 4090. Domain randomization: uniform distributions per parameter. Training: 500M timesteps, 2 hours on GPU. Real robot: quadruped/humanoid (hypothetical; Unitree H1 type). Output 1080×1920, 60 fps.
