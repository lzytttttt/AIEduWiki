---
title: Mathematics Teachers Interactions with a Multi-Agent System for Personalized Problem Generation
created: 2026-04-16
updated: 2026-04-16
type: summary
tags: [multi-agent, adaptive-learning, mathematics, personalized-learning, intelligent-tutoring]
sources: []
---

# Mathematics Teachers Interactions with a Multi-Agent System for Personalized Problem Generation

**arXiv:** 2604.12066v1 | **Published:** 2026-04-13 | **Cats:** cs.AI, cs.CY
**Authors:** Candace Walkington, Theodora Beauchamp, Fareya Ikram, Merve Koçyiğit Gürbüz, Fangli Xia
**PDF:** https://arxiv.org/pdf/2604.12066v1

## Abstract

Large language models can increasingly adapt educational tasks to learners characteristics. In the present study, we examine a multi-agent teacher-in-the-loop system for personalizing middle school math problems. The teacher enters a base problem and desired topic, the LLM generates the problem, and then four AI agents evaluate the problem using criteria that each specializes in (mathematical accuracy, authenticity, readability, and realism). Eight middle school mathematics teachers created 212 problems in ASSISTments using the system and assigned these problems to their students. We find that both teachers and students wanted to modify the fine-grained personalized elements of the real-world context of the problems, signaling issues with authenticity and fit. Although the agents detected many issues with realism as the problems were being written, there were few realism issues noted by teachers and students in the final versions. Issues with readability and mathematical hallucinations were also somewhat rare. Implications for multi-agent systems for personalization that support teacher control are given.

## System Architecture

- **Input:** Teacher provides base problem + desired topic
- **LLM generation:** Generates personalized math problem
- **4 evaluation agents:**
  1. Mathematical accuracy agent
  2. Authenticity agent
  3. Readability agent
  4. Realism agent
- **Output:** Refined problems assigned to students via ASSISTments platform

## Key Findings

- Teachers and students want to modify fine-grained personalized real-world context → authenticity issues
- Multi-agent detection caught many realism issues during generation
- Readability and mathematical hallucinations were rare
- Teacher control + AI generation can coexist effectively

## Relevance

Shows practical deployment of multi-agent AI for personalized education content generation, with teacher remaining in control loop.
