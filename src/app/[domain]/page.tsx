import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getDomains,
  getContentByDomain,
  DOMAIN_DISPLAY,
  DOMAIN_DESCRIPTIONS,
} from "@/lib/content"
import type { Domain } from "@/lib/content"
import { ConceptCard } from "@/components/content/ConceptCard"
import { Badge } from "@/components/ui/badge"

interface DomainPageProps {
  params: { domain: string }
}

const VALID_DOMAINS = new Set(getDomains())

function isValidDomain(d: string): d is Domain {
  return VALID_DOMAINS.has(d as Domain)
}

export function generateStaticParams() {
  return getDomains().map((domain) => ({ domain }))
}

export async function generateMetadata({
  params,
}: DomainPageProps): Promise<Metadata> {
  const { domain } = params
  if (!isValidDomain(domain)) return {}
  return {
    title: DOMAIN_DISPLAY[domain],
    description: DOMAIN_DESCRIPTIONS[domain],
    openGraph: {
      title: `${DOMAIN_DISPLAY[domain]} | AIEduWiki`,
      description: DOMAIN_DESCRIPTIONS[domain],
    },
  }
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { domain } = params
  if (!isValidDomain(domain)) notFound()

  const pages = await getContentByDomain(domain)

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <Badge variant="outline" className="mb-3">
          {domain}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {DOMAIN_DISPLAY[domain]}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {DOMAIN_DESCRIPTIONS[domain]}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {pages.length} 篇内容
        </p>
      </header>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <ConceptCard
            key={page.slug}
            title={page.frontmatter.title || page.slug}
            description={page.frontmatter.tags?.join(" / ")}
            tags={page.frontmatter.tags}
            href={`/${domain}/${page.slug}`}
          />
        ))}
      </div>

      {pages.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          暂无内容
        </div>
      )}
    </div>
  )
}
