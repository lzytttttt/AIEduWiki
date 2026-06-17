#!/usr/bin/env python3
"""
AI Agent 论文页面生成脚本
将论文元数据转换为 wiki 页面草稿

Usage:
    python scripts/agent_generate.py --input papers.json
    python scripts/agent_generate.py --input papers.json --deep  # 核心论文深度解读
"""

import argparse
import json
import os
import re
from datetime import datetime
from typing import List, Dict, Optional, Tuple

# 项目路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
WIKI_ROOT = os.path.join(PROJECT_ROOT, "wiki")
RAW_PAPERS_DIR = os.path.join(WIKI_ROOT, "raw", "papers")
CONCEPTS_DIR = os.path.join(WIKI_ROOT, "concepts")
ENTITIES_DIR = os.path.join(WIKI_ROOT, "entities")

# 标签映射：关键词 → 标签
KEYWORD_TAG_MAP = {
    "adaptive": "adaptive-learning",
    "自适应": "adaptive-learning",
    "knowledge tracing": "knowledge-tracking",
    "知识追踪": "knowledge-tracking",
    "tutoring": "intelligent-tutoring",
    "智能辅导": "intelligent-tutoring",
    "llm": "llm-education",
    "大语言模型": "llm-education",
    "language model": "llm-education",
    "multimodal": "multimodal",
    "多模态": "multimodal",
    "agent": "智能体",
    "智能体": "智能体",
    "multi-agent": "multi-agent",
    "多智能体": "multi-agent",
    "personalization": "personalization",
    "个性化": "个性化",
    "nlp": "nlp",
    "自然语言处理": "nlp",
    "collaborative": "collaborative-learning",
    "协作": "collaborative-learning",
    "fairness": "fairness",
    "公平": "fairness",
    "ethics": "ethics",
    "伦理": "ethics",
    "assessment": "automated-grading",
    "评估": "automated-grading",
    "writing": "writing-assessment",
    "写作": "writing-assessment",
    "robot": "人机交互",
    "机器人": "人机交互",
    "knowledge graph": "知识图谱",
    "知识图谱": "知识图谱",
    "reinforcement": "reinforcement-learning",
    "强化学习": "reinforcement-learning",
    "stem": "stem-education",
    "coding": "coding-education",
    "编程": "coding-education",
}

# 现有概念页面缓存
_existing_concepts = set()
_existing_entities = set()


def load_existing_pages():
    """加载现有概念和实体页面标题"""
    global _existing_concepts, _existing_entities

    for section, target_set in [(CONCEPTS_DIR, _existing_concepts), (ENTITIES_DIR, _existing_entities)]:
        if not os.path.isdir(section):
            continue
        for fname in os.listdir(section):
            if fname.endswith(".md"):
                fpath = os.path.join(section, fname)
                with open(fpath, encoding="utf-8") as f:
                    content = f.read()
                m = re.search(r'^title:\s*(.+?)\s*$', content, re.M)
                if m:
                    target_set.add(m.group(1).strip())


def detect_tags(paper: Dict) -> List[str]:
    """根据论文内容自动检测标签"""
    tags = set()
    text = f"{paper.get('title', '')} {paper.get('abstract', '')}".lower()

    for keyword, tag in KEYWORD_TAG_MAP.items():
        if keyword.lower() in text:
            tags.add(tag)

    # 添加默认标签
    tags.add("research")
    tags.add("2026")

    return sorted(list(tags))


def detect_related_pages(paper: Dict) -> List[Tuple[str, str]]:
    """检测与现有概念/实体的关联，返回 (页面标题, 关系类型) 列表"""
    related = []
    text = f"{paper.get('title', '')} {paper.get('abstract', '')}".lower()

    # 检查概念页面
    for concept in _existing_concepts:
        concept_lower = concept.lower()
        # 简单的关键词匹配
        keywords = concept_lower.replace("与", " ").replace("/", " ").split()
        if any(kw in text for kw in keywords if len(kw) > 2):
            related.append((concept, "concept"))

    # 检查实体页面
    for entity in _existing_entities:
        entity_lower = entity.lower()
        if entity_lower in text:
            related.append((entity, "entity"))

    return related


def classify_paper(paper: Dict) -> str:
    """论文分级：core（核心）或 normal（普通）"""
    # 分级逻辑：
    # 1. 如果有 DOI，可能是正式发表的论文
    # 2. 如果分类包含多个领域，可能是跨领域重要工作
    # 3. 如果标题包含 survey/review/framework，可能是综述/框架
    # 4. 默认为 normal

    title = paper.get("title", "").lower()
    categories = paper.get("categories", [])
    has_doi = bool(paper.get("doi"))

    # 综述/框架类论文通常更重要
    if any(kw in title for kw in ["survey", "review", "framework", "benchmark", "综述"]):
        return "core"

    # 跨领域论文可能更重要
    if len(categories) >= 3:
        return "core"

    # 有 DOI 的正式发表论文
    if has_doi:
        return "core"

    return "normal"


def generate_frontmatter(paper: Dict, classification: str) -> str:
    """生成 YAML frontmatter"""
    title = paper.get("title", "Untitled")
    today = datetime.now().strftime("%Y-%m-%d")
    tags = detect_tags(paper)
    arxiv_id = paper.get("arxiv_id", "")

    frontmatter = f"""---
title: {title}
created: {today}
updated: {today}
type: summary
tags: [{', '.join(tags)}]
sources: [raw/papers/{arxiv_id}.md]
classification: {classification}
---"""
    return frontmatter


