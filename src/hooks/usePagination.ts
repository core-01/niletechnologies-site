import { useMemo, useState } from 'react'

export function usePagination<T>(items: T[], pageSize = 6) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  function goTo(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  return { page, totalPages, pageItems, goTo, setPage }
}
