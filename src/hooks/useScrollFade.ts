import { useEffect, RefObject } from 'react'

interface UseScrollFadeOptions {
  containerRef: RefObject<HTMLElement | null>
  className?: string
  bottomOffset?: number
  dependencies?: unknown[]
}

export function useScrollFade({
  containerRef,
  className = 'has-scroll',
  bottomOffset = 10,
  dependencies = [],
}: UseScrollFadeOptions): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const hasScroll = scrollHeight > clientHeight
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + bottomOffset

      if (hasScroll && !isAtBottom) {
        container.classList.add(className)
      } else {
        container.classList.remove(className)
      }
    }

    handleScroll()

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, className, bottomOffset, dependencies])
}
