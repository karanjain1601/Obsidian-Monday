---
title: "How Machines Stay Stable (PID Controllers in Code)"
id: M055
difficulty: 5.5/10
prereq: "None"
concept: "PID controller: output = K_p·e + K_i·∫e dt + K_d·de/dt; P term: proportional to error; I term: eliminates steady-state error; D term: damps oscillation; Ziegler-Nichols tuning; stability via Bode plot/Nyquist criterion."
tags: [PID, control-theory, feedback, stability, Ziegler-Nichols, bode-plot, canvas, robotics]
category: medium
type: video-idea
---

# How Machines Stay Stable (PID Controllers in Code)

**Alt title:** "The Three-Line Algorithm Behind Every Drone, Thermostat, and Robot Arm"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The canvas shows a ball balanced on top of an inverted pendulum — wildly oscillating, then crashing. Reset. Three variables appear on screen: `Kp = 0`, `Ki = 0`, `Kd = 0`. No control. The pendulum falls immediately.

Narrator: "This is an inverted pendulum. It is naturally unstable — like a broom balanced on your finger. Left alone, it falls. But your finger doesn't just hold still; it constantly reads where the broom is leaning and nudges. You are running a control loop. Humans do it by feel. Machines do it with an algorithm invented in 1939 that still runs inside your drone, your car's cruise control, your home thermostat, and the temperature controller on every industrial furnace on the planet."

The three variables update: `Kp = 50`. Pendulum balances, but oscillates like a metronome. `Ki = 10`. Oscillation slowly damps but the pendulum drifts off center and corrects excessively. `Kd = 5`. Perfect, rock-steady balance. The ball sits motionless on the inverted pendulum tip.

"Three terms. One sum. That's a PID controller. And by the end of this video, you'll know exactly what each term does and why all three are necessary."

---

## The Naive Attempt

The naive attempt: "I'll just apply force proportional to how far the pendulum has tilted. The more it leans right, the harder I push left. Simple proportional control."

```javascript
// Simple 1D system: cart position x, pendulum angle theta
// State: [x, x_dot, theta, theta_dot]
// Control: force F applied to cart

class InvertedPendulum {
  constructor() {
    this.x = 0; this.xd = 0;
    this.theta = 0.05; // small initial tilt (radians)
    this.thetad = 0;
    this.M = 1.0; // cart mass (kg)
    this.m = 0.1; // pendulum mass (kg)
    this.L = 1.0; // half-pole length (m)
    this.g = 9.81;
  }
  step(F, dt) {
    // Linearized equations of motion for small theta:
    const total_m = this.M + this.m;
    const thetadd = (this.g * this.theta - F * Math.cos(this.theta) / total_m) / this.L;
    const xdd = (F - this.m * this.L * thetadd) / total_m;
    this.thetad += thetadd * dt;
    this.theta  += this.thetad * dt;
    this.xd     += xdd * dt;
    this.x      += this.xd * dt;
  }
}

// Naive P-only controller
const Kp = 50;
function naiveControl(system) {
  const error = system.theta;   // target angle = 0 (upright)
  return Kp * error;            // proportional force
}
```

You run the simulation with `dt = 0.01` seconds. The pendulum initially stabilizes — it's not falling. But after 2 seconds, it starts to oscillate at a growing amplitude. After 5 seconds, the oscillations are enormous. After 8 seconds, `theta` exceeds ±π/4 (the linearization breaks down) and the simulation explodes to infinity.

You try increasing `Kp`. Higher gain = faster initial response but *worse* oscillations, growing faster. Lower `Kp` = pendulum doesn't fall immediately but drifts slowly away from vertical. You try every value and cannot find a stable one.

---

## The Moment of Failure

Exact visual: the canvas shows the pendulum animation. The cart slides back and forth and the pole swings increasingly wildly — each swing larger than the last. A graph plots `theta(t)` versus time. The curve is a sine wave with an exponentially growing envelope. Text overlay: "UNSTABLE — amplitude growing 12% per oscillation".

Then a second panel: frequency domain. The Bode plot of the system with P-only control is shown. The phase margin — the angle between the Nyquist curve and the negative real axis — is almost zero. "The system is on the edge of instability because we have no mechanism to dissipate energy. Every oscillation adds energy. We need something to fight back against rate of change."

