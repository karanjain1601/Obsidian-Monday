---
title: "Four Integrators, Four Answers"
id: SB007
type: youtube-short
duration: "~50 seconds"
feeds_video: "Four Ways to Simulate Physics. Three Are Secretly Wrong."
difficulty: beginner
---

> **What it is:** A ~45-second simulation short showing four identically-started pendulums — Euler, RK2, RK4, and Verlet — swinging together at first then all pointing in completely different directions by t=120s, with three panels flipping red, revealing that only one integrator stays physically accurate over long simulations. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Four Ways to Simulate Physics. Three Are Secretly Wrong.

# Short: Four Integrators, Four Answers

**Feeds full video:** Four Ways to Simulate Physics. Three Are Secretly Wrong.
**Duration:** ~50 seconds

---

## Visual Hook (First 3 Seconds)
Four identical pendulums in a 2×2 grid, each labeled: "EULER" (red), "RK2" (orange), "RK4" (green), "VERLET" (cyan). All released simultaneously from the same 30° angle. "t = 0s" in the corner. They swing in perfect unison.

## Main Visual Sequence (0:03–0:50)
**Beat 1 (0:03–0:12):** t = 30s. All four pendulums still closely grouped. Minor separations visible but ignorable. "STILL CLOSE."
**Beat 2 (0:12–0:22):** t = 60s. Euler (red) is now visibly ahead — swinging out of phase with the others. RK2 starting to drift. RK4 and Verlet: still nearly identical to each other.
**Beat 3 (0:22–0:32):** t = 90s. Euler has completely lost sync. RK2 diverging noticeably. RK4 and Verlet still agree. Energy meters appear below each: Euler's is climbing, RK2's is slowly rising, RK4 and Verlet are flat.
**Beat 4 (0:32–0:42):** t = 120s. All four pointing in completely different directions — frozen at this moment. A single title card: "SAME PENDULUM. SAME START. FOUR ANSWERS."
**Beat 5 (0:42–0:46):** Slowly, three of the four panels turn red ("WRONG"). One stays green ("ACCURATE").
**Beat 6 (0:46–0:50):** "WHICH ONE WOULD YOU HAVE USED?" Final frame holds.

## Physics Concept Teased
Not all numerical integrators are equal — some gain phantom energy, some lose it, and only specific integrators designed for Hamiltonian systems preserve the physics exactly over long times.

## On-Screen Text / Captions
- "EULER" / "RK2" / "RK4" / "VERLET" (persistent labels in panel corners)
- "t = 30s... 60s... 90s... 120s" (top-center timer)
- "STILL CLOSE." (t=30, small, dismissive)
- "SAME PENDULUM. SAME START. FOUR ANSWERS." (freeze frame)
- "WRONG" (3 red panels) / "ACCURATE" (1 green panel)
- "WHICH ONE WOULD YOU HAVE USED?"

## End Card
Full video: "Four Ways to Simulate Physics. Three Are Secretly Wrong." — link in bio. The answer might surprise you.

## Audio
Four-voice counterpoint during the in-sync phase — the same melody in all four channels. As integrators diverge, the voices drift out of tune with each other. At t=120s freeze: all four voices play simultaneously in different keys — jarring dissonance. Then one clean note holds alone.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. 2×2 grid layout. Each pendulum has a distinct color: Euler (red #EF5350), RK2 (orange #FF9800), RK4 (green #66BB6A), Verlet (cyan #26C6DA). Energy meter is a horizontal bar below each panel. Timer is a prominent center-top display. At the freeze frame, a thin line connects all four pendulum bobs, showing how far apart they are. Consider making this short loop: the freeze frame cross-dissolves back to the synchronized t=0 release.
