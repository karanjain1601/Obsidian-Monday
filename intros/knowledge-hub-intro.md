# KnowledgeHub: Introduction to All Topics

This document is a guided tour of the 22 sections in the KnowledgeHub notes library — a production-focused reference for engineers building, deploying, and reasoning about AI systems. The content targets staff-level engineers and is current as of May 2026.

---

## 01. Foundations

The architectural bedrock of modern LLMs. Start here to build the vocabulary used throughout every other section.

**What's covered:**
- **LLM Internals** — The transformer architecture end-to-end: self-attention, multi-head attention, feed-forward networks, layer normalization, residual connections, and positional encodings (RoPE, ALiBi). Includes MoE (Mixture-of-Experts), scaling laws, and native multimodality.
- **Tokenization** — BPE, WordPiece, Unigram LM; vocabulary design tradeoffs; multilingual fertility disparity; multimodal tokenization; practical cost estimation with tiktoken.
- **Attention Mechanisms** — Scaled dot-product attention derivation; MQA, GQA, and Grouped Query Attention; FlashAttention v1–v3; DeepSeek's Multi-Head Latent Attention (MLA); KV cache fundamentals.
- **Transformer Architecture** — Full GPT-style forward pass; modern variants (Llama 3, Mistral, Qwen); SSMs and hybrid attention-SSM models (Mamba, RWKV).
- **Embeddings and Vector Spaces** — Bi-encoders vs cross-encoders; contrastive training; distance metrics; Matryoshka embeddings; quantized embeddings; embedding drift and versioning.
- **Inference Pipeline** — Prefill vs decode phases; sampling strategies (top-k, top-p, temperature, min-p); TTFT/TPOT latency metrics; KV cache memory math; streaming and backpressure.

---

## 02. Model Landscape

How to pick the right model in a world of dozens of options, rapidly changing benchmarks, and wide price spreads.

**What's covered:**
- **Model Taxonomy** — Frontier vs open-weight; dense vs MoE; reasoning models; embedding-only models. Current families: Claude, GPT-5.5, Gemini 3.x, DeepSeek V4, Qwen 3.6, Llama 4, Mistral, Gemma 4.
- **Capability Assessment** — Why benchmarks mislead; building internal Elo-based evaluations; designing golden datasets; common eval pitfalls (position bias, verbosity bias, sycophancy in LLM judges).
- **Pricing and Costs** — Token-based pricing tables (as of May 2026); context caching discounts; self-hosting break-even analysis; full TCO including engineering and ops.
- **Model Selection Guide** — Structured decision process from requirements to selection; use-case-to-model-tier mapping; multi-model portfolio strategies and routing logic.

---

## 03. Training and Adaptation

Everything after pretraining: how to adapt a base model to your task without spending a fortune on GPU hours.

**What's covered:**
- **Pretraining Basics** — Causal language modeling objective; data curation and deduplication pipelines; Chinchilla scaling laws; training stability at ultra scale (ZeRO, gradient clipping).
- **Fine-Tuning Strategies** — When to fine-tune vs prompt vs RAG; supervised fine-tuning (SFT) with chat templates; continued pretraining for domain adaptation; PEFT vs full fine-tuning cost comparison.
- **LoRA / QLoRA / PEFT** — Low-rank decomposition mechanics; QLoRA 4-bit fine-tuning (NF4 + double quantization + paged optimizers); multi-LoRA serving (S-LoRA, punica); advanced variants (VeRA, GaLore, MoLoRA).
- **RLHF and DPO** — Classic RLHF with PPO; Direct Preference Optimization (DPO); online RL with verifiable rewards (RLVR, GRPO); training reasoning models with process reward models.
- **Knowledge Distillation** — Teacher-student paradigm; soft target loss; output vs feature distillation; self-distillation from chain-of-thought; quantization-aware distillation.
- **Synthetic Data Generation** — Evol-Instruct for recursive complexity growth; Constitutional AI and RLAIF; verifiable synthetic data in math/code; diversity sampling to avoid mode collapse.
- **Quantization** — FP32 → INT4 precision progression; GPTQ, AWQ, GGUF, EXL2 comparison; KV cache quantization as a VRAM game-changer; quantization-aware training (QAT).
- **Model Merging** — SLERP, TIES, DARE, linear weight averaging; mergekit YAML workflows; when merging beats multi-LoRA serving; merging failure modes.

