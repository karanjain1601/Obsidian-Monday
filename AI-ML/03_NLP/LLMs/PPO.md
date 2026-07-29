---
title: PPO (Proximal Policy Optimization)
aliases:
  - PPO
  - Proximal Policy Optimization
  - Clipped Surrogate Objective
tags:
  - llm
  - rlhf
  - reinforcement-learning
  - alignment
  - policy-gradient
domain: AI-ML
difficulty: Advanced
created: 2026-07-28
related:
  - RLHF
  - DPO
  - Instruction_Tuning
  - Reinforcement_Learning
status: complete
---

# PPO (Proximal Policy Optimization)

> [!abstract] TL;DR
> PPO is the reinforcement learning algorithm that powered RLHF in ChatGPT and InstructGPT. Its key innovation is a **clipped surrogate objective** that prevents any single gradient update from moving the policy too far from its previous version — giving the stability of trust-region methods without their computational cost. In LLM alignment, the LLM is the policy, tokens are actions, and the reward model provides the signal.

---

## Intuition — Analogy First

**Analogy:** Imagine a chess student learning from a coach. After each practice game, the coach gives feedback. The naive approach (REINFORCE) is: "that move won me the game, so do it much more often." The problem is that making *any* move 10x more likely will destroy the rest of your strategy — you become predictable.

PPO is the coach saying: "improve your strategy, but don't change it more than 10% from what you did today — small, stable improvements every session." You clip the update so even a very positive reward can't cause you to completely abandon your current approach. Tomorrow's session starts from a better version of today's strategy, not from scratch.

In LLMs: the "student" is the language model generating tokens. The "coach feedback" is the reward model's score. The "don't change too much" constraint prevents the model from collapsing into degenerate outputs that game the reward model.

---

## How It Works

### The Problem with Naive Policy Gradient (REINFORCE)

Standard policy gradient (REINFORCE) computes:

$$\nabla_\theta J(\theta) = \mathbb{E}_\tau\left[\sum_t \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot G_t\right]$$

If a response gets a high reward $G_t$, the gradient pushes up all its token probabilities — potentially by a huge amount in one step. This causes:
- **Training instability**: a single lucky/unlucky rollout swings the policy wildly
- **Reward hacking**: probabilities of reward-hacking tokens explode before the optimizer can self-correct

### The PPO Clipped Surrogate Objective

PPO's solution: compute a **probability ratio** between new and old policy, then clip it.

**Step 1 — Probability ratio:**
$$r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_\text{old}}(a_t \mid s_t)}$$

If $r_t > 1$: the new policy assigns more probability to action $a_t$ than the old policy.
If $r_t < 1$: the new policy assigns less.

**Step 2 — Clipped objective:**
$$L^{CLIP}(\theta) = \mathbb{E}_t\!\left[\min\!\left(r_t(\theta)\hat{A}_t,\; \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t\right)\right]$$

Where $\hat{A}_t$ is the **advantage estimate** (how much better this action was than the baseline) and $\epsilon$ is the clip ratio (typically 0.2).

**How clipping works:**
- If $\hat{A}_t > 0$ (good action): $r_t$ is capped at $1+\epsilon$ — the policy can only increase this action's probability by at most $(1+\epsilon)$ relative to the old policy per step
- If $\hat{A}_t < 0$ (bad action): $r_t$ is floored at $1-\epsilon$ — the policy can only decrease it by at most $(1-\epsilon)$ per step
- Taking the `min` ensures we never take an optimistic step that goes outside the trust region

### Actor-Critic Setup

PPO uses an actor-critic architecture to estimate advantages:

| Component | Role | In LLM RLHF |
|-----------|------|-------------|
| **Actor** (policy $\pi_\theta$) | Selects actions | LLM that generates tokens |
| **Critic** (value function $V_\phi$) | Estimates expected return | Separate value head on top of LLM |
| **Reward model** | External scorer | Frozen reward model from RLHF Stage 2 |
| **Reference model** | KL penalty anchor | Frozen SFT checkpoint |

The **advantage** is computed via Generalized Advantage Estimation (GAE):
$$\hat{A}_t = \delta_t + (\gamma\lambda)\delta_{t+1} + (\gamma\lambda)^2\delta_{t+2} + \ldots$$
$$\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)$$

### Full PPO-RLHF Objective

