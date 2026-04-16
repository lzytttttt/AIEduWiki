# Edu-MMBias: VLM Bias in Educational Decision-Making

**arXiv:** 2604.10200v2 | **Published:** 2026-04-11 | **Cats:** cs.AI, cs.CV
**Authors:** Ruijia Li, Mingzi Zhang, Zengyi Yu, Yuang Wei, Bo Jiang
**PDF:** https://arxiv.org/pdf/2604.10200v2

## Abstract

As Vision-Language Models (VLMs) become integral to educational decision-making, ensuring their fairness is paramount. However, current text-centric evaluations neglect the visual modality, leaving an unregulated channel for latent social biases. To bridge this gap, we present Edu-MMBias, a systematic auditing framework grounded in the tri-component model of attitudes from social psychology. This framework diagnoses bias across three hierarchical dimensions: cognitive, affective, and behavioral. Utilizing a specialized generative pipeline that incorporates a self-correct mechanism and human-in-the-loop verification, we synthesize contamination-resistant student profiles to conduct a holistic stress test on state-of-the-art VLMs.

## Key Findings (反直觉)

1. **补偿性阶级偏见:** 模型倾向于偏好低地位叙事的叙事
2. **深层健康和种族偏见** 同时存在
3. **视觉输入是安全后门:** 视觉模态可触发绕过文本对其 alignment 保护的偏见复兴
4. **系统性失调:** 潜在认知与最终决策之间存在系统性不对齐

## 框架：三层次偏见诊断

| 层次 | Description |
|------|-------------|
| 认知层 | 信念、刻板印象 |
| 情感层 | 态度、情感反应 |
| 行为层 | 决策、行为倾向 |

## 为什么重要

VLM 在教育场景做决策时，视觉模态是一个未被充分监管的偏见通道——仅审核文本不够。
