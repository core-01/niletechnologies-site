/**
 * Central error utilities.
 *
 * In development this just logs to the console. In production, wire the
 * `reportError` call below up to your monitoring provider (Sentry, Datadog,
 * an internal /api/logs endpoint, etc). Keeping a single choke point means
 * every error path in the app (render errors, route errors, API errors,
 * unhandled rejections) ends up in one place.
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  try {
    return JSON.stringify(error)
  } catch {
    return 'Unknown error'
  }
}

export function generateErrorId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function logError(error: unknown, context?: Record<string, unknown>): string {
  const errorId = generateErrorId()

  if (import.meta.env.DEV) {
    console.error(`[${errorId}]`, error, context)
  } else {
    reportError(error, errorId, context)
  }

  return errorId
}

/**
 * Placeholder production error reporter. Replace the body with a call to
 * your monitoring provider's SDK. Kept synchronous-safe (fire and forget)
 * so callers never need to await it.
 */
function reportError(error: unknown, errorId: string, context?: Record<string, unknown>): void {
  try {
    // Example integration point:
    // Sentry.captureException(error, { tags: { errorId }, extra: context })
    void error
    void errorId
    void context
  } catch {
    // Never let error reporting itself throw.
  }
}