The combined objective used in InstructGPT-style training:

$$\mathcal{L}(\theta) = \mathbb{E}_{(x,y)\sim\pi_\theta}\!\left[r_\phi(x,y) - \beta\,\text{KL}\!\left[\pi_\theta(y|x) \| \pi_\text{ref}(y|x)\right]\right] - c_1 L^{VF}(\phi) + c_2 S[\pi_\theta]$$

Where:
- $r_\phi(x,y)$ = reward model score for response $y$ to prompt $x$
- $\beta \cdot \text{KL}$ = penalty for deviating from the reference (SFT) model
- $L^{VF}$ = critic (value function) loss, weighted by $c_1$
- $S[\pi_\theta]$ = entropy bonus to prevent premature collapse, weighted by $c_2$

### PPO Training Loop for LLMs

```mermaid
flowchart TD
    A[Prompt x sampled\nfrom dataset] --> B[Actor LLM generates\nresponse y via sampling]
    B --> C[Reward model scores\nr = RM(x, y)]
    B --> D[Reference model computes\nlog-probs for KL penalty]
    C --> E[Compute per-token reward\nr_t = r_full - β·KL_t]
    D --> E
    E --> F[Critic estimates\nvalue V(s_t) for each token]
    F --> G[Compute GAE advantages\nA_t for each token]
    G --> H[PPO update: clipped\nsurrogate objective on mini-batches]
    H --> I[Actor parameters θ updated\nCritic parameters φ updated]
    I --> A
```

---

## The Math

### Clipping Mechanics in Detail

Consider a single (state, action, advantage) tuple with $\hat{A} = +2$ and $\epsilon = 0.2$:

| $r_t$ | Unclipped term | Clipped term | $\min$ taken |
|--------|---------------|--------------|--------------|
| 0.8 | $0.8 \times 2 = 1.6$ | $0.8 \times 2 = 1.6$ | 1.6 (no clip) |
| 1.0 | $1.0 \times 2 = 2.0$ | $1.0 \times 2 = 2.0$ | 2.0 (no clip) |
| 1.2 | $1.2 \times 2 = 2.4$ | $1.2 \times 2 = 2.4$ | 2.4 (no clip) |
| 1.5 | $1.5 \times 2 = 3.0$ | $1.2 \times 2 = 2.4$ | **2.4 (clipped!)** |
| 2.0 | $2.0 \times 2 = 4.0$ | $1.2 \times 2 = 2.4$ | **2.4 (clipped!)** |

The gradient stops flowing once $r_t > 1+\epsilon$ for a positive advantage — preventing runaway updates.

### KL Divergence Per Token

In RLHF, the KL penalty is applied at every token position, not just the final reward:

$$r_t^\text{total} = \begin{cases} r_\phi(x, y) - \beta\log\frac{\pi_\theta(a_t|s_t)}{\pi_\text{ref}(a_t|s_t)} & \text{if } t = T \text{ (last token)} \\ -\beta\log\frac{\pi_\theta(a_t|s_t)}{\pi_\text{ref}(a_t|s_t)} & \text{otherwise} \end{cases}$$

This ensures the KL constraint acts as a per-step regularizer throughout the generation, not just globally.

---

## Code Demo

