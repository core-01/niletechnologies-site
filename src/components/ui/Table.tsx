import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePagination } from '@/hooks/usePagination'
import { cn } from '@/utils/format'

export interface Column<T> {
  header: string
  accessor: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
  pageSize?: number
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = 'No records found', pageSize = 6 }: DataTableProps<T>) {
  const { page, totalPages, pageItems, goTo } = usePagination(data, pageSize)

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-ink-100 dark:border-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-400 dark:bg-ink-800/60">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-4 py-3 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {pageItems.map((row) => (
              <tr key={keyExtractor(row)} className="transition-colors hover:bg-ink-50/70 dark:hover:bg-ink-800/40">
                {columns.map((col) => (
                  <td key={col.header} className={cn('px-4 py-3 text-ink-700 dark:text-ink-200', col.className)}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 disabled:opacity-40 dark:border-ink-700"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 disabled:opacity-40 dark:border-ink-700"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
