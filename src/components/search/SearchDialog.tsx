"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, ArrowRight } from "lucide-react"
import {
  search,
  preloadIndex,
  type SearchResult,
} from "@/lib/search"
import { DOMAIN_DISPLAY, type Domain } from "@/lib/domains"

const RECENT_SEARCHES_KEY = "aieduwiki:recent-searches"
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  const recent = getRecentSearches().filter((s) => s !== query)
  recent.unshift(query)
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  )
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY)
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const [activeDomain, setActiveDomain] = React.useState<string | null>(null)
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // Preload index on mount
  React.useEffect(() => {
    preloadIndex()
  }, [])

  // Load recent searches when dialog opens
  React.useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches())
    }
  }, [open])

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const filters = activeDomain ? { domain: activeDomain } : undefined
      const hits = await search(query, filters)
      setResults(hits.slice(0, 15))
    }, 150)

    return () => {
      clearTimeout(debounceRef.current)
    }
  }, [query, activeDomain])

  function navigate(path: string) {
    if (query.trim()) saveRecentSearch(query.trim())
    onOpenChange(false)
    setQuery("")
    router.push(path)
  }

  function handleRecentClick(q: string) {
    setQuery(q)
  }

  const domainFilters: { key: string; label: string }[] = [
    { key: "theory", label: "理论" },
    { key: "technology", label: "技术" },
    { key: "products", label: "产品" },
    { key: "insights", label: "趋势" },
  ]

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="搜索概念、产品、趋势…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {/* Domain filter badges */}
      <div className="flex items-center gap-1.5 border-b px-3 py-2">
        <span className="text-xs text-muted-foreground mr-1">筛选：</span>
        {domainFilters.map((d) => (
          <button
            key={d.key}
            onClick={() =>
              setActiveDomain(activeDomain === d.key ? null : d.key)
            }
          >
            <Badge
              variant={activeDomain === d.key ? "default" : "secondary"}
              className="cursor-pointer text-xs"
            >
              {d.label}
            </Badge>
          </button>
        ))}
      </div>
      <CommandList>
        <CommandEmpty>未找到匹配结果</CommandEmpty>

        {/* Recent searches (shown when no query) */}
        {!query.trim() && recentSearches.length > 0 && (
          <CommandGroup heading="最近搜索">
            {recentSearches.map((q) => (
              <CommandItem key={q} value={q} onSelect={() => handleRecentClick(q)}>
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{q}</span>
              </CommandItem>
            ))}
            <CommandItem
              value="clear-recent"
              onSelect={() => {
                clearRecentSearches()
                setRecentSearches([])
              }}
            >
              <span className="text-xs text-muted-foreground">清除搜索历史</span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Search results */}
        {query.trim() && results.length > 0 && (
          <CommandGroup heading={`搜索结果 (${results.length})`}>
            {results.map((result) => (
              <SearchResultItem
                key={result.item.path}
                result={result}
                onSelect={() => navigate(result.item.path)}
              />
            ))}
          </CommandGroup>
        )}

        {/* Quick links when no query */}
        {!query.trim() && (
          <>
            {recentSearches.length > 0 && <CommandSeparator />}
            <CommandGroup heading="快速访问">
              {domainFilters.map((d) => (
                <CommandItem
                  key={d.key}
                  value={`browse-${d.key}`}
                  onSelect={() => {
                    onOpenChange(false)
                    router.push(`/${d.key}`)
                  }}
                >
                  <ArrowRight className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    浏览{DOMAIN_DISPLAY[d.key as Domain] ?? d.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

/** Single search result item with highlighted matches. */
function SearchResultItem({
  result,
  onSelect,
}: {
  result: SearchResult
  onSelect: () => void
}) {
  const { item, matches } = result

  // Find title match for highlighting
  const titleMatch = matches?.find((m) => m.key === "title")
  const highlightedTitle = titleMatch
    ? highlightText(item.title, titleMatch.indices)
    : item.title

  const domainLabel =
    DOMAIN_DISPLAY[item.domain as Domain] ?? item.domain

  return (
    <CommandItem
      value={item.title}
      onSelect={onSelect}
      className="flex-col items-start gap-1 py-3"
    >
      <div className="flex w-full items-center gap-2">
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-medium truncate">{highlightedTitle}</span>
        <Badge variant="secondary" className="ml-auto shrink-0 text-xs">
          {domainLabel}
        </Badge>
      </div>
      {item.excerpt && (
        <p className="line-clamp-1 text-xs text-muted-foreground pl-6">
          {item.excerpt.slice(0, 80)}
          {item.excerpt.length > 80 ? "…" : ""}
        </p>
      )}
    </CommandItem>
  )
}

/** Highlight matched character ranges in text using <mark>. */
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
