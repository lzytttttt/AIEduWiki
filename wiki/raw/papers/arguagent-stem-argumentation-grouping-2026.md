---
type: summary
title: "ArguAgent: AI-Supported Real-Time Grouping for Productive Argumentation in STEM Classrooms"
authors:
  - Jennifer Kleiman
  - Yizhu Gao
  - Xin Xia
  - Zhaoji Wang
  - Zipei Zhu
  - Jongchan Park
  - Xiaoming Zhai
published: 2026-04-25
venue: AIED 2026
arxiv: 2604.23449
tags:
  - argumentation
  - grouping
  - stem-education
  - multi-agent
  - AIED2026
sources:
  - https://arxiv.org/abs/2604.23449v1
---

# ArguAgent：STEM课堂 productive argumentation 的AI实时分组系统

## 问题

STEM教育中论证生产率取决于参与者和互动方式。高成就学生往往主导话语权，低成就学生可能不参与或顺从。

## 系统设计

ArguAgent使用两组件评估pipeline：
1. **0-4量表评分**：对学生活论证进行结构化评分
2. **语义聚类**：通过语义分析聚类立场

分组优化目标：
- **立场异质性**最大化
- **论证质量差异**约束在±1级内（基于验证的学习进阶）

## 关键数据

- Krippendorff's α = 0.817（vs人类专家共识）
- Prompt工程贡献89%提升（QWK: 0.531→0.686）
- 模型升级贡献11%（QWK: 0.686→0.708）
- 算法达95.4%设计标准满足率（随机分配的3.2倍）

## 结论

AI可实现基于理论的实时分组，促进productive STEM argumentation。

## 相关概念

- [[协作学习仿真]]
- [[教学智能体]]
- [[学习脚手架]]
