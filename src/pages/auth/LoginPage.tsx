import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Landmark, ArrowRight } from 'lucide-react'
import { TextField } from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { loginSchema, type LoginFormValues } from '@/utils/validation'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const toast = useToast()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginFormValues) {
    setServerError('')
    try {
      const { user, token } = await authService.login(values)
      setSession(user, token)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`)
      navigate(user.role === 'admin' ? '/admin' : '/user')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-[var(--font-display)] text-lg font-semibold text-ink-900 dark:text-ink-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Landmark className="h-5 w-5" />
          </span>
          Lendly
        </Link>

        <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <h1 className="font-[var(--font-display)] text-xl font-semibold text-ink-900 dark:text-ink-50">Sign in to your account</h1>
          <p className="mt-1 text-sm text-ink-500">Enter your credentials to access your dashboard.</p>

          <div className="mt-4 rounded-lg bg-brand-50 px-3.5 py-2.5 text-xs text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            Demo — Admin: <strong>admin@lendly.io</strong> · User: <strong>raghu@example.com</strong> (any password, 4+ chars)
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <TextField
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && <p className="text-sm font-medium text-rose-accent">{serverError}</p>}

            <Button type="submit" size="lg" loading={isSubmitting} icon={<ArrowRight className="h-4 w-4" />} className="mt-2 flex-row-reverse justify-center">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
