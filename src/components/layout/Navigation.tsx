"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSearch } from "@/components/search/SearchProvider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { LoginButton } from "@/components/user/LoginButton"
import {
  BookOpen,
  Cpu,
  Building2,
  TrendingUp,
  Network,
  Search,
  Menu,
} from "lucide-react"

const DOMAIN_LINKS = [
  { href: "/theory", label: "学习理论", icon: BookOpen },
  { href: "/technology", label: "技术方法", icon: Cpu },
  { href: "/products", label: "产品与公司", icon: Building2 },
  { href: "/insights", label: "争议与趋势", icon: TrendingUp },
] as const

const SECONDARY_LINKS = [
  { href: "/graph", label: "知识图谱", icon: Network },
] as const

export function Navigation() {
  const pathname = usePathname()
  const { setOpen: setSearchOpen } = useSearch()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-background"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-screen-2xl items-center px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AIEduWiki
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {DOMAIN_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                isActive(href)
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Separator orientation="vertical" className="mx-1 h-5" />
          {SECONDARY_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                isActive(href)
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search trigger */}
        <Button
          variant="outline"
          className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-normal mr-3"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span>搜索…</span>
          <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Mobile search icon */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden mr-1"
          aria-label="搜索"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* User login/menu */}
        <div className="ml-2 hidden sm:block">
          <LoginButton />
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-2" aria-label="菜单">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AIEduWiki
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                知识领域
              </p>
              {DOMAIN_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(href)
                      ? "text-primary bg-primary/5"
                      : "text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
              <Separator className="my-3" />
              {SECONDARY_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(href)
                      ? "text-primary bg-primary/5"
                      : "text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
