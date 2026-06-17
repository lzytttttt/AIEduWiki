"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { MutableRefObject } from "react"
import { KnowledgeGraph } from "./KnowledgeGraph"
import type { GraphData, GraphNode } from "./KnowledgeGraph"
import { GraphControls } from "./GraphControls"
import { GraphDetailPanel } from "./GraphDetailPanel"
import { Loader2, Network } from "lucide-react"

/* ── types ─────────────────────────────────────────────────────────── */

interface ForceGraphRef {
  zoom: (scale?: number, durationMs?: number) => unknown
  centerAt: (x?: number, y?: number, durationMs?: number) => unknown
  zoomToFit: (durationMs?: number, padding?: number) => unknown
}

/* ── component ─────────────────────────────────────────────────────── */

export function GraphPage() {
  const [data, setData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set())
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const graphRef = useRef<ForceGraphRef | null>(null)

  // Load graph data
  useEffect(() => {
    fetch("/graph.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((d: GraphData) => {
        setData(d)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleToggleType = useCallback((type: string) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }, [])

  const handleFocusNode = useCallback((nodeId: string | null) => {
    setFocusNodeId(nodeId)
  }, [])

  const handleResetZoom = useCallback(() => {
    graphRef.current?.zoomToFit(600, 40)
  }, [])

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
  }, [])

  const handleNodeHover = useCallback((_node: GraphNode | null) => {
    // Hover handled by react-force-graph's nodeLabel
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleSelectFromPanel = useCallback((node: GraphNode) => {
    setSelectedNode(node)
    setFocusNodeId(node.id)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Network className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>正在加载知识图谱...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">加载失败</p>
          <p className="mt-1 text-sm text-muted-foreground">{error || "无法加载图谱数据"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Graph canvas */}
      <KnowledgeGraph
        data={data}
        hiddenTypes={hiddenTypes}
        focusNodeId={focusNodeId}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        graphRef={graphRef as MutableRefObject<ForceGraphRef | null>}
      />

      {/* Controls overlay */}
      <GraphControls
        data={data}
        hiddenTypes={hiddenTypes}
        onToggleType={handleToggleType}
        onFocusNode={handleFocusNode}
        onResetZoom={handleResetZoom}
      />

      {/* Detail panel */}
      <GraphDetailPanel
        node={selectedNode}
        data={data}
        onClose={handleClosePanel}
        onSelectNode={handleSelectFromPanel}
      />

      {/* Stats bar */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-lg border border-border/50 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
        <span>{data.stats.total_nodes} 节点</span>
        <span className="text-border">|</span>
        <span>{data.stats.total_edges} 关系</span>
      </div>
    </div>
  )
}
