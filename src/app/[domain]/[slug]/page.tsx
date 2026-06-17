import type { Metadata } from "next"
import fs from "fs/promises"
import path from "path"
import { notFound } from "next/navigation"
import {
  getDomains,
  getContentFiles,
  getContentByDomain,
  getContentBySlug,
  DOMAIN_DISPLAY,
} from "@/lib/content"
import type { Domain, ContentSummary } from "@/lib/content"
import { compileContent } from "@/lib/mdx"
import type { Frontmatter } from "@/lib/frontmatter"
import { PageLayout } from "@/components/layout/PageLayout"
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { Comments } from "@/components/content/Comments"
import { FavoriteToggle } from "@/components/user/Favorites"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag, ExternalLink } from "lucide-react"

/* ── helpers ─────────────────────────────────────────────────────── */

const VALID_DOMAINS = new Set(getDomains())
const CONTENT_ROOT = path.join(process.cwd(), "content")

function isValidDomain(d: string): d is Domain {
  return VALID_DOMAINS.has(d as Domain)
}

/** Minimal slugify matching rehype-slug's github-slugify behaviour. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Extract h2/h3 headings from raw MDX source for TOC. */
function extractHeadings(source: string) {
  const headings: { id: string; text: string; level: number }[] = []
  for (const line of source.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+)$/)
    if (m) {
      const level = m[1].length
      const text = m[2].replace(/[*_`\[\]]/g, "").trim()
      headings.push({ id: slugify(text), text, level })
    }
  }
  return headings
}

/** Read raw MDX file. */
async function readRaw(domain: string, slug: string): Promise<string> {
  return fs.readFile(path.join(CONTENT_ROOT, domain, `${slug}.mdx`), "utf-8")
}

/* ── static params ───────────────────────────────────────────────── */

export async function generateStaticParams() {
  const params: { domain: string; slug: string }[] = []
  for (const domain of getDomains()) {
    const slugs = await getContentFiles(domain)
    for (const slug of slugs) {
      params.push({ domain, slug })
    }
  }
  return params
}

/* ── metadata ────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string }
}): Promise<Metadata> {
  const { domain } = params
  const slug = decodeURIComponent(params.slug)
  if (!isValidDomain(domain)) return {}
  try {
    const { frontmatter } = await getContentBySlug(domain, slug)
    return {
      title: frontmatter.title,
      description: frontmatter.tags?.join(", "),
      openGraph: {
        title: `${frontmatter.title} | AIEduWiki`,
        description: frontmatter.tags?.join(", "),
        type: "article",
        publishedTime: frontmatter.created,
        modifiedTime: frontmatter.updated,
        tags: frontmatter.tags,
      },
    }
  } catch {
    return {}
  }
}

/* ── page ────────────────────────────────────────────────────────── */

export default async function ContentPage({
  params,
}: {
  params: { domain: string; slug: string }
}) {
  const { domain } = params
  const slug = decodeURIComponent(params.slug)
  if (!isValidDomain(domain)) notFound()

  /* raw source for headings + compile */
  let raw: string
  try {
    raw = await readRaw(domain, slug)
  } catch {
    notFound()
  }

  /* compile MDX */
  let content: React.ReactNode
  let frontmatter: Frontmatter
  let readingTime: { text: string; minutes: number }
  try {
    const compiled = await compileContent(raw)
    content = compiled.content
    frontmatter = compiled.frontmatter
    readingTime = compiled.readingTime
  } catch {
    notFound()
  }
  /* sidebar: all pages in this domain */
  const domainPages: ContentSummary[] = await getContentByDomain(domain)
  const sidebar = [
    {
      title: DOMAIN_DISPLAY[domain],
      items: domainPages.map((p) => ({
        title: p.frontmatter.title,
        href: `/${domain}/${p.slug}`,
        active: p.slug === slug,
      })),
    },
  ]

  /* toc */
  const toc = extractHeadings(raw)

  /* breadcrumb */
  const breadcrumbItems = [
    { label: DOMAIN_DISPLAY[domain], href: `/${domain}` },
    { label: frontmatter.title },
  ]

  return (
    <PageLayout sidebar={sidebar} toc={toc}>
      <article className="mx-auto max-w-3xl">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* frontmatter header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {frontmatter.title}
            </h1>
            <FavoriteToggle slug={slug} domain={domain} className="shrink-0 mt-1" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {frontmatter.created && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                创建: {frontmatter.created}
              </span>
            )}
            {frontmatter.updated && frontmatter.updated !== frontmatter.created && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                更新: {frontmatter.updated}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime.text}
            </span>
          </div>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {frontmatter.sources && frontmatter.sources.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
              {frontmatter.sources.map((src) => (
                <span key={src} className="truncate max-w-[200px]">
                  {src}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* MDX content */}
        <div className="prose-aieduwiki">{content}</div>

        {/* comments */}
        <Comments />
      </article>
    </PageLayout>
  )
}
