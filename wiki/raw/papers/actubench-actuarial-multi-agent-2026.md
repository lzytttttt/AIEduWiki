---
type: summary
title: "ActuBench: A Multi-Agent LLM Pipeline for Generation and Evaluation of Actuarial Reasoning Tasks"
authors:
  - Jan-Philipp Schmidt
published: 2026-04-22
venue: arXiv
arxiv: 2604.20273
tags:
  - assessment-generation
  - multi-agent
  - actuarial-education
  - MCQ
  - LLM-as-judge
sources:
  - https://arxiv.org/abs/2604.20273v1
---

# ActuBench：精算推理任务生成与评估的多智能体LLM流水线

## 核心贡献

ActuBench：多智能体LLM流水线，自动化生成和对齐国际精算师协会（IAA）教育大纲的高级精算评估题目。

## 流水线架构

四个LLM角色（adapter分离）：
1. **Draft Agent**：起草题目
2. **Distractor Agent**：构建干扰项
3. **Verifier Agent**：独立验证前两阶段 + 驱动有界一次性修复循环
4. **Auxiliary Agent**：Wikipedia笔记摘要和主题标注（成本优化）

## 评估规模

- **50个语言模型**（8家提供商）
- **100道最难选择题** + **100道开放式题目**（LLM judge评分）
- Leaderboard: https://actubench.de/en/

## 三大发现

1. **多智能体验证是load-bearing**：首次pass flag大多数起草题目，一次性修复循环解决大部分
2. **本地开源权重推理在成本-性能Pareto前沿**：Gemma~4（消费级硬件）+ Cerebras 120B开源权重模型主导近零成本区域
3. **MCQ vs LLM-as-Judge排名差异显著**：MCQ scaffold抬高了性能天花板，Judge模式评估才能在frontier区分模型

## 核心洞察

> MCQ scaffold inflates the performance ceiling, and Judge-mode evaluation is needed to discriminate at the frontier

## 相关概念

- [[自动选择题生成]]
- [[可解释教学编排]]
- [[教学智能体]]
