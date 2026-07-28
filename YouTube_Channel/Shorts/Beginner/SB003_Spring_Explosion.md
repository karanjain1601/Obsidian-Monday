---
title: "Spring Explosion in Slow Motion"
id: SB003
type: youtube-short
duration: "~45 seconds"
feeds_video: "Why My Spring Exploded"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short showing two identical springs oscillating side by side — the Symplectic Euler spring stays perfectly rhythmic while the Standard Euler spring grows wilder each cycle until it tears itself apart — demonstrating how integrator choice determines whether a simulation conserves energy. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Why My Spring Exploded

# Short: Spring Explosion in Slow Motion

**Feeds full video:** Why My Spring Exploded
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
Two springs side by side, oscillating in perfect sync. Left label: "SYMPLECTIC EULER." Right label: "STANDARD EULER." They look identical. Timer in corner: "t = 0s."

## Main Visual Sequence (0:03–0:50)
**Beat 1 (0:03–0:10):** Both springs oscillating at the same amplitude. Timer: t = 5s. Identical. Timer: t = 10s. Still identical. "So far so good."
**Beat 2 (0:10–0:18):** Timer: t = 20s. The right spring (Standard Euler) is visibly, unmistakably larger oscillations. Left spring: unchanged, perfect, rhythmic. Text: "WAIT."
**Beat 3 (0:18–0:26):** Timer: t = 30s. Right spring amplitude fills half the screen. Left spring: still the same. Energy graphs appear below each: left is a flat line. Right is a curve bending upward.
**Beat 4 (0:26–0:34):** Timer: t = 35s. Right spring slams against the screen edges. SLOW MOTION activates. The spring end flying outward frame by frame. The amplitude is now infinite — it snaps.
**Beat 5 (0:34–0:40):** EXPLOSION. Spring fragments scatter. The left spring keeps oscillating calmly in slow motion, unchanged, perfectly periodic.
**Beat 6 (0:40–0:45):** Side-by-side energy graphs: Left — flat line for 35 seconds. Right — an exponential that ended in the explosion. Text: "SAME SPRING. SAME TIMESTEP. DIFFERENT MATH."

## Physics Concept Teased
Why does one integrator (Symplectic Euler) conserve the spring's energy exactly over any time period, while another (Standard Euler) injects phantom energy until the simulation tears itself apart?

## On-Screen Text / Captions
- "SYMPLECTIC EULER" / "STANDARD EULER" (persistent labels)
- "t = 5s... t = 10s... t = 20s... t = 30s... t = 35s" (timer)
- "WAIT." (Beat 2)
- "STABLE" (left spring, green) / "GROWING" (right spring, red)
- "SAME SPRING. SAME TIMESTEP. DIFFERENT MATH."
- "WHY DOES ONE EXPLODE?" (final frame)

## End Card
Full video: "Why My Spring Exploded" — link in bio. The answer is in two lines of code.

## Audio
A low, pleasant hum for the stable spring throughout. The right spring's audio begins the same, then slowly distorts, adding overtones and dissonance as the amplitude grows. The explosion is a dramatic burst followed by the left spring's hum returning alone — clean, unaffected.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps; slow-motion (10% speed) on the explosion sequence. Color grade: dark lab aesthetic — left spring in calm cyan (#00BCD4), right spring in warm amber that shifts to red as it grows. Energy graphs below each spring appear at Beat 3. Fragment particle system on explosion. The left spring's amplitude is shown with a fixed reference line so the viewer can confirm it never changes.
