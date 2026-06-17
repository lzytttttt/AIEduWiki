export interface ContentFrontmatter {
  title: string
  created: string
  updated: string
  type: 'entity' | 'concept' | 'comparison' | 'query' | 'summary' | 'timeline' | 'tutorial' | 'controversy'
  tags: string[]
  sources: string[]
}

export interface ContentPage {
  slug: string
  domain: string
  frontmatter: ContentFrontmatter
  content: string
}

export interface GraphNode {
  id: string
  label: string
  type: string
  color: string
  path: string
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
    totalNodes: number
    totalEdges: number
    nodeTypes: Record<string, number>
  }
}
