#!/usr/bin/env node
/**
 * migrate-to-mdx.mjs — Migrate wiki/ markdown files to content/ MDX files.
 *
 * Domain mapping:
 *   concepts/ → theory/ or technology/ (based on tags)
 *   entities/ → products/
 *   comparisons/ → insights/
 *   controversies/ → insights/
 *   timelines/ → insights/
 *   tutorials/ → technology/
 *
 * Transforms applied:
 *   - .md-button / .concept-link link classes → stripped
 *   - Relative links (../section/file/) → absolute links (/domain/slug)
 *   - Wikilinks [[...]] → kept as-is (remark plugin handles at build time)
 *   - Admonitions !!! / ??? → kept as-is (preprocessor handles at build time)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const WIKI_ROOT = path.join(PROJECT_ROOT, 'wiki')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'content')

// ── Domain mapping ──────────────────────────────────────────────────────────

const DIR_TO_DOMAIN = {
  comparisons: 'insights',
  controversies: 'insights',
  timelines: 'insights',
  entities: 'products',
  tutorials: 'technology',
}

const THEORY_TAGS = new Set([
  '知识追踪', 'adaptive-learning', 'learning-science',
  '教学智能体', 'learning-simulation', '知识图谱',
  'collaborative-learning', 'scaffolding', 'pedagogical-agents',
  'interpretability', 'diagnostic-reasoning', 'metacognition',
])

const TECHNOLOGY_TAGS = new Set([
  'nlp', 'reinforcement-learning', 'multimodal',
  'recommendation', 'model', '自然语言处理',
  'architecture', '智能体',
])

function classifyConcept(tags) {
  const lower = tags.map(t => String(t).toLowerCase())
  for (const t of lower) if (TECHNOLOGY_TAGS.has(t)) return 'technology'
  for (const t of lower) if (THEORY_TAGS.has(t)) return 'theory'
  return 'theory'
}

// ── Build file → domain lookup ──────────────────────────────────────────────

function buildFileLookup() {
  const lookup = new Map()
  for (const dir of ['concepts', 'entities', 'comparisons', 'controversies', 'timelines', 'tutorials']) {
    const dirPath = path.join(WIKI_ROOT, dir)
    if (!fs.existsSync(dirPath)) continue
    for (const file of fs.readdirSync(dirPath).filter(f => f.endsWith('.md'))) {
      const slug = file.replace(/\.md$/, '')
      let domain
      if (dir === 'concepts') {
        const raw = fs.readFileSync(path.join(dirPath, file), 'utf-8')
        const { data } = matter(raw)
        domain = classifyConcept(Array.isArray(data.tags) ? data.tags : [])
      } else {
        domain = DIR_TO_DOMAIN[dir]
      }
      lookup.set(slug, { domain, slug, sourceDir: dir })
    }
  }
  return lookup
}

// ── Link transforms ─────────────────────────────────────────────────────────

function transformLinks(content, sourceDir, fileLookup) {
  let r = content

  // 1. Strip .md-button / .concept-link classes
  r = r.replace(/\]\(([^)]+)\)\s*\{\s*\.(md-button|concept-link)\s*\}/g, ']($1)')

  // 2. Relative links: ../section/slug/ → /domain/slug
  r = r.replace(/\]\(\.\.\/([^)]+)\)/g, (m, rel) => {
    const clean = rel.replace(/\/$/, '').replace(/\.md$/, '')
    const parts = clean.split('/')
    if (parts.length >= 2) {
      const section = parts[0]
      const slug = parts.slice(1).join('/')
      if (section === 'concepts') {
        // concepts → theory or technology depending on tags
        const entry = fileLookup.get(slug)
        return entry ? `](/${entry.domain}/${slug})` : `](/theory/${slug})`
      }
      const domain = DIR_TO_DOMAIN[section]
      if (domain) return `](/${domain}/${slug})`
    }
    return m
  })

  // 3. Bare sibling links: [text](slug/) → /domain/slug
  r = r.replace(/\]\(([A-Za-z\u4e00-\u9fff\u00C0-\u024f][^)]*?)\/\)/g, (m, rel) => {
    if (rel.startsWith('/') || rel.startsWith('http') || rel.startsWith('..')) return m
    const slug = rel.replace(/\.md$/, '')
    const entry = fileLookup.get(slug)
    if (entry) return `](/${entry.domain}/${slug})`
    const domain = DIR_TO_DOMAIN[sourceDir]
    return domain ? `](/${domain}/${slug})` : m
  })

  return r
}

// ── Serialize frontmatter ───────────────────────────────────────────────────

function serializeFrontmatter(data) {
  let fm = '---\n'
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      fm += `${k}: [${v.join(', ')}]\n`
    } else if (v instanceof Date) {
      fm += `${k}: ${v.toISOString().split('T')[0]}\n`
    } else if (typeof v === 'string' && /[:#"'{}\[\],&*?|>!%`]/.test(v)) {
      fm += `${k}: "${v}"\n`
    } else {
      fm += `${k}: ${v}\n`
    }
  }
  return fm + '---\n\n'
}

// ── Migration ───────────────────────────────────────────────────────────────

function migrate() {
  const report = {
    migrated: [], failed: [],
    byDomain: { theory: [], technology: [], products: [], insights: [] },
    wikilinkCounts: {}, totalFiles: 0, totalWikilinks: 0,
  }
  const fileLookup = buildFileLookup()

  for (const d of ['theory', 'technology', 'products', 'insights'])
    fs.mkdirSync(path.join(CONTENT_ROOT, d), { recursive: true })

  for (const dir of ['concepts', 'entities', 'comparisons', 'controversies', 'timelines', 'tutorials']) {
    const dirPath = path.join(WIKI_ROOT, dir)
    if (!fs.existsSync(dirPath)) { console.log(`  Skipping ${dir}/`); continue }
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'))
    console.log(`  ${dir}/ (${files.length} files)`)

    for (const file of files) {
      const slug = file.replace(/\.md$/, '')
      try {
        const raw = fs.readFileSync(path.join(dirPath, file), 'utf-8')
        const { data, content } = matter(raw)

        const domain = dir === 'concepts'
          ? classifyConcept(Array.isArray(data.tags) ? data.tags : [])
          : DIR_TO_DOMAIN[dir]

        const body = transformLinks(content, dir, fileLookup)
        const wl = (body.match(/\[\[[^\]]+\]\]/g) || []).length
        report.wikilinkCounts[`${dir}/${file}`] = wl
        report.totalWikilinks += wl

        fs.writeFileSync(
          path.join(CONTENT_ROOT, domain, `${slug}.mdx`),
          serializeFrontmatter(data) + body, 'utf-8',
        )

        report.migrated.push({ source: `${dir}/${file}`, domain, slug })
        report.byDomain[domain].push({ slug, title: data.title || slug, tags: data.tags || [] })
        report.totalFiles++
      } catch (err) {
        report.failed.push({ source: `${dir}/${file}`, error: err.message })
        console.error(`  FAIL ${dir}/${file}: ${err.message}`)
      }
    }
  }
  return report
}

// ── Generate index.json ─────────────────────────────────────────────────────

function generateIndex(report) {
  const index = {}
  for (const d of ['theory', 'technology', 'products', 'insights']) {
    index[d] = report.byDomain[d].map(e => ({ slug: e.slug, title: e.title, tags: e.tags }))
  }
  fs.writeFileSync(path.join(CONTENT_ROOT, 'index.json'), JSON.stringify(index, null, 2), 'utf-8')
  console.log('  Wrote content/index.json')
}

// ── Generate SCHEMA.md ──────────────────────────────────────────────────────

function generateSchema() {
  const src = path.join(WIKI_ROOT, 'SCHEMA.md')
  if (!fs.existsSync(src)) { console.log('  SCHEMA.md not found'); return }
  let c = fs.readFileSync(src, 'utf-8')
  c = c.replace(/wiki\/pages/g, 'content/').replace(/wiki\/log\.md/g, 'content/log.md')
  fs.writeFileSync(path.join(CONTENT_ROOT, 'SCHEMA.md'), c, 'utf-8')
  console.log('  Wrote content/SCHEMA.md')
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log('=== AIEduWiki Content Migration ===\n')
const report = migrate()
console.log('\nGenerating index.json...'); generateIndex(report)
console.log('Copying SCHEMA.md...'); generateSchema()

// ── Report ──────────────────────────────────────────────────────────────────

console.log('\n=== Migration Report ===')
console.log(`\nTotal: ${report.totalFiles} files, ${report.totalWikilinks} wikilinks\n`)

for (const [d, files] of Object.entries(report.byDomain)) {
  console.log(`${d}: ${files.length} files`)
  for (const f of files) {
    const key = Object.keys(report.wikilinkCounts).find(k => k.includes(f.slug))
    console.log(`  - ${f.slug} (${report.wikilinkCounts[key] || 0} wl)`)
  }
}

if (report.failed.length) {
  console.log(`\nFAILED (${report.failed.length}):`)
  report.failed.forEach(f => console.log(`  ${f.source}: ${f.error}`))
}
console.log('\nDone!')
