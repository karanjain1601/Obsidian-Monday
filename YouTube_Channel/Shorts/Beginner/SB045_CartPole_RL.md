---
title: "CartPole Learns to Balance"
id: SB045
type: youtube-short
duration: "~50 seconds"
feeds_video: "I Gave a Robot One Rule: Don't Fall"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a cart repeatedly topples a pole in under half a second for the first episodes, then after 200 training rounds balances it motionless for over two minutes with tiny precise corrections — revealing how reinforcement learning discovers a sophisticated balancing policy from a single "don't fall" reward signal. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** I Gave a Robot One Rule: Don't Fall

# Short: CartPole Learns to Balance

**Feeds full video:** I Gave a Robot One Rule: Don't Fall
**Duration:** ~50 seconds

---

## Visual Hook (First 3 Seconds)
A cart on a track with a pole balanced on top. Episode 1. The pole immediately starts tipping. The cart lurches one way, overcorrects, and the pole falls in 0.3 seconds. "EPISODE 1. 0.3 SECONDS."

## Main Visual Sequence (0:03–0:50)
**Beat 1 (0:03–0:10):** Episodes 1–5 in rapid montage. Each: pole falls almost immediately. Durations: 0.3s, 0.4s, 0.2s, 0.5s, 0.3s. The agent is completely lost. Reward: 0.
**Beat 2 (0:10–0:20):** Episode 20. The cart makes a few correct corrections. Pole survives 2 seconds before falling. "EPISODE 20. 2 SECONDS." Reward curve shown climbing slightly.
**Beat 3 (0:20–0:28):** Episode 50: 5 seconds. The cart is clearly trying — moving correctly in response to the pole angle. Reward: 50. "LEARNING."
**Beat 4 (0:28–0:36):** Episode 100: the pole survives 15 seconds. The cart movements are confident, smooth, quick corrections anticipating the fall. Reward: 150. Reward curve steep now.
**Beat 5 (0:36–0:44):** Episode 200: the cart balances indefinitely. The pole stands perfectly vertical. The cart makes tiny, precise corrections. Reward: maxed. Timer keeps running: "120 SECONDS. STILL STANDING."
**Beat 6 (0:44–0:50):** Reward curve shown from episode 1 to 200: flat near zero, then hockey-stick rise, then plateau at maximum. "ONE RULE: DON'T FALL. 200 EPISODES." Final: "IT FIGURED OUT BALANCING BY ITSELF."

## Physics Concept Teased
Reinforcement learning trains an agent purely through reward signals — no physics knowledge given, no equations, just "still standing = reward, fallen = zero" — and from this emerges a sophisticated control policy for dynamic balancing.

## On-Screen Text / Captions
- "EPISODE 1. 0.3 SECONDS." (opening)
- Episode counter: "EPISODE 1 → 20 → 50 → 100 → 200"
- Duration timer: "0.3s → 2s → 5s → 15s → 120s..."
- "LEARNING." (Beat 3)
- Reward counter per episode
- "IT FIGURED OUT BALANCING BY ITSELF." (final)

## End Card
Full video: "I Gave a Robot One Rule: Don't Fall" — link in bio. Reinforcement learning and Q-networks explained.

## Audio
Episodes 1–10: comedic falling sounds — quick crash, quick crash. As performance improves: the crashes become rarer. Episode 200: just the ambient hum of the simulation and the quiet precision of the cart's movements. The absence of crash sounds tells the story.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. CartPole rendered simply: gray track, white cart, vertical pole with a bob. Episode number and duration in corner. Reward curve shown as a growing plot below the simulation — critical for showing the learning arc. The transition from "crash every second" to "balance forever" should be shown through a time-lapse montage of episode clips.
