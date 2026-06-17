#!/usr/bin/env node
/**
 * build-search-index.mjs
 *
 * Scans all .mdx files under content/, extracts title/domain/tags/excerpt,
 * and writes public/search-index.json for client-side search.
 *
 * Usage: node scripts/build-search-index.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'content')
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'public', 'search-index.json')

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

function excerpt(text, maxLen = 200) {
  const clean = text
    .replace(/^---[\s\S]*?---\s*/, '')   // strip frontmatter
    .replace(/```[\s\S]*?```/g, '')       // strip code blocks
    .replace(/`[^`]*`/g, '')              // strip inline code
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, '') // strip links/images
    .replace(/#{1,6}\s*/g, '')            // strip headings
    .replace(/\*\*([^*]*)\*\*/g, '$1')    // strip bold
    .replace(/\*([^*]*)\*/g, '$1')        // strip italic
    .replace(/\[\[([^\]|]*)(?:\|[^\]]*)?\]\]/g, '$1') // wikilinks → text
    .replace(/\n+/g, ' ')
    .trim()
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean
}

const files = findMdxFiles(CONTENT_ROOT)
const entries = []

for (const filePath of files) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: fm, content } = matter(raw)
  if (!fm || !fm.title) continue

  const relPath = path.relative(CONTENT_ROOT, filePath).replace(/\\/g, '/')
  const domain = relPath.split('/')[0]
  const slug = relPath
    .replace(/\.mdx$/, '')
    .split('/')
    .slice(1)
    .join('/')

  entries.push({
    title: fm.title,
    domain,
    slug,
    type: fm.type || '',
    tags: fm.tags || [],
    excerpt: excerpt(content),
    path: `/${domain}/${slug}`,
  })
}

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2), 'utf-8')

console.log(`Search index: ${entries.length} entries → ${OUTPUT_PATH}`)