---

## 04. Inference Optimization

Making LLM serving fast and economical — the discipline of squeezing more tokens-per-second from hardware you already own.

**What's covered:**
- **Inference Fundamentals** — Compute-bound prefill vs memory-bandwidth-bound decode; roofline model for bottleneck identification; H100/B200 FP8 acceleration; TTFT/TPOT/throughput SLA definitions.
- **KV Cache and Context Caching** — KV cache VRAM math; GQA for KV head reduction; RadixAttention (SGLang) and prefix caching (vLLM); API-level prompt caching (90% price discount at Anthropic/Google); RAD-O for CPU/NVMe offload.
- **Speculative Decoding** — Draft-verify paradigm; 2–3x speedup on aligned tasks; draft model selection criteria; acceptance rate and failure modes.
- **Batching Strategies** — Static vs dynamic vs continuous (iteration-level) batching; chunked prefill to flatten TTFT spikes; in-flight batching for mixed prefill-decode workloads; throughput analysis.
- **PagedAttention** — Non-contiguous physical KV blocks; logical-to-physical block table; copy-on-write for beam search; near-zero memory fragmentation.
- **Serving Infrastructure** — vLLM v0.7, SGLang v0.4, TensorRT-LLM, LMDeploy; tensor/pipeline/data parallelism; NCCL/NVLink/InfiniBand; SSE and gRPC streaming.
- **Cost Optimization Playbook** — Model cascading (cheap default + expensive frontier); small language models (Phi-3-mini, Gemma 2B); spot GPU strategies (60–90% savings); token-tax minimization.

---

## 05. Prompting and Context

Communicating intent to a language model reliably — from basic instruction clarity to automated prompt optimization.

**What's covered:**
- **Prompt Engineering Fundamentals** — Role-instruction-example-output structure; system prompt priority hierarchy; delimiters and XML tags; zero-shot vs few-shot efficiency.
- **Few-Shot and In-Context Learning** — Anatomy of a good example; dynamic example selection via embedding similarity; label correctness over format; prompt caching for few-shot examples.
- **Chain-of-Thought** — Zero-shot CoT ("let's think step by step"); thinking models (o1/o3, Claude extended thinking, DeepSeek-R1); test-time compute scaling; self-consistency; when CoT hurts.
- **Tree of Thought** — Branching vs sequential reasoning; propose-evaluate-search loop; MCTS applied to LLM reasoning; production cost guardrails.
- **Context Engineering** — Long-context paradigm (1M+ token windows); "lost in the middle" phenomenon; context budgeting; prompt caching economics; contextual compression.
- **Structured Generation** — JSON mode vs grammar-constrained decoding; function/tool calling schemas; Outlines and LM-Format-Enforcer; Pydantic validation retry loops.
- **Prompt Optimization with DSPy** — Modules, Signatures, and Teleprompters; MIPROv2 optimizer; treating prompts as weights; DSPy v2 production patterns.
- **Prompt Injection Defense** — Direct vs indirect injection; dual-LLM pattern (privileged + unprivileged); XML input isolation; jailbreak-aware output filtering; agentic privilege escalation.

---

## 06. Retrieval Systems

Building a RAG pipeline that actually works — from ingestion to retrieval to generation, at production scale.

