---
title: "I Gave a Robot One Rule: Don't Fall. It Learned Everything Else."
season: 5
episode: 45
difficulty: 8/10
concept: "Reinforcement learning, PPO, and reward shaping"
prereq: "E41 (differentiable sim + gradient thinking) + Season 2 physics engine"
tags: [reinforcement-learning, CartPole, PPO, physics-simulation, javascript, deep-RL, reward-shaping, policy-gradient, bipedal-locomotion]
type: playlist-video
---

## S5·E45 — "I Gave a Robot One Rule: Don't Fall. It Learned Everything Else."

- **Alt title:** "Deep RL From Scratch: Training a Physics Agent in Your Own Simulation"
- **Difficulty:** 8/10 · **Prereq:** E41 (differentiable sim + gradient thinking) + Season 2 physics engine
- **Hook:** A pole balanced on a cart — random jittering at episode 1, perfect balance by episode 200. The learning happens live on screen; you watch the reward curve grow in real time.
- **The break (bug):** Sparse reward (±1 only for fall/survival) gives almost no gradient signal in early training — episodes last 2 frames before falling and the policy learns nothing. Reward shaping (add a continuous penalty for pole angle and cart position) accelerates learning enormously but, taken too far, teaches the agent to game the shaped reward rather than actually balance (e.g., oscillating violently in a way that keeps the shaped reward high but loses the sparse reward).
- **Concept introduced:** Reinforcement learning: state, action, reward, policy, value function. Policy gradient methods (REINFORCE, then PPO — Proximal Policy Optimization): compute the gradient of expected reward with respect to policy parameters and ascend it. Reward shaping — adding auxiliary reward terms — and the risks of unintended behavior it introduces (reward hacking).
- **Push it / wow moment:** The bipedal walker — a two-legged rigid body simulated with the Season 2 engine, trained to walk via PPO. Episode 1: immediate collapse. Episode 50: crawling. Episode 200: shuffling. Episode 500: upright, stable walking gait that emerges with no motion capture, no reference trajectory — just reward.
- **Demo:** Watch RL training live. Adjust reward shaping weights. Pause training and manually test the current policy. Resume. Inject noise into the simulation to test robustness.
- **Tags:** `reinforcement-learning` `CartPole` `PPO` `physics-simulation` `javascript` `deep-RL` `reward-shaping` `policy-gradient` `bipedal-locomotion`
- **Thumbnail:** Left: pole falling at episode 1. Right: perfectly balanced at episode 200. "200 EPISODES. ONE REWARD SIGNAL."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
