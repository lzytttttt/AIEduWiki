#!/usr/bin/env python3
"""
AI Agent 论文抓取脚本
从 arXiv API 搜索 AI 教育相关论文，输出结构化元数据

Usage:
    python scripts/agent_fetch.py --query "AI education" --days 7
    python scripts/agent_fetch.py --query "knowledge tracing" --max-results 20
"""

import argparse
import json
import sys
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

# arXiv API 配置
ARXIV_API_URL = "http://export.arxiv.org/api/query"
MAX_RESULTS_PER_QUERY = 50
RETRY_COUNT = 3
RETRY_DELAY = 5  # seconds

# AI 教育相关默认搜索关键词
DEFAULT_QUERIES = [
    "AI education",
    "adaptive learning",
    "knowledge tracing",
    "intelligent tutoring",
    "educational technology",
    "personalized learning",
    "LLM education",
    "educational AI",
]


def fetch_arxiv_papers(
    query: str,
    max_results: int = 20,
    days: Optional[int] = None,
    sort_by: str = "submittedDate",
    sort_order: str = "descending",
) -> List[Dict]:
    """
    从 arXiv API 搜索论文

    Args:
        query: 搜索关键词
        max_results: 最大返回数量
        days: 时间范围（最近 N 天），None 表示不限制
        sort_by: 排序字段（submittedDate, relevance, lastUpdatedDate）
        sort_order: 排序顺序（ascending, descending）

    Returns:
        论文元数据列表
    """
    # 构建搜索查询
    # arXiv API 使用 Lucene 查询语法
    search_query = f"all:{query}"

    # 计算时间范围
    if days:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        # arXiv API 不直接支持日期过滤，需要后处理
        pass

    # 构建请求参数
    params = {
        "search_query": search_query,
        "start": 0,
        "max_results": max_results,
        "sortBy": sort_by,
        "sortOrder": sort_order,
    }

    url = f"{ARXIV_API_URL}?{urllib.parse.urlencode(params)}"

    # 带重试的请求
    for attempt in range(RETRY_COUNT):
        try:
            print(f"  正在查询 arXiv: {query} (尝试 {attempt + 1}/{RETRY_COUNT})")
            with urllib.request.urlopen(url, timeout=30) as response:
                xml_data = response.read().decode("utf-8")
            break
        except Exception as e:
            if attempt < RETRY_COUNT - 1:
                print(f"  请求失败: {e}，{RETRY_DELAY}秒后重试...")
                time.sleep(RETRY_DELAY)
            else:
                print(f"  请求失败: {e}，已达到最大重试次数")
                return []

    # 解析 XML 响应
    papers = parse_arxiv_response(xml_data)

    # 按时间过滤
    if days:
        cutoff_date = datetime.now() - timedelta(days=days)
        papers = [
            p for p in papers
            if parse_date(p.get("published", "")) >= cutoff_date
        ]

    return papers


def parse_arxiv_response(xml_data: str) -> List[Dict]:
    """解析 arXiv API 的 XML 响应"""
    papers = []

    # 定义命名空间
    namespaces = {
        "atom": "http://www.w3.org/2005/Atom",
        "arxiv": "http://arxiv.org/schemas/atom",
    }

    try:
        root = ET.fromstring(xml_data)
    except ET.ParseError as e:
        print(f"  XML 解析错误: {e}")
        return []

    for entry in root.findall("atom:entry", namespaces):
        paper = {}

        # 标题
        title_elem = entry.find("atom:title", namespaces)
        if title_elem is not None:
            paper["title"] = title_elem.text.strip().replace("\n", " ")

        # 摘要
        summary_elem = entry.find("atom:summary", namespaces)
        if summary_elem is not None:
            paper["abstract"] = summary_elem.text.strip().replace("\n", " ")

        # 作者
        authors = []
        for author in entry.findall("atom:author", namespaces):
            name_elem = author.find("atom:name", namespaces)
            if name_elem is not None:
                authors.append(name_elem.text.strip())
        paper["authors"] = authors

        # 发布日期
        published_elem = entry.find("atom:published", namespaces)
        if published_elem is not None:
            paper["published"] = published_elem.text.strip()

        # 更新日期
        updated_elem = entry.find("atom:updated", namespaces)
        if updated_elem is not None:
            paper["updated"] = updated_elem.text.strip()

        # arXiv ID
        id_elem = entry.find("atom:id", namespaces)
        if id_elem is not None:
            arxiv_url = id_elem.text.strip()
            paper["arxiv_url"] = arxiv_url
            # 提取纯 ID（如 2604.12345）
            paper["arxiv_id"] = arxiv_url.split("/abs/")[-1]

        # PDF 链接
        for link in entry.findall("atom:link", namespaces):
            if link.get("title") == "pdf":
                paper["pdf_url"] = link.get("href", "")

        # 分类
        categories = []
        for category in entry.findall("atom:category", namespaces):
            term = category.get("term", "")
            if term:
                categories.append(term)
        paper["categories"] = categories

        # DOI（如果有）
        doi_elem = entry.find("arxiv:doi", namespaces)
        if doi_elem is not None:
            paper["doi"] = doi_elem.text.strip()

        if paper.get("title"):
            papers.append(paper)

    return papers


