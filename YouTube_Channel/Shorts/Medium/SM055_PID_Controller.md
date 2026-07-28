---
title: "PID Controller — Drone Altitude Stabilisation"
id: SM055
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, control-theory, PID, drone, stabilisation, feedback]
---

> **What it is:** A ~45-second simulation short where a wind-buffeted drone bounces chaotically until a PID controller switches on, demonstrating step-by-step how the proportional, integral, and derivative terms together achieve fast, stable, zero-offset altitude hold despite a constant wind disturbance. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: PID Controller — Drone Altitude Stabilisation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A drone hovers against a grey sky. It's buffeted by wind — bouncing up and down erratically. Text appears: "No control → chaos." Then the PID controller is switched on: the drone quickly settles to exactly 10 m altitude, rock-steady, despite the ongoing wind disturbance.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — PID formula: u(t) = K_P·e(t) + K_I·∫e(t)dt + K_D·de/dt. Each term shown: P = proportional (error now), I = integral (accumulated error), D = derivative (error rate). Drone altitude e(t) = target - actual. Caption: "P: where you are. I: where you've been. D: where you're going."

**0:10–0:18** — P-only controller: drone oscillates around the setpoint — spring-like behaviour. Too much Kp → diverging oscillations. Just right Kp → steady oscillation. Caption: "P only → oscillation."

**0:18–0:27** — PD controller: the derivative term damps the oscillations. The drone approaches the setpoint without overshoot. Caption: "D term: damping — like a shock absorber." But with a constant wind disturbance, the drone settles below target (steady-state error). Caption: "Steady-state error remains without I."

**0:27–0:36** — Full PID: the integral term accumulates the error and drives it to zero. The drone now settles at exactly 10 m. Plot shows: altitude vs. time — P (oscillates), PD (overshoots, settles with offset), PID (clean approach, zero steady-state error). Caption: "PID: zero steady-state error."

**0:36–0:45** — PID parameter tuning: K_P, K_I, K_D sliders adjusted. Effects: Kp too high → instability. Ki too high → windup. Kd too high → noise amplification. Good balance shown. Bold text: "PID — 95% of industrial control systems." Fade to black.

## Physics Concept Teased
PID controller: proportional-integral-derivative feedback control. The P term provides restoring force proportional to error; I term eliminates steady-state error by accumulating error over time; D term provides damping by opposing the rate of change. Together they achieve fast, stable, zero-offset tracking.

## On-Screen Text / Captions
- **0:00** — "Drone. Wind disturbance. No control — chaos."
- **0:05** — "u = K_P·e + K_I·∫e dt + K_D·de/dt"
- **0:12** — "P only: oscillation around setpoint"
- **0:20** — "D adds damping; no I → steady-state error"
- **0:28** — "PID: zero steady-state error, stable"
- **0:35** — "K_P↑: fast. K_I↑: eliminate offset. K_D↑: damp."
- **0:43** — "PID — 95% of industrial controllers."

## End Card
Final 3 seconds: drone rock-steady at 10 m altitude in spite of simulated wind gusts. Text: "The same PID controls your heating system, cruise control, and industrial robots." CodedLaws logo.

## Audio
Clean, steady electronic (85 BPM). Wind sound for the disturbance. "Chaos" phase: irregular music. PID activated: music becomes steady and controlled. Voiceover at 0:00: "Three numbers — proportional, integral, derivative — and a drone can fly itself steady in any wind." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: discrete PID: e[n] = target - altitude[n]; integral += e[n]·dt; derivative = (e[n]-e[n-1])/dt; u = Kp·e + Ki·integral + Kd·derivative; altitude += (u - gravity + wind_noise)·dt². Anti-windup: clamp integral when control saturates. Animate drone y-position on canvas. Plot altitude vs time as a scrolling graph. Implement sliders for Kp, Ki, Kd with real-time update. Runtime: real-time Canvas 2D, trivially fast.
