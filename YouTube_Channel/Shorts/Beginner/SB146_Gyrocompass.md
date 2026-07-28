---
title: "Gyrocompass: Why It Always Points True North"
id: SB146
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, gyroscope, precession, navigation]
---

> **What it is:** A ~45-second simulation short where a gold gyroscope inside silver gimbals holds its axis fixed in space while Earth rotates beneath it, then slowly precesses via a weighted vane until it locks exactly onto true geographic north — revealing how gyroscopic precession driven by Earth's rotation creates a compass immune to magnetic interference. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Gyrocompass: Why It Always Points True North
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A gold gyroscope rotor spins at high speed inside a silver gimbal ring, mounted on a tilted pedestal. No matter which way the pedestal is rotated or tilted, the rotor's axis stubbornly remains pointing at a fixed direction in space — it does not follow the pedestal. The words "TRUE NORTH" glow green at the top of the screen.

## Main Visual Sequence (0:03–0:50)
**0:03** — Globe (blue with white latitude lines) shown with rotation axis (white arrow pointing to North Pole). Small gyrocompass housing mounted on the globe's surface at 45°N latitude. Gyro axis initially pointing in a random horizontal direction.

**0:10** — Earth rotates beneath the gyrocompass (1 day compressed to 5 seconds). The gyro axis does NOT rotate with Earth — it remains fixed in inertial space (pointing at a distant star). From Earth's perspective, the axis appears to slowly drift east.

**0:18** — A restoring mechanism engages: gravity-controlled pendulous vane (small weighted vane on gyro housing, orange). Each time the gyro tilts due to Earth's rotation, the vane creates a torque that precesses the spin axis. Direction of precession = toward true north.

**0:27** — Precession animation: red arrow shows precession direction (toward north); over several cycles the gyro axis spirals in and settles pointing exactly at true north (geographic, not magnetic). Green label: "True North — no magnetic error!"

**0:35** — Comparison panel: left = magnetic compass (deflected 15° by ship's steel hull). Right = gyrocompass (exact true north regardless of surrounding metal). Ships/aircraft text annotation.

**0:43** — Final frame: gyro axis locked to true north while the ship beneath rotates on wavy ocean. "Never affected by magnets." CodedLaws logo.

## Physics Concept Teased
A gyrocompass exploits gyroscopic precession: when Earth's rotation tilts a fast-spinning gyroscope, the resulting gyroscopic precession torque redirects the spin axis toward Earth's rotation axis — true north — regardless of magnetic fields or metal surroundings.

## On-Screen Text / Captions
- 0:03 → "Gyroscope resists changing direction"
- 0:10 → "Earth rotates — gyro stays fixed in space"
- 0:18 → "Pendulous vane creates correcting torque"
- 0:27 → "Gyro precesses toward TRUE north"
- 0:35 → "No magnetic interference"
- 0:43 → "Ships and aircraft navigate by this"

## End Card
Final 3 seconds: Gyrocompass silhouette on ocean background. Text: "No magnets. Just physics." CodedLaws wordmark and subscribe button.

## Audio
Steady, precise electronic ambient music, 72 BPM (like a clock ticking). Voiceover at 0:27: "Earth's own rotation steers the gyro to true north." Subtle high-frequency whirring sound for spinning rotor.

## Production Notes
Code complexity: moderate. Renderer: WebGL or Canvas 2D with 3D projection. Key visual trick: render gimbal rings as concentric ellipses (isometric projection); animate gyro axis as a 3D vector projected to 2D; use quaternion rotation to show Earth-fixed vs inertial-fixed axes. Runtime: real-time. Gotcha: gyrocompass only works when moving on Earth's surface; stationary inertial gyro will not settle — ensure the pendulous vane mechanism is clearly shown.
