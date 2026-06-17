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

## [2026-04-16] update | 论文frontmatter补全 + 3个新概念
- 14篇raw papers全部添加YAML frontmatter（type: summary, tags, sources）
- 新增概念页面：社会机器人与CASA范式、个性化问题生成、学习脚手架
- 概念页之间互链完善：教学智能体↔个性化问题生成/学习脚手架、知识追踪↔学习脚手架/个性化问题生成、自适应学习系统↔社会机器人/学习脚手架
- index.md更新：总页面数26→29
- Wiki 服务：http://192.168.0.104:10086

## [2026-04-16] update | 深度检索补全
- 新增2个概念页：可解释教学编排、诊断推理与LLM智能体
- 知识追踪：Responsible-DKT时序可靠性发现（重复错误对预测影响最强）
- 教学智能体：AIED 2026系统综述新趋势（多智能体/可解释编排/虚拟学习者仿真）
- 协作学习仿真：仿真测试框架新进展（ICAP层级评估/话语多样性指标）
- AI学术诚信：EAP学生认知-情感-意志三维框架（arXiv:2604.10991）
- 学生主导AI政策：CHI 2026"叫学生进来"模式扩展（双重标准深层权力问题）
- 自适应学习系统：GraphMASAL三智能体架构（Diagnostician+Planner+Tutor）

## [2026-04-28] update | 第二批论文灌入 + 8个新概念
- Raw papers：新增11篇（arXiv 2026-04-22~27），涵盖：
  - 个性化工作例生成（KC-guided，L@S 2026）
  - GAMED.AI 教育游戏自动生成（分层多智能体）
  - Talking Slide Avatars 教学化身（异步教学存在感）
  - Transformer英语阅读理解可解释性（ICBDAEE 2026）
  - ArguAgent STEM论证分组（AIED 2026 Full Paper）
  - AI辅助代码审查与自我调节学习（两届学生验证）
  - 英语口语分级生成系统（K-12非母语英语，DDPO）
  - 可解释学生行为诊断对话系统（AIED 2026）
  - 大学生AI披露意愿CAC框架（Yiran-Du团队）
  - 教育合成数据基准：Resampling vs VAE（AAAI AI4EDU 2026）
  - ActuBench 精算推理评估多智能体
- Concepts：新增8个（个性化工作例生成、教育游戏自动生成、教学化身与教师存在感、AI辅助代码审查与自我调节学习、可解释学生行为诊断对话系统、英语口语分级生成系统、STEM论证分组系统、教育合成数据基准）
- index.md：概念从14增至22个
- mkdocs.yml nav同步更新
- 总页面数：26 → 45

## [2026-06-17] create | Phase 1 扩展：AI Agent 工作流 + 时间线 + 教程
- 新增脚本：agent_fetch.py（arXiv 论文抓取）、agent_generate.py（页面生成）、agent_update_index.py（索引更新）
- 新增 AGENTS.md：定义 Claude Code 中的论文抓取触发词和工作流
- 时间线：新增 9 个页面（2020-2026 年度总览 + 知识追踪发展史 + 自适应学习系统演进）
- 教程：新增 2 个页面（知识追踪入门、NLP in Education 入门）
- mkdocs.yml nav 同步更新（新增时间线、教程板块）
- index.md 更新：总页面数 45 → 63
- 总页面数：63（25 papers + 22 concepts + 4 entities + 1 comparison + 9 timelines + 2 tutorials）

## [2026-06-17] create | Phase 2 扩展：实体页 + 知识图谱
- 教育科技公司实体：新增 5 个（Khan Academy、Duolingo、Squirrel AI、好未来、Coursera）
- AI 教育产品实体：新增 3 个（Khanmigo、Duolingo Max、Squirrel AI 产品）
- 开源工具实体：新增 2 个（OpenAI Gym Education、Edmentum）
- 政府/机构实体：新增 2 个（UNESCO AI 教育、中国教育部 AI 政策）
- 会议/期刊实体：新增 3 个（AIED、CHI、LAK）
- 研究者实体：新增 5 个（Chris Piech、Kenneth Koedinger、Neil Heffernan、Emma Brunskill、Xiangen Hu）
- 实验室/团队实体：新增 3 个（Stanford HAI、CMU Learning Science、ASSISTments 团队）
- 新增 build_graph.py 脚本：自动提取 wikilink 生成知识图谱数据
- 新增 graph.md 交互式图谱页面（vis.js）
- mkdocs.yml nav 同步更新（新增实体、图谱板块）
- index.md 更新：总页面数 63 → 86
- 总页面数：86（25 papers + 22 concepts + 27 entities + 1 comparison + 9 timelines + 2 tutorials + 1 graph）

## [2026-06-17] create | Phase 3 扩展：对比页 + 争议页 + 质量审核
- 对比页：新增 3 个（AI教育产品对比、知识追踪方法对比、自适应学习框架对比）
- 争议页：新增 3 个（AI替代教师争议、AI作弊争议、AI教育公平性争议）
- 新增 lint.py 质量审核脚本：检测断链、孤立页面、标签一致性、frontmatter 完整性
- 新增 check_updates.py 更新检查脚本：检查已有页面是否有新论文支持
- mkdocs.yml nav 同步更新（新增对比、争议板块）
- index.md 更新：总页面数 86 → 92
- 总页面数：92（25 papers + 22 concepts + 27 entities + 4 comparisons + 3 controversies + 9 timelines + 2 tutorials + 1 graph）

## [2026-06-17] create | 前端重设计：MkDocs → Next.js 全面迁移
- 技术栈：Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- 内容迁移：67 个 MDX 页面从 wiki/ 迁移到 content/{theory,technology,products,insights}/
- 信息架构重构：按知识领域分为 4 大类（学习理论/技术方法/产品与公司/争议与趋势）
- 设计系统：11 个 shadcn/ui 组件 + 自定义全局样式 + 中英文字体（Inter + Noto Sans SC）
- 布局组件：Navigation、Sidebar、Breadcrumb、TableOfContents、PageLayout、Footer
- 内容组件：WikiLink、Admonition、ConceptCard、CodeBlock、DataTable、Comments
- 搜索：Fuse.js 模糊搜索 + ⌘K 命令面板 + 中文支持
- 知识图谱：react-force-graph 替代 vis-network，59 节点 27 条边
- 用户系统：GitHub OAuth (NextAuth.js) + 收藏功能 + Giscus 评论
- 首页 Dashboard：统计卡片 + 分类入口 + 最新更新 + 迷你图谱
- MDX 管道：remark 插件（wikilink 解析 + admonition 转换）替代 prebuild.py
- 构建工具：build-graph.mjs + build-search-index.mjs 替代 Python 脚本
- 构建结果：78 个静态页面全部生成成功
- 部署：Vercel（移除 output:export，使用服务端渲染支持 NextAuth API）
- 旧 wiki/ 目录保留为存档，未修改
