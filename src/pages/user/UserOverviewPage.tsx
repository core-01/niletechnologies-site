import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Clock3, CheckCircle2, FilePlus2, ArrowUpRight } from 'lucide-react'
import { StatCard, Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import { loanService } from '@/services/loanService'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatDate } from '@/utils/format'
import type { LoanApplication } from '@/types'

export default function UserOverviewPage() {
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

  if (loading) return <PageLoader />

  const active = loans.filter((l) => l.status === 'approved')
  const pending = loans.filter((l) => l.status === 'pending')
  const totalOutstanding = active.reduce((sum, l) => sum + l.amount, 0)
  const totalEmi = active.reduce((sum, l) => sum + l.monthlyEmi, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-ink-500">Here&apos;s where things stand with your loans today.</p>
        </div>
        <Link to="/user/apply">
          <Button icon={<FilePlus2 className="h-4 w-4" />}>Apply for a loan</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active loans" value={String(active.length)} icon={<CheckCircle2 className="h-5 w-5" />} accent="#17b8a6" />
        <StatCard label="Pending EMIs" value={formatCurrency(totalEmi)} icon={<Clock3 className="h-5 w-5" />} accent="#f2a93b" delta="Due this month" deltaTone="neutral" />
        <StatCard label="Total outstanding" value={formatCurrency(totalOutstanding)} icon={<Wallet className="h-5 w-5" />} accent="#3d63f2" />
        <StatCard label="Applications pending" value={String(pending.length)} icon={<Clock3 className="h-5 w-5" />} accent="#e5566a" />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Recent applications</h2>
          <Link to="/user/history" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loans.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-400">You haven&apos;t applied for any loans yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-100 dark:divide-ink-800">
            {loans.slice(0, 4).map((loan) => (
              <div key={loan.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium capitalize text-ink-800 dark:text-ink-100">{loan.type} loan · {formatCurrency(loan.amount)}</p>
                  <p className="text-xs text-ink-400">Applied {formatDate(loan.appliedOn)}</p>
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
