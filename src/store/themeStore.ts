import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggle: () => void
  init: () => void
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem('lms_theme', theme)
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  init: () => {
    const saved = localStorage.getItem('lms_theme') as Theme | null
    const preferred = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    applyTheme(preferred)
    set({ theme: preferred })
  },
  toggle: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    set({ theme: next })
  },
}))
