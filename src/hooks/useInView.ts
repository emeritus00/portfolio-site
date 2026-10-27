import { useEffect, useState, type RefObject } from 'react'

/** True once (or while, if `once` is false) the element is within the viewport. */
export function useInView(ref: RefObject<Element | null>, { once = true, rootMargin = '0px', threshold = 0.25 } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, rootMargin, threshold])
  return inView
}
