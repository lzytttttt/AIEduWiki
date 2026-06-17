'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
  // From rehype-prism-plus or raw <pre> wrapper
  'data-language'?: string
  language?: string
  showLineNumbers?: boolean
  filename?: string
}

export function CodeBlock({
  children,
  className,
  'data-language': dataLanguage,
  language,
  showLineNumbers = false,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  // Extract language from className (rehype-prism adds language-xxx)
  const langMatch = className?.match(/language-(\w+)/)
  const lang = language ?? dataLanguage ?? langMatch?.[1] ?? ''

  // Extract raw text for copy
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    if (!node || typeof node !== 'object') return ''
    if ('props' in node) {
      const props = node.props as Record<string, unknown>
      return getTextContent(props.children as React.ReactNode)
    }
    return ''
  }

  const handleCopy = async () => {
    const codeEl = document.querySelector<HTMLElement>('[data-code-content]')
    const text = codeEl?.textContent ?? getTextContent(children)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // If this is wrapping a <pre> that already has children (from rehype-prism),
  // just pass through with our wrapper
  const childArray = React.Children.toArray(children)
  const hasPreChild = childArray.some(
    (c) => React.isValidElement(c) && c.type === 'pre',
  )

  if (hasPreChild) {
    return (
      <div className="group relative my-6">
        {lang && (
          <span
            className={cn(
              'absolute top-3 left-4 z-10',
              'rounded bg-white/10 px-2 py-0.5 text-xs text-white/60',
              'font-mono uppercase tracking-wider',
            )}
          >
            {lang}
          </span>
        )}
        <button
          onClick={handleCopy}
          className={cn(
            'absolute top-3 right-3 z-10',
            'rounded bg-white/10 px-2 py-1 text-xs text-white/60',
            'opacity-0 transition-opacity group-hover:opacity-100',
            'hover:bg-white/20 hover:text-white/90',
            'focus:outline-none focus:ring-2 focus:ring-white/30',
          )}
          aria-label="复制代码"
        >
          {copied ? '已复制 ✓' : '复制'}
        </button>
        {children}
      </div>
    )
  }

  // Standalone code block (used directly)
  return (
    <div className="group relative my-6 rounded-[var(--radius)] bg-[hsl(var(--foreground))] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        {lang ? (
          <span className="text-xs text-white/50 font-mono uppercase tracking-wider">
            {lang}
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={handleCopy}
          className={cn(
            'rounded bg-white/10 px-2 py-1 text-xs text-white/60',
            'transition-colors hover:bg-white/20 hover:text-white/90',
            'focus:outline-none focus:ring-2 focus:ring-white/30',
          )}
          aria-label="复制代码"
        >
          {copied ? '已复制 ✓' : '复制'}
        </button>
      </div>
      <pre
        className={cn(
          'overflow-x-auto p-4 text-sm leading-relaxed',
          'text-white/90 font-mono',
          showLineNumbers && 'pl-12',
        )}
      >
        <code data-code-content className={className}>
          {children}
        </code>
      </pre>
    </div>
  )
}
