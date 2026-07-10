import { useEffect, useState } from 'react'
import { Users, ClipboardList, Clock3, IndianRupee } from 'lucide-react'
import { StatCard, Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'
import { StatusBadge } from '@/components/ui/Badge'
import LoanTrendChart from '@/components/charts/LoanTrendChart'
import LoanTypePieChart from '@/components/charts/LoanTypePieChart'
import { loanService } from '@/services/loanService'
import { userService } from '@/services/userService'
import { formatCurrency, formatDate } from '@/utils/format'
import type { LoanApplication, User } from '@/types'

export default function AdminOverviewPage() {
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loanService.listAll(), userService.listAll()]).then(([l, u]) => {
      setLoans(l)
      setUsers(u)
      setLoading(false)
    })
  }, [])

  if (loading) return <PageLoader />

  const pending = loans.filter((l) => l.status === 'pending')
  const approved = loans.filter((l) => l.status === 'approved')
  const totalDisbursed = approved.reduce((sum, l) => sum + l.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">Admin overview</h1>
        <p className="mt-1 text-sm text-ink-500">A snapshot of borrowers, applications, and portfolio health.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={String(users.length)} icon={<Users className="h-5 w-5" />} accent="#3d63f2" />
        <StatCard label="Total loans" value={String(loans.length)} icon={<ClipboardList className="h-5 w-5" />} accent="#8b5cf6" />
        <StatCard label="Approvals pending" value={String(pending.length)} icon={<Clock3 className="h-5 w-5" />} accent="#f2a93b" />
        <StatCard label="Total disbursed" value={formatCurrency(totalDisbursed)} icon={<IndianRupee className="h-5 w-5" />} accent="#17b8a6" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="mb-2 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Applications vs approvals</h2>
          <LoanTrendChart />
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-2 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Loan type mix</h2>
          <LoanTypePieChart />
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Awaiting your review</h2>
        {pending.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-400">No pending applications right now.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-100 dark:divide-ink-800">
            {pending.slice(0, 5).map((loan) => (
              <div key={loan.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-100">
                    {loan.applicantName} · <span className="capitalize">{loan.type}</span> loan
                  </p>
                  <p className="text-xs text-ink-400">
                    {formatCurrency(loan.amount)} · Applied {formatDate(loan.appliedOn)}
                  </p>
                </div>
                <StatusBadge status={loan.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
