import { create } from 'zustand'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  hydrate: () => void
  setSession: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  hydrate: () => {
    const token = localStorage.getItem('lms_token')
    const cachedUser = localStorage.getItem('lms_user')
    if (token && cachedUser) {
      set({ user: JSON.parse(cachedUser), token, isAuthenticated: true })
    }
  },

  setSession: (user, token) => {
    localStorage.setItem('lms_token', token)
    localStorage.setItem('lms_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('lms_token')
    localStorage.removeItem('lms_user')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

// When httpClient sees a 401 from the (future) real API, it dispatches this
// event so the session is cleared everywhere without services needing a
// direct dependency on the auth store.
if (typeof window !== 'undefined') {
  window.addEventListener('lms:session-expired', () => {
    useAuthStore.getState().logout()
  })
}
