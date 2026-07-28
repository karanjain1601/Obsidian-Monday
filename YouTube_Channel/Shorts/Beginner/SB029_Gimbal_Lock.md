---
title: "Gimbal Lock Happens"
id: SB029
type: youtube-short
duration: "~45 seconds"
feeds_video: "Why Euler Angles Made My Spaceship Do a Barrel Roll"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a spacecraft surrounded by three color-coded gimbal rings rotates freely until pitching to exactly 90° snaps two rings coplanar — and every subsequent yaw input produces a barrel roll instead, making the lost degree of rotational freedom viscerally obvious and demonstrating the Euler angle gimbal lock singularity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Why Euler Angles Made My Spaceship Do a Barrel Roll

# Short: Gimbal Lock Happens

**Feeds full video:** Why Euler Angles Made My Spaceship Do a Barrel Roll
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A 3D spacecraft spinning freely in all directions. Three rotating rings (a gimbal) shown around it, color-coded for yaw, pitch, roll. Each ring rotates independently. "THREE DEGREES OF FREEDOM."

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** Spacecraft rotates freely in all directions. Yaw (red ring) / Pitch (green ring) / Roll (blue ring). All three orthogonal, all independent. "NORMAL OPERATION."
**Beat 2 (0:10–0:18):** Ship pitches upward: 30°... 60°... 90°. At exactly 90° pitch: the red (yaw) ring and blue (roll) ring snap into the same plane. One ring goes gray with an "X" symbol.
**Beat 3 (0:18–0:26):** "GIMBAL LOCK." Attempt to yaw: ship does a barrel roll instead. Attempt to roll: ship yaws. Two axes collapsed into one.
**Beat 4 (0:26–0:32):** User desperately tries to yaw the ship — and it spins in the wrong axis every time. "INPUT: YAW. OUTPUT: ROLL." Repeated three times.
**Beat 5 (0:32–0:38):** Tilt pitch back below 90°. Rings separate. All three orthogonal again. "RESTORED. 3 DOF." Then: "But what if you need to pitch exactly 90°?"
**Beat 6 (0:38–0:45):** "The Apollo astronauts encountered this. Engineers had a rule: never pitch past 85°." Final: "EULER ANGLES HAVE A BLIND SPOT. WHERE IS IT?"

## Physics Concept Teased
Euler angles represent 3D rotation using three sequential rotations around fixed axes — but at certain orientations, two axes align (gimbal lock) and one degree of rotational freedom is permanently lost.

## On-Screen Text / Captions
- "THREE DEGREES OF FREEDOM." (opening)
- Axis labels: "YAW (red)" / "PITCH (green)" / "ROLL (blue)"
- "GIMBAL LOCK." (large, Beat 3)
- "INPUT: YAW. OUTPUT: ROLL." (Beat 4, repeated)
- "EULER ANGLES HAVE A BLIND SPOT." / "WHERE IS IT?" (final)

## End Card
Full video: "Why Euler Angles Made My Spaceship Do a Barrel Roll" — link in bio. Quaternions are the solution.

## Audio
Mechanical gimbal sounds (clicks and whirs) as rings rotate. At gimbal lock: a "thunk" as two rings snap coplanar. During wrong-axis rotations: a frustrated buzzer each time. When restored: a click of satisfaction.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. Gimbal rings: red (yaw/outermost), green (pitch/middle), blue (roll/innermost), semi-transparent to avoid occluding each other. At gimbal lock: two rings snap visually co-planar and one turns gray with X. Wrong-axis rotation demonstration is the key horror moment — ship does something completely unexpected on a simple input.
