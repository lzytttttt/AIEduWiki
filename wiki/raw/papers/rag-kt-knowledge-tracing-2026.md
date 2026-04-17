---
title: RAG-KT: Cross-platform Explainable Knowledge Tracing with Multi-view Fusion
created: 2026-04-16
updated: 2026-04-16
type: summary
tags: [knowledge-tracking, llm-education, knowledge-graph, adaptive-learning]
sources: []
---

# RAG-KT: Cross-platform Explainable Knowledge Tracing with Multi-view Fusion

**arXiv:** 2604.10960v1 | **Published:** 2026-04-13 | **Cats:** cs.AI
**Authors:** Zhiyi Duan, Hongyu Yuan, Rui Liu
**PDF:** https://arxiv.org/pdf/2604.10960v1

## Abstract

Knowledge Tracing (KT) infers a student's knowledge state from past interactions to predict future performance. Conventional Deep Learning (DL)-based KT models are typically tied to platform-specific identifiers and latent representations, making them hard to transfer and interpret. Large Language Model (LLM)-based methods can be either ungrounded under prompting or overly domain-dependent under fine-tuning. In addition, most existing KT methods are developed and evaluated under a same-distribution assumption. In real deployments, educational data often arise from heterogeneous platforms with substantial distribution shift, which often degrades generalization. To this end, we propose RAG-KT, a retrieval-augmented paradigm that frames cross-platform KT as reliable context constrained inference with LLMs. It builds a unified multi-source structured context with cross-source alignment via Question Group abstractions and retrieves complementary rich and reliable context for each prediction, enabling grounded prediction and interpretable diagnosis. Experiments on three public KT benchmarks demonstrate consistent gains in accuracy and robustness, including strong performance under cross-platform conditions.

## Problem

1. Traditional DL-based KT: tied to specific platform, not transferable
2. LLM-based KT: either ungrounded (prompting) or overly domain-dependent (fine-tuning)
3. Same-distribution assumption: fails under cross-platform real-world conditions

## Solution: RAG-KT

- Retrieval-augmented paradigm for cross-platform KT
- Multi-source structured context via "Question Group" abstractions
- Cross-platform alignment enables generalization
- Grounded + interpretable predictions

## Key Innovation

Question Group abstraction: unifies heterogeneous platform data into a common representation, enabling KT models to transfer across platforms.
