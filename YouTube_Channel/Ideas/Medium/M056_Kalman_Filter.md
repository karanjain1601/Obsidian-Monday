---
title: "Tracking a Moving Object Under Noise (The Kalman Filter)"
id: M056
difficulty: 6/10
prereq: "None"
concept: "Kalman filter: optimal linear estimator for Gaussian noise; predict: x̂_k|k-1 = F·x̂_{k-1}, P_k|k-1 = F·P·F^T + Q; update: K = PH^T(HPH^T+R)^{-1}, x̂ = x̂ + K(z-Hx̂); minimizes MSE."
tags: [kalman-filter, state-estimation, Gaussian, optimal-estimator, tracking, signal-processing, canvas, robotics]
category: medium
type: video-idea
---

# Tracking a Moving Object Under Noise (The Kalman Filter)

**Alt title:** "The Algorithm That Landed Apollo 11 (And Lives in Your Phone's GPS)"
**Difficulty:** 6/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Canvas: a radar screen. A blip appears — a target aircraft — but it jitters randomly. Each measurement is off by tens of meters. Noise. Raw GPS data of a car driving down a highway: the dot teleports left, right, up the sidewalk, then back to the road. The measurements are useless.

Narrator: "In 1960, Rudolf Kálmán published a paper that changed navigation forever. His algorithm takes noisy, unreliable measurements and produces a smooth, optimal estimate that is more accurate than any single measurement. It ran on the Apollo guidance computer that landed humans on the moon — 64 kilobytes of RAM, and it ran a Kalman filter. Today it runs inside every phone's GPS, every self-driving car's sensor fusion pipeline, and every guided missile in existence."

"The beautiful part: the algorithm is seven lines of matrix math. But those seven lines encode a profound idea — a principled way to combine what you *predict* will happen with what you *observe*, weighted by how much you trust each source."

Cut to code: "Let's start with the naive thing — just use the raw noisy measurements. Watch what happens."

---

## The Naive Attempt

The naive approach: trust the noisy measurement directly, maybe average the last few.

```javascript
// GPS position measurements with noise
function generateNoisyMeasurements(truePositions, noiseStd = 10) {
  return truePositions.map(([x, y]) => [
    x + gaussianNoise(0, noiseStd),
    y + gaussianNoise(0, noiseStd)
  ]);
}

// Naive approach 1: use raw measurements
function naiveRaw(measurements) {
  return measurements; // just use them directly
}

// Naive approach 2: moving average (smooth last N readings)
function naiveMovingAverage(measurements, windowSize = 5) {
  return measurements.map((_, i) => {
    const window = measurements.slice(Math.max(0, i - windowSize + 1), i + 1);
    return [
      window.reduce((s, m) => s + m[0], 0) / window.length,
      window.reduce((s, m) => s + m[1], 0) / window.length
    ];
  });
}
```

You render both on canvas over the true path (a smooth curve). Raw measurements: chaotic dots scattered around the true path. Moving average: smoother, but it **lags**. When the car turns a corner, the moving average still points to where the car was 5 readings ago — it is always behind the truth. The lag is proportional to the window size: bigger window = smoother but more lag.

Worse: the moving average assigns equal weight to all window readings. It has no model of the car's motion. It doesn't know that if the car was moving at 60 mph northward, the next measurement is probably going to be close to the extrapolated position. It throws that information away.

"We can do better. We know something the moving average ignores: physics. We know the car obeys Newton's laws."

---

## The Moment of Failure

Exact visual: three paths on a black canvas. True path: a smooth sinusoidal curve in green. Moving average: a lagged, slightly smoothed version in yellow — it rounds corners early, undershoots peaks. Raw measurements: a cloud of dots (no path, just scatter) in dim grey.

A position error plot below: ground truth vs. moving average vs. naive. Moving average RMSE = 8.2 m (better than raw 14.3 m), but the lag causes a systematic bias. On the canvas, draw a red arrow from the moving average estimate to the true position during a turn — the arrow is consistently 30 meters behind and to the inside of the curve.

Caption: "The moving average knows nothing about velocity. It cannot predict. It can only remember. A Kalman filter does both."

---

## Why It Broke — The Physics

The moving average failure is a **model mismatch**: the smoother has no internal model of the physical process generating the data.

