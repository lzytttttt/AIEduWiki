#!/usr/bin/env node
/**
 * build-graph.mjs — Node.js port of scripts/build_graph.py
 *
 * Scans content/ directory, extracts frontmatter + wikilinks,
 * generates public/graph.json with same schema as the Python version.
 *
 * Usage: node scripts/build-graph.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'content')
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'public', 'graph.json')

const NODE_COLORS = {
  concept: '#4285F4',
  entity: '#34A853',
  paper: '#9E9E9E',
  timeline: '#FF9800',
  tutorial: '#9C27B0',
  comparison: '#F44336',
  controversy: '#E91E63',
}

// Domain → node type mapping
const DOMAIN_TYPES = {
  theory: 'concept',
  technology: 'concept',
  products: 'entity',
  insights: 'concept',
}

const WIKILINK_RE = /\[\[([^\]]+?)\]\]/g

/** Recursively find all .mdx files under a directory. */
function findMdxFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(full))
    } else if (entry.name.endsWith('.mdx')) {
      results.push(full)
    }
  }
  return results
}

/** Extract wikilinks from markdown content (excluding frontmatter and code). */
function extractWikilinks(content) {
  // Remove code blocks
  let stripped = content.replace(/```[\s\S]*?```/g, '')
  stripped = stripped.replace(/`[^`]*`/g, '')

  const links = []
  let m
  WIKILINK_RE.lastIndex = 0
  while ((m = WIKILINK_RE.exec(stripped)) !== null) {
    const inner = m[1]
    const target = inner.includes('|') ? inner.split('|')[0].trim() : inner.trim()
    links.push(target)
  }
  return links
}

/** Scan all content pages and extract metadata. */
function scanPages() {
  const files = findMdxFiles(CONTENT_ROOT)
  const pages = []

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data: fm, content } = matter(raw)
    if (!fm || !fm.title) continue

    const relPath = path.relative(CONTENT_ROOT, filePath).replace(/\\/g, '/')
    const domain = relPath.split('/')[0]

    // Determine type from frontmatter or domain
    let pageType = fm.type || DOMAIN_TYPES[domain] || 'concept'
    // Override with domain for known mappings
    if (fm.type && NODE_COLORS[fm.type]) {
      pageType = fm.type
    }

    const wikilinks = extractWikilinks(content)

    pages.push({
      id: fm.title,
      type: pageType,
      path: relPath,
      title: fm.title,
      tags: fm.tags || [],
      wikilinks,
    })
  }

  return pages
}

/** Build graph from scanned pages. */
function buildGraph(pages) {
  const nodes = []
  const edges = []
  const nodeIdSet = new Set()

  for (const page of pages) {
    if (nodeIdSet.has(page.id)) continue
    nodeIdSet.add(page.id)
    nodes.push({
      id: page.id,
      label: page.title,
      type: page.type,
      color: NODE_COLORS[page.type] || '#9E9E9E',
      path: page.path,
    })
  }

  const titleToId = new Map()
  for (const p of pages) {
    titleToId.set(p.title, p.id)
    titleToId.set(p.title.toLowerCase(), p.id)
  }

  for (const page of pages) {
    for (const target of page.wikilinks) {
      const targetId = titleToId.get(target) || titleToId.get(target.toLowerCase())
      if (targetId && targetId !== page.id) {
        edges.push({ from: page.id, to: targetId, type: 'related' })
      }
    }
  }

  // Deduplicate edges
  const seen = new Set()
  const uniqueEdges = []
  for (const edge of edges) {
    const key = `${edge.from}\0${edge.to}`
    if (!seen.has(key)) {
      seen.add(key)
      uniqueEdges.push(edge)
    }
  }

  // Compute edge count per node
  const edgeCount = new Map()
  for (const node of nodes) {
    edgeCount.set(node.id, 0)
  }
  for (const edge of uniqueEdges) {
    edgeCount.set(edge.from, (edgeCount.get(edge.from) || 0) + 1)
    edgeCount.set(edge.to, (edgeCount.get(edge.to) || 0) + 1)
  }
  for (const node of nodes) {
    node.edges = edgeCount.get(node.id) || 0
  }

  const nodeTypes = {}
  for (const type of Object.keys(NODE_COLORS)) {
    nodeTypes[type] = nodes.filter((n) => n.type === type).length
  }

  return {
    nodes,
    edges: uniqueEdges,
    stats: {
      total_nodes: nodes.length,
      total_edges: uniqueEdges.length,
      node_types: nodeTypes,
    },
  }
}

// --- main ---
console.log('Scanning content pages...')
const pages = scanPages()
console.log(`  Found ${pages.length} pages`)

console.log('Building graph...')
const graph = buildGraph(pages)

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(graph, null, 2), 'utf-8')

console.log(`  Saved graph to ${OUTPUT_PATH}`)
console.log(`  Nodes: ${graph.stats.total_nodes}`)
console.log(`  Edges: ${graph.stats.total_edges}`)
console.log(`  Types: ${JSON.stringify(graph.stats.node_types)}`)
console.log('Done!')
