import * as React from 'react'
import { cn } from '@/lib/utils'

type AdmonitionType = 'note' | 'tip' | 'warning' | 'danger' | 'concept' | 'info'

interface AdmonitionProps {
  type: AdmonitionType
  title?: string
  collapsible?: boolean
  children: React.ReactNode
}

const ADMONITION_STYLES: Record<
  AdmonitionType,
  { border: string; bg: string; iconBg: string; icon: React.ReactNode; defaultTitle: string }
> = {
  note: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    iconBg: 'text-blue-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    defaultTitle: '注意',
  },
  tip: {
    border: 'border-l-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
    iconBg: 'text-green-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    defaultTitle: '提示',
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    iconBg: 'text-amber-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    defaultTitle: '警告',
  },
  danger: {
    border: 'border-l-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    iconBg: 'text-red-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    defaultTitle: '危险',
  },
  concept: {
    border: 'border-l-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    iconBg: 'text-violet-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    defaultTitle: '概念',
  },
  info: {
    border: 'border-l-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    iconBg: 'text-cyan-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    defaultTitle: '信息',
  },
}

function AdmonitionHeader({
  type,
  title,
  icon,
  iconBg,
  collapsible,
  open,
  onToggle,
}: {
  type: AdmonitionType
  title: string
  icon: React.ReactNode
  iconBg: string
  collapsible?: boolean
  open?: boolean
  onToggle?: () => void
}) {
  const header = (
    <div
      className={cn(
        'flex items-center gap-2 py-2 font-semibold text-sm',
        type === 'concept' && 'text-base',
        collapsible && 'cursor-pointer select-none',
      )}
      onClick={collapsible ? onToggle : undefined}
      role={collapsible ? 'button' : undefined}
      tabIndex={collapsible ? 0 : undefined}
      onKeyDown={
        collapsible
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggle?.()
              }
            }
          : undefined
      }
    >
      <span className={cn('flex-shrink-0', iconBg)}>{icon}</span>
      <span>{title}</span>
      {collapsible && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn(
            'ml-auto h-4 w-4 transition-transform',
            open ? 'rotate-180' : 'rotate-0',
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </div>
  )
  return header
}

export function Admonition({
  type,
  title,
  collapsible,
  children,
}: AdmonitionProps) {
  const [open, setOpen] = React.useState(!collapsible)
  const style = ADMONITION_STYLES[type] ?? ADMONITION_STYLES.note
  const displayTitle = title ?? style.defaultTitle

  // Concept type gets card-style layout
  if (type === 'concept') {
    return (
      <div
        className={cn(
          'rounded-lg border-l-4 p-4 my-4',
          style.border,
          style.bg,
          'shadow-sm',
        )}
      >
        <AdmonitionHeader
          type={type}
          title={displayTitle}
          icon={style.icon}
          iconBg={style.iconBg}
          collapsible={collapsible}
          open={open}
          onToggle={() => setOpen((o) => !o)}
        />
        {open && <div className="mt-2 space-y-2 text-sm leading-relaxed">{children}</div>}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 p-4 my-4',
        style.border,
        style.bg,
        'shadow-sm',
      )}
    >
      <AdmonitionHeader
        type={type}
        title={displayTitle}
        icon={style.icon}
        iconBg={style.iconBg}
        collapsible={collapsible}
        open={open}
        onToggle={() => setOpen((o) => !o)}
      />
      {open && <div className="mt-2 space-y-2 text-sm leading-relaxed">{children}</div>}
    </div>
  )
}