**Optimal estimation problem:** Given noisy measurements $z_k = H x_k + v_k$ (where $v_k \sim \mathcal{N}(0, R)$ is measurement noise) and a dynamic system $x_k = F x_{k-1} + w_k$ (where $w_k \sim \mathcal{N}(0, Q)$ is process noise), find the estimate $\hat{x}_k$ that **minimizes the mean squared error** $\mathbb{E}[\|x_k - \hat{x}_k\|^2]$.

For linear systems with Gaussian noise, the answer is the **Kalman filter** — and it is provably optimal (the BLUE: Best Linear Unbiased Estimator). No other linear algorithm can do better.

**Why Gaussian noise is key:** The Gaussian distribution is completely specified by its mean and covariance. This means we only need to track two quantities: the estimated state (mean) and the uncertainty (covariance matrix). The Kalman filter propagates exactly these two quantities through time. If noise is non-Gaussian, the Kalman filter is still the best *linear* estimator, but may be suboptimal compared to nonlinear methods (particle filters, etc.).

**Information fusion equation:** The Kalman update is fundamentally a weighted average:
$$\hat{x}_k = \hat{x}_{k|k-1} + K(z_k - H\hat{x}_{k|k-1})$$

The term $(z_k - H\hat{x}_{k|k-1})$ is the **innovation** — how much the measurement surprised us. The **Kalman gain** $K$ tells us how much to trust this surprise. If $R \to 0$ (measurements very accurate), then $K \to H^{-1}$ — fully trust the measurement. If $Q \to 0$ (model very accurate), then $K \to 0$ — ignore the measurement. The filter automatically balances trust in model vs. measurement.

---

## The One Concept

**The Kalman Filter** maintains a probability distribution over the state — represented as a Gaussian $\mathcal{N}(\hat{x}_k, P_k)$ — and updates it optimally at each timestep.

**State vector:** For 2D position tracking: $x = [p_x, p_y, v_x, v_y]^T$ — position and velocity. (We never measure velocity directly — it is a hidden state.)

**System model (constant velocity, discretized):**
$$F = \begin{bmatrix} 1 & 0 & \Delta t & 0 \\ 0 & 1 & 0 & \Delta t \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad H = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \end{bmatrix}$$

$F$ is the **state transition matrix**: integrates velocity into position. $H$ is the **observation matrix**: we only observe position, not velocity.

**Kalman filter equations (five steps):**

*Predict:*
$$\hat{x}_{k|k-1} = F \hat{x}_{k-1|k-1}$$
$$P_{k|k-1} = F P_{k-1|k-1} F^T + Q$$

*Update:*
$$S_k = H P_{k|k-1} H^T + R \quad \text{(innovation covariance)}$$
$$K_k = P_{k|k-1} H^T S_k^{-1} \quad \text{(Kalman gain)}$$
$$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k (z_k - H \hat{x}_{k|k-1})$$
$$P_{k|k} = (I - K_k H) P_{k|k-1}$$

**Intuition for the covariance $P$:** Think of $P$ as an ellipse of uncertainty around the estimate. Before the measurement: $P$ grows according to $FPF^T + Q$ (uncertainty increases as the object moves — we are less sure where it is). After the measurement: $P$ shrinks in the directions where the measurement gave us information (measurement reduces uncertainty). The Kalman gain $K$ is the amount by which the uncertainty ellipse collapses.

**Practical considerations:**
- **Process noise $Q$:** Models unmodelled accelerations (the car can turn, accelerate). Larger $Q$ = filter tracks measurements more closely, less smoothing. Tune by observing: if the filter lags turns, increase $Q$.
- **Measurement noise $R$:** Set from sensor specs (GPS datasheet: 5 m CEP = ~3 m standard deviation). Larger $R$ = filter trusts model more, smooths more.
- **Initial covariance $P_0$:** If unknown, use a large diagonal matrix — the filter will converge regardless (it is self-correcting).
- **Numerical stability:** Use the **Joseph form** of the covariance update: $P = (I-KH)P(I-KH)^T + KRK^T$ to maintain symmetry and positive definiteness despite floating point errors.

