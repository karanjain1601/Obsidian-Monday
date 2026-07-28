---
title: "Relative Motion: Who's Really Moving?"
id: SB129
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, relative-motion, frames-of-reference]
---

> **What it is:** A ~45-second simulation short where a ball thrown inside a moving train reads +10 m/s from the train frame but +40 m/s from the ground, and throwing it backward at exactly −30 m/s makes it hover motionless in mid-air while the train rolls away — demonstrating that measured speed depends entirely on the observer's reference frame. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Relative Motion: Who's Really Moving?
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Split-screen: left shows a person inside a moving train window; right shows the same scene from a bird's-eye road view. The person throws a red ball forward. On the left it looks slow; on the right it zooms. Bold flash: **"Same ball. Two speeds. Who's right?"**

## Main Visual Sequence (0:03–0:50)
**0:03** — Scene builds from scratch. A long grey train with windows moves rightward across a green countryside background. Overhead view (isometric-lite, slight top-down angle). Train speed label hovers above: **"Train: +30 m/s"** (white, rightward arrow). Ground (green horizontal strip) scrolls slowly left to imply train motion.

**0:08** — Inside the train, a stick-figure person (white, 30 px tall) is visible through the window. A red ball (radius 8 px) appears in the person's hand. A white label: **"Person throws ball forward at +10 m/s (relative to train)"**. Small red arrow points right from ball: **"+10 m/s"**.

**0:13** — Reference frame toggle — two frame buttons appear (top-center): **[Train Frame]** (blue, currently active) and **[Ground Frame]** (green). In Train Frame: background stays fixed (train appears stationary), ball moves right at +10 m/s. Speed indicator (blue): **"Ball speed: +10 m/s"**.

**0:19** — Switch to Ground Frame (button pulses green). Background (trees, roads) now frozen. Train moves right. Ball moves right faster. Speed indicator (green): **"Ball speed: +40 m/s"**. Equation appears: **"v_ball (ground) = v_ball (train) + v_train = +10 + +30 = +40 m/s"** (white text, yellow highlight on **40**).

**0:25** — Scenario 2 begins. Same setup, but person throws ball BACKWARD at −10 m/s relative to train. In Train Frame (blue): ball moves left at −10 m/s. In Ground Frame (green): ball speed = −10 + 30 = **+20 m/s** (still moving right!). Ground Frame equation: **"+30 + (−10) = +20 m/s"**. Text: **"Ball still moves RIGHT even though thrown backward!"** (bold yellow).

**0:31** — Scenario 3: Person throws ball directly backward at −30 m/s relative to train. Ground frame: ball speed = −30 + 30 = **0 m/s**. Ball hovers in mid-air (stationary relative to ground) while train pulls away. Ground frame indicator: **"Ball speed: 0 m/s — it hangs in the air!"** (cyan, exclamation). Satisfying visual: train moves on, ball stays at center of screen.

**0:37** — Summary vector diagram (white on dark overlay): number line from −30 to +40 m/s. Three colored dots: red (+40, forward throw), orange (+20, backward slow throw), cyan (0, perfectly backward throw). Arrow labeled **"v_train = +30 m/s"** as reference. Formula: **"v_ground = v_train + v_relative"** (white, center).

**0:42** — Einstein callout box (white card): **"Galilean relativity: velocity adds. Works for everyday speeds. Breaks down near light speed — that's Special Relativity."** Small Einstein sketch icon.

**0:45** — Final text: **"Reference frames: the same event, different numbers — both correct."**

## Physics Concept Teased
Galilean relativity states that velocities add when switching between inertial reference frames — the velocity of an object relative to the ground equals the velocity relative to the moving platform plus the platform's velocity; both measurements are equally valid.

## On-Screen Text / Captions
- **0:00** — "Same ball. Two speeds. Who's right?" (bold white/yellow)
- **0:08** — "Ball: +10 m/s relative to train" (red label)
- **0:13** — "[Train Frame]: Ball = +10 m/s" (blue speed indicator)
- **0:19** — "[Ground Frame]: Ball = +40 m/s" (green speed indicator)
- **0:19** — "v = +10 + +30 = +40 m/s" (equation, white)
- **0:25** — "Thrown backward: ball still moves right!" (yellow bold)
- **0:31** — "−30 + 30 = 0 m/s: ball hangs in the air!" (cyan bold)
- **0:37** — "v_ground = v_train + v_relative" (white formula)
- **0:42** — "This breaks near light speed — hello, Einstein!" (white card)
- **0:45** — "Both observers are correct — in their own frame." (white, center)

## End Card
Final 3 seconds: Train moving right, ball hovering in center (scenario 3 freeze). White text: **"Follow CodedLaws — physics from every angle."** Logo pulse.

## Audio
Music: Light electronic groove at 70 BPM from 0:00–0:30; playful melodic hook when frame switches (0:13, 0:19); brief dramatic pause at "ball hangs in the air" (0:31); upbeat resolution from 0:37. No voiceover. Sound effects: soft whoosh for ball throws, train rumble ambient (low volume), frame-switch "click" sound at toggle buttons.

## Production Notes
Code complexity: Low-Medium. Renderer: Canvas 2D. Key visual trick: maintain two global coordinate systems — trainFrame and groundFrame. In trainFrame, translate everything by −train.x (train center at fixed screen position); in groundFrame, keep world coordinates unchanged and let train move across screen. Toggle between frames by switching which translation is applied before each draw call. Ball velocity: store in both frames (v_ball_train and v_ball_ground = v_ball_train + v_train). Speed indicator: update text each frame with the current frame's ball velocity. Scenario switching at fixed timestamps using a simple state machine (scenario 1, 2, 3). Background parallax: draw 3 tree layers scrolling at different speeds for depth. Runtime: ~48 seconds. Gotcha: in scenario 3, ball velocity in ground frame is exactly 0 only if the backward throw speed exactly matches train speed — hardcode this to avoid floating-point drift making the ball drift slightly.
