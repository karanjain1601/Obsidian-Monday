---
title: Security for Vibe Coders
aliases: [AI Security, Vibe Coding Security, Secure AI Development]
tags: [VibeCoding, StandardsAndSafety]
domain: Vibe Coding
difficulty: Intermediate
created: 2026-07-29
related: [Code_Quality_Standards, Maintaining_AI_Codebases, Vibe_Coding_Anti_Patterns, Version_Control_Workflow, Frontend_AI_Tools]
status: complete
---

# Security for Vibe Coders

> [!abstract] TL;DR
> AI-generated code has predictable security blind spots: hardcoded secrets, insecure auth flows, missing input validation, and weak supply chain practices. You cannot delegate security review to the AI — it will often confirm its own insecure code is fine. Human review of auth, secrets, and input handling is non-negotiable.

## Why AI-Generated Code Has Security Risk

AI models are trained to produce code that *works* — they optimise for functional correctness, not security. The typical AI blind spots:

1. **Hardcoded credentials** — AI produces examples with real-looking secrets; these end up in source code
2. **Overly permissive policies** — "just to make it work" RLS policies that allow all access
3. **Missing input validation** — happy-path code that assumes all inputs are well-formed
4. **Insecure authentication patterns** — rolling custom JWT implementations instead of using established libraries
5. **SQL injection via template literals** — mixing SQL and user input without parameterisation

None of these are intentional; they're training artifacts. Your job is to know where to look.

## Never Hardcode Secrets

This is the highest-priority security rule. **Environment variables only, always.**

**Bad (AI-generated "just to test"):**
```typescript
const stripe = new Stripe("sk_live_abc123realkey");
const db = postgres("postgresql://user:password@host/db");
```

**Good:**
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const db = postgres(process.env.DATABASE_URL!);
```

**CLAUDE.md addition:**
```markdown
## Security Rules
- NEVER hardcode API keys, passwords, or tokens. Always use process.env.VARIABLE_NAME
- Add all new env variables to .env.example with placeholder values
- NEVER commit .env files — always add to .gitignore
```

Add this before your first prompt. See [[Version_Control_Workflow]] for .gitignore discipline.

**If secrets are committed to git:** Assume they're compromised. Rotate them immediately. Use `git filter-branch` or BFG Repo Cleaner to remove from history — but if the repo was ever public or shared, the secret must be considered exposed.

## Reviewing AI-Generated Auth Code

Authentication is the highest-risk area in AI-generated code. AI tends to:
- Implement JWTs manually (high error surface) instead of using battle-tested libraries
- Miss token expiry validation
- Store tokens in `localStorage` instead of `httpOnly` cookies
- Not handle token rotation or revocation

**Rules:**
1. Use an established auth library (Clerk, Auth.js/NextAuth, Supabase Auth) — never roll your own
2. When AI generates auth-adjacent code, read every line manually
3. Ask explicitly: *"Does this auth implementation follow current OWASP recommendations? What are its weaknesses?"*
4. Test auth flows manually: can you access protected routes without login? Can you access other users' data?

**Security audit prompt for auth code:**
> "Review this authentication implementation as a security engineer. List every vulnerability or weakness, even theoretical ones. Don't sugarcoat — I need the complete picture."

## Input Validation Everywhere

AI-generated API routes frequently skip input validation, assuming inputs match the expected shape. This enables injection attacks, unexpected crashes, and data corruption.

**Always validate with zod (or equivalent) at every API boundary:**

```typescript
// AI-generated (insecure) - no validation
export async function POST(req: Request) {
  const { title, projectId } = await req.json();
  await db.task.create({ data: { title, projectId } });
}

