#!/usr/bin/env python3
"""
知识图谱数据提取脚本
从 wiki 页面的 wikilink 和 frontmatter 自动提取关系数据

Usage:
    python scripts/build_graph.py
    python scripts/build_graph.py --output wiki/assets/graph.json
"""

import argparse
import json
import os
import re
from typing import List, Dict, Tuple

# 项目路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
WIKI_ROOT = os.path.join(PROJECT_ROOT, "wiki")
ASSETS_DIR = os.path.join(WIKI_ROOT, "assets")

# 节点类型颜色
NODE_COLORS = {
    "concept": "#4285F4",  # 蓝色
    "entity": "#34A853",   # 绿色
    "paper": "#9E9E9E",    # 灰色
    "timeline": "#FF9800", # 橙色
    "tutorial": "#9C27B0", # 紫色
}


def scan_wiki_pages() -> List[Dict]:
    """扫描所有 wiki 页面，提取 frontmatter 和 wikilink"""
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
            if not frontmatter:
                continue

            # 提取 wikilinks
            wikilinks = extract_wikilinks(content)

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

            # 获取标题
            title = frontmatter.get('title', fname.replace('.md', ''))

            pages.append({
                'id': title,
                'type': page_type,
                'path': rel_path,
                'title': title,
                'tags': frontmatter.get('tags', []),
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


def build_graph(pages: List[Dict]) -> Dict:
    """构建图谱数据"""
    nodes = []
    edges = []
    node_ids = set()

    # 创建节点
    for page in pages:
        node_id = page['id']
        if node_id in node_ids:
            continue
        node_ids.add(node_id)

        node = {
            'id': node_id,
            'label': page['title'],
            'type': page['type'],
            'color': NODE_COLORS.get(page['type'], '#9E9E9E'),
            'path': page['path'],
        }
        nodes.append(node)

    # 创建边
    for page in pages:
        source_id = page['id']
        for target_title in page['wikilinks']:
            # 查找目标节点
            target_id = None
            for p in pages:
                if p['title'] == target_title or p['id'] == target_title:
                    target_id = p['id']
                    break

            if target_id and target_id != source_id:
                edge = {
                    'from': source_id,
                    'to': target_id,
                    'type': 'related',
                }
                edges.append(edge)

    # 去重边
    unique_edges = []
    seen_edges = set()
    for edge in edges:
        edge_key = (edge['from'], edge['to'])
        if edge_key not in seen_edges:
            seen_edges.add(edge_key)
            unique_edges.append(edge)

    return {
        'nodes': nodes,
        'edges': unique_edges,
        'stats': {
            'total_nodes': len(nodes),
            'total_edges': len(unique_edges),
            'node_types': {t: len([n for n in nodes if n['type'] == t]) for t in NODE_COLORS.keys()},
        }
    }


def save_graph(graph: Dict, output_path: str) -> None:
    """保存图谱数据到 JSON 文件"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)

    print(f"  已保存图谱数据到 {output_path}")
    print(f"  节点数: {graph['stats']['total_nodes']}")
    print(f"  边数: {graph['stats']['total_edges']}")
    print(f"  节点类型分布: {graph['stats']['node_types']}")


def main():
    parser = argparse.ArgumentParser(description="从 wiki 页面提取知识图谱数据")
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=os.path.join(ASSETS_DIR, "graph.json"),
        help="输出 JSON 文件路径",
    )

    args = parser.parse_args()

    print("扫描 wiki 页面...")
    pages = scan_wiki_pages()
    print(f"  找到 {len(pages)} 个页面")

    print("构建图谱数据...")
    graph = build_graph(pages)

    print("保存图谱数据...")
    save_graph(graph, args.output)

    print("完成!")


if __name__ == "__main__":
    main()
