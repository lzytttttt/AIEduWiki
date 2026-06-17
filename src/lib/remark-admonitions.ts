/**
 * Remark-style admonition processor.
 *
 * The `!!! type` / `??? type` syntax from MkDocs doesn't survive CommonMark
 * parsing cleanly (indented content becomes a code block).  We pre-process
 * the raw source string *before* it enters the MDX compiler so the resulting
 * `<Admonition>` JSX is parsed normally by @mdx-js/mdx.
 *
 * Usage in mdx.ts:
 *   const processed = preprocessAdmonitions(source)
 *   compileMDX({ source: processed, ... })
 */

const ADMONITION_RE = /^(\?\?\?|!!!)\s+(\w+)(?:\s+"([^"]*)")?\s*$/

export function preprocessAdmonitions(source: string): string {
  const lines = source.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const m = line.match(ADMONITION_RE)

    if (m) {
      const marker = m[1]
      const type = m[2]
      const title = m[3] ?? ''
      const collapsible = marker === '???'

      // Collect indented content (4-space indent)
      const contentLines: string[] = []
      i++
      while (i < lines.length) {
        const curr = lines[i]
        // Blank lines inside admonition are preserved
        if (curr.trim() === '') {
          contentLines.push('')
          i++
          continue
        }
        // Indented line → part of admonition body
        if (/^    /.test(curr)) {
          contentLines.push(curr.slice(4))
          i++
          continue
        }
        // Non-indented, non-blank → end of admonition
        break
      }

      // Trim trailing blanks
      while (contentLines.length > 0 && contentLines[contentLines.length - 1] === '') {
        contentLines.pop()
      }

      const attrs = [`type="${type}"`]
      if (title) attrs.push(`title="${title}"`)
      if (collapsible) attrs.push('collapsible')

      result.push(`<Admonition ${attrs.join(' ')}>`)
      result.push(contentLines.join('\n'))
      result.push('</Admonition>')
    } else {
      result.push(line)
      i++
    }
  }

  return result.join('\n')
}