// Correct pattern
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  projectId: z.string().cuid()
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = createTaskSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: result.error.message }, { status: 400 });
  }
  const { title, projectId } = result.data;
  await db.task.create({ data: { title, projectId } });
}
```

**CLAUDE.md rule:** "All API routes must validate input with zod before processing. No `req.json()` spread directly into DB operations."

## Supply Chain Awareness

AI will suggest npm packages to install. These introduce supply chain risk:
- Typosquatted packages (e.g., `cros` instead of `cors`)
- Abandoned packages with known CVEs
- Packages that pull in excessive dependencies

**Before installing any AI-suggested package:**
1. Verify the exact package name on npmjs.com
2. Check the download count and last publish date
3. Look at the package's GitHub repository
4. Run `npm audit` after installation

> "Before I install these packages, verify: are these the correct, official package names? Are they actively maintained? Any known security issues?"

## Row-Level Security in Supabase/PostgreSQL

If using Supabase or direct Postgres, AI-generated RLS policies tend to be either too permissive or completely absent:

```sql
-- AI-generated "just to make it work" (insecure)
CREATE POLICY "Enable all access" ON tasks FOR ALL USING (true);

-- Correct: users can only access their own tasks
CREATE POLICY "Users access own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
```

**Review every RLS policy.** Ask explicitly:
> "For each Supabase table, what is the RLS policy? Can a user access another user's data through any of these policies?"

```mermaid
flowchart TD
    A[New API Endpoint / Auth Feature] --> B[Read code manually]
    B --> C{Secrets hardcoded?}
    C -- Yes --> D[Replace with env vars immediately]
    C -- No --> E{Input validated?}
    E -- No --> F[Add zod validation]
    E -- Yes --> G{Auth check present?}
    G -- No --> H[Add auth middleware]
    G -- Yes --> I[Run security audit prompt]
    I --> J{Issues found?}
    J -- Yes --> K[Fix before committing]
    J -- No --> L[Commit]
```

## Prompt Injection in Code Generation

A less-obvious risk: if AI generates code that processes user input which is then passed back to an AI (e.g., an AI-powered feature in your app), that user input can contain **prompt injection** — instructions designed to override your system prompt and make the AI do unintended things.

If you're building AI features, validate and sanitise all user-provided text before it reaches an AI API call, and use a system prompt that explicitly instructs the model to ignore user attempts to override it.

## Security Checklist Before Shipping

Run this checklist before any production deployment:

```
[ ] No secrets in source code or git history
[ ] .env.example present with placeholder values, .env in .gitignore
[ ] All API endpoints validate input with zod
[ ] All protected routes check authentication
[ ] RLS policies reviewed for all database tables
[ ] npm audit passes (or known issues are accepted and documented)
[ ] Auth library used (not custom JWT)
[ ] HTTPS enforced (handled by Vercel/Railway automatically)
[ ] Error messages don't expose internal details to users
```

## Common Pitfalls
1. **Asking AI if its auth code is secure and accepting "yes"** — AI will often confirm its own insecure code; use the adversarial audit prompt instead
2. **Copying Lovable/v0 auth code into production without review** — scaffolding tools generate illustrative auth; always review before shipping
3. **Not rotating secrets after an accidental commit** — even if you delete the commit, the secret is exposed
4. **Skipping validation on "internal" APIs** — internal APIs are often the attack vector

## Review Questions
1. **What are the three highest-risk areas in AI-generated code for security?** *Answer: Hardcoded secrets, authentication flows, and missing input validation.*
2. **Why is asking the AI "is this code secure?" an unreliable security check?** *Answer: AI optimises for functional correctness and will often confirm its own insecure code; adversarial audit prompts ("list every vulnerability") produce better results.*
3. **What is the correct response if a secret is accidentally committed to git?** *Answer: Rotate the secret immediately (assume it's compromised), remove it from git history with BFG/filter-branch, and if the repo was ever public, treat it as fully exposed.*

## See Also
- [[Maintaining_AI_Codebases]] — keeping security posture healthy over time
- [[Version_Control_Workflow]] — .gitignore discipline to prevent secret commits
- [[Vibe_Coding_Anti_Patterns]] — accepting AI output without security review
- [[Frontend_AI_Tools]] — reviewing auth in Lovable/v0 generated code
