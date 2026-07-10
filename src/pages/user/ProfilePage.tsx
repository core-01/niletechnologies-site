import { useState } from 'react'
import { UserCircle, ShieldCheck, ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { TextField } from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'
import { initials, formatDate } from '@/utils/format'

export default function ProfilePage() {
  const { user, setSession, token } = useAuthStore()
  const toast = useToast()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [saving, setSaving] = useState(false)

  if (!user) return null

  async function handleSave() {
    if (!user || !token) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSession({ ...user, name, phone }, token)
    setSaving(false)
    toast.success('Profile updated')
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <UserCircle className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">Profile</h1>
          <p className="text-sm text-ink-500">Manage your personal details.</p>
        </div>
      </div>

      <Card className="flex items-center gap-4">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ backgroundColor: user.avatarColor }}
        >
          {initials(user.name)}
        </span>
        <div>
          <p className="font-[var(--font-display)] text-lg font-semibold text-ink-900 dark:text-ink-50">{user.name}</p>
          <p className="text-sm text-ink-500">Member since {formatDate(user.joinedOn)}</p>
          <div className="mt-2 flex items-center gap-2">
            {user.kycVerified ? (
              <span className="flex items-center gap-1 rounded-full bg-teal-accent/10 px-2.5 py-1 text-xs font-semibold text-teal-accent">
                <ShieldCheck className="h-3.5 w-3.5" /> KYC verified
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-amber-accent/10 px-2.5 py-1 text-xs font-semibold text-amber-accent">
                <ShieldAlert className="h-3.5 w-3.5" /> KYC pending
              </span>
            )}
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-500 dark:bg-ink-800 dark:text-ink-300">
              Credit score: {user.creditScore}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-[var(--font-display)] text-base font-semibold text-ink-900 dark:text-ink-50">Personal details</h2>
        <div className="flex flex-col gap-4">
          <TextField id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField id="email" label="Email address" value={user.email} disabled />
          <TextField id="phone" label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button onClick={handleSave} loading={saving} className="self-start">
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  )
}
