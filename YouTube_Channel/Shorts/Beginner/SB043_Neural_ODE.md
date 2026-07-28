---
title: "The Neural Pendulum"
id: SB043
type: youtube-short
duration: "~45 seconds"
feeds_video: "This Neural Net Watched a Pendulum and Learned Newton's Second Law"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a neural network builds a pendulum phase portrait point by point — closed cyan ellipses inside and open orange curves outside a glowing golden separatrix — revealing how a neural ODE trained on just 500 position-and-velocity observations learns the full vector field without ever being given an equation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** This Neural Net Watched a Pendulum and Learned Newton's Second Law

# Short: The Neural Pendulum

**Feeds full video:** This Neural Net Watched a Pendulum and Learned Newton's Second Law
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A pendulum's phase portrait — a beautiful set of closed ellipses for oscillation and open curves for full rotation, with a golden separatrix dividing them. Text: "A NEURAL NETWORK DREW THIS."

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** The neural network's learned vector field animated — arrows flowing at every point in (θ, ω) phase space. Trajectories shown flowing along these arrows.
**Beat 2 (0:10–0:18):** The TRUE pendulum phase portrait overlaid in a second color. The two match almost perfectly. "TRAINED ON DATA. CORRECT ON PHYSICS."
**Beat 3 (0:18–0:26):** A trajectory launched from a point OUTSIDE the training data region. The neural field still gives the correct prediction — generalizing physics, not just interpolating data.
**Beat 4 (0:26–0:32):** The separatrix highlighted in gold. "OSCILLATING PENDULUMS: inside the separatrix." "ROTATING PENDULUMS: outside." The neural network learned this boundary from data alone.
**Beat 5 (0:32–0:38):** Training data points shown: 500 sparse observations of position and velocity. "500 OBSERVATIONS. NO EQUATIONS GIVEN." The neural net extracted the physics.
**Beat 6 (0:38–0:45):** "It watched a pendulum. It learned F = -mg sin(θ). Nobody told it." Final: "LEARNING PHYSICS FROM DATA."

## Physics Concept Teased
A neural ODE trained on pendulum trajectory data discovers the governing vector field in phase space — and the learned field correctly predicts behavior at unobserved initial conditions, including the separatrix between oscillation and rotation.

## On-Screen Text / Captions
- "A NEURAL NETWORK DREW THIS." (opening)
- "TRAINED ON DATA. CORRECT ON PHYSICS." (Beat 2)
- "OSCILLATING PENDULUMS" / "ROTATING PENDULUMS" (separatrix labels)
- "500 OBSERVATIONS. NO EQUATIONS GIVEN." (Beat 5)
- "It watched a pendulum. It learned F = -mg sin(θ). Nobody told it." (Beat 6)
- "LEARNING PHYSICS FROM DATA." (final)

## End Card
Full video: "This Neural Net Watched a Pendulum and Learned Newton's Second Law" — link in bio. Neural ODEs explained.

## Audio
The phase portrait produces music: trajectories inside the separatrix create oscillating tones (musical, repeating). Trajectories outside: rising monotonic tones (non-repeating). The separatrix is a sonic boundary as well as a visual one.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. Phase portrait: θ on x-axis, ω on y-axis. Closed ellipses (oscillation): cyan. Open curves (rotation): orange. Separatrix: gold (#FFD700). Neural field arrows: white, semi-transparent. True physics overlay: bright green. Training data points: small yellow dots, 500 of them. The OOD trajectory (Beat 3) should be in a clearly different starting region.
