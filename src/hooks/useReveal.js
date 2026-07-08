import { useEffect, useRef, useState } from 'react'

function useReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, options)

    observer.observe(node)

    return () => observer.disconnect()
  }, [options])

  return { ref, isVisible }
}

export default useReveal
