import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        404
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">页面未找到</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        抱歉，您访问的页面不存在。可能是链接有误，或者页面已被移动。
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">
            <Search className="mr-2 h-4 w-4" />
            搜索内容
          </Link>
        </Button>
      </div>
      <div className="mt-10 text-sm text-muted-foreground">
        <p className="mb-3">您可能在找：</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/theory" className="rounded-full bg-muted px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors">
            学习理论
          </Link>
          <Link href="/technology" className="rounded-full bg-muted px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors">
            技术方法
          </Link>
          <Link href="/products" className="rounded-full bg-muted px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors">
            产品与公司
          </Link>
          <Link href="/insights" className="rounded-full bg-muted px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors">
            争议与趋势
          </Link>
          <Link href="/graph" className="rounded-full bg-muted px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors">
            知识图谱
          </Link>
        </div>
      </div>
    </div>
  )
}
