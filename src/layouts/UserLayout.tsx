import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, FilePlus2, History, CalendarClock, UserCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Sidebar, { type SidebarItem } from '@/components/layout/Sidebar'

const items: SidebarItem[] = [
  { label: 'Overview', to: '/user', icon: LayoutDashboard },
  { label: 'Apply for Loan', to: '/user/apply', icon: FilePlus2 },
  { label: 'Loan History', to: '/user/history', icon: History },
  { label: 'EMI Schedule', to: '/user/emi', icon: CalendarClock },
  { label: 'Profile', to: '/user/profile', icon: UserCircle },
]

export default function UserLayout() {
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