def parse_date(date_str: str) -> datetime:
    """解析 arXiv 日期格式"""
    try:
        return datetime.strptime(date_str[:10], "%Y-%m-%d")
    except (ValueError, IndexError):
        return datetime.min


def format_paper_summary(paper: Dict) -> str:
    """格式化单篇论文摘要（用于终端输出）"""
    lines = []
    lines.append(f"  标题: {paper.get('title', 'N/A')}")
    lines.append(f"  作者: {', '.join(paper.get('authors', [])[:3])}")
    lines.append(f"  日期: {paper.get('published', 'N/A')[:10]}")
    lines.append(f"  arXiv: {paper.get('arxiv_id', 'N/A')}")
    lines.append(f"  分类: {', '.join(paper.get('categories', [])[:3])}")
    if paper.get("abstract"):
        abstract = paper["abstract"][:200] + "..." if len(paper["abstract"]) > 200 else paper["abstract"]
        lines.append(f"  摘要: {abstract}")
    return "\n".join(lines)


def save_papers_json(papers: List[Dict], output_path: str) -> None:
    """保存论文元数据到 JSON 文件"""
    output = {
        "fetch_time": datetime.now().isoformat(),
        "total_count": len(papers),
        "papers": papers,
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"  已保存 {len(papers)} 篇论文到 {output_path}")


def main():
    parser = argparse.ArgumentParser(description="从 arXiv 搜索 AI 教育论文")
    parser.add_argument(
        "--query", "-q",
        type=str,
        default=None,
        help="搜索关键词（默认使用预设的 AI 教育关键词集）",
    )
    parser.add_argument(
        "--max-results", "-n",
        type=int,
        default=20,
        help="最大返回数量（默认 20）",
    )
    parser.add_argument(
        "--days", "-d",
        type=int,
        default=None,
        help="时间范围：最近 N 天（默认不限制）",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="输出 JSON 文件路径（默认打印到终端）",
    )
    parser.add_argument(
        "--all-keywords",
        action="store_true",
        help="使用所有预设关键词搜索（合并去重）",
    )

    args = parser.parse_args()

    # 确定搜索关键词
    if args.query:
        queries = [args.query]
    elif args.all_keywords:
        queries = DEFAULT_QUERIES
    else:
        queries = DEFAULT_QUERIES[:3]  # 默认使用前 3 个

    # 执行搜索
    all_papers = []
    seen_ids = set()

    for query in queries:
        papers = fetch_arxiv_papers(
            query=query,
            max_results=args.max_results,
            days=args.days,
        )
        # 去重
        for paper in papers:
            arxiv_id = paper.get("arxiv_id", "")
            if arxiv_id and arxiv_id not in seen_ids:
                seen_ids.add(arxiv_id)
                all_papers.append(paper)

        # 避免 API 限流
        if len(queries) > 1:
            time.sleep(3)

    print(f"\n共找到 {len(all_papers)} 篇论文\n")

    # 输出结果
    if args.output:
        save_papers_json(all_papers, args.output)
    else:
        for i, paper in enumerate(all_papers, 1):
            print(f"[{i}]")
            print(format_paper_summary(paper))
            print()

    return all_papers


if __name__ == "__main__":
    main()
