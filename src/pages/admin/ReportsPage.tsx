import { BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import LoanTrendChart from '@/components/charts/LoanTrendChart'
import LoanTypePieChart from '@/components/charts/LoanTypePieChart'
import ApprovalBarChart from '@/components/charts/ApprovalBarChart'
import { monthlyLoanStats } from '@/data/mockData'

export default function ReportsPage() {
  const totalApplications = monthlyLoanStats.reduce((s, m) => s + m.applications, 0)
  const totalApproved = monthlyLoanStats.reduce((s, m) => s + m.approved, 0)
  const approvalRate = Math.round((totalApproved / totalApplications) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <BarChart3 className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">Reports</h1>
          <p className="text-sm text-ink-500">Portfolio trends across the last 7 months.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Total applications</p>
          <p className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">{totalApplications}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Total approved</p>
          <p className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-teal-accent">{totalApproved}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Approval rate</p>
          <p className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">{approvalRate}%</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-2 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Applications vs approvals</h2>
        <LoanTrendChart />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Approved vs rejected</h2>
          <ApprovalBarChart />
        </Card>
        <Card>
          <h2 className="mb-2 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Loan type mix</h2>
          <LoanTypePieChart />
        </Card>
      </div>
    </div>
  )
}
