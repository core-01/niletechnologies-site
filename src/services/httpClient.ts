// Central place to swap mock behaviour for a real backend later.
// When a real API is ready, set VITE_USE_MOCK_API=false and VITE_API_BASE_URL
// in your .env file — every service below already reads from here.

import { ApiError, NetworkError } from '@/utils/apiError'

export const USE_MOCK_API = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'

const REQUEST_TIMEOUT_MS = 15_000

export function getAuthToken(): string | null {
  return localStorage.getItem('lms_token')
}

/**
 * Fired when the server tells us the current session is no longer valid.
 * The auth store subscribes to this in main.tsx so the app can clear
 * session state and bounce to /login without every call site needing to
 * know about auth plumbing.
 */
export const SESSION_EXPIRED_EVENT = 'lms:session-expired'

function notifySessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new NetworkError('The request timed out. Please try again.')
    }
    // fetch only rejects on network-level failures (offline, DNS, CORS, etc.)
    throw new NetworkError()
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }))
    const message = body?.message || response.statusText || 'Request failed'

    if (response.status === 401) {
      notifySessionExpired()
    }

    throw new ApiError(message, response.status, body?.code)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

// Thin wrapper mirroring a typical REST client. Real network calls only run
// when USE_MOCK_API is false; otherwise services short-circuit to mock data.
export const httpClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
