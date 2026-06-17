import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchPageClient } from "./SearchPageClient"

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索 AIEduWiki 中的 AI 教育知识内容",
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-screen-lg px-4 py-8 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto h-10 w-32 animate-pulse rounded bg-muted" />
            <div className="mx-auto mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
          <div className="mx-auto h-12 max-w-xl animate-pulse rounded bg-muted" />
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  )
}
