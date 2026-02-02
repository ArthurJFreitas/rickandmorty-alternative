import { useState, useEffect } from 'react'

interface UseDebounceOptions {
  delay?: number
  leading?: boolean
}

export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {}
): { debouncedValue: T; isDebouncing: boolean } {
  const { delay = 300, leading = false } = options

  const [debouncedValue, setDebouncedValue] = useState<T>(leading ? value : value)
  const [isDebouncing, setIsDebouncing] = useState(false)

  useEffect(() => {
    if (leading && debouncedValue === undefined) {
      setDebouncedValue(value)
      return
    }

    setIsDebouncing(true)

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsDebouncing(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, leading, debouncedValue])

  return { debouncedValue, isDebouncing }
}
