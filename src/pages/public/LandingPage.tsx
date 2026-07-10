import { Link } from 'react-router-dom'
import { Landmark, ShieldCheck, Timer, LineChart, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'

const features = [
  {
    icon: Timer,
    title: 'Decisions in minutes',
    description: 'Automated eligibility checks and a streamlined review queue turn multi-day approvals into same-day decisions.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for compliance',
    description: 'Role-based access, audit-ready status trails, and KYC checkpoints keep every application accountable.',
  },
  {
    icon: LineChart,
    title: 'Portfolio visibility',
    description: 'Live dashboards surface approval rates, disbursement trends, and risk concentration across your book.',
  },
]

const steps = [
  'Applicant submits a loan request with purpose, amount and tenure',
  'Underwriting rules score the request against credit and KYC signals',
  'Reviewer approves, rejects, or requests more information',
  'EMI schedule and disbursement are generated automatically',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold text-ink-900 dark:text-ink-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Landmark className="h-5 w-5" />
          </span>
          Lendly
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> Trusted by lending teams handling 12,000+ applications
          </span>
          <h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold leading-tight text-ink-900 dark:text-ink-50 sm:text-5xl">
            Loan operations, from application to EMI, in one system
          </h1>
          <p className="mt-5 max-w-lg text-base text-ink-500 dark:text-ink-400">
            Lendly gives borrowers a transparent view of every application and gives underwriting teams a single
            queue to approve, reject, and track repayment — without spreadsheets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg" icon={<ArrowRight className="h-4 w-4" />} className="flex-row-reverse">
                Create an account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-xl shadow-ink-900/[0.04] dark:border-ink-800 dark:bg-ink-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">This month</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-[var(--font-display)] text-3xl font-semibold text-ink-900 dark:text-ink-50">₹4.2Cr</p>
              <p className="text-xs text-ink-400">Disbursed</p>
            </div>
            <div>
              <p className="font-[var(--font-display)] text-3xl font-semibold text-teal-accent">86%</p>
              <p className="text-xs text-ink-400">Approval rate</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {['Home loan · ₹42,00,000', 'Auto loan · ₹6,20,000', 'Education loan · ₹9,00,000'].map((row) => (
              <div key={row} className="flex items-center justify-between rounded-lg bg-ink-50 px-3.5 py-2.5 text-sm dark:bg-ink-800/60">
                <span className="text-ink-600 dark:text-ink-300">{row}</span>
                <span className="rounded-full bg-teal-accent/10 px-2 py-0.5 text-xs font-semibold text-teal-accent">Approved</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">
          Everything a lending team needs
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                <f.icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="mt-4 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">How it works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-4 rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="text-sm text-ink-600 dark:text-ink-300">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-brand-600 px-8 py-14 text-center">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
            Ready to see it with your own data?
          </h2>
          <p className="max-w-md text-sm text-brand-100">
            Sign up as a borrower or explore the admin console with sample applications already loaded.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg">
              Create your free account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink-100 py-8 text-center text-xs text-ink-400 dark:border-ink-800">
        © {new Date().getFullYear()} Lendly. A frontend demo — no real financial transactions occur.
      </footer>
    </div>
  )
}
