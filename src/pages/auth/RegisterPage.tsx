import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Landmark, ArrowRight } from 'lucide-react'
import { TextField } from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { registerSchema, type RegisterFormValues } from '@/utils/validation'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const toast = useToast()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: RegisterFormValues) {
    setServerError('')
    try {
      const { user, token } = await authService.register(values)
      setSession(user, token)
      toast.success('Account created — welcome to Lendly')
      navigate('/user')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-10 dark:bg-ink-950">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-[var(--font-display)] text-lg font-semibold text-ink-900 dark:text-ink-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Landmark className="h-5 w-5" />
          </span>
          Lendly
        </Link>

        <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <h1 className="font-[var(--font-display)] text-xl font-semibold text-ink-900 dark:text-ink-50">Create your account</h1>
          <p className="mt-1 text-sm text-ink-500">Start applying for loans in under a minute.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <TextField id="name" label="Full name" placeholder="Ravi Kumar" error={errors.name?.message} {...register('name')} />
            <TextField id="email" label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <TextField id="phone" label="Phone number" placeholder="9876543210" error={errors.phone?.message} {...register('phone')} />
            <div className="grid grid-cols-2 gap-4">
              <TextField id="password" label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
              <TextField id="confirmPassword" label="Confirm password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            </div>

            {serverError && <p className="text-sm font-medium text-rose-accent">{serverError}</p>}

            <Button type="submit" size="lg" loading={isSubmitting} icon={<ArrowRight className="h-4 w-4" />} className="mt-2 flex-row-reverse justify-center">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
