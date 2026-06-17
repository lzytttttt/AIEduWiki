"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TocHeading[]
  className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            return
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    )

    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside
      className={cn(
        "hidden xl:block w-[280px] shrink-0",
        "sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
        className
      )}
    >
      <nav className="p-4 pl-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          目录
        </p>
        <ul className="space-y-1 border-l">
          {headings
            .filter((h) => h.level === 2 || h.level === 3)
            .map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block border-l-2 py-1 text-sm transition-colors",
                    heading.level === 3 ? "pl-6" : "pl-3",
                    activeId === heading.id
                      ? "border-primary font-medium text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  )
}
