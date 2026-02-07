'use client'

import React, { Component, type ReactNode } from 'react'
import { Button } from '@/components/atoms/Button'
import { WarningCircleIcon } from '@phosphor-icons/react'
import styles from './ErrorBoundary.module.css'
import { cn } from '@/lib/utils/style'

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
    <div className={styles.fullscreen}>
      <div className={styles.cardWrap}>
        <div className={styles.card}>
          <div className={styles.iconRow}>
            <div className={styles.iconCircle}>
              <WarningCircleIcon size={16} weight="bold" className={styles.iconDanger} />
            </div>
          </div>

          <h2 className={styles.title}>
            Something went wrong
          </h2>

          <p className={styles.message}>
            {error.message || 'An unexpected error occurred'}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className={styles.details}>
              <summary className={styles.summary}>
                Error Details
              </summary>
              <pre className={styles.stack}>
                {error.stack}
              </pre>
            </details>
          )}

          <div className={styles.actions}>
            <Button
              onClick={resetError}
              variant="danger"
              size="md"
              className={styles.fullWidth}
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="md"
              className={cn(styles.fullWidth, styles.ghostDanger)}
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
      <div className={styles.inlineCard}>
        <div className={styles.inlineRow}>
          <div>
            <WarningCircleIcon size={16} weight="bold" className={styles.iconDanger} />
          </div>

          <div>
            <h3 className={styles.inlineTitle}>
              Error
            </h3>
            <p className={styles.inlineText}>
              {errorMessage}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className={styles.inlineRetry}
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
    <div className={styles.networkWrapper}>
      <div className={styles.networkCenter}>
        <div className={styles.networkIconWrap}>
          <div className={styles.networkIcon}>
            <WarningCircleIcon size={16} weight="bold" />
          </div>
        </div>

        <h3 className={styles.networkTitle}>
          Connection Error
        </h3>
        <p className={styles.networkMessage}>
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