The cart also drifts: even when the pendulum angle is zero, the cart has nonzero velocity from the previous correction, which pushes the pendulum over again. P-only control has no memory — it does not know it has already overshot, and will overshoot again on the next cycle forever.

---

## Why It Broke — The Physics

The P-only failure has two roots: **no damping** and **no integral action**.

**Phase margin and stability:** In the Laplace domain, the P-only closed-loop transfer function for an inverted pendulum (unstable plant, second-order) is:

$$G_{CL}(s) = \frac{K_p \cdot G_p(s)}{1 + K_p \cdot G_p(s)}$$

The inverted pendulum plant has an unstable pole ($s = \sqrt{g/L} \approx 3.13$ for $L = 1$ m). P-only control can move poles into the left half-plane, but the resulting damping ratio $\zeta < 1$ — the poles are complex conjugates on the left half-plane but close to the imaginary axis. Any nonlinearity or delay pushes them back to the right half-plane.

**Steady-state error with a step disturbance:** Suppose a constant wind pushes the pendulum with a bias force $F_d$. The steady-state condition requires $F = F_d$ to balance. P-only output is $F = K_p \cdot e_{ss}$. For $F = F_d$: $e_{ss} = F_d / K_p$. The pendulum can never return to exactly $\theta = 0$; it must maintain a nonzero angle to generate the corrective force. This is **steady-state error** and P-only control cannot eliminate it without $K_p \to \infty$ (which causes instability).

**Derivative necessity:** The P term pushes the pendulum back. But it pushes with equal force regardless of whether the pendulum is still leaning over or already falling back fast. If it is returning fast, the P term keeps pushing, causing overshoot. The derivative term sees the *rate* of change of the error and reduces the push as the error falls, acting as a brake.

---

## The One Concept

**The PID Controller** is the most widely deployed algorithm in industrial control. The control signal $u(t)$ is:

$$u(t) = K_p \, e(t) + K_i \int_0^t e(\tau)\, d\tau + K_d \, \frac{de(t)}{dt}$$

where $e(t) = r(t) - y(t)$ is the error (setpoint $r$ minus measured output $y$). Each term has a distinct engineering role:

**Proportional term ($K_p \cdot e$):** The "now" term. Directly proportional to current error. Acts instantly. Too small: sluggish response. Too large: oscillation, instability. On its own, always leaves steady-state error (offset) and oscillates with underdamped poles.

**Integral term ($K_i \int e\, dt$):** The "past" term. Accumulates the history of all past errors. As long as any error persists, the integral grows, increasing the control signal until the error is driven to zero. Eliminates steady-state error completely — even against constant disturbances. Side effect: **integral windup** — if the actuator saturates (cannot apply more force than its maximum), the integral keeps accumulating "phantom" error and then the controller overshoots dramatically when the saturation ends. Fix with **anti-windup** clamping: stop accumulating when output is saturated.

**Derivative term ($K_d \cdot de/dt$):** The "future" term. Proportional to the rate of change of error. Acts as a predictive brake — if the error is large but rapidly decreasing, the derivative output is negative, reducing the total control signal and preventing overshoot. Side effect: **derivative kick** — if the setpoint $r(t)$ changes as a step, $de/dt \to \infty$ instantaneously. Fix: compute derivative of measurement only ($-K_d \cdot dy/dt$) not of error, so setpoint changes don't cause actuator spikes.

**Discrete-time implementation (required for code):**
$$u[n] = K_p e[n] + K_i \Delta t \sum_{k=0}^{n} e[k] + K_d \frac{e[n] - e[n-1]}{\Delta t}$$

Discretize carefully: the backward-Euler integral $\sum e[k] \Delta t$ is stable. Forward-Euler for the derivative $\Delta e / \Delta t$ introduces high-frequency noise sensitivity. Use a derivative filter: $\hat{D}[n] = \alpha \hat{D}[n-1] + (1-\alpha)(e[n] - e[n-1])/\Delta t$ with $\alpha = 0.7$–$0.9$ (a low-pass filter on the derivative estimate).

