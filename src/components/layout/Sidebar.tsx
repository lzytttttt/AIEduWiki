"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SidebarItem {
  title: string
  href: string
  active?: boolean
}

export interface SidebarSection {
  title: string
  items: SidebarItem[]
}

interface SidebarProps {
  sections: SidebarSection[]
  mobile?: boolean
  className?: string
}

function SectionGroup({ title, items }: SidebarSection) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(true)

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted transition-colors"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            !open && "-rotate-90"
          )}
        />
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5">
          {items.map((item) => {
            const active = item.active ?? pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                    active
                      ? "bg-primary/5 font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function Sidebar({ sections, mobile = false, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        mobile
          ? "w-full"
          : "hidden lg:block w-60 shrink-0 border-r sticky top-16 h-[calc(100vh-4rem)]",
        "bg-background overflow-y-auto",
        className
      )}
    >
      <nav className="p-4">
        {sections.map((section) => (
          <SectionGroup key={section.title} {...section} />
        ))}
      </nav>
    </aside>
  )
}
