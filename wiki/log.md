# Wiki Log

> Chronological record of all wiki actions. Append-only.
> Format: 
> Actions: ingest, update, query, lint, create, archive, delete
> When this file exceeds 500 entries, rotate: rename to log-YYYY.md, start fresh.

## [2026-04-16] create | Wiki initialized
- Domain: AI in Education — 前沿进展、研究论文、产品应用、政策与伦理
- Structure created with SCHEMA.md, index.md, log.md
- Wiki path: /home/aya/wiki

## [2026-04-16] ingest | 6 arXiv papers on AI+Education
- Raw papers saved: pal-personal-adaptive-learner-2026, llm-pedagogical-agents-scoping-review-2026, multi-agent-personalized-problem-generation-2026, rag-kt-knowledge-tracing-2026, responsible-dkt-neural-symbolic-kt-2026, mcq-difficulty-knowledge-graph-llm-2026
- Concepts created: adaptive-learning-system, knowledge-tracing, pedagogical-agent, automated-mcq-generation
- Total pages: 4 concepts + 6 raw = 10
- Sources: arXiv (2026-04) via category cs.AI with keywords AI+education, personalized+learning, knowledge+tracing

## [2026-04-16] update | 概念页面汉化
- 4个英文概念页面替换为中文版：自适应学习系统、知识追踪、教学智能体、自动选择题生成
- 更新 index.md 为中文结构
- Wiki 服务：http://192.168.0.104:10086

## [2026-04-16] ingest | 第二批 arXiv 论文 + 新分类
- Raw papers: 新增8篇（cs.HC/cs.CY教育相关）：自我学习认识论、CausaDisco、学生AI隐瞒/披露意愿、社交机器人EFL、CausaDisco、Edu-MMBias、AI写作拥有感、协作学习仿真、学生主导AI政策
- Concepts: AI学术诚信与隐瞒行为、教育公平与偏见、协作学习仿真、AI写作辅助与拥有感
- Entities: Yiran-Du研究团队、CausaDisco、Edu-MMBias
- Comparisons: AI教育研究方法对比
- Total pages: 14 raw papers + 8 concepts + 3 entities + 1 comparison = 26 pages
- Wiki 服务：http://192.168.0.104:10086

## [2026-04-16] lint | 修复断链、补充孤立页面、更新标签定义
- 修复 6 条断链（教学智能体综述→教学智能体等）
- 新建 5 个缺失页面：CausaDisco、Edu-MMBias、Yiran-Du研究团队、学生主导AI政策（SCHEMA内）、AI写作辅助与拥有感、协作学习仿真
- 为孤立页面（AI写作辅助与拥有感、协作学习仿真等）补充入站链接
- 补充 SCHEMA.md 标签定义：新增 vlm、fairness、research-method、self-learning、multi-agent、个性化、协作学习等 20+ 标签
- 更新 index.md，新增学生主导AI政策，总页面数更新为 25
