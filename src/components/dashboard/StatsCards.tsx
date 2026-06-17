"use client"

import { useEffect, useRef, useState } from "react"
import {
  BookOpen,
  Lightbulb,
  Building2,
  GraduationCap,
  GitCompare,
  AlertTriangle,
  Clock,
} from "lucide-react"

interface Stats {
  totalPages: number
  concepts: number
  entities: number
  tutorials: number
  comparisons: number
  controversies: number
  timelines: number
}

const STAT_ITEMS = [
  { key: "totalPages" as const, label: "总页面数", icon: BookOpen, gradient: "from-indigo-500 to-violet-500" },
  { key: "concepts" as const, label: "概念", icon: Lightbulb, gradient: "from-blue-500 to-cyan-500" },
  { key: "entities" as const, label: "实体", icon: Building2, gradient: "from-emerald-500 to-teal-500" },
  { key: "tutorials" as const, label: "教程", icon: GraduationCap, gradient: "from-amber-500 to-orange-500" },
  { key: "comparisons" as const, label: "对比", icon: GitCompare, gradient: "from-rose-500 to-pink-500" },
  { key: "controversies" as const, label: "争议", icon: AlertTriangle, gradient: "from-red-500 to-rose-500" },
  { key: "timelines" as const, label: "时间线", icon: Clock, gradient: "from-purple-500 to-indigo-500" },
]

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return value
}

function StatCard({ stat, icon: Icon, label, gradient }: {
  stat: number
  icon: React.ComponentType<{ className?: string }>
  label: string
  gradient: string
}) {
  const count = useCountUp(stat)

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br ${gradient} opacity-10 transition-transform group-hover:scale-125`} />
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums tracking-tight">{count}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

export function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
      {STAT_ITEMS.map(({ key, icon, label, gradient }) => (
        <StatCard
          key={key}
          stat={stats[key]}
          icon={icon}
          label={label}
          gradient={gradient}
        />
      ))}
    </div>
  )
}
