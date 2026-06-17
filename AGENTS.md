# AIEduWiki Agent 行为规范

> 定义 Claude Code 中的 Agent 工作流和触发词

## 项目概述

AIEduWiki 是一个 AI+教育领域的知识库 Wiki，基于 Next.js 14+ (App Router) 构建，部署在 Vercel。

## Agent 工作流

### 论文抓取工作流

**触发词**: "抓取论文"、"fetch papers"、"更新论文"、"搜索论文"

**完整流程**:

```
1. 用户触发: "帮我抓取最近一周的 AI 教育论文"
2. Agent 执行:
   a. 调用 scripts/agent_fetch.py 搜索 arXiv
   b. 保存论文元数据到 .omc/papers.json
   c. 调用 scripts/agent_generate.py 生成 wiki 页面草稿（输出到 content/ 目录）
   d. 运行 npm run build 重新生成图谱和搜索索引
3. 输出报告:
   - 新增论文数量
   - 核心论文 vs 普通论文分类
   - 生成的文件列表
4. 人工审核后 git commit
```

**命令示例**:

```bash
# 搜索最近 7 天的论文
python scripts/agent_fetch.py --days 7 --output .omc/papers.json

# 生成 wiki 页面（输出到 content/ 目录）
python scripts/agent_generate.py --input .omc/papers.json

# 重新生成图谱和搜索索引
npm run build
```

### 论文分级机制

| 级别 | 标准 | 处理方式 |
|------|------|----------|
| **核心论文 (core)** | 综述/框架、跨领域、有 DOI | 深度解读：方法论细节、实验设计、结果分析、局限性 |
| **普通论文 (normal)** | 增量改进、单一应用 | 简要摘要：核心贡献、局限性 |

### 页面结构规范

所有页面遵循 `content/SCHEMA.md` 规范：

```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | summary | timeline | tutorial | controversy
tags: [from SCHEMA.md tag taxonomy]
sources: [raw/papers/source-name.md]
---
```

### Wikilink 规范

- 使用 `[[页面标题]]` 建立页面间链接
- 每个页面至少 2 个 wikilink（入站或出站）
- 新页面必须与现有概念/实体建立关联
- Wikilink 在构建时由 remark 插件自动解析为页面链接

## 目录结构

```
AIEduWiki/
├── content/                    # MDX 内容（新）
│   ├── theory/                 # 学习理论（概念页面）
│   ├── technology/             # 技术方法（教程 + 技术概念）
│   ├── products/               # 产品与公司（实体页面）
│   ├── insights/               # 争议与趋势（对比 + 争议 + 时间线）
│   ├── SCHEMA.md               # 规范文档
│   └── index.json              # 内容索引
├── src/
│   ├── app/                    # Next.js App Router 页面
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   ├── layout/             # 布局组件（导航、侧边栏、TOC）
│   │   ├── content/            # 内容组件（WikiLink、Admonition、DataTable）
│   │   ├── search/             # 搜索组件
│   │   ├── graph/              # 知识图谱组件
│   │   ├── dashboard/          # 首页 Dashboard 组件
│   │   └── user/               # 用户系统组件
│   ├── lib/                    # 工具函数
│   │   ├── content.ts          # 内容读取
│   │   ├── mdx.ts              # MDX 编译管道
│   │   ├── remark-wikilinks.ts # Wikilink remark 插件
│   │   ├── remark-admonitions.ts # Admonition remark 插件
│   │   ├── auth.ts             # NextAuth 配置
│   │   ├── search.ts           # Fuse.js 搜索
│   │   └── domains.ts          # 领域定义
│   ├── styles/                 # 全局样式
│   └── types/                  # TypeScript 类型
├── scripts/                    # 构建和 Agent 脚本
│   ├── build-graph.mjs         # 图谱数据生成（Node.js）
│   ├── build-search-index.mjs  # 搜索索引生成
│   ├── migrate-to-mdx.mjs      # 内容迁移脚本
│   ├── agent_fetch.py          # 论文抓取
│   ├── agent_generate.py       # 页面生成
│   └── agent_update_index.py   # 索引更新
├── public/                     # 静态资源
│   ├── graph.json              # 图谱数据
│   └── search-index.json       # 搜索索引
├── wiki/                       # 旧 MkDocs 内容（存档）
├── package.json                # Node.js 依赖
├── next.config.mjs             # Next.js 配置
├── tailwind.config.ts          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
└── AGENTS.md                   # 本文件
```

## 质量检查清单

每次更新后检查：

- [ ] 新页面有完整的 frontmatter
- [ ] 新页面有至少 2 个 wikilink
- [ ] 运行 `npm run build` 确认构建成功
- [ ] content/index.json 与实际文件一致
- [ ] wiki/log.md 已追加操作记录

## 常用命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建（包含图谱和搜索索引生成）
npm run build

# 生成图谱数据
node scripts/build-graph.mjs

# 生成搜索索引
node scripts/build-search-index.mjs

# 内容迁移（从 wiki/ 到 content/）
node scripts/migrate-to-mdx.mjs

# TypeScript 类型检查
npx tsc --noEmit
```

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **内容**: MDX (Markdown + JSX)
- **搜索**: Fuse.js (客户端模糊搜索)
- **知识图谱**: react-force-graph
- **用户认证**: NextAuth.js (GitHub OAuth)
- **评论**: Giscus (GitHub Discussions)
- **部署**: Vercel
