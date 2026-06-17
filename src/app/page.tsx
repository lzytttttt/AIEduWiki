import Link from "next/link"
import { Search, Network, BookOpen, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllContent, getDomains, DOMAIN_DISPLAY, type Domain } from "@/lib/content"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { CategoryCards } from "@/components/dashboard/CategoryCards"
import { RecentUpdates } from "@/components/dashboard/RecentUpdates"
import { DashboardGraph } from "@/components/dashboard/DashboardGraph"
import contentIndex from "../../content/index.json"

export const revalidate = false // static at build time

function isTagType(tags: string[], type: string): boolean {
  return tags.some((t) => String(t).toLowerCase().includes(type))
}

export default async function HomePage() {
  const allContent = await getAllContent()
  const domains = getDomains()

  // Domain counts from index.json (reliable, no fs reads needed)
  const domainCounts: Record<Domain, number> = {
    theory: contentIndex.theory.length,
    technology: contentIndex.technology.length,
    products: contentIndex.products.length,
    insights: contentIndex.insights.length,
  }

  // Stats from actual content (has frontmatter with tags)
  const totalPages = allContent.length
  const concepts = allContent.filter(
    (c) => c.frontmatter.type === "concept"
  ).length
  const entities = allContent.filter(
    (c) => c.frontmatter.type === "entity"
  ).length
  const tutorials = allContent.filter(
    (c) =>
      c.frontmatter.type === "tutorial" ||
      isTagType(c.frontmatter.tags, "tutorial")
  ).length
  const comparisons = allContent.filter(
    (c) =>
      c.frontmatter.type === "comparison" ||
      isTagType(c.frontmatter.tags, "comparison")
  ).length
  const controversies = allContent.filter(
    (c) =>
      c.frontmatter.type === "controversy" ||
      isTagType(c.frontmatter.tags, "controversy")
  ).length
  const timelines = allContent.filter(
    (c) =>
      c.frontmatter.type === "timeline" ||
      isTagType(c.frontmatter.tags, "timeline")
  ).length

  // Recent updates: sort by updated date descending, take 10
  const recentUpdates = allContent
    .filter((c) => c.frontmatter.updated)
    .sort((a, b) => b.frontmatter.updated.localeCompare(a.frontmatter.updated))
    .slice(0, 10)
    .map((c) => ({
      slug: c.slug,
      domain: c.domain as Domain,
      title: c.frontmatter.title,
      updated: c.frontmatter.updated,
    }))

  const stats = {
    totalPages,
    concepts,
    entities,
    tutorials,
    comparisons,
    controversies,
    timelines,
  }

  const QUICK_LINKS = [
    { href: "/theory/知识追踪", label: "知识追踪" },
    { href: "/theory/自适应学习系统", label: "自适应学习系统" },
    { href: "/products/Khan-Academy", label: "Khan Academy" },
    { href: "/products/Squirrel-AI", label: "松鼠 AI" },
    { href: "/insights/2026", label: "2026 年趋势" },
    { href: "/technology/教学智能体", label: "教学智能体" },
  ]

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 lg:px-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI+教育知识库
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          探索人工智能在教育领域的理论、技术、产品与前沿趋势
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              搜索知识库
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/graph">
              <Network className="mr-2 h-4 w-4" />
              知识图谱
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-10">
        <StatsCards stats={stats} />
      </section>

      {/* Domain Cards */}
      <section className="mb-10">
        <h2 className="mb-5 text-xl font-semibold">知识领域</h2>
        <CategoryCards counts={domainCounts} />
      </section>

      {/* Two-column: Recent Updates + Mini Graph */}
      <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentUpdates updates={recentUpdates} />
        </div>
        <div className="lg:col-span-2">
          <DashboardGraph />
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-8">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">快速入口</h2>
          <div className="flex flex-wrap gap-3">
            {QUICK_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/40 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                <BookOpen className="h-3.5 w-3.5" />
                {label}
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
