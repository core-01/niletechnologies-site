import type { ReactNode } from 'react'
import { cn } from '@/utils/format'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ink-100 bg-white p-5 shadow-sm shadow-ink-900/[0.03]',
        'dark:border-ink-800 dark:bg-ink-900',
        className
      )}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
  icon: ReactNode
  accent?: string
}

export function StatCard({ label, value, delta, deltaTone = 'neutral', icon, accent = 'var(--color-brand-500)' }: StatCardProps) {
  const deltaColor =
    deltaTone === 'up' ? 'text-teal-accent' : deltaTone === 'down' ? 'text-rose-accent' : 'text-ink-400'
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">{value}</p>
        {delta && <p className={cn('mt-1 text-xs font-medium', deltaColor)}>{delta}</p>}
      </div>
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {icon}
      </div>
    </Card>
  )
}
