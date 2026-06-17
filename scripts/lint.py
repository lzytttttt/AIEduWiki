#!/usr/bin/env python3
"""
AIEduWiki 质量审核脚本
检测断链、孤立页面、标签一致性、frontmatter 完整性

Usage:
    python scripts/lint.py
    python scripts/lint.py --fix  # 自动修复简单问题
"""

import argparse
import os
import re
from typing import List, Dict, Set, Tuple

# 项目路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
WIKI_ROOT = os.path.join(PROJECT_ROOT, "wiki")

# SCHEMA.md 定义的标签（需要从 SCHEMA.md 提取）
VALID_TAGS = set()

# frontmatter 必填字段
REQUIRED_FIELDS = ['title', 'created', 'updated', 'type']

# 页面类型
PAGE_TYPES = ['entity', 'concept', 'comparison', 'query', 'summary', 'timeline', 'tutorial', 'controversy']

def load_schema_tags() -> Set[str]:
    """从 SCHEMA.md 加载有效标签"""
    schema_path = os.path.join(WIKI_ROOT, "SCHEMA.md")
    tags = set()

    if not os.path.exists(schema_path):
        return tags

    with open(schema_path, encoding='utf-8') as f:
        content = f.read()

    # 提取标签定义
    # 格式: - **分类**：tag1, tag2, tag3, ...
    for match in re.finditer(r'\*\*[^*]+\*\*：(.+)', content):
        tag_list = match.group(1)
        for tag in tag_list.split(','):
            tag = tag.strip()
            if tag:
                tags.add(tag)

    return tags


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

            pages.append({
                'path': rel_path,
                'title': title,
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


def check_broken_links(pages: List[Dict]) -> List[Dict]:
    """检测断链"""
    issues = []
    page_titles = {p['title'] for p in pages}

    for page in pages:
        for link in page['wikilinks']:
            if link not in page_titles:
                issues.append({
                    'type': 'broken_link',
                    'file': page['path'],
                    'message': f'[[{link}]] → 断链',
                    'severity': 'error',
                })

    return issues


def check_orphan_pages(pages: List[Dict]) -> List[Dict]:
    """检测孤立页面"""
    issues = []

    # 构建入站链接映射
    inbound_links = {p['title']: set() for p in pages}
    for page in pages:
        for link in page['wikilinks']:
            if link in inbound_links:
                inbound_links[link].add(page['path'])

    # 检查没有入站链接的页面
    for page in pages:
        # 跳过 index.md 和 SCHEMA.md
        if page['path'] in ('index.md', 'SCHEMA.md'):
            continue

        # 跳过 raw/papers/ 目录
        if page['path'].startswith('raw/papers/'):
            continue

        if not inbound_links.get(page['title']):
            issues.append({
                'type': 'orphan_page',
                'file': page['path'],
                'message': '没有入站 wikilink',
                'severity': 'warning',
            })

    return issues


def check_tag_consistency(pages: List[Dict], valid_tags: Set[str]) -> List[Dict]:
    """检测标签一致性"""
    issues = []

    for page in pages:
        tags = page['frontmatter'].get('tags', [])
        if not tags:
            continue

        for tag in tags:
            if tag not in valid_tags:
                issues.append({
                    'type': 'invalid_tag',
                    'file': page['path'],
                    'message': f'tag "{tag}" 不在 SCHEMA.md 定义范围内',
                    'severity': 'warning',
                })

    return issues


def check_frontmatter_completeness(pages: List[Dict]) -> List[Dict]:
    """检测 frontmatter 完整性"""
    issues = []

    for page in pages:
        # 跳过 raw/papers/ 目录
        if page['path'].startswith('raw/papers/'):
            continue

        frontmatter = page['frontmatter']
        if not frontmatter:
            issues.append({
                'type': 'missing_frontmatter',
                'file': page['path'],
                'message': '缺少 frontmatter',
                'severity': 'error',
            })
            continue

        # 检查必填字段
        for field in REQUIRED_FIELDS:
            if field not in frontmatter:
                issues.append({
                    'type': 'missing_field',
                    'file': page['path'],
                    'message': f'缺少 "{field}" 字段',
                    'severity': 'error',
                })

    return issues


def print_report(issues: List[Dict]) -> None:
    """打印审核报告"""
    print("\n=== AIEduWiki 质量审核报告 ===\n")

    # 按类型分组
    issues_by_type = {}
    for issue in issues:
        issue_type = issue['type']
        if issue_type not in issues_by_type:
            issues_by_type[issue_type] = []
        issues_by_type[issue_type].append(issue)

    # 断链检测
    broken_links = issues_by_type.get('broken_link', [])
    print("[断链检测]")
    if broken_links:
        for issue in broken_links:
            print(f"  ✗ {issue['file']}: {issue['message']}")
    else:
        print("  ✓ 所有 wikilink 有效")

    # 孤立页面
    orphan_pages = issues_by_type.get('orphan_page', [])
    print("\n[孤立页面]")
    if orphan_pages:
        for issue in orphan_pages:
            print(f"  ⚠ {issue['file']}: {issue['message']}")
    else:
        print("  ✓ 所有页面都有入站链接")

    # 标签一致性
    invalid_tags = issues_by_type.get('invalid_tag', [])
    print("\n[标签一致性]")
    if invalid_tags:
        for issue in invalid_tags:
            print(f"  ✗ {issue['file']}: {issue['message']}")
    else:
        print("  ✓ 所有标签一致")

    # frontmatter 完整性
    missing_fields = issues_by_type.get('missing_field', [])
    missing_frontmatter = issues_by_type.get('missing_frontmatter', [])
    print("\n[frontmatter 完整性]")
    if missing_frontmatter:
        for issue in missing_frontmatter:
            print(f"  ✗ {issue['file']}: {issue['message']}")
    if missing_fields:
        for issue in missing_fields:
            print(f"  ✗ {issue['file']}: {issue['message']}")
    if not missing_frontmatter and not missing_fields:
        print("  ✓ 所有 frontmatter 完整")

    # 总结
    print("\n=== 总结 ===")
    print(f"  断链: {len(broken_links)} 个")
    print(f"  孤立页面: {len(orphan_pages)} 个")
    print(f"  标签不一致: {len(invalid_tags)} 个")
    print(f"  frontmatter 不完整: {len(missing_frontmatter) + len(missing_fields)} 个")

    total = len(broken_links) + len(orphan_pages) + len(invalid_tags) + len(missing_frontmatter) + len(missing_fields)
    if total == 0:
        print("\n  ✓ 所有检查通过！")
    else:
        print(f"\n  ✗ 发现 {total} 个问题")


def main():
    parser = argparse.ArgumentParser(description="AIEduWiki 质量审核")
    parser.add_argument(
        "--fix",
        action="store_true",
        help="自动修复简单问题",
    )

    args = parser.parse_args()

    print("加载 SCHEMA.md 标签...")
    valid_tags = load_schema_tags()
    print(f"  找到 {len(valid_tags)} 个有效标签")

    print("扫描 wiki 页面...")
    pages = scan_wiki_pages()
    print(f"  找到 {len(pages)} 个页面")

    print("运行质量检查...")
    issues = []

    issues.extend(check_broken_links(pages))
    issues.extend(check_orphan_pages(pages))
    issues.extend(check_tag_consistency(pages, valid_tags))
    issues.extend(check_frontmatter_completeness(pages))

    print_report(issues)

    # 返回退出码
    if any(i['severity'] == 'error' for i in issues):
        return 1
    return 0


if __name__ == "__main__":
    exit(main())
