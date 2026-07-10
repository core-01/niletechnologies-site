import type { User } from '@/types'
import { mockUsers } from '@/data/mockData'
import { USE_MOCK_API, httpClient, delay } from './httpClient'

export const userService = {
  async listAll(): Promise<User[]> {
    if (USE_MOCK_API) return delay(mockUsers.filter((u) => u.role === 'user'), 300)
    return httpClient.get('/users')
  },

  async getById(id: string): Promise<User | undefined> {
    if (USE_MOCK_API) return delay(mockUsers.find((u) => u.id === id), 200)
    return httpClient.get(`/users/${id}`)
  },
}
