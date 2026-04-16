# Wiki Schema

## Domain
AI in Education — 前沿进展、研究论文、产品应用、政策与伦理。覆盖 AI 教育应用的全栈：从自适应学习系统、知识追踪、作文自动批改，到教育大模型、VR/AR 沉浸式学习，以及教育政策与公平性研究。

## Conventions
- 文件名：小写、连字符、无空格（如 ）
- 每个 wiki 页面以 YAML frontmatter 开头（见下方）
- 使用  建立页面间链接（每页至少 2 个出站链接）
- 更新页面时必须更新  日期
- 新页面必须添加到  对应板块
- 所有操作必须追加到 

## Frontmatter
```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | summary
tags: [from taxonomy below]
sources: [raw/articles/source-name.md]
---
```

## Tag Taxonomy

- **模型/系统**：model, architecture, adaptive-learning, knowledge-tracking, automated-grading, intelligent-tutoring, llm-education, multimodal, vlm, 智能体, 知识追踪, 自动批改, 自适应学习, LLM教育, 模型
- **技术方向**：reinforcement-learning, nlp, multimodal, personalization, recommendation, self-learning, 多智能体, 知识图谱, 自然语言处理, multi-agent
- **应用场景**：language-learning, stem-education, writing-assessment, moocs, k12, higher-ed, corporate-training, 协作学习, 学习仿真, 学习科学, 学习者建模, collaborative-learning, learning-simulation
- **角色/主体**：researcher, company, university, edtech, startup, government, nonprofit
- **主题**：curriculum-design, student-engagement, accessibility, equity, privacy, ethics, policy, 公平性, 偏见, 学术诚信, 个性化, 人机交互, 伦理, 政策, 智能辅导, 模型评估, 隐私, 高等教育
- **评估**：benchmark, dataset, evaluation, metric, fairness
- **Meta**：comparison, research-method, timeline, controversy, prediction, literature-review

> 新增标签前必须先在此处定义，然后再使用。

## Page Thresholds
- **创建页面**：某实体/概念在 2+ 来源中被提及，或在 1 个来源中处于核心地位
- **追加到现有页面**：来源提到的事物已有页面覆盖
- **不创建页面**：仅一次性提及、细微信息、或超出领域范围的内容
- **拆分页面**：页面超过 ~200 行时，拆分为子主题并互相链接
- **归档页面**：内容完全被取代时，移至 ，从 index.md 删除

## Entity Pages
每个 notable 实体一页，包含：
- 概述 / 是什么
- 关键事实与时间线
- 与其他实体的关系（[[wikilinks]]）
- 来源引用

## Concept Pages
每个概念/主题一页，包含：
- 定义 / 解释
- 当前研究状态
- 开放问题或争议
- 相关概念（[[wikilinks]]）

## Comparison Pages
对比分析，包含：
- 对比内容与背景（表格格式优先）
- 多个维度的对比
- 结论或综合判断
- 来源

## Update Policy
新信息与现有内容冲突时：
1. 检查日期 — 通常较新的来源取代较旧来源
2. 真正矛盾时，两种观点均保留并注明日期和来源
3. 在 frontmatter 标记：
4. 在 lint 报告中标记，供用户审阅
