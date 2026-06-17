import Link from "next/link"
import { BookOpen, Cpu, Building2, TrendingUp, ArrowRight } from "lucide-react"
import type { Domain } from "@/lib/domains"

interface DomainInfo {
  domain: Domain
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  count: number
}

const DOMAIN_CONFIG: Omit<DomainInfo, "count">[] = [
  {
    domain: "theory",
    title: "学习理论",
    description: "知识追踪、学习科学、教学智能体等核心理论",
    icon: BookOpen,
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    domain: "technology",
    title: "技术方法",
    description: "NLP、强化学习、多模态等技术在教育中的应用",
    icon: Cpu,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    domain: "products",
    title: "产品与公司",
    description: "Khan Academy、松鼠 AI、好未来等产品与机构",
    icon: Building2,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    domain: "insights",
    title: "争议与趋势",
    description: "AI 替代教师、教育公平、年度趋势等深度分析",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
  },
]

export function CategoryCards({ counts }: { counts: Record<Domain, number> }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {DOMAIN_CONFIG.map(({ domain, title, description, icon: Icon, gradient }) => (
        <Link key={domain} href={`/${domain}`} className="group">
          <div className="relative h-full overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            {/* gradient bar top */}
            <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{counts[domain]} 篇文章</p>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-accent">
              探索
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
