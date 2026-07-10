import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { logError } from '@/utils/errorLogger'

// Belt-and-braces: catches errors that occur entirely outside React's render
// cycle (e.g. inside a raw event listener, a timer callback, or a rejected
// promise nobody awaited). React error boundaries can't see these, so we log
// them here instead of letting them silently disappear in production.
window.addEventListener('error', (event) => {
  logError(event.error ?? event.message, { source: 'window.onerror' })
})

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason, { source: 'unhandledrejection' })
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element (#root) not found — check index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
