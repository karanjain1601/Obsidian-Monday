---
title: Conference and Events
aliases: [DevRel Conferences, CFP, Speaking, Hackathons]
tags: [devrel, conferences, speaking, hackathons, events]
domain: DevRel
difficulty: Intermediate
created: 2026-07-29
related: [DevRel_Overview, Developer_Content, Community_Building]
status: complete
---

# Conference and Events

> [!abstract] TL;DR
> Conferences and events are where DevRel builds in-person relationships and brand presence. Writing strong CFP abstracts, delivering demo-driven technical talks, and running effective workshops are core skills. Hackathon sponsorship drives product trial at scale. Virtual events (webinars, live coding) extend reach. Key DevRel conferences include DevRelCon, API World, and KubeCon.

## Conference Speaking Strategy

### Why Speak at Conferences

- **Thought leadership:** being seen as an expert in a technical area
- **Brand awareness:** company name in front of concentrated developer audiences
- **Content production:** talks become YouTube videos, blog posts, and documentation
- **Recruiting:** developers who attend your talk may want to work with you
- **Community building:** find and meet top developers in your space in person

### Which Conferences to Target

**Tier 1 — Must attend (largest audiences, most relevant):**
- KubeCon + CloudNativeCon (cloud infrastructure, 10k+ attendees)
- React Conf, ng-conf, VueConf (frontend-specific)
- PyCon, RustConf, GopherCon (language-specific)
- Google I/O, AWS re:Invent, Microsoft Build (platform-specific)

**Tier 2 — Valuable for ecosystem presence:**
- Local developer meetups (high conversion, lower reach)
- Niche technical conferences in your space
- University events (early-career developers)

**Tier 3 — Evaluate ROI carefully:**
- Generic "tech" conferences with mixed audiences
- Pay-to-speak conferences (low quality signal)
- Conferences where your users don't attend

---

## CFP Writing — Call for Papers

A CFP abstract is the make-or-break document. Selection committees receive 10x more proposals than they can accept.

### Abstract Structure

```
Title: [Specific, attention-grabbing, keyword-rich]
Bad:   "Introduction to Serverless"
Good:  "From 200ms to 2ms: Moving Authentication to the Edge with Cloudflare Workers"

Abstract (250-500 words):
1. Hook (1-2 sentences): the problem or insight that grabs attention
2. Context (2-3 sentences): why this matters to the audience right now
3. What you'll teach (3-5 bullets): specific takeaways, not vague "insights"
4. Who this is for (1 sentence): "Developers who have built REST APIs and want to understand edge compute"
5. Closing hook: what the audience will be able to do after your talk

Speaker bio (100-150 words):
- Current role and company
- Relevant technical experience
- Previous speaking (if any)
- One personal detail (makes you human)
```

### CFP Abstract Example

```
Title: Rollback Netcode in 60 Minutes: Building Multiplayer Games That Don't Lag

Every developer who's played a fighting game has felt it: the desync, the rollback, 
the momentary glitch when the game corrects a prediction. But implementing netcode 
that *works* is one of the hardest problems in game development.

In this session, we'll implement rollback netcode from scratch in TypeScript — the 
same technique used by Street Fighter 6, Guilty Gear Strive, and GGPO. You'll leave 
with working code and a deep understanding of why rollback is superior to delay-based 
netcode for competitive games.

You'll learn:
- Why input delay netcode fails at 100ms+ latency and rollback thrives
- How to implement a save/restore game state system in < 50 lines
- The exact math behind GGPO's input prediction algorithm  
- How to measure netcode quality and debug desyncs

This talk is for developers with multiplayer game experience or strong networking 
knowledge. Demo code available on GitHub before the talk starts.
```

### CFP Tips

- **Submit early.** Most committees have a soft deadline (stop reading after the first N proposals)
- **Title matters more than abstract.** Reviewers skim — a weak title means they don't read the abstract
- **Be specific.** "You'll learn 3 specific algorithms" > "You'll get a better understanding"
- **Include talk history.** A recording of a past talk dramatically improves acceptance rate
- **Align with the conference theme.** Read the call for papers carefully — what are they optimizing for?

---

## Demo-Driven Talks

Technical talks without live demos are lectures. Developers learn by watching things work.

### Demo Structure

```
Opening (5 min):
  - State the problem: "Writing a REST API that handles 100k req/s in a single data center is fine.
    But what about users in Australia when your servers are in Virginia?"
  - Show the pain: live demo of slow API response from far away

First demo (10-15 min):
  - Build the first working version: Workers script that proxies to origin
  - "Let's deploy this" → show wrangler deploy → it's live globally in 10 seconds
  - Measure the improvement: show response time from Australia → now 20ms

Second demo (10-15 min):
  - Add the interesting part: edge caching, geolocation routing, or whatever the talk is about
  - Explain as you type: "I'm using request.cf.country here because..."

Third demo / finale (5-10 min):
  - Production-realistic example: all pieces together
  - Show surprising result: "This is running in 300 data centers simultaneously"

Q&A (10 min)
```

### Demo Safety Net

Live demos fail. Always have a safety net:

```
1. Record the full demo working the night before (video backup)
2. Have pre-written code on GitHub (show "here's the finished version")
3. Have screenshots of expected output for each step
4. Practice the demo 3+ times including on conference venue WiFi (or hotspot)
5. Use `--dry-run` or sandbox mode if your demo could accidentally affect production
```

### Talk Timing Practice

```
At 30 min target:
  - Practice talk must clock at 25-27 min (talks run long under pressure)
  - Time each section individually: intro / demo1 / demo2 / conclusion / Q&A
  - Cut mercilessly: 1 clear insight remembered > 5 rushed insights forgotten
```

---

## Running Workshops

Workshops (45-90 min, hands-on labs) are higher conversion than talks:
- Attendees build something real with your product
- Direct 1:1 interaction identifies friction points

### Workshop Design

```
Pre-reqs document (send 1 week before):
  - Required software: Node.js 18+, Git, VS Code
  - Account setup: Create a Cloudflare account (free)
  - Pre-install: npm install -g wrangler && wrangler login
  - Estimated setup time: 15 minutes
  
  If attendees don't do pre-reqs, first 20 min of workshop is troubleshooting.
  
Workshop starter repo:
  - Complete: git clone https://github.com/example/workshop-starter
  - Contains: skeleton code with TODOs that attendees fill in
  - Contains: solution branch (for attendees who fall behind)
  - README: numbered steps matching the workshop

Pacing:
  Step 1-3: Everyone follows together (facilitator on screen)
  Step 4-8: Pair work (attendees work with neighbor, facilitator circulates)
  Step 9+: Independent (fast finishers extend; slow finishers use solution branch)
```

---

## Hackathon Sponsorship

### Hackathon Sponsorship Tiers

| Tier | Benefits | Typical cost |
|---|---|---|
| **Title sponsor** | Brand on all materials, keynote slot, dedicated track | $15k–50k |
| **Track sponsor** | Run a themed track with prizes | $5k–20k |
| **Prize sponsor** | Sponsor a prize category, mention at ceremony | $1k–5k |
| **Participant sponsor** | Free API credits for all participants | $500–2k |

### Post-Hackathon Follow-Up

```
1. Announce winners publicly (blog post + social)
2. Feature top projects as case studies
3. Reach out directly to top 5 projects:
   - Offer extended free API credits
   - Offer to help them continue building
   - Ask if they'd do a blog post or case study
4. Incorporate bugs found during hackathon into bug backlog
5. Blog: "10 projects built with our API at [Hackathon Name]"
```

---

## Virtual Events

### Webinars

```
Format: 45-60 min Zoom/YouTube Live
Structure:
  - 10 min: context and motivation
  - 25 min: live demo or deep dive
  - 15 min: Q&A

Best practices:
  - Promote 7 days before (email + Discord + social)
  - Record and post within 24 hours
  - Post the demo code/GitHub link in chat during the webinar
  - Send follow-up email with recording + resources
  - Track: registration rate, attendance rate, post-event conversion
```

### Live Coding Sessions

Live coding on Twitch/YouTube creates authentic developer content:
- Stream building something from scratch with your product
- Encounter and solve real problems on stream (authenticity)
- Answer questions from chat in real time
- Session becomes recorded content for async consumption

---

## Key DevRel Conferences

| Conference | Focus | Scale |
|---|---|---|
| **DevRelCon** | Developer Relations profession | 300-500 DevRel practitioners |
| **API World** | API design, developer experience | 3,000+ developers |
| **DeveloperWeek** | Developer tools ecosystem | 8,000+ developers |
| **KubeCon** | Cloud native, Kubernetes | 10,000+ |
| **GitHub Universe** | Open source, developer tools | 5,000+ |
| **Heavybit Industries events** | Developer-focused companies | 200-500 DevRel + founders |

---

## Common Pitfalls

- **CFP submissions without past speaking evidence.** First-time speakers rarely get into tier-1 conferences. Build your portfolio at local meetups, then Tier 2 conferences, then submit to Tier 1.
- **Talks that become product demos.** A talk that's 90% "look at our product" is perceived as advertising. Lead with the developer's problem; use your product as the solution demonstration.
- **Workshop prerequisites skipped.** 40% of attendees arrive at workshops with incomplete setup. Build a pre-workshop check script: `npx check-prerequisites` that validates everything.
- **No post-hackathon follow-up.** Hackathons with no post-event engagement produce zero long-term developer relationships. Follow up with every submission.
- **Virtual events at bad times.** 9am PST is brutal for European attendees; 9am GMT misses Asia. Run a second session at a different time, or record and promote async attendance.

---

## Review Questions

1. Write a CFP title for a 30-minute talk about using AI to improve code review. Make it specific and attention-grabbing.
2. Your live demo fails at a conference (WiFi is down). What do you do in the next 30 seconds?
3. What is the difference in audience intent between a conference talk and a workshop? How does this change the format?
4. A hackathon sponsor offers you title sponsorship. What should your post-event deliverables be to justify the investment?
5. Your webinar has 500 registrations but only 80 attendees (16% attendance rate). Industry average is 35%. What are three things to investigate?
