---
title: Cognitive Biases and Heuristics
aliases: [Heuristics and Biases, Dual Process Theory, System 1 and System 2, Kahneman Tversky, Behavioral Biases]
tags: [Logic, CriticalThinking, CognitiveBiases, Heuristics, BehavioralEconomics, DualProcess, DecisionMaking]
domain: Logic
difficulty: Intermediate
created: 2026-08-01
related: [Logical_Fallacies_Overview, Bayesian_Reasoning, Statistical_Inference_and_Hypothesis_Testing, Causal_Reasoning, Cognitive_Biases, Problem_Solving_and_Decision_Making, Decision_Making_and_Reward_Circuits, Behavioral_Economics_Psychology, Evolutionary_Mismatch, Culture_and_Cognition]
status: complete
---

# Cognitive Biases and Heuristics

> [!abstract] TL;DR
> Heuristics are mental shortcuts that make judgment fast and frugal; cognitive biases are the systematic, predictable errors those shortcuts produce when applied outside the conditions they were calibrated for. Kahneman and Tversky's heuristics-and-biases program demonstrated that human judgment departs from normative probability theory in structured, reproducible ways — not randomly. Understanding these patterns is a prerequisite for building reliable reasoning practices, designing fair institutions, and auditing AI systems that inherit human data.

---

## Intuition

**Analogy:** A GPS app routes you using a cached map downloaded three days ago. Most of the time the shortcuts it picks are exactly right. But there is a new road closure, and the app has no way to know about it — so it confidently routes you into a dead end. The cached map is not broken; it is just working from stale priors. The failure is not random: it is systematic, and you can predict exactly when it will fail if you know the conditions under which the map was built.

Human cognitive heuristics are that cached map. They were calibrated in environments where vivid recent events reliably indicated common threats, where "looks like X" reliably meant "is X," and where the first number you encountered was usually informative. Those calibrations were correct for their original environment. The biases emerge when modern life presents edge cases the calibration never encountered — media-amplified rare events, arbitrary anchors in negotiations, and statistical base rates that have no perceptual form.

---

## How It Works

### Core Mechanics

Kahneman and Tversky's research program, launched in the early 1970s, replaced the idealized "rational agent" of classical economics with a picture of a bounded reasoner who relies on a small number of heuristic principles to reduce complex probability judgments to simpler operations. The program produced three canonical heuristics:

**1. Availability** — Judge the probability of an event by how easily examples come to mind. Ease of recall is a good proxy for frequency when memory is representative; it misfires when vividness, recency, or emotional salience make rare events memorable.

**2. Representativeness** — Judge the probability that object X belongs to category Y by how much X resembles the prototype of Y. Works well for everyday categorization; produces base rate neglect (ignoring prior probabilities in favor of case resemblance) and the conjunction fallacy (judging "A and B" more probable than "A alone" when the conjunction better fits a prototype).

**3. Anchoring-and-Adjustment** — Start from an initial anchor value and adjust until you reach a plausible estimate. Adjustment is systematically insufficient: the final estimate remains too close to the anchor, even when the anchor is clearly arbitrary (a randomly spun wheel, an irrelevant number in a question stem).

Beyond the three canonical heuristics, subsequent research established a large catalogue of downstream biases:

- **Confirmation bias** (Wason 1960; Nickerson 1998): selectively seek, interpret, and remember information that confirms existing beliefs.
- **Hindsight bias**: after learning an outcome, overestimate the probability you would have assigned it beforehand — "I knew it all along."
- **Overconfidence effect**: stated confidence systematically exceeds accuracy, especially for difficult judgments with slow or ambiguous feedback.
- **Sunk cost fallacy**: weight past unrecoverable investment in current forward-looking decisions; escalation of commitment.
- **Status quo bias**: prefer the current state of affairs; perceive changes from baseline as losses.
- **Framing effect**: identical information elicits different choices depending on whether it is cast as gains or losses.
- **Fundamental Attribution Error (FAE)**: over-attribute others' behavior to their character, under-attribute it to their situation.
- **Self-serving bias**: attribute successes to internal causes, failures to external ones.
- **Bias blind spot**: accurately recognize biases in others while failing to see them in oneself.

