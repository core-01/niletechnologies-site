import { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { loanService } from '@/services/loanService'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatDate } from '@/utils/format'
import type { LoanApplication } from '@/types'

export default function LoanHistoryPage() {
  const user = useAuthStore((s) => s.user)
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loanService.listByUser(user.id).then((data) => {
      setLoans(data)
      setLoading(false)
    })
  }, [user])

  const columns: Column<LoanApplication>[] = [
    { header: 'Loan ID', accessor: (l) => <span className="font-mono text-xs">{l.id}</span> },
    { header: 'Type', accessor: (l) => <span className="capitalize">{l.type}</span> },
    { header: 'Amount', accessor: (l) => formatCurrency(l.amount) },
    { header: 'Tenure', accessor: (l) => `${l.tenureMonths} mo` },
    { header: 'Monthly EMI', accessor: (l) => formatCurrency(l.monthlyEmi) },
    { header: 'Applied on', accessor: (l) => formatDate(l.appliedOn) },
    { header: 'Status', accessor: (l) => <StatusBadge status={l.status} /> },
  ]

  if (loading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <History className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">Loan history</h1>
          <p className="text-sm text-ink-500">All applications you&apos;ve submitted, with their current status.</p>
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={loans} keyExtractor={(l) => l.id} emptyMessage="No loan applications yet" pageSize={7} />
      </Card>

      {loans.some((l) => l.status === 'rejected') && (
        <Card>
          <h2 className="mb-3 font-[var(--font-display)] text-sm font-semibold text-ink-900 dark:text-ink-50">Rejection notes</h2>
          <div className="flex flex-col gap-2">
            {loans
              .filter((l) => l.status === 'rejected')
              .map((l) => (
                <div key={l.id} className="rounded-lg bg-rose-accent/5 px-3.5 py-2.5 text-sm text-ink-600 dark:text-ink-300">
                  <span className="font-mono text-xs text-rose-accent">{l.id}</span> — {l.rejectionReason}
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}
