---
title: LLM API Integration Patterns
aliases: [LLM Integration, Claude API, OpenAI Integration, AI API Patterns]
tags: [ai-product, llm, api, integration, patterns]
domain: AI Product Builder
difficulty: Intermediate
created: 2026-07-29
related: [AI_Product_Strategy, AI_UX_Design, Evaluating_AI_Outputs, AI_Product_Metrics]
status: complete
---

# LLM API Integration Patterns

> [!abstract] TL;DR
> LLM API integration patterns go far beyond a single `messages.create()` call: RAG (Retrieval Augmented Generation) adds context from your data, tool use/function calling lets LLMs take actions, streaming responses improve perceived performance, and multi-turn conversations maintain state. Each pattern has cost, latency, and reliability trade-offs. Structured outputs (JSON mode) make LLM responses safe to parse programmatically.

## Basic Chat Completion

```python
# Using Anthropic Claude
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system="You are a helpful assistant for a developer documentation platform.",
    messages=[
        {"role": "user", "content": "How do I set up webhooks?"}
    ]
)

print(response.content[0].text)
print(f"Input tokens: {response.usage.input_tokens}")
print(f"Output tokens: {response.usage.output_tokens}")
print(f"Cost estimate: ${response.usage.input_tokens * 3/1_000_000 + response.usage.output_tokens * 15/1_000_000:.4f}")
```

### System Prompt Design

```python
system_prompt = """You are a support assistant for Example API.

Your capabilities:
- Answer questions about API endpoints and parameters
- Help debug common error codes
- Explain concepts (authentication, rate limiting, pagination)

Your limitations:
- You cannot access user account data
- You cannot make API calls on behalf of users
- For billing questions, direct to billing@example.com

Response style:
- Be concise (< 200 words for simple questions)
- Include code examples when explaining technical concepts
- Use Python for code examples unless user specifies another language
- Acknowledge uncertainty with "I'm not certain, but..." rather than stating potentially incorrect information

Conversation context:
Today's date: {date}
Documentation version: v2.3.0
"""
```

---

## Streaming Responses

For long responses, streaming dramatically improves perceived performance — the user sees text appearing rather than waiting 5 seconds for a full response:

```python
# Streaming with Anthropic
with client.messages.stream(
    model="claude-opus-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a tutorial on using webhooks."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    
    # Get final message after streaming
    final_message = stream.get_final_message()
```

```typescript
// Streaming in a Next.js API route
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-opus-4-5'),
    messages,
  });

  return result.toDataStreamResponse(); // Vercel AI SDK streaming response
}
```

```javascript
// Client-side consumption of streaming response
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  setContent(prev => prev + text); // React state update
}
```

---

## RAG — Retrieval Augmented Generation

RAG solves the LLM knowledge cutoff problem: instead of relying on the model's training data, you retrieve relevant context from your own data and include it in the prompt.

```mermaid
graph LR
    Q[User question] --> E[Embed question\ntext → vector]
    E --> VS[(Vector Store\nPinecone / pgvector)]
    VS --> |Top-k similar chunks| C[Retrieved context]
    C --> P[Augmented prompt:\n'Use this context:\n{context}\n\nAnswer: {question}']
    P --> LLM[LLM]
    LLM --> A[Answer]
```

### Implementing RAG

```python
from anthropic import Anthropic
import numpy as np

client = Anthropic()

# Step 1: Embed the query
def embed_text(text: str) -> list[float]:
    # Using Anthropic's embedding (or OpenAI, Cohere, etc.)
    # For this example using a mock; in practice use a real embedding model
    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1,
        messages=[{"role": "user", "content": f"Embed: {text}"}]
    )
    # In practice, use a dedicated embedding endpoint
    return []  # placeholder

# Step 2: Search vector store for relevant chunks
def search_docs(query: str, top_k: int = 5) -> list[str]:
    # Using pgvector (PostgreSQL) or Pinecone
    # This is pseudocode — adapt to your vector store
    query_vector = embed_text(query)
    
    # pgvector query:
    # SELECT content, 1 - (embedding <=> $1) AS similarity
    # FROM doc_chunks
    # ORDER BY similarity DESC
    # LIMIT $2
    
    return ["chunk1...", "chunk2...", "chunk3..."]  # relevant document chunks

# Step 3: Generate answer with retrieved context
def answer_with_rag(question: str) -> str:
    relevant_chunks = search_docs(question)
    context = "\n\n---\n\n".join(relevant_chunks)
    
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system="""Answer questions using only the provided context. 
If the context doesn't contain enough information to answer, say so explicitly.""",
        messages=[{
            "role": "user",
            "content": f"""Context:
{context}

Question: {question}"""
        }]
    )
    
    return response.content[0].text
```

### Chunking Strategy

```python
def chunk_document(text: str, chunk_size: int = 512, overlap: int = 64) -> list[str]:
    """Sliding window chunking with overlap."""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap  # overlap ensures context at chunk boundaries
    
    return chunks
```

**Chunking trade-offs:**
- Too small (64 tokens): chunks lack context; retrieval finds fragments
- Too large (2000 tokens): chunks include irrelevant content; retrieval is imprecise
- Sweet spot: 256-512 tokens with 10-15% overlap

---

## Tool Use / Function Calling

Tool use lets the LLM invoke functions in your codebase — turning LLMs from text generators into action-taking agents:

```python
import json

# Define tools
tools = [
    {
        "name": "get_user",
        "description": "Retrieve a user by their ID from the database.",
        "input_schema": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "The UUID of the user to retrieve"
                }
            },
            "required": ["user_id"]
        }
    },
    {
        "name": "send_email",
        "description": "Send an email to a user.",
        "input_schema": {
            "type": "object",
            "properties": {
                "user_id": {"type": "string"},
                "subject": {"type": "string"},
                "body": {"type": "string"}
            },
            "required": ["user_id", "subject", "body"]
        }
    }
]

def run_agent_loop(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]
    
    while True:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )
        
        # If LLM returned text (final answer)
        if response.stop_reason == "end_turn":
            return response.content[0].text
        
        # If LLM wants to use a tool
        if response.stop_reason == "tool_use":
            tool_results = []
            
            for block in response.content:
                if block.type == "tool_use":
                    # Execute the actual function
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })
            
            # Add LLM response + tool results to conversation
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})

def execute_tool(name: str, inputs: dict) -> dict:
    if name == "get_user":
        return db.get_user(inputs["user_id"])
    elif name == "send_email":
        return email_service.send(inputs["user_id"], inputs["subject"], inputs["body"])
    raise ValueError(f"Unknown tool: {name}")
```

---

## Structured Outputs (JSON Mode)

Make LLM responses machine-parseable:

```python
import json
from pydantic import BaseModel

class SupportTicketClassification(BaseModel):
    category: Literal["billing", "technical", "account", "general"]
    priority: Literal["low", "medium", "high", "critical"]
    sentiment: Literal["positive", "neutral", "negative", "angry"]
    summary: str
    requires_human: bool

def classify_ticket(ticket_text: str) -> SupportTicketClassification:
    schema = SupportTicketClassification.model_json_schema()
    
    response = client.messages.create(
        model="claude-haiku-4-5",  # Haiku is fast + cheap for classification
        max_tokens=500,
        system=f"""Classify support tickets. Respond ONLY with valid JSON matching this schema:
{json.dumps(schema, indent=2)}""",
        messages=[{"role": "user", "content": ticket_text}]
    )
    
    data = json.loads(response.content[0].text)
    return SupportTicketClassification(**data)
```

**Reliability note:** JSON mode is reliable for Haiku/GPT-4 but not 100% guaranteed. Always wrap in `try/except json.JSONDecodeError` and retry on failure.

---

## Multi-Turn Conversations

```python
class ConversationManager:
    def __init__(self, system_prompt: str):
        self.system = system_prompt
        self.history: list[dict] = []
        self.max_history_tokens = 8000  # prevent context overflow
    
    def chat(self, user_message: str) -> str:
        self.history.append({"role": "user", "content": user_message})
        
        # Trim history to avoid context overflow
        self._trim_history()
        
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            system=self.system,
            messages=self.history,
        )
        
        assistant_message = response.content[0].text
        self.history.append({"role": "assistant", "content": assistant_message})
        
        return assistant_message
    
    def _trim_history(self):
        """Remove oldest messages if history is too long."""
        # Rough token estimate: 4 chars ≈ 1 token
        total_chars = sum(len(m["content"]) for m in self.history)
        
        while total_chars > self.max_history_tokens * 4 and len(self.history) > 2:
            removed = self.history.pop(0)  # remove oldest
            total_chars -= len(removed["content"])
```

---

## Cost Optimization

```python
# Model selection by task complexity
def select_model(task: str) -> str:
    if task in ["classification", "routing", "extraction"]:
        return "claude-haiku-4-5"      # $0.25/1M input, $1.25/1M output
    elif task in ["summarization", "translation"]:
        return "claude-sonnet-4-5"     # $3/1M input, $15/1M output
    else:  # complex reasoning, code generation, multi-step
        return "claude-opus-4-5"       # $15/1M input, $75/1M output

# Prompt caching (reduces cost for repeated system prompts)
response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": LONG_SYSTEM_PROMPT,
        "cache_control": {"type": "ephemeral"}  # cache this for 5 minutes
    }],
    messages=messages,
)
```

---

## Common Pitfalls

- **No retry logic for API failures.** LLM APIs have occasional 500/503 errors. Always implement exponential backoff with jitter.
- **Unbounded context growth in multi-turn conversations.** Without trimming, long conversations eventually exceed the context window and fail. Implement `_trim_history()` or summarize old context.
- **Structured output without validation.** LLMs occasionally output malformed JSON despite instructions. Always validate with Pydantic or `json.loads` in a try/except.
- **Using GPT-4/Opus for everything.** Classification and extraction tasks are 10–20x cheaper with Haiku/GPT-3.5. Route tasks to the minimum model that handles them correctly.
- **No token counting before production.** An average user message might be 50 tokens; a RAG-augmented prompt might be 5,000 tokens. Calculate expected cost per request before launch.

---

## Review Questions

1. What problem does RAG solve, and why is chunking strategy important for RAG quality?
2. Explain the tool use / function calling loop: what does the LLM return, what does your code do, and how does the loop terminate?
3. A multi-turn conversation grows to 200,000 tokens. What happens, and how do you prevent it?
4. You need to classify 1 million support tickets per month into 5 categories. Compare the cost of using claude-haiku-4-5 vs claude-opus-4-5. Which would you choose?
5. Streaming responses don't reduce latency (time-to-complete is the same). Why do they dramatically improve user experience?