**What's covered:**
- **RAG Fundamentals** — RAG vs long-context (the hybrid era); the retrieval quality gap; production architecture decisions.
- **Chunking Strategies** — Recursive structure splitting; semantic chunking; hierarchical parent-child chunks; content-specific strategies for code, tables, and PDFs.
- **Embedding Models** — Matryoshka embeddings; late interaction (ColBERT v2); binary/INT8 quantization; multimodal embeddings; model economics.
- **Vector Databases** — HNSW, IVF, PQ indexing; Pinecone, Weaviate, Qdrant, pgvector, Chroma, Milvus comparison; metadata filtering; managed vs self-hosted TCO.
- **Hybrid Search** — Dense + sparse (BM25/SPLADE) fusion with Reciprocal Rank Fusion (RRF); tuning alpha; production baseline.
- **Reranking** — Cross-encoder rerankers (Cohere Rerank, Jina, bge-reranker); LLM-based reranking; SLM distillation; cost-latency tradeoffs.
- **GraphRAG** — Microsoft GraphRAG; community summarization for global corpus reasoning; when vector RAG fails (multi-hop, global queries).
- **Agentic RAG** — Self-RAG, Corrective RAG (CRAG), Adaptive RAG; multi-hop reasoning loops; plan revision on poor retrieval.
- **Advanced Retrieval Patterns** — Query decomposition; HyDE (Hypothetical Document Embeddings); Anthropic's Contextual Retrieval (67% fewer failures).
- **Late Interaction / ColBERT** — MaxSim scoring; PLAID indexing; RAGatouille; cross-encoder accuracy at bi-encoder speed.
- **Multimodal RAG** — Page-as-image with ColPali-style models; table and chart extraction; vision-language models for document understanding.
- **RAG Evaluation** — The RAG Triad (faithfulness, answer relevance, context precision); RAGAS; LLM-as-judge; golden test sets; automated regression.
- **Production RAG at Scale** — Semantic caching; query routing; multi-tenant isolation; cost/latency SLAs; scaling to millions of documents.

---

## 07. Agentic Systems

Building AI agents that take actions in the world — the discipline that sits above inference and retrieval.

**What's covered:**
- **Agent Fundamentals** — The agent formula (perception → reasoning → action → memory); System 1 vs System 2 modes; agency levels; production patterns.
- **Reasoning Loops** — ReAct (Reason+Act); Reflexion; Plan-and-Solve; LangGraph flow engineering; structured reasoning patterns.
- **Tool Use and MCP** — Tool-use mechanism; MCP 2.0 (Streamable HTTP + OAuth 2.1); A2A v1.0; the protocol landscape (MCP + A2A + ACP).
- **Multi-Agent Orchestration** — Supervisor pattern; swarms; graph-based orchestration; cross-vendor A2A; LangGraph/AutoGen/CrewAI comparison (2026 landscape).
- **Agent Memory and State** — 4-tier memory hierarchy (Working/Episodic/Semantic/Procedural); Mem0, Letta, Zep, Cognee comparison; failure modes.
- **Planning and Decomposition** — Static vs dynamic planning; CoT/o1 reasoning for planning; recursive task decomposition; MCTS for search.
- **Error Handling and Recovery** — Agent failure taxonomy; self-correction loops; stateful rollbacks and checkpointing; "stuck in loop" detection.
- **Human-in-the-Loop Patterns** — Interrupt/breakpoint patterns; time-travel debugging; confidence-based escalation; co-reasoning.
- **Agentic Security and Sandboxing** — Attack surface; E2B/Docker sandboxing; minimum-agency principle; permission scoping; audit logging.
- **Evaluating Agentic Systems** — Trajectory benchmarks; LLM-as-judge for step quality; key metrics (task completion, error rate, cost per task).

---

## 08. Memory and State

The full memory stack for agents and long-running applications — from the KV cache to durable long-term stores.

**What's covered:**
- **Memory Architectures** — L1 (Working), L2 (Episodic), L3 (Semantic) hierarchy; memory consolidation patterns; production implementations.
- **Short-Term Context** — KV cache tiling; prefix caching; sliding windows vs summarization; contextual compression.
- **Long-Term Memory** — Episodic and semantic long-term stores; hybrid vector-graph storage; memory pruning and decay; multi-tenancy.
- **Agentic Memory with Mem0** — Mem0 digest loop; self-updating memories; LangGraph integration; Zep/Letta/Cognee comparison.
- **Semantic Caching** — Exact vs semantic cache matching; RedisVL and GPTCache; 30–70% cost reduction; multimodal caching.
- **State Management Patterns** — State objects; LangGraph state machines; checkpointing and resume; parallel state (fork/join); time-travel.

