import { cn } from '@/utils/format'
import type { LoanStatus } from '@/types'

const statusStyles: Record<LoanStatus, string> = {
  approved: 'bg-teal-accent/10 text-teal-accent',
  pending: 'bg-amber-accent/10 text-amber-accent',
  rejected: 'bg-rose-accent/10 text-rose-accent',
  closed: 'bg-ink-200 text-ink-500 dark:bg-ink-700 dark:text-ink-300',
}

export function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize', statusStyles[status])}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300', className)}>
      {children}
    </span>
  )
}
