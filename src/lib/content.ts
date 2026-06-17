import fs from 'fs/promises'
import path from 'path'
import { parseFrontmatter } from './frontmatter'
import type { Frontmatter } from './frontmatter'

export { type Domain, DOMAIN_DISPLAY, DOMAIN_DESCRIPTIONS, getDomains } from './domains'

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const DOMAINS = ['theory', 'technology', 'products', 'insights'] as const

/** List all .mdx slugs in a domain directory. */
export async function getContentFiles(domain: string): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, domain)
  try {
    const files = await fs.readdir(dir)
    return files
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
  } catch {
    return []
  }
}

/** Read and parse a single content file by domain + slug. */
export async function getContentBySlug(domain: string, slug: string) {
  const filePath = path.join(CONTENT_ROOT, domain, `${slug}.mdx`)
  const raw = await fs.readFile(filePath, 'utf-8')
  return parseFrontmatter(raw)
}

export interface ContentSummary {
  slug: string
  domain: string
  frontmatter: Frontmatter
}

/** List all content for a specific domain with frontmatter. */
export async function getContentByDomain(domain: string): Promise<ContentSummary[]> {
  const slugs = await getContentFiles(domain)
  const results: ContentSummary[] = []
  for (const slug of slugs) {
    try {
      const { frontmatter } = await getContentBySlug(domain, slug)
      results.push({ slug, domain, frontmatter })
    } catch {
      // Skip files that fail to parse
    }
  }
  return results
}

/** List all content across all domains with frontmatter. */
export async function getAllContent(): Promise<ContentSummary[]> {
  const results: ContentSummary[] = []
  for (const domain of DOMAINS) {
    const domainResults = await getContentByDomain(domain)
    results.push(...domainResults)
  }
  return results
}

/** Build a title→slug map for wikilink resolution. */
export async function getContentIndex(): Promise<Map<string, string>> {
  const index = new Map<string, string>()
  const all = await getAllContent()
  for (const { slug, domain, frontmatter } of all) {
    if (frontmatter.title) {
      index.set(frontmatter.title.toLowerCase(), `${domain}/${slug}`)
    }
  }
  return index
}
