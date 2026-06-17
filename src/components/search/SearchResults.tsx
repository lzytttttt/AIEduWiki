"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Tag } from "lucide-react"
import { search, type SearchResult } from "@/lib/search"
import { DOMAIN_DISPLAY, type Domain } from "@/lib/domains"
import { cn } from "@/lib/utils"

interface SearchResultsProps {
  query: string
  domain?: string
  tags?: string[]
  className?: string
}

export function SearchResults({
  query,
  domain,
  tags,
  className,
}: SearchResultsProps) {
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    const filters: { domain?: string; tags?: string[] } = {}
    if (domain) filters.domain = domain
    if (tags && tags.length > 0) filters.tags = tags

    search(query, Object.keys(filters).length > 0 ? filters : undefined).then(
      (hits) => {
        if (!cancelled) {
          setResults(hits)
          setLoading(false)
        }
      }
    )

    return () => {
      cancelled = true
    }
  }, [query, domain, tags])

  if (!query.trim()) return null

  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-5 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-4 w-1/4 rounded bg-muted" />
              <div className="mt-2 h-3 w-full rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <p className="text-lg font-medium text-muted-foreground">
          未找到匹配「{query}」的结果
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          试试其他关键词，或浏览知识领域
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm text-muted-foreground">
        找到 {results.length} 条结果
      </p>
      {results.map((result) => (
        <ResultCard key={result.item.path} result={result} query={query} />
      ))}
    </div>
  )
}

function ResultCard({
  result,
  query,
}: {
  result: SearchResult
  query: string
}) {
  const { item, matches } = result
  const domainLabel = DOMAIN_DISPLAY[item.domain as Domain] ?? item.domain

  // Highlight title
  const titleMatch = matches?.find((m) => m.key === "title")
  const highlightedTitle = titleMatch
    ? highlightText(item.title, titleMatch.indices)
    : item.title

  // Highlight excerpt
  const excerptMatch = matches?.find((m) => m.key === "excerpt")
  const displayedExcerpt = item.excerpt.slice(0, 150)
  const highlightedExcerpt = excerptMatch
    ? highlightTextWithin(
        displayedExcerpt,
        item.excerpt,
        excerptMatch.indices
      )
    : displayedExcerpt

  return (
    <Link href={item.path} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{highlightedTitle}</h3>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {domainLabel}
                </Badge>
              </div>
              {item.tags.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {String(tag)}
                    </Badge>
                  ))}
                  {item.tags.length > 4 && (
                    <span className="text-xs text-muted-foreground">
                      +{item.tags.length - 4}
                    </span>
                  )}
                </div>
              )}
              {item.excerpt && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {highlightedExcerpt}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/** Highlight matched character ranges. */
function highlightText(
  text: string,
  indices: ReadonlyArray<[number, number]>
): React.ReactNode {
  if (!indices || indices.length === 0) return text

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  for (const [start, end] of indices) {
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start))
    }
    parts.push(
      <mark key={start} className="bg-primary/20 text-foreground rounded-sm px-0.5">
        {text.slice(start, end + 1)}
      </mark>
    )
    lastIndex = end + 1
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

/** Highlight within a truncated excerpt, mapping indices from full text. */
function highlightTextWithin(
  displayed: string,
  fullText: string,
  indices: ReadonlyArray<[number, number]>
): React.ReactNode {
  if (!indices || indices.length === 0) return displayed

  // Filter indices that fall within the displayed portion
  const maxLen = displayed.length
  const relevant: [number, number][] = []
  for (const [start, end] of indices) {
    if (start >= maxLen) break
    relevant.push([start, Math.min(end, maxLen - 1)])
  }

  if (relevant.length === 0) return displayed

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  for (const [start, end] of relevant) {
    if (start > lastIndex) {
      parts.push(displayed.slice(lastIndex, start))
    }
    parts.push(
      <mark key={start} className="bg-primary/20 text-foreground rounded-sm px-0.5">
        {displayed.slice(start, end + 1)}
      </mark>
    )
    lastIndex = end + 1
  }

  if (lastIndex < displayed.length) {
    parts.push(displayed.slice(lastIndex))
  }

  return parts
}
