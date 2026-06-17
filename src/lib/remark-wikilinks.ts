import type { Plugin } from 'unified'
import type { Root, Text, PhrasingContent } from 'mdast'
import { visit } from 'unist-util-visit'

interface WikilinkOptions {
  titleMap?: Map<string, string>
}

const WIKILINK_RE = /\[\[([^\]]+?)\]\]/g

function resolveWikilink(
  target: string,
  titleMap: Map<string, string>,
): string | null {
  const lower = target.toLowerCase()
  // Exact match
  if (titleMap.has(lower)) return titleMap.get(lower)!
  // Fuzzy: substring match
  for (const [title, slug] of titleMap) {
    if (lower.includes(title) || title.includes(lower)) return slug
  }
  return null
}

function makeJsxElement(
  href: string,
  label: string,
  broken: boolean,
): PhrasingContent {
  return {
    type: 'mdxJsxTextElement',
    name: 'WikiLink',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'href', value: href },
      { type: 'mdxJsxAttribute', name: 'label', value: label },
      ...(broken
        ? [{ type: 'mdxJsxAttribute' as const, name: 'broken', value: null }]
        : []),
    ],
    children: [{ type: 'text', value: label }],
  } as unknown as PhrasingContent
}

export const remarkWikilinks: Plugin<[WikilinkOptions?], Root> = (
  options = {},
) => {
  const titleMap = options.titleMap ?? new Map<string, string>()

  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index == null) return
      const value = node.value
      if (!value.includes('[[')) return

      const segments: PhrasingContent[] = []
      let lastIndex = 0
      let match: RegExpExecArray | null

      // Reset regex state
      WIKILINK_RE.lastIndex = 0
      while ((match = WIKILINK_RE.exec(value)) !== null) {
        // Text before the wikilink
        if (match.index > lastIndex) {
          segments.push({
            type: 'text',
            value: value.slice(lastIndex, match.index),
          })
        }

        const inner = match[1]
        const parts = inner.split('|', 2)
        const target = parts[0].trim()
        const display = parts.length > 1 ? parts[1].trim() : target

        const skipTargets: Record<string, true> = { wikilinks: true, wikilink: true, 'page-name': true }
        if (skipTargets[target.toLowerCase()]) {
          segments.push({ type: 'text', value: match[0] })
        } else {
          const slug = resolveWikilink(target, titleMap)
          if (slug) {
            segments.push(makeJsxElement(`/${slug}`, display, false))
          } else {
            // Broken link — render with broken attribute
            segments.push(makeJsxElement(`/search?q=${encodeURIComponent(target)}`, display, true))
          }
        }

        lastIndex = match.index + match[0].length
      }

      // Trailing text
      if (lastIndex < value.length) {
        segments.push({ type: 'text', value: value.slice(lastIndex) })
      }

      if (segments.length > 0) {
        parent.children.splice(index, 1, ...segments)
        return index + segments.length
      }
    })
  }
}
