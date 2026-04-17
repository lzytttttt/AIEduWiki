---
title: Neural-Symbolic Knowledge Tracing: Responsible-DKT
created: 2026-04-16
updated: 2026-04-16
type: summary
tags: [knowledge-tracking, neural-symbolic, adaptive-learning, intelligent-tutoring]
sources: []
---

# Neural-Symbolic Knowledge Tracing: Responsible-DKT

**arXiv:** 2604.08263v1 | **Published:** 2026-04-09 | **Cats:** cs.AI
**Authors:** Danial Hooshyar, Gustav Šír, Yeongwook Yang, Tommi Kärkkäinen, Raija Hämäläinen
**PDF:** https://arxiv.org/pdf/2604.08263v1

## Abstract

The growing use of artificial intelligence (AI) in education, particularly large language models (LLMs), has increased interest in intelligent tutoring systems. However, LLMs often show limited adaptivity and struggle to model learners' evolving knowledge over time, highlighting the need for dedicated learner modelling approaches. Although deep knowledge tracing methods achieve strong predictive performance, their opacity and susceptibility to bias can limit alignment with pedagogical principles. To address this, we propose Responsible-DKT, a neural-symbolic deep knowledge tracing approach that integrates symbolic educational knowledge (e.g., mastery and non-mastery rules) into sequential neural models for responsible learner modelling. Experiments on a real-world dataset of students' math interactions show that Responsible-DKT outperforms both a neural-symbolic baseline and a fully data-driven PyTorch DKT model across training settings. The model achieves over 0.80 AUC with only 10% of training data and up to 0.90 AUC, improving performance by up to 13%. It also demonstrates improved temporal reliability, producing lower early- and mid-sequence prediction errors and the lowest prediction inconsistency rates across sequence lengths, indicating that prediction updates remain directionally aligned with observed student responses over time. Furthermore, the neural-symbolic approach offers intrinsic interpretability via a grounded computation graph that exposes the logic behind each prediction, enabling both local and global explanations. It also allows empirical evaluation of pedagogical assumptions, revealing that repeated incorrect responses (non-mastery) strongly influence prediction updates. These results indicate that neural-symbolic approaches enhance both performance and interpretability, mitigate data limitations, and support more responsible, human-centered AI in education.

## Key Contributions

1. **Responsible-DKT** — integrates symbolic educational knowledge into deep knowledge tracing
2. **Symbolic rules:** mastery vs. non-mastery rules guide neural predictions
3. **Interpretability:** grounded computation graph explains each prediction
4. **Data efficiency:** 0.80 AUC with only 10% training data
5. **Temporal reliability:** consistent predictions across sequence lengths

## Why Neural-Symbolic

- Pure neural KT: black box, opaque, can encode biases
- Symbolic rules: interpretable, aligned with pedagogical principles
- Hybrid: best of both — performance + interpretability + responsible AI
