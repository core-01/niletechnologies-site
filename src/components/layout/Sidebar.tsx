import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/format'

export interface SidebarItem {
  label: string
  to: string
  icon: LucideIcon
}

export default function Sidebar({
  items,
  open,
  onClose,
}: {
  items: SidebarItem[]
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-ink-100 bg-white pt-16 transition-transform duration-200 dark:border-ink-800 dark:bg-ink-900 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open && 'translate-x-0'
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800'
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
