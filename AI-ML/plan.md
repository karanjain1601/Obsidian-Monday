# AI-ML KnowledgeHub: Complete Topic Guide

A guided tour of all 234 notes across 12 sections in the AI-ML vault. Covers everything from mathematical foundations through classical ML, deep learning, NLP, computer vision, generative AI, MLOps, infrastructure, data engineering, system design, evaluation, safety, and landmark papers. Targets engineers who want a production-grade, interview-ready understanding of the full AI/ML stack.

---

## 00. Foundations

The mathematical and computational bedrock everything else builds on. Do not skip this section — gaps here surface as confusion in every downstream topic.

### Math

- **Linear Algebra** — Vectors, matrices, tensors; dot products and projections; matrix multiplication as linear transformations; eigenvalues and eigenvectors (PCA, SVD connection); orthogonality; the four fundamental subspaces; matrix decompositions (LU, QR, SVD, Cholesky); the role of rank; why neural network weight matrices are linear maps between vector spaces.

- **Calculus for ML** — Derivatives and the chain rule (the mechanical heart of backprop); partial derivatives and gradients; Jacobians and Hessians; multivariable Taylor expansion; directional derivatives; integration in probability contexts; automatic differentiation (forward vs reverse mode); why the gradient points in the direction of steepest ascent and how that drives gradient descent.

- **Probability and Statistics** — Sample spaces, events, probability axioms; conditional probability and Bayes' theorem; random variables (discrete and continuous); expectation, variance, covariance; key distributions (Bernoulli, Binomial, Gaussian, Poisson, Beta, Dirichlet, Exponential); law of large numbers and CLT; MLE and MAP estimation; hypothesis testing; confidence intervals; the bias-variance decomposition derived probabilistically.

- **Information Theory** — Shannon entropy as expected surprise; KL divergence and cross-entropy (and their direct connection to log-loss); mutual information; the data processing inequality; entropy and compression; variational lower bound (ELBO); why cross-entropy loss is MLE under a categorical model; information-theoretic view of regularization.

- **Optimization Theory** — Convex vs non-convex landscapes; gradient descent convergence conditions; learning rate and Lipschitz smoothness; momentum and accelerated methods; saddle points and local minima in deep networks; Lagrangian duality and constrained optimization; proximal methods; the connection between regularization and constrained optimization (L1 sparsity, L2 weight decay); second-order methods (Newton, L-BFGS) and why they're rarely used in deep learning.

### CS Fundamentals

- **Python for ML** — Python data model and memory model; NumPy broadcasting semantics; list comprehensions and generators for data pipelines; decorators and context managers; type hints for ML codebases; profiling with cProfile and memory_profiler; multiprocessing vs threading vs asyncio for data loading; packaging ML projects; virtual environments and dependency management.

- **NumPy Fundamentals** — ndarray internals (dtype, strides, contiguous memory); vectorized operations vs Python loops; broadcasting rules (step-by-step); indexing (basic, advanced, boolean); universal functions (ufuncs); in-place operations and memory safety; FFT with NumPy; random number generation and seeding for reproducibility; interop with PyTorch/TensorFlow tensors.

---

## 01. Classical ML

Classical machine learning algorithms — the methods that work with tabular data, remain competitive on small datasets, and form the conceptual vocabulary that deep learning extends.

### Supervised Learning

- **Linear Regression** — Ordinary least squares derivation; the normal equation; geometric interpretation; assumptions (linearity, homoscedasticity, no multicollinearity); R², adjusted R², residual diagnostics; ridge and lasso as regularized variants; polynomial features; when linear regression beats neural nets.

- **Logistic Regression** — Sigmoid as a probability model; log-odds interpretation; MLE derivation of cross-entropy loss; decision boundary geometry; multiclass extension (softmax / one-vs-rest); regularization (L1 for sparse features, L2 for stability); odds ratios for interpretability; calibration and Platt scaling.

- **Decision Trees** — Information gain and Gini impurity split criteria; ID3, C4.5, CART algorithms; tree depth, min samples, and max features as regularization; handling missing values; feature importance via impurity reduction; pruning (pre-pruning vs post-pruning); decision boundary as axis-aligned partitions; why trees overfit and how ensembles fix that.

- **Random Forests** — Bagging (bootstrap aggregation); why averaging decorrelated trees reduces variance; out-of-bag error as free validation; feature subsampling at each split; permutation importance vs impurity importance; parallelism advantage; limitations (not great for extrapolation, feature interaction opacity).

- **Gradient Boosting** — Additive model view; fitting residuals sequentially; function-space gradient descent; shrinkage (learning rate) as regularization; stochastic gradient boosting; loss functions for classification, regression, ranking; depth-1 stumps vs deeper trees; early stopping with a validation set.

- **XGBoost** — Second-order Taylor approximation of loss; regularization terms on leaf weights and tree complexity; weighted quantile sketch for split finding; column subsampling; tree pruning via gain threshold; out-of-core training; GPU acceleration; the reason XGBoost dominated Kaggle 2013–2020.

- **LightGBM** — Histogram-based split finding (vs exact in XGBoost); leaf-wise growth vs level-wise; Gradient-based One-Side Sampling (GOSS); Exclusive Feature Bundling (EFB); cat feature native encoding; why LightGBM is faster and uses less memory than XGBoost on large datasets; key hyperparameters (num_leaves, min_child_samples, feature_fraction).

- **SVM** — Maximum-margin hyperplane; support vectors; hard-margin vs soft-margin (C parameter); the kernel trick (polynomial, RBF, sigmoid); dual problem and Lagrange multipliers; SVC, SVR, one-class SVM; SMO algorithm for training; why SVMs struggle above 100K samples; comparison to logistic regression.

- **KNN** — Lazy learning intuition; distance metrics (Euclidean, Manhattan, Minkowski, cosine); k selection via cross-validation; curse of dimensionality and KNN's breakdown; KD-trees and ball trees for efficient lookup; KNN regression; distance-weighted voting; use cases (collaborative filtering baseline, anomaly detection).

- **Naive Bayes** — Conditional independence assumption; Gaussian NB, Multinomial NB, Bernoulli NB; smoothing (Laplace, Lidstone); text classification via bag-of-words; log-probability for numerical stability; why Naive Bayes works despite a provably wrong assumption; comparison to logistic regression (generative vs discriminative).

### Unsupervised Learning

- **KMeans** — Lloyd's algorithm; initialization strategies (random, KMeans++); convergence guarantee (to local optimum); elbow method and silhouette score for k selection; KMeans limitations (assumes spherical clusters, sensitive to outliers, scale-dependent); Mini-Batch KMeans for large datasets; KMeans as product quantization in vector search.

- **Hierarchical Clustering** — Agglomerative bottom-up vs divisive top-down; linkage criteria (single, complete, average, Ward); dendrograms and cutting at a height; BIRCH for large datasets; advantages (no k required, interpretable dendrogram); O(n² log n) complexity limitation.

- **DBSCAN** — Core points, border points, and noise; epsilon and min_samples parameters; density-connected components; automatic cluster count; handles arbitrary shapes and outliers; sensitivity to epsilon; HDBSCAN as a robust hierarchical extension; applications in geospatial clustering and anomaly detection.

- **PCA** — Variance maximization as eigenvector decomposition; covariance matrix; explained variance ratio and the scree plot; whitening; dimensionality reduction for visualization, compression, and noise removal; limitations (linear only, interpretability of components); relationship to SVD; when to center and scale.

- **t-SNE** — Gaussian affinities in high-D, Student-t in low-D; KL divergence minimization; perplexity hyperparameter; stochastic gradient descent optimization; why cluster distances in t-SNE are not meaningful; crowding problem and why Student-t distribution addresses it; computational cost O(n² ) and Barnes-Hut O(n log n) approximation.

- **UMAP** — Topological foundations (Riemannian manifold, fuzzy simplicial sets); preserves both local and global structure better than t-SNE; faster and more scalable; supervised and semi-supervised UMAP; use cases for embedding space exploration and pre-processing for downstream ML.

### Evaluation

- **Classification Metrics** — Confusion matrix; accuracy and when it misleads; precision, recall, F1; macro vs micro vs weighted averaging; precision-recall curves; the F-beta family; Matthews Correlation Coefficient (MCC) for imbalanced classes; Cohen's kappa for inter-rater agreement.

- **Regression Metrics** — MAE, MSE, RMSE, MAPE, sMAPE; why RMSE penalizes large errors more; median absolute error for robustness; R² and adjusted R²; Huber loss as a robust alternative; domain-specific metrics (MAPE in forecasting, quantile loss in prediction intervals).

- **ROC and AUC** — TPR vs FPR tradeoff; AUC-ROC as probability that model ranks a positive above a random negative; PR-AUC when positives are rare; comparison across models at different thresholds; partial AUC; calibration vs discrimination.

- **Cross-Validation** — k-fold CV; stratified k-fold for imbalanced data; leave-one-out; time series cross-validation (walk-forward, blocked); nested CV for hyperparameter tuning + generalization estimate; variance-bias tradeoff in CV estimators; the right way to do CV when preprocessing is involved.

