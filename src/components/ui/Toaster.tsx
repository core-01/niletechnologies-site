import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'
import { cn } from '@/utils/format'

const iconMap = {
  success: <CheckCircle2 className="h-5 w-5 text-teal-accent" />,
  error: <XCircle className="h-5 w-5 text-rose-accent" />,
  info: <Info className="h-5 w-5 text-brand-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-accent" />,
}

export default function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'animate-fade-in flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-3.5 shadow-lg',
            'dark:border-ink-800 dark:bg-ink-800'
          )}
        >
          {iconMap[toast.type]}
          <p className="flex-1 text-sm text-ink-700 dark:text-ink-100">{toast.message}</p>
          <button onClick={() => dismiss(toast.id)} className="text-ink-400 hover:text-ink-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
