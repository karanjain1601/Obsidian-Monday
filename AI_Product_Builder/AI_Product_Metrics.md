---
title: AI Product Metrics
aliases: [AI Metrics, LLM Product Analytics, AI KPIs]
tags: [ai-product, metrics, analytics, kpis, product-management]
domain: AI Product Builder
difficulty: Intermediate
created: 2026-07-29
related: [AI_Product_Strategy, Evaluating_AI_Outputs, AI_UX_Design]
status: complete
---

# AI Product Metrics

> [!abstract] TL;DR
> AI products require both traditional product metrics (activation, retention, NPS) and AI-specific metrics (output quality, hallucination rate, user correction rate, inference cost per request). The hardest part is measuring output quality at scale without reading every response. Build a feedback flywheel: collect thumbs up/down + free text, route bad examples to evals, improve prompts/model, measure improvement in quality metrics.

## AI Product Metrics Framework

```mermaid
graph TD
    subgraph Business
        B1[Revenue / ARR]
        B2[Developer Adoption]
        B3[Retention / Churn]
    end

    subgraph Product
        P1[Activation Rate\nFirst AI feature used]
        P2[Feature Adoption\n% users using AI vs total]
        P3[User Satisfaction\nNPS, thumbs up rate]
    end

    subgraph AI Quality
        Q1[Output Quality Score\nLLM-judge or human eval]
        Q2[Hallucination Rate\n% factually incorrect outputs]
        Q3[User Correction Rate\n% outputs user edits/regenerates]
        Q4[Task Completion Rate\n% AI attempts that succeed]
    end

    subgraph Cost
        C1[Cost per Request\ntokens × price/token]
        C2[Cost per DAU\nmonthly AI spend / DAU]
        C3[P95 Latency\nuser experience floor]
    end

    Business --> Product
    Product --> AI Quality
    AI Quality --> Cost
```

---

## Core AI Product KPIs

### Thumbs Up/Down Rate

The simplest proxy for output quality — collected from users directly:

```python
def calculate_thumbs_rate(period: str = '7d') -> dict:
    """Calculate thumbs up/down rates for AI responses."""
    
    results = db.query("""
        SELECT 
            DATE_TRUNC('day', created_at) as date,
            COUNT(*) FILTER (WHERE signal = 'up') as thumbs_up,
            COUNT(*) FILTER (WHERE signal = 'down') as thumbs_down,
            COUNT(*) as total_feedback,
            ROUND(100.0 * COUNT(*) FILTER (WHERE signal = 'up') / COUNT(*), 1) as positive_rate
        FROM ai_feedback
        WHERE created_at > NOW() - INTERVAL %s
        GROUP BY 1
        ORDER BY 1 DESC
    """, period)
    
    return results

# Target benchmarks:
# - > 75% positive: good quality
# - 60-75%: acceptable
# - < 60%: investigate quality issues
```

**Caveat:** feedback rates are low (< 5% of responses get feedback). Those who leave feedback are not representative. Bias toward users who had strong reactions (very good or very bad).

### User Correction Rate

A higher-signal quality metric — how often do users edit or regenerate the AI output?

```sql
-- Track when users edit AI-generated content
SELECT 
    DATE_TRUNC('week', ai_generated_at) as week,
    COUNT(*) as total_ai_outputs,
    COUNT(*) FILTER (WHERE user_edited = true) as edited,
    COUNT(*) FILTER (WHERE regenerated = true) as regenerated,
    ROUND(100.0 * COUNT(*) FILTER (WHERE user_edited OR regenerated) / COUNT(*), 1) as correction_rate
FROM ai_output_events
GROUP BY 1
ORDER BY 1 DESC;
```

