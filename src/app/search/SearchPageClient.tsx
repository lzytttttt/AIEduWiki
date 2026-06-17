"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { SearchResults } from "@/components/search/SearchResults"
import { DOMAIN_DISPLAY, type Domain } from "@/lib/domains"

const DOMAINS = ["theory", "technology", "products", "insights"] as const

export function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialQuery = searchParams.get("q") ?? ""
  const initialDomain = searchParams.get("domain") ?? ""
  const initialTag = searchParams.get("tag") ?? ""

  const [query, setQuery] = React.useState(initialQuery)
  const [activeDomain, setActiveDomain] = React.useState(initialDomain)
  const [activeTag, setActiveTag] = React.useState(initialTag)
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // Update URL params on filter change
  const updateUrl = React.useCallback(
    (q: string, domain: string, tag: string) => {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      if (domain) params.set("domain", domain)
      if (tag) params.set("tag", tag)
      const qs = params.toString()
      router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false })
    },
    [router]
  )

  // Debounced URL update on query change
  React.useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateUrl(query, activeDomain, activeTag)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query, activeDomain, activeTag, updateUrl])

  function handleDomainToggle(domain: string) {
    setActiveDomain(activeDomain === domain ? "" : domain)
  }

  const tags = activeTag ? [activeTag] : []

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          搜索
        </h1>
        <p className="mt-2 text-muted-foreground">
          在 AI 教育知识库中搜索理论、技术、产品与趋势
        </p>
      </header>

      {/* Search input */}
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索概念、产品、趋势…"
          className="pl-10 h-12 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Domain filter badges */}
      <div className="mx-auto mt-4 flex max-w-xl items-center gap-2">
        <span className="text-sm text-muted-foreground">领域：</span>
        {DOMAINS.map((d) => (
          <button key={d} onClick={() => handleDomainToggle(d)}>
            <Badge
              variant={activeDomain === d ? "default" : "secondary"}
              className="cursor-pointer"
            >
              {DOMAIN_DISPLAY[d as Domain]}
            </Badge>
          </button>
        ))}
        {(activeDomain || activeTag) && (
          <button
            onClick={() => {
              setActiveDomain("")
              setActiveTag("")
            }}
          >
            <Badge variant="outline" className="cursor-pointer">
              清除筛选
            </Badge>
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-8">
        <SearchResults
          query={query}
          domain={activeDomain || undefined}
          tags={tags.length > 0 ? tags : undefined}
        />
      </div>

      {/* Empty state when no query */}
      {!query.trim() && (
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>输入关键词开始搜索</p>
          <p className="mt-1">
            或按{" "}
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>{" "}
            打开快速搜索
          </p>
        </div>
      )}
    </div>
  )
}
