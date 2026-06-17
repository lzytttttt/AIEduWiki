import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface Frontmatter {
  title: string
  created: string
  updated: string
  type: string
  tags: string[]
  sources: string[]
}

export interface ParsedContent {
  frontmatter: Frontmatter
  content: string
  readingTime: { text: string; minutes: number }
}

export function parseFrontmatter(raw: string): ParsedContent {
  const { data, content } = matter(raw)
  // gray-matter parses YAML dates as Date objects — coerce to strings
  const frontmatter = {
    title: String(data.title ?? ''),
    created: data.created instanceof Date ? data.created.toISOString().slice(0, 10) : String(data.created ?? ''),
    updated: data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated ?? ''),
    type: String(data.type ?? ''),
    tags: Array.isArray(data.tags) ? data.tags : [],
    sources: Array.isArray(data.sources) ? data.sources : [],
  } satisfies Frontmatter
  return { frontmatter, content, readingTime: readingTime(content) }
}
