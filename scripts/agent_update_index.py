#!/usr/bin/env python3
"""
AI Agent 索引和日志更新脚本
自动更新 index.md、mkdocs.yml、log.md

Usage:
    python scripts/agent_update_index.py --papers papers.json
    python scripts/agent_update_index.py --scan  # 扫描所有页面更新计数
"""

import argparse
import json
import os
import re
from datetime import datetime
from typing import List, Dict

# 项目路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
WIKI_ROOT = os.path.join(PROJECT_ROOT, "wiki")
INDEX_PATH = os.path.join(WIKI_ROOT, "index.md")
LOG_PATH = os.path.join(WIKI_ROOT, "log.md")
MKDOCS_PATH = os.path.join(PROJECT_ROOT, "mkdocs.yml")


def count_wiki_pages() -> Dict[str, int]:
    """统计 wiki 各板块页面数"""
    counts = {
        "concepts": 0,
        "entities": 0,
        "comparisons": 0,
        "timelines": 0,
        "tutorials": 0,
        "raw_papers": 0,
    }

    for section in counts.keys():
        if section == "raw_papers":
            dir_path = os.path.join(WIKI_ROOT, "raw", "papers")
        else:
            dir_path = os.path.join(WIKI_ROOT, section)

        if not os.path.isdir(dir_path):
            continue

        for fname in os.listdir(dir_path):
            if fname.endswith(".md"):
                counts[section] += 1

    return counts


def update_index_papers(papers: List[Dict]) -> None:
    """将新论文添加到 index.md 的原始资料列表"""
    if not os.path.exists(INDEX_PATH):
        print(f"  警告: index.md 不存在: {INDEX_PATH}")
        return

    with open(INDEX_PATH, encoding="utf-8") as f:
        content = f.read()

    # 找到最后一个论文批次
    # 格式: **第X批（YYYY-MM-DD）**
    batch_pattern = r'\*\*第(\d+)批（(\d{4}-\d{2}-\d{2})）\*\*'
    batches = list(re.finditer(batch_pattern, content))

    if batches:
        last_batch = batches[-1]
        batch_num = int(last_batch.group(1)) + 1
    else:
        batch_num = 1

    today = datetime.now().strftime("%Y-%m-%d")

    # 构建新批次内容
    new_batch_lines = [f"\n**第{batch_num}批（{today}）**"]
    for paper in papers:
        arxiv_id = paper.get("arxiv_id", "unknown")
        new_batch_lines.append(f"- `raw/papers/{arxiv_id}.md`")

    new_batch = "\n".join(new_batch_lines) + "\n"

    # 在最后一个批次后插入
    if batches:
        insert_pos = last_batch.end()
        # 找到该批次结束位置（下一个 --- 或文件末尾）
        next_section = content.find("\n---", insert_pos)
        if next_section == -1:
            content = content + new_batch
        else:
            content = content[:next_section] + new_batch + content[next_section:]
    else:
        # 没有批次，在 ## 原始资料 后添加
        raw_section = content.find("## 原始资料")
        if raw_section != -1:
            insert_pos = content.find("\n", raw_section) + 1
            content = content[:insert_pos] + new_batch + content[insert_pos:]
        else:
            content += f"\n\n## 原始资料\n{new_batch}"

    # 更新总页面数
    counts = count_wiki_pages()
    total = sum(counts.values())
    content = re.sub(
        r'总页面数:\s*\d+',
        f'总页面数: {total}',
        content,
    )

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  已更新 index.md: 添加 {len(papers)} 篇论文")


def update_mkdocs_nav(new_pages: List[Dict[str, str]]) -> None:
    """更新 mkdocs.yml 的 nav 部分"""
    if not os.path.exists(MKDOCS_PATH):
        print(f"  警告: mkdocs.yml 不存在: {MKDOCS_PATH}")
        return

    with open(MKDOCS_PATH, encoding="utf-8") as f:
        content = f.read()

    # 这里简化处理：只添加 raw papers 到 nav
    # 完整的 nav 更新需要更复杂的 YAML 解析
    # 实际使用中，prebuild.py 会处理 wikilink

    print(f"  mkdocs.yml nav 需要手动更新或使用 prebuild.py 处理")


def append_log(action: str, details: str) -> None:
    """追加操作记录到 log.md"""
    today = datetime.now().strftime("%Y-%m-%d")

    log_entry = f"\n## [{today}] {action} | {details}\n"

    if os.path.exists(LOG_PATH):
        with open(LOG_PATH, encoding="utf-8") as f:
            content = f.read()
        content += log_entry
    else:
        content = f"# Wiki Log\n\n> Chronological record of all wiki actions. Append-only.\n{log_entry}"

    with open(LOG_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  已追加 log.md: {action}")


def main():
    parser = argparse.ArgumentParser(description="更新 wiki 索引和日志")
    parser.add_argument(
        "--papers", "-p",
        type=str,
        default=None,
        help="论文 JSON 文件路径（agent_fetch.py 的输出）",
    )
    parser.add_argument(
        "--scan",
        action="store_true",
        help="扫描所有页面更新计数",
    )

    args = parser.parse_args()

    if args.scan:
        counts = count_wiki_pages()
        total = sum(counts.values())
        print(f"页面统计:")
        for section, count in counts.items():
            print(f"  {section}: {count}")
        print(f"  总计: {total}")
        return

    if args.papers:
        # 读取论文数据
        with open(args.papers, encoding="utf-8") as f:
            data = json.load(f)

        papers = data.get("papers", [])
        print(f"读取 {len(papers)} 篇论文")

        # 更新 index.md
        update_index_papers(papers)

        # 追加 log.md
        paper_ids = [p.get("arxiv_id", "unknown") for p in papers]
        append_log(
            "ingest",
            f"新增 {len(papers)} 篇论文: {', '.join(paper_ids[:5])}{'...' if len(paper_ids) > 5 else ''}"
        )

        print("\n更新完成!")


if __name__ == "__main__":
    main()
