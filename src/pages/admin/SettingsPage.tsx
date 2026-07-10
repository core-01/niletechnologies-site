import { Settings, Bell, Shield, Percent } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { TextField } from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'

export default function SettingsPage() {
  const toast = useToast()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <Settings className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">Settings</h1>
          <p className="text-sm text-ink-500">Platform-wide configuration for lending operations.</p>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Percent className="h-4 w-4 text-ink-400" />
          <h2 className="font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Interest & limits</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="maxAmount" label="Maximum loan amount (₹)" defaultValue={10000000} type="number" />
          <TextField id="minCredit" label="Minimum credit score" defaultValue={600} type="number" />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-ink-400" />
          <h2 className="font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Notifications</h2>
        </div>
        <label className="flex items-center justify-between rounded-lg bg-ink-50 px-4 py-3 text-sm dark:bg-ink-800/60">
          Email admins on new applications
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-600" />
        </label>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-ink-400" />
          <h2 className="font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Compliance</h2>
        </div>
        <label className="flex items-center justify-between rounded-lg bg-ink-50 px-4 py-3 text-sm dark:bg-ink-800/60">
          Require KYC verification before disbursal
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-600" />
        </label>
      </Card>

      <Button className="self-start" onClick={() => toast.success('Settings saved')}>
        Save settings
      </Button>
    </div>
  )
}
