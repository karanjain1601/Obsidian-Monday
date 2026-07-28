---
title: "The Ball That Won't Stop Bouncing"
id: SB002
type: youtube-short
duration: "~50 seconds"
feeds_video: "My Bouncing Ball Gains Energy. That's Very Bad Physics."
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a bouncing ball's energy gauge ticks from 100% to 200% across successive bounces — the ball climbing higher each time until it phases through the ceiling — revealing how a naive restitution coefficient silently creates energy from nothing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** My Bouncing Ball Gains Energy. That's Very Bad Physics.

# Short: The Ball That Won't Stop Bouncing

**Feeds full video:** My Bouncing Ball Gains Energy. That's Very Bad Physics.
**Duration:** ~50 seconds

---

## Visual Hook (First 3 Seconds)
A pristine white ball bouncing in a clean dark room. Simple, satisfying, rhythmic. But in the upper-right corner, a bright green energy bar reads "ENERGY: 100%." On the second bounce — it clicks to 101%. The viewer's eye catches it immediately.

## Main Visual Sequence (0:03–0:50)
**Beat 1 (0:03–0:10):** Ball bouncing naturally. Energy bar ticking: 100% → 101% → 103% → 106%. Each bounce imperceptibly higher. Text: "WAIT."
**Beat 2 (0:10–0:18):** Close-up on the energy bar. It is definitely, unambiguously going UP. Counter accelerating: 110%... 120%... 130%. The ball is now visibly bouncing higher than it started.
**Beat 3 (0:18–0:28):** Camera pulls back. The ball is well above its original drop height. Energy: 150%. The ceiling of the simulation is now in frame. Ball is approaching it.
**Beat 4 (0:28–0:35):** Energy: 200%. The ball rockets upward, hits the ceiling, and keeps going — phases through it. "CONSERVATION OF ENERGY IS NOT OPTIONAL." appears in red.
**Beat 5 (0:35–0:42):** Freeze frame. The energy graph from start to now is shown — a curve rising exponentially from a flat baseline. The flat baseline is labeled "WHAT SHOULD HAPPEN." The rising curve: "WHAT HAPPENED."
**Beat 6 (0:42–0:50):** Text: "This code bounces the ball. It also creates energy out of nothing." Final: "HOW?"

## Physics Concept Teased
How does a naively implemented restitution coefficient (multiplying velocity by -0.9 on each bounce) violate conservation of energy and create energy from nothing?

## On-Screen Text / Captions
- "ENERGY: 100%" → "101%" → "110%" → "130%" → "150%" → "200%" (live counter, top right)
- "WAIT." (subtle, appears at Beat 1)
- "CONSERVATION OF ENERGY IS NOT OPTIONAL." (red, bold)
- "WHAT SHOULD HAPPEN." / "WHAT HAPPENED." (graph labels)
- "This code bounces the ball. It also creates energy out of nothing."
- "HOW?"

## End Card
Full video: "My Bouncing Ball Gains Energy. That's Very Bad Physics." — link in bio. The bug is in the most obvious place.

## Audio
Rhythmic bouncing SFX — each bounce slightly higher-pitched to subtly signal the energy increase. A low anxious drone enters around Beat 2 and builds. Error beep at the 200% mark. Dramatic silence on the freeze frame.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. Color grade: near-black background, white ball, bright green energy bar (shifts toward yellow then red as energy climbs). Energy bar fills from bottom-right corner and grows upward — it's the first thing that looks wrong. Graph in Beat 5 appears as an animated line drawn in real time. The exponential curve is unmistakably wrong even without labels.