```python
import torch
import torch.nn.functional as F
from typing import Optional

def ppo_clipped_loss(
    log_probs_new: torch.Tensor,      # (batch, seq_len)
    log_probs_old: torch.Tensor,      # (batch, seq_len) — from rollout, detached
    advantages: torch.Tensor,          # (batch, seq_len)
    clip_eps: float = 0.2,
    mask: Optional[torch.Tensor] = None,  # (batch, seq_len) — 1 for real tokens
) -> torch.Tensor:
    """
    PPO clipped surrogate loss for token-level LLM training.
    Positive advantage = this token was good → increase its probability.
    Negative advantage = this token was bad → decrease its probability.
    """
    # Probability ratio: new_prob / old_prob in log space
    log_ratio = log_probs_new - log_probs_old
    ratio = torch.exp(log_ratio)

    # Clipped objective: two terms, take pessimistic minimum
    unclipped = ratio * advantages
    clipped = torch.clamp(ratio, 1.0 - clip_eps, 1.0 + clip_eps) * advantages
    token_loss = -torch.min(unclipped, clipped)  # negative = we maximize

    if mask is not None:
        token_loss = token_loss * mask
        return token_loss.sum() / mask.sum()
    return token_loss.mean()


def compute_kl_penalty(
    log_probs_policy: torch.Tensor,    # (batch, seq_len)
    log_probs_ref: torch.Tensor,       # (batch, seq_len)
    beta: float = 0.1,
) -> torch.Tensor:
    """Per-token KL penalty: β * KL(policy || reference)."""
    # KL(policy || ref) = policy_prob * (log_policy - log_ref)
    # = exp(log_policy) * (log_policy - log_ref)
    kl_per_token = torch.exp(log_probs_policy) * (log_probs_policy - log_probs_ref)
    return beta * kl_per_token


# ── Advantage Estimation (GAE) ──────────────────────────────────────────────
def compute_gae(
    rewards: torch.Tensor,    # (seq_len,) — reward at each timestep
    values: torch.Tensor,     # (seq_len,) — critic estimates
    gamma: float = 1.0,       # discount (usually 1.0 for language tasks)
    lam: float = 0.95,        # GAE lambda
) -> torch.Tensor:
    """Generalized Advantage Estimation."""
    T = len(rewards)
    advantages = torch.zeros_like(rewards)
    gae = 0.0

    for t in reversed(range(T)):
        next_value = values[t + 1] if t < T - 1 else 0.0
        delta = rewards[t] + gamma * next_value - values[t]
        gae = delta + gamma * lam * gae
        advantages[t] = gae

    return advantages


# ── Minimal PPO step illustration ───────────────────────────────────────────
def ppo_step_example():
    """Illustrate one PPO step: rollout → compute loss → update."""
    batch_size, seq_len, vocab_size = 2, 20, 32000

    # --- Rollout phase: generate responses with old policy ---
    # (In real RLHF: actor generates full responses, reward model scores them)
    log_probs_old = torch.randn(batch_size, seq_len) * 0.5  # detached from old policy

    # Reward model gives scalar reward per response; distribute to last token
    rm_rewards = torch.tensor([2.5, -0.8])  # batch of 2
    kl_penalties = torch.randn(batch_size, seq_len) * 0.05  # per-token KL

    rewards = kl_penalties.clone()
    rewards[:, -1] += rm_rewards  # add RM score to last token position

    # Critic estimates value for each token
    values = torch.randn(batch_size, seq_len)

    # Compute advantages (GAE) for each sequence
    advantages_list = []
    for i in range(batch_size):
        adv = compute_gae(rewards[i], values[i])
        advantages_list.append(adv)
    advantages = torch.stack(advantages_list)

    # Normalize advantages: important for training stability
    advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)

    # --- Update phase: compute loss with current (updated) policy ---
    log_probs_new = torch.randn(batch_size, seq_len) * 0.5  # from current policy
    mask = torch.ones(batch_size, seq_len)  # 1 for real tokens

    actor_loss = ppo_clipped_loss(log_probs_new, log_probs_old, advantages, mask=mask)
    value_loss = F.mse_loss(values, (advantages + values).detach())

    total_loss = actor_loss + 0.5 * value_loss
    print(f"Actor loss: {actor_loss.item():.4f}")
    print(f"Value loss: {value_loss.item():.4f}")
    print(f"Total loss: {total_loss.item():.4f}")
    return total_loss

ppo_step_example()
```

---

## Real-World Example

> **InstructGPT / ChatGPT (OpenAI, 2022):** The original ChatGPT was GPT-3.5 + RLHF with PPO. OpenAI ran PPO for approximately 32K gradient steps using ~40 human labelers who both wrote SFT demonstrations and ranked model outputs. The PPO clip parameter was $\epsilon = 0.2$, KL coefficient $\beta$ was adaptively adjusted to target $\text{KL} \approx 6$ nats from the SFT baseline. The resulting 1.3B InstructGPT model was preferred by human raters over raw GPT-3 (175B) 85% of the time — RLHF-PPO contributed more usability improvement than 100x more parameters.

---

## Trade-offs

