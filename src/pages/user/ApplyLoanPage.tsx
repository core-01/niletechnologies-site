import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FilePlus2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { TextField, SelectField, TextareaField } from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { loanApplicationSchema, type LoanApplicationFormValues } from '@/utils/validation'
import { loanService } from '@/services/loanService'
import { loanTypeRates } from '@/data/mockData'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/format'

const typeOptions = [
  { label: 'Personal loan', value: 'personal' },
  { label: 'Home loan', value: 'home' },
  { label: 'Auto loan', value: 'auto' },
  { label: 'Education loan', value: 'education' },
  { label: 'Business loan', value: 'business' },
]

function estimateEmi(amount: number, rate: number, months: number) {
  if (!amount || !months) return 0
  const r = rate / 12 / 100
  return Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1))
}

export default function ApplyLoanPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: { type: 'personal', amount: 100000, tenureMonths: 24, purpose: '' },
  })

  const type = watch('type')
  const amount = watch('amount')
  const tenureMonths = watch('tenureMonths')
  const rate = loanTypeRates[type] ?? 12
  const emiPreview = estimateEmi(Number(amount) || 0, rate, Number(tenureMonths) || 0)

  const [submitted, setSubmitted] = useState(false)

  async function onSubmit(values: LoanApplicationFormValues) {
    if (!user) return
    await loanService.apply({
      userId: user.id,
      applicantName: user.name,
      type: values.type,
      amount: values.amount,
      tenureMonths: values.tenureMonths,
      purpose: values.purpose,
    })
    toast.success('Loan application submitted for review')
    setSubmitted(true)
    setTimeout(() => navigate('/user/history'), 900)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">Apply for a loan</h1>
        <p className="mt-1 text-sm text-ink-500">Fill in the details below — our team reviews applications within 1-2 business days.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <SelectField id="type" label="Loan type" options={typeOptions} {...register('type')} />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="amount"
              label="Loan amount (₹)"
              type="number"
              error={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />
            <TextField
              id="tenureMonths"
              label="Tenure (months)"
              type="number"
              error={errors.tenureMonths?.message}
              {...register('tenureMonths', { valueAsNumber: true })}
            />
          </div>

          <TextareaField
            id="purpose"
            label="Purpose of loan"
            placeholder="Briefly describe what this loan will be used for"
            error={errors.purpose?.message}
            {...register('purpose')}
          />

          <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-300">Estimated EMI</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="font-[var(--font-display)] text-2xl font-semibold text-brand-700 dark:text-brand-200">
                {formatCurrency(emiPreview)}<span className="text-sm font-normal">/mo</span>
              </p>
              <span className="text-xs text-brand-600 dark:text-brand-300">at {rate}% p.a.</span>
            </div>
          </div>

          <Button type="submit" size="lg" loading={isSubmitting || submitted} icon={<FilePlus2 className="h-4 w-4" />} className="justify-center">
            Submit application
          </Button>
        </form>
      </Card>
    </div>
  )
}
