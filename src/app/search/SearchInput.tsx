"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchInput() {
  const [query, setQuery] = React.useState("")

  return (
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
  )
}
