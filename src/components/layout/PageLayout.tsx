"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar, type SidebarSection } from "./Sidebar"
import { TableOfContents, type TocHeading } from "./TableOfContents"
import { Menu } from "lucide-react"

interface PageLayoutProps {
  children: React.ReactNode
  sidebar?: SidebarSection[]
  toc?: TocHeading[]
  className?: string
}

export function PageLayout({ children, sidebar, toc, className }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const hasSidebar = sidebar && sidebar.length > 0

  return (
    <div className="mx-auto flex max-w-screen-2xl">
      {/* Desktop sidebar */}
      {hasSidebar && <Sidebar sections={sidebar} />}

      {/* Mobile sidebar drawer */}
      {hasSidebar && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 left-4 z-40 lg:hidden shadow-lg rounded-full h-10 w-10"
              aria-label="打开侧边栏"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4 pb-0">
              <SheetTitle className="text-sm text-muted-foreground">导航</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto">
              <Sidebar sections={sidebar} mobile />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <main
        className={cn(
          "min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8",
          className
        )}
      >
        {children}
      </main>

      {/* Desktop TOC */}
      {toc && toc.length > 0 && <TableOfContents headings={toc} />}
    </div>
  )
}