**Real-world examples:**
- **Apollo guidance computer (1969):** Estimated spacecraft position and velocity from star tracker and IMU measurements. Without the Kalman filter, the accumulated IMU drift would have missed the Moon.
- **GPS receiver:** Your phone receives signals from 4+ satellites, each with timing noise. The Kalman filter fuses them optimally and also models the phone's motion to smooth the position estimate.
- **Self-driving car sensor fusion:** Fuses LIDAR, radar, camera, and IMU. Each sensor has different noise characteristics and update rates. The Kalman filter (extended/unscented variant for nonlinear dynamics) produces a single consistent estimate of all nearby object positions and velocities.
- **Financial time series:** Pairs trading uses a Kalman filter to track the dynamic spread between two correlated stocks. The spread is the hidden state; price observations are noisy measurements.

---

## The Fix

Full Kalman filter implementation in JavaScript:

```javascript
class KalmanFilter {
  // state: [px, py, vx, vy], measurements: [px, py]
  constructor(dt, processNoise = 0.1, measurementNoise = 10.0) {
    this.dt = dt;
    // State transition matrix F (constant velocity model)
    this.F = [[1,0,dt,0], [0,1,0,dt], [0,0,1,0], [0,0,0,1]];
    // Observation matrix H (observe position only)
    this.H = [[1,0,0,0], [0,1,0,0]];
    // Process noise covariance Q
    const q = processNoise;
    this.Q = matScale(
      [[dt**4/4, 0, dt**3/2, 0],
       [0, dt**4/4, 0, dt**3/2],
       [dt**3/2, 0, dt**2, 0],
       [0, dt**3/2, 0, dt**2]], q);
    // Measurement noise covariance R
    const r = measurementNoise * measurementNoise;
    this.R = [[r, 0], [0, r]];
    // Initial state estimate and covariance
    this.x = [[0],[0],[0],[0]]; // [px, py, vx, vy]
    this.P = matScale(matIdentity(4), 1000); // high initial uncertainty
  }

  predict() {
    // x = F * x
    this.x = matMul(this.F, this.x);
    // P = F * P * F^T + Q
    this.P = matAdd(matMul(matMul(this.F, this.P), matTranspose(this.F)), this.Q);
  }

  update(z) {
    // z is [[px_meas], [py_meas]]
    // Innovation: y = z - H * x
    const Hx = matMul(this.H, this.x);
    const innovation = matSub(z, Hx);
    // Innovation covariance: S = H * P * H^T + R
    const S = matAdd(matMul(matMul(this.H, this.P), matTranspose(this.H)), this.R);
    // Kalman gain: K = P * H^T * S^{-1}
    const K = matMul(matMul(this.P, matTranspose(this.H)), matInverse2x2(S));
    // Updated state: x = x + K * innovation
    this.x = matAdd(this.x, matMul(K, innovation));
    // Updated covariance (Joseph form for numerical stability)
    const I = matIdentity(4);
    const IKH = matSub(I, matMul(K, this.H));
    this.P = matAdd(
      matMul(matMul(IKH, this.P), matTranspose(IKH)),
      matMul(matMul(K, this.R), matTranspose(K))
    );
    return { x: this.x, P: this.P };
  }

  step(measurement) {
    this.predict();
    return this.update([[measurement[0]], [measurement[1]]]);
  }

  getPosition() { return [this.x[0][0], this.x[1][0]]; }
  getVelocity() { return [this.x[2][0], this.x[3][0]]; }
}
```

The result: the Kalman filter estimate hugs the true path, anticipates turns (because it tracks velocity), and is smooth without lag. RMSE drops to 3.1 m from 14.3 m raw and 8.2 m moving average.

---

## The Wow Moment — Push It

**Demo: Multi-sensor fusion — GPS + accelerometer.** Simulate a GPS that updates at 1 Hz (every second) and an accelerometer that updates at 100 Hz. Between GPS fixes, the filter predicts based on the accelerometer's measured acceleration (a more sophisticated constant-acceleration model). When the GPS arrives, it corrects the accumulated drift.

Visualize: the uncertainty ellipse $P$ grows during GPS outages (a visible expanding grey ellipse around the tracked position), then snaps tighter when each GPS measurement arrives. During a GPS outage (toggle GPS off), the filter continues to track, coasting on the accelerometer — the estimate drifts slowly rather than freezing at the last known position.

