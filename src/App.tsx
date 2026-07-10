import { useEffect, lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import Toaster from '@/components/ui/Toaster'
import { PageLoader } from '@/components/ui/Loader'
import ProtectedRoute from '@/routes/ProtectedRoute'
import RouteErrorElement from '@/routes/RouteErrorElement'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

// Route-level code splitting: each page ships in its own chunk instead of
// one large bundle. If a chunk fails to load (stale deploy, flaky network),
// the error surfaces as a normal thrown error and is caught by the nearest
// errorElement, so it goes through the same ErrorPage as everything else.
const LandingPage = lazy(() => import('@/pages/public/LandingPage'))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))

const UserLayout = lazy(() => import('@/layouts/UserLayout'))
const UserOverviewPage = lazy(() => import('@/pages/user/UserOverviewPage'))
const ApplyLoanPage = lazy(() => import('@/pages/user/ApplyLoanPage'))
const LoanHistoryPage = lazy(() => import('@/pages/user/LoanHistoryPage'))
const EmiSchedulePage = lazy(() => import('@/pages/user/EmiSchedulePage'))
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'))

const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage'))
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'))
const LoanApplicationsPage = lazy(() => import('@/pages/admin/LoanApplicationsPage'))
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

// Every top-level route gets the same errorElement, so a thrown loader
// error, a render error inside that subtree, a failed lazy chunk, or an
// unmatched path all resolve to the exact same ErrorPage UI (see
// RouteErrorElement).
const router = createBrowserRouter([
  { path: '/', element: withSuspense(<LandingPage />), errorElement: <RouteErrorElement /> },
  { path: '/login', element: withSuspense(<LoginPage />), errorElement: <RouteErrorElement /> },
  { path: '/register', element: withSuspense(<RegisterPage />), errorElement: <RouteErrorElement /> },
  {
    path: '/user',
    element: withSuspense(
      <ProtectedRoute allowedRole="user">
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: withSuspense(<UserOverviewPage />) },
      { path: 'apply', element: withSuspense(<ApplyLoanPage />) },
      { path: 'history', element: withSuspense(<LoanHistoryPage />) },
      { path: 'emi', element: withSuspense(<EmiSchedulePage />) },
      { path: 'profile', element: withSuspense(<ProfilePage />) },
    ],
  },
  {
    path: '/admin',
    element: withSuspense(
      <ProtectedRoute allowedRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: withSuspense(<AdminOverviewPage />) },
      { path: 'users', element: withSuspense(<UserManagementPage />) },
      { path: 'loans', element: withSuspense(<LoanApplicationsPage />) },
      { path: 'reports', element: withSuspense(<ReportsPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
    ],
  },
  { path: '/404', element: withSuspense(<NotFoundPage />), errorElement: <RouteErrorElement /> },
  { path: '*', element: withSuspense(<NotFoundPage />), errorElement: <RouteErrorElement /> },
])

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate)
  const initTheme = useThemeStore((s) => s.init)

  useEffect(() => {
    hydrate()
    initTheme()
  }, [hydrate, initTheme])

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
    </ErrorBoundary>
  )
}
