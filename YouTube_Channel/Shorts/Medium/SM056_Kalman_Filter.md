---
title: "Kalman Filter — Tracking a Noisy Trajectory"
id: SM056
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, control-theory, kalman-filter, estimation, tracking, signal-processing]
---

> **What it is:** A ~45-second simulation short where a blue Kalman filter estimate threads confidently through a cloud of scattered white measurement noise, shrinking its uncertainty ellipse with each update and balancing model versus sensor trust via the Kalman gain — the same algorithm that guided Apollo to the Moon. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Kalman Filter — Tracking a Noisy Trajectory

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A red dot drifts across a dark canvas in a smooth arc — the true trajectory. A cloud of noisy measurement dots (white, scattered) surrounds it. Then a blue dot appears, following along confidently — threading through the noise, tracking the true path almost perfectly.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Kalman filter steps: (1) Predict: x̂_k|k-1 = F·x̂_{k-1}, P_k|k-1 = F·P·Fᵀ + Q. (2) Update: K_k = P·Hᵀ/(H·P·Hᵀ + R); x̂_k = x̂ + K(z_k - H·x̂); P_k = (I-KH)P. Caption: "Predict from physics. Update from measurement. Repeat." The state estimate (position + velocity) and uncertainty ellipse shown.

**0:10–0:18** — The uncertainty ellipse: a growing oval around the predicted position (blue ellipse) that shrinks when a measurement arrives. Caption: "Large ellipse = uncertain. After measurement: shrinks." The Kalman gain K balances model vs measurement trust.

**0:18–0:27** — Kalman gain animation: R (measurement noise) slider. When R is large (noisy sensors), K is small — trust the model more. When R is small (accurate sensors), K is large — trust the measurement more. Caption: "K = balance between model and sensor."

**0:27–0:36** — Non-linear example: Extended Kalman Filter (EKF). A ball thrown at an angle — non-linear trajectory (parabola). EKF linearises around the current estimate using the Jacobian. Radar measurements (range, angle) — non-linear observation model. EKF tracks the parabola accurately. Caption: "EKF: linearise at each step."

**0:36–0:45** — Application montage: Apollo lunar module navigation (Kalman filter used by NASA 1969), self-driving car pose estimation, satellite orbit determination, phone GPS+IMU fusion. Bold text: "Kalman filter — the algorithm that went to the moon." Fade to black.

## Physics Concept Teased
Kalman filter: optimal linear estimator for systems with Gaussian noise. The two-step predict-update loop propagates the state estimate and its uncertainty covariance through the dynamic model (predict) then corrects with noisy measurements (update). The Kalman gain optimally weights model vs. measurement based on their relative uncertainties.

## On-Screen Text / Captions
- **0:00** — "Noisy measurements. True trajectory unknown."
- **0:05** — "Predict: x̂ = Fx̂; Update: x̂ += K(z - Hx̂)"
- **0:12** — "Uncertainty ellipse: grows on predict, shrinks on update"
- **0:20** — "K balances model trust vs. sensor trust"
- **0:28** — "EKF: non-linear systems — Jacobian linearisation"
- **0:35** — "Apollo 1969: Kalman filter flew to the moon"
- **0:43** — "Kalman filter — optimal estimation."

## End Card
Final 3 seconds: the Kalman filter tracking a perfect smooth trajectory through a cloud of noise. Text: "Rudolf Kálmán, 1960 — published in one of the most cited engineering papers ever." CodedLaws logo.

## Audio
Smooth, precise electronic (80 BPM). Ping sound each time a measurement arrives and the filter updates. The uncertainty ellipse shrinking = satisfying click. Voiceover at 0:00: "Combine a physics model with noisy measurements optimally — that's the Kalman filter, and it went to the moon." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: 2D constant-velocity Kalman filter. State: [x, y, vx, vy]. F = [[1,0,dt,0],[0,1,0,dt],[0,0,1,0],[0,0,0,1]]. H = [[1,0,0,0],[0,1,0,0]]. Q = process noise (model uncertainty). R = measurement noise. Simulate true trajectory + add Gaussian noise for measurements. Draw: true path (red), noisy measurements (white dots), Kalman estimate (blue), uncertainty ellipse (drawn as an ellipse from P covariance matrix). EKF: define f(x) and h(x) non-linear; compute Jacobians F=∂f/∂x, H=∂h/∂x analytically. Runtime: real-time, trivially fast.