- **Bias-Variance Tradeoff** — Decomposition of expected test error; high bias (underfitting) vs high variance (overfitting) diagnostics; learning curves as a diagnostic tool; the double descent phenomenon in modern over-parameterized models; regularization as variance reduction; ensemble methods as variance reducers.

### Techniques

- **Feature Engineering** — Domain-driven feature creation; interaction terms; polynomial features; target encoding and leave-one-out encoding; cyclic encoding for time/angle features; log transforms for skewed distributions; binning; date/time decomposition; text-derived features; feature engineering for tree vs linear models.

- **Feature Selection** — Filter methods (correlation, mutual information, chi-squared, ANOVA F-test); wrapper methods (RFE, sequential forward/backward selection); embedded methods (L1 regularization, tree importance, SHAP-based); variance inflation factor for multicollinearity; stability selection; dimensionality reduction vs feature selection tradeoffs.

- **Regularization** — L2 (Ridge/weight decay): Gaussian prior, shrinks all weights; L1 (Lasso): Laplace prior, induces sparsity; Elastic Net: convex combination; why L1 produces zero weights geometrically; dropout as a form of regularization; early stopping as implicit regularization; data augmentation as regularization; the bias-variance tradeoff view of regularization strength.

- **Ensemble Methods** — Bagging reduces variance; boosting reduces bias; stacking (meta-learning); voting classifiers; snapshot ensembles; model soups (weight averaging for LLMs); when to ensemble vs when a single model suffices; diversity as the key ingredient.

- **Hyperparameter Tuning** — Grid search, random search (why random beats grid for high-D); Bayesian optimization (Gaussian process surrogate, acquisition functions: EI, UCB, PI); Hyperband and ASHA for early stopping; population-based training; Optuna and Ray Tune in practice; the right search space design.

- **Handling Imbalanced Data** — Oversampling (SMOTE, ADASYN); undersampling (random, Tomek links, NearMiss); class-weighted loss functions; threshold tuning; one-class classification; cost-sensitive learning; evaluation pitfalls (never use accuracy); ensemble methods for imbalance (EasyEnsemble, BalancedRandomForest).

---

## 02. Deep Learning

Neural networks from first principles through modern architectures. The bridge between classical ML and the transformer era.

### Fundamentals

