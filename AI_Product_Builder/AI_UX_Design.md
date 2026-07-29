---
title: AI UX Design
aliases: [AI Product UX, Designing AI Interfaces, LLM UX]
tags: [ai-product, ux, design, interface, chatbot]
domain: AI Product Builder
difficulty: Intermediate
created: 2026-07-29
related: [AI_Product_Strategy, LLM_API_Integration, Evaluating_AI_Outputs]
status: complete
---

# AI UX Design

> [!abstract] TL;DR
> AI UX must account for AI's unique properties: non-determinism (same input → different output), errors (hallucinations), latency (seconds per response), and evolving capabilities. Good AI UX sets accurate expectations upfront, shows AI working in progress (streaming + skeleton states), gracefully handles errors (with recovery paths), and collects user feedback to improve the model. The best AI UX feels like a smart collaborator, not a command-line tool.

## AI UX Principles

### 1. Set Accurate Expectations

AI is not omniscient. Over-promising leads to user disappointment and distrust:

```
❌ "Our AI knows everything about your codebase."
✅ "Our AI has read your documentation and can answer questions about your API — 
    it may not know about undocumented behavior or very recent changes."

❌ "Get instant AI-powered answers."  
✅ "AI-powered answers in 2–5 seconds."

❌ "AI will write your code for you."
✅ "AI will help you write and debug code — you remain in control."
```

**Frame AI as a collaborator, not an oracle.** Users who understand AI limitations are more likely to verify outputs and less likely to feel betrayed when errors occur.

### 2. Show Work in Progress

AI generation takes 1–5 seconds. Users need feedback immediately:

```
Loading patterns (in order of quality):
1. Streaming text output — best (user sees tokens appear in real time)
2. Typing indicator + streaming — good (shows activity immediately)
3. Loading spinner → full response — acceptable for short responses only
4. Blank screen until complete — bad (user doesn't know if it's working)
```

```tsx
// Streaming display component
function AIResponse({ streamedText, isStreaming }: { streamedText: string; isStreaming: boolean }) {
  return (
    <div className="ai-response">
      <ReactMarkdown>{streamedText}</ReactMarkdown>
      {isStreaming && (
        <span className="cursor-blink">▌</span>  // blinking cursor during streaming
      )}
    </div>
  );
}
```

### 3. Graceful Error Handling

AI errors are different from API errors: the request succeeded (200 OK) but the output is wrong.

```tsx
function AIOutputDisplay({ output, onRegenerate, onReport }: AIOutputProps) {
  return (
    <div>
      <div className="ai-output">{output}</div>
      
      {/* Always provide recovery paths */}
      <div className="ai-actions">
        <button onClick={onRegenerate}>🔄 Try again</button>
        <button onClick={onReport}>👎 This was wrong</button>
        <a href="/docs/limitations">What AI can and can't do</a>
      </div>
    </div>
  );
}
```

**Recovery paths for AI errors:**
- Regenerate (different output on re-run due to non-determinism)
- Rephrase (prompt the user to provide more context)
- Manual fallback (let the user complete the task without AI)
- Contact support (escalate for systematic errors)

### 4. Confirmation for Consequential Actions

When AI takes actions (sending emails, modifying data, making purchases), always show confirmation:

```
❌ AI agent: "I've sent the cancellation email to all 500 users."

✅ AI agent: "I'm ready to send the cancellation email to 500 users.
              Here's a preview:
              [email preview]
              
              [Send 500 emails] [Edit] [Cancel]"
```

**Rule of thumb:** reversible actions (drafting, summarizing) can be performed without confirmation. Irreversible actions (sending, deleting, purchasing) must show a confirmation step with a preview.

---

## Chat Interface Design

Most AI products use a chat interface. Key design decisions:

### Prompt Input Design

```tsx
// Chat input with good UX:
function ChatInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState('');
  
  return (
    <div className="chat-input-container">
      {/* Suggested prompts for new users */}
      {value === '' && (
        <div className="prompt-suggestions">
          <button onClick={() => setValue("Explain how authentication works")}>
            Explain how authentication works
          </button>
          <button onClick={() => setValue("How do I set up webhooks?")}>
            How do I set up webhooks?
          </button>
        </div>
      )}
      
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Ask anything about our API..."
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(value);
            setValue('');
          }
        }}
        rows={value.split('\n').length + 1}  // auto-expand
      />
      
      <div className="input-hints">
        <span>Enter to send · Shift+Enter for new line</span>
        <span className="char-count">{value.length}/2000</span>
      </div>
    </div>
  );
}
```

### Message History Display

```tsx
// Differentiate AI vs user messages clearly
function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  return (
    <div className={`message ${role === 'user' ? 'user-message' : 'ai-message'}`}>
      {role === 'assistant' && (
        <div className="ai-badge">
          <SparklesIcon /> AI
        </div>
      )}
      
      {/* Render markdown for AI messages */}
      {role === 'assistant' 
        ? <ReactMarkdown>{content}</ReactMarkdown>
        : <p>{content}</p>
      }
      
      {/* Action buttons on AI messages */}
      {role === 'assistant' && (
        <div className="message-actions">
          <button title="Copy"><CopyIcon /></button>
          <button title="Helpful"><ThumbUpIcon /></button>
          <button title="Not helpful"><ThumbDownIcon /></button>
        </div>
      )}
    </div>
  );
}
```

