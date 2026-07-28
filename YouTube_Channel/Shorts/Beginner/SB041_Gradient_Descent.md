---
title: "Gradient Descent Aims the Cannon"
id: SB041
type: youtube-short
duration: "~50 seconds"
feeds_video: "I Aimed a Cannon With Gradient Descent"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a cannon fires repeated trajectories that crash into obstacles, each attempt guided by gradient arrows, until after 20 iterations the arc threads perfectly through all three obstacles and hits the target — revealing how gradient descent minimizes a loss function by nudging parameters downhill. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** I Aimed a Cannon With Gradient Descent

# Short: Gradient Descent Aims the Cannon

**Feeds full video:** I Aimed a Cannon With Gradient Descent
**Duration:** ~50 seconds

---

## Visual Hook (First 3 Seconds)
A cannon, three obstacles, and a distant target. A trajectory arcs from the cannon — and misses badly, crashing into an obstacle. Text: "ATTEMPT 1. LOSS: 847." Then an arrow appears on the arc, pointing in a direction. "ADJUSTING."

## Main Visual Sequence (0:03–0:50)
**Beat 1 (0:03–0:10):** Attempt 1: random trajectory. Crashes into the first obstacle. Loss value: 847. Gradient arrow appears on the trajectory — a red arrow showing which direction to adjust the angle and velocity.
**Beat 2 (0:10–0:18):** Attempt 5: adjusted trajectory. Clears the first obstacle but hits the second. Loss: 412. Gradient arrows appear again, pointing to a new adjustment. The optimizer is learning.
**Beat 3 (0:18–0:26):** Attempt 10: clears two obstacles, stopped by the third. Loss: 198. The trajectory is visibly smarter — it's threading through gaps, no longer random.
**Beat 4 (0:26–0:34):** Attempts 11–18 in rapid montage — each arc slightly better, loss display ticking down: 150, 98, 45, 12, 3...
**Beat 5 (0:34–0:42):** Attempt 20: the arc threads perfectly through all three obstacles and hits the target dead center. Explosion. "LOSS: 0.0001." Counter: "20 ITERATIONS."
**Beat 6 (0:42–0:50):** Replay the final trajectory in slow motion. "The cannon didn't know the answer. It followed the gradient." Final: "GRADIENT DESCENT. 20 STEPS."

## Physics Concept Teased
Gradient descent optimizes a trajectory by repeatedly computing the derivative of the miss distance with respect to the launch parameters, then nudging those parameters in the downhill direction.

## On-Screen Text / Captions
- "ATTEMPT 1. LOSS: 847." (opening)
- Loss counter per attempt: "847 → 412 → 198 → 12 → 0.0001"
- "ADJUSTING." (after each gradient arrow appears)
- "LOSS: 0.0001." / "20 ITERATIONS." (Beat 5)
- "The cannon didn't know the answer. It followed the gradient." (Beat 6)
- "GRADIENT DESCENT. 20 STEPS." (final)

## End Card
Full video: "I Aimed a Cannon With Gradient Descent" — link in bio. The math behind the optimization.

## Audio
Each failed attempt: a crash sound. The loss counter's descent creates a musical descending tone — faster as it approaches zero. Final successful shot: a triumphant hit sound. Silence. Then the replay with no sound — let the visual perfection speak.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. Cannon at bottom-left, target at bottom-right, obstacles as thick vertical bars. Trajectory trails: each attempt in a slightly different color (gradient from red→orange→yellow→green as attempts improve). Gradient arrows: red vectors on the trajectory curve. Loss display: prominent, large number. Obstacles should be color-coded (same color throughout). The final trajectory should look unmistakably "aimed."
