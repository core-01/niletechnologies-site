import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import ErrorPage, { type ErrorVariant } from '@/pages/public/ErrorPage'

/**
 * Wired up as the `errorElement` on every top-level route in App.tsx.
 * Catches: unmatched paths (404), thrown Response()s from loaders/actions,
 * and any render/throw error inside that route's subtree that isn't already
 * caught by a more specific boundary — all funneled through the same
 * ErrorPage UI.
 */
export default function RouteErrorElement() {
  const error = useRouteError()

  return <ErrorPage variant={resolveVariant(error)} error={error} />
}

function resolveVariant(error: unknown): ErrorVariant {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return '404'
    if (error.status === 401) return '401'
    if (error.status === 403) return '403'
    if (error.status >= 500) return '500'
  }
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'network'
  return 'generic'
}
