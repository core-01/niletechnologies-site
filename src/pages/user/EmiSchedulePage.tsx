import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/Table'
import { PageLoader } from '@/components/ui/Loader'
import { SelectField } from '@/components/ui/Field'
import { loanService } from '@/services/loanService'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatDate, cn } from '@/utils/format'
import type { EmiInstallment, LoanApplication } from '@/types'

export default function EmiSchedulePage() {
  const user = useAuthStore((s) => s.user)
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [emis, setEmis] = useState<EmiInstallment[]>([])
  const [selectedLoan, setSelectedLoan] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([loanService.listByUser(user.id), loanService.emiScheduleForUser(user.id)]).then(([l, e]) => {
      setLoans(l.filter((loan) => loan.status === 'approved' || loan.status === 'closed'))
      setEmis(e)
      setLoading(false)
    })
  }, [user])

  if (loading) return <PageLoader />

  const filtered = selectedLoan === 'all' ? emis : emis.filter((e) => e.loanId === selectedLoan)
  const statusStyle: Record<EmiInstallment['status'], string> = {
    paid: 'bg-teal-accent/10 text-teal-accent',
    due: 'bg-amber-accent/10 text-amber-accent',
    upcoming: 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-300',
  }

  const columns: Column<EmiInstallment>[] = [
    { header: '#', accessor: (e) => e.installmentNo },
    { header: 'Due date', accessor: (e) => formatDate(e.dueDate) },
    { header: 'EMI amount', accessor: (e) => formatCurrency(e.amount) },
    { header: 'Principal', accessor: (e) => formatCurrency(e.principal) },
    { header: 'Interest', accessor: (e) => formatCurrency(e.interest) },
    {
      header: 'Status',
      accessor: (e) => (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize', statusStyle[e.status])}>
          {e.status}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            <CalendarClock className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">EMI schedule</h1>
            <p className="text-sm text-ink-500">Track repayment installments across your active loans.</p>
          </div>
        </div>
        <div className="w-56">
          <SelectField
            id="loanFilter"
            label=""
            value={selectedLoan}
            onChange={(e) => setSelectedLoan(e.target.value)}
            options={[{ label: 'All loans', value: 'all' }, ...loans.map((l) => ({ label: `${l.id} · ${l.type}`, value: l.id }))]}
          />
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={filtered} keyExtractor={(e) => e.id} emptyMessage="No EMI installments to show" pageSize={8} />
      </Card>
    </div>
  )
}
