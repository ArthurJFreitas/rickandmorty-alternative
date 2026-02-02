import { useRef, useEffect, useCallback, useState } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  isLoading?: boolean
  threshold?: number
  rootMargin?: string
  onLoadMore: () => void | Promise<void>
  enabled?: boolean
}

interface UseInfiniteScrollReturn {
  ref: React.RefObject<HTMLDivElement | null>
  isLoadingMore: boolean
}

export function useInfiniteScroll({
  hasMore,
  isLoading = false,
  threshold = 0.1,
  rootMargin = '0px',
  onLoadMore,
  enabled = true,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleLoadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore || !enabled) return

    setIsLoadingMore(true)
    try {
      await onLoadMore()
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoading, isLoadingMore, onLoadMore, enabled])

  useEffect(() => {
    if (!enabled || !hasMore) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold, rootMargin }
    )

    observerRef.current.observe(sentinel)

    return () => {
      if (observerRef.current && sentinel) {
        observerRef.current.unobserve(sentinel)
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, threshold, rootMargin, handleLoadMore, enabled])

  return {
    ref: sentinelRef,
    isLoadingMore,
  }
}