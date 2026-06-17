"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import type { GraphData, GraphNode } from "./KnowledgeGraph"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Network } from "lucide-react"

const ForceGraph2D = dynamic(() => import("react-force-graph-2d").then((m) => m.default), {
  ssr: false,
})

/* ── constants ─────────────────────────────────────────────────────── */

const NODE_COLORS: Record<string, string> = {
  concept: "#3b82f6",
  entity: "#22c55e",
  paper: "#9ca3af",
  timeline: "#f97316",
  tutorial: "#a855f7",
  comparison: "#ef4444",
  controversy: "#ec4899",
}

/* ── component ─────────────────────────────────────────────────────── */

interface MiniGraphProps {
  data: GraphData
  maxNodes?: number
  height?: number
}

export function MiniGraph({ data, maxNodes = 20, height = 360 }: MiniGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)

  // Responsive width
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width)
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Select top N most-connected nodes
  const topNodes = [...data.nodes]
    .sort((a, b) => (b.edges || 0) - (a.edges || 0))
    .slice(0, maxNodes)

  const topNodeIds = new Set(topNodes.map((n) => n.id))

  // Filter edges to only those between top nodes
  const filteredEdges = data.edges.filter(
    (e) => topNodeIds.has(e.from) && topNodeIds.has(e.to),
  )

  const miniData = {
    nodes: topNodes,
    links: filteredEdges.map((e) => ({ source: e.from, target: e.to })),
  }

  const nodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D) => {
      const radius = Math.max(3, Math.min(8, 2 + (node.edges || 0) * 0.8))
      const color = NODE_COLORS[node.type] || node.color || "#9ca3af"
      ctx.beginPath()
      ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()
    },
    [],
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="h-4 w-4 text-primary" />
          知识图谱预览
        </CardTitle>
        <Link
          href="/graph"
          className="text-xs font-medium text-primary hover:underline"
        >
          查看完整图谱 →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="overflow-hidden rounded-b-lg"
          style={{ height }}
        >
          <ForceGraph2D
            graphData={miniData}
            width={width}
            height={height}
            backgroundColor="transparent"
            nodeCanvasObject={nodeCanvasObject as any}
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
              const radius = Math.max(3, Math.min(8, 2 + (node.edges || 0) * 0.8))
              ctx.fillStyle = color
              ctx.beginPath()
              ctx.arc(node.x ?? 0, node.y ?? 0, radius + 2, 0, 2 * Math.PI)
              ctx.fill()
            }}
            linkColor={() => "rgba(255,255,255,0.1)"}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            enableZoomInteraction={false}
            enablePanInteraction={false}
            enableNodeDrag={false}
            cooldownTicks={50}
          />
        </div>
      </CardContent>
    </Card>
  )
}
