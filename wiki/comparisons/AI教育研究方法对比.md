---
title: AI教育研究方法对比
created: 2026-04-16
updated: 2026-04-16
type: comparison
tags: [comparison, research-method]
sources: [raw/papers/student-ai-concealment-intention-2026.md, raw/papers/llm-multi-agent-collaborative-learning-scaffolding-2026.md, raw/papers/self-learning-epistemology-causadisco-2026.md, raw/papers/eap-students-ai-disclosure-intention-2026.md, raw/papers/edu-mmbias-vlm-fairness-2026.md]
---

# AI教育研究方法对比

## 学生AI披露/隐瞒行为研究方法

| 论文 | 方法 | 样本量 | 核心发现 |
|------|------|-------|---------|
| [AI学术诚信与隐瞒行为](../concepts/AI学术诚信与隐瞒行为/)（隐瞒研究） | SEM + fsQCA 混合方法 | 1346 学生 | 两条路径：促进隐瞒 vs 抑制隐瞒 |
| [AI学术诚信与隐瞒行为](../concepts/AI学术诚信与隐瞒行为/)（EAP 披露研究） | SEM + 定性访谈 | 324 EAP 学生 | 心理安全感促进披露，恐惧感抑制披露 |

## 协作学习仿真方法对比

| 方法 | 优势 | 局限 | 适用场景 |
|------|------|------|---------|
| **LLM 多智能体仿真** | 成本低、速度快、可迭代 | 真实性受 LLM 能力限制 | 脚手架策略快速验证 |
| 传统教室观察 | 真实性高 | 耗时、样本量受限 | 最终验证 |

## 自我学习系统对比

| 系统 | 理论基础 | 用户数 | 核心创新 |
|------|---------|-------|---------|
| [CausaDisco](../entities/CausaDisco/) | 亚里士多德四因说 | N=36 | 哲学框架引导追问，降低认知负荷 |
| [自适应学习系统](../concepts/自适应学习系统/)（PAL） | 多模态分析 | — | 视频课程实时自适应 |

## 教育AI公平性研究方法

| 方法 | 模态覆盖 | 发现类型 |
|------|---------|---------|
| 传统文本审计 | 纯文本 | 文本偏见 |
| [Edu-MMBias](../entities/Edu-MMBias/)（三层审计） | 文本+视觉 | 文本+视觉+跨模态偏见 |

## 方法论趋势

1. **混合方法（定量+定性）** 越来越普遍——SEM/fsQCA + 访谈
2. **多智能体仿真** 降低教育研究成本
3. **多模态审计** 成为 VLM 公平性研究的必要手段

## 相关概念

- [AI学术诚信与隐瞒行为](../concepts/AI学术诚信与隐瞒行为/) — 学生 AI 披露/隐瞒心理机制
- [协作学习仿真](../concepts/协作学习仿真/) — LLM 多智能体协作学习仿真
- [CausaDisco](../entities/CausaDisco/) — 哲学框架引导的自我学习系统
- [教育公平与偏见](../concepts/教育公平与偏见/) — VLM 教育场景多模态偏见
