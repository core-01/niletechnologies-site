import { useEffect } from 'react'
import { AlertOctagon, Compass, Lock, WifiOff, ServerCrash, RefreshCcw, Home } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getErrorMessage, logError } from '@/utils/errorLogger'

export type ErrorVariant = '404' | '401' | '403' | '500' | 'network' | 'generic'

interface ErrorPageProps {
  variant?: ErrorVariant
  title?: string
  message?: string
  /** Present when rendered from a caught JS error, used for dev-mode detail + logging. */
  error?: unknown
  /** Optional short reference id shown to the user for support requests. */
  errorId?: string
  /** Called instead of the default recovery action when the user taps "Try again". */
  onRetry?: () => void
}

const VARIANT_CONFIG: Record<
  ErrorVariant,
  { icon: typeof AlertOctagon; title: string; message: string; tone: string }
> = {
  '404': {
    icon: Compass,
    title: 'Page not found',
    message: "The page you're looking for doesn't exist or may have moved.",
    tone: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300',
  },
  '401': {
    icon: Lock,
    title: 'Session expired',
    message: 'Your session has expired or you need to sign in to view this page.',
    tone: 'bg-amber-accent/10 text-amber-accent',
  },
  '403': {
    icon: Lock,
    title: 'Access denied',
    message: "You don't have permission to view this page.",
    tone: 'bg-amber-accent/10 text-amber-accent',
  },
  '500': {
    icon: ServerCrash,
    title: 'Server error',
    message: 'Something went wrong on our end. Please try again in a moment.',
    tone: 'bg-rose-accent/10 text-rose-accent',
  },
  network: {
    icon: WifiOff,
    title: "You're offline",
    message: 'Check your internet connection and try again.',
    tone: 'bg-rose-accent/10 text-rose-accent',
  },
  generic: {
    icon: AlertOctagon,
    title: 'Something went wrong',
    message: 'An unexpected error interrupted this page. Reloading usually fixes it.',
    tone: 'bg-rose-accent/10 text-rose-accent',
  },
}

/**
 * This component intentionally avoids react-router hooks (useNavigate, Link)
 * so it can render safely both inside the router (via RouteErrorElement) and
 * outside it (via the top-level ErrorBoundary, which wraps BrowserRouter).
 */
export default function ErrorPage({ variant = 'generic', title, message, error, errorId, onRetry }: ErrorPageProps) {
  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon
  const isDev = import.meta.env.DEV

  useEffect(() => {
    if (error) logError(error, { variant })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = () => {
    if (onRetry) return onRetry()
    if (variant === '401') {
      window.location.href = '/login'
      return
    }
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center dark:bg-ink-950">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.tone}`}>
        <Icon className="h-7 w-7" />
      </div>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-ink-900 dark:text-ink-50 sm:text-3xl">
        {title ?? config.title}
      </h1>
      <p className="max-w-sm text-sm text-ink-500">{message ?? config.message}</p>

      {isDev && error ? (
        <pre className="mt-2 max-w-xl overflow-auto rounded-lg border border-ink-200 bg-white p-3 text-left text-xs text-rose-accent dark:border-ink-800 dark:bg-ink-900">
          {getErrorMessage(error)}
        </pre>
      ) : null}

      {errorId ? <p className="text-xs text-ink-400">Reference: {errorId}</p> : null}

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={handleRetry} icon={<RefreshCcw className="h-4 w-4" />}>
          Try again
        </Button>
        <a href="/">
          <Button variant="secondary" icon={<Home className="h-4 w-4" />}>
            Back to home
          </Button>
        </a>
      </div>
    </div>
  )
}
