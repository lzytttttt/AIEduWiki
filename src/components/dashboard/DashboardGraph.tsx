"use client"

import { useEffect, useState } from "react"
import type { GraphData } from "@/components/graph/KnowledgeGraph"
import { MiniGraph } from "@/components/graph/MiniGraph"
import { Network, ArrowRight } from "lucide-react"
import Link from "next/link"

export function DashboardGraph() {
  const [data, setData] = useState<GraphData | null>(null)

  useEffect(() => {
    fetch("/graph.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: GraphData | null) => {
        if (d) setData(d)
      })
      .catch(() => {})
  }, [])

  if (!data) {
    return (
      <div className="flex h-full flex-col rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">知识图谱</h2>
          <p className="text-sm text-muted-foreground">概念与实体关系网络</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Network className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">交互式知识图谱</p>
            <p className="mt-1 text-xs text-muted-foreground">
              探索 AI 教育领域中概念、产品、趋势之间的关联关系
            </p>
          </div>
          <Link
            href="/graph"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
          >
            查看完整图谱
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return <MiniGraph data={data} maxNodes={20} height={360} />
}
