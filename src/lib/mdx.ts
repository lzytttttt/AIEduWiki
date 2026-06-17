import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { remarkWikilinks } from './remark-wikilinks'
import { preprocessAdmonitions } from './remark-admonitions'
import { parseFrontmatter } from './frontmatter'
import type { Frontmatter } from './frontmatter'
import { mdxComponents } from '@/components/content/mdx-components'

interface CompileOptions {
  titleMap?: Map<string, string>
}

export async function compileContent(
  source: string,
  options: CompileOptions = {},
) {
  // 1. Extract frontmatter
  const { frontmatter, content, readingTime } = parseFrontmatter(source)

  // 2. Pre-process admonitions (before MDX parsing)
  const processed = preprocessAdmonitions(content)

  // 3. Compile MDX with remark/rehype plugins
  const { content: compiled } = await compileMDX({
    source: processed,
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkWikilinks, { titleMap: options.titleMap ?? new Map() }],
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ],
      },
    },
    components: mdxComponents,
  })

  return { content: compiled, frontmatter: frontmatter as Frontmatter, readingTime }
}
