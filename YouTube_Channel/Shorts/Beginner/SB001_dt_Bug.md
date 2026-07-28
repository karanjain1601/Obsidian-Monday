---
title: "The Moment You Add dt"
id: SB001
type: youtube-short
duration: "~45 seconds"
feeds_video: "I Coded a Cannon and Shot My Ball Into Infinity"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a cannonball fired at 45° traces a perfect glowing parabola at dt=0.033s, then the same cannon at dt=0.1s sends the ball rocketing horizontally off the screen — exposing how larger timesteps cause Euler integration error to compound catastrophically. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** I Coded a Cannon and Shot My Ball Into Infinity

# Short: The Moment You Add dt

**Feeds full video:** I Coded a Cannon and Shot My Ball Into Infinity
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A cannonball traces a perfect glowing parabola against a deep navy background. Corner HUD reads "dt = 0.033s | 30 FPS." The arc is smooth and mathematically beautiful. Ball lands with a satisfying thud exactly where expected. The simulation looks flawless.

## Main Visual Sequence (0:03–0:50)
**Beat 1 (0:03–0:07):** Text fades in: "NOW WATCH THIS." Same cannon, identical 45° angle, same initial speed. Corner HUD flips: "dt = 0.1s | 10 FPS."
**Beat 2 (0:07–0:12):** Cannon fires. Ball launches — then shoots nearly horizontally off the right edge of the screen in under a second. No arc. Just a flat line, then nothing.
**Beat 3 (0:12–0:16):** Empty screen. Silence. A blinking cursor pulses where the ball exited. Text appears: "WHERE DID IT GO?"
**Beat 4 (0:16–0:28):** SPLIT-SCREEN activates. Left: 30 FPS — glowing perfect parabola. Right: 10 FPS — ball rocketing off-screen instantly. Labels "dt = 0.033s" and "dt = 0.1s" pulse in their corners.
**Beat 5 (0:28–0:38):** Slow-motion replay of the 10 FPS version. Each discrete Euler step shown as a bright dot. Step 1: already wrong. Step 2: worse. Step 3: catastrophic. The dots form a near-horizontal line while the correct arc curves below them in ghost form.
**Beat 6 (0:38–0:45):** Text builds line by line: "SAME CODE." Beat. "SAME CANNON." Beat. "ONE DIFFERENCE." Long beat. Final text holds: "WHY?"

## Physics Concept Teased
How does tripling the timestep (from 0.033s to 0.1s) cause a simulation to produce physically impossible results — a ball that flies nearly horizontally to infinity instead of arcing back to the ground?

## On-Screen Text / Captions
- "dt = 0.033s | 30 FPS" (corner HUD, opening)
- "NOW WATCH THIS."
- "dt = 0.1s | 10 FPS" (corner HUD, second launch)
- "WHERE DID IT GO?" (with blinking cursor)
- "dt = 0.033s" / "dt = 0.1s" (split-screen labels in contrasting colors)
- "SAME CODE. SAME CANNON. ONE DIFFERENCE."
- "WHY?" (final hold, white on black, large)

## End Card
Full video: "I Coded a Cannon and Shot My Ball Into Infinity" — link in bio. Watch how a single line of code fixes it completely.

## Audio
No music. Tense silence throughout — the wrongness should feel eerie. Cannon fire SFX (deep punchy boom) at each launch. Satisfying whoosh on the correct arc. Comedic empty-screen silence when ball exits frame. Sub-bass thud on the split-screen reveal. Silence holds on the final "WHY?" frame.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps standard; drop to 12fps for the step-by-step Euler replay so individual steps are visible. Color grade: deep navy background (#0D1117), electric-blue trails (#4FC3F7), amber highlights for wrong trajectory (#FFA726), white monospace HUD font. Split-screen is a hard 50/50 cut, both sides active simultaneously. Loop point: "WHY?" frame cross-dissolves back to the opening cannon arc — seamless for Shorts auto-replay.
