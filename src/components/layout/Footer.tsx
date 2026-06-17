import Link from "next/link"

const FOOTER_LINKS = [
  { href: "https://github.com/lzytttttt/AIEduWiki", label: "GitHub" },
  { href: "https://github.com/lzytttttt", label: "关于" },
  { href: "mailto:lzytttttt@gmail.com", label: "联系" },
] as const

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AIEduWiki
            </Link>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              AI 教育领域知识库，涵盖学习理论、技术方法、产品分析与前沿趋势。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">链接</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">关于本站</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              基于 MkDocs Material 迁移至 Next.js 构建，
              使用知识图谱技术组织 AI 教育领域内容。
            </p>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AIEduWiki. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
