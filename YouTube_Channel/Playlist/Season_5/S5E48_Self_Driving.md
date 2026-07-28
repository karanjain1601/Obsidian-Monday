---
title: "I Trained a Car to Drive a Track It Had Never Seen Before"
season: 5
episode: 48
difficulty: 8.5/10
concept: "Domain randomization and curriculum learning for RL generalization"
prereq: "E45 (RL framework) + E14 (collision + vehicle physics)"
tags: [self-driving-simulation, reinforcement-learning, procedural-generation, LIDAR, curriculum-learning, javascript, domain-randomization, RL-car, generalization]
type: playlist-video
---

## S5·E48 — "I Trained a Car to Drive a Track It Had Never Seen Before"

- **Alt title:** "Self-Driving Physics: Teaching a Simulated Car to Generalize From Scratch"
- **Difficulty:** 8.5/10 · **Prereq:** E45 (RL framework) + E14 (collision + vehicle physics)
- **Hook:** A simulated car with LIDAR-style ray sensors, trained only on simple oval tracks, driving a novel procedurally-generated track it has never seen — correctly navigating every turn.
- **The break (bug):** Training on a single fixed track causes the policy to overfit — it memorizes "always turn left at 3 seconds, always brake at the chicane" rather than reading sensor inputs. Evaluation on a new track fails immediately. Procedural variation during training (different track shape, curvature, friction each episode) forces the policy to generalize from sensor readings rather than memorizing track features.
- **Concept introduced:** Procedural environment generation as a regularization technique (domain randomization), curriculum learning (start with easy tracks, add complexity as the agent improves), and the generalization-specialization tradeoff in RL.
- **Push it / wow moment:** 100 cars training simultaneously on different procedurally-generated tracks in a single browser tab. Tournament selection: cars that complete the track fastest in the current generation are parents for the next. Watch the strategy evolve from random to careful.
- **Demo:** Draw your own track. Watch the trained car navigate it. Adjust car physics (mass, friction, engine power). The 100-car tournament training mode.
- **Tags:** `self-driving-simulation` `reinforcement-learning` `procedural-generation` `LIDAR` `curriculum-learning` `javascript` `domain-randomization` `RL-car` `generalization`
- **Thumbnail:** A glowing neon car navigating a complex hand-drawn track. "TRAINED FOR 30 SECONDS. DRIVES FOREVER."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_5/_Season_5_Overview|Season 5 Overview]]*
