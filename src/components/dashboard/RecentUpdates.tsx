import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DOMAIN_DISPLAY, type Domain } from "@/lib/domains"

interface UpdateItem {
  slug: string
  domain: Domain
  title: string
  updated: string
}

const DOMAIN_BADGE_COLORS: Record<Domain, string> = {
  theory: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  technology: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  products: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  insights: "bg-amber-100 text-amber-700 hover:bg-amber-100",
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return dateStr
  }
}

export function RecentUpdates({ updates }: { updates: UpdateItem[] }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">最近更新</h2>
        <p className="text-sm text-muted-foreground">最新修改的页面</p>
      </div>
      <ul className="divide-y">
        {updates.map((item) => (
          <li key={`${item.domain}/${item.slug}`}>
            <Link
              href={`/${item.domain}/${item.slug}`}
              className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-muted/50"
            >
              <Badge
                variant="secondary"
                className={`shrink-0 ${DOMAIN_BADGE_COLORS[item.domain]}`}
              >
                {DOMAIN_DISPLAY[item.domain]}
              </Badge>
              <span className="flex-1 truncate text-sm font-medium">
                {item.title}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(item.updated)}
              </span>
            </Link>
          </li>
        ))}
        {updates.length === 0 && (
          <li className="px-6 py-8 text-center text-sm text-muted-foreground">
            暂无更新记录
          </li>
        )}
      </ul>
    </div>
  )
}