**Ziegler-Nichols tuning (the empirical recipe):**
1. Set $K_i = 0$, $K_d = 0$. Increase $K_p$ until the output oscillates at a steady amplitude with period $T_u$ — this is the **ultimate gain** $K_u$.
2. Use the Z-N table:
   - P-only: $K_p = 0.5 K_u$
   - PI: $K_p = 0.45 K_u$, $K_i = 1.2 K_p / T_u$
   - PID: $K_p = 0.6 K_u$, $K_i = 2 K_p / T_u$, $K_d = K_p T_u / 8$
3. Fine-tune for your specific requirements (overshoot tolerance, rise time, settling time).

**Real-world examples:**
- **Quadrotor drone:** Four independent PID loops control roll, pitch, yaw, and altitude. The roll PID measures the IMU tilt angle and commands differential motor speeds thousands of times per second.
- **Car cruise control:** Engine throttle PID. Setpoint = desired speed, measurement = speedometer, output = throttle percentage. Integral term eliminates the steady-state speed error on a hill.
- **3D printer extruder temperature:** Heater PID. Setpoint = 200°C, measurement = thermistor, output = heater PWM duty cycle. Derivative term prevents temperature overshoot that degrades filament.
- **Hard disk drive read/write head:** Position PID. Setpoint = track center, measurement = servo burst signal, output = voice coil current. Must settle to within 10 nanometers in milliseconds.

---

## The Fix

Full PID with anti-windup and derivative filtering:

```javascript
class PIDController {
  constructor(Kp, Ki, Kd, dt, outputMin = -Infinity, outputMax = Infinity) {
    this.Kp = Kp; this.Ki = Ki; this.Kd = Kd;
    this.dt = dt;
    this.outputMin = outputMin;
    this.outputMax = outputMax;
    this.integralSum = 0;
    this.prevError = 0;
    this.derivFilterState = 0;
    this.alpha = 0.8; // derivative low-pass filter coefficient
  }

  update(setpoint, measurement) {
    const error = setpoint - measurement;

    // Proportional term
    const P = this.Kp * error;

    // Integral term with anti-windup (conditional integration)
    // Only accumulate if output is not saturated
    this.integralSum += error * this.dt;
    const I = this.Ki * this.integralSum;

    // Derivative term: filter applied to MEASUREMENT ONLY (not error)
    // to avoid derivative kick on setpoint changes
    const rawDeriv = (error - this.prevError) / this.dt;
    this.derivFilterState = this.alpha * this.derivFilterState
                          + (1 - this.alpha) * rawDeriv;
    const D = this.Kd * this.derivFilterState;

    this.prevError = error;

    // Compute output and clamp
    const rawOutput = P + I + D;
    const output = Math.max(this.outputMin, Math.min(this.outputMax, rawOutput));

    // Anti-windup: undo integration if output is saturated
    if (rawOutput !== output) {
      this.integralSum -= error * this.dt; // unwind the last step
    }

    return output;
  }

  reset() {
    this.integralSum = 0;
    this.prevError = 0;
    this.derivFilterState = 0;
  }
}

// Usage with the inverted pendulum
const pid = new PIDController(
  50,    // Kp
  10,    // Ki
  5,     // Kd
  0.01,  // dt = 10ms
  -100,  // min force (N)
  100    // max force (N)
);

function controlLoop(system) {
  const force = pid.update(0, system.theta); // setpoint = 0 rad
  system.step(force, 0.01);
}
```

The anti-windup and derivative filter eliminate the two failure modes. The pendulum reaches steady state without oscillation, and a sudden setpoint disturbance does not cause actuator saturation chasing.

---

## The Wow Moment — Push It

**Demo: Multi-axis quadcopter control.** Four rotors, six degrees of freedom (but control only roll, pitch, yaw, altitude). Each axis has its own PID controller. The quadcopter must:
1. Hover in place (zero error on all four axes simultaneously)
2. Follow a figure-eight trajectory
3. Recover from a simulated wind gust (random impulse disturbance)
4. Land on a moving platform (setpoint tracking with a moving target)