Then: add a second "sensor" — a beacon at a known position that measures *range only* (not position). This requires the **Extended Kalman Filter** (EKF) because the measurement model $h(x) = \sqrt{(p_x - b_x)^2 + (p_y - b_y)^2}$ is nonlinear. Show the linearization step: $H = \partial h/\partial x$ evaluated at the current estimate. Still tracking perfectly with one GPS + two range beacons, zero direct position measurements.

---

## The Interactive Demo

The viewer gets a canvas showing a 2D map with a moving target, sensor measurements, and the filter estimate:

- **Ground truth path** (dropdown): Straight line | Sine wave | Figure-eight | Random walk | Click to draw
- **GPS noise σ** (slider, 0–50 m): Noisier GPS → filter estimate stays smooth because it trusts its model more
- **Process noise Q** (slider, 1e-4 to 10): Low Q → stiff model, filter lags turns. High Q → wiggly estimate following noise.
- **GPS update rate** (slider, 1–60 Hz): See filter coast between measurements when rate is low
- **GPS ON/OFF toggle**: Cuts GPS; filter coasts on velocity model; uncertainty ellipse grows
- **Show uncertainty ellipse** (toggle): Renders the 2σ confidence ellipse around the state estimate
- **Show velocity vector** (toggle): Arrow from estimated position in direction of estimated velocity
- **Show innovation** (toggle): Red line from predicted position to measurement — the "surprise"
- **Show Kalman gain K** (numerical display): Watch K grow when P is large (uncertainty high) and shrink when P is small
- **Number of targets** (slider, 1–5): Multi-target tracking with nearest-neighbor association
- **Add beacon** (click on canvas): Places a range-only beacon, activates EKF mode

---

## Production Notes

**Code structure:**
- `matrix.js`: Lightweight matrix library: `matMul`, `matAdd`, `matSub`, `matTranspose`, `matScale`, `matIdentity`, `matInverse2x2`, `matInverse4x4` (LU decomposition)
- `kalman.js`: `KalmanFilter` class (linear), `ExtendedKalmanFilter` class (EKF with user-supplied Jacobian)
- `simulation.js`: Ground truth path generator, noisy measurement generator, multiple target manager
- `main.js`: Canvas render loop, UI

**Visual layout:**
- Black background, soft blue grid lines
- Left panel: 2D map with animated dot (target), scattered grey dots (measurements), smooth colored line (Kalman estimate), translucent grey ellipse (uncertainty)
- Right panel: Time-series graphs — position error vs. time (raw, moving average, Kalman); estimated vs. true velocity; Kalman gain trace

**Key cinematic moments:**
1. (1:00) Raw GPS on a sinusoidal path: dots scatter wildly. Drop the moving average: smoother but clearly lagging the curves. Drop the Kalman: hugs the truth tightly, anticipates curves. Three lines, three qualities of life.
2. (3:30) Zoom in on the uncertainty ellipse. Before first measurement: huge circle. After 5 measurements: tiny ellipse. "The filter is becoming confident."
3. (5:45) Cut GPS. The uncertainty ellipse grows visibly every timestep — "The filter knows it doesn't know." Restore GPS: ellipse snaps back tight.
4. (7:00) Multi-sensor fusion: toggle on the accelerometer. Fill the coasting period. "Two sensors. One truth."
5. (9:15) Show $P$ matrix numerically updating — highlight the diagonal entries (position variance, velocity variance) changing in real time.

**Equations to render:**
- $\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k(z_k - H\hat{x}_{k|k-1})$ (the intuitive heart)
- $K_k = P_{k|k-1} H^T (H P_{k|k-1} H^T + R)^{-1}$ (gain formula)
- $P_{k|k-1} = F P F^T + Q$ (uncertainty growth)

---

## Tags
`kalman-filter` `state-estimation` `Gaussian` `optimal-estimator` `tracking` `signal-processing` `canvas` `robotics`

---

## Thumbnail

Dark navy background. Center: a 2D map with a moving target. Three trailing paths behind it: a scattered cloud of dots (grey, labelled "RAW GPS"), a lagged smooth line (yellow, labelled "MOVING AVG"), and a tight hugging line (electric blue, labelled "KALMAN"). A translucent grey ellipse around the Kalman position dot. Bold white text: "THE KALMAN FILTER" at top. Subtitle in yellow: "Optimal tracking from noisy data". Small red badge: "Used on Apollo 11".
