---
type: summary
title: "Personalized Worked Example Generation from Student Code Submissions using Pattern-based Knowledge Components"
authors:
  - Griffin Pitts
  - Muntasir Hoq
  - Peter Brusilovsky
  - Narges Norouzi
  - Arto Hellas
  - Juho Leinonen
  - Bita Akram
published: 2026-04-27
venue: ACM L@S 2026
arxiv: 2604.24758
tags:
  - worked-examples
  - knowledge-components
  - code-education
  - personalization
  - AST-analysis
  - adaptive-learning
sources:
  - https://arxiv.org/abs/2604.24758v1
---

# 个性化工作例生成：基于模式化知识组件的学生代码提交

## 核心贡献

提出**KC-guided教育内容生成**方法，从学生代码中提取结构化知识组件（KC）来条件化生成模型，生成针对学生具体逻辑错误的工作例。

## 关键发现

- **KC条件生成**优于基线：专家评估表明KC条件化生成内容与学生底层逻辑错误更相关
- **AST分析**提取KC：从学生代码的抽象语法树中识别 recurring structural patterns
- **知识追踪到内容生成**：传统自适应系统依赖固定题库，本文将学生代码中的错误模式直接映射到个性化学习内容

## 技术方法

1. 输入：问题描述 + 学生代码提交
2. AST分析 → 提取结构化KC patterns
3. KC条件化生成模型 → 输出个性化工作例
4. 专家评估对比基线和KC条件输出

## 结论

KC-based steering可支持大规模个性化学习，pattern-based KC提取比手工authoring更具可扩展性。

## 相关概念

- [[自适应学习系统]]
- [[自动选择题生成]]
- [[个性化问题生成]]
