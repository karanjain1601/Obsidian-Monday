---
title: Basic Prompting Techniques
aliases: [Prompting Basics, Zero-shot Few-shot, Role Prompting]
tags: [PromptEngineering, Foundations]
domain: Prompt Engineering
difficulty: Beginner
created: 2026-07-29
related: [Prompt_Engineering_Overview, Chain_of_Thought_Prompting, Structured_Output_Prompting]
status: complete
---

# Basic Prompting Techniques

> [!abstract] TL;DR
> The foundational prompt engineering toolkit includes zero-shot and few-shot prompting, role assignment, instruction formatting, output format control, and the careful use of delimiters. Mastering these six techniques covers the majority of real-world prompting scenarios before more advanced methods are needed.

## Zero-Shot Prompting

**Zero-shot prompting** means asking the model to perform a task with no examples — relying entirely on its pre-trained knowledge and instruction-following capability.

```
Classify the sentiment of the following customer review as POSITIVE, NEGATIVE, or NEUTRAL:

Review: "The product arrived on time but the packaging was damaged."

Sentiment:
```

Zero-shot works well when:
- The task is well-defined and common in training data (summarisation, translation, classification)
- You want to understand the model's baseline capability
- Token cost is a concern (no example tokens consumed)

It fails when the task is unusual, requires domain-specific formatting, or the model misinterprets the task scope.

## Few-Shot Prompting

**Few-shot prompting** provides 2–8 input–output examples before the actual query. Examples demonstrate the desired format, style, and reasoning pattern.

```
Classify sentiment as POSITIVE, NEGATIVE, or NEUTRAL.

Review: "Fast shipping and excellent quality." → POSITIVE
Review: "Completely wrong item delivered." → NEGATIVE
Review: "It works, nothing special." → NEUTRAL

Review: "The product arrived on time but the packaging was damaged." →
```

**Few-shot selection guidelines:**
- Examples should be diverse (cover edge cases and ambiguous inputs)
- Keep input–output format consistent across all examples
- 3–5 examples is usually the sweet spot; diminishing returns beyond 8
- Order matters slightly — models are recency-biased, so put your strongest examples last

## Role Prompting

Assigning a **role** or **persona** primes the model to activate relevant knowledge and stylistic patterns from its training data.

```
System: You are a senior software engineer at a high-growth startup with 12 years of
experience in distributed systems. You give precise, opinionated technical advice
and always consider production readiness, observability, and scalability.

User: What are the tradeoffs between Kafka and RabbitMQ for an event-driven microservices architecture?
```

Role prompting is particularly effective for:
- Domain expert responses (doctor, lawyer, financial advisor framing)
- Consistent tone and voice (formal, conversational, Socratic)
- Persona-based products (customer support bot, coding assistant)

> [!note] The role should match the task. "Act as a pirate" for a financial analysis task reduces quality; the role should activate domain-relevant patterns.

## Instruction Following

Clear, structured instructions outperform conversational phrasing for complex tasks:

**Weak:**
```
Can you maybe help me write a Python function that does something with a list?
```

**Strong:**
```
Write a Python function named `deduplicate_preserve_order` that:
1. Takes a list of any comparable elements as input
2. Returns a new list with duplicates removed, preserving first occurrence order
3. Runs in O(n) time complexity
4. Includes a docstring with parameters, return type, and one usage example
5. Uses only the Python standard library
```

**Instruction formatting best practices:**
- Use numbered lists for sequential steps
- Use bullet points for parallel requirements
- Lead with the action verb ("Write", "Summarise", "Classify", "Generate")
- Specify constraints explicitly (length, format, libraries allowed)
- State what to avoid as well as what to do

## Output Format Control

Explicitly requesting a specific output format dramatically improves parseability and consistency:

### JSON Output

```
Extract the following fields from the job posting and return as JSON:
- company_name (string)
- role_title (string)
- required_years_experience (integer, null if not specified)
- is_remote (boolean)
- salary_range (object with min and max, null if not specified)

Job posting:
"""
Senior Backend Engineer at TechCorp. 5+ years required. Remote-friendly.
Salary: $140,000–$180,000.
"""

Return only valid JSON, no additional text.
```

### Markdown Tables

```
Compare Python, Go, and Rust on the following dimensions:
- Memory management
- Concurrency model
- Compilation speed
- Ecosystem maturity

Format the answer as a markdown table with languages as columns and dimensions as rows.
```

### Bullet Points and Lists

Adding "respond in 5 bullet points" or "list the 3 most important reasons" constrains length and format simultaneously, which reduces verbosity and improves scannability.

## Delimiters

**Delimiters** separate distinct logical sections of a prompt, preventing the model from conflating instruction content with user-supplied data. This is critical for injection resistance and clarity.

### Triple Backticks

````
Summarise the following article in 3 sentences:

```
[Untrusted user-provided content goes here]
```
````

### XML Tags (Anthropic Best Practice)

```xml
<task>
Identify all dates mentioned in the document and return them as a JSON array.
</task>

<document>
The merger was announced on March 15, 2024, and is expected to close by Q4 2024.
The regulatory review period ends December 1, 2024.
</document>
```

XML tags are unambiguous, nestable, and resist injection because the model is unlikely to generate closing tags that match the outer structure.

### Triple Hyphens / Hash Markers

```
###INSTRUCTIONS###
Translate the text below to formal French.

###TEXT###
Hey, what's up? Wanna grab coffee later?

###OUTPUT###
```

## System Prompts vs. User Prompts

| Aspect | System Prompt | User Prompt |
|--------|--------------|-------------|
| Authority | Higher — harder for users to override | Standard |
| Purpose | Persona, constraints, format rules, safety | Task-specific request |
| Visibility | Usually hidden from end users | Visible in UI |
| Token budget | Shared with context window | Shared with context window |
| Best for | Persistent instructions, role, output schema | One-off or per-request instructions |

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system="You are a concise technical writer. Always respond in plain text, "
           "no markdown. Maximum 150 words per response.",
    messages=[
        {"role": "user", "content": "Explain what a database index is."}
    ]
)
print(response.content[0].text)
```

## Temperature and Sampling in Practice

```python
import openai

client = openai.OpenAI()

# Low temperature: classification, extraction, code generation
structured_response = client.chat.completions.create(
    model="gpt-4o",
    temperature=0.1,
    messages=[{"role": "user", "content": "Classify this email as spam or not spam: ..."}]
)

# High temperature: brainstorming, creative writing
creative_response = client.chat.completions.create(
    model="gpt-4o",
    temperature=0.9,
    messages=[{"role": "user", "content": "Give me 10 unique startup ideas for 2026"}]
)

# top_p as an alternative to temperature
precise_response = client.chat.completions.create(
    model="gpt-4o",
    temperature=1.0,
    top_p=0.1,  # Only sample from top 10% probability mass
    messages=[{"role": "user", "content": "What is 2+2?"}]
)
```

## Techniques Comparison Table

| Technique | Best Use Case | Token Cost | Reliability | Complexity |
|-----------|---------------|-----------|-------------|------------|
| Zero-shot | Common tasks, fast prototyping | Low | Medium | Low |
| Few-shot | Unusual formats, edge cases | Medium | High | Low |
| Role prompting | Expert knowledge, consistent tone | Low | Medium | Low |
| Structured instructions | Complex multi-part tasks | Low | High | Low |
| Output format control | Production parsing, APIs | Low | High | Low |
| XML delimiters | Multi-section prompts, injection safety | Low | Very High | Low |

## Common Pitfalls

> [!warning] Pitfall 1 — Contradictory Instructions
> "Be concise but thorough" or "avoid jargon but use technical terms" creates an impossible constraint. When instructions conflict, the model will make an arbitrary choice. Resolve contradictions explicitly: "Explain at a high-school level, using plain language; include one technical term with its definition."

> [!warning] Pitfall 2 — Poor Few-Shot Example Quality
> Low-quality or inconsistent examples teach the model the wrong pattern. If your examples have varying formats, the model will generate varying formats. If examples are too easy, the model won't learn edge-case handling. Always curate examples carefully.

> [!warning] Pitfall 3 — No Output Format Specification in Production
> Unspecified output format leads to responses that vary between prose, bullets, code blocks, and tables depending on model version and context. In any production integration, always specify the exact format and — for structured data — validate the output programmatically.

## Review Questions

> [!question] Q1 — When does few-shot prompting outperform zero-shot?
> **A:** Few-shot excels when the task has an unusual output format the model wouldn't infer from the task description alone, when the domain is niche, when edge cases need demonstration, or when consistency across runs is critical. Zero-shot is preferred when token cost matters and the task is standard.

> [!question] Q2 — Why use XML tags instead of triple backticks as delimiters?
> **A:** XML tags are semantically named (providing additional context), nestable for complex multi-section prompts, and less likely to appear in arbitrary user content. Triple backticks can appear in code snippets and markdown, potentially confusing the model about where the user content ends.

> [!question] Q3 — Should the same temperature be used for all tasks?
> **A:** No. Use low temperature (0.0–0.2) for deterministic tasks: classification, extraction, code generation, structured output. Use higher temperature (0.6–0.9) for creative, generative tasks where diversity is valuable. Mixing high temperature with structured output requirements often produces parsing failures.

## See Also

- [[Prompt_Engineering_Overview]]
- [[Chain_of_Thought_Prompting]]
- [[Structured_Output_Prompting]]
- [[LLM_Models_and_Providers]]
- [[_MOC_Prompt_Engineering_Master]]
