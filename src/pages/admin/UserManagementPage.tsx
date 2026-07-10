import { useEffect, useState } from 'react'
import { Users, ShieldCheck, ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/Table'
import { PageLoader } from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { userService } from '@/services/userService'
import { initials, formatDate } from '@/utils/format'
import type { User } from '@/types'

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<User | null>(null)

  useEffect(() => {
    userService.listAll().then((data) => {
      setUsers(data)
      setLoading(false)
    })
  }, [])

  const columns: Column<User>[] = [
    {
      header: 'Name',
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: u.avatarColor }}>
            {initials(u.name)}
          </span>
          <span className="font-medium text-ink-800 dark:text-ink-100">{u.name}</span>
        </div>
      ),
    },
    { header: 'Email', accessor: (u) => u.email },
    { header: 'Phone', accessor: (u) => u.phone },
    { header: 'Credit score', accessor: (u) => u.creditScore },
    {
      header: 'KYC',
      accessor: (u) =>
        u.kycVerified ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-teal-accent">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-accent">
            <ShieldAlert className="h-3.5 w-3.5" /> Pending
          </span>
        ),
    },
    {
      header: '',
      accessor: (u) => (
        <button onClick={() => setSelected(u)} className="text-sm font-medium text-brand-600 hover:underline">
          View details
        </button>
      ),
    },
  ]

  if (loading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50">User management</h1>
          <p className="text-sm text-ink-500">All borrowers registered on the platform.</p>
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={users} keyExtractor={(u) => u.id} pageSize={7} />
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}
      >
        {selected && (
          <div className="flex flex-col gap-2.5">
            <Row label="Email" value={selected.email} />
            <Row label="Phone" value={selected.phone} />
            <Row label="Joined on" value={formatDate(selected.joinedOn)} />
            <Row label="Credit score" value={String(selected.creditScore)} />
            <Row label="KYC status" value={selected.kycVerified ? 'Verified' : 'Pending'} />
          </div>
        )}
      </Modal>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-ink-100 pb-2 text-sm last:border-0 dark:border-ink-800">
      <span className="text-ink-400">{label}</span>
      <span className="font-medium text-ink-800 dark:text-ink-100">{value}</span>
    </div>
  )
}
