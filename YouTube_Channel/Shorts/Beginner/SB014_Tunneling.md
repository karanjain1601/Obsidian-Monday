---
title: "Tunnel Through a Wall"
id: SB014
type: youtube-short
duration: "~45 seconds"
feeds_video: "Why My Physics Engine Lets Fast Balls Phase Through Walls"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a ball bounces cleanly off a wall at low and medium speeds, but at high speed silently reappears on the opposite side in the next frame — slow-motion shows its frame-47 and frame-48 positions straddling the wall with no collision ever triggered — exposing the tunneling bug in discrete-timestep physics engines. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Why My Physics Engine Lets Fast Balls Phase Through Walls

# Short: Tunnel Through a Wall

**Feeds full video:** Why My Physics Engine Lets Fast Balls Phase Through Walls
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A thick white wall in the center of the frame. A ball on the left side moves toward the wall — slowly — and bounces back cleanly. Normal. Expected. Speed label: "SPEED: 1."

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** Slow ball (speed = 1): hits wall, bounces cleanly. "WORKS." Checkmark appears.
**Beat 2 (0:10–0:18):** Medium ball (speed = 5): hits wall, bounces correctly. "STILL WORKS." Checkmark.
**Beat 3 (0:18–0:26):** Fast ball (speed = 20): launches. In the next frame — it's on the OTHER side of the wall, still moving. It passed through. "WAIT."
**Beat 4 (0:26–0:32):** Slow motion of the fast ball's path. Frame 1: left side of wall. Frame 2: right side of wall. Nothing in between. The wall never knew it was there. "IT SKIPPED THE WALL."
**Beat 5 (0:32–0:38):** Step-by-step: ball position shown each frame as a dot. Dot 1: 10cm left of wall. Dot 2: 5cm RIGHT of wall. The wall is between two consecutive positions — never checked.
**Beat 6 (0:38–0:45):** Speeds compared: slow (bounce), medium (bounce), fast (phase through), ultra-fast (teleports across the room). "YOUR PHYSICS ENGINE IS HAUNTED." Final: "HOW DO YOU FIX THIS?"

## Physics Concept Teased
Discrete-timestep physics simulations check for collisions at each frame — if a fast object moves more than its own diameter in one frame, it teleports through solid walls without triggering any collision check.

## On-Screen Text / Captions
- Speed labels: "SPEED: 1 → 5 → 20 → 100"
- "WORKS." (green checkmark, Beats 1–2)
- "WAIT." (Beat 3, large)
- "IT SKIPPED THE WALL." (Beat 4)
- Frame numbers during slow-mo: "FRAME 47 / FRAME 48"
- "YOUR PHYSICS ENGINE IS HAUNTED."
- "HOW DO YOU FIX THIS?" (final hold)

## End Card
Full video: "Why My Physics Engine Lets Fast Balls Phase Through Walls" — link in bio. Continuous collision detection is the answer.

## Audio
Satisfying bounce SFX for slow and medium balls. For the fast ball: silence where the bounce should be — the punchline is in the missing sound. Creepy glitch sound during slow-motion reveal. Comic timing is essential.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps; manual frame-advance for the tunneling sequence. Wall: thick white rectangle, full vertical extent. Ball: bright orange with motion trail. Frame-by-frame: each past position as a fading orange circle. Speed label updates live. Wall shows a satisfied "SOLID" label that turns to "???" when fast ball phases through.
