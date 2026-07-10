import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardList, BarChart3, Settings } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Sidebar, { type SidebarItem } from '@/components/layout/Sidebar'

const items: SidebarItem[] = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'User Management', to: '/admin/users', icon: Users },
  { label: 'Loan Applications', to: '/admin/loans', icon: ClipboardList },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <div className="lg:flex">
        <Sidebar items={items} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
