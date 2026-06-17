'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DataTableProps {
  children: React.ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg shadow-sm">
      <table
        className={cn(
          'w-full border-collapse',
          'rounded-lg overflow-hidden',
          className,
        )}
      >
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return <thead className={className}>{children}</thead>
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

export function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-primary/[0.04]',
        'dark:hover:bg-primary/[0.08]',
        className,
      )}
    >
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'justify' | 'char'
}

export function TableCell({ children, className, align }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-sm border-b border-border',
        'last:border-b-0',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}
    >
      {children}
    </td>
  )
}

interface TableHeadCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'justify' | 'char'
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
  onSort?: () => void
}

export function TableHeadCell({
  children,
  className,
  align,
  sortable,
  sorted,
  onSort,
}: TableHeadCellProps) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-sm font-semibold text-left',
        'bg-primary text-primary-foreground',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        sortable && 'cursor-pointer select-none hover:bg-primary/90',
        className,
      )}
      onClick={sortable ? onSort : undefined}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <span className="inline-flex flex-col ml-1">
            <svg
              viewBox="0 0 8 5"
              className={cn(
                'h-2 w-2',
                sorted === 'asc' ? 'text-white' : 'text-white/30',
              )}
            >
              <path d="M4 0L8 5H0z" fill="currentColor" />
            </svg>
            <svg
              viewBox="0 0 8 5"
              className={cn(
                'h-2 w-2 -mt-0.5',
                sorted === 'desc' ? 'text-white' : 'text-white/30',
              )}
            >
              <path d="M4 5L0 0h8z" fill="currentColor" />
            </svg>
          </span>
        )}
      </span>
    </th>
  )
}
