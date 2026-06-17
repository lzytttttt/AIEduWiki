'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface WikiLinkProps {
  href: string
  label: string
  broken?: boolean
  children?: React.ReactNode
}

export function WikiLink({ href, label, broken, children }: WikiLinkProps) {
  const [showPreview, setShowPreview] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const displayText = children && typeof children === 'string' ? children : label

  const handleMouseEnter = () => {
    if (broken) return
    timeoutRef.current = setTimeout(() => setShowPreview(true), 400)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowPreview(false)
  }

  React.useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  if (broken) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-muted-foreground',
          'border-b border-dashed border-muted-foreground/40',
          'cursor-not-allowed opacity-60',
        )}
        title={`未找到页面: ${label}`}
      >
        <svg
          className="inline h-3.5 w-3.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="line-through decoration-dotted">{displayText}</span>
      </span>
    )
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={cn(
          'font-medium text-primary underline decoration-primary/30',
          'underline-offset-2 transition-colors',
          'hover:text-accent hover:decoration-accent/50',
        )}
      >
        {displayText}
      </Link>

      {showPreview && (
        <span
          className={cn(
            'absolute bottom-full left-1/2 z-50 -translate-x-1/2 mb-2',
            'w-64 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg',
            'animate-in fade-in-0 zoom-in-95',
            'pointer-events-none',
          )}
        >
          <span className="block text-sm font-semibold text-primary">
            {label}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground line-clamp-2">
            加载预览中…
          </span>
          <span
            className={cn(
              'absolute left-1/2 top-full -translate-x-1/2',
              'border-4 border-transparent border-t-popover',
            )}
          />
        </span>
      )}
    </span>
  )
}
