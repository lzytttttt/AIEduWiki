# AI辅助代码审查与自我调节学习

> LLM作为代码审查者嵌入GitHub PR工作流，培养学生代码质量意识和自我调节学习能力

## 核心定义

将LLM作为代码审查者直接集成到软件开发工作流（GitHub Pull Requests），通过**人类在环**（Human-in-the-Loop）设计，在不导致认知卸载的前提下为学生提供 scaffolded 学习支持。

## 研究背景

代码审查是软件工程教育的核心实践，但在capstone项目中面临：
- 截止日期紧张
- 同伴反馈质量参差不齐
- 学生经验不足

## 系统设计

```
Student PR → LLM Reviewer → Structured Comments → Student Revision → (loop)
                ↑                                      │
                └─────── Human-in-the-Loop ───────────┘
```

### 关键机制

- **结构化评论**：聚焦审查点，降低认知负荷
- **迭代支持**：32-33%的AI审阅PR引发后续提交
- **over-reliance mitigation**：指导设计减少过度依赖

## 实证发现

### 两届学生对比（2023 vs 2024）

| 指标 | 2023届 | 2024届 |
|------|--------|--------|
| PRs | 581 | 1176 |
| AI失败次数 | 227 | **0** |
| 工具使用率 | 93% | 50% |
| 响应率 | 32% | 33% |

### 定性发现

- 学生使用LLM评论**聚焦审查讨论**
- 指导设计有效**减少过度依赖**
- LLM评论帮助理解代码质量标准

## 四大贡献

1. AI审查者 workflow 设计（scaffold + 防认知卸载）
2. 两届学生跨期对比（真实场景）
3. GitHub数据 + 学生自报告混合方法
4. 负责任AI辅助审查的教学建议

## 相关概念

- [学习脚手架](../concepts/学习脚手架/)
- [AI写作辅助与拥有感](../concepts/AI写作辅助与拥有感/)
- [自我调节学习](自我调节学习/)

## 论文

- [AI-Assisted Code Review (2604.23251)](../raw/papers/ai-code-review-self-regulated-learning-2026.md)
