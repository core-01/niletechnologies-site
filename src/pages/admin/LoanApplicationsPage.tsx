import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClipboardList, Check, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { TextareaField, SelectField } from '@/components/ui/Field'
import { loanService } from '@/services/loanService'
import { useToast } from '@/hooks/useToast'
import { rejectionSchema, type RejectionFormValues } from '@/utils/validation'
import { formatCurrency, formatDate } from '@/utils/format'
import type { LoanApplication, LoanStatus } from '@/types'

export default function LoanApplicationsPage() {
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | LoanStatus>('all')
  const [detailLoan, setDetailLoan] = useState<LoanApplication | null>(null)
  const [rejectLoan, setRejectLoan] = useState<LoanApplication | null>(null)
  const [approveLoan, setApproveLoan] = useState<LoanApplication | null>(null)
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectionFormValues>({ resolver: zodResolver(rejectionSchema) })

  function refresh() {
    loanService.listAll().then((data) => {
      setLoans(data)
      setLoading(false)
    })
  }

  useEffect(refresh, [])

  async function handleApprove() {
    if (!approveLoan) return
    setBusy(true)
    await loanService.updateStatus(approveLoan.id, 'approved')
    toast.success(`${approveLoan.id} approved`)
    setApproveLoan(null)
    setBusy(false)
    refresh()
  }

  async function handleReject(values: RejectionFormValues) {
    if (!rejectLoan) return
    setBusy(true)
    await loanService.updateStatus(rejectLoan.id, 'rejected', values.reason)
    toast.success(`${rejectLoan.id} rejected`)
    setRejectLoan(null)
    reset()
    setBusy(false)
    refresh()
  }

  const filtered = statusFilter === 'all' ? loans : loans.filter((l) => l.status === statusFilter)

  const columns: Column<LoanApplication>[] = [
    { header: 'Loan ID', accessor: (l) => <span className="font-mono text-xs">{l.id}</span> },
    { header: 'Applicant', accessor: (l) => l.applicantName },
    { header: 'Type', accessor: (l) => <span className="capitalize">{l.type}</span> },
    { header: 'Amount', accessor: (l) => formatCurrency(l.amount) },
    { header: 'Applied on', accessor: (l) => formatDate(l.appliedOn) },
    { header: 'Status', accessor: (l) => <StatusBadge status={l.status} /> },
    {
      header: 'Actions',
      accessor: (l) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setDetailLoan(l)} className="text-xs font-medium text-brand-600 hover:underline">
            View
          </button>
          {l.status === 'pending' && (
            <>
              <button
                onClick={() => setApproveLoan(l)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-accent/10 text-teal-accent hover:bg-teal-accent/20"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setRejectLoan(l)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-accent/10 text-rose-accent hover:bg-rose-accent/20"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  if (loading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            <ClipboardList className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">Loan applications</h1>
            <p className="text-sm text-ink-500">Review, approve, or reject borrower requests.</p>
          </div>
        </div>
        <div className="w-48">
          <SelectField
            id="statusFilter"
            label=""
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            options={[
              { label: 'All statuses', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Closed', value: 'closed' },
            ]}
          />
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={filtered} keyExtractor={(l) => l.id} pageSize={7} />
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!detailLoan}
        onClose={() => setDetailLoan(null)}
        title={detailLoan?.id ?? ''}
        footer={<Button variant="secondary" onClick={() => setDetailLoan(null)}>Close</Button>}
      >
        {detailLoan && (
          <div className="flex flex-col gap-2.5">
            <DetailRow label="Applicant" value={detailLoan.applicantName} />
            <DetailRow label="Type" value={detailLoan.type} className="capitalize" />
            <DetailRow label="Amount" value={formatCurrency(detailLoan.amount)} />
            <DetailRow label="Tenure" value={`${detailLoan.tenureMonths} months`} />
            <DetailRow label="Interest rate" value={`${detailLoan.interestRate}% p.a.`} />
            <DetailRow label="Monthly EMI" value={formatCurrency(detailLoan.monthlyEmi)} />
            <DetailRow label="Purpose" value={detailLoan.purpose} />
            <DetailRow label="Applied on" value={formatDate(detailLoan.appliedOn)} />
            {detailLoan.rejectionReason && <DetailRow label="Rejection reason" value={detailLoan.rejectionReason} />}
          </div>
        )}
      </Modal>

      {/* Approve confirmation */}
      <Modal
        open={!!approveLoan}
        onClose={() => setApproveLoan(null)}
        title="Approve loan application"
        footer={
          <>
            <Button variant="secondary" onClick={() => setApproveLoan(null)}>Cancel</Button>
            <Button variant="success" loading={busy} onClick={handleApprove}>Confirm approval</Button>
          </>
        }
      >
        Approve <strong>{approveLoan?.id}</strong> for {approveLoan?.applicantName}, disbursing{' '}
        {approveLoan && formatCurrency(approveLoan.amount)}? This action will generate the EMI schedule.
      </Modal>

      {/* Reject with reason */}
      <Modal
        open={!!rejectLoan}
        onClose={() => setRejectLoan(null)}
        title="Reject loan application"
      >
        <form onSubmit={handleSubmit(handleReject)} className="flex flex-col gap-4">
          <p>
            Rejecting <strong>{rejectLoan?.id}</strong> for {rejectLoan?.applicantName}. Please provide a reason —
            this will be visible to the applicant.
          </p>
          <TextareaField id="reason" label="Reason for rejection" error={errors.reason?.message} {...register('reason')} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setRejectLoan(null)}>Cancel</Button>
            <Button type="submit" variant="danger" loading={busy}>Confirm rejection</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function DetailRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink-100 pb-2 text-sm last:border-0 dark:border-ink-800">
      <span className="shrink-0 text-ink-400">{label}</span>
      <span className={`text-right font-medium text-ink-800 dark:text-ink-100 ${className ?? ''}`}>{value}</span>
    </div>
  )
}
