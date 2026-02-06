'use client'

import React, { Component, type ReactNode } from 'react'
import { Button } from '@/components/atoms/Button'
import { WarningCircleIcon } from '@phosphor-icons/react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, resetError: () => void) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }

    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError)
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}


function DefaultErrorFallback({
  error,
  resetError,
}: {
  error: Error
  resetError: () => void
}) {
  return (
    <div className="flex min-h-100 items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-lg dark:border-red-800 dark:bg-red-950">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <WarningCircleIcon size={16} weight="bold" className="text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h2 className="mb-2 text-center text-xl font-bold text-red-900 dark:text-red-100">
            Something went wrong
          </h2>

          <p className="mb-4 text-center text-sm text-red-700 dark:text-red-300">
            {error.message || 'An unexpected error occurred'}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-4 rounded-lg bg-red-100 p-3 dark:bg-red-900">
              <summary className="cursor-pointer text-xs font-semibold text-red-800 dark:text-red-200">
                Error Details
              </summary>
              <pre className="mt-2 overflow-auto text-xs text-red-700 dark:text-red-300">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={resetError}
              variant="danger"
              size="md"
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="md"
              className="w-full text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


export function InlineError({
  error,
  onRetry,
  className,
}: {
  error: Error | string
  onRetry?: () => void
  className?: string
}) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div className={className}>
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <WarningCircleIcon size={16} weight="bold" className="text-red-600 dark:text-red-400" />
          </div>

          <div className="flex-1">
            <h3 className="mb-1 font-semibold text-red-900 dark:text-red-100">
              Error
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Try again →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export function NetworkError({
  onRetry,
  message = 'Failed to load data. Please check your connection.',
}: {
  onRetry?: () => void
  message?: string
}) {
  return (
    <div className="flex min-h-75 items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <WarningCircleIcon size={16} weight="bold" className="text-zinc-400" />
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Connection Error
        </h3>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>

        {onRetry && (
          <Button onClick={onRetry} variant="primary" size="md">
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