| Aspect | Pro | Con |
|--------|-----|-----|
| Stability | Clipping prevents catastrophic updates; much more stable than REINFORCE | Requires careful KL and clip hyperparameter tuning |
| Sample efficiency | Reuses each rollout for multiple gradient steps (mini-batch updates) | Still needs many RM forward passes per update |
| Memory | Enables online learning — model improves iteratively | Requires 4 models in memory: actor, critic, reward model, reference |
| Complexity | Well-understood RL algorithm with wide adoption | Complex training loop; hard to debug; many hyperparameters |
| vs DPO | Can explore — generates new responses during training | DPO is simpler, more stable, and competitive on most benchmarks |

---

## When to Use vs Avoid

**Use PPO-RLHF when:**
- You need **online RL**: the model explores by generating responses and getting feedback, enabling learning beyond the static preference dataset
- Tasks have **verifiable rewards** (math, code) where a ground-truth reward signal exists
- You want maximum alignment quality and have RL infrastructure
- The task benefits from curriculum learning (gradually harder prompts)

**Avoid PPO-RLHF when:**
- You lack RL expertise or infrastructure — use DPO instead
- GPU budget is limited — DPO needs 2 models; PPO needs 4
- Training stability is paramount — DPO is significantly more stable
- Iterative improvement on a fixed preference dataset — DPO is designed for this

---

## Common Pitfalls

- **KL divergence explosion** — if $\beta$ is too small, the policy drifts far from the SFT model, producing incoherent outputs. Monitor KL at every step; set adaptive KL control to target a KL budget.
- **Reward hacking** — the RM is imperfect. PPO will find and exploit its weaknesses: responses become verbose, keyword-stuffed, or sycophantic. Mitigation: KL penalty + periodic RM retraining on adversarial examples.
- **Critic underfitting** — if the value function lags behind the actor, advantage estimates are noisy and training destabilises. Warm up the critic before actor training and use a lower LR for the actor.
- **Advantage normalization** — failing to normalize advantages per mini-batch causes high-variance gradients. Always normalize: `A = (A - A.mean()) / (A.std() + 1e-8)`.
- **Too many PPO epochs per rollout** — reusing stale rollouts for too many gradient updates violates the trust region. Stick to 1-4 PPO epochs per rollout batch.
- **Not using entropy bonus** — without the entropy term $c_2 S[\pi_\theta]$, the policy collapses to low-entropy mode: it always outputs the same safe responses regardless of prompt.

---

## Related Concepts

- [[_MOC_NLP|↑ Section MOC]]

- [[RLHF]] — the three-stage alignment pipeline that uses PPO as its RL optimizer in Stage 3
- [[DPO]] — eliminates PPO entirely by reformulating preference optimization as supervised learning; preferred in most modern pipelines
- [[Instruction_Tuning]] — Stage 1 SFT that must precede PPO; provides the reference policy
- [[Reinforcement_Learning]] — foundational RL concepts (policy, value function, reward, Markov Decision Process) underlying PPO

---

## Review Questions

1. PPO uses a clipped surrogate objective instead of directly maximizing the RL objective. Walk through what happens when advantage $\hat{A}_t = +3$ and the probability ratio $r_t$ grows to 2.0 with $\epsilon = 0.2$. How does the clip prevent instability here?

2. In RLHF with PPO, the KL divergence penalty is applied per-token throughout the response, not just as a global term. Why is per-token KL more principled than a single global KL term on the full response?

3. DPO has largely replaced PPO for LLM alignment. Describe one task category where PPO-RLHF retains a fundamental advantage over DPO, and explain why the property that makes PPO better in that case cannot be replicated by DPO.

---

## Sources

- Schulman, J., Wolski, F., Dhariwal, P., Radford, A., & Klimov, O. (2017). *Proximal Policy Optimization Algorithms*. [arXiv:1707.06347](https://arxiv.org/abs/1707.06347)
- Ouyang, L., et al. (2022). *Training language models to follow instructions with human feedback*. NeurIPS 2022. [arXiv:2203.02155](https://arxiv.org/abs/2203.02155)
- Ziegler, D., et al. (2019). *Fine-Tuning Language Models from Human Preferences*. [arXiv:1909.08593](https://arxiv.org/abs/1909.08593)
- Zheng, R., et al. (2023). *Secrets of RLHF in Large Language Models Part I: PPO*. [arXiv:2307.04964](https://arxiv.org/abs/2307.04964)

#llm #rlhf #ppo #reinforcement-learning #alignment #policy-gradient #actor-critic
