import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/format'

interface FieldShellProps {
  label: string
  error?: string
  htmlFor?: string
  children: React.ReactNode
  hint?: string
}

function FieldShell({ label, error, htmlFor, children, hint }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-700 dark:text-ink-200">
        {label}
      </label>
      {children}
      {hint && !error && <span className="text-xs text-ink-400">{hint}</span>}
      {error && <span className="text-xs font-medium text-rose-accent">{error}</span>}
    </div>
  )
}

const inputBase =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:bg-ink-800 dark:text-ink-50'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function TextField({ label, error, hint, id, className, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} error={error} htmlFor={id} hint={hint}>
      <input
        id={id}
        className={cn(inputBase, error ? 'border-rose-accent' : 'border-ink-200 dark:border-ink-700', className)}
        {...props}
      />
    </FieldShell>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { label: string; value: string }[]
}

export function SelectField({ label, error, options, id, className, ...props }: SelectFieldProps) {
  return (
    <FieldShell label={label} error={error} htmlFor={id}>
      <select
        id={id}
        className={cn(inputBase, 'cursor-pointer', error ? 'border-rose-accent' : 'border-ink-200 dark:border-ink-700', className)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextareaField({ label, error, id, className, ...props }: TextareaFieldProps) {
  return (
    <FieldShell label={label} error={error} htmlFor={id}>
      <textarea
        id={id}
        rows={3}
        className={cn(inputBase, 'resize-none', error ? 'border-rose-accent' : 'border-ink-200 dark:border-ink-700', className)}
        {...props}
      />
    </FieldShell>
  )
}