---

## Non-Chat AI UX Patterns

Not all AI interactions are chat. Common non-chat patterns:

### Inline AI Suggestions

```
Word processor with AI:
  User types "The report shows that"...
  [AI autocomplete: "revenue increased by 23% compared to Q3"] (ghost text)
  User presses Tab to accept, or keeps typing to ignore
```

### AI Sidebar

```
Main content area (user's document/code/data)    | AI Assistant
─────────────────────────────────────────────────┼────────────
User's work lives here                           | Chat about
User edits directly                              | the content
AI suggestions appear inline                     | visible in
                                                 | main pane
```

### AI Wizard (Step-by-Step)

```
Step 1: "What kind of API are you building?"
  [REST API] [GraphQL] [WebSocket]

Step 2: AI generates a boilerplate starter
  [View generated code]
  [Regenerate] [Customize prompt]

Step 3: "What should this endpoint do?"
  User describes in natural language
  AI writes the handler function
  [Accept] [Edit] [Start Over]
```

### AI-Augmented Forms

```
Traditional form:                   AI-augmented form:
─────────────────                   ──────────────────────────────
Job description: [text area]        Describe the job: [text area]
                                                 ↓ (AI processes)
                                    Title:       [Software Engineer III] ✏️
                                    Level:       [Senior]                ✏️
                                    Requirements:[Generated list]        ✏️
                                    Salary:      [$120k-$150k]          ✏️
                                    
                                    [Edit any field] [Approve all]
```

---

## Confidence and Uncertainty

AI should communicate uncertainty rather than stating uncertain things confidently:

```
Low confidence indicators:
  "I'm not certain, but..."
  "Based on the documentation, I believe..."
  "You may want to verify this, but..."
  "I don't have enough context to be sure — could you provide...?"

High confidence:
  Direct statement with source: "According to the API docs at [link]..."
  Factual statement: "The endpoint is /v2/users/{id}"
  Code that works: provide testable code

Never acceptable:
  Making up API endpoints or parameters
  Stating incorrect version numbers confidently
  Fabricating citation links
```

**Design pattern: "Source it"**

```tsx
function AIAnswer({ text, sources }: { text: string; sources: Source[] }) {
  return (
    <div>
      <div>{text}</div>
      {sources.length > 0 && (
        <div className="sources">
          <h4>Sources:</h4>
          {sources.map(s => (
            <a key={s.id} href={s.url}>{s.title}</a>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Collecting User Feedback

Feedback is critical for AI product improvement. Embed feedback collection naturally:

```tsx
// After every AI response:
function FeedbackButtons({ messageId, onFeedback }: FeedbackProps) {
  const [submitted, setSubmitted] = useState<'up' | 'down' | null>(null);
  
  const handleFeedback = async (signal: 'up' | 'down') => {
    setSubmitted(signal);
    await sendFeedback({ messageId, signal });
    
    // For thumbs down, ask for more context
    if (signal === 'down') {
      setShowFeedbackModal(true);
    }
  };
  
  return (
    <div className="feedback-row">
      <button 
        onClick={() => handleFeedback('up')}
        className={submitted === 'up' ? 'active' : ''}
      >👍</button>
      <button 
        onClick={() => handleFeedback('down')}
        className={submitted === 'down' ? 'active' : ''}
      >👎</button>
    </div>
  );
}
```

**Feedback storage schema:**
```sql
CREATE TABLE ai_feedback (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES ai_messages(id),
  user_id UUID REFERENCES users(id),
  signal VARCHAR(4) CHECK (signal IN ('up', 'down')),
  reason TEXT,          -- free text for thumbs-down
  input_tokens INTEGER, -- for cost analysis
  model VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Common Pitfalls

- **Chat-first default for all AI UX.** Chat is one pattern, not the only one. Many AI tasks (document editing, form filling, data analysis) have better non-chat UX.
- **No loading state for multi-second responses.** Users assume the page is broken when nothing happens for 3 seconds. Show streaming or a visible thinking state immediately.
- **AI errors indistinguishable from correct output.** If hallucinations look the same as correct answers, users can't calibrate trust. Add source citations and confidence signals.
- **No way for users to give feedback.** Without thumbs up/down, you can't improve the model or track quality over time.
- **Regenerate without context.** "Try again" that reruns the exact same prompt often produces the same output. Add context: "Try again with: 'Please be more concise'" or let the user edit their original prompt.

---

## Review Questions

1. Why should AI take consequential actions (sending emails, deleting data) with a confirmation step? What makes an action "consequential"?
2. Streaming responses don't reduce server processing time. Explain why they still dramatically improve perceived performance.
3. A user reports that your AI assistant made something up (hallucinated). What three UX mechanisms would help users identify and recover from hallucinations?
4. Compare the chat interface pattern vs the AI-augmented form pattern. Give a use case where the form pattern is superior.
5. You're adding thumbs up/down feedback to your AI product. What additional data should you capture alongside the signal, and why?
