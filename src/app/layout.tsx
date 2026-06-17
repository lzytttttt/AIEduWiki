import type { Metadata } from "next"
import { Inter, Noto_Sans_SC } from "next/font/google"
import { Navigation } from "@/components/layout/Navigation"
import { Footer } from "@/components/layout/Footer"
import { SessionProvider } from "@/components/user/SessionProvider"
import { SearchProvider } from "@/components/search/SearchProvider"
import "@/styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-sc",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://aieduwiki.com"),
  title: {
    default: "AIEduWiki — AI 教育知识库",
    template: "%s | AIEduWiki",
  },
  description:
    "AI 教育领域知识库，涵盖学习理论、技术方法、产品分析与前沿趋势。",
  keywords: ["AI教育", "人工智能", "知识追踪", "自适应学习", "教育技术"],
  authors: [{ name: "AIEduWiki" }],
  openGraph: {
    title: "AIEduWiki — AI 教育知识库",
    description:
      "AI 教育领域知识库，涵盖学习理论、技术方法、产品分析与前沿趋势。",
    locale: "zh_CN",
    type: "website",
    siteName: "AIEduWiki",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${notoSansSC.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <SessionProvider>
          <SearchProvider>
            <Navigation />
            <div className="flex min-h-[calc(100vh-4rem)] flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </SearchProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
