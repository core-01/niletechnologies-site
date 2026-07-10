import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorPage from '@/pages/public/ErrorPage'
import { logError } from '@/utils/errorLogger'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
}

/**
 * Top-level render-error safety net. Route/loader errors are handled
 * separately by the router's errorElement (see App.tsx + ErrorPage); this
 * boundary only catches errors thrown during rendering/effects that the
 * router itself can't see (e.g. inside a component tree already committed).
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, errorId: null }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const errorId = logError(error, { componentStack: info.componentStack })
    this.setState({ errorId })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          variant="generic"
          error={this.state.error}
          errorId={this.state.errorId ?? undefined}
          onRetry={this.handleRetry}
        />
      )
    }
    return this.props.children
  }
}
