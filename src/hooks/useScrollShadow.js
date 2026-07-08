import { useEffect, useState } from 'react'

function useScrollShadow(offset = 12) {
  const [hasShadow, setHasShadow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > offset)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return hasShadow
}

export default useScrollShadow
