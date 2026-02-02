import { useRef, useCallback, useEffect } from 'react'

interface UseAbortControllerReturn {
  signal: AbortSignal | null
  abort: (reason?: string) => void
  reset: () => AbortController
  getController: () => AbortController
}

export function useAbortController(): UseAbortControllerReturn {
  const controllerRef = useRef<AbortController | null>(null)

  const getController = useCallback((): AbortController => {
    if (!controllerRef.current || controllerRef.current.signal.aborted) {
      controllerRef.current = new AbortController()
    }
    return controllerRef.current
  }, [])

  const abort = useCallback((reason = 'Operation cancelled') => {
    if (controllerRef.current && !controllerRef.current.signal.aborted) {
      controllerRef.current.abort(reason)
    }
  }, [])

  const reset = useCallback((): AbortController => {
    abort('Resetting controller')
    controllerRef.current = new AbortController()
    return controllerRef.current
  }, [abort])

  useEffect(() => {
    getController()

    return () => {
      abort('Component unmounted')
    }
  }, [abort, getController])

  return {
    signal: controllerRef.current?.signal || null,
    abort,
    reset,
    getController,
  }
}
