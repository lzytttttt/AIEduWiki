import type { MetadataRoute } from "next"
import { getDomains, getAllContent } from "@/lib/content"

const BASE_URL = "https://aieduwiki.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domains = getDomains()
  const allContent = await getAllContent()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...domains.map((domain) => ({
      url: `${BASE_URL}/${domain}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${BASE_URL}/graph`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  const contentPages: MetadataRoute.Sitemap = allContent.map((page) => ({
    url: `${BASE_URL}/${page.domain}/${encodeURIComponent(page.slug)}`,
    lastModified: page.frontmatter.updated
      ? new Date(page.frontmatter.updated)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...contentPages]
}
