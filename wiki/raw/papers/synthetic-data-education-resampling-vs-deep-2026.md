---
type: summary
title: "Synthetic Data in Education: Empirical Insights from Traditional Resampling and Deep Generative Models"
authors:
  - Tapiwa Amion Chinodakufa
  - Ashfaq Ali Shafin
  - Khandaker Mamun Ahmed
published: 2026-04-22
venue: AAAI AI4EDU 2026
arxiv: 2604.21031
tags:
  - synthetic-data
  - privacy
  - learning-analytics
  - VAE
  - SMOTE
  - education-data
sources:
  - https://arxiv.org/abs/2604.21031v1
---

# 教育中的合成数据：传统重采样与深度生成模型的实证比较

## 研究动机

教育科技中数据稀缺和隐私问题日益突出， practitioners缺乏选择指导。

## 评估维度

1. **分布保真度**：Kolmogorov-Smirnov距离，Jensen-Shannon散度
2. **机器学习效用**：TSTR（Train-on-Synthetic-Test-on-Real）分数
3. **隐私保护**：DCR（Distance to Closest Record）

## 方法对比

| 方法 | TSTR（效用） | DCR（隐私） |
|------|-------------|-------------|
| SMOTE | 0.997 | ~0.00 |
| Bootstrap | 高 | ~0.00 |
| Random Oversampling | 高 | ~0.00 |
| Autoencoder | 较低 | 较高 |
| VAE | **0.833** | **~1.00** |
| Copula-GAN | 较低 | 较高 |

## 核心发现

- **根本性trade-off**：resampling方法达到近乎完美的效用但完全失去隐私保护
- **VAE是最优折衷**：83.3%预测性能 + 完全隐私保护
- Resampling适合内部开发（隐私可控）
- VAE适合外部数据共享（隐私至上）

## 结论

首个系统性benchmark，为学习分析中的合成数据生成提供实践决策框架。

## 相关概念

- [[教育公平与偏见]]
- [[自适应学习系统]]