### Flow / Architecture

```mermaid
flowchart LR
    INPUT["Stimulus or<br/>Decision Prompt"] --> S1["System 1<br/>Fast · Automatic<br/>Associative · Emotional"]
    INPUT --> S2["System 2<br/>Slow · Deliberate<br/>Rule-based · Effortful"]
    S1 --> H1["Availability<br/>Heuristic"]
    S1 --> H2["Representativeness<br/>Heuristic"]
    S1 --> H3["Anchoring and<br/>Adjustment"]
    S1 --> H4["Affect<br/>Heuristic"]
    H1 --> B1["Overestimate vivid events<br/>Hindsight bias"]
    H2 --> B2["Base rate neglect<br/>Conjunction fallacy"]
    H3 --> B3["Insufficient adjustment<br/>Framing effects"]
    H4 --> B4["Sunk cost · Status quo<br/>Loss aversion"]
    S2 -->|"Lazy endorsement"| BIAS_OUT["Biased<br/>Output"]
    B1 --> BIAS_OUT
    B2 --> BIAS_OUT
    B3 --> BIAS_OUT
    B4 --> BIAS_OUT
    S2 -->|"Active correction"| DB["Debiased<br/>Judgment"]
    style S1 fill:"#d97706",color:"#ffffff"
    style S2 fill:"#2563eb",color:"#ffffff"
    style BIAS_OUT fill:"#dc2626",color:"#ffffff"
    style DB fill:"#059669",color:"#ffffff"
```

---

## Key Concepts

### Secondary

