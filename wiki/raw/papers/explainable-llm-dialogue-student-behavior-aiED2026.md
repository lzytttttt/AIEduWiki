---
type: summary
title: "Tell Me Why: Designing an Explainable LLM-based Dialogue System for Student Problem Behavior Diagnosis"
authors:
  - Zhilin Fan
  - Deliang Wang
  - Penghe Chen
  - Yu Lu
published: 2026-04-24
venue: AIED 2026
arxiv: 2604.22237
tags:
  - explainability
  - problem-behavior
  - dialogue-system
  - teacher-support
  - AIED2026
sources:
  - https://arxiv.org/abs/2604.22237v1
---

# Tell Me Why：面向学生问题行为诊断的可解释LLM对话系统

## 问题

诊断学生问题行为需要教师综合多维信息、识别行为类别、规划干预策略。虽然微调LLM可通过多轮对话支持此过程，但很少解释**为何推荐某策略**，限制了透明度和教师信任。

## 技术方案

- **Fine-tuned LLM** base
- **Hierarchical attribution method**（基于可解释AI/xAI）：识别对话证据
- **自然语言解释生成**：基于证据生成推荐理由

## 评估结果

- 技术评估：方法在识别支持证据上优于基线
- 用户研究（22名职前教师）：收到解释的参与者报告**更高系统信任度**

## 结论

可解释LLM在教育对话系统中具有重要方向，提升教师对AI辅助决策的信任。

## 相关概念

- [[可解释教学编排]]
- [[教学智能体]]
- [[诊断推理与LLM智能体]]
