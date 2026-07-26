# MLOps & Production Machine Learning: Introduction to All Topics

This document is a guided tour of the 7 sections in the MLOps knowledge base — a production-focused reference for engineers who take models from problem framing all the way to monitored, retrainable production systems. The content targets staff-level engineers and covers the operational ML lifecycle: feature stores, experiment tracking, model serving, drift monitoring, GPU-scale distributed training, and managed cloud ML platforms.

**Suggested learning path:** 01 → 02 → 03 → 04 → 05 trace the core lifecycle loop (data → features → experiments → serving → monitoring → retrain); 06 (deep-learning scale) and 07 (platforms) are cross-cutting tracks to layer in as your models and infrastructure grow.

---

## 01. ML Lifecycle

MLOps begins not with tools but with process: framing the problem correctly, building a data strategy that sustains the model over time, iterating with rigor, and shipping with confidence. This section establishes the mindset that separates production-grade ML from one-off notebooks.

**What's covered:**
- **ML Problem Framing** — problem-type taxonomy (regression/classification/ranking/structured prediction; clustering/anomaly detection; self-supervised contrastive/masked; time-series forecasting); aligning business KPI → proxy metric → ML objective (CTR → AUC-PR, churn → F1 with class weights); feasibility via Bayes-error estimation (3-NN error floor, ε\* ≤ 2·ε₃ₙₙ) and PAC sample complexity; Cohen's κ = (p_o − p_e)/(1 − p_e) for labeling agreement (>0.8 good, <0.6 → revisit taxonomy); build vs buy vs fine-tune decision.
- **Data Strategy & Labeling** — collection (crowdsourcing MTurk/Scale AI/Labelbox, synthetic GANs/diffusion, programmatic labeling via Snorkel labeling functions → generative label model); inter-annotator agreement (Cohen's κ for 2 annotators, Fleiss' κ for N, Krippendorff's α for ordinal); active learning by uncertainty sampling (1 − maxₖ P(yₖ|x)); DVC data versioning; augmentation (Mixup/CutMix, back-translation, SMOTE); class imbalance via `class_weight='balanced'` and focal loss FL = −αₜ(1−pₜ)^γ·log pₜ.
- **Model Development Workflow** — baseline-first (majority-class/rule before models; measure the gap to Bayes error); random > grid search in high-dimensional HP space (Bergstra & Bengio); stratified/temporal/group k-fold cross-validation; error and slice analysis (per-subgroup metrics), McNemar's test for model comparison; reproducibility (seed torch/numpy/`PYTHONHASHSEED`, `cudnn.deterministic`, `pip freeze`, Docker image hash); technical debt (hidden feedback loops, glue code).
- **Deployment Readiness** — staged validation gates (held-out + sliced eval → shadow mode → 5% canary → champion-challenger); serialization (ONNX/TorchScript/SavedModel) and runtime choice (Triton/TorchServe/BentoML); latency SLOs P50/P95/P99 + load testing (locust/k6); fairness (disparate impact DI = P(ŷ=1|A=0)/P(ŷ=1|A=1) ≥ 0.8, equalized odds) and calibration (reliability diagram, ECE); model card (Mitchell et al. 2019); pre-staged rollback (blue-green, version pinning).
- **Feedback Loops & Continuous Learning** — delayed/proxy label collection and outcome joins on `request_id`; training-serving skew from divergent transform code; feedback-loop risks (exposure bias, echo chambers, self-fulfilling ranking); continual learning (periodic full retrain vs warm start vs online SGD); champion-challenger auto-promotion (shadow N days, promote if p < 0.05 and degradation < SLO); human-in-the-loop review queues feeding labels back.

**Key mental models:** Tie every ML metric to a business KPI; always beat a dumb baseline before adding complexity; split by time for temporal data (with a buffer gap); audit annotation agreement (κ) before scaling labeling; never ship without a canary and a pre-staged rollback.

---

## 02. Feature Engineering

Features are the interface between raw data and models. Feature stores operationalize that interface — separating offline training retrieval from online low-latency serving — while point-in-time correctness prevents label leakage and lineage keeps everything auditable.

**What's covered:**
- **Feature Stores** — architecture (offline store S3 Parquet/BigQuery/Redshift for training; online store Redis/DynamoDB/Cassandra for sub-10 ms serving; registry as metadata catalog; materialization job offline → online); implementations (Feast open-source, Tecton managed, Hopsworks feature groups); entities / feature views / TTL; `store.get_online_features(...)` at P99 < 10 ms; `feast apply` / `feast materialize`; cross-team feature reuse and discovery.
- **Feature Pipelines & Transformation** — batch compute (Spark `GroupBy.agg`, 7/30-day rolling window functions, Airflow/Prefect orchestration, idempotent daily jobs); streaming (Flink / Spark Structured Streaming on Kafka, event-time watermarks, sliding windows, RocksDB state backend); feature types (z-score, one-hot/target/embedding encoding, cyclical sin/cos(2π·d/P)); sklearn `ColumnTransformer`; feature selection (mutual information, RFE, LASSO L1, Boruta).
- **Point-in-Time Joins** — label leakage from features computed after prediction time (inflates offline AUC by 0.1–0.3, then fails in production); PIT-correct retrieval feature(e,T) = argmax_{t≤T} f(e,t) via Feast `get_historical_features(entity_df=...)`; the as-of SQL pattern (latest feature row where feature_ts ≤ event_ts); leakage traps (target encoding on the full set, future-inclusive aggregates, shuffle-split CV on temporal data); walk-forward validation with an embargo gap.
- **Feature Versioning & Governance** — semantic versioning (v1/v2 for breaking changes) and schema evolution with deprecation windows; lineage (OpenLineage/Marquez facets, dbt, Feast registry source+owner); access control (row-level tenant filters, column-level PII masking, RBAC); monitoring (null-rate, out-of-range, PSI drift, staleness) via Great Expectations/Evidently; data contracts enforced with Pandera/Pydantic/Great Expectations at ingestion.
- **Online vs Offline Serving** — offline batch retrieval (thousands of entity rows, PIT join, Parquet) for training vs online single-entity lookup (Redis `HMGET` / DynamoDB `GetItem`, sub-10 ms); dual-path materialization (push from stream vs scheduled pull) with skew risk when code paths diverge; freshness tiers (real-time Flink → Redis < 1 s, hourly Airflow, daily batch); SLOs P50 < 2 ms / P99 < 10 ms; Redis pipeline batching saves (N−1)·RTT.

**Key mental models:** Never take max(feature) over full history — use the as-of join; write features async out of the request path (serve reads, never writes); share one feature-computation library across train and serve; version features explicitly behind a registry with schema validation.

---

## 03. Experiment Tracking

Experiment tracking turns ad hoc notebook runs into reproducible, auditable, comparable artifacts. Tracking tools capture params/metrics/artifacts, DVC versions data and pipeline stages, registries gate promotion, and HPO searches the configuration space efficiently.

**What's covered:**
- **MLflow Tracking & Registry** — four components (Tracking runs, Projects `MLproject`+env, Models flavors sklearn/pytorch/pyfunc, Registry); `log_param` / `log_metric(step=)` / `log_artifact` + `autolog`; registry stages None → Staging → Production → Archived and 2.x aliases (`models:/Name@champion`); remote backend (PostgreSQL tracking + S3 artifact store); `mlflow models serve` → `/invocations`; parallel-coordinates run comparison.
- **Weights & Biases** — `wandb.init/log/config` lifecycle; Sweeps with Bayesian TPE (EI = ∫(f\*−f)·p(f|λ) df, surrogate l(λ)/g(λ)) and Hyperband early stopping; versioned Artifacts (dataset → model lineage); Reports as shareable dashboards; `wandb.watch` for gradient/parameter histograms; Tables for slice analysis.
- **DVC Pipelines & Data Versioning** — Git-compatible `.dvc` pointers (MD5 content hash) with S3/GCS/Azure remotes; `dvc.yaml` stages (cmd/deps/outs/params/metrics); DAG-based `dvc repro` reruns only changed stages; `params.yaml` + `dvc metrics diff` / `dvc plots`; `dvc exp` for lightweight experiments; CML posts metrics to PR comments from GitHub Actions on cloud GPUs.
- **Model Registry & Versioning** — central catalog with lifecycle stages and metadata (training-data hash, eval metrics, schema, lineage to the run); MLflow aliases, W&B model Artifacts, SageMaker Model Registry approval status; serving from registry (KServe `InferenceService`, Seldon Core, BentoML `import_model`); rollback via version pinning + blue-green; semantic MAJOR.MINOR.PATCH (MAJOR = feature-schema break).
- **Hyperparameter Optimization** — search strategies (grid ∏Nᵢ, random > grid in high dimensions, Bayesian GP/TPE/SMAC3 with EI/UCB/PI acquisition); Optuna (`suggest_float(log=True)`, `MedianPruner` after warmup, distributed via shared RDB storage); Hyperband/ASHA successive halving (keep top 1/η each rung); Ray Tune, population-based training (exploit-copy + explore-perturb), DARTS NAS; fANOVA HP importance; multi-objective Pareto fronts.

**Key mental models:** Log the seed, library versions, and hardware or the run isn't reproducible; log metrics per step, not just at the end; prune bad HPO trials early; require a validation gate (beat the champion on a held-out test set) before promotion; keep the HPO test set untouched to avoid overfitting the search.

---

## 04. Model Serving

Getting a trained model into production is far more than saving a pickle: it needs low-latency inference APIs, dynamic batching for GPU utilization, safe version-comparison infrastructure, and increasingly deployment to edge devices under tight memory budgets.

**What's covered:**
- **REST & gRPC Inference APIs** — REST `POST /v1/predict` (`{instances}`, model_version, latency_ms) and the V2 Inference Protocol (KServe/Triton `/v2/models/{name}/infer` with typed tensor inputs); gRPC (Proto3 + HTTP/2) for lower latency and streaming; FastAPI async + Pydantic validation + OpenAPI, gunicorn workers ≈ 2·CPU+1; graceful shutdown (SIGTERM → drain in-flight → exit); Prometheus `/metrics`.
- **BentoML & Triton** — BentoML (`@bentoml.service`, runners, adaptive batching to max_batch_size / max_latency_ms, `bentoml build`/`containerize`); Triton (model repository + `config.pbtxt`, backends TensorRT/ONNX/TorchScript/TF/Python, dynamic batching with preferred_batch_size + max_queue_delay, instance groups, model ensembles); TensorRT layer fusion + FP16 (2×) / INT8 (4×) via `trtexec`; `perf_analyzer` / Model Analyzer benchmarking.
- **A/B Testing & Canary** — design (user/session/request unit, SUTVA, minimum detectable effect + power → sample size n ≈ (z_α/2 + z_β)²·(…)/δ²); tests (two-proportion z-test, Mann-Whitney, sequential mSPRT/e-values, Bonferroni/BH correction); pitfalls (novelty effect, Sample Ratio Mismatch, peeking); canary mechanics (Istio VirtualService weights, nginx `split_clients`, LaunchDarkly flags, user-hash sticky assignment, 1 → 5 → 25 → 50 → 100% ramp); multi-armed bandits (Thompson sampling / UCB) for adaptive allocation.
- **Batch / Online / Streaming Inference** — batch scoring (Spark/Ray/Dask partition-level, never full-load Pandas); online serving (stateless pods, sub-100 ms P99); streaming (Kafka Streams / Flink model UDF); micro-batch and lambda-architecture patterns; materialized feature aggregations feeding streaming inference.
- **Edge & Mobile Deployment** — compression (magnitude/structured pruning to 50–90% sparsity, PTQ vs QAT INT8/INT4, knowledge distillation L = α·CE + (1−α)·τ²·KL(σ(z_T/τ) ‖ σ(z_S/τ))); export path PyTorch → ONNX → TFLite (FlatBuffer, XNNPACK/GPU/NNAPI delegates) and CoreML (Apple ANE); edge hardware (Coral TPU int8-only, Jetson Orin CUDA+DLA, RPi, TFLite Micro); federated learning for privacy.

**Key mental models:** Load the model once at startup, never inside the request handler; power-analyze A/B tests before launch and randomize by user (hash user_id); quantize with a representative calibration set; ship one preprocessing graph so edge and cloud can't skew; always set gRPC deadlines on both ends.

---

## 05. Model Monitoring

A deployed model degrades silently — the world changes but the weights don't. Monitoring means statistical drift detection, proxy metrics for when ground truth is delayed, automated retraining triggers, and explainability to diagnose what changed and why.

**What's covered:**
- **Data & Concept Drift Detection** — taxonomy (covariate/data drift P(X), concept drift P(Y|X), label shift P(Y), virtual drift); metrics (PSI = Σ(Aᵢ − Eᵢ)·ln(Aᵢ/Eᵢ): <0.1 stable, 0.1–0.25 slight, >0.25 significant; KS D = supₓ|Fₙ − Fₘ|; Jensen-Shannon divergence; Wasserstein-1 EMD; MMD for high dimensions); CUSUM / Page-Hinkley change detection; reference vs sliding windows; tools (Evidently, NannyML CBPE label-free performance estimation, Alibi Detect, WhyLogs).
- **Performance Degradation** — labeled metrics on a delayed window (AUC/PR/F1 on 7-day labels); label-free proxies (prediction/confidence-score distribution shift, CTR); alerting with hysteresis (fire only after N consecutive degraded hours) via `prometheus.Gauge`; SLO vs SLA and error budget = (1 − SLO)·period; Grafana + Prometheus dashboards; composite model-health score.
- **Alerting & Automated Retraining** — thresholds (PSI > 0.2, AUC drop > 5%) routed to PagerDuty/OpsGenie/Slack; retraining DAG (trigger → validate data → retrain → evaluate → promote); scheduled vs drift-triggered vs event-based cadence; champion/challenger auto-promotion gated on lift + no SLO regression.
- **Explainability (SHAP / LIME / Integrated Gradients)** — Shapley values φᵢ with efficiency/symmetry/dummy/additivity axioms; TreeSHAP exact O(TLD²) for tree ensembles vs KernelSHAP model-agnostic O(K·2ⁿ), DeepSHAP for nets; global beeswarm vs local waterfall vs dependence plots; LIME local linear surrogate with proximity kernel; Integrated Gradients (captum) IGᵢ = (xᵢ − x'ᵢ)·∫₀¹ ∂f/∂xᵢ dα; DiCE counterfactuals for actionable recourse.
- **Data Quality & Validation** — six dimensions (completeness/validity/accuracy/consistency/timeliness/uniqueness); Great Expectations (expectation suites, checkpoints, DataDocs), Pandera schemas, dbt tests (not_null/unique/accepted_values/relationships); pipeline gates that fail the DAG and quarantine bad batches; Confluent/Glue schema registry with Avro/Protobuf evolution; anomaly detection (isolation forest, Mahalanobis D_M ~ χ²(p), LOF).

**Key mental models:** Use ≥10 (quantile) bins for PSI or you'll miss subtle drift; KL is asymmetric — prefer Jensen-Shannon or Wasserstein for a proper distance; slice metrics by segment since averages hide tail failures; account for ground-truth delay and lean on proxy signals; explain the prediction (local SHAP), not just the model (global).

---

## 06. DLOps & GPU Training

Deep learning at scale is bounded by the GPU memory hierarchy, numerical-precision trade-offs, and collective-communication cost. This section covers the CUDA execution model, mixed precision, ZeRO/FSDP sharding, PEFT, and the memory techniques that make large-model training feasible.

**What's covered:**
- **CUDA Programming Model & Memory** — thread hierarchy (thread / warp / block / grid); memory hierarchy (registers 64 KB/SM, shared+L1 192 KB/SM ≈ 30-cycle, L2 40 MB, global HBM ≈ 300-cycle, 80 GB @ 2 TB/s on A100); memory coalescing rules and warp divergence; CUDA streams/events for compute-transfer overlap; CUDA graphs to cut kernel-launch overhead; profiling with NSight Compute + Compute Sanitizer.
- **Mixed Precision Training** — FP16 (1+5+10 bits, max 65504, underflow-prone) vs BF16 (1+8+7 bits, FP32 dynamic range, Ampere+); FP32 master weights + `torch.autocast` forward/backward; loss scaling (static 2^k vs dynamic `GradScaler`: scale(loss).backward → unscale → skip step on inf/NaN → adjust scale); AMP in PyTorch Lightning / HuggingFace Trainer.
- **Distributed Training (DDP / FSDP / DeepSpeed)** — DDP replicates params + ring NCCL all-reduce (2(N−1)/N·param_bytes); ZeRO stages 1/2/3 shard optimizer states / gradients / parameters; PyTorch FSDP FULL_SHARD = ZeRO-3 (per-GPU ≈ 16Ψ/N bytes, all-gather before forward, reduce-scatter after backward) with `transformer_auto_wrap_policy` + `MixedPrecision`; tensor + pipeline parallelism (Megatron-LM, GPipe bubbles); DDP when the model fits one GPU, FSDP when it doesn't.
- **PEFT & LoRA Fine-Tuning** — LoRA freezes W₀ and learns ΔW = BA with rank r ≪ min(d,k) (B zero-init so ΔW = 0 at start), ≈0.4% of full-FT params, merged at inference for zero overhead; QLoRA (4-bit NF4 + double quantization, BF16 compute → 65B on one 48 GB GPU); HuggingFace PEFT `LoraConfig(r, lora_alpha, target_modules=[q_proj,v_proj,…])`; adapters vs prefix vs prompt tuning vs IA³; rank selection and rslora α/√r scaling.
- **GPU Memory Optimization** — gradient checkpointing (recompute activations in backward, O(√N) memory for O(log N) extra compute); gradient-accumulation micro-batching; CPU/NVMe activation offload; Flash Attention (IO-aware tiling in SRAM, O(N) HBM access vs O(N²), never materializes the N×N matrix); PagedAttention (vLLM) for variable-length KV cache; `torch.cuda.memory_summary`.

**Key mental models:** Use BF16 on Ampere+ (no loss scaling needed); with FP16 you must use GradScaler; reach for FSDP/ZeRO-3 the moment a model won't fit on one GPU; spend gradient-checkpointing savings on bigger batches, not idle memory; at scale, HBM bandwidth and collective communication — not raw FLOPs — are the bottleneck.

---

## 07. ML Platforms

Every major cloud offers a managed ML platform, and Kubeflow anchors the open-source alternative. Knowing each platform's training, pipeline, feature-store, registry, and monitoring primitives enables informed selection and lowers the cost of eventual migration.

**What's covered:**
- **Kubeflow Pipelines** — KFP v2 SDK (`@dsl.component` with base_image, `@dsl.pipeline`, typed `Input`/`Output[Dataset/Model/Metrics]`, compile to pipeline IR); component types (lightweight Python, prebuilt image, custom container); pipeline control (`dsl.Condition`, `ParallelFor` fan-out, `ExitHandler`, per-component caching on input+image hash, retries); backend (Argo Workflows execution, MinIO artifacts, MySQL metadata, MLMD lineage across artifacts/executions/contexts).
- **Amazon SageMaker** — Training Jobs (`Estimator`, Spot with checkpoint/resume); SageMaker Pipelines (ProcessingStep/TrainingStep/TuningStep/ConditionStep/RegisterModel, `PipelineSession` lazy eval); Feature Store (online+offline, Athena for offline); Model Registry approval workflow; `HyperparameterTuner` (Bayesian GP, max_parallel_jobs); Clarify (pre/post-training bias + SHAP); Debugger & Model Monitor; Ground Truth labeling.
- **Google Vertex AI** — Training (CustomJob / HyperparameterTuningJob / AutoML); Pipelines (KFP v2 + Google Cloud Pipeline Components); Feature Store (BigTable online + BigQuery offline); Model Registry + Endpoints with `traffic_split` canaries; Matching Engine ANN (ScaNN tree-AH, PCA 768→128 + int8, billion-scale, 5–50 ms); Model Monitoring on Jensen-Shannon divergence; Model Garden (Gemini/Imagen) and BigQuery ML (`CREATE MODEL`).
- **Azure ML** — Workspace + Studio, AmlCompute autoscaling (min_instances=0, spot 60–80% off); v2 SDK `command` jobs and `@pipeline` component YAML; MLflow-native tracking/registry (`set_tracking_uri(ws...)`); Responsible AI Dashboard (error analysis, fairness by slice, SHAP, DiCE counterfactuals, causal inference); Prompt Flow for LLM DAGs; Azure ML Registries for cross-workspace sharing.
- **Platform Comparison & Migration** — selection axes (compute/GPU generations, managed vs DIY, lock-in, pricing model, compliance); per-cloud strengths (SageMaker HyperPod/JumpStart, Vertex Matching Engine/TPU/Gemini, Azure Responsible AI/Prompt Flow/AD); open-source stack (Kubeflow + MLflow + Feast + Seldon); TCO break-even (managed typically wins under ~5 GPU nodes); portability via ONNX + MLflow + DVC + Docker; migration (lift-and-shift vs cloud-native refactor) behind a feature-parity matrix.

**Key mental models:** Never hardcode credentials — use IAM roles/service accounts + secrets managers; always enable spot/preemptible instances with checkpointing for training; split pipelines into fine-grained cached components; split endpoint traffic (e.g., 90/10) for safe rollout; keep core training code SDK-agnostic (ONNX/MLflow) to dodge lock-in.

---

## Cross-Cutting Mental Models

These five principles are threaded through every section and are the highest-leverage ideas in the entire base:

1. **Training-serving skew is the cardinal sin** — offline metrics lie whenever training and serving compute features differently, or whenever future data leaks into training. Point-in-time joins, a shared feature-computation library/store, and strict temporal splits all exist to close this one gap.
2. **Everything is versioned and reproducible** — code (Git), data (DVC), features (registry + semantic versions), experiments (MLflow/W&B), and models (registry stages None → Staging → Production → Archived). A run you can't reproduce didn't happen; log seeds, versions, and hardware.
3. **Ship behind gates, never big-bang** — shadow mode → canary (1–5% via Istio/feature flags) → gradual ramp, with power-analyzed A/B tests, fairness (DI ≥ 0.8) and calibration checks, and a pre-staged rollback wired up before any full rollout.
4. **Deployed models decay silently — monitor and close the loop** — data, concept, and label drift erode performance with no errors raised. Watch PSI/KS/JS plus delayed-label metrics, alert with hysteresis to avoid fatigue, and wire drift and schedule triggers into an automated retraining DAG.
5. **Memory and communication are the scaling bottlenecks** — at GPU scale, throughput is bounded by HBM bandwidth and collective-communication cost, not FLOPs. Mixed precision, ZeRO/FSDP sharding, gradient checkpointing, Flash Attention, and PEFT/LoRA all trade a little compute to fit and move less.
