import { Menu, Moon, Sun, LogOut, Landmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useToast } from '@/hooks/useToast'
import { initials } from '@/utils/format'

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const toast = useToast()

  function handleLogout() {
    logout()
    toast.info('You have been signed out')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 px-4 backdrop-blur-md dark:border-ink-800 dark:bg-ink-900/80 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2 font-[var(--font-display)] font-semibold text-ink-900 dark:text-ink-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Landmark className="h-4.5 w-4.5" />
          </span>
          <span className="hidden sm:inline">Lendly</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {user && (
          <div className="flex items-center gap-3 border-l border-ink-100 pl-3 dark:border-ink-800 sm:pl-4">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: user.avatarColor }}
            >
              {initials(user.name)}
            </span>
            <div className="hidden text-sm leading-tight sm:block">
              <p className="font-medium text-ink-900 dark:text-ink-50">{user.name}</p>
              <p className="text-xs capitalize text-ink-400">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-rose-accent dark:text-ink-300 dark:hover:bg-ink-800"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
