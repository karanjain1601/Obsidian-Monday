---
title: "Java AI/ML — Map of Content"
aliases: ["MOC Java AI ML"]
tags: [java, ai, ml, MOC, java-ai]
domain: Java
created: 2026-07-26
status: complete
---

# 🗺️ Java AI/ML — Map of Content

> [!abstract] What This Section Covers
> Java's AI/ML ecosystem has expanded dramatically. This section covers: DL4J for deep learning on the JVM, Apache OpenNLP for classical NLP tasks, Spring AI for integrating LLMs into Spring Boot applications, the broader Java ML library landscape, and patterns for integrating LLMs (Claude, GPT-4) into Java microservices using frameworks like LangChain4j and Spring AI.

## Concept Map
```mermaid
graph TD
    CENTER["🤖 Java AI/ML"]
    CENTER --> DL4J["[[Deeplearning4j]]\nDL4J · ND4J · Keras import\nGPU training · Spark"]
    CENTER --> NLP["[[OpenNLP]]\nApache OpenNLP\nNER · POS · tokenization"]
    CENTER --> SpringAI["[[Spring_AI]]\nChatClient · RAG\nVector stores · Tool calling"]
    CENTER --> MLLibs["[[Java_ML_Libraries]]\nSmile · Tribuo · Weka\nONNX runtime"]
    CENTER --> LLM["[[LLM_Integration_Java]]\nLangChain4j · OpenAI SDK\nfunction calling · streaming"]

    NLP -->|"classical ML"| MLLibs
    SpringAI -->|"uses"| LLM
    DL4J -->|"exports ONNX"| MLLibs

    style CENTER fill:#7c3aed,color:#fff
    style DL4J fill:#4a9eff,color:#fff
    style NLP fill:#4a9eff,color:#fff
    style SpringAI fill:#e64980,color:#fff
    style MLLibs fill:#f5a623,color:#fff
    style LLM fill:#2b8a3e,color:#fff
```

## Learning Path
1. [[Java_ML_Libraries]] — Survey the Java ML landscape before choosing a framework.
2. [[OpenNLP]] — Classical NLP tasks without neural networks.
3. [[Deeplearning4j]] — Training neural networks natively on the JVM.
4. [[LLM_Integration_Java]] — Integrating LLM APIs (OpenAI, Anthropic) into Java services.
5. [[Spring_AI]] — The Spring-idiomatic way to build AI-powered applications.

## All Notes at a Glance
| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Deeplearning4j]] | Advanced | DL4J network config, training, Keras import, Spark integration |
| [[OpenNLP]] | Intermediate | Tokenization, NER, POS tagging, custom model training |
| [[Spring_AI]] | Intermediate | ChatClient, RAG pipeline, vector stores, tool calling |
| [[Java_ML_Libraries]] | Intermediate | Smile, Tribuo, Weka, ONNX runtime comparison |
| [[LLM_Integration_Java]] | Advanced | LangChain4j, streaming, tool calling, local LLMs with Ollama |

## Key Questions This Section Answers
- What Java library should I use for classical ML (random forests, SVM)?
- How do I train a named entity recognition model with Apache OpenNLP?
- How does Spring AI abstract over different LLM providers?
- How do I stream LLM responses in a Spring Boot REST endpoint?
- When should I use Java ML vs calling Python ML services?
- How do I implement RAG (Retrieval-Augmented Generation) in Java?

## Related Sections
- [[_MOC_Java_Master|↑ Java Master MOC]]
- [[_MOC_Spring_Batch|↔ Spring Batch]] — batch ML inference pipelines
- [[_MOC_Data_Processing|↔ Java Data Processing]] — feature engineering for ML

#java #ai #ml #MOC #spring-ai
