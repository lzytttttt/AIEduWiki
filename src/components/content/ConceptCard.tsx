import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ConceptCardProps {
  title: string
  description?: string
  tags?: string[]
  href?: string
  className?: string
}

export function ConceptCard({
  title,
  description,
  tags = [],
  href,
  className,
}: ConceptCardProps) {
  const inner = (
    <>
      <h3
        className={cn(
          'text-base font-bold text-primary pb-2 mb-3',
          'border-b-2 border-primary/20',
        )}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium',
                'bg-primary text-primary-foreground',
                'transition-colors hover:bg-accent',
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  )

  const cardClasses = cn(
    'concept-card flex flex-col',
    'bg-card border border-border rounded-[var(--radius)] p-5',
    'shadow-sm transition-all duration-200',
    'hover:-translate-y-1 hover:shadow-md',
    'dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
    'dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]',
    href && 'cursor-pointer',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={cn(cardClasses, 'no-underline')}>
        {inner}
      </Link>
    )
  }

  return <div className={cardClasses}>{inner}</div>
}