**Dual Process Theory (Kahneman's framing):** Kahneman's *Thinking, Fast and Slow* (2011) popularized the System 1 / System 2 vocabulary. System 1 is fast, automatic, associative, and largely unconscious; System 2 is slow, deliberate, and rule-based but metabolically expensive. Most everyday cognition runs on System 1. System 2 is invoked when System 1 signals uncertainty or when an external prompt forces reflection — but even then, System 2 often lazily endorses System 1's output rather than overriding it.

**The Three Classic Heuristics in Detail:**

*Availability* — Tversky and Kahneman (1973) showed that people estimate the frequency of words ending in "-ing" as higher than words with "n" as the third-to-last letter, even though the latter is a superset of the former. The explanation: "-ing" words are easier to generate from memory, so they feel more common. The same mechanism causes overestimation of dramatic causes of death (plane crashes, shark attacks) and underestimation of mundane ones (falls, cardiovascular disease).

*Representativeness* — The Linda problem is the canonical demonstration: participants rate "Linda is a bank teller and feminist activist" as more probable than "Linda is a bank teller," violating the conjunction rule P(A∩B) ≤ P(A). The conjunction is rated higher because the description of Linda resembles the feminist activist prototype. Base rate neglect follows the same logic: when told that 85% of cabs are Green and 15% are Blue, but an eyewitness says the cab was Blue, most people heavily weight the witness testimony and largely ignore the base rate.

*Anchoring* — In a classic study, participants who spun a wheel stopping at 65 gave higher estimates of African countries in the UN than those whose wheel stopped at 10. The anchor is integrated into the estimate despite being transparently arbitrary. In real settings, first offers in salary negotiations, listing prices in real estate, and opening bids in auctions all function as anchors that persistently pull final outcomes toward them.

**Confirmation Bias:** Nickerson's 1998 review distinguished several distinct processes that fall under the confirmation bias umbrella: selective hypothesis testing (testing only confirming cases, as in the Wason Selection Task), selective information search, asymmetric interpretation of ambiguous evidence, and selective recall. These processes are not independent — they form a mutually reinforcing system that can lock an individual into a wrong belief even against accumulating counter-evidence.

**Framing Effects:** The same 600-person disease outbreak can be framed as "400 people will die" (loss frame) or "200 people will be saved" (gain frame). The first framing reliably produces risk-seeking behavior; the second produces risk-aversion — even though they describe identical outcomes. This violates the extensionality axiom of rational choice theory: preferences should depend on outcomes, not their description.

---

### Undergraduate

**Gigerenzen's Ecological Rationality and the Adaptive Toolbox:**

Gerd Gigerenzen offers a systematic alternative to the Kahneman-Tversky picture. Where Kahneman and Tversky benchmark human judgment against classical probability theory and find it deficient, Gigerenzen argues that heuristics are ecologically rational: they are well-matched to the statistical structure of the environments in which they evolved, and they often outperform complex algorithms on real-world tasks with limited information.

The *adaptive toolbox* model holds that the mind possesses a collection of fast-and-frugal heuristics, each adapted to specific environmental conditions. The *recognition heuristic* ("if you recognize one option and not another, infer the recognized one scores higher on the criterion") performs well precisely because recognition is a good proxy for frequency in real-world memory. The *take-the-best* heuristic (look up cues in order of validity; stop at the first discriminating cue) matches or beats multiple regression in half-information environments.

Gigerenzen's critique has two edges: (1) calling a heuristic a "bias" depends on the choice of normative standard, and classical probability theory may not always be the right standard; (2) debiasing through probabilistic training is often limited in scope — it may reduce base rate neglect in narrow laboratory tasks without generalizing.

**Attribution Errors:**

The *Fundamental Attribution Error* (Ross, 1977) is the tendency to over-attribute others' behavior to stable internal dispositions while under-weighting situational constraints. The classic demonstration: participants who were assigned at random to write pro-Castro essays were rated as genuinely holding pro-Castro views by observers who knew the essays were assigned. The situational constraint (the assignment) was discounted.

The *actor-observer asymmetry* notes the directional reversal for one's own behavior: you explain your own failures situationally ("I was exhausted") and others' failures dispositionally ("they are lazy"). This asymmetry partially collapses when you take the observer's perspective on yourself or know the other person well.

*Self-serving bias* extends this: successes are attributed internally ("my skill"), failures externally ("bad luck"). In organizations, this produces systematic distortions in performance reviews and post-mortem analyses.

**Overconfidence:**

Three distinct phenomena are routinely conflated under "overconfidence":
1. *Overprecision*: confidence intervals are too narrow; 90% confidence intervals capture the true value only ~50% of the time.
2. *Overplacement*: most people believe they are above average on most valued attributes (the "better-than-average" effect).
3. *Overestimation*: people overestimate their absolute performance on difficult tasks.

These three are empirically dissociable: overplacement reverses for easy tasks (where most people correctly claim above-average performance). Expert forecasters in fields with rapid, clear feedback (weather, horse racing) show near-calibrated confidence; those with slow, ambiguous feedback (geopolitical forecasting, clinical diagnosis) show strong overprecision.

**Dual Process Theory Revisions — Evans and Stanovich:**

The System 1/System 2 terminology is Kahneman's popularization of a richer debate. Jonathan Evans (2008) and Keith Stanovich (2011) distinguish two components within what is loosely called "System 2":

- *Type 1 processing*: autonomous, fast, capacity-independent, evolutionarily old. Encompasses not only cognitive heuristics but also perceptual processing, over-learned skills, and affective responses.
- *Type 2 processing*: hypothetical thought simulation, sequential, capacity-limited (bottlenecked by working memory).

Stanovich further distinguishes within Type 2 between the *algorithmic mind* (fluid intelligence, raw processing capacity) and the *reflective mind* (metacognition, epistemic rationality, disposition to override Type 1). Critically, high IQ does not guarantee rational override of Type 1: Stanovich calls the failures of intelligent people to use their Type 2 capacity *dysrationalia*. The disposition to think rationally (reflective mind) is separable from the capacity to think carefully (algorithmic mind).

**Hindsight Bias and the Bias Blind Spot:**

Hindsight bias (Fischhoff, 1975) is more than a memory distortion: once an outcome is known, it feels not only predictable but inevitable. This prevents genuine learning from experience — if you "always knew" the project would fail, you never confront what you actually didn't know in advance. Pre-mortems (imagining the project has already failed and asking why) are the best-validated debiasing technique for this specific bias.

The *bias blind spot* (Pronin et al., 2002) is particularly resistant to debiasing: people acknowledge that cognitive biases affect others, but rate themselves as less susceptible than average. Awareness of a bias does not reduce it. The mechanism is that introspective access to one's own reasoning does not reveal heuristic shortcuts — people infer their own lack of bias from the absence of "feeling biased."

---

### Graduate

**Sunk Cost and Escalation of Commitment:**

The sunk cost fallacy violates the normative principle that only future costs and benefits should enter a forward-looking decision. Unrecoverable past investment is logically irrelevant to whether continuing a project has positive expected value from this point forward. Yet multiple mechanisms sustain sunk cost sensitivity: loss aversion (stopping crystallizes the loss), ego protection (especially when the original decision-maker is still involved), and social commitment norms (abandonment signals unreliability).

Brockner's (1992) escalation of commitment model adds that sunk costs are particularly powerful when the initial investment was high, the decision-maker was personally responsible, and the outcome feedback is slow and ambiguous — exactly the conditions of large infrastructure projects, strategic military commitments, and long-running software programs.

**Cognitive Biases in AI Systems and Algorithmic Decision-Making:**

Cognitive biases do not disappear in AI systems; they are inherited, amplified, or transformed through the training data and optimization processes:

- *Availability bias in training data*: machine learning models trained on historical data inherit the representational skews of that data. If vivid or recent events are over-represented in web-scraped corpora (news coverage of disasters, viral social media), the model's implicit frequency estimates will mirror human availability biases.
- *Anchoring in large language models*: LLMs show documented anchoring effects — early context in a prompt disproportionately constrains generated text, analogous to human anchoring. This has practical implications for prompt engineering: the framing of the opening influences all subsequent outputs.
- *Confirmation bias in recommendation systems*: collaborative filtering systems optimize for engagement, which rewards content that confirms existing preferences and beliefs. The system does not "have" confirmation bias in the human sense; it produces confirmation-bias-compatible behavior as an emergent consequence of engagement optimization.
- *Framing effects in automated scoring*: identical qualifications described in different frames (passive vs. active voice, numeric vs. categorical achievement descriptions) produce different scores from automated resume screeners trained on human-labeled data that encodes human framing sensitivity.
- *Algorithmic fairness as debiasing*: the algorithmic fairness literature (Dwork et al., 2012; Hardt et al., 2016) can be read as an attempt to implement debiasing at scale: demographic parity, equalized odds, and calibration constraints are formalized analogs of the "structured review" and "blind evaluation" strategies from human debiasing research.

**Debiasing: What Actually Works:**

The literature on debiasing (Larrick, 2004; Milkman et al., 2009) distinguishes *within-person* and *environmental* strategies, with the latter being more reliable:

| Strategy | Mechanism | Evidence Strength |
|---|---|---|
| **Consider the opposite** | Force generation of alternative hypotheses | Strong for confirmation bias and anchoring |
| **Pre-mortem** | Imagine failure before committing; reason backwards | Strong for overconfidence and planning fallacy |
| **Reference class forecasting** | Replace inside-view estimates with distributional data from similar past projects | Strong for planning fallacy |
| **Structured review** | Pre-defined criteria evaluated before seeing identifying information | Strong for in-group bias in hiring |
| **Statistical training** | Learn base rate and conditional probability reasoning | Moderate; generalizes poorly beyond training domain |
| **Slow down / consider** | Engage Type 2 before committing to System 1 answer | Weak alone; stronger combined with prompts |
| **Incentives** | Pay for accuracy rather than confidence | Mixed; helps calibration, less for motivated reasoning |

The consistent finding: procedural and environmental interventions outperform mere awareness. Knowing about anchoring does not reduce it; generating your own estimate before seeing the anchor does.

---

## Python Demo

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# ── Part A: Availability Heuristic Simulation ─────────────────────────────────
# Simulate 12 event categories with known true frequencies.
# A salience score captures how vivid/media-covered each event is.
# Perceived frequency = true_frequency + salience_distortion + noise.

n_events = 12
true_freq = rng.uniform(0.04, 0.38, n_events)

# Salience: 0 = mundane, 1 = extremely vivid
salience = rng.uniform(0.0, 1.0, n_events)

# High-salience events are overestimated; low-salience events underestimated
distortion = salience * 0.28 - 0.06          # net upward shift for vivid events
noise_a = rng.normal(0.0, 0.025, n_events)
perceived_freq = np.clip(true_freq + distortion + noise_a, 0.02, 0.92)

# ── Part B: Anchoring Effect Simulation ──────────────────────────────────────
# 90 subjects each see a random anchor (1-100) and then estimate a value
# whose true answer is 42. Estimates are pulled toward the anchor.

n_subjects = 90
true_answer = 42.0
anchors = rng.integers(5, 96, n_subjects).astype(float)

# Model: estimate = true_answer + pull * (anchor - true_answer) + noise
anchor_pull = 0.42
noise_b = rng.normal(0.0, 7.5, n_subjects)
estimates = true_answer + anchor_pull * (anchors - true_answer) + noise_b
estimates = np.clip(estimates, 1.0, 99.0)

# ── Regression lines ──────────────────────────────────────────────────────────
m_a, b_a = np.polyfit(true_freq, perceived_freq, 1)
m_b, b_b = np.polyfit(anchors, estimates, 1)

x_a = np.linspace(true_freq.min() - 0.01, true_freq.max() + 0.01, 200)
x_b = np.linspace(anchors.min() - 1, anchors.max() + 1, 200)

# ── Plot ──────────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(13, 5.5))
fig.suptitle("Cognitive Bias Simulations: Availability Heuristic and Anchoring Effect",
             fontsize=13, fontweight="bold", y=1.01)

# --- Panel A ---
ax = axes[0]
sc = ax.scatter(true_freq, perceived_freq, c=salience, cmap="RdYlGn_r",
                s=90, zorder=3, edgecolors="#333333", linewidths=0.6)
ax.plot(x_a, m_a * x_a + b_a, color="#e74c3c", lw=2.2, label="Regression (perceived)")
ax.plot([0.0, 0.45], [0.0, 0.45], color="#888888", lw=1.6, ls="--", label="Unbiased baseline y=x")
ax.set_xlabel("True Event Frequency", fontsize=11)
ax.set_ylabel("Perceived Frequency", fontsize=11)
ax.set_title("Panel A: Availability Heuristic\nSalience Inflates Perceived Frequency", fontsize=11)
cbar = fig.colorbar(sc, ax=ax, pad=0.03, shrink=0.85)
cbar.set_label("Event Salience", fontsize=9)
ax.legend(fontsize=9, loc="upper left")
ax.grid(alpha=0.3)

# --- Panel B ---
ax2 = axes[1]
ax2.scatter(anchors, estimates, color="#3498db", s=38, alpha=0.72,
            edgecolors="white", linewidths=0.3, label="Subject estimate", zorder=3)
ax2.plot(x_b, m_b * x_b + b_b, color="#e74c3c", lw=2.2,
         label=f"Regression  slope={m_b:.2f}")
ax2.axhline(true_answer, color="#888888", lw=1.6, ls="--",
            label=f"True answer = {true_answer:.0f}")
ax2.set_xlabel("Anchor Value", fontsize=11)
ax2.set_ylabel("Final Estimate", fontsize=11)
ax2.set_title("Panel B: Anchoring Effect\nArbitrary Anchor Pulls Final Estimate", fontsize=11)
ax2.legend(fontsize=9, loc="upper left")
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# ── Summary statistics ────────────────────────────────────────────────────────
mean_error_a = np.mean(perceived_freq - true_freq)
print(f"Panel A  mean overestimation across all events: {mean_error_a:+.3f}")
print(f"Panel A  correlation salience vs overestimation: "
      f"{np.corrcoef(salience, perceived_freq - true_freq)[0, 1]:.3f}")
print(f"Panel B  anchor regression slope: {m_b:.3f}  "
      f"(0 = no pull, 1 = pure anchor copying)")
```

Panel A shows that when the regression line lies above the y=x baseline, events are systematically overestimated — and the color gradient reveals that high-salience events (dark red) cluster furthest above the line. Panel B shows that even with random anchors uniformly spread from 5 to 95, final estimates track the anchor with a slope near 0.42 instead of the expected 0.0 if anchors were ignored.

---

## Real-World Applications

> **Medical Diagnosis — Availability and Anchoring.** Emergency physicians overestimate the prevalence of diagnoses they have recently encountered (availability) and anchor on the first working diagnosis formed in triage, insufficiently adjusting as new test results arrive (anchoring). Studies of diagnostic error (Croskerry, 2002) find that cognitive bias accounts for roughly 75% of diagnostic mistakes, with premature closure (anchoring on an early hypothesis and discounting disconfirming evidence) being the most common single failure mode. Structured diagnostic checklists and mandatory "consider alternatives" prompts before finalizing a diagnosis are the validated procedural counterweights.

> **Financial Markets — Overconfidence, Framing, and Loss Aversion.** Odean (1998) analyzed 10,000 brokerage accounts and found that individual investors trade roughly 70% more than their portfolio performance justifies — a signature of overconfidence. Shefrin and Statman's disposition effect shows investors hold losing positions too long and sell winners too early, consistent with loss aversion making the realization of a loss more aversive than an equivalent gain is pleasant. Fund managers subject to quarterly performance evaluation show status quo bias in portfolio construction — deviating from the benchmark carries asymmetric career risk.

> **Public Policy — Framing and Default Effects.** The organ donation literature (Johnson and Goldstein, 2003) is the canonical policy framing example: countries with opt-out defaults have donation rates above 90%; opt-in countries cluster below 20%. The information is identical; the default changed. The same mechanism drives enrollment in retirement savings plans — Thaler and Sunstein's nudge framework is explicitly a debiasing-at-scale technology, redesigning choice architectures to make the "rational default" the path of least resistance rather than requiring people to overcome status quo bias and inertia.

> **Hiring and Performance Review — Confirmation Bias and FAE.** Structured interviews with pre-specified behavioral questions and blind scoring rubrics reduce confirmation bias by separating evidence collection from hypothesis formation. The FAE is particularly damaging in resume screening: candidates who failed due to situational factors (company went bankrupt, team was dysfunctional) are rated as personally deficient, while candidates who succeeded in unusually favorable conditions are rated as highly capable. Reference class scoring — comparing a candidate's achievements to what most people in the same circumstances achieved — is the structured corrective.

> **AI Content Moderation — Framing and Availability in Training Labels.** Human content moderators who label training data show systematic availability effects: content that resembles recently reviewed harmful content is flagged at higher rates, while novel harmful content that does not match cached prototypes is missed. Label noise from these biases propagates directly into the model. Adversarial red-teaming is partly a debiasing intervention for training data: it deliberately surfaces under-represented failure modes to correct the sampling imbalance.

---

## Common Pitfalls

- **Treating awareness as a cure** — The most well-documented finding in debiasing research is that knowing a bias exists does not reliably reduce susceptibility to it. The bias blind spot guarantees that introspection fails to detect ongoing heuristic processing. Procedural interventions (checklists, structured review, pre-mortems) work; "try harder not to be biased" does not.

- **Conflating heuristics with irrationality** — Gigerenzen's critique is legitimate: heuristics are not stupid shortcuts; they are ecologically calibrated tools. The availability heuristic is correct when memory is a representative sample of the world. Labeling every heuristic "irrational" obscures that the same process can be rational in one environment and biased in another.

- **The single-bias fallacy** — Real decisions are rarely distorted by one bias. Sunk cost persistence is typically reinforced by overconfidence (the project can still succeed), confirmation bias (seek evidence it is progressing), and status quo bias (stopping requires active effort). Debiasing strategies that target a single mechanism often leave the reinforcing structure intact.

- **Ignoring ecological validity** — Many bias demonstrations use decontextualized laboratory tasks (word lists, hypothetical gambles). The effect sizes in realistic, high-stakes decisions with feedback differ substantially. Base rate neglect in a medical expert with ten years of domain-specific feedback is smaller than in a naive student reading a vignette.

- **Assuming experts are immune** — Domain expertise reduces some biases within the expert's domain when feedback is rapid and representative (calibrated weather forecasters). It does not reduce framing effects, loss aversion, or overconfidence in novel domains. Expert overconfidence is particularly dangerous because the social authority of expertise suppresses external correction.

- **Misapplying the sunk cost principle** — Not all persistence in the face of past investment is fallacious. If sunk costs correlate with quality of the underlying project (only high-quality projects receive large initial investment), then past investment is a legitimate Bayesian signal. The fallacy is weighting past investment as a separate decision-relevant factor beyond its role as a prior-updating signal.

---

## Related Concepts

- [[Logical_Fallacies_Overview]] — Cognitive biases are the psychological substrate that makes informal fallacies feel compelling: availability drives hasty generalization; confirmation bias sustains begging the question; affect drives appeals to emotion. The logical and psychological accounts are complementary.

- [[Bayesian_Reasoning]] — Base rate neglect is a failure to apply Bayesian updating correctly; availability and representativeness produce non-Bayesian probability estimates. Bayesian reasoning is the normative standard against which availability and representativeness errors are measured.

- [[Statistical_Inference_and_Hypothesis_Testing]] — Overconfidence in precision, conjunction errors, and base rate neglect are all violations of statistical reasoning norms. Statistical training reduces some biases in laboratory settings but shows limited transfer to naturalistic judgment.

- [[Causal_Reasoning]] — Fundamental attribution error is a causal reasoning error: situational causes of behavior are under-weighted relative to dispositional ones. Post-hoc reasoning about correlation as causation is related to availability (recent co-occurrence is highly salient).

- [[Cognitive_Biases]] — The Psychology vault note covering the same catalogue from a psychological mechanisms perspective; this note approaches the same phenomena from the critical thinking and applied epistemology angle, emphasizing normative standards and debiasing.

- [[Problem_Solving_and_Decision_Making]] — The dual process framework governing heuristics is grounded here; System 1 and System 2 as psychological constructs with their full mechanistic detail.

- [[Decision_Making_and_Reward_Circuits]] — The neural substrate of value-based choice; dopaminergic prediction error signals are the biological implementation of the learning processes that calibrate heuristics and sustain loss aversion.

- [[Behavioral_Economics_Psychology]] — Applied domain where heuristics and biases research is translated into policy interventions; nudge theory, libertarian paternalism, and choice architecture design.

- [[Evolutionary_Mismatch]] — The framework explaining *why* heuristics fail in modern environments: they were calibrated in ancestral conditions that differ systematically from the statistical structure of modern, media-saturated, globally connected decision environments.

- [[Culture_and_Cognition]] — Cross-cultural evidence on which biases are universal (availability, anchoring) versus culturally moderated (FAE is weaker in collectivist cultures, where situational explanation is culturally normative).

---

## Review Questions

### Foundational

1. The availability heuristic leads people to overestimate the frequency of plane crashes and underestimate the frequency of car accident fatalities. Using the structure of the heuristic (what it uses as a proxy for frequency), explain exactly why this asymmetry arises — and identify the conditions under which availability gives correct frequency estimates rather than distorted ones.

2. A startup founder refuses to shut down a product with declining user metrics, citing the two years and $800,000 already spent. Identify all the distinct cognitive biases potentially active in this decision, explain how they interact to sustain the behavior, and propose two specific procedural interventions that could counteract them.

3. Why does telling people about a cognitive bias typically fail to debias them? Use the bias blind spot and the Type 1 / Type 2 architecture to explain the failure mechanism, and then explain why pre-mortems succeed where awareness fails.

### Undergraduate

1. Kahneman and Tversky's heuristics-and-biases program and Gigerenzen's adaptive toolbox program disagree about whether heuristics are "biased" or "ecologically rational." Present the strongest version of each position and then evaluate which framework is more useful for the practical goal of improving judgment in organizational settings.

2. Evans and Stanovich revised the simple System 1 / System 2 dichotomy into a Type 1 / Type 2 framework with a further distinction between the algorithmic mind and the reflective mind. What does this refinement explain that the simpler dichotomy cannot? What are the implications for debiasing strategy?

3. Construct a scenario in the domain of algorithmic hiring where three distinct cognitive biases in human labelers could jointly produce a discriminatory model, even if no individual labeler intends discrimination. For each bias, specify the training data artifact it would produce and the fairness metric it would violate.

### Graduate

1. Gigerenzen argues that base rate neglect is not a cognitive failing but a rational response to environments where individuating information is more predictive than base rates. Evaluate this argument using the cab problem and the mammography screening problem as test cases. Does the ecological rationality defense succeed for both, one, or neither? What criterion separates legitimate base rate discounting from base rate neglect?

2. The bias blind spot implies that debiasing through self-reflection is systematically limited: people use their introspective absence of bias-feeling as evidence of their rationality. What does this imply for the design of institutional decision-making processes? Propose a complete decision audit framework for a high-stakes organizational decision that addresses the blind spot structurally rather than relying on individual insight.

3. Dual process accounts predict that cognitive load (consuming System 2 resources) should increase reliance on Type 1 heuristics and therefore increase bias susceptibility. But some studies find the opposite — cognitive load reduces some biases by preventing effortful motivated reasoning. Reconcile these findings using Stanovich's tripartite model and identify the class of biases for which each prediction holds.

---

## Sources

- Tversky, A. & Kahneman, D. (1974). "Judgment under uncertainty: Heuristics and biases." *Science*, 185(4157), 1124–1131.
- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Gigerenzen, G., Todd, P.M., & the ABC Research Group. (1999). *Simple Heuristics That Make Us Smart*. Oxford University Press.
- Nickerson, R.S. (1998). "Confirmation bias: A ubiquitous phenomenon in many guises." *Review of General Psychology*, 2(2), 175–220.
- Stanovich, K.E. (2011). *Rationality and the Reflective Mind*. Oxford University Press.
- Pronin, E., Lin, D.Y., & Ross, L. (2002). "The bias blind spot: Perceptions of bias in self versus others." *Personality and Social Psychology Bulletin*, 28(3), 369–381.
- Larrick, R.P. (2004). "Debiasing." In D. Koehler & N. Harvey (Eds.), *Blackwell Handbook of Judgment and Decision Making* (pp. 316–337). Blackwell.

---

#cognitive-biases #heuristics #behavioral-economics #dual-process #critical-thinking