def generate_deep_content(paper: Dict, related_pages: List[Tuple[str, str]]) -> str:
    """生成核心论文深度解读内容"""
    title = paper.get("title", "Untitled")
    abstract = paper.get("abstract", "暂无摘要")
    authors = paper.get("authors", [])
    arxiv_id = paper.get("arxiv_id", "")
    arxiv_url = paper.get("arxiv_url", "")
    published = paper.get("published", "")[:10]

    # 作者列表
    authors_str = ", ".join(authors[:5])
    if len(authors) > 5:
        authors_str += " et al."

    # 关联页面 wikilinks
    related_links = ""
    if related_pages:
        links = []
        for page_title, page_type in related_pages:
            links.append(f"[[{page_title}]]")
        related_links = "\n## 关联主题\n\n" + "\n".join(links)

    content = f"""# {title}

> **来源**: [arXiv:{arxiv_id}]({arxiv_url})
> **作者**: {authors_str}
> **日期**: {published}
> **分级**: 核心论文（深度解读）

## 核心贡献

<!-- TODO: 从论文中提取核心贡献 -->
- 贡献 1
- 贡献 2
- 贡献 3

## 方法论

### 研究设计

<!-- TODO: 描述研究设计 -->

### 技术方案

<!-- TODO: 描述技术方案 -->

### 实验设计

<!-- TODO: 描述实验设计 -->

## 结果分析

### 主要发现

<!-- TODO: 列出主要发现 -->

### 数据与指标

<!-- TODO: 关键数据和指标 -->

## 局限性

- 局限性 1
- 局限性 2

## 未来方向

- 方向 1
- 方向 2
{related_links}

---

*页面创建于 {datetime.now().strftime("%Y-%m-%d")}，基于 arXiv:{arxiv_id}*
"""
    return content


def generate_normal_content(paper: Dict, related_pages: List[Tuple[str, str]]) -> str:
    """生成普通论文简要摘要内容"""
    title = paper.get("title", "Untitled")
    abstract = paper.get("abstract", "暂无摘要")
    authors = paper.get("authors", [])
    arxiv_id = paper.get("arxiv_id", "")
    arxiv_url = paper.get("arxiv_url", "")
    published = paper.get("published", "")[:10]

    # 作者列表
    authors_str = ", ".join(authors[:3])
    if len(authors) > 3:
        authors_str += " et al."

    # 关联页面 wikilinks
    related_links = ""
    if related_pages:
        links = []
        for page_title, page_type in related_pages:
            links.append(f"[[{page_title}]]")
        related_links = "\n## 关联主题\n\n" + "\n".join(links)

    content = f"""# {title}

> **来源**: [arXiv:{arxiv_id}]({arxiv_url})
> **作者**: {authors_str}
> **日期**: {published}
> **分级**: 普通论文（简要摘要）

## 摘要

{abstract}

## 核心贡献

<!-- TODO: 从论文中提取核心贡献 -->
- 贡献 1
- 贡献 2

## 局限性

- 局限性 1
{related_links}

---

*页面创建于 {datetime.now().strftime("%Y-%m-%d")}，基于 arXiv:{arxiv_id}*
"""
    return content


def generate_wiki_page(paper: Dict) -> Tuple[str, str, str]:
    """
    生成 wiki 页面

    Returns:
        (文件名, 文件内容, 分类)
    """
    # 加载现有页面
    load_existing_pages()

    # 论文分级
    classification = classify_paper(paper)

    # 检测关联页面
    related_pages = detect_related_pages(paper)

    # 生成 frontmatter
    frontmatter = generate_frontmatter(paper, classification)

    # 根据分级生成内容
    if classification == "core":
        content = generate_deep_content(paper, related_pages)
    else:
        content = generate_normal_content(paper, related_pages)

    # 组合完整页面
    full_content = f"{frontmatter}\n\n{content}"

    # 文件名：arxiv_id.md
    arxiv_id = paper.get("arxiv_id", "unknown")
    filename = f"{arxiv_id}.md"

    return filename, full_content, classification


def save_wiki_page(filename: str, content: str) -> str:
    """保存 wiki 页面到 raw/papers/ 目录"""
    os.makedirs(RAW_PAPERS_DIR, exist_ok=True)
    filepath = os.path.join(RAW_PAPERS_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return filepath


def main():
    parser = argparse.ArgumentParser(description="从论文元数据生成 wiki 页面")
    parser.add_argument(
        "--input", "-i",
        type=str,
        required=True,
        help="输入 JSON 文件路径（agent_fetch.py 的输出）",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="仅预览，不实际写入文件",
    )

    args = parser.parse_args()

    # 读取论文数据
    with open(args.input, encoding="utf-8") as f:
        data = json.load(f)

    papers = data.get("papers", [])
    print(f"读取 {len(papers)} 篇论文")

    # 统计
    core_count = 0
    normal_count = 0

    # 生成页面
    for paper in papers:
        filename, content, classification = generate_wiki_page(paper)

        if classification == "core":
            core_count += 1
        else:
            normal_count += 1

        if args.dry_run:
            print(f"\n[预览] {filename} ({classification})")
            print(content[:500] + "...")
        else:
            filepath = save_wiki_page(filename, content)
            print(f"  已生成: {filepath} ({classification})")

    print(f"\n统计: 核心论文 {core_count} 篇, 普通论文 {normal_count} 篇")


if __name__ == "__main__":
    main()
