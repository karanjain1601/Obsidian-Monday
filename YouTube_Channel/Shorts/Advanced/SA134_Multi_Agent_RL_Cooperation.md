---
title: "Multi-Agent RL: Emergent Cooperation"
id: SA134
type: youtube-short
duration: "~45 seconds"
feeds_video: "Multi-Agent Reinforcement Learning: When Agents Learn to Cooperate"
difficulty: advanced
tags: [physics, simulation, short, advanced, multi-agent, reinforcement-learning, emergent-behavior, cooperation, game-theory]
---

> **What it is:** A ~45-second simulation showing multiple autonomous agents trained with multi-agent RL in a shared physics environment developing emergent cooperative strategies -- role division and signaling arising without explicit programming. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Multi-Agent Reinforcement Learning: When Agents Learn to Cooperate

# Short: Multi-Agent RL — Emergent Cooperation

**Feeds full video:** Multi-Agent Reinforcement Learning: When Agents Learn to Cooperate

## Visual Hook (First 3 Seconds)
10 blue dots (agents) and 10 red dots (landmarks) scattered in a white arena. The blue dots are chaotic — bumping into each other, missing their targets. Then training kicks in. Time-lapse: by generation 500, each blue dot flows directly to its assigned red dot — without any explicit coordination instruction. Text: **"Cooperation emerged."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Environment: cooperative navigation (OpenAI Multi-Agent Particle Env). 10 agents (blue, radius 0.05, max speed 1 m/s), 10 landmarks (red). Reward: r = −min distance from any agent to each landmark. Shared global reward — all agents rewarded for the group's performance.
- **0:10** — Individual policy: each agent has its own policy π_i(a_i | o_i) where o_i = local observation: positions of 3 nearest agents + 3 nearest landmarks. Centralized training: critic Q(s, a₁, ..., a_N) uses global state. Execution: decentralized (each agent observes only locally).
- **0:18** — CTDE (Centralized Training, Decentralized Execution): MADDPG algorithm shown. Each agent i trains actor π_i with gradients from centralized critic Q_i(s, a₁...aₙ). Critic sees all agents' actions (no partial observability during training). Shown as bipartite diagram: local actors ↔ centralized critics.
- **0:27** — Training curve: step 0 = random policy, average coverage reward = **"−8.4"** (many landmarks uncovered). Step 100k = **"−5.2"** (some coordination). Step 500k = **"−1.1"** (near-optimal). Video frames at each checkpoint: random scatter → partial clustering → perfect assignment.
- **0:36** — Emergent behavior analysis: by generation 500, agents have learned implicit role assignment — no agent assigned a landmark to another, but stable 1-to-1 matching emerges. Communication analysis: mutual information between agents' actions = **"0.43 bits"** (implicit coordination without explicit messages).
- **0:44** — Adversarial variant: 8 cooperators (blue) + 2 adversaries (red, trained separately to block). Cooperators adapt: counter-strategy emerges — agents form decoy-and-rush pattern, where 2 blue agents distract adversaries while 6 cover landmarks. Label: **"Emergent tactics — never programmed."**

## Physics Concept Teased
Multi-agent reinforcement learning with centralized training but decentralized execution (CTDE) enables agents to learn cooperative strategies from shared reward signals: the centralized critic eliminates non-stationarity during training while the decentralized actors generalize to novel opponents — emergent cooperation arises without explicit programming of coordination protocols.

## On-Screen Text / Captions
- **0:00** — "10 agents, 10 goals — no assignment rule given"
- **0:10** — "Each agent sees only its nearest neighbors"
- **0:20** — "Train with global critic; execute with local policy"
- **0:30** — "500k steps: perfect 1-to-1 assignment emerges"
- **0:38** — "Add adversaries: decoy-and-rush tactics appear"
- **0:45** — "Multi-agent RL full video → link in bio"

## End Card
Final 3 seconds: agents in perfect formation, each at a landmark (blue circles on red dots). **"CodedLaws — Multi-Agent Systems"** text.

## Audio
Electronic swarm ambient (10 layered tones, one per agent). 88 BPM. Bright harmonic chord when all landmarks covered.

## Production Notes
Renderer: MADDPG on MPE (Python/PyTorch). Actor: 3-layer MLP (128 units, ReLU), output = 2D velocity. Critic: 3-layer MLP (128 units), input = global state + all actions. Training: 500k steps, batch 1024, Adam lr=10⁻³. Reward: −Σᵢ min_j ||p_agent_i − p_landmark_j||. Communication: measured as MI via MINE estimator. Adversarial variant: adversary policy = separate DDPG. Output 1080×1920, 60 fps.