**Interpretation:**
- Very low correction rate (< 5%): users accepted output without editing (very good, or users aren't checking)
- Moderate (15-30%): healthy — users are engaged and AI is a useful starting point
- High (> 50%): AI output is below threshold; users are rewriting more than accepting

### Task Completion Rate

For AI agents or structured tasks, track whether the AI successfully completes the task:

```python
def calculate_task_completion(
    task_type: str,
    date_range: tuple[datetime, datetime]
) -> TaskCompletionStats:
    
    results = db.query("""
        SELECT
            task_type,
            COUNT(*) as total_attempts,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'failed') as failed,
            COUNT(*) FILTER (WHERE status = 'user_abandoned') as abandoned,
            AVG(duration_seconds) FILTER (WHERE status = 'completed') as avg_duration
        FROM ai_task_runs
        WHERE task_type = %s
          AND created_at BETWEEN %s AND %s
        GROUP BY task_type
    """, task_type, *date_range)
    
    return TaskCompletionStats(**results[0])

# By task type benchmarks:
# Simple classification: > 95% completion
# Code generation: > 70% completion (user accepts or edits)
# Multi-step agent: > 50% completion (complex tasks have higher failure rate)
```

---

## AI Cost Metrics

### Cost Per Request

```python
def calculate_cost_per_request(model: str, response_data: dict) -> float:
    """Calculate the inference cost for a single API call."""
    
    # Claude pricing (as of 2026):
    pricing = {
        "claude-haiku-4-5": {"input": 0.00000025, "output": 0.00000125},
        "claude-sonnet-4-5": {"input": 0.000003, "output": 0.000015},
        "claude-opus-4-5": {"input": 0.000015, "output": 0.000075},
    }
    
    rates = pricing.get(model, pricing["claude-sonnet-4-5"])
    
    cost = (
        response_data["input_tokens"] * rates["input"] +
        response_data["output_tokens"] * rates["output"]
    )
    
    return cost

# Typical cost targets:
# Simple chat: $0.001-0.005 per message
# RAG query:   $0.005-0.02 per query (includes embedding + completion)
# Complex agent: $0.05-0.50 per task (multiple LLM calls)
```

### Cost per DAU

```sql
SELECT
    DATE_TRUNC('month', created_at) as month,
    SUM(cost_usd) as total_ai_cost,
    COUNT(DISTINCT user_id) as dau,
    SUM(cost_usd) / NULLIF(COUNT(DISTINCT user_id), 0) as cost_per_dau
FROM ai_request_logs
GROUP BY 1
ORDER BY 1 DESC;

-- Target: cost_per_dau < LTV * 0.20 (AI cost is max 20% of lifetime value)
-- Alert threshold: if cost_per_dau doubles month-over-month, investigate
```

### Latency Percentiles

```python
def calculate_latency_stats(period: str = '7d') -> dict:
    results = db.query("""
        SELECT
            model,
            PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY latency_ms) AS p50,
            PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY latency_ms) AS p90,
            PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95,
            PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency_ms) AS p99
        FROM ai_request_logs
        WHERE created_at > NOW() - INTERVAL %s
        GROUP BY model
    """, period)
    return results

# Target latency (with streaming, user experience is based on TTFT):
# Time to first token (TTFT): < 500ms
# Time to complete (5-sentence response): < 3s P50, < 6s P95
```

---

## Quality Monitoring in Production

### Sampling Strategy

Running LLM-as-judge on every production response is expensive. Use stratified sampling:

```python
def should_evaluate_response(response_metadata: dict) -> bool:
    """Determine whether to run LLM evaluation on this response."""
    
    # Always evaluate:
    if response_metadata.get('thumbs_down'):
        return True  # user flagged it
    
    if response_metadata.get('task_failed'):
        return True  # agent task failed
    
    if response_metadata.get('regenerated'):
        return True  # user regenerated → unhappy with first output
    
    # Random sample: 5% of all responses
    if random.random() < 0.05:
        return True
    
    # Oversample edge cases (new users, unusual input length)
    if response_metadata.get('is_new_user'):
        return random.random() < 0.20  # 20% for new users
    
    return False
```

### Quality Drift Detection

AI output quality can drift over time (prompt regressions, model updates, distribution shift):

```python
def detect_quality_drift(
    baseline_week: str,
    current_week: str,
    threshold: float = 0.1  # 10% change = alert
) -> list[QualityAlert]:
    
    alerts = []
    
    baseline = get_quality_metrics(baseline_week)
    current = get_quality_metrics(current_week)
    
    for metric in ['thumbs_up_rate', 'task_completion_rate', 'llm_judge_score']:
        change = (current[metric] - baseline[metric]) / baseline[metric]
        
        if abs(change) > threshold:
            alerts.append(QualityAlert(
                metric=metric,
                baseline=baseline[metric],
                current=current[metric],
                change_pct=change * 100,
                severity='warning' if abs(change) < 0.20 else 'critical',
            ))
    
    return alerts
```

---

## The AI Feedback Flywheel

The path from user feedback to product improvement:

```
1. User gives thumbs down on an AI response
         ↓
2. Response added to "needs review" queue
         ↓
3. LLM judge automatically scores it (is it actually bad?)
         ↓
4. Human reviewer labels the failure mode:
   - Hallucination
   - Off-topic  
   - Wrong format
   - Incomplete
   - Unsafe
         ↓
5. If systemic (>10 similar examples) → update prompt or fine-tune
   If one-off → add to golden dataset for regression testing
         ↓
6. Deploy updated prompt → A/B test vs baseline
         ↓
7. Measure: thumbs up rate before vs after prompt change
         ↓
8. Ship if statistically significant improvement
```

### A/B Testing AI Changes

```python
def assign_ai_experiment(user_id: str, experiment_name: str) -> str:
    """Deterministically assign users to A/B experiment groups."""
    hash_val = int(hashlib.md5(f"{user_id}:{experiment_name}".encode()).hexdigest(), 16)
    variant = 'treatment' if (hash_val % 100) < 50 else 'control'
    
    # Track experiment exposure
    track_event('experiment_exposed', {
        'user_id': user_id,
        'experiment': experiment_name,
        'variant': variant,
    })
    
    return variant

def get_system_prompt(user_id: str) -> str:
    variant = assign_ai_experiment(user_id, 'prompt_v2_test')
    
    if variant == 'treatment':
        return SYSTEM_PROMPT_V2
    return SYSTEM_PROMPT_V1  # control
```

---

## Dashboard Design for AI Products

```
AI Product Dashboard (weekly review):

Quality                          Cost
┌─────────────────────────────┐  ┌──────────────────────────────┐
│ Thumbs Up Rate: 78% (+3%)   │  │ Cost/Request: $0.008 (-12%)  │
│ Completion Rate: 89% (=)    │  │ Cost/DAU: $0.23 (+2%)        │
│ LLM Judge Score: 4.1/5 (=)  │  │ P95 Latency: 2.1s (-0.3s)   │
└─────────────────────────────┘  └──────────────────────────────┘

Usage                            Top Failure Modes (this week)
┌─────────────────────────────┐  ┌──────────────────────────────┐
│ AI Requests: 1.2M (+18%)    │  │ 1. Incomplete answers (42%)  │
│ Unique Users: 45k (+8%)     │  │ 2. Off-topic responses (28%) │
│ Avg msgs/session: 6.2 (+0.4)│  │ 3. Hallucinated links (18%)  │
└─────────────────────────────┘  │ 4. Wrong format (12%)        │
                                  └──────────────────────────────┘
```

---

## Common Pitfalls

- **Optimizing only for thumbs up rate.** High thumbs up rate with low task completion rate means users like the responses but they're not actually solving problems. Track both.
- **No baseline for cost.** A 30% cost increase per request is fine if quality improved 50%. Compare cost efficiency (quality per dollar), not cost in isolation.
- **Latency measured server-side.** Client-perceived latency includes time to first token + network. Measure TTFT and rendering time client-side.
- **Evaluation distribution mismatch.** Your golden dataset eval passes with 95% quality, but production thumbs up is 60%. Your golden dataset doesn't represent production traffic. Update it.
- **Shipping prompt changes without A/B test.** A "better" prompt might hurt quality for a segment of users. Always A/B test with statistical significance before full rollout.

---

## Review Questions

1. Why is thumbs up/down rate a useful but insufficient quality metric for AI products?
2. What is "user correction rate" and what does a 45% rate indicate about AI output quality?
3. Your cost per request doubled after switching to a higher-quality model. Thumbs up rate also increased from 65% to 82%. How do you decide whether the cost increase is justified?
4. Describe the AI feedback flywheel from user thumbs-down to product improvement.
5. Your LLM judge score in weekly evals is consistently 4.2/5, but production thumbs up rate dropped from 78% to 62% over the past month. What does this discrepancy tell you?
