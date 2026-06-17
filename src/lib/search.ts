"use client"

import Fuse, { type FuseResultMatch, type IFuseOptions } from "fuse.js"

export interface SearchEntry {
  title: string
  domain: string
  slug: string
  type: string
  tags: string[]
  excerpt: string
  path: string
}

export interface SearchResult {
  item: SearchEntry
  score: number
  matches?: readonly FuseResultMatch[]
}

let fuseInstance: Fuse<SearchEntry> | null = null
let indexLoaded = false

const FUSE_OPTIONS: IFuseOptions<SearchEntry> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "tags", weight: 0.3 },
    { name: "excerpt", weight: 0.2 },
    { name: "domain", weight: 0.1 },
  ],
  threshold: 0.3,
  includeMatches: true,
  includeScore: true,
  // Chinese text: use default tokenization which handles CJK characters
  // Fuse.js >= 6 supports CJK without extra config when isCaseSensitive=false
  isCaseSensitive: false,
  minMatchCharLength: 1,
}

async function loadIndex(): Promise<Fuse<SearchEntry>> {
  if (fuseInstance) return fuseInstance

  const res = await fetch("/search-index.json")
  if (!res.ok) throw new Error("Failed to load search index")
  const data: SearchEntry[] = await res.json()

  fuseInstance = new Fuse(data, FUSE_OPTIONS)
  indexLoaded = true
  return fuseInstance
}

/** Run a search query with optional domain/tag filters. */
export async function search(
  query: string,
  filters?: { domain?: string; tags?: string[] }
): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const fuse = await loadIndex()
  let results = fuse.search(query)

  if (filters?.domain) {
    results = results.filter((r) => r.item.domain === filters.domain)
  }
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter((r) =>
      filters.tags!.some((tag) => r.item.tags.includes(tag))
    )
  }

  return results.map((r) => ({
    item: r.item,
    score: r.score ?? 0,
    matches: r.matches,
  }))
}

/** Check if the search index has been loaded. */
export function isIndexLoaded(): boolean {
  return indexLoaded
}

/** Preload the search index (call on mount for faster first search). */
export async function preloadIndex(): Promise<void> {
  await loadIndex()
}