---

## 09. Frameworks and Tools

The ecosystem of libraries, orchestration frameworks, and developer tools for building AI systems.

**What's covered:**
- **LangChain** — LCEL composable chains; standard abstractions (Runnable, Document, BaseMessage); ecosystem overview.
- **LangGraph** — Stateful cyclic graph runtime; state management and persistence; multi-agent patterns; production patterns.
- **LangSmith** — Observability pyramid; tracing and trajectory debugging; dataset-based unit testing; automated evaluators; comparison with Langfuse, LangWatch, Braintrust, Phoenix.
- **LlamaIndex** — Data-centric philosophy; LlamaIndex Workflows (event-driven); LlamaCloud managed ingestion; agents as tools.
- **DSPy** — Programming vs prompting; Signatures; MIPROv2 optimizer; metric-driven compilation; managing model drift.
- **Semantic Kernel** — Enterprise DNA; plugins and planners; multi-language (C#/.NET and Python); Microsoft Agent Framework context.
- **AutoGen / CrewAI** — Microsoft Agent Framework RC 1.0; CrewAI v1.13; Claude Agent SDK, OpenAI Agents SDK, Google ADK comparison.
- **Framework Selection Guide** — Decision matrix; build vs buy vs framework; anti-patterns; staff-level recommendation.
- **Claude Code** — Architecture; core tools; CLAUDE.md manifest pattern; sub-agents and parallelism; MCP integration; safety model.
- **Open Coder Guide** — AI coding landscape 2026; open-weight coding models; AI-native IDEs (Cursor, Windsurf, Cline); OpenHands.
- **Pydantic AI and Mastra** — Typed Python agents (Pydantic AI); TypeScript-first agents (Mastra); comparison with LangGraph.

---

## 10. Document Processing

Extracting structured knowledge from unstructured documents — PDFs, contracts, forms, tables, and charts.

**What's covered:**
- **OCR and Layout** — Vision-LLMs replacing Tesseract; layout extraction; reading order and logical structure; low-quality scan handling.
- **Multimodal Parsing** — OCR-then-parse vs document-as-image; screenshot-to-markdown; Markdown vs JSON output.
- **Table and Form Extraction** — Rule-based vs Vision-LLM vs hybrid; merged cells; multi-page tables; key-value form extraction; schema validation.
- **Document Chunking and Structure** — Layout-aware chunking; preserving document hierarchy; parent-child chunks; cross-page stitching.
- **Document Classification and Routing** — Classify-first-then-route; confidence thresholds; hierarchical classification; cost-aware routing.
- **Extraction Pipelines** — Parallel map-reduce orchestration; schema-driven extraction; validation/retry loops; idempotency; HITL review gates.
- **Document Evaluation and Quality** — Field-level metrics; golden datasets; extraction error taxonomy; confidence calibration; production drift detection.

---

## 11. Infrastructure and MLOps

Running LLMs reliably in production — the infrastructure, CI/CD, and operational discipline required.

**What's covered:**
- **LLM Infrastructure** — Managed API vs self-hosted vs hybrid; serving architecture; May 2026 AI accelerator landscape (H100/B200/MI300X).
- **CI/CD** — Eval-gated pipelines (PRs that regress quality are blocked); testing stages; deployment strategies (canary, blue-green); rollback.
- **GPU Cluster Management** — GPU scarcity and cost ($2–4/hr idle H100); Kubernetes/Slurm scheduling; MIG and fractional GPUs; multi-node NVLink/InfiniBand topology; spot/preemption.
- **Model Registry and Versioning** — What to version (checkpoint + adapters + prompts + config + evals); MLflow, W&B, Hugging Face registries; staged promotion; rollback and A/B.
- **LLMOps Lifecycle** — MLOps vs LLMOps differences; the LLMOps flywheel; experiment tracking; prompt experiment tracking; continuous-evaluation loop.
- **Autoscaling and Load Balancing** — Why standard HPA fails for LLMs; correct signals (queue depth, token throughput); KEDA; scale-to-zero and cold start; LLM-aware load balancing.
- **FinOps and Cost Attribution** — Unit economics; cost tagging and chargeback; GPU procurement; token-cost accounting; budget guardrails; the cost-quality frontier.

---

## 12. Security and Access

The unique threat model that comes with systems that can reason, generate, and take actions.

**What's covered:**
- **LLM Security** — Threat model; prompt injection; data leakage; output security; defense-in-depth; indirect prompt injection (IPI) architecture.
- **Access Control** — Authentication patterns; RBAC/ABAC authorization; tenant isolation; API key management; audit and compliance.
- **Data Privacy and PII** — AI privacy surface; PII detection, redaction, masking, tokenization; data minimization and retention; GDPR right-to-be-forgotten in LLM systems.
- **Compliance and Governance** — EU AI Act (high-risk obligations); NIST AI RMF; ISO/IEC 42001; model cards; AI governance structure; audit trails.
- **Secrets and Supply Chain** — Secrets management for agents; AI supply chain poisoning; model signing and provenance; AIBOM/SBOM for AI.
- **Network and Zero Trust** — Egress filtering (data-exfiltration prevention); VPC/subnet/private endpoints; zero-trust for AI services; air-gapped deployment.
- **Multi-Tenant Isolation** — Four isolation planes; pooled vs silo vs bridge models; retrieval-layer, cache, memory, and model isolation; defense-in-depth testing.

---

## 13. Reliability and Safety

Making AI systems robust against failure, adversarial use, and emergent harms.

**What's covered:**
- **Guardrails** — Input validation; output filtering; prompt injection defense; hallucination mitigation; structured output validation; Guardrails AI, NeMo Guardrails, Lakera Guard.
- **Ensemble Methods** — Multi-judge evaluation ensembles; generation ensembles; multi-agent arbitration; cost-accuracy tradeoffs.
- **Reliability Patterns** — Retry with exponential backoff; circuit breaker; bulkhead; timeout strategies; graceful degradation; multi-provider failover.
- **Red-Teaming and Adversarial Testing** — Attack taxonomy (jailbreaks, injection, policy bypass); automated red-teaming (Garak, PyRIT); ASR measurement; CI integration.
- **Hallucination Detection** — Self-consistency (sampling-based); NLI/entailment-based verification; LLM-as-judge for factuality; grounding and citation verification; abstention UX.
- **Content Safety and Moderation** — Safety taxonomy; OpenAI Moderation, Llama Guard, Aegis; severity tiers; multilingual/multimodal moderation; over vs under blocking.
- **Incident Response** — Safety SLOs/SLIs; real-time safety monitoring; kill switches and emergency rollback; AI-specific postmortems; incident-to-improvement loop.

---

## 14. Evaluation and Observability

Knowing whether your AI system is working — and catching when it stops.

**What's covered:**
- **LLM Evaluation** — Why LLM eval is hard; automated metrics (ROUGE, BERTScore, semantic similarity); LLM-as-judge patterns and pitfalls; building evaluation pipelines; 2026 evaluation evolution.
- **Observability** — Three pillars adapted for AI (logs, metrics, traces); key metrics (latency, cost, token count, quality); Langfuse, LangSmith, Phoenix, OpenTelemetry.
- **Drift Detection and Monitoring** — Input drift, concept drift, model drift, embedding drift; statistical tests; sentinel probes; silent provider update detection.
- **Eval Datasets and Benchmarks** — MMLU, HumanEval, MATH, SWE-bench, ARC-AGI; building golden datasets; synthetic eval generation; dataset versioning and refresh.
- **Experimentation and Online Eval** — A/B testing for LLM features; interleaving experiments; shadow and canary evaluation; proxy metrics vs true outcomes.
- **User Feedback and Quality Signals** — Explicit (thumbs/ratings) and implicit (regenerate/copy/abandon) signals; feedback bias; closing the feedback-to-eval loop.

---

## 15. AI Design Patterns

Reusable architectural solutions for recurring AI system challenges.

**What's covered:**
- **Design Patterns** — RAG patterns; agent patterns; optimization patterns (caching, routing, speculative decoding); reliability patterns (circuit breaker, ensemble); cost patterns.
- **Anti-Patterns** — Architecture over-engineering; wrong chunk size; infinite agent loops; prompt engineering anti-patterns; evaluation anti-patterns.
- **Workflow and Orchestration Patterns** — Prompt chaining; routing; parallelization (sectioning and voting); orchestrator-workers; evaluator-optimizer; reflection loops.
- **Integration and Architecture Patterns** — AI gateway/model proxy; sidecar pattern; event-driven async inference; strangler-fig for incremental adoption; BFF for AI; streaming response patterns.
- **Data and Knowledge Patterns** — Golden-Source (single source of truth); knowledge-freshness (TTL/CDC); hybrid store (structured + vector + graph); context-assembly (budget-aware).
- **Emerging Patterns (2026)** — Compound AI systems; model routing and cascades; generative and adaptive UI; agentic mesh (A2A/MCP); memory-augmented self-improving systems; inference-time compute as an architectural lever.

---

## 16. Case Studies

23 end-to-end production architectures, each framed as a staff-level system design interview problem.

| # | Case Study | Core Problem |
|---|-----------|-------------|
| 01 | Enterprise RAG | Hybrid search + reranking over document corpus |
| 02 | Conversational Agent | Stateful B2B customer support with tool use |
| 03 | Financial Analysis | Ensemble verification for equity research accuracy |
| 04 | Code Assistant | Real-time completions with low latency + context management |
| 05 | Content Moderation | Tiered classifiers + human review at millions of posts/day |
| 06 | Real-Time Search | 5-minute freshness with streaming + hybrid search |
| 07 | Autonomous Coding Agent | Multi-file changes with sandboxing + self-correction |
| 08 | Multi-Tenant SaaS | Defense-in-depth isolation between tenants |
| 09 | Customer Support Automation | 60% auto-resolution with tiered routing |
| 10 | Document Intelligence | 50K contracts/month via Vision-LLM + parallel extractors |
| 11 | Recommendation Engine | Personalized explanations at 50M users |
| 12 | Compliance Automation | FDA regulation pre-screening with claim extraction |
| 13 | Voice AI Healthcare | Real-time clinical notes with on-prem ASR + HIPAA |
| 14 | Fraud Detection | 100ms decisions with ML + rules hybrid |
| 15 | Knowledge Management | 2M docs with permission-aware RAG |
| 16 | Computer-Use Agent | Expense automation across 3 legacy UIs via Firecracker VMs |
| 17 | Multi-Tenant Fine-Tuning | 280 tenants on shared base + per-tenant LoRA hot-swap |
| 18 | Eval-Gated CI/CD | Blocking PRs that regress AI quality |
| 19 | Customer Distillation Pipeline | Cutting frontier API spend from $50K to $6K/mo |
| 20 | MCP Knowledge Agent | Cross-system answers from Snowflake/Confluence/Jira/Slack |
| 21 | Legal Contract Analysis | Portfolio-scale clause extraction with citation grounding |
| 22 | Text-to-SQL Analytics Agent | NL queries over a 540-table warehouse |
| 23 | E-Commerce Product Discovery | Multimodal search over 120M SKUs at 100K req/min |

---

## 17. Tool Use and Computer Agents

AI systems that use software tools, browsers, and operating systems as their action space.

**What's covered:**
- **Tool-Use Landscape** — Evolution from JSON function calls to MCP agents; taxonomy of tool-use frameworks (OpenHands, Open Interpreter, Claude Computer Use, Cursor/Windsurf/Cline).
- **Architecture Patterns** — Function calling, vision-based automation, code execution, multi-agent orchestration; sandboxed vs unsandboxed; MCP integration.
- **Computer-Use Agents** — Screenshot-reason-act loop; Claude computer-use API; Firecracker/Docker sandboxed environments; when computer-use beats direct API calls.
- **Building Tool Agents** — Reliable tool schemas; MCP server construction; tool composition; testing tool agents.
- **Safety and Governance** — OWASP Top 10 Agentic AI risks; data exfiltration; permission models; HITL approval gates; kill switches. (88% of organizations reported AI agent security incidents in 2026.)
- **Browser and Web Agents** — DOM navigation in adversarial environments; anti-bot challenges; reliability as the central problem.
- **Tool-Agent Evaluation** — BFCL, tau-bench, GAIA benchmarks; function-calling eval (tool choice accuracy, argument correctness); hallucinated tool call detection.
- **Tool Discovery** — Managing 100+ tools across MCP servers without selection collapse or permission sprawl.
- **Cost and Latency Optimization** — Fewer LLM round-trips; parallel and speculative tool calls; model tiering per step; iteration bounds.

---

## 18. Multimodal and Generative AI

AI systems that see, hear, and generate content beyond text.

**What's covered:**
- **Multimodal Foundations** — Vision encoders (ViT) and connectors; contrastive alignment (CLIP and successors); native any-to-any vs pipeline-of-specialists; May 2026 multimodal model landscape.
- **Vision-Language Models (VLMs)** — VLM capability taxonomy; visual grounding and region pointing; chart/diagram understanding; VLM hallucination and grounding.
- **Speech and Voice AI** — ASR/STT (Whisper, Deepgram); TTS (ElevenLabs, Azure Neural); real-time STT→LLM→TTS loop (<1 second end-to-end); turn-taking, barge-in, endpointing; voice deepfake concerns.
- **Image Generation** — Diffusion and flow-matching models; ControlNet conditioning; character/brand consistency; C2PA content provenance.
- **Video and Audio Generation** — Text-to-video landscape (Sora, Runway, Kling); image-to-video; generative audio (music/SFX/foley); cost and latency reality; synthetic media safety.
- **Multimodal Agents** — Any-to-any models with unified token space; multimodal perception in the loop; native vs orchestrating specialists; multimodal memory and context.
- **Production Multimodal Systems** — Image token compression; multimodal safety at scale; observability; reference architecture.

---

## 19. Data Engineering for AI

The data layer as a first-class engineering system — not an afterthought.

**What's covered:**
- **Data Engineering Foundations** — AI data lifecycle; quality hierarchy (dedup → filter → de-contaminate → normalize → balance); build vs buy vs synthesize; May 2026 data stack.
- **Data Pipelines and Ingestion** — Batch vs streaming; ETL vs ELT for AI; orchestration (Airflow/Dagster/Prefect/Ray Data); CDC and freshness; unstructured-data ingestion.
- **Data Curation and Quality** — MinHash/LSH deduplication; quality filtering (perplexity, classifiers, heuristics); train/eval contamination removal; toxicity/PII filtering; data contracts.
- **Labeling and Annotation** — Annotation tooling (Scale AI, Label Studio, Argilla); inter-annotator agreement (Fleiss kappa, Krippendorff alpha); LLM-as-annotator; preference data collection.
- **Data Versioning and Lineage** — DVC vs lakeFS vs Delta/Iceberg vs HF Datasets; provenance; reproducibility; GDPR deletion in versioned datasets.
- **Feature and Embedding Stores** — Point-in-time correctness; Feast vs Tecton; embedding lifecycle; freshness and online serving; feature stores vs vector DBs.
- **Production Data Systems** — The data flywheel; data freshness SLAs; observability and quality monitoring; data drift detection; data ownership.

---

## 20. Responsible AI

Building AI systems that are fair, explainable, transparent, and ethically grounded.

**What's covered:**
- **Responsible AI Foundations** — RAI vs security vs safety vs compliance; four pillars (fairness, explainability, transparency, ethics); EU AI Act regulatory backdrop.
- **Fairness and Bias** — Sources of bias; fairness metrics (demographic parity, equalized odds, calibration); the impossibility theorem; bias auditing and mitigation.
- **Explainability and Interpretability** — SHAP, LIME, attributions; CoT as explanation and the faithfulness problem; mechanistic interpretability (features and circuits); model cards.
- **Transparency and Accountability** — AI-use disclosure; C2PA content provenance and watermarking; decision logging; HITL as accountability mechanism; EU AI Act Art. 13/14/50.
- **AI Ethics and Societal Impact** — Dual-use and misuse; labor and automation impact; environmental cost of AI; concentration of power; manipulation and persuasion ethics.
- **Responsible AI in Production** — RAI release gates in CI; RAI production SLIs; bias/fairness drift monitoring; RAI incident response; reference RAI operating model.

---

## 21. AI Product and UX

Designing the human-facing experience around a probabilistic, occasionally-wrong capability.

**What's covered:**
- **AI Product Foundations** — Why AI products are different (probabilistic, latent, occasionally wrong); capability-reliability-trust triangle; AI-native vs AI-bolted-on.
- **Human-AI Interaction Patterns** — Input and prompting affordances; streaming responses; progressive disclosure; mixed-initiative interaction; diff-based acceptance; steering and refinement.
- **Uncertainty and Trust UX** — Over-reliance vs under-reliance; calibrated trust design; confidence visualization; "I don't know" / abstention UX; showing sources; trust repair after error.
- **Error Recovery and Feedback UX** — Graceful failure vs dead-ends; recovery paths (regenerate, edit, switch, hand-off); correction flows; explicit and implicit feedback collection; undo for AI actions.
- **AI Product Metrics and Iteration** — Why model metrics ≠ product metrics; AI product metric stack; leading vs lagging indicators; A/B testing AI features; Build-Measure-Learn loop for AI.

---

## 22. Open-Source and Local Models

Open-weight models as artifacts you download, quantize, run, and serve yourself — from laptop to production fleet.

**What's covered:**
- **Open-Source Model Landscape** — Why open weights matter (control, cost, privacy, latency-locality); open vs closed decision framework; May 2026 model families (Llama 4, Qwen 3.6, DeepSeek V4, Mistral, Gemma 4); Hugging Face Hub.
- **Running Models Locally** — Ollama, llama.cpp, LM Studio, Jan; GGUF format; hardware requirements and memory math; CPU vs GPU vs Apple Silicon; OpenAI-compatible local APIs.
- **Quantization for Local** — GGUF quant levels (Q2_K through Q8_0); memory math before download; quality-vs-size curve; GPTQ vs AWQ vs bitsandbytes vs GGUF comparison; choosing quant level for your hardware.
- **Edge and On-Device AI** — On-device constraint envelope (RAM, power, thermal); mobile NPU (Core ML, Android AI Edge); browser inference (WebGPU, Transformers.js); hybrid edge-cloud pattern.
- **Self-Hosting Open Models** — When self-hosting beats an API; self-hosted serving stack (vLLM/SGLang + Kubernetes + monitoring); TCO calculation; fine-tuning open models; operational reality.

---

## How to Navigate This Knowledge Base

The 22 sections form an interconnected knowledge graph rather than a linear curriculum. Suggested paths:

**If you're new to AI systems engineering:**
Start with `01 Foundations` → `02 Model Landscape` → `05 Prompting and Context` → `06 Retrieval Systems`.

**If you're building a production RAG system:**
`06 Retrieval Systems` → `04 Inference Optimization` → `11 Infrastructure and MLOps` → `14 Evaluation and Observability`.

**If you're building agents:**
`07 Agentic Systems` → `08 Memory and State` → `09 Frameworks and Tools` → `17 Tool Use and Computer Agents`.

**If you're preparing for staff-level interviews:**
`16 Case Studies` covers 23 end-to-end system design problems. Each case study references the relevant technical sections.

**If you're working on model training or adaptation:**
`03 Training and Adaptation` → `04 Inference Optimization` → `19 Data Engineering for AI`.

**If you're focused on safety and governance:**
`12 Security and Access` → `13 Reliability and Safety` → `20 Responsible AI`.