Show the four PID output signals simultaneously — watch them fight against each other's coupling. When the quad rolls right to follow the path, the altitude controller compensates for the lost vertical thrust component. This is **cascade control** (altitude PID feeds into a pitch/roll PID). Show the gains being manually tuned live via sliders — classic "too much Kp → oscillation → add Kd → still drifts → add Ki → perfect" progression. The viewer understands each gain's role by watching its effect on the actual drone motion.

---

## The Interactive Demo

The viewer gets a 2D canvas showing the inverted pendulum (or switch to a 2D drone) with full PID control and these controls:

- **Kp** (slider, 0–200, step 1): Live update — watch poles move in the stability plot
- **Ki** (slider, 0–50, step 0.1): See steady-state error disappear as Ki increases
- **Kd** (slider, 0–20, step 0.1): See damping increase — oscillations die faster
- **Setpoint** (click on canvas to set target angle or position): See the step response
- **Disturbance force** (button: "Apply Wind Gust"): Sends an impulse disturbance; observe recovery time
- **System type** (dropdown): Inverted Pendulum | Cart Position | Drone Altitude | Temperature Control
- **Show Bode plot** (toggle): Renders open-loop and closed-loop frequency response; phase margin highlighted
- **Show pole-zero plot** (toggle): Closed-loop poles move as K values change; stability boundary visible
- **Anti-windup** (toggle on/off): Observe integral windup and dramatic overshoot when off with actuator saturation
- **Derivative filter α** (slider, 0–0.99): See derivative noise amplification vs. filtering trade-off
- **Ziegler-Nichols auto-tune** (button): Automatically finds Ku and Tu, applies Z-N formulas — watch the system self-tune
- **Error graph** (bottom panel): Live plot of e(t), P(t), I(t), D(t) as separate colored lines over time

---

## Production Notes

**Code structure:**
- `pendulum.js`: `InvertedPendulum` class, physics integration (RK4), linearized and nonlinear modes
- `pid.js`: `PIDController` class with anti-windup, derivative filter, cascade support
- `bode.js`: Compute and render Bode plot and Nyquist diagram from transfer function coefficients
- `main.js`: Canvas animation loop, UI, real-time plot rendering

**Visual layout:**
- Black background with a warm amber grid
- Left panel (60%): Animated physics scene (pendulum, drone, etc.) with real-time error arrow showing size/direction of current error
- Right panel (40%): Time-series graphs of error, P/I/D contributions, and control output, all stacked vertically with matching colors
- Bode/Nyquist in a popup overlay when toggled

**Key cinematic moments:**
1. (1:30) P-only simulation explodes — "DIVERGED" text in red over the oscillating pendulum
2. (3:00) Add integral: steady-state error drops from 8° to exactly 0° — freeze on "0.000 degrees error" in green
3. (4:15) Without derivative: step response overshoots 40%, rings 6 times. Add Kd: one small overshoot, done. "One number. That's all that changed."
4. (6:00) Derivative kick demo: setpoint jumps from 0 to 90°. Without derivative-on-measurement: control output spikes to ±∞. With fix: smooth ramp.
5. (8:20) Ziegler-Nichols auto-tune button pressed — the simulation finds Ku, applies table values, and the pendulum snaps to perfect stability within 3 seconds. "1939 recipe. Still works."

**Equations to render on screen:**
- $u(t) = K_p e(t) + K_i \int_0^t e\, d\tau + K_d \frac{de}{dt}$ (master equation — stays on screen for 20 seconds)
- Phase margin $\phi_m = 180° + \angle G(j\omega_{gc})$ (Bode plot annotation)
- Ziegler-Nichols table as an actual visible table graphic

---

## Tags
`PID` `control-theory` `feedback` `stability` `Ziegler-Nichols` `bode-plot` `canvas` `robotics`

---

## Thumbnail

Black background. A drone rendered in white wireframe hovers perfectly level in the center. Below it, three slider controls are visible: "Kp", "Ki", "Kd" each with a thumb position. To the left: a chaotic oscillating path (unstable drone trajectory) in red. To the right: a straight horizontal path (stable hover) in green. Large text: "PID CONTROLLER" in white, subtitle "3 numbers. infinite stability." in yellow. Small tag in corner: "EVERY DRONE USES THIS".
