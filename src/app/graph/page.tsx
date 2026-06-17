import type { Metadata } from "next"
import { GraphPage } from "@/components/graph/GraphPage"

export const metadata: Metadata = {
  title: "知识图谱",
  description: "AI 教育领域知识关系图谱，可视化概念、产品、趋势之间的关联",
}

export default function GraphPageServer() {
  return <GraphPage />
}
