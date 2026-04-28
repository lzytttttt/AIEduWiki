---
type: summary
title: "GAMED.AI: A Hierarchical Multi-Agent Framework for Automated Educational Game Generation"
authors:
  - Shiven Agarwal
  - Yash Shah
  - Ashish Raj Shekhar
  - Priyanuj Bordoloi
  - Vivek Gupta
published: 2026-04-27
venue: arXiv
arxiv: 2604.23947
tags:
  - educational-game-generation
  - multi-agent
  - bloom-taxonomy
  - langgraph
  -自动化教育
sources:
  - https://arxiv.org/abs/2604.23947v1
---

# GAMED.AI：自动化教育游戏生成的多智能体框架

## 核心贡献

GameDAI：分层多智能体框架，将教师提问转化为可玩的、基于教学法的教育游戏，通过形式化mechanic contracts验证。

## 关键数据

- **200题**跨越5个学科领域
- **90%**验证通过率
- **98.3%** schema合规率
- **73%** token reduction vs ReAct（~73,500 → ~19,900 tokens/game）
- **$0.46/game**成本
- 15种交互机制覆盖3类：空间推理、程序执行、高阶Bloom's Taxonomy目标

## 架构

- **Phase-based LangGraph子图**：多阶段生成流水线
- **Deterministic Quality Gates**：每阶段门控检查
- **Structured Pydantic Schemas**：结构化输出保证

## 核心洞察

> phase-bounded architectural structure与alignment质量的关联性强于prompting strategy alone

## 60秒生成

用户可在60秒内从自然语言生成Bloom对齐游戏，检查每个流水线阶段的Quality Gate输出，浏览50个涵盖全部15种机制类型的游戏库。

## 相关概念

- [[教学智能体]]
- [[可解释教学编排]]
- [[个性化问题生成]]
