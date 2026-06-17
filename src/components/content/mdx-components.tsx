import * as React from 'react'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { WikiLink } from './WikiLink'
import { Admonition } from './Admonition'
import { ConceptCard } from './ConceptCard'
import { CodeBlock } from './CodeBlock'
import { DataTable, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from './DataTable'
import { Comments } from './Comments'
import { cn } from '@/lib/utils'

/**
 * MDX component overrides.
 *
 * Passed to `compileMDX({ components })` in mdx.ts and to `<MDXProvider>` in
 * any client-side rendering path.
 *
 * Custom remark-generated JSX elements (WikiLink, Admonition, ConceptCard)
 * are registered by name so the remark plugins can emit them as inline JSX.
 * Standard HTML elements are overridden to inject Tailwind prose styles.
 */
export const mdxComponents: MDXComponents = {
  // ── Remark-generated JSX elements ──────────────────────────────
  WikiLink,
  Admonition,
  ConceptCard,
  Comments,

  // ── HTML element overrides ─────────────────────────────────────
  a: ({ href, children, ...props }) => {
    if (href?.startsWith('/') || href?.startsWith('#')) {
      return (
        <Link
          href={href}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent/50"
          {...props}
        >
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent/50"
        {...props}
      >
        {children}
      </a>
    )
  },

  h2: ({ children, ...props }) => (
    <h2
      className="text-primary font-bold text-[1.5rem] mt-10 mb-4 pb-2 border-b-2 border-primary/20"
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3
      className="text-[1.25rem] font-semibold mt-8 mb-3 text-foreground"
      {...props}
    >
      {children}
    </h3>
  ),

  hr: ({ ...props }) => (
    <hr
      className="border-none h-px my-10"
      style={{
        background: 'linear-gradient(to right, transparent, hsl(var(--border)), transparent)',
      }}
      {...props}
    />
  ),

  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary/40 bg-muted px-5 py-4 my-6 rounded-r-[var(--radius)] text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Inline code (not inside <pre>)
  code: ({ children, className, ...props }) => {
    // If inside a pre, the CodeBlock wrapper handles it
    if (className?.includes('language-')) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code
        className="bg-muted px-1.5 py-0.5 rounded text-[0.875em] font-medium"
        {...props}
      >
        {children}
      </code>
    )
  },

  pre: ({ children, ...props }) => {
    return <CodeBlock {...props}>{children}</CodeBlock>
  },

  // ── Table overrides ────────────────────────────────────────────
  table: ({ children, ...props }) => (
    <DataTable {...props}>{children}</DataTable>
  ),

  thead: ({ children, ...props }) => (
    <TableHeader {...props}>{children}</TableHeader>
  ),

  tbody: ({ children, ...props }) => (
    <TableBody {...props}>{children}</TableBody>
  ),

  tr: ({ children, ...props }) => (
    <TableRow {...props}>{children}</TableRow>
  ),

  th: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <TableHeadCell className={className}>{children}</TableHeadCell>
  ),

  td: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <TableCell className={className}>{children}</TableCell>
  ),

  img: ({ src, alt, ...props }) => (
    <img
      src={src}
      alt={alt ?? ''}
      className="rounded-[var(--radius)] my-6 mx-auto block"
      loading="lazy"
      {...props}
    />
  ),

  ul: ({ children, ...props }) => (
    <ul className="my-4 pl-6 list-disc space-y-1" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol className="my-4 pl-6 list-decimal space-y-1" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li className="text-sm leading-relaxed" {...props}>
      {children}
    </li>
  ),
}
