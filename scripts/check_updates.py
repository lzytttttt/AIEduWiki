#!/usr/bin/env python3
"""
AIEduWiki 更新检查脚本
检查已有页面是否有新论文支持，生成更新建议报告

Usage:
    python scripts/check_updates.py
"""

import argparse
import os
import re
from datetime import datetime, timedelta
from typing import List, Dict

# 项目路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
WIKI_ROOT = os.path.join(PROJECT_ROOT, "wiki")


def scan_wiki_pages() -> List[Dict]:
    """扫描所有 wiki 页面"""
    pages = []

    for root, dirs, files in os.walk(WIKI_ROOT):
        # 跳过特定目录
        dirs[:] = [d for d in dirs if d not in ('node_modules', '_archive', 'raw', '.git', 'site', 'assets')]

        for fname in files:
            if not fname.endswith('.md'):
                continue

            fpath = os.path.join(root, fname)
            rel_path = os.path.relpath(fpath, WIKI_ROOT)

            with open(fpath, encoding='utf-8') as f:
                content = f.read()

            # 提取 frontmatter
            frontmatter = extract_frontmatter(content)

            # 提取 wikilinks
            wikilinks = extract_wikilinks(content)

            # 获取标题
            title = frontmatter.get('title', fname.replace('.md', ''))

            # 确定页面类型
            page_type = frontmatter.get('type', 'unknown')
            if 'concepts/' in rel_path:
                page_type = 'concept'
            elif 'entities/' in rel_path:
                page_type = 'entity'
            elif 'raw/papers/' in rel_path:
                page_type = 'paper'
            elif 'timelines/' in rel_path:
                page_type = 'timeline'
            elif 'tutorials/' in rel_path:
                page_type = 'tutorial'
            elif 'controversies/' in rel_path:
                page_type = 'controversy'

            pages.append({
                'path': rel_path,
                'title': title,
                'type': page_type,
                'frontmatter': frontmatter,
                'wikilinks': wikilinks,
            })

    return pages


def extract_frontmatter(content: str) -> Dict:
    """提取 YAML frontmatter"""
    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}

    frontmatter = {}
    for line in match.group(1).split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            # 解析列表
            if value.startswith('[') and value.endswith(']'):
                value = [v.strip() for v in value[1:-1].split(',') if v.strip()]

            frontmatter[key] = value

    return frontmatter


def extract_wikilinks(content: str) -> List[str]:
    """提取 wikilinks"""
    # 移除 frontmatter
    content = re.sub(r'^---\s*\n.*?\n---\s*\n', '', content, flags=re.DOTALL)

    # 移除代码块
    content = re.sub(r'```[\s\S]*?```', '', content)
    content = re.sub(r'`[^`]*`', '', content)

    # 提取 wikilinks
    wikilinks = []
    for match in re.finditer(r'\[\[([^\]]+?)\]\]', content):
        link = match.group(1).strip()
        # 处理别名 [[title|alias]]
        if '|' in link:
            link = link.split('|')[0].strip()
        wikilinks.append(link)

    return wikilinks


def check_update_suggestions(pages: List[Dict]) -> List[Dict]:
    """检查更新建议"""
    suggestions = []

    # 获取当前日期
    now = datetime.now()
    thirty_days_ago = now - timedelta(days=30)

    for page in pages:
        # 跳过 raw/papers/ 目录
        if page['path'].startswith('raw/papers/'):
            continue

        # 跳过 index.md 和 SCHEMA.md
        if page['path'] in ('index.md', 'SCHEMA.md'):
            continue

        frontmatter = page['frontmatter']
        if not frontmatter:
            continue

        # 检查最后更新时间
        updated = frontmatter.get('updated', '')
        if updated:
            try:
                updated_date = datetime.strptime(updated, '%Y-%m-%d')
                if updated_date < thirty_days_ago:
                    suggestions.append({
                        'type': 'outdated',
                        'file': page['path'],
                        'title': page['title'],
                        'page_type': page['type'],
                        'message': f'最后更新 {updated}，建议检查是否有新内容',
                        'severity': 'warning',
                    })
            except ValueError:
                pass

        # 检查概念页面是否有新论文支持
        if page['type'] == 'concept':
            # 检查是否有指向 raw/papers/ 的链接
            paper_links = [l for l in page['wikilinks'] if 'paper' in l.lower() or 'arxiv' in l.lower()]
            if not paper_links:
                suggestions.append({
                    'type': 'no_paper_support',
                    'file': page['path'],
                    'title': page['title'],
                    'page_type': page['type'],
                    'message': '没有指向论文的链接，建议检查是否有新论文支持',
                    'severity': 'info',
                })

        # 检查时间线页面是否需要更新
        if page['type'] == 'timeline':
            # 检查是否是年度时间线
            if re.match(r'^\d{4}$', page['title']):
                year = int(page['title'])
                if year < now.year:
                    suggestions.append({
                        'type': 'timeline_outdated',
                        'file': page['path'],
                        'title': page['title'],
                        'page_type': page['type'],
                        'message': f'{year} 年时间线可能需要更新',
                        'severity': 'info',
                    })

    return suggestions


def print_report(suggestions: List[Dict]) -> None:
    """打印更新建议报告"""
    print("\n=== AIEduWiki 更新检查报告 ===\n")

    # 按类型分组
    suggestions_by_type = {}
    for suggestion in suggestions:
        page_type = suggestion['page_type']
        if page_type not in suggestions_by_type:
            suggestions_by_type[page_type] = []
        suggestions_by_type[page_type].append(suggestion)

    # 概念页面
    concept_suggestions = suggestions_by_type.get('concept', [])
    print("[概念页面]")
    if concept_suggestions:
        for suggestion in concept_suggestions:
            severity_icon = '⚠' if suggestion['severity'] == 'warning' else 'ℹ'
            print(f"  {severity_icon} {suggestion['title']}: {suggestion['message']}")
    else:
        print("  ✓ 所有概念页面已更新")

    # 实体页面
    entity_suggestions = suggestions_by_type.get('entity', [])
    print("\n[实体页面]")
    if entity_suggestions:
        for suggestion in entity_suggestions:
            severity_icon = '⚠' if suggestion['severity'] == 'warning' else 'ℹ'
            print(f"  {severity_icon} {suggestion['title']}: {suggestion['message']}")
    else:
        print("  ✓ 所有实体页面已更新")

    # 时间线页面
    timeline_suggestions = suggestions_by_type.get('timeline', [])
    print("\n[时间线页面]")
    if timeline_suggestions:
        for suggestion in timeline_suggestions:
            severity_icon = '⚠' if suggestion['severity'] == 'warning' else 'ℹ'
            print(f"  {severity_icon} {suggestion['title']}: {suggestion['message']}")
    else:
        print("  ✓ 所有时间线页面已更新")

    # 总结
    print("\n=== 建议更新的页面 ===")
    if suggestions:
        for i, suggestion in enumerate(suggestions, 1):
            print(f"  {i}. {suggestion['title']}（{suggestion['message']}）")
    else:
        print("  ✓ 所有页面已更新")


def main():
    parser = argparse.ArgumentParser(description="AIEduWiki 更新检查")
    parser.add_argument(
        "--days",
        type=int,
        default=30,
        help="检查最后更新时间超过 N 天的页面（默认 30 天）",
    )

    args = parser.parse_args()

    print("扫描 wiki 页面...")
    pages = scan_wiki_pages()
    print(f"  找到 {len(pages)} 个页面")

    print("检查更新建议...")
    suggestions = check_update_suggestions(pages)

    print_report(suggestions)


if __name__ == "__main__":
    main()
