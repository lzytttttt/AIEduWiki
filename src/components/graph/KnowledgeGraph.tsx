"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { MutableRefObject } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

const ForceGraph2D = dynamic(() => import("react-force-graph-2d").then((m) => m.default), {
  ssr: false,
})

/* ── types ─────────────────────────────────────────────────────────── */

export interface GraphNode {
  id: string
  label: string
  type: string
  color: string
  path: string
  edges?: number
  x?: number
  y?: number
}

export interface GraphEdge {
  from: string
  to: string
  type: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  stats: {
    total_nodes: number
    total_edges: number
    node_types: Record<string, number>
  }
}

interface ForceGraphRef {
  zoom: (scale?: number, durationMs?: number) => unknown
  centerAt: (x?: number, y?: number, durationMs?: number) => unknown
  zoomToFit: (durationMs?: number, padding?: number) => unknown
}

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

/** Derive a navigable route from a content path like `insights/2020.mdx`. */
function pathToHref(filePath: string): string | null {
  const match = filePath.match(/^([^/]+)\/(.+?)\.mdx?$/)
  if (!match) return null
  return `/${match[1]}/${match[2]}`
}

/* ── component ─────────────────────────────────────────────────────── */

interface KnowledgeGraphProps {
  data: GraphData
  hiddenTypes?: Set<string>
  focusNodeId?: string | null
  onNodeClick?: (node: GraphNode) => void
  onNodeHover?: (node: GraphNode | null) => void
  graphRef?: MutableRefObject<ForceGraphRef | null>
}

export function KnowledgeGraph({
  data,
  hiddenTypes,
  focusNodeId,
  onNodeClick,
  onNodeHover,
  graphRef,
}: KnowledgeGraphProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setDimensions({ width, height })
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Focus on a node when focusNodeId changes
  useEffect(() => {
    if (!focusNodeId || !graphRef?.current) return
    const node = data.nodes.find((n) => n.id === focusNodeId)
    if (node) {
      graphRef.current.centerAt(node.x ?? 0, node.y ?? 0, 800)
      graphRef.current.zoom(3, 800)
    }
  }, [focusNodeId, data.nodes, graphRef])

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (onNodeClick) {
        onNodeClick(node)
      } else {
        const href = pathToHref(node.path)
        if (href) router.push(href)
      }
    },
    [onNodeClick, router],
  )

  const nodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.label
      const fontSize = 12 / globalScale
      const color = NODE_COLORS[node.type] || node.color || "#9ca3af"
      const radius = Math.max(4, Math.min(12, 3 + (node.edges || 0) * 1.2))

      // Circle
      ctx.beginPath()
      ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      // Border
      ctx.strokeStyle = "rgba(255,255,255,0.6)"
      ctx.lineWidth = 1 / globalScale
      ctx.stroke()

      // Label (only when zoomed in enough)
      if (globalScale > 1.5) {
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.font = `${fontSize}px sans-serif`
        ctx.fillStyle = "rgba(255,255,255,0.9)"
        ctx.fillText(label, node.x ?? 0, (node.y ?? 0) + radius + 2)
      }
    },
    [],
  )

  const nodePointerAreaPaint = useCallback(
    (node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
      const radius = Math.max(4, Math.min(12, 3 + (node.edges || 0) * 1.2))
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(node.x ?? 0, node.y ?? 0, radius + 2, 0, 2 * Math.PI)
      ctx.fill()
    },
    [],
  )

  // Filter graph data by hidden types
  const visibleNodes = hiddenTypes
    ? data.nodes.filter((n) => !hiddenTypes.has(n.type))
    : data.nodes
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id))
  const filteredData = {
    nodes: visibleNodes,
    links: data.edges
      .filter((e) => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to))
      .map((e) => ({
        source: e.from,
        target: e.to,
        type: e.type,
      })),
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <ForceGraph2D
        ref={graphRef as never}
        graphData={filteredData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="transparent"
        nodeColor={(n: any) => NODE_COLORS[n.type] || n.color || "#9ca3af"}
        nodeVal={(n: any) => Math.max(4, (n.edges || 0) * 2)}
        nodeCanvasObject={nodeCanvasObject as any}
        nodePointerAreaPaint={nodePointerAreaPaint as any}
        nodeLabel={(n: any) =>
          `<div style="background:rgba(0,0,0,0.85);color:#fff;padding:6px 10px;border-radius:6px;font-size:13px;max-width:220px;">
            <strong>${n.label}</strong><br/>
            <span style="opacity:0.7;font-size:11px;">${n.type}</span>
          </div>`
        }
        linkColor={() => "rgba(255,255,255,0.15)"}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.1}
        onNodeClick={handleNodeClick as any}
        onNodeHover={(node: any) => onNodeHover?.(node)}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  )
}
