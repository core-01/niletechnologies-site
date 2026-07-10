# Lendly — Loan Management System (Frontend)

A production-ready, role-based loan management frontend built with React, TypeScript, Tailwind CSS v4, React Router, and Zustand. All data currently comes from an in-memory mock API layer designed to be swapped for a real backend without touching UI code.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 (via @tailwindcss/vite — theme tokens live in src/index.css)
- React Router v6 with protected, role-based routes
- Zustand for auth, toast, and theme state
- React Hook Form + Zod for validated forms
- Recharts for dashboard charts
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

## Available scripts

| Script              | Purpose                                          |
|----------------------|--------------------------------------------------|
| `npm run dev`         | Start the Vite dev server                        |
| `npm run build`       | Type-check (`tsc -b`) then build for production  |
| `npm run preview`     | Serve the production build locally               |
| `npm run lint`        | Lint the codebase with ESLint                     |
| `npm run lint:fix`    | Lint and auto-fix what's fixable                  |
| `npm run typecheck`   | Type-check only, no emit                          |

### Demo accounts (mock login, any password with 4+ characters)

| Role  | Email               |
|-------|----------------------|
| Admin | admin@lendly.io      |
| User  | raghu@example.com    |

## Folder structure

```
src/
  components/
    ui/        # Button, Card, Table, Modal, Field, Toaster, Loader, Badge
    layout/    # Navbar, Sidebar
    charts/    # Recharts wrappers
    ErrorBoundary.tsx  # Top-level render-error safety net (see Error handling)
  layouts/     # AdminLayout, UserLayout
  pages/
    public/    # Landing, ErrorPage (shared), NotFoundPage (404 wrapper)
    auth/      # Login, Register
    admin/     # Overview, Users, Loans, Reports, Settings
    user/      # Overview, Apply, History, EMI, Profile
  routes/      # ProtectedRoute (auth + role guard), RouteErrorElement (router error boundary)
  services/    # httpClient, authService, loanService, userService (mock <-> real API switch)
  store/       # authStore, toastStore, themeStore (Zustand)
  hooks/       # useToast, usePagination
  utils/       # format.ts, validation.ts, apiError.ts, errorLogger.ts
  data/        # mockData.ts (seed users/loans/EMIs)
  types/       # shared TypeScript interfaces
```

## Error handling

Every error path in the app — a render crash, a bad route, an unmatched
path, a failed lazy-loaded chunk, or a 401/403/500/network failure from the
API layer — resolves to the same `ErrorPage` UI
(`src/pages/public/ErrorPage.tsx`), with a variant (`404`, `401`, `403`,
`500`, `network`, `generic`) that adjusts the icon/copy/recovery action.

- **`src/routes/RouteErrorElement.tsx`** — wired as `errorElement` on every
  top-level route in `App.tsx`. Catches unmatched paths, thrown loader/action
  errors, and render errors anywhere in that route's subtree (including
  failed `React.lazy()` chunk loads).
- **`src/components/ErrorBoundary.tsx`** — wraps the router itself as a last
  resort for anything outside the router's reach. Deliberately router-hook
  free so it still renders if the router fails to mount.
- **`src/utils/errorLogger.ts`** — single choke point for error
  reporting. In dev it logs to the console with a short reference id; in
  production, wire `reportError()` up to your monitoring provider (Sentry,
  Datadog, etc).
- **`src/utils/apiError.ts`** — typed `ApiError` (carries HTTP status +
  optional code) and `NetworkError`, thrown by `httpClient` so callers/UI can
  branch on status instead of parsing message strings.
- **`src/main.tsx`** — global `window.onerror` / `unhandledrejection`
  listeners catch anything that happens entirely outside React's render
  cycle (raw event handlers, timers, unawaited promises).
- A 401 response from `httpClient` dispatches a `lms:session-expired` event;
  `authStore` listens for it and clears the session automatically (see
  `src/store/authStore.ts`).

## Linting

ESLint 9 (flat config, `eslint.config.js`) with `typescript-eslint`,
`eslint-plugin-react`, and `eslint-plugin-react-hooks`. Run `npm run lint`.
The project currently lints clean.

## Connecting a real backend

1. Copy `.env.example` to `.env` and set `VITE_USE_MOCK_API=false` plus `VITE_API_BASE_URL`.
2. Implement the matching REST endpoints (/auth/login, /auth/register, /loans, /loans/:id/status, /loans/:id/emis, /users, ...) — the shapes already match what src/services/*.ts expects.
3. No component code needs to change; every page calls the service layer, never mock data directly.

## Notes

- Auth is a mock JWT flow (base64-encoded payload) stored in localStorage; replace authService internals once real auth is wired up.
- Dark mode is a class strategy toggle persisted to localStorage.
- Tables, modals, and form fields are all reusable/generic components — extend rather than duplicate them for new screens.
- Routes are code-split with `React.lazy()` per page; `vite.config.ts` also splits vendor chunks (react/router, charts, forms) to keep individual bundles small.