- **Neural Network Basics** — The perceptron and its limitations; multi-layer feedforward networks; universal approximation theorem (and what it doesn't guarantee); forward pass as function composition; parameter count intuition; depth vs width tradeoffs; inductive biases.

- **Activation Functions** — Sigmoid: saturated gradients, not zero-centered; Tanh: zero-centered, still saturates; ReLU: dead neuron problem, not smooth; Leaky ReLU, PReLU, ELU; GELU (used in transformers); SiLU/Swish (LLaMA); Mish; Softmax for output layers; why ReLU became the default and why GELU replaced it in transformers.

- **Loss Functions** — MSE for regression; cross-entropy for classification (binary and categorical); hinge loss for SVMs/margin classifiers; focal loss for extreme class imbalance; contrastive loss and triplet loss for metric learning; CTC loss for sequence-to-sequence without alignment; ELBO for VAEs; custom loss design principles.

- **Backpropagation** — Forward pass as building a computational graph; backward pass as reverse-mode automatic differentiation; the chain rule for multi-layer networks; gradient accumulation across time (BPTT); vanishing and exploding gradients and why they happen; numerical gradient checking.

- **Weight Initialization** — Why initialization matters (dead neurons, exploding/vanishing gradients); zero initialization failure; random initialization scaling; Xavier/Glorot (for tanh/sigmoid); He/Kaiming (for ReLU); orthogonal initialization for RNNs; layer normalization as a complementary solution.

### Architectures

- **CNN Fundamentals** — Convolution as local feature detection; receptive field; padding (valid, same); stride; pooling (max, average, global); parameter sharing and translation equivariance; channel depth; feature maps as learned detectors; transposed convolution for upsampling; depthwise separable convolutions (efficiency gains).

- **Famous CNN Architectures** — LeNet-5 (first practical CNN); AlexNet (ImageNet breakthrough, ReLU, dropout, GPU training); VGG (depth with 3×3 filters); GoogLeNet/Inception (parallel filter banks, auxiliary classifiers); ResNet (skip connections, batch normalization, training 1000+ layer networks); DenseNet (dense connections); EfficientNet (compound scaling); ConvNeXt (modernized pure CNN).

- **RNN and LSTM** — Recurrent connections and hidden state; unrolling through time (BPTT); vanishing gradient in vanilla RNNs; LSTM: input/forget/output gates and cell state; GRU: simplified gating; bidirectional RNNs; stacked RNNs; sequence-to-sequence (seq2seq) with encoder-decoder; teacher forcing; beam search decoding.

- **GRU** — Update gate and reset gate mechanics; comparison to LSTM (fewer parameters, competitive performance); when to prefer GRU over LSTM; empirical results on short vs long sequences; GRU in modern hybrid SSM-attention models.

- **Attention Mechanism** — Query-key-value abstraction; additive attention (Bahdanau) vs multiplicative/dot-product attention (Luong); self-attention; scaling by √d_k; attention weights as soft alignment; context vector computation; multi-head attention: parallel attention heads with projection; cross-attention in encoder-decoder models.

- **Transformer Architecture** — Full encoder-decoder stack; encoder: multi-head self-attention + FFN + layer norm + residual; decoder: masked self-attention + cross-attention + FFN; why masking is needed in autoregressive decoding; encoder-only (BERT), decoder-only (GPT), encoder-decoder (T5, BART); modern improvements: pre-norm, SwiGLU FFN, RoPE/ALiBi position encodings; sparse and local attention for long sequences; Mixture-of-Experts (MoE) transformer.

- **Positional Encoding** — Why position must be encoded (attention is permutation-invariant); sinusoidal absolute position encodings (PE formula); learned absolute positions; relative position encodings; Rotary Position Embedding (RoPE): rotating Q and K in complex space, length extrapolation; ALiBi: linear bias on attention scores, strong length generalization; YaRN for extending context window post-training.

### Training

- **Gradient Descent Variants** — Batch GD vs Stochastic GD vs Mini-batch GD; noise in SGD as a regularizer; why mini-batch is the standard; convergence speed comparison; the loss landscape intuition; warm-up schedules.

- **Optimizers** — SGD with momentum (Polyak, Nesterov); AdaGrad (adaptive per-parameter LR, accumulates forever); RMSProp (exponential moving average of squared gradients); Adam (momentum + RMSProp, bias correction); AdamW (decoupled weight decay, the standard for transformers); Lion (sign gradient, memory-efficient); Sophia (second-order curvature estimate); optimizer comparison on transformers.

- **Learning Rate Scheduling** — Constant vs step decay vs cosine annealing; warm-up and why it's critical for large models (Adam moment instability at start); cosine with restarts (SGDR); linear decay; polynomial decay; OneCycleLR; learning rate finder (Leslie Smith); the interplay of batch size, LR, and training duration (linear scaling rule).

- **Batch Normalization** — Internal covariate shift hypothesis; normalizing per-batch per-feature; learnable scale and shift (gamma, beta); inference-time running statistics; why BN enables higher learning rates; problems with small batch sizes, RNNs, and online inference; BatchNorm vs LayerNorm choice.

- **Layer Normalization** — Normalizes across features (not batch); no batch dependency; the standard for transformers and RNNs; pre-LN vs post-LN and training stability; RMSNorm (skip mean subtraction, used in LLaMA/Qwen); Group Normalization for vision.

- **Dropout** — Randomly zeroing activations during training; inverted dropout (scale by 1/p at train time); prevents co-adaptation; implicit ensemble interpretation; dropout rate sensitivity; where not to use dropout (batch norm, after attention in transformers); DropPath/Stochastic Depth for vision transformers.

- **Gradient Clipping** — Clip-by-norm vs clip-by-value; why exploding gradients happen (deep nets, RNNs); the global norm clipping formula; threshold selection; monitoring gradient norm during training as a health signal.

- **Early Stopping** — Validation loss as a stopping signal; patience hyperparameter; restoring best weights; interaction with learning rate decay; relationship to regularization; early stopping vs regularization equivalence in some settings.

### Frameworks

- **PyTorch Fundamentals** — Tensor creation and memory layout; autograd: requires_grad, backward(), grad; computation graph (dynamic vs static); device management (CPU/CUDA/MPS); in-place operations and autograd safety; torch.no_grad() for inference; Module and Parameter abstractions; state_dict() and model serialization.

- **PyTorch DataLoader** — Dataset vs IterableDataset; DataLoader arguments (num_workers, prefetch_factor, pin_memory); custom collate_fn for variable-length sequences; distributed sampler for DDP; memory-mapped datasets; WebDataset for streaming from object storage; profiling data pipeline bottlenecks.

- **PyTorch Training Loop** — Canonical train/eval loop structure; gradient accumulation for large effective batch sizes; mixed-precision (torch.cuda.amp: autocast + GradScaler); torch.compile (Inductor backend, graph capture); DDP setup (DistributedDataParallel); gradient checkpointing for memory; logging with TensorBoard/WandB.

- **TensorFlow and Keras** — Keras Model (Sequential, Functional, Subclassed); fit() API vs custom training loops; TensorFlow Dataset pipeline (map, batch, prefetch, cache); SavedModel format vs H5; TensorFlow Serving; tf.function and graph tracing; TFLite for edge deployment; comparison to PyTorch (static vs dynamic graph history).

- **JAX and Flax** — Functional purity and immutability; jit, grad, vmap, pmap transformations; pytrees as the universal data structure; Flax NNX modules; XLA compilation; why JAX is favored for research (composability of transforms); Optax for optimizers; T5X and MaxText for large-scale training; comparison to PyTorch and TF.

---

## 03. NLP

Natural language processing — from raw text through classical models, pretrained transformers, and the full LLM stack.

### NLP Fundamentals

- **Text Preprocessing** — Lowercasing, punctuation removal, stop-word removal; stemming (Porter, Snowball) vs lemmatization (WordNet, spaCy); sentence boundary detection; unicode normalization (NFC, NFD); handling HTML/markup; multilingual preprocessing considerations; when NOT to preprocess (transformers learn from raw text).

- **Tokenization** — Word, character, and subword tokenization; the vocabulary coverage tradeoff; why subword tokenization won (handles OOV, morphology, code); BPE algorithm step-by-step (merge rules, vocabulary size); WordPiece (used in BERT: maximize likelihood of corpus); Unigram LM (start large, prune); SentencePiece for language-agnostic tokenization; tiktoken (byte-level BPE used by GPT-4 family).

- **Word Embeddings** — Distributional hypothesis ("you shall know a word by the company it keeps"); co-occurrence matrices and PMI; dense embeddings vs sparse; embedding dimensionality and coverage tradeoffs; embedding tables as the largest parameters in small NLP models.

- **Word2Vec** — Skip-gram: predict context from center word; CBOW: predict center from context; negative sampling for efficient training; noise contrastive estimation; the embedding algebra (king − man + woman ≈ queen); limitations (one vector per word, no context sensitivity); GloVe comparison (global co-occurrence).

- **Sequence Labeling** — Named entity recognition (NER), POS tagging, chunking; IOB/BIOES tagging schemes; CRF layer on top of BiLSTM; Viterbi decoding; evaluation (entity-level F1); transition to transformer-based sequence labeling (fine-tuned BERT for NER).

### Language Models

- **Language Model Basics** — Autoregressive LM: P(w_t | w_1 ... w_{t-1}); masked LM: predict masked tokens given full context; perplexity as exponentiated cross-entropy; n-gram LMs and Kneser-Ney smoothing; neural LMs; the LM pre-training + fine-tuning paradigm.

- **BERT** — Bidirectional encoder trained with MLM (15% masking: 80% [MASK], 10% random, 10% original) and NSP; [CLS] token for classification; [SEP] for segment boundaries; WordPiece tokenization; BERT-base vs BERT-large; fine-tuning: add task head, train end-to-end; variants: RoBERTa (no NSP, dynamic masking, more data), ALBERT, DistilBERT, DeBERTa; use cases (classification, NER, QA, sentence similarity).

- **GPT Family** — GPT-1: unsupervised pre-training + supervised fine-tuning; GPT-2: zero-shot via prompt conditioning; GPT-3: in-context learning, 175B parameters, few-shot prompting; InstructGPT: RLHF alignment; GPT-4: multimodal, higher reasoning; the autoregressive decoder-only architecture and why it generalized.

- **T5 and Encoder-Decoder** — "Text-to-Text Transfer Transformer": all tasks as text-to-text; span corruption as pretraining objective; T5 architecture (encoder + cross-attention decoder); multi-task pretraining on C4; FLAN-T5 instruction-tuned variant; BART (denoising pretraining: text infilling, sentence permutation); when encoder-decoder beats decoder-only (seq2seq tasks, summarization, translation).

- **Tokenization Algorithms** — BPE, WordPiece, Unigram LM in depth (math + pseudocode); SentencePiece implementation details; byte-level BPE (handles any unicode, used in GPT-2+); vocabulary size tradeoffs (too small = OOV; too large = more parameters); fertility (tokens per word) as a multilingual fairness metric; multimodal tokenization (image patches as tokens, audio spectrogram tokens).

### LLMs

- **LLM Architecture Deep Dive** — Full GPT-style forward pass annotated; modern improvements over vanilla transformer: pre-norm instead of post-norm; SwiGLU feedforward (gate × activation); rotary positional embeddings (RoPE); Grouped Query Attention (GQA) for KV cache efficiency; sliding window attention; MoE routing (top-K gating, load balancing); context length extension (YaRN, LongRoPE); Llama 3, Qwen 2.5, Mistral, DeepSeek V2 architecture comparisons.

- **Pretraining** — Data collection and deduplication (MinHash LSH, exact dedup); quality filtering (perplexity-based, classifier-based, heuristic rules); the Chinchilla scaling law (compute-optimal: N ∝ C^0.5, D ∝ C^0.5); FineWeb, RedPajama, The Pile, Dolma datasets; training stability at scale (gradient clipping, warmup, ZeRO-3); multi-epoch training and overfitting; continued pretraining for domain adaptation.

- **Instruction Tuning** — Supervised fine-tuning on (instruction, response) pairs; FLAN (tasks as instructions, zero-shot generalization); Alpaca (self-instruct, GPT-generated instructions); LIMA (1000 carefully curated examples beats 50K noisy ones); chat templates (ChatML, Llama 3 special tokens); system prompts; why instruction tuning activates latent pretraining knowledge rather than teaching new facts.

- **RLHF** — Human feedback collection: pairwise preferences, Bradley-Terry reward model; reward model training; PPO fine-tuning loop (clipped surrogate objective, KL penalty against reference policy); reward hacking and Goodhart's law; Constitutional AI as a scalable alternative to human feedback; InstructGPT results (humans prefer RLHF models over much larger base models).

- **DPO** — Direct Preference Optimization: bypasses explicit reward model training; reparameterizes reward as a function of policy ratio; implicit reward via log probability ratios; DPO loss derivation; comparison to PPO (simpler, no reward model, no RL loop, often competitive); SimPO (simple, length-normalized); IPO; when PPO still wins (RLVR with verifiable rewards).

- **Constitutional AI** — Principle-based self-critique; RLHF from AI feedback (RLAIF); critique → revision → SFT loop; preference labels from AI judge; scaling feedback without human bottleneck; constitutional principles as a governance mechanism.

- **LLM Inference Optimization** — KV cache: what is stored (keys + values for all past tokens), memory math (2 × layers × heads × d_head × seq_len × bytes per element); GQA to reduce KV cache size; continuous batching for high throughput; PagedAttention (non-contiguous KV blocks, near-zero fragmentation); speculative decoding (draft-verify for 2–3× speedup); quantized inference (GPTQ, AWQ, GGUF); vLLM vs SGLang vs TensorRT-LLM.

### Fine-Tuning

- **Full Fine-Tuning** — When to fine-tune all weights; learning rate selection (1–10× smaller than pretraining); catastrophic forgetting and mitigation (smaller LR, replay, continual learning); multi-task fine-tuning; compute budget (gradient checkpointing, ZeRO, FSDP); when full fine-tuning beats PEFT (task requires deep weight updates, ample compute).

- **PEFT** — Parameter-Efficient Fine-Tuning motivation (96–99% fewer trainable parameters); taxonomy: additive (adapters, prefix tuning, prompt tuning), selective (BitFit), reparameterization (LoRA); HuggingFace PEFT library; task-specific head vs full model fine-tuning; PEFT vs RAG vs prompting decision framework.

- **Adapters** — Bottleneck adapter layers inserted into each transformer block; Houlsby configuration (after attention + after FFN); adapter rank as bottleneck width; inference overhead (added layers); parallel adapters; comparison to LoRA (LoRA no inference overhead, adapters composable).

- **LoRA** — Low-rank decomposition: ΔW = BA where B ∈ R^{d×r}, A ∈ R^{r×k}, rank r << min(d,k); applied to Q, K, V, and output projection matrices; scaling factor alpha/r; merging at inference (zero latency); multi-LoRA serving (S-LoRA); advanced variants: VeRA (shared random frozen matrices), GaLore (gradient low-rank projection for pretraining), DoRA (magnitude + direction decomposition).

- **QLoRA** — 4-bit NF4 quantization of base model (frozen); LoRA adapters in BF16 (trainable); double quantization (quantize the quantization constants); paged optimizers (CPU offload for optimizer states); 65B model fine-tunable on a single 48GB GPU; gradient flow through frozen quantized weights.

### NLP Frameworks

- **HuggingFace Transformers** — AutoModel, AutoTokenizer, AutoConfig; pipeline() API; trainer API and TrainingArguments; datasets library integration; generation: model.generate() with sampling strategies; model hub: push/pull; safetensors format; accelerate for distributed training; PEFT library.

- **HuggingFace PEFT Library** — get_peft_model(), PeftConfig; LoRA, IA³, prefix tuning, prompt tuning, adapters; saving and loading adapters; merging LoRA into base model; multi-adapter inference; integration with Trainer and TRL.

- **LangChain** — LCEL composable chains with the pipe operator; core abstractions (Runnable, Document, BaseMessage, ChatPromptTemplate); memory (ConversationBufferMemory, ConversationSummaryMemory); retrieval chains; LangSmith integration for tracing; when LangChain is overkill vs genuinely useful.

- **LlamaIndex** — Data-centric indexing philosophy; VectorStoreIndex, SummaryIndex, KnowledgeGraphIndex; query engine vs retriever; LlamaIndex Workflows (event-driven async); LlamaCloud for managed ingestion; agents as tools; response synthesizers; comparison to LangChain.

- **DSPy** — Programming vs prompting (prompts as hyperparameters, not code); Signatures (input/output specification); Modules (ChainOfThought, Retrieve, ReAct); Teleprompters / optimizers (MIPROv2, BayesianSignatureOptimizer); few-shot prompt optimization via bootstrap; metric-driven compilation; production pattern for managing prompt drift across model updates.

---

## 04. Computer Vision

Visual AI from convolutional fundamentals through modern vision-language models and generative architectures.

### CV Fundamentals

- **Convolutional Operations** — 2D convolution mechanics (filter, input, output feature map); kernel as learned feature detector; convolution vs cross-correlation (the sign convention); stride and output size formula; padding (valid, same, full); dilated/atrous convolution (expands receptive field without pooling); grouped convolution (efficiency); 1×1 convolution (channel mixing, bottleneck).

- **Image Preprocessing** — Normalization (per-channel mean/std subtraction, ImageNet stats); resizing strategies (bilinear, bicubic, nearest); center crop vs random crop; pixel value range conventions (0-1 vs 0-255 vs -1 to 1); color space (RGB, BGR, LAB, HSV); handling non-square images; normalization for pretrained models.

- **Data Augmentation for CV** — Geometric: random crop, flip, rotation, perspective; color: brightness, contrast, saturation, hue jitter; advanced: Cutout, MixUp, CutMix, Mosaic (YOLOv5); AutoAugment and RandAugment (searched policies); test-time augmentation (TTA); augmentation for medical imaging (label-preserving constraints).

### Vision Tasks

- **Image Classification** — Softmax head on top of backbone; top-1 and top-5 accuracy; transfer learning: freeze backbone, train head; fine-tuning: unfreeze progressively; multi-label classification (sigmoid + binary cross-entropy); class activation maps (CAM, Grad-CAM).

- **Object Detection** — Two-stage detectors: R-CNN family (Region Proposal Network → RoI pooling → classification + regression); one-stage detectors: SSD, RetinaNet (focal loss for class imbalance), FCOS (anchor-free); evaluation: mAP at IoU thresholds; NMS and soft-NMS; anchor design; detection transformers: DETR (end-to-end, no NMS), DAB-DETR, RT-DETR.

- **YOLO Family** — YOLOv1: unified grid prediction; YOLOv3: multi-scale with FPN; YOLOv5: AutoAnchor, Mosaic, focus layer; YOLOv8: anchor-free, decoupled head, new backbone; YOLO-NAS and YOLO-World (open-vocabulary); real-time detection tradeoffs; deployment on edge (ONNX, TensorRT, CoreML).

- **Semantic Segmentation** — Per-pixel classification; FCN (fully convolutional); U-Net (encoder-decoder with skip connections, dominant in medical imaging); DeepLab family (atrous convolution, ASPP, CRF post-processing); SegFormer (hierarchical transformer encoder, lightweight MLP decoder); mIoU as evaluation metric.

- **Instance Segmentation** — Mask R-CNN (Faster R-CNN + mask branch); YOLACT (real-time with prototype masks); SOLOv2; the difference from semantic segmentation (each object instance separate); Panoptic segmentation (semantic + instance unified); evaluation (AP with mask IoU).

- **Depth Estimation** — Monocular depth estimation (ill-posed problem); self-supervised from stereo or video; MiDaS (multi-scale encoder, relative depth); Depth Anything v2 (foundation model for depth); scale-and-shift invariant loss; metric vs relative depth; applications (autonomous driving, AR/VR).

### Modern Architectures

- **Vision Transformer (ViT)** — Patch embedding: split image into 16×16 patches, linear project to d_model; [CLS] token for global representation; standard transformer encoder; position embeddings for patches; ViT-B/L/H variants; why ViT needs more data than CNNs (less inductive bias); DeiT (data-efficient, distillation token); Swin Transformer (shifted windows, hierarchical, dominates dense prediction).

- **CLIP** — Contrastive Language-Image Pretraining; dual encoder (image + text); InfoNCE loss over batch; zero-shot classification via cosine similarity to text templates; CLIP embeddings as universal visual features; OpenCLIP; SigLIP (sigmoid loss, more stable); use in image search, multimodal RAG, VLM training.

- **DINO / DINOv2** — Self-supervised ViT training; student-teacher with momentum encoder; centering and sharpening to prevent collapse; patch-level features; DINOv2: curated LVD-142M dataset, registers tokens, excellent dense features for segmentation and depth; backbone for many downstream tasks without fine-tuning.

- **Segment Anything (SAM)** — Foundation model for promptable segmentation; image encoder (ViT-H), prompt encoder (points/boxes/masks/text), mask decoder (transformer + upsampling); zero-shot transfer; SA-1B dataset (1B masks); SAM 2: video SAM with memory bank for object tracking across frames.

### Generative CV

- **GAN** — Generator vs Discriminator adversarial game; minimax loss; mode collapse and training instability; DCGAN (conv/transposed-conv, BN); conditional GAN (class label conditioning); Wasserstein GAN (Earth Mover distance, gradient penalty); StyleGAN (style-based generator, progressive growing, high-fidelity faces); applications: super-resolution (SRGAN), pix2pix (image translation).

- **VAE** — Encoder → mean + log-variance → reparameterization trick → decoder; ELBO loss (reconstruction + KL divergence); latent space interpolation; posterior collapse problem; VQ-VAE (discrete latent codes, codebook learning); VQ-VAE-2 for high-resolution generation; the latent space used by Stable Diffusion.

- **Diffusion Models** — Forward process: gradually add Gaussian noise over T steps; reverse process: learn to denoise (predict noise ε via U-Net); DDPM (denoising diffusion probabilistic models); DDIM (deterministic sampling, fewer steps); variance schedule (linear, cosine); classifier-free guidance (CFG): jointly train unconditional + conditional, blend at inference; score matching connection.

- **Stable Diffusion** — Latent diffusion model (LDM): diffusion in VAE latent space (4× compressed); CLIP text encoder for conditioning; cross-attention for text-image interaction; U-Net denoiser backbone; SDXL (two-stage: base + refiner, larger U-Net); SD 3 (DiT-based, flow matching, multi-modal diffusion transformer); Flux.1 (rectified flow, hybrid attention).

- **ControlNet** — Copy U-Net encoder weights + zero-convolution connections; condition on additional signals (edge maps, depth, pose, segmentation) without losing generative quality; zero initialization prevents destroying pretrained weights at start; reference-only ControlNet for style transfer; IP-Adapter for image prompt conditioning.

---

## 05. Generative AI

The applied layer for agents, retrieval, and efficient LLM inference — where foundation models become systems.

### Agents

- **AI Agents Overview** — Agent formula: perception → reasoning → action → memory loop; tool-using agents vs embodied agents vs code agents; taxonomy of agency levels (zero autonomy → fully autonomous); production patterns: single-agent vs multi-agent; when agents add value vs when a single LLM call suffices.

- **ReAct Pattern** — Reason-Act interleaving: generate thought → generate action → observe → repeat; grounding reasoning in real observations; ReAct vs Chain-of-Thought (CoT reasons only, ReAct reasons + acts); implementation with LangChain/LangGraph; failure modes (stuck in loops, hallucinated tool results); when to use plan-first vs interleave.

- **Plan and Execute** — Separate planning and execution phases; planner generates full plan upfront; executor steps through plan calling tools; replanning on failure; comparison to ReAct (ReAct replans each step, Plan-Execute commits upfront); LangGraph implementation; use cases (long-horizon tasks, predictable pipelines).

- **Memory in Agents** — Four-tier hierarchy: Working memory (context window), Episodic memory (conversation/session history), Semantic memory (long-term facts in vector store), Procedural memory (tool definitions, system prompts); retrieval-augmented memory; memory consolidation from episode to semantic; forgetting and decay strategies; Mem0, Letta, Zep implementations.

- **Multi-Agent Systems** — Supervisor pattern (orchestrator + specialized sub-agents); swarm (peer agents, emergent coordination); pipeline (sequential hand-offs); blackboard (shared state); LangGraph multi-agent implementation; CrewAI role-based agents; AutoGen conversational agents; cross-vendor A2A protocol; failure modes (cascading errors, communication overhead).

- **Tool Use and Function Calling** — Tool definition as JSON schema; tool choice (auto, any, specific); parallel tool calls; nested tool calls; tool result injection; Anthropic tool use API; OpenAI function calling; MCP (Model Context Protocol) as a standard tool protocol; tool error handling and retry loops; security considerations (injection via tool results).

### Inference Optimization

- **KV Cache** — Keys and values from all past tokens stored in GPU memory; memory formula: 2 × num_layers × num_heads × head_dim × seq_len × bytes_per_element; GQA/MQA to reduce KV heads (DeepSeek MLA as extreme compression); paged KV cache (vLLM PagedAttention: logical blocks → physical blocks, copy-on-write for beam search); KV cache quantization (INT8/INT4 for further memory reduction); prompt caching for repeated prefixes.

- **Flash Attention** — Standard attention: O(N²) SRAM reads/writes; FlashAttention: tiled computation keeping intermediate results in SRAM; O(N²/M) SRAM reads where M is SRAM size; backward pass with recomputation; FlashAttention-2 (better parallelism across seq len); FlashAttention-3 (H100 async WGMMA + FP8); 2–4× wall-clock speedup; no approximation (exact attention).

- **Speculative Decoding** — Bottleneck: LLM decode is memory-bandwidth-bound (1 token per forward pass); draft model generates k tokens fast; target (verifier) model scores all k+1 tokens in parallel; accept tokens with probability min(1, p_target / p_draft); expected speedup: 2–3× on aligned tasks; draft model selection (smaller same-family model, Medusa multi-head drafts, EAGLE speculative heads).

- **Quantization for Inference** — FP32 → FP16 → BF16 → INT8 → INT4 → INT2 precision tradeoffs; GPTQ: layer-by-layer weight quantization with Hessian-based compensation; AWQ: activation-aware weight quantization (protect salient channels); GGUF: CPU-friendly format with multiple quant levels (Q2_K through Q8_0); EXL2: token-level mixed precision; KV cache quantization; INT4 weight + FP16 activation (W4A16) as the practical sweet spot.

- **Continuous Batching** — Static batching: wait for full batch, pad to max length (inefficient); iteration-level batching: add new requests mid-batch when a sequence finishes; eliminates padding overhead; how vLLM and SGLang implement it; chunked prefill: split long prefills across steps to keep TTFT low; the interaction between continuous batching and PagedAttention.

### Vector Databases

- **Vector Databases Overview** — When you need a vector DB vs just NumPy (scale, persistence, filtered search); core operations: upsert, query (ANN), delete, filter; metadata alongside vectors; key players: Pinecone (managed), Weaviate (hybrid, open), Qdrant (Rust, high performance), Chroma (local-first), pgvector (PostgreSQL extension), Milvus/Zilliz (large scale).

- **ANN Algorithms** — Exact KNN is O(N·d) — unscalable at millions of vectors; HNSW (Hierarchical Navigable Small World): probabilistic layered graph, O(log N) query, high recall, large memory; IVF (Inverted File Index): cluster centroids + inverted lists, nprobe tradeoff; HNSW+PQ: quantize vectors inside HNSW for memory reduction; DiskANN: SSD-resident graph for billion-scale; recall vs latency vs memory tradeoff surface.

- **Embedding Models** — Sentence transformers (bi-encoders): BGE, E5, GTE, all-MiniLM; OpenAI text-embedding-3; Cohere Embed v3; Matryoshka Representation Learning (MRL): truncate to smaller dimensions without retraining; late interaction (ColBERT): per-token embeddings + MaxSim scoring; multimodal embeddings (CLIP, SigLIP); embedding model selection criteria (task, domain, language, dimension, cost).

- **Pinecone** — Serverless Pinecone (no cluster management, consumption-based); pod-based (p1/s1/p2 pod types); namespaces for multi-tenancy; metadata filtering with hybrid pushdown; sparse-dense index for hybrid search; Pinecone Inference API; when Pinecone wins (fully managed, fast prototyping) vs alternatives (TCO at scale).

- **Weaviate** — Schema-based with classes and properties; Weaviate modules: text2vec-openai/cohere/transformers; HNSW index with BM25 hybrid; WeaviateQL and GraphQL API; multi-tenancy (separate shards per tenant); Weaviate Cloud; generative search (pipe retrieval into LLM); strong hybrid search story.

- **Chroma** — Embedded (in-process Python) and client-server modes; simple API (add, query, delete); metadata filtering; HNSWlib under the hood; ephemeral vs persistent; integrates natively with LangChain and LlamaIndex; best for prototyping and local development; limitations at production scale.

- **pgvector** — PostgreSQL extension: vector type, ivfflat and hnsw index types; SQL + vector in one query (filter + rank in single query plan); familiar tooling (migrations, backups, ACID); pgvector + RLS for row-level tenant isolation; limitations (single-node unless Citus/Aurora); right choice when you already run Postgres and data volume is moderate.

---

## 06. MLOps

The operational discipline of building, deploying, monitoring, and maintaining ML systems in production.

### Data

- **Data Labeling** — Annotation types (classification, bounding box, segmentation, span, preference); labeling platforms: Scale AI, Label Studio, Argilla, Roboflow; inter-annotator agreement (IAA): Cohen's kappa, Fleiss kappa, Krippendorff alpha; label schema design; active learning for efficient labeling; LLM-as-annotator and quality control; cost estimation.

- **Data Quality and Validation** — Great Expectations / Pandera for schema validation; statistical profiling (ydata-profiling); anomaly detection in feature distributions; data contracts between upstream producers and ML consumers; validation at ingestion vs training time; handling missing values (imputation strategies, indicators); duplicate detection.

- **Data Versioning (DVC)** — Data Version Control: git-like versioning for datasets and models; DVC remote storage (S3, GCS, Azure Blob); dvc run for pipeline stage tracking; dvc repro for pipeline reproduction; dvc diff and dvc metrics diff; comparison to lakeFS, Delta Lake, Hugging Face datasets versioning; when DVC is the right tool.

- **Feature Stores** — Point-in-time correctness (training-serving skew if you don't get this right); online store (low-latency serving: Redis, DynamoDB) + offline store (batch: BigQuery, Snowflake, Delta); feature definitions as code; Feast, Tecton, Hopsworks, Vertex AI Feature Store; monitoring feature freshness; feature sharing across teams; feature store vs vector store.

### Experiment Tracking

- **Experiment Tracking Overview** — What to track: hyperparameters, metrics, artifacts, code version, environment; why ad-hoc tracking (spreadsheets, naming conventions) fails at scale; run comparison and hyperparameter visualization; reproducibility requirements; integration with training loop.

- **MLflow** — Tracking (log_param, log_metric, log_artifact); Runs and Experiments; MLflow Projects (reproducible code packaging); MLflow Models (multi-flavor model format, pyfunc); MLflow Registry (stage transitions: Staging → Production → Archived); MLflow Serving; self-hosted vs Databricks managed; limitations vs W&B for deep learning.

- **Weights and Biases** — Wandb init, log, finish API; run comparison dashboard; hyperparameter importance (correlation analysis); wandb.sweep() for distributed HPO; Artifacts for dataset and model versioning; Tables for prediction analysis; Reports for sharing results; wandb.watch() for gradient/parameter histograms; Prompts for LLM evaluation; W&B vs MLflow decision.

### Model Management

- **Model Cards** — Metadata standard: model description, intended use, out-of-scope uses, training data, evaluation results, ethical considerations, limitations; Google Model Card toolkit; Hugging Face model card README convention; model cards for compliance (EU AI Act Art. 13); tiered model card templates (internal vs public-facing).

- **Model Registry** — Centralized store for model artifacts + metadata; stage lifecycle (experimental → staging → production → archived); A/B model comparison; approval workflows; rollback procedures; MLflow Registry, W&B Artifacts, Hugging Face Hub, SageMaker Model Registry; registry as a gate for deployment.

- **Model Versioning** — What constitutes a new model version (architecture change, training data change, significant hyperparameter change); semantic versioning for models; how to version prompts alongside model; rollback strategy; canary deployment for version transitions; model lineage and audit trails.

### Monitoring

- **ML Monitoring Overview** — Three types of drift; data quality monitoring; prediction monitoring; business metric monitoring; alerting strategy; monitoring stack selection; the monitoring-retraining loop.

- **Data Drift** — Covariate shift: P(X) changes, P(Y|X) stable; detecting drift: PSI (Population Stability Index), KS test, Wasserstein distance, MMD; drift dashboard with Evidently AI; monitoring feature distributions in production; embedding drift for NLP/LLM inputs; setting drift thresholds; root cause investigation.

- **Concept Drift** — P(Y|X) changes (label distribution changes); harder to detect without ground truth labels; proxy metrics (downstream outcomes); delayed labels and their handling; different drift types: sudden, gradual, recurring, incremental; when to retrain vs when to investigate.

- **A/B Testing for ML** — Randomized experiment design; treatment assignment; minimum detectable effect and sample size calculation; sequential testing and optional stopping; metric selection (guardrail vs primary); interleaving experiments for ranking; multi-armed bandit as an alternative; the role of A/B in the ML feedback loop.

### Pipelines

- **ML Pipelines Overview** — Why pipelines: reproducibility, modularity, scheduling; components (ingestion, preprocessing, training, evaluation, deployment); pipeline orchestration vs workflow orchestration; directed acyclic graphs (DAGs); trigger mechanisms (schedule, event, manual); artifact passing between steps.

- **Airflow for ML** — DAG definition in Python; operators (BashOperator, PythonOperator, Kubernetes); sensors for external triggers; XCom for inter-task communication; Airflow on Kubernetes (KubernetesPodOperator); backfill and catchup; MLflow integration; limitations for ML (not a native ML platform, heavyweight for simple pipelines).

- **Kubeflow** — Kubernetes-native ML platform; Kubeflow Pipelines (KFP): DSL for defining pipelines, containers as steps; Katib for hyperparameter tuning; KServe for model serving; Kubeflow Training Operator (TFJob, PyTorchJob); multi-user namespace isolation; comparison to Vertex AI Pipelines, SageMaker Pipelines.

- **Prefect** — Python-native flow and task decorators; Prefect Cloud vs self-hosted server; deployments for scheduling; work pools and workers; lazy evaluation; caching and retries; blocks for secrets/credentials; Prefect vs Airflow (simpler, more Pythonic, better error messages); Prefect vs Dagster (similar philosophy, different data asset abstractions).

### Serving

- **Model Serving Overview** — REST vs gRPC; synchronous vs asynchronous inference; online (real-time) vs batch (offline) vs streaming inference; hardware selection (CPU, GPU, specialized accelerators); scaling strategies; latency SLOs; the serving stack: framework → server → API gateway → load balancer.

- **FastAPI for ML** — Lightweight ASGI server; Pydantic request/response validation; async endpoints; background tasks; dependency injection; uvicorn and gunicorn; lifespan events for model loading; health and readiness endpoints; minimal overhead for single-model serving; when to use FastAPI vs dedicated serving framework.

- **BentoML** — Service abstraction with @bentoml.service decorator; runner for model computation; Bento packaging (model + code + dependencies); Yatai for container registry; BentoCloud managed deployment; adaptive batching built-in; multi-model pipelines; comparison to Triton (simpler API, less performance at scale).

- **TorchServe** — PyTorch native serving; model archive format (.mar); multi-model serving; custom handler for pre/post-processing; metrics API; management API; A/B testing via traffic splitting; TorchScript for model optimization; integration with AWS SageMaker; comparison to FastAPI (better batching, more overhead).

- **Triton Inference Server** — Multi-framework backend (TensorRT, ONNX Runtime, TensorFlow, PyTorch, Python); model ensemble pipelines; dynamic batching and sequence batching; concurrent model execution on multiple GPUs; perf_analyzer for benchmarking; DALI preprocessing on GPU; model control API; the standard for high-throughput GPU serving.

- **Ray Serve** — Built on Ray distributed runtime; deployment graph for DAG of models; autoscaling via Ray's resource manager; composable deployments; fractional GPU; deployment handles for async calling; Ray Serve vs Triton (Ray Serve for heterogeneous pipelines, Triton for pure model serving performance).

---

## 07. Infrastructure

The compute layer — GPU clusters, cloud platforms, distributed training, and model optimization for production.

### Cloud Platforms

- **AWS SageMaker** — SageMaker Studio (unified IDE); Training Jobs (managed EC2 with automatic scaling); SageMaker Experiments; Processing Jobs for data prep; SageMaker Pipelines (step-based CI/CD); Model Registry; SageMaker Endpoints (real-time and batch); Inference Recommender; JumpStart (foundation models); SageMaker Clarify (bias/explainability); Hyperpod for large-scale training clusters.

- **Azure ML** — Azure ML Workspaces; Compute Clusters and Compute Instances; Environments (Docker + conda); Jobs (command, sweep for HPO, pipeline); MLflow integration; Azure ML Registry for cross-workspace model sharing; Managed Online Endpoints; Batch Endpoints; Prompt Flow for LLM pipelines; Azure AI Foundry for managed LLM services.

- **GCP Vertex AI** — Vertex AI Workbench; Custom Training (Python package or Docker); Hyperparameter Tuning with Vizier; Vertex AI Pipelines (KFP-based); Model Registry; Online Prediction Endpoints; Batch Prediction; Feature Store; Vertex AI Search and Conversation; Model Garden (foundation models); TPU support; Colab Enterprise integration.

### Containerization

- **Docker for ML** — Dockerfile best practices for ML (base image selection, layer caching, multi-stage builds); managing large model files (not in Docker image); NVIDIA Container Toolkit for GPU passthrough; bind mounts for datasets; health checks for model servers; docker-compose for local development stacks; image security scanning; registry choices (ECR, GCR, Docker Hub, GHCR).

- **Kubernetes for ML** — ML workload types (training jobs, serving deployments, notebooks); GPU resource requests and limits; node selectors and taints/tolerations for GPU nodes; Horizontal Pod Autoscaler (and its limitations for LLMs); KEDA for queue-based autoscaling; PersistentVolumeClaims for shared datasets; Helm for MLOps tool deployment; Kubernetes on-prem vs managed (EKS, GKE, AKS).

### GPU Computing

- **GPU Architecture Basics** — SIMT execution model; streaming multiprocessors (SMs) and CUDA cores; warp and warp divergence; global, shared, L1, L2 cache hierarchy; memory bandwidth as the bottleneck for LLM inference; PCIe vs NVLink bandwidth (A100 SXM NVLink: 600 GB/s vs PCIe: 64 GB/s); tensor cores and mixed-precision compute; compute-to-memory-bandwidth ratio and the roofline model.

- **CUDA Fundamentals** — Kernel launch syntax <<<gridDim, blockDim>>>; thread, block, grid hierarchy; shared memory for inter-thread communication within a block; warp-level primitives; atomic operations; CUDA streams for concurrency; pinned (page-locked) memory for fast H2D/D2H transfers; nsight systems / nsight compute for profiling; PTX intermediate representation.

- **cuDNN** — cuDNN convolution algorithms (implicit gemm, FFT, Winograd); cuDNN attention (used by FlashAttention); workspace memory management; cuDNN handles and stream association; auto-tuner for algorithm selection; cuBLAS for general GEMM; integration with PyTorch (ATen dispatch to cuDNN/cuBLAS/custom CUDA kernels).

### Distributed Training

- **Distributed Training Overview** — Why single-GPU isn't enough: model too large (model parallelism), data too large (data parallelism), want speed (both); synchronous vs asynchronous training; collective communication primitives (AllReduce, AllGather, ReduceScatter, Broadcast, Barrier); NCCL for GPU, Gloo for CPU; ring-AllReduce for bandwidth-optimal gradient aggregation.

- **Data Parallelism** — Replicate model across GPUs; split batch; synchronize gradients via AllReduce; DDP (DistributedDataParallel): gradient bucketing, overlap communication with compute; when DDP works (model fits in one GPU); gradient compression (PowerSGD); elastic training.

- **Model Parallelism** — Tensor Parallelism: split individual layers across GPUs (columns/rows of weight matrices); Pipeline Parallelism: assign layers to GPUs, micro-batches to fill pipeline bubbles; 3D parallelism: TP + PP + DP; expert parallelism for MoE (route tokens to different GPU groups); memory savings at the cost of communication overhead.

- **Tensor Parallelism** — Megatron-LM column-parallel and row-parallel linear layers; AllReduce after row-parallel (gradient sync); fused attention with TP; TP degree and its communication cost; NVLink bandwidth requirement; Megatron-LM vs tensor_parallel library; why TP is usually limited to within a node.

- **Pipeline Parallelism** — GPipe: synchronous pipeline, 1F1B schedule; PipeDream: asynchronous, weight stash for correctness; micro-batching to fill pipeline; pipeline bubble fraction 1/(1+m) where m is micro-batch count; 3D parallelism implementation in Megatron-LM; interleaved schedule for reduced bubble.

- **DeepSpeed ZeRO** — Memory redundancy in DDP: every GPU holds full optimizer states + gradients + parameters; ZeRO Stage 1: partition optimizer states; Stage 2: + gradients; Stage 3: + parameters; memory savings (Stage 3: linear in world size); ZeRO-Infinity: NVMe offload; ZeRO-R for activation checkpointing; integration with HuggingFace Trainer and Accelerate.

### Model Optimization

- **Quantization** — Why quantize: reduce model size and memory bandwidth; PTQ (Post-Training Quantization): quantize after training; QAT (Quantization-Aware Training): simulate quantization during training; INT8 symmetric vs asymmetric; per-tensor vs per-channel quantization; outlier channels in LLMs (LLM.int8()); smooth quant; GPTQ, AWQ, GGUF for LLMs; ONNX quantization for classical models.

- **Pruning** — Structured vs unstructured pruning; magnitude-based weight pruning (L1); movement pruning (prune weights that move toward zero); gradient-based importance; lottery ticket hypothesis; structured pruning (remove heads, channels, layers) for actual speedup; iterative pruning + fine-tuning; SparseGPT for one-shot LLM pruning.

- **Knowledge Distillation** — Teacher-student framework; soft targets (temperature-scaled softmax) vs hard targets; KL divergence distillation loss; DistilBERT (6L BERT from 12L BERT, 97% performance, 40% smaller); feature distillation (match intermediate representations); self-distillation from chain-of-thought; online vs offline distillation; distillation from ensemble teachers.

- **Mixed Precision Training** — FP32 master weights + FP16 forward/backward; loss scaling to prevent underflow; GradScaler in PyTorch; BF16 (larger exponent range, more stable, preferred for training); tensor cores accelerate FP16/BF16 matrix multiply; INT8 training with stochastic rounding; memory savings: 2× vs FP32; throughput improvement: 2–4×.

- **Neural Architecture Search (NAS)** — Motivation: manual architecture design is expensive; search space definition; search strategies: grid, random, reinforcement learning, evolutionary, Bayesian optimization; one-shot NAS (weight sharing: DARTS, SMASH); EfficientNet found by NAS; hardware-aware NAS (latency constraints); NAS for edge devices; MNASNet, OFA (Once-for-All).

---

## 08. Data Engineering for AI

The data layer as a first-class engineering system — pipelines, quality, storage, and the infrastructure that feeds models.

### Data Pipelines

- **ETL/ELT for ML** — Extract-Transform-Load vs Extract-Load-Transform; batch vs streaming; schema evolution; data contracts between producers and consumers; CDC (Change Data Capture) for incremental updates; data freshness SLAs; orchestration options; when to build custom vs use managed services.

- **Apache Airflow** — DAG-based scheduling; operators and sensors; XCom for task data passing; dynamic DAGs with task group; Airflow on Kubernetes; monitoring with Flower and the Airflow UI; connection and variable management; common patterns: backfill, catchup, SLA misses; Airflow vs Prefect vs Dagster decision.

- **Apache Spark for ML** — Distributed DataFrame processing (PySpark); Spark MLlib; Spark Structured Streaming for real-time feature computation; partitioning and shuffle optimization; Adaptive Query Execution; integration with Delta Lake; broadcasting small DataFrames; Spark on Kubernetes vs YARN; when Spark is overkill (small data) vs essential (terabyte+ scale).

- **Streaming ML with Kafka** — Kafka topics, partitions, consumer groups; exactly-once semantics; Kafka Streams for stateful stream processing; Faust (Python Kafka Streams); streaming feature computation; real-time model scoring pipeline (Kafka → feature extraction → model → output topic); Kafka Connect for source/sink integration; lag monitoring.

### Quality

- **Data Annotation Strategies** — Active learning to prioritize informative samples; uncertainty sampling, query-by-committee, core-set selection; crowdsourcing quality control (majority vote, honeypot tasks, worker reputation); expert annotation for high-stakes domains; weak supervision (Snorkel) — programmatic labeling with noisy labeling functions; label-efficient strategies.

- **Data Quality and Validation** — Completeness, accuracy, consistency, timeliness, uniqueness dimensions; schema validation with Great Expectations or Pandera; anomaly detection in feature space; data profiling (ydata-profiling, whylogs); data contracts enforced at pipeline boundaries; data observability (Monte Carlo, Bigeye); the cost of bad data downstream.

- **Synthetic Data Generation** — Why synthetic data: privacy, rare events, controlled experiments; Gaussian copula for tabular (SDV library); CTGAN and TVAE for realistic tabular distributions; LLM-based synthetic NLP data (Evol-Instruct, self-instruct, genstruct); synthetic image augmentation (diffusion-generated training data); verifiable synthetic data for math/code; quality checks (train on synthetic, test on real).

### Storage

- **Data Lakes and Lakehouses** — Data lake: raw data in object storage (S3/GCS/ADLS), flexible schema; lakehouse: ACID transactions + schema enforcement on lake (Delta Lake, Apache Iceberg, Apache Hudi); open table format comparison (Delta: Databricks, Iceberg: Netflix/Apple, Hudi: Uber); Z-ordering and liquid clustering for query acceleration; time travel; metadata layer architecture.

- **Data Warehouses for ML** — OLAP vs OLTP; columnar storage and vectorized query execution; Snowflake, BigQuery, Redshift, Databricks SQL; ML-specific features: feature engineering in SQL, model training integration (BigQuery ML, Snowpark ML); cost model (storage vs compute separation); query result caching; ML training data export patterns.

- **Delta Lake** — Open-source ACID table format on cloud object storage; transaction log (_delta_log) for ACID; schema enforcement and evolution; time travel (VERSION AS OF, TIMESTAMP AS OF); OPTIMIZE and ZORDER for data skipping; auto-optimize and auto-compact; Delta Live Tables for declarative pipeline definition; Unity Catalog for governance; Delta Sharing for cross-org data sharing.

---

## 09. AI System Design

End-to-end system design for ML applications — the discipline required for staff-level ML and AI engineering interviews.

- **Interview Framework** — Four-phase structure: clarify requirements (online/offline, scale, latency, accuracy tradeoffs) → ML framing (task type, label definition, feature space) → system design (data pipeline, training, serving) → measurement and iteration; common pitfalls (jumping to model before requirements, ignoring monitoring); how to handle ambiguity; time management in a 45-minute interview.

- **Recommendation System** — Candidate generation (ANN over user/item embeddings, collaborative filtering, two-tower model) → ranking (pointwise/pairwise/listwise, GBDT or DNN) → re-ranking (diversity, business rules, real-time features); cold-start problem; implicit vs explicit feedback; evaluation: offline (NDCG, MRR) + online (CTR, engagement, revenue); serving: low-latency (<100ms) candidate retrieval + feature serving.

- **Semantic Search System** — Bi-encoder for recall (HNSW ANN index) + cross-encoder for precision (reranking); query understanding (expansion, classification, intent detection); document ingestion pipeline (chunking, embedding, indexing); hybrid search (BM25 + dense fusion via RRF); evaluation: MRR, NDCG, recall@K; multi-lingual and multi-modal extensions; latency vs quality tradeoffs.

- **LLM Application Architecture** — Prompt engineering layer; context assembly (RAG retrieval + conversation history + tool results); streaming response via SSE; token budget management; output parsing and validation; tool-use loop; cost accounting per request; rate limiting and quota management; multi-model fallback (primary → fallback → degraded mode); observability with traces.

- **Ranking System** — Learning-to-rank formulations: pointwise (regression/classification), pairwise (RankNet, LambdaRank), listwise (LambdaMART, SoftMax Loss); feature engineering for ranking (user features, item features, context features, interaction features); GBDT + LR stacking; DNN-based rankers; online learning for ranking; evaluation: NDCG@K, ERR, MAP; position bias correction (inverse propensity scoring).

- **Recommendation System** — (Covered above in Semantic Search + Ranking context; this note focuses on) collaborative filtering: matrix factorization (ALS, SVD++); neural collaborative filtering; session-based recommendation (GRU, Transformer-based); graph neural networks for social recommendation; multi-task learning (predict CTR + CVR jointly); feature crosses in wide-and-deep learning.

- **Ad Click Prediction** — Logistic regression baseline; factorization machines (FM) for sparse feature interactions; DeepFM (FM + DNN); wide-and-deep learning; DCN (Deep & Cross Network) for explicit feature crosses; feature hashing for high-cardinality categoricals; real-time feature serving (<5ms); calibration (CTR prediction must be calibrated for bid price); AUC-ROC as primary offline metric; online metrics: RPM, CTR, conversion rate.

- **Fraud Detection System** — Graph-based fraud detection (GNN on transaction graph); behavioral sequence modeling; anomaly detection vs supervised classification; velocity rules + ML hybrid; feature engineering: transaction history, device fingerprint, velocity, network features; near-real-time inference (<100ms P99); class imbalance (1:1000+ ratio); explainability for investigations; feedback loop (confirmed fraud labels → retraining).

- **NLP Classification Pipeline** — Text preprocessing; feature extraction (bag-of-words, TF-IDF, fine-tuned BERT embeddings); multi-class and multi-label classification; hierarchical classification; active learning for annotation efficiency; handling long documents (chunking + aggregation); multilingual models; confidence calibration; threshold optimization per class; production: model registry, canary deployment, shadow mode.

- **Real-Time vs Batch Inference** — Real-time: sub-100ms requirement, model loaded in memory, feature serving from online store; batch: hours/days SLA, high throughput, cost-optimized; nearline: minutes SLA, async pipeline; Lambda architecture (batch + speed layer); Kappa architecture (streaming only); choosing the right pattern based on freshness requirement and cost.

---

## 10. Evaluation and Safety

Measuring model quality and ensuring AI systems behave safely and fairly.

### Evaluation Metrics

- **NLP Evaluation Metrics** — BLEU (n-gram overlap, brevity penalty — translation/generation); ROUGE-N, ROUGE-L, ROUGE-Lsum (recall-oriented — summarization); BERTScore (contextual embedding similarity); METEOR; human evaluation: quality dimensions, rater agreement, annotation platform; LLM-as-judge: G-Eval, MT-bench, Alpaca Eval; the verbosity and sycophancy biases in LLM judges.

- **CV Evaluation Metrics** — Classification: top-1/top-5 accuracy; Detection: mAP (mean Average Precision), AP@50, AP@75, AP@[.5:.95]; Segmentation: mIoU (mean Intersection over Union), pixel accuracy, frequency-weighted IoU; Generation: FID (Fréchet Inception Distance), IS (Inception Score), CLIP score, LPIPS; depth: AbsRel, SqRel, RMSE, δ<1.25.

- **LLM Benchmarks** — MMLU (57-subject academic knowledge); HumanEval, MBPP, SWE-bench (coding); MATH, GSM8K (mathematical reasoning); ARC-AGI (abstract reasoning); BIG-Bench Hard; GAIA (real-world task completion by agents); BFCL (function calling); Chatbot Arena (human ELO); the benchmark contamination problem and why new benchmarks keep appearing; building internal golden evals.

- **Evaluation Frameworks** — RAGAS for RAG evaluation (faithfulness, answer relevance, context precision/recall); Evals (OpenAI framework); LangSmith automated evaluators; Braintrust; Phoenix (Arize); confidence calibration and ECE (Expected Calibration Error); building a golden test set; regression testing in CI; eval-gated deployments.

### Interpretability

- **SHAP** — SHapley Additive exPlanations: game-theoretic feature attribution satisfying efficiency, symmetry, dummy, additivity axioms; TreeSHAP for exact O(TL²M) computation on tree ensembles; DeepSHAP / GradientSHAP for neural nets; KernelSHAP as model-agnostic (slower); SHAP summary plot, dependence plot, waterfall plot; limitations (assumes feature independence in kernel version; expensive for large models).

- **LIME** — Local Interpretable Model-agnostic Explanations; perturb input → get predictions → fit sparse linear model locally; neighborhood sampling strategy; instability (different runs give different explanations); image LIME (superpixel segments); text LIME; LIME vs SHAP (LIME: faster, local only; SHAP: more principled, globally consistent).

- **Attention Visualization** — Visualizing attention weights as heatmaps; BertViz for multi-head attention; gradient-weighted attention (Grad-CAM style); why attention ≠ explanation (attention is not faithfully reflecting causality); attention rollout; probing classifiers for interpreting representations; mechanistic interpretability (superposition, circuits, features).

### Safety

- **Responsible AI** — Four pillars: fairness, accountability, transparency, ethics; RAI vs safety vs security vs compliance distinctions; EU AI Act overview; NIST AI RMF; ISO/IEC 42001; model cards as transparency artifacts; RAI governance structure; RAI release gates in CI/CD.

- **AI Bias and Fairness** — Sources of bias: historical bias, representation bias, measurement bias, aggregation bias, evaluation bias; fairness metrics: demographic parity, equalized odds, calibration, individual fairness; the impossibility theorem (cannot satisfy all fairness metrics simultaneously); bias auditing tools (Fairlearn, AIF360); mitigation: pre-processing (resampling), in-processing (adversarial debiasing), post-processing (threshold adjustment).

- **Adversarial Robustness** — Adversarial examples: small input perturbations → wrong predictions (FGSM, PGD, C&W attack); certified robustness vs empirical robustness; adversarial training as a defense; randomized smoothing for certified L2 robustness; transferability of attacks; adversarial robustness vs accuracy tradeoff; robust evaluation under distribution shift.

- **Red Teaming** — Systematic adversarial testing by a dedicated team; attack taxonomy: jailbreaks, prompt injection, policy bypass, data extraction, model inversion; automated red teaming with LLM red teamers; Garak and PyRIT frameworks; Attack Success Rate (ASR) measurement; red team findings → fine-tuning / system prompt updates → retest; continuous red teaming in production.

---

## 11. Key Papers

Landmark papers that shaped the field — read these to understand why modern AI looks the way it does.

- **Attention Is All You Need (2017)** — Vaswani et al.; introduced the transformer architecture; replaced RNN seq2seq with pure attention; scaled dot-product attention + multi-head attention; encoder-decoder with positional encodings; why this paper ended the RNN era; contributions: parallelism, long-range dependency modeling, the template every LLM follows.

- **BERT Paper (2018)** — Devlin et al.; bidirectional pre-training with MLM + NSP; the fine-tuning paradigm for NLP; contextual embeddings outperform static; ablation studies (MLM vs LTR, NSP value questionable); BERT variants (RoBERTa, ALBERT, DeBERTa); why BERT sparked the NLP transfer learning wave.

- **GPT-3 Paper (2020)** — Brown et al.; 175B parameter autoregressive LM; in-context learning with no gradient updates (zero-shot, one-shot, few-shot); emergent abilities at scale; few-shot prompting mechanics; limitations (factual errors, biases); sparked the prompt engineering and LLM applications era.

- **Chinchilla Paper (2022)** — Hoffmann et al.; compute-optimal scaling laws; Chinchilla (70B, 1.4T tokens) outperforms Gopher (280B, 300B tokens); equal scaling of model size and data; the shift from "train large models undertrained" to "train smaller models on more data"; implications for LLaMA series and open models.

- **Scaling Laws Paper (2020)** — Kaplan et al. (OpenAI); power-law relationships between compute, data, model size, and loss; compute-optimal frontier; how to extrapolate performance before training; contrast with Chinchilla corrections; why scaling laws drive modern AI roadmaps.

- **InstructGPT / RLHF (2022)** — Ouyang et al.; RLHF pipeline: SFT → reward model → PPO; aligning LLMs with human intent; 1.3B InstructGPT preferred over 175B GPT-3 by human raters; introduced the alignment tax; groundwork for ChatGPT and all instruction-following LLMs; key lesson: scale alone doesn't align.

- **LoRA Paper (2021)** — Hu et al.; low-rank weight update decomposition; matches full fine-tuning on most tasks with <1% of parameters; mathematical motivation via intrinsic dimensionality; which weight matrices to adapt (Q, K, V, output, up/down projections); rank sensitivity analysis; LoRA vs other PEFT methods.

- **FlashAttention Paper (2022)** — Dao et al.; IO-aware exact attention via tiling; hardware-aware algorithm exploiting SRAM vs HBM hierarchy; O(N) memory instead of O(N²); no approximation; FlashAttention-2 improvements; ubiquitous in all modern LLM training; why algorithm-hardware co-design matters.

- **CLIP Paper (2021)** — Radford et al. (OpenAI); contrastive image-text pre-training on 400M image-text pairs; zero-shot image classification by comparing to text descriptions; the representation space used by Stable Diffusion and countless multimodal applications; CLIP as a universal image encoder; SigLIP and OpenCLIP successors.

- **DDPM Paper (2020)** — Ho et al.; Denoising Diffusion Probabilistic Models; forward Gaussian noise process + learned reverse denoising; simplified training objective (predict noise ε); higher quality samples than GANs (no mode collapse); slow sampling (1000 steps); DDIM, PLMS, DPM-Solver as faster samplers; foundational paper for Stable Diffusion and modern image generation.

- **ResNet Paper (2015)** — He et al.; residual connections enable training of 152-layer networks; skip connections let gradients flow directly; batch normalization throughout; ImageNet 2015 winner; the residual block is now a universal building block (transformers have residual connections, all modern vision architectures use ResNet principles); why depth matters and how to make it work.

- **Word2Vec Paper (2013)** — Mikolov et al.; efficient neural word embeddings; Skip-gram and CBOW; negative sampling; linear semantic structure (analogy tasks); sparse → dense representation shift for NLP; precursor to all modern embedding models; shows distributional semantics can be learned from raw text at scale.

---

## How to Navigate This Vault

The 12 sections form a learning stack from bottom to top. Suggested paths:

**Complete Foundations Path (new to ML):**
`00 Foundations` → `01 Classical ML` → `02 Deep Learning` → `03 NLP (Fundamentals + Language Models)` → `11 Key Papers`

**LLM Engineering Path (building LLM applications):**
`03 NLP/LLMs` → `05 Generative AI (Agents + Inference Optimization + Vector DBs)` → `06 MLOps` → `09 AI System Design`

**Computer Vision Path:**
`02 Deep Learning (Architectures)` → `04 Computer Vision` → `07 Infrastructure (GPU Computing + Distributed Training)`

**MLOps and Production Path:**
`06 MLOps` → `07 Infrastructure` → `08 Data Engineering` → `10 Evaluation and Safety`

**ML System Design Interview Path:**
`09 AI System Design (Interview Framework first)` → `01 Classical ML (Evaluation)` → `03 NLP/LLMs` → `05 Generative AI` → `10 Evaluation and Safety`

**Research and Papers Path:**
`11 Key Papers` → linked architecture/technique notes → implementation notes in `02 Deep Learning` and `04 Computer Vision`
