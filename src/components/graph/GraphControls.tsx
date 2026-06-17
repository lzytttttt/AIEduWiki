"use client"

import { useState, useCallback } from "react"
import type { GraphNode, GraphData } from "./KnowledgeGraph"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, RotateCcw, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

/* ── constants ─────────────────────────────────────────────────────── */

const NODE_TYPE_CONFIG: { type: string; label: string; color: string }[] = [
  { type: "concept", label: "概念", color: "#3b82f6" },
  { type: "entity", label: "实体", color: "#22c55e" },
  { type: "paper", label: "论文", color: "#9ca3af" },
  { type: "timeline", label: "时间线", color: "#f97316" },
  { type: "tutorial", label: "教程", color: "#a855f7" },
  { type: "comparison", label: "对比", color: "#ef4444" },
  { type: "controversy", label: "争议", color: "#ec4899" },
]

/* ── component ─────────────────────────────────────────────────────── */

interface GraphControlsProps {
  data: GraphData
  hiddenTypes: Set<string>
  onToggleType: (type: string) => void
  onFocusNode: (nodeId: string | null) => void
  onResetZoom: () => void
}

export function GraphControls({
  data,
  hiddenTypes,
  onToggleType,
  onFocusNode,
  onResetZoom,
}: GraphControlsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(true)

  const matchingNodes =
    searchQuery.length > 0
      ? data.nodes
          .filter((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 8)
      : []

  const handleSearchSelect = useCallback(
    (node: GraphNode) => {
      onFocusNode(node.id)
      setSearchQuery("")
    },
    [onFocusNode],
  )

  // Count visible node types
  const visibleCount = data.nodes.filter((n) => !hiddenTypes.has(n.type)).length

  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-10 flex flex-col gap-3">
      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索节点..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-border/50 bg-background/90 pl-9 backdrop-blur-sm"
        />
        {matchingNodes.length > 0 && (
          <div className="absolute top-full z-20 mt-1 w-full rounded-md border border-border bg-background shadow-lg">
            {matchingNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => handleSearchSelect(node)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
                <span className="flex-1 truncate">{node.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {node.type}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((v) => !v)}
          className="bg-background/90 backdrop-blur-sm"
        >
          <Filter className="mr-1.5 h-3.5 w-3.5" />
          筛选
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetZoom}
          className="bg-background/90 backdrop-blur-sm"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          重置
        </Button>
        <span className="text-xs text-muted-foreground">
          {visibleCount}/{data.nodes.length} 节点
        </span>
      </div>

      {/* Type filter checkboxes */}
      {showFilters && (
        <div className="rounded-lg border border-border/50 bg-background/90 p-3 backdrop-blur-sm">
          <div className="flex flex-col gap-1.5">
            {NODE_TYPE_CONFIG.map(({ type, label, color }) => {
              const count = data.nodes.filter((n) => n.type === type).length
              if (count === 0) return null
              const isHidden = hiddenTypes.has(type)
              return (
                <label
                  key={type}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm transition-colors hover:bg-muted",
                    isHidden && "opacity-50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={!isHidden}
                    onChange={() => onToggleType(type)}
                    className="h-3.5 w-3.5 rounded border-border accent-current"
                    style={{ accentColor: color }}
                  />
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-1">{label}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
