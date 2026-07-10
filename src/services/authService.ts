import type { LoginPayload, RegisterPayload, User } from '@/types'
import { mockUsers } from '@/data/mockData'
import { USE_MOCK_API, httpClient, delay } from './httpClient'

function fakeToken(user: User) {
  const payload = btoa(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 1000 * 60 * 60 * 8 }))
  return `mock.${payload}.signature`
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User; token: string }> {
    if (USE_MOCK_API) {
      const user = mockUsers.find((u) => u.email.toLowerCase() === payload.email.toLowerCase())
      if (!user || payload.password.length < 4) {
        await delay(null, 400)
        throw new Error('Invalid email or password')
      }
      return delay({ user, token: fakeToken(user) }, 500)
    }
    return httpClient.post('/auth/login', payload)
  },

  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    if (USE_MOCK_API) {
      const exists = mockUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())
      if (exists) {
        await delay(null, 400)
        throw new Error('An account with this email already exists')
      }
      const user: User = {
        id: `u-${Math.random().toString(36).slice(2, 8)}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: 'user',
        avatarColor: '#3d63f2',
        joinedOn: new Date().toISOString().slice(0, 10),
        creditScore: 650,
        kycVerified: false,
      }
      mockUsers.push(user)
      return delay({ user, token: fakeToken(user) }, 500)
    }
    return httpClient.post('/auth/register', payload)
  },

  async me(): Promise<User> {
    if (USE_MOCK_API) {
      const cached = localStorage.getItem('lms_user')
      if (!cached) throw new Error('Not authenticated')
      return delay(JSON.parse(cached), 150)
    }
    return httpClient.get('/auth/me')
  },
}
