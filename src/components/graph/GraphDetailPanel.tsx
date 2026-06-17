"use client"

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { GraphNode, GraphData } from "./KnowledgeGraph"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ExternalLink, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

/* ── helpers ───────────────────────────────────────────────────────── */

const TYPE_LABELS: Record<string, string> = {
  concept: "概念",
  entity: "实体",
  paper: "论文",
  timeline: "时间线",
  tutorial: "教程",
  comparison: "对比",
  controversy: "争议",
}

function pathToHref(filePath: string): string | null {
  const match = filePath.match(/^([^/]+)\/(.+?)\.mdx?$/)
  if (!match) return null
  return `/${match[1]}/${match[2]}`
}

/* ── component ─────────────────────────────────────────────────────── */

interface GraphDetailPanelProps {
  node: GraphNode | null
  data: GraphData
  onClose: () => void
  onSelectNode: (node: GraphNode) => void
}

export function GraphDetailPanel({
  node,
  data,
  onClose,
  onSelectNode,
}: GraphDetailPanelProps) {
  const router = useRouter()

  const relatedNodes = useMemo(() => {
    if (!node) return []
    const related: GraphNode[] = []
    for (const edge of data.edges) {
      if (edge.from === node.id) {
        const target = data.nodes.find((n) => n.id === edge.to)
        if (target) related.push(target)
      } else if (edge.to === node.id) {
        const source = data.nodes.find((n) => n.id === edge.from)
        if (source) related.push(source)
      }
    }
    // Deduplicate
    const seen = new Set<string>()
    return related.filter((n) => {
      if (seen.has(n.id)) return false
      seen.add(n.id)
      return true
    })
  }, [node, data])

  const handleNavigate = useCallback(() => {
    if (!node) return
    const href = pathToHref(node.path)
    if (href) router.push(href)
  }, [node, router])

  const handleRelatedClick = useCallback(
    (related: GraphNode) => {
      onSelectNode(related)
    },
    [onSelectNode],
  )

  return (
    <div
      className={cn(
        "pointer-events-auto absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-border bg-background/95 shadow-xl backdrop-blur-sm transition-transform duration-300",
        node ? "translate-x-0" : "translate-x-full",
      )}
    >
      {node && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border p-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold leading-tight">
                {node.label}
              </h3>
              <Badge
                variant="secondary"
                className="mt-1.5"
                style={{
                  backgroundColor: node.color + "22",
                  color: node.color,
                  borderColor: node.color + "44",
                }}
              >
                {TYPE_LABELS[node.type] || node.type}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="ml-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Stats */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border p-2 text-center">
                <div className="text-lg font-bold text-primary">
                  {node.edges || 0}
                </div>
                <div className="text-xs text-muted-foreground">关联数</div>
              </div>
              <div className="rounded-md border border-border p-2 text-center">
                <div className="text-lg font-bold text-primary">
                  {relatedNodes.length}
                </div>
                <div className="text-xs text-muted-foreground">相关节点</div>
              </div>
            </div>

            {/* Go to page button */}
            {pathToHref(node.path) && (
              <Button
                onClick={handleNavigate}
                className="mb-4 w-full"
                size="sm"
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                查看详情页面
              </Button>
            )}

            {/* Related nodes */}
            {relatedNodes.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                  相关节点
                </h4>
                <div className="flex flex-col gap-1">
                  {relatedNodes.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => handleRelatedClick(related)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: related.color }}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {related.label}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
